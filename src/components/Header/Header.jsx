import "./Header.css"; 
import Logo from "../Logo/Logo";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const [openCategorias, setOpenCategorias] = useState(false);
  const [searchText, setSearchText] = useState("");
  
  // 🔹 Estado que simula si el usuario está logueado
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const categorias = [
    "Periféricos",
    "Componentes",
    "Audio",
    "Monitores",
    "Computadoras",
    "Accesorios",
    "Sillas"
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchText.trim() === "") return;
    navigate(`/categoria/${searchText}`);
    setSearchText("");
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
            onChange={(e) => setSearchText(e.target.value)}
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

          {/* 🔹 Condicional: Login o Perfil */}
          {isLoggedIn ? (
            <Link to="/perfil" className="icon-btn" title="Perfil" aria-label="Perfil">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"  fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" 
                />
              </svg>
            </Link>
          ) : (
            <button className="login" onClick={() => navigate("/login")}>
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
