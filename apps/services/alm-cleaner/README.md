# ALM Retention Service

## Giới thiệu

ALM Retention Service là một microservice trong hệ thống Audit Log Management (ALM) của Ecoma, chịu trách nhiệm quản lý và thực thi các chính sách lưu trữ (retention policies) cho dữ liệu audit log. Service này đảm bảo rằng dữ liệu audit log được lưu trữ theo đúng các quy định và chính sách của tổ chức, đồng thời tự động xóa các dữ liệu cũ khi hết thời hạn lưu trữ.

## Chức năng chính

- Quản lý vòng đời của các chính sách lưu trữ (tạo, cập nhật, xóa, kích hoạt/vô hiệu hóa)
- Thực thi tự động các chính sách lưu trữ theo lịch định sẵn
- Xóa dữ liệu audit log theo các quy tắc đã định nghĩa
- Cung cấp báo cáo về hoạt động lưu trữ và xóa dữ liệu

## Kiến trúc

Service được xây dựng theo nguyên tắc Clean Architecture và CQRS:

- **Domain Layer**: Sử dụng `alm-domain` để định nghĩa các business rules và domain logic
- **Application Layer**: Sử dụng `alm-application` để định nghĩa các use cases và application services
- **Infrastructure Layer**: Sử dụng `alm-infrastructure` để triển khai các interfaces từ application layer

## API

### REST API

- `GET /api/v1/retention-policies`: Lấy danh sách các chính sách lưu trữ
- `GET /api/v1/retention-policies/:id`: Lấy chi tiết một chính sách lưu trữ
- `POST /api/v1/retention-policies`: Tạo mới chính sách lưu trữ
- `PUT /api/v1/retention-policies/:id`: Cập nhật chính sách lưu trữ
- `DELETE /api/v1/retention-policies/:id`: Xóa chính sách lưu trữ
- `PATCH /api/v1/retention-policies/:id/activate`: Kích hoạt chính sách lưu trữ
- `PATCH /api/v1/retention-policies/:id/deactivate`: Vô hiệu hóa chính sách lưu trữ

### Message Consumers

- `RetentionPolicyCreatedConsumer`: Xử lý sự kiện khi có chính sách lưu trữ mới được tạo
- `RetentionPolicyUpdatedConsumer`: Xử lý sự kiện khi có chính sách lưu trữ được cập nhật
- `RetentionExecutionScheduledConsumer`: Xử lý yêu cầu thực thi chính sách lưu trữ theo lịch

## Cấu hình

Service có thể được cấu hình thông qua các biến môi trường:

- `ALM_RETENTION_MONGODB_URI`: Connection string đến MongoDB
- `ALM_RETENTION_RABBITMQ_URI`: Connection string đến RabbitMQ
- `ALM_RETENTION_NATS_URI`: Connection string đến NATS
- `ALM_RETENTION_SCHEDULE_CRON`: Cấu hình cron job cho việc thực thi tự động
- `ALM_RETENTION_DEFAULT_PAGE_SIZE`: Kích thước trang mặc định cho các API phân trang

## Deployment

Service được đóng gói dưới dạng Docker container và có thể được triển khai trên Kubernetes:

```bash
# Build Docker image
nx build alm-cleaner
docker build -t ecoma/alm-cleaner:latest -f apps/services/alm-cleaner/Dockerfile .

# Deploy trên Kubernetes
kubectl apply -f k8s/alm-cleaner.yaml
```

## Phát triển

### Yêu cầu

- Node.js 18+
- Yarn
- MongoDB
- RabbitMQ
- NATS

### Chạy service

```bash
# Cài đặt dependencies
yarn install

# Chạy service trong môi trường development
nx serve alm-cleaner

# Chạy tests
nx test alm-cleaner
```

## Liên kết

- [ALM Domain Documentation](../../libs/domains/alm/alm-domain/README.md)
- [ALM Application Documentation](../../libs/domains/alm/alm-application/README.md)
- [ALM Infrastructure Documentation](../../libs/domains/alm/alm-infrastructure/README.md)
