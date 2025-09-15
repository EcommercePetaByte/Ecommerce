import "./Header.css"; 
import Logo from "../Logo/Logo";
import { useNavigate } from "react-router-dom"; // 👈 importamos useNavigate

const Header = () => {
  const navigate = useNavigate(); // 👈 hook de navegación

  return (
    <header className="nav">
      <div className="nav-inner">
        
        <Logo />
        
        <div className="search" role="search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M21 21l-3.6-3.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          </svg>
          <input type="text" placeholder="Buscar…" aria-label="Buscar" disabled />
        </div>

        <div className="icons">
          <button className="icon-btn" title="Carrito" aria-label="Carrito" disabled> {/* ... */} </button>
          <button className="icon-btn" title="Notificaciones" aria-label="Notificaciones" disabled> {/* ... */} </button>
          <button className="icon-btn" title="Menú" aria-label="Abrir menú" disabled> {/* ... */} </button>

          {/* ✅ Ahora usamos navigate directo */}
          <button
            className="login"
            onClick={() => navigate("/login")} // 👈 redirige a login
          >
            Login
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
