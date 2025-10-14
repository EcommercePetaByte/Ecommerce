import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./admin.css";

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className="admin-aside">
        <div className="admin-brand">
          <span className="a">PETA</span>
          <span className="b">BYTE</span>
          <small className="tag">admin</small>
        </div>

        <nav className="admin-nav">
          <NavLink end to="/admin" className="navitem">
            <span>📊</span> Dashboard
          </NavLink>
          <NavLink to="/admin/productos" className="navitem">
            <span>📦</span> Productos
          </NavLink>
          <NavLink to="/admin/pedidos" className="navitem">
            <span>🧾</span> Pedidos
          </NavLink>
          <NavLink to="/admin/ajustes" className="navitem">
            <span>⚙️</span> Ajustes
          </NavLink>
        </nav>

        <div className="admin-aside-foot">
          <button className="btn-outline" onClick={() => navigate("/")}>
            ← Volver a la tienda
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="searchbox">
            <input placeholder="Buscar en admin…" />
          </div>
          <div className="top-actions">
            <button className="pill">+ Nuevo producto</button>
            <div className="avatar">AD</div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


