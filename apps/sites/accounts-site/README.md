# Accounts Site

## Giới thiệu

Accounts Site là ứng dụng web chịu trách nhiệm quản lý tài khoản và xác thực người dùng trong hệ thống Ecoma. Ứng dụng này cung cấp giao diện cho các chức năng liên quan đến quản lý tài khoản, bảo mật, và quyền truy cập, đóng vai trò là cổng vào trung tâm cho hệ sinh thái Ecoma.

## Chức năng chính

- Đăng ký tài khoản mới
- Đăng nhập và xác thực
- Quản lý hồ sơ người dùng
- Quản lý mật khẩu và bảo mật
- Xác thực hai yếu tố (2FA)
- Quản lý phiên đăng nhập
- Phân quyền và vai trò người dùng
- Quản lý tổ chức và tenant
- Đăng ký và quản lý subscription

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
accounts-site/
├── src/
│   ├── app/
│   │   ├── core/              # Core module
│   │   ├── shared/            # Shared module
│   │   ├── features/          # Feature modules
│   │   │   ├── auth/
│   │   │   ├── profile/
│   │   │   ├── security/
│   │   │   ├── organization/
│   │   │   ├── subscription/
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
nx serve accounts-site

# Build ứng dụng
nx build accounts-site

# Chạy tests
nx test accounts-site

# Chạy e2e tests
nx e2e accounts-site
```

## Deployment

Ứng dụng được đóng gói dưới dạng Docker container và có thể được triển khai trên Kubernetes:

```bash
# Build Docker image
nx build accounts-site --configuration=production
docker build -t ecoma/accounts-site:latest -f apps/sites/accounts-site/Dockerfile .

# Deploy trên Kubernetes
kubectl apply -f k8s/accounts-site.yaml
```

## Môi trường

Ứng dụng hỗ trợ các môi trường sau:

- **Development**: Môi trường phát triển local
- **Staging**: Môi trường kiểm thử trước khi đưa vào production
- **Production**: Môi trường sản phẩm

Cấu hình cho mỗi môi trường được định nghĩa trong thư mục `environments/`.

## Authentication và Authorization

Ứng dụng triển khai một hệ thống xác thực và phân quyền toàn diện:

- OAuth2/OIDC authentication flow
- JWT token management
- Role-based access control (RBAC)
- Permission-based access control
- Multi-factor authentication (MFA)
- Single Sign-On (SSO) với các ứng dụng khác trong hệ sinh thái Ecoma

## Bảo mật

Ứng dụng tuân thủ các tiêu chuẩn bảo mật cao nhất:

- HTTPS-only
- CSRF protection
- XSS prevention
- Content Security Policy (CSP)
- Brute force protection
- Rate limiting
- Audit logging cho các hoạt động nhạy cảm

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
