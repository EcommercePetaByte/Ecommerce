import "./Footer.css";

<<<<<<< HEAD
const Footer = () => {
  return (
    <footer className="footer">
      <p>© 2025 MiEcommerce. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;
=======
function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p>© {new Date().getFullYear()} Mi E-commerce. Todos los derechos reservados.</p>
        <nav style={styles.nav}>
          <a href="/about">Sobre nosotros</a>
          <a href="/contact">Contacto</a>
          <a href="/terms">Términos y condiciones</a>
        </nav>
      </div>
    </footer>
  );
}
>>>>>>> amigo/master
