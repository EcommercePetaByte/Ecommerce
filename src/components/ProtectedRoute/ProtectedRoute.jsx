import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function ProtectedRoute({ children, requiredRole, redirectTo = '/login' }) {
  const token = localStorage.getItem('jwtToken');

  if (!token) {
    return <Navigate to={redirectTo} replace />;
  }

  try {
    const user = jwtDecode(token);

    if (requiredRole) {
      // @ts-ignore
      const hasPermission = user.roles?.includes(requiredRole);
      
      if (!hasPermission) {
        return <Navigate to={redirectTo} replace />;
      }
    }

    return children;

  } catch (error) {
    console.error("Token inválido o expirado:", error);
    localStorage.removeItem('jwtToken');
    return <Navigate to={redirectTo} replace />;
  }
}