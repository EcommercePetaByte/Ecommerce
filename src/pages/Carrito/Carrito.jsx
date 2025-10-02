import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header.jsx";
import Chatbot from "../../components/ChatBot/ChatBot.jsx";
import {
  getCarrito,
  vaciarCarrito,
  quitarDelCarrito,
  actualizarCantidad,
  calculaTotal
} from "../../carrito.js";
import "./Carrito.css";
import EmptyCart from "./Carrito_Vacio.jsx";
import { useNavigate } from "react-router-dom";

export default function Carrito() {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false); // Parte del chatbot


  useEffect(() => {
    setProductos(getCarrito());
  }, []);

  // Vaciar carrito
  const handleVaciar = () => {
    vaciarCarrito();
    setProductos([]);
  };

  // Eliminar producto
  const handleQuitar = (id) => {
    quitarDelCarrito(id);
    setProductos(getCarrito());
  };

  // Aumentar cantidad
  const handleSumar = (id) => {
    const producto = productos.find(p => p.id === id);
    if (producto) {
      actualizarCantidad(id, producto.cantidad + 1);
      setProductos(getCarrito());
    }
  };

  // Disminuir cantidad
  const handleRestar = (id) => {
    const producto = productos.find(p => p.id === id);
    if (producto && producto.cantidad > 1) {
      actualizarCantidad(id, producto.cantidad - 1);
      setProductos(getCarrito());
    }
  };

  if (productos.length === 0) return (
    <div>
      <Header />
      <EmptyCart />
    </div>
  );

  return (
    <div>
      <Header />
      <main className="carrito-container">
        <h1>Tu Carrito 🛒</h1>
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
            {productos.map((p) => (
              <tr key={p.id}>
                <td>
                  <img src={p.img} alt={p.name} className="producto-imagen"/>
                </td>
                <td>{p.name}</td>
                <td>
                  <button onClick={() => handleRestar(p.id)} className="cantidad-btn">-</button>
                  <span className="cantidad-text">{p.cantidad}</span>
                  <button onClick={() => handleSumar(p.id)} className="cantidad-btn">+</button>
                </td>
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
          <div className="acciones-footer">
            <button onClick={handleVaciar} className="vaciar-btn">Vaciar Carrito</button>
            <button onClick={() => navigate("/pago")} className="comprar-btn">Finalizar Compra</button>
            <button onClick={() => navigate("/")} className="seguir-btn">Seguir Comprando</button>
          </div>
        </div>

             {/* ------------------------ ChatBot ------------------------- */}
                    <button className="fab" title="Ayuda" onClick={() => setChatOpen(!chatOpen)}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M4 5h16v10H7l-3 3V5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                      </svg>
                    </button>
            
                    {chatOpen && <Chatbot />}

      </main>
    </div>
  );
}
