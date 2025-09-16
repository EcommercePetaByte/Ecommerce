import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Chatbot from "../../components/Chatbot/Chatbot";
import "./Home.css";

export default function Home({ isAuthenticated }) {
  const trackRef = useRef(null);
  const [chatOpen, setChatOpen] = useState(false);
  const navigate = useNavigate();

  const scrollBySlide = (dir = 1) => {
    const el = trackRef.current;
    if (!el) return;
    const slideWidth = el.clientWidth;
    el.scrollBy({ left: dir * slideWidth, behavior: "smooth" });
  };

  // ====== DATA DE EJEMPLO ======
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

  // Generamos productos con categorías (para filtrar en la página de categorías)
  const products = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => {
      const b = BASE[i % BASE.length];
      return {
        id: i + 1,
        name: `${b.name} ${i + 1}`,
        price: b.price + (i % 5) * 1000,
        img: b.img,
        categoria: b.categoria, // ✅ importante para filtrar
      };
    });
  }, []);

  const PAGE_SIZE = 20;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const current = products.slice(start, start + PAGE_SIZE);

  const goPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    const grid = document.querySelector(".grid");
    if (grid) grid.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toARS = (n) =>
    n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

  const handleAdd = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      alert("Producto agregado al carrito!");
    }
  };

  return (
    <>
      <Header />

      <main className="container">
        {/* ------------------------ Carrusel ------------------------ */}
        <section className="carousel-wrap" aria-label="Destacados">
          <button type="button" className="arrow left" onClick={() => scrollBySlide(-1)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="carousel" ref={trackRef}>
            <figure className="slide"><img src="https://www.precio-calidad.com.ar/wp-content/uploads/2023/10/ASUS-MOTHERS-Precio-Calidad-1920x500-1.jpg" alt="Banner 1" loading="lazy" /></figure>
            <figure className="slide"><img src="https://www.precio-calidad.com.ar/wp-content/uploads/2021/05/Precio-Calidad-Serie-30-1920x500-copia.jpg" alt="Banner 2" loading="lazy" /></figure>
            <figure className="slide"><img src="https://www.precio-calidad.com.ar/wp-content/uploads/2021/05/Precio-Calidad.jpg" alt="Banner 3" loading="lazy" /></figure>
            <figure className="slide"><img src="https://www.precio-calidad.com.ar/wp-content/uploads/2023/10/MONITORES-ASUS-Precio-Calidad-1920x500-1.jpg" alt="Banner 4" loading="lazy" /></figure>
          </div>

          <button type="button" className="arrow right" onClick={() => scrollBySlide(1)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </section>

        {/* ------------------------ Productos ------------------------- */}
        <h2 className="section-title">Quizás te interese...</h2>
        <section className="grid" aria-label="Productos">
          {current.map((p) => (
            <article className="card product" key={p.id}>
              <button className="add-btn" type="button" aria-label={`Agregar ${p.name}`} onClick={handleAdd}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span>Agregar</span>
              </button>

              <Link to={`/producto/${p.id}`}>
                <img src={p.img} alt={p.name} loading="lazy" />
              </Link>

              <div className="card-body">
                <h3 className="name">
                  <Link to={`/producto/${p.id}`}>{p.name}</Link>
                </h3>
                <div className="price">{toARS(p.price)}</div>
              </div>
            </article>
          ))}
        </section>

        {/* ------------------------ Paginación ------------------------- */}
        <nav className="pagination">
          <button className="page-btn" onClick={() => goPage(page - 1)} disabled={page === 1}>
            ← Anterior
          </button>
          <span className="page-info">
            Página <strong>{page}</strong> de <strong>{totalPages}</strong>
          </span>
          <button className="page-btn" onClick={() => goPage(page + 1)} disabled={page === totalPages}>
            Siguiente →
          </button>
        </nav>
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
