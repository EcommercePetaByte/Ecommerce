// src/pages/DetalleProducto/DetalleProducto.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./DetalleProducto.css";

export default function DetalleProducto({ productos }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cantidad, setCantidad] = useState(1);
  const [envio, setEnvio] = useState("estandar"); // estandar o exprés

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

  // cálculo de descuento (ejemplo: 10% de descuento en ciertos productos)
  const descuento = producto.price > 50000 ? 0.1 : 0;
  const precioConDescuento = producto.price * (1 - descuento);

  // costo de envío
  const costoEnvio = envio === "expres" ? 1500 : 500;

  const subtotal = precioConDescuento * cantidad + costoEnvio;

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

            {descuento > 0 ? (
              <p className="detalle-price">
                <span className="original-price">
                  {producto.price.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    maximumFractionDigits: 0,
                  })}
                </span>{" "}
                <span className="discounted-price">
                  {precioConDescuento.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    maximumFractionDigits: 0,
                  })}
                </span>
              </p>
            ) : (
              <p className="detalle-price">
                {producto.price.toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  maximumFractionDigits: 0,
                })}
              </p>
            )}

            <p className="detalle-desc">
              Este es un texto de descripción para {producto.name}. Puedes agregar más información del producto como características técnicas, materiales, o compatibilidades.
            </p>

            <div className="detalle-options">
              <div className="cantidad">
                <label htmlFor="cantidad">Cantidad:</label>
                <input
                  type="number"
                  id="cantidad"
                  min="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(parseInt(e.target.value))}
                />
              </div>

              <div className="envio">
                <label>Envío:</label>
                <select value={envio} onChange={(e) => setEnvio(e.target.value)}>
                  <option value="estandar">Estándar - $500</option>
                  <option value="expres">Exprés - $1500</option>
                </select>
              </div>
            </div>

            <p className="subtotal">
              Subtotal:{" "}
              {subtotal.toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                maximumFractionDigits: 0,
              })}
            </p>

            <button className="comprar-btn">Agregar al carrito</button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}