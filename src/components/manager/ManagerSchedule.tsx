import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, User, Phone, Mail, CheckCircle, XCircle, CalendarCheck, Bell, MapPin } from "lucide-react";
import { useBookings } from "@/hooks/useBookings";
import { useManagerNotifications } from "@/hooks/useManagerNotifications";
import ClientProfileSimplified from "@/components/manager/ClientProfileSimplified";
import PendingBookingsList from "./PendingBookingsList";
import ManagerBookingCalendar from "./ManagerBookingCalendar";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useIsMobile } from "@/hooks/use-mobile";
interface ManagerScheduleProps {
  managerId: string;
}
const ManagerSchedule = ({
  managerId
}: ManagerScheduleProps) => {
  const {
    getPendingBookingsByManager,
    approveBooking,
    rejectBooking
  } = useBookings();
  const {
    addNotification
  } = useManagerNotifications();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [activeScheduleTab, setActiveScheduleTab] = useState('pending');
  const isMobile = useIsMobile();
  const pendingBookings = getPendingBookingsByManager(managerId);
  const handleApproveBooking = (bookingId: string, booking: any) => {
    approveBooking(bookingId);

    // Adicionar notificação de sucesso
    addNotification({
      type: 'booking_confirmed',
      title: 'Agendamento Confirmado',
      message: `Reserva de ${booking.userName} foi aprovada com sucesso`,
      courtId: booking.courtId,
      courtName: booking.courtName,
      bookingId: bookingId,
      userId: managerId,
      actionRequired: false
    });

    // Simular notificação personalizada para o cliente
    console.log(`📱 Notificação enviada para ${booking.userName}:`);
    console.log(`🎉 Tudo certo com sua reserva! Seu pedido foi confirmado pelo gestor e nos veremos em campo no dia ${format(new Date(booking.date), "dd/MM/yyyy", {
      locale: ptBR
    })} às ${booking.startTime}. Prepare-se para o jogo! ⚽`);
  };
  const handleRejectBooking = (bookingId: string, booking: any) => {
    const reason = prompt('Motivo da rejeição (opcional):') || 'Não informado';
    rejectBooking(bookingId, reason);

    // Simular notificação para o cliente
    console.log(`📱 Notificação enviada para ${booking.userName}:`);
    console.log(`❌ Sua reserva para ${format(new Date(booking.date), "dd/MM/yyyy", {
      locale: ptBR
    })} às ${booking.startTime} foi recusada. Motivo: ${reason}`);
  };
  return <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#F35410]" />
            Agenda da Quadra
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeScheduleTab} onValueChange={setActiveScheduleTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">
                Pendentes
                {pendingBookings.length > 0 && <Badge className="ml-2 bg-[#F35410] text-white">
                    {pendingBookings.length}
                  </Badge>}
              </TabsTrigger>
              <TabsTrigger value="calendar">Calendário</TabsTrigger>
              <TabsTrigger value="integration">Integração</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4 mt-6">
              <PendingBookingsList managerId={managerId} />
            </TabsContent>

            <TabsContent value="calendar" className="mt-6">
              <ManagerBookingCalendar managerId={managerId} />
            </TabsContent>

            <TabsContent value="integration" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Integração com Calendário
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Google Calendar</h4>
                    <p className="text-blue-700 text-sm mb-3">
                      Sincronize automaticamente com seu Google Calendar
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Conectar Google Calendar
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Calendário do Dispositivo</h4>
                    <p className="text-gray-700 text-sm mb-3">
                      Exporte agendamentos para o calendário do seu celular
                    </p>
                    <Button variant="outline" className="border-gray-300">
                      Exportar Agendamentos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modal do perfil simplificado do cliente */}
      {selectedClientId && <ClientProfileSimplified userId={selectedClientId} isOpen={!!selectedClientId} onClose={() => setSelectedClientId(null)} courtId="1" // ID da quadra do gestor
    />}
    </div>;
};
export default ManagerSchedule;