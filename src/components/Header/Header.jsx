import "./Header.css";
import Logo from "../Logo/Logo";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import api from "../../api"; // Importamos la instancia de Axios
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
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("jwtToken"));
  const [openCategorias, setOpenCategorias] = useState(false);
  const [openFiltros, setOpenFiltros] = useState(false);
  const categoriasRef = useRef(null);
  const filtrosRef = useRef(null);

  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({
    categoria: "",
    min: "",
    max: "",
    envioGratis: false,
    descuento: false,
    orden: "",
  });

  // --- ESTADO PARA CATEGORÍAS DINÁMICAS ---
  const [categorias, setCategorias] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  });

  // --- EFECTO PARA CARGAR CATEGORÍAS DESDE LA API ---
  useEffect(() => {
    api.get("/categories")
      .then(response => {
        setCategorias(response.data);
      })
      .catch(error => {
        console.error("Error al cargar las categorías:", error);
      });
  }, []); // El array vacío asegura que se ejecute solo una vez

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  
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

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  useEffect(() => {
    const actualizarCarrito = () => {
      const carrito = getCarrito();
      const totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);
      setCartCount(totalItems);
    };
    actualizarCarrito();
    window.addEventListener("storage", actualizarCarrito);
    return () => window.removeEventListener("storage", actualizarCarrito);
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
    setIsLoggedIn(!!localStorage.getItem("jwtToken"));
  }, [location]);

  return (
    <header className="nav">
      <div className="nav-inner">
        <Logo />

        <form className="search-container" ref={filtrosRef} onSubmit={handleSearchSubmit}>
          <div className="search" role="search">
            <button type="submit" className="buscar-btn" title="Buscar"><Search size={18} /></button>
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
          </div>

          {openFiltros && (
            <div className="filtros-dropdown">
              <select name="categoria" value={filters.categoria} onChange={handleFilterChange}>
                <option value="">Todas las categorías</option>
                {/* Renderiza las categorías obtenidas de la API */}
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              {/* Resto de los filtros... */}
            </div>
          )}
        </form>

        <div className="icons" style={{ marginLeft: "auto" }}>
          <div className="cart-icon-wrapper">
            <Link to="/carrito" className="icon-btn cart-btn" title="Carrito">
              <ShoppingCart size={22} />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
          </div>
          <button className={`icon-btn foco-btn ${theme === "light" ? "on" : ""}`} onClick={toggleTheme} title="Cambiar tema">
            <Lightbulb size={22} />
          </button>
          <div className="categorias-wrapper" ref={categoriasRef}>
            <button className="categorias-btn" onClick={() => setOpenCategorias((v) => !v)} title="Categorías">
              Categorías
              <ChevronDown size={18} style={{ transform: openCategorias ? "rotate(180deg)" : "rotate(0deg)", transition: "0.2s" }} />
            </button>
            {openCategorias && (
              <ul className="categorias-dropdown">
                {/* Renderiza las categorías obtenidas de la API */}
                {categorias.map((cat) => (
                  <li
                    key={cat.id}
                    onClick={() => {
                      navigate(`/categoria/${cat.name}`);
                      setOpenCategorias(false);
                    }}
                  >
                    {cat.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {isLoggedIn ? (
            <Link to="/perfil" className="icon-btn" title="Perfil"><UserRound size={20} /></Link>
          ) : (
            <button className="categorias-btn login-btn" onClick={() => navigate("/login")} type="button">Login</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;