import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { JOB_CATEGORIES, PAYMENT_TYPES, STANDARD_RATES, type JobCategory, type PaymentType, type CreateJobInput } from '@/types/jobs-enhanced';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check, DollarSign, Mail, FileText, Handshake, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface WizardData {
  title: string;
  category: JobCategory | '';
  description: string;
  deadline?: Date;
  budget: string;
  email: string;
  service_type: string;
  payment_type: PaymentType;
  in_kind_description: string;
}

interface EnhancedJobWizardProps {
  onJobCreated?: () => void;
}

export function EnhancedJobWizard({ onJobCreated }: EnhancedJobWizardProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<WizardData>({
    title: '',
    category: '',
    description: '',
    deadline: undefined,
    budget: '',
    email: '',
    service_type: '',
    payment_type: 'MONETARY',
    in_kind_description: '',
  });

  const { toast } = useToast();

  const updateData = <K extends keyof WizardData>(field: K, value: WizardData[K]) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const is3DPrintingJob = data.category === '3D_PRINTING';
  const isLaserJob = data.category === 'LASER_CUTTING';
  const hasStandardRates = is3DPrintingJob || isLaserJob;

  const canGoNext = () => {
    switch (step) {
      case 1:
        return data.title.length > 0 && data.category;
      case 2:
        return true; // Description is optional
      case 3:
        if (hasStandardRates) {
          return data.service_type && data.email.includes('@');
        }
        // For bounty jobs, check payment type requirements
        if (data.payment_type === 'MONETARY') {
          return parseFloat(data.budget) > 0 && data.email.includes('@');
        } else if (data.payment_type === 'IN_KIND') {
          return data.in_kind_description.length > 0 && data.email.includes('@');
        } else if (data.payment_type === 'HYBRID') {
          return parseFloat(data.budget) > 0 && data.in_kind_description.length > 0 && data.email.includes('@');
        }
        return false;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!canGoNext()) return;

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to post a job.",
          variant: "destructive",
        });
        return;
      }

      const jobData: CreateJobInput = {
        title: data.title,
        category: data.category as JobCategory,
        description: data.description,
        payment_type: data.payment_type,
        posted_by_id: user.id,
        posted_by_email: data.email,
        deadline_iso: data.deadline?.toISOString(),
        is_standard_rate: hasStandardRates,
      };

      // Add budget and in-kind description based on payment type
      if (data.payment_type === 'MONETARY' || data.payment_type === 'HYBRID') {
        jobData.budget_usd = parseFloat(data.budget);
      }
      if (data.payment_type === 'IN_KIND' || data.payment_type === 'HYBRID') {
        jobData.in_kind_description = data.in_kind_description;
      }
      if (hasStandardRates) {
        jobData.service_type = data.service_type;
      }

      const { error } = await supabase
        .from('jobs')
        .insert([jobData]);

      if (error) throw error;

      toast({
        title: "Job posted successfully!",
        description: "Your job has been posted and will appear on the bounties board.",
      });

      // Reset form
      setData({
        title: '',
        category: '',
        description: '',
        deadline: undefined,
        budget: '',
        email: '',
        service_type: '',
        payment_type: 'MONETARY',
        in_kind_description: '',
      });
      setStep(1);
      
      onJobCreated?.();
    } catch (error) {
      console.error('Error posting job:', error);
      toast({
        title: "Error posting job",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressValue = (step / 4) * 100;

  return (
    <Card className="max-w-2xl mx-auto glass border-border-bright">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Submit New Job
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            Step {step} of 4
          </div>
        </div>
        <Progress value={progressValue} className="mt-2" />
      </CardHeader>

      <CardContent className="space-y-6">
        {step === 1 && (
          <div className="space-y-4 animate-slide-in-up">
            <div>
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Custom Phone Stand Design"
                value={data.title}
                onChange={(e) => updateData('title', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Category *</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(JOB_CATEGORIES).map(([key, label]) => (
                  <Badge
                    key={key}
                    variant={data.category === key ? "default" : "outline"}
                    className="cursor-pointer hover-lift"
                    onClick={() => updateData('category', key)}
                  >
                    {label}
                  </Badge>
                ))}
              </div>
              {(data.category === '3D_PRINTING' || data.category === 'LASER_CUTTING') && (
                <div className="mt-2 p-3 bg-primary/10 rounded-md">
                  <p className="text-sm text-primary">
                    ✨ <strong>Standard Rates:</strong> This category has fixed service rates. 
                    You'll see pricing options in the next steps.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-slide-in-up">
            <div>
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what you need done, include specifications, requirements, and any constraints..."
                value={data.description}
                onChange={(e) => updateData('description', e.target.value)}
                className="mt-1 min-h-[120px]"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {data.description.length} characters - recommended for better responses
              </div>
            </div>
            
            <div>
              <Label>Deadline (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !data.deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {data.deadline ? format(data.deadline, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={data.deadline}
                    onSelect={(date) => updateData('deadline', date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-slide-in-up">
            {hasStandardRates ? (
              // Standard rate services (3D Printing, Laser Cutting)
              <>
                <div>
                  <Label>Service Type *</Label>
                  <div className="grid gap-3 mt-2">
                    {data.category === '3D_PRINTING' && (
                      <>
                        {[
                          { value: 'BAMBU_X1C', ...STANDARD_RATES.BAMBU_X1C, description: '3D printing with premium materials and precision' },
                          { value: 'H2D', ...STANDARD_RATES.H2D, description: '3D printing with advanced multi-material support' }
                        ].map((service) => (
                          <div
                            key={service.value}
                            onClick={() => updateData('service_type', service.value)}
                            className={cn(
                              "p-4 border-2 rounded-lg cursor-pointer transition-all duration-200",
                              data.service_type === service.value
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50 hover:bg-primary/2"
                            )}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-foreground">{service.name}</h3>
                              <div className="text-right">
                                <div className="text-lg font-bold text-primary">${service.base_rate}</div>
                                <div className="text-xs text-muted-foreground">base rate</div>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          </div>
                        ))}
                      </>
                    )}
                    {data.category === 'LASER_CUTTING' && (
                      <div
                        onClick={() => updateData('service_type', 'LASER')}
                        className={cn(
                          "p-4 border-2 rounded-lg cursor-pointer transition-all duration-200",
                          data.service_type === 'LASER'
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 hover:bg-primary/2"
                        )}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-foreground">{STANDARD_RATES.LASER.name}</h3>
                          <div className="text-right">
                            <div className="text-lg font-bold text-primary">${STANDARD_RATES.LASER.base_rate}</div>
                            <div className="text-xs text-muted-foreground">base rate</div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">Precision laser cutting for various materials</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 p-3 bg-muted/50 rounded-md">
                    <p className="text-sm text-muted-foreground">
                      💡 <strong>Standard Rate:</strong> This is the base rate for the service. 
                      Makers may quote additional costs for materials or complexity.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              // Bounty system for other categories
              <>
                <div>
                  <Label>Payment Type *</Label>
                  <RadioGroup 
                    value={data.payment_type} 
                    onValueChange={(value) => updateData('payment_type', value as PaymentType)}
                    className="mt-2"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="MONETARY" id="monetary" />
                        <div className="flex-1">
                          <label htmlFor="monetary" className="flex items-center gap-2 font-medium cursor-pointer">
                            <DollarSign className="w-4 h-4" />
                            {PAYMENT_TYPES.MONETARY}
                          </label>
                          <p className="text-sm text-muted-foreground">Pay with money (USD)</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="IN_KIND" id="in-kind" />
                        <div className="flex-1">
                          <label htmlFor="in-kind" className="flex items-center gap-2 font-medium cursor-pointer">
                            <Handshake className="w-4 h-4" />
                            {PAYMENT_TYPES.IN_KIND}
                          </label>
                          <p className="text-sm text-muted-foreground">Offer services, goods, or skills in exchange</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="HYBRID" id="hybrid" />
                        <div className="flex-1">
                          <label htmlFor="hybrid" className="flex items-center gap-2 font-medium cursor-pointer">
                            <Gift className="w-4 h-4" />
                            {PAYMENT_TYPES.HYBRID}
                          </label>
                          <p className="text-sm text-muted-foreground">Combination of cash and trade</p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {(data.payment_type === 'MONETARY' || data.payment_type === 'HYBRID') && (
                  <div>
                    <Label htmlFor="budget">Budget Amount (USD) *</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="budget"
                        type="number"
                        placeholder="50"
                        value={data.budget}
                        onChange={(e) => updateData('budget', e.target.value)}
                        className="pl-9"
                        min="1"
                      />
                    </div>
                  </div>
                )}

                {(data.payment_type === 'IN_KIND' || data.payment_type === 'HYBRID') && (
                  <div>
                    <Label htmlFor="in-kind">What You're Offering *</Label>
                    <Textarea
                      id="in-kind"
                      placeholder="e.g., Web design services, tutoring, handmade crafts, professional consultation..."
                      value={data.in_kind_description}
                      onChange={(e) => updateData('in_kind_description', e.target.value)}
                      className="mt-1 min-h-[80px]"
                    />
                  </div>
                )}
              </>
            )}
            
            <div>
              <Label htmlFor="email">Contact Email *</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={data.email}
                  onChange={(e) => updateData('email', e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 animate-slide-in-up">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Check className="w-5 h-5 text-primary" />
              Review & Post
            </h3>
            
            <div className="space-y-3 p-4 bg-muted/30 rounded-md">
              <div>
                <div className="text-sm font-medium">Title</div>
                <div className="text-sm text-muted-foreground">{data.title}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium">Category</div>
                <Badge variant="outline">
                  {data.category && JOB_CATEGORIES[data.category as JobCategory]}
                </Badge>
              </div>
              
              <div>
                <div className="text-sm font-medium">Payment</div>
                <div className="flex flex-col gap-1">
                  <Badge variant="secondary">{PAYMENT_TYPES[data.payment_type]}</Badge>
                  {hasStandardRates && data.service_type && (
                    <div className="text-lg font-bold text-primary">
                      ${STANDARD_RATES[data.service_type as keyof typeof STANDARD_RATES]?.base_rate} base rate
                    </div>
                  )}
                  {!hasStandardRates && (data.payment_type === 'MONETARY' || data.payment_type === 'HYBRID') && (
                    <div className="text-lg font-bold text-primary">${data.budget}</div>
                  )}
                  {(data.payment_type === 'IN_KIND' || data.payment_type === 'HYBRID') && (
                    <div className="text-sm text-muted-foreground">{data.in_kind_description}</div>
                  )}
                </div>
              </div>
              
              {data.description && (
                <div>
                  <div className="text-sm font-medium">Description</div>
                  <div className="text-sm text-muted-foreground line-clamp-3">
                    {data.description}
                  </div>
                </div>
              )}
              
              {data.deadline && (
                <div>
                  <div className="text-sm font-medium">Deadline</div>
                  <div className="text-sm text-muted-foreground">
                    {format(data.deadline, "PPP")}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          
          {step < 4 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canGoNext()}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canGoNext() || isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Post Job"}
              <Check className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}