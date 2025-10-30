import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import api from "../../api";
import "./Buscar.css";

export default function Buscar() {
  const [searchParams] = useSearchParams();
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const queryTerm = searchParams.get("q") || "";

  useEffect(() => {
    const queryString = searchParams.toString();
    if (!queryString) {
      setResultados([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // ✅ Llamada unificada al endpoint dinámico
    api
      .get(`/products/search?${queryString}`)
      .then((response) => setResultados(response.data))
      .catch((err) => {
        console.error("Error al buscar productos:", err);
        setError("No se pudieron cargar los resultados.");
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

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
          <div className="busqueda-estado">Buscando productos...</div>
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
      <div className="busqueda-container">
        {queryTerm ? (
          <h1>Resultados para: "{queryTerm}"</h1>
        ) : (
          <h1>Nuestros Productos</h1>
        )}

        <div className="productos-grid">
          {resultados.length === 0 ? (
            <p className="no-resultados">
              No se encontraron productos que coincidan con tu búsqueda.
            </p>
          ) : (
            resultados.map((producto) => (
              <Link
                to={`/producto/${producto.id}`}
                key={producto.id}
                className="producto-card"
              >
                <div className="producto-imagen-container">
                  <img
                    src={
                      producto.imagen ||
                      "https://via.placeholder.com/300x300.png?text=Producto"
                    }
                    alt={producto.name}
                    className="producto-imagen"
                  />
                </div>
                <div className="producto-info">
                  <h3 className="producto-nombre">{producto.name}</h3>
                  <p className="producto-precio">{toARS(producto.price)}</p>
                </div>
              </Link>
            ))
          )}
        </div>

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
      </div>
      <Footer />
    </>
  );
}
