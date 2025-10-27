import { useEffect, useMemo, useState } from "react";
import "./App.css";
import "./theme.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import api from "./api"; // <-- usamos tu instancia configurada con baseURL y token

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Revisar token al cargar la app y setearlo en api
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setIsAuthenticated(true);
      // @ts-ignore
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  // ====== DATA DE EJEMPLO ======
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

  // --- LÓGICA DE LOGIN Y REGISTER ELIMINADA ---
  // (La lógica real ahora vive en Login.jsx, que es correcto)

  // Logout global
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("remember_user");
    // MODIFICACIÓN: Limpiamos también los roles al hacer logout
    localStorage.removeItem("userRoles");
    // @ts-ignore
    delete api.defaults.headers.common["Authorization"];
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
          // --- ESTA ES LA CORRECCIÓN ---
          // Le pasamos setIsAuthenticated para que Login.jsx pueda
          // actualizar el estado de App.jsx
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
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
            <DetalleProducto productos={products} isAuthenticated={isAuthenticated} />
          }
        />
        <Route path="/categoria/:nombreCategoria" element={<Categoria productos={products} />} />
        <Route path="/buscar" element={<Buscar />} />

        {/* ===== Panel Admin (RUTA CORREGIDA) ===== */}
        <Route path="/login-admin" element={<LogAdmin onLogin={() => setIsAuthenticated(true)} />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="ROLE_ADMIN">
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
