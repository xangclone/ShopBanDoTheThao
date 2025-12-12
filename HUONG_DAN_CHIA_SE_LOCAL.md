# Hướng dẫn chia sẻ ứng dụng local cho người khác xem

Có nhiều cách để chia sẻ ứng dụng local, cách đơn giản nhất là sử dụng **ngrok** để tạo tunnel công khai.

## Cách 1: Sử dụng ngrok (Khuyến nghị)

### Bước 1: Cài đặt ngrok

1. Truy cập: https://ngrok.com/
2. Đăng ký tài khoản miễn phí
3. Tải ngrok về máy: https://ngrok.com/download
4. Giải nén và đặt file `ngrok.exe` vào thư mục dễ truy cập (ví dụ: `C:\ngrok\`)

### Bước 2: Lấy Authtoken

1. Đăng nhập vào https://dashboard.ngrok.com/
2. Vào mục **Your Authtoken**
3. Copy token của bạn

### Bước 3: Cấu hình ngrok

Mở PowerShell hoặc Command Prompt và chạy:

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

### Bước 4: Chạy ngrok cho Backend (Port 5066)

Mở một terminal mới và chạy:

```bash
ngrok http 5066
```

Bạn sẽ thấy output như:
```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:5066
```

**Lưu lại URL này** (ví dụ: `https://abc123.ngrok-free.app`)

### Bước 5: Chạy ngrok cho Frontend (Port 61620)

Mở một terminal mới khác và chạy:

```bash
ngrok http 61620
```

Bạn sẽ thấy output như:
```
Forwarding  https://xyz789.ngrok-free.app -> http://localhost:61620
```

**Lưu lại URL này** (ví dụ: `https://xyz789.ngrok-free.app`)

### Bước 6: Cập nhật CORS trong Backend

Mở file `ShopBanDoTheThao.Server/Program.cs` và cập nhật CORS:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
            "http://localhost:61620", 
            "https://localhost:61620",
            "https://xyz789.ngrok-free.app"  // <-- Thêm URL ngrok của frontend
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});
```

**Lưu ý:** Thay `xyz789.ngrok-free.app` bằng URL ngrok thực tế của bạn.

### Bước 7: Cập nhật API URL trong Frontend

Tạo file `.env` trong thư mục `shopbandothethao.client/` (nếu chưa có) hoặc cập nhật:

```env
VITE_API_URL=https://abc123.ngrok-free.app/api
```

**Lưu ý:** Thay `abc123.ngrok-free.app` bằng URL ngrok của backend.

### Bước 8: Khởi động lại ứng dụng

1. **Backend:** Khởi động lại server ASP.NET Core
2. **Frontend:** Khởi động lại Vite dev server

### Bước 9: Chia sẻ URL

Chia sẻ URL ngrok của frontend cho người khác:
```
https://xyz789.ngrok-free.app
```

---

## Cách 2: Sử dụng localtunnel (Miễn phí, không cần đăng ký)

### Cài đặt:

```bash
npm install -g localtunnel
```

### Chạy cho Backend:

```bash
lt --port 5066 --subdomain your-backend-name
```

### Chạy cho Frontend:

```bash
lt --port 61620 --subdomain your-frontend-name
```

**Lưu ý:** Subdomain phải là duy nhất và chưa được sử dụng.

---

## Cách 3: Chia sẻ qua mạng LAN (Cùng mạng WiFi)

Nếu người khác cùng mạng WiFi với bạn:

### Bước 1: Lấy địa chỉ IP của máy bạn

**Windows:**
```bash
ipconfig
```
Tìm `IPv4 Address` (ví dụ: `192.168.1.100`)

### Bước 2: Cập nhật CORS

Thêm IP của bạn vào CORS trong `Program.cs`:

```csharp
policy.WithOrigins(
    "http://localhost:61620",
    "https://localhost:61620",
    "http://192.168.1.100:61620"  // <-- IP của bạn
)
```

### Bước 3: Cập nhật API URL

Trong `.env` của frontend:
```env
VITE_API_URL=http://192.168.1.100:5066/api
```

### Bước 4: Chia sẻ URL

Chia sẻ cho người khác:
```
http://192.168.1.100:61620
```

**Lưu ý:** Đảm bảo Windows Firewall cho phép kết nối trên các port này.

---

## Lưu ý quan trọng:

1. **URL ngrok miễn phí sẽ thay đổi mỗi lần khởi động lại** (trừ khi dùng plan trả phí)
2. **Ngrok miễn phí có giới hạn số lượng request**
3. **Đảm bảo cả backend và frontend đều đang chạy** trước khi chia sẻ
4. **Kiểm tra kết nối** bằng cách mở URL ngrok trong trình duyệt
5. **Nếu có lỗi CORS**, kiểm tra lại CORS settings trong `Program.cs`

---

## Troubleshooting:

### Lỗi: "The endpoint is already online" (ERR_NGROK_334)

**Nguyên nhân:** Có process ngrok khác đang chạy và sử dụng cùng endpoint.

**Giải pháp 1: Dừng tất cả process ngrok (Khuyến nghị)**

**Windows:**
```bash
taskkill /F /IM ngrok.exe
```

**Mac/Linux:**
```bash
pkill ngrok
```

Sau đó chạy lại ngrok.

**Giải pháp 2: Sử dụng pooling (Load balance)**

Nếu bạn muốn chạy nhiều tunnel cùng lúc:

```bash
ngrok http 5066 --pooling-enabled
ngrok http 61620 --pooling-enabled
```

**Giải pháp 3: Dùng subdomain khác (Chỉ với plan trả phí)**

```bash
ngrok http 5066 --subdomain=your-custom-name
```

### Lỗi CORS:
- Kiểm tra URL trong CORS có đúng không
- Đảm bảo URL ngrok được thêm vào `WithOrigins()`
- Khởi động lại backend sau khi sửa CORS

### Không kết nối được:
- Kiểm tra cả backend và frontend đang chạy
- Kiểm tra URL ngrok có đúng không
- Kiểm tra firewall không chặn kết nối

### URL ngrok không hoạt động:
- Kiểm tra ngrok đang chạy
- Kiểm tra port có đúng không (5066 cho backend, 61620 cho frontend)
- Thử restart ngrok

### Kiểm tra process ngrok đang chạy:

**Windows:**
```bash
tasklist | findstr ngrok
```

**Mac/Linux:**
```bash
ps aux | grep ngrok
```

