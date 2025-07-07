
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Users, 
  Search, 
  DollarSign, 
  Calendar,
  Star,
  Shield,
  Phone,
  Mail
} from "lucide-react";
import { useManagers } from "@/hooks/useManagers";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import ManagerQuickActions from "@/components/admin/ManagerQuickActions";
import ManagerDetailsModal from "@/components/admin/ManagerDetailsModal";
import ManagerStatusToggle from "@/components/admin/ManagerStatusToggle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AdminManagers = () => {
  const navigate = useNavigate();
  const { 
    managers, 
    getManagerStats, 
    getAllManagersStats,
    activateManager,
    deactivateManager,
    suspendManager,
    removeManager
  } = useManagers();
  const { pendingApprovalsCount } = useAdminNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [selectedManager, setSelectedManager] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'activate' | 'deactivate' | 'suspend' | 'remove';
    manager: any;
  } | null>(null);

  const stats = getAllManagersStats();

  const filteredManagers = managers.filter(manager => {
    const matchesSearch = manager.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         manager.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || manager.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const handleViewDetails = (manager: any) => {
    setSelectedManager(manager);
    setIsDetailsModalOpen(true);
  };

  const handleQuickAction = (type: 'activate' | 'deactivate' | 'suspend' | 'remove', manager: any) => {
    setConfirmAction({ type, manager });
  };

  const executeAction = async () => {
    if (!confirmAction) return;

    const { type, manager } = confirmAction;
    
    try {
      switch (type) {
        case 'activate':
          await activateManager(manager.id);
          break;
        case 'deactivate':
          await deactivateManager(manager.id);
          break;
        case 'suspend':
          await suspendManager(manager.id, 'Suspenso pelo administrador');
          break;
        case 'remove':
          await removeManager(manager.id);
          break;
      }
    } catch (error) {
      console.error('Erro ao executar ação:', error);
    } finally {
      setConfirmAction(null);
    }
  };

  const getActionTitle = () => {
    if (!confirmAction) return '';
    const actions = {
      activate: 'Ativar Gestor',
      deactivate: 'Desativar Gestor', 
      suspend: 'Suspender Gestor',
      remove: 'Remover Gestor'
    };
    return actions[confirmAction.type];
  };

  const getActionDescription = () => {
    if (!confirmAction) return '';
    const descriptions = {
      activate: `Tem certeza que deseja ativar o gestor ${confirmAction.manager.name}?`,
      deactivate: `Tem certeza que deseja desativar o gestor ${confirmAction.manager.name}?`,
      suspend: `Tem certeza que deseja suspender o gestor ${confirmAction.manager.name}?`,
      remove: `Tem certeza que deseja remover o gestor ${confirmAction.manager.name}? Esta ação não pode ser desfeita.`
    };
    return descriptions[confirmAction.type];
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Padronizado */}
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
              <h1 className="text-2xl font-bold text-white">Gestores</h1>
              <p className="text-white/80 text-sm mt-1">Gerencie gestores da plataforma</p>
            </div>
          </div>
          
          {pendingApprovalsCount > 0 && (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              {pendingApprovalsCount} pendentes
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Stats Overview Padronizado */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="text-center">
                <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-gray-500 text-xs font-medium">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalManagers}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="text-center">
                <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-gray-500 text-xs font-medium">Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeManagers}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="text-center">
                <DollarSign className="w-6 h-6 text-[#F35410] mx-auto mb-2" />
                <p className="text-gray-500 text-xs font-medium">Receita</p>
                <p className="text-lg font-bold text-gray-900">R$ {(stats.totalRevenue / 1000).toFixed(0)}k</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="text-center">
                <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-gray-500 text-xs font-medium">Agendamentos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search e Filters Padronizados */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar gestores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-gray-200 focus:border-[#F35410] focus:ring-[#F35410]"
            />
          </div>
          
          <div className="flex gap-2">
            {(['all', 'active', 'inactive', 'suspended'] as const).map((filterType) => (
              <Button
                key={filterType}
                variant={filter === filterType ? 'default' : 'outline'}
                onClick={() => setFilter(filterType)}
                className={
                  filter === filterType 
                    ? 'bg-[#F35410] hover:bg-[#BA2D0B] text-white border-[#F35410]' 
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }
                size="sm"
              >
                {filterType === 'all' ? 'Todos' : 
                 filterType === 'active' ? 'Ativos' :
                 filterType === 'inactive' ? 'Inativos' : 'Suspensos'}
              </Button>
            ))}
          </div>
        </div>

        {/* Lista de Gestores Padronizada */}
        <div className="space-y-4">
          {filteredManagers.length === 0 ? (
            <Card className="bg-white border-gray-200">
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum gestor encontrado</p>
              </CardContent>
            </Card>
          ) : (
            filteredManagers.map((manager) => {
              const managerStats = getManagerStats(manager.id);
              return (
                <Card key={manager.id} className="bg-white border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      {/* Info Principal */}
                      <div className="flex items-center gap-4 flex-1">
                        <img
                          src={manager.avatar}
                          alt={manager.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-gray-900 font-semibold text-lg">{manager.name}</h3>
                            <ManagerStatusToggle 
                              status={manager.status} 
                              isVerified={manager.isVerified}
                              size="sm"
                            />
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              <span>{manager.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              <span>{manager.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stats e Ações */}
                      <div className="flex items-center gap-6">
                        {/* Stats Rápidas */}
                        {managerStats && (
                          <div className="flex gap-8 text-center">
                            <div>
                              <p className="text-xs text-gray-500 font-medium">Quadras</p>
                              <p className="text-gray-900 font-bold text-lg">{managerStats.totalCourts}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">Receita</p>
                              <p className="text-gray-900 font-bold text-lg">R$ {(managerStats.totalRevenue / 1000).toFixed(0)}k</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">Avaliação</p>
                              <div className="flex items-center gap-1 justify-center">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <p className="text-gray-900 font-bold text-lg">{managerStats.averageRating.toFixed(1)}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Ações Rápidas */}
                        <ManagerQuickActions
                          manager={manager}
                          onViewDetails={() => handleViewDetails(manager)}
                          onActivate={() => handleQuickAction('activate', manager)}
                          onDeactivate={() => handleQuickAction('deactivate', manager)}
                          onSuspend={() => handleQuickAction('suspend', manager)}
                          onViewReports={() => console.log('Ver relatórios', manager.id)}
                          onManageCourts={() => console.log('Gerenciar quadras', manager.id)}
                          onContact={() => console.log('Contatar', manager.id)}
                          onRemove={() => handleQuickAction('remove', manager)}
                        />
                      </div>
                    </div>

                    {/* Data de Cadastro */}
                    <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
                      Membro desde {manager.createdAt.toLocaleDateString()}
                      {manager.lastLogin && (
                        <span className="ml-4">• Último acesso: {manager.lastLogin.toLocaleDateString()}</span>
                      )}
                      {manager.status === 'suspended' && manager.suspensionReason && (
                        <span className="ml-4 text-red-600">• {manager.suspensionReason}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Modal de Detalhes */}
      <ManagerDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        manager={selectedManager}
        onActivate={() => {
          if (selectedManager) {
            handleQuickAction('activate', selectedManager);
            setIsDetailsModalOpen(false);
          }
        }}
        onDeactivate={() => {
          if (selectedManager) {
            handleQuickAction('deactivate', selectedManager);
            setIsDetailsModalOpen(false);
          }
        }}
        onSuspend={() => {
          if (selectedManager) {
            handleQuickAction('suspend', selectedManager);
            setIsDetailsModalOpen(false);
          }
        }}
        onRemove={() => {
          if (selectedManager) {
            handleQuickAction('remove', selectedManager);
            setIsDetailsModalOpen(false);
          }
        }}
      />

      {/* Dialog de Confirmação */}
      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{getActionTitle()}</AlertDialogTitle>
            <AlertDialogDescription>
              {getActionDescription()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={executeAction}
              className={confirmAction?.type === 'remove' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNavigation userType="admin" />
    </div>
  );
};

export default AdminManagers;
