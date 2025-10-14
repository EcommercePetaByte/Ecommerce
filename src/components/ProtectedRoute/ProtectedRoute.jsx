import { Navigate } from "react-router-dom";

// ProtectedRoute para admin
export default function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login-admin" replace />; // ruta del login admin
  }
  return children;
}
