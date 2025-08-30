import { Clock, Package, Calendar, Star, ShoppingCart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  type: 'checkout' | 'event' | 'wishlist' | 'bounty' | 'purchase';
  title: string;
  description: string;
  timestamp: Date;
  user?: {
    name: string;
    avatar?: string;
  };
}

const activities: ActivityItem[] = [
  {
    id: '1',
    type: 'checkout',
    title: 'Equipment Checkout',
    description: 'Checked out Arduino Uno Kit #A001',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    user: { name: 'You' }
  },
  {
    id: '2',
    type: 'event',
    title: 'Workshop Registration',
    description: 'Registered for "3D Printing Fundamentals"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    user: { name: 'Sarah Chen' }
  },
  {
    id: '3',
    type: 'wishlist',
    title: 'Wishlist Vote',
    description: 'Voted for "Raspberry Pi 5 Starter Kit"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    user: { name: 'Mike Johnson' }
  },
  {
    id: '4',
    type: 'bounty',
    title: 'Bounty Completed',
    description: 'Completed "LED Matrix Display Tutorial"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    user: { name: 'Alex Rodriguez' }
  },
  {
    id: '5',
    type: 'purchase',
    title: 'Marketplace Order',
    description: 'Purchased "Custom PCB Design Service"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    user: { name: 'Emma Wilson' }
  }
];

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'checkout':
      return Package;
    case 'event':
      return Calendar;
    case 'wishlist':
      return Star;
    case 'bounty':
      return Star;
    case 'purchase':
      return ShoppingCart;
    default:
      return Clock;
  }
};

const getActivityColor = (type: ActivityItem['type']) => {
  switch (type) {
    case 'checkout':
      return 'text-primary bg-primary/10';
    case 'event':
      return 'text-primary bg-primary/10';
    case 'wishlist':
      return 'text-primary bg-primary/10';
    case 'bounty':
      return 'text-primary bg-primary/10';
    case 'purchase':
      return 'text-primary bg-primary/10';
    default:
      return 'text-primary bg-primary/10';
  }
};

export function ActivityFeed() {
  return (
    <div className="bg-white border border-border shadow-card p-6 animate-slide-in-up">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground">Recent Activity</h3>
        <button className="text-primary hover:text-primary-700 text-sm font-semibold transition-colors leading-normal">
          View All →
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = getActivityIcon(activity.type);
          const colorClass = getActivityColor(activity.type);
          
          return (
            <div key={activity.id} className="flex items-start gap-4 animate-slide-in-left" style={{ animationDelay: `${index * 0.1}s` }}>
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 flex items-center justify-center ${colorClass} transition-all duration-300 hover:scale-110`}>
                  <Icon className="h-5 w-5" />
                </div>
                {index < activities.length - 1 && (
                  <div className="w-px h-8 bg-border mt-2" />
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0 p-3 bg-background-secondary border border-border hover:border-primary/30 transition-colors">
                <p className="font-semibold text-foreground text-base leading-normal">{activity.title}</p>
                <p className="text-muted-foreground text-sm mt-1 leading-normal">{activity.description}</p>
                <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <span>{formatDistanceToNow(activity.timestamp)} ago</span>
                  {activity.user && (
                    <>
                      <span>•</span>
                      <span>{activity.user.name}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}