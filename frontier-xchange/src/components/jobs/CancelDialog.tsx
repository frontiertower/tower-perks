import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Job } from '@/types/job';

interface CancelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job;
  cancelType: 'claim' | 'bounty';
}

export function CancelDialog({ open, onOpenChange, job, cancelType }: CancelDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCancel = async () => {
    setIsLoading(true);
    
    try {
      // TODO: Implement actual cancellation logic when backend is ready
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: cancelType === 'claim' ? "Claim cancelled" : "Bounty cancelled",
        description: cancelType === 'claim' 
          ? "You have successfully cancelled your claim on this bounty."
          : "The bounty has been cancelled and is no longer available.",
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDialogContent = () => {
    if (cancelType === 'claim') {
      return {
        title: "Cancel your claim?",
        description: "Are you sure you want to cancel your claim on this bounty? This will make it available for other members to claim again.",
        actionText: "Cancel Claim",
      };
    } else {
      return {
        title: "Cancel this bounty?",
        description: "Are you sure you want to cancel this bounty? This action cannot be undone and the bounty will be permanently closed.",
        actionText: "Cancel Bounty",
      };
    }
  };

  const { title, description, actionText } = getDialogContent();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <AlertDialogTitle className="text-left">{title}</AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="text-left mt-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="bg-muted/50 rounded-lg p-3 my-4">
          <div className="flex items-center gap-2 text-sm">
            <XCircle className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{job.title}</span>
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            ${job.budget} USD
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Keep {cancelType === 'claim' ? 'Claim' : 'Bounty'}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {isLoading ? 'Cancelling...' : actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}