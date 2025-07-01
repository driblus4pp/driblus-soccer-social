
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
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  console.log('BookingPage - Court ID:', id);
  
  const court = getCourtById(id || '');
  console.log('BookingPage - Court found:', court);
  
  // Usar dados do usuário logado automaticamente
  const userData = getCurrentUser() || {
    name: 'Maria Santos',
    email: 'maria@email.com',
    phone: '+55 85 88888-8888'
  };

  console.log('BookingPage - User data:', userData);

  const getEndTime = (startTime: string) => {
    const [hour] = startTime.split(':');
    return `${parseInt(hour) + 1}:00`;
  };

  const getAvailableTimeSlots = () => {
    if (!selectedDate || !court) return timeSlots;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    console.log('BookingPage - Checking availability for date:', dateStr);
    
    return timeSlots.filter(time => {
      const endTime = getEndTime(time);
      const isAvailable = isTimeSlotAvailable(court.id, dateStr, time, endTime);
      console.log(`BookingPage - Time ${time}-${endTime} available:`, isAvailable);
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToConfirmation = () => {
    console.log('=== INÍCIO DO DEBUG handleProceedToConfirmation ===');
    console.log('selectedDate:', selectedDate);
    console.log('selectedTime:', selectedTime);
    console.log('numberOfPeople:', numberOfPeople);
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

    const endTime = getEndTime(selectedTime);
    const dateStr = format(selectedDate!, 'yyyy-MM-dd');

    console.log('Dados calculados:');
    console.log('- endTime:', endTime);
    console.log('- dateStr:', dateStr);

    // Verificação de disponibilidade do horário
    console.log('Verificando disponibilidade...');
    const isAvailable = isTimeSlotAvailable(court.id, dateStr, selectedTime, endTime);
    console.log('isTimeSlotAvailable result:', isAvailable);
    
    if (!isAvailable) {
      console.log('ERROR: Horário não está mais disponível');
      alert('Este horário não está mais disponível. Por favor, escolha outro horário.');
      return;
    }

    console.log('✓ Horário está disponível');

    // Criação dos dados do booking
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
      duration: 1,
      totalPrice: court.hourlyRate,
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

        {/* Time Selection */}
        {selectedDate && (
          <TimeSlotCard
            selectedTime={selectedTime}
            onTimeChange={handleTimeChange}
            availableSlots={availableSlots}
            error={errors.time}
          />
        )}

        {/* Number of People Selection */}
        {selectedDate && selectedTime && (
          <PeopleSelectionCard
            numberOfPeople={numberOfPeople}
            onPeopleChange={handlePeopleChange}
            error={errors.people}
          />
        )}

        {/* User Data Display - Automatically loaded */}
        {selectedDate && selectedTime && numberOfPeople && (
          <UserDataCard userData={userData} />
        )}

        {/* Booking Summary & Proceed */}
        {selectedDate && selectedTime && numberOfPeople && (
          <BookingSummaryCard
            selectedDate={selectedDate}
            selectedTime={selectedTime}
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
