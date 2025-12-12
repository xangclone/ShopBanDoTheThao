namespace ShopBanDoTheThao.Server.DTOs
{
    public class MinigameDTO
    {
        public int Id { get; set; }
        public string Ten { get; set; } = string.Empty;
        public string? MoTa { get; set; }
        public string LoaiGame { get; set; } = string.Empty;
        public string? HinhAnh { get; set; }
        public int SoDiemCanThi { get; set; }
        public int SoLanChoiToiDa { get; set; }
        public bool DangHoatDong { get; set; }
        public DateTime NgayBatDau { get; set; }
        public DateTime? NgayKetThuc { get; set; }
        public int SoLanDaChoi { get; set; } // Số lần đã chơi hôm nay (từ phía user)
        public bool CoTheChoi { get; set; } // Có thể chơi được không
    }
}








