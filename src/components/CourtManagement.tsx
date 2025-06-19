
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Camera, 
  Clock, 
  DollarSign, 
  Wifi, 
  Car, 
  ShowerHead, 
  Coffee,
  Plus,
  Trash2,
  Edit,
  Building
} from "lucide-react";
import { Court, SportType, WorkingHours } from '@/types';

const CourtManagement = () => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [isAddingCourt, setIsAddingCourt] = useState(false);
  const [newCourt, setNewCourt] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    hourlyRate: 0,
    sports: [] as SportType[],
    amenities: [] as string[],
    images: [] as string[]
  });

  const availableAmenities = [
    { id: 'wifi', name: 'Wi-Fi', icon: Wifi },
    { id: 'parking', name: 'Estacionamento', icon: Car },
    { id: 'shower', name: 'Vestiários', icon: ShowerHead },
    { id: 'cafeteria', name: 'Lanchonete', icon: Coffee }
  ];

  const sportTypes = [
    { id: SportType.FOOTBALL, name: 'Futebol Society' },
    { id: SportType.FUTSAL, name: 'Futsal' },
    { id: SportType.VOLLEYBALL, name: 'Vôlei' },
    { id: SportType.BASKETBALL, name: 'Basquete' },
    { id: SportType.TENNIS, name: 'Tênis' },
    { id: SportType.PADEL, name: 'Padel' }
  ];

  const handleAddCourt = () => {
    // Simulate geolocation for demo
    const mockCourt: Court = {
      id: Date.now().toString(),
      ...newCourt,
      location: {
        ...newCourt,
        lat: -3.7319 + (Math.random() - 0.5) * 0.1,
        lng: -38.5267 + (Math.random() - 0.5) * 0.1
      },
      ownerId: 'current-user',
      ownerName: 'João Silva',
      status: 'pending_approval',
      rating: 0,
      totalReviews: 0,
      isVerified: false,
      workingHours: {
        monday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
        tuesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
        wednesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
        thursday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
        friday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
        saturday: { isOpen: true, openTime: '07:00', closeTime: '23:00' },
        sunday: { isOpen: true, openTime: '07:00', closeTime: '21:00' }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setCourts(prev => [...prev, mockCourt]);
    setIsAddingCourt(false);
    setNewCourt({
      name: '',
      description: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      hourlyRate: 0,
      sports: [],
      amenities: [],
      images: []
    });
  };

  const toggleSport = (sport: SportType) => {
    setNewCourt(prev => ({
      ...prev,
      sports: prev.sports.includes(sport) 
        ? prev.sports.filter(s => s !== sport)
        : [...prev.sports, sport]
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setNewCourt(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  if (isAddingCourt) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Nova Quadra</h2>
          <Button 
            variant="outline" 
            onClick={() => setIsAddingCourt(false)}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Cancelar
          </Button>
        </div>

        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Nome da Quadra</Label>
                <Input 
                  value={newCourt.name}
                  onChange={e => setNewCourt(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Ex: Arena Sports Center"
                />
              </div>
              <div>
                <Label className="text-white">Valor por Hora (R$)</Label>
                <Input 
                  type="number"
                  value={newCourt.hourlyRate}
                  onChange={e => setNewCourt(prev => ({ ...prev, hourlyRate: Number(e.target.value) }))}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="120"
                />
              </div>
            </div>

            <div>
              <Label className="text-white">Descrição</Label>
              <Textarea 
                value={newCourt.description}
                onChange={e => setNewCourt(prev => ({ ...prev, description: e.target.value }))}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Descreva sua quadra, estrutura e diferenciais..."
                rows={3}
              />
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Endereço</Label>
                <Input 
                  value={newCourt.address}
                  onChange={e => setNewCourt(prev => ({ ...prev, address: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Rua, número"
                />
              </div>
              <div>
                <Label className="text-white">Cidade</Label>
                <Input 
                  value={newCourt.city}
                  onChange={e => setNewCourt(prev => ({ ...prev, city: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Fortaleza"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Estado</Label>
                <Input 
                  value={newCourt.state}
                  onChange={e => setNewCourt(prev => ({ ...prev, state: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="CE"
                />
              </div>
              <div>
                <Label className="text-white">CEP</Label>
                <Input 
                  value={newCourt.zipCode}
                  onChange={e => setNewCourt(prev => ({ ...prev, zipCode: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="60000-000"
                />
              </div>
            </div>

            {/* Sports */}
            <div>
              <Label className="text-white mb-3 block">Modalidades Esportivas</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {sportTypes.map(sport => (
                  <Button
                    key={sport.id}
                    type="button"
                    variant={newCourt.sports.includes(sport.id) ? "default" : "outline"}
                    className={`${newCourt.sports.includes(sport.id) 
                      ? 'bg-[#F35410] hover:bg-[#BA2D0B] text-white' 
                      : 'border-white/20 text-white hover:bg-white/10'
                    }`}
                    onClick={() => toggleSport(sport.id)}
                  >
                    {sport.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <Label className="text-white mb-3 block">Comodidades</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableAmenities.map(amenity => {
                  const Icon = amenity.icon;
                  return (
                    <Button
                      key={amenity.id}
                      type="button"
                      variant={newCourt.amenities.includes(amenity.id) ? "default" : "outline"}
                      className={`${newCourt.amenities.includes(amenity.id) 
                        ? 'bg-[#F35410] hover:bg-[#BA2D0B] text-white' 
                        : 'border-white/20 text-white hover:bg-white/10'
                      } flex items-center gap-2`}
                      onClick={() => toggleAmenity(amenity.id)}
                    >
                      <Icon className="w-4 h-4" />
                      {amenity.name}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Images */}
            <div>
              <Label className="text-white mb-3 block">Fotos da Quadra</Label>
              <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                <Camera className="w-12 h-12 mx-auto mb-4 text-white/60" />
                <p className="text-white/70 mb-2">Clique para adicionar fotos</p>
                <p className="text-white/50 text-sm">PNG, JPG até 5MB cada</p>
                <Button variant="outline" className="mt-4 border-white/20 text-white hover:bg-white/10">
                  Escolher Arquivos
                </Button>
              </div>
            </div>

            <Button 
              onClick={handleAddCourt}
              className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white py-3"
              disabled={!newCourt.name || !newCourt.address || newCourt.sports.length === 0}
            >
              Cadastrar Quadra
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Minhas Quadras</h2>
        <Button 
          onClick={() => setIsAddingCourt(true)}
          className="bg-[#F35410] hover:bg-[#BA2D0B] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Quadra
        </Button>
      </div>

      {courts.length === 0 ? (
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-12 text-center">
            <Building className="w-16 h-16 mx-auto mb-4 text-white/60" />
            <h3 className="text-xl font-semibold text-white mb-2">Nenhuma quadra cadastrada</h3>
            <p className="text-white/70 mb-6">Comece cadastrando sua primeira quadra esportiva</p>
            <Button 
              onClick={() => setIsAddingCourt(true)}
              className="bg-[#F35410] hover:bg-[#BA2D0B] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Primeira Quadra
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courts.map(court => (
            <Card key={court.id} className="bg-white/10 border-white/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white">{court.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <MapPin className="w-4 h-4 text-white/60" />
                      <span className="text-white/70 text-sm">{court.location.city}, {court.location.state}</span>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${
                      court.status === 'active' ? 'border-green-500 text-green-400' :
                      court.status === 'pending_approval' ? 'border-yellow-500 text-yellow-400' :
                      'border-red-500 text-red-400'
                    }`}
                  >
                    {court.status === 'active' ? 'Ativa' : 
                     court.status === 'pending_approval' ? 'Pendente' : 'Inativa'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#F35410]" />
                    <span className="text-white font-bold">R$ {court.hourlyRate}/hora</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {court.sports.map(sport => (
                      <Badge key={sport} variant="secondary" className="bg-white/20 text-white">
                        {sportTypes.find(s => s.id === sport)?.name}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button size="sm" className="bg-[#F35410] hover:bg-[#BA2D0B] text-white">
                      <Clock className="w-4 h-4 mr-1" />
                      Agenda
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourtManagement;
