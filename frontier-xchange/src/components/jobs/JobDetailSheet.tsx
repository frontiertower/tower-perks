import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Clock, User, ExternalLink, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import type { Job } from '@/api/types';
import { JOB_CATEGORIES } from '@/api/types';

interface JobDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job;
}

export function JobDetailSheet({ open, onOpenChange, job }: JobDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-xl">{job.title}</SheetTitle>
          <SheetDescription>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge>{JOB_CATEGORIES[job.category]}</Badge>
              <Badge variant="secondary">{job.status.replace('_', ' ')}</Badge>
              {job.visibility === 'PRIVATE' && (
                <Badge variant="outline">Private</Badge>
              )}
            </div>
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Budget */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-muted-foreground" />
              <span className="font-medium">Budget</span>
            </div>
            <span className="text-lg font-semibold">${job.budgetUSD || job.budget}</span>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Timeline
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span>{format(new Date(job.createdAtISO), 'PPp')}</span>
              </div>
              {job.deadlineISO && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deadline:</span>
                  <span>{format(new Date(job.deadlineISO), 'PPp')}</span>
                </div>
              )}
              {job.claimedAtISO && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Claimed:</span>
                  <span>{format(new Date(job.claimedAtISO), 'PPp')}</span>
                </div>
              )}
              {job.paidAtISO && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid:</span>
                  <span>{format(new Date(job.paidAtISO), 'PPp')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h4 className="font-medium">Description</h4>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{job.description}</p>
            </div>
          </div>

          {/* Status Info */}
          {job.claimedById && (
            <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <User className="w-4 h-4 mr-2 text-blue-600" />
              <span className="text-sm">
                This job has been claimed by a maker
              </span>
            </div>
          )}

          {/* Deliverable */}
          {job.status === 'COMPLETED' && job.deliverableUrl && (
            <div className="space-y-3">
              <h4 className="font-medium">Deliverable</h4>
              <a 
                href={job.deliverableUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:underline"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Completed Work
              </a>
            </div>
          )}

          {/* Payment Status */}
          {job.paymentStatus && (
            <div className="space-y-3">
              <h4 className="font-medium">Payment</h4>
              <Badge 
                variant={job.paymentStatus === 'PAID' ? 'default' : 'secondary'}
              >
                {job.paymentStatus}
              </Badge>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}