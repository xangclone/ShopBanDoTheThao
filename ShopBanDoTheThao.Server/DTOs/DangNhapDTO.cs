using System.ComponentModel.DataAnnotations;

namespace ShopBanDoTheThao.Server.DTOs
{
    public class DangNhapDTO
    {
        [Required(ErrorMessage = "Email hoặc số điện thoại là bắt buộc")]
        public string EmailHoacSoDienThoai { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
        public string MatKhau { get; set; } = string.Empty;
    }
}




