# **Hướng dẫn triển khai Bounded Context Audit Log Management (ALM)**

## **1\. Giới thiệu**

Tài liệu này mô tả chi tiết thiết kế triển khai cho Bounded Context Audit Log Management (ALM) trong hệ thống Ecoma. ALM là một Bounded Context cốt lõi, chịu trách nhiệm thu thập, lưu trữ và cung cấp khả năng truy vấn các bản ghi kiểm tra (audit logs) từ tất cả các Bounded Context khác trong hệ thống. Tài liệu này tập trung vào các khía cạnh kỹ thuật triển khai riêng cho ALM, bao gồm cấu trúc service, công nghệ sử dụng cụ thể trong ALM, lưu trữ dữ liệu, giao tiếp đặc thù của ALM, hạ tầng, và các yêu cầu phi chức năng liên quan đến triển khai.

Mục tiêu của tài liệu này là cung cấp hướng dẫn chi tiết cho đội ngũ kỹ thuật để xây dựng, triển khai và vận hành Microservice(s) hiện thực hóa Bounded Context ALM, đảm bảo tuân thủ các nguyên tắc kiến trúc tổng thể của Ecoma (Microservices, DDD, EDA, CQRS, Clean Architecture) và đạt được các mục tiêu hệ thống (Tính sẵn sàng cao, Khả năng mở rộng, Hiệu năng, Bảo mật).

## **2\. Bối cảnh Kiến trúc Tổng thể**

Hệ thống Ecoma được xây dựng trên nền tảng kiến trúc Microservices, phân rã theo Bounded Contexts của DDD. Giao tiếp giữa các service backend chủ yếu sử dụng Event-Driven Architecture (EDA) và Request/Reply. Bên trong mỗi service, mô hình CQRS và Clean Architecture được áp dụng bắt buộc.

ALM là một Core Bounded Context, đóng vai trò là kho lưu trữ tập trung và đáng tin cậy cho lịch sử hoạt động của hệ thống. ALM nhận các bản ghi audit log từ tất cả các BC khác thông qua Eventing (xử lý Commands/Background Tasks) và cung cấp khả năng truy vấn dữ liệu log cho các bên quan tâm thông qua Request/Reply (xử lý Queries).

## **3\. Mối quan hệ với Tài liệu Thiết kế Miền ALM**

Tài liệu này là phần tiếp theo của tài liệu **Thiết kế Miền ALM (alm.md)**. Trong khi tài liệu Thiết kế Miền tập trung vào việc định nghĩa các khái niệm nghiệp vụ cốt lõi, Aggregate Root (AuditLogEntry), Value Object (Initiator, AuditContext, AuditLogQueryCriteria, RetentionPolicy, RetentionRule), Ngôn ngữ Chung, Use Cases, Domain Services và Application Services ở cấp độ logic và nghiệp vụ, tài liệu này đi sâu vào cách các định nghĩa đó được hiện thực hóa và triển khai về mặt kỹ thuật.

- **Domain Services và Application Services:** Vai trò và trách nhiệm của các loại service này đã được định nghĩa chi tiết trong tài liệu Thiết kế Miền ALM. Trong tài liệu triển khai này, chúng ta xem xét cách các service kỹ thuật (ALM Ingestion Service, ALM Query Service, ALM Cleaner Service) sẽ chứa và tổ chức các Domain Services và Application Services tương ứng theo mô hình Clean Architecture và CQRS. Chi tiết về từng Domain Service hoặc Application Service cụ thể (tên, phương thức, logic) sẽ không được lặp lại ở đây mà được tham chiếu đến tài liệu Thiết kế Miền.
- **Domain Events:** Các Domain Event mà ALM phát ra hoặc xử lý đã được xác định trong tài liệu Thiết kế Miền ALM, bao gồm mục đích và payload dự kiến. Tài liệu triển khai này mô tả cách các event đó được truyền tải vật lý trong hệ thống (sử dụng RabbitMQ) và cách các service lắng nghe/phát event. Chi tiết về từng loại Domain Event cụ thể sẽ không được lặp lại ở đây mà được tham chiếu đến tài liệu Thiết kế Miền.

## **4\. Đơn vị Triển khai (Deployment Units)**

Dựa trên tính chất nghiệp vụ của ALM bao gồm việc thu thập lượng lớn log một cách bất đồng bộ, cung cấp khả năng truy vấn hiệu năng cao trên tập dữ liệu lớn, và các tác vụ nền/định kỳ (retention), ALM sẽ được triển khai thành nhiều đơn vị Microservice/Worker để tối ưu hóa khả năng mở rộng và quản lý tài nguyên. Việc phân tách này cũng tuân thủ mô hình CQRS và phân loại Use Case đã định nghĩa trong tài liệu Thiết kế Miền.

### **4.1. Cấu trúc Thư mục trong Monorepo**

```
.
├── apps/
│   ├── services/           # Chứa các microservices
│   │   ├── alm-ingestion/  # ALM Ingestion Service
│   │   ├── alm-query/      # ALM Query Service
│   │   └── alm-worker/     # ALM Worker Service
│
├──  tests/             # Chứa các project test
│   └── services/      # Test projects cho các services
│       ├── alm-ingestion-e2e/    # E2E tests cho Ingestion Service
│       ├── alm-query-e2e/        # E2E tests cho Query Service
│       └── alm-worker-e2e/       # E2E tests cho Worker Service
│
├── libs/
│   ├── domains/           # Chứa domain models và logic cho từng bounded context
│   │   └── alm/          # ALM bounded context
│   │       ├── alm-domain/        # Domain layer (aggregates, entities, value objects, domain events)
│   │       ├── alm-application/   # Application layer (application services, commands, queries)
│   │       ├── alm-infrastructure/# Infrastructure layer (repositories, external services)
│   │       └── alm-api/          # API layer (controllers, DTOs, validators)
```

Cấu trúc thư mục này phản ánh cách tổ chức thực tế của monorepo, với:

1. **apps/**: Chứa các ứng dụng có thể triển khai độc lập

   - **services/**: Chứa các microservices

     - **alm-ingestion/**: ALM Ingestion Service
       - Chịu trách nhiệm xử lý các sự kiện audit log từ các bounded context khác
       - Sử dụng alm-application từ `libs/domains/alm/alm-application`
       - Giao tiếp với MongoDB để lưu dữ liệu
       - Giao tiếp với Message Broker để nhận và gửi các sự kiện
     - **alm-query/**: ALM Query Service
       - Chịu trách nhiệm xử lý các truy vấn audit log
       - Sử dụng alm-api từ `libs/domains/alm/alm-api`
       - Giao tiếp với MongoDB để đọc dữ liệu
       - Giao tiếp với Message Broker để nhận các truy vấn
     - **alm-worker/**: ALM Worker Service
       - Chịu trách nhiệm thực thi các retention policy
       - Sử dụng alm-application từ `libs/domains/alm/alm-application`
       - Giao tiếp với MongoDB để đọc và xóa dữ liệu
       - Giao tiếp với Message Broker để nhận các sự kiện trigger

   - **tests/**: Chứa các project test
     - **services/**: Test projects cho các services
       - **alm-ingestion-e2e/**: E2E tests cho Ingestion Service
         - Test toàn bộ flow từ nhận event đến lưu log
         - Sử dụng test-utils từ `libs/test-utils`
         - Có thể chạy độc lập hoặc trong CI pipeline
       - **alm-query-e2e/**: E2E tests cho Query Service
         - Test toàn bộ flow từ nhận query đến trả về kết quả
         - Sử dụng test-utils từ `libs/test-utils`
         - Có thể chạy độc lập hoặc trong CI pipeline
       - **alm-worker-e2e/**: E2E tests cho Worker Service
         - Test toàn bộ flow từ trigger retention job đến xóa dữ liệu
         - Sử dụng test-utils từ `libs/test-utils`
         - Có thể chạy độc lập hoặc trong CI pipeline

2. **libs/**: Chứa các thư viện dùng chung

   - **domains/**: Chứa domain models và logic cho từng bounded context

     - **alm/**: Chứa các thư viện của ALM bounded context
       - **alm-domain/**: Chứa domain models và logic cốt lõi
         - Aggregates (AuditLogEntry)
         - Entities
         - Value Objects (Initiator, AuditContext, AuditLogQueryCriteria, RetentionPolicy, RetentionRule)
         - Domain Events
         - Domain Services (AuditLogService, RetentionPolicyService)
       - **alm-application/**: Chứa application services và use cases
         - Application Services (AuditLogIngestionApplicationService, AuditLogQueryApplicationService, AuditLogRetentionApplicationService)
         - Commands và Command Handlers
         - Queries và Query Handlers
         - DTOs cho input/output
       - **alm-infrastructure/**: Chứa các implementation của repositories và external services
         - MongoDB Repository Implementation
         - Message Broker Integration
         - External Service Clients (IAM Client)
         - Configuration
       - **alm-api/**: Chứa các API endpoints và controllers
         - Controllers
         - DTOs cho API
         - Validators
         - API Documentation

   - **common/**: Chứa các utilities và helpers dùng chung
   - **test-utils/**: Chứa các utilities và helpers cho testing
     - **database/**: Database test utilities
       - Connection management
       - Data cleanup
       - Test fixtures
     - **message-broker/**: Message broker test utilities
       - Connection management
       - Message publishing/consuming
       - Queue management
     - **data-generators/**: Test data generators
       - Audit log generators
       - Retention policy generators
     - **helpers/**: Common test helpers
       - Assertions
       - Time manipulation
       - Test environment setup
   - **nestjs/**: Chứa các utilities đặc thù cho NestJS

### **4.2. Shared Libraries**

1. **domains/alm**: Thư viện chứa domain models và logic của ALM

   - **alm-domain/**: Chứa các domain models và logic cốt lõi
     - Chứa các domain models (aggregates, entities, value objects)
     - Định nghĩa domain events
     - Định nghĩa domain services
     - Định nghĩa repository interfaces
     - Không phụ thuộc vào các thư viện khác
   - **alm-application/**: Chứa application services và use cases
     - Chứa các application services
     - Định nghĩa commands và queries
     - Định nghĩa DTOs cho input/output
     - Phụ thuộc vào alm-domain
   - **alm-infrastructure/**: Chứa các implementation của repositories và external services
     - Implement các repository interfaces từ alm-domain
     - Chứa các integration với external services
     - Phụ thuộc vào alm-domain và alm-application
   - **alm-api/**: Chứa các API endpoints và controllers
     - Chứa các controllers và API endpoints
     - Định nghĩa DTOs cho API
     - Phụ thuộc vào alm-application

2. **common**: Thư viện chứa các utilities và helpers dùng chung

   - Các utility functions
   - Các constants
   - Các types/interfaces dùng chung
   - Các helpers cho logging, error handling, etc.

3. **nestjs**: Thư viện chứa các utilities đặc thù cho NestJS
   - Các decorators
   - Các guards
   - Các interceptors
   - Các filters
   - Các utilities cho NestJS

Các thư viện này được sử dụng bởi các ứng dụng trong thư mục `apps/` để tái sử dụng code và đảm bảo tính nhất quán trong toàn bộ hệ thống.

### **4.3. Đơn vị Triển khai**

ALM được triển khai thành ba service riêng biệt để tối ưu hóa khả năng mở rộng và quản lý tài nguyên:

1. **ALM Ingestion Service** (`apps/services/alm-ingestion/`)

   - Chịu trách nhiệm xử lý các sự kiện audit log từ các bounded context khác
   - Sử dụng alm-application từ `libs/domains/alm/alm-application`
   - Giao tiếp với MongoDB để lưu dữ liệu
   - Giao tiếp với Message Broker để nhận và gửi các sự kiện
   - Có thể được scale riêng biệt dựa trên tải ingestion

2. **ALM Query Service** (`apps/services/alm-query/`)

   - Chịu trách nhiệm xử lý các truy vấn audit log
   - Sử dụng alm-api từ `libs/domains/alm/alm-api`
   - Giao tiếp với MongoDB để đọc dữ liệu
   - Giao tiếp với Message Broker để nhận các truy vấn
   - Có thể được scale riêng biệt dựa trên tải query

3. **ALM Worker Service** (`apps/services/alm-worker/`)
   - Chịu trách nhiệm thực thi các retention policy và dọn dẹp dữ liệu
   - Sử dụng alm-application từ `libs/domains/alm/alm-application`
   - Giao tiếp với MongoDB để đọc và xóa dữ liệu
   - Giao tiếp với Message Broker để nhận các sự kiện trigger
   - Có thể được scale riêng biệt dựa trên tải retention

Mỗi service:

- Sử dụng các utilities từ `libs/common` và `libs/nestjs`
- Được triển khai và scale độc lập với các service khác
- Sử dụng Kubernetes HPA (Horizontal Pod Autoscaling) để tự động scale dựa trên tải
- Có cấu hình tài nguyên (CPU, Memory) riêng biệt phù hợp với nhu cầu

## **5\. Nền tảng Công nghệ Cụ thể cho ALM**

ALM sẽ sử dụng nền tảng công nghệ chung của hệ thống Ecoma, với MongoDB làm cơ sở dữ liệu chính cho cả read và write operations:

- **Cơ sở dữ liệu Chính:** MongoDB - Được chọn làm giải pháp lưu trữ duy nhất cho ALM vì:
  - Khả năng lưu trữ và truy vấn hiệu quả trên dữ liệu log có cấu trúc linh hoạt (ContextData)
  - Khả năng mở rộng ngang tốt để đáp ứng volume lớn của audit logs
  - Hiệu năng tốt cho cả thao tác ghi (ingestion) và đọc (querying)
  - Hỗ trợ tốt cho time-series data và time-based queries
  - Hỗ trợ tốt cho việc quản lý vòng đời dữ liệu (TTL indexes)
  - Không cần thêm lớp cache riêng biệt do yêu cầu đọc dữ liệu không thường xuyên và không yêu cầu hiệu suất cao khi đọc

## **6\. Lưu trữ Dữ liệu (Data Storage)**

ALM sẽ sở hữu cơ sở dữ liệu MongoDB riêng, tách biệt với các BC khác. Việc sử dụng MongoDB được chọn vì:

1. Khả năng lưu trữ và truy vấn hiệu quả trên dữ liệu log có cấu trúc linh hoạt (ContextData)
2. Khả năng mở rộng ngang tốt để đáp ứng volume lớn của audit logs
3. Hiệu năng tốt cho cả thao tác ghi (ingestion) và đọc (querying)
4. Hỗ trợ tốt cho time-series data và time-based queries
5. Hỗ trợ tốt cho việc quản lý vòng đời dữ liệu (TTL indexes)

### **6.1. Schema MongoDB**

**Collection audit_log_entries:**

```javascript
{
  _id: ObjectId,              // MongoDB ID
  id: String,                 // AuditLogEntry ID (UUID)
  eventId: String,            // Optional, ID của event gốc
  timestamp: Date,            // Thời điểm hành động xảy ra
  initiator: {
    type: String,             // 'User', 'System', 'API', 'ScheduledTask', 'Integration'
    id: String,               // Optional, ID của initiator
    name: String              // Tên hiển thị của initiator
  },
  boundedContext: String,     // Tên BC nguồn
  actionType: String,         // Loại hành động
  category: String,           // Optional, Danh mục log
  severity: String,           // Optional, Mức độ nghiêm trọng
  entityId: String,           // Optional, ID thực thể bị ảnh hưởng
  entityType: String,         // Optional, Loại thực thể bị ảnh hưởng
  tenantId: String,          // Optional, ID tổ chức liên quan
  contextData: Object,        // Dữ liệu ngữ cảnh bổ sung
  status: String,            // Trạng thái ('Success', 'Failure')
  failureReason: String,     // Optional, Lý do thất bại
  createdAt: Date            // Thời điểm ALM lưu trữ bản ghi
}
```

**Collection retention_policies:**

```javascript
{
  _id: ObjectId,              // MongoDB ID
  id: String,                 // RetentionPolicy ID (UUID)
  name: String,               // Tên chính sách
  description: String,        // Mô tả chính sách
  rules: [{                   // Mảng các retention rules
    boundedContext: String,   // Optional, áp dụng cho BC cụ thể
    actionType: String,       // Optional, áp dụng cho loại hành động cụ thể
    entityType: String,       // Optional, áp dụng cho loại thực thể cụ thể
    tenantId: String,         // Optional, áp dụng cho tenant cụ thể
    retentionDurationValue: Number, // Giá trị thời gian lưu trữ
    retentionDurationUnit: String   // Đơn vị ('Day', 'Month', 'Year')
  }],
  isActive: Boolean,          // Trạng thái hoạt động
  createdAt: Date,           // Thời điểm tạo
  updatedAt: Date            // Thời điểm cập nhật cuối
}
```

**Indexes:**

Trên collection audit_log_entries:

```javascript
// Indexes cho truy vấn
{ timestamp: 1 }                    // Truy vấn theo thời gian
{ tenantId: 1, timestamp: 1 }       // Truy vấn theo tenant và thời gian
{ boundedContext: 1, timestamp: 1 }  // Truy vấn theo BC và thời gian
{ actionType: 1, timestamp: 1 }      // Truy vấn theo action và thời gian
{ entityType: 1, entityId: 1 }      // Truy vấn theo entity
{ initiator.type: 1, initiator.id: 1 } // Truy vấn theo initiator
{ category: 1 }                     // Truy vấn theo category
{ severity: 1 }                     // Truy vấn theo severity
{ status: 1 }                       // Truy vấn theo status
{ createdAt: 1 }                    // Hỗ trợ retention

// Compound indexes cho các truy vấn phức tạp
{ tenantId: 1, boundedContext: 1, timestamp: 1 }
{ tenantId: 1, actionType: 1, timestamp: 1 }
{ tenantId: 1, severity: 1, timestamp: 1 }
```

Trên collection retention_policies:

```javascript
{ name: 1 }                         // Unique index cho tên policy
{ isActive: 1 }                     // Truy vấn policies đang hoạt động
{ "rules.boundedContext": 1 }       // Tìm policies theo BC
{ "rules.tenantId": 1 }            // Tìm policies theo tenant
```

### **6.2. Chiến lược Sharding**

Để đảm bảo khả năng mở rộng cho volume lớn của audit logs, collection audit_log_entries sẽ được sharded:

1. **Shard Key:** { tenantId: 1, timestamp: 1 }

   - Cho phép phân phối dữ liệu đều giữa các shards
   - Hỗ trợ truy vấn hiệu quả theo tenant và khoảng thời gian
   - Đảm bảo locality cho dữ liệu của cùng một tenant

2. **Chunks:** Dữ liệu sẽ được chia thành các chunks dựa trên shard key
   - MongoDB sẽ tự động cân bằng chunks giữa các shards
   - Kích thước chunk mặc định: 64MB

Collection retention_policies không cần sharding do kích thước nhỏ và ít thay đổi.

### **6.3. Chiến lược Backup**

1. **Backup Định kỳ:**

   - Full backup hàng tuần
   - Incremental backup hàng ngày
   - Point-in-time recovery (PITR) được bật

2. **Retention cho Backup:**
   - Full backups: giữ trong 3 tháng
   - Incremental backups: giữ trong 1 tháng
   - PITR window: 7 ngày

## **7\. Giao tiếp và Tích hợp**

ALM tương tác với các BC khác chủ yếu qua Eventing (nhận Commands/Background Tasks) và Request/Reply (cung cấp Queries).

### **7.1. Mô hình Giao tiếp và Trách nhiệm Phân chia**

#### **7.1.1. Cơ chế Giao tiếp Chính**

**Quan trọng:** ALM không lắng nghe trực tiếp các sự kiện nghiệp vụ thông thường (như `user.created`, `order.placed`, `product.updated`) mà chỉ lắng nghe các sự kiện audit log chuyên biệt được gửi đến queue riêng của ALM.

- **Nhận Audit Log Events (Ingestion \- Command/Background Task):**

  - ALM Ingestion Service lắng nghe các Audit Log Event từ Message Broker (RabbitMQ) trên queue chuyên biệt (ví dụ: `alm.audit-logs`).
  - Các BC nguồn (IAM, BUM, Feature BCs, v.v.) chịu trách nhiệm phát ra các Event này với payload chứa đầy đủ thông tin cần thiết cho AuditLogEntry.
  - **Không phải tất cả các sự kiện nghiệp vụ đều cần được audit log**. BC nguồn quyết định khi nào một hành động đủ quan trọng để tạo audit log.

- **Cung cấp Query API (Query):**

  - ALM Query Service cung cấp API (qua NATS Request/Reply, được expose qua API Gateway nếu cần) cho các BC khác hoặc hệ thống bên ngoài để truy vấn audit logs. Đây là cách các hệ thống khác gửi Query đến ALM.
  - Các Query này sử dụng AuditLogQueryCriteria Value Object để định nghĩa các tiêu chí lọc, sắp xếp, phân trang.

- **Tương tác với IAM (Authorization):**

  - ALM Query Service **bắt buộc** phải gọi IAM (qua Request/Reply) để kiểm tra quyền truy cập của bên gọi (User/System) trước khi thực hiện truy vấn. IAM sẽ xác định xem bên gọi có được phép xem các bản ghi log dựa trên TenantId, Category, Severity, hoặc các tiêu chí khác trong Query Criteria hay không.

- **Phát Domain Events (Optional):**

  - ALM Ingestion Service có thể phát AuditLogEntryPersisted Event sau khi lưu log thành công.
  - ALM Worker Service có thể phát AuditLogRetentionApplied Event sau khi xóa log cũ.
  - ALM Ingestion Service có thể phát AuditLogIngestionFailed Event nếu không xử lý được log nhận được.

- **Tương tác với ALM nội bộ:**
  - ALM Worker Service và ALM Ingestion Service tương tác nội bộ với Database của ALM.
  - ALM Worker Service có thể gọi ALM Command Service (nếu có) hoặc Database trực tiếp để thực hiện xóa dữ liệu (thực hiện Command).

#### **7.1.2. Trách nhiệm Phân chia Rõ ràng**

- **Trách nhiệm của BC nguồn:**

  - Quyết định khi nào một hành động cần được ghi log (ví dụ: đăng nhập thành công/thất bại, tạo/sửa/xóa tài nguyên quan trọng, thay đổi quyền, v.v.)
  - Chuẩn bị đầy đủ dữ liệu cần thiết cho audit log, bao gồm:
    - Thông tin về người thực hiện hành động (Initiator)
    - Thời gian hành động xảy ra (Timestamp)
    - Loại hành động (ActionType)
    - Thông tin về đối tượng bị tác động (EntityType, EntityId)
    - Dữ liệu ngữ cảnh bổ sung (ContextData)
  - Xử lý dữ liệu nhạy cảm trước khi gửi (ví dụ: che giấu mật khẩu, thông tin thẻ tín dụng)
  - Phát Audit Log Event đến queue chuyên biệt của ALM

- **Trách nhiệm của ALM:**
  - Lắng nghe các Audit Log Event từ queue chuyên biệt
  - Kiểm tra tính hợp lệ cơ bản của dữ liệu
  - Chuyển đổi dữ liệu từ Event thành AuditLogEntry
  - Lưu trữ AuditLogEntry vào cơ sở dữ liệu
  - Cung cấp API để truy vấn audit logs
  - Quản lý vòng đời dữ liệu (retention)
  - **ALM không chịu trách nhiệm quyết định khi nào cần tạo audit log**

### **7.2. Hướng dẫn Triển khai cho các BC**

#### **7.2.1. Cấu trúc Audit Log Event**

Các BC cần gửi Audit Log Event với cấu trúc sau:

```json
{
  "eventType": "audit.log",
  "version": "1.0",
  "metadata": {
    "eventId": "uuid-v4",
    "timestamp": "2024-03-20T10:00:00Z",
    "correlationId": "optional-correlation-id",
    "userId": "user-id-who-performed-action",
    "userName": "user-name-who-performed-action",
    "initiatorType": "User|System|API|Integration",
    "ipAddress": "optional-ip-address",
    "userAgent": "optional-user-agent"
  },
  "payload": {
    "boundedContext": "IAM|BUM|PIM|etc",
    "actionType": "User.Created|Order.Placed|Product.Updated|etc",
    "category": "Security|Business|Operational|etc",
    "severity": "Critical|High|Medium|Low|Info",
    "entityType": "User|Order|Product|etc",
    "entityId": "entity-uuid",
    "tenantId": "tenant-uuid",
    "status": "Success|Failure",
    "failureReason": "optional-failure-reason",
    "contextData": {
      // Dữ liệu ngữ cảnh tùy chỉnh tùy thuộc vào loại hành động
      // Ví dụ cho User.Created:
      "email": "user@example.com",
      "roles": ["admin", "user"],
      // Ví dụ cho Product.Updated:
      "changedFields": {
        "name": {
          "oldValue": "Product A",
          "newValue": "Product B"
        },
        "price": {
          "oldValue": 100,
          "newValue": 120
        }
      }
    }
  }
}
```

#### **7.2.2. Quy tắc Phát Audit Log Event**

1. **Khi nào phát Audit Log Event:**

   - Khi người dùng đăng nhập/đăng xuất (thành công hoặc thất bại)
   - Khi tài nguyên quan trọng được tạo/sửa/xóa
   - Khi thay đổi quyền hoặc cấu hình hệ thống
   - Khi thực hiện các hành động nhạy cảm (ví dụ: truy cập dữ liệu nhạy cảm)
   - Khi xảy ra lỗi bảo mật hoặc vi phạm chính sách

2. **Cách phát Audit Log Event:**

   - Sử dụng RabbitMQ làm Message Broker
   - Gửi đến exchange `alm.events` với routing key `audit.log`
   - Đảm bảo delivery mode là persistent để không mất dữ liệu

3. **Xử lý dữ liệu nhạy cảm:**
   - **KHÔNG BAO GIỜ** gửi thông tin nhạy cảm như mật khẩu, token, thông tin thẻ tín dụng đầy đủ
   - Che giấu thông tin nhạy cảm (ví dụ: chỉ hiển thị 4 số cuối của thẻ tín dụng)
   - Mã hóa thông tin nhạy cảm nếu cần thiết

#### **7.2.3. Triển khai Mẫu trong NestJS**

Dưới đây là ví dụ về cách triển khai trong một BC sử dụng NestJS:

```typescript
// audit-log.publisher.ts
import { Injectable } from "@nestjs/common";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class AuditLogPublisher {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async publishAuditLog({ boundedContext, actionType, initiator, entityType, entityId, tenantId, category, severity, status, failureReason, contextData }) {
    const eventId = uuidv4();
    const timestamp = new Date();

    await this.amqpConnection.publish(
      "alm.events", // exchange
      "audit.log", // routing key
      {
        eventType: "audit.log",
        version: "1.0",
        metadata: {
          eventId,
          timestamp,
          correlationId: initiator.correlationId,
          userId: initiator.id,
          userName: initiator.name,
          initiatorType: initiator.type,
          ipAddress: initiator.ipAddress,
          userAgent: initiator.userAgent,
        },
        payload: {
          boundedContext,
          actionType,
          category,
          severity,
          entityType,
          entityId,
          tenantId,
          status,
          failureReason,
          contextData,
        },
      },
      {
        persistent: true, // Đảm bảo message không bị mất khi RabbitMQ restart
      }
    );
  }
}
```

Sử dụng trong một service:

```typescript
// user.service.ts
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository, private readonly auditLogPublisher: AuditLogPublisher) {}

  async createUser(createUserDto: CreateUserDto, requestContext: RequestContext) {
    // Logic tạo user
    const user = await this.userRepository.create(createUserDto);

    // Phát audit log event
    await this.auditLogPublisher.publishAuditLog({
      boundedContext: "IAM",
      actionType: "User.Created",
      initiator: {
        id: requestContext.userId || "system",
        name: requestContext.userName || "System",
        type: requestContext.userId ? "User" : "System",
        ipAddress: requestContext.ipAddress,
        userAgent: requestContext.userAgent,
        correlationId: requestContext.correlationId,
      },
      entityType: "User",
      entityId: user.id,
      tenantId: user.tenantId,
      category: "Security",
      severity: "Info",
      status: "Success",
      contextData: {
        email: user.email,
        roles: user.roles,
        // Không bao gồm mật khẩu hoặc thông tin nhạy cảm khác
      },
    });

    return user;
  }
}
```

#### **7.2.4. Kiểm thử Audit Log Event**

Để đảm bảo các BC phát Audit Log Event đúng cách, nên thêm các test sau:

1. **Unit Tests:** Kiểm tra AuditLogPublisher được gọi với đúng tham số
2. **Integration Tests:** Kiểm tra message được gửi đến RabbitMQ với đúng cấu trúc
3. **Contract Tests:** Đảm bảo cấu trúc message tuân thủ schema đã định nghĩa

## **8\. Định nghĩa API Endpoint và Mapping Use Case**

Phần này phác thảo các API Endpoint chính mà ALM cung cấp (chủ yếu qua ALM Query Service) và mapping chúng với các Use Case đã định nghĩa trong tài liệu Thiết kế Miền ALM, bao gồm cả loại Use Case.

| API Endpoint (Ví dụ)           | Phương thức HTTP | Mô tả Chức năng Cấp cao                               | Use Case Liên quan (alm.md)                  | Loại Use Case | Loại Yêu cầu Nội bộ (CQRS) | Service Xử lý     |
| :----------------------------- | :--------------- | :---------------------------------------------------- | :------------------------------------------- | :------------ | :------------------------- | :---------------- |
| /api/v1/alm/audit-logs         | GET              | Truy vấn các bản ghi audit log dựa trên tiêu chí lọc. | Truy vấn Audit Logs (8.2.1)                  | Query         | Query                      | ALM Query Service |
| /api/v1/alm/audit-logs/{logId} | GET              | Lấy chi tiết một bản ghi audit log cụ thể theo ID.    | Truy vấn Audit Logs (8.2.1)                  | Query         | Query                      | ALM Query Service |
| /api/v1/alm/retention-policies | GET              | Lấy danh sách các chính sách retention (Admin).       | Quản lý Vòng đời Dữ liệu (Retention) (8.3.1) | Query         | Query                      | ALM Query Service |

### **8.1. Event Communication**

Tất cả giao tiếp giữa các service trong ALM đều thông qua Message Broker:

| Event Type                | Direction | Mô tả                                               | Use Case Liên quan (alm.md)                  | Loại Use Case | Service Xử lý         |
| :------------------------ | :-------- | :-------------------------------------------------- | :------------------------------------------- | :------------ | :-------------------- |
| AuditLogEntryPersisted    | Published | Event được phát khi một bản ghi audit log được lưu. | Thu thập và Lưu trữ Audit Log Entry (8.1.1)  | Command       | ALM Ingestion Service |
| AuditLogIngestionFailed   | Published | Event được phát khi không thể xử lý một event.      | Thu thập và Lưu trữ Audit Log Entry (8.1.1)  | Command       | ALM Ingestion Service |
| AuditLogRetentionApplied  | Published | Event được phát khi retention job hoàn thành.       | Quản lý Vòng đời Dữ liệu (Retention) (8.3.1) | Command       | ALM Worker Service    |
| GetAuditLogsQuery         | Consumed  | Query request để lấy danh sách audit logs.          | Truy vấn Audit Logs (8.2.1)                  | Query         | ALM Query Service     |
| GetAuditLogDetailQuery    | Consumed  | Query request để lấy chi tiết một audit log.        | Truy vấn Audit Logs (8.2.1)                  | Query         | ALM Query Service     |
| GetRetentionPoliciesQuery | Consumed  | Query request để lấy danh sách retention policies.  | Quản lý Vòng đời Dữ liệu (Retention) (8.3.1) | Query         | ALM Query Service     |
| RetentionJobTrigger       | Consumed  | Event kích hoạt retention job.                      | Quản lý Vòng đời Dữ liệu (Retention) (8.3.1) | Command       | ALM Worker Service    |

### **8.2. Event Payload Examples**

**AuditLogEntryPersisted:**

```json
{
  "eventId": "uuid",
  "auditLogEntryId": "uuid",
  "timestamp": "2024-03-20T10:00:00Z",
  "boundedContext": "string",
  "actionType": "string",
  "tenantId": "uuid"
}
```

**GetAuditLogsQuery:**

```json
{
  "queryId": "uuid",
  "criteria": {
    "tenantId": "uuid",
    "timestampRange": {
      "from": "2024-03-20T00:00:00Z",
      "to": "2024-03-20T23:59:59Z"
    },
    "boundedContext": "string",
    "actionType": "string",
    "pageNumber": 1,
    "pageSize": 20
  }
}
```

**RetentionJobTrigger:**

```json
{
  "jobId": "uuid",
  "triggeredAt": "2024-03-20T10:00:00Z",
  "policyId": "uuid"
}
```

## **9\. Chiến lược Xử lý Lỗi (Error Handling Strategy)**

Chiến lược xử lý lỗi trong ALM sẽ tuân thủ mô hình chung của Ecoma và phân biệt giữa các loại lỗi, kênh giao tiếp:

- **Lỗi Nghiệp vụ (Business Rule Exceptions):** Trong ALM, lỗi nghiệp vụ chủ yếu liên quan đến việc từ chối truy vấn do không đủ quyền (Authorization Failure) hoặc lỗi validate input cho Query Criteria.
  - **Đối với giao tiếp Request/Reply (Query API):** Lỗi ủy quyền sẽ được ALM Query Service phát hiện (sau khi gọi IAM) và trả về phản hồi lỗi có cấu trúc với mã lỗi và thông báo phù hợp (ví dụ: HTTP status code 403 Forbidden). Lỗi validate input sẽ trả về HTTP status code 400 Bad Request.
  - **Đối với giao tiếp qua Message Broker (Ingestion \- Command/Background Task):** Nếu dữ liệu trong Event payload không đủ hoặc không hợp lệ để tạo AuditLogEntry (lỗi nghiệp vụ _ở nguồn_), ALM Ingestion Service sẽ ghi log lỗi chi tiết và có thể phát ra AuditLogIngestionFailed Event. Event gốc có thể được chuyển vào DLQ.
  - **Đối với giao tiếp qua Message Broker (Ingestion \- Command/Background Task):** Nếu dữ liệu trong Event payload không đủ hoặc không hợp lệ để tạo AuditLogEntry (lỗi nghiệp vụ _ở nguồn_), ALM Ingestion Worker sẽ ghi log lỗi chi tiết và có thể phát ra AuditLogIngestionFailed Event. Event gốc có thể được chuyển vào DLQ.
- **Lỗi Kỹ thuật (Technical Errors):** Các lỗi phát sinh ở lớp Infrastructure (ví dụ: lỗi kết nối DB, lỗi kết nối Message Broker, lỗi cache Redis, lỗi gọi IAM API).
  - Các lỗi này cần được ghi log chi tiết (sử dụng Structured Logging) với mức độ phù hợp (ERROR), bao gồm stack trace và các thông tin tương quan.
  - Đối với giao tiếp Request/Reply (Query API): Lỗi kỹ thuật sẽ được chuyển đổi thành phản hồi lỗi chung (HTTP status code 500 Internal Server Error) để tránh lộ thông tin nhạy cảm, nhưng vẫn ghi log chi tiết ở phía server.
  - Đối với giao tiếp qua Message Broker (Ingestion \- Command/Background Task): Lỗi kỹ thuật trong quá trình xử lý Event (ví dụ: không ghi được vào DB) sẽ được xử lý theo cơ chế retry của RabbitMQ. Nếu retry vẫn thất bại, message sẽ được chuyển vào Dead Letter Queue (DLQ) để phân tích sau. Lỗi cũng cần được ghi log và có thể kích hoạt cảnh báo.
  - Đối với Scheduled Task (Retention \- Command/Background Task): Lỗi kỹ thuật trong quá trình chạy tác vụ retention sẽ được ghi log chi tiết và kích hoạt cảnh báo. Tác vụ có thể được cấu hình để retry hoặc cần can thiệp thủ công.
- **Thông báo Lỗi:** Các lỗi quan trọng (ví dụ: lỗi kết nối DB kéo dài, lỗi Ingestion Event liên tục, lỗi tác vụ Retention thất bại) cần kích hoạt cảnh báo thông qua hệ thống giám sát (Observability Stack).

## **10\. Khả năng Phục hồi (Resiliency)**

Để đảm bảo ALM chịu lỗi và phục hồi khi các phụ thuộc gặp sự cố và xử lý volume dữ liệu/request lớn:

- **Timeouts và Retries:** Cấu hình timeouts và retry policies cho các cuộc gọi đi đến các phụ thuộc (PostgreSQL, Redis, NATS, RabbitMQ, IAM API). Sử dụng các thư viện hỗ trợ retry với exponential backoff và jitter. Quan trọng với việc ghi vào DB (Command) và gọi IAM (Query).
- **Circuit Breaker:** Áp dụng mẫu Circuit Breaker cho các cuộc gọi đến các phụ thuộc có khả năng gặp sự cố tạm thời (ví dụ: gọi IAM API) để ngăn chặn các cuộc gọi liên tục gây quá tải.
- **Bulkhead:** Sử dụng Bulkhead để cô lập tài nguyên giữa các đơn vị triển khai của ALM (ALM Ingestion Service không ảnh hưởng đến ALM Query Service và ngược lại). Trong ALM Ingestion Service, có thể cô lập tài nguyên cho việc xử lý các loại Event khác nhau nếu cần.
- **Health Checks:** Triển khai các loại Health Check Probe trong Kubernetes cho mỗi service/worker ALM:
  - **Startup Probe:** Kiểm tra xem ứng dụng đã khởi động hoàn toàn (kết nối đến DB, Message Broker, Cache đã sẵn sàng).
  - **Liveness Probe:** Kiểm tra xem ứng dụng có đang chạy và khỏe mạnh không. Kiểm tra vòng lặp xử lý message/request/scheduled task.
  - **Readiness Probe:** Kiểm tra xem ứng dụng đã sẵn sàng xử lý request/message chưa. Kiểm tra kết nối đến **PostgreSQL** (nguồn dữ liệu chính, kiểm tra cả khả năng ghi/đọc cơ bản), **Redis** (nếu sử dụng cache), và khả năng kết nối đến **Message Broker** (đối với Ingestion Worker \- Background Task). Đối với Query Service, cần kiểm tra khả năng gọi **IAM API** (nếu là phụ thuộc critical cho Authorization).
- **Idempotency:** Thiết kế Event Handlers trong ALM Ingestion Service có tính Idempotent để việc nhận và xử lý trùng lặp một Event do cơ chế phân phối của Message Broker không gây ra việc ghi log trùng lặp. Sử dụng Event ID hoặc một ID duy nhất từ Event payload làm key kiểm tra trùng lặp trước khi ghi vào DB.
- **Queue Monitoring:** Giám sát độ dài hàng đợi (Queue Length) của RabbitMQ cho các queue mà ALM Ingestion Service lắng nghe. Độ dài hàng đợi tăng đột ngột là dấu hiệu của vấn đề trong quá trình ingestion.

## **11\. Chiến lược Kiểm thử (Testing Strategy)**

Chiến lược kiểm thử cho ALM sẽ tuân thủ mô hình chung của Ecoma:

- **Unit Tests:** Kiểm thử logic chuyển đổi dữ liệu từ Event payload sang AuditLogEntry (Command), logic lọc/sắp xếp trong AuditLogQueryCriteria (Query), logic áp dụng Retention Policy (xác định bản ghi cần xóa \- Command/Background Task) một cách độc lập (sử dụng mock cho Repository, Gateway, Event payload).
- **Integration Tests:** Kiểm thử sự tương tác giữa các thành phần nội bộ của từng service (ví dụ: ALM Ingestion Service xử lý Event và gọi Repository để ghi vào DB thực hoặc Testcontainers; ALM Query Service nhận Query, gọi IAM mock/testcontainer, gọi Repository để truy vấn DB thực).
- **End-to-End Tests (E2E Tests):** Kiểm thử luồng ghi log hoàn chỉnh (ví dụ: một hành động trong Feature BC phát Event \-\> ALM Ingestion Service nhận Event và ghi log \-\> ALM Query Service có thể truy vấn được log đó qua API Gateway). Kiểm thử luồng truy vấn log với ủy quyền (ví dụ: User A có quyền xem log của Tenant X, User B không có quyền). Kiểm thử luồng retention (ví dụ: sau khi chạy scheduled task, các log cũ hơn thời hạn bị xóa).
- **Contract Tests:** Đảm bảo schema của các Domain Event mà ALM lắng nghe (Command/Background Task) tuân thủ "hợp đồng" với các BC nguồn. Đảm bảo API Endpoint của ALM Query Service (Query) tuân thủ "hợp đồng" với các Consumer (sử dụng OpenAPI spec).
- **Component Tests:** Kiểm thử từng service ALM (ALM Ingestion Service, ALM Query Service, ALM Worker Service) trong môi trường gần với production, với các phụ thuộc (DB, Redis, Message Broker, IAM) được giả lập hoặc sử dụng Testcontainers.
- **Performance/Load Tests:** Kiểm thử tải để xác minh ALM Ingestion Service có thể xử lý volume Event dự kiến và ALM Query Service có thể đáp ứng yêu cầu hiệu năng cho các truy vấn phức tạp trên tập dữ liệu lớn.

## **12\. Chiến lược Di chuyển Dữ liệu (Data Migration Strategy)**

Quản lý thay đổi schema database PostgreSQL của ALM cần được thực hiện cẩn thận, đặc biệt với bảng audit_log_entries có volume lớn và Partitioning:

- Sử dụng công cụ quản lý migration schema tự động (ví dụ: Flyway hoặc Liquibase).
- Thiết kế các migration có tính **Backward Compatibility** (chỉ thêm, không xóa/sửa đổi các cột/bảng quan trọng).
- Lập kế hoạch **rollback** cho các migration.
- Đối với các thay đổi dữ liệu phức tạp hoặc cần thay đổi cấu trúc Partitioning, viết **Data Migration Script** riêng biệt và lập kế hoạch thực thi cẩn thận trên môi trường Production.
- Đảm bảo có bản sao lưu (backup) dữ liệu trước khi thực hiện các migration quan trọng.
- Quản lý vòng đời của các Partition (tạo Partition mới cho tương lai, detach/drop Partition cũ theo chính sách retention) là một phần của chiến lược vận hành, không chỉ migration.

## **13\. Kế hoạch Dung lượng (Capacity Planning \- Initial)**

Dựa trên ước tính ban đầu về lượng Event được phát ra trên toàn hệ thống, tần suất truy vấn log, đưa ra ước tính ban đầu về tài nguyên cần thiết cho mỗi đơn vị triển khai của ALM. Các con số này là điểm khởi đầu và sẽ được điều chỉnh dựa trên dữ liệu thực tế sau khi triển khai và giám sát.

- **ALM Ingestion Service:** Dự kiến nhận lượng Event _rất lớn_.
  - Số lượng Pod tối thiểu: 3-5
  - Số lượng Pod tối đa: 15+ (tùy thuộc vào lượng Event)
  - Giới hạn CPU mỗi Pod: 300m \- 700m
  - Giới hạn Memory mỗi Pod: 512Mi \- 1Gi
  - Cấu hình HPA: Dựa trên CPU Utilization và độ dài hàng đợi Message Broker.
- **ALM Query Service:** Dự kiến nhận lượng Query, đặc biệt từ Admin UI và có thể từ các hệ thống bên ngoài.
  - Số lượng Pod tối thiểu: 3-5
  - Số lượng Pod tối đa: 10+ (tùy thuộc vào tải truy vấn)
  - Giới hạn CPU mỗi Pod: 500m \- 1000m
  - Giới hạn Memory mỗi Pod: 512Mi \- 1Gi
  - Cấu hình HPA: Dựa trên CPU Utilization và Request Rate.
- **ALM Cleaner Service:** Lượng tải xử lý tác vụ retention dự kiến không quá lớn, nhưng có thể tốn tài nguyên khi xóa lượng lớn dữ liệu.
  - Số lượng Pod tối thiểu: 2
  - Số lượng Pod tối đa: 3-5
  - Giới hạn CPU mỗi Pod: 300m \- 700m (có thể cần nhiều hơn khi xóa dữ liệu)
  - Giới hạn Memory mỗi Pod: 512Mi \- 1Gi
  - Cấu hình HPA: Có thể dựa trên CPU Utilization hoặc thời gian chạy tác vụ.

## **14\. Phụ thuộc (Dependencies)**

- **Phụ thuộc Nội bộ (Internal Dependencies):**
  - Tất cả các BC khác (IAM, BUM, NDM, LZM, RDM, Feature BCs) là Producer của Domain Events mà ALM Ingestion Service tiêu thụ.
  - IAM là nhà cung cấp dịch vụ ủy quyền cho ALM Query Service.
  - Các BC khác, Admin UI, hệ thống bên ngoài là Consumer của ALM Query Service.
  - ALM Cleaner Service có thể gọi ALM Command Service (nếu có) hoặc tương tác trực tiếp với DB.
- **Phụ thuộc Bên ngoài (External Dependencies):**
  - Database (MongoDB, có thể cả Elasticsearch nếu cần).
  - Message Brokers (RabbitMQ).
  - Container Registry.
  - Kubernetes API.
  - Các hệ thống bên ngoài cần truy vấn log (SIEM, BI).

## **15\. Kết luận**

Tài liệu thiết kế triển khai cho Bounded Context Audit Log Management (ALM) đã được xây dựng dựa trên tài liệu thiết kế miền ALM và tuân thủ chặt chẽ kiến trúc Microservices, CQRS và Clean Architecture của hệ thống Ecoma. Việc phân tách ALM thành ba service riêng biệt (ALM Ingestion Service, ALM Query Service, ALM Cleaner Service) là cần thiết để đáp ứng yêu cầu về khả năng mở rộng cho việc thu thập volume log lớn, hiệu năng truy vấn trên dữ liệu lịch sử, và quản lý vòng đời dữ liệu. Việc phân loại use case theo Commands, Queries và Background Tasks trong tài liệu thiết kế miền được phản ánh trực tiếp trong cấu trúc triển khai này. Việc sử dụng MongoDB với các tối ưu hóa (Indexing, Sharding) được đề xuất làm giải pháp lưu trữ ban đầu, với cân nhắc về Elasticsearch nếu yêu cầu hiệu năng truy vấn vượt quá khả năng của MongoDB. Các khía cạnh quan trọng về giao tiếp (Eventing cho Commands/Background Tasks, Request/Reply cho Queries), xử lý lỗi, khả năng phục hồi, kiểm thử và vận hành đã được đề cập, phác thảo các chiến lược và yêu cầu kỹ thuật.

Tài liệu này cung cấp nền tảng vững chắc cho đội ngũ kỹ thuật để tiến hành thiết kế kỹ thuật chi tiết hơn (ví dụ: chi tiết implementation của Domain/Application Service, cấu trúc Command/Query/Event payload chi tiết) và bắt đầu quá trình triển khai thực tế Microservice(s) ALM, đảm bảo tuân thủ các nguyên tắc và mục tiêu kiến trúc của hệ thống Ecoma.

## **16. Monitoring**

### **16.1. Metrics**

**1. Service Level Metrics:**

- **Availability:**

  - Service uptime
  - Module uptime (Ingestion, Query, Retention)
  - Health check status
  - Error rate

- **Performance:**
  - Response time
  - Request rate
  - Resource usage (CPU, Memory)
  - MongoDB connection pool status
  - Message Broker connection status

**2. Module Level Metrics:**

- **Ingestion Module:**

  - Event ingestion rate
  - Event processing latency
  - Failed events count
  - Event queue size
  - Event processing errors
  - Event validation errors

- **Query Module:**

  - Query rate
  - Query latency
  - Query cache hit rate
  - Query errors
  - Query result size
  - Query complexity

- **Retention Module:**
  - Retention job execution rate
  - Retention job latency
  - Records deleted count
  - Retention errors
  - Retention policy compliance
  - Storage usage

**3. Business Metrics:**

- Total audit logs
- Audit logs by type
- Audit logs by source
- Audit logs by severity
- Retention policy coverage
- Data growth rate

### **16.2. Logging**

**1. Log Levels:**

- ERROR: Lỗi nghiêm trọng cần can thiệp ngay
- WARN: Cảnh báo cần chú ý
- INFO: Thông tin hoạt động bình thường
- DEBUG: Thông tin chi tiết cho debugging
- TRACE: Thông tin rất chi tiết

**2. Log Categories:**

- **Service Logs:**

  - Service startup/shutdown
  - Health check results
  - Configuration changes
  - Resource usage

- **Module Logs:**

  - Module startup/shutdown
  - Module health status
  - Module performance metrics
  - Module errors

- **Business Logs:**
  - Audit log ingestion
  - Audit log queries
  - Retention policy execution
  - Business rule violations

**3. Log Format:**

```json
{
  "timestamp": "2024-03-20T10:00:00Z",
  "level": "INFO",
  "module": "ingestion|query|retention",
  "traceId": "abc123",
  "message": "Event processed successfully",
  "context": {
    "eventId": "evt_123",
    "eventType": "UserAction",
    "source": "UserManagement",
    "processingTime": "50ms"
  },
  "metadata": {
    "service": "alm",
    "version": "1.0.0",
    "environment": "production"
  }
}
```

### **16.3. Tracing**

**1. Trace Context:**

- Trace ID
- Span ID
- Parent Span ID
- Service name
- Module name
- Operation name

**2. Trace Points:**

- **Ingestion Module:**

  - Event received
  - Event validation
  - Event processing
  - Event persistence
  - Event acknowledgment

- **Query Module:**

  - Query received
  - Query validation
  - Query execution
  - Result processing
  - Response sent

- **Retention Module:**
  - Job triggered
  - Policy evaluation
  - Record selection
  - Deletion execution
  - Job completion

**3. Trace Format:**

```json
{
  "traceId": "abc123",
  "spanId": "def456",
  "parentSpanId": "ghi789",
  "service": "alm",
  "module": "ingestion|query|retention",
  "operation": "processEvent|executeQuery|runRetention",
  "startTime": "2024-03-20T10:00:00Z",
  "endTime": "2024-03-20T10:00:01Z",
  "duration": "1000ms",
  "tags": {
    "eventType": "UserAction",
    "source": "UserManagement",
    "status": "success"
  }
}
```

### **16.4. Alerting**

**1. Service Level Alerts:**

- Service down
- High error rate
- High latency
- Resource exhaustion
- Health check failures

**2. Module Level Alerts:**

- **Ingestion Module:**

  - High ingestion latency
  - High failure rate
  - Queue overflow
  - Validation errors
  - Processing errors

- **Query Module:**

  - High query latency
  - High error rate
  - Cache miss rate
  - Result size limits
  - Query timeouts

- **Retention Module:**
  - Job failures
  - High latency
  - Policy violations
  - Storage issues
  - Deletion errors

**3. Business Level Alerts:**

- Data growth rate
- Retention policy violations
- Compliance issues
- Security incidents
- Performance degradation

### **16.5. Dashboards**

**1. Service Overview:**

- Service health
- Module health
- Resource usage
- Error rates
- Performance metrics

**2. Module Dashboards:**

- **Ingestion Dashboard:**

  - Ingestion rate
  - Processing latency
  - Error rates
  - Queue metrics
  - Event types

- **Query Dashboard:**

  - Query rate
  - Query latency
  - Cache performance
  - Error rates
  - Query patterns

- **Retention Dashboard:**
  - Job execution
  - Policy compliance
  - Storage usage
  - Deletion metrics
  - Error rates

**3. Business Dashboard:**

- Audit log volume
- Log distribution
- Retention coverage
- Compliance status
- Security metrics

## **17. Data Security**

### **17.1. Data Sensitivity**

- ALM không chịu trách nhiệm xử lý dữ liệu nhạy cảm
- Các BC nguồn phải xử lý dữ liệu nhạy cảm trước khi gửi đến ALM
- ALM chỉ lưu trữ dữ liệu đã được xử lý

### **17.2. Data Access Control**

- Tất cả truy cập dữ liệu phải thông qua IAM
- Mỗi query phải được ủy quyền trước khi thực thi
- Audit logs chỉ có thể truy cập bởi người dùng có quyền phù hợp

## **18. Retention Policy Management**

### **18.1. Authorization**

- Tất cả thao tác với retention policy đều phải được ủy quyền qua IAM
- Chỉ người dùng có role "Retention Policy Manager" mới có quyền quản lý policies
- Mỗi thao tác (create/update/delete) đều được ghi log

### **18.2. Policy Conflict Resolution**

- Khi có nhiều policy áp dụng cho cùng một bản ghi:
  1. Policy cụ thể nhất sẽ được ưu tiên (dựa trên số lượng điều kiện match)
  2. Nếu có nhiều policy cùng độ ưu tiên, policy có retention time ngắn nhất sẽ được áp dụng

## **19. Error Recovery Strategy**

### **19.1. Ingestion Worker Recovery**

- Sử dụng Dead Letter Queue (DLQ) cho các event không thể xử lý
- Retry policy với exponential backoff
- Manual intervention required sau 3 lần retry thất bại
- Alert khi event bị chuyển vào DLQ

### **19.2. Query Service Recovery**

- Circuit breaker pattern cho các external service calls
- Fallback responses khi IAM không available
- Automatic retry với jitter cho transient failures

### **19.3. Retention Job Recovery**

- Job execution tracking trong MongoDB
- Automatic retry cho failed jobs
- Manual trigger option cho failed jobs
- Alert khi job thất bại liên tục

## **20. Data Consistency**

### **20.1. MongoDB Consistency**

- Sử dụng Write Concern: majority
- Read Concern: local
- Sử dụng MongoDB transactions cho các operation cần atomic

### **20.2. Event Processing Consistency**

- Idempotent event processing
- Event deduplication sử dụng event ID
- Event ordering đảm bảo bởi Message Broker

## **21. API Versioning**

### **21.1. Event Versioning**

- Version được đánh dấu trong event schema
- Support version major - 1
- Deprecation notice trước khi remove version

### **21.2. Query API Versioning**

- Version trong URL path
- Support version major - 1
- Deprecation notice trước khi remove version

## **22. Deployment Strategy**

### **22.1. Deployment Process**

- Blue-green deployment
- Zero-downtime updates
- Automated rollback nếu health check fails
- Database migration tự động

### **22.2. Deployment Order**

1. Database migration (nếu có)
2. ALM Scheduled Worker
3. ALM Query Service
4. ALM Ingestion Worker

### **22.3. Rollback Procedure**

- Automated rollback triggers:
  - Health check failures
  - Error rate tăng đột biến
  - Latency tăng đột biến
- Manual rollback option

## **23. Disaster Recovery**

### **23.1. Recovery Objectives**

- RPO (Recovery Point Objective): 5 phút
- RTO (Recovery Time Objective): 30 phút

### **23.2. Backup Strategy**

- MongoDB backup mỗi 6 giờ
- Point-in-time recovery
- Backup retention: 30 ngày

### **23.3. Recovery Procedure**

1. Restore MongoDB từ backup
2. Verify data integrity
3. Start services theo thứ tự:
   - ALM Scheduled Worker
   - ALM Query Service
   - ALM Ingestion Worker

## **24. Performance Requirements**

### **24.1. Latency Requirements**

- Event ingestion: < 100ms
- Query response: < 500ms
- Retention job: < 5 phút

### **24.2. Throughput Requirements**

- Event ingestion: 1000 events/second
- Query requests: 100 requests/second
- Retention job: 1 job/hour

### **24.3. SLA**

- Availability: 99.9%
- Data durability: 99.999%
- Query success rate: 99.9%

## **25. Integration Testing Strategy**

### **25.1. Test Types**

- Contract tests cho event schemas
- Integration tests với MongoDB
- Integration tests với IAM
- End-to-end tests với các BC khác

### **25.2. Test Environment**

- Sử dụng Testcontainers
- Mock external services
- Test data generation

### **25.3. Test Coverage**

- Event ingestion flow: 100%
- Query processing: 100%
- Retention job: 100%
- Error handling: 100%

## **26. Health Checks**

### **26.1. Health Check Endpoints**

**ALM Ingestion Service:**

- `/health`: Kiểm tra service có đang chạy không
- `/health/ready`: Kiểm tra service đã sẵn sàng nhận request chưa (kết nối MongoDB, Message Broker)
- `/health/startup`: Kiểm tra quá trình khởi động
- `/health/ingestion`: Kiểm tra trạng thái của ingestion module

**ALM Query Service:**

- `/health`: Kiểm tra service có đang chạy không
- `/health/ready`: Kiểm tra service đã sẵn sàng nhận request chưa (kết nối MongoDB, Message Broker)
- `/health/startup`: Kiểm tra quá trình khởi động
- `/health/query`: Kiểm tra trạng thái của query module

**ALM Cleaner Service:**

- `/health`: Kiểm tra service có đang chạy không
- `/health/ready`: Kiểm tra service đã sẵn sàng nhận request chưa (kết nối MongoDB, Message Broker)
- `/health/startup`: Kiểm tra quá trình khởi động
- `/health/cleaner`: Kiểm tra trạng thái của cleaner module

### **26.2. Health Check Response Format**

```json
{
  "status": "UP|DOWN",
  "components": {
    "mongodb": {
      "status": "UP|DOWN",
      "details": {
        "connection": "established|failed",
        "latency": "10ms"
      }
    },
    "messageBroker": {
      "status": "UP|DOWN",
      "details": {
        "connection": "established|failed",
        "latency": "5ms"
      }
    },
    "module": {
      "status": "UP|DOWN",
      "details": {
        "eventProcessingRate": "100/s",
        "queueSize": 1000,
        "lastProcessedEvent": "2024-03-20T10:00:00Z"
      }
    }
  }
}
```

### **26.3. Health Check Behavior**

**Liveness Probe:**

- Endpoint: `/health`
- Kiểm tra service có đang chạy không
- Không kiểm tra dependencies
- Trả về 200 nếu service đang chạy
- Trả về 503 nếu service không hoạt động

**Readiness Probe:**

- Endpoint: `/health/ready`
- Kiểm tra service đã sẵn sàng nhận request chưa
- Kiểm tra kết nối MongoDB và Message Broker
- Trả về 200 nếu service sẵn sàng
- Trả về 503 nếu service chưa sẵn sàng

**Startup Probe:**

- Endpoint: `/health/startup`
- Kiểm tra quá trình khởi động
- Kiểm tra kết nối MongoDB và Message Broker
- Trả về 200 nếu khởi động thành công
- Trả về 503 nếu khởi động thất bại

**Module Probe:**

- Endpoint: `/health/[module]`
- Kiểm tra trạng thái của module cụ thể
- Kiểm tra các metrics và trạng thái của module
- Trả về 200 nếu module hoạt động bình thường
- Trả về 503 nếu module có vấn đề

## **27. Monitoring**

### **27.1. Metrics**

**1. Service Level Metrics:**

- **Availability:**

  - Service uptime
  - Health check status
  - Error rate

- **Performance:**
  - Response time
  - Request rate
  - Resource usage (CPU, Memory)
  - MongoDB connection pool status
  - Message Broker connection status

**2. Service Specific Metrics:**

- **ALM Ingestion Service:**

  - Event ingestion rate
  - Event processing latency
  - Failed events count
  - Event queue size
  - Event processing errors
  - Event validation errors

- **ALM Query Service:**

  - Query rate
  - Query latency
  - Query cache hit rate
  - Query errors
  - Query result size
  - Query complexity

- **ALM Cleaner Service:**
  - Retention job execution rate
  - Retention job latency
  - Records deleted count
  - Retention errors
  - Retention policy compliance
  - Storage usage

**3. Business Metrics:**

- Total audit logs
- Audit logs by type
- Audit logs by source
- Audit logs by severity
- Retention policy coverage
- Data growth rate

### **27.2. Logging**

**1. Log Levels:**

- ERROR: Lỗi nghiêm trọng cần can thiệp ngay
- WARN: Cảnh báo cần chú ý
- INFO: Thông tin hoạt động bình thường
- DEBUG: Thông tin chi tiết cho debugging
- TRACE: Thông tin rất chi tiết

**2. Log Categories:**

- **Service Logs:**

  - Service startup/shutdown
  - Health check results
  - Configuration changes
  - Resource usage

- **Business Logs:**
  - Audit log ingestion
  - Audit log queries
  - Retention policy execution
  - Business rule violations

**3. Log Format:**

```json
{
  "timestamp": "2024-03-20T10:00:00Z",
  "level": "INFO",
  "service": "alm-ingestion|alm-query|alm-cleaner",
  "traceId": "abc123",
  "message": "Event processed successfully",
  "context": {
    "eventId": "evt_123",
    "eventType": "UserAction",
    "source": "UserManagement",
    "processingTime": "50ms"
  },
  "metadata": {
    "version": "1.0.0",
    "environment": "production"
  }
}
```

### **27.3. Tracing**

**1. Trace Context:**

- Trace ID
- Span ID
- Parent Span ID
- Service name
- Operation name

**2. Trace Points:**

- **ALM Ingestion Service:**

  - Event received
  - Event validation
  - Event processing
  - Event persistence
  - Event acknowledgment

- **ALM Query Service:**

  - Query received
  - Query validation
  - Query execution
  - Result processing
  - Response sent

- **ALM Cleaner Service:**
  - Job triggered
  - Policy evaluation
  - Record selection
  - Deletion execution
  - Job completion

**3. Trace Format:**

```json
{
  "traceId": "abc123",
  "spanId": "def456",
  "parentSpanId": "ghi789",
  "service": "alm-ingestion|alm-query|alm-cleaner",
  "operation": "processEvent|executeQuery|runRetention",
  "startTime": "2024-03-20T10:00:00Z",
  "endTime": "2024-03-20T10:00:01Z",
  "duration": "1000ms",
  "tags": {
    "eventType": "UserAction",
    "source": "UserManagement",
    "status": "success"
  }
}
```

### **27.4. Alerting**

**1. Service Level Alerts:**

- Service down
- High error rate
- High latency
- Resource exhaustion
- Health check failures

**2. Service Specific Alerts:**

- **ALM Ingestion Service:**

  - High ingestion latency
  - High failure rate
  - Queue overflow
  - Validation errors
  - Processing errors

- **ALM Query Service:**

  - High query latency
  - High error rate
  - Cache miss rate
  - Result size limits
  - Query timeouts

- **ALM Cleaner Service:**
  - Job failures
  - High latency
  - Policy violations
  - Storage issues
  - Deletion errors

**3. Business Level Alerts:**

- Data growth rate
- Retention policy violations
- Compliance issues
- Security incidents
- Performance degradation

### **27.5. Dashboards**

**1. Service Overview:**

- Service health
- Resource usage
- Error rates
- Performance metrics

**2. Service Specific Dashboards:**

- **ALM Ingestion Dashboard:**

  - Ingestion rate
  - Processing latency
  - Error rates
  - Queue metrics
  - Event types

- **ALM Query Dashboard:**

  - Query rate
  - Query latency
  - Cache performance
  - Error rates
  - Query patterns

- **ALM Cleaner Dashboard:**
  - Job execution
  - Policy compliance
  - Storage usage
  - Deletion metrics
  - Error rates

**3. Business Dashboard:**

- Audit log volume
- Log distribution
- Retention coverage
- Compliance status
- Security metrics

## **28. Capacity Planning**

### **28.1. MongoDB Cluster**

**Initial Setup:**

- 3-node replica set
- Mỗi node:
  - CPU: 8 cores
  - RAM: 32GB
  - Storage: 500GB SSD
  - Network: 1Gbps

**Scaling Strategy:**

- **Vertical Scaling:**

  - CPU: Tăng lên 16 cores khi CPU utilization > 70%
  - RAM: Tăng lên 64GB khi memory utilization > 80%
  - Storage: Tăng 500GB khi free space < 20%

- **Horizontal Scaling:**
  - Thêm shard khi:
    - Data size > 500GB per shard
    - Write operations > 5000 ops/sec
    - Read operations > 10000 ops/sec

**Monitoring Thresholds:**

- CPU utilization > 70%: Warning
- CPU utilization > 85%: Critical
- Memory utilization > 80%: Warning
- Memory utilization > 90%: Critical
- Disk usage > 80%: Warning
- Disk usage > 90%: Critical
- Operation latency > 100ms: Warning
- Operation latency > 200ms: Critical

### **28.2. Application Services**

**ALM Query Service:**

- **Initial Setup:**

  - Replicas: 3
  - CPU: 1 core per pod
  - Memory: 1GB per pod
  - Max connections: 1000

- **Scaling Strategy:**
  - HPA based on:
    - CPU utilization > 70%
    - Memory utilization > 80%
    - Request rate > 100 req/sec
  - Max replicas: 10

**ALM Ingestion Service:**

- **Initial Setup:**

  - Replicas: 3
  - CPU: 1 core per pod
  - Memory: 1GB per pod
  - Max concurrent events: 1000

- **Scaling Strategy:**
  - HPA based on:
    - CPU utilization > 70%
    - Memory utilization > 80%
    - Queue length > 1000
  - Max replicas: 15

**ALM Cleaner Service:**

- **Initial Setup:**

  - Replicas: 2
  - CPU: 1 core per pod
  - Memory: 1GB per pod

- **Scaling Strategy:**
  - HPA based on:
    - CPU utilization > 70%
    - Memory utilization > 80%
    - Job execution time > 5 minutes
  - Max replicas: 5

## Tích hợp với các Bounded Context khác

### Cách gửi Audit Log Events đến ALM

Các BC khác có thể gửi audit log events đến ALM thông qua RabbitMQ. Dưới đây là hướng dẫn:

#### Cấu trúc Message

```typescript
// Ví dụ về cấu trúc message audit log
const auditLogEvent = {
  // ID sẽ được ALM tự tạo, không cần phải cung cấp
  // id: '...',  // KHÔNG YÊU CẦU

  // ID của sự kiện gốc (nếu có) - Bắt buộc
  eventId: "order-created-123",

  // Thời gian xảy ra - Bắt buộc
  timestamp: new Date().toISOString(),

  // Thông tin về người/hệ thống thực hiện hành động - Bắt buộc
  initiator: {
    type: "user", // hoặc 'system', 'service', 'scheduler', ...
    id: "user-123", // ID người dùng hoặc null nếu là system
    name: "Nguyễn Văn A", // Tên người dùng hoặc hệ thống
  },

  // Thông tin hành động - Bắt buộc
  action: "create", // Hành động thực hiện (create, update, delete, view, ...)

  // Thông tin về tài nguyên bị tác động - Bắt buộc
  resource: {
    type: "order", // Loại tài nguyên
    id: "order-123", // ID của tài nguyên
    name: "Đơn hàng #123", // Tên/mô tả của tài nguyên
  },

  // Tên bounded context - Bắt buộc để phân loại nguồn log
  boundedContext: "order-management",

  // ID của tenant (nếu có) - Quan trọng cho việc tìm kiếm và phân quyền
  tenantId: "tenant-456",

  // Ngữ cảnh bổ sung - Tùy chọn
  context: {
    ip: "192.168.1.1", // Địa chỉ IP
    userAgent: "Mozilla/5.0...", // User agent
    location: "HCM", // Vị trí
    // Các thông tin ngữ cảnh khác...
  },

  // Danh sách các thay đổi - Nên cung cấp cho các hành động update
  changes: [
    {
      field: "status", // Tên trường thay đổi
      oldValue: "pending", // Giá trị cũ
      newValue: "processing", // Giá trị mới
    },
    // Có thể có nhiều thay đổi...
  ],

  // Metadata bổ sung - Tùy chọn
  metadata: {
    source: "web-portal", // Nguồn tạo event
    correlationId: "abc-xyz-123", // ID liên kết giữa các hành động
    // Các metadata khác...
  },
};
```

#### Gửi Message đến RabbitMQ

```typescript
// Định nghĩa exchange và routing key
const exchangeName = "alm.events";
const routingKey = "audit.log.created"; // hoặc 'audit.log.{action}'

// Gửi event đến RabbitMQ
await channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(auditLogEvent)), { contentType: "application/json" });
```

#### Các Trường Quan Trọng cho Việc Tìm Kiếm

Để có thể tìm kiếm audit logs hiệu quả sau này, hãy đảm bảo các trường sau được cung cấp:

1. **eventId**: ID duy nhất của sự kiện gốc, có thể được sử dụng để tham chiếu chéo.
2. **tenantId**: Quan trọng cho việc phân quyền và lọc theo tenant.
3. **boundedContext**: Giúp phân loại logs theo BC nguồn.
4. **resource.id**: ID của tài nguyên bị tác động, cho phép tìm kiếm lịch sử của một tài nguyên cụ thể.
5. **metadata.correlationId**: Nếu cần theo dõi một chuỗi hành động liên quan.

#### Thực tiễn Tốt nhất

1. **Nhất quán**: Duy trì cấu trúc nhất quán của audit logs trong toàn bộ BC.
2. **Chi tiết vừa đủ**: Cung cấp đủ thông tin để hiểu được hành động nhưng không quá chi tiết.
3. **Bảo mật**: Không bao gồm thông tin nhạy cảm (mật khẩu, token, thông tin cá nhân) trong audit logs.
4. **Tối ưu kích thước**: Giữ kích thước message nhỏ gọn, đặc biệt là với các trường như `changes` có thể lớn.

#### Cấu hình trong Dự án

Để tích hợp với ALM, các BC cần cấu hình kết nối RabbitMQ tới exchange `alm.events` và publish messages với routing key phù hợp (thường là `audit.log.created` hoặc `audit.log.{action}`).

```typescript
// Ví dụ cấu hình trong NestJS module
@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        exchanges: [
          {
            name: "alm.events",
            type: "topic",
          },
        ],
        uri: configService.get<string>("RABBITMQ_URI", "amqp://localhost:5672"),
      }),
    }),
  ],
  // ...
})
export class YourBoundedContextModule {}
```
