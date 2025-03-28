# ALM Domain Module

## Giới thiệu

Module `alm-domain` là module core của hệ thống Audit Log Management (ALM), định nghĩa các domain model, business rules và logic nghiệp vụ. Module này tuân thủ nguyên tắc Domain-Driven Design (DDD) và đảm bảo tính độc lập với các implementation details.

## Thành phần chính

### Aggregates
- `AuditLog`: Aggregate root cho log kiểm toán
- `RetentionPolicy`: Aggregate root cho chính sách lưu trữ

### Value Objects
- `RetentionRule`: Định nghĩa quy tắc lưu trữ
- `RetentionPolicyId`: Định danh của chính sách lưu trữ
- `AuditLogId`: Định danh của log kiểm toán

### Domain Events
- `AuditLogCreatedEvent`: Event khi tạo mới log
- `AuditLogRetentionAppliedEvent`: Event khi áp dụng chính sách lưu trữ
- `RetentionPolicyCreatedEvent`: Event khi tạo mới chính sách
- `RetentionPolicyUpdatedEvent`: Event khi cập nhật chính sách

### Domain Services
- `RetentionPolicyService`: Xử lý logic nghiệp vụ liên quan đến chính sách lưu trữ
- `AuditLogService`: Xử lý logic nghiệp vụ liên quan đến log kiểm toán

## Cấu trúc thư mục

```
alm-domain/
├── src/
│   └── lib/
│       ├── aggregates/        # Aggregate roots
│       ├── entities/          # Domain entities
│       ├── value-objects/     # Value objects
│       ├── domain-events/     # Domain events
│       ├── services/          # Domain services
│       ├── repositories/      # Repository interfaces
│       └── errors/           # Domain-specific errors
```

## Quy tắc nghiệp vụ

### Retention Policy
1. Mỗi chính sách lưu trữ phải có ít nhất một rule
2. Thời gian lưu trữ phải lớn hơn 0
3. Chính sách có thể được kích hoạt hoặc vô hiệu hóa
4. Mỗi rule có thể áp dụng cho một hoặc nhiều loại entity

### Audit Log
1. Mỗi log entry phải có timestamp
2. Log không thể bị sửa đổi sau khi tạo
3. Log phải được gắn với một bounded context
4. Log có thể được gắn với một tenant

## Sử dụng

### 1. Tạo Retention Policy

```typescript
import { RetentionPolicy, RetentionRule } from '@ecoma/alm-domain';

const rule = RetentionRule.create({
  duration: 30,
  durationUnit: 'Day',
  entityType: 'User',
  actionType: 'Create'
});

const policy = RetentionPolicy.create({
  name: 'User Audit Policy',
  rules: [rule],
  isActive: true,
  boundedContext: 'identity',
  tenantId: 'tenant-1'
});
```

### 2. Xử lý Domain Events

```typescript
import { AuditLogRetentionAppliedEvent } from '@ecoma/alm-domain';

eventBus.subscribe(AuditLogRetentionAppliedEvent.name, (event) => {
  console.log(`Đã xóa ${event.totalDeleted} bản ghi theo chính sách ${event.policyId}`);
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
