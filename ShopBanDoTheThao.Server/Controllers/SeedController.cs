using Microsoft.AspNetCore.Mvc;
using ShopBanDoTheThao.Server.Data;

namespace ShopBanDoTheThao.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeedController : ControllerBase
    {
        private readonly ShopBanDoTheThaoDbContext _context;

        public SeedController(ShopBanDoTheThaoDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult SeedData()
        {
            try
            {
                DbInitializer.Initialize(_context);
                // Luôn đảm bảo có admin user
                DbInitializer.SeedAdminUser(_context);
                return Ok(new { message = "Dữ liệu mẫu đã được tạo thành công!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Lỗi khi tạo dữ liệu: {ex.Message}", stackTrace = ex.StackTrace });
            }
        }

        [HttpPost("admin")]
        public IActionResult SeedAdmin()
        {
            try
            {
                DbInitializer.SeedAdminUser(_context);
                return Ok(new { message = "Tài khoản admin đã được tạo thành công!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Lỗi khi tạo admin: {ex.Message}" });
            }
        }

        [HttpGet("check")]
        public IActionResult CheckData()
        {
            try
            {
                var danhMucCount = _context.DanhMuc.Count();
                var thuongHieuCount = _context.ThuongHieu.Count();
                var sanPhamCount = _context.SanPham.Count();
                
                return Ok(new 
                { 
                    danhMuc = danhMucCount,
                    thuongHieu = thuongHieuCount,
                    sanPham = sanPhamCount,
                    hasData = danhMucCount > 0
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi kiểm tra dữ liệu: {ex.Message}" });
            }
        }
    }
}

