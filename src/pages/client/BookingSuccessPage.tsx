import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Calendar, Clock, User, Phone, Mail, MapPin, Users } from "lucide-react";

const BookingSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, court } = location.state || {};

  console.log('BookingSuccessPage - booking:', booking);
  console.log('BookingSuccessPage - court:', court);

  if (!booking || !court) {
    console.log('BookingSuccessPage - Missing data, redirecting to dashboard');
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B] flex items-center justify-center">
        <div className="text-white text-center">
          <p>Informações do agendamento não encontradas</p>
          <Button onClick={() => navigate('/cliente/dashboard')} className="mt-4">
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Corrigir a renderização do court.location
  const getCourtLocationText = (location: any) => {
    if (typeof location === 'string') {
      return location;
    }
    if (typeof location === 'object' && location) {
      return location.address || location.name || 'Localização não informada';
    }
    return 'Localização não informada';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B]">
      <div className="p-4 space-y-6">
        {/* Success Header */}
        <div className="text-center py-8">
          <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Agendamento Confirmado!</h1>
          <p className="text-white/70">Ordem de agendamento enviada com sucesso ao gestor</p>
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
                <p className="font-semibold">{booking.formattedDate}</p>
                <p className="text-white/70 text-sm">Data do agendamento</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-white">
              <Clock className="w-5 h-5 text-[#F35410]" />
              <div>
                <p className="font-semibold">{booking.startTime} - {booking.endTime}</p>
                <p className="text-white/70 text-sm">Horário da partida</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-white">
              <MapPin className="w-5 h-5 text-[#F35410]" />
              <div>
                <p className="font-semibold">{booking.courtName}</p>
                <p className="text-white/70 text-sm">{getCourtLocationText(court.location)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-white">
              <Users className="w-5 h-5 text-[#F35410]" />
              <div>
                <p className="font-semibold">{booking.numberOfPlayers} pessoas</p>
                <p className="text-white/70 text-sm">Participantes esperados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client Data */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Dados Enviados ao Gestor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-white">
              <User className="w-5 h-5 text-[#F35410]" />
              <span>{booking.userName}</span>
            </div>
            
            <div className="flex items-center gap-3 text-white">
              <Phone className="w-5 h-5 text-[#F35410]" />
              <span>{booking.userPhone}</span>
            </div>
            
            <div className="flex items-center gap-3 text-white">
              <Mail className="w-5 h-5 text-[#F35410]" />
              <span>{booking.userEmail}</span>
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
              <p className="text-white font-semibold text-lg">R$ {(booking.totalPrice + booking.serviceFee)},00</p>
              <p className="text-white/90 text-sm">Pagamento será realizado no local no balcão</p>
            </div>
          </CardContent>
        </Card>

        {/* Status Info */}
        <Card className="bg-green-500/20 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-green-200">Status da Ordem</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-green-200 text-sm">
              ✅ Ordem de agendamento enviada ao gestor da quadra
            </p>
            <p className="text-green-200 text-sm">
              ✅ Seus dados foram compartilhados automaticamente
            </p>
            <p className="text-green-200 text-sm">
              ✅ Horário reservado com sucesso
            </p>
            <p className="text-green-200 text-sm">
              ✅ Você pode acompanhar o status no seu painel
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/cliente/dashboard')}
            className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white py-3"
          >
            Voltar ao Dashboard
          </Button>
          
          <Button 
            onClick={() => navigate('/cliente/agendamentos')}
            variant="outline" 
            className="w-full border-white/20 text-white hover:bg-white/10"
          >
            Ver Meus Agendamentos
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
