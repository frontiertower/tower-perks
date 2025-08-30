import { useState } from 'react';
import { EmptyState } from '@/components/placeholder/EmptyState';
import { JobCard } from './JobCard';
import { Plus, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Job } from '@/api/types';

interface MyJobsListProps {
  jobs: Job[];
}

export function MyJobsList({ jobs }: MyJobsListProps) {
  const [view, setView] = useState<'active' | 'completed'>('active');
  const navigate = useNavigate();
  
  const activeJobs = jobs.filter(job => job.status === 'OPEN' || job.status === 'IN_PROGRESS');
  const completedJobs = jobs.filter(job => job.status === 'COMPLETED' || job.status === 'CANCELLED');

  const currentJobs = view === 'active' ? activeJobs : completedJobs;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setView('active')}
          className={`px-3 py-1 text-sm font-medium transition-colors ${
            view === 'active'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Active ({activeJobs.length})
        </button>
        <button
          onClick={() => setView('completed')}
          className={`px-3 py-1 text-sm font-medium transition-colors ${
            view === 'completed'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Completed ({completedJobs.length})
        </button>
      </div>

      <div className="grid gap-4">
        {currentJobs.length > 0 ? (
          currentJobs.map((job) => (
            <JobCard key={job.id || job.notionPageId} job={job} />
          ))
        ) : (
          <EmptyState
            icon={view === 'active' ? Plus : Briefcase}
            title={view === 'active' ? "No active jobs" : "No completed jobs"}
            description={
              view === 'active' 
                ? "You haven't submitted any jobs yet. Create your first job to get started."
                : "Your completed and cancelled jobs will appear here."
            }
            action={view === 'active' ? {
              label: "Submit Job",
              onClick: () => navigate('/jobs')
            } : undefined}
          />
        )}
      </div>
    </div>
  );
}