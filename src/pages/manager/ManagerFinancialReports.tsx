
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRevenue } from "@/hooks/useRevenue";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import PeriodSelector from "@/components/manager/PeriodSelector";
import RevenueOverviewCards from "@/components/manager/RevenueOverviewCards";
import CourtPerformanceSection from "@/components/manager/CourtPerformanceSection";
import ExportSection from "@/components/manager/ExportSection";

const ManagerFinancialReports = () => {
  const navigate = useNavigate();
  const { getManagerRevenue } = useRevenue();
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  
  // Simulando ID do gestor logado (seria vindo do contexto de autenticação)
  const currentManagerId = 'manager-1';
  const managerRevenue = getManagerRevenue(currentManagerId);

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
        <PeriodSelector 
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />

        {/* Revenue Overview */}
        <RevenueOverviewCards managerRevenue={managerRevenue} />

        {/* Performance by Court */}
        <CourtPerformanceSection courts={managerRevenue.courts} />

        {/* Export Actions */}
        <ExportSection />
      </div>

      <BottomNavigation userType="manager" />
    </div>
  );
};

export default ManagerFinancialReports;
