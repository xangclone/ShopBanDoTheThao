# Shop Bán Đồ Thể Thao

Hệ thống e-commerce bán đồ thể thao được xây dựng với ASP.NET Core Web API và React.

## Tính năng

### Dành cho khách hàng
- ✅ Đăng ký / Đăng nhập (Email, Số điện thoại)
- ✅ Quản lý thông tin cá nhân
- ✅ Quản lý địa chỉ giao hàng
- ✅ Quản lý phương thức thanh toán
- ✅ Duyệt và tìm kiếm sản phẩm
- ✅ Bộ lọc sản phẩm (giá, thương hiệu, size, màu)
- ✅ Xem chi tiết sản phẩm
- ✅ Giỏ hàng (thêm, xóa, cập nhật)
- ✅ Đặt hàng và theo dõi đơn hàng
- ✅ Đánh giá sản phẩm
- ✅ Yêu thích sản phẩm (Wishlist)

### Dành cho quản trị viên
- ✅ Quản lý sản phẩm (CRUD)
- ✅ Quản lý đơn hàng
- ✅ Quản lý khách hàng
- ✅ Quản lý mã giảm giá
- ✅ Báo cáo và thống kê

## Công nghệ sử dụng

### Backend
- ASP.NET Core 8.0
- Entity Framework Core
- SQL Server
- JWT Authentication
- Swagger/OpenAPI

### Frontend
- React 19
- React Router DOM
- Axios
- Tailwind CSS
- React Toastify

## Cài đặt và chạy dự án

### Yêu cầu
- .NET 8.0 SDK
- Node.js 18+ và npm
- SQL Server (LocalDB hoặc SQL Server Express)

### Backend

1. Mở terminal trong thư mục `ShopBanDoTheThao.Server`

2. Cập nhật connection string trong `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=ShopBanDoTheThaoDb;Trusted_Connection=True;MultipleActiveResultSets=true"
  }
}
```

3. Tạo database và migration:
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

4. Chạy ứng dụng:
```bash
dotnet run
```

API sẽ chạy tại: `https://localhost:7000` (hoặc port được cấu hình)

### Frontend

1. Mở terminal trong thư mục `shopbandothethao.client`

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env` (nếu cần):
```
VITE_API_URL=https://localhost:7000/api
```

4. Chạy ứng dụng:
```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:61620` (hoặc port được cấu hình)

## Cấu trúc dự án

### Backend
```
ShopBanDoTheThao.Server/
├── Controllers/          # API Controllers
├── Data/                # DbContext
├── DTOs/                # Data Transfer Objects
├── Models/              # Entity Models (tiếng Việt)
│   ├── NguoiDung.cs
│   ├── SanPham.cs
│   ├── DonHang.cs
│   └── ...
├── Services/            # Business Logic Services
└── Program.cs           # Application entry point
```

### Frontend
```
shopbandothethao.client/
├── src/
│   ├── components/      # React Components
│   │   └── Layout/      # Header, Footer
│   ├── pages/           # Page Components
│   ├── services/        # API Services
│   ├── App.jsx          # Main App Component
│   └── main.jsx         # Entry point
```

## API Endpoints

### Authentication
- `POST /api/auth/dangky` - Đăng ký
- `POST /api/auth/dangnhap` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user hiện tại

### Sản phẩm
- `GET /api/sanpham` - Lấy danh sách sản phẩm
- `GET /api/sanpham/{id}` - Lấy chi tiết sản phẩm
- `GET /api/sanpham/noibat` - Sản phẩm nổi bật
- `GET /api/sanpham/khuyenmai` - Sản phẩm khuyến mãi

### Giỏ hàng (Yêu cầu authentication)
- `GET /api/giohang` - Lấy giỏ hàng
- `POST /api/giohang` - Thêm vào giỏ hàng
- `PUT /api/giohang/{id}` - Cập nhật giỏ hàng
- `DELETE /api/giohang/{id}` - Xóa khỏi giỏ hàng

### Đơn hàng (Yêu cầu authentication)
- `GET /api/donhang` - Lấy danh sách đơn hàng
- `GET /api/donhang/{id}` - Lấy chi tiết đơn hàng
- `POST /api/donhang` - Tạo đơn hàng
- `PUT /api/donhang/{id}/huy` - Hủy đơn hàng

### Danh mục
- `GET /api/danhmuc` - Lấy danh sách danh mục
- `GET /api/danhmuc/{id}` - Lấy chi tiết danh mục

## Swagger Documentation

Khi chạy backend, truy cập Swagger UI tại:
- Development: `https://localhost:7000/swagger`

## Tài khoản mặc định

Sau khi tạo database, bạn cần đăng ký tài khoản mới hoặc tạo tài khoản admin thủ công trong database.

## Lưu ý

1. Đảm bảo SQL Server đang chạy trước khi chạy backend
2. CORS đã được cấu hình cho React app
3. JWT token được lưu trong localStorage
4. Tất cả tên file và class trong Models đều sử dụng tiếng Việt không dấu

## Phát triển tiếp theo

- [ ] Tích hợp thanh toán (Momo, ZaloPay, VNPay)
- [ ] Tích hợp đăng nhập Google/Facebook
- [ ] Chatbot AI tư vấn
- [ ] Hệ thống đánh giá và review
- [ ] Quản lý kho hàng
- [ ] Báo cáo và thống kê
- [ ] Push notifications
- [ ] PWA support
- [ ] Multi-language support

## License

MIT



