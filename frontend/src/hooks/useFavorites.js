import { useState, useEffect, useCallback } from 'react';
import axios from '../api/axios';
import { logger } from '../utils/logger';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAuthError = useCallback(() => {
    logger.warn('Требуется авторизация');
    localStorage.removeItem('token');
  }, []);

  const fetchFavorites = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      logger.info('Пользователь не авторизован');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/v1/favorites');
      setFavorites(response.data.favorites || []);
      logger.info('Избранное загружено', { count: response.data.favorites?.length || 0 });
    } catch (err) {
      logger.error('Ошибка при загрузке избранного:', err);
      if (err.response?.status === 401) {
        handleAuthError();
      }
      setError(err.response?.data?.error || 'Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  }, [handleAuthError]);

  const addToFavorites = useCallback(async (sneakerId) => {
    if (!sneakerId) {
      logger.error('sneakerId не определен');
      return false;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Пожалуйста, войдите в аккаунт');
      return false;
    }

    try {
      await axios.post('/api/v1/favorites', {
        sneaker_id: sneakerId
      });
      
      // Оптимистичное обновление UI
      setFavorites(prev => [...prev, { sneaker_id: sneakerId }]);
      logger.info('Товар добавлен в избранное', { sneakerId });
      
      // Синхронизация с сервером
      await fetchFavorites();
      return true;
    } catch (err) {
      logger.error('Ошибка при добавлении в избранное:', err);
      if (err.response?.status === 401) {
        handleAuthError();
      }
      return false;
    }
  }, [fetchFavorites, handleAuthError]);

  const removeFromFavorites = useCallback(async (sneakerId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Пожалуйста, войдите в аккаунт');
      return false;
    }

    try {
      await axios.delete(`/api/v1/favorites/${sneakerId}`);
      
      // Оптимистичное обновление UI
      setFavorites(prev => prev.filter(fav => fav.sneaker_id !== sneakerId));
      logger.info('Товар удален из избранного', { sneakerId });
      
      // Синхронизация с сервером
      await fetchFavorites();
      return true;
    } catch (err) {
      logger.error('Ошибка при удалении из избранного:', err);
      if (err.response?.status === 401) {
        handleAuthError();
      }
      setError(err.response?.data?.error || 'Failed to remove from favorites');
      return false;
    }
  }, [fetchFavorites, handleAuthError]);

  const isFavorite = useCallback((sneakerId) => {
    return favorites.some(fav => fav.sneaker_id === sneakerId);
  }, [favorites]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchFavorites();
    }
  }, [fetchFavorites]);

  return {
    favorites,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    fetchFavorites
  };
};