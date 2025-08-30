import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Job, JobOffer, JOB_CATEGORIES, PAYMENT_TYPES } from '@/types/jobs-enhanced';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  History, 
  DollarSign, 
  Handshake, 
  Gift, 
  CheckCircle,
  XCircle,
  Star,
  Award,
  TrendingUp,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

interface JobWithOffers extends Job {
  offers?: JobOffer[];
}

export function JobHistory() {
  const [completedJobs, setCompletedJobs] = useState<Job[]>([]);
  const [postedJobs, setPostedJobs] = useState<JobWithOffers[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('completed');
  const { toast } = useToast();

  useEffect(() => {
    fetchJobHistory();
  }, []);

  const fetchJobHistory = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Fetch completed jobs I worked on
      const { data: myCompletedJobs } = await supabase
        .from('jobs')
        .select('*')
        .eq('claimed_by_id', user.id)
        .eq('status', 'COMPLETED')
        .order('completed_at_iso', { ascending: false });

      // Fetch jobs I posted with their offers
      const { data: myPostedJobs } = await supabase
        .from('jobs')
        .select(`
          *,
          job_offers (*)
        `)
        .eq('posted_by_id', user.id)
        .in('status', ['COMPLETED', 'CANCELLED'])
        .order('updated_at', { ascending: false });

      if (myCompletedJobs) {
        setCompletedJobs(myCompletedJobs as Job[]);
      }

      if (myPostedJobs) {
        setPostedJobs(myPostedJobs.map(job => ({
          ...job,
          offers: job.job_offers || []
        })) as JobWithOffers[]);
      }

      // Fallback to demo data if Supabase is empty
      if ((!myCompletedJobs || myCompletedJobs.length === 0) && (!myPostedJobs || myPostedJobs.length === 0)) {
        const jobsResponse = await fetch('http://localhost:8000/rest/v1/jobs');
        const offersResponse = await fetch('http://localhost:8000/rest/v1/job_offers');
        
        if (jobsResponse.ok && offersResponse.ok) {
          const demoJobs = await jobsResponse.json();
          const demoOffers = await offersResponse.json();
          
          const completedDemoJobs = demoJobs.filter((job: Job) => job.status === 'COMPLETED');
          setCompletedJobs(completedDemoJobs);
          
          const jobsWithOffers = demoJobs.map((job: Job) => ({
            ...job,
            offers: demoOffers.filter((offer: JobOffer) => offer.job_id === job.id)
          }));
          setPostedJobs(jobsWithOffers);
          
          toast({
            title: "Using demo data",
            description: "Connected to demo backend for history data.",
          });
        }
      }
    } catch (error) {
      console.error('Error fetching job history:', error);
      toast({
        title: "Error loading history",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  const calculateJobDuration = (claimedAt: string, completedAt: string) => {
    const startDate = new Date(claimedAt);
    const endDate = new Date(completedAt);
    return differenceInDays(endDate, startDate) + 1; // +1 to include the start day
  };

  const getTotalEarnings = (jobs: Job[]) => {
    return jobs.reduce((total, job) => total + (job.budget_usd || 0), 0);
  };

  const getJobsPostedStats = (jobs: JobWithOffers[]) => {
    return {
      total: jobs.length,
      completed: jobs.filter(j => j.status === 'COMPLETED').length,
      totalOffers: jobs.reduce((sum, job) => sum + (job.offers?.length || 0), 0),
      totalValue: jobs.reduce((sum, job) => sum + (job.budget_usd || 0), 0),
    };
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 bg-muted/20 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const completedStats = {
    totalJobs: completedJobs.length,
    totalEarnings: getTotalEarnings(completedJobs),
    avgDuration: completedJobs.length > 0 
      ? Math.round(
          completedJobs
            .filter(job => job.claimed_at_iso && job.completed_at_iso)
            .reduce((sum, job) => sum + calculateJobDuration(job.claimed_at_iso!, job.completed_at_iso!), 0) 
          / completedJobs.filter(job => job.claimed_at_iso && job.completed_at_iso).length
        )
      : 0
  };

  const postedStats = getJobsPostedStats(postedJobs);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="completed">Jobs I Completed</TabsTrigger>
          <TabsTrigger value="posted">Jobs I Posted</TabsTrigger>
        </TabsList>
        
        <TabsContent value="completed">
          <div className="space-y-6">
            {/* Completed Work Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Jobs Completed</p>
                      <p className="text-2xl font-bold">{completedStats.totalJobs}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Earned</p>
                      <p className="text-2xl font-bold">${completedStats.totalEarnings}</p>
                    </div>
                    <Award className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. Duration</p>
                      <p className="text-2xl font-bold">{completedStats.avgDuration} days</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                      <p className="text-2xl font-bold">100%</p>
                    </div>
                    <Star className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Completed Jobs List */}
            {completedJobs.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <History className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-2">No completed jobs yet</h3>
                <p className="text-muted-foreground">
                  Your completed work history will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedJobs.map((job) => (
                  <Card key={job.id} className="border-l-4 border-l-green-500 bg-green-50/20">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-lg">{job.title}</CardTitle>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">
                              {JOB_CATEGORIES[job.category]}
                            </Badge>
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                            <Badge variant="secondary" className="flex items-center gap-1">
                              {getPaymentIcon(job.payment_type)}
                              {PAYMENT_TYPES[job.payment_type]}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          {job.budget_usd && (
                            <div className="text-lg font-bold text-green-600">
                              ${job.budget_usd}
                            </div>
                          )}
                          <div className="text-sm text-muted-foreground">
                            Completed {format(new Date(job.completed_at_iso!), 'MMM d, yyyy')}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          {job.claimed_at_iso && job.completed_at_iso && (
                            <p className="text-sm text-muted-foreground">
                              Duration: {calculateJobDuration(job.claimed_at_iso, job.completed_at_iso)} days
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            Posted by: {job.posted_by_email}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {job.deliverable_url && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={job.deliverable_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-1" />
                                View Work
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="posted">
          <div className="space-y-6">
            {/* Posted Jobs Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Jobs Posted</p>
                      <p className="text-2xl font-bold">{postedStats.total}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold">{postedStats.completed}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Offers</p>
                      <p className="text-2xl font-bold">{postedStats.totalOffers}</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Value</p>
                      <p className="text-2xl font-bold">${postedStats.totalValue}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Posted Jobs List */}
            {postedJobs.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <History className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-2">No job history yet</h3>
                <p className="text-muted-foreground">
                  Jobs you've posted will appear here once completed.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {postedJobs.map((job) => (
                  <Card key={job.id} className="border-l-4 border-l-blue-500 bg-blue-50/20">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-lg">{job.title}</CardTitle>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">
                              {JOB_CATEGORIES[job.category]}
                            </Badge>
                            <Badge 
                              variant={job.status === 'COMPLETED' ? 'default' : 'destructive'}
                              className={job.status === 'COMPLETED' 
                                ? 'bg-green-100 text-green-800' 
                                : ''
                              }
                            >
                              {job.status === 'COMPLETED' && <CheckCircle className="w-3 h-3 mr-1" />}
                              {job.status === 'CANCELLED' && <XCircle className="w-3 h-3 mr-1" />}
                              {job.status}
                            </Badge>
                            <Badge variant="secondary">
                              {job.offers?.length || 0} offers received
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          {job.budget_usd && (
                            <div className="text-lg font-bold text-blue-600">
                              ${job.budget_usd}
                            </div>
                          )}
                          <div className="text-sm text-muted-foreground">
                            Posted {format(new Date(job.created_at), 'MMM d, yyyy')}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          {job.claimed_by_id && (
                            <p className="text-sm text-muted-foreground">
                              Completed by a community member
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            Payment: {PAYMENT_TYPES[job.payment_type]}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {job.completed_at_iso 
                            ? `Completed ${format(new Date(job.completed_at_iso), 'MMM d, yyyy')}`
                            : `Last updated ${format(new Date(job.updated_at), 'MMM d, yyyy')}`
                          }
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}