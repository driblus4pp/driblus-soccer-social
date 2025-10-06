import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import LoadingScreen from '@/components/LoadingScreen';

// Import existing dashboards
import ClientDashboard from '@/pages/client/ClientDashboard';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import ManagerDashboard from '@/pages/manager/ManagerDashboard';

const Dashboard = () => {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user || !profile) {
    return <LoadingScreen />;
  }

  // Render appropriate dashboard based on user role
  switch (profile.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'gestor':
      return <ManagerDashboard />;
    case 'cliente':
    default:
      return <ClientDashboard />;
  }
};

export default Dashboard;