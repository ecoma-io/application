# Hướng dẫn triển khai Service trong phân rã nghiệp vụ Ecoma

> Nếu có mâu thuẫn giữa quy tắc chung và quy tắc riêng của lớp này, quy tắc riêng sẽ được ưu tiên.

## 1. Giới thiệu

Trong kiến trúc của Ecoma, các service (ngoại trừ api-gateway) đều là Message-Driven Service, giao tiếp với nhau thông qua message broker (NATS hoặc RabbitMQ). Điều này giúp:

- Đảm bảo loose coupling giữa các service
- Hỗ trợ xử lý bất đồng bộ và background tasks
- Dễ dàng scale và phân tán hệ thống
- Đơn giản hóa việc triển khai và bảo trì

## 2. Coding Convention

Ngoài các coding convention chung của dự án (xem tài liệu Quy ước lập trình chung Ecoma), các quy định dưới đây là bắt buộc riêng cho lớp Service:

- **Chỉ sử dụng NestJS framework tại lớp này**, không để lọt các dependency của framework vào các layer bên trong.
- **Tất cả các dependency injection phải được thực hiện tại lớp này.**
- **Không chứa bất kỳ logic nghiệp vụ nào**, chỉ điều phối và tích hợp các layer.
- **Logging theo chuẩn của NestJS**, sử dụng các interceptor và filter có sẵn.
- **Mỗi thư mục con đều có file `index.ts` để export các thành phần.**

### 2.1. Quy tắc về Logging

| Level | Khi nào dùng? (ý nghĩa)                              | Ví dụ thực tế                                  |
| ----- | ---------------------------------------------------- | ---------------------------------------------- |
| debug | Trace message/event, thông tin debug framework       | Message payload, event data, broker connection |
| info  | Khởi động service, đăng ký module thành công         | Service started, Message handler registered    |
| warn  | Vấn đề với framework nhưng không ảnh hưởng nghiệp vụ | Connection retry, message processing delayed   |
| error | Lỗi framework hoặc lỗi không xác định                | Message processing failed, broker disconnected |
| fatal | Lỗi nghiêm trọng khiến service không thể hoạt động   | Failed to connect to infrastructure services   |

## 3. Cấu trúc thư mục

```bash
src/
├── modules/
│   ├── <module-name>/       # Các module xử lý message
│   │   ├── controllers/     # Controllers (NATS)
│   │   ├── handlers/        # Message/Event handlers (RabbitMQ)
│   │   ├── schemas/         # Data schemas (nếu cần)
│   │   ├── interfaces/      # Type definitions
│   │   ├── <module>.module.ts
│   │   └── index.ts
│   └── index.ts
├── config/
│   ├── app.config.ts        # Application configuration
│   └── index.ts
├── app.module.ts            # Root module (minimal)
└── main.ts                  # Application entry point
```

| Thư mục      | Mục đích                                | Ví dụ file                |
| ------------ | --------------------------------------- | ------------------------- |
| controllers/ | Xử lý messages và events                | `audit-log.controller.ts` |
| handlers/    | Xử lý messages và events                | `audit-log.handler.ts`    |
| schemas/     | Schema cho database hoặc message format | `audit-log.schema.ts`     |
| interfaces/  | Type definitions và interfaces          | `audit-log.interface.ts`  |

## 4. Giải thích các thành phần

### 4.1. Message Handlers

- **Mục đích:** Xử lý messages/events từ message broker
- **Triển khai:**
  - Sử dụng decorators của NestJS cho message handling
  - Chuyển đổi message thành domain commands/queries
  - Xử lý lỗi và retry logic
- **Logging:** Log thông tin message và kết quả xử lý
- **Unit Test:** Test message handling và error cases

**Ví dụ triển khai:**

```typescript
@Injectable()
export class AuditLogHandler {
  constructor(private readonly commandBus: CommandBus, private readonly logger: ILogger) {}

  @RabbitSubscribe({
    exchange: "audit.events",
    routingKey: "audit.log.created",
    queue: "audit-log-processor",
  })
  async handleAuditLogEvent(event: AuditLogEvent) {
    this.logger.debug("Received audit log event", { event });

    try {
      const command = new ProcessAuditLogCommand(event);
      await this.commandBus.execute(command);

      this.logger.debug("Successfully processed audit log event", {
        eventId: event.id,
      });
    } catch (error) {
      this.logger.error("Failed to process audit log event", {
        error,
        event,
      });
      throw error; // Let RabbitMQ handle retry
    }
  }
}
```

### 4.2. Configuration

- **Mục đích:** Quản lý cấu hình ứng dụng
- **Triển khai:**
  - Sử dụng @nestjs/config
  - Validation schema cho environment variables
  - Phân loại cấu hình theo module
- **Logging:** Log cấu hình khi khởi động (che dấu sensitive data)
- **Unit Test:** Test validation và default values

**Ví dụ triển khai:**

```typescript
// config/app.config.ts
import { registerAs } from "@nestjs/config";
import * as joi from "joi";

export const appConfigValidationSchema = joi.object({
  NODE_ENV: joi.string().valid("development", "production", "test").default("development"),
  PORT: joi.number().default(3000),
  LOG_LEVEL: joi.string().valid("trace", "debug", "info", "warn", "error").default("info"),
  LOG_FORMAT: joi.string().valid("json", "text").default("json"),
  RABBITMQ_URI: joi.string().required(),
  NATS_URI: joi.string().required(),
  MONGODB_URI: joi.string().required(),
});

export default registerAs("app", () => ({
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT, 10) || 3000,
  logging: {
    level: process.env.LOG_LEVEL || "info",
    format: process.env.LOG_FORMAT || "json",
  },
  rabbitmq: {
    uri: process.env.RABBITMQ_URI,
  },
  nats: {
    url: process.env.NATS_URI,
  },
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
}));
```

## 5. Unit Test

### 5.1. Những gì cần test

| Component       | Cần test                                    | Không test     |
| --------------- | ------------------------------------------- | -------------- |
| Message Handler | Message processing, error handling, retries | Business logic |
| Configuration   | Schema validation, environment variables    | -              |

### 5.2. Test Message Handler

```typescript
describe("AuditLogHandler", () => {
  let handler: AuditLogHandler;
  let commandBus: CommandBus;
  let logger: ILogger;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuditLogHandler,
        {
          provide: CommandBus,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ILogger,
          useValue: { debug: jest.fn(), error: jest.fn() },
        },
      ],
    }).compile();

    handler = module.get(AuditLogHandler);
    commandBus = module.get(CommandBus);
    logger = module.get(ILogger);
  });

  it("should process message successfully", async () => {
    const event = {
      id: "event1",
      timestamp: new Date(),
      data: {},
    };

    await handler.handleAuditLogEvent(event);

    expect(commandBus.execute).toHaveBeenCalledWith(expect.any(ProcessAuditLogCommand));
    expect(logger.debug).toHaveBeenCalledWith("Successfully processed audit log event", { eventId: event.id });
  });

  it("should handle errors properly", async () => {
    const event = {
      id: "event1",
      timestamp: new Date(),
      data: {},
    };

    const error = new Error("Processing failed");
    jest.spyOn(commandBus, "execute").mockRejectedValue(error);

    await expect(handler.handleAuditLogEvent(event)).rejects.toThrow(error);
    expect(logger.error).toHaveBeenCalledWith("Failed to process audit log event", { error, event });
  });
});
```

## 6. Thực hành tốt nhất

1. **Message Processing:**

   - Implement retry mechanism với exponential backoff
   - Sử dụng Dead Letter Queue (DLQ) cho failed messages
   - Monitor message processing latency
   - Log đầy đủ message lifecycle

2. **Error Handling:**

   - Phân loại lỗi (temporary vs permanent)
   - Implement circuit breaker cho external services
   - Log đầy đủ context khi có lỗi
   - Có strategy cho message retry

3. **Performance:**

   - Configure message prefetch count phù hợp
   - Monitor message processing time
   - Implement backpressure khi cần
   - Optimize message payload size

4. **Monitoring:**

   - Health check cho message broker connection
   - Metrics cho message processing (rate, latency)
   - Tracing cho message flow qua các service
   - Alert khi có vấn đề với message processing

5. **Testing:**

   - Unit test cho tất cả message handlers
   - Integration test với message broker
   - Test các scenario retry và error
   - Test performance với load test

6. **Configuration:**

   - Validate tất cả environment variables
   - Phân loại config theo module
   - Document tất cả config options
   - Có default values hợp lý

7. **Security:**

   - Secure message broker connection (TLS)
   - Validate message payload và schema
   - Handle sensitive data trong messages
   - Implement rate limiting nếu cần

8. **Deployment:**
   - Graceful shutdown (đợi xử lý hết messages)
   - Scale based on queue size/latency
   - Monitor resource usage (CPU, Memory)
   - Có strategy cho zero-downtime deployment

## 7. Bảng tổng hợp các thư viện common

| Thư viện       | Mục đích chính                                           |
| -------------- | -------------------------------------------------------- |
| common-domain  | AbstractAggregate, Entity, ValueObject, DomainError, ... |
| common-types   | Result, Nullable, Maybe, ...                             |
| common-utils   | ILogger, helper functions                                |
| common-testing | MockFactory, AssertionHelpers, ...                       |
| nestjs-health  | Health check endpoints                                   |

---

**Luôn tham khảo các hướng dẫn domain-implement.md, application-implement.md và infrastructure-implement.md để đảm bảo sự nhất quán về coding convention, cấu trúc, best practice và cách sử dụng các thư viện common.**
