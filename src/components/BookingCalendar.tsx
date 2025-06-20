import { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, Users } from 'lucide-react';
import { format, isSameDay, addDays, isAfter, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TimeSlot {
  time: string;
  available: boolean;
  price: number;
}
interface BookingCalendarProps {
  court: any;
  onDateTimeSelect: (date: Date, time: string) => void;
  selectedDate?: Date;
  selectedTime?: string;
}
const BookingCalendar = ({
  court,
  onDateTimeSelect,
  selectedDate,
  selectedTime
}: BookingCalendarProps) => {
  const [date, setDate] = useState<Date | undefined>(selectedDate);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  // Simulated available time slots - in real app this would come from Google Calendar API
  const generateTimeSlots = (selectedDate: Date): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const basePrice = parseInt(court.price.replace('R$ ', '').replace('/hora', ''));

    // Generate slots from 7:00 to 22:00
    for (let hour = 7; hour <= 22; hour++) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;

      // Simulate some slots being unavailable
      const isAvailable = Math.random() > 0.3; // 70% chance of being available

      slots.push({
        time: timeString,
        available: isAvailable,
        price: basePrice
      });
    }
    return slots;
  };
  const fetchAvailability = async (selectedDate: Date) => {
    setLoading(true);
    try {
      // Simulate API call to Google Calendar
      await new Promise(resolve => setTimeout(resolve, 1000));
      const slots = generateTimeSlots(selectedDate);
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (date) {
      fetchAvailability(date);
    }
  }, [date]);
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };
  const handleTimeSelect = (time: string) => {
    if (date) {
      onDateTimeSelect(date, time);
    }
  };
  const isDateDisabled = (date: Date) => {
    // Disable past dates
    return isBefore(date, new Date());
  };
  return (
    <div className="space-y-6">
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
            selected={date} 
            onSelect={handleDateSelect} 
            disabled={isDateDisabled} 
            locale={ptBR} 
            classNames={{
              day_selected: "bg-[#F35410] text-white hover:bg-[#F35410] hover:text-white focus:bg-[#F35410] focus:text-white",
              day_today: "bg-white/20 text-white hover:bg-white/30 hover:text-slate-900",
              day: "text-white hover:bg-white/20 hover:text-slate-900",
              head_cell: "text-white/70",
              caption_label: "text-white",
              nav_button: "text-white hover:bg-white/20 hover:text-slate-900 border-white/20"
            }} 
            className="rounded-md border border-white/20 bg-white/5 text-white px-0" 
          />
        </CardContent>
      </Card>

      {date && (
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Horários Disponíveis - {format(date, "dd 'de' MMMM", { locale: ptBR })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    variant={selectedTime === slot.time ? "default" : "outline"}
                    disabled={!slot.available}
                    onClick={() => handleTimeSelect(slot.time)}
                    className={`p-4 h-auto flex-col ${
                      selectedTime === slot.time
                        ? "bg-[#F35410] text-white border-[#F35410] hover:bg-[#BA2D0B]"
                        : slot.available
                        ? "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-slate-900"
                        : "bg-white/5 border-white/10 text-white/40 cursor-not-allowed"
                    }`}
                  >
                    <span className="font-semibold text-lg">{slot.time}</span>
                    <span className="text-sm">
                      {slot.available ? `R$ ${slot.price}` : "Indisponível"}
                    </span>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {date && selectedTime && (
        <Card className="bg-gradient-to-r from-[#F35410] to-[#BA2D0B] border-none">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="font-semibold">Agendamento Selecionado</p>
                <p className="text-sm">
                  {format(date, "dd 'de' MMMM", {
                locale: ptBR
              })} às {selectedTime}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{court.price}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookingCalendar;
