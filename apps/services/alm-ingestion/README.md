# Audit Log Management (ALM) Ingestion Service

Microservice dùng để nhận và lưu trữ các sự kiện audit log từ toàn bộ hệ thống.

## Mô tả

ALM Ingestion Service nhận các audit log events thông qua RabbitMQ hoặc API và lưu trữ chúng vào MongoDB để phục vụ việc truy vấn sau này. Service này là một phần của hệ thống Audit Log Management (ALM) giúp theo dõi và lưu trữ các hoạt động trong hệ thống.

## Cách gửi Audit Log Events

### Qua RabbitMQ

Gửi một message tới exchange `alm.events` với routing key có dạng `audit.log.*` (ví dụ: `audit.log.created`).

Format message:

```json
{
  "eventId": "unique-event-id",
  "timestamp": "2023-10-19T15:30:45.123Z",
  "initiator": {
    "type": "user",
    "id": "user-123",
    "name": "User Name"
  },
  "action": "create",
  "resource": {
    "type": "order",
    "id": "order-456",
    "name": "Order #456"
  },
  "boundedContext": "order-management",
  "tenantId": "tenant-789",
  "context": {
    "ip": "192.168.1.1",
    "userAgent": "Mozilla/5.0..."
  },
  "changes": [
    {
      "field": "status",
      "oldValue": null,
      "newValue": "pending"
    }
  ],
  "metadata": {
    "source": "web-application",
    "correlationId": "corr-123"
  }
}
```

### Ví dụ Code để Gửi Event

```typescript
import * as amqp from "amqplib";

async function sendAuditLogEvent() {
  // Kết nối RabbitMQ
  const connection = await amqp.connect("amqp://guest:guest@localhost:5672");
  const channel = await connection.createChannel();

  // Khai báo exchange
  await channel.assertExchange("alm.events", "topic", { durable: true });

  // Tạo audit log event
  const auditLogEvent = {
    eventId: `order-created-${Date.now()}`,
    timestamp: new Date().toISOString(),
    initiator: {
      type: "user",
      id: "user-123",
      name: "Test User",
    },
    action: "create",
    resource: {
      type: "order",
      id: `order-${Date.now()}`, // QUAN TRỌNG: ID luôn phải có giá trị
      name: "Test Order",
    },
    boundedContext: "order-management",
    tenantId: "tenant-001",
    context: {
      ip: "192.168.1.1",
      userAgent: "Test Agent",
    },
    changes: [
      {
        field: "status",
        oldValue: null,
        newValue: "pending",
      },
    ],
    metadata: {
      source: "test-service",
    },
  };

  // Gửi event
  await channel.publish("alm.events", "audit.log.created", Buffer.from(JSON.stringify(auditLogEvent)), { contentType: "application/json" });

  console.log("Đã gửi audit log event");

  // Đóng kết nối
  await channel.close();
  await connection.close();
}
```

### Lưu ý về Trường `resource`

Khi gửi audit log events, **đặc biệt chú ý** các trường sau:

- `resource.id`: **Bắt buộc** và không được để trống. Đây là ID của tài nguyên bị tác động.
- `resource.type`: **Bắt buộc** và không được để trống. Đây là loại tài nguyên (ví dụ: "order", "user", "product").
- `resource.name`: **Bắt buộc** và không được để trống. Đây là tên hiển thị của tài nguyên.

Trong trường hợp không có `resource.id`, service sẽ gán giá trị mặc định là "unknown-id".

### Lưu ý quan trọng

1. Đảm bảo `resource.id` luôn được cung cấp và không rỗng
2. `eventId` nên là duy nhất cho mỗi sự kiện
3. `timestamp` nên ở định dạng ISO để đảm bảo tính nhất quán
4. `initiator`, `action`, và `resource` là các trường bắt buộc

## Sử dụng API

Nếu không thể hoặc không muốn sử dụng RabbitMQ, bạn có thể sử dụng REST API:

```typescript
import axios from "axios";

async function sendAuditLogViaApi() {
  const auditLogEvent = {
    // Xem cấu trúc như ví dụ trên
  };

  await axios.post("http://alm-ingestion-service/api/audit-logs", auditLogEvent);
}
```

## Cấu trúc mã nguồn

- `src/events/handlers/`: Chứa các handler xử lý event từ RabbitMQ
- `src/health/`: Kiểm tra sức khỏe của service
- `src/app.module.ts`: Module chính của ứng dụng

## Môi trường và Cài đặt

### Biến môi trường

```
MONGODB_URI=mongodb://localhost:27017/alm
RABBITMQ_URI=amqp://guest:guest@localhost:5672
NATS_URL=nats://localhost:4222
ALM_RABBITMQ_EXCHANGE_NAME=alm.events
ALM_RABBITMQ_EXCHANGE_TYPE=topic
```

### Lệnh chạy

```
npm run start:dev alm-ingestion
```

## API

### Health Check

```
GET /health
```

Trả về trạng thái của service và các dependencies.

## Xử lý lỗi

Khi xảy ra lỗi trong quá trình xử lý audit log event:

1. Lỗi sẽ được ghi vào log
2. Nếu cần thiết, event sẽ được đưa vào Dead Letter Queue để xử lý sau
3. Các lỗi nghiêm trọng có thể trigger alert tới hệ thống monitoring

## Tài liệu liên quan

- [ALM Domain Design](/docs/domain-design/core/alm.md)
- [ALM Implementation](/docs/domain-implement/core/alm-implement.md)
