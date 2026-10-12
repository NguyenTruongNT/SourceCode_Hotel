using HSTHotel.Api.Core.Constants;
using HSTHotel.Api.Core.WhiteBox;
using Xunit;

namespace HSTHotel.Tests.F3_Tests;

/// <summary>
/// Toàn bộ các ca kiểm thử Hộp Trắng cho chức năng F3 theo bảng tổng hợp mục 3.6.4 (Nguyễn Văn Trường phụ trách):
/// Tổng cộng 37/37 ca kiểm thử theo các độ đo C1 (câu lệnh), C2 (nhánh), C3 (điều kiện con).
/// </summary>
public class F3_WhiteBoxTests
{
    // =========================================================================
    // ĐƠN VỊ 1: validatePNR() - C1, C2, C3
    // =========================================================================

    [Fact]
    public void Unit1_ValidatePNR_Coverage_C1_And_C2()
    {
        // C1/C2 STT 1: pnr = ""; booking = null -> E1 (1,2,3,KT)
        Assert.Equal(HotelConstants.F3.CodeE1, F3WhiteBoxUnits.ValidatePNR("", null));

        // C1/C2 STT 2: pnr = "HST123"; booking = null -> E1 (1,2,4,5,KT)
        Assert.Equal(HotelConstants.F3.CodeE1, F3WhiteBoxUnits.ValidatePNR("HST123", null));

        // C1/C2 STT 3: pnr = "HST99999"; booking = null -> E1 (1,2,4,6,7,KT)
        Assert.Equal(HotelConstants.F3.CodeE1, F3WhiteBoxUnits.ValidatePNR("HST99999", null));

        // C1/C2 STT 4: pnr = "HST10234"; booking.status = Confirmed -> OK (1,2,4,6,8,KT)
        var confirmedBooking = new BookingCheckInMatch("Confirmed", "001202005991", "Deluxe");
        Assert.Equal(HotelConstants.F3.CodeOk, F3WhiteBoxUnits.ValidatePNR("HST10234", confirmedBooking));
    }

    [Fact]
    public void Unit1_ValidatePNR_Coverage_C3()
    {
        // C3 STT 1: 2(T) -> pnr = ""
        Assert.Equal(HotelConstants.F3.CodeE1, F3WhiteBoxUnits.ValidatePNR("", null));

        // C3 STT 2: 2(F), 4(T) -> pnr = "HST123"
        Assert.Equal(HotelConstants.F3.CodeE1, F3WhiteBoxUnits.ValidatePNR("HST123", null));

        // C3 STT 3: 2(F), 4(F), 6.1(T) -> pnr = "HST99999", booking = null
        Assert.Equal(HotelConstants.F3.CodeE1, F3WhiteBoxUnits.ValidatePNR("HST99999", null));

        // C3 STT 4: 2(F), 4(F), 6.1(F), 6.2(T) -> pnr = "HST10234", booking.status = Cancelled
        var cancelledBooking = new BookingCheckInMatch("Cancelled", "001202005991", "Deluxe");
        Assert.Equal(HotelConstants.F3.CodeE1, F3WhiteBoxUnits.ValidatePNR("HST10234", cancelledBooking));

        // C3 STT 5: 2(F), 4(F), 6.1(F), 6.2(F) -> pnr = "HST10234", booking.status = Confirmed
        var confirmedBooking = new BookingCheckInMatch("Confirmed", "001202005991", "Deluxe");
        Assert.Equal(HotelConstants.F3.CodeOk, F3WhiteBoxUnits.ValidatePNR("HST10234", confirmedBooking));
    }

    // =========================================================================
    // ĐƠN VỊ 2: verifyCCCD() - C1, C2, C3
    // =========================================================================

    [Fact]
    public void Unit2_VerifyCCCD_Coverage_C1_And_C2()
    {
        var booking = new BookingCheckInMatch("Confirmed", "001202005991", "Deluxe");

        // C1/C2 STT 1: input = "" -> E2 (1,2,3,KT)
        Assert.Equal(HotelConstants.F3.CodeE2, F3WhiteBoxUnits.VerifyCCCD("", booking));

        // C1/C2 STT 2: input = "001202005992" -> E2 (1,2,4,5,KT)
        Assert.Equal(HotelConstants.F3.CodeE2, F3WhiteBoxUnits.VerifyCCCD("001202005992", booking));

        // C1/C2 STT 3: input = "001202005991" -> OK (1,2,4,6,KT)
        Assert.Equal(HotelConstants.F3.CodeOk, F3WhiteBoxUnits.VerifyCCCD("001202005991", booking));
    }

    [Fact]
    public void Unit2_VerifyCCCD_Coverage_C3()
    {
        var booking = new BookingCheckInMatch("Confirmed", "001202005991", "Deluxe");

        // C3 STT 1: 2.1(T) -> input = ""
        Assert.Equal(HotelConstants.F3.CodeE2, F3WhiteBoxUnits.VerifyCCCD("", booking));

        // C3 STT 2: 2.1(F), 2.2(T) -> input = "00120200599" (11 số)
        Assert.Equal(HotelConstants.F3.CodeE2, F3WhiteBoxUnits.VerifyCCCD("00120200599", booking));

        // C3 STT 3: 2.1(F), 2.2(F), 4(T) -> input = "001202005992" (12 số nhưng khác CCCD)
        Assert.Equal(HotelConstants.F3.CodeE2, F3WhiteBoxUnits.VerifyCCCD("001202005992", booking));

        // C3 STT 4: 2.1(F), 2.2(F), 4(F) -> input = "001202005991" (Trùng khớp)
        Assert.Equal(HotelConstants.F3.CodeOk, F3WhiteBoxUnits.VerifyCCCD("001202005991", booking));
    }

    // =========================================================================
    // ĐƠN VỊ 3: validateRoomAssign() - C1, C2, C3
    // =========================================================================

    [Fact]
    public void Unit3_ValidateRoomAssign_Coverage_C1_And_C2()
    {
        var booking = new BookingCheckInMatch("Confirmed", "001202005991", "Deluxe");

        // C1/C2 STT 1: room = null -> E3 (1,2,3,KT)
        Assert.Equal(HotelConstants.F3.CodeE3, F3WhiteBoxUnits.ValidateRoomAssign(null, booking));

        // C1/C2 STT 2: room = Deluxe, Dirty -> E3 (1,2,4,5,KT)
        var dirtyRoom = new RoomAssignMatch("Deluxe", "Dirty");
        Assert.Equal(HotelConstants.F3.CodeE3, F3WhiteBoxUnits.ValidateRoomAssign(dirtyRoom, booking));

        // C1/C2 STT 3: room = Deluxe, Clean -> OK (1,2,4,6,KT)
        var cleanRoom = new RoomAssignMatch("Deluxe", "Clean");
        Assert.Equal(HotelConstants.F3.CodeOk, F3WhiteBoxUnits.ValidateRoomAssign(cleanRoom, booking));
    }

    [Fact]
    public void Unit3_ValidateRoomAssign_Coverage_C3()
    {
        var booking = new BookingCheckInMatch("Confirmed", "001202005991", "Deluxe");

        // C3 STT 1: 2.1(T) -> room = null
        Assert.Equal(HotelConstants.F3.CodeE3, F3WhiteBoxUnits.ValidateRoomAssign(null, booking));

        // C3 STT 2: 2.1(F), 2.2(T) -> room = Standard, Clean (Sai loại phòng)
        var stdRoom = new RoomAssignMatch("Standard", "Clean");
        Assert.Equal(HotelConstants.F3.CodeE3, F3WhiteBoxUnits.ValidateRoomAssign(stdRoom, booking));

        // C3 STT 3: 2.1(F), 2.2(F), 4(T) -> room = Deluxe, Dirty (Chưa dọn)
        var dirtyRoom = new RoomAssignMatch("Deluxe", "Dirty");
        Assert.Equal(HotelConstants.F3.CodeE3, F3WhiteBoxUnits.ValidateRoomAssign(dirtyRoom, booking));

        // C3 STT 4: 2.1(F), 2.2(F), 4(F) -> room = Deluxe, Clean (Hợp lệ)
        var cleanRoom = new RoomAssignMatch("Deluxe", "Clean");
        Assert.Equal(HotelConstants.F3.CodeOk, F3WhiteBoxUnits.ValidateRoomAssign(cleanRoom, booking));
    }

    // =========================================================================
    // ĐƠN VỊ 4: validateDeposit() - C1, C2, C3, BVA
    // =========================================================================

    [Theory]
    [InlineData("", HotelConstants.F3.CodeE4)]        // C1 STT 1: 1,2,3,KT
    [InlineData("abc", HotelConstants.F3.CodeE4)]     // C1 STT 2: 1,2,4,5,6,KT
    [InlineData("-100000", HotelConstants.F3.CodeE4)] // C1 STT 3: 1,2,4,5,7,8,KT
    [InlineData("500000", HotelConstants.F3.CodeOk)]  // C1 STT 4: 1,2,4,5,7,9,KT
    public void Unit4_ValidateDeposit_Coverage_C1(object amount, string expected)
    {
        var result = F3WhiteBoxUnits.ValidateDeposit(amount);
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("", HotelConstants.F3.CodeE4)]        // C2 STT 1: 1,2(T),3,KT
    [InlineData("abc", HotelConstants.F3.CodeE4)]     // C2 STT 2: 1,2(F),4,5(T),6,KT
    [InlineData("-100000", HotelConstants.F3.CodeE4)] // C2 STT 3: 1,2(F),4,5(F),7(T),8,KT
    [InlineData("500000", HotelConstants.F3.CodeOk)]  // C2 STT 4: 1,2(F),4,5(F),7(F),9,KT
    public void Unit4_ValidateDeposit_Coverage_C2(object amount, string expected)
    {
        var result = F3WhiteBoxUnits.ValidateDeposit(amount);
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("", HotelConstants.F3.CodeE4)]        // C3 STT 1: 2.1(T)
    [InlineData(null, HotelConstants.F3.CodeE4)]      // C3 STT 2: 2.1(F), 2.2(T)
    [InlineData("abc", HotelConstants.F3.CodeE4)]     // C3 STT 3: 2.1(F), 2.2(F), 5(T)
    [InlineData("-100000", HotelConstants.F3.CodeE4)] // C3 STT 4: 2.1(F), 2.2(F), 5(F), 7(T)
    [InlineData("499000", HotelConstants.F3.CodeE4)]  // C3 STT 5: 2.1(F), 2.2(F), 5(F), 7(T)
    [InlineData("500000", HotelConstants.F3.CodeOk)]  // C3 STT 6: 2.1(F), 2.2(F), 5(F), 7(F)
    public void Unit4_ValidateDeposit_Coverage_C3(object? amount, string expected)
    {
        var result = F3WhiteBoxUnits.ValidateDeposit(amount);
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("1000000", HotelConstants.F3.CodeOk)] // BVA: Vượt mức tối thiểu
    [InlineData("499999", HotelConstants.F3.CodeE4)]  // BVA: Dưới 500k 1 đơn vị
    public void Unit4_ValidateDeposit_Boundaries(object amount, string expected)
    {
        var result = F3WhiteBoxUnits.ValidateDeposit(amount);
        Assert.Equal(expected, result);
    }

    // =========================================================================
    // ĐƠN VỊ 5: validateKeycard() - C1, C2, C3, BVA
    // =========================================================================

    [Theory]
    [InlineData("", HotelConstants.F3.CodeBlock)]       // C1 STT 1: 1,2,3,KT
    [InlineData("A1B2C", HotelConstants.F3.CodeBlock)]  // C1 STT 2: 1,2,4,5,KT
    [InlineData("ZZZ999", HotelConstants.F3.CodeBlock)] // C1 STT 3: 1,2,4,6,7,KT
    [InlineData("A1B2C3", HotelConstants.F3.CodeOk)]    // C1 STT 4: 1,2,4,6,8,KT
    public void Unit5_ValidateKeycard_Coverage_C1(string code, string expected)
    {
        var result = F3WhiteBoxUnits.ValidateKeycard(code);
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("", HotelConstants.F3.CodeBlock)]       // C2 STT 1: 1,2(T),3,KT
    [InlineData("A1B2C", HotelConstants.F3.CodeBlock)]  // C2 STT 2: 1,2(F),4(T),5,KT
    [InlineData("ZZZ999", HotelConstants.F3.CodeBlock)] // C2 STT 3: 1,2(F),4(F),6(T),7,KT
    [InlineData("A1B2C3", HotelConstants.F3.CodeOk)]    // C2 STT 4: 1,2(F),4(F),6(F),8,KT
    public void Unit5_ValidateKeycard_Coverage_C2(string code, string expected)
    {
        var result = F3WhiteBoxUnits.ValidateKeycard(code);
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("", HotelConstants.F3.CodeBlock)]            // C3 STT 1: 2(T)
    [InlineData("A1B2C", HotelConstants.F3.CodeBlock)]       // C3 STT 2: 2(F), 4.1(T)
    [InlineData("A1B2C3D4E5F", HotelConstants.F3.CodeBlock)] // C3 STT 3: 2(F), 4.1(F), 4.2(T)
    [InlineData("ZZZ999", HotelConstants.F3.CodeBlock)]      // C3 STT 4: 2(F), 4.1(F), 4.2(F), 6(T)
    [InlineData("A1B2C3", HotelConstants.F3.CodeOk)]         // C3 STT 5: 2(F), 4.1(F), 4.2(F), 6(F)
    public void Unit5_ValidateKeycard_Coverage_C3(string code, string expected)
    {
        var result = F3WhiteBoxUnits.ValidateKeycard(code);
        Assert.Equal(expected, result);
    }

    [Fact]
    public void Unit5_ValidateKeycard_Boundary_10Chars()
    {
        // BVA: Biên 10 ký tự Hexadecimal
        var result = F3WhiteBoxUnits.ValidateKeycard("A1B2C3D4E5");
        Assert.Equal(HotelConstants.F3.CodeOk, result);
    }

    // =========================================================================
    // ĐƠN VỊ 6: earlyCheckinRate() - C1, C2, C3, BVA
    // =========================================================================

    [Theory]
    [InlineData("14:00", true, 0)]    // C1 STT 1: 1,2,3,4,KT
    [InlineData("10:00", true, 0.3)]  // C1 STT 2: 1,2,3,5,6,KT
    [InlineData("07:30", false, 0.5)] // C1 STT 3: 1,2,3,5,7,8,KT
    [InlineData("10:00", false, -1)]  // C1 STT 4: 1,2,3,5,7,9,KT
    public void Unit6_EarlyCheckinRate_Coverage_C1(string time, bool hasCleanRoom, double expected)
    {
        var result = F3WhiteBoxUnits.EarlyCheckinRate(time, hasCleanRoom);
        Assert.Equal(expected, result, precision: 2);
    }

    [Theory]
    [InlineData("14:00", true, 0)]    // C2 STT 1: 3(T)
    [InlineData("10:00", true, 0.3)]  // C2 STT 2: 3(F), 5(T)
    [InlineData("07:30", false, 0.5)] // C2 STT 3: 3(F), 5(F), 7(T)
    [InlineData("10:00", false, -1)]  // C2 STT 4: 3(F), 5(F), 7(F)
    public void Unit6_EarlyCheckinRate_Coverage_C2(string time, bool hasCleanRoom, double expected)
    {
        var result = F3WhiteBoxUnits.EarlyCheckinRate(time, hasCleanRoom);
        Assert.Equal(expected, result, precision: 2);
    }

    [Theory]
    [InlineData("14:00", true, 0)]    // C3 STT 1: 3(T)
    [InlineData("10:00", true, 0.3)]  // C3 STT 2: 3(F), 5.1(T), 5.2(T)
    [InlineData("07:30", false, 0.5)] // C3 STT 3: 3(F), 5.1(F), 7.1(T), 7.2(T)
    [InlineData("10:00", false, -1)]  // C3 STT 4: 3(F), 5.1(T), 5.2(F), 7.1(T), 7.2(F)
    [InlineData("05:00", true, -1)]   // C3 STT 5: 3(F), 5.1(F), 7.1(F)
    public void Unit6_EarlyCheckinRate_Coverage_C3(string time, bool hasCleanRoom, double expected)
    {
        var result = F3WhiteBoxUnits.EarlyCheckinRate(time, hasCleanRoom);
        Assert.Equal(expected, result, precision: 2);
    }

    [Theory]
    [InlineData("09:00", true, 0.3)] // BVA 1: Biên bắt đầu mức 30%
    [InlineData("08:59", true, 0.5)] // BVA 2: Biên trên mức 50%
    [InlineData("06:00", true, 0.5)] // BVA 3: Biên bắt đầu mức 50%
    [InlineData("05:59", true, -1)]  // BVA 4: Biên trước 06:00 (không nhận được)
    [InlineData("13:59", true, 0.3)] // BVA 5: Biên trên mức 30%
    public void Unit6_EarlyCheckinRate_Boundaries(string time, bool hasCleanRoom, double expected)
    {
        var result = F3WhiteBoxUnits.EarlyCheckinRate(time, hasCleanRoom);
        Assert.Equal(expected, result, precision: 2);
    }
}
