// src/pages/Admin/Dashboard.jsx
import "./Dashboard.css";
import Header from "../../components/Header/Header";

// ======== falta conectarlo para poder ingresar =========

export default function Dashboard() {
  return (
    <div className="container">

      <Header />

      <main className="dashboard">
        {/* Menú lateral */}
        <aside className="menu">
          <button>📦 Productos</button>
          <button>⚙️ Configuración</button>
          <button>🏠 Página Principal</button>
          <button>🧾 Pedidos</button>
        </aside>

        {/* Panel central */}
        <section className="panel">
          <h2 className="title">Panel de Administrador</h2>

          <div className="empty-box">
            <p>Bienvenido al panel de administración. Selecciona una opción del menú.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
