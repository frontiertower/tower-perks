import { useState, useEffect } from 'react';
import { Clock, DollarSign, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { CompleteBountyDialog } from './CompleteBountyDialog';

interface JobData {
  id: string;
  title: string;
  category: string;
  description?: string;
  budget_usd?: number;
  currency: string;
  deadline_iso?: string;
  status: string;
  payment_type: 'MONETARY' | 'IN_KIND' | 'HYBRID';
  in_kind_description?: string;
  claimed_at_iso?: string;
  posted_by_id: string;
  claimed_by_id?: string;
}

export function ActiveBounties() {
  const [activeBounties, setActiveBounties] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchActiveBounties = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('claimed_by_id', user.id)
        .eq('status', 'IN_PROGRESS')
        .order('deadline_iso', { ascending: true, nullsFirst: false });

      if (error) throw error;
      
      setActiveBounties(data || []);
    } catch (error) {
      console.error('Error fetching active bounties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveBounties();

    // Listen for job completion events
    const handleJobUpdate = () => {
      fetchActiveBounties();
    };

    window.addEventListener('job-updated', handleJobUpdate);
    return () => window.removeEventListener('job-updated', handleJobUpdate);
  }, [user]);

  const handleComplete = (job: JobData) => {
    setSelectedJob(job);
    setCompleteDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'bg-warning text-warning-foreground';
      case 'COMPLETED':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getPaymentDisplay = (job: JobData) => {
    switch (job.payment_type) {
      case 'MONETARY':
        return `$${job.budget_usd} ${job.currency}`;
      case 'IN_KIND':
        return job.in_kind_description || 'Trade/Barter';
      case 'HYBRID':
        return `$${job.budget_usd} + Trade`;
      default:
        return 'Payment TBD';
    }
  };

  const isOverdue = (deadline?: string) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm border border-border rounded-xl shadow-sm p-4 h-fit">
        <h3 className="text-base font-semibold text-foreground mb-3">My Active Bounties</h3>
        <div className="animate-pulse">
          <div className="h-20 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/90 backdrop-blur-sm border border-border rounded-xl shadow-sm p-4 h-fit">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-foreground">My Active Bounties</h3>
          <Badge variant="secondary" className="text-xs">
            {activeBounties.length} active
          </Badge>
        </div>
        
        {activeBounties.length === 0 ? (
          <div className="text-center py-8 px-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mb-3">No active bounties</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/bounties')}
              className="text-xs"
            >
              Browse Available Bounties
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {activeBounties.map((bounty, index) => (
              <div 
                key={bounty.id}
                className="p-3 bg-gradient-to-r from-gray-50/80 to-white/80 border border-gray-200/60 rounded-lg hover:border-primary/30 hover:shadow-sm transition-all duration-300 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
                      {bounty.title}
                    </h4>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {bounty.category.replace('_', ' ')}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(bounty.status)}`}>
                        In Progress
                      </Badge>
                    </div>
                  </div>
                  {bounty.deadline_iso && isOverdue(bounty.deadline_iso) && (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-primary" />
                    <span>{getPaymentDisplay(bounty)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-primary" />
                    <span>
                      {bounty.claimed_at_iso 
                        ? formatDistanceToNow(new Date(bounty.claimed_at_iso), { addSuffix: true })
                        : 'Just claimed'
                      }
                    </span>
                  </div>
                </div>

                {bounty.deadline_iso && (
                  <div className="flex items-center gap-1 text-xs mb-3">
                    <Calendar className="h-3 w-3 text-primary" />
                    <span className={isOverdue(bounty.deadline_iso) ? 'text-destructive font-medium' : 'text-muted-foreground'}>
                      Due {formatDistanceToNow(new Date(bounty.deadline_iso), { addSuffix: true })}
                    </span>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 h-7 text-xs"
                    onClick={() => handleComplete(bounty)}
                  >
                    Mark Complete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs px-3"
                    onClick={() => navigate(`/bounties`)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeBounties.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-primary hover:text-primary/80"
              onClick={() => navigate('/bounties')}
            >
              View All Bounties →
            </Button>
          </div>
        )}
      </div>

      {selectedJob && (
        <CompleteBountyDialog
          open={completeDialogOpen}
          onOpenChange={setCompleteDialogOpen}
          job={selectedJob}
        />
      )}
    </>
  );
}