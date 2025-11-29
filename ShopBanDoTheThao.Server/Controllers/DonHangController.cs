using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopBanDoTheThao.Server.Data;
using ShopBanDoTheThao.Server.Helpers;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace ShopBanDoTheThao.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DonHangController : ControllerBase
    {
        private readonly ShopBanDoTheThaoDbContext _context;

        public DonHangController(ShopBanDoTheThaoDbContext context)
        {
            _context = context;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim ?? "0");
        }

        [HttpGet]
        public async Task<IActionResult> GetDonHang()
        {
            try
            {
                var userId = GetUserId();
                var donHang = await _context.DonHang
                    .Where(o => o.NguoiDungId == userId)
                    .OrderByDescending(o => o.NgayDat)
                    .Select(o => new
                    {
                        o.Id,
                        o.MaDonHang,
                        o.NgayDat,
                        o.NgayCapNhat,
                        o.TongTienSanPham,
                        o.PhiVanChuyen,
                        o.GiamGia,
                        o.Thue,
                        o.TongTien,
                        o.TrangThai,
                        o.TrangThaiThanhToan,
                        o.PhuongThucGiaoHang,
                        o.MaVanDon,
                        o.ViTriHienTai,
                        o.LyDoHoanTra,
                        o.GhiChu,
                        DiaChiGiaoHang = o.DiaChiGiaoHang != null ? new
                        {
                            o.DiaChiGiaoHang.Id,
                            o.DiaChiGiaoHang.TenNguoiNhan,
                            o.DiaChiGiaoHang.SoDienThoaiNhan,
                            o.DiaChiGiaoHang.DuongPho,
                            o.DiaChiGiaoHang.PhuongXa,
                            o.DiaChiGiaoHang.QuanHuyen,
                            o.DiaChiGiaoHang.ThanhPho
                        } : null,
                        PhuongThucThanhToan = o.PhuongThucThanhToan != null ? new
                        {
                            o.PhuongThucThanhToan.Id,
                            o.PhuongThucThanhToan.Loai,
                            o.PhuongThucThanhToan.NhaCungCap,
                            o.PhuongThucThanhToan.SoThe,
                            o.PhuongThucThanhToan.TenChuThe
                        } : null,
                        DanhSachChiTiet = o.DanhSachChiTiet.Select(d => new
                        {
                            d.Id,
                            d.SoLuong,
                            d.Gia,
                            d.GiamGia,
                            d.ThanhTien,
                            d.KichThuoc,
                            d.MauSac,
                            SanPham = new
                            {
                                d.SanPham.Id,
                                d.SanPham.Ten,
                                d.SanPham.HinhAnhChinh,
                                d.SanPham.Slug
                            }
                        }).ToList()
                    })
                    .ToListAsync();

                return Ok(donHang);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải danh sách đơn hàng: {ex.Message}" });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDonHangById(int id)
        {
            try
            {
                var userId = GetUserId();
                var donHang = await _context.DonHang
                    .Where(o => o.Id == id && o.NguoiDungId == userId)
                    .Select(o => new
                    {
                        o.Id,
                        o.MaDonHang,
                        o.NgayDat,
                        o.NgayCapNhat,
                        o.TongTienSanPham,
                        o.PhiVanChuyen,
                        o.GiamGia,
                        o.Thue,
                        o.TongTien,
                        o.TrangThai,
                        o.TrangThaiThanhToan,
                        o.PhuongThucGiaoHang,
                        o.MaVanDon,
                        o.ViTriHienTai,
                        o.LyDoHoanTra,
                        o.GhiChu,
                        o.MaGiamGia,
                        DiaChiGiaoHang = o.DiaChiGiaoHang != null ? new
                        {
                            o.DiaChiGiaoHang.Id,
                            o.DiaChiGiaoHang.TenNguoiNhan,
                            o.DiaChiGiaoHang.SoDienThoaiNhan,
                            o.DiaChiGiaoHang.DuongPho,
                            o.DiaChiGiaoHang.PhuongXa,
                            o.DiaChiGiaoHang.QuanHuyen,
                            o.DiaChiGiaoHang.ThanhPho,
                            o.DiaChiGiaoHang.MaBuuChinh,
                            o.DiaChiGiaoHang.LoaiDiaChi
                        } : null,
                        PhuongThucThanhToan = o.PhuongThucThanhToan != null ? new
                        {
                            o.PhuongThucThanhToan.Id,
                            o.PhuongThucThanhToan.Loai,
                            o.PhuongThucThanhToan.NhaCungCap,
                            o.PhuongThucThanhToan.SoThe,
                            o.PhuongThucThanhToan.TenChuThe
                        } : null,
                        DanhSachChiTiet = o.DanhSachChiTiet.Select(d => new
                        {
                            d.Id,
                            d.SoLuong,
                            d.Gia,
                            d.GiamGia,
                            d.ThanhTien,
                            d.KichThuoc,
                            d.MauSac,
                            SanPham = new
                            {
                                d.SanPham.Id,
                                d.SanPham.Ten,
                                d.SanPham.MoTa,
                                d.SanPham.Gia,
                                d.SanPham.HinhAnhChinh,
                                d.SanPham.Slug
                            }
                        }).ToList()
                    })
                    .FirstOrDefaultAsync();

                if (donHang == null)
                {
                    return NotFound(new { message = "Đơn hàng không tồn tại" });
                }

                return Ok(donHang);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải đơn hàng: {ex.Message}" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> TaoDonHang([FromBody] TaoDonHangRequest request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest(new { message = "Request body không hợp lệ" });
                }

                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                    return BadRequest(new { message = "Dữ liệu không hợp lệ", errors = errors });
                }

                var userId = GetUserId();
                if (userId == 0)
                {
                    return Unauthorized(new { message = "Người dùng không hợp lệ" });
                }

                if (request.DiaChiGiaoHangId <= 0)
                {
                    return BadRequest(new { message = "Địa chỉ giao hàng không hợp lệ" });
                }

                // Kiểm tra địa chỉ giao hàng
                var diaChi = await _context.DiaChi
                    .FirstOrDefaultAsync(a => a.Id == request.DiaChiGiaoHangId && a.NguoiDungId == userId);

                if (diaChi == null)
                {
                    return BadRequest(new { message = "Địa chỉ giao hàng không hợp lệ hoặc không thuộc về bạn" });
                }

                // Lấy giỏ hàng
                var gioHangItems = await _context.GioHangItem
                    .Include(g => g.SanPham)
                    .Where(g => g.NguoiDungId == userId)
                    .ToListAsync();

                if (!gioHangItems.Any())
                {
                    return BadRequest(new { message = "Giỏ hàng trống. Vui lòng thêm sản phẩm vào giỏ hàng trước khi đặt hàng." });
                }

                // Kiểm tra sản phẩm còn tồn tại và đang hoạt động
                var sanPhamKhongHopLe = gioHangItems.Where(g => g.SanPham == null || !g.SanPham.DangHoatDong).ToList();
                if (sanPhamKhongHopLe.Any())
                {
                    return BadRequest(new { message = "Một số sản phẩm trong giỏ hàng không còn tồn tại hoặc đã ngừng bán" });
                }

                // Tính toán tổng tiền (kiểm tra flash sale)
                var now = DateTime.UtcNow;
                var flashSales = await _context.FlashSale
                    .Include(fs => fs.DanhSachSanPham)
                    .Where(fs => fs.DangHoatDong &&
                                fs.ThoiGianBatDau <= now &&
                                fs.ThoiGianKetThuc >= now)
                    .ToListAsync();

                decimal tongTienSanPham = 0;
                foreach (var item in gioHangItems)
                {
                    decimal giaBan = item.SanPham.Gia;
                    
                    // Kiểm tra flash sale
                    foreach (var flashSale in flashSales)
                    {
                        var flashSaleSanPham = flashSale.DanhSachSanPham
                            .FirstOrDefault(fsp => fsp.SanPhamId == item.SanPhamId && fsp.DangHoatDong);
                        if (flashSaleSanPham != null)
                        {
                            giaBan = flashSaleSanPham.GiaFlashSale;
                            break;
                        }
                    }
                    
                    tongTienSanPham += giaBan * item.SoLuong;
                }

                decimal giamGia = 0;
                if (!string.IsNullOrEmpty(request.MaGiamGia))
                {
                    // Chuyển giờ VN sang UTC để so sánh với DB (DB lưu UTC)
                    var nowVietnam = DateTimeHelper.GetVietnamTime();
                    var nowUtc = DateTimeHelper.ToUtcTime(nowVietnam);
                    var maGiamGia = await _context.MaGiamGia
                        .FirstOrDefaultAsync(m => m.Ma == request.MaGiamGia && 
                                                 m.DangHoatDong &&
                                                 m.NgayBatDau <= nowUtc &&
                                                 m.NgayKetThuc >= nowUtc);

                    if (maGiamGia != null && 
                        (maGiamGia.SoLuongSuDung == null || maGiamGia.SoLuongDaSuDung < maGiamGia.SoLuongSuDung))
                    {
                        if (maGiamGia.LoaiGiamGia == "PhanTram")
                        {
                            giamGia = tongTienSanPham * (maGiamGia.GiaTriGiamGia / 100);
                            if (maGiamGia.GiaTriGiamGiaToiDa.HasValue && giamGia > maGiamGia.GiaTriGiamGiaToiDa.Value)
                            {
                                giamGia = maGiamGia.GiaTriGiamGiaToiDa.Value;
                            }
                        }
                        else
                        {
                            giamGia = maGiamGia.GiaTriGiamGia;
                        }
                    }
                }

                decimal phiVanChuyen = request.PhiVanChuyen;
                decimal thue = (tongTienSanPham - giamGia) * 0.1m; // 10% VAT
                decimal tongTien = tongTienSanPham - giamGia + phiVanChuyen + thue;

                // Tạo đơn hàng
                var donHang = new Models.DonHang
                {
                    MaDonHang = $"DH{DateTimeHelper.GetVietnamTime():yyyyMMddHHmmss}{userId}",
                    NguoiDungId = userId,
                    DiaChiGiaoHangId = request.DiaChiGiaoHangId,
                    PhuongThucThanhToanId = request.PhuongThucThanhToanId,
                    TongTienSanPham = tongTienSanPham,
                    PhiVanChuyen = phiVanChuyen,
                    GiamGia = giamGia,
                    Thue = thue,
                    TongTien = tongTien,
                    MaGiamGia = request.MaGiamGia,
                    TrangThai = "ChoXacNhan",
                    TrangThaiThanhToan = "ChuaThanhToan",
                    PhuongThucGiaoHang = request.PhuongThucGiaoHang,
                    GhiChu = request.GhiChu,
                    NgayDat = DateTimeHelper.ToUtcTime(DateTimeHelper.GetVietnamTime())
                };

                _context.DonHang.Add(donHang);
                await _context.SaveChangesAsync(); // Save để có ID

                // Tạo thông báo tự động khi đặt hàng thành công
                await Helpers.ThongBaoHelper.TaoThongBaoDonHang(_context, donHang.Id, userId, "", "ChoXacNhan");

                // Tạo chi tiết đơn hàng
                foreach (var item in gioHangItems)
                {
                    // Reload sản phẩm từ database để đảm bảo Entity Framework track đúng
                    var sanPhamToUpdate = await _context.SanPham.FindAsync(item.SanPhamId);
                    if (sanPhamToUpdate == null)
                    {
                        _context.DonHang.Remove(donHang);
                        await _context.SaveChangesAsync();
                        return BadRequest(new { message = $"Sản phẩm không tồn tại" });
                    }

                    // Tìm biến thể sản phẩm nếu có size/màu
                    Models.SanPhamBienThe? bienThe = null;
                    if (!string.IsNullOrEmpty(item.KichThuoc) || !string.IsNullOrEmpty(item.MauSac))
                    {
                        bienThe = await _context.SanPhamBienThe
                            .FirstOrDefaultAsync(b => b.SanPhamId == item.SanPhamId &&
                                                      (b.KichThuoc == item.KichThuoc || (b.KichThuoc == null && item.KichThuoc == null)) &&
                                                      (b.MauSac == item.MauSac || (b.MauSac == null && item.MauSac == null)) &&
                                                      b.DangHoatDong);
                    }

                    // Kiểm tra số lượng tồn kho
                    int soLuongTonKiemTra = bienThe != null ? bienThe.SoLuongTon : sanPhamToUpdate.SoLuongTon;
                    if (soLuongTonKiemTra < item.SoLuong)
                    {
                        _context.DonHang.Remove(donHang);
                        await _context.SaveChangesAsync();
                        var thongTinBienThe = bienThe != null 
                            ? $" (Size: {item.KichThuoc}, Màu: {item.MauSac})" 
                            : "";
                        return BadRequest(new { message = $"Sản phẩm {sanPhamToUpdate.Ten}{thongTinBienThe} không đủ số lượng tồn kho. Chỉ còn {soLuongTonKiemTra} sản phẩm" });
                    }

                    // Lấy giá từ biến thể nếu có, nếu không thì dùng giá sản phẩm
                    decimal giaBan = bienThe?.Gia ?? sanPhamToUpdate.Gia;

                    // Kiểm tra flash sale đang diễn ra cho sản phẩm này
                    var flashSaleSanPham = await _context.FlashSaleSanPham
                        .Include(fsp => fsp.FlashSale)
                        .FirstOrDefaultAsync(fsp => fsp.SanPhamId == item.SanPhamId &&
                                                    fsp.DangHoatDong &&
                                                    fsp.FlashSale.DangHoatDong &&
                                                    fsp.FlashSale.ThoiGianBatDau <= now &&
                                                    fsp.FlashSale.ThoiGianKetThuc >= now);

                    if (flashSaleSanPham != null)
                    {
                        // Sử dụng giá flash sale
                        giaBan = flashSaleSanPham.GiaFlashSale;
                        
                        // Cập nhật số lượng đã bán trong flash sale
                        flashSaleSanPham.SoLuongDaBan += item.SoLuong;
                    }

                    var chiTiet = new Models.DonHangChiTiet
                    {
                        DonHangId = donHang.Id,
                        SanPhamId = item.SanPhamId,
                        SoLuong = item.SoLuong,
                        Gia = giaBan,
                        ThanhTien = giaBan * item.SoLuong,
                        KichThuoc = item.KichThuoc,
                        MauSac = item.MauSac
                    };
                    _context.DonHangChiTiet.Add(chiTiet);

                    // Cập nhật số lượng tồn kho của biến thể hoặc sản phẩm chính
                    if (bienThe != null)
                    {
                        bienThe.SoLuongTon -= item.SoLuong;
                    }
                    else
                    {
                        sanPhamToUpdate.SoLuongTon -= item.SoLuong;
                    }
                    
                    // Cập nhật số lượng bán của sản phẩm chính
                    sanPhamToUpdate.SoLuongBan += item.SoLuong;
                }

                // Xóa giỏ hàng
                _context.GioHangItem.RemoveRange(gioHangItems);

                await _context.SaveChangesAsync();

                // Trả về đơn hàng đã tạo với dữ liệu đã project
                var donHangResponse = await _context.DonHang
                    .Where(o => o.Id == donHang.Id)
                    .Select(o => new
                    {
                        o.Id,
                        o.MaDonHang,
                        o.NgayDat,
                        o.NgayCapNhat,
                        o.TongTienSanPham,
                        o.PhiVanChuyen,
                        o.GiamGia,
                        o.Thue,
                        o.TongTien,
                        o.TrangThai,
                        o.TrangThaiThanhToan,
                        o.PhuongThucGiaoHang,
                        o.MaVanDon,
                        o.ViTriHienTai,
                        o.LyDoHoanTra,
                        o.GhiChu,
                        o.MaGiamGia,
                        DiaChiGiaoHang = o.DiaChiGiaoHang != null ? new
                        {
                            o.DiaChiGiaoHang.Id,
                            o.DiaChiGiaoHang.TenNguoiNhan,
                            o.DiaChiGiaoHang.SoDienThoaiNhan,
                            o.DiaChiGiaoHang.DuongPho,
                            o.DiaChiGiaoHang.PhuongXa,
                            o.DiaChiGiaoHang.QuanHuyen,
                            o.DiaChiGiaoHang.ThanhPho
                        } : null,
                        PhuongThucThanhToan = o.PhuongThucThanhToan != null ? new
                        {
                            o.PhuongThucThanhToan.Id,
                            o.PhuongThucThanhToan.Loai,
                            o.PhuongThucThanhToan.NhaCungCap,
                            o.PhuongThucThanhToan.SoThe,
                            o.PhuongThucThanhToan.TenChuThe
                        } : null,
                        DanhSachChiTiet = o.DanhSachChiTiet.Select(d => new
                        {
                            d.Id,
                            d.SoLuong,
                            d.Gia,
                            d.GiamGia,
                            d.ThanhTien,
                            d.KichThuoc,
                            d.MauSac,
                            SanPham = new
                            {
                                d.SanPham.Id,
                                d.SanPham.Ten,
                                d.SanPham.HinhAnhChinh,
                                d.SanPham.Slug
                            }
                        }).ToList()
                    })
                    .FirstOrDefaultAsync();

                return Ok(donHangResponse);
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new { message = $"Lỗi database khi tạo đơn hàng: {ex.InnerException?.Message ?? ex.Message}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tạo đơn hàng: {ex.Message}", stackTrace = ex.StackTrace });
            }
        }

        [HttpPut("{id}/huy")]
        public async Task<IActionResult> HuyDonHang(int id, [FromBody] HuyDonHangRequest? request = null)
        {
            var userId = GetUserId();
            var donHang = await _context.DonHang
                .Include(o => o.DanhSachChiTiet)
                .FirstOrDefaultAsync(o => o.Id == id && o.NguoiDungId == userId);

            if (donHang == null)
            {
                return NotFound();
            }

            // Chỉ cho phép hủy khi đơn hàng ở trạng thái Chờ xác nhận hoặc Đã xác nhận
            // Không cho phép hủy khi đơn hàng đang giao, đã giao, đã hủy, hoặc hoàn trả
            if (donHang.TrangThai != "ChoXacNhan" && donHang.TrangThai != "DaXacNhan")
            {
                if (donHang.TrangThai == "DangGiao")
                {
                    return BadRequest(new { message = "Không thể hủy đơn hàng đang được giao. Vui lòng liên hệ với cửa hàng nếu cần hỗ trợ." });
                }
                return BadRequest(new { message = "Chỉ có thể hủy đơn hàng đang chờ xác nhận hoặc đã xác nhận" });
            }

            // Hoàn lại số lượng tồn kho
            foreach (var chiTiet in donHang.DanhSachChiTiet)
            {
                var sanPham = await _context.SanPham.FindAsync(chiTiet.SanPhamId);
                if (sanPham != null)
                {
                    // Tìm biến thể sản phẩm nếu có size/màu
                    Models.SanPhamBienThe? bienThe = null;
                    if (!string.IsNullOrEmpty(chiTiet.KichThuoc) || !string.IsNullOrEmpty(chiTiet.MauSac))
                    {
                        bienThe = await _context.SanPhamBienThe
                            .FirstOrDefaultAsync(b => b.SanPhamId == chiTiet.SanPhamId &&
                                                      (b.KichThuoc == chiTiet.KichThuoc || (b.KichThuoc == null && chiTiet.KichThuoc == null)) &&
                                                      (b.MauSac == chiTiet.MauSac || (b.MauSac == null && chiTiet.MauSac == null)));
                    }

                    // Hoàn lại số lượng tồn kho của biến thể hoặc sản phẩm chính
                    if (bienThe != null)
                    {
                        bienThe.SoLuongTon += chiTiet.SoLuong;
                    }
                    else
                    {
                        sanPham.SoLuongTon += chiTiet.SoLuong;
                    }
                    
                    // Giảm số lượng bán
                    sanPham.SoLuongBan = Math.Max(0, sanPham.SoLuongBan - chiTiet.SoLuong);
                }
            }

            var trangThaiCu = donHang.TrangThai;
            donHang.TrangThai = "DaHuy";
            donHang.NgayCapNhat = DateTimeHelper.ToUtcTime(DateTimeHelper.GetVietnamTime());
            
            // Lưu lý do hủy nếu có
            if (request != null && !string.IsNullOrEmpty(request.LyDoHuy))
            {
                donHang.LyDoHoanTra = request.LyDoHuy;
            }
            
            await _context.SaveChangesAsync();

            // Tạo thông báo tự động cho khách hàng
            await Helpers.ThongBaoHelper.TaoThongBaoDonHang(_context, donHang.Id, userId, trangThaiCu, "DaHuy", request?.LyDoHuy);

            // Tạo thông báo cho admin
            await Helpers.ThongBaoHelper.TaoThongBaoAdminDonHang(_context, donHang.Id, "HuyDonHang", request?.LyDoHuy);

            // Trả về đơn hàng đã cập nhật với dữ liệu đã project
            var donHangResponse = await _context.DonHang
                .Where(o => o.Id == id)
                .Select(o => new
                {
                    o.Id,
                    o.MaDonHang,
                    o.NgayDat,
                    o.NgayCapNhat,
                    o.TongTienSanPham,
                    o.PhiVanChuyen,
                    o.GiamGia,
                    o.Thue,
                    o.TongTien,
                    o.TrangThai,
                    o.TrangThaiThanhToan,
                    o.PhuongThucGiaoHang,
                    o.GhiChu,
                    DiaChiGiaoHang = o.DiaChiGiaoHang != null ? new
                    {
                        o.DiaChiGiaoHang.Id,
                        o.DiaChiGiaoHang.TenNguoiNhan,
                        o.DiaChiGiaoHang.SoDienThoaiNhan,
                        o.DiaChiGiaoHang.DuongPho,
                        o.DiaChiGiaoHang.PhuongXa,
                        o.DiaChiGiaoHang.QuanHuyen,
                        o.DiaChiGiaoHang.ThanhPho
                    } : null,
                    PhuongThucThanhToan = o.PhuongThucThanhToan != null ? new
                    {
                        o.PhuongThucThanhToan.Id,
                        o.PhuongThucThanhToan.Loai,
                        o.PhuongThucThanhToan.NhaCungCap,
                        o.PhuongThucThanhToan.SoThe,
                        o.PhuongThucThanhToan.TenChuThe
                    } : null,
                    DanhSachChiTiet = o.DanhSachChiTiet.Select(d => new
                    {
                        d.Id,
                        d.SoLuong,
                        d.Gia,
                        d.GiamGia,
                        d.ThanhTien,
                        d.KichThuoc,
                        d.MauSac,
                        SanPham = new
                        {
                            d.SanPham.Id,
                            d.SanPham.Ten,
                            d.SanPham.HinhAnhChinh,
                            d.SanPham.Slug
                        }
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            return Ok(donHangResponse);
        }

        [HttpPut("{id}/hoan-tra")]
        public async Task<IActionResult> HoanTraDonHang(int id, [FromBody] HoanTraDonHangRequest request)
        {
            try
            {
                var userId = GetUserId();
                var donHang = await _context.DonHang
                    .Include(o => o.DanhSachChiTiet)
                    .FirstOrDefaultAsync(o => o.Id == id && o.NguoiDungId == userId);

                if (donHang == null)
                {
                    return NotFound(new { message = "Đơn hàng không tồn tại" });
                }

                // Chỉ cho phép hoàn trả khi đơn hàng đã giao
                if (donHang.TrangThai != "DaGiao")
                {
                    return BadRequest(new { message = "Chỉ có thể hoàn trả đơn hàng đã được giao" });
                }

                // Hoàn lại số lượng tồn kho
                foreach (var chiTiet in donHang.DanhSachChiTiet)
                {
                    var sanPham = await _context.SanPham.FindAsync(chiTiet.SanPhamId);
                    if (sanPham != null)
                    {
                        // Tìm biến thể sản phẩm nếu có size/màu
                        Models.SanPhamBienThe? bienThe = null;
                        if (!string.IsNullOrEmpty(chiTiet.KichThuoc) || !string.IsNullOrEmpty(chiTiet.MauSac))
                        {
                            bienThe = await _context.SanPhamBienThe
                                .FirstOrDefaultAsync(b => b.SanPhamId == chiTiet.SanPhamId &&
                                                          (b.KichThuoc == chiTiet.KichThuoc || (b.KichThuoc == null && chiTiet.KichThuoc == null)) &&
                                                          (b.MauSac == chiTiet.MauSac || (b.MauSac == null && chiTiet.MauSac == null)));
                        }

                        // Hoàn lại số lượng tồn kho của biến thể hoặc sản phẩm chính
                        if (bienThe != null)
                        {
                            bienThe.SoLuongTon += chiTiet.SoLuong;
                        }
                        else
                        {
                            sanPham.SoLuongTon += chiTiet.SoLuong;
                        }
                        
                        // Giảm số lượng bán
                        sanPham.SoLuongBan = Math.Max(0, sanPham.SoLuongBan - chiTiet.SoLuong);
                    }
                }

                var trangThaiCu = donHang.TrangThai;
                var trangThaiCuHoanTra = donHang.TrangThai;
                donHang.TrangThai = "HoanTra";
                donHang.LyDoHoanTra = request.LyDo;
                donHang.NgayCapNhat = DateTimeHelper.ToUtcTime(DateTimeHelper.GetVietnamTime());
                await _context.SaveChangesAsync();

                // Tạo thông báo tự động cho khách hàng
                await Helpers.ThongBaoHelper.TaoThongBaoDonHang(_context, donHang.Id, userId, trangThaiCuHoanTra, "HoanTra");

                // Tạo thông báo cho admin
                await Helpers.ThongBaoHelper.TaoThongBaoAdminDonHang(_context, donHang.Id, "HoanTra", request.LyDo);

                return Ok(new { message = "Yêu cầu hoàn trả đã được gửi thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi xử lý hoàn trả: {ex.Message}" });
            }
        }

        [HttpPut("{id}/tracking")]
        public async Task<IActionResult> CapNhatTracking(int id, [FromBody] CapNhatTrackingRequest request)
        {
            try
            {
                var userId = GetUserId();
                var donHang = await _context.DonHang
                    .FirstOrDefaultAsync(o => o.Id == id && o.NguoiDungId == userId);

                if (donHang == null)
                {
                    return NotFound(new { message = "Đơn hàng không tồn tại" });
                }

                // Chỉ cho phép cập nhật tracking khi đơn hàng đang giao hoặc đã giao
                if (donHang.TrangThai != "DangGiao" && donHang.TrangThai != "DaGiao")
                {
                    return BadRequest(new { message = "Chỉ có thể cập nhật tracking cho đơn hàng đang giao hoặc đã giao" });
                }

                // Cập nhật thông tin tracking
                if (!string.IsNullOrEmpty(request.MaVanDon))
                {
                    donHang.MaVanDon = request.MaVanDon;
                }
                if (!string.IsNullOrEmpty(request.ViTriHienTai))
                {
                    donHang.ViTriHienTai = request.ViTriHienTai;
                }
                if (!string.IsNullOrEmpty(request.PhuongThucGiaoHang))
                {
                    donHang.PhuongThucGiaoHang = request.PhuongThucGiaoHang;
                }

                donHang.NgayCapNhat = DateTimeHelper.ToUtcTime(DateTimeHelper.GetVietnamTime());
                await _context.SaveChangesAsync();

                return Ok(new { message = "Cập nhật tracking thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi cập nhật tracking: {ex.Message}" });
            }
        }
    }

    public class HoanTraDonHangRequest
    {
        [Required]
        [MaxLength(500)]
        public string LyDo { get; set; } = string.Empty;
    }

    public class HuyDonHangRequest
    {
        [MaxLength(500)]
        public string? LyDoHuy { get; set; }
    }

    public class CapNhatTrackingRequest
    {
        [MaxLength(100)]
        public string? MaVanDon { get; set; }

        [MaxLength(500)]
        public string? ViTriHienTai { get; set; }

        [MaxLength(100)]
        public string? PhuongThucGiaoHang { get; set; }
    }

    public class TaoDonHangRequest
    {
        [Required]
        public int DiaChiGiaoHangId { get; set; }
        public int? PhuongThucThanhToanId { get; set; }
        public string? MaGiamGia { get; set; }
        public decimal PhiVanChuyen { get; set; } = 0;
        public string? PhuongThucGiaoHang { get; set; }
        public string? GhiChu { get; set; }
    }
}

