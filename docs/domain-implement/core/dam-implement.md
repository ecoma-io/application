# **Tài liệu Thiết kế Triển khai: Bounded Context Digital Asset Management (DAM)**

## **1\. Giới thiệu**

Tài liệu này mô tả chi tiết thiết kế triển khai cho Bounded Context Digital Asset Management (DAM) trong hệ thống Ecoma. DAM là một Bounded Context thuộc nhóm Feature Bounded Context (Master Data), chịu trách nhiệm quản lý toàn bộ các tài sản kỹ thuật số (hình ảnh, video, tài liệu, v.v.) được sử dụng trên toàn bộ nền tảng Ecoma. Tài liệu này tập trung vào các khía cạnh kỹ thuật triển khai riêng cho DAM, bao gồm cấu trúc service, công nghệ sử dụng cụ thể trong DAM, lưu trữ dữ liệu, giao tiếp đặc thù của DAM, hạ tầng, và các yêu cầu phi chức năng liên quan đến triển khai.

Mục tiêu của tài liệu này là cung cấp hướng dẫn chi tiết cho đội ngũ kỹ thuật để xây dựng, triển khai và vận hành Microservice(s) hiện thực hóa Bounded Context DAM, đảm bảo tuân thủ các nguyên tắc kiến trúc tổng thể của Ecoma (Microservices, DDD, EDA, CQRS, Clean Architecture) và đạt được các mục tiêu hệ thống (Tính sẵn sàng cao, Khả năng mở rộng, Hiệu năng, Bảo mật).

## **2\. Bối cảnh Kiến trúc Tổng thể**

Hệ thống Ecoma được xây dựng trên nền tảng kiến trúc Microservices, phân rã theo Bounded Contexts của DDD. Giao tiếp giữa các service backend chủ yếu sử dụng Event-Driven Architecture (EDA) và Request/Reply. Bên trong mỗi service, mô hình CQRS và Clean Architecture được áp dụng bắt buộc.

DAM là một Feature Bounded Context, đóng vai trò là kho lưu trữ tập trung và quản lý các tài sản kỹ thuật số. DAM nhận yêu cầu quản lý tài sản (tải lên, cập nhật, xóa) và cung cấp khả năng truy vấn (tìm kiếm, lấy URL) thông qua Request/Reply. DAM tương tác chặt chẽ với IAM (để kiểm tra ủy quyền), LZM/RDM (để bản địa hóa metadata và dữ liệu tham chiếu), ALM (để ghi log), BUM (lắng nghe sự kiện xóa Tenant), và tích hợp với External Storage Service để lưu trữ file vật lý.

## **3\. Mối quan hệ với Tài liệu Thiết kế Miền DAM**

Tài liệu này là phần tiếp theo của tài liệu **Thiết kế Miền DAM (dam.md)**. Trong khi tài liệu Thiết kế Miền tập trung vào việc định nghĩa các khái niệm nghiệp vụ cốt lõi, Aggregate Root (Asset, Folder), Entity (AssetMetadata, AssetRendition, AssetHistory), Value Object (AssetStatus, RenditionType, AccessPermission, LocalizedText, AssetUploadDetails, AssetMetadataUpdate, AssetQueryCriteria, FolderQueryCriteria), Ngôn ngữ Chung, Use Cases, Domain Services và Application Services ở cấp độ logic và nghiệp vụ, tài liệu này đi sâu vào cách các định nghĩa đó được hiện thực hóa và triển khai về mặt kỹ thuật.

- **Domain Services và Application Services:** Vai trò và trách nhiệm của các loại service này đã được định nghĩa chi tiết trong tài liệu Thiết kế Miền DAM. Trong tài liệu triển khai này, chúng ta xem xét cách các service kỹ thuật (DAM Command Service, DAM Query Service, DAM Upload/Processing Worker, DAM Background Worker) sẽ chứa và tổ chức các Domain Services và Application Services tương ứng theo mô hình Clean Architecture và CQRS. Chi tiết về từng Domain Service hoặc Application Service cụ thể (tên, phương thức, logic) sẽ không được lặp lại ở đây mà được tham chiếu đến tài liệu Thiết kế Miền.
- **Domain Events:** Các Domain Event mà DAM phát ra hoặc xử lý đã được xác định trong tài liệu Thiết kế Miền DAM, bao gồm mục đích và payload dự kiến. Tài liệu triển khai này mô tả cách các event đó được truyền tải vật lý trong hệ thống (sử dụng RabbitMQ) và cách các service lắng nghe/phát event. Chi tiết về từng loại Domain Event cụ thể sẽ không được lặp lại ở đây mà được tham chiếu đến tài liệu Thiết kế Miền.

## **4\. Đơn vị Triển khai (Deployment Units)**

Dựa trên mô hình CQRS bắt buộc và tính chất nghiệp vụ của DAM bao gồm cả luồng đọc (tìm kiếm, lấy URL), luồng ghi (quản lý metadata, folder), các tác vụ tốn thời gian và bất đồng bộ (tải lên file, tạo rendition), và lắng nghe sự kiện từ BUM, DAM sẽ được triển khai thành nhiều đơn vị Microservice/Worker để tối ưu hóa khả năng mở rộng và quản lý tài nguyên.

**Đề xuất:** Triển khai DAM thành **bốn** đơn vị triển khai riêng biệt để tối ưu hóa khả năng mở rộng và quản lý tài nguyên, phù hợp với mô hình CQRS và tính chất tác vụ:

1. **DAM Command Service:**
   - **Trách nhiệm:** Xử lý các yêu cầu thay đổi trạng thái (Commands) liên quan đến quản lý Asset Metadata và Folder (tạo, cập nhật, xóa mềm, khôi phục).
   - **Mô hình:** Write Model của CQRS cho dữ liệu quản lý metadata và folder. Chứa các Application Services và Domain Services liên quan đến quản lý Metadata/Folder. Phát ra Domain Events.
   - **Yêu cầu:** Đảm bảo tính toàn vẹn dữ liệu khi ghi. Cần xử lý logic nghiệp vụ phức tạp (tính duy nhất tên folder, cây thư mục).
   - **Giao tiếp:** Nhận Command thông qua cơ chế Request/Reply của hệ thống (sử dụng NATS) từ API Gateway/DAMS hoặc các service backend khác. Gọi IAM (qua Request/Reply) để kiểm tra ủy quyền. Gọi ALM (qua Request/Reply hoặc Event) để ghi log audit.
2. **DAM Query Service:**
   - **Trách nhiệm:** Xử lý tất cả các yêu cầu truy vấn (Queries) thông tin về Asset và Folder từ các Bounded Context khác, giao diện người dùng, DAMS. Cung cấp khả năng tìm kiếm, lọc, sắp xếp và phân trang cho dữ liệu Asset/Folder, lấy thông tin chi tiết Asset/Folder, và tạo URL truy cập file vật lý (gốc và rendition).
   - **Mô hình:** Read Model của CQRS. Chứa các Application Services và Domain Services liên quan đến truy vấn dữ liệu tài sản.
   - **Yêu cầu:** Hiệu năng cao, độ trễ thấp cho các truy vấn tìm kiếm và lấy URL. Cần hỗ trợ tìm kiếm phức tạp (metadata, folder), lấy thông tin chi tiết (bao gồm metadata đa ngôn ngữ, renditions, history), và tạo URL an toàn.
   - **Giao tiếp:** Nhận Query thông qua cơ chế Request/Reply của hệ thống (sử dụng NATS) từ API Gateway hoặc các service/hệ thống khác. Truy vấn dữ liệu từ Database của DAM hoặc Search Index. Gọi IAM (qua Request/Reply) để kiểm tra ủy quyền. Gọi LZM (qua Request/Reply) để hỗ trợ truy vấn metadata đa ngôn ngữ. Gọi External Storage Service (qua Adapter) để tạo URL.
3. **DAM Upload/Processing Worker:**
   - **Trách nhiệm:** Xử lý các tác vụ tốn thời gian và bất đồng bộ liên quan đến file vật lý: nhận file tải lên, lưu file gốc vào External Storage, tạo bản ghi Asset ban đầu, kích hoạt quy trình tạo renditions, xử lý lỗi trong quá trình này. Xử lý cập nhật file gốc cho Asset đã tồn tại (versioning). Xử lý xóa cứng file vật lý.
   - **Mô hình:** Xử lý tác vụ nền bất đồng bộ, Command Handler/Event Consumer. Chứa các Application Services và Domain Services liên quan đến xử lý file và tạo rendition.
   - **Yêu cầu:** Độ tin cậy cao cho việc xử lý file, khả năng xử lý volume file lớn và các định dạng file khác nhau. Cần xử lý lỗi robust và áp dụng thử lại.
   - **Giao tiếp:** Nhận Command (qua Command Queue hoặc Event) để bắt đầu tác vụ (ví dụ: UploadFileCommand, GenerateRenditionsCommand, DeletePhysicalFileCommand). Tương tác với Database của DAM (cập nhật trạng thái Asset/Rendition/History). Gọi External Storage Service (qua Adapter) để lưu/đọc/xóa file. Gọi Rendition Service (nội bộ hoặc qua API) để tạo renditions. Phát Domain Events AssetUploaded, AssetRenditionCreated, AssetProcessingFailed. Gọi ALM (qua Request/Reply hoặc Event) để ghi log audit.
4. **DAM Background Worker:**
   - **Trách nhiệm:** Lắng nghe và xử lý các Domain Event từ BUM (TenantDataDeletionRequested) để kích hoạt quy trình xóa cứng dữ liệu (metadata và file vật lý) của Tenant đó. Chạy các tác vụ định kỳ khác nếu cần (ví dụ: kiểm tra các Asset/Folder đã xóa mềm quá thời hạn retention để chuyển sang xóa cứng).
   - **Mô hình:** Xử lý tác vụ nền bất đồng bộ, Event Consumer, Scheduled Tasks.
   - **Yêu cầu:** Độ tin cậy cao cho việc xử lý event xóa Tenant và các tác vụ định kỳ quan trọng.
   - **Giao tiếp:** Lắng nghe Domain Events từ Message Broker (RabbitMQ). Gọi DAM Upload/Processing Worker (qua Command/Event) để kích hoạt xóa file vật lý. Tương tác với Database của DAM để xóa bản ghi metadata. Phát Domain Events AssetHardDeleted, FolderHardDeleted. Gọi ALM (qua Request/Reply hoặc Event) để ghi log audit.

Cấu trúc thư mục trong Nx Monorepo sẽ tuân thủ mô hình đã định nghĩa, với các apps/services và apps/workers riêng biệt cho DAM Command, DAM Query, DAM Upload/Processing Worker và DAM Background Worker.

## **5\. Nền tảng Công nghệ Cụ thể cho DAM**

DAM sẽ sử dụng nền tảng công nghệ chung của hệ thống Ecoma, với lựa chọn cụ thể cho lưu trữ dữ liệu, caching, xử lý file và tích hợp External Storage:

- **Cơ sở dữ liệu Chính:** PostgreSQL (Sử dụng TypeORM) \- Phù hợp cho dữ liệu có cấu trúc quan hệ như Asset, Folder, Metadata, Rendition, History. Cần sử dụng JSONB để lưu trữ metadata linh hoạt và Indexing (đặc biệt trên TenantId, FolderId, Asset Key/Name, Metadata Keys/Values) để tối ưu hóa hiệu năng truy vấn. Cần xem xét các tính năng Full-Text Search của PostgreSQL hoặc sử dụng Search Engine chuyên dụng cho việc tìm kiếm phức tạp.
- **Search Engine:** Elasticsearch (hoặc tương đương) \- **Cân nhắc sử dụng** làm lớp lưu trữ tối ưu cho việc tìm kiếm và lọc tài sản dựa trên metadata phức tạp và đa ngôn ngữ. Nếu sử dụng, dữ liệu từ PostgreSQL sẽ được đồng bộ sang Elasticsearch.
- **Cache/Tạm thời:** Redis \- Sử dụng cho caching dữ liệu thường xuyên được truy vấn trong DAM Query Service để giảm tải cho DB/Search Engine và cải thiện hiệu năng đọc, đặc biệt là:
  - Thông tin chi tiết Asset/Folder.
  - Kết quả các truy vấn tìm kiếm phổ biến.
  - URL truy cập file vật lý (có thể cache URL đã tạo với TTL).
- **Xử lý File:** Các thư viện xử lý file chuyên dụng (ví dụ: ImageMagick/GraphicsMagick cho ảnh, FFmpeg cho video) \- Được tích hợp vào DAM Upload/Processing Worker hoặc một microservice chuyên biệt (Rendition Service) để thực hiện việc tạo renditions.
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

Khi có bất kỳ thay đổi nào đối với dữ liệu trong DAM Command Service hoặc DAM Upload/Processing Worker:

- **Từ DAM Command Service (phát Event):**
  - AssetMetadataUpdated, AssetStatusChanged, AssetRestored: Invalidate cache key Asset chi tiết (dam:asset:id:\<asset_id\>).
  - FolderCreated, FolderRenamed, FolderMoved, FolderSoftDeleted, FolderRestored: Invalidate cache key Folder chi tiết (dam:folder:id:\<folder_id\>, dam:folder:tenant:\<tenant_id\>:path:\<encoded_path\>) và kết quả truy vấn Folder/Asset liên quan đến thư mục đó.
- **Từ DAM Upload/Processing Worker (phát Event):**
  - AssetUploaded, AssetRenditionCreated: Invalidate cache key Asset chi tiết (dam:asset:id:\<asset_id\>). Cần re-cache thông tin Asset mới/cập nhật.
  - AssetHardDeleted, FolderHardDeleted: Xóa cache key Asset/Folder liên quan.
- Cache URL truy cập file cần TTL ngắn theo thời gian hết hạn của URL.
- Cache kết quả truy vấn tìm kiếm có thể có TTL ngắn hơn hoặc cần invalidation khi có Asset/Folder mới được tạo/cập nhật/xóa.

## **7\. Giao tiếp và Tích hợp**

DAM tương tác với nhiều BC khác và External Storage Service.

- **Nhận Commands/Queries:**
  - DAM Command Service nhận Commands quản lý metadata/folder qua Request/Reply (từ API Gateway/DAMS).
  - DAM Query Service nhận Queries truy vấn dữ liệu/lấy URL qua Request/Reply (từ API Gateway/Consumer BCs/DAMS).
  - DAM Upload/Processing Worker nhận Commands/Events để xử lý file (Upload, Generate Rendition, Delete Physical File) qua Message Broker (RabbitMQ) hoặc Command Queue.
- **Phát Domain Events:**
  - DAM Command Service phát các Event về thay đổi metadata/folder (AssetMetadataUpdated, FolderCreated, etc.).
  - DAM Upload/Processing Worker phát các Event về tải lên, tạo rendition, xử lý lỗi (AssetUploaded, AssetRenditionCreated, AssetProcessingFailed).
  - DAM Background Worker phát các Event về xóa cứng (AssetHardDeleted, FolderHardDeleted).
  - Tất cả các service/worker gọi ALM (qua Request/Reply hoặc Event) để ghi log audit.
- **Lắng nghe Domain Events:**
  - DAM Background Worker lắng nghe TenantDataDeletionRequested từ BUM.
  - DAM Upload/Processing Worker lắng nghe AssetUploaded hoặc nhận Command để kích hoạt tạo rendition.
- **Tương tác với IAM:**
  - DAM Command Service và DAM Query Service gọi IAM (qua Request/Reply) để kiểm tra ủy quyền cho các thao tác quản lý và truy vấn.
- **Tương tác với LZM & RDM:**
  - DAM Command Service gọi LZM/RDM (qua Request/Reply) để xác thực Locale và hỗ trợ quản lý metadata đa ngôn ngữ.
  - DAM Query Service gọi LZM (qua Request/Reply) để hỗ trợ truy vấn/hiển thị metadata đa ngôn ngữ.
  - DAM có thể gọi RDM để lấy dữ liệu tham chiếu (ví dụ: loại file được hỗ trợ).
- **Tương tác với ALM:**
  - DAM Command Service, DAM Upload/Processing Worker, DAM Background Worker gọi ALM (qua Request/Reply hoặc Event) để ghi log audit cho các hành động quan trọng.
- **Tương tác với External Storage Service (Adapter):**
  - DAM Upload/Processing Worker và DAM Query Service (khi tạo URL) gọi External Storage Service (qua Adapter) để lưu/đọc/xóa file vật lý và tạo URL truy cập.
- **Tương tác với Search Engine (Optional):**
  - DAM Command Service hoặc một worker riêng đồng bộ dữ liệu Asset/Metadata sang Search Engine.
  - DAM Query Service truy vấn Search Engine cho các yêu cầu tìm kiếm phức tạp.

## **8\. Định nghĩa API Endpoint và Mapping Use Case**

Phần này phác thảo các API Endpoint chính mà DAM cung cấp thông qua API Gateway (đối với các tương tác từ bên ngoài hệ thống) và mapping chúng với các Use Case đã định nghĩa trong tài liệu Thiết kế Miền DAM.

| API Endpoint (Ví dụ)                       | Phương thức HTTP | Mô tả Chức năng Cấp cao                                                            | Use Case Liên quan (dam.md)                                                                                                | Loại Yêu cầu Nội bộ (CQRS) | Service Xử lý                                  |
| :----------------------------------------- | :--------------- | :--------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------- | :------------------------- | :--------------------------------------------- |
| /api/v1/dam/assets/upload                  | POST             | Tải lên tài sản mới.                                                               | Tải lên Tài sản Mới (8.1.1)                                                                                                | Command                    | DAM Upload/Processing Worker (qua API Gateway) |
| /api/v1/dam/assets/{assetId}/file          | PUT              | Cập nhật file gốc của tài sản (tạo phiên bản lịch sử).                             | Cập nhật File Tài sản (Tạo Phiên bản Lịch sử) (8.1.2)                                                                      | Command                    | DAM Upload/Processing Worker (qua API Gateway) |
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
| /api/v1/internal/dam/tenant-deletion       | POST             | Endpoint nội bộ để nhận Event xóa Tenant từ BUM (có thể dùng thay Event Consumer). | Xóa Cứng Dữ liệu Tài sản của Tenant (8.4.2)                                                                                | Command                    | DAM Background Worker (Internal API)           |
| /api/v1/internal/dam/generate-renditions   | POST             | Kích hoạt tạo rendition bất đồng bộ (dành cho Worker nội bộ hoặc Event Listener).  | Tải lên Tài sản Mới (8.1.1), Cập nhật File Tài sản (Tạo Phiên bản Lịch sử) (8.1.2), Tạo Phiên bản (rendition) theo yêu cầu | Command                    | DAM Upload/Processing Worker (Internal API)    |
| /api/v1/internal/dam/delete-physical-file  | POST             | Kích hoạt xóa file vật lý bất đồng bộ.                                             | Xóa Cứng Dữ liệu Tài sản của Tenant (8.4.2)                                                                                | Command                    | DAM Upload/Processing Worker (Internal API)    |

_Lưu ý: Đây là các endpoint ví dụ. Tên và cấu trúc cụ thể có thể được tinh chỉnh trong quá trình thiết kế kỹ thuật chi tiết. Các endpoint /api/v1/internal/... là các endpoint nội bộ, không được public ra ngoài qua API Gateway thông thường._

## **9\. Chiến lược Xử lý Lỗi (Error Handling Strategy)**

Chiến lược xử lý lỗi trong DAM sẽ tuân thủ mô hình chung của Ecoma và phân biệt giữa các loại lỗi, kênh giao tiếp:

- **Lỗi Nghiệp vụ (Business Rule Exceptions):** Các lỗi phát sinh do vi phạm quy tắc nghiệp vụ (ví dụ: tên folder đã tồn tại trong thư mục cha, cố gắng di chuyển thư mục vào chính nó hoặc thư mục con, thiếu quyền truy cập, file tải lên không hợp lệ) sẽ được ném ra từ Domain Services và bắt ở lớp Application Service hoặc lớp xử lý Command/Query/Task.
  - **Đối với giao tiếp Request/Reply (Command/Query API):** Lỗi nghiệp vụ sẽ được chuyển đổi thành phản hồi lỗi có cấu trúc (JSON object) bao gồm mã lỗi và thông báo chi tiết, được trả về cho bên gọi (HTTP status code 400 Bad Request). Lỗi ủy quyền (sau khi gọi IAM) trả về 403 Forbidden.
  - **Đối với giao tiếp qua Message Broker/Internal APIs (Upload/Processing, Background Worker):** Lỗi nghiệp vụ xảy ra trong quá trình xử lý (ví dụ: Upload Worker nhận command với dữ liệu file không hợp lệ) sẽ được ghi log chi tiết. Các bản ghi Asset/Folder liên quan có thể được đánh dấu trạng thái Failed với lý do cụ thể. Các Event/Command gốc có thể được chuyển vào DLQ. Phát các Event thông báo lỗi (AssetProcessingFailed).
- **Lỗi Kỹ thuật (Technical Errors):** Các lỗi phát sinh ở lớp Infrastructure (ví dụ: lỗi kết nối DB, lỗi kết nối Message Broker, lỗi cache Redis, lỗi gọi IAM/LZM/RDM/ALM API, lỗi từ External Storage Service Adapter, lỗi từ công cụ xử lý file).
  - Các lỗi này cần được ghi log chi tiết (Structured Logging) với mức độ phù hợp (ERROR), bao gồm stack trace và các thông tin tương quan.
  - **Đối với giao tiếp Request/Reply (Command/Query API):** Lỗi kỹ thuật sẽ được chuyển đổi thành phản hồi lỗi chung (HTTP status code 500 Internal Server Error), ghi log chi tiết ở phía server.
  - **Đối với giao tiếp qua Message Broker/Internal APIs (Upload/Processing, Background Worker):** Lỗi kỹ thuật sẽ được xử lý theo cơ chế retry của RabbitMQ (đối với Event) hoặc retry nội bộ (đối với các tác vụ khác như gọi External Storage). Nếu retry vẫn thất bại, message/tác vụ có thể được chuyển vào DLQ hoặc đánh dấu bản ghi liên quan là Failed. Lỗi cũng cần được ghi log và có thể kích hoạt cảnh báo.
  - **Đối với External Storage Service/File Processing Tools:** Lỗi từ Adapter hoặc công cụ xử lý file cần được phân loại và xử lý phù hợp (retry, đánh dấu failed).
- **Lỗi Validate Input:** Đối với các yêu cầu nhận được qua API Endpoint hoặc các Commands/Events nội bộ, lỗi validate input sẽ được xử lý ở lớp Application Service hoặc Handler trước khi xử lý logic nghiệp vụ. Phản hồi lỗi sử dụng HTTP status code 400 Bad Request hoặc đánh dấu bản ghi Request/Message là Failed.
- **Thông báo Lỗi:** Các lỗi quan trọng (lỗi kết nối DB kéo dài, lỗi Upload/Processing liên tục, lỗi xử lý Event xóa Tenant, lỗi tác vụ định kỳ thất bại) cần kích hoạt cảnh báo thông qua hệ thống giám sát.

## **10\. Khả năng Phục hồi (Resiliency)**

Để đảm bảo DAM chịu lỗi và phục hồi khi các phụ thuộc gặp sự cố và xử lý volume dữ liệu/request lớn:

- **Timeouts và Retries:** Cấu hình timeouts và retry policies cho các cuộc gọi đi đến các phụ thuộc (PostgreSQL, Redis, NATS, RabbitMQ, IAM API, LZM API, RDM API, ALM API, External Storage Service API, Search Engine API). Sử dụng các thư viện hỗ trợ retry với exponential backoff và jitter. Quan trọng với việc gọi IAM (AuthZ), External Storage Service, và Search Engine.
- **Circuit Breaker:** Áp dụng mẫu Circuit Breaker cho các cuộc gọi đến các phụ thuộc có khả năng gặp sự cố tạm thời (ví dụ: gọi External Storage Service, Search Engine) để ngăn chặn các cuộc gọi liên tục gây quá tải.
- **Bulkhead:** Sử dụng Bulkhead để cô lập tài nguyên giữa các đơn vị triển khai của DAM (Command Service, Query Service, Workers). Trong Query Service, có thể cô lập tài nguyên cho luồng tìm kiếm/lấy URL tốc độ cao so với các truy vấn dữ liệu quản lý. Trong Upload/Processing Worker, cô lập tài nguyên cho các loại tác vụ khác nhau (upload, generate rendition, delete).
- **Health Checks:** Triển khai các loại Health Check Probe trong Kubernetes cho mỗi service/worker DAM:
  - **Startup Probe:** Kiểm tra xem ứng dụng đã khởi động hoàn toàn (kết nối đến DB, Message Broker, Cache đã sẵn sàng).
  - **Liveness Probe:** Kiểm tra xem ứng dụng có đang chạy và khỏe mạnh không. Kiểm tra vòng lặp xử lý message/request/task.
  - **Readiness Probe:** Kiểm tra xem ứng dụng đã sẵn sàng xử lý request/message chưa. Kiểm tra kết nối đến **PostgreSQL** (nguồn dữ liệu chính), **Redis** (nếu sử dụng cache), **Message Broker** (đối với Command Service và Workers), khả năng kết nối đến **IAM API**, **LZM API**, **RDM API** (đối với các service/worker phụ thuộc). Đối với Query Service, cần kiểm tra khả năng kết nối đến **Search Engine** (nếu sử dụng) và **External Storage Service** (để tạo URL). Đối với Upload/Processing Worker, cần kiểm tra khả năng kết nối đến **External Storage Service** và **công cụ xử lý file**.
- **Idempotency:** Thiết kế Command Handlers (đặc biệt là trong Upload/Processing Worker) và Event Handlers (từ BUM) có tính Idempotent để việc nhận và xử lý trùng lặp một yêu cầu tải lên, tạo rendition, hoặc xóa Tenant không gây ra kết quả không mong muốn (ví dụ: không tạo Asset trùng lặp, không xóa file hai lần). Sử dụng ID yêu cầu gốc hoặc ID từ Event payload làm key kiểm tra trùng lặp.
- **Queue Monitoring:** Giám sát độ dài hàng đợi (Queue Length) của RabbitMQ cho các queue mà DAM Upload/Processing Worker và DAM Background Worker lắng nghe.

## **11\. Chiến lược Kiểm thử (Testing Strategy)**

Chiến lược kiểm thử cho DAM sẽ tuân thủ mô hình chung của Ecoma:

- **Unit Tests:** Kiểm thử logic nghiệp vụ cốt lõi trong Domain Model (ví dụ: logic quản lý versioning/rendition, logic cây thư mục, logic áp dụng metadata đa ngôn ngữ), logic xử lý trong Application Services (mapping Commands/Queries/Events sang Domain Service calls) một cách độc lập (sử dụng mock cho Repository, Gateway, Broker, IAM/LZM/RDM client, External Storage Service Adapter, File Processing Tools).
- **Integration Tests:** Kiểm thử sự tương tác giữa các thành phần nội bộ của từng service/worker (ví dụ: Command Service xử lý Command và gọi Repository để ghi vào DB thực hoặc Testcontainers; Query Service nhận Query, gọi IAM/LZM mock/testcontainer, gọi Repository/Search Index mock/testcontainer; Upload/Processing Worker xử lý Command/Event, gọi External Storage Service Adapter mock/testcontainer, gọi Rendition Service mock/testcontainer).
- **End-to-End Tests (E2E Tests):** Kiểm thử luồng nghiệp vụ hoàn chỉnh xuyên qua các service (ví dụ: tải file lên qua API Gateway \-\> DAM Upload/Processing Worker xử lý, lưu file, tạo renditions, phát Event \-\> các BC khác có thể truy vấn Asset/Rendition info và lấy URL từ DAM Query Service \-\> lắng nghe Event xóa Tenant từ BUM và kiểm tra xem dữ liệu có bị xóa cứng trong DAM và External Storage không).
- **Contract Tests:** Đảm bảo schema của các Domain Event mà DAM phát ra và lắng nghe tuân thủ "hợp đồng" với các BC khác. Đảm bảo API Endpoint của DAM Query/Command Service tuân thủ "hợp đồng" với các Consumer (sử dụng OpenAPI spec). Đảm bảo "hợp đồng" với External Storage Service Adapter và Search Engine.
- **Component Tests:** Kiểm thử từng service/worker DAM (Command Service, Query Service, Upload/Processing Worker, Background Worker) trong môi trường gần với production, với các phụ thuộc (DB, Redis, Message Broker, IAM, LZM, RDM, ALM, External Storage Service, Search Engine) được giả lập hoặc sử dụng Testcontainers.
- **Performance/Load Tests:** Kiểm thử tải để xác minh DAM Upload/Processing Worker có thể xử lý volume file tải lên và tạo rendition dự kiến, DAM Query Service có thể đáp ứng yêu cầu hiệu năng cao cho luồng tìm kiếm và lấy URL.

## **12\. Chiến lược Di chuyển Dữ liệu (Data Migration Strategy)**

Quản lý thay đổi schema database PostgreSQL của DAM cần được thực hiện cẩn thận:

- Sử dụng công cụ quản lý migration schema tự động (ví dụ: Flyway hoặc Liquibase).
- Thiết kế các migration có tính **Backward Compatibility** (chỉ thêm, không xóa/sửa đổi các cột/bảng quan trọng).
- Lập kế hoạch **rollback** cho các migration.
- Đối với các thay đổi dữ liệu phức tạp (ví dụ: chuẩn hóa metadata cũ, cập nhật đường dẫn file sau khi di chuyển storage), viết **Data Migration Script** riêng biệt.
- Đảm bảo có bản sao lưu (backup) dữ liệu trước khi thực hiện các migration quan trọng.
- Đối với dữ liệu file vật lý trong External Storage, cần có chiến lược di chuyển file nếu cần thay đổi nhà cung cấp hoặc cấu trúc lưu trữ, đồng bộ với việc cập nhật file_path trong Database DAM.

## **13\. Kế hoạch Dung lượng (Capacity Planning \- Initial)**

Dựa trên ước tính ban đầu về số lượng Asset, Folder, volume file tải lên, tần suất truy vấn, đưa ra ước tính ban đầu về tài nguyên cần thiết cho mỗi đơn vị triển khai của DAM. Các con số này là điểm khởi đầu và sẽ được điều chỉnh dựa trên dữ liệu thực tế sau khi triển khai và giám sát.

- **DAM Command Service:** Nhận lượng request quản lý metadata/folder (dự kiến không quá lớn).
  - Số lượng Pod tối thiểu: 3-5
  - Số lượng Pod tối đa: 5-10
  - Giới hạn CPU mỗi Pod: 300m \- 700m
  - Giới hạn Memory mỗi Pod: 512Mi \- 1Gi
  - Cấu hình HPA: Dựa trên CPU Utilization và Request Rate.
- **DAM Query Service:** Dự kiến nhận lượng request _rất lớn_ cho việc tìm kiếm và lấy URL từ các BC khác và DAMS.
  - Số lượng Pod tối thiểu: 5-10
  - Số lượng Pod tối đa: 20+
  - Giới hạn CPU mỗi Pod: 500m \- 1000m
  - Giới hạn Memory mỗi Pod: 512Mi \- 1Gi
  - Cấu hình HPA: Chủ yếu dựa trên CPU Utilization và Request Rate.
- **DAM Upload/Processing Worker:** Dự kiến xử lý volume file tải lên và tạo rendition _lớn_. Đây có thể là worker tốn tài nguyên nhất.
  - Số lượng Pod tối thiểu: 5-10
  - Số lượng Pod tối đa: 20+ (có thể cần scale rất cao)
  - Giới hạn CPU mỗi Pod: 1000m \- 2000m (cho xử lý file)
  - Giới hạn Memory mỗi Pod: 1Gi \- 2Gi (cho xử lý file trong bộ nhớ)
  - Cấu hình HPA: Chủ yếu dựa trên CPU Utilization và độ dài hàng đợi Command/Task.
- **DAM Background Worker:** Lượng tải xử lý Event xóa Tenant và tác vụ định kỳ dự kiến không quá lớn.
  - Số lượng Pod tối thiểu: 2
  - Số lượng Pod tối đa: 3-5
  - Giới hạn CPU mỗi Pod: 200m \- 500m
  - Giới hạn Memory mỗi Pod: 256Mi \- 512Mi
  - Cấu hình HPA: Có thể dựa trên CPU Utilization hoặc độ dài hàng đợi Message Broker.
- **PostgreSQL Database:** Cần được cấu hình mạnh mẽ để xử lý lượng ghi từ Command Service/Upload Worker và lượng đọc từ Query Service.
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
  - BUM là Producer của Event TenantDataDeletionRequested mà DAM Background Worker lắng nghe.
  - DAM Upload/Processing Worker và DAM Background Worker tương tác với Database DAM.
  - DAM Upload/Processing Worker có thể gọi Rendition Service (nội bộ hoặc service riêng).
- **Phụ thuộc Bên ngoài (External Dependencies):**
  - Database (PostgreSQL, Redis).
  - Message Brokers (NATS, RabbitMQ).
  - External Storage Service (Amazon S3, Google Cloud Storage, v.v.).
  - File Processing Tools (ImageMagick, FFmpeg, v.v.).
  - Search Engine (Elasticsearch, v.v.) \- Optional.
  - Container Registry.
  - Kubernetes API.

## **15\. Kết luận**

Tài liệu thiết kế triển khai cho Bounded Context Digital Asset Management (DAM) đã được xây dựng dựa trên tài liệu thiết kế miền DAM và tuân thủ chặt chẽ kiến trúc Microservices, CQRS và Clean Architecture của hệ thống Ecoma. Việc phân tách DAM thành bốn đơn vị triển khai riêng biệt (Command Service, Query Service, Upload/Processing Worker, Background Worker) là cần thiết để đáp ứng yêu cầu về hiệu năng cao cho luồng truy vấn/tìm kiếm/lấy URL, quản lý dữ liệu, xử lý file vật lý tốn thời gian và bất đồng bộ, và quản lý vòng đời dữ liệu. Việc sử dụng PostgreSQL (có thể kết hợp Search Engine), Redis cho cache, các công cụ xử lý file và Adapter cho External Storage Service được lựa chọn để đảm bảo tính toàn vẹn, hiệu năng và khả năng mở rộng cần thiết. Các khía cạnh quan trọng về giao tiếp (Request/Reply, Eventing), xử lý lỗi, khả năng phục hồi, kiểm thử và vận hành đã được đề cập, phác thảo các chiến lược và yêu cầu kỹ thuật.

Tài liệu này cung cấp nền tảng vững chắc cho đội ngũ kỹ thuật để tiến hành thiết kế kỹ thuật chi tiết hơn (ví dụ: chi tiết implementation của Domain/Application Service, cấu trúc Command/Query/Event payload chi tiết, thiết kế các Adapter External Storage Service và tích hợp công cụ xử lý file) và bắt đầu quá trình triển khai thực tế Microservice(s) DAM, đảm bảo tuân thủ các nguyên tắc và mục tiêu kiến trúc của hệ thống Ecoma.
