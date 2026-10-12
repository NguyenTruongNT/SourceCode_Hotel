using System.Collections.Concurrent;
using HSTHotel.Api.Core.Constants;
using HSTHotel.Api.Models.Entities;

namespace HSTHotel.Api.Data;

public class InMemoryHotelRepository : IHotelRepository
{
    private readonly ConcurrentDictionary<string, Room> _rooms = new();
    private readonly ConcurrentDictionary<string, Booking> _bookings = new();
    private readonly ConcurrentDictionary<string, MinibarProduct> _minibarProducts = new();
    private readonly ConcurrentDictionary<string, Invoice> _invoices = new();

    public InMemoryHotelRepository()
    {
        SeedData();
    }

    public void Reset()
    {
        _rooms.Clear();
        _bookings.Clear();
        _minibarProducts.Clear();
        _invoices.Clear();
        SeedData();
    }

    private void SeedData()
    {
        // ==========================================
        // 1. SEED MINIBAR PRODUCTS
        // ==========================================
        var minibarList = new List<MinibarProduct>
        {
            new() { Id = "MB-01", Name = "Nước suối", UnitPrice = 15000m },
            new() { Id = "MB-02", Name = "Nước ngọt", UnitPrice = 25000m },
            new() { Id = "MB-03", Name = "Bia", UnitPrice = 30000m },
            new() { Id = "MB-04", Name = "Snack", UnitPrice = 20000m }
        };
        foreach (var mb in minibarList)
        {
            _minibarProducts[mb.Name.ToLowerInvariant()] = mb;
        }

        // ==========================================
        // 2. SEED ROOMS
        // ==========================================
        var roomsList = new List<Room>
        {
            // Các phòng đặc thù trong kịch bản kiểm thử (Docx)
            new() { Id = "101", Floor = 1, Type = HotelConstants.RoomTypes.Standard, Status = HotelConstants.RoomStatuses.Available, ActivityStatus = "Active", Capacity = 2, PricePerNight = 750000m, Name = "Phòng Standard 101" },
            new() { Id = "205", Floor = 2, Type = HotelConstants.RoomTypes.Deluxe, Status = HotelConstants.RoomStatuses.Dirty, ActivityStatus = "Active", Capacity = 4, PricePerNight = 1200000m, Name = "Phòng Deluxe 205 (Dirty)" },
            new() { Id = "302", Floor = 3, Type = HotelConstants.RoomTypes.Deluxe, Status = HotelConstants.RoomStatuses.Clean, ActivityStatus = "Active", Capacity = 4, PricePerNight = 1200000m, Name = "Phòng Deluxe 302 (Clean)" },
            new() { Id = "303", Floor = 3, Type = HotelConstants.RoomTypes.Standard, Status = HotelConstants.RoomStatuses.Clean, ActivityStatus = "Inactive", Capacity = 4, PricePerNight = 750000m, Name = "Phòng Standard 303 (Inactive)" },

            // Dàn phòng từ tầng 2 đến tầng 5
            new() { Id = "201", Floor = 2, Type = HotelConstants.RoomTypes.Standard, Status = HotelConstants.RoomStatuses.Clean, ActivityStatus = "Active", Capacity = 2, PricePerNight = 750000m, Name = "Phòng Standard 201" },
            new() { Id = "202", Floor = 2, Type = HotelConstants.RoomTypes.Standard, Status = HotelConstants.RoomStatuses.Occupied, ActivityStatus = "Active", Capacity = 2, PricePerNight = 750000m, Name = "Phòng Standard 202", CurrentBookingId = "B-202" },
            new() { Id = "203", Floor = 2, Type = HotelConstants.RoomTypes.Standard, Status = HotelConstants.RoomStatuses.Dirty, ActivityStatus = "Active", Capacity = 2, PricePerNight = 750000m, Name = "Phòng Standard 203" },
            new() { Id = "204", Floor = 2, Type = HotelConstants.RoomTypes.Standard, Status = HotelConstants.RoomStatuses.Clean, ActivityStatus = "Active", Capacity = 2, PricePerNight = 750000m, Name = "Phòng Standard 204" },
            new() { Id = "206", Floor = 2, Type = HotelConstants.RoomTypes.Standard, Status = HotelConstants.RoomStatuses.Occupied, ActivityStatus = "Active", Capacity = 1, PricePerNight = 750000m, Name = "Phòng Standard 206", CurrentBookingId = "B-206" },

            new() { Id = "301", Floor = 3, Type = HotelConstants.RoomTypes.Superior, Status = HotelConstants.RoomStatuses.Clean, ActivityStatus = "Active", Capacity = 2, PricePerNight = 950000m, Name = "Phòng Superior 301" },
            new() { Id = "304", Floor = 3, Type = HotelConstants.RoomTypes.Superior, Status = HotelConstants.RoomStatuses.Clean, ActivityStatus = "Active", Capacity = 2, PricePerNight = 950000m, Name = "Phòng Superior 304" },
            new() { Id = "305", Floor = 3, Type = HotelConstants.RoomTypes.Superior, Status = HotelConstants.RoomStatuses.Occupied, ActivityStatus = "Active", Capacity = 2, PricePerNight = 950000m, Name = "Phòng Superior 305", CurrentBookingId = "B-305" },

            new() { Id = "401", Floor = 4, Type = HotelConstants.RoomTypes.Deluxe, Status = HotelConstants.RoomStatuses.Clean, ActivityStatus = "Active", Capacity = 4, PricePerNight = 1200000m, Name = "Phòng Deluxe 401" },
            new() { Id = "402", Floor = 4, Type = HotelConstants.RoomTypes.Deluxe, Status = HotelConstants.RoomStatuses.Occupied, ActivityStatus = "Active", Capacity = 4, PricePerNight = 1200000m, Name = "Phòng Deluxe 402", CurrentBookingId = "B-402" },
            new() { Id = "403", Floor = 4, Type = HotelConstants.RoomTypes.Deluxe, Status = HotelConstants.RoomStatuses.Clean, ActivityStatus = "Active", Capacity = 4, PricePerNight = 1200000m, Name = "Phòng Deluxe 403" },

            new() { Id = "501", Floor = 5, Type = HotelConstants.RoomTypes.Suite, Status = HotelConstants.RoomStatuses.Clean, ActivityStatus = "Active", Capacity = 10, PricePerNight = 1600000m, Name = "Phòng Suite Gia Đình 501" },
            new() { Id = "502", Floor = 5, Type = HotelConstants.RoomTypes.Suite, Status = HotelConstants.RoomStatuses.Clean, ActivityStatus = "Active", Capacity = 10, PricePerNight = 1600000m, Name = "Phòng Suite Hoàng Gia 502" }
        };

        foreach (var room in roomsList)
        {
            _rooms[room.Id] = room;
        }

        // ==========================================
        // 3. SEED BOOKINGS
        // ==========================================
        var bookingsList = new List<Booking>
        {
            // Booking chuẩn theo đặc tả kiểm thử TC_F3_01 -> TC_F3_07
            new()
            {
                Id = "HST10234",
                GuestName = "Nguyễn Văn Huỳnh",
                Phone = "0901234567",
                Email = "huynh.nv@example.com",
                CheckInDate = "2026-10-11",
                CheckOutDate = "2026-10-13",
                RoomType = HotelConstants.RoomTypes.Deluxe,
                GuestCount = 2,
                Cccd = "001202005991",
                TotalRoomCharge = 2400000m,
                DepositAmount = 1200000m,
                RemainingRoomCharge = 1200000m,
                SecurityDeposit = 0,
                Status = HotelConstants.BookingStatuses.Confirmed
            },

            // Booking đã hủy để kiểm tra TC_F3_03 / C3
            new()
            {
                Id = "HST10235",
                GuestName = "Trần Thị Mai",
                Phone = "0987654321",
                CheckInDate = "2026-10-11",
                CheckOutDate = "2026-10-12",
                RoomType = HotelConstants.RoomTypes.Standard,
                GuestCount = 1,
                Cccd = "001202005992",
                Status = HotelConstants.BookingStatuses.Cancelled
            },

            // Đơn đang ở (Occupied) phòng 202
            new()
            {
                Id = "B-202",
                GuestName = "Nguyễn Văn Nam",
                Phone = "0901234567",
                Email = "nam.nv@example.com",
                CheckInDate = "2026-10-10",
                CheckOutDate = "2026-10-12",
                RoomType = HotelConstants.RoomTypes.Standard,
                RoomNumber = "202",
                GuestCount = 2,
                Cccd = "001090123456",
                TotalRoomCharge = 1500000m,
                DepositAmount = 1000000m,
                RemainingRoomCharge = 500000m,
                SecurityDeposit = 500000m,
                Status = HotelConstants.BookingStatuses.InHouse,
                KeycardCode = "A1B2C3"
            },

            // Đơn đang ở (Occupied) phòng 302 phục vụ kiểm thử Check-out F4 (TC_F4_01 -> TC_F4_06)
            new()
            {
                Id = "HST20302",
                GuestName = "Đặng Quốc Bảo",
                Phone = "0966778899",
                Email = "bao.dq@example.com",
                CheckInDate = "2026-10-10",
                CheckOutDate = "2026-10-12",
                RoomType = HotelConstants.RoomTypes.Deluxe,
                RoomNumber = "302",
                GuestCount = 2,
                Cccd = "079090112233",
                TotalRoomCharge = 2400000m,
                DepositAmount = 1800000m,
                RemainingRoomCharge = 600000m,
                SecurityDeposit = 500000m, // Đã nộp cọc 500k khi check-in
                Status = HotelConstants.BookingStatuses.InHouse,
                KeycardCode = "A1B2C3"
            },

            // Đơn giao thoa ngày phục vụ kiểm thử trùng lịch F1 (TC_F1_09 / isOverlap)
            new()
            {
                Id = "HST88888",
                GuestName = "Khách Đặt Suite",
                Phone = "0912345678",
                CheckInDate = "2026-10-21",
                CheckOutDate = "2026-10-25",
                RoomType = HotelConstants.RoomTypes.Suite,
                GuestCount = 4,
                Status = HotelConstants.BookingStatuses.Confirmed
            }
        };

        foreach (var b in bookingsList)
        {
            _bookings[b.Id] = b;
        }
    }

    public IEnumerable<Room> GetAllRooms() => _rooms.Values;

    public Room? GetRoomById(string roomId)
    {
        _rooms.TryGetValue(roomId, out var room);
        return room;
    }

    public void UpdateRoom(Room room)
    {
        _rooms[room.Id] = room;
    }

    public IEnumerable<Booking> GetAllBookings() => _bookings.Values;

    public Booking? GetBookingById(string bookingId)
    {
        _bookings.TryGetValue(bookingId, out var booking);
        return booking;
    }

    public Booking? GetActiveBookingByRoomNumber(string roomNumber)
    {
        return _bookings.Values.FirstOrDefault(b =>
            b.RoomNumber == roomNumber &&
            (b.Status == HotelConstants.BookingStatuses.InHouse ||
             b.Status == HotelConstants.BookingStatuses.CheckedIn));
    }

    public void AddBooking(Booking booking)
    {
        _bookings[booking.Id] = booking;
    }

    public void UpdateBooking(Booking booking)
    {
        _bookings[booking.Id] = booking;
    }

    public IEnumerable<MinibarProduct> GetMinibarProducts() => _minibarProducts.Values;

    public MinibarProduct? GetMinibarProductByName(string name)
    {
        _minibarProducts.TryGetValue(name.Trim().ToLowerInvariant(), out var p);
        return p;
    }

    public void AddInvoice(Invoice invoice)
    {
        _invoices[invoice.InvoiceId] = invoice;
    }

    public Invoice? GetInvoiceById(string invoiceId)
    {
        _invoices.TryGetValue(invoiceId, out var invoice);
        return invoice;
    }
}
