
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, AlertTriangle } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TimeSlot {
  time: string;
  available: boolean;
  price: number;
  occupancy: number;
  maxOccupancy: number;
  conflictReason?: string;
}

interface AdvancedTimeSlotSelectorProps {
  date: Date;
  courtId: string;
  onTimeSelect: (time: string) => void;
  selectedTime?: string;
}

const AdvancedTimeSlotSelector = ({ 
  date, 
  courtId, 
  onTimeSelect, 
  selectedTime 
}: AdvancedTimeSlotSelectorProps) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);

  // Simular dados de horários com diferentes estados
  useEffect(() => {
    const generateTimeSlots = () => {
      const slots: TimeSlot[] = [];
      for (let hour = 6; hour <= 22; hour++) {
        const time = `${hour.toString().padStart(2, '0')}:00`;
        const isAvailable = Math.random() > 0.3; // 70% dos horários disponíveis
        const occupancy = Math.floor(Math.random() * 20);
        const maxOccupancy = 20;
        
        slots.push({
          time,
          available: isAvailable,
          price: hour >= 18 ? 150 : 120, // Preço mais alto no horário nobre
          occupancy,
          maxOccupancy,
          conflictReason: !isAvailable ? 'Já reservado' : undefined
        });
      }
      return slots;
    };

    setLoading(true);
    // Simular carregamento
    setTimeout(() => {
      setTimeSlots(generateTimeSlots());
      setLoading(false);
    }, 1000);
  }, [date, courtId]);

  const getSlotColor = (slot: TimeSlot) => {
    if (!slot.available) return 'bg-red-500/20 border-red-500/50 text-red-300';
    if (slot.occupancy / slot.maxOccupancy > 0.8) return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300';
    return 'bg-green-500/20 border-green-500/50 text-green-300';
  };

  const getSlotStatus = (slot: TimeSlot) => {
    if (!slot.available) return 'Indisponível';
    if (slot.occupancy / slot.maxOccupancy > 0.8) return 'Quase lotado';
    return 'Disponível';
  };

  if (loading) {
    return (
      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Carregando horários...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Horários para {format(date, "dd 'de' MMMM", { locale: ptBR })}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500/50 rounded-full" />
            <span className="text-white/70">Disponível</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500/50 rounded-full" />
            <span className="text-white/70">Quase lotado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500/50 rounded-full" />
            <span className="text-white/70">Indisponível</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {timeSlots.map((slot) => (
            <Button
              key={slot.time}
              variant="outline"
              disabled={!slot.available}
              onClick={() => onTimeSelect(slot.time)}
              className={`
                h-auto p-3 flex flex-col items-start gap-1 border-2 transition-all
                ${selectedTime === slot.time 
                  ? 'bg-[#F35410] border-[#F35410] text-white' 
                  : getSlotColor(slot)
                }
                ${!slot.available ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
              `}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-lg">{slot.time}</span>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${
                    selectedTime === slot.time ? 'bg-white/20 text-white' : ''
                  }`}
                >
                  R$ {slot.price}
                </Badge>
              </div>
              
              <div className="flex items-center gap-1 text-xs opacity-90">
                <Users className="w-3 h-3" />
                <span>{slot.occupancy}/{slot.maxOccupancy}</span>
              </div>
              
              <span className="text-xs opacity-75">
                {getSlotStatus(slot)}
              </span>

              {slot.conflictReason && (
                <div className="flex items-center gap-1 text-xs text-red-300">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{slot.conflictReason}</span>
                </div>
              )}
            </Button>
          ))}
        </div>

        {timeSlots.filter(slot => slot.available).length === 0 && (
          <div className="text-center py-6">
            <AlertTriangle className="w-12 h-12 mx-auto text-yellow-400 mb-2" />
            <p className="text-white font-medium">Nenhum horário disponível</p>
            <p className="text-white/70 text-sm">Tente selecionar outra data</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedTimeSlotSelector;
