namespace HSTHotel.Api.Models.DTOs.F1_Search;

public class RoomSearchRequest
{
    public string? CheckIn { get; set; } // Định dạng YYYY-MM-DD
    public string? CheckOut { get; set; } // Định dạng YYYY-MM-DD
    public object? Guests { get; set; } = 1; // Số lượng khách (mặc định 1)
    public string RoomType { get; set; } = "ALL"; // Mặc định 'ALL' hoặc Standard, Superior, Deluxe, Suite
    public string? ReferenceToday { get; set; } // Mốc ngày hiện tại giả lập phục vụ kiểm thử (mặc định nếu null là 2026-10-11 hoặc hôm nay)
}

public class RoomSearchResponse
{
    public string CheckIn { get; set; } = string.Empty;
    public string CheckOut { get; set; } = string.Empty;
    public int Guests { get; set; }
    public string SelectedRoomType { get; set; } = "ALL";
    public int TotalAvailableRooms { get; set; }
    public List<AvailableRoomDto> Rooms { get; set; } = new();
}

public class AvailableRoomDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public decimal PricePerNight { get; set; }
    public string Description { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public string Beds { get; set; } = string.Empty;
    public List<string> Amenities { get; set; } = new();
}
