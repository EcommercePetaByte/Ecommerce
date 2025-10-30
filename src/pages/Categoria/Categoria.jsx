import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { agregarAlCarrito } from "../../carrito";
import "./Categoria.css";

export default function Categoria() {
  const { nombreCategoria } = useParams();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState("");
  const isAuthenticated = !!localStorage.getItem("jwtToken");

  useEffect(() => {
    if (!nombreCategoria) return;

    setLoading(true);
    setError(null);

    // ✅ Llamada correcta a la API
    api
      .get(`/products/search?categoria=${encodeURIComponent(nombreCategoria)}`)
      .then((response) => {
        setProductos(response.data);
      })
      .catch((err) => {
        console.error("Error al cargar productos por categoría:", err);
        setError("No se pudieron cargar los productos.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [nombreCategoria]);

  const handleAdd = (producto) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    agregarAlCarrito(producto);
    setToast(`${producto.name} agregado al carrito`);
    setTimeout(() => setToast(""), 2000);
  };

  const toARS = (n) =>
    Number(n).toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    });

  if (loading) {
    return (
      <>
        <Header />
        <main className="busqueda-container">
          <div className="busqueda-estado">Cargando productos...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="busqueda-container">
          <div className="busqueda-estado error">{error}</div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="busqueda-container">
        <h1>
          Categoría:{" "}
          <span style={{ color: "var(--accent-color)" }}>{nombreCategoria}</span>
        </h1>

        <div className="productos-grid">
          {productos.length > 0 ? (
            productos.map((p) => (
              <article key={p.id} className="producto-card">
                <Link
                  to={`/producto/${p.id}`}
                  className="producto-imagen-container"
                >
                  <img
                    src={
                      p.imagen ||
                      "https://via.placeholder.com/300x300.png?text=Producto"
                    }
                    alt={p.name}
                    className="producto-imagen"
                  />
                </Link>
                <div className="producto-info">
                  <h3 className="producto-nombre">
                    <Link to={`/producto/${p.id}`}>{p.name}</Link>
                  </h3>
                  <p className="producto-precio">{toARS(p.price)}</p>
                  <button className="btn-comprar" onClick={() => handleAdd(p)}>
                    Agregar al carrito
                  </button>
                </div>
              </article>
            ))
          ) : (
            <p className="no-resultados">
              No se encontraron productos en esta categoría.
            </p>
          )}
        </div>
        {toast && <div className="toast">{toast}</div>}

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
      <Footer />
    </>
  );
}
