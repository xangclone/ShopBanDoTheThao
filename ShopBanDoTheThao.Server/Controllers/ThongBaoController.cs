using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopBanDoTheThao.Server.Data;
using ShopBanDoTheThao.Server.Helpers;
using System.Security.Claims;

namespace ShopBanDoTheThao.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ThongBaoController : ControllerBase
    {
        private readonly ShopBanDoTheThaoDbContext _context;

        public ThongBaoController(ShopBanDoTheThaoDbContext context)
        {
            _context = context;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim ?? "0");
        }

        // Lấy danh sách thông báo của user
        [HttpGet]
        public async Task<IActionResult> GetThongBao([FromQuery] bool? chuaDoc = null)
        {
            try
            {
                var userId = GetUserId();
                var query = _context.ThongBao
                    .Where(t => t.NguoiDungId == userId && t.DangHoatDong)
                    .OrderByDescending(t => t.NgayTao);

                if (chuaDoc.HasValue && chuaDoc.Value)
                {
                    query = (IOrderedQueryable<Models.ThongBao>)query.Where(t => !t.DaDoc);
                }

                var thongBao = await query
                    .Select(t => new
                    {
                        t.Id,
                        t.TieuDe,
                        t.NoiDung,
                        t.Loai,
                        t.LienKet,
                        t.DaDoc,
                        t.NgayTao,
                        DonHangId = t.DonHangId,
                        SanPhamId = t.SanPhamId
                    })
                    .ToListAsync();

                return Ok(thongBao);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải thông báo: {ex.Message}" });
            }
        }

        // Đếm số thông báo chưa đọc
        [HttpGet("chua-doc/count")]
        public async Task<IActionResult> GetSoLuongChuaDoc()
        {
            try
            {
                var userId = GetUserId();
                var count = await _context.ThongBao
                    .CountAsync(t => t.NguoiDungId == userId && !t.DaDoc && t.DangHoatDong);

                return Ok(new { count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi đếm thông báo: {ex.Message}" });
            }
        }

        // Đánh dấu đã đọc
        [HttpPut("{id}/danh-dau-da-doc")]
        public async Task<IActionResult> DanhDauDaDoc(int id)
        {
            try
            {
                var userId = GetUserId();
                var thongBao = await _context.ThongBao
                    .FirstOrDefaultAsync(t => t.Id == id && t.NguoiDungId == userId);

                if (thongBao == null)
                {
                    return NotFound(new { message = "Không tìm thấy thông báo" });
                }

                thongBao.DaDoc = true;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Đã đánh dấu đã đọc" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi đánh dấu đã đọc: {ex.Message}" });
            }
        }

        // Đánh dấu tất cả đã đọc
        [HttpPut("danh-dau-tat-ca-da-doc")]
        public async Task<IActionResult> DanhDauTatCaDaDoc()
        {
            try
            {
                var userId = GetUserId();
                var thongBao = await _context.ThongBao
                    .Where(t => t.NguoiDungId == userId && !t.DaDoc && t.DangHoatDong)
                    .ToListAsync();

                foreach (var tb in thongBao)
                {
                    tb.DaDoc = true;
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "Đã đánh dấu tất cả đã đọc" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi đánh dấu đã đọc: {ex.Message}" });
            }
        }

        // Xóa thông báo
        [HttpDelete("{id}")]
        public async Task<IActionResult> XoaThongBao(int id)
        {
            try
            {
                var userId = GetUserId();
                var thongBao = await _context.ThongBao
                    .FirstOrDefaultAsync(t => t.Id == id && t.NguoiDungId == userId);

                if (thongBao == null)
                {
                    return NotFound(new { message = "Không tìm thấy thông báo" });
                }

                thongBao.DangHoatDong = false;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Đã xóa thông báo" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi xóa thông báo: {ex.Message}" });
            }
        }
    }
}


