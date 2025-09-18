// Products.jsx
import "./cargarProducto.css";
import Header from "../../../components/Header/Header";

export default function Products() {
  return (
    <div className="container">
      
        <Header />

      <main className="product-page">
        <h2 className="title">Productos</h2>

        <div className="content">
          <div className="upload-box">
            <p>Subir Imagen</p>
            <button>↑</button>
          </div>

          <form className="product-form">
            <label htmlFor="name">Nombre Producto:</label>
            <input type="text" id="name" />

            <label htmlFor="category">Categoría:</label>
            <select id="category">
              <option value="">Seleccione...</option>
              <option>Electrónica</option>
              <option>Accesorios</option>
              <option>Otros</option>
            </select>

            <label htmlFor="price">Precio (usd):</label>
            <input type="number" id="price" step="0.01" />

            <label htmlFor="desc">Descripción:</label>
            <textarea id="desc"></textarea>

            <div className="buttons">
              <button type="button" className="back">
                Volver
              </button>
              <button type="submit" className="accept">
                Aceptar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
