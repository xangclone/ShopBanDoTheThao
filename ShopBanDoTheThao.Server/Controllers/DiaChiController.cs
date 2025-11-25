using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopBanDoTheThao.Server.Data;
using System.Security.Claims;

namespace ShopBanDoTheThao.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DiaChiController : ControllerBase
    {
        private readonly ShopBanDoTheThaoDbContext _context;

        public DiaChiController(ShopBanDoTheThaoDbContext context)
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
        public async Task<IActionResult> GetDanhSachDiaChi()
        {
            try
            {
                var userId = GetUserId();
                if (userId == 0)
                {
                    return Unauthorized();
                }

                var diaChi = await _context.DiaChi
                    .Where(d => d.NguoiDungId == userId)
                    .OrderByDescending(d => d.MacDinh)
                    .ThenByDescending(d => d.NgayTao)
                    .ToListAsync();

                return Ok(diaChi);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải danh sách địa chỉ: {ex.Message}" });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDiaChiById(int id)
        {
            try
            {
                var userId = GetUserId();
                var diaChi = await _context.DiaChi
                    .FirstOrDefaultAsync(d => d.Id == id && d.NguoiDungId == userId);

                if (diaChi == null)
                {
                    return NotFound();
                }

                return Ok(diaChi);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải địa chỉ: {ex.Message}" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> ThemDiaChi([FromBody] ThemDiaChiRequest request)
        {
            try
            {
                var userId = GetUserId();
                if (userId == 0)
                {
                    return Unauthorized(new { message = "Người dùng không hợp lệ" });
                }

                // Validation
                if (string.IsNullOrWhiteSpace(request.DuongPho))
                {
                    return BadRequest(new { message = "Đường phố là bắt buộc" });
                }

                if (string.IsNullOrWhiteSpace(request.ThanhPho))
                {
                    return BadRequest(new { message = "Tỉnh/Thành phố là bắt buộc" });
                }

                if (string.IsNullOrWhiteSpace(request.TenNguoiNhan))
                {
                    return BadRequest(new { message = "Tên người nhận là bắt buộc" });
                }

                if (string.IsNullOrWhiteSpace(request.SoDienThoaiNhan))
                {
                    return BadRequest(new { message = "Số điện thoại là bắt buộc" });
                }

                // Nếu đặt làm mặc định, bỏ mặc định của các địa chỉ khác
                if (request.MacDinh)
                {
                    var diaChiMacDinh = await _context.DiaChi
                        .Where(d => d.NguoiDungId == userId && d.MacDinh)
                        .ToListAsync();
                    
                    foreach (var dc in diaChiMacDinh)
                    {
                        dc.MacDinh = false;
                    }
                }

                var diaChi = new Models.DiaChi
                {
                    NguoiDungId = userId,
                    DuongPho = request.DuongPho.Trim(),
                    PhuongXa = string.IsNullOrWhiteSpace(request.PhuongXa) ? null : request.PhuongXa.Trim(),
                    QuanHuyen = string.IsNullOrWhiteSpace(request.QuanHuyen) ? null : request.QuanHuyen.Trim(),
                    ThanhPho = request.ThanhPho.Trim(),
                    MaBuuChinh = string.IsNullOrWhiteSpace(request.MaBuuChinh) ? null : request.MaBuuChinh.Trim(),
                    QuocGia = request.QuocGia ?? "Vietnam",
                    TenNguoiNhan = request.TenNguoiNhan.Trim(),
                    SoDienThoaiNhan = request.SoDienThoaiNhan.Trim(),
                    LoaiDiaChi = request.LoaiDiaChi ?? "NhaRieng",
                    MacDinh = request.MacDinh,
                    NgayTao = DateTime.UtcNow
                };

                _context.DiaChi.Add(diaChi);
                await _context.SaveChangesAsync();

                return Ok(diaChi);
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new { message = $"Lỗi database khi thêm địa chỉ: {ex.InnerException?.Message ?? ex.Message}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi thêm địa chỉ: {ex.Message}", stackTrace = ex.StackTrace });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> CapNhatDiaChi(int id, [FromBody] CapNhatDiaChiRequest request)
        {
            try
            {
                var userId = GetUserId();
                var diaChi = await _context.DiaChi
                    .FirstOrDefaultAsync(d => d.Id == id && d.NguoiDungId == userId);

                if (diaChi == null)
                {
                    return NotFound();
                }

                // Nếu đặt làm mặc định, bỏ mặc định của các địa chỉ khác
                if (request.MacDinh == true && !diaChi.MacDinh)
                {
                    var diaChiMacDinh = await _context.DiaChi
                        .Where(d => d.NguoiDungId == userId && d.MacDinh && d.Id != id)
                        .ToListAsync();
                    
                    foreach (var dc in diaChiMacDinh)
                    {
                        dc.MacDinh = false;
                    }
                }

                diaChi.DuongPho = request.DuongPho ?? diaChi.DuongPho;
                diaChi.PhuongXa = request.PhuongXa;
                diaChi.QuanHuyen = request.QuanHuyen ?? diaChi.QuanHuyen;
                diaChi.ThanhPho = request.ThanhPho ?? diaChi.ThanhPho;
                diaChi.MaBuuChinh = request.MaBuuChinh;
                diaChi.TenNguoiNhan = request.TenNguoiNhan ?? diaChi.TenNguoiNhan;
                diaChi.SoDienThoaiNhan = request.SoDienThoaiNhan ?? diaChi.SoDienThoaiNhan;
                diaChi.LoaiDiaChi = request.LoaiDiaChi ?? diaChi.LoaiDiaChi;
                if (request.MacDinh.HasValue)
                {
                    diaChi.MacDinh = request.MacDinh.Value;
                }

                await _context.SaveChangesAsync();

                return Ok(diaChi);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi cập nhật địa chỉ: {ex.Message}" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> XoaDiaChi(int id)
        {
            try
            {
                var userId = GetUserId();
                var diaChi = await _context.DiaChi
                    .FirstOrDefaultAsync(d => d.Id == id && d.NguoiDungId == userId);

                if (diaChi == null)
                {
                    return NotFound();
                }

                _context.DiaChi.Remove(diaChi);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi xóa địa chỉ: {ex.Message}" });
            }
        }

        [HttpPut("{id}/macdinh")]
        public async Task<IActionResult> DatMacDinh(int id)
        {
            try
            {
                var userId = GetUserId();
                var diaChi = await _context.DiaChi
                    .FirstOrDefaultAsync(d => d.Id == id && d.NguoiDungId == userId);

                if (diaChi == null)
                {
                    return NotFound();
                }

                // Bỏ mặc định của các địa chỉ khác
                var diaChiMacDinh = await _context.DiaChi
                    .Where(d => d.NguoiDungId == userId && d.MacDinh)
                    .ToListAsync();
                
                foreach (var dc in diaChiMacDinh)
                {
                    dc.MacDinh = false;
                }

                diaChi.MacDinh = true;
                await _context.SaveChangesAsync();

                return Ok(diaChi);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi đặt địa chỉ mặc định: {ex.Message}" });
            }
        }
    }

    public class ThemDiaChiRequest
    {
        public string TenNguoiNhan { get; set; } = string.Empty;
        public string SoDienThoaiNhan { get; set; } = string.Empty;
        public string DuongPho { get; set; } = string.Empty;
        public string? PhuongXa { get; set; }
        public string? QuanHuyen { get; set; }
        public string ThanhPho { get; set; } = string.Empty;
        public string? MaBuuChinh { get; set; }
        public string? QuocGia { get; set; }
        public string LoaiDiaChi { get; set; } = "NhaRieng";
        public bool MacDinh { get; set; } = false;
    }

    public class CapNhatDiaChiRequest
    {
        public string? TenNguoiNhan { get; set; }
        public string? SoDienThoaiNhan { get; set; }
        public string? DuongPho { get; set; }
        public string? PhuongXa { get; set; }
        public string? QuanHuyen { get; set; }
        public string? ThanhPho { get; set; }
        public string? MaBuuChinh { get; set; }
        public string? LoaiDiaChi { get; set; }
        public bool? MacDinh { get; set; }
    }
}

