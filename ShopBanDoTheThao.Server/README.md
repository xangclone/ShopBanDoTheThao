# Shop Bán Đồ Thể Thao - Backend API

## Cấu hình

### Connection String
Cập nhật connection string trong `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=ShopBanDoTheThaoDb;Trusted_Connection=True;MultipleActiveResultSets=true"
  }
}
```

### JWT Settings
Cấu hình JWT trong `appsettings.json`:
```json
{
  "JwtSettings": {
    "SecretKey": "YourSuperSecretKeyForJWTTokenGeneration123456789",
    "Issuer": "ShopBanDoTheThao",
    "Audience": "ShopBanDoTheThaoUsers",
    "ExpirationInMinutes": 1440
  }
}
```

## Database Migration

```bash
# Tạo migration
dotnet ef migrations add InitialCreate

# Cập nhật database
dotnet ef database update
```

## Chạy ứng dụng

```bash
dotnet run
```

API sẽ chạy tại: `https://localhost:7000`

Swagger UI: `https://localhost:7000/swagger`

## Models

Tất cả models sử dụng tên tiếng Việt:
- `NguoiDung` - Người dùng
- `SanPham` - Sản phẩm
- `DonHang` - Đơn hàng
- `GioHangItem` - Giỏ hàng
- `DanhMuc` - Danh mục
- `ThuongHieu` - Thương hiệu
- `DiaChi` - Địa chỉ
- `PhuongThucThanhToan` - Phương thức thanh toán
- `DanhGiaSanPham` - Đánh giá sản phẩm
- `YeuThichItem` - Yêu thích
- `MaGiamGia` - Mã giảm giá
- `TinTuc` - Tin tức




