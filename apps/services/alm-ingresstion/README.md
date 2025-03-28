# ALM Ingestion Service

## Giới thiệu

ALM Ingestion Service là một microservice trong hệ thống Audit Log Management (ALM) của Ecoma, chịu trách nhiệm thu thập và xử lý dữ liệu audit log từ các bounded context khác trong hệ thống. Service này là điểm vào chính cho tất cả các audit log, đảm bảo tính nhất quán và toàn vẹn của dữ liệu trước khi lưu trữ.

## Chức năng chính

- Thu thập audit log từ các bounded context thông qua message broker
- Xác thực và chuẩn hóa dữ liệu audit log
- Làm giàu dữ liệu với các thông tin bổ sung (metadata)
- Lưu trữ audit log vào cơ sở dữ liệu
- Phát các sự kiện khi audit log được lưu trữ thành công
- Cung cấp API cho việc gửi audit log trực tiếp (cho các trường hợp đặc biệt)

## Kiến trúc

Service được xây dựng theo nguyên tắc Clean Architecture và CQRS:

- **Domain Layer**: Sử dụng `alm-domain` để định nghĩa các business rules và domain logic
- **Application Layer**: Sử dụng `alm-application` để định nghĩa các use cases và application services
- **Infrastructure Layer**: Sử dụng `alm-infrastructure` để triển khai các interfaces từ application layer

## API

### REST API

- `POST /api/v1/audit-logs`: Gửi audit log trực tiếp (cho các trường hợp đặc biệt)
- `POST /api/v1/audit-logs/batch`: Gửi nhiều audit log cùng lúc
- `GET /api/v1/health`: Kiểm tra trạng thái hoạt động của service

### Message Consumers

- `AuditLogEventConsumer`: Lắng nghe và xử lý các sự kiện audit log từ các bounded context khác
- `AuditLogBatchEventConsumer`: Xử lý các batch audit log events

### Message Publishers

- `AuditLogCreatedPublisher`: Phát sự kiện khi audit log được tạo thành công
- `AuditLogBatchCreatedPublisher`: Phát sự kiện khi một batch audit log được tạo thành công

## Luồng xử lý

1. Service nhận audit log từ các bounded context thông qua RabbitMQ hoặc API trực tiếp
2. Dữ liệu được xác thực và chuẩn hóa
3. Metadata bổ sung được thêm vào (timestamp, correlation ID, v.v.)
4. Audit log được lưu trữ vào MongoDB
5. Sự kiện `AuditLogCreated` được phát ra
6. Các service khác (như ALM Query) có thể lắng nghe sự kiện này để cập nhật read model

## Cấu hình

Service có thể được cấu hình thông qua các biến môi trường:

- `ALM_INGESTION_MONGODB_URI`: Connection string đến MongoDB
- `ALM_INGESTION_RABBITMQ_URI`: Connection string đến RabbitMQ
- `ALM_INGESTION_BATCH_SIZE`: Kích thước batch tối đa cho xử lý hàng loạt
- `ALM_INGESTION_QUEUE_NAME`: Tên queue RabbitMQ để lắng nghe
- `ALM_INGESTION_MAX_RETRY`: Số lần retry tối đa khi xử lý thất bại

## Deployment

Service được đóng gói dưới dạng Docker container và có thể được triển khai trên Kubernetes:

```bash
# Build Docker image
nx build alm-ingresstion
docker build -t ecoma/alm-ingresstion:latest -f apps/services/alm-ingresstion/Dockerfile .

# Deploy trên Kubernetes
kubectl apply -f k8s/alm-ingresstion.yaml
```

## Phát triển

### Yêu cầu

- Node.js 18+
- Yarn
- MongoDB
- RabbitMQ

### Chạy service

```bash
# Cài đặt dependencies
yarn install

# Chạy service trong môi trường development
nx serve alm-ingresstion

# Chạy tests
nx test alm-ingresstion
```

## Hiệu suất và Mở rộng

Service được thiết kế để xử lý khối lượng lớn audit log:

- Xử lý batch để tối ưu hiệu suất
- Có thể mở rộng theo chiều ngang để xử lý tải cao
- Sử dụng cơ chế retry và dead-letter queue để đảm bảo độ tin cậy
- Tối ưu hóa các thao tác ghi vào database

## Liên kết

- [ALM Domain Documentation](../../libs/domains/alm/alm-domain/README.md)
- [ALM Application Documentation](../../libs/domains/alm/alm-application/README.md)
- [ALM Infrastructure Documentation](../../libs/domains/alm/alm-infrastructure/README.md)
