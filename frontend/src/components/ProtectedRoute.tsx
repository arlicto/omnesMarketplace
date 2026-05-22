import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  requiredAdmin?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredAdmin = false,
  redirectTo = '/login',
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = user?.roles?.some(r => ['admin', 'super_admin'].includes(r));

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
