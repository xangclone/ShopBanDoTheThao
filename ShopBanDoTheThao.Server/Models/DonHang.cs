using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopBanDoTheThao.Server.Models
{
    public class DonHang
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string MaDonHang { get; set; } = string.Empty;

        [Required]
        public int NguoiDungId { get; set; }

        [Required]
        public int DiaChiGiaoHangId { get; set; }

        public int? PhuongThucThanhToanId { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TongTienSanPham { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal PhiVanChuyen { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal GiamGia { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Thue { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal TongTien { get; set; }

        [MaxLength(50)]
        public string? MaGiamGia { get; set; }

        [MaxLength(50)]
        public string TrangThai { get; set; } = "ChoXacNhan"; // ChoXacNhan, DaXacNhan, DangGiao, DaGiao, DaHuy, HoanTra

        [MaxLength(50)]
        public string TrangThaiThanhToan { get; set; } = "ChuaThanhToan"; // ChuaThanhToan, DaThanhToan, HoanTien

        [MaxLength(100)]
        public string? PhuongThucGiaoHang { get; set; }

        [MaxLength(100)]
        public string? MaVanDon { get; set; }

        [MaxLength(500)]
        public string? ViTriHienTai { get; set; } // Vị trí hiện tại của đơn hàng (tracking)

        [MaxLength(500)]
        public string? GhiChu { get; set; }

        [MaxLength(500)]
        public string? LyDoHoanTra { get; set; } // Lý do hoàn trả

        public DateTime NgayDat { get; set; } = DateTime.UtcNow;

        public DateTime? NgayGiao { get; set; }

        public DateTime? NgayCapNhat { get; set; }

        // Navigation properties
        [ForeignKey("NguoiDungId")]
        public virtual NguoiDung NguoiDung { get; set; } = null!;

        [ForeignKey("DiaChiGiaoHangId")]
        public virtual DiaChi DiaChiGiaoHang { get; set; } = null!;

        [ForeignKey("PhuongThucThanhToanId")]
        public virtual PhuongThucThanhToan? PhuongThucThanhToan { get; set; }

        public virtual ICollection<DonHangChiTiet> DanhSachChiTiet { get; set; } = new List<DonHangChiTiet>();
    }
}



