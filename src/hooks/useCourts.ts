
import { useState } from 'react';
import { Court, WorkingHours } from '@/types';

const mockCourts: Court[] = [
  {
    id: '1',
    name: 'No Alvo Society',
    description: 'Quadra society com grama sintética de alta qualidade',
    location: {
      address: 'Rua Major Facundo, 123',
      city: 'Fortaleza',
      state: 'CE',
      zipCode: '60120-000',
      lat: -3.731862,
      lng: -38.526669
    },
    ownerId: 'manager-1',
    ownerName: 'João Silva',
    images: ['https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=600&h=400&fit=crop'],
    sports: ['FOOTBALL', 'FUTSAL'] as any,
    amenities: ['Vestiário', 'Estacionamento', 'Chuveiro', 'Iluminação'],
    hourlyRate: 120,
    status: 'active',
    rating: 4.8,
    totalReviews: 47,
    workingHours: {
      monday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      saturday: { isOpen: true, openTime: '07:00', closeTime: '20:00' },
      sunday: { isOpen: false, openTime: '07:00', closeTime: '20:00' }
    },
    isVerified: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-06-19')
  }
];

export const useCourts = () => {
  const [courts, setCourts] = useState<Court[]>(mockCourts);

  const getActiveCourts = () => {
    return courts.filter(court => court.status === 'active');
  };

  const getPendingCourts = () => {
    return courts.filter(court => court.status === 'pending_approval');
  };

  const getCourtById = (id: string) => {
    return courts.find(court => court.id === id);
  };

  const updateCourtWorkingHours = (courtId: string, workingHours: WorkingHours) => {
    setCourts(prev =>
      prev.map(court =>
        court.id === courtId
          ? { ...court, workingHours, updatedAt: new Date() }
          : court
      )
    );
  };

  const approveCourt = (courtId: string) => {
    setCourts(prev =>
      prev.map(court =>
        court.id === courtId
          ? { ...court, status: 'active' as const, updatedAt: new Date() }
          : court
      )
    );
  };

  return {
    courts,
    getActiveCourts,
    getPendingCourts,
    getCourtById,
    updateCourtWorkingHours,
    approveCourt
  };
};
