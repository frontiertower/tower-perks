import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface JobData {
  id: string;
  title: string;
  category: string;
  budget_usd?: number;
  currency: string;
  payment_type: string;
  in_kind_description?: string;
}

interface CompleteBountyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: JobData;
}

export function CompleteBountyDialog({ open, onOpenChange, job }: CompleteBountyDialogProps) {
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    
    try {
      const { error } = await supabase
        .from('jobs')
        .update({
          status: 'COMPLETED',
          completed_at_iso: new Date().toISOString(),
          deliverable_url: deliverableUrl || null
        })
        .eq('id', job.id);

      if (error) throw error;

      toast.success('Job marked as completed successfully!');
      onOpenChange(false);
      
      // Reset form
      setDeliverableUrl('');
      setNotes('');
      
      // Trigger refresh by dispatching a custom event
      window.dispatchEvent(new CustomEvent('job-updated'));
      
    } catch (error) {
      console.error('Error completing job:', error);
      toast.error('Failed to complete job. Please try again.');
    } finally {
      setIsCompleting(false);
    }
  };

  const getPaymentDisplay = (job: JobData) => {
    switch (job.payment_type) {
      case 'MONETARY':
        return `$${job.budget_usd} ${job.currency}`;
      case 'IN_KIND':
        return job.in_kind_description || 'Trade/Barter';
      case 'HYBRID':
        return `$${job.budget_usd} + Trade`;
      default:
        return 'Payment TBD';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Bounty</DialogTitle>
          <DialogDescription>
            Mark this bounty as completed and provide deliverable details.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm mb-2">{job.title}</h4>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {job.category.replace('_', ' ')}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {getPaymentDisplay(job)}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deliverable-url">Deliverable URL (Optional)</Label>
            <Input
              id="deliverable-url"
              placeholder="https://drive.google.com/file/..."
              value={deliverableUrl}
              onChange={(e) => setDeliverableUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Link to files, photos, or documentation of completed work
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Completion Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional details about the completed work..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              📋 Once marked complete, the job poster will be notified and can review your work.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleComplete} 
            disabled={isCompleting}
            className="bg-primary hover:bg-primary/90"
          >
            {isCompleting ? 'Completing...' : 'Mark Complete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}