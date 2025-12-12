using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopBanDoTheThao.Server.Models
{
    public class LichSuDiem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int NguoiDungId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Loai { get; set; } = string.Empty; // TichDiem, SuDungDiem, DoiVoucher, Minigame, Thuong, TruDiem

        [Required]
        [MaxLength(200)]
        public string MoTa { get; set; } = string.Empty; // Mô tả chi tiết

        public int SoDiem { get; set; } // Số điểm (dương = tăng, âm = giảm)

        public int DiemTruoc { get; set; } // Điểm trước khi thay đổi

        public int DiemSau { get; set; } // Điểm sau khi thay đổi

        public int? DonHangId { get; set; } // Liên kết với đơn hàng (nếu có)

        public int? VoucherDoiDiemId { get; set; } // Liên kết với voucher đổi điểm (nếu có)

        public int? MinigameId { get; set; } // Liên kết với minigame (nếu có)

        [MaxLength(500)]
        public string? GhiChu { get; set; }

        public DateTime NgayTao { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("NguoiDungId")]
        public virtual NguoiDung NguoiDung { get; set; } = null!;

        [ForeignKey("DonHangId")]
        public virtual DonHang? DonHang { get; set; }

        [ForeignKey("VoucherDoiDiemId")]
        public virtual VoucherDoiDiem? VoucherDoiDiem { get; set; }

        [ForeignKey("MinigameId")]
        public virtual Minigame? Minigame { get; set; }
    }
}








