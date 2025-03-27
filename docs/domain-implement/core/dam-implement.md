# **Hướng dẫn triển khai Bounded Context Digital Asset Management (DAM)**

## **1\. Giới thiệu**

Tài liệu này mô tả chi tiết thiết kế triển khai cho Bounded Context Digital Asset Management (DAM) trong hệ thống Ecoma. DAM là một Bounded Context thuộc nhóm Feature Bounded Context (Master Data), chịu trách nhiệm quản lý toàn bộ các tài sản kỹ thuật số (hình ảnh, video, tài liệu, v.v.) được sử dụng trên toàn bộ nền tảng Ecoma. Tài liệu này tập trung vào các khía cạnh kỹ thuật triển khai riêng cho DAM, bao gồm cấu trúc service, công nghệ sử dụng cụ thể trong DAM, lưu trữ dữ liệu, giao tiếp đặc thù của DAM, hạ tầng, và các yêu cầu phi chức năng liên quan đến triển khai.

Mục tiêu của tài liệu này là cung cấp hướng dẫn chi tiết cho đội ngũ kỹ thuật để xây dựng, triển khai và vận hành Microservice(s) hiện thực hóa Bounded Context DAM, đảm bảo tuân thủ các nguyên tắc kiến trúc tổng thể của Ecoma (Microservices, DDD, EDA, CQRS, Clean Architecture) và đạt được các mục tiêu hệ thống (Tính sẵn sàng cao, Khả năng mở rộng, Hiệu năng, Bảo mật).

## **2\. Bối cảnh Kiến trúc Tổng thể**

Hệ thống Ecoma được xây dựng trên nền tảng kiến trúc Microservices, phân rã theo Bounded Contexts của DDD. Giao tiếp giữa các service backend chủ yếu sử dụng Event-Driven Architecture (EDA) và Request/Reply. Bên trong mỗi service, mô hình CQRS và Clean Architecture được áp dụng bắt buộc.

DAM là một Feature Bounded Context, đóng vai trò là kho lưu trữ tập trung và quản lý các tài sản kỹ thuật số. DAM nhận yêu cầu quản lý tài sản (tải lên, cập nhật, xóa) và cung cấp khả năng truy vấn (tìm kiếm, lấy URL) thông qua Request/Reply. DAM tương tác chặt chẽ với IAM (để kiểm tra ủy quyền), LZM/RDM (để bản địa hóa metadata và dữ liệu tham chiếu), ALM (để ghi log), BUM (lắng nghe sự kiện xóa Tenant), và tích hợp với External Storage Service để lưu trữ file vật lý.

## **3\. Mối quan hệ với Tài liệu Thiết kế Miền DAM**

Tài liệu này là phần tiếp theo của tài liệu **Thiết kế Miền DAM (dam.md)**. Trong khi tài liệu Thiết kế Miền tập trung vào việc định nghĩa các khái niệm nghiệp vụ cốt lõi, Aggregate Root (Asset, Folder), Entity (AssetMetadata, AssetRendition, AssetHistory), Value Object (AssetStatus, RenditionType, AccessPermission, LocalizedText, AssetUploadDetails, AssetMetadataUpdate, AssetQueryCriteria, FolderQueryCriteria), Ngôn ngữ Chung, Use Cases, Domain Services và Application Services ở cấp độ logic và nghiệp vụ, tài liệu này đi sâu vào cách các định nghĩa đó được hiện thực hóa và triển khai về mặt kỹ thuật.

- **Domain Services và Application Services:** Vai trò và trách nhiệm của các loại service này đã được định nghĩa chi tiết trong tài liệu Thiết kế Miền DAM. Trong tài liệu triển khai này, chúng ta xem xét cách các service kỹ thuật (DAM Query Service, DAM Command Service, DAM Processing Service) sẽ chứa và tổ chức các Domain Services và Application Services tương ứng theo mô hình Clean Architecture và CQRS. Chi tiết về từng Domain Service hoặc Application Service cụ thể (tên, phương thức, logic) sẽ không được lặp lại ở đây mà được tham chiếu đến tài liệu Thiết kế Miền.
- **Domain Events:** Các Domain Event mà DAM phát ra hoặc xử lý đã được xác định trong tài liệu Thiết kế Miền DAM, bao gồm mục đích và payload dự kiến. Tài liệu triển khai này mô tả cách các event đó được truyền tải vật lý trong hệ thống (sử dụng RabbitMQ) và cách các service lắng nghe/phát event. Chi tiết về từng loại Domain Event cụ thể sẽ không được lặp lại ở đây mà được tham chiếu đến tài liệu Thiết kế Miền.

## **4\. Đơn vị Triển khai (Deployment Units)**

### **4.1. Cấu trúc thư mục trong Nx Monorepo**

DAM sẽ được triển khai thành ba microservice riêng biệt, mỗi service nằm trong thư mục riêng của Nx Monorepo:

```
apps/
  services/
    dam-query/
      src/
        main.ts
        app.module.ts
        health/
    dam-command/
      src/
        main.ts
        app.module.ts
        health/
    dam-processing/
      src/
        main.ts
        app.module.ts
        health/
```

### **4.2. Mô hình Phân tách CQRS**

DAM áp dụng mô hình CQRS, phân tách rõ ràng giữa các thao tác đọc (Query) và ghi (Command):

1. **DAM Query Service:** Xử lý toàn bộ các thao tác đọc/truy vấn, bao gồm:
   - Tìm kiếm và lọc tài sản
   - Lấy thông tin chi tiết Asset/Folder
   - Lấy cấu trúc cây thư mục 
   - Tạo URL truy cập tài sản/rendition
   - Truy vấn lịch sử phiên bản

2. **DAM Command Service:** Xử lý các thao tác quản lý metadata và cấu trúc thư mục:
   - Cập nhật metadata tài sản
   - Quản lý thư mục (tạo, đổi tên, di chuyển)
   - Xóa mềm/khôi phục tài sản và thư mục
   - Khởi tạo quá trình tải lên tài sản mới

3. **DAM Processing Service:** Xử lý các tác vụ nặng liên quan đến file vật lý:
   - Xử lý file tải lên (lưu vào External Storage)
   - Tạo và quản lý rendition (thumbnail, kích thước khác nhau)
   - Quản lý phiên bản lịch sử khi cập nhật file
   - Xóa file vật lý
   - Xử lý event xóa Tenant từ BUM

### **4.3. Đơn vị Triển khai**

Dựa trên mô hình CQRS bắt buộc và tính chất nghiệp vụ của DAM, chúng tôi đề xuất triển khai thành **ba** đơn vị triển khai riêng biệt:

1. **DAM Query Service:**
   - **Trách nhiệm:** Xử lý tất cả các yêu cầu truy vấn (Queries) thông tin về Asset và Folder. Cung cấp khả năng tìm kiếm, lọc, phân trang, lấy thông tin chi tiết, và tạo URL truy cập.
   - **Mô hình:** Read Model của CQRS. Chứa các Application Services và Domain Services liên quan đến truy vấn.
   - **Yêu cầu phi chức năng:** Hiệu năng cao, độ trễ thấp. Tối ưu hóa cho volume truy vấn lớn.
   - **Giao tiếp:** Nhận Query thông qua cơ chế Request/Reply (NATS). Truy vấn PostgreSQL hoặc Search Index. Gọi IAM và LZM khi cần. Tích hợp với External Storage Service để tạo URL.

2. **DAM Command Service:**
   - **Trách nhiệm:** Xử lý các yêu cầu thay đổi trạng thái (Commands) metadata và folder. Đảm bảo tính toàn vẹn dữ liệu và logic nghiệp vụ.
   - **Mô hình:** Write Model của CQRS. Chứa các Application Services và Domain Services liên quan đến quản lý metadata/folder.
   - **Yêu cầu phi chức năng:** Đảm bảo tính toàn vẹn dữ liệu. Xử lý logic nghiệp vụ chính xác.
   - **Giao tiếp:** Nhận Command thông qua Request/Reply (NATS). Ghi dữ liệu vào PostgreSQL. Gọi IAM để kiểm tra ủy quyền. Phát Domain Events. Ghi log audit qua ALM.

3. **DAM Processing Service:**
   - **Trách nhiệm:** Xử lý các tác vụ nặng liên quan đến file vật lý và lắng nghe sự kiện hệ thống.
   - **Mô hình:** Kết hợp Event Consumer, Task Processor, và Command Handler.
   - **Yêu cầu phi chức năng:** Độ tin cậy cao cho việc xử lý file và event. Khả năng xử lý lỗi tốt.
   - **Giao tiếp:** Lắng nghe Events từ RabbitMQ (kể cả TenantDataDeletionRequested từ BUM). Xử lý file tải lên. Tương tác với External Storage Service. Tạo renditions. Phát Domain Events. Ghi log audit qua ALM.

## **5\. Nền tảng Công nghệ Cụ thể cho DAM**

DAM sẽ sử dụng nền tảng công nghệ chung của hệ thống Ecoma, với lựa chọn cụ thể cho lưu trữ dữ liệu, caching, xử lý file và tích hợp External Storage:

- **Cơ sở dữ liệu Chính:** PostgreSQL (Sử dụng TypeORM) \- Phù hợp cho dữ liệu có cấu trúc quan hệ như Asset, Folder, Metadata, Rendition, History. Cần sử dụng JSONB để lưu trữ metadata linh hoạt và Indexing (đặc biệt trên TenantId, FolderId, Asset Key/Name, Metadata Keys/Values) để tối ưu hóa hiệu năng truy vấn. Cần xem xét các tính năng Full-Text Search của PostgreSQL hoặc sử dụng Search Engine chuyên dụng cho việc tìm kiếm phức tạp.
- **Search Engine:** Elasticsearch (hoặc tương đương) \- **Cân nhắc sử dụng** làm lớp lưu trữ tối ưu cho việc tìm kiếm và lọc tài sản dựa trên metadata phức tạp và đa ngôn ngữ. Nếu sử dụng, dữ liệu từ PostgreSQL sẽ được đồng bộ sang Elasticsearch.
- **Cache/Tạm thời:** Redis \- Sử dụng cho caching dữ liệu thường xuyên được truy vấn trong DAM Query Service để giảm tải cho DB/Search Engine và cải thiện hiệu năng đọc, đặc biệt là:
  - Thông tin chi tiết Asset/Folder.
  - Kết quả các truy vấn tìm kiếm phổ biến.
  - URL truy cập file vật lý (có thể cache URL đã tạo với TTL).
- **Xử lý File:** Các thư viện xử lý file chuyên dụng (ví dụ: ImageMagick/GraphicsMagick cho ảnh, FFmpeg cho video) \- Được tích hợp vào DAM Processing Service để thực hiện việc tạo renditions.
- **External Storage Service (Adapter):** Triển khai các lớp Adapter chuyên biệt cho các hệ thống lưu trữ file bên ngoài (ví dụ: adapter cho Amazon S3, Google Cloud Storage) để trừu tượng hóa logic gọi API của nhà cung cấp.

## **6\. Lưu trữ Dữ liệu (Data Storage)**

DAM sẽ sở hữu cơ sở dữ liệu riêng (PostgreSQL), tách biệt với các BC khác. Redis được sử dụng làm lớp cache hiệu năng cao. Search Engine (Elasticsearch) có thể được sử dụng như một Read Model thứ cấp.

### **6.1. Schema PostgreSQL (Write Model & Primary Read Model)**

Thiết kế schema cho PostgreSQL để lưu trữ các Aggregate Root và Entity chính của DAM.

**Bảng assets:**

- id UUID PRIMARY KEY
- tenant_id UUID NOT NULL \-- Liên kết với IAM
- original_file_name VARCHAR(255) NOT NULL
- stored_file_name VARCHAR(255) NOT NULL \-- Tên file gốc hiện tại trong storage
- file_path TEXT NOT NULL \-- Đường dẫn đến file gốc hiện tại trong storage
- mime_type VARCHAR(100) NOT NULL
- file_size BIGINT NOT NULL
- uploaded_by_user_id UUID NOT NULL \-- Liên kết với IAM
- uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL
- status VARCHAR(50) NOT NULL DEFAULT 'Uploading' \-- AssetStatus Value Object
- current_version INTEGER NOT NULL DEFAULT 1
- folder_id UUID \-- Optional, FOREIGN KEY folders(id) ON DELETE SET NULL
- created_at TIMESTAMP WITH TIME ZONE NOT NULL
- updated_at TIMESTAMP WITH TIME ZONE NOT NULL

**Bảng asset_metadata:** (Thuộc assets)

- id UUID PRIMARY KEY
- asset_id UUID NOT NULL, FOREIGN KEY assets(id) ON DELETE CASCADE
- key VARCHAR(255) NOT NULL
- value TEXT \-- Giá trị metadata
- locale VARCHAR(10) \-- Optional, Locale Value Object string (liên kết với RDM/LZM)
- created_at TIMESTAMP WITH TIME ZONE NOT NULL
- updated_at TIMESTAMP WITH TIME ZONE NOT NULL
- UNIQUE (asset_id, key, locale)

**Bảng asset_renditions:** (Thuộc assets)

- id UUID PRIMARY KEY
- asset_id UUID NOT NULL, FOREIGN KEY assets(id) ON DELETE CASCADE
- rendition_type VARCHAR(50) NOT NULL \-- RenditionType Value Object string
- stored_file_name VARCHAR(255) NOT NULL
- file_path TEXT NOT NULL
- mime_type VARCHAR(100) NOT NULL
- file_size BIGINT NOT NULL
- width INTEGER \-- Optional
- height INTEGER \-- Optional
- created_at TIMESTAMP WITH TIME ZONE NOT NULL
- UNIQUE (asset_id, rendition_type)

**Bảng asset_history:** (Thuộc assets)

- id UUID PRIMARY KEY
- asset_id UUID NOT NULL, FOREIGN KEY assets(id) ON DELETE CASCADE
- version INTEGER NOT NULL
- stored_file_name VARCHAR(255) NOT NULL
- file_path TEXT NOT NULL
- uploaded_by_user_id UUID NOT NULL
- uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL
- UNIQUE (asset_id, version)

**Bảng folders:**

- id UUID PRIMARY KEY
- tenant_id UUID NOT NULL \-- Liên kết với IAM
- name VARCHAR(255) NOT NULL
- parent_folder_id UUID \-- Optional, FOREIGN KEY folders(id) ON DELETE CASCADE
- path TEXT NOT NULL \-- Đường dẫn đầy đủ (ví dụ: "/images/products")
- status VARCHAR(50) NOT NULL DEFAULT 'Active' \-- FolderStatus (Active, SoftDeleted)
- created_at TIMESTAMP WITH TIME ZONE NOT NULL
- updated_at TIMESTAMP WITH TIME ZONE NOT NULL
- UNIQUE (tenant_id, parent_folder_id, name) \-- Tên thư mục duy nhất trong thư mục cha và tenant
- UNIQUE (tenant_id, path) \-- Đường dẫn đầy đủ duy nhất trong tenant

**Chỉ mục (Indexes):**

- CREATE INDEX idx_assets_tenant_folder ON assets (tenant_id, folder_id);
- CREATE INDEX idx_assets_status ON assets (status);
- CREATE INDEX idx_assets_uploaded_at ON assets (uploaded_at);
- CREATE INDEX idx_asset_metadata_asset_key_locale ON asset_metadata (asset_id, key, locale);
- CREATE INDEX idx_asset_renditions_asset_type ON asset_renditions (asset_id, rendition_type);
- CREATE INDEX idx_asset_history_asset_version ON asset_history (asset_id, version);
- CREATE INDEX idx_folders_tenant_parent ON folders (tenant_id, parent_folder_id);
- CREATE UNIQUE INDEX idx_folders_tenant_path ON folders (tenant_id, path);
- CREATE INDEX idx_folders_status ON folders (status);
- \-- Cần thêm chỉ mục cho tìm kiếm Full-Text Search trên metadata nếu không dùng Search Engine

### **6.2. Cấu trúc Cache Redis (Read Model Cache)**

Redis sẽ được sử dụng làm lớp cache cho DAM Query Service để lưu trữ các dữ liệu thường xuyên được truy vấn và yêu cầu hiệu năng cao.

**Chiến lược Key:**

- **Cache thông tin chi tiết Asset theo ID:** dam:asset:id:\<asset_id\>
- **Cache thông tin chi tiết Folder theo ID:** dam:folder:id:\<folder_id\>
- **Cache thông tin chi tiết Folder theo Tenant ID và Path:** dam:folder:tenant:\<tenant_id\>:path:\<encoded_path\>
- **Cache URL truy cập file:** dam:url:\<asset_id\>:\<rendition_type\>:\<expiration_timestamp_or_hash\> (Key này phức tạp, có thể đơn giản hóa hoặc chỉ cache URL ngắn hạn)
- **Cache kết quả truy vấn tìm kiếm:** dam:search:\<hash_of_query_criteria\>

**Chiến lược Value:**

Lưu trữ dữ liệu dưới dạng JSON string.

**Chiến lược Cache Invalidation:**

Khi có bất kỳ thay đổi nào đối với dữ liệu trong DAM Command Service hoặc DAM Processing Service:

- **Từ DAM Command Service (phát Event):**
  - AssetMetadataUpdated, AssetStatusChanged, AssetRestored: Invalidate cache key Asset chi tiết (dam:asset:id:\<asset_id\>).
  - FolderCreated, FolderRenamed, FolderMoved, FolderSoftDeleted, FolderRestored: Invalidate cache key Folder chi tiết (dam:folder:id:\<folder_id\>, dam:folder:tenant:\<tenant_id\>:path:\<encoded_path\>) và kết quả truy vấn Folder/Asset liên quan đến thư mục đó.
- **Từ DAM Processing Service (phát Event):**
  - AssetUploaded, AssetRenditionCreated: Invalidate cache key Asset chi tiết (dam:asset:id:\<asset_id\>). Cần re-cache thông tin Asset mới/cập nhật.
  - AssetHardDeleted, FolderHardDeleted: Xóa cache key Asset/Folder liên quan.
- Cache URL truy cập file cần TTL ngắn theo thời gian hết hạn của URL.
- Cache kết quả truy vấn tìm kiếm có thể có TTL ngắn hơn hoặc cần invalidation khi có Asset/Folder mới được tạo/cập nhật/xóa.

## **7\. Giao tiếp và Tích hợp**

DAM tương tác với nhiều BC khác và External Storage Service.

- **Nhận Commands/Queries:**
  - DAM Command Service nhận Commands quản lý metadata/folder qua Request/Reply (từ API Gateway/DAMS).
  - DAM Query Service nhận Queries truy vấn dữ liệu/lấy URL qua Request/Reply (từ API Gateway/Consumer BCs/DAMS).
  - DAM Processing Service nhận Commands/Events để xử lý file (Upload, Generate Rendition, Delete Physical File) qua Message Broker (RabbitMQ) hoặc Command Queue.
- **Phát Domain Events:**
  - DAM Command Service phát các Event về thay đổi metadata/folder (AssetMetadataUpdated, FolderCreated, etc.).
  - DAM Processing Service phát các Event về tải lên, tạo rendition, xử lý lỗi, xóa cứng (AssetUploaded, AssetRenditionCreated, AssetProcessingFailed, AssetHardDeleted, FolderHardDeleted).
  - Tất cả các service gọi ALM (qua Request/Reply hoặc Event) để ghi log audit.
- **Lắng nghe Domain Events:**
  - DAM Processing Service lắng nghe TenantDataDeletionRequested từ BUM.
  - DAM Processing Service cũng lắng nghe AssetUploaded hoặc nhận Command để kích hoạt tạo rendition.
- **Tương tác với IAM:**
  - DAM Command Service và DAM Query Service gọi IAM (qua Request/Reply) để kiểm tra ủy quyền cho các thao tác quản lý và truy vấn.
- **Tương tác với LZM & RDM:**
  - DAM Command Service gọi LZM/RDM (qua Request/Reply) để xác thực Locale và hỗ trợ quản lý metadata đa ngôn ngữ.
  - DAM Query Service gọi LZM (qua Request/Reply) để hỗ trợ truy vấn/hiển thị metadata đa ngôn ngữ.
  - DAM có thể gọi RDM để lấy dữ liệu tham chiếu (ví dụ: loại file được hỗ trợ).
- **Tương tác với ALM:**
  - Tất cả các service DAM gọi ALM (qua Request/Reply hoặc Event) để ghi log audit cho các hành động quan trọng.
- **Tương tác với External Storage Service (Adapter):**
  - DAM Processing Service và DAM Query Service (khi tạo URL) gọi External Storage Service (qua Adapter) để lưu/đọc/xóa file vật lý và tạo URL truy cập.
- **Tương tác với Search Engine (Optional):**
  - DAM Command Service hoặc một worker riêng đồng bộ dữ liệu Asset/Metadata sang Search Engine.
  - DAM Query Service truy vấn Search Engine cho các yêu cầu tìm kiếm phức tạp.

## **8\. Định nghĩa API Endpoint và Mapping Use Case**

Phần này phác thảo các API Endpoint chính mà DAM cung cấp thông qua API Gateway (đối với các tương tác từ bên ngoài hệ thống) và mapping chúng với các Use Case đã định nghĩa trong tài liệu Thiết kế Miền DAM.

| API Endpoint (Ví dụ)                       | Phương thức HTTP | Mô tả Chức năng Cấp cao                                                            | Use Case Liên quan (dam.md)                                                                                                | Loại Yêu cầu Nội bộ (CQRS) | Service Xử lý                                  |
| :----------------------------------------- | :--------------- | :--------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------- | :------------------------- | :--------------------------------------------- |
| /api/v1/dam/assets/upload                  | POST             | Tải lên tài sản mới.                                                               | Tải lên Tài sản Mới (8.1.1)                                                                                                | Command                    | DAM Processing Service (qua API Gateway) |
| /api/v1/dam/assets/{assetId}/file          | PUT              | Cập nhật file gốc của tài sản (tạo phiên bản lịch sử).                             | Cập nhật File Tài sản (Tạo Phiên bản Lịch sử) (8.1.2)                                                                      | Command                    | DAM Processing Service (qua API Gateway) |
| /api/v1/dam/assets/{assetId}/metadata      | PUT              | Cập nhật metadata tài sản (bao gồm đa ngôn ngữ).                                   | Quản lý Metadata Tài sản (Bao gồm Đa ngôn ngữ) (8.1.3)                                                                     | Command                    | DAM Command Service                            |
| /api/v1/dam/assets/{assetId}/soft-delete   | POST             | Xóa mềm tài sản.                                                                   | Xóa Mềm Tài sản/Thư mục (8.4.1)                                                                                            | Command                    | DAM Command Service                            |
| /api/v1/dam/assets/{assetId}/restore       | POST             | Khôi phục tài sản đã xóa mềm.                                                      | Xóa Mềm Tài sản/Thư mục (8.4.1)                                                                                            | Command                    | DAM Command Service                            |
| /api/v1/dam/folders                        | POST             | Tạo thư mục mới.                                                                   | Quản lý Thư mục (8.2.1)                                                                                                    | Command                    | DAM Command Service                            |
| /api/v1/dam/folders/{folderId}             | PUT              | Cập nhật thư mục (đổi tên, di chuyển).                                             | Quản lý Thư mục (8.2.1)                                                                                                    | Command                    | DAM Command Service                            |
| /api/v1/dam/folders/{folderId}/soft-delete | POST             | Xóa mềm thư mục.                                                                   | Xóa Mềm Tài sản/Thư mục (8.4.1)                                                                                            | Command                    | DAM Command Service                            |
| /api/v1/dam/folders/{folderId}/restore     | POST             | Khôi phục thư mục đã xóa mềm.                                                      | Xóa Mềm Tài sản/Thư mục (8.4.1)                                                                                            | Command                    | DAM Command Service                            |
| /api/v1/dam/assets/search                  | POST             | Tìm kiếm và lọc tài sản dựa trên tiêu chí.                                         | Tìm kiếm và Lọc Tài sản (8.3.1)                                                                                            | Query                      | DAM Query Service                              |
| /api/v1/dam/folders/{folderId}/content     | GET              | Lấy nội dung (assets và subfolders) của một thư mục.                               | Tìm kiếm và Lọc Tài sản (8.3.1)                                                                                            | Query                      | DAM Query Service                              |
| /api/v1/dam/folders/tree                   | GET              | Lấy cấu trúc cây thư mục của tenant.                                               | Quản lý Thư mục (8.2.1)                                                                                                    | Query                      | DAM Query Service                              |
| /api/v1/dam/assets/{assetId}               | GET              | Lấy thông tin chi tiết tài sản.                                                    | Tìm kiếm và Lọc Tài sản (8.3.1)                                                                                            | Query                      | DAM Query Service                              |
| /api/v1/dam/assets/{assetId}/url           | GET              | Lấy URL truy cập file gốc hoặc rendition.                                          | Lấy URL Truy cập Tài sản/Phiên bản (8.3.2)                                                                                 | Query                      | DAM Query Service                              |
| /api/v1/internal/dam/tenant-deletion       | POST             | Endpoint nội bộ để nhận Event xóa Tenant từ BUM (có thể dùng thay Event Consumer). | Xóa Cứng Dữ liệu Tài sản của Tenant (8.4.2)                                                                                | Command                    | DAM Processing Service (Internal API)           |
| /api/v1/internal/dam/generate-renditions   | POST             | Kích hoạt tạo rendition bất đồng bộ (dành cho Worker nội bộ hoặc Event Listener).  | Tải lên Tài sản Mới (8.1.1), Cập nhật File Tài sản (Tạo Phiên bản Lịch sử) (8.1.2), Tạo Phiên bản (rendition) theo yêu cầu | Command                    | DAM Processing Service (Internal API)    |
| /api/v1/internal/dam/delete-physical-file  | POST             | Kích hoạt xóa file vật lý bất đồng bộ.                                             | Xóa Cứng Dữ liệu Tài sản của Tenant (8.4.2)                                                                                | Command                    | DAM Processing Service (Internal API)    |

_Lưu ý: Đây là các endpoint ví dụ. Tên và cấu trúc cụ thể có thể được tinh chỉnh trong quá trình thiết kế kỹ thuật chi tiết. Các endpoint /api/v1/internal/... là các endpoint nội bộ, không được public ra ngoài qua API Gateway thông thường._

## **9\. Chiến lược Xử lý Lỗi (Error Handling Strategy)**

Chiến lược xử lý lỗi trong DAM sẽ tuân thủ mô hình chung của Ecoma và phân biệt giữa các loại lỗi, kênh giao tiếp:

- **Lỗi Nghiệp vụ (Business Rule Exceptions):** Các lỗi phát sinh do vi phạm quy tắc nghiệp vụ (ví dụ: tên folder đã tồn tại trong thư mục cha, cố gắng di chuyển thư mục vào chính nó hoặc thư mục con, thiếu quyền truy cập, file tải lên không hợp lệ) sẽ được ném ra từ Domain Services và bắt ở lớp Application Service hoặc lớp xử lý Command/Query/Task.
  - **Đối với giao tiếp Request/Reply (Command/Query API):** Lỗi nghiệp vụ sẽ được chuyển đổi thành phản hồi lỗi có cấu trúc (JSON object) bao gồm mã lỗi và thông báo chi tiết, được trả về cho bên gọi (HTTP status code 400 Bad Request). Lỗi ủy quyền (sau khi gọi IAM) trả về 403 Forbidden.
  - **Đối với giao tiếp qua Message Broker/Internal APIs (Upload/Processing, Processing Service):** Lỗi nghiệp vụ xảy ra trong quá trình xử lý (ví dụ: Upload Service nhận command với dữ liệu file không hợp lệ) sẽ được ghi log chi tiết. Các bản ghi Asset/Folder liên quan có thể được đánh dấu trạng thái Failed với lý do cụ thể. Các Event/Command gốc có thể được chuyển vào DLQ. Phát các Event thông báo lỗi (AssetProcessingFailed).
- **Lỗi Kỹ thuật (Technical Errors):** Các lỗi phát sinh ở lớp Infrastructure (ví dụ: lỗi kết nối DB, lỗi kết nối Message Broker, lỗi cache Redis, lỗi gọi IAM/LZM/RDM/ALM API, lỗi từ External Storage Service Adapter, lỗi từ công cụ xử lý file).
  - Các lỗi này cần được ghi log chi tiết (Structured Logging) với mức độ phù hợp (ERROR), bao gồm stack trace và các thông tin tương quan.
  - **Đối với giao tiếp Request/Reply (Command/Query API):** Lỗi kỹ thuật sẽ được chuyển đổi thành phản hồi lỗi chung (HTTP status code 500 Internal Server Error), ghi log chi tiết ở phía server.
  - **Đối với giao tiếp qua Message Broker/Internal APIs (Upload/Processing, Processing Service):** Lỗi kỹ thuật sẽ được xử lý theo cơ chế retry của RabbitMQ (đối với Event) hoặc retry nội bộ (đối với các tác vụ khác như gọi External Storage). Nếu retry vẫn thất bại, message/tác vụ có thể được chuyển vào DLQ hoặc đánh dấu bản ghi liên quan là Failed. Lỗi cũng cần được ghi log và có thể kích hoạt cảnh báo.
  - **Đối với External Storage Service/File Processing Tools:** Lỗi từ Adapter hoặc công cụ xử lý file cần được phân loại và xử lý phù hợp (retry, đánh dấu failed).
- **Lỗi Validate Input:** Đối với các yêu cầu nhận được qua API Endpoint hoặc các Commands/Events nội bộ, lỗi validate input sẽ được xử lý ở lớp Application Service hoặc Handler trước khi xử lý logic nghiệp vụ. Phản hồi lỗi sử dụng HTTP status code 400 Bad Request hoặc đánh dấu bản ghi Request/Message là Failed.
- **Thông báo Lỗi:** Các lỗi quan trọng (lỗi kết nối DB kéo dài, lỗi Upload/Processing liên tục, lỗi xử lý Event xóa Tenant, lỗi tác vụ định kỳ thất bại) cần kích hoạt cảnh báo thông qua hệ thống giám sát.

## **10\. Khả năng Phục hồi (Resiliency)**

Để đảm bảo DAM chịu lỗi và phục hồi khi các phụ thuộc gặp sự cố và xử lý volume dữ liệu/request lớn:

- **Timeouts và Retries:** Cấu hình timeouts và retry policies cho các cuộc gọi đi đến các phụ thuộc (PostgreSQL, Redis, NATS, RabbitMQ, IAM API, LZM API, RDM API, ALM API, External Storage Service API, Search Engine API). Sử dụng các thư viện hỗ trợ retry với exponential backoff và jitter. Quan trọng với việc gọi IAM (AuthZ), External Storage Service, và Search Engine.
- **Circuit Breaker:** Áp dụng mẫu Circuit Breaker cho các cuộc gọi đến các phụ thuộc có khả năng gặp sự cố tạm thời (ví dụ: gọi External Storage Service, Search Engine) để ngăn chặn các cuộc gọi liên tục gây quá tải.
- **Bulkhead:** Sử dụng Bulkhead để cô lập tài nguyên giữa các đơn vị triển khai của DAM (Command Service, Query Service, Processing Service). Trong Query Service, có thể cô lập tài nguyên cho luồng tìm kiếm/lấy URL tốc độ cao so với các truy vấn dữ liệu quản lý. Trong Processing Service, cô lập tài nguyên cho các loại tác vụ khác nhau (upload, generate rendition, delete).
- **Health Checks:** Triển khai các loại Health Check Probe trong Kubernetes cho mỗi service DAM:
  - **Startup Probe:** Kiểm tra xem ứng dụng đã khởi động hoàn toàn (kết nối đến DB, Message Broker, Cache đã sẵn sàng).
  - **Liveness Probe:** Kiểm tra xem ứng dụng có đang chạy và khỏe mạnh không. Kiểm tra vòng lặp xử lý message/request/task.
  - **Readiness Probe:** Kiểm tra xem ứng dụng đã sẵn sàng xử lý request/message chưa. Kiểm tra kết nối đến **PostgreSQL** (nguồn dữ liệu chính), **Redis** (nếu sử dụng cache), **Message Broker** (đối với Command Service và Processing Service), khả năng kết nối đến **IAM API**, **LZM API**, **RDM API** (đối với các service phụ thuộc). Đối với Query Service, cần kiểm tra khả năng kết nối đến **Search Engine** (nếu sử dụng) và **External Storage Service** (để tạo URL). Đối với Processing Service, cần kiểm tra khả năng kết nối đến **External Storage Service** và **công cụ xử lý file**.
- **Idempotency:** Thiết kế Command Handlers (đặc biệt là trong Processing Service) và Event Handlers có tính Idempotent để việc nhận và xử lý trùng lặp một yêu cầu tải lên, tạo rendition, hoặc xóa Tenant không gây ra kết quả không mong muốn. Sử dụng ID yêu cầu gốc hoặc ID từ Event payload làm key kiểm tra trùng lặp.
- **Queue Monitoring:** Giám sát độ dài hàng đợi (Queue Length) của RabbitMQ cho các queue mà DAM Processing Service lắng nghe.

## **11\. Chiến lược Kiểm thử (Testing Strategy)**

Chiến lược kiểm thử cho DAM sẽ tuân thủ mô hình chung của Ecoma:

- **Unit Tests:** Kiểm thử logic nghiệp vụ cốt lõi trong Domain Model (ví dụ: logic quản lý versioning/rendition, logic cây thư mục, logic áp dụng metadata đa ngôn ngữ), logic xử lý trong Application Services (mapping Commands/Queries/Events sang Domain Service calls) một cách độc lập (sử dụng mock cho Repository, Gateway, Broker, IAM/LZM/RDM client, External Storage Service Adapter, File Processing Tools).
- **Integration Tests:** Kiểm thử sự tương tác giữa các thành phần nội bộ của từng service/worker (ví dụ: Command Service xử lý Command và gọi Repository để ghi vào DB thực hoặc Testcontainers; Query Service nhận Query, gọi IAM/LZM mock/testcontainer, gọi Repository/Search Index mock/testcontainer; Processing Service xử lý Command/Event, gọi External Storage Service Adapter mock/testcontainer, gọi Rendition Service mock/testcontainer).
- **End-to-End Tests (E2E Tests):** Kiểm thử luồng nghiệp vụ hoàn chỉnh xuyên qua các service (ví dụ: tải file lên qua API Gateway \-\> DAM Processing Service xử lý, lưu file, tạo renditions, phát Event \-\> các BC khác có thể truy vấn Asset/Rendition info và lấy URL từ DAM Query Service \-\> lắng nghe Event xóa Tenant từ BUM và kiểm tra xem dữ liệu có bị xóa cứng trong DAM và External Storage không).
- **Contract Tests:** Đảm bảo schema của các Domain Event mà DAM phát ra và lắng nghe tuân thủ "hợp đồng" với các BC khác. Đảm bảo API Endpoint của DAM Query/Command Service tuân thủ "hợp đồng" với các Consumer (sử dụng OpenAPI spec). Đảm bảo "hợp đồng" với External Storage Service Adapter và Search Engine.
- **Component Tests:** Kiểm thử từng service/worker DAM (Command Service, Query Service, Processing Service) trong môi trường gần với production, với các phụ thuộc (DB, Redis, Message Broker, IAM, LZM, RDM, ALM, External Storage Service, Search Engine) được giả lập hoặc sử dụng Testcontainers.
- **Performance/Load Tests:** Kiểm thử tải để xác minh DAM Processing Service có thể xử lý volume file tải lên và tạo rendition dự kiến, DAM Query Service có thể đáp ứng yêu cầu hiệu năng cao cho luồng tìm kiếm và lấy URL.

## **12\. Chiến lược Di chuyển Dữ liệu (Data Migration Strategy)**

Quản lý thay đổi schema database PostgreSQL của DAM cần được thực hiện cẩn thận:

- Sử dụng công cụ quản lý migration schema tự động (ví dụ: Flyway hoặc Liquibase).
- Thiết kế các migration có tính **Backward Compatibility** (chỉ thêm, không xóa/sửa đổi các cột/bảng quan trọng).
- Lập kế hoạch **rollback** cho các migration.
- Đối với các thay đổi dữ liệu phức tạp (ví dụ: chuẩn hóa metadata cũ, cập nhật đường dẫn file sau khi di chuyển storage), viết **Data Migration Script** riêng biệt.
- Đảm bảo có bản sao lưu (backup) dữ liệu trước khi thực hiện các migration quan trọng.
- Đối với dữ liệu file vật lý trong External Storage, cần có chiến lược di chuyển file nếu cần thay đổi nhà cung cấp hoặc cấu trúc lưu trữ, đồng bộ với việc cập nhật file_path trong Database DAM.

## **13\. Kế hoạch Dung lượng (Capacity Planning \- Initial)**

Dựa trên ước tính ban đầu về số lượng Asset, Folder, volume file tải lên, tần suất truy vấn, đưa ra ước tính ban đầu về tài nguyên cần thiết cho mỗi đơn vị triển khai của DAM:

- **DAM Query Service:** Dự kiến nhận lượng request _rất lớn_ cho việc tìm kiếm và lấy URL từ các BC khác và DAMS.
  - Số lượng Pod tối thiểu: 5-10
  - Số lượng Pod tối đa: 20+
  - Giới hạn CPU mỗi Pod: 500m \- 1000m
  - Giới hạn Memory mỗi Pod: 512Mi \- 1Gi
  - Cấu hình HPA: Chủ yếu dựa trên CPU Utilization và Request Rate.
- **DAM Command Service:** Nhận lượng request quản lý metadata/folder (dự kiến không quá lớn).
  - Số lượng Pod tối thiểu: 3-5
  - Số lượng Pod tối đa: 5-10
  - Giới hạn CPU mỗi Pod: 300m \- 700m
  - Giới hạn Memory mỗi Pod: 512Mi \- 1Gi
  - Cấu hình HPA: Dựa trên CPU Utilization và Request Rate.
- **DAM Processing Service:** Dự kiến xử lý volume file tải lên và tạo rendition _lớn_. Đây có thể là service tốn tài nguyên nhất.
  - Số lượng Pod tối thiểu: 5-10
  - Số lượng Pod tối đa: 20+ (có thể cần scale rất cao)
  - Giới hạn CPU mỗi Pod: 1000m \- 2000m (cho xử lý file)
  - Giới hạn Memory mỗi Pod: 1Gi \- 2Gi (cho xử lý file trong bộ nhớ)
  - Cấu hình HPA: Chủ yếu dựa trên CPU Utilization và độ dài hàng đợi Command/Task.
- **PostgreSQL Database:** Cần được cấu hình mạnh mẽ để xử lý lượng ghi từ Command Service/Processing Service và lượng đọc từ Query Service.
  - Kích thước đĩa ban đầu: 100GB+ (dự kiến dữ liệu Asset, Metadata, Rendition, History sẽ tăng trưởng rất nhanh)
  - RAM: 16GB \- 32GB+
  - CPU: 4-8+ core
  - Cần cấu hình Connection Pooling hiệu quả và tối ưu hóa indexing.
- **Search Engine (Optional):** Nếu sử dụng, cần cấu hình phù hợp với volume dữ liệu và tải truy vấn.
- **Redis Cache:** Cần đủ bộ nhớ để lưu trữ dữ liệu cached.
  - Kích thước bộ nhớ cần thiết: Ước tính dựa trên số lượng Asset/Folder active và tần suất truy cập (ví dụ: 10GB \- 20GB+).
- **External Storage Service:** Cần cấu hình dung lượng lưu trữ phù hợp với volume file dự kiến (có thể petabytes).

Các con số này cần được xem xét kỹ lưỡng hơn dựa trên phân tích tải chi tiết và được theo dõi, điều chỉnh liên tục sau khi hệ thống đi vào hoạt động.

## **14\. Phụ thuộc (Dependencies)**

- **Phụ thuộc Nội bộ (Internal Dependencies):**
  - Các BC khác (PIM, MPM, CRM, NDM, ITM, WPM, v.v.) là Consumer của DAM Query Service.
  - DAMS (Digital Asset Management System \- Giao diện người dùng) là Consumer của DAM Command/Query Service và Producer của Commands tải lên.
  - IAM là nhà cung cấp dịch vụ ủy quyền cho DAM Command Service và DAM Query Service.
  - LZM và RDM là nhà cung cấp dữ liệu bản địa hóa/tham chiếu cho DAM Command Service và DAM Query Service.
  - ALM là Consumer của các sự kiện audit log từ DAM.
  - BUM là Producer của Event TenantDataDeletionRequested mà DAM Processing Service lắng nghe.
- **Phụ thuộc Bên ngoài (External Dependencies):**
  - Database (PostgreSQL, Redis).
  - Message Brokers (NATS, RabbitMQ).
  - External Storage Service (Amazon S3, Google Cloud Storage, v.v.).
  - File Processing Tools (ImageMagick, FFmpeg, v.v.).
  - Search Engine (Elasticsearch, v.v.) \- Optional.
  - Container Registry.
  - Kubernetes API.

## **15\. Kết luận**

Tài liệu thiết kế triển khai cho Bounded Context Digital Asset Management (DAM) đã được xây dựng dựa trên tài liệu thiết kế miền DAM và tuân thủ chặt chẽ kiến trúc Microservices, CQRS và Clean Architecture của hệ thống Ecoma. Việc phân tách DAM thành ba đơn vị triển khai riêng biệt (Query Service, Command Service, Processing Service) là cần thiết để đáp ứng yêu cầu về hiệu năng cao cho luồng truy vấn/tìm kiếm/lấy URL, quản lý dữ liệu, xử lý file vật lý tốn thời gian và bất đồng bộ, và quản lý vòng đời dữ liệu. Việc sử dụng PostgreSQL (có thể kết hợp Search Engine), Redis cho cache, các công cụ xử lý file và Adapter cho External Storage Service được lựa chọn để đảm bảo tính toàn vẹn, hiệu năng và khả năng mở rộng cần thiết. Các khía cạnh quan trọng về giao tiếp (Request/Reply, Eventing), xử lý lỗi, khả năng phục hồi, kiểm thử và vận hành đã được đề cập, phác thảo các chiến lược và yêu cầu kỹ thuật.

Tài liệu này cung cấp nền tảng vững chắc cho đội ngũ kỹ thuật để tiến hành thiết kế kỹ thuật chi tiết hơn (ví dụ: chi tiết implementation của Domain/Application Service, cấu trúc Command/Query/Event payload chi tiết, thiết kế các Adapter External Storage Service và tích hợp công cụ xử lý file) và bắt đầu quá trình triển khai thực tế Microservice(s) DAM, đảm bảo tuân thủ các nguyên tắc và mục tiêu kiến trúc của hệ thống Ecoma.

## **16\. Health Checks**

Mỗi service trong DAM phải triển khai các health check endpoints để Kubernetes hoặc các hệ thống giám sát khác có thể kiểm tra sức khỏe của service. Các health check này bao gồm:

1. **DAM Query Service:**
   - **Liveness probe:** Đảm bảo service đang chạy và phản hồi.
   - **Readiness probe:** Kiểm tra kết nối đến PostgreSQL, Redis, Elasticsearch (nếu sử dụng), và External Storage Service API.
   - **Startup probe:** Đảm bảo service đã khởi động hoàn tất và sẵn sàng xử lý request.

2. **DAM Command Service:**
   - **Liveness probe:** Đảm bảo service đang chạy và phản hồi.
   - **Readiness probe:** Kiểm tra kết nối đến PostgreSQL, NATS, RabbitMQ (cho việc phát event).
   - **Startup probe:** Đảm bảo service đã khởi động hoàn tất và sẵn sàng xử lý command.

3. **DAM Processing Service:**
   - **Liveness probe:** Đảm bảo service đang chạy và phản hồi.
   - **Readiness probe:** Kiểm tra kết nối đến PostgreSQL, RabbitMQ, External Storage Service, và các công cụ xử lý file.
   - **Startup probe:** Đảm bảo service đã khởi động hoàn tất và sẵn sàng xử lý task.

## **17\. Giám sát và Ghi Log**

### **17.1. Metrics**

Mỗi service trong DAM sẽ thu thập và export các metrics sau để giám sát hiệu năng và trạng thái hoạt động:

1. **DAM Query Service:**
   - Số lượng và độ trễ của các request tìm kiếm và lấy URL.
   - Tỷ lệ cache hit/miss trong Redis.
   - Thời gian truy vấn từ PostgreSQL hoặc Elasticsearch.
   - Số lượng request và tỷ lệ lỗi khi tạo URL từ External Storage Service.

2. **DAM Command Service:**
   - Số lượng và độ trễ của các command được xử lý.
   - Tỷ lệ lỗi khi xử lý command.
   - Số lượng và độ trễ của các gọi IAM API để kiểm tra ủy quyền.

3. **DAM Processing Service:**
   - Số lượng file tải lên và xử lý mỗi phút.
   - Thời gian xử lý trung bình cho mỗi file (upload, generate rendition, delete).
   - Kích thước file trung bình.
   - Tỷ lệ lỗi khi tải lên, xử lý file, và ghi vào External Storage.
   - Độ sâu của hàng đợi các task đang chờ xử lý.

### **17.2. Logging**

Tất cả các service trong DAM sẽ triển khai ghi log cấu trúc (structured logging) với các trường thông tin sau:

- TraceId để theo dõi một request hoặc task xuyên suốt các service.
- SpanId để xác định các bước xử lý cụ thể trong một trace.
- Thông tin về TenantId, AssetId, FolderId (nếu có) để dễ dàng lọc log theo context.
- Log level thích hợp (ERROR, WARN, INFO, DEBUG) tùy theo tầm quan trọng của sự kiện.
- Thông tin về người dùng thực hiện hành động (UserId).
- Thông tin về thiết bị/client gửi request (nếu có).

## **18\. Kế hoạch Dung lượng bổ sung**

### **18.1. External Storage Service:**

- Dự kiến lưu trữ file gốc và các rendition cho hàng triệu tài sản.
- Giả định kích thước file trung bình (bao gồm tất cả renditions) là 5MB, cần dự trù ít nhất 5TB dung lượng ban đầu cho mỗi triệu tài sản.
- Tỷ lệ tăng trưởng dự kiến phụ thuộc vào số lượng tài sản mới mỗi ngày và kích thước trung bình. Cần giám sát và điều chỉnh.

### **18.2. Băng thông mạng:**

- DAM Processing Service cần băng thông mạng cao đến External Storage Service để tải lên/tải xuống file.
- DAM Query Service cần băng thông đủ để cung cấp URL và dữ liệu metadata với độ trễ thấp.
- Cân nhắc triển khai Multizone nếu cần phục vụ người dùng toàn cầu.

### **18.3. CPU và Memory:** 

- Xử lý file hình ảnh/video trong DAM Processing Service đòi hỏi CPU và memory cao.
- Cần đảm bảo Kubernetes memory limits đủ cao để xử lý file lớn mà không gây OOM.
- Cân nhắc sử dụng node pools chuyên biệt cho DAM Processing Service nếu cần xử lý file rất lớn.
