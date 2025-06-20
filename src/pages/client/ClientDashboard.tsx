import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Star, Clock, Search, User, LogOut, Trophy, Zap, Navigation, Filter } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
const mockCourts = [{
  id: '1',
  name: 'No Alvo Society',
  location: 'Aldeota, Fortaleza - CE',
  distance: '2.5 km',
  price: 'R$ 120',
  rating: 4.8,
  status: 'active',
  image: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=300&fit=crop',
  isPromoted: true
}, {
  id: '2',
  name: 'Gol de Placa',
  location: 'Meireles, Fortaleza - CE',
  distance: '1.8 km',
  price: 'R$ 150',
  rating: 4.9,
  status: 'active',
  image: 'https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?w=400&h=300&fit=crop',
  isPromoted: true
}, {
  id: '3',
  name: 'Arena Pro Sports',
  location: 'Cocó, Fortaleza - CE',
  distance: '3.2 km',
  price: 'R$ 200',
  rating: 4.7,
  status: 'active',
  image: 'https://images.unsplash.com/photo-1544989164-44a5ba64d0c6?w=400&h=300&fit=crop',
  isPromoted: false
}];
const ClientDashboard = () => {
  const navigate = useNavigate();
  const {
    user,
    logout
  } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const filteredCourts = mockCourts.filter(court => court.name.toLowerCase().includes(searchTerm.toLowerCase()) || court.location.toLowerCase().includes(searchTerm.toLowerCase()));
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B]">
      {/* Header */}
      <div className="backdrop-blur-md border-b border-white/20 p-4 bg-[#0a2c49]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/6a0f382f-4f6a-4afd-a007-454b98a5807a.png" alt="Driblus Logo" className="h-8 object-contain" />
            
          </div>
          
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Welcome Header - Gamificado */}
        <div className="bg-gradient-to-r from-[#F35410] to-[#BA2D0B] rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              Olá, {user?.name?.split(' ')[0] || 'Maria'}! 
              <img src="/lovable-uploads/cf887f3e-6da7-4137-b0d3-d752d0777b28.png" alt="Soccer ball" className="w-6 h-6 object-contain" />
            </h2>
            <p className="text-white/90">Pronto para sua próxima partida?</p>
            <div className="flex items-center gap-2 mt-2">
              <Navigation className="w-4 h-4" />
              <span className="text-white/80 text-sm">Localização ativada</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          
          
        </div>

        {/* Search */}
        

        {/* Promoted Courts */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-[#F35410]" />
            <h3 className="text-xl font-semibold text-white">Quadras em Destaque</h3>
          </div>
          <div className="space-y-4">
            {filteredCourts.filter(court => court.isPromoted).map(court => <Card key={court.id} className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors cursor-pointer overflow-hidden relative" onClick={() => navigate(`/cliente/quadra/${court.id}`)}>
                <div className="absolute top-4 left-4 bg-[#F35410] text-white px-2 py-1 rounded-full text-xs font-bold">
                  DESTAQUE
                </div>
                <div className="relative">
                  <img src={court.image} alt={court.name} className="w-full h-48 object-cover" />
                  <div className="absolute top-4 right-4 bg-[#F35410] text-white px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-semibold">{court.rating}</span>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white text-lg">{court.name}</h4>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-white/60" />
                    <span className="text-sm text-white/70">{court.location}</span>
                    <span className="text-sm text-white/60">| {court.distance}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#F35410] font-bold text-lg">{court.price}</span>
                    <Button className="bg-[#F35410] hover:bg-[#BA2D0B] text-white text-sm">
                      Agendar
                    </Button>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>

        {/* Other Courts */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Outras Quadras</h3>
          <div className="space-y-4">
            {filteredCourts.filter(court => !court.isPromoted).map(court => <Card key={court.id} className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors cursor-pointer" onClick={() => navigate(`/cliente/quadra/${court.id}`)}>
                <CardContent className="p-0">
                  <div className="flex gap-4">
                    <img src={court.image} alt={court.name} className="w-24 h-24 object-cover rounded-l-lg" />
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
              </Card>)}
          </div>
        </div>
      </div>
    </div>;
};
export default ClientDashboard;