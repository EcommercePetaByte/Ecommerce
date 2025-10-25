// src/pages/Categoria/Categoria.jsx
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Categoria.css";
import React, { useState } from "react";
import { agregarAlCarrito } from "../../carrito";

export default function Categoria({ productos, isAuthenticated }) {
  const { nombreCategoria } = useParams();
  const [chatOpen, setChatOpen] = useState(false);
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  // Filtrar productos por categoría
  const productosFiltrados = productos.filter(
    (p) => p.categoria.toLowerCase() === nombreCategoria.toLowerCase()
  );

  // Función para agregar al carrito
  const handleAdd = (producto) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    agregarAlCarrito(producto);
    setToast(`${producto.name} agregado al carrito`);
    setTimeout(() => setToast(""), 1500);
  };

  // Formato de moneda
  const toARS = (n) =>
    Number(n).toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    });

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
              <article key={p.id} className="producto-card">
                {/* Imagen clickeable que lleva al detalle */}
                <Link to={`/producto/${p.id}`} className="img-wrap">
                  <img src={p.img} alt={p.name} className="producto-img" />
                </Link>

                {/* Nombre clickeable */}
                <h2 className="name">
                  <Link to={`/producto/${p.id}`}>{p.name}</Link>
                </h2>

                <p className="precio">{toARS(p.price)}</p>
                {p.descuento && <span className="descuento">-{p.descuento}%</span>}
                <p className="envio">
                  {p.envioGratis ? "🚚 Envío gratis" : "Envío disponible"}
                </p>

                {/* Botón para agregar al carrito */}
                <button className="btn-comprar" onClick={() => handleAdd(p)}>
                  Agregar al carrito
                </button>
              </article>
            ))}
          </div>
        ) : (
          <p>No hay productos en esta categoría.</p>
        )}

        {/* Toast */}
        {toast && <div className="toast">{toast}</div>}
      </main>

      {/* Chatbot flotante */}
      <button
  className="fab"
  title="Ayuda"
  onClick={() =>
    window.open(
      "https://agent.jotform.com/0199ee22e3507441ae60ecc8dc3dde4c9ec2",
      "_blank",
      "noopener,noreferrer"
    )
  }
>
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 5h16v10H7l-3 3V5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
</button>
      <Footer />
    </>
  );
}
