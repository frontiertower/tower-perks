import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { JobOffer, PAYMENT_TYPES, type PaymentType } from '@/types/jobs-enhanced';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  DollarSign, 
  Handshake, 
  Gift,
  Clock,
  User,
  Mail
} from 'lucide-react';
import { format } from 'date-fns';

interface OfferManagementPanelProps {
  jobId: string;
  offers: JobOffer[];
  onClose: () => void;
  onOfferAction: () => void;
}

export function OfferManagementPanel({ jobId, offers, onClose, onOfferAction }: OfferManagementPanelProps) {
  const [selectedOffer, setSelectedOffer] = useState<JobOffer | null>(null);
  const [showCounterOffer, setShowCounterOffer] = useState(false);
  const [counterOfferData, setCounterOfferData] = useState({
    amount: '',
    payment_type: 'MONETARY' as PaymentType,
    in_kind_description: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getPaymentIcon = (paymentType: string) => {
    switch (paymentType) {
      case 'MONETARY': return <DollarSign className="w-4 h-4" />;
      case 'IN_KIND': return <Handshake className="w-4 h-4" />;
      case 'HYBRID': return <Gift className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'secondary';
      case 'ACCEPTED': return 'default';
      case 'REJECTED': return 'destructive';
      case 'WITHDRAWN': return 'outline';
      default: return 'secondary';
    }
  };

  const handleAcceptOffer = async (offer: JobOffer) => {
    try {
      setLoading(true);
      
      // Update offer status to ACCEPTED
      const { error } = await supabase
        .from('job_offers')
        .update({ status: 'ACCEPTED', updated_at: new Date().toISOString() })
        .eq('id', offer.id);

      if (error) throw error;

      // Update job status to IN_PROGRESS and set claimed_by_id
      await supabase
        .from('jobs')
        .update({ 
          status: 'IN_PROGRESS',
          claimed_by_id: offer.offered_by_id,
          claimed_at_iso: new Date().toISOString()
        })
        .eq('id', jobId);

      // Reject all other offers for this job
      const otherOffers = offers.filter(o => o.id !== offer.id);
      if (otherOffers.length > 0) {
        await supabase
          .from('job_offers')
          .update({ status: 'REJECTED' })
          .in('id', otherOffers.map(o => o.id));
      }

      toast({
        title: "Offer accepted!",
        description: `You've accepted the offer from ${offer.offered_by_email}. They can now start working on your job.`,
      });

      onOfferAction();
      onClose();
    } catch (error) {
      console.error('Error accepting offer:', error);
      toast({
        title: "Error accepting offer",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectOffer = async (offer: JobOffer) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('job_offers')
        .update({ status: 'REJECTED', updated_at: new Date().toISOString() })
        .eq('id', offer.id);

      if (error) throw error;

      toast({
        title: "Offer rejected",
        description: "The offer has been rejected.",
      });

      onOfferAction();
    } catch (error) {
      console.error('Error rejecting offer:', error);
      toast({
        title: "Error rejecting offer",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCounterOffer = async (originalOffer: JobOffer) => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create a new counter-offer
      const counterOffer = {
        job_id: jobId,
        offered_by_id: user.id, // Job poster making counter-offer
        offered_by_email: user.email,
        offer_amount_usd: counterOfferData.payment_type === 'IN_KIND' ? null : parseFloat(counterOfferData.amount),
        offer_payment_type: counterOfferData.payment_type,
        offer_in_kind_description: counterOfferData.in_kind_description || null,
        message: `Counter-offer to ${originalOffer.offered_by_email}: ${counterOfferData.message}`,
        status: 'PENDING',
      };

      const { error } = await supabase
        .from('job_offers')
        .insert([counterOffer]);

      if (error) throw error;

      // Mark original offer as rejected
      await supabase
        .from('job_offers')
        .update({ status: 'REJECTED' })
        .eq('id', originalOffer.id);

      toast({
        title: "Counter-offer sent!",
        description: "Your counter-offer has been sent to the contractor.",
      });

      setShowCounterOffer(false);
      setCounterOfferData({
        amount: '',
        payment_type: 'MONETARY',
        in_kind_description: '',
        message: '',
      });
      onOfferAction();
    } catch (error) {
      console.error('Error sending counter-offer:', error);
      toast({
        title: "Error sending counter-offer",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const pendingOffers = offers.filter(o => o.status === 'PENDING');
  const acceptedOffers = offers.filter(o => o.status === 'ACCEPTED');
  const rejectedOffers = offers.filter(o => o.status === 'REJECTED');

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Job Offers</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{pendingOffers.length}</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{acceptedOffers.length}</div>
                  <div className="text-sm text-muted-foreground">Accepted</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{rejectedOffers.length}</div>
                  <div className="text-sm text-muted-foreground">Rejected</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Offers - Priority Display */}
          {pendingOffers.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                Pending Offers ({pendingOffers.length})
              </h3>
              {pendingOffers.map((offer) => (
                <Card key={offer.id} className="border-orange-200 bg-orange-50/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span className="font-medium">{offer.offered_by_email}</span>
                          <Badge variant="secondary">
                            <Clock className="w-3 h-3 mr-1" />
                            {format(new Date(offer.created_at), 'MMM d, h:mm a')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {getPaymentIcon(offer.offer_payment_type)}
                          <span>{PAYMENT_TYPES[offer.offer_payment_type]}</span>
                          {offer.offer_amount_usd && (
                            <Badge variant="outline" className="font-mono">
                              ${offer.offer_amount_usd}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {offer.message && (
                      <div className="mb-4 p-3 bg-white rounded border">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Message</span>
                        </div>
                        <p className="text-sm">{offer.message}</p>
                      </div>
                    )}
                    
                    {offer.offer_in_kind_description && (
                      <div className="mb-4 p-3 bg-blue-50 rounded border">
                        <div className="flex items-center gap-2 mb-2">
                          <Handshake className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">In-Kind Offer</span>
                        </div>
                        <p className="text-sm">{offer.offer_in_kind_description}</p>
                      </div>
                    )}
                    
                    <div className="flex gap-3 pt-4">
                      <Button 
                        onClick={() => handleAcceptOffer(offer)}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept Offer
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setSelectedOffer(offer);
                          setShowCounterOffer(true);
                        }}
                        disabled={loading}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Counter Offer
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => handleRejectOffer(offer)}
                        disabled={loading}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Other Offers */}
          {(acceptedOffers.length > 0 || rejectedOffers.length > 0) && (
            <div className="space-y-4">
              <Separator />
              <h3 className="text-lg font-semibold">Previous Offers</h3>
              {[...acceptedOffers, ...rejectedOffers].map((offer) => (
                <Card key={offer.id} className="opacity-75">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4" />
                        <span>{offer.offered_by_email}</span>
                        <Badge variant={getStatusColor(offer.status)}>
                          {offer.status}
                        </Badge>
                        {offer.offer_amount_usd && (
                          <Badge variant="outline">${offer.offer_amount_usd}</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(offer.created_at), 'MMM d, h:mm a')}
                      </div>
                    </div>
                  </CardHeader>
                  {offer.message && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{offer.message}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* No Offers */}
          {offers.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-medium mb-2">No offers yet</h3>
              <p className="text-muted-foreground">
                When contractors submit offers, they'll appear here for your review.
              </p>
            </div>
          )}
        </div>

        {/* Counter Offer Dialog */}
        {showCounterOffer && selectedOffer && (
          <Dialog open={showCounterOffer} onOpenChange={setShowCounterOffer}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Counter Offer</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded">
                  <h4 className="font-medium mb-2">Original Offer from {selectedOffer.offered_by_email}</h4>
                  <div className="flex items-center gap-2">
                    {getPaymentIcon(selectedOffer.offer_payment_type)}
                    <span>{PAYMENT_TYPES[selectedOffer.offer_payment_type]}</span>
                    {selectedOffer.offer_amount_usd && (
                      <Badge variant="outline">${selectedOffer.offer_amount_usd}</Badge>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Counter Offer Payment Type</Label>
                  <RadioGroup 
                    value={counterOfferData.payment_type} 
                    onValueChange={(value) => setCounterOfferData(prev => ({ ...prev, payment_type: value as PaymentType }))}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="MONETARY" id="counter-monetary" />
                      <Label htmlFor="counter-monetary">Cash Payment</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="IN_KIND" id="counter-in-kind" />
                      <Label htmlFor="counter-in-kind">In-Kind Trade</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="HYBRID" id="counter-hybrid" />
                      <Label htmlFor="counter-hybrid">Hybrid (Cash + Trade)</Label>
                    </div>
                  </RadioGroup>
                </div>

                {(counterOfferData.payment_type === 'MONETARY' || counterOfferData.payment_type === 'HYBRID') && (
                  <div>
                    <Label htmlFor="counter-amount">Amount (USD)</Label>
                    <Input
                      id="counter-amount"
                      type="number"
                      placeholder="Enter amount"
                      value={counterOfferData.amount}
                      onChange={(e) => setCounterOfferData(prev => ({ ...prev, amount: e.target.value }))}
                    />
                  </div>
                )}

                {(counterOfferData.payment_type === 'IN_KIND' || counterOfferData.payment_type === 'HYBRID') && (
                  <div>
                    <Label htmlFor="counter-in-kind">In-Kind Description</Label>
                    <Textarea
                      id="counter-in-kind"
                      placeholder="Describe what you're offering in trade..."
                      value={counterOfferData.in_kind_description}
                      onChange={(e) => setCounterOfferData(prev => ({ ...prev, in_kind_description: e.target.value }))}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="counter-message">Message</Label>
                  <Textarea
                    id="counter-message"
                    placeholder="Explain your counter offer..."
                    value={counterOfferData.message}
                    onChange={(e) => setCounterOfferData(prev => ({ ...prev, message: e.target.value }))}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowCounterOffer(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleCounterOffer(selectedOffer)} disabled={loading}>
                    Send Counter Offer
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}