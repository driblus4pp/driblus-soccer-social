
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Calendar,
  Building,
  X
} from "lucide-react";
import { useManagerNotifications } from "@/hooks/useManagerNotifications";
import BottomNavigation from "@/components/navigation/BottomNavigation";

const ManagerNotifications = () => {
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    actionRequiredCount, 
    markAsRead, 
    markAllAsRead 
  } = useManagerNotifications();
  const [filter, setFilter] = useState<'all' | 'unread' | 'action'>('all');

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'action') return notification.actionRequired && !notification.read;
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking_confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'booking_pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'booking_cancelled':
        return <X className="w-5 h-5 text-red-500" />;
      case 'system_alert':
        return <AlertTriangle className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'booking_confirmed':
        return 'border-l-green-500';
      case 'booking_pending':
        return 'border-l-yellow-500';
      case 'booking_cancelled':
        return 'border-l-red-500';
      case 'system_alert':
        return 'border-l-blue-500';
      default:
        return 'border-l-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B] pb-20">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/gestor/dashboard')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">Notificações</h1>
              <p className="text-white/70 text-sm">
                {unreadCount} não lidas • {actionRequiredCount} requerem ação
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              onClick={markAllAsRead}
              className="text-white hover:bg-white/20"
              size="sm"
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Filter Tabs */}
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 
              'bg-[#F35410] hover:bg-[#BA2D0B]' : 
              'border-white/20 text-white hover:bg-white/10'
            }
            size="sm"
          >
            Todas ({notifications.length})
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            onClick={() => setFilter('unread')}
            className={filter === 'unread' ? 
              'bg-[#F35410] hover:bg-[#BA2D0B]' : 
              'border-white/20 text-white hover:bg-white/10'
            }
            size="sm"
          >
            Não lidas ({unreadCount})
          </Button>
          <Button
            variant={filter === 'action' ? 'default' : 'outline'}
            onClick={() => setFilter('action')}
            className={filter === 'action' ? 
              'bg-[#F35410] hover:bg-[#BA2D0B]' : 
              'border-white/20 text-white hover:bg-white/10'
            }
            size="sm"
          >
            Ação ({actionRequiredCount})
          </Button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <Bell className="w-12 h-12 mx-auto mb-4 text-white/50" />
                <p className="text-white/70">
                  {filter === 'all' && 'Nenhuma notificação encontrada'}
                  {filter === 'unread' && 'Todas as notificações foram lidas'}
                  {filter === 'action' && 'Nenhuma ação pendente'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`bg-white/10 border-white/20 border-l-4 ${getNotificationColor(notification.type)} ${
                  !notification.read ? 'bg-white/15' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-white font-medium">{notification.title}</h3>
                          <p className="text-white/70 text-sm mt-1">{notification.message}</p>
                          {notification.courtName && (
                            <div className="flex items-center gap-1 text-white/60 text-xs mt-2">
                              <Building className="w-3 h-3" />
                              <span>{notification.courtName}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-white/50 text-xs mt-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(notification.timestamp).toLocaleString('pt-BR')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {notification.actionRequired && !notification.read && (
                            <Badge variant="destructive" className="text-xs">
                              Ação Requerida
                            </Badge>
                          )}
                          {!notification.read && (
                            <div className="w-3 h-3 bg-[#F35410] rounded-full" />
                          )}
                        </div>
                      </div>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="text-white/70 hover:bg-white/10 mt-2"
                        >
                          Marcar como lida
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <BottomNavigation userType="manager" />
    </div>
  );
};

export default ManagerNotifications;
