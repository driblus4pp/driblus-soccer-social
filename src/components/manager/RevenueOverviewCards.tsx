
import { Card, CardContent } from "@/components/ui/card";
import { 
  DollarSign, 
  Calendar,
  Building,
  TrendingUp
} from "lucide-react";

interface ManagerRevenue {
  totalRevenue: number;
  totalBookings: number;
  averageGrowth: number;
  courts: any[];
}

interface RevenueOverviewCardsProps {
  managerRevenue: ManagerRevenue;
}

const RevenueOverviewCards = ({ managerRevenue }: RevenueOverviewCardsProps) => {
  return (
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
  );
};

export default RevenueOverviewCards;
