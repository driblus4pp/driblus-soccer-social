
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, Calendar } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NotificationDropdownProps {
  onNotificationClick?: (bookingId: string) => void;
}

const NotificationDropdown = ({ onNotificationClick }: NotificationDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    setIsOpen(false);
    if (onNotificationClick) {
      onNotificationClick(notification.bookingId);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking_confirmed':
        return '✅';
      case 'booking_cancelled':
        return '❌';
      case 'booking_reminder':
        return '⏰';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'booking_confirmed':
        return 'bg-green-500/20 border-green-500/30';
      case 'booking_cancelled':
        return 'bg-red-500/20 border-red-500/30';
      case 'booking_reminder':
        return 'bg-blue-500/20 border-blue-500/30';
      default:
        return 'bg-white/10 border-white/20';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="text-white hover:bg-white/20 relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div 
          className={`absolute right-0 top-12 w-80 z-50 transform transition-all duration-300 ease-out ${
            isOpen 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-95 -translate-y-2'
          }`}
          style={{
            transformOrigin: 'top right',
            animation: isOpen ? 'dropEffect 0.3s ease-out' : ''
          }}
        >
          <style jsx>{`
            @keyframes dropEffect {
              0% {
                transform: scale(0.3) translateY(-20px);
                opacity: 0;
              }
              50% {
                transform: scale(1.05) translateY(0px);
                opacity: 0.8;
              }
              100% {
                transform: scale(1) translateY(0px);
                opacity: 1;
              }
            }
          `}</style>
          
          <Card className="bg-[#062B4B]/95 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">Notificações</CardTitle>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-white/70 hover:text-white text-xs"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Marcar todas como lidas
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0 max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-white/70">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma notificação</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-3 mx-3 mb-2 rounded-lg cursor-pointer transition-all hover:bg-white/10 border ${
                        notification.read ? 'opacity-70' : ''
                      } ${getNotificationColor(notification.type)}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-white font-medium text-sm truncate">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-[#F35410] rounded-full flex-shrink-0 ml-2" />
                            )}
                          </div>
                          <p className="text-white/80 text-xs mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-white/60 text-xs mt-2">
                            {format(notification.timestamp, "dd/MM • HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {notifications.length > 0 && (
                <div className="p-3 border-t border-white/20">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-white/70 hover:text-white"
                    onClick={() => {
                      setIsOpen(false);
                      if (onNotificationClick) {
                        onNotificationClick('');
                      }
                    }}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Ver todos na Agenda
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
