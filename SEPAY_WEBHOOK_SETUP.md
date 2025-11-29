# Hướng dẫn cấu hình Webhook SePay

## Webhook URL

URL webhook cần cấu hình trong SePay Dashboard:

```
https://yourdomain.com/api/sepay/webhook
```

**Ví dụ:**
- Development: `http://localhost:5066/api/sepay/webhook`
- Production: `https://shopbandothethao.com/api/sepay/webhook`

## Cấu hình trong SePay Dashboard

1. Đăng nhập vào SePay Dashboard
2. Vào mục **Tích hợp** > **Webhooks**
3. Thêm Webhook URL mới:
   - **URL**: `https://yourdomain.com/api/sepay/webhook`
   - **Events**: Chọn các sự kiện cần nhận (Payment Success, Payment Failed)
   - **Secret**: Nhập `WebhookSecret` từ `appsettings.json`

## Cấu hình trong appsettings.json

```json
{
  "SePay": {
    "ApiKey": "YOUR_SEPAY_API_KEY",
    "ApiSecret": "YOUR_SEPAY_API_SECRET",
    "ApiUrl": "https://api.sepay.vn",
    "WebhookSecret": "YOUR_SEPAY_WEBHOOK_SECRET"
  }
}
```

## Webhook Payload Format

SePay sẽ gửi POST request với payload:

```json
{
  "orderId": "DH20241125123456",
  "status": "success",
  "amount": 500000,
  "transactionId": "TXN123456",
  "transactionTime": "2024-11-25T12:34:56Z",
  "signature": "hmac_sha256_signature"
}
```

## Xác thực Webhook

Controller sẽ tự động:
1. Kiểm tra header `X-SePay-Signature`
2. Xác thực signature bằng HMAC SHA256
3. Xử lý và cập nhật trạng thái đơn hàng

## Lưu ý

- Webhook URL phải có thể truy cập từ internet (không phải localhost)
- Sử dụng HTTPS trong production
- Đảm bảo WebhookSecret khớp với cấu hình trong SePay Dashboard
- Test webhook bằng cách tạo thanh toán thử nghiệm

