# 🏨 HỆ THỐNG QUẢN LÝ KHÁCH SẠN HST (HST HOTEL) - BACKEND WEB API
> **Bài tập lớn môn học:** Kiểm thử và Đảm bảo chất lượng phần mềm  
> **Lớp:** 65KTPM - Nhóm: 10 - Trường Đại học Thủy Lợi  
> **Tài liệu tham chiếu:** `65KTPM_Nhom10_KiemThu_HopDen_HopTrang.docx`  
> **Thành viên phụ trách Backend:** **Nguyễn Văn Trường** (MSV: **2351170625**)  
> **Nhiệm vụ đảm nhiệm:**  
> - **F1:** Tra cứu & Tìm kiếm phòng trống trực tuyến nâng cao  
> - **F3:** Xử lý Nhận phòng tại quầy (Check-in)  
> - **F4:** Xử lý Trả phòng & Quyết toán hóa đơn (Check-out)

---

## 📑 MỤC LỤC
1. [Giới thiệu tổng quan](#1-giới-thiệu-tổng-quan)
2. [Cấu trúc cây thư mục Backend](#2-cấu-trúc-cây-thư-mục-backend)
3. [Bảng ánh xạ 1-1 với Báo cáo Kiểm thử Hộp trắng & Hộp đen](#3-bảng-ánh-xạ-1-1-với-báo-cáo-kiểm-thử)
4. [Hướng dẫn Cài đặt & Khởi chạy Server](#4-hướng-dẫn-cài-đặt--khởi-chạy-server)
5. [Hướng dẫn Chạy Kiểm thử Tự động (159/159 Test Cases Passed)](#5-hướng-dẫn-chạy-kiểm-thử-tự-động)
6. [Tài liệu Chi tiết API Endpoints & Mẫu Dữ liệu](#6-tài-liệu-chi-tiết-api-endpoints--mẫu-dữ-liệu)
7. [Kịch bản Kiểm thử Nghiệp vụ Thực tế (Workflow Demo)](#7-kịch-bản-kiểm-thử-nghiệp-vụ-thực-tế)

---

## 1. Giới thiệu tổng quan

Dự án Backend được xây dựng bằng **C# trên nền tảng .NET 9.0 (ASP.NET Core Web API)**, tuân thủ nguyên tắc thiết kế sạch (Clean Architecture), tách biệt tuyệt đối giữa:
- **Tầng Kiểm thử Hộp trắng (Core White-Box Units)**: Chứa các thuật toán xử lý logic độc lập, ánh xạ từng câu lệnh (Node), từng nhánh rẽ (Decision Point), và từng điều kiện con (Sub-condition) theo đúng Đồ thị dòng điều khiển (CFG - Control Flow Graph) trong bản báo cáo Word.
- **Tầng Dịch vụ Nghiệp vụ (Service Layer)**: Kết hợp các đơn vị kiểm thử hộp trắng để xử lý trọn vẹn quy trình khách sạn (State Transition giữa Buồng phòng và Đơn đặt phòng).
- **Tầng Dữ liệu (Repository Layer)**: Sử dụng cấu trúc lưu trữ bộ nhớ đa luồng an toàn (`ConcurrentDictionary`), được nạp sẵn dữ liệu kiểm thử (Seed Data) chuẩn xác với kịch bản trong báo cáo.
- **Tầng Giao diện Lập trình (API Controllers & Swagger UI)**: Cung cấp đầy đủ RESTful API, tài liệu hóa trực quan với Swagger OpenAPI.

---

## 2. Cấu trúc cây thư mục Backend

```
backend/
├── HSTHotel.sln                                # Solution quản lý toàn bộ Backend
├── README.md                                   # Tài liệu hướng dẫn chi tiết
│
├── HSTHotel.Api/                               # Dự án ASP.NET Core 9.0 Web API
│   ├── Controllers/                            # Lớp Controller tiếp nhận HTTP Request
│   │   ├── RoomSearchController.cs             # API F1: Tra cứu phòng trống (/api/v1/roomsearch)
│   │   ├── CheckInController.cs                # API F3: Xử lý Check-in tại quầy (/api/v1/checkin)
│   │   └── CheckOutController.cs               # API F4: Xử lý Check-out & Quyết toán (/api/v1/checkout)
│   │
│   ├── Core/                                   # Lõi thuật toán & Quy chuẩn nghiệp vụ
│   │   ├── Constants/
│   │   │   └── HotelConstants.cs               # Định nghĩa các hằng số, mã lỗi E1-E4, S1-S2, chính sách giờ/cọc
│   │   ├── Utilities/
│   │   │   └── JsonConversionHelper.cs         # Hỗ trợ chuyển đổi an toàn JSON/JsonElement sang kiểu số thực/nguyên
│   │   └── WhiteBox/                           # [TRỌNG TÂM] 16 hàm kiểm thử hộp trắng chuẩn 1-1 với CFG trong DOCX
│   │       ├── F1WhiteBoxUnits.cs              # 5 hàm F1: validateCheckIn, validateCheckOut, validateGuests, isOverlap, matchRoom
│   │       ├── F3WhiteBoxUnits.cs              # 6 hàm F3: validatePNR, verifyCCCD, validateRoomAssign, validateDeposit, validateKeycard, earlyCheckinRate
│   │       └── F4WhiteBoxUnits.cs              # 5 hàm F4: validateCheckoutRoom, validateMinibar, validateDamageFee, calcLateFeeRate, calcSettlement
│   │
│   ├── Models/                                 # Cấu trúc dữ liệu
│   │   ├── Entities/                           # Các thực thể dữ liệu nghiệp vụ
│   │   │   ├── Room.cs                         # Thông tin buồng phòng (Clean, Occupied, Dirty, Active...)
│   │   │   ├── Booking.cs                      # Thông tin đơn đặt phòng (Confirmed, In-house, Checked-out...)
│   │   │   ├── MinibarProduct.cs               # Danh mục mặt hàng minibar và đơn giá
│   │   │   └── Invoice.cs                      # Hóa đơn thanh lý & quyết toán khi trả phòng
│   │   └── DTOs/                               # Data Transfer Objects
│   │       ├── Common/ApiResponse.cs           # Chuẩn hóa vỏ bọc phản hồi JSON ApiResponse<T>
│   │       ├── F1_Search/                      # RoomSearchRequest, RoomSearchResponse, AvailableRoomDto
│   │       ├── F3_CheckIn/                     # PnrLookupResponse, EarlyCheckInEstimateDto, CheckInResultResponse
│   │       └── F4_CheckOut/                    # CheckOutPreCheckResponse, CheckOutExecutionRequest, CheckOutResultResponse
│   │
│   ├── Services/                               # Tầng xử lý Logic nghiệp vụ
│   │   ├── Interfaces/                         # IRoomSearchService, ICheckInService, ICheckOutService
│   │   └── Implementations/                    # RoomSearchService, CheckInService, CheckOutService
│   │
│   ├── Data/                                   # Tầng lưu trữ dữ liệu
│   │   ├── IHotelRepository.cs                 # Giao diện trừu tượng hóa kho dữ liệu
│   │   └── InMemoryHotelRepository.cs          # Kho dữ liệu bộ nhớ Thread-Safe, nạp sẵn kịch bản kiểm thử
│   │
│   ├── Properties/
│   │   └── launchSettings.json                 # Cấu hình cổng chạy ứng dụng (http://localhost:5145)
│   ├── appsettings.json                        # Cấu hình ứng dụng
│   ├── Program.cs                              # Điểm khởi động, DI, Swagger 6.6.2, CORS cho Next.js
│   └── HSTHotel.Api.csproj                     # Tệp cấu hình gói thư viện dự án Web API
│
└── HSTHotel.Tests/                             # Dự án xUnit Test tự động (159 ca kiểm thử)
    ├── F1_Tests/
    │   ├── F1_WhiteBoxTests.cs                 # Kiểm thử độ đo C1, C2, C3 cho F1 (28 ca)
    │   └── F1_BlackBoxTests.cs                 # Kiểm thử hộp đen TC_F1_01 -> TC_F1_09 (9 ca)
    ├── F3_Tests/
    │   ├── F3_WhiteBoxTests.cs                 # Kiểm thử độ đo C1, C2, C3 cho F3 (37 ca)
    │   └── F3_BlackBoxTests.cs                 # Kiểm thử hộp đen TC_F3_01 -> TC_F3_07 (7 ca)
    └── F4_Tests/
        ├── F4_WhiteBoxTests.cs                 # Kiểm thử độ đo C1, C2, C3 cho F4 (30 ca)
        └── F4_BlackBoxTests.cs                 # Kiểm thử hộp đen TC_F4_01 -> TC_F4_07 (7 ca)
```

---

## 3. Bảng ánh xạ 1-1 với Báo cáo Kiểm thử

### 3.1. Chức năng F1: Tra cứu & Tìm kiếm phòng trống (Mục 3.1 & 3.2 trong DOCX)
| Đơn vị kiểm thử | Cơ sở đặc tả trong DOCX | Số nút | Điểm QĐ | V(G) | Độ đo đạt được | Kết quả trả về |
|:---|:---|:---:|:---:|:---:|:---:|:---|
| `validateCheckIn(checkIn, today)` | Bắt buộc chọn, định dạng `YYYY-MM-DD`, `>= today` (BR_F1_01) | 6 | 2 | 3 | C1, C2, C3 | `E1` / `OK` |
| `validateCheckOut(checkIn, checkOut)` | Bắt buộc chọn, định dạng `YYYY-MM-DD`, `> checkIn` ít nhất 1 đêm | 6 | 2 | 3 | C1, C2, C3, BVA | `E2` / `OK` |
| `validateGuests(guests)` | Số nguyên từ 1 đến 10 khách, bắt buộc nhập | 9 | 3 | 4 | C1, C2, C3, BVA | `E3` / `OK` |
| `isOverlap(want, b)` | Trùng lịch nếu đơn `Confirmed`/`In-house` giao thoa ngày | 6 | 2 | 3 | C1, C2, C3 | `true` / `false` |
| `matchRoom(room, req)` | Phòng `Active`, đủ sức chứa, đúng hạng phòng hoặc `ALL` | 8 | 3 | 4 | C1, C2, C3 | `true` / `false` |
* **Mã đầu ra tổng thể:** `S1` (Có phòng trống khả dụng), `S2` (Hợp lệ nhưng khách sạn đã kín phòng).

### 3.2. Chức năng F3: Xử lý Nhận phòng tại quầy (Mục 3.5 & 3.6 trong DOCX)
| Đơn vị kiểm thử | Cơ sở đặc tả trong DOCX | Số nút | Điểm QĐ | V(G) | Độ đo đạt được | Kết quả trả về |
|:---|:---|:---:|:---:|:---:|:---:|:---|
| `validatePNR(pnr, booking)` | Định dạng `^HST\d{5}$`, tồn tại và trạng thái `Confirmed` | 8 | 3 | 4 | C1, C2, C3 | `E1` / `OK` |
| `verifyCCCD(input, booking)` | Đúng 12 số và trùng khớp với CCCD trong hồ sơ đặt | 6 | 2 | 3 | C1, C2, C3 | `E2` / `OK` |
| `validateRoomAssign(room, booking)` | Đúng loại phòng đã đặt và trạng thái buồng phòng là `Clean` | 6 | 2 | 3 | C1, C2, C3 | `E3` / `OK` |
| `validateDeposit(amount)` | Tiền cọc tài sản bắt buộc nhập, là số `>= 500,000 VNĐ` | 9 | 3 | 4 | C1, C2, C3, BVA | `E4` / `OK` |
| `validateKeycard(code)` | Quét thẻ RFID gồm 6 đến 10 ký tự Hex (`^[0-9A-Fa-f]+$`) | 8 | 3 | 4 | C1, C2, C3, BVA | `BLOCK` / `OK` |
| `earlyCheckinRate(time, hasCleanRoom)` | Trước 14:00: 09:00-14:00 phụ thu 30%; 06:00-09:00 phụ thu 50% | 9 | 3 | 4 | C1, C2, C3, BVA | `0` / `0.3` / `0.5` / `-1` |
* **Chuyển đổi trạng thái (State Transition):** Sau khi check-in thành công (`S1`), Đơn đặt phòng chuyển thành `In-house`, Phòng chuyển thành `Occupied`.

### 3.3. Chức năng F4: Xử lý Trả phòng & Quyết toán (Mục 3.7 & 3.8 trong DOCX)
| Đơn vị kiểm thử | Cơ sở đặc tả trong DOCX | Số nút | Điểm QĐ | V(G) | Độ đo đạt được | Kết quả trả về |
|:---|:---|:---:|:---:|:---:|:---:|:---|
| `validateCheckoutRoom(roomNo, room)` | Phòng chọn trả bắt buộc đang có khách lưu trú (`Occupied`) | 6 | 2 | 3 | C1, C2, C3 | `E1` / `OK` |
| `validateMinibar(qty)` | Số lượng đồ uống tiêu thụ là số nguyên từ `0 đến 50` món | 9 | 3 | 4 | C1, C2, C3, BVA | `E2` / `OK` |
| `validateDamageFee(fee)` | Phí đền bù hư hại tài sản là số thực `>= 0` (mặc định 0đ) | 7 | 2 | 3 | C1, C2, C3, BVA | `E3` / `OK` |
| `calcLateFeeRate(time)` | Sau 12:00: 12:01-15:00 phụ thu 30%; 15:01-18:00 phụ thu 50%; >18:00 (100%) | 9 | 3 | 4 | C1, C2, BVA | `0` / `0.3` / `0.5` / `1.0` |
| `calcSettlement(remain, lateFee, minibar, damage)` | `total = remain + lateFee + minibar + damage - 500,000` | 7 | 2 | 3 | C1, C2 | `COLLECT` / `REFUND` / `EVEN` |
* **Chuyển đổi trạng thái:** Sau khi check-out thành công (`S1`), Đơn đặt phòng chuyển thành `Checked-out`, Phòng chuyển ngay thành `Dirty` (BR_F4_02) để buồng phòng dọn dẹp.

---

## 4. Hướng dẫn Cài đặt & Khởi chạy Server

### 4.1. Yêu cầu môi trường
- Hệ điều hành: Windows / macOS / Linux
- Đã cài đặt **.NET 9.0 SDK** (kiểm tra bằng lệnh `dotnet --version` >= 9.0.xxx).

### 4.2. Khởi chạy Web API Server
Từ thư mục gốc dự án, mở Terminal (PowerShell hoặc CMD) và thực hiện:
```powershell
dotnet run --project backend/HSTHotel.Api
```

Server sẽ khởi động và thông báo:
```text
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5145
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

### 4.3. Truy cập Swagger UI trực quan
Mở trình duyệt web bất kỳ và truy cập vào:
👉 **[http://localhost:5145](http://localhost:5145)**

Tại đây, bạn có thể xem đầy đủ đặc tả từng API, mô tả lỗi và bấm **"Try it out"** để gửi dữ liệu thử nghiệm trực tiếp ngay trên trình duyệt mà không cần cài thêm công cụ bên ngoài.

---

## 5. Hướng dẫn Chạy Kiểm thử Tự động

Toàn bộ các ca kiểm thử trong báo cáo Word đã được lập trình thành **159 automated unit tests** bằng xUnit Framework.

### Lệnh thực thi:
Tại thư mục gốc dự án:
```powershell
dotnet test backend/HSTHotel.sln
```

### Kết quả kỳ vọng:
```text
Starting test execution, please wait...
A total of 1 test files matched the specified pattern.

Passed!  - Failed: 0, Passed: 159, Skipped: 0, Total: 159, Duration: ~100 ms - HSTHotel.Tests.dll (net9.0)
```

### Chi tiết các tệp kiểm thử trong `HSTHotel.Tests`:
- `F1_Tests/F1_WhiteBoxTests.cs` (28 tests): Độ đo C1, C2, C3 cho 5 hàm đơn vị của F1.
- `F1_Tests/F1_BlackBoxTests.cs` (9 tests): `TC_F1_01` đến `TC_F1_09` (tìm kiếm ngày biên, số khách biên, hết phòng).
- `F3_Tests/F3_WhiteBoxTests.cs` (37 tests): Độ đo C1, C2, C3 cho 6 hàm đơn vị của F3.
- `F3_Tests/F3_BlackBoxTests.cs` (7 tests): `TC_F3_01` đến `TC_F3_07` (đúng giờ, cọc cao, sai PNR, lệch CCCD, phòng bẩn, cọc thiếu).
- `F4_Tests/F4_WhiteBoxTests.cs` (30 tests): Độ đo C1, C2, C3 cho 5 hàm đơn vị của F4.
- `F4_Tests/F4_BlackBoxTests.cs` (7 tests): `TC_F4_01` đến `TC_F4_07` (đúng giờ, trả trễ 12:01, 15:01, 18:05, tiêu thụ minibar, đền bù hư hại, phòng trống).

---

## 6. Tài liệu Chi tiết API Endpoints & Mẫu Dữ liệu

### 🔹 F1: Tra cứu & Tìm kiếm phòng trống
* **Endpoint:** `POST /api/v1/RoomSearch`
* **Mẫu Request (Tìm 2 khách từ 12/10 đến 14/10/2026):**
```json
{
  "checkIn": "2026-10-12",
  "checkOut": "2026-10-14",
  "guests": 2,
  "roomType": "ALL",
  "referenceToday": "2026-10-11"
}
```
* **Mẫu Response thành công (Mã S1):**
```json
{
  "success": true,
  "code": "S1",
  "message": "Tìm thấy danh sách phòng khả dụng phù hợp.",
  "data": {
    "checkIn": "2026-10-12",
    "checkOut": "2026-10-14",
    "guests": 2,
    "selectedRoomType": "ALL",
    "totalAvailableRooms": 10,
    "rooms": [
      {
        "id": "201",
        "name": "Phòng Standard 201",
        "type": "Standard",
        "capacity": 2,
        "pricePerNight": 750000,
        "size": "25m²"
      }
    ]
  }
}
```
* **Mẫu Response lỗi khi chọn ngày quá khứ (Mã E1):**
```json
{
  "success": false,
  "code": "E1",
  "message": "Ngày nhận phòng không thể nhỏ hơn ngày hiện tại!"
}
```

---

### 🔹 F3: Nhận phòng tại quầy (Check-in)
* **Endpoint 1:** Tra cứu mã đặt phòng: `GET /api/v1/CheckIn/lookup/{pnr}`
  * Ví dụ: `GET /api/v1/CheckIn/lookup/HST10234`
  * Trả về thông tin khách Nguyễn Văn Huỳnh, đã cọc 1,200,000đ, còn thiếu 1,200,000đ và danh sách các phòng sạch sẵn sàng gán.
* **Endpoint 2:** Ước tính phụ thu nhận phòng sớm: `POST /api/v1/CheckIn/estimate-early`
```json
{
  "pnr": "HST10234",
  "checkInTime": "10:00"
}
```
  * Trả về phụ thu 30% giá phòng (do đến từ 09:00 - 13:59 và có sẵn phòng sạch).
* **Endpoint 3:** Xác nhận Check-in và gán phòng: `POST /api/v1/CheckIn/confirm`
```json
{
  "pnr": "HST10234",
  "cccd": "001202005991",
  "assignedRoomNumber": "302",
  "securityDepositAmount": 500000,
  "keycardCode": "A1B2C3",
  "paymentMethod": "Tiền mặt",
  "checkInTime": "14:00"
}
```
* **Mẫu Response thành công (Mã S1):**
```json
{
  "success": true,
  "code": "S1",
  "message": "Check-in thành công! Phòng đã được gán và bàn giao thẻ từ cho khách hàng.",
  "data": {
    "pnr": "HST10234",
    "guestName": "Nguyễn Văn Huỳnh",
    "roomNumber": "302",
    "roomType": "Deluxe",
    "keycardCode": "A1B2C3",
    "securityDeposit": 500000,
    "bookingStatus": "In-house",
    "roomStatus": "Occupied",
    "receiptNumber": "RC-20261012113300-302"
  }
}
```

---

### 🔹 F4: Trả phòng & Quyết toán hóa đơn (Check-out)
* **Endpoint 1:** Kiểm tra phòng và lấy bảng kê chi phí tạm tính: `POST /api/v1/CheckOut/precheck`
```json
{
  "roomNumber": "202",
  "checkOutTime": "12:01"
}
```
  * Trả về chi phí tiền phòng còn lại, phụ thu trễ 30% do trả lúc 12:01, tiền cọc 500k và menu đồ uống minibar.
* **Endpoint 2:** Hoàn tất Check-out & Quyết toán: `POST /api/v1/CheckOut/confirm`
```json
{
  "roomNumber": "202",
  "checkOutTime": "12:01",
  "minibarUsage": [
    { "productName": "Bia", "quantity": 3 },
    { "productName": "Nước suối", "quantity": 2 }
  ],
  "damageFee": 150000,
  "settlementPaymentMethod": "Tiền mặt"
}
```
* **Mẫu Response thành công (Mã S1):**
```json
{
  "success": true,
  "code": "S1",
  "message": "Xử lý Check-out và quyết toán hóa đơn hoàn tất thành công!",
  "data": {
    "invoiceId": "INV-20261012113347-202",
    "roomNumber": "202",
    "guestName": "Nguyễn Văn Nam",
    "remainingRoomCharge": 500000,
    "lateFeeRate": 0.3,
    "lateFeeAmount": 225000,
    "minibarTotal": 120000,
    "damageFee": 150000,
    "securityDepositDeducted": 500000,
    "settlementDifference": 495000,
    "settlementType": "COLLECT",
    "settlementMessage": "Khách hàng cần thanh toán thêm số dư: 495,000 VNĐ.",
    "roomStatusAfterCheckOut": "Dirty",
    "bookingStatusAfterCheckOut": "Checked-out"
  }
}
```

---

## 7. Kịch bản Kiểm thử Nghiệp vụ Thực tế

Quy trình trải nghiệm xuyên suốt cả 3 chức năng:

1. **Bước 1 (F1 - Khách tìm phòng):**
   - Khách hàng tìm phòng từ ngày `2026-10-12` đến `2026-10-14` cho 2 người lớn (`POST /api/v1/RoomSearch`).
   - Hệ thống quét CSDL lọc ra các phòng còn trống (trạng thái `Clean/Available` và không bị trùng lịch).
2. **Bước 2 (F3 - Khách đến quầy Check-in):**
   - Lễ tân nhập mã `HST10234` để tra cứu thông tin đặt phòng (`GET /api/v1/CheckIn/lookup/HST10234`).
   - Lễ tân đối chiếu CCCD `001202005991`, chọn phòng sạch `302`, thu tiền cọc `500,000đ` và quẹt thẻ từ `A1B2C3` (`POST /api/v1/CheckIn/confirm`).
   - Hệ thống chuyển phòng `302` thành `Occupied`, đơn phòng thành `In-house`.
3. **Bước 3 (F4 - Khách trả phòng Check-out):**
   - Lễ tân mở giao diện trả phòng, nhập số phòng `302` (`POST /api/v1/CheckOut/precheck`).
   - Lễ tân ghi nhận khách dùng 3 lon bia và làm vỡ 1 chiếc cốc (đền 200,000đ) (`POST /api/v1/CheckOut/confirm`).
   - Hệ thống tự động khấu trừ tiền cọc thiết bị 500,000đ và xuất hóa đơn quyết toán `COLLECT` hoặc `REFUND`.
   - Phòng `302` lập tức chuyển sang trạng thái `Dirty` trên sơ đồ buồng phòng.

---
**Tác giả phụ trách Backend & Kiểm thử:**  
Sinh viên: **Nguyễn Văn Trường** - Lớp **65KTPM** - Trường Đại học Thủy Lợi.
