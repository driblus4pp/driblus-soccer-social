import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Calendar, Bell, User, Building, BarChart3, Users, Settings } from "lucide-react";
import { useManagerNotifications } from "@/hooks/useManagerNotifications";
interface BottomNavigationProps {
  userType: 'client' | 'manager' | 'admin';
}
const BottomNavigation = ({
  userType
}: BottomNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Only get notifications for managers
  const {
    unreadCount
  } = userType === 'manager' ? useManagerNotifications() : {
    unreadCount: 0
  };
  const getNavItems = () => {
    switch (userType) {
      case 'client':
        return [{
          icon: Home,
          label: 'Início',
          path: '/cliente/dashboard'
        }, {
          icon: Building,
          label: 'Quadras',
          path: '/cliente/quadras'
        }, {
          icon: Calendar,
          label: 'Agenda',
          path: '/cliente/agendamentos'
        }, {
          icon: Bell,
          label: 'Avisos',
          path: '/cliente/notificacoes'
        }, {
          icon: User,
          label: 'Perfil',
          path: '/cliente/perfil'
        }];
      case 'manager':
        return [{
          icon: Home,
          label: 'Início',
          path: '/gestor/dashboard'
        }, {
          icon: Calendar,
          label: 'Agenda',
          path: '/gestor/agendamentos'
        }, {
          icon: Bell,
          label: 'Avisos',
          path: '/gestor/notificacoes',
          badge: unreadCount
        }, {
          icon: BarChart3,
          label: 'Relatórios',
          path: '/gestor/relatorios'
        }, {
          icon: User,
          label: 'Perfil',
          path: '/gestor/perfil'
        }];
      case 'admin':
        return [{
          icon: Home,
          label: 'Início',
          path: '/admin/dashboard'
        }, {
          icon: Building,
          label: 'Quadras',
          path: '/admin/quadras'
        }, {
          icon: Users,
          label: 'Gestores',
          path: '/admin/gestores'
        }, {
          icon: BarChart3,
          label: 'Relatórios',
          path: '/admin/relatorios'
        }, {
          icon: Settings,
          label: 'Config',
          path: '/admin/configuracoes'
        }];
      default:
        return [];
    }
  };
  const navItems = getNavItems();
  const isActive = (path: string) => location.pathname === path;
  return <div className="fixed bottom-0 left-0 right-0 bg-blue border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map(item => {
        const Icon = item.icon;
        const active = isActive(item.path);
        return <Button key={item.path} variant="ghost" size="sm" onClick={() => navigate(item.path)} className={`flex flex-col items-center gap-1 px-2 py-3 h-auto relative ${active ? 'text-[#F35410]' : 'text-gray-600'}`}>
              <div className="relative">
                <Icon className={`h-5 w-5 ${active ? 'text-[#F35410]' : 'text-gray-600'}`} />
                {item.badge && item.badge > 0 && <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs min-w-[20px]">
                    {item.badge > 99 ? '99+' : item.badge}
                  </Badge>}
              </div>
              <span className={`text-xs ${active ? 'text-[#F35410]' : 'text-gray-600'}`}>
                {item.label}
              </span>
            </Button>;
      })}
      </div>
    </div>;
};
export default BottomNavigation;