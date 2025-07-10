

import { useState } from 'react';
import { User, UserRole } from '@/types';
import { useCourts } from './useCourts';

interface Manager extends User {
  managedCourts: string[];
  totalRevenue: number;
  monthlyBookings: number;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  suspensionReason?: string;
  lastActivity?: Date;
  totalComplaints: number;
  whatsapp?: string;
  contactEmail?: string;
  businessHours?: string;
}

const mockManagers: Manager[] = [
  {
    id: 'manager-alvo',
    name: 'No Alvo Society',
    email: 'gestor.alvo@driblus.com',
    phone: '+55 85 99999-9999',
    whatsapp: '+55 85 99999-9999',
    contactEmail: 'gestor.alvo@driblus.com',
    businessHours: '06:00 - 23:00',
    role: UserRole.COURT_MANAGER,
    isVerified: true,
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date('2024-12-20'),
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
    managedCourts: ['alvo-centro-1', 'alvo-centro-2', 'alvo-sul-1', 'alvo-sul-2', 'alvo-norte-1', 'alvo-norte-2'],
    totalRevenue: 45780,
    monthlyBookings: 234,
    status: 'active',
    lastActivity: new Date('2024-12-20'),
    totalComplaints: 0
  },
  {
    id: 'manager-arena',
    name: 'Arena Cangaço',
    email: 'gestor.arena@driblus.com',
    phone: '+55 85 88888-8888',
    whatsapp: '+55 85 88888-8888',
    contactEmail: 'gestor.arena@driblus.com',
    businessHours: '07:00 - 22:00',
    role: UserRole.COURT_MANAGER,
    isVerified: true,
    createdAt: new Date('2024-02-10'),
    lastLogin: new Date('2024-12-20'),
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face',
    managedCourts: ['arena-futebol', 'arena-volei', 'arena-tennis'],
    totalRevenue: 32150,
    monthlyBookings: 156,
    status: 'active',
    lastActivity: new Date('2024-12-20'),
    totalComplaints: 0
  }
];

export const useManagers = () => {
  const [managers, setManagers] = useState<Manager[]>(mockManagers);
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
      averageRating: managedCourts.reduce((acc, court) => acc + court.rating, 0) / managedCourts.length || 0,
      totalComplaints: manager.totalComplaints,
      lastActivity: manager.lastActivity
    };
  };

  const getAllManagersStats = () => {
    return {
      totalManagers: managers.length,
      verifiedManagers: managers.filter(m => m.isVerified).length,
      activeManagers: managers.filter(m => m.status === 'active').length,
      totalRevenue: managers.reduce((acc, m) => acc + m.totalRevenue, 0),
      totalBookings: managers.reduce((acc, m) => acc + m.monthlyBookings, 0)
    };
  };

  const activateManager = async (managerId: string) => {
    setManagers(prev =>
      prev.map(manager =>
        manager.id === managerId
          ? { ...manager, status: 'active' as const, suspensionReason: undefined }
          : manager
      )
    );
  };

  const deactivateManager = async (managerId: string) => {
    setManagers(prev =>
      prev.map(manager =>
        manager.id === managerId
          ? { ...manager, status: 'inactive' as const }
          : manager
      )
    );
  };

  const suspendManager = async (managerId: string, reason: string) => {
    setManagers(prev =>
      prev.map(manager =>
        manager.id === managerId
          ? { ...manager, status: 'suspended' as const, suspensionReason: reason }
          : manager
      )
    );
  };

  const removeManager = async (managerId: string) => {
    setManagers(prev =>
      prev.filter(manager => manager.id !== managerId)
    );
  };

  const approveManager = async (managerId: string) => {
    setManagers(prev =>
      prev.map(manager =>
        manager.id === managerId
          ? { ...manager, isVerified: true }
          : manager
      )
    );
  };

  const rejectManager = async (managerId: string, reason: string) => {
    setManagers(prev =>
      prev.filter(manager => manager.id !== managerId)
    );
  };

  const getManagerActivity = (managerId: string) => {
    // Mock activity data
    return [
      { date: new Date('2024-12-20'), action: 'Login realizado', type: 'login' },
      { date: new Date('2024-12-19'), action: 'Quadra atualizada', type: 'court_update' },
      { date: new Date('2024-12-18'), action: 'Agendamento confirmado', type: 'booking' },
    ];
  };

  const getManagerFeedback = (managerId: string) => {
    // Mock feedback data
    return [
      { id: '1', rating: 5, comment: 'Excelente atendimento!', date: new Date('2024-12-15') },
      { id: '2', rating: 4, comment: 'Muito bom, recomendo.', date: new Date('2024-12-10') },
    ];
  };

  return {
    managers,
    getManagerById,
    getManagerCourts,
    getManagerStats,
    getAllManagersStats,
    activateManager,
    deactivateManager,
    suspendManager,
    removeManager,
    approveManager,
    rejectManager,
    getManagerActivity,
    getManagerFeedback
  };
};
