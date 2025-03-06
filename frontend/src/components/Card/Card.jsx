import styles from "./styles.module.scss"
import { useState, memo } from 'react';
import { HeartButton } from '../HeartButton/HeartButton';
import { logger } from '../../utils/logger';

export const Card = memo(({ id, title, description, imgUrl, price, onPlus }) => {
  const [isAdded, setIsAdded] = useState(false);

  const handlePlusClick = () => {
    onPlus?.({ id, title, imgUrl, price });
    setIsAdded(!isAdded);
  };

  const handleImageError = (e) => {
    logger.warn('Ошибка загрузки изображения', { imgUrl });
    e.target.src = '/img/sneakers/1.jpg'; // Fallback изображение
  };

  return (
    <div className={styles.card}>
      <div className={styles.favorite}>
        <HeartButton sneakerId={id} />
      </div>
      <img 
        width={133} 
        height={112} 
        src={imgUrl} 
        alt={title}
        onError={handleImageError}
      />
      <h5>{title}</h5>
      <div className={styles.cardButton}>
        <div className={styles.price}>
          <span>Цена:</span>
          <b>{price} руб.</b>
        </div>
        <img
          className={styles.btn}
          onClick={handlePlusClick}
          src={isAdded ? '/img/checked.svg' : '/img/plus.svg'}
          alt="Plus"
        />
      </div>
    </div>
  );
});
