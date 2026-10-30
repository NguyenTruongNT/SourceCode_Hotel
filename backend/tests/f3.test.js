'use strict';
const { verifyCheckin, validateAssignAndDeposit, earlyCheckinFee } = require('../src/f3');
 
describe('F3 - verifyCheckin(): Xác thực mã PNR và đối chiếu CCCD khi nhận phòng', () => {
  const cases = [
    // pnr = ""; cccd = "001202005991"; booking = {Confirmed, cccd "001202005991"}; authorized = false
    { id: 'TC_WB_F3_U1_01', args: ["", "001202005991", {"status": "Confirmed", "cccd": "001202005991"}, false], expected: "E1" },
    // pnr = "HST123"; cccd = "001202005991"; booking = {Confirmed, cccd "001202005991"}; authorized = false
    { id: 'TC_WB_F3_U1_02', args: ["HST123", "001202005991", {"status": "Confirmed", "cccd": "001202005991"}, false], expected: "E1" },
    // pnr = "HST99999"; cccd = "001202005991"; booking = null; authorized = false
    { id: 'TC_WB_F3_U1_03', args: ["HST99999", "001202005991", null, false], expected: "E1" },
    // pnr = "HST10234"; cccd = "001202005991"; booking = {Cancelled, cccd "001202005991"}; authorized = false
    { id: 'TC_WB_F3_U1_04', args: ["HST10234", "001202005991", {"status": "Cancelled", "cccd": "001202005991"}, false], expected: "E1" },
    // pnr = "HST10234"; cccd = "00120200599"; booking = {Confirmed, cccd "001202005991"}; authorized = false
    { id: 'TC_WB_F3_U1_05', args: ["HST10234", "00120200599", {"status": "Confirmed", "cccd": "001202005991"}, false], expected: "E2" },
    // pnr = "HST10234"; cccd = ""; booking = {Confirmed, cccd "001202005991"}; authorized = false
    { id: 'TC_WB_F3_U1_06', args: ["HST10234", "", {"status": "Confirmed", "cccd": "001202005991"}, false], expected: "E2" },
    // pnr = "HST10234"; cccd = "001202005992"; booking = {Confirmed, cccd "001202005991"}; authorized = false
    { id: 'TC_WB_F3_U1_07', args: ["HST10234", "001202005992", {"status": "Confirmed", "cccd": "001202005991"}, false], expected: "E2" },
    // pnr = "HST10234"; cccd = "001202005992"; booking = {Confirmed, cccd "001202005991"}; authorized = true
    { id: 'TC_WB_F3_U1_08', args: ["HST10234", "001202005992", {"status": "Confirmed", "cccd": "001202005991"}, true], expected: "OK:AUTH" },
    // pnr = "HST10234"; cccd = "001202005991"; booking = {Confirmed, cccd "001202005991"}; authorized = false
    { id: 'TC_WB_F3_U1_09', args: ["HST10234", "001202005991", {"status": "Confirmed", "cccd": "001202005991"}, false], expected: "OK" },
  ];
  test.each(cases)('$id → $expected', ({ args, expected }) => {
    expect(verifyCheckin(...args)).toBe(expected);
  });
});
 
describe('F3 - validateAssignAndDeposit(): Kiểm tra gán phòng, tiền cọc và thẻ từ', () => {
  const cases = [
    // room = null; booking.roomType = DLX; deposit = 500,000; keycard = "A1B2C3D4"
    { id: 'TC_WB_F3_U2_01', args: [null, {"roomType": "DLX"}, 500000, "A1B2C3D4"], expected: "E3" },
    // room = {STD, Clean}; booking.roomType = DLX; deposit = 500,000; keycard = "A1B2C3D4"
    { id: 'TC_WB_F3_U2_02', args: [{"type": "STD", "status": "Clean"}, {"roomType": "DLX"}, 500000, "A1B2C3D4"], expected: "E3" },
    // room = {DLX, Dirty}; booking.roomType = DLX; deposit = 500,000; keycard = "A1B2C3D4"
    { id: 'TC_WB_F3_U2_03', args: [{"type": "DLX", "status": "Dirty"}, {"roomType": "DLX"}, 500000, "A1B2C3D4"], expected: "E3" },
    // room = {DLX, Clean}; booking.roomType = DLX; deposit = ""; keycard = "A1B2C3D4"
    { id: 'TC_WB_F3_U2_04', args: [{"type": "DLX", "status": "Clean"}, {"roomType": "DLX"}, "", "A1B2C3D4"], expected: "E4" },
    // room = {DLX, Clean}; booking.roomType = DLX; deposit = null; keycard = "A1B2C3D4"
    { id: 'TC_WB_F3_U2_05', args: [{"type": "DLX", "status": "Clean"}, {"roomType": "DLX"}, null, "A1B2C3D4"], expected: "E4" },
    // room = {DLX, Clean}; booking.roomType = DLX; deposit = "abc"; keycard = "A1B2C3D4"
    { id: 'TC_WB_F3_U2_06', args: [{"type": "DLX", "status": "Clean"}, {"roomType": "DLX"}, "abc", "A1B2C3D4"], expected: "E4" },
    // room = {DLX, Clean}; booking.roomType = DLX; deposit = 499,000; keycard = "A1B2C3D4"
    { id: 'TC_WB_F3_U2_07', args: [{"type": "DLX", "status": "Clean"}, {"roomType": "DLX"}, 499000, "A1B2C3D4"], expected: "E4" },
    // room = {DLX, Clean}; booking.roomType = DLX; deposit = 500,000; keycard = ""
    { id: 'TC_WB_F3_U2_08', args: [{"type": "DLX", "status": "Clean"}, {"roomType": "DLX"}, 500000, ""], expected: "BLOCK" },
    // room = {DLX, Clean}; booking.roomType = DLX; deposit = 500,000; keycard = "A1B2C"
    { id: 'TC_WB_F3_U2_09', args: [{"type": "DLX", "status": "Clean"}, {"roomType": "DLX"}, 500000, "A1B2C"], expected: "BLOCK" },
    // room = {DLX, Clean}; booking.roomType = DLX; deposit = 500,000; keycard = "A1B2C3D4"
    { id: 'TC_WB_F3_U2_10', args: [{"type": "DLX", "status": "Clean"}, {"roomType": "DLX"}, 500000, "A1B2C3D4"], expected: "OK" },
  ];
  test.each(cases)('$id → $expected', ({ args, expected }) => {
    expect(validateAssignAndDeposit(...args)).toBe(expected);
  });
});
 
describe('F3 - earlyCheckinFee(): Tính phụ thu nhận phòng sớm', () => {
  const cases = [
    // time = "14:00"; nightPrice = 1,000,000; hasCleanRoom = true
    { id: 'TC_WB_F3_U3_01', args: ["14:00", 1000000, true], expected: 0 },
    // time = "07:30"; nightPrice = 1,000,000; hasCleanRoom = false
    { id: 'TC_WB_F3_U3_02', args: ["07:30", 1000000, false], expected: 500000 },
    // time = "10:00"; nightPrice = 1,000,000; hasCleanRoom = true
    { id: 'TC_WB_F3_U3_03', args: ["10:00", 1000000, true], expected: 300000 },
    // time = "10:00"; nightPrice = 1,000,000; hasCleanRoom = false
    { id: 'TC_WB_F3_U3_04', args: ["10:00", 1000000, false], expected: -1 },
    // time = "05:00"; nightPrice = 1,000,000; hasCleanRoom = true
    { id: 'TC_WB_F3_U3_05', args: ["05:00", 1000000, true], expected: -1 },
    // time = "09:00"; nightPrice = 1,000,000; hasCleanRoom = true
    { id: 'TC_WB_F3_U3_06', args: ["09:00", 1000000, true], expected: 300000 },
    // time = "08:59"; nightPrice = 1,000,000; hasCleanRoom = true
    { id: 'TC_WB_F3_U3_07', args: ["08:59", 1000000, true], expected: 500000 },
  ];
  test.each(cases)('$id → $expected', ({ args, expected }) => {
    expect(earlyCheckinFee(...args)).toBe(expected);
  });
});
