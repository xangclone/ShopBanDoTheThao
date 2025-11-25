using Microsoft.EntityFrameworkCore;
using ShopBanDoTheThao.Server.Data;
using ShopBanDoTheThao.Server.Models;

namespace ShopBanDoTheThao.Server.Helpers
{
    public static class ThongBaoHelper
    {
        // Tạo thông báo tự động khi đơn hàng thay đổi trạng thái
        public static async Task TaoThongBaoDonHang(
            ShopBanDoTheThaoDbContext context,
            int donHangId,
            int nguoiDungId,
            string trangThaiCu,
            string trangThaiMoi)
        {
            var donHang = await context.DonHang
                .FirstOrDefaultAsync(d => d.Id == donHangId);

            if (donHang == null) return;

            string tieuDe = "";
            string noiDung = "";

            switch (trangThaiMoi)
            {
                case "DaXacNhan":
                    tieuDe = "Đơn hàng đã được xác nhận";
                    noiDung = $"Đơn hàng #{donHang.MaDonHang} của bạn đã được xác nhận. Chúng tôi đang chuẩn bị hàng để giao cho bạn.";
                    break;
                case "DangGiao":
                    tieuDe = "Đơn hàng đang được giao";
                    noiDung = $"Đơn hàng #{donHang.MaDonHang} đang được vận chuyển đến bạn. Bạn có thể theo dõi đơn hàng trong trang quản lý đơn hàng.";
                    break;
                case "DaGiao":
                    tieuDe = "Đơn hàng đã được giao";
                    noiDung = $"Đơn hàng #{donHang.MaDonHang} đã được giao thành công. Cảm ơn bạn đã mua sắm tại cửa hàng chúng tôi!";
                    break;
                case "DaHuy":
                    tieuDe = "Đơn hàng đã bị hủy";
                    noiDung = $"Đơn hàng #{donHang.MaDonHang} đã bị hủy. Nếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi.";
                    break;
                case "HoanTra":
                    tieuDe = "Yêu cầu hoàn trả đã được xử lý";
                    noiDung = $"Yêu cầu hoàn trả cho đơn hàng #{donHang.MaDonHang} đã được xử lý. Chúng tôi sẽ liên hệ với bạn sớm nhất.";
                    break;
            }

            if (!string.IsNullOrEmpty(tieuDe))
            {
                var thongBao = new ThongBao
                {
                    NguoiDungId = nguoiDungId,
                    TieuDe = tieuDe,
                    NoiDung = noiDung,
                    Loai = "DonHang",
                    LienKet = $"/don-hang/{donHangId}",
                    DonHangId = donHangId,
                    NgayTao = DateTimeHelper.GetVietnamTime()
                };

                context.ThongBao.Add(thongBao);
                await context.SaveChangesAsync();
            }
        }

        // Tạo thông báo deal hot
        public static async Task TaoThongBaoDealHot(
            ShopBanDoTheThaoDbContext context,
            int sanPhamId,
            string tieuDe,
            string noiDung)
        {
            // Lấy tất cả người dùng đang hoạt động
            var nguoiDung = await context.NguoiDung
                .Where(u => u.DangHoatDong && u.VaiTro == "KhachHang")
                .ToListAsync();

            var thongBaoList = nguoiDung.Select(u => new ThongBao
            {
                NguoiDungId = u.Id,
                TieuDe = tieuDe,
                NoiDung = noiDung,
                Loai = "DealHot",
                LienKet = $"/san-pham/{sanPhamId}",
                SanPhamId = sanPhamId,
                NgayTao = DateTimeHelper.GetVietnamTime()
            }).ToList();

            context.ThongBao.AddRange(thongBaoList);
            await context.SaveChangesAsync();
        }
    }
}

