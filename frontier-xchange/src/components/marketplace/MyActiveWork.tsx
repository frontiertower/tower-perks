import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Job, JOB_CATEGORIES, PAYMENT_TYPES } from '@/types/jobs-enhanced';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Zap, 
  DollarSign, 
  Handshake, 
  Gift, 
  Clock,
  CheckCircle,
  Upload,
  MessageSquare,
  Calendar,
  User
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

interface MyActiveWorkProps {
  onJobAction?: () => void;
}

export function MyActiveWork({ onJobAction }: MyActiveWorkProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [completionData, setCompletionData] = useState({
    deliverable_url: '',
    completion_notes: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchActiveWork();
  }, []);

  const fetchActiveWork = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Try Supabase first
      const { data: supabaseJobs, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('claimed_by_id', user.id)
        .eq('status', 'IN_PROGRESS')
        .order('claimed_at_iso', { ascending: false });

      if (error) throw error;

      if (supabaseJobs && supabaseJobs.length > 0) {
        setJobs(supabaseJobs as Job[]);
      } else {
        // Fallback to demo backend
        const response = await fetch('http://localhost:8000/rest/v1/jobs?status=IN_PROGRESS');
        if (response.ok) {
          const demoJobs = await response.json();
          // Filter for current user (demo backend doesn't have real user filtering)
          setJobs(demoJobs as Job[]);
          toast({
            title: "Using demo data",
            description: "Connected to demo backend for job data.",
          });
        }
      }
    } catch (error) {
      console.error('Error fetching active work:', error);
      toast({
        title: "Error loading active work",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteJob = async (job: Job) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ 
          status: 'COMPLETED',
          completed_at_iso: new Date().toISOString(),
          deliverable_url: completionData.deliverable_url || null
        })
        .eq('id', job.id);

      if (error) throw error;

      toast({
        title: "Job completed!",
        description: "The job has been marked as completed.",
      });

      setShowCompleteDialog(false);
      setCompletionData({ deliverable_url: '', completion_notes: '' });
      fetchActiveWork();
      onJobAction?.();
    } catch (error) {
      console.error('Error completing job:', error);
      toast({
        title: "Error completing job",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const getPaymentIcon = (paymentType: string) => {
    switch (paymentType) {
      case 'MONETARY': return <DollarSign className="w-4 h-4" />;
      case 'IN_KIND': return <Handshake className="w-4 h-4" />;
      case 'HYBRID': return <Gift className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const calculateDaysWorking = (claimedAt: string) => {
    const claimedDate = new Date(claimedAt);
    const now = new Date();
    return differenceInDays(now, claimedDate);
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    return differenceInDays(deadlineDate, now);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-48 bg-muted/20 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
          <Zap className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="font-medium mb-2">No active work</h3>
        <p className="text-muted-foreground mb-4">
          When you accept job offers, they'll appear here to track your progress.
        </p>
        <Button onClick={() => window.location.search = '?tab=browse'}>
          Browse Available Jobs
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Work Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Jobs</p>
                <p className="text-2xl font-bold">{jobs.length}</p>
              </div>
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">
                  ${jobs.reduce((sum, job) => sum + (job.budget_usd || 0), 0)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Days Working</p>
                <p className="text-2xl font-bold">
                  {jobs.length > 0 
                    ? Math.round(jobs.reduce((sum, job) => 
                        sum + (job.claimed_at_iso ? calculateDaysWorking(job.claimed_at_iso) : 0), 0
                      ) / jobs.length)
                    : 0
                  }
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Jobs List */}
      <div className="space-y-4">
        {jobs.map((job) => {
          const daysWorking = job.claimed_at_iso ? calculateDaysWorking(job.claimed_at_iso) : 0;
          const daysUntilDeadline = job.deadline_iso ? getDaysUntilDeadline(job.deadline_iso) : null;
          
          return (
            <Card key={job.id} className="border-l-4 border-l-orange-500 bg-orange-50/30">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">
                        {JOB_CATEGORIES[job.category]}
                      </Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {getPaymentIcon(job.payment_type)}
                        {PAYMENT_TYPES[job.payment_type]}
                      </Badge>
                      <Badge variant="default" className="bg-orange-100 text-orange-800 border-orange-300">
                        Day {daysWorking + 1}
                      </Badge>
                      {daysUntilDeadline !== null && (
                        <Badge 
                          variant={daysUntilDeadline < 3 ? "destructive" : "secondary"}
                          className="flex items-center gap-1"
                        >
                          <Clock className="w-3 h-3" />
                          {daysUntilDeadline} days left
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {job.budget_usd && (
                      <div className="text-2xl font-bold text-green-600">
                        ${job.budget_usd}
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      Started {format(new Date(job.claimed_at_iso!), 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Job Description */}
                {job.description && (
                  <div className="p-4 bg-white rounded border">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Project Description
                    </h4>
                    <p className="text-sm text-muted-foreground">{job.description}</p>
                  </div>
                )}

                {/* In-Kind Description */}
                {job.in_kind_description && (
                  <div className="p-4 bg-blue-50 rounded border border-blue-200">
                    <h4 className="font-medium mb-2 flex items-center gap-2 text-blue-900">
                      <Handshake className="w-4 h-4" />
                      In-Kind Terms
                    </h4>
                    <p className="text-sm text-blue-800">{job.in_kind_description}</p>
                  </div>
                )}

                {/* Job Poster Contact */}
                <div className="p-4 bg-muted/50 rounded">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Job Posted By
                  </h4>
                  <p className="text-sm">{job.posted_by_email}</p>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Working on this job for {daysWorking} {daysWorking === 1 ? 'day' : 'days'}
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Message Client
                    </Button>
                    <Button 
                      onClick={() => {
                        setSelectedJob(job);
                        setShowCompleteDialog(true);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Mark Complete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Complete Job Dialog */}
      {showCompleteDialog && selectedJob && (
        <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Complete Job: {selectedJob.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded">
                <p className="text-sm">
                  <strong>Job Value:</strong> {selectedJob.budget_usd ? `$${selectedJob.budget_usd}` : 'In-Kind Payment'}
                </p>
                <p className="text-sm">
                  <strong>Payment Type:</strong> {PAYMENT_TYPES[selectedJob.payment_type]}
                </p>
              </div>

              <div>
                <Label htmlFor="deliverable-url">Deliverable URL (Optional)</Label>
                <Input
                  id="deliverable-url"
                  placeholder="Link to completed work, files, or documentation..."
                  value={completionData.deliverable_url}
                  onChange={(e) => setCompletionData(prev => ({ ...prev, deliverable_url: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Provide a link to your completed work (GitHub, Google Drive, portfolio, etc.)
                </p>
              </div>

              <div>
                <Label htmlFor="completion-notes">Completion Notes (Optional)</Label>
                <Textarea
                  id="completion-notes"
                  placeholder="Any final notes about the completed work..."
                  value={completionData.completion_notes}
                  onChange={(e) => setCompletionData(prev => ({ ...prev, completion_notes: e.target.value }))}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleCompleteJob(selectedJob)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Complete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}