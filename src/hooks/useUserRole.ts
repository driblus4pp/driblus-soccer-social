import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'gestor' | 'cliente';

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setRole(null);
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user role:', error);
          setRole(null);
        } else {
          setRole(data?.role as UserRole || null);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  const hasRole = (requiredRole: UserRole): boolean => {
    return role === requiredRole;
  };

  return { role, isLoading, hasRole };
};
