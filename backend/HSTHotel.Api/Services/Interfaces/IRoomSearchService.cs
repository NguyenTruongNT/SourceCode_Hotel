using HSTHotel.Api.Models.DTOs.Common;
using HSTHotel.Api.Models.DTOs.F1_Search;

namespace HSTHotel.Api.Services.Interfaces;

public interface IRoomSearchService
{
    ApiResponse<RoomSearchResponse> SearchAvailableRooms(RoomSearchRequest request);
}
