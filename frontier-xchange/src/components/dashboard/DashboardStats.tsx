import { Package, Calendar, Star, Trophy, DollarSign } from 'lucide-react';
import { StatCard } from './StatCard';
import { useJobsStore } from '@/store/jobsStore';
import { useUserStore } from '@/store/userStore';

export function DashboardStats() {
  const { getJobsCount, getJobsByUserId, getJobsByClaimerId } = useJobsStore();
  const { userId, role } = useUserStore();
  
  const jobCounts = getJobsCount();
  const myJobs = getJobsByUserId(userId);
  const myClaimedJobs = getJobsByClaimerId(userId);

  const stats = role === 'non-member' ? [
    {
      title: 'Jobs Submitted',
      value: myJobs.length,
      change: { value: `${myJobs.filter(j => j.status === 'OPEN').length} active`, type: 'increase' as const },
      icon: Package,
    },
    {
      title: 'Events Available',
      value: 6,
      change: { value: '2 this week', type: 'increase' as const },
      icon: Calendar,
    },
    {
      title: 'Total Spent',
      value: myJobs.reduce((sum, j) => sum + (j.status === 'COMPLETED' ? j.budget : 0), 0),
      change: { value: 'USD', type: 'increase' as const },
      icon: DollarSign,
    },
    {
      title: 'Completed Projects',
      value: myJobs.filter(j => j.status === 'COMPLETED').length,
      change: { value: 'projects done', type: 'increase' as const },
      icon: Trophy,
    }
  ] : [
    {
      title: 'Open Bounties',
      value: jobCounts.open,
      change: { value: 'available now', type: 'increase' as const },
      icon: Package,
    },
    {
      title: 'My Active Jobs',
      value: myClaimedJobs.filter(j => j.status === 'IN_PROGRESS').length,
      change: { value: 'in progress', type: 'increase' as const },
      icon: Calendar,
    },
    {
      title: 'Total Earned',
      value: myClaimedJobs.filter(j => j.status === 'COMPLETED').reduce((sum, j) => sum + j.budget, 0),
      change: { value: 'USD', type: 'increase' as const },
      icon: DollarSign,
    },
    {
      title: 'Bounties Completed',
      value: myClaimedJobs.filter(j => j.status === 'COMPLETED').length,
      change: { value: 'projects done', type: 'increase' as const },
      icon: Trophy,
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="animate-slide-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
          <StatCard {...stat} />
        </div>
      ))}
    </div>
  );
}