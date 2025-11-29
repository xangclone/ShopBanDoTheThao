using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopBanDoTheThao.Server.Models
{
    public class NguoiDung
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? SoDienThoai { get; set; }

        [Required]
        [MaxLength(255)]
        public string MatKhauHash { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Ho { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Ten { get; set; } = string.Empty;

        public DateTime? NgaySinh { get; set; }

        [MaxLength(10)]
        public string? GioiTinh { get; set; }

        public string? AnhDaiDien { get; set; }

        public bool DaXacThucEmail { get; set; } = false;

        public bool DaXacThucSoDienThoai { get; set; } = false;

        public string VaiTro { get; set; } = "KhachHang"; // KhachHang, QuanTriVien

        public int DiemTichLuy { get; set; } = 0;

        public string? GoogleId { get; set; }

        public string? FacebookId { get; set; }

        public DateTime NgayTao { get; set; } = DateTime.UtcNow;

        public DateTime? NgayCapNhat { get; set; }

        public bool DangHoatDong { get; set; } = true;

        // Navigation properties
        public virtual ICollection<DiaChi> DanhSachDiaChi { get; set; } = new List<DiaChi>();
        public virtual ICollection<PhuongThucThanhToan> DanhSachPhuongThucThanhToan { get; set; } = new List<PhuongThucThanhToan>();
        public virtual ICollection<DonHang> DanhSachDonHang { get; set; } = new List<DonHang>();
        public virtual ICollection<GioHangItem> DanhSachGioHang { get; set; } = new List<GioHangItem>();
        public virtual ICollection<YeuThichItem> DanhSachYeuThich { get; set; } = new List<YeuThichItem>();
        public virtual ICollection<DanhGiaSanPham> DanhSachDanhGia { get; set; } = new List<DanhGiaSanPham>();
    }
}




