
import { useState } from 'react';
import { User, UserRole } from '@/types';
import { useCourts } from './useCourts';

interface Manager extends User {
  managedCourts: string[];
  totalRevenue: number;
  monthlyBookings: number;
}

const mockManagers: Manager[] = [
  {
    id: 'manager-1',
    name: 'João Silva',
    email: 'joao@gestor.com',
    phone: '+55 85 99999-9999',
    role: UserRole.COURT_MANAGER,
    isVerified: true,
    createdAt: new Date('2024-02-01'),
    lastLogin: new Date('2024-12-20'),
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
    managedCourts: ['1', '2'],
    totalRevenue: 15420,
    monthlyBookings: 87
  },
  {
    id: 'manager-2',
    name: 'Maria Santos',
    email: 'maria@gestor.com',
    phone: '+55 85 88888-8888',
    role: UserRole.COURT_MANAGER,
    isVerified: true,
    createdAt: new Date('2024-03-15'),
    lastLogin: new Date('2024-12-19'),
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face',
    managedCourts: ['2'],
    totalRevenue: 8650,
    monthlyBookings: 45
  },
  {
    id: 'manager-3',
    name: 'Carlos Oliveira',
    email: 'carlos@gestor.com',
    phone: '+55 85 77777-7777',
    role: UserRole.COURT_MANAGER,
    isVerified: false,
    createdAt: new Date('2024-06-10'),
    lastLogin: new Date('2024-12-18'),
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    managedCourts: ['3'],
    totalRevenue: 12300,
    monthlyBookings: 38
  },
  {
    id: 'manager-4',
    name: 'Ana Costa',
    email: 'ana@gestor.com',
    phone: '+55 85 66666-6666',
    role: UserRole.COURT_MANAGER,
    isVerified: false,
    createdAt: new Date('2024-06-15'),
    lastLogin: new Date('2024-12-17'),
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    managedCourts: ['4'],
    totalRevenue: 5200,
    monthlyBookings: 25
  }
];

export const useManagers = () => {
  const [managers] = useState<Manager[]>(mockManagers);
  const { courts } = useCourts();

  const getManagerById = (managerId: string) => {
    return managers.find(manager => manager.id === managerId);
  };

  const getManagerCourts = (managerId: string) => {
    const manager = getManagerById(managerId);
    if (!manager) return [];
    
    return courts.filter(court => manager.managedCourts.includes(court.id));
  };

  const getManagerStats = (managerId: string) => {
    const manager = getManagerById(managerId);
    if (!manager) return null;

    const managedCourts = getManagerCourts(managerId);
    
    return {
      totalCourts: managedCourts.length,
      activeCourts: managedCourts.filter(court => court.status === 'active').length,
      pendingCourts: managedCourts.filter(court => court.status === 'pending_approval').length,
      totalRevenue: manager.totalRevenue,
      monthlyBookings: manager.monthlyBookings,
      averageRating: managedCourts.reduce((acc, court) => acc + court.rating, 0) / managedCourts.length || 0
    };
  };

  const getAllManagersStats = () => {
    return {
      totalManagers: managers.length,
      verifiedManagers: managers.filter(m => m.isVerified).length,
      totalRevenue: managers.reduce((acc, m) => acc + m.totalRevenue, 0),
      totalBookings: managers.reduce((acc, m) => acc + m.monthlyBookings, 0)
    };
  };

  return {
    managers,
    getManagerById,
    getManagerCourts,
    getManagerStats,
    getAllManagersStats
  };
};
