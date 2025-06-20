
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useBookings } from "@/hooks/useBookings";
import { useCourts } from "@/hooks/useCourts";

const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createBooking, isTimeSlotAvailable } = useBookings();
  const { getCourtById } = useCourts();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [clientData, setClientData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const court = getCourtById(id || '');

  const getEndTime = (startTime: string) => {
    const [hour] = startTime.split(':');
    return `${parseInt(hour) + 1}:00`;
  };

  const getAvailableTimeSlots = () => {
    if (!selectedDate || !court) return timeSlots;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    
    return timeSlots.filter(time => {
      const endTime = getEndTime(time);
      return isTimeSlotAvailable(court.id, dateStr, time, endTime);
    });
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !clientData.name || !clientData.phone || !clientData.email || !court) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const endTime = getEndTime(selectedTime);
    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    // Verificar disponibilidade uma última vez
    if (!isTimeSlotAvailable(court.id, dateStr, selectedTime, endTime)) {
      alert('Este horário não está mais disponível. Por favor, escolha outro horário.');
      return;
    }

    const bookingData = {
      courtId: court.id,
      courtName: court.name,
      courtImage: court.images[0] || '',
      userId: 'user_1', // Em um sistema real, viria do contexto de autenticação
      userName: clientData.name,
      userEmail: clientData.email,
      userPhone: clientData.phone,
      date: dateStr,
      startTime: selectedTime,
      endTime,
      duration: 1,
      totalPrice: court.hourlyRate,
      serviceFee: 0,
      numberOfPlayers: 10,
      needsEquipment: false,
      managerId: court.ownerId
    };

    const newBooking = createBooking(bookingData);
    
    // Redirect to confirmation
    navigate('/cliente/confirmacao', { 
      state: { 
        booking: {
          ...bookingData,
          time: selectedTime,
          clientData
        },
        formattedDate: format(selectedDate, "dd 'de' MMMM", { locale: ptBR }),
        isPending: true
      } 
    });
  };

  const availableSlots = getAvailableTimeSlots();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B]">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/cliente/quadra/${id}`)}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-white">Agendar Horário</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Date Selection */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Selecione a Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date() || date.getDay() === 0}
              className="bg-white/10 border-white/20 text-white"
              locale={ptBR}
              classNames={{
                day_selected: "bg-[#F35410] text-white hover:bg-[#F35410] hover:text-white focus:bg-[#F35410] focus:text-white",
                day_today: "bg-white/20 text-white hover:bg-white/30 hover:text-slate-900",
                day: "text-white hover:bg-white/20 hover:text-slate-900",
                head_cell: "text-white/70",
                caption_label: "text-white",
                nav_button: "text-white hover:bg-white/20 hover:text-slate-900 border-white/20"
              }}
            />
          </CardContent>
        </Card>

        {/* Time Selection */}
        {selectedDate && (
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Horários Disponíveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {availableSlots.length === 0 ? (
                <p className="text-white/70 text-center py-4">
                  Nenhum horário disponível para esta data. Tente outra data.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      className={`${
                        selectedTime === time 
                          ? "bg-[#F35410] hover:bg-[#BA2D0B] text-white border-[#F35410]" 
                          : "border-white/20 text-white hover:bg-white/20 hover:text-slate-900 bg-transparent"
                      }`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Client Data Form */}
        {selectedDate && selectedTime && (
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Dados do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Nome Completo *</Label>
                <Input
                  id="name"
                  value={clientData.name}
                  onChange={(e) => setClientData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">Telefone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={clientData.phone}
                  onChange={(e) => setClientData(prev => ({ ...prev, phone: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  placeholder="(85) 99999-9999"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={clientData.email}
                  onChange={(e) => setClientData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Booking Summary & Confirm */}
        {selectedDate && selectedTime && clientData.name && clientData.phone && clientData.email && (
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Resumo do Agendamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-white">
                <p><strong>Data:</strong> {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                <p><strong>Horário:</strong> {selectedTime} - {getEndTime(selectedTime)}</p>
                <p><strong>Valor:</strong> R$ {court?.hourlyRate || 120},00</p>
                <p className="text-yellow-400 text-sm"><strong>Status:</strong> Aguardando aprovação do gestor</p>
              </div>
              
              <Button
                onClick={handleBooking}
                className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white py-4 text-lg font-semibold"
              >
                Solicitar Agendamento
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
