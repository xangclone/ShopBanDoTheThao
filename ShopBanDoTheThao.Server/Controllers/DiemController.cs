using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopBanDoTheThao.Server.Data;
using ShopBanDoTheThao.Server.DTOs;
using ShopBanDoTheThao.Server.Models;
using System.Security.Claims;

namespace ShopBanDoTheThao.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DiemController : ControllerBase
    {
        private readonly ShopBanDoTheThaoDbContext _context;

        public DiemController(ShopBanDoTheThaoDbContext context)
        {
            _context = context;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out int userId) ? userId : 0;
        }

        // Lấy thông tin điểm của user
        [HttpGet("thong-tin")]
        public async Task<IActionResult> GetThongTinDiem()
        {
            try
            {
                var userId = GetUserId();
                if (userId == 0)
                {
                    return Unauthorized(new { message = "Người dùng chưa đăng nhập" });
                }

                var user = await _context.NguoiDung
                    .Include(u => u.HangVip)
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    return NotFound(new { message = "Không tìm thấy người dùng" });
                }

                // Đảm bảo DiemKhaDung có giá trị mặc định nếu null
                if (user.DiemKhaDung < 0) user.DiemKhaDung = 0;
                if (user.DiemTichLuy < 0) user.DiemTichLuy = 0;

                // Tìm hạng VIP tiếp theo
                HangVip? hangVipTiepTheo = null;
                try
                {
                    hangVipTiepTheo = await _context.HangVip
                        .Where(h => h.DiemToiThieu > user.DiemTichLuy && h.DangHoatDong)
                        .OrderBy(h => h.DiemToiThieu)
                        .FirstOrDefaultAsync();
                }
                catch
                {
                    // Nếu bảng HangVip chưa tồn tại, bỏ qua
                }

                var diemConLai = hangVipTiepTheo != null 
                    ? hangVipTiepTheo.DiemToiThieu - user.DiemTichLuy 
                    : 0;

                var tiLeHoanThanh = 0m;
                if (hangVipTiepTheo != null && user.HangVip != null && hangVipTiepTheo.DiemToiThieu > 0)
                {
                    tiLeHoanThanh = (decimal)user.DiemTichLuy / hangVipTiepTheo.DiemToiThieu * 100;
                    if (tiLeHoanThanh > 100) tiLeHoanThanh = 100;
                }
                else if (user.HangVip != null)
                {
                    tiLeHoanThanh = 100; // Đã đạt hạng cao nhất
                }

                var thongTin = new ThongTinDiemDTO
                {
                    DiemTichLuy = user.DiemTichLuy,
                    DiemKhaDung = user.DiemKhaDung,
                    HangVip = user.HangVip != null ? new HangVipDTO
                    {
                        Id = user.HangVip.Id,
                        Ten = user.HangVip.Ten,
                        MoTa = user.HangVip.MoTa,
                        MauSac = user.HangVip.MauSac,
                        Icon = user.HangVip.Icon,
                        DiemToiThieu = user.HangVip.DiemToiThieu,
                        DiemToiDa = user.HangVip.DiemToiDa,
                        TiLeTichDiem = user.HangVip.TiLeTichDiem,
                        TiLeGiamGia = user.HangVip.TiLeGiamGia,
                        ThuTu = user.HangVip.ThuTu,
                        DangHoatDong = user.HangVip.DangHoatDong
                    } : null,
                    HangVipTiepTheo = hangVipTiepTheo != null ? new HangVipDTO
                    {
                        Id = hangVipTiepTheo.Id,
                        Ten = hangVipTiepTheo.Ten,
                        MoTa = hangVipTiepTheo.MoTa,
                        MauSac = hangVipTiepTheo.MauSac,
                        Icon = hangVipTiepTheo.Icon,
                        DiemToiThieu = hangVipTiepTheo.DiemToiThieu,
                        DiemToiDa = hangVipTiepTheo.DiemToiDa,
                        TiLeTichDiem = hangVipTiepTheo.TiLeTichDiem,
                        TiLeGiamGia = hangVipTiepTheo.TiLeGiamGia,
                        ThuTu = hangVipTiepTheo.ThuTu,
                        DangHoatDong = hangVipTiepTheo.DangHoatDong
                    } : null,
                    DiemConLai = diemConLai,
                    TiLeHoanThanh = tiLeHoanThanh
                };

                return Ok(thongTin);
            }
            catch (Exception ex)
            {
                // Log lỗi chi tiết để debug
                Console.WriteLine($"Error in GetThongTinDiem: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                }
                return StatusCode(500, new { message = $"Lỗi khi lấy thông tin điểm: {ex.Message}", details = ex.InnerException?.Message });
            }
        }

        // Lấy lịch sử điểm
        [HttpGet("lich-su")]
        public async Task<IActionResult> GetLichSuDiem([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var userId = GetUserId();
                var query = _context.LichSuDiem
                    .Where(l => l.NguoiDungId == userId)
                    .OrderByDescending(l => l.NgayTao);

                var total = await query.CountAsync();
                var lichSu = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(l => new LichSuDiemDTO
                    {
                        Id = l.Id,
                        NguoiDungId = l.NguoiDungId,
                        Loai = l.Loai,
                        MoTa = l.MoTa,
                        SoDiem = l.SoDiem,
                        DiemTruoc = l.DiemTruoc,
                        DiemSau = l.DiemSau,
                        DonHangId = l.DonHangId,
                        VoucherDoiDiemId = l.VoucherDoiDiemId,
                        MinigameId = l.MinigameId,
                        GhiChu = l.GhiChu,
                        NgayTao = l.NgayTao
                    })
                    .ToListAsync();

                return Ok(new
                {
                    data = lichSu,
                    total,
                    page,
                    pageSize,
                    totalPages = (int)Math.Ceiling(total / (double)pageSize)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi lấy lịch sử điểm: {ex.Message}" });
            }
        }

        // Đổi voucher bằng điểm
        [HttpPost("doi-voucher/{voucherId}")]
        public async Task<IActionResult> DoiVoucher(int voucherId)
        {
            try
            {
                var userId = GetUserId();
                var user = await _context.NguoiDung.FindAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "Không tìm thấy người dùng" });
                }

                var voucher = await _context.VoucherDoiDiem
                    .FirstOrDefaultAsync(v => v.Id == voucherId && v.DangHoatDong);

                if (voucher == null)
                {
                    return NotFound(new { message = "Voucher không tồn tại hoặc đã ngừng hoạt động" });
                }

                // Kiểm tra thời gian
                if (voucher.NgayBatDau > DateTime.UtcNow || 
                    (voucher.NgayKetThuc.HasValue && voucher.NgayKetThuc.Value < DateTime.UtcNow))
                {
                    return BadRequest(new { message = "Voucher chưa bắt đầu hoặc đã hết hạn" });
                }

                // Kiểm tra số lượng
                if (voucher.SoLuong > 0 && voucher.SoLuongDaDoi >= voucher.SoLuong)
                {
                    return BadRequest(new { message = "Voucher đã hết" });
                }

                // Kiểm tra điểm
                if (user.DiemKhaDung < voucher.SoDiemCanDoi)
                {
                    return BadRequest(new { message = $"Bạn cần {voucher.SoDiemCanDoi} điểm để đổi voucher này. Bạn hiện có {user.DiemKhaDung} điểm." });
                }

                // Trừ điểm
                var diemTruoc = user.DiemKhaDung;
                user.DiemKhaDung -= voucher.SoDiemCanDoi;
                var diemSau = user.DiemKhaDung;

                // Tạo mã giảm giá nếu voucher liên kết với MaGiamGia
                string maGiamGia = string.Empty;
                if (voucher.MaGiamGiaId.HasValue)
                {
                    var maGiamGiaGoc = await _context.MaGiamGia.FindAsync(voucher.MaGiamGiaId.Value);
                    if (maGiamGiaGoc != null)
                    {
                        maGiamGia = maGiamGiaGoc.Ma;
                    }
                }
                else if (!string.IsNullOrEmpty(voucher.LoaiGiamGia) && voucher.GiaTriGiamGia.HasValue)
                {
                    // Tạo mã giảm giá mới
                    var maGiamGiaMoi = new Models.MaGiamGia
                    {
                        Ma = $"VOUCHER{userId}{DateTime.UtcNow.Ticks}",
                        MoTa = voucher.MoTa ?? $"Voucher đổi từ điểm: {voucher.Ten}",
                        LoaiGiamGia = voucher.LoaiGiamGia,
                        GiaTriGiamGia = voucher.GiaTriGiamGia.Value,
                        GiaTriDonHangToiThieu = voucher.GiaTriDonHangToiThieu,
                        GiaTriGiamGiaToiDa = voucher.GiaTriGiamGiaToiDa,
                        SoLuongSuDung = 1, // Chỉ dùng 1 lần
                        SoLuongDaSuDung = 0,
                        NgayBatDau = DateTime.UtcNow,
                        NgayKetThuc = voucher.NgayKetThuc ?? DateTime.UtcNow.AddMonths(3),
                        DangHoatDong = true
                    };
                    _context.MaGiamGia.Add(maGiamGiaMoi);
                    await _context.SaveChangesAsync();
                    maGiamGia = maGiamGiaMoi.Ma;
                }

                // Ghi lịch sử
                var lichSu = new Models.LichSuDiem
                {
                    NguoiDungId = userId,
                    Loai = "DoiVoucher",
                    MoTa = $"Đổi voucher: {voucher.Ten}",
                    SoDiem = -voucher.SoDiemCanDoi,
                    DiemTruoc = diemTruoc,
                    DiemSau = diemSau,
                    VoucherDoiDiemId = voucherId,
                    GhiChu = !string.IsNullOrEmpty(maGiamGia) ? $"Mã giảm giá: {maGiamGia}" : null
                };
                _context.LichSuDiem.Add(lichSu);

                // Cập nhật số lượng đã đổi
                voucher.SoLuongDaDoi++;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Đổi voucher thành công!",
                    maGiamGia = !string.IsNullOrEmpty(maGiamGia) ? maGiamGia : null,
                    diemKhaDung = user.DiemKhaDung
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi đổi voucher: {ex.Message}" });
            }
        }
    }
}

