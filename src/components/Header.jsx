import React from "react";
import{Container, Navbar, Nav, Form, FormControl, Button, InputGroup}from 'react-bootstrap';
import {FaShoppingCart, FaUser, FaSun, FaBars} from 'react-icons/fa';
import './Header.css'; //Creamos este archivo en el css
import { Link } from "react-router-dom";


export default function Header(){
    return(
        <header className="navbar">
            <Link to="/" className="logo"> 
            <span className="logo-text">PETA</span>
            <span className="logo-byte">BYTE</span>
            </Link>

        {/* iCONO DE CARRITO QUE LLEVA A LA PÁGINA DE CARRITO    */}

        <Link to="/carrito" className="cart-icon" title="Carrito" aria-label="Carrito">
      </Link>
        </header>
    );
}