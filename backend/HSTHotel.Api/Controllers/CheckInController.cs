using HSTHotel.Api.Models.DTOs.Common;
using HSTHotel.Api.Models.DTOs.F3_CheckIn;
using HSTHotel.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HSTHotel.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
public class CheckInController : ControllerBase
{
    private readonly ICheckInService _checkInService;

    public CheckInController(ICheckInService checkInService)
    {
        _checkInService = checkInService;
    }

    /// <summary>
    /// F3.1: Tra cứu thông tin hồ sơ đặt phòng theo mã PNR
    /// </summary>
    /// <remarks>
    /// Kiểm tra định dạng PNR (HST + 5 số) và trạng thái Confirmed.
    /// Sai hoặc đã hủy báo lỗi E1.
    /// </remarks>
    [HttpGet("lookup/{pnr}")]
    [ProducesResponseType(typeof(ApiResponse<PnrLookupResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<PnrLookupResponse>), StatusCodes.Status400BadRequest)]
    public IActionResult LookupPnr([FromRoute] string pnr)
    {
        var result = _checkInService.LookupPnr(pnr);
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// F3.2: Ước tính chính sách và tỷ lệ phụ thu nhận phòng sớm (Early Check-in)
    /// </summary>
    /// <remarks>
    /// - Sau 14:00: Phụ thu 0%
    /// - 09:00 - 13:59: Phụ thu 30% (nếu có sẵn phòng sạch)
    /// - 06:00 - 08:59: Phụ thu 50%
    /// - Trước 06:00 hoặc không có phòng sạch: Báo lỗi E2
    /// </remarks>
    [HttpPost("estimate-early")]
    [ProducesResponseType(typeof(ApiResponse<EarlyCheckInEstimateResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<EarlyCheckInEstimateResponse>), StatusCodes.Status400BadRequest)]
    public IActionResult EstimateEarlyCheckIn([FromBody] EarlyCheckInEstimateRequest request)
    {
        var result = _checkInService.EstimateEarlyCheckIn(request);
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// F3.3: Thực hiện xác nhận Check-in và gán phòng tại quầy
    /// </summary>
    /// <remarks>
    /// Tiêu chuẩn kiểm thử kết hợp:
    /// - E1: Sai mã PNR
    /// - E2: Sai số CCCD (yêu cầu đúng 12 số và khớp hồ sơ)
    /// - E3: Gán phòng sai hạng hoặc phòng chưa dọn (Dirty)
    /// - E4: Tiền cọc thiết bị nhỏ hơn 500,000 VNĐ
    /// - BLOCK: Quét thẻ từ không hợp lệ (yêu cầu 6-10 ký tự Hex)
    /// - S1: Check-in thành công, gán phòng Occupied, đổi trạng thái booking In-house
    /// </remarks>
    [HttpPost("confirm")]
    [ProducesResponseType(typeof(ApiResponse<CheckInResultResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<CheckInResultResponse>), StatusCodes.Status400BadRequest)]
    public IActionResult ConfirmCheckIn([FromBody] CheckInExecutionRequest request)
    {
        var result = _checkInService.ExecuteCheckIn(request);
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}
