
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Building, Save, Upload, Clock, DollarSign, AlertCircle } from "lucide-react";
import { useCourts } from "@/hooks/useCourts";
import { useToast } from "@/hooks/use-toast";

interface ManagerCourtManagerProps {
  managerId: string;
}

const ManagerCourtManager = ({ managerId }: ManagerCourtManagerProps) => {
  const { getCourtsByManager, updateCourtStatus, updateCourtPricing } = useCourts();
  const { toast } = useToast();
  
  const managerCourt = getCourtsByManager(managerId)[0]; // MVP: um gestor = uma quadra
  
  const [isActive, setIsActive] = useState(managerCourt?.status === 'active');
  const [inactiveReason, setInactiveReason] = useState(managerCourt?.unavailabilityReason || '');
  const [courtData, setCourtData] = useState({
    name: managerCourt?.name || '',
    description: managerCourt?.description || '',
    hourlyRate: managerCourt?.hourlyRate || 0,
    workingHours: managerCourt?.workingHours || {
      monday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      saturday: { isOpen: true, openTime: '07:00', closeTime: '20:00' },
      sunday: { isOpen: false, openTime: '07:00', closeTime: '20:00' }
    }
  });

  const handleStatusToggle = (checked: boolean) => {
    setIsActive(checked);
    if (managerCourt) {
      const status = checked ? 'active' : 'inactive';
      updateCourtStatus(managerCourt.id, status, checked ? undefined : inactiveReason);
      
      toast({
        title: checked ? "Quadra Ativada" : "Quadra Desativada",
        description: checked 
          ? "Sua quadra está novamente disponível para reservas"
          : "Sua quadra foi removida da listagem para clientes"
      });
    }
  };

  const handleSave = () => {
    if (managerCourt) {
      updateCourtPricing(managerCourt.id, courtData.hourlyRate);
      
      toast({
        title: "Dados Salvos",
        description: "As informações da quadra foram atualizadas com sucesso"
      });
    }
  };

  if (!managerCourt) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Building className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhuma Quadra Encontrada</h3>
          <p className="text-gray-600">Entre em contato com o administrador</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status da Quadra */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Status da Quadra
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{managerCourt.name}</h3>
              <p className="text-sm text-gray-600">
                {isActive ? 'Ativa e disponível para reservas' : 'Inativa - não aparece para clientes'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={isActive ? "default" : "secondary"} className={isActive ? "bg-green-600" : "bg-red-600"}>
                {isActive ? 'Ativa' : 'Inativa'}
              </Badge>
              <Switch checked={isActive} onCheckedChange={handleStatusToggle} />
            </div>
          </div>

          {!isActive && (
            <div className="space-y-2">
              <Label htmlFor="reason">Motivo da Inativação</Label>
              <Textarea
                id="reason"
                placeholder="Ex: Manutenção preventiva, reforma da quadra..."
                value={inactiveReason}
                onChange={(e) => setInactiveReason(e.target.value)}
                className="min-h-20"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Informações e Preços
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Quadra</Label>
            <Input
              id="name"
              value={courtData.name}
              onChange={(e) => setCourtData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nome da sua quadra"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={courtData.description}
              onChange={(e) => setCourtData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva sua quadra, comodidades, diferenciais..."
              className="min-h-20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Preço por Hora (R$)</Label>
            <Input
              id="price"
              type="number"
              value={courtData.hourlyRate}
              onChange={(e) => setCourtData(prev => ({ ...prev, hourlyRate: Number(e.target.value) }))}
              placeholder="120"
            />
          </div>

          <Button onClick={handleSave} className="w-full bg-[#F35410] hover:bg-[#BA2D0B]">
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </CardContent>
      </Card>

      {/* Upload de Imagens */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Imagens da Quadra
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {managerCourt.images.map((image, index) => (
              <div key={index} className="relative">
                <img 
                  src={image} 
                  alt={`Quadra ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            Adicionar Novas Fotos
          </Button>
        </CardContent>
      </Card>

      {/* Horários de Funcionamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Horários de Funcionamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(courtData.workingHours).map(([day, schedule]) => {
              const dayNames = {
                monday: 'Segunda-feira',
                tuesday: 'Terça-feira', 
                wednesday: 'Quarta-feira',
                thursday: 'Quinta-feira',
                friday: 'Sexta-feira',
                saturday: 'Sábado',
                sunday: 'Domingo'
              };

              return (
                <div key={day} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{dayNames[day as keyof typeof dayNames]}</span>
                  <div className="flex items-center gap-3">
                    {schedule.isOpen ? (
                      <span className="text-sm text-gray-600">
                        {schedule.openTime} às {schedule.closeTime}
                      </span>
                    ) : (
                      <span className="text-sm text-red-600">Fechado</span>
                    )}
                    <Switch 
                      checked={schedule.isOpen}
                      onCheckedChange={(checked) => {
                        setCourtData(prev => ({
                          ...prev,
                          workingHours: {
                            ...prev.workingHours,
                            [day]: { ...schedule, isOpen: checked }
                          }
                        }));
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {!isActive && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Quadra Inativa</p>
                <p className="text-sm text-yellow-700">
                  Sua quadra não está aparecendo para os clientes. Ative novamente quando estiver disponível.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ManagerCourtManager;
