import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { OfferManagementPanel } from './OfferManagementPanel';
import { Job, JobOffer, JOB_CATEGORIES, PAYMENT_TYPES } from '@/types/jobs-enhanced';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Briefcase, 
  DollarSign, 
  Handshake, 
  Gift, 
  Clock,
  Users,
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
  Edit
} from 'lucide-react';
import { format } from 'date-fns';

interface MyPostedJobsProps {
  onJobAction?: () => void;
}

export function MyPostedJobs({ onJobAction }: MyPostedJobsProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobOffers, setJobOffers] = useState<Record<string, JobOffer[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedJobForOffers, setSelectedJobForOffers] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMyJobs();
    fetchOffers();
  }, []);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Try Supabase first
      const { data: supabaseJobs, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('posted_by_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (supabaseJobs && supabaseJobs.length > 0) {
        setJobs(supabaseJobs as Job[]);
      } else {
        // Fallback to demo backend
        const response = await fetch('http://localhost:8000/rest/v1/jobs');
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
      console.error('Error fetching my jobs:', error);
      toast({
        title: "Error loading jobs",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOffers = async () => {
    try {
      // Try Supabase first
      const { data: supabaseOffers, error } = await supabase
        .from('job_offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (supabaseOffers) {
        const offersByJob: Record<string, JobOffer[]> = {};
        supabaseOffers.forEach(offer => {
          if (!offersByJob[offer.job_id]) {
            offersByJob[offer.job_id] = [];
          }
          offersByJob[offer.job_id].push(offer as JobOffer);
        });
        setJobOffers(offersByJob);
      } else {
        // Fallback to demo backend
        const response = await fetch('http://localhost:8000/rest/v1/job_offers');
        if (response.ok) {
          const demoOffers = await response.json();
          const offersByJob: Record<string, JobOffer[]> = {};
          demoOffers.forEach((offer: JobOffer) => {
            if (!offersByJob[offer.job_id]) {
              offersByJob[offer.job_id] = [];
            }
            offersByJob[offer.job_id].push(offer);
          });
          setJobOffers(offersByJob);
        }
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'default';
      case 'IN_PROGRESS': return 'secondary';
      case 'COMPLETED': return 'outline';
      case 'CANCELLED': return 'destructive';
      default: return 'default';
    }
  };

  const getOfferStats = (jobId: string) => {
    const offers = jobOffers[jobId] || [];
    return {
      total: offers.length,
      pending: offers.filter(o => o.status === 'PENDING').length,
      accepted: offers.filter(o => o.status === 'ACCEPTED').length,
      rejected: offers.filter(o => o.status === 'REJECTED').length,
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

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
          <Briefcase className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="font-medium mb-2">No jobs posted yet</h3>
        <p className="text-muted-foreground mb-4">
          Start by creating your first job to connect with talented makers.
        </p>
        <Button onClick={() => window.location.search = '?tab=create'}>
          Create Your First Job
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Jobs</p>
                <p className="text-2xl font-bold">{jobs.length}</p>
              </div>
              <Briefcase className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Jobs</p>
                <p className="text-2xl font-bold">
                  {jobs.filter(j => j.status === 'OPEN').length}
                </p>
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
                <p className="text-2xl font-bold">
                  {Object.values(jobOffers).reduce((sum, offers) => sum + offers.length, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">
                  {jobs.filter(j => j.status === 'COMPLETED').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.map((job) => {
          const offerStats = getOfferStats(job.id);
          
          return (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">
                        {JOB_CATEGORIES[job.category]}
                      </Badge>
                      <Badge variant={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {getPaymentIcon(job.payment_type)}
                        {PAYMENT_TYPES[job.payment_type]}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    {job.budget_usd && (
                      <div className="text-lg font-bold text-primary">
                        ${job.budget_usd}
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(job.created_at), 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {job.description && (
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {job.description}
                  </p>
                )}
                
                <Separator className="my-4" />
                
                {/* Offer Statistics */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {offerStats.total} {offerStats.total === 1 ? 'offer' : 'offers'}
                      </span>
                    </div>
                    
                    {offerStats.pending > 0 && (
                      <Badge variant="secondary">
                        {offerStats.pending} pending
                      </Badge>
                    )}
                    
                    {offerStats.accepted > 0 && (
                      <Badge variant="default">
                        {offerStats.accepted} accepted
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {offerStats.total > 0 && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedJobForOffers(job.id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Review Offers
                      </Button>
                    )}
                    
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Offer Management Panel */}
      {selectedJobForOffers && (
        <OfferManagementPanel
          jobId={selectedJobForOffers}
          offers={jobOffers[selectedJobForOffers] || []}
          onClose={() => setSelectedJobForOffers(null)}
          onOfferAction={() => {
            fetchOffers();
            onJobAction?.();
          }}
        />
      )}
    </div>
  );
}