using Microsoft.AspNetCore.Mvc;

namespace ShopBanDoTheThao.Server.Controllers
{
    [ApiController]
    [Route("/")]
    public class HomeController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new
            {
                message = "Shop Bán Đồ Thể Thao API",
                version = "1.0",
                endpoints = new
                {
                    swagger = "/swagger",
                    api = "/api",
                    health = "/api/health"
                },
                documentation = "Truy cập /swagger để xem tài liệu API đầy đủ"
            });
        }
    }
}








