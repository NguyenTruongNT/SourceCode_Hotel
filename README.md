# 🏨 WEBSITE QUẢN LÝ KHÁCH SẠN HST (HST HOTEL)
> **BÀI TẬP LỚN MÔN HỌC:** KIỂM THỬ VÀ ĐẢM BẢO CHẤT LƯỢNG PHẦN MỀM  
> **LỚP:** 65KTPM - **NHÓM:** 10 - **TRƯỜNG:** ĐẠI HỌC THỦY LỢI  
> **TÀI LIỆU KIỂM THỬ:** `65KTPM_Nhom10_KiemThu_HopDen_HopTrang.docx`  
> **THÀNH VIÊN PHỤ TRÁCH BACKEND & KIỂM THỬ:** **NGUYỄN VĂN TRƯỜNG** (MSV: **2351170625**)

---

## 📌 PHẠM VI NHIỆM VỤ CỦA NGUYỄN VĂN TRƯỜNG
1. **F1: Tra cứu & Tìm kiếm phòng trống trực tuyến nâng cao**
2. **F3: Xử lý Nhận phòng tại quầy (Check-in)**
3. **F4: Xử lý Trả phòng & Quyết toán hóa đơn (Check-out)**

Toàn bộ mã nguồn Backend C# ASP.NET Core Web API và 159 ca kiểm thử tự động xUnit được lưu trữ trong thư mục:
📁 **[`backend/`](file:///E:/T%C3%80I%20LI%E1%BB%86N%20N%C4%82M%203/Kiem%20Thu/SourceCode_Hotel/backend)**

---

## 🚀 HƯỚNG DẪN KHỞI CHẠY NHANH

### 1. Khởi chạy Backend Web API (.NET 9.0)
```powershell
dotnet run --project backend/HSTHotel.Api
```
- **Địa chỉ Swagger UI trực quan:** 👉 **[http://localhost:5145](http://localhost:5145)**
- Thử nghiệm trực tiếp các API F1, F3, F4 ngay trên trình duyệt mà không cần cài đặt thêm công cụ.

### 2. Khởi chạy Toàn bộ Kiểm thử Tự động (159/159 Test Cases Passed)
```powershell
dotnet test backend/HSTHotel.sln
```
```text
Passed!  - Failed: 0, Passed: 159, Skipped: 0, Total: 159, Duration: ~100 ms - HSTHotel.Tests.dll (net9.0)
```

### 3. Khởi chạy Frontend Next.js (Nếu cần giao diện Web)
```powershell
npm run dev
```
- **Giao diện người dùng:** `http://localhost:3000`

---

## 📂 CẤU TRÚC THƯ MỤC HỆ THỐNG
```
SourceCode_Hotel/
├── 65KTPM_Nhom10_KiemThu_HopDen_HopTrang.docx   # Báo cáo đặc tả, kiểm thử hộp đen & hộp trắng
├── README.md                                    # Tài liệu tổng quan dự án
│
├── backend/                                     # Toàn bộ mã nguồn Backend & Test Suites
│   ├── README.md                                # Hướng dẫn chi tiết kỹ thuật Backend
│   ├── HSTHotel.sln                             # Visual Studio / .NET Solution
│   ├── HSTHotel.Api/                            # ASP.NET Core 9.0 Web API
│   │   ├── Controllers/                         # RoomSearch, CheckIn, CheckOut Controllers
│   │   ├── Core/WhiteBox/                       # 16 hàm kiểm thử hộp trắng chuẩn 1-1 với CFG
│   │   ├── Core/Constants/                      # Định nghĩa mã lỗi E1-E4, S1-S2, chính sách giờ/cọc
│   │   ├── Core/Utilities/                      # Tiện ích ép kiểu an toàn JsonElement
│   │   ├── Models/ (Entities, DTOs)             # Thực thể buồng phòng, đơn đặt, hóa đơn
│   │   ├── Services/                            # Xử lý quy trình nghiệp vụ khách sạn
│   │   ├── Data/                                # Kho dữ liệu bộ nhớ an toàn đa luồng
│   │   └── Program.cs                           # Cấu hình Swagger, CORS, DI
│   └── HSTHotel.Tests/                          # xUnit Test Project (159 ca kiểm thử tự động)
│       ├── F1_Tests/                            # 28 ca White-box + 9 ca Black-box (TC_F1_01..09)
│       ├── F3_Tests/                            # 37 ca White-box + 7 ca Black-box (TC_F3_01..07)
│       └── F4_Tests/                            # 30 ca White-box + 7 ca Black-box (TC_F4_01..07)
│
├── app/                                         # Frontend Next.js App Router
├── components/                                  # Giao diện React Components
└── public/                                      # Tài nguyên hình ảnh, logo khách sạn
```

---

## 📊 BẢNG ÁNH XẠ KIỂM THỬ HỘP TRẮNG (WHITE-BOX)

| Chức năng | Đơn vị kiểm thử | Số nút | V(G) | Độ đo | Mã trả về |
|:---|:---|:---:|:---:|:---:|:---|
| **F1** | `validateCheckIn(checkIn, today)` | 6 | 3 | C1, C2, C3 | `E1` / `OK` |
| **F1** | `validateCheckOut(checkIn, checkOut)` | 6 | 3 | C1, C2, C3, BVA | `E2` / `OK` |
| **F1** | `validateGuests(guests)` | 9 | 4 | C1, C2, C3, BVA | `E3` / `OK` |
| **F1** | `isOverlap(want, b)` | 6 | 3 | C1, C2, C3 | `true` / `false` |
| **F1** | `matchRoom(room, req)` | 8 | 4 | C1, C2, C3 | `true` / `false` |
| **F3** | `validatePNR(pnr, booking)` | 8 | 4 | C1, C2, C3 | `E1` / `OK` |
| **F3** | `verifyCCCD(input, booking)` | 6 | 3 | C1, C2, C3 | `E2` / `OK` |
| **F3** | `validateRoomAssign(room, booking)` | 6 | 3 | C1, C2, C3 | `E3` / `OK` |
| **F3** | `validateDeposit(amount)` | 9 | 4 | C1, C2, C3, BVA | `E4` / `OK` |
| **F3** | `validateKeycard(code)` | 8 | 4 | C1, C2, C3, BVA | `BLOCK` / `OK` |
| **F3** | `earlyCheckinRate(time, hasCleanRoom)` | 9 | 4 | C1, C2, C3, BVA | `0` / `0.3` / `0.5` / `-1` |
| **F4** | `validateCheckoutRoom(roomNo, room)` | 6 | 3 | C1, C2, C3 | `E1` / `OK` |
| **F4** | `validateMinibar(qty)` | 9 | 4 | C1, C2, C3, BVA | `E2` / `OK` |
| **F4** | `validateDamageFee(fee)` | 7 | 3 | C1, C2, C3, BVA | `E3` / `OK` |
| **F4** | `calcLateFeeRate(time)` | 9 | 4 | C1, C2, BVA | `0` / `0.3` / `0.5` / `1.0` |
| **F4** | `calcSettlement(remain, lateFee, minibar, damage)` | 7 | 3 | C1, C2 | `COLLECT` / `REFUND` / `EVEN` |

Chi tiết tài liệu kỹ thuật xin xem thêm tại: [backend/README.md](file:///E:/T%C3%80I%20LI%E1%BB%86N%20N%C4%82M%203/Kiem%20Thu/SourceCode_Hotel/backend/README.md).
