// src/pages/DetalleProducto/DetalleProducto.jsx
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./DetalleProducto.css";

export default function DetalleProducto({ productos }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // buscamos el producto según el id
  const producto = productos.find((p) => p.id === parseInt(id));

  if (!producto) {
    return (
      <>
        <Header />
        <main className="detalle-container">
          <h2>Producto no encontrado</h2>
          <button className="volver-btn" onClick={() => navigate(-1)}>
            ← Volver
          </button>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="detalle-container">
        <button className="volver-btn" onClick={() => navigate(-1)}>
          ← Volver
        </button>

        <div className="detalle-card">
          <img
            className="detalle-img"
            src={producto.img}
            alt={producto.name}
          />

          <div className="detalle-info">
            <h1>{producto.name}</h1>
            <p className="detalle-price">
              {producto.price.toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                maximumFractionDigits: 0,
              })}
            </p>
            <p className="detalle-desc">
              Este es un texto de descripción para {producto.name}.  
              (Acá podrías traer la descripción real desde tu base o API).
            </p>

            <button className="comprar-btn">Agregar al carrito</button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
