
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Star } from 'lucide-react';
import { Booking } from '@/types';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onSubmit: (bookingId: string, stars: number, comment: string) => void;
}

const RatingModal = ({ isOpen, onClose, booking, onSubmit }: RatingModalProps) => {
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = () => {
    if (booking && stars > 0) {
      onSubmit(booking.id, stars, comment);
      setStars(0);
      setComment('');
      onClose();
    }
  };

  const handleClose = () => {
    setStars(0);
    setComment('');
    onClose();
  };

  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#062B4B] border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Avalie sua experiência
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Court Info */}
          <div className="text-center">
            <img 
              src={booking.courtImage} 
              alt={booking.courtName}
              className="w-20 h-20 rounded-lg object-cover mx-auto mb-3"
            />
            <h3 className="font-semibold text-lg">{booking.courtName}</h3>
            <p className="text-white/70 text-sm">
              {booking.date} • {booking.time}
            </p>
          </div>

          {/* Star Rating */}
          <div className="text-center">
            <p className="text-white/90 mb-3">Como foi sua experiência?</p>
            <div className="flex justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  className="p-1 transition-transform hover:scale-110"
                  onClick={() => setStars(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredStar || stars)
                        ? 'text-yellow-400 fill-current'
                        : 'text-white/30'
                    }`}
                  />
                </button>
              ))}
            </div>
            {stars > 0 && (
              <p className="text-white/70 text-sm">
                {stars === 1 && "Muito ruim"}
                {stars === 2 && "Ruim"}
                {stars === 3 && "Regular"}
                {stars === 4 && "Bom"}
                {stars === 5 && "Excelente"}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Conte-nos mais sobre sua experiência (opcional)
            </label>
            <Textarea
              value={comment}
              onChange={(e) => {
                if (e.target.value.length <= 140) {
                  setComment(e.target.value);
                }
              }}
              placeholder="Compartilhe sua opinião sobre a quadra, atendimento, instalações..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 resize-none h-20"
              maxLength={140}
            />
            <div className="flex justify-between mt-1">
              <span className="text-white/60 text-xs">
                Máximo 140 caracteres
              </span>
              <span className={`text-xs ${comment.length > 120 ? 'text-yellow-400' : 'text-white/60'}`}>
                {comment.length}/140
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={stars === 0}
              className="flex-1 bg-[#F35410] hover:bg-[#BA2D0B] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enviar Avaliação
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;
