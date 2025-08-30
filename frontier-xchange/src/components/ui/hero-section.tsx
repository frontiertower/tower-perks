import { cn } from '@/lib/utils';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

export function HeroSection({ 
  title, 
  subtitle, 
  children, 
  className,
  gradient = true 
}: HeroSectionProps) {
  return (
    <section className={cn(
      'py-16 md:py-24',
      gradient && 'bg-gradient-hero text-white',
      !gradient && 'bg-gray-50',
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className={cn(
          'text-4xl md:text-6xl font-bold mb-4',
          gradient ? 'text-white' : 'text-gray-900'
        )}>
          {title}
        </h1>
        {subtitle && (
          <p className={cn(
            'text-xl md:text-2xl mb-8',
            gradient ? 'text-blue-100' : 'text-gray-600'
          )}>
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}