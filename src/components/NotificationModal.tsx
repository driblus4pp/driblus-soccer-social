
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, Calendar, DollarSign, Gift, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationModal = ({
  isOpen,
  onClose
}: NotificationModalProps) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const getNotificationIcon = (type: string) => {
    const icons = {
      booking_confirmed: Calendar,
      booking_cancelled: AlertTriangle,
      booking_reminder: Calendar,
      payment: DollarSign,
      offer: Gift,
      alert: AlertTriangle
    };
    return icons[type as keyof typeof icons] || Bell;
  };

  const getNotificationColor = (type: string) => {
    const colors = {
      booking_confirmed: 'border-l-green-500 bg-green-50',
      booking_cancelled: 'border-l-red-500 bg-red-50',
      booking_reminder: 'border-l-blue-500 bg-blue-50',
      payment: 'border-l-blue-500 bg-blue-50',
      offer: 'border-l-orange-500 bg-orange-50',
      alert: 'border-l-red-500 bg-red-50'
    };
    return colors[type as keyof typeof colors] || 'border-l-gray-500 bg-gray-50';
  };

  const getBadgeColor = (type: string) => {
    const colors = {
      booking_confirmed: 'bg-green-500',
      booking_cancelled: 'bg-red-500',
      booking_reminder: 'bg-blue-500',
      payment: 'bg-blue-500',
      offer: 'bg-orange-500',
      alert: 'bg-red-500'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4 max-h-[80vh] overflow-hidden bg-sky-950">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-50">
              Notificações
            </DialogTitle>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-sm text-gray-50 bg-orange-700 hover:bg-orange-600"
              >
                <Check className="w-4 h-4 mr-1" />
                Marcar todas como lidas
              </Button>
            )}
          </div>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-96 space-y-3 pr-2">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma notificação</p>
            </div>
          ) : (
            notifications.map(notification => {
              const IconComponent = getNotificationIcon(notification.type);
              return (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border-l-4 cursor-pointer transition-all hover:shadow-md ${getNotificationColor(notification.type)} ${
                    notification.read ? 'opacity-70' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getBadgeColor(notification.type)}`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-[#F35410] rounded-full flex-shrink-0 ml-2" />
                        )}
                      </div>
                      <p className="text-gray-700 text-sm mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      <span className="text-xs text-gray-500">
                        {format(notification.timestamp, "dd/MM • HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationModal;
