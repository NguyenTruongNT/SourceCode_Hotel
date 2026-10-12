using HSTHotel.Api.Core.Constants;
using HSTHotel.Api.Data;
using HSTHotel.Api.Models.DTOs.F3_CheckIn;
using HSTHotel.Api.Services.Implementations;
using Xunit;

namespace HSTHotel.Tests.F3_Tests;

/// <summary>
/// Toàn bộ các ca kiểm thử Hộp Đen cho chức năng F3 theo bảng mục 3.6.3 (Nguyễn Văn Trường phụ trách):
/// TC_F3_01 đến TC_F3_07 (Thiết kế kết hợp Bảng quyết định và Chuyển đổi trạng thái).
/// </summary>
public class F3_BlackBoxTests
{
    private readonly CheckInService _checkInService;
    private readonly InMemoryHotelRepository _repository;

    public F3_BlackBoxTests()
    {
        _repository = new InMemoryHotelRepository();
        _checkInService = new CheckInService(_repository);
    }

    [Fact]
    public void TC_F3_01_CheckIn_StandardOnTime_Success_S1()
    {
        // TC_F3_01: HST10234, CCCD 001202005991, Phòng 302 (Clean), Cọc 500k -> S1, P.302 -> Occupied
        var req = new CheckInExecutionRequest
        {
            Pnr = "HST10234",
            Cccd = "001202005991",
            AssignedRoomNumber = "302",
            SecurityDepositAmount = 500000m,
            KeycardCode = "A1B2C3",
            CheckInTime = "14:00"
        };

        var res = _checkInService.ExecuteCheckIn(req);

        Assert.True(res.Success);
        Assert.Equal(HotelConstants.F3.CodeS1, res.Code);
        Assert.NotNull(res.Data);
        Assert.Equal("302", res.Data.RoomNumber);
        Assert.Equal(HotelConstants.RoomStatuses.Occupied, res.Data.RoomStatus);
        Assert.Equal(500000m, res.Data.SecurityDeposit);

        // Kiểm tra trạng thái thực tế trong kho dữ liệu
        var room = _repository.GetRoomById("302");
        Assert.NotNull(room);
        Assert.Equal(HotelConstants.RoomStatuses.Occupied, room.Status);
    }

    [Fact]
    public void TC_F3_02_CheckIn_HigherDeposit_Success_S1()
    {
        // TC_F3_02: HST10234, CCCD 001202005991, Phòng 302 (Clean), Cọc 1,000,000 -> S1
        var req = new CheckInExecutionRequest
        {
            Pnr = "HST10234",
            Cccd = "001202005991",
            AssignedRoomNumber = "302",
            SecurityDepositAmount = 1000000m,
            KeycardCode = "A1B2C3",
            CheckInTime = "14:00"
        };

        var res = _checkInService.ExecuteCheckIn(req);

        Assert.True(res.Success);
        Assert.Equal(HotelConstants.F3.CodeS1, res.Code);
        Assert.NotNull(res.Data);
        Assert.Equal(1000000m, res.Data.SecurityDeposit);
    }

    [Fact]
    public void TC_F3_03_CheckIn_NonExistentPnr_Fails_E1()
    {
        // TC_F3_03: HST99999 (không tồn tại trong hệ thống) -> E1
        var req = new CheckInExecutionRequest
        {
            Pnr = "HST99999",
            Cccd = "001202005991",
            AssignedRoomNumber = "302",
            SecurityDepositAmount = 500000m,
            KeycardCode = "A1B2C3"
        };

        var res = _checkInService.ExecuteCheckIn(req);

        Assert.False(res.Success);
        Assert.Equal(HotelConstants.F3.CodeE1, res.Code);
        Assert.Equal(HotelConstants.F3.MsgE1, res.Message);
    }

    [Fact]
    public void TC_F3_04_CheckIn_MismatchedCccd_Fails_E2()
    {
        // TC_F3_04: Khác CCCD trong hồ sơ -> E2
        var req = new CheckInExecutionRequest
        {
            Pnr = "HST10234",
            Cccd = "001202005992", // Khác với 001202005991
            AssignedRoomNumber = "302",
            SecurityDepositAmount = 500000m,
            KeycardCode = "A1B2C3"
        };

        var res = _checkInService.ExecuteCheckIn(req);

        Assert.False(res.Success);
        Assert.Equal(HotelConstants.F3.CodeE2, res.Code);
        Assert.Equal(HotelConstants.F3.MsgE2_Cccd, res.Message);
    }

    [Fact]
    public void TC_F3_05_CheckIn_AssignDirtyRoom_Fails_E3()
    {
        // TC_F3_05: Gán phòng 205 (trạng thái Dirty) -> E3
        var req = new CheckInExecutionRequest
        {
            Pnr = "HST10234",
            Cccd = "001202005991",
            AssignedRoomNumber = "205", // Dirty
            SecurityDepositAmount = 500000m,
            KeycardCode = "A1B2C3"
        };

        var res = _checkInService.ExecuteCheckIn(req);

        Assert.False(res.Success);
        Assert.Equal(HotelConstants.F3.CodeE3, res.Code);
        Assert.Equal(HotelConstants.F3.MsgE3, res.Message);
    }

    [Fact]
    public void TC_F3_06_CheckIn_DepositBelowMinimum_499k_Fails_E4()
    {
        // TC_F3_06: Tiền cọc 499,000 VNĐ (dưới mức tối thiểu 500k) -> E4
        var req = new CheckInExecutionRequest
        {
            Pnr = "HST10234",
            Cccd = "001202005991",
            AssignedRoomNumber = "302",
            SecurityDepositAmount = 499000m,
            KeycardCode = "A1B2C3"
        };

        var res = _checkInService.ExecuteCheckIn(req);

        Assert.False(res.Success);
        Assert.Equal(HotelConstants.F3.CodeE4, res.Code);
        Assert.Equal(HotelConstants.F3.MsgE4, res.Message);
    }

    [Fact]
    public void TC_F3_07_CheckIn_NegativeDeposit_Fails_E4()
    {
        // TC_F3_07: Tiền cọc -100,000 VNĐ -> E4
        var req = new CheckInExecutionRequest
        {
            Pnr = "HST10234",
            Cccd = "001202005991",
            AssignedRoomNumber = "302",
            SecurityDepositAmount = -100000m,
            KeycardCode = "A1B2C3"
        };

        var res = _checkInService.ExecuteCheckIn(req);

        Assert.False(res.Success);
        Assert.Equal(HotelConstants.F3.CodeE4, res.Code);
        Assert.Equal(HotelConstants.F3.MsgE4, res.Message);
    }
}
