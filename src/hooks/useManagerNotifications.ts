
import { useState } from 'react';
import { Notification } from '@/types';

interface ManagerNotification extends Notification {
  courtId?: string;
  courtName?: string;
  actionRequired?: boolean;
}

const mockManagerNotifications: ManagerNotification[] = [
  {
    id: 'notif-mgr-1',
    type: 'booking_confirmed',
    title: 'Novo Agendamento Confirmado',
    message: 'Quadra Arena Central foi reservada para hoje às 19:00',
    courtId: '1',
    courtName: 'Arena Central',
    bookingId: 'booking-123',
    timestamp: new Date('2024-12-27T15:30:00'),
    read: false,
    userId: 'manager-1',
    actionRequired: false
  },
  {
    id: 'notif-mgr-2',
    type: 'booking_pending',
    title: 'Agendamento Aguardando Confirmação',
    message: 'Nova solicitação de reserva para Quadra do Bairro',
    courtId: '2',
    courtName: 'Quadra do Bairro',
    bookingId: 'booking-124',
    timestamp: new Date('2024-12-27T14:15:00'),
    read: false,
    userId: 'manager-1',
    actionRequired: true
  },
  {
    id: 'notif-mgr-3',
    type: 'system_alert',
    title: 'Quadra Aprovada',
    message: 'Sua quadra Arena Central foi aprovada e está ativa na plataforma',
    courtId: '1',
    courtName: 'Arena Central',
    timestamp: new Date('2024-12-27T10:00:00'),
    read: true,
    userId: 'manager-1',
    actionRequired: false
  },
  {
    id: 'notif-mgr-4',
    type: 'booking_cancelled',
    title: 'Agendamento Cancelado',
    message: 'Cliente cancelou reserva da Quadra do Bairro para amanhã',
    courtId: '2',
    courtName: 'Quadra do Bairro',
    bookingId: 'booking-125',
    timestamp: new Date('2024-12-27T09:30:00'),
    read: false,
    userId: 'manager-1',
    actionRequired: false
  }
];

export const useManagerNotifications = (managerId: string = 'manager-1') => {
  const [notifications, setNotifications] = useState<ManagerNotification[]>(
    mockManagerNotifications.filter(n => n.userId === managerId)
  );

  const unreadCount = notifications.filter(n => !n.read).length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired && !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const getNotificationsByType = (type: ManagerNotification['type']) => {
    return notifications.filter(n => n.type === type);
  };

  const getNotificationsByCourt = (courtId: string) => {
    return notifications.filter(n => n.courtId === courtId);
  };

  const addNotification = (notification: Omit<ManagerNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: ManagerNotification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  return {
    notifications,
    unreadCount,
    actionRequiredCount,
    markAsRead,
    markAllAsRead,
    getNotificationsByType,
    getNotificationsByCourt,
    addNotification
  };
};
