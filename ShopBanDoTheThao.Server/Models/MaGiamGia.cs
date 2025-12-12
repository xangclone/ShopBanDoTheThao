using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopBanDoTheThao.Server.Models
{
    public class MaGiamGia
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Ma { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? MoTa { get; set; }

        [Required]
        public string LoaiGiamGia { get; set; } = "PhanTram"; // PhanTram, SoTien

        [Column(TypeName = "decimal(18,2)")]
        public decimal GiaTriGiamGia { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? GiaTriDonHangToiThieu { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? GiaTriGiamGiaToiDa { get; set; }

        public int? SoLuongSuDung { get; set; } // null = không giới hạn

        public int SoLuongDaSuDung { get; set; } = 0;

        public DateTime NgayBatDau { get; set; }

        public DateTime? NgayKetThuc { get; set; } // Nullable để có thể có mã giảm giá vô thời hạn

        public bool DangHoatDong { get; set; } = true;

        public DateTime NgayTao { get; set; } = DateTime.UtcNow;
    }
}

