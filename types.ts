
export enum UserRole {
  Driver = 'driver',
  Host = 'host',
}

export enum View {
  Dashboard = 'dashboard',
  Map = 'map',
  Bookings = 'bookings',
  Chargers = 'chargers',
  Profile = 'profile',
}

export enum ChargerType {
  Type1 = 'Type 1 (J1772)',
  Type2 = 'Type 2 (Mennekes)',
  CCS = 'CCS',
  CHAdeMO = 'CHAdeMO',
}

export enum BookingStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  roles: UserRole[];
}

export interface HostProfile {
  id: string;
  userId: string;
  bankInfo: string; // Simplified for MVP
}

export interface Availability {
  dayOfWeek: number; // 0 for Sunday, 6 for Saturday
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export interface ChargingPoint {
  id: string;
  hostId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  chargerType: ChargerType;
  pricePerHour: number; // In CLP
  availability: Availability[];
  rating: number;
  reviewCount: number;
  imageUrl: string;
}

export interface Booking {
  id: string;
  userId: string;
  chargerId: string;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  totalCost: number; // In CLP
}

export interface Review {
  id: string;
  bookingId: string;
  rating: number;
  comment: string;
  from: 'driver' | 'host';
}

export interface ChatMessage {
    sender: 'user' | 'assistant';
    text: string;
}
