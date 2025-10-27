import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import {
  UserRound,
  History,
  LogOut,
  PencilLine,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import "./Perfil.css";

// El componente ya no necesita la prop "onLogout"
export default function Perfil() { 
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "Nombre Apellido",
    email: "usuario@correo.com",
    telefono: "+54 11 5555-5555",
    domicilio: "Av. Siempre Viva 742, CABA",
  });

  const [edit, setEdit] = useState(false);

  const onChange = (e) => {
    const { id, value } = e.target;
    setForm((f) => ({ ...f, [id]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setEdit(false);
  };

  // ▼▼▼ LÓGICA DE LOGOUT CORREGIDA ▼▼▼
  const handleLogout = () => {
    // 1. Limpiamos el localStorage para eliminar la sesión
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("isAuthenticated"); // También el item viejo
    
    // 2. Redirigimos al usuario a la página de inicio
    alert("Sesión cerrada correctamente.");
    navigate("/");
    // Opcional: Recargar la página para limpiar cualquier estado residual
    window.location.reload(); 
  };

  return (
    <>
      <Header />
      <main className="perfil container">
        {/* ... El resto del JSX se mantiene igual ... */}
        <section className="perfil-grid">
          <aside className="perfil-aside card">
            <div className="avatar-wrap" aria-label="Avatar del usuario">
              <div className="avatar-ring">
                <UserRound size={64} />
              </div>
              <strong className="avatar-name">{form.nombre}</strong>
              <span className="avatar-mail">{form.email}</span>
            </div>
            <div className="aside-actions">
              <button
                className="btn btn-full"
                type="button"
                onClick={() => navigate("/perfil?tab=pedidos")}
                title="Historial de compras"
              >
                <History size={18} />
                Historial de compras
              </button>
              {/* Este botón ahora funcionará correctamente */}
              <button
                className="btn btn-danger btn-full"
                type="button"
                onClick={handleLogout}
                title="Cerrar sesión"
              >
                <LogOut size={18} />
                Cerrar sesión
              </button>
            </div>
            {/* ... El resto del JSX ... */}
          </aside>
          {/* ... El resto del JSX ... */}
        </section>
      </main>
    </>
  );
}