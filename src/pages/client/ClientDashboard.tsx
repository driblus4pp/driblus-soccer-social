
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Search, Navigation, Filter } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "@/components/navigation/BottomNavigation";

const mockCourts = [
  {
    id: '1',
    name: 'No Alvo Society',
    location: 'Aldeota, Fortaleza - CE',
    distance: '2.5 km',
    price: 'R$ 120',
    rating: 4.8,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=300&fit=crop',
    isRecommended: true
  },
  {
    id: '2',
    name: 'Gol de Placa',
    location: 'Meireles, Fortaleza - CE',
    distance: '1.8 km',
    price: 'R$ 150',
    rating: 4.9,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?w=400&h=300&fit=crop',
    isRecommended: true
  },
  {
    id: '3',
    name: 'Arena Pro Sports',
    location: 'Cocó, Fortaleza - CE',
    distance: '3.2 km',
    price: 'R$ 200',
    rating: 4.7,
    status: 'unavailable',
    image: 'https://images.unsplash.com/photo-1544989164-44a5ba64d0c6?w=400&h=300&fit=crop',
    isRecommended: true
  },
  {
    id: '4',
    name: 'Sport Center',
    location: 'Papicu, Fortaleza - CE',
    distance: '4.1 km',
    price: 'R$ 180',
    rating: 4.6,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=300&fit=crop',
    isRecommended: false
  }
];

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourts = mockCourts.filter(court => 
    court.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    court.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recommendedCourts = filteredCourts.filter(court => court.isRecommended);

  const getStatusBadge = (status: string) => {
    return status === 'available' ? (
      <Badge className="bg-green-500 text-white text-xs">Disponível</Badge>
    ) : (
      <Badge className="bg-red-500 text-white text-xs">Indisponível</Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header com localização */}
      <div className="bg-white px-4 py-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Olá, {user?.name?.split(' ')[0] || 'Maria'}! 👋
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Navigation className="w-4 h-4 text-[#F35410]" />
              <span className="text-gray-600 text-sm">Fortaleza, CE</span>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Filter className="w-5 h-5 text-gray-600" />
          </Button>
        </div>

        {/* Barra de busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar quadras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-50 border-0 focus:bg-white"
          />
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Seção Recomendados para você */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recomendados para você</h2>
          <div className="space-y-4">
            {recommendedCourts.map(court => (
              <Card 
                key={court.id} 
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/cliente/quadra/${court.id}`)}
              >
                <div className="relative">
                  <img 
                    src={court.image} 
                    alt={court.name} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(court.status)}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg">{court.name}</h3>
                          <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
                            <MapPin className="w-3 h-3" />
                            <span>{court.location}</span>
                            <span className="text-gray-400">•</span>
                            <span>{court.distance}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-[#F35410] text-white px-2 py-1 rounded-full">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-sm font-semibold">{court.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[#F35410] font-bold text-lg">{court.price}</span>
                          <span className="text-gray-500 text-sm">/hora</span>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-[#F35410] hover:bg-[#BA2D0B] text-white"
                          disabled={court.status === 'unavailable'}
                        >
                          {court.status === 'available' ? 'Reservar' : 'Indisponível'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Outras quadras */}
        {filteredCourts.filter(court => !court.isRecommended).length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Outras opções</h2>
            <div className="space-y-3">
              {filteredCourts.filter(court => !court.isRecommended).map(court => (
                <Card 
                  key={court.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/cliente/quadra/${court.id}`)}
                >
                  <CardContent className="p-0">
                    <div className="flex gap-3">
                      <img 
                        src={court.image} 
                        alt={court.name} 
                        className="w-20 h-20 object-cover rounded-l-lg"
                      />
                      <div className="flex-1 p-3">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-gray-900">{court.name}</h3>
                          {getStatusBadge(court.status)}
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 text-sm mb-2">
                          <MapPin className="w-3 h-3" />
                          <span>{court.location}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{court.rating}</span>
                          </div>
                          <div>
                            <span className="font-bold text-[#F35410]">{court.price}</span>
                            <span className="text-gray-500 text-xs">/h</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navegação inferior */}
      <BottomNavigation userType="client" />
    </div>
  );
};

export default ClientDashboard;
