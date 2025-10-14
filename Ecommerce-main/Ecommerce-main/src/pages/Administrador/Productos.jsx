import { useState } from "react";

export default function Productos() {
  const [form, setForm] = useState({ nombre: "", categoria: "", precio: "", desc: "" });

  const productos = [
    { id: 1, nombre: "Teclado RGB", categoria: "periféricos", precio: 45999, stock: 34 },
    { id: 2, nombre: "Auriculares", categoria: "audio", precio: 38999, stock: 12 },
    { id: 3, nombre: "Monitor 27”", categoria: "monitores", precio: 219999, stock: 6 },
  ];

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <>
      {/* Tabla */}
      <section className="panel">
        <div className="panel-head">
          <h3 className="panel-title">Listado de productos</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn">Exportar CSV</button>
            <button className="btn-primary">+ Nuevo</button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th></th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>${p.precio.toLocaleString("es-AR")}</td>
                <td>{p.stock}</td>
                <td>
                  <div style={{ display:"flex", gap:6 }}>
                    <button className="btn">Editar</button>
                    <button className="btn-ghost">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Formulario */}
      <section className="panel">
        <div className="panel-head">
          <h3 className="panel-title">Cargar / Editar producto</h3>
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label>Nombre</label>
            <input name="nombre" value={form.nombre} onChange={onChange} placeholder="Ej. Mouse gamer" />
          </div>

          <div className="form-field">
            <label>Categoría</label>
            <select name="categoria" value={form.categoria} onChange={onChange}>
              <option value="">Seleccionar…</option>
              <option value="periféricos">Periféricos</option>
              <option value="audio">Audio</option>
              <option value="componentes">Componentes</option>
              <option value="monitores">Monitores</option>
              <option value="computadoras">Computadoras</option>
              <option value="accesorios">Accesorios</option>
            </select>
          </div>

          <div className="form-field">
            <label>Precio (ARS)</label>
            <input name="precio" type="number" value={form.precio} onChange={onChange} placeholder="0" />
          </div>

          <div className="form-field" style={{ gridColumn: "1 / -1" }}>
            <label>Descripción</label>
            <textarea name="desc" value={form.desc} onChange={onChange} placeholder="Características, materiales, compatibilidad…" />
          </div>

          <div className="form-field" style={{ gridColumn: "1 / -1" }}>
            <label>Imágenes</label>
            <div className="uploader">
              <p>Arrastrá y soltá archivos aquí<br/>o <b>hacé click</b> para seleccionar</p>
            </div>
          </div>
        </div>

        <div style={{ display:"flex", gap:8, marginTop:12 }}>
          <button className="btn-ghost">Descartar</button>
          <button className="btn-primary">Guardar</button>
        </div>
      </section>
    </>
  );
}

