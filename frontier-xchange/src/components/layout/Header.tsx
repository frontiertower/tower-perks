import { Bell, Search, Menu, User, Settings, HelpCircle, LogOut, Plus, Target } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

const navigationItems = [
  { name: 'Dashboard', href: '/', exact: true },
  { name: 'Events', href: '/events' },
  { name: 'Jobs', href: '/jobs' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, isMakerspaceMember } = useAuth();

  // Add Bounties for makerspace members only
  const filteredNavItems = [...navigationItems];
  if (isMakerspaceMember) {
    filteredNavItems.push({ name: 'Bounties', href: '/bounties' });
  }

  const isActiveRoute = (href: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const getRoleDisplay = () => {
    if (profile?.role === 'makerspace_member') {
      return 'MM'; // Makerspace Member
    }
    return 'M'; // Member
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 glass-strong border-b border-border-bright animate-slide-in-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 hover:scale-105 transition-all duration-300 group">
          <div className="w-10 h-10 bg-gradient-primary flex items-center justify-center relative overflow-hidden glow-primary">
            <span className="text-primary-foreground font-bold text-lg relative z-10">F</span>
            <div className="absolute inset-0 bg-gradient-neon opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </div>
          <div className="hidden md:block">
            <h1 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">
              Frontier Makerspace
            </h1>
            <p className="text-sm text-muted-foreground -mt-1 font-mono leading-normal">
              INNOVATION_PORTAL_V2.1
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {filteredNavItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`relative px-4 py-2 font-medium transition-all duration-300 group ${
                isActiveRoute(item.href, item.exact)
                  ? 'text-primary bg-primary/10 glow-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
              aria-current={isActiveRoute(item.href, item.exact) ? "page" : undefined}
            >
              <span className="relative z-10">{item.name}</span>
              {isActiveRoute(item.href, item.exact) && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary glow-primary animate-pulse-neon" />
              )}
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role Badge */}
          <div className="hidden lg:flex items-center">
            <Badge 
              variant={isMakerspaceMember ? "default" : "secondary"}
              className="text-xs font-mono"
            >
              {isMakerspaceMember ? 'MAKERSPACE MEMBER' : 'MEMBER'}
            </Badge>
          </div>

          {/* Role-aware CTA */}
          <Button 
            size="sm" 
            className="hidden md:flex hover:glow-primary transition-all duration-300 min-h-[44px]"
            onClick={() => {
              if (isMakerspaceMember) {
                navigate('/bounties');
              } else {
                navigate('/jobs');
              }
            }}
          >
            {isMakerspaceMember ? (
              <>
                <Target className="h-4 w-4 mr-1" />
                <span className="hidden lg:inline">Browse Bounties</span>
                <span className="lg:hidden">Bounties</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" />
                <span className="hidden lg:inline">Submit Job</span>
                <span className="lg:hidden">Submit</span>
              </>
            )}
          </Button>

          {/* Search Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="hidden sm:flex hover:glow-primary transition-all duration-300 border border-border-bright min-h-[44px] min-w-[44px]"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative hover:glow-secondary transition-all duration-300 border border-border-bright min-h-[44px] min-w-[44px]"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-destructive text-destructive-foreground border-destructive glow-accent animate-pulse">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 glass-strong border-border-bright">
              <DropdownMenuLabel className="text-primary font-mono">NOTIFICATIONS</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border-border-bright" />
              <div className="p-2 space-y-2 max-h-64 overflow-y-auto">
                <div className="p-3 glass border border-primary/30 hover:border-primary/60 transition-colors animate-slide-in-left">
                  <p className="font-semibold text-sm text-foreground leading-normal">Welcome to Frontier Makerspace!</p>
                  <p className="text-sm text-muted-foreground mt-1 leading-normal">Your account has been successfully created</p>
                  <p className="text-sm text-primary mt-2 font-mono">2 minutes ago</p>
                </div>
                <div className="p-3 glass border border-muted hover:border-secondary/60 transition-colors">
                  <p className="font-semibold text-sm text-foreground leading-normal">Workshop reminder</p>
                  <p className="text-sm text-muted-foreground mt-1 leading-normal">3D Printing basics starts in 30 minutes</p>
                  <p className="text-sm text-muted-foreground mt-2 font-mono">25 minutes ago</p>
                </div>
                <div className="p-3 glass border border-muted hover:border-warning/60 transition-colors">
                  <p className="font-semibold text-sm text-foreground leading-normal">Event upcoming</p>
                  <p className="text-sm text-muted-foreground mt-1 leading-normal">Laser Cutting Workshop tomorrow at 2 PM</p>
                  <p className="text-sm text-muted-foreground mt-2 font-mono">2 hours ago</p>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative min-h-[44px] min-w-[44px] p-0 hover:glow-accent transition-all duration-300">
                <Avatar className="h-9 w-9 border-2 border-primary glow-primary">
                  <AvatarImage src={profile?.avatar_url || ''} alt="Profile" />
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground font-bold">
                    {getRoleDisplay()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-strong border-border-bright">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-base font-semibold text-foreground leading-normal">
                    {profile?.full_name || 'Anonymous User'}
                  </p>
                  <p className="text-sm text-muted-foreground font-mono leading-normal">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border-border-bright" />
              <DropdownMenuItem 
                className="hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                onClick={handleProfileClick}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="hover:bg-secondary/10 hover:text-secondary transition-colors cursor-pointer"
                onClick={handleSettingsClick}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-accent/10 hover:text-accent transition-colors">
                <HelpCircle className="mr-2 h-4 w-4" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border-border-bright" />
              <DropdownMenuItem 
                className="text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                onClick={signOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden hover:glow-primary transition-all duration-300 border border-border-bright min-h-[44px] min-w-[44px]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden glass-strong border-t border-border-bright animate-slide-in-up">
          <nav className="px-4 py-3 space-y-2">
            {filteredNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 min-h-[44px] font-medium transition-all duration-300 flex items-center ${
                  isActiveRoute(item.href, item.exact)
                    ? 'text-primary bg-primary/10 glow-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}