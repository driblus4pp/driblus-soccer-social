import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useManagers } from './useManagers';
import { useCourts } from './useCourts';
import { useNotifications } from './useNotifications';

interface DataChangeEvent {
  type: 'court_update' | 'booking_change' | 'manager_action';
  data: any;
  timestamp: Date;
  userId: string;
}

export const useDataSync = () => {
  const { user } = useAuth();
  const { managers } = useManagers();
  const { courts } = useCourts();
  const { addNotification } = useNotifications();
  const [lastSync, setLastSync] = useState<Date>(new Date());

  // Simular sistema de eventos em tempo real
  const broadcastChange = useCallback((event: DataChangeEvent) => {
    // Em uma aplicação real, isso seria através de WebSockets ou Server-Sent Events
    console.log('Broadcasting change:', event);
    
    // Simular propagação para outros usuários
    setTimeout(() => {
      if (event.type === 'court_update') {
        addNotification({
          id: Date.now().toString(),
          title: 'Quadra Atualizada',
          message: `Informações da quadra foram atualizadas`,
          type: 'system_alert',
          timestamp: new Date(),
          read: false,
          userId: user?.id || ''
        });
      } else if (event.type === 'booking_change') {
        addNotification({
          id: Date.now().toString(),
          title: 'Agendamento Modificado',
          message: `Um agendamento foi modificado`,
          type: 'booking_confirmed',
          timestamp: new Date(),
          read: false,
          userId: user?.id || ''
        });
      }
    }, 1000);
  }, [addNotification]);

  // Função para notificar mudanças do gestor para clientes
  const notifyClients = useCallback((managerId: string, change: string) => {
    const manager = managers.find(m => m.id === managerId);
    if (manager) {
      broadcastChange({
        type: 'manager_action',
        data: { managerId, change, managerName: manager.name },
        timestamp: new Date(),
        userId: user?.id || ''
      });
    }
  }, [managers, user, broadcastChange]);

  // Função para notificar mudanças do cliente para gestores
  const notifyManagers = useCallback((courtId: string, change: string) => {
    const court = courts.find(c => c.id === courtId);
    if (court) {
      const manager = managers.find(m => m.id === court.ownerId);
      if (manager) {
        broadcastChange({
          type: 'booking_change',
          data: { courtId, courtName: court.name, change },
          timestamp: new Date(),
          userId: user?.id || ''
        });
      }
    }
  }, [courts, managers, user, broadcastChange]);

  // Simular sincronização automática
  useEffect(() => {
    const syncInterval = setInterval(() => {
      setLastSync(new Date());
      console.log('Data sync completed at:', new Date());
    }, 30000); // Sincronizar a cada 30 segundos

    return () => clearInterval(syncInterval);
  }, []);

  return {
    lastSync,
    notifyClients,
    notifyManagers,
    broadcastChange
  };
};