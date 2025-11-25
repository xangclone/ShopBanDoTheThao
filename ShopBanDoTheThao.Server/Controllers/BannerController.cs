using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopBanDoTheThao.Server.Data;
using ShopBanDoTheThao.Server.Helpers;

namespace ShopBanDoTheThao.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BannerController : ControllerBase
    {
        private readonly ShopBanDoTheThaoDbContext _context;

        public BannerController(ShopBanDoTheThaoDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetBanner()
        {
            try
            {
                // Kiểm tra xem bảng Banner có tồn tại không
                if (!_context.Database.CanConnect())
                {
                    return Ok(new List<object>());
                }

                // Chuyển giờ VN sang UTC để so sánh với DB (DB lưu UTC)
                var nowVietnam = DateTimeHelper.GetVietnamTime();
                var nowUtc = DateTimeHelper.ToUtcTime(nowVietnam);
                var banners = await _context.Banner
                    .Where(b => b.DangHoatDong &&
                                b.NgayBatDau <= nowUtc &&
                                (b.NgayKetThuc == null || b.NgayKetThuc >= nowUtc))
                    .OrderBy(b => b.ThuTuHienThi)
                    .ThenByDescending(b => b.NgayTao)
                    .Select(b => new
                    {
                        b.Id,
                        b.TieuDe,
                        b.MoTa,
                        b.HinhAnh,
                        b.LienKet,
                        b.NutBam
                    })
                    .ToListAsync();

                return Ok(banners);
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateException dbEx)
            {
                // Bảng Banner có thể chưa tồn tại
                return Ok(new List<object>());
            }
            catch (Microsoft.Data.SqlClient.SqlException sqlEx)
            {
                // Lỗi SQL - có thể bảng chưa tồn tại
                return Ok(new List<object>());
            }
            catch (Exception ex)
            {
                // Log lỗi nhưng vẫn trả về danh sách rỗng để không làm crash frontend
                return Ok(new List<object>());
            }
        }
    }
}

