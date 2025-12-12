namespace ShopBanDoTheThao.Server.DTOs
{
    public class VoucherDoiDiemDTO
    {
        public int Id { get; set; }
        public string Ten { get; set; } = string.Empty;
        public string? MoTa { get; set; }
        public string? HinhAnh { get; set; }
        public int SoDiemCanDoi { get; set; }
        public string LoaiVoucher { get; set; } = string.Empty;
        public int? MaGiamGiaId { get; set; }
        public string? LoaiGiamGia { get; set; }
        public decimal? GiaTriGiamGia { get; set; }
        public decimal? GiaTriDonHangToiThieu { get; set; }
        public decimal? GiaTriGiamGiaToiDa { get; set; }
        public int SoLuong { get; set; }
        public int SoLuongDaDoi { get; set; }
        public DateTime NgayBatDau { get; set; }
        public DateTime? NgayKetThuc { get; set; }
        public bool DangHoatDong { get; set; }
        public int ThuTuHienThi { get; set; }
        public bool CoTheDoi { get; set; } // Có thể đổi được không (dựa trên điểm của user)
    }
}








