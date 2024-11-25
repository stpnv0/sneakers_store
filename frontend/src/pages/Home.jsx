import {Card} from '../components/Card/Card'

function Home({ items,
                searchValue,
                setSearchValue,
                onChangeSearchInput, 
                onAddToFavorite,
                onAddToCart }) {
    return (
        <div className='content'>
          <div className='string'>
            <h1>{searchValue ? `поиск по запросу: "${searchValue}"` : `все кроссовки `}</h1>
            <div className='searchBlock'>
            <img src="/img/search.svg" alt="search" />
               { searchValue && 
               <img onClick={() => setSearchValue('')} 
               className='btnRemove' 
               src="/img/btnRemove.svg" 
               alt="remove" />}
             <input onChange={onChangeSearchInput} value={searchValue} type="text" placeholder='Поиск...'/>
            </div>
          </div>
        
          <div className='sneakers'>
            {items.filter((item) => item.title.toLowerCase().includes(searchValue.toLowerCase())).map((item, index ) => (
              <Card 
              key={index}
              title={item.title}
              price={item.price}
              imgUrl={item.imgUrl}
              onFavourite={(obj) =>onAddToFavorite(obj)}
              onPlus={(obj) => onAddToCart(obj)}
              />
            ))}
          </div>
      </div>
    );
}

export default Home;