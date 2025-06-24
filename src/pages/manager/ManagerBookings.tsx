
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Calendar, Clock, User, Phone, Mail, Check, X, AlertCircle, Eye } from "lucide-react";
import { useBookings } from "@/hooks/useBookings";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BookingStatus } from '@/types';
import ClientProfileModal from '@/components/ClientProfileModal';

const ManagerBookings = () => {
  const navigate = useNavigate();
  const {
    bookings,
    approveBooking,
    rejectBooking,
    getPendingBookingsByManager
  } = useBookings();
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('pending');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // Em um sistema real, o managerId viria do contexto de autenticação
  const managerId = 'manager-1';
  const filteredBookings = bookings.filter(booking => {
    if (booking.managerId !== managerId) return false;
    switch (filter) {
      case 'pending':
        return booking.status === BookingStatus.PENDING;
      case 'confirmed':
        return booking.status === BookingStatus.CONFIRMED;
      case 'cancelled':
        return booking.status === BookingStatus.CANCELLED_BY_MANAGER || booking.status === BookingStatus.CANCELLED_BY_USER;
      default:
        return true;
    }
  });
  
  const pendingCount = getPendingBookingsByManager(managerId).length;
  
  const handleApprove = (bookingId: string) => {
    approveBooking(bookingId);
    setSelectedBooking(null);
  };
  
  const handleReject = (bookingId: string) => {
    rejectBooking(bookingId, 'Rejeitado pelo gestor');
    setSelectedBooking(null);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled_by_manager':
      case 'cancelled_by_user':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendente';
      case 'cancelled_by_manager':
        return 'Cancelado pelo Gestor';
      case 'cancelled_by_user':
        return 'Cancelado pelo Cliente';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/gestor/dashboard')} 
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-white">Agendamentos</h1>
          {pendingCount > 0 && (
            <Badge className="bg-yellow-500 text-white">
              {pendingCount} pendente{pendingCount !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Filter Buttons */}
        <div className="flex gap-2 overflow-x-auto">
          <Button 
            variant={filter === 'pending' ? 'default' : 'outline'} 
            onClick={() => setFilter('pending')} 
            className={filter === 'pending' ? 'bg-[#F35410] hover:bg-[#BA2D0B]' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
          >
            Pendentes {pendingCount > 0 && `(${pendingCount})`}
          </Button>
          <Button 
            variant={filter === 'confirmed' ? 'default' : 'outline'} 
            onClick={() => setFilter('confirmed')} 
            className={filter === 'confirmed' ? 'bg-[#F35410] hover:bg-[#BA2D0B]' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
          >
            Confirmados
          </Button>
          <Button 
            variant={filter === 'cancelled' ? 'default' : 'outline'} 
            onClick={() => setFilter('cancelled')} 
            className={filter === 'cancelled' ? 'bg-[#F35410] hover:bg-[#BA2D0B]' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
          >
            Cancelados
          </Button>
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            onClick={() => setFilter('all')} 
            className={filter === 'all' ? 'bg-[#F35410] hover:bg-[#BA2D0B]' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
          >
            Todos
          </Button>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum agendamento encontrado</p>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map(booking => (
              <Card key={booking.id} className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#F35410]" />
                      <span className="text-gray-800 font-semibold">
                        {format(new Date(booking.date), "dd 'de' MMMM", { locale: ptBR })}
                      </span>
                    </div>
                    <Badge className={`${getStatusColor(booking.status)} text-white`}>
                      {getStatusText(booking.status)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-4 h-4 text-[#F35410]" />
                      <span>{booking.startTime} - {booking.endTime}</span>
                      <span className="text-gray-500">({booking.duration}h)</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-700">
                      <User className="w-4 h-4 text-[#F35410]" />
                      <span>{booking.userName}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-4 h-4 text-[#F35410]" />
                      <span>{booking.userPhone}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-4 h-4 text-[#F35410]" />
                      <span>{booking.userEmail}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-[#F35410] font-semibold">R$ {booking.totalPrice}</span>
                      
                      <div className="flex gap-2 items-center">
                        {/* Ver Perfil Button */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedClientId(booking.userId)}
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver Perfil
                        </Button>

                        {booking.status === BookingStatus.PENDING && (
                          <>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700 text-white" 
                                  onClick={() => setSelectedBooking(booking)}
                                >
                                  <Check className="w-4 h-4 mr-1" />
                                  Aprovar
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-white border-gray-200">
                                <DialogHeader>
                                  <DialogTitle className="text-gray-800">Aprovar Agendamento</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <p className="text-gray-700">
                                    Tem certeza que deseja aprovar este agendamento?
                                  </p>
                                  <div className="text-gray-600 text-sm space-y-1">
                                    <p><strong>Cliente:</strong> {booking.userName}</p>
                                    <p><strong>Data:</strong> {format(new Date(booking.date), "dd/MM/yyyy", { locale: ptBR })}</p>
                                    <p><strong>Horário:</strong> {booking.startTime} - {booking.endTime}</p>
                                  </div>
                                  <div className="flex gap-2 pt-4">
                                    <Button 
                                      onClick={() => handleApprove(booking.id)} 
                                      className="bg-green-600 hover:bg-green-700 text-white flex-1"
                                    >
                                      Confirmar Aprovação
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  onClick={() => setSelectedBooking(booking)}
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  Rejeitar
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-white border-gray-200">
                                <DialogHeader>
                                  <DialogTitle className="text-gray-800">Rejeitar Agendamento</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <p className="text-gray-700">
                                    Tem certeza que deseja rejeitar este agendamento?
                                  </p>
                                  <div className="text-gray-600 text-sm space-y-1">
                                    <p><strong>Cliente:</strong> {booking.userName}</p>
                                    <p><strong>Data:</strong> {format(new Date(booking.date), "dd/MM/yyyy", { locale: ptBR })}</p>
                                    <p><strong>Horário:</strong> {booking.startTime} - {booking.endTime}</p>
                                  </div>
                                  <div className="flex gap-2 pt-4">
                                    <Button 
                                      onClick={() => handleReject(booking.id)} 
                                      variant="destructive" 
                                      className="flex-1"
                                    >
                                      Confirmar Rejeição
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Client Profile Modal */}
      {selectedClientId && (
        <ClientProfileModal
          userId={selectedClientId}
          isOpen={!!selectedClientId}
          onClose={() => setSelectedClientId(null)}
        />
      )}
    </div>
  );
};

export default ManagerBookings;
