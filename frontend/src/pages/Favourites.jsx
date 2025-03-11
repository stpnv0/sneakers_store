import { useState, useEffect, useContext } from 'react';
import { Card } from '../components/Card/Card';
import { FavoritesContext } from '../context/FavoritesContext';
import { ItemsContext } from '../context/ItemsContext';
import styles from './Favourites.module.scss';

export const Favourites = () => {
  const { favorites, loading: favoritesLoading, error: favoritesError } = useContext(FavoritesContext);
  const { items, loading: itemsLoading } = useContext(ItemsContext);
  const [favoriteItems, setFavoriteItems] = useState([]);

  useEffect(() => {
    if (!favorites || !items || favorites.length === 0 || items.length === 0) {
      setFavoriteItems([]);
      return;
    }

    try {
      console.log('Избранное:', favorites);
      console.log('Все товары:', items);
      
      // Создаем Set из ID избранных товаров для быстрого поиска
      const favoriteIds = new Set(favorites.map(fav => fav.sneaker_id));
      
      // Фильтруем все товары, оставляя только те, которые в избранном
      const favoriteItems = items.filter(item => favoriteIds.has(item.id));
      console.log('Отфильтрованные избранные товары:', favoriteItems);
      
      setFavoriteItems(favoriteItems);
    } catch (err) {
      console.error('Ошибка при обработке избранных товаров:', err);
    }
  }, [favorites, items]);

  const loading = favoritesLoading || itemsLoading;
  const error = favoritesError;

  if (loading) {
    return (
      <div className={styles.favorites}>
        <h1>Мои закладки</h1>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.favorites}>
        <h1>Мои закладки</h1>
        <div className={styles.error}>Ошибка: {error}</div>
      </div>
    );
  }

  return (
    <div className={styles.favorites}>
      <h1>Мои закладки</h1>
      {favoriteItems.length > 0 ? (
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
      ) : (
        <div className={styles.empty}>
          <p>У вас пока нет избранных товаров</p>
          <p>Добавьте товары в избранное, нажав на сердечко на карточке товара</p>
        </div>
      )}
    </div>
  );
}; 