
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { Court } from '@/types';

interface CourtApprovalModalProps {
  court: Court | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (courtId: string, comment?: string) => void;
  onReject: (courtId: string, comment: string) => void;
}

const CourtApprovalModal = ({ 
  court, 
  isOpen, 
  onClose, 
  onApprove, 
  onReject 
}: CourtApprovalModalProps) => {
  const [comment, setComment] = useState('');
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);

  const handleSubmit = () => {
    if (!court) return;

    if (action === 'approve') {
      onApprove(court.id, comment || undefined);
    } else if (action === 'reject') {
      onReject(court.id, comment);
    }

    // Reset state
    setComment('');
    setAction(null);
    onClose();
  };

  const handleClose = () => {
    setComment('');
    setAction(null);
    onClose();
  };

  if (!court) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Avaliação da Quadra
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">{court.name}</h3>
            <p className="text-sm text-gray-600">
              {court.location.address}, {court.location.city}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">
              {action === 'reject' ? 'Motivo da reprovação *' : 'Comentário (opcional)'}
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                action === 'reject' 
                  ? 'Explique o motivo da reprovação...'
                  : 'Adicione um comentário sobre a quadra...'
              }
              rows={3}
            />
          </div>

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
              Reprovar
            </Button>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!action || (action === 'reject' && !comment.trim())}
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

export default CourtApprovalModal;
