import { Room, Booking, RoomStatus, RoomType, HotelEvent, EventStatus } from '@/app/admin/types';

// Utility to generate dates
const today = new Date();
const formatDate = (date: Date) => {
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

const getRelativeDate = (daysOffset: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + daysOffset);
  return formatDate(d);
};

export const INITIAL_ROOMS: Room[] = [
  // Floor 2 - Standard
  { id: '201', floor: 2, type: RoomType.STANDARD, status: RoomStatus.EMPTY },
  { id: '202', floor: 2, type: RoomType.STANDARD, status: RoomStatus.OCCUPIED, currentBookingId: 'B-001' },
  { id: '203', floor: 2, type: RoomType.STANDARD, status: RoomStatus.CLEANING },
  { id: '204', floor: 2, type: RoomType.STANDARD, status: RoomStatus.EMPTY },
  { id: '205', floor: 2, type: RoomType.STANDARD, status: RoomStatus.BOOKED, currentBookingId: 'B-002' },
  { id: '206', floor: 2, type: RoomType.STANDARD, status: RoomStatus.OCCUPIED, currentBookingId: 'B-003' },
  { id: '207', floor: 2, type: RoomType.STANDARD, status: RoomStatus.EMPTY },
  { id: '208', floor: 2, type: RoomType.STANDARD, status: RoomStatus.EMPTY },

  // Floor 3 - Superior
  { id: '301', floor: 3, type: RoomType.SUPERIOR, status: RoomStatus.EMPTY },
  { id: '302', floor: 3, type: RoomType.SUPERIOR, status: RoomStatus.EMPTY },
  { id: '303', floor: 3, type: RoomType.SUPERIOR, status: RoomStatus.OCCUPIED, currentBookingId: 'B-004' },
  { id: '304', floor: 3, type: RoomType.SUPERIOR, status: RoomStatus.EMPTY },
  { id: '305', floor: 3, type: RoomType.SUPERIOR, status: RoomStatus.OCCUPIED, currentBookingId: 'B-005' },
  { id: '306', floor: 3, type: RoomType.SUPERIOR, status: RoomStatus.MAINTENANCE },
  { id: '307', floor: 3, type: RoomType.SUPERIOR, status: RoomStatus.BOOKED, currentBookingId: 'B-006' },
  { id: '308', floor: 3, type: RoomType.SUPERIOR, status: RoomStatus.EMPTY },

  // Floor 4 - Deluxe
  { id: '401', floor: 4, type: RoomType.DELUXE, status: RoomStatus.EMPTY },
  { id: '402', floor: 4, type: RoomType.DELUXE, status: RoomStatus.OCCUPIED, currentBookingId: 'B-007' },
  { id: '403', floor: 4, type: RoomType.DELUXE, status: RoomStatus.EMPTY },
  { id: '404', floor: 4, type: RoomType.DELUXE, status: RoomStatus.EMPTY },
  { id: '405', floor: 4, type: RoomType.DELUXE, status: RoomStatus.OCCUPIED, currentBookingId: 'B-008' },
  { id: '406', floor: 4, type: RoomType.DELUXE, status: RoomStatus.CLEANING },
  { id: '407', floor: 4, type: RoomType.DELUXE, status: RoomStatus.EMPTY },
  { id: '408', floor: 4, type: RoomType.DELUXE, status: RoomStatus.BOOKED, currentBookingId: 'B-009' },

  // Floor 5 - Suite
  { id: '501', floor: 5, type: RoomType.SUITE, status: RoomStatus.OCCUPIED, currentBookingId: 'B-010' },
  { id: '502', floor: 5, type: RoomType.SUITE, status: RoomStatus.EMPTY },
  { id: '503', floor: 5, type: RoomType.SUITE, status: RoomStatus.EMPTY },
  { id: '504', floor: 5, type: RoomType.SUITE, status: RoomStatus.BOOKED, currentBookingId: 'B-011' },
];

export const INITIAL_BOOKINGS: Booking[] = [
  // OCCUPIED BOOKINGS
  {
    id: 'B-001',
    guestName: 'Nguyễn Văn Nam',
    phone: '0901234567',
    checkInDate: getRelativeDate(-2),
    checkOutDate: getRelativeDate(1),
    roomType: RoomType.STANDARD,
    roomNumber: '202',
    guestCount: 2,
    cccd: '001090123456'
  },
  {
    id: 'B-003',
    guestName: 'Trần Thị Mai',
    phone: '0987654321',
    checkInDate: getRelativeDate(-1),
    checkOutDate: getRelativeDate(2),
    roomType: RoomType.STANDARD,
    roomNumber: '206',
    guestCount: 1,
    cccd: '001080654321'
  },
  {
    id: 'B-004',
    guestName: 'Lê Hoàng Phong',
    phone: '0912345678',
    checkInDate: getRelativeDate(-3),
    checkOutDate: getRelativeDate(0), // Checkout today
    roomType: RoomType.SUPERIOR,
    roomNumber: '303',
    guestCount: 2,
    cccd: '031085123456'
  },
  {
    id: 'B-005',
    guestName: 'Phạm Thu Trang',
    phone: '0933445566',
    checkInDate: getRelativeDate(-1),
    checkOutDate: getRelativeDate(3),
    roomType: RoomType.SUPERIOR,
    roomNumber: '305',
    guestCount: 2,
    cccd: '042095112233'
  },
  {
    id: 'B-007',
    guestName: 'Đặng Quốc Bảo',
    phone: '0966778899',
    checkInDate: getRelativeDate(-4),
    checkOutDate: getRelativeDate(1),
    roomType: RoomType.DELUXE,
    roomNumber: '402',
    guestCount: 2,
    cccd: '079090112233'
  },
  {
    id: 'B-008',
    guestName: 'Vũ Đức Đam',
    phone: '0944556677',
    checkInDate: getRelativeDate(0), // Check-in today
    checkOutDate: getRelativeDate(2),
    roomType: RoomType.DELUXE,
    roomNumber: '405',
    guestCount: 1,
    cccd: '001070998877'
  },
  {
    id: 'B-010',
    guestName: 'Nguyễn Tấn Dũng',
    phone: '0999888777',
    checkInDate: getRelativeDate(-1),
    checkOutDate: getRelativeDate(4),
    roomType: RoomType.SUITE,
    roomNumber: '501',
    guestCount: 4,
    cccd: '031060554433'
  },

  // BOOKED (Upcoming)
  {
    id: 'B-002',
    guestName: 'Lý Nhã Kỳ',
    phone: '0900112233',
    checkInDate: getRelativeDate(1), // Check-in tomorrow
    checkOutDate: getRelativeDate(5),
    roomType: RoomType.STANDARD,
    guestCount: 1,
  },
  {
    id: 'B-006',
    guestName: 'Hồ Ngọc Hà',
    phone: '0911223344',
    checkInDate: getRelativeDate(0), // Check-in today
    checkOutDate: getRelativeDate(2),
    roomType: RoomType.SUPERIOR,
    guestCount: 2,
  },
  {
    id: 'B-009',
    guestName: 'Đàm Vĩnh Hưng',
    phone: '0988776655',
    checkInDate: getRelativeDate(2),
    checkOutDate: getRelativeDate(4),
    roomType: RoomType.DELUXE,
    guestCount: 2,
  },
  {
    id: 'B-011',
    guestName: 'Trấn Thành',
    phone: '0922334455',
    checkInDate: getRelativeDate(0),
    checkOutDate: getRelativeDate(1),
    roomType: RoomType.SUITE,
    guestCount: 3,
  }
];

export const INITIAL_EVENTS: HotelEvent[] = [
  { 
    id: 'EV-001', 
    title: 'Sự kiện: Summer Wedding', 
    shortDesc: 'Tổ chức tiệc cưới trong mơ bên bờ biển thơ mộng với gói dịch vụ trọn gói đẳng cấp.', 
    type: 'Sự kiện', 
    status: EventStatus.ACTIVE, 
    views: 1250,
    image: '/images/hero-hotel.png',
    link: '/events/ev-001'
  },
  { 
    id: 'EV-002', 
    title: 'Ưu đãi: Giảm ngay 20%', 
    shortDesc: 'Áp dụng mã SUMMER20 để nhận ưu đãi giảm giá 20% cho tất cả các dịch vụ Spa và thư giãn.', 
    type: 'Ưu đãi', 
    status: EventStatus.ACTIVE, 
    views: 3420,
    image: '/images/exp-spa.png',
    link: '/events/ev-002'
  },
  { 
    id: 'EV-003', 
    title: 'Tiệc nướng BBQ bãi biển', 
    shortDesc: 'Thưởng thức hải sản tươi sống và không gian âm nhạc sống động vào mỗi tối thứ Bảy.', 
    type: 'Sự kiện', 
    status: EventStatus.ACTIVE, 
    views: 890,
    image: '/images/exp-dining.png',
    link: '/events/ev-003'
  }
];
