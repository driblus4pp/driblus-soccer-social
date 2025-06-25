
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Save, MapPin, DollarSign, Clock, Image, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ManagerCourtSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [courtData, setCourtData] = useState({
    name: 'No Alvo Society',
    address: 'Rua das Palmeiras, 123',
    city: 'Fortaleza',
    state: 'CE',
    zipCode: '60000-000',
    hourlyRate: '120',
    weekendRate: '140',
    nightRate: '160',
    status: 'active',
    autoApproval: true,
    cancellationPolicy: '24h',
    description: 'Quadra de society com gramado sintético e iluminação completa'
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setCourtData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    toast({
      title: "Configurações Salvas",
      description: "Configurações da quadra atualizadas com sucesso"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#F35410] to-[#BA2D0B] p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/gestor/perfil')} 
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-white">Configurações da Quadra</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Informações Básicas */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-700">Nome da Quadra</Label>
              <Input
                value={courtData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-white border-gray-300 text-gray-800"
                placeholder="Nome da sua quadra"
              />
            </div>
            <div>
              <Label className="text-gray-700">Endereço</Label>
              <Input
                value={courtData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="bg-white border-gray-300 text-gray-800"
                placeholder="Endereço completo"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-700">Cidade</Label>
                <Input
                  value={courtData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="bg-white border-gray-300 text-gray-800"
                  placeholder="Cidade"
                />
              </div>
              <div>
                <Label className="text-gray-700">Estado</Label>
                <Input
                  value={courtData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="bg-white border-gray-300 text-gray-800"
                  placeholder="Estado"
                />
              </div>
            </div>
            <div>
              <Label className="text-gray-700">Descrição</Label>
              <Input
                value={courtData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="bg-white border-gray-300 text-gray-800"
                placeholder="Descreva sua quadra"
              />
            </div>
          </CardContent>
        </Card>

        {/* Preços */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Preços por Hora
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-700">Preço Normal (R$)</Label>
              <Input
                type="number"
                value={courtData.hourlyRate}
                onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                className="bg-white border-gray-300 text-gray-800"
                placeholder="120"
              />
            </div>
            <div>
              <Label className="text-gray-700">Preço Final de Semana (R$)</Label>
              <Input
                type="number"
                value={courtData.weekendRate}
                onChange={(e) => handleInputChange('weekendRate', e.target.value)}
                className="bg-white border-gray-300 text-gray-800"
                placeholder="140"
              />
            </div>
            <div>
              <Label className="text-gray-700">Preço Noturno (R$)</Label>
              <Input
                type="number"
                value={courtData.nightRate}
                onChange={(e) => handleInputChange('nightRate', e.target.value)}
                className="bg-white border-gray-300 text-gray-800"
                placeholder="160"
              />
            </div>
          </CardContent>
        </Card>

        {/* Status e Políticas */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Status e Políticas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-700">Quadra Ativa</Label>
                <p className="text-sm text-gray-500">Quadra disponível para reservas</p>
              </div>
              <Switch 
                checked={courtData.status === 'active'} 
                onCheckedChange={(checked) => handleInputChange('status', checked ? 'active' : 'inactive')} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-700">Aprovação Automática</Label>
                <p className="text-sm text-gray-500">Reservas são aprovadas automaticamente</p>
              </div>
              <Switch 
                checked={courtData.autoApproval} 
                onCheckedChange={(checked) => handleInputChange('autoApproval', checked)} 
              />
            </div>

            <div>
              <Label className="text-gray-700">Política de Cancelamento</Label>
              <RadioGroup 
                value={courtData.cancellationPolicy} 
                onValueChange={(value) => handleInputChange('cancellationPolicy', value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="24h" id="24h" />
                  <Label htmlFor="24h" className="text-gray-600">24 horas antes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="12h" id="12h" />
                  <Label htmlFor="12h" className="text-gray-600">12 horas antes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2h" id="2h" />
                  <Label htmlFor="2h" className="text-gray-600">2 horas antes</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Fotos */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <Image className="w-5 h-5" />
              Fotos da Quadra
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <Image className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">Adicionar Foto</p>
                </div>
              </div>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <Image className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">Adicionar Foto</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={handleSave} 
          className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white py-3"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};

export default ManagerCourtSettings;
