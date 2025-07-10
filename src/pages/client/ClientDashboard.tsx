import { useState } from 'react';
import { useBookings } from "@/hooks/useBookings";
import { useFeedbackReminder } from "@/hooks/useFeedbackReminder";
import { useDataSync } from "@/hooks/useDataSync";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import NotificationModal from "@/components/NotificationModal";
import RatingModal from "@/components/RatingModal";
import DashboardHeader from "@/components/client/DashboardHeader";
import CourtsList from "@/components/client/CourtsList";
import FeedbackReminders from "@/components/client/FeedbackReminders";
import { mockCourts } from "@/data/mockCourts";
import { Booking } from "@/types";

const ClientDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [selectedBookingForRating, setSelectedBookingForRating] = useState<Booking | null>(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  
  const { bookings, addRating } = useBookings();
  const { dismissReminder } = useFeedbackReminder(bookings);
  const { lastSync, notifyManagers } = useDataSync();

  // Filter courts based on search term
  const filteredCourts = mockCourts.filter(court => 
    court.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    court.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const recommendedCourts = filteredCourts.filter(court => court.isRecommended);
  const otherCourts = filteredCourts.filter(court => !court.isRecommended);

  const handleRateBooking = (booking: Booking) => {
    setSelectedBookingForRating(booking);
    setIsRatingModalOpen(true);
  };

  const handleSubmitRating = (bookingId: string, stars: number, comment: string) => {
    addRating(bookingId, stars, comment);
    dismissReminder(bookingId);
    setIsRatingModalOpen(false);
    setSelectedBookingForRating(null);
  };

  const handleDismissReminder = (bookingId: string) => {
    dismissReminder(bookingId);
  };

  return (
    <div className="min-h-screen bg-[#093758] pb-20">
      <DashboardHeader 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onNotificationClick={() => setIsNotificationModalOpen(true)}
      />

      {/* Feedback Reminders */}
      <div className="px-4">
        <FeedbackReminders 
          onRateBooking={handleRateBooking}
          onDismissReminder={handleDismissReminder}
        />
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Recommended Courts */}
        <CourtsList 
          courts={recommendedCourts}
          title="Recomendados para você"
          variant="recommended"
        />

        {/* Other Courts */}
        <CourtsList 
          courts={otherCourts}
          title="Outras opções"
          variant="compact"
        />
      </div>

      {/* Navigation and Modals */}
      <BottomNavigation userType="client" />
      
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />
      
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => {
          setIsRatingModalOpen(false);
          setSelectedBookingForRating(null);
        }}
        booking={selectedBookingForRating}
        onSubmit={handleSubmitRating}
      />
    </div>
  );
};

export default ClientDashboard;
