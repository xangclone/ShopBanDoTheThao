using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopBanDoTheThao.Server.Data;
using ShopBanDoTheThao.Server.Helpers;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace ShopBanDoTheThao.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DanhGiaController : ControllerBase
    {
        private readonly ShopBanDoTheThaoDbContext _context;

        public DanhGiaController(ShopBanDoTheThaoDbContext context)
        {
            _context = context;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out int userId) ? userId : 0;
        }

        [HttpPost]
        public async Task<IActionResult> TaoDanhGia([FromBody] TaoDanhGiaRequest request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest(new { message = "Dữ liệu không hợp lệ" });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Dữ liệu không hợp lệ", errors = ModelState });
                }

                var userId = GetUserId();
                if (userId == 0)
                {
                    return Unauthorized(new { message = "Người dùng không hợp lệ" });
                }

                // Kiểm tra sản phẩm tồn tại
                var sanPham = await _context.SanPham
                    .FirstOrDefaultAsync(p => p.Id == request.SanPhamId && p.DangHoatDong);

                if (sanPham == null)
                {
                    return NotFound(new { message = "Sản phẩm không tồn tại" });
                }

                // Kiểm tra đã mua sản phẩm này chưa (đơn hàng đã giao thành công)
                var daMua = await _context.DonHangChiTiet
                    .Include(d => d.DonHang)
                    .AnyAsync(d => d.SanPhamId == request.SanPhamId &&
                                  d.DonHang.NguoiDungId == userId &&
                                  d.DonHang.TrangThai == "DaGiao");

                if (!daMua)
                {
                    return BadRequest(new { message = "Bạn cần mua và nhận được sản phẩm trước khi đánh giá" });
                }

                // Kiểm tra đã đánh giá chưa
                var daDanhGia = await _context.DanhGiaSanPham
                    .AnyAsync(d => d.SanPhamId == request.SanPhamId && d.NguoiDungId == userId);

                if (daDanhGia)
                {
                    return BadRequest(new { message = "Bạn đã đánh giá sản phẩm này rồi" });
                }

                // Tạo đánh giá
                var danhGia = new Models.DanhGiaSanPham
                {
                    SanPhamId = request.SanPhamId,
                    NguoiDungId = userId,
                    SoSao = request.SoSao,
                    NoiDung = request.NoiDung,
                    DaXacNhanMua = true,
                    HienThi = true,
                    NgayTao = DateTimeHelper.ToUtcTime(DateTimeHelper.GetVietnamTime())
                };

                _context.DanhGiaSanPham.Add(danhGia);
                await _context.SaveChangesAsync(); // Save đánh giá trước

                // Cập nhật điểm đánh giá trung bình của sản phẩm
                var danhGias = await _context.DanhGiaSanPham
                    .Where(d => d.SanPhamId == request.SanPhamId && d.HienThi)
                    .ToListAsync();

                if (danhGias != null && danhGias.Any())
                {
                    sanPham.DiemDanhGiaTrungBinh = danhGias.Average(d => (double)d.SoSao);
                    sanPham.SoLuongDanhGia = danhGias.Count;
                }
                else
                {
                    sanPham.DiemDanhGiaTrungBinh = 0;
                    sanPham.SoLuongDanhGia = 0;
                }

                await _context.SaveChangesAsync(); // Save cập nhật sản phẩm

                return Ok(new { message = "Đánh giá thành công", id = danhGia.Id });
            }
            catch (Exception ex)
            {
                // Log chi tiết lỗi để debug
                var errorDetails = new
                {
                    message = "Lỗi khi tạo đánh giá",
                    error = ex.Message,
                    innerException = ex.InnerException?.Message,
                    stackTrace = ex.StackTrace
                };
                return StatusCode(500, errorDetails);
            }
        }

        [HttpGet("sanpham/{sanPhamId}")]
        public async Task<IActionResult> GetDanhGiaBySanPham(int sanPhamId)
        {
            try
            {
                var danhGias = await _context.DanhGiaSanPham
                    .Include(d => d.NguoiDung)
                    .Where(d => d.SanPhamId == sanPhamId && d.HienThi)
                    .OrderByDescending(d => d.NgayTao)
                    .Select(d => new
                    {
                        d.Id,
                        d.SoSao,
                        d.NoiDung,
                        d.NgayTao,
                        d.SoLuongThich,
                        NguoiDung = new
                        {
                            d.NguoiDung.Ho,
                            d.NguoiDung.Ten
                        }
                    })
                    .ToListAsync();

                return Ok(danhGias);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải đánh giá: {ex.Message}" });
            }
        }
    }

    public class TaoDanhGiaRequest
    {
        [Required]
        public int SanPhamId { get; set; }

        [Required]
        [Range(1, 5)]
        public int SoSao { get; set; }

        [MaxLength(1000)]
        public string? NoiDung { get; set; }
    }
}

