export enum RoomStatus {
  EMPTY = 'EMPTY',
  BOOKED = 'BOOKED',
  OCCUPIED = 'OCCUPIED',
  CLEANING = 'CLEANING',
  MAINTENANCE = 'MAINTENANCE'
}

export enum RoomType {
  STANDARD = 'Standard',
  SUPERIOR = 'Superior',
  DELUXE = 'Deluxe',
  SUITE = 'Suite'
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Checked-in' | 'Checked-out' | 'Cancelled';

export interface Booking {
  id: string; // PNR: HSTxxxxx
  guestName: string;
  phone: string;
  email?: string;
  cccd?: string; // 12 digits or Passport
  checkInDate: string;
  checkOutDate: string;
  roomType: RoomType;
  roomNumber?: string;
  guestCount: number;
  status?: BookingStatus;
  isWalkIn?: boolean;
  totalAmount?: number;
  depositAmount?: number; // 50%
  remainingAmount?: number;
  voucherCode?: string;
  voucherDiscount?: number;
  paymentMethod?: string;
  paidDeposit?: boolean;
  securityDeposit?: number; // cọc tài sản >= 500,000 VND
  keycardCode?: string; // mã thẻ từ hex
  earlyCheckInStatus?: string;
  earlyCheckInFee?: number;
  actualCheckInTime?: string;
  actualCheckOutTime?: string;
  lateCheckOutFee?: number;
  minibarUsage?: {
    water?: number;
    softDrink?: number;
    beer?: number;
    snack?: number;
  };
  damageFee?: number;
  finalTotal?: number;
}

export interface Room {
  id: string; // Pxxx (e.g. P201, P302)
  floor: number;
  type: RoomType;
  status: RoomStatus;
  price: number;
  capacity: number;
  image?: string;
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

export interface Voucher {
  id: string;
  title: string;
  code: string; // 4-15 alphanumeric uppercase
  percent: number; // 1-70%
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  quantity: number; // 1-10000
  used: number;
  status: 'Active' | 'Expired' | 'Suspended';
}
