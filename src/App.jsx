import { useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import DetalleProducto from "./pages/DetalleProducto/DetalleProducto";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ====== DATA DE EJEMPLO ======
  const BASE = [
    { name: "Mouse gamer", price: 24999, img: "https://redragon.es/content/uploads/2021/04/griffin-black-2.jpg" },
    { name: "Barra de sonido", price: 89999, img: "https://redragon.es/content/uploads/2022/04/5-ESTILO-Y-ROBUSTEZ.jpg" },
    { name: "Teclado RGB", price: 45999, img: "https://i0.wp.com/www.aslanstoreuy.com/wp-content/uploads/2020/10/Teclado-Gamer-Redragon-Kumara-RGB-Aslan-Store-Uruguay-2.jpg?w=900&ssl=1" },
    { name: "Cooler CPU RGB", price: 32999, img: "https://redragon.es/content/uploads/2025/05/C1013-1.jpg" },
    { name: "Auriculares gamer", price: 38999, img: "https://dojiw2m9tvv09.cloudfront.net/86841/product/X_foto24207.jpg?68&time=1756745608" },
    { name: "Notebook gamer", price: 299999, img: "https://guiadacompra.com/wp-content/uploads/2021/04/gamer-2.jpg" },
    { name: "Monitor curvo 27”", price: 219999, img: "https://ocelot.com.mx/wp-content/uploads/2025/05/FONDO_OSCURO-OM_C32-2.jpg" },
    { name: "Micrófono USB", price: 25999, img: "https://redragon.es/content/uploads/2021/05/B2.jpg" },
    { name: "Silla gamer", price: 149999, img: "https://ocelot.com.mx/wp-content/uploads/2023/07/FONDO-OSCURO-SAVAGE-RED-TELA-7.jpg" },
    { name: "Mousepad XL", price: 12999, img: "https://tecnogame.ec/wp-content/uploads/2022/01/Glowing-Cool.jpg" },
  ];

  const products = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => {
      const b = BASE[i % BASE.length];
      return {
        id: i + 1,
        name: `${b.name} ${i + 1}`,
        price: b.price + (i % 5) * 1000,
        img: b.img,
      };
    });
  }, []);

  // ✅ Login devuelve true si es correcto, false si falla
  const handleLogin = (username, password) => {
    if (username === "admin" && password === "1234") {
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
        <Route 
          path="/producto/:id" 
          element={<DetalleProducto productos={products} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
