
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building, MapPin, Star, Eye, Check, X } from "lucide-react";
import { useCourts } from "@/hooks/useCourts";
import { useToast } from "@/hooks/use-toast";

const AdminCourts = () => {
  const navigate = useNavigate();
  const { courts, approveCourt } = useCourts();
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'active' | 'pending'>('all');

  const filteredCourts = courts.filter(court => {
    switch (filter) {
      case 'active':
        return court.status === 'active';
      case 'pending':
        return court.status === 'pending_approval';
      default:
        return true;
    }
  });

  const handleApproveCourt = (courtId: string) => {
    approveCourt(courtId);
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
        return 'Pendente';
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
            onClick={() => navigate('/admin/dashboard')}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-white">Gerenciar Quadras</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Filter Buttons */}
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-[#F35410] hover:bg-[#BA2D0B]' : 'border-white/20 text-white hover:bg-white/10'}
          >
            Todas
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            onClick={() => setFilter('active')}
            className={filter === 'active' ? 'bg-[#F35410] hover:bg-[#BA2D0B]' : 'border-white/20 text-white hover:bg-white/10'}
          >
            Ativas
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
            className={filter === 'pending' ? 'bg-[#F35410] hover:bg-[#BA2D0B]' : 'border-white/20 text-white hover:bg-white/10'}
          >
            Pendentes
          </Button>
        </div>

        {/* Courts List */}
        <div className="space-y-4">
          {filteredCourts.length === 0 ? (
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <Building className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/70">Nenhuma quadra encontrada</p>
              </CardContent>
            </Card>
          ) : (
            filteredCourts.map((court) => (
              <Card key={court.id} className="bg-white/10 border-white/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{court.name}</h3>
                      <div className="flex items-center gap-1 text-white/70 text-sm mt-1">
                        <MapPin className="w-3 h-3" />
                        <span>{court.location.city}, {court.location.state}</span>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(court.status)} text-white`}>
                      {getStatusText(court.status)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-white/90 text-sm">{court.description}</p>
                    <div className="flex items-center gap-4 text-sm text-white/70">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{court.rating}</span>
                      </div>
                      <span>R$ {court.hourlyRate}/h</span>
                      <span>Gestor: {court.ownerName}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => navigate(`/admin/quadras/${court.id}`)}
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver Detalhes
                    </Button>
                    
                    {court.status === 'pending_approval' && (
                      <Button
                        onClick={() => handleApproveCourt(court.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Aprovar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCourts;
