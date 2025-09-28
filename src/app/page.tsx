'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLaunches } from '@/hooks/useLaunches';
import { useFavorites } from '@/context/FavoritesContext';
import { FilterState, Launch } from '@/types/launch';
import SearchInput from '@/components/SearchInput';
import LaunchFilters from '@/components/LaunchFilters';
import LaunchCard from '@/components/LaunchCard';
import LaunchModal from '@/components/LaunchModal';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Rocket } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { launches, rockets, loading, error, filterLaunches } = useLaunches();
  const { favorites } = useFavorites();
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    year: 'all',
    successOnly: false,
    showFavorites: false,
  });
  
  const [selectedLaunch, setSelectedLaunch] = useState<Launch | null>(null);
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  const handleSearch = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search }));
  }, []);

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const handleLaunchClick = useCallback((launch: Launch) => {
    setSelectedLaunch(launch);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedLaunch(null);
  }, []);

  // Extract available years
  useEffect(() => {
    const years = [...new Set(launches.map(launch => launch.date_utc.substring(0, 4)))].sort().reverse();
    setAvailableYears(years);
  }, [launches]);

  // Memoize filtered launches
  const filteredLaunches = useMemo(() => {
    return filterLaunches(launches, filters, favorites);
  }, [launches, filters, favorites, filterLaunches]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-destructive" />
              Error Loading Data
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <Rocket className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-card-foreground">SpaceX Mission Explorer</h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button asChild variant="outline">
                <Link href="/favorites">
                  View Favorites ({favorites.length})
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <SearchInput onSearch={handleSearch} placeholder="Search missions by name..." />
        </div>

        <LaunchFilters 
          filters={filters}
          onFiltersChange={handleFiltersChange}
          availableYears={availableYears}
        />

        {loading ? (
          <LoadingSkeleton />
        ) : filteredLaunches.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Rocket className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No missions found</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLaunches.map(launch => (
              <LaunchCard
                key={launch.id}
                launch={launch}
                rocketName={rockets[launch.rocket] || 'Unknown Rocket'}
                onLaunchClick={handleLaunchClick}
              />
            ))}
          </div>
        )}

        <LaunchModal
          launch={selectedLaunch}
          rocketName={selectedLaunch ? rockets[selectedLaunch.rocket] || 'Unknown Rocket' : ''}
          isOpen={!!selectedLaunch}
          onClose={handleCloseModal}
        />
      </main>
    </div>
  );
}