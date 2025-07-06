
import { useState, useEffect } from 'react';
import { useManagers } from './useManagers';
import { useCourts } from './useCourts';

interface AdminNotification {
  id: string;
  type: 'manager_approval' | 'court_approval' | 'user_complaint';
  title: string;
  message: string;
  count: number;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
}

interface PendingApproval {
  id: string;
  type: 'manager' | 'court';
  name: string;
  email?: string;
  owner?: string;
  location?: string;
  date: string;
  status: 'pending';
}

export const useAdminNotifications = () => {
  const { managers } = useManagers();
  const { courts } = useCourts();
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);

  const getPendingApprovals = (): PendingApproval[] => {
    const pendingManagers: PendingApproval[] = managers
      .filter(manager => !manager.isVerified)
      .map(manager => ({
        id: manager.id,
        type: 'manager' as const,
        name: manager.name,
        email: manager.email,
        date: manager.createdAt.toISOString().split('T')[0],
        status: 'pending' as const
      }));

    const pendingCourts: PendingApproval[] = courts
      .filter(court => court.status === 'pending')
      .map(court => ({
        id: court.id,
        type: 'court' as const,
        name: court.name,
        owner: court.managerId,
        location: `${court.location.city}, ${court.location.state}`,
        date: court.createdAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        status: 'pending' as const
      }));

    return [...pendingManagers, ...pendingCourts];
  };

  const getPendingApprovalsCount = () => {
    return getPendingApprovals().length;
  };

  const generateNotifications = () => {
    const pendingCount = getPendingApprovalsCount();
    const newNotifications: AdminNotification[] = [];

    if (pendingCount > 0) {
      newNotifications.push({
        id: 'pending-approvals',
        type: 'manager_approval',
        title: 'Aprovações Pendentes',
        message: `${pendingCount} ${pendingCount === 1 ? 'aprovação pendente' : 'aprovações pendentes'}`,
        count: pendingCount,
        priority: pendingCount > 5 ? 'high' : 'medium',
        timestamp: new Date()
      });
    }

    setNotifications(newNotifications);
  };

  useEffect(() => {
    generateNotifications();
  }, [managers, courts]);

  return {
    notifications,
    pendingApprovals: getPendingApprovals(),
    pendingApprovalsCount: getPendingApprovalsCount(),
    refreshNotifications: generateNotifications
  };
};
