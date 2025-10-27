import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./admin.css";
import { LogOut } from "lucide-react"; // Importamos el ícono

export default function AdminLayout() {
  const navigate = useNavigate();

  // ▼▼▼ LÓGICA DE LOGOUT PARA EL ADMIN ▼▼▼
  const handleLogout = () => {
    // 1. Limpiamos el localStorage
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("isAuthenticated");

    // 2. Redirigimos al login de admin
    alert("Sesión de administrador cerrada.");
    navigate("/login-admin");
    window.location.reload();
  };

  return (
    <div className="admin-shell">
      {/* ... El resto del JSX del sidebar se mantiene igual ... */}
      <aside className="admin-aside">
        <div className="admin-brand">
          <span className="a">PETA</span>
          <span className="b">BYTE</span>
          <small className="tag">admin</small>
        </div>
        <nav className="admin-nav">
            <NavLink end to="/admin" className="navitem"><span>📊</span> Dashboard</NavLink>
            <NavLink to="/admin/productos" className="navitem"><span>📦</span> Productos</NavLink>
            <NavLink to="/admin/pedidos" className="navitem"><span>🧾</span> Pedidos</NavLink>
            <NavLink to="/admin/ajustes" className="navitem"><span>⚙️</span> Ajustes</NavLink>
        </nav>
        <div className="admin-aside-foot">
            <button className="btn-outline" onClick={() => navigate("/")}> ← Volver a la tienda </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="searchbox">
            <input placeholder="Buscar en admin…" />
          </div>
          <div className="top-actions">
            <button className="pill">+ Nuevo producto</button>
            <div className="avatar">AD</div>
            {/* ▼▼▼ BOTÓN DE LOGOUT AÑADIDO ▼▼▼ */}
            <button 
              className="btn-outline" 
              onClick={handleLogout} 
              title="Cerrar sesión"
              style={{ width: '40px', height: '40px', borderRadius: '50%' }} // Estilo para hacerlo redondo
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}