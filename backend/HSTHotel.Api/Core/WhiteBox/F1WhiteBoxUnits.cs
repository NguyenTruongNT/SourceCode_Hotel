using System.Globalization;
using System.Text.RegularExpressions;
using HSTHotel.Api.Core.Constants;

namespace HSTHotel.Api.Core.WhiteBox;

/// <summary>
/// Các đối tượng cấu trúc dữ liệu đơn giản phục vụ White-Box testing cho F1
/// </summary>
public record RoomPeriod(string CheckIn, string CheckOut);
public record BookingOverlapCheck(string Status, string CheckIn, string CheckOut);
public record RoomSearchMatch(string Status, int Capacity, string Type);
public record SearchCriteriaMatch(int Guests, string Type);

/// <summary>
/// Chức năng F1: Tra cứu & Tìm kiếm phòng trống trực tuyến nâng cao
/// Mã nguồn tham chiếu White-box Testing theo mục 3.2.4 trong tài liệu đặc tả đồ án.
/// Đảm bảo tính toán đúng theo Đồ thị dòng điều khiển (CFG) và các độ đo C1, C2, C3.
/// </summary>
public static class F1WhiteBoxUnits
{
    private static readonly Regex DateFormatRegex = new(@"^\d{4}-\d{2}-\d{2}$", RegexOptions.Compiled);

    /// <summary>
    /// Đơn vị kiểm thử 1: validateCheckIn() – Ngày nhận phòng
    /// Cơ sở đặc tả: Bắt buộc chọn, đúng định dạng YYYY-MM-DD và phải >= ngày hiện tại; sai báo lỗi E1 (BR_F1_01).
    /// Số nút: 6 | Điểm quyết định: 2 | V(G) = 3
    /// </summary>
    public static string ValidateCheckIn(string? checkIn, string today)
    {
        // Nút 1: Khởi tạo hàm
        // Nút 2: Điểm quyết định 1 (2.1: string.IsNullOrEmpty(checkIn), 2.2: !DateFormatRegex.IsMatch(checkIn))
        if (string.IsNullOrEmpty(checkIn) || !DateFormatRegex.IsMatch(checkIn))
        {
            // Nút 3: Trả về lỗi E1
            return HotelConstants.F1.CodeE1;
        }

        // Nút 4: Điểm quyết định 2 (checkIn < today)
        if (string.Compare(checkIn, today, StringComparison.Ordinal) < 0)
        {
            // Nút 5: Trả về lỗi E1
            return HotelConstants.F1.CodeE1;
        }

        // Nút 6: Hợp lệ
        return HotelConstants.F1.CodeOk;
    }

    /// <summary>
    /// Đơn vị kiểm thử 2: validateCheckOut() – Ngày trả phòng
    /// Cơ sở đặc tả: Bắt buộc chọn, đúng định dạng YYYY-MM-DD và phải sau ngày nhận ít nhất 1 đêm; sai báo lỗi E2 (BR_F1_01).
    /// Số nút: 6 | Điểm quyết định: 2 | V(G) = 3
    /// </summary>
    public static string ValidateCheckOut(string? checkIn, string? checkOut)
    {
        // Nút 1: Khởi tạo hàm
        // Nút 2: Điểm quyết định 1 (2.1: string.IsNullOrEmpty(checkOut), 2.2: !DateFormatRegex.IsMatch(checkOut))
        if (string.IsNullOrEmpty(checkOut) || !DateFormatRegex.IsMatch(checkOut))
        {
            // Nút 3: Trả về lỗi E2
            return HotelConstants.F1.CodeE2;
        }

        // Nút 4: Điểm quyết định 2 (checkOut <= checkIn)
        if (string.Compare(checkOut, checkIn, StringComparison.Ordinal) <= 0)
        {
            // Nút 5: Trả về lỗi E2
            return HotelConstants.F1.CodeE2;
        }

        // Nút 6: Hợp lệ
        return HotelConstants.F1.CodeOk;
    }

    /// <summary>
    /// Đơn vị kiểm thử 3: validateGuests() – Số lượng khách
    /// Cơ sở đặc tả: Bắt buộc nhập, số nguyên từ 1 đến 10; ngoài miền hoặc không phải số báo lỗi E3.
    /// Số nút: 9 | Điểm quyết định: 3 | V(G) = 4
    /// </summary>
    public static string ValidateGuests(object? guests)
    {
        // Nút 1: Khởi tạo hàm
        // Nút 2: Điểm quyết định 1 (2.1: guests == "", 2.2: guests == null)
        string str = Core.Utilities.JsonConversionHelper.ToRawString(guests);
        if (guests == null || string.IsNullOrEmpty(str))
        {
            // Nút 3: Trả về lỗi E3
            return HotelConstants.F1.CodeE3;
        }

        // Nút 4: const n = Number(guests)
        if (!double.TryParse(str, NumberStyles.Float, CultureInfo.InvariantCulture, out double rawNumber))
        {
            // Nút 6: Không phải số
            return HotelConstants.F1.CodeE3;
        }

        // Nút 5: Điểm quyết định 2 (!Number.isInteger(n))
        if (Math.Abs(rawNumber % 1) > double.Epsilon)
        {
            // Nút 6: Số thập phân không phải số nguyên
            return HotelConstants.F1.CodeE3;
        }

        long n = (long)rawNumber;

        // Nút 7: Điểm quyết định 3 (7.1: n < 1, 7.2: n > 10)
        if (n < 1 || n > 10)
        {
            // Nút 8: Ngoài khoảng 1 đến 10
            return HotelConstants.F1.CodeE3;
        }

        // Nút 9: Hợp lệ
        return HotelConstants.F1.CodeOk;
    }

    /// <summary>
    /// Đơn vị kiểm thử 4: isOverlap() – Trùng lịch đặt phòng
    /// Cơ sở đặc tả: Phòng không khả dụng nếu có đơn ở trạng thái Confirmed/In-house giao thoa khoảng ngày [Check-in, Check-out] (BR_F1_02).
    /// Số nút: 6 | Điểm quyết định: 2 | V(G) = 3
    /// </summary>
    public static bool IsOverlap(RoomPeriod want, BookingOverlapCheck b)
    {
        // Nút 1: Khởi tạo hàm
        // Nút 2: Điểm quyết định 1 (2.1: b.status !== "Confirmed", 2.2: b.status !== "In-house")
        if (b.Status != "Confirmed" && b.Status != "In-house")
        {
            // Nút 3: Không trùng lịch do đơn đặt phòng đã hủy / kết thúc
            return false;
        }

        // Nút 4: Điểm quyết định 2 (4.1: want.checkIn < b.checkOut, 4.2: b.checkIn < want.checkOut)
        if (string.Compare(want.CheckIn, b.CheckOut, StringComparison.Ordinal) < 0 &&
            string.Compare(b.CheckIn, want.CheckOut, StringComparison.Ordinal) < 0)
        {
            // Nút 5: Có giao thoa khoảng ngày -> Trùng lịch
            return true;
        }

        // Nút 6: Không trùng lịch
        return false;
    }

    /// <summary>
    /// Đơn vị kiểm thử 5: matchRoom() – Lọc phòng theo tiêu chí tìm kiếm
    /// Cơ sở đặc tả: Phòng hiển thị khi trạng thái Active, sức chứa >= số khách và khớp hạng phòng đã chọn (AND các tiêu chí - BR_F1_02, BR_F1_03).
    /// Số nút: 8 | Điểm quyết định: 3 | V(G) = 4
    /// </summary>
    public static bool MatchRoom(RoomSearchMatch room, SearchCriteriaMatch req)
    {
        // Nút 1: Khởi tạo hàm
        // Nút 2: Điểm quyết định 1 (room.status !== "Active")
        if (room.Status != "Active")
        {
            // Nút 3: Phòng không hoạt động
            return false;
        }

        // Nút 4: Điểm quyết định 2 (room.capacity < req.guests)
        if (room.Capacity < req.Guests)
        {
            // Nút 5: Sức chứa không đủ
            return false;
        }

        // Nút 6: Điểm quyết định 3 (6.1: req.type !== "ALL", 6.2: room.type !== req.type)
        if (!string.Equals(req.Type, "ALL", StringComparison.OrdinalIgnoreCase) &&
            !string.Equals(room.Type, req.Type, StringComparison.OrdinalIgnoreCase))
        {
            // Nút 7: Sai loại phòng yêu cầu
            return false;
        }

        // Nút 8: Thỏa mãn tất cả tiêu chí
        return true;
    }
}
