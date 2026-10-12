using HSTHotel.Api.Models.DTOs.Common;
using HSTHotel.Api.Models.DTOs.F1_Search;
using HSTHotel.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HSTHotel.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
public class RoomSearchController : ControllerBase
{
    private readonly IRoomSearchService _roomSearchService;

    public RoomSearchController(IRoomSearchService roomSearchService)
    {
        _roomSearchService = roomSearchService;
    }

    /// <summary>
    /// F1: Tra cứu & Tìm kiếm phòng trống trực tuyến nâng cao
    /// </summary>
    /// <remarks>
    /// Tiêu chuẩn kiểm thử:
    /// - E1: Ngày nhận phòng không thể nhỏ hơn ngày hiện tại
    /// - E2: Ngày trả phòng phải sau ngày nhận ít nhất 01 đêm
    /// - E3: Số lượng khách phải từ 1 đến 10
    /// - S1: Tìm thấy danh sách phòng khả dụng
    /// - S2: Khách sạn đã kín phòng trong khoảng thời gian này
    /// </remarks>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<RoomSearchResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<RoomSearchResponse>), StatusCodes.Status400BadRequest)]
    public IActionResult SearchRooms([FromBody] RoomSearchRequest request)
    {
        var result = _roomSearchService.SearchAvailableRooms(request);
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}
