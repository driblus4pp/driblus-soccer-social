import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, X, Calendar, DollarSign, Gift, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
interface Notification {
  id: string;
  type: 'booking' | 'payment' | 'offer' | 'alert';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}
const mockNotifications: Notification[] = [{
  id: '1',
  type: 'booking',
  title: 'Reserva confirmada',
  message: 'Sua reserva no No Alvo Society foi confirmada para hoje às 19:00',
  time: '2h atrás',
  isRead: false
}, {
  id: '2',
  type: 'payment',
  title: 'Pagamento processado',
  message: 'Pagamento de R$ 120,00 foi processado com sucesso',
  time: '1 dia atrás',
  isRead: true
}, {
  id: '3',
  type: 'offer',
  title: 'Oferta especial',
  message: 'Desconto de 20% em reservas de domingo. Válido até 31/12',
  time: '3h atrás',
  isRead: false
}, {
  id: '4',
  type: 'alert',
  title: 'Reserva cancelada',
  message: 'Sua reserva na Arena Premium foi cancelada pelo estabelecimento',
  time: '2 dias atrás',
  isRead: true
}];
interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const NotificationModal = ({
  isOpen,
  onClose
}: NotificationModalProps) => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const getNotificationIcon = (type: string) => {
    const icons = {
      booking: Calendar,
      payment: DollarSign,
      offer: Gift,
      alert: AlertTriangle
    };
    return icons[type as keyof typeof icons] || Bell;
  };
  const getNotificationColor = (type: string) => {
    const colors = {
      booking: 'border-l-green-500 bg-green-50',
      payment: 'border-l-blue-500 bg-blue-50',
      offer: 'border-l-orange-500 bg-orange-50',
      alert: 'border-l-red-500 bg-red-50'
    };
    return colors[type as keyof typeof colors] || 'border-l-gray-500 bg-gray-50';
  };
  const getBadgeColor = (type: string) => {
    const colors = {
      booking: 'bg-green-500',
      payment: 'bg-blue-500',
      offer: 'bg-orange-500',
      alert: 'bg-red-500'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };
  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification => notification.id === id ? {
      ...notification,
      isRead: true
    } : notification));
  };
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({
      ...notification,
      isRead: true
    })));
  };
  const unreadCount = notifications.filter(n => !n.isRead).length;
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4 max-h-[80vh] overflow-hidden bg-sky-950">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Notificações</DialogTitle>
            {unreadCount > 0 && <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-sm text-gray-600 hover:text-gray-900">
                <Check className="w-4 h-4 mr-1" />
                Marcar todas como lidas
              </Button>}
          </div>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-96 space-y-3 pr-2">
          {notifications.length === 0 ? <div className="text-center py-8">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma notificação</p>
            </div> : notifications.map(notification => {
          const IconComponent = getNotificationIcon(notification.type);
          return <div key={notification.id} className={`p-4 rounded-lg border-l-4 cursor-pointer transition-all hover:shadow-md ${getNotificationColor(notification.type)} ${notification.isRead ? 'opacity-70' : ''}`} onClick={() => markAsRead(notification.id)}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getBadgeColor(notification.type)}`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {notification.title}
                        </h4>
                        {!notification.isRead && <div className="w-2 h-2 bg-[#F35410] rounded-full flex-shrink-0 ml-2" />}
                      </div>
                      <p className="text-gray-700 text-sm mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      <span className="text-xs text-gray-500">
                        {notification.time}
                      </span>
                    </div>
                  </div>
                </div>;
        })}
        </div>
      </DialogContent>
    </Dialog>;
};
export default NotificationModal;