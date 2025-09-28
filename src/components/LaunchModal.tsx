'use client';

import { Launch } from '@/types/launch';
import FavoriteButton from './FavoriteButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, X } from 'lucide-react';

interface LaunchModalProps {
  launch: Launch | null;
  rocketName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function LaunchModal({ launch, rocketName, isOpen, onClose }: LaunchModalProps) {
  if (!isOpen || !launch) return null;

  const launchDate = new Date(launch.date_utc).toLocaleDateString();
  const launchTime = new Date(launch.date_utc).toLocaleTimeString();

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{launch.name}</span>
            <FavoriteButton launchId={launch.id} size="md" />
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 sm:grid-cols-[auto_1fr]">
          <div className="flex-shrink-0">
            {launch.links.patch.large ? (
              <img
                src={launch.links.patch.large}
                alt={`${launch.name} patch`}
                className="w-32 h-32 object-contain"
              />
            ) : (
              <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground text-sm">No Image</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Rocket</h4>
                <p className="text-lg font-semibold">{rocketName}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Launch Date</h4>
                <p className="text-lg font-semibold">{launchDate}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Launch Time</h4>
                <p className="text-lg font-semibold">{launchTime}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                <Badge variant={getStatusVariant()} className="text-sm">
                  {getStatusText()}
                </Badge>
              </div>
            </div>

            {launch.details && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Details</h4>
                <p className="text-sm leading-relaxed">{launch.details}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              {launch.links.wikipedia && (
                <Button asChild variant="outline" className="flex items-center gap-2">
                  <a href={launch.links.wikipedia} target="_blank" rel="noopener noreferrer">
                    Wikipedia
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {launch.links.webcast && (
                <Button asChild className="flex items-center gap-2">
                  <a href={launch.links.webcast} target="_blank" rel="noopener noreferrer">
                    Watch Webcast
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}