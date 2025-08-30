import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { JobOffer, Job, PAYMENT_TYPES } from '@/types/jobs-enhanced';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  HandHeart, 
  DollarSign, 
  Handshake, 
  Gift, 
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';

interface MyOffersProps {
  onJobAction?: () => void;
}

interface OfferWithJob extends JobOffer {
  job?: Job;
}

export function MyOffers({ onJobAction }: MyOffersProps) {
  const [offers, setOffers] = useState<OfferWithJob[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMyOffers();
  }, []);

  const fetchMyOffers = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Try Supabase first
      const { data: supabaseOffers, error } = await supabase
        .from('job_offers')
        .select(`
          *,
          job:jobs(*)
        `)
        .eq('offered_by_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (supabaseOffers && supabaseOffers.length > 0) {
        setOffers(supabaseOffers.map(offer => ({
          ...offer,
          job: offer.job as Job
        })) as OfferWithJob[]);
      } else {
        // Fallback to demo backend
        const offersResponse = await fetch('http://localhost:8000/rest/v1/job_offers');
        const jobsResponse = await fetch('http://localhost:8000/rest/v1/jobs');
        
        if (offersResponse.ok && jobsResponse.ok) {
          const demoOffers = await offersResponse.json();
          const demoJobs = await jobsResponse.json();
          
          // Create a map of jobs by ID for easy lookup
          const jobsMap = new Map(demoJobs.map((job: Job) => [job.id, job]));
          
          // Combine offers with job data
          const offersWithJobs = demoOffers.map((offer: JobOffer) => ({
            ...offer,
            job: jobsMap.get(offer.job_id)
          }));
          
          setOffers(offersWithJobs as OfferWithJob[]);
          toast({
            title: "Using demo data",
            description: "Connected to demo backend for offer data.",
          });
        }
      }
    } catch (error) {
      console.error('Error fetching my offers:', error);
      toast({
        title: "Error loading offers",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawOffer = async (offerId: string) => {
    try {
      const { error } = await supabase
        .from('job_offers')
        .update({ status: 'WITHDRAWN', updated_at: new Date().toISOString() })
        .eq('id', offerId);

      if (error) throw error;

      toast({
        title: "Offer withdrawn",
        description: "Your offer has been withdrawn.",
      });

      fetchMyOffers();
      onJobAction?.();
    } catch (error) {
      console.error('Error withdrawing offer:', error);
      toast({
        title: "Error withdrawing offer",
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'secondary';
      case 'ACCEPTED': return 'default';
      case 'REJECTED': return 'destructive';
      case 'WITHDRAWN': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4" />;
      case 'ACCEPTED': return <CheckCircle className="w-4 h-4" />;
      case 'REJECTED': return <XCircle className="w-4 h-4" />;
      case 'WITHDRAWN': return <RefreshCw className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const stats = {
    total: offers.length,
    pending: offers.filter(o => o.status === 'PENDING').length,
    accepted: offers.filter(o => o.status === 'ACCEPTED').length,
    rejected: offers.filter(o => o.status === 'REJECTED').length,
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

  if (offers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
          <HandHeart className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="font-medium mb-2">No offers submitted yet</h3>
        <p className="text-muted-foreground mb-4">
          Browse available jobs and submit offers to start earning.
        </p>
        <Button onClick={() => window.location.search = '?tab=browse'}>
          Browse Jobs
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
                <p className="text-sm text-muted-foreground">Total Offers</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <HandHeart className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Accepted</p>
                <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">
                  {stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Offers List */}
      <div className="space-y-4">
        {offers.map((offer) => (
          <Card key={offer.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg">
                    {offer.job?.title || 'Job Title Unavailable'}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={getStatusColor(offer.status)} className="flex items-center gap-1">
                      {getStatusIcon(offer.status)}
                      {offer.status}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getPaymentIcon(offer.offer_payment_type)}
                      {PAYMENT_TYPES[offer.offer_payment_type]}
                    </Badge>
                    {offer.offer_amount_usd && (
                      <Badge variant="secondary" className="font-mono">
                        ${offer.offer_amount_usd}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    Submitted {format(new Date(offer.created_at), 'MMM d, yyyy')}
                  </div>
                  {offer.job?.budget_usd && (
                    <div className="text-sm text-muted-foreground">
                      Job Budget: ${offer.job.budget_usd}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Job Description */}
              {offer.job?.description && (
                <div className="p-3 bg-muted/50 rounded">
                  <h4 className="text-sm font-medium mb-1">Job Description</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {offer.job.description}
                  </p>
                </div>
              )}

              {/* My Offer Details */}
              {offer.message && (
                <div className="p-3 bg-blue-50 rounded border-blue-200 border">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <h4 className="text-sm font-medium text-blue-900">Your Message</h4>
                  </div>
                  <p className="text-sm text-blue-800">{offer.message}</p>
                </div>
              )}

              {offer.offer_in_kind_description && (
                <div className="p-3 bg-green-50 rounded border-green-200 border">
                  <div className="flex items-center gap-2 mb-2">
                    <Handshake className="w-4 h-4 text-green-600" />
                    <h4 className="text-sm font-medium text-green-900">In-Kind Offer</h4>
                  </div>
                  <p className="text-sm text-green-800">{offer.offer_in_kind_description}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Last updated: {format(new Date(offer.updated_at), 'MMM d, h:mm a')}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.search = `?tab=browse&job=${offer.job_id}`}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View Job
                  </Button>
                  
                  {offer.status === 'PENDING' && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleWithdrawOffer(offer.id)}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Withdraw
                    </Button>
                  )}
                  
                  {offer.status === 'ACCEPTED' && (
                    <Button 
                      size="sm"
                      onClick={() => window.location.search = '?tab=active'}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Go to Work
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}