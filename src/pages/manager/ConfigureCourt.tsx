import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Clock, Save } from "lucide-react";
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
const ConfigureCourt = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [schedule, setSchedule] = useState<WeekSchedule>({
    monday: {
      isOpen: true,
      openTime: '06:00',
      closeTime: '22:00'
    },
    tuesday: {
      isOpen: true,
      openTime: '06:00',
      closeTime: '22:00'
    },
    wednesday: {
      isOpen: true,
      openTime: '06:00',
      closeTime: '22:00'
    },
    thursday: {
      isOpen: true,
      openTime: '06:00',
      closeTime: '22:00'
    },
    friday: {
      isOpen: true,
      openTime: '06:00',
      closeTime: '22:00'
    },
    saturday: {
      isOpen: true,
      openTime: '07:00',
      closeTime: '20:00'
    },
    sunday: {
      isOpen: false,
      openTime: '07:00',
      closeTime: '20:00'
    }
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
  const handleSave = () => {
    // TODO: Save to backend
    toast({
      title: "Configurações Salvas",
      description: "Horários de funcionamento atualizados com sucesso"
    });
  };
  return <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B]">
      {/* Header */}
      <div className="backdrop-blur-md border-b border-white/20 p-4 bg-orange-700">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/gestor/dashboard')} className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-white">Configurar Horários</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Horários de Funcionamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(schedule).map(([day, config]) => <div key={day} className="space-y-3 p-4 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label className="text-white font-semibold">
                    {dayNames[day as keyof typeof dayNames]}
                  </Label>
                  <Switch checked={config.isOpen} onCheckedChange={checked => updateDay(day as keyof WeekSchedule, 'isOpen', checked)} />
                </div>
                
                {config.isOpen && <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-white/70 text-sm">Abertura</Label>
                      <Input type="time" value={config.openTime} onChange={e => updateDay(day as keyof WeekSchedule, 'openTime', e.target.value)} className="bg-white/10 border-white/20 text-white" />
                    </div>
                    <div>
                      <Label className="text-white/70 text-sm">Fechamento</Label>
                      <Input type="time" value={config.closeTime} onChange={e => updateDay(day as keyof WeekSchedule, 'closeTime', e.target.value)} className="bg-white/10 border-white/20 text-white" />
                    </div>
                  </div>}
              </div>)}
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white py-3">
          <Save className="w-4 h-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>
    </div>;
};
export default ConfigureCourt;