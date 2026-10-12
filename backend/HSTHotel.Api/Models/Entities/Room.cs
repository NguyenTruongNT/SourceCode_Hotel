namespace HSTHotel.Api.Models.Entities;

public class Room
{
    public string Id { get; set; } = string.Empty; // Mã phòng: 101, 201, 302...
    public int Floor { get; set; }
    public string Type { get; set; } = string.Empty; // Standard, Superior, Deluxe, Suite
    public string Status { get; set; } = "Clean"; // Clean, Occupied, Dirty, Available
    public string ActivityStatus { get; set; } = "Active"; // Active, Inactive
    public int Capacity { get; set; } = 2; // Sức chứa khách tối đa
    public decimal PricePerNight { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Size { get; set; } = "25m²";
    public string Beds { get; set; } = "1 giường đôi";
    public List<string> Amenities { get; set; } = new();
    public string? CurrentBookingId { get; set; }
}
