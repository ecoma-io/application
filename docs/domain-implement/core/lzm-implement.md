# **Tài liệu Thiết kế Triển khai: Bounded Context Localization Management (LZM)**

## **1\. Giới thiệu**

Tài liệu này mô tả chi tiết thiết kế triển khai cho Bounded Context Localization Management (LZM) trong hệ thống Ecoma. LZM là một Bounded Context cốt lõi, chịu trách nhiệm quản lý, lưu trữ và cung cấp các bản dịch và nội dung bản địa hóa cho toàn bộ hệ thống. Tài liệu này tập trung vào các khía cạnh kỹ thuật triển khai riêng cho LZM, bao gồm cấu trúc service, công nghệ sử dụng cụ thể trong LZM, lưu trữ dữ liệu, giao tiếp đặc thù của LZM, hạ tầng, và các yêu cầu phi chức năng liên quan đến triển khai.

Mục tiêu của tài liệu này là cung cấp hướng dẫn chi tiết cho đội ngũ kỹ thuật để xây dựng, triển khai và vận hành Microservice(s) hiện thực hóa Bounded Context LZM, đảm bảo tuân thủ các nguyên tắc kiến trúc tổng thể của Ecoma (Microservices, DDD, EDA, CQRS, Clean Architecture) và đạt được các mục tiêu hệ thống (Tính sẵn sàng cao, Khả năng mở rộng, Hiệu năng, Bảo mật).

## **2\. Bối cảnh Kiến trúc Tổng thể**

Hệ thống Ecoma được xây dựng trên nền tảng kiến trúc Microservices, phân rã theo Bounded Contexts của DDD. Giao tiếp giữa các service backend chủ yếu sử dụng Event-Driven Architecture (EDA) và Request/Reply. Bên trong mỗi service, mô hình CQRS và Clean Architecture được áp dụng bắt buộc.

LZM là một Core Bounded Context, đóng vai trò là kho lưu trữ tập trung và đáng tin cậy cho tất cả các tài nguyên bản địa hóa. LZM nhận các yêu cầu quản lý bản dịch và cung cấp bản dịch thông qua Request/Reply, đồng thời lắng nghe các sự kiện từ RDM và phát sự kiện về thay đổi bản dịch.

## **3\. Mối quan hệ với Tài liệu Thiết kế Miền LZM**

Tài liệu này là phần tiếp theo của tài liệu **Thiết kế Miền LZM (lzm.md)**. Trong khi tài liệu Thiết kế Miền tập trung vào việc định nghĩa các khái niệm nghiệp vụ cốt lõi, Aggregate Root (TranslationSet), Entity (TranslationKey, Translation), Value Object (Locale, AuditLogQueryCriteria, RetentionPolicy, RetentionRule), Ngôn ngữ Chung, Use Cases, Domain Services và Application Services ở cấp độ logic và nghiệp vụ, tài liệu này đi sâu vào cách các định nghĩa đó được hiện thực hóa và triển khai về mặt kỹ thuật.

- **Domain Services và Application Services:** Vai trò và trách nhiệm của các loại service này đã được định nghĩa chi tiết trong tài liệu Thiết kế Miền LZM. Trong tài liệu triển khai này, chúng ta xem xét cách các service kỹ thuật (LZM Command Service, LZM Query Service, LZM Import/Export Service, LZM Background Worker) sẽ chứa và tổ chức các Domain Services và Application Services tương ứng theo mô hình Clean Architecture và CQRS. Chi tiết về từng Domain Service hoặc Application Service cụ thể (tên, phương thức, logic) sẽ không được lặp lại ở đây mà được tham chiếu đến tài liệu Thiết kế Miền.
- **Domain Events:** Các Domain Event mà LZM phát ra hoặc xử lý đã được xác định trong tài liệu Thiết kế Miền LZM, bao gồm mục đích và payload dự kiến. Tài liệu triển khai này mô tả cách các event đó được truyền tải vật lý trong hệ thống (sử dụng RabbitMQ) và cách các service lắng nghe/phát event. Chi tiết về từng loại Domain Event cụ thể sẽ không được lặp lại ở đây mà được tham chiếu đến tài liệu Thiết kế Miền.

## **4\. Cấu trúc thư mục monorepo**

Cấu trúc thư mục của LZM trong monorepo Ecoma sẽ tuân thủ mô hình đã định nghĩa, với sự phân chia rõ ràng giữa các microservices và thư viện:

```
ecoma-monorepo/
├── apps/
│   ├── services/
│   │   ├── lzm-command/                // LZM Command Service
│   │   │   ├── src/
│   │   │   │   ├── main.ts             // Điểm khởi đầu của service
│   │   │   │   ├── app.module.ts       // Module gốc của NestJS
│   │   │   │   ├── health/             // Health check endpoints
│   │   │   │   ├── config/             // Cấu hình đặc thù cho service
│   │   │   │   └── ...
│   │   │   └── Dockerfile
│   │   ├── lzm-query/                  // LZM Query Service
│   │   │   ├── src/
│   │   │   │   ├── main.ts
│   │   │   │   ├── app.module.ts
│   │   │   │   ├── health/
│   │   │   │   ├── config/
│   │   │   │   └── ...
│   │   │   └── Dockerfile
│   │   └── lzm-import-export/          // LZM Import/Export Service
│   │       ├── src/
│   │       │   ├── main.ts
│   │       │   ├── app.module.ts
│   │       │   ├── health/
│   │       │   ├── config/
│   │       │   └── ...
│   │       └── Dockerfile
│   └── workers/
│       └── lzm-background/             // LZM Background Worker
│           ├── src/
│           │   ├── main.ts
│           │   ├── app.module.ts
│           │   ├── health/
│           │   ├── config/
│           │   └── ...
│           └── Dockerfile
└── libs/
    └── domains/
        └── lzm/
            ├── lzm-domain/             // Domain Layer
            │   └── src/
            │       ├── lib/
            │       │   ├── aggregates/  // Aggregate Roots
            │       │   ├── entities/    // Entities
            │       │   ├── value-objects/ // Value Objects
            │       │   ├── domain-events/ // Domain Events
            │       │   ├── domain-services/ // Domain Services
            │       │   └── exceptions/  // Domain Exceptions
            │       └── index.ts
            ├── lzm-application/        // Application Layer
            │   └── src/
            │       ├── lib/
            │       │   ├── use-cases/   // Use Cases (Command/Query handlers)
            │       │   ├── interfaces/  // Ports/Interfaces
            │       │   └── dtos/       // DTOs
            │       └── index.ts
            └── lzm-infrastructure/     // Infrastructure Layer
                └── src/
                    ├── lib/
                    │   ├── persistence/  // Repository implementations
                    │   ├── message-broker/ // Message broker adapters
                    │   ├── external-services/ // External service clients
                    │   └── models/     // Infrastructure-specific models
                    └── index.ts
```

## **5\. Đơn vị Triển khai (Deployment Units)**

Dựa trên mô hình CQRS bắt buộc và tính chất nghiệp vụ của LZM, LZM được triển khai thành các đơn vị Microservice/Worker riêng biệt sau:

1. **LZM Command Service:**
   - **Trách nhiệm:** Xử lý các yêu cầu thay đổi trạng thái (Commands) liên quan đến quản lý Translation Set, Translation Key, Translation (tạo, cập nhật, xóa). Xử lý các luồng nghiệp vụ như thay đổi trạng thái bản dịch.
   - **Mô hình:** Write Model của CQRS. Chứa các Application Services và Domain Services liên quan đến quản lý dữ liệu bản dịch. Phát ra Domain Events.
   - **Yêu cầu:** Đảm bảo tính toàn vẹn dữ liệu khi ghi. Cần xử lý logic nghiệp vụ phức tạp (vòng đời trạng thái bản dịch, tính duy nhất của khóa).
   - **Giao tiếp:** Nhận Command thông qua cơ chế Request/Reply của hệ thống (sử dụng NATS) từ API Gateway/Admin UI/TMS hoặc các service backend khác. Phát Domain Events thông qua cơ chế Eventing của hệ thống (sử dụng RabbitMQ). Gọi ALM (qua Request/Reply hoặc Event) để ghi log audit.

2. **LZM Query Service:**
   - **Trách nhiệm:** Xử lý tất cả các yêu cầu truy vấn (Queries) thông tin về bản dịch từ các Bounded Context khác, giao diện người dùng, Admin UI/TMS. Cung cấp khả năng tìm kiếm, lọc, sắp xếp và phân trang cho dữ liệu quản lý (Sets, Keys, Translations) và đặc biệt là cung cấp bản dịch theo Khóa/Locale với hiệu năng cao.
   - **Mô hình:** Read Model của CQRS. Chứa các Application Services và Domain Services liên quan đến truy vấn dữ liệu bản dịch.
   - **Yêu cầu:** Hiệu năng rất cao, độ trễ thấp cho các yêu cầu truy vấn bản dịch content từ các Feature BC. Cần hỗ trợ truy vấn nhanh bản dịch theo Khóa/Locale/Set, có áp dụng logic fallback và xử lý bản dịch phức tạp.
   - **Giao tiếp:** Nhận Query thông qua cơ chế Request/Reply của hệ thống (sử dụng NATS) từ API Gateway hoặc các service/hệ thống khác. Truy vấn dữ liệu từ Database của LZM. Có thể sử dụng Cache (Redis) để tăng tốc độ đọc. Gọi RDM (qua Request/Reply) để lấy thông tin Source Language và kiểm tra Locale hợp lệ.

3. **LZM Import/Export Service:**
   - **Trách nhiệm:** Xử lý các tác vụ liên quan đến việc nhập (Import) và xuất (Export) dữ liệu bản dịch hàng loạt.
   - **Mô hình:** Xử lý tác vụ nền bất đồng bộ. Chứa các Application Services và Domain Services liên quan đến nhập/xuất dữ liệu.
   - **Yêu cầu:** Độ tin cậy cao cho việc xử lý file/volume dữ liệu lớn. Cần xử lý lỗi trong quá trình nhập và báo cáo kết quả.
   - **Giao tiếp:** Nhận Command (qua Command Queue hoặc Request/Reply từ Admin UI/TMS) để bắt đầu tác vụ. Tương tác với Database của LZM. Có thể phát sự kiện TranslationImportCompleted, TranslationImportFailed, TranslationExportCompleted. Gọi ALM (qua Request/Reply hoặc Event) để ghi log audit.

4. **LZM Background Worker:**
   - **Trách nhiệm:** Lắng nghe và xử lý các Domain Event từ RDM (ví dụ: ReferenceDataSetUpdated, ReferenceDataItemUpdated) để cập nhật thông tin về các Locale được hỗ trợ hoặc Ngôn ngữ Gốc trong LZM. Có thể chạy các tác vụ định kỳ khác nếu cần (ví dụ: kiểm tra tính nhất quán dữ liệu nội bộ).
   - **Mô hình:** Xử lý tác vụ nền bất đồng bộ, Event Consumer, Scheduled Tasks.
   - **Yêu cầu:** Độ tin cậy cao cho việc xử lý event từ RDM.
   - **Giao tiếp:** Lắng nghe Domain Events từ Message Broker (RabbitMQ). Tương tác với Database của LZM để cập nhật dữ liệu nội bộ.

## **6\. Nền tảng Công nghệ Cụ thể cho LZM**

LZM sẽ sử dụng nền tảng công nghệ chung của hệ thống Ecoma, với lựa chọn cụ thể cho lưu trữ dữ liệu và caching:

- **Cơ sở dữ liệu Chính:** PostgreSQL (Sử dụng TypeORM) \- Phù hợp cho dữ liệu có cấu trúc quan hệ chặt chẽ như Translation Set, Translation Key, Translation. Cần sử dụng các tính năng như JSONB để lưu trữ nội dung bản dịch phức tạp (với cú pháp ICU MessageFormat) và Indexing (đặc biệt trên Key, Locale, Set ID) để tối ưu hóa hiệu năng truy vấn.
- **Cache/Tạm thời:** Redis \- Sử dụng cho caching dữ liệu bản dịch thường xuyên được truy vấn trong LZM Query Service để giảm tải cho DB và cải thiện hiệu năng đọc. Cache key có thể dựa trên Khóa Bản dịch và Locale.
- **Thư viện Bản địa hóa:** Sử dụng các thư viện hỗ trợ xử lý bản dịch phức tạp như ICU MessageFormat (ví dụ: formatjs trong Node.js/TypeScript) để parse và render nội dung bản dịch có biến số, số nhiều, ngữ cảnh.

## **7\. Lưu trữ Dữ liệu (Data Storage)**

LZM sẽ sở hữu cơ sở dữ liệu riêng (PostgreSQL), tách biệt với các BC khác. Redis được sử dụng làm lớp cache hiệu năng cao.

### **7.1. Schema PostgreSQL (Write Model & Primary Read Model)**

Thiết kế schema cho PostgreSQL để lưu trữ các Aggregate Root và Entity chính của LZM.

**Bảng translation_sets:**

- id UUID PRIMARY KEY
- name VARCHAR(255) NOT NULL UNIQUE
- description TEXT
- is_active BOOLEAN NOT NULL DEFAULT TRUE
- created_at TIMESTAMP WITH TIME ZONE NOT NULL
- updated_at TIMESTAMP WITH TIME ZONE NOT NULL

**Bảng translation_keys:** (Thuộc translation_sets)

- id UUID PRIMARY KEY
- set_id UUID NOT NULL, FOREIGN KEY translation_sets(id) ON DELETE CASCADE
- key VARCHAR(500) NOT NULL \-- Chuỗi định danh duy nhất của khóa
- description TEXT \-- Mô tả ngữ cảnh
- source_content TEXT NOT NULL \-- Nội dung gốc (Ngôn ngữ Gốc)
- status VARCHAR(50) NOT NULL DEFAULT 'NeedsTranslation' \-- Trạng thái chung của khóa
- created_at TIMESTAMP WITH TIME ZONE NOT NULL
- updated_at TIMESTAMP WITH TIME ZONE NOT NULL
- UNIQUE (set_id, key) \-- Đảm bảo key duy nhất trong một set (hoặc UNIQUE (key) nếu TranslationKey là AR)

**Bảng translations:** (Thuộc translation_keys)

- id UUID PRIMARY KEY
- key_id UUID NOT NULL, FOREIGN KEY translation_keys(id) ON DELETE CASCADE
- locale VARCHAR(10) NOT NULL \-- Mã locale (ví dụ: 'vi-VN')
- content TEXT NOT NULL \-- Nội dung bản dịch (có thể chứa cú pháp ICU MessageFormat)
- status VARCHAR(50) NOT NULL DEFAULT 'Draft' \-- Trạng thái của bản dịch cụ thể
- translated_by_user_id UUID \-- Optional, ID người dịch (từ IAM)
- last_updated_at TIMESTAMP WITH TIME ZONE NOT NULL
- created_at TIMESTAMP WITH TIME ZONE NOT NULL
- UNIQUE (key_id, locale) \-- Đảm bảo chỉ có một bản dịch cho mỗi key/locale

**Bảng import_export_logs:** (Lưu trữ lịch sử các tác vụ nhập/xuất)

- id UUID PRIMARY KEY
- type VARCHAR(50) NOT NULL \-- 'Import' or 'Export'
- status VARCHAR(50) NOT NULL \-- 'Pending', 'Processing', 'Completed', 'Failed'
- initiated_by_user_id UUID \-- Optional, ID người dùng kích hoạt
- file_name VARCHAR(255) \-- Optional, tên file
- error_details TEXT \-- Optional, chi tiết lỗi
- processed_records INTEGER DEFAULT 0
- successful_records INTEGER DEFAULT 0
- failed_records INTEGER DEFAULT 0
- started_at TIMESTAMP WITH TIME ZONE NOT NULL
- completed_at TIMESTAMP WITH TIME ZONE \-- Optional

**Chỉ mục (Indexes):**

- CREATE UNIQUE INDEX idx_translation_sets_name ON translation_sets (name);
- CREATE UNIQUE INDEX idx_translation_keys_set_key ON translation_keys (set_id, key);
- CREATE INDEX idx_translation_keys_key ON translation_keys (key); \-- Nếu TranslationKey là AR, chỉ mục này quan trọng hơn
- CREATE INDEX idx_translation_keys_set ON translation_keys (set_id); \-- Nếu TranslationKey là Entity
- CREATE UNIQUE INDEX idx_translations_key_locale ON translations (key_id, locale);
- CREATE INDEX idx_translations_locale_status ON translations (locale, status);
- CREATE INDEX idx_import_export_logs_type_status ON import_export_logs (type, status);
- CREATE INDEX idx_import_export_logs_initiated_by ON import_export_logs (initiated_by_user_id);

### **7.2. Cấu trúc Cache Redis (Read Model Cache)**

Redis sẽ được sử dụng làm lớp cache cho LZM Query Service để lưu trữ nội dung bản dịch thường xuyên được truy vấn, đặc biệt cho các yêu cầu từ các Feature BC.

**Chiến lược Key:**

Cache nội dung bản dịch theo Khóa Bản dịch và Locale.

- lzm:translation:\<key\>:\<locale\>

**Chiến lược Value:**

Lưu trữ nội dung bản dịch đã sẵn sàng sử dụng (trạng thái "Approved") dưới dạng chuỗi văn bản (hoặc JSON nếu cần lưu trữ thêm metadata cho rendering phức tạp).

**Chiến lược Cache Invalidation:**

Khi có bất kỳ thay đổi nào đối với một bản dịch cụ thể (nội dung hoặc trạng thái chuyển sang "Approved") trong LZM Command Service:

- Phát sự kiện TranslationUpdated hoặc TranslationStatusChanged.
- LZM Query Service (hoặc một Worker riêng) lắng nghe các sự kiện này và invalidation cache key tương ứng (lzm:translation:\<key\>:\<locale\>).
- Khi Khóa Bản dịch gốc (SourceContent) thay đổi (TranslationKeyUpdated), cần invalidation cache cho tất cả các Locale của Khóa đó.
- TTL (Time To Live) cho các key cache có thể được cấu hình như lớp bảo vệ dự phòng.

## **8\. Giao tiếp và Tích hợp**

LZM tương tác với các BC khác chủ yếu qua Request/Reply (nhận Commands/Queries, gọi RDM/IAM/ALM) và Eventing (lắng nghe RDM, phát Event LZM).

- **Nhận Commands/Queries:**
  - LZM Command Service nhận Commands (tạo/cập nhật/xóa Set, Key, Translation, thay đổi Status) qua Request/Reply (từ API Gateway/Admin UI/TMS).
  - LZM Query Service nhận Queries (lấy bản dịch theo Key/Locale/Set, list Sets/Keys/Translations) qua Request/Reply (từ API Gateway/Admin UI/TMS hoặc các BC khác).
  - LZM Import/Export Service có thể nhận Commands (kích hoạt Import/Export) qua Request/Reply hoặc Command Queue.
- **Phát Domain Events:**
  - LZM Command Service phát các Domain Event (TranslationSetCreated, TranslationKeyUpdated, TranslationUpdated, TranslationStatusChanged, v.v.) đến Message Broker (RabbitMQ) để các BC khác quan tâm (ví dụ: các BC cache bản dịch cục bộ) có thể tiêu thụ.
  - LZM Import/Export Service phát các Event (TranslationImportCompleted, TranslationImportFailed, TranslationExportCompleted).
  - LZM Command Service và LZM Import/Export Service gọi ALM (qua Request/Reply hoặc Event) để ghi log audit.
- **Lắng nghe Domain Events:**
  - LZM Background Worker lắng nghe các Domain Event từ RDM (ReferenceDataSetUpdated, ReferenceDataItemUpdated) để cập nhật thông tin Locale và Ngôn ngữ Gốc.
- **Tương tác với RDM:**
  - LZM Query Service và LZM Command Service gọi RDM (qua Request/Reply) để lấy danh sách Locale được hỗ trợ và Ngôn ngữ Gốc của hệ thống.
- **Tương tác với IAM:**
  - LZM Command Service và LZM Query Service gọi IAM (qua Request/Reply) để kiểm tra ủy quyền cho các thao tác quản lý và truy vấn dữ liệu (đặc biệt là truy vấn dữ liệu quản lý hoặc truy vấn log nhập/xuất).
- **Tương tác với ALM:**
  - LZM Command Service và LZM Import/Export Service gọi ALM (qua Request/Reply hoặc Event) để ghi lại các hành động quản lý bản dịch quan trọng.

## **9\. Định nghĩa API Endpoint và Mapping Use Case**

Phần này phác thảo các API Endpoint chính mà LZM cung cấp thông qua API Gateway (đối với các tương tác từ bên ngoài hệ thống) và mapping chúng với các Use Case đã định nghĩa trong tài liệu Thiết kế Miền LZM.

| API Endpoint (Ví dụ)                              | Phương thức HTTP | Mô tả Chức năng Cấp cao                                                           | Use Case Liên quan (lzm.md)                                  | Loại Yêu cầu Nội bộ (CQRS) | Service Xử lý                        |
| :------------------------------------------------ | :--------------- | :-------------------------------------------------------------------------------- | :----------------------------------------------------------- | :------------------------- | :----------------------------------- |
| /api/v1/lzm/translation-sets                      | GET              | Lấy danh sách các tập bản dịch.                                                   | Quản lý Tập Bản dịch (7.1.1)                                 | Query                      | LZM Query Service                    |
| /api/v1/lzm/translation-sets                      | POST             | Tạo tập bản dịch mới.                                                             | Quản lý Tập Bản dịch (7.1.1)                                 | Command                    | LZM Command Service                  |
| /api/v1/lzm/translation-sets/{setId}              | PUT              | Cập nhật tập bản dịch.                                                            | Quản lý Tập Bản dịch (7.1.1)                                 | Command                    | LZM Command Service                  |
| /api/v1/lzm/translation-sets/{setId}              | DELETE           | Xóa tập bản dịch.                                                                 | Quản lý Tập Bản dịch (7.1.1)                                 | Command                    | LZM Command Service                  |
| /api/v1/lzm/translation-sets/{setId}/keys         | GET              | Lấy danh sách khóa bản dịch trong một tập.                                        | Quản lý Khóa Bản dịch (7.1.2)                                | Query                      | LZM Query Service                    |
| /api/v1/lzm/translation-keys                      | GET              | Lấy danh sách khóa bản dịch (toàn bộ hoặc theo filter).                           | Quản lý Khóa Bản dịch (7.1.2)                                | Query                      | LZM Query Service                    |
| /api/v1/lzm/translation-keys                      | POST             | Tạo khóa bản dịch mới.                                                            | Quản lý Khóa Bản dịch (7.1.2)                                | Command                    | LZM Command Service                  |
| /api/v1/lzm/translation-keys/{keyId}              | PUT              | Cập nhật khóa bản dịch (nội dung gốc, mô tả).                                     | Quản lý Khóa Bản dịch (7.1.2)                                | Command                    | LZM Command Service                  |
| /api/v1/lzm/translation-keys/{keyId}              | DELETE           | Xóa khóa bản dịch.                                                                | Quản lý Khóa Bản dịch (7.1.2)                                | Command                    | LZM Command Service                  |
| /api/v1/lzm/translation-keys/{keyId}/translations | GET              | Lấy danh sách bản dịch cho một khóa.                                              | Quản lý Bản dịch và Trạng thái (7.1.3)                       | Query                      | LZM Query Service                    |
| /api/v1/lzm/translation-keys/{keyId}/translations | POST             | Thêm bản dịch mới cho một khóa ở một locale.                                      | Quản lý Bản dịch và Trạng thái (7.1.3)                       | Command                    | LZM Command Service                  |
| /api/v1/lzm/translations/{translationId}          | PUT              | Cập nhật nội dung bản dịch hoặc trạng thái.                                       | Quản lý Bản dịch và Trạng thái (7.1.3)                       | Command                    | LZM Command Service                  |
| /api/v1/lzm/translations/{translationId}          | DELETE           | Xóa bản dịch.                                                                     | Quản lý Bản dịch và Trạng thái (7.1.3)                       | Command                    | LZM Command Service                  |
| /api/v1/lzm/translations/query                    | POST             | Truy vấn bản dịch theo danh sách khóa và locale (API hiệu năng cao cho BC khác).  | Truy vấn Bản dịch theo Khóa và Locale (7.2.1)                | Query                      | LZM Query Service                    |
| /api/v1/lzm/import                                | POST             | Kích hoạt tác vụ nhập dữ liệu bản dịch hàng loạt.                                 | Nhập Dữ liệu Bản dịch (7.3.1)                                | Command                    | LZM Import/Export Service             |
| /api/v1/lzm/export                                | POST             | Kích hoạt tác vụ xuất dữ liệu bản dịch hàng loạt.                                 | Xuất Dữ liệu Bản dịch (7.3.2)                                | Command                    | LZM Import/Export Service             |
| /api/v1/lzm/import-export-logs                    | GET              | Lấy lịch sử các tác vụ nhập/xuất.                                                 | Nhập Dữ liệu Bản dịch (7.3.1), Xuất Dữ liệu Bản dịch (7.3.2) | Query                      | LZM Query Service                    |
| /api/v1/internal/lzm/rdm-event                    | POST             | Endpoint nội bộ để nhận Event từ RDM (có thể dùng thay Event Consumer trực tiếp). | Lắng nghe Domain Events (từ RDM)                             | Command                    | LZM Background Worker (Internal API) |

_Lưu ý: Đây là các endpoint ví dụ. Tên và cấu trúc cụ thể có thể được tinh chỉnh trong quá trình thiết kế kỹ thuật chi tiết. Các endpoint /api/v1/internal/... là các endpoint nội bộ, không được public ra ngoài qua API Gateway thông thường._

## **10\. Chiến lược Xử lý Lỗi (Error Handling Strategy)**

Chiến lược xử lý lỗi trong LZM sẽ tuân thủ mô hình chung của Ecoma và phân biệt giữa các loại lỗi, kênh giao tiếp:

- **Lỗi Nghiệp vụ (Business Rule Exceptions):** Các lỗi phát sinh do vi phạm quy tắc nghiệp vụ (ví dụ: khóa bản dịch đã tồn tại trong set, chuyển trạng thái bản dịch không hợp lệ, locale không được hỗ trợ) sẽ được ném ra từ Domain Services và bắt ở lớp Application Service hoặc lớp xử lý Command/Query/Task.
  - **Đối với giao tiếp Request/Reply (Command/Query API):** Lỗi nghiệp vụ sẽ được chuyển đổi thành phản hồi lỗi có cấu trúc (JSON object) bao gồm mã lỗi và thông báo chi tiết, được trả về cho bên gọi (HTTP status code 400 Bad Request). Lỗi ủy quyền (sau khi gọi IAM) trả về 403 Forbidden.
  - **Đối với giao tiếp qua Message Broker (Event Consumer \- LZM Background Worker):** Lỗi nghiệp vụ xảy ra trong quá trình xử lý event từ RDM sẽ được ghi log chi tiết. Event không xử lý được do lỗi nghiệp vụ có thể được chuyển vào DLQ.
  - **Đối với Task (Import/Export Service):** Lỗi nghiệp vụ trong quá trình nhập dữ liệu (ví dụ: dòng dữ liệu không hợp lệ) sẽ được ghi log chi tiết, bỏ qua bản ghi lỗi và tiếp tục xử lý (nếu có thể), và báo cáo số lượng lỗi trong Import/Export Log. Nếu lỗi nghiêm trọng không thể tiếp tục, đánh dấu tác vụ là Failed. Phát Event TranslationImportFailed.
- **Lỗi Kỹ thuật (Technical Errors):** Các lỗi phát sinh ở lớp Infrastructure (ví dụ: lỗi kết nối DB, lỗi kết nối Message Broker, lỗi cache Redis, lỗi gọi RDM/IAM/ALM API).
  - Các lỗi này cần được ghi log chi tiết (Structured Logging) với mức độ phù hợp (ERROR), bao gồm stack trace và các thông tin tương quan.
  - Đối với giao tiếp Request/Reply: Lỗi kỹ thuật sẽ được chuyển đổi thành phản hồi lỗi chung (HTTP status code 500 Internal Server Error), ghi log chi tiết ở phía server.
  - Đối với giao tiếp qua Message Broker (Event Consumer): Lỗi kỹ thuật sẽ được xử lý theo cơ chế retry của RabbitMQ. Nếu retry vẫn thất bại, message sẽ được chuyển vào DLQ.
  - Đối với Task (Import/Export Service): Lỗi kỹ thuật sẽ được ghi log chi tiết. Tác vụ có thể được cấu hình để retry hoặc đánh dấu là Failed.
- **Lỗi Validate Input:** Đối với các yêu cầu nhận được qua API Endpoint, lỗi validate input sẽ được xử lý ở lớp Application Service hoặc Controller trước khi tạo Command/Query. Phản hồi lỗi sử dụng HTTP status code 400 Bad Request với thông báo chi tiết.
- **Thông báo Lỗi:** Các lỗi quan trọng (lỗi kết nối DB kéo dài, lỗi xử lý Command/Query quan trọng, lỗi xử lý Event từ RDM liên tục, lỗi tác vụ Import/Export thất bại) cần kích hoạt cảnh báo thông qua hệ thống giám sát.

## **11\. Khả năng Phục hồi (Resiliency)**

Để đảm bảo LZM chịu lỗi và phục hồi khi các phụ thuộc gặp sự cố và xử lý volume dữ liệu/request lớn:

- **Timeouts và Retries:** Cấu hình timeouts và retry policies cho các cuộc gọi đi đến các phụ thuộc (PostgreSQL, Redis, NATS, RabbitMQ, RDM API, IAM API, ALM API). Quan trọng với việc gọi RDM (để lấy Locale/Source Language) và IAM (cho Authorization) vì chúng là phụ thuộc đồng bộ của Query/Command Service.
- **Circuit Breaker:** Áp dụng mẫu Circuit Breaker cho các cuộc gọi đến các phụ thuộc có khả năng gặp sự cố tạm thời (ví dụ: gọi RDM API, IAM API).
- **Bulkhead:** Sử dụng Bulkhead để cô lập tài nguyên giữa các đơn vị triển khai của LZM (Command Service, Query Service, Workers). Trong Query Service, có thể cô lập tài nguyên cho truy vấn bản dịch hiệu năng cao so với truy vấn dữ liệu quản lý.
- **Health Checks:** Triển khai các loại Health Check Probe trong Kubernetes cho mỗi service/worker LZM:
  - **Startup Probe:** Kiểm tra xem ứng dụng đã khởi động hoàn toàn (kết nối đến DB, Message Broker, Cache đã sẵn sàng).
  - **Liveness Probe:** Kiểm tra xem ứng dụng có đang chạy và khỏe mạnh không. Kiểm tra vòng lặp xử lý message/request/task.
  - **Readiness Probe:** Kiểm tra xem ứng dụng đã sẵn sàng xử lý request/message chưa. Kiểm tra kết nối đến **PostgreSQL** (nguồn dữ liệu chính), **Redis** (lớp cache quan trọng cho Query Service), **Message Broker** (đối với Command Service và Workers), và khả năng kết nối đến **RDM API** và **IAM API** (đối với Command/Query Service).
- **Idempotency:** Thiết kế Command Handlers (ví dụ: tạo/cập nhật bản dịch) và Event Handlers (từ RDM) có tính Idempotent nếu có thể, để việc xử lý lặp lại không gây ra kết quả không mong muốn. Đối với Import, cần có cơ chế xử lý các bản ghi trùng lặp trong file nhập.
- **Queue Monitoring:** Giám sát độ dài hàng đợi (Queue Length) của RabbitMQ cho các queue mà LZM Background Worker và LZM Import/Export Service lắng nghe.

## **12\. Chiến lược Kiểm thử (Testing Strategy)**

Chiến lược kiểm thử cho LZM sẽ tuân thủ mô hình chung của Ecoma:

- **Unit Tests:** Kiểm thử logic nghiệp vụ cốt lõi trong Domain Model (ví dụ: logic vòng đời trạng thái bản dịch, logic fallback trong TranslationService, logic xử lý bản dịch phức tạp), logic xử lý trong Application Services (ví dụ: mapping Command/Query sang Domain Service call) một cách độc lập (sử dụng mock cho Repository, Gateway, Broker, RDM/IAM client).
- **Integration Tests:** Kiểm thử sự tương tác giữa các thành phần nội bộ của từng service/worker (ví dụ: Command Service xử lý Command và gọi Repository để ghi vào DB thực hoặc Testcontainers; Query Service nhận Query, gọi RDM/IAM mock/testcontainer, gọi Repository để truy vấn DB thực; Background Worker xử lý Event từ RDM mock/testcontainer và gọi Repository).
- **End-to-End Tests (E2E Tests):** Kiểm thử luồng nghiệp vụ hoàn chỉnh xuyên qua các service (ví dụ: tạo Translation Key/Translation qua Admin UI/TMS \-\> LZM Command Service xử lý và phát Event \-\> Cache trong LZM Query Service được invalidation \-\> các BC khác có thể truy vấn bản dịch mới nhất từ LZM Query Service). Kiểm thử luồng Import/Export. Kiểm thử luồng lắng nghe Event từ RDM.
- **Contract Tests:** Đảm bảo schema của các Domain Event mà LZM phát ra và lắng nghe tuân thủ "hợp đồng" với các BC khác. Đảm bảo API Endpoint của LZM Query/Command Service tuân thủ "hợp đồng" với các Consumer (sử dụng OpenAPI spec).
- **Component Tests:** Kiểm thử từng service/worker LZM (Command Service, Query Service, Import/Export Service, Background Worker) trong môi trường gần với production, với các phụ thuộc (DB, Redis, Message Broker, RDM, IAM) được giả lập hoặc sử dụng Testcontainers.
- **Performance/Load Tests:** Kiểm thử tải để xác minh LZM Query Service có thể đáp ứng yêu cầu hiệu năng cao cho luồng truy vấn bản dịch và LZM Command Service/Import/Export Service có thể xử lý lượng Commands/tác vụ dự kiến.

## **13\. Chiến lược Di chuyển Dữ liệu (Data Migration Strategy)**

Quản lý thay đổi schema database PostgreSQL của LZM cần được thực hiện cẩn thận:

- Sử dụng công cụ quản lý migration schema tự động (ví dụ: Flyway hoặc Liquibase).
- Thiết kế các migration có tính **Backward Compatibility** (chỉ thêm, không xóa/sửa đổi các cột/bảng quan trọng).
- Lập kế hoạch **rollback** cho các migration.
- Đối với các thay đổi dữ liệu phức tạp (ví dụ: chuẩn hóa nội dung bản dịch, cập nhật trạng thái hàng loạt), viết **Data Migration Script** riêng biệt.
- Đảm bảo có bản sao lưu (backup) dữ liệu trước khi thực hiện các migration quan trọng.

## **14\. Phụ thuộc (Dependencies)**

- **Phụ thuộc Nội bộ (Internal Dependencies):**
  - Các BC khác (Feature BCs, NDM, v.v.) là Consumer của LZM Query Service.
  - Admin UI/TMS là Consumer của LZM Command Service và LZM Query Service, và Producer của Commands cho LZM Import/Export Service.
  - RDM là nhà cung cấp dữ liệu Locale và Ngôn ngữ Gốc cho LZM Query Service và LZM Background Worker.
  - IAM là nhà cung cấp dịch vụ ủy quyền cho LZM Command Service và LZM Query Service.
  - ALM là Consumer của các sự kiện audit log từ LZM Command Service và LZM Import/Export Service.
  - LZM Import/Export Service có thể gọi LZM Command Service nội bộ để ghi dữ liệu sau khi xử lý file nhập.
- **Phụ thuộc Bên ngoài (External Dependencies):**
  - Database (PostgreSQL, Redis).
  - Message Brokers (NATS, RabbitMQ).
  - Container Registry.
  - Kubernetes API.
  - External Translation Management System (TMS) hoặc công cụ dịch thuật (tương tác qua Import/Export hoặc API).

## **15\. Kết luận**

Tài liệu thiết kế triển khai cho Bounded Context Localization Management (LZM) đã được xây dựng dựa trên tài liệu thiết kế miền LZM và tuân thủ chặt chẽ kiến trúc Microservices, CQRS và Clean Architecture của hệ thống Ecoma. Việc phân tách LZM thành các đơn vị triển khai riêng biệt (Command Service, Query Service, Import/Export Service, Background Worker) là cần thiết để đáp ứng yêu cầu về hiệu năng cao cho luồng truy vấn bản dịch, quản lý dữ liệu, xử lý tác vụ nền và lắng nghe sự kiện. Việc sử dụng PostgreSQL với các tối ưu hóa (JSONB, Indexing) và Redis cho cache được lựa chọn để đảm bảo tính toàn vẹn, hiệu năng và khả năng mở rộng cần thiết. Các khía cạnh quan trọng về giao tiếp (Request/Reply, Eventing), xử lý lỗi, khả năng phục hồi, kiểm thử và vận hành đã được đề cập, phác thảo các chiến lược và yêu cầu kỹ thuật.

Tài liệu này cung cấp nền tảng vững chắc cho đội ngũ kỹ thuật để tiến hành thiết kế kỹ thuật chi tiết hơn (ví dụ: chi tiết implementation của Domain/Application Service, cấu trúc Command/Query/Event payload chi tiết) và bắt đầu quá trình triển khai thực tế Microservice(s) LZM, đảm bảo tuân thủ các nguyên tắc và mục tiêu kiến trúc của hệ thống Ecoma.

## **16\. Health Checks**

Mỗi service và worker trong LZM phải triển khai các endpoint health check để hỗ trợ giám sát, kiểm tra sẵn sàng và tự động khôi phục. Các loại health check bao gồm:

### **16.1. Health Check Endpoints**

Mỗi microservice trong LZM (Command, Query, Import/Export, Background Worker) sẽ triển khai ba endpoint health check:

1. **Liveness Probe (`/health/live`):** Kiểm tra xem ứng dụng có đang chạy và phản hồi không. Nếu faulty, Kubernetes sẽ khởi động lại container.
   - Kiểm tra: Ứng dụng đang chạy và có thể phản hồi HTTP request.

2. **Readiness Probe (`/health/ready`):** Kiểm tra xem ứng dụng có sẵn sàng nhận traffic không. Nếu không sẵn sàng, Kubernetes sẽ ngừng gửi traffic đến pod này.
   - Kiểm tra: Kết nối đến cơ sở dữ liệu PostgreSQL, Redis cache, message broker (RabbitMQ, NATS), và các phụ thuộc khác như RDM, IAM.

3. **Startup Probe (`/health/startup`):** Kiểm tra xem ứng dụng đã khởi động thành công chưa trước khi bắt đầu kiểm tra liveness và readiness.
   - Kiểm tra: Ứng dụng đã khởi động và cấu hình đã được tải thành công.

### **16.2. Chiến lược Kiểm tra**

- **LZM Command Service:**
  - **Liveness:** Kiểm tra khả năng phục vụ HTTP request.
  - **Readiness:** Kiểm tra kết nối tới PostgreSQL, RabbitMQ (để phát event), NATS (để nhận command), và ALM (cho audit logging).
  
- **LZM Query Service:**
  - **Liveness:** Kiểm tra khả năng phục vụ HTTP request.
  - **Readiness:** Kiểm tra kết nối tới PostgreSQL, Redis cache, NATS (để nhận query), và RDM (cho các query locale).

- **LZM Import/Export Service:**
  - **Liveness:** Kiểm tra khả năng phục vụ HTTP request và tình trạng hoạt động của workers.
  - **Readiness:** Kiểm tra kết nối tới PostgreSQL, RabbitMQ (để phát event), NATS (để nhận command).

- **LZM Background Worker:**
  - **Liveness:** Kiểm tra khả năng xử lý event.
  - **Readiness:** Kiểm tra kết nối tới PostgreSQL, RabbitMQ (để nhận/phát event).

### **16.3. Cấu hình trong Kubernetes**

Các health check được cấu hình trong Kubernetes Deployment yaml để tự động hóa kiểm tra sức khỏe và khôi phục:

```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 30
readinessProbe:
  httpGet:
    path: /health/ready
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10
startupProbe:
  httpGet:
    path: /health/startup
    port: 3000
  failureThreshold: 30
  periodSeconds: 10
```

## **17\. Giám sát và Alert**

### **17.1. Metrics**

LZM triển khai việc thu thập metrics để giám sát hiệu năng và tình trạng hoạt động của các microservice:

1. **Metrics Hệ thống:**
   - CPU, Memory, Disk usage
   - JVM metrics (nếu sử dụng)
   - Connection pool stats (DB, Redis)

2. **Metrics Nghiệp vụ:**
   - **LZM Command Service:**
     - Số lượng command được xử lý (tổng và theo loại)
     - Thời gian phản hồi command
     - Tỉ lệ lỗi command
     - Số event được phát ra
   
   - **LZM Query Service:**
     - Số lượng query được xử lý (tổng và theo loại) 
     - Thời gian phản hồi query
     - Tỉ lệ lỗi query
     - Cache hit/miss rate
     - Thời gian truy vấn DB
   
   - **LZM Import/Export Service:**
     - Số lượng job import/export
     - Thời gian xử lý import/export
     - Tỉ lệ thành công/thất bại
     - Số bản ghi được xử lý/giây
   
   - **LZM Background Worker:**
     - Số lượng event được xử lý
     - Độ trễ xử lý event
     - Tỉ lệ lỗi xử lý event

### **17.2. Logs**

Tất cả các service của LZM sử dụng cùng một tiêu chuẩn logging có cấu trúc:

1. **Log Format:** JSON structured logging với các trường chuẩn:
   - timestamp
   - service name
   - log level
   - trace ID
   - span ID
   - message
   - context data

2. **Log Levels:**
   - ERROR: Lỗi cần chú ý ngay (gây mất chức năng)
   - WARN: Cảnh báo (tiềm ẩn vấn đề)
   - INFO: Thông tin hoạt động bình thường
   - DEBUG: Thông tin chi tiết cho troubleshooting
   - TRACE: Thông tin rất chi tiết (chỉ dùng khi phát triển)

3. **Log Collection:** Logs được thu thập qua Fluentd/Fluent Bit và gửi đến hệ thống logging tập trung (ELK stack).

### **17.3. Distributed Tracing**

LZM triển khai distributed tracing để theo dõi luồng xử lý xuyên suốt các microservice:

1. **Tracing Implementation:**
   - Sử dụng OpenTelemetry để thu thập dữ liệu tracing
   - Tự động tạo spans cho các HTTP requests, database calls, message processing
   - Lan truyền context tracing thông qua HTTP headers và message headers

2. **Span Attributes:**
   - Thông tin về service gọi/được gọi
   - Operation name
   - Thời gian bắt đầu/kết thúc
   - Các thông tin context liên quan (tenant ID, translation set ID, etc.)

### **17.4. Alerts**

Các alerts được cấu hình dựa trên metrics và logs:

1. **Alerts Hạ tầng:**
   - High CPU/Memory usage (>85% trong 5 phút)
   - Pod restart counts (>3 trong 10 phút)
   - Disk space running low (<15%)

2. **Alerts Nghiệp vụ:**
   - **LZM Command Service:**
     - Tỉ lệ lỗi command cao (>5%)
     - Thời gian phản hồi command cao (>3s p95)
   
   - **LZM Query Service:**
     - Tỉ lệ lỗi query cao (>5%)
     - Thời gian phản hồi query cao (>1s p95)
     - Cache hit rate thấp (<70%)
   
   - **LZM Import/Export Service:**
     - Tỉ lệ lỗi import/export cao (>10%)
     - Job kéo dài bất thường (>30 phút cho job cỡ trung bình)
   
   - **LZM Background Worker:**
     - Tỉ lệ lỗi xử lý event cao (>5%)
     - Message queue length growing (>1000 messages)
     - Processing delay high (>5 phút)

## **18\. Kế hoạch Dung lượng (Capacity Planning - Initial)**

Dựa trên ước tính ban đầu về số lượng Khóa Bản dịch, Bản dịch, tần suất cập nhật bản dịch, lượng request truy vấn bản dịch và tần suất nhập/xuất dữ liệu, đưa ra ước tính ban đầu về tài nguyên cần thiết cho mỗi đơn vị triển khai của LZM:

### **18.1. Ước tính Tài nguyên**

1. **LZM Query Service:**
   - **CPU:** 1-2 cores per pod (request: 500m, limit: 2000m)
   - **Memory:** 1-2 GB per pod (request: 512Mi, limit: 2Gi)
   - **Storage:** Minimal (stateless, logs only)
   - **Replicas:** Min 2, Max 5-10 (dựa trên load)
   - **Scaling Policy:** HPA based on CPU (70%) và custom metrics (RPS)

2. **LZM Command Service:**
   - **CPU:** 0.5-1 cores per pod (request: 300m, limit: 1000m)
   - **Memory:** 512MB-1GB per pod (request: 256Mi, limit: 1Gi)
   - **Storage:** Minimal (stateless, logs only)
   - **Replicas:** Min 2, Max 3-5 (dựa trên load)
   - **Scaling Policy:** HPA based on CPU (70%)

3. **LZM Import/Export Service:**
   - **CPU:** 1-2 cores per pod (request: 500m, limit: 2000m)
   - **Memory:** 1-2 GB per pod (request: 1Gi, limit: 2Gi)
   - **Storage:** 5-10 GB cho temporary file storage
   - **Replicas:** Min 1, Max 3
   - **Scaling Policy:** HPA based on CPU (70%)

4. **LZM Background Worker:**
   - **CPU:** 0.5-1 cores per pod (request: 250m, limit: 1000m)
   - **Memory:** 512 MB-1GB per pod (request: 256Mi, limit: 1Gi)
   - **Storage:** Minimal (stateless, logs only)
   - **Replicas:** Min 1, Max 2
   - **Scaling Policy:** HPA based on queue length

5. **Cơ sở dữ liệu PostgreSQL:**
   - **CPU:** 2-4 cores
   - **Memory:** 4-8 GB
   - **Storage:** 50-100 GB (dựa trên dự kiến số lượng bản dịch)
   - **Replicas:** Primary + 1 Replica (high availability)

6. **Redis Cache:**
   - **CPU:** 1-2 cores
   - **Memory:** 2-4 GB
   - **Storage:** In-memory
   - **Replicas:** Primary + 1 Replica (high availability)

### **18.2. Dự kiến Tăng trưởng**

- Dự kiến tăng tài nguyên 20-30% hàng năm dựa trên tăng trưởng về số lượng bản dịch và traffic
- Điểm mốc quan trọng theo dõi:
  - Số lượng Translation Set: > 100
  - Số lượng Translation Key: > 100,000
  - Số lượng Translation: > 1,000,000
  - Số lượng truy vấn/giây: > 1,000

### **18.3. Chiến lược Tối ưu**

- Cache aggressively cho các truy vấn bản dịch phổ biến
- Index hiệu quả trong PostgreSQL
- Xem xét sharding database nếu volume dữ liệu rất lớn
- Auto-scaling dựa trên các metrics phù hợp với từng service
- Tuning connection pool cho database
- Cân nhắc sử dụng CDN cho bản dịch static (nếu có thể)
