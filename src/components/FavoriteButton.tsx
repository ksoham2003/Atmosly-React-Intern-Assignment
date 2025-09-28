'use client';

import { useFavorites } from '@/context/FavoritesContext';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

interface FavoriteButtonProps {
  launchId: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function FavoriteButton({ launchId, size = 'md' }: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  
  const favorite = isFavorite(launchId);
  
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorite) {
      removeFavorite(launchId);
    } else {
      addFavorite(launchId);
    }
  };

  return (
    <Button
      variant={favorite ? "default" : "outline"}
      size="icon"
      className={sizeClasses[size]}
      onClick={handleClick}
      aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Star className={`${iconSizes[size]} ${favorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
    </Button>
  );
}