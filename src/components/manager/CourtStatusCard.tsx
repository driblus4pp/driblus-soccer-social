import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  Calendar,
  DollarSign,
  Star,
  AlertTriangle,
  Users,
  Settings
} from "lucide-react";

interface CourtStatusCardProps {
  status: 'active' | 'pending' | 'inactive';
  monthlyBookings: number;
  monthlyRevenue: number;
  averageRating: number;
  totalReviews: number;
  onConfigureSettings: () => void;
}

const CourtStatusCard = ({ 
  status, 
  monthlyBookings, 
  monthlyRevenue, 
  averageRating, 
  totalReviews,
  onConfigureSettings 
}: CourtStatusCardProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          badge: 'bg-green-600 text-white',
          title: 'Quadra Aprovada',
          description: 'Disponível para reservas',
          alert: null
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          badge: 'bg-yellow-600 text-white',
          title: 'Aguardando Aprovação',
          description: 'Análise em andamento',
          alert: 'Sua quadra está sendo analisada pela equipe. Você receberá uma notificação quando aprovada.'
        };
      case 'inactive':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          badge: 'bg-red-600 text-white',
          title: 'Quadra Inativa',
          description: 'Não está recebendo reservas',
          alert: 'Sua quadra está desativada. Entre em contato com o suporte para mais informações.'
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          badge: 'bg-gray-600 text-white',
          title: 'Status Desconhecido',
          description: 'Verificar configurações',
          alert: null
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <Card className={`${config.bgColor} ${config.borderColor} border-2`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusIcon className={`w-5 h-5 ${config.color}`} />
            <span className="text-gray-900">Status da Quadra</span>
          </div>
          <Badge className={config.badge}>
            {status === 'active' ? 'Ativa' : 
             status === 'pending' ? 'Pendente' : 'Inativa'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Principal */}
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
          <StatusIcon className={`w-6 h-6 ${config.color}`} />
          <div>
            <p className={`font-semibold ${config.color}`}>{config.title}</p>
            <p className="text-sm text-gray-600">{config.description}</p>
          </div>
        </div>

        {/* Alerta se houver */}
        {config.alert && (
          <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <p className="text-sm text-yellow-800">{config.alert}</p>
          </div>
        )}

        {/* Métricas Principais */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-white rounded-lg">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold text-blue-800">{monthlyBookings}</p>
            <p className="text-sm text-blue-600">Reservas este mês</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold text-green-800">R$ {monthlyRevenue.toLocaleString()}</p>
            <p className="text-sm text-green-600">Receita mensal</p>
          </div>
        </div>

        {/* Avaliações */}
        <div className="p-4 bg-white rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="font-semibold text-gray-900">{averageRating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{totalReviews} avaliações</span>
            </div>
          </div>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= averageRating 
                    ? 'text-yellow-500 fill-current' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Botão de Configurações */}
        <Button 
          onClick={onConfigureSettings}
          variant="outline"
          className="w-full mt-4 border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <Settings className="w-4 h-4 mr-2" />
          Configurar Quadra
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourtStatusCard;