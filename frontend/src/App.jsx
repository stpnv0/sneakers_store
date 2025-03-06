import { useEffect, useState } from 'react'
import { Route, Routes } from "react-router-dom";
import axios from 'axios'
import {Header} from './components/Header'
import {Drawer} from './components/Drawer'
import Home from './pages/Home'
import { Favourites } from './pages/Favourites'
import Login from './pages/Login'
import { FavoritesProvider } from './context/FavoritesContext'

export const App = () => {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [cartOpened, setCartOpened] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const itemsResponse = await fetch('http://localhost:8080/api/v1/items', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        
        const data = await itemsResponse.json();
        console.log('Fetched items:', data);
        if (Array.isArray(data)) {
          setItems(data);
        } else if (data && Array.isArray(data.items)) {
          setItems(data.items);
        } else {
          console.error('Unexpected items response format:', data);
          setItems([]);
        }
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
        setItems([]);
      }
    }
    
    fetchData();
  }, []);

  const onAddToCart = (obj) => {
    axios
      .post('https://643ecf80c72fda4a0b01bac3.mockapi.io/cart', obj)
      .then((res) => setCartItems((state) => [...state, res.data]));
  }
  const onRemoveItem = (id) => {
    axios.delete(`https://643ecf80c72fda4a0b01bac3.mockapi.io/cart/${id}`)
    setCartItems(prev => prev.filter((item) => item.id !== id))
  }

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value); 
  }

  return (
    <FavoritesProvider>
      <div className='wrapper'>
        {cartOpened && (
          <Drawer 
            onRemove={onRemoveItem}
            items={cartItems} 
            onClose={() => setCartOpened(false)}
          />
        )}
        <Header onClickCart={() => setCartOpened(true)}/>
        <Routes>
          <Route path="/" 
            element={
              <Home
                items={items} 
                searchValue={searchValue} 
                setSearchValue={setSearchValue} 
                onChangeSearchInput={onChangeSearchInput}
                onAddToCart={onAddToCart}
              />
            }            
          />
          <Route path='/favorites' 
            element={<Favourites />}
          />
          <Route path="/login" 
            element={<Login />} 
          />
        </Routes>
      </div>
    </FavoritesProvider>
  )
}

