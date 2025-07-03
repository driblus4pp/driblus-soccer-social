
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  CheckCircle, 
  XCircle,
  CalendarCheck,
  Bell,
  MapPin
} from "lucide-react";
import { useBookings } from "@/hooks/useBookings";
import { useManagerNotifications } from "@/hooks/useManagerNotifications";
import ClientProfileSimplified from "@/components/manager/ClientProfileSimplified";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ManagerScheduleProps {
  managerId: string;
}

const ManagerSchedule = ({ managerId }: ManagerScheduleProps) => {
  const { getPendingBookingsByManager, approveBooking, rejectBooking } = useBookings();
  const { addNotification } = useManagerNotifications();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [activeScheduleTab, setActiveScheduleTab] = useState('pending');

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
    console.log(`🎉 Tudo certo com sua reserva! Seu pedido foi confirmado pelo gestor e nos veremos em campo no dia ${format(new Date(booking.date), "dd/MM/yyyy", { locale: ptBR })} às ${booking.startTime}. Prepare-se para o jogo! ⚽`);
  };

  const handleRejectBooking = (bookingId: string, booking: any) => {
    const reason = prompt('Motivo da rejeição (opcional):') || 'Não informado';
    rejectBooking(bookingId, reason);
    
    // Simular notificação para o cliente
    console.log(`📱 Notificação enviada para ${booking.userName}:`);
    console.log(`❌ Sua reserva para ${format(new Date(booking.date), "dd/MM/yyyy", { locale: ptBR })} às ${booking.startTime} foi recusada. Motivo: ${reason}`);
  };

  return (
    <div className="space-y-6">
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
                {pendingBookings.length > 0 && (
                  <Badge className="ml-2 bg-[#F35410] text-white">
                    {pendingBookings.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="calendar">Calendário</TabsTrigger>
              <TabsTrigger value="integration">Integração</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4 mt-6">
              {pendingBookings.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarCheck className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Nenhum agendamento pendente</p>
                </div>
              ) : (
                pendingBookings.map((booking) => (
                  <Card key={booking.id} className="border-l-4 border-l-yellow-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              Aguardando Confirmação
                            </Badge>
                            <span className="text-xs text-gray-500">
                              Há {Math.floor((new Date().getTime() - booking.createdAt.getTime()) / (1000 * 60 * 60))} horas
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-500" />
                                <span className="font-semibold">{booking.userName}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedClientId(booking.userId)}
                                  className="text-[#F35410] hover:bg-[#F35410]/10"
                                >
                                  Ver Perfil
                                </Button>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="w-4 h-4" />
                                <span>{booking.userPhone}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail className="w-4 h-4" />
                                <span>{booking.userEmail}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="font-semibold">
                                  {format(new Date(booking.date), "dd/MM/yyyy (EEEE)", { locale: ptBR })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span>{booking.startTime} às {booking.endTime}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <User className="w-4 h-4" />
                                <span>{booking.numberOfPlayers} pessoas</span>
                              </div>
                              <div className="text-lg font-bold text-[#F35410]">
                                R$ {booking.totalPrice}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 mt-4 pt-4 border-t">
                        <Button
                          onClick={() => handleApproveBooking(booking.id, booking)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirmar Reserva
                        </Button>
                        <Button
                          onClick={() => handleRejectBooking(booking.id, booking)}
                          variant="outline"
                          className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Recusar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="calendar" className="mt-6">
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Visualização de Calendário</h3>
                  <p className="text-gray-600 mb-4">Visualize todos os agendamentos em formato de calendário</p>
                  <Button className="bg-[#F35410] hover:bg-[#BA2D0B]">
                    Abrir Calendário Completo
                  </Button>
                </CardContent>
              </Card>
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
      {selectedClientId && (
        <ClientProfileSimplified
          userId={selectedClientId}
          isOpen={!!selectedClientId}
          onClose={() => setSelectedClientId(null)}
          courtId="1" // ID da quadra do gestor
        />
      )}
    </div>
  );
};

export default ManagerSchedule;
