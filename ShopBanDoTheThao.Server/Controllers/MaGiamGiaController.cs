using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopBanDoTheThao.Server.Data;
using ShopBanDoTheThao.Server.Helpers;

namespace ShopBanDoTheThao.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MaGiamGiaController : ControllerBase
    {
        private readonly ShopBanDoTheThaoDbContext _context;

        public MaGiamGiaController(ShopBanDoTheThaoDbContext context)
        {
            _context = context;
        }

        [HttpGet("dang-hoat-dong")]
        public async Task<IActionResult> GetMaGiamGiaDangHoatDong([FromQuery] int limit = 1)
        {
            try
            {
                // Chuyển giờ VN sang UTC để so sánh với DB (DB lưu UTC)
                var nowVietnam = DateTimeHelper.GetVietnamTime();
                var nowUtc = DateTimeHelper.ToUtcTime(nowVietnam);
                var maGiamGia = await _context.MaGiamGia
                    .Where(m => m.DangHoatDong &&
                                m.NgayBatDau <= nowUtc &&
                                (m.NgayKetThuc == null || m.NgayKetThuc >= nowUtc) &&
                                (!m.SoLuongSuDung.HasValue || m.SoLuongDaSuDung < m.SoLuongSuDung.Value))
                    .OrderByDescending(m => m.GiaTriGiamGia)
                    .ThenByDescending(m => m.NgayTao)
                    .Take(limit)
                    .Select(m => new
                    {
                        m.Ma,
                        m.MoTa,
                        m.LoaiGiamGia,
                        m.GiaTriGiamGia,
                        m.GiaTriDonHangToiThieu,
                        m.GiaTriGiamGiaToiDa,
                        m.NgayKetThuc
                    })
                    .ToListAsync();

                return Ok(maGiamGia);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi tải mã giảm giá: {ex.Message}" });
            }
        }

        [HttpPost("kiemtra")]
        public async Task<IActionResult> KiemTraMaGiamGia([FromBody] KiemTraMaGiamGiaRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Ma))
                {
                    return BadRequest(new { message = "Vui lòng nhập mã giảm giá", valid = false });
                }

                var maGiamGia = await _context.MaGiamGia
                    .FirstOrDefaultAsync(m => m.Ma == request.Ma.Trim());

                if (maGiamGia == null)
                {
                    return Ok(new { message = "Mã giảm giá không tồn tại", valid = false });
                }

                if (!maGiamGia.DangHoatDong)
                {
                    return Ok(new { message = "Mã giảm giá đã bị vô hiệu hóa", valid = false });
                }

                // Chuyển giờ VN sang UTC để so sánh với DB (DB lưu UTC)
                var nowVietnam = DateTimeHelper.GetVietnamTime();
                var nowUtc = DateTimeHelper.ToUtcTime(nowVietnam);
                if (maGiamGia.NgayBatDau > nowUtc)
                {
                    return Ok(new { message = "Mã giảm giá chưa có hiệu lực", valid = false });
                }

                if (maGiamGia.NgayKetThuc < nowUtc)
                {
                    return Ok(new { message = "Mã giảm giá đã hết hạn", valid = false });
                }

                if (maGiamGia.SoLuongSuDung.HasValue && maGiamGia.SoLuongDaSuDung >= maGiamGia.SoLuongSuDung.Value)
                {
                    return Ok(new { message = "Mã giảm giá đã hết lượt sử dụng", valid = false });
                }

                // Kiểm tra điều kiện giá trị đơn hàng tối thiểu
                if (maGiamGia.GiaTriDonHangToiThieu.HasValue && maGiamGia.GiaTriDonHangToiThieu.Value > 0)
                {
                    if (!request.TongTienSanPham.HasValue || request.TongTienSanPham.Value < maGiamGia.GiaTriDonHangToiThieu.Value)
                    {
                        return Ok(new 
                        { 
                            message = $"Mã giảm giá chỉ áp dụng cho đơn hàng từ {maGiamGia.GiaTriDonHangToiThieu.Value:N0}đ trở lên", 
                            valid = false 
                        });
                    }
                }

                // Tính toán số tiền giảm giá (cần tổng tiền sản phẩm để tính chính xác)
                decimal giamGia = 0;
                if (request.TongTienSanPham.HasValue && request.TongTienSanPham.Value > 0)
                {
                    if (maGiamGia.LoaiGiamGia == "PhanTram")
                    {
                        giamGia = request.TongTienSanPham.Value * (maGiamGia.GiaTriGiamGia / 100);
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

                return Ok(new
                {
                    valid = true,
                    message = "Mã giảm giá hợp lệ",
                    maGiamGia = new
                    {
                        maGiamGia.Ma,
                        maGiamGia.LoaiGiamGia,
                        maGiamGia.GiaTriGiamGia,
                        maGiamGia.GiaTriGiamGiaToiDa,
                        GiamGia = giamGia
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi kiểm tra mã giảm giá: {ex.Message}", valid = false });
            }
        }
    }

    public class KiemTraMaGiamGiaRequest
    {
        public string Ma { get; set; } = string.Empty;
        public decimal? TongTienSanPham { get; set; }
    }
}


