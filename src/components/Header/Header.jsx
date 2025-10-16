import "./Header.css";
import Logo from "../Logo/Logo";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  UserRound,
  ShoppingCart,
  Lightbulb,
  ChevronDown,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { getCarrito } from "../../carrito.js";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("remember_user")
  );
  const [openCategorias, setOpenCategorias] = useState(false);
  const [openFiltros, setOpenFiltros] = useState(false);
  const categoriasRef = useRef(null);
  const filtrosRef = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const [filters, setFilters] = useState({
    categoria: "",
    min: "",
    max: "",
    envioGratis: false,
    descuento: false,
    orden: "",
  });

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
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
    "Sillas",
  ];

  useEffect(() => {
    const actualizar = () => {
      const carrito = getCarrito();
      const totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);
      setCartCount(totalItems);
    };
    actualizar();
    window.addEventListener("storage", actualizar);
    const interval = setInterval(actualizar, 500);
    return () => {
      window.removeEventListener("storage", actualizar);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!categoriasRef.current?.contains(e.target)) setOpenCategorias(false);
      if (!filtrosRef.current?.contains(e.target)) setOpenFiltros(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("remember_user"));
  }, [location]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (searchText) params.append("q", searchText);
    if (filters.categoria) params.append("categoria", filters.categoria);
    if (filters.min) params.append("min", filters.min);
    if (filters.max) params.append("max", filters.max);
    if (filters.envioGratis) params.append("envioGratis", "true");
    if (filters.descuento) params.append("descuento", "true");
    if (filters.orden) params.append("orden", filters.orden);

    navigate(`/buscar?${params.toString()}`);
    setOpenFiltros(false);
  };

  return (
    <header className="nav">
      <div className="nav-inner">
        <Logo />

        {/* Buscador con filtros */}
        <div className="search-container" ref={filtrosRef}>
          <form className="search" role="search" onSubmit={handleSearchSubmit}>
            <button type="submit" className="buscar-btn" title="Buscar">
              <Search size={18} />
            </button>

            <input
              type="text"
              placeholder="Buscar productos..."
              aria-label="Buscar productos"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            <button
              type="button"
              className="filtros-btn"
              onClick={() => setOpenFiltros((v) => !v)}
              title="Filtros avanzados"
            >
              <SlidersHorizontal size={18} />
            </button>
          </form>

          {openFiltros && (
            <div className="filtros-dropdown">
              <select
                name="categoria"
                value={filters.categoria}
                onChange={handleFilterChange}
              >
                <option value="">Todas las categorías</option>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <div className="precio-inputs">
                <input
                  type="number"
                  name="min"
                  placeholder="Precio mínimo"
                  value={filters.min}
                  onChange={handleFilterChange}
                />
                <input
                  type="number"
                  name="max"
                  placeholder="Precio máximo"
                  value={filters.max}
                  onChange={handleFilterChange}
                />
              </div>

              <label>
                <input
                  type="checkbox"
                  name="envioGratis"
                  checked={filters.envioGratis}
                  onChange={handleFilterChange}
                />
                Envío gratis
              </label>

              <label>
                <input
                  type="checkbox"
                  name="descuento"
                  checked={filters.descuento}
                  onChange={handleFilterChange}
                />
                Con descuento
              </label>

              <select
                name="orden"
                value={filters.orden}
                onChange={handleFilterChange}
              >
                <option value="">Ordenar por</option>
                <option value="precioAsc">Precio: menor a mayor</option>
                <option value="precioDesc">Precio: mayor a menor</option>
                <option value="nombreAsc">Nombre: A-Z</option>
                <option value="nombreDesc">Nombre: Z-A</option>
              </select>

              <button type="submit" className="btn-filtrar">
                Aplicar filtros
              </button>
            </div>
          )}
        </div>

        {/* ICONOS a la derecha: Carrito -> Modo Claro -> Categorías -> Perfil/Login */}
        <div className="icons" style={{ marginLeft: "auto" }}>
          {/* Carrito */}
          <div className="cart-icon-wrapper">
            <Link to="/carrito" className="icon-btn cart-btn" title="Carrito">
              <ShoppingCart size={22} />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
          </div>

          {/* Modo claro/oscuro */}
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
                  transition: "0.2s",
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

          {/* Perfil / Login */}
          {isLoggedIn ? (
            <Link to="/perfil" className="icon-btn" title="Perfil">
              <UserRound size={20} />
            </Link>
          ) : (
            <button
              className="categorias-btn login-btn"
              onClick={() => navigate("/login")}
              type="button"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
