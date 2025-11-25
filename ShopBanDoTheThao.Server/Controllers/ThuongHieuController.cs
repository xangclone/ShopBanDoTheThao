using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopBanDoTheThao.Server.Data;

namespace ShopBanDoTheThao.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ThuongHieuController : ControllerBase
    {
        private readonly ShopBanDoTheThaoDbContext _context;

        public ThuongHieuController(ShopBanDoTheThaoDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetThuongHieu()
        {
            var thuongHieu = await _context.ThuongHieu
                .Where(t => t.DangHoatDong)
                .OrderBy(t => t.Ten)
                .Select(t => new
                {
                    t.Id,
                    t.Ten,
                    t.Logo,
                    t.Slug
                })
                .ToListAsync();

            return Ok(thuongHieu);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetThuongHieuById(int id)
        {
            var thuongHieu = await _context.ThuongHieu
                .FirstOrDefaultAsync(t => t.Id == id && t.DangHoatDong);

            if (thuongHieu == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                thuongHieu.Id,
                thuongHieu.Ten,
                thuongHieu.MoTa,
                thuongHieu.Logo,
                thuongHieu.Slug
            });
        }
    }
}


