'use client';

import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'coin-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setFavorites(new Set(parsed));
      } catch (error) {
        console.error('Failed to parse favorites:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  const toggleFavorite = (coinId: string): boolean => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      const isAdding = !newFavorites.has(coinId);

      if (isAdding) {
        newFavorites.add(coinId);
      } else {
        newFavorites.delete(coinId);
      }

      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...newFavorites]));
      return newFavorites;
    });

    return !favorites.has(coinId);
  };

  const isFavorite = (coinId: string): boolean => {
    return favorites.has(coinId);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    isLoaded,
  };
}
