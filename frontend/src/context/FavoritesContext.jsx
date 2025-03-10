import React, { createContext } from 'react';
import { useFavorites } from '../hooks/useFavorites';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const favoritesHook = useFavorites();

  return (
    <FavoritesContext.Provider value={favoritesHook}>
      {children}
    </FavoritesContext.Provider>
  );
}; 