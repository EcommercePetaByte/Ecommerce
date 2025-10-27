import { useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "./theme.css";
import api from "./api";

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
  // 1. AÑADIMOS EL ESTADO CENTRALIZADO
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 2. MANTENEMOS TU LÓGICA PARA REVISAR EL TOKEN AL INICIO
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      // Si hay token, actualizamos el estado central
      setIsAuthenticated(true); 
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  // ====== DATA DE EJEMPLO (Se mantiene tu lógica) ======
  const BASE = [
    { name: "Mouse gamer", price: 24999, img: "https://redragon.es/content/uploads/2021/04/griffin-black-2.jpg", categoria: "perifericos" },
    { name: "Barra de sonido", price: 89999, img: "https://redragon.es/content/uploads/2022/04/5-ESTILO-Y-ROBUSTEZ.jpg", categoria: "audio" },
  ];
  const products = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => {
      const b = BASE[i % BASE.length];
      return { id: i + 1, name: `${b.name} ${i + 1}`, price: b.price + (i % 5) * 1000, img: b.img, categoria: b.categoria };
    });
  }, []);

  return (
    <Router>
      <Routes>
        {/* ===== Rutas públicas y semi-públicas ===== */}
        {/* ▼▼▼ PASAMOS EL ESTADO A LAS PÁGINAS QUE LO NECESITAN ▼▼▼ */}
        <Route path="/" element={<Home isAuthenticated={isAuthenticated} productos={products} />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/producto/:id" element={<DetalleProducto isAuthenticated={isAuthenticated} productos={products} />} />
        <Route path="/categoria/:nombreCategoria" element={<Categoria isAuthenticated={isAuthenticated} productos={products} />} />
        <Route path="/buscar" element={<Buscar />} />

        {/* ===== Rutas protegidas (tu lógica se mantiene) ===== */}
        <Route path="/perfil" element={<ProtectedRoute redirectTo="/login"><Perfil /></ProtectedRoute>} />
        <Route path="/carrito" element={<ProtectedRoute redirectTo="/login"><Carrito /></ProtectedRoute>} />
        <Route path="/pago" element={<ProtectedRoute redirectTo="/login"><Pago /></ProtectedRoute>} />

        {/* ===== Panel Admin (tu lógica se mantiene) ===== */}
        <Route path="/login-admin" element={<LogAdmin />} />
        <Route path="/admin/*" element={
            <ProtectedRoute requiredRole="ROLE_ADMIN" redirectTo="/login-admin">
              <AdminLayout />
            </ProtectedRoute>
          }>
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