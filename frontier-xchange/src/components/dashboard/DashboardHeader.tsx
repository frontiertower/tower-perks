import { Bell, Calendar, Target, Zap, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';

export function DashboardHeader() {
  const navigate = useNavigate();
  const { role } = useUserStore();
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentTime = currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <section 
      className="bg-gradient-to-br from-primary to-primary-600 hero-background relative overflow-hidden border-b border-border animate-gradient"
      aria-labelledby="dashboard-welcome"
      role="banner"
    >
      {/* Static background orbs for better performance */}
      <div className="absolute top-8 right-12 w-20 h-20 bg-white/10 rounded-full opacity-60" aria-hidden="true" />
      <div className="absolute bottom-8 left-12 w-16 h-16 bg-white/8 rounded-full opacity-50" aria-hidden="true" />
      <div className="absolute top-1/3 left-1/5 w-24 h-24 bg-white/6 rounded-full opacity-40" aria-hidden="true" />
      
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Left side - Greeting & Info */}
          <div className="flex-1 animate-slide-in-left">
            <header>
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1.5 bg-white/20 border border-white/30 rounded-full">
                <span className="text-sm font-mono text-white">MAKER_STATUS: ACTIVE</span>
              </div>
              <div className="px-3 py-1.5 bg-white/20 border border-white/30 rounded-full">
                <span className="text-sm font-mono text-white">LVL_7_INNOVATOR</span>
              </div>
            </div>
            
            <h1 id="dashboard-welcome" className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 text-white leading-tight">
              Good morning, <span className="text-white font-mono">John</span>
            </h1>
            
            <p className="text-base sm:text-lg text-white/80 mb-4 max-w-2xl leading-relaxed">
              Ready to build the future? Your workspace awaits.
            </p>
            
            <div className="flex items-center gap-4 text-sm text-white/70" role="status" aria-label="Current date and time">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" aria-label="Online status indicator"></div>
                <time dateTime={currentDate.toISOString().split('T')[0]}>{formattedDate}</time>
              </span>
              <time className="font-mono" dateTime={currentDate.toTimeString().slice(0, 8)}>{currentTime}</time>
            </div>
            </header>
          </div>

          {/* Right side - Quick Actions */}
          <nav className="flex flex-col sm:flex-row gap-3 animate-slide-in-right" aria-label="Quick navigation">
            <Button 
              onClick={() => navigate('/bounties')} 
              className="bg-white text-primary hover:bg-white/90 font-semibold px-6 py-4 min-h-[44px] border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
              aria-label="Browse available bounties"
            >
              <Zap className="h-5 w-5 mr-2" aria-hidden="true" />
              <span className="text-sm sm:text-base">Bounties</span>
            </Button>
            <Button 
              onClick={() => navigate('/jobs')} 
              className="bg-white text-primary hover:bg-white/90 font-semibold px-6 py-4 min-h-[44px] border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
              aria-label="Manage your jobs"
            >
              <Briefcase className="h-5 w-5 mr-2" aria-hidden="true" />
              <span className="text-sm sm:text-base">My Jobs</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="min-h-[44px] min-w-[44px] hover:bg-white/20 text-white"
              aria-label="View notifications"
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
            </Button>
          </nav>
        </div>

        {/* Enhanced Progress indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 animate-slide-in-up">
          <div className="bg-white/95 backdrop-blur-sm border border-white/30 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-4 h-4 bg-warning rounded-full animate-pulse shadow-sm" />
              <span className="text-sm font-semibold text-gray-800">Active Projects</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-warning">3</span>
              <span className="text-sm text-gray-600 font-medium">ongoing</span>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm border border-white/30 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-gray-800">Available Bounties</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-primary">12</span>
              <span className="text-sm text-gray-600 font-medium">open</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}