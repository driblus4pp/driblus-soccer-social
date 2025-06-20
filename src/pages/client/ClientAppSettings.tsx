
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Bell, Moon, MapPin, Shield, Globe } from "lucide-react";
import BottomNavigation from "@/components/navigation/BottomNavigation";

const ClientAppSettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    locationServices: true,
    darkMode: false,
    showProfile: true,
    allowReviews: true,
    autoSync: true
  });

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-[#093758] pb-20">
      {/* Header */}
      <div className="px-4 py-6 bg-[#093758]">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/cliente/perfil')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-white">Configurações do App</h1>
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Notificações */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Notificações Push</p>
                <p className="text-white/70 text-sm">Receba alertas no dispositivo</p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(value) => updateSetting('pushNotifications', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Notificações por Email</p>
                <p className="text-white/70 text-sm">Receba emails sobre agendamentos</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(value) => updateSetting('emailNotifications', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">SMS</p>
                <p className="text-white/70 text-sm">Receba SMS para confirmações</p>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(value) => updateSetting('smsNotifications', value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Localização */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Localização
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Serviços de Localização</p>
                <p className="text-white/70 text-sm">Encontre quadras próximas</p>
              </div>
              <Switch
                checked={settings.locationServices}
                onCheckedChange={(value) => updateSetting('locationServices', value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Aparência */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Moon className="w-5 h-5" />
              Aparência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Modo Escuro</p>
                <p className="text-white/70 text-sm">Tema escuro do aplicativo</p>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={(value) => updateSetting('darkMode', value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacidade */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privacidade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Perfil Público</p>
                <p className="text-white/70 text-sm">Outros usuários podem ver seu perfil</p>
              </div>
              <Switch
                checked={settings.showProfile}
                onCheckedChange={(value) => updateSetting('showProfile', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Permitir Avaliações</p>
                <p className="text-white/70 text-sm">Outros podem avaliar seus jogos</p>
              </div>
              <Switch
                checked={settings.allowReviews}
                onCheckedChange={(value) => updateSetting('allowReviews', value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Sincronização */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Sincronização
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Sincronização Automática</p>
                <p className="text-white/70 text-sm">Sincronizar dados automaticamente</p>
              </div>
              <Switch
                checked={settings.autoSync}
                onCheckedChange={(value) => updateSetting('autoSync', value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation userType="client" />
    </div>
  );
};

export default ClientAppSettings;
