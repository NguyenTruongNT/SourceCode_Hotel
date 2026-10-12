using HSTHotel.Api.Core.Constants;
using HSTHotel.Api.Core.WhiteBox;
using HSTHotel.Api.Data;
using HSTHotel.Api.Models.DTOs.Common;
using HSTHotel.Api.Models.DTOs.F1_Search;
using HSTHotel.Api.Services.Interfaces;

namespace HSTHotel.Api.Services.Implementations;

public class RoomSearchService : IRoomSearchService
{
    private readonly IHotelRepository _repository;

    public RoomSearchService(IHotelRepository repository)
    {
        _repository = repository;
    }

    public ApiResponse<RoomSearchResponse> SearchAvailableRooms(RoomSearchRequest request)
    {
        // Xác định ngày hiện tại làm mốc kiểm tra (mặc định 2026-10-11 nếu không truyền)
        string today = !string.IsNullOrEmpty(request.ReferenceToday)
            ? request.ReferenceToday
            : HotelConstants.F1.DefaultTestingToday;

        // 1. Kiểm tra tính hợp lệ ngày nhận phòng qua đơn vị kiểm thử hộp trắng validateCheckIn()
        string checkInResult = F1WhiteBoxUnits.ValidateCheckIn(request.CheckIn, today);
        if (checkInResult == HotelConstants.F1.CodeE1)
        {
            return ApiResponse<RoomSearchResponse>.ErrorResponse(
                HotelConstants.F1.CodeE1,
                HotelConstants.F1.MsgE1);
        }

        // 2. Kiểm tra tính hợp lệ ngày trả phòng qua đơn vị kiểm thử hộp trắng validateCheckOut()
        string checkOutResult = F1WhiteBoxUnits.ValidateCheckOut(request.CheckIn, request.CheckOut);
        if (checkOutResult == HotelConstants.F1.CodeE2)
        {
            return ApiResponse<RoomSearchResponse>.ErrorResponse(
                HotelConstants.F1.CodeE2,
                HotelConstants.F1.MsgE2);
        }

        // 3. Kiểm tra số lượng khách qua đơn vị kiểm thử hộp trắng validateGuests()
        string guestsResult = F1WhiteBoxUnits.ValidateGuests(request.Guests);
        if (guestsResult == HotelConstants.F1.CodeE3)
        {
            return ApiResponse<RoomSearchResponse>.ErrorResponse(
                HotelConstants.F1.CodeE3,
                HotelConstants.F1.MsgE3);
        }

        int guestsCount = Core.Utilities.JsonConversionHelper.ToInt(request.Guests, 1);
        string normalizedRoomType = string.IsNullOrWhiteSpace(request.RoomType) ? HotelConstants.RoomTypes.All : request.RoomType;

        var allRooms = _repository.GetAllRooms();
        var allBookings = _repository.GetAllBookings();

        var searchPeriod = new RoomPeriod(request.CheckIn!, request.CheckOut!);
        var matchingRooms = new List<AvailableRoomDto>();

        foreach (var room in allRooms)
        {
            // 4. Lọc phòng theo tiêu chí (Active, Sức chứa, Hạng phòng) qua đơn vị matchRoom()
            var roomMatch = new RoomSearchMatch(room.ActivityStatus, room.Capacity, room.Type);
            var searchCriteria = new SearchCriteriaMatch(guestsCount, normalizedRoomType);

            if (!F1WhiteBoxUnits.MatchRoom(roomMatch, searchCriteria))
            {
                continue;
            }

            // 5. Kiểm tra phòng có bị trùng lịch với đơn đặt hiện có qua đơn vị isOverlap()
            var roomBookings = allBookings.Where(b =>
                (b.RoomNumber == room.Id || (string.IsNullOrEmpty(b.RoomNumber) && b.RoomType == room.Type)));

            bool isRoomOccupied = roomBookings.Any(b =>
                F1WhiteBoxUnits.IsOverlap(
                    searchPeriod,
                    new BookingOverlapCheck(b.Status, b.CheckInDate, b.CheckOutDate)));

            if (!isRoomOccupied)
            {
                matchingRooms.Add(new AvailableRoomDto
                {
                    Id = room.Id,
                    Name = room.Name,
                    Type = room.Type,
                    Capacity = room.Capacity,
                    PricePerNight = room.PricePerNight,
                    Description = room.Description,
                    ImageUrl = room.ImageUrl,
                    Size = room.Size,
                    Beds = room.Beds,
                    Amenities = room.Amenities
                });
            }
        }

        var responseData = new RoomSearchResponse
        {
            CheckIn = request.CheckIn!,
            CheckOut = request.CheckOut!,
            Guests = guestsCount,
            SelectedRoomType = normalizedRoomType,
            TotalAvailableRooms = matchingRooms.Count,
            Rooms = matchingRooms
        };

        // Nếu hợp lệ nhưng không có phòng nào thỏa mãn -> S2 (Hết phòng)
        if (matchingRooms.Count == 0)
        {
            return ApiResponse<RoomSearchResponse>.SuccessResponse(
                HotelConstants.F1.CodeS2,
                HotelConstants.F1.MsgS2,
                responseData);
        }

        // Tìm kiếm thành công -> S1
        return ApiResponse<RoomSearchResponse>.SuccessResponse(
            HotelConstants.F1.CodeS1,
            HotelConstants.F1.MsgS1,
            responseData);
    }
}
