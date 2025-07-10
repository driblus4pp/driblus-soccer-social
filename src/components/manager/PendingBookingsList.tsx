import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Calendar, MapPin, Users, Bell } from "lucide-react";
import { useBookings } from '@/hooks/useBookings';
import { useManagerNotifications } from '@/hooks/useManagerNotifications';
import { useDataSync } from '@/hooks/useDataSync';
import BookingApprovalModal from './BookingApprovalModal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Booking } from '@/types';

interface PendingBookingsListProps {
  managerId: string;
}

const PendingBookingsList = ({ managerId }: PendingBookingsListProps) => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const { getPendingBookingsByManager, approveBooking, rejectBooking } = useBookings();
  const { addNotification } = useManagerNotifications();
  const { notifyClients } = useDataSync();
  
  const pendingBookings = getPendingBookingsByManager(managerId);

  const handleApprove = (bookingId: string) => {
    const booking = pendingBookings.find(b => b.id === bookingId);
    if (booking) {
      approveBooking(bookingId);
      
      // Notificar cliente
      addNotification({
        type: 'booking_confirmed',
        title: 'Agendamento Aprovado',
        message: `Seu agendamento de ${booking.date} às ${booking.startTime} foi aprovado!`,
        bookingId,
        userId: booking.userId,
        actionRequired: false
      });

      notifyClients(managerId, `Agendamento aprovado: ${booking.courtName}`);
    }
    setModalOpen(false);
  };

  const handleReject = (bookingId: string, reason: string) => {
    const booking = pendingBookings.find(b => b.id === bookingId);
    if (booking) {
      rejectBooking(bookingId, reason);
      
      // Notificar cliente
      addNotification({
        type: 'booking_cancelled',
        title: 'Agendamento Recusado',
        message: `Seu agendamento foi recusado. Motivo: ${reason}`,
        bookingId,
        userId: booking.userId,
        actionRequired: false
      });

      notifyClients(managerId, `Agendamento recusado: ${booking.courtName}`);
    }
    setModalOpen(false);
  };

  const openModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  if (pendingBookings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Solicitações Pendentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nenhuma solicitação pendente</p>
            <p className="text-sm">Novas solicitações aparecerão aqui</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Bell className="w-5 h-5 text-[#F35410]" />
        <h2 className="text-xl font-bold">Solicitações Pendentes</h2>
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          {pendingBookings.length}
        </Badge>
      </div>

      <div className="space-y-4">
        {pendingBookings.map((booking) => {
          const bookingDate = new Date(booking.date);
          return (
            <Card key={booking.id} className="border-l-4 border-l-yellow-400">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">
                        {format(bookingDate, "dd 'de' MMMM", { locale: ptBR })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{booking.startTime} - {booking.endTime}</span>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    Pendente
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{booking.userName}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>📱 {booking.userPhone}</p>
                      <p>✉️ {booking.userEmail}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{booking.courtName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>{booking.numberOfPlayers} jogadores</span>
                    </div>
                    <div className="text-lg font-semibold text-[#F35410]">
                      R$ {booking.totalPrice}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t">
                  <Button
                    onClick={() => openModal(booking)}
                    className="flex-1 bg-[#F35410] hover:bg-[#BA2D0B]"
                  >
                    Analisar Solicitação
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <BookingApprovalModal
        booking={selectedBooking}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default PendingBookingsList;