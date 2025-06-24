
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building, 
  Calendar, 
  DollarSign, 
  Users, 
  Plus, 
  Settings, 
  MapPin,
  Star,
  TrendingUp,
  CalendarCheck,
  AlertCircle,
  Edit
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import CourtManagement from "./CourtManagement";
import ManagerCourtSettings from "./ManagerCourtSettings";
import { useCourts } from "@/hooks/useCourts";

const OwnerDashboard = () => {
  const { user, connectGoogleCalendar, isLoading } = useAuth();
  const { getCourtsByManager } = useCourts();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCourtForSettings, setSelectedCourtForSettings] = useState<string | null>(null);

  // Simulando o ID do gestor logado
  const managerId = 'manager-1';
  const managerCourts = getCourtsByManager(managerId);

  const handleConnectCalendar = async () => {
    await connectGoogleCalendar();
  };

  const stats = {
    totalCourts: managerCourts.length,
    monthlyRevenue: 15420,
    totalBookings: 87,
    occupancyRate: 76,
    avgRating: 4.8,
    pendingBookings: 5
  };

  const recentBookings = [
    {
      id: 1,
      courtName: "Quadra 1 - Society",
      userName: "Carlos Silva",
      date: "2024-06-20",
      time: "19:00 - 20:00",
      status: "confirmed",
      amount: 120
    },
    {
      id: 2,
      courtName: "Quadra 2 - Futsal",
      userName: "Ana Santos",
      date: "2024-06-20",
      time: "20:00 - 21:00",
      status: "pending",
      amount: 100
    },
    {
      id: 3,
      courtName: "Quadra 3 - Vôlei",
      userName: "Pedro Oliveira",
      date: "2024-06-21",
      time: "18:00 - 19:00",
      status: "confirmed",
      amount: 80
    }
  ];

  // Se uma quadra foi selecionada para configuração
  if (selectedCourtForSettings) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <ManagerCourtSettings 
            courtId={selectedCourtForSettings} 
            onBack={() => setSelectedCourtForSettings(null)} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard do Gestor</h1>
            <p className="text-gray-600">Gerencie suas quadras e reservas</p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-[#F35410] hover:bg-[#BA2D0B] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nova Quadra
            </Button>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Google Calendar Integration Alert */}
        {!user?.googleCalendarConnected && (
          <Card className="bg-yellow-50 border-yellow-200 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">Conecte seu Google Calendar</p>
                  <p className="text-gray-600 text-sm">Sincronize automaticamente suas reservas com o Google Calendar</p>
                </div>
                <Button 
                  onClick={handleConnectCalendar}
                  disabled={isLoading}
                  className="bg-[#F35410] hover:bg-[#BA2D0B] text-white"
                >
                  {isLoading ? 'Conectando...' : 'Conectar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white border border-gray-200">
            <TabsTrigger value="overview" className="text-gray-700 data-[state=active]:bg-[#F35410] data-[state=active]:text-white">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="courts" className="text-gray-700 data-[state=active]:bg-[#F35410] data-[state=active]:text-white">
              Quadras
            </TabsTrigger>
            <TabsTrigger value="bookings" className="text-gray-700 data-[state=active]:bg-[#F35410] data-[state=active]:text-white">
              Reservas
            </TabsTrigger>
            <TabsTrigger value="calendar" className="text-gray-700 data-[state=active]:bg-[#F35410] data-[state=active]:text-white">
              Calendário
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-gray-700 data-[state=active]:bg-[#F35410] data-[state=active]:text-white">
              Relatórios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#F35410]/10 rounded-lg">
                      <Building className="w-6 h-6 text-[#F35410]" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Total de Quadras</p>
                      <p className="text-2xl font-bold text-gray-800">{stats.totalCourts}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Receita Mensal</p>
                      <p className="text-2xl font-bold text-gray-800">R$ {stats.monthlyRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <CalendarCheck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Reservas do Mês</p>
                      <p className="text-2xl font-bold text-gray-800">{stats.totalBookings}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* My Courts Overview */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-800">Minhas Quadras</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {managerCourts.map(court => (
                  <div key={court.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-4">
                      <img 
                        src={court.images[0]} 
                        alt={court.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="text-gray-800 font-medium">{court.name}</h4>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <MapPin className="w-3 h-3" />
                          <span>{court.location.city}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-gray-600 text-sm">{court.rating}</span>
                          </div>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${
                              court.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : court.status === 'inactive'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {court.status === 'active' ? 'Ativa' : 
                             court.status === 'inactive' ? 'Inativa' : 'Pendente'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-gray-800 font-bold">R$ {court.hourlyRate}</p>
                        <p className="text-gray-500 text-xs">por hora</p>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => setSelectedCourtForSettings(court.id)}
                        className="bg-[#F35410] hover:bg-[#BA2D0B] text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-800">Reservas Recentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentBookings.map(booking => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <h4 className="text-gray-800 font-medium">{booking.courtName}</h4>
                      <p className="text-gray-600 text-sm">{booking.userName}</p>
                      <p className="text-gray-500 text-xs">{booking.date} • {booking.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-800 font-bold">R$ {booking.amount}</p>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {booking.status === 'confirmed' ? 'Confirmada' : 'Pendente'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courts" className="space-y-6">
            <CourtManagement />
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-800">Todas as Reservas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentBookings.map(booking => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <h4 className="text-gray-800 font-medium">{booking.courtName}</h4>
                      <p className="text-gray-600 text-sm">{booking.userName}</p>
                      <p className="text-gray-500 text-xs">{booking.date} • {booking.time}</p>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <p className="text-gray-800 font-bold">R$ {booking.amount}</p>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            booking.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {booking.status === 'confirmed' ? 'Confirmada' : 'Pendente'}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                          Ver Detalhes
                        </Button>
                        {booking.status === 'pending' && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                            Confirmar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Calendário Dinâmico</h3>
              <p className="text-gray-600">Gerencie disponibilidade e horários de funcionamento</p>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Relatórios Detalhados</h3>
              <p className="text-gray-600">Analise o desempenho das suas quadras e otimize sua receita</p>
              <Button className="mt-4 bg-[#F35410] hover:bg-[#BA2D0B] text-white">
                Ver Relatórios Completos
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OwnerDashboard;
