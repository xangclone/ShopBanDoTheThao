using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopBanDoTheThao.Server.Models
{
    public class SanPhamBienThe
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int SanPhamId { get; set; }

        [MaxLength(50)]
        public string? KichThuoc { get; set; } // S, M, L, XL, 40, 41, 42, etc.

        [MaxLength(50)]
        public string? MauSac { get; set; }

        [MaxLength(200)]
        public string? SKU { get; set; }

        public int SoLuongTon { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal? Gia { get; set; } // Giá riêng cho biến thể (nếu khác giá sản phẩm)

        [MaxLength(500)]
        public string? HinhAnh { get; set; } // Hình ảnh riêng cho biến thể

        public bool DangHoatDong { get; set; } = true;

        public DateTime NgayTao { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("SanPhamId")]
        public virtual SanPham SanPham { get; set; } = null!;
    }
}




