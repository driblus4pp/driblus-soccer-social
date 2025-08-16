import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, MapPin, Calendar, Clock, Users, CreditCard } from "lucide-react";
import { useBookings } from "@/hooks/useBookings";
const BookingConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    createBooking
  } = useBookings();
  const [paymentAccepted, setPaymentAccepted] = useState(false);
  const {
    bookingData,
    court
  } = location.state || {};
  console.log('BookingConfirmationPage - bookingData:', bookingData);
  console.log('BookingConfirmationPage - court:', court);
  if (!bookingData || !court) {
    console.log('BookingConfirmationPage - Missing data, redirecting to dashboard');
    return <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B] flex items-center justify-center">
        <div className="text-white text-center">
          <p>Dados do agendamento não encontrados</p>
          <Button onClick={() => navigate('/cliente/dashboard')} className="mt-4">
            Voltar ao Dashboard
          </Button>
        </div>
      </div>;
  }
  const handleConfirmBooking = () => {
    console.log('BookingConfirmationPage - handleConfirmBooking called');
    console.log('BookingConfirmationPage - paymentAccepted:', paymentAccepted);
    if (!paymentAccepted) {
      alert('Por favor, confirme que concorda com o pagamento no local');
      return;
    }
    console.log('BookingConfirmationPage - Creating booking with data:', bookingData);

    // Criar booking com status CONFIRMED (ordem direta para o gestor)
    const newBooking = createBooking({
      ...bookingData,
      status: 'CONFIRMED'
    });
    console.log('BookingConfirmationPage - Booking created:', newBooking);
    console.log('BookingConfirmationPage - Navigating to success page');

    // Redirecionar para página de sucesso
    navigate('/cliente/agendamento-sucesso', {
      state: {
        booking: newBooking,
        court: court
      }
    });
  };
  const totalPrice = bookingData.totalPrice; // Removida a taxa de serviço

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
  return <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B]">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-white">Resumo da Reserva</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Court Information */}
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <img src={bookingData.courtImage} alt={bookingData.courtName} className="w-20 h-20 rounded-lg object-cover" />
              <div className="flex-1">
                <h2 className="text-white font-bold text-lg">{bookingData.courtName}</h2>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{getCourtLocationText(court.location)}</span>
                </div>
                <div className="mt-2">
                  
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Details */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-lg">Detalhes da Reserva</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#F35410]" />
                <span>Data</span>
              </div>
              <span className="font-semibold">{bookingData.formattedDate}</span>
            </div>

            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#F35410]" />
                <span>Horário</span>
              </div>
              <span className="font-semibold">{bookingData.startTime} - {bookingData.endTime}</span>
            </div>

            <div className="flex items-center justify-between text-white">
              <span>Duração</span>
              <span className="font-semibold">{bookingData.duration}h</span>
            </div>

            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#F35410]" />
                <span>Pessoas</span>
              </div>
              <span className="font-semibold">{bookingData.numberOfPlayers}</span>
            </div>
          </CardContent>
        </Card>

        {/* Price Breakdown */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-lg">Valores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-white">
              <span>Valor da quadra</span>
              <span>R$ {bookingData.totalPrice},00</span>
            </div>
            
            <div className="border-t border-white/20 pt-3">
              <div className="flex justify-between text-white font-bold text-lg">
                <span>Total</span>
                <span className="text-[#F35410]">R$ {totalPrice},00</span>
              </div>
              <p className="text-white/70 text-sm">Sem taxas adicionais</p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Forma de Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-[#F35410]/20 border border-[#F35410]/30 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#F35410]" />
                <div>
                  <p className="text-white font-semibold">Pagamento no Local</p>
                  <p className="text-white/70 text-sm">Dinheiro, PIX ou cartão no balcão</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Confirmation Checkbox */}
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Checkbox id="payment-confirmation" checked={paymentAccepted} onCheckedChange={checked => setPaymentAccepted(checked === true)} className="border-white/20 data-[state=checked]:bg-[#F35410] data-[state=checked]:border-[#F35410]" />
              <label htmlFor="payment-confirmation" className="text-white text-sm leading-relaxed cursor-pointer">
                Eu concordo em realizar o pagamento no valor de <strong>R$ {totalPrice},00</strong> diretamente no local, no balcão da quadra, podendo ser em dinheiro, PIX ou cartão.
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Confirm Button */}
        <Button onClick={handleConfirmBooking} disabled={!paymentAccepted} className={`w-full py-4 text-lg font-semibold ${paymentAccepted ? 'bg-[#F35410] hover:bg-[#BA2D0B] text-white' : 'bg-gray-600 text-gray-300 cursor-not-allowed'}`}>
          Confirmar Agendamento
        </Button>

        <p className="text-white/70 text-center text-sm">
          Ao confirmar, uma ordem de agendamento será enviada diretamente ao gestor da quadra
        </p>
      </div>
    </div>;
};
export default BookingConfirmationPage;