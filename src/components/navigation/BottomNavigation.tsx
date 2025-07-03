
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, Bell, User, BarChart3, Building2, Users, Settings } from 'lucide-react';

interface BottomNavigationProps {
  userType: 'client' | 'manager' | 'admin';
}

const BottomNavigation = ({ userType }: BottomNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getNavigationItems = () => {
    switch (userType) {
      case 'client':
        return [
          { path: '/cliente/dashboard', icon: Home, label: 'Início' },
          { path: '/cliente/quadras', icon: Building2, label: 'Quadras' },
          { path: '/cliente/agendamentos', icon: Calendar, label: 'Agenda' },
          { path: '/cliente/notificacoes', icon: Bell, label: 'Avisos' },
          { path: '/cliente/perfil', icon: User, label: 'Perfil' }
        ];
      case 'manager':
        return [
          { path: '/gestor/dashboard', icon: Home, label: 'Início' },
          { path: '/gestor/dashboard?tab=schedule', icon: Calendar, label: 'Agenda' },
          { path: '/gestor/notificacoes', icon: Bell, label: 'Avisos' },
          { path: '/gestor/perfil', icon: User, label: 'Perfil' }
        ];
      case 'admin':
        return [
          { path: '/admin/dashboard', icon: Home, label: 'Início' },
          { path: '/admin/quadras', icon: Building2, label: 'Quadras' },
          { path: '/admin/gestores', icon: Users, label: 'Gestores' },
          { path: '/admin/relatorios', icon: BarChart3, label: 'Relatórios' }
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  const isItemActive = (itemPath: string) => {
    // Para o caso específico da agenda do gestor
    if (itemPath === '/gestor/dashboard?tab=schedule') {
      return location.pathname === '/gestor/dashboard' && 
             (location.search.includes('tab=schedule') || 
              new URLSearchParams(location.search).get('tab') === 'schedule');
    }
    
    // Para outros casos, comparação direta
    return location.pathname === itemPath;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = isItemActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive 
                  ? 'text-[#F35410] bg-orange-50' 
                  : 'text-gray-600 hover:text-[#F35410] hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
