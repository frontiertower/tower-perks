import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ 
  title, 
  subtitle, 
  children, 
  className 
}: PageHeaderProps) {
  return (
    <section className={cn(
      'bg-gradient-to-br from-primary to-primary-600 hero-background relative overflow-hidden border-b border-border animate-gradient',
      className
    )}>
      {/* Dynamic floating elements */}
      <div className="absolute top-8 right-12 w-20 h-20 bg-white/10 rounded-full animate-floating-orbs pulse" />
      <div className="absolute bottom-8 left-12 w-16 h-16 bg-white/5 rounded-full animate-floating-orbs hover-scale" style={{ animationDelay: '4s' }} />
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/8 rounded-full animate-floating-orbs" style={{ animationDelay: '8s' }} />
      
      {/* Geometric shapes */}
      <div className="absolute top-20 left-8 w-8 h-8 bg-white/5 rotate-45 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 right-20 w-6 h-6 bg-white/8 rotate-12 animate-float" style={{ animationDelay: '6s' }} />
      <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-white/6 rotate-45 animate-pulse" style={{ animationDelay: '10s' }} />
      
      {/* Enhanced shimmer with particles */}
      <div className="absolute inset-0 opacity-30">
        <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        <div className="absolute inset-0 animate-particles opacity-50" />
      </div>
      
      {/* Cyber grid background */}
      <div className="absolute inset-0 cyber-grid opacity-10" />
      
      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10 animate-fade-in">
        <div className="text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white leading-tight drop-shadow-lg animate-scale-in hover-scale transition-all duration-300" 
              style={{ animationDelay: '0.2s' }}>
            {title}
          </h1>
          
          {subtitle && (
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-sm animate-fade-in" 
               style={{ animationDelay: '0.4s' }}>
              {subtitle}
            </p>
          )}
          
          {children && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in-right" 
                 style={{ animationDelay: '0.6s' }}>
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}