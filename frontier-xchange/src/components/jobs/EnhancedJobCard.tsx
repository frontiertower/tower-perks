import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CounterOfferDialog } from './CounterOfferDialog';
import { Job, JOB_CATEGORIES, PAYMENT_TYPES, STANDARD_RATES } from '@/types/jobs-enhanced';
import { Clock, DollarSign, Handshake, Gift, Send, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface EnhancedJobCardProps {
  job: Job;
  onOfferSubmitted?: () => void;
}

export function EnhancedJobCard({ job, onOfferSubmitted }: EnhancedJobCardProps) {
  const [showCounterOffer, setShowCounterOffer] = useState(false);

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

  return (
    <>
      <Card className="glass border-border-bright hover-lift transition-all duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg line-clamp-2">{job.title}</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  {JOB_CATEGORIES[job.category]}
                </Badge>
                <Badge variant={getStatusColor(job.status)}>
                  {job.status === 'OPEN' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {job.status}
                </Badge>
                {job.is_standard_rate && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    Standard Rate
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {/* Payment Information */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {getPaymentIcon(job.payment_type)}
              <span className="font-medium">{PAYMENT_TYPES[job.payment_type]}</span>
            </div>
            
            {job.is_standard_rate && job.service_type && (
              <div className="text-lg font-bold text-primary">
                ${STANDARD_RATES[job.service_type as keyof typeof STANDARD_RATES]?.base_rate} base rate
              </div>
            )}
            
            {!job.is_standard_rate && (
              <div className="space-y-1">
                {job.budget_usd && (
                  <div className="text-lg font-bold text-primary">${job.budget_usd}</div>
                )}
                {job.in_kind_description && (
                  <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                    <strong>In-kind:</strong> {job.in_kind_description}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          {job.description && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {job.description}
                </p>
              </div>
            </>
          )}

          {/* Deadline */}
          {job.deadline_iso && (
            <>
              <Separator />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Deadline: {format(new Date(job.deadline_iso), 'MMM d, yyyy')}</span>
              </div>
            </>
          )}

          {/* Actions */}
          {job.status === 'OPEN' && (
            <>
              <Separator />
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowCounterOffer(true)}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Make Offer
                </Button>
                {job.is_standard_rate && (
                  <Button className="flex-1">
                    Accept Standard Rate
                  </Button>
                )}
              </div>
            </>
          )}

          {/* Metadata */}
          <div className="text-xs text-muted-foreground pt-2 border-t">
            Posted {format(new Date(job.created_at), 'MMM d, yyyy')}
            {job.service_type && ` • ${STANDARD_RATES[job.service_type as keyof typeof STANDARD_RATES]?.name}`}
          </div>
        </CardContent>
      </Card>

      <CounterOfferDialog
        job={job}
        open={showCounterOffer}
        onOpenChange={setShowCounterOffer}
        onOfferSubmitted={onOfferSubmitted}
      />
    </>
  );
}