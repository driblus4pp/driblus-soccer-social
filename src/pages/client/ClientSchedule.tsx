import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Clock, MapPin, Info, X, Star } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import BottomNavigation from "@/components/navigation/BottomNavigation";
import { useBookings } from "@/hooks/useBookings";
import { useAuth } from "@/contexts/AuthContext";
import { BookingStatus } from "@/types";
import RatingModal from "@/components/RatingModal";
const ClientSchedule = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedBookingForRating, setSelectedBookingForRating] = useState<any>(null);
  
  const { user } = useAuth();
  const { bookings, addRating, cancelBooking } = useBookings();
  
  // Filter bookings for current user only
  const userBookings = bookings.filter(booking => booking.userId === user?.id || booking.userId === 'user_1');

  // Check for tab parameter in URL
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['upcoming', 'pending', 'completed'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);
  const getStatusConfig = (status: BookingStatus) => {
    const statusConfig = {
      [BookingStatus.CONFIRMED]: {
        text: 'Confirmado',
        color: 'bg-green-500',
        message: 'Seu agendamento foi confirmado pela gestão da quadra. Você pode comparecer no horário marcado.'
      },
      [BookingStatus.PENDING]: {
        text: 'Pendente',
        color: 'bg-yellow-500',
        message: 'Aguardando confirmação da gestão da quadra. Você receberá uma notificação quando for aprovado.'
      },
      [BookingStatus.COMPLETED]: {
        text: 'Concluído',
        color: 'bg-blue-500',
        message: 'Agendamento realizado com sucesso. Obrigado por usar nossos serviços!'
      },
      [BookingStatus.CANCELLED_BY_USER]: {
        text: 'Cancelado',
        color: 'bg-red-500',
        message: 'Você cancelou este agendamento.'
      },
      [BookingStatus.CANCELLED_BY_MANAGER]: {
        text: 'Cancelado',
        color: 'bg-red-500',
        message: 'Este agendamento foi cancelado pela gestão da quadra.'
      }
    };
    return statusConfig[status] || statusConfig[BookingStatus.PENDING];
  };
  const handleCardClick = (booking: any) => {
    setSelectedBooking(booking);
    setShowStatusDialog(true);
  };
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM", {
        locale: ptBR
      });
    } catch {
      return dateString;
    }
  };
  const filterBookings = (status: string) => {
    if (status === 'upcoming') return userBookings.filter(b => 
      b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.PENDING
    );
    if (status === 'completed') return userBookings.filter(b => 
      b.status === BookingStatus.COMPLETED
    );
    return userBookings.filter(b => b.status === BookingStatus.PENDING);
  };
  
  const filteredBookings = filterBookings(activeTab);
  
  const handleRateBooking = (booking: any) => {
    setSelectedBookingForRating(booking);
    setIsRatingModalOpen(true);
  };

  const handleSubmitRating = (bookingId: string, stars: number, comment: string) => {
    addRating(bookingId, stars, comment);
    setIsRatingModalOpen(false);
    setSelectedBookingForRating(null);
  };
  return <div className="min-h-screen bg-[#093758] pb-20">
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
          </div> : filteredBookings.map(booking => <Card key={booking.id} className="bg-white/10 border-white/20 cursor-pointer hover:bg-white/15 transition-colors" onClick={() => handleCardClick(booking)}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-white">{booking.courtName}</h3>
                <Badge className={`${getStatusConfig(booking.status).color} text-white text-xs`}>
                  {getStatusConfig(booking.status).text}
                </Badge>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(booking.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{booking.startTime} - {booking.endTime}</span>
                </div>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{booking.courtName}</span>
                </div>
              </div>

              {/* Rating Display */}
              {booking.rating && (
                <div className="mb-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= booking.rating!.stars
                              ? 'text-yellow-400 fill-current'
                              : 'text-white/30'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-white/70 text-sm">Sua avaliação</span>
                  </div>
                  <p className="text-white/80 text-sm">{booking.rating.comment}</p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="font-bold text-[#F35410] text-lg">R$ {booking.totalPrice}</span>
                {booking.status === BookingStatus.COMPLETED && !booking.rating && (
                  <Button
                    size="sm"
                    className="bg-[#F35410] hover:bg-[#BA2D0B] text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRateBooking(booking);
                    }}
                  >
                    <Star className="w-4 h-4 mr-1" />
                    Avaliar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>)}
      </div>

      {/* Status Information Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent className="bg-[#093758] border-white/20 text-white max-w-sm mx-4">
          <DialogHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">
                Detalhes do Agendamento
              </DialogTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowStatusDialog(false)} className="text-white/70 hover:text-white h-6 w-6 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          
          {selectedBooking && <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-white mb-2">{selectedBooking.courtName}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={`${getStatusConfig(selectedBooking.status).color} text-white text-sm`}>
                    {getStatusConfig(selectedBooking.status).text}
                  </Badge>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-white/80 leading-relaxed">
                    {getStatusConfig(selectedBooking.status).message}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(selectedBooking.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{selectedBooking.startTime} - {selectedBooking.endTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedBooking.location}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-[#F35410] text-lg">R$ {selectedBooking.totalPrice}</span>
                </div>
                
                {/* Ações para agendamentos confirmados */}
                {selectedBooking.status === BookingStatus.CONFIRMED && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-white/20 text-white hover:bg-white/10"
                      onClick={() => {
                        // TODO: Implementar alteração de data/horário
                        console.log('Alterar data/horário para booking:', selectedBooking.id);
                      }}
                    >
                      Alterar Data/Horário
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        cancelBooking(selectedBooking.id, 'Cancelado pelo cliente');
                        setShowStatusDialog(false);
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            </div>}
        </DialogContent>
      </Dialog>

      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => {
          setIsRatingModalOpen(false);
          setSelectedBookingForRating(null);
        }}
        booking={selectedBookingForRating}
        onSubmit={handleSubmitRating}
      />

      <BottomNavigation userType="client" />
    </div>;
};
export default ClientSchedule;