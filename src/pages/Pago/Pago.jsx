import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { initMercadoPago } from "@mercadopago/sdk-react";
import "./Pago.css";

export default function Pago() {
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();

  // Inicializar Mercado Pago y cargar carrito
  useEffect(() => {
    initMercadoPago("APP_USR-66bc612d-6ad0-4aa8-8393-7b3a415af55d"); 
    const savedCart = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(savedCart);
  }, []);

  const handleCancelar = () => {
    navigate("/carrito");
  };

  const handleMercadoPago = async () => {
    if (!carrito || carrito.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    // Filtrar items válidos
    const validItems = carrito
      .filter((p) => p.cantidad > 0 && p.price != null)
      .map((p) => ({
        title: p.name,
        quantity: p.cantidad,
        price: Number(p.price),
      }));

    if (validItems.length === 0) {
      alert("No hay items válidos para pagar.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/api/payments/create",
        { items: validItems }
      );

      if (res.data.init_point) {
        // Redirigir al checkout de Mercado Pago
        window.location.href = res.data.init_point;
      } else if (res.data.error) {
        console.error("Error al crear la preferencia:", res.data.error);
        alert(res.data.error);
      } else {
        console.error("Error desconocido al crear la preferencia:", res.data);
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

        <div className="pago-qr">
          <h2>Pagar con Mercado Pago (Sandbox)</h2>
          <p>Simulá tu pago de forma segura con tu cuenta de prueba</p>

          <button className="pagar-btn" onClick={handleMercadoPago}>
            Ir al checkout de Mercado Pago
          </button>

          <button className="volver-btn" onClick={handleCancelar}>
            Volver al carrito
          </button>
        </div>

        {/* Botón flotante para abrir el chat externo */}
        <button
          className="fab"
          title="Ayuda"
          onClick={() =>
            window.open(
              "https://agent.jotform.com/0199ee22e3507441ae60ecc8dc3dde4c9ec2",
              "_blank",
              "noopener,noreferrer"
            )
          }
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
      </main>
    </div>
  );
}
