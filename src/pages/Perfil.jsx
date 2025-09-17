import React from "react";
import Header from "../components/Header.jsx";
import "./Perfil.css"

export default function PerfilCliente(){
    return(
        <div className="perfil-container">
            <Header />
            
            <main className="perfil-main">
                {/*Botón superior*/}
                <div className="perfil-header">
                    <button className="perfil-info-btn">Información del Perfil</button>
                </div>

                <hr className="perfil-divider" />

                <div className="perfil-body">
                    {/* Columna izquierda */}
                    <aside className="perfil-sidebar">
                        <div className="perfil-icon user"></div>
                        <div className="perfin-icon history"></div>
                        <button className="perfil-logout">Cerrar Sesión</button>
                    </aside>

                    {/*Columna derecha */}
                    <section className="perfil-datos">
                        <div className="perfil-campo">
                            <label>Nombre: </label>
                            <div className="campo-input"></div>
                        </div>

                        <div className="perfil-campo">
                            <label>Correo Electrónico: </label>
                            <div className="campo-input editable"></div>
                        </div>

                        <div className="perfil-campo">
                            <label>Número de Teléfono: </label>
                            <div className="campo-input editable"></div>
                        </div>

                        <div className="perfil-campo">
                            <label>Domicilio: </label>
                            <div className="campo-input editable"></div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}