
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
  MapPin, 
  Star, 
  Trophy, 
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Shield,
  Eye,
  EyeOff
} from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { SportType } from '@/types';

interface ClientProfileModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ClientProfileModal = ({ userId, isOpen, onClose }: ClientProfileModalProps) => {
  const { getUserById, getClientBookingHistory } = useUsers();
  const user = getUserById(userId);
  const bookingHistory = getClientBookingHistory(userId);

  if (!user) {
    return null;
  }

  const getSportName = (sport: SportType) => {
    switch (sport) {
      case SportType.FOOTBALL: return 'Futebol';
      case SportType.FUTSAL: return 'Futsal';
      case SportType.VOLLEYBALL: return 'Vôlei';
      case SportType.BASKETBALL: return 'Basquete';
      case SportType.TENNIS: return 'Tênis';
      case SportType.PADEL: return 'Padel';
      default: return sport;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <User className="w-6 h-6 text-[#F35410]" />
            Perfil do Cliente
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Pessoais */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <User className="w-5 h-5 text-[#F35410]" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-[#F35410] text-white text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
                    {user.isVerified && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verificado
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-gray-600 text-sm">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      <span>{user.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Membro desde: {format(user.createdAt, "dd/MM/yyyy", { locale: ptBR })}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Último acesso: {user.lastLogin ? format(user.lastLogin, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : 'Nunca'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Estatísticas */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#F35410]" />
                  Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.stats && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-[#F35410]">{user.stats.totalBookings}</div>
                        <div className="text-sm text-gray-600">Total de Agendamentos</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{user.stats.completedGames}</div>
                        <div className="text-sm text-gray-600">Jogos Concluídos</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{user.stats.cancelledGames}</div>
                        <div className="text-sm text-gray-600">Cancelamentos</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center gap-1 text-lg font-bold text-yellow-600">
                          <Star className="w-5 h-5 fill-current" />
                          {user.stats.averageRating}
                        </div>
                        <div className="text-sm text-gray-600">Avaliação Média</div>
                      </div>
                    </div>

                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-[#F35410]">R$ {user.stats.totalSpent.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Total Gasto</div>
                    </div>

                    {bookingHistory && (
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Taxa de Conclusão:</span>
                          <span className="font-semibold text-green-600">{bookingHistory.completionRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Taxa de Cancelamento:</span>
                          <span className="font-semibold text-red-600">{bookingHistory.cancellationRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Gasto Médio Mensal:</span>
                          <span className="font-semibold text-[#F35410]">R$ {bookingHistory.averageMonthlySpent}</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Preferências */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#F35410]" />
                  Preferências
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.preferences && (
                  <>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Esportes Favoritos:</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.preferences.preferredSports.map(sport => (
                          <Badge key={sport} variant="secondary" className="bg-[#F35410]/10 text-[#F35410]">
                            {getSportName(sport)}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Locais Favoritos:</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.preferences.favoriteLocations.map(location => (
                          <Badge key={location} variant="secondary" className="bg-gray-100 text-gray-700">
                            <MapPin className="w-3 h-3 mr-1" />
                            {location}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>Distância máxima: {user.preferences.maxDistance} km</span>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Privacidade:
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          {user.preferences.privacy.showProfile ? (
                            <Eye className="w-4 h-4 text-green-600" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-red-600" />
                          )}
                          <span>Perfil {user.preferences.privacy.showProfile ? 'público' : 'privado'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {user.preferences.privacy.allowReviews ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span>Avaliações {user.preferences.privacy.allowReviews ? 'permitidas' : 'bloqueadas'}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientProfileModal;
