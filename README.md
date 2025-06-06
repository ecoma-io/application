# Ecoma

## Bắt đầu phát triển

- Cài đặt **VSCode** và **Docker** trên máy tính của bạn
- Mở một cửa sổ VSCode mới, nhấn **F1** để mở **Command Prompt**, sau đó tìm kiếm `Dev Containers: Clone Repository in Container Volume...`

Chọn project và branch phù hợp, sau đó chờ quá trình thiết lập **devcontainer** để cấu hình môi trường phát triển.

---

## Cài đặt chứng chỉ SSL tự ký (Self-Signed SSL Certificate)

### Bước 1: Lấy file chứng chỉ

Sao chép file từ đường dẫn `.nginx/wildcard.crt`.

### Bước 2: Cài đặt chứng chỉ

#### Trên Windows

1. Nhấp đúp vào file `wildcard.crt`
2. Chọn **Install Certificate**
3. Chọn **Local Machine** và nhấn **Next**
4. Chọn **Place all certificates in the following store**, sau đó nhấn **Browse**
5. Chọn **Trusted Root Certification Authorities** rồi nhấn **OK**
6. Nhấn **Next**, sau đó **Finish**
7. Khởi động lại trình duyệt

#### Trên macOS

1. Mở ứng dụng **Keychain Access**
2. Kéo và thả file `wildcard.crt` vào **System** keychain
3. Nhấp đúp vào chứng chỉ, mở rộng phần **Trust**, sau đó thiết lập **When using this certificate** thành **Always Trust**
4. Đóng cửa sổ và nhập mật khẩu nếu được yêu cầu
5. Khởi động lại trình duyệt

#### Trên Linux (Ubuntu/Debian)

1. Di chuyển file chứng chỉ vào thư mục hệ thống:
   ```sh
   sudo cp ./nginx/wildcard.crt /usr/local/share/ca-certificates/wildcard.crt
   ```
2. Cập nhật danh sách chứng chỉ:
   ```sh
   sudo update-ca-certificates
   ```
3. Khởi động lại trình duyệt

---

## Chạy toàn bộ project

```sh
docker compose up -d --wait
```

Toàn bộ project sẽ chạy trên domain `fbi.com` để mô phỏng môi trường giống production nhất có thể.

Các domain sử dụng trong cả production/development

| Service       | Domain                   | Mô tả                                                |
| ------------- | ------------------------ | ---------------------------------------------------- |
| Home Site     | https://fbi.com          | home web app của ecoma                               |
| Accounts Site | https://accounts.fbi.com | Trang đăng ký/đăng nhập và quản lý thông tin profile |
| App Site      | https://app.fbi.com      | Web app SaaS                                         |
| Admin Site    | https://admin.fbi.com    | Administrator Web App                                |
| Icons         | https://icons.fbi.com    | Icons assets                                         |
| S3            | https://s3.fbi.com       | Minio S3 API                                         |

Domain chỉ sử dụng trong development

| Service         | Domain                  | Mô tả                                                |
| --------------- | ----------------------- | ---------------------------------------------------- |
| Dev document    | https://docs.fbi.com    | Tài liệu phát triển (thư mục docs)                   |
| Maildev         | https://mail.fbi.com    | Giao diện quản lý mailbox giả lập cho môi trường dev |
| Mongo Express   | https://mongodb.fbi.com | Giao diện quản quản lý mongodb database              |
| Redis Commander | https://redis.fbi.com/  | Giao diện quản lý redis                              |
| Minio Console   | https://minio.fbi.com/  | Giao diện quản lý minio                              |

Để tìm hiểu sâu hơn hãy bắt đầu với dev document
