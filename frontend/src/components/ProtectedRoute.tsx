import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  isAdmin?: boolean;
  requiredAdmin?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  isAdmin = false,
  requiredAdmin = false,
  redirectTo = '/login',
}) => {
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
