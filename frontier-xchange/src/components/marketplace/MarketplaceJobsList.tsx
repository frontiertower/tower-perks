import { useState } from 'react';
import { EnhancedJobCard } from '@/components/jobs/EnhancedJobCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JOB_CATEGORIES, PAYMENT_TYPES } from '@/types/jobs-enhanced';
import { Search, Filter, X, Wifi, BarChart3, Users, Clock } from 'lucide-react';
import { useRealtimeJobs } from '@/hooks/useRealtimeJobs';

interface FilterState {
  search: string;
  category: string;
  paymentType: string;
  status: string;
}

interface MarketplaceJobsListProps {
  onJobAction?: () => void;
}

export function MarketplaceJobsList({ onJobAction }: MarketplaceJobsListProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    paymentType: '',
    status: 'OPEN',
  });

  const { jobs, loading, refetch } = useRealtimeJobs(filters);

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      paymentType: '',
      status: 'OPEN',
    });
  };

  const handleOfferSubmitted = () => {
    refetch();
    onJobAction?.();
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value && value !== 'OPEN'
  ).length;

  // Calculate marketplace stats
  const stats = {
    total: jobs.length,
    openJobs: jobs.filter(j => j.status === 'OPEN').length,
    activeProjects: jobs.filter(j => j.status === 'IN_PROGRESS').length,
    totalValue: jobs.reduce((sum, j) => sum + (j.budget_usd || 0), 0),
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-muted/20 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-muted/20 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Marketplace Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openJobs}</div>
            <p className="text-xs text-muted-foreground">
              Available opportunities
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              Currently being worked
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalValue}</div>
            <p className="text-xs text-muted-foreground">
              Combined job value
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Updates</CardTitle>
            <Wifi className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">ON</div>
            <p className="text-xs text-muted-foreground">
              Real-time marketplace
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs by title, description, or skills..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-2">
            <Select 
              value={filters.category} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, category: value === 'all' ? '' : value }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(JOB_CATEGORIES).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={filters.paymentType} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, paymentType: value === 'all' ? '' : value }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Payment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payment Types</SelectItem>
                {Object.entries(PAYMENT_TYPES).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={filters.status || 'OPEN'} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, status: value === 'all' ? '' : value }))}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>

            {activeFiltersCount > 0 && (
              <Button variant="outline" size="icon" onClick={clearFilters}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {filters.search && (
              <Badge variant="secondary">
                Search: "{filters.search}"
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer" 
                  onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                />
              </Badge>
            )}
            {filters.category && (
              <Badge variant="secondary">
                {JOB_CATEGORIES[filters.category as keyof typeof JOB_CATEGORIES]}
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer" 
                  onClick={() => setFilters(prev => ({ ...prev, category: '' }))}
                />
              </Badge>
            )}
            {filters.paymentType && (
              <Badge variant="secondary">
                {PAYMENT_TYPES[filters.paymentType as keyof typeof PAYMENT_TYPES]}
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer" 
                  onClick={() => setFilters(prev => ({ ...prev, paymentType: '' }))}
                />
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found
        </p>
      </div>

      {/* Jobs Grid */}
      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Search className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium mb-2">No jobs found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or check back later for new opportunities.
          </p>
          <Button onClick={clearFilters} variant="outline">
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <EnhancedJobCard 
              key={job.id} 
              job={job} 
              onOfferSubmitted={handleOfferSubmitted}
            />
          ))}
        </div>
      )}
    </div>
  );
}