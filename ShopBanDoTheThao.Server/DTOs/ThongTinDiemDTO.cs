namespace ShopBanDoTheThao.Server.DTOs
{
    public class ThongTinDiemDTO
    {
        public int DiemTichLuy { get; set; } // Tổng điểm tích lũy
        public int DiemKhaDung { get; set; } // Điểm khả dụng
        public HangVipDTO? HangVip { get; set; }
        public HangVipDTO? HangVipTiepTheo { get; set; } // Hạng VIP tiếp theo
        public int DiemConLai { get; set; } // Điểm còn lại để lên hạng tiếp theo
        public decimal TiLeHoanThanh { get; set; } // Tỷ lệ hoàn thành (0-100)
    }
}








