import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ role }) {
  const { isAuthenticated, role: userRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (role && userRole !== role) {
    return <Navigate to={userRole === 'ADMIN' ? '/admin/dashboard' : '/patient/dashboard'} replace />;
  }
  return <Outlet />;
}