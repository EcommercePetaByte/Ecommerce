import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { initMercadoPago } from "@mercadopago/sdk-react";
import Chatbot from "../../components/Chatbot/Chatbot";
import "./Pago.css";

export default function Pago() {
  const [metodo, setMetodo] = useState("tarjeta"); // "tarjeta" o "qr"
  const [chatOpen, setChatOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Inicializar Mercado Pago una sola vez
  useEffect(() => {
    // ⚠️ Reemplazá esta clave por tu PUBLIC KEY de modo sandbox desde developers.mercadopago.com
    initMercadoPago("APP_USR-66bc612d-6ad0-4aa8-8393-7b3a415af55d");
  }, []);

  //  Botón para volver al carrito
  const handleCancelar = () => {
    navigate("/carrito");
  };

  //  Simulación de pago con tarjeta (no real)
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Pago procesado correctamente ✅ (simulado)");
  };

  //  Pago real con Mercado Pago
  const handleMercadoPago = async () => {
    try {
      // Enviamos los datos del producto al backend
      const res = await axios.post("http://localhost:8080/api/payments/create", {
        title: "Compra Ecommerce Gian",
        quantity: 1,
        price: 5000, // Podés reemplazar esto con el total real del carrito
      });

      // Si Mercado Pago devuelve la URL de pago, redirigimos al checkout
      if (res.data.init_point) {
        window.location.href = res.data.init_point;
      } else {
        console.error("Error al crear la preferencia:", res.data);
        alert("No se pudo crear la preferencia de pago.");
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      alert("Ocurrió un error al conectar con el servidor.");
    }
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

        {/* Pago con tarjeta (formulario simulado) */}
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
              <button
                type="button"
                className="btn-cancelar"
                onClick={handleCancelar}
              >
                Cancelar
              </button>
              <button type="submit" className="pagar-btn">
                Pagar
              </button>
            </div>
          </form>
        )}

        {/* Pago real con Mercado Pago */}
        {metodo === "qr" && (
          <div className="pago-qr">
            <h2>Pagar con Mercado Pago (Sandbox)</h2>
            <p>Simulá tu pago de forma segura con tu cuenta de prueba</p>

            <button className="pagar-btn" onClick={handleMercadoPago}>
              Ir al checkout de Mercado Pago
            </button>

            <button className="volver-btn" onClick={() => setMetodo("tarjeta")}>
              Volver a Tarjeta
            </button>
          </div>
        )}

        {/* Chatbot - botón flotante */}
        <button
          className="fab"
          title="Ayuda"
          onClick={() => setChatOpen(!chatOpen)}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 5h16v10H7l-3 3V5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {chatOpen && <Chatbot />}
      </main>
    </div>
  );
}
