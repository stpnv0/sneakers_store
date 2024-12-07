// import { Button } from "../Button";
 
import styles from "./styles.module.scss"
import {useState} from 'react';

export const Card = ({title, description, imgUrl, price, onPlus, onFavourite, favorited }) => {

  const[isAdded, setIsAdded] = useState(false);
  const[isFavorite, setIsFavorite] = useState(favorited);

  const onClickPlus = () => {
    onPlus({title, imgUrl,price});
    setIsAdded(!isAdded);
  };

  const onClickFavorite = () => {
    setIsFavorite(!isFavorite);
  };
 
  return(
    <div className={styles.card}>
      <div className={styles.favorite} >
      <img 
      onClick={onClickFavorite}
      src={isFavorite ? '/img/liked.svg' : '/img/unliked.svg'}
      alt="favorite" />
      </div>
      
        {/* <HeartButton /> */}
      <img width={133} height={112} src={imgUrl} alt="sneakers" />
      <h5>{title}</h5>
      <div className={styles.cardButton}>
        <div className={styles.price}>
          <span>Цена:</span>
          <b>{price} руб.</b>
        </div>
        <img 
         className={styles.btn}
         onClick={onClickPlus}
         src={isAdded ? '/img/checked.svg' :  '/img/plus.svg'}
         alt="Plus" />
        {/* <Button /> */}
      </div>
</div>
  );
}