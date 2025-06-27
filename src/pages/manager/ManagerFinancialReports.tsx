
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
  BarChart3,
  Download,
  Eye
} from "lucide-react";
import { useRevenue } from "@/hooks/useRevenue";
import BottomNavigation from "@/components/navigation/BottomNavigation";

const ManagerFinancialReports = () => {
  const navigate = useNavigate();
  const { getManagerRevenue, revenueData } = useRevenue();
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  
  // Simulando ID do gestor logado (seria vindo do contexto de autenticação)
  const currentManagerId = 'manager-1';
  const managerRevenue = getManagerRevenue(currentManagerId);

  const periods = [
    { key: 'monthly', label: 'Mensal' },
    { key: 'quarterly', label: 'Trimestral' },
    { key: 'yearly', label: 'Anual' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B] pb-20">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/gestor/dashboard')}
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Receita Total</p>
                  <p className="text-xl font-bold text-white">
                    R$ {managerRevenue.totalRevenue.toLocaleString()}
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
                  <p className="text-white/70 text-sm">Agendamentos</p>
                  <p className="text-xl font-bold text-white">
                    {managerRevenue.totalBookings}
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
                  <p className="text-white/70 text-sm">Crescimento</p>
                  <p className="text-xl font-bold text-white">
                    {managerRevenue.averageGrowth > 0 ? '+' : ''}{managerRevenue.averageGrowth.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#F35410]/20 rounded-lg">
                  <Building className="w-5 h-5 text-[#F35410]" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Quadras</p>
                  <p className="text-xl font-bold text-white">
                    {managerRevenue.courts.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance by Court */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Desempenho por Quadra
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {managerRevenue.courts.map((court) => (
              <div key={court.courtId} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-white font-medium">{court.courtName}</p>
                    <p className="text-white/70 text-sm">{court.totalBookings} agendamentos</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-white font-semibold">R$ {court.monthlyRevenue.toLocaleString()}</p>
                    <div className="flex items-center gap-1">
                      {court.growth > 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-400" />
                      ) : (
                        <TrendingUp className="w-3 h-3 text-red-400 rotate-180" />
                      )}
                      <span className={`text-xs ${court.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {court.growth > 0 ? '+' : ''}{court.growth.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
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
              Relatório Mensal (PDF)
            </Button>
            <Button variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10">
              <Download className="w-4 h-4 mr-3" />
              Dados Financeiros (Excel)
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation userType="manager" />
    </div>
  );
};

export default ManagerFinancialReports;
