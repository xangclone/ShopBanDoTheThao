using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopBanDoTheThao.Server.Models
{
    public class DiaChi
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int NguoiDungId { get; set; }

        [Required]
        [MaxLength(200)]
        public string DuongPho { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? PhuongXa { get; set; }

        [MaxLength(100)]
        public string? QuanHuyen { get; set; }

        [Required]
        [MaxLength(100)]
        public string ThanhPho { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? MaBuuChinh { get; set; }

        [MaxLength(100)]
        public string QuocGia { get; set; } = "Vietnam";

        [MaxLength(100)]
        public string? TenNguoiNhan { get; set; }

        [MaxLength(20)]
        public string? SoDienThoaiNhan { get; set; }

        public bool MacDinh { get; set; } = false;

        public string LoaiDiaChi { get; set; } = "NhaRieng"; // NhaRieng, VanPhong, Khac

        public DateTime NgayTao { get; set; } = DateTime.UtcNow;

        // Navigation property
        [ForeignKey("NguoiDungId")]
        public virtual NguoiDung NguoiDung { get; set; } = null!;
    }
}



