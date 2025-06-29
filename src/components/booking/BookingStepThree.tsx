
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Calendar, Clock, User, Phone, Mail, MapPin, Users } from "lucide-react";

interface BookingStepThreeProps {
  court: any;
  bookingData: any;
  userData: any;
  onFinish: () => void;
}

const BookingStepThree = ({ court, bookingData, userData, onFinish }: BookingStepThreeProps) => {
  const courtPrice = parseInt(court.price.replace('R$ ', '').replace('/hora', ''));

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center py-6">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Agendamento Solicitado!</h1>
        <p className="text-white/70">Sua solicitação foi enviada ao gestor da quadra</p>
      </div>

      {/* Booking Details */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Detalhes da Reserva</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 text-white">
            <Calendar className="w-5 h-5 text-[#F35410]" />
            <div>
              <p className="font-semibold">{bookingData.formattedDateTime}</p>
              <p className="text-white/70 text-sm">Data e horário</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-white">
            <MapPin className="w-5 h-5 text-[#F35410]" />
            <div>
              <p className="font-semibold">{court.name}</p>
              <p className="text-white/70 text-sm">{court.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-white">
            <Users className="w-5 h-5 text-[#F35410]" />
            <div>
              <p className="font-semibold">{bookingData.numberOfPeople} pessoas</p>
              <p className="text-white/70 text-sm">Participantes esperados</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Data */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Dados do Responsável</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 text-white">
            <User className="w-5 h-5 text-[#F35410]" />
            <span>{userData.name}</span>
          </div>
          
          <div className="flex items-center gap-3 text-white">
            <Phone className="w-5 h-5 text-[#F35410]" />
            <span>{userData.phone}</span>
          </div>
          
          <div className="flex items-center gap-3 text-white">
            <Mail className="w-5 h-5 text-[#F35410]" />
            <span>{userData.email}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Info */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Informações de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-4 bg-[#F35410]/20 rounded-lg">
            <p className="text-white font-semibold text-lg">R$ {courtPrice},00</p>
            <p className="text-white/90 text-sm">Pagamento será realizado no local</p>
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="bg-yellow-500/20 border-yellow-500/30">
        <CardHeader>
          <CardTitle className="text-yellow-200">Status da Solicitação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-yellow-200 text-sm">
            • O gestor foi notificado e analisará sua solicitação
          </p>
          <p className="text-yellow-200 text-sm">
            • Você receberá uma notificação quando houver uma resposta
          </p>
          <p className="text-yellow-200 text-sm">
            • O horário ficará reservado temporariamente
          </p>
        </CardContent>
      </Card>

      <Button 
        onClick={onFinish}
        className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white py-3"
      >
        Voltar ao Dashboard
      </Button>
    </div>
  );
};

export default BookingStepThree;
