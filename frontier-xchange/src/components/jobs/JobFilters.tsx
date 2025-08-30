import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { JOB_CATEGORIES, JOB_STATUSES, type JobCategory, type JobStatus, type JobFilters } from '@/types/job';
import { Filter, X } from 'lucide-react';

interface JobFiltersProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
}

export function JobFilters({ filters, onFiltersChange }: JobFiltersProps) {
  const updateFilters = (updates: Partial<JobFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const toggleCategory = (category: JobCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    updateFilters({ categories: newCategories });
  };

  const toggleStatus = (status: JobStatus) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter(s => s !== status)
      : [...filters.statuses, status];
    updateFilters({ statuses: newStatuses });
  };

  const clearFilters = () => {
    onFiltersChange({
      categories: [],
      statuses: [],
      budgetMin: undefined,
      budgetMax: undefined,
      dueSoon: false,
    });
  };

  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.statuses.length > 0 ||
    filters.budgetMin ||
    filters.budgetMax ||
    filters.dueSoon;

  return (
    <Card className="glass border-border-bright sticky top-20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Categories */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Categories</Label>
          <div className="space-y-2">
            {Object.entries(JOB_CATEGORIES).map(([key, label]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${key}`}
                  checked={filters.categories.includes(key as JobCategory)}
                  onCheckedChange={() => toggleCategory(key as JobCategory)}
                />
                <Label htmlFor={`category-${key}`} className="text-sm">
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Status</Label>
          <div className="space-y-2">
            {Object.entries(JOB_STATUSES).map(([key, label]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${key}`}
                  checked={filters.statuses.includes(key as JobStatus)}
                  onCheckedChange={() => toggleStatus(key as JobStatus)}
                />
                <Label htmlFor={`status-${key}`} className="text-sm">
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Range */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Budget Range (USD)</Label>
          <div className="space-y-2">
            <div>
              <Label htmlFor="budget-min" className="text-xs text-muted-foreground">Minimum</Label>
              <Input
                id="budget-min"
                type="number"
                placeholder="0"
                value={filters.budgetMin || ''}
                onChange={(e) => updateFilters({ 
                  budgetMin: e.target.value ? parseInt(e.target.value) : undefined 
                })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="budget-max" className="text-xs text-muted-foreground">Maximum</Label>
              <Input
                id="budget-max"
                type="number"
                placeholder="1000"
                value={filters.budgetMax || ''}
                onChange={(e) => updateFilters({ 
                  budgetMax: e.target.value ? parseInt(e.target.value) : undefined 
                })}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Due Soon */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="due-soon" className="text-sm font-medium">Due Soon</Label>
            <p className="text-xs text-muted-foreground mt-1">Jobs due within 7 days</p>
          </div>
          <Switch
            id="due-soon"
            checked={filters.dueSoon}
            onCheckedChange={(checked) => updateFilters({ dueSoon: checked })}
          />
        </div>
      </CardContent>
    </Card>
  );
}