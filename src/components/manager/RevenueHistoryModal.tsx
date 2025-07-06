
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TrendingUp, TrendingDown, Calendar, DollarSign, BarChart3 } from "lucide-react";

interface RevenueMonth {
  month: string;
  revenue: number;
  bookings: number;
  growth: number;
}

interface RevenueHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  revenueHistory: RevenueMonth[];
}

const RevenueHistoryModal = ({ isOpen, onClose, revenueHistory }: RevenueHistoryModalProps) => {
  const totalRevenue = revenueHistory.reduce((sum, month) => sum + month.revenue, 0);
  const averageRevenue = totalRevenue / revenueHistory.length || 0;
  const totalBookings = revenueHistory.reduce((sum, month) => sum + month.bookings, 0);

  const maxRevenue = Math.max(...revenueHistory.map(m => m.revenue));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#F35410]" />
            Histórico de Receita (6 meses)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo Geral */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-600">R$ {totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Receita Total</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-blue-600">R$ {Math.round(averageRevenue).toLocaleString()}</p>
              <p className="text-sm text-gray-600">Média Mensal</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-purple-600">{totalBookings}</p>
              <p className="text-sm text-gray-600">Total de Reservas</p>
            </div>
          </div>

          {/* Gráfico Simples */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Evolução Mensal</h3>
            <div className="space-y-3">
              {revenueHistory.map((month, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{month.month}</span>
                    <div className="flex items-center gap-2">
                      {month.growth > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : month.growth < 0 ? (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      ) : null}
                      <span className={`text-sm font-medium ${
                        month.growth > 0 ? 'text-green-600' : 
                        month.growth < 0 ? 'text-red-600' : 
                        'text-gray-600'
                      }`}>
                        {month.growth > 0 ? '+' : ''}{month.growth.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-[#F35410]">
                      R$ {month.revenue.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-600">
                      {month.bookings} reservas
                    </span>
                  </div>
                  
                  {/* Barra visual */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#F35410] h-2 rounded-full"
                      style={{
                        width: `${maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RevenueHistoryModal;
