
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
    <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B]">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/dashboard')}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-white">Relatórios Financeiros</h1>
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
                'bg-[#F35410] hover:bg-[#BA2D0B]' : 
                'border-white/20 text-white hover:bg-white/10'
              }
              size="sm"
            >
              {period.label}
            </Button>
          ))}
        </div>

        {/* Revenue Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Receita Total</p>
                  <p className="text-xl font-bold text-white">
                    R$ {platformRevenue.totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Receita Mensal</p>
                  <p className="text-xl font-bold text-white">
                    R$ {platformRevenue.monthlyRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Ticket Médio</p>
                  <p className="text-xl font-bold text-white">
                    R$ {platformRevenue.averageBookingValue.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#F35410]/20 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-[#F35410]" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Agendamentos</p>
                  <p className="text-xl font-bold text-white">
                    {platformRevenue.totalBookings}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Courts */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Building className="w-5 h-5" />
              Top 5 Quadras por Receita
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {platformRevenue.topPerformingCourts.map((court, index) => (
              <div key={court.courtId} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className={`${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-blue-500'} text-white`}>
                    #{index + 1}
                  </Badge>
                  <div>
                    <p className="text-white font-medium">{court.courtName}</p>
                    <p className="text-white/70 text-sm">Gestor: {court.managerName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">R$ {court.monthlyRevenue.toLocaleString()}</p>
                  <p className="text-white/70 text-sm">{court.totalBookings} agendamentos</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Revenue by Manager */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              Receita por Gestor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {platformRevenue.revenueByManager.map((manager) => (
              <div key={manager.managerId} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">{manager.managerName}</p>
                  <p className="text-white/70 text-sm">{manager.courts} quadra(s)</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">R$ {manager.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Export Actions */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Download className="w-5 h-5" />
              Exportar Relatórios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10">
              <Download className="w-4 h-4 mr-3" />
              Relatório Completo (PDF)
            </Button>
            <Button variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10">
              <Download className="w-4 h-4 mr-3" />
              Dados Financeiros (Excel)
            </Button>
            <Button variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10">
              <Download className="w-4 h-4 mr-3" />
              Relatório de Gestores (CSV)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReports;
