
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Users, 
  Search, 
  Building, 
  DollarSign, 
  Calendar,
  Star,
  Shield,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail
} from "lucide-react";
import { useManagers } from "@/hooks/useManagers";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";

const AdminManagers = () => {
  const navigate = useNavigate();
  const { managers, getManagerStats, getAllManagersStats } = useManagers();
  const { pendingApprovalsCount } = useAdminNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'verified' | 'unverified'>('all');

  const stats = getAllManagersStats();

  const filteredManagers = managers.filter(manager => {
    const matchesSearch = manager.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         manager.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'verified' && manager.isVerified) ||
                         (filter === 'unverified' && !manager.isVerified);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B]">
      {/* Header Minimalista */}
      <div className="bg-white/5 backdrop-blur-md border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
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
              <h1 className="text-xl font-bold text-white">Gestores</h1>
              <p className="text-white/70 text-sm">Gerencie gestores da plataforma</p>
            </div>
          </div>
          
          {pendingApprovalsCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {pendingApprovalsCount} pendentes
            </Badge>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Stats Overview Minimalista */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="text-center">
                <Users className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                <p className="text-white/70 text-xs">Total</p>
                <p className="text-xl font-bold text-white">{stats.totalManagers}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="text-center">
                <Shield className="w-5 h-5 text-green-400 mx-auto mb-2" />
                <p className="text-white/70 text-xs">Verificados</p>
                <p className="text-xl font-bold text-white">{stats.verifiedManagers}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="text-center">
                <DollarSign className="w-5 h-5 text-[#F35410] mx-auto mb-2" />
                <p className="text-white/70 text-xs">Receita</p>
                <p className="text-lg font-bold text-white">R$ {(stats.totalRevenue / 1000).toFixed(0)}k</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="text-center">
                <Calendar className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                <p className="text-white/70 text-xs">Agendamentos</p>
                <p className="text-xl font-bold text-white">{stats.totalBookings}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search e Filters Minimalistas */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
            <Input
              placeholder="Buscar gestores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-[#F35410]"
            />
          </div>
          
          <div className="flex gap-2">
            {['all', 'verified', 'unverified'].map((filterType) => (
              <Button
                key={filterType}
                variant={filter === filterType ? 'default' : 'outline'}
                onClick={() => setFilter(filterType as any)}
                className={
                  filter === filterType 
                    ? 'bg-[#F35410] hover:bg-[#BA2D0B] text-white' 
                    : 'border-white/20 text-white hover:bg-white/10'
                }
                size="sm"
              >
                {filterType === 'all' ? 'Todos' : filterType === 'verified' ? 'Verificados' : 'Pendentes'}
              </Button>
            ))}
          </div>
        </div>

        {/* Lista de Gestores Minimalista */}
        <div className="space-y-3">
          {filteredManagers.length === 0 ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <p className="text-white/70">Nenhum gestor encontrado</p>
              </CardContent>
            </Card>
          ) : (
            filteredManagers.map((manager) => {
              const managerStats = getManagerStats(manager.id);
              return (
                <Card key={manager.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      {/* Info Principal */}
                      <div className="flex items-center gap-4 flex-1">
                        <img
                          src={manager.avatar}
                          alt={manager.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-semibold">{manager.name}</h3>
                            {manager.isVerified ? (
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verificado
                              </Badge>
                            ) : (
                              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Pendente
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-white/60">
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              <span>{manager.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              <span>{manager.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stats Rápidas */}
                      {managerStats && (
                        <div className="flex gap-6 text-center">
                          <div>
                            <p className="text-xs text-white/60">Quadras</p>
                            <p className="text-white font-bold">{managerStats.totalCourts}</p>
                          </div>
                          <div>
                            <p className="text-xs text-white/60">Receita</p>
                            <p className="text-white font-bold">R$ {(managerStats.totalRevenue / 1000).toFixed(0)}k</p>
                          </div>
                          <div>
                            <p className="text-xs text-white/60">Avaliação</p>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <p className="text-white font-bold">{managerStats.averageRating.toFixed(1)}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Data de Cadastro */}
                    <div className="mt-3 pt-3 border-t border-white/10 text-xs text-white/50">
                      Membro desde {manager.createdAt.toLocaleDateString()}
                      {manager.lastLogin && (
                        <span className="ml-4">• Último acesso: {manager.lastLogin.toLocaleDateString()}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminManagers;
