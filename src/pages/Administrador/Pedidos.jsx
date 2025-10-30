import { useState, useEffect } from "react";

// Ajusta la URL base de tu API si es necesario
const API_URL = "http://localhost:8080/api";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError("No estás autenticado.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener los pedidos. ¿Tienes permisos de administrador?');
        }

        const data = await response.json();
        setPedidos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []); // El array vacío asegura que se ejecute solo una vez

  const getStatusClass = (estado) => {
    switch (estado) {
      case 'PAGADO':
      case 'COMPLETADO':
        return 'ok';
      case 'ENVIADO':
        return 'warn';
      case 'PENDIENTE':
      case 'CANCELADO':
        return 'alert';
      default:
        return '';
    }
  };

  if (loading) {
    return <section className="panel"><p>Cargando pedidos...</p></section>;
  }

  if (error) {
    return <section className="panel"><div className="alert">{error}</div></section>;
  }

  return (
    <section className="panel">
      <div className="panel-head">
        <h3 className="panel-title">Pedidos</h3>
        <div style={{ display:"flex", gap:8 }}>
          <button className="btn">Filtrar</button>
          <button className="btn-ghost">Exportar</button>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Orden</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Pago</th><th>Estado</th><th></th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map(p => (
            <tr key={p.id}>
              <td>#{p.id}</td>
              <td>{new Date(p.orderDate).toLocaleDateString("es-AR")}</td>
              <td>{p.user.username}</td>
              <td>${p.total.toLocaleString("es-AR")}</td>
              <td>{p.paymentMethod}</td>
              <td>
                <span className={`badge ${getStatusClass(p.status)}`}>
                  {p.status.toLowerCase()}
                </span>
              </td>
              <td><button className="btn">Ver</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}