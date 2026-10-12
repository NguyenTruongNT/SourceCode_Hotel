namespace HSTHotel.Api.Core.Constants;

/// <summary>
/// Định nghĩa các mã lỗi, mã trạng thái và thông điệp chuẩn theo tài liệu đặc tả kiểm thử
/// 65KTPM_Nhom10_KiemThu_HopDen_HopTrang.docx
/// </summary>
public static class HotelConstants
{
    // ==========================================
    // F1: TRA CỨU & TÌM KIẾM PHÒNG TRỐNG
    // ==========================================
    public static class F1
    {
        public const string CodeOk = "OK";
        public const string CodeE1 = "E1"; // Ngày nhận không hợp lệ / nhỏ hơn ngày hiện tại
        public const string CodeE2 = "E2"; // Ngày trả không hợp lệ / <= ngày nhận
        public const string CodeE3 = "E3"; // Số khách không hợp lệ / ngoài 1..10
        public const string CodeS1 = "S1"; // Tìm kiếm thành công có phòng trống
        public const string CodeS2 = "S2"; // Hợp lệ nhưng khách sạn đã hết phòng trống

        public const string MsgE1 = "Ngày nhận phòng không thể nhỏ hơn ngày hiện tại!";
        public const string MsgE2 = "Ngày trả phòng phải sau ngày nhận phòng ít nhất 01 đêm!";
        public const string MsgE3 = "Số lượng khách phải từ 1 đến 10 người!";
        public const string MsgS1 = "Tìm thấy danh sách phòng khả dụng phù hợp.";
        public const string MsgS2 = "Rất tiếc, khách sạn đã kín phòng trong khoảng thời gian này. Quý khách vui lòng chọn khoảng ngày khác!";

        // Tham chiếu mốc ngày hiện tại phục vụ kiểm thử theo báo cáo (11/10/2026)
        public const string DefaultTestingToday = "2026-10-11";
    }

    // ==========================================
    // F3: XỬ LÝ NHẬN PHÒNG TẠI QUẦY (CHECK-IN)
    // ==========================================
    public static class F3
    {
        public const string CodeOk = "OK";
        public const string CodeBlock = "BLOCK"; // Chặn hoàn tất khi thẻ từ sai
        public const string CodeE1 = "E1"; // Không tìm thấy mã PNR hoặc đơn đã hủy
        public const string CodeE2 = "E2"; // CCCD không trùng khớp / không đủ phòng sạch nhận sớm
        public const string CodeE3 = "E3"; // Phòng chưa dọn dẹp hoặc sai hạng phòng
        public const string CodeE4 = "E4"; // Tiền cọc tài sản thiếu / không hợp lệ
        public const string CodeS1 = "S1"; // Check-in thành công

        public const string MsgE1 = "Không tìm thấy mã đặt phòng hoặc đơn đặt phòng đã bị hủy!";
        public const string MsgE2_Cccd = "Thông tin người nhận phòng không trùng khớp với hồ sơ đặt trước. Yêu cầu xác nhận ủy quyền!";
        public const string MsgE2_EarlyCheckin = "Không thể nhận phòng sớm do chưa có phòng sạch sẵn sàng. Quý khách vui lòng gửi hành lý hoặc chờ đến 14:00!";
        public const string MsgE3 = "Phòng chưa dọn dẹp (Dirty) hoặc sai hạng phòng đã đặt, không thể gán cho khách!";
        public const string MsgE4 = "Tiền cọc tài sản đảm bảo tối thiểu là 500,000 VNĐ!";
        public const string MsgBlock = "Mã thẻ từ bàn giao không hợp lệ (yêu cầu từ 6-10 ký tự Hexadecimal). Chặn hoàn tất Check-in!";
        public const string MsgS1 = "Check-in thành công! Phòng đã được gán và bàn giao thẻ từ cho khách hàng.";

        public const decimal MinDepositAmount = 500000m;
        public const int StandardCheckInMinute = 14 * 60; // 14:00 = 840 phút
        public const int EarlySlot1Minute = 9 * 60;        // 09:00 = 540 phút
        public const int EarlySlot2Minute = 6 * 60;        // 06:00 = 360 phút
    }

    // ==========================================
    // F4: XỬ LÝ TRẢ PHÒNG & QUYẾT TOÁN (CHECK-OUT)
    // ==========================================
    public static class F4
    {
        public const string CodeOk = "OK";
        public const string CodeE1 = "E1"; // Phòng không có khách lưu trú
        public const string CodeE2 = "E2"; // Số lượng minibar âm / sai định dạng
        public const string CodeE3 = "E3"; // Phí bồi thường hư hại âm / không hợp lệ
        public const string CodeS1 = "S1"; // Quyết toán & Check-out thành công

        public const string SettleCollect = "COLLECT"; // Khách nộp thêm số dư
        public const string SettleRefund = "REFUND";   // Khách sạn hoàn cọc dư cho khách
        public const string SettleEven = "EVEN";       // Số dư cấn trừ vừa khớp 0đ

        public const string MsgE1 = "Phòng này hiện không có khách đang lưu trú!";
        public const string MsgE2 = "Số lượng tiêu thụ minibar không thể là số âm (giới hạn từ 0 đến 50)!";
        public const string MsgE3 = "Phí bồi thường hư hại tài sản không hợp lệ (không thể là số âm)!";
        public const string MsgS1 = "Xử lý Check-out và quyết toán hóa đơn hoàn tất thành công!";

        public const int StandardCheckOutMinute = 12 * 60; // 12:00 = 720 phút
        public const int LateSlot1Minute = 15 * 60;        // 15:00 = 900 phút
        public const int LateSlot2Minute = 18 * 60;        // 18:00 = 1080 phút
        public const decimal StandardDepositDeduction = 500000m;
    }

    // ==========================================
    // TRẠNG THÁI BUỒNG PHÒNG VÀ ĐẶT PHÒNG
    // ==========================================
    public static class RoomStatuses
    {
        public const string Available = "Available";
        public const string Clean = "Clean";
        public const string Occupied = "Occupied";
        public const string Dirty = "Dirty";
        public const string Active = "Active";
        public const string Inactive = "Inactive";
    }

    public static class BookingStatuses
    {
        public const string Confirmed = "Confirmed";
        public const string InHouse = "In-house";
        public const string CheckedIn = "Checked-in";
        public const string CheckedOut = "Checked-out";
        public const string Cancelled = "Cancelled";
        public const string NoShow = "No-Show";
    }

    public static class RoomTypes
    {
        public const string All = "ALL";
        public const string Standard = "Standard";
        public const string Superior = "Superior";
        public const string Deluxe = "Deluxe";
        public const string Suite = "Suite";
    }
}
