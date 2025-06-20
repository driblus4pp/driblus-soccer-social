import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, Trophy, MapPin, Edit, LogOut, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "@/components/navigation/BottomNavigation";
const ClientProfile = () => {
  const navigate = useNavigate();
  const {
    user,
    logout
  } = useAuth();
  const playerStats = {
    totalGames: 45,
    wins: 28,
    goals: 67,
    assists: 23
  };
  return <div className="min-h-screen bg-[#093758] pb-20">
      {/* Header */}
      <div className="px-4 py-6 bg-[#093758]">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/cliente/dashboard')} className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-white">Meu Perfil</h1>
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Perfil do Usuário */}
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 bg-[#F35410] rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">
                  {user?.name || 'Janderson Silva'}
                </h2>
                <p className="text-white/70">{user?.email || 'janderson@email.com'}</p>
                <Badge className="bg-[#F35410] text-white mt-2">
                  Jogador Ativo
                </Badge>
              </div>
              <Button variant="outline" size="icon" className="border-white/20 text-zinc-950 rounded-full bg-zinc-100">
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas do Jogador */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Estatísticas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#F35410]">{playerStats.totalGames}</p>
                <p className="text-sm text-white/70">Jogos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#F35410]">{playerStats.wins}</p>
                <p className="text-sm text-white/70">Vitórias</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#F35410]">{playerStats.goals}</p>
                <p className="text-sm text-white/70">Gols</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#F35410]">{playerStats.assists}</p>
                <p className="text-sm text-white/70">Assistências</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Atividade Recente */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">Vitória no No Alvo Society</p>
                <p className="text-sm text-white/70">Há 2 dias</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">Nova quadra favorita</p>
                <p className="text-sm text-white/70">Gol de Placa • Há 1 semana</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações */}
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4 space-y-3">
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
              <User className="w-4 h-4 mr-3" />
              Editar Perfil
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
              <Calendar className="w-4 h-4 mr-3" />
              Histórico de Reservas
            </Button>
            <Button variant="ghost" onClick={logout} className="w-full justify-start text-red-400 hover:bg-red-500/10">
              <LogOut className="w-4 h-4 mr-3" />
              Sair da Conta
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation userType="client" />
    </div>;
};
export default ClientProfile;