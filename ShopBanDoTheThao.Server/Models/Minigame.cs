using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopBanDoTheThao.Server.Models
{
    public class Minigame
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Ten { get; set; } = string.Empty; // Vòng quay may mắn, Quay số, Đoán số, v.v.

        [MaxLength(500)]
        public string? MoTa { get; set; }

        [MaxLength(50)]
        public string LoaiGame { get; set; } = "VongQuay"; // VongQuay, QuaySo, DoanSo, Slot

        [MaxLength(500)]
        public string? HinhAnh { get; set; }

        public int SoDiemCanThi { get; set; } = 0; // Số điểm cần để chơi (0 = miễn phí)

        public int SoLanChoiToiDa { get; set; } = 1; // Số lần chơi tối đa mỗi ngày (0 = không giới hạn)

        public bool DangHoatDong { get; set; } = true;

        public DateTime NgayBatDau { get; set; } = DateTime.UtcNow;

        public DateTime? NgayKetThuc { get; set; }

        public DateTime NgayTao { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual ICollection<KetQuaMinigame> DanhSachKetQua { get; set; } = new List<KetQuaMinigame>();
    }
}








