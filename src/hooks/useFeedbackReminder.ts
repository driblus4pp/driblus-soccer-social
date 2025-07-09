import { useState, useEffect } from 'react';
import { Booking } from '@/types';

interface FeedbackReminder {
  bookingId: string;
  shouldShowReminder: boolean;
  daysSinceBooking: number;
}

export const useFeedbackReminder = (userBookings: Booking[]) => {
  const [reminderBookings, setReminderBookings] = useState<FeedbackReminder[]>([]);

  useEffect(() => {
    const checkForReminders = () => {
      const now = new Date();
      const reminders: FeedbackReminder[] = [];

      userBookings.forEach(booking => {
        // Check if booking is completed and doesn't have a rating
        if (booking.status === 'completed' && !booking.rating) {
          const bookingDate = new Date(booking.date);
          const daysDiff = Math.floor((now.getTime() - bookingDate.getTime()) / (1000 * 60 * 60 * 24));
          
          // Show reminder 1 day after booking
          if (daysDiff >= 1 && daysDiff <= 7) {
            reminders.push({
              bookingId: booking.id,
              shouldShowReminder: true,
              daysSinceBooking: daysDiff
            });
          }
        }
      });

      setReminderBookings(reminders);
    };

    checkForReminders();
    // Check every hour
    const interval = setInterval(checkForReminders, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [userBookings]);

  const dismissReminder = (bookingId: string) => {
    setReminderBookings(prev => 
      prev.filter(reminder => reminder.bookingId !== bookingId)
    );
  };

  return {
    reminderBookings,
    dismissReminder
  };
};