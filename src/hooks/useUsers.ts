
import { useState } from 'react';
import { User, UserRole, SportType } from '@/types';

const mockUsers: User[] = [
  {
    id: 'user_1',
    name: 'Maria Santos',
    email: 'maria@email.com',
    phone: '+55 85 88888-8888',
    role: UserRole.USER,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    isVerified: true,
    createdAt: new Date('2024-01-15T10:30:00'),
    lastLogin: new Date('2024-12-19T14:20:00'),
    preferences: {
      favoriteLocations: ['Fortaleza', 'Ceará'],
      preferredSports: [SportType.FOOTBALL, SportType.FUTSAL],
      maxDistance: 15,
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
      totalBookings: 24,
      completedGames: 22,
      cancelledGames: 2,
      averageRating: 4.8,
      totalSpent: 2880,
      favoriteCourtId: '1'
    }
  },
  {
    id: 'user_2',
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '+55 85 99999-9999',
    role: UserRole.USER,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    isVerified: false,
    createdAt: new Date('2024-11-20T08:15:00'),
    lastLogin: new Date('2024-12-20T09:30:00'),
    preferences: {
      favoriteLocations: ['Fortaleza'],
      preferredSports: [SportType.FOOTBALL],
      maxDistance: 10,
      notifications: {
        email: true,
        push: false,
        sms: true
      },
      privacy: {
        showProfile: true,
        allowReviews: true
      }
    },
    stats: {
      totalBookings: 3,
      completedGames: 2,
      cancelledGames: 1,
      averageRating: 4.0,
      totalSpent: 360,
      favoriteCourtId: '1'
    }
  },
  {
    id: 'user_3',
    name: 'Ana Paula',
    email: 'ana@email.com',
    phone: '+55 85 77777-7777',
    role: UserRole.USER,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    isVerified: true,
    createdAt: new Date('2024-03-10T14:45:00'),
    lastLogin: new Date('2024-12-21T16:30:00'),
    preferences: {
      favoriteLocations: ['Fortaleza', 'Ceará'],
      preferredSports: [SportType.VOLLEYBALL, SportType.BASKETBALL],
      maxDistance: 20,
      notifications: {
        email: true,
        push: true,
        sms: true
      },
      privacy: {
        showProfile: true,
        allowReviews: true
      }
    },
    stats: {
      totalBookings: 18,
      completedGames: 16,
      cancelledGames: 2,
      averageRating: 4.5,
      totalSpent: 1440,
      favoriteCourtId: '2'
    }
  },
  {
    id: 'user_4',
    name: 'Carlos Mendes',
    email: 'carlos@email.com',
    phone: '+55 85 66666-6666',
    role: UserRole.USER,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isVerified: true,
    createdAt: new Date('2024-02-25T09:20:00'),
    lastLogin: new Date('2024-12-20T18:45:00'),
    preferences: {
      favoriteLocations: ['Fortaleza'],
      preferredSports: [SportType.FOOTBALL],
      maxDistance: 12,
      notifications: {
        email: false,
        push: true,
        sms: false
      },
      privacy: {
        showProfile: true,
        allowReviews: true
      }
    },
    stats: {
      totalBookings: 31,
      completedGames: 29,
      cancelledGames: 2,
      averageRating: 4.9,
      totalSpent: 3720,
      favoriteCourtId: '1'
    }
  },
  {
    id: 'user_5',
    name: 'Fernanda Lima',
    email: 'fernanda@email.com',
    phone: '+55 85 55555-5555',
    role: UserRole.USER,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    isVerified: false,
    createdAt: new Date('2024-12-01T11:30:00'),
    lastLogin: new Date('2024-12-21T10:15:00'),
    preferences: {
      favoriteLocations: ['Fortaleza'],
      preferredSports: [SportType.TENNIS],
      maxDistance: 8,
      notifications: {
        email: true,
        push: false,
        sms: false
      },
      privacy: {
        showProfile: false,
        allowReviews: true
      }
    },
    stats: {
      totalBookings: 1,
      completedGames: 1,
      cancelledGames: 0,
      averageRating: 5.0,
      totalSpent: 120,
      favoriteCourtId: '3'
    }
  }
];

export const useUsers = () => {
  const [users] = useState<User[]>(mockUsers);

  const getUserById = (userId: string): User | undefined => {
    return users.find(user => user.id === userId);
  };

  const getCurrentUser = () => {
    // Simular usuário logado - em um sistema real, viria do contexto de autenticação
    return getUserById('user_1');
  };

  const getUserStats = (userId: string) => {
    const user = getUserById(userId);
    return user?.stats;
  };

  const getUserPreferences = (userId: string) => {
    const user = getUserById(userId);
    return user?.preferences;
  };

  const getClientBookingHistory = (userId: string) => {
    const user = getUserById(userId);
    if (!user?.stats) return null;

    return {
      completionRate: ((user.stats.completedGames / user.stats.totalBookings) * 100).toFixed(1),
      cancellationRate: ((user.stats.cancelledGames / user.stats.totalBookings) * 100).toFixed(1),
      averageMonthlySpent: (user.stats.totalSpent / 12).toFixed(0),
      memberSince: user.createdAt
    };
  };

  return {
    users,
    getUserById,
    getCurrentUser,
    getUserStats,
    getUserPreferences,
    getClientBookingHistory
  };
};
