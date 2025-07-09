
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Search, 
  Users, 
  Building,
  TrendingUp,
  Eye,
  UserCheck,
  UserX,
  AlertTriangle,
  LogOut,
  Star
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useManagers } from "@/hooks/useManagers";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import ManagerDetailsModal from "@/components/admin/ManagerDetailsModal";
import ManagerQuickActions from "@/components/admin/ManagerQuickActions";

const AdminManagers = () => {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();
  const { 
    managers, 
    getManagerById, 
    getManagerCourts, 
    getManagerStats,
    activateManager,
    deactivateManager,
    suspendManager,
    getManagerFeedback
  } = useManagers();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedManagerId, setSelectedManagerId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');

  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/admin/login');
    } else if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  const filteredManagers = managers.filter(manager => {
    const searchRegex = new RegExp(searchTerm, 'i');
    const matchesSearch = searchRegex.test(manager.name) || searchRegex.test(manager.email);

    let matchesStatus = true;
    if (filter === 'active') {
      matchesStatus = manager.status === 'active';
    } else if (filter === 'pending') {
      matchesStatus = manager.status === 'pending';
    } else if (filter === 'suspended') {
      matchesStatus = manager.status === 'suspended';
    }

    return matchesSearch && matchesStatus;
  });

  const handleOpenDetails = (managerId: string) => {
    setSelectedManagerId(managerId);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedManagerId(null);
  };

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  if (!user && !isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#062B4B] to-[#0A3B5C] text-white p-6">
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
              <h1 className="text-2xl font-bold">Gerenciar Gestores</h1>
              <p className="text-white/80 text-sm mt-1">Administre todos os gestores da plataforma</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-white hover:bg-white/20">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar gestor por nome ou email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-700 text-sm">Filtrar por:</span>
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-[#F35410] hover:bg-[#BA2D0B] text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
              size="sm"
            >
              Todos
            </Button>
            <Button
              variant={filter === 'active' ? 'default' : 'outline'}
              onClick={() => setFilter('active')}
              className={filter === 'active' ? 'bg-[#F35410] hover:bg-[#BA2D0B] text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
              size="sm"
            >
              Ativos
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilter('pending')}
              className={filter === 'pending' ? 'bg-[#F35410] hover:bg-[#BA2D0B] text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
              size="sm"
            >
              Pendentes
            </Button>
            <Button
              variant={filter === 'suspended' ? 'default' : 'outline'}
              onClick={() => setFilter('suspended')}
              className={filter === 'suspended' ? 'bg-[#F35410] hover:bg-[#BA2D0B] text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
              size="sm"
            >
              Suspensos
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total de Gestores</p>
                  <p className="text-2xl font-bold text-gray-900">{managers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Building className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Quadras Gerenciadas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {managers.reduce((acc, manager) => acc + getManagerCourts(manager.id).length, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Média de Avaliação</p>
                  <p className="text-2xl font-bold text-gray-900">4.7 <Star className="inline-block w-4 h-4 fill-yellow-400 text-yellow-400 mb-1" /></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Managers List */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800">Lista de Gestores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredManagers.map(manager => (
              <div key={manager.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <img
                    src={manager.avatar || "https://via.placeholder.com/50"}
                    alt={manager.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{manager.name}</p>
                    <p className="text-sm text-gray-600">{manager.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${
                    manager.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : manager.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {manager.status === 'active' ? 'Ativo' : manager.status === 'pending' ? 'Pendente' : 'Suspenso'}
                  </Badge>
                  <ManagerQuickActions
                    manager={manager}
                    onViewDetails={() => handleOpenDetails(manager.id)}
                    onActivate={() => activateManager(manager.id)}
                    onDeactivate={() => deactivateManager(manager.id)}
                    onSuspend={() => suspendManager(manager.id, "Suspensão administrativa")}
                    onViewReports={() => console.log("View reports")}
                    onManageCourts={() => console.log("Manage courts")}
                    onContact={() => console.log("Contact manager")}
                    onRemove={() => console.log("Remove manager")}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Manager Details Modal */}
      <ManagerDetailsModal
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        manager={selectedManagerId ? getManagerById(selectedManagerId) : null}
        getManagerCourts={getManagerCourts}
        getManagerStats={getManagerStats}
        getManagerFeedback={getManagerFeedback}
        activateManager={activateManager}
        deactivateManager={deactivateManager}
        suspendManager={suspendManager}
      />

      <BottomNavigation userType="admin" />
    </div>
  );
};

export default AdminManagers;
