import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JobWizard } from './JobWizard';
import { MyJobsList } from './MyJobsList';
import { Badge } from '@/components/ui/badge';
import { Plus, Briefcase } from 'lucide-react';
import { useRole } from '@/store/useRole';
import { useMyJobs } from '@/api/queries';

export function JobTabs() {
  const [activeTab, setActiveTab] = useState('submit');
  const { posterId } = useRole();
  const { data: myJobs = [] } = useMyJobs(posterId);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Jobs</h1>
            <p className="text-muted-foreground">Submit projects and track your requests</p>
          </div>
          <TabsList className="glass border border-border-bright">
            <TabsTrigger value="submit" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Submit Job
            </TabsTrigger>
            <TabsTrigger value="my-jobs" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              My Jobs
              {myJobs.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {myJobs.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="submit" className="animate-slide-in-up">
          <JobWizard />
        </TabsContent>

        <TabsContent value="my-jobs" className="animate-slide-in-up">
          <MyJobsList jobs={myJobs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}