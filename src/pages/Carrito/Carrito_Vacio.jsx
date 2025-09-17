import React from "react";
import{FaShoppingCart} from 'react-icons/fa'
import './CarritoVacio.css'

const EmptyCart = () =>{
    return(
        <div className="empty-cart-container">
            <FaShoppingCart className="cart-icon" />
            <p className="empty-cart-text">carrito vacío</p> 
        </div>
    );
};

export default EmptyCart;
