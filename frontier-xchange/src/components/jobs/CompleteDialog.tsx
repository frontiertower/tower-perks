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
import { JobsAdapter } from '@/lib/adapters/jobsAdapter';
import { useToast } from '@/hooks/use-toast';
import { type Job } from '@/types/job';
import { ExternalLink } from 'lucide-react';

interface CompleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job;
}

export function CompleteDialog({ open, onOpenChange, job }: CompleteDialogProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [notes, setNotes] = useState('');
  
  const { toast } = useToast();

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await JobsAdapter.complete(job.id, deliverableUrl || undefined);
      toast({
        title: "Job marked as complete!",
        description: "The job has been completed successfully. Payment will be processed shortly.",
      });
      onOpenChange(false);
      setDeliverableUrl('');
      setNotes('');
    } catch (error) {
      toast({
        title: "Error completing job",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mark Job Complete</DialogTitle>
          <DialogDescription>
            Provide details about the completed work. This information will be shared with the client.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">{job.title}</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Budget: <span className="font-medium text-primary">${job.budget}</span>
            </p>
          </div>

          <div>
            <Label htmlFor="deliverable-url">
              Deliverable Link (Optional)
            </Label>
            <div className="relative mt-1">
              <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="deliverable-url"
                type="url"
                placeholder="https://github.com/project or https://drive.google.com/file..."
                value={deliverableUrl}
                onChange={(e) => setDeliverableUrl(e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Link to files, repository, or documentation for this job
            </p>
          </div>

          <div>
            <Label htmlFor="completion-notes">
              Completion Notes (Optional)
            </Label>
            <Textarea
              id="completion-notes"
              placeholder="Describe what was completed, any special instructions, or additional information..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="p-3 bg-success/10 border border-success/20 rounded-md">
            <p className="text-sm text-success-dark">
              <strong>Ready to complete:</strong> This will mark the job as finished and notify the client. 
              Make sure you've provided all necessary files and information.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleComplete} disabled={isCompleting}>
            {isCompleting ? "Completing..." : "Mark Complete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}