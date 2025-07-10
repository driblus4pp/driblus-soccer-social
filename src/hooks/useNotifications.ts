
import { useState, useEffect } from 'react';
import { Notification } from '@/types';

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'booking_confirmed',
    title: 'Agendamento Confirmado',
    message: 'Sua reserva na No Alvo Society foi confirmada para 20/12 às 19:00',
    bookingId: 'booking_1',
    timestamp: new Date('2024-12-19T10:30:00'),
    read: false,
    userId: 'user_1'
  },
  {
    id: '2',
    type: 'booking_cancelled',
    title: 'Agendamento Cancelado',
    message: 'Sua reserva na Arena Pro Sports foi cancelada pelo proprietário',
    bookingId: 'booking_2',
    timestamp: new Date('2024-12-18T15:45:00'),
    read: false,
    userId: 'user_1'
  },
  {
    id: '3',
    type: 'booking_reminder',
    title: 'Lembrete de Agendamento',
    message: 'Sua partida na Gol de Placa é amanhã às 18:00',
    bookingId: 'booking_3',
    timestamp: new Date('2024-12-17T09:00:00'),
    read: true,
    userId: 'user_1'
  }
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification
  };
};
