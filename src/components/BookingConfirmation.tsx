import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Calendar, Users, MapPin, Clock, CreditCard, Info } from 'lucide-react';
interface BookingConfirmationProps {
  court: any;
  bookingData: any;
  onBack: () => void;
}
const BookingConfirmation = ({
  court,
  bookingData,
  onBack
}: BookingConfirmationProps) => {
  const courtPrice = parseInt(court.price.replace('R$ ', '').replace('/hora', ''));
  const totalPrice = courtPrice + bookingData.serviceFee;
  const reservationCode = `RES${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
  return <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B] p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Success Header */}
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Agendamento Confirmado!</h2>
          <p className="text-white/70">Sua reserva foi realizada com sucesso</p>
        </div>

        {/* Reservation Details */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Detalhes da Reserva
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-white/90">Número da reserva</span>
              <span className="text-white font-semibold">{reservationCode}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-white/90">Pessoas</span>
              <span className="text-white font-semibold">{bookingData.numberOfPeople}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-white/90">Status</span>
              <Badge className="bg-green-600 text-white">Confirmado</Badge>
            </div>
            
            <div className="flex justify-between">
              <span className="text-white/90">Valor</span>
              <span className="text-white font-semibold">R$ {totalPrice},00</span>
            </div>
          </CardContent>
        </Card>

        {/* Court Info */}
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="flex gap-4 mb-4">
              <img src={court.image} alt={court.name} className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1">
                <h4 className="font-semibold text-white">{court.name}</h4>
                <div className="flex items-center gap-1 text-white/70 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{court.location}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-white/90 mb-2">
              <Clock className="w-4 h-4" />
              <span>20 de dezembro • 19:00 - 20:00</span>
            </div>
            
            <div className="flex items-center gap-2 text-white/90">
              <CreditCard className="w-4 h-4" />
              <span>Pagamento na quadra</span>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="bg-yellow-600/20 border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="text-yellow-200 font-semibold">Informações Importantes</h4>
                <ul className="text-yellow-200/90 text-sm space-y-1">
                  <li>• Chegue 15 minutos antes do horário</li>
                  
                  <li>• Confirmação enviada por email</li>
                  
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button onClick={onBack} className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white font-semibold py-3">
            Ver Meus Agendamentos
          </Button>
          
          <Button onClick={onBack} variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
            Buscar Mais Quadras
          </Button>
        </div>
      </div>
    </div>;
};
export default BookingConfirmation;