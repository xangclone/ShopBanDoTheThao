using System.ComponentModel.DataAnnotations;

namespace ShopBanDoTheThao.Server.DTOs
{
    public class DangKyDTO
    {
        [Required(ErrorMessage = "Email là bắt buộc")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
        [MinLength(6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự")]
        public string MatKhau { get; set; } = string.Empty;

        [Required(ErrorMessage = "Xác nhận mật khẩu là bắt buộc")]
        [Compare("MatKhau", ErrorMessage = "Mật khẩu xác nhận không khớp")]
        public string XacNhanMatKhau { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? SoDienThoai { get; set; }

        [MaxLength(100)]
        public string? Ho { get; set; }

        [MaxLength(100)]
        public string? Ten { get; set; }
    }
}




