# Hướng dẫn cấu hình OAuth (Google & Facebook)

## 📋 Tổng quan

Dự án đã được tích hợp đăng nhập OAuth với Google và Facebook. Để sử dụng tính năng này, bạn cần cấu hình Client ID và App ID từ các nhà cung cấp.

---

## 🔵 Cấu hình Google OAuth

### Bước 1: Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Bật **Google+ API** hoặc **Google Identity Services**

### Bước 2: Tạo OAuth 2.0 Client ID

1. Vào **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Chọn **Web application**
4. Cấu hình:
   - **Name**: Shop Ban Do The Thao (hoặc tên bạn muốn)
   - **Authorized JavaScript origins**: 
     - `http://localhost:61620`
     - `https://yourdomain.com` (production)
   - **Authorized redirect URIs**:
     - `http://localhost:61620`
     - `https://yourdomain.com` (production)
5. Click **Create**
6. Copy **Client ID** (có dạng: `xxxxx.apps.googleusercontent.com`)

### Bước 3: Cấu hình trong dự án

Thêm vào file `.env` trong thư mục `shopbandothethao.client`:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

---

## 🔵 Cấu hình Facebook OAuth

### Bước 1: Tạo Facebook App

1. Truy cập [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps** > **Create App**
3. Chọn **Consumer** hoặc **Business**
4. Điền thông tin:
   - **App Name**: Shop Ban Do The Thao
   - **App Contact Email**: your-email@example.com
5. Click **Create App**

### Bước 2: Thêm Facebook Login

1. Trong dashboard, tìm **Facebook Login** và click **Set Up**
2. Chọn **Web** platform
3. Cấu hình:
   - **Site URL**: `http://localhost:61620` (development)
   - **Valid OAuth Redirect URIs**: `http://localhost:61620` (development)
4. Lưu cấu hình

### Bước 3: Lấy App ID

1. Vào **Settings** > **Basic**
2. Copy **App ID**

### Bước 4: Cấu hình trong dự án

Thêm vào file `.env` trong thư mục `shopbandothethao.client`:

```env
VITE_FACEBOOK_APP_ID=your-facebook-app-id
```

### Bước 5: Cấu hình App Domains (Production)

Khi deploy lên production:
1. Vào **Settings** > **Basic**
2. Thêm domain vào **App Domains**: `yourdomain.com`
3. Thêm **Site URL** cho production: `https://yourdomain.com`

---

## 📝 File .env mẫu

Tạo file `.env` trong thư mục `shopbandothethao.client`:

```env
# API Configuration
VITE_API_URL=http://localhost:5066/api

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Facebook OAuth Configuration
VITE_FACEBOOK_APP_ID=your-facebook-app-id
```

**Lưu ý**: 
- File `.env` không được commit lên Git (đã có trong `.gitignore`)
- Sử dụng `.env.example` làm template

---

## 🚀 Sử dụng

Sau khi cấu hình xong:

1. **Restart development server**:
   ```bash
   npm run dev
   ```

2. Mở trang đăng nhập/đăng ký
3. Click nút **"Đăng nhập với Google"** hoặc **"Đăng nhập với Facebook"**
4. Cho phép ứng dụng truy cập thông tin
5. Hệ thống sẽ tự động tạo tài khoản hoặc đăng nhập nếu đã có

---

## 🔒 Bảo mật

### Development
- Sử dụng `localhost` trong cấu hình OAuth
- Không commit file `.env` lên Git

### Production
- Sử dụng HTTPS
- Cập nhật **Authorized JavaScript origins** và **Authorized redirect URIs** với domain production
- Sử dụng biến môi trường an toàn (không hardcode trong code)

---

## ❓ Troubleshooting

### Google Sign-In không hoạt động
- Kiểm tra Client ID đã đúng chưa
- Kiểm tra **Authorized JavaScript origins** đã thêm domain chưa
- Kiểm tra console browser có lỗi gì không

### Facebook Login không hoạt động
- Kiểm tra App ID đã đúng chưa
- Kiểm tra **Site URL** đã cấu hình chưa
- Kiểm tra Facebook App đã ở chế độ **Live** chưa (hoặc thêm test users)

### Lỗi CORS
- Đảm bảo domain trong cấu hình OAuth khớp với domain frontend
- Kiểm tra CORS settings trong backend `Program.cs`

---

## 📚 Tài liệu tham khảo

- [Google Identity Services Documentation](https://developers.google.com/identity/gsi/web)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login/web)
- [OAuth 2.0 Specification](https://oauth.net/2/)

---

**Lưu ý**: Đảm bảo bạn đã đọc và tuân thủ các điều khoản sử dụng của Google và Facebook khi tích hợp OAuth.

