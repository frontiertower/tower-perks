import { Layout } from '@/components/layout/Layout';
import { PageHeader } from '@/components/ui/page-header';
import { UnifiedJobMarketplace } from '@/components/marketplace/UnifiedJobMarketplace';
import { Button } from '@/components/ui/button';
import { Plus, Users, Zap } from 'lucide-react';

export default function Jobs() {
  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <PageHeader
          title="Job Marketplace"
          subtitle="Universal job board for all makerspace members - create, bid, negotiate, and earn!"
        >
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4"
            onClick={() => window.location.search = '?tab=create'}
          >
            <Plus className="w-5 h-5 mr-2" />
            Post New Job
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/60 px-8 py-4"
            onClick={() => window.location.search = '?tab=browse'}
          >
            <Users className="w-5 h-5 mr-2" />
            Browse Jobs
          </Button>
        </PageHeader>
        
        <div className="max-w-7xl mx-auto px-6 py-8">
          <UnifiedJobMarketplace />
        </div>
      </div>
    </Layout>
  );
}