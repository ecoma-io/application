# Admin Site

## Giới thiệu

Admin Site là ứng dụng web dành cho quản trị viên của hệ thống Ecoma, cung cấp giao diện để quản lý và giám sát toàn bộ hệ thống. Ứng dụng được xây dựng bằng Angular và tuân thủ các nguyên tắc thiết kế hiện đại, tập trung vào trải nghiệm người dùng và hiệu suất.

## Chức năng chính

- Quản lý người dùng và phân quyền
- Quản lý tenant và subscription
- Cấu hình hệ thống và các bounded context
- Giám sát hoạt động và hiệu suất hệ thống
- Xem và quản lý audit logs
- Quản lý các chính sách (policy) của hệ thống
- Báo cáo và thống kê

## Kiến trúc

Ứng dụng được xây dựng theo kiến trúc module của Angular:

- **Core Module**: Chứa các service, guard, interceptor cốt lõi của ứng dụng
- **Shared Module**: Chứa các component, directive, pipe dùng chung
- **Feature Modules**: Mỗi tính năng lớn được tổ chức thành một module riêng biệt
- **Layout Module**: Quản lý bố cục và navigation của ứng dụng

Ứng dụng sử dụng các thư viện Angular của Ecoma:

- `nge-ui`: Thư viện UI components
- `nge-logging`: Thư viện logging
- `nge-cookie`: Thư viện quản lý cookie

## Cấu trúc thư mục

```
admin-site/
├── src/
│   ├── app/
│   │   ├── core/              # Core module
│   │   ├── shared/            # Shared module
│   │   ├── features/          # Feature modules
│   │   │   ├── dashboard/
│   │   │   ├── users/
│   │   │   ├── tenants/
│   │   │   ├── audit-logs/
│   │   │   └── settings/
│   │   ├── layout/            # Layout module
│   │   └── app.module.ts
│   ├── assets/                # Static assets
│   ├── environments/          # Environment configurations
│   └── styles/                # Global styles
```

## Thiết lập và Chạy

### Yêu cầu

- Node.js 18+
- Yarn
- Angular CLI

### Phát triển

```bash
# Cài đặt dependencies
yarn install

# Chạy ứng dụng trong môi trường development
nx serve admin-site

# Build ứng dụng
nx build admin-site

# Chạy tests
nx test admin-site

# Chạy e2e tests
nx e2e admin-site
```

## Deployment

Ứng dụng được đóng gói dưới dạng Docker container và có thể được triển khai trên Kubernetes:

```bash
# Build Docker image
nx build admin-site --configuration=production
docker build -t ecoma/admin-site:latest -f apps/sites/admin-site/Dockerfile .

# Deploy trên Kubernetes
kubectl apply -f k8s/admin-site.yaml
```

## Môi trường

Ứng dụng hỗ trợ các môi trường sau:

- **Development**: Môi trường phát triển local
- **Staging**: Môi trường kiểm thử trước khi đưa vào production
- **Production**: Môi trường sản phẩm

Cấu hình cho mỗi môi trường được định nghĩa trong thư mục `environments/`.

## Authentication và Authorization

Ứng dụng sử dụng OAuth2/OIDC để xác thực người dùng, với các tính năng:

- Login/Logout
- Role-based access control
- Permission-based access control
- Session management

## Internationalization (i18n)

Ứng dụng hỗ trợ đa ngôn ngữ thông qua Angular i18n và các service của Ecoma:

- Tiếng Anh (mặc định)
- Hỗ trợ thêm các ngôn ngữ khác tùy theo cấu hình backend

## Accessibility

Ứng dụng tuân thủ các tiêu chuẩn WCAG 2.1 AA để đảm bảo khả năng tiếp cận cho tất cả người dùng.

## Browser Support

- Chrome (2 phiên bản mới nhất)
- Firefox (2 phiên bản mới nhất)
- Edge (2 phiên bản mới nhất)
- Safari (2 phiên bản mới nhất)

## Liên kết

- [Angular Documentation](https://angular.io/docs)
- [NGE UI Documentation](../../libs/angular/nge-ui/README.md)
- [NGE Logging Documentation](../../libs/angular/nge-logging/README.md)
- [NGE Cookie Documentation](../../libs/angular/nge-cookie/README.md)
