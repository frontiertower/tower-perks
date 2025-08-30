import { EmptyState } from '@/components/placeholder/EmptyState';
import { JobCard } from '../jobs/JobCard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Calendar, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import type { Job } from '@/api/types';

interface BountyGridProps {
  jobs: Job[];
  isLoading: boolean;
  error?: Error | null;
}

export function BountyGrid({ jobs, isLoading, error }: BountyGridProps) {
  const navigate = useNavigate();

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800 dark:text-red-200">
          Failed to load bounties. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">Loading bounties...</p>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title="No bounties found"
        description="No open bounties match your current filters. Try adjusting your search or check back later."
        action={{
          label: "View Events",
          onClick: () => navigate('/events')
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {jobs.length} {jobs.length === 1 ? 'bounty' : 'bounties'} found
        </p>
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id || job.notionPageId} job={job} />
        ))}
      </div>
    </div>
  );
}