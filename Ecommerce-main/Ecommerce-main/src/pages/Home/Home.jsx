import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Home.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Chatbot from "../../components/Chatbot/Chatbot";
import { agregarAlCarrito } from "../../carrito";

// Icons (lucide-react)
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";

// --- Carrusel mejorado ---
function CarouselHero() {
  const slides = [
    { id: 1, img: "https://www.precio-calidad.com.ar/wp-content/uploads/2023/10/ASUS-MOTHERS-Precio-Calidad-1920x500-1.jpg", title: "Arma tu PC con ASUS", subtitle: "Mothers, GPUs y periféricos con hasta 12 cuotas", ctaText: "Ver componentes", ctaHref: "/categoria/Componentes" },
    { id: 2, img: "https://www.precio-calidad.com.ar/wp-content/uploads/2021/05/Precio-Calidad-Serie-30-1920x500-copia.jpg", title: "Serie 30 a precio especial", subtitle: "Stock limitado. ¡Aprovechá ahora!", ctaText: "Ver ofertas", ctaHref: "/categoria/Computadoras" },
    { id: 3, img: "https://www.precio-calidad.com.ar/wp-content/uploads/2021/05/Precio-Calidad.jpg", title: "Setup gamer completo", subtitle: "Teclados, mouse, pads y más", ctaText: "Ver periféricos", ctaHref: "/categoria/Periféricos" },
    { id: 4, img: "https://www.precio-calidad.com.ar/wp-content/uploads/2023/10/MONITORES-ASUS-Precio-Calidad-1920x500-1.jpg", title: "Monitores 144Hz+", subtitle: "Curvos y planos desde 24” hasta 32”", ctaText: "Ver monitores", ctaHref: "/categoria/Monitores" },
  ];

  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);
  const total = slides.length;
  const current = slides[index];

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);
  const goTo = (i) => setIndex(i);

  // Teclado ← →
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Autoplay (pausa en hover o cuando la pestaña no está visible)
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) return;
    if (hover || document.hidden) return;

    const id = setInterval(() => setIndex((i) => (i + 1) % total), 5000);
    const onVisibility = () => { if (document.hidden) clearInterval(id); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [hover, total]);

  return (
    <section
      className="carousel-hero"
      aria-label="Promociones destacadas"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <figure className="hero-slide" key={current.id}>
  <img src={current.img} alt="" loading="eager" />
  <div className="hero-gradient" aria-hidden="true" />

  {/* Overlay de contenido */}
  <figcaption className="hero-content" aria-live="polite">
    <h2 className="hero-title">{current.title}</h2>
    <p className="hero-sub">{current.subtitle}</p>
    <Link className="hero-cta" to={current.ctaHref}>
      {current.ctaText}
    </Link>
  </figcaption>

  {/* ✅ Barra de progreso a nivel del slide (full width) */}
  <span key={index} className="hero-progress" />
</figure>


      <button className="hero-arrow left" onClick={prev} aria-label="Anterior">
        <ChevronLeft size={20} />
      </button>
      <button className="hero-arrow right" onClick={next} aria-label="Siguiente">
        <ChevronRight size={20} />
      </button>

      <div className="hero-dots" role="tablist" aria-label="Indicadores">
        {slides.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={i === index}
            aria-label={`Ir al slide ${i + 1}`}
            className={`dot ${i === index ? "active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
}

export default function Home({ isAuthenticated: propAuth }) {
  const [isAuthenticated] = useState(propAuth || false);
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);
  const [toast, setToast] = useState("");

  // ====== DATA MOCK ======
  const BASE = [
    { name: "Mouse gamer", price: 24999, img: "https://redragon.es/content/uploads/2021/04/griffin-black-2.jpg", categoria: "Periféricos" },
    { name: "Barra de sonido", price: 89999, img: "https://redragon.es/content/uploads/2022/04/5-ESTILO-Y-ROBUSTEZ.jpg", categoria: "Audio" },
    { name: "Teclado RGB", price: 45999, img: "https://i0.wp.com/www.aslanstoreuy.com/wp-content/uploads/2020/10/Teclado-Gamer-Redragon-Kumara-RGB-Aslan-Store-Uruguay-2.jpg?w=900&ssl=1", categoria: "Periféricos" },
    { name: "Cooler CPU RGB", price: 32999, img: "https://redragon.es/content/uploads/2025/05/C1013-1.jpg", categoria: "Componentes" },
    { name: "Auriculares gamer", price: 38999, img: "https://dojiw2m9tvv09.cloudfront.net/86841/product/X_foto24207.jpg?68&time=1756745608", categoria: "Audio" },
    { name: "Notebook gamer", price: 299999, img: "https://guiadacompra.com/wp-content/uploads/2021/04/gamer-2.jpg", categoria: "Computadoras" },
    { name: "Monitor curvo 27”", price: 219999, img: "https://ocelot.com.mx/wp-content/uploads/2025/05/FONDO_OSCURO-OM_C32-2.jpg", categoria: "Monitores" },
    { name: "Micrófono USB", price: 25999, img: "https://redragon.es/content/uploads/2021/05/B2.jpg", categoria: "Audio" },
    { name: "Silla gamer", price: 149999, img: "https://ocelot.com.mx/wp-content/uploads/2023/07/FONDO-OSCURO-SAVAGE-RED-TELA-7.jpg", categoria: "Sillas" },
    { name: "Mousepad XL", price: 12999, img: "https://tecnogame.ec/wp-content/uploads/2022/01/Glowing-Cool.jpg", categoria: "Periféricos" },
  ];

  const products = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => {
      const b = BASE[i % BASE.length];
      return {
        id: i + 1,
        name: `${b.name} ${i + 1}`,
        price: b.price + (i % 5) * 1000,
        img: b.img,
        categoria: b.categoria,
      };
    });
  }, []);

  const toARS = (n) =>
    Number(n).toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    });

  const handleAdd = (producto) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    agregarAlCarrito(producto);
    setToast(`${producto.name} agregado al carrito`);
    setTimeout(() => setToast(""), 1600);
  };

  const destacados = products.slice(0, 8);
  const topVentas = useMemo(
    () => [...products].sort((a, b) => b.price - a.price).slice(0, 8),
    [products]
  );

  return (
    <>
      <Header />

      <main className="container home">
        {/* Carrusel mejorado */}
        <CarouselHero />

        {/* Beneficios */}
        <section className="usps" aria-label="Beneficios">
          <div className="usp"><Truck size={18} /><span>Envío a todo el país</span></div>
          <div className="usp"><ShieldCheck size={18} /><span>Garantía oficial</span></div>
          <div className="usp"><RotateCcw size={18} /><span>Devoluciones fáciles</span></div>
          <div className="usp"><Headphones size={18} /><span>Soporte 24/7</span></div>
        </section>

        {/* Destacados */}
        <section className="block">
          <div className="block-head">
            <h2 className="section-title">Destacados</h2>
            <Link className="link-more" to="/categoria/Periféricos">Ver más</Link>
          </div>

          <div className="grid">
            {destacados.map((p) => (
              <article className="card product" key={p.id}>
                <button className="add-btn" type="button" aria-label={`Agregar ${p.name}`} onClick={() => handleAdd(p)}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                  <span>Agregar</span>
                </button>

                <Link to={`/producto/${p.id}`} className="img-wrap">
                  <img src={p.img} alt={p.name} loading="lazy" />
                  <span className="badge"><Star size={14}/> TOP</span>
                </Link>

                <div className="card-body">
                  <h3 className="name"><Link to={`/producto/${p.id}`}>{p.name}</Link></h3>
                  <div className="price">{toARS(p.price)}</div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Top ventas */}
        <section className="block">
          <div className="block-head">
            <h2 className="section-title">Top ventas</h2>
            <Link className="link-more" to="/categoria/Computadoras">Ver más</Link>
          </div>

          <div className="grid">
            {topVentas.map((p) => (
              <article className="card product" key={p.id}>
                <button className="add-btn" type="button" onClick={() => handleAdd(p)}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                  <span>Agregar</span>
                </button>

                <Link to={`/producto/${p.id}`} className="img-wrap">
                  <img src={p.img} alt={p.name} loading="lazy" />
                </Link>

                <div className="card-body">
                  <h3 className="name"><Link to={`/producto/${p.id}`}>{p.name}</Link></h3>
                  <div className="price">{toARS(p.price)}</div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Marcas */}
        <section className="brands" aria-label="Marcas">
          <img src="https://upload.wikimedia.org/wikipedia/commons/3/3a/Logo_Asus.svg" alt="ASUS" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2e/MSI_logo.svg" alt="MSI" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/3/31/AMD_Logo.svg" alt="AMD" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg" alt="NVIDIA" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Logitech_logo.svg" alt="Logitech" />
        </section>

        {/* Newsletter */}
        <section className="newsletter" aria-label="Newsletter">
          <h3>Recibí ofertas y novedades</h3>
          <form onSubmit={(e)=>{e.preventDefault(); alert("¡Te suscribiste!");}}>
            <input type="email" placeholder="tu@correo.com" required />
            <button type="submit">Suscribirme</button>
          </form>
          <p className="mini">Promos sin spam. Podés desuscribirte cuando quieras.</p>
        </section>

        {/* Toast */}
        {toast && <div className="toast">{toast}</div>}
      </main>

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
