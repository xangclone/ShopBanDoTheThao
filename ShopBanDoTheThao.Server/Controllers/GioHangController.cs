using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopBanDoTheThao.Server.Data;
using System.Security.Claims;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace ShopBanDoTheThao.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class GioHangController : ControllerBase
    {
        private readonly ShopBanDoTheThaoDbContext _context;

        public GioHangController(ShopBanDoTheThaoDbContext context)
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
        public async Task<IActionResult> GetGioHang()
        {
            try
            {
                var userId = GetUserId();
                var gioHangItems = await _context.GioHangItem
                    .Include(g => g.SanPham)
                    .Where(g => g.NguoiDungId == userId)
                    .ToListAsync();

                var gioHang = new List<object>();
                foreach (var item in gioHangItems)
                {
                    // Tìm biến thể để lấy số lượng tồn kho chính xác
                    int soLuongTon = item.SanPham.SoLuongTon;
                    if (!string.IsNullOrEmpty(item.KichThuoc) || !string.IsNullOrEmpty(item.MauSac))
                    {
                        var bienThe = await _context.SanPhamBienThe
                            .FirstOrDefaultAsync(b => b.SanPhamId == item.SanPhamId &&
                                                      (b.KichThuoc == item.KichThuoc || (b.KichThuoc == null && item.KichThuoc == null)) &&
                                                      (b.MauSac == item.MauSac || (b.MauSac == null && item.MauSac == null)) &&
                                                      b.DangHoatDong);
                        if (bienThe != null)
                        {
                            soLuongTon = bienThe.SoLuongTon;
                        }
                    }

                    gioHang.Add(new
                    {
                        item.Id,
                        item.SoLuong,
                        item.KichThuoc,
                        item.MauSac,
                        item.NgayThem,
                        SanPham = new
                        {
                            item.SanPham.Id,
                            item.SanPham.Ten,
                            item.SanPham.Gia,
                            item.SanPham.GiaGoc,
                            item.SanPham.HinhAnhChinh,
                            item.SanPham.Slug,
                            SoLuongTon = soLuongTon
                        }
                    });
                }

                return Ok(gioHang);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải giỏ hàng: {ex.Message}" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> ThemVaoGioHang([FromBody] ThemVaoGioHangRequest request)
        {
            try
            {
                // Kiểm tra request null
                if (request == null)
                {
                    return BadRequest(new { message = "Request body không được để trống" });
                }

                // Chuẩn hóa dữ liệu trước khi validate
                if (request.KichThuoc != null && string.IsNullOrWhiteSpace(request.KichThuoc))
                {
                    request.KichThuoc = null;
                }
                if (request.MauSac != null && string.IsNullOrWhiteSpace(request.MauSac))
                {
                    request.MauSac = null;
                }

                if (!ModelState.IsValid)
                {
                    var errors = ModelState
                        .Where(x => x.Value?.Errors.Count > 0)
                        .Select(x => new { field = x.Key, errors = x.Value?.Errors.Select(e => e.ErrorMessage) })
                        .ToList();
                    return BadRequest(new { message = "Dữ liệu không hợp lệ", errors });
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

                // Chuẩn hóa KichThuoc và MauSac để so sánh (null hoặc empty string đều được coi là null)
                var kichThuoc = string.IsNullOrWhiteSpace(request.KichThuoc) ? null : request.KichThuoc.Trim();
                var mauSac = string.IsNullOrWhiteSpace(request.MauSac) ? null : request.MauSac.Trim();

                // Tìm biến thể sản phẩm CHỈ KHI có size hoặc màu được chỉ định
                // Nếu cả hai đều null, sử dụng sản phẩm chính (không cần biến thể)
                Models.SanPhamBienThe? bienThe = null;
                if (!string.IsNullOrEmpty(kichThuoc) || !string.IsNullOrEmpty(mauSac))
                {
                    // Chỉ tìm biến thể khi có ít nhất một trong hai giá trị
                    bienThe = await _context.SanPhamBienThe
                        .FirstOrDefaultAsync(b => b.SanPhamId == request.SanPhamId &&
                                                  b.DangHoatDong &&
                                                  (string.IsNullOrEmpty(kichThuoc) || b.KichThuoc == kichThuoc) &&
                                                  (string.IsNullOrEmpty(mauSac) || b.MauSac == mauSac));
                    
                    if (bienThe == null)
                    {
                        return BadRequest(new { message = $"Biến thể sản phẩm với kích thước '{kichThuoc ?? "N/A"}' và màu sắc '{mauSac ?? "N/A"}' không tồn tại hoặc đã ngừng bán" });
                    }
                }

                // Kiểm tra số lượng tồn kho (của biến thể hoặc sản phẩm chính)
                int soLuongTonKiemTra = bienThe != null ? bienThe.SoLuongTon : sanPham.SoLuongTon;
                if (soLuongTonKiemTra < request.SoLuong)
                {
                    return BadRequest(new { message = $"Số lượng sản phẩm không đủ. Chỉ còn {soLuongTonKiemTra} sản phẩm" });
                }

                // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
                var gioHangItem = await _context.GioHangItem
                    .FirstOrDefaultAsync(g => g.NguoiDungId == userId && 
                                             g.SanPhamId == request.SanPhamId &&
                                             (g.KichThuoc == kichThuoc || (g.KichThuoc == null && kichThuoc == null)) &&
                                             (g.MauSac == mauSac || (g.MauSac == null && mauSac == null)));

                if (gioHangItem != null)
                {
                    var soLuongMoi = gioHangItem.SoLuong + request.SoLuong;
                    // Kiểm tra lại số lượng tồn kho sau khi cộng
                    if (soLuongTonKiemTra < soLuongMoi)
                    {
                        return BadRequest(new { message = $"Số lượng sản phẩm không đủ. Chỉ còn {soLuongTonKiemTra} sản phẩm" });
                    }
                    gioHangItem.SoLuong = soLuongMoi;
                }
                else
                {
                    gioHangItem = new Models.GioHangItem
                    {
                        NguoiDungId = userId,
                        SanPhamId = request.SanPhamId,
                        SoLuong = request.SoLuong,
                        KichThuoc = kichThuoc,
                        MauSac = mauSac,
                        NgayThem = DateTime.UtcNow
                    };
                    _context.GioHangItem.Add(gioHangItem);
                }

                await _context.SaveChangesAsync();

                // Load lại với sản phẩm để trả về
                await _context.Entry(gioHangItem)
                    .Reference(g => g.SanPham)
                    .LoadAsync();

                var result = new
                {
                    gioHangItem.Id,
                    gioHangItem.SoLuong,
                    gioHangItem.KichThuoc,
                    gioHangItem.MauSac,
                    gioHangItem.NgayThem,
                    SanPham = new
                    {
                        gioHangItem.SanPham.Id,
                        gioHangItem.SanPham.Ten,
                        gioHangItem.SanPham.Gia,
                        gioHangItem.SanPham.GiaGoc,
                        gioHangItem.SanPham.HinhAnhChinh,
                        gioHangItem.SanPham.Slug
                    }
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                // Log chi tiết lỗi để debug
                var errorDetails = new
                {
                    message = $"Lỗi khi thêm vào giỏ hàng: {ex.Message}",
                    innerException = ex.InnerException?.Message,
                    stackTrace = ex.StackTrace
                };
                return StatusCode(500, errorDetails);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> CapNhatGioHang(int id, [FromBody] CapNhatGioHangRequest request)
        {
            try
            {
                var userId = GetUserId();
                
                if (userId == 0)
                {
                    return Unauthorized(new { message = "Người dùng không hợp lệ" });
                }

                if (request.SoLuong <= 0)
                {
                    return BadRequest(new { message = "Số lượng phải lớn hơn 0" });
                }

                var gioHangItem = await _context.GioHangItem
                    .FirstOrDefaultAsync(g => g.Id == id && g.NguoiDungId == userId);

                if (gioHangItem == null)
                {
                    return NotFound(new { message = "Sản phẩm không tồn tại trong giỏ hàng" });
                }

                // Kiểm tra sản phẩm còn hoạt động không
                var sanPham = await _context.SanPham
                    .FirstOrDefaultAsync(p => p.Id == gioHangItem.SanPhamId && p.DangHoatDong);

                if (sanPham == null)
                {
                    return BadRequest(new { message = "Sản phẩm không còn hoạt động" });
                }

                // Chuẩn hóa KichThuoc và MauSac
                var kichThuoc = string.IsNullOrWhiteSpace(gioHangItem.KichThuoc) ? null : gioHangItem.KichThuoc.Trim();
                var mauSac = string.IsNullOrWhiteSpace(gioHangItem.MauSac) ? null : gioHangItem.MauSac.Trim();

                // Tìm biến thể sản phẩm nếu có size/màu
                Models.SanPhamBienThe? bienThe = null;
                if (!string.IsNullOrEmpty(kichThuoc) || !string.IsNullOrEmpty(mauSac))
                {
                    bienThe = await _context.SanPhamBienThe
                        .FirstOrDefaultAsync(b => b.SanPhamId == gioHangItem.SanPhamId &&
                                                  (b.KichThuoc == kichThuoc || (b.KichThuoc == null && kichThuoc == null)) &&
                                                  (b.MauSac == mauSac || (b.MauSac == null && mauSac == null)) &&
                                                  b.DangHoatDong);
                    
                    if (bienThe == null)
                    {
                        return BadRequest(new { message = "Biến thể sản phẩm không tồn tại hoặc đã ngừng bán" });
                    }
                }

                // Kiểm tra số lượng tồn kho (của biến thể hoặc sản phẩm chính)
                int soLuongTonKiemTra = bienThe != null ? bienThe.SoLuongTon : sanPham.SoLuongTon;
                
                if (soLuongTonKiemTra < request.SoLuong)
                {
                    return BadRequest(new { message = $"Số lượng sản phẩm không đủ. Chỉ còn {soLuongTonKiemTra} sản phẩm" });
                }

                gioHangItem.SoLuong = request.SoLuong;
                await _context.SaveChangesAsync();

                // Load lại với sản phẩm để trả về
                await _context.Entry(gioHangItem)
                    .Reference(g => g.SanPham)
                    .LoadAsync();

                var result = new
                {
                    gioHangItem.Id,
                    gioHangItem.SoLuong,
                    gioHangItem.KichThuoc,
                    gioHangItem.MauSac,
                    gioHangItem.NgayThem,
                    SanPham = new
                    {
                        gioHangItem.SanPham.Id,
                        gioHangItem.SanPham.Ten,
                        gioHangItem.SanPham.Gia,
                        gioHangItem.SanPham.GiaGoc,
                        gioHangItem.SanPham.HinhAnhChinh,
                        gioHangItem.SanPham.Slug
                    }
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi cập nhật giỏ hàng: {ex.Message}", stackTrace = ex.StackTrace });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> XoaKhoiGioHang(int id)
        {
            var userId = GetUserId();
            var gioHangItem = await _context.GioHangItem
                .FirstOrDefaultAsync(g => g.Id == id && g.NguoiDungId == userId);

            if (gioHangItem == null)
            {
                return NotFound();
            }

            _context.GioHangItem.Remove(gioHangItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("xoa-tat-ca")]
        public async Task<IActionResult> XoaTatCaGioHang()
        {
            var userId = GetUserId();
            var gioHangItems = await _context.GioHangItem
                .Where(g => g.NguoiDungId == userId)
                .ToListAsync();

            _context.GioHangItem.RemoveRange(gioHangItems);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class ThemVaoGioHangRequest
    {
        [Required(ErrorMessage = "SanPhamId là bắt buộc")]
        public int SanPhamId { get; set; }
        
        [Required(ErrorMessage = "SoLuong là bắt buộc")]
        [Range(1, int.MaxValue, ErrorMessage = "Số lượng phải lớn hơn 0")]
        public int SoLuong { get; set; } = 1;
        
        [MaxLength(50)]
        public string? KichThuoc { get; set; }
        
        [MaxLength(50)]
        public string? MauSac { get; set; }
    }

    public class CapNhatGioHangRequest
    {
        public int SoLuong { get; set; }
    }
}

