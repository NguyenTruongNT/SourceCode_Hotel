using HSTHotel.Api.Core.Constants;
using HSTHotel.Api.Core.WhiteBox;
using HSTHotel.Api.Data;
using HSTHotel.Api.Models.DTOs.Common;
using HSTHotel.Api.Models.DTOs.F4_CheckOut;
using HSTHotel.Api.Models.Entities;
using HSTHotel.Api.Services.Interfaces;

namespace HSTHotel.Api.Services.Implementations;

public class CheckOutService : ICheckOutService
{
    private readonly IHotelRepository _repository;

    public CheckOutService(IHotelRepository repository)
    {
        _repository = repository;
    }

    public ApiResponse<CheckOutPreCheckResponse> PreCheck(CheckOutPreCheckRequest request)
    {
        var room = !string.IsNullOrEmpty(request.RoomNumber) ? _repository.GetRoomById(request.RoomNumber) : null;
        var roomMatch = room != null ? new RoomCheckoutMatch(room.Status) : null;

        // 1. Kiểm tra tính hợp lệ của số phòng cần trả qua đơn vị validateCheckoutRoom()
        string roomValidation = F4WhiteBoxUnits.ValidateCheckoutRoom(request.RoomNumber, roomMatch);
        if (roomValidation == HotelConstants.F4.CodeE1)
        {
            return ApiResponse<CheckOutPreCheckResponse>.ErrorResponse(
                HotelConstants.F4.CodeE1,
                HotelConstants.F4.MsgE1);
        }

        var booking = _repository.GetActiveBookingByRoomNumber(room!.Id);
        if (booking == null)
        {
            return ApiResponse<CheckOutPreCheckResponse>.ErrorResponse(
                HotelConstants.F4.CodeE1,
                HotelConstants.F4.MsgE1);
        }

        string checkOutTime = !string.IsNullOrWhiteSpace(request.CheckOutTime) ? request.CheckOutTime : "12:00";
        double lateRate = F4WhiteBoxUnits.CalcLateFeeRate(checkOutTime);
        decimal estimatedLateFee = (decimal)lateRate * (room.PricePerNight > 0 ? room.PricePerNight : 1200000m);

        var minibarMenu = _repository.GetMinibarProducts()
            .Select(p => new MinibarItemDto
            {
                Id = p.Id,
                Name = p.Name,
                UnitPrice = p.UnitPrice
            })
            .ToList();

        var response = new CheckOutPreCheckResponse
        {
            RoomNumber = room.Id,
            BookingId = booking.Id,
            GuestName = booking.GuestName,
            RoomType = room.Type,
            RoomRatePerNight = room.PricePerNight,
            RemainingRoomCharge = booking.RemainingRoomCharge,
            CheckInDate = booking.CheckInDate,
            ScheduledCheckOutDate = booking.CheckOutDate,
            ActualCheckOutTime = checkOutTime,
            LateFeeRate = lateRate,
            EstimatedLateFee = estimatedLateFee,
            SecurityDeposit = booking.SecurityDeposit > 0 ? booking.SecurityDeposit : HotelConstants.F4.StandardDepositDeduction,
            AvailableMinibarMenu = minibarMenu
        };

        return ApiResponse<CheckOutPreCheckResponse>.SuccessResponse(
            HotelConstants.F4.CodeOk,
            "Lấy thông tin quyết toán phòng thành công.",
            response);
    }

    public ApiResponse<CheckOutResultResponse> ExecuteCheckOut(CheckOutExecutionRequest request)
    {
        var room = !string.IsNullOrEmpty(request.RoomNumber) ? _repository.GetRoomById(request.RoomNumber) : null;
        var roomMatch = room != null ? new RoomCheckoutMatch(room.Status) : null;

        // 1. Kiểm tra tính hợp lệ số phòng cần trả qua đơn vị validateCheckoutRoom()
        string roomValidation = F4WhiteBoxUnits.ValidateCheckoutRoom(request.RoomNumber, roomMatch);
        if (roomValidation == HotelConstants.F4.CodeE1)
        {
            return ApiResponse<CheckOutResultResponse>.ErrorResponse(
                HotelConstants.F4.CodeE1,
                HotelConstants.F4.MsgE1);
        }

        var booking = _repository.GetActiveBookingByRoomNumber(room!.Id);
        if (booking == null)
        {
            return ApiResponse<CheckOutResultResponse>.ErrorResponse(
                HotelConstants.F4.CodeE1,
                HotelConstants.F4.MsgE1);
        }

        // 2. Kiểm tra số lượng minibar tiêu thụ qua đơn vị validateMinibar()
        var minibarDetails = new List<MinibarUsageDetailDto>();
        decimal minibarTotal = 0;

        if (request.MinibarUsage != null && request.MinibarUsage.Count > 0)
        {
            foreach (var item in request.MinibarUsage)
            {
                string mbValidation = F4WhiteBoxUnits.ValidateMinibar(item.Quantity);
                if (mbValidation == HotelConstants.F4.CodeE2)
                {
                    return ApiResponse<CheckOutResultResponse>.ErrorResponse(
                        HotelConstants.F4.CodeE2,
                        HotelConstants.F4.MsgE2);
                }

                int qty = Core.Utilities.JsonConversionHelper.ToInt(item.Quantity, 0);
                if (qty > 0)
                {
                    var product = _repository.GetMinibarProductByName(item.ProductName);
                    decimal unitPrice = product != null ? product.UnitPrice : 25000m;
                    minibarTotal += qty * unitPrice;
                    minibarDetails.Add(new MinibarUsageDetailDto
                    {
                        ItemName = item.ProductName,
                        Quantity = qty,
                        UnitPrice = unitPrice
                    });
                }
            }
        }

        // 3. Kiểm tra phí bồi thường hư hại tài sản qua đơn vị validateDamageFee()
        string damageValidation = F4WhiteBoxUnits.ValidateDamageFee(request.DamageFee);
        if (damageValidation == HotelConstants.F4.CodeE3)
        {
            return ApiResponse<CheckOutResultResponse>.ErrorResponse(
                HotelConstants.F4.CodeE3,
                HotelConstants.F4.MsgE3);
        }

        decimal damageFee = Core.Utilities.JsonConversionHelper.ToDecimal(request.DamageFee, 0m);

        // 4. Tính toán tỷ lệ phụ thu trả phòng trễ qua đơn vị calcLateFeeRate()
        string checkOutTime = !string.IsNullOrWhiteSpace(request.CheckOutTime) ? request.CheckOutTime : "12:00";
        double lateRate = F4WhiteBoxUnits.CalcLateFeeRate(checkOutTime);
        decimal lateFee = (decimal)lateRate * (room.PricePerNight > 0 ? room.PricePerNight : 1200000m);

        decimal remainingRoomCharge = booking.RemainingRoomCharge;

        // 5. Quyết toán số dư trả phòng qua đơn vị calcSettlement()
        // Công thức: total = remain + lateFee + minibar + damage - 500000;
        string settlementType = F4WhiteBoxUnits.CalcSettlement(remainingRoomCharge, lateFee, minibarTotal, damageFee);
        decimal settlementDifference = remainingRoomCharge + lateFee + minibarTotal + damageFee - HotelConstants.F4.StandardDepositDeduction;

        string settlementMessage = settlementType switch
        {
            HotelConstants.F4.SettleCollect => $"Khách hàng cần thanh toán thêm số dư: {settlementDifference:N0} VNĐ.",
            HotelConstants.F4.SettleRefund => $"Lễ tân hoàn trả lại tiền cọc dư cho khách hàng: {Math.Abs(settlementDifference):N0} VNĐ.",
            _ => "Quyết toán hoàn tất vừa khớp (0 VNĐ). Không cần thu thêm hoặc hoàn cọc."
        };

        // 6. Cập nhật chuyển trạng thái đồng bộ
        // Booking -> Checked-out
        booking.Status = HotelConstants.BookingStatuses.CheckedOut;
        booking.ActualCheckOutTime = checkOutTime;
        _repository.UpdateBooking(booking);

        // Room -> Dirty (Theo quy tắc nghiệp vụ BR_F4_02 để buồng phòng dọn dẹp)
        room.Status = HotelConstants.RoomStatuses.Dirty;
        room.CurrentBookingId = null;
        _repository.UpdateRoom(room);

        // 7. Lưu hóa đơn vào hệ thống
        string invoiceId = $"INV-{DateTime.UtcNow:yyyyMMddHHmmss}-{room.Id}";
        var invoice = new Invoice
        {
            InvoiceId = invoiceId,
            BookingId = booking.Id,
            RoomNumber = room.Id,
            GuestName = booking.GuestName,
            CheckInDate = booking.CheckInDate,
            CheckOutDate = booking.CheckOutDate,
            ActualCheckOutTime = checkOutTime,
            RoomRatePerNight = room.PricePerNight,
            RemainingRoomCharge = remainingRoomCharge,
            LateFeeRate = lateRate,
            LateFeeAmount = lateFee,
            MinibarTotal = minibarTotal,
            MinibarDetails = minibarDetails.Select(m => new InvoiceItem
            {
                ProductName = m.ItemName,
                Quantity = m.Quantity,
                UnitPrice = m.UnitPrice
            }).ToList(),
            DamageFee = damageFee,
            SecurityDepositDeducted = HotelConstants.F4.StandardDepositDeduction,
            FinalSettlementAmount = settlementDifference,
            SettlementType = settlementType,
            PaymentMethod = request.SettlementPaymentMethod,
            CreatedAt = DateTime.UtcNow
        };
        _repository.AddInvoice(invoice);

        var result = new CheckOutResultResponse
        {
            InvoiceId = invoiceId,
            BookingId = booking.Id,
            RoomNumber = room.Id,
            GuestName = booking.GuestName,
            CheckInDate = booking.CheckInDate,
            CheckOutDate = booking.CheckOutDate,
            ActualCheckOutTime = checkOutTime,
            RoomRatePerNight = room.PricePerNight,
            RemainingRoomCharge = remainingRoomCharge,
            LateFeeRate = lateRate,
            LateFeeAmount = lateFee,
            MinibarTotal = minibarTotal,
            MinibarDetails = minibarDetails,
            DamageFee = damageFee,
            SecurityDepositDeducted = HotelConstants.F4.StandardDepositDeduction,
            SettlementDifference = settlementDifference,
            SettlementType = settlementType,
            SettlementMessage = settlementMessage,
            PaymentMethod = request.SettlementPaymentMethod,
            RoomStatusAfterCheckOut = room.Status,
            BookingStatusAfterCheckOut = booking.Status,
            CreatedAt = invoice.CreatedAt
        };

        // 8. Trả về kết quả thành công S1
        return ApiResponse<CheckOutResultResponse>.SuccessResponse(
            HotelConstants.F4.CodeS1,
            HotelConstants.F4.MsgS1,
            result);
    }
}
