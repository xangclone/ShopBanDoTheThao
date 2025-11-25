using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopBanDoTheThao.Server.Models
{
    public class TinNhan
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int NguoiDungId { get; set; } // Khách hàng gửi tin nhắn

        public int? NguoiPhanHoiId { get; set; } // Admin/Tư vấn viên phản hồi (null nếu là bot)

        [Required]
        [MaxLength(2000)]
        public string NoiDung { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Loai { get; set; } = "User"; // User, Bot, Human (Admin)

        public int? SanPhamId { get; set; } // Sản phẩm được đề cập trong tin nhắn (nếu có)

        public bool DaDoc { get; set; } = false; // Đã đọc chưa

        public DateTime NgayGui { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("NguoiDungId")]
        public virtual NguoiDung NguoiDung { get; set; } = null!;

        [ForeignKey("NguoiPhanHoiId")]
        public virtual NguoiDung? NguoiPhanHoi { get; set; }

        [ForeignKey("SanPhamId")]
        public virtual SanPham? SanPham { get; set; }
    }
}

