
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import BookingStepOne from './booking/BookingStepOne';
import BookingStepTwo from './booking/BookingStepTwo';
import BookingStepThree from './booking/BookingStepThree';
import { useUsers } from '@/hooks/useUsers';
import { useBookings } from '@/hooks/useBookings';
import { format } from 'date-fns';

interface Court {
  id: number;
  name: string;
  location: string;
  distance: string;
  price: string;
  rating: number;
  status: string;
  image: string;
}

interface BookingFlowProps {
  court: Court;
  onBack: () => void;
}

const BookingFlow = ({ court, onBack }: BookingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<any>({});
  const { getCurrentUser } = useUsers();
  const { createBooking } = useBookings();

  // Usar dados do usuário logado automaticamente
  const userData = getCurrentUser() || {
    name: 'Maria Santos',
    email: 'maria@email.com',
    phone: '+55 85 88888-8888'
  };

  const handleStepOneNext = (data: any) => {
    setBookingData(prev => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const handleStepTwoNext = () => {
    setCurrentStep(3);

    // Criar o agendamento com os dados do usuário logado
    const courtPrice = parseInt(court.price.replace('R$ ', '').replace('/hora', ''));
    const endTime = `${parseInt(bookingData.selectedTime.split(':')[0]) + 1}:00`;
    const dateStr = format(bookingData.selectedDate, 'yyyy-MM-dd');

    const newBooking = {
      courtId: court.id.toString(),
      courtName: court.name,
      courtImage: court.image,
      userId: 'user_1',
      userName: userData.name,
      userEmail: userData.email,
      userPhone: userData.phone,
      date: dateStr,
      startTime: bookingData.selectedTime,
      endTime,
      duration: 1,
      totalPrice: courtPrice,
      serviceFee: 0,
      numberOfPlayers: bookingData.numberOfPeople,
      needsEquipment: false,
      managerId: 'manager-1'
    };

    createBooking(newBooking);
  };

  const handleFinish = () => {
    onBack();
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const renderHeader = () => {
    if (currentStep === 3) return null;
    
    return (
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={currentStep === 1 ? onBack : handlePrevious}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step <= currentStep
                      ? 'bg-[#F35410] text-white'
                      : 'bg-white/20 text-white/60'
                  }`}
                >
                  {step}
                </div>
                {step < 2 && (
                  <div
                    className={`w-8 h-1 mx-2 ${
                      step < currentStep ? 'bg-[#F35410]' : 'bg-white/20'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BookingStepOne
            court={court}
            onNext={handleStepOneNext}
            initialData={bookingData}
          />
        );
      case 2:
        return (
          <BookingStepTwo
            court={court}
            bookingData={bookingData}
            userData={userData}
            onNext={handleStepTwoNext}
          />
        );
      case 3:
        return (
          <BookingStepThree
            court={court}
            bookingData={bookingData}
            userData={userData}
            onFinish={handleFinish}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B]">
      <div className="p-4">
        {renderHeader()}
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default BookingFlow;
