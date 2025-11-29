# Hướng dẫn cấu hình SMTP để gửi email

## Cách 1: Sử dụng Gmail (Khuyến nghị)

### Bước 1: Bật xác thực 2 bước cho Gmail
1. Truy cập: https://myaccount.google.com/security
2. Bật "Xác minh 2 bước" (2-Step Verification)

### Bước 2: Tạo App Password
1. Truy cập: https://myaccount.google.com/apppasswords
2. Chọn "Mail" và "Other (Custom name)"
3. Nhập tên: "Shop Ban Do The Thao"
4. Click "Generate"
5. Copy mật khẩu 16 ký tự (ví dụ: `abcd efgh ijkl mnop`)

### Bước 3: Cấu hình trong appsettings.json

```json
{
  "SmtpSettings": {
    "Server": "smtp.gmail.com",
    "Port": "587",
    "Username": "bandothethaoshop@gmail.com",
    "Password": "quiygotvnlsklbtid",
    "FromEmail": "bandothethaoshop@gmail.com",
    "FromName": "Shop Bán Đồ Thể Thao"
  },
  "FrontendUrl": "http://localhost:61620"
}
```

**Lưu ý:**
- `Username` và `FromEmail`: Email Gmail của bạn
- `Password`: App Password (16 ký tự, không có khoảng trắng)
- `Port`: 587 (TLS) hoặc 465 (SSL)

---

## Cách 2: Sử dụng Outlook/Hotmail

```json
{
  "SmtpSettings": {
    "Server": "smtp-mail.outlook.com",
    "Port": "587",
    "Username": "your-email@outlook.com",
    "Password": "your-password",
    "FromEmail": "your-email@outlook.com",
    "FromName": "Shop Bán Đồ Thể Thao"
  }
}
```

---

## Cách 3: Sử dụng SMTP Server khác

### Ví dụ với SendGrid:
```json
{
  "SmtpSettings": {
    "Server": "smtp.sendgrid.net",
    "Port": "587",
    "Username": "apikey",
    "Password": "YOUR_SENDGRID_API_KEY",
    "FromEmail": "noreply@yourdomain.com",
    "FromName": "Shop Bán Đồ Thể Thao"
  }
}
```

### Ví dụ với Mailgun:
```json
{
  "SmtpSettings": {
    "Server": "smtp.mailgun.org",
    "Port": "587",
    "Username": "postmaster@yourdomain.mailgun.org",
    "Password": "YOUR_MAILGUN_PASSWORD",
    "FromEmail": "noreply@yourdomain.com",
    "FromName": "Shop Bán Đồ Thể Thao"
  }
}
```

---

## Kiểm tra cấu hình

Sau khi cấu hình, khởi động lại server và thử tính năng "Quên mật khẩu". Nếu có lỗi, kiểm tra:
1. Console logs của server
2. Email có được gửi đi không
3. Kiểm tra thư mục Spam

---

## Bảo mật

⚠️ **QUAN TRỌNG:** Không commit file `appsettings.json` có chứa mật khẩu thật lên Git!

Nên sử dụng:
- `appsettings.Development.json` cho môi trường dev (có thể commit)
- `appsettings.Production.json` cho production (không commit, chỉ deploy)
- Hoặc sử dụng User Secrets hoặc Environment Variables

### Sử dụng User Secrets (Khuyến nghị cho Development):

```bash
cd ShopBanDoTheThao.Server
dotnet user-secrets set "SmtpSettings:Username" "your-email@gmail.com"
dotnet user-secrets set "SmtpSettings:Password" "your-app-password"
dotnet user-secrets set "SmtpSettings:FromEmail" "your-email@gmail.com"
```

Sau đó trong `appsettings.json`, có thể để giá trị mặc định hoặc để trống.

