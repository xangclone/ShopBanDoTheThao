using Microsoft.EntityFrameworkCore;
using ShopBanDoTheThao.Server.Data;
using ShopBanDoTheThao.Server.Models;

namespace ShopBanDoTheThao.Server.Helpers
{
    public static class DiemHelper
    {
        // Tích điểm khi thanh toán thành công
        public static async Task TichDiemKhiThanhToan(ShopBanDoTheThaoDbContext context, int donHangId)
        {
            try
            {
                var donHang = await context.DonHang
                    .Include(d => d.NguoiDung)
                    .ThenInclude(u => u.HangVip)
                    .FirstOrDefaultAsync(d => d.Id == donHangId);

                if (donHang == null || donHang.NguoiDung == null)
                {
                    return;
                }

                // Chỉ tích điểm khi thanh toán thành công và chưa tích điểm
                if (donHang.TrangThaiThanhToan != "DaThanhToan")
                {
                    return;
                }

                // Kiểm tra xem đã tích điểm cho đơn hàng này chưa
                var daTichDiem = await context.LichSuDiem
                    .AnyAsync(l => l.DonHangId == donHangId && l.Loai == "TichDiem");

                if (daTichDiem)
                {
                    return; // Đã tích điểm rồi
                }

                var user = donHang.NguoiDung;
                var tiLeTichDiem = user.HangVip?.TiLeTichDiem ?? 1.0m;

                // Tính điểm: 1% giá trị đơn hàng (sau giảm giá) * tỷ lệ hạng VIP
                // Giá trị đơn hàng để tích điểm = Tổng tiền sản phẩm - Giảm giá (không bao gồm phí vận chuyển và thuế)
                var giaTriTichDiem = donHang.TongTienSanPham - donHang.GiamGia;
                
                // Đảm bảo giá trị tích điểm không âm
                if (giaTriTichDiem < 0)
                {
                    giaTriTichDiem = 0;
                }
                
                // Tính điểm: 1% giá trị * tỷ lệ hạng VIP, làm tròn xuống
                var diemNhanDuoc = (int)Math.Floor(giaTriTichDiem * 0.01m * tiLeTichDiem);

                // Tích điểm (ít nhất 0 điểm, nhưng vẫn ghi lịch sử)
                // Nếu đơn hàng quá nhỏ, vẫn tích ít nhất 1 điểm để khuyến khích
                if (diemNhanDuoc == 0 && giaTriTichDiem > 0)
                {
                    diemNhanDuoc = 1; // Tích tối thiểu 1 điểm cho đơn hàng thành công
                }
                
                if (diemNhanDuoc >= 0)
                {
                    var diemTruoc = user.DiemKhaDung;
                    user.DiemKhaDung += diemNhanDuoc;
                    user.DiemTichLuy += diemNhanDuoc;
                    var diemSau = user.DiemKhaDung;

                    // Ghi lịch sử
                    var lichSu = new LichSuDiem
                    {
                        NguoiDungId = user.Id,
                        Loai = "TichDiem",
                        MoTa = $"Tích điểm từ đơn hàng {donHang.MaDonHang}",
                        SoDiem = diemNhanDuoc,
                        DiemTruoc = diemTruoc,
                        DiemSau = diemSau,
                        DonHangId = donHangId,
                        GhiChu = $"Tỷ lệ tích điểm: {tiLeTichDiem}x, Giá trị: {giaTriTichDiem:N0}đ"
                    };
                    context.LichSuDiem.Add(lichSu);

                    // Cập nhật hạng VIP
                    await CapNhatHangVip(context, user);

                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                // Log lỗi nhưng không throw để không ảnh hưởng đến luồng xử lý chính
                // Có thể thêm logging ở đây nếu cần
                System.Diagnostics.Debug.WriteLine($"Lỗi khi tích điểm cho đơn hàng {donHangId}: {ex.Message}");
            }
        }

        // Cập nhật hạng VIP dựa trên điểm tích lũy
        public static async Task CapNhatHangVip(ShopBanDoTheThaoDbContext context, NguoiDung user)
        {
            var hangVipMoi = await context.HangVip
                .Where(h => h.DangHoatDong &&
                       h.DiemToiThieu <= user.DiemTichLuy &&
                       (h.DiemToiDa == int.MaxValue || h.DiemToiDa >= user.DiemTichLuy))
                .OrderByDescending(h => h.DiemToiThieu)
                .FirstOrDefaultAsync();

            if (hangVipMoi != null && user.HangVipId != hangVipMoi.Id)
            {
                var hangVipCu = user.HangVipId.HasValue
                    ? await context.HangVip.FindAsync(user.HangVipId.Value)
                    : null;

                user.HangVipId = hangVipMoi.Id;

                // Ghi lịch sử nếu lên hạng
                if (hangVipCu == null || hangVipCu.DiemToiThieu < hangVipMoi.DiemToiThieu)
                {
                    var lichSu = new LichSuDiem
                    {
                        NguoiDungId = user.Id,
                        Loai = "Thuong",
                        MoTa = $"Lên hạng VIP: {hangVipMoi.Ten}",
                        SoDiem = 0,
                        DiemTruoc = user.DiemKhaDung,
                        DiemSau = user.DiemKhaDung,
                        GhiChu = $"Chúc mừng bạn đã lên hạng {hangVipMoi.Ten}!"
                    };
                    context.LichSuDiem.Add(lichSu);
                }
            }
        }

        // Tích điểm cho các hành động khác (đánh giá, v.v.)
        public static async Task TichDiem(ShopBanDoTheThaoDbContext context, int nguoiDungId, int soDiem, string loai, string moTa, int? donHangId = null, int? minigameId = null, string? ghiChu = null)
        {
            var user = await context.NguoiDung
                .Include(u => u.HangVip)
                .FirstOrDefaultAsync(u => u.Id == nguoiDungId);

            if (user == null)
            {
                return;
            }

            var diemTruoc = user.DiemKhaDung;
            user.DiemKhaDung += soDiem;
            user.DiemTichLuy += soDiem;
            var diemSau = user.DiemKhaDung;

            // Ghi lịch sử
            var lichSu = new LichSuDiem
            {
                NguoiDungId = nguoiDungId,
                Loai = loai,
                MoTa = moTa,
                SoDiem = soDiem,
                DiemTruoc = diemTruoc,
                DiemSau = diemSau,
                DonHangId = donHangId,
                MinigameId = minigameId,
                GhiChu = ghiChu
            };
            context.LichSuDiem.Add(lichSu);

            // Cập nhật hạng VIP
            await CapNhatHangVip(context, user);

            await context.SaveChangesAsync();
        }
    }
}

