import { useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { agregarAlCarrito } from "../../carrito";

import {
  ChevronLeft,
  Star,
  Truck,
  ShieldCheck,
  RotateCw,
  Heart,
  Share2,
  Minus,
  Plus,
} from "lucide-react";

import "./DetalleProducto.css";

export default function DetalleProducto({ productos = [] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const producto = productos.find((p) => p.id === Number(id));

  const [qty, setQty] = useState(1);
  const [envio, setEnvio] = useState("estandar"); // estandar | expres
  const [fav, setFav] = useState(false);

  const handleAddToCart = () => {
    agregarAlCarrito(producto, qty);
    alert(`${qty} ${producto.name} agregado(s) al carrito`);
  };



  if (!producto) {
    return (
      <>
        <Header />
        <main className="detalle-wrap container">
          <button className="btn-back" onClick={() => navigate(-1)}>
            <ChevronLeft size={18} /> Volver
          </button>
          <h2 className="notfound">Producto no encontrado</h2>
        </main>
        <Footer />
      </>
    );
  }

  const toARS = (n) =>
    Number(n).toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

  const descuento = producto.price > 50000 ? 0.1 : 0;
  const priceFinal = producto.price * (1 - descuento);
  const cuotas = 6;

  const costoEnvio = envio === "expres" ? 1500 : 500;
  const fechaETA = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + (envio === "expres" ? 2 : 5));
    return d.toLocaleDateString("es-AR", { weekday: "short", day: "2-digit", month: "short" });
  }, [envio]);

  const rating = 4.6;
  const reviews = 128;
  const stock = 12;
  const sku = `SKU-${String(producto.id).padStart(5, "0")}`;

  // Stepper handlers
  const inc = () => setQty((n) => Math.min(n + 1, 99));
  const dec = () => setQty((n) => Math.max(1, n - 1));

  const addToCart = () => {
    agregarAlCarrito({ ...producto, cantidad: qty });
    alert(`Se agregaron ${qty} unidad(es) al carrito`);
  };

  return (
    <>
      <Header />
      <main className="detalle-wrap container">
        {/* Breadcrumb + volver */}
        <div className="breadcrumb">
          <button className="btn-back" onClick={() => navigate(-1)}><ChevronLeft size={18} /> Volver</button>
          <nav aria-label="Migas">
            <Link to="/">Inicio</Link> <span>›</span>
            <Link to={`/categoria/${producto.categoria || "Otros"}`}>{producto.categoria || "Otros"}</Link> <span>›</span>
            <span aria-current="page">{producto.name}</span>
          </nav>
        </div>

        <article className="detalle">
          {/* Galería */}
          <section className="gallery">
            <figure className="hero">
              <img src={producto.img} alt={producto.name} />
              {descuento > 0 && <span className="badge-off">-{Math.round(descuento * 100)}%</span>}
            </figure>

            <div className="thumbs">
              {[0, 1, 2, 3].map((i) => (
                <button key={i} className="thumb is-active">
                  <img src={producto.img} alt={`Vista ${i + 1}`} />
                </button>
              ))}
            </div>
          </section>

          {/* Info */}
          <section className="info">
            <header className="title">
              <h1>{producto.name}</h1>
              <div className="meta">
                <div className="rating" title={`${rating} sobre 5`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} className={i < Math.round(rating) ? "star filled" : "star"} />
                  ))}
                  <span className="rating-txt">{rating}</span>
                  <span className="reviews">({reviews} opiniones)</span>
                </div>
                <div className="sku">SKU: <strong>{sku}</strong></div>
                <div className={`stock ${stock > 0 ? "ok" : "out"}`}>
                  {stock > 0 ? "En stock" : "Sin stock"}
                </div>
              </div>
            </header>

            {/* Precio */}
            <div className="price-block">
              {descuento > 0 && (
                <div className="price-line">
                  <span className="price-old">{toARS(producto.price)}</span>
                  <span className="price-off">-{Math.round(descuento * 100)}%</span>
                </div>
              )}
              <div className="price-main">{toARS(priceFinal)}</div>
              <div className="cuotas">{cuotas} cuotas de <strong>{toARS(priceFinal / cuotas)}</strong></div>
            </div>

            {/* Opciones */}
            <div className="controls">
              <div className="qty">
                <span>Cantidad</span>
                <div className="stepper horizontal" role="group" aria-label="Cantidad">
                  <button type="button" onClick={dec} aria-label="Disminuir"><Minus size={16} /></button>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, Math.min(99, Number(e.target.value) || 1)))}
                  />
                  <button type="button" onClick={inc} aria-label="Aumentar"><Plus size={16} /></button>
                </div>
              </div>

              <div className="shipping">
                <span>Envío</span>
                <select value={envio} onChange={(e) => setEnvio(e.target.value)}>
                  <option value="estandar">Estándar · {toARS(500)} · llega {fechaETA}</option>
                  <option value="expres">Exprés · {toARS(1500)} · llega {fechaETA}</option>
                </select>
              </div>
            </div>

            <div className="summary">
              <span>Subtotal</span>
              <strong>{toARS(priceFinal * qty + costoEnvio)}</strong>
            </div>

            <div className="cta">
              <button className="btn primary" onClick={handleAddToCart}>Agregar al carrito</button>
              <button className="btn ghost" onClick={() => navigate("/carrito")}>Ir al carrito</button>
              <button className={`btn icon ${fav ? "active" : ""}`} onClick={() => setFav((v) => !v)} aria-label="Favorito">
                <Heart size={18} />
              </button>
              <button className="btn icon" onClick={() => navigator.clipboard.writeText(window.location.href)} aria-label="Compartir">
                <Share2 size={18} />
              </button>
            </div>

            <ul className="benefits">
              <li><Truck size={18} /> Envíos a todo el país</li>
              <li><RotateCw size={18} /> Devolución gratis 30 días</li>
              <li><ShieldCheck size={18} /> Garantía oficial 12 meses</li>
            </ul>

            <section className="desc">
              <h2>Descripción</h2>
              <p>
                Este es un texto de descripción para <strong>{producto.name}</strong>. Agregá características, materiales,
                compatibilidad o lo que sume a la decisión de compra. Podés incluir viñetas, tablas o imágenes técnicas.
              </p>
            </section>
          </section>
        </article>

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
      </main>
      <Footer />
    </>
  );
}
