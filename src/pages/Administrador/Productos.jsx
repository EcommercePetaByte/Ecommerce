import { useState, useEffect } from "react";
import "./AdminLayout.css";

const API_URL = "http://localhost:8080/api";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [editingId, setEditingId] = useState(null); // <-- NUEVO: Estado para saber qué producto se edita
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    desc: "",
    descuento: 0,
    envioGratis: false,
    stock: 0,
    img: "",
    file: null,
  });
  const [imgPreview, setImgPreview] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error cargando productos:", err));

    fetch(`${API_URL}/categories`)
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error("Error cargando categorías:", err));
  }, []);

  const resetForm = () => {
    setForm({
      nombre: "", categoria: "", precio: "", desc: "", descuento: 0,
      envioGratis: false, stock: 0, img: "", file: null
    });
    setImgPreview("");
    setEditingId(null);
  };

  const onChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "file" && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setImgPreview(event.target.result);
        setForm((prev) => ({ ...prev, img: "", file }));
      };
      reader.readAsDataURL(file);
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
      if (name === "img") {
        setImgPreview(value);
        setForm((prev) => ({ ...prev, file: null }));
      }
    }
  };

  // --- NUEVA FUNCIÓN: Maneja el clic en "Editar" ---
  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      nombre: product.name,
      categoria: product.category?.id || "",
      precio: product.price,
      desc: product.description,
      descuento: product.descuento ? 1 : 0, // Ajusta según tu lógica
      envioGratis: product.envioGratis,
      stock: product.stock,
      img: product.imagen || "",
      file: null,
    });
    setImgPreview(product.imagen || "");
    window.scrollTo(0, document.body.scrollHeight); // Scroll hacia el formulario
  };

  // --- NUEVA FUNCIÓN: Maneja el clic en "Eliminar" ---
  const handleDelete = async (productId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      return;
    }

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert("No estás autenticado.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert("Producto eliminado exitosamente.");
        setProductos(productos.filter(p => p.id !== productId)); // Actualiza la UI
      } else {
        alert("Error al eliminar el producto.");
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("Error de conexión al eliminar.");
    }
  };

  // --- handleSubmit AHORA MANEJA CREAR Y ACTUALIZAR ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwtToken');
    if (!token) return alert("No estás autenticado.");

    // Si estamos editando, hacemos un PUT
    if (editingId) {
      const productData = {
        id: editingId,
        name: form.nombre,
        description: form.desc,
        price: parseFloat(form.precio) || 0,
        stock: parseInt(form.stock) || 0,
        descuento: form.descuento > 0,
        envioGratis: form.envioGratis,
        imagen: form.img, // Nota: La edición de imagen requeriría lógica adicional
        category: { id: parseInt(form.categoria) },
      };

      try {
        const response = await fetch(`${API_URL}/products/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(productData)
        });

        if (response.ok) {
          const updatedProduct = await response.json();
          alert("¡Producto actualizado!");
          setProductos(productos.map(p => p.id === editingId ? updatedProduct : p));
          resetForm();
        } else {
          alert("Error al actualizar el producto.");
        }
      } catch (error) {
        alert("Error de conexión al actualizar.");
      }

    } else { // Si no, hacemos un POST para crear
      const formData = new FormData();
      const productData = {
        name: form.nombre, description: form.desc, price: parseFloat(form.precio) || 0,
        stock: parseInt(form.stock) || 0, descuento: form.descuento > 0,
        envioGratis: form.envioGratis, imagen: form.img, category: { id: parseInt(form.categoria) },
      };
      formData.append('product', JSON.stringify(productData));
      if (form.file) formData.append('file', form.file);

      try {
        const response = await fetch(`${API_URL}/products`, {
          method: 'POST',
          body: formData,
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
          const newProduct = await response.json();
          alert("¡Producto guardado!");
          setProductos((prev) => [...prev, newProduct]);
          resetForm();
        } else {
          alert(`Error al guardar el producto.`);
        }
      } catch (error) {
        alert("Error de conexión al guardar.");
      }
    }
  };

  return (
    <>
      <section className="panel">
        <div className="panel-head">
          <h3 className="panel-title">Listado de productos</h3>
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
                <td>{p.name}</td>
                <td>{p.category?.name || 'N/A'}</td>
                <td>${p.price.toLocaleString("es-AR")}</td>
                <td>{p.stock}</td>
                <td>
                  <div style={{ display:"flex", gap:6 }}>
                    {/* Botones con sus nuevas funciones */}
                    <button className="btn" onClick={() => handleEdit(p)}>Editar</button>
                    <button className="btn-ghost" onClick={() => handleDelete(p.id)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h3 className="panel-title">{editingId ? "Editando Producto" : "Cargar Producto"}</h3>
        </div>
        <form className="form-grid" onSubmit={handleSubmit}>
          {/* ... todos tus inputs del formulario no cambian ... */}
          <div className="form-field"><label>Nombre</label><input name="nombre" value={form.nombre} onChange={onChange} /></div>
          <div className="form-field"><label>Categoría</label>
            <select name="categoria" value={form.categoria} onChange={onChange}>
              <option value="">Seleccionar…</option>
              {categorias.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
            </select>
          </div>
          <div className="form-field"><label>Precio (ARS)</label><input name="precio" type="number" value={form.precio} onChange={onChange}/></div>
          <div className="form-field"><label>Stock</label><input name="stock" type="number" value={form.stock} onChange={onChange} /></div>
          <div className="form-field"><label>Descuento (%)</label><input name="descuento" type="number" value={form.descuento} onChange={onChange} /></div>
          <div className="form-field"><label><input type="checkbox" name="envioGratis" checked={form.envioGratis} onChange={onChange} /> Envío gratis</label></div>
          <div className="form-field" style={{ gridColumn: "1 / -1" }}><label>Descripción</label><textarea name="desc" value={form.desc} onChange={onChange}/></div>
          <div className="form-field" style={{ gridColumn: "1 / -1" }}><label>Imagen URL</label><input name="img" value={form.img} onChange={onChange} /></div>
          <div className="form-field" style={{ gridColumn: "1 / -1" }}><label>O subí un archivo</label><input type="file" name="file" accept="image/*" onChange={onChange} /></div>
          {imgPreview && (<div className="img-preview" style={{ gridColumn: "1 / -1" }}><p>Preview:</p><img src={imgPreview} alt="Preview" style={{ maxWidth: "200px", borderRadius: "6px" }} /></div>)}
          
          <div style={{ display:"flex", gap:8, marginTop:12, gridColumn: "1 / -1" }}>
            <button type="submit" className="btn-primary">{editingId ? "Actualizar" : "Guardar"}</button>
            {editingId && (
              <button type="button" className="btn-ghost" onClick={resetForm}>Cancelar</button>
            )}
          </div>
        </form>
      </section>
    </>
  );
}