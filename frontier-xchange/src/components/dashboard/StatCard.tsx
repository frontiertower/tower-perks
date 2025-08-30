import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'increase' | 'decrease';
  };
  icon: LucideIcon;
}

export function StatCard({ title, value, change, icon: Icon }: StatCardProps) {
  return (
    <div 
      className="bg-white/80 backdrop-blur-sm border border-border rounded-xl p-4 hover:bg-white hover:border-primary/50 transition-all duration-300 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" 
      tabIndex={0}
      role="button"
      aria-label={`${title}: ${value}${change ? `, ${change.value}` : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-muted-foreground text-sm font-medium mb-2 uppercase tracking-wider leading-normal">
            {title}
          </p>
          <p className="text-3xl font-bold text-foreground font-mono leading-tight">
            {value}
          </p>
        </div>
        
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:bg-primary/20">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      
      {change && (
        <div className="flex items-center gap-2">
          {change.type === 'increase' ? (
            <TrendingUp className="h-3 w-3 text-primary" />
          ) : (
            <TrendingDown className="h-3 w-3 text-destructive" />
          )}
          <span
            className={cn(
              'text-sm font-medium leading-normal',
              change.type === 'increase' ? 'text-primary' : 'text-destructive'
            )}
          >
            {change.value}
          </span>
        </div>
      )}
      
      {/* Animated bottom border */}
      <div className="mt-3 h-0.5 bg-border rounded-full overflow-hidden">
        <div className="h-full bg-primary w-0 group-hover:w-full transition-all duration-300 ease-out" />
      </div>
    </div>
  );
}