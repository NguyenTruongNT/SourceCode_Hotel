using HSTHotel.Api.Core.Constants;
using HSTHotel.Api.Data;
using HSTHotel.Api.Models.DTOs.F1_Search;
using HSTHotel.Api.Services.Implementations;
using Xunit;

namespace HSTHotel.Tests.F1_Tests;

/// <summary>
/// Toàn bộ các ca kiểm thử Hộp Đen cho chức năng F1 theo bảng mục 3.2.3:
/// TC_F1_01 đến TC_F1_09 (Rút gọn từ 72 ca lý thuyết qua BVA & Bảng quyết định).
/// </summary>
public class F1_BlackBoxTests
{
    private readonly RoomSearchService _searchService;
    private const string FixedToday = "2026-10-11";

    public F1_BlackBoxTests()
    {
        var repository = new InMemoryHotelRepository();
        _searchService = new RoomSearchService(repository);
    }

    [Fact]
    public void TC_F1_01_Search_AllRoomTypes_Success()
    {
        // TC_F1_01: Today + 1 (2026-10-12), Today + 3 (2026-10-14), 2 khách, Tất cả -> S1
        var req = new RoomSearchRequest
        {
            CheckIn = "2026-10-12",
            CheckOut = "2026-10-14",
            Guests = 2,
            RoomType = "ALL",
            ReferenceToday = FixedToday
        };

        var res = _searchService.SearchAvailableRooms(req);

        Assert.True(res.Success);
        Assert.Equal(HotelConstants.F1.CodeS1, res.Code);
        Assert.NotNull(res.Data);
        Assert.True(res.Data.TotalAvailableRooms > 0);
    }

    [Fact]
    public void TC_F1_02_Search_SpecificRoomType_Deluxe_Success()
    {
        // TC_F1_02: Today + 2 (2026-10-13), Today + 4 (2026-10-15), 4 khách, Deluxe -> S1
        var req = new RoomSearchRequest
        {
            CheckIn = "2026-10-13",
            CheckOut = "2026-10-15",
            Guests = 4,
            RoomType = "Deluxe",
            ReferenceToday = FixedToday
        };

        var res = _searchService.SearchAvailableRooms(req);

        Assert.True(res.Success);
        Assert.Equal(HotelConstants.F1.CodeS1, res.Code);
        Assert.NotNull(res.Data);
        Assert.All(res.Data.Rooms, r => Assert.Equal("Deluxe", r.Type));
    }

    [Fact]
    public void TC_F1_03_Check_MinBoundaryGuests_1Guest_Success()
    {
        // TC_F1_03: Today (2026-10-11), Today + 1 (2026-10-12), 1 khách, Standard -> S1
        var req = new RoomSearchRequest
        {
            CheckIn = "2026-10-11",
            CheckOut = "2026-10-12",
            Guests = 1,
            RoomType = "Standard",
            ReferenceToday = FixedToday
        };

        var res = _searchService.SearchAvailableRooms(req);

        Assert.True(res.Success);
        Assert.Equal(HotelConstants.F1.CodeS1, res.Code);
        Assert.NotNull(res.Data);
        Assert.True(res.Data.TotalAvailableRooms > 0);
    }

    [Fact]
    public void TC_F1_04_Check_MaxBoundaryGuests_10Guests_Success()
    {
        // TC_F1_04: Today + 5 (2026-10-16), Today + 7 (2026-10-18), 10 khách, Tất cả -> S1 (Suite có sức chứa 10)
        var req = new RoomSearchRequest
        {
            CheckIn = "2026-10-16",
            CheckOut = "2026-10-18",
            Guests = 10,
            RoomType = "ALL",
            ReferenceToday = FixedToday
        };

        var res = _searchService.SearchAvailableRooms(req);

        Assert.True(res.Success);
        Assert.Equal(HotelConstants.F1.CodeS1, res.Code);
        Assert.NotNull(res.Data);
        Assert.All(res.Data.Rooms, r => Assert.True(r.Capacity >= 10));
    }

    [Fact]
    public void TC_F1_05_Check_PastCheckInDate_Fails_E1()
    {
        // TC_F1_05: Today - 1 (2026-10-10), Today + 2 (2026-10-13), 2 khách, Tất cả -> E1
        var req = new RoomSearchRequest
        {
            CheckIn = "2026-10-10",
            CheckOut = "2026-10-13",
            Guests = 2,
            RoomType = "ALL",
            ReferenceToday = FixedToday
        };

        var res = _searchService.SearchAvailableRooms(req);

        Assert.False(res.Success);
        Assert.Equal(HotelConstants.F1.CodeE1, res.Code);
        Assert.Equal(HotelConstants.F1.MsgE1, res.Message);
    }

    [Fact]
    public void TC_F1_06_Check_CheckOutSameAsCheckIn_Fails_E2()
    {
        // TC_F1_06: Today + 3 (2026-10-14), Today + 3 (2026-10-14), 2 khách, Superior -> E2
        var req = new RoomSearchRequest
        {
            CheckIn = "2026-10-14",
            CheckOut = "2026-10-14",
            Guests = 2,
            RoomType = "Superior",
            ReferenceToday = FixedToday
        };

        var res = _searchService.SearchAvailableRooms(req);

        Assert.False(res.Success);
        Assert.Equal(HotelConstants.F1.CodeE2, res.Code);
        Assert.Equal(HotelConstants.F1.MsgE2, res.Message);
    }

    [Fact]
    public void TC_F1_07_Check_ZeroGuests_Fails_E3()
    {
        // TC_F1_07: Today + 1 (2026-10-12), Today + 2 (2026-10-13), 0 khách, Tất cả -> E3
        var req = new RoomSearchRequest
        {
            CheckIn = "2026-10-12",
            CheckOut = "2026-10-13",
            Guests = 0,
            RoomType = "ALL",
            ReferenceToday = FixedToday
        };

        var res = _searchService.SearchAvailableRooms(req);

        Assert.False(res.Success);
        Assert.Equal(HotelConstants.F1.CodeE3, res.Code);
        Assert.Equal(HotelConstants.F1.MsgE3, res.Message);
    }

    [Fact]
    public void TC_F1_08_Check_OverMaxGuests_11Guests_Fails_E3()
    {
        // TC_F1_08: Today + 1 (2026-10-12), Today + 2 (2026-10-13), 11 khách, Tất cả -> E3
        var req = new RoomSearchRequest
        {
            CheckIn = "2026-10-12",
            CheckOut = "2026-10-13",
            Guests = 11,
            RoomType = "ALL",
            ReferenceToday = FixedToday
        };

        var res = _searchService.SearchAvailableRooms(req);

        Assert.False(res.Success);
        Assert.Equal(HotelConstants.F1.CodeE3, res.Code);
        Assert.Equal(HotelConstants.F1.MsgE3, res.Message);
    }

    [Fact]
    public void TC_F1_09_Check_ValidSearch_FullyBooked_S2()
    {
        // TC_F1_09: Today + 10 (2026-10-21), Today + 12 (2026-10-23), 2 khách, Suite -> S2 (Hết phòng do HST88888 đã đặt)
        var req = new RoomSearchRequest
        {
            CheckIn = "2026-10-21",
            CheckOut = "2026-10-23",
            Guests = 2,
            RoomType = "Suite",
            ReferenceToday = FixedToday
        };

        var res = _searchService.SearchAvailableRooms(req);

        Assert.True(res.Success);
        Assert.Equal(HotelConstants.F1.CodeS2, res.Code);
        Assert.Equal(HotelConstants.F1.MsgS2, res.Message);
        Assert.NotNull(res.Data);
        Assert.Equal(0, res.Data.TotalAvailableRooms);
    }
}
