
import { useState, useMemo } from 'react';
import { useBookings } from './useBookings';
import { useCourts } from './useCourts';

interface MonthlyBooking {
  id: string;
  date: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  totalPrice: number;
  status: string;
}

interface LoyalCustomer {
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  frequency: number;
  totalSpent: number;
  lastBooking: string;
}

interface RevenueMonth {
  month: string;
  revenue: number;
  bookings: number;
  growth: number;
}

interface OccupancyRate {
  current: number;
  projection30Days: number;
  weeklyHours: number;
  bookedHours: number;
}

export const useManagerAnalytics = (managerId: string) => {
  const { bookings } = useBookings();
  const { courts } = useCourts();

  const managerBookings = useMemo(() => {
    return bookings.filter(booking => booking.managerId === managerId);
  }, [bookings, managerId]);

  const getMonthlyBookings = (): MonthlyBooking[] => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return managerBookings
      .filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate.getMonth() === currentMonth && 
               bookingDate.getFullYear() === currentYear;
      })
      .map(booking => ({
        id: booking.id,
        date: booking.date,
        userName: booking.userName,
        userEmail: booking.userEmail,
        userPhone: booking.userPhone,
        totalPrice: booking.totalPrice,
        status: booking.status
      }));
  };

  const getRevenueHistory = (): RevenueMonth[] => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthBookings = managerBookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate.getMonth() === date.getMonth() && 
               bookingDate.getFullYear() === date.getFullYear();
      });
      
      const revenue = monthBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
      const prevMonthRevenue = i < 5 ? months[months.length - 1]?.revenue || 0 : revenue;
      const growth = prevMonthRevenue > 0 ? ((revenue - prevMonthRevenue) / prevMonthRevenue) * 100 : 0;
      
      months.push({
        month: date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
        revenue,
        bookings: monthBookings.length,
        growth: i === 5 ? 0 : growth
      });
    }
    
    return months;
  };

  const calculateOccupancyRate = (): OccupancyRate => {
    const managerCourts = courts.filter(court => court.ownerId === managerId);
    if (managerCourts.length === 0) return { current: 0, projection30Days: 0, weeklyHours: 0, bookedHours: 0 };

    // Calcular horas disponíveis por semana (exemplo simplificado)
    const weeklyHours = managerCourts.reduce((total, court) => {
      // Assumindo 12 horas por dia (6h às 18h) e 7 dias por semana
      return total + (12 * 7);
    }, 0);

    // Calcular horas ocupadas nas últimas 4 semanas
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
    
    const recentBookings = managerBookings.filter(booking => 
      new Date(booking.date) >= fourWeeksAgo
    );
    
    const bookedHours = recentBookings.reduce((total, booking) => {
      return total + booking.duration;
    }, 0);

    const current = weeklyHours > 0 ? (bookedHours / (weeklyHours * 4)) * 100 : 0;
    const projection30Days = Math.min(current * 1.1, 100); // Projeção otimista de 10%

    return {
      current: Math.round(current),
      projection30Days: Math.round(projection30Days),
      weeklyHours,
      bookedHours
    };
  };

  const getLoyalCustomers = (): LoyalCustomer[] => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const recentBookings = managerBookings.filter(booking => 
      new Date(booking.date) >= sixMonthsAgo
    );

    const customerStats: { [key: string]: LoyalCustomer } = {};
    
    recentBookings.forEach(booking => {
      if (!customerStats[booking.userId]) {
        customerStats[booking.userId] = {
          userId: booking.userId,
          userName: booking.userName,
          userEmail: booking.userEmail,
          userPhone: booking.userPhone,
          frequency: 0,
          totalSpent: 0,
          lastBooking: booking.date
        };
      }
      
      customerStats[booking.userId].frequency += 1;
      customerStats[booking.userId].totalSpent += booking.totalPrice;
      
      if (new Date(booking.date) > new Date(customerStats[booking.userId].lastBooking)) {
        customerStats[booking.userId].lastBooking = booking.date;
      }
    });

    return Object.values(customerStats)
      .filter(customer => customer.frequency >= 3)
      .sort((a, b) => b.frequency - a.frequency);
  };

  return {
    monthlyBookings: getMonthlyBookings(),
    revenueHistory: getRevenueHistory(),
    occupancyRate: calculateOccupancyRate(),
    loyalCustomers: getLoyalCustomers()
  };
};
