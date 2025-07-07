import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Calendar,
  Building,
  X,
  User
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useManagerNotifications } from "@/hooks/useManagerNotifications";
import BottomNavigation from "@/components/navigation/BottomNavigation";

const ManagerNotifications = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    actionRequiredCount, 
    markAsRead, 
    markAllAsRead 
  } = useManagerNotifications();
  const [filter, setFilter] = useState<'all' | 'unread' | 'action'>('all');

  // Verificação de autenticação
  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/gestor/login');
    }
  }, [user, isLoading, navigate]);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'action') return notification.actionRequired && !notification.read;
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking_confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'booking_pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'booking_cancelled':
        return <X className="w-4 h-4 text-red-500" />;
      case 'system_alert':
        return <AlertTriangle className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  // Não renderizar se não estiver autenticado
  if (!user && !isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Minimalista */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/gestor/dashboard')}
              className="text-[#F35410] hover:bg-[#F35410]/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Avisos</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-600">
                  {unreadCount} não lidas
                </p>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              onClick={markAllAsRead}
              className="text-[#F35410] hover:bg-[#F35410]/10 text-sm"
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Filtros Minimalistas */}
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 
              'bg-[#F35410] hover:bg-[#BA2D0B] h-8 text-sm' : 
              'border-gray-300 text-gray-700 hover:bg-gray-50 h-8 text-sm'
            }
            size="sm"
          >
            Todas ({notifications.length})
          </Button>
          {unreadCount > 0 && (
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              onClick={() => setFilter('unread')}
              className={filter === 'unread' ? 
                'bg-[#F35410] hover:bg-[#BA2D0B] h-8 text-sm' : 
                'border-gray-300 text-gray-700 hover:bg-gray-50 h-8 text-sm'
              }
              size="sm"
            >
              Não lidas ({unreadCount})
            </Button>
          )}
          {actionRequiredCount > 0 && (
            <Button
              variant={filter === 'action' ? 'default' : 'outline'}
              onClick={() => setFilter('action')}
              className={filter === 'action' ? 
                'bg-[#F35410] hover:bg-[#BA2D0B] h-8 text-sm' : 
                'border-gray-300 text-gray-700 hover:bg-gray-50 h-8 text-sm'
              }
              size="sm"
            >
              Ação ({actionRequiredCount})
            </Button>
          )}
        </div>

        {/* Lista de Notificações Minimalista */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card className="bg-white">
              <CardContent className="p-8 text-center">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">
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
                className={`bg-white transition-all ${
                  !notification.read ? 'border-l-4 border-l-[#F35410] shadow-sm' : 'border-gray-200'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-800 leading-tight">
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                          {notification.actionRequired && !notification.read && (
                            <Badge variant="destructive" className="text-xs">
                              Ação
                            </Badge>
                          )}
                          {!notification.read && (
                            <div className="w-2 h-2 bg-[#F35410] rounded-full" />
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {notification.courtName && (
                            <div className="flex items-center gap-1">
                              <Building className="w-3 h-3" />
                              <span>{notification.courtName}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(notification.timestamp).toLocaleString('pt-BR')}</span>
                          </div>
                        </div>
                        
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="text-[#F35410] hover:bg-[#F35410]/10 text-xs h-6"
                          >
                            Marcar como lida
                          </Button>
                        )}
                      </div>
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
