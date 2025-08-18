import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const useAuthGuard = (requiredRole?: string) => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/cliente/login');
        return;
      }

      if (requiredRole && profile?.role !== requiredRole) {
        // Redirect to appropriate dashboard based on role
        switch (profile?.role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'gestor':
            navigate('/gestor/dashboard');
            break;
          default:
            navigate('/cliente/dashboard');
            break;
        }
      }
    }
  }, [user, profile, isLoading, navigate, requiredRole]);

  return { user, profile, isLoading };
};