// src/pages/Categoria/Categoria.jsx
import { useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Chatbot from "../../components/Chatbot/Chatbot";
import "./Categoria.css";
import React, { useState } from "react";


export default function Categoria({ productos }) {
  const { nombreCategoria } = useParams();
  const [chatOpen, setChatOpen] = useState(false);

  // Filtrar productos por categoría
  const productosFiltrados = productos.filter(
    (p) => p.categoria.toLowerCase() === nombreCategoria.toLowerCase()
  );

  return (
    <>
      <Header />
      <main style={{ padding: "30px" }}>
        <h1 style={{ marginBottom: "20px" }}>
          Categoría: <span style={{ color: "var(--brand)" }}>{nombreCategoria}</span>
        </h1>

        {productosFiltrados.length > 0 ? (
          <div className="categoria-grid">
            {productosFiltrados.map((p) => (
              <div key={p.id} className="producto-card">
                {/* ✅ Corregido de p.image a p.img */}
                <img src={p.img} alt={p.name} className="producto-img" />
                <h2>{p.name}</h2>
                <p className="precio">${p.price}</p>
                {p.descuento && <span className="descuento">-{p.descuento}%</span>}
                <p className="envio">{p.envioGratis ? "🚚 Envío gratis" : "Envío disponible"}</p>
                <button className="btn-comprar">Agregar al carrito</button>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay productos en esta categoría.</p>
        )}
    
      </main>
      {/** Chatbot - botón flotante */}
              <button className="fab" title="Ayuda" onClick={() => setChatOpen(!chatOpen)}>
               <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                 <path d="M4 5h16v10H7l-3 3V5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
               </svg>
            </button>
            
            {chatOpen && <Chatbot />}
      <Footer />
    </>
  );
}