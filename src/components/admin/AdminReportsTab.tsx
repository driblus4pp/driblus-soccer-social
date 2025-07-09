import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Download,
  Building,
  Users,
  Star,
  Activity
} from "lucide-react";
import { useRevenue } from "@/hooks/useRevenue";
import { useCourts } from "@/hooks/useCourts";
import { useUsers } from "@/hooks/useUsers";

const AdminReportsTab = () => {
  const { getPlatformRevenue } = useRevenue();
  const { courts } = useCourts();
  const { users } = useUsers();
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');

  const platformRevenue = getPlatformRevenue();

  const reportData = {
    revenue: {
      current: platformRevenue.monthlyRevenue,
      previous: platformRevenue.monthlyRevenue * 0.85,
      growth: 15.2
    },
    bookings: {
      current: platformRevenue.totalBookings,
      previous: Math.floor(platformRevenue.totalBookings * 0.88),
      growth: 12.5
    },
    users: {
      current: users.length,
      previous: Math.floor(users.length * 0.92),
      growth: 8.7
    },
    courts: {
      current: courts.length,
      previous: Math.floor(courts.length * 0.95),
      growth: 5.3
    }
  };

  const topCourts = courts
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  const handleExportReport = (format: 'pdf' | 'excel' | 'csv') => {
    console.log(`Exporting report as ${format}`);
  };

  const periods = [
    { key: 'weekly', label: 'Semanal' },
    { key: 'monthly', label: 'Mensal' },
    { key: 'yearly', label: 'Anual' }
  ];

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex gap-2">
        {periods.map((period) => (
          <Button
            key={period.key}
            variant={selectedPeriod === period.key ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod(period.key as any)}
            className={selectedPeriod === period.key ? 
              'bg-[#F35410] hover:bg-[#BA2D0B] border-[#F35410]' : 
              'border-gray-200 text-gray-700 hover:bg-gray-50'
            }
            size="sm"
          >
            {period.label}
          </Button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Receita Total</p>
                  <p className="text-2xl font-bold text-gray-900">R$ {reportData.revenue.current.toLocaleString()}</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">
                +{reportData.revenue.growth}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Reservas</p>
                  <p className="text-2xl font-bold text-gray-900">{reportData.bookings.current}</p>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-800">
                +{reportData.bookings.growth}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuários</p>
                  <p className="text-2xl font-bold text-gray-900">{reportData.users.current}</p>
                </div>
              </div>
              <Badge className="bg-purple-100 text-purple-800">
                +{reportData.users.growth}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Building className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Quadras</p>
                  <p className="text-2xl font-bold text-gray-900">{reportData.courts.current}</p>
                </div>
              </div>
              <Badge className="bg-orange-100 text-orange-800">
                +{reportData.courts.growth}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Receita por Período
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <Activity className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-600">Gráfico de receita por período</p>
              <p className="text-sm text-gray-500">Implementação futura com biblioteca de gráficos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Courts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Top 5 Quadras (Melhor Avaliadas)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topCourts.map((court, index) => (
              <div key={court.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className={`${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-orange-600' : 
                    'bg-blue-500'
                  } text-white`}>
                    #{index + 1}
                  </Badge>
                  <div>
                    <p className="font-medium text-gray-900">{court.name}</p>
                    <p className="text-sm text-gray-600">{court.location.city}, {court.location.state}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold text-gray-900">{court.rating}</span>
                  </div>
                  <p className="text-sm text-gray-600">{court.totalReviews} avaliações</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue by Manager */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Receita por Gestor (Simulado)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {platformRevenue.revenueByManager.map((manager) => (
              <div key={manager.managerId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{manager.managerName}</p>
                  <p className="text-sm text-gray-600">{manager.courts} quadra(s)</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">R$ {manager.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exportar Relatórios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              onClick={() => handleExportReport('pdf')}
              className="justify-start border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Relatório PDF
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleExportReport('excel')}
              className="justify-start border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Planilha Excel
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleExportReport('csv')}
              className="justify-start border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Dados CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReportsTab;