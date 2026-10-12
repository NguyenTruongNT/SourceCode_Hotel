using HSTHotel.Api.Core.Constants;
using HSTHotel.Api.Data;
using HSTHotel.Api.Models.DTOs.F4_CheckOut;
using HSTHotel.Api.Services.Implementations;
using Xunit;

namespace HSTHotel.Tests.F4_Tests;

/// <summary>
/// Toàn bộ các ca kiểm thử Hộp Đen cho chức năng F4 theo bảng mục 3.8.3 (Nguyễn Văn Trường phụ trách):
/// TC_F4_01 đến TC_F4_07 (Thiết kế kết hợp BVA và Phân vùng tương đương EP).
/// </summary>
public class F4_BlackBoxTests
{
    private readonly CheckOutService _checkOutService;
    private readonly InMemoryHotelRepository _repository;

    public F4_BlackBoxTests()
    {
        _repository = new InMemoryHotelRepository();
        var room302 = _repository.GetRoomById("302");
        if (room302 != null)
        {
            room302.Status = HotelConstants.RoomStatuses.Occupied;
            room302.CurrentBookingId = "HST20302";
            _repository.UpdateRoom(room302);
        }
        _checkOutService = new CheckOutService(_repository);
    }

    [Fact]
    public void TC_F4_01_CheckOut_OnTime_NoExtraFees_Success_S1()
    {
        // TC_F4_01: Phòng 302, 11:45, 0 đồ / 0 đ -> S1, Phụ thu 0đ, P.302 -> Dirty
        var req = new CheckOutExecutionRequest
        {
            RoomNumber = "302",
            CheckOutTime = "11:45",
            MinibarUsage = new(),
            DamageFee = 0,
            SettlementPaymentMethod = "Tiền mặt"
        };

        var res = _checkOutService.ExecuteCheckOut(req);

        Assert.True(res.Success);
        Assert.Equal(HotelConstants.F4.CodeS1, res.Code);
        Assert.NotNull(res.Data);
        Assert.Equal(0, res.Data.LateFeeAmount);
        Assert.Equal(HotelConstants.RoomStatuses.Dirty, res.Data.RoomStatusAfterCheckOut);
        Assert.Equal(HotelConstants.BookingStatuses.CheckedOut, res.Data.BookingStatusAfterCheckOut);

        // Kiểm tra trạng thái buồng phòng đã chuyển sang Dirty (BR_F4_02)
        var room = _repository.GetRoomById("302");
        Assert.NotNull(room);
        Assert.Equal(HotelConstants.RoomStatuses.Dirty, room.Status);
    }

    [Fact]
    public void TC_F4_02_CheckOut_LateAt_12_01_30Percent_S1()
    {
        // TC_F4_02: Trả phòng lúc 12:01 (phụ thu 30%) -> S1
        var req = new CheckOutExecutionRequest
        {
            RoomNumber = "302",
            CheckOutTime = "12:01",
            MinibarUsage = new(),
            DamageFee = 0
        };

        var res = _checkOutService.ExecuteCheckOut(req);

        Assert.True(res.Success);
        Assert.Equal(HotelConstants.F4.CodeS1, res.Code);
        Assert.NotNull(res.Data);
        Assert.Equal(0.3, res.Data.LateFeeRate);
        Assert.Equal(360000m, res.Data.LateFeeAmount); // 30% của 1,200,000 = 360,000
    }

    [Fact]
    public void TC_F4_03_CheckOut_LateAt_15_01_50Percent_S1()
    {
        // TC_F4_03: Trả phòng lúc 15:01 (phụ thu 50%) -> S1
        var req = new CheckOutExecutionRequest
        {
            RoomNumber = "302",
            CheckOutTime = "15:01",
            MinibarUsage = new(),
            DamageFee = 0
        };

        var res = _checkOutService.ExecuteCheckOut(req);

        Assert.True(res.Success);
        Assert.Equal(HotelConstants.F4.CodeS1, res.Code);
        Assert.NotNull(res.Data);
        Assert.Equal(0.5, res.Data.LateFeeRate);
        Assert.Equal(600000m, res.Data.LateFeeAmount); // 50% của 1,200,000 = 600,000
    }

    [Fact]
    public void TC_F4_04_CheckOut_LateAt_18_05_100Percent_S1()
    {
        // TC_F4_04: Trả phòng lúc 18:05 (phụ thu 100%) -> S1
        var req = new CheckOutExecutionRequest
        {
            RoomNumber = "302",
            CheckOutTime = "18:05",
            MinibarUsage = new(),
            DamageFee = 0
        };

        var res = _checkOutService.ExecuteCheckOut(req);

        Assert.True(res.Success);
        Assert.Equal(HotelConstants.F4.CodeS1, res.Code);
        Assert.NotNull(res.Data);
        Assert.Equal(1.0, res.Data.LateFeeRate);
        Assert.Equal(1200000m, res.Data.LateFeeAmount); // 100% của 1,200,000 = 1,200,000
    }

    [Fact]
    public void TC_F4_05_CheckOut_WithMinibar_And_DamageFee_S1()
    {
        // TC_F4_05: 3 bia (3 * 30k = 90k) + Hư hại 200k
        // Booking HST20302: Tiền phòng còn thiếu = 600k, Tiền cọc thiết bị = 500k
        // Quyết toán = 600k (remain) + 0 (late) + 90k (minibar) + 200k (damage) - 500k = 390k (COLLECT)
        var req = new CheckOutExecutionRequest
        {
            RoomNumber = "302",
            CheckOutTime = "11:30",
            MinibarUsage = new List<MinibarItemInput>
            {
                new() { ProductName = "Bia", Quantity = 3 }
            },
            DamageFee = 200000m
        };

        var res = _checkOutService.ExecuteCheckOut(req);

        Assert.True(res.Success);
        Assert.Equal(HotelConstants.F4.CodeS1, res.Code);
        Assert.NotNull(res.Data);
        Assert.Equal(90000m, res.Data.MinibarTotal);
        Assert.Equal(200000m, res.Data.DamageFee);
        Assert.Equal(HotelConstants.F4.SettleCollect, res.Data.SettlementType);
        Assert.Equal(390000m, res.Data.SettlementDifference);
    }

    [Fact]
    public void TC_F4_06_CheckOut_NegativeMinibar_Fails_E2()
    {
        // TC_F4_06: Số lượng minibar âm (-2 nước ngọt) -> E2
        var req = new CheckOutExecutionRequest
        {
            RoomNumber = "302",
            CheckOutTime = "11:30",
            MinibarUsage = new List<MinibarItemInput>
            {
                new() { ProductName = "Nước ngọt", Quantity = -2 }
            },
            DamageFee = 0
        };

        var res = _checkOutService.ExecuteCheckOut(req);

        Assert.False(res.Success);
        Assert.Equal(HotelConstants.F4.CodeE2, res.Code);
        Assert.Equal(HotelConstants.F4.MsgE2, res.Message);
    }

    [Fact]
    public void TC_F4_07_CheckOut_AvailableRoomWithoutGuest_Fails_E1()
    {
        // TC_F4_07: Chọn phòng 101 đang trống (Available) để check-out -> E1
        var req = new CheckOutExecutionRequest
        {
            RoomNumber = "101",
            CheckOutTime = "11:30",
            MinibarUsage = new(),
            DamageFee = 0
        };

        var res = _checkOutService.ExecuteCheckOut(req);

        Assert.False(res.Success);
        Assert.Equal(HotelConstants.F4.CodeE1, res.Code);
        Assert.Equal(HotelConstants.F4.MsgE1, res.Message);
    }
}
