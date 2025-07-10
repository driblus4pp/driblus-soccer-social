import { useState } from 'react';
import { Court, WorkingHours, SportType } from '@/types';

const mockCourts: Court[] = [
  // No Alvo Centro - 2 quadras
  {
    id: 'alvo-centro-1',
    name: 'No Alvo Centro - Quadra 1',
    description: 'Quadra society com grama sintética de alta qualidade, vestiários completos e estacionamento gratuito. Localizada no coração da cidade.',
    location: {
      address: 'Rua Major Facundo, 123',
      city: 'Fortaleza',
      state: 'CE',
      zipCode: '60120-000',
      lat: -3.731862,
      lng: -38.526669
    },
    ownerId: 'manager-alvo',
    ownerName: 'No Alvo Society',
    images: [
      '/lovable-uploads/844a5c8f-2d19-412b-bf9a-72a8ca229731.png',
      '/lovable-uploads/948fc8dd-5540-401e-bd96-454de6744259.png',
      '/lovable-uploads/9e9f18a9-56b6-4ab9-af6f-542bd962c4a5.png'
    ],
    sports: [SportType.FOOTBALL, SportType.FUTSAL],
    amenities: ['Vestiário', 'Estacionamento', 'Chuveiro', 'Iluminação', 'Bar'],
    hourlyRate: 120,
    status: 'active',
    rating: 4.8,
    totalReviews: 47,
    workingHours: {
      monday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      tuesday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      wednesday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      thursday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      friday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      saturday: { isOpen: true, openTime: '07:00', closeTime: '23:00' },
      sunday: { isOpen: true, openTime: '07:00', closeTime: '22:00' }
    },
    isVerified: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-20')
  },
  {
    id: 'alvo-centro-2',
    name: 'No Alvo Centro - Quadra 2',
    description: 'Segunda quadra society do complexo central, com mesmo padrão de qualidade e infraestrutura completa.',
    location: {
      address: 'Rua Major Facundo, 123',
      city: 'Fortaleza',
      state: 'CE',
      zipCode: '60120-000',
      lat: -3.731862,
      lng: -38.526669
    },
    ownerId: 'manager-alvo',
    ownerName: 'No Alvo Society',
    images: [
      '/lovable-uploads/948fc8dd-5540-401e-bd96-454de6744259.png',
      '/lovable-uploads/9e9f18a9-56b6-4ab9-af6f-542bd962c4a5.png',
      '/lovable-uploads/844a5c8f-2d19-412b-bf9a-72a8ca229731.png'
    ],
    sports: [SportType.FOOTBALL, SportType.FUTSAL],
    amenities: ['Vestiário', 'Estacionamento', 'Chuveiro', 'Iluminação', 'Bar'],
    hourlyRate: 120,
    status: 'active',
    rating: 4.7,
    totalReviews: 38,
    workingHours: {
      monday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      tuesday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      wednesday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      thursday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      friday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      saturday: { isOpen: true, openTime: '07:00', closeTime: '23:00' },
      sunday: { isOpen: true, openTime: '07:00', closeTime: '22:00' }
    },
    isVerified: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-20')
  },
  // No Alvo Sul - 2 quadras
  {
    id: 'alvo-sul-1',
    name: 'No Alvo Sul - Quadra 1',
    description: 'Quadra society localizada na zona sul de Fortaleza, com grama sintética e excelente infraestrutura.',
    location: {
      address: 'Avenida Washington Soares, 456',
      city: 'Fortaleza',
      state: 'CE',
      zipCode: '60811-000',
      lat: -3.774010,
      lng: -38.480500
    },
    ownerId: 'manager-alvo',
    ownerName: 'No Alvo Society',
    images: [
      '/lovable-uploads/9e9f18a9-56b6-4ab9-af6f-542bd962c4a5.png',
      '/lovable-uploads/844a5c8f-2d19-412b-bf9a-72a8ca229731.png'
    ],
    sports: [SportType.FOOTBALL, SportType.FUTSAL],
    amenities: ['Vestiário', 'Estacionamento', 'Chuveiro', 'Iluminação'],
    hourlyRate: 110,
    status: 'active',
    rating: 4.6,
    totalReviews: 32,
    workingHours: {
      monday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      tuesday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      wednesday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      thursday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      friday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      saturday: { isOpen: true, openTime: '07:00', closeTime: '23:00' },
      sunday: { isOpen: true, openTime: '07:00', closeTime: '22:00' }
    },
    isVerified: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-12-20')
  },
  {
    id: 'alvo-sul-2',
    name: 'No Alvo Sul - Quadra 2',
    description: 'Quadra poliesportiva com piso adaptado para futsal e outras modalidades esportivas.',
    location: {
      address: 'Avenida Washington Soares, 456',
      city: 'Fortaleza',
      state: 'CE',
      zipCode: '60811-000',
      lat: -3.774010,
      lng: -38.480500
    },
    ownerId: 'manager-alvo',
    ownerName: 'No Alvo Society',
    images: [
      '/lovable-uploads/948fc8dd-5540-401e-bd96-454de6744259.png',
      '/lovable-uploads/844a5c8f-2d19-412b-bf9a-72a8ca229731.png'
    ],
    sports: [SportType.FUTSAL, SportType.BASKETBALL],
    amenities: ['Vestiário', 'Estacionamento', 'Chuveiro', 'Iluminação'],
    hourlyRate: 100,
    status: 'active',
    rating: 4.5,
    totalReviews: 28,
    workingHours: {
      monday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      tuesday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      wednesday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      thursday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      friday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      saturday: { isOpen: true, openTime: '07:00', closeTime: '23:00' },
      sunday: { isOpen: true, openTime: '07:00', closeTime: '22:00' }
    },
    isVerified: true,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-12-20')
  },
  // No Alvo Norte - 2 quadras
  {
    id: 'alvo-norte-1',
    name: 'No Alvo Norte - Quadra 1',
    description: 'Quadra de tênis profissional com piso adaptado e rede oficial, localizada na zona norte.',
    location: {
      address: 'Rua José Jatahy, 789',
      city: 'Fortaleza',
      state: 'CE',
      zipCode: '60040-000',
      lat: -3.710000,
      lng: -38.540000
    },
    ownerId: 'manager-alvo',
    ownerName: 'No Alvo Society',
    images: [
      '/lovable-uploads/844a5c8f-2d19-412b-bf9a-72a8ca229731.png',
      '/lovable-uploads/948fc8dd-5540-401e-bd96-454de6744259.png'
    ],
    sports: [SportType.TENNIS],
    amenities: ['Vestiário', 'Estacionamento', 'Chuveiro', 'Iluminação', 'Loja de Equipamentos'],
    hourlyRate: 80,
    status: 'active',
    rating: 4.4,
    totalReviews: 19,
    workingHours: {
      monday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      saturday: { isOpen: true, openTime: '07:00', closeTime: '20:00' },
      sunday: { isOpen: true, openTime: '08:00', closeTime: '18:00' }
    },
    isVerified: true,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-12-20')
  },
  {
    id: 'alvo-norte-2',
    name: 'No Alvo Norte - Quadra 2',
    description: 'Quadra de basquete coberta com piso oficial e cestas profissionais para competições.',
    location: {
      address: 'Rua José Jatahy, 789',
      city: 'Fortaleza',
      state: 'CE',
      zipCode: '60040-000',
      lat: -3.710000,
      lng: -38.540000
    },
    ownerId: 'manager-alvo',
    ownerName: 'No Alvo Society',
    images: [
      '/lovable-uploads/9e9f18a9-56b6-4ab9-af6f-542bd962c4a5.png',
      '/lovable-uploads/948fc8dd-5540-401e-bd96-454de6744259.png'
    ],
    sports: [SportType.BASKETBALL],
    amenities: ['Vestiário', 'Estacionamento', 'Chuveiro', 'Iluminação'],
    hourlyRate: 90,
    status: 'active',
    rating: 4.3,
    totalReviews: 24,
    workingHours: {
      monday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      saturday: { isOpen: true, openTime: '07:00', closeTime: '20:00' },
      sunday: { isOpen: true, openTime: '08:00', closeTime: '18:00' }
    },
    isVerified: true,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-12-20')
  },
  // Arena Cangaço - 3 quadras
  {
    id: 'arena-futebol',
    name: 'Arena Cangaço - Futebol Society',
    description: 'Quadra de futebol society com grama sintética de última geração e iluminação LED profissional.',
    location: {
      address: 'Rua do Cangaço, 500',
      city: 'Fortaleza',
      state: 'CE',
      zipCode: '60356-000',
      lat: -3.745000,
      lng: -38.505000
    },
    ownerId: 'manager-arena',
    ownerName: 'Arena Cangaço',
    images: [
      '/lovable-uploads/844a5c8f-2d19-412b-bf9a-72a8ca229731.png',
      '/lovable-uploads/948fc8dd-5540-401e-bd96-454de6744259.png'
    ],
    sports: [SportType.FOOTBALL, SportType.FUTSAL],
    amenities: ['Vestiário', 'Estacionamento', 'Chuveiro', 'Iluminação', 'Bar'],
    hourlyRate: 140,
    status: 'active',
    rating: 4.7,
    totalReviews: 55,
    workingHours: {
      monday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
      saturday: { isOpen: true, openTime: '08:00', closeTime: '22:00' },
      sunday: { isOpen: true, openTime: '08:00', closeTime: '20:00' }
    },
    isVerified: true,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-12-20')
  },
  {
    id: 'arena-volei',
    name: 'Arena Cangaço - Vôlei de Praia',
    description: 'Quadra de vôlei de praia com areia oficial e rede profissional. Ambiente beach club completo.',
    location: {
      address: 'Rua do Cangaço, 500',
      city: 'Fortaleza',
      state: 'CE',
      zipCode: '60356-000',
      lat: -3.745000,
      lng: -38.505000
    },
    ownerId: 'manager-arena',
    ownerName: 'Arena Cangaço',
    images: [
      '/lovable-uploads/a9b4f323-9c73-4fa1-9684-514b7ff7aff2.png',
      '/lovable-uploads/23e0408a-0795-41f0-a4be-e0b16f52f7ff.png'
    ],
    sports: [SportType.VOLLEYBALL],
    amenities: ['Vestiário', 'Estacionamento', 'Chuveiro', 'Bar', 'Deck'],
    hourlyRate: 100,
    status: 'active',
    rating: 4.8,
    totalReviews: 42,
    workingHours: {
      monday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
      saturday: { isOpen: true, openTime: '08:00', closeTime: '22:00' },
      sunday: { isOpen: true, openTime: '08:00', closeTime: '20:00' }
    },
    isVerified: true,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-12-20')
  },
  {
    id: 'arena-tennis',
    name: 'Arena Cangaço - Beach Tennis',
    description: 'Quadra de beach tennis com areia especial e rede oficial. Perfeita para treinos e competições.',
    location: {
      address: 'Rua do Cangaço, 500',
      city: 'Fortaleza',
      state: 'CE',
      zipCode: '60356-000',
      lat: -3.745000,
      lng: -38.505000
    },
    ownerId: 'manager-arena',
    ownerName: 'Arena Cangaço',
    images: [
      '/lovable-uploads/23e0408a-0795-41f0-a4be-e0b16f52f7ff.png',
      '/lovable-uploads/a9b4f323-9c73-4fa1-9684-514b7ff7aff2.png'
    ],
    sports: [SportType.TENNIS],
    amenities: ['Vestiário', 'Estacionamento', 'Chuveiro', 'Bar', 'Deck'],
    hourlyRate: 80,
    status: 'active',
    rating: 4.6,
    totalReviews: 31,
    workingHours: {
      monday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
      saturday: { isOpen: true, openTime: '08:00', closeTime: '22:00' },
      sunday: { isOpen: true, openTime: '08:00', closeTime: '20:00' }
    },
    isVerified: true,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-12-20')
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
