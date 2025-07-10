
import { useBookings } from "@/hooks/useBookings";
import { useFeedbackReminder } from "@/hooks/useFeedbackReminder";
import FeedbackBanner from "@/components/feedback/FeedbackBanner";
import { Booking } from "@/types";

interface FeedbackRemindersProps {
  onRateBooking: (booking: Booking) => void;
  onDismissReminder: (bookingId: string) => void;
}

const FeedbackReminders = ({ onRateBooking, onDismissReminder }: FeedbackRemindersProps) => {
  const { bookings } = useBookings();
  const { reminderBookings } = useFeedbackReminder(bookings);

  if (reminderBookings.length === 0) return null;

  return (
    <div className="space-y-2">
      {reminderBookings.map(reminder => {
        const booking = bookings.find(b => b.id === reminder.bookingId);
        return booking ? (
          <FeedbackBanner
            key={booking.id}
            booking={booking}
            onRate={onRateBooking}
            onDismiss={onDismissReminder}
          />
        ) : null;
      })}
    </div>
  );
};

export default FeedbackReminders;
