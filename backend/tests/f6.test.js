'use strict';
const { validateVoucherForm, voucherStatus, redeemVoucher } = require('../src/f6');
 
describe('F6 - validateVoucherForm(): Kiểm tra biểu mẫu phát hành voucher', () => {
  const cases = [
    // form: title = null (các trường còn lại hợp lệ); activeCodes = ["HST2026"]; today = 11/10/2026
    { id: 'TC_WB_F6_U1_01', args: [{"title": null, "code": "SUMMER2026", "percent": 15, "start": "2026-10-11", "end": "2026-11-10", "quantity": 500}, ["HST2026"], "2026-10-11"], expected: "E1" },
    // form: title = "Hè" (các trường còn lại hợp lệ); activeCodes = ["HST2026"]; today = 11/10/2026
    { id: 'TC_WB_F6_U1_02', args: [{"title": "Hè", "code": "SUMMER2026", "percent": 15, "start": "2026-10-11", "end": "2026-11-10", "quantity": 500}, ["HST2026"], "2026-10-11"], expected: "E1" },
    // form: title = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" (các trường còn lại hợp lệ); activeCodes = ["HST2026"]; today = 11/10/2026
    { id: 'TC_WB_F6_U1_03', args: [{
      "title": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", 
      "code": "SUMMER2026", "percent": 15, "start": "2026-10-11", "end": "2026-11-10", "quantity": 500}, ["HST2026"], "2026-10-11"], expected: "E1" },
    // form: title = "<b>Sale</b> mùa hè" (các trường còn lại hợp lệ); activeCodes = ["HST2026"]; today = 11/10/2026
    { id: 'TC_WB_F6_U1_04', args: [{"title": "<b>Sale</b> mùa hè", "code": "SUMMER2026", "percent": 15, "start": "2026-10-11", "end": "2026-11-10", "quantity": 500}, ["HST2026"], "2026-10-11"], expected: "E1" },
    // form: title = "Khuyến mãi SCRIPT mới" (các trường còn lại hợp lệ); activeCodes = ["HST2026"]; today = 11/10/2026
    { id: 'TC_WB_F6_U1_05', args: [{"title": "Khuyến mãi SCRIPT mới", "code": "SUMMER2026", "percent": 15, "start": "2026-10-11", "end": "2026-11-10", "quantity": 500}, ["HST2026"], "2026-10-11"], expected: "E1" },
    // form: code = "" (các trường còn lại hợp lệ); activeCodes = ["HST2026"]; today = 11/10/2026
    { id: 'TC_WB_F6_U1_06', args: [{"title": "Chào hè rực rỡ 2026", "code": "", "percent": 15, "start": "2026-10-11", "end": "2026-11-10", "quantity": 500}, ["HST2026"], "2026-10-11"], expected: "E2" },
    // form: code = "hst2026" (các trường còn lại hợp lệ); activeCodes = ["HST2026"]; today = 11/10/2026
    { id: 'TC_WB_F6_U1_07', args: [{"title": "Chào hè rực rỡ 2026", "code": "hst2026", "percent": 15, "start": "2026-10-11", "end": "2026-11-10", "quantity": 500}, ["HST2026"], "2026-10-11"], expected: "E2" },
    // form: code = "HST2026" (các trường còn lại hợp lệ); activeCodes = ["HST2026"]; today = 11/10/2026
    { id: 'TC_WB_F6_U1_08', args: [{"title": "Chào hè rực rỡ 2026", "code": "HST2026", "percent": 15, "start": "2026-10-11", "end": "2026-11-10", "quantity": 500}, ["HST2026"], "2026-10-11"], expected: "E2" },
    // form: percent = "" (các trường còn lại hợp lệ); activeCodes = ["HST2026"]; today = 11/10/2026
    { id: 'TC_WB_F6_U1_09', args: [{"title": "Chào hè rực rỡ 2026", "code": "SUMMER2026", "percent": "", "start": "2026-10-11", "end": "2026-11-10", "quantity": 500}, ["HST2026"], "2026-10-11"], expected: "E3" },
    // form: percent = "abc" (các trường còn lại hợp lệ); activeCodes = ["HST2026"]; today = 11/10/2026
    { id: 'TC_WB_F6_U1_10', args: [{"title": "Chào hè rực rỡ 2026", "code": "SUMMER2026", "percent": "abc", "start": "2026-10-11", "end": "2026-11-10", "quantity": 500}, ["HST2026"], "2026-10-11"], expected: "E3" },
    // form: percent = 0 (các trường còn lại hợp lệ); activeCodes = ["HST2026"]; today = 11/10/2026
    { id: 'TC_WB_F6_U1_11', args: [{"title": "Chào hè rực rỡ 2026", "code": "SUMMER2026", "percent": 0, "start": "2026-10-11", "end": "2026-11-10", "quantity": 500}, ["HST2026"], "2026-10-11"], expected: "E3" },
    // form: percent = 71 (các trường còn lại hợp lệ); activeCodes = ["HST2026"]; today = 11/10/2026
    { id: 'TC_WB_F6_U1_12', args: [{"title": "Chào hè rực rỡ 2026", "code": "SUMMER2026", "percent": 71, "start": "2026-10-11", "end": "2026-11-10", "quantity": 500}, ["HST2026"], "2026-10-11"], expected: "E3" },
    // form: start = "" (các trường còn lại hợp lệ); activeCodes = ["HST2026"]; today = 11/10/2026
    { id: 'TC_WB_F6_U1_13', args: [{"title": "Chào hè rực rỡ 2026", "code": "SUMMER2026", "percent": 15, "start": "", "end": "2026-11-10", "quantity": 500}, ["HST2026"], "2026-10-11"], expected: "E4" },
    // form: start = "2026-10-10" (các trường còn lại hợp lệ); activeCodes = ["HST2026"]; today = 11/10/2026
    { id: 'TC_WB_F6_U1_14', args: [{"title": "Chào hè rực rỡ 2026", "code": "SUMMER2026", "percent": 15, "start": "2026-10-10", "end": "2026-11-10", "quantity": 500}, ["HST2026"], "2026-10-11"], expected: "E4" },
    // form: end = "" (các trường còn lại hợp lệ); activeCodes = ["HST2026"]; today = 11/10/2026
    { id: 'TC_WB_F6_U1_15', args: [{"title": "Chào hè rực rỡ 2026", "code": "SUMMER2026", "percent": 15, "start": "2026-10-11", "end": "", "quantity": 500}, ["HST2026"], "2026-10-11"], expected: "E5" },
    // form: end = "2026-10-05" (các trường còn lại hợp lệ); activeCodes = ["HST2026"]; today = 11/10/2026
    { id: 'TC_WB_F6_U1_16', args: [{"title": "Chào hè rực rỡ 2026", "code": "SUMMER2026", "percent": 15, "start": "2026-10-11", "end": "2026-10-05", "quantity": 500}, ["HST2026"], "2026-10-11"], expected: "E5" },
    // form: quantity = "abc" (các trường còn lại hợp lệ); activeCodes = ["HST2026"]; today = 11/10/2026
    { id: 'TC_WB_F6_U1_17', args: [{"title": "Chào hè rực rỡ 2026", "code": "SUMMER2026", "percent": 15, "start": "2026-10-11", "end": "2026-11-10", "quantity": "abc"}, ["HST2026"], "2026-10-11"], expected: "E6" },
    // form: quantity = 0 (các trường còn lại hợp lệ); activeCodes = ["HST2026"]; today = 11/10/2026
    { id: 'TC_WB_F6_U1_18', args: [{"title": "Chào hè rực rỡ 2026", "code": "SUMMER2026", "percent": 15, "start": "2026-10-11", "end": "2026-11-10", "quantity": 0}, ["HST2026"], "2026-10-11"], expected: "E6" },
    // form: quantity = 10001 (các trường còn lại hợp lệ); activeCodes = ["HST2026"]; today = 11/10/2026
    { id: 'TC_WB_F6_U1_19', args: [{"title": "Chào hè rực rỡ 2026", "code": "SUMMER2026", "percent": 15, "start": "2026-10-11", "end": "2026-11-10", "quantity": 10001}, ["HST2026"], "2026-10-11"], expected: "E6" },
    // form hợp lệ đầy đủ; activeCodes = ["HST2026"]; today = 11/10/2026
    { id: 'TC_WB_F6_U1_20', args: [{"title": "Chào hè rực rỡ 2026", "code": "SUMMER2026", "percent": 15, "start": "2026-10-11", "end": "2026-11-10", "quantity": 500}, ["HST2026"], "2026-10-11"], expected: "OK" },
  ];
  test.each(cases)('$id → $expected', ({ args, expected }) => {
    expect(validateVoucherForm(...args)).toBe(expected);
  });
});
 
describe('F6 - voucherStatus(): Xác định trạng thái vòng đời voucher', () => {
  const cases = [
    // v: suspended = true (các trường còn lại hợp lệ); today = 11/10/2026 (mặc định: 10/500, 01/10–31/12/2026)
    { id: 'TC_WB_F6_U2_01', args: [{"suspended": true, "used": 10, "quantity": 500, "start": "2026-10-01", "end": "2026-12-31"}, "2026-10-11"], expected: "Suspended" },
    // v: used = 500 (các trường còn lại hợp lệ); today = 11/10/2026 (mặc định: 10/500, 01/10–31/12/2026)
    { id: 'TC_WB_F6_U2_02', args: [{"suspended": false, "used": 500, "quantity": 500, "start": "2026-10-01", "end": "2026-12-31"}, "2026-10-11"], expected: "Depleted" },
    // v: end = "2026-10-10" (các trường còn lại hợp lệ); today = 11/10/2026 (mặc định: 10/500, 01/10–31/12/2026)
    { id: 'TC_WB_F6_U2_03', args: [{"suspended": false, "used": 10, "quantity": 500, "start": "2026-10-01", "end": "2026-10-10"}, "2026-10-11"], expected: "Expired" },
    // v: start = "2026-10-20" (các trường còn lại hợp lệ); today = 11/10/2026 (mặc định: 10/500, 01/10–31/12/2026)
    { id: 'TC_WB_F6_U2_04', args: [{"suspended": false, "used": 10, "quantity": 500, "start": "2026-10-20", "end": "2026-12-31"}, "2026-10-11"], expected: "Scheduled" },
    // v hợp lệ đầy đủ; today = 11/10/2026 (mặc định: 10/500, 01/10–31/12/2026)
    { id: 'TC_WB_F6_U2_05', args: [{"suspended": false, "used": 10, "quantity": 500, "start": "2026-10-01", "end": "2026-12-31"}, "2026-10-11"], expected: "Active" },
  ];
  test.each(cases)('$id → $expected', ({ args, expected }) => {
    expect(voucherStatus(...args)).toBe(expected);
  });
});
 
describe('F6 - redeemVoucher(): Áp dụng tối đa một voucher cho đơn đặt phòng', () => {
  const cases = [
    // codes = ['HST2026', 'OLD']; store = {HST2026: Active 01/10–31/12, OLD: hết hạn 05/10}; today = 11/10/2026
    { id: 'TC_WB_F6_U3_01', args: [["HST2026", "OLD"], {
      "HST2026": {"suspended": false, "used": 10, "quantity": 500, "start": "2026-10-01", "end": "2026-12-31"}, 
      "OLD": {"suspended": false, "used": 10, "quantity": 500, "start": "2026-09-01", "end": "2026-10-05"}}, "2026-10-11"], expected: "REJECT_MULTI" },
    // codes = []; store = {HST2026: Active 01/10–31/12, OLD: hết hạn 05/10}; today = 11/10/2026
    { id: 'TC_WB_F6_U3_02', args: [[], {
      "HST2026": {"suspended": false, "used": 10, "quantity": 500, "start": "2026-10-01", "end": "2026-12-31"}, 
      "OLD": {"suspended": false, "used": 10, "quantity": 500, "start": "2026-09-01", "end": "2026-10-05"}}, "2026-10-11"], expected: "NONE" },
    // codes = ['XX']; store = {HST2026: Active 01/10–31/12, OLD: hết hạn 05/10}; today = 11/10/2026
    { id: 'TC_WB_F6_U3_03', args: [["XX"], {
      "HST2026": {"suspended": false, "used": 10, "quantity": 500, "start": "2026-10-01", "end": "2026-12-31"}, 
      "OLD": {"suspended": false, "used": 10, "quantity": 500, "start": "2026-09-01", "end": "2026-10-05"}}, "2026-10-11"], expected: "E5" },
    // codes = ['OLD']; store = {HST2026: Active 01/10–31/12, OLD: hết hạn 05/10}; today = 11/10/2026
    { id: 'TC_WB_F6_U3_04', args: [["OLD"], {
      "HST2026": {"suspended": false, "used": 10, "quantity": 500, "start": "2026-10-01", "end": "2026-12-31"}, 
      "OLD": {"suspended": false, "used": 10, "quantity": 500, "start": "2026-09-01", "end": "2026-10-05"}}, "2026-10-11"], expected: "E5" },
    // codes = ['HST2026']; store = {HST2026: Active 01/10–31/12, OLD: hết hạn 05/10}; today = 11/10/2026
    { id: 'TC_WB_F6_U3_05', args: [["HST2026"], {
      "HST2026": {"suspended": false, "used": 10, "quantity": 500, "start": "2026-10-01", "end": "2026-12-31"},
      "OLD": {"suspended": false, "used": 10, "quantity": 500, "start": "2026-09-01", "end": "2026-10-05"}}, "2026-10-11"], expected: "APPLIED:HST2026" },
  ];
  test.each(cases)('$id → $expected', ({ args, expected }) => {
    expect(redeemVoucher(...args)).toBe(expected);
  });
});
