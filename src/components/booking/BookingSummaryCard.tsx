import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
interface BookingSummaryCardProps {
  selectedDate: Date;
  selectedTime: string;
  selectedHours: string;
  numberOfPeople: string;
  courtPrice: number;
  onProceed: () => void;
}
const getEndTime = (startTime: string, hours: number = 1) => {
  const [hour] = startTime.split(':');
  return `${parseInt(hour) + hours}:00`;
};
const BookingSummaryCard = ({
  selectedDate,
  selectedTime,
  selectedHours,
  numberOfPeople,
  courtPrice,
  onProceed
}: BookingSummaryCardProps) => {
  const hours = parseInt(selectedHours);
  const totalPrice = courtPrice * hours;
  const endTime = getEndTime(selectedTime, hours);
  return <Card className="bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Resumo do Agendamento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-white">
          <p><strong>Data:</strong> {format(selectedDate, "dd 'de' MMMM 'de' yyyy", {
            locale: ptBR
          })}</p>
          <p><strong>Horário:</strong> {selectedTime} - {endTime}</p>
          <p><strong>Duração:</strong> {hours} {hours === 1 ? 'hora' : 'horas'}</p>
          <p><strong>Participantes:</strong> {numberOfPeople} pessoas</p>
          <div className="space-y-1">
            <p><strong>Valor por hora:</strong> R$ {courtPrice},00</p>
            <p><strong>Valor total:</strong> R$ {totalPrice},00</p>
          </div>
          <p className="text-sm text-white/70">* Sem taxa de serviço adicional</p>
        </div>
        
        <Button onClick={onProceed} className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white py-4 font-semibold text-base">
          Prosseguir para Confirmação
        </Button>
      </CardContent>
    </Card>;
};
export default BookingSummaryCard;