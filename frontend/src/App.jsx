import { useEffect, useState } from 'react'
import { Route, Routes } from "react-router-dom";
import axios from 'axios'
import {Header} from './components/Header'
import {Drawer} from './components/Drawer'
import Home from './pages/Home'
import Favorites from './pages/Favorites'

export const App = () => {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [cartOpened, setCartOpened] = useState(false);

  useEffect(() => {
    axios.get('https://643ecf80c72fda4a0b01bac3.mockapi.io/items').then(res => {
          setItems(res.data);
        })
    axios.get('https://643ecf80c72fda4a0b01bac3.mockapi.io/cart').then(res => {
          setCartItems(res.data);
        })
  },[])
  const onAddToCart = (obj) => {
    axios
      .post('https://643ecf80c72fda4a0b01bac3.mockapi.io/cart', obj)
      .then((res) => setCartItems((state) => [...state, res.data]));
  }
  const onRemoveItem = (id) => {
    axios.delete(`https://643ecf80c72fda4a0b01bac3.mockapi.io/cart/${id }`)
    setCartItems(prev => prev.filter((item) => item.id!== id))
  }
  const onAddToFavorite = (obj) => {
    axios.setFavorites((prev) => [...prev, obj]);
  }
 

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value); 
  }

  return (
  <div className='wrapper'>
    {cartOpened && (
      <Drawer 
        onRemove={onRemoveItem}
        items ={cartItems} 
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
            onAddToFavorite={onAddToFavorite} 
            onAddToCart={onAddToCart}
          />
        }            
      />
      <Route path='/favorites' 
        element={
          <Favorites  
            items={favorites}
            onAddToFavorite={onAddToFavorite}
            />
        }
          />
    </Routes>
  </div>
 
  )
}

