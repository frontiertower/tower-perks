import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Job, PAYMENT_TYPES, type PaymentType, type CreateOfferInput } from '@/types/jobs-enhanced';
import { DollarSign, Handshake, Gift, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface CounterOfferDialogProps {
  job: Job;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOfferSubmitted?: () => void;
}

export function CounterOfferDialog({ job, open, onOpenChange, onOfferSubmitted }: CounterOfferDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offerData, setOfferData] = useState({
    amount: '',
    payment_type: 'MONETARY' as PaymentType,
    in_kind_description: '',
    message: '',
    email: '',
  });

  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to submit an offer.",
          variant: "destructive",
        });
        return;
      }

      // Validation
      if (offerData.payment_type === 'MONETARY' && !offerData.amount) {
        toast({
          title: "Amount required",
          description: "Please enter an offer amount.",
          variant: "destructive",
        });
        return;
      }

      if ((offerData.payment_type === 'IN_KIND' || offerData.payment_type === 'HYBRID') && !offerData.in_kind_description) {
        toast({
          title: "Description required",
          description: "Please describe what you're offering.",
          variant: "destructive",
        });
        return;
      }

      const createOfferInput: CreateOfferInput = {
        job_id: job.id,
        offered_by_id: user.id,
        offered_by_email: offerData.email,
        offer_payment_type: offerData.payment_type,
        message: offerData.message,
      };

      if (offerData.payment_type === 'MONETARY' || offerData.payment_type === 'HYBRID') {
        createOfferInput.offer_amount_usd = parseFloat(offerData.amount);
      }

      if (offerData.payment_type === 'IN_KIND' || offerData.payment_type === 'HYBRID') {
        createOfferInput.offer_in_kind_description = offerData.in_kind_description;
      }

      const { error } = await supabase
        .from('job_offers')
        .insert([createOfferInput]);

      if (error) throw error;

      toast({
        title: "Offer submitted!",
        description: "Your counter-offer has been sent to the job poster.",
      });

      // Reset form and close dialog
      setOfferData({
        amount: '',
        payment_type: 'MONETARY',
        in_kind_description: '',
        message: '',
        email: '',
      });
      onOpenChange(false);
      onOfferSubmitted?.();

    } catch (error) {
      console.error('Error submitting offer:', error);
      toast({
        title: "Error submitting offer",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Submit Counter Offer
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Summary */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-medium mb-2">{job.title}</h3>
            <div className="flex gap-2 mb-2">
              <Badge variant="outline">{job.category}</Badge>
              <Badge variant="secondary">{PAYMENT_TYPES[job.payment_type]}</Badge>
            </div>
            {job.is_standard_rate ? (
              <div className="text-sm text-muted-foreground">
                Standard rate job - you can offer alternative pricing or terms
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Original offer: {job.budget_usd ? `$${job.budget_usd}` : ''} 
                {job.in_kind_description && ` + ${job.in_kind_description}`}
              </div>
            )}
          </div>

          {/* Counter Offer Form */}
          <div className="space-y-4">
            <div>
              <Label>Your Payment Type *</Label>
              <RadioGroup 
                value={offerData.payment_type} 
                onValueChange={(value) => setOfferData(prev => ({ ...prev, payment_type: value as PaymentType }))}
                className="mt-2"
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="MONETARY" id="offer-monetary" />
                    <div className="flex-1">
                      <label htmlFor="offer-monetary" className="flex items-center gap-2 font-medium cursor-pointer">
                        <DollarSign className="w-4 h-4" />
                        {PAYMENT_TYPES.MONETARY}
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="IN_KIND" id="offer-in-kind" />
                    <div className="flex-1">
                      <label htmlFor="offer-in-kind" className="flex items-center gap-2 font-medium cursor-pointer">
                        <Handshake className="w-4 h-4" />
                        {PAYMENT_TYPES.IN_KIND}
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="HYBRID" id="offer-hybrid" />
                    <div className="flex-1">
                      <label htmlFor="offer-hybrid" className="flex items-center gap-2 font-medium cursor-pointer">
                        <Gift className="w-4 h-4" />
                        {PAYMENT_TYPES.HYBRID}
                      </label>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {(offerData.payment_type === 'MONETARY' || offerData.payment_type === 'HYBRID') && (
              <div>
                <Label htmlFor="offer-amount">Your Offer Amount (USD) *</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="offer-amount"
                    type="number"
                    placeholder="Enter your price"
                    value={offerData.amount}
                    onChange={(e) => setOfferData(prev => ({ ...prev, amount: e.target.value }))}
                    className="pl-9"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            )}

            {(offerData.payment_type === 'IN_KIND' || offerData.payment_type === 'HYBRID') && (
              <div>
                <Label htmlFor="offer-in-kind">What You're Offering *</Label>
                <Textarea
                  id="offer-in-kind"
                  placeholder="Describe what services, goods, or skills you can provide..."
                  value={offerData.in_kind_description}
                  onChange={(e) => setOfferData(prev => ({ ...prev, in_kind_description: e.target.value }))}
                  className="mt-1 min-h-[80px]"
                />
              </div>
            )}

            <div>
              <Label htmlFor="offer-message">Message (Optional)</Label>
              <Textarea
                id="offer-message"
                placeholder="Explain your offer, timeline, experience, or any questions..."
                value={offerData.message}
                onChange={(e) => setOfferData(prev => ({ ...prev, message: e.target.value }))}
                className="mt-1 min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="offer-email">Your Contact Email *</Label>
              <Input
                id="offer-email"
                type="email"
                placeholder="your@email.com"
                value={offerData.email}
                onChange={(e) => setOfferData(prev => ({ ...prev, email: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || !offerData.email.includes('@')}
            >
              {isSubmitting ? "Submitting..." : "Submit Offer"}
              <Send className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}