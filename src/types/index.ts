
export interface Notification {
  id: string;
  type: 'booking_confirmed' | 'booking_cancelled' | 'booking_reminder' | 'system_alert' | 'promotion';
  title: string;
  message: string;
  bookingId?: string;
  timestamp: Date;
  read: boolean;
  userId: string;
}

export interface Court {
  id: string;
  name: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    lat: number;
    lng: number;
  };
  ownerId: string;
  ownerName: string;
  images: string[];
  sports: SportType[];
  amenities: string[];
  hourlyRate: number;
  status: 'active' | 'inactive' | 'maintenance' | 'pending_approval';
  rating: number;
  totalReviews: number;
  workingHours: WorkingHours;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  breakTime?: {
    start: string;
    end: string;
  };
}

export interface Booking {
  id: string;
  courtId: string;
  courtName: string;
  courtImage: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalPrice: number;
  serviceFee: number;
  status: BookingStatus;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  numberOfPlayers: number;
  observations?: string;
  needsEquipment: boolean;
  createdAt: Date;
  rating?: Rating;
  cancellationReason?: string;
}

export interface Rating {
  id: string;
  bookingId: string;
  userId: string;
  courtId: string;
  stars: number;
  comment: string;
  photos?: string[];
  createdAt: Date;
  helpful: number;
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show'
}

export enum UserRole {
  USER = 'user',
  COURT_MANAGER = 'court_manager',
  ADMIN = 'admin'
}

export enum SportType {
  FOOTBALL = 'football',
  FUTSAL = 'futsal',
  VOLLEYBALL = 'volleyball',
  BASKETBALL = 'basketball',
  TENNIS = 'tennis',
  PADEL = 'padel'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  createdAt: Date;
  lastLogin?: Date;
  googleCalendarConnected?: boolean;
  preferences?: UserPreferences;
  stats?: UserStats;
}

export interface UserPreferences {
  favoriteLocations: string[];
  preferredSports: SportType[];
  maxDistance: number;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    showProfile: boolean;
    allowReviews: boolean;
  };
}

export interface UserStats {
  totalBookings: number;
  completedGames: number;
  cancelledGames: number;
  averageRating: number;
  totalSpent: number;
  favoriteCourtId?: string;
}

export interface PlatformStats {
  totalUsers: number;
  totalCourts: number;
  totalBookings: number;
  monthlyRevenue: number;
  activeUsers: number;
  pendingApprovals: number;
  averageRating: number;
  growthRate: number;
}

export interface ReportData {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  data: {
    date: string;
    bookings: number;
    revenue: number;
    newUsers: number;
    newCourts: number;
  }[];
}

export interface Complaint {
  id: string;
  userId: string;
  courtId?: string;
  bookingId?: string;
  type: 'service' | 'payment' | 'technical' | 'other';
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
}
