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

export default function Perfil() {
  const navigate = useNavigate();

  // Mock de datos del usuario (podés traerlos del backend)
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
    // TODO: guardar en backend
    setEdit(false);
  };

  const handleLogout = () => {
    // TODO: limpiar tokens/localStorage
    navigate("/login");
  };

  return (
    <>
      <Header />

      <main className="perfil container">
        {/* Header */}
        <header className="perfil-head">
          <div className="perfil-title">
            <h1>Tu perfil</h1>
            <p>Gestioná tus datos, direcciones y pedidos.</p>
          </div>

          <div className="perfil-tabs">
            <span className="chip chip-on">Información</span>
            <button
              className="chip"
              type="button"
              onClick={() => navigate("/perfil?tab=pedidos")}
              title="Ver historial de compras"
            >
              Pedidos
            </button>
          </div>
        </header>

        <section className="perfil-grid">
          {/* Sidebar */}
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

            <div className="mini-stats">
              <div className="stat">
                <span className="stat-k">8</span>
                <span className="stat-l">Pedidos</span>
              </div>
              <div className="stat">
                <span className="stat-k">$ 356.000</span>
                <span className="stat-l">Gastado</span>
              </div>
              <div className="stat">
                <span className="stat-k">Gold</span>
                <span className="stat-l">Membresía</span>
              </div>
            </div>
          </aside>

          {/* Información / Form */}
          <section className="perfil-main card">
            <div className="main-head">
              <h2>Información del perfil</h2>
              {!edit ? (
                <button
                  className="btn"
                  type="button"
                  onClick={() => setEdit(true)}
                  title="Editar datos"
                >
                  <PencilLine size={18} />
                  Editar
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="btn btn-secondary" type="button" onClick={() => setEdit(false)}>
                    Cancelar
                  </button>
                  <button className="btn" type="submit" form="perfil-form">
                    Guardar
                  </button>
                </div>
              )}
            </div>

            <form id="perfil-form" className="form-grid" onSubmit={handleSave}>
              <label className="fi">
                <span>Nombre</span>
                <div className="input">
                  <UserRound size={16} />
                  <input
                    id="nombre"
                    type="text"
                    value={form.nombre}
                    onChange={onChange}
                    disabled={!edit}
                  />
                </div>
              </label>

              <label className="fi">
                <span>Email</span>
                <div className="input">
                  <Mail size={16} />
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    disabled={!edit}
                  />
                </div>
              </label>

              <label className="fi">
                <span>Teléfono</span>
                <div className="input">
                  <Phone size={16} />
                  <input
                    id="telefono"
                    type="tel"
                    value={form.telefono}
                    onChange={onChange}
                    disabled={!edit}
                  />
                </div>
              </label>

              <label className="fi fi-wide">
                <span>Domicilio</span>
                <div className="input">
                  <MapPin size={16} />
                  <input
                    id="domicilio"
                    type="text"
                    value={form.domicilio}
                    onChange={onChange}
                    disabled={!edit}
                  />
                </div>
              </label>
            </form>

            {/* Bloque secundario: dirección o seguridad */}
            <div className="subcards">
              <div className="subcard">
                <h3>Direcciones</h3>
                <p className="muted">Gestioná tus direcciones para envíos rápidos.</p>
                <button className="btn btn-secondary" type="button">Agregar dirección</button>
              </div>
              <div className="subcard">
                <h3>Seguridad</h3>
                <p className="muted">Actualizá tu contraseña y activá 2FA.</p>
                <button className="btn btn-secondary" type="button">Cambiar contraseña</button>
              </div>
            </div>
          </section>
        </section>
      </main>
    </>
  );
}
