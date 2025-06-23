import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Search, Filter, AlertCircle } from "lucide-react";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import FilterModal, { FilterState } from "@/components/FilterModal";
import { useCourts } from "@/hooks/useCourts";
import { SportType } from "@/types";

const ClientCourts = () => {
  const navigate = useNavigate();
  const { courts } = useCourts();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    city: '',
    neighborhood: '',
    modality: '',
    operatingHours: ''
  });

  const courtData = courts.map(court => ({
    id: court.id,
    name: court.name,
    location: `${court.location.city}, ${court.location.state}`,
    distance: '2.5 km', // Simulado
    price: `R$ ${court.hourlyRate}`,
    rating: court.rating,
    status: court.status === 'active' ? 'available' : 'unavailable',
    image: court.images[0],
    amenities: court.amenities,
    city: court.location.city.toLowerCase(),
    neighborhood: court.location.address.toLowerCase(),
    modality: court.sports.includes(SportType.FOOTBALL) ? 'futebol' : 
              court.sports.includes(SportType.BASKETBALL) ? 'basquete' : 'volleyball',
    operatingHours: '24h', // Simplificado
    unavailabilityReason: court.unavailabilityReason
  }));

  const filteredCourts = courtData.filter(court => {
    const matchesSearch = court.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         court.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilters = (!filters.city || court.city === filters.city) && 
                          (!filters.neighborhood || court.neighborhood.includes(filters.neighborhood)) && 
                          (!filters.modality || court.modality === filters.modality) && 
                          (!filters.operatingHours || court.operatingHours === filters.operatingHours);
    return matchesSearch && matchesFilters;
  });

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

  const hasActiveFilters = filters.city || filters.neighborhood || filters.modality || filters.operatingHours;

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

        {/* Indicador de filtros ativos */}
        {hasActiveFilters && (
          <div className="flex gap-2 mb-2">
            <span className="text-white/70 text-sm">Filtros ativos:</span>
            {filters.city && <Badge className="bg-white/20 text-white text-xs">{filters.city}</Badge>}
            {filters.neighborhood && <Badge className="bg-white/20 text-white text-xs">{filters.neighborhood}</Badge>}
            {filters.modality && <Badge className="bg-white/20 text-white text-xs">{filters.modality}</Badge>}
            {filters.operatingHours && <Badge className="bg-white/20 text-white text-xs">{filters.operatingHours}</Badge>}
          </div>
        )}
      </div>

      <div className="px-4 space-y-4">
        {filteredCourts.map((court) => (
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
                    {getStatusBadge(court.status, court.unavailabilityReason)}
                  </div>
                  <div className="flex items-center gap-1 text-white/70 text-sm mb-2">
                    <MapPin className="w-3 h-3" />
                    <span>{court.location}</span>
                    <span>• {court.distance}</span>
                  </div>
                  {court.status === 'unavailable' && court.unavailabilityReason && (
                    <div className="bg-yellow-500/20 border border-yellow-500/30 rounded p-2 mb-2">
                      <p className="text-yellow-200 text-xs">{court.unavailabilityReason}</p>
                    </div>
                  )}
                  <div className="flex gap-1 mb-2">
                    {court.amenities.slice(0, 2).map((amenity, index) => (
                      <span
                        key={index}
                        className="bg-white/20 text-white text-xs px-2 py-1 rounded-full"
                      >
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
