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
            string trangThaiMoi,
            string? lyDoHuy = null)
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
                    if (!string.IsNullOrEmpty(lyDoHuy))
                    {
                        noiDung = $"Đơn hàng #{donHang.MaDonHang} đã bị hủy.\n\nLý do: {lyDoHuy}\n\nNếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi.";
                    }
                    else
                    {
                        noiDung = $"Đơn hàng #{donHang.MaDonHang} đã bị hủy. Nếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi.";
                    }
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

        // Tạo thông báo deal hot - gửi đến toàn bộ khách hàng
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

        // Tạo thông báo voucher/khuyến mãi - gửi đến toàn bộ khách hàng
        public static async Task TaoThongBaoKhuyenMai(
            ShopBanDoTheThaoDbContext context,
            string tieuDe,
            string noiDung,
            string? lienKet = null)
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
                Loai = "KhuyenMai",
                LienKet = lienKet,
                NgayTao = DateTimeHelper.GetVietnamTime()
            }).ToList();

            context.ThongBao.AddRange(thongBaoList);
            await context.SaveChangesAsync();
        }

        // Tạo thông báo cảnh báo - gửi đến khách hàng cụ thể
        public static async Task TaoThongBaoCanhBao(
            ShopBanDoTheThaoDbContext context,
            List<int> nguoiDungIds,
            string tieuDe,
            string noiDung,
            string? lienKet = null)
        {
            if (nguoiDungIds == null || nguoiDungIds.Count == 0)
            {
                return;
            }

            // Kiểm tra người dùng có tồn tại và đang hoạt động
            var nguoiDung = await context.NguoiDung
                .Where(u => nguoiDungIds.Contains(u.Id) && u.DangHoatDong)
                .ToListAsync();

            var thongBaoList = nguoiDung.Select(u => new ThongBao
            {
                NguoiDungId = u.Id,
                TieuDe = tieuDe,
                NoiDung = noiDung,
                Loai = "CanhBao",
                LienKet = lienKet,
                NgayTao = DateTimeHelper.GetVietnamTime()
            }).ToList();

            context.ThongBao.AddRange(thongBaoList);
            await context.SaveChangesAsync();
        }

        // Tạo thông báo cho admin khi khách hàng hủy hoặc hoàn trả đơn hàng
        public static async Task TaoThongBaoAdminDonHang(
            ShopBanDoTheThaoDbContext context,
            int donHangId,
            string loaiThongBao, // "HuyDonHang" hoặc "HoanTra"
            string? lyDo = null)
        {
            var donHang = await context.DonHang
                .Include(d => d.NguoiDung)
                .FirstOrDefaultAsync(d => d.Id == donHangId);

            if (donHang == null) return;

            // Lấy tất cả admin đang hoạt động
            var admins = await context.NguoiDung
                .Where(u => u.DangHoatDong && u.VaiTro == "QuanTriVien")
                .ToListAsync();

            if (admins.Count == 0) return;

            string tieuDe = "";
            string noiDung = "";

            if (loaiThongBao == "HuyDonHang")
            {
                tieuDe = $"Khách hàng hủy đơn hàng #{donHang.MaDonHang}";
                if (!string.IsNullOrEmpty(lyDo))
                {
                    noiDung = $"Khách hàng {donHang.NguoiDung.Ho} {donHang.NguoiDung.Ten} đã hủy đơn hàng #{donHang.MaDonHang}.\n\nLý do: {lyDo}\n\nTổng tiền: {donHang.TongTien:N0} VNĐ";
                }
                else
                {
                    noiDung = $"Khách hàng {donHang.NguoiDung.Ho} {donHang.NguoiDung.Ten} đã hủy đơn hàng #{donHang.MaDonHang}.\n\nTổng tiền: {donHang.TongTien:N0} VNĐ";
                }
            }
            else if (loaiThongBao == "HoanTra")
            {
                tieuDe = $"Yêu cầu hoàn trả đơn hàng #{donHang.MaDonHang}";
                if (!string.IsNullOrEmpty(lyDo))
                {
                    noiDung = $"Khách hàng {donHang.NguoiDung.Ho} {donHang.NguoiDung.Ten} yêu cầu hoàn trả đơn hàng #{donHang.MaDonHang}.\n\nLý do: {lyDo}\n\nTổng tiền: {donHang.TongTien:N0} VNĐ";
                }
                else
                {
                    noiDung = $"Khách hàng {donHang.NguoiDung.Ho} {donHang.NguoiDung.Ten} yêu cầu hoàn trả đơn hàng #{donHang.MaDonHang}.\n\nTổng tiền: {donHang.TongTien:N0} VNĐ";
                }
            }

            if (!string.IsNullOrEmpty(tieuDe))
            {
                var thongBaoList = admins.Select(admin => new ThongBao
                {
                    NguoiDungId = admin.Id,
                    TieuDe = tieuDe,
                    NoiDung = noiDung,
                    Loai = "AdminDonHang",
                    LienKet = $"/admin/don-hang?maDonHang={donHang.MaDonHang}",
                    DonHangId = donHangId,
                    NgayTao = DateTimeHelper.GetVietnamTime()
                }).ToList();

                context.ThongBao.AddRange(thongBaoList);
                await context.SaveChangesAsync();
            }
        }
    }
}

