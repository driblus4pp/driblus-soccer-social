import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, User, ChevronLeft, ChevronRight } from "lucide-react";
import { useBookings } from '@/hooks/useBookings';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Booking, BookingStatus } from '@/types';

interface ManagerBookingCalendarProps {
  managerId: string;
}

const ManagerBookingCalendar = ({ managerId }: ManagerBookingCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { getBookingsByManager } = useBookings();
  
  const managerBookings = getBookingsByManager(managerId);
  
  // Agrupar bookings por data
  const bookingsByDate = managerBookings.reduce((acc, booking) => {
    const dateKey = booking.date;
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(booking);
    return acc;
  }, {} as Record<string, Booking[]>);

  // Função para verificar se uma data tem bookings
  const hasBookingsOnDate = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return !!bookingsByDate[dateKey]?.length;
  };

  // Obter bookings do dia selecionado
  const selectedDateBookings = bookingsByDate[format(selectedDate, 'yyyy-MM-dd')] || [];

  // Função para estilizar dias com bookings
  const dayClassNames = (date: Date) => {
    if (hasBookingsOnDate(date)) {
      return "bg-[#F35410] text-white hover:bg-[#BA2D0B] font-semibold";
    }
    return "";
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
        return "Cancelado";
      case BookingStatus.CANCELLED_BY_USER:
        return "Cancelado";
      case BookingStatus.COMPLETED:
        return "Finalizado";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="w-5 h-5 text-[#F35410]" />
        <h2 className="text-xl font-bold">Calendário de Agendamentos</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendário */}
        <Card>
          <CardHeader>
            <CardTitle>Selecionar Data</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
              modifiers={{
                hasBookings: (date) => hasBookingsOnDate(date)
              }}
              modifiersClassNames={{
                hasBookings: "bg-[#F35410] text-white hover:bg-[#BA2D0B] font-semibold"
              }}
            />
            <div className="mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#F35410] rounded"></div>
                <span>Dias com agendamentos</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agendamentos do Dia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateBookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum agendamento para este dia</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateBookings
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-semibold text-lg">
                          {booking.startTime} - {booking.endTime}
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {getStatusLabel(booking.status)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{booking.userName}</span>
                        </div>
                        
                        <div className="text-gray-600">
                          <p>📱 {booking.userPhone}</p>
                          <p>✉️ {booking.userEmail}</p>
                          <p>👥 {booking.numberOfPlayers} jogadores</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-gray-500">Quadra: {booking.courtName}</span>
                          <span className="font-semibold text-[#F35410]">
                            R$ {booking.totalPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resumo do Mês */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {managerBookings.filter(b => b.status === BookingStatus.CONFIRMED).length}
              </div>
              <div className="text-sm text-blue-600">Confirmados</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {managerBookings.filter(b => b.status === BookingStatus.PENDING).length}
              </div>
              <div className="text-sm text-yellow-600">Pendentes</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {managerBookings.filter(b => b.status === BookingStatus.COMPLETED).length}
              </div>
              <div className="text-sm text-green-600">Finalizados</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                R$ {managerBookings
                  .filter(b => b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.COMPLETED)
                  .reduce((sum, b) => sum + b.totalPrice, 0)}
              </div>
              <div className="text-sm text-orange-600">Receita</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerBookingCalendar;