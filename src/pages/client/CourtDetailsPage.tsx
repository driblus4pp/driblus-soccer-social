
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, Star, Clock, Calendar, Users } from "lucide-react";

const mockCourtDetails = {
  '1': {
    id: '1',
    name: 'No Alvo Society',
    location: 'Rua Major Facundo, 123 - Aldeota, Fortaleza - CE',
    distance: '2.5 km',
    price: 'R$ 120',
    rating: 4.8,
    totalReviews: 47,
    description: 'Quadra society com grama sintética de alta qualidade, vestiários completos e estacionamento.',
    amenities: ['Vestiário', 'Estacionamento', 'Chuveiro', 'Iluminação'],
    workingHours: {
      weekdays: '06:00 - 22:00',
      weekend: '07:00 - 20:00'
    },
    images: [
      'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?w=600&h=400&fit=crop'
    ]
  }
};

const CourtDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const court = mockCourtDetails[id as keyof typeof mockCourtDetails];

  if (!court) {
    return <div>Quadra não encontrada</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B]">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/cliente/dashboard')}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-white">Detalhes da Quadra</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Image Gallery */}
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-0">
            <div className="relative">
              <img 
                src={court.images[currentImageIndex]} 
                alt={court.name} 
                className="w-full h-48 object-cover rounded-t-lg"
              />
              {court.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {court.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Court Info */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>{court.name}</span>
              <span className="text-2xl font-bold text-[#F35410]">{court.price}/h</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{court.location}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-white">{court.rating}</span>
                <span className="text-white/60 text-sm">({court.totalReviews} avaliações)</span>
              </div>
              <div className="flex items-center gap-1 text-white/60">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{court.distance}</span>
              </div>
            </div>

            <p className="text-white/90 text-sm">{court.description}</p>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Horários de Funcionamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-white">
              <span>Segunda a Sexta:</span>
              <span>{court.workingHours.weekdays}</span>
            </div>
            <div className="flex justify-between text-white">
              <span>Sábado e Domingo:</span>
              <span>{court.workingHours.weekend}</span>
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Comodidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {court.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2 text-white/90">
                  <span className="text-green-400">✓</span>
                  <span className="text-sm">{amenity}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Book Button */}
        <Button
          onClick={() => navigate(`/cliente/quadra/${court.id}/agendar`)}
          className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white py-4 text-lg font-semibold"
        >
          <Calendar className="w-5 h-5 mr-2" />
          Agendar Horário
        </Button>
      </div>
    </div>
  );
};

export default CourtDetailsPage;
