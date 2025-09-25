import React from "react";
import Header from "../../components/Header/Header";
import './Perfil.css';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaHistory, FaPen } from 'react-icons/fa';

const Perfil = () => {
  const navigate = useNavigate();

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    console.log('Cerrando sesión...');
    // Aquí podés limpiar tokens, localStorage, etc.
    navigate('/login'); // Redirige al login
  };

  return (
    <>
      <Header />

      <div className="perfil-container">
        {/* Header del perfil */}
        <div className="perfil-header">
          <h2>Perfil Cliente</h2>
          <div className="perfil-tab">
            <p>Información del Perfil</p>
          </div>
        </div>

        <div className="perfil-content">
          {/* Sidebar con avatar y botones */}
          <div className="perfil-sidebar">
            <div className="perfil-avatar">
              <FaUser size={50} className="avatar-icon" />
            </div>

            <button className="sidebar-btn">
              <FaHistory /> Historial de Compras
            </button>

            <button className="sidebar-btn logout-btn" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>

          {/* Sección de información editable */}
          <div className="perfil-info-section">
            <div className="info-item">
              <label>Nombre:</label>
              <div className="info-field">
                <input type="text" value="[Nombre del usuario]" disabled />
                <FaPen className="edit-icon" />
              </div>
            </div>

            <div className="info-item">
              <label>Correo Electrónico:</label>
              <div className="info-field">
                <input type="email" value="[Correo del usuario]" disabled />
                <FaPen className="edit-icon" />
              </div>
            </div>

            <div className="info-item">
              <label>Número de teléfono:</label>
              <div className="info-field">
                <input type="tel" value="[Número de teléfono]" disabled />
                <FaPen className="edit-icon" />
              </div>
            </div>

            <div className="info-item">
              <label>Domicilio:</label>
              <div className="info-field">
                <input type="text" value="[Domicilio del usuario]" disabled />
                <FaPen className="edit-icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Perfil;
