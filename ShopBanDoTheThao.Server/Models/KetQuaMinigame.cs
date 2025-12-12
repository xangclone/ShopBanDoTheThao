using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopBanDoTheThao.Server.Models
{
    public class KetQuaMinigame
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int NguoiDungId { get; set; }

        [Required]
        public int MinigameId { get; set; }

        [MaxLength(50)]
        public string? LoaiPhanThuong { get; set; } // Diem, Voucher, QuaTang

        public int? SoDiemNhanDuoc { get; set; } // Số điểm nhận được

        public int? VoucherDoiDiemId { get; set; } // Voucher nhận được

        [MaxLength(500)]
        public string? MoTa { get; set; } // Mô tả phần thưởng

        [MaxLength(50)]
        public string TrangThai { get; set; } = "DaNhan"; // DaNhan, ChuaNhan, DaSuDung

        public DateTime NgayChoi { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("NguoiDungId")]
        public virtual NguoiDung NguoiDung { get; set; } = null!;

        [ForeignKey("MinigameId")]
        public virtual Minigame Minigame { get; set; } = null!;

        [ForeignKey("VoucherDoiDiemId")]
        public virtual VoucherDoiDiem? VoucherDoiDiem { get; set; }
    }
}








