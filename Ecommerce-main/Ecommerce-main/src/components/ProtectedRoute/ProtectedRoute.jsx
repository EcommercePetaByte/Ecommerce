import { Navigate } from "react-router-dom";

// ========= a futuro para entrar como administrador ==========

export default function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
