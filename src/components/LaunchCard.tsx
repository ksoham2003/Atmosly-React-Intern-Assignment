'use client';

import { Launch } from '@/types/launch';
import FavoriteButton from './FavoriteButton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface LaunchCardProps {
  launch: Launch;
  rocketName: string;
  onLaunchClick: (launch: Launch) => void;
}

export default function LaunchCard({ launch, rocketName, onLaunchClick }: LaunchCardProps) {
  const launchDate = new Date(launch.date_utc).toLocaleDateString();
  const launchYear = new Date(launch.date_utc).getFullYear();

  const getStatusVariant = () => {
    if (launch.success === true) return 'default';
    if (launch.success === false) return 'destructive';
    return 'secondary';
  };

  const getStatusText = () => {
    if (launch.success === true) return 'Successful';
    if (launch.success === false) return 'Failed';
    return 'Upcoming';
  };

  const getStatusClass = () => {
    if (launch.success === true) return 'bg-green-500 hover:bg-green-600 text-white';
    if (launch.success === false) return 'bg-red-500 hover:bg-red-600 text-white';
    return '';
  };

  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-md hover:scale-105"
      onClick={() => onLaunchClick(launch)}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-3">
          {launch.links.patch.small && (
            <Image 
              src={launch.links.patch.small} 
              alt={`${launch.name} patch`}
              className="w-12 h-12 object-contain"
              width={18}
              height={18}
            />
          )}
          <div className="space-y-1">
            <h3 className="font-semibold leading-none">{launch.name}</h3>
            <p className="text-sm text-muted-foreground">{rocketName} • {launchYear}</p>
          </div>
        </div>
        <FavoriteButton launchId={launch.id} size="sm" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge 
              variant={getStatusVariant()}
              className={getStatusClass()}
            >
              {getStatusText()}
            </Badge>
            <span className="text-sm text-muted-foreground">{launchDate}</span>
          </div>
        </div>

        {launch.details && (
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{launch.details}</p>
        )}
      </CardContent>
    </Card>
  );
}