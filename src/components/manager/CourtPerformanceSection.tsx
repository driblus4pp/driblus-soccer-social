
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3,
  TrendingUp,
  Eye
} from "lucide-react";

interface CourtData {
  courtId: string;
  courtName: string;
  totalBookings: number;
  monthlyRevenue: number;
  growth: number;
}

interface CourtPerformanceSectionProps {
  courts: CourtData[];
}

const CourtPerformanceSection = ({ courts }: CourtPerformanceSectionProps) => {
  return (
    <Card className="bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Desempenho por Quadra
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {courts.map((court) => (
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
  );
};

export default CourtPerformanceSection;
