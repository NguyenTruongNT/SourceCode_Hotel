import { Room, Booking, RoomStatus, RoomType, HotelEvent, EventStatus, Voucher } from '@/app/admin/types';

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
  // Floor 2 - Standard (800,000 VND / đêm, sức chứa 2 người)
  { id: 'P201', floor: 2, type: RoomType.STANDARD, status: RoomStatus.EMPTY, price: 800000, capacity: 2 },
  { id: 'P202', floor: 2, type: RoomType.STANDARD, status: RoomStatus.OCCUPIED, currentBookingId: 'HST10234', price: 800000, capacity: 2 },
  { id: 'P203', floor: 2, type: RoomType.STANDARD, status: RoomStatus.CLEANING, price: 800000, capacity: 2 },
  { id: 'P204', floor: 2, type: RoomType.STANDARD, status: RoomStatus.EMPTY, price: 800000, capacity: 2 },
  { id: 'P205', floor: 2, type: RoomType.STANDARD, status: RoomStatus.BOOKED, currentBookingId: 'HST20345', price: 800000, capacity: 2 },
  { id: 'P206', floor: 2, type: RoomType.STANDARD, status: RoomStatus.OCCUPIED, currentBookingId: 'HST30456', price: 800000, capacity: 2 },
  { id: 'P207', floor: 2, type: RoomType.STANDARD, status: RoomStatus.EMPTY, price: 800000, capacity: 2 },
  { id: 'P208', floor: 2, type: RoomType.STANDARD, status: RoomStatus.EMPTY, price: 800000, capacity: 2 },

  // Floor 3 - Superior (1,200,000 VND / đêm, sức chứa 2 người)
  { id: 'P301', floor: 3, type: RoomType.SUPERIOR, status: RoomStatus.EMPTY, price: 1200000, capacity: 2 },
  { id: 'P302', floor: 3, type: RoomType.SUPERIOR, status: RoomStatus.EMPTY, price: 1200000, capacity: 2 },
  { id: 'P303', floor: 3, type: RoomType.SUPERIOR, status: RoomStatus.OCCUPIED, currentBookingId: 'HST40567', price: 1200000, capacity: 2 },
  { id: 'P304', floor: 3, type: RoomType.SUPERIOR, status: RoomStatus.EMPTY, price: 1200000, capacity: 2 },
  { id: 'P305', floor: 3, type: RoomType.SUPERIOR, status: RoomStatus.OCCUPIED, currentBookingId: 'HST50678', price: 1200000, capacity: 2 },
  { id: 'P306', floor: 3, type: RoomType.SUPERIOR, status: RoomStatus.CLEANING, price: 1200000, capacity: 2 },
  { id: 'P307', floor: 3, type: RoomType.SUPERIOR, status: RoomStatus.BOOKED, currentBookingId: 'HST60789', price: 1200000, capacity: 2 },
  { id: 'P308', floor: 3, type: RoomType.SUPERIOR, status: RoomStatus.EMPTY, price: 1200000, capacity: 2 },

  // Floor 4 - Deluxe (1,800,000 VND / đêm, sức chứa 3 người)
  { id: 'P401', floor: 4, type: RoomType.DELUXE, status: RoomStatus.EMPTY, price: 1800000, capacity: 3 },
  { id: 'P402', floor: 4, type: RoomType.DELUXE, status: RoomStatus.OCCUPIED, currentBookingId: 'HST70890', price: 1800000, capacity: 3 },
  { id: 'P403', floor: 4, type: RoomType.DELUXE, status: RoomStatus.EMPTY, price: 1800000, capacity: 3 },
  { id: 'P404', floor: 4, type: RoomType.DELUXE, status: RoomStatus.EMPTY, price: 1800000, capacity: 3 },
  { id: 'P405', floor: 4, type: RoomType.DELUXE, status: RoomStatus.OCCUPIED, currentBookingId: 'HST80901', price: 1800000, capacity: 3 },
  { id: 'P406', floor: 4, type: RoomType.DELUXE, status: RoomStatus.CLEANING, price: 1800000, capacity: 3 },
  { id: 'P407', floor: 4, type: RoomType.DELUXE, status: RoomStatus.EMPTY, price: 1800000, capacity: 3 },
  { id: 'P408', floor: 4, type: RoomType.DELUXE, status: RoomStatus.BOOKED, currentBookingId: 'HST90123', price: 1800000, capacity: 3 },

  // Floor 5 - Suite Luxury (3,500,000 VND / đêm, sức chứa 4 người)
  { id: 'P501', floor: 5, type: RoomType.SUITE, status: RoomStatus.OCCUPIED, currentBookingId: 'HST99001', price: 3500000, capacity: 4 },
  { id: 'P502', floor: 5, type: RoomType.SUITE, status: RoomStatus.EMPTY, price: 3500000, capacity: 4 },
  { id: 'P503', floor: 5, type: RoomType.SUITE, status: RoomStatus.EMPTY, price: 3500000, capacity: 4 },
  { id: 'P504', floor: 5, type: RoomType.SUITE, status: RoomStatus.BOOKED, currentBookingId: 'HST99002', price: 3500000, capacity: 4 },
];

export const INITIAL_BOOKINGS: Booking[] = [
  // Khách đang lưu trú (OCCUPIED / In-house)
  {
    id: 'HST10234',
    guestName: 'Nguyễn Văn Nam',
    phone: '0901234567',
    email: 'nam.nguyen@gmail.com',
    cccd: '001090123456',
    checkInDate: getRelativeDate(-2),
    checkOutDate: getRelativeDate(1),
    roomType: RoomType.STANDARD,
    roomNumber: 'P202',
    guestCount: 2,
    status: 'Checked-in',
    totalAmount: 2400000,
    depositAmount: 1200000,
    remainingAmount: 1200000,
    securityDeposit: 500000,
    keycardCode: 'A1B2C3D4',
    paidDeposit: true
  },
  {
    id: 'HST30456',
    guestName: 'Trần Thị Mai',
    phone: '0987654321',
    email: 'mai.tran@gmail.com',
    cccd: '001080654321',
    checkInDate: getRelativeDate(-1),
    checkOutDate: getRelativeDate(2),
    roomType: RoomType.STANDARD,
    roomNumber: 'P206',
    guestCount: 1,
    status: 'Checked-in',
    totalAmount: 2400000,
    depositAmount: 1200000,
    remainingAmount: 1200000,
    securityDeposit: 500000,
    keycardCode: 'E5F6G7H8',
    paidDeposit: true
  },
  {
    id: 'HST40567',
    guestName: 'Lê Hoàng Phong',
    phone: '0912345678',
    email: 'phong.le@gmail.com',
    cccd: '031085123456',
    checkInDate: getRelativeDate(-3),
    checkOutDate: getRelativeDate(0), // Trả phòng hôm nay
    roomType: RoomType.SUPERIOR,
    roomNumber: 'P303',
    guestCount: 2,
    status: 'Checked-in',
    totalAmount: 3600000,
    depositAmount: 1800000,
    remainingAmount: 1800000,
    securityDeposit: 500000,
    keycardCode: 'K1L2M3N4',
    paidDeposit: true
  },
  {
    id: 'HST50678',
    guestName: 'Phạm Thu Trang',
    phone: '0933445566',
    email: 'trang.pham@gmail.com',
    cccd: '042095112233',
    checkInDate: getRelativeDate(-1),
    checkOutDate: getRelativeDate(3),
    roomType: RoomType.SUPERIOR,
    roomNumber: 'P305',
    guestCount: 2,
    status: 'Checked-in',
    totalAmount: 4800000,
    depositAmount: 2400000,
    remainingAmount: 2400000,
    securityDeposit: 500000,
    keycardCode: 'P5Q6R7S8',
    paidDeposit: true
  },
  {
    id: 'HST70890',
    guestName: 'Đặng Quốc Bảo',
    phone: '0966778899',
    email: 'bao.dang@gmail.com',
    cccd: '079090112233',
    checkInDate: getRelativeDate(-4),
    checkOutDate: getRelativeDate(1),
    roomType: RoomType.DELUXE,
    roomNumber: 'P402',
    guestCount: 2,
    status: 'Checked-in',
    totalAmount: 9000000,
    depositAmount: 4500000,
    remainingAmount: 4500000,
    securityDeposit: 500000,
    keycardCode: 'T1U2V3W4',
    paidDeposit: true
  },
  {
    id: 'HST80901',
    guestName: 'Vũ Đức Đam',
    phone: '0944556677',
    email: 'dam.vu@gmail.com',
    cccd: '001070998877',
    checkInDate: getRelativeDate(0), // Nhận phòng hôm nay
    checkOutDate: getRelativeDate(2),
    roomType: RoomType.DELUXE,
    roomNumber: 'P405',
    guestCount: 1,
    status: 'Checked-in',
    totalAmount: 3600000,
    depositAmount: 1800000,
    remainingAmount: 1800000,
    securityDeposit: 500000,
    keycardCode: 'X1Y2Z3A4',
    paidDeposit: true
  },
  {
    id: 'HST99001',
    guestName: 'Nguyễn Tấn Dũng',
    phone: '0999888777',
    email: 'dung.nguyen@gmail.com',
    cccd: '031060554433',
    checkInDate: getRelativeDate(-1),
    checkOutDate: getRelativeDate(4),
    roomType: RoomType.SUITE,
    roomNumber: 'P501',
    guestCount: 4,
    status: 'Checked-in',
    totalAmount: 17500000,
    depositAmount: 8750000,
    remainingAmount: 8750000,
    securityDeposit: 500000,
    keycardCode: 'S9T8U7V6',
    paidDeposit: true
  },

  // Đơn đã đặt trước chờ Check-in (Confirmed / Upcoming)
  {
    id: 'HST20345',
    guestName: 'Lý Nhã Kỳ',
    phone: '0900112233',
    email: 'ky.ly@gmail.com',
    cccd: '001085223344',
    checkInDate: getRelativeDate(0), // Đến hôm nay chờ check-in
    checkOutDate: getRelativeDate(3),
    roomType: RoomType.STANDARD,
    roomNumber: 'P205',
    guestCount: 2,
    status: 'Confirmed',
    totalAmount: 2400000,
    depositAmount: 1200000,
    remainingAmount: 1200000,
    paidDeposit: true
  },
  {
    id: 'HST60789',
    guestName: 'Hồ Ngọc Hà',
    phone: '0911223344',
    email: 'ha.ho@gmail.com',
    cccd: '079084334455',
    checkInDate: getRelativeDate(0), // Đến hôm nay chờ check-in
    checkOutDate: getRelativeDate(2),
    roomType: RoomType.SUPERIOR,
    roomNumber: 'P307',
    guestCount: 2,
    status: 'Confirmed',
    totalAmount: 2400000,
    depositAmount: 1200000,
    remainingAmount: 1200000,
    paidDeposit: true
  },
  {
    id: 'HST90123',
    guestName: 'Đàm Vĩnh Hưng',
    phone: '0988776655',
    email: 'hung.dam@gmail.com',
    cccd: '001071445566',
    checkInDate: getRelativeDate(1),
    checkOutDate: getRelativeDate(4),
    roomType: RoomType.DELUXE,
    roomNumber: 'P408',
    guestCount: 2,
    status: 'Confirmed',
    totalAmount: 5400000,
    depositAmount: 2700000,
    remainingAmount: 2700000,
    paidDeposit: true
  },
  {
    id: 'HST99002',
    guestName: 'Trấn Thành',
    phone: '0922334455',
    email: 'thanh.tran@gmail.com',
    cccd: '079087556677',
    checkInDate: getRelativeDate(0),
    checkOutDate: getRelativeDate(2),
    roomType: RoomType.SUITE,
    roomNumber: 'P504',
    guestCount: 3,
    status: 'Confirmed',
    totalAmount: 7000000,
    depositAmount: 3500000,
    remainingAmount: 3500000,
    paidDeposit: true
  }
];

export const INITIAL_VOUCHERS: Voucher[] = [
  {
    id: 'VOUCHER-001',
    title: 'Chào đón thành viên mới HST Hotel',
    code: 'HST2026',
    percent: 15,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    quantity: 500,
    used: 28,
    status: 'Active'
  },
  {
    id: 'VOUCHER-002',
    title: 'Rực rỡ nắng hè - Ưu đãi giảm 20%',
    code: 'SUMMER20',
    percent: 20,
    startDate: '2026-05-01',
    endDate: '2026-09-30',
    quantity: 200,
    used: 64,
    status: 'Active'
  },
  {
    id: 'VOUCHER-003',
    title: 'Tri ân khách hàng thân thiết 10%',
    code: 'WELCOME10',
    percent: 10,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    quantity: 1000,
    used: 142,
    status: 'Active'
  },
  {
    id: 'VOUCHER-004',
    title: 'Khuyến mãi mùa xuân đầu năm',
    code: 'EXPIRED50',
    percent: 50,
    startDate: '2026-01-01',
    endDate: '2026-02-15',
    quantity: 50,
    used: 50,
    status: 'Expired'
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
