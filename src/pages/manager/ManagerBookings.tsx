
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, User, Phone, Mail } from "lucide-react";
import { useBookings } from "@/hooks/useBookings";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ManagerBookings = () => {
  const navigate = useNavigate();
  const { bookings } = useBookings();
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming'>('all');

  const today = new Date().toISOString().split('T')[0];
  
  const filteredBookings = bookings.filter(booking => {
    switch (filter) {
      case 'today':
        return booking.date === today;
      case 'upcoming':
        return booking.date >= today;
      default:
        return true;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B]">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/gestor/dashboard')}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-white">Agendamentos</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Filter Buttons */}
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-[#F35410] hover:bg-[#BA2D0B]' : 'border-white/20 text-white hover:bg-white/10'}
          >
            Todos
          </Button>
          <Button
            variant={filter === 'today' ? 'default' : 'outline'}
            onClick={() => setFilter('today')}
            className={filter === 'today' ? 'bg-[#F35410] hover:bg-[#BA2D0B]' : 'border-white/20 text-white hover:bg-white/10'}
          >
            Hoje
          </Button>
          <Button
            variant={filter === 'upcoming' ? 'default' : 'outline'}
            onClick={() => setFilter('upcoming')}
            className={filter === 'upcoming' ? 'bg-[#F35410] hover:bg-[#BA2D0B]' : 'border-white/20 text-white hover:bg-white/10'}
          >
            Próximos
          </Button>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <Calendar className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/70">Nenhum agendamento encontrado</p>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking) => (
              <Card key={booking.id} className="bg-white/10 border-white/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#F35410]" />
                      <span className="text-white font-semibold">
                        {format(new Date(booking.date), "dd 'de' MMMM", { locale: ptBR })}
                      </span>
                    </div>
                    <Badge className={`${getStatusColor(booking.status)} text-white`}>
                      {getStatusText(booking.status)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-white">
                      <Clock className="w-4 h-4 text-[#F35410]" />
                      <span>{booking.startTime} - {booking.endTime}</span>
                      <span className="text-white/60">({booking.duration}h)</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-white">
                      <User className="w-4 h-4 text-[#F35410]" />
                      <span>{booking.userName}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-white">
                      <Phone className="w-4 h-4 text-[#F35410]" />
                      <span>{booking.userPhone}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-white">
                      <Mail className="w-4 h-4 text-[#F35410]" />
                      <span>{booking.userEmail}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-white/20">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-sm">Valor:</span>
                      <span className="text-[#F35410] font-semibold">R$ {booking.totalPrice}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerBookings;
