using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopBanDoTheThao.Server.Models
{
    public class TaiKhoanNganHang
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string TenNganHang { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string SoTaiKhoan { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string TenChuTaiKhoan { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? ChiNhanh { get; set; }

        [MaxLength(1000)]
        public string? GhiChu { get; set; }

        public bool DangHoatDong { get; set; } = true;

        public int UuTien { get; set; } = 0; // Để sắp xếp thứ tự hiển thị

        public DateTime NgayTao { get; set; } = DateTime.UtcNow;

        public DateTime? NgayCapNhat { get; set; }
    }
}

