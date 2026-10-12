using System.Globalization;
using System.Text.Json;

namespace HSTHotel.Api.Core.Utilities;

public static class JsonConversionHelper
{
    public static int ToInt(object? val, int defaultValue = 0)
    {
        if (val == null) return defaultValue;
        if (val is int i) return i;
        if (val is long l) return (int)l;
        if (val is double d) return (int)d;
        if (val is decimal m) return (int)m;

        if (val is JsonElement el)
        {
            if (el.ValueKind == JsonValueKind.Number && el.TryGetInt32(out int n)) return n;
            if (el.ValueKind == JsonValueKind.String && int.TryParse(el.GetString(), out int sn)) return sn;
            return defaultValue;
        }

        return int.TryParse(val.ToString(), NumberStyles.Integer, CultureInfo.InvariantCulture, out int parsed)
            ? parsed
            : defaultValue;
    }

    public static decimal ToDecimal(object? val, decimal defaultValue = 0m)
    {
        if (val == null) return defaultValue;
        if (val is decimal m) return m;
        if (val is int i) return i;
        if (val is long l) return l;
        if (val is double d) return (decimal)d;

        if (val is JsonElement el)
        {
            if (el.ValueKind == JsonValueKind.Number && el.TryGetDecimal(out decimal n)) return n;
            if (el.ValueKind == JsonValueKind.String && decimal.TryParse(el.GetString(), NumberStyles.Number | NumberStyles.AllowDecimalPoint, CultureInfo.InvariantCulture, out decimal sn)) return sn;
            return defaultValue;
        }

        return decimal.TryParse(val.ToString(), NumberStyles.Number | NumberStyles.AllowDecimalPoint, CultureInfo.InvariantCulture, out decimal parsed)
            ? parsed
            : defaultValue;
    }

    public static string ToRawString(object? val)
    {
        if (val == null) return string.Empty;
        if (val is JsonElement el)
        {
            return el.ValueKind switch
            {
                JsonValueKind.String => el.GetString() ?? string.Empty,
                JsonValueKind.Number => el.GetRawText(),
                JsonValueKind.Null => string.Empty,
                _ => el.ToString()
            };
        }
        return val.ToString() ?? string.Empty;
    }
}
