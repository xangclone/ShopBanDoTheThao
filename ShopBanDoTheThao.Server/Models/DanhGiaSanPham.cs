using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopBanDoTheThao.Server.Models
{
    public class DanhGiaSanPham
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int SanPhamId { get; set; }

        [Required]
        public int NguoiDungId { get; set; }

        [Required]
        public int SoSao { get; set; } // 1-5

        [MaxLength(1000)]
        public string? NoiDung { get; set; }

        public string? DanhSachHinhAnh { get; set; } // JSON array

        public bool DaXacNhanMua { get; set; } = false; // Đã mua sản phẩm này

        public int SoLuongThich { get; set; } = 0;

        public bool HienThi { get; set; } = true;

        public DateTime NgayTao { get; set; } = DateTime.UtcNow;

        public DateTime? NgayCapNhat { get; set; }

        // Navigation properties
        [ForeignKey("SanPhamId")]
        public virtual SanPham SanPham { get; set; } = null!;

        [ForeignKey("NguoiDungId")]
        public virtual NguoiDung NguoiDung { get; set; } = null!;
    }
}




