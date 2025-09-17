import "./Navbar.css";
import SearchBar from "../SearchBar/SearchBar";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">MiEcommerce</div>
      <SearchBar />
      <div className="navbar-links">
        <a href="#productos">Productos</a>
        <a href="#ofertas">Ofertas</a>
        <a href="#carrito">Carrito</a>
      </div>
    </nav>
  );
};

export default Navbar;