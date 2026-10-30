'use strict';
const { validateRoomCode, validateRoomSpec, validatePhoto } = require('../src/f5');
 
describe('F5 - validateRoomCode(): Kiểm tra mã số phòng (độ dài, định dạng, trùng lặp, khớp tầng)', () => {
  const cases = [
    // code = ""; floor = 3; existing = ['P101']
    { id: 'TC_WB_F5_U1_01', args: ["", 3, ["P101"]], expected: "E1" },
    // code = "P1"; floor = 3; existing = ['P101']
    { id: 'TC_WB_F5_U1_02', args: ["P1", 3, ["P101"]], expected: "E1" },
    // code = "P123456"; floor = 3; existing = ['P101']
    { id: 'TC_WB_F5_U1_03', args: ["P123456", 3, ["P101"]], expected: "E1" },
    // code = "A302"; floor = 3; existing = ['P101']
    { id: 'TC_WB_F5_U1_04', args: ["A302", 3, ["P101"]], expected: "E1" },
    // code = "P302"; floor = 3; existing = ['P302']
    { id: 'TC_WB_F5_U1_05', args: ["P302", 3, ["P302"]], expected: "E1" },
    // code = "P402"; floor = 3; existing = ['P101']
    { id: 'TC_WB_F5_U1_06', args: ["P402", 3, ["P101"]], expected: "E1" },
    // code = "P302"; floor = 3; existing = ['P101']
    { id: 'TC_WB_F5_U1_07', args: ["P302", 3, ["P101"]], expected: "OK" },
    // code = "P1001"; floor = 10; existing = ['P101']
    { id: 'TC_WB_F5_U1_08', args: ["P1001", 10, ["P101"]], expected: "OK" },
  ];
  test.each(cases)('$id → $expected', ({ args, expected }) => {
    expect(validateRoomCode(...args)).toBe(expected);
  });
});
 
describe('F5 - validateRoomSpec(): Kiểm tra tầng, giá niêm yết và sức chứa', () => {
  const cases = [
    // spec: floor = "" (các trường còn lại hợp lệ)
    { id: 'TC_WB_F5_U2_01', args: [{"floor": "", "price": 1200000, "capacity": 2}], expected: "E2" },
    // spec: floor = "abc" (các trường còn lại hợp lệ)
    { id: 'TC_WB_F5_U2_02', args: [{"floor": "abc", "price": 1200000, "capacity": 2}], expected: "E2" },
    // spec: floor = 0 (các trường còn lại hợp lệ)
    { id: 'TC_WB_F5_U2_03', args: [{"floor": 0, "price": 1200000, "capacity": 2}], expected: "E2" },
    // spec: floor = 16 (các trường còn lại hợp lệ)
    { id: 'TC_WB_F5_U2_04', args: [{"floor": 16, "price": 1200000, "capacity": 2}], expected: "E2" },
    // spec: price = "" (các trường còn lại hợp lệ)
    { id: 'TC_WB_F5_U2_05', args: [{"floor": 3, "price": "", "capacity": 2}], expected: "E3" },
    // spec: price = "abc" (các trường còn lại hợp lệ)
    { id: 'TC_WB_F5_U2_06', args: [{"floor": 3, "price": "abc", "capacity": 2}], expected: "E3" },
    // spec: price = 199999 (các trường còn lại hợp lệ)
    { id: 'TC_WB_F5_U2_07', args: [{"floor": 3, "price": 199999, "capacity": 2}], expected: "E3" },
    // spec: price = 50000001 (các trường còn lại hợp lệ)
    { id: 'TC_WB_F5_U2_08', args: [{"floor": 3, "price": 50000001, "capacity": 2}], expected: "E3" },
    // spec: capacity = "" (các trường còn lại hợp lệ)
    { id: 'TC_WB_F5_U2_09', args: [{"floor": 3, "price": 1200000, "capacity": ""}], expected: "E4" },
    // spec: capacity = "abc" (các trường còn lại hợp lệ)
    { id: 'TC_WB_F5_U2_10', args: [{"floor": 3, "price": 1200000, "capacity": "abc"}], expected: "E4" },
    // spec: capacity = 0 (các trường còn lại hợp lệ)
    { id: 'TC_WB_F5_U2_11', args: [{"floor": 3, "price": 1200000, "capacity": 0}], expected: "E4" },
    // spec: capacity = 9 (các trường còn lại hợp lệ)
    { id: 'TC_WB_F5_U2_12', args: [{"floor": 3, "price": 1200000, "capacity": 9}], expected: "E4" },
    // spec hợp lệ đầy đủ
    { id: 'TC_WB_F5_U2_13', args: [{"floor": 3, "price": 1200000, "capacity": 2}], expected: "OK" },
  ];
  test.each(cases)('$id → $expected', ({ args, expected }) => {
    expect(validateRoomSpec(...args)).toBe(expected);
  });
});
 
describe('F5 - validatePhoto(): Kiểm tra tệp ảnh phòng tải lên', () => {
  const cases = [
    // file = null (không tải ảnh)
    { id: 'TC_WB_F5_U3_01', args: [null], expected: "NOFILE" },
    // file = {name: "room", 1MB}
    { id: 'TC_WB_F5_U3_02', args: [{"name": "room", "sizeMB": 1}], expected: "E5" },
    // file = {name: "bang_gia.pdf", 1MB}
    { id: 'TC_WB_F5_U3_03', args: [{"name": "bang_gia.pdf", "sizeMB": 1}], expected: "E5" },
    // file = {name: "room.jpg", sizeMB: "abc"}
    { id: 'TC_WB_F5_U3_04', args: [{"name": "room.jpg", "sizeMB": "abc"}], expected: "E5" },
    // file = {name: "room.png", 5.1MB}
    { id: 'TC_WB_F5_U3_05', args: [{"name": "room.png", "sizeMB": 5.1}], expected: "E5" },
    // file = {name: "room.jpg", 2MB}
    { id: 'TC_WB_F5_U3_06', args: [{"name": "room.jpg", "sizeMB": 2}], expected: "OK" },
    // file = {name: "ROOM.PNG", 5MB}
    { id: 'TC_WB_F5_U3_07', args: [{"name": "ROOM.PNG", "sizeMB": 5}], expected: "OK" },
  ];
  test.each(cases)('$id → $expected', ({ args, expected }) => {
    expect(validatePhoto(...args)).toBe(expected);
  });
});
