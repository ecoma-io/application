# **Tài liệu Thiết kế Miền: Bounded Context Inventory Control Management (ICM)**

## **1\. Giới thiệu**

Tài liệu này cung cấp mô tả chi tiết về Bounded Context **Inventory Control Management (ICM)** trong hệ thống Ecoma. ICM là một trong những Bounded Context thuộc nhóm Operations Feature, đóng vai trò quản lý số lượng, trạng thái và vị trí của hàng hóa tồn kho trên toàn bộ mạng lưới kho hàng và cửa hàng của tổ chức khách hàng.

ICM đảm bảo tính chính xác của dữ liệu tồn kho, hỗ trợ các quy trình nghiệp vụ liên quan đến nhập, xuất, chuyển kho và điều chỉnh tồn kho, cung cấp thông tin tồn kho khả dụng cho các kênh bán hàng và quy trình hoàn tất đơn hàng.

## **2\. Phạm vi của Tài liệu**

Tài liệu này tập trung vào việc định nghĩa và mô tả Bounded Context ICM ở cấp độ thiết kế miền (domain design), cung cấp đủ chi tiết để hỗ trợ việc thiết kế các Domain Service và Application Service. Cụ thể, tài liệu này bao gồm:

- Xác định vai trò và trách nhiệm chính của ICM, tập trung vào theo dõi số lượng, trạng thái và vị trí tồn kho.
- Mô tả các khái niệm và thực thể cốt lõi trong mô hình domain của ICM ở cấp độ chi tiết hơn, bao gồm các Aggregate Root, Entity và Value Object với các thuộc tính chính, có tính đến các loại tồn kho (Available, Reserved, Defective, etc.) và vị trí lưu trữ.
- Định nghĩa Ngôn ngữ Chung (Ubiquitous Language) trong phạm vi ICM.
- Mô tả **Các Khía cạnh Quan trọng của Miền ICM**, làm rõ các quy tắc và cấu trúc nghiệp vụ chi phối hoạt động của Context này.
- Làm rõ các tương tác chính giữa ICM và các Bounded Context khác là nguồn phát sinh hoặc tiêu thụ dữ liệu tồn kho.
- Phác thảo các **Use cases** chính có sự tham gia của ICM, tập trung vào actor, mục đích và các Domain/Application Service liên quan.
- Xác định ranh giới nghiệp vụ của ICM, nhấn mạnh những gì ICM không chịu trách nhiệm.
- Đề xuất các Domain Service và Application Service tiềm năng trong ICM, mô tả trách nhiệm chính của từng service.
- Xác định và mô tả các **Domain Events** mà ICM tương tác, được chia thành các sự kiện ICM **phát ra** (Published Events) và các sự kiện ICM **lắng nghe và xử lý** (Consumed Events), bao gồm payload dự kiến của từng event.

Tài liệu này **không** đi sâu vào các chi tiết kỹ thuật triển khai cụ thể hoặc mô tả chi tiết các bước thực hiện (how) của từng luồng nghiệp vụ **bên trong các service**. Các khía cạnh sau **không** nằm trong phạm vi của tài liệu này:

- Chi tiết cài đặt kỹ thuật của Microservice ICM.
- Cấu trúc cơ sở dữ liệu chi tiết (schema) của ICM.
- Các quyết định công nghệ cụ thể bên trong ICM.
- Luồng dữ liệu chi tiết đến cấp độ từng trường thông tin giữa ICM và các BC khác.
- Cấu hình hạ tầng triển khai cụ thể cho Microservice ICM.
- Thiết kế giao diện người dùng để quản lý tồn kho.
- Quản lý chi tiết thông tin sản phẩm (thuộc về PIM). ICM chỉ sử dụng SKU và ID sản phẩm.
- Quản lý quy trình mua hàng từ nhà cung cấp (thuộc về một BC Procurement/Purchasing riêng). ICM chỉ nhận thông báo khi hàng đã sẵn sàng nhập kho.
- Quản lý quy trình vận chuyển và giao hàng thực tế (thuộc về SFM). ICM chỉ thông báo khi hàng đã được xuất kho.
- Xử lý đơn hàng hoặc giao dịch bán hàng (thuộc về OSM/ODM). ICM chỉ nhận yêu cầu trừ tồn kho hoặc kiểm tra khả dụng.
- Quản lý giá vốn hàng bán chi tiết (thuộc về FAM). ICM chỉ cung cấp dữ liệu về số lượng xuất kho để FAM tính toán giá vốn.

## **3\. Vai trò và Trách nhiệm Chính**

Bounded Context ICM chịu trách nhiệm quản lý số lượng và trạng thái tồn kho. Các trách nhiệm chính bao gồm:

- **Theo dõi Số lượng Tồn kho:** Ghi nhận và theo dõi số lượng hàng hóa theo từng sản phẩm/biến thể (SKU) tại từng vị trí lưu trữ (kho, cửa hàng).
- **Quản lý Trạng thái Tồn kho:** Phân loại và theo dõi tồn kho theo các trạng thái khác nhau (ví dụ: Available \- có thể bán, Reserved \- đã đặt chỗ cho đơn hàng, Defective \- lỗi, In Transit \- đang chuyển kho).
- **Quản lý Vị trí Lưu trữ (Stock Location):** Định nghĩa và quản lý các vị trí lưu trữ hàng hóa (kho, khu vực trong kho, kệ, thùng).
- **Xử lý Nhập kho:** Ghi nhận việc nhập hàng vào tồn kho, tăng số lượng tồn kho tại vị trí nhận hàng.
- **Xử lý Xuất kho:** Ghi nhận việc xuất hàng ra khỏi tồn kho (ví dụ: để hoàn tất đơn hàng), giảm số lượng tồn kho và cập nhật trạng thái (ví dụ: từ Reserved sang Shipped/Deducted).
- **Xử lý Chuyển kho:** Ghi nhận việc di chuyển hàng hóa giữa các vị trí lưu trữ, cập nhật số lượng tại cả vị trí đi và vị trí đến, có thể sử dụng trạng thái In Transit.
- **Xử lý Điều chỉnh Tồn kho:** Cho phép điều chỉnh số lượng tồn kho do kiểm kê, mất mát, hư hỏng, v.v.
- **Quản lý Đặt chỗ Tồn kho (Reservation):** Đặt chỗ số lượng tồn kho khả dụng cho các đơn hàng hoặc mục đích khác ngay sau khi đơn hàng được xác nhận hoặc yêu cầu được tạo, đảm bảo hàng không bị bán cho người khác.
- **Cung cấp Thông tin Tồn kho Khả dụng:** Cung cấp thông tin chính xác và kịp thời về số lượng tồn kho khả dụng (Available) cho các kênh bán hàng (OSM) và quy trình hoàn tất đơn hàng (SFM).
- **Cảnh báo Tồn kho:** Phát ra cảnh báo khi mức tồn kho đạt đến ngưỡng tối thiểu hoặc tối đa.
- **Phát Sự kiện Nghiệp vụ:** Phát ra các Sự kiện Nghiệp vụ quan trọng khi số lượng hoặc trạng thái tồn kho thay đổi.

## **4\. Mô hình Domain (Chi tiết hơn)**

Trong phạm vi Bounded Context ICM, chúng ta xác định các Aggregate Root, Entity và Value Object cốt lõi với các thuộc tính chính:

**Aggregate Roots:**

- **InventoryItem:** Là Aggregate Root đại diện cho một loại hàng hóa tồn kho duy nhất (được xác định bởi SKU) trong một tổ chức. InventoryItem quản lý tổng số lượng của SKU đó trên toàn bộ mạng lưới kho hàng của tổ chức và các thông tin liên quan đến SKU trong ngữ cảnh tồn kho.
  - **ID:** Unique identifier (UUID).
  - **TenantId:** ID của tổ chức sở hữu tồn kho (liên kết với IAM).
  - **ProductId:** ID của sản phẩm liên quan (liên kết với PIM).
  - **VariantId:** **Optional** ID của biến thể liên quan (liên kết với PIM).
  - **SKU:** Mã SKU của sản phẩm/biến thể (liên kết với PIM).
  - **TotalQuantity:** Tổng số lượng của SKU này trên toàn bộ mạng lưới kho hàng của Tenant.
  - **StockLevels:** Danh sách các StockLevel Entities (số lượng theo trạng thái và vị trí).
  - **ReorderPoint:** **Optional** Ngưỡng đặt hàng lại (số lượng tối thiểu).
  - **MaxStockLevel:** **Optional** Ngưỡng tồn kho tối đa.
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ AddStock, DeductStock, AdjustStock, TransferStock, ReserveStock, UnreserveStock, CheckAvailability.
- **StockLocation:** Là Aggregate Root đại diện cho một vị trí lưu trữ hàng hóa (kho, cửa hàng). StockLocation quản lý thông tin về vị trí và có thể chứa danh sách các InventoryItem được lưu trữ tại đó (hoặc mối quan hệ này được quản lý từ phía InventoryItem). Giả định ban đầu là StockLevel Entity trong InventoryItem Aggregate sẽ tham chiếu đến StockLocation ID. StockLocation Aggregate sẽ quản lý thông tin về vị trí.
  - **ID:** Unique identifier (UUID).
  - **TenantId:** ID của tổ chức sở hữu vị trí lưu trữ.
  - **Name:** Tên vị trí (có thể đa ngôn ngữ, sử dụng LZM).
  - **Address:** Địa chỉ vị trí (Address Value Object \- có thể dùng chung).
  - **Type:** Loại vị trí (LocationType Value Object: Warehouse, Store).
  - **IsActive:** Trạng thái hoạt động.
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ Activate, Deactivate, UpdateAddress.

**Entities (thuộc về các Aggregate Root):**

- **StockLevel (thuộc InventoryItem):** Đại diện cho số lượng của một SKU ở một trạng thái cụ thể tại một vị trí lưu trữ cụ thể.
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root InventoryItem.
  - **StockLocationId:** ID của vị trí lưu trữ (liên kết với StockLocation Aggregate).
  - **Status:** Trạng thái tồn kho (StockStatus Value Object: Available, Reserved, Defective, In Transit, etc.).
  - **Quantity:** Số lượng của SKU ở trạng thái này tại vị trí này.
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ IncreaseQuantity, DecreaseQuantity.
- **StockMovement (Entity độc lập):** Đại diện cho một giao dịch di chuyển hàng hóa (nhập, xuất, chuyển kho, điều chỉnh). Có thể là Aggregate Root riêng nếu quy trình phức tạp (ví dụ: cần phê duyệt), nhưng giả định Entity độc lập cho đơn giản ban đầu.
  - **ID:** Unique identifier (UUID).
  - **TenantId:** ID của tổ chức.
  - **MovementType:** Loại di chuyển (MovementType Value Object: Receipt, Issue, Transfer, Adjustment).
  - **TransactionDate:** Ngày xảy ra giao dịch. **Lưu trữ ở múi giờ UTC.**
  - **PostingDate:** Ngày ghi nhận vào hệ thống. **Lưu trữ ở múi giờ UTC.**
  - **SourceLocationId:** **Optional** Vị trí đi (cho Issue, Transfer).
  - **DestinationLocationId:** **Optional** Vị trí đến (cho Receipt, Transfer).
  - **SourceBoundedContext:** BC đã yêu cầu di chuyển (ví dụ: "SFM", "Procurement").
  - **SourceTransactionId:** ID giao dịch gốc trong BC nguồn (ví dụ: Shipment ID, Purchase Order ID).
  - **Items:** Danh sách các StockMovementItem Entities.
  - **Status:** Trạng thái di chuyển (MovementStatus Value Object: Pending, Completed, Cancelled).
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ Complete, Cancel.
- **StockMovementItem (thuộc StockMovement):** Chi tiết về một mặt hàng trong giao dịch di chuyển.
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root StockMovement.
  - **InventoryItemId:** ID của InventoryItem liên quan.
  - **SKU:** Mã SKU.
  - **Quantity:** Số lượng di chuyển.
  - **SourceStockStatus:** **Optional** Trạng thái tồn kho tại vị trí đi trước khi di chuyển.
  - **DestinationStockStatus:** **Optional** Trạng thái tồn kho tại vị trí đến sau khi di chuyển.
  - **Notes:** Ghi chú (tùy chọn).
- **StockAdjustment (Entity độc lập):** Đại diện cho một giao dịch điều chỉnh tồn kho. Có thể là Aggregate Root riêng. Giả định Entity độc lập thuộc Employee/User thực hiện cho đơn giản.
  - **ID:** Unique identifier (UUID).
  - **TenantId:** ID của tổ chức.
  - **AdjustmentDate:** Ngày điều chỉnh. **Lưu trữ ở múi giờ UTC.**
  - **PostingDate:** Ngày ghi nhận vào hệ thống. **Lưu trữ ở múi giờ UTC.**
  - **StockLocationId:** Vị trí điều chỉnh.
  - **Reason:** Lý do điều chỉnh (AdjustmentReason Value Object: Physical Count, Damage, Loss, etc.).
  - **AdjustedByUserId:** ID người thực hiện điều chỉnh (liên kết với IAM).
  - **Items:** Danh sách các StockAdjustmentItem Entities.
  - **Notes:** Ghi chú (tùy chọn).
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ Submit.
- **StockAdjustmentItem (thuộc StockAdjustment):** Chi tiết về một mặt hàng trong giao dịch điều chỉnh.
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root StockAdjustment.
  - **InventoryItemId:** ID của InventoryItem liên quan.
  - **SKU:** Mã SKU.
  - **OldQuantity:** Số lượng trước điều chỉnh.
  - **NewQuantity:** Số lượng sau điều chỉnh.
  - **StockStatus:** Trạng thái tồn kho bị điều chỉnh.
  - **Difference:** Số lượng chênh lệch (NewQuantity \- OldQuantity).

**Value Objects:**

- **UsageQuantity:** Số lượng (Value, Unit).
- **StockStatus:** Trạng thái tồn kho (Available, Reserved, Defective, In Transit, etc.).
  - **Code:** Mã trạng thái.
  - **Name:** Tên trạng thái (có thể đa ngôn ngữ, sử dụng LZM).
  - **IsSalable:** Boolean chỉ định có thể bán được không (quan trọng cho Available).
- **LocationType:** Loại vị trí lưu trữ (Warehouse, Store).
- **MovementType:** Loại di chuyển tồn kho (Receipt, Issue, Transfer, Adjustment).
- **MovementStatus:** Trạng thái di chuyển (Pending, Completed, Cancelled).
- **AdjustmentReason:** Lý do điều chỉnh tồn kho (Physical Count, Damage, Loss, etc.).
  - **Code:** Mã lý do.
  - **Name:** Tên lý do (có thể đa ngôn ngữ, sử dụng LZM).
- **Address:** Địa chỉ (Street, City, Country, PostalCode) \- có thể dùng chung.
- **LocalizedText:** Giá trị văn bản đa ngôn ngữ (sử dụng Translation Key).
- **InventoryQueryCriteria:** Tiêu chí truy vấn tồn kho.
  - **TenantId:** Lọc theo tổ chức.
  - **SKU:** Lọc theo SKU.
  - **StockLocationId:** Lọc theo vị trí.
  - **StockStatus:** Lọc theo trạng thái.
  - **IsSalable:** Lọc theo khả năng bán được.
  - **MinQuantity:** Lọc theo số lượng tối thiểu.
  - **PageNumber, PageSize, SortBy, SortOrder:** Phân trang và sắp xếp.

## **5\. Ngôn ngữ Chung (Ubiquitous Language)**

Trong Bounded Context ICM, các thuật ngữ sau đây có ý nghĩa cụ thể và nhất quán:

- **Inventory:** Hàng hóa tồn kho.
- **Inventory Item:** Một loại hàng hóa tồn kho duy nhất (được xác định bởi SKU).
- **SKU (Stock Keeping Unit):** Mã định danh duy nhất cho một sản phẩm/biến thể, được sử dụng để theo dõi tồn kho.
- **Stock Location:** Vị trí vật lý nơi hàng hóa được lưu trữ (kho, cửa hàng).
- **Stock Level:** Số lượng của một Inventory Item tại một Stock Location và ở một Stock Status cụ thể.
- **Stock Status:** Trạng thái của tồn kho (Available, Reserved, Defective, In Transit).
- **Available Stock:** Tồn kho khả dụng, có thể bán được.
- **Reserved Stock:** Tồn kho đã được đặt chỗ cho đơn hàng hoặc mục đích khác.
- **Receipt:** Giao dịch nhập hàng vào tồn kho.
- **Issue:** Giao dịch xuất hàng ra khỏi tồn kho.
- **Transfer:** Giao dịch di chuyển hàng hóa giữa các Stock Location.
- **Adjustment:** Giao dịch điều chỉnh số lượng tồn kho do các lý do khác (kiểm kê, mất mát).
- **Stock Movement:** Một bản ghi về giao dịch nhập, xuất, chuyển kho.
- **Stock Adjustment:** Một bản ghi về giao dịch điều chỉnh tồn kho.
- **Reservation:** Hành động đặt chỗ số lượng tồn kho khả dụng.
- **Unreservation:** Hành động hủy đặt chỗ tồn kho.
- **Reorder Point:** Ngưỡng tồn kho tối thiểu để kích hoạt đặt hàng lại.
- **Stocktake/Physical Count:** Quy trình kiểm đếm tồn kho thực tế.

## **6\. Các Khía cạnh Quan trọng của Miền ICM**

Phần này mô tả các cấu trúc, quy tắc và khái niệm nghiệp vụ quan trọng chi phối hoạt động của Bounded Context ICM.

### **6.1. Theo dõi Tồn kho theo SKU, Vị trí và Trạng thái**

ICM theo dõi tồn kho ở mức độ chi tiết: số lượng của từng SKU được quản lý riêng biệt tại mỗi Stock Location và được phân loại theo các Stock Status khác nhau. Điều này cho phép hệ thống có cái nhìn chính xác về lượng hàng hóa có sẵn để bán (Available), hàng đã được phân bổ (Reserved), hàng cần xử lý (Defective), v.v., tại từng địa điểm cụ thể.

### **6.2. Quản lý Đặt chỗ Tồn kho (Reservation)**

Một trong những chức năng cốt lõi của ICM là quản lý đặt chỗ tồn kho. Khi một đơn hàng hoặc yêu cầu phân bổ được xác nhận, ICM sẽ "đặt chỗ" số lượng hàng cần thiết từ tồn kho Available. Số lượng đã đặt chỗ sẽ chuyển sang trạng thái Reserved và không còn hiển thị là Available cho các đơn hàng mới. Điều này ngăn chặn tình trạng bán vượt quá tồn kho thực tế (overselling). Logic đặt chỗ cần xem xét các quy tắc ưu tiên (ví dụ: đặt chỗ từ kho gần khách hàng nhất).

### **6.3. Xử lý Các Loại Di chuyển Tồn kho Chính**

ICM xử lý các loại di chuyển tồn kho cơ bản:

- **Nhập kho (Receipt):** Tăng số lượng tồn kho tại một vị trí, thường chuyển từ trạng thái "In Transit" (nếu có BC Procurement) hoặc trực tiếp vào "Available".
- **Xuất kho (Issue):** Giảm số lượng tồn kho tại một vị trí, thường chuyển từ trạng thái "Reserved" sang "Deducted" hoặc "In Transit" (nếu có BC SFM).
- **Chuyển kho (Transfer):** Giảm số lượng tại vị trí đi và tăng số lượng tại vị trí đến, có thể sử dụng trạng thái trung gian "In Transit" trong quá trình di chuyển.
- **Điều chỉnh (Adjustment):** Thay đổi số lượng tồn kho để đồng bộ với kiểm kê thực tế hoặc ghi nhận mất mát/hư hỏng.

Mỗi di chuyển được ghi lại dưới dạng StockMovement hoặc StockAdjustment để có lịch sử đầy đủ.

### **6.4. Cung cấp Thông tin Tồn kho Khả dụng (Available Stock)**

ICM là nguồn cung cấp thông tin tồn kho khả dụng cho các kênh bán hàng. Số lượng Available Stock được tính toán dựa trên tổng số lượng tồn kho trừ đi số lượng đã Reserved và các trạng thái không bán được khác. Thông tin này cần được cập nhật gần như thời gian thực để đảm bảo hiển thị chính xác trên website, ứng dụng di động, v.v.

### **6.5. Tích hợp với PIM qua SKU**

ICM sử dụng SKU (Stock Keeping Unit) làm mã định danh chính để theo dõi tồn kho của từng loại sản phẩm/biến thể. ICM phụ thuộc vào PIM để có thông tin master về SKU và các thuộc tính sản phẩm liên quan. Mối quan hệ giữa InventoryItem và Product/Variant trong PIM là 1-1 (một InventoryItem tương ứng với một SKU duy nhất).

### **6.6. Cảnh báo Tồn kho Thấp/Cao**

ICM có thể được cấu hình các ngưỡng tồn kho tối thiểu (Reorder Point) và tối đa (MaxStockLevel) cho từng InventoryItem. Khi số lượng tồn kho Available (hoặc tổng tồn kho) đạt đến hoặc vượt qua các ngưỡng này, ICM sẽ phát ra cảnh báo (thường qua Event) để các BC liên quan (ví dụ: Procurement, WPM) có thể kích hoạt quy trình đặt hàng lại hoặc xử lý tồn kho dư thừa.

## **7\. Tương tác với các Bounded Context khác**

ICM tương tác với nhiều Bounded Context khác trong hệ thống Ecoma, đặc biệt là các BC liên quan đến bán hàng và hoàn tất đơn hàng.

- **Tương tác với Core BCs:**
  - **IAM:** ICM cần IAM (Request/Reply) để xác thực và ủy quyền cho người dùng quản lý tồn kho (nhân viên kho, quản lý tồn kho). ICM lấy thông tin Tenant ID từ ngữ cảnh phiên làm việc.
  - **LZM & RDM:** ICM cần LZM (Request/Reply) để quản lý và hiển thị tên vị trí lưu trữ, lý do điều chỉnh, trạng thái tồn kho đa ngôn ngữ. ICM gọi LZM để tra cứu bản dịch và định dạng dữ liệu (số lượng). LZM gọi RDM để lấy quy tắc định dạng và các dữ liệu tham chiếu (ví dụ: loại vị trí, loại di chuyển, lý do điều chỉnh nếu không quản lý nội bộ).
  - **ALM:** ICM phát ra các sự kiện audit log (Event) khi có các hành động quan trọng liên quan đến quản lý tồn kho (ví dụ: nhập kho, xuất kho, chuyển kho, điều chỉnh tồn kho, thay đổi trạng thái tồn kho, đặt chỗ/hủy đặt chỗ).
- **Tương tác với Feature BCs:**
  - **PIM:** ICM gọi PIM (Request/Reply) để lấy thông tin master về sản phẩm/biến thể (SKU, ID). PIM phát sự kiện (ProductCreated, ProductVariantCreated, ProductUpdated) mà ICM có thể lắng nghe để tạo InventoryItem ban đầu hoặc cập nhật thông tin liên kết.
  - **OSM & ODM:**
    - OSM/ODM gọi ICM (Request/Reply Query) để kiểm tra tồn kho khả dụng (CheckInventoryAvailabilityQuery).
    - ODM gửi Command (ví dụ: ReserveInventoryCommand) hoặc phát Event (OrderConfirmedEvent) mà ICM lắng nghe để đặt chỗ tồn kho.
    - ODM/SFM gửi Command (ví dụ: RecordInventoryIssueCommand) hoặc phát Event (ShipmentReadyForIssueEvent) mà ICM lắng nghe để trừ tồn kho đã đặt chỗ.
  - **SFM:** SFM gọi ICM (Request/Reply Query) để lấy thông tin tồn kho đã đặt chỗ và vị trí (GetReservedInventoryDetailsQuery). SFM gửi Command (ví dụ: ConfirmInventoryIssuedCommand) hoặc phát Event (ShipmentCompletedEvent) mà ICM lắng nghe để xác nhận hàng đã xuất kho vật lý (cập nhật trạng thái tồn kho từ In Transit sang Deducted).
  - **Procurement/Purchasing BC (Tiềm năng):** BC này phát Event (GoodsReceivedAtLocationEvent) mà ICM lắng nghe để ghi nhận nhập kho.
  - **FAM:** ICM phát Event (StockMovementCompletedEvent, StockAdjustmentRecordedEvent) chứa thông tin về số lượng hàng nhập/xuất/điều chỉnh để FAM tính toán giá trị tồn kho và giá vốn hàng bán.

## **8\. Use cases**

Dưới đây là mô tả các use case chính có sự tham gia của ICM, được tổ chức theo các nhóm chức năng chính, tập trung vào actor, mục đích và các Domain/Application Service liên quan.

### **8.1. Use Cases liên quan đến Quản lý Số lượng và Trạng thái Tồn kho**

Nhóm này bao gồm các use case cốt lõi về việc theo dõi và cập nhật số lượng tồn kho.

- **Use case: Ghi nhận Nhập kho Hàng hóa:**
  - **Actor:** Hệ thống (từ BC Procurement/Purchasing), Người dùng (nhân viên kho/quản lý tồn kho).
  - **Mục đích:** Tăng số lượng tồn kho cho một SKU tại một vị trí và trạng thái cụ thể khi hàng hóa được nhập vào.
  - **Service liên quan:** Được xử lý bởi StockMovementApplicationService (Event Handler cho GoodsReceivedAtLocationEvent hoặc Command Handler cho RecordGoodsReceiptCommand). Sử dụng StockMovementService để tạo bản ghi di chuyển và InventoryService để cập nhật StockLevel/TotalQuantity. Sử dụng StockMovement Repository, InventoryItem Repository. Phát sự kiện StockMovementCompleted (loại Receipt), InventoryLevelUpdated, audit log cho ALM. Phát sự kiện cho FAM.
- **Use case: Ghi nhận Xuất kho Hàng hóa:**
  - **Actor:** Hệ thống (từ BC SFM), Người dùng (nhân viên kho/quản lý tồn kho).
  - **Mục đích:** Giảm số lượng tồn kho cho một SKU tại một vị trí và trạng thái cụ thể khi hàng hóa được xuất ra (ví dụ: cho đơn hàng).
  - **Service liên quan:** Được xử lý bởi StockMovementApplicationService (Event Handler cho ShipmentReadyForIssueEvent hoặc Command Handler cho RecordInventoryIssueCommand). Sử dụng StockMovementService để tạo bản ghi di chuyển và InventoryService để cập nhật StockLevel/TotalQuantity (thường giảm Reserved, tăng In Transit/Deducted). Sử dụng StockMovement Repository, InventoryItem Repository. Phát sự kiện StockMovementCompleted (loại Issue), InventoryLevelUpdated, audit log cho ALM. Phát sự kiện cho FAM.
- **Use case: Ghi nhận Chuyển kho Hàng hóa:**
  - **Actor:** Người dùng (nhân viên kho/quản lý tồn kho).
  - **Mục đích:** Di chuyển số lượng tồn kho của một SKU từ một vị trí sang vị trí khác.
  - **Service liên quan:** Được xử lý bởi StockMovementApplicationService (Command Handler cho RecordStockTransferCommand). Sử dụng StockMovementService để tạo bản ghi di chuyển và InventoryService để cập nhật StockLevel/TotalQuantity (giảm ở vị trí đi, tăng ở vị trí đến). Sử dụng StockMovement Repository, InventoryItem Repository. Phát sự kiện StockMovementCompleted (loại Transfer), InventoryLevelUpdated, audit log cho ALM.
- **Use case: Ghi nhận Điều chỉnh Tồn kho:**
  - **Actor:** Người dùng (nhân viên kho/quản lý tồn kho).
  - **Mục đích:** Thay đổi số lượng tồn kho để đồng bộ với kiểm kê thực tế hoặc ghi nhận mất mát/hư hỏng.
  - **Service liên quan:** Được xử lý bởi StockAdjustmentApplicationService (Command Handler cho RecordStockAdjustmentCommand). Sử dụng StockAdjustmentService để tạo bản ghi điều chỉnh và InventoryService để cập nhật StockLevel/TotalQuantity. Sử dụng StockAdjustment Repository, InventoryItem Repository. Phát sự kiện StockAdjustmentRecorded, InventoryLevelUpdated, audit log cho ALM. Phát sự kiện cho FAM.

### **8.2. Use Cases liên quan đến Đặt chỗ Tồn kho (Reservation)**

Nhóm này tập trung vào việc quản lý số lượng tồn kho được phân bổ cho các đơn hàng hoặc yêu cầu khác.

- **Use case: Đặt chỗ Tồn kho cho Đơn hàng:**
  - **Actor:** Hệ thống (từ ODM).
  - **Mục đích:** Giảm số lượng tồn kho Available và tăng số lượng Reserved khi đơn hàng được xác nhận.
  - **Service liên quan:** Được xử lý bởi InventoryApplicationService (Event Handler cho OrderConfirmedEvent hoặc Command Handler cho ReserveInventoryCommand). Sử dụng InventoryService để thực hiện logic đặt chỗ trên InventoryItem Aggregate. Sử dụng InventoryItem Repository. Phát sự kiện InventoryReserved, InventoryLevelUpdated, audit log cho ALM. Phát sự kiện InventoryReservationFailed nếu không đủ tồn kho.
- **Use case: Hủy Đặt chỗ Tồn kho:**
  - **Actor:** Hệ thống (từ ODM/SFM \- ví dụ: đơn hàng bị hủy, hàng trả lại).
  - **Mục đích:** Giảm số lượng tồn kho Reserved và tăng số lượng Available khi việc đặt chỗ không còn cần thiết.
  - **Service liên quan:** Được xử lý bởi InventoryApplicationService (Event Handler từ ODM/SFM hoặc Command Handler cho UnreserveInventoryCommand). Sử dụng InventoryService để thực hiện logic hủy đặt chỗ trên InventoryItem Aggregate. Sử dụng InventoryItem Repository. Phát sự kiện InventoryUnreserved, InventoryLevelUpdated, audit log cho ALM.

### **8.3. Use Cases liên quan đến Truy vấn và Báo cáo Tồn kho**

Nhóm này cho phép người dùng hoặc các BC khác truy xuất thông tin về tồn kho.

- **Use case: Kiểm tra Tồn kho Khả dụng:**
  - **Actor:** Hệ thống (từ OSM/ODM/SFM), Người dùng.
  - **Mục đích:** Lấy số lượng tồn kho Available cho một SKU tại một hoặc nhiều vị trí.
  - **Service liên quan:** Được xử lý bởi InventoryQueryApplicationService (Query Handler cho CheckInventoryAvailabilityQuery). Sử dụng InventoryService hoặc InventoryQueryService để truy vấn InventoryItem Aggregate và tổng hợp số lượng Available. Sử dụng InventoryItem Repository.
- **Use case: Xem Chi tiết Tồn kho theo SKU và Vị trí:**
  - **Actor:** Người dùng (có quyền xem tồn kho).
  - **Mục đích:** Xem số lượng tồn kho của một SKU được phân bổ theo từng trạng thái tại từng vị trí lưu trữ.
  - **Service liên quan:** Được xử lý bởi InventoryQueryApplicationService (Query Handler cho GetInventoryItemDetailsQuery). Sử dụng InventoryQueryService để lấy InventoryItem Aggregate. Sử dụng InventoryItem Repository. Gọi PIM Service để lấy thông tin sản phẩm, StockLocation Repository để lấy thông tin vị trí, LZM Service để lấy tên trạng thái/vị trí đa ngôn ngữ.
- **Use case: Xem Danh sách Vị trí Lưu trữ:**
  - **Actor:** Người dùng (có quyền xem cấu trúc kho).
  - **Mục đích:** Xem danh sách các kho hàng và cửa hàng đang hoạt động.
  - **Service liên quan:** Được xử lý bởi InventoryQueryApplicationService (Query Handler cho GetStockLocationsQuery). Sử dụng InventoryQueryService để lấy StockLocation Aggregates. Sử dụng StockLocation Repository. Gọi LZM Service để lấy tên vị trí đa ngôn ngữ.
- **Use case: Xem Lịch sử Di chuyển Tồn kho:**
  - **Actor:** Người dùng (có quyền xem lịch sử tồn kho).
  - **Mục đích:** Xem các giao dịch nhập, xuất, chuyển kho đã xảy ra cho một SKU hoặc tại một vị trí.
  - **Service liên quan:** Được xử lý bởi InventoryQueryApplicationService (Query Handler cho GetStockMovementsHistoryQuery). Sử dụng InventoryQueryService để truy vấn StockMovement Entities. Sử dụng StockMovement Repository. Gọi PIM Service, StockLocation Repository, LZM Service.

## **9\. Domain Services**

Domain Services trong ICM chứa logic nghiệp vụ quan trọng không thuộc về một Aggregate Root cụ thể hoặc cần phối hợp nhiều Aggregate Root.

- **InventoryService:**
  - **Trách nhiệm:** Quản lý vòng đời của InventoryItem. Xử lý logic tăng/giảm/điều chỉnh số lượng trong StockLevel Entities, cập nhật TotalQuantity. Xử lý logic đặt chỗ và hủy đặt chỗ tồn kho, bao gồm cả logic chọn vị trí phù hợp. Kiểm tra tồn kho khả dụng. Thực hiện các quy tắc nghiệp vụ như kiểm tra ngưỡng tồn kho. Phối hợp với InventoryItem Repository, StockLocation Repository (để lấy thông tin vị trí), PIM Service (để lấy thông tin SKU/sản phẩm).
  - **Các phương thức tiềm năng:** AddStock(tenantId, sku, locationId, status, quantity), DeductStock(tenantId, sku, locationId, status, quantity), AdjustStock(tenantId, sku, locationId, status, newQuantity), TransferStock(tenantId, sku, sourceLocationId, destinationLocationId, quantity, sourceStatus, destinationStatus), ReserveStock(tenantId, sku, quantity, orderId), UnreserveStock(tenantId, sku, quantity, orderId), CheckAvailability(tenantId, sku, locationId, requiredQuantity).
- **StockLocationService:**
  - **Trách nhiệm:** Quản lý vòng đời của StockLocation. Phối hợp với StockLocation Repository.
  - **Các phương thức tiềm năng:** CreateStockLocation(tenantId, details), UpdateStockLocation(locationId, tenantId, updates), DeactivateStockLocation(locationId, tenantId).
- **StockMovementService:**
  - **Trách nhiệm:** Quản lý vòng đời của StockMovement. Tạo và cập nhật trạng thái StockMovement. Phối hợp với StockMovement Repository, InventoryService (để thực hiện thay đổi tồn kho thực tế khi movement hoàn thành).
  - **Các phương thức tiềm năng:** RecordReceipt(tenantId, details), RecordIssue(tenantId, details), RecordTransfer(tenantId, details), CompleteMovement(movementId, tenantId), CancelMovement(movementId, tenantId).
- **StockAdjustmentService:**
  - **Trách nhiệm:** Quản lý vòng đời của StockAdjustment. Tạo StockAdjustment. Phối hợp với StockAdjustment Repository, InventoryService (để thực hiện điều chỉnh tồn kho thực tế).
  - **Các phương thức tiềm năng:** RecordAdjustment(tenantId, details, adjustedByUserId).
- **InventoryQueryService (Optional Domain Service):** Nếu logic truy vấn phức tạp (tìm kiếm InventoryItem, lấy tồn kho theo nhiều tiêu chí, báo cáo tồn kho), có thể tách ra.
  - **Trách nhiệm:** Cung cấp các phương thức truy vấn dữ liệu InventoryItem, StockLevel, StockLocation, StockMovement, StockAdjustment. Phối hợp với InventoryItem Repository, StockLocation Repository, StockMovement Repository, StockAdjustment Repository, PIM Service (để lấy tên sản phẩm cho báo cáo), LZM Service.
  - **Các phương thức tiềm năng:** GetInventoryItemDetails(itemId, tenantId), GetStockLevels(tenantId, sku, locationId), SearchInventoryItems(criteria), GetStockMovements(tenantId, criteria).

## **9\. Application Services**

Application Services trong ICM là lớp mỏng điều phối các hành động từ bên ngoài (ví dụ: từ API Gateway, Message Broker) đến Domain Model (Aggregate Roots, Domain Services). Chúng xử lý các tác vụ kỹ thuật như lắng nghe Event, xử lý Query, thực hiện ủy quyền, và gọi Domain Service.

- **InventoryApplicationService:**
  - **Trách nhiệm:** Xử lý các command liên quan đến quản lý InventoryItem và Reservation từ API (ví dụ: ReserveStockCommand, UnreserveStockCommand) hoặc lắng nghe Event từ các BC khác (ví dụ: OrderConfirmedEvent từ ODM, TenantDataDeletionRequestedEvent từ BUM). Sử dụng InventoryService và InventoryItem Repository. Thực hiện ủy quyền với IAM (nếu từ API).
  - **Các phương thức tiềm năng:** HandleReserveStockCommand(command), HandleUnreserveStockCommand(command), HandleOrderConfirmedEvent(event), HandleTenantDataDeletionRequestedEvent(event).
- **StockMovementApplicationService:**
  - **Trách nhiệm:** Xử lý các command liên quan đến StockMovement từ API (ví dụ: RecordGoodsReceiptCommand, RecordInventoryIssueCommand, RecordStockTransferCommand) hoặc lắng nghe Event từ các BC khác (ví dụ: GoodsReceivedAtLocationEvent từ Procurement, ShipmentCompletedEvent từ SFM). Sử dụng StockMovementService và các Repository tương ứng. Thực hiện ủy quyền với IAM (nếu từ API).
  - **Các phương thức tiềm năng:** HandleRecordGoodsReceiptCommand(command), HandleRecordInventoryIssueCommand(command), HandleRecordStockTransferCommand(command), HandleGoodsReceivedAtLocationEvent(event), HandleShipmentCompletedEvent(event).
- **StockAdjustmentApplicationService:**
  - **Trách nhiệm:** Xử lý các command liên quan đến StockAdjustment từ API (ví dụ: RecordStockAdjustmentCommand). Sử dụng StockAdjustmentService và StockAdjustment Repository. Thực hiện ủy quyền với IAM.
  - **Các phương thức tiềm năng:** HandleRecordStockAdjustmentCommand(command).
- **StockLocationApplicationService:**
  - **Trách nhiệm:** Xử lý các command liên quan đến quản lý StockLocation từ API (ví dụ: CreateStockLocationCommand). Sử dụng StockLocationService và StockLocation Repository. Thực hiện ủy quyền với IAM.
  - **Các phương thức tiềm năng:** HandleCreateStockLocationCommand(command).
- **InventoryQueryApplicationService:**
  - **Trách nhiệm:** Xử lý các query để lấy thông tin tồn kho (ví dụ: CheckInventoryAvailabilityQuery, GetInventoryItemDetailsQuery, SearchInventoryItemsQuery). Sử dụng InventoryQueryService hoặc các Domain Service khác. Thực hiện ủy quyền với IAM.
  - **Các phương thức tiềm năng:** HandleCheckInventoryAvailabilityQuery(query), HandleGetInventoryItemDetailsQuery(query), HandleSearchInventoryItemsQuery(query).

## **10\. Domain Events**

Bounded Context ICM tương tác với các Bounded Context khác thông qua việc phát ra và lắng nghe các Domain Event. Dưới đây là danh sách các event mà ICM phát ra và lắng nghe, bao gồm payload dự kiến của chúng:

### **10.1. Domain Events (ICM Phát ra)**

ICM sẽ phát ra các Domain Event quan trọng để thông báo cho các Bounded Context khác về những thay đổi trạng thái nghiệp vụ trong phạm vi của nó. Dưới đây là danh sách các event và payload dự kiến của chúng:

- **InventoryLevelUpdated**
  - Phát ra khi số lượng tồn kho của một SKU tại một vị trí/trạng thái cụ thể thay đổi.
  - **Payload:**
    - TenantId (UUID)
    - InventoryItemId (UUID)
    - SKU (String)
    - StockLocationId (UUID)
    - StockStatus (String)
    - OldQuantity (Decimal)
    - NewQuantity (Decimal)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **InventoryReserved**
  - Phát ra khi tồn kho được đặt chỗ cho một đơn hàng/yêu cầu.
  - **Payload:**
    - TenantId (UUID)
    - InventoryItemId (UUID)
    - SKU (String)
    - StockLocationId (UUID)
    - Quantity (Decimal)
    - ReferenceId (UUID \- Order ID hoặc ID khác)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **InventoryReservationFailed**
  - Phát ra khi không đủ tồn kho để đặt chỗ.
  - **Payload:**
    - TenantId (UUID)
    - SKU (String)
    - RequiredQuantity (Decimal)
    - AvailableQuantity (Decimal)
    - ReferenceId (UUID \- Order ID hoặc ID khác)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **InventoryUnreserved**
  - Phát ra khi tồn kho được hủy đặt chỗ.
  - **Payload:**
    - TenantId (UUID)
    - InventoryItemId (UUID)
    - SKU (String)
    - StockLocationId (UUID)
    - Quantity (Decimal)
    - ReferenceId (UUID \- Order ID hoặc ID khác)
    - Reason (String \- ví dụ: "Order Cancelled", "Return Processed")
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **StockMovementCompleted**
  - Phát ra khi một giao dịch nhập, xuất hoặc chuyển kho hoàn thành.
  - **Payload:**
    - MovementId (UUID)
    - TenantId (UUID)
    - MovementType (String)
    - TransactionDate (DateTime) **(ở múi giờ UTC)**
    - PostingDate (DateTime) **(ở múi giờ UTC)**
    - SourceLocationId (UUID, optional)
    - DestinationLocationId (UUID, optional)
    - SourceBoundedContext (String)
    - SourceTransactionId (UUID, optional)
    - Items (List of Object \- {InventoryItemId, SKU, Quantity, SourceStockStatus, DestinationStockStatus})
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **StockAdjustmentRecorded**
  - Phát ra khi một giao dịch điều chỉnh tồn kho được ghi nhận.
  - **Payload:**
    - AdjustmentId (UUID)
    - TenantId (UUID)
    - AdjustmentDate (DateTime) **(ở múi giờ UTC)**
    - PostingDate (DateTime) **(ở múi giờ UTC)**
    - StockLocationId (UUID)
    - Reason (String)
    - AdjustedByUserId (UUID)
    - Items (List of Object \- {InventoryItemId, SKU, StockStatus, OldQuantity, NewQuantity, Difference})
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **InventoryItemCreated**
  - Phát ra khi một InventoryItem mới được tạo (cho một SKU mới).
  - **Payload:**
    - InventoryItemId (UUID)
    - TenantId (UUID)
    - ProductId (UUID)
    - VariantId (UUID, optional)
    - SKU (String)
    - CreatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **StockLocationCreated**
  - Phát ra khi một vị trí lưu trữ mới được tạo.
  - **Payload:**
    - LocationId (UUID)
    - TenantId (UUID)
    - Name (String)
    - Type (String)
    - CreatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ReorderPointReached**
  - Phát ra khi số lượng tồn kho của một SKU đạt đến hoặc dưới ngưỡng đặt hàng lại.
  - **Payload:**
    - TenantId (UUID)
    - InventoryItemId (UUID)
    - SKU (String)
    - CurrentTotalQuantity (Decimal)
    - ReorderPoint (Decimal)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**

### **10.2. Domain Events Được Xử lý (Consumed Domain Events)**

ICM lắng nghe và xử lý các Domain Event từ các Bounded Context khác khi các sự kiện đó yêu cầu thay đổi hoặc cập nhật thông tin tồn kho. Dưới đây là danh sách các event dự kiến mà ICM lắng nghe và mục đích xử lý của chúng:

- **ProductVariantCreated** (Từ PIM)
  - **Mục đích xử lý:** Tự động tạo một InventoryItem mới cho SKU/biến thể sản phẩm mới được tạo.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - ProductId (UUID)
    - VariantId (UUID)
    - SKU (String)
    - TenantId (UUID, nếu PIM quản lý theo Tenant)
    - CreatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **OrderConfirmedEvent** (Từ ODM)
  - **Mục đích xử lý:** Đặt chỗ tồn kho cho các mặt hàng trong đơn hàng đã xác nhận.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - OrderId (UUID)
    - TenantId (UUID)
    - ConfirmationDate (DateTime) **(ở múi giờ UTC)**
    - Items (List of Object \- {SKU, Quantity})
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **OrderCancelledEvent** (Từ ODM)
  - **Mục đích xử lý:** Hủy đặt chỗ tồn kho cho các mặt hàng trong đơn hàng bị hủy.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - OrderId (UUID)
    - TenantId (UUID)
    - CancellationDate (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ShipmentReadyForIssueEvent** (Từ SFM) \- _Hoặc một Event tương tự khi đơn hàng sẵn sàng xuất kho_
  - **Mục đích xử lý:** Ghi nhận xuất kho hàng đã đặt chỗ, chuyển trạng thái tồn kho (ví dụ: từ Reserved sang In Transit).
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - ShipmentId (UUID)
    - OrderId (UUID)
    - TenantId (UUID)
    - ReadyDate (DateTime) **(ở múi giờ UTC)**
    - Items (List of Object \- {SKU, Quantity, StockLocationId})
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ShipmentCompletedEvent** (Từ SFM) \- _Khi đơn hàng đã giao thành công_
  - **Mục đích xử lý:** Cập nhật trạng thái tồn kho cuối cùng sau khi hàng đã rời kho (ví dụ: từ In Transit sang Deducted).
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - ShipmentId (UUID)
    - TenantId (UUID)
    - CompletionDate (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ReturnProcessedEvent** (Từ OSM/ODM)
  - **Mục đích xử lý:** Ghi nhận nhập kho hàng trả lại (tăng số lượng tồn kho với trạng thái phù hợp, ví dụ: Returned, Defective). Hủy đặt chỗ nếu có.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - ReturnId (UUID)
    - TenantId (UUID)
    - ProcessDate (DateTime) **(ở múi giờ UTC)**
    - Items (List of Object \- {SKU, Quantity, StockLocationId, Condition \- để xác định trạng thái tồn kho})
    - RelatedOrderId (UUID, optional)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **GoodsReceivedAtLocationEvent** (Từ Procurement/Purchasing BC)
  - **Mục đích xử lý:** Ghi nhận nhập kho hàng mua từ nhà cung cấp.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - ReceiptId (UUID)
    - TenantId (UUID)
    - ReceiptDate (DateTime) **(ở múi giờ UTC)**
    - StockLocationId (UUID)
    - Items (List of Object \- {SKU, Quantity})
    - PurchaseOrderId (UUID, optional)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **TenantDataDeletionRequestedEvent** (Từ BUM)
  - **Mục đích xử lý:** Xóa tất cả dữ liệu tồn kho liên quan đến Tenant đã yêu cầu xóa dữ liệu.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - TenantId (UUID)
    - RequestedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**

_(Lưu ý: Danh sách các sự kiện được xử lý có thể được mở rộng tùy thuộc vào các quy trình nghiệp vụ cụ thể trong hệ thống Ecoma có ảnh hưởng đến tồn kho.)_

## **11\. Ranh giới Nghiệp vụ**

Ranh giới của Bounded Context ICM được xác định bởi trách nhiệm quản lý số lượng, trạng thái và vị trí của hàng hóa tồn kho. ICM là nguồn sự thật về "bao nhiêu hàng hóa nào đang ở đâu và trong trạng thái nào" trong mạng lưới kho hàng của tổ chức khách hàng.

ICM không chịu trách nhiệm:

- **Xác thực danh tính người dùng:** Chỉ sử dụng dịch vụ của IAM.
- **Quản lý quyền truy cập:** Chỉ sử dụng dịch vụ của IAM. IAM kiểm soát quyền của người dùng (nhân viên kho, quản lý tồn kho) trong ICM.
- **Quản lý bản dịch văn bản hoặc quy tắc định dạng locale:** Chỉ sử dụng dịch vụ của LZM và RDM.
- **Ghi nhận audit logs:** Chỉ phát sự kiện cho ALM.
- **Quản lý thông tin chi tiết sản phẩm:** Chỉ sử dụng SKU và ID từ PIM. PIM là nguồn sự thật về tên, mô tả, thuộc tính sản phẩm.
- **Quản lý quy trình mua hàng:** Chỉ nhận thông báo khi hàng đã về kho.
- **Quản lý quy trình vận chuyển và giao hàng:** Chỉ thông báo khi hàng đã xuất kho và nhận thông báo khi hàng đã giao/trả về.
- **Xử lý đơn hàng và giao dịch bán hàng:** Chỉ nhận yêu cầu kiểm tra khả dụng, đặt chỗ và trừ tồn kho từ OSM/ODM.
- **Tính toán giá vốn hàng bán:** Chỉ cung cấp số lượng xuất kho cho FAM.
- **Quản lý tài sản cố định:** Chỉ quản lý hàng hóa để bán.
- **Quản lý các miền nghiệp vụ khác** như khách hàng, nhân sự, tài chính (trừ dữ liệu đầu vào cho FAM), đào tạo, quản lý công việc, marketing.

## **12\. Kết luận**

Bounded Context Inventory Control Management (ICM) là một thành phần cốt lõi quan trọng trong hệ thống Ecoma, đảm bảo tính chính xác và hiệu quả của quy trình quản lý tồn kho. Bằng cách tập trung trách nhiệm theo dõi số lượng, trạng thái và vị trí tồn kho, xử lý các giao dịch nhập/xuất/chuyển/điều chỉnh, và cung cấp thông tin tồn kho khả dụng vào một Context duy nhất, ICM hỗ trợ đắc lực cho các hoạt động bán hàng và hoàn tất đơn hàng. Việc thiết kế ICM với mô hình domain rõ ràng, các khía cạnh quan trọng của miền được làm rõ, tương tác được định nghĩa và các sự kiện nghiệp vụ phù hợp (bao gồm cả sự kiện lắng nghe) là nền tảng để xây dựng một hệ thống quản lý tồn kho mạnh mẽ và dễ mở rộng.

Tài liệu này cung cấp cái nhìn tổng quan chi tiết về ICM, bao gồm mô hình domain, các khía cạnh quan trọng của miền, tương tác, use cases, Domain Service, Application Service và Domain Event (phát ra và lắng nghe với payload dự kiến). Đây là nền tảng để chuyển sang giai đoạn thiết kế kỹ thuật chi tiết và triển khai Microservice ICM.
