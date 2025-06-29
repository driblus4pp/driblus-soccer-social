
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BookingStepOneProps {
  court: any;
  onNext: (data: any) => void;
  initialData?: any;
}

const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

const BookingStepOne = ({ court, onNext, initialData }: BookingStepOneProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialData?.selectedDate);
  const [selectedTime, setSelectedTime] = useState<string>(initialData?.selectedTime || '');

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) {
      alert('Por favor, selecione uma data e horário');
      return;
    }

    onNext({
      selectedDate,
      selectedTime,
      formattedDateTime: format(selectedDate, "dd 'de' MMMM", { locale: ptBR }) + ` • ${selectedTime}`
    });
  };

  const isDateDisabled = (date: Date) => {
    return date < new Date() || date.getDay() === 0; // Disable past dates and Sundays
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Selecione Data e Horário</h2>
        <p className="text-white/70">Escolha quando deseja jogar</p>
      </div>

      {/* Court Info */}
      <Card className="bg-white/10 border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <img 
              src={court.image} 
              alt={court.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="text-white font-semibold">{court.name}</h3>
              <div className="flex items-center gap-1 text-white/70 text-sm">
                <MapPin className="w-3 h-3" />
                <span>{court.location}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  ⭐ {court.rating}
                </Badge>
                <span className="text-[#F35410] font-bold">{court.price}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Selecione a Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={isDateDisabled}
            locale={ptBR}
            classNames={{
              day_selected: "bg-[#F35410] text-white hover:bg-[#F35410] hover:text-white focus:bg-[#F35410] focus:text-white",
              day_today: "bg-white/20 text-white hover:bg-white/30",
              day: "text-white hover:bg-white/10",
              head_cell: "text-white/70 font-medium",
              caption_label: "text-white font-semibold",
              nav_button: "text-white hover:bg-white/10 border-white/20"
            }}
            className="rounded-md border border-white/20 bg-white/5"
          />
        </CardContent>
      </Card>

      {/* Time Slots */}
      {selectedDate && (
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Horários Disponíveis - {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  onClick={() => setSelectedTime(time)}
                  className={`${
                    selectedTime === time
                      ? "bg-[#F35410] hover:bg-[#BA2D0B] text-white border-[#F35410]"
                      : "border-white/20 text-white hover:bg-white/10 bg-transparent"
                  }`}
                >
                  {time}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Continue Button */}
      <Button
        onClick={handleContinue}
        disabled={!selectedDate || !selectedTime}
        className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white font-semibold py-3 disabled:opacity-50"
      >
        Continuar
      </Button>
    </div>
  );
};

export default BookingStepOne;
