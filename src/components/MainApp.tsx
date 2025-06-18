
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home, 
  Search, 
  Calendar, 
  User, 
  MapPin, 
  Star, 
  Clock, 
  Users,
  Trophy,
  Camera,
  Settings
} from "lucide-react";

const MainApp = () => {
  const [activeTab, setActiveTab] = useState('home');

  const quadras = [
    {
      id: 1,
      name: "Arena Sports Center",
      location: "Vila Madalena, SP",
      price: "R$ 120/hora",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=300&fit=crop",
      amenities: ["Vestiário", "Estacionamento", "Lanchonete"]
    },
    {
      id: 2,
      name: "Quadra do Parque",
      location: "Ibirapuera, SP",
      price: "R$ 80/hora",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?w=400&h=300&fit=crop",
      amenities: ["Vestiário", "Chuveiro"]
    }
  ];

  const userStats = {
    partidas: 42,
    gols: 18,
    assistencias: 12,
    nivel: "Intermediário",
    ranking: "#247"
  };

  const renderHomeContent = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#F35410] to-[#BA2D0B] rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Olá, João! ⚽</h2>
        <p className="text-white/90">Pronto para sua próxima partida?</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center bg-white/5 border-white/10">
          <CardContent className="p-4">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
            <p className="text-2xl font-bold text-white">{userStats.partidas}</p>
            <p className="text-sm text-white/70">Partidas</p>
          </CardContent>
        </Card>
        <Card className="text-center bg-white/5 border-white/10">
          <CardContent className="p-4">
            <Star className="w-6 h-6 mx-auto mb-2 text-green-400" />
            <p className="text-2xl font-bold text-white">{userStats.gols}</p>
            <p className="text-sm text-white/70">Gols</p>
          </CardContent>
        </Card>
        <Card className="text-center bg-white/5 border-white/10">
          <CardContent className="p-4">
            <Users className="w-6 h-6 mx-auto mb-2 text-blue-400" />
            <p className="text-2xl font-bold text-white">{userStats.assistencias}</p>
            <p className="text-sm text-white/70">Assists</p>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Courts */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Quadras Recomendadas</h3>
        <div className="space-y-4">
          {quadras.map((quadra) => (
            <Card key={quadra.id} className="bg-white/10 border-white/20 hover:bg-white/15 transition-all cursor-pointer">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img 
                    src={quadra.image} 
                    alt={quadra.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-white">{quadra.name}</h4>
                      <span className="text-[#F35410] font-bold">{quadra.price}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-white/60" />
                      <span className="text-sm text-white/70">{quadra.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-white/70">{quadra.rating}</span>
                    </div>
                    <div className="flex gap-2">
                      {quadra.amenities.map((amenity) => (
                        <Badge key={amenity} variant="secondary" className="bg-white/20 text-white text-xs">
                          {amenity}
                        </Badge>
                      ))}
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

  const renderExploreContent = () => (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
        <Input 
          placeholder="Buscar quadras, bairros..." 
          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
        />
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {quadras.map((quadra) => (
          <Card key={quadra.id} className="bg-white/10 border-white/20 overflow-hidden">
            <div className="relative">
              <img 
                src={quadra.image} 
                alt={quadra.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4 bg-black/50 rounded-full p-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-white">{quadra.name}</h4>
                <span className="text-[#F35410] font-bold">{quadra.price}</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-white/60" />
                <span className="text-sm text-white/70">{quadra.location}</span>
              </div>
              <Button className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white">
                Ver Detalhes
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderProfileContent = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-gradient-to-br from-[#F35410] to-[#BA2D0B] border-none text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-20 h-20 border-4 border-white/30">
              <AvatarImage src="https://images.unsplash.com/photo-1472396961693-142e6e269027?w=80&h=80&fit=crop&crop=face" />
              <AvatarFallback>JP</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-2xl font-bold">João Pedro</h3>
              <p className="text-white/90">Atacante • {userStats.nivel}</p>
              <div className="flex items-center gap-2 mt-1">
                <Trophy className="w-4 h-4" />
                <span className="text-sm">Ranking {userStats.ranking}</span>
              </div>
            </div>
          </div>
          <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 text-white border-none">
            <Camera className="w-4 h-4 mr-2" />
            Editar Perfil
          </Button>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
            <p className="text-2xl font-bold text-white">{userStats.partidas}</p>
            <p className="text-sm text-white/70">Partidas Jogadas</p>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 mx-auto mb-2 text-green-400" />
            <p className="text-2xl font-bold text-white">{userStats.gols}</p>
            <p className="text-sm text-white/70">Gols Marcados</p>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <p className="text-2xl font-bold text-white">{userStats.assistencias}</p>
            <p className="text-sm text-white/70">Assistências</p>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <p className="text-2xl font-bold text-white">3</p>
            <p className="text-sm text-white/70">Próximas Partidas</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-white/90 text-sm">Gol marcado na Arena Sports Center</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-white/90 text-sm">Partida agendada para domingo</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span className="text-white/90 text-sm">Novo recorde pessoal de gols</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#062B4B]/90 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">⚽</div>
            <h1 className="text-xl font-bold text-white">Driblus</h1>
          </div>
          <Button variant="ghost" size="icon" className="text-white">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        {activeTab === 'home' && renderHomeContent()}
        {activeTab === 'explore' && renderExploreContent()}
        {activeTab === 'calendar' && (
          <div className="text-center text-white py-12">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-white/60" />
            <h3 className="text-xl font-semibold mb-2">Sua Agenda</h3>
            <p className="text-white/70">Gerencie suas partidas agendadas</p>
          </div>
        )}
        {activeTab === 'profile' && renderProfileContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#062B4B]/95 backdrop-blur-lg border-t border-white/10 p-4">
        <div className="flex justify-around">
          {[
            { id: 'home', icon: Home, label: 'Início' },
            { id: 'explore', icon: Search, label: 'Explorar' },
            { id: 'calendar', icon: Calendar, label: 'Agenda' },
            { id: 'profile', icon: User, label: 'Perfil' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                activeTab === tab.id 
                ? 'text-[#F35410] bg-[#F35410]/20' 
                : 'text-white/60 hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainApp;
