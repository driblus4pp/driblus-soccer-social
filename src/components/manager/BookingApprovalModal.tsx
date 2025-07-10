import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, User, Clock, Calendar, MapPin, Users } from "lucide-react";
import { Booking } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BookingApprovalModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (bookingId: string) => void;
  onReject: (bookingId: string, reason: string) => void;
}

const BookingApprovalModal = ({ 
  booking, 
  isOpen, 
  onClose, 
  onApprove, 
  onReject 
}: BookingApprovalModalProps) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);

  const handleSubmit = () => {
    if (!booking) return;

    if (action === 'approve') {
      onApprove(booking.id);
    } else if (action === 'reject' && rejectionReason.trim()) {
      onReject(booking.id, rejectionReason);
    }

    // Reset state
    setRejectionReason('');
    setAction(null);
    onClose();
  };

  const handleClose = () => {
    setRejectionReason('');
    setAction(null);
    onClose();
  };

  if (!booking) return null;

  const bookingDate = new Date(booking.date);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Aprovar Agendamento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações do Agendamento */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="font-medium">
                {format(bookingDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>{booking.startTime} - {booking.endTime}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{booking.courtName}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-gray-500" />
              <span>{booking.numberOfPlayers} jogadores</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-[#F35410]">
                R$ {booking.totalPrice}
              </span>
            </div>
          </div>

          {/* Informações do Cliente */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 font-medium text-blue-800">
              <User className="w-4 h-4" />
              Dados do Cliente
            </div>
            <div className="text-sm space-y-1">
              <p><span className="font-medium">Nome:</span> {booking.userName}</p>
              <p><span className="font-medium">Email:</span> {booking.userEmail}</p>
              <p><span className="font-medium">Telefone:</span> {booking.userPhone}</p>
            </div>
          </div>

          {/* Campo de motivo (apenas para rejeição) */}
          {action === 'reject' && (
            <div className="space-y-2">
              <Label htmlFor="reason">Motivo da recusa *</Label>
              <Textarea
                id="reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explique o motivo da recusa do agendamento..."
                rows={3}
              />
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setAction('approve')}
              className={`flex-1 ${action === 'approve' ? 'bg-green-50 border-green-200' : ''}`}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Aprovar
            </Button>
            <Button
              variant="outline"
              onClick={() => setAction('reject')}
              className={`flex-1 ${action === 'reject' ? 'bg-red-50 border-red-200' : ''}`}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Recusar
            </Button>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!action || (action === 'reject' && !rejectionReason.trim())}
              className="flex-1 bg-[#F35410] hover:bg-[#BA2D0B]"
            >
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingApprovalModal;