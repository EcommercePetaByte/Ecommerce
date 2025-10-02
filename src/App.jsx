
import { useMemo, useRef, useState } from "react";
import "./App.css";

import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import DetalleProducto from "./pages/DetalleProducto/DetalleProducto";
import Categoria from "./pages/Categoria/Categoria"; // importamos Categoria
import Carrito from "./pages/Carrito/Carrito";
import Pago from "./pages/Pago/Pago";
import Perfil from "./pages/Perfil/Perfil"
import Contrasenia from "./pages/Contrasenia/Contrasenia.jsx";



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ====== DATA DE EJEMPLO (60 productos) ======
  const BASE = [
    { name: "Mouse gamer", price: 24999, img: "https://redragon.es/content/uploads/2021/04/griffin-black-2.jpg", categoria: "perifericos" },
    { name: "Barra de sonido", price: 89999, img: "https://redragon.es/content/uploads/2022/04/5-ESTILO-Y-ROBUSTEZ.jpg", categoria: "audio" },
    { name: "Teclado RGB", price: 45999, img: "https://i0.wp.com/www.aslanstoreuy.com/wp-content/uploads/2020/10/Teclado-Gamer-Redragon-Kumara-RGB-Aslan-Store-Uruguay-2.jpg?w=900&ssl=1", categoria: "perifericos" },
    { name: "Cooler CPU RGB", price: 32999, img: "https://redragon.es/content/uploads/2025/05/C1013-1.jpg", categoria: "componentes" },
    { name: "Auriculares gamer", price: 38999, img: "https://dojiw2m9tvv09.cloudfront.net/86841/product/X_foto24207.jpg?68&time=1756745608", categoria: "audio" },
    { name: "Notebook gamer", price: 299999, img: "https://guiadacompra.com/wp-content/uploads/2021/04/gamer-2.jpg", categoria: "computadoras" },
    { name: "Monitor curvo 27”", price: 219999, img: "https://ocelot.com.mx/wp-content/uploads/2025/05/FONDO_OSCURO-OM_C32-2.jpg", categoria: "monitores" },
    { name: "Micrófono USB", price: 25999, img: "https://redragon.es/content/uploads/2021/05/B2.jpg", categoria: "audio" },
    { name: "Silla gamer", price: 149999, img: "https://ocelot.com.mx/wp-content/uploads/2023/07/FONDO-OSCURO-SAVAGE-RED-TELA-7.jpg", categoria: "accesorios" },
    { name: "Mousepad XL", price: 12999, img: "https://tecnogame.ec/wp-content/uploads/2022/01/Glowing-Cool.jpg", categoria: "accesorios" },
  ];

   const products = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => {
      const b = BASE[i % BASE.length];
      return {
        id: i + 1,
        name: `${b.name} ${i + 1}`,
        price: b.price + (i % 5) * 1000,
        img: b.img,
        categoria: b.categoria, //  importante: agregamos la categoría
      };
    });
  }, []);

   //  Login devuelve true si es correcto, false si falla
  const handleLogin = (email, password) => {
    if (email === "admin@gmail.com" && password === "1234") {
      setIsAuthenticated(true);
      return true;
    } else {
      return false;
    }
  };

const handleRegister = (username, email, password) => {
    setIsAuthenticated(true); // registro siempre “exitoso”
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<Home isAuthenticated={isAuthenticated} productos={products} />} 
        />
        <Route 
          path="/login" 
          element={<Login onLogin={handleLogin} onRegister={handleRegister} />} 
        />

        <Route path="/recuperar" element={<Contrasenia />} />

        <Route 
          path="/producto/:id" 
          element={<DetalleProducto productos={products} />} 
        />
        <Route 
          path="/categoria/:nombreCategoria" 
          element={<Categoria productos={products} />} 
        />
        <Route
        path="/Carrito"
        element={<Carrito />}
        />
        <Route 
        path="/Pago"
        element={<Pago />}
        />
        <Route 
        path="/Perfil"
        element={<Perfil />}
        />
      </Routes>
    </Router>
  );
}

export default App;