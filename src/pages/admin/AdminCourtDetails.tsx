
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Star, Clock, Check, X } from "lucide-react";
import { useCourts } from "@/hooks/useCourts";
import { useToast } from "@/hooks/use-toast";

const AdminCourtDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCourtById, approveCourt } = useCourts();
  const { toast } = useToast();
  
  const court = getCourtById(id!);

  if (!court) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B] flex items-center justify-center">
        <div className="text-white text-center">
          <p>Quadra não encontrada</p>
          <Button onClick={() => navigate('/admin/quadras')} className="mt-4">
            Voltar às Quadras
          </Button>
        </div>
      </div>
    );
  }

  const handleApproveCourt = () => {
    approveCourt(court.id);
    toast({
      title: "Quadra Aprovada",
      description: "A quadra foi aprovada e está agora ativa na plataforma",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'pending_approval':
        return 'bg-yellow-500';
      case 'inactive':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativa';
      case 'pending_approval':
        return 'Pendente de Aprovação';
      case 'inactive':
        return 'Inativa';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B]">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/quadras')}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-white">Detalhes da Quadra</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Court Header */}
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">{court.name}</h2>
                <div className="flex items-center gap-1 text-white/70 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{court.location.address}, {court.location.city} - {court.location.state}</span>
                </div>
              </div>
              <Badge className={`${getStatusColor(court.status)} text-white`}>
                {getStatusText(court.status)}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-white/70">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{court.rating} ({court.totalReviews} avaliações)</span>
              </div>
              <span>R$ {court.hourlyRate}/hora</span>
            </div>
          </CardContent>
        </Card>

        {/* Court Info */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Informações da Quadra</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-white/70 text-sm">Descrição</p>
              <p className="text-white">{court.description}</p>
            </div>
            
            <div>
              <p className="text-white/70 text-sm">Gestor Responsável</p>
              <p className="text-white">{court.ownerName}</p>
            </div>
            
            <div>
              <p className="text-white/70 text-sm">Modalidades</p>
              <div className="flex gap-2 mt-1">
                {court.sports.map((sport) => (
                  <Badge key={sport} variant="outline" className="border-white/20 text-white">
                    {sport}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-white/70 text-sm">Comodidades</p>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {court.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2 text-white">
                    <span className="text-green-400">✓</span>
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Horários de Funcionamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(court.workingHours).map(([day, hours]) => (
              <div key={day} className="flex justify-between text-white">
                <span className="capitalize">{day}:</span>
                <span>
                  {hours.isOpen ? `${hours.openTime} - ${hours.closeTime}` : 'Fechado'}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        {court.status === 'pending_approval' && (
          <div className="flex gap-3">
            <Button
              onClick={handleApproveCourt}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="w-4 h-4 mr-2" />
              Aprovar Quadra
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-red-500 text-red-400 hover:bg-red-500/10"
            >
              <X className="w-4 h-4 mr-2" />
              Rejeitar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCourtDetails;
