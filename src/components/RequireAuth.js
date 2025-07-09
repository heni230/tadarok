import { Navigate, useLocation } from 'react-router-dom';

export default function RequireAuth({ children }) {
  const isAuthenticated = localStorage.getItem('isTeacher') === 'true';
  const location = useLocation();

  if (isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/teacher-dashboard" replace />;
  }

  return isAuthenticated || location.pathname === '/login'
    ? children
    : <Navigate to="/login" replace />;
}
