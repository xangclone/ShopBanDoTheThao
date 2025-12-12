using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopBanDoTheThao.Server.Data;
using ShopBanDoTheThao.Server.DTOs;
using System.Security.Claims;

namespace ShopBanDoTheThao.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VoucherDoiDiemController : ControllerBase
    {
        private readonly ShopBanDoTheThaoDbContext _context;

        public VoucherDoiDiemController(ShopBanDoTheThaoDbContext context)
        {
            _context = context;
        }

        private int? GetUserId()
        {
            if (!User.Identity?.IsAuthenticated ?? true) return null;
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out int userId) ? userId : null;
        }

        // Lấy danh sách voucher có thể đổi (public)
        [HttpGet]
        public async Task<IActionResult> GetVoucherDoiDiem()
        {
            try
            {
                var userId = GetUserId();
                var user = userId.HasValue 
                    ? await _context.NguoiDung.FindAsync(userId.Value) 
                    : null;

                var diemKhaDung = user?.DiemKhaDung ?? 0;

                var vouchers = await _context.VoucherDoiDiem
                    .Where(v => v.DangHoatDong && 
                           v.NgayBatDau <= DateTime.UtcNow &&
                           (v.NgayKetThuc == null || v.NgayKetThuc >= DateTime.UtcNow) &&
                           (v.SoLuong == 0 || v.SoLuongDaDoi < v.SoLuong))
                    .OrderBy(v => v.ThuTuHienThi)
                    .ThenBy(v => v.SoDiemCanDoi)
                    .Select(v => new VoucherDoiDiemDTO
                    {
                        Id = v.Id,
                        Ten = v.Ten,
                        MoTa = v.MoTa,
                        HinhAnh = v.HinhAnh,
                        SoDiemCanDoi = v.SoDiemCanDoi,
                        LoaiVoucher = v.LoaiVoucher,
                        MaGiamGiaId = v.MaGiamGiaId,
                        LoaiGiamGia = v.LoaiGiamGia,
                        GiaTriGiamGia = v.GiaTriGiamGia,
                        GiaTriDonHangToiThieu = v.GiaTriDonHangToiThieu,
                        GiaTriGiamGiaToiDa = v.GiaTriGiamGiaToiDa,
                        SoLuong = v.SoLuong,
                        SoLuongDaDoi = v.SoLuongDaDoi,
                        NgayBatDau = v.NgayBatDau,
                        NgayKetThuc = v.NgayKetThuc,
                        DangHoatDong = v.DangHoatDong,
                        ThuTuHienThi = v.ThuTuHienThi,
                        CoTheDoi = diemKhaDung >= v.SoDiemCanDoi
                    })
                    .ToListAsync();

                return Ok(vouchers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi lấy danh sách voucher: {ex.Message}" });
            }
        }

        // Lấy chi tiết voucher
        [HttpGet("{id}")]
        public async Task<IActionResult> GetVoucherDoiDiemById(int id)
        {
            try
            {
                var userId = GetUserId();
                var user = userId.HasValue 
                    ? await _context.NguoiDung.FindAsync(userId.Value) 
                    : null;

                var diemKhaDung = user?.DiemKhaDung ?? 0;

                var voucher = await _context.VoucherDoiDiem
                    .FirstOrDefaultAsync(v => v.Id == id);

                if (voucher == null)
                {
                    return NotFound(new { message = "Voucher không tồn tại" });
                }

                var dto = new VoucherDoiDiemDTO
                {
                    Id = voucher.Id,
                    Ten = voucher.Ten,
                    MoTa = voucher.MoTa,
                    HinhAnh = voucher.HinhAnh,
                    SoDiemCanDoi = voucher.SoDiemCanDoi,
                    LoaiVoucher = voucher.LoaiVoucher,
                    MaGiamGiaId = voucher.MaGiamGiaId,
                    LoaiGiamGia = voucher.LoaiGiamGia,
                    GiaTriGiamGia = voucher.GiaTriGiamGia,
                    GiaTriDonHangToiThieu = voucher.GiaTriDonHangToiThieu,
                    GiaTriGiamGiaToiDa = voucher.GiaTriGiamGiaToiDa,
                    SoLuong = voucher.SoLuong,
                    SoLuongDaDoi = voucher.SoLuongDaDoi,
                    NgayBatDau = voucher.NgayBatDau,
                    NgayKetThuc = voucher.NgayKetThuc,
                    DangHoatDong = voucher.DangHoatDong,
                    ThuTuHienThi = voucher.ThuTuHienThi,
                    CoTheDoi = diemKhaDung >= voucher.SoDiemCanDoi
                };

                return Ok(dto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi lấy chi tiết voucher: {ex.Message}" });
            }
        }
    }
}








