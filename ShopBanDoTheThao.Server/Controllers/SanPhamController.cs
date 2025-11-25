using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopBanDoTheThao.Server.Data;
using ShopBanDoTheThao.Server.Models;

namespace ShopBanDoTheThao.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SanPhamController : ControllerBase
    {
        private readonly ShopBanDoTheThaoDbContext _context;

        public SanPhamController(ShopBanDoTheThaoDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetSanPham(
            [FromQuery] int? danhMucId,
            [FromQuery] int? thuongHieuId,
            [FromQuery] string? timKiem,
            [FromQuery] decimal? giaMin,
            [FromQuery] decimal? giaMax,
            [FromQuery] string? kichThuoc,
            [FromQuery] string? mauSac,
            [FromQuery] bool? dangKhuyenMai,
            [FromQuery] bool? sanPhamNoiBat,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string sortBy = "NgayTao",
            [FromQuery] string sortOrder = "desc")
        {
            try
            {
                var query = _context.SanPham
                    .Include(p => p.DanhMuc)
                    .Include(p => p.ThuongHieu)
                    .Where(p => p.DangHoatDong);

                // Lọc theo danh mục
                if (danhMucId.HasValue)
                {
                    query = query.Where(p => p.DanhMucId == danhMucId.Value);
                }

                // Lọc theo thương hiệu
                if (thuongHieuId.HasValue)
                {
                    query = query.Where(p => p.ThuongHieuId == thuongHieuId.Value);
                }

                // Tìm kiếm
                if (!string.IsNullOrEmpty(timKiem))
                {
                    query = query.Where(p => p.Ten.Contains(timKiem) || 
                                             (p.MoTa != null && p.MoTa.Contains(timKiem)));
                }

                // Lọc theo khuyến mãi
                if (dangKhuyenMai.HasValue && dangKhuyenMai.Value)
                {
                    query = query.Where(p => p.DangKhuyenMai);
                }

                // Lọc theo sản phẩm nổi bật
                if (sanPhamNoiBat.HasValue && sanPhamNoiBat.Value)
                {
                    query = query.Where(p => p.SanPhamNoiBat);
                }

                // Lọc theo giá
                if (giaMin.HasValue)
                {
                    query = query.Where(p => p.Gia >= giaMin.Value);
                }
                if (giaMax.HasValue)
                {
                    query = query.Where(p => p.Gia <= giaMax.Value);
                }

                // Lọc theo kích thước
                if (!string.IsNullOrEmpty(kichThuoc))
                {
                    query = query.Where(p => p.KichThuoc == kichThuoc);
                }

                // Lọc theo màu sắc
                if (!string.IsNullOrEmpty(mauSac))
                {
                    query = query.Where(p => p.MauSac == mauSac);
                }

                // Sắp xếp
                query = sortBy.ToLower() switch
                {
                    "gia" => sortOrder == "asc" ? query.OrderBy(p => p.Gia) : query.OrderByDescending(p => p.Gia),
                    "ten" => sortOrder == "asc" ? query.OrderBy(p => p.Ten) : query.OrderByDescending(p => p.Ten),
                    "banchay" => query.OrderByDescending(p => p.SoLuongBan),
                    "danhgia" => query.OrderByDescending(p => p.DiemDanhGiaTrungBinh),
                    _ => query.OrderByDescending(p => p.NgayTao)
                };

                var totalCount = await query.CountAsync();
                var sanPham = await query
                    .Select(p => new
                    {
                        p.Id,
                        p.Ten,
                        p.MoTa,
                        p.Gia,
                        p.GiaGoc,
                        p.HinhAnhChinh,
                        p.Slug,
                        p.SoLuongTon,
                        p.KichThuoc,
                        p.MauSac,
                        p.SanPhamNoiBat,
                        p.DangKhuyenMai,
                        p.SoLuongBan,
                        p.DiemDanhGiaTrungBinh,
                        p.SoLuongDanhGia,
                        p.NgayTao,
                        DanhMuc = new { p.DanhMuc.Id, p.DanhMuc.Ten },
                        ThuongHieu = p.ThuongHieu != null ? new { p.ThuongHieu.Id, p.ThuongHieu.Ten } : null
                    })
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new
                {
                    Data = sanPham,
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải danh sách sản phẩm: {ex.Message}", stackTrace = ex.StackTrace });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSanPhamById(int id)
        {
            try
            {
                var sanPham = await _context.SanPham
                    .Include(p => p.DanhMuc)
                    .Include(p => p.ThuongHieu)
                    .Include(p => p.DanhSachBienThe)
                    .Where(p => p.Id == id && p.DangHoatDong)
                    .Select(p => new
                    {
                        p.Id,
                        p.Ten,
                        p.MoTa,
                        p.MoTaChiTiet,
                        p.Gia,
                        p.GiaGoc,
                        p.SKU,
                        p.SoLuongTon,
                        p.KichThuoc,
                        p.MauSac,
                        p.ChatLieu,
                        p.XuatXu,
                        p.HinhAnhChinh,
                        p.DanhSachHinhAnh,
                        p.Video,
                        p.Slug,
                        p.SoLuotXem,
                        p.SoLuongBan,
                        p.DiemDanhGiaTrungBinh,
                        p.SoLuongDanhGia,
                        p.SanPhamNoiBat,
                        p.DangKhuyenMai,
                        p.DangHoatDong,
                        p.NgayTao,
                        p.NgayCapNhat,
                        DanhSachBienThe = p.DanhSachBienThe
                            .Where(v => v.DangHoatDong)
                            .Select(v => new
                            {
                                v.Id,
                                v.KichThuoc,
                                v.MauSac,
                                v.SKU,
                                v.SoLuongTon,
                                v.Gia,
                                v.HinhAnh
                            })
                            .ToList(),
                        DanhMuc = new { p.DanhMuc.Id, p.DanhMuc.Ten, p.DanhMuc.Slug },
                        ThuongHieu = p.ThuongHieu != null ? new { p.ThuongHieu.Id, p.ThuongHieu.Ten, p.ThuongHieu.Slug } : null,
                        DanhSachDanhGia = p.DanhSachDanhGia
                            .Where(r => r.HienThi)
                            .OrderByDescending(r => r.NgayTao)
                            .Take(10)
                            .Select(r => new
                            {
                                r.Id,
                                r.SoSao,
                                r.NoiDung,
                                r.NgayTao,
                                NguoiDung = new { r.NguoiDung.Ho, r.NguoiDung.Ten }
                            })
                    })
                    .FirstOrDefaultAsync();

                if (sanPham == null)
                {
                    return NotFound(new { message = "Sản phẩm không tồn tại" });
                }

                // Tăng số lượt xem (update riêng để tránh ảnh hưởng đến query)
                var sanPhamEntity = await _context.SanPham.FindAsync(id);
                if (sanPhamEntity != null)
                {
                    sanPhamEntity.SoLuotXem++;
                    await _context.SaveChangesAsync();
                }

                return Ok(sanPham);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải chi tiết sản phẩm: {ex.Message}", stackTrace = ex.StackTrace });
            }
        }

        [HttpGet("banchay")]
        public async Task<IActionResult> GetSanPhamBanChay([FromQuery] int limit = 10)
        {
            try
            {
                var sanPham = await _context.SanPham
                    .Include(p => p.DanhMuc)
                    .Include(p => p.ThuongHieu)
                    .Where(p => p.DangHoatDong && p.SoLuongBan > 0)
                    .OrderByDescending(p => p.SoLuongBan)
                    .Take(limit)
                    .Select(p => new
                    {
                        p.Id,
                        p.Ten,
                        p.MoTa,
                        p.Gia,
                        p.GiaGoc,
                        p.HinhAnhChinh,
                        p.Slug,
                        p.SoLuongTon,
                        p.SoLuongBan,
                        p.DiemDanhGiaTrungBinh,
                        p.SoLuongDanhGia,
                        p.SanPhamNoiBat,
                        p.DangKhuyenMai,
                        DanhMuc = new { p.DanhMuc.Id, p.DanhMuc.Ten },
                        ThuongHieu = p.ThuongHieu != null ? new { p.ThuongHieu.Id, p.ThuongHieu.Ten } : null
                    })
                    .ToListAsync();

                return Ok(sanPham);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải sản phẩm bán chạy: {ex.Message}" });
            }
        }

        [HttpGet("noibat")]
        public async Task<IActionResult> GetSanPhamNoiBat([FromQuery] int limit = 10)
        {
            try
            {
                var sanPham = await _context.SanPham
                    .Include(p => p.DanhMuc)
                    .Include(p => p.ThuongHieu)
                    .Where(p => p.DangHoatDong && p.SanPhamNoiBat)
                    .OrderByDescending(p => p.SoLuongBan)
                    .Take(limit)
                    .Select(p => new
                    {
                        p.Id,
                        p.Ten,
                        p.MoTa,
                        p.Gia,
                        p.GiaGoc,
                        p.HinhAnhChinh,
                        p.Slug,
                        p.SoLuongTon,
                        p.KichThuoc,
                        p.MauSac,
                        p.SanPhamNoiBat,
                        p.DangKhuyenMai,
                        p.SoLuongBan,
                        p.DiemDanhGiaTrungBinh,
                        p.SoLuongDanhGia,
                        DanhMuc = new { p.DanhMuc.Id, p.DanhMuc.Ten },
                        ThuongHieu = p.ThuongHieu != null ? new { p.ThuongHieu.Id, p.ThuongHieu.Ten } : null
                    })
                    .ToListAsync();

                return Ok(sanPham);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải sản phẩm nổi bật: {ex.Message}" });
            }
        }

        [HttpGet("tim-kiem")]
        public async Task<IActionResult> TimKiemSanPham([FromQuery] string? q, [FromQuery] int limit = 5)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(q))
                {
                    return Ok(new List<object>());
                }

                var sanPham = await _context.SanPham
                    .Where(p => p.DangHoatDong && 
                               (p.Ten.Contains(q) || 
                                (p.MoTa != null && p.MoTa.Contains(q))))
                    .Select(p => new
                    {
                        p.Id,
                        p.Ten,
                        p.Gia,
                        p.GiaGoc,
                        p.HinhAnhChinh,
                        p.Slug
                    })
                    .Take(limit)
                    .ToListAsync();

                return Ok(sanPham);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tìm kiếm: {ex.Message}" });
            }
        }

        [HttpGet("{id}/tuongtu")]
        public async Task<IActionResult> GetSanPhamTuongTu(int id, [FromQuery] int limit = 8)
        {
            try
            {
                // Lấy thông tin sản phẩm hiện tại
                var sanPhamHienTai = await _context.SanPham
                    .FirstOrDefaultAsync(p => p.Id == id && p.DangHoatDong);

                if (sanPhamHienTai == null)
                {
                    return NotFound(new { message = "Sản phẩm không tồn tại" });
                }

                // Lấy sản phẩm tương tự: cùng danh mục hoặc cùng thương hiệu, loại trừ sản phẩm hiện tại
                var sanPhamTuongTu = await _context.SanPham
                    .Include(p => p.DanhMuc)
                    .Include(p => p.ThuongHieu)
                    .Where(p => p.DangHoatDong && 
                                p.Id != id &&
                                (p.DanhMucId == sanPhamHienTai.DanhMucId || 
                                 (sanPhamHienTai.ThuongHieuId.HasValue && p.ThuongHieuId == sanPhamHienTai.ThuongHieuId)))
                    .OrderByDescending(p => p.SoLuongBan)
                    .ThenByDescending(p => p.NgayTao)
                    .Take(limit)
                    .Select(p => new
                    {
                        p.Id,
                        p.Ten,
                        p.MoTa,
                        p.Gia,
                        p.GiaGoc,
                        p.HinhAnhChinh,
                        p.Slug,
                        p.SoLuongTon,
                        p.SanPhamNoiBat,
                        p.DangKhuyenMai,
                        p.DiemDanhGiaTrungBinh,
                        p.SoLuongDanhGia,
                        DanhMuc = new { p.DanhMuc.Id, p.DanhMuc.Ten },
                        ThuongHieu = p.ThuongHieu != null ? new { p.ThuongHieu.Id, p.ThuongHieu.Ten } : null
                    })
                    .ToListAsync();

                return Ok(sanPhamTuongTu);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải sản phẩm tương tự: {ex.Message}" });
            }
        }

        [HttpGet("khuyenmai")]
        public async Task<IActionResult> GetSanPhamKhuyenMai([FromQuery] int limit = 10)
        {
            try
            {
                var sanPham = await _context.SanPham
                    .Include(p => p.DanhMuc)
                    .Include(p => p.ThuongHieu)
                    .Where(p => p.DangHoatDong && p.DangKhuyenMai)
                    .OrderByDescending(p => p.NgayTao)
                    .Take(limit)
                    .Select(p => new
                    {
                        p.Id,
                        p.Ten,
                        p.MoTa,
                        p.Gia,
                        p.GiaGoc,
                        p.HinhAnhChinh,
                        p.Slug,
                        p.SoLuongTon,
                        p.KichThuoc,
                        p.MauSac,
                        p.SanPhamNoiBat,
                        p.DangKhuyenMai,
                        p.SoLuongBan,
                        p.DiemDanhGiaTrungBinh,
                        p.SoLuongDanhGia,
                        DanhMuc = new { p.DanhMuc.Id, p.DanhMuc.Ten },
                        ThuongHieu = p.ThuongHieu != null ? new { p.ThuongHieu.Id, p.ThuongHieu.Ten } : null
                    })
                    .ToListAsync();

                return Ok(sanPham);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải sản phẩm khuyến mãi: {ex.Message}" });
            }
        }
    }
}

