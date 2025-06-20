import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Users, Calendar, ExternalLink } from 'lucide-react';
import BookingCalendar from './BookingCalendar';
import { googleCalendarService } from '../services/googleCalendarService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
interface BookingDetailsProps {
  court: any;
  bookingData: any;
  onNext: () => void;
  onUpdateData: (data: any) => void;
}
const BookingDetails = ({
  court,
  bookingData,
  onNext,
  onUpdateData
}: BookingDetailsProps) => {
  const [formData, setFormData] = useState({
    numberOfPeople: bookingData.numberOfPeople.toString(),
    observations: bookingData.observations,
    needsEquipment: bookingData.needsEquipment,
    selectedDate: bookingData.selectedDate,
    selectedTime: bookingData.selectedTime
  });
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
  const handleDateTimeSelect = (date: Date, time: string) => {
    setFormData(prev => ({
      ...prev,
      selectedDate: date,
      selectedTime: time
    }));
  };
  const handleConnectGoogleCalendar = async () => {
    setIsConnectingGoogle(true);
    try {
      const success = await googleCalendarService.authenticate();
      if (success) {
        console.log('Google Calendar conectado com sucesso!');
      } else {
        console.log('Falha ao conectar com Google Calendar');
      }
    } catch (error) {
      console.error('Erro ao conectar:', error);
    } finally {
      setIsConnectingGoogle(false);
    }
  };
  const handleContinue = () => {
    if (!formData.selectedDate || !formData.selectedTime) {
      alert('Por favor, selecione uma data e horário');
      return;
    }
    onUpdateData({
      numberOfPeople: parseInt(formData.numberOfPeople),
      observations: formData.observations,
      needsEquipment: formData.needsEquipment,
      selectedDate: formData.selectedDate,
      selectedTime: formData.selectedTime,
      formattedDateTime: format(formData.selectedDate, "dd 'de' MMMM", {
        locale: ptBR
      }) + ` • ${formData.selectedTime} - ${parseInt(formData.selectedTime.split(':')[0]) + 1}:00`
    });
    onNext();
  };
  return <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Detalhes da Reserva</h2>
        <p className="text-white/70">Preencha os dados para sua reserva</p>
      </div>

      {/* Google Calendar Integration */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Integração Google Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm">
                {googleCalendarService.isAuthenticated() ? "✅ Conectado ao Google Calendar" : "Conecte ao Google Calendar para sincronizar horários"}
              </p>
            </div>
            <Button onClick={handleConnectGoogleCalendar} disabled={isConnectingGoogle || googleCalendarService.isAuthenticated()} variant="outline" className="border-white/20 hover:bg-white/10 text-slate-950">
              {isConnectingGoogle ? "Conectando..." : googleCalendarService.isAuthenticated() ? "Conectado" : <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Conectar
                </>}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Component */}
      <BookingCalendar court={court} onDateTimeSelect={handleDateTimeSelect} selectedDate={formData.selectedDate} selectedTime={formData.selectedTime} />

      {/* Booking Information */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Informações da Reserva
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="people" className="text-white">Número de pessoas</Label>
            <Select value={formData.numberOfPeople} onValueChange={value => setFormData(prev => ({
            ...prev,
            numberOfPeople: value
          }))}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Selecione o número de pessoas" />
              </SelectTrigger>
              <SelectContent className="bg-[#062B4B] border-white/20">
                {Array.from({
                length: 20
              }, (_, i) => i + 1).map(num => <SelectItem key={num} value={num.toString()} className="text-white hover:bg-white/10">
                    {num} {num === 1 ? 'pessoa' : 'pessoas'}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observations" className="text-white">Observações (opcional)</Label>
            <Textarea id="observations" placeholder="Adicione observações sobre sua reserva..." value={formData.observations} onChange={e => setFormData(prev => ({
            ...prev,
            observations: e.target.value
          }))} className="bg-white/10 border-white/20 text-white placeholder:text-white/60 min-h-[100px]" />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="equipment" checked={formData.needsEquipment} onCheckedChange={checked => setFormData(prev => ({
            ...prev,
            needsEquipment: !!checked
          }))} className="border-white/20" />
            <Label htmlFor="equipment" className="text-white cursor-pointer">
              Preciso de equipamentos
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Court Summary */}
      <Card className="bg-white/10 border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-semibold text-white">{court.name}</h4>
              <p className="text-white/70 text-sm">
                {formData.selectedDate && formData.selectedTime ? format(formData.selectedDate, "dd 'de' MMMM", {
                locale: ptBR
              }) + ` • ${formData.selectedTime} - ${parseInt(formData.selectedTime.split(':')[0]) + 1}:00` : "Selecione data e horário"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#F35410]">{court.price}</p>
              <p className="text-white/70 text-sm">Pagamento na quadra</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleContinue} disabled={!formData.selectedDate || !formData.selectedTime} className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed">
        Confirmar Agendamento
      </Button>
    </div>;
};
export default BookingDetails;