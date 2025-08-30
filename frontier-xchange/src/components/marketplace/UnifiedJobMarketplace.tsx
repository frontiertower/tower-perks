import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RealtimeActivityBanner } from '@/components/jobs/RealtimeActivityBanner';
import { RealtimeTestPanel } from '@/components/jobs/RealtimeTestPanel';
import { EnhancedJobWizard } from '@/components/jobs/EnhancedJobWizard';
import { MarketplaceJobsList } from './MarketplaceJobsList';
import { MyPostedJobs } from './MyPostedJobs';
import { MyOffers } from './MyOffers';
import { MyActiveWork } from './MyActiveWork';
import { JobHistory } from './JobHistory';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Briefcase, 
  HandHeart, 
  Zap, 
  History,
  TrendingUp
} from 'lucide-react';

export function UnifiedJobMarketplace() {
  const [activeTab, setActiveTab] = useState('browse');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Check URL params to set initial tab
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tab = searchParams.get('tab');
    if (tab && ['browse', 'create', 'posted', 'offers', 'active', 'history'].includes(tab)) {
      setActiveTab(tab);
    }
  }, []);

  const handleJobCreated = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('browse'); // Switch to browse after creating
  };

  const handleJobAction = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Real-time Activity Banner */}
      <RealtimeActivityBanner />
      
      {/* Development Testing Panel */}
      {process.env.NODE_ENV === 'development' && (
        <RealtimeTestPanel />
      )}

      {/* Main Marketplace Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 h-12">
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Browse Jobs
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Job
          </TabsTrigger>
          <TabsTrigger value="posted" className="flex items-center gap-2 relative">
            <Briefcase className="w-4 h-4" />
            My Posted Jobs
            <Badge variant="secondary" className="ml-1 text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="offers" className="flex items-center gap-2">
            <HandHeart className="w-4 h-4" />
            My Offers
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Active Work
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            History
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="browse">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Job Marketplace</h2>
                  <p className="text-muted-foreground">
                    Discover opportunities and connect with the makerspace community
                  </p>
                </div>
                <Button 
                  onClick={() => setActiveTab('create')}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Post New Job
                </Button>
              </div>
              <MarketplaceJobsList 
                key={refreshTrigger} 
                onJobAction={handleJobAction}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="create">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">Create New Job</h2>
                <p className="text-muted-foreground">
                  Post a job with standard rates or custom bounty terms
                </p>
              </div>
              <EnhancedJobWizard onJobCreated={handleJobCreated} />
            </div>
          </TabsContent>
          
          <TabsContent value="posted">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">My Posted Jobs</h2>
                <p className="text-muted-foreground">
                  Manage jobs you've posted and review offers from contractors
                </p>
              </div>
              <MyPostedJobs 
                key={refreshTrigger} 
                onJobAction={handleJobAction}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="offers">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">My Offers</h2>
                <p className="text-muted-foreground">
                  Track offers you've submitted and manage negotiations
                </p>
              </div>
              <MyOffers 
                key={refreshTrigger} 
                onJobAction={handleJobAction}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="active">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">Active Work</h2>
                <p className="text-muted-foreground">
                  Jobs you're currently working on
                </p>
              </div>
              <MyActiveWork 
                key={refreshTrigger} 
                onJobAction={handleJobAction}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">Job History</h2>
                <p className="text-muted-foreground">
                  Completed jobs and past activity
                </p>
              </div>
              <JobHistory 
                key={refreshTrigger}
              />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}