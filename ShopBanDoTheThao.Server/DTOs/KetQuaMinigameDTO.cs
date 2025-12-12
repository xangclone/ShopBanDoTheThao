namespace ShopBanDoTheThao.Server.DTOs
{
    public class KetQuaMinigameDTO
    {
        public int Id { get; set; }
        public int NguoiDungId { get; set; }
        public int MinigameId { get; set; }
        public string? LoaiPhanThuong { get; set; }
        public int? SoDiemNhanDuoc { get; set; }
        public int? VoucherDoiDiemId { get; set; }
        public string? MoTa { get; set; }
        public string TrangThai { get; set; } = string.Empty;
        public DateTime NgayChoi { get; set; }
        public VoucherDoiDiemDTO? VoucherDoiDiem { get; set; }
    }
}








