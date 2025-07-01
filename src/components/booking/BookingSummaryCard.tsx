
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BookingSummaryCardProps {
  selectedDate: Date;
  selectedTime: string;
  numberOfPeople: string;
  courtPrice: number;
  onProceed: () => void;
}

const getEndTime = (startTime: string) => {
  const [hour] = startTime.split(':');
  return `${parseInt(hour) + 1}:00`;
};

const BookingSummaryCard = ({ 
  selectedDate, 
  selectedTime, 
  numberOfPeople, 
  courtPrice, 
  onProceed 
}: BookingSummaryCardProps) => {
  return (
    <Card className="bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Resumo do Agendamento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-white">
          <p><strong>Data:</strong> {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
          <p><strong>Horário:</strong> {selectedTime} - {getEndTime(selectedTime)}</p>
          <p><strong>Participantes:</strong> {numberOfPeople} pessoas</p>
          <p><strong>Valor:</strong> R$ {courtPrice},00</p>
          <p className="text-sm text-white/70">* Sem taxa de serviço adicional</p>
        </div>
        
        <Button
          onClick={onProceed}
          className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white py-4 text-lg font-semibold"
        >
          Prosseguir para Confirmação
        </Button>
      </CardContent>
    </Card>
  );
};

export default BookingSummaryCard;
