
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Clock,
  Star,
  TrendingUp,
  X
} from "lucide-react";

interface ClientProfileSimplifiedProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  courtId: string;
}

interface ClientStats {
  totalBookings: number;
  courtBookings: number;
  isNewClient: boolean;
  attendanceRate: number;
  lastBooking: string;
}

const ClientProfileSimplified = ({ userId, isOpen, onClose, courtId }: ClientProfileSimplifiedProps) => {
  const [clientData, setClientData] = useState<any>(null);
  const [clientStats, setClientStats] = useState<ClientStats | null>(null);

  useEffect(() => {
    if (isOpen && userId) {
      // Simular busca de dados do cliente
      const mockClientData = {
        id: userId,
        name: 'João Silva Santos',
        email: 'joao.silva@email.com',
        phone: '+55 85 99999-8888',
        avatar: null,
        registeredAt: '2024-10-15'
      };

      const mockStats: ClientStats = {
        totalBookings: userId === 'user-1' ? 0 : 15,
        courtBookings: userId === 'user-1' ? 0 : 8,
        isNewClient: userId === 'user-1',
        attendanceRate: userId === 'user-1' ? 0 : 92,
        lastBooking: userId === 'user-1' ? '' : '2024-12-20'
      };

      setClientData(mockClientData);
      setClientStats(mockStats);
    }
  }, [userId, isOpen]);

  if (!clientData || !clientStats) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-gray-800">Perfil do Cliente</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Dados do Cliente */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#F35410] rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{clientData.name}</h3>
                  {clientStats.isNewClient && (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      Cliente Novo
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{clientData.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{clientData.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas Essenciais */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Estatísticas
              </h4>

              {clientStats.isNewClient ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-green-800 font-semibold">Novo Cliente!</p>
                  <p className="text-sm text-gray-600">Este será seu primeiro agendamento</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#F35410]">
                      {clientStats.courtBookings}
                    </div>
                    <div className="text-xs text-gray-600">
                      Reservas nesta quadra
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {clientStats.totalBookings}
                    </div>
                    <div className="text-xs text-gray-600">
                      Total de reservas
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {clientStats.attendanceRate}%
                    </div>
                    <div className="text-xs text-gray-600">
                      Taxa de comparecimento
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-800">
                      {new Date(clientStats.lastBooking).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="text-xs text-gray-600">
                      Última reserva
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.open(`tel:${clientData.phone}`)}
            >
              <Phone className="w-4 h-4 mr-2" />
              Ligar
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.open(`mailto:${clientData.email}`)}
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientProfileSimplified;
