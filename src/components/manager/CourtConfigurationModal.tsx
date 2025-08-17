import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Building, Clock, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DaySchedule {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface WeekSchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

interface CourtConfigurationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CourtConfigurationModal = ({ open, onOpenChange }: CourtConfigurationModalProps) => {
  const { toast } = useToast();
  
  const [courtInfo, setCourtInfo] = useState({
    name: 'Arena Cangaço',
    description: 'Quadra esportiva completa com excelente estrutura',
    isActive: true,
    unavailabilityReason: ''
  });
  
  const [schedule, setSchedule] = useState<WeekSchedule>({
    monday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
    tuesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
    wednesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
    thursday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
    friday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
    saturday: { isOpen: true, openTime: '07:00', closeTime: '20:00' },
    sunday: { isOpen: false, openTime: '07:00', closeTime: '20:00' }
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

  const updateDay = (day: keyof WeekSchedule, field: keyof DaySchedule, value: boolean | string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleCourtInfoChange = (field: string, value: string | boolean) => {
    setCourtInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    toast({
      title: "Configurações Salvas",
      description: "Informações da quadra e horários atualizados com sucesso"
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Configurar Quadra
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações da Quadra */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <Building className="w-5 h-5" />
                Informações da Quadra
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-800">Nome da Quadra</Label>
                <Input
                  value={courtInfo.name}
                  onChange={(e) => handleCourtInfoChange('name', e.target.value)}
                  className="bg-white border-gray-300 text-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-800">Descrição</Label>
                <Textarea
                  value={courtInfo.description}
                  onChange={(e) => handleCourtInfoChange('description', e.target.value)}
                  className="bg-white border-gray-300 text-gray-800"
                  placeholder="Descreva sua quadra..."
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <Label className="text-gray-800 font-semibold">Quadra Ativa</Label>
                  <p className="text-gray-600 text-sm">
                    {courtInfo.isActive ? 'Disponível para agendamentos' : 'Indisponível para agendamentos'}
                  </p>
                </div>
                <Switch 
                  checked={courtInfo.isActive} 
                  onCheckedChange={(checked) => handleCourtInfoChange('isActive', checked)}
                />
              </div>
              
              {!courtInfo.isActive && (
                <div className="space-y-2">
                  <Label className="text-gray-800">Motivo da Indisponibilidade</Label>
                  <Textarea
                    value={courtInfo.unavailabilityReason}
                    onChange={(e) => handleCourtInfoChange('unavailabilityReason', e.target.value)}
                    placeholder="Ex: Manutenção preventiva, reforma em andamento..."
                    className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Horários de Funcionamento */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Horários de Funcionamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(schedule).map(([day, config]) => (
                <div key={day} className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-800 font-semibold">
                      {dayNames[day as keyof typeof dayNames]}
                    </Label>
                    <Switch 
                      checked={config.isOpen} 
                      onCheckedChange={checked => updateDay(day as keyof WeekSchedule, 'isOpen', checked)} 
                    />
                  </div>
                  
                  {config.isOpen && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-gray-600 text-sm">Abertura</Label>
                        <Input 
                          type="time" 
                          value={config.openTime} 
                          onChange={e => updateDay(day as keyof WeekSchedule, 'openTime', e.target.value)} 
                          className="bg-white border-gray-300 text-gray-800" 
                        />
                      </div>
                      <div>
                        <Label className="text-gray-600 text-sm">Fechamento</Label>
                        <Input 
                          type="time" 
                          value={config.closeTime} 
                          onChange={e => updateDay(day as keyof WeekSchedule, 'closeTime', e.target.value)} 
                          className="bg-white border-gray-300 text-gray-800" 
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Botão de Salvar */}
          <Button 
            onClick={handleSave} 
            className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white py-3"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourtConfigurationModal;