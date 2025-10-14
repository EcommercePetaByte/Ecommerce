import React, { useState } from "react";
import {useNavigate} from "react-router-dom"
import Chatbot from "../../components/Chatbot/Chatbot";
import "./Pago.css";

export default function Pago() {
  const [metodo, setMetodo] = useState("tarjeta"); // tarjeta | qr
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);

  const handleCancelar = () =>{
    navigate("/carrito")
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Pago procesado correctamente ✅");
  };

  return (
    <div>
      <main className="pago-container">
        <h1>Finalizar Compra 💳</h1>

        <div className="pago-metodos">
          <button
            className={metodo === "tarjeta" ? "active" : ""}
            onClick={() => setMetodo("tarjeta")}
          >
            Tarjeta
          </button>
          <button
            className={metodo === "qr" ? "active" : ""}
            onClick={() => setMetodo("qr")}
          >
            QR / Mercado Pago
          </button>
        </div>

        {metodo === "tarjeta" && (
          <form className="pago-form" onSubmit={handleSubmit}>
            <label>
              Número de tarjeta
              <input type="text" placeholder="0000 0000 0000 0000" required />
            </label>
            <label>
              Vencimiento
              <input type="text" placeholder="MM/AA" required />
            </label>
            <label>
              CVC
              <input type="text" placeholder="000" required />
            </label>
            <label>
              Titular
              <input type="text" placeholder="Nombre completo" required />
            </label>
            <label>
              DNI
              <input type="text" placeholder="12345678" required />
            </label>

            <div className="pago-acciones">
              <button type="button" className="btn-cancelar" onClick={handleCancelar}>
                Cancelar
              </button>
              <button type="submit" className="pagar-btn">
                Pagar
              </button>
            </div>
          </form>
        )}

        {metodo === "qr" && (
          <div className="pago-qr">
            <h2>Escanea el QR con tu app de Mercado Pago</h2>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/8/89/QR_code_Billboard.png"
              alt="QR Mercado Pago"
            />
            <button className="volver-btn" onClick={() => setMetodo("tarjeta")}>
              Volver a Tarjeta
            </button>
          </div>
        )}
         {/** Chatbot - botón flotante */}
         <button className="fab" title="Ayuda" onClick={() => setChatOpen(!chatOpen)}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M4 5h16v10H7l-3 3V5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          </svg>
         </button>
         
         {chatOpen && <Chatbot />}
      </main>
    </div>
  );
}
