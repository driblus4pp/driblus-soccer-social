import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowLeft, MapPin, Star, Clock, Calendar, AlertTriangle, Car, Shirt, Droplets, Coffee, Lightbulb } from "lucide-react";
import { useCourts } from "@/hooks/useCourts";
import { SportType } from "@/types";
const CourtDetailsPage = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const {
    getCourtById,
    getActiveCourts
  } = useCourts();
  const court = getCourtById(id || '');
  const alternativeCourts = getActiveCourts().filter(c => c.id !== id).slice(0, 2);
  const facilityIcons = {
    'Estacionamento': Car,
    'Vestiário': Shirt,
    'Chuveiro': Droplets,
    'Bar': Coffee,
    'Iluminação': Lightbulb
  };
  if (!court) {
    return <div className="min-h-screen bg-[#062B4B] flex items-center justify-center">
        <div className="text-white">Quadra não encontrada</div>
      </div>;
  }
  const isAvailable = court.status === 'active';
  const workingHoursText = `${court.workingHours.monday.openTime} - ${court.workingHours.monday.closeTime}`;
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
              {court.images.map((image, index) => <CarouselItem key={index}>
                  <div className="relative">
                    <img src={image} alt={`${court.name} - Imagem ${index + 1}`} className="w-full h-64 object-cover rounded-2xl" />
                  </div>
                </CarouselItem>)}
            </CarouselContent>

            {/* Navigation arrows - only show if more than 1 image */}
            {court.images.length > 1 && <>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white border-none hover:bg-black/70" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white border-none hover:bg-black/70" />
              </>}
          </Carousel>
        </div>

        {/* Availability Status Alert */}
        {!isAvailable && <Card className="bg-red-500/20 border-red-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-white font-medium">Quadra Indisponível</p>
                  {court.unavailabilityReason && <p className="text-white/70 text-sm">{court.unavailabilityReason}</p>}
                </div>
              </div>
            </CardContent>
          </Card>}

        {/* Court Name and Price */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-white text-xl mx-[15px]">{court.name}</h2>
            <div className="flex items-center gap-2 text-white/70 mt-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{court.location.address}, {court.location.city}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[#F35410]">R$ {court.hourlyRate}</div>
            <div className="text-white/60 text-sm">por hora</div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 fill-[#F35410] text-[#F35410]" />
            <span className="text-2xl font-bold text-white">{court.rating}</span>
          </div>
          <span className="text-white/60">({court.totalReviews} avaliações)</span>
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
                  <span>{workingHoursText}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span className="text-sm">Sábado:</span>
                  <span>{court.workingHours.saturday.openTime} - {court.workingHours.saturday.closeTime}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span className="text-sm">Domingo:</span>
                  <span>{court.workingHours.sunday.isOpen ? `${court.workingHours.sunday.openTime} - ${court.workingHours.sunday.closeTime}` : 'Fechado'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Sports */}
            

            {/* Amenities */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">Comodidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {court.amenities.map((amenity, index) => {
                  const IconComponent = facilityIcons[amenity as keyof typeof facilityIcons];
                  return <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-green-600/20 text-green-400">
                        {IconComponent && <IconComponent className="w-4 h-4" />}
                        <span className="text-white text-sm">{amenity}</span>
                      </div>;
                })}
                </div>
              </CardContent>
            </Card>

            {/* Alternative Courts for Unavailable Courts */}
            {!isAvailable && alternativeCourts.length > 0 && <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Quadras Alternativas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {alternativeCourts.map(altCourt => <div key={altCourt.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10" onClick={() => navigate(`/cliente/quadra/${altCourt.id}`)}>
                      <div className="flex items-center gap-3">
                        <img src={altCourt.images[0]} alt={altCourt.name} className="w-12 h-12 object-cover rounded-lg" />
                        <div>
                          <h4 className="text-white font-medium">{altCourt.name}</h4>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-white/70 text-sm">{altCourt.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[#F35410] font-bold">R$ {altCourt.hourlyRate}</span>
                        <Badge className="bg-green-500 text-white text-xs ml-2">Disponível</Badge>
                      </div>
                    </div>)}
                </CardContent>
              </Card>}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4 mt-6">
            <div className="text-center py-8">
              <Star className="w-12 h-12 mx-auto mb-4 text-white/60" />
              <h3 className="text-lg font-semibold text-white mb-2">Sistema de Avaliações</h3>
              <p className="text-white/70">Em desenvolvimento - Em breve você poderá ver as avaliações dos usuários</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Book Button */}
        {isAvailable ? <Button onClick={() => navigate(`/cliente/quadra/${court.id}/agendar`)} className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white py-4 text-lg font-semibold rounded-2xl">
            <Calendar className="w-5 h-5 mr-2" />
            Agendar Horário
          </Button> : <Button disabled className="w-full bg-gray-600 text-white py-4 text-lg font-semibold rounded-2xl opacity-50 cursor-not-allowed">
            Quadra Indisponível
          </Button>}
      </div>
    </div>;
};
export default CourtDetailsPage;