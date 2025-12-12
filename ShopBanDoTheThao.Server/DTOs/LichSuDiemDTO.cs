namespace ShopBanDoTheThao.Server.DTOs
{
    public class LichSuDiemDTO
    {
        public int Id { get; set; }
        public int NguoiDungId { get; set; }
        public string Loai { get; set; } = string.Empty;
        public string MoTa { get; set; } = string.Empty;
        public int SoDiem { get; set; }
        public int DiemTruoc { get; set; }
        public int DiemSau { get; set; }
        public int? DonHangId { get; set; }
        public int? VoucherDoiDiemId { get; set; }
        public int? MinigameId { get; set; }
        public string? GhiChu { get; set; }
        public DateTime NgayTao { get; set; }
    }
}








