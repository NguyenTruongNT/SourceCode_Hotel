namespace HSTHotel.Api.Models.DTOs.F3_CheckIn;

public class PnrLookupRequest
{
    public string? Pnr { get; set; }
}

public class PnrLookupResponse
{
    public string Pnr { get; set; } = string.Empty;
    public string GuestName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string CheckInDate { get; set; } = string.Empty;
    public string CheckOutDate { get; set; } = string.Empty;
    public string RoomType { get; set; } = string.Empty;
    public int GuestCount { get; set; }
    public string Cccd { get; set; } = string.Empty;
    public decimal TotalRoomCharge { get; set; }
    public decimal DepositPaidOnline { get; set; }
    public decimal RemainingRoomCharge { get; set; }
    public string Status { get; set; } = string.Empty;
    public List<AssignableRoomDto> AvailableCleanRooms { get; set; } = new();
}

public class AssignableRoomDto
{
    public string RoomNumber { get; set; } = string.Empty;
    public int Floor { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

public class EarlyCheckInEstimateRequest
{
    public string Pnr { get; set; } = string.Empty;
    public string CheckInTime { get; set; } = "14:00"; // HH:mm
}

public class EarlyCheckInEstimateResponse
{
    public string Pnr { get; set; } = string.Empty;
    public string CheckInTime { get; set; } = string.Empty;
    public bool HasCleanRoom { get; set; }
    public double SurchargeRate { get; set; }
    public decimal SurchargeAmount { get; set; }
    public bool CanCheckIn { get; set; }
    public string Message { get; set; } = string.Empty;
}

public class CheckInExecutionRequest
{
    public string? Pnr { get; set; }
    public string? Cccd { get; set; }
    public string? AssignedRoomNumber { get; set; }
    public object? SecurityDepositAmount { get; set; } = 500000m;
    public string? KeycardCode { get; set; }
    public string PaymentMethod { get; set; } = "Tiền mặt"; // Tiền mặt / Quẹt thẻ
    public string? CheckInTime { get; set; } // HH:mm (mặc định lấy giờ hiện tại nếu null)
}

public class CheckInResultResponse
{
    public string Pnr { get; set; } = string.Empty;
    public string GuestName { get; set; } = string.Empty;
    public string RoomNumber { get; set; } = string.Empty;
    public string RoomType { get; set; } = string.Empty;
    public string CheckInDate { get; set; } = string.Empty;
    public string CheckOutDate { get; set; } = string.Empty;
    public string CheckInTime { get; set; } = string.Empty;
    public string KeycardCode { get; set; } = string.Empty;
    public decimal SecurityDeposit { get; set; }
    public decimal EarlyCheckInFee { get; set; }
    public string BookingStatus { get; set; } = string.Empty;
    public string RoomStatus { get; set; } = string.Empty;
    public string ReceiptNumber { get; set; } = string.Empty;
}
