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
    serviceFee: 0,
    status: BookingStatus.CONFIRMED,
    paymentStatus: 'pending',
    numberOfPlayers: 10,
    needsEquipment: false,
    createdAt: new Date('2024-12-18T10:30:00'),
    managerId: 'manager-1'
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
    serviceFee: 0,
    status: BookingStatus.CANCELLED_BY_MANAGER,
    paymentStatus: 'pending',
    numberOfPlayers: 8,
    needsEquipment: false,
    createdAt: new Date('2024-12-17T14:20:00'),
    managerId: 'manager-2',
    cancellationReason: 'Manutenção da quadra'
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
    serviceFee: 0,
    status: BookingStatus.COMPLETED,
    paymentStatus: 'paid',
    numberOfPlayers: 12,
    needsEquipment: false,
    createdAt: new Date('2024-12-13T09:15:00'),
    managerId: 'manager-1',
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
    serviceFee: 0,
    status: BookingStatus.PENDING,
    paymentStatus: 'pending',
    numberOfPlayers: 10,
    needsEquipment: false,
    createdAt: new Date('2024-12-19T16:45:00'),
    managerId: 'manager-1'
  },
  {
    id: 'booking_5',
    courtId: '1',
    courtName: 'No Alvo Society',
    courtImage: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=300&fit=crop',
    userId: 'user_2',
    userName: 'João Silva',
    userEmail: 'joao@email.com',
    userPhone: '+55 85 99999-9999',
    date: '2024-12-26',
    startTime: '19:00',
    endTime: '20:00',
    duration: 1,
    totalPrice: 120,
    serviceFee: 0,
    status: BookingStatus.PENDING,
    paymentStatus: 'pending',
    numberOfPlayers: 8,
    needsEquipment: false,
    createdAt: new Date('2024-12-20T09:30:00'),
    managerId: 'manager-1'
  }
];

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);

  const getBookingsByStatus = (status?: BookingStatus) => {
    if (!status) return bookings;
    return bookings.filter(booking => booking.status === status);
  };

  const getBookingsByManager = (managerId: string) => {
    return bookings.filter(booking => booking.managerId === managerId);
  };

  const getPendingBookingsByManager = (managerId: string) => {
    return bookings.filter(booking => 
      booking.managerId === managerId && 
      booking.status === BookingStatus.PENDING
    );
  };

  const approveBooking = (bookingId: string) => {
    setBookings(prev =>
      prev.map(booking =>
        booking.id === bookingId
          ? { ...booking, status: BookingStatus.CONFIRMED }
          : booking
      )
    );
    
    // Simular notificação para o cliente
    console.log(`Agendamento ${bookingId} aprovado - Notificação enviada ao cliente`);
  };

  const rejectBooking = (bookingId: string, reason?: string) => {
    setBookings(prev =>
      prev.map(booking =>
        booking.id === bookingId
          ? { 
              ...booking, 
              status: BookingStatus.CANCELLED_BY_MANAGER,
              cancellationReason: reason 
            }
          : booking
      )
    );
    
    // Simular notificação para o cliente
    console.log(`Agendamento ${bookingId} rejeitado - Notificação enviada ao cliente`);
  };

  const createBooking = (bookingData: Partial<Booking>) => {
    console.log('useBookings - createBooking called with:', bookingData);
    
    const newBooking: Booking = {
      id: `booking_${Date.now()}`,
      status: BookingStatus.CONFIRMED,
      paymentStatus: 'pending',
      createdAt: new Date(),
      ...bookingData
    } as Booking;

    console.log('useBookings - newBooking created:', newBooking);

    setBookings(prev => {
      const updated = [...prev, newBooking];
      console.log('useBookings - bookings updated, total count:', updated.length);
      return updated;
    });
    
    // Simular notificação para o gestor sobre nova ordem de agendamento
    console.log(`Nova ordem de agendamento criada - Notificação enviada ao gestor da quadra`);
    console.log(`Dados do cliente: ${newBooking.userName} - ${newBooking.userPhone} - ${newBooking.userEmail}`);
    console.log(`Detalhes: ${newBooking.date} às ${newBooking.startTime} para ${newBooking.numberOfPlayers} pessoas`);
    
    return newBooking;
  };

  const isTimeSlotAvailable = (courtId: string, date: string, startTime: string, endTime: string) => {
    console.log('useBookings - isTimeSlotAvailable called with:');
    console.log('- courtId:', courtId);
    console.log('- date:', date);
    console.log('- startTime:', startTime);
    console.log('- endTime:', endTime);
    
    const confirmedBookings = bookings.filter(booking => {
      const matches = booking.courtId === courtId && 
        booking.date === date && 
        booking.status === BookingStatus.CONFIRMED;
      
      if (matches) {
        console.log('useBookings - Found confirmed booking:', booking);
      }
      
      return matches;
    });

    console.log('useBookings - confirmedBookings for this slot:', confirmedBookings);

    const hasConflict = confirmedBookings.some(booking => {
      const bookingStart = booking.startTime;
      const bookingEnd = booking.endTime;
      
      // Verificar sobreposição de horários
      const conflict = startTime < bookingEnd && endTime > bookingStart;
      
      if (conflict) {
        console.log('useBookings - Time conflict detected with booking:', booking);
        console.log(`- Existing: ${bookingStart}-${bookingEnd}`);
        console.log(`- Requested: ${startTime}-${endTime}`);
      }
      
      return conflict;
    });

    const isAvailable = !hasConflict;
    console.log('useBookings - isTimeSlotAvailable result:', isAvailable);
    
    return isAvailable;
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

  const cancelBooking = (bookingId: string, reason?: string) => {
    setBookings(prev =>
      prev.map(booking =>
        booking.id === bookingId
          ? { 
              ...booking, 
              status: BookingStatus.CANCELLED_BY_USER,
              cancellationReason: reason 
            }
          : booking
      )
    );
  };

  return {
    bookings,
    getBookingsByStatus,
    getBookingsByManager,
    getPendingBookingsByManager,
    approveBooking,
    rejectBooking,
    createBooking,
    isTimeSlotAvailable,
    addRating,
    cancelBooking
  };
};
