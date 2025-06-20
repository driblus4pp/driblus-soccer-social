import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Search, Filter, ArrowLeft } from "lucide-react";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import FilterModal, { FilterState } from "@/components/FilterModal";
const mockCourts = [{
  id: '1',
  name: 'No Alvo Society',
  location: 'Aldeota, Fortaleza - CE',
  distance: '2.5 km',
  price: 'R$ 120',
  rating: 4.8,
  status: 'available',
  image: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=300&fit=crop',
  amenities: ['Vestiário', 'Estacionamento', 'Chuveiro'],
  city: 'fortaleza',
  neighborhood: 'aldeota',
  modality: 'futebol',
  operatingHours: '24h'
}, {
  id: '2',
  name: 'Gol de Placa',
  location: 'Meireles, Fortaleza - CE',
  distance: '1.8 km',
  price: 'R$ 150',
  rating: 4.9,
  status: 'available',
  image: 'https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?w=400&h=300&fit=crop',
  amenities: ['Vestiário', 'Bar', 'Iluminação'],
  city: 'fortaleza',
  neighborhood: 'meireles',
  modality: 'futebol',
  operatingHours: 'noite'
}, {
  id: '3',
  name: 'Arena Pro Sports',
  location: 'Cocó, Fortaleza - CE',
  distance: '3.2 km',
  price: 'R$ 200',
  rating: 4.7,
  status: 'unavailable',
  image: 'https://images.unsplash.com/photo-1544989164-44a5ba64d0c6?w=400&h=300&fit=crop',
  amenities: ['Vestiário', 'Estacionamento', 'Academia'],
  city: 'fortaleza',
  neighborhood: 'coco',
  modality: 'basquete',
  operatingHours: 'manha'
}];
const ClientCourts = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    city: '',
    neighborhood: '',
    modality: '',
    operatingHours: ''
  });
  const filteredCourts = mockCourts.filter(court => {
    const matchesSearch = court.name.toLowerCase().includes(searchTerm.toLowerCase()) || court.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilters = (!filters.city || court.city === filters.city) && (!filters.neighborhood || court.neighborhood === filters.neighborhood) && (!filters.modality || court.modality === filters.modality) && (!filters.operatingHours || court.operatingHours === filters.operatingHours);
    return matchesSearch && matchesFilters;
  });
  const getStatusBadge = (status: string) => {
    return status === 'available' ? <Badge className="bg-green-500 text-white text-xs">Disponível</Badge> : <Badge className="bg-red-500 text-white text-xs">Indisponível</Badge>;
  };
  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
  };
  const hasActiveFilters = filters.city || filters.neighborhood || filters.modality || filters.operatingHours;
  return <div className="min-h-screen bg-[#093758] pb-20">
      {/* Header */}
      <div className="px-4 py-6 bg-[#093758]">
        <div className="flex items-center gap-4 mb-6">
          
          <h1 className="text-xl font-semibold text-white">Quadras</h1>
        </div>

        {/* Barra de busca com filtro */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Buscar quadras, bairros..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 rounded-xl" />
          </div>
          <Button variant="outline" size="icon" onClick={() => setIsFilterModalOpen(true)} className={`rounded-full w-12 h-12 border-white/20 hover:bg-white/20 transition-all duration-200 ${hasActiveFilters ? 'bg-[#F35410] border-[#F35410] text-white' : 'bg-white/10 text-white'}`}>
            <Filter className="w-5 h-5" />
          </Button>
        </div>

        {/* Indicador de filtros ativos */}
        {hasActiveFilters && <div className="flex gap-2 mb-2">
            <span className="text-white/70 text-sm">Filtros ativos:</span>
            {filters.city && <Badge className="bg-white/20 text-white text-xs">{filters.city}</Badge>}
            {filters.neighborhood && <Badge className="bg-white/20 text-white text-xs">{filters.neighborhood}</Badge>}
            {filters.modality && <Badge className="bg-white/20 text-white text-xs">{filters.modality}</Badge>}
            {filters.operatingHours && <Badge className="bg-white/20 text-white text-xs">{filters.operatingHours}</Badge>}
          </div>}
      </div>

      <div className="px-4 space-y-4">
        {filteredCourts.map(court => <Card key={court.id} className="cursor-pointer hover:shadow-md transition-shadow bg-white/10 border-white/20" onClick={() => navigate(`/cliente/quadra/${court.id}`)}>
            <CardContent className="p-0">
              <div className="flex gap-3">
                <img src={court.image} alt={court.name} className="w-24 h-24 object-cover rounded-l-lg" />
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
                    {court.amenities.slice(0, 2).map((amenity, index) => <span key={index} className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                        {amenity}
                      </span>)}
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
          </Card>)}
      </div>

      <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} onApplyFilters={handleApplyFilters} filters={filters} />

      <BottomNavigation userType="client" />
    </div>;
};
export default ClientCourts;