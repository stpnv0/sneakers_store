export const Drawer = ({items =[], onClose, onRemove}) => {
  const onDeleteCart = () => {
    onDelete(items)
  }
    return(
      <div className="overlay">
        <div className='drawer'>
        <h2>Корзина <img onClick={onClose} className='btnRemove' src="/img/btnRemove.svg" alt="remove" /></h2>

        {items.length > 0 ?  
          <div><div className="items">
        {items.map((obj) => (
        <div className="cartItem">
          <img src={obj.imgUrl} alt="sneakers" 
          className="cartItemImg" />
            <div className='description'>
              <p>{obj.title}</p> 
              <b>{obj.price} руб.</b>
            </div>
          <img onClick={() => onRemove(obj.id)} className='btnRemove' src="/img/btnRemove.svg" alt="remove" />
        </div>
          ))}
        </div> <div className='cartTotalBlock'>
          <ul className='cartTotalBlock'>
          <li> 
            <span>Итого:</span>
            <div></div> 
            <b>21 428 руб.</b>
          </li>
          <li>
            <span>Налог 5%:</span>
            <div></div> 
            <b>1024 руб.</b>
            </li>
        </ul>
        <button className='greenBtn'>Оформить заказ <img src="/img/arrow.svg" alt="arrow" /></button>
       
          </div></div>
         : <div className="emptyCart">
          <img width={140} height={140} src="/img/emptyCart.jpg" alt="empty" />
          <h2>Корзина пустая</h2>
          <p>Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ.</p>
          <button onClick={onClose} className="greenBtn"> <img src="/img/arrow.svg" alt="arrow" />Вернуться назад</button>
        </div>}
   
      </div>
      </div>
    )
}