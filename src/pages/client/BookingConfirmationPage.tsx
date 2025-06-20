
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Calendar, Clock, User, Phone, Mail, AlertCircle } from "lucide-react";

const BookingConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    booking,
    formattedDate,
    isPending
  } = location.state || {};

  if (!booking) {
    return <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B] flex items-center justify-center">
        <div className="text-white text-center">
          <p>Agendamento não encontrado</p>
          <Button onClick={() => navigate('/cliente/dashboard')} className="mt-4">
            Voltar ao Dashboard
          </Button>
        </div>
      </div>;
  }

  return <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B]">
      <div className="p-4 space-y-6">
        {/* Success Header */}
        <div className="text-center py-8">
          {isPending ? (
            <>
              <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-2">Solicitação Enviada!</h1>
              <p className="text-white/70">Aguardando aprovação do gestor da quadra</p>
            </>
          ) : (
            <>
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-2">Agendamento Confirmado!</h1>
              <p className="text-white/70">Seu horário foi reservado com sucesso</p>
            </>
          )}
        </div>

        {/* Status Alert */}
        {isPending && (
          <Card className="bg-yellow-500/20 border-yellow-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-white font-medium">Aguardando Aprovação</p>
                  <p className="text-white/70 text-sm">
                    O gestor da quadra foi notificado e analisará sua solicitação. 
                    Você receberá uma notificação quando houver uma resposta.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Booking Details */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Detalhes da Reserva</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-white">
              <Calendar className="w-5 h-5 text-[#F35410]" />
              <div>
                <p className="font-semibold">{formattedDate}</p>
                <p className="text-white/70 text-sm">Data do agendamento</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-white">
              <Clock className="w-5 h-5 text-[#F35410]" />
              <div>
                <p className="font-semibold">{booking.time} - {parseInt(booking.time.split(':')[0]) + 1}:00</p>
                <p className="text-white/70 text-sm">Horário da partida</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client Data */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Dados do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-white">
              <User className="w-5 h-5 text-[#F35410]" />
              <span>{booking.clientData.name}</span>
            </div>
            
            <div className="flex items-center gap-3 text-white">
              <Phone className="w-5 h-5 text-[#F35410]" />
              <span>{booking.clientData.phone}</span>
            </div>
            
            <div className="flex items-center gap-3 text-white">
              <Mail className="w-5 h-5 text-[#F35410]" />
              <span>{booking.clientData.email}</span>
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
              <p className="text-white font-semibold text-lg">R$ 120,00</p>
              <p className="text-white/90 text-sm">
                {isPending ? 'Pagamento será cobrado após aprovação' : 'Pagamento será realizado no local'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Observações Importantes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {isPending ? (
              <>
                <p className="text-white/90 text-sm">
                  • O gestor tem até 24h para aprovar ou rejeitar a solicitação
                </p>
                <p className="text-white/90 text-sm">
                  • Você será notificado por email sobre a decisão
                </p>
                <p className="text-white/90 text-sm">
                  • O horário ficará reservado temporariamente
                </p>
                <p className="text-white/90 text-sm">
                  • Você pode acompanhar o status no seu painel
                </p>
              </>
            ) : (
              <>
                <p className="text-white/90 text-sm">
                  • Chegue com 10 minutos de antecedência
                </p>
                <p className="text-white/90 text-sm">
                  • O pagamento deve ser feito diretamente na quadra
                </p>
                <p className="text-white/90 text-sm">
                  • Para cancelar, entre em contato com até 24h de antecedência
                </p>
                <p className="text-white/90 text-sm">
                  • O gestor da quadra receberá seus dados automaticamente
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button onClick={() => navigate('/cliente/dashboard')} className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white py-3">
            Voltar ao Dashboard
          </Button>
          
          <Button variant="outline" onClick={() => navigate('/cliente/dashboard')} className="w-full border-white/20 text-slate-950 bg-slate-50">
            Fazer Novo Agendamento
          </Button>
        </div>
      </div>
    </div>;
};

export default BookingConfirmationPage;
