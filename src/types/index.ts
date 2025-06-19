
export interface Notification {
  id: string;
  type: 'booking_confirmed' | 'booking_cancelled' | 'booking_reminder';
  title: string;
  message: string;
  bookingId: string;
  timestamp: Date;
  read: boolean;
}

export interface Booking {
  id: string;
  courtId: number;
  courtName: string;
  courtImage: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: BookingStatus;
  userId: string;
  createdAt: Date;
  rating?: Rating;
}

export interface Rating {
  id: string;
  bookingId: string;
  stars: number;
  comment: string;
  createdAt: Date;
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

export enum UserRole {
  USER = 'user',
  COURT_MANAGER = 'court_manager',
  ADMIN = 'admin'
}
