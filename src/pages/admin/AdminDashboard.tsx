
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, Calendar, DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "@/components/navigation/BottomNavigation";

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const mockStats = {
    totalCourts: 25,
    totalManagers: 12,
    totalBookings: 1247,
    totalRevenue: 125000,
    activeUsers: 892,
    pendingApprovals: 5
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#062B4B] to-[#0A3B5C] text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Painel Administrativo
            </h1>
            <p className="text-white/90 mt-1">
              Bem-vindo, {user?.name?.split(' ')[0] || 'Admin'}!
            </p>
          </div>
          <Button 
            variant="ghost" 
            onClick={logout}
            className="text-white hover:bg-white/20"
          >
            Sair
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Alertas importantes */}
        {mockStats.pendingApprovals > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-semibold text-orange-800">
                    {mockStats.pendingApprovals} aprovações pendentes
                  </p>
                  <p className="text-sm text-orange-600">
                    Novos gestores aguardando aprovação
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estatísticas principais */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Quadras</p>
                  <p className="text-xl font-bold">{mockStats.totalCourts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gestores</p>
                  <p className="text-xl font-bold">{mockStats.totalManagers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reservas</p>
                  <p className="text-xl font-bold">{mockStats.totalBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Receita</p>
                  <p className="text-lg font-bold">R$ {mockStats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Métricas adicionais */}
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Visão Geral do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Usuários Ativos</span>
                  <span className="font-bold">{mockStats.activeUsers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Taxa de Ocupação Média</span>
                  <span className="font-bold text-green-600">74%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Quadras Ativas</span>
                  <span className="font-bold">{mockStats.totalCourts - 2}/{mockStats.totalCourts}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navegação inferior */}
      <BottomNavigation userType="admin" />
    </div>
  );
};

export default AdminDashboard;
