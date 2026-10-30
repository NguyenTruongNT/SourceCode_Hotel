'use strict';
const { validateSearchRequest, isRoomAvailable, summarizeSearch } = require('../src/f1');
 
describe('F1 - validateSearchRequest(): Kiểm tra yêu cầu tra cứu phòng', () => {
  const cases = [
    // req: checkIn = "" (các trường còn lại hợp lệ); today = 11/10/2026
    { id: 'TC_WB_F1_U1_01', args: [{"checkIn": "", "checkOut": "2026-10-15", "guests": 2, "type": "ALL"}, "2026-10-11"], expected: "E1" },
    // req: checkIn = "13/10/2026" (các trường còn lại hợp lệ); today = 11/10/2026
    { id: 'TC_WB_F1_U1_02', args: [{"checkIn": "13/10/2026", "checkOut": "2026-10-15", "guests": 2, "type": "ALL"}, "2026-10-11"], expected: "E1" },
    // req: checkIn = "2026-10-10" (các trường còn lại hợp lệ); today = 11/10/2026
    { id: 'TC_WB_F1_U1_03', args: [{"checkIn": "2026-10-10", "checkOut": "2026-10-15", "guests": 2, "type": "ALL"}, "2026-10-11"], expected: "E1" },
    // req: checkOut = "" (các trường còn lại hợp lệ); today = 11/10/2026
    { id: 'TC_WB_F1_U1_04', args: [{"checkIn": "2026-10-13", "checkOut": "", "guests": 2, "type": "ALL"}, "2026-10-11"], expected: "E2" },
    // req: checkOut = "15/10/2026" (các trường còn lại hợp lệ); today = 11/10/2026
    { id: 'TC_WB_F1_U1_05', args: [{"checkIn": "2026-10-13", "checkOut": "15/10/2026", "guests": 2, "type": "ALL"}, "2026-10-11"], expected: "E2" },
    // req: checkOut = "2026-10-13" (các trường còn lại hợp lệ); today = 11/10/2026
    { id: 'TC_WB_F1_U1_06', args: [{"checkIn": "2026-10-13", "checkOut": "2026-10-13", "guests": 2, "type": "ALL"}, "2026-10-11"], expected: "E2" },
    // req: guests = "abc" (các trường còn lại hợp lệ); today = 11/10/2026
    { id: 'TC_WB_F1_U1_07', args: [{"checkIn": "2026-10-13", "checkOut": "2026-10-15", "guests": "abc", "type": "ALL"}, "2026-10-11"], expected: "E3" },
    // req: guests = 0 (các trường còn lại hợp lệ); today = 11/10/2026
    { id: 'TC_WB_F1_U1_08', args: [{"checkIn": "2026-10-13", "checkOut": "2026-10-15", "guests": 0, "type": "ALL"}, "2026-10-11"], expected: "E3" },
    // req: guests = 11 (các trường còn lại hợp lệ); today = 11/10/2026
    { id: 'TC_WB_F1_U1_09', args: [{"checkIn": "2026-10-13", "checkOut": "2026-10-15", "guests": 11, "type": "ALL"}, "2026-10-11"], expected: "E3" },
    // req hợp lệ đầy đủ; today = 11/10/2026
    { id: 'TC_WB_F1_U1_10', args: [{"checkIn": "2026-10-13", "checkOut": "2026-10-15", "guests": 2, "type": "ALL"}, "2026-10-11"], expected: "OK:2" },
  ];
  test.each(cases)('$id → $expected', ({ args, expected }) => {
    expect(validateSearchRequest(...args)).toBe(expected);
  });
});
 
describe('F1 - isRoomAvailable(): Lọc phòng khả dụng theo tiêu chí và lịch đặt', () => {
  const cases = [
    // room = P302 Inactive, sức chứa 4, DLX; req = 2 khách, ALL, 10-13–10-15; bookings = []
    { id: 'TC_WB_F1_U2_01', args: [{"code": "P302", "status": "Inactive", "capacity": 4, "type": "DLX", "price": 900000}, 
      {"checkIn": "2026-10-13", "checkOut": "2026-10-15", "guests": 2, "type": "ALL"}, []], expected: false },
    // room = P302 Active, sức chứa 2, DLX; req = 4 khách, ALL, 10-13–10-15; bookings = []
    { id: 'TC_WB_F1_U2_02', args: [{"code": "P302", "status": "Active", "capacity": 2, "type": "DLX", "price": 900000}, 
      {"checkIn": "2026-10-13", "checkOut": "2026-10-15", "guests": 4, "type": "ALL"}, []], expected: false },
    // room = P302 Active, sức chứa 4, DLX; req = 2 khách, STD, 10-13–10-15; bookings = []
    { id: 'TC_WB_F1_U2_03', args: [{"code": "P302", "status": "Active", "capacity": 4, "type": "DLX", "price": 900000}, 
      {"checkIn": "2026-10-13", "checkOut": "2026-10-15", "guests": 2, "type": "STD"}, []], expected: false },
    // room = P302 Active, sức chứa 4, DLX; req = 2 khách, ALL, 10-13–10-15; bookings = []
    { id: 'TC_WB_F1_U2_04', args: [{"code": "P302", "status": "Active", "capacity": 4, "type": "DLX", "price": 900000}, 
      {"checkIn": "2026-10-13", "checkOut": "2026-10-15", "guests": 2, "type": "ALL"}, []], expected: true },
    // room = P302 Active, sức chứa 4, DLX; req = 2 khách, DLX, 10-13–10-15; bookings = []
    { id: 'TC_WB_F1_U2_05', args: [{"code": "P302", "status": "Active", "capacity": 4, "type": "DLX", "price": 900000}, 
      {"checkIn": "2026-10-13", "checkOut": "2026-10-15", "guests": 2, "type": "DLX"}, []], expected: true },
    // room = P302 Active, sức chứa 4, DLX; req = 2 khách, ALL, 10-13–10-15; bookings = [{P101 Confirmed, 13/10–15/10}]
    { id: 'TC_WB_F1_U2_06', args: [{"code": "P302", "status": "Active", "capacity": 4, "type": "DLX", "price": 900000}, 
      {"checkIn": "2026-10-13", "checkOut": "2026-10-15", "guests": 2, "type": "ALL"}, [{"room": "P101", "status": "Confirmed", "checkIn": "2026-10-13", "checkOut": "2026-10-15"}]], expected: true },
    // room = P302 Active, sức chứa 4, DLX; req = 2 khách, ALL, 10-13–10-15; bookings = [{P302 Cancelled, 13/10–15/10}]
    { id: 'TC_WB_F1_U2_07', args: [{"code": "P302", "status": "Active", "capacity": 4, "type": "DLX", "price": 900000}, 
      {"checkIn": "2026-10-13", "checkOut": "2026-10-15", "guests": 2, "type": "ALL"}, [{"room": "P302", "status": "Cancelled", "checkIn": "2026-10-13", "checkOut": "2026-10-15"}]], expected: true },
    // room = P302 Active, sức chứa 4, DLX; req = 2 khách, ALL, 10-13–10-15; bookings = [{P302 In-house, 15/10–17/10}]
    { id: 'TC_WB_F1_U2_08', args: [{"code": "P302", "status": "Active", "capacity": 4, "type": "DLX", "price": 900000}, 
      {"checkIn": "2026-10-13", "checkOut": "2026-10-15", "guests": 2, "type": "ALL"}, [{"room": "P302", "status": "In-house", "checkIn": "2026-10-15", "checkOut": "2026-10-17"}]], expected: true },
    // room = P302 Active, sức chứa 4, DLX; req = 2 khách, ALL, 10-13–10-15; bookings = [{P302 Confirmed, 9/10–12/10}]
    { id: 'TC_WB_F1_U2_09', args: [{"code": "P302", "status": "Active", "capacity": 4, "type": "DLX", "price": 900000}, 
      {"checkIn": "2026-10-13", "checkOut": "2026-10-15", "guests": 2, "type": "ALL"}, [{"room": "P302", "status": "Confirmed", "checkIn": "2026-10-09", "checkOut": "2026-10-12"}]], expected: true },
    // room = P302 Active, sức chứa 4, DLX; req = 2 khách, ALL, 10-13–10-15; bookings = [{P302 Confirmed, 14/10–16/10}]
    { id: 'TC_WB_F1_U2_10', args: [{"code": "P302", "status": "Active", "capacity": 4, "type": "DLX", "price": 900000}, 
      {"checkIn": "2026-10-13", "checkOut": "2026-10-15", "guests": 2, "type": "ALL"}, [{"room": "P302", "status": "Confirmed", "checkIn": "2026-10-14", "checkOut": "2026-10-16"}]], expected: false },
  ];
  test.each(cases)('$id → $expected', ({ args, expected }) => {
    expect(isRoomAvailable(...args)).toBe(expected);
  });
});
 
describe('F1 - summarizeSearch(): Tổng hợp kết quả tra cứu (đếm phòng, giá thấp nhất)', () => {
  const cases = [
    // rooms = []; bookings = []; req = 2 khách, ALL, 13/10–15/10
    { id: 'TC_WB_F1_U3_01', args: [[], {"checkIn": "2026-10-13", "checkOut": "2026-10-15", "guests": 2, "type": "ALL"}, []], expected: "NO_ROOM" },
    // rooms = [P101 1,200,000]; bookings = [{P101 Confirmed, 14/10–16/10}]; req = 2 khách, ALL, 13/10–15/10
    { id: 'TC_WB_F1_U3_02', args: [[{"code": "P101", "status": "Active", "capacity": 4, "type": "DLX", "price": 1200000}], 
    {"checkIn": "2026-10-13", "checkOut": "2026-10-15", "guests": 2, "type": "ALL"}, [{"room": "P101", "status": "Confirmed", "checkIn": "2026-10-14", "checkOut": "2026-10-16"}]], expected: "NO_ROOM" },
    // rooms = [P101 1,200,000]; bookings = []; req = 2 khách, ALL, 13/10–15/10
    { id: 'TC_WB_F1_U3_03', args: [[{"code": "P101", "status": "Active", "capacity": 4, "type": "DLX", "price": 1200000}], 
    {"checkIn": "2026-10-13", "checkOut": "2026-10-15", "guests": 2, "type": "ALL"}, []], expected: "FOUND:1:1200000" },
    // rooms = [P101 1,200,000, P102 900,000, P103 1,500,000]; bookings = []; req = 2 khách, ALL, 13/10–15/10
    { id: 'TC_WB_F1_U3_04', args: [[{"code": "P101", "status": "Active", "capacity": 4, "type": "DLX", "price": 1200000}, 
    {"code": "P102", "status": "Active", "capacity": 4, "type": "DLX", "price": 900000}, 
    {"code": "P103", "status": "Active", "capacity": 4, "type": "DLX", "price": 1500000}], {"checkIn": "2026-10-13", "checkOut": "2026-10-15", "guests": 2, "type": "ALL"}, []], expected: "FOUND:3:900000" },
  ];
  test.each(cases)('$id → $expected', ({ args, expected }) => {
    expect(summarizeSearch(...args)).toBe(expected);
  });
});
