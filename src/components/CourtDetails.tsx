
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MapPin, Clock, Star, Car, Users, Shirt, Droplets, Coffee, Lightbulb } from "lucide-react";

interface Court {
  id: number;
  name: string;
  location: string;
  distance: string;
  price: string;
  rating: number;
  status: string;
  image: string;
  amenities: string[];
  extraInfo: string;
  description: string;
  modalities: string[];
  operatingHours: string;
  facilities: {
    parking: boolean;
    dressing_room: boolean;
    showers: boolean;
    bar: boolean;
    lighting: boolean;
  };
  reviews: {
    user: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

interface CourtDetailsProps {
  court: Court;
  onBack: () => void;
}

const CourtDetails = ({ court, onBack }: CourtDetailsProps) => {
  const facilityIcons = {
    parking: Car,
    dressing_room: Shirt,
    showers: Droplets,
    bar: Coffee,
    lighting: Lightbulb
  };

  const facilityLabels = {
    parking: "Estacionamento",
    dressing_room: "Vestiário",
    showers: "Chuveiros",
    bar: "Bar",
    lighting: "Iluminação"
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-xl font-bold text-white">Detalhes da Quadra</h2>
      </div>

      {/* Main image */}
      <div className="relative">
        <img 
          src={court.image} 
          alt={court.name} 
          className="w-full h-64 object-cover rounded-2xl"
        />
        <div className="absolute top-4 right-4 bg-[#F35410] text-white px-3 py-1 rounded-full flex items-center gap-1">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm font-semibold">{court.rating}</span>
        </div>
      </div>

      {/* Court info */}
      <Card className="bg-white/10 border-white/20">
        <CardContent className="p-6">
          <h3 className="text-2xl font-bold text-white mb-2">{court.name}</h3>
          
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-white/60" />
            <span className="text-white/70">{court.location}</span>
            <span className="text-white/60">| {court.distance}</span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-white/60" />
            <span className="text-white/70">{court.operatingHours}</span>
          </div>

          <Badge variant="secondary" className={`${court.status === 'Disponível' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'} mb-4`}>
            {court.status}
          </Badge>
        </CardContent>
      </Card>

      {/* Tabs for details and reviews */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/10">
          <TabsTrigger value="details" className="text-white data-[state=active]:bg-[#F35410] data-[state=active]:text-white">
            Detalhes
          </TabsTrigger>
          <TabsTrigger value="reviews" className="text-white data-[state=active]:bg-[#F35410] data-[state=active]:text-white">
            Avaliações
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-6">
          {/* Description */}
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Descrição</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/90">{court.description}</p>
            </CardContent>
          </Card>

          {/* Modalities */}
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Modalidades Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {court.modalities.map((modality) => (
                  <Badge key={modality} variant="secondary" className="bg-[#F35410] text-white">
                    {modality}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Facilities */}
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Comodidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(court.facilities).map(([key, available]) => {
                  const Icon = facilityIcons[key as keyof typeof facilityIcons];
                  const label = facilityLabels[key as keyof typeof facilityLabels];
                  
                  return (
                    <div key={key} className={`flex items-center gap-3 p-3 rounded-lg ${available ? 'bg-green-600/20' : 'bg-red-600/20'}`}>
                      <Icon className={`w-5 h-5 ${available ? 'text-green-400' : 'text-red-400'}`} />
                      <span className={`${available ? 'text-white' : 'text-white/60'}`}>{label}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews" className="space-y-4">
          {court.reviews.map((review, index) => (
            <Card key={index} className="bg-white/10 border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">{review.user}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white/90">{review.rating}</span>
                  </div>
                </div>
                <p className="text-white/80 mb-2">{review.comment}</p>
                <span className="text-white/60 text-sm">{review.date}</span>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Price and booking */}
      <Card className="bg-gradient-to-r from-[#F35410] to-[#BA2D0B] border-none">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/90 text-sm">Preço por hora</p>
              <p className="text-3xl font-bold text-white">{court.price}</p>
            </div>
          </div>
          <Button className="w-full bg-white text-[#F35410] hover:bg-white/90 font-semibold text-lg py-3">
            Agendar Quadra
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourtDetails;
