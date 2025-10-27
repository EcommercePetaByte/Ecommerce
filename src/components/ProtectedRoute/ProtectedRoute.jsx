import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ isAuthenticated, requiredRole, children }) {
  // 1. Lee los roles guardados en el login
  const userRoles = JSON.parse(localStorage.getItem("userRoles")) || [];

  // 2. Si no está logueado, lo manda al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Si la ruta requiere un rol específico (ej. "ROLE_ADMIN")...
  //    y el usuario no lo tiene en su lista de roles...
  if (requiredRole && !userRoles.includes(requiredRole)) {
    // ...lo manda al inicio (o a una página de "Acceso Denegado")
    return <Navigate to="/" replace />;
  }

  // 4. Si pasó las dos verificaciones, le permite ver el contenido.
  return children;
}