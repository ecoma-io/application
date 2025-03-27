# ALM Infrastructure Module

## Giới thiệu

Module `alm-infrastructure` cung cấp các implementation cụ thể cho các port được định nghĩa trong `alm-application`. Module này chứa các adapter cho persistence, messaging, và các dịch vụ bên ngoài khác.

## Thành phần chính

### Adapters

- **Persistence**: Implementation cho các repository interface

  - `AuditLogEntryRepository`: Lưu trữ và truy xuất audit log entries
  - `RetentionPolicyRepository`: Quản lý chính sách lưu trữ

- **Messaging**: Xử lý giao tiếp qua message broker
  - `AuditLogRequestedHandler`: Xử lý event yêu cầu ghi audit log
  - `RetentionPolicyEventHandlers`: Xử lý các event liên quan đến chính sách lưu trữ

### Factories

- `AuditLogEntryFactory`: Tạo instance của AuditLogEntry từ dữ liệu persistence
- `RetentionPolicyFactory`: Tạo instance của RetentionPolicy từ dữ liệu persistence

### Config

- `AlmModuleConfig`: Cấu hình cho ALM module
- `DatabaseConfig`: Cấu hình kết nối database
- `MessagingConfig`: Cấu hình message broker

## Sử dụng

### 1. Cấu hình Module

```typescript
import { AlmInfrastructureModule } from "@ecoma/alm-infrastructure";

@Module({
  imports: [
    AlmInfrastructureModule.forRoot({
      database: {
        host: "localhost",
        port: 5432,
        // ... các cấu hình khác
      },
      messaging: {
        broker: "rabbitmq",
        url: "amqp://localhost:5672",
      },
    }),
  ],
})
export class AppModule {}
```

### 2. Sử dụng Repository

```typescript
import { AuditLogEntryRepository } from "@ecoma/alm-infrastructure";

@Injectable()
export class YourService {
  constructor(private readonly repo: AuditLogEntryRepository) {}

  async getAuditLogs() {
    return this.repo.findAll();
  }
}
```

### 3. Sử dụng ILogger

ILogger được inject vào các service và handler bằng token "ILogger". Để sử dụng:

```typescript
import { Injectable, Inject } from "@nestjs/common";
import { ILogger } from "@ecoma/common-domain";

@Injectable()
export class YourHandler {
  constructor(@Inject("ILogger") private readonly logger: ILogger) {}

  async handle(event: any): Promise<void> {
    try {
      this.logger.info("Processing event", { eventData: event });
      // Xử lý logic
    } catch (error) {
      this.logger.error("Error processing event", error as Error);
      throw error;
    }
  }
}
```

Trong tests:

```typescript
const logger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  fatal: jest.fn(),
};

const moduleRef = await Test.createTestingModule({
  providers: [
    YourHandler,
    {
      provide: "ILogger",
      useValue: logger,
    },
  ],
}).compile();
```

## Dependencies

- @ecoma/alm-domain
- @ecoma/alm-application
- @nestjs/common
- @nestjs/typeorm
- @nestjs/cqrs

## Building

Run `nx build alm-infrastructure` to build the library.

## Testing

Run `nx test alm-infrastructure` to execute the unit tests via [Jest](https://jestjs.io).

## Contributing

1. Tuân thủ nguyên tắc DDD trong việc implement các adapter
2. Đảm bảo mỗi adapter có unit test đầy đủ
3. Cập nhật documentation khi thêm/sửa adapter

## Versioning

Module này tuân theo [Semantic Versioning](https://semver.org/). Các phiên bản được đánh số theo format MAJOR.MINOR.PATCH.

## License

Copyright © 2024 Ecoma. All rights reserved.
