import React from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import LoadingScreen from './LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, profile, isLoading } = useAuthGuard(requiredRole);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return null; // useAuthGuard will handle redirect
  }

  if (requiredRole && profile?.role !== requiredRole) {
    return null; // useAuthGuard will handle redirect
  }

  return <>{children}</>;
};

export default ProtectedRoute;