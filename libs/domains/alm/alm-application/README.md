# ALM Application Layer

## Giới thiệu

Module `alm-application` là một phần của hệ thống Audit Log Management (ALM), được phát triển để xử lý các tác vụ liên quan đến việc quản lý và lưu trữ log kiểm toán. Module này được xây dựng dựa trên kiến trúc DDD (Domain-Driven Design) và CQRS (Command Query Responsibility Segregation).

## Tính năng chính

- Xử lý các command liên quan đến nhận (ingestion) và lưu trữ audit log
- Quản lý các chính sách lưu trữ (Retention Policy) - tạo, cập nhật, xóa, kích hoạt, vô hiệu hóa
- Truy vấn và tìm kiếm audit logs với các tiêu chí phức tạp
- Truy vấn retention policies
- Cung cấp các port (interface) repository để tương tác với tầng persistence
- Định nghĩa các DTO (Data Transfer Objects) cho input/output

## Cấu trúc thư mục thực tế

```
alm-application/
└── src/
    ├── use-cases/
    │   ├── command/       # Command Handlers
    │   └── query/         # Query Handlers
    ├── dto/               # Data Transfer Objects
    ├── ports/             # Repository Interfaces
    ├── services/          # Application Services
    ├── factories/         # Factory classes
    └── index.ts
```

### Thành phần chính

#### Use Cases - Commands

- `IngestAuditLogCommandHandler`: Xử lý yêu cầu lưu trữ audit log
- `CreateRetentionPolicyCommandHandler`: Tạo mới chính sách lưu trữ
- `UpdateRetentionPolicyCommandHandler`: Cập nhật chính sách lưu trữ
- `DeleteRetentionPolicyCommandHandler`: Xóa chính sách lưu trữ
- `ActivateRetentionPolicyCommandHandler`: Kích hoạt chính sách lưu trữ
- `DeactivateRetentionPolicyCommandHandler`: Vô hiệu hóa chính sách lưu trữ

#### Use Cases - Queries

- `GetAuditLogsQueryHandler`: Truy vấn và lọc audit logs với nhiều tiêu chí
- `GetRetentionPoliciesQueryHandler`: Truy vấn danh sách các chính sách lưu trữ

#### DTOs

- `IngestAuditLogDto`: Cấu trúc dữ liệu cho audit log đầu vào
- `RetentionPolicyDto`: Cấu trúc dữ liệu cho chính sách lưu trữ
- `AuditLogQueryDto`: Tiêu chí tìm kiếm và phân trang cho audit logs
- `RetentionPolicyQueryDto`: Tiêu chí tìm kiếm cho retention policies
- Các DTO command cho việc quản lý chính sách (activate, deactivate, update, delete)

#### Ports

- `IAuditLogWriteRepository`: Interface cho thao tác ghi audit log
- `IAuditLogReadRepository`: Interface cho thao tác đọc audit log
- `IRetentionPolicyWriteRepository`: Interface cho thao tác ghi chính sách lưu trữ
- `IRetentionPolicyReadRepository`: Interface cho thao tác đọc chính sách lưu trữ

#### Application Services

- `AlmIngestionApplicationService`: Điều phối các command handler cho việc nhận log và quản lý chính sách
- `AlmQueryApplicationService`: Điều phối các query handler cho việc truy vấn log và chính sách

#### Factories

- `AuditLogEntryFactory`: Tạo đối tượng AuditLogEntry từ dữ liệu đầu vào
- `RetentionPolicyFactory`: Tạo đối tượng RetentionPolicy từ dữ liệu đầu vào

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

### 1. Ingest Audit Log

```typescript
import { AlmIngestionApplicationService, IngestAuditLogDto } from "@ecoma/alm-application";

const auditLogDto = new IngestAuditLogDto({
  timestamp: new Date().toISOString(),
  initiator: {
    type: "User",
    name: "John Doe",
    id: "user-123",
  },
  boundedContext: "iam",
  actionType: "User.Created",
  entityId: "user-456",
  entityType: "User",
  tenantId: "tenant-789",
  contextData: {
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0...",
  },
});

await almIngestionApplicationService.persistAuditLogEntry(auditLogDto);
```

### 2. Quản lý Retention Policy

```typescript
import { AlmIngestionApplicationService, RetentionPolicyDto } from "@ecoma/alm-application";

// Tạo mới policy
const policyDto = new RetentionPolicyDto({
  name: "User Audit Policy",
  description: "Lưu log user trong 30 ngày",
  boundedContext: "iam",
  actionType: "User.Created",
  entityType: "User",
  retentionDays: 30,
  isActive: true,
});

await almIngestionApplicationService.createRetentionPolicy(policyDto);
```

### 3. Truy vấn Audit Logs

```typescript
import { AlmQueryApplicationService, AuditLogQueryDto } from "@ecoma/alm-application";

// Tìm kiếm logs
const queryDto = new AuditLogQueryDto({
  boundedContext: "iam",
  actionType: "User.Created",
  fromDate: new Date("2023-01-01"),
  toDate: new Date("2023-12-31"),
  pagination: {
    paginationType: "offset",
    page: 1,
    pageSize: 10,
  },
});

const result = await almQueryApplicationService.getAuditLogs(queryDto);
// result.data - danh sách logs
// result.total - tổng số logs thỏa mãn điều kiện
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
