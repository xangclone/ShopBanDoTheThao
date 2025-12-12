using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopBanDoTheThao.Server.Data;
using ShopBanDoTheThao.Server.DTOs;
using System.Security.Claims;

namespace ShopBanDoTheThao.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MinigameController : ControllerBase
    {
        private readonly ShopBanDoTheThaoDbContext _context;

        public MinigameController(ShopBanDoTheThaoDbContext context)
        {
            _context = context;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out int userId) ? userId : 0;
        }

        // Lấy danh sách minigame
        [HttpGet]
        public async Task<IActionResult> GetMinigames()
        {
            try
            {
                var userId = GetUserId();
                var today = DateTime.UtcNow.Date;

                var minigames = await _context.Minigame
                    .Where(m => m.DangHoatDong &&
                           m.NgayBatDau <= DateTime.UtcNow &&
                           (m.NgayKetThuc == null || m.NgayKetThuc >= DateTime.UtcNow))
                    .OrderBy(m => m.NgayBatDau)
                    .Select(m => new
                    {
                        m.Id,
                        m.Ten,
                        m.MoTa,
                        m.LoaiGame,
                        m.HinhAnh,
                        m.SoDiemCanThi,
                        m.SoLanChoiToiDa,
                        DangHoatDong = m.DangHoatDong,
                        NgayBatDau = m.NgayBatDau,
                        NgayKetThuc = m.NgayKetThuc
                    })
                    .ToListAsync();

                var result = new List<MinigameDTO>();
                foreach (var m in minigames)
                {
                    // Đếm số lần đã chơi hôm nay
                    var soLanDaChoi = await _context.KetQuaMinigame
                        .CountAsync(k => k.NguoiDungId == userId && 
                                       k.MinigameId == m.Id &&
                                       k.NgayChoi.Date == today);

                    var coTheChoi = (m.SoLanChoiToiDa == 0 || soLanDaChoi < m.SoLanChoiToiDa) &&
                                   (m.SoDiemCanThi == 0 || 
                                    (await _context.NguoiDung.FindAsync(userId))?.DiemKhaDung >= m.SoDiemCanThi);

                    result.Add(new MinigameDTO
                    {
                        Id = m.Id,
                        Ten = m.Ten,
                        MoTa = m.MoTa,
                        LoaiGame = m.LoaiGame,
                        HinhAnh = m.HinhAnh,
                        SoDiemCanThi = m.SoDiemCanThi,
                        SoLanChoiToiDa = m.SoLanChoiToiDa,
                        DangHoatDong = m.DangHoatDong,
                        NgayBatDau = m.NgayBatDau,
                        NgayKetThuc = m.NgayKetThuc,
                        SoLanDaChoi = soLanDaChoi,
                        CoTheChoi = coTheChoi
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi lấy danh sách minigame: {ex.Message}" });
            }
        }

        // Chơi minigame
        [HttpPost("{id}/choi")]
        public async Task<IActionResult> ChoiMinigame(int id)
        {
            try
            {
                var userId = GetUserId();
                var user = await _context.NguoiDung.FindAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "Không tìm thấy người dùng" });
                }

                var minigame = await _context.Minigame.FindAsync(id);
                if (minigame == null || !minigame.DangHoatDong)
                {
                    return NotFound(new { message = "Minigame không tồn tại hoặc đã ngừng hoạt động" });
                }

                // Kiểm tra thời gian
                if (minigame.NgayBatDau > DateTime.UtcNow ||
                    (minigame.NgayKetThuc.HasValue && minigame.NgayKetThuc.Value < DateTime.UtcNow))
                {
                    return BadRequest(new { message = "Minigame chưa bắt đầu hoặc đã kết thúc" });
                }

                // Kiểm tra số lần chơi
                var today = DateTime.UtcNow.Date;
                var soLanDaChoi = await _context.KetQuaMinigame
                    .CountAsync(k => k.NguoiDungId == userId &&
                                   k.MinigameId == id &&
                                   k.NgayChoi.Date == today);

                if (minigame.SoLanChoiToiDa > 0 && soLanDaChoi >= minigame.SoLanChoiToiDa)
                {
                    return BadRequest(new { message = $"Bạn đã hết lượt chơi hôm nay (tối đa {minigame.SoLanChoiToiDa} lần)" });
                }

                // Kiểm tra điểm
                if (minigame.SoDiemCanThi > 0 && user.DiemKhaDung < minigame.SoDiemCanThi)
                {
                    return BadRequest(new { message = $"Bạn cần {minigame.SoDiemCanThi} điểm để chơi. Bạn hiện có {user.DiemKhaDung} điểm." });
                }

                // Trừ điểm nếu cần
                if (minigame.SoDiemCanThi > 0)
                {
                    user.DiemKhaDung -= minigame.SoDiemCanThi;
                    await _context.SaveChangesAsync();
                }

                // Tính toán phần thưởng (logic đơn giản - có thể mở rộng)
                var random = new Random();
                var phanThuong = TinhPhanThuong(minigame, random);

                // Lưu kết quả
                var ketQua = new Models.KetQuaMinigame
                {
                    NguoiDungId = userId,
                    MinigameId = id,
                    LoaiPhanThuong = phanThuong.Loai,
                    SoDiemNhanDuoc = phanThuong.SoDiem,
                    VoucherDoiDiemId = phanThuong.VoucherId,
                    MoTa = phanThuong.MoTa,
                    TrangThai = "DaNhan",
                    NgayChoi = DateTime.UtcNow
                };
                _context.KetQuaMinigame.Add(ketQua);

                // Cộng điểm nếu có
                if (phanThuong.SoDiem > 0)
                {
                    user.DiemKhaDung += phanThuong.SoDiem;
                    user.DiemTichLuy += phanThuong.SoDiem;

                    // Ghi lịch sử
                    var lichSu = new Models.LichSuDiem
                    {
                        NguoiDungId = userId,
                        Loai = "Minigame",
                        MoTa = $"Nhận điểm từ minigame: {minigame.Ten}",
                        SoDiem = phanThuong.SoDiem,
                        DiemTruoc = user.DiemKhaDung - phanThuong.SoDiem,
                        DiemSau = user.DiemKhaDung,
                        MinigameId = id,
                        GhiChu = phanThuong.MoTa
                    };
                    _context.LichSuDiem.Add(lichSu);

                    // Cập nhật hạng VIP
                    await CapNhatHangVip(user);
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Chơi game thành công!",
                    ketQua = new KetQuaMinigameDTO
                    {
                        Id = ketQua.Id,
                        NguoiDungId = ketQua.NguoiDungId,
                        MinigameId = ketQua.MinigameId,
                        LoaiPhanThuong = ketQua.LoaiPhanThuong,
                        SoDiemNhanDuoc = ketQua.SoDiemNhanDuoc,
                        VoucherDoiDiemId = ketQua.VoucherDoiDiemId,
                        MoTa = ketQua.MoTa,
                        TrangThai = ketQua.TrangThai,
                        NgayChoi = ketQua.NgayChoi
                    },
                    diemKhaDung = user.DiemKhaDung
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi chơi minigame: {ex.Message}" });
            }
        }

        // Lấy lịch sử chơi game
        [HttpGet("lich-su")]
        public async Task<IActionResult> GetLichSuChoiGame([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var userId = GetUserId();
                var query = _context.KetQuaMinigame
                    .Where(k => k.NguoiDungId == userId)
                    .Include(k => k.Minigame)
                    .Include(k => k.VoucherDoiDiem)
                    .OrderByDescending(k => k.NgayChoi);

                var total = await query.CountAsync();
                var lichSu = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(k => new KetQuaMinigameDTO
                    {
                        Id = k.Id,
                        NguoiDungId = k.NguoiDungId,
                        MinigameId = k.MinigameId,
                        LoaiPhanThuong = k.LoaiPhanThuong,
                        SoDiemNhanDuoc = k.SoDiemNhanDuoc,
                        VoucherDoiDiemId = k.VoucherDoiDiemId,
                        MoTa = k.MoTa,
                        TrangThai = k.TrangThai,
                        NgayChoi = k.NgayChoi,
                        VoucherDoiDiem = k.VoucherDoiDiem != null ? new VoucherDoiDiemDTO
                        {
                            Id = k.VoucherDoiDiem.Id,
                            Ten = k.VoucherDoiDiem.Ten,
                            MoTa = k.VoucherDoiDiem.MoTa,
                            HinhAnh = k.VoucherDoiDiem.HinhAnh,
                            SoDiemCanDoi = k.VoucherDoiDiem.SoDiemCanDoi
                        } : null
                    })
                    .ToListAsync();

                return Ok(new
                {
                    data = lichSu,
                    total,
                    page,
                    pageSize,
                    totalPages = (int)Math.Ceiling(total / (double)pageSize)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi lấy lịch sử chơi game: {ex.Message}" });
            }
        }

        // Helper: Tính phần thưởng
        private (string Loai, int SoDiem, int? VoucherId, string MoTa) TinhPhanThuong(Models.Minigame minigame, Random random)
        {
            // Logic đơn giản: 70% nhận điểm, 20% voucher, 10% không có gì
            var tyLe = random.Next(1, 101);

            if (tyLe <= 70)
            {
                // Nhận điểm (10-100 điểm)
                var diem = random.Next(10, 101);
                return ("Diem", diem, null, $"Chúc mừng! Bạn nhận được {diem} điểm!");
            }
            else if (tyLe <= 90)
            {
                // Nhận voucher (nếu có)
                var vouchers = _context.VoucherDoiDiem
                    .Where(v => v.DangHoatDong && v.SoDiemCanDoi <= 100)
                    .ToList();
                if (vouchers.Any())
                {
                    var voucher = vouchers[random.Next(vouchers.Count)];
                    return ("Voucher", 0, voucher.Id, $"Chúc mừng! Bạn nhận được voucher: {voucher.Ten}!");
                }
                else
                {
                    // Không có voucher, trả điểm
                    var diem = random.Next(10, 51);
                    return ("Diem", diem, null, $"Chúc mừng! Bạn nhận được {diem} điểm!");
                }
            }
            else
            {
                return ("Khong", 0, null, "Chúc bạn may mắn lần sau!");
            }
        }

        // Helper: Cập nhật hạng VIP
        private async Task CapNhatHangVip(Models.NguoiDung user)
        {
            var hangVipMoi = await _context.HangVip
                .Where(h => h.DangHoatDong &&
                       h.DiemToiThieu <= user.DiemTichLuy &&
                       (h.DiemToiDa == int.MaxValue || h.DiemToiDa >= user.DiemTichLuy))
                .OrderByDescending(h => h.DiemToiThieu)
                .FirstOrDefaultAsync();

            if (hangVipMoi != null && user.HangVipId != hangVipMoi.Id)
            {
                user.HangVipId = hangVipMoi.Id;
            }
        }
    }
}








