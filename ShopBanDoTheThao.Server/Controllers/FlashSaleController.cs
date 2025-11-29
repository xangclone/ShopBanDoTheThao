using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopBanDoTheThao.Server.Data;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace ShopBanDoTheThao.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FlashSaleController : ControllerBase
    {
        private readonly ShopBanDoTheThaoDbContext _context;

        public FlashSaleController(ShopBanDoTheThaoDbContext context)
        {
            _context = context;
        }

        // Lấy danh sách flash sale đang diễn ra (public)
        [HttpGet("dang-dien-ra")]
        public async Task<IActionResult> GetFlashSaleDangDienRa()
        {
            try
            {
                var now = DateTime.UtcNow;
                var flashSalesData = await _context.FlashSale
                    .Include(fs => fs.DanhSachSanPham)
                        .ThenInclude(fsp => fsp.SanPham)
                    .Where(fs => fs.DangHoatDong &&
                                fs.ThoiGianBatDau <= now &&
                                fs.ThoiGianKetThuc >= now)
                    .OrderByDescending(fs => fs.UuTien)
                    .ThenByDescending(fs => fs.ThoiGianBatDau)
                    .ToListAsync();

                var flashSales = flashSalesData.Select(fs => new
                {
                    fs.Id,
                    fs.Ten,
                    fs.MoTa,
                    fs.HinhAnh,
                    fs.ThoiGianBatDau,
                    fs.ThoiGianKetThuc,
                    ThoiGianConLai = (fs.ThoiGianKetThuc - now).TotalSeconds,
                    SoLuongSanPham = fs.DanhSachSanPham.Count(sp => sp.DangHoatDong),
                    DanhSachSanPham = fs.DanhSachSanPham
                        .Where(fsp => fsp.DangHoatDong && fsp.SanPham.DangHoatDong)
                        .OrderByDescending(fsp => fsp.UuTien)
                        .Take(6) // Lấy 6 sản phẩm đầu tiên để hiển thị trên banner
                        .Select(fsp => new
                        {
                            fsp.SanPham.Id,
                            fsp.SanPham.Ten,
                            fsp.SanPham.HinhAnhChinh,
                            fsp.SanPham.Gia,
                            fsp.GiaFlashSale,
                            fsp.SoLuongToiDa,
                            fsp.SoLuongDaBan,
                            PhanTramGiam = fsp.SanPham.Gia > 0 ? 
                                (int)(((fsp.SanPham.Gia - fsp.GiaFlashSale) / fsp.SanPham.Gia) * 100) : 0
                        })
                        .ToList()
                }).ToList();

                return Ok(flashSales);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi lấy danh sách flash sale: {ex.Message}" });
            }
        }

        // Lấy flash sale cho một sản phẩm cụ thể
        [HttpGet("sanpham/{sanPhamId}")]
        public async Task<IActionResult> GetFlashSaleBySanPhamId(int sanPhamId)
        {
            try
            {
                var now = DateTime.UtcNow;
                var flashSaleSanPham = await _context.FlashSaleSanPham
                    .Include(fsp => fsp.FlashSale)
                    .Include(fsp => fsp.SanPham)
                    .Where(fsp => fsp.SanPhamId == sanPhamId &&
                                  fsp.DangHoatDong &&
                                  fsp.FlashSale.DangHoatDong &&
                                  fsp.FlashSale.ThoiGianBatDau <= now &&
                                  fsp.FlashSale.ThoiGianKetThuc >= now)
                    .OrderByDescending(fsp => fsp.FlashSale.UuTien)
                    .FirstOrDefaultAsync();

                if (flashSaleSanPham == null)
                {
                    return Ok(null);
                }

                var result = new
                {
                    flashSaleSanPham.FlashSale.Id,
                    flashSaleSanPham.FlashSale.Ten,
                    flashSaleSanPham.GiaFlashSale,
                    flashSaleSanPham.SoLuongToiDa,
                    flashSaleSanPham.SoLuongDaBan,
                    PhanTramGiam = flashSaleSanPham.SanPham.Gia > 0 ? 
                        (int)(((flashSaleSanPham.SanPham.Gia - flashSaleSanPham.GiaFlashSale) / flashSaleSanPham.SanPham.Gia) * 100) : 0
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi lấy flash sale cho sản phẩm: {ex.Message}" });
            }
        }

        // Lấy chi tiết flash sale với danh sách sản phẩm (public)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFlashSaleById(int id)
        {
            try
            {
                var flashSale = await _context.FlashSale
                    .Include(fs => fs.DanhSachSanPham)
                        .ThenInclude(fsp => fsp.SanPham)
                            .ThenInclude(sp => sp.DanhMuc)
                    .Include(fs => fs.DanhSachSanPham)
                        .ThenInclude(fsp => fsp.SanPham)
                            .ThenInclude(sp => sp.ThuongHieu)
                    .FirstOrDefaultAsync(fs => fs.Id == id);

                if (flashSale == null)
                {
                    return NotFound(new { message = "Flash sale không tồn tại" });
                }

                var now = DateTime.UtcNow;
                var isActive = flashSale.DangHoatDong &&
                              flashSale.ThoiGianBatDau <= now &&
                              flashSale.ThoiGianKetThuc >= now;

                var result = new
                {
                    flashSale.Id,
                    flashSale.Ten,
                    flashSale.MoTa,
                    flashSale.HinhAnh,
                    flashSale.ThoiGianBatDau,
                    flashSale.ThoiGianKetThuc,
                    ThoiGianConLai = (flashSale.ThoiGianKetThuc - now).TotalSeconds,
                    IsActive = isActive,
                    DanhSachSanPham = flashSale.DanhSachSanPham
                        .Where(fsp => fsp.DangHoatDong && fsp.SanPham.DangHoatDong)
                        .OrderByDescending(fsp => fsp.UuTien)
                        .Select(fsp => new
                        {
                            fsp.Id,
                            SanPham = new
                            {
                                fsp.SanPham.Id,
                                fsp.SanPham.Ten,
                                fsp.SanPham.HinhAnhChinh,
                                fsp.SanPham.Gia,
                                fsp.SanPham.GiaGoc,
                                fsp.SanPham.SoLuongTon,
                                fsp.SanPham.SoLuongBan,
                                fsp.SanPham.DiemDanhGiaTrungBinh,
                                fsp.SanPham.SoLuongDanhGia,
                                fsp.SanPham.Slug,
                                DanhMuc = fsp.SanPham.DanhMuc != null ? new
                                {
                                    fsp.SanPham.DanhMuc.Id,
                                    fsp.SanPham.DanhMuc.Ten
                                } : null,
                                ThuongHieu = fsp.SanPham.ThuongHieu != null ? new
                                {
                                    fsp.SanPham.ThuongHieu.Id,
                                    fsp.SanPham.ThuongHieu.Ten
                                } : null
                            },
                            fsp.GiaFlashSale,
                            fsp.SoLuongToiDa,
                            fsp.SoLuongDaBan,
                            SoLuongConLai = fsp.SoLuongToiDa > 0 ? (int?)(fsp.SoLuongToiDa - fsp.SoLuongDaBan) : null,
                            PhanTramGiam = fsp.SanPham.Gia > 0 ? 
                                (int)(((fsp.SanPham.Gia - fsp.GiaFlashSale) / fsp.SanPham.Gia) * 100) : 0
                        })
                        .ToList()
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi lấy chi tiết flash sale: {ex.Message}" });
            }
        }
    }

}

