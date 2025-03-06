import styles from './styles.module.scss';
import { memo, useContext, useCallback } from 'react';
import { FavoritesContext } from '../../context/FavoritesContext';
import { logger } from '../../utils/logger';

export const HeartButton = memo(({ sneakerId }) => {
  if (!sneakerId) {
    logger.error('HeartButton: отсутствует sneakerId');
    return null;
  }
  
  const { isFavorite, addToFavorites, removeFromFavorites } = useContext(FavoritesContext);
  const isLiked = isFavorite(sneakerId);

  const handleClick = useCallback(async (e) => {
    e.preventDefault(); // Предотвращаем всплытие события
    try {
      if (isLiked) {
        await removeFromFavorites(sneakerId);
      } else {
        await addToFavorites(sneakerId);
      }
    } catch (error) {
      logger.error('Ошибка при изменении статуса избранного:', error);
    }
  }, [isLiked, sneakerId, addToFavorites, removeFromFavorites]);

  return (
    <button 
      className={styles.favorite} 
      onClick={handleClick}
      aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
    >
      <img 
        width={35} 
        height={35} 
        src={isLiked ? "/img/liked.svg" : "/img/unliked.svg"} 
        alt="heart" 
      />
    </button>
  );
});