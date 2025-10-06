import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Building2, Calendar, Settings, Edit, LogOut, ArrowLeft, TrendingUp, Users, DollarSign } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useManagerAnalytics } from "@/hooks/useManagerAnalytics";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import BookingsListModal from "@/components/manager/BookingsListModal";
import CustomerContactsModal from "@/components/manager/CustomerContactsModal";
import RevenueHistoryModal from "@/components/manager/RevenueHistoryModal";
import LoyalCustomersModal from "@/components/manager/LoyalCustomersModal";

const ManagerProfile = () => {
  const navigate = useNavigate();
  const { user, profile, logout, isLoading } = useAuth();
  
  // Verificação de autenticação
  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/gestor/login');
    }
  }, [user, isLoading, navigate]);

  // Simulando ID do gestor logado (seria vindo do contexto de autenticação)
  const currentManagerId = 'manager-1';
  const analytics = useManagerAnalytics(currentManagerId);
  
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const managerStats = {
    courtName: 'Arena Cangaço',
    totalBookings: analytics.monthlyBookings.length,
    monthlyRevenue: analytics.revenueHistory[analytics.revenueHistory.length - 1]?.revenue || 0,
    customerRating: 4.8
  };

  // Extrair clientes únicos dos agendamentos mensais
  const uniqueCustomers = analytics.monthlyBookings.reduce((acc, booking) => {
    if (!acc.find(c => c.userId === booking.id)) {
      acc.push({
        userId: booking.id,
        userName: booking.userName,
        userEmail: booking.userEmail,
        userPhone: booking.userPhone
      });
    }
    return acc;
  }, [] as any[]);

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair da conta?')) {
      logout();
    }
  };

  // Não renderizar se não estiver autenticado
  if (!user && !isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#F35410] to-[#BA2D0B] text-white p-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/gestor/dashboard')} className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Meu Perfil</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Perfil do Gestor */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 bg-[#F35410] rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{profile?.nome || user?.email || 'Gestor'}</h2>
                <p className="text-gray-600">{user?.email || 'carlos@email.com'}</p>
                <Badge className="bg-[#F35410] text-white mt-2">
                  Gestor Aprovado
                </Badge>
              </div>
              <Button variant="outline" size="icon" onClick={() => navigate('/gestor/perfil/editar')}>
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Informações da Quadra */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Quadra Gerenciada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-lg">{managerStats.courtName}</p>
                <p className="text-gray-600">Aldeota, Fortaleza - CE</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg" onClick={() => setActiveModal('bookings')}>
                  <p className="text-2xl font-bold text-[#F35410]">{managerStats.totalBookings}</p>
                  <p className="text-sm text-gray-600">Reservas este mês</p>
                  <Button variant="ghost" size="sm" className="mt-1 text-xs text-[#F35410]">
                    Ver detalhes
                  </Button>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#F35410]">{managerStats.customerRating}</p>
                  <p className="text-sm text-gray-600">Avaliação</p>
                </div>
              </div>
              
              {/* Botão para ver contatos dos clientes */}
              <div className="pt-2 border-t">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveModal('customers')}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Ver Contatos dos Clientes ({uniqueCustomers.length})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded" onClick={() => setActiveModal('revenue')}>
                <span className="text-gray-600">Receita Mensal</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-green-600">R$ {managerStats.monthlyRevenue.toLocaleString()}</span>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Taxa de Ocupação</span>
                <span className="font-bold text-blue-600">{analytics.occupancyRate.current}%</span>
              </div>
              
              <div className="text-xs text-gray-500">
                Projeção 30 dias: {analytics.occupancyRate.projection30Days}%
              </div>
              
              <div className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded" onClick={() => setActiveModal('loyal')}>
                <span className="text-gray-600">Clientes Fiéis</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-purple-600">{analytics.loyalCustomers.length}</span>
                  <DollarSign className="w-4 h-4 text-purple-600" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/gestor/perfil/editar')}>
              <User className="w-4 h-4 mr-3" />
              Editar Perfil
            </Button>
            
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/gestor/preferencias')}>
              <Settings className="w-4 h-4 mr-3" />
              Preferências
            </Button>
            
            <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-red-600 hover:bg-red-50">
              <LogOut className="w-4 h-4 mr-3" />
              Sair da Conta
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Modais */}
      <BookingsListModal 
        isOpen={activeModal === 'bookings'} 
        onClose={() => setActiveModal(null)}
        bookings={analytics.monthlyBookings}
      />
      
      <CustomerContactsModal 
        isOpen={activeModal === 'customers'} 
        onClose={() => setActiveModal(null)}
        customers={uniqueCustomers}
      />
      
      <RevenueHistoryModal 
        isOpen={activeModal === 'revenue'} 
        onClose={() => setActiveModal(null)}
        revenueHistory={analytics.revenueHistory}
      />
      
      <LoyalCustomersModal 
        isOpen={activeModal === 'loyal'} 
        onClose={() => setActiveModal(null)}
        loyalCustomers={analytics.loyalCustomers}
      />

      <BottomNavigation userType="manager" />
    </div>
  );
};

export default ManagerProfile;
