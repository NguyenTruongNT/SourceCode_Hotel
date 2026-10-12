using HSTHotel.Api.Core.Constants;
using HSTHotel.Api.Core.WhiteBox;
using HSTHotel.Api.Data;
using HSTHotel.Api.Models.DTOs.Common;
using HSTHotel.Api.Models.DTOs.F3_CheckIn;
using HSTHotel.Api.Services.Interfaces;

namespace HSTHotel.Api.Services.Implementations;

public class CheckInService : ICheckInService
{
    private readonly IHotelRepository _repository;

    public CheckInService(IHotelRepository repository)
    {
        _repository = repository;
    }

    public ApiResponse<PnrLookupResponse> LookupPnr(string? pnr)
    {
        var booking = !string.IsNullOrEmpty(pnr) ? _repository.GetBookingById(pnr) : null;
        var bookingMatch = booking != null
            ? new BookingCheckInMatch(booking.Status, booking.Cccd, booking.RoomType)
            : null;

        // 1. Kiểm tra tính hợp lệ của mã PNR qua đơn vị validatePNR()
        string pnrResult = F3WhiteBoxUnits.ValidatePNR(pnr, bookingMatch);
        if (pnrResult == HotelConstants.F3.CodeE1)
        {
            return ApiResponse<PnrLookupResponse>.ErrorResponse(
                HotelConstants.F3.CodeE1,
                HotelConstants.F3.MsgE1);
        }

        // Lấy danh sách các phòng trống sạch (Clean) thuộc đúng hạng phòng của đơn đặt
        var cleanRooms = _repository.GetAllRooms()
            .Where(r => r.Type.Equals(booking!.RoomType, StringComparison.OrdinalIgnoreCase) &&
                        (r.Status == HotelConstants.RoomStatuses.Clean || r.Status == HotelConstants.RoomStatuses.Available))
            .Select(r => new AssignableRoomDto
            {
                RoomNumber = r.Id,
                Floor = r.Floor,
                Type = r.Type,
                Status = r.Status
            })
            .ToList();

        var response = new PnrLookupResponse
        {
            Pnr = booking!.Id,
            GuestName = booking.GuestName,
            Phone = booking.Phone,
            Email = booking.Email,
            CheckInDate = booking.CheckInDate,
            CheckOutDate = booking.CheckOutDate,
            RoomType = booking.RoomType,
            GuestCount = booking.GuestCount,
            Cccd = booking.Cccd,
            TotalRoomCharge = booking.TotalRoomCharge,
            DepositPaidOnline = booking.DepositAmount,
            RemainingRoomCharge = booking.RemainingRoomCharge,
            Status = booking.Status,
            AvailableCleanRooms = cleanRooms
        };

        return ApiResponse<PnrLookupResponse>.SuccessResponse(
            HotelConstants.F3.CodeOk,
            "Tra cứu mã đặt phòng thành công.",
            response);
    }

    public ApiResponse<EarlyCheckInEstimateResponse> EstimateEarlyCheckIn(EarlyCheckInEstimateRequest request)
    {
        var booking = _repository.GetBookingById(request.Pnr);
        if (booking == null)
        {
            return ApiResponse<EarlyCheckInEstimateResponse>.ErrorResponse(
                HotelConstants.F3.CodeE1,
                HotelConstants.F3.MsgE1);
        }

        bool hasCleanRoom = _repository.GetAllRooms().Any(r =>
            r.Type.Equals(booking.RoomType, StringComparison.OrdinalIgnoreCase) &&
            (r.Status == HotelConstants.RoomStatuses.Clean || r.Status == HotelConstants.RoomStatuses.Available));

        string time = string.IsNullOrWhiteSpace(request.CheckInTime) ? "14:00" : request.CheckInTime;

        // Tính tỷ lệ phụ thu nhận phòng sớm qua đơn vị earlyCheckinRate()
        double rate = F3WhiteBoxUnits.EarlyCheckinRate(time, hasCleanRoom);

        if (rate < 0)
        {
            return ApiResponse<EarlyCheckInEstimateResponse>.ErrorResponse(
                HotelConstants.F3.CodeE2,
                HotelConstants.F3.MsgE2_EarlyCheckin,
                new EarlyCheckInEstimateResponse
                {
                    Pnr = booking.Id,
                    CheckInTime = time,
                    HasCleanRoom = hasCleanRoom,
                    SurchargeRate = 0,
                    SurchargeAmount = 0,
                    CanCheckIn = false,
                    Message = HotelConstants.F3.MsgE2_EarlyCheckin
                });
        }

        // Tính tiền phụ thu trên giá 1 đêm
        decimal roomNightPrice = booking.TotalRoomCharge > 0 ? booking.TotalRoomCharge : 1200000m;
        decimal fee = (decimal)rate * roomNightPrice;

        return ApiResponse<EarlyCheckInEstimateResponse>.SuccessResponse(
            HotelConstants.F3.CodeOk,
            rate > 0 ? $"Phụ thu nhận phòng sớm: {rate * 100}% giá phòng 1 đêm." : "Nhận phòng đúng giờ quy định (không phụ thu).",
            new EarlyCheckInEstimateResponse
            {
                Pnr = booking.Id,
                CheckInTime = time,
                HasCleanRoom = hasCleanRoom,
                SurchargeRate = rate,
                SurchargeAmount = fee,
                CanCheckIn = true,
                Message = rate > 0 ? $"Phụ thu {rate * 100}%" : "Đúng giờ (0%)"
            });
    }

    public ApiResponse<CheckInResultResponse> ExecuteCheckIn(CheckInExecutionRequest request)
    {
        var booking = !string.IsNullOrEmpty(request.Pnr) ? _repository.GetBookingById(request.Pnr) : null;
        var bookingMatch = booking != null
            ? new BookingCheckInMatch(booking.Status, booking.Cccd, booking.RoomType)
            : null;

        // 1. Kiểm tra mã đặt phòng PNR qua đơn vị validatePNR()
        string pnrResult = F3WhiteBoxUnits.ValidatePNR(request.Pnr, bookingMatch);
        if (pnrResult == HotelConstants.F3.CodeE1)
        {
            return ApiResponse<CheckInResultResponse>.ErrorResponse(
                HotelConstants.F3.CodeE1,
                HotelConstants.F3.MsgE1);
        }

        // 2. Đối chiếu số CCCD người nhận qua đơn vị verifyCCCD()
        string cccdResult = F3WhiteBoxUnits.VerifyCCCD(request.Cccd, bookingMatch);
        if (cccdResult == HotelConstants.F3.CodeE2)
        {
            return ApiResponse<CheckInResultResponse>.ErrorResponse(
                HotelConstants.F3.CodeE2,
                HotelConstants.F3.MsgE2_Cccd);
        }

        // 3. Kiểm tra gán phòng thực tế qua đơn vị validateRoomAssign()
        var assignedRoom = !string.IsNullOrEmpty(request.AssignedRoomNumber)
            ? _repository.GetRoomById(request.AssignedRoomNumber)
            : null;

        var roomAssignMatch = assignedRoom != null
            ? new RoomAssignMatch(assignedRoom.Type, assignedRoom.Status)
            : null;

        string roomResult = F3WhiteBoxUnits.ValidateRoomAssign(roomAssignMatch, bookingMatch);
        if (roomResult == HotelConstants.F3.CodeE3)
        {
            return ApiResponse<CheckInResultResponse>.ErrorResponse(
                HotelConstants.F3.CodeE3,
                HotelConstants.F3.MsgE3);
        }

        // 4. Kiểm tra tiền cọc đảm bảo tài sản qua đơn vị validateDeposit()
        string depositResult = F3WhiteBoxUnits.ValidateDeposit(request.SecurityDepositAmount);
        if (depositResult == HotelConstants.F3.CodeE4)
        {
            return ApiResponse<CheckInResultResponse>.ErrorResponse(
                HotelConstants.F3.CodeE4,
                HotelConstants.F3.MsgE4);
        }

        // 5. Kiểm tra mã thẻ từ bàn giao qua đơn vị validateKeycard()
        string keycardResult = F3WhiteBoxUnits.ValidateKeycard(request.KeycardCode);
        if (keycardResult == HotelConstants.F3.CodeBlock)
        {
            return ApiResponse<CheckInResultResponse>.ErrorResponse(
                HotelConstants.F3.CodeBlock,
                HotelConstants.F3.MsgBlock);
        }

        decimal depositNum = Core.Utilities.JsonConversionHelper.ToDecimal(request.SecurityDepositAmount, 500000m);

        // 6. Tính toán phụ thu nhận phòng sớm (nếu có truyền giờ check-in)
        string checkInTime = !string.IsNullOrWhiteSpace(request.CheckInTime) ? request.CheckInTime : "14:00";
        double earlyRate = F3WhiteBoxUnits.EarlyCheckinRate(checkInTime, hasCleanRoom: true);
        decimal earlyFee = 0;
        if (earlyRate > 0)
        {
            earlyFee = (decimal)earlyRate * (assignedRoom!.PricePerNight > 0 ? assignedRoom.PricePerNight : 1200000m);
        }

        // 7. Đồng bộ cập nhật trạng thái hệ thống (State Transition)
        // Booking -> Checked-in / In-house
        booking!.Status = HotelConstants.BookingStatuses.InHouse;
        booking.RoomNumber = assignedRoom!.Id;
        booking.Cccd = request.Cccd!;
        booking.KeycardCode = request.KeycardCode!;
        booking.SecurityDeposit = depositNum;
        booking.EarlyCheckInRate = Math.Max(0, earlyRate);
        booking.EarlyCheckInFee = earlyFee;
        booking.ActualCheckInTime = checkInTime;
        _repository.UpdateBooking(booking);

        // Room -> Occupied
        assignedRoom.Status = HotelConstants.RoomStatuses.Occupied;
        assignedRoom.CurrentBookingId = booking.Id;
        _repository.UpdateRoom(assignedRoom);

        string receiptNo = $"RC-{DateTime.UtcNow:yyyyMMddHHmmss}-{booking.RoomNumber}";

        var result = new CheckInResultResponse
        {
            Pnr = booking.Id,
            GuestName = booking.GuestName,
            RoomNumber = assignedRoom.Id,
            RoomType = assignedRoom.Type,
            CheckInDate = booking.CheckInDate,
            CheckOutDate = booking.CheckOutDate,
            CheckInTime = checkInTime,
            KeycardCode = booking.KeycardCode,
            SecurityDeposit = depositNum,
            EarlyCheckInFee = earlyFee,
            BookingStatus = booking.Status,
            RoomStatus = assignedRoom.Status,
            ReceiptNumber = receiptNo
        };

        // Trả về kết quả thành công S1
        return ApiResponse<CheckInResultResponse>.SuccessResponse(
            HotelConstants.F3.CodeS1,
            HotelConstants.F3.MsgS1,
            result);
    }
}
