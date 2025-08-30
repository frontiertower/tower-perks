import { 
  Calendar, 
  Users, 
  Target,
  BookOpen,
  Trophy,
  Plus,
  Wrench,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useRole } from '@/store/useRole';

export function QuickActions() {
  const navigate = useNavigate();
  const { role } = useRole();
  
  const quickActions = [
    {
      id: 'primary-action',
      title: role === 'NON_MEMBER' ? 'Submit New Job' : 'Browse Bounties',
      description: role === 'NON_MEMBER' ? 'Post a job for the community' : 'Find available work opportunities',
      icon: role === 'NON_MEMBER' ? Plus : Target,
      color: 'text-white',
      bgColor: 'bg-primary hover:bg-primary/90',
      href: role === 'NON_MEMBER' ? '/jobs' : '/bounties'
    },
    {
      id: 'register-workshop',
      title: 'Join Workshop',
      description: 'Register for upcoming events and learn new skills',
      icon: Calendar,
      color: 'text-white',
      bgColor: 'bg-primary hover:bg-primary/90',
      href: '/events'
    },
    {
      id: 'my-activity',
      title: role === 'NON_MEMBER' ? 'My Jobs' : 'My Bounties',
      description: role === 'NON_MEMBER' ? 'View your submitted jobs' : 'View your claimed bounties',
      icon: role === 'NON_MEMBER' ? BookOpen : Wrench,
      color: 'text-white',
      bgColor: 'bg-primary hover:bg-primary/90',
      href: role === 'NON_MEMBER' ? '/jobs' : '/bounties'
    },
    {
      id: 'community',
      title: 'Community',
      description: 'Connect with other makers and events',
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
        {quickActions.map((action, index) => {
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