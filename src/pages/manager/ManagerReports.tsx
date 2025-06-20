
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, TrendingUp, Calendar, DollarSign, Users, ArrowLeft } from "lucide-react";
import BottomNavigation from "@/components/navigation/BottomNavigation";

const ManagerReports = () => {
  const navigate = useNavigate();

  const reportData = {
    monthlyRevenue: 15400,
    totalBookings: 156,
    averageOccupancy: 78,
    customerGrowth: 12
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#F35410] to-[#BA2D0B] text-white p-6">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/gestor/dashboard')}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Relatórios</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Métricas principais */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Receita Mensal</p>
                  <p className="text-xl font-bold">R$ {reportData.monthlyRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reservas</p>
                  <p className="text-xl font-bold">{reportData.totalBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <BarChart className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ocupação</p>
                  <p className="text-xl font-bold">{reportData.averageOccupancy}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Crescimento</p>
                  <p className="text-xl font-bold">+{reportData.customerGrowth}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Relatórios detalhados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5" />
              Relatórios Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {/* Implementar */}}
            >
              <Calendar className="w-4 h-4 mr-3" />
              Relatório de Ocupação
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {/* Implementar */}}
            >
              <DollarSign className="w-4 h-4 mr-3" />
              Relatório Financeiro
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {/* Implementar */}}
            >
              <Users className="w-4 h-4 mr-3" />
              Relatório de Clientes
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {/* Implementar */}}
            >
              <TrendingUp className="w-4 h-4 mr-3" />
              Análise de Performance
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation userType="manager" />
    </div>
  );
};

export default ManagerReports;
