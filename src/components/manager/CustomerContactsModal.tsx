
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { User, Phone, Mail, Search } from "lucide-react";
import { useState } from "react";

interface Customer {
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
}

interface CustomerContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
}

const CustomerContactsModal = ({ isOpen, onClose, customers }: CustomerContactsModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(customer =>
    customer.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.userPhone.includes(searchTerm)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#F35410]" />
            Contatos dos Clientes ({customers.length})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Barra de Pesquisa */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome, email ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Lista de Clientes */}
          <div className="space-y-3">
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>
                  {searchTerm 
                    ? 'Nenhum cliente encontrado com esse termo de busca' 
                    : 'Nenhum cliente encontrado neste período'
                  }
                </p>
              </div>
            ) : (
              filteredCustomers.map((customer) => (
                <div key={customer.userId} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#F35410] rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{customer.userName}</h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{customer.userPhone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{customer.userEmail}</span>
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

export default CustomerContactsModal;
