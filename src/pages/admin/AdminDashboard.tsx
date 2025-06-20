import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, Calendar, TrendingUp, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useBookings } from "@/hooks/useBookings";
import { useCourts } from "@/hooks/useCourts";
const AdminDashboard = () => {
  const navigate = useNavigate();
  const {
    user,
    logout
  } = useAuth();
  const {
    bookings
  } = useBookings();
  const {
    courts,
    getPendingCourts
  } = useCourts();
  const pendingCourts = getPendingCourts();
  const activeCourts = courts.filter(court => court.status === 'active');
  const totalBookings = bookings.length;
  const todayBookings = bookings.filter(booking => booking.date === new Date().toISOString().split('T')[0]);
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B]">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/6a0f382f-4f6a-4afd-a007-454b98a5807a.png" alt="Driblus Logo" className="h-8 object-contain" />
            <h1 className="text-xl font-bold text-white">Driblus Admin</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white text-sm">{user?.name}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-white hover:bg-white/20">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Welcome Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Painel Administrativo</h2>
          <p className="text-white/70">Gerencie a plataforma Driblus</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4 text-center">
              <Building className="w-8 h-8 text-[#F35410] mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{activeCourts.length}</p>
              <p className="text-white/70 text-sm">Quadras Ativas</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 text-[#F35410] mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{totalBookings}</p>
              <p className="text-white/70 text-sm">Total Agendamentos</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-[#F35410] mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{pendingCourts.length}</p>
              <p className="text-white/70 text-sm">Quadras Pendentes</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-[#F35410] mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{todayBookings.length}</p>
              <p className="text-white/70 text-sm">Agendamentos Hoje</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => navigate('/admin/quadras')} className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white justify-start">
              <Building className="w-4 h-4 mr-2" />
              Gerenciar Quadras
            </Button>
            
            <Button onClick={() => navigate('/admin/gestores')} variant="outline" className="w-full border-white/20 hover:bg-white/10 justify-start text-gray-950">
              <Users className="w-4 h-4 mr-2" />
              Aprovar Gestores
            </Button>
            
            <Button onClick={() => navigate('/admin/agendamentos')} variant="outline" className="w-full border-white/20 hover:bg-white/10 justify-start text-gray-950">
              <Calendar className="w-4 h-4 mr-2" />
              Ver Agendamentos
            </Button>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        {pendingCourts.length > 0 && <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Pendente de Aprovação</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/90 mb-3">
                {pendingCourts.length} quadra(s) aguardando aprovação
              </p>
              <Button onClick={() => navigate('/admin/quadras')} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
                Revisar Agora
              </Button>
            </CardContent>
          </Card>}
      </div>
    </div>;
};
export default AdminDashboard;