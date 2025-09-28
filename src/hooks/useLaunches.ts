import { useState, useEffect } from 'react';
import { Launch, Rocket, FilterState } from '@/types/launch';

export function useLaunches() {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [rockets, setRockets] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch launches
        const launchesResponse = await fetch('https://api.spacexdata.com/v4/launches');
        const launchesData: Launch[] = await launchesResponse.json();
        
        // Fetch rockets
        const rocketsResponse = await fetch('https://api.spacexdata.com/v4/rockets');
        const rocketsData: Rocket[] = await rocketsResponse.json();
        
        // Create rocket name mapping
        const rocketMap: Record<string, string> = {};
        rocketsData.forEach(rocket => {
          rocketMap[rocket.id] = rocket.name;
        });

        setLaunches(launchesData);
        setRockets(rocketMap);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterLaunches = (launches: Launch[], filters: FilterState, favorites: string[]) => {
    let filtered = launches;

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(launch =>
        launch.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply year filter - handle "all" value
    if (filters.year && filters.year !== 'all') {
      filtered = filtered.filter(launch =>
        launch.date_utc.startsWith(filters.year)
      );
    }

    // Apply success filter
    if (filters.successOnly) {
      filtered = filtered.filter(launch => launch.success === true);
    }

    // Apply favorites filter
    if (filters.showFavorites) {
      filtered = filtered.filter(launch => favorites.includes(launch.id));
    }

    return filtered;
  };

  return {
    launches,
    rockets,
    loading,
    error,
    filterLaunches,
  };
}