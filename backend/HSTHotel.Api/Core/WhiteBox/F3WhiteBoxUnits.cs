using System.Globalization;
using System.Text.RegularExpressions;
using HSTHotel.Api.Core.Constants;

namespace HSTHotel.Api.Core.WhiteBox;

public record BookingCheckInMatch(string Status, string Cccd, string RoomType);
public record RoomAssignMatch(string Type, string Status);

/// <summary>
/// Chức năng F3: Xử lý Nhận phòng tại quầy (Check-in) - Nhiệm vụ của Nguyễn Văn Trường
/// Mã nguồn tham chiếu White-box Testing theo mục 3.6.4 trong tài liệu đặc tả đồ án.
/// Đảm bảo tính toán đúng theo Đồ thị dòng điều khiển (CFG) và các độ đo C1, C2, C3.
/// </summary>
public static class F3WhiteBoxUnits
{
    private static readonly Regex PnrRegex = new(@"^HST\d{5}$", RegexOptions.Compiled);
    private static readonly Regex CccdRegex = new(@"^\d{12}$", RegexOptions.Compiled);
    private static readonly Regex KeycardRegex = new(@"^[0-9A-Fa-f]+$", RegexOptions.Compiled);

    /// <summary>
    /// Đơn vị kiểm thử 1: validatePNR() – Mã đặt phòng PNR
    /// Cơ sở đặc tả: Dạng "HST" + 5 chữ số, phải tồn tại và đang ở trạng thái Confirmed (chưa hủy); sai báo lỗi E1.
    /// Số nút: 8 | Điểm quyết định: 3 | V(G) = 4
    /// </summary>
    public static string ValidatePNR(string? pnr, BookingCheckInMatch? booking)
    {
        // Nút 1: Khởi tạo hàm
        // Nút 2: Điểm quyết định 1 (!pnr)
        if (string.IsNullOrEmpty(pnr))
        {
            // Nút 3: Trả về E1
            return HotelConstants.F3.CodeE1;
        }

        // Nút 4: Điểm quyết định 2 (!/^HST\d{5}$/.test(pnr))
        if (!PnrRegex.IsMatch(pnr))
        {
            // Nút 5: Trả về E1
            return HotelConstants.F3.CodeE1;
        }

        // Nút 6: Điểm quyết định 3 (6.1: !booking, 6.2: booking.status !== "Confirmed")
        if (booking == null || booking.Status != "Confirmed")
        {
            // Nút 7: Trả về E1
            return HotelConstants.F3.CodeE1;
        }

        // Nút 8: Hợp lệ
        return HotelConstants.F3.CodeOk;
    }

    /// <summary>
    /// Đơn vị kiểm thử 2: verifyCCCD() – Đối chiếu CCCD khi nhận phòng
    /// Cơ sở đặc tả: CCCD gồm đúng 12 chữ số và phải trùng với CCCD trong hồ sơ đặt trước; sai báo cảnh báo E2.
    /// Số nút: 6 | Điểm quyết định: 2 | V(G) = 3
    /// </summary>
    public static string VerifyCCCD(string? input, BookingCheckInMatch? booking)
    {
        // Nút 1: Khởi tạo hàm
        // Nút 2: Điểm quyết định 1 (2.1: !input, 2.2: !/^\d{12}$/.test(input))
        if (string.IsNullOrEmpty(input) || !CccdRegex.IsMatch(input))
        {
            // Nút 3: Trả về E2
            return HotelConstants.F3.CodeE2;
        }

        // Nút 4: Điểm quyết định 2 (input !== booking.cccd)
        if (booking == null || input != booking.Cccd)
        {
            // Nút 5: Trả về E2
            return HotelConstants.F3.CodeE2;
        }

        // Nút 6: Hợp lệ
        return HotelConstants.F3.CodeOk;
    }

    /// <summary>
    /// Đơn vị kiểm thử 3: validateRoomAssign() – Gán phòng thực tế
    /// Cơ sở đặc tả: Phòng phải thuộc đúng hạng phòng đã đặt và ở trạng thái Clean (đã dọn/kiểm tra); sai báo lỗi E3 (BR_F3_02).
    /// Số nút: 6 | Điểm quyết định: 2 | V(G) = 3
    /// </summary>
    public static string ValidateRoomAssign(RoomAssignMatch? room, BookingCheckInMatch? booking)
    {
        // Nút 1: Khởi tạo hàm
        // Nút 2: Điểm quyết định 1 (2.1: !room, 2.2: room.type !== booking.roomType)
        if (room == null || booking == null || !string.Equals(room.Type, booking.RoomType, StringComparison.OrdinalIgnoreCase))
        {
            // Nút 3: Trả về E3
            return HotelConstants.F3.CodeE3;
        }

        // Nút 4: Điểm quyết định 2 (room.status !== "Clean")
        if (room.Status != "Clean")
        {
            // Nút 5: Trả về E3
            return HotelConstants.F3.CodeE3;
        }

        // Nút 6: Hợp lệ
        return HotelConstants.F3.CodeOk;
    }

    /// <summary>
    /// Đơn vị kiểm thử 4: validateDeposit() – Tiền cọc đảm bảo tài sản
    /// Cơ sở đặc tả: Bắt buộc nhập, là số và >= 500,000 VNĐ; để trống, âm hoặc nhỏ hơn mức tối thiểu báo lỗi E4 (BR_F3_03).
    /// Số nút: 9 | Điểm quyết định: 3 | V(G) = 4
    /// </summary>
    public static string ValidateDeposit(object? amount)
    {
        // Nút 1: Khởi tạo hàm
        // Nút 2: Điểm quyết định 1 (2.1: amount === "", 2.2: amount === null)
        string str = Core.Utilities.JsonConversionHelper.ToRawString(amount);
        if (amount == null || string.IsNullOrEmpty(str))
        {
            // Nút 3: Trả về E4
            return HotelConstants.F3.CodeE4;
        }

        // Nút 4: const n = Number(amount);
        if (!decimal.TryParse(str, NumberStyles.Number | NumberStyles.AllowDecimalPoint, CultureInfo.InvariantCulture, out decimal n))
        {
            // Nút 6: isNaN(n) -> Trả về E4
            return HotelConstants.F3.CodeE4;
        }

        // Nút 7: Điểm quyết định 3 (n < 500000)
        if (n < 500000m)
        {
            // Nút 8: Trả về E4
            return HotelConstants.F3.CodeE4;
        }

        // Nút 9: Hợp lệ
        return HotelConstants.F3.CodeOk;
    }

    /// <summary>
    /// Đơn vị kiểm thử 5: validateKeycard() – Mã thẻ từ bàn giao
    /// Cơ sở đặc tả: Bắt buộc quét thẻ; mã gồm 6-10 ký tự hex (0-9, A-F); chưa quét thẻ hợp lệ thì không cho hoàn tất Check-in.
    /// Số nút: 8 | Điểm quyết định: 3 | V(G) = 4
    /// </summary>
    public static string ValidateKeycard(string? code)
    {
        // Nút 1: Khởi tạo hàm
        // Nút 2: Điểm quyết định 1 (!code)
        if (string.IsNullOrEmpty(code))
        {
            // Nút 3: Trả về BLOCK
            return HotelConstants.F3.CodeBlock;
        }

        // Nút 4: Điểm quyết định 2 (4.1: code.length < 6, 4.2: code.length > 10)
        if (code.Length < 6 || code.Length > 10)
        {
            // Nút 5: Trả về BLOCK
            return HotelConstants.F3.CodeBlock;
        }

        // Nút 6: Điểm quyết định 3 (!/^[0-9A-Fa-f]+$/.test(code))
        if (!KeycardRegex.IsMatch(code))
        {
            // Nút 7: Trả về BLOCK
            return HotelConstants.F3.CodeBlock;
        }

        // Nút 8: Hợp lệ
        return HotelConstants.F3.CodeOk;
    }

    /// <summary>
    /// Đơn vị kiểm thử 6: earlyCheckinRate() – Phụ thu nhận phòng sớm
    /// Cơ sở đặc tả: Từ 14:00: không phụ thu; 09:00-<14:00 phụ thu 30% nếu có phòng sạch; 06:00-<09:00 phụ thu 50%; ngoài các mốc trên không nhận sớm được (BR_F3_01, E2).
    /// Số nút: 9 | Điểm quyết định: 3 | V(G) = 4
    /// </summary>
    public static double EarlyCheckinRate(string time, bool hasCleanRoom)
    {
        // Nút 1: Khởi tạo hàm
        // Nút 2: const m = Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));
        int hours = int.Parse(time.Substring(0, 2));
        int minutes = int.Parse(time.Substring(3, 2));
        int m = hours * 60 + minutes;

        // Nút 3: Điểm quyết định 1 (m >= 840) -> từ 14:00 trở đi
        if (m >= 840)
        {
            // Nút 4: Trả về 0 (không phụ thu)
            return 0;
        }

        // Nút 5: Điểm quyết định 2 (5.1: m >= 540, 5.2: hasCleanRoom) -> từ 09:00 đến < 14:00
        if (m >= 540 && hasCleanRoom)
        {
            // Nút 6: Trả về 0.3 (phụ thu 30%)
            return 0.3;
        }

        // Nút 7: Điểm quyết định 3 (7.1: m >= 360, 7.2: m < 540) -> từ 06:00 đến < 09:00
        if (m >= 360 && m < 540)
        {
            // Nút 8: Trả về 0.5 (phụ thu 50%)
            return 0.5;
        }

        // Nút 9: Không thể nhận phòng sớm (E2)
        return -1;
    }
}
