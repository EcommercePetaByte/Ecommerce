import { useState, useEffect } from "react";
import "./AdminLayout.css"; // Asegúrate de que importe el CSS

const API_URL = "http://localhost:8080/api";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- NUEVOS ESTADOS PARA EL MODAL ---
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setError("No estás autenticado.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Error al obtener los pedidos.');
      const data = await response.json();
      setPedidos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (estado) => {
    switch (estado) {
      case 'PAGADO': case 'COMPLETADO': return 'ok';
      case 'ENVIADO': return 'warn';
      case 'PENDIENTE': case 'CANCELADO': return 'alert';
      default: return '';
    }
  };

  // --- NUEVA FUNCIÓN: Se ejecuta al pulsar "Ver" ---
  const handleViewDetails = async (orderId) => {
    const token = localStorage.getItem('jwtToken');
    setModalLoading(true);
    setSelectedOrder(true); // Abre el modal en modo "cargando"
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("No se pudieron cargar los detalles");
      const data = await response.json();
      setSelectedOrder(data); // Carga los datos reales en el modal
      setNewStatus(data.status); // Pre-selecciona el estado actual en el dropdown
    } catch (err) {
      alert(err.message);
      setSelectedOrder(null); // Cierra el modal si hay error
    } finally {
      setModalLoading(false);
    }
  };

  // --- NUEVA FUNCIÓN: Se ejecuta al guardar el nuevo estado ---
  const handleUpdateStatus = async () => {
    const token = localStorage.getItem('jwtToken');
    setModalLoading(true);
    try {
      const response = await fetch(`${API_URL}/orders/${selectedOrder.id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus }) // Envía JSON
      });

      if (!response.ok) throw new Error("Error al actualizar el estado");
      
      alert("¡Estado actualizado!");
      // Actualiza la lista principal de pedidos en la UI
      setPedidos(pedidos.map(p => 
        p.id === selectedOrder.id ? { ...p, status: newStatus } : p
      ));
      setSelectedOrder(null); // Cierra el modal
    } catch (err) {
      alert(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) return <section className="panel"><p>Cargando pedidos...</p></section>;
  if (error) return <section className="panel"><div className="alert">{error}</div></section>;

  return (
    <>
      <section className="panel">
        <div className="panel-head">
          <h3 className="panel-title">Pedidos</h3>
          {/* ... otros botones ... */}
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
                <td><span className={`badge ${getStatusClass(p.status)}`}>{p.status.toLowerCase()}</span></td>
                <td><button className="btn" onClick={() => handleViewDetails(p.id)}>Ver</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* --- NUEVO: Ventana Modal para detalles del pedido --- */}
      {selectedOrder && (
        <div className="modal-backdrop">
          <div className="modal-content panel">
            <button className="modal-close" onClick={() => setSelectedOrder(null)}>&times;</button>
            
            {modalLoading && !selectedOrder.id ? (
              <p>Cargando detalles...</p>
            ) : (
              <>
                <h3 className="panel-title">Detalle de Orden #{selectedOrder.id}</h3>
                <div className="order-details-grid">
                  <div><strong>Cliente:</strong> {selectedOrder.user.username} ({selectedOrder.user.email})</div>
                  <div><strong>Fecha:</strong> {new Date(selectedOrder.orderDate).toLocaleString("es-AR")}</div>
                  <div><strong>Total:</strong> ${selectedOrder.total.toLocaleString("es-AR")}</div>
                  <div><strong>Pago:</strong> {selectedOrder.paymentMethod}</div>
                </div>

                <h4 className="order-items-title">Productos:</h4>
                <ul className="order-item-list">
                  {selectedOrder.items.map(item => (
                    <li key={item.id}>
                      <span className="item-q">{item.quantity} x</span>
                      <span className="item-name">{item.product.name}</span>
                      <span className="item-price">${item.price.toLocaleString("es-AR")} c/u</span>
                    </li>
                  ))}
                </ul>

                <h4 className="order-status-title">Actualizar Estado:</h4>
                <div className="form-field">
                  <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="PAGADO">Pagado</option>
                    <option value="ENVIADO">Enviado</option>
                    <option value="COMPLETADO">Completado</option>
                    <option value="CANCELADO">Cancelado</option>
                  </select>
                </div>
                <button 
                  className="btn-primary" 
                  onClick={handleUpdateStatus} 
                  disabled={modalLoading || newStatus === selectedOrder.status}
                >
                  {modalLoading ? "Guardando..." : "Guardar Estado"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}