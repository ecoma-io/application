# @ecoma/nestjs-logging

Module cung cấp giải pháp logging toàn diện cho các ứng dụng NestJS trong hệ thống Ecoma.

## Giới thiệu

Module `nestjs-logging` là một phần của hệ thống Ecoma, cung cấp các công cụ logging tiêu chuẩn hóa cho các microservices NestJS. Module này đóng vai trò thiết yếu trong việc đảm bảo tính nhất quán và hiệu quả trong việc ghi nhận thông tin hoạt động của ứng dụng.

### Tính năng chính

- Triển khai `LoggerService` của NestJS để tích hợp liền mạch với framework
- Sử dụng Pino làm backend, cung cấp hiệu suất cao và tính linh hoạt
- Hỗ trợ cả hai định dạng JSON (cho production) và text (cho development)
- Tương thích với các cơ chế xử lý exception có sẵn của NestJS
- Hỗ trợ context-based logging để dễ dàng phân loại và tìm kiếm logs
- Cấu hình thông qua biến môi trường, không cần thay đổi code
- Tích hợp với ILogger interface từ @ecoma/common-application thông qua ApplicationLoggerAdapter

## Cài đặt

```bash
# Trong Nx monorepo
nx build nestjs-logging
```

## Cấu hình

Module này hỗ trợ cấu hình thông qua biến môi trường:

| Biến môi trường | Mô tả                | Giá trị mặc định | Các giá trị hợp lệ                                 |
| --------------- | -------------------- | ---------------- | -------------------------------------------------- |
| LOG_LEVEL       | Cấp độ log tối thiểu | "trace"          | "trace", "debug", "info", "warn", "error", "fatal" |
| LOG_FORMAT      | Định dạng output     | "json"           | "json", "text"                                     |

## Sử dụng

### Sử dụng làm Logger toàn cục trong NestFactory

Cách hiệu quả nhất để sử dụng NestjsLogger là ghi đè logger mặc định của NestJS thông qua NestFactory. Cách này đảm bảo tất cả log từ framework và ứng dụng đều sử dụng cùng một định dạng nhất quán.

```typescript
// main.ts
import { NestFactory } from "@nestjs/core";
import { NestjsLogger } from "@ecoma/nestjs-logging";
import { AppModule } from "./app.module";

async function bootstrap() {
  // Tạo logger với context là "Bootstrap"
  const logger = new NestjsLogger("Bootstrap");

  // Log thông tin khởi động
  logger.log("Khởi động service");

  // Ghi đè logger mặc định của NestJS bằng cách truyền vào options
  const app = await NestFactory.create(AppModule, { logger });

  // Cấu hình ứng dụng...

  // Khởi động ứng dụng
  await app.listen(3000);
  logger.log("Service đã khởi động thành công");
}

bootstrap();
```

Với cách triển khai này:

- Tất cả log từ NestJS framework (middleware, exception handlers, lifecycle events...) sẽ được xử lý bởi NestjsLogger
- Các module khi inject `Logger` từ `@nestjs/common` sẽ nhận được chức năng tương tự từ NestjsLogger
- Bạn có một luồng log duy nhất với cùng định dạng và cấu hình

### Sử dụng làm Provider trong Module

```typescript
// app.module.ts
import { Module } from "@nestjs/common";
import { NestjsLoggerModule } from "@ecoma/nestjs-logging";

@Module({
  imports: [
    NestjsLoggerModule.register({
      defaultContext: "AppName",
      isGlobal: true,
    }),
  ],
})
export class AppModule {}

// user.service.ts
import { Injectable } from "@nestjs/common";
import { NestjsLogger } from "@ecoma/nestjs-logging";

@Injectable()
export class UserService {
  constructor(private readonly logger: NestjsLogger) {
    this.logger.setContext("UserService");
  }

  findAll() {
    this.logger.debug("Đang tìm kiếm tất cả người dùng");
    // ...
    this.logger.info("Đã tìm thấy 10 người dùng");
    return users;
  }

  findOne(id: number) {
    this.logger.debug(`Đang tìm kiếm người dùng với ID: ${id}`);
    try {
      // ...
      this.logger.info(`Đã tìm thấy người dùng: ${user.name}`);
      return user;
    } catch (error) {
      this.logger.error(`Lỗi khi tìm kiếm người dùng: ${id}`, error);
      throw error;
    }
  }
}
```

### Sử dụng ILogger trong Application Layer thông qua ApplicationLoggerAdapter

ApplicationLoggerAdapter giúp kết nối NestjsLogger với interface ILogger từ @ecoma/common-application, cho phép sử dụng trong các tầng application theo đúng nguyên tắc của Clean Architecture.

```typescript
// alm.module.ts
import { Module } from "@nestjs/common";
import { NestjsLogger, ApplicationLoggerAdapter } from "@ecoma/nestjs-logging";

// Token dùng để inject vào application layer
export const ALM_APPLICATION_LOGGER = "ALM_APPLICATION_LOGGER";

@Module({
  providers: [
    NestjsLogger,
    {
      provide: ALM_APPLICATION_LOGGER,
      useFactory: (nestjsLogger: NestjsLogger) => {
        return new ApplicationLoggerAdapter(nestjsLogger, "ALM-Application");
      },
      inject: [NestjsLogger],
    },
    // Các providers khác...
  ],
  exports: [ALM_APPLICATION_LOGGER],
})
export class ALMModule {}

// Trong application service
import { ILogger } from "@ecoma/common-application";
import { Inject } from "@nestjs/common";
import { ALM_APPLICATION_LOGGER } from "../alm.module";

export class AuditLogApplicationService {
  constructor(@Inject(ALM_APPLICATION_LOGGER) private readonly logger: ILogger) {}

  process() {
    this.logger.debug("Xử lý application logic");
    // Các log khác...
  }
}
```

### Sử dụng các cấp độ log

Module cung cấp đầy đủ các cấp độ log theo thứ tự tăng dần về mức độ nghiêm trọng:

1. **trace** - Thông tin chi tiết nhất, chỉ sử dụng trong quá trình phát triển
2. **debug** - Thông tin hữu ích cho việc debug, thường chỉ bật trong môi trường phát triển
3. **info** - Thông tin về hoạt động bình thường của ứng dụng, sử dụng trong cả development và production
4. **warn** - Cảnh báo về các vấn đề tiềm ẩn nhưng không ảnh hưởng đến hoạt động hiện tại
5. **error** - Lỗi đã xảy ra làm gián đoạn hoạt động bình thường của một phần ứng dụng
6. **fatal** - Lỗi nghiêm trọng khiến ứng dụng không thể tiếp tục hoạt động

```typescript
logger.trace("Thông tin trace chi tiết");
logger.debug("Thông tin debug");
logger.info("Thông tin thông thường");
logger.log("Alias của info trong NestJS");
logger.warn("Cảnh báo");
logger.error("Lỗi đã xảy ra");
logger.fatal("Lỗi nghiêm trọng");
```

### Logging với Context

```typescript
// Context trong constructor
const logger = new NestjsLogger("MyModule");
logger.info("Thông điệp với context từ constructor");

// Thiết lập context sau khi khởi tạo
logger.setContext("NewContext");

// Context trong tham số
logger.info("Thông điệp với context tùy chỉnh", "CustomContext");
```

### Logging các Error Object

```typescript
try {
  // ...
} catch (error) {
  logger.error(error);
  // hoặc
  logger.error("Lỗi khi xử lý", error);
}
```

## Tích hợp với các hệ thống thu thập log

Thư viện này sử dụng Pino với định dạng JSON, có thể dễ dàng tích hợp với các hệ thống thu thập log phổ biến như:

- Elastic Stack (ELK)
- Datadog
- New Relic
- CloudWatch
- Grafana Loki

## Quy tắc sử dụng

1. Luôn sử dụng cấp độ log phù hợp (không lạm dụng error cho thông tin không phải lỗi)
2. Cung cấp context rõ ràng để dễ dàng lọc và tìm kiếm logs
3. Bao gồm thông tin hữu ích và liên quan trong mỗi log message
4. Cẩn thận với thông tin nhạy cảm - không log mật khẩu, token, dữ liệu cá nhân
5. Đối với production, cấu hình LOG_LEVEL="info" để tối ưu hiệu suất

## Testing

```bash
# Chạy tests
nx test nestjs-logging
```

## Hiệu năng

Thư viện này sử dụng Pino làm backend, một trong những logger hiệu suất cao nhất cho Node.js. Tuy nhiên, cần lưu ý:

- Giảm thiểu số lượng logs ở cấp độ thấp trong môi trường production
- Nếu cần xử lý log lượng lớn, hãy cân nhắc sử dụng pino async transport

## Tương thích Distributed Tracing

Module này có thể được mở rộng để hỗ trợ phân tán trace context theo OpenTelemetry. Chi tiết cụ thể sẽ được cung cấp trong các phiên bản tiếp theo.

## Tài liệu tham khảo

- [NestJS Logger](https://docs.nestjs.com/techniques/logger)
- [Pino Documentation](https://getpino.io/)
- [NestJS Pino](https://github.com/iamolegga/nestjs-pino)
