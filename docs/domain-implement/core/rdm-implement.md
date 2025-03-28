# **Tài liệu Thiết kế Triển khai: Bounded Context Reference Data Management (RDM)**

## **1\. Giới thiệu**

Tài liệu này mô tả chi tiết thiết kế triển khai cho Bounded Context Reference Data Management (RDM) trong hệ thống Ecoma. RDM là một Bounded Context cốt lõi, chịu trách nhiệm quản lý và cung cấp các tập dữ liệu tham chiếu được sử dụng chung trên toàn hệ thống. Tài liệu này tập trung vào các khía cạnh kỹ thuật triển khai riêng cho RDM, bao gồm cấu trúc service, công nghệ sử dụng cụ thể trong RDM, lưu trữ dữ liệu, giao tiếp đặc thù của RDM, hạ tầng, và các yêu cầu phi chức năng liên quan đến triển khai.

Mục tiêu của tài liệu này là cung cấp hướng dẫn chi tiết cho đội ngũ kỹ thuật để xây dựng, triển khai và vận hành Microservice(s) hiện thực hóa Bounded Context RDM, đảm bảo tuân thủ các nguyên tắc kiến trúc tổng thể của Ecoma (Microservices, DDD, EDA, CQRS, Clean Architecture) và đạt được các mục tiêu hệ thống (Tính sẵn sàng cao, Khả năng mở rộng, Hiệu năng, Bảo mật).

## **2\. Bối cảnh Kiến trúc Tổng thể**

Hệ thống Ecoma được xây dựng trên nền tảng kiến trúc Microservices, phân rã theo Bounded Contexts của DDD. Giao tiếp giữa các service backend chủ yếu sử dụng Event-Driven Architecture (EDA) và Request/Reply. Bên trong mỗi service, mô hình CQRS và Clean Architecture được áp dụng bắt buộc.

RDM là một Core Bounded Context, đóng vai trò là **nhà cung cấp dữ liệu (Data Provider)** cho hầu hết các BC khác trong hệ thống. Nó quản lý các dữ liệu tĩnh hoặc ít thay đổi như danh sách Quốc gia, Tiền tệ, Locale, Quy tắc Định dạng, v.v.

## **3\. Mối quan hệ với Tài liệu Thiết kế Miền RDM**

Tài liệu này là phần tiếp theo của tài liệu **Thiết kế Miền RDM (rdm.md)**. Trong khi tài liệu Thiết kế Miền tập trung vào việc định nghĩa các khái niệm nghiệp vụ cốt lõi, Aggregate Root, Entity, Value Object, Ngôn ngữ Chung, Use Cases, **Domain Services, Application Services và Domain Events** ở cấp độ logic và nghiệp vụ, tài liệu này đi sâu vào cách các định nghĩa đó được hiện thực hóa và triển khai về mặt kỹ thuật.

- **Domain Services và Application Services:** Vai trò và trách nhiệm của các loại service này đã được định nghĩa chi tiết trong tài liệu Thiết kế Miền RDM. Trong tài liệu triển khai này, chúng ta xem xét cách các service kỹ thuật (RDM Query Service, RDM Command Service, RDM Import/Export Service) sẽ chứa và tổ chức các Domain Services và Application Services tương ứng theo mô hình Clean Architecture và CQRS. Chi tiết về từng Domain Service hoặc Application Service cụ thể (tên, phương thức, logic) sẽ không được lặp lại ở đây mà được tham chiếu đến tài liệu Thiết kế Miền.
- **Domain Events:** Các Domain Event mà RDM phát ra hoặc xử lý đã được xác định trong tài liệu Thiết kế Miền RDM, bao gồm mục đích và payload dự kiến. Tài liệu triển khai này mô tả cách các event đó được truyền tải vật lý trong hệ thống (sử dụng RabbitMQ) và cách các service lắng nghe/phát event. Chi tiết về từng loại Domain Event cụ thể sẽ không được lặp lại ở đây mà được tham chiếu đến tài liệu Thiết kế Miền.

## **4\. Cấu trúc thư mục monorepo**

Cấu trúc thư mục của RDM trong monorepo Ecoma sẽ tuân thủ mô hình đã định nghĩa, với sự phân chia rõ ràng giữa các microservices và thư viện:

```
ecoma-monorepo/
├── apps/
│   ├── services/
│   │   ├── rdm-command/                // RDM Command Service
│   │   │   ├── src/
│   │   │   │   ├── main.ts             // Điểm khởi đầu của service
│   │   │   │   ├── app.module.ts       // Module gốc của NestJS
│   │   │   │   ├── health/             // Health check endpoints
│   │   │   │   ├── config/             // Cấu hình đặc thù cho service
│   │   │   │   └── ...
│   │   │   └── Dockerfile
│   │   ├── rdm-query/                  // RDM Query Service
│   │   │   ├── src/
│   │   │   │   ├── main.ts
│   │   │   │   ├── app.module.ts
│   │   │   │   ├── health/
│   │   │   │   ├── config/
│   │   │   │   └── ...
│   │   │   └── Dockerfile
│   │   └── rdm-import-export/          // RDM Import/Export Service
│   │       ├── src/
│   │       │   ├── main.ts
│   │       │   ├── app.module.ts
│   │       │   ├── health/
│   │       │   ├── config/
│   │       │   └── ...
│   │       └── Dockerfile
└── libs/
    └── domains/
        └── rdm/
            ├── rdm-domain/             // Domain Layer
            │   └── src/
            │       ├── lib/
            │       │   ├── aggregates/  // Aggregate Roots (ReferenceDataSet)
            │       │   ├── entities/    // Entities (ReferenceDataItem)
            │       │   ├── value-objects/ // Value Objects
            │       │   ├── domain-events/ // Domain Events
            │       │   ├── domain-services/ // Domain Services
            │       │   └── exceptions/  // Domain Exceptions
            │       └── index.ts
            ├── rdm-application/        // Application Layer
            │   └── src/
            │       ├── lib/
            │       │   ├── use-cases/   // Use Cases (Command/Query handlers)
            │       │   ├── interfaces/  // Ports/Interfaces
            │       │   └── dtos/       // DTOs
            │       └── index.ts
            └── rdm-infrastructure/     // Infrastructure Layer
                └── src/
                    ├── lib/
                    │   ├── persistence/  // Repository implementations
                    │   ├── message-broker/ // Message broker adapters
                    │   ├── external-services/ // External service clients
                    │   └── models/     // Infrastructure-specific models
                    └── index.ts
```

## **5\. Đơn vị Triển khai (Deployment Units)**

Dựa trên mô hình CQRS bắt buộc và vai trò chính của RDM là cung cấp dữ liệu đọc với hiệu năng cao, cùng với các tác vụ quản lý (ghi) và nhập/xuất dữ liệu, RDM được triển khai thành ba đơn vị Microservice riêng biệt:

1. **RDM Query Service:**
   - **Trách nhiệm:** Xử lý tất cả các yêu cầu truy vấn (Queries) dữ liệu tham chiếu từ các Bounded Context khác và giao diện người dùng.
   - **Mô hình:** Read Model của CQRS. Chứa các **Application Services** và **Domain Services** liên quan đến truy vấn dữ liệu.
   - **Yêu cầu:** Hiệu năng cao, độ trễ thấp, tính sẵn sàng cao. Cần hỗ trợ truy vấn dữ liệu có phiên bản và dữ liệu Metadata linh hoạt.
   - **Giao tiếp:** Nhận Query thông qua cơ chế Request/Reply của hệ thống từ API Gateway hoặc các service backend khác.

2. **RDM Command Service:**
   - **Trách nhiệm:** Xử lý các yêu cầu thay đổi trạng thái (Commands) liên quan đến quản lý tập dữ liệu và mục dữ liệu tham chiếu (tạo, cập nhật, xóa).
   - **Mô hình:** Write Model của CQRS. Chứa các **Application Services** và **Domain Services** liên quan đến quản lý dữ liệu. Phát ra **Domain Events**.
   - **Yêu cầu:** Đảm bảo tính toàn vẹn dữ liệu khi ghi. Có thể chịu độ trễ cao hơn so với Query Service. Cần xử lý lỗi nghiệp vụ trong quá trình quản lý dữ liệu.
   - **Giao tiếp:** Nhận Command thông qua cơ chế Request/Reply của hệ thống (từ API Gateway/Admin UI). Phát Domain Events thông qua cơ chế Eventing của hệ thống.

3. **RDM Import/Export Service:**
   - **Trách nhiệm:** Xử lý các tác vụ nhập/xuất dữ liệu (Import/Export) quy mô lớn.
   - **Mô hình:** Xử lý các tác vụ nền/dài hạn (Import/Export). Chứa các **Application Services** liên quan đến nhập xuất dữ liệu.
   - **Yêu cầu:** Xử lý hiệu quả các tệp dữ liệu lớn. Khả năng kiểm tra lỗi và báo cáo chi tiết quá trình nhập/xuất.
   - **Giao tiếp:** Nhận yêu cầu Import/Export thông qua cơ chế Job Queue của hệ thống hoặc Request/Reply. Phát Domain Events thông báo kết quả nhập/xuất.

## **6\. Nền tảng Công nghệ Cụ thể cho RDM**

RDM sẽ sử dụng nền tảng công nghệ chung của hệ thống Ecoma, với lựa chọn cụ thể cho lưu trữ dữ liệu và caching:

- **Cơ sở dữ liệu Chính:** PostgreSQL (Sử dụng TypeORM) \- Phù hợp cho dữ liệu có cấu trúc và yêu cầu tính toàn vẹn cao của dữ liệu tham chiếu. Cần xem xét cách lưu trữ dữ liệu Metadata (ví dụ: sử dụng JSONB) và hỗ trợ Versioning (ValidFrom, ValidTo).
- **Cache/Tạm thời:** Redis \- Sử dụng cho caching dữ liệu tham chiếu thường xuyên được truy vấn trong RDM Query Service để giảm tải cho DB và cải thiện hiệu năng đọc.

## **7\. Lưu trữ Dữ liệu (Data Storage)**

RDM sẽ sở hữu cơ sở dữ liệu riêng, tách biệt với các BC khác. PostgreSQL là lựa chọn chính cho dữ liệu lâu dài, còn Redis được sử dụng làm lớp cache hiệu năng cao.

### **7.1. Schema PostgreSQL (Write Model & Primary Read Model)**

Cần thiết kế schema cho PostgreSQL để lưu trữ ReferenceDataSet và ReferenceDataItem. Schema này sẽ là nguồn sự thật cho dữ liệu tham chiếu và phục vụ cả Write Model lẫn Read Model (trước khi cache).

**Bảng reference_data_sets:**

| Cột         | Kiểu dữ liệu             | Ràng buộc / Mô tả                                    |
| :---------- | :----------------------- | :--------------------------------------------------- |
| id          | UUID                     | PRIMARY KEY, Unique identifier                       |
| name        | VARCHAR(255)             | NOT NULL, UNIQUE, Tên định danh của tập dữ liệu      |
| description | TEXT                     | Mô tả về tập dữ liệu                                 |
| type        | VARCHAR(50)              | Loại tập dữ liệu (ví dụ: 'simple_list', 'versioned') |
| is_active   | BOOLEAN                  | NOT NULL, DEFAULT TRUE, Trạng thái hoạt động         |
| created_at  | TIMESTAMP WITH TIME ZONE | NOT NULL, Thời điểm tạo                              |
| updated_at  | TIMESTAMP WITH TIME ZONE | NOT NULL, Thời điểm cập nhật cuối cùng               |

**Bảng reference_data_items:**

| Cột         | Kiểu dữ liệu             | Ràng buộc / Mô tả                                   |
| :---------- | :----------------------- | :-------------------------------------------------- |
| id          | UUID                     | PRIMARY KEY, Unique identifier (cục bộ trong BC)    |
| data_set_id | UUID                     | NOT NULL, FOREIGN KEY reference_data_sets(id)       |
| code        | VARCHAR(255)             | NOT NULL, Mã định danh của mục dữ liệu              |
| value       | JSONB                    | Giá trị liên quan (có thể là JSON object/array)     |
| description | TEXT                     | Mô tả về mục dữ liệu                                |
| order       | INTEGER                  | Thứ tự hiển thị (tùy chọn)                          |
| is_active   | BOOLEAN                  | NOT NULL, DEFAULT TRUE, Trạng thái hoạt động        |
| metadata    | JSONB                    | Dữ liệu bổ sung dưới dạng key-value                 |
| valid_from  | TIMESTAMP WITH TIME ZONE | Thời điểm mục dữ liệu có hiệu lực (cho versioning)  |
| valid_to    | TIMESTAMP WITH TIME ZONE | Thời điểm mục dữ liệu hết hiệu lực (cho versioning) |
| created_at  | TIMESTAMP WITH TIME ZONE | NOT NULL, Thời điểm tạo                             |
| updated_at  | TIMESTAMP WITH TIME ZONE | NOT NULL, Thời điểm cập nhật cuối cùng              |

**Chỉ mục (Indexes):**

- CREATE UNIQUE INDEX idx_reference_data_items_dataset_code ON reference_data_items (data_set_id, code); (Đảm bảo tính duy nhất của mã trong phạm vi tập dữ liệu)
- CREATE INDEX idx_reference_data_items_dataset_active ON reference_data_items (data_set_id, is_active); (Tối ưu truy vấn lấy các mục đang hoạt động theo tập dữ liệu)
- CREATE INDEX idx_reference_data_items_validity ON reference_data_items (valid_from, valid_to); (Tối ưu truy vấn theo khoảng thời gian hiệu lực)
- Các chỉ mục GIN hoặc GiST trên cột metadata (JSONB) nếu cần truy vấn hiệu quả dựa trên các khóa/giá trị bên trong metadata.

### **7.2. Cấu trúc Cache Redis (Read Model Cache)**

Redis sẽ được sử dụng làm lớp cache cho RDM Query Service để lưu trữ các kết quả truy vấn thường xuyên được sử dụng. Chiến lược cache là "Cache-Aside".

**Chiến lược Key:**

Sử dụng cấu trúc key rõ ràng để dễ dàng quản lý và invalidation cache. Cấu trúc key nên phản ánh loại dữ liệu và tiêu chí truy vấn.

- **Cache danh sách tất cả các tập dữ liệu:**
  - Key: rdm:datasets:all
  - Value: JSON string của danh sách các ReferenceDataSet object.
- **Cache thông tin chi tiết một tập dữ liệu theo tên:**
  - Key: rdm:dataset:name:\<dataset_name\> (ví dụ: rdm:dataset:name:Countries)
  - Value: JSON string của ReferenceDataSet object.
- **Cache danh sách tất cả các mục dữ liệu trong một tập dữ liệu (phiên bản hiện tại, đang hoạt động):**
  - Key: rdm:dataset:\<dataset_id\>:items:active
  - Value: JSON string của danh sách các ReferenceDataItem object.
- **Cache thông tin chi tiết một mục dữ liệu theo ID:**
  - Key: rdm:item:id:\<item_id\> (ví dụ: rdm:item:id:a1b2c3d4-e5f6-7890-1234-567890abcdef)
  - Value: JSON string của ReferenceDataItem object.
- **Cache thông tin chi tiết một mục dữ liệu theo mã và tập dữ liệu (phiên bản hiện tại, đang hoạt động):**
  - Key: rdm:dataset:\<dataset_id\>:item:code:\<item_code\> (ví dụ: rdm:dataset:uuid123:item:code:VN)
  - Value: JSON string của ReferenceDataItem object.
- **Cache danh sách các mục dữ liệu trong một tập dữ liệu tại một thời điểm cụ thể (cho versioning):**
  - Key: rdm:dataset:\<dataset_id\>:items:at_time:\<timestamp\> (ví dụ: rdm:dataset:uuid123:items:at_time:1678886400)
  - Value: JSON string của danh sách các ReferenceDataItem object.

**Chiến lược Value:**

Lưu trữ dữ liệu dưới dạng JSON string. Khi đọc từ cache, parse JSON string trở lại thành object.

**Chiến lược Cache Invalidation:**

Khi có bất kỳ thay đổi nào đối với dữ liệu tham chiếu (tạo, cập nhật, xóa tập dữ liệu hoặc mục dữ liệu) trong RDM Command Service, service này sẽ phát ra Domain Events. RDM Query Service sẽ lắng nghe các Domain Events này và thực hiện invalidation các key cache liên quan trong Redis.

- Khi ReferenceDataSetCreated, ReferenceDataSetUpdated, ReferenceDataSetDeleted: Invalidate rdm:datasets:all và key cache chi tiết của tập dữ liệu đó (rdm:dataset:name:\<dataset_name\>, rdm:dataset:id:\<dataset_id\>).
- Khi ReferenceDataItemAdded, ReferenceDataItemUpdated, ReferenceDataItemRemoved: Invalidate key cache danh sách mục dữ liệu của tập dữ liệu cha (rdm:dataset:\<dataset_id\>:items:active) và key cache chi tiết của mục dữ liệu đó (rdm:item:id:\<item_id\>, rdm:dataset:\<dataset_id\>:item:code:\<item_code\>). Đối với dữ liệu có versioning, cần cân nhắc invalidation hoặc thêm logic để cache phiên bản mới nhất.

Việc cấu hình TTL (Time To Live) cho các key cache cũng là cần thiết để dữ liệu cache không bị quá cũ nếu cơ chế invalidation dựa trên event gặp sự cố.

## **8\. Giao tiếp và Tích hợp**

- **Nhận Commands/Queries:**
  - RDM nhận các yêu cầu thay đổi trạng thái (Commands) và yêu cầu truy vấn dữ liệu (Queries) thông qua cơ chế Request/Reply của hệ thống (sử dụng NATS). Các yêu cầu này có thể đến từ API Gateway (được gọi bởi Client/Admin UI) hoặc từ các service backend khác.
  - RDM Command Service có thể nhận yêu cầu Import/Export thông qua cơ chế Job Queue của hệ thống (sử dụng RabbitMQ).
- **Phát Domain Events:**
  - RDM Command Service sẽ phát các Domain Event (ví dụ: ReferenceDataSet/Item Created/Updated/Deleted, Import/Export Completed/Failed) đến hệ thống Message Broker (RabbitMQ) để các BC khác quan tâm có thể tiêu thụ theo mô hình Fire-and-Forget.
  - Chi tiết về các Domain Event được phát ra bởi RDM có thể tham khảo trong tài liệu Thiết kế Miền RDM (rdm.md).
- **Tương tác với LZM:** LZM sẽ gửi Query đến RDM Query Service thông qua cơ chế Request/Reply của hệ thống để lấy danh sách Locale/Ngôn ngữ và các quy tắc định dạng.
- **Tương tác với ALM:** RDM Command Service sẽ phát Event hoặc gọi API của ALM để ghi lại các hành động quản lý dữ liệu tham chiếu quan trọng.

## **9\. Định nghĩa API Endpoint và Mapping Use Case**

Phần này phác thảo các API Endpoint chính mà RDM cung cấp thông qua API Gateway (đối với các tương tác từ bên ngoài hệ thống) và mapping chúng với các Use Case đã định nghĩa trong tài liệu Thiết kế Miền RDM (rdm.md). Các Endpoint này sẽ được API Gateway định tuyến đến RDM Query Service hoặc RDM Command Service tương ứng.

| API Endpoint (Ví dụ)                          | Phương thức HTTP | Mô tả Chức năng Cấp cao                                | Use Case Liên quan (rdm.md) | Loại Yêu cầu Nội bộ (CQRS) | Service Xử lý                                  |
| :-------------------------------------------- | :--------------- | :----------------------------------------------------- | :-------------------------- | :------------------------- | :--------------------------------------------- |
| /api/v1/rdm/datasets                          | GET              | Lấy danh sách các tập dữ liệu tham chiếu.              | RDM-UC-8.2.1                | Query                      | RDM Query Service                              |
| /api/v1/rdm/datasets/{name}                   | GET              | Lấy thông tin chi tiết một tập dữ liệu theo tên.       | RDM-UC-8.2.1                | Query                      | RDM Query Service                              |
| /api/v1/rdm/datasets                          | POST             | Tạo mới một tập dữ liệu tham chiếu.                    | RDM-UC-8.1.1                | Command                    | RDM Command Service                            |
| /api/v1/rdm/datasets/{dataSetId}              | PUT              | Cập nhật thông tin một tập dữ liệu theo ID.            | RDM-UC-8.1.1                | Command                    | RDM Command Service                            |
| /api/v1/rdm/datasets/{dataSetId}              | DELETE           | Xóa một tập dữ liệu tham chiếu theo ID.                | RDM-UC-8.1.1                | Command                    | RDM Command Service                            |
| /api/v1/rdm/datasets/{dataSetId}/items        | GET              | Lấy danh sách các mục dữ liệu trong một tập dữ liệu.   | RDM-UC-8.2.1                | Query                      | RDM Query Service                              |
| /api/v1/rdm/datasets/{dataSetId}/items/{code} | GET              | Lấy thông tin chi tiết một mục dữ liệu theo mã và tập. | RDM-UC-8.2.1                | Query                      | RDM Query Service                              |
| /api/v1/rdm/items/{itemId}                    | GET              | Lấy thông tin chi tiết một mục dữ liệu theo ID.        | RDM-UC-8.2.1                | Query                      | RDM Query Service                              |
| /api/v1/rdm/datasets/{dataSetId}/items        | POST             | Thêm mới một mục dữ liệu vào tập dữ liệu.              | RDM-UC-8.1.2                | Command                    | RDM Command Service                            |
| /api/v1/rdm/items/{itemId}                    | PUT              | Cập nhật thông tin một mục dữ liệu theo ID.            | RDM-UC-8.1.2                | Command                    | RDM Command Service                            |
| /api/v1/rdm/items/{itemId}                    | DELETE           | Xóa một mục dữ liệu theo ID.                           | RDM-UC-8.1.2                | Command                    | RDM Command Service                            |
| /api/v1/rdm/import                            | POST             | Yêu cầu nhập dữ liệu tham chiếu hàng loạt.             | RDM-UC-8.3.1                | Command (hoặc Job)         | RDM Import/Export Service                      |
| /api/v1/rdm/export/{dataSetId}                | GET              | Yêu cầu xuất dữ liệu tham chiếu của một tập.           | RDM-UC-8.3.1                | Query                      | RDM Import/Export Service                      |

_Lưu ý: Đây là các endpoint ví dụ. Tên và cấu trúc cụ thể có thể được tinh chỉnh trong quá trình thiết kế kỹ thuật chi tiết._

## **10\. Chiến lược Xử lý Lỗi (Error Handling Strategy)**

Thiết kế triển khai RDM cần có chiến lược xử lý lỗi rõ ràng ở cấp độ service, phân biệt giữa các loại lỗi và kênh giao tiếp:

- **Lỗi Nghiệp vụ (Business Rule Exceptions):** Các lỗi phát sinh do vi phạm quy tắc nghiệp vụ (được định nghĩa trong Domain Services và ném ra Business Rule Exception) sẽ được bắt ở lớp Application Service hoặc lớp xử lý Command/Query.
  - **Đối với giao tiếp Request/Reply (qua API Gateway hoặc NATS):** Lỗi nghiệp vụ sẽ được chuyển đổi thành phản hồi lỗi có cấu trúc (ví dụ: JSON object) bao gồm mã lỗi (error code) và thông báo lỗi chi tiết, được trả về cho bên gọi. Sử dụng HTTP status code 400 Bad Request cho các lỗi phía người dùng (ví dụ: validate input) khi giao tiếp qua API Gateway. Phản hồi lỗi sẽ bao gồm một biến chỉ báo thành công/thất bại (ví dụ: success: false) cùng với thông tin lỗi chi tiết.
  - **Đối với giao tiếp qua Message Broker (Fire-and-Forget Events hoặc Job Queues):** Lỗi nghiệp vụ xảy ra trong quá trình xử lý event hoặc job sẽ được ghi log chi tiết và phát ra một Domain Event thông báo về sự thất bại của tác vụ (ví dụ: ReferenceDataImportFailed) bao gồm thông tin chi tiết về lỗi.
- **Lỗi Kỹ thuật (Technical Errors):** Các lỗi phát sinh ở lớp Infrastructure (ví dụ: lỗi kết nối DB, lỗi kết nối Message Broker) sẽ được xử lý bằng cách sử dụng try-catch block.
  - Các lỗi này cần được ghi log chi tiết (sử dụng Structured Logging) với mức độ phù hợp (ví dụ: ERROR), bao gồm stack trace và các thông tin tương quan (traceId, spanId).
  - Đối với giao tiếp Request/Reply: Lỗi kỹ thuật sẽ được chuyển đổi thành phản hồi lỗi chung (ví dụ: HTTP status code 500 Internal Server Error) để tránh lộ thông tin nhạy cảm về hạ tầng, nhưng vẫn ghi log chi tiết ở phía server.
  - Đối với giao tiếp qua Message Broker: Lỗi kỹ thuật sẽ được xử lý theo cơ chế retry của Message Broker. Nếu retry vẫn thất bại, message sẽ được chuyển vào Dead Letter Queue (DLQ) để phân tích sau. Lỗi cũng cần được ghi log và có thể kích hoạt cảnh báo.
- **Lỗi Validate Input:** Đối với các yêu cầu nhận được qua API Endpoint (từ API Gateway), lỗi validate input sẽ được xử lý ở lớp Application Service hoặc Controller (trong NestJS) trước khi tạo Command/Query. Phản hồi lỗi sẽ sử dụng HTTP status code 400 Bad Request với thông báo lỗi chi tiết về các trường không hợp lệ.
- **Thông báo Lỗi:** Các lỗi quan trọng (ví dụ: lỗi kết nối DB kéo dài, lỗi xử lý Command quan trọng, lỗi import dữ liệu) cần kích hoạt cảnh báo thông qua hệ thống giám sát (Observability Stack).

## **11\. Khả năng Phục hồi (Resiliency)**

Để đảm bảo RDM chịu lỗi và phục hồi khi các phụ thuộc gặp sự cố:

- **Timeouts và Retries:** Cấu hình timeouts và retry policies cho các cuộc gọi đi đến các phụ thuộc (PostgreSQL, Redis, Message Brokers, ALM API). Sử dụng các thư viện hỗ trợ retry với exponential backoff và jitter.
- **Circuit Breaker:** Áp dụng mẫu Circuit Breaker cho các cuộc gọi đến các phụ thuộc có khả năng gặp sự cố tạm thời để ngăn chặn các cuộc gọi liên tục gây quá tải cho phụ thuộc đó và cho chính service RDM.
- **Bulkhead:** Nếu có các loại tác vụ khác nhau trong cùng một service (ví dụ: xử lý Command và xử lý Import trong RDM Command Service), cân nhắc sử dụng Bulkhead để cô lập tài nguyên, ngăn chặn một loại tác vụ bị treo ảnh hưởng đến loại khác.
- **Health Checks:** Triển khai các loại Health Check Probe trong Kubernetes cho mỗi service RDM:
  - **Startup Probe:** Kiểm tra xem ứng dụng đã khởi động hoàn toàn và sẵn sàng nhận traffic chưa. Ví dụ: Kiểm tra xem kết nối đến DB và Message Broker đã thiết lập thành công chưa. Chỉ khi Startup Probe thành công thì Liveness và Readiness Probe mới bắt đầu.
  - **Liveness Probe:** Kiểm tra xem ứng dụng có đang chạy và khỏe mạnh không. Nếu Liveness Probe thất bại, Kubernetes sẽ khởi động lại Pod. Ví dụ: Kiểm tra xem service có phản hồi HTTP request trên một endpoint cụ thể (/healthz) không, hoặc kiểm tra xem vòng lặp xử lý message có bị block không.
  - **Readiness Probe:** Kiểm tra xem ứng dụng đã sẵn sàng xử lý request chưa. Nếu Readiness Probe thất bại, Kubernetes sẽ ngừng gửi traffic đến Pod đó. Ví dụ: Kiểm tra xem kết nối đến **PostgreSQL** và **Redis** có hoạt động không, và service có thể truy vấn dữ liệu cơ bản từ DB/Cache không.
  - Các thành phần phụ thuộc chính được kiểm tra trong Health Check bao gồm **PostgreSQL** (nguồn dữ liệu chính) và **Redis** (lớp cache).
- **Idempotency:** Thiết kế các Command và Event Handlers (đặc biệt là cho tác vụ Import) có tính Idempotent nếu có thể, để việc xử lý lặp lại do retry hoặc lỗi tạm thời không gây ra kết quả không mong muốn.

## **12\. Chiến lược Kiểm thử (Testing Strategy)**

Trong hệ thống Ecoma, chúng tôi luôn áp dụng các cấp độ kiểm thử tự động để đảm bảo chất lượng code và tính đúng đắn của nghiệp vụ và kỹ thuật. Đối với RDM, chiến lược kiểm thử bao gồm:

- **Unit Tests:** Luôn được áp dụng để kiểm thử các đơn vị code nhỏ nhất (hàm, lớp) một cách độc lập, đặc biệt là logic nghiệp vụ trong Domain Model, Domain Services và logic xử lý trong Application Services (sử dụng mock cho các phụ thuộc).
- **Integration Tests:** Kiểm thử sự tương tác giữa các thành phần nội bộ của service (ví dụ: Application Service gọi Domain Service, Repository tương tác với Database).
- **End-to-End Tests (E2E Tests):** Kiểm thử luồng nghiệp vụ hoàn chỉnh từ điểm vào (API Endpoint hoặc nhận Message) đến điểm kết thúc, bao gồm cả tương tác với các phụ thuộc thực tế (hoặc giả lập gần giống thực tế). E2E Tests cho RDM sẽ kiểm tra các luồng thông qua API Gateway hoặc Message Broker.
- **Contract Tests:** Viết Contract Test để đảm bảo rằng API Endpoint của RDM (được gọi qua API Gateway hoặc NATS Request/Reply) tuân thủ đúng "hợp đồng" đã định nghĩa (ví dụ: sử dụng OpenAPI spec). Tương tự, kiểm tra schema của Domain Events được phát ra.
- **Component Tests:** Kiểm thử từng service RDM (Query Service, Command Service, Import/Export Service) trong môi trường gần với production, với các phụ thuộc (DB, Redis, Message Broker) được giả lập (mock) hoặc sử dụng các phiên bản nhẹ (ví dụ: Testcontainers).
- **Performance/Load Tests:** Thực hiện kiểm thử tải để xác minh RDM Query Service có thể đáp ứng yêu cầu hiệu năng đọc cao và RDM Command Service có thể xử lý lượng Command/Import dự kiến, đặc biệt là khi scaling ngang.

## **13\. Chiến lược Di chuyển Dữ liệu (Data Migration Strategy)**

Các thay đổi về schema database của PostgreSQL cần được quản lý cẩn thận để đảm bảo quá trình triển khai diễn ra suôn sẻ và không làm mất dữ liệu:

- Sử dụng các công cụ quản lý migration schema tự động (ví dụ: Flyway hoặc Liquibase) để theo dõi và áp dụng các thay đổi schema một cách có phiên bản và tự động trong quy trình CI/CD.
- Thiết kế các migration có tính **Backward Compatibility** (ví dụ: chỉ thêm cột, không xóa hoặc thay đổi tên cột/bảng quan trọng) trong một khoảng thời gian chuyển tiếp để cho phép triển khai phiên bản code mới sử dụng schema cũ và ngược lại. Điều này hỗ trợ chiến lược triển khai Rolling Update trong Kubernetes.
- Lập kế hoạch **rollback** cho các migration nếu có lỗi xảy ra trong quá trình triển khai. Công cụ migration schema cần hỗ trợ rollback về phiên bản schema trước đó.
- Đối với các thay đổi dữ liệu phức tạp hơn (ví dụ: chuyển đổi dữ liệu giữa các cột, gộp/tách bảng), cần viết các **Data Migration Script** riêng biệt và chạy chúng như một phần của quy trình triển khai, sau khi schema đã được cập nhật.
- Đảm bảo có bản sao lưu (backup) dữ liệu trước khi thực hiện các migration quan trọng.

## **14\. Kế hoạch Dung lượng (Capacity Planning - Initial)**

Dựa trên ước tính ban đầu về lượng dữ liệu tham chiếu, tần suất truy vấn, tần suất cập nhật/import, và yêu cầu hiệu năng, đưa ra ước tính ban đầu về tài nguyên cần thiết cho mỗi đơn vị triển khai của RDM:

### **14.1. Ước tính Tài nguyên**

1. **RDM Query Service:**
   - **CPU:** 0.5-1 cores per pod (request: 500m, limit: 1000m)
   - **Memory:** 512MB-1GB per pod (request: 512Mi, limit: 1Gi)
   - **Storage:** Minimal (stateless, logs only)
   - **Replicas:** Min 3, Max 10 (dựa trên load)
   - **Scaling Policy:** HPA based on CPU (70%) và custom metrics (RPS)

2. **RDM Command Service:**
   - **CPU:** 0.3-0.7 cores per pod (request: 300m, limit: 700m)
   - **Memory:** 512MB-1GB per pod (request: 512Mi, limit: 1Gi)
   - **Storage:** Minimal (stateless, logs only)
   - **Replicas:** Min 2, Max 5 (dựa trên load)
   - **Scaling Policy:** HPA based on CPU (60%)

3. **RDM Import/Export Service:**
   - **CPU:** 0.5-1 cores per pod (request: 500m, limit: 1000m)
   - **Memory:** 1-2 GB per pod (request: 1Gi, limit: 2Gi)
   - **Storage:** 1-5 GB cho temporary file storage
   - **Replicas:** Min 1, Max 3
   - **Scaling Policy:** HPA based on CPU (60%)

4. **Cơ sở dữ liệu PostgreSQL:**
   - **CPU:** 1-2 cores
   - **Memory:** 4-8 GB
   - **Storage:** 10-20 GB (dựa trên dự kiến số lượng reference data)
   - **Replicas:** Primary + 1 Replica (high availability)

5. **Redis Cache:**
   - **CPU:** 0.5-1 cores
   - **Memory:** 1-2 GB
   - **Storage:** In-memory
   - **Replicas:** Primary + 1 Replica (high availability)

### **14.2. Dự kiến Tăng trưởng**

- Dự kiến tăng tài nguyên 15-25% hàng năm dựa trên tăng trưởng về số lượng reference data và traffic
- Điểm mốc quan trọng theo dõi:
  - Số lượng Dataset: > 50
  - Số lượng Reference Data Items: > 10,000
  - Số lượng truy vấn/giây: > 500

### **14.3. Chiến lược Tối ưu**

- Cache aggressively cho các truy vấn reference data phổ biến
- Index hiệu quả trong PostgreSQL, đặc biệt là GIN index cho JSONB metadata
- Auto-scaling dựa trên các metrics phù hợp với từng service
- Tuning connection pool cho database
- Sử dụng materialized views cho các dataset lớn nhưng ít thay đổi

## **15\. Hạ tầng và Môi trường Triển khai**

RDM Microservice(s) sẽ được triển khai trên nền tảng Kubernetes, sử dụng các công cụ và quy trình chung của hệ thống Ecoma:

- **Containerization:** Đóng gói RDM Query Service và RDM Command Service (và Import/Export Service nếu có) thành các Docker Image riêng biệt.
- **Orchestration:** Triển khai trên Kubernetes Cluster.
- **Infrastructure as Code (IaC):** Sử dụng Helm Charts để định nghĩa cấu hình triển khai Kubernetes.
- **GitOps:** Sử dụng ArgoCD để tự động hóa việc triển khai từ Git Repository chứa Helm Charts.
- **Môi trường:** Triển khai trên các môi trường Development, Staging, Production với cấu hình riêng biệt.

## **16\. Quan sát (Observability)**

Áp dụng chiến lược Observability chung của Ecoma:

- **Logging:** Sử dụng Structured Logging trong tất cả các service của RDM. Log các sự kiện quan trọng. Đảm bảo log chứa các trường tương quan.
- **Metrics:** Thu thập Metrics kỹ thuật và Metrics nghiệp vụ.
- **Tracing:** Triển khai Distributed Tracing để theo dõi luồng request/command/event xuyên suốt các microservice RDM và các service khác mà RDM tương tác. Đảm bảo lan truyền Trace Context qua các kênh giao tiếp.
- **Alerting:** Cấu hình cảnh báo dựa trên các Metrics quan trọng.

## **17\. Bảo mật (Security)**

Áp dụng các biện pháp bảo mật ở cấp độ triển khai chung của hệ thống:

- **Kiểm soát Truy cập Nội bộ:** Sử dụng Network Policies trong Kubernetes.
- **Bảo mật Kênh Truyền:** Sử dụng TLS cho kết nối đến Database, Redis, Message Brokers.
- **Quản lý Bí mật:** Lưu trữ thông tin nhạy cảm trong Kubernetes Secrets hoặc giải pháp Secret Management an toàn.
- **Ủy quyền:** RDM Application Services sẽ kiểm tra ủy quyền dựa trên thông tin từ API Gateway hoặc Context từ Command/Query.

## **18\. CI/CD và Chiến lược Triển khai**

Tuân thủ quy trình CI/CD chung của hệ thống Ecoma sử dụng GitHub Actions và ArgoCD.

- **CI Pipeline (GitHub Actions):**
  - Build code.
  - Run Tests (bao gồm Unit, Integration, Contract Tests).
  - Static Analysis.
  - Build Docker Image.
  - Push Docker Image.
  - Cập nhật Image Tag trong Helm Chart Value File.
- **CD Pipeline (ArgoCD):**
  - Theo dõi Git Repository.
  - Tự động đồng bộ các thay đổi lên Kubernetes Cluster.
  - Hỗ trợ các chiến lược triển khai (Rolling Update là mặc định, có thể cân nhắc Canary hoặc Blue/Green).
  - Tự động rollback khi phát hiện lỗi (dựa trên Health Check của Pod).

## **19\. Quản lý Cấu hình (Configuration Management)**

Sử dụng các cơ chế quản lý cấu hình chung của hệ thống Ecoma (Environment Variables, ConfigMaps, Secrets) được quản lý bởi Helm Charts.

## **20\. Phụ thuộc (Dependencies)**

- **Phụ thuộc Nội bộ (Internal Dependencies):**
  - Các BC khác là Consumer của RDM Query Service.
  - RDM Command Service phụ thuộc vào ALM.
  - LZM phụ thuộc vào RDM Query Service.
- **Phụ thuộc Bên ngoài (External Dependencies):**
  - Database (PostgreSQL, Redis).
  - Message Brokers (NATS, RabbitMQ).
  - Container Registry.
  - Kubernetes API.

## **21\. Kết luận**

Việc triển khai Bounded Context RDM tuân thủ chặt chẽ kiến trúc Microservices, CQRS và Clean Architecture của hệ thống Ecoma. Bằng cách tách biệt Query Service và Command Service, chúng ta có thể tối ưu hóa khả năng mở rộng và hiệu năng cho luồng đọc dữ liệu tham chiếu, vốn là yêu cầu quan trọng từ các BC khác. Việc sử dụng PostgreSQL với JSONB và chiến lược Versioning trong schema sẽ đáp ứng nhu cầu lưu trữ dữ liệu tham chiếu đa dạng và có lịch sử. Hạ tầng Kubernetes, kết hợp với IaC, GitOps và chiến lược Observability, sẽ đảm bảo khả năng vận hành hiệu quả, tự động hóa và giám sát cho RDM Microservice(s). Việc định nghĩa các API Endpoint và mapping với Use Case giúp làm rõ giao diện tương tác của RDM với bên ngoài. Việc bổ sung chi tiết về Chiến lược Xử lý Lỗi (bao gồm cả trường hợp Message Broker), Khả năng Phục hồi (Health Checks chi tiết), Chiến lược Kiểm thử (khẳng định Unit/Integration/E2E), Chiến lược Di chuyển Dữ liệu và Kế hoạch Dung lượng Ban đầu làm cho tài liệu thiết kế triển khai này đầy đủ và sẵn sàng hơn cho giai đoạn triển khai thực tế.

Tài liệu này cung cấp nền tảng cho việc thiết kế kỹ thuật chi tiết hơn và bắt đầu quá trình triển khai thực tế.

## **22\. Health Checks**

Mỗi service trong RDM phải triển khai các endpoint health check để hỗ trợ giám sát, kiểm tra sẵn sàng và tự động khôi phục. Các loại health check bao gồm:

### **22.1. Health Check Endpoints**

Mỗi microservice trong RDM (Command, Query, Import/Export) sẽ triển khai ba endpoint health check:

1. **Liveness Probe (`/health/live`):** Kiểm tra xem ứng dụng có đang chạy và phản hồi không. Nếu faulty, Kubernetes sẽ khởi động lại container.
   - Kiểm tra: Ứng dụng đang chạy và có thể phản hồi HTTP request.

2. **Readiness Probe (`/health/ready`):** Kiểm tra xem ứng dụng có sẵn sàng nhận traffic không. Nếu không sẵn sàng, Kubernetes sẽ ngừng gửi traffic đến pod này.
   - Kiểm tra: Kết nối đến cơ sở dữ liệu PostgreSQL, Redis cache, message broker (RabbitMQ, NATS), và các phụ thuộc khác như IAM.

3. **Startup Probe (`/health/startup`):** Kiểm tra xem ứng dụng đã khởi động thành công chưa trước khi bắt đầu kiểm tra liveness và readiness.
   - Kiểm tra: Ứng dụng đã khởi động và cấu hình đã được tải thành công.

### **22.2. Chiến lược Kiểm tra**

- **RDM Command Service:**
  - **Liveness:** Kiểm tra khả năng phục vụ HTTP request.
  - **Readiness:** Kiểm tra kết nối tới PostgreSQL, RabbitMQ (để phát event), NATS (để nhận command), và IAM (cho authorization).
  
- **RDM Query Service:**
  - **Liveness:** Kiểm tra khả năng phục vụ HTTP request.
  - **Readiness:** Kiểm tra kết nối tới PostgreSQL, Redis cache, NATS (để nhận query).

- **RDM Import/Export Service:**
  - **Liveness:** Kiểm tra khả năng phục vụ HTTP request và tình trạng hoạt động của workers.
  - **Readiness:** Kiểm tra kết nối tới PostgreSQL, RabbitMQ (để phát event), NATS hoặc Job Queue (để nhận yêu cầu).

### **22.3. Cấu hình trong Kubernetes**

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

## **23\. Giám sát và Alert**

### **23.1. Metrics**

RDM triển khai việc thu thập metrics để giám sát hiệu năng và tình trạng hoạt động của các microservice:

1. **Metrics Hệ thống:**
   - CPU, Memory, Disk usage
   - JVM metrics (nếu sử dụng)
   - Connection pool stats (DB, Redis)

2. **Metrics Nghiệp vụ:**
   - **RDM Command Service:**
     - Số lượng command được xử lý (tổng và theo loại)
     - Thời gian phản hồi command
     - Tỉ lệ lỗi command
     - Số event được phát ra
   
   - **RDM Query Service:**
     - Số lượng query được xử lý (tổng và theo loại) 
     - Thời gian phản hồi query
     - Tỉ lệ lỗi query
     - Cache hit/miss rate
     - Số lượng datasets/items được truy vấn/giây
   
   - **RDM Import/Export Service:**
     - Số lượng job import/export
     - Thời gian xử lý import/export
     - Tỉ lệ thành công/thất bại
     - Số bản ghi được xử lý/giây

### **23.2. Logs**

Tất cả các service của RDM sử dụng cùng một tiêu chuẩn logging có cấu trúc:

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

### **23.3. Distributed Tracing**

RDM triển khai distributed tracing để theo dõi luồng xử lý xuyên suốt các microservice:

1. **Tracing Implementation:**
   - Sử dụng OpenTelemetry để thu thập dữ liệu tracing
   - Tự động tạo spans cho các HTTP requests, database calls, message processing
   - Lan truyền context tracing thông qua HTTP headers và message headers

2. **Span Attributes:**
   - Thông tin về service gọi/được gọi
   - Operation name
   - Thời gian bắt đầu/kết thúc
   - Các thông tin context liên quan (tenant ID, dataset ID, etc.)

### **23.4. Alerts**

Các alerts được cấu hình dựa trên metrics và logs:

1. **Alerts Hạ tầng:**
   - High CPU/Memory usage (>85% trong 5 phút)
   - Pod restart counts (>3 trong 10 phút)
   - Disk space running low (<15%)

2. **Alerts Nghiệp vụ:**
   - **RDM Command Service:**
     - Tỉ lệ lỗi command cao (>5%)
     - Thời gian phản hồi command cao (>2s p95)
   
   - **RDM Query Service:**
     - Tỉ lệ lỗi query cao (>5%)
     - Thời gian phản hồi query cao (>500ms p95)
     - Cache hit rate thấp (<80%)
   
   - **RDM Import/Export Service:**
     - Tỉ lệ lỗi import/export cao (>10%)
     - Job kéo dài bất thường (>15 phút cho job cỡ trung bình)
