
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Phone, Mail, DollarSign } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MonthlyBooking {
  id: string;
  date: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  totalPrice: number;
  status: string;
}

interface BookingsListModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: MonthlyBooking[];
}

const BookingsListModal = ({ isOpen, onClose, bookings }: BookingsListModalProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled_by_user':
      case 'cancelled_by_manager':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendente';
      case 'cancelled_by_user':
        return 'Cancelado pelo Cliente';
      case 'cancelled_by_manager':
        return 'Cancelado pelo Gestor';
      case 'completed':
        return 'Concluído';
      default:
        return status;
    }
  };

  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#F35410]" />
            Reservas Este Mês ({bookings.length})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Resumo */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#F35410]">{bookings.length}</p>
              <p className="text-sm text-gray-600">Total de Reservas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">R$ {totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Receita Total</p>
            </div>
          </div>

          {/* Lista de Reservas */}
          <div className="space-y-3">
            {bookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma reserva encontrada neste mês</p>
              </div>
            ) : (
              bookings.map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold">
                        {format(new Date(booking.date), "dd/MM/yyyy (EEEE)", { locale: ptBR })}
                      </span>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {getStatusText(booking.status)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{booking.userName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{booking.userPhone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{booking.userEmail}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-lg font-bold text-green-600">
                          R$ {booking.totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingsListModal;
