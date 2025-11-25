using System.ComponentModel.DataAnnotations;

namespace ShopBanDoTheThao.Server.Models
{
    public class ThuongHieu
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Ten { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? MoTa { get; set; }

        [MaxLength(500)]
        public string? Logo { get; set; }

        [MaxLength(200)]
        public string? TrangWeb { get; set; }

        [MaxLength(200)]
        public string? Slug { get; set; }

        public bool DangHoatDong { get; set; } = true;

        public DateTime NgayTao { get; set; } = DateTime.UtcNow;

        // Navigation property
        public virtual ICollection<SanPham> DanhSachSanPham { get; set; } = new List<SanPham>();
    }
}



