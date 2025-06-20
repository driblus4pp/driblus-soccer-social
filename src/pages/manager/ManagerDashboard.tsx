import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, Settings, LogOut, Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useBookings } from "@/hooks/useBookings";
const ManagerDashboard = () => {
  const navigate = useNavigate();
  const {
    user,
    logout
  } = useAuth();
  const {
    bookings
  } = useBookings();

  // Filter bookings for today
  const today = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(booking => booking.date === today);
  const totalBookings = bookings.length;
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
            <h1 className="text-xl font-bold text-white">Driblus Manager</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 relative">
              <Bell className="w-4 h-4" />
              {todayBookings.length > 0 && <span className="absolute -top-1 -right-1 bg-[#F35410] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {todayBookings.length}
                </span>}
            </Button>
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
          <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo, {user?.name}!</h2>
          <p className="text-white/70">Gerencie sua quadra e agendamentos</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 text-[#F35410] mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{todayBookings.length}</p>
              <p className="text-white/70 text-sm">Agendamentos Hoje</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-[#F35410] mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{totalBookings}</p>
              <p className="text-white/70 text-sm">Total de Agendamentos</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => navigate('/gestor/agendamentos')} className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              Ver Agendamentos
            </Button>
            
            <Button onClick={() => navigate('/gestor/quadra/configurar')} variant="outline" className="w-full border-white/20 hover:bg-white/10 justify-start text-gray-950">
              <Settings className="w-4 h-4 mr-2" />
              Configurar Horários
            </Button>
          </CardContent>
        </Card>

        {/* Today's Bookings */}
        {todayBookings.length > 0 && <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Agendamentos de Hoje</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayBookings.map(booking => <div key={booking.id} className="p-3 bg-white/5 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-semibold">{booking.userName}</p>
                      <p className="text-white/70 text-sm">{booking.userPhone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#F35410] font-semibold">{booking.startTime}</p>
                      <p className="text-white/70 text-sm">{booking.duration}h</p>
                    </div>
                  </div>
                </div>)}
            </CardContent>
          </Card>}

        {/* N8N Webhook Configuration */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Configurações de Notificação</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/90 text-sm mb-3">
              Configure seu webhook do N8N para receber notificações automáticas via WhatsApp quando houver novos agendamentos.
            </p>
            <Button variant="outline" onClick={() => {
            // TODO: Implement webhook configuration modal
            alert('Funcionalidade em desenvolvimento - Configure seu webhook N8N');
          }} className="w-full border-white/20 hover:bg-white/10 text-zinc-950">
              Configurar Webhook N8N
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default ManagerDashboard;