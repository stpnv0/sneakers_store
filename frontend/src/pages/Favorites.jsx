import {Card} from '../components/Card/Card'

function Favorites({items, onAddToFavorite }) {
    return (
        <div className='content'>
          <div className='string'>
            <h1>Мои Закладки</h1>
          </div>
            <div className='sneakers'>
              {items.map((item, index ) => (
                <Card 
                key={index}
                title={item.title}
                price={item.price}
                imgUrl={item.imgUrl}
                onFavourite={onAddToFavorite}
                favorited={true}
                />
              ))}
            </div>
        </div>
    );
}

export default Favorites;