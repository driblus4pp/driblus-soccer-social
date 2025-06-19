
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Star, Clock, Search, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const mockCourts = [
  {
    id: '1',
    name: 'No Alvo Society',
    location: 'Aldeota, Fortaleza - CE',
    distance: '2.5 km',
    price: 'R$ 120',
    rating: 4.8,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    name: 'Gol de Placa',
    location: 'Meireles, Fortaleza - CE',
    distance: '1.8 km',
    price: 'R$ 150',
    rating: 4.9,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    name: 'Arena Pro Sports',
    location: 'Cocó, Fortaleza - CE',
    distance: '3.2 km',
    price: 'R$ 200',
    rating: 4.7,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1544989164-44a5ba64d0c6?w=400&h=300&fit=crop'
  }
];

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourts = mockCourts.filter(court =>
    court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    court.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B]">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/6a0f382f-4f6a-4afd-a007-454b98a5807a.png" alt="Driblus Logo" className="h-8 object-contain" />
            <h1 className="text-xl font-bold text-white">Driblus</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-white">
              <User className="w-4 h-4" />
              <span className="text-sm">{user?.name}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Welcome Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo, {user?.name}!</h2>
          <p className="text-white/70">Encontre e agende sua quadra ideal</p>
        </div>

        {/* Search */}
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
              <Input
                placeholder="Buscar quadras por nome ou localização..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
          </CardContent>
        </Card>

        {/* Courts List */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Quadras Disponíveis</h3>
          {filteredCourts.map((court) => (
            <Card key={court.id} className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors cursor-pointer"
                  onClick={() => navigate(`/cliente/quadra/${court.id}`)}>
              <CardContent className="p-0">
                <div className="flex gap-4">
                  <img 
                    src={court.image} 
                    alt={court.name} 
                    className="w-24 h-24 object-cover rounded-l-lg"
                  />
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-white">{court.name}</h4>
                      <div className="text-right">
                        <p className="font-bold text-[#F35410]">{court.price}</p>
                        <p className="text-white/60 text-xs">/hora</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-white/70 text-sm mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>{court.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-white text-sm">{court.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-white/60 text-sm">
                        <Clock className="w-3 h-3" />
                        <span>{court.distance}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
