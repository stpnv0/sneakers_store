import { Link } from "react-router-dom";

export const Header = (props) => {
    
    return (
    <header className='header' >
      <Link to="/">
    <div className='headerLeft'>
    <img width={40} height={40} src="/public/img/logo.svg" />
    <div className='headerInfo'>
      <h3>React Sneakers</h3>
      <p>Магазин лучших кросовок</p>
      </div>
      </div>
      </Link>

      <ul className='headerRight'>
        <li>
          <img  onClick={props.onClickCart} width={18} height={18} src="/img/cart.svg" />
          <span>1205 руб</span>
        </li>
        <li>
          <Link to="/favorites"  >
            <img onClick={props.onPageFavorite} width={18} height={18} src="/img/Vector.png" alt="favorite" />
          </Link>
        </li>
        <li>
          <img width={18} height={18} src='/img/user.svg'/>
        </li>
      </ul>
    </header>
    )
}