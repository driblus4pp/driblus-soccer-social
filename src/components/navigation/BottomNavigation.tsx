import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, Bell, User, BarChart3, Settings, Building2, Users } from 'lucide-react';
interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  route: string;
}
interface BottomNavigationProps {
  userType: 'client' | 'manager' | 'admin';
}
const navigationConfig = {
  client: [{
    id: 'home',
    label: 'Início',
    icon: Home,
    route: '/cliente/dashboard'
  }, {
    id: 'courts',
    label: 'Quadras',
    icon: Building2,
    route: '/cliente/quadras'
  }, {
    id: 'bookings',
    label: 'Agenda',
    icon: Calendar,
    route: '/cliente/agendamentos'
  }, {
    id: 'notifications',
    label: 'Avisos',
    icon: Bell,
    route: '/cliente/notificacoes'
  }, {
    id: 'profile',
    label: 'Perfil',
    icon: User,
    route: '/cliente/perfil-atleta'
  }],
  manager: [{
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    route: '/gestor/dashboard'
  }, {
    id: 'bookings',
    label: 'Agendamentos',
    icon: Calendar,
    route: '/gestor/agendamentos'
  }, {
    id: 'court',
    label: 'Quadra',
    icon: Building2,
    route: '/gestor/quadra/configurar'
  }, {
    id: 'reports',
    label: 'Relatórios',
    icon: BarChart3,
    route: '/gestor/relatorios'
  }, {
    id: 'profile',
    label: 'Perfil',
    icon: User,
    route: '/gestor/perfil'
  }],
  admin: [{
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    route: '/admin/dashboard'
  }, {
    id: 'courts',
    label: 'Quadras',
    icon: Building2,
    route: '/admin/quadras'
  }, {
    id: 'managers',
    label: 'Gestores',
    icon: Users,
    route: '/admin/gestores'
  }, {
    id: 'bookings',
    label: 'Agendamentos',
    icon: Calendar,
    route: '/admin/agendamentos'
  }, {
    id: 'settings',
    label: 'Config',
    icon: Settings,
    route: '/admin/configuracoes'
  }]
};
const BottomNavigation: React.FC<BottomNavigationProps> = ({
  userType
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const items = navigationConfig[userType];
  const handleNavigation = (route: string) => {
    navigate(route);
  };
  return <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 px-2 py-2 z-50 bg-[#0a2c49]">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {items.map(item => {
        const isActive = location.pathname === item.route;
        const IconComponent = item.icon;
        return <button key={item.id} onClick={() => handleNavigation(item.route)} className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${isActive ? 'text-[#F35410] bg-orange-50' : 'text-gray-500 hover:text-[#F35410]'}`}>
              <IconComponent className={`w-5 h-5 mb-1 ${isActive ? 'text-[#F35410]' : 'text-gray-500'}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-[#F35410]' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </button>;
      })}
      </div>
    </div>;
};
export default BottomNavigation;