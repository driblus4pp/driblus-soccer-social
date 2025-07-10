import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useBookings } from "@/hooks/useBookings";
import { useCourts } from "@/hooks/useCourts";
import { useUsers } from "@/hooks/useUsers";
import DateSelectionCard from "@/components/booking/DateSelectionCard";
import TimeSlotCard from "@/components/booking/TimeSlotCard";
import PeopleSelectionCard from "@/components/booking/PeopleSelectionCard";
import HoursSelectionCard from "@/components/booking/HoursSelectionCard";
import UserDataCard from "@/components/booking/UserDataCard";
import BookingSummaryCard from "@/components/booking/BookingSummaryCard";

const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isTimeSlotAvailable } = useBookings();
  const { getCourtById } = useCourts();
  const { getCurrentUser } = useUsers();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState('');
  const [selectedHours, setSelectedHours] = useState('1');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  console.log('BookingPage - Court ID:', id);
  
  const court = getCourtById(id || '');
  console.log('BookingPage - Court found:', court);
  
  // Ensure userData always has the required properties
  const currentUser = getCurrentUser();
  const userData = {
    name: currentUser?.name || 'Maria Santos',
    email: currentUser?.email || 'maria@email.com',
    phone: currentUser?.phone || '+55 85 88888-8888'
  };

  console.log('BookingPage - User data:', userData);

  const getEndTime = (startTime: string, hours: number = 1) => {
    const [hour] = startTime.split(':');
    return `${parseInt(hour) + hours}:00`;
  };

  const isConsecutiveHoursAvailable = (courtId: string, dateStr: string, startTime: string, hours: number) => {
    for (let i = 0; i < hours; i++) {
      const currentHour = parseInt(startTime.split(':')[0]) + i;
      const currentStartTime = `${currentHour}:00`;
      const currentEndTime = `${currentHour + 1}:00`;
      
      if (!isTimeSlotAvailable(courtId, dateStr, currentStartTime, currentEndTime)) {
        return false;
      }
    }
    return true;
  };

  const getAvailableTimeSlots = () => {
    if (!selectedDate || !court) return timeSlots;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const hours = parseInt(selectedHours);
    console.log('BookingPage - Checking availability for date:', dateStr, 'hours:', hours);
    
    return timeSlots.filter(time => {
      const isAvailable = isConsecutiveHoursAvailable(court.id, dateStr, time, hours);
      console.log(`BookingPage - Time ${time} for ${hours} hours available:`, isAvailable);
      return isAvailable;
    });
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!selectedDate) {
      newErrors.date = 'Por favor, selecione uma data';
    }

    if (!selectedTime) {
      newErrors.time = 'Por favor, selecione um horário';
    }

    if (!numberOfPeople || numberOfPeople === '0') {
      newErrors.people = 'Por favor, informe quantas pessoas participarão';
    }

    if (!selectedHours || selectedHours === '0') {
      newErrors.hours = 'Por favor, selecione a duração da reserva';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToConfirmation = () => {
    console.log('=== INÍCIO DO DEBUG handleProceedToConfirmation ===');
    console.log('selectedDate:', selectedDate);
    console.log('selectedTime:', selectedTime);
    console.log('numberOfPeople:', numberOfPeople);
    console.log('selectedHours:', selectedHours);
    console.log('court:', court);
    
    // Validar formulário
    if (!validateForm()) {
      console.log('ERROR: Formulário inválido, erros:', errors);
      return;
    }
    
    if (!court) {
      console.log('ERROR: court não foi encontrada');
      alert('Quadra não encontrada');
      return;
    }

    console.log('✓ Todos os campos obrigatórios estão preenchidos');

    const hours = parseInt(selectedHours);
    const endTime = getEndTime(selectedTime, hours);
    const dateStr = format(selectedDate!, 'yyyy-MM-dd');

    console.log('Dados calculados:');
    console.log('- hours:', hours);
    console.log('- endTime:', endTime);
    console.log('- dateStr:', dateStr);

    // Verificação de disponibilidade das horas consecutivas
    console.log('Verificando disponibilidade das horas consecutivas...');
    const isAvailable = isConsecutiveHoursAvailable(court.id, dateStr, selectedTime, hours);
    console.log('isConsecutiveHoursAvailable result:', isAvailable);
    
    if (!isAvailable) {
      console.log('ERROR: Nem todas as horas consecutivas estão disponíveis');
      alert('Nem todos os horários consecutivos estão disponíveis. Por favor, escolha outro horário ou reduza a duração.');
      return;
    }

    console.log('✓ Todas as horas consecutivas estão disponíveis');

    // Criação dos dados do booking
    const totalPrice = court.hourlyRate * hours;
    const bookingData = {
      courtId: court.id,
      courtName: court.name,
      courtImage: court.images[0] || '',
      userId: 'user_1',
      userName: userData.name,
      userEmail: userData.email,
      userPhone: userData.phone,
      date: dateStr,
      startTime: selectedTime,
      endTime,
      duration: hours,
      totalPrice,
      serviceFee: 0,
      numberOfPlayers: parseInt(numberOfPeople),
      needsEquipment: false,
      managerId: court.ownerId,
      formattedDate: format(selectedDate!, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    };

    console.log('✓ Dados do booking criados:', bookingData);

    // Navegação
    const targetRoute = `/cliente/quadra/${id}/confirmacao`;
    console.log('Tentando navegar para:', targetRoute);
    console.log('Estado a ser passado:', { bookingData, court });

    try {
      navigate(targetRoute, { 
        state: { 
          bookingData,
          court
        } 
      });
      console.log('✓ Navigate chamado com sucesso');
    } catch (error) {
      console.error('ERROR na navegação:', error);
      alert('Erro ao navegar para confirmação. Tente novamente.');
    }

    console.log('=== FIM DO DEBUG handleProceedToConfirmation ===');
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (errors.date) {
      setErrors(prev => ({ ...prev, date: '' }));
    }
  };

  const handleTimeChange = (time: string) => {
    console.log('Time selected:', time);
    setSelectedTime(time);
    if (errors.time) {
      setErrors(prev => ({ ...prev, time: '' }));
    }
  };

  const handlePeopleChange = (people: string) => {
    console.log('Number of people selected:', people);
    setNumberOfPeople(people);
    if (errors.people) {
      setErrors(prev => ({ ...prev, people: '' }));
    }
  };

  const handleHoursChange = (hours: string) => {
    console.log('Hours selected:', hours);
    setSelectedHours(hours);
    // Reset selected time when hours change to revalidate availability
    setSelectedTime('');
    if (errors.hours) {
      setErrors(prev => ({ ...prev, hours: '' }));
    }
  };

  const availableSlots = getAvailableTimeSlots();
  console.log('BookingPage - Available slots:', availableSlots);

  if (!court) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B] flex items-center justify-center">
        <div className="text-white text-center">
          <p>Quadra não encontrada</p>
          <Button onClick={() => navigate('/cliente/quadras')} className="mt-4">
            Voltar às Quadras
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B]">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/cliente/quadra/${id}`)}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-white">Agendar Horário</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Date Selection */}
        <DateSelectionCard
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          error={errors.date}
        />

        {/* Hours Selection */}
        {selectedDate && (
          <HoursSelectionCard
            selectedHours={selectedHours}
            onHoursChange={handleHoursChange}
            error={errors.hours}
          />
        )}

        {/* Time Selection */}
        {selectedDate && selectedHours && (
          <TimeSlotCard
            selectedTime={selectedTime}
            onTimeChange={handleTimeChange}
            availableSlots={availableSlots}
            error={errors.time}
          />
        )}

        {/* Number of People Selection */}
        {selectedDate && selectedHours && selectedTime && (
          <PeopleSelectionCard
            numberOfPeople={numberOfPeople}
            onPeopleChange={handlePeopleChange}
            error={errors.people}
          />
        )}

        {/* User Data Display - Automatically loaded */}
        {selectedDate && selectedHours && selectedTime && numberOfPeople && (
          <UserDataCard userData={userData} />
        )}

        {/* Booking Summary & Proceed */}
        {selectedDate && selectedHours && selectedTime && numberOfPeople && (
          <BookingSummaryCard
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            selectedHours={selectedHours}
            numberOfPeople={numberOfPeople}
            courtPrice={court?.hourlyRate || 120}
            onProceed={handleProceedToConfirmation}
          />
        )}
      </div>
    </div>
  );
};

export default BookingPage;
