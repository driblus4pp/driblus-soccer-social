
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Search, Filter, ArrowLeft } from "lucide-react";
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
    amenities: ['Vestiário', 'Estacionamento', 'Chuveiro']
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
    amenities: ['Vestiário', 'Bar', 'Iluminação']
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
    amenities: ['Vestiário', 'Estacionamento', 'Academia']
  }
];

const ClientCourts = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCourts = mockCourts.filter(court => 
    court.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    court.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    return status === 'available' 
      ? <Badge className="bg-green-500 text-white text-xs">Disponível</Badge>
      : <Badge className="bg-red-500 text-white text-xs">Indisponível</Badge>;
  };

  return (
    <div className="min-h-screen bg-[#093758] pb-20">
      {/* Header */}
      <div className="px-4 py-6 bg-[#093758]">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/cliente/dashboard')}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-white">Quadras</h1>
        </div>

        {/* Barra de busca */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar quadras, bairros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 rounded-xl"
          />
        </div>

        {/* Filtros */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {filteredCourts.map(court => (
          <Card 
            key={court.id} 
            className="cursor-pointer hover:shadow-md transition-shadow bg-white/10 border-white/20"
            onClick={() => navigate(`/cliente/quadra/${court.id}`)}
          >
            <CardContent className="p-0">
              <div className="flex gap-3">
                <img 
                  src={court.image} 
                  alt={court.name} 
                  className="w-24 h-24 object-cover rounded-l-lg" 
                />
                <div className="flex-1 p-3">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-white">{court.name}</h3>
                    {getStatusBadge(court.status)}
                  </div>
                  <div className="flex items-center gap-1 text-white/70 text-sm mb-2">
                    <MapPin className="w-3 h-3" />
                    <span>{court.location}</span>
                    <span>• {court.distance}</span>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {court.amenities.slice(0, 2).map((amenity, index) => (
                      <span key={index} className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                        {amenity}
                      </span>
                    ))}
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
        ))}
      </div>

      <BottomNavigation userType="client" />
    </div>
  );
};

export default ClientCourts;
