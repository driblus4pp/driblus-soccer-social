
import React from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  MoreVertical, 
  Eye, 
  UserCheck, 
  UserX, 
  BarChart3, 
  Building2, 
  Phone, 
  Trash2, 
  Shield, 
  AlertTriangle 
} from "lucide-react";

interface Manager {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  managedCourts: string[];
  totalRevenue: number;
  monthlyBookings: number;
  suspensionReason?: string;
  lastActivity?: Date;
  totalComplaints: number;
}

interface ManagerQuickActionsProps {
  manager: Manager;
  onViewDetails: () => void;
  onActivate: () => void;
  onDeactivate: () => void;
  onSuspend: () => void;
  onViewReports: () => void;
  onManageCourts: () => void;
  onContact: () => void;
  onRemove: () => void;
}

const ManagerQuickActions = ({
  manager,
  onViewDetails,
  onActivate,
  onDeactivate,
  onSuspend,
  onViewReports,
  onManageCourts,
  onContact,
  onRemove
}: ManagerQuickActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200 shadow-lg">
        <DropdownMenuItem onClick={onViewDetails}>
          <Eye className="mr-2 h-4 w-4 text-blue-600" />
          Ver Detalhes
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onViewReports}>
          <BarChart3 className="mr-2 h-4 w-4 text-purple-600" />
          Relatórios
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onManageCourts}>
          <Building2 className="mr-2 h-4 w-4 text-gray-600" />
          Gerenciar Quadras
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onContact}>
          <Phone className="mr-2 h-4 w-4 text-green-600" />
          Contato Direto
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {manager.status === 'active' ? (
          <>
            <DropdownMenuItem onClick={onDeactivate}>
              <UserX className="mr-2 h-4 w-4 text-orange-600" />
              Desativar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSuspend}>
              <Shield className="mr-2 h-4 w-4 text-yellow-600" />
              Suspender
            </DropdownMenuItem>
          </>
        ) : manager.status === 'inactive' ? (
          <DropdownMenuItem onClick={onActivate}>
            <UserCheck className="mr-2 h-4 w-4 text-green-600" />
            Ativar
          </DropdownMenuItem>
        ) : manager.status === 'suspended' ? (
          <DropdownMenuItem onClick={onActivate}>
            <UserCheck className="mr-2 h-4 w-4 text-green-600" />
            Reativar
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={onActivate}>
            <UserCheck className="mr-2 h-4 w-4 text-green-600" />
            Aprovar
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onRemove} className="text-red-600 focus:text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Remover Gestor
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ManagerQuickActions;
