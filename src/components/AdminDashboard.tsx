
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Building, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  BarChart3,
  Shield,
  Settings
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { PlatformStats } from '@/types';

const AdminDashboard = () => {
  const { user, getPlatformStats } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<PlatformStats | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      const platformStats = await getPlatformStats();
      setStats(platformStats);
    };
    loadStats();
  }, [getPlatformStats]);

  const pendingApprovals = [
    {
      id: 1,
      type: 'court',
      name: 'Arena Sports Center',
      owner: 'Carlos Mendes',
      date: '2024-06-19',
      location: 'São Paulo, SP'
    },
    {
      id: 2,
      type: 'user',
      name: 'Roberto Silva',
      email: 'roberto@email.com',
      role: 'court_manager',
      date: '2024-06-18'
    }
  ];

  const recentComplaints = [
    {
      id: 1,
      user: 'Ana Santos',
      subject: 'Problema com pagamento',
      status: 'open',
      priority: 'high',
      date: '2024-06-19'
    },
    {
      id: 2,
      user: 'Pedro Costa',
      subject: 'Quadra não estava disponível',
      status: 'in_progress',
      priority: 'medium',
      date: '2024-06-18'
    }
  ];

  const topCourts = [
    {
      id: 1,
      name: 'Arena Pro Sports',
      owner: 'João Silva',
      bookings: 156,
      revenue: 18720,
      rating: 4.9,
      city: 'Fortaleza'
    },
    {
      id: 2,
      name: 'Campo do Dragão',
      owner: 'Maria Costa',
      bookings: 134,
      revenue: 16080,
      rating: 4.7,
      city: 'São Paulo'
    }
  ];

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B] flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Painel Administrativo</h1>
            <p className="text-white/70">Gestão completa da plataforma Driblus</p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-[#F35410] hover:bg-[#BA2D0B] text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Relatórios
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/10 border-white/20">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-[#F35410]">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="users" className="text-white data-[state=active]:bg-[#F35410]">
              Usuários
            </TabsTrigger>
            <TabsTrigger value="courts" className="text-white data-[state=active]:bg-[#F35410]">
              Quadras
            </TabsTrigger>
            <TabsTrigger value="approvals" className="text-white data-[state=active]:bg-[#F35410]">
              Aprovações
            </TabsTrigger>
            <TabsTrigger value="support" className="text-white data-[state=active]:bg-[#F35410]">
              Suporte
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <Users className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Usuários Totais</p>
                      <p className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
                      <p className="text-green-400 text-xs">+{stats.growthRate}% este mês</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#F35410]/20 rounded-lg">
                      <Building className="w-6 h-6 text-[#F35410]" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Quadras Ativas</p>
                      <p className="text-2xl font-bold text-white">{stats.totalCourts}</p>
                      <p className="text-orange-400 text-xs">{stats.pendingApprovals} pendentes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <DollarSign className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Receita Mensal</p>
                      <p className="text-2xl font-bold text-white">R$ {stats.monthlyRevenue.toLocaleString()}</p>
                      <p className="text-green-400 text-xs">+15% vs mês anterior</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                      <Calendar className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Agendamentos</p>
                      <p className="text-2xl font-bold text-white">{stats.totalBookings.toLocaleString()}</p>
                      <p className="text-purple-400 text-xs">{stats.activeUsers} usuários ativos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Courts */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Quadras com Melhor Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topCourts.map(court => (
                  <div key={court.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{court.name}</h4>
                      <p className="text-white/70 text-sm">{court.owner} • {court.city}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-white/70 text-sm">{court.rating}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">R$ {court.revenue.toLocaleString()}</p>
                      <p className="text-white/70 text-sm">{court.bookings} agendamentos</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-white/60" />
              <h3 className="text-xl font-semibold text-white mb-2">Gestão de Usuários</h3>
              <p className="text-white/70">Visualize e gerencie todos os usuários da plataforma</p>
            </div>
          </TabsContent>

          <TabsContent value="courts" className="space-y-6">
            <div className="text-center py-12">
              <Building className="w-16 h-16 mx-auto mb-4 text-white/60" />
              <h3 className="text-xl font-semibold text-white mb-2">Gestão de Quadras</h3>
              <p className="text-white/70">Monitore e aprove novas quadras na plataforma</p>
            </div>
          </TabsContent>

          <TabsContent value="approvals" className="space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Aprovações Pendentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingApprovals.map(approval => (
                  <div key={approval.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="border-orange-500 text-orange-400">
                          {approval.type === 'court' ? 'Quadra' : 'Usuário'}
                        </Badge>
                        <span className="text-white font-medium">{approval.name}</span>
                      </div>
                      <p className="text-white/70 text-sm">
                        {approval.type === 'court' 
                          ? `Por ${approval.owner} • ${approval.location}`
                          : `${approval.email} • Gestor de quadra`
                        }
                      </p>
                      <p className="text-white/60 text-xs">{approval.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/20">
                        Rejeitar
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Aprovar
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Reclamações Recentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentComplaints.map(complaint => (
                  <div key={complaint.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant="outline" 
                          className={`border-${complaint.priority === 'high' ? 'red' : complaint.priority === 'medium' ? 'yellow' : 'blue'}-500 text-${complaint.priority === 'high' ? 'red' : complaint.priority === 'medium' ? 'yellow' : 'blue'}-400`}
                        >
                          {complaint.priority === 'high' ? 'Alta' : complaint.priority === 'medium' ? 'Média' : 'Baixa'}
                        </Badge>
                        <span className="text-white font-medium">{complaint.subject}</span>
                      </div>
                      <p className="text-white/70 text-sm">{complaint.user}</p>
                      <p className="text-white/60 text-xs">{complaint.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className={`${
                          complaint.status === 'open' 
                            ? 'bg-red-600 text-white' 
                            : complaint.status === 'in_progress'
                            ? 'bg-yellow-600 text-white'
                            : 'bg-green-600 text-white'
                        }`}
                      >
                        {complaint.status === 'open' ? 'Aberta' : complaint.status === 'in_progress' ? 'Em Andamento' : 'Resolvida'}
                      </Badge>
                      <Button size="sm" className="bg-[#F35410] hover:bg-[#BA2D0B] text-white">
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
