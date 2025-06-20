import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowLeft, MapPin, Star, Clock, Calendar, Users, Car, Shirt, Droplets, Coffee, Lightbulb } from "lucide-react";

const mockCourtDetails = {
  '1': {
    id: '1',
    name: 'No Alvo Society',
    location: 'Rua Major Facundo, 123 - Aldeota, Fortaleza - CE',
    distance: '2.5 km',
    price: 'R$ 120',
    rating: 4.8,
    totalReviews: 47,
    description: 'Quadra society com grama sintética de alta qualidade, vestiários completos e estacionamento gratuito para todos os clientes.',
    modalities: ['Futebol Society', 'Futsal', 'Futebol de Campo'],
    workingHours: {
      weekdays: '06:00 - 22:00',
      weekend: '07:00 - 20:00'
    },
    amenities: [{
      name: 'Estacionamento',
      icon: Car,
      available: true
    }, {
      name: 'Vestiário',
      icon: Shirt,
      available: true
    }, {
      name: 'Chuveiro',
      icon: Droplets,
      available: true
    }, {
      name: 'Bar',
      icon: Coffee,
      available: false
    }, {
      name: 'Iluminação',
      icon: Lightbulb,
      available: true
    }],
    images: ['https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=600&h=400&fit=crop', 'https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?w=600&h=400&fit=crop'],
    reviews: [{
      user: 'João Silva',
      rating: 5,
      comment: 'Excelente quadra! Muito bem cuidada e com ótima localização.',
      date: '15 de junho, 2024'
    }, {
      user: 'Maria Santos',
      rating: 4,
      comment: 'Boa infraestrutura, mas poderia ter mais horários disponíveis.',
      date: '10 de junho, 2024'
    }]
  }
};

const CourtDetailsPage = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const court = mockCourtDetails[id as keyof typeof mockCourtDetails];
  
  if (!court) {
    return <div className="min-h-screen bg-[#062B4B] flex items-center justify-center">
      <div className="text-white">Quadra não encontrada</div>
    </div>;
  }
  
  return <div className="min-h-screen bg-[#062B4B]">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/cliente/dashboard')} className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-white">Detalhes da Quadra</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Image Gallery with Carousel */}
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {court.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative">
                    <img 
                      src={image} 
                      alt={`${court.name} - Imagem ${index + 1}`} 
                      className="w-full h-64 object-cover rounded-2xl" 
                    />
                    
                    {/* Rating badge sobreposto */}
                    <div className="absolute top-4 right-4 bg-[#F35410] text-white px-3 py-2 rounded-full flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-semibold">{court.rating}</span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation arrows - only show if more than 1 image */}
            {court.images.length > 1 && (
              <>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white border-none hover:bg-black/70" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white border-none hover:bg-black/70" />
              </>
            )}
          </Carousel>
        </div>

        {/* Court Name and Price */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-white text-xl mx-[15px]">{court.name}</h2>
            <div className="flex items-center gap-2 text-white/70 mt-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{court.location}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[#F35410]">{court.price}</div>
            <div className="text-white/60 text-sm">por hora</div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 border-white/20">
            <TabsTrigger value="details" className="text-white data-[state=active]:bg-[#F35410] data-[state=active]:text-white">
              Detalhes
            </TabsTrigger>
            <TabsTrigger value="reviews" className="text-white data-[state=active]:bg-[#F35410] data-[state=active]:text-white">
              Avaliações
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6 mt-6">
            {/* Description */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">Sobre a Quadra</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90 text-sm">{court.description}</p>
              </CardContent>
            </Card>

            {/* Working Hours */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5" />
                  Horários de Funcionamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-white">
                  <span className="text-sm">Segunda a Sexta:</span>
                  <span>{court.workingHours.weekdays}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span className="text-sm">Sábado e Domingo:</span>
                  <span>{court.workingHours.weekend}</span>
                </div>
              </CardContent>
            </Card>

            {/* Modalities */}
            <Card className="bg-white/10 border-white/20">
              
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {court.modalities.map((modality, index) => <Badge key={index} className="bg-[#F35410] text-white hover:bg-[#BA2D0B] my-0">
                      {modality}
                    </Badge>)}
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">Comodidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {court.amenities.map((amenity, index) => {
                  const IconComponent = amenity.icon;
                  return <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${amenity.available ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
                        
                        <span className="text-white text-sm">{amenity.name}</span>
                        {amenity.available}
                      </div>;
                })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="space-y-4 mt-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 fill-[#F35410] text-[#F35410]" />
                <span className="text-2xl font-bold text-white">{court.rating}</span>
              </div>
              <span className="text-white/60">({court.totalReviews} avaliações)</span>
            </div>
            
            {court.reviews.map((review, index) => <Card key={index} className="bg-white/10 border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">{review.user}</span>
                    <div className="flex items-center gap-1">
                      {Array.from({
                    length: review.rating
                  }).map((_, i) => <Star key={i} className="w-4 h-4 text-[#F35410] fill-current" />)}
                    </div>
                  </div>
                  <p className="text-white/80 mb-2">{review.comment}</p>
                  <span className="text-white/60 text-sm">{review.date}</span>
                </CardContent>
              </Card>)}
          </TabsContent>
        </Tabs>

        {/* Book Button */}
        <Button onClick={() => navigate(`/cliente/quadra/${court.id}/agendar`)} className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white py-4 text-lg font-semibold rounded-2xl">
          <Calendar className="w-5 h-5 mr-2" />
          Agendar Horário
        </Button>
      </div>
    </div>;
};
export default CourtDetailsPage;
