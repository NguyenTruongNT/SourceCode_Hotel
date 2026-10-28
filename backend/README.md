# Backend Architecture (Mock Simulation)

Tài liệu mô tả kiến trúc mô phỏng Backend được tổ chức theo mô hình phân tầng chuẩn (**Layered Architecture - Routes / Controllers / Services / Validators**), hỗ trợ xử lý logic nghiệp vụ cho hệ thống Quản lý Khách sạn (Hotel Management).

---

## 1. Cấu trúc thư mục

```text
src/
├── app.js                         # Cấu hình Express app, middleware và gắn API routes
├── server.js                      # Entry point khởi chạy server mock (Port 5000)
│
├── controllers/                   # Tầng tiếp nhận request, gọi service & trả response
│   ├── booking.controller.js      # Điều hướng tính giá, kiểm tra trạng thái giữ chỗ
│   ├── checkin.controller.js      # Điều hướng thủ tục check-in & tính phụ thu sớm
│   ├── checkout.controller.js     # Điều hướng thủ tục check-out, tính phụ thu trễ & quyết toán bill
│   ├── room.controller.js         # Tiếp nhận thông tin cấu hình và tạo mới phòng
│   ├── search.controller.js       # Tiếp nhận và điều hướng tìm kiếm phòng
│   └── voucher.controller.js      # Tiếp nhận áp dụng mã voucher
│
├── services/                      # Tầng chứa toàn bộ logic nghiệp vụ (Business Logic gốc)
│   ├── booking.service.js         # (Gốc: f2.js) validateBookingForm, priceBooking, resolveHold
│   ├── checkin.service.js         # (Gốc: f3.js) verifyCheckin, validateAssignAndDeposit, earlyCheckinFee
│   ├── checkout.service.js        # (Gốc: f4.js) validateCheckout, calcLateFee, settleBill
│   ├── room.service.js            # (Gốc: f5.js) validateRoomCode, validateRoomSpec, validatePhoto
│   ├── search.service.js          # (Gốc: f1.js) validateSearchRequest, isRoomAvailable, summarizeSearch
│   └── voucher.service.js         # (Gốc: f6.js) validateVoucherForm, voucherStatus, redeemVoucher
│
├── validators/                    # Tầng kiểm tra ràng buộc dữ liệu (Validation Middleware)
│   ├── booking.validator.js       # Validate thông tin biểu mẫu đặt phòng
│   ├── checkin.validator.js       # Validate PNR, CCCD, phân phòng & tiền cọc
│   ├── checkout.validator.js      # Validate trạng thái phòng & minibar khi checkout
│   ├── room.validator.js          # Validate mã phòng, thông số phòng, định dạng ảnh
│   ├── search.validator.js        # Validate ngày nhận/trả phòng, số lượng khách
│   └── voucher.validator.js       # Validate mã giảm giá, hạn sử dụng, phần trăm
│
├── routes/                        # Tầng định tuyến API endpoints
│   ├── index.js                   # Gom tất cả các router con vào prefix `/api`
│   ├── booking.routes.js          # POST /api/bookings/{validate, quote, hold-status}
│   ├── checkin.routes.js          # POST /api/checkin/{verify, assign-deposit, process}
│   ├── checkout.routes.js         # POST /api/checkout/{validate, settle}
│   ├── room.routes.js             # POST /api/rooms/
│   ├── search.routes.js           # POST /api/search/rooms
│   └── voucher.routes.js          # POST /api/vouchers/{validate, redeem}
│
└── f1.js ... f6.js                # Các file re-export tương thích ngược phục vụ test/báo cáo cũ
```

---

## 2. Bảng ánh xạ nghiệp vụ (Domain Mapping)

| File gốc | Vị trí Service mới | Vị trí Controller & Route | Mô tả chức năng nghiệp vụ |
| :--- | :--- | :--- | :--- |
| `f1.js` | `services/search.service.js` | `search.controller.js` / `/api/search` | Tìm kiếm phòng trống, lọc loại phòng, tính số đêm & giá thấp nhất |
| `f2.js` | `services/booking.service.js` | `booking.controller.js` / `/api/bookings` | Xác thực thông tin khách hàng, tính toán cọc/chiết khấu, xử lý timeout giữ chỗ |
| `f3.js` | `services/checkin.service.js` | `checkin.controller.js` / `/api/checkin` | Xác thực nhận phòng (PNR/CCCD), gán thẻ khóa, tính phụ phí check-in sớm |
| `f4.js` | `services/checkout.service.js` | `checkout.controller.js` / `/api/checkout` | Kiểm tra trả phòng, kiểm kê minibar, tính phụ phí checkout trễ và thanh toán hóa đơn |
| `f5.js` | `services/room.service.js` | `room.controller.js` / `/api/rooms` | Xác thực mã phòng theo tầng, thông số giá/sức chứa, dung lượng ảnh phòng |
| `f6.js` | `services/voucher.service.js` | `voucher.controller.js` / `/api/vouchers` | Tạo & kiểm tra tính hợp lệ voucher, xét trạng thái kích hoạt, áp dụng voucher |

---

## 3. Tính tương thích ngược

Các file `src/f1.js` đến `src/f6.js` ở thư mục gốc `src/` được giữ lại và tự động re-export từ `src/services/*.service.js`. Do đó:
- Mọi script kiểm thử đơn vị (Unit Test) cũ hoặc mã quét source code (`scan.bat`) vẫn tiếp tục hoạt động chính xác mà không bị gãy tham chiếu.
