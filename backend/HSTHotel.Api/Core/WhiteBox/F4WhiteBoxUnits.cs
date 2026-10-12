using System.Globalization;
using HSTHotel.Api.Core.Constants;

namespace HSTHotel.Api.Core.WhiteBox;

public record RoomCheckoutMatch(string Status);

/// <summary>
/// Chức năng F4: Xử lý Trả phòng và Quyết toán hóa đơn (Check-out) - Nhiệm vụ của Nguyễn Văn Trường
/// Mã nguồn tham chiếu White-box Testing theo mục 3.8.4 trong tài liệu đặc tả đồ án.
/// Đảm bảo tính toán đúng theo Đồ thị dòng điều khiển (CFG) và các độ đo C1, C2, C3.
/// </summary>
public static class F4WhiteBoxUnits
{
    /// <summary>
    /// Đơn vị kiểm thử 1: validateCheckoutRoom() – Số phòng cần trả
    /// Cơ sở đặc tả: Bắt buộc chọn phòng đang có khách lưu trú (Occupied); phòng trống hoặc không tồn tại báo lỗi E1.
    /// Số nút: 6 | Điểm quyết định: 2 | V(G) = 3
    /// </summary>
    public static string ValidateCheckoutRoom(string? roomNo, RoomCheckoutMatch? room)
    {
        // Nút 1: Khởi tạo hàm
        // Nút 2: Điểm quyết định 1 (2.1: !roomNo, 2.2: !room)
        if (string.IsNullOrEmpty(roomNo) || room == null)
        {
            // Nút 3: Trả về E1
            return HotelConstants.F4.CodeE1;
        }

        // Nút 4: Điểm quyết định 2 (room.status !== "Occupied")
        if (room.Status != "Occupied")
        {
            // Nút 5: Trả về E1
            return HotelConstants.F4.CodeE1;
        }

        // Nút 6: Hợp lệ
        return HotelConstants.F4.CodeOk;
    }

    /// <summary>
    /// Đơn vị kiểm thử 2: validateMinibar() – Số lượng Minibar tiêu thụ
    /// Cơ sở đặc tả: Số nguyên từ 0 đến 50 cho mỗi món; số âm, số thập phân hoặc ký tự chữ báo lỗi E2.
    /// Số nút: 9 | Điểm quyết định: 3 | V(G) = 4
    /// </summary>
    public static string ValidateMinibar(object? qty)
    {
        // Nút 1: Khởi tạo hàm
        // Nút 2: Điểm quyết định 1 (2.1: qty === "", 2.2: qty === null)
        string str = Core.Utilities.JsonConversionHelper.ToRawString(qty);
        if (qty == null || string.IsNullOrEmpty(str))
        {
            // Nút 3: Trả về E2
            return HotelConstants.F4.CodeE2;
        }

        // Nút 4: const n = Number(qty);
        if (!double.TryParse(str, NumberStyles.Float, CultureInfo.InvariantCulture, out double rawNumber))
        {
            // Nút 6: Không phải số -> Trả về E2
            return HotelConstants.F4.CodeE2;
        }

        // Nút 5: Điểm quyết định 2 (!Number.isInteger(n))
        if (Math.Abs(rawNumber % 1) > double.Epsilon)
        {
            // Nút 6: Số thập phân -> Trả về E2
            return HotelConstants.F4.CodeE2;
        }

        long n = (long)rawNumber;

        // Nút 7: Điểm quyết định 3 (7.1: n < 0, 7.2: n > 50)
        if (n < 0 || n > 50)
        {
            // Nút 8: Trả về E2
            return HotelConstants.F4.CodeE2;
        }

        // Nút 9: Hợp lệ
        return HotelConstants.F4.CodeOk;
    }

    /// <summary>
    /// Đơn vị kiểm thử 3: validateDamageFee() – Phí bồi thường hư hại tài sản
    /// Cơ sở đặc tả: Bắt buộc số >= 0; rỗng/null mặc định 0 VNĐ; số âm hoặc ký tự chữ báo lỗi E3.
    /// Số nút: 7 | Điểm quyết định: 2 | V(G) = 3
    /// </summary>
    public static string ValidateDamageFee(object? fee)
    {
        // Nút 1: Khởi tạo hàm
        // Nút 2: Điểm quyết định 1 (2.1: fee === "", 2.2: fee === null)
        string str = Core.Utilities.JsonConversionHelper.ToRawString(fee);
        if (fee == null || string.IsNullOrEmpty(str))
        {
            // Nút 3: Hợp lệ (mặc định coi là 0đ)
            return HotelConstants.F4.CodeOk;
        }

        // Nút 4: const n = Number(fee);
        if (!decimal.TryParse(str, NumberStyles.Number | NumberStyles.AllowDecimalPoint, CultureInfo.InvariantCulture, out decimal n))
        {
            // Nút 6: isNaN(n) -> Trả về E3
            return HotelConstants.F4.CodeE3;
        }

        // Nút 5: Điểm quyết định 2 (5.1: isNaN(n), 5.2: n < 0)
        if (n < 0m)
        {
            // Nút 6: Trả về E3
            return HotelConstants.F4.CodeE3;
        }

        // Nút 7: Hợp lệ
        return HotelConstants.F4.CodeOk;
    }

    /// <summary>
    /// Đơn vị kiểm thử 4: calcLateFeeRate() – Tỷ lệ phụ thu trả phòng trễ
    /// Cơ sở đặc tả: Chuẩn 12:00; 12:01-15:00 phụ thu 30%; 15:01-18:00 phụ thu 50%; sau 18:00 phụ thu 100% tiền phòng 1 đêm (BR_F4_01).
    /// Số nút: 9 | Điểm quyết định: 3 | V(G) = 4
    /// </summary>
    public static double CalcLateFeeRate(string time)
    {
        // Nút 1: Khởi tạo hàm
        // Nút 2: const m = Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));
        int hours = int.Parse(time.Substring(0, 2));
        int minutes = int.Parse(time.Substring(3, 2));
        int m = hours * 60 + minutes;

        // Nút 3: Điểm quyết định 1 (m <= 720) -> trước hoặc đúng 12:00
        if (m <= 720)
        {
            // Nút 4: Phụ thu 0%
            return 0;
        }

        // Nút 5: Điểm quyết định 2 (m <= 900) -> từ 12:01 đến 15:00
        if (m <= 900)
        {
            // Nút 6: Phụ thu 30%
            return 0.3;
        }

        // Nút 7: Điểm quyết định 3 (m <= 1080) -> từ 15:01 đến 18:00
        if (m <= 1080)
        {
            // Nút 8: Phụ thu 50%
            return 0.5;
        }

        // Nút 9: Phụ thu 100% (sau 18:00)
        return 1;
    }

    /// <summary>
    /// Đơn vị kiểm thử 5: calcSettlement() – Quyết toán số dư khi trả phòng
    /// Cơ sở đặc tả: Tổng = Tiền phòng còn lại + Phụ thu + Minibar + Bồi thường - Cọc tài sản 500,000;
    /// > 0 thu thêm (COLLECT), < 0 hoàn cọc dư (REFUND), = 0 hòa (EVEN).
    /// Số nút: 7 | Điểm quyết định: 2 | V(G) = 3
    /// </summary>
    public static string CalcSettlement(decimal remain, decimal lateFee, decimal minibar, decimal damage)
    {
        // Nút 1: Khởi tạo hàm
        // Nút 2: const total = remain + lateFee + minibar + damage - 500000;
        decimal total = remain + lateFee + minibar + damage - 500000m;

        // Nút 3: Điểm quyết định 1 (total > 0)
        if (total > 0)
        {
            // Nút 4: Khách nộp thêm số dư
            return HotelConstants.F4.SettleCollect;
        }

        // Nút 5: Điểm quyết định 2 (total < 0)
        if (total < 0)
        {
            // Nút 6: Khách sạn hoàn cọc dư
            return HotelConstants.F4.SettleRefund;
        }

        // Nút 7: Hòa (cân bằng 0đ)
        return HotelConstants.F4.SettleEven;
    }
}
