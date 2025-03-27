# App Site

## Giới thiệu

App Site là ứng dụng web chính dành cho người dùng cuối của hệ thống Ecoma, cung cấp giao diện để sử dụng các tính năng thương mại điện tử. Ứng dụng được xây dựng bằng Angular và tập trung vào trải nghiệm người dùng, hiệu suất và khả năng mở rộng.

## Chức năng chính

- Quản lý sản phẩm và danh mục
- Quản lý đơn hàng và theo dõi trạng thái
- Quản lý kho hàng và tồn kho
- Quản lý khách hàng và tương tác
- Báo cáo và thống kê
- Cấu hình và tùy chỉnh cửa hàng
- Tích hợp thanh toán và vận chuyển

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
app-site/
├── src/
│   ├── app/
│   │   ├── core/              # Core module
│   │   ├── shared/            # Shared module
│   │   ├── features/          # Feature modules
│   │   │   ├── dashboard/
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   ├── inventory/
│   │   │   ├── customers/
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
nx serve app-site

# Build ứng dụng
nx build app-site

# Chạy tests
nx test app-site

# Chạy e2e tests
nx e2e app-site
```

## Deployment

Ứng dụng được đóng gói dưới dạng Docker container và có thể được triển khai trên Kubernetes:

```bash
# Build Docker image
nx build app-site --configuration=production
docker build -t ecoma/app-site:latest -f apps/sites/app-site/Dockerfile .

# Deploy trên Kubernetes
kubectl apply -f k8s/app-site.yaml
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

## Performance Optimization

Ứng dụng được tối ưu hóa hiệu suất thông qua các kỹ thuật:

- Lazy loading các module
- Server-side rendering (Angular Universal)
- Progressive Web App (PWA) capabilities
- Caching và state management hiệu quả
- Image optimization và lazy loading

## Responsive Design

Ứng dụng được thiết kế để hoạt động trên nhiều loại thiết bị:

- Desktop
- Tablet
- Mobile

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
