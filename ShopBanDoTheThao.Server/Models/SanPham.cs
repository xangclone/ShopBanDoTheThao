using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopBanDoTheThao.Server.Models
{
    public class SanPham
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Ten { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? MoTa { get; set; }

        [MaxLength(2000)]
        public string? MoTaChiTiet { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Gia { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? GiaGoc { get; set; }

        [MaxLength(200)]
        public string? SKU { get; set; }

        [Required]
        public int DanhMucId { get; set; }

        public int? ThuongHieuId { get; set; }

        public int SoLuongTon { get; set; } = 0;

        [MaxLength(50)]
        public string? KichThuoc { get; set; } // S, M, L, XL, 40, 41, 42, etc.

        [MaxLength(50)]
        public string? MauSac { get; set; }

        [MaxLength(100)]
        public string? ChatLieu { get; set; }

        [MaxLength(200)]
        public string? XuatXu { get; set; }

        [MaxLength(500)]
        public string? HinhAnhChinh { get; set; }

        public string? DanhSachHinhAnh { get; set; } // JSON array

        [MaxLength(500)]
        public string? Video { get; set; }

        [MaxLength(200)]
        public string? Slug { get; set; }

        public int SoLuotXem { get; set; } = 0;

        public int SoLuongBan { get; set; } = 0;

        public double DiemDanhGiaTrungBinh { get; set; } = 0;

        public int SoLuongDanhGia { get; set; } = 0;

        public bool DangHoatDong { get; set; } = true;

        public bool DangKhuyenMai { get; set; } = false;

        public bool SanPhamNoiBat { get; set; } = false;

        public DateTime NgayTao { get; set; } = DateTime.UtcNow;

        public DateTime? NgayCapNhat { get; set; }

        // Navigation properties
        [ForeignKey("DanhMucId")]
        public virtual DanhMuc DanhMuc { get; set; } = null!;

        [ForeignKey("ThuongHieuId")]
        public virtual ThuongHieu? ThuongHieu { get; set; }

        public virtual ICollection<GioHangItem> DanhSachGioHang { get; set; } = new List<GioHangItem>();
        public virtual ICollection<YeuThichItem> DanhSachYeuThich { get; set; } = new List<YeuThichItem>();
        public virtual ICollection<DonHangChiTiet> DanhSachDonHangChiTiet { get; set; } = new List<DonHangChiTiet>();
        public virtual ICollection<DanhGiaSanPham> DanhSachDanhGia { get; set; } = new List<DanhGiaSanPham>();
        public virtual ICollection<SanPhamBienThe> DanhSachBienThe { get; set; } = new List<SanPhamBienThe>();
    }
}

