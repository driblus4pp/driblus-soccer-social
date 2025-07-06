
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Users, Building, Clock } from "lucide-react";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";
import { useManagers } from "@/hooks/useManagers";
import { useCourts } from "@/hooks/useCourts";
import { useToast } from "@/hooks/use-toast";

interface ApprovalsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApprovalsModal = ({ isOpen, onClose }: ApprovalsModalProps) => {
  const { pendingApprovals, refreshNotifications } = useAdminNotifications();
  const { approveManager, rejectManager } = useManagers();
  const { approveCourt, rejectCourt } = useCourts();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');

  const managers = pendingApprovals.filter(approval => approval.type === 'manager');
  const courts = pendingApprovals.filter(approval => approval.type === 'court');

  const handleApprove = async (approval: any) => {
    try {
      if (approval.type === 'manager') {
        await approveManager(approval.id);
        toast({
          title: "Gestor Aprovado",
          description: `${approval.name} foi aprovado com sucesso.`,
        });
      } else {
        await approveCourt(approval.id);
        toast({
          title: "Quadra Aprovada",
          description: `${approval.name} foi aprovada com sucesso.`,
        });
      }
      refreshNotifications();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao aprovar. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleReject = async (approval: any) => {
    try {
      if (approval.type === 'manager') {
        await rejectManager(approval.id, 'Não atende aos critérios necessários');
        toast({
          title: "Gestor Rejeitado",
          description: `${approval.name} foi rejeitado.`,
        });
      } else {
        await rejectCourt(approval.id, 'Não atende aos critérios necessários');
        toast({
          title: "Quadra Rejeitada",
          description: `${approval.name} foi rejeitada.`,
        });
      }
      refreshNotifications();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao rejeitar. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const ApprovalCard = ({ approval }: { approval: any }) => (
    <div className="bg-white/5 border border-white/20 rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {approval.type === 'manager' ? (
              <Users className="w-4 h-4 text-blue-400" />
            ) : (
              <Building className="w-4 h-4 text-green-400" />
            )}
            <h3 className="text-white font-medium">{approval.name}</h3>
            <Badge variant="outline" className="border-orange-500 text-orange-400 text-xs">
              {approval.type === 'manager' ? 'Gestor' : 'Quadra'}
            </Badge>
          </div>
          
          <div className="space-y-1 text-sm text-white/70">
            {approval.email && <p>📧 {approval.email}</p>}
            {approval.owner && <p>👤 Proprietário: {approval.owner}</p>}
            {approval.location && <p>📍 {approval.location}</p>}
            <div className="flex items-center gap-1 text-xs">
              <Clock className="w-3 h-3" />
              <span>Solicitado em {approval.date}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleReject(approval)}
          className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/20"
        >
          <XCircle className="w-3 h-3 mr-1" />
          Rejeitar
        </Button>
        <Button
          size="sm"
          onClick={() => handleApprove(approval)}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Aprovar
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-[#062B4B] border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            Aprovações Pendentes ({pendingApprovals.length})
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 border-white/20">
            <TabsTrigger 
              value="all" 
              className="text-white data-[state=active]:bg-[#F35410] data-[state=active]:text-white"
            >
              Todas ({pendingApprovals.length})
            </TabsTrigger>
            <TabsTrigger 
              value="managers"
              className="text-white data-[state=active]:bg-[#F35410] data-[state=active]:text-white"
            >
              Gestores ({managers.length})
            </TabsTrigger>
            <TabsTrigger 
              value="courts"
              className="text-white data-[state=active]:bg-[#F35410] data-[state=active]:text-white"
            >
              Quadras ({courts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 max-h-96 overflow-y-auto">
            {pendingApprovals.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <p className="text-white/70">Nenhuma aprovação pendente</p>
              </div>
            ) : (
              pendingApprovals.map((approval) => (
                <ApprovalCard key={approval.id} approval={approval} />
              ))
            )}
          </TabsContent>

          <TabsContent value="managers" className="space-y-4 max-h-96 overflow-y-auto">
            {managers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <p className="text-white/70">Nenhum gestor pendente</p>
              </div>
            ) : (
              managers.map((approval) => (
                <ApprovalCard key={approval.id} approval={approval} />
              ))
            )}
          </TabsContent>

          <TabsContent value="courts" className="space-y-4 max-h-96 overflow-y-auto">
            {courts.length === 0 ? (
              <div className="text-center py-8">
                <Building className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <p className="text-white/70">Nenhuma quadra pendente</p>
              </div>
            ) : (
              courts.map((approval) => (
                <ApprovalCard key={approval.id} approval={approval} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ApprovalsModal;
