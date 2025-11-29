using System.Net;
using System.Net.Mail;
using System.Text;

namespace ShopBanDoTheThao.Server.Services
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<bool> SendEmailAsync(string toEmail, string subject, string body, bool isHtml = true)
        {
            try
            {
                var smtpSettings = _configuration.GetSection("SmtpSettings");
                var smtpServer = smtpSettings["Server"] ?? "smtp.gmail.com";
                var smtpPort = int.Parse(smtpSettings["Port"] ?? "587");
                var smtpUsername = smtpSettings["Username"];
                var smtpPassword = smtpSettings["Password"];
                var fromEmail = smtpSettings["FromEmail"] ?? smtpUsername;
                var fromName = smtpSettings["FromName"] ?? "Shop Bán Đồ Thể Thao";

                if (string.IsNullOrEmpty(smtpUsername) || string.IsNullOrEmpty(smtpPassword))
                {
                    _logger.LogWarning("SMTP settings not configured. Email will not be sent.");
                    return false;
                }

                using (var client = new SmtpClient(smtpServer, smtpPort))
                {
                    client.EnableSsl = true;
                    client.Credentials = new NetworkCredential(smtpUsername, smtpPassword);

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(fromEmail, fromName),
                        Subject = subject,
                        Body = body,
                        IsBodyHtml = isHtml,
                        BodyEncoding = Encoding.UTF8,
                        SubjectEncoding = Encoding.UTF8
                    };

                    mailMessage.To.Add(toEmail);

                    await client.SendMailAsync(mailMessage);
                    _logger.LogInformation($"Email sent successfully to {toEmail}");
                    return true;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error sending email to {toEmail}");
                return false;
            }
        }

        public async Task<bool> SendPasswordResetEmailAsync(string toEmail, string resetToken, string resetUrl)
        {
            var subject = "Đặt lại mật khẩu - Shop Bán Đồ Thể Thao";
            var body = $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
        .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
        .button {{ display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
        .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🔐 Đặt lại mật khẩu</h1>
        </div>
        <div class='content'>
            <p>Xin chào,</p>
            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
            <p>Vui lòng click vào nút bên dưới để đặt lại mật khẩu:</p>
            <div style='text-align: center;'>
                <a href='{resetUrl}' class='button'>Đặt lại mật khẩu</a>
            </div>
            <p>Hoặc copy và dán link sau vào trình duyệt:</p>
            <p style='word-break: break-all; background: #fff; padding: 10px; border-radius: 5px;'>{resetUrl}</p>
            <p><strong>Lưu ý:</strong> Link này sẽ hết hạn sau 1 giờ.</p>
            <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
        </div>
        <div class='footer'>
            <p>Trân trọng,<br>Đội ngũ Shop Bán Đồ Thể Thao</p>
        </div>
    </div>
</body>
</html>";

            return await SendEmailAsync(toEmail, subject, body, true);
        }
    }
}





