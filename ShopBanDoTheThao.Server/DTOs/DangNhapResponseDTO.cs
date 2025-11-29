namespace ShopBanDoTheThao.Server.DTOs
{
    public class DangNhapResponseDTO
    {
        public string Token { get; set; } = string.Empty;
        public DateTime Expiration { get; set; }
        public NguoiDungDTO NguoiDung { get; set; } = null!;
    }
}




