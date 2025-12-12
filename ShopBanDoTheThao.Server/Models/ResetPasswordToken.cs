using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopBanDoTheThao.Server.Models
{
    public class ResetPasswordToken
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int NguoiDungId { get; set; }

        [Required]
        [MaxLength(500)]
        public string Token { get; set; } = string.Empty;

        public DateTime NgayTao { get; set; } = DateTime.UtcNow;

        public DateTime NgayHetHan { get; set; }

        public bool DaSuDung { get; set; } = false;

        [ForeignKey("NguoiDungId")]
        public NguoiDung? NguoiDung { get; set; }
    }
}













