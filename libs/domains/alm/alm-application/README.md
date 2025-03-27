# ALM Application Module

## Giới thiệu

Module `alm-application` là một phần của hệ thống Audit Log Management (ALM), được phát triển để xử lý các tác vụ liên quan đến việc quản lý và lưu trữ log kiểm toán. Module này được xây dựng dựa trên kiến trúc DDD (Domain-Driven Design) và CQRS (Command Query Responsibility Segregation).

## Tính năng chính

- Quản lý chính sách lưu trữ (Retention Policy)
- Xử lý các command liên quan đến audit log
- Tích hợp với message broker để phát các domain event
- Cung cấp các interface repository để tương tác với persistence layer

## Cấu trúc thư mục

```
alm-application/
├── src/
│   └── lib/
│       ├── commands/           # Command handlers và command definitions
│       ├── interfaces/         # Repository và service interfaces
│       ├── queries/           # Query handlers và query definitions
│       └── services/          # Application services
```

## Cài đặt

Module này là một phần của monorepo và được quản lý bởi Nx. Để cài đặt dependencies:

```bash
npm install
```

## Build

Để build module:

```bash
nx build alm-application
```

## Testing

Để chạy unit tests:

```bash
nx test alm-application
```

Để chạy tests với coverage:

```bash
nx test alm-application --coverage
```

## Sử dụng

### 1. Retention Policy Handler

```typescript
import { ApplyRetentionPolicyHandler } from '@ecoma/alm-application';

const handler = new ApplyRetentionPolicyHandler(auditLogRepository, eventPublisher);
await handler.handle(new ApplyRetentionPolicyCommand(policy, dryRun));
```

### 2. Repository Interfaces

```typescript
import { IAuditLogRepository } from '@ecoma/alm-application';

class AuditLogRepository implements IAuditLogRepository {
  // Implementation
}
```

## Dependencies

- @ecoma/common-application
- @ecoma/alm-domain
- @ecoma/common-domain

## Contributing

1. Tuân thủ coding standards và conventions của dự án
2. Viết unit tests cho mọi tính năng mới
3. Cập nhật documentation khi có thay đổi
4. Tạo pull request với mô tả chi tiết các thay đổi

## Versioning

Module này tuân theo [Semantic Versioning](https://semver.org/). Các phiên bản được đánh số theo format MAJOR.MINOR.PATCH.

## License

Copyright © 2024 Ecoma. All rights reserved.
