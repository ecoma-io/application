# Icons Infrastructure

## Giới thiệu

Icons Infrastructure là một ứng dụng hỗ trợ trong hệ thống Ecoma, chịu trách nhiệm quản lý và phân phối các icon và biểu tượng được sử dụng xuyên suốt các ứng dụng. Ứng dụng này đảm bảo tính nhất quán về hình ảnh và biểu tượng trong toàn bộ hệ sinh thái Ecoma.

## Chức năng chính

- Lưu trữ và quản lý tập trung các icon và biểu tượng
- Cung cấp API để truy xuất icon theo tên, kích thước, và định dạng
- Hỗ trợ nhiều định dạng icon (SVG, PNG, Font icons)
- Tối ưu hóa và nén icon để giảm kích thước
- Quản lý phiên bản của các bộ icon
- Cung cấp preview và tài liệu về các icon có sẵn

## Kiến trúc

Ứng dụng được xây dựng như một dịch vụ microservice độc lập:

- **API Layer**: Cung cấp REST API để truy xuất và quản lý icon
- **Storage Layer**: Quản lý lưu trữ và tổ chức các file icon
- **Processing Layer**: Xử lý, tối ưu hóa và chuyển đổi định dạng icon

## API

### REST API

- `GET /api/v1/icons`: Lấy danh sách tất cả các icon
- `GET /api/v1/icons/:name`: Lấy icon theo tên
- `GET /api/v1/icons/:name/:size`: Lấy icon theo tên và kích thước
- `GET /api/v1/icons/:name/:format`: Lấy icon theo tên và định dạng
- `POST /api/v1/icons`: Tải lên icon mới
- `PUT /api/v1/icons/:name`: Cập nhật icon hiện có
- `DELETE /api/v1/icons/:name`: Xóa icon

### Query Parameters

- `size`: Kích thước icon (16, 24, 32, 48, 64, 128)
- `format`: Định dạng icon (svg, png, webp)
- `color`: Mã màu cho icon (hex, rgb)
- `theme`: Theme của icon (light, dark)

## Cấu trúc thư mục

```
icons/
├── src/
│   ├── app/
│   │   ├── controllers/        # API controllers
│   │   ├── services/           # Business logic services
│   │   ├── models/             # Data models
│   │   └── utils/              # Utility functions
│   ├── assets/                 # Icon assets
│   │   ├── svg/
│   │   ├── png/
│   │   └── fonts/
│   └── config/                 # Configuration files
├── public/                     # Public assets
│   └── docs/                   # Icon documentation
```

## Thiết lập và Chạy

### Yêu cầu

- Node.js 18+
- Yarn
- Sharp (for image processing)
- SVG Optimizer

### Phát triển

```bash
# Cài đặt dependencies
yarn install

# Chạy ứng dụng trong môi trường development
nx serve icons

# Build ứng dụng
nx build icons

# Chạy tests
nx test icons
```

## Deployment

Ứng dụng được đóng gói dưới dạng Docker container và có thể được triển khai trên Kubernetes:

```bash
# Build Docker image
nx build icons
docker build -t ecoma/icons:latest -f apps/infras/icons/Dockerfile .

# Deploy trên Kubernetes
kubectl apply -f k8s/icons.yaml
```

## Cấu hình

Ứng dụng có thể được cấu hình thông qua các biến môi trường:

- `ICONS_STORAGE_PATH`: Đường dẫn lưu trữ các file icon
- `ICONS_CACHE_TTL`: Thời gian cache (seconds)
- `ICONS_MAX_SIZE`: Kích thước tối đa cho các file icon (bytes)
- `ICONS_ALLOWED_FORMATS`: Các định dạng được phép (svg,png,webp)

## Tích hợp với các ứng dụng khác

Các ứng dụng khác trong hệ sinh thái Ecoma có thể sử dụng Icons Infrastructure thông qua:

- REST API trực tiếp
- Thư viện client được cung cấp
- CDN URLs cho các icon phổ biến

## Quy trình thêm icon mới

1. Chuẩn bị file icon theo đúng định dạng và kích thước
2. Tối ưu hóa file icon (nén, xóa metadata không cần thiết)
3. Tải lên thông qua API hoặc thêm trực tiếp vào thư mục assets
4. Cập nhật tài liệu và danh mục icon

## Liên kết

- [Icon Design Guidelines](../../docs/design/icon-guidelines.md)
- [API Documentation](./public/docs/api.md)
- [Integration Examples](./public/docs/examples.md)
