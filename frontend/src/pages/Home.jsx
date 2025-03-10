import {Card} from '../components/Card/Card'

function Home({ 
  items = [],
  searchValue,
  setSearchValue,
  onChangeSearchInput,
  onAddToCart 
}) {
    console.log('Home items:', items);

    return (
        <div className='content'>
          <div className='string'>
            <h1>{searchValue ? `поиск по запросу: "${searchValue}"` : `Все кроссовки `}</h1>
            <div className='searchBlock'>
              <img src="/img/search.svg" alt="search" />
              {searchValue && 
                <img 
                  onClick={() => setSearchValue('')} 
                  className='btnRemove' 
                  src="/img/btnRemove.svg" 
                  alt="remove" 
                />
              }
              <input 
                onChange={onChangeSearchInput} 
                value={searchValue} 
                type="text" 
                placeholder='Поиск...'
              />
            </div>
          </div>
        
          <div className='sneakers'>
            {Array.isArray(items) && items
              .filter((item) => item.title?.toLowerCase().includes(searchValue?.toLowerCase() || ''))
              .map((item) => {
                console.log('Rendering item:', item);
                return (
                  <Card 
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    description={item.description}
                    price={item.price}
                    imgUrl={item.imageUrl}
                    onPlus={(obj) => onAddToCart(obj)}
                  />
                );
              })
            }
          </div>
      </div>
    );
}

export default Home;