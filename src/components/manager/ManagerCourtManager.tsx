import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  MapPin, 
  DollarSign, 
  Clock, 
  Users, 
  Settings,
  Save,
  Camera,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import CourtStatusCard from "./CourtStatusCard";
import CourtConfigurationModal from "./CourtConfigurationModal";

interface ManagerCourtManagerProps {
  managerId: string;
}

const ManagerCourtManager = ({ managerId }: ManagerCourtManagerProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [configModalOpen, setConfigModalOpen] = useState(false);

  const [courtInfo, setCourtInfo] = useState({
    name: 'Arena Central',
    location: 'Aldeota, Fortaleza - CE',
    description: 'Quadra de futebol society com grama sintética',
    capacity: 14,
    hourlyRate: 80,
    isActive: true
  });

  const [workingHours, setWorkingHours] = useState({
    monday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
    tuesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
    wednesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
    thursday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
    friday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
    saturday: { isOpen: true, openTime: '07:00', closeTime: '23:00' },
    sunday: { isOpen: true, openTime: '07:00', closeTime: '21:00' }
  });

  const dayNames = {
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };

  const handleCourtInfoChange = (field: string, value: any) => {
    setCourtInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWorkingHoursChange = (day: string, field: string, value: any) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSaveChanges = () => {
    toast({
      title: "Configurações Salvas",
      description: "As configurações da quadra foram atualizadas com sucesso"
    });
  };

  return (
    <div className="space-y-6">
      {/* Status da Quadra - PRIMEIRO LUGAR */}
      <CourtStatusCard 
        status="active"
        monthlyBookings={28}
        monthlyRevenue={2240}
        averageRating={4.8}
        totalReviews={47}
        onConfigureSettings={() => setConfigModalOpen(true)}
      />

      {/* Informações Gerais da Quadra */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5 text-[#F35410]" />
            Informações da Quadra
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-700">Nome da Quadra</Label>
              <Input
                value={courtInfo.name}
                onChange={(e) => handleCourtInfoChange('name', e.target.value)}
                className="bg-white border-gray-300"
              />
            </div>
            <div>
              <Label className="text-gray-700">Localização</Label>
              <Input
                value={courtInfo.location}
                onChange={(e) => handleCourtInfoChange('location', e.target.value)}
                className="bg-white border-gray-300"
              />
            </div>
          </div>

          <div>
            <Label className="text-gray-700">Descrição</Label>
            <Input
              value={courtInfo.description}
              onChange={(e) => handleCourtInfoChange('description', e.target.value)}
              className="bg-white border-gray-300"
              placeholder="Descreva sua quadra..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-gray-700">Capacidade</Label>
              <Input
                type="number"
                value={courtInfo.capacity}
                onChange={(e) => handleCourtInfoChange('capacity', parseInt(e.target.value))}
                className="bg-white border-gray-300"
              />
            </div>
            <div>
              <Label className="text-gray-700">Preço por Hora (R$)</Label>
              <Input
                type="number"
                value={courtInfo.hourlyRate}
                onChange={(e) => handleCourtInfoChange('hourlyRate', parseFloat(e.target.value))}
                className="bg-white border-gray-300"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <Switch
                checked={courtInfo.isActive}
                onCheckedChange={(checked) => handleCourtInfoChange('isActive', checked)}
              />
              <Label className="text-gray-700">Quadra Ativa</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Horários de Funcionamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#F35410]" />
            Horários de Funcionamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={isMobile ? "space-y-3" : "space-y-4"}>
            {Object.entries(workingHours).map(([day, hours]) => (
              <div key={day} className="border rounded-lg p-4 bg-gray-50/50">
                {/* Nome do dia e switch - sempre no topo */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-700">
                    {dayNames[day as keyof typeof dayNames]}
                  </span>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={hours.isOpen}
                      onCheckedChange={(checked) => handleWorkingHoursChange(day, 'isOpen', checked)}
                    />
                    <span className={`text-sm ${hours.isOpen ? 'text-green-600' : 'text-gray-500'}`}>
                      {hours.isOpen ? 'Aberto' : 'Fechado'}
                    </span>
                  </div>
                </div>

                {/* Horários quando aberto */}
                {hours.isOpen ? (
                  <div className={isMobile ? "grid grid-cols-2 gap-3" : "flex items-center gap-4"}>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600 block">Abertura</Label>
                      <Input
                        type="time"
                        value={hours.openTime}
                        onChange={(e) => handleWorkingHoursChange(day, 'openTime', e.target.value)}
                        className="w-full bg-white border-gray-300"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600 block">Fechamento</Label>
                      <Input
                        type="time"
                        value={hours.closeTime}
                        onChange={(e) => handleWorkingHoursChange(day, 'closeTime', e.target.value)}
                        className="w-full bg-white border-gray-300"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="pt-1">
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                      Fechado neste dia
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ações de Salvamento */}
      <Card>
        <CardContent className="pt-6">
          <Button 
            onClick={handleSaveChanges}
            className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>

      {/* Modal de Configuração */}
      <CourtConfigurationModal 
        open={configModalOpen}
        onOpenChange={setConfigModalOpen}
      />
    </div>
  );
};

export default ManagerCourtManager;
