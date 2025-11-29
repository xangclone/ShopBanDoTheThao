using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using ShopBanDoTheThao.Server.Models;

namespace ShopBanDoTheThao.Server.Services
{
    public class SePayService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<SePayService> _logger;
        private readonly string _apiKey;
        private readonly string _apiSecret;
        private readonly string _apiUrl;
        private readonly string _webhookSecret;

        public SePayService(IConfiguration configuration, ILogger<SePayService> logger)
        {
            _configuration = configuration;
            _logger = logger;
            _apiKey = _configuration["SePay:ApiKey"] ?? "";
            _apiSecret = _configuration["SePay:ApiSecret"] ?? "";
            _apiUrl = _configuration["SePay:ApiUrl"] ?? "https://api.sepay.vn";
            _webhookSecret = _configuration["SePay:WebhookSecret"] ?? "";
        }

        // Tạo chữ ký HMAC SHA256
        private string CreateSignature(string data)
        {
            using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_apiSecret)))
            {
                var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
                return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
            }
        }

        // Tạo mã QR thanh toán
        public async Task<SePayQRResponse?> CreateQRPayment(decimal amount, string orderId, string description, string returnUrl)
        {
            try
            {
                var requestData = new
                {
                    amount = amount,
                    orderId = orderId,
                    description = description,
                    returnUrl = returnUrl
                };

                var jsonData = JsonSerializer.Serialize(requestData);
                var signature = CreateSignature(jsonData);

                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Add("X-API-KEY", _apiKey);
                    client.DefaultRequestHeaders.Add("X-SIGNATURE", signature);

                    var content = new StringContent(jsonData, Encoding.UTF8, "application/json");
                    var response = await client.PostAsync($"{_apiUrl}/api/v1/payments/qr", content);

                    if (response.IsSuccessStatusCode)
                    {
                        var responseContent = await response.Content.ReadAsStringAsync();
                        var result = JsonSerializer.Deserialize<SePayQRResponse>(responseContent, new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        });
                        return result;
                    }
                    else
                    {
                        var errorContent = await response.Content.ReadAsStringAsync();
                        _logger.LogError("SePay API Error: {Error}", errorContent);
                        return null;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating SePay QR payment");
                return null;
            }
        }

        // Kiểm tra trạng thái thanh toán
        public async Task<SePayPaymentStatus?> CheckPaymentStatus(string orderId)
        {
            try
            {
                var requestData = new { orderId = orderId };
                var jsonData = JsonSerializer.Serialize(requestData);
                var signature = CreateSignature(jsonData);

                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Add("X-API-KEY", _apiKey);
                    client.DefaultRequestHeaders.Add("X-SIGNATURE", signature);

                    var content = new StringContent(jsonData, Encoding.UTF8, "application/json");
                    var response = await client.PostAsync($"{_apiUrl}/api/v1/payments/status", content);

                    if (response.IsSuccessStatusCode)
                    {
                        var responseContent = await response.Content.ReadAsStringAsync();
                        var result = JsonSerializer.Deserialize<SePayPaymentStatus>(responseContent, new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        });
                        return result;
                    }
                    else
                    {
                        var errorContent = await response.Content.ReadAsStringAsync();
                        _logger.LogError("SePay API Error: {Error}", errorContent);
                        return null;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking SePay payment status");
                return null;
            }
        }

        // Xác thực webhook signature
        public bool VerifyWebhookSignature(string payload, string signature)
        {
            var expectedSignature = CreateSignature(payload);
            return string.Equals(expectedSignature, signature, StringComparison.OrdinalIgnoreCase);
        }
    }

    public class SePayQRResponse
    {
        public bool Success { get; set; }
        public string? QrCode { get; set; }
        public string? PaymentUrl { get; set; }
        public string? OrderId { get; set; }
        public string? Message { get; set; }
    }

    public class SePayPaymentStatus
    {
        public bool Success { get; set; }
        public string? Status { get; set; } // pending, success, failed
        public string? OrderId { get; set; }
        public decimal? Amount { get; set; }
        public string? Message { get; set; }
    }

    public class SePayWebhookPayload
    {
        public string? OrderId { get; set; }
        public string? Status { get; set; }
        public decimal? Amount { get; set; }
        public string? TransactionId { get; set; }
        public DateTime? TransactionTime { get; set; }
        public string? Signature { get; set; }
    }
}

