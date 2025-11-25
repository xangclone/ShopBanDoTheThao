using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopBanDoTheThao.Server.Models
{
    public class DanhMuc
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Ten { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? MoTa { get; set; }

        [MaxLength(500)]
        public string? HinhAnh { get; set; }

        public int? DanhMucChaId { get; set; }

        [MaxLength(200)]
        public string? Slug { get; set; }

        public int ThuTuHienThi { get; set; } = 0;

        public bool DangHoatDong { get; set; } = true;

        public DateTime NgayTao { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("DanhMucChaId")]
        public virtual DanhMuc? DanhMucCha { get; set; }

        public virtual ICollection<DanhMuc> DanhMucCon { get; set; } = new List<DanhMuc>();
        public virtual ICollection<SanPham> DanhSachSanPham { get; set; } = new List<SanPham>();
    }
}



