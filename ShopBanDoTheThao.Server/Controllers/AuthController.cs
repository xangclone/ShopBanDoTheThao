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

        public AuthController(ShopBanDoTheThaoDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
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
    }
}



