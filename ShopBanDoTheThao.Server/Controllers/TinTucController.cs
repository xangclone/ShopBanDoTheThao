using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopBanDoTheThao.Server.Data;

namespace ShopBanDoTheThao.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TinTucController : ControllerBase
    {
        private readonly ShopBanDoTheThaoDbContext _context;

        public TinTucController(ShopBanDoTheThaoDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetTinTuc(
            [FromQuery] string? loai,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var query = _context.TinTuc
                    .Where(t => t.DangHoatDong);

                if (!string.IsNullOrEmpty(loai))
                {
                    query = query.Where(t => t.Loai == loai);
                }

                var totalCount = await query.CountAsync();
                var tinTuc = await query
                    .OrderByDescending(t => t.NgayDang ?? t.NgayTao)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(t => new
                    {
                        t.Id,
                        t.TieuDe,
                        t.TomTat,
                        t.HinhAnh,
                        t.Slug,
                        t.Loai,
                        t.SoLuotXem,
                        t.NoiBat,
                        NgayDang = t.NgayDang ?? t.NgayTao
                    })
                    .ToListAsync();

                return Ok(new
                {
                    Data = tinTuc,
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải tin tức: {ex.Message}" });
            }
        }

        [HttpGet("noibat")]
        public async Task<IActionResult> GetTinTucNoiBat([FromQuery] int limit = 6)
        {
            try
            {
                var tinTuc = await _context.TinTuc
                    .Where(t => t.DangHoatDong && t.NoiBat)
                    .OrderByDescending(t => t.NgayDang ?? t.NgayTao)
                    .Take(limit)
                    .Select(t => new
                    {
                        t.Id,
                        t.TieuDe,
                        t.TomTat,
                        t.HinhAnh,
                        t.Slug,
                        t.Loai,
                        t.SoLuotXem,
                        NgayDang = t.NgayDang ?? t.NgayTao
                    })
                    .ToListAsync();

                return Ok(tinTuc);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải tin tức nổi bật: {ex.Message}" });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTinTucById(int id)
        {
            try
            {
                var tinTuc = await _context.TinTuc
                    .Where(t => t.Id == id && t.DangHoatDong)
                    .Select(t => new
                    {
                        t.Id,
                        t.TieuDe,
                        t.TomTat,
                        t.NoiDung,
                        t.HinhAnh,
                        t.Slug,
                        t.Loai,
                        t.SoLuotXem,
                        t.NoiBat,
                        NgayDang = t.NgayDang ?? t.NgayTao
                    })
                    .FirstOrDefaultAsync();

                if (tinTuc == null)
                {
                    return NotFound();
                }

                // Tăng số lượt xem
                var entity = await _context.TinTuc.FindAsync(id);
                if (entity != null)
                {
                    entity.SoLuotXem++;
                    await _context.SaveChangesAsync();
                }

                return Ok(tinTuc);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải tin tức: {ex.Message}" });
            }
        }
    }
}

