# ALM Domain Module

## Giới thiệu

Module `alm-domain` là module core của hệ thống Audit Log Management (ALM), định nghĩa các domain model, business rules và logic nghiệp vụ. Module này tuân thủ nguyên tắc Domain-Driven Design (DDD) và đảm bảo tính độc lập với các implementation details.

## Thành phần chính

### Aggregates

- `AuditLogEntry`: Aggregate root cho bản ghi audit log
- `RetentionPolicy`: Aggregate root cho chính sách lưu trữ

### Value Objects

- `AuditLogEntryId`: Định danh của bản ghi audit log
- `RetentionPolicyId`: Định danh của bản ghi retention policy
- `Initiator`: Thông tin về người hoặc hệ thống thực hiện hành động
- `AuditContext`: Dữ liệu ngữ cảnh bổ sung cho audit log

### Errors

- `DomainValidationError`: Lỗi liên quan đến validation trong domain

## Cấu trúc thư mục

```
alm-domain/
├── src/
│   └── lib/
│       ├── aggregates/        # Aggregate roots (AuditLogEntry, RetentionPolicy)
│       ├── value-objects/     # Value objects (Initiator, AuditContext, etc.)
│       └── errors/            # Domain-specific errors
```

## Quy tắc nghiệp vụ

### Retention Policy

1. Mỗi chính sách lưu trữ có thể áp dụng trực tiếp cho các điều kiện: boundedContext, actionType, entityType, tenantId (tùy chọn)
2. Trường retentionDays là bắt buộc, phải là số nguyên dương, đơn vị là ngày
3. Chính sách có thể được kích hoạt hoặc vô hiệu hóa

### Audit Log Entry

1. Mỗi log entry phải có timestamp
2. Log không thể bị sửa đổi sau khi tạo (immutable)
3. Log phải được gắn với một bounded context
4. Các trường bắt buộc: timestamp, boundedContext, actionType, initiator

## Sử dụng

### 1. Tạo Audit Log Entry

```typescript
import { AuditLogEntry, Initiator, AuditContext } from "@ecoma/alm-domain";

const auditLogEntry = new AuditLogEntry({
  id: new AuditLogEntryId("some-uuid-v4"),
  timestamp: new Date(),
  initiator: new Initiator({
    type: "User",
    name: "John Doe",
    id: "user-123",
  }),
  boundedContext: "iam",
  actionType: "User.Created",
  entityId: "user-456",
  entityType: "User",
  tenantId: "tenant-789",
  contextData: new AuditContext({
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0...",
  }),
});
```

### 2. Tạo Retention Policy

```typescript
import { RetentionPolicy } from "@ecoma/alm-domain";

const policy = new RetentionPolicy({
  id: new RetentionPolicyId("some-uuid-v4"),
  name: "User Audit Policy",
  description: "Lưu log user",
  boundedContext: "iam",
  actionType: "User.Created",
  entityType: "User",
  tenantId: "tenant-123",
  retentionDays: 30, // Số ngày lưu trữ, bắt buộc
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

## Dependencies

- @ecoma/common-domain

## Testing

Để chạy unit tests:

```bash
nx test alm-domain
```

Để chạy tests với coverage:

```bash
nx test alm-domain --coverage
```

## Contributing

1. Tuân thủ nguyên tắc DDD trong việc thiết kế và implement
2. Đảm bảo domain logic độc lập với infrastructure
3. Viết unit tests cho mọi business rule
4. Cập nhật documentation khi thêm/sửa domain rules

## Versioning

Module này tuân theo [Semantic Versioning](https://semver.org/). Các phiên bản được đánh số theo format MAJOR.MINOR.PATCH.

## License

Copyright © 2024 Ecoma. All rights reserved.
