'use strict';
const { validateCheckout, calcLateFee, settleBill } = require('../src/f4');
 
describe('F4 - validateCheckout(): Kiểm tra phòng trả, số lượng minibar và phí hư hại', () => {
  const cases = [
    // room = null; minibar = []; damageFee = ""
    { id: 'TC_WB_F4_U1_01', args: [null, [], ""], expected: "E1" },
    // room = {Available}; minibar = []; damageFee = ""
    { id: 'TC_WB_F4_U1_02', args: [{"status": "Available"}, [], ""], expected: "E1" },
    // room = {Occupied}; minibar = [2, -1]; damageFee = ""
    { id: 'TC_WB_F4_U1_03', args: [{"status": "Occupied"}, [2, -1], ""], expected: "E2" },
    // room = {Occupied}; minibar = ['abc']; damageFee = ""
    { id: 'TC_WB_F4_U1_04', args: [{"status": "Occupied"}, ["abc"], ""], expected: "E2" },
    // room = {Occupied}; minibar = [51]; damageFee = ""
    { id: 'TC_WB_F4_U1_05', args: [{"status": "Occupied"}, [51], ""], expected: "E2" },
    // room = {Occupied}; minibar = []; damageFee = ""
    { id: 'TC_WB_F4_U1_06', args: [{"status": "Occupied"}, [], ""], expected: "OK:0" },
    // room = {Occupied}; minibar = [2, 3]; damageFee = null
    { id: 'TC_WB_F4_U1_07', args: [{"status": "Occupied"}, [2, 3], null], expected: "OK:5" },
    // room = {Occupied}; minibar = [1]; damageFee = "abc"
    { id: 'TC_WB_F4_U1_08', args: [{"status": "Occupied"}, [1], "abc"], expected: "E3" },
    // room = {Occupied}; minibar = [1]; damageFee = -50,000
    { id: 'TC_WB_F4_U1_09', args: [{"status": "Occupied"}, [1], -50000], expected: "E3" },
    // room = {Occupied}; minibar = [1]; damageFee = 150,000
    { id: 'TC_WB_F4_U1_10', args: [{"status": "Occupied"}, [1], 150000], expected: "OK:1" },
  ];
  test.each(cases)('$id → $expected', ({ args, expected }) => {
    expect(validateCheckout(...args)).toBe(expected);
  });
});
 
describe('F4 - calcLateFee(): Tính phụ thu trả phòng trễ', () => {
  const cases = [
    // time = "11:45"; nightPrice = 1,000,000
    { id: 'TC_WB_F4_U2_01', args: ["11:45", 1000000], expected: 0 },
    // time = "12:00"; nightPrice = 1,000,000
    { id: 'TC_WB_F4_U2_02', args: ["12:00", 1000000], expected: 0 },
    // time = "12:01"; nightPrice = 1,000,000
    { id: 'TC_WB_F4_U2_03', args: ["12:01", 1000000], expected: 300000 },
    // time = "15:00"; nightPrice = 1,000,000
    { id: 'TC_WB_F4_U2_04', args: ["15:00", 1000000], expected: 300000 },
    // time = "15:01"; nightPrice = 1,000,000
    { id: 'TC_WB_F4_U2_05', args: ["15:01", 1000000], expected: 500000 },
    // time = "18:00"; nightPrice = 1,000,000
    { id: 'TC_WB_F4_U2_06', args: ["18:00", 1000000], expected: 500000 },
    // time = "18:01"; nightPrice = 1,000,000
    { id: 'TC_WB_F4_U2_07', args: ["18:01", 1000000], expected: 1000000 },
  ];
  test.each(cases)('$id → $expected', ({ args, expected }) => {
    expect(calcLateFee(...args)).toBe(expected);
  });
});
 
describe('F4 - settleBill(): Quyết toán số dư khi trả phòng', () => {
  const cases = [
    // bill = {remain: 600,000, lateFee: 0, minibar: 0, damage: 0, deposit: 500,000, paid: true}
    { id: 'TC_WB_F4_U3_01', args: [{"remain": 600000, "lateFee": 0, "minibar": 0, "damage": 0, "deposit": 500000, "paid": true}], expected: "COLLECT:100000" },
    // bill = {remain: 600,000, lateFee: 0, minibar: 0, damage: 0, deposit: 500,000, paid: false}
    { id: 'TC_WB_F4_U3_02', args: [{"remain": 600000, "lateFee": 0, "minibar": 0, "damage": 0, "deposit": 500000, "paid": false}], expected: "E3" },
    // bill = {remain: 0, lateFee: 0, minibar: 90,000, damage: 200,000, deposit: 500,000, paid: true}
    { id: 'TC_WB_F4_U3_03', args: [{"remain": 0, "lateFee": 0, "minibar": 90000, "damage": 200000, "deposit": 500000, "paid": true}], expected: "REFUND:210000" },
    // bill = {remain: 500,000, lateFee: 0, minibar: 0, damage: 0, deposit: 500,000, paid: true}
    { id: 'TC_WB_F4_U3_04', args: [{"remain": 500000, "lateFee": 0, "minibar": 0, "damage": 0, "deposit": 500000, "paid": true}], expected: "EVEN" },
  ];
  test.each(cases)('$id → $expected', ({ args, expected }) => {
    expect(settleBill(...args)).toBe(expected);
  });
});
