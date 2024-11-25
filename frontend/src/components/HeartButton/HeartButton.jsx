import styles from './styles.module.scss';
import React, {useState} from 'react';

export const HeartButton = () => {

  const [isLiked, setIsLiked] = useState(false)
  const imageSrc = isLiked ? "/img/liked.svg" : "/img/unliked.svg"

    return(
        <button className={styles.favorite} onClick={() => setIsLiked(!isLiked)}>
          <img width={35} height={35} src={imageSrc} alt="heart" />
        </button>
    )
}