using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopBanDoTheThao.Server.Models
{
    public class ThongBao
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int NguoiDungId { get; set; }

        [Required]
        [MaxLength(200)]
        public string TieuDe { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? NoiDung { get; set; }

        [MaxLength(50)]
        public string Loai { get; set; } = "DonHang"; // DonHang, DealHot, KhuyenMai, HeThong

        [MaxLength(100)]
        public string? LienKet { get; set; } // Link đến trang liên quan (ví dụ: /don-hang/123)

        public int? DonHangId { get; set; } // ID đơn hàng nếu loại là DonHang

        public int? SanPhamId { get; set; } // ID sản phẩm nếu loại là DealHot

        public bool DaDoc { get; set; } = false;

        public bool DangHoatDong { get; set; } = true;

        public DateTime NgayTao { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("NguoiDungId")]
        public virtual NguoiDung NguoiDung { get; set; } = null!;

        [ForeignKey("DonHangId")]
        public virtual DonHang? DonHang { get; set; }

        [ForeignKey("SanPhamId")]
        public virtual SanPham? SanPham { get; set; }
    }
}

