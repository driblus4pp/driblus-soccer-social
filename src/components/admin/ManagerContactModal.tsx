import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, Mail, Clock, Copy } from "lucide-react";

interface Manager {
  id: string;
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  contactEmail?: string;
  businessHours?: string;
  avatar?: string;
}

interface ManagerContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  manager: Manager | null;
}

const ManagerContactModal = ({ isOpen, onClose, manager }: ManagerContactModalProps) => {
  if (!manager) return null;

  const handleWhatsAppClick = () => {
    if (manager.whatsapp) {
      const cleanNumber = manager.whatsapp.replace(/\D/g, '');
      const message = encodeURIComponent(`Olá ${manager.name}, vim através da plataforma de agendamentos.`);
      window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
    }
  };

  const handlePhoneClick = () => {
    if (manager.phone) {
      window.open(`tel:${manager.phone}`, '_self');
    }
  };

  const handleEmailClick = () => {
    if (manager.contactEmail) {
      window.open(`mailto:${manager.contactEmail}`, '_self');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <img 
              src={manager.avatar || "https://via.placeholder.com/48"} 
              alt={manager.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <DialogTitle className="text-lg font-semibold">Contatar {manager.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">Escolha uma opção de contato</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {/* Business Hours */}
          {manager.businessHours && (
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Horário de Funcionamento</p>
                <p className="text-sm text-muted-foreground">{manager.businessHours}</p>
              </div>
            </div>
          )}

          {/* WhatsApp */}
          {manager.whatsapp && (
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">WhatsApp</p>
                  <p className="text-sm text-muted-foreground">{manager.whatsapp}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(manager.whatsapp!)}
                  className="h-8 w-8"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleWhatsAppClick}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  Conversar
                </Button>
              </div>
            </div>
          )}

          {/* Phone */}
          {manager.phone && (
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Telefone</p>
                  <p className="text-sm text-muted-foreground">{manager.phone}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(manager.phone!)}
                  className="h-8 w-8"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handlePhoneClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  Ligar
                </Button>
              </div>
            </div>
          )}

          {/* Email */}
          {manager.contactEmail && (
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{manager.contactEmail}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(manager.contactEmail!)}
                  className="h-8 w-8"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleEmailClick}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  size="sm"
                >
                  Enviar
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManagerContactModal;