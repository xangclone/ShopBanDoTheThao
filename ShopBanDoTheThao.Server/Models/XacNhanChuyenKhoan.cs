using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopBanDoTheThao.Server.Models
{
    public class XacNhanChuyenKhoan
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int DonHangId { get; set; }

        [Required]
        public int NguoiDungId { get; set; }

        [Required]
        public int TaiKhoanNganHangId { get; set; }

        [Required]
        [MaxLength(200)]
        public string SoTaiKhoanGui { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string TenNguoiGui { get; set; } = string.Empty;

        [Required]
        public decimal SoTien { get; set; }

        [MaxLength(500)]
        public string? NoiDungChuyenKhoan { get; set; }

        [MaxLength(500)]
        public string? HinhAnhChungTu { get; set; }

        [MaxLength(50)]
        public string TrangThai { get; set; } = "ChoXacNhan"; // ChoXacNhan, DaXacNhan, TuChoi

        [MaxLength(1000)]
        public string? GhiChu { get; set; }

        public DateTime NgayTao { get; set; } = DateTime.UtcNow;

        public DateTime? NgayXacNhan { get; set; }

        // Navigation properties
        [ForeignKey("DonHangId")]
        public virtual DonHang DonHang { get; set; } = null!;

        [ForeignKey("NguoiDungId")]
        public virtual NguoiDung NguoiDung { get; set; } = null!;

        [ForeignKey("TaiKhoanNganHangId")]
        public virtual TaiKhoanNganHang TaiKhoanNganHang { get; set; } = null!;
    }
}
