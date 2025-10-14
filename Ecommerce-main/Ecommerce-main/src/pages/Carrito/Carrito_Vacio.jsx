import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Gift, Truck, ShieldCheck } from "lucide-react";
import "./CarritoVacio.css";

export default function EmptyCart() {
  const navigate = useNavigate();

  return (
    <main className="cart-empty-wrap">
      <section className="cart-empty-card">
        <div className="icon-bubble">
          <ShoppingCart size={32} />
        </div>

        <h1 className="title">Tu carrito está vacío</h1>
        <p className="subtitle">
          ¿No sabés por dónde empezar? Explorá las categorías o mirá las ofertas de hoy.
        </p>

        <div className="cta-row">
          <button className="btn ghost" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Volver
          </button>
          <Link to="/" className="btn primary">Ir a comprar</Link>
        </div>

        <ul className="perks">
          <li><Truck size={16} /> Envíos a todo el país</li>
          <li><Gift size={16} /> Promos y cuotas sin interés</li>
          <li><ShieldCheck size={16} /> Garantía oficial</li>
        </ul>
      </section>
    </main>
  );
}

