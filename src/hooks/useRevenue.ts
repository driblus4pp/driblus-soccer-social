
import { useState } from 'react';
import { useCourts } from './useCourts';
import { useManagers } from './useManagers';

interface RevenueData {
  courtId: string;
  courtName: string;
  managerId: string;
  managerName: string;
  monthlyRevenue: number;
  totalBookings: number;
  averageBookingValue: number;
  growth: number;
}

interface PlatformRevenue {
  totalRevenue: number;
  monthlyRevenue: number;
  averageBookingValue: number;
  totalBookings: number;
  topPerformingCourts: RevenueData[];
  revenueByManager: { managerId: string; managerName: string; revenue: number; courts: number }[];
}

export const useRevenue = () => {
  const { courts } = useCourts();
  const { managers } = useManagers();

  const generateRevenueData = (): RevenueData[] => {
    return courts.map(court => {
      const manager = managers.find(m => m.managedCourts.includes(court.id));
      const baseBookings = Math.floor(Math.random() * 50) + 10;
      const monthlyRevenue = baseBookings * court.hourlyRate;
      
      return {
        courtId: court.id,
        courtName: court.name,
        managerId: manager?.id || '',
        managerName: manager?.name || 'Gestor não encontrado',
        monthlyRevenue,
        totalBookings: baseBookings,
        averageBookingValue: court.hourlyRate,
        growth: (Math.random() - 0.5) * 40 // -20% to +20%
      };
    });
  };

  const [revenueData] = useState<RevenueData[]>(generateRevenueData());

  const getPlatformRevenue = (): PlatformRevenue => {
    const totalRevenue = revenueData.reduce((acc, data) => acc + data.monthlyRevenue, 0);
    const totalBookings = revenueData.reduce((acc, data) => acc + data.totalBookings, 0);
    
    const topPerformingCourts = [...revenueData]
      .sort((a, b) => b.monthlyRevenue - a.monthlyRevenue)
      .slice(0, 5);

    const revenueByManager = managers.map(manager => {
      const managerRevenue = revenueData
        .filter(data => data.managerId === manager.id)
        .reduce((acc, data) => acc + data.monthlyRevenue, 0);
      
      const managerCourts = revenueData.filter(data => data.managerId === manager.id).length;
      
      return {
        managerId: manager.id,
        managerName: manager.name,
        revenue: managerRevenue,
        courts: managerCourts
      };
    }).sort((a, b) => b.revenue - a.revenue);

    return {
      totalRevenue: totalRevenue * 12, // Anual
      monthlyRevenue: totalRevenue,
      averageBookingValue: totalBookings > 0 ? totalRevenue / totalBookings : 0,
      totalBookings,
      topPerformingCourts,
      revenueByManager
    };
  };

  const getCourtRevenue = (courtId: string) => {
    return revenueData.find(data => data.courtId === courtId);
  };

  const getManagerRevenue = (managerId: string) => {
    const managerData = revenueData.filter(data => data.managerId === managerId);
    
    return {
      totalRevenue: managerData.reduce((acc, data) => acc + data.monthlyRevenue, 0),
      totalBookings: managerData.reduce((acc, data) => acc + data.totalBookings, 0),
      averageGrowth: managerData.reduce((acc, data) => acc + data.growth, 0) / managerData.length || 0,
      courts: managerData
    };
  };

  return {
    revenueData,
    getPlatformRevenue,
    getCourtRevenue,
    getManagerRevenue
  };
};
