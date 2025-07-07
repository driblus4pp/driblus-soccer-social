
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Building,
  Users,
  BarChart3,
  Download
} from "lucide-react";
import { useRevenue } from "@/hooks/useRevenue";
import { useManagers } from "@/hooks/useManagers";
import { useCourts } from "@/hooks/useCourts";
import BottomNavigation from "@/components/navigation/BottomNavigation";

const AdminReports = () => {
  const navigate = useNavigate();
  const { getPlatformRevenue } = useRevenue();
  const { getAllManagersStats } = useManagers();
  const { courts } = useCourts();
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

  const platformRevenue = getPlatformRevenue();
  const managersStats = getAllManagersStats();

  const periods = [
    { key: 'monthly', label: 'Mensal' },
    { key: 'quarterly', label: 'Trimestral' },
    { key: 'yearly', label: 'Anual' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Padronizado */}
      <div className="bg-gradient-to-r from-[#062B4B] to-[#0A3B5C] text-white p-6">
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
            <h1 className="text-2xl font-bold text-white">Relatórios Financeiros</h1>
            <p className="text-white/80 text-sm mt-1">Acompanhe o desempenho da plataforma</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Period Selection */}
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

        {/* Revenue Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Receita Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {platformRevenue.totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Receita Mensal</p>
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {platformRevenue.monthlyRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Ticket Médio</p>
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {platformRevenue.averageBookingValue.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-[#F35410]" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Agendamentos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {platformRevenue.totalBookings}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Courts */}
        <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Building className="w-5 h-5" />
              Top 5 Quadras por Receita
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {platformRevenue.topPerformingCourts.map((court, index) => (
              <div key={court.courtId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Badge className={`${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-blue-500'} text-white`}>
                    #{index + 1}
                  </Badge>
                  <div>
                    <p className="text-gray-900 font-medium">{court.courtName}</p>
                    <p className="text-gray-500 text-sm">Gestor: {court.managerName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-900 font-semibold">R$ {court.monthlyRevenue.toLocaleString()}</p>
                  <p className="text-gray-500 text-sm">{court.totalBookings} agendamentos</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Revenue by Manager */}
        <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Receita por Gestor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {platformRevenue.revenueByManager.map((manager) => (
              <div key={manager.managerId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                <div>
                  <p className="text-gray-900 font-medium">{manager.managerName}</p>
                  <p className="text-gray-500 text-sm">{manager.courts} quadra(s)</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-900 font-semibold">R$ {manager.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Export Actions */}
        <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Exportar Relatórios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start border-gray-200 text-gray-700 hover:bg-gray-50">
              <Download className="w-4 h-4 mr-3" />
              Relatório Completo (PDF)
            </Button>
            <Button variant="outline" className="w-full justify-start border-gray-200 text-gray-700 hover:bg-gray-50">
              <Download className="w-4 h-4 mr-3" />
              Dados Financeiros (Excel)
            </Button>
            <Button variant="outline" className="w-full justify-start border-gray-200 text-gray-700 hover:bg-gray-50">
              <Download className="w-4 h-4 mr-3" />
              Relatório de Gestores (CSV)
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation userType="admin" />
    </div>
  );
};

export default AdminReports;
