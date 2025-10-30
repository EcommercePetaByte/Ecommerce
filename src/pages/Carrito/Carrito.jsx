import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

// Botones de incremento/decremento
function DecreaseButton({ onClick }) {
  return <button className="stepper-decrease" onClick={onClick} aria-label="Disminuir">-</button>;
}

function Quantity({ value }) {
  return <span className="stepper-qty">{value}</span>;
}

function IncreaseButton({ onClick }) {
  return <button className="stepper-increase" onClick={onClick} aria-label="Aumentar">+</button>;
}

export default function Carrito() {
  const [productos, setProductos] = useState([]);
  const [shipping, setShipping] = useState("estandar");
  const [coupon, setCoupon] = useState("");
  const navigate = useNavigate();

  // 🔹 Redirige a login si no hay token
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) navigate("/login");
  }, [navigate]);

  // 🔹 Carga inicial del carrito
  useEffect(() => {
    setProductos(getCarrito());
  }, []);

  // 🔹 Refresca carrito si cambia en otra pestaña o se dispara evento
  const refresh = () => setProductos(getCarrito());

  useEffect(() => {
    window.addEventListener("storage", refresh);
    window.addEventListener("carritoActualizado", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("carritoActualizado", refresh);
    };
  }, []);

  // 🔹 Conversión de número a ARS
  const toARS = (n) =>
    Number(n).toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

  // 🔹 Cálculo de items y subtotal
  const { items, subtotal } = useMemo(() => {
    const items = productos.reduce((a, p) => a + Number(p.cantidad), 0);
    const subtotal = productos.reduce((a, p) => a + Number(p.price) * Number(p.cantidad), 0);
    return { items, subtotal };
  }, [productos]);

  // 🔹 Costo de envío y descuento
  const envioCosto = productos.length ? (shipping === "expres" ? 1500 : 500) : 0;
  const descuentoCup = coupon.trim().toUpperCase() === "PETA10" ? Math.round(subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal - descuentoCup) + envioCosto;

  // 🔹 Handlers unificados para sumar/restar
  const cambiarCantidad = (id, delta) => {
    const p = productos.find(x => x.id === id);
    if (!p) return;
    const nuevaCantidad = p.cantidad + delta;
    if (nuevaCantidad <= 0) {
      quitarDelCarrito(id);
    } else {
      actualizarCantidad(id, nuevaCantidad);
    }
    refresh();
  };

  const handleSumar = id => cambiarCantidad(id, 1);
  const handleRestar = id => cambiarCantidad(id, -1);

  const handleQuitar = id => {
    quitarDelCarrito(id);
    refresh();
  };

  const handleVaciar = () => {
    if (window.confirm("¿Vaciar carrito?")) {
      vaciarCarrito();
      refresh();
    }
  };

  // 🔹 Componente de carrito vacío
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
      </main>
    </div>
  );
}
