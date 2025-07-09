
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, PlatformStats, SportType } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  connectGoogleCalendar: () => Promise<boolean>;
  updateUserProfile: (data: Partial<User>) => Promise<boolean>;
  getPlatformStats: () => Promise<PlatformStats>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext - Initializing...');
    // Check for stored user session
    const storedUser = localStorage.getItem('driblus_user');
    console.log('AuthContext - Stored user raw:', storedUser);
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('AuthContext - Parsed stored user:', parsedUser);
        console.log('AuthContext - Stored user role:', parsedUser.role);
        setUser(parsedUser);
      } catch (error) {
        console.error('AuthContext - Error parsing stored user, clearing localStorage:', error);
        localStorage.removeItem('driblus_user');
      }
    }
    setIsLoading(false);

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
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('AuthContext - Starting login for:', email);
    setIsLoading(true);
    
    try {
      // CRITICAL: Clear any existing user data first
      console.log('AuthContext - Clearing existing user data');
      localStorage.removeItem('driblus_user');
      setUser(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data based on email for different roles
      let mockUser: User;
      
      if (email === 'admin@driblus.com') {
        console.log('AuthContext - Creating ADMIN user');
        mockUser = {
          id: 'admin-1',
          name: 'Administrador Driblus',
          email,
          role: UserRole.ADMIN,
          isVerified: true,
          createdAt: new Date('2024-01-01'),
          lastLogin: new Date(),
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
          googleCalendarConnected: false
        };
        console.log('AuthContext - Admin user created with role:', mockUser.role);
        console.log('AuthContext - UserRole.ADMIN constant:', UserRole.ADMIN);
      } else if (email === 'gestor@test.com') {
        mockUser = {
          id: 'manager-1',
          name: 'João Silva',
          email,
          phone: '+55 85 99999-9999',
          role: UserRole.COURT_MANAGER,
          isVerified: true,
          createdAt: new Date('2024-02-01'),
          lastLogin: new Date(),
          avatar: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=80&h=80&fit=crop&crop=face',
          googleCalendarConnected: false,
          stats: {
            totalBookings: 87,
            completedGames: 82,
            cancelledGames: 5,
            averageRating: 4.8,
            totalSpent: 15420,
          }
        };
      } else {
        mockUser = {
          id: 'user-1',
          name: 'Maria Santos',
          email,
          phone: '+55 85 88888-8888',
          role: UserRole.USER,
          isVerified: true,
          createdAt: new Date('2024-03-01'),
          lastLogin: new Date(),
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b436?w=80&h=80&fit=crop&crop=face',
          googleCalendarConnected: false,
          preferences: {
            favoriteLocations: ['Fortaleza, CE'],
            preferredSports: [SportType.FOOTBALL, SportType.FUTSAL],
            maxDistance: 10,
            notifications: {
              email: true,
              push: true,
              sms: false
            },
            privacy: {
              showProfile: true,
              allowReviews: true
            }
          },
          stats: {
            totalBookings: 15,
            completedGames: 12,
            cancelledGames: 3,
            averageRating: 4.5,
            totalSpent: 1800,
            favoriteCourtId: 'court-1'
          }
        };
      }

      console.log('AuthContext - Setting user state:', mockUser);
      console.log('AuthContext - User role being set:', mockUser.role);
      
      setUser(mockUser);
      
      // Save to localStorage
      const userToStore = JSON.stringify(mockUser);
      console.log('AuthContext - Storing user in localStorage:', userToStore);
      localStorage.setItem('driblus_user', userToStore);
      
      // Verify storage
      const verifyStored = localStorage.getItem('driblus_user');
      console.log('AuthContext - Verification - stored user:', verifyStored);
      
      console.log('AuthContext - Login successful for role:', mockUser.role);
      return true;
    } catch (error) {
      console.error('AuthContext - Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        isVerified: false,
        createdAt: new Date(),
        googleCalendarConnected: false,
        preferences: {
          favoriteLocations: [],
          preferredSports: [],
          maxDistance: 5,
          notifications: {
            email: true,
            push: true,
            sms: false
          },
          privacy: {
            showProfile: true,
            allowReviews: true
          }
        },
        stats: {
          totalBookings: 0,
          completedGames: 0,
          cancelledGames: 0,
          averageRating: 0,
          totalSpent: 0
        }
      };

      setUser(newUser);
      localStorage.setItem('driblus_user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('AuthContext - Logging out, clearing all data');
    setUser(null);
    localStorage.removeItem('driblus_user');
  };

  const connectGoogleCalendar = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate Google OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (user) {
        const updatedUser = { ...user, googleCalendarConnected: true };
        setUser(updatedUser);
        localStorage.setItem('driblus_user', JSON.stringify(updatedUser));
      }
      return true;
    } catch (error) {
      console.error('Google Calendar connection error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (data: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (user) {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('driblus_user', JSON.stringify(updatedUser));
      }
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getPlatformStats = async (): Promise<PlatformStats> => {
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

  // Debug current state
  console.log('AuthContext - Current user state:', user);
  console.log('AuthContext - Current user role:', user?.role);
  console.log('AuthContext - Is loading:', isLoading);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isLoading,
      connectGoogleCalendar,
      updateUserProfile,
      getPlatformStats
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export { UserRole };
export type { User };
