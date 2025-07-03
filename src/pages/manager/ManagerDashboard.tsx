import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, DollarSign, Users, TrendingUp, Clock, MapPin, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import GoogleCalendarManager from "@/components/manager/GoogleCalendarManager";
const ManagerDashboard = () => {
  const {
    user,
    logout
  } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const mockStats = {
    todayBookings: 12,
    monthlyRevenue: 8500,
    totalCustomers: 145,
    occupancyRate: 78
  };
  const mockBookings = [{
    id: 1,
    time: '09:00',
    customer: 'João Silva',
    court: 'Quadra 1',
    status: 'confirmed'
  }, {
    id: 2,
    time: '10:30',
    customer: 'Maria Santos',
    court: 'Quadra 2',
    status: 'pending'
  }, {
    id: 3,
    time: '14:00',
    customer: 'Pedro Costa',
    court: 'Quadra 1',
    status: 'confirmed'
  }];
  return <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#F35410] to-[#BA2D0B] text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Olá, {user?.name?.split(' ')[0] || 'Gestor'}! 👋
            </h1>
            <p className="text-white/90 mt-1">Bem-vindo ao painel de gestão</p>
          </div>
          <Button variant="ghost" onClick={logout} className="text-white hover:bg-white/20">
            Sair
          </Button>
        </div>
      </div>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 bg-slate-50">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
            <TabsTrigger value="overview" className="text-gray-700 data-[state=active]:bg-[#F35410] data-[state=active]:text-white">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="calendar" className="text-gray-700 data-[state=active]:bg-[#F35410] data-[state=active]:text-white">
              Calendário
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-gray-700 data-[state=active]:bg-[#F35410] data-[state=active]:text-white">
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Cards de estatísticas */}
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
                      <p className="text-sm text-gray-600">Receita</p>
                      <p className="text-xl font-bold">R$ {mockStats.monthlyRevenue}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Clientes</p>
                      <p className="text-xl font-bold">{mockStats.totalCustomers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ocupação</p>
                      <p className="text-xl font-bold">{mockStats.occupancyRate}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Agendamentos de hoje */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Agendamentos de Hoje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockBookings.map(booking => <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#F35410] rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{booking.time}</span>
                        </div>
                        <div>
                          <p className="font-semibold">{booking.customer}</p>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin className="w-3 h-3" />
                            <span>{booking.court}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {booking.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                      </div>
                    </div>)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <GoogleCalendarManager />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="text-center py-12">
              <Settings className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Configurações</h3>
              <p className="text-gray-600">Gerencie preferências e configurações</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Navegação inferior */}
      <BottomNavigation userType="manager" />
    </div>;
};
export default ManagerDashboard;