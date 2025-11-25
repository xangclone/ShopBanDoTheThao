using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopBanDoTheThao.Server.Models
{
    public class GioHangItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int NguoiDungId { get; set; }

        [Required]
        public int SanPhamId { get; set; }

        [Required]
        public int SoLuong { get; set; } = 1;

        [MaxLength(50)]
        public string? KichThuoc { get; set; }

        [MaxLength(50)]
        public string? MauSac { get; set; }

        public DateTime NgayThem { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("NguoiDungId")]
        public virtual NguoiDung NguoiDung { get; set; } = null!;

        [ForeignKey("SanPhamId")]
        public virtual SanPham SanPham { get; set; } = null!;
    }
}



