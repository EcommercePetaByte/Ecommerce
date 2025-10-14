export default function Ajustes() {
  return (
    <section className="panel">
      <div className="panel-head">
        <h3 className="panel-title">Ajustes generales</h3>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label>Nombre de la tienda</label>
          <input placeholder="Petabyte" />
        </div>

        <div className="form-field">
          <label>Moneda</label>
          <select defaultValue="ARS">
            <option value="ARS">ARS</option>
            <option value="USD">USD</option>
          </select>
        </div>

        <div className="form-field">
          <label>Mail de soporte</label>
          <input placeholder="soporte@tutienda.com" />
        </div>

        <div className="form-field">
          <label>Teléfono</label>
          <input placeholder="+54 11 5555 5555" />
        </div>

        <div className="form-field" style={{ gridColumn:"1 / -1" }}>
          <label>Mensaje del banner (home)</label>
          <textarea placeholder="Envíos a todo el país · 12 cuotas sin interés" />
        </div>
      </div>

      <div style={{ display:"flex", gap:8, marginTop:12 }}>
        <button className="btn-ghost">Cancelar</button>
        <button className="btn-primary">Guardar cambios</button>
      </div>
    </section>
  );
}

