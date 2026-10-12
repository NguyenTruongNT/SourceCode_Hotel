namespace HSTHotel.Api.Models.DTOs.F4_CheckOut;

public class CheckOutPreCheckRequest
{
    public string? RoomNumber { get; set; }
    public string? CheckOutTime { get; set; } // HH:mm
}

public class CheckOutPreCheckResponse
{
    public string RoomNumber { get; set; } = string.Empty;
    public string BookingId { get; set; } = string.Empty;
    public string GuestName { get; set; } = string.Empty;
    public string RoomType { get; set; } = string.Empty;
    public decimal RoomRatePerNight { get; set; }
    public decimal RemainingRoomCharge { get; set; }
    public string CheckInDate { get; set; } = string.Empty;
    public string ScheduledCheckOutDate { get; set; } = string.Empty;
    public string ActualCheckOutTime { get; set; } = string.Empty;
    public double LateFeeRate { get; set; }
    public decimal EstimatedLateFee { get; set; }
    public decimal SecurityDeposit { get; set; }
    public List<MinibarItemDto> AvailableMinibarMenu { get; set; } = new();
}

public class MinibarItemInput
{
    public string ProductName { get; set; } = string.Empty;
    public object? Quantity { get; set; } = 0; // Số lượng tiêu thụ (kiểm tra 0..50)
}

public class MinibarItemDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
}

public class CheckOutExecutionRequest
{
    public string? RoomNumber { get; set; }
    public string? CheckOutTime { get; set; } // HH:mm (mặc định giờ máy chủ nếu null)
    public List<MinibarItemInput> MinibarUsage { get; set; } = new();
    public object? DamageFee { get; set; } = 0; // Phí bồi thường hư hại tài sản
    public string SettlementPaymentMethod { get; set; } = "Tiền mặt"; // Tiền mặt, Quẹt thẻ POS, Chuyển khoản QR
}

public class CheckOutResultResponse
{
    public string InvoiceId { get; set; } = string.Empty;
    public string BookingId { get; set; } = string.Empty;
    public string RoomNumber { get; set; } = string.Empty;
    public string GuestName { get; set; } = string.Empty;
    public string CheckInDate { get; set; } = string.Empty;
    public string CheckOutDate { get; set; } = string.Empty;
    public string ActualCheckOutTime { get; set; } = string.Empty;
    public decimal RoomRatePerNight { get; set; }
    public decimal RemainingRoomCharge { get; set; }
    public double LateFeeRate { get; set; }
    public decimal LateFeeAmount { get; set; }
    public decimal MinibarTotal { get; set; }
    public List<MinibarUsageDetailDto> MinibarDetails { get; set; } = new();
    public decimal DamageFee { get; set; }
    public decimal SecurityDepositDeducted { get; set; } = 500000m;
    public decimal SettlementDifference { get; set; } // Giá trị chênh lệch = Remain + LateFee + Minibar + Damage - 500k
    public string SettlementType { get; set; } = string.Empty; // COLLECT, REFUND, EVEN
    public string SettlementMessage { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
    public string RoomStatusAfterCheckOut { get; set; } = "Dirty";
    public string BookingStatusAfterCheckOut { get; set; } = "Checked-out";
    public DateTime CreatedAt { get; set; }
}

public class MinibarUsageDetailDto
{
    public string ItemName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice => Quantity * UnitPrice;
}
