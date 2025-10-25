import { Navigate } from "react-router-dom";

// ProtectedRoute para admin o usuario
export default function ProtectedRoute({ isAuthenticated, children, admin = false }) {
  if (!isAuthenticated) {
    return <Navigate to={admin ? "/login-admin" : "/login"} replace />;
  }
  return children;
}
