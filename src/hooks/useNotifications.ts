
import { useState, useEffect, useRef } from 'react';
import { Notification } from '@/types';
import { useBookings } from './useBookings';
import { useAuth } from '@/contexts/AuthContext';
import { BookingStatus } from '@/types';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());
  const { bookings } = useBookings();
  const { user } = useAuth();
  const processedBookingsRef = useRef<Set<string>>(new Set());

  // Gerar notificações baseadas nos agendamentos do usuário logado
  useEffect(() => {
    if (!user) return;
    
    const currentUserId = user.id || 'user-1'; // Fallback para user-1 como no booking
    const userBookings = bookings.filter(booking => 
      booking.userId === currentUserId || booking.userId === 'user-1'
    );
    
    const bookingNotifications: Notification[] = [];

    userBookings.forEach(booking => {
      const bookingKey = `${booking.id}_${booking.status}`;
      
      // Só processar se não foi processado antes
      if (!processedBookingsRef.current.has(bookingKey)) {
        processedBookingsRef.current.add(bookingKey);
        
        // Notificação de agendamento confirmado
        if (booking.status === BookingStatus.CONFIRMED) {
          const notifId = `notif_confirmed_${booking.id}`;
          bookingNotifications.push({
            id: notifId,
            type: 'booking_confirmed',
            title: 'Agendamento Confirmado',
            message: `Sua reserva na ${booking.courtName} foi confirmada para ${booking.date} às ${booking.startTime}`,
            bookingId: booking.id,
            timestamp: new Date(booking.createdAt.getTime() + 60000),
            read: readNotifications.has(notifId),
            userId: currentUserId
          });
        }

        // Notificação de agendamento cancelado
        if (booking.status === BookingStatus.CANCELLED_BY_MANAGER) {
          const notifId = `notif_cancelled_${booking.id}`;
          bookingNotifications.push({
            id: notifId,
            type: 'booking_cancelled',
            title: 'Agendamento Cancelado',
            message: `Sua reserva na ${booking.courtName} foi cancelada pelo proprietário${booking.cancellationReason ? ': ' + booking.cancellationReason : ''}`,
            bookingId: booking.id,
            timestamp: new Date(booking.createdAt.getTime() + 120000),
            read: readNotifications.has(notifId),
            userId: currentUserId
          });
        }
      }
    });

    // Manter notificações existentes que já foram lidas
    const existingReadNotifications = notifications.filter(n => n.read);
    const allNotifications = [...existingReadNotifications, ...bookingNotifications];
    
    // Remover duplicatas
    const uniqueNotifications = allNotifications.filter((notification, index, self) =>
      index === self.findIndex(n => n.id === notification.id)
    );

    // Ordenar por timestamp mais recente primeiro
    uniqueNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    if (uniqueNotifications.length !== notifications.length || 
        uniqueNotifications.some((n, i) => notifications[i]?.id !== n.id)) {
      setNotifications(uniqueNotifications);
    }
  }, [bookings, user, readNotifications]);

  const markAsRead = (notificationId: string) => {
    setReadNotifications(prev => new Set([...prev, notificationId]));
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadNotifications(prev => new Set([...prev, ...allIds]));
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
