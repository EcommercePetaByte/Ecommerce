import { useState, useEffect } from "react";
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
import api from "../../api";
import "./Perfil.css";

export default function Perfil() {
  const navigate = useNavigate();

  // 1. El estado ahora coincide con el backend
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  const [originalForm, setOriginalForm] = useState({});
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/auth/perfil")
      .then(response => {
        // 2. Mapeamos la respuesta correcta del backend
        const userData = {
          nombre: response.data.username || "",
          email: response.data.email || "",
          phoneNumber: response.data.phoneNumber || "",
          address: response.data.address || "",
        };
        setForm(userData);
        setOriginalForm(userData); // Guarda el estado original para el botón "Cancelar"
      })
      .catch(error => {
        console.error("Error al cargar los datos del perfil:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate("/login");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const onChange = (e) => {
    const { id, value } = e.target;
    setForm((f) => ({ ...f, [id]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // 3. Enviamos el formulario con los nombres de campo correctos
    api.put("/auth/perfil", {
        nombre: form.nombre,
        phoneNumber: form.phoneNumber,
        address: form.address,
    })
      .then(response => {
        alert("¡Perfil actualizado con éxito!");
        setOriginalForm(form);
        setEdit(false);
      })
      .catch(error => {
        console.error("Error al guardar el perfil:", error);
        alert("No se pudo guardar la información.");
      });
  };

  const handleCancel = () => {
    setForm(originalForm);
    setEdit(false);
  };
  
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
    window.location.reload();
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="perfil container"><p>Cargando perfil...</p></main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="perfil container">
        <header className="perfil-head">
          <div className="perfil-title">
            <h1>Tu perfil</h1>
            <p>Gestioná tus datos, direcciones y pedidos.</p>
          </div>
          <div className="perfil-tabs">
            <span className="chip chip-on">Información</span>
            <button className="chip" type="button" disabled>Pedidos</button>
          </div>
        </header>
        
        <section className="perfil-grid">
          <aside className="perfil-aside card">
            <div className="avatar-wrap" aria-label="Avatar del usuario">
              <div className="avatar-ring"><UserRound size={64} /></div>
              <strong className="avatar-name">{form.nombre}</strong>
              <span className="avatar-mail">{form.email}</span>
            </div>
            <div className="aside-actions">
              <button className="btn btn-full" type="button" disabled><History size={18} /> Historial de compras</button>
              <button className="btn btn-danger btn-full" type="button" onClick={handleLogout}><LogOut size={18} /> Cerrar sesión</button>
            </div>
          </aside>

          <section className="perfil-main card">
            <div className="main-head">
              <h2>Información del perfil</h2>
              {!edit ? (
                <button className="btn" type="button" onClick={() => setEdit(true)}><PencilLine size={18} /> Editar</button>
              ) : (
                <div className="edit-actions">
                  <button className="btn btn-secondary" type="button" onClick={handleCancel}>Cancelar</button>
                  <button className="btn" type="submit" form="perfil-form">Guardar</button>
                </div>
              )}
            </div>

            <form id="perfil-form" className="form-grid" onSubmit={handleSave}>
              <label className="fi">
                <span>Nombre de Usuario</span>
                <div className="input">
                  <UserRound size={16} />
                  <input id="nombre" type="text" value={form.nombre} onChange={onChange} disabled={!edit} />
                </div>
              </label>

              <label className="fi">
                <span>Email</span>
                <div className="input">
                  <Mail size={16} />
                  <input id="email" type="email" value={form.email} disabled />
                </div>
              </label>

              <label className="fi">
                <span>Teléfono</span>
                <div className="input">
                  <Phone size={16} />
                  {/* 4. Corregimos el id del input a 'phoneNumber' */}
                  <input id="phoneNumber" type="tel" value={form.phoneNumber} onChange={onChange} disabled={!edit} placeholder="No establecido" />
                </div>
              </label>

              <label className="fi fi-wide">
                <span>Domicilio</span>
                <div className="input">
                  <MapPin size={16} />
                  {/* 4. Corregimos el id del input a 'address' */}
                  <input id="address" type="text" value={form.address} onChange={onChange} disabled={!edit} placeholder="No establecido" />
                </div>
              </label>
            </form>
            
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