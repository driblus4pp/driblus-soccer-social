import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, DollarSign, Users, Clock, Building, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import ManagerCourtManager from "@/components/manager/ManagerCourtManager";
import ManagerSchedule from "@/components/manager/ManagerSchedule";

const ManagerDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Ler parâmetro da URL para definir aba ativa
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    
    if (tabParam === 'schedule') {
      setActiveTab('schedule');
    } else if (tabParam === 'court') {
      setActiveTab('court');
    } else {
      setActiveTab('overview');
    }
  }, [location.search]);

  // Atualizar URL quando aba muda
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'overview') {
      navigate('/gestor/dashboard');
    } else {
      navigate(`/gestor/dashboard?tab=${value}`);
    }
  };

  // Simulando dados do gestor
  const managerId = 'manager-1';
  const mockStats = {
    todayBookings: 5,
    monthlyRevenue: 8500,
    courtStatus: 'active',
    nextBookings: [
      {
        id: 1,
        time: '14:00',
        customer: 'João Silva',
        status: 'confirmed'
      },
      {
        id: 2,
        time: '16:00', 
        customer: 'Maria Santos',
        status: 'pending'
      },
      {
        id: 3,
        time: '18:00',
        customer: 'Pedro Costa', 
        status: 'confirmed'
      }
    ]
  };

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#F35410] to-[#BA2D0B] text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Olá, {user?.name?.split(' ')[0] || 'Gestor'}! 👋
            </h1>
            <p className="text-white/90 mt-1">Como está sua quadra hoje?</p>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-white hover:bg-white/20">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
            <TabsTrigger value="overview" className="text-gray-700 data-[state=active]:bg-[#F35410] data-[state=active]:text-white">
              Início
            </TabsTrigger>
            <TabsTrigger value="court" className="text-gray-700 data-[state=active]:bg-[#F35410] data-[state=active]:text-white">
              Quadra  
            </TabsTrigger>
            <TabsTrigger value="schedule" className="text-gray-700 data-[state=active]:bg-[#F35410] data-[state=active]:text-white">
              Agenda
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Cards de estatísticas simplificados */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Hoje</p>
                      <p className="text-xl font-bold">{mockStats.todayBookings}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Este Mês</p>
                      <p className="text-xl font-bold">R$ {mockStats.monthlyRevenue}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status da Quadra */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Status da Quadra
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-green-800">Quadra Ativa</p>
                      <p className="text-sm text-green-600">Disponível para reservas</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleTabChange('court')}>
                    Gerenciar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Próximos Agendamentos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Próximos Agendamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockStats.nextBookings.map(booking => (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#F35410] rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{booking.time}</span>
                        </div>
                        <div>
                          <p className="font-semibold">{booking.customer}</p>
                          <p className="text-sm text-gray-600">Agendamento</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full mt-4 bg-[#F35410] hover:bg-[#BA2D0B]"
                  onClick={() => handleTabChange('schedule')}
                >
                  Ver Todos os Agendamentos
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="court" className="space-y-6">
            <ManagerCourtManager managerId={managerId} />
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <ManagerSchedule managerId={managerId} />
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation userType="manager" />
    </div>
  );
};

export default ManagerDashboard;
