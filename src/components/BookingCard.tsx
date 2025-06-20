
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Star, X } from 'lucide-react';
import { Booking, BookingStatus } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BookingCardProps {
  booking: Booking;
  onRate?: (bookingId: string) => void;
  onCancel?: (bookingId: string) => void;
  onViewDetails?: (bookingId: string) => void;
}

const BookingCard = ({ booking, onRate, onCancel, onViewDetails }: BookingCardProps) => {
  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case BookingStatus.PENDING:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case BookingStatus.CANCELLED_BY_USER:
      case BookingStatus.CANCELLED_BY_MANAGER:
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case BookingStatus.COMPLETED:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-white/10 text-white border-white/20';
    }
  };

  const getStatusText = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return 'Confirmado';
      case BookingStatus.PENDING:
        return 'Pendente';
      case BookingStatus.CANCELLED_BY_USER:
      case BookingStatus.CANCELLED_BY_MANAGER:
        return 'Cancelado';
      case BookingStatus.COMPLETED:
        return 'Concluído';
      default:
        return status;
    }
  };

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), "dd 'de' MMMM", { locale: ptBR });
    } catch {
      return date;
    }
  };

  const canCancel = booking.status === BookingStatus.PENDING || booking.status === BookingStatus.CONFIRMED;
  const canRate = booking.status === BookingStatus.COMPLETED && !booking.rating;

  return (
    <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-all">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <img 
            src={booking.courtImage} 
            alt={booking.courtName}
            className="w-20 h-20 rounded-lg object-cover"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-white text-lg truncate">
                  {booking.courtName}
                </h4>
                <div className="flex items-center gap-4 text-white/70 text-sm mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(booking.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{booking.startTime}</span>
                  </div>
                </div>
              </div>
              
              <Badge className={`border ${getStatusColor(booking.status)}`}>
                {getStatusText(booking.status)}
              </Badge>
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-[#F35410] font-bold text-lg">
                R$ {booking.totalPrice},00
              </span>
              <span className="text-white/60 text-sm">
                {booking.duration}h de duração
              </span>
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

            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap">
              {canRate && onRate && (
                <Button
                  size="sm"
                  className="bg-[#F35410] hover:bg-[#BA2D0B] text-white"
                  onClick={() => onRate(booking.id)}
                >
                  <Star className="w-4 h-4 mr-1" />
                  Avaliar
                </Button>
              )}
              
              {canCancel && onCancel && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                  onClick={() => onCancel(booking.id)}
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancelar
                </Button>
              )}
              
              {onViewDetails && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={() => onViewDetails(booking.id)}
                >
                  Ver Detalhes
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
