import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JobFilters } from '@/components/jobs/JobFilters';
import { JobCard } from '@/components/jobs/JobCard';
import { EmptyState } from '@/components/placeholder/EmptyState';
import { useJobsStore } from '@/store/jobsStore';
import { useUserStore } from '@/store/userStore';
import { Badge } from '@/components/ui/badge';
import { type JobFilters as Filters } from '@/types/job';
import { Search, Target, Award } from 'lucide-react';

export function BountyTabs() {
  const [activeTab, setActiveTab] = useState('browse');
  const [myBountiesView, setMyBountiesView] = useState<'active' | 'completed'>('active');
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    statuses: [],
    budgetMin: undefined,
    budgetMax: undefined,
    dueSoon: false,
  });

  const { jobs, getJobsByClaimerId } = useJobsStore();
  const { userId } = useUserStore();
  
  const myClaimedJobs = getJobsByClaimerId(userId);
  const activeMyBounties = myClaimedJobs.filter(job => 
    job.status === 'IN_PROGRESS'
  );
  const completedMyBounties = myClaimedJobs.filter(job => 
    job.status === 'COMPLETED'
  );

  // Filter jobs for browse tab
  const filteredJobs = jobs.filter(job => {
    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(job.category)) {
      return false;
    }
    
    // Status filter
    if (filters.statuses.length > 0 && !filters.statuses.includes(job.status)) {
      return false;
    }
    
    // Budget filter
    if (filters.budgetMin && job.budget < filters.budgetMin) {
      return false;
    }
    if (filters.budgetMax && job.budget > filters.budgetMax) {
      return false;
    }
    
    // Due soon filter
    if (filters.dueSoon && job.deadlineISO) {
      const deadline = new Date(job.deadlineISO);
      const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      if (deadline > sevenDaysFromNow) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Bounties</h1>
            <p className="text-muted-foreground">Browse and claim available jobs from the community</p>
          </div>
          <TabsList className="glass border border-border-bright">
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Browse Bounties
              <Badge variant="secondary" className="ml-1 text-xs">
                {filteredJobs.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="my-bounties" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              My Bounties
              {myClaimedJobs.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {myClaimedJobs.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="browse" className="animate-slide-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <JobFilters filters={filters} onFiltersChange={setFilters} />
            </div>
            
            <div className="lg:col-span-3">
              {filteredJobs.length > 0 ? (
                <div className="grid gap-4">
                  {filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Search}
                  title="No bounties found"
                  description="Try adjusting your filters or check back later for new opportunities."
                />
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="my-bounties" className="animate-slide-in-up">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMyBountiesView('active')}
                className={`px-3 py-1 text-sm font-medium transition-colors ${
                  myBountiesView === 'active'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Active ({activeMyBounties.length})
              </button>
              <button
                onClick={() => setMyBountiesView('completed')}
                className={`px-3 py-1 text-sm font-medium transition-colors ${
                  myBountiesView === 'completed'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Completed ({completedMyBounties.length})
              </button>
            </div>

            <div className="grid gap-4">
              {myBountiesView === 'active' ? (
                activeMyBounties.length > 0 ? (
                  activeMyBounties.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))
                ) : (
                  <EmptyState
                    icon={Target}
                    title="No active bounties"
                    description="You haven't claimed any jobs yet. Browse available bounties to get started."
                    action={{
                      label: "Browse Bounties",
                      onClick: () => setActiveTab('browse')
                    }}
                  />
                )
              ) : (
                completedMyBounties.length > 0 ? (
                  completedMyBounties.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))
                ) : (
                  <EmptyState
                    icon={Award}
                    title="No completed bounties"
                    description="Your completed bounties will appear here."
                  />
                )
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}