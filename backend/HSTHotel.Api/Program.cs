using System.Text.Json.Serialization;
using HSTHotel.Api.Data;
using HSTHotel.Api.Services.Implementations;
using HSTHotel.Api.Services.Interfaces;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// ==========================================
// 1. CẤU HÌNH DỊCH VỤ & DEPENDENCY INJECTION
// ==========================================
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// Repository (Kho dữ liệu bộ nhớ dùng chung, an toàn đa luồng)
builder.Services.AddSingleton<IHotelRepository, InMemoryHotelRepository>();

// Nghiệp vụ 3 chức năng chính (F1, F3, F4)
builder.Services.AddScoped<IRoomSearchService, RoomSearchService>();
builder.Services.AddScoped<ICheckInService, CheckInService>();
builder.Services.AddScoped<ICheckOutService, CheckOutService>();

// CORS: Cho phép Frontend Next.js kết nối
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://127.0.0.1:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Cấu hình tài liệu Swagger OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "HST Hotel Web API - Nhóm 10 (65KTPM)",
        Version = "v1",
        Description = "Backend API phục vụ Kiểm thử Hộp đen & Hộp trắng.\n" +
                      "- Sinh viên phụ trách: Nguyễn Văn Trường (MSV: 2351170625)\n" +
                      "- Chức năng hoàn thành:\n" +
                      "  + F1: Tra cứu & Tìm kiếm phòng trống trực tuyến nâng cao\n" +
                      "  + F3: Xử lý Nhận phòng tại quầy (Check-in)\n" +
                      "  + F4: Xử lý Trả phòng & Quyết toán hóa đơn (Check-out)\n" +
                      "- Tuân thủ chặt chẽ theo đặc tả và các hàm kiểm thử hộp trắng trong đồ án."
    });
});

var app = builder.Build();

// ==========================================
// 2. CẤU HÌNH HTTP REQUEST PIPELINE
// ==========================================
if (app.Environment.IsDevelopment() || true) // Luôn bật Swagger để sinh viên và giảng viên dễ chấm bài
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "HST Hotel API v1");
        c.RoutePrefix = string.Empty; // Mở Swagger ngay tại URL gốc http://localhost:<port>/
    });
}

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
