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
import { Badge } from '@/components/ui/badge';
import { JobsAdapter } from '@/lib/adapters/jobsAdapter';
import { useUserStore } from '@/store/userStore';
import { useToast } from '@/hooks/use-toast';
import { JOB_CATEGORIES, type Job } from '@/types/job';
import { DollarSign, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface ClaimDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job;
}

export function ClaimDialog({ open, onOpenChange, job }: ClaimDialogProps) {
  const [isClaiming, setIsClaiming] = useState(false);
  const { userId } = useUserStore();
  const { toast } = useToast();

  const handleClaim = async () => {
    setIsClaiming(true);
    try {
      await JobsAdapter.claim(job.id, userId);
      toast({
        title: "Job claimed successfully!",
        description: "You can now start working on this job. Mark it complete when you're done.",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error claiming job",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Claim Job</DialogTitle>
          <DialogDescription>
            Review the job details and confirm if you want to claim this job.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">{job.title}</h4>
            <div className="flex gap-2 mb-3">
              <Badge variant="outline">
                {JOB_CATEGORIES[job.category]}
              </Badge>
              <Badge className="bg-primary/20 text-primary border-primary/30">
                {job.status}
              </Badge>
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Budget</span>
              <div className="flex items-center gap-1 font-bold text-primary">
                <DollarSign className="w-4 h-4" />
                {job.budget}
              </div>
            </div>

            {job.deadlineISO && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Deadline</span>
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(job.deadlineISO), 'PPP')}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Posted</span>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {format(new Date(job.createdAtISO), 'PPP')}
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-medium mb-2">Description</h5>
            <p className="text-sm text-muted-foreground">
              {job.description}
            </p>
          </div>

          <div className="p-3 bg-info/10 border border-info/20 rounded-md">
            <p className="text-sm text-info-dark">
              <strong>Note:</strong> By claiming this job, you commit to completing it within the specified timeframe. 
              Payment will be processed once the job is marked as complete.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleClaim} disabled={isClaiming}>
            {isClaiming ? "Claiming..." : "Claim Job"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}