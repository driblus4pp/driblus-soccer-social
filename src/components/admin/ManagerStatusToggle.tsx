
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Shield } from "lucide-react";

interface ManagerStatusToggleProps {
  status: 'active' | 'inactive' | 'suspended';
  isVerified: boolean;
  size?: 'sm' | 'md';
}

const ManagerStatusToggle = ({ status, isVerified, size = 'md' }: ManagerStatusToggleProps) => {
  const getStatusBadge = () => {
    const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
    const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
    
    switch (status) {
      case 'active':
        return (
          <Badge className={`bg-green-100 text-green-800 border-green-200 ${textSize}`}>
            <CheckCircle className={`${iconSize} mr-1`} />
            Ativo
          </Badge>
        );
      case 'inactive':
        return (
          <Badge className={`bg-gray-100 text-gray-800 border-gray-200 ${textSize}`}>
            <AlertCircle className={`${iconSize} mr-1`} />
            Inativo
          </Badge>
        );
      case 'suspended':
        return (
          <Badge className={`bg-red-100 text-red-800 border-red-200 ${textSize}`}>
            <Shield className={`${iconSize} mr-1`} />
            Suspenso
          </Badge>
        );
    }
  };

  const getVerificationBadge = () => {
    if (!isVerified) return null;
    
    const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
    const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
    
    return (
      <Badge className={`bg-blue-100 text-blue-800 border-blue-200 ${textSize}`}>
        <CheckCircle className={`${iconSize} mr-1`} />
        Verificado
      </Badge>
    );
  };

  return (
    <div className="flex items-center gap-2">
      {getStatusBadge()}
      {getVerificationBadge()}
    </div>
  );
};

export default ManagerStatusToggle;
