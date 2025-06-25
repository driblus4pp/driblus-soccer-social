
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Save, Bell, Clock, CreditCard, Globe, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ManagerPreferences = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      newBookings: true,
      cancellations: true,
      payments: true,
      reminders: true
    },
    booking: {
      autoApproval: false,
      confirmationTimeout: '2h',
      advanceBooking: '30d'
    },
    payment: {
      instantPayment: true,
      paymentDeadline: '24h'
    },
    system: {
      language: 'pt-BR',
      timezone: 'America/Fortaleza',
      theme: 'light'
    }
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const handleBookingChange = (key: string, value: string) => {
    setPreferences(prev => ({
      ...prev,
      booking: {
        ...prev.booking,
        [key]: value
      }
    }));
  };

  const handlePaymentChange = (key: string, value: boolean | string) => {
    setPreferences(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        [key]: value
      }
    }));
  };

  const handleSystemChange = (key: string, value: string) => {
    setPreferences(prev => ({
      ...prev,
      system: {
        ...prev.system,
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    toast({
      title: "Preferências Salvas",
      description: "Suas preferências foram atualizadas com sucesso"
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
          <h1 className="text-xl font-bold text-white">Preferências</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Notificações */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-700">Notificações por Email</Label>
                <p className="text-sm text-gray-500">Receber notificações no email</p>
              </div>
              <Switch 
                checked={preferences.notifications.email} 
                onCheckedChange={(checked) => handleNotificationChange('email', checked)} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-700">Notificações Push</Label>
                <p className="text-sm text-gray-500">Receber notificações no navegador</p>
              </div>
              <Switch 
                checked={preferences.notifications.push} 
                onCheckedChange={(checked) => handleNotificationChange('push', checked)} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-700">Notificações por SMS</Label>
                <p className="text-sm text-gray-500">Receber notificações por mensagem</p>
              </div>
              <Switch 
                checked={preferences.notifications.sms} 
                onCheckedChange={(checked) => handleNotificationChange('sms', checked)} 
              />
            </div>

            <div className="border-t pt-4">
              <h4 className="text-gray-700 font-medium mb-3">Tipos de Notificação</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-600">Novas Reservas</Label>
                  <Switch 
                    checked={preferences.notifications.newBookings} 
                    onCheckedChange={(checked) => handleNotificationChange('newBookings', checked)} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-gray-600">Cancelamentos</Label>
                  <Switch 
                    checked={preferences.notifications.cancellations} 
                    onCheckedChange={(checked) => handleNotificationChange('cancellations', checked)} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-gray-600">Pagamentos</Label>
                  <Switch 
                    checked={preferences.notifications.payments} 
                    onCheckedChange={(checked) => handleNotificationChange('payments', checked)} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-gray-600">Lembretes</Label>
                  <Switch 
                    checked={preferences.notifications.reminders} 
                    onCheckedChange={(checked) => handleNotificationChange('reminders', checked)} 
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Reserva */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Configurações de Reserva
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-700">Aprovação Automática</Label>
                <p className="text-sm text-gray-500">Aprovar reservas automaticamente</p>
              </div>
              <Switch 
                checked={preferences.booking.autoApproval} 
                onCheckedChange={(checked) => handleBookingChange('autoApproval', checked)} 
              />
            </div>

            <div>
              <Label className="text-gray-700">Tempo para Confirmação</Label>
              <RadioGroup 
                value={preferences.booking.confirmationTimeout} 
                onValueChange={(value) => handleBookingChange('confirmationTimeout', value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="30m" id="30m" />
                  <Label htmlFor="30m" className="text-gray-600">30 minutos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1h" id="1h" />
                  <Label htmlFor="1h" className="text-gray-600">1 hora</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2h" id="2h" />
                  <Label htmlFor="2h" className="text-gray-600">2 horas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="24h" id="24h" />
                  <Label htmlFor="24h" className="text-gray-600">24 horas</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-gray-700">Antecedência Máxima</Label>
              <RadioGroup 
                value={preferences.booking.advanceBooking} 
                onValueChange={(value) => handleBookingChange('advanceBooking', value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="7d" id="7d" />
                  <Label htmlFor="7d" className="text-gray-600">7 dias</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="15d" id="15d" />
                  <Label htmlFor="15d" className="text-gray-600">15 dias</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="30d" id="30d" />
                  <Label htmlFor="30d" className="text-gray-600">30 dias</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="60d" id="60d" />
                  <Label htmlFor="60d" className="text-gray-600">60 dias</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Pagamento */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Configurações de Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-700">Pagamento Instantâneo</Label>
                <p className="text-sm text-gray-500">Exigir pagamento na reserva</p>
              </div>
              <Switch 
                checked={preferences.payment.instantPayment} 
                onCheckedChange={(checked) => handlePaymentChange('instantPayment', checked)} 
              />
            </div>

            <div>
              <Label className="text-gray-700">Prazo para Pagamento</Label>
              <RadioGroup 
                value={preferences.payment.paymentDeadline} 
                onValueChange={(value) => handlePaymentChange('paymentDeadline', value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1h" id="pay-1h" />
                  <Label htmlFor="pay-1h" className="text-gray-600">1 hora</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="6h" id="pay-6h" />
                  <Label htmlFor="pay-6h" className="text-gray-600">6 horas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="24h" id="pay-24h" />
                  <Label htmlFor="pay-24h" className="text-gray-600">24 horas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="48h" id="pay-48h" />
                  <Label htmlFor="pay-48h" className="text-gray-600">48 horas</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Configurações do Sistema */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Configurações do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-700">Idioma</Label>
              <RadioGroup 
                value={preferences.system.language} 
                onValueChange={(value) => handleSystemChange('language', value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pt-BR" id="pt-BR" />
                  <Label htmlFor="pt-BR" className="text-gray-600">Português (Brasil)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="en-US" id="en-US" />
                  <Label htmlFor="en-US" className="text-gray-600">English (US)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="es-ES" id="es-ES" />
                  <Label htmlFor="es-ES" className="text-gray-600">Español</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-gray-700">Fuso Horário</Label>
              <RadioGroup 
                value={preferences.system.timezone} 
                onValueChange={(value) => handleSystemChange('timezone', value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="America/Fortaleza" id="fortaleza" />
                  <Label htmlFor="fortaleza" className="text-gray-600">Fortaleza (GMT-3)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="America/Sao_Paulo" id="sao-paulo" />
                  <Label htmlFor="sao-paulo" className="text-gray-600">São Paulo (GMT-3)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="America/Manaus" id="manaus" />
                  <Label htmlFor="manaus" className="text-gray-600">Manaus (GMT-4)</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-gray-700">Tema</Label>
              <RadioGroup 
                value={preferences.system.theme} 
                onValueChange={(value) => handleSystemChange('theme', value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light" className="text-gray-600">Claro</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark" className="text-gray-600">Escuro</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="auto" id="auto" />
                  <Label htmlFor="auto" className="text-gray-600">Automático</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={handleSave} 
          className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white py-3"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar Preferências
        </Button>
      </div>
    </div>
  );
};

export default ManagerPreferences;
