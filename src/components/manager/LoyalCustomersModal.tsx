
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Phone, Mail, Calendar, DollarSign, Star, MessageCircle } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface LoyalCustomer {
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  frequency: number;
  totalSpent: number;
  lastBooking: string;
}

interface LoyalCustomersModalProps {
  isOpen: boolean;
  onClose: () => void;
  loyalCustomers: LoyalCustomer[];
}

const LoyalCustomersModal = ({ isOpen, onClose, loyalCustomers }: LoyalCustomersModalProps) => {
  const handleContact = (customer: LoyalCustomer) => {
    const message = `Olá ${customer.userName}, obrigado por sempre escolher nossa quadra! Como podemos ajudá-lo?`;
    const whatsappUrl = `https://wa.me/${customer.userPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getLoyaltyLevel = (frequency: number) => {
    if (frequency >= 10) return { level: 'VIP', color: 'bg-purple-100 text-purple-800' };
    if (frequency >= 6) return { level: 'Gold', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'Silver', color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-[#F35410]" />
            Clientes Fiéis ({loyalCustomers.length})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-[#F35410]/10 to-[#BA2D0B]/10 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#F35410]">{loyalCustomers.length}</p>
              <p className="text-sm text-gray-600">Clientes Fiéis</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                R$ {loyalCustomers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Receita Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {loyalCustomers.reduce((sum, c) => sum + c.frequency, 0)}
              </p>
              <p className="text-sm text-gray-600">Total de Reservas</p>
            </div>
          </div>

          {/* Lista de Clientes Fiéis */}
          <div className="space-y-4">
            {loyalCustomers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum cliente fiel encontrado ainda</p>
                <p className="text-sm">Clientes precisam de pelo menos 3 reservas nos últimos 6 meses</p>
              </div>
            ) : (
              loyalCustomers.map((customer, index) => {
                const loyalty = getLoyaltyLevel(customer.frequency);
                
                return (
                  <div key={customer.userId} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-[#F35410] rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          {index < 3 && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">#{index + 1}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{customer.userName}</h3>
                          <Badge className={loyalty.color}>
                            {loyalty.level}
                          </Badge>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => handleContact(customer)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{customer.userPhone}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="truncate">{customer.userEmail}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{customer.frequency} reservas</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-green-600">
                          R$ {customer.totalSpent.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-gray-600">
                        Última reserva: {format(new Date(customer.lastBooking), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoyalCustomersModal;
