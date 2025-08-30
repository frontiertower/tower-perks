import { Package, AlertCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { ActiveBounties } from '@/components/dashboard/ActiveBounties';
import { UpcomingEvents } from '@/components/dashboard/UpcomingEvents';
import { CurrentCheckouts } from '@/components/dashboard/CurrentCheckouts';

// ... keep existing code (mock data moved to components)

// Remove unused currentCheckouts - moved to CurrentCheckouts component

export function Dashboard() {
  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Enhanced Header */}
        <DashboardHeader />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Top Row - Stats Cards */}
          <DashboardStats />

          {/* Main Content Grid - Left and Right Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Left Column */}
            <div className="space-y-4 sm:space-y-6">
              {/* Upcoming Events */}
              <UpcomingEvents />
              
              {/* Activity Feed */}
              <ActivityFeed />
            </div>

            {/* Right Column */}
            <div className="space-y-4 sm:space-y-6">
              {/* My Active Bounties */}
              <ActiveBounties />
              
              {/* Current Checkouts */}
              <CurrentCheckouts />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}