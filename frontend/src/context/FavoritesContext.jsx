import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from '../api/axios';
import { logger } from '../utils/logger';

export const FavoritesContext = createContext({
  favorites: [],
  isFavorite: () => false,
  toggleFavorite: () => {},
  loading: false,
  error: null
});

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFavorites = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      logger.info('Пользователь не авторизован, избранное недоступно');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/v1/favorites');
      
      console.log('Получены данные избранного:', response.data);
      
      // Преобразуем данные в массив, если получен объект
      let favoritesArray = [];
      if (response.data && Array.isArray(response.data)) {
        favoritesArray = response.data;
      } else if (response.data && Array.isArray(response.data.favorites)) {
        favoritesArray = response.data.favorites;
      } else if (response.data && typeof response.data === 'object') {
        // Если данные - это объект, но не массив, пробуем извлечь информацию
        console.log('Данные избранного - объект, попытка извлечь массив');
        const possibleArrays = Object.values(response.data).filter(Array.isArray);
        if (possibleArrays.length > 0) {
          favoritesArray = possibleArrays[0];
        }
      }
      
      setFavorites(favoritesArray);
      logger.info('Избранное загружено', { count: favoritesArray.length });
    } catch (err) {
      logger.error('Ошибка при загрузке избранного:', err);
      if (err.response?.status === 401) {
        logger.warn('Требуется авторизация');
      }
      setError(err.response?.data?.error || 'Не удалось загрузить избранное');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const isFavorite = useCallback((itemId) => {
    if (!Array.isArray(favorites)) {
      console.warn('favorites не является массивом', favorites);
      return false;
    }
    return favorites.some(item => item.sneaker_id === itemId);
  }, [favorites]);

  const toggleFavorite = useCallback(async (itemId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Пожалуйста, войдите в аккаунт, чтобы добавить товар в избранное');
      return;
    }

    try {
      if (isFavorite(itemId)) {
        // Если товар уже в избранном - удаляем
        const item = favorites.find(item => item.sneaker_id === itemId);
        if (!item || !item.id) {
          console.warn('Не удалось найти ID записи для удаления из избранного', item);
          return;
        }
        
        await axios.delete(`/api/v1/favorites/${item.id}`);
        setFavorites(prevFavorites => prevFavorites.filter(item => item.sneaker_id !== itemId));
        logger.info('Товар удален из избранного', { itemId });
      } else {
        // Добавляем товар в избранное
        const response = await axios.post('/api/v1/favorites', { sneaker_id: itemId });
        const newItem = response.data;
        console.log('Ответ при добавлении в избранное:', newItem);
        
        setFavorites(prevFavorites => [...prevFavorites, newItem]);
        logger.info('Товар добавлен в избранное', { itemId });
      }
      
      // Обновляем данные с сервера
      await fetchFavorites();
    } catch (err) {
      logger.error('Ошибка при работе с избранным:', err);
      console.error('Детали ошибки:', err.response || err);
      setError(err.response?.data?.error || 'Не удалось изменить избранное');
    }
  }, [favorites, isFavorite, fetchFavorites]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, loading, error }}>
      {children}
    </FavoritesContext.Provider>
  );
}; 