namespace ShopBanDoTheThao.Server.DTOs
{
    public class NguoiDungDTO
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? SoDienThoai { get; set; }
        public string Ho { get; set; } = string.Empty;
        public string Ten { get; set; } = string.Empty;
        public string? AnhDaiDien { get; set; }
        public string VaiTro { get; set; } = string.Empty;
        public int DiemTichLuy { get; set; }
    }
}



