# **Bounded Context Omnichannel Sales Management (OSM)**

## **1\. Giới thiệu**

Tài liệu này cung cấp mô tả chi tiết về Bounded Context **Omnichannel Sales Management (OSM)** trong hệ thống Ecoma. OSM là một trong những Bounded Context thuộc nhóm Value Stream, đóng vai trò quản lý các **kênh bán hàng (Sales Channel)** mà tổ chức khách hàng sử dụng để tiếp cận và bán sản phẩm/dịch vụ của mình. Các kênh này có thể bao gồm các gian hàng trên nền tảng thương mại điện tử bên ngoài (như Shopee, Lazada, Tiki) hoặc các hệ thống điểm bán hàng tại cửa hàng (POS).

OSM chịu trách nhiệm thiết lập kết nối, quản lý cấu hình, và điều phối việc **đồng bộ dữ liệu** (sản phẩm, tồn kho) giữa hệ thống Ecoma và các kênh bán hàng này. Đồng thời, OSM là điểm tiếp nhận các **đơn đặt hàng** phát sinh từ các kênh này và chuyển giao chúng cho Bounded Context Order Management (ODM) để xử lý tiếp.

## **2\. Phạm vi của Tài liệu**

Tài liệu này tập trung vào việc định nghĩa và mô tả Bounded Context OSM ở cấp độ thiết kế miền (domain design), cung cấp đủ chi tiết để hỗ trợ việc thiết kế các Domain Service và Application Service. Cụ thể, tài liệu này bao gồm:

- Xác định vai trò và trách nhiệm chính của OSM, tập trung vào quản lý kênh bán hàng và đồng bộ dữ liệu.
- Mô tả các khái niệm và thực thể cốt lõi trong mô hình domain của OSM ở cấp độ chi tiết hơn, bao gồm các Aggregate Root, Entity và Value Object với các thuộc tính chính, có tính đến cấu hình kênh, ánh xạ dữ liệu và các tác vụ đồng bộ.
- Định nghĩa Ngôn ngữ Chung (Ubiquitous Language) trong phạm vi OSM.
- Mô tả **Các Khía cạnh Quan trọng của Miền OSM**, làm rõ các quy tắc và cấu trúc nghiệp vụ chi phối hoạt động của Context này, bao gồm quản lý cấu hình kênh, cơ chế đồng bộ dữ liệu, và tiếp nhận đơn hàng từ kênh.
- Làm rõ các tương tác chính giữa OSM và các Bounded Context khác là nguồn dữ liệu (PIM, ICM) hoặc điểm xử lý tiếp theo (ODM).
- Phác thảo các **Use cases** chính có sự tham gia của OSM, tập trung vào actor, mục đích và các Domain/Application Service liên quan.
- Xác định ranh giới nghiệp vụ của OSM, nhấn mạnh những gì OSM không chịu trách nhiệm.
- Đề xuất các Domain Service và Application Service tiềm năng trong OSM, mô tả trách nhiệm chính của từng service.
- Xác định và mô tả các **Domain Events** mà OSM tương tác, được chia thành các sự kiện OSM **phát ra** (Published Events) và các sự kiện OSM **lắng nghe và xử lý** (Consumed Events), bao gồm payload dự kiến của từng event.

Tài liệu này **không** đi sâu vào các chi tiết kỹ thuật triển khai cụ thể hoặc mô tả chi tiết các bước thực hiện (how) của từng luồng nghiệp vụ **bên trong các service**. Các khía cạnh sau **không** nằm trong phạm vi của tài liệu này:

- Chi tiết cài đặt kỹ thuật của Microservice OSM.
- Cấu trúc cơ sở dữ liệu chi tiết (schema) của OSM.
- Các quyết định công nghệ cụ thể bên trong OSM (ví dụ: cách triển khai các adapter tích hợp với từng nền tảng TMĐT/POS cụ thể).
- Luồng dữ liệu chi tiết đến cấp độ từng trường thông tin giữa OSM và các BC khác.
- Cấu hình hạ tầng triển khai cụ thể cho Microservice OSM.
- Thiết kế giao diện người dùng để quản lý kênh bán hàng hoặc theo dõi đồng bộ.
- Quản lý thông tin sản phẩm master (thuộc PIM). OSM chỉ sử dụng ID/SKU và đồng bộ dữ liệu từ PIM.
- Quản lý tồn kho master (thuộc ICM). OSM chỉ sử dụng dữ liệu tồn kho từ ICM để đồng bộ.
- Xử lý đơn hàng sau khi tiếp nhận từ kênh (thuộc ODM). OSM chỉ chuyển giao đơn hàng đã nhận.
- Xử lý thanh toán (thuộc PPM).
- Quản lý vận chuyển và hoàn tất đơn hàng (thuộc SFM).
- Quản lý dữ liệu khách hàng master (thuộc CRM). OSM có thể liên kết đơn hàng với khách hàng trong CRM.
- Quản lý các miền nghiệp vụ khác như nhân sự, đào tạo, quản lý công việc, tài chính, marketing.
- Xử lý các logic nghiệp vụ phức tạp của các nền tảng TMĐT/POS bên ngoài (ví dụ: quy tắc hiển thị sản phẩm trên Shopee). OSM chỉ tương tác thông qua API được cung cấp.

## **3\. Vai trò và Trách nhiệm Chính**

Bounded Context OSM (theo định nghĩa mới) chịu trách nhiệm quản lý các kênh bán hàng và đồng bộ dữ liệu. Các trách nhiệm chính bao gồm:

- **Quản lý Kênh Bán hàng (Sales Channel):** Tạo, cập nhật, xóa (logic xóa mềm) và quản lý cấu hình kết nối cho từng kênh bán hàng (ví dụ: cấu hình API cho gian hàng Shopee, thông tin kết nối cho hệ thống POS).
- **Ánh xạ Dữ liệu (Data Mapping):** Quản lý ánh xạ giữa dữ liệu trong Ecoma (ví dụ: Product ID/SKU từ PIM, Stock Location ID từ ICM) và ID/định danh tương ứng trên từng kênh bán hàng.
- **Đồng bộ Dữ liệu Sản phẩm:** Lấy dữ liệu sản phẩm từ PIM và đẩy (push) hoặc cập nhật (update) lên các kênh bán hàng theo cấu hình và ánh xạ.
- **Đồng bộ Dữ liệu Tồn kho:** Lấy dữ liệu tồn kho khả dụng từ ICM và đẩy (push) hoặc cập nhật (update) lên các kênh bán hàng theo cấu hình và ánh xạ.
- **Tiếp nhận Đơn hàng từ Kênh:** Nhận thông báo hoặc chủ động lấy (pull) dữ liệu đơn hàng mới từ các kênh bán hàng.
- **Chuyển giao Đơn hàng cho ODM:** Chuyển đổi dữ liệu đơn hàng nhận được từ kênh sang định dạng chuẩn của Ecoma và gửi yêu cầu tạo đơn hàng đến ODM.
- **Theo dõi Trạng thái Đồng bộ:** Ghi nhận và theo dõi trạng thái của các tác vụ đồng bộ dữ liệu (thành công, thất bại, đang xử lý).
- **Xử lý Lỗi Đồng bộ:** Quản lý và thông báo các lỗi xảy ra trong quá trình đồng bộ dữ liệu.
- **Phát Sự kiện Nghiệp vụ:** Phát ra các Sự kiện Nghiệp vụ quan trọng liên quan đến quản lý kênh, đồng bộ dữ liệu và tiếp nhận đơn hàng từ kênh.

## **4\. Mô hình Domain (Chi tiết hơn)**

Trong phạm vi Bounded Context OSM (theo định nghĩa mới), chúng ta xác định các Aggregate Root, Entity và Value Object cốt lõi với các thuộc tính chính:

**Aggregate Roots:**

- **SalesChannel:** Là Aggregate Root trung tâm, đại diện cho một kênh bán hàng cụ thể (gian hàng Shopee, hệ thống POS). SalesChannel quản lý thông tin cấu hình kết nối và trạng thái của kênh.
  - **ID:** Unique identifier (UUID).
  - **TenantId:** ID của tổ chức sở hữu kênh (liên kết với IAM).
  - **Name:** Tên kênh (ví dụ: "Gian hàng Shopee ABC", "POS Cửa hàng X").
  - **ChannelType:** Loại kênh (ChannelType Value Object: EcommercePlatform, POS).
  - **PlatformDetails:** Chi tiết nền tảng (PlatformDetails Value Object: {PlatformName: "Shopee", StoreId: "...", APIKey: "...", Secret: "..."} hoặc {POSType: "...", ConnectionInfo: "..."} \- **Lưu trữ an toàn**).
  - **Status:** Trạng thái kênh (ChannelStatus Value Object: Active, Inactive, ConnectionError).
  - **Configuration:** Cấu hình đồng bộ (SynchronizationConfig Value Object).
  - **LastSyncTime:** Thời điểm đồng bộ thành công gần nhất. **Lưu trữ ở múi giờ UTC.**
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ Activate, Deactivate, UpdateConfiguration, RecordSyncSuccess, RecordSyncFailure.
- **DataMapping:** Là Aggregate Root đại diện cho ánh xạ dữ liệu giữa Ecoma và một Sales Channel cụ thể. DataMapping quản lý các ánh xạ cho sản phẩm, tồn kho, v.v.
  - **ID:** Unique identifier (UUID).
  - **TenantId:** ID của tổ chức.
  - **SalesChannelId:** ID của kênh bán hàng liên quan.
  - **ProductMappings:** Danh sách các ProductMapping Entities.
  - **LocationMappings:** Danh sách các LocationMapping Entities (ánh xạ vị trí kho ICM sang vị trí trên kênh nếu có).
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ AddProductMapping, UpdateProductMapping, RemoveProductMapping, AddLocationMapping, UpdateLocationMapping, RemoveLocationMapping.
- **ChannelOrder:** Là Aggregate Root đại diện cho một đơn hàng được tiếp nhận từ một kênh bán hàng, trước khi nó được chuyển giao cho ODM. ChannelOrder lưu trữ dữ liệu đơn hàng nguyên bản từ kênh và trạng thái xử lý nội bộ.
  - **ID:** Unique identifier (UUID).
  - **TenantId:** ID của tổ chức.
  - **SalesChannelId:** ID của kênh bán hàng nguồn.
  - **ChannelOrderId:** ID đơn hàng trên kênh bán hàng.
  - **OrderData:** Dữ liệu đơn hàng nguyên bản từ kênh (có thể là JSON hoặc Value Object phức tạp).
  - **ProcessingStatus:** Trạng thái xử lý nội bộ (ProcessingStatus Value Object: Received, Validated, ODMTransferPending, ODMTransferSuccess, ODMTransferFailed).
  - **ODMOrderId:** **Optional** ID của đơn hàng được tạo trong ODM sau khi chuyển giao thành công.
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ Validate, MarkAsODMTransferPending, MarkAsODMTransferSuccess, MarkAsODMTransferFailed.

**Entities (thuộc về các Aggregate Root):**

- **ProductMapping (thuộc DataMapping):** Ánh xạ một sản phẩm/biến thể Ecoma với một sản phẩm/biến thể trên kênh bán hàng.
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root DataMapping.
  - **EcomaProductId:** ID sản phẩm trong PIM.
  - **EcomaVariantId:** **Optional** ID biến thể trong PIM.
  - **EcomaSKU:** Mã SKU trong Ecoma.
  - **ChannelProductId:** ID sản phẩm trên kênh bán hàng.
  - **ChannelVariantId:** **Optional** ID biến thể trên kênh bán hàng.
  - **ChannelSKU:** Mã SKU trên kênh bán hàng (nếu khác Ecoma SKU).
  - **IsSyncEnabled:** Boolean chỉ định có bật đồng bộ cho sản phẩm này không.
  - **LastSyncTime:** Thời điểm đồng bộ cuối cùng cho sản phẩm này. **Lưu trữ ở múi giờ UTC.**
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
- **LocationMapping (thuộc DataMapping):** Ánh xạ một vị trí kho Ecoma với một vị trí trên kênh bán hàng (nếu kênh hỗ trợ quản lý vị trí).
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root DataMapping.
  - **EcomaStockLocationId:** ID vị trí kho trong ICM.
  - **ChannelLocationId:** ID vị trí trên kênh bán hàng.
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
- **SynchronizationTask (Entity độc lập hoặc Value Object phức tạp):** Đại diện cho một tác vụ đồng bộ dữ liệu cụ thể (ví dụ: đồng bộ tồn kho cho SalesChannel X). Có thể là Entity độc lập nếu cần theo dõi chi tiết vòng đời tác vụ.
  - **ID:** Unique identifier (UUID).
  - **TenantId:** ID của tổ chức.
  - **SalesChannelId:** ID của kênh bán hàng liên quan.
  - **SyncType:** Loại đồng bộ (SyncType Value Object: Product, Inventory, Price \- nếu giá được đồng bộ qua đây).
  - **Status:** Trạng thái tác vụ (TaskStatus Value Object: Pending, Running, Completed, Failed, Cancelled).
  - **StartTime:** Thời điểm bắt đầu. **Lưu trữ ở múi giờ UTC.**
  - **EndTime:** **Optional** Thời điểm kết thúc. **Lưu trữ ở múi giờ UTC.**
  - **Details:** Chi tiết kết quả/lỗi (có thể là JSON).
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**

**Value Objects:**

- **ChannelType:** Loại kênh bán hàng (EcommercePlatform, POS).
- **PlatformDetails:** Chi tiết cấu hình nền tảng (PlatformName, StoreId, APIKey, Secret, ConnectionInfo, etc. \- **Lưu trữ an toàn**).
- **ChannelStatus:** Trạng thái kênh (Active, Inactive, ConnectionError).
- **SynchronizationConfig:** Cấu hình đồng bộ cho kênh.
  - **EnableProductSync:** Bật/tắt đồng bộ sản phẩm.
  - **EnableInventorySync:** Bật/tắt đồng bộ tồn kho.
  - **EnablePriceSync:** Bật/tắt đồng bộ giá (nếu OSM xử lý).
  - **SyncFrequency:** Tần suất đồng bộ (ví dụ: Hourly, Daily, Realtime \- nếu có webhook).
  - **EcomaLocationsToSync:** Danh sách ID vị trí kho Ecoma được phép đồng bộ lên kênh này.
- **SyncType:** Loại đồng bộ (Product, Inventory, Price).
- **TaskStatus:** Trạng thái tác vụ (Pending, Running, Completed, Failed, Cancelled).
- **ProcessingStatus:** Trạng thái xử lý ChannelOrder (Received, Validated, ODMTransferPending, ODMTransferSuccess, ODMTransferFailed).
- **LocalizedText:** Giá trị văn bản đa ngôn ngữ (sử dụng Translation Key).

## **5\. Ngôn ngữ Chung (Ubiquitous Language)**

Trong Bounded Context OSM (theo định nghĩa mới), các thuật ngữ sau đây có ý nghĩa cụ thể và nhất quán:

- **Sales Channel:** Một nền tảng hoặc hệ thống (gian hàng TMĐT, POS) được sử dụng để bán hàng.
- **Channel Type:** Loại của Sales Channel (Ecommerce Platform, POS).
- **Platform Details:** Thông tin cấu hình để kết nối với một Sales Channel.
- **Data Mapping:** Ánh xạ giữa các thực thể trong Ecoma và các thực thể tương ứng trên Sales Channel.
- **Product Mapping:** Ánh xạ giữa Product/Variant Ecoma và Product/Variant trên Sales Channel.
- **Location Mapping:** Ánh xạ giữa Stock Location Ecoma và Location trên Sales Channel.
- **Synchronization:** Quá trình cập nhật dữ liệu (sản phẩm, tồn kho) giữa Ecoma và Sales Channel.
- **Sync Task:** Một tác vụ đồng bộ dữ liệu cụ thể.
- **Order Ingestion:** Quá trình tiếp nhận đơn hàng từ Sales Channel vào Ecoma.
- **Channel Order:** Một đơn hàng được tiếp nhận từ Sales Channel trước khi được chuyển giao cho ODM.
- **Order Transfer:** Quá trình chuyển giao Channel Order cho ODM.
- **Connection Status:** Trạng thái kết nối giữa Ecoma và Sales Channel.

## **6\. Các Khía cạnh Quan trọng của Miền OSM**

Phần này mô tả các cấu trúc, quy tắc và khái niệm nghiệp vụ quan trọng chi phối hoạt động của Bounded Context OSM (theo định nghĩa mới).

### **6.1. Quản lý Cấu hình Kết nối Kênh Bán hàng**

OSM chịu trách nhiệm lưu trữ và quản lý thông tin cấu hình cần thiết để kết nối với từng Sales Channel (ví dụ: API Key, Secret, Endpoint cho Shopee; thông tin kết nối cho POS). Thông tin này cần được lưu trữ một cách an toàn (PlatformDetails). Trạng thái của SalesChannel Aggregate Root phản ánh khả năng kết nối và hoạt động của kênh.

### **6.2. Cơ chế Đồng bộ Dữ liệu (Sản phẩm, Tồn kho)**

OSM là trung tâm điều phối việc đồng bộ dữ liệu giữa Ecoma và các Sales Channel.

- **Nguồn dữ liệu:** OSM lấy dữ liệu sản phẩm từ PIM và dữ liệu tồn kho từ ICM.
- **Ánh xạ:** DataMapping Aggregate Root quản lý cách các thực thể Ecoma (Product/Variant/SKU, Stock Location) tương ứng với các thực thể trên kênh. Ánh xạ này là cần thiết vì ID/SKU/định danh có thể khác nhau giữa các hệ thống.
- **Quy trình đồng bộ:** OSM thực hiện các tác vụ đồng bộ theo lịch trình hoặc được kích hoạt (ví dụ: khi tồn kho thay đổi trong ICM). Quy trình này bao gồm việc lấy dữ liệu từ Ecoma, áp dụng ánh xạ, gọi API của kênh bán hàng để cập nhật dữ liệu. SynchronizationTask có thể được sử dụng để theo dõi từng lần đồng bộ.
- **Loại đồng bộ:** Có thể là đồng bộ sản phẩm (tạo/cập nhật thông tin cơ bản của sản phẩm), đồng bộ tồn kho (cập nhật số lượng tồn kho khả dụng). Đồng bộ giá có thể nằm ở đây hoặc ở BC Pricing nếu phức tạp hơn.

### **6.3. Tiếp nhận và Chuyển giao Đơn hàng từ Kênh**

OSM là điểm tiếp nhận tất cả các đơn hàng phát sinh từ các Sales Channel.

- **Cơ chế tiếp nhận:** Có thể là chủ động lấy (pull) đơn hàng mới từ API của kênh theo lịch trình, hoặc nhận thông báo tự động (webhook) từ kênh khi có đơn hàng mới.
- **ChannelOrder:** Mỗi đơn hàng nhận được từ kênh được lưu tạm thời dưới dạng ChannelOrder Aggregate Root. ChannelOrder lưu trữ dữ liệu gốc từ kênh.
- **Xử lý ChannelOrder:** OSM thực hiện các bước xử lý ban đầu cho ChannelOrder (ví dụ: xác thực dữ liệu, áp dụng ánh xạ sản phẩm/vị trí nếu cần) và chuyển giao cho ODM.
- **Chuyển giao cho ODM:** Sau khi xử lý ban đầu, OSM gửi yêu cầu tạo đơn hàng đến ODM (ví dụ: phát Event OrderReceivedFromChannel hoặc gửi Command CreateOrderFromChannelCommand đến ODM). Trạng thái của ChannelOrder được cập nhật để phản ánh việc chuyển giao thành công hay thất bại.

### **6.4. Xử lý Lỗi và Theo dõi Trạng thái**

OSM cần có cơ chế để theo dõi trạng thái của các kênh bán hàng (kết nối thành công/thất bại), các tác vụ đồng bộ (thành công/thất bại), và việc chuyển giao đơn hàng cho ODM. Các lỗi cần được ghi lại và có thể phát thông báo (qua NDM) cho người quản lý.

### **6.5. Ranh giới với Logic Nghiệp vụ Kênh**

OSM chỉ tập trung vào việc kết nối, đồng bộ dữ liệu và tiếp nhận đơn hàng. Logic nghiệp vụ phức tạp đặc thù của từng kênh (ví dụ: cách tính phí vận chuyển trên Shopee, quy tắc hiển thị sản phẩm trên Lazada) nằm ngoài phạm vi của OSM và thuộc về bản thân nền tảng/hệ thống kênh đó.

## **7\. Tương tác với các Bounded Context khác**

OSM (theo định nghĩa mới) tương tác với các Bounded Context khác để lấy dữ liệu nguồn, chuyển giao đơn hàng và sử dụng các dịch vụ cốt lõi.

- **Tương tác với Core BCs:**
  - **IAM:** OSM cần IAM (Request/Reply) để xác thực và ủy quyền cho người dùng quản lý kênh bán hàng và cấu hình đồng bộ. OSM lấy thông tin Tenant ID từ ngữ cảnh phiên làm việc.
  - **LZM & RDM:** OSM cần LZM (Request/Reply) để quản lý và hiển thị metadata đa ngôn ngữ (tên kênh, loại kênh, trạng thái, loại đồng bộ, lý do lỗi). OSM cần RDM (Request/Reply) để lấy dữ liệu tham chiếu (ví dụ: danh sách loại nền tảng TMĐT, loại hệ thống POS).
  - **ALM:** OSM phát ra các sự kiện audit log (Event) khi có các hành động quan trọng liên quan đến quản lý kênh (ví dụ: thêm/cập nhật/xóa kênh, bắt đầu/kết thúc tác vụ đồng bộ, tiếp nhận đơn hàng từ kênh, chuyển giao đơn hàng cho ODM).
  - **NDM:** OSM yêu cầu NDM gửi thông báo về trạng thái kênh (ví dụ: kết nối lỗi, đồng bộ thất bại) hoặc trạng thái đơn hàng từ kênh (ví dụ: đơn hàng mới từ kênh X đã được tiếp nhận) cho người quản lý.
- **Tương tác với Feature BCs:**
  - **PIM:** OSM gọi PIM (Request/Reply Query) để lấy thông tin sản phẩm/biến thể (bao gồm SKU) cần đồng bộ lên kênh (GetProductDetailsQuery, SearchProductsQuery). PIM phát Event (ProductUpdated, ProductVariantUpdated) mà OSM có thể lắng nghe để kích hoạt đồng bộ sản phẩm.
  - **ICM:** OSM gọi ICM (Request/Reply Query) để lấy thông tin tồn kho khả dụng theo SKU và vị trí kho (GetInventoryLevelsQuery). ICM phát Event (InventoryLevelUpdated) mà OSM có thể lắng nghe để kích hoạt đồng bộ tồn kho.
  - **ODM:** ODM lắng nghe Event (OrderReceivedFromChannel) hoặc xử lý Command (CreateOrderFromChannelCommand) từ OSM để tạo đơn hàng chính thức trong Ecoma. ODM gọi OSM (Request/Reply Query) để lấy thông tin chi tiết về kênh bán hàng nguồn nếu cần hiển thị trong đơn hàng.
  - **CRM:** Khi tiếp nhận đơn hàng từ kênh, OSM có thể gọi CRM (Request/Reply Query) để tìm kiếm hoặc tạo mới hồ sơ khách hàng nếu thông tin khách hàng từ kênh chưa tồn tại trong CRM, và liên kết Customer ID vào dữ liệu đơn hàng trước khi chuyển cho ODM. CRM phát Event (CustomerCreated) mà OSM có thể lắng nghe để cập nhật ánh xạ khách hàng nếu cần.
  - **DAM:** OSM có thể yêu cầu DAM lưu trữ các file liên quan đến kênh (ví dụ: báo cáo đồng bộ, log lỗi chi tiết) và lưu ID tham chiếu.

## **8\. Use cases**

Dưới đây là mô tả các use case chính có sự tham gia của OSM (theo định nghĩa mới), được tổ chức theo các nhóm chức năng chính, tập trung vào actor, mục đích và các Domain/Application Service liên quan.

### **8.1. Use Cases liên quan đến Quản lý Kênh Bán hàng**

Nhóm này bao gồm việc thiết lập và quản lý các kết nối kênh.

- **Use case: Thêm Kênh Bán hàng Mới:**
  - **Actor:** Người dùng (quản lý hệ thống/vận hành).
  - **Mục đích:** Cấu hình kết nối đến một nền tảng TMĐT hoặc hệ thống POS mới.
  - **Service liên quan:** Được xử lý bởi ChannelApplicationService (Command Handler cho AddSalesChannelCommand). Sử dụng ChannelService để tạo SalesChannel Aggregate Root. Sử dụng SalesChannel Repository. Phát sự kiện SalesChannelAdded, audit log cho ALM.
- **Use case: Cập nhật Cấu hình Kênh Bán hàng:**
  - **Actor:** Người dùng (quản lý hệ thống/vận hành).
  - **Mục đích:** Chỉnh sửa thông tin kết nối hoặc cấu hình đồng bộ của kênh.
  - **Service liên quan:** Được xử lý bởi ChannelApplicationService (Command Handler cho UpdateSalesChannelCommand). Sử dụng ChannelService để lấy và cập nhật SalesChannel Aggregate Root. Sử dụng SalesChannel Repository. Phát sự kiện SalesChannelUpdated, audit log cho ALM.
- **Use case: Kích hoạt/Vô hiệu hóa Kênh Bán hàng:**
  - **Actor:** Người dùng (quản lý hệ thống/vận hành).
  - **Mục đích:** Bật hoặc tắt hoạt động của kênh bán hàng (ví dụ: tạm dừng đồng bộ và tiếp nhận đơn hàng).
  - **Service liên quan:** Được xử lý bởi ChannelApplicationService (Command Handler cho ActivateSalesChannelCommand, DeactivateSalesChannelCommand). Sử dụng ChannelService để lấy và thay đổi trạng thái SalesChannel Aggregate Root. Sử dụng SalesChannel Repository. Phát sự kiện SalesChannelStatusChanged, audit log cho ALM.

### **8.2. Use Cases liên quan đến Đồng bộ Dữ liệu**

Nhóm này bao gồm việc quản lý ánh xạ và thực hiện các tác vụ đồng bộ.

- **Use case: Định nghĩa Ánh xạ Dữ liệu Sản phẩm:**
  - **Actor:** Người dùng (quản lý sản phẩm/vận hành).
  - **Mục đích:** Thiết lập mối liên hệ giữa sản phẩm Ecoma và sản phẩm trên kênh bán hàng.
  - **Service liên quan:** Được xử lý bởi DataMappingApplicationService (Command Handler cho AddProductMappingCommand). Sử dụng DataMappingService để lấy và cập nhật DataMapping Aggregate Root. Sử dụng DataMapping Repository. Phát sự kiện ProductMappingAdded, audit log cho ALM.
- **Use case: Kích hoạt Đồng bộ Dữ liệu Thủ công:**
  - **Actor:** Người dùng (quản lý vận hành).
  - **Mục đích:** Bắt đầu một tác vụ đồng bộ dữ liệu (sản phẩm hoặc tồn kho) cho một kênh cụ thể theo yêu cầu.
  - **Service liên quan:** Được xử lý bởi SynchronizationApplicationService (Command Handler cho StartSynchronizationTaskCommand). Sử dụng SynchronizationService để tạo bản ghi tác vụ và gọi các Service nội bộ (PIM, ICM) và Service tương tác với kênh để thực hiện đồng bộ. Sử dụng SynchronizationTask Repository. Phát sự kiện SynchronizationTaskStarted, audit log cho ALM.
- **Use case: Đồng bộ Dữ liệu Tự động (Theo lịch/Event):**
  - **Actor:** Hệ thống (Scheduler hoặc Event Handler).
  - **Mục đích:** Tự động thực hiện các tác vụ đồng bộ dữ liệu theo cấu hình hoặc khi có sự kiện thay đổi dữ liệu nguồn (ví dụ: tồn kho thay đổi trong ICM).
  - **Service liên quan:** Được xử lý bởi SynchronizationApplicationService (Triggered by Scheduler hoặc Event Handler cho InventoryLevelUpdatedEvent từ ICM, ProductUpdatedEvent từ PIM). Sử dụng SynchronizationService để tạo bản ghi tác vụ và thực hiện đồng bộ. Sử dụng SynchronizationTask Repository. Phát sự kiện SynchronizationTaskStarted, SynchronizationTaskCompleted, SynchronizationTaskFailed, audit log cho ALM. Yêu cầu NDM thông báo lỗi đồng bộ.

### **8.3. Use Cases liên quan đến Tiếp nhận Đơn hàng từ Kênh**

Nhóm này bao gồm việc nhận đơn hàng từ kênh và chuyển giao cho ODM.

- **Use case: Tiếp nhận Đơn hàng từ Kênh Bán hàng (Webhook/Polling):**
  - **Actor:** Hệ thống (từ kênh bán hàng qua webhook hoặc logic polling).
  - **Mục đích:** Nhận dữ liệu đơn hàng mới từ kênh bán hàng.
  - **Service liên quan:** Được xử lý bởi OrderIngestionApplicationService (Endpoint nhận webhook hoặc logic polling). Sử dụng OrderIngestionService để tạo ChannelOrder Aggregate Root. Sử dụng ChannelOrder Repository. Phát sự kiện ChannelOrderReceived, audit log cho ALM.
- **Use case: Chuyển giao Đơn hàng cho ODM:**
  - **Actor:** Hệ thống (sau khi ChannelOrder được nhận và xử lý ban đầu).
  - **Mục đích:** Chuyển đổi dữ liệu ChannelOrder sang định dạng Ecoma và gửi yêu cầu tạo đơn hàng đến ODM.
  - **Service liên quan:** Được xử lý bởi OrderIngestionService (sau khi tạo ChannelOrder). Chuyển đổi dữ liệu, gọi CRM Service để tìm/tạo khách hàng nếu cần, gửi Command (CreateOrderFromChannelCommand) hoặc phát Event (OrderReceivedFromChannel) đến ODM. Cập nhật trạng thái ChannelOrder. Sử dụng ChannelOrder Repository. Phát sự kiện ChannelOrderProcessingStatusChanged, audit log cho ALM.

### **8.4. Use Cases liên quan đến Truy vấn**

Nhóm này cho phép người dùng hoặc các BC khác truy xuất thông tin về kênh, ánh xạ, tác vụ đồng bộ và đơn hàng từ kênh.

- **Use case: Xem Danh sách Kênh Bán hàng:**
  - **Actor:** Người dùng (quản lý hệ thống/vận hành).
  - **Mục đích:** Xem danh sách các kênh bán hàng đã được cấu hình.
  - **Service liên quan:** Được xử lý bởi ChannelQueryApplicationService (Query Handler cho GetSalesChannelsQuery). Sử dụng ChannelQueryService để truy vấn SalesChannel Repository. Gọi LZM Service cho bản dịch.
- **Use case: Xem Chi tiết Ánh xạ Dữ liệu:**
  - **Actor:** Người dùng (quản lý sản phẩm/vận hành).
  - **Mục đích:** Xem chi tiết ánh xạ dữ liệu cho một kênh bán hàng cụ thể.
  - **Service liên quan:** Được xử lý bởi DataMappingQueryApplicationService (Query Handler cho GetDataMappingDetailsQuery). Sử dụng DataMappingQueryService để lấy DataMapping Aggregate Root. Sử dụng DataMapping Repository. Gọi PIM Service, ICM Service, LZM Service.
- **Use case: Xem Lịch sử Tác vụ Đồng bộ:**
  - **Actor:** Người dùng (quản lý vận hành).
  - **Mục đích:** Xem lịch sử các lần đồng bộ dữ liệu và kết quả của chúng.
  - **Service liên quan:** Được xử lý bởi SynchronizationQueryApplicationService (Query Handler cho GetSynchronizationTasksQuery). Sử dụng SynchronizationQueryService để truy vấn SynchronizationTask Repository. Gọi SalesChannel Repository, LZM Service.
- **Use case: Xem Danh sách Đơn hàng từ Kênh:**
  - **Actor:** Người dùng (quản lý đơn hàng/vận hành).
  - **Mục đích:** Xem danh sách các đơn hàng đã được tiếp nhận từ các kênh bán hàng và trạng thái chuyển giao cho ODM.
  - **Service liên quan:** Được xử lý bởi OrderIngestionQueryApplicationService (Query Handler cho GetChannelOrdersQuery). Sử dụng OrderIngestionQueryService để truy vấn ChannelOrder Repository. Gọi SalesChannel Repository, ODM Service, LZM Service.

## **9\. Domain Services**

Domain Services trong OSM (theo định nghĩa mới) chứa logic nghiệp vụ quan trọng liên quan đến quản lý kênh, đồng bộ và tiếp nhận đơn hàng.

- **ChannelService:**
  - **Trách nhiệm:** Quản lý vòng đời của SalesChannel Aggregate Root (tạo, cập nhật cấu hình, thay đổi trạng thái). Thực hiện các quy tắc nghiệp vụ liên quan đến kênh. Phối hợp với SalesChannel Repository, RDM Service (để kiểm tra loại kênh).
  - **Các phương thức tiềm năng:** AddSalesChannel(tenantId, details), UpdateSalesChannel(channelId, tenantId, updates), ChangeChannelStatus(channelId, tenantId, newStatus).
- **DataMappingService:**
  - **Trách nhiệm:** Quản lý vòng đời của DataMapping Aggregate Root (thêm/sửa/xóa ánh xạ sản phẩm, vị trí). Phối hợp với DataMapping Repository, PIM Service, ICM Service.
  - **Các phương thức tiềm năng:** AddProductMapping(mappingId, tenantId, channelId, ecomaProductId, channelProductId, isSyncEnabled), UpdateProductMapping(mappingId, tenantId, productMappingId, updates).
- **SynchronizationService:**
  - **Trách nhiệm:** Điều phối các tác vụ đồng bộ dữ liệu. Lấy dữ liệu từ PIM/ICM, áp dụng ánh xạ từ DataMapping, gọi ChannelIntegrationService để tương tác với kênh. Ghi nhận kết quả tác vụ đồng bộ. Phối hợp với SynchronizationTask Repository, PIM Service, ICM Service, DataMapping Repository, ChannelIntegrationService.
  - **Các phương thức tiềm năng:** StartSyncTask(tenantId, channelId, syncType), ExecuteProductSync(taskId, tenantId, channelId), ExecuteInventorySync(taskId, tenantId, channelId).
- **OrderIngestionService:**
  - **Trách nhiệm:** Xử lý việc tiếp nhận ChannelOrder từ kênh. Tạo ChannelOrder Aggregate. Chuyển đổi dữ liệu ChannelOrder sang định dạng Ecoma. Gửi yêu cầu tạo đơn hàng đến ODM. Cập nhật trạng thái ChannelOrder. Phối hợp với ChannelOrder Repository, CRM Service (để tìm/tạo khách hàng), ODM Service (để gửi Command/Event).
  - **Các phương thức tiềm năng:** ReceiveOrderFromChannel(tenantId, channelId, channelOrderId, orderData), TransferOrderToODM(channelOrderId, tenantId).
- **ChannelIntegrationService:**
  - **Trách nhiệm:** Trừu tượng hóa việc tương tác với API của từng nền tảng TMĐT/hệ thống POS cụ thể. Chứa logic gọi API để đẩy dữ liệu (sản phẩm, tồn kho), lấy dữ liệu (đơn hàng), xử lý webhook. Phối hợp với SalesChannel Repository (để lấy cấu hình kết nối), DataMapping Repository (để áp dụng ánh xạ).
  - **Các phương thức tiềm năng:** PushProductsToChannel(channelId, tenantId, productData), PushInventoryToChannel(channelId, tenantId, inventoryData), PullOrdersFromChannel(channelId, tenantId, criteria), HandleChannelWebhook(channelType, payload).

## **9\. Application Services**

Application Services trong OSM (theo định nghĩa mới) là lớp mỏng điều phối các hành động từ bên ngoài (ví dụ: từ API Gateway, Message Broker, Webhook Endpoint) đến Domain Model (Aggregate Roots, Domain Services). Chúng xử lý các tác vụ kỹ thuật như xử lý Command/Query, lắng nghe Event, thực hiện ủy quyền, và gọi Domain Service.

- **ChannelApplicationService:**
  - **Trách nhiệm:** Xử lý các command liên quan đến quản lý SalesChannel từ API/UI (ví dụ: AddSalesChannelCommand, UpdateSalesChannelCommand, ActivateSalesChannelCommand). Sử dụng ChannelService và SalesChannel Repository. Thực hiện ủy quyền với IAM. Lắng nghe các event liên quan đến xóa Tenant từ BUM để kích hoạt xóa dữ liệu kênh của Tenant đó.
  - **Các phương thức tiềm năng:** HandleAddSalesChannelCommand(command), HandleUpdateSalesChannelCommand(command), HandleActivateSalesChannelCommand(command), HandleTenantDataDeletionRequestedEvent(event).
- **DataMappingApplicationService:**
  - **Trách nhiệm:** Xử lý các command liên quan đến quản lý DataMapping từ API/UI (ví dụ: AddProductMappingCommand). Sử dụng DataMappingService và DataMapping Repository. Thực hiện ủy quyền với IAM.
  - **Các phương thức tiềm năng:** HandleAddProductMappingCommand(command).
- **SynchronizationApplicationService:**
  - **Trách nhiệm:** Xử lý các command kích hoạt đồng bộ thủ công từ API/UI (ví dụ: StartSynchronizationTaskCommand). Lắng nghe các Event thay đổi dữ liệu nguồn (ví dụ: InventoryLevelUpdatedEvent từ ICM, ProductUpdatedEvent từ PIM) để kích hoạt đồng bộ tự động. Sử dụng SynchronizationService và SynchronizationTask Repository. Thực hiện ủy quyền với IAM (nếu từ Command).
  - **Các phương thức tiềm năng:** HandleStartSynchronizationTaskCommand(command), HandleInventoryLevelUpdatedEvent(event), HandleProductUpdatedEvent(event).
- **OrderIngestionApplicationService:**
  - **Trách nhiệm:** Cung cấp endpoint để nhận webhook đơn hàng từ kênh hoặc chứa logic polling. Xử lý việc tiếp nhận đơn hàng và gọi OrderIngestionService. Sử dụng OrderIngestionService và ChannelOrder Repository.
  - **Các phương thức tiềm năng:** HandleChannelOrderWebhook(channelType, payload), PollForChannelOrders(channelId, tenantId).
- **ChannelQueryApplicationService:**
  - **Trách nhiệm:** Xử lý các query để lấy thông tin SalesChannel từ API/UI (ví dụ: GetSalesChannelsQuery). Sử dụng ChannelQueryService. Thực hiện ủy quyền với IAM.
  - **Các phương thức tiềm năng:** HandleGetSalesChannelsQuery(query).
- **DataMappingQueryApplicationService:**
  - **Trách nhiệm:** Xử lý các query để lấy thông tin DataMapping từ API/UI (ví dụ: GetDataMappingDetailsQuery). Sử dụng DataMappingQueryService. Thực hiện ủy quyền với IAM.
  - **Các phương thức tiềm năng:** HandleGetDataMappingDetailsQuery(query).
- **SynchronizationQueryApplicationService:**
  - **Trách nhiệm:** Xử lý các query để lấy thông tin SynchronizationTask từ API/UI (ví dụ: GetSynchronizationTasksQuery). Sử dụng SynchronizationQueryService. Thực hiện ủy quyền với IAM.
  - **Các phương thức tiềm năng:** HandleGetSynchronizationTasksQuery(query).
- **OrderIngestionQueryApplicationService:**
  - **Trách nhiệm:** Xử lý các query để lấy thông tin ChannelOrder từ API/UI (ví dụ: GetChannelOrdersQuery). Sử dụng OrderIngestionQueryService. Thực hiện ủy quyền với IAM.
  - **Các phương thức tiềm năng:** HandleGetChannelOrdersQuery(query).

## **10\. Domain Events**

Bounded Context OSM (theo định nghĩa mới) tương tác với các Bounded Context khác thông qua việc phát ra và lắng nghe các Domain Event. Dưới đây là danh sách các event mà OSM phát ra và lắng nghe, bao gồm payload dự kiến của chúng:

### **10.1. Domain Events (OSM Phát ra)**

OSM sẽ phát ra các Domain Event quan trọng để thông báo cho các Bounded Context khác về các sự kiện liên quan đến kênh bán hàng, đồng bộ và đơn hàng từ kênh. Dưới đây là danh sách các event và payload dự kiến của chúng:

- **SalesChannelAdded**
  - Phát ra khi một kênh bán hàng mới được cấu hình.
  - **Payload:**
    - ChannelId (UUID)
    - TenantId (UUID)
    - Name (String)
    - ChannelType (String)
    - CreatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **SalesChannelUpdated**
  - Phát ra khi thông tin cấu hình kênh bán hàng được cập nhật.
  - **Payload:**
    - ChannelId (UUID)
    - TenantId (UUID)
    - UpdatedFields (Object)
    - UpdatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **SalesChannelStatusChanged**
  - Phát ra khi trạng thái kênh bán hàng thay đổi (Active/Inactive/ConnectionError).
  - **Payload:**
    - ChannelId (UUID)
    - TenantId (UUID)
    - OldStatus (String)
    - NewStatus (String)
    - UpdatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ProductMappingAdded**
  - Phát ra khi một ánh xạ sản phẩm mới được thêm.
  - **Payload:**
    - MappingId (UUID) \- ID của DataMapping Aggregate
    - ProductMappingId (UUID) \- ID của ProductMapping Entity
    - TenantId (UUID)
    - SalesChannelId (UUID)
    - EcomaSKU (String)
    - ChannelSKU (String)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **SynchronizationTaskStarted**
  - Phát ra khi một tác vụ đồng bộ dữ liệu bắt đầu.
  - **Payload:**
    - TaskId (UUID)
    - TenantId (UUID)
    - SalesChannelId (UUID)
    - SyncType (String)
    - StartTime (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **SynchronizationTaskCompleted**
  - Phát ra khi một tác vụ đồng bộ dữ liệu hoàn thành thành công.
  - **Payload:**
    - TaskId (UUID)
    - TenantId (UUID)
    - SalesChannelId (UUID)
    - SyncType (String)
    - EndTime (DateTime) **(ở múi giờ UTC)**
    - Details (Object \- ví dụ: số lượng bản ghi được đồng bộ)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **SynchronizationTaskFailed**
  - Phát ra khi một tác vụ đồng bộ dữ liệu thất bại.
  - **Payload:**
    - TaskId (UUID)
    - TenantId (UUID)
    - SalesChannelId (UUID)
    - SyncType (String)
    - EndTime (DateTime) **(ở múi giờ UTC)**
    - FailureReason (String)
    - Details (Object \- chi tiết lỗi)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ChannelOrderReceived**
  - Phát ra khi một đơn hàng mới được tiếp nhận từ kênh bán hàng.
  - **Payload:**
    - ChannelOrderId (UUID)
    - TenantId (UUID)
    - SalesChannelId (UUID)
    - ChannelPlatformOrderId (String) \- ID đơn hàng trên kênh
    - ReceivedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **OrderReceivedFromChannel**
  - Phát ra khi OSM hoàn tất xử lý ChannelOrder và sẵn sàng để ODM tạo đơn hàng. Event này chứa dữ liệu đơn hàng đã được chuyển đổi sang định dạng Ecoma.
  - **Payload:**
    - ChannelOrderId (UUID)
    - TenantId (UUID)
    - SalesChannelId (UUID)
    - ChannelPlatformOrderId (String)
    - OrderDataEcomaFormat (Object \- dữ liệu đơn hàng theo định dạng ODM cần)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ChannelOrderProcessingStatusChanged**
  - Phát ra khi trạng thái xử lý nội bộ của ChannelOrder thay đổi (ví dụ: Received \-\> ODMTransferPending).
  - **Payload:**
    - ChannelOrderId (UUID)
    - TenantId (UUID)
    - OldStatus (String)
    - NewStatus (String)
    - UpdatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**

### **10.2. Domain Events Được Xử lý (Consumed Domain Events)**

OSM (theo định nghĩa mới) lắng nghe và xử lý các Domain Event từ các Bounded Context khác khi các sự kiện đó là nguồn kích hoạt cho việc đồng bộ dữ liệu hoặc liên quan đến các thực thể được ánh xạ. Dưới đây là danh sách các event dự kiến mà OSM lắng nghe và mục đích xử lý của chúng:

- **ProductUpdatedEvent** (Từ PIM)
  - **Mục đích xử lý:** Kích hoạt tác vụ đồng bộ sản phẩm lên các kênh bán hàng có bật đồng bộ cho sản phẩm này.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - ProductId (UUID)
    - TenantId (UUID)
    - UpdatedFields (Object)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ProductVariantUpdatedEvent** (Từ PIM)
  - **Mục đích xử lý:** Tương tự ProductUpdatedEvent, kích hoạt đồng bộ sản phẩm/biến thể.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - ProductId (UUID)
    - VariantId (UUID)
    - TenantId (UUID)
    - UpdatedFields (Object)
    - IssuedAt (DateTime) **(ở mú múi giờ UTC)**
- **InventoryLevelUpdatedEvent** (Từ ICM)
  - **Mục đích xử lý:** Kích hoạt tác vụ đồng bộ tồn kho lên các kênh bán hàng có bật đồng bộ tồn kho cho SKU/vị trí này.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - TenantId (UUID)
    - InventoryItemId (UUID)
    - SKU (String)
    - StockLocationId (UUID)
    - NewQuantity (Decimal)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **OrderCreated** (Từ ODM)
  - **Mục đích xử lý:** Cập nhật trạng thái ChannelOrder thành ODMTransferSuccess và lưu ODM Order ID sau khi đơn hàng được tạo thành công trong ODM.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - OrderId (UUID)
    - TenantId (UUID)
    - SourceBoundedContext (String \- "OSM")
    - SourceTransactionId (UUID \- ChannelOrder ID)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **OrderCreationFailedEvent** (Từ ODM \- Giả định ODM phát event này khi tạo đơn hàng thất bại)
  - **Mục đích xử lý:** Cập nhật trạng thái ChannelOrder thành ODMTransferFailed và ghi lại lý do thất bại.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - TenantId (UUID)
    - SourceBoundedContext (String \- "OSM")
    - SourceTransactionId (UUID \- ChannelOrder ID)
    - FailureReason (String)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **CustomerCreated** (Từ CRM)
  - **Mục đích xử lý:** Nếu khách hàng được tạo trong CRM là kết quả của việc xử lý đơn hàng từ kênh, OSM có thể lắng nghe event này để cập nhật ánh xạ khách hàng nếu cần (tùy thuộc vào cách quản lý khách hàng từ kênh).
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - CustomerId (UUID)
    - TenantId (UUID)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **TenantDataDeletionRequestedEvent** (Từ BUM)
  - **Mục đích xử lý:** Kích hoạt quy trình xóa tất cả dữ liệu kênh bán hàng, ánh xạ, tác vụ đồng bộ và đơn hàng từ kênh liên quan đến Tenant đã yêu cầu xóa dữ liệu.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - TenantId (UUID)
    - RequestedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**

_(Lưu ý: Danh sách các sự kiện được xử lý có thể được mở rộng tùy thuộc vào các quy trình nghiệp vụ cụ thể trong hệ thống Ecoma có ảnh hưởng đến quản lý kênh và đồng bộ dữ liệu.)_

## **11\. Ranh giới Nghiệp vụ**

Ranh giới của Bounded Context OSM (theo định nghĩa mới) được xác định bởi trách nhiệm quản lý các kênh bán hàng bên ngoài và nội bộ (gian hàng TMĐT, hệ thống POS), thiết lập và duy trì kết nối, quản lý ánh xạ dữ liệu, điều phối việc đồng bộ dữ liệu (sản phẩm, tồn kho) giữa Ecoma và các kênh này, và tiếp nhận đơn hàng từ các kênh để chuyển giao cho ODM. OSM là nguồn sự thật về "chúng ta đang bán hàng trên những kênh nào, dữ liệu giữa Ecoma và kênh được ánh xạ và đồng bộ như thế nào, và những đơn hàng nào đã được tiếp nhận từ các kênh đó".

OSM không chịu trách nhiệm:

- **Xác thực danh tính người dùng:** Chỉ sử dụng dịch vụ của IAM.
- **Quản lý quyền truy cập:** Chỉ sử dụng dịch vụ của IAM. IAM kiểm soát quyền của người dùng (quản lý kênh, xem báo cáo đồng bộ) trong OSM.
- **Quản lý bản dịch metadata hoặc quy tắc định dạng locale:** Chỉ sử dụng dịch vụ của LZM và RDM.
- **Ghi nhận audit logs:** Chỉ phát sự kiện cho ALM.
- **Quản lý thông tin sản phẩm master:** Trách nhiệm của PIM. OSM chỉ lấy dữ liệu từ PIM để đồng bộ.
- **Quản lý tồn kho master:** Trách nhiệm của ICM. OSM chỉ lấy dữ liệu tồn kho từ ICM để đồng bộ.
- **Xử lý đơn hàng sau khi tiếp nhận từ kênh:** Trách nhiệm của ODM. OSM chỉ chuyển giao đơn hàng đã nhận.
- **Xử lý thanh toán:** Trách nhiệm của PPM.
- **Quản lý vận chuyển và hoàn tất đơn hàng:** Trách nhiệm của SFM.
- **Quản lý dữ liệu khách hàng master:** Trách nhiệm của CRM. OSM có thể tương tác với CRM để tìm/tạo khách hàng cho đơn hàng từ kênh.
- **Quản lý các miền nghiệp vụ khác** như nhân sự, đào tạo, quản lý công việc, tài chính, marketing.
- **Lưu trữ file asset vật lý:** Chỉ lưu trữ ID tham chiếu đến DAM.
- **Gửi thông báo thực tế:** Chỉ yêu cầu NDM gửi thông báo.
- **Xử lý logic nghiệp vụ phức tạp của các nền tảng TMĐT/POS bên ngoài:** OSM chỉ tương tác thông qua API được cung cấp bởi các nền tảng đó.
- **Cung cấp giao diện người dùng cho trải nghiệm mua sắm của khách hàng:** Trách nhiệm của các BC giao diện người dùng hoặc các hệ thống bên ngoài (website, mobile app, POS).

## **12\. Kết luận**

Bounded Context Omnichannel Sales Management (OSM), theo định nghĩa mới, là một thành phần cốt lõi quan trọng trong hệ thống Ecoma, đảm bảo khả năng kết nối và vận hành hiệu quả với các kênh bán hàng đa dạng (gian hàng TMĐT, hệ thống POS). Bằng cách tập trung trách nhiệm quản lý kênh, cấu hình kết nối, ánh xạ dữ liệu, điều phối đồng bộ dữ liệu (sản phẩm, tồn kho) và tiếp nhận đơn hàng từ kênh vào một Context duy nhất, OSM cung cấp một nền tảng đáng tin cậy để mở rộng phạm vi bán hàng của tổ chức khách hàng. Việc thiết kế OSM với mô hình domain rõ ràng, các khía cạnh quan trọng của miền được làm rõ, tương tác được định nghĩa và các sự kiện nghiệp vụ phù hợp (bao gồm cả sự kiện lắng nghe) là nền tảng để xây dựng một hệ thống quản lý kênh bán hàng mạnh mẽ và dễ mở rộng, có khả năng tích hợp với nhiều nền tảng khác nhau.

Tài liệu này cung cấp cái nhìn tổng quan chi tiết về OSM theo vai trò mới, bao gồm mô hình domain, các khía cạnh quan trọng của miền, tương tác, use cases, Domain Service, Application Service và Domain Event (phát ra và lắng nghe với payload dự kiến). Đây là nền tảng để chuyển sang giai đoạn thiết kế kỹ thuật chi tiết và triển khai Microservice OSM theo định nghĩa này.
