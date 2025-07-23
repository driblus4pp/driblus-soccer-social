
import { useState, useEffect } from 'react';
import { Notification } from '@/types';
import { useBookings } from './useBookings';
import { BookingStatus } from '@/types';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { bookings } = useBookings();

  // Gerar notificações baseadas nos agendamentos do usuário logado
  useEffect(() => {
    const currentUserId = 'user_1'; // Em produção, pegar do contexto de auth
    const userBookings = bookings.filter(booking => booking.userId === currentUserId);
    
    const bookingNotifications: Notification[] = [];

    userBookings.forEach(booking => {
      // Notificação de agendamento confirmado
      if (booking.status === BookingStatus.CONFIRMED) {
        bookingNotifications.push({
          id: `notif_confirmed_${booking.id}`,
          type: 'booking_confirmed',
          title: 'Agendamento Confirmado',
          message: `Sua reserva na ${booking.courtName} foi confirmada para ${booking.date} às ${booking.startTime}`,
          bookingId: booking.id,
          timestamp: new Date(booking.createdAt.getTime() + 60000), // 1 minuto após criação
          read: false,
          userId: currentUserId
        });
      }

      // Notificação de agendamento cancelado
      if (booking.status === BookingStatus.CANCELLED_BY_MANAGER) {
        bookingNotifications.push({
          id: `notif_cancelled_${booking.id}`,
          type: 'booking_cancelled',
          title: 'Agendamento Cancelado',
          message: `Sua reserva na ${booking.courtName} foi cancelada pelo proprietário${booking.cancellationReason ? ': ' + booking.cancellationReason : ''}`,
          bookingId: booking.id,
          timestamp: new Date(booking.createdAt.getTime() + 120000), // 2 minutos após criação
          read: false,
          userId: currentUserId
        });
      }

      // Notificação de lembrete para agendamentos confirmados próximos
      if (booking.status === BookingStatus.CONFIRMED) {
        const bookingDate = new Date(`${booking.date}T${booking.startTime}`);
        const now = new Date();
        const timeDiff = bookingDate.getTime() - now.getTime();
        const hoursUntilBooking = timeDiff / (1000 * 60 * 60);

        // Se o agendamento é em menos de 24 horas
        if (hoursUntilBooking > 0 && hoursUntilBooking <= 24) {
          bookingNotifications.push({
            id: `notif_reminder_${booking.id}`,
            type: 'booking_reminder',
            title: 'Lembrete de Agendamento',
            message: `Sua partida na ${booking.courtName} é hoje às ${booking.startTime}`,
            bookingId: booking.id,
            timestamp: new Date(now.getTime() - 3600000), // 1 hora atrás para aparecer como recente
            read: false,
            userId: currentUserId
          });
        }
      }
    });

    // Ordenar por timestamp mais recente primeiro
    bookingNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    setNotifications(bookingNotifications);
  }, [bookings]);

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
