
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
  Eye,
  Shield,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useManagers } from "@/hooks/useManagers";

const AdminManagers = () => {
  const navigate = useNavigate();
  const { managers, getManagerStats, getAllManagersStats } = useManagers();
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
          <h1 className="text-xl font-bold text-white">Gestão de Gestores</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Total Gestores</p>
                  <p className="text-xl font-bold text-white">{stats.totalManagers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Verificados</p>
                  <p className="text-xl font-bold text-white">{stats.verifiedManagers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#F35410]/20 rounded-lg">
                  <DollarSign className="w-5 h-5 text-[#F35410]" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Receita Total</p>
                  <p className="text-xl font-bold text-white">R$ {stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Agendamentos</p>
                  <p className="text-xl font-bold text-white">{stats.totalBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar gestores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-[#F35410] hover:bg-[#BA2D0B]' : 'border-white/20 text-white hover:bg-white/10'}
              size="sm"
            >
              Todos
            </Button>
            <Button
              variant={filter === 'verified' ? 'default' : 'outline'}
              onClick={() => setFilter('verified')}
              className={filter === 'verified' ? 'bg-[#F35410] hover:bg-[#BA2D0B]' : 'border-white/20 text-white hover:bg-white/10'}
              size="sm"
            >
              Verificados
            </Button>
            <Button
              variant={filter === 'unverified' ? 'default' : 'outline'}
              onClick={() => setFilter('unverified')}
              className={filter === 'unverified' ? 'bg-[#F35410] hover:bg-[#BA2D0B]' : 'border-white/20 text-white hover:bg-white/10'}
              size="sm"
            >
              Não Verificados
            </Button>
          </div>
        </div>

        {/* Managers List */}
        <div className="space-y-4">
          {filteredManagers.length === 0 ? (
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/70">Nenhum gestor encontrado</p>
              </CardContent>
            </Card>
          ) : (
            filteredManagers.map((manager) => {
              const managerStats = getManagerStats(manager.id);
              return (
                <Card key={manager.id} className="bg-white/10 border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={manager.avatar}
                          alt={manager.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-white font-semibold">{manager.name}</h3>
                          <p className="text-white/70 text-sm">{manager.email}</p>
                          <p className="text-white/60 text-xs">{manager.phone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {manager.isVerified ? (
                          <Badge className="bg-green-500 text-white">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verificado
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-500 text-white">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Não Verificado
                          </Badge>
                        )}
                      </div>
                    </div>

                    {managerStats && (
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-white/70 text-sm">
                            <Building className="w-3 h-3" />
                            <span>Quadras</span>
                          </div>
                          <p className="text-white font-semibold">{managerStats.totalCourts}</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-white/70 text-sm">
                            <DollarSign className="w-3 h-3" />
                            <span>Receita</span>
                          </div>
                          <p className="text-white font-semibold">R$ {managerStats.totalRevenue.toLocaleString()}</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-white/70 text-sm">
                            <Calendar className="w-3 h-3" />
                            <span>Agendamentos</span>
                          </div>
                          <p className="text-white font-semibold">{managerStats.monthlyBookings}</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-white/70 text-sm">
                            <Star className="w-3 h-3" />
                            <span>Avaliação</span>
                          </div>
                          <p className="text-white font-semibold">{managerStats.averageRating.toFixed(1)}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-xs text-white/60">
                      <span>Membro desde: {manager.createdAt.toLocaleDateString()}</span>
                      <span>Último acesso: {manager.lastLogin?.toLocaleDateString()}</span>
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
