import { useState, useEffect, useContext } from 'react';
import { Card } from '../components/Card/Card';
import { FavoritesContext } from '../context/FavoritesContext';
import axios from '../api/axios';
import styles from './Favourites.module.scss';

export const Favourites = () => {
  const { favorites } = useContext(FavoritesContext);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavoriteItems = async () => {
      if (!favorites || favorites.length === 0) {
        setFavoriteItems([]);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/api/v1/items');
        const allItems = response.data;
        console.log('All items:', allItems);
        console.log('Favorites:', favorites);
        
        // Убедимся, что allItems это массив
        const itemsArray = Array.isArray(allItems) ? allItems : allItems.items || [];
        
        // Создаем Set из ID избранных товаров для быстрого поиска
        const favoriteIds = new Set(favorites.map(fav => fav.sneaker_id));
        
        // Фильтруем все товары, оставляя только те, которые в избранном
        const favoriteItems = itemsArray.filter(item => favoriteIds.has(item.id));
        console.log('Filtered favorite items:', favoriteItems);
        
        setFavoriteItems(favoriteItems);
      } catch (err) {
        console.error('Error fetching favorite items:', err);
        setError('Не удалось загрузить избранные товары');
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteItems();
  }, [favorites]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  if (!favoriteItems || favoriteItems.length === 0) {
    return <div>У вас пока нет избранных товаров</div>;
  }

  return (
    <div className={styles.favorites}>
      <h1>Мои закладки</h1>
      <div className={styles.sneakers}>
        {favoriteItems.map((item) => (
          <Card 
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            price={item.price}
            imgUrl={item.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}; 