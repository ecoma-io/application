# Audit Log Management (ALM) Ingestion Service

Microservice dùng để nhận và lưu trữ các sự kiện audit log từ toàn bộ hệ thống.

## Mô tả

ALM Ingestion Service nhận các audit log events thông qua NATS và lưu trữ chúng vào MongoDB để phục vụ việc truy vấn sau này. Service này là một phần của hệ thống Audit Log Management (ALM) giúp theo dõi và lưu trữ các hoạt động trong hệ thống. Ngoài ra, service còn cho phép quản lý các chính sách lưu trữ (Retention Policy).

## Cách gửi Audit Log Events

### Qua NATS

Gửi một message tới subject `alm.audit-log` trên NATS server.

Format message:

```json
{
  "timestamp": "2023-10-19T15:30:45.123Z",
  "initiator": {
    "type": "User",
    "name": "User Name",
    "id": "user-123",
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0..."
  },
  "boundedContext": "order-management",
  "actionType": "Order.Created",
  "category": "Business",
  "entityId": "order-456",
  "entityType": "Order",
  "tenantId": "tenant-789",
  "contextData": {
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
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
}
```

### Ví dụ Code để Gửi Event

```typescript
import { connect, StringCodec } from "nats";

async function sendAuditLogEvent() {
  // Kết nối NATS
  const nc = await connect({ servers: "nats://localhost:4222" });
  const sc = StringCodec();

  // Tạo audit log event
  const auditLogEvent = {
    timestamp: new Date().toISOString(),
    initiator: {
      type: "User",
      name: "Test User",
      id: "user-123",
      ipAddress: "192.168.1.1",
      userAgent: "Test Agent",
    },
    boundedContext: "order-management",
    actionType: "Order.Created",
    entityId: "order-456", // QUAN TRỌNG: ID luôn phải có giá trị
    entityType: "Order",
    tenantId: "tenant-001",
    contextData: {
      ipAddress: "192.168.1.1",
      userAgent: "Test Agent",
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
    },
  };

  // Gửi event
  nc.publish("alm.audit-log", sc.encode(JSON.stringify(auditLogEvent)));

  console.log("Đã gửi audit log event");

  // Đóng kết nối
  await nc.drain();
}
```

### Lưu ý quan trọng

1. Các trường bắt buộc: `timestamp`, `initiator`, `boundedContext`, `actionType`
2. `initiator` phải có các trường `type` và `name`
3. `timestamp` nên ở định dạng ISO để đảm bảo tính nhất quán
4. `entityId` và `entityType` nên được cung cấp nếu hành động liên quan đến một thực thể cụ thể

## Quản lý Retention Policy

Service cũng hỗ trợ quản lý các chính sách lưu trữ thông qua các NATS subjects sau:

- `alm.retention-policy.create`: Tạo mới một chính sách
- `alm.retention-policy.update`: Cập nhật chính sách
- `alm.retention-policy.delete`: Xóa chính sách
- `alm.retention-policy.activate`: Kích hoạt chính sách
- `alm.retention-policy.deactivate`: Vô hiệu hóa chính sách

### Ví dụ tạo Retention Policy

```typescript
import { connect, StringCodec } from "nats";

async function createRetentionPolicy() {
  const nc = await connect({ servers: "nats://localhost:4222" });
  const sc = StringCodec();

  const policy = {
    name: "User Audit Policy",
    description: "Lưu log user 30 ngày",
    boundedContext: "iam",
    actionType: "User.Created",
    entityType: "User",
    retentionDays: 30,
    isActive: true,
  };

  nc.publish("alm.retention-policy.create", sc.encode(JSON.stringify(policy)));
  console.log("Đã gửi yêu cầu tạo policy");

  await nc.drain();
}
```

## Cấu trúc mã nguồn

- `src/app.module.ts`: Module chính của ứng dụng, cấu hình dependency injection
- `src/app.controller.ts`: Controller xử lý các message từ NATS
- `src/main.ts`: Entry point của ứng dụng, cấu hình NATS connection
- `src/app.config.ts`: Cấu hình ứng dụng, validation schema cho biến môi trường

## Môi trường và Cài đặt

### Biến môi trường

```
# Cấu hình chung
NODE_ENV=development
PORT=3000
DEBUG=false
LOG_LEVEL=info
LOG_FORMAT=json

# Kết nối database
MONGODB_URI=mongodb://localhost:27017/audit-logs

# Kết nối NATS
NATS_URI=nats://localhost:4222
```

### Lệnh chạy

```
nx serve alm-ingestion
```

## Health Check

```
GET /health
```

Trả về trạng thái của service và các dependencies (MongoDB, NATS).

## Xử lý lỗi

Khi xảy ra lỗi trong quá trình xử lý audit log event:

1. Lỗi sẽ được ghi vào log
2. Response sẽ có trạng thái thất bại được trả về cho caller
3. Các lỗi nghiêm trọng có thể trigger alert tới hệ thống monitoring

## Tài liệu liên quan

- [ALM Domain Design](/docs/domain-design/core/alm.md)
- [ALM Implementation](/docs/domain-implement/core/alm-implement.md)
