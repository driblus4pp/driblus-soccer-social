import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, User, Building, Search, TrendingUp, AlertCircle } from "lucide-react";
import { useBookings } from "@/hooks/useBookings";
import { useCourts } from "@/hooks/useCourts";
import { useManagers } from "@/hooks/useManagers";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BookingStatus } from '@/types';

const AdminBookingsOverview = () => {
  const [selectedManager, setSelectedManager] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { bookings } = useBookings();
  const { courts } = useCourts();
  const { managers } = useManagers();

  // Filtrar bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesManager = selectedManager === 'all' || booking.managerId === selectedManager;
    const matchesStatus = selectedStatus === 'all' || booking.status === selectedStatus;
    const matchesSearch = !searchTerm || 
      booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.courtName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesManager && matchesStatus && matchesSearch;
  });

  // Estatísticas
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === BookingStatus.PENDING).length,
    confirmed: bookings.filter(b => b.status === BookingStatus.CONFIRMED).length,
    completed: bookings.filter(b => b.status === BookingStatus.COMPLETED).length,
    cancelled: bookings.filter(b => 
      b.status === BookingStatus.CANCELLED_BY_MANAGER || 
      b.status === BookingStatus.CANCELLED_BY_USER
    ).length,
    totalRevenue: bookings
      .filter(b => b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.COMPLETED)
      .reduce((sum, b) => sum + b.totalPrice, 0)
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return "bg-green-100 text-green-800";
      case BookingStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case BookingStatus.CANCELLED_BY_MANAGER:
      case BookingStatus.CANCELLED_BY_USER:
        return "bg-red-100 text-red-800";
      case BookingStatus.COMPLETED:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return "Confirmado";
      case BookingStatus.PENDING:
        return "Pendente";
      case BookingStatus.CANCELLED_BY_MANAGER:
        return "Cancelado pelo Gestor";
      case BookingStatus.CANCELLED_BY_USER:
        return "Cancelado pelo Cliente";
      case BookingStatus.COMPLETED:
        return "Finalizado";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pendentes</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
            <div className="text-sm text-gray-600">Confirmados</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Finalizados</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            <div className="text-sm text-gray-600">Cancelados</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              R$ {stats.totalRevenue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Receita</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Agendamentos da Plataforma
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Buscar cliente ou quadra..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedManager} onValueChange={setSelectedManager}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os gestores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os gestores</SelectItem>
                {managers.map(manager => (
                  <SelectItem key={manager.id} value={manager.id}>
                    {manager.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value={BookingStatus.PENDING}>Pendentes</SelectItem>
                <SelectItem value={BookingStatus.CONFIRMED}>Confirmados</SelectItem>
                <SelectItem value={BookingStatus.COMPLETED}>Finalizados</SelectItem>
                <SelectItem value={BookingStatus.CANCELLED_BY_MANAGER}>Cancelados</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={() => {
              setSelectedManager('all');
              setSelectedStatus('all');
              setSearchTerm('');
            }}>
              Limpar Filtros
            </Button>
          </div>

          {/* Lista de Agendamentos */}
          <div className="space-y-4">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum agendamento encontrado</p>
              </div>
            ) : (
              filteredBookings
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((booking) => {
                  const court = courts.find(c => c.id === booking.courtId);
                  const manager = managers.find(m => m.id === booking.managerId);
                  
                  return (
                    <Card key={booking.id} className="border-l-4 border-l-blue-400">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <span className="font-semibold">{booking.userName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Building className="w-4 h-4" />
                              <span>{booking.courtName}</span>
                              {manager && (
                                <span className="text-gray-400">• {manager.name}</span>
                              )}
                            </div>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusLabel(booking.status)}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span>
                                {format(new Date(booking.date), "dd/MM/yyyy", { locale: ptBR })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span>{booking.startTime} - {booking.endTime}</span>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm">
                            <p><span className="font-medium">Telefone:</span> {booking.userPhone}</p>
                            <p><span className="font-medium">Email:</span> {booking.userEmail}</p>
                          </div>

                          <div className="space-y-2 text-sm">
                            <p><span className="font-medium">Jogadores:</span> {booking.numberOfPlayers}</p>
                            <p className="font-semibold text-lg text-[#F35410]">
                              R$ {booking.totalPrice}
                            </p>
                          </div>
                        </div>

                        {booking.cancellationReason && (
                          <div className="mt-3 p-3 bg-red-50 rounded-lg">
                            <div className="flex items-center gap-2 text-red-800 text-sm">
                              <AlertCircle className="w-4 h-4" />
                              <span className="font-medium">Motivo do cancelamento:</span>
                            </div>
                            <p className="text-red-700 text-sm mt-1">{booking.cancellationReason}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBookingsOverview;