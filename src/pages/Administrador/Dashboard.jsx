export default function Dashboard() {
  const kpis = [
    { label: "Ingresos (30d)", value: "$ 3.2M", delta: "+12%" },
    { label: "Pedidos", value: "1.284", delta: "+5%" },
    { label: "Ticket Prom.", value: "$ 2.520", delta: "+2%" },
    { label: "Devoluciones", value: "18", delta: "-3%" },
  ];

  const recientes = [
    { id: "#10234", cliente: "Juan Pérez", total: 152000, estado: "pagado" },
    { id: "#10233", cliente: "Ana Rosa", total: 89000, estado: "pendiente" },
    { id: "#10232", cliente: "Carlos Z", total: 245000, estado: "enviado" },
  ];

  return (
    <>
      {/* KPIs */}
      <section className="kpis">
        {kpis.map((k) => (
          <div className="kpi" key={k.label}>
            <div className="label">{k.label}</div>
            <div className="value">{k.value}</div>
            <div className="delta">{k.delta}</div>
          </div>
        ))}
      </section>

      {/* Órdenes recientes */}
      <section className="panel">
        <div className="panel-head">
          <h3 className="panel-title">Órdenes recientes</h3>
          <button className="btn-ghost">Ver todas</button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Orden</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {recientes.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.cliente}</td>
                <td>${o.total.toLocaleString("es-AR")}</td>
                <td>
                  <span className={`badge ${o.estado === "pagado" ? "ok" : o.estado === "enviado" ? "warn" : "alert"}`}>
                    {o.estado}
                  </span>
                </td>
                <td>
                  <button className="btn">Detalles</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Acciones rápidas */}
      <section className="panel">
        <div className="panel-head">
          <h3 className="panel-title">Acciones rápidas</h3>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn-primary">+ Producto</button>
          <button className="btn">Generar reporte</button>
          <button className="btn">Cupones</button>
          <button className="btn">Banner Home</button>
        </div>
      </section>
    </>
  );
}

