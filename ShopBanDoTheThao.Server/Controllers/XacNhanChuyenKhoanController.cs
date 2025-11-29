using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopBanDoTheThao.Server.Data;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace ShopBanDoTheThao.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class XacNhanChuyenKhoanController : ControllerBase
    {
        private readonly ShopBanDoTheThaoDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public XacNhanChuyenKhoanController(ShopBanDoTheThaoDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim ?? "0");
        }

        // Tạo xác nhận chuyển khoản
        [HttpPost]
        public async Task<IActionResult> TaoXacNhanChuyenKhoan([FromForm] TaoXacNhanChuyenKhoanRequest request)
        {
            try
            {
                var userId = GetUserId();
                if (userId == 0)
                {
                    return Unauthorized(new { message = "Người dùng không hợp lệ" });
                }

                // Kiểm tra đơn hàng
                var donHang = await _context.DonHang
                    .FirstOrDefaultAsync(d => d.Id == request.DonHangId && d.NguoiDungId == userId);

                if (donHang == null)
                {
                    return NotFound(new { message = "Không tìm thấy đơn hàng" });
                }

                // Kiểm tra tài khoản ngân hàng
                var taiKhoanNganHang = await _context.TaiKhoanNganHang
                    .FirstOrDefaultAsync(t => t.Id == request.TaiKhoanNganHangId && t.DangHoatDong);

                if (taiKhoanNganHang == null)
                {
                    return BadRequest(new { message = "Tài khoản ngân hàng không hợp lệ" });
                }

                // Kiểm tra đã có xác nhận chưa
                var existing = await _context.XacNhanChuyenKhoan
                    .FirstOrDefaultAsync(x => x.DonHangId == request.DonHangId && x.TrangThai == "ChoXacNhan");

                if (existing != null)
                {
                    return BadRequest(new { message = "Đơn hàng này đã có xác nhận chuyển khoản đang chờ xử lý" });
                }

                // Xử lý upload ảnh
                string? hinhAnhChungTu = null;
                if (request.HinhAnhChungTu != null && request.HinhAnhChungTu.Length > 0)
                {
                    var uploadsFolder = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", "chung-tu-chuyen-khoan");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    var fileName = $"{donHang.MaDonHang}_{DateTime.UtcNow:yyyyMMddHHmmss}_{Path.GetFileName(request.HinhAnhChungTu.FileName)}";
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await request.HinhAnhChungTu.CopyToAsync(stream);
                    }

                    hinhAnhChungTu = $"/uploads/chung-tu-chuyen-khoan/{fileName}";
                }

                var xacNhan = new Models.XacNhanChuyenKhoan
                {
                    DonHangId = request.DonHangId,
                    NguoiDungId = userId,
                    TaiKhoanNganHangId = request.TaiKhoanNganHangId,
                    SoTaiKhoanGui = request.SoTaiKhoanGui,
                    TenNguoiGui = request.TenNguoiGui,
                    SoTien = request.SoTien,
                    NoiDungChuyenKhoan = request.NoiDungChuyenKhoan,
                    HinhAnhChungTu = hinhAnhChungTu,
                    TrangThai = "ChoXacNhan",
                    GhiChu = request.GhiChu,
                    NgayTao = DateTime.UtcNow
                };

                _context.XacNhanChuyenKhoan.Add(xacNhan);
                await _context.SaveChangesAsync();

                return Ok(new { 
                    message = "Đã gửi xác nhận chuyển khoản thành công",
                    id = xacNhan.Id 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tạo xác nhận chuyển khoản: {ex.Message}" });
            }
        }

        // Lấy danh sách xác nhận chuyển khoản của user
        [HttpGet("don-hang/{donHangId}")]
        public async Task<IActionResult> GetXacNhanChuyenKhoanByDonHang(int donHangId)
        {
            try
            {
                var userId = GetUserId();
                if (userId == 0)
                {
                    return Unauthorized(new { message = "Người dùng không hợp lệ" });
                }

                var xacNhan = await _context.XacNhanChuyenKhoan
                    .Include(x => x.TaiKhoanNganHang)
                    .Where(x => x.DonHangId == donHangId && x.NguoiDungId == userId)
                    .OrderByDescending(x => x.NgayTao)
                    .Select(x => new
                    {
                        x.Id,
                        x.SoTaiKhoanGui,
                        x.TenNguoiGui,
                        x.SoTien,
                        x.NoiDungChuyenKhoan,
                        x.HinhAnhChungTu,
                        x.TrangThai,
                        x.GhiChu,
                        x.NgayTao,
                        x.NgayXacNhan,
                        TaiKhoanNganHang = new
                        {
                            x.TaiKhoanNganHang.TenNganHang,
                            x.TaiKhoanNganHang.SoTaiKhoan,
                            x.TaiKhoanNganHang.TenChuTaiKhoan
                        }
                    })
                    .FirstOrDefaultAsync();

                if (xacNhan == null)
                {
                    return Ok(null);
                }

                return Ok(xacNhan);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi lấy xác nhận chuyển khoản: {ex.Message}" });
            }
        }
    }

    public class TaoXacNhanChuyenKhoanRequest
    {
        [Required]
        public int DonHangId { get; set; }

        [Required]
        public int TaiKhoanNganHangId { get; set; }

        [Required]
        [MaxLength(200)]
        public string SoTaiKhoanGui { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string TenNguoiGui { get; set; } = string.Empty;

        [Required]
        public decimal SoTien { get; set; }

        [MaxLength(500)]
        public string? NoiDungChuyenKhoan { get; set; }

        public IFormFile? HinhAnhChungTu { get; set; }

        [MaxLength(1000)]
        public string? GhiChu { get; set; }
    }
}
