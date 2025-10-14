import "./Header.css";
import Logo from "../Logo/Logo";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { UserRound, ShoppingCart, Lightbulb, ChevronDown, Search } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const [openCategorias, setOpenCategorias] = useState(false);
  const [searchText, setSearchText] = useState("");
  const categoriasRef = useRef(null);

  // ====== Tema (oscuro / claro) ======
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const categorias = [
    "Periféricos",
    "Componentes",
    "Audio",
    "Monitores",
    "Computadoras",
    "Accesorios",
    "Sillas"
  ];

  // cerrar al click afuera
  useEffect(() => {
    function onDocClick(e) {
      if (!categoriasRef.current) return;
      if (!categoriasRef.current.contains(e.target)) setOpenCategorias(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchText.trim()) return;
    navigate(`/categoria/${searchText}`);
    setSearchText("");
  };

  return (
    <header className="nav">
      <div className="nav-inner">
        <Logo />

        {/* Buscador */}
        <form className="search" role="search" onSubmit={handleSearchSubmit}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar…"
            aria-label="Buscar productos o categorías"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </form>

        {/* Modo claro/oscuro */}


        <div className="icons">
          {/* Perfil */}
          <Link to="/perfil" className="icon-btn" title="Perfil">
            <UserRound size={20} />
          </Link>

          {/* Carrito */}
          <Link to="/carrito" className="icon-btn" title="Carrito">
            <ShoppingCart size={22} />
          </Link>

        <button
  className={`icon-btn foco-btn ${theme === "light" ? "on" : ""}`}
  onClick={toggleTheme}
  title="Cambiar tema"
>
  <Lightbulb
    size={22}
    color={theme === "light" ? "#fff" : "currentColor"}
    fill={theme === "light" ? "#fff" : "none"}
  />
</button>

          {/* Categorías */}
          <div className="categorias-wrapper" ref={categoriasRef}>
            <button
              className="categorias-btn"
              onClick={() => setOpenCategorias((v) => !v)}
              title="Categorías"
            >
              Categorías
              <ChevronDown
                size={18}
                style={{
                  transform: openCategorias ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "0.2s"
                }}
              />
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

          {/* Login */}
         <button
  className="categorias-btn login-btn"
  onClick={() => navigate("/login")}
  type="button"
>
  Login
</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
