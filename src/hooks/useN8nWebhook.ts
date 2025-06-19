
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface BookingNotification {
  courtName: string;
  clientData: {
    name: string;
    phone: string;
    email: string;
  };
  booking: {
    date: string;
    time: string;
  };
  managerId: string;
}

export const useN8nWebhook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendBookingNotification = async (data: BookingNotification, webhookUrl?: string) => {
    if (!webhookUrl) {
      console.warn('N8N webhook URL not configured');
      return false;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          type: 'booking_notification',
          timestamp: new Date().toISOString(),
          data: {
            court: data.courtName,
            client: {
              name: data.clientData.name,
              phone: data.clientData.phone,
              email: data.clientData.email
            },
            booking: {
              date: data.booking.date,
              time: data.booking.time
            },
            managerId: data.managerId,
            message: `🏆 *NOVO AGENDAMENTO DRIBLUS*\n\n` +
                    `📍 *Quadra:* ${data.courtName}\n` +
                    `👤 *Cliente:* ${data.clientData.name}\n` +
                    `📱 *Telefone:* ${data.clientData.phone}\n` +
                    `📧 *Email:* ${data.clientData.email}\n` +
                    `📅 *Data:* ${data.booking.date}\n` +
                    `⏰ *Horário:* ${data.booking.time}\n\n` +
                    `💰 *Pagamento:* No local\n` +
                    `⚽ *Bom jogo!*`
          }
        })
      });

      console.log('N8N webhook notification sent successfully');
      
      toast({
        title: "Notificação Enviada",
        description: "O gestor foi notificado sobre o novo agendamento via WhatsApp",
      });

      return true;
    } catch (error) {
      console.error('Error sending N8N webhook:', error);
      
      toast({
        title: "Erro na Notificação",
        description: "Não foi possível enviar a notificação automática",
        variant: "destructive",
      });

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendBookingNotification,
    isLoading
  };
};
