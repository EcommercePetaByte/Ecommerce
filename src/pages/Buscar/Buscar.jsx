import { useEffect, useState } from "react";
// 1. Asegúrate de importar 'Link' de react-router-dom
import { useSearchParams, Link } from "react-router-dom";
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
    setLoading(true);
    setError(null);

    api.get(`/products/search?${queryString}`)
      .then((response) => {
        setResultados(response.data);
      })
      .catch((err) => {
        console.error("Error al buscar productos:", err);
        setError("No se pudieron cargar los resultados.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  if (loading) {
    return <div className="busqueda-estado">Buscando productos...</div>;
  }

  if (error) {
    return <div className="busqueda-estado error">{error}</div>;
  }

  return (
    <div className="busqueda-container">
      {queryTerm ? (
        <h1>Resultados para: "{queryTerm}"</h1>
      ) : (
        <h1>Nuestros Productos</h1>
      )}

      <div className="productos-grid">
        {resultados.length === 0 ? (
          <p className="no-resultados">No se encontraron productos que coincidan con tu búsqueda.</p>
        ) : (
          resultados.map((producto) => (
            // --- LA CORRECCIÓN ESTÁ AQUÍ ---
            // 2. Envolvemos la tarjeta en un componente <Link>
            // 3. La prop 'to' crea una URL única para cada producto (ej: /producto/1, /producto/2, etc.)
            <Link to={`/producto/${producto.id}`} key={producto.id} className="producto-card">
              <div className="producto-imagen-container">
                <img
                  src={producto.imagen || 'https://via.placeholder.com/300x300.png?text=Producto'}
                  alt={producto.name}
                  className="producto-imagen"
                />
              </div>
              <div className="producto-info">
                <h3 className="producto-nombre">{producto.name}</h3>
                <p className="producto-precio">${producto.price.toFixed(2)}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}