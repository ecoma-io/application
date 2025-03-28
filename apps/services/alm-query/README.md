# Audit Log Management (ALM) Query Service

Microservice dùng để truy vấn các audit logs trong hệ thống.

## Mô tả

ALM Query Service cho phép truy vấn các audit logs đã được lưu trữ trong cơ sở dữ liệu. Service này là một phần của hệ thống Audit Log Management (ALM) giúp theo dõi và phân tích các hoạt động trong hệ thống.

## Cách truy vấn Audit Logs

Tất cả giao tiếp với ALM Query Service được thực hiện thông qua **NATS Request/Reply**.

### Message Patterns

Service cung cấp các message patterns sau đây:

#### 1. Lấy danh sách Audit Logs

- **Pattern:** `{ cmd: 'get-audit-logs' }`
- **Payload:**
  ```typescript
  {
    tenantId: string;               // [Bắt buộc] ID của tenant
    resourceId?: string;            // ID của resource
    eventId?: string;               // ID của event
    boundedContext?: string;        // Bounded context của event (ví dụ: 'IAM', 'BUM')
    actionType?: string;            // Loại hành động (ví dụ: 'User.Created')
    category?: string;              // Danh mục (ví dụ: 'Security')
    severity?: string;              // Mức độ nghiêm trọng (ví dụ: 'high', 'medium', 'low')
    entityType?: string;            // Loại entity
    entityId?: string;              // ID của entity
    initiatorId?: string;           // ID của người thực hiện hành động
    initiatorType?: string;         // Loại người thực hiện (ví dụ: 'user', 'system')
    startDate?: string;             // Ngày bắt đầu (định dạng ISO)
    endDate?: string;               // Ngày kết thúc (định dạng ISO)
    status?: string;                // Trạng thái (ví dụ: 'Success', 'Failure')
    page?: number;                  // Số trang (mặc định: 1)
    pageSize?: number;              // Kích thước trang (mặc định: 20, tối đa: 100)
  }
  ```
- **Response:**
  ```typescript
  {
    items: AuditLogDto[];           // Danh sách audit logs
    total: number;                  // Tổng số audit logs
    page: number;                   // Trang hiện tại
    pageSize: number;               // Kích thước trang
  }
  ```

#### 2. Lấy chi tiết Audit Log theo ID

- **Pattern:** `{ cmd: 'get-audit-log-by-id' }`
- **Payload:** `string` (ID của audit log)
- **Response:** `AuditLogDto` (Chi tiết audit log)

### Cấu trúc AuditLogDto

```typescript
{
  id: string;                       // ID của audit log
  eventId?: string;                 // ID của event
  timestamp: Date;                  // Thời gian xảy ra event
  initiator: {                      // Người thực hiện
    type: string;                   // Loại (ví dụ: 'user', 'system')
    id?: string;                    // ID
    name?: string;                  // Tên
  };
  action?: string;                  // Hành động thực hiện
  resource?: {                      // Tài nguyên
    type: string;                   // Loại
    id: string;                     // ID
    name?: string;                  // Tên
  };
  boundedContext: string;           // Bounded context
  actionType: string;               // Loại hành động
  tenantId?: string;                // ID của tenant
  category?: string;                // Danh mục
  severity?: string;                // Mức độ nghiêm trọng
  entityType?: string;              // Loại entity
  entityId?: string;                // ID của entity
  status: string;                   // Trạng thái
  failureReason?: string;           // Lý do thất bại (nếu có)
  createdAt: Date;                  // Thời gian tạo bản ghi
  context?: Record<string, any>;    // Ngữ cảnh bổ sung
  changes?: {                       // Các thay đổi
    field: string;                  // Trường
    oldValue: any;                  // Giá trị cũ
    newValue: any;                  // Giá trị mới
  }[];
  metadata?: Record<string, any>;   // Metadata bổ sung
}
```

### Ví dụ Code để Truy vấn Audit Logs

```typescript
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

// Tạo NATS client
const client = ClientProxyFactory.create({
  transport: Transport.NATS,
  options: {
    servers: ["nats://localhost:4222"], // Địa chỉ NATS server
  },
});

// Lấy danh sách audit logs
async function getAuditLogs() {
  const result = await firstValueFrom(
    client.send(
      { cmd: "get-audit-logs" },
      {
        tenantId: "tenant-123",
        boundedContext: "IAM",
        page: 1,
        pageSize: 10,
      }
    )
  );

  console.log(`Tìm thấy ${result.items.length} audit logs`);
  return result;
}

// Lấy chi tiết audit log
async function getAuditLogById(id: string) {
  const result = await firstValueFrom(client.send({ cmd: "get-audit-log-by-id" }, id));

  console.log(`Chi tiết audit log: ${JSON.stringify(result)}`);
  return result;
}
```

## Mã lỗi

Service có thể trả về các lỗi sau:

- `BadRequestException`: Khi request không hợp lệ (ví dụ: thiếu tham số bắt buộc)
- `NotFoundException`: Khi không tìm thấy audit log
- `ForbiddenException`: Khi không có quyền truy cập
- `InternalServerErrorException`: Khi xảy ra lỗi nội bộ

## Môi trường

Service yêu cầu các biến môi trường sau:

- `MONGODB_URI`: URI để kết nối đến MongoDB
- `NATS_URL`: URL để kết nối đến NATS server
- `RABBITMQ_URI`: URL để kết nối đến RabbitMQ server
- `ALM_RABBITMQ_EXCHANGE_NAME`: Tên exchange RabbitMQ (mặc định: "alm.events")
- `ALM_RABBITMQ_EXCHANGE_TYPE`: Loại exchange RabbitMQ (mặc định: "topic")

## Health Check

ALM Query Service cung cấp endpoint kiểm tra sức khỏe của dịch vụ:

```
GET /health
```

Response:

```json
{
  "status": "ok",
  "info": {
    "mongodb": {
      "status": "up"
    },
    "nats": {
      "status": "up"
    }
  }
}
```

## Environment Variables

Dịch vụ sử dụng các biến môi trường sau:

| Biến         | Mô tả                | Mặc định   |
| ------------ | -------------------- | ---------- |
| PORT         | Port của HTTP server | 3000       |
| MONGODB_URI  | URI của MongoDB      | (bắt buộc) |
| NATS_URL     | URL của NATS server  | (bắt buộc) |
| RABBITMQ_URI | URI của RabbitMQ     | (bắt buộc) |

## Triển khai

Dịch vụ này được triển khai trong Kubernetes cluster với cấu hình sau:

```yaml
# Lược trích từ file Kubernetes deployment
resources:
  limits:
    cpu: "500m"
    memory: "512Mi"
  requests:
    cpu: "100m"
    memory: "256Mi"
```
