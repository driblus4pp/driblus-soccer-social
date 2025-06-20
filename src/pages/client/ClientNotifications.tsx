
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, DollarSign, AlertCircle, ArrowLeft } from "lucide-react";
import BottomNavigation from "@/components/navigation/BottomNavigation";

const mockNotifications = [
  {
    id: '1',
    type: 'booking',
    title: 'Reserva confirmada',
    message: 'Sua reserva no No Alvo Society foi confirmada para hoje às 19:00',
    time: '2h atrás',
    isRead: false,
    icon: Calendar
  },
  {
    id: '2',
    type: 'payment',
    title: 'Pagamento processado',
    message: 'Pagamento de R$ 120,00 foi processado com sucesso',
    time: '1 dia atrás',
    isRead: true,
    icon: DollarSign
  },
  {
    id: '3',
    type: 'alert',
    title: 'Lembrete de jogo',
    message: 'Sua partida começa em 1 hora no Gol de Placa',
    time: '3h atrás',
    isRead: false,
    icon: AlertCircle
  },
  {
    id: '4',
    type: 'general',
    title: 'Nova quadra disponível',
    message: 'Confira a nova quadra Arena Premium perto de você',
    time: '2 dias atrás',
    isRead: true,
    icon: Bell
  }
];

const ClientNotifications = () => {
  const navigate = useNavigate();

  const getNotificationColor = (type: string) => {
    const colors = {
      booking: 'bg-green-500',
      payment: 'bg-blue-500',
      alert: 'bg-orange-500',
      general: 'bg-purple-500'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-[#093758] pb-20">
      {/* Header */}
      <div className="px-4 py-6 bg-[#093758]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/cliente/dashboard')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-white">Notificações</h1>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            Marcar todas como lidas
          </Button>
        </div>
      </div>

      <div className="px-4 space-y-3">
        {mockNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Nenhuma notificação
            </h3>
            <p className="text-white/60 text-sm">
              Você está em dia! Suas notificações aparecerão aqui.
            </p>
          </div>
        ) : (
          mockNotifications.map(notification => {
            const IconComponent = notification.icon;
            return (
              <Card 
                key={notification.id} 
                className={`cursor-pointer transition-all ${
                  notification.isRead 
                    ? 'bg-white/5 border-white/10' 
                    : 'bg-white/10 border-white/20 shadow-md'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-semibold ${
                          notification.isRead ? 'text-white/70' : 'text-white'
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <Badge className="bg-[#F35410] text-white text-xs">
                            Nova
                          </Badge>
                        )}
                      </div>
                      <p className={`text-sm mb-2 ${
                        notification.isRead ? 'text-white/50' : 'text-white/70'
                      }`}>
                        {notification.message}
                      </p>
                      <span className="text-xs text-white/40">
                        {notification.time}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <BottomNavigation userType="client" />
    </div>
  );
};

export default ClientNotifications;
