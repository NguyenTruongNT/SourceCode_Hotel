namespace HSTHotel.Api.Models.DTOs.Common;

/// <summary>
/// Chuẩn phản hồi API đồng nhất cho toàn bộ hệ thống
/// </summary>
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Code { get; set; } = string.Empty; // S1, S2, E1, E2, E3, E4, BLOCK, OK
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }

    public static ApiResponse<T> SuccessResponse(string code, string message, T data)
    {
        return new ApiResponse<T>
        {
            Success = true,
            Code = code,
            Message = message,
            Data = data
        };
    }

    public static ApiResponse<T> ErrorResponse(string code, string message, T? data = default)
    {
        return new ApiResponse<T>
        {
            Success = false,
            Code = code,
            Message = message,
            Data = data
        };
    }
}
