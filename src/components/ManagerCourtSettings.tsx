
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building, 
  DollarSign, 
  Clock, 
  Settings, 
  Save, 
  Upload,
  X,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCourts } from "@/hooks/useCourts";

interface ManagerCourtSettingsProps {
  courtId: string;
  onBack: () => void;
}

const ManagerCourtSettings = ({ courtId, onBack }: ManagerCourtSettingsProps) => {
  const { toast } = useToast();
  const { getCourtById, updateCourtStatus, updateCourtPricing, updateCourtAmenities } = useCourts();
  const court = getCourtById(courtId);

  const [formData, setFormData] = useState({
    name: court?.name || '',
    description: court?.description || '',
    hourlyRate: court?.hourlyRate || 0,
    isActive: court?.status === 'active',
    unavailabilityReason: court?.unavailabilityReason || '',
    amenities: court?.amenities || []
  });

  const [newAmenity, setNewAmenity] = useState('');

  const availableAmenities = [
    'Vestiário', 'Estacionamento', 'Chuveiro', 'Bar', 'Iluminação', 
    'Academia', 'Loja de Equipamentos', 'WiFi', 'Ar Condicionado', 'Som'
  ];

  const handleSaveBasicInfo = () => {
    // Aqui seria a integração com backend
    toast({
      title: "Informações Salvas",
      description: "Dados da quadra atualizados com sucesso"
    });
  };

  const handleToggleStatus = (isActive: boolean) => {
    setFormData(prev => ({ ...prev, isActive }));
    const newStatus = isActive ? 'active' : 'inactive';
    const reason = !isActive ? formData.unavailabilityReason : undefined;
    
    updateCourtStatus(courtId, newStatus, reason);
    
    toast({
      title: isActive ? "Quadra Ativada" : "Quadra Desativada",
      description: isActive 
        ? "Sua quadra está disponível para agendamentos" 
        : "Sua quadra foi desativada"
    });
  };

  const handleSavePricing = () => {
    updateCourtPricing(courtId, formData.hourlyRate);
    toast({
      title: "Preços Atualizados",
      description: "Novos valores salvos com sucesso"
    });
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      const updatedAmenities = [...formData.amenities, newAmenity.trim()];
      setFormData(prev => ({ ...prev, amenities: updatedAmenities }));
      updateCourtAmenities(courtId, updatedAmenities);
      setNewAmenity('');
      toast({
        title: "Comodidade Adicionada",
        description: `${newAmenity} foi adicionada à sua quadra`
      });
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    const updatedAmenities = formData.amenities.filter(a => a !== amenity);
    setFormData(prev => ({ ...prev, amenities: updatedAmenities }));
    updateCourtAmenities(courtId, updatedAmenities);
    toast({
      title: "Comodidade Removida",
      description: `${amenity} foi removida da sua quadra`
    });
  };

  if (!court) {
    return (
      <div className="text-center py-12">
        <p className="text-white">Quadra não encontrada</p>
        <Button onClick={onBack} className="mt-4">Voltar</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Configurações da Quadra</h2>
        <Button onClick={onBack} variant="outline" className="border-white/20 text-white">
          Voltar
        </Button>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/10 border-white/20">
          <TabsTrigger value="basic" className="text-white data-[state=active]:bg-[#F35410]">
            Básico
          </TabsTrigger>
          <TabsTrigger value="pricing" className="text-white data-[state=active]:bg-[#F35410]">
            Preços
          </TabsTrigger>
          <TabsTrigger value="amenities" className="text-white data-[state=active]:bg-[#F35410]">
            Comodidades
          </TabsTrigger>
          <TabsTrigger value="images" className="text-white data-[state=active]:bg-[#F35410]">
            Imagens
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Building className="w-5 h-5" />
                Status da Quadra
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white font-semibold">Quadra Ativa</Label>
                  <p className="text-white/70 text-sm">
                    {formData.isActive ? 'Disponível para agendamentos' : 'Indisponível para agendamentos'}
                  </p>
                </div>
                <Switch 
                  checked={formData.isActive} 
                  onCheckedChange={handleToggleStatus}
                />
              </div>
              
              {!formData.isActive && (
                <div className="space-y-2">
                  <Label className="text-white">Motivo da Indisponibilidade</Label>
                  <Textarea
                    value={formData.unavailabilityReason}
                    onChange={(e) => setFormData(prev => ({ ...prev, unavailabilityReason: e.target.value }))}
                    placeholder="Ex: Manutenção preventiva, reforma em andamento..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Nome da Quadra</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Descrição</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <Button onClick={handleSaveBasicInfo} className="bg-[#F35410] hover:bg-[#BA2D0B]">
                <Save className="w-4 h-4 mr-2" />
                Salvar Informações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Configuração de Preços
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Preço por Hora (R$)</Label>
                <Input
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: Number(e.target.value) }))}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <Button onClick={handleSavePricing} className="bg-[#F35410] hover:bg-[#BA2D0B]">
                <Save className="w-4 h-4 mr-2" />
                Salvar Preços
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="amenities" className="space-y-6">
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Comodidades Disponíveis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.amenities.map((amenity, index) => (
                  <Badge 
                    key={index} 
                    className="bg-[#F35410] text-white flex items-center gap-2"
                  >
                    {amenity}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:bg-white/20 rounded" 
                      onClick={() => handleRemoveAmenity(amenity)}
                    />
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="Digite uma nova comodidade"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddAmenity()}
                />
                <Button onClick={handleAddAmenity} className="bg-[#F35410] hover:bg-[#BA2D0B]">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="text-sm text-white/70">
                <p className="mb-2">Sugestões:</p>
                <div className="flex flex-wrap gap-2">
                  {availableAmenities
                    .filter(amenity => !formData.amenities.includes(amenity))
                    .map((amenity, index) => (
                      <Badge 
                        key={index}
                        variant="outline" 
                        className="border-white/20 text-white/70 cursor-pointer hover:bg-white/10"
                        onClick={() => {
                          setNewAmenity(amenity);
                        }}
                      >
                        {amenity}
                      </Badge>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-6">
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Galeria de Imagens
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {court.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={image} 
                      alt={`Quadra ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
              <Button className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20" variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Adicionar Imagens (Em Desenvolvimento)
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerCourtSettings;
