'use strict';
const { validateBookingForm, priceBooking, resolveHold } = require('../src/f2');
 
describe('F2 - validateBookingForm(): Kiểm tra biểu mẫu thông tin khách và thanh toán', () => {
  const cases = [
    // form: name = null (các trường còn lại hợp lệ)
    { id: 'TC_WB_F2_U1_01', args: [{"name": null, "phone": "0988112233", "email": "huynh@gmail.com", "idNumber": "001202005991", "payment": "VNPAY", "terms": true}], expected: "E1" },
    // form: name = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" (các trường còn lại hợp lệ)
    { id: 'TC_WB_F2_U1_02', 
      args: [{"name": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "phone": "0988112233", "email": "huynh@gmail.com", "idNumber": "001202005991", "payment": "VNPAY", "terms": true}], expected: "E1" },
    // form: name = "Huynh123" (các trường còn lại hợp lệ)
    { id: 'TC_WB_F2_U1_03', args: [{"name": "Huynh123", "phone": "0988112233", "email": "huynh@gmail.com", "idNumber": "001202005991", "payment": "VNPAY", "terms": true}], expected: "E1" },
    // form: phone = "0188112233" (các trường còn lại hợp lệ)
    { id: 'TC_WB_F2_U1_04', args: [{"name": "Nguyễn Văn Huỳnh", "phone": "0188112233", "email": "huynh@gmail.com", "idNumber": "001202005991", "payment": "VNPAY", "terms": true}], expected: "E2" },
    // form: phone = "" (các trường còn lại hợp lệ)
    { id: 'TC_WB_F2_U1_05', args: [{"name": "Nguyễn Văn Huỳnh", "phone": "", "email": "huynh@gmail.com", "idNumber": "001202005991", "payment": "VNPAY", "terms": true}], expected: "E2" },
    // form: email = "" (các trường còn lại hợp lệ)
    { id: 'TC_WB_F2_U1_06', args: [{"name": "Nguyễn Văn Huỳnh", "phone": "0988112233", "email": "", "idNumber": "001202005991", "payment": "VNPAY", "terms": true}], expected: "E3" },
    // form: email = "huynh @gmail.com" (các trường còn lại hợp lệ)
    { id: 'TC_WB_F2_U1_07', args: [{"name": "Nguyễn Văn Huỳnh", "phone": "0988112233", "email": "huynh @gmail.com", "idNumber": "001202005991", "payment": "VNPAY", "terms": true}], expected: "E3" },
    // form: email = "huynh@gmail" (các trường còn lại hợp lệ)
    { id: 'TC_WB_F2_U1_08', args: [{"name": "Nguyễn Văn Huỳnh", "phone": "0988112233", "email": "huynh@gmail", "idNumber": "001202005991", "payment": "VNPAY", "terms": true}], expected: "E3" },
    // form: idNumber = "00120200599" (các trường còn lại hợp lệ)
    { id: 'TC_WB_F2_U1_09', args: [{"name": "Nguyễn Văn Huỳnh", "phone": "0988112233", "email": "huynh@gmail.com", "idNumber": "00120200599", "payment": "VNPAY", "terms": true}], expected: "E4" },
    // form: idNumber = "" (các trường còn lại hợp lệ)
    { id: 'TC_WB_F2_U1_10', args: [{"name": "Nguyễn Văn Huỳnh", "phone": "0988112233", "email": "huynh@gmail.com", "idNumber": "", "payment": "VNPAY", "terms": true}], expected: "E4" },
    // form: payment = "CASH" (các trường còn lại hợp lệ)
    { id: 'TC_WB_F2_U1_11', args: [{"name": "Nguyễn Văn Huỳnh", "phone": "0988112233", "email": "huynh@gmail.com", "idNumber": "001202005991", "payment": "CASH", "terms": true}], expected: "E6" },
    // form: terms = false (các trường còn lại hợp lệ)
    { id: 'TC_WB_F2_U1_12', args: [{"name": "Nguyễn Văn Huỳnh", "phone": "0988112233", "email": "huynh@gmail.com", "idNumber": "001202005991", "payment": "VNPAY", "terms": false}], expected: "E6" },
    // form hợp lệ đầy đủ
    { id: 'TC_WB_F2_U1_13', args: [{"name": "Nguyễn Văn Huỳnh", "phone": "0988112233", "email": "huynh@gmail.com", "idNumber": "001202005991", "payment": "VNPAY", "terms": true}], expected: "OK:CCCD" },
    // form: idNumber = "B1234567" (các trường còn lại hợp lệ)
    { id: 'TC_WB_F2_U1_14', args: [{"name": "Nguyễn Văn Huỳnh", "phone": "0988112233", "email": "huynh@gmail.com", "idNumber": "B1234567", "payment": "VNPAY", "terms": true}], expected: "OK:PASSPORT" },
  ];
  test.each(cases)('$id → $expected', ({ args, expected }) => {
    expect(validateBookingForm(...args)).toBe(expected);
  });
});
 
describe('F2 - priceBooking(): Tính tiền phòng, giảm giá voucher và tiền cọc', () => {
  const cases = [
    // roomPrice = 1,000,000; nights = 2; v = null (không nhập mã); today = 11/10/2026
    { id: 'TC_WB_F2_U2_01', args: [1000000, 2, null, "2026-10-11"], expected: "OK:2000000:1000000" },
    // roomPrice = 1,000,000; nights = 2; v = Suspended, 01/10–31/12/2026, 10/500; today = 11/10/2026
    { id: 'TC_WB_F2_U2_02', args: [1000000, 2, {"status": "Suspended", "start": "2026-10-01", "end": "2026-12-31", "used": 10, "quantity": 500, "percent": 10}, "2026-10-11"], expected: "E5" },
    // roomPrice = 1,000,000; nights = 2; v = Active, 20/10–31/12/2026 (chưa đến hạn), 10/500; today = 11/10/2026
    { id: 'TC_WB_F2_U2_03', args: [1000000, 2, {"status": "Active", "start": "2026-10-20", "end": "2026-12-31", "used": 10, "quantity": 500, "percent": 10}, "2026-10-11"], expected: "E5" },
    // roomPrice = 1,000,000; nights = 2; v = Active, 01/10–05/10/2026 (hết hạn), 10/500; today = 11/10/2026
    { id: 'TC_WB_F2_U2_04', args: [1000000, 2, {"status": "Active", "start": "2026-10-01", "end": "2026-10-05", "used": 10, "quantity": 500, "percent": 10}, "2026-10-11"], expected: "E5" },
    // roomPrice = 1,000,000; nights = 2; v = Active, trong hạn, đã dùng 500/500; today = 11/10/2026
    { id: 'TC_WB_F2_U2_05', args: [1000000, 2, {"status": "Active", "start": "2026-10-01", "end": "2026-12-31", "used": 500, "quantity": 500, "percent": 10}, "2026-10-11"], expected: "E5" },
    // roomPrice = 1,000,000; nights = 2; v = Active, 01/10–31/12/2026, 10/500, giảm 10%; today = 11/10/2026
    { id: 'TC_WB_F2_U2_06', args: [1000000, 2, {"status": "Active", "start": "2026-10-01", "end": "2026-12-31", "used": 10, "quantity": 500, "percent": 10}, "2026-10-11"], expected: "OK:1800000:900000" },
  ];
  test.each(cases)('$id → $expected', ({ args, expected }) => {
    expect(priceBooking(...args)).toBe(expected);
  });
});
 
describe('F2 - resolveHold(): Xử lý trạng thái giữ chỗ 15 phút khi nhận IPN', () => {
  const cases = [
    // booking = {Cancelled, cọc 1,000,000}; elapsedSec = 60; ipn = null
    { id: 'TC_WB_F2_U3_01', args: [{"status": "Cancelled", "deposit": 1000000}, 60, null], expected: "Cancelled" },
    // booking = {Pending, cọc 1,000,000}; elapsedSec = 300; ipn = {code: "00", amount: 1,000,000}
    { id: 'TC_WB_F2_U3_02', args: [{"status": "Pending", "deposit": 1000000}, 300, {"code": "00", "amount": 1000000}], expected: "Confirmed" },
    // booking = {Pending, cọc 1,000,000}; elapsedSec = 300; ipn = null
    { id: 'TC_WB_F2_U3_03', args: [{"status": "Pending", "deposit": 1000000}, 300, null], expected: "Pending" },
    // booking = {Pending, cọc 1,000,000}; elapsedSec = 300; ipn = {code: "00", amount: 500,000}
    { id: 'TC_WB_F2_U3_04', args: [{"status": "Pending", "deposit": 1000000}, 300, {"code": "00", "amount": 500000}], expected: "Pending" },
    // booking = {Pending, cọc 1,000,000}; elapsedSec = 300; ipn = {code: "24", amount: 0}
    { id: 'TC_WB_F2_U3_05', args: [{"status": "Pending", "deposit": 1000000}, 300, {"code": "24", "amount": 0}], expected: "Cancelled:E6" },
    // booking = {Pending, cọc 1,000,000}; elapsedSec = 901; ipn = null
    { id: 'TC_WB_F2_U3_06', args: [{"status": "Pending", "deposit": 1000000}, 901, null], expected: "Cancelled:E6" },
    // booking = {Pending, cọc 1,000,000}; elapsedSec = 900; ipn = null
    { id: 'TC_WB_F2_U3_07', args: [{"status": "Pending", "deposit": 1000000}, 900, null], expected: "Pending" },
  ];
  test.each(cases)('$id → $expected', ({ args, expected }) => {
    expect(resolveHold(...args)).toBe(expected);
  });
});
