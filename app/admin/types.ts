export enum RoomStatus {
  EMPTY = 'EMPTY',
  BOOKED = 'BOOKED',
  OCCUPIED = 'OCCUPIED',
  CLEANING = 'CLEANING'
}

export enum RoomType {
  STANDARD = 'Standard',
  DELUXE = 'Deluxe',
  SUPERIOR = 'Superior',
  SUITE = 'Suite'
}

export interface Booking {
  id: string;
  guestName: string;
  phone: string;
  email?: string;
  checkInDate: string;
  checkOutDate: string;
  roomType: RoomType;
  roomNumber?: string;
  guestCount: number;
  cccd?: string;
  isWalkIn?: boolean;
  earlyCheckInStatus?: string;
  earlyCheckInFee?: number;
}

export interface Room {
  id: string;
  floor: number;
  type: RoomType;
  status: RoomStatus;
  currentBookingId?: string;
}

export enum EventStatus {
  ACTIVE = 'ACTIVE',
  SCHEDULED = 'SCHEDULED',
  INACTIVE = 'INACTIVE'
}

export interface HotelEvent {
  id: string;
  title: string;
  shortDesc: string;
  type: string;
  status: EventStatus;
  views: number;
  image: string;
  link: string;
  isScheduled?: boolean;
  publishDate?: string;
  startDate?: string;
  endDate?: string;
  maxPeople?: number;
  discountPercent?: number;
}
