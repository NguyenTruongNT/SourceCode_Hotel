using HSTHotel.Api.Models.DTOs.Common;
using HSTHotel.Api.Models.DTOs.F4_CheckOut;

namespace HSTHotel.Api.Services.Interfaces;

public interface ICheckOutService
{
    ApiResponse<CheckOutPreCheckResponse> PreCheck(CheckOutPreCheckRequest request);
    ApiResponse<CheckOutResultResponse> ExecuteCheckOut(CheckOutExecutionRequest request);
}
