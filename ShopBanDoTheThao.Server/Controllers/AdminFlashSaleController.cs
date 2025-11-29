using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopBanDoTheThao.Server.Data;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace ShopBanDoTheThao.Server.Controllers
{
    [ApiController]
    [Route("api/admin/flashsale")]
    [Authorize]
    public class AdminFlashSaleController : ControllerBase
    {
        private readonly ShopBanDoTheThaoDbContext _context;

        public AdminFlashSaleController(ShopBanDoTheThaoDbContext context)
        {
            _context = context;
        }

        private async Task<bool> IsAdminAsync()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                return false;

            var user = await _context.NguoiDung.FindAsync(userId);
            return user != null && user.VaiTro == "QuanTriVien";
        }

        // Lấy danh sách tất cả flash sale (admin)
        [HttpGet]
        public async Task<IActionResult> GetDanhSachFlashSale()
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var flashSalesData = await _context.FlashSale
                    .Include(fs => fs.DanhSachSanPham)
                    .OrderByDescending(fs => fs.ThoiGianBatDau)
                    .ToListAsync();

                var flashSales = flashSalesData.Select(fs => new
                {
                    fs.Id,
                    fs.Ten,
                    fs.MoTa,
                    fs.HinhAnh,
                    fs.ThoiGianBatDau,
                    fs.ThoiGianKetThuc,
                    fs.DangHoatDong,
                    fs.UuTien,
                    SoLuongSanPham = fs.DanhSachSanPham.Count,
                    TrangThai = GetTrangThai(fs.ThoiGianBatDau, fs.ThoiGianKetThuc, fs.DangHoatDong),
                    fs.NgayTao,
                    fs.NgayCapNhat
                }).ToList();

                return Ok(flashSales);
            }
            catch (Exception ex)
            {
                // Log chi tiết lỗi để debug
                var errorMessage = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, new { 
                    message = $"Lỗi khi lấy danh sách flash sale: {errorMessage}",
                    detail = ex.Message,
                    stackTrace = ex.StackTrace
                });
            }
        }

        // Lấy chi tiết flash sale (admin)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFlashSaleById(int id)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var flashSale = await _context.FlashSale
                    .Include(fs => fs.DanhSachSanPham)
                        .ThenInclude(fsp => fsp.SanPham)
                    .FirstOrDefaultAsync(fs => fs.Id == id);

                if (flashSale == null)
                {
                    return NotFound(new { message = "Flash sale không tồn tại" });
                }

                var result = new
                {
                    flashSale.Id,
                    flashSale.Ten,
                    flashSale.MoTa,
                    flashSale.HinhAnh,
                    flashSale.ThoiGianBatDau,
                    flashSale.ThoiGianKetThuc,
                    flashSale.DangHoatDong,
                    flashSale.UuTien,
                    DanhSachSanPham = flashSale.DanhSachSanPham.Select(fsp => new
                    {
                        fsp.Id,
                        SanPhamId = fsp.SanPham.Id,
                        TenSanPham = fsp.SanPham.Ten,
                        HinhAnhChinh = fsp.SanPham.HinhAnhChinh,
                        GiaGoc = fsp.SanPham.Gia,
                        SoLuongTon = fsp.SanPham.SoLuongTon,
                        fsp.GiaFlashSale,
                        fsp.SoLuongToiDa,
                        fsp.SoLuongDaBan,
                        fsp.UuTien,
                        fsp.DangHoatDong,
                        PhanTramGiam = fsp.SanPham.Gia > 0 ?
                            (int)(((fsp.SanPham.Gia - fsp.GiaFlashSale) / fsp.SanPham.Gia) * 100) : 0
                    }).ToList()
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi lấy chi tiết flash sale: {ex.Message}" });
            }
        }

        // Tạo flash sale mới
        [HttpPost]
        public async Task<IActionResult> TaoFlashSale([FromBody] TaoFlashSaleRequest request)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                if (request.ThoiGianKetThuc <= request.ThoiGianBatDau)
                {
                    return BadRequest(new { message = "Thời gian kết thúc phải sau thời gian bắt đầu" });
                }

                var flashSale = new Models.FlashSale
                {
                    Ten = request.Ten,
                    MoTa = request.MoTa,
                    HinhAnh = request.HinhAnh,
                    ThoiGianBatDau = request.ThoiGianBatDau,
                    ThoiGianKetThuc = request.ThoiGianKetThuc,
                    DangHoatDong = request.DangHoatDong,
                    UuTien = request.UuTien,
                    NgayTao = DateTime.UtcNow
                };

                _context.FlashSale.Add(flashSale);
                await _context.SaveChangesAsync();

                // Thêm sản phẩm vào flash sale
                if (request.DanhSachSanPham != null && request.DanhSachSanPham.Any())
                {
                    foreach (var sp in request.DanhSachSanPham)
                    {
                        var sanPham = await _context.SanPham.FindAsync(sp.SanPhamId);
                        if (sanPham == null) continue;

                        var flashSaleSanPham = new Models.FlashSaleSanPham
                        {
                            FlashSaleId = flashSale.Id,
                            SanPhamId = sp.SanPhamId,
                            GiaFlashSale = sp.GiaFlashSale,
                            SoLuongToiDa = sp.SoLuongToiDa,
                            UuTien = sp.UuTien,
                            DangHoatDong = sp.DangHoatDong
                        };

                        _context.FlashSaleSanPham.Add(flashSaleSanPham);
                    }

                    await _context.SaveChangesAsync();
                }

                return Ok(new { message = "Tạo flash sale thành công", id = flashSale.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tạo flash sale: {ex.Message}" });
            }
        }

        // Cập nhật flash sale
        [HttpPut("{id}")]
        public async Task<IActionResult> CapNhatFlashSale(int id, [FromBody] CapNhatFlashSaleRequest request)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var flashSale = await _context.FlashSale.FindAsync(id);
                if (flashSale == null)
                {
                    return NotFound(new { message = "Flash sale không tồn tại" });
                }

                if (request.ThoiGianKetThuc <= request.ThoiGianBatDau)
                {
                    return BadRequest(new { message = "Thời gian kết thúc phải sau thời gian bắt đầu" });
                }

                flashSale.Ten = request.Ten;
                flashSale.MoTa = request.MoTa;
                flashSale.HinhAnh = request.HinhAnh;
                flashSale.ThoiGianBatDau = request.ThoiGianBatDau;
                flashSale.ThoiGianKetThuc = request.ThoiGianKetThuc;
                flashSale.DangHoatDong = request.DangHoatDong;
                flashSale.UuTien = request.UuTien;
                flashSale.NgayCapNhat = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Cập nhật flash sale thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi cập nhật flash sale: {ex.Message}" });
            }
        }

        // Xóa flash sale
        [HttpDelete("{id}")]
        public async Task<IActionResult> XoaFlashSale(int id)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var flashSale = await _context.FlashSale
                    .Include(fs => fs.DanhSachSanPham)
                    .FirstOrDefaultAsync(fs => fs.Id == id);

                if (flashSale == null)
                {
                    return NotFound(new { message = "Flash sale không tồn tại" });
                }

                _context.FlashSale.Remove(flashSale);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa flash sale thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi xóa flash sale: {ex.Message}" });
            }
        }

        // Thêm sản phẩm vào flash sale
        [HttpPost("{id}/sanpham")]
        public async Task<IActionResult> ThemSanPhamVaoFlashSale(int id, [FromBody] ThemSanPhamVaoFlashSaleRequest request)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var flashSale = await _context.FlashSale.FindAsync(id);
                if (flashSale == null)
                {
                    return NotFound(new { message = "Flash sale không tồn tại" });
                }

                var sanPham = await _context.SanPham.FindAsync(request.SanPhamId);
                if (sanPham == null)
                {
                    return NotFound(new { message = "Sản phẩm không tồn tại" });
                }

                // Kiểm tra sản phẩm đã có trong flash sale chưa
                var existing = await _context.FlashSaleSanPham
                    .FirstOrDefaultAsync(fsp => fsp.FlashSaleId == id && fsp.SanPhamId == request.SanPhamId);

                if (existing != null)
                {
                    return BadRequest(new { message = "Sản phẩm đã có trong flash sale này" });
                }

                var flashSaleSanPham = new Models.FlashSaleSanPham
                {
                    FlashSaleId = id,
                    SanPhamId = request.SanPhamId,
                    GiaFlashSale = request.GiaFlashSale,
                    SoLuongToiDa = request.SoLuongToiDa,
                    UuTien = request.UuTien,
                    DangHoatDong = request.DangHoatDong
                };

                _context.FlashSaleSanPham.Add(flashSaleSanPham);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Thêm sản phẩm vào flash sale thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi thêm sản phẩm: {ex.Message}" });
            }
        }

        // Cập nhật sản phẩm trong flash sale
        [HttpPut("{id}/sanpham/{sanPhamId}")]
        public async Task<IActionResult> CapNhatSanPhamTrongFlashSale(int id, int sanPhamId, [FromBody] CapNhatSanPhamFlashSaleRequest request)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                if (request == null || !ModelState.IsValid)
                {
                    return BadRequest(new { message = "Dữ liệu không hợp lệ", errors = ModelState });
                }

                var flashSaleSanPham = await _context.FlashSaleSanPham
                    .Include(fsp => fsp.SanPham)
                    .FirstOrDefaultAsync(fsp => fsp.FlashSaleId == id && fsp.SanPhamId == sanPhamId);

                if (flashSaleSanPham == null)
                {
                    return NotFound(new { message = "Sản phẩm không có trong flash sale này" });
                }

                // Kiểm tra giá flash sale phải nhỏ hơn giá gốc
                if (request.GiaFlashSale >= flashSaleSanPham.SanPham.Gia)
                {
                    return BadRequest(new { message = "Giá flash sale phải nhỏ hơn giá gốc của sản phẩm" });
                }

                if (request.GiaFlashSale <= 0)
                {
                    return BadRequest(new { message = "Giá flash sale phải lớn hơn 0" });
                }

                flashSaleSanPham.GiaFlashSale = request.GiaFlashSale;
                flashSaleSanPham.SoLuongToiDa = request.SoLuongToiDa;
                flashSaleSanPham.UuTien = request.UuTien;
                flashSaleSanPham.DangHoatDong = request.DangHoatDong;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Cập nhật sản phẩm thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi cập nhật sản phẩm: {ex.Message}" });
            }
        }

        // Xóa sản phẩm khỏi flash sale
        [HttpDelete("{id}/sanpham/{sanPhamId}")]
        public async Task<IActionResult> XoaSanPhamKhoiFlashSale(int id, int sanPhamId)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var flashSaleSanPham = await _context.FlashSaleSanPham
                    .FirstOrDefaultAsync(fsp => fsp.FlashSaleId == id && fsp.SanPhamId == sanPhamId);

                if (flashSaleSanPham == null)
                {
                    return NotFound(new { message = "Sản phẩm không có trong flash sale này" });
                }

                _context.FlashSaleSanPham.Remove(flashSaleSanPham);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa sản phẩm khỏi flash sale thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi xóa sản phẩm: {ex.Message}" });
            }
        }

        private string GetTrangThai(DateTime thoiGianBatDau, DateTime thoiGianKetThuc, bool dangHoatDong)
        {
            if (!dangHoatDong) return "Đã tắt";
            
            var now = DateTime.UtcNow;
            if (now < thoiGianBatDau) return "Sắp diễn ra";
            if (now >= thoiGianBatDau && now <= thoiGianKetThuc) return "Đang diễn ra";
            return "Đã kết thúc";
        }
    }

    // DTOs
    public class TaoFlashSaleRequest
    {
        [Required]
        [MaxLength(200)]
        public string Ten { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? MoTa { get; set; }

        [MaxLength(500)]
        public string? HinhAnh { get; set; }

        [Required]
        public DateTime ThoiGianBatDau { get; set; }

        [Required]
        public DateTime ThoiGianKetThuc { get; set; }

        public bool DangHoatDong { get; set; } = true;

        public int UuTien { get; set; } = 0;

        public List<FlashSaleSanPhamRequest>? DanhSachSanPham { get; set; }
    }

    public class CapNhatFlashSaleRequest
    {
        [Required]
        [MaxLength(200)]
        public string Ten { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? MoTa { get; set; }

        [MaxLength(500)]
        public string? HinhAnh { get; set; }

        [Required]
        public DateTime ThoiGianBatDau { get; set; }

        [Required]
        public DateTime ThoiGianKetThuc { get; set; }

        public bool DangHoatDong { get; set; } = true;

        public int UuTien { get; set; } = 0;
    }

    public class FlashSaleSanPhamRequest
    {
        [Required]
        public int SanPhamId { get; set; }

        [Required]
        public decimal GiaFlashSale { get; set; }

        public int SoLuongToiDa { get; set; } = 0;

        public int UuTien { get; set; } = 0;

        public bool DangHoatDong { get; set; } = true;
    }

    public class ThemSanPhamVaoFlashSaleRequest
    {
        [Required]
        public int SanPhamId { get; set; }

        [Required]
        public decimal GiaFlashSale { get; set; }

        public int SoLuongToiDa { get; set; } = 0;

        public int UuTien { get; set; } = 0;

        public bool DangHoatDong { get; set; } = true;
    }

    public class CapNhatSanPhamFlashSaleRequest
    {
        [Required]
        public decimal GiaFlashSale { get; set; }

        public int SoLuongToiDa { get; set; } = 0;

        public int UuTien { get; set; } = 0;

        public bool DangHoatDong { get; set; } = true;
    }
}

