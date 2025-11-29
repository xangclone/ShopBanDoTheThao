using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopBanDoTheThao.Server.Data;
using ShopBanDoTheThao.Server.Helpers;

namespace ShopBanDoTheThao.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PopupController : ControllerBase
    {
        private readonly ShopBanDoTheThaoDbContext _context;

        public PopupController(ShopBanDoTheThaoDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetPopup()
        {
            try
            {
                // Kiểm tra xem bảng Popup có tồn tại không
                if (!_context.Database.CanConnect())
                {
                    return Ok(new List<object>());
                }

                // Chuyển giờ VN sang UTC để so sánh với DB (DB lưu UTC)
                var nowVietnam = DateTimeHelper.GetVietnamTime();
                var nowUtc = DateTimeHelper.ToUtcTime(nowVietnam);
                var popups = await _context.Popup
                    .Where(p => p.DangHoatDong &&
                                p.NgayBatDau <= nowUtc &&
                                (p.NgayKetThuc == null || p.NgayKetThuc >= nowUtc))
                    .OrderBy(p => p.ThuTuHienThi)
                    .ThenByDescending(p => p.NgayTao)
                    .Select(p => new
                    {
                        p.Id,
                        p.TieuDe,
                        p.NoiDung,
                        p.HinhAnh,
                        p.LienKet,
                        p.NutBam,
                        p.LoaiPopup,
                        p.HienThiMotLan
                    })
                    .ToListAsync();

                return Ok(popups);
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateException)
            {
                // Bảng Popup có thể chưa tồn tại
                return Ok(new List<object>());
            }
            catch (Microsoft.Data.SqlClient.SqlException)
            {
                // Lỗi SQL - có thể bảng chưa tồn tại
                return Ok(new List<object>());
            }
            catch (Exception)
            {
                // Log lỗi nhưng vẫn trả về danh sách rỗng để không làm crash frontend
                return Ok(new List<object>());
            }
        }
    }
}





