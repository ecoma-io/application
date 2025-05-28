# Home Site

## Giới thiệu

Home Site là ứng dụng web công khai của Ecoma, giới thiệu về sản phẩm và dịch vụ của công ty đến khách hàng tiềm năng. Đây là điểm tiếp xúc đầu tiên của người dùng với hệ sinh thái Ecoma, cung cấp thông tin về giải pháp, tính năng, giá cả.

## Chức năng chính

- Trang chủ giới thiệu tổng quan về Ecoma
- Trang sản phẩm và tính năng chi tiết
- Trang giá cả và gói dịch vụ
- Blog và trung tâm tài nguyên
- Trang liên hệ
- Cung cấp đường link đến trang đăng ký/đăng nhập
- Cung cấp đường link đến hệ thống hỗ trợ

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
home-site/
├── src/
│   ├── app/
│   │   ├── core/              # Core module
│   │   ├── shared/            # Shared module
│   │   ├── features/          # Feature modules
│   │   │   ├── home/
│   │   │   ├── products/
│   │   │   ├── pricing/
│   │   │   ├── blog/
│   │   │   └── contact/
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
nx serve home-site

# Build ứng dụng
nx build home-site

# Chạy tests
nx test home-site

# Chạy e2e tests
nx e2e home-site
```

## Deployment

Ứng dụng được đóng gói dưới dạng Docker container và có thể được triển khai trên Kubernetes:

```bash
# Build Docker image
nx build home-site --configuration=production
docker build -t ecoma/home-site:latest -f apps/sites/home-site/Dockerfile .

# Deploy trên Kubernetes
kubectl apply -f k8s/home-site.yaml
```

## Môi trường

Ứng dụng hỗ trợ các môi trường sau:

- **Development**: Môi trường phát triển local
- **Staging**: Môi trường kiểm thử trước khi đưa vào production
- **Production**: Môi trường sản phẩm

Cấu hình cho mỗi môi trường được định nghĩa trong thư mục `environments/`.

## SEO Optimization

Ứng dụng được tối ưu hóa cho SEO thông qua:

- Server-side rendering (Angular Universal)
- Metadata và schema markup
- Sitemap và robots.txt
- Canonical URLs
- Social media tags (Open Graph, Twitter Cards)

## Performance Optimization

Ứng dụng được tối ưu hóa hiệu suất thông qua các kỹ thuật:

- Lazy loading các module
- Progressive Web App (PWA) capabilities
- Image optimization
- Critical CSS
- Caching và preloading

## Analytics và Tracking

Ứng dụng tích hợp các công cụ phân tích để theo dõi hành vi người dùng:

- Google Analytics
- Conversion tracking
- Event tracking
- Heatmaps và session recording

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
