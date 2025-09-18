import "./Header.css"; 
import Logo from "../Logo/Logo";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { agregarAlCarrito } from "../../carrito";

const Header = () => {
  const navigate = useNavigate();
  const [openCategorias, setOpenCategorias] = useState(false);
  const [searchText, setSearchText] = useState(""); // 🔹 Estado de la búsqueda

  // 🔹 Lista de categorías (podés cargar desde productos o backend más adelante)
  const categorias = [
    "Periféricos",
    "Componentes",
    "Audio",
    "Monitores",
    "Computadoras",
    "Accesorios",
    "Sillas"
  ];

  // 🔹 Función para enviar búsqueda
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchText.trim() === "") return;
    navigate(`/categoria/${searchText}`);
    setSearchText(""); // opcional: limpiar input
  };

  return (
    <header className="nav">
      <div className="nav-inner">
        <Logo />

        {/* 🔹 Search Form */}
        <form className="search" role="search" onSubmit={handleSearchSubmit}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M21 21l-3.6-3.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          </svg>
          <input
            type="text"
            placeholder="Buscar…"
            aria-label="Buscar"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)} // 🔹 Actualiza el estado
          />
        </form>

        <div className="icons">
          {/* 🔹 Carrito */}
          <Link to="/carrito" className="icon-btn" title="Carrito" aria-label="Carrito">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M6 6h15l-1.5 8.5H7.5L6 6Z" stroke="currentColor" strokeWidth="2" />
              <circle cx="9" cy="20" r="1.5" fill="currentColor" />
              <circle cx="18" cy="20" r="1.5" fill="currentColor" />
            </svg>
          </Link>

          {/* 🔹 Notificaciones */}
          <button className="icon-btn" title="Notificaciones" aria-label="Notificaciones">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6Z" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>

          {/* 🔹 Menú → Categorías */}
          <div className="categorias-wrapper">
            <button
              className="icon-btn"
              title="Categorías"
              aria-label="Abrir categorías"
              onClick={() => setOpenCategorias(!openCategorias)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            {openCategorias && (
              <ul className="categorias-dropdown">
                {categorias.map((cat) => (
                  <li
                    key={cat}
                    onClick={() => {
                      navigate(`/categoria/${cat}`);
                      setOpenCategorias(false);
                    }}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 🔹 Login */}
          <button className="login" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
