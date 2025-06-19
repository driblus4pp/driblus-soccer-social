
import { useState } from 'react';
import { Booking, BookingStatus } from '@/types';

const mockBookings: Booking[] = [
  {
    id: 'booking_1',
    courtId: '1',
    courtName: 'No Alvo Society',
    courtImage: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=300&fit=crop',
    userId: 'user_1',
    userName: 'Maria Santos',
    userEmail: 'maria@email.com',
    userPhone: '+55 85 88888-8888',
    date: '2024-12-20',
    startTime: '19:00',
    endTime: '20:00',
    duration: 1,
    totalPrice: 120,
    serviceFee: 12,
    status: BookingStatus.CONFIRMED,
    paymentStatus: 'paid',
    numberOfPlayers: 10,
    needsEquipment: false,
    createdAt: new Date('2024-12-18T10:30:00')
  },
  {
    id: 'booking_2',
    courtId: '3',
    courtName: 'Arena Pro Sports',
    courtImage: 'https://images.unsplash.com/photo-1544989164-44a5ba64d0c6?w=400&h=300&fit=crop',
    userId: 'user_1',
    userName: 'Maria Santos',
    userEmail: 'maria@email.com',
    userPhone: '+55 85 88888-8888',
    date: '2024-12-22',
    startTime: '15:00',
    endTime: '16:00',
    duration: 1,
    totalPrice: 200,
    serviceFee: 20,
    status: BookingStatus.CANCELLED,
    paymentStatus: 'refunded',
    numberOfPlayers: 8,
    needsEquipment: false,
    createdAt: new Date('2024-12-17T14:20:00')
  },
  {
    id: 'booking_3',
    courtId: '2',
    courtName: 'Gol de Placa',
    courtImage: 'https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?w=400&h=300&fit=crop',
    userId: 'user_1',
    userName: 'Maria Santos',
    userEmail: 'maria@email.com',
    userPhone: '+55 85 88888-8888',
    date: '2024-12-15',
    startTime: '18:00',
    endTime: '19:00',
    duration: 1,
    totalPrice: 150,
    serviceFee: 15,
    status: BookingStatus.COMPLETED,
    paymentStatus: 'paid',
    numberOfPlayers: 12,
    needsEquipment: false,
    createdAt: new Date('2024-12-13T09:15:00'),
    rating: {
      id: 'rating_1',
      bookingId: 'booking_3',
      userId: 'user_1',
      courtId: '2',
      stars: 5,
      comment: 'Excelente quadra! Muito bem cuidada e com ótima localização.',
      createdAt: new Date('2024-12-16T10:00:00'),
      helpful: 5
    }
  },
  {
    id: 'booking_4',
    courtId: '1',
    courtName: 'No Alvo Society',
    courtImage: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=300&fit=crop',
    userId: 'user_1',
    userName: 'Maria Santos',
    userEmail: 'maria@email.com',
    userPhone: '+55 85 88888-8888',
    date: '2024-12-25',
    startTime: '20:00',
    endTime: '21:00',
    duration: 1,
    totalPrice: 120,
    serviceFee: 12,
    status: BookingStatus.PENDING,
    paymentStatus: 'pending',
    numberOfPlayers: 10,
    needsEquipment: false,
    createdAt: new Date('2024-12-19T16:45:00')
  }
];

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);

  const getBookingsByStatus = (status?: BookingStatus) => {
    if (!status) return bookings;
    return bookings.filter(booking => booking.status === status);
  };

  const addRating = (bookingId: string, stars: number, comment: string) => {
    setBookings(prev =>
      prev.map(booking =>
        booking.id === bookingId
          ? {
              ...booking,
              rating: {
                id: `rating_${Date.now()}`,
                bookingId,
                userId: booking.userId,
                courtId: booking.courtId,
                stars,
                comment,
                createdAt: new Date(),
                helpful: 0
              }
            }
          : booking
      )
    );
  };

  const cancelBooking = (bookingId: string) => {
    setBookings(prev =>
      prev.map(booking =>
        booking.id === bookingId
          ? { ...booking, status: BookingStatus.CANCELLED }
          : booking
      )
    );
  };

  return {
    bookings,
    getBookingsByStatus,
    addRating,
    cancelBooking
  };
};
