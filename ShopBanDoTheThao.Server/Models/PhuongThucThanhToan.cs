using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopBanDoTheThao.Server.Models
{
    public class PhuongThucThanhToan
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int NguoiDungId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Loai { get; set; } = string.Empty; // TheTinDung, TheGhiNo, ViDienTu, TaiKhoanNganHang

        [MaxLength(100)]
        public string? NhaCungCap { get; set; } // Visa, Mastercard, PayPal, Momo, ZaloPay, etc.

        [MaxLength(50)]
        public string? SoThe { get; set; } // Masked

        [MaxLength(100)]
        public string? TenChuThe { get; set; }

        [MaxLength(10)]
        public string? NgayHetHan { get; set; }

        public bool MacDinh { get; set; } = false;

        public bool DangHoatDong { get; set; } = true;

        public DateTime NgayTao { get; set; } = DateTime.UtcNow;

        // Navigation property
        [ForeignKey("NguoiDungId")]
        public virtual NguoiDung NguoiDung { get; set; } = null!;
    }
}



