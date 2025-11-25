using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopBanDoTheThao.Server.Data;

namespace ShopBanDoTheThao.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DanhMucController : ControllerBase
    {
        private readonly ShopBanDoTheThaoDbContext _context;

        public DanhMucController(ShopBanDoTheThaoDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDanhMuc()
        {
            var danhMuc = await _context.DanhMuc
                .Where(c => c.DangHoatDong)
                .Include(c => c.DanhMucCon.Where(sc => sc.DangHoatDong))
                .Where(c => c.DanhMucChaId == null)
                .OrderBy(c => c.ThuTuHienThi)
                .ToListAsync();

            return Ok(danhMuc);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDanhMucById(int id)
        {
            var danhMuc = await _context.DanhMuc
                .Include(c => c.DanhMucCha)
                .Include(c => c.DanhMucCon.Where(sc => sc.DangHoatDong))
                .FirstOrDefaultAsync(c => c.Id == id && c.DangHoatDong);

            if (danhMuc == null)
            {
                return NotFound();
            }

            return Ok(danhMuc);
        }
    }
}



