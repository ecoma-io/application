# **Bounded Context Shipping & Fulfillment Management (SFM)**

## **1\. Giới thiệu**

Tài liệu này cung cấp mô tả chi tiết về Bounded Context **Shipping & Fulfillment Management (SFM)** trong hệ thống Ecoma. SFM là một trong những Bounded Context thuộc nhóm Value Stream, đóng vai trò quản lý toàn bộ quy trình xử lý đơn hàng vật lý (fulfillment) từ khi hàng được lấy từ kho, đóng gói, vận chuyển cho đến khi giao thành công cho khách hàng.

SFM đảm bảo rằng các đơn hàng được xử lý và vận chuyển một cách hiệu quả, theo dõi chính xác trạng thái của từng lô hàng, tích hợp với các đơn vị vận chuyển bên ngoài và phối hợp chặt chẽ với các Bounded Context khác như ODM (nhận yêu cầu hoàn tất), ICM (lấy hàng từ tồn kho đã đặt chỗ), PPM (xử lý chi phí vận chuyển), và NDM (gửi thông báo vận chuyển).

## **2\. Phạm vi của Tài liệu**

Tài liệu này tập trung vào việc định nghĩa và mô tả Bounded Context SFM ở cấp độ thiết kế miền (domain design), cung cấp đủ chi tiết để hỗ trợ việc thiết kế các Domain Service và Application Service. Cụ thể, tài liệu này bao gồm:

- Xác định vai trò và trách nhiệm chính của SFM, tập trung vào quản lý quy trình hoàn tất và vận chuyển.
- Mô tả các khái niệm và thực thể cốt lõi trong mô hình domain của SFM ở cấp độ chi tiết hơn, bao gồm các Aggregate Root, Entity và Value Object với các thuộc tính chính, có tính đến lô hàng, các bước xử lý và thông tin vận chuyển.
- Định nghĩa Ngôn ngữ Chung (Ubiquitous Language) trong phạm vi SFM.
- Mô tả **Các Khía cạnh Quan trọng của Miền SFM**, làm rõ các quy tắc và cấu trúc nghiệp vụ chi phối hoạt động của Context này, bao gồm vòng đời lô hàng, tích hợp đơn vị vận chuyển và theo dõi trạng thái.
- Làm rõ các tương tác chính giữa SFM và các Bounded Context khác là nguồn yêu cầu hoàn tất hoặc tham gia vào quy trình vận chuyển.
- Phác thảo các **Use cases** chính có sự tham gia của SFM, tập trung vào actor, mục đích và các Domain/Application Service liên quan.
- Xác định ranh giới nghiệp vụ của SFM, nhấn mạnh những gì SFM không chịu trách nhiệm.
- Đề xuất các Domain Service và Application Service tiềm năng trong SFM, mô tả trách nhiệm chính của từng service.
- Xác định và mô tả các **Domain Events** mà SFM tương tác, được chia thành các sự kiện SFM **phát ra** (Published Events) và các sự kiện SFM **lắng nghe và xử lý** (Consumed Events), bao gồm payload dự kiến của từng event.

Tài liệu này **không** đi sâu vào các chi tiết kỹ thuật triển khai cụ thể hoặc mô tả chi tiết các bước thực hiện (how) của từng luồng nghiệp vụ **bên trong các service**. Các khía cạnh sau **không** nằm trong phạm vi của tài liệu này:

- Chi tiết cài đặt kỹ thuật của Microservice SFM.
- Cấu trúc cơ sở dữ liệu chi tiết (schema) của SFM.
- Các quyết định công nghệ cụ thể bên trong SFM (ví dụ: cách tích hợp với từng API của đơn vị vận chuyển cụ thể).
- Luồng dữ liệu chi tiết đến cấp độ từng trường thông tin giữa SFM và các BC khác.
- Cấu hình hạ tầng triển khai cụ thể cho Microservice SFM.
- Thiết kế giao diện người dùng để quản lý vận chuyển hoặc theo dõi lô hàng.
- Xử lý đơn đặt hàng (thuộc ODM). SFM chỉ nhận yêu cầu hoàn tất đơn hàng.
- Quản lý tồn kho chi tiết và logic lấy hàng từ kho (thuộc ICM). SFM chỉ yêu cầu ICM xác nhận xuất kho và nhận thông tin tồn kho đã đặt chỗ.
- Xử lý thanh toán chi phí vận chuyển thực tế với đơn vị vận chuyển (thuộc PPM). SFM chỉ yêu cầu PPM xử lý thanh toán và nhận kết quả.
- Quản lý thông tin sản phẩm chi tiết (thuộc PIM). SFM chỉ sử dụng SKU và ID sản phẩm/biến thể.
- Quản lý dữ liệu khách hàng chi tiết (thuộc CRM). SFM chỉ sử dụng Customer ID và địa chỉ giao hàng (được cung cấp bởi ODM).
- Quản lý tài chính và kế toán (thuộc FAM). SFM chỉ phát sự kiện chứa dữ liệu chi phí vận chuyển cho FAM ghi nhận.
- Quản lý các miền nghiệp vụ khác như nhân sự, đào tạo, quản lý công việc, marketing.

## **3\. Vai trò và Trách nhiệm Chính**

Bounded Context SFM chịu trách nhiệm quản lý quy trình vận chuyển và hoàn tất đơn hàng. Các trách nhiệm chính bao gồm:

- **Tiếp nhận Yêu cầu Hoàn tất Đơn hàng:** Nhận yêu cầu tạo lô hàng từ ODM.
- **Tạo Lô hàng (Shipment):** Tạo một lô hàng mới dựa trên các mặt hàng được yêu cầu hoàn tất, xác định thông tin vận chuyển ban đầu.
- **Quản lý Vòng đời Lô hàng:** Theo dõi và cập nhật trạng thái của lô hàng qua các giai đoạn (ví dụ: Pending, Ready For Pickup, In Transit, Delivered, Failed, Returned).
- **Phối hợp Lấy hàng từ Kho:** Thông báo cho ICM khi lô hàng đã sẵn sàng để lấy hàng và xác nhận với ICM khi hàng đã được xuất kho vật lý.
- **Tích hợp Đơn vị Vận chuyển:** Tương tác với các hệ thống của đơn vị vận chuyển bên ngoài để tạo vận đơn, lấy mã vận đơn (tracking number), gửi thông tin lô hàng và nhận cập nhật trạng thái vận chuyển.
- **Theo dõi Trạng thái Vận chuyển:** Nhận và xử lý các cập nhật trạng thái từ đơn vị vận chuyển bên ngoài.
- **Xử lý Giao hàng Không thành công:** Quản lý các trường hợp giao hàng không thành công và các hành động tiếp theo (ví dụ: thử giao lại, trả hàng về).
- **Xử lý Trả hàng về:** Quản lý quy trình khi hàng được trả về kho từ khách hàng hoặc từ đơn vị vận chuyển.
- **Tính toán Chi phí Vận chuyển (Ước tính/Thực tế):** Tính toán chi phí vận chuyển cho lô hàng (có thể là ước tính ban đầu và chi phí thực tế sau khi hoàn tất).
- **Yêu cầu Thanh toán Chi phí Vận chuyển:** Yêu cầu PPM xử lý thanh toán chi phí vận chuyển cho đơn vị vận chuyển.
- **Cung cấp Thông tin Vận chuyển:** Cung cấp thông tin chi tiết về lô hàng, trạng thái và mã vận đơn cho ODM và các hệ thống khác (ví dụ: CRM, NDM).
- **Phát Sự kiện Nghiệp vụ:** Phát ra các Sự kiện Nghiệp vụ quan trọng khi trạng thái lô hàng thay đổi hoặc các sự kiện quan trọng khác xảy ra trong quy trình vận chuyển.

## **4\. Mô hình Domain (Chi tiết hơn)**

Trong phạm vi Bounded Context SFM, chúng ta xác định các Aggregate Root, Entity và Value Object cốt lõi với các thuộc tính chính:

**Aggregate Roots:**

- **Shipment:** Là Aggregate Root trung tâm, đại diện cho một lô hàng vật lý được vận chuyển. Shipment quản lý tất cả thông tin liên quan đến lô hàng, bao gồm các mặt hàng, trạng thái, thông tin vận chuyển và lịch sử cập nhật trạng thái.
  - **ID:** Unique identifier (UUID).
  - **TenantId:** ID của tổ chức sở hữu lô hàng (liên kết với IAM).
  - **RelatedOrderId:** ID của đơn hàng liên quan trong ODM.
  - **ShippingAddress:** Địa chỉ giao hàng (Address Value Object \- sao chép từ ODM).
  - **BillingAddress:** Địa chỉ thanh toán (Address Value Object \- sao chép từ ODM).
  - **RecipientName:** Tên người nhận.
  - **RecipientPhone:** Số điện thoại người nhận.
  - **Status:** Trạng thái lô hàng (ShipmentStatus Value Object: Pending, Ready For Pickup, Picked Up, In Transit, Out For Delivery, Delivered, Failed Attempt, Exception, Returned, Cancelled).
  - **Items:** Danh sách các ShipmentItem Entities.
  - **ShippingCarrierId:** ID của đơn vị vận chuyển (liên kết với ShippingCarrier Aggregate).
  - **TrackingNumber:** Mã vận đơn từ đơn vị vận chuyển.
  - **EstimatedDeliveryDate:** Ngày giao hàng dự kiến. **Lưu trữ ở múi giờ UTC.**
  - **ActualDeliveryDate:** **Optional** Ngày giao hàng thực tế. **Lưu trữ ở múi giờ UTC.**
  - **ShippingCost:** Chi phí vận chuyển (Money Value Object \- ước tính hoặc thực tế).
  - **PaymentTransactionId:** **Optional** ID giao dịch thanh toán chi phí vận chuyển trong PPM.
  - **ShippingLabels:** Danh sách các ShippingLabel Entities.
  - **StatusHistory:** Danh sách các ShipmentStatusUpdate Entities.
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ AddItem, RemoveItem, UpdateStatus, AssignCarrier, SetTrackingNumber, UpdateShippingCost, RecordStatusUpdate, RequestPickup.
- **ShippingCarrier:** Là Aggregate Root định nghĩa thông tin về một đơn vị vận chuyển bên ngoài được tích hợp.
  - **ID:** Unique identifier (UUID).
  - **TenantId:** ID của tổ chức sử dụng đơn vị vận chuyển này.
  - **Name:** Tên đơn vị vận chuyển (ví dụ: "VNPost", "GiaoHangNhanh", "FedEx").
  - **IntegrationDetails:** Chi tiết cấu hình tích hợp (API Key, Endpoint, v.v. \- có thể là Value Object phức tạp).
  - **SupportedServices:** Danh sách các loại dịch vụ vận chuyển được hỗ trợ (ví dụ: "Standard", "Express").
  - **IsActive:** Trạng thái hoạt động.
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ Activate, Deactivate, UpdateIntegrationDetails.

**Entities (thuộc về các Aggregate Root):**

- **ShipmentItem (thuộc Shipment):** Đại diện cho một mặt hàng cụ thể trong lô hàng.
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root Shipment.
  - **OrderItemId:** ID của OrderItem liên quan trong ODM.
  - **SKU:** Mã SKU (liên kết với PIM).
  - **Quantity:** Số lượng của mặt hàng này trong lô hàng.
  - **StockLocationId:** ID của vị trí kho nơi hàng được lấy (liên kết với ICM).
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
- **ShippingLabel (thuộc Shipment):** Đại diện cho một nhãn vận chuyển được tạo ra.
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root Shipment.
  - **LabelType:** Loại nhãn (LabelType Value Object: Shipping, Return).
  - **FileAssetId:** ID tham chiếu đến file nhãn trong DAM.
  - **GeneratedAt:** Thời điểm tạo nhãn. **Lưu trữ ở múi giờ UTC.**
  - **CarrierLabelId:** ID nhãn trong hệ thống của đơn vị vận chuyển.
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
- **ShipmentStatusUpdate (thuộc Shipment):** Đại diện cho một lần cập nhật trạng thái của lô hàng.
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root Shipment.
  - **Status:** Trạng thái mới (ShipmentStatus Value Object).
  - **UpdateDate:** Thời điểm cập nhật. **Lưu trữ ở múi giờ UTC.**
  - **Location:** Vị trí cập nhật (tùy chọn).
  - **Description:** Mô tả chi tiết cập nhật (từ đơn vị vận chuyển hoặc nội bộ).
  - **IsCustomerVisible:** Boolean chỉ định có hiển thị cho khách hàng không.
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**

**Value Objects:**

- **ShipmentStatus:** Trạng thái lô hàng (Pending, Ready For Pickup, Picked Up, In Transit, Out For Delivery, Delivered, Failed Attempt, Exception, Returned, Cancelled).
- **LocationType:** Loại vị trí (Warehouse, Store).
- **Address:** Địa chỉ (Street, City, State/Province, PostalCode, Country) \- có thể dùng chung.
- **Money:** Giá trị tiền tệ (Amount, Currency).
- **LabelType:** Loại nhãn vận chuyển (Shipping, Return).
- **LocalizedText:** Giá trị văn bản đa ngôn ngữ (sử dụng Translation Key).
- **ShippingServiceType:** Loại dịch vụ vận chuyển (Standard, Express, COD).

## **5\. Ngôn ngữ Chung (Ubiquitous Language)**

Trong Bounded Context SFM, các thuật ngữ sau đây có ý nghĩa cụ thể và nhất quán:

- **Shipment:** Một lô hàng vật lý chứa các mặt hàng được vận chuyển.
- **Fulfillment:** Quy trình xử lý đơn hàng vật lý từ kho đến tay khách hàng.
- **Shipping Carrier:** Đơn vị cung cấp dịch vụ vận chuyển (ví dụ: VNPost, FedEx).
- **Tracking Number:** Mã vận đơn để theo dõi Shipment.
- **Shipping Label:** Nhãn dán trên gói hàng chứa thông tin vận chuyển.
- **Pickup:** Hành động đơn vị vận chuyển đến lấy hàng từ kho.
- **In Transit:** Trạng thái lô hàng đang trên đường vận chuyển.
- **Delivered:** Trạng thái lô hàng đã được giao thành công.
- **Failed Attempt:** Trạng thái giao hàng không thành công lần đầu.
- **Exception:** Trạng thái lô hàng gặp vấn đề trong quá trình vận chuyển.
- **Return Shipment:** Lô hàng được gửi trả lại.
- **Shipping Cost:** Chi phí vận chuyển.
- **Fulfillment Request:** Yêu cầu từ ODM để bắt đầu xử lý một phần hoặc toàn bộ đơn hàng.
- **Packing List:** Danh sách các mặt hàng trong một gói hàng.

## **6\. Các Khía cạnh Quan trọng của Miền SFM**

Phần này mô tả các cấu trúc, quy tắc và khái niệm nghiệp vụ quan trọng chi phối hoạt động của Bounded Context SFM.

### **6.1. Vòng đời Lô hàng (Shipment Lifecycle)**

SFM quản lý vòng đời của Shipment, với các trạng thái chuyển đổi phản ánh tiến trình vật lý của gói hàng:

stateDiagram-v2  
 \[\*\] \--\> Pending: Created from Fulfillment Request  
 Pending \--\> ReadyForPickup: Items picked and packed  
 ReadyForPickup \--\> PickedUp: Carrier picked up  
 PickedUp \--\> InTransit: In transit to destination  
 InTransit \--\> OutForDelivery: Out for delivery  
 OutForDelivery \--\> Delivered: Successfully delivered  
 OutForDelivery \--\> FailedAttempt: Delivery attempt failed  
 FailedAttempt \--\> OutForDelivery: Another attempt  
 FailedAttempt \--\> Returned: Returned to sender  
 InTransit \--\> Exception: Issue during transit  
 Exception \--\> InTransit: Issue resolved  
 Exception \--\> Returned: Returned due to exception  
 Returned \--\> \[\*\]  
 Delivered \--\> \[\*\]  
 Pending \--\> Cancelled: Fulfillment cancelled  
 ReadyForPickup \--\> Cancelled: Fulfillment cancelled  
 Cancelled \--\> \[\*\]

Việc chuyển đổi trạng thái được kích hoạt bởi các hành động nội bộ (ví dụ: đánh dấu đã đóng gói) hoặc các cập nhật từ đơn vị vận chuyển bên ngoài.

### **6.2. Tích hợp với Đơn vị Vận chuyển Bên ngoài**

SFM là điểm tích hợp chính với các đơn vị vận chuyển bên ngoài. SFM cần có khả năng:

- Gửi yêu cầu tạo vận đơn (shipping label) và nhận lại mã vận đơn.
- Gửi thông tin lô hàng chi tiết.
- Nhận cập nhật trạng thái vận chuyển (thường qua webhook hoặc polling).
- **ShippingCarrier Aggregate** quản lý thông tin cấu hình tích hợp cho từng đơn vị vận chuyển.

### **6.3. Theo dõi Trạng thái Vận chuyển và Lịch sử**

SFM lưu trữ trạng thái hiện tại của mỗi Shipment và lịch sử các lần cập nhật trạng thái (ShipmentStatusUpdate). Thông tin này được sử dụng để hiển thị cho khách hàng (qua NDM/CRM) và cho mục đích theo dõi nội bộ.

### **6.4. Phối hợp với ICM cho Lấy hàng và Xuất kho**

SFM phối hợp với ICM trong giai đoạn chuẩn bị hàng. Sau khi nhận yêu cầu hoàn tất từ ODM và tạo Shipment, SFM thông báo cho ICM rằng hàng đã sẵn sàng để lấy từ kho (ví dụ: phát Event ShipmentReadyForPickup). Khi nhân viên kho thực tế lấy hàng và đóng gói, SFM cần xác nhận việc xuất kho vật lý với ICM (ví dụ: gửi Command ConfirmInventoryIssuedCommand) để ICM cập nhật trạng thái tồn kho từ Reserved sang Deducted/Shipped.

### **6.5. Xử lý Chi phí Vận chuyển**

SFM tính toán chi phí vận chuyển cho mỗi lô hàng. Chi phí này có thể là ước tính ban đầu (dựa trên trọng lượng, kích thước, địa chỉ, dịch vụ) và chi phí thực tế được xác nhận sau khi lô hàng hoàn tất. SFM yêu cầu PPM xử lý thanh toán chi phí này cho đơn vị vận chuyển.

### **6.6. Quản lý Nhãn Vận chuyển (Shipping Labels)**

SFM tạo và quản lý các nhãn vận chuyển (thường dưới dạng file PDF) được trả về từ đơn vị vận chuyển. Các nhãn này được lưu trữ trong DAM và SFM lưu ID tham chiếu.

### **6.7. Xử lý Trả hàng về (Return Shipments)**

SFM quản lý quy trình khi lô hàng được trả về cho người gửi (do giao hàng không thành công hoặc khách hàng trả lại). SFM ghi nhận lô hàng trả về và thông báo cho ICM để nhập kho hàng trả lại.

## **7\. Tương tác với các Bounded Context khác**

SFM tương tác với các Bounded Context khác để nhận yêu cầu, phối hợp các bước xử lý và thông báo trạng thái.

- **Tương tác với Core BCs:**
  - **IAM:** SFM cần IAM (Request/Reply) để xác thực và ủy quyền cho người dùng quản lý vận chuyển. SFM lấy thông tin Tenant ID từ ngữ cảnh phiên làm việc.
  - **LZM & RDM:** SFM cần LZM (Request/Reply) để quản lý và hiển thị metadata đa ngôn ngữ (tên trạng thái vận chuyển, tên đơn vị vận chuyển, loại dịch vụ). SFM cần RDM (Request/Reply) để lấy dữ liệu tham chiếu (ví dụ: danh sách quốc gia, loại dịch vụ vận chuyển, trạng thái vận chuyển nếu không quản lý nội bộ).
  - **ALM:** SFM phát ra các sự kiện audit log (Event) khi có các hành động quan trọng liên quan đến quản lý vận chuyển (ví dụ: tạo lô hàng, cập nhật trạng thái, tạo nhãn, yêu cầu thanh toán chi phí vận chuyển).
  - **NDM:** SFM yêu cầu NDM gửi thông báo cho khách hàng về trạng thái vận chuyển (ví dụ: lô hàng đã gửi, đang trên đường, đã giao thành công). Yêu cầu này bao gồm thông tin Customer ID (từ CRM, được lấy qua ODM), thông tin Shipment (tracking number, carrier) và trạng thái để NDM xử lý.
- **Tương tác với Feature BCs:**
  - **ODM:** ODM là nguồn chính gửi yêu cầu tạo Shipment (FulfillmentProcessingRequestedEvent hoặc CreateShipmentCommand). ODM gọi SFM (Request/Reply Query) để lấy thông tin trạng thái vận chuyển hiển thị cho khách hàng. SFM phát Event (ShipmentCreated, ShipmentStatusUpdated, ShipmentCompletedEvent, ShipmentFailedEvent) để ODM lắng nghe và cập nhật trạng thái đơn hàng.
  - **ICM:** SFM gọi ICM (Request/Reply Query) để lấy thông tin tồn kho đã đặt chỗ và vị trí kho (GetReservedInventoryDetailsQuery). SFM gửi Command (ConfirmInventoryIssuedCommand) hoặc phát Event (ShipmentReadyForPickupEvent) để phối hợp lấy hàng và xác nhận xuất kho vật lý. ICM phát Event (InventoryIssued, InventoryLevelUpdated) mà SFM có thể lắng nghe để xác nhận việc trừ tồn kho đã thành công.
  - **PPM:** SFM gửi Command (ProcessPaymentCommand) đến PPM để yêu cầu thanh toán chi phí vận chuyển cho đơn vị vận chuyển. PPM phát Event (PaymentSuccessfulEvent, PaymentFailedEvent) mà SFM lắng nghe để cập nhật trạng thái thanh toán chi phí vận chuyển trong Shipment.
  - **CRM:** SFM gọi CRM (Request/Reply Query) để lấy thông tin khách hàng (tên, số điện thoại) nếu cần xác minh. SFM phát Event (ShipmentCompletedEvent, ShipmentFailedEvent, ReturnProcessedEvent) chứa thông tin Customer ID (từ ODM) để CRM lắng nghe và ghi nhận tương tác hoặc tạo Service Case.
  - **DAM:** SFM gửi yêu cầu lưu trữ file nhãn vận chuyển (UploadAssetCommand) đến DAM và lưu trữ ID tham chiếu. SFM gọi DAM (Request/Reply Query) để lấy URL nhãn khi cần hiển thị hoặc gửi cho khách hàng.
  - **PIM:** SFM gọi PIM (Request/Reply Query) để lấy thông tin sản phẩm/biến thể (tên, trọng lượng, kích thước) dựa trên SKU/ID từ ShipmentItem, cần cho việc tính toán chi phí vận chuyển và tạo vận đơn.

## **8\. Use cases**

Dưới đây là mô tả các use case chính có sự tham gia của SFM, được tổ chức theo các nhóm chức năng chính, tập trung vào actor, mục đích và các Domain/Application Service liên quan.

### **8.1. Use Cases liên quan đến Tạo và Quản lý Lô hàng**

Nhóm này bao gồm việc tiếp nhận yêu cầu và tạo các lô hàng vật lý.

- **Use case: Tạo Lô hàng từ Yêu cầu Hoàn tất Đơn hàng:**
  - **Actor:** Hệ thống (từ ODM).
  - **Mục đích:** Tạo một Shipment mới dựa trên yêu cầu hoàn tất từ ODM, bao gồm các mặt hàng và địa chỉ giao hàng.
  - **Service liên quan:** Được xử lý bởi FulfillmentApplicationService (Event Handler cho FulfillmentProcessingRequestedEvent hoặc Command Handler cho CreateShipmentCommand từ ODM). Sử dụng FulfillmentService để tạo Shipment Aggregate Root, bao gồm cả việc tính toán chi phí vận chuyển ước tính. Sử dụng Shipment Repository. Gọi PIM Service để lấy thông tin sản phẩm cần thiết cho tính toán chi phí/tạo nhãn. Phát sự kiện ShipmentCreated, audit log cho ALM. Phát sự kiện cho ODM.
- **Use case: Cập nhật Thông tin Lô hàng:**
  - **Actor:** Người dùng (nhân viên quản lý vận chuyển).
  - **Mục đích:** Chỉnh sửa thông tin lô hàng (ví dụ: thay đổi đơn vị vận chuyển, cập nhật chi phí vận chuyển thực tế) trước khi gửi đi.
  - **Service liên quan:** Được xử lý bởi ShippingApplicationService (Command Handler cho UpdateShipmentCommand). Sử dụng ShippingService để lấy và cập nhật Shipment Aggregate Root. Sử dụng Shipment Repository. Phát sự kiện ShipmentUpdated, audit log cho ALM.
- **Use case: Hủy Lô hàng:**
  - **Actor:** Người dùng (nhân viên quản lý vận chuyển).
  - **Mục đích:** Hủy bỏ một lô hàng trước khi nó được vận chuyển.
  - **Service liên quan:** Được xử lý bởi ShippingApplicationService (Command Handler cho CancelShipmentCommand). Sử dụng ShippingService để lấy và thay đổi trạng thái Shipment Aggregate Root thành Cancelled. Sử dụng Shipment Repository. Phát sự kiện ShipmentStatusChanged, ShipmentCancelled, audit log cho ALM. Phát sự kiện cho ODM, ICM (yêu cầu hủy đặt chỗ tồn kho nếu cần).

### **8.2. Use Cases liên quan đến Xử lý Vận chuyển**

Nhóm này tập trung vào việc phối hợp với đơn vị vận chuyển và theo dõi trạng thái.

- **Use case: Chuẩn bị Lô hàng và Yêu cầu Lấy hàng:**
  - **Actor:** Người dùng (nhân viên kho/quản lý vận chuyển).
  - **Mục đích:** Đánh dấu lô hàng đã sẵn sàng để đơn vị vận chuyển đến lấy và gửi yêu cầu tạo nhãn/lấy hàng đến đơn vị vận chuyển.
  - **Service liên quan:** Được xử lý bởi ShippingApplicationService (Command Handler cho PrepareShipmentForPickupCommand). Sử dụng ShippingService để lấy Shipment Aggregate Root, thay đổi trạng thái thành Ready For Pickup. ShippingService tương tác với ShippingCarrier Service để gọi API của đơn vị vận chuyển (tạo vận đơn, yêu cầu lấy hàng). Sử dụng Shipment Repository. Phát sự kiện ShipmentStatusChanged, ShipmentReadyForPickup, audit log cho ALM. Phát sự kiện cho ICM (thông báo sẵn sàng lấy hàng). Yêu cầu DAM lưu trữ nhãn vận chuyển.
- **Use case: Ghi nhận Lô hàng Đã Lấy (Picked Up):**
  - **Actor:** Hệ thống (từ đơn vị vận chuyển qua webhook), Người dùng (nhân viên kho/quản lý vận chuyển).
  - **Mục đích:** Cập nhật trạng thái lô hàng khi đơn vị vận chuyển đã nhận hàng.
  - **Service liên quan:** Được xử lý bởi ShippingApplicationService (Event Handler từ đơn vị vận chuyển hoặc Command Handler cho ConfirmShipmentPickedUpCommand). Sử dụng ShippingService để lấy Shipment Aggregate Root và cập nhật trạng thái thành Picked Up. Sử dụng Shipment Repository. Phát sự kiện ShipmentStatusChanged, ShipmentPickedUp, audit log cho ALM. Phát sự kiện cho ICM (xác nhận xuất kho vật lý), ODM.
- **Use case: Cập nhật Trạng thái Vận chuyển từ Đơn vị Vận chuyển:**
  - **Actor:** Hệ thống (từ đơn vị vận chuyển qua webhook hoặc polling).
  - **Mục đích:** Cập nhật trạng thái lô hàng và lịch sử trạng thái dựa trên thông tin từ đơn vị vận chuyển.
  - **Service liên quan:** Được xử lý bởi ShippingApplicationService (Event Handler từ đơn vị vận chuyển hoặc logic polling). Sử dụng ShippingService để lấy Shipment Aggregate Root, thêm ShipmentStatusUpdate Entity và cập nhật trạng thái Shipment. Sử dụng Shipment Repository. Phát sự kiện ShipmentStatusUpdated, audit log cho ALM. Phát sự kiện cho ODM, NDM, CRM.
- **Use case: Ghi nhận Lô hàng Đã Giao Thành công:**
  - **Actor:** Hệ thống (từ đơn vị vận chuyển), Người dùng.
  - **Mục đích:** Cập nhật trạng thái lô hàng khi đã giao thành công cho người nhận.
  - **Service liên quan:** Được xử lý bởi ShippingApplicationService (Event Handler hoặc Command Handler cho ConfirmShipmentDeliveredCommand). Sử dụng ShippingService để lấy Shipment Aggregate Root, cập nhật trạng thái thành Delivered và ghi lại ActualDeliveryDate. Sử dụng Shipment Repository. Phát sự kiện ShipmentStatusChanged, ShipmentCompletedEvent, audit log cho ALM. Phát sự kiện cho ODM, CRM, NDM.
- **Use case: Ghi nhận Giao hàng Không thành công:**
  - **Actor:** Hệ thống (từ đơn vị vận chuyển), Người dùng.
  - **Mục đích:** Cập nhật trạng thái lô hàng khi giao hàng không thành công và ghi nhận lý do.
  - **Service liên quan:** Được xử lý bởi ShippingApplicationService (Event Handler hoặc Command Handler cho RecordDeliveryAttemptFailedCommand). Sử dụng ShippingService để lấy Shipment Aggregate Root, cập nhật trạng thái thành Failed Attempt hoặc Exception, thêm ShipmentStatusUpdate. Sử dụng Shipment Repository. Phát sự kiện ShipmentStatusChanged, ShipmentFailedEvent, audit log cho ALM. Phát sự kiện cho ODM, CRM, NDM.
- **Use case: Xử lý Lô hàng Trả về:**
  - **Actor:** Hệ thống (từ đơn vị vận chuyển), Người dùng.
  - **Mục đích:** Quản lý quy trình khi lô hàng được trả về kho.
  - **Service liên quan:** Được xử lý bởi ShippingApplicationService (Event Handler hoặc Command Handler cho RecordShipmentReturnedCommand). Sử dụng ShippingService để lấy Shipment Aggregate Root, cập nhật trạng thái thành Returned, thêm ShipmentStatusUpdate. Sử dụng Shipment Repository. Phát sự kiện ShipmentStatusChanged, ShipmentReturned, audit log cho ALM. Phát sự kiện cho ICM (yêu cầu nhập kho hàng trả lại), ODM, CRM.

### **8.3. Use Cases liên quan đến Quản lý Đơn vị Vận chuyển**

Nhóm này bao gồm việc thiết lập và quản lý các đơn vị vận chuyển tích hợp.

- **Use case: Thêm Đơn vị Vận chuyển Mới:**
  - **Actor:** Người dùng (quản lý hệ thống/vận chuyển).
  - **Mục đích:** Tích hợp một đơn vị vận chuyển mới vào hệ thống.
  - **Service liên quan:** Được xử lý bởi ShippingCarrierApplicationService (Command Handler cho AddShippingCarrierCommand). Sử dụng ShippingCarrierService để tạo ShippingCarrier Aggregate Root. Sử dụng ShippingCarrier Repository. Phát sự kiện ShippingCarrierAdded, audit log cho ALM.
- **Use case: Cập nhật Cấu hình Đơn vị Vận chuyển:**
  - **Actor:** Người dùng (quản lý hệ thống/vận chuyển).
  - **Mục đích:** Cập nhật thông tin hoặc cấu hình tích hợp của đơn vị vận chuyển.
  - **Service liên quan:** Được xử lý bởi ShippingCarrierApplicationService (Command Handler cho UpdateShippingCarrierCommand). Sử dụng ShippingCarrierService để lấy và cập nhật ShippingCarrier Aggregate Root. Sử dụng ShippingCarrier Repository. Phát sự kiện ShippingCarrierUpdated, audit log cho ALM.

### **8.4. Use Cases liên quan đến Truy vấn Vận chuyển**

Nhóm này cho phép người dùng hoặc các BC khác truy xuất thông tin về lô hàng và vận chuyển.

- **Use case: Xem Chi tiết Lô hàng:**
  - **Actor:** Khách hàng, Người dùng (nhân viên nội bộ).
  - **Mục đích:** Xem tất cả thông tin chi tiết về một lô hàng cụ thể, bao gồm trạng thái hiện tại và lịch sử cập nhật.
  - **Service liên quan:** Được xử lý bởi ShippingQueryApplicationService (Query Handler cho GetShipmentDetailsQuery). Sử dụng ShippingQueryService để lấy Shipment Aggregate Root. Sử dụng Shipment Repository. Gọi ODM Service để lấy thông tin đơn hàng, PIM Service để lấy thông tin sản phẩm, StockLocation Repository để lấy thông tin vị trí kho, DAM Service để lấy URL nhãn, LZM Service để lấy bản dịch.
- **Use case: Theo dõi Lô hàng bằng Mã vận đơn:**
  - **Actor:** Khách hàng, Người dùng.
  - **Mục đích:** Tìm kiếm và xem trạng thái của lô hàng chỉ bằng mã vận đơn.
  - **Service liên quan:** Được xử lý bởi ShippingQueryApplicationService (Query Handler cho TrackShipmentByTrackingNumberQuery). Sử dụng ShippingQueryService để tìm Shipment Aggregate Root bằng Tracking Number. Sử dụng Shipment Repository. Gọi các Service khác tương tự GetShipmentDetailsQuery.
- **Use case: Xem Danh sách Lô hàng theo Đơn hàng:**
  - **Actor:** Người dùng (nhân viên nội bộ).
  - **Mục đích:** Xem tất cả các lô hàng liên quan đến một đơn hàng cụ thể.
  - **Service liên quan:** Được xử lý bởi ShippingQueryApplicationService (Query Handler cho GetShipmentsByOrderQuery). Sử dụng ShippingQueryService để truy vấn Shipment Repository theo RelatedOrderId. Sử dụng Shipment Repository.

## **9\. Domain Services**

Domain Services trong SFM chứa logic nghiệp vụ quan trọng không thuộc về một Aggregate Root cụ thể hoặc cần phối hợp nhiều Aggregate Root.

- **FulfillmentService:**
  - **Trách nhiệm:** Xử lý yêu cầu tạo Shipment từ ODM. Tạo Shipment Aggregate Root và các ShipmentItem Entities con. Tính toán chi phí vận chuyển ước tính. Phối hợp với Shipment Repository, PIM Service (để lấy thông tin sản phẩm cho tính toán chi phí), StockLocation Repository (để lấy thông tin vị trí kho).
  - **Các phương thức tiềm năng:** CreateShipmentFromRequest(tenantId, relatedOrderId, shippingAddress, billingAddress, recipientDetails, items).
- **ShippingService:**
  - **Trách nhiệm:** Quản lý vòng đời của Shipment Aggregate Root (cập nhật trạng thái, gán đơn vị vận chuyển, đặt mã vận đơn, cập nhật chi phí thực tế, xử lý các cập nhật trạng thái từ đơn vị vận chuyển, quản lý lịch sử trạng thái, xử lý hủy lô hàng). Tương tác với ShippingCarrier Service để gọi API bên ngoài. Phối hợp với Shipment Repository, ShippingCarrier Repository, DAM Service (để lưu nhãn), NDM Service (để yêu cầu gửi thông báo), PPM Service (để yêu cầu thanh toán chi phí).
  - **Các phương thức tiềm năng:** UpdateShipmentStatus(shipmentId, tenantId, newStatus, details), AssignCarrierToShipment(shipmentId, tenantId, carrierId), SetTrackingNumber(shipmentId, tenantId, trackingNumber), UpdateActualShippingCost(shipmentId, tenantId, actualCost), RecordCarrierStatusUpdate(shipmentId, tenantId, statusUpdateDetails), CancelShipment(shipmentId, tenantId).
- **ShippingCarrierService:**
  - **Trách nhiệm:** Quản lý vòng đời của ShippingCarrier Aggregate Root. Cung cấp các phương thức để tương tác với API của đơn vị vận chuyển bên ngoài (tạo vận đơn, yêu cầu lấy hàng, lấy cập nhật trạng thái). Phối hợp với ShippingCarrier Repository.
  - **Các phương thức tiềm năng:** AddCarrier(tenantId, details), UpdateCarrier(carrierId, tenantId, updates), GenerateShippingLabel(shipmentId, tenantId, carrierId), RequestCarrierPickup(shipmentId, tenantId, carrierId), GetCarrierStatusUpdates(carrierId, tenantId, trackingNumber).
- **ShippingQueryService (Optional Domain Service):** Nếu logic truy vấn phức tạp (tìm kiếm lô hàng theo nhiều tiêu chí, báo cáo vận chuyển), có thể tách ra.
  - **Trách nhiệm:** Cung cấp các phương thức truy vấn dữ liệu từ Shipment, ShippingCarrier. Phối hợp với Shipment Repository, ShippingCarrier Repository, ODM Service, PIM Service, StockLocation Repository, DAM Service, LZM Service.
  - **Các phương thức tiềm năng:** GetShipmentDetails(shipmentId, tenantId), TrackShipmentByTrackingNumber(tenantId, trackingNumber), GetShipmentsByOrder(orderId, tenantId), SearchShipments(criteria, tenantId).

## **9\. Application Services**

Application Services trong SFM là lớp mỏng điều phối các hành động từ bên ngoài (ví dụ: từ API Gateway, Message Broker) đến Domain Model (Aggregate Roots, Domain Services). Chúng xử lý các tác vụ kỹ thuật như lắng nghe Event, xử lý Query, thực hiện ủy quyền, và gọi Domain Service.

- **FulfillmentApplicationService:**
  - **Trách nhiệm:** Lắng nghe Event yêu cầu hoàn tất từ ODM (FulfillmentProcessingRequestedEvent) hoặc xử lý Command tạo Shipment từ ODM (CreateShipmentCommand). Sử dụng FulfillmentService để tạo Shipment. Sử dụng Shipment Repository. Lắng nghe các event liên quan đến xóa Tenant từ BUM để kích hoạt xóa dữ liệu vận chuyển của Tenant đó.
  - **Các phương thức tiềm năng:** HandleFulfillmentProcessingRequestedEvent(event), HandleCreateShipmentCommand(command), HandleTenantDataDeletionRequestedEvent(event).
- **ShippingApplicationService:**
  - **Trách nhiệm:** Xử lý các command liên quan đến quản lý Shipment từ API (ví dụ: UpdateShipmentCommand, CancelShipmentCommand, PrepareShipmentForPickupCommand, ConfirmShipmentPickedUpCommand, RecordDeliveryAttemptFailedCommand, RecordShipmentReturnedCommand) hoặc lắng nghe Event từ đơn vị vận chuyển bên ngoài. Sử dụng ShippingService và Shipment Repository. Thực hiện ủy quyền với IAM (nếu từ API).
  - **Các phương thức tiềm năng:** HandleUpdateShipmentCommand(command), HandleCancelShipmentCommand(command), HandlePrepareShipmentForPickupCommand(command), HandleConfirmShipmentPickedUpCommand(command), HandleRecordDeliveryAttemptFailedCommand(command), HandleRecordShipmentReturnedCommand(command), HandleCarrierStatusUpdateEvent(event).
- **ShippingCarrierApplicationService:**
  - **Trách nhiệm:** Xử lý các command liên quan đến quản lý ShippingCarrier từ API (ví dụ: AddShippingCarrierCommand, UpdateShippingCarrierCommand). Sử dụng ShippingCarrierService và ShippingCarrier Repository. Thực hiện ủy quyền với IAM.
  - **Các phương thức tiềm năng:** HandleAddShippingCarrierCommand(command), HandleUpdateShippingCarrierCommand(command).
- **ShippingQueryApplicationService:**
  - **Trách nhiệm:** Xử lý các query để lấy thông tin vận chuyển (ví dụ: GetShipmentDetailsQuery, TrackShipmentByTrackingNumberQuery, GetShipmentsByOrderQuery). Sử dụng ShippingQueryService hoặc các Domain Service khác. Thực hiện ủy quyền với IAM.
  - **Các phương thức tiềm năng:** HandleGetShipmentDetailsQuery(query), HandleTrackShipmentByTrackingNumberQuery(query), HandleGetShipmentsByOrderQuery(query).

## **10\. Domain Events**

Bounded Context SFM tương tác với các Bounded Context khác thông qua việc phát ra và lắng nghe các Domain Event. Dưới đây là danh sách các event mà SFM phát ra và lắng nghe, bao gồm payload dự kiến của chúng:

### **10.1. Domain Events (SFM Phát ra)**

SFM sẽ phát ra các Domain Event quan trọng để thông báo cho các Bounded Context khác về những thay đổi trạng thái nghiệp vụ trong phạm vi của nó. Dưới đây là danh sách các event và payload dự kiến của chúng:

- **ShipmentCreated**
  - Phát ra khi một lô hàng mới được tạo.
  - **Payload:**
    - ShipmentId (UUID)
    - TenantId (UUID)
    - RelatedOrderId (UUID)
    - Status (String)
    - CreatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ShipmentUpdated**
  - Phát ra khi thông tin lô hàng được cập nhật (trừ trạng thái).
  - **Payload:**
    - ShipmentId (UUID)
    - TenantId (UUID)
    - UpdatedFields (Object \- ví dụ: { "shippingCarrierId": "...", "shippingCost": {...} })
    - UpdatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ShipmentStatusChanged**
  - Phát ra khi trạng thái lô hàng thay đổi.
  - **Payload:**
    - ShipmentId (UUID)
    - TenantId (UUID)
    - RelatedOrderId (UUID)
    - OldStatus (String)
    - NewStatus (String)
    - UpdatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ShipmentReadyForPickup**
  - Phát ra khi lô hàng đã sẵn sàng để đơn vị vận chuyển đến lấy.
  - **Payload:**
    - ShipmentId (UUID)
    - TenantId (UUID)
    - RelatedOrderId (UUID)
    - StockLocationId (UUID) \- Vị trí lấy hàng
    - Items (List of Object \- {SKU, Quantity})
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ShipmentPickedUp**
  - Phát ra khi đơn vị vận chuyển đã lấy hàng.
  - **Payload:**
    - ShipmentId (UUID)
    - TenantId (UUID)
    - RelatedOrderId (UUID)
    - CarrierId (UUID)
    - TrackingNumber (String)
    - PickedUpAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ShipmentStatusUpdatedFromCarrier**
  - Phát ra khi SFM nhận được cập nhật trạng thái từ đơn vị vận chuyển bên ngoài.
  - **Payload:**
    - ShipmentId (UUID)
    - TenantId (UUID)
    - TrackingNumber (String)
    - NewStatus (String)
    - UpdateDate (DateTime) **(ở múi giờ UTC)**
    - Location (String, optional)
    - Description (String, optional)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ShipmentCompletedEvent**
  - Phát ra khi lô hàng được đánh dấu là đã giao thành công (Delivered).
  - **Payload:**
    - ShipmentId (UUID)
    - TenantId (UUID)
    - RelatedOrderId (UUID)
    - ActualDeliveryDate (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ShipmentFailedEvent**
  - Phát ra khi lô hàng gặp vấn đề hoặc giao hàng không thành công cuối cùng.
  - **Payload:**
    - ShipmentId (UUID)
    - TenantId (UUID)
    - RelatedOrderId (UUID)
    - Status (String \- Failed Attempt, Exception, Returned)
    - FailureReason (String, optional)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ShipmentReturned**
  - Phát ra khi lô hàng được trả về cho người gửi.
  - **Payload:**
    - ShipmentId (UUID)
    - TenantId (UUID)
    - RelatedOrderId (UUID)
    - ReturnDate (DateTime) **(ở múi giờ UTC)**
    - Reason (String, optional)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ShippingCostRecorded**
  - Phát ra khi chi phí vận chuyển thực tế được ghi nhận.
  - **Payload:**
    - ShipmentId (UUID)
    - TenantId (UUID)
    - ShippingCost (Money Value Object)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ShippingCarrierAdded**
  - Phát ra khi một đơn vị vận chuyển mới được tích hợp.
  - **Payload:**
    - CarrierId (UUID)
    - TenantId (UUID)
    - Name (String)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**

### **10.2. Domain Events Được Xử lý (Consumed Domain Events)**

SFM lắng nghe và xử lý các Domain Event từ các Bounded Context khác khi các sự kiện đó yêu cầu SFM thực hiện một hành động hoặc cập nhật thông tin. Dưới đây là danh sách các event dự kiến mà SFM lắng nghe và mục đích xử lý của chúng:

- **FulfillmentProcessingRequestedEvent** (Từ ODM) \- _Hoặc CreateShipmentCommand_
  - **Mục đích xử lý:** Tạo một Shipment mới dựa trên yêu cầu hoàn tất đơn hàng.
  - **Payload dự kiến:** (Thông tin cần thiết để tạo Shipment, ví dụ:)
    - OrderId (UUID)
    - TenantId (UUID)
    - ShippingAddress (Address Value Object)
    - BillingAddress (Address Value Object)
    - RecipientName (String)
    - RecipientPhone (String)
    - Items (List of Object \- {OrderItemId, SKU, Quantity, StockLocationId \- nếu ODM đã xác định vị trí})
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **InventoryIssued** (Từ ICM)
  - **Mục đích xử lý:** Xác nhận rằng hàng đã được xuất kho vật lý cho lô hàng. Có thể kích hoạt bước tiếp theo (ví dụ: yêu cầu đơn vị vận chuyển đến lấy hàng).
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - MovementId (UUID)
    - TenantId (UUID)
    - MovementType (String \- "Issue")
    - SourceBoundedContext (String \- "SFM")
    - SourceTransactionId (UUID \- Shipment ID)
    - TransactionDate (DateTime) **(ở múi giờ UTC)**
    - Items (List of Object \- {InventoryItemId, SKU, Quantity, SourceStockStatus, DestinationStockStatus, StockLocationId})
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **PaymentSuccessfulEvent** (Từ PPM)
  - **Mục đích xử lý:** Cập nhật trạng thái thanh toán chi phí vận chuyển trong Shipment khi PPM thông báo thanh toán thành công cho đơn vị vận chuyển.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - PaymentTransactionId (UUID)
    - TenantId (UUID)
    - RelatedShipmentId (UUID) \- ID lô hàng liên quan (cần được thêm vào payload của PPM)
    - Amount (Money Value Object)
    - PaymentDate (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **PaymentFailedEvent** (Từ PPM)
  - **Mục đích xử lý:** Cập nhật trạng thái thanh toán chi phí vận chuyển trong Shipment khi PPM thông báo thanh toán thất bại.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - PaymentTransactionId (UUID)
    - TenantId (UUID)
    - RelatedShipmentId (UUID)
    - FailureReason (String)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ReturnProcessedEvent** (Từ OSM/ODM)
  - **Mục đích xử lý:** Có thể kích hoạt quy trình xử lý lô hàng trả về trong SFM nếu việc trả hàng liên quan đến việc vận chuyển ngược lại.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - ReturnId (UUID)
    - TenantId (UUID)
    - ProcessDate (DateTime) **(ở múi giờ UTC)**
    - RelatedShipmentId (UUID, optional \- nếu việc trả hàng liên quan đến Shipment cụ thể)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **TenantDataDeletionRequestedEvent** (Từ BUM)
  - **Mục đích xử lý:** Kích hoạt quy trình xóa tất cả dữ liệu vận chuyển và hoàn tất đơn hàng liên quan đến Tenant đã yêu cầu xóa dữ liệu.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - TenantId (UUID)
    - RequestedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**

_(Lưu ý: Danh sách các sự kiện được xử lý có thể được mở rộng tùy thuộc vào các quy trình nghiệp vụ cụ thể trong hệ thống Ecoma có ảnh hưởng đến vận chuyển và hoàn tất đơn hàng.)_

## **11\. Ranh giới Nghiệp vụ**

Ranh giới của Bounded Context SFM được xác định bởi trách nhiệm quản lý quy trình xử lý đơn hàng vật lý sau khi đơn hàng được tạo và thanh toán (từ ODM), từ việc lấy hàng, đóng gói, vận chuyển, theo dõi trạng thái cho đến khi giao thành công hoặc xử lý trả về. SFM là nguồn sự thật về "gói hàng nào đang được vận chuyển đi đâu, trạng thái hiện tại của nó là gì, và ai đang vận chuyển nó".

SFM không chịu trách nhiệm:

- **Xác thực danh tính người dùng:** Chỉ sử dụng dịch vụ của IAM.
- **Quản lý quyền truy cập:** Chỉ sử dụng dịch vụ của IAM. IAM kiểm soát quyền của người dùng (nhân viên kho, nhân viên quản lý vận chuyển) trong SFM.
- **Quản lý bản dịch metadata hoặc quy tắc định dạng locale:** Chỉ sử dụng dịch vụ của LZM và RDM.
- **Ghi nhận audit logs:** Chỉ phát sự kiện cho ALM.
- **Xử lý đơn đặt hàng:** Chỉ nhận yêu cầu hoàn tất từ ODM.
- **Quản lý tồn kho chi tiết và logic đặt chỗ/trừ tồn kho:** Chỉ yêu cầu ICM xác nhận xuất kho và nhận thông tin tồn kho.
- **Xử lý thanh toán thực tế với cổng thanh toán:** Chỉ yêu cầu PPM xử lý thanh toán chi phí vận chuyển và nhận kết quả.
- **Quản lý thông tin sản phẩm master:** Chỉ sử dụng ID/SKU và lấy thông tin chi tiết từ PIM.
- **Quản lý dữ liệu khách hàng master:** Chỉ sử dụng ID và địa chỉ từ ODM/CRM.
- **Quản lý tài chính và kế toán:** Chỉ phát sự kiện chứa dữ liệu chi phí vận chuyển cho FAM ghi nhận.
- **Quản lý các miền nghiệp vụ khác** như nhân sự, đào tạo, quản lý công việc, marketing.
- **Lưu trữ file nhãn vận chuyển vật lý:** Chỉ lưu trữ ID tham chiếu đến DAM.
- **Gửi thông báo thực tế:** Chỉ yêu cầu NDM gửi thông báo.

## **12\. Kết luận**

Bounded Context Shipping & Fulfillment Management (SFM) là một thành phần cốt lõi quan trọng trong hệ thống Ecoma, đảm bảo quy trình xử lý và vận chuyển đơn hàng vật lý được thực hiện hiệu quả. Bằng cách tập trung trách nhiệm quản lý vòng đời lô hàng, tích hợp với đơn vị vận chuyển, theo dõi trạng thái và phối hợp với các BC khác, SFM cung cấp một nền tảng đáng tin cậy để hoàn tất đơn hàng và mang sản phẩm đến tay khách hàng. Việc thiết kế SFM với mô hình domain rõ ràng, các khía cạnh quan trọng của miền được làm rõ, tương tác được định nghĩa và các sự kiện nghiệp vụ phù hợp (bao gồm cả sự kiện lắng nghe) là nền tảng để xây dựng một hệ thống quản lý vận chuyển và hoàn tất đơn hàng mạnh mẽ và dễ mở rộng.

Tài liệu này cung cấp cái nhìn tổng quan chi tiết về SFM, bao gồm mô hình domain, các khía cạnh quan trọng của miền, tương tác, use cases, Domain Service, Application Service và Domain Event (phát ra và lắng nghe với payload dự kiến). Đây là nền tảng để chuyển sang giai đoạn thiết kế kỹ thuật chi tiết và triển khai Microservice SFM.
