
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star } from "lucide-react";

interface Court {
  id: string;
  name: string;
  location: string;
  distance: string;
  price: string;
  rating: number;
  status: string;
  image: string;
  isRecommended: boolean;
  amenities: string[];
}

interface CourtCardProps {
  court: Court;
  variant?: 'recommended' | 'compact';
}

const CourtCard = ({ court, variant = 'recommended' }: CourtCardProps) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    return status === 'available' ? 
      <Badge className="bg-green-500 text-white text-xs">Disponível</Badge> : 
      <Badge className="bg-red-500 text-white text-xs">Indisponível</Badge>;
  };

  if (variant === 'compact') {
    return (
      <Card 
        className="cursor-pointer hover:shadow-md transition-all hover:bg-white/20 bg-white/10 border-white/20" 
        onClick={() => navigate(`/cliente/quadra/${court.id}`)}
      >
        <CardContent className="p-0">
          <div className="flex gap-4">
            <img 
              src={court.image} 
              alt={court.name} 
              className="w-28 h-28 object-cover rounded-2xl shadow-md ring-2 ring-white/10 hover:scale-105 transition-all duration-300 m-3" 
            />
            <div className="flex-1 p-3">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-white">{court.name}</h3>
                {getStatusBadge(court.status)}
              </div>
              <div className="flex items-center gap-1 text-white/70 text-sm mb-2">
                <MapPin className="w-3 h-3" />
                <span>{court.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-white">{court.rating}</span>
                </div>
                <div>
                  <span className="font-bold text-[#F35410]">{court.price}</span>
                  <span className="text-white/60 text-xs">/h</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow bg-white border-0 rounded-2xl" onClick={() => navigate(`/cliente/quadra/${court.id}`)}>
      <div className="relative">
        <img src={court.image} alt={court.name} className="w-full h-56 object-cover" />
        
        {/* Rating badge no canto superior direito */}
        <div className="absolute top-4 right-4 bg-[#F35410] text-white px-3 py-1 rounded-full flex items-center gap-1">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm font-semibold">{court.rating}</span>
        </div>

        {/* Status badge no canto superior esquerdo */}
        <div className="absolute top-4 left-4">
          {getStatusBadge(court.status)}
        </div>

        {/* Overlay com informações na parte inferior */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
          <div className="text-white">
            <h3 className="font-bold text-xl mb-1">{court.name}</h3>
            <div className="flex items-center gap-1 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{court.location}</span>
              <span className="text-sm">• {court.distance}</span>
            </div>
            
            {/* Amenities tags */}
            <div className="flex gap-2 mb-3">
              {court.amenities.map((amenity, index) => (
                <span key={index} className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                  {amenity}
                </span>
              ))}
            </div>
            
            {/* Preço e botão */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[#F35410] font-bold text-xl">{court.price}</span>
                <span className="text-white/80 text-sm">/hora</span>
              </div>
              <Button size="sm" className="bg-[#F35410] hover:bg-[#BA2D0B] text-white px-6" disabled={court.status === 'unavailable'}>
                {court.status === 'available' ? 'Reservar' : 'Indisponível'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CourtCard;
