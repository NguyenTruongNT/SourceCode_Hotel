using HSTHotel.Api.Models.Entities;

namespace HSTHotel.Api.Data;

public interface IHotelRepository
{
    IEnumerable<Room> GetAllRooms();
    Room? GetRoomById(string roomId);
    void UpdateRoom(Room room);

    IEnumerable<Booking> GetAllBookings();
    Booking? GetBookingById(string bookingId);
    Booking? GetActiveBookingByRoomNumber(string roomNumber);
    void AddBooking(Booking booking);
    void UpdateBooking(Booking booking);

    IEnumerable<MinibarProduct> GetMinibarProducts();
    MinibarProduct? GetMinibarProductByName(string name);

    void AddInvoice(Invoice invoice);
    Invoice? GetInvoiceById(string invoiceId);

    void Reset();
}
