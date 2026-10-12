using HSTHotel.Api.Models.DTOs.Common;
using HSTHotel.Api.Models.DTOs.F3_CheckIn;

namespace HSTHotel.Api.Services.Interfaces;

public interface ICheckInService
{
    ApiResponse<PnrLookupResponse> LookupPnr(string? pnr);
    ApiResponse<EarlyCheckInEstimateResponse> EstimateEarlyCheckIn(EarlyCheckInEstimateRequest request);
    ApiResponse<CheckInResultResponse> ExecuteCheckIn(CheckInExecutionRequest request);
}
