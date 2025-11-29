using System.ComponentModel.DataAnnotations;

namespace ShopBanDoTheThao.Server.DTOs
{
    public class GoogleLoginDTO
    {
        [Required]
        public string IdToken { get; set; } = string.Empty;

        public string? Email { get; set; }

        public string? Name { get; set; }

        public string? Picture { get; set; }
    }

    public class FacebookLoginDTO
    {
        [Required]
        public string AccessToken { get; set; } = string.Empty;

        public string? UserId { get; set; }

        public string? Email { get; set; }

        public string? Name { get; set; }

        public string? Picture { get; set; }
    }
}

