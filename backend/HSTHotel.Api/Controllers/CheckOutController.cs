using HSTHotel.Api.Models.DTOs.Common;
using HSTHotel.Api.Models.DTOs.F4_CheckOut;
using HSTHotel.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HSTHotel.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
public class CheckOutController : ControllerBase
{
    private readonly ICheckOutService _checkOutService;

    public CheckOutController(ICheckOutService checkOutService)
    {
        _checkOutService = checkOutService;
    }

    /// <summary>
    /// F4.1: Kiểm tra phòng và lấy bảng kê chi phí tạm tính trước khi check-out
    /// </summary>
    /// <remarks>
    /// - Kiểm tra phòng có khách lưu trú (Occupied). Nếu trống hoặc đang dọn: báo lỗi E1.
    /// - Trả về danh sách minibar khả dụng và ước tính phụ thu giờ.
    /// </remarks>
    [HttpPost("precheck")]
    [ProducesResponseType(typeof(ApiResponse<CheckOutPreCheckResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<CheckOutPreCheckResponse>), StatusCodes.Status400BadRequest)]
    public IActionResult PreCheckRoom([FromBody] CheckOutPreCheckRequest request)
    {
        var result = _checkOutService.PreCheck(request);
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// F4.2: Thực hiện xác nhận Trả phòng & Quyết toán hóa đơn
    /// </summary>
    /// <remarks>
    /// Tiêu chuẩn kiểm thử kết hợp:
    /// - E1: Phòng không có khách lưu trú
    /// - E2: Số lượng minibar âm hoặc sai định dạng (hợp lệ từ 0 đến 50)
    /// - E3: Phí bồi thường hư hại tài sản âm
    /// - Late Check-out Policy:
    ///   + Đến 12:00: Phụ thu 0%
    ///   + 12:01 - 15:00: Phụ thu 30%
    ///   + 15:01 - 18:00: Phụ thu 50%
    ///   + Sau 18:00: Phụ thu 100%
    /// - Quyết toán số dư (Settlement):
    ///   + > 0: COLLECT (Khách nộp thêm số dư)
    ///   + &lt; 0: REFUND (Hoàn trả tiền cọc thừa cho khách)
    ///   + = 0: EVEN (Cân bằng)
    /// - S1: Check-out thành công, phòng chuyển sang 'Dirty', booking chuyển sang 'Checked-out'.
    /// </remarks>
    [HttpPost("confirm")]
    [ProducesResponseType(typeof(ApiResponse<CheckOutResultResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<CheckOutResultResponse>), StatusCodes.Status400BadRequest)]
    public IActionResult ConfirmCheckOut([FromBody] CheckOutExecutionRequest request)
    {
        var result = _checkOutService.ExecuteCheckOut(request);
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}
