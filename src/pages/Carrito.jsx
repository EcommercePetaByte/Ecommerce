import React,{useEffect, useState} from "react";
import Header from "../components/Header.jsx";
import{
  getCarrito,
  vaciarCarrito,
  quitarDelCarrito,
  actualizarCantidad,
  calculaTotal
} from "../carrito.js";
import "./Carrito.css"
import EmptyCart from "./CarritoVacio.jsx";// importamos el componente vacío
import { Link } from "react-router-dom";




export default function Carrito(){


    //Ejemplo de prdocutos cargados (podemos reemplazarlo por el estado con localStorage o contexto)

    const [productos, setProductos] = useState([]);
        
    // Cargar carrito al iniciar
        useEffect(()=>{
            setProductos(getCarrito());
        }, []);

 //Vaciar carrito
    const handleVaciar = () => {
      vaciarCarrito();
      setProductos([]);
    };

    // Eliminar producto
    const handleQuitar = (id) => {
      quitarDelCarrito(id);
      setProductos(getCarrito());
    };



    if (productos.length === 0) return(
      <div>
        <Header />
      <EmptyCart/>
       </div>
    );

    return (
      <div>
        <Header />
        <main className="carrito-container">
        <h1>Tu Carrito 🛒</h1>
        {/* Tabla de carrito */}
        <table className="carrito-tabla">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
              <th>Acción</th>
            </tr>
          </thead>
        <tbody>
        {productos.map((p) =>(
          <tr key={p.id}>
            <td>
              <img src={p.img} alt={p.name} className="producto-imagen"/>
            </td>
              <td>{p.name}</td>
                <td>{p.cantidad}</td>
                 <td>${p.price}</td>
                <td>${p.price * p.cantidad}</td>
            <td>
              <button className="btn-eliminar" onClick={() => handleQuitar(p.id)}>Eliminar</button>
            </td>
            </tr>
          ))}
        </tbody>
        </table>
        
        <div className="carrito-footer">
        <h2>Total: ${calculaTotal()}</h2>
        <div className="carrito-botones">
        <button onClick={handleVaciar} className="vaciar-btn">Vaciar Carrito</button>
        <Link to="/pago">
          <button  className="comprar-btn">Finalizar Compra</button>
        </Link>
        </div>
        </div>
        </main>
      </div>
    );
}