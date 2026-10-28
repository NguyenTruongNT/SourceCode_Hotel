'use strict';

/**
 * ==============================================================================
 * HOTEL MANAGEMENT SYSTEM - BACKEND SELF-TEST & FRONTEND COMPATIBILITY AUDIT
 * ==============================================================================
 * Kịch bản tự kiểm thử tự động:
 * 1. Kiểm tra tính đúng đắn của toàn bộ 6 module Backend (Services & Controllers)
 * 2. Đối soát dữ liệu thực tế từ State/Form trên Frontend với kỳ vọng Backend
 * 3. Tổng hợp báo cáo tương thích chi tiết phục vụ kiểm thử và báo cáo đồ án
 * ==============================================================================
 */

const searchService = require('./services/search.service');
const bookingService = require('./services/booking.service');
const checkinService = require('./services/checkin.service');
const checkoutService = require('./services/checkout.service');
const roomService = require('./services/room.service');
const voucherService = require('./services/voucher.service');

const searchController = require('./controllers/search.controller');
const bookingController = require('./controllers/booking.controller');
const checkinController = require('./controllers/checkin.controller');
const checkoutController = require('./controllers/checkout.controller');
const roomController = require('./controllers/room.controller');
const voucherController = require('./controllers/voucher.controller');

// Helper giả lập Request/Response của Express Controller
function createMockReqRes(body = {}) {
  const req = { body };
  const res = {
    statusCode: 200,
    data: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.data = payload;
      return this;
    },
  };
  return { req, res };
}

// Bảng màu terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
};

let passCount = 0;
let failCount = 0;
const compatibilityNotes = [];

function assertTest(name, condition, details = '') {
  if (condition) {
    passCount++;
    console.log(`  ${colors.green}✔ PASS:${colors.reset} ${name}`);
    if (details) console.log(`         ${colors.gray}${details}${colors.reset}`);
  } else {
    failCount++;
    console.log(`  ${colors.red}✖ FAIL:${colors.reset} ${name}`);
    if (details) console.log(`         ${colors.yellow}Lỗi: ${details}${colors.reset}`);
  }
}

function noteAudit(feature, status, message, suggestion = '') {
  compatibilityNotes.push({ feature, status, message, suggestion });
}

console.log(`${colors.cyan}${colors.bright}================================================================================${colors.reset}`);
console.log(`${colors.cyan}${colors.bright}           BẮT ĐẦU CHẠY SELF-TEST BACKEND & ĐỐI SOÁT FRONTEND                    ${colors.reset}`);
console.log(`${colors.cyan}${colors.bright}================================================================================${colors.reset}\n`);

// ==============================================================================
// 1. MODULE SEARCH & ROOM AVAILABILITY (f1.js / search.service.js)
// ==============================================================================
console.log(`${colors.blue}${colors.bright}[1/6] KIỂM THỬ: TÌM KIẾM PHÒNG (SEARCH & AVAILABILITY)${colors.reset}`);
{
  const today = '2026-06-01';

  // Test 1.1: Request hợp lệ
  const reqValid = { checkIn: '2026-06-05', checkOut: '2026-06-08', guests: '2', type: 'ALL' };
  const resValid = searchService.validateSearchRequest(reqValid, today);
  assertTest('Validate search hợp lệ tính đúng số đêm', resValid === 'OK:3', `Kết quả: ${resValid}`);

  // Test 1.2: Check-in trong quá khứ -> E1
  const reqPast = { checkIn: '2026-05-30', checkOut: '2026-06-02', guests: 2 };
  const resPast = searchService.validateSearchRequest(reqPast, today);
  assertTest('Check-in trong quá khứ trả về mã lỗi E1', resPast === 'E1', `Kết quả: ${resPast}`);

  // Test 1.3: Check-out <= Check-in -> E2
  const reqDateErr = { checkIn: '2026-06-05', checkOut: '2026-06-05', guests: 2 };
  const resDateErr = searchService.validateSearchRequest(reqDateErr, today);
  assertTest('Check-out trùng hoặc trước Check-in trả về lỗi E2', resDateErr === 'E2', `Kết quả: ${resDateErr}`);

  // Test 1.4: Số khách không hợp lệ -> E3
  const reqGuestErr = { checkIn: '2026-06-05', checkOut: '2026-06-08', guests: 12 };
  const resGuestErr = searchService.validateSearchRequest(reqGuestErr, today);
  assertTest('Số khách > 10 trả về mã lỗi E3', resGuestErr === 'E3', `Kết quả: ${resGuestErr}`);

  // Test 1.5: Kiểm tra tìm kiếm phòng trống & tổng hợp giá qua Controller
  const mockRooms = [
    { code: '201', type: 'Standard', capacity: 2, price: 800000, status: 'Active' },
    { code: '301', type: 'Superior', capacity: 3, price: 1200000, status: 'Active' },
    { code: '401', type: 'Deluxe', capacity: 2, price: 1800000, status: 'Active' },
  ];
  const mockBookings = [
    { room: '201', checkIn: '2026-06-04', checkOut: '2026-06-06', status: 'Confirmed' }, // trùng ngày với 2026-06-05
  ];
  const { req, res } = createMockReqRes({
    checkIn: '2026-06-05',
    checkOut: '2026-06-08',
    guests: 2,
    type: 'ALL',
    rooms: mockRooms,
    bookings: mockBookings,
  });
  searchController.searchRooms(req, res);
  // Phòng 201 bị trùng, còn 301 (1.2tr) và 401 (1.8tr) => còn 2 phòng, rẻ nhất là 1,200,000
  assertTest('Controller lọc đúng phòng khả dụng và tìm giá thấp nhất', res.data && res.data.data === 'FOUND:2:1200000', `Kết quả: ${JSON.stringify(res.data)}`);

  // Đối soát FE:
  noteAudit(
    'Search (app/search/page.tsx)',
    'KHỚP',
    'Frontend lưu searchParams { checkIn, checkOut, guests: "2", roomType } khớp hoàn toàn với input của validateSearchRequest và summarizeSearch.',
    'Lưu ý: Frontend FE lọc phòng client-side bằng `room.capacity`, khi gọi BE cần truyền `type: "ALL"` nếu chọn tất cả loại phòng.'
  );
}

// ==============================================================================
// 2. MODULE BOOKING & PRICING (f2.js / booking.service.js)
// ==============================================================================
console.log(`\n${colors.blue}${colors.bright}[2/6] KIỂM THỬ: ĐẶT PHÒNG & TÍNH TIỀN CỌC (BOOKING & PRICING)${colors.reset}`);
{
  const today = '2026-06-01';

  // Test 2.1: Validate form đặt phòng hợp lệ (CCCD)
  const formValidCCCD = {
    name: 'Nguyễn Văn Nam',
    phone: '0901234567',
    email: 'nam.nguyen@example.com',
    idNumber: '012345678901', // 12 số
    payment: 'VNPAY',
    terms: true,
  };
  const resFormCCCD = bookingService.validateBookingForm(formValidCCCD);
  assertTest('Form với CCCD hợp lệ trả về OK:CCCD', resFormCCCD === 'OK:CCCD', `Kết quả: ${resFormCCCD}`);

  // Test 2.2: Validate form với Passport
  const formValidPassport = {
    name: 'John Doe',
    phone: '0987654321',
    email: 'john@example.com',
    idNumber: 'B1234567', // 1 chữ cái + 7 số
    payment: 'CARD',
    terms: true,
  };
  const resFormPassport = bookingService.validateBookingForm(formValidPassport);
  assertTest('Form với Hộ chiếu hợp lệ trả về OK:PASSPORT', resFormPassport === 'OK:PASSPORT', `Kết quả: ${resFormPassport}`);

  // Test 2.3: Chưa đồng ý điều khoản hoặc sai payment -> E6
  const formNoTerms = { ...formValidCCCD, terms: false };
  assertTest('Chưa đồng ý điều khoản trả về lỗi E6', bookingService.validateBookingForm(formNoTerms) === 'E6');

  // Test 2.4: Tính giá phòng & tiền cọc 50% có Voucher qua Controller
  const mockVoucher = { status: 'Active', start: '2026-05-01', end: '2026-06-30', used: 5, quantity: 100, percent: 10 };
  const { req: priceReq, res: priceRes } = createMockReqRes({
    roomPrice: 1000000,
    nights: 2,
    voucher: mockVoucher,
    today: '2026-06-01',
  });
  // Total: 2,000,000; Discount 10% = 200,000 => Payable = 1,800,000; Deposit 50% = 900,000
  bookingController.quotePrice(priceReq, priceRes);
  assertTest('Tính toán thành tiền sau giảm giá và tiền cọc 50% chính xác',
    priceRes.data && priceRes.data.payable === 1800000 && priceRes.data.deposit === 900000,
    `Payable: ${priceRes.data?.payable}, Deposit: ${priceRes.data?.deposit}`
  );

  // Test 2.5: Xử lý hết hạn giữ phòng sau 900s (15 phút)
  const pendingBooking = { status: 'Pending', deposit: 900000 };
  const holdExpired = bookingService.resolveHold(pendingBooking, 905, null);
  assertTest('Quá 900s giữ chỗ tự động hủy Pending sang Cancelled:E6', holdExpired === 'Cancelled:E6', `Kết quả: ${holdExpired}`);

  // Đối soát FE:
  noteAudit(
    'Booking (app/booking/page.tsx)',
    'LƯU Ý SCHEMA',
    'Frontend BookingForm hiện tại thu thập: name, phone, email, note. Backend yêu cầu thêm: idNumber (CCCD/Passport), payment và terms: true.',
    'Khi kết nối với Backend, cần bổ sung trường CCCD/Hộ chiếu và checkbox cam kết điều khoản vào Form.'
  );
  noteAudit(
    'Payment Hold (app/payment/page.tsx)',
    'KHỚP TUYỆT ĐỐI',
    'Frontend đếm ngược 15 phút (15*60 = 900s) giữ phòng, khớp chuẩn 100% với logic resolveHold(booking, elapsedSec > 900) của Backend.'
  );
}

// ==============================================================================
// 3. MODULE ADMIN CHECK-IN (f3.js / checkin.service.js)
// ==============================================================================
console.log(`\n${colors.blue}${colors.bright}[3/6] KIỂM THỬ: THỦ TỤC NHẬN PHÒNG (ADMIN CHECK-IN)${colors.reset}`);
{
  const mockBooking = {
    pnr: 'HST12345',
    status: 'Confirmed',
    cccd: '001202009999',
    roomType: 'Standard',
  };

  // Test 3.1: Verify check-in đúng PNR và CCCD
  const verifyOk = checkinService.verifyCheckin('HST12345', '001202009999', mockBooking, false);
  assertTest('Xác thực Check-in trùng khớp PNR và CCCD trả về OK', verifyOk === 'OK', `Kết quả: ${verifyOk}`);

  // Test 3.2: Khác CCCD nhưng có ủy quyền (authorized: true)
  const verifyAuth = checkinService.verifyCheckin('HST12345', '001202008888', mockBooking, true);
  assertTest('Khác CCCD nhưng có ủy nhiệm hợp lệ trả về OK:AUTH', verifyAuth === 'OK:AUTH', `Kết quả: ${verifyAuth}`);

  // Test 3.3: Gán phòng và tiền đặt cọc tối thiểu (500k) + Mã thẻ từ
  const cleanRoom = { type: 'Standard', status: 'Clean' };
  const assignOk = checkinService.validateAssignAndDeposit(cleanRoom, mockBooking, 500000, 'A1B2C3');
  assertTest('Gán phòng sạch + cọc >= 500k + thẻ từ hợp lệ trả về OK', assignOk === 'OK', `Kết quả: ${assignOk}`);

  const dirtyRoom = { type: 'Standard', status: 'Occupied' };
  const assignFail = checkinService.validateAssignAndDeposit(dirtyRoom, mockBooking, 500000, 'A1B2C3');
  assertTest('Phòng chưa dọn dẹp hoặc đang có khách trả về lỗi E3', assignFail === 'E3', `Kết quả: ${assignFail}`);

  // Test 3.4: Tính phụ thu nhận phòng sớm (Early check-in)
  // Trước 09:00 (ví dụ 07:30 = 450 phút) phụ thu 50%
  const feeEarlyMorning = checkinService.earlyCheckinFee('07:30', 1000000, true);
  assertTest('Nhận phòng khung 06:00 - 09:00 phụ thu 50% giá đêm', feeEarlyMorning === 500000, `Phụ thu: ${feeEarlyMorning}`);

  // Khung 09:00 - 14:00 (ví dụ 10:00 = 600 phút) có phòng sạch -> phụ thu 30%
  const feeLateMorning = checkinService.earlyCheckinFee('10:00', 1000000, true);
  assertTest('Nhận phòng khung 09:00 - 14:00 có phòng sạch phụ thu 30%', feeLateMorning === 300000, `Phụ thu: ${feeLateMorning}`);

  // Sau 14:00 (ví dụ 14:15 = 855 phút) -> miễn phí (0đ)
  const feeNormal = checkinService.earlyCheckinFee('14:15', 1000000, true);
  assertTest('Nhận phòng đúng giờ từ 14:00 trở đi không mất phí phụ thu', feeNormal === 0, `Phụ thu: ${feeNormal}`);

  // Đối soát FE:
  noteAudit(
    'Check-in (app/admin/checkin/page.tsx)',
    'KHỚP',
    'Frontend thu thập số CCCD 12 số, mã đặt phòng, kiểm tra trạng thái phòng trống, và hiển thị xác nhận phụ thu nhận phòng sớm.'
  );
}

// ==============================================================================
// 4. MODULE ADMIN CHECK-OUT & BILL SETTLEMENT (f4.js / checkout.service.js)
// ==============================================================================
console.log(`\n${colors.blue}${colors.bright}[4/6] KIỂM THỬ: TRẢ PHÒNG & QUYẾT TOÁN HÓA ĐƠN (CHECK-OUT & SETTLEMENT)${colors.reset}`);
{
  // Test 4.1: Kiểm tra phòng trả và minibar
  const occupiedRoom = { status: 'Occupied' };
  const minibar = [2, 1, 0, 3]; // tổng 6 món
  const checkoutRes = checkoutService.validateCheckout(occupiedRoom, minibar, 150000);
  assertTest('Kiểm tra phòng Occupied và đếm minibar hợp lệ', checkoutRes === 'OK:6', `Kết quả: ${checkoutRes}`);

  // Test 4.2: Phụ thu trả phòng muộn (Late Fee)
  // Sau 12:00 đến 15:00 (ví dụ 13:30 = 810 phút) -> phụ thu 30%
  const late30 = checkoutService.calcLateFee('13:30', 1000000);
  assertTest('Checkout 12:00 - 15:00 phụ thu 30% giá phòng', late30 === 300000, `Phụ thu: ${late30}`);

  // Sau 18:00 (ví dụ 19:00 = 1140 phút) -> phụ thu 100%
  const late100 = checkoutService.calcLateFee('19:00', 1000000);
  assertTest('Checkout sau 18:00 phụ thu 100% giá phòng nguyên đêm', late100 === 1000000, `Phụ thu: ${late100}`);

  // Test 4.3: Quyết toán hóa đơn (Settle Bill)
  // Khách còn nợ thêm tiền
  const billDebt = { remain: 500000, lateFee: 300000, minibar: 100000, damage: 0, deposit: 500000, paid: true };
  // Extra = 900,000; Deposit = 500,000 => Balance = +400,000 => COLLECT:400000
  const settleCollect = checkoutService.settleBill(billDebt);
  assertTest('Khách phát sinh thêm phụ phí vượt cọc -> Thu thêm (COLLECT)', settleCollect === 'COLLECT:400000', `Kết quả: ${settleCollect}`);

  // Khách được hoàn cọc
  const billRefund = { remain: 0, lateFee: 0, minibar: 0, damage: 0, deposit: 500000 };
  const settleRefund = checkoutService.settleBill(billRefund);
  assertTest('Khách không phát sinh chi phí -> Hoàn trả cọc (REFUND)', settleRefund === 'REFUND:500000', `Kết quả: ${settleRefund}`);

  // Đối soát FE:
  noteAudit(
    'Checkout (app/admin/checkout/page.tsx)',
    'KHỚP',
    'Frontend tính toán chi tiết phí phát sinh, tiền phòng còn lại, trừ cọc và in hóa đơn thanh toán khớp với cấu trúc settleBill.'
  );
}

// ==============================================================================
// 5. MODULE ROOM MANAGEMENT (f5.js / room.service.js)
// ==============================================================================
console.log(`\n${colors.blue}${colors.bright}[5/6] KIỂM THỬ: QUẢN LÝ CẤU HÌNH PHÒNG (ROOM MANAGEMENT)${colors.reset}`);
{
  // Test 5.1: Mã phòng hợp lệ theo tầng (Tầng 3 -> P301)
  const existingRooms = ['P201', 'P202', 'P301'];
  const codeValid = roomService.validateRoomCode('P302', 3, existingRooms);
  assertTest('Mã phòng P302 thuộc tầng 3 và chưa tồn tại trả về OK', codeValid === 'OK', `Kết quả: ${codeValid}`);

  // Mã phòng sai tầng hoặc trùng lặp
  const codeWrongFloor = roomService.validateRoomCode('P401', 3, existingRooms);
  assertTest('Mã phòng P401 khai báo ở tầng 3 trả về lỗi E1', codeWrongFloor === 'E1', `Kết quả: ${codeWrongFloor}`);

  // Test 5.2: Thông số phòng (Tầng 1-15, Giá 200k-50tr, Sức chứa 1-8)
  const specValid = { floor: 3, price: 1200000, capacity: 4 };
  assertTest('Thông số phòng hợp chuẩn trả về OK', roomService.validateRoomSpec(specValid) === 'OK');

  const specInvalidPrice = { floor: 3, price: 50000, capacity: 4 }; // Giá dưới 200k
  assertTest('Giá phòng nhỏ hơn 200,000đ trả về lỗi E3', roomService.validateRoomSpec(specInvalidPrice) === 'E3');

  // Test 5.3: Validate file ảnh (jpg/jpeg/png <= 5MB)
  const validPhoto = { name: 'deluxe_room.jpg', sizeMB: 3.5 };
  assertTest('File ảnh jpg dung lượng 3.5MB hợp lệ trả về OK', roomService.validatePhoto(validPhoto) === 'OK');

  const invalidPhotoExt = { name: 'room.pdf', sizeMB: 1 };
  assertTest('File sai định dạng (.pdf) trả về lỗi E5', roomService.validatePhoto(invalidPhotoExt) === 'E5');

  // Đối soát FE:
  noteAudit(
    'Room Management (app/admin/rooms/page.tsx)',
    'LƯU Ý PREFIX MÃ PHÒNG',
    'Frontend tạo phòng dùng ID số (ví dụ: "201", "301"), trong khi Backend regex kiểm tra bắt buộc có chữ "P" ở đầu (ví dụ: "P201", "P301").',
    'Đề xuất: Khi FE gửi lên API tạo phòng, tự động thêm prefix "P" vào trước mã phòng (hoặc chuẩn hóa mã phòng thành Pxxx).'
  );
}

// ==============================================================================
// 6. MODULE VOUCHER & PROMOTIONS (f6.js / voucher.service.js)
// ==============================================================================
console.log(`\n${colors.blue}${colors.bright}[6/6] KIỂM THỬ: VOUCHER & KHUYẾN MÃI (VOUCHER & PROMOTIONS)${colors.reset}`);
{
  const today = '2026-06-01';

  // Test 6.1: Validate form tạo voucher
  const voucherForm = {
    title: 'Giảm giá mùa hè 2026',
    code: 'SUMMER20',
    percent: 20,
    start: '2026-06-01',
    end: '2026-06-30',
    quantity: 100,
  };
  const createRes = voucherService.validateVoucherForm(voucherForm, ['WELCOME10'], today);
  assertTest('Form tạo voucher SUMMER20 hợp lệ trả về OK', createRes === 'OK', `Kết quả: ${createRes}`);

  // Test 6.2: Trạng thái Voucher theo ngày
  const activeVoucher = { quantity: 100, used: 10, start: '2026-05-01', end: '2026-06-30', suspended: false };
  assertTest('Voucher trong hạn và còn số lượng có trạng thái Active', voucherService.voucherStatus(activeVoucher, today) === 'Active');

  const expiredVoucher = { quantity: 100, used: 10, start: '2026-04-01', end: '2026-05-01', suspended: false };
  assertTest('Voucher quá hạn có trạng thái Expired', voucherService.voucherStatus(expiredVoucher, today) === 'Expired');

  // Test 6.3: Áp dụng mã Voucher (Redeem) qua Controller
  const voucherStore = {
    SUMMER20: { percent: 20, quantity: 100, used: 10, start: '2026-05-01', end: '2026-06-30', suspended: false },
    EXPIRED50: { percent: 50, quantity: 100, used: 10, start: '2026-01-01', end: '2026-02-01', suspended: false },
  };

  const { req: redeemReq, res: redeemRes } = createMockReqRes({
    codes: ['SUMMER20'],
    store: voucherStore,
    today,
  });
  voucherController.applyVoucher(redeemReq, redeemRes);
  assertTest('Áp dụng mã SUMMER20 thành công qua Controller', redeemRes.data && redeemRes.data.result === 'APPLIED:SUMMER20', `Kết quả: ${JSON.stringify(redeemRes.data)}`);

  // Thử áp dụng 2 mã cùng lúc -> REJECT_MULTI
  const multiRedeem = voucherService.redeemVoucher(['SUMMER20', 'WELCOME10'], voucherStore, today);
  assertTest('Từ chối khi người dùng nhập nhiều hơn 1 mã (REJECT_MULTI)', multiRedeem === 'REJECT_MULTI', `Kết quả: ${multiRedeem}`);

  // Đối soát FE:
  noteAudit(
    'Payment Voucher (app/payment/page.tsx)',
    'KHỚP',
    'Frontend cung cấp sẵn các mã SUMMER20, WELCOME10, THAD50K; khi áp dụng gọi đúng 1 mã duy nhất, tương thích chính xác với Backend redeemVoucher.'
  );
}

// ==============================================================================
// TỔNG HỢP KẾT QUẢ VÀ BÁO CÁO ĐỐI SOÁT
// ==============================================================================
console.log(`\n${colors.cyan}${colors.bright}================================================================================${colors.reset}`);
console.log(`${colors.cyan}${colors.bright}                     TỔNG HỢP KẾT QUẢ SELF-TEST                                  ${colors.reset}`);
console.log(`${colors.cyan}${colors.bright}================================================================================${colors.reset}`);
console.log(`  Số test case thành công : ${colors.green}${colors.bright}${passCount}${colors.reset}`);
console.log(`  Số test case thất bại   : ${failCount > 0 ? colors.red : colors.green}${colors.bright}${failCount}${colors.reset}`);
console.log(`  Tỷ lệ đạt chuẩn Backend : ${colors.cyan}${colors.bright}${Math.round((passCount / (passCount + failCount)) * 100)}%${colors.reset}\n`);

console.log(`${colors.yellow}${colors.bright}---------------- BẢNG ĐỐI SOÁT TƯƠNG THÍCH FRONTEND - BACKEND -------------------${colors.reset}`);
compatibilityNotes.forEach((n, idx) => {
  const badge = n.status.includes('KHỚP') ? `${colors.green}[${n.status}]${colors.reset}` : `${colors.yellow}[${n.status}]${colors.reset}`;
  console.log(`${idx + 1}. ${badge} ${colors.bright}${n.feature}${colors.reset}`);
  console.log(`   - Thực trạng : ${n.message}`);
  if (n.suggestion) {
    console.log(`   - Đề xuất    : ${colors.cyan}${n.suggestion}${colors.reset}`);
  }
});
console.log(`${colors.cyan}${colors.bright}================================================================================${colors.reset}\n`);

// Trả về mã thoát cho tiến trình
process.exit(failCount === 0 ? 0 : 1);
