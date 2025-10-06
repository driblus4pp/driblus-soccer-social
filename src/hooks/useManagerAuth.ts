import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ManagerCredentials {
  email: string;
  password: string;
}

export const useManagerAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateManagerLogin = async (credentials: ManagerCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      // Use Supabase authentication instead of hardcoded credentials
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (authError) {
        setError('Email ou senha incorretos');
        return null;
      }

      // Check if user has manager role
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profile?.role !== 'gestor') {
          setError('Acesso não autorizado para gestores');
          await supabase.auth.signOut();
          return null;
        }

        return data.user;
      }

      return null;
    } catch (err) {
      setError('Erro ao realizar login. Tente novamente.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    validateManagerLogin,
    isLoading,
    error,
    clearError
  };
};