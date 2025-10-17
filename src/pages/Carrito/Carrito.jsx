import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header/Header.jsx";
import {
  getCarrito,
  vaciarCarrito,
  quitarDelCarrito,
  actualizarCantidad,
} from "../../carrito.js";
import EmptyCart from "./Carrito_Vacio.jsx";
import "./Carrito.css";
import { Trash2, Tag, Truck } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import Chatbot from "../../components/Chatbot/Chatbot.jsx";

// --- Stepper ---
function DecreaseButton({ onClick }) {
  return (
    <button className="stepper-decrease" onClick={onClick} aria-label="Disminuir">-</button>
  );
}

function Quantity({ value }) {
  return <span className="stepper-qty">{value}</span>;
}

function IncreaseButton({ onClick }) {
  return (
    <button className="stepper-increase" onClick={onClick} aria-label="Aumentar">+</button>
  );
}

export default function Carrito() {
  const [productos, setProductos] = useState([]);
  const [shipping, setShipping] = useState("estandar");
  const [coupon, setCoupon] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const navigate = useNavigate();

  // Carga inicial
  useEffect(() => {
    setProductos(getCarrito());
  }, []);

  // Actualiza carrito automáticamente si cambia en otra pestaña
  useEffect(() => {
    const handleStorage = () => setProductos(getCarrito());
    const handleCustom = () => setProductos(getCarrito());

    window.addEventListener("storage", handleStorage);
    window.addEventListener("carritoActualizado", handleCustom);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("carritoActualizado", handleCustom);
    };
  }, []);

  const toARS = (n) =>
    Number(n).toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

  // Totales
  const { items, subtotal } = useMemo(() => {
    const items = productos.reduce((a, p) => a + p.cantidad, 0);
    const subtotal = productos.reduce((a, p) => a + p.price * p.cantidad, 0);
    return { items, subtotal };
  }, [productos]);

  const envioCosto = shipping === "expres" ? 1500 : 500;
  const descuentoCup = coupon.trim().toUpperCase() === "PETA10" ? Math.round(subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal - descuentoCup) + (productos.length ? envioCosto : 0);

  // Handlers
  const refresh = () => setProductos(getCarrito());

  const handleVaciar = () => {
    if (window.confirm("¿Vaciar carrito?")) {
      vaciarCarrito();
      setProductos([]);
    }
  };

  const handleQuitar = (id) => { quitarDelCarrito(id); refresh(); };

  const handleSumar = (id) => {
    const p = productos.find((x) => x.id === id);
    if (p) { actualizarCantidad(id, p.cantidad + 1); refresh(); }
  };

  const handleRestar = (id) => {
    const p = productos.find((x) => x.id === id);
    if (p) { actualizarCantidad(id, p.cantidad - 1); refresh(); }
  };

  if (productos.length === 0) {
    return (
      <div>
        <Header />
        <EmptyCart />
      </div>
    );
  }

  return (
    <div>
      <Header />

      <main className="cart-wrap">
        <div className="cart-head">
          <h1>Tu carrito</h1>
          <span className="muted">{items} {items === 1 ? "item" : "items"}</span>
        </div>

        <section className="cart-grid">
          {/* Lista */}
          <div className="cart-list">
            {productos.map((p) => (
              <article key={p.id} className="line">
                <img src={p.img} alt={p.name} className="thumb" />
                <div className="line-info">
                  <Link to={`/producto/${p.id}`} className="name">{p.name}</Link>
                  <div className="meta">
                    <span className="price-unit">{toARS(p.price)}</span>
                  </div>

                  <div className="controls">
                    <div className="stepper horizontal">
                      <DecreaseButton onClick={() => handleRestar(p.id)} />
                      <Quantity value={p.cantidad} />
                      <IncreaseButton onClick={() => handleSumar(p.id)} />
                    </div>

                    <button className="remove" onClick={() => handleQuitar(p.id)}>
                      <Trash2 size={16} /> Quitar
                    </button>
                  </div>
                </div>

                <div className="line-subtotal">{toARS(p.price * p.cantidad)}</div>
              </article>
            ))}

            <div className="cart-actions">
              <button className="btn ghost" onClick={() => navigate("/")}>Seguir comprando</button>
              <button className="btn danger" onClick={handleVaciar}>Vaciar carrito</button>
            </div>
          </div>

          {/* Resumen */}
          <aside className="cart-summary">
            <h2>Resumen</h2>

            <div className="row">
              <span>Subtotal</span>
              <strong>{toARS(subtotal)}</strong>
            </div>

            <div className="row">
              <span>Envío</span>
              <div className="ship">
                <select value={shipping} onChange={(e) => setShipping(e.target.value)}>
                  <option value="estandar">Estándar · {toARS(500)}</option>
                  <option value="expres">Exprés · {toARS(1500)}</option>
                </select>
                <span className="eta"><Truck size={14}/> llega aprox. en {shipping === "expres" ? "2" : "5"} días</span>
              </div>
            </div>

            <div className="row coupon">
              <div className="coupon-field">
                <Tag size={16} />
                <input
                  type="text"
                  placeholder="Cupón (ej: PETA10)"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                />
              </div>
              {descuentoCup > 0 && <span className="discount">−{toARS(descuentoCup)}</span>}
            </div>

            <div className="divider" />

            <div className="row total">
              <span>Total</span>
              <strong>{toARS(total)}</strong>
            </div>

            <button
              className="btn primary block"
              onClick={() => navigate("/pago")}
              disabled={productos.length === 0}
            >
              Finalizar compra
            </button>

            <p className="smallprint">
              Al continuar aceptás nuestros términos y políticas de devolución.
            </p>
          </aside>
        </section>

        {/* Chatbot */}
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
