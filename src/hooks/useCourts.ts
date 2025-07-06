import { useState } from 'react';
import { Court, WorkingHours, SportType } from '@/types';

const mockCourts: Court[] = [
  {
    id: '1',
    name: 'No Alvo Society',
    description: 'Quadra society com grama sintética de alta qualidade, vestiários completos e estacionamento gratuito para todos os clientes.',
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
    images: [
      'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?w=600&h=400&fit=crop'
    ],
    sports: [SportType.FOOTBALL, SportType.FUTSAL],
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
  },
  {
    id: '2',
    name: 'Gol de Placa',
    description: 'Quadra profissional de futebol society com iluminação LED e bar completo para confraternizações.',
    location: {
      address: 'Avenida Beira Mar, 456',
      city: 'Fortaleza',
      state: 'CE',
      zipCode: '60165-000',
      lat: -3.731862,
      lng: -38.526669
    },
    ownerId: 'manager-2',
    ownerName: 'Maria Santos',
    images: [
      'https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=600&h=400&fit=crop'
    ],
    sports: [SportType.FOOTBALL, SportType.FUTSAL],
    amenities: ['Vestiário', 'Bar', 'Iluminação', 'Estacionamento'],
    hourlyRate: 150,
    status: 'active',
    rating: 4.9,
    totalReviews: 63,
    workingHours: {
      monday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      tuesday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      wednesday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      thursday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      friday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      saturday: { isOpen: true, openTime: '08:00', closeTime: '22:00' },
      sunday: { isOpen: true, openTime: '08:00', closeTime: '20:00' }
    },
    isVerified: true,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-06-20')
  },
  {
    id: '3',
    name: 'Arena Pro Sports',
    description: 'Complexo esportivo com quadra de basquete profissional, academia e área de convivência.',
    location: {
      address: 'Rua das Palmeiras, 789',
      city: 'Fortaleza',
      state: 'CE',
      zipCode: '60175-000',
      lat: -3.731862,
      lng: -38.526669
    },
    ownerId: 'manager-3',
    ownerName: 'Carlos Oliveira',
    images: [
      'https://images.unsplash.com/photo-1544989164-44a5ba64d0c6?w=600&h=400&fit=crop'
    ],
    sports: [SportType.BASKETBALL, SportType.VOLLEYBALL],
    amenities: ['Vestiário', 'Academia', 'Estacionamento', 'Chuveiro'],
    hourlyRate: 200,
    status: 'inactive',
    rating: 4.7,
    totalReviews: 38,
    unavailabilityReason: 'Manutenção preventiva da quadra - Previsão de retorno: 02/01/2025',
    workingHours: {
      monday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      saturday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
      sunday: { isOpen: false, openTime: '08:00', closeTime: '20:00' }
    },
    isVerified: true,
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-06-18')
  },
  {
    id: '4',
    name: 'Sport Center Elite',
    description: 'Centro esportivo completo com múltiplas modalidades e infraestrutura premium.',
    location: {
      address: 'Avenida Santos Dumont, 321',
      city: 'Fortaleza',
      state: 'CE',
      zipCode: '60150-000',
      lat: -3.731862,
      lng: -38.526669
    },
    ownerId: 'manager-4',
    ownerName: 'Ana Costa',
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1556909191-f6e405073de9?w=600&h=400&fit=crop'
    ],
    sports: [SportType.TENNIS, SportType.VOLLEYBALL, SportType.BASKETBALL],
    amenities: ['Vestiário', 'Estacionamento', 'Chuveiro', 'Bar', 'Loja de Equipamentos'],
    hourlyRate: 180,
    status: 'pending_approval',
    rating: 4.6,
    totalReviews: 25,
    workingHours: {
      monday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      saturday: { isOpen: true, openTime: '07:00', closeTime: '20:00' },
      sunday: { isOpen: true, openTime: '08:00', closeTime: '18:00' }
    },
    isVerified: false,
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-06-21')
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

  const getInactiveCourts = () => {
    return courts.filter(court => court.status === 'inactive');
  };

  const getCourtById = (id: string) => {
    return courts.find(court => court.id === id);
  };

  const updateCourtStatus = (courtId: string, status: 'active' | 'inactive' | 'pending_approval', reason?: string) => {
    setCourts(prev =>
      prev.map(court =>
        court.id === courtId
          ? { 
              ...court, 
              status, 
              unavailabilityReason: status === 'inactive' ? reason : undefined,
              updatedAt: new Date() 
            }
          : court
      )
    );
  };

  const updateCourtPricing = (courtId: string, hourlyRate: number) => {
    setCourts(prev =>
      prev.map(court =>
        court.id === courtId
          ? { ...court, hourlyRate, updatedAt: new Date() }
          : court
      )
    );
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

  const updateCourtAmenities = (courtId: string, amenities: string[]) => {
    setCourts(prev =>
      prev.map(court =>
        court.id === courtId
          ? { ...court, amenities, updatedAt: new Date() }
          : court
      )
    );
  };

  const approveCourt = (courtId: string) => {
    setCourts(prev =>
      prev.map(court =>
        court.id === courtId
          ? { ...court, status: 'active' as const, isVerified: true, updatedAt: new Date() }
          : court
      )
    );
  };

  const rejectCourt = (courtId: string, reason: string) => {
    setCourts(prev =>
      prev.filter(court => court.id !== courtId)
    );
  };

  const getCourtsByManager = (managerId: string) => {
    return courts.filter(court => court.ownerId === managerId);
  };

  return {
    courts,
    getActiveCourts,
    getPendingCourts,
    getInactiveCourts,
    getCourtById,
    getCourtsByManager,
    updateCourtStatus,
    updateCourtPricing,
    updateCourtWorkingHours,
    updateCourtAmenities,
    approveCourt,
    rejectCourt
  };
};
