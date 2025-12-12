namespace ShopBanDoTheThao.Server.DTOs
{
    public class HangVipDTO
    {
        public int Id { get; set; }
        public string Ten { get; set; } = string.Empty;
        public string? MoTa { get; set; }
        public string? MauSac { get; set; }
        public string? Icon { get; set; }
        public int DiemToiThieu { get; set; }
        public int DiemToiDa { get; set; }
        public decimal TiLeTichDiem { get; set; }
        public decimal TiLeGiamGia { get; set; }
        public int ThuTu { get; set; }
        public bool DangHoatDong { get; set; }
    }
}








