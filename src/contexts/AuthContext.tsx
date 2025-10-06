
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

interface Profile {
  id: string;
  nome: string;
  telefone?: string;
  role: 'admin' | 'gestor' | 'cliente';
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: SupabaseUser | null;
  profile: Profile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  updateUserProfile: (data: Partial<Profile>) => Promise<boolean>;
  getPlatformStats: () => Promise<any>;
  connectGoogleCalendar: () => Promise<boolean>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return null;
      }

      // If no profile exists, create one
      if (!profileData) {
        console.log('No profile found, creating one...');
        return await createProfileFromUserData(userId);
      }

      // Fetch user role from user_roles table
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      // Combine profile and role data
      return {
        ...profileData,
        role: roleData?.role || profileData.role || 'cliente'
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  const createProfileFromUserData = async (userId: string) => {
    try {
      // Get user data from auth
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) return null;

      const profileData = {
        id: userId,
        nome: user.user_metadata?.nome || user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
        telefone: user.user_metadata?.telefone || null,
        role: 'cliente' as const,
        cidade: null,
        bairro: null,
        foto_perfil: null,
        preferencias_esportivas: []
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        return null;
      }

      console.log('Profile created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating profile from user data:', error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetch to avoid deadlock
          setTimeout(async () => {
            const profileData = await fetchProfile(session.user.id);
            setProfile(profileData);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id).then(setProfile);
      }
      setIsLoading(false);
    });

    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        const profileData = await fetchProfile(data.user.id);
        setProfile(profileData);
        
        toast({
          title: "Login realizado",
          description: "Bem-vindo de volta!",
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erro no login",
        description: "Erro interno. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            nome: userData.name,
            telefone: userData.phone,
          }
        }
      });

      if (error) {
        console.error('Register error:', error);
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        toast({
          title: "Cadastro realizado",
          description: "Confirme seu email para ativar a conta.",
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Register error:', error);
      toast({
        title: "Erro no cadastro",
        description: "Erro interno. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUserProfile = async (data: Partial<Profile>): Promise<boolean> => {
    if (!user || !profile) return false;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) {
        console.error('Profile update error:', error);
        toast({
          title: "Erro ao atualizar",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      // Update local profile state
      const updatedProfile = { ...profile, ...data };
      setProfile(updatedProfile);
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };

  const getPlatformStats = async () => {
    // Mock platform statistics for admin dashboard
    return {
      totalUsers: 1247,
      totalCourts: 89,
      totalBookings: 3421,
      monthlyRevenue: 245600,
      activeUsers: 892,
      pendingApprovals: 12,
      averageRating: 4.6,
      growthRate: 23.5
    };
  };

  const connectGoogleCalendar = async (): Promise<boolean> => {
    try {
      // Mock Google Calendar connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Google Calendar conectado",
        description: "Sua agenda foi sincronizada com sucesso.",
      });
      return true;
    } catch (error) {
      console.error('Google Calendar connection error:', error);
      return false;
    }
  };
  // Debug current state
  console.log('AuthContext - Current user:', user);
  console.log('AuthContext - Current profile:', profile);
  console.log('AuthContext - Is loading:', isLoading);

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      login,
      register,
      logout,
      isLoading,
      updateUserProfile,
      getPlatformStats,
      connectGoogleCalendar,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export type { Profile };
