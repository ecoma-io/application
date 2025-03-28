# ALM Query Service

## Giới thiệu

ALM Query Service là một microservice trong hệ thống Audit Log Management (ALM) của Ecoma, chịu trách nhiệm cung cấp các chức năng truy vấn và tìm kiếm dữ liệu audit log. Service này được thiết kế theo mô hình CQRS, tập trung vào phần Query (đọc dữ liệu) để tối ưu hóa hiệu suất và khả năng mở rộng cho các truy vấn phức tạp trên khối lượng dữ liệu lớn.

## Chức năng chính

- Tìm kiếm và lọc audit log theo nhiều tiêu chí (thời gian, người dùng, hành động, đối tượng, v.v.)
- Cung cấp API phân trang và sắp xếp cho kết quả tìm kiếm
- Hỗ trợ truy vấn nâng cao với các toán tử logic (AND, OR, NOT)
- Tạo báo cáo và thống kê từ dữ liệu audit log
- Cung cấp cơ chế export dữ liệu audit log ra các định dạng phổ biến (CSV, JSON)

## Kiến trúc

Service được xây dựng theo nguyên tắc Clean Architecture và CQRS:

- **Domain Layer**: Sử dụng `alm-domain` để định nghĩa các business rules và domain logic
- **Application Layer**: Sử dụng `alm-application` để định nghĩa các use cases và application services
- **Infrastructure Layer**: Sử dụng `alm-infrastructure` để triển khai các interfaces từ application layer

Đặc biệt, service này tập trung vào việc tối ưu hóa cho các truy vấn đọc, có thể sử dụng các cơ chế như:

- Read model riêng biệt, được thiết kế cho mục đích truy vấn
- Caching để tăng tốc các truy vấn phổ biến
- Indexing chiến lược trên các trường tìm kiếm thường xuyên

## API

### REST API

- `GET /api/v1/audit-logs`: Tìm kiếm và lọc audit logs
- `GET /api/v1/audit-logs/:id`: Lấy chi tiết một audit log
- `GET /api/v1/audit-logs/stats`: Lấy thống kê về audit logs
- `GET /api/v1/audit-logs/export`: Export audit logs ra file
- `GET /api/v1/audit-logs/search`: Tìm kiếm nâng cao với query language

### Query Parameters

- `startDate`, `endDate`: Lọc theo khoảng thời gian
- `userId`, `entityId`: Lọc theo người dùng hoặc đối tượng
- `actionType`: Lọc theo loại hành động (CREATE, UPDATE, DELETE, v.v.)
- `boundedContext`: Lọc theo bounded context
- `tenantId`: Lọc theo tenant
- `page`, `limit`: Phân trang
- `sort`: Sắp xếp kết quả

## Cấu hình

Service có thể được cấu hình thông qua các biến môi trường:

- `ALM_QUERY_MONGODB_URI`: Connection string đến MongoDB
- `ALM_QUERY_ELASTICSEARCH_URI`: Connection string đến Elasticsearch (nếu sử dụng)
- `ALM_QUERY_REDIS_URI`: Connection string đến Redis (cho caching)
- `ALM_QUERY_DEFAULT_PAGE_SIZE`: Kích thước trang mặc định
- `ALM_QUERY_MAX_PAGE_SIZE`: Kích thước trang tối đa
- `ALM_QUERY_CACHE_TTL`: Thời gian cache (seconds)

## Deployment

Service được đóng gói dưới dạng Docker container và có thể được triển khai trên Kubernetes:

```bash
# Build Docker image
nx build alm-query
docker build -t ecoma/alm-query:latest -f apps/services/alm-query/Dockerfile .

# Deploy trên Kubernetes
kubectl apply -f k8s/alm-query.yaml
```

## Phát triển

### Yêu cầu

- Node.js 18+
- Yarn
- MongoDB
- Redis (cho caching)
- Elasticsearch (tùy chọn, cho full-text search)

### Chạy service

```bash
# Cài đặt dependencies
yarn install

# Chạy service trong môi trường development
nx serve alm-query

# Chạy tests
nx test alm-query
```

## Hiệu suất và Mở rộng

Service được thiết kế để xử lý khối lượng dữ liệu audit log lớn:

- Sử dụng indexing chiến lược cho các trường tìm kiếm phổ biến
- Implement caching cho các truy vấn thường xuyên
- Hỗ trợ phân trang và giới hạn kích thước kết quả
- Có thể mở rộng theo chiều ngang để xử lý tải cao

## Liên kết

- [ALM Domain Documentation](../../libs/domains/alm/alm-domain/README.md)
- [ALM Application Documentation](../../libs/domains/alm/alm-application/README.md)
- [ALM Infrastructure Documentation](../../libs/domains/alm/alm-infrastructure/README.md)
