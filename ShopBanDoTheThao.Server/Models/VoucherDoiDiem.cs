using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopBanDoTheThao.Server.Models
{
    public class VoucherDoiDiem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Ten { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? MoTa { get; set; }

        [MaxLength(500)]
        public string? HinhAnh { get; set; }

        [Required]
        public int SoDiemCanDoi { get; set; } // Số điểm cần đổi

        [Required]
        [MaxLength(50)]
        public string LoaiVoucher { get; set; } = "MaGiamGia"; // MaGiamGia, QuaTang, UuDai

        // Nếu là MaGiamGia, liên kết với MaGiamGia
        public int? MaGiamGiaId { get; set; }

        // Hoặc tự định nghĩa giá trị giảm giá
        [MaxLength(50)]
        public string? LoaiGiamGia { get; set; } // PhanTram, SoTien

        [Column(TypeName = "decimal(18,2)")]
        public decimal? GiaTriGiamGia { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? GiaTriDonHangToiThieu { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? GiaTriGiamGiaToiDa { get; set; }

        public int SoLuong { get; set; } = 0; // Số lượng voucher có sẵn (0 = không giới hạn)

        public int SoLuongDaDoi { get; set; } = 0; // Số lượng đã đổi

        public DateTime NgayBatDau { get; set; } = DateTime.UtcNow;

        public DateTime? NgayKetThuc { get; set; }

        public bool DangHoatDong { get; set; } = true;

        public int ThuTuHienThi { get; set; } = 0;

        public DateTime NgayTao { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("MaGiamGiaId")]
        public virtual MaGiamGia? MaGiamGia { get; set; }

        public virtual ICollection<LichSuDiem> DanhSachLichSuDiem { get; set; } = new List<LichSuDiem>();
    }
}








