
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Search, Filter, AlertCircle, Calendar } from "lucide-react";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import FilterModal, { FilterState } from "@/components/FilterModal";
import { useCourts } from "@/hooks/useCourts";
import { SportType } from "@/types";

const ClientCourts = () => {
  const navigate = useNavigate();
  const { courts } = useCourts();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedSportFilter, setSelectedSportFilter] = useState<string>('all');
  const [filters, setFilters] = useState<FilterState>({
    city: '',
    neighborhood: '',
    modality: '',
    operatingHours: ''
  });

  const sportFilters = [
    { id: 'all', label: 'Todos', sport: null },
    { id: 'football', label: 'Futebol', sport: SportType.FOOTBALL },
    { id: 'basketball', label: 'Basquete', sport: SportType.BASKETBALL },
    { id: 'tennis', label: 'Tênis', sport: SportType.TENNIS },
    { id: 'volleyball', label: 'Vôlei', sport: SportType.VOLLEYBALL }
  ];

  const courtData = courts.map(court => ({
    id: court.id,
    name: court.name,
    location: `${court.location.city}, ${court.location.state}`,
    address: court.location.address,
    distance: '2.5 km',
    price: `R$ ${court.hourlyRate}`,
    rating: court.rating,
    status: court.status === 'active' ? 'available' : 'unavailable',
    image: court.images[0],
    amenities: court.amenities,
    sports: court.sports,
    city: court.location.city.toLowerCase(),
    neighborhood: court.location.address.toLowerCase(),
    modality: court.sports.includes(SportType.FOOTBALL) ? 'futebol' : 
              court.sports.includes(SportType.BASKETBALL) ? 'basquete' : 'volleyball',
    operatingHours: '24h',
    unavailabilityReason: court.unavailabilityReason
  }));

  const filteredCourts = courtData.filter(court => {
    const matchesSearch = court.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         court.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilters = (!filters.city || court.city === filters.city) && 
                          (!filters.neighborhood || court.neighborhood.includes(filters.neighborhood)) && 
                          (!filters.modality || court.modality === filters.modality) && 
                          (!filters.operatingHours || court.operatingHours === filters.operatingHours);
    
    const matchesSportFilter = selectedSportFilter === 'all' || 
                              court.sports.includes(sportFilters.find(f => f.id === selectedSportFilter)?.sport!);
    
    return matchesSearch && matchesFilters && matchesSportFilter;
  });

  const getSportLabel = (sport: SportType) => {
    switch (sport) {
      case SportType.FOOTBALL:
        return 'Futebol';
      case SportType.FUTSAL:
        return 'Futsal';
      case SportType.BASKETBALL:
        return 'Basquete';
      case SportType.VOLLEYBALL:
        return 'Vôlei';
      case SportType.TENNIS:
        return 'Tênis';
      case SportType.PADEL:
        return 'Padel';
      default:
        return sport;
    }
  };

  const getStatusBadge = (status: string, unavailabilityReason?: string) => {
    if (status === 'available') {
      return <Badge className="bg-green-500 text-white text-xs">Disponível</Badge>;
    } else {
      return (
        <div className="flex flex-col items-end gap-1">
          <Badge className="bg-red-500 text-white text-xs">Indisponível</Badge>
          {unavailabilityReason && (
            <div className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-yellow-400" />
              <span className="text-xs text-yellow-400">Motivo</span>
            </div>
          )}
        </div>
      );
    }
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const hasActiveFilters = filters.city || filters.neighborhood || filters.modality || filters.operatingHours || selectedSportFilter !== 'all';

  return (
    <div className="min-h-screen bg-[#093758] pb-20">
      {/* Header */}
      <div className="px-4 py-6 bg-[#093758]">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-xl font-semibold text-white">Quadras</h1>
        </div>

        {/* Barra de busca com filtro */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar quadras, bairros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 rounded-xl"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsFilterModalOpen(true)}
            className={`rounded-full w-12 h-12 border-white/20 hover:bg-white/20 transition-all duration-200 ${
              hasActiveFilters ? 'bg-[#F35410] border-[#F35410] text-white' : 'bg-white/10 text-white'
            }`}
          >
            <Filter className="w-5 h-5" />
          </Button>
        </div>

        {/* Filtros por modalidade esportiva */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {sportFilters.map((filter) => (
            <Button
              key={filter.id}
              variant="outline"
              size="sm"
              onClick={() => setSelectedSportFilter(filter.id)}
              className={`flex-shrink-0 rounded-full border transition-all duration-200 ${
                selectedSportFilter === filter.id
                  ? 'bg-[#F35410] border-[#F35410] text-white hover:bg-[#BA2D0B]'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Indicador de filtros ativos */}
        {hasActiveFilters && (
          <div className="flex gap-2 mb-2">
            <span className="text-white/70 text-sm">Filtros ativos:</span>
            {selectedSportFilter !== 'all' && (
              <Badge className="bg-white/20 text-white text-xs">
                {sportFilters.find(f => f.id === selectedSportFilter)?.label}
              </Badge>
            )}
            {filters.city && <Badge className="bg-white/20 text-white text-xs">{filters.city}</Badge>}
            {filters.neighborhood && <Badge className="bg-white/20 text-white text-xs">{filters.neighborhood}</Badge>}
            {filters.modality && <Badge className="bg-white/20 text-white text-xs">{filters.modality}</Badge>}
            {filters.operatingHours && <Badge className="bg-white/20 text-white text-xs">{filters.operatingHours}</Badge>}
          </div>
        )}

        {/* Contador de resultados */}
        <div className="text-white/70 text-sm mb-4">
          {filteredCourts.length} {filteredCourts.length === 1 ? 'quadra encontrada' : 'quadras encontradas'}
        </div>
      </div>

      {/* Cards de quadras - Layout em grid */}
      <div className="px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCourts.map((court) => (
            <Card
              key={court.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-white border-0 overflow-hidden group"
              onClick={() => navigate(`/cliente/quadra/${court.id}`)}
            >
              <CardContent className="p-0">
                {/* Imagem de destaque */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={court.image}
                    alt={court.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(court.status, court.unavailabilityReason)}
                  </div>
                  <div className="absolute top-3 left-3">
                    <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-white text-xs font-medium">{court.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Conteúdo do card */}
                <div className="p-4">
                  {/* Nome da quadra */}
                  <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">
                    {court.name}
                  </h3>

                  {/* Localização */}
                  <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="line-clamp-1">{court.address}</span>
                    <span className="text-gray-400">• {court.distance}</span>
                  </div>

                  {/* Modalidades esportivas */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {court.sports.slice(0, 3).map((sport, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1"
                      >
                        {getSportLabel(sport)}
                      </Badge>
                    ))}
                    {court.sports.length > 3 && (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs px-2 py-1">
                        +{court.sports.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Comodidades */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {court.amenities.slice(0, 3).map((amenity, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                    {court.amenities.length > 3 && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        +{court.amenities.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Mensagem de indisponibilidade */}
                  {court.status === 'unavailable' && court.unavailabilityReason && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <p className="text-yellow-800 text-xs font-medium">{court.unavailabilityReason}</p>
                    </div>
                  )}

                  {/* Preço e botão de ação */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-1">
                        <span className="font-bold text-[#F35410] text-xl">{court.price}</span>
                        <span className="text-gray-500 text-sm">/hora</span>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      className={`flex items-center gap-1 ${
                        court.status === 'available'
                          ? 'bg-[#F35410] hover:bg-[#BA2D0B] text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={court.status !== 'available'}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (court.status === 'available') {
                          navigate(`/cliente/quadra/${court.id}`);
                        }
                      }}
                    >
                      <Calendar className="w-4 h-4" />
                      {court.status === 'available' ? 'Agendar' : 'Indisponível'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mensagem quando não há resultados */}
        {filteredCourts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-white/70 mb-4">
              <Search className="w-12 h-12 mx-auto mb-2" />
              <p className="text-lg">Nenhuma quadra encontrada</p>
              <p className="text-sm">Tente ajustar os filtros de busca</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedSportFilter('all');
                setFilters({
                  city: '',
                  neighborhood: '',
                  modality: '',
                  operatingHours: ''
                });
              }}
              className="border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        filters={filters}
      />

      <BottomNavigation userType="client" />
    </div>
  );
};

export default ClientCourts;
