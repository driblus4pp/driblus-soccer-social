
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  AlertCircle,
  Shield,
  Building2,
  BarChart3,
  MessageSquare,
  Settings,
  Phone,
  Mail,
  Calendar,
  Star,
  DollarSign,
  Users,
  Clock,
  UserX,
  Trash2
} from "lucide-react";
import { useManagers } from "@/hooks/useManagers";

interface Manager {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  isVerified: boolean;
  status: 'active' | 'inactive' | 'suspended';
  suspensionReason?: string;
  createdAt: Date;
  lastLogin?: Date;
  lastActivity?: Date;
  totalComplaints: number;
}

interface ManagerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  manager: Manager | null;
  onActivate: () => void;
  onDeactivate: () => void;
  onSuspend: () => void;
  onRemove: () => void;
}

const ManagerDetailsModal = ({
  isOpen,
  onClose,
  manager,
  onActivate,
  onDeactivate,
  onSuspend,
  onRemove
}: ManagerDetailsModalProps) => {
  const { getManagerStats, getManagerCourts, getManagerActivity, getManagerFeedback } = useManagers();
  const [suspensionReason, setSuspensionReason] = useState('');

  if (!manager) return null;

  const stats = getManagerStats(manager.id);
  const courts = getManagerCourts(manager.id);
  const activity = getManagerActivity(manager.id);
  const feedback = getManagerFeedback(manager.id);

  const getStatusBadge = () => {
    switch (manager.status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Ativo
          </Badge>
        );
      case 'inactive':
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Inativo
          </Badge>
        );
      case 'suspended':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <Shield className="w-3 h-3 mr-1" />
            Suspenso
          </Badge>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <img
              src={manager.avatar}
              alt={manager.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gray-900">{manager.name}</DialogTitle>
              <div className="flex items-center gap-3 mt-2">
                {getStatusBadge()}
                {manager.isVerified && (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verificado
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="courts">Quadras</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="feedback">Feedbacks</TabsTrigger>
            <TabsTrigger value="actions">Ações</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{manager.email}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Telefone</p>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{manager.phone}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Membro desde</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{manager.createdAt.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Último acesso</p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">
                        {manager.lastLogin ? manager.lastLogin.toLocaleDateString() : 'Nunca'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {manager.status === 'suspended' && manager.suspensionReason && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-medium text-red-800">Motivo da Suspensão:</p>
                    <p className="text-red-700">{manager.suspensionReason}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Quadras Gerenciadas ({courts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {courts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Nenhuma quadra gerenciada</p>
                ) : (
                  <div className="space-y-3">
                    {courts.map((court) => (
                      <div key={court.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{court.name}</p>
                          <p className="text-sm text-gray-500">{court.location.city}, {court.location.state}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={court.status === 'active' ? 'default' : 'secondary'}>
                            {court.status === 'active' ? 'Ativo' : 'Pendente'}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm">{court.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-500 font-medium">Receita Total</p>
                    <p className="text-lg font-bold text-gray-900">R$ {stats.totalRevenue.toLocaleString()}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-500 font-medium">Agendamentos</p>
                    <p className="text-lg font-bold text-gray-900">{stats.monthlyBookings}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Star className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-500 font-medium">Avaliação</p>
                    <p className="text-lg font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <AlertCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-500 font-medium">Reclamações</p>
                    <p className="text-lg font-bold text-gray-900">{stats.totalComplaints}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Últimos Feedbacks
                </CardTitle>
              </CardHeader>
              <CardContent>
                {feedback.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Nenhum feedback disponível</p>
                ) : (
                  <div className="space-y-3">
                    {feedback.map((item) => (
                      <div key={item.id} className="p-3 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < item.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{item.date.toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-700">{item.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Ações Administrativas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {manager.status === 'active' && (
                    <>
                      <Button variant="outline" onClick={onDeactivate} className="w-full">
                        <UserX className="w-4 h-4 mr-2" />
                        Desativar Gestor
                      </Button>
                      <Button variant="outline" onClick={onSuspend} className="w-full">
                        <Shield className="w-4 h-4 mr-2" />
                        Suspender Gestor
                      </Button>
                    </>
                  )}
                  
                  {(manager.status === 'inactive' || manager.status === 'suspended') && (
                    <Button variant="outline" onClick={onActivate} className="w-full">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Ativar Gestor
                    </Button>
                  )}
                  
                  <Button variant="outline" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Contatar Gestor
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Ver Relatórios
                  </Button>
                  
                  <Button variant="destructive" onClick={onRemove} className="w-full md:col-span-2">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remover Gestor
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ManagerDetailsModal;
