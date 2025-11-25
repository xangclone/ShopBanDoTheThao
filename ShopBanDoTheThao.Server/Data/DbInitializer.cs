using ShopBanDoTheThao.Server.Models;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;

namespace ShopBanDoTheThao.Server.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ShopBanDoTheThaoDbContext context)
        {
            // Đảm bảo database được tạo
            context.Database.EnsureCreated();
            
            // Đảm bảo bảng Banner được tạo (nếu chưa có)
            // Sử dụng EnsureCreated sẽ tự động tạo tất cả các bảng từ DbSet
            // Nếu database đã tồn tại, cần chạy migration để thêm bảng Banner

            // Kiểm tra xem đã có dữ liệu chưa
            var hasData = context.DanhMuc.Any();
            
            // Nếu đã có dữ liệu, không seed lại
            if (hasData)
            {
                return;
            }

            // Seed Danh Mục
            var danhMucGiay = new DanhMuc
            {
                Ten = "Giày thể thao",
                MoTa = "Các loại giày thể thao chất lượng cao",
                Slug = "giay-the-thao",
                ThuTuHienThi = 1,
                DangHoatDong = true,
                NgayTao = DateTime.UtcNow
            };

            var danhMucQuanAo = new DanhMuc
            {
                Ten = "Quần áo thể thao",
                MoTa = "Quần áo tập luyện và thi đấu",
                Slug = "quan-ao-the-thao",
                ThuTuHienThi = 2,
                DangHoatDong = true,
                NgayTao = DateTime.UtcNow
            };

            var danhMucDungCu = new DanhMuc
            {
                Ten = "Dụng cụ thể thao",
                MoTa = "Các dụng cụ hỗ trợ tập luyện",
                Slug = "dung-cu-the-thao",
                ThuTuHienThi = 3,
                DangHoatDong = true,
                NgayTao = DateTime.UtcNow
            };

            var danhMucPhuKien = new DanhMuc
            {
                Ten = "Phụ kiện thể thao",
                MoTa = "Phụ kiện hỗ trợ tập luyện",
                Slug = "phu-kien-the-thao",
                ThuTuHienThi = 4,
                DangHoatDong = true,
                NgayTao = DateTime.UtcNow
            };

            context.DanhMuc.AddRange(danhMucGiay, danhMucQuanAo, danhMucDungCu, danhMucPhuKien);
            context.SaveChanges();

            // Seed Thương Hiệu
            var thuongHieuNike = new ThuongHieu
            {
                Ten = "Nike",
                MoTa = "Thương hiệu thể thao hàng đầu thế giới",
                Logo = "https://via.placeholder.com/200?text=Nike",
                Slug = "nike",
                DangHoatDong = true,
                NgayTao = DateTime.UtcNow
            };

            var thuongHieuAdidas = new ThuongHieu
            {
                Ten = "Adidas",
                MoTa = "Thương hiệu thể thao nổi tiếng",
                Logo = "https://via.placeholder.com/200?text=Adidas",
                Slug = "adidas",
                DangHoatDong = true,
                NgayTao = DateTime.UtcNow
            };

            var thuongHieuPuma = new ThuongHieu
            {
                Ten = "Puma",
                MoTa = "Thương hiệu thể thao đẳng cấp",
                Logo = "https://via.placeholder.com/200?text=Puma",
                Slug = "puma",
                DangHoatDong = true,
                NgayTao = DateTime.UtcNow
            };

            context.ThuongHieu.AddRange(thuongHieuNike, thuongHieuAdidas, thuongHieuPuma);
            context.SaveChanges();

            // Seed Sản Phẩm
            var sanPham1 = new SanPham
            {
                Ten = "Giày chạy bộ Nike Air Max",
                MoTa = "Giày chạy bộ với công nghệ Air Max tiên tiến, êm ái và bền bỉ",
                MoTaChiTiet = "<p>Giày chạy bộ Nike Air Max với thiết kế hiện đại, phù hợp cho mọi địa hình. Đế giày có công nghệ Air Max giúp giảm chấn động, bảo vệ đôi chân của bạn.</p>",
                Gia = 2500000,
                GiaGoc = 3000000,
                SKU = "NIKE-AM-001",
                DanhMucId = danhMucGiay.Id,
                ThuongHieuId = thuongHieuNike.Id,
                SoLuongTon = 50,
                KichThuoc = "40,41,42,43,44",
                MauSac = "Đen, Trắng, Xanh",
                ChatLieu = "Da tổng hợp, EVA",
                XuatXu = "Việt Nam",
                HinhAnhChinh = "https://via.placeholder.com/500x500?text=Nike+Air+Max",
                Slug = "giay-chay-bo-nike-air-max",
                SanPhamNoiBat = true,
                DangKhuyenMai = true,
                DangHoatDong = true,
                NgayTao = DateTime.UtcNow
            };

            var sanPham2 = new SanPham
            {
                Ten = "Giày đá bóng Adidas Predator",
                MoTa = "Giày đá bóng chuyên nghiệp với công nghệ Predator",
                MoTaChiTiet = "<p>Giày đá bóng Adidas Predator được thiết kế cho các cầu thủ chuyên nghiệp. Đế giày có gai phù hợp với sân cỏ tự nhiên và nhân tạo.</p>",
                Gia = 1800000,
                GiaGoc = 2200000,
                SKU = "ADIDAS-PRED-001",
                DanhMucId = danhMucGiay.Id,
                ThuongHieuId = thuongHieuAdidas.Id,
                SoLuongTon = 30,
                KichThuoc = "39,40,41,42,43",
                MauSac = "Đỏ, Đen",
                ChatLieu = "Da thật, TPU",
                XuatXu = "Đức",
                HinhAnhChinh = "https://via.placeholder.com/500x500?text=Adidas+Predator",
                Slug = "giay-da-bong-adidas-predator",
                SanPhamNoiBat = true,
                DangHoatDong = true,
                NgayTao = DateTime.UtcNow
            };

            var sanPham3 = new SanPham
            {
                Ten = "Áo thể thao Nike Dri-FIT",
                MoTa = "Áo thể thao công nghệ Dri-FIT, thấm hút mồ hôi tốt",
                MoTaChiTiet = "<p>Áo thể thao Nike Dri-FIT với công nghệ thấm hút mồ hôi tiên tiến, giúp bạn luôn khô ráo và thoải mái trong quá trình tập luyện.</p>",
                Gia = 450000,
                GiaGoc = 600000,
                SKU = "NIKE-DF-001",
                DanhMucId = danhMucQuanAo.Id,
                ThuongHieuId = thuongHieuNike.Id,
                SoLuongTon = 100,
                KichThuoc = "S,M,L,XL,XXL",
                MauSac = "Đen, Trắng, Xanh, Đỏ",
                ChatLieu = "Polyester",
                XuatXu = "Việt Nam",
                HinhAnhChinh = "https://via.placeholder.com/500x500?text=Nike+Dri-FIT",
                Slug = "ao-the-thao-nike-dri-fit",
                DangKhuyenMai = true,
                DangHoatDong = true,
                NgayTao = DateTime.UtcNow
            };

            var sanPham4 = new SanPham
            {
                Ten = "Quần thể thao Adidas",
                MoTa = "Quần thể thao co giãn tốt, thoải mái khi vận động",
                MoTaChiTiet = "<p>Quần thể thao Adidas với chất liệu co giãn tốt, phù hợp cho mọi hoạt động thể thao. Thiết kế hiện đại, năng động.</p>",
                Gia = 550000,
                GiaGoc = 700000,
                SKU = "ADIDAS-PANT-001",
                DanhMucId = danhMucQuanAo.Id,
                ThuongHieuId = thuongHieuAdidas.Id,
                SoLuongTon = 80,
                KichThuoc = "S,M,L,XL,XXL",
                MauSac = "Đen, Xám, Xanh",
                ChatLieu = "Polyester, Spandex",
                XuatXu = "Đức",
                HinhAnhChinh = "https://via.placeholder.com/500x500?text=Adidas+Pants",
                Slug = "quan-the-thao-adidas",
                DangHoatDong = true,
                NgayTao = DateTime.UtcNow
            };

            var sanPham5 = new SanPham
            {
                Ten = "Tạ tay Puma 5kg",
                MoTa = "Tạ tay chất lượng cao, phù hợp tập luyện tại nhà",
                MoTaChiTiet = "<p>Tạ tay Puma 5kg được làm từ gang chất lượng cao, có lớp bọc cao su chống trượt. Phù hợp cho người mới bắt đầu tập luyện.</p>",
                Gia = 350000,
                SKU = "PUMA-DUMB-5KG",
                DanhMucId = danhMucDungCu.Id,
                ThuongHieuId = thuongHieuPuma.Id,
                SoLuongTon = 40,
                KichThuoc = "5kg",
                MauSac = "Đen",
                ChatLieu = "Gang, Cao su",
                XuatXu = "Trung Quốc",
                HinhAnhChinh = "https://via.placeholder.com/500x500?text=Puma+Dumbbell",
                Slug = "ta-tay-puma-5kg",
                DangHoatDong = true,
                NgayTao = DateTime.UtcNow
            };

            var sanPham6 = new SanPham
            {
                Ten = "Bóng đá Puma Size 5",
                MoTa = "Bóng đá chính thức, phù hợp thi đấu",
                MoTaChiTiet = "<p>Bóng đá Puma Size 5 được làm từ da tổng hợp cao cấp, có độ bền cao và kiểm soát tốt. Phù hợp cho thi đấu và tập luyện.</p>",
                Gia = 280000,
                GiaGoc = 350000,
                SKU = "PUMA-BALL-5",
                DanhMucId = danhMucDungCu.Id,
                ThuongHieuId = thuongHieuPuma.Id,
                SoLuongTon = 60,
                KichThuoc = "Size 5",
                MauSac = "Trắng, Đen",
                ChatLieu = "Da tổng hợp, PU",
                XuatXu = "Pakistan",
                HinhAnhChinh = "https://via.placeholder.com/500x500?text=Puma+Football",
                Slug = "bong-da-puma-size-5",
                DangKhuyenMai = true,
                DangHoatDong = true,
                NgayTao = DateTime.UtcNow
            };

            var sanPham7 = new SanPham
            {
                Ten = "Túi thể thao Nike",
                MoTa = "Túi thể thao đa năng, nhiều ngăn",
                MoTaChiTiet = "<p>Túi thể thao Nike với thiết kế đa năng, nhiều ngăn tiện lợi. Chất liệu chống nước, bền bỉ. Phù hợp mang theo khi tập luyện.</p>",
                Gia = 320000,
                GiaGoc = 400000,
                SKU = "NIKE-BAG-001",
                DanhMucId = danhMucPhuKien.Id,
                ThuongHieuId = thuongHieuNike.Id,
                SoLuongTon = 70,
                KichThuoc = "One Size",
                MauSac = "Đen, Xanh, Đỏ",
                ChatLieu = "Polyester, Nylon",
                XuatXu = "Việt Nam",
                HinhAnhChinh = "https://via.placeholder.com/500x500?text=Nike+Bag",
                Slug = "tui-the-thao-nike",
                DangHoatDong = true,
                NgayTao = DateTime.UtcNow
            };

            var sanPham8 = new SanPham
            {
                Ten = "Băng quấn đầu gối Adidas",
                MoTa = "Băng quấn bảo vệ đầu gối khi tập luyện",
                MoTaChiTiet = "<p>Băng quấn đầu gối Adidas giúp bảo vệ và hỗ trợ đầu gối khi tập luyện. Chất liệu co giãn tốt, thoáng khí.</p>",
                Gia = 150000,
                SKU = "ADIDAS-KNEE-001",
                DanhMucId = danhMucPhuKien.Id,
                ThuongHieuId = thuongHieuAdidas.Id,
                SoLuongTon = 90,
                KichThuoc = "One Size",
                MauSac = "Đen, Trắng",
                ChatLieu = "Neoprene, Nylon",
                XuatXu = "Đức",
                HinhAnhChinh = "https://via.placeholder.com/500x500?text=Adidas+Knee+Support",
                Slug = "bang-quan-dau-goi-adidas",
                DangHoatDong = true,
                NgayTao = DateTime.UtcNow
            };

            context.SanPham.AddRange(sanPham1, sanPham2, sanPham3, sanPham4, sanPham5, sanPham6, sanPham7, sanPham8);
            context.SaveChanges();

            // Seed Biến thể sản phẩm
            // Biến thể cho Giày chạy bộ Nike Air Max
            var bienThe1_1 = new SanPhamBienThe
            {
                SanPhamId = sanPham1.Id,
                KichThuoc = "40",
                MauSac = "Đen",
                SKU = "NIKE-AM-001-40-DEN",
                SoLuongTon = 10,
                DangHoatDong = true,
                NgayTao = DateTime.UtcNow
            };

            var bienThe1_2 = new SanPhamBienThe
            {
                SanPhamId = sanPham1.Id,
                KichThuoc = "40",
                MauSac = "Trắng",
                SKU = "NIKE-AM-001-40-TRANG",
                SoLuongTon = 8,
                DangHoatDong = true,
                NgayTao = DateTime.UtcNow
            };

            var bienThe1_3 = new SanPhamBienThe
            {
                SanPhamId = sanPham1.Id,
                KichThuoc = "41",
                MauSac = "Đen",
                SKU = "NIKE-AM-001-41-DEN",
                SoLuongTon = 12,
                DangHoatDong = true,
                NgayTao = DateTime.UtcNow
            };

            var bienThe1_4 = new SanPhamBienThe
            {
                SanPhamId = sanPham1.Id,
                KichThuoc = "42",
                MauSac = "Xanh",
                SKU = "NIKE-AM-001-42-XANH",
                SoLuongTon = 15,
                DangHoatDong = true,
                NgayTao = DateTime.UtcNow
            };

            var bienThe1_5 = new SanPhamBienThe
            {
                SanPhamId = sanPham1.Id,
                KichThuoc = "43",
                MauSac = "Trắng",
                SKU = "NIKE-AM-001-43-TRANG",
                SoLuongTon = 5,
                DangHoatDong = true,
                NgayTao = DateTime.UtcNow
            };

            // Biến thể cho Giày đá bóng Adidas Predator
            var bienThe2_1 = new SanPhamBienThe
            {
                SanPhamId = sanPham2.Id,
                KichThuoc = "40",
                MauSac = "Đỏ",
                SKU = "ADIDAS-PRED-001-40-DO",
                SoLuongTon = 8,
                DangHoatDong = true,
                NgayTao = DateTime.UtcNow
            };

            var bienThe2_2 = new SanPhamBienThe
            {
                SanPhamId = sanPham2.Id,
                KichThuoc = "41",
                MauSac = "Đen",
                SKU = "ADIDAS-PRED-001-41-DEN",
                SoLuongTon = 10,
                DangHoatDong = true,
                NgayTao = DateTime.UtcNow
            };

            var bienThe2_3 = new SanPhamBienThe
            {
                SanPhamId = sanPham2.Id,
                KichThuoc = "42",
                MauSac = "Đỏ",
                SKU = "ADIDAS-PRED-001-42-DO",
                SoLuongTon = 12,
                DangHoatDong = true,
                NgayTao = DateTime.UtcNow
            };

            // Biến thể cho Áo thể thao Nike Dri-FIT
            var bienThe3_1 = new SanPhamBienThe
            {
                SanPhamId = sanPham3.Id,
                KichThuoc = "M",
                MauSac = "Đen",
                SKU = "NIKE-DRI-M-DEN",
                SoLuongTon = 20,
                DangHoatDong = true,
                NgayTao = DateTime.UtcNow
            };

            var bienThe3_2 = new SanPhamBienThe
            {
                SanPhamId = sanPham3.Id,
                KichThuoc = "L",
                MauSac = "Xanh",
                SKU = "NIKE-DRI-L-XANH",
                SoLuongTon = 15,
                DangHoatDong = true,
                NgayTao = DateTime.UtcNow
            };

            var bienThe3_3 = new SanPhamBienThe
            {
                SanPhamId = sanPham3.Id,
                KichThuoc = "XL",
                MauSac = "Trắng",
                SKU = "NIKE-DRI-XL-TRANG",
                SoLuongTon = 10,
                DangHoatDong = true,
                NgayTao = DateTime.UtcNow
            };

            context.SanPhamBienThe.AddRange(
                bienThe1_1, bienThe1_2, bienThe1_3, bienThe1_4, bienThe1_5,
                bienThe2_1, bienThe2_2, bienThe2_3,
                bienThe3_1, bienThe3_2, bienThe3_3
            );
            context.SaveChanges();

            // Seed Mã Giảm Giá
            var maGiamGia1 = new MaGiamGia
            {
                Ma = "WELCOME10",
                MoTa = "Giảm 10% cho khách hàng mới",
                LoaiGiamGia = "PhanTram",
                GiaTriGiamGia = 10,
                GiaTriDonHangToiThieu = 500000,
                GiaTriGiamGiaToiDa = 200000,
                SoLuongSuDung = 100,
                NgayBatDau = DateTime.UtcNow,
                NgayKetThuc = DateTime.UtcNow.AddMonths(3),
                DangHoatDong = true,
                NgayTao = DateTime.UtcNow
            };

            var maGiamGia2 = new MaGiamGia
            {
                Ma = "SALE50K",
                MoTa = "Giảm 50.000đ cho đơn hàng từ 1.000.000đ",
                LoaiGiamGia = "SoTien",
                GiaTriGiamGia = 50000,
                GiaTriDonHangToiThieu = 1000000,
                NgayBatDau = DateTime.UtcNow,
                NgayKetThuc = DateTime.UtcNow.AddMonths(1),
                DangHoatDong = true,
                NgayTao = DateTime.UtcNow
            };

            context.MaGiamGia.AddRange(maGiamGia1, maGiamGia2);
            context.SaveChanges();

            // Seed Banner (luôn kiểm tra và thêm nếu chưa có)
            SeedBanner(context);

            // Seed Tin Tức (luôn kiểm tra và thêm nếu chưa có)
            SeedTinTuc(context);

            // Seed Tài khoản Admin (luôn kiểm tra và thêm nếu chưa có)
            SeedAdminUser(context);
        }

        // Phương thức riêng để seed banner, luôn được gọi bất kể database đã có dữ liệu hay chưa
        public static void SeedBanner(ShopBanDoTheThaoDbContext context)
        {
            try
            {
                // Kiểm tra xem đã có banner chưa
                if (context.Banner.Any())
                {
                    return;
                }

                // Nếu bảng Banner chưa tồn tại, tạo bảng
                try
                {
                    context.Database.ExecuteSqlRaw(@"
                        IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Banner]') AND type in (N'U'))
                        BEGIN
                            CREATE TABLE [dbo].[Banner] (
                                [Id] int IDENTITY(1,1) NOT NULL,
                                [TieuDe] nvarchar(200) NOT NULL,
                                [MoTa] nvarchar(500) NULL,
                                [HinhAnh] nvarchar(500) NULL,
                                [LienKet] nvarchar(500) NULL,
                                [NutBam] nvarchar(50) NULL,
                                [ThuTuHienThi] int NOT NULL DEFAULT 0,
                                [DangHoatDong] bit NOT NULL DEFAULT 1,
                                [NgayBatDau] datetime2 NOT NULL,
                                [NgayKetThuc] datetime2 NULL,
                                [NgayTao] datetime2 NOT NULL,
                                [NgayCapNhat] datetime2 NULL,
                                CONSTRAINT [PK_Banner] PRIMARY KEY ([Id])
                            );
                        END
                    ");
                }
                catch
                {
                    // Bỏ qua nếu bảng đã tồn tại hoặc có lỗi
                }

                // Seed dữ liệu banner
                var banner1 = new Banner
                {
                    TieuDe = "Chào mừng đến với Shop Bán Đồ Thể Thao",
                    MoTa = "Khám phá bộ sưu tập giày thể thao, quần áo và phụ kiện chất lượng cao",
                    HinhAnh = "/images/banner1.jpg",
                    LienKet = "/san-pham",
                    NutBam = "Mua ngay",
                    ThuTuHienThi = 1,
                    DangHoatDong = true,
                    NgayBatDau = DateTime.UtcNow,
                    NgayKetThuc = null,
                    NgayTao = DateTime.UtcNow
                };

                var banner2 = new Banner
                {
                    TieuDe = "Giảm giá lên đến 50%",
                    MoTa = "Ưu đãi đặc biệt cho tất cả sản phẩm thể thao",
                    HinhAnh = "/images/banner2.jpg",
                    LienKet = "/san-pham?dangKhuyenMai=true",
                    NutBam = "Xem ngay",
                    ThuTuHienThi = 2,
                    DangHoatDong = true,
                    NgayBatDau = DateTime.UtcNow,
                    NgayKetThuc = DateTime.UtcNow.AddMonths(1),
                    NgayTao = DateTime.UtcNow
                };

                var banner3 = new Banner
                {
                    TieuDe = "Sản phẩm mới ra mắt",
                    MoTa = "Cập nhật những mẫu giày và quần áo thể thao mới nhất",
                    HinhAnh = "/images/banner3.jpg",
                    LienKet = "/san-pham?sortBy=NgayTao&sortOrder=desc",
                    NutBam = "Khám phá",
                    ThuTuHienThi = 3,
                    DangHoatDong = true,
                    NgayBatDau = DateTime.UtcNow,
                    NgayKetThuc = null,
                    NgayTao = DateTime.UtcNow
                };

                context.Banner.AddRange(banner1, banner2, banner3);
                context.SaveChanges();
            }
            catch
            {
                // Bỏ qua lỗi nếu không thể seed banner
            }
        }

        // Phương thức riêng để seed tin tức, luôn được gọi bất kể database đã có dữ liệu hay chưa
        public static void SeedTinTuc(ShopBanDoTheThaoDbContext context)
        {
            try
            {
                // Kiểm tra xem đã có tin tức chưa
                if (context.TinTuc.Any())
                {
                    return;
                }

                // Lấy admin user để làm NguoiTaoId
                var adminUser = context.NguoiDung.FirstOrDefault(u => u.VaiTro == "QuanTriVien");
                if (adminUser == null)
                {
                    // Nếu chưa có admin, tạo một user tạm
                    adminUser = new NguoiDung
                    {
                        Email = "admin@shopbandothethao.com",
                        SoDienThoai = "0123456789",
                        MatKhauHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                        Ho = "Quản",
                        Ten = "Trị Viên",
                        VaiTro = "QuanTriVien",
                        DaXacThucEmail = true,
                        DaXacThucSoDienThoai = true,
                        DangHoatDong = true,
                        NgayTao = DateTime.UtcNow
                    };
                    context.NguoiDung.Add(adminUser);
                    context.SaveChanges();
                }

                var tinTuc1 = new TinTuc
                {
                    TieuDe = "10 Lợi ích tuyệt vời của việc tập thể dục thường xuyên",
                    TomTat = "Tập thể dục không chỉ giúp bạn có thân hình đẹp mà còn mang lại nhiều lợi ích sức khỏe tuyệt vời. Hãy cùng khám phá 10 lợi ích hàng đầu của việc tập thể dục thường xuyên.",
                    NoiDung = @"<h2>1. Cải thiện sức khỏe tim mạch</h2>
<p>Tập thể dục thường xuyên giúp tăng cường sức khỏe tim mạch, giảm nguy cơ mắc các bệnh về tim và đột quỵ. Hoạt động thể chất giúp tim bơm máu hiệu quả hơn, giảm huyết áp và cholesterol.</p>

<h2>2. Tăng cường sức mạnh cơ bắp</h2>
<p>Việc tập luyện thường xuyên giúp xây dựng và duy trì khối lượng cơ bắp, đặc biệt quan trọng khi bạn già đi. Cơ bắp khỏe mạnh giúp bạn dễ dàng thực hiện các hoạt động hàng ngày.</p>

<h2>3. Cải thiện tâm trạng</h2>
<p>Tập thể dục giải phóng endorphin - hormone hạnh phúc, giúp giảm căng thẳng, lo âu và trầm cảm. Chỉ cần 30 phút tập luyện mỗi ngày có thể cải thiện đáng kể tâm trạng của bạn.</p>

<h2>4. Tăng cường năng lượng</h2>
<p>Mặc dù có vẻ nghịch lý, nhưng tập thể dục thực sự giúp tăng mức năng lượng của bạn. Hoạt động thể chất cải thiện lưu thông máu và cung cấp oxy đến các tế bào, giúp bạn cảm thấy tràn đầy năng lượng hơn.</p>

<h2>5. Cải thiện giấc ngủ</h2>
<p>Những người tập thể dục thường xuyên có xu hướng ngủ ngon hơn và sâu hơn. Tập luyện giúp điều chỉnh nhịp sinh học và giảm các vấn đề về giấc ngủ.</p>

<h2>6. Kiểm soát cân nặng</h2>
<p>Tập thể dục kết hợp với chế độ ăn uống lành mạnh là cách hiệu quả nhất để duy trì cân nặng khỏe mạnh. Hoạt động thể chất đốt cháy calo và tăng cường trao đổi chất.</p>

<h2>7. Tăng cường hệ miễn dịch</h2>
<p>Tập thể dục vừa phải có thể tăng cường hệ miễn dịch, giúp cơ thể chống lại bệnh tật tốt hơn. Tuy nhiên, tập luyện quá sức có thể làm suy yếu hệ miễn dịch.</p>

<h2>8. Cải thiện sức khỏe xương</h2>
<p>Các bài tập chịu trọng lượng như đi bộ, chạy bộ và nâng tạ giúp tăng cường mật độ xương, giảm nguy cơ loãng xương khi bạn già đi.</p>

<h2>9. Tăng cường trí nhớ và khả năng tư duy</h2>
<p>Tập thể dục kích thích sản xuất các hormone tăng trưởng trong não, giúp cải thiện trí nhớ và khả năng tư duy. Nó cũng giúp giảm nguy cơ mắc bệnh Alzheimer và sa sút trí tuệ.</p>

<h2>10. Tăng tuổi thọ</h2>
<p>Nhiều nghiên cứu đã chứng minh rằng những người tập thể dục thường xuyên có xu hướng sống lâu hơn và khỏe mạnh hơn. Hoạt động thể chất giúp ngăn ngừa nhiều bệnh mãn tính và cải thiện chất lượng cuộc sống.</p>

<p><strong>Kết luận:</strong> Tập thể dục thường xuyên là một trong những điều tốt nhất bạn có thể làm cho sức khỏe của mình. Hãy bắt đầu với những bài tập đơn giản và tăng dần cường độ theo thời gian.</p>",
                    HinhAnh = "/images/tintuc/tap-the-duc.jpg",
                    Slug = "10-loi-ich-tuyet-voi-cua-viec-tap-the-duc-thuong-xuyen",
                    Loai = "CamNang",
                    NguoiTaoId = adminUser.Id,
                    SoLuotXem = 0,
                    DangHoatDong = true,
                    NoiBat = true,
                    NgayTao = DateTime.UtcNow,
                    NgayDang = DateTime.UtcNow.AddDays(-5)
                };

                var tinTuc2 = new TinTuc
                {
                    TieuDe = "Hướng dẫn chọn giày chạy bộ phù hợp cho người mới bắt đầu",
                    TomTat = "Chọn đúng giày chạy bộ là bước đầu tiên quan trọng để có một trải nghiệm chạy bộ an toàn và thoải mái. Bài viết này sẽ hướng dẫn bạn cách chọn giày phù hợp.",
                    NoiDung = @"<h2>1. Hiểu về kiểu chân của bạn</h2>
<p>Trước khi chọn giày, bạn cần xác định kiểu chân của mình:</p>
<ul>
<li><strong>Chân bình thường:</strong> Phần giữa chân có độ cong vừa phải</li>
<li><strong>Chân bẹt:</strong> Toàn bộ lòng bàn chân chạm đất khi đứng</li>
<li><strong>Chân cao vòm:</strong> Phần giữa chân có độ cong cao</li>
</ul>

<h2>2. Chọn đúng kích cỡ</h2>
<p>Giày chạy bộ nên có khoảng trống khoảng 1cm ở đầu ngón chân. Hãy thử giày vào cuối ngày khi chân bạn đã hơi sưng, và đảm bảo bạn đang đi tất chạy bộ.</p>

<h2>3. Xem xét địa hình chạy</h2>
<p>Nếu bạn chạy trên đường nhựa, hãy chọn giày chạy đường phố. Nếu chạy trên đường mòn, bạn cần giày chạy trail với độ bám tốt hơn.</p>

<h2>4. Kiểm tra độ đàn hồi</h2>
<p>Giày chạy bộ tốt nên có độ đàn hồi tốt ở phần đệm để giảm tác động lên khớp. Tuy nhiên, không nên chọn giày quá mềm vì sẽ thiếu hỗ trợ.</p>

<h2>5. Thử giày trước khi mua</h2>
<p>Luôn thử giày và đi bộ/chạy thử trong cửa hàng. Cảm giác thoải mái là yếu tố quan trọng nhất.</p>",
                    HinhAnh = "/images/tintuc/giay-chay-bo.jpg",
                    Slug = "huong-dan-chon-giay-chay-bo-phu-hop-cho-nguoi-moi-bat-dau",
                    Loai = "HuongDan",
                    NguoiTaoId = adminUser.Id,
                    SoLuotXem = 0,
                    DangHoatDong = true,
                    NoiBat = true,
                    NgayTao = DateTime.UtcNow,
                    NgayDang = DateTime.UtcNow.AddDays(-3)
                };

                var tinTuc3 = new TinTuc
                {
                    TieuDe = "Xu hướng thời trang thể thao 2024: Phong cách năng động và bền vững",
                    TomTat = "Năm 2024 chứng kiến sự phát triển mạnh mẽ của thời trang thể thao với xu hướng kết hợp giữa phong cách năng động và tính bền vững.",
                    NoiDung = @"<h2>Xu hướng màu sắc</h2>
<p>Năm 2024, các thương hiệu thể thao tập trung vào các tông màu tươi sáng và năng động như cam, xanh lá, và tím. Màu pastel cũng đang trở lại với phong cách nhẹ nhàng và thanh lịch.</p>

<h2>Chất liệu bền vững</h2>
<p>Nhiều thương hiệu đang chuyển sang sử dụng vật liệu tái chế và bền vững. Polyester tái chế, bông hữu cơ và các vật liệu sinh học đang trở thành xu hướng chính.</p>

<h2>Thiết kế đa năng</h2>
<p>Quần áo thể thao hiện đại được thiết kế để có thể mặc cả trong phòng gym và ngoài đường phố, tạo nên phong cách athleisure phổ biến.</p>

<h2>Công nghệ thông minh</h2>
<p>Quần áo thể thao tích hợp công nghệ như cảm biến theo dõi sức khỏe, vải tự làm mát và khả năng chống tia UV đang ngày càng phổ biến.</p>",
                    HinhAnh = "/images/tintuc/xu-huong-thoi-trang-the-thao.jpg",
                    Slug = "xu-huong-thoi-trang-the-thao-2024-phong-cach-nang-dong-va-ben-vung",
                    Loai = "TinTuc",
                    NguoiTaoId = adminUser.Id,
                    SoLuotXem = 0,
                    DangHoatDong = true,
                    NoiBat = false,
                    NgayTao = DateTime.UtcNow,
                    NgayDang = DateTime.UtcNow.AddDays(-1)
                };

                var tinTuc4 = new TinTuc
                {
                    TieuDe = "5 bài tập tại nhà không cần dụng cụ cho người bận rộn",
                    TomTat = "Bạn quá bận rộn để đến phòng gym? Không sao! Dưới đây là 5 bài tập hiệu quả bạn có thể thực hiện ngay tại nhà mà không cần bất kỳ dụng cụ nào.",
                    NoiDung = @"<h2>1. Burpees</h2>
<p>Burpees là bài tập toàn thân tuyệt vời, đốt cháy nhiều calo và tăng cường sức mạnh. Thực hiện 3 hiệp, mỗi hiệp 10-15 lần.</p>

<h2>2. Plank</h2>
<p>Plank giúp tăng cường sức mạnh cốt lõi. Giữ tư thế plank trong 30-60 giây, lặp lại 3-5 lần.</p>

<h2>3. Jumping Jacks</h2>
<p>Bài tập cardio đơn giản nhưng hiệu quả. Thực hiện 3 hiệp, mỗi hiệp 20-30 lần.</p>

<h2>4. Push-ups</h2>
<p>Tăng cường sức mạnh phần trên cơ thể. Bắt đầu với 10-15 lần, tăng dần theo thời gian.</p>

<h2>5. Squats</h2>
<p>Bài tập tốt nhất cho chân và mông. Thực hiện 3 hiệp, mỗi hiệp 15-20 lần.</p>

<p><strong>Lưu ý:</strong> Luôn khởi động trước khi tập và thư giãn sau khi tập để tránh chấn thương.</p>",
                    HinhAnh = "/images/tintuc/bai-tap-tai-nha.jpg",
                    Slug = "5-bai-tap-tai-nha-khong-can-dung-cu-cho-nguoi-ban-ron",
                    Loai = "HuongDan",
                    NguoiTaoId = adminUser.Id,
                    SoLuotXem = 0,
                    DangHoatDong = true,
                    NoiBat = false,
                    NgayTao = DateTime.UtcNow,
                    NgayDang = DateTime.UtcNow.AddDays(-7)
                };

                var tinTuc5 = new TinTuc
                {
                    TieuDe = "Chế độ dinh dưỡng cho người tập thể hình: Hướng dẫn chi tiết",
                    TomTat = "Dinh dưỡng đúng cách là yếu tố quan trọng không kém việc tập luyện khi bạn muốn xây dựng cơ bắp. Hãy cùng tìm hiểu chế độ dinh dưỡng phù hợp.",
                    NoiDung = @"<h2>1. Protein - Nền tảng của cơ bắp</h2>
<p>Protein là chất dinh dưỡng quan trọng nhất cho việc xây dựng và phục hồi cơ bắp. Người tập thể hình nên tiêu thụ khoảng 1.6-2.2g protein/kg trọng lượng cơ thể mỗi ngày.</p>

<h2>2. Carbohydrate - Nguồn năng lượng</h2>
<p>Carbohydrate cung cấp năng lượng cho buổi tập. Nên ăn carb phức tạp như gạo lứt, yến mạch, khoai lang trước và sau khi tập.</p>

<h2>3. Chất béo lành mạnh</h2>
<p>Chất béo không bão hòa từ các nguồn như cá, quả hạch và dầu olive rất quan trọng cho sức khỏe tổng thể và sản xuất hormone.</p>

<h2>4. Thời gian ăn uống</h2>
<p>Ăn một bữa nhỏ giàu protein và carb trong vòng 30-60 phút sau khi tập giúp phục hồi cơ bắp tốt hơn.</p>

<h2>5. Uống đủ nước</h2>
<p>Giữ đủ nước là điều cần thiết cho hiệu suất tập luyện và phục hồi. Uống ít nhất 2-3 lít nước mỗi ngày.</p>",
                    HinhAnh = "/images/tintuc/dinh-duong-the-hinh.jpg",
                    Slug = "che-do-dinh-duong-cho-nguoi-tap-the-hinh-huong-dan-chi-tiet",
                    Loai = "CamNang",
                    NguoiTaoId = adminUser.Id,
                    SoLuotXem = 0,
                    DangHoatDong = true,
                    NoiBat = true,
                    NgayTao = DateTime.UtcNow,
                    NgayDang = DateTime.UtcNow.AddDays(-10)
                };

                var tinTuc6 = new TinTuc
                {
                    TieuDe = "Giải đấu thể thao lớn nhất năm 2024: Lịch thi đấu và điểm nổi bật",
                    TomTat = "Năm 2024 hứa hẹn nhiều giải đấu thể thao hấp dẫn trên toàn thế giới. Hãy cùng điểm qua các sự kiện thể thao lớn nhất trong năm.",
                    NoiDung = @"<h2>Thế vận hội Olympic Paris 2024</h2>
<p>Thế vận hội mùa hè sẽ được tổ chức tại Paris, Pháp từ ngày 26 tháng 7 đến 11 tháng 8. Đây là sự kiện thể thao lớn nhất thế giới với hơn 10,000 vận động viên từ hơn 200 quốc gia.</p>

<h2>Giải vô địch bóng đá châu Âu (Euro 2024)</h2>
<p>Giải đấu bóng đá lớn nhất châu Âu sẽ diễn ra tại Đức từ tháng 6 đến tháng 7, quy tụ 24 đội tuyển hàng đầu.</p>

<h2>Giải quần vợt Grand Slam</h2>
<p>4 giải đấu Grand Slam (Australian Open, French Open, Wimbledon, US Open) sẽ tiếp tục thu hút sự chú ý của người hâm mộ quần vợt trên toàn thế giới.</p>

<h2>Giải đua xe F1</h2>
<p>Mùa giải F1 2024 với 24 chặng đua trên khắp thế giới, mang đến những cuộc đua kịch tính và hấp dẫn.</p>",
                    HinhAnh = "/images/tintuc/giai-dau-the-thao-2024.jpg",
                    Slug = "giai-dau-the-thao-lon-nhat-nam-2024-lich-thi-dau-va-diem-noi-bat",
                    Loai = "TinTuc",
                    NguoiTaoId = adminUser.Id,
                    SoLuotXem = 0,
                    DangHoatDong = true,
                    NoiBat = false,
                    NgayTao = DateTime.UtcNow,
                    NgayDang = DateTime.UtcNow.AddDays(-2)
                };

                context.TinTuc.AddRange(tinTuc1, tinTuc2, tinTuc3, tinTuc4, tinTuc5, tinTuc6);
                context.SaveChanges();
            }
            catch
            {
                // Bỏ qua lỗi nếu không thể seed tin tức
            }
        }

        // Phương thức riêng để seed admin user, luôn được gọi bất kể database đã có dữ liệu hay chưa
        public static void SeedAdminUser(ShopBanDoTheThaoDbContext context)
        {
            var adminEmail = "admin@shopbandothethao.com";
            
            // Kiểm tra xem admin đã tồn tại chưa
            if (!context.NguoiDung.Any(u => u.Email == adminEmail))
            {
                var adminUser = new NguoiDung
                {
                    Email = adminEmail,
                    SoDienThoai = "0123456789",
                    MatKhauHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    Ho = "Quản",
                    Ten = "Trị Viên",
                    VaiTro = "QuanTriVien",
                    DaXacThucEmail = true,
                    DaXacThucSoDienThoai = true,
                    DangHoatDong = true,
                    NgayTao = DateTime.UtcNow
                };

                context.NguoiDung.Add(adminUser);
                context.SaveChanges();
            }
        }
    }
}

