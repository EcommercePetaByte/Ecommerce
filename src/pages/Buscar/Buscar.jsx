import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Buscar() {
  const location = useLocation();
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q") || "";
    const categoria = params.get("categoria") || "";
    const min = params.get("min") || "";
    const max = params.get("max") || "";
    const envioGratis = params.get("envioGratis") === "true";
    const descuento = params.get("descuento") === "true";
    const orden = params.get("orden") || "";

    // Simular o hacer una petición al backend
    fetch(`http://localhost:8080/api/products/search?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error(err));
  }, [location.search]);

  return (
    <div className="productos-container">
      {productos.length === 0 ? (
        <p>No se encontraron productos.</p>
      ) : (
        productos.map((p) => (
          <div key={p.id} className="producto-card">
            <img src={p.imagen} alt={p.nombre} />
            <h3>{p.nombre}</h3>
            <p>${p.precio}</p>
          </div>
        ))
      )}
    </div>
  );
}
