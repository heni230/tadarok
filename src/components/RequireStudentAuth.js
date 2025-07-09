import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function RequireStudentAuth({ children }) {
  const isAuthenticated = !!localStorage.getItem('studentPhone');
  const location = useLocation();

  return isAuthenticated
    ? children
    : <Navigate to="/student-login" state={{ from: location }} replace />;
}
