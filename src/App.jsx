import { useEffect, useMemo, useState } from "react";
import "./App.css";
import "./theme.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// @ts-ignore
import api from "./api"; // <-- usamos tu instancia configurada con baseURL y token

// Páginas del usuario
// @ts-ignore
import Home from "./pages/Home/Home";
// @ts-ignore
import Login from "./pages/Login/Login";
// @ts-ignore
import DetalleProducto from "./pages/DetalleProducto/DetalleProducto";
// @ts-ignore
import Categoria from "./pages/Categoria/Categoria";
// @ts-ignore
import Carrito from "./pages/Carrito/Carrito";
// @ts-ignore
import Pago from "./pages/Pago/Pago";
// @ts-ignore
import Perfil from "./pages/Perfil/Perfil";
// @ts-ignore
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"; // Este archivo también lo modificaremos
// @ts-ignore
import Buscar from "./pages/Buscar/Buscar";

// Admin
// @ts-ignore
import AdminLayout from "./pages/Administrador/AdminLayout";
// @ts-ignore
import Dashboard from "./pages/Administrador/Dashboard";
// @ts-ignore
import Productos from "./pages/Administrador/Productos";
// @ts-ignore
import Pedidos from "./pages/Administrador/Pedidos";
// @ts-ignore
import Ajustes from "./pages/Administrador/Ajustes";
// @ts-ignore
import LogAdmin from "./pages/Administrador/LogAdmin";

function App() {
  // ELIMINAMOS el estado 'isAuthenticated' de aquí.
  // Ya no es necesario y es lo que causa la "race condition".
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Revisar token al cargar la app y setearlo en api
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      // Ya no necesitamos setIsAuthenticated(true);
      // @ts-ignore
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  // ====== DATA DE EJEMPLO (Se mantiene) ======
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

  // La función de Logout ahora debe vivir dentro de los componentes que la usan
  // (Ej: Perfil.jsx o AdminLayout.jsx) para simplificar App.jsx

  return (
    <Router>
      <Routes>
        {/* ===== Rutas públicas ===== */}
        <Route
          path="/"
          element={
            <Home
              productos={products}
              // onLogout lo quitamos de aquí
            />
          }
        />
        <Route
          path="/login"
          // Login.jsx ya no necesita 'setIsAuthenticated'
          element={<Login />}
        />

        {/* ===== Rutas protegidas de usuario (ahora son autónomas) ===== */}
        <Route
          path="/perfil"
          element={
            <ProtectedRoute redirectTo="/login">
              <Perfil /* onLogout={handleLogout} */ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/carrito"
          element={
            <ProtectedRoute redirectTo="/login">
              <Carrito productos={products} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pago"
          element={
            <ProtectedRoute redirectTo="/login">
              <Pago />
            </ProtectedRoute>
          }
        />

        {/* ===== Otras rutas ===== */}
        <Route
          path="/producto/:id"
          element={
            <DetalleProducto productos={products} />
          }
        />
        <Route path="/categoria/:nombreCategoria" element={<Categoria productos={products} />} />
        <Route path="/buscar" element={<Buscar />} />

        {/* ===== Panel Admin (RUTAS CORREGIDAS Y SIMPLIFICADAS) ===== */}
        <Route
          path="/login-admin"
          // LogAdmin ya no necesita 'onLogin'
          element={<LogAdmin />}
        />
        <Route
          path="/admin/*"
          element={
            // Esta ruta protegida ahora es autónoma y funciona al instante
            // Ya no necesita 'isAuthenticated'
            <ProtectedRoute
              requiredRole="ROLE_ADMIN"
              redirectTo="/login-admin"
            >
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Estas rutas anidadas están protegidas por el 'ProtectedRoute' del padre */}
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

