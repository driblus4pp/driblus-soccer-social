import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import BookingDetails from './BookingDetails';
import BookingSummary from './BookingSummary';
import PaymentMethod from './PaymentMethod';
import BookingConfirmation from './BookingConfirmation';

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

interface BookingData {
  numberOfPeople: number;
  observations: string;
  needsEquipment: boolean;
  date: string;
  time: string;
  duration: number;
  serviceFee: number;
  selectedDate: undefined;
  selectedTime: undefined;
  formattedDateTime: undefined;
}

interface BookingFlowProps {
  court: Court;
  onBack: () => void;
}

const BookingFlow = ({ court, onBack }: BookingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    numberOfPeople: 10,
    observations: '',
    needsEquipment: false,
    date: '2024-12-20',
    time: '19:00',
    duration: 1,
    serviceFee: 15,
    selectedDate: undefined,
    selectedTime: undefined,
    formattedDateTime: undefined
  });

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleBookingDataUpdate = (data: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  const renderHeader = () => {
    if (currentStep === 4) return null; // No header for confirmation screen
    
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
            {[1, 2, 3].map((step) => (
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
                {step < 3 && (
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
          <BookingDetails
            court={court}
            bookingData={bookingData}
            onNext={handleNext}
            onUpdateData={handleBookingDataUpdate}
          />
        );
      case 2:
        return (
          <BookingSummary
            court={court}
            bookingData={bookingData}
            onNext={handleNext}
            onUpdateData={handleBookingDataUpdate}
          />
        );
      case 3:
        return (
          <PaymentMethod
            court={court}
            bookingData={bookingData}
            onNext={handleNext}
          />
        );
      case 4:
        return (
          <BookingConfirmation
            court={court}
            bookingData={bookingData}
            onBack={onBack}
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
