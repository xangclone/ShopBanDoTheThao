using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopBanDoTheThao.Server.Models
{
    public class FlashSale
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Ten { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? MoTa { get; set; }

        [MaxLength(500)]
        public string? HinhAnh { get; set; }

        [Required]
        public DateTime ThoiGianBatDau { get; set; }

        [Required]
        public DateTime ThoiGianKetThuc { get; set; }

        public bool DangHoatDong { get; set; } = true;

        public int UuTien { get; set; } = 0; // Độ ưu tiên hiển thị

        public DateTime NgayTao { get; set; } = DateTime.UtcNow;

        public DateTime? NgayCapNhat { get; set; }

        // Navigation properties
        public virtual ICollection<FlashSaleSanPham> DanhSachSanPham { get; set; } = new List<FlashSaleSanPham>();
    }

    public class FlashSaleSanPham
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int FlashSaleId { get; set; }

        [Required]
        public int SanPhamId { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal GiaFlashSale { get; set; } // Giá trong flash sale

        public int SoLuongToiDa { get; set; } = 0; // Số lượng tối đa bán trong flash sale (0 = không giới hạn)

        public int SoLuongDaBan { get; set; } = 0; // Số lượng đã bán

        public int UuTien { get; set; } = 0; // Độ ưu tiên hiển thị trong flash sale

        public bool DangHoatDong { get; set; } = true;

        // Navigation properties
        [ForeignKey("FlashSaleId")]
        public virtual FlashSale FlashSale { get; set; } = null!;

        [ForeignKey("SanPhamId")]
        public virtual SanPham SanPham { get; set; } = null!;
    }
}

