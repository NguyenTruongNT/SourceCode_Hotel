namespace HSTHotel.Api.Models.Entities;

public class Invoice
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
    public List<InvoiceItem> MinibarDetails { get; set; } = new();
    public decimal DamageFee { get; set; }
    public decimal SecurityDepositDeducted { get; set; } = 500000m;
    public decimal FinalSettlementAmount { get; set; }
    public string SettlementType { get; set; } = string.Empty; // COLLECT, REFUND, EVEN
    public string PaymentMethod { get; set; } = "Tiền mặt"; // Tiền mặt, Quẹt thẻ POS, Chuyển khoản QR
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class InvoiceItem
{
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal SubTotal => Quantity * UnitPrice;
}
