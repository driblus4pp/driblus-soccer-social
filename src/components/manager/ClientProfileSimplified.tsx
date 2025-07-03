
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Star, 
  Trophy,
  CheckCircle,
  Clock,
  Users,
  Sparkles
} from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { useBookings } from "@/hooks/useBookings";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ClientProfileSimplifiedProps {
  userId: string;
  courtId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ClientProfileSimplified = ({ userId, courtId, isOpen, onClose }: ClientProfileSimplifiedProps) => {
  const { getUserById } = useUsers();
  const { bookings } = useBookings();
  const user = getUserById(userId);

  if (!user) {
    return null;
  }

  // Estatísticas específicas para esta quadra
  const courtBookings = bookings.filter(b => b.userId === userId && b.courtId === courtId);
  const completedBookings = courtBookings.filter(b => b.status === 'completed').length;
  const totalBookings = courtBookings.length;
  const isNewClient = totalBookings === 0;
  const lastBooking = courtBookings
    .filter(b => b.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  // Taxa de comparecimento
  const attendanceRate = totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-3">
            <User className="w-5 h-5 text-[#F35410]" />
            Perfil do Cliente
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações de Contato */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <User className="w-4 h-4 text-[#F35410]" />
                Dados de Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-[#F35410] text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                    {isNewClient && (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Cliente Novo
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-800">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-800">{user.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas Essenciais */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#F35410]" />
                Histórico na Quadra
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isNewClient ? (
                <div className="text-center py-6">
                  <Users className="w-12 h-12 mx-auto mb-3 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Primeiro Agendamento</h3>
                  <p className="text-gray-600">Este é o primeiro agendamento deste cliente na sua quadra</p>
                  <Badge className="mt-3 bg-blue-100 text-blue-800">
                    Bem-vindo!
                  </Badge>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-[#F35410]/10 rounded-lg">
                      <div className="text-2xl font-bold text-[#F35410]">{totalBookings}</div>
                      <div className="text-sm text-gray-600">Total de Reservas</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{completedBookings}</div>
                      <div className="text-sm text-gray-600">Jogos Realizados</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{attendanceRate}%</div>
                      <div className="text-sm text-gray-600">Taxa de Comparecimento</div>
                    </div>
                  </div>

                  {lastBooking && (
                    <>
                      <Separator />
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Última Visita
                        </h4>
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-3 h-3" />
                            <span>{format(new Date(lastBooking.date), "dd/MM/yyyy", { locale: ptBR })}</span>
                          </div>
                          {lastBooking.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span>Avaliou com {lastBooking.rating.stars} estrelas</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Classificação do Cliente */}
                  <div className="p-3 bg-gradient-to-r from-[#F35410]/10 to-[#BA2D0B]/10 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Classificação</h4>
                    <div className="flex items-center gap-2">
                      {attendanceRate >= 90 ? (
                        <>
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Cliente Confiável
                          </Badge>
                          <span className="text-sm text-gray-600">Excelente histórico de comparecimento</span>
                        </>
                      ) : attendanceRate >= 70 ? (
                        <>
                          <Badge className="bg-blue-100 text-blue-800">
                            Cliente Regular
                          </Badge>
                          <span className="text-sm text-gray-600">Bom histórico de comparecimento</span>
                        </>
                      ) : (
                        <>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Cliente em Avaliação
                          </Badge>
                          <span className="text-sm text-gray-600">Poucos agendamentos realizados</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientProfileSimplified;
