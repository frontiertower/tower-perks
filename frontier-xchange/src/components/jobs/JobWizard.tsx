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
import { JobsAdapter } from '@/lib/adapters/jobsAdapter';
import { useUserStore } from '@/store/userStore';
import { useToast } from '@/hooks/use-toast';
import { JOB_CATEGORIES, type JobCategory } from '@/types/job';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check, DollarSign, Mail, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface WizardData {
  title: string;
  category: JobCategory | '';
  description: string;
  deadline?: Date;
  budget: string;
  email: string;
  service: 'BAMBU_X1C' | 'H2D' | 'LASER' | '';
}

export function JobWizard() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<WizardData>({
    title: '',
    category: '',
    description: '',
    deadline: undefined,
    budget: '',
    email: '',
    service: '',
  });

  const { userId } = useUserStore();
  const { toast } = useToast();

  const updateData = <K extends keyof WizardData>(field: K, value: WizardData[K]) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const canGoNext = () => {
    switch (step) {
      case 1:
        return data.title.length > 0 && data.category;
      case 2:
        return true; // Description is now optional
      case 3:
        return parseFloat(data.budget) > 0 && data.email.includes('@') && data.service;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!canGoNext()) return;

    setIsSubmitting(true);
    try {
      await JobsAdapter.create({
        title: data.title,
        category: data.category as JobCategory,
        description: data.description,
        budget: parseFloat(data.budget),
        deadlineISO: data.deadline?.toISOString(),
        postedById: userId,
        postedByEmail: data.email,
      });

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
                service: '',
              });
      setStep(1);
    } catch (error) {
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
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-slide-in-up">
            <div>
              <Label htmlFor="description">Project Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe what you need done, include specifications, requirements, and any constraints..."
                value={data.description}
                onChange={(e) => updateData('description', e.target.value)}
                className="mt-1 min-h-[120px]"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {data.description.length} characters - optional but recommended for better responses
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
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-slide-in-up">
            <div>
              <Label>Service *</Label>
              <div className="grid gap-3 mt-2">
                {[
                  { 
                    value: 'BAMBU_X1C', 
                    label: 'Bambu Lab X1 Carbon', 
                    price: 5, 
                    description: '3D printing with premium materials and precision'
                  },
                  { 
                    value: 'H2D', 
                    label: 'Bambu Lab H2D', 
                    price: 7, 
                    description: '3D printing with advanced multi-material support'
                  },
                  { 
                    value: 'LASER', 
                    label: 'Laser Cutting', 
                    price: 20, 
                    description: 'Precision laser cutting for various materials'
                  }
                ].map((service) => (
                  <div
                    key={service.value}
                    onClick={() => updateData('service', service.value)}
                    className={cn(
                      "p-4 border-2 rounded-lg cursor-pointer transition-all duration-200",
                      data.service === service.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-primary/2"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-foreground">{service.label}</h3>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">${service.price}</div>
                        <div className="text-xs text-muted-foreground">minimum fee</div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 bg-muted/50 rounded-md">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Listing Fee:</strong> This fee publishes your job for makers to claim. 
                  A maker may quote additional cost before work proceeds. You can accept or cancel.
                </p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="budget">Additional Budget (USD) *</Label>
              <div className="relative mt-1">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="budget"
                  type="number"
                  placeholder="25"
                  value={data.budget}
                  onChange={(e) => updateData('budget', e.target.value)}
                  className="pl-9"
                  min="1"
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Additional budget beyond the service fee for materials/complexity
              </div>
            </div>
            
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
                <div className="text-sm font-medium">Description</div>
                <div className="text-sm text-muted-foreground line-clamp-3">
                  {data.description}
                </div>
              </div>
              
              <div className="flex justify-between">
                <div>
                  <div className="text-sm font-medium">Service & Budget</div>
                  <div className="text-lg font-bold text-primary">
                    {data.service === 'BAMBU_X1C' && '$5 + $'}
                    {data.service === 'H2D' && '$7 + $'}
                    {data.service === 'LASER' && '$20 + $'}
                    {data.budget}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {data.service === 'BAMBU_X1C' && 'Bambu Lab X1C + additional budget'}
                    {data.service === 'H2D' && 'Bambu Lab H2D + additional budget'}
                    {data.service === 'LASER' && 'Laser Cutting + additional budget'}
                  </div>
                </div>
                
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