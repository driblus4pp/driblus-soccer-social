import { useEffect, useRef } from 'react';
import type { Notification } from '@/types';

export const usePushNotifications = (notifications: Notification[]) => {
  const previousNotificationsRef = useRef<Notification[]>([]);

  useEffect(() => {
    // Solicitar permissão para notificações na primeira execução
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const previousNotifications = previousNotificationsRef.current;
    const newNotifications = notifications.filter(notification => 
      !previousNotifications.find(prev => prev.id === notification.id)
    );

    // Enviar notificação push para novas notificações não lidas
    newNotifications.forEach(notification => {
      if (!notification.read && 'Notification' in window && Notification.permission === 'granted') {
        const pushNotification = new Notification(notification.title, {
          body: notification.message,
          icon: '/lovable-uploads/0e6fb8a5-a6de-4b38-955c-58e7bcef94bb.png', // Logo do Driblus
          badge: '/lovable-uploads/0e6fb8a5-a6de-4b38-955c-58e7bcef94bb.png',
          tag: notification.id, // Evita duplicadas
          requireInteraction: true, // Mantém visível até o usuário interagir
          data: {
            bookingId: notification.bookingId,
            notificationId: notification.id
          }
        });

        // Auto-fechar após 5 segundos se não for interação obrigatória
        setTimeout(() => {
          pushNotification.close();
        }, 5000);

        // Opcional: fazer algo quando o usuário clica na notificação
        pushNotification.onclick = () => {
          window.focus(); // Focar na janela do app
          pushNotification.close();
          
          // Aqui poderia navegar para a página do agendamento específico
          console.log('Usuário clicou na notificação:', notification.bookingId);
        };
      }
    });

    // Atualizar referência das notificações anteriores
    previousNotificationsRef.current = notifications;
  }, [notifications]);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  const isSupported = 'Notification' in window;
  const hasPermission = isSupported && Notification.permission === 'granted';

  return {
    requestPermission,
    isSupported,
    hasPermission
  };
};