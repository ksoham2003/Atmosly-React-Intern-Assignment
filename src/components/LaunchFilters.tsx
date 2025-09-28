'use client';

import { FilterState } from '@/types/launch';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface LaunchFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableYears: string[];
}

export default function LaunchFilters({ filters, onFiltersChange, availableYears }: LaunchFiltersProps) {
  const handleFilterChange = (key: keyof FilterState, value: string | boolean) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <div className="flex-1 w-full sm:w-auto">
            <Label htmlFor="year-select" className="mb-2 block">Launch Year</Label>
            <Select
              value={filters.year}
              onValueChange={(value) => handleFilterChange('year', value)}
            >
              <SelectTrigger id="year-select" className="w-full">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="success-only"
                checked={filters.successOnly}
                onCheckedChange={(checked) => handleFilterChange('successOnly', checked)}
              />
              <Label htmlFor="success-only" className="text-sm font-normal cursor-pointer">
                Successful Only
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="favorites-only"
                checked={filters.showFavorites}
                onCheckedChange={(checked) => handleFilterChange('showFavorites', checked)}
              />
              <Label htmlFor="favorites-only" className="text-sm font-normal cursor-pointer">
                Favorites Only
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}