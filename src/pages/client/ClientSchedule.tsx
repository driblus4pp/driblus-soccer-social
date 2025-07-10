
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar, Clock, MapPin, Info } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import BottomNavigation from "@/components/navigation/BottomNavigation";

const mockBookings = [{
  id: '1',
  courtName: 'No Alvo Society',
  date: '2024-06-22',
  time: '19:00',
  duration: '1h',
  status: 'confirmed',
  price: 'R$ 120',
  location: 'Aldeota, Fortaleza'
}, {
  id: '2',
  courtName: 'Gol de Placa',
  date: '2024-06-25',
  time: '20:00',
  duration: '1h',
  status: 'pending',
  price: 'R$ 150',
  location: 'Meireles, Fortaleza'
}, {
  id: '3',
  courtName: 'Arena Pro Sports',
  date: '2024-06-20',
  time: '18:00',
  duration: '1h',
  status: 'completed',
  price: 'R$ 200',
  location: 'Cocó, Fortaleza'
}];

const ClientSchedule = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('upcoming');

  // Check for tab parameter in URL
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['upcoming', 'pending', 'completed'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const getStatusConfig = (status: string) => {
    const statusConfig = {
      confirmed: {
        text: 'Confirmado',
        color: 'bg-green-500',
        message: 'Seu agendamento foi confirmado pela gestão da quadra. Você pode comparecer no horário marcado.'
      },
      pending: {
        text: 'Pendente',
        color: 'bg-yellow-500',
        message: 'Aguardando confirmação da gestão da quadra. Você receberá uma notificação quando for aprovado.'
      },
      completed: {
        text: 'Concluído',
        color: 'bg-blue-500',
        message: 'Agendamento realizado com sucesso. Obrigado por usar nossos serviços!'
      },
      cancelled: {
        text: 'Cancelado',
        color: 'bg-red-500',
        message: 'Este agendamento foi cancelado. Entre em contato conosco se precisar de mais informações.'
      }
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const getStatusBadge = (status: string) => {
    const config = getStatusConfig(status);
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">
            <Badge className={`${config.color} text-white text-xs flex items-center gap-1`}>
              {config.text}
              <Info className="w-3 h-3" />
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-sm">{config.message}</p>
        </TooltipContent>
      </Tooltip>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const filterBookings = (status: string) => {
    if (status === 'upcoming') return mockBookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
    if (status === 'completed') return mockBookings.filter(b => b.status === 'completed');
    return mockBookings.filter(b => b.status === 'pending');
  };

  const filteredBookings = filterBookings(activeTab);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#093758] pb-20">
        {/* Header */}
        <div className="px-4 py-6 bg-[#093758]">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-xl font-semibold text-white">Meus Agendamentos</h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white/10 rounded-lg p-1">
            {[{
            id: 'upcoming',
            label: 'Próximas'
          }, {
            id: 'pending',
            label: 'Pendentes'
          }, {
            id: 'completed',
            label: 'Histórico'
          }].map(tab => <Button key={tab.id} variant={activeTab === tab.id ? "default" : "ghost"} size="sm" onClick={() => setActiveTab(tab.id)} className={`flex-1 ${activeTab === tab.id ? 'bg-[#F35410] text-white hover:bg-[#BA2D0B]' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
                {tab.label}
              </Button>)}
          </div>
        </div>

        <div className="px-4 space-y-4">
          {filteredBookings.length === 0 ? <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                {activeTab === 'upcoming' && 'Nenhum agendamento próximo'}
                {activeTab === 'pending' && 'Nenhum agendamento pendente'}
                {activeTab === 'completed' && 'Nenhum histórico ainda'}
              </h3>
              <p className="text-white/60 text-sm">
                Suas reservas aparecerão aqui
              </p>
            </div> : filteredBookings.map(booking => <Card key={booking.id} className="bg-white/10 border-white/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-white">{booking.courtName}</h3>
                    {getStatusBadge(booking.status)}
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(booking.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{booking.time} • {booking.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{booking.location}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#F35410] text-lg">{booking.price}</span>
                    {booking.status === 'pending' && <Button size="sm" className="bg-[#F35410] hover:bg-[#BA2D0B] text-white">
                        Confirmar
                      </Button>}
                  </div>
                </CardContent>
              </Card>)}
        </div>

        <BottomNavigation userType="client" />
      </div>
    </TooltipProvider>
  );
};

export default ClientSchedule;
