using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopBanDoTheThao.Server.Models
{
    public class Banner
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string TieuDe { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? MoTa { get; set; }

        [MaxLength(500)]
        public string? HinhAnh { get; set; }

        [MaxLength(500)]
        public string? LienKet { get; set; } // URL hoặc route

        [MaxLength(50)]
        public string? NutBam { get; set; } // Text cho nút bấm

        public int ThuTuHienThi { get; set; } = 0;

        public bool DangHoatDong { get; set; } = true;

        public DateTime NgayBatDau { get; set; } = DateTime.UtcNow;

        public DateTime? NgayKetThuc { get; set; }

        public DateTime NgayTao { get; set; } = DateTime.UtcNow;

        public DateTime? NgayCapNhat { get; set; }
    }
}

