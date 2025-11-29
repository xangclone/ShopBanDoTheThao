using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopBanDoTheThao.Server.Data;
using ShopBanDoTheThao.Server.Services;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Text.Json;

namespace ShopBanDoTheThao.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SePayController : ControllerBase
    {
        private readonly ShopBanDoTheThaoDbContext _context;
        private readonly SePayService _sePayService;
        private readonly ILogger<SePayController> _logger;

        public SePayController(
            ShopBanDoTheThaoDbContext context,
            SePayService sePayService,
            ILogger<SePayController> logger)
        {
            _context = context;
            _sePayService = sePayService;
            _logger = logger;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim ?? "0");
        }

        // Tạo thanh toán SePay
        [HttpPost("create-payment")]
        [Authorize]
        public async Task<IActionResult> CreatePayment([FromBody] CreateSePayPaymentRequest request)
        {
            try
            {
                var userId = GetUserId();
                if (userId == 0)
                {
                    return Unauthorized(new { message = "Người dùng không hợp lệ" });
                }

                // Kiểm tra đơn hàng
                var donHang = await _context.DonHang
                    .FirstOrDefaultAsync(d => d.Id == request.DonHangId && d.NguoiDungId == userId);

                if (donHang == null)
                {
                    return NotFound(new { message = "Không tìm thấy đơn hàng" });
                }

                if (donHang.TrangThaiThanhToan == "DaThanhToan")
                {
                    return BadRequest(new { message = "Đơn hàng đã được thanh toán" });
                }

                // Tạo payment với SePay
                var returnUrl = $"{Request.Scheme}://{Request.Host}/thanh-toan/sepay/callback?donHangId={donHang.Id}";
                var qrResponse = await _sePayService.CreateQRPayment(
                    donHang.TongTien,
                    donHang.MaDonHang,
                    $"Thanh toan don hang {donHang.MaDonHang}",
                    returnUrl
                );

                if (qrResponse == null || !qrResponse.Success)
                {
                    return BadRequest(new { message = qrResponse?.Message ?? "Không thể tạo thanh toán SePay" });
                }

                // Cập nhật trạng thái đơn hàng
                donHang.TrangThaiThanhToan = "DangThanhToan";
                donHang.NgayCapNhat = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    qrCode = qrResponse.QrCode,
                    paymentUrl = qrResponse.PaymentUrl,
                    orderId = qrResponse.OrderId
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating SePay payment");
                return StatusCode(500, new { message = $"Lỗi khi tạo thanh toán SePay: {ex.Message}" });
            }
        }

        // Kiểm tra trạng thái thanh toán
        [HttpGet("check-status/{donHangId}")]
        [Authorize]
        public async Task<IActionResult> CheckPaymentStatus(int donHangId)
        {
            try
            {
                var userId = GetUserId();
                if (userId == 0)
                {
                    return Unauthorized(new { message = "Người dùng không hợp lệ" });
                }

                var donHang = await _context.DonHang
                    .FirstOrDefaultAsync(d => d.Id == donHangId && d.NguoiDungId == userId);

                if (donHang == null)
                {
                    return NotFound(new { message = "Không tìm thấy đơn hàng" });
                }

                var status = await _sePayService.CheckPaymentStatus(donHang.MaDonHang);

                if (status == null)
                {
                    return BadRequest(new { message = "Không thể kiểm tra trạng thái thanh toán" });
                }

                return Ok(status);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking SePay payment status");
                return StatusCode(500, new { message = $"Lỗi khi kiểm tra trạng thái: {ex.Message}" });
            }
        }

        // Webhook từ SePay
        [HttpPost("webhook")]
        public async Task<IActionResult> Webhook([FromBody] JsonElement payload)
        {
            try
            {
                var signature = Request.Headers["X-SePay-Signature"].FirstOrDefault();
                if (string.IsNullOrEmpty(signature))
                {
                    return Unauthorized(new { message = "Missing signature" });
                }

                var payloadString = payload.GetRawText();
                
                // Xác thực signature
                if (!_sePayService.VerifyWebhookSignature(payloadString, signature))
                {
                    _logger.LogWarning("Invalid SePay webhook signature");
                    return Unauthorized(new { message = "Invalid signature" });
                }

                var webhookData = JsonSerializer.Deserialize<SePayWebhookPayload>(payloadString, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (webhookData == null || string.IsNullOrEmpty(webhookData.OrderId))
                {
                    return BadRequest(new { message = "Invalid webhook data" });
                }

                // Tìm đơn hàng theo mã đơn hàng
                var donHang = await _context.DonHang
                    .FirstOrDefaultAsync(d => d.MaDonHang == webhookData.OrderId);

                if (donHang == null)
                {
                    _logger.LogWarning("Order not found for SePay webhook: {OrderId}", webhookData.OrderId);
                    return NotFound(new { message = "Order not found" });
                }

                // Xử lý theo trạng thái
                if (webhookData.Status == "success" && webhookData.Amount == donHang.TongTien)
                {
                    donHang.TrangThaiThanhToan = "DaThanhToan";
                    donHang.TrangThai = "DaXacNhan";
                    donHang.NgayCapNhat = DateTime.UtcNow;
                    
                    await _context.SaveChangesAsync();

                    // Tạo thông báo cho người dùng
                    await Helpers.ThongBaoHelper.TaoThongBaoDonHang(_context, donHang.Id, donHang.NguoiDungId, "", "DaXacNhan");

                    _logger.LogInformation("SePay payment successful for order: {OrderId}", webhookData.OrderId);
                }
                else if (webhookData.Status == "failed")
                {
                    donHang.TrangThaiThanhToan = "ThatBai";
                    donHang.NgayCapNhat = DateTime.UtcNow;
                    await _context.SaveChangesAsync();

                    _logger.LogWarning("SePay payment failed for order: {OrderId}", webhookData.OrderId);
                }

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing SePay webhook");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }

    public class CreateSePayPaymentRequest
    {
        [Required]
        public int DonHangId { get; set; }
    }
}

