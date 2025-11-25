using Microsoft.AspNetCore.Authorization;
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
    public class YeuThichController : ControllerBase
    {
        private readonly ShopBanDoTheThaoDbContext _context;

        public YeuThichController(ShopBanDoTheThaoDbContext context)
        {
            _context = context;
        }

        private int GetUserId()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return 0;
                }
                return userId;
            }
            catch
            {
                return 0;
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetYeuThich()
        {
            try
            {
                var userId = GetUserId();
                if (userId == 0)
                {
                    return Unauthorized(new { message = "Không xác định được người dùng" });
                }

                var yeuThichItems = await _context.YeuThichItem
                    .Include(y => y.SanPham)
                    .Where(y => y.NguoiDungId == userId && y.SanPham != null && y.SanPham.DangHoatDong)
                    .OrderByDescending(y => y.NgayThem)
                    .Select(y => new
                    {
                        y.Id,
                        y.NgayThem,
                        SanPham = new
                        {
                            y.SanPham.Id,
                            y.SanPham.Ten,
                            y.SanPham.Gia,
                            y.SanPham.GiaGoc,
                            y.SanPham.HinhAnhChinh,
                            y.SanPham.Slug,
                            y.SanPham.DangHoatDong,
                            y.SanPham.DangKhuyenMai,
                            y.SanPham.SanPhamNoiBat
                        }
                    })
                    .ToListAsync();

                return Ok(yeuThichItems);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải danh sách yêu thích: {ex.Message}" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> ThemVaoYeuThich([FromBody] ThemVaoYeuThichRequest request)
        {
            try
            {
                if (request == null || request.SanPhamId <= 0)
                {
                    return BadRequest(new { message = "Dữ liệu không hợp lệ" });
                }

                var userId = GetUserId();
                if (userId == 0)
                {
                    return Unauthorized(new { message = "Không xác định được người dùng" });
                }

                // Kiểm tra người dùng có tồn tại không
                var nguoiDung = await _context.NguoiDung.FindAsync(userId);
                if (nguoiDung == null)
                {
                    return Unauthorized(new { message = "Người dùng không tồn tại" });
                }

                // Kiểm tra sản phẩm có tồn tại không
                var sanPham = await _context.SanPham.FindAsync(request.SanPhamId);
                if (sanPham == null)
                {
                    return NotFound(new { message = "Sản phẩm không tồn tại" });
                }

                if (!sanPham.DangHoatDong)
                {
                    return BadRequest(new { message = "Sản phẩm không còn hoạt động" });
                }

                // Kiểm tra đã có trong yêu thích chưa
                var existing = await _context.YeuThichItem
                    .FirstOrDefaultAsync(y => y.NguoiDungId == userId && y.SanPhamId == request.SanPhamId);

                if (existing != null)
                {
                    return Ok(new { 
                        message = "Sản phẩm đã có trong danh sách yêu thích", 
                        data = new
                        {
                            existing.Id,
                            existing.NguoiDungId,
                            existing.SanPhamId,
                            existing.NgayThem
                        }
                    });
                }

                // Thêm vào yêu thích
                var yeuThichItem = new Models.YeuThichItem
                {
                    NguoiDungId = userId,
                    SanPhamId = request.SanPhamId,
                    NgayThem = DateTime.UtcNow
                };

                _context.YeuThichItem.Add(yeuThichItem);
                await _context.SaveChangesAsync();

                // Load lại với navigation properties để trả về đầy đủ
                var savedItem = await _context.YeuThichItem
                    .Include(y => y.SanPham)
                    .FirstOrDefaultAsync(y => y.Id == yeuThichItem.Id);

                if (savedItem == null)
                {
                    return StatusCode(500, new { message = "Không thể tải lại dữ liệu sau khi lưu" });
                }

                return Ok(new { 
                    message = "Đã thêm vào danh sách yêu thích", 
                    data = new
                    {
                        savedItem.Id,
                        savedItem.NguoiDungId,
                        savedItem.SanPhamId,
                        savedItem.NgayThem,
                        SanPham = savedItem.SanPham != null ? new
                        {
                            savedItem.SanPham.Id,
                            savedItem.SanPham.Ten,
                            savedItem.SanPham.Gia,
                            savedItem.SanPham.GiaGoc,
                            savedItem.SanPham.HinhAnhChinh,
                            savedItem.SanPham.Slug
                        } : null
                    }
                });
            }
            catch (DbUpdateException dbEx)
            {
                var innerMessage = dbEx.InnerException?.Message ?? dbEx.Message;
                return StatusCode(500, new { 
                    message = $"Lỗi database: {innerMessage}",
                    details = innerMessage.Contains("FOREIGN KEY") ? "Lỗi khóa ngoại - kiểm tra sản phẩm hoặc người dùng có tồn tại" :
                               innerMessage.Contains("PRIMARY KEY") ? "Lỗi khóa chính - có thể đã tồn tại" :
                               innerMessage
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    message = $"Lỗi khi thêm vào yêu thích: {ex.Message}",
                    type = ex.GetType().Name
                });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> XoaKhoiYeuThich(int id)
        {
            try
            {
                var userId = GetUserId();
                if (userId == 0)
                {
                    return Unauthorized(new { message = "Không xác định được người dùng" });
                }

                var yeuThichItem = await _context.YeuThichItem
                    .FirstOrDefaultAsync(y => y.Id == id && y.NguoiDungId == userId);

                if (yeuThichItem == null)
                {
                    return NotFound(new { message = "Không tìm thấy mục yêu thích" });
                }

                _context.YeuThichItem.Remove(yeuThichItem);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Đã xóa khỏi danh sách yêu thích" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi xóa khỏi yêu thích: {ex.Message}" });
            }
        }

        [HttpDelete("sanpham/{sanPhamId}")]
        public async Task<IActionResult> XoaKhoiYeuThichBySanPhamId(int sanPhamId)
        {
            try
            {
                var userId = GetUserId();
                if (userId == 0)
                {
                    return Unauthorized(new { message = "Không xác định được người dùng" });
                }

                var yeuThichItem = await _context.YeuThichItem
                    .FirstOrDefaultAsync(y => y.NguoiDungId == userId && y.SanPhamId == sanPhamId);

                if (yeuThichItem == null)
                {
                    return NotFound(new { message = "Không tìm thấy mục yêu thích" });
                }

                _context.YeuThichItem.Remove(yeuThichItem);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Đã xóa khỏi danh sách yêu thích" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi xóa khỏi yêu thích: {ex.Message}" });
            }
        }

        [HttpGet("kiemtra/{sanPhamId}")]
        public async Task<IActionResult> KiemTraYeuThich(int sanPhamId)
        {
            try
            {
                var userId = GetUserId();
                if (userId == 0)
                {
                    return Ok(new { isFavorite = false });
                }

                var exists = await _context.YeuThichItem
                    .AnyAsync(y => y.NguoiDungId == userId && y.SanPhamId == sanPhamId);

                return Ok(new { isFavorite = exists });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi kiểm tra yêu thích: {ex.Message}" });
            }
        }
    }

    public class ThemVaoYeuThichRequest
    {
        [Required]
        public int SanPhamId { get; set; }
    }
}

