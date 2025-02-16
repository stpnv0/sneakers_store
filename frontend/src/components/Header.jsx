import { Link } from "react-router-dom";

export const Header = (props) => {
    return (
        <header className='header'>
            <Link to="/">
                <div className='headerLeft'>
                    <img width={40} height={40} src="/public/img/logo.svg" alt="logo" />
                    <div className='headerInfo'>
                        <h3>React Sneakers</h3>
                        <p>Магазин лучших кроссовок</p>
                    </div>
                </div>
            </Link>

            <ul className='headerRight'>
                <li>
                    <img onClick={props.onClickCart} width={18} height={18} src="/img/cart.svg" alt="cart" />
                    <span>1205 руб</span>
                </li>
                <li>
                    <Link to="/favorites">
                        <img width={18} height={18} src="/img/Vector.png" alt="favorite" />
                    </Link>
                </li>
                <li>
                    <Link to="/login">
                        <img width={18} height={18} src='/img/user.svg' alt="user" />
                    </Link>
                </li>
            </ul>
        </header>
    );
};