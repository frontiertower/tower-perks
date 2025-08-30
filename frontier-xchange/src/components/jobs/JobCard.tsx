import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ClaimDialog } from './ClaimDialog';
import { CompleteDialog } from './CompleteDialog';
import { CancelDialog } from './CancelDialog';
import { useUserStore } from '@/store/userStore';
import { JOB_CATEGORIES, type Job } from '@/types/job';
import { Calendar, DollarSign, Clock, User, ExternalLink, XCircle, Ban } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const [showClaimDialog, setShowClaimDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelType, setCancelType] = useState<'claim' | 'bounty'>('bounty');
  
  const { role, userId } = useUserStore();
  
  const isMyJob = job.postedById === userId;
  const isMyClaimedJob = job.claimedById === userId;
  const canClaim = role === 'member' && job.status === 'OPEN' && !isMyJob;
  const canComplete = role === 'member' && job.status === 'IN_PROGRESS' && isMyClaimedJob;
  
  // Can cancel bounty if I posted it and it's open
  const canCancelBounty = isMyJob && job.status === 'OPEN';
  // Can cancel claim if I claimed it and it's in progress
  const canCancelClaim = isMyClaimedJob && job.status === 'IN_PROGRESS';

  const handleCancelClick = (type: 'claim' | 'bounty') => {
    setCancelType(type);
    setShowCancelDialog(true);
  };

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'OPEN': return 'bg-primary/20 text-primary border-primary/30';
      case 'IN_PROGRESS': return 'bg-warning/20 text-warning-dark border-warning/30';
      case 'COMPLETED': return 'bg-success/20 text-success-dark border-success/30';
      case 'CANCELLED': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getCategoryColor = (category: Job['category']) => {
    switch (category) {
      case '3D_PRINTING': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'LASER_CUTTING': return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      case 'DESIGN_HELP': return 'bg-purple-500/20 text-purple-700 border-purple-500/30';
      case 'CONSULTATION': return 'bg-green-500/20 text-green-700 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const formatDeadline = (deadlineISO?: string) => {
    if (!deadlineISO) return null;
    const deadline = new Date(deadlineISO);
    const now = new Date();
    const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return 'Overdue';
    if (daysLeft === 0) return 'Due today';
    if (daysLeft === 1) return 'Due tomorrow';
    return `Due in ${daysLeft} days`;
  };

  return (
    <>
      <Card className="group hover-lift transition-all duration-300 hover:shadow-green/10">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors mb-2 line-clamp-1">
                {job.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className={getCategoryColor(job.category)}>
                  {JOB_CATEGORIES[job.category]}
                </Badge>
                <Badge className={getStatusColor(job.status)}>
                  {job.status.replace('_', ' ')}
                </Badge>
                {job.deadlineISO && (
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDeadline(job.deadlineISO)}
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">${job.budget}</div>
              <div className="text-xs text-muted-foreground">USD</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-muted-foreground mb-4 line-clamp-2">
            {job.description}
          </p>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDistanceToNow(new Date(job.createdAtISO), { addSuffix: true })}</span>
              </div>
              {job.postedByEmail && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span className="truncate max-w-[120px]">{job.postedByEmail}</span>
                </div>
              )}
            </div>
          </div>

          {job.claimedById && job.status === 'IN_PROGRESS' && (
            <div className="flex items-center gap-2 p-2 bg-warning/10 rounded-md mb-4">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs">
                  {job.claimedById.split('-')[1]?.charAt(0)?.toUpperCase() || 'M'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-warning-dark">
                Claimed by {isMyClaimedJob ? 'you' : 'member'}
              </span>
            </div>
          )}

          {job.deliverableUrl && job.status === 'COMPLETED' && (
            <div className="p-3 bg-success/10 rounded-md mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-success-dark">Completed</span>
                <Button variant="outline" size="sm" asChild>
                  <a href={job.deliverableUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View Result
                  </a>
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            {canClaim && (
              <Button onClick={() => setShowClaimDialog(true)} className="flex-1">
                Claim Job
              </Button>
            )}
            
            {canComplete && (
              <Button onClick={() => setShowCompleteDialog(true)} className="flex-1">
                Mark Complete
              </Button>
            )}
            
            {job.status === 'OPEN' && !canClaim && !isMyJob && (
              <Button variant="outline" disabled className="flex-1">
                Open
              </Button>
            )}
            
            {job.claimedById && !canComplete && job.status === 'IN_PROGRESS' && (
              <Button variant="outline" disabled className="flex-1">
                {isMyClaimedJob ? 'In Progress' : 'Claimed'}
              </Button>
            )}
            
            {canCancelBounty && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => handleCancelClick('bounty')}
                className="bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/20 hover:border-destructive"
              >
                <Ban className="w-4 h-4 mr-1" />
                Cancel Bounty
              </Button>
            )}
            
            {canCancelClaim && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleCancelClick('claim')}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 hover:border-destructive/40"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Cancel Claim
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <ClaimDialog
        open={showClaimDialog}
        onOpenChange={setShowClaimDialog}
        job={job}
      />
      
      <CompleteDialog
        open={showCompleteDialog}
        onOpenChange={setShowCompleteDialog}
        job={job}
      />
      
      <CancelDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        job={job}
        cancelType={cancelType}
      />
    </>
  );
}