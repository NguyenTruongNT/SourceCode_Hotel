namespace HSTHotel.Api.Models.Entities;

public class Booking
{
    public string Id { get; set; } = string.Empty; // PNR: HST10234, HST99999, etc.
    public string GuestName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string CheckInDate { get; set; } = string.Empty; // YYYY-MM-DD
    public string CheckOutDate { get; set; } = string.Empty; // YYYY-MM-DD
    public string RoomType { get; set; } = string.Empty; // Standard, Superior, Deluxe, Suite
    public string? RoomNumber { get; set; } // Mã phòng được gán khi check-in (VD: 302)
    public int GuestCount { get; set; } = 1;
    public string Cccd { get; set; } = string.Empty; // 12 số CCCD
    public decimal TotalRoomCharge { get; set; } // Tổng tiền phòng
    public decimal DepositAmount { get; set; } // Cọc thanh toán online (50% hoặc 100%)
    public decimal RemainingRoomCharge { get; set; } // Tiền phòng còn thiếu
    public decimal SecurityDeposit { get; set; } = 0; // Tiền cọc thiết bị nộp khi check-in (tối thiểu 500k)
    public string Status { get; set; } = "Confirmed"; // Confirmed, In-house, Checked-in, Checked-out, Cancelled, No-Show
    public string? KeycardCode { get; set; } // Mã thẻ từ RFID (6-10 hex ký tự)
    public double EarlyCheckInRate { get; set; } = 0;
    public decimal EarlyCheckInFee { get; set; } = 0;
    public string? ActualCheckInTime { get; set; }
    public string? ActualCheckOutTime { get; set; }
    public bool IsWalkIn { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
