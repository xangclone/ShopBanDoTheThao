using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopBanDoTheThao.Server.Models
{
    public class Popup
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string TieuDe { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? NoiDung { get; set; }

        [MaxLength(500)]
        public string? HinhAnh { get; set; }

        [MaxLength(500)]
        public string? LienKet { get; set; } // URL hoặc route

        [MaxLength(50)]
        public string? NutBam { get; set; } // Text cho nút bấm

        [MaxLength(20)]
        public string LoaiPopup { get; set; } = "ThongBao"; // ThongBao, KhuyenMai, CanhBao, QuangCao

        public int ThuTuHienThi { get; set; } = 0;

        public bool DangHoatDong { get; set; } = true;

        public DateTime NgayBatDau { get; set; } = DateTime.UtcNow;

        public DateTime? NgayKetThuc { get; set; }

        public bool HienThiMotLan { get; set; } = false; // Nếu true, chỉ hiển thị 1 lần cho mỗi user

        public DateTime NgayTao { get; set; } = DateTime.UtcNow;

        public DateTime? NgayCapNhat { get; set; }
    }
}





