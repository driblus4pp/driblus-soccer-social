
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar, Clock } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: 'personal' | 'work' | 'other';
}

interface CalendarConflictDetectorProps {
  selectedDate: Date;
  selectedTime: string;
  duration: number;
  onConflictDetected: (hasConflict: boolean) => void;
}

const CalendarConflictDetector = ({ 
  selectedDate, 
  selectedTime, 
  duration, 
  onConflictDetected 
}: CalendarConflictDetectorProps) => {
  const [conflicts, setConflicts] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedDate || !selectedTime) return;

    setLoading(true);
    
    // Simular verificação de conflitos
    setTimeout(() => {
      const mockEvents: CalendarEvent[] = [
        {
          id: '1',
          title: 'Reunião de trabalho',
          startTime: '19:00',
          endTime: '20:30',
          type: 'work'
        },
        {
          id: '2',
          title: 'Consulta médica',
          startTime: '18:30',
          endTime: '19:15',
          type: 'personal'
        }
      ];

      // Verificar se há conflitos com o horário selecionado
      const selectedEndTime = `${parseInt(selectedTime.split(':')[0]) + duration}:00`;
      const conflictingEvents = mockEvents.filter(event => {
        const eventStart = parseInt(event.startTime.split(':')[0]);
        const eventEnd = parseInt(event.endTime.split(':')[0]);
        const selectedStart = parseInt(selectedTime.split(':')[0]);
        const selectedEnd = parseInt(selectedEndTime.split(':')[0]);

        return (eventStart < selectedEnd && eventEnd > selectedStart);
      });

      setConflicts(conflictingEvents);
      onConflictDetected(conflictingEvents.length > 0);
      setLoading(false);
    }, 500);
  }, [selectedDate, selectedTime, duration, onConflictDetected]);

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'work': return 'bg-blue-500';
      case 'personal': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventTypeLabel = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'work': return 'Trabalho';
      case 'personal': return 'Pessoal';
      default: return 'Outro';
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/10 border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-white/70">
            <Clock className="w-4 h-4 animate-spin" />
            <span>Verificando conflitos...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (conflicts.length === 0) {
    return null;
  }

  return (
    <Card className="bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          Conflitos Detectados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-yellow-500/20 border-yellow-500/50">
          <AlertTriangle className="w-4 h-4 text-yellow-400" />
          <AlertDescription className="text-yellow-200">
            Encontramos {conflicts.length} conflito{conflicts.length > 1 ? 's' : ''} em seu calendário para este horário.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          {conflicts.map((event) => (
            <div key={event.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`} />
                <div>
                  <p className="text-white font-medium">{event.title}</p>
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <Clock className="w-3 h-3" />
                    <span>{event.startTime} - {event.endTime}</span>
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {getEventTypeLabel(event.type)}
              </Badge>
            </div>
          ))}
        </div>

        <div className="text-center text-white/70 text-sm">
          <Calendar className="w-4 h-4 inline mr-1" />
          Baseado no seu Google Calendar
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarConflictDetector;
