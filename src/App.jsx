import { useEffect, useMemo, useState } from "react";
import "./App.css";
import "./theme.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Páginas del usuario
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import DetalleProducto from "./pages/DetalleProducto/DetalleProducto";
import Categoria from "./pages/Categoria/Categoria";
import Carrito from "./pages/Carrito/Carrito";
import Pago from "./pages/Pago/Pago";
import Perfil from "./pages/Perfil/Perfil";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Buscar from "./pages/Buscar/Buscar";

// Admin
import AdminLayout from "./pages/Administrador/AdminLayout";
import Dashboard from "./pages/Administrador/Dashboard";
import Productos from "./pages/Administrador/Productos";
import Pedidos from "./pages/Administrador/Pedidos";
import Ajustes from "./pages/Administrador/Ajustes";
import LogAdmin from "./pages/Administrador/LogAdmin";

function App() {
  // ✅ Inicializa autenticación leyendo el localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("remember_user")
  );

  // ✅ Sincroniza el estado si cambia localStorage (por recarga o login nuevo)
  useEffect(() => {
    const user = localStorage.getItem("remember_user");
    setIsAuthenticated(!!user);
  }, []);

  // ====== DATA DE EJEMPLO (60 productos) ======
  const BASE = [
    {
      name: "Mouse gamer",
      price: 24999,
      img: "https://redragon.es/content/uploads/2021/04/griffin-black-2.jpg",
      categoria: "perifericos",
    },
    {
      name: "Barra de sonido",
      price: 89999,
      img: "https://redragon.es/content/uploads/2022/04/5-ESTILO-Y-ROBUSTEZ.jpg",
      categoria: "audio",
    },
    {
      name: "Teclado RGB",
      price: 45999,
      img: "https://i0.wp.com/www.aslanstoreuy.com/wp-content/uploads/2020/10/Teclado-Gamer-Redragon-Kumara-RGB-Aslan-Store-Uruguay-2.jpg?w=900&ssl=1",
      categoria: "perifericos",
    },
    {
      name: "Cooler CPU RGB",
      price: 32999,
      img: "https://redragon.es/content/uploads/2025/05/C1013-1.jpg",
      categoria: "componentes",
    },
    {
      name: "Auriculares gamer",
      price: 38999,
      img: "https://dojiw2m9tvv09.cloudfront.net/86841/product/X_foto24207.jpg?68&time=1756745608",
      categoria: "audio",
    },
    {
      name: "Notebook gamer",
      price: 299999,
      img: "https://guiadacompra.com/wp-content/uploads/2021/04/gamer-2.jpg",
      categoria: "computadoras",
    },
    {
      name: "Monitor curvo 27”",
      price: 219999,
      img: "https://ocelot.com.mx/wp-content/uploads/2025/05/FONDO_OSCURO-OM_C32-2.jpg",
      categoria: "monitores",
    },
    {
      name: "Micrófono USB",
      price: 25999,
      img: "https://redragon.es/content/uploads/2021/05/B2.jpg",
      categoria: "audio",
    },
    {
      name: "Silla gamer",
      price: 149999,
      img: "https://ocelot.com.mx/wp-content/uploads/2023/07/FONDO-OSCURO-SAVAGE-RED-TELA-7.jpg",
      categoria: "accesorios",
    },
    {
      name: "Mousepad XL",
      price: 12999,
      img: "https://tecnogame.ec/wp-content/uploads/2022/01/Glowing-Cool.jpg",
      categoria: "accesorios",
    },
  ];

  const products = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => {
      const b = BASE[i % BASE.length];
      return {
        id: i + 1,
        name: `${b.name} ${i + 1}`,
        price: b.price + (i % 5) * 1000,
        img: b.img,
        categoria: b.categoria,
      };
    });
  }, []);

  // ✅ Login de administrador
  const handleLogin = (username, password) => {
    if (username === "admin" && password === "1234") {
      localStorage.setItem("remember_user", username);
      setIsAuthenticated(true);
      return true;
    } else {
      return false;
    }
  };

  // ✅ Registro de usuario
  const handleRegister = (username, email, password) => {
    localStorage.setItem("remember_user", username);
    setIsAuthenticated(true);
  };

  // ✅ Logout global
  const handleLogout = () => {
    localStorage.removeItem("remember_user");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* ===== Rutas públicas ===== */}
        <Route
          path="/"
          element={
            <Home
              isAuthenticated={isAuthenticated}
              productos={products}
              onLogout={handleLogout}
            />
          }
        />
        <Route
          path="/login"
          element={
            <Login
              onLogin={handleLogin}
              onRegister={handleRegister}
            />
          }
        />

        {/* ===== Rutas protegidas de usuario ===== */}
        <Route
          path="/perfil"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Perfil onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/carrito"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Carrito productos={products} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pago"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Pago />
            </ProtectedRoute>
          }
        />

        {/* ===== Otras rutas ===== */}
        <Route
          path="/producto/:id"
          element={
            <DetalleProducto
              productos={products}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route
          path="/categoria/:nombreCategoria"
          element={<Categoria productos={products} />}
        />
        <Route path="/buscar" element={<Buscar />} />

        {/* ===== Panel Admin ===== */}
        <Route
          path="/login-admin"
          element={<LogAdmin onLogin={() => setIsAuthenticated(true)} />}
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="productos" element={<Productos />} />
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="ajustes" element={<Ajustes />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
