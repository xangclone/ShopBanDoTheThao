using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopBanDoTheThao.Server.Data;

namespace ShopBanDoTheThao.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaiKhoanNganHangController : ControllerBase
    {
        private readonly ShopBanDoTheThaoDbContext _context;

        public TaiKhoanNganHangController(ShopBanDoTheThaoDbContext context)
        {
            _context = context;
        }

        // Lấy danh sách tài khoản ngân hàng đang hoạt động (public)
        [HttpGet("dang-hoat-dong")]
        public async Task<IActionResult> GetTaiKhoanNganHangDangHoatDong()
        {
            try
            {
                var taiKhoan = await _context.TaiKhoanNganHang
                    .Where(t => t.DangHoatDong)
                    .OrderBy(t => t.UuTien)
                    .ThenBy(t => t.TenNganHang)
                    .Select(t => new
                    {
                        t.Id,
                        t.TenNganHang,
                        t.SoTaiKhoan,
                        t.TenChuTaiKhoan,
                        t.ChiNhanh,
                        t.GhiChu
                    })
                    .ToListAsync();

                return Ok(taiKhoan);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi lấy danh sách tài khoản ngân hàng: {ex.Message}" });
            }
        }
    }
}
