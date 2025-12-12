using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopBanDoTheThao.Server.Models
{
    public class HangVip
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Ten { get; set; } = string.Empty; // Đồng, Bạc, Vàng, Bạch Kim, Kim Cương

        [MaxLength(200)]
        public string? MoTa { get; set; }

        [MaxLength(50)]
        public string? MauSac { get; set; } // Màu sắc để hiển thị

        [MaxLength(500)]
        public string? Icon { get; set; } // Icon hoặc emoji

        public int DiemToiThieu { get; set; } // Điểm tối thiểu để đạt hạng này

        public int DiemToiDa { get; set; } = int.MaxValue; // Điểm tối đa của hạng này

        public decimal TiLeTichDiem { get; set; } = 1.0m; // Tỷ lệ tích điểm (ví dụ: 1.0 = 1%, 1.5 = 1.5%)

        public decimal TiLeGiamGia { get; set; } = 0; // Tỷ lệ giảm giá cho hạng VIP (%)

        public int ThuTu { get; set; } = 0; // Thứ tự hiển thị

        public bool DangHoatDong { get; set; } = true;

        public DateTime NgayTao { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual ICollection<NguoiDung> DanhSachNguoiDung { get; set; } = new List<NguoiDung>();
    }
}








