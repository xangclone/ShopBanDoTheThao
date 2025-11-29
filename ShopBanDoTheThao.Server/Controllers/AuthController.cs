using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopBanDoTheThao.Server.Data;
using ShopBanDoTheThao.Server.DTOs;
using ShopBanDoTheThao.Server.Models;
using ShopBanDoTheThao.Server.Services;
using System.Security.Claims;

namespace ShopBanDoTheThao.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ShopBanDoTheThaoDbContext _context;
        private readonly JwtService _jwtService;
        private readonly EmailService _emailService;
        private readonly IConfiguration _configuration;

        public AuthController(ShopBanDoTheThaoDbContext context, JwtService jwtService, EmailService emailService, IConfiguration configuration)
        {
            _context = context;
            _jwtService = jwtService;
            _emailService = emailService;
            _configuration = configuration;
        }

        [HttpPost("dangky")]
        public async Task<IActionResult> DangKy([FromBody] DangKyDTO dto)
        {
            // Kiểm tra email đã tồn tại
            if (await _context.NguoiDung.AnyAsync(u => u.Email == dto.Email))
            {
                return BadRequest(new { message = "Email đã được sử dụng" });
            }

            // Kiểm tra số điện thoại nếu có
            if (!string.IsNullOrEmpty(dto.SoDienThoai) && 
                await _context.NguoiDung.AnyAsync(u => u.SoDienThoai == dto.SoDienThoai))
            {
                return BadRequest(new { message = "Số điện thoại đã được sử dụng" });
            }

            // Tạo người dùng mới
            var nguoiDung = new NguoiDung
            {
                Email = dto.Email,
                SoDienThoai = dto.SoDienThoai,
                MatKhauHash = BCrypt.Net.BCrypt.HashPassword(dto.MatKhau),
                Ho = dto.Ho ?? string.Empty,
                Ten = dto.Ten ?? string.Empty,
                VaiTro = "KhachHang",
                NgayTao = DateTime.UtcNow
            };

            _context.NguoiDung.Add(nguoiDung);
            await _context.SaveChangesAsync();

            // Tạo token
            var token = _jwtService.GenerateToken(nguoiDung.Id, nguoiDung.Email, nguoiDung.VaiTro);

            var response = new DangNhapResponseDTO
            {
                Token = token,
                Expiration = DateTime.UtcNow.AddMinutes(1440),
                NguoiDung = new NguoiDungDTO
                {
                    Id = nguoiDung.Id,
                    Email = nguoiDung.Email,
                    SoDienThoai = nguoiDung.SoDienThoai,
                    Ho = nguoiDung.Ho,
                    Ten = nguoiDung.Ten,
                    AnhDaiDien = nguoiDung.AnhDaiDien,
                    VaiTro = nguoiDung.VaiTro,
                    DiemTichLuy = nguoiDung.DiemTichLuy
                }
            };

            return Ok(response);
        }

        [HttpPost("dangnhap")]
        public async Task<IActionResult> DangNhap([FromBody] DangNhapDTO dto)
        {
            var nguoiDung = await _context.NguoiDung
                .FirstOrDefaultAsync(u => u.Email == dto.EmailHoacSoDienThoai || 
                                          u.SoDienThoai == dto.EmailHoacSoDienThoai);

            if (nguoiDung == null || !BCrypt.Net.BCrypt.Verify(dto.MatKhau, nguoiDung.MatKhauHash))
            {
                return Unauthorized(new { message = "Email/số điện thoại hoặc mật khẩu không đúng" });
            }

            if (!nguoiDung.DangHoatDong)
            {
                return Unauthorized(new { message = "Tài khoản đã bị khóa" });
            }

            // Tạo token
            var token = _jwtService.GenerateToken(nguoiDung.Id, nguoiDung.Email, nguoiDung.VaiTro);

            var response = new DangNhapResponseDTO
            {
                Token = token,
                Expiration = DateTime.UtcNow.AddMinutes(1440),
                NguoiDung = new NguoiDungDTO
                {
                    Id = nguoiDung.Id,
                    Email = nguoiDung.Email,
                    SoDienThoai = nguoiDung.SoDienThoai,
                    Ho = nguoiDung.Ho,
                    Ten = nguoiDung.Ten,
                    AnhDaiDien = nguoiDung.AnhDaiDien,
                    VaiTro = nguoiDung.VaiTro,
                    DiemTichLuy = nguoiDung.DiemTichLuy
                }
            };

            return Ok(response);
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized();
            }

            var nguoiDung = await _context.NguoiDung
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (nguoiDung == null)
            {
                return NotFound();
            }

            var dto = new NguoiDungDTO
            {
                Id = nguoiDung.Id,
                Email = nguoiDung.Email,
                SoDienThoai = nguoiDung.SoDienThoai,
                Ho = nguoiDung.Ho,
                Ten = nguoiDung.Ten,
                AnhDaiDien = nguoiDung.AnhDaiDien,
                VaiTro = nguoiDung.VaiTro,
                DiemTichLuy = nguoiDung.DiemTichLuy
            };

            return Ok(dto);
        }

        [HttpPost("google")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDTO dto)
        {
            try
            {
                // Tìm user theo GoogleId hoặc Email
                var nguoiDung = await _context.NguoiDung
                    .FirstOrDefaultAsync(u => u.GoogleId == dto.IdToken || 
                                             (!string.IsNullOrEmpty(dto.Email) && u.Email == dto.Email));

                if (nguoiDung == null)
                {
                    // Tạo user mới nếu chưa tồn tại
                    var nameParts = !string.IsNullOrEmpty(dto.Name) ? dto.Name.Split(' ', 2) : new[] { "", "" };
                    var ho = nameParts.Length > 0 ? nameParts[0] : "";
                    var ten = nameParts.Length > 1 ? nameParts[1] : "";

                    nguoiDung = new NguoiDung
                    {
                        Email = dto.Email ?? $"google_{dto.IdToken.Substring(0, Math.Min(20, dto.IdToken.Length))}@temp.com",
                        GoogleId = dto.IdToken,
                        Ho = ho,
                        Ten = ten,
                        AnhDaiDien = dto.Picture,
                        MatKhauHash = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString()), // Random password
                        VaiTro = "KhachHang",
                        DaXacThucEmail = !string.IsNullOrEmpty(dto.Email),
                        NgayTao = DateTime.UtcNow
                    };

                    _context.NguoiDung.Add(nguoiDung);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    // Cập nhật thông tin nếu cần
                    if (string.IsNullOrEmpty(nguoiDung.GoogleId))
                    {
                        nguoiDung.GoogleId = dto.IdToken;
                    }
                    if (!string.IsNullOrEmpty(dto.Picture) && nguoiDung.AnhDaiDien != dto.Picture)
                    {
                        nguoiDung.AnhDaiDien = dto.Picture;
                    }
                    if (!string.IsNullOrEmpty(dto.Name))
                    {
                        var nameParts = dto.Name.Split(' ', 2);
                        if (nameParts.Length > 0 && string.IsNullOrEmpty(nguoiDung.Ho))
                        {
                            nguoiDung.Ho = nameParts[0];
                        }
                        if (nameParts.Length > 1 && string.IsNullOrEmpty(nguoiDung.Ten))
                        {
                            nguoiDung.Ten = nameParts[1];
                        }
                    }
                    nguoiDung.NgayCapNhat = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                }

                if (!nguoiDung.DangHoatDong)
                {
                    return Unauthorized(new { message = "Tài khoản đã bị khóa" });
                }

                // Tạo token
                var token = _jwtService.GenerateToken(nguoiDung.Id, nguoiDung.Email, nguoiDung.VaiTro);

                var response = new DangNhapResponseDTO
                {
                    Token = token,
                    Expiration = DateTime.UtcNow.AddMinutes(1440),
                    NguoiDung = new NguoiDungDTO
                    {
                        Id = nguoiDung.Id,
                        Email = nguoiDung.Email,
                        SoDienThoai = nguoiDung.SoDienThoai,
                        Ho = nguoiDung.Ho,
                        Ten = nguoiDung.Ten,
                        AnhDaiDien = nguoiDung.AnhDaiDien,
                        VaiTro = nguoiDung.VaiTro,
                        DiemTichLuy = nguoiDung.DiemTichLuy
                    }
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Lỗi đăng nhập Google: {ex.Message}" });
            }
        }

        [HttpPost("facebook")]
        public async Task<IActionResult> FacebookLogin([FromBody] FacebookLoginDTO dto)
        {
            try
            {
                // Tìm user theo FacebookId hoặc Email
                var nguoiDung = await _context.NguoiDung
                    .FirstOrDefaultAsync(u => u.FacebookId == dto.UserId || 
                                             (!string.IsNullOrEmpty(dto.Email) && u.Email == dto.Email));

                if (nguoiDung == null)
                {
                    // Tạo user mới nếu chưa tồn tại
                    var nameParts = !string.IsNullOrEmpty(dto.Name) ? dto.Name.Split(' ', 2) : new[] { "", "" };
                    var ho = nameParts.Length > 0 ? nameParts[0] : "";
                    var ten = nameParts.Length > 1 ? nameParts[1] : "";

                    nguoiDung = new NguoiDung
                    {
                        Email = dto.Email ?? $"facebook_{dto.UserId}@temp.com",
                        FacebookId = dto.UserId,
                        Ho = ho,
                        Ten = ten,
                        AnhDaiDien = dto.Picture,
                        MatKhauHash = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString()), // Random password
                        VaiTro = "KhachHang",
                        DaXacThucEmail = !string.IsNullOrEmpty(dto.Email),
                        NgayTao = DateTime.UtcNow
                    };

                    _context.NguoiDung.Add(nguoiDung);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    // Cập nhật thông tin nếu cần
                    if (string.IsNullOrEmpty(nguoiDung.FacebookId))
                    {
                        nguoiDung.FacebookId = dto.UserId;
                    }
                    if (!string.IsNullOrEmpty(dto.Picture) && nguoiDung.AnhDaiDien != dto.Picture)
                    {
                        nguoiDung.AnhDaiDien = dto.Picture;
                    }
                    if (!string.IsNullOrEmpty(dto.Name))
                    {
                        var nameParts = dto.Name.Split(' ', 2);
                        if (nameParts.Length > 0 && string.IsNullOrEmpty(nguoiDung.Ho))
                        {
                            nguoiDung.Ho = nameParts[0];
                        }
                        if (nameParts.Length > 1 && string.IsNullOrEmpty(nguoiDung.Ten))
                        {
                            nguoiDung.Ten = nameParts[1];
                        }
                    }
                    nguoiDung.NgayCapNhat = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                }

                if (!nguoiDung.DangHoatDong)
                {
                    return Unauthorized(new { message = "Tài khoản đã bị khóa" });
                }

                // Tạo token
                var token = _jwtService.GenerateToken(nguoiDung.Id, nguoiDung.Email, nguoiDung.VaiTro);

                var response = new DangNhapResponseDTO
                {
                    Token = token,
                    Expiration = DateTime.UtcNow.AddMinutes(1440),
                    NguoiDung = new NguoiDungDTO
                    {
                        Id = nguoiDung.Id,
                        Email = nguoiDung.Email,
                        SoDienThoai = nguoiDung.SoDienThoai,
                        Ho = nguoiDung.Ho,
                        Ten = nguoiDung.Ten,
                        AnhDaiDien = nguoiDung.AnhDaiDien,
                        VaiTro = nguoiDung.VaiTro,
                        DiemTichLuy = nguoiDung.DiemTichLuy
                    }
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Lỗi đăng nhập Facebook: {ex.Message}" });
            }
        }

        [HttpPost("quen-mat-khau")]
        public async Task<IActionResult> QuenMatKhau([FromBody] QuenMatKhauRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request?.Email))
                {
                    return BadRequest(new { message = "Vui lòng nhập email" });
                }

                var nguoiDung = await _context.NguoiDung
                    .FirstOrDefaultAsync(u => u.Email == request.Email);

                // Luôn trả về thành công để không tiết lộ email có tồn tại hay không
                if (nguoiDung == null)
                {
                    return Ok(new { message = "Nếu email tồn tại, chúng tôi đã gửi link đặt lại mật khẩu đến email của bạn." });
                }

                // Tạo token reset password
                var token = Guid.NewGuid().ToString() + DateTime.UtcNow.Ticks.ToString();
                var resetToken = new ResetPasswordToken
                {
                    NguoiDungId = nguoiDung.Id,
                    Token = token, // Lưu token gốc
                    NgayTao = DateTime.UtcNow,
                    NgayHetHan = DateTime.UtcNow.AddHours(1), // Token hết hạn sau 1 giờ
                    DaSuDung = false
                };

                _context.ResetPasswordToken.Add(resetToken);
                await _context.SaveChangesAsync();

                // Tạo URL reset password
                var frontendUrl = _configuration["FrontendUrl"] ?? "http://localhost:61620";
                var resetUrl = $"{frontendUrl}/reset-mat-khau?token={Uri.EscapeDataString(token)}&id={resetToken.Id}";

                // Gửi email - Nếu không gửi được, vẫn trả về thành công để bảo mật
                try
                {
                    var emailSent = await _emailService.SendPasswordResetEmailAsync(nguoiDung.Email, token, resetUrl);
                    
                    if (!emailSent)
                    {
                        // Log lỗi nhưng vẫn trả về thành công
                        // Token vẫn được lưu, user có thể thử lại sau
                    }
                }
                catch (Exception emailEx)
                {
                    // Log lỗi email nhưng không throw để không tiết lộ thông tin
                    // Token vẫn được lưu trong DB
                }

                return Ok(new { message = "Nếu email tồn tại, chúng tôi đã gửi link đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư." });
            }
            catch (DbUpdateException dbEx)
            {
                return StatusCode(500, new { message = "Lỗi database khi xử lý yêu cầu. Vui lòng thử lại sau." });
            }
            catch (Exception ex)
            {
                // Log chi tiết lỗi để debug
                return StatusCode(500, new { message = "Lỗi khi xử lý yêu cầu. Vui lòng thử lại sau.", error = ex.Message });
            }
        }

        [HttpPost("reset-mat-khau")]
        public async Task<IActionResult> ResetMatKhau([FromBody] ResetMatKhauRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Token) || request.TokenId <= 0)
                {
                    return BadRequest(new { message = "Token không hợp lệ" });
                }

                if (string.IsNullOrEmpty(request.MatKhau) || request.MatKhau.Length < 6)
                {
                    return BadRequest(new { message = "Mật khẩu phải có ít nhất 6 ký tự" });
                }

                var resetToken = await _context.ResetPasswordToken
                    .Include(r => r.NguoiDung)
                    .FirstOrDefaultAsync(r => r.Id == request.TokenId && !r.DaSuDung);

                if (resetToken == null)
                {
                    return BadRequest(new { message = "Token không hợp lệ hoặc đã được sử dụng" });
                }

                // Kiểm tra token có đúng không
                if (resetToken.Token != request.Token)
                {
                    return BadRequest(new { message = "Token không hợp lệ" });
                }

                // Kiểm tra token còn hạn không
                if (resetToken.NgayHetHan < DateTime.UtcNow)
                {
                    return BadRequest(new { message = "Token đã hết hạn. Vui lòng yêu cầu link mới." });
                }

                // Cập nhật mật khẩu
                resetToken.NguoiDung!.MatKhauHash = BCrypt.Net.BCrypt.HashPassword(request.MatKhau);
                resetToken.DaSuDung = true;
                resetToken.NguoiDung.NgayCapNhat = DateTime.UtcNow;

                // Xóa tất cả token reset password cũ của user này
                var oldTokens = await _context.ResetPasswordToken
                    .Where(r => r.NguoiDungId == resetToken.NguoiDungId && r.Id != resetToken.Id)
                    .ToListAsync();
                _context.ResetPasswordToken.RemoveRange(oldTokens);

                await _context.SaveChangesAsync();

                return Ok(new { message = "Đặt lại mật khẩu thành công. Bạn có thể đăng nhập với mật khẩu mới." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi đặt lại mật khẩu: {ex.Message}" });
            }
        }
    }

    public class QuenMatKhauRequest
    {
        public string Email { get; set; } = string.Empty;
    }

    public class ResetMatKhauRequest
    {
        public string Token { get; set; } = string.Empty;
        public int TokenId { get; set; }
        public string MatKhau { get; set; } = string.Empty;
    }
}




