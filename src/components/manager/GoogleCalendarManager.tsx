import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Settings, RefreshCw, ExternalLink, CheckCircle, Clock } from "lucide-react";
import GoogleCalendarIntegration from '../GoogleCalendarIntegration';
interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  courtName: string;
  clientName: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}
const GoogleCalendarManager = () => {
  const [syncedEvents, setSyncedEvents] = useState<CalendarEvent[]>([{
    id: '1',
    title: 'Reserva - João Silva',
    date: '2024-12-27',
    time: '19:00',
    courtName: 'Quadra 1',
    clientName: 'João Silva',
    status: 'confirmed'
  }, {
    id: '2',
    title: 'Reserva - Maria Santos',
    date: '2024-12-27',
    time: '20:00',
    courtName: 'Quadra 2',
    clientName: 'Maria Santos',
    status: 'pending'
  }]);
  const [isManualSyncing, setIsManualSyncing] = useState(false);
  const handleManualSync = async () => {
    setIsManualSyncing(true);
    // Simular sincronização
    setTimeout(() => {
      setIsManualSyncing(false);
    }, 2000);
  };
  const getStatusColor = (status: CalendarEvent['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  const getStatusLabel = (status: CalendarEvent['status']) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };
  return <div className="space-y-6 bg-slate-50">
      {/* Google Calendar Integration */}
      <GoogleCalendarIntegration userType="manager" />

      {/* Sync Controls */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader className="bg-sky-950 rounded-xl">
          <CardTitle className="flex items-center gap-2 text-slate-50">
            <RefreshCw className="w-5 h-5" />
            Sincronização
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Sincronização Automática</p>
              <p className="text-sm text-slate-600">
                Novos agendamentos são automaticamente adicionados ao seu calendário
              </p>
            </div>
            <Badge className="bg-green-600 text-white">
              <CheckCircle className="w-3 h-3 mr-1" />
              Ativa
            </Badge>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleManualSync} disabled={isManualSyncing} variant="outline" className="border-white/20 text-slate-950 bg-orange-700 hover:bg-orange-600">
              {isManualSyncing ? <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Sincronizando...
                </> : <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sincronizar Agora
                </>}
            </Button>

            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Synced Events */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader className="rounded-xl bg-gray-500">
          <CardTitle className="flex items-center gap-2 text-slate-50">
            <Calendar className="w-5 h-5" />
            Eventos Sincronizados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 bg-slate-50">
          {syncedEvents.map(event => <div key={event.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(event.status)}`} />
                <div>
                  <p className="font-medium text-zinc-950">{event.title}</p>
                  <p className="text-sm text-gray-950">
                    {event.courtName} • {event.date} às {event.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {getStatusLabel(event.status)}
                </Badge>
                <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>)}
        </CardContent>
      </Card>
    </div>;
};
export default GoogleCalendarManager;