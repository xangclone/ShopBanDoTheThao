using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopBanDoTheThao.Server.Data;
using ShopBanDoTheThao.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace ShopBanDoTheThao.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TinNhanController : ControllerBase
    {
        private readonly ShopBanDoTheThaoDbContext _context;

        public TinNhanController(ShopBanDoTheThaoDbContext context)
        {
            _context = context;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                throw new UnauthorizedAccessException("Không thể xác định người dùng");
            }
            return userId;
        }

        private async Task<bool> IsAdminAsync()
        {
            var userId = GetUserId();
            if (userId == 0) return false;
            
            var user = await _context.NguoiDung.FindAsync(userId);
            return user != null && user.VaiTro == "QuanTriVien";
        }

        // Lấy danh sách tin nhắn của người dùng hiện tại
        [HttpGet("cua-toi")]
        [Authorize]
        public async Task<IActionResult> GetTinNhanCuaToi()
        {
            try
            {
                var userId = GetUserId();
                var tinNhans = await _context.TinNhan
                    .Where(t => t.NguoiDungId == userId)
                    .OrderBy(t => t.NgayGui)
                    .Select(t => new
                    {
                        t.Id,
                        t.NoiDung,
                        t.Loai,
                        t.DaDoc,
                        t.NgayGui,
                        t.SanPhamId,
                        SanPham = t.SanPham != null ? new
                        {
                            t.SanPham.Id,
                            t.SanPham.Ten,
                            t.SanPham.HinhAnhChinh,
                            t.SanPham.Gia,
                            t.SanPham.Slug
                        } : null,
                        NguoiPhanHoi = t.NguoiPhanHoi != null ? new
                        {
                            t.NguoiPhanHoi.Id,
                            HoTen = $"{t.NguoiPhanHoi.Ho} {t.NguoiPhanHoi.Ten}".Trim(),
                            t.NguoiPhanHoi.Email
                        } : null
                    })
                    .ToListAsync();

                return Ok(tinNhans);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải tin nhắn: {ex.Message}" });
            }
        }

        // Gửi tin nhắn (từ khách hàng)
        [HttpPost("gui")]
        [Authorize]
        public async Task<IActionResult> GuiTinNhan([FromBody] GuiTinNhanRequest request)
        {
            try
            {
                var userId = GetUserId();
                var tinNhan = new TinNhan
                {
                    NguoiDungId = userId,
                    NoiDung = request.NoiDung,
                    Loai = request.Loai ?? "User",
                    SanPhamId = request.SanPhamId,
                    NgayGui = DateTime.UtcNow,
                    DaDoc = false
                };

                _context.TinNhan.Add(tinNhan);
                await _context.SaveChangesAsync();

                var tinNhanResponse = await _context.TinNhan
                    .Where(t => t.Id == tinNhan.Id)
                    .Select(t => new
                    {
                        t.Id,
                        t.NoiDung,
                        t.Loai,
                        t.DaDoc,
                        t.NgayGui,
                        t.SanPhamId,
                        SanPham = t.SanPham != null ? new
                        {
                            t.SanPham.Id,
                            t.SanPham.Ten,
                            t.SanPham.HinhAnhChinh,
                            t.SanPham.Gia,
                            t.SanPham.Slug
                        } : null
                    })
                    .FirstOrDefaultAsync();

                return Ok(tinNhanResponse);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi gửi tin nhắn: {ex.Message}" });
            }
        }

        // Admin: Lấy danh sách khách hàng đang chat
        [HttpGet("danh-sach-khach-hang")]
        [Authorize]
        public async Task<IActionResult> GetDanhSachKhachHang()
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }
                // Lấy tất cả tin nhắn của user
                var allTinNhans = await _context.TinNhan
                    .Include(t => t.NguoiDung)
                    .Where(t => t.Loai == "User")
                    .OrderByDescending(t => t.NgayGui)
                    .ToListAsync();

                // Group by NguoiDungId trong memory
                var khachHangs = allTinNhans
                    .GroupBy(t => t.NguoiDungId)
                    .Select(g => 
                    {
                        var firstTinNhan = g.First();
                        var lastTinNhan = g.OrderByDescending(t => t.NgayGui).First();
                        return new
                        {
                            NguoiDungId = g.Key,
                            NguoiDung = firstTinNhan.NguoiDung != null ? new
                            {
                                firstTinNhan.NguoiDung.Id,
                                HoTen = $"{firstTinNhan.NguoiDung.Ho} {firstTinNhan.NguoiDung.Ten}".Trim(),
                                firstTinNhan.NguoiDung.Email,
                                firstTinNhan.NguoiDung.SoDienThoai
                            } : null,
                            SoTinNhanChuaDoc = g.Count(t => !t.DaDoc),
                            TinNhanCuoiCung = new
                            {
                                lastTinNhan.NoiDung,
                                lastTinNhan.NgayGui
                            }
                        };
                    })
                    .OrderByDescending(k => k.TinNhanCuoiCung.NgayGui)
                    .ToList();

                return Ok(khachHangs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải danh sách khách hàng: {ex.Message}" });
            }
        }

        // Admin: Lấy tin nhắn của một khách hàng cụ thể
        [HttpGet("khach-hang/{khachHangId}")]
        [Authorize]
        public async Task<IActionResult> GetTinNhanCuaKhachHang(int khachHangId)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }
                var tinNhans = await _context.TinNhan
                    .Include(t => t.NguoiDung)
                    .Include(t => t.NguoiPhanHoi)
                    .Include(t => t.SanPham)
                    .Where(t => t.NguoiDungId == khachHangId)
                    .OrderBy(t => t.NgayGui)
                    .Select(t => new
                    {
                        t.Id,
                        t.NoiDung,
                        t.Loai,
                        t.DaDoc,
                        t.NgayGui,
                        t.SanPhamId,
                        SanPham = t.SanPham != null ? new
                        {
                            t.SanPham.Id,
                            t.SanPham.Ten,
                            t.SanPham.HinhAnhChinh,
                            t.SanPham.Gia,
                            t.SanPham.Slug
                        } : null,
                        NguoiGui = t.NguoiDung != null ? new
                        {
                            t.NguoiDung.Id,
                            HoTen = $"{t.NguoiDung.Ho} {t.NguoiDung.Ten}".Trim(),
                            t.NguoiDung.Email
                        } : null,
                        NguoiPhanHoi = t.NguoiPhanHoi != null ? new
                        {
                            t.NguoiPhanHoi.Id,
                            HoTen = $"{t.NguoiPhanHoi.Ho} {t.NguoiPhanHoi.Ten}".Trim(),
                            t.NguoiPhanHoi.Email
                        } : null
                    })
                    .ToListAsync();

                // Đánh dấu đã đọc
                var tinNhansChuaDoc = await _context.TinNhan
                    .Where(t => t.NguoiDungId == khachHangId && !t.DaDoc && t.Loai == "User")
                    .ToListAsync();

                foreach (var tinNhan in tinNhansChuaDoc)
                {
                    tinNhan.DaDoc = true;
                }
                await _context.SaveChangesAsync();

                return Ok(tinNhans);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải tin nhắn: {ex.Message}" });
            }
        }

        // Admin: Gửi phản hồi cho khách hàng
        [HttpPost("phan-hoi/{khachHangId}")]
        [Authorize]
        public async Task<IActionResult> PhanHoiKhachHang(int khachHangId, [FromBody] PhanHoiRequest request)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }
                var adminId = GetUserId();
                var tinNhan = new TinNhan
                {
                    NguoiDungId = khachHangId,
                    NguoiPhanHoiId = adminId,
                    NoiDung = request.NoiDung,
                    Loai = "Human",
                    NgayGui = DateTime.UtcNow,
                    DaDoc = false
                };

                _context.TinNhan.Add(tinNhan);
                await _context.SaveChangesAsync();

                var tinNhanResponse = await _context.TinNhan
                    .Where(t => t.Id == tinNhan.Id)
                    .Select(t => new
                    {
                        t.Id,
                        t.NoiDung,
                        t.Loai,
                        t.DaDoc,
                        t.NgayGui,
                        NguoiPhanHoi = t.NguoiPhanHoi != null ? new
                        {
                            t.NguoiPhanHoi.Id,
                            HoTen = $"{t.NguoiPhanHoi.Ho} {t.NguoiPhanHoi.Ten}".Trim(),
                            t.NguoiPhanHoi.Email
                        } : null
                    })
                    .FirstOrDefaultAsync();

                return Ok(tinNhanResponse);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi gửi phản hồi: {ex.Message}" });
            }
        }

        // Đánh dấu đã đọc
        [HttpPut("{id}/da-doc")]
        [Authorize]
        public async Task<IActionResult> DanhDauDaDoc(int id)
        {
            try
            {
                var tinNhan = await _context.TinNhan.FindAsync(id);
                if (tinNhan == null)
                {
                    return NotFound();
                }

                tinNhan.DaDoc = true;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Đã đánh dấu đã đọc" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi: {ex.Message}" });
            }
        }
    }

    public class GuiTinNhanRequest
    {
        [Required]
        public string NoiDung { get; set; } = string.Empty;
        public string? Loai { get; set; }
        public int? SanPhamId { get; set; }
    }

    public class PhanHoiRequest
    {
        [Required]
        public string NoiDung { get; set; } = string.Empty;
    }
}

