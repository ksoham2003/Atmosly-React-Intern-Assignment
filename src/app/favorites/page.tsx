'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useFavorites } from '@/context/FavoritesContext';
import { Launch } from '@/types/launch';
import LaunchCard from '@/components/LaunchCard';
import LaunchModal from '@/components/LaunchModal';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Rocket, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [favoriteLaunches, setFavoriteLaunches] = useState<Launch[]>([]);
  const [rockets, setRockets] = useState<Record<string, string>>({});
  const [selectedLaunch, setSelectedLaunch] = useState<Launch | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLaunchClick = useCallback((launch: Launch) => {
    setSelectedLaunch(launch);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedLaunch(null);
  }, []);

  const rocketNames = useMemo(() => rockets, [rockets]);

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

        const allLaunches: Launch[] = await launchesResponse.json();
        const rocketsData = await rocketsResponse.json();
        
        const rocketMap: Record<string, string> = {};
        rocketsData.forEach((rocket: any) => {
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
                Back to All Launches
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-primary fill-current" />
              <h1 className="text-2xl font-bold text-card-foreground">Favorite Missions</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteLaunches.map(launch => (
              <LaunchCard
                key={launch.id}
                launch={launch}
                rocketName={rocketNames[launch.rocket] || 'Unknown Rocket'}
                onLaunchClick={handleLaunchClick}
              />
            ))}
          </div>
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