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
    [Authorize]
    public class AdminController : ControllerBase
    {
        private readonly ShopBanDoTheThaoDbContext _context;

        public AdminController(ShopBanDoTheThaoDbContext context)
        {
            _context = context;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out int userId) ? userId : 0;
        }

        private async Task<bool> IsAdminAsync()
        {
            var userId = GetUserId();
            if (userId == 0) return false;
            
            var user = await _context.NguoiDung.FindAsync(userId);
            return user != null && user.VaiTro == "QuanTriVien";
        }

        [HttpGet("thongke/tongquan")]
        public async Task<IActionResult> GetThongKeTongQuan()
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var today = DateTime.UtcNow.Date;
                var thisMonth = new DateTime(today.Year, today.Month, 1);
                var thisYear = new DateTime(today.Year, 1, 1);

                var tongQuan = new
                {
                    TongDonHang = await _context.DonHang.CountAsync(),
                    DonHangHomNay = await _context.DonHang.CountAsync(d => d.NgayDat.Date == today),
                    DonHangThangNay = await _context.DonHang.CountAsync(d => d.NgayDat >= thisMonth),
                    DonHangNamNay = await _context.DonHang.CountAsync(d => d.NgayDat >= thisYear),
                    
                    TongDoanhThu = await _context.DonHang
                        .Where(d => d.TrangThai != "DaHuy")
                        .SumAsync(d => (double?)d.TongTien) ?? 0,
                    
                    DoanhThuHomNay = await _context.DonHang
                        .Where(d => d.NgayDat.Date == today && d.TrangThai != "DaHuy")
                        .SumAsync(d => (double?)d.TongTien) ?? 0,
                    
                    DoanhThuThangNay = await _context.DonHang
                        .Where(d => d.NgayDat >= thisMonth && d.TrangThai != "DaHuy")
                        .SumAsync(d => (double?)d.TongTien) ?? 0,
                    
                    DoanhThuNamNay = await _context.DonHang
                        .Where(d => d.NgayDat >= thisYear && d.TrangThai != "DaHuy")
                        .SumAsync(d => (double?)d.TongTien) ?? 0,
                    
                    TongSanPham = await _context.SanPham.CountAsync(),
                    TongNguoiDung = await _context.NguoiDung.CountAsync(),
                    
                    DonHangChoXacNhan = await _context.DonHang.CountAsync(d => d.TrangThai == "ChoXacNhan"),
                    DonHangDangGiao = await _context.DonHang.CountAsync(d => d.TrangThai == "DangGiao"),
                    DonHangDaHuy = await _context.DonHang.CountAsync(d => d.TrangThai == "DaHuy"),
                    DonHangHoanTra = await _context.DonHang.CountAsync(d => d.TrangThai == "HoanTra"),
                    
                    TongTienDonHuy = await _context.DonHang
                        .Where(d => d.TrangThai == "DaHuy")
                        .SumAsync(d => (double?)d.TongTien) ?? 0,
                    
                    TongTienDonHoanTra = await _context.DonHang
                        .Where(d => d.TrangThai == "HoanTra")
                        .SumAsync(d => (double?)d.TongTien) ?? 0,
                };

                return Ok(tongQuan);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải thống kê: {ex.Message}" });
            }
        }

        [HttpGet("thongke/doanhthu")]
        public async Task<IActionResult> GetThongKeDoanhThu(
            [FromQuery] string? loai, // "ngay", "thang", "quy", "nam"
            [FromQuery] int? nam,
            [FromQuery] int? quy)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var currentYear = nam ?? DateTime.UtcNow.Year;
                var query = _context.DonHang
                    .Where(d => d.TrangThai != "DaHuy" && d.NgayDat.Year == currentYear);

                if (quy.HasValue && quy.Value >= 1 && quy.Value <= 4)
                {
                    var startMonth = (quy.Value - 1) * 3 + 1;
                    var endMonth = quy.Value * 3;
                    query = query.Where(d => d.NgayDat.Month >= startMonth && d.NgayDat.Month <= endMonth);
                }

                object? data = null;

                switch (loai?.ToLower())
                {
                    case "ngay":
                        data = await query
                            .GroupBy(d => d.NgayDat.Date)
                            .Select(g => new
                            {
                                Ngay = g.Key,
                                DoanhThu = g.Sum(d => (double)d.TongTien),
                                SoDonHang = g.Count()
                            })
                            .OrderBy(x => x.Ngay)
                            .ToListAsync();
                        break;

                    case "thang":
                        data = await query
                            .GroupBy(d => new { d.NgayDat.Year, d.NgayDat.Month })
                            .Select(g => new
                            {
                                Thang = g.Key.Month,
                                Nam = g.Key.Year,
                                DoanhThu = g.Sum(d => (double)d.TongTien),
                                SoDonHang = g.Count()
                            })
                            .OrderBy(x => x.Nam).ThenBy(x => x.Thang)
                            .ToListAsync();
                        break;

                    case "quy":
                        data = await query
                            .GroupBy(d => new
                            {
                                d.NgayDat.Year,
                                Quy = ((d.NgayDat.Month - 1) / 3) + 1
                            })
                            .Select(g => new
                            {
                                Quy = g.Key.Quy,
                                Nam = g.Key.Year,
                                DoanhThu = g.Sum(d => (double)d.TongTien),
                                SoDonHang = g.Count()
                            })
                            .OrderBy(x => x.Nam).ThenBy(x => x.Quy)
                            .ToListAsync();
                        break;

                    case "nam":
                        data = await _context.DonHang
                            .Where(d => d.TrangThai != "DaHuy")
                            .GroupBy(d => d.NgayDat.Year)
                            .Select(g => new
                            {
                                Nam = g.Key,
                                DoanhThu = g.Sum(d => (double)d.TongTien),
                                SoDonHang = g.Count()
                            })
                            .OrderBy(x => x.Nam)
                            .ToListAsync();
                        break;

                    default:
                        // Mặc định: 30 ngày gần nhất
                        var startDate = DateTime.UtcNow.Date.AddDays(-30);
                        data = await _context.DonHang
                            .Where(d => d.TrangThai != "DaHuy" && d.NgayDat >= startDate)
                            .GroupBy(d => d.NgayDat.Date)
                            .Select(g => new
                            {
                                Ngay = g.Key,
                                DoanhThu = g.Sum(d => (double)d.TongTien),
                                SoDonHang = g.Count()
                            })
                            .OrderBy(x => x.Ngay)
                            .ToListAsync();
                        break;
                }

                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải thống kê doanh thu: {ex.Message}" });
            }
        }

        [HttpGet("thongke/sanpham")]
        public async Task<IActionResult> GetThongKeSanPham([FromQuery] int? limit = 10)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var sanPhamBanChay = await _context.DonHangChiTiet
                    .Include(d => d.SanPham)
                    .Where(d => d.DonHang.TrangThai != "DaHuy")
                    .GroupBy(d => new { d.SanPhamId, d.SanPham.Ten, d.SanPham.HinhAnhChinh })
                    .Select(g => new
                    {
                        SanPhamId = g.Key.SanPhamId,
                        Ten = g.Key.Ten,
                        HinhAnhChinh = g.Key.HinhAnhChinh,
                        SoLuongBan = g.Sum(d => d.SoLuong),
                        DoanhThu = g.Sum(d => (double)d.ThanhTien)
                    })
                    .OrderByDescending(x => x.SoLuongBan)
                    .Take(limit ?? 10)
                    .ToListAsync();

                return Ok(sanPhamBanChay);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải thống kê sản phẩm: {ex.Message}" });
            }
        }

        // Quản lý đơn hàng
        [HttpGet("donhang")]
        public async Task<IActionResult> GetDanhSachDonHang(
            [FromQuery] string? trangThai,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var query = _context.DonHang.AsQueryable();

                if (!string.IsNullOrEmpty(trangThai))
                {
                    query = query.Where(d => d.TrangThai == trangThai);
                }

                var totalCount = await query.CountAsync();
                var donHang = await query
                    .Include(d => d.NguoiDung)
                    .OrderByDescending(d => d.NgayDat)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(d => new
                    {
                        d.Id,
                        d.MaDonHang,
                        d.NgayDat,
                        d.TrangThai,
                        d.TrangThaiThanhToan,
                        d.TongTien,
                        NguoiDung = new { d.NguoiDung.Ho, d.NguoiDung.Ten, d.NguoiDung.Email }
                    })
                    .ToListAsync();

                return Ok(new
                {
                    Data = donHang,
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải danh sách đơn hàng: {ex.Message}" });
            }
        }

        [HttpGet("donhang/{id}")]
        public async Task<IActionResult> GetDonHangById(int id)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var donHang = await _context.DonHang
                    .Include(d => d.NguoiDung)
                    .Include(d => d.DiaChiGiaoHang)
                    .Include(d => d.DanhSachChiTiet)
                        .ThenInclude(ct => ct.SanPham)
                    .FirstOrDefaultAsync(d => d.Id == id);

                if (donHang == null)
                {
                    return NotFound(new { message = "Đơn hàng không tồn tại" });
                }

                var result = new
                {
                    donHang.Id,
                    donHang.MaDonHang,
                    donHang.NgayDat,
                    donHang.NgayGiao,
                    donHang.NgayCapNhat,
                    donHang.TrangThai,
                    donHang.TrangThaiThanhToan,
                    donHang.TongTienSanPham,
                    donHang.PhiVanChuyen,
                    donHang.Thue,
                    donHang.GiamGia,
                    donHang.TongTien,
                    donHang.GhiChu,
                    donHang.PhuongThucGiaoHang,
                    NguoiDung = new
                    {
                        donHang.NguoiDung.Id,
                        donHang.NguoiDung.Ho,
                        donHang.NguoiDung.Ten,
                        donHang.NguoiDung.Email,
                        donHang.NguoiDung.SoDienThoai
                    },
                    DiaChiGiaoHang = donHang.DiaChiGiaoHang != null ? new
                    {
                        donHang.DiaChiGiaoHang.Id,
                        donHang.DiaChiGiaoHang.TenNguoiNhan,
                        donHang.DiaChiGiaoHang.SoDienThoaiNhan,
                        donHang.DiaChiGiaoHang.DuongPho,
                        donHang.DiaChiGiaoHang.PhuongXa,
                        donHang.DiaChiGiaoHang.QuanHuyen,
                        donHang.DiaChiGiaoHang.ThanhPho
                    } : null,
                    DanhSachChiTiet = donHang.DanhSachChiTiet.Select(ct => new
                    {
                        ct.Id,
                        ct.SoLuong,
                        ct.Gia,
                        ct.ThanhTien,
                        ct.KichThuoc,
                        ct.MauSac,
                        SanPham = ct.SanPham != null ? new
                        {
                            ct.SanPham.Id,
                            ct.SanPham.Ten,
                            ct.SanPham.HinhAnhChinh,
                            ct.SanPham.SKU
                        } : null
                    }).ToList()
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải đơn hàng: {ex.Message}" });
            }
        }

        [HttpGet("donhang/madon/{maDonHang}")]
        public async Task<IActionResult> GetDonHangByMaDonHang(string maDonHang)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var donHang = await _context.DonHang
                    .Include(d => d.NguoiDung)
                    .Include(d => d.DiaChiGiaoHang)
                    .Include(d => d.DanhSachChiTiet)
                        .ThenInclude(ct => ct.SanPham)
                    .FirstOrDefaultAsync(d => d.MaDonHang == maDonHang);

                if (donHang == null)
                {
                    return NotFound(new { message = "Không tìm thấy đơn hàng với mã: " + maDonHang });
                }

                var result = new
                {
                    donHang.Id,
                    donHang.MaDonHang,
                    donHang.NgayDat,
                    donHang.NgayGiao,
                    donHang.NgayCapNhat,
                    donHang.TrangThai,
                    donHang.TrangThaiThanhToan,
                    donHang.TongTienSanPham,
                    donHang.PhiVanChuyen,
                    donHang.Thue,
                    donHang.GiamGia,
                    donHang.TongTien,
                    donHang.GhiChu,
                    donHang.PhuongThucGiaoHang,
                    NguoiDung = new
                    {
                        donHang.NguoiDung.Id,
                        donHang.NguoiDung.Ho,
                        donHang.NguoiDung.Ten,
                        donHang.NguoiDung.Email,
                        donHang.NguoiDung.SoDienThoai
                    },
                    DiaChiGiaoHang = donHang.DiaChiGiaoHang != null ? new
                    {
                        donHang.DiaChiGiaoHang.Id,
                        donHang.DiaChiGiaoHang.TenNguoiNhan,
                        donHang.DiaChiGiaoHang.SoDienThoaiNhan,
                        donHang.DiaChiGiaoHang.DuongPho,
                        donHang.DiaChiGiaoHang.PhuongXa,
                        donHang.DiaChiGiaoHang.QuanHuyen,
                        donHang.DiaChiGiaoHang.ThanhPho
                    } : null,
                    DanhSachChiTiet = donHang.DanhSachChiTiet.Select(ct => new
                    {
                        ct.Id,
                        ct.SoLuong,
                        ct.Gia,
                        ct.ThanhTien,
                        ct.KichThuoc,
                        ct.MauSac,
                        SanPham = ct.SanPham != null ? new
                        {
                            ct.SanPham.Id,
                            ct.SanPham.Ten,
                            ct.SanPham.HinhAnhChinh,
                            ct.SanPham.SKU
                        } : null
                    }).ToList()
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải đơn hàng: {ex.Message}" });
            }
        }

        [HttpPut("donhang/{id}/trangthai")]
        public async Task<IActionResult> CapNhatTrangThaiDonHang(int id, [FromBody] CapNhatTrangThaiRequest request)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var donHang = await _context.DonHang.FindAsync(id);
                if (donHang == null)
                {
                    return NotFound(new { message = "Đơn hàng không tồn tại" });
                }

                var trangThaiCu = donHang.TrangThai;
                donHang.TrangThai = request.TrangThai;
                donHang.NgayCapNhat = DateTime.UtcNow;

                if (request.TrangThai == "DaGiao")
                {
                    donHang.NgayGiao = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();

                // Tạo thông báo tự động cho khách hàng
                if (trangThaiCu != request.TrangThai)
                {
                    await Helpers.ThongBaoHelper.TaoThongBaoDonHang(_context, donHang.Id, donHang.NguoiDungId, trangThaiCu, request.TrangThai);
                }

                return Ok(new { message = "Cập nhật trạng thái thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi cập nhật trạng thái: {ex.Message}" });
            }
        }

        // Quản lý người dùng
        [HttpGet("nguoidung")]
        public async Task<IActionResult> GetDanhSachNguoiDung(
            [FromQuery] string? timKiem,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var query = _context.NguoiDung.AsQueryable();

                if (!string.IsNullOrEmpty(timKiem))
                {
                    query = query.Where(u => u.Email.Contains(timKiem) ||
                                            u.Ho.Contains(timKiem) ||
                                            u.Ten.Contains(timKiem));
                }

                var totalCount = await query.CountAsync();
                var nguoiDung = await query
                    .OrderByDescending(u => u.NgayTao)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(u => new
                    {
                        u.Id,
                        u.Email,
                        u.SoDienThoai,
                        u.Ho,
                        u.Ten,
                        u.VaiTro,
                        u.DangHoatDong,
                        u.NgayTao,
                        SoDonHang = u.DanhSachDonHang.Count
                    })
                    .ToListAsync();

                return Ok(new
                {
                    Data = nguoiDung,
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải danh sách người dùng: {ex.Message}" });
            }
        }

        [HttpPut("nguoidung/{id}/trangthai")]
        public async Task<IActionResult> CapNhatTrangThaiNguoiDung(int id, [FromBody] CapNhatTrangThaiNguoiDungRequest request)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var nguoiDung = await _context.NguoiDung.FindAsync(id);
                if (nguoiDung == null)
                {
                    return NotFound(new { message = "Người dùng không tồn tại" });
                }

                nguoiDung.DangHoatDong = request.DangHoatDong;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Cập nhật trạng thái thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi cập nhật trạng thái: {ex.Message}" });
            }
        }

        // Quản lý Sản phẩm
        [HttpGet("sanpham")]
        public async Task<IActionResult> GetDanhSachSanPham(
            [FromQuery] string? timKiem,
            [FromQuery] int? danhMucId,
            [FromQuery] int? thuongHieuId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var query = _context.SanPham
                    .Include(s => s.DanhMuc)
                    .Include(s => s.ThuongHieu)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(timKiem))
                {
                    query = query.Where(s => s.Ten.Contains(timKiem) || (s.MoTa != null && s.MoTa.Contains(timKiem)));
                }

                if (danhMucId.HasValue)
                {
                    query = query.Where(s => s.DanhMucId == danhMucId.Value);
                }

                if (thuongHieuId.HasValue)
                {
                    query = query.Where(s => s.ThuongHieuId == thuongHieuId.Value);
                }

                var totalCount = await query.CountAsync();
                var sanPham = await query
                    .OrderByDescending(s => s.NgayTao)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(s => new
                    {
                        s.Id,
                        s.Ten,
                        s.Gia,
                        s.GiaGoc,
                        s.SoLuongTon,
                        s.DangHoatDong,
                        s.DangKhuyenMai,
                        s.SanPhamNoiBat,
                        s.HinhAnhChinh,
                        s.NgayTao,
                        DanhMuc = new { s.DanhMuc.Id, s.DanhMuc.Ten },
                        ThuongHieu = s.ThuongHieu != null ? new { s.ThuongHieu.Id, s.ThuongHieu.Ten } : null
                    })
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
                return StatusCode(500, new { message = $"Lỗi khi tải danh sách sản phẩm: {ex.Message}" });
            }
        }

        [HttpGet("sanpham/{id}")]
        public async Task<IActionResult> GetSanPhamById(int id)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var sanPham = await _context.SanPham
                    .Include(s => s.DanhMuc)
                    .Include(s => s.ThuongHieu)
                    .Include(s => s.DanhSachBienThe)
                    .FirstOrDefaultAsync(s => s.Id == id);

                if (sanPham == null)
                {
                    return NotFound(new { message = "Sản phẩm không tồn tại" });
                }

                var result = new
                {
                    sanPham.Id,
                    sanPham.Ten,
                    sanPham.MoTa,
                    sanPham.MoTaChiTiet,
                    sanPham.Gia,
                    sanPham.GiaGoc,
                    sanPham.SKU,
                    sanPham.DanhMucId,
                    sanPham.ThuongHieuId,
                    sanPham.SoLuongTon,
                    sanPham.HinhAnhChinh,
                    sanPham.DanhSachHinhAnh,
                    sanPham.Video,
                    sanPham.Slug,
                    sanPham.DangHoatDong,
                    sanPham.DangKhuyenMai,
                    sanPham.SanPhamNoiBat,
                    sanPham.NgayTao,
                    DanhMuc = new { sanPham.DanhMuc.Id, sanPham.DanhMuc.Ten },
                    ThuongHieu = sanPham.ThuongHieu != null ? new { sanPham.ThuongHieu.Id, sanPham.ThuongHieu.Ten } : null,
                    DanhSachBienThe = sanPham.DanhSachBienThe.Select(b => new
                    {
                        b.Id,
                        b.KichThuoc,
                        b.MauSac,
                        b.SKU,
                        b.SoLuongTon,
                        b.Gia,
                        b.HinhAnh,
                        b.DangHoatDong
                    }).ToList()
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải sản phẩm: {ex.Message}" });
            }
        }

        [HttpPost("sanpham")]
        public async Task<IActionResult> TaoSanPham([FromBody] TaoSanPhamRequest request)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var sanPham = new Models.SanPham
                {
                    Ten = request.Ten,
                    MoTa = request.MoTa,
                    MoTaChiTiet = request.MoTaChiTiet,
                    Gia = request.Gia,
                    GiaGoc = request.GiaGoc,
                    SKU = request.SKU,
                    DanhMucId = request.DanhMucId,
                    ThuongHieuId = request.ThuongHieuId,
                    SoLuongTon = request.SoLuongTon,
                    HinhAnhChinh = request.HinhAnhChinh,
                    DanhSachHinhAnh = request.DanhSachHinhAnh,
                    Video = request.Video,
                    Slug = request.Slug ?? GenerateSlug(request.Ten),
                    DangHoatDong = request.DangHoatDong,
                    DangKhuyenMai = request.DangKhuyenMai,
                    SanPhamNoiBat = request.SanPhamNoiBat,
                    NgayTao = DateTime.UtcNow
                };

                _context.SanPham.Add(sanPham);
                await _context.SaveChangesAsync();

                // Thêm biến thể nếu có
                if (request.DanhSachBienThe != null && request.DanhSachBienThe.Any())
                {
                    var bienThes = request.DanhSachBienThe.Select(b => new Models.SanPhamBienThe
                    {
                        SanPhamId = sanPham.Id,
                        KichThuoc = b.KichThuoc,
                        MauSac = b.MauSac,
                        SKU = b.SKU,
                        SoLuongTon = b.SoLuongTon,
                        Gia = b.Gia,
                        HinhAnh = b.HinhAnh,
                        DangHoatDong = b.DangHoatDong,
                        NgayTao = DateTime.UtcNow
                    }).ToList();

                    _context.SanPhamBienThe.AddRange(bienThes);
                    await _context.SaveChangesAsync();
                }

                return Ok(new { message = "Tạo sản phẩm thành công", id = sanPham.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tạo sản phẩm: {ex.Message}" });
            }
        }

        [HttpPut("sanpham/{id}")]
        public async Task<IActionResult> CapNhatSanPham(int id, [FromBody] CapNhatSanPhamRequest request)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var sanPham = await _context.SanPham.FindAsync(id);
                if (sanPham == null)
                {
                    return NotFound(new { message = "Sản phẩm không tồn tại" });
                }

                sanPham.Ten = request.Ten;
                sanPham.MoTa = request.MoTa;
                sanPham.MoTaChiTiet = request.MoTaChiTiet;
                sanPham.Gia = request.Gia;
                sanPham.GiaGoc = request.GiaGoc;
                sanPham.SKU = request.SKU;
                sanPham.DanhMucId = request.DanhMucId;
                sanPham.ThuongHieuId = request.ThuongHieuId;
                sanPham.SoLuongTon = request.SoLuongTon;
                sanPham.HinhAnhChinh = request.HinhAnhChinh;
                sanPham.DanhSachHinhAnh = request.DanhSachHinhAnh;
                sanPham.Video = request.Video;
                sanPham.Slug = request.Slug ?? GenerateSlug(request.Ten);
                sanPham.DangHoatDong = request.DangHoatDong;
                sanPham.DangKhuyenMai = request.DangKhuyenMai;
                sanPham.SanPhamNoiBat = request.SanPhamNoiBat;
                sanPham.NgayCapNhat = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Cập nhật sản phẩm thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi cập nhật sản phẩm: {ex.Message}" });
            }
        }

        [HttpDelete("sanpham/{id}")]
        public async Task<IActionResult> XoaSanPham(int id)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var sanPham = await _context.SanPham.FindAsync(id);
                if (sanPham == null)
                {
                    return NotFound(new { message = "Sản phẩm không tồn tại" });
                }

                // Soft delete - chỉ đánh dấu không hoạt động
                sanPham.DangHoatDong = false;
                sanPham.NgayCapNhat = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa sản phẩm thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi xóa sản phẩm: {ex.Message}" });
            }
        }

        // Quản lý Danh mục
        [HttpGet("danhmuc")]
        public async Task<IActionResult> GetDanhSachDanhMuc()
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var danhMuc = await _context.DanhMuc
                    .Include(d => d.DanhMucCha)
                    .OrderBy(d => d.ThuTuHienThi)
                    .ThenBy(d => d.Ten)
                    .Select(d => new
                    {
                        d.Id,
                        d.Ten,
                        d.MoTa,
                        d.HinhAnh,
                        d.DanhMucChaId,
                        DanhMucCha = d.DanhMucCha != null ? new { d.DanhMucCha.Id, d.DanhMucCha.Ten } : null,
                        d.ThuTuHienThi,
                        d.DangHoatDong,
                        d.NgayTao,
                        SoSanPham = d.DanhSachSanPham.Count
                    })
                    .ToListAsync();

                return Ok(danhMuc);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải danh sách danh mục: {ex.Message}" });
            }
        }

        [HttpPost("danhmuc")]
        public async Task<IActionResult> TaoDanhMuc([FromBody] TaoDanhMucRequest request)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var danhMuc = new Models.DanhMuc
                {
                    Ten = request.Ten,
                    MoTa = request.MoTa,
                    HinhAnh = request.HinhAnh,
                    DanhMucChaId = request.DanhMucChaId,
                    Slug = request.Slug ?? GenerateSlug(request.Ten),
                    ThuTuHienThi = request.ThuTuHienThi,
                    DangHoatDong = request.DangHoatDong,
                    NgayTao = DateTime.UtcNow
                };

                _context.DanhMuc.Add(danhMuc);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Tạo danh mục thành công", id = danhMuc.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tạo danh mục: {ex.Message}" });
            }
        }

        [HttpPut("danhmuc/{id}")]
        public async Task<IActionResult> CapNhatDanhMuc(int id, [FromBody] CapNhatDanhMucRequest request)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var danhMuc = await _context.DanhMuc.FindAsync(id);
                if (danhMuc == null)
                {
                    return NotFound(new { message = "Danh mục không tồn tại" });
                }

                danhMuc.Ten = request.Ten;
                danhMuc.MoTa = request.MoTa;
                danhMuc.HinhAnh = request.HinhAnh;
                danhMuc.DanhMucChaId = request.DanhMucChaId;
                danhMuc.Slug = request.Slug ?? GenerateSlug(request.Ten);
                danhMuc.ThuTuHienThi = request.ThuTuHienThi;
                danhMuc.DangHoatDong = request.DangHoatDong;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Cập nhật danh mục thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi cập nhật danh mục: {ex.Message}" });
            }
        }

        [HttpDelete("danhmuc/{id}")]
        public async Task<IActionResult> XoaDanhMuc(int id)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var danhMuc = await _context.DanhMuc
                    .Include(d => d.DanhSachSanPham)
                    .Include(d => d.DanhMucCon)
                    .FirstOrDefaultAsync(d => d.Id == id);

                if (danhMuc == null)
                {
                    return NotFound(new { message = "Danh mục không tồn tại" });
                }

                // Kiểm tra danh mục con (cả hoạt động và không hoạt động)
                var soDanhMucCon = await _context.DanhMuc.CountAsync(d => d.DanhMucChaId == id);
                if (soDanhMucCon > 0)
                {
                    return BadRequest(new { message = $"Không thể xóa danh mục đang có {soDanhMucCon} danh mục con. Vui lòng xóa hoặc di chuyển các danh mục con trước." });
                }

                // Kiểm tra sản phẩm (cả hoạt động và không hoạt động)
                var soSanPham = await _context.SanPham.CountAsync(s => s.DanhMucId == id);
                if (soSanPham > 0)
                {
                    return BadRequest(new { message = $"Không thể xóa danh mục đang có {soSanPham} sản phẩm. Vui lòng xóa hoặc di chuyển các sản phẩm trước." });
                }

                _context.DanhMuc.Remove(danhMuc);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa danh mục thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi xóa danh mục: {ex.Message}" });
            }
        }

        // Quản lý Thương hiệu
        [HttpGet("thuonghieu")]
        public async Task<IActionResult> GetDanhSachThuongHieu()
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var thuongHieu = await _context.ThuongHieu
                    .OrderBy(t => t.Ten)
                    .Select(t => new
                    {
                        t.Id,
                        t.Ten,
                        t.MoTa,
                        t.Logo,
                        t.TrangWeb,
                        t.Slug,
                        t.DangHoatDong,
                        t.NgayTao,
                        SoSanPham = t.DanhSachSanPham.Count
                    })
                    .ToListAsync();

                return Ok(thuongHieu);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải danh sách thương hiệu: {ex.Message}" });
            }
        }

        [HttpPost("thuonghieu")]
        public async Task<IActionResult> TaoThuongHieu([FromBody] TaoThuongHieuRequest request)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var thuongHieu = new Models.ThuongHieu
                {
                    Ten = request.Ten,
                    MoTa = request.MoTa,
                    Logo = request.Logo,
                    TrangWeb = request.TrangWeb,
                    Slug = request.Slug ?? GenerateSlug(request.Ten),
                    DangHoatDong = request.DangHoatDong,
                    NgayTao = DateTime.UtcNow
                };

                _context.ThuongHieu.Add(thuongHieu);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Tạo thương hiệu thành công", id = thuongHieu.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tạo thương hiệu: {ex.Message}" });
            }
        }

        [HttpPut("thuonghieu/{id}")]
        public async Task<IActionResult> CapNhatThuongHieu(int id, [FromBody] CapNhatThuongHieuRequest request)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var thuongHieu = await _context.ThuongHieu.FindAsync(id);
                if (thuongHieu == null)
                {
                    return NotFound(new { message = "Thương hiệu không tồn tại" });
                }

                thuongHieu.Ten = request.Ten;
                thuongHieu.MoTa = request.MoTa;
                thuongHieu.Logo = request.Logo;
                thuongHieu.TrangWeb = request.TrangWeb;
                thuongHieu.Slug = request.Slug ?? GenerateSlug(request.Ten);
                thuongHieu.DangHoatDong = request.DangHoatDong;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Cập nhật thương hiệu thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi cập nhật thương hiệu: {ex.Message}" });
            }
        }

        [HttpDelete("thuonghieu/{id}")]
        public async Task<IActionResult> XoaThuongHieu(int id)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var thuongHieu = await _context.ThuongHieu
                    .FirstOrDefaultAsync(t => t.Id == id);

                if (thuongHieu == null)
                {
                    return NotFound(new { message = "Thương hiệu không tồn tại" });
                }

                // Kiểm tra sản phẩm đang hoạt động
                var soSanPhamDangHoatDong = await _context.SanPham.CountAsync(s => s.ThuongHieuId == id && s.DangHoatDong);
                if (soSanPhamDangHoatDong > 0)
                {
                    return BadRequest(new { message = $"Không thể xóa thương hiệu đang có {soSanPhamDangHoatDong} sản phẩm đang hoạt động. Vui lòng xóa hoặc thay đổi thương hiệu cho các sản phẩm trước." });
                }

                // Kiểm tra tổng số sản phẩm (cả hoạt động và không hoạt động)
                var tongSoSanPham = await _context.SanPham.CountAsync(s => s.ThuongHieuId == id);
                if (tongSoSanPham > 0)
                {
                    // Có sản phẩm không hoạt động, vẫn có thể xóa (sản phẩm sẽ có ThuongHieuId = null)
                    // Nhưng cảnh báo người dùng
                    _context.ThuongHieu.Remove(thuongHieu);
                    await _context.SaveChangesAsync();
                    return Ok(new { message = $"Đã xóa thương hiệu. {tongSoSanPham} sản phẩm liên quan đã được gỡ bỏ thương hiệu." });
                }

                // Không có sản phẩm nào, xóa hoàn toàn
                _context.ThuongHieu.Remove(thuongHieu);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa thương hiệu thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi xóa thương hiệu: {ex.Message}" });
            }
        }

        // Quản lý Mã giảm giá
        [HttpGet("magiamgia")]
        public async Task<IActionResult> GetDanhSachMaGiamGia()
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var maGiamGia = await _context.MaGiamGia
                    .OrderByDescending(m => m.NgayTao)
                    .Select(m => new
                    {
                        m.Id,
                        m.Ma,
                        m.MoTa,
                        m.LoaiGiamGia,
                        m.GiaTriGiamGia,
                        m.GiaTriDonHangToiThieu,
                        m.GiaTriGiamGiaToiDa,
                        m.SoLuongSuDung,
                        m.SoLuongDaSuDung,
                        m.NgayBatDau,
                        m.NgayKetThuc,
                        m.DangHoatDong,
                        m.NgayTao
                    })
                    .ToListAsync();

                return Ok(maGiamGia);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải danh sách mã giảm giá: {ex.Message}" });
            }
        }

        [HttpPost("magiamgia")]
        public async Task<IActionResult> TaoMaGiamGia([FromBody] TaoMaGiamGiaRequest request)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                // Kiểm tra mã đã tồn tại chưa
                if (await _context.MaGiamGia.AnyAsync(m => m.Ma == request.Ma))
                {
                    return BadRequest(new { message = "Mã giảm giá đã tồn tại" });
                }

                var maGiamGia = new Models.MaGiamGia
                {
                    Ma = request.Ma,
                    MoTa = request.MoTa,
                    LoaiGiamGia = request.LoaiGiamGia,
                    GiaTriGiamGia = request.GiaTriGiamGia,
                    GiaTriDonHangToiThieu = request.GiaTriDonHangToiThieu,
                    GiaTriGiamGiaToiDa = request.GiaTriGiamGiaToiDa,
                    SoLuongSuDung = request.SoLuongSuDung,
                    NgayBatDau = request.NgayBatDau,
                    NgayKetThuc = request.NgayKetThuc,
                    DangHoatDong = request.DangHoatDong,
                    NgayTao = DateTime.UtcNow
                };

                _context.MaGiamGia.Add(maGiamGia);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Tạo mã giảm giá thành công", id = maGiamGia.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tạo mã giảm giá: {ex.Message}" });
            }
        }

        [HttpPut("magiamgia/{id}")]
        public async Task<IActionResult> CapNhatMaGiamGia(int id, [FromBody] CapNhatMaGiamGiaRequest request)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var maGiamGia = await _context.MaGiamGia.FindAsync(id);
                if (maGiamGia == null)
                {
                    return NotFound(new { message = "Mã giảm giá không tồn tại" });
                }

                // Kiểm tra mã đã tồn tại chưa (trừ chính nó)
                if (request.Ma != maGiamGia.Ma && await _context.MaGiamGia.AnyAsync(m => m.Ma == request.Ma))
                {
                    return BadRequest(new { message = "Mã giảm giá đã tồn tại" });
                }

                maGiamGia.Ma = request.Ma;
                maGiamGia.MoTa = request.MoTa;
                maGiamGia.LoaiGiamGia = request.LoaiGiamGia;
                maGiamGia.GiaTriGiamGia = request.GiaTriGiamGia;
                maGiamGia.GiaTriDonHangToiThieu = request.GiaTriDonHangToiThieu;
                maGiamGia.GiaTriGiamGiaToiDa = request.GiaTriGiamGiaToiDa;
                maGiamGia.SoLuongSuDung = request.SoLuongSuDung;
                maGiamGia.NgayBatDau = request.NgayBatDau;
                maGiamGia.NgayKetThuc = request.NgayKetThuc;
                maGiamGia.DangHoatDong = request.DangHoatDong;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Cập nhật mã giảm giá thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi cập nhật mã giảm giá: {ex.Message}" });
            }
        }

        [HttpDelete("magiamgia/{id}")]
        public async Task<IActionResult> XoaMaGiamGia(int id)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var maGiamGia = await _context.MaGiamGia.FindAsync(id);
                if (maGiamGia == null)
                {
                    return NotFound(new { message = "Mã giảm giá không tồn tại" });
                }

                _context.MaGiamGia.Remove(maGiamGia);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa mã giảm giá thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi xóa mã giảm giá: {ex.Message}" });
            }
        }

        // Quản lý kho
        [HttpGet("kho")]
        public async Task<IActionResult> GetDanhSachKho(
            [FromQuery] int? sanPhamId,
            [FromQuery] string? kichThuoc,
            [FromQuery] string? mauSac,
            [FromQuery] string? timKiem,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var query = _context.SanPhamBienThe
                    .Include(b => b.SanPham)
                        .ThenInclude(s => s.DanhMuc)
                    .Include(b => b.SanPham)
                        .ThenInclude(s => s.ThuongHieu)
                    .AsQueryable();

                if (sanPhamId.HasValue)
                {
                    query = query.Where(b => b.SanPhamId == sanPhamId.Value);
                }

                if (!string.IsNullOrEmpty(kichThuoc))
                {
                    query = query.Where(b => b.KichThuoc == kichThuoc);
                }

                if (!string.IsNullOrEmpty(mauSac))
                {
                    query = query.Where(b => b.MauSac == mauSac);
                }

                if (!string.IsNullOrEmpty(timKiem))
                {
                    query = query.Where(b => b.SanPham.Ten.Contains(timKiem) || 
                                            (b.SKU != null && b.SKU.Contains(timKiem)));
                }

                var totalCount = await query.CountAsync();
                var kho = await query
                    .OrderBy(b => b.SanPham.Ten)
                    .ThenBy(b => b.KichThuoc)
                    .ThenBy(b => b.MauSac)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(b => new
                    {
                        b.Id,
                        b.SanPhamId,
                        b.KichThuoc,
                        b.MauSac,
                        b.SKU,
                        b.SoLuongTon,
                        b.Gia,
                        b.HinhAnh,
                        b.DangHoatDong,
                        b.NgayTao,
                        SanPham = new
                        {
                            b.SanPham.Id,
                            b.SanPham.Ten,
                            b.SanPham.HinhAnhChinh,
                            b.SanPham.Gia,
                            DanhMuc = new { b.SanPham.DanhMuc.Id, b.SanPham.DanhMuc.Ten },
                            ThuongHieu = b.SanPham.ThuongHieu != null ? new { b.SanPham.ThuongHieu.Id, b.SanPham.ThuongHieu.Ten } : null
                        }
                    })
                    .ToListAsync();

                return Ok(new
                {
                    Data = kho,
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải danh sách kho: {ex.Message}" });
            }
        }

        [HttpGet("kho/thongke")]
        public async Task<IActionResult> GetThongKeKho()
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var tongSoLuong = await _context.SanPhamBienThe.SumAsync(b => (long?)b.SoLuongTon) ?? 0;
                var soBienThe = await _context.SanPhamBienThe.CountAsync();
                var soBienTheHetHang = await _context.SanPhamBienThe.CountAsync(b => b.SoLuongTon == 0);
                var soBienTheSapHetHang = await _context.SanPhamBienThe.CountAsync(b => b.SoLuongTon > 0 && b.SoLuongTon <= 10);

                // Lấy danh sách size và màu sắc duy nhất
                var danhSachSize = await _context.SanPhamBienThe
                    .Where(b => b.KichThuoc != null && b.KichThuoc != "")
                    .Select(b => b.KichThuoc)
                    .Distinct()
                    .OrderBy(s => s)
                    .ToListAsync();

                var danhSachMauSac = await _context.SanPhamBienThe
                    .Where(b => b.MauSac != null && b.MauSac != "")
                    .Select(b => b.MauSac)
                    .Distinct()
                    .OrderBy(m => m)
                    .ToListAsync();

                return Ok(new
                {
                    TongSoLuong = tongSoLuong,
                    SoBienThe = soBienThe,
                    SoBienTheHetHang = soBienTheHetHang,
                    SoBienTheSapHetHang = soBienTheSapHetHang,
                    DanhSachSize = danhSachSize,
                    DanhSachMauSac = danhSachMauSac
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải thống kê kho: {ex.Message}" });
            }
        }

        [HttpPut("kho/{id}/soluong")]
        public async Task<IActionResult> CapNhatSoLuongKho(int id, [FromBody] CapNhatSoLuongKhoRequest request)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var bienThe = await _context.SanPhamBienThe.FindAsync(id);
                if (bienThe == null)
                {
                    return NotFound(new { message = "Biến thể không tồn tại" });
                }

                bienThe.SoLuongTon = request.SoLuongTon;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Cập nhật số lượng thành công", soLuongTon = bienThe.SoLuongTon });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi cập nhật số lượng: {ex.Message}" });
            }
        }

        [HttpPost("kho")]
        public async Task<IActionResult> TaoBienThe([FromBody] TaoBienTheRequest request)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                // Kiểm tra sản phẩm tồn tại
                var sanPham = await _context.SanPham.FindAsync(request.SanPhamId);
                if (sanPham == null)
                {
                    return NotFound(new { message = "Sản phẩm không tồn tại" });
                }

                // Kiểm tra biến thể đã tồn tại chưa
                var daTonTai = await _context.SanPhamBienThe
                    .AnyAsync(b => b.SanPhamId == request.SanPhamId &&
                                  b.KichThuoc == request.KichThuoc &&
                                  b.MauSac == request.MauSac);

                if (daTonTai)
                {
                    return BadRequest(new { message = "Biến thể với size và màu này đã tồn tại" });
                }

                var bienThe = new Models.SanPhamBienThe
                {
                    SanPhamId = request.SanPhamId,
                    KichThuoc = request.KichThuoc,
                    MauSac = request.MauSac,
                    SKU = request.SKU,
                    SoLuongTon = request.SoLuongTon,
                    Gia = request.Gia,
                    HinhAnh = request.HinhAnh,
                    DangHoatDong = request.DangHoatDong,
                    NgayTao = DateTime.UtcNow
                };

                _context.SanPhamBienThe.Add(bienThe);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Tạo biến thể thành công", id = bienThe.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tạo biến thể: {ex.Message}" });
            }
        }

        [HttpPut("kho/{id}")]
        public async Task<IActionResult> CapNhatBienThe(int id, [FromBody] CapNhatBienTheRequest request)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var bienThe = await _context.SanPhamBienThe.FindAsync(id);
                if (bienThe == null)
                {
                    return NotFound(new { message = "Biến thể không tồn tại" });
                }

                // Kiểm tra nếu thay đổi size/màu thì không trùng với biến thể khác
                if (bienThe.KichThuoc != request.KichThuoc || bienThe.MauSac != request.MauSac)
                {
                    var daTonTai = await _context.SanPhamBienThe
                        .AnyAsync(b => b.SanPhamId == bienThe.SanPhamId &&
                                      b.Id != id &&
                                      b.KichThuoc == request.KichThuoc &&
                                      b.MauSac == request.MauSac);

                    if (daTonTai)
                    {
                        return BadRequest(new { message = "Biến thể với size và màu này đã tồn tại" });
                    }
                }

                bienThe.KichThuoc = request.KichThuoc;
                bienThe.MauSac = request.MauSac;
                bienThe.SKU = request.SKU;
                bienThe.SoLuongTon = request.SoLuongTon;
                bienThe.Gia = request.Gia;
                bienThe.HinhAnh = request.HinhAnh;
                bienThe.DangHoatDong = request.DangHoatDong;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Cập nhật biến thể thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi cập nhật biến thể: {ex.Message}" });
            }
        }

        [HttpDelete("kho/{id}")]
        public async Task<IActionResult> XoaBienThe(int id)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var bienThe = await _context.SanPhamBienThe.FindAsync(id);
                if (bienThe == null)
                {
                    return NotFound(new { message = "Biến thể không tồn tại" });
                }

                _context.SanPhamBienThe.Remove(bienThe);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa biến thể thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi xóa biến thể: {ex.Message}" });
            }
        }

        // Upload ảnh
        // Quản lý Đánh giá
        [HttpGet("danhgia")]
        public async Task<IActionResult> GetDanhSachDanhGia(
            [FromQuery] string? timKiem,
            [FromQuery] int? sanPhamId,
            [FromQuery] bool? hienThi,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var query = _context.DanhGiaSanPham
                    .Include(d => d.SanPham)
                    .Include(d => d.NguoiDung)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(timKiem))
                {
                    query = query.Where(d => d.NoiDung != null && d.NoiDung.Contains(timKiem) ||
                                            d.SanPham.Ten.Contains(timKiem) ||
                                            (d.NguoiDung.Ho + " " + d.NguoiDung.Ten).Contains(timKiem));
                }

                if (sanPhamId.HasValue)
                {
                    query = query.Where(d => d.SanPhamId == sanPhamId.Value);
                }

                if (hienThi.HasValue)
                {
                    query = query.Where(d => d.HienThi == hienThi.Value);
                }

                var totalCount = await query.CountAsync();
                var danhGias = await query
                    .OrderByDescending(d => d.NgayTao)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(d => new
                    {
                        d.Id,
                        d.SoSao,
                        d.NoiDung,
                        d.SoLuongThich,
                        d.HienThi,
                        d.DaXacNhanMua,
                        d.NgayTao,
                        SanPham = new
                        {
                            d.SanPham.Id,
                            d.SanPham.Ten,
                            d.SanPham.HinhAnhChinh
                        },
                        NguoiDung = new
                        {
                            d.NguoiDung.Id,
                            d.NguoiDung.Ho,
                            d.NguoiDung.Ten,
                            d.NguoiDung.Email
                        }
                    })
                    .ToListAsync();

                return Ok(new
                {
                    Data = danhGias,
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải danh sách đánh giá: {ex.Message}" });
            }
        }

        [HttpPut("danhgia/{id}/hienthi")]
        public async Task<IActionResult> CapNhatHienThiDanhGia(int id, [FromBody] CapNhatHienThiDanhGiaRequest request)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var danhGia = await _context.DanhGiaSanPham
                    .Include(d => d.SanPham)
                    .FirstOrDefaultAsync(d => d.Id == id);

                if (danhGia == null)
                {
                    return NotFound(new { message = "Đánh giá không tồn tại" });
                }

                danhGia.HienThi = request.HienThi;

                // Cập nhật lại điểm đánh giá trung bình của sản phẩm
                var danhGias = await _context.DanhGiaSanPham
                    .Where(d => d.SanPhamId == danhGia.SanPhamId && d.HienThi)
                    .ToListAsync();

                if (danhGias.Any())
                {
                    danhGia.SanPham.DiemDanhGiaTrungBinh = danhGias.Average(d => (double)d.SoSao);
                    danhGia.SanPham.SoLuongDanhGia = danhGias.Count;
                }
                else
                {
                    danhGia.SanPham.DiemDanhGiaTrungBinh = 0;
                    danhGia.SanPham.SoLuongDanhGia = 0;
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "Cập nhật trạng thái hiển thị thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi cập nhật trạng thái: {ex.Message}" });
            }
        }

        [HttpDelete("danhgia/{id}")]
        public async Task<IActionResult> XoaDanhGia(int id)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                var danhGia = await _context.DanhGiaSanPham
                    .Include(d => d.SanPham)
                    .FirstOrDefaultAsync(d => d.Id == id);

                if (danhGia == null)
                {
                    return NotFound(new { message = "Đánh giá không tồn tại" });
                }

                var sanPhamId = danhGia.SanPhamId;

                _context.DanhGiaSanPham.Remove(danhGia);
                await _context.SaveChangesAsync();

                // Cập nhật lại điểm đánh giá trung bình của sản phẩm
                var danhGias = await _context.DanhGiaSanPham
                    .Where(d => d.SanPhamId == sanPhamId && d.HienThi)
                    .ToListAsync();

                var sanPham = await _context.SanPham.FindAsync(sanPhamId);
                if (sanPham != null)
                {
                    if (danhGias.Any())
                    {
                        sanPham.DiemDanhGiaTrungBinh = danhGias.Average(d => (double)d.SoSao);
                        sanPham.SoLuongDanhGia = danhGias.Count;
                    }
                    else
                    {
                        sanPham.DiemDanhGiaTrungBinh = 0;
                        sanPham.SoLuongDanhGia = 0;
                    }
                    await _context.SaveChangesAsync();
                }

                return Ok(new { message = "Xóa đánh giá thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi xóa đánh giá: {ex.Message}" });
            }
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                if (file == null || file.Length == 0)
                {
                    return BadRequest(new { message = "Không có file được chọn" });
                }

                // Kiểm tra định dạng file
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(fileExtension))
                {
                    return BadRequest(new { message = "Định dạng file không được hỗ trợ. Chỉ chấp nhận: jpg, jpeg, png, gif, webp" });
                }

                // Kiểm tra kích thước file (tối đa 5MB)
                if (file.Length > 5 * 1024 * 1024)
                {
                    return BadRequest(new { message = "Kích thước file quá lớn. Tối đa 5MB" });
                }

                // Tạo tên file unique
                var fileName = $"{Guid.NewGuid()}{fileExtension}";
                var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                
                if (!Directory.Exists(uploadsPath))
                {
                    Directory.CreateDirectory(uploadsPath);
                }

                var filePath = Path.Combine(uploadsPath, fileName);

                // Lưu file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Trả về URL
                var fileUrl = $"/uploads/{fileName}";
                return Ok(new { url = fileUrl, fileName = fileName });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi upload ảnh: {ex.Message}" });
            }
        }

        // Helper method để tạo slug
        private string GenerateSlug(string text)
        {
            if (string.IsNullOrEmpty(text)) return string.Empty;
            
            return text.ToLower()
                .Replace(" ", "-")
                .Replace("đ", "d")
                .Replace("Đ", "D")
                .Replace("á", "a").Replace("à", "a").Replace("ả", "a").Replace("ã", "a").Replace("ạ", "a")
                .Replace("ă", "a").Replace("ắ", "a").Replace("ằ", "a").Replace("ẳ", "a").Replace("ẵ", "a").Replace("ặ", "a")
                .Replace("â", "a").Replace("ấ", "a").Replace("ầ", "a").Replace("ẩ", "a").Replace("ẫ", "a").Replace("ậ", "a")
                .Replace("é", "e").Replace("è", "e").Replace("ẻ", "e").Replace("ẽ", "e").Replace("ẹ", "e")
                .Replace("ê", "e").Replace("ế", "e").Replace("ề", "e").Replace("ể", "e").Replace("ễ", "e").Replace("ệ", "e")
                .Replace("í", "i").Replace("ì", "i").Replace("ỉ", "i").Replace("ĩ", "i").Replace("ị", "i")
                .Replace("ó", "o").Replace("ò", "o").Replace("ỏ", "o").Replace("õ", "o").Replace("ọ", "o")
                .Replace("ô", "o").Replace("ố", "o").Replace("ồ", "o").Replace("ổ", "o").Replace("ỗ", "o").Replace("ộ", "o")
                .Replace("ơ", "o").Replace("ớ", "o").Replace("ờ", "o").Replace("ở", "o").Replace("ỡ", "o").Replace("ợ", "o")
                .Replace("ú", "u").Replace("ù", "u").Replace("ủ", "u").Replace("ũ", "u").Replace("ụ", "u")
                .Replace("ư", "u").Replace("ứ", "u").Replace("ừ", "u").Replace("ử", "u").Replace("ữ", "u").Replace("ự", "u")
                .Replace("ý", "y").Replace("ỳ", "y").Replace("ỷ", "y").Replace("ỹ", "y").Replace("ỵ", "y");
        }

    // Request DTOs
    public class CapNhatTrangThaiRequest
    {
        [Required]
        public string TrangThai { get; set; } = string.Empty;
    }

    public class CapNhatTrangThaiNguoiDungRequest
    {
        [Required]
        public bool DangHoatDong { get; set; }
    }

    public class TaoSanPhamRequest
    {
        [Required]
        public string Ten { get; set; } = string.Empty;
        public string? MoTa { get; set; }
        public string? MoTaChiTiet { get; set; }
        [Required]
        public decimal Gia { get; set; }
        public decimal? GiaGoc { get; set; }
        public string? SKU { get; set; }
        [Required]
        public int DanhMucId { get; set; }
        public int? ThuongHieuId { get; set; }
        public int SoLuongTon { get; set; } = 0;
        public string? HinhAnhChinh { get; set; }
        public string? DanhSachHinhAnh { get; set; }
        public string? Video { get; set; }
        public string? Slug { get; set; }
        public bool DangHoatDong { get; set; } = true;
        public bool DangKhuyenMai { get; set; } = false;
        public bool SanPhamNoiBat { get; set; } = false;
        public List<BienTheRequest>? DanhSachBienThe { get; set; }
    }

    public class CapNhatSanPhamRequest
    {
        [Required]
        public string Ten { get; set; } = string.Empty;
        public string? MoTa { get; set; }
        public string? MoTaChiTiet { get; set; }
        [Required]
        public decimal Gia { get; set; }
        public decimal? GiaGoc { get; set; }
        public string? SKU { get; set; }
        [Required]
        public int DanhMucId { get; set; }
        public int? ThuongHieuId { get; set; }
        public int SoLuongTon { get; set; } = 0;
        public string? HinhAnhChinh { get; set; }
        public string? DanhSachHinhAnh { get; set; }
        public string? Video { get; set; }
        public string? Slug { get; set; }
        public bool DangHoatDong { get; set; } = true;
        public bool DangKhuyenMai { get; set; } = false;
        public bool SanPhamNoiBat { get; set; } = false;
    }

    public class BienTheRequest
    {
        public string? KichThuoc { get; set; }
        public string? MauSac { get; set; }
        public string? SKU { get; set; }
        public int SoLuongTon { get; set; } = 0;
        public decimal? Gia { get; set; }
        public string? HinhAnh { get; set; }
        public bool DangHoatDong { get; set; } = true;
    }

    public class TaoDanhMucRequest
    {
        [Required]
        public string Ten { get; set; } = string.Empty;
        public string? MoTa { get; set; }
        public string? HinhAnh { get; set; }
        public int? DanhMucChaId { get; set; }
        public string? Slug { get; set; }
        public int ThuTuHienThi { get; set; } = 0;
        public bool DangHoatDong { get; set; } = true;
    }

    public class CapNhatDanhMucRequest
    {
        [Required]
        public string Ten { get; set; } = string.Empty;
        public string? MoTa { get; set; }
        public string? HinhAnh { get; set; }
        public int? DanhMucChaId { get; set; }
        public string? Slug { get; set; }
        public int ThuTuHienThi { get; set; } = 0;
        public bool DangHoatDong { get; set; } = true;
    }

    public class TaoThuongHieuRequest
    {
        [Required]
        public string Ten { get; set; } = string.Empty;
        public string? MoTa { get; set; }
        public string? Logo { get; set; }
        public string? TrangWeb { get; set; }
        public string? Slug { get; set; }
        public bool DangHoatDong { get; set; } = true;
    }

    public class CapNhatThuongHieuRequest
    {
        [Required]
        public string Ten { get; set; } = string.Empty;
        public string? MoTa { get; set; }
        public string? Logo { get; set; }
        public string? TrangWeb { get; set; }
        public string? Slug { get; set; }
        public bool DangHoatDong { get; set; } = true;
    }

    public class TaoMaGiamGiaRequest
    {
        [Required]
        public string Ma { get; set; } = string.Empty;
        public string? MoTa { get; set; }
        [Required]
        public string LoaiGiamGia { get; set; } = "PhanTram";
        [Required]
        public decimal GiaTriGiamGia { get; set; }
        public decimal? GiaTriDonHangToiThieu { get; set; }
        public decimal? GiaTriGiamGiaToiDa { get; set; }
        public int? SoLuongSuDung { get; set; }
        [Required]
        public DateTime NgayBatDau { get; set; }
        [Required]
        public DateTime NgayKetThuc { get; set; }
        public bool DangHoatDong { get; set; } = true;
    }

    public class CapNhatMaGiamGiaRequest
    {
        [Required]
        public string Ma { get; set; } = string.Empty;
        public string? MoTa { get; set; }
        [Required]
        public string LoaiGiamGia { get; set; } = "PhanTram";
        [Required]
        public decimal GiaTriGiamGia { get; set; }
        public decimal? GiaTriDonHangToiThieu { get; set; }
        public decimal? GiaTriGiamGiaToiDa { get; set; }
        public int? SoLuongSuDung { get; set; }
        [Required]
        public DateTime NgayBatDau { get; set; }
        [Required]
        public DateTime NgayKetThuc { get; set; }
        public bool DangHoatDong { get; set; } = true;
    }

    public class CapNhatSoLuongKhoRequest
    {
        [Required]
        public int SoLuongTon { get; set; }
    }

    public class TaoBienTheRequest
    {
        [Required]
        public int SanPhamId { get; set; }
        public string? KichThuoc { get; set; }
        public string? MauSac { get; set; }
        public string? SKU { get; set; }
        public int SoLuongTon { get; set; } = 0;
        public decimal? Gia { get; set; }
        public string? HinhAnh { get; set; }
        public bool DangHoatDong { get; set; } = true;
    }

    public class CapNhatBienTheRequest
    {
        public string? KichThuoc { get; set; }
        public string? MauSac { get; set; }
        public string? SKU { get; set; }
        public int SoLuongTon { get; set; } = 0;
        public decimal? Gia { get; set; }
        public string? HinhAnh { get; set; }
        public bool DangHoatDong { get; set; } = true;
    }

    [HttpGet("banner")]
    public async Task<IActionResult> GetDanhSachBanner(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        try
        {
            if (!await IsAdminAsync())
            {
                return Forbid();
            }

            var query = _context.Banner.AsQueryable();

            var totalCount = await query.CountAsync();
            var banners = await query
                .OrderBy(b => b.ThuTuHienThi)
                .ThenByDescending(b => b.NgayTao)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(b => new
                {
                    b.Id,
                    b.TieuDe,
                    b.MoTa,
                    b.HinhAnh,
                    b.LienKet,
                    b.NutBam,
                    b.ThuTuHienThi,
                    b.DangHoatDong,
                    NgayBatDau = b.NgayBatDau,
                    NgayKetThuc = b.NgayKetThuc,
                    NgayTao = b.NgayTao,
                    NgayCapNhat = b.NgayCapNhat
                })
                .ToListAsync();

            return Ok(new
            {
                Data = banners,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            });
        }
        catch (Microsoft.EntityFrameworkCore.DbUpdateException)
        {
            // Lỗi database - có thể bảng chưa tồn tại
            return Ok(new
            {
                Data = new List<object>(),
                TotalCount = 0,
                Page = page,
                PageSize = pageSize,
                TotalPages = 0,
                Message = "Bảng Banner chưa được tạo. Vui lòng chạy migration."
            });
        }
        catch (Microsoft.Data.SqlClient.SqlException)
        {
            // Lỗi SQL - có thể bảng chưa tồn tại
            return Ok(new
            {
                Data = new List<object>(),
                TotalCount = 0,
                Page = page,
                PageSize = pageSize,
                TotalPages = 0,
                Message = "Bảng Banner chưa được tạo. Vui lòng chạy migration."
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Lỗi khi tải danh sách banner: {ex.Message}" });
        }
    }

    [HttpGet("banner/{id}")]
    public async Task<IActionResult> GetBannerById(int id)
    {
        try
        {
            if (!await IsAdminAsync())
            {
                return Forbid();
            }

            var banner = await _context.Banner.FindAsync(id);
            if (banner == null)
            {
                return NotFound();
            }

            return Ok(banner);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Lỗi khi tải banner: {ex.Message}" });
        }
    }

    [HttpPost("banner")]
    public async Task<IActionResult> TaoBanner([FromBody] TaoBannerRequest request)
    {
        try
        {
            if (!await IsAdminAsync())
            {
                return Forbid();
            }

            var banner = new Models.Banner
            {
                TieuDe = request.TieuDe,
                MoTa = request.MoTa,
                HinhAnh = request.HinhAnh,
                LienKet = request.LienKet,
                NutBam = request.NutBam,
                ThuTuHienThi = request.ThuTuHienThi,
                DangHoatDong = request.DangHoatDong,
                NgayBatDau = request.NgayBatDau,
                NgayKetThuc = request.NgayKetThuc,
                NgayTao = DateTime.UtcNow
            };

            _context.Banner.Add(banner);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Tạo banner thành công", id = banner.Id });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Lỗi khi tạo banner: {ex.Message}" });
        }
    }

    [HttpPut("banner/{id}")]
    public async Task<IActionResult> CapNhatBanner(int id, [FromBody] CapNhatBannerRequest request)
    {
        try
        {
            if (!await IsAdminAsync())
            {
                return Forbid();
            }

            var banner = await _context.Banner.FindAsync(id);
            if (banner == null)
            {
                return NotFound(new { message = "Banner không tồn tại" });
            }

            banner.TieuDe = request.TieuDe;
            banner.MoTa = request.MoTa;
            banner.HinhAnh = request.HinhAnh;
            banner.LienKet = request.LienKet;
            banner.NutBam = request.NutBam;
            banner.ThuTuHienThi = request.ThuTuHienThi;
            banner.DangHoatDong = request.DangHoatDong;
            banner.NgayBatDau = request.NgayBatDau;
            banner.NgayKetThuc = request.NgayKetThuc;
            banner.NgayCapNhat = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật banner thành công" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Lỗi khi cập nhật banner: {ex.Message}" });
        }
    }

    [HttpDelete("banner/{id}")]
    public async Task<IActionResult> XoaBanner(int id)
    {
        try
        {
            if (!await IsAdminAsync())
            {
                return Forbid();
            }

            var banner = await _context.Banner.FindAsync(id);
            if (banner == null)
            {
                return NotFound(new { message = "Banner không tồn tại" });
            }

            _context.Banner.Remove(banner);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa banner thành công" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Lỗi khi xóa banner: {ex.Message}" });
        }
    }

    // ========== QUẢN LÝ TIN TỨC ==========
    [HttpGet("tintuc")]
    public async Task<IActionResult> GetDanhSachTinTuc(
        [FromQuery] string? loai,
        [FromQuery] string? timKiem,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        try
        {
            if (!await IsAdminAsync())
            {
                return Forbid();
            }

            var query = _context.TinTuc.AsQueryable();

            if (!string.IsNullOrEmpty(loai))
            {
                query = query.Where(t => t.Loai == loai);
            }

            if (!string.IsNullOrEmpty(timKiem))
            {
                query = query.Where(t => t.TieuDe.Contains(timKiem) || 
                                         (t.TomTat != null && t.TomTat.Contains(timKiem)));
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
                    t.Loai,
                    t.SoLuotXem,
                    t.DangHoatDong,
                    t.NoiBat,
                    NgayDang = t.NgayDang ?? t.NgayTao,
                    NgayTao = t.NgayTao
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
            return StatusCode(500, new { message = $"Lỗi khi tải danh sách tin tức: {ex.Message}" });
        }
    }

    [HttpGet("tintuc/{id}")]
    public async Task<IActionResult> GetTinTucById(int id)
    {
        try
        {
            if (!await IsAdminAsync())
            {
                return Forbid();
            }

            var tinTuc = await _context.TinTuc.FindAsync(id);
            if (tinTuc == null)
            {
                return NotFound(new { message = "Tin tức không tồn tại" });
            }

            return Ok(tinTuc);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Lỗi khi tải tin tức: {ex.Message}" });
        }
    }

    [HttpPost("tintuc")]
    public async Task<IActionResult> TaoTinTuc([FromBody] TaoTinTucRequest request)
    {
        try
        {
            if (!await IsAdminAsync())
            {
                return Forbid();
            }

            var userId = GetUserId();
            if (userId == 0)
            {
                return Unauthorized(new { message = "Không xác định được người dùng" });
            }

            var tinTuc = new Models.TinTuc
            {
                TieuDe = request.TieuDe,
                TomTat = request.TomTat,
                NoiDung = request.NoiDung,
                HinhAnh = request.HinhAnh,
                Slug = request.Slug ?? GenerateSlug(request.TieuDe),
                Loai = request.Loai ?? "TinTuc",
                NguoiTaoId = userId,
                SoLuotXem = 0,
                DangHoatDong = request.DangHoatDong,
                NoiBat = request.NoiBat,
                NgayTao = DateTime.UtcNow,
                NgayDang = request.NgayDang ?? DateTime.UtcNow
            };

            _context.TinTuc.Add(tinTuc);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Tạo tin tức thành công", data = tinTuc });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Lỗi khi tạo tin tức: {ex.Message}" });
        }
    }

    [HttpPut("tintuc/{id}")]
    public async Task<IActionResult> CapNhatTinTuc(int id, [FromBody] CapNhatTinTucRequest request)
    {
        try
        {
            if (!await IsAdminAsync())
            {
                return Forbid();
            }

            var tinTuc = await _context.TinTuc.FindAsync(id);
            if (tinTuc == null)
            {
                return NotFound(new { message = "Tin tức không tồn tại" });
            }

            tinTuc.TieuDe = request.TieuDe;
            tinTuc.TomTat = request.TomTat;
            tinTuc.NoiDung = request.NoiDung;
            tinTuc.HinhAnh = request.HinhAnh;
            tinTuc.Slug = request.Slug ?? GenerateSlug(request.TieuDe);
            tinTuc.Loai = request.Loai ?? tinTuc.Loai;
            tinTuc.DangHoatDong = request.DangHoatDong;
            tinTuc.NoiBat = request.NoiBat;
            tinTuc.NgayCapNhat = DateTime.UtcNow;
            if (request.NgayDang.HasValue)
            {
                tinTuc.NgayDang = request.NgayDang;
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật tin tức thành công", data = tinTuc });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Lỗi khi cập nhật tin tức: {ex.Message}" });
        }
    }

    [HttpDelete("tintuc/{id}")]
    public async Task<IActionResult> XoaTinTuc(int id)
    {
        try
        {
            if (!await IsAdminAsync())
            {
                return Forbid();
            }

            var tinTuc = await _context.TinTuc.FindAsync(id);
            if (tinTuc == null)
            {
                return NotFound(new { message = "Tin tức không tồn tại" });
            }

            _context.TinTuc.Remove(tinTuc);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa tin tức thành công" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Lỗi khi xóa tin tức: {ex.Message}" });
        }
    }

    // Tạo thông báo Deal Hot
    [HttpPost("thongbao/deal-hot")]
    public async Task<IActionResult> TaoThongBaoDealHot([FromBody] TaoThongBaoDealHotRequest request)
        {
            try
            {
                if (!await IsAdminAsync())
                {
                    return Forbid();
                }

                if (string.IsNullOrEmpty(request.TieuDe) || string.IsNullOrEmpty(request.NoiDung))
                {
                    return BadRequest(new { message = "Tiêu đề và nội dung không được để trống" });
                }

                var sanPham = await _context.SanPham.FindAsync(request.SanPhamId);
                if (sanPham == null)
                {
                    return NotFound(new { message = "Sản phẩm không tồn tại" });
                }

                await Helpers.ThongBaoHelper.TaoThongBaoDealHot(
                    _context,
                    request.SanPhamId,
                    request.TieuDe,
                    request.NoiDung
                );

                return Ok(new { message = "Tạo thông báo deal hot thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tạo thông báo: {ex.Message}" });
            }
        }
    }

    public class TaoBannerRequest
    {
        [Required]
        public string TieuDe { get; set; } = string.Empty;
        public string? MoTa { get; set; }
        public string? HinhAnh { get; set; }
        public string? LienKet { get; set; }
        public string? NutBam { get; set; }
        public int ThuTuHienThi { get; set; } = 0;
        public bool DangHoatDong { get; set; } = true;
        public DateTime NgayBatDau { get; set; } = DateTime.UtcNow;
        public DateTime? NgayKetThuc { get; set; }
    }

    public class CapNhatBannerRequest
    {
        [Required]
        public string TieuDe { get; set; } = string.Empty;
        public string? MoTa { get; set; }
        public string? HinhAnh { get; set; }
        public string? LienKet { get; set; }
        public string? NutBam { get; set; }
        public int ThuTuHienThi { get; set; } = 0;
        public bool DangHoatDong { get; set; } = true;
        public DateTime NgayBatDau { get; set; } = DateTime.UtcNow;
        public DateTime? NgayKetThuc { get; set; }
    }

    public class TaoTinTucRequest
    {
        [Required]
        public string TieuDe { get; set; } = string.Empty;
        public string? TomTat { get; set; }
        public string? NoiDung { get; set; }
        public string? HinhAnh { get; set; }
        public string? Slug { get; set; }
        public string? Loai { get; set; } = "TinTuc";
        public bool DangHoatDong { get; set; } = true;
        public bool NoiBat { get; set; } = false;
        public DateTime? NgayDang { get; set; }
    }

    public class CapNhatTinTucRequest
    {
        [Required]
        public string TieuDe { get; set; } = string.Empty;
        public string? TomTat { get; set; }
        public string? NoiDung { get; set; }
        public string? HinhAnh { get; set; }
        public string? Slug { get; set; }
        public string? Loai { get; set; }
        public bool DangHoatDong { get; set; } = true;
        public bool NoiBat { get; set; } = false;
        public DateTime? NgayDang { get; set; }
    }

    public class TaoThongBaoDealHotRequest
    {
        [Required]
        public int SanPhamId { get; set; }

        [Required]
        [MaxLength(200)]
        public string TieuDe { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? NoiDung { get; set; }
    }

    public class CapNhatHienThiDanhGiaRequest
    {
        [Required]
        public bool HienThi { get; set; }
    }
}

