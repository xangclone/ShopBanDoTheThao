# 🏃 Shop Bán Đồ Thể Thao

Hệ thống e-commerce bán đồ thể thao được xây dựng với **ASP.NET Core Web API** và **React 19**, cung cấp đầy đủ tính năng cho cả khách hàng và quản trị viên.

![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![SQL Server](https://img.shields.io/badge/SQL%20Server-CC2927?logo=microsoft-sql-server)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)

---

## 📋 Mục lục

- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cài đặt và chạy dự án](#-cài-đặt-và-chạy-dự-án)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [API Endpoints](#-api-endpoints)
- [Cấu hình](#-cấu-hình)
- [Tài khoản mặc định](#-tài-khoản-mặc-định)
- [Lưu ý quan trọng](#-lưu-ý-quan-trọng)

---

## ✨ Tính năng

### 👤 Dành cho khách hàng

#### 🔐 Xác thực và tài khoản
- ✅ Đăng ký / Đăng nhập (Email, Số điện thoại)
- ✅ Quản lý thông tin cá nhân
- ✅ Quản lý địa chỉ giao hàng (nhiều địa chỉ)
- ✅ Quản lý phương thức thanh toán

#### 🛍️ Mua sắm
- ✅ Duyệt và tìm kiếm sản phẩm
- ✅ Bộ lọc sản phẩm nâng cao (giá, thương hiệu, danh mục, kích thước, màu sắc)
- ✅ Xem chi tiết sản phẩm với gallery ảnh
- ✅ Xem nhanh sản phẩm (Quick View)
- ✅ Sản phẩm biến thể (kích thước, màu sắc)
- ✅ Hiển thị màu sắc theo biến thể
- ✅ Gallery ảnh biến thể với modal xem ảnh fullscreen
- ✅ Giỏ hàng (thêm, xóa, cập nhật số lượng)
- ✅ Đặt hàng và theo dõi đơn hàng
- ✅ Hủy đơn hàng
- ✅ Yêu thích sản phẩm (Wishlist)

#### ⭐ Đánh giá và tương tác
- ✅ Đánh giá sản phẩm (1-5 sao)
- ✅ Xem đánh giá của người dùng khác
- ✅ Hiển thị điểm đánh giá trung bình và số lượng đánh giá

#### 🔔 Thông báo
- ✅ Hệ thống thông báo real-time
- ✅ Thông báo đơn hàng (trạng thái thay đổi)
- ✅ Thông báo khuyến mãi (hot deals)
- ✅ Đếm số thông báo chưa đọc
- ✅ Đánh dấu đã đọc / Xóa thông báo

#### 📰 Nội dung
- ✅ Xem tin tức / Blog
- ✅ Chi tiết tin tức
- ✅ Banner quảng cáo

#### 💬 Hỗ trợ
- ✅ Chat bot tư vấn
- ✅ Chat với admin

---

### 👨‍💼 Dành cho quản trị viên

#### 📊 Dashboard và thống kê
- ✅ Dashboard tổng quan với biểu đồ
- ✅ Thống kê doanh thu (ngày, tháng, năm)
- ✅ Thống kê đơn hàng (đã đặt, đã hủy, hoàn trả)
- ✅ Chi tiết doanh thu với bộ lọc
- ✅ Chi tiết đơn hàng với bộ lọc
- ✅ Thống kê sản phẩm bán chạy
- ✅ Thống kê khách hàng

#### 🛒 Quản lý sản phẩm
- ✅ CRUD sản phẩm (tạo, đọc, cập nhật, xóa)
- ✅ Quản lý biến thể sản phẩm (kích thước, màu sắc)
- ✅ Upload nhiều ảnh sản phẩm
- ✅ Quản lý tồn kho
- ✅ Đánh dấu sản phẩm nổi bật / khuyến mãi
- ✅ Quản lý danh mục sản phẩm
- ✅ Quản lý thương hiệu

#### 📦 Quản lý đơn hàng
- ✅ Xem danh sách đơn hàng
- ✅ Chi tiết đơn hàng
- ✅ Cập nhật trạng thái đơn hàng
- ✅ Xử lý đơn hoàn trả
- ✅ Lọc và tìm kiếm đơn hàng

#### 👥 Quản lý người dùng
- ✅ Xem danh sách khách hàng
- ✅ Quản lý vai trò (Admin, Khách hàng)
- ✅ Khóa / Mở khóa tài khoản

#### 💰 Quản lý khuyến mãi
- ✅ Tạo và quản lý mã giảm giá
- ✅ Thiết lập điều kiện áp dụng
- ✅ Quản lý thời gian hiệu lực

#### ⭐ Quản lý đánh giá
- ✅ Xem danh sách đánh giá
- ✅ Hiển thị / Ẩn đánh giá
- ✅ Xóa đánh giá không phù hợp

#### 🔔 Quản lý thông báo
- ✅ Tạo thông báo hot deals
- ✅ Gửi thông báo đến tất cả người dùng
- ✅ Quản lý thông báo hệ thống

#### 📰 Quản lý nội dung
- ✅ Quản lý banner quảng cáo
- ✅ Quản lý tin tức / Blog
- ✅ Upload ảnh cho tin tức

#### 💬 Quản lý chat
- ✅ Xem tin nhắn từ khách hàng
- ✅ Trả lời tin nhắn
- ✅ Quản lý cuộc trò chuyện

---

## 🛠️ Công nghệ sử dụng

### Backend
- **ASP.NET Core 8.0** - Web API framework
- **Entity Framework Core 8.0** - ORM
- **SQL Server** - Database
- **JWT Authentication** - Xác thực người dùng
- **BCrypt.Net** - Mã hóa mật khẩu
- **Swagger/OpenAPI** - API documentation
- **AutoMapper** - Object mapping

### Frontend
- **React 19.2** - UI library
- **React Router DOM 6.26** - Client-side routing
- **Vite 7.2** - Build tool
- **Axios 1.7** - HTTP client
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **React Toastify** - Toast notifications
- **React Icons** - Icon library
- **Recharts 2.12** - Charts và biểu đồ

---

## 🚀 Cài đặt và chạy dự án

### Yêu cầu hệ thống

- **.NET 8.0 SDK** hoặc cao hơn
- **Node.js 18+** và **npm**
- **SQL Server** (LocalDB, SQL Server Express, hoặc SQL Server)
- **Visual Studio 2022** hoặc **VS Code** (khuyến nghị)

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd ShopBanDoTheThao
```

### Bước 2: Cấu hình Backend

1. Mở terminal trong thư mục `ShopBanDoTheThao.Server`

2. Cập nhật connection string trong `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=ShopBanDoTheThaoDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
  }
}
```

**Lưu ý**: Thay `YOUR_SERVER_NAME` bằng tên SQL Server của bạn:
- LocalDB: `(localdb)\\mssqllocaldb`
- SQL Server Express: `MSI\\SQLEXPRESS` (hoặc tên instance của bạn)
- SQL Server: `localhost` hoặc `SERVER_NAME\\INSTANCE_NAME`

3. Cài đặt Entity Framework tools (nếu chưa có):

```bash
dotnet tool install --global dotnet-ef
```

4. Tạo database và migration:

```bash
dotnet ef database update
```

5. Chạy ứng dụng:

```bash
dotnet run
```

Backend API sẽ chạy tại:
- **HTTP**: `http://localhost:5066`
- **HTTPS**: `https://localhost:7000` (nếu có cấu hình SSL)
- **Swagger UI**: `https://localhost:7000/swagger`

### Bước 3: Cấu hình Frontend

1. Mở terminal trong thư mục `shopbandothethao.client`

2. Cài đặt dependencies:

```bash
npm install
```

3. (Tùy chọn) Tạo file `.env` để cấu hình API URL:

```env
VITE_API_URL=http://localhost:5066/api
```

**Lưu ý**: Nếu không có file `.env`, frontend sẽ sử dụng URL mặc định trong `src/services/api.js`

4. Chạy ứng dụng:

```bash
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:61620` (hoặc port khác nếu 61620 đã được sử dụng)

### Bước 4: Kiểm tra

1. Mở trình duyệt và truy cập: `http://localhost:61620`
2. Kiểm tra Swagger: `https://localhost:7000/swagger`
3. Đăng ký tài khoản mới hoặc sử dụng tài khoản admin mặc định (xem phần [Tài khoản mặc định](#-tài-khoản-mặc-định))

---

## 📁 Cấu trúc dự án

### Backend (`ShopBanDoTheThao.Server/`)

```
ShopBanDoTheThao.Server/
├── Controllers/              # API Controllers
│   ├── AdminController.cs    # Quản lý admin
│   ├── AuthController.cs     # Xác thực
│   ├── SanPhamController.cs  # Sản phẩm
│   ├── GioHangController.cs  # Giỏ hàng
│   ├── DonHangController.cs  # Đơn hàng
│   ├── DanhGiaController.cs  # Đánh giá
│   ├── ThongBaoController.cs # Thông báo
│   └── ...
├── Data/
│   ├── ShopBanDoTheThaoDbContext.cs  # Database context
│   └── DbInitializer.cs              # Seed data
├── Models/                   # Entity Models (tiếng Việt)
│   ├── NguoiDung.cs         # Người dùng
│   ├── SanPham.cs           # Sản phẩm
│   ├── SanPhamBienThe.cs    # Biến thể sản phẩm
│   ├── DonHang.cs           # Đơn hàng
│   ├── GioHangItem.cs       # Giỏ hàng
│   ├── DanhGiaSanPham.cs    # Đánh giá
│   ├── ThongBao.cs          # Thông báo
│   └── ...
├── DTOs/                     # Data Transfer Objects
│   ├── DangKyDTO.cs
│   ├── DangNhapDTO.cs
│   └── ...
├── Services/                 # Business Logic Services
│   └── JwtService.cs        # JWT token service
├── Helpers/                  # Helper classes
│   ├── DateTimeHelper.cs    # Xử lý thời gian
│   └── ThongBaoHelper.cs    # Tạo thông báo tự động
├── Migrations/               # Database migrations
├── wwwroot/                  # Static files
│   └── uploads/             # Uploaded images
├── Program.cs                # Application entry point
└── appsettings.json          # Configuration
```

### Frontend (`shopbandothethao.client/`)

```
shopbandothethao.client/
├── src/
│   ├── components/          # React Components
│   │   ├── Layout/          # Header, Footer, AdminLayout
│   │   ├── ProductCard.jsx  # Card sản phẩm
│   │   ├── QuickViewModal.jsx  # Modal xem nhanh
│   │   ├── NotificationBell.jsx  # Chuông thông báo
│   │   ├── ChatBot.jsx     # Chat bot
│   │   └── ...
│   ├── pages/               # Page Components
│   │   ├── TrangChu.jsx    # Trang chủ
│   │   ├── ChiTietSanPham.jsx  # Chi tiết sản phẩm
│   │   ├── GioHang.jsx     # Giỏ hàng
│   │   ├── DonHang.jsx     # Đơn hàng
│   │   ├── admin/          # Admin pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── QuanLySanPham.jsx
│   │   │   ├── QuanLyDonHang.jsx
│   │   │   └── ...
│   │   └── ...
│   ├── services/            # API Services
│   │   ├── api.js          # Axios configuration
│   │   ├── authService.js  # Authentication
│   │   ├── sanPhamService.js  # Sản phẩm
│   │   ├── gioHangService.js  # Giỏ hàng
│   │   ├── donHangService.js  # Đơn hàng
│   │   ├── adminService.js    # Admin APIs
│   │   └── ...
│   ├── utils/               # Utility functions
│   │   ├── dateUtils.js    # Xử lý ngày tháng
│   │   └── imageUtils.js   # Xử lý ảnh
│   ├── App.jsx              # Main App Component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── public/                  # Static assets
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
└── tailwind.config.js      # Tailwind configuration
```

---

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/dangky` - Đăng ký tài khoản
- `POST /api/auth/dangnhap` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user hiện tại

### Sản phẩm (`/api/sanpham`)
- `GET /api/sanpham` - Lấy danh sách sản phẩm (có phân trang, lọc)
- `GET /api/sanpham/{id}` - Lấy chi tiết sản phẩm
- `GET /api/sanpham/noibat` - Sản phẩm nổi bật
- `GET /api/sanpham/khuyenmai` - Sản phẩm khuyến mãi

### Giỏ hàng (`/api/giohang`) - Yêu cầu authentication
- `GET /api/giohang` - Lấy giỏ hàng
- `POST /api/giohang` - Thêm vào giỏ hàng
- `PUT /api/giohang/{id}` - Cập nhật số lượng
- `DELETE /api/giohang/{id}` - Xóa khỏi giỏ hàng

### Đơn hàng (`/api/donhang`) - Yêu cầu authentication
- `GET /api/donhang` - Lấy danh sách đơn hàng
- `GET /api/donhang/{id}` - Lấy chi tiết đơn hàng
- `POST /api/donhang` - Tạo đơn hàng
- `PUT /api/donhang/{id}/huy` - Hủy đơn hàng

### Đánh giá (`/api/danhgia`) - Yêu cầu authentication
- `POST /api/danhgia` - Tạo đánh giá sản phẩm
- `GET /api/danhgia/sanpham/{sanPhamId}` - Lấy đánh giá của sản phẩm

### Thông báo (`/api/thongbao`) - Yêu cầu authentication
- `GET /api/thongbao` - Lấy danh sách thông báo
- `GET /api/thongbao/dem-chua-doc` - Đếm thông báo chưa đọc
- `PUT /api/thongbao/{id}/da-doc` - Đánh dấu đã đọc
- `DELETE /api/thongbao/{id}` - Xóa thông báo

### Danh mục (`/api/danhmuc`)
- `GET /api/danhmuc` - Lấy danh sách danh mục
- `GET /api/danhmuc/{id}` - Lấy chi tiết danh mục

### Thương hiệu (`/api/thuonghieu`)
- `GET /api/thuonghieu` - Lấy danh sách thương hiệu

### Admin (`/api/admin`) - Yêu cầu authentication + Admin role
- `GET /api/admin/thongke/tongquan` - Thống kê tổng quan
- `GET /api/admin/thongke/doanhthu` - Thống kê doanh thu
- `GET /api/admin/thongke/donhang` - Thống kê đơn hàng
- `GET /api/admin/sanpham` - Quản lý sản phẩm
- `POST /api/admin/sanpham` - Tạo sản phẩm
- `PUT /api/admin/sanpham/{id}` - Cập nhật sản phẩm
- `DELETE /api/admin/sanpham/{id}` - Xóa sản phẩm
- `GET /api/admin/donhang` - Quản lý đơn hàng
- `PUT /api/admin/donhang/{id}/trangthai` - Cập nhật trạng thái đơn hàng
- `GET /api/admin/nguoidung` - Quản lý người dùng
- `GET /api/admin/danhgia` - Quản lý đánh giá
- `PUT /api/admin/danhgia/{id}/hienthi` - Cập nhật hiển thị đánh giá
- `POST /api/admin/thongbao/hot-deal` - Tạo thông báo hot deal
- Và nhiều endpoints khác...

**Xem đầy đủ API documentation tại Swagger UI**: `https://localhost:7000/swagger`

---

## ⚙️ Cấu hình

### Backend Configuration (`appsettings.json`)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=...;Database=ShopBanDoTheThaoDb;..."
  },
  "JwtSettings": {
    "SecretKey": "YourSuperSecretKeyForJWTTokenGeneration123456789",
    "Issuer": "ShopBanDoTheThao",
    "Audience": "ShopBanDoTheThaoUsers",
    "ExpirationInMinutes": 1440
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

### Frontend Configuration

API URL được cấu hình trong `src/services/api.js`:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5066/api';
```

Hoặc tạo file `.env`:

```env
VITE_API_URL=http://localhost:5066/api
```

### CORS Configuration

Backend đã được cấu hình CORS để cho phép frontend kết nối. Cấu hình trong `Program.cs`:

```csharp
policy.WithOrigins("http://localhost:61620", "https://localhost:61620")
```

Nếu frontend chạy ở port khác, cần cập nhật trong `Program.cs`.

---

## 👤 Tài khoản mặc định

Sau khi chạy migration và seed database, hệ thống sẽ tự động tạo tài khoản admin mặc định:

- **Email**: `admin@shopbandothethao.com`
- **Mật khẩu**: `Admin123!`
- **Vai trò**: `QuanTriVien`

**Lưu ý**: 
- Tài khoản này được tạo tự động trong quá trình seed database
- Nếu không có, bạn có thể tạo thủ công trong database hoặc đăng ký tài khoản mới và cập nhật `VaiTro` thành `"QuanTriVien"` trong database

---

## ⚠️ Lưu ý quan trọng

### 1. Database
- ✅ Đảm bảo SQL Server đang chạy trước khi chạy backend
- ✅ Kiểm tra connection string trong `appsettings.json`
- ✅ Chạy `dotnet ef database update` sau khi thay đổi models

### 2. CORS
- ✅ CORS đã được cấu hình cho React app
- ✅ Nếu frontend chạy ở port khác, cần cập nhật trong `Program.cs`

### 3. Authentication
- ✅ JWT token được lưu trong `localStorage`
- ✅ Token hết hạn sau 24 giờ (1440 phút)
- ✅ Cần đăng nhập lại khi token hết hạn

### 4. File Upload
- ✅ Ảnh được lưu trong `wwwroot/uploads/`
- ✅ Giới hạn upload: 5MB
- ✅ Hỗ trợ định dạng: JPG, PNG, GIF

### 5. Naming Convention
- ✅ Tất cả tên file và class trong Models đều sử dụng **tiếng Việt không dấu**
- ✅ Ví dụ: `NguoiDung`, `SanPham`, `DonHang`, `GioHangItem`

### 6. Timezone
- ✅ Backend sử dụng UTC time
- ✅ Frontend chuyển đổi sang giờ Việt Nam (UTC+7) khi hiển thị

### 7. Product Variants
- ✅ Sản phẩm có thể có biến thể (kích thước, màu sắc)
- ✅ Khi thêm vào giỏ hàng, nếu không chọn size/màu, hệ thống sẽ sử dụng sản phẩm chính
- ✅ Nếu chọn size/màu, hệ thống sẽ tìm biến thể phù hợp

---

## 🎨 Tính năng UI/UX

- ✅ **Loading animations** - Hiệu ứng loading khi tải trang
- ✅ **Scroll to top button** - Nút quay về đầu trang
- ✅ **Image gallery** - Gallery ảnh với modal fullscreen
- ✅ **Color swatches** - Hiển thị màu sắc dạng swatch
- ✅ **Responsive design** - Tương thích mobile, tablet, desktop
- ✅ **Toast notifications** - Thông báo thành công/lỗi
- ✅ **Glassmorphism effects** - Hiệu ứng glass cho một số component

---

## 📝 Phát triển tiếp theo

### Tính năng đã hoàn thành ✅
- [x] Hệ thống đánh giá và review
- [x] Quản lý kho hàng
- [x] Báo cáo và thống kê
- [x] Hệ thống thông báo
- [x] Quản lý đánh giá cho admin
- [x] Chat bot và chat với admin
- [x] Banner quảng cáo
- [x] Tin tức / Blog
- [x] Biến thể sản phẩm
- [x] Image gallery và modal

### Tính năng đang phát triển 🚧
- [ ] Tích hợp thanh toán (Momo, ZaloPay, VNPay)
- [ ] Tích hợp đăng nhập Google/Facebook
- [ ] Push notifications (browser notifications)
- [ ] PWA support (Progressive Web App)
- [ ] Multi-language support (Đa ngôn ngữ)
- [ ] Export báo cáo (Excel, PDF)
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Advanced search với Elasticsearch
- [ ] Recommendation system (AI)

---

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng:

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

---

## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

## 👨‍💻 Tác giả

**Shop Bán Đồ Thể Thao Team**

---

## 📞 Liên hệ

- **Email**: support@shopbandothethao.com
- **Website**: https://shopbandothethao.com

---

## 🙏 Cảm ơn

Cảm ơn bạn đã sử dụng và đóng góp cho dự án này! 🎉

---

**Made with ❤️ using ASP.NET Core and React**
