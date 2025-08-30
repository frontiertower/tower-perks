import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline';
}

export function StatusBadge({ 
  status, 
  children, 
  size = 'md', 
  variant = 'default' 
}: StatusBadgeProps) {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };
  
  const statusClasses = {
    success: variant === 'outline' 
      ? 'border border-success text-success-dark bg-transparent'
      : 'bg-success-light text-success-dark',
    warning: variant === 'outline'
      ? 'border border-warning text-warning-dark bg-transparent'
      : 'bg-warning-light text-warning-dark',
    error: variant === 'outline'
      ? 'border border-error text-error-dark bg-transparent'
      : 'bg-error-light text-error-dark',
    info: variant === 'outline'
      ? 'border border-info text-info-dark bg-transparent'
      : 'bg-info-light text-info-dark',
    neutral: variant === 'outline'
      ? 'border border-gray-300 text-gray-700 bg-transparent'
      : 'bg-gray-100 text-gray-700'
  };

  return (
    <span className={cn(
      baseClasses,
      sizeClasses[size],
      statusClasses[status]
    )}>
      {children}
    </span>
  );
}