
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, ArrowLeft, Check, X, Clock, AlertCircle, LogOut, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "@/components/navigation/BottomNavigation";

const ManagerNotifications = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  const mockNotifications = [
    {
      id: 1,
      type: 'booking',
      message: 'Novo agendamento para amanhã às 16:00',
      time: '1 hora atrás',
      status: 'new'
    },
    {
      id: 2,
      type: 'payment',
      message: 'Pagamento confirmado para o agendamento de hoje',
      time: '2 horas atrás',
      status: 'read'
    },
    {
      id: 3,
      type: 'system',
      message: 'Sua quadra foi destacada na página principal!',
      time: '1 dia atrás',
      status: 'read'
    },
    {
      id: 4,
      type: 'review',
      message: 'Novo feedback: "Excelente quadra e atendimento!"',
      time: '2 dias atrás',
      status: 'read'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#F35410] to-[#BA2D0B] text-white p-6">
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
              <h1 className="text-xl font-semibold">Notificações</h1>
              <p className="text-white/80 text-sm">Acompanhe suas atualizações</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-white hover:bg-white/20">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {mockNotifications.map(notification => (
          <Card key={notification.id} className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {notification.type === 'booking' && (
                      <Bell className="w-4 h-4 text-blue-500" />
                    )}
                    {notification.type === 'payment' && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                    {notification.type === 'system' && (
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                    )}
                    {notification.type === 'review' && (
                      <Star className="w-4 h-4 text-yellow-500" />
                    )}
                    <p className="font-medium">{notification.message}</p>
                  </div>
                  <p className="text-sm text-gray-500">{notification.time}</p>
                </div>
                {notification.status === 'new' && (
                  <Badge variant="secondary">Novo</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <BottomNavigation userType="manager" />
    </div>
  );
};

export default ManagerNotifications;
