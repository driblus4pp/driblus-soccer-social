
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, AlertCircle } from "lucide-react";

interface TimeSlotCardProps {
  selectedTime: string;
  onTimeChange: (time: string) => void;
  availableSlots: string[];
  error?: string;
}

const TimeSlotCard = ({ selectedTime, onTimeChange, availableSlots, error }: TimeSlotCardProps) => {
  return (
    <Card className="bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Horários Disponíveis
          <span className="text-red-400">*</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {availableSlots.length === 0 ? (
          <p className="text-white/70 text-center py-4">
            Nenhum horário disponível para esta data. Tente outra data.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {availableSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                className={`${
                  selectedTime === time 
                    ? "bg-[#F35410] hover:bg-[#BA2D0B] text-white border-[#F35410]" 
                    : "border-white/20 text-white hover:bg-white/20 hover:text-slate-900 bg-transparent"
                }`}
                onClick={() => onTimeChange(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimeSlotCard;
