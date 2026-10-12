using HSTHotel.Api.Core.Constants;
using HSTHotel.Api.Core.WhiteBox;
using Xunit;

namespace HSTHotel.Tests.F1_Tests;

/// <summary>
/// Toàn bộ các ca kiểm thử Hộp Trắng cho chức năng F1 theo bảng tổng hợp mục 3.2.4:
/// Tổng cộng 28/28 ca kiểm thử theo các độ đo C1 (câu lệnh), C2 (nhánh), C3 (điều kiện con).
/// </summary>
public class F1_WhiteBoxTests
{
    private const string FixedToday = "2026-10-11";

    // =========================================================================
    // ĐƠN VỊ 1: validateCheckIn() - C1, C2, C3
    // =========================================================================

    [Theory]
    [InlineData("", FixedToday, HotelConstants.F1.CodeE1)]           // C1 STT 1: Nút 1,2,3,KT
    [InlineData("2026-10-10", FixedToday, HotelConstants.F1.CodeE1)] // C1 STT 2: Nút 1,2,4,5,KT
    [InlineData("2026-10-11", FixedToday, HotelConstants.F1.CodeOk)] // C1 STT 3: Nút 1,2,4,6,KT
    public void Unit1_ValidateCheckIn_Coverage_C1(string checkIn, string today, string expected)
    {
        var result = F1WhiteBoxUnits.ValidateCheckIn(checkIn, today);
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("", FixedToday, HotelConstants.F1.CodeE1)]           // C2 STT 1: 1,2(T),3,KT
    [InlineData("2026-10-10", FixedToday, HotelConstants.F1.CodeE1)] // C2 STT 2: 1,2(F),4(T),5,KT
    [InlineData("2026-10-11", FixedToday, HotelConstants.F1.CodeOk)] // C2 STT 3: 1,2(F),4(F),6,KT
    public void Unit1_ValidateCheckIn_Coverage_C2(string checkIn, string today, string expected)
    {
        var result = F1WhiteBoxUnits.ValidateCheckIn(checkIn, today);
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("", FixedToday, HotelConstants.F1.CodeE1)]           // C3 STT 1: 2.1(T)
    [InlineData("10/10/2026", FixedToday, HotelConstants.F1.CodeE1)] // C3 STT 2: 2.1(F), 2.2(T)
    [InlineData("2026-10-10", FixedToday, HotelConstants.F1.CodeE1)] // C3 STT 3: 2.1(F), 2.2(F), 4(T)
    [InlineData("2026-10-11", FixedToday, HotelConstants.F1.CodeOk)] // C3 STT 4: 2.1(F), 2.2(F), 4(F)
    public void Unit1_ValidateCheckIn_Coverage_C3(string checkIn, string today, string expected)
    {
        var result = F1WhiteBoxUnits.ValidateCheckIn(checkIn, today);
        Assert.Equal(expected, result);
    }

    // =========================================================================
    // ĐƠN VỊ 2: validateCheckOut() - C1, C2, C3, BVA
    // =========================================================================

    [Theory]
    [InlineData("2026-10-14", "", HotelConstants.F1.CodeE2)]           // C1 STT 1: 1,2,3,KT
    [InlineData("2026-10-14", "2026-10-14", HotelConstants.F1.CodeE2)] // C1 STT 2: 1,2,4,5,KT
    [InlineData("2026-10-14", "2026-10-15", HotelConstants.F1.CodeOk)] // C1 STT 3: 1,2,4,6,KT
    public void Unit2_ValidateCheckOut_Coverage_C1(string checkIn, string checkOut, string expected)
    {
        var result = F1WhiteBoxUnits.ValidateCheckOut(checkIn, checkOut);
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("2026-10-14", "", HotelConstants.F1.CodeE2)]           // C2 STT 1: 1,2(T),3,KT
    [InlineData("2026-10-14", "2026-10-14", HotelConstants.F1.CodeE2)] // C2 STT 2: 1,2(F),4(T),5,KT
    [InlineData("2026-10-14", "2026-10-15", HotelConstants.F1.CodeOk)] // C2 STT 3: 1,2(F),4(F),6,KT
    public void Unit2_ValidateCheckOut_Coverage_C2(string checkIn, string checkOut, string expected)
    {
        var result = F1WhiteBoxUnits.ValidateCheckOut(checkIn, checkOut);
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("2026-10-14", "", HotelConstants.F1.CodeE2)]           // C3 STT 1: 2.1(T)
    [InlineData("2026-10-14", "15/10/2026", HotelConstants.F1.CodeE2)] // C3 STT 2: 2.1(F), 2.2(T)
    [InlineData("2026-10-14", "2026-10-14", HotelConstants.F1.CodeE2)] // C3 STT 3: 2.1(F), 2.2(F), 4(T)
    [InlineData("2026-10-14", "2026-10-15", HotelConstants.F1.CodeOk)] // C3 STT 4: 2.1(F), 2.2(F), 4(F)
    public void Unit2_ValidateCheckOut_Coverage_C3(string checkIn, string checkOut, string expected)
    {
        var result = F1WhiteBoxUnits.ValidateCheckOut(checkIn, checkOut);
        Assert.Equal(expected, result);
    }

    [Fact]
    public void Unit2_ValidateCheckOut_Boundary()
    {
        // BVA: checkIn + 2 ngày
        var result = F1WhiteBoxUnits.ValidateCheckOut("2026-10-14", "2026-10-16");
        Assert.Equal(HotelConstants.F1.CodeOk, result);
    }

    // =========================================================================
    // ĐƠN VỊ 3: validateGuests() - C1, C2, C3, BVA
    // =========================================================================

    [Theory]
    [InlineData("", HotelConstants.F1.CodeE3)]    // C1 STT 1: 1,2,3,KT
    [InlineData("abc", HotelConstants.F1.CodeE3)] // C1 STT 2: 1,2,4,5,6,KT
    [InlineData("0", HotelConstants.F1.CodeE3)]   // C1 STT 3: 1,2,4,5,7,8,KT
    [InlineData("2", HotelConstants.F1.CodeOk)]   // C1 STT 4: 1,2,4,5,7,9,KT
    public void Unit3_ValidateGuests_Coverage_C1(object guests, string expected)
    {
        var result = F1WhiteBoxUnits.ValidateGuests(guests);
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("", HotelConstants.F1.CodeE3)]    // C2 STT 1: 1,2(T),3,KT
    [InlineData("abc", HotelConstants.F1.CodeE3)] // C2 STT 2: 1,2(F),4,5(T),6,KT
    [InlineData("0", HotelConstants.F1.CodeE3)]   // C2 STT 3: 1,2(F),4,5(F),7(T),8,KT
    [InlineData("2", HotelConstants.F1.CodeOk)]   // C2 STT 4: 1,2(F),4,5(F),7(F),9,KT
    public void Unit3_ValidateGuests_Coverage_C2(object guests, string expected)
    {
        var result = F1WhiteBoxUnits.ValidateGuests(guests);
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("", HotelConstants.F1.CodeE3)]    // C3 STT 1: 2.1(T)
    [InlineData(null, HotelConstants.F1.CodeE3)]  // C3 STT 2: 2.1(F), 2.2(T)
    [InlineData("abc", HotelConstants.F1.CodeE3)] // C3 STT 3: 2.1(F), 2.2(F), 5(T)
    [InlineData("5.5", HotelConstants.F1.CodeE3)] // C3 STT 4: 2.1(F), 2.2(F), 5(T)
    [InlineData("0", HotelConstants.F1.CodeE3)]   // C3 STT 5: 2.1(F), 2.2(F), 5(F), 7.1(T)
    [InlineData("11", HotelConstants.F1.CodeE3)]  // C3 STT 6: 2.1(F), 2.2(F), 5(F), 7.1(F), 7.2(T)
    [InlineData("2", HotelConstants.F1.CodeOk)]   // C3 STT 7: 2.1(F), 2.2(F), 5(F), 7.1(F), 7.2(F)
    public void Unit3_ValidateGuests_Coverage_C3(object? guests, string expected)
    {
        var result = F1WhiteBoxUnits.ValidateGuests(guests);
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("1", HotelConstants.F1.CodeOk)]  // BVA: Biên dưới 1
    [InlineData("10", HotelConstants.F1.CodeOk)] // BVA: Biên trên 10
    public void Unit3_ValidateGuests_Boundaries(object guests, string expected)
    {
        var result = F1WhiteBoxUnits.ValidateGuests(guests);
        Assert.Equal(expected, result);
    }

    // =========================================================================
    // ĐƠN VỊ 4: isOverlap() - C1, C2, C3
    // =========================================================================

    [Fact]
    public void Unit4_IsOverlap_Coverage_C1_And_C2()
    {
        var want = new RoomPeriod("2026-10-13", "2026-10-15");

        // C1/C2 STT 1: b = Cancelled [14/10, 16/10] -> false
        var b1 = new BookingOverlapCheck("Cancelled", "2026-10-14", "2026-10-16");
        Assert.False(F1WhiteBoxUnits.IsOverlap(want, b1));

        // C1/C2 STT 2: b = Confirmed [14/10, 16/10] -> true (Trùng lịch)
        var b2 = new BookingOverlapCheck("Confirmed", "2026-10-14", "2026-10-16");
        Assert.True(F1WhiteBoxUnits.IsOverlap(want, b2));

        // C1/C2 STT 3: b = In-house [15/10, 17/10] -> false (Không trùng)
        var b3 = new BookingOverlapCheck("In-house", "2026-10-15", "2026-10-17");
        Assert.False(F1WhiteBoxUnits.IsOverlap(want, b3));
    }

    [Fact]
    public void Unit4_IsOverlap_Coverage_C3()
    {
        var want = new RoomPeriod("2026-10-13", "2026-10-15");

        // C3 STT 1: 2.1(T), 2.2(T) -> Cancelled
        Assert.False(F1WhiteBoxUnits.IsOverlap(want, new BookingOverlapCheck("Cancelled", "2026-10-14", "2026-10-16")));

        // C3 STT 2: 2.1(F), 4.1(T), 4.2(T) -> Confirmed trùng lịch
        Assert.True(F1WhiteBoxUnits.IsOverlap(want, new BookingOverlapCheck("Confirmed", "2026-10-14", "2026-10-16")));

        // C3 STT 3: 2.1(T), 2.2(F), 4.1(T), 4.2(F) -> In-house bắt đầu từ 15/10
        Assert.False(F1WhiteBoxUnits.IsOverlap(want, new BookingOverlapCheck("In-house", "2026-10-15", "2026-10-17")));

        // C3 STT 4: 2.1(F), 4.1(F) -> Confirmed kết thúc trước ngày nhận [09/10, 12/10]
        Assert.False(F1WhiteBoxUnits.IsOverlap(want, new BookingOverlapCheck("Confirmed", "2026-10-09", "2026-10-12")));
    }

    // =========================================================================
    // ĐƠN VỊ 5: matchRoom() - C1, C2, C3
    // =========================================================================

    [Fact]
    public void Unit5_MatchRoom_Coverage_C1_And_C2()
    {
        // C1/C2 STT 1: Inactive, sức chứa 4, STD; req = 2 khách, ALL -> false
        Assert.False(F1WhiteBoxUnits.MatchRoom(
            new RoomSearchMatch("Inactive", 4, "Standard"),
            new SearchCriteriaMatch(2, "ALL")));

        // C1/C2 STT 2: Active, sức chứa 2, STD; req = 4 khách, ALL -> false
        Assert.False(F1WhiteBoxUnits.MatchRoom(
            new RoomSearchMatch("Active", 2, "Standard"),
            new SearchCriteriaMatch(4, "ALL")));

        // C1/C2 STT 3: Active, sức chứa 4, STD; req = 2 khách, DLX -> false
        Assert.False(F1WhiteBoxUnits.MatchRoom(
            new RoomSearchMatch("Active", 4, "Standard"),
            new SearchCriteriaMatch(2, "Deluxe")));

        // C1/C2 STT 4: Active, sức chứa 4, STD; req = 2 khách, ALL -> true
        Assert.True(F1WhiteBoxUnits.MatchRoom(
            new RoomSearchMatch("Active", 4, "Standard"),
            new SearchCriteriaMatch(2, "ALL")));
    }

    [Fact]
    public void Unit5_MatchRoom_Coverage_C3()
    {
        // C3 STT 1: 2(T) -> Inactive
        Assert.False(F1WhiteBoxUnits.MatchRoom(
            new RoomSearchMatch("Inactive", 4, "Standard"),
            new SearchCriteriaMatch(2, "ALL")));

        // C3 STT 2: 2(F), 4(T) -> Sức chứa < req
        Assert.False(F1WhiteBoxUnits.MatchRoom(
            new RoomSearchMatch("Active", 2, "Standard"),
            new SearchCriteriaMatch(4, "ALL")));

        // C3 STT 3: 2(F), 4(F), 6.1(T), 6.2(T) -> Sai hạng phòng
        Assert.False(F1WhiteBoxUnits.MatchRoom(
            new RoomSearchMatch("Active", 4, "Standard"),
            new SearchCriteriaMatch(2, "Deluxe")));

        // C3 STT 4: 2(F), 4(F), 6.1(F) -> Chọn ALL
        Assert.True(F1WhiteBoxUnits.MatchRoom(
            new RoomSearchMatch("Active", 4, "Standard"),
            new SearchCriteriaMatch(2, "ALL")));

        // C3 STT 5: 2(F), 4(F), 6.1(T), 6.2(F) -> Đúng loại Deluxe
        Assert.True(F1WhiteBoxUnits.MatchRoom(
            new RoomSearchMatch("Active", 4, "Deluxe"),
            new SearchCriteriaMatch(2, "Deluxe")));
    }
}
