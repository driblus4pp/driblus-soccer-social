import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Search, Navigation, Filter } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import { useBookings } from "@/hooks/useBookings";
import { useFeedbackReminder } from "@/hooks/useFeedbackReminder";
import FeedbackBanner from "@/components/feedback/FeedbackBanner";
import RatingModal from "@/components/RatingModal";
import { Booking } from "@/types";

const mockCourts = [{
  id: '1',
  name: 'No Alvo Society',
  location: 'Aldeota, Fortaleza - CE',
  distance: '2.5 km',
  price: 'R$ 120',
  rating: 4.8,
  status: 'available',
  image: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=300&fit=crop',
  isRecommended: true,
  amenities: ['Vestiário', 'Estacionamento', 'Chuveiro']
}, {
  id: '2',
  name: 'Gol de Placa',
  location: 'Meireles, Fortaleza - CE',
  distance: '1.8 km',
  price: 'R$ 150',
  rating: 4.9,
  status: 'available',
  image: 'https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?w=400&h=300&fit=crop',
  isRecommended: true,
  amenities: ['Vestiário', 'Bar', 'Iluminação']
}, {
  id: '3',
  name: 'Arena Pro Sports',
  location: 'Cocó, Fortaleza - CE',
  distance: '3.2 km',
  price: 'R$ 200',
  rating: 4.7,
  status: 'unavailable',
  image: 'https://images.unsplash.com/photo-1544989164-44a5ba64d0c6?w=400&h=300&fit=crop',
  isRecommended: true,
  amenities: ['Vestiário', 'Estacionamento', 'Academia']
}, {
  id: '4',
  name: 'Sport Center',
  location: 'Papicu, Fortaleza - CE',
  distance: '4.1 km',
  price: 'R$ 180',
  rating: 4.6,
  status: 'available',
  image: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=300&fit=crop',
  isRecommended: false,
  amenities: ['Vestiário', 'Chuveiro']
}];

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const { bookings, addRating } = useBookings();
  const { reminderBookings, dismissReminder } = useFeedbackReminder(bookings);
  const [selectedBookingForRating, setSelectedBookingForRating] = useState<Booking | null>(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return 'Bom dia';
    } else if (hour >= 12 && hour < 18) {
      return 'Boa tarde';
    } else {
      return 'Boa noite';
    }
  };

  const filteredCourts = mockCourts.filter(court => court.name.toLowerCase().includes(searchTerm.toLowerCase()) || court.location.toLowerCase().includes(searchTerm.toLowerCase()));
  const recommendedCourts = filteredCourts.filter(court => court.isRecommended);

  const getStatusBadge = (status: string) => {
    return status === 'available' ? <Badge className="bg-green-500 text-white text-xs">Disponível</Badge> : <Badge className="bg-red-500 text-white text-xs">Indisponível</Badge>;
  };

  const handleRateBooking = (booking: Booking) => {
    setSelectedBookingForRating(booking);
    setIsRatingModalOpen(true);
  };

  const handleSubmitRating = (bookingId: string, stars: number, comment: string) => {
    addRating(bookingId, stars, comment);
    dismissReminder(bookingId);
    setIsRatingModalOpen(false);
    setSelectedBookingForRating(null);
  };

  const handleDismissReminder = (bookingId: string) => {
    dismissReminder(bookingId);
  };

  return (
    <div className="min-h-screen bg-[#093758] pb-20">
      {/* Header com localização */}
      <div className="px-4 py-6 shadow-sm bg-[#093758]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-medium text-white">
              {getGreeting()}, {user?.name?.split(' ')[0] || 'Janderson'}!
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/0e6fb8a5-a6de-4b38-955c-58e7bcef94bb.png" 
              alt="Driblus" 
              className="h-8"
            />
          </div>
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

        {/* Feedback Reminders */}
        {reminderBookings.length > 0 && (
          <div className="space-y-2">
            {reminderBookings.map(reminder => {
              const booking = bookings.find(b => b.id === reminder.bookingId);
              return booking ? (
                <FeedbackBanner
                  key={booking.id}
                  booking={booking}
                  onRate={handleRateBooking}
                  onDismiss={handleDismissReminder}
                />
              ) : null;
            })}
          </div>
        )}
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Seção Recomendados para você */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-white">Recomendados para você</h2>
          <div className="space-y-4">
            {recommendedCourts.map(court => (
              <Card key={court.id} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow bg-white border-0 rounded-2xl" onClick={() => navigate(`/cliente/quadra/${court.id}`)}>
                <div className="relative">
                  <img src={court.image} alt={court.name} className="w-full h-56 object-cover" />
                  
                  {/* Rating badge no canto superior direito */}
                  <div className="absolute top-4 right-4 bg-[#F35410] text-white px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-semibold">{court.rating}</span>
                  </div>

                  {/* Status badge no canto superior esquerdo */}
                  <div className="absolute top-4 left-4">
                    {getStatusBadge(court.status)}
                  </div>

                  {/* Overlay com informações na parte inferior */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                    <div className="text-white">
                      <h3 className="font-bold text-xl mb-1">{court.name}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{court.location}</span>
                        <span className="text-sm">• {court.distance}</span>
                      </div>
                      
                      {/* Amenities tags */}
                      <div className="flex gap-2 mb-3">
                        {court.amenities.map((amenity, index) => (
                          <span key={index} className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                            {amenity}
                          </span>
                        ))}
                      </div>
                      
                      {/* Preço e botão */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[#F35410] font-bold text-xl">{court.price}</span>
                          <span className="text-white/80 text-sm">/hora</span>
                        </div>
                        <Button size="sm" className="bg-[#F35410] hover:bg-[#BA2D0B] text-white px-6" disabled={court.status === 'unavailable'}>
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
            <h2 className="text-xl font-bold text-white mb-4">Outras opções</h2>
            <div className="space-y-3">
              {filteredCourts.filter(court => !court.isRecommended).map(court => (
                <Card 
                  key={court.id} 
                  className="cursor-pointer hover:shadow-md transition-all hover:bg-white/20 bg-white/10 border-white/20" 
                  onClick={() => navigate(`/cliente/quadra/${court.id}`)}
                >
                  <CardContent className="p-0">
                    <div className="flex gap-4">
                      <img 
                        src={court.image} 
                        alt={court.name} 
                        className="w-28 h-28 object-cover rounded-2xl shadow-md ring-2 ring-white/10 hover:scale-105 transition-all duration-300 m-3" 
                      />
                      <div className="flex-1 p-3">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-white">{court.name}</h3>
                          {getStatusBadge(court.status)}
                        </div>
                        <div className="flex items-center gap-1 text-white/70 text-sm mb-2">
                          <MapPin className="w-3 h-3" />
                          <span>{court.location}</span>
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
          </div>
        )}
      </div>

      {/* Navegação inferior */}
      <BottomNavigation userType="client" />
      
      {/* Rating Modal */}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => {
          setIsRatingModalOpen(false);
          setSelectedBookingForRating(null);
        }}
        booking={selectedBookingForRating}
        onSubmit={handleSubmitRating}
      />
    </div>
  );
};

export default ClientDashboard;
