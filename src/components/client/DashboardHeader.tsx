
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { usePushNotifications } from "@/hooks/usePushNotifications";

interface DashboardHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onNotificationClick: () => void;
}

const DashboardHeader = ({ searchTerm, setSearchTerm, onNotificationClick }: DashboardHeaderProps) => {
  const { user, profile } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  
  // Ativar notificações push
  usePushNotifications(notifications);

  const getGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return 'Bom dia';
    } else if (hour >= 12 && hour < 18) {
      return 'Boa tarde';
    } else {
      return 'Boa noite';
    }
  };

  return (
    <div className="px-4 py-6 shadow-sm bg-[#093758]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-medium text-white">
            {getGreeting()}, {profile?.nome?.split(' ')[0] || user?.email?.split('@')[0] || 'Usuário'}!
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onNotificationClick}
            className="text-white hover:bg-white/20 relative"
          >
            <Bell className={`w-5 h-5 ${
              unreadCount > 0 ? 'text-orange-300' : 'text-white'
            }`} />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-[#F35410] border-2 border-white"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
          
          <img 
            src="/lovable-uploads/0e6fb8a5-a6de-4b38-955c-58e7bcef94bb.png" 
            alt="Driblus" 
            className="h-8"
          />
        </div>
      </div>

      {/* Barra de busca */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar quadras, bairros..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 rounded-xl"
        />
      </div>
    </div>
  );
};

export default DashboardHeader;
