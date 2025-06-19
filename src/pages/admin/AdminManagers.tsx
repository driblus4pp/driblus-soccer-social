
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Mail, Phone, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Manager {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected';
  courtName: string;
  requestDate: string;
}

const mockManagers: Manager[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '(85) 99999-9999',
    status: 'pending',
    courtName: 'Arena Pro Sports',
    requestDate: '2024-06-15'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@email.com',
    phone: '(85) 88888-8888',
    status: 'approved',
    courtName: 'Gol de Placa',
    requestDate: '2024-06-10'
  }
];

const AdminManagers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [managers, setManagers] = useState(mockManagers);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  const filteredManagers = managers.filter(manager => {
    switch (filter) {
      case 'pending':
        return manager.status === 'pending';
      case 'approved':
        return manager.status === 'approved';
      default:
        return true;
    }
  });

  const handleApproveManager = (managerId: string) => {
    setManagers(prev =>
      prev.map(manager =>
        manager.id === managerId
          ? { ...manager, status: 'approved' as const }
          : manager
      )
    );
    toast({
      title: "Gestor Aprovado",
      description: "O gestor foi aprovado e pode agora acessar a plataforma",
    });
  };

  const handleRejectManager = (managerId: string) => {
    setManagers(prev =>
      prev.map(manager =>
        manager.id === managerId
          ? { ...manager, status: 'rejected' as const }
          : manager
      )
    );
    toast({
      title: "Gestor Rejeitado",
      description: "A solicitação de acesso foi rejeitada",
      variant: "destructive",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprovado';
      case 'pending':
        return 'Pendente';
      case 'rejected':
        return 'Rejeitado';
      default:
        return status;
    }
  };

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
          <h1 className="text-xl font-bold text-white">Gerenciar Gestores</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Filter Buttons */}
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-[#F35410] hover:bg-[#BA2D0B]' : 'border-white/20 text-white hover:bg-white/10'}
          >
            Todos
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
            className={filter === 'pending' ? 'bg-[#F35410] hover:bg-[#BA2D0B]' : 'border-white/20 text-white hover:bg-white/10'}
          >
            Pendentes
          </Button>
          <Button
            variant={filter === 'approved' ? 'default' : 'outline'}
            onClick={() => setFilter('approved')}
            className={filter === 'approved' ? 'bg-[#F35410] hover:bg-[#BA2D0B]' : 'border-white/20 text-white hover:bg-white/10'}
          >
            Aprovados
          </Button>
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
            filteredManagers.map((manager) => (
              <Card key={manager.id} className="bg-white/10 border-white/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{manager.name}</h3>
                      <p className="text-white/70 text-sm">Quadra: {manager.courtName}</p>
                    </div>
                    <Badge className={`${getStatusColor(manager.status)} text-white`}>
                      {getStatusText(manager.status)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-white">
                      <Mail className="w-4 h-4 text-[#F35410]" />
                      <span className="text-sm">{manager.email}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-white">
                      <Phone className="w-4 h-4 text-[#F35410]" />
                      <span className="text-sm">{manager.phone}</span>
                    </div>
                    
                    <p className="text-white/70 text-xs">
                      Solicitação em: {new Date(manager.requestDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  
                  {manager.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApproveManager(manager.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white flex-1"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Aprovar
                      </Button>
                      
                      <Button
                        onClick={() => handleRejectManager(manager.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-400 hover:bg-red-500/10 flex-1"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Rejeitar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminManagers;
