import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, DollarSign, Users, ArrowLeft, Download, LogOut, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "@/components/navigation/BottomNavigation";

const AdminReports = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const mockReports = {
    revenue: {
      total: 542000,
      growth: 0.12,
      monthly: [45000, 48000, 52000, 55000, 58000, 62000, 65000, 68000, 70000, 72000, 73000, 75000]
    },
    bookings: {
      total: 1247,
      growth: 0.08,
      monthly: [100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155]
    },
    users: {
      total: 892,
      growth: 0.05,
      monthly: [70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92]
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#062B4B] to-[#0A3B5C] text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/admin/dashboard')} 
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Relatórios</h1>
              <p className="text-white/80 text-sm">Análises e métricas da plataforma</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button variant="ghost" onClick={logout} className="text-white hover:bg-white/20">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Visão Geral */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Visão Geral
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Receita Total</p>
                      <p className="text-xl font-bold">R$ {mockReports.revenue.total.toLocaleString()}</p>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        {mockReports.revenue.growth > 0 ? '+' : ''}{(mockReports.revenue.growth * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total de Reservas</p>
                      <p className="text-xl font-bold">{mockReports.bookings.total}</p>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        {mockReports.bookings.growth > 0 ? '+' : ''}{(mockReports.bookings.growth * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total de Usuários</p>
                      <p className="text-xl font-bold">{mockReports.users.total}</p>
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                        {mockReports.users.growth > 0 ? '+' : ''}{(mockReports.users.growth * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Receita Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
                Gráfico de Receita Mensal
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Novos Usuários Mensais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
                Gráfico de Novos Usuários
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Métricas Detalhadas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Métricas de Receita
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Receita Média por Reserva</p>
                <p className="text-2xl font-bold text-gray-900">R$ 45,00</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Taxa de Crescimento Mensal</p>
                <p className="text-2xl font-bold text-gray-900">+2.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Métricas de Usuários
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Novos Usuários este Mês</p>
                <p className="text-2xl font-bold text-gray-900">125</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Taxa de Retenção</p>
                <p className="text-2xl font-bold text-gray-900">68%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation userType="admin" />
    </div>
  );
};

export default AdminReports;
