'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useFavorites } from '@/context/FavoritesContext';
import { Launch } from '@/types/launch';
import LaunchCard from '@/components/LaunchCard';
import LaunchModal from '@/components/LaunchModal';
import Pagination from '@/components/Pagination';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const ITEMS_PER_PAGE_OPTIONS = [12, 24, 48, 96];

interface RocketApiResponse {
  id: string;
  name: string;
}

interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [favoriteLaunches, setFavoriteLaunches] = useState<Launch[]>([]);
  const [rockets, setRockets] = useState<Record<string, string>>({});
  const [selectedLaunch, setSelectedLaunch] = useState<Launch | null>(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 12,
    totalItems: 0,
    totalPages: 0,
  });

  const handleLaunchClick = useCallback((launch: Launch) => {
    setSelectedLaunch(launch);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedLaunch(null);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleItemsPerPageChange = useCallback((value: string) => {
    const itemsPerPage = parseInt(value);
    setPagination(prev => ({
      ...prev,
      itemsPerPage,
      currentPage: 1,
    }));
  }, []);

  const rocketNames = useMemo(() => rockets, [rockets]);

  // Calculate paginated favorites
  const paginatedFavorites = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return favoriteLaunches.slice(startIndex, endIndex);
  }, [favoriteLaunches, pagination.currentPage, pagination.itemsPerPage]);

  useEffect(() => {
    const fetchFavoriteLaunches = async () => {
      if (favorites.length === 0) {
        setFavoriteLaunches([]);
        setLoading(false);
        return;
      }

      try {
        const [launchesResponse, rocketsResponse] = await Promise.all([
          fetch('https://api.spacexdata.com/v4/launches'),
          fetch('https://api.spacexdata.com/v4/rockets')
        ]);

        if (!launchesResponse.ok || !rocketsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const allLaunches: Launch[] = await launchesResponse.json();
        const rocketsData: RocketApiResponse[] = await rocketsResponse.json();
        
        const rocketMap: Record<string, string> = {};
        rocketsData.forEach((rocket: RocketApiResponse) => {
          rocketMap[rocket.id] = rocket.name;
        });

        const favoritesData = allLaunches.filter(launch => favorites.includes(launch.id));
        
        setFavoriteLaunches(favoritesData);
        setRockets(rocketMap);
      } catch (error) {
        console.error('Error fetching favorite launches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteLaunches();
  }, [favorites]);

  // Update pagination totals when favorites change
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      totalItems: favoriteLaunches.length,
      totalPages: Math.ceil(favoriteLaunches.length / prev.itemsPerPage),
    }));
  }, [favoriteLaunches.length, pagination.itemsPerPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading favorites...</p>
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
            <Button asChild variant="ghost">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className='max-sm:hidden'>Back to All Launches</span>
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-primary fill-current max-sm:h-4 max-sm:w-4" />
              <h1 className="text-2xl font-bold text-card-foreground max-sm:text-sm">Favorite Missions</h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="w-4"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favoriteLaunches.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Heart className="h-6 w-6 text-muted-foreground" />
              </div>
              <CardTitle className="mb-2">No favorite missions yet</CardTitle>
              <CardDescription className="text-center max-w-sm mb-4">
                Start adding missions to your favorites by clicking the star icon on any mission card.
              </CardDescription>
              <Button asChild>
                <Link href="/">
                  Browse Missions
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Results Count and Items Per Page Selector */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="text-sm text-muted-foreground">
                Showing {paginatedFavorites.length} of {favoriteLaunches.length} favorite missions
                {pagination.totalPages > 1 && ` (Page ${pagination.currentPage} of ${pagination.totalPages})`}
              </div>
              
              <div className="flex items-center gap-2">
                <Label htmlFor="items-per-page" className="text-sm whitespace-nowrap">
                  Items per page:
                </Label>
                <Select
                  value={pagination.itemsPerPage.toString()}
                  onValueChange={handleItemsPerPageChange}
                >
                  <SelectTrigger id="items-per-page" className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ITEMS_PER_PAGE_OPTIONS.map(option => (
                      <SelectItem key={option} value={option.toString()}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedFavorites.map(launch => (
                <LaunchCard
                  key={launch.id}
                  launch={launch}
                  rocketName={rocketNames[launch.rocket] || 'Unknown Rocket'}
                  onLaunchClick={handleLaunchClick}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}

        <LaunchModal
          launch={selectedLaunch}
          rocketName={selectedLaunch ? rocketNames[selectedLaunch.rocket] || 'Unknown Rocket' : ''}
          isOpen={!!selectedLaunch}
          onClose={handleCloseModal}
        />
      </main>
    </div>
  );
}