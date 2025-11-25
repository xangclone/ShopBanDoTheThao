using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopBanDoTheThao.Server.Models
{
    public class TinTuc
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string TieuDe { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? TomTat { get; set; }

        [MaxLength(10000)]
        public string? NoiDung { get; set; }

        [MaxLength(500)]
        public string? HinhAnh { get; set; }

        [MaxLength(200)]
        public string? Slug { get; set; }

        [MaxLength(50)]
        public string Loai { get; set; } = "TinTuc"; // TinTuc, CamNang, HuongDan

        public int NguoiTaoId { get; set; }

        public int SoLuotXem { get; set; } = 0;

        public bool DangHoatDong { get; set; } = true;

        public bool NoiBat { get; set; } = false;

        public DateTime NgayTao { get; set; } = DateTime.UtcNow;

        public DateTime? NgayCapNhat { get; set; }

        public DateTime? NgayDang { get; set; }
    }
}



