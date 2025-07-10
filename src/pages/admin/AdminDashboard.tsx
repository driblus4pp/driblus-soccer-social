import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Building, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import AdminUsersTab from "@/components/admin/AdminUsersTab";
import AdminCourtsTab from "@/components/admin/AdminCourtsTab";
import AdminReportsTab from "@/components/admin/AdminReportsTab";
import AdminBookingsOverview from "@/components/admin/AdminBookingsOverview";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isLoading, getPlatformStats } = useAuth();
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Debug logs
  console.log('AdminDashboard - Current user:', user);
  console.log('AdminDashboard - User role:', user?.role);
  console.log('AdminDashboard - Is loading:', isLoading);
  console.log('AdminDashboard - UserRole.ADMIN:', UserRole.ADMIN);

  // Verificação de autenticação corrigida
  useEffect(() => {
    console.log('AdminDashboard - useEffect triggered');
    
    if (!user && !isLoading) {
      console.log('AdminDashboard - No user and not loading, redirecting to login');
      navigate('/admin/login');
    } else if (user && user.role !== UserRole.ADMIN) {
      console.log('AdminDashboard - User exists but role is not admin:', user.role, 'Expected:', UserRole.ADMIN);
      navigate('/');
    } else if (user && user.role === UserRole.ADMIN) {
      console.log('AdminDashboard - Admin user authenticated successfully');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    const loadStats = async () => {
      const platformStats = await getPlatformStats();
      setStats(platformStats);
    };

    loadStats();
  }, [getPlatformStats]);

  // Mock data if stats are not loaded yet
  const mockStats = {
    totalUsers: 1247,
    totalCourts: 89,
    totalBookings: 3421,
    monthlyRevenue: 245600,
    activeUsers: 892,
    pendingApprovals: 12,
    averageRating: 4.6,
    growthRate: 23.5
  };

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  // Não renderizar se não estiver autenticado
  if (!user && !isLoading) {
    console.log('AdminDashboard - Rendering null, no user and not loading');
    return null;
  }

  if (isLoading) {
    console.log('AdminDashboard - Rendering loading state');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (user && user.role !== UserRole.ADMIN) {
    console.log('AdminDashboard - User exists but not admin, should redirect');
    return null;
  }

  console.log('AdminDashboard - Rendering main dashboard');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#062B4B] to-[#0A3B5C] text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard Administrativo</h1>
            <p className="text-white/80">Gerencie toda a plataforma Driblus</p>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-white hover:bg-white/20">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)} className="space-y-4">
          <TabsList className="bg-white border border-gray-200 rounded-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">Visão Geral</TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">Agendamentos</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">Usuários</TabsTrigger>
            <TabsTrigger value="courts" className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">Quadras</TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">Relatórios</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Total de Usuários</p>
                      <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || mockStats.totalUsers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Building className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Total de Quadras</p>
                      <p className="text-2xl font-bold text-gray-900">{stats?.totalCourts || mockStats.totalCourts}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Calendar className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Total de Reservas</p>
                      <p className="text-2xl font-bold text-gray-900">{stats?.totalBookings || mockStats.totalBookings}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <DollarSign className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Receita Mensal</p>
                      <p className="text-2xl font-bold text-gray-900">R$ {stats?.monthlyRevenue?.toLocaleString() || mockStats.monthlyRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Taxa de Crescimento</p>
                      <p className="text-2xl font-bold text-gray-900">{stats?.growthRate || mockStats.growthRate}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Pendentes</p>
                      <p className="text-2xl font-bold text-gray-900">{stats?.pendingApprovals || mockStats.pendingApprovals}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="bookings">
            <AdminBookingsOverview />
          </TabsContent>
          <TabsContent value="users">
            <AdminUsersTab />
          </TabsContent>
          <TabsContent value="courts">
            <AdminCourtsTab />
          </TabsContent>
          <TabsContent value="reports">
            <AdminReportsTab />
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation userType="admin" />
    </div>
  );
};

export default AdminDashboard;
