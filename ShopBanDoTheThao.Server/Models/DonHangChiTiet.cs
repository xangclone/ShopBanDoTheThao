using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopBanDoTheThao.Server.Models
{
    public class DonHangChiTiet
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int DonHangId { get; set; }

        [Required]
        public int SanPhamId { get; set; }

        [Required]
        public int SoLuong { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Gia { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal GiamGia { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal ThanhTien { get; set; }

        [MaxLength(50)]
        public string? KichThuoc { get; set; }

        [MaxLength(50)]
        public string? MauSac { get; set; }

        // Navigation properties
        [ForeignKey("DonHangId")]
        public virtual DonHang DonHang { get; set; } = null!;

        [ForeignKey("SanPhamId")]
        public virtual SanPham SanPham { get; set; } = null!;
    }
}



