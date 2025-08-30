import { Target, Briefcase, Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function DashboardNavigation() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const navigationItems = [
    {
      id: 'bounties',
      title: 'Browse Bounties',
      description: 'Find available work opportunities',
      icon: Target,
      color: 'text-white',
      bgColor: 'bg-primary hover:bg-primary/90',
      href: '/bounties'
    },
    {
      id: 'my-jobs',
      title: 'My Jobs',
      description: 'Manage your posted and claimed work',
      icon: Briefcase,
      color: 'text-white',
      bgColor: 'bg-primary hover:bg-primary/90',
      href: '/jobs'
    },
    {
      id: 'submit-job',
      title: 'Submit New Job',
      description: 'Post a job for the community',
      icon: Plus,
      color: 'text-white',
      bgColor: 'bg-primary hover:bg-primary/90',
      href: '/jobs?tab=submit'
    },
    {
      id: 'community',
      title: 'Community',
      description: 'Connect with other makers',
      icon: Users,
      color: 'text-white',
      bgColor: 'bg-primary hover:bg-primary/90',
      href: '/events'
    }
  ];

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-border rounded-xl shadow-sm p-4 h-fit">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-foreground">Quick Actions</h3>
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {navigationItems.map((action, index) => {
          const Icon = action.icon;
          
          return (
            <Button
              key={action.id}
              onClick={() => navigate(action.href)}
              className={`${action.bgColor} ${action.color} h-auto p-4 flex flex-col items-center gap-2 text-center hover-lift`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Icon className="h-6 w-6" />
              <div className="font-semibold text-sm">{action.title}</div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}