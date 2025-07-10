import { useState } from 'react';
import { User, UserRole } from '@/types';
import { useManagers } from './useManagers';

interface ManagerCredentials {
  email: string;
  password: string;
}

export const useManagerAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getManagerById } = useManagers();

  const validateManagerLogin = async (credentials: ManagerCredentials): Promise<User | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if credentials match our manager accounts
      if (credentials.email === 'gestor.alvo@driblus.com' && credentials.password === 'dida') {
        const manager = getManagerById('manager-alvo');
        if (manager) {
          return {
            ...manager,
            role: UserRole.COURT_MANAGER
          };
        }
      }

      if (credentials.email === 'gestor.arena@driblus.com' && credentials.password === 'dida') {
        const manager = getManagerById('manager-arena');
        if (manager) {
          return {
            ...manager,
            role: UserRole.COURT_MANAGER
          };
        }
      }

      // Invalid credentials
      setError('Email ou senha incorretos');
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