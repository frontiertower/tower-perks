import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Zap, Users, TrendingUp } from 'lucide-react';

interface Activity {
  id: string;
  type: 'job_posted' | 'job_claimed' | 'job_completed' | 'offer_made';
  title: string;
  timestamp: Date;
}

export function RealtimeActivityBanner() {
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Set up real-time subscription for activity feed
    const channel = supabase
      .channel('activity-feed')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'jobs',
        },
        (payload) => {
          const job = payload.new as Record<string, unknown>;
          const oldJob = payload.old as Record<string, unknown>;
          
          let activityType: Activity['type'] = 'job_posted';
          const title = (job?.title as string) || (oldJob?.title as string) || 'Unknown Job';

          if (payload.eventType === 'INSERT') {
            activityType = 'job_posted';
          } else if (payload.eventType === 'UPDATE') {
            if (oldJob.status !== job.status) {
              if (job.status === 'IN_PROGRESS') {
                activityType = 'job_claimed';
              } else if (job.status === 'COMPLETED') {
                activityType = 'job_completed';
              }
            }
          }

          const newActivity: Activity = {
            id: `${Date.now()}-${Math.random()}`,
            type: activityType,
            title: title.length > 30 ? title.substring(0, 30) + '...' : title,
            timestamp: new Date(),
          };

          setRecentActivity(prev => [newActivity, ...prev.slice(0, 4)]); // Keep last 5 activities
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'job_offers',
        },
        () => {
          const newActivity: Activity = {
            id: `${Date.now()}-${Math.random()}`,
            type: 'offer_made',
            title: 'New offer submitted',
            timestamp: new Date(),
          };

          setRecentActivity(prev => [newActivity, ...prev.slice(0, 4)]);
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'job_posted': return <Zap className="w-3 h-3" />;
      case 'job_claimed': return <Users className="w-3 h-3" />;
      case 'job_completed': return <TrendingUp className="w-3 h-3" />;
      case 'offer_made': return <Zap className="w-3 h-3" />;
      default: return <Zap className="w-3 h-3" />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'job_posted': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'job_claimed': return 'bg-orange-500/10 text-orange-600 border-orange-200';
      case 'job_completed': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'offer_made': return 'bg-purple-500/10 text-purple-600 border-purple-200';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  const getActivityLabel = (type: Activity['type']) => {
    switch (type) {
      case 'job_posted': return 'Posted';
      case 'job_claimed': return 'Claimed';
      case 'job_completed': return 'Completed';
      case 'offer_made': return 'New Offer';
      default: return 'Activity';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const seconds = Math.floor((Date.now() - timestamp.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  if (!isConnected || recentActivity.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 mb-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium">Live Activity</span>
        </div>
        <Badge variant="secondary" className="text-xs">
          Real-time updates enabled
        </Badge>
      </div>
      
      <div className="space-y-2">
        {recentActivity.map((activity) => (
          <div key={activity.id} className="flex items-center gap-3 text-sm">
            <Badge 
              variant="outline" 
              className={`flex items-center gap-1 text-xs ${getActivityColor(activity.type)}`}
            >
              {getActivityIcon(activity.type)}
              {getActivityLabel(activity.type)}
            </Badge>
            <span className="flex-1 text-muted-foreground">
              {activity.title}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatTimeAgo(activity.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}