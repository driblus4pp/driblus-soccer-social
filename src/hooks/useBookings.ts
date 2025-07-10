import { useState } from 'react';
import { Booking, BookingStatus } from '@/types';

const mockBookings: Booking[] = [
  {
    id: 'booking_1',
    courtId: 'alvo-centro-1',
    courtName: 'No Alvo Centro - Quadra 1',
    courtImage: '/lovable-uploads/e7f67107-cd13-4104-8fe2-fed9dc5f571a.png',
    userId: 'user_1',
    userName: 'Maria Santos',
    userEmail: 'maria@email.com',
    userPhone: '+55 85 88888-8888',
    date: '2025-07-15',
    startTime: '19:00',
    endTime: '20:00',
    duration: 1,
    totalPrice: 120,
    serviceFee: 0,
    status: BookingStatus.CONFIRMED,
    paymentStatus: 'pending',
    numberOfPlayers: 10,
    needsEquipment: false,
    createdAt: new Date('2025-07-10T10:30:00'),
    managerId: 'manager-alvo'
  },
  {
    id: 'booking_2',
    courtId: 'arena-cangaco-1',
    courtName: 'Arena Cangaço - Futebol Society',
    courtImage: '/src/assets/arena-cangaco-futebol.png',
    userId: 'user_1',
    userName: 'Maria Santos',
    userEmail: 'maria@email.com',
    userPhone: '+55 85 88888-8888',
    date: '2025-07-22',
    startTime: '15:00',
    endTime: '16:00',
    duration: 1,
    totalPrice: 80,
    serviceFee: 0,
    status: BookingStatus.CANCELLED_BY_MANAGER,
    paymentStatus: 'pending',
    numberOfPlayers: 8,
    needsEquipment: false,
    createdAt: new Date('2025-07-09T14:20:00'),
    managerId: 'manager-arena',
    cancellationReason: 'Manutenção da quadra'
  },
  {
    id: 'booking_3',
    courtId: 'alvo-sul-1',
    courtName: 'No Alvo Sul - Quadra 1',
    courtImage: '/src/assets/no-alvo-sul-1.png',
    userId: 'user_1',
    userName: 'Maria Santos',
    userEmail: 'maria@email.com',
    userPhone: '+55 85 88888-8888',
    date: '2025-07-05',
    startTime: '18:00',
    endTime: '19:00',
    duration: 1,
    totalPrice: 120,
    serviceFee: 0,
    status: BookingStatus.COMPLETED,
    paymentStatus: 'paid',
    numberOfPlayers: 12,
    needsEquipment: false,
    createdAt: new Date('2025-07-03T09:15:00'),
    managerId: 'manager-alvo',
    rating: {
      id: 'rating_1',
      bookingId: 'booking_3',
      userId: 'user_1',
      courtId: 'alvo-sul-1',
      stars: 5,
      comment: 'Excelente quadra! Muito bem cuidada e com ótima localização.',
      createdAt: new Date('2025-07-06T10:00:00'),
      helpful: 5
    }
  },
  {
    id: 'booking_4',
    courtId: 'alvo-centro-1',
    courtName: 'No Alvo Centro - Quadra 1',
    courtImage: '/lovable-uploads/e7f67107-cd13-4104-8fe2-fed9dc5f571a.png',
    userId: 'user_1',
    userName: 'Maria Santos',
    userEmail: 'maria@email.com',
    userPhone: '+55 85 88888-8888',
    date: '2025-07-12',
    startTime: '20:00',
    endTime: '21:00',
    duration: 1,
    totalPrice: 120,
    serviceFee: 0,
    status: BookingStatus.PENDING,
    paymentStatus: 'pending',
    numberOfPlayers: 10,
    needsEquipment: false,
    createdAt: new Date('2025-07-10T16:45:00'),
    managerId: 'manager-alvo'
  },
  {
    id: 'booking_5',
    courtId: 'arena-cangaco-2',
    courtName: 'Arena Cangaço - Vôlei de Praia',
    courtImage: '/src/assets/arena-cangaco-volei.png',
    userId: 'user_2',
    userName: 'João Silva',
    userEmail: 'joao@email.com',
    userPhone: '+55 85 99999-9999',
    date: '2025-07-13',
    startTime: '19:00',
    endTime: '20:00',
    duration: 1,
    totalPrice: 60,
    serviceFee: 0,
    status: BookingStatus.PENDING,
    paymentStatus: 'pending',
    numberOfPlayers: 4,
    needsEquipment: false,
    createdAt: new Date('2025-07-10T09:30:00'),
    managerId: 'manager-arena'
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
    
    console.log(`✅ Agendamento ${bookingId} aprovado - Notificação enviada ao cliente`);
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
    
    console.log(`❌ Agendamento ${bookingId} rejeitado - Motivo: ${reason} - Notificação enviada ao cliente`);
  };

  const createBooking = (bookingData: Partial<Booking>) => {
    console.log('useBookings - createBooking called with:', bookingData);
    
    const newBooking: Booking = {
      id: `booking_${Date.now()}`,
      status: BookingStatus.PENDING,
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
    console.log(`🔔 Nova solicitação de agendamento criada!`);
    console.log(`📋 Cliente: ${newBooking.userName} (${newBooking.userPhone})`);
    console.log(`📅 Data/Hora: ${newBooking.date} às ${newBooking.startTime}`);
    console.log(`⚽ Quadra: ${newBooking.courtName}`);
    console.log(`👥 Jogadores: ${newBooking.numberOfPlayers}`);
    console.log(`💰 Valor: R$ ${newBooking.totalPrice}`);
    console.log(`📧 Notificação enviada ao gestor da quadra`);
    
    return newBooking;
  };

  const isTimeSlotAvailable = (courtId: string, date: string, startTime: string, endTime: string) => {
    console.log('useBookings - isTimeSlotAvailable called with:');
    console.log('- courtId:', courtId);
    console.log('- date:', date);
    console.log('- startTime:', startTime);
    console.log('- endTime:', endTime);
    
    const confirmedOrPendingBookings = bookings.filter(booking => {
      const matches = booking.courtId === courtId && 
        booking.date === date && 
        (booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.PENDING);
      
      if (matches) {
        console.log('useBookings - Found confirmed/pending booking:', booking);
      }
      
      return matches;
    });

    console.log('useBookings - confirmedOrPendingBookings for this slot:', confirmedOrPendingBookings);

    const hasConflict = confirmedOrPendingBookings.some(booking => {
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
