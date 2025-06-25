
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Building2, Calendar, Settings, Edit, LogOut, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "@/components/navigation/BottomNavigation";

const ManagerProfile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const managerStats = {
    courtName: 'No Alvo Society',
    totalBookings: 156,
    monthlyRevenue: 15400,
    customerRating: 4.8
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
          <h1 className="text-xl font-semibold">Meu Perfil</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Perfil do Gestor */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 bg-[#F35410] rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{user?.name || 'Carlos Silva'}</h2>
                <p className="text-gray-600">{user?.email || 'carlos@email.com'}</p>
                <Badge className="bg-[#F35410] text-white mt-2">
                  Gestor Aprovado
                </Badge>
              </div>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => navigate('/gestor/perfil/editar')}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Informações da Quadra */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Quadra Gerenciada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-lg">{managerStats.courtName}</p>
                <p className="text-gray-600">Aldeota, Fortaleza - CE</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#F35410]">{managerStats.totalBookings}</p>
                  <p className="text-sm text-gray-600">Reservas este mês</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#F35410]">{managerStats.customerRating}</p>
                  <p className="text-sm text-gray-600">Avaliação</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Receita Mensal</span>
                <span className="font-bold text-green-600">R$ {managerStats.monthlyRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Taxa de Ocupação</span>
                <span className="font-bold text-blue-600">78%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Clientes Ativos</span>
                <span className="font-bold text-purple-600">89</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => navigate('/gestor/perfil/editar')}
            >
              <User className="w-4 h-4 mr-3" />
              Editar Perfil
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => navigate('/gestor/quadra/configuracoes')}
            >
              <Building2 className="w-4 h-4 mr-3" />
              Configurações da Quadra
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => navigate('/gestor/preferencias')}
            >
              <Settings className="w-4 h-4 mr-3" />
              Preferências
            </Button>
            <Button 
              variant="ghost" 
              onClick={logout}
              className="w-full justify-start text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sair da Conta
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation userType="manager" />
    </div>
  );
};

export default ManagerProfile;
