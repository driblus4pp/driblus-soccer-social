
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink, CheckCircle, AlertCircle } from "lucide-react";
import { googleCalendarService } from '@/services/googleCalendarService';

interface GoogleCalendarIntegrationProps {
  userType: 'client' | 'manager';
  onConnectionChange?: (connected: boolean) => void;
}

const GoogleCalendarIntegration = ({ userType, onConnectionChange }: GoogleCalendarIntegrationProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(googleCalendarService.isAuthenticated());

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const success = await googleCalendarService.authenticate();
      setConnectionStatus(success);
      onConnectionChange?.(success);
      
      if (success) {
        console.log('Google Calendar conectado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao conectar com Google Calendar:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    googleCalendarService.signOut();
    setConnectionStatus(false);
    onConnectionChange?.(false);
  };

  return (
    <Card className="bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Google Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {connectionStatus ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-400" />
            )}
            <div>
              <p className="text-white font-medium">
                {connectionStatus ? 'Conectado' : 'Não conectado'}
              </p>
              <p className="text-white/70 text-sm">
                {connectionStatus 
                  ? 'Seus agendamentos são sincronizados automaticamente'
                  : 'Conecte para sincronizar horários automaticamente'
                }
              </p>
            </div>
          </div>
          <Badge 
            variant={connectionStatus ? "default" : "secondary"}
            className={connectionStatus ? "bg-green-600" : "bg-yellow-600"}
          >
            {connectionStatus ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>

        <div className="space-y-2">
          {!connectionStatus ? (
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white"
            >
              {isConnecting ? (
                "Conectando..."
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Conectar Google Calendar
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={handleDisconnect}
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                Desconectar
              </Button>
              <p className="text-white/60 text-xs text-center">
                {userType === 'manager' 
                  ? 'Novos agendamentos aparecerão no seu calendário'
                  : 'Suas reservas aparecerão no seu calendário'
                }
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleCalendarIntegration;
