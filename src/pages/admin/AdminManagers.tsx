import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowLeft, Search, Filter, Plus, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useManagers } from "@/hooks/useManagers";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import ManagerQuickActions from "@/components/admin/ManagerQuickActions";
import ManagerDetailsModal from "@/components/admin/ManagerDetailsModal";
import ManagerStatusToggle from "@/components/admin/ManagerStatusToggle";

const AdminManagers = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { 
    managers, 
    fetchManagers, 
    activateManager, 
    deactivateManager, 
    suspendManager, 
    removeManager 
  } = useManagers();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedManager, setSelectedManager] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    fetchManagers();
  }, [fetchManagers]);

  const filteredManagers = managers.filter(manager => {
    const searchMatch = manager.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        manager.email.toLowerCase().includes(searchQuery.toLowerCase());
    const statusMatch = filterStatus === 'all' || manager.status === filterStatus;
    return searchMatch && statusMatch;
  });

  const handleOpenModal = (manager) => {
    setSelectedManager(manager);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedManager(null);
    setIsModalOpen(false);
  };

  const handleActivate = async () => {
    if (selectedManager) {
      await activateManager(selectedManager.id);
      fetchManagers();
      handleCloseModal();
    }
  };

  const handleDeactivate = async () => {
    if (selectedManager) {
      await deactivateManager(selectedManager.id);
      fetchManagers();
      handleCloseModal();
    }
  };

  const handleSuspend = async () => {
    if (selectedManager) {
      await suspendManager(selectedManager.id, 'Suspended by admin');
      fetchManagers();
      handleCloseModal();
    }
  };

  const handleRemove = async () => {
    if (selectedManager) {
      setIsRemoving(true);
      await removeManager(selectedManager.id);
      fetchManagers();
      handleCloseModal();
      setIsRemoving(false);
    }
  };

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
              <h1 className="text-xl font-semibold">Gestão de Gestores</h1>
              <p className="text-white/80 text-sm">Monitore e gerencie todos os gestores</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => navigate('/admin/gestores/novo')}
              className="bg-[#F35410] hover:bg-[#BA2D0B]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Gestor
            </Button>
            <Button variant="ghost" onClick={logout} className="text-white hover:bg-white/20">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search and Filter */}
        <div className="flex items-center justify-between">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar gestor..."
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          <select
            className="ml-4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos os Status</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
            <option value="suspended">Suspensos</option>
          </select>
        </div>

        {/* Managers List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredManagers.map(manager => (
            <Card key={manager.id} className="bg-white shadow-md rounded-md">
              <CardHeader className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={manager.avatar}
                    alt={manager.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <CardTitle className="text-lg font-semibold">{manager.name}</CardTitle>
                    <p className="text-sm text-gray-500">{manager.email}</p>
                  </div>
                </div>
                <Badge variant={manager.status === 'active' ? 'default' : 'secondary'}>
                  {manager.status === 'active' ? 'Ativo' : manager.status === 'inactive' ? 'Inativo' : 'Suspenso'}
                </Badge>
              </CardHeader>
              <CardContent>
                <ManagerQuickActions 
                  manager={manager}
                  onViewDetails={() => handleOpenModal(manager)}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Manager Details Modal */}
      <ManagerDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        manager={selectedManager}
        onActivate={handleActivate}
        onDeactivate={handleDeactivate}
        onSuspend={handleSuspend}
        onRemove={handleRemove}
      />

      {/* Navegação inferior */}
      <BottomNavigation userType="admin" />
    </div>
  );
};

export default AdminManagers;
