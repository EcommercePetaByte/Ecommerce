<<<<<<< HEAD
import { useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import DetalleProducto from "./pages/DetalleProducto/DetalleProducto";
import Categoria from "./pages/Categoria/Categoria"; // 👈 importamos Categoria

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ====== DATA DE EJEMPLO ======
  const BASE = [
    { name: "Mouse gamer", price: 24999, img: "https://redragon.es/content/uploads/2021/04/griffin-black-2.jpg", categoria: "perifericos" },
    { name: "Barra de sonido", price: 89999, img: "https://redragon.es/content/uploads/2022/04/5-ESTILO-Y-ROBUSTEZ.jpg", categoria: "audio" },
    { name: "Teclado RGB", price: 45999, img: "https://i0.wp.com/www.aslanstoreuy.com/wp-content/uploads/2020/10/Teclado-Gamer-Redragon-Kumara-RGB-Aslan-Store-Uruguay-2.jpg?w=900&ssl=1", categoria: "perifericos" },
    { name: "Cooler CPU RGB", price: 32999, img: "https://redragon.es/content/uploads/2025/05/C1013-1.jpg", categoria: "componentes" },
    { name: "Auriculares gamer", price: 38999, img: "https://dojiw2m9tvv09.cloudfront.net/86841/product/X_foto24207.jpg?68&time=1756745608", categoria: "audio" },
    { name: "Notebook gamer", price: 299999, img: "https://guiadacompra.com/wp-content/uploads/2021/04/gamer-2.jpg", categoria: "computadoras" },
    { name: "Monitor curvo 27”", price: 219999, img: "https://ocelot.com.mx/wp-content/uploads/2025/05/FONDO_OSCURO-OM_C32-2.jpg", categoria: "monitores" },
    { name: "Micrófono USB", price: 25999, img: "https://redragon.es/content/uploads/2021/05/B2.jpg", categoria: "audio" },
    { name: "Silla gamer", price: 149999, img: "https://ocelot.com.mx/wp-content/uploads/2023/07/FONDO-OSCURO-SAVAGE-RED-TELA-7.jpg", categoria: "accesorios" },
    { name: "Mousepad XL", price: 12999, img: "https://tecnogame.ec/wp-content/uploads/2022/01/Glowing-Cool.jpg", categoria: "accesorios" },
  ];

  const products = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => {
      const b = BASE[i % BASE.length];
      return {
        id: i + 1,
        name: `${b.name} ${i + 1}`,
        price: b.price + (i % 5) * 1000,
        img: b.img,
        categoria: b.categoria, // 👈 importante: agregamos la categoría
      };
    });
  }, []);

  // ✅ Login devuelve true si es correcto, false si falla
  const handleLogin = (username, password) => {
    if (username === "admin" && password === "1234") {
      setIsAuthenticated(true);
      return true;
    } else {
      return false;
    }
  };

  const handleRegister = (username, email, password) => {
    setIsAuthenticated(true); // registro siempre “exitoso”
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<Home isAuthenticated={isAuthenticated} productos={products} />} 
        />
        <Route 
          path="/login" 
          element={<Login onLogin={handleLogin} onRegister={handleRegister} />} 
        />
        <Route 
          path="/producto/:id" 
          element={<DetalleProducto productos={products} />} 
        />
        <Route 
          path="/categoria/:nombreCategoria" 
          element={<Categoria productos={products} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
=======
import { useMemo, useRef, useState } from "react";
import "./App.css";
import { agregarAlCarrito, getCarrito } from "./carrito";
import { Link } from "react-router-dom";

export default function App() {
  const trackRef = useRef(null);
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Estado para overlat carrito
  const [showCart, setShowCart] = useState(false)

  const scrollBySlide = (dir = 1) => {
    const el = trackRef.current;
    if (!el) return;
    const slideWidth = el.clientWidth; // cada slide ocupa el 100% del track
    el.scrollBy({ left: dir * slideWidth, behavior: "smooth" });
  };

  // ====== DATA DE EJEMPLO (60 productos) ======
  const BASE = [
    {
      name: "Mouse gamer",
      price: 24999,
      img: "https://redragon.es/content/uploads/2021/04/griffin-black-2.jpg",
    },
    {
      name: "Barra de sonido",
      price: 89999,
      img: "https://redragon.es/content/uploads/2022/04/5-ESTILO-Y-ROBUSTEZ.jpg",
    },
    {
      name: "Teclado RGB",
      price: 45999,
      img: "https://i0.wp.com/www.aslanstoreuy.com/wp-content/uploads/2020/10/Teclado-Gamer-Redragon-Kumara-RGB-Aslan-Store-Uruguay-2.jpg?w=900&ssl=1",
    },
    {
      name: "Cooler CPU RGB",
      price: 32999,
      img: "https://redragon.es/content/uploads/2025/05/C1013-1.jpg",
    },
    {
      name: "Auriculares gamer",
      price: 38999,
      img: "https://dojiw2m9tvv09.cloudfront.net/86841/product/X_foto24207.jpg?68&time=1756745608",
    },
    {
      name: "Notebook gamer",
      price: 299999,
      img: "https://guiadacompra.com/wp-content/uploads/2021/04/gamer-2.jpg",
    },
    {
      name: "Monitor curvo 27”",
      price: 219999,
      img: "https://ocelot.com.mx/wp-content/uploads/2025/05/FONDO_OSCURO-OM_C32-2.jpg",
    },
    {
      name: "Micrófono USB",
      price: 25999,
      img: "https://redragon.es/content/uploads/2021/05/B2.jpg",
    },
    {
      name: "Silla gamer",
      price: 149999,
      img: "https://ocelot.com.mx/wp-content/uploads/2023/07/FONDO-OSCURO-SAVAGE-RED-TELA-7.jpg",
    },
    {
      name: "Mousepad XL",
      price: 12999,
      img: "https://tecnogame.ec/wp-content/uploads/2022/01/Glowing-Cool.jpg",
    },
  ];

  const products = useMemo(() => {
    const arr = [];
    const total = 60; // de prueba
    for (let i = 0; i < total; i++) {
      const b = BASE[i % BASE.length];
      arr.push({
        id: i + 1,
        name: `${b.name} ${i + 1}`,
        price: b.price + (i % 5) * 1000, // pequeña variación
        img: b.img,
      });
    }
    return arr;
  }, []);

  // ====== PAGINACIÓN (20 por página) ======
  const PAGE_SIZE = 20;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(products.length / PAGE_SIZE);

  const start = (page - 1) * PAGE_SIZE;
  const current = products.slice(start, start + PAGE_SIZE);

  const goPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    // al cambiar de página, subir al inicio del grid
    const grid = document.querySelector(".grid");
    if (grid) grid.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toARS = (n) =>
    n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

  return (
    <>
      {/* ========================= HEADER / NAVBAR ========================= */}
      <header className="nav">
        <div className="nav-inner">
          <a className="brand" href="#" aria-label="Petabyte Home">
            <span className="a">PETA</span><span className="b">BYTE</span>
          </a>

          <div className="search" role="search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M21 21l-3.6-3.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            </svg>
            <input type="text" placeholder="Buscar…" aria-label="Buscar" disabled />
          </div>

          <div className="icons">
            <Link to="/carrito" className="icon-btn" title="Carrito" aria-label="Carrito">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M6 6h15l-1.5 8.5H7.5L6 6Z" stroke="currentColor" strokeWidth="2" />
                <circle cx="9" cy="20" r="1.5" fill="currentColor" />
                <circle cx="18" cy="20" r="1.5" fill="currentColor" />
              </svg>
            </Link>
            <button className="icon-btn" title="Notificaciones" aria-label="Notificaciones" disabled>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6Z" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>

            {/* Botón Menú */}

            <button className="icon-btn" title="Menú" aria-label="Abrir menú" disabled>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <a className="login" href="#" aria-disabled="true">Login</a>
          </div>
        </div>
      </header>

      {/* =============================== MENÚ LATERAL DESPLEGABLE ============ */}
      <nav className={`menu-lateral ${menuAbierto ? "activo" : ""}`}>
        <button className="menu-item">COMPONENTES</button>
        <button className="menu-item">PERIFÉRICOS</button>
        <button className="menu-item">MONITORES</button>
        <button className="menu-item">PC'S ARMADAS</button>
        <button className="menu-item">LAPTOS</button>
        <button className="menu-item">PERFIL</button>
      </nav>

      {/* =============================== MAIN =============================== */}
      <main className="container">
        {/* ------------------------ Carrusel alineado ------------------------ */}
        <section className="carousel-wrap" aria-label="Destacados">
          <button
            type="button"
            className="arrow left"
            aria-label="Anterior"
            onClick={() => scrollBySlide(-1)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="carousel" ref={trackRef}>
            <figure className="slide">
              <img src="https://www.precio-calidad.com.ar/wp-content/uploads/2023/10/ASUS-MOTHERS-Precio-Calidad-1920x500-1.jpg" alt="Banner 1" loading="lazy" />
            </figure>
            <figure className="slide">
              <img src="https://www.precio-calidad.com.ar/wp-content/uploads/2021/05/Precio-Calidad-Serie-30-1920x500-copia.jpg" alt="Banner 2" loading="lazy" />
            </figure>
            <figure className="slide">
              <img src="https://www.precio-calidad.com.ar/wp-content/uploads/2021/05/Precio-Calidad.jpg" alt="Banner 3" loading="lazy" />
            </figure>
            <figure className="slide">
              <img src="https://www.precio-calidad.com.ar/wp-content/uploads/2023/10/MONITORES-ASUS-Precio-Calidad-1920x500-1.jpg" alt="Banner 4" loading="lazy" />
            </figure>
          </div>

          <button
            type="button"
            className="arrow right"
            aria-label="Siguiente"
            onClick={() => scrollBySlide(1)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </section>

        {/* ------------------------ Productos (grid) ------------------------- */}
        <h2 className="section-title">Quizás te interese...</h2>

        <section className="grid" aria-label="Productos">
          {current.map((p) => (
            <article className="card product" key={p.id}>
              <button className="add-btn" type="button" aria-label={`Agregar ${p.name}`} onClick={()=> agregarAlCarrito(p)}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span>Agregar</span>
              </button>

              <img src={p.img} alt={p.name} loading="lazy" />
              <div className="card-body">
                <h3 className="name">{p.name}</h3>
                <div className="price">{toARS(p.price)}</div>
              </div>
            </article>
          ))}
        </section>

        {/* ------------------------ Paginación ------------------------------- */}
        <nav className="pagination" aria-label="Paginación de productos">
          <button
            className="page-btn"
            onClick={() => goPage(page - 1)}
            disabled={page === 1}
            aria-label="Página anterior"
          >
            ← Anterior
          </button>

          <span className="page-info">
            Página <strong>{page}</strong> de <strong>{totalPages}</strong>
          </span>

          <button
            className="page-btn"
            onClick={() => goPage(page + 1)}
            disabled={page === totalPages}
            aria-label="Página siguiente"
          >
            Siguiente →
          </button>
        </nav>
      </main>

      {/* ======================= Botón flotante (FAB) ======================= */}
      <button className="fab" title="Ayuda" aria-label="Abrir chat" disabled>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M4 5h16v10H7l-3 3V5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </button>
    </>
  );
}
>>>>>>> amigo/master
