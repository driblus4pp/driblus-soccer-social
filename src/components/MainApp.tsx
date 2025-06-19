import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Search, Calendar, User, MapPin, Star, Clock, Users, Trophy, Camera, Settings, ChevronRight, UserPlus, Bell, LogOut, Filter } from "lucide-react";
import CourtDetails from './CourtDetails';
import FilterModal, { FilterState } from './FilterModal';
const MainApp = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCourt, setSelectedCourt] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    city: '',
    neighborhood: '',
    modality: '',
    operatingHours: ''
  });
  const quadras = [{
    id: 1,
    name: "No Alvo Society",
    location: "Av. Paulista, 1000, São Paulo",
    distance: "1.2 km",
    price: "R$ 120/hora",
    rating: 4.8,
    status: "Disponível",
    image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=300&fit=crop",
    amenities: ["Estacionamento", "Vestiário", "Chuveiros"],
    extraInfo: "+2",
    description: "Uma quadra moderna e bem equipada, ideal para partidas de futebol society. Localizada em área nobre da cidade com fácil acesso e excelente infraestrutura.",
    modalities: ["Futebol Society", "Futsal"],
    operatingHours: "06:00 - 23:00",
    facilities: {
      parking: true,
      dressing_room: true,
      showers: true,
      bar: false,
      lighting: true
    },
    reviews: [{
      user: "Carlos Silva",
      rating: 5,
      comment: "Excelente quadra! Muito bem cuidada e com ótima localização.",
      date: "15/12/2024"
    }, {
      user: "Ana Santos",
      rating: 4,
      comment: "Boa estrutura, mas poderia ter um bar no local.",
      date: "10/12/2024"
    }]
  }, {
    id: 2,
    name: "Gol de Placa",
    location: "Rua Augusta, 500, São Paulo",
    distance: "0.8 km",
    price: "R$ 150/hora",
    rating: 4.6,
    status: "Indisponível",
    image: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?w=400&h=300&fit=crop",
    amenities: ["Estacionamento", "Vestiário", "Churrasqueira"],
    extraInfo: "+1",
    description: "Quadra tradicional com churrasqueira para confraternizações. Perfeita para eventos e competições entre amigos.",
    modalities: ["Futebol Society", "Vôlei"],
    operatingHours: "07:00 - 22:00",
    facilities: {
      parking: true,
      dressing_room: true,
      showers: false,
      bar: true,
      lighting: true
    },
    reviews: [{
      user: "Pedro Oliveira",
      rating: 4,
      comment: "Lugar bacana para jogar com os amigos. A churrasqueira é um diferencial!",
      date: "12/12/2024"
    }]
  }];
  const userStats = {
    partidas: 42,
    gols: 18,
    assistencias: 12,
    nivel: "Intermediário",
    ranking: "#247",
    agendamentos: 0,
    xp: 480,
    proximosJogos: 0,
    amigos: 0
  };
  const handleCourtClick = (courtId: number) => {
    setSelectedCourt(courtId);
  };
  const handleBackFromDetails = () => {
    setSelectedCourt(null);
  };
  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    // Here you would normally filter the courts based on the filters
    console.log('Applying filters:', newFilters);
  };

  // If a court is selected, show its details
  if (selectedCourt) {
    const court = quadras.find(q => q.id === selectedCourt);
    if (court) {
      return <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B]">
          <div className="p-4">
            <CourtDetails court={court} onBack={handleBackFromDetails} />
          </div>
        </div>;
    }
  }
  const renderHomeContent = () => <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#F35410] to-[#BA2D0B] rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          Olá, João! 
          <img src="/lovable-uploads/cf887f3e-6da7-4137-b0d3-d752d0777b28.png" alt="Soccer ball" className="w-6 h-6 object-contain" />
        </h2>
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
        <h3 className="text-xl font-semibold text-white mb-4">Recomendados para você</h3>
        <div className="space-y-4">
          {quadras.map(quadra => <Card key={quadra.id} className="bg-white/10 border-white/20 hover:bg-white/15 transition-all cursor-pointer overflow-hidden" onClick={() => handleCourtClick(quadra.id)}>
              <div className="relative">
                <img src={quadra.image} alt={quadra.name} className="w-full h-48 object-cover" />
                <div className="absolute top-4 right-4 bg-[#F35410] text-white px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-semibold">{quadra.rating}</span>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-white text-lg">{quadra.name}</h4>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-white/60" />
                  <span className="text-sm text-white/70">{quadra.location}</span>
                  <span className="text-sm text-white/60">| {quadra.distance}</span>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-[#F35410] font-bold text-lg">{quadra.price}</span>
                  <Badge variant="secondary" className={`${quadra.status === 'Disponível' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                    {quadra.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {quadra.amenities.map(amenity => <Badge key={amenity} variant="secondary" className="bg-white/20 text-white text-xs">
                      {amenity}
                    </Badge>)}
                  <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                    {quadra.extraInfo}
                  </Badge>
                </div>
              </CardContent>
            </Card>)}
        </div>
      </div>
    </div>;
  const renderExploreContent = () => <div className="space-y-6">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
          <Input placeholder="Buscar quadras, bairros..." className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60" />
        </div>
        <Button variant="outline" size="icon" onClick={() => setShowFilters(true)} className="border-white/20 hover:bg-white/10 text-black">
          <Filter className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {quadras.map(quadra => <Card key={quadra.id} className="bg-white/10 border-white/20 overflow-hidden">
            <div className="relative">
              <img src={quadra.image} alt={quadra.name} className="w-full h-48 object-cover" />
              
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
              <Button className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white" onClick={() => handleCourtClick(quadra.id)}>
                Ver Detalhes
              </Button>
            </CardContent>
          </Card>)}
      </div>

      <FilterModal isOpen={showFilters} onClose={() => setShowFilters(false)} onApplyFilters={handleApplyFilters} filters={filters} />
    </div>;
  const renderProfileContent = () => <div className="space-y-6">
      {/* Profile Header Card */}
      <Card className="bg-gradient-to-br from-[#F35410] to-[#BA2D0B] border-none text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="grid grid-cols-8 gap-4 p-4">
            {Array.from({
            length: 32
          }).map((_, i) => <div key={i} className="w-8 h-8 rounded-full border border-white/20"></div>)}
          </div>
        </div>
        <CardContent className="p-6 relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-16 h-16 border-3 border-white/30">
                  <AvatarImage src="https://images.unsplash.com/photo-1472396961693-142e6e269027?w=80&h=80&fit=crop&crop=face" />
                  <AvatarFallback>JA</AvatarFallback>
                </Avatar>
                
              </div>
              <div>
                <h3 className="text-xl font-bold">Janderson Almeida</h3>
                <div className="flex items-center gap-1 text-white/90">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Fortaleza</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Player Card */}
      <Card className="bg-white/10 border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-[#F35410]" />
              <span className="text-white font-semibold">Cartão de Jogador</span>
            </div>
            <span className="text-white/60 text-sm">ID #6e583d</span>
          </div>
          
          <div className="text-center mb-6">
            <h4 className="text-2xl font-bold text-white mb-2">Convide seus amigos</h4>
            <p className="text-white/70 text-sm mb-4">Chame seus amigos para dividir momentos</p>
            <Button className="w-full bg-white text-[#F35410] hover:bg-white/90 font-semibold">
              <UserPlus className="w-4 h-4 mr-2" />
              Convidar amigo
            </Button>
          </div>

          <div className="text-center text-white/70 text-sm mb-4">
            <p>Você ainda não possui times cadastrados.</p>
            <p>Clique em "Criar Novo Time" para começar!</p>
          </div>

          <div className="text-center text-white/60 text-xs">
            0/3 times cadastrados.
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4 text-center">
            <Calendar className="w-6 h-6 mx-auto mb-2 text-[#F35410]" />
            <p className="text-2xl font-bold text-white">{userStats.agendamentos}</p>
            <p className="text-sm text-white/70">Agendamentos</p>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4 text-center">
            <Star className="w-6 h-6 mx-auto mb-2 text-[#F35410]" />
            <p className="text-2xl font-bold text-white">{userStats.xp}</p>
            <p className="text-sm text-white/70">XP</p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Summary */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5 text-[#F35410]" />
            Resumo do perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-white/60" />
              <span className="text-white/90">Próximos jogos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/60">{userStats.proximosJogos}</span>
              <ChevronRight className="w-4 h-4 text-white/60" />
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-white/60" />
              <span className="text-white/90">Estatísticas de jogador</span>
            </div>
            <ChevronRight className="w-4 h-4 text-white/60" />
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-white/60" />
              <span className="text-white/90">Lista de amigos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/60">{userStats.amigos}</span>
              <ChevronRight className="w-4 h-4 text-white/60" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logout Button */}
      <Card className="bg-red-600/20 border-red-500/30">
        <CardContent className="p-4">
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </CardContent>
      </Card>
    </div>;
  return <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B]">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-lg border-b border-white/10 p-4 bg-[#0a2c49]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/cf887f3e-6da7-4137-b0d3-d752d0777b28.png" alt="Soccer ball" className="w-8 h-8 object-contain" />
            <img src="/lovable-uploads/6a0f382f-4f6a-4afd-a007-454b98a5807a.png" alt="Driblus Logo" className="h-8 object-contain" />
          </div>
          
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24 bg-[#0a2c49]">
        {activeTab === 'home' && renderHomeContent()}
        {activeTab === 'explore' && renderExploreContent()}
        {activeTab === 'calendar' && <div className="text-center text-white py-12">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-white/60" />
            <h3 className="text-xl font-semibold mb-2">Sua Agenda</h3>
            <p className="text-white/70">Gerencie suas partidas agendadas</p>
          </div>}
        {activeTab === 'profile' && renderProfileContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#062B4B]/95 backdrop-blur-lg border-t border-white/10 p-4">
        <div className="flex justify-around">
          {[{
          id: 'home',
          icon: Home,
          label: 'Início'
        }, {
          id: 'explore',
          icon: Search,
          label: 'Explorar'
        }, {
          id: 'calendar',
          icon: Calendar,
          label: 'Agenda'
        }, {
          id: 'profile',
          icon: User,
          label: 'Perfil'
        }].map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${activeTab === tab.id ? 'text-[#F35410] bg-[#F35410]/20' : 'text-white/60 hover:text-white'}`}>
              <tab.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>)}
        </div>
      </div>
    </div>;
};
export default MainApp;