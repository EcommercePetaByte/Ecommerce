import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api"; // Importa tu instancia de Axios
import { agregarAlCarrito } from "../../carrito";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import {
  ChevronLeft, Star, Truck, ShieldCheck,
  RotateCw, Heart, Share2, Minus, Plus,
} from "lucide-react";

import "./DetalleProducto.css";

export default function DetalleProducto() {
  // Hook para leer el 'id' de la URL (ej: /producto/5)
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados para manejar el producto, la carga y los errores
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para la interacción del usuario
  const [qty, setQty] = useState(1);
  const [envio, setEnvio] = useState("estandar");
  const [fav, setFav] = useState(false);

  // --- EFECTO PARA BUSCAR EL PRODUCTO EN LA API ---
  useEffect(() => {
    // Si no hay ID, no se hace la petición
    if (!id) {
      setError("ID de producto no válido.");
      setLoading(false);
      return;
    }

    setLoading(true);
    // Petición al backend usando el ID de la URL
    api.get(`/products/${id}`)
      .then(response => {
        setProducto(response.data);
      })
      .catch(err => {
        console.error("Error al cargar el producto:", err);
        setError("El producto no pudo ser encontrado.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]); // Se ejecuta cada vez que el ID de la URL cambie

  // --- LÓGICA DE LA VISTA ---

  // Formateador de moneda
  const toARS = (n) =>
    Number(n).toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

  // Stepper para la cantidad
  const inc = () => setQty((n) => Math.min(n + 1, producto?.stock || 99));
  const dec = () => setQty((n) => Math.max(1, n - 1));

  // Función para agregar al carrito
  const handleAddToCart = () => {
    if (!producto) return;
    agregarAlCarrito(producto, qty);
    alert(`${qty} "${producto.name}" agregado(s) al carrito.`);
  };

  // --- RENDERIZADO CONDICIONAL ---

  // Estado de carga
  if (loading) {
    return (
      <>
        <Header />
        <main className="detalle-wrap container">
          <h2 className="detalle-estado">Cargando producto...</h2>
        </main>
        <Footer />
      </>
    );
  }

  // Estado de error o si el producto no se encontró
  if (error || !producto) {
    return (
      <>
        <Header />
        <main className="detalle-wrap container">
          <button className="btn-back" onClick={() => navigate(-1)}>
            <ChevronLeft size={18} /> Volver
          </button>
          <h2 className="notfound">{error || "Producto no encontrado"}</h2>
        </main>
        <Footer />
      </>
    );
  }

  // --- RENDERIZADO DEL PRODUCTO ENCONTRADO ---

  // Cálculos basados en los datos del producto
  const descuento = producto.price > 50000 ? 0.1 : 0;
  const priceFinal = producto.price * (1 - descuento);
  const cuotas = 6;
  const costoEnvio = envio === "expres" ? 1500 : 500;
  const fechaETA = new Date();
  fechaETA.setDate(fechaETA.getDate() + (envio === "expres" ? 2 : 5));
  const fechaETAFmt = fechaETA.toLocaleDateString("es-AR", { weekday: "short", day: "2-digit", month: "short" });

  return (
    <>
      <Header />
      <main className="detalle-wrap container">
        <div className="breadcrumb">
          <button className="btn-back" onClick={() => navigate(-1)}><ChevronLeft size={18} /> Volver</button>
          <nav aria-label="Migas">
            <Link to="/">Inicio</Link> <span>›</span>
            {/* El campo 'categoria' debe venir del backend */}
            <Link to={`/categoria/${producto.categoria || "Productos"}`}>{producto.categoria || "Productos"}</Link> <span>›</span>
            <span aria-current="page">{producto.name}</span>
          </nav>
        </div>

        <article className="detalle">
          <section className="gallery">
            <figure className="hero">
              <img src={producto.imagen || 'https://via.placeholder.com/500x500.png?text=Producto'} alt={producto.name} />
              {descuento > 0 && <span className="badge-off">-{Math.round(descuento * 100)}%</span>}
            </figure>
          </section>

          <section className="info">
            <header className="title">
              <h1>{producto.name}</h1>
              <div className="meta">
                <div className={`stock ${producto.stock > 0 ? "ok" : "out"}`}>
                  {producto.stock > 0 ? "En stock" : "Sin stock"}
                </div>
              </div>
            </header>

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
            
            <div className="controls">
                <div className="qty">
                    <span>Cantidad</span>
                    <div className="stepper horizontal">
                        <button type="button" onClick={dec} aria-label="Disminuir"><Minus size={16} /></button>
                        <input type="number" min="1" max={producto.stock || 99} value={qty} readOnly />
                        <button type="button" onClick={inc} aria-label="Aumentar"><Plus size={16} /></button>
                    </div>
                </div>
            </div>

            <div className="cta">
              <button className="btn primary" onClick={handleAddToCart} disabled={producto.stock === 0}>
                Agregar al carrito
              </button>
            </div>

            <section className="desc">
              <h2>Descripción</h2>
              <p>{producto.description || "Descripción no disponible."}</p>
            </section>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}