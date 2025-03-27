# ALM Events Module

## Giới thiệu

Module `alm-events` định nghĩa các domain events được sử dụng trong hệ thống Audit Log Management (ALM). Các events này tuân thủ nguyên tắc Domain-Driven Design (DDD) và được sử dụng để truyền thông tin giữa các bounded contexts.

## Các Events

### AuditLogEvents
- `AuditLogCreatedEvent`: Event khi tạo mới log
- `AuditLogProcessedEvent`: Event khi log được xử lý thành công
- `AuditLogFailedEvent`: Event khi xử lý log thất bại

### RetentionPolicyEvents
- `RetentionPolicyCreatedEvent`: Event khi tạo mới chính sách lưu trữ
- `RetentionPolicyUpdatedEvent`: Event khi cập nhật chính sách
- `RetentionPolicyDeletedEvent`: Event khi xóa chính sách
- `RetentionPolicyAppliedEvent`: Event khi áp dụng chính sách lưu trữ

## Sử dụng

### 1. Đăng ký xử lý event

```typescript
import { AuditLogCreatedEvent } from '@ecoma/alm-events';

eventBus.subscribe(AuditLogCreatedEvent.name, (event: AuditLogCreatedEvent) => {
  // Xử lý event khi có log mới được tạo
  console.info(`New audit log created: ${event.logId}`);
});
```

### 2. Phát sinh event

```typescript
import { RetentionPolicyAppliedEvent } from '@ecoma/alm-events';

const event = new RetentionPolicyAppliedEvent({
  policyId: 'policy-1',
  totalDeleted: 100,
  timestamp: new Date()
});

eventBus.publish(event);
```

## Dependencies

- @ecoma/common-domain
- @ecoma/alm-domain

## Building

Run `nx build alm-events` to build the library.

## Testing

Run `nx test alm-events` to execute the unit tests via [Jest](https://jestjs.io).

## Contributing

1. Tuân thủ nguyên tắc DDD trong việc thiết kế và implement events
2. Đảm bảo events chỉ chứa dữ liệu cần thiết cho việc xử lý
3. Viết unit tests cho mọi event
4. Cập nhật documentation khi thêm/sửa events

## Versioning

Module này tuân theo [Semantic Versioning](https://semver.org/). Các phiên bản được đánh số theo format MAJOR.MINOR.PATCH.

## License

Copyright © 2024 Ecoma. All rights reserved.
