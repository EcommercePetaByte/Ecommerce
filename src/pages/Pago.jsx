import React, {useState} from "react";
import Header from "../components/Header.jsx";
import "./Pago.css";
import { useNavigate } from "react-router-dom";

export default function Pago(){
    const [metodo, setMetodo] = useState("tarjeta"); //tarjeta | qr
    const navigate = useNavigate();

    const handleCancelar = ()=>{
        navigate("/Carrito");
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Pago procesado correctamente ✅");
    };

    return(
    
        <div>
            <Header />
            <main className="pago-container">
                <h1>Finalizar Compra 💳</h1>
                <div className="pago-metodos">
                    <button className={metodo === "tarjeta" ? "active" : ""} onClick={() => setMetodo("tarjeta")}>Tarjeta</button>
                    <button className={metodo === "qr" ? "active" : ""} onClick={() => setMetodo("qr")}>QR / Mercado Pago</button> 
                </div>

                {metodo === "tarjeta" &&(
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
                            <input type="text" placeholder="Nombre y Apellido" required />
                        </label>
                        <label>
                            D.N.I
                            <input type="text" placeholder="12345678" required/> 
                        </label>

                        <div className="pago-acciones">
                            <button type="button" className="cancelar-btn" onClick={handleCancelar}>
                                Cancelar
                            </button>
                            <button type="submit" className="pagar-btn">
                                Pagar
                            </button>
                        </div>
                    </form>
                )}

                {metodo === "qr" &&(
                    <div className="pago-qr">
                        <h2>Escanea el QR con tu app de Mercado Pago</h2>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/QR_code_Billboard.png" alt="QR Mercado Pago" />
                        <button className="volver-btn" onClick={() => setMetodo("tarjeta")}>
                            Volver
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}