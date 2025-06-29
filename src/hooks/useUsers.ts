
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
