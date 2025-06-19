
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Users, FileText } from 'lucide-react';

interface BookingSummaryProps {
  court: any;
  bookingData: any;
  onNext: () => void;
  onUpdateData: (data: any) => void;
}

const BookingSummary = ({ court, bookingData, onNext }: BookingSummaryProps) => {
  const courtPrice = parseInt(court.price.replace('R$ ', '').replace('/hora', ''));
  const totalPrice = courtPrice + bookingData.serviceFee;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Resumo da Reserva</h2>
        <p className="text-white/70">Confirme os detalhes da sua reserva</p>
      </div>

      {/* Court Info Card */}
      <Card className="bg-white/10 border-white/20">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <img 
              src={court.image} 
              alt={court.name} 
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-white text-lg">{court.name}</h4>
              <div className="flex items-center gap-1 text-white/70 text-sm mt-1">
                <MapPin className="w-4 h-4" />
                <span>{court.location}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Details */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Detalhes da Reserva
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/90">
              <Clock className="w-4 h-4" />
              <span>Data e horário</span>
            </div>
            <span className="text-white font-semibold">20 de dezembro • 19:00 - 20:00</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/90">
              <Users className="w-4 h-4" />
              <span>Número de pessoas</span>
            </div>
            <span className="text-white font-semibold">{bookingData.numberOfPeople} pessoas</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white/90">Duração</span>
            <span className="text-white font-semibold">{bookingData.duration} hora</span>
          </div>

          {bookingData.observations && (
            <div className="pt-2 border-t border-white/20">
              <p className="text-white/90 text-sm">Observações:</p>
              <p className="text-white text-sm mt-1">{bookingData.observations}</p>
            </div>
          )}

          {bookingData.needsEquipment && (
            <div className="pt-2">
              <span className="text-green-400 text-sm">✓ Equipamentos solicitados</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Price Breakdown */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Resumo do Pagamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-white/90">
            <span>Valor da quadra</span>
            <span>R$ {courtPrice},00</span>
          </div>
          <div className="flex justify-between text-white/90">
            <span>Taxa de serviço</span>
            <span>R$ {bookingData.serviceFee},00</span>
          </div>
          <div className="border-t border-white/20 pt-3">
            <div className="flex justify-between text-white font-bold text-lg">
              <span>Total</span>
              <span>R$ {totalPrice},00</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancellation Policy */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-lg">Política de Cancelamento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/90 text-sm">
            Cancelamento gratuito até 24 horas antes do horário agendado. 
            Cancelamentos após esse prazo estarão sujeitos a cobrança de 50% do valor total.
          </p>
        </CardContent>
      </Card>

      <Button
        onClick={onNext}
        className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white font-semibold py-3"
      >
        Ir para Pagamento
      </Button>
    </div>
  );
};

export default BookingSummary;
