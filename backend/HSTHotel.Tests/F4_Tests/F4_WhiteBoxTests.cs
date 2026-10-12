using HSTHotel.Api.Core.Constants;
using HSTHotel.Api.Core.WhiteBox;
using Xunit;

namespace HSTHotel.Tests.F4_Tests;

/// <summary>
/// Toàn bộ các ca kiểm thử Hộp Trắng cho chức năng F4 theo bảng tổng hợp mục 3.8.4 (Nguyễn Văn Trường phụ trách):
/// Tổng cộng 30/30 ca kiểm thử theo các độ đo C1 (câu lệnh), C2 (nhánh), C3 (điều kiện con).
/// </summary>
public class F4_WhiteBoxTests
{
    // =========================================================================
    // ĐƠN VỊ 1: validateCheckoutRoom() - C1, C2, C3
    // =========================================================================

    [Fact]
    public void Unit1_ValidateCheckoutRoom_Coverage_C1_And_C2()
    {
        // C1/C2 STT 1: roomNo = "", room = null -> E1 (1,2,3,KT)
        Assert.Equal(HotelConstants.F4.CodeE1, F4WhiteBoxUnits.ValidateCheckoutRoom("", null));

        // C1/C2 STT 2: roomNo = "101", room.status = Available -> E1 (1,2,4,5,KT)
        var availableRoom = new RoomCheckoutMatch("Available");
        Assert.Equal(HotelConstants.F4.CodeE1, F4WhiteBoxUnits.ValidateCheckoutRoom("101", availableRoom));

        // C1/C2 STT 3: roomNo = "302", room.status = Occupied -> OK (1,2,4,6,KT)
        var occupiedRoom = new RoomCheckoutMatch("Occupied");
        Assert.Equal(HotelConstants.F4.CodeOk, F4WhiteBoxUnits.ValidateCheckoutRoom("302", occupiedRoom));
    }

    [Fact]
    public void Unit1_ValidateCheckoutRoom_Coverage_C3()
    {
        // C3 STT 1: 2.1(T) -> roomNo = "", room = null
        Assert.Equal(HotelConstants.F4.CodeE1, F4WhiteBoxUnits.ValidateCheckoutRoom("", null));

        // C3 STT 2: 2.1(F), 2.2(T) -> roomNo = "999", room = null
        Assert.Equal(HotelConstants.F4.CodeE1, F4WhiteBoxUnits.ValidateCheckoutRoom("999", null));

        // C3 STT 3: 2.1(F), 2.2(F), 4(T) -> roomNo = "101", room.status = Available
        var availableRoom = new RoomCheckoutMatch("Available");
        Assert.Equal(HotelConstants.F4.CodeE1, F4WhiteBoxUnits.ValidateCheckoutRoom("101", availableRoom));

        // C3 STT 4: 2.1(F), 2.2(F), 4(F) -> roomNo = "302", room.status = Occupied
        var occupiedRoom = new RoomCheckoutMatch("Occupied");
        Assert.Equal(HotelConstants.F4.CodeOk, F4WhiteBoxUnits.ValidateCheckoutRoom("302", occupiedRoom));
    }

    // =========================================================================
    // ĐƠN VỊ 2: validateMinibar() - C1, C2, C3, BVA
    // =========================================================================

    [Theory]
    [InlineData("", HotelConstants.F4.CodeE2)]    // C1 STT 1: 1,2,3,KT
    [InlineData("abc", HotelConstants.F4.CodeE2)] // C1 STT 2: 1,2,4,5,6,KT
    [InlineData("-2", HotelConstants.F4.CodeE2)]  // C1 STT 3: 1,2,4,5,7,8,KT
    [InlineData("3", HotelConstants.F4.CodeOk)]   // C1 STT 4: 1,2,4,5,7,9,KT
    public void Unit2_ValidateMinibar_Coverage_C1(object qty, string expected)
    {
        var result = F4WhiteBoxUnits.ValidateMinibar(qty);
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("", HotelConstants.F4.CodeE2)]    // C2 STT 1: 1,2(T),3,KT
    [InlineData("abc", HotelConstants.F4.CodeE2)] // C2 STT 2: 1,2(F),4,5(T),6,KT
    [InlineData("-2", HotelConstants.F4.CodeE2)]  // C2 STT 3: 1,2(F),4,5(F),7(T),8,KT
    [InlineData("3", HotelConstants.F4.CodeOk)]   // C2 STT 4: 1,2(F),4,5(F),7(F),9,KT
    public void Unit2_ValidateMinibar_Coverage_C2(object qty, string expected)
    {
        var result = F4WhiteBoxUnits.ValidateMinibar(qty);
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("", HotelConstants.F4.CodeE2)]    // C3 STT 1: 2.1(T)
    [InlineData(null, HotelConstants.F4.CodeE2)]  // C3 STT 2: 2.1(F), 2.2(T)
    [InlineData("abc", HotelConstants.F4.CodeE2)] // C3 STT 3: 2.1(F), 2.2(F), 5(T)
    [InlineData("1.5", HotelConstants.F4.CodeE2)] // C3 STT 4: 2.1(F), 2.2(F), 5(T) (Số thập phân)
    [InlineData("-2", HotelConstants.F4.CodeE2)]  // C3 STT 5: 2.1(F), 2.2(F), 5(F), 7.1(T)
    [InlineData("51", HotelConstants.F4.CodeE2)]  // C3 STT 6: 2.1(F), 2.2(F), 5(F), 7.1(F), 7.2(T)
    [InlineData("3", HotelConstants.F4.CodeOk)]   // C3 STT 7: 2.1(F), 2.2(F), 5(F), 7.1(F), 7.2(F)
    public void Unit2_ValidateMinibar_Coverage_C3(object? qty, string expected)
    {
        var result = F4WhiteBoxUnits.ValidateMinibar(qty);
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("0", HotelConstants.F4.CodeOk)]  // BVA: Biên dưới 0
    [InlineData("50", HotelConstants.F4.CodeOk)] // BVA: Biên trên 50
    public void Unit2_ValidateMinibar_Boundaries(object qty, string expected)
    {
        var result = F4WhiteBoxUnits.ValidateMinibar(qty);
        Assert.Equal(expected, result);
    }

    // =========================================================================
    // ĐƠN VỊ 3: validateDamageFee() - C1, C2, C3, BVA
    // =========================================================================

    [Theory]
    [InlineData("", HotelConstants.F4.CodeOk)]       // C1 STT 1: 1,2,3,KT (Mặc định 0đ)
    [InlineData("abc", HotelConstants.F4.CodeE3)]    // C1 STT 2: 1,2,4,5,6,KT
    [InlineData("150000", HotelConstants.F4.CodeOk)] // C1 STT 3: 1,2,4,5,7,KT
    public void Unit3_ValidateDamageFee_Coverage_C1(object fee, string expected)
    {
        var result = F4WhiteBoxUnits.ValidateDamageFee(fee);
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("", HotelConstants.F4.CodeOk)]       // C2 STT 1: 1,2(T),3,KT
    [InlineData("abc", HotelConstants.F4.CodeE3)]    // C2 STT 2: 1,2(F),4,5(T),6,KT
    [InlineData("150000", HotelConstants.F4.CodeOk)] // C2 STT 3: 1,2(F),4,5(F),7,KT
    public void Unit3_ValidateDamageFee_Coverage_C2(object fee, string expected)
    {
        var result = F4WhiteBoxUnits.ValidateDamageFee(fee);
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("", HotelConstants.F4.CodeOk)]        // C3 STT 1: 2.1(T)
    [InlineData(null, HotelConstants.F4.CodeOk)]      // C3 STT 2: 2.1(F), 2.2(T)
    [InlineData("abc", HotelConstants.F4.CodeE3)]     // C3 STT 3: 2.1(F), 2.2(F), 4, 5.1(T)
    [InlineData("-50000", HotelConstants.F4.CodeE3)]  // C3 STT 4: 2.1(F), 2.2(F), 4, 5.1(F), 5.2(T)
    [InlineData("150000", HotelConstants.F4.CodeOk)]  // C3 STT 5: 2.1(F), 2.2(F), 4, 5.1(F), 5.2(F)
    public void Unit3_ValidateDamageFee_Coverage_C3(object? fee, string expected)
    {
        var result = F4WhiteBoxUnits.ValidateDamageFee(fee);
        Assert.Equal(expected, result);
    }

    [Fact]
    public void Unit3_ValidateDamageFee_Boundary_Zero()
    {
        // BVA: Phí = 0 VNĐ
        var result = F4WhiteBoxUnits.ValidateDamageFee("0");
        Assert.Equal(HotelConstants.F4.CodeOk, result);
    }

    // =========================================================================
    // ĐƠN VỊ 4: calcLateFeeRate() - C1, C2, BVA
    // =========================================================================

    [Theory]
    [InlineData("11:45", 0)]   // C1 STT 1: 1,2,3,4,KT
    [InlineData("12:01", 0.3)] // C1 STT 2: 1,2,3,5,6,KT
    [InlineData("15:01", 0.5)] // C1 STT 3: 1,2,3,5,7,8,KT
    [InlineData("18:05", 1.0)] // C1 STT 4: 1,2,3,5,7,9,KT
    public void Unit4_CalcLateFeeRate_Coverage_C1_And_C2(string time, double expected)
    {
        var result = F4WhiteBoxUnits.CalcLateFeeRate(time);
        Assert.Equal(expected, result, precision: 2);
    }

    [Theory]
    [InlineData("12:00", 0)]   // BVA 1: Đúng hạn 12:00
    [InlineData("15:00", 0.3)] // BVA 2: Biên trên mức 30% (15:00)
    [InlineData("18:00", 0.5)] // BVA 3: Biên trên mức 50% (18:00)
    [InlineData("18:01", 1.0)] // BVA 4: Biên bắt đầu mức 100% (18:01)
    public void Unit4_CalcLateFeeRate_Boundaries(string time, double expected)
    {
        var result = F4WhiteBoxUnits.CalcLateFeeRate(time);
        Assert.Equal(expected, result, precision: 2);
    }

    // =========================================================================
    // ĐƠN VỊ 5: calcSettlement() - C1, C2
    // =========================================================================

    [Fact]
    public void Unit5_CalcSettlement_Coverage_C1_And_C2()
    {
        // C1/C2 STT 1: total = 600k + 0 + 0 + 0 - 500k = 100k > 0 -> COLLECT
        Assert.Equal(HotelConstants.F4.SettleCollect, F4WhiteBoxUnits.CalcSettlement(600000m, 0m, 0m, 0m));

        // C1/C2 STT 2: total = 0 + 0 + 90k + 200k - 500k = -210k < 0 -> REFUND
        Assert.Equal(HotelConstants.F4.SettleRefund, F4WhiteBoxUnits.CalcSettlement(0m, 0m, 90000m, 200000m));

        // C1/C2 STT 3: total = 500k + 0 + 0 + 0 - 500k = 0 -> EVEN
        Assert.Equal(HotelConstants.F4.SettleEven, F4WhiteBoxUnits.CalcSettlement(500000m, 0m, 0m, 0m));
    }
}
