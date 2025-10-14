export default function Pedidos() {
  const pedidos = [
    { id:"#10234", fecha:"2025-09-12", cliente:"Juan Pérez", total:152000, pago:"MercadoPago", estado:"pagado" },
    { id:"#10233", fecha:"2025-09-11", cliente:"Ana Rosa", total:89000, pago:"Tarjeta", estado:"pendiente" },
    { id:"#10232", fecha:"2025-09-10", cliente:"Carlos Z", total:245000, pago:"Transferencia", estado:"enviado" },
  ];

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
          {pedidos.map(p=>(
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.fecha}</td>
              <td>{p.cliente}</td>
              <td>${p.total.toLocaleString("es-AR")}</td>
              <td>{p.pago}</td>
              <td><span className={`badge ${p.estado==="pagado"?"ok":p.estado==="enviado"?"warn":"alert"}`}>{p.estado}</span></td>
              <td><button className="btn">Ver</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

