'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (launchId: string) => void;
  removeFavorite: (launchId: string) => void;
  isFavorite: (launchId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('spacex-favorites');
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  const addFavorite = (launchId: string) => {
    const updated = [...favorites, launchId];
    setFavorites(updated);
    localStorage.setItem('spacex-favorites', JSON.stringify(updated));
  };

  const removeFavorite = (launchId: string) => {
    const updated = favorites.filter(id => id !== launchId);
    setFavorites(updated);
    localStorage.setItem('spacex-favorites', JSON.stringify(updated));
  };

  const isFavorite = (launchId: string) => favorites.includes(launchId);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};