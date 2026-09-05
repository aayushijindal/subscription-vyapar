import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/authHelpers';

export const SuperAdminProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/super-admin/login" replace />;
  }
  
  return <Outlet />;
};
