# **Tài liệu Thiết kế Miền: Bounded Context Order Management (ODM)**

## **1\. Giới thiệu**

Tài liệu này cung cấp mô tả chi tiết về Bounded Context **Order Management (ODM)** trong hệ thống Ecoma. ODM là một trong những Bounded Context thuộc nhóm Value Stream, đóng vai trò trung tâm trong việc xử lý, quản lý và theo dõi vòng đời của các đơn đặt hàng phát sinh từ tất cả các kênh bán hàng (Omnichannel Sales Management \- OSM) của tổ chức khách hàng sử dụng nền tảng Ecoma.

ODM đảm bảo rằng mỗi đơn hàng được ghi nhận chính xác, xử lý hiệu quả qua các giai đoạn thanh toán, kiểm tra tồn kho, hoàn tất đơn hàng (fulfillment), và cập nhật trạng thái xuyên suốt, tích hợp chặt chẽ với các Bounded Context khác để đảm bảo luồng nghiệp vụ liền mạch từ khi khách hàng đặt hàng đến khi nhận được sản phẩm.

## **2\. Phạm vi của Tài liệu**

Tài liệu này tập trung vào việc định nghĩa và mô tả Bounded Context ODM ở cấp độ thiết kế miền (domain design), cung cấp đủ chi tiết để hỗ trợ việc thiết kế các Domain Service và Application Service. Cụ thể, tài liệu này bao gồm:

- Xác định vai trò và trách nhiệm chính của ODM, tập trung vào quản lý vòng đời đơn hàng.
- Mô tả các khái niệm và thực thể cốt lõi trong mô hình domain của ODM ở cấp độ chi tiết hơn, bao gồm các Aggregate Root, Entity và Value Object với các thuộc tính chính, có tính đến các mặt hàng, thanh toán, vận chuyển và trạng thái đơn hàng.
- Định nghĩa Ngôn ngữ Chung (Ubiquitous Language) trong phạm vi ODM.
- Mô tả **Các Khía cạnh Quan trọng của Miền ODM**, làm rõ các quy tắc và cấu trúc nghiệp vụ chi phối hoạt động của Context này, bao gồm vòng đời đơn hàng, xử lý thanh toán và hoàn tất đơn hàng.
- Làm rõ các tương tác chính giữa ODM và các Bounded Context khác là nguồn phát sinh đơn hàng hoặc tham gia vào quy trình xử lý đơn hàng.
- Phác thảo các **Use cases** chính có sự tham gia của ODM, tập trung vào actor, mục đích và các Domain/Application Service liên quan.
- Xác định ranh giới nghiệp vụ của ODM, nhấn mạnh những gì ODM không chịu trách nhiệm.
- Đề xuất các Domain Service và Application Service tiềm năng trong ODM, mô tả trách nhiệm chính của từng service.
- Xác định và mô tả các **Domain Events** mà ODM tương tác, được chia thành các sự kiện ODM **phát ra** (Published Events) và các sự kiện ODM **lắng nghe và xử lý** (Consumed Events), bao gồm payload dự kiến của từng event.

Tài liệu này **không** đi sâu vào các chi tiết kỹ thuật triển khai cụ thể hoặc mô tả chi tiết các bước thực hiện (how) của từng luồng nghiệp vụ **bên trong các service**. Các khía cạnh sau **không** nằm trong phạm vi của tài liệu này:

- Chi tiết cài đặt kỹ thuật của Microservice ODM.
- Cấu trúc cơ sở dữ liệu chi tiết (schema) của ODM.
- Các quyết định công nghệ cụ thể bên trong ODM.
- Luồng dữ liệu chi tiết đến cấp độ từng trường thông tin giữa ODM và các BC khác.
- Cấu hình hạ tầng triển khai cụ thể cho Microservice ODM.
- Thiết kế giao diện người dùng để quản lý đơn hàng.
- Xử lý giao diện người dùng cho các kênh bán hàng (thuộc OSM). ODM chỉ nhận đơn hàng đã được tạo từ OSM.
- Xử lý thanh toán thực tế với cổng thanh toán (thuộc PPM). ODM chỉ yêu cầu PPM xử lý thanh toán và nhận kết quả.
- Quản lý tồn kho chi tiết (thuộc ICM). ODM chỉ yêu cầu ICM kiểm tra khả dụng, đặt chỗ và trừ tồn kho, và nhận thông báo từ ICM.
- Quản lý quy trình vận chuyển và giao hàng thực tế (thuộc SFM). ODM chỉ gửi yêu cầu hoàn tất đơn hàng đến SFM và nhận thông báo trạng thái từ SFM.
- Quản lý thông tin sản phẩm chi tiết (thuộc PIM). ODM chỉ lưu trữ ID và SKU, và có thể lưu trữ snapshot thông tin sản phẩm tại thời điểm đặt hàng.
- Quản lý dữ liệu khách hàng chi tiết (thuộc CRM). ODM chỉ lưu trữ Customer ID và Address ID, và có thể lưu trữ snapshot địa chỉ giao hàng/thanh toán.
- Quản lý tài chính và kế toán (thuộc FAM). ODM chỉ phát sự kiện chứa dữ liệu tài chính cho FAM ghi nhận.
- Quản lý các miền nghiệp vụ khác như nhân sự, đào tạo, quản lý công việc, marketing.

## **3\. Vai trò và Trách nhiệm Chính**

Bounded Context ODM chịu trách nhiệm quản lý vòng đời của đơn đặt hàng. Các trách nhiệm chính bao gồm:

- **Tạo Đơn hàng:** Tiếp nhận đơn hàng từ OSM và tạo một bản ghi đơn hàng mới trong hệ thống.
- **Quản lý Vòng đời Đơn hàng:** Theo dõi và cập nhật trạng thái của đơn hàng qua các giai đoạn (ví dụ: Draft, Pending Payment, Processing, Shipped, Completed, Cancelled, Returned).
- **Quản lý Mặt hàng trong Đơn hàng (Order Items):** Lưu trữ chi tiết các sản phẩm/dịch vụ được đặt trong đơn hàng.
- **Quản lý Thông tin Thanh toán Liên quan:** Lưu trữ thông tin về các giao dịch thanh toán liên kết với đơn hàng (ID giao dịch từ PPM, trạng thái thanh toán).
- **Quản lý Thông tin Vận chuyển Liên quan:** Lưu trữ thông tin về các lô hàng (shipments) liên kết với đơn hàng (ID lô hàng từ SFM, trạng thái vận chuyển).
- **Phối hợp Xử lý Thanh toán:** Yêu cầu PPM xử lý thanh toán cho đơn hàng và nhận kết quả.
- **Phối hợp Kiểm tra & Đặt chỗ Tồn kho:** Yêu cầu ICM kiểm tra tồn kho khả dụng và đặt chỗ tồn kho cho các mặt hàng trong đơn hàng.
- **Phối hợp Hoàn tất Đơn hàng (Fulfillment):** Gửi yêu cầu hoàn tất đơn hàng đến SFM và nhận thông báo trạng thái từ SFM.
- **Xử lý Hủy Đơn hàng:** Xử lý yêu cầu hủy đơn hàng, bao gồm kiểm tra điều kiện hủy và thực hiện các hành động liên quan (hủy đặt chỗ tồn kho, yêu cầu hoàn tiền).
- **Xử lý Trả hàng:** Ghi nhận thông tin trả hàng và kích hoạt các quy trình liên quan (nhập kho hàng trả lại, hoàn tiền).
- **Tính toán Tổng tiền Đơn hàng:** Tính toán tổng giá trị đơn hàng bao gồm giá sản phẩm, thuế, phí vận chuyển, giảm giá.
- **Phát Sự kiện Nghiệp vụ:** Phát ra các Sự kiện Nghiệp vụ quan trọng khi trạng thái đơn hàng thay đổi hoặc các sự kiện quan trọng khác xảy ra trong vòng đời đơn hàng.

## **4\. Mô hình Domain (Chi tiết hơn)**

Trong phạm vi Bounded Context ODM, chúng ta xác định các Aggregate Root, Entity và Value Object cốt lõi với các thuộc tính chính:

**Aggregate Roots:**

- **Order:** Là Aggregate Root trung tâm, đại diện cho một đơn đặt hàng. Order quản lý tất cả thông tin liên quan đến đơn hàng, bao gồm mặt hàng, thanh toán, vận chuyển và trạng thái.
  - **ID:** Unique identifier (UUID).
  - **TenantId:** ID của tổ chức sở hữu đơn hàng (liên kết với IAM).
  - **CustomerId:** ID của khách hàng đặt hàng (liên kết với CRM).
  - **OrderDate:** Ngày đặt hàng. **Lưu trữ ở múi giờ UTC.**
  - **OrderStatus:** Trạng thái đơn hàng (OrderStatus Value Object: Draft, Pending Payment, Payment Failed, Processing, Partially Shipped, Shipped, Completed, Cancelled, Returned).
  - **OrderItems:** Danh sách các OrderItem Entities.
  - **BillingAddress:** Địa chỉ thanh toán (Address Value Object \- snapshot tại thời điểm đặt hàng).
  - **ShippingAddress:** Địa chỉ giao hàng (Address Value Object \- snapshot tại thời điểm đặt hàng).
  - **PaymentMethod:** Phương thức thanh toán (PaymentMethod Value Object \- liên kết với PPM/RDM).
  - **PaymentStatus:** Trạng thái thanh toán tổng thể của đơn hàng (PaymentStatus Value Object: Pending, Paid, Partially Paid, Refunded, Partially Refunded).
  - **FulfillmentStatus:** Trạng thái hoàn tất đơn hàng tổng thể (FulfillmentStatus Value Object: Pending, In Progress, Partially Fulfilled, Fulfilled, Cancelled).
  - **TotalAmount:** Tổng giá trị đơn hàng (Money Value Object).
  - **Subtotal:** Tổng giá trị mặt hàng trước thuế/phí (Money Value Object).
  - **TaxAmount:** Tổng tiền thuế (Money Value Object).
  - **ShippingAmount:** Tổng tiền phí vận chuyển (Money Value Object).
  - **DiscountAmount:** Tổng tiền giảm giá (Money Value Object).
  - **PaymentAllocations:** Danh sách các PaymentAllocation Entities (liên kết với các giao dịch thanh toán từ PPM).
  - **ShipmentGroups:** Danh sách các ShipmentGroup Entities (liên kết với các lô hàng từ SFM).
  - **Channel:** Kênh bán hàng phát sinh đơn hàng (Channel Value Object \- liên kết với OSM/RDM).
  - **Notes:** Ghi chú về đơn hàng (tùy chọn).
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ AddItem, RemoveItem, UpdateItemQuantity, ApplyDiscount, CalculateTotals, RequestPayment, ConfirmPayment, FailPayment, RequestFulfillment, ConfirmFulfillment, CancelOrder, RequestReturn.

**Entities (thuộc về các Aggregate Root):**

- **OrderItem (thuộc Order):** Đại diện cho một mặt hàng trong đơn hàng.
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root Order.
  - **ProductId:** ID của sản phẩm (liên kết với PIM).
  - **VariantId:** **Optional** ID của biến thể (liên kết với PIM).
  - **SKU:** Mã SKU (liên kết với PIM).
  - **ProductName:** Tên sản phẩm (snapshot tại thời điểm đặt hàng).
  - **Quantity:** Số lượng đặt.
  - **UnitPrice:** Đơn giá tại thời điểm đặt hàng (Money Value Object).
  - **LineTotal:** Tổng giá trị dòng (Quantity \* UnitPrice) (Money Value Object).
  - **TaxAmount:** Tiền thuế cho dòng này (Money Value Object).
  - **DiscountAmount:** Tiền giảm giá cho dòng này (Money Value Object).
  - **Status:** Trạng thái mặt hàng trong đơn hàng (OrderItemStatus Value Object: Pending, Processing, Shipped, Delivered, Returned, Cancelled).
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ UpdateQuantity, ChangeStatus.
- **PaymentAllocation (thuộc Order):** Đại diện cho việc liên kết một giao dịch thanh toán thành công từ PPM với đơn hàng này.
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root Order.
  - **PaymentTransactionId:** ID của giao dịch thanh toán trong PPM.
  - **Amount:** Số tiền được phân bổ cho đơn hàng này từ giao dịch đó (Money Value Object).
  - **AllocationDate:** Ngày phân bổ. **Lưu trữ ở múi giờ UTC.**
  - **Type:** Loại phân bổ (AllocationType Value Object: Payment, Refund).
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
- **ShipmentGroup (thuộc Order):** Đại diện cho một nhóm các mặt hàng trong đơn hàng sẽ được vận chuyển cùng nhau trong một lô hàng.
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root Order.
  - **ShipmentId:** ID của lô hàng trong SFM.
  - **Status:** Trạng thái lô hàng (ShipmentStatus Value Object \- từ SFM: Pending, Shipped, Delivered, Failed).
  - **ShippingCarrier:** Đơn vị vận chuyển (liên kết với SFM/RDM).
  - **TrackingNumber:** Mã vận đơn.
  - **Items:** Danh sách các ShipmentItem Value Objects.
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ UpdateStatus, AddItem.
- **ShipmentItem (Value Object thuộc ShipmentGroup):** Chi tiết về một mặt hàng cụ thể trong lô hàng.
  - **OrderItemId:** ID của OrderItem liên quan.
  - **Quantity:** Số lượng của mặt hàng này trong lô hàng.

**Value Objects:**

- **OrderStatus:** Trạng thái đơn hàng (Draft, Pending Payment, Payment Failed, Processing, Partially Shipped, Shipped, Completed, Cancelled, Returned).
- **OrderItemStatus:** Trạng thái mặt hàng trong đơn hàng (Pending, Processing, Shipped, Delivered, Returned, Cancelled).
- **PaymentStatus:** Trạng thái thanh toán tổng thể (Pending, Paid, Partially Paid, Refunded, Partially Refunded).
- **FulfillmentStatus:** Trạng thái hoàn tất đơn hàng tổng thể (Pending, In Progress, Partially Fulfilled, Fulfilled, Cancelled).
- **Money:** Giá trị tiền tệ (Amount, Currency).
- **Address:** Địa chỉ (Street, City, State/Province, PostalCode, Country) \- có thể dùng chung.
- **PaymentMethod:** Phương thức thanh toán (Type, Details \- ví dụ: Credit Card, Bank Transfer).
- **Channel:** Kênh bán hàng (Website, Mobile App, POS, Call Center).
- **AllocationType:** Loại phân bổ thanh toán (Payment, Refund).
- **ShipmentStatus:** Trạng thái lô hàng (Pending, Shipped, Delivered, Failed) \- đồng bộ từ SFM.
- **LocalizedText:** Giá trị văn bản đa ngôn ngữ (sử dụng Translation Key).

## **5\. Ngôn ngữ Chung (Ubiquitous Language)**

Trong Bounded Context ODM, các thuật ngữ sau đây có ý nghĩa cụ thể và nhất quán:

- **Order:** Đơn đặt hàng của khách hàng.
- **Order Item:** Một sản phẩm hoặc dịch vụ cụ thể trong Order.
- **Order Status:** Trạng thái hiện tại của Order trong vòng đời xử lý.
- **Order Lifecycle:** Các giai đoạn mà Order trải qua từ khi tạo đến khi hoàn tất.
- **Pending Payment:** Trạng thái chờ thanh toán.
- **Processing:** Trạng thái đang xử lý (kiểm tra tồn kho, chuẩn bị hoàn tất).
- **Fulfillment:** Quy trình xử lý đơn hàng từ kho đến tay khách hàng.
- **Shipped:** Trạng thái đã gửi hàng.
- **Completed:** Trạng thái đơn hàng đã hoàn tất (thanh toán đầy đủ, giao hàng thành công).
- **Cancelled:** Trạng thái đơn hàng đã bị hủy.
- **Returned:** Trạng thái đơn hàng đã bị trả lại.
- **Payment Allocation:** Việc gán một khoản tiền từ giao dịch thanh toán cho một Order cụ thể.
- **Shipment:** Một lô hàng vật lý chứa các Order Item được gửi đi cùng nhau.
- **Shipment Group:** Một nhóm Order Item được gán cho một Shipment.
- **Tracking Number:** Mã vận đơn để theo dõi Shipment.
- **Return:** Quy trình khách hàng trả lại hàng.
- **Refund:** Quy trình hoàn tiền cho khách hàng.
- **Order Source:** Kênh bán hàng mà Order được tạo ra.

## **6\. Các Khía cạnh Quan trọng của Miền ODM**

Phần này mô tả các cấu trúc, quy tắc và khái niệm nghiệp vụ quan trọng chi phối hoạt động của Bounded Context ODM.

### **6.1. Vòng đời Đơn hàng (Order Lifecycle)**

ODM quản lý vòng đời phức tạp của đơn hàng, với các trạng thái chuyển đổi phụ thuộc vào kết quả của các quy trình con như thanh toán và hoàn tất đơn hàng. Các trạng thái chính bao gồm:

stateDiagram-v2  
 \[\*\] \--\> Draft: Created (e.g., in cart)  
 Draft \--\> PendingPayment: Checkout initiated  
 PendingPayment \--\> PaymentFailed: Payment attempt failed  
 PendingPayment \--\> Processing: Payment successful  
 PaymentFailed \--\> PendingPayment: Retry payment  
 Processing \--\> PartiallyShipped: First shipment created  
 Processing \--\> Shipped: All items shipped in one shipment  
 PartiallyShipped \--\> Shipped: Remaining items shipped  
 Shipped \--\> Completed: All shipments delivered  
 PartiallyShipped \--\> Completed: All shipments delivered  
 Completed \--\> Returned: Return initiated  
 Processing \--\> Cancelled: Cancelled before fulfillment  
 PendingPayment \--\> Cancelled: Cancelled before payment  
 PaymentFailed \--\> Cancelled: Cancelled after payment failed  
 PartiallyShipped \--\> Cancelled: Cancelled during fulfillment  
 Shipped \--\> Cancelled: Cancelled during transit  
 Returned \--\> \[\*\]  
 Cancelled \--\> \[\*\]  
 Completed \--\> \[\*\]

Việc chuyển đổi trạng thái được kích hoạt bởi các sự kiện nội bộ hoặc từ các BC khác (ví dụ: PaymentSuccessfulEvent từ PPM, ShipmentCompletedEvent từ SFM).

### **6.2. Xử lý Thanh toán Liên quan**

ODM không tự xử lý thanh toán mà ủy quyền cho PPM. Khi đơn hàng cần thanh toán, ODM gửi yêu cầu đến PPM. ODM lưu trữ thông tin về các giao dịch thanh toán thành công liên kết với đơn hàng thông qua PaymentAllocation Entities. Trạng thái thanh toán tổng thể (PaymentStatus) của đơn hàng được cập nhật dựa trên tổng số tiền đã phân bổ từ các giao dịch thành công so với TotalAmount của đơn hàng.

### **6.3. Phối hợp Hoàn tất Đơn hàng (Fulfillment)**

ODM phối hợp với SFM để hoàn tất đơn hàng. Sau khi đơn hàng được thanh toán và tồn kho được đặt chỗ (phối hợp với ICM), ODM gửi yêu cầu hoàn tất đơn hàng đến SFM. ODM theo dõi tiến độ hoàn tất thông qua các ShipmentGroup Entities, được cập nhật trạng thái từ SFM. Trạng thái hoàn tất tổng thể (FulfillmentStatus) của đơn hàng được cập nhật dựa trên trạng thái của tất cả ShipmentGroup.

### **6.4. Tích hợp với ICM cho Tồn kho**

ODM tương tác chặt chẽ với ICM để kiểm tra tồn kho khả dụng trước khi cho phép đặt hàng (thường do OSM thực hiện query ICM, nhưng ODM có thể kiểm tra lại trong quá trình xử lý) và để yêu cầu ICM đặt chỗ tồn kho khi đơn hàng được xác nhận. Khi đơn hàng được xuất kho, ODM thông báo cho ICM để trừ tồn kho đã đặt chỗ.

### **6.5. Xử lý Hủy Đơn hàng và Trả hàng**

ODM xử lý logic nghiệp vụ cho việc hủy đơn hàng và trả hàng.

- **Hủy Đơn hàng:** Nếu đơn hàng bị hủy trước khi hoàn tất, ODM cần yêu cầu ICM hủy đặt chỗ tồn kho và yêu cầu PPM hoàn tiền nếu đơn hàng đã được thanh toán.
- **Trả hàng:** Khi khách hàng trả lại hàng, ODM ghi nhận thông tin trả hàng và kích hoạt các quy trình liên quan (yêu cầu ICM nhập kho hàng trả lại, yêu cầu PPM hoàn tiền).

### **6.6. Snapshot Dữ liệu tại Thời điểm Đặt hàng**

Để đảm bảo tính chính xác của đơn hàng theo thời gian, ODM lưu trữ snapshot của các thông tin quan trọng tại thời điểm đặt hàng, bao gồm:

- Thông tin sản phẩm/biến thể (ProductName, UnitPrice, SKU) trong OrderItem.
- Địa chỉ giao hàng và thanh toán (ShippingAddress, BillingAddress).  
  Điều này là cần thiết vì thông tin sản phẩm trong PIM hoặc địa chỉ khách hàng trong CRM có thể thay đổi sau khi đơn hàng được đặt.

### **6.7. Tính toán Tổng tiền Đơn hàng**

ODM chịu trách nhiệm tính toán tổng giá trị đơn hàng, bao gồm tổng giá trị mặt hàng, thuế, phí vận chuyển và giảm giá. Logic tính toán này cần được thực hiện chính xác và nhất quán.

## **7\. Tương tác với các Bounded Context khác**

ODM tương tác với nhiều Bounded Context khác trong hệ thống Ecoma để nhận đơn hàng, phối hợp xử lý và phát sự kiện về trạng thái đơn hàng.

- **Tương tác với Core BCs:**
  - **IAM:** ODM cần IAM (Request/Reply) để xác thực và ủy quyền cho người dùng quản lý đơn hàng. ODM lấy thông tin Tenant ID từ ngữ cảnh phiên làm việc.
  - **LZM & RDM:** ODM cần LZM (Request/Reply) để quản lý và hiển thị metadata đa ngôn ngữ (tên trạng thái đơn hàng, tên phương thức thanh toán, tên kênh bán hàng, v.v.). ODM cần RDM (Request/Reply) để lấy dữ liệu tham chiếu (ví dụ: loại tiền tệ, đơn vị đo lường, loại phương thức thanh toán, loại kênh bán hàng, trạng thái vận chuyển từ SFM).
  - **ALM:** ODM phát ra các sự kiện audit log (Event) khi có các hành động quan trọng liên quan đến quản lý đơn hàng (ví dụ: tạo đơn hàng, thay đổi trạng thái, yêu cầu thanh toán/hoàn tất, xử lý hủy/trả hàng).
  - **NDM:** ODM yêu cầu NDM gửi thông báo cho khách hàng (ví dụ: xác nhận đơn hàng, cập nhật trạng thái vận chuyển, thông báo hủy đơn hàng). Yêu cầu này bao gồm thông tin Customer ID (từ CRM) và ngữ cảnh đơn hàng để NDM xử lý.
- **Tương tác với Feature BCs:**
  - **OSM:** OSM là nguồn phát sinh đơn hàng. OSM gửi Command (ví dụ: PlaceOrderCommand) hoặc phát Event (ví dụ: CheckoutCompletedEvent) mà ODM lắng nghe để tạo đơn hàng. OSM gọi ODM (Request/Reply Query) để lấy thông tin trạng thái đơn hàng hiển thị cho khách hàng.
  - **PPM:** ODM gửi Command (ví dụ: ProcessPaymentCommand) đến PPM để yêu cầu xử lý thanh toán. PPM phát Event (PaymentSuccessfulEvent, PaymentFailedEvent, RefundProcessedEvent) mà ODM lắng nghe để cập nhật trạng thái thanh toán của đơn hàng và PaymentAllocation.
  - **ICM:** ODM gửi Command (ví dụ: ReserveInventoryCommand, DeductInventoryCommand) hoặc phát Event (ví dụ: OrderConfirmedEvent, ShipmentReadyForIssueEvent) mà ICM lắng nghe để yêu cầu đặt chỗ hoặc trừ tồn kho. ICM phát Event (InventoryReserved, InventoryReservationFailed, InventoryIssued, InventoryLevelUpdated) mà ODM lắng nghe để cập nhật trạng thái tồn kho liên quan đến đơn hàng.
  - **SFM:** ODM gửi Command (ví dụ: CreateShipmentCommand) hoặc phát Event (ví dụ: OrderReadyForFulfillmentEvent) mà SFM lắng nghe để yêu cầu tạo lô hàng. SFM phát Event (ShipmentCreated, ShipmentStatusUpdated, ShipmentCompletedEvent, ShipmentFailedEvent) mà ODM lắng nghe để cập nhật trạng thái vận chuyển của đơn hàng và ShipmentGroup.
  - **CRM:** ODM gọi CRM (Request/Reply Query) để lấy thông tin khách hàng (ví dụ: Customer ID, Address ID) và có thể lưu snapshot địa chỉ. ODM phát Event (OrderCompletedEvent, OrderCancelledEvent, ReturnProcessedEvent) chứa thông tin Customer ID để CRM lắng nghe và cập nhật hồ sơ khách hàng 360, vòng đời khách hàng, hoặc tạo Service Case.
  - **PIM:** ODM gọi PIM (Request/Reply Query) để lấy thông tin sản phẩm/biến thể (SKU, tên, giá) khi tạo Order Item (để lưu snapshot). PIM phát Event (ProductUpdated, ProductPriceChanged) mà ODM có thể lắng nghe để cảnh báo về sự không nhất quán giữa dữ liệu master và snapshot trong đơn hàng cũ (không tự động cập nhật đơn hàng đã tạo).
  - **FAM:** ODM phát Event (OrderCompletedEvent, OrderCancelledEvent, ReturnProcessedEvent) chứa dữ liệu tài chính (doanh thu, giá vốn, hoàn tiền) để FAM lắng nghe và ghi nhận bút toán kế toán.

## **8\. Use cases**

Dưới đây là mô tả các use case chính có sự tham gia của ODM, được tổ chức theo các nhóm chức năng chính, tập trung vào actor, mục đích và các Domain/Application Service liên quan.

### **8.1. Use Cases liên quan đến Tạo và Quản lý Đơn hàng**

Nhóm này bao gồm việc tiếp nhận đơn hàng mới và quản lý thông tin chung của đơn hàng.

- **Use case: Tạo Đơn hàng từ OSM:**
  - **Actor:** Hệ thống (từ OSM).
  - **Mục đích:** Ghi nhận một đơn hàng mới được tạo ra từ một kênh bán hàng.
  - **Service liên quan:** Được xử lý bởi OrderApplicationService (Event Handler cho CheckoutCompletedEvent hoặc Command Handler cho PlaceOrderCommand). Sử dụng OrderService để tạo Order Aggregate Root, bao gồm cả việc tính toán tổng tiền ban đầu. Sử dụng Order Repository. Gọi PIM Service để lấy snapshot thông tin sản phẩm, CRM Service để lấy thông tin khách hàng/địa chỉ. Phát sự kiện OrderCreated, audit log cho ALM.
- **Use case: Cập nhật Thông tin Đơn hàng (trước khi xử lý):**
  - **Actor:** Người dùng (nhân viên quản lý đơn hàng).
  - **Mục đích:** Chỉnh sửa thông tin đơn hàng (ví dụ: thêm/bớt mặt hàng, thay đổi số lượng, địa chỉ giao hàng) trước khi bắt đầu quy trình xử lý (thường ở trạng thái Draft hoặc Pending Payment).
  - **Service liên quan:** Được xử lý bởi OrderApplicationService (Command Handler cho UpdateOrderCommand). Sử dụng OrderService để lấy và cập nhật Order Aggregate Root. Sử dụng Order Repository. Phát sự kiện OrderUpdated, audit log for ALM.
- **Use case: Hủy Đơn hàng:**
  - **Actor:** Khách hàng, Người dùng (nhân viên quản lý đơn hàng).
  - **Mục đích:** Hủy bỏ một đơn hàng.
  - **Service liên quan:** Được xử lý bởi OrderApplicationService (Command Handler for CancelOrderCommand). Sử dụng OrderService để lấy và thay đổi trạng thái Order Aggregate Root thành Cancelled. OrderService thực hiện logic hủy (yêu cầu ICM hủy đặt chỗ, yêu cầu PPM hoàn tiền nếu đã thanh toán). Sử dụng Order Repository. Phát sự kiện OrderCancelled, audit log cho ALM. Phát sự kiện cho CRM, FAM, ICM, PPM.

### **8.2. Use Cases liên quan đến Xử lý Đơn hàng (Payment & Fulfillment)**

Nhóm này tập trung vào việc phối hợp các quy trình con để hoàn tất đơn hàng.

- **Use case: Yêu cầu Xử lý Thanh toán:**
  - **Actor:** Hệ thống (sau khi OrderCreated hoặc khi khách hàng retry payment).
  - **Mục đích:** Bắt đầu quy trình thanh toán cho đơn hàng.
  - **Service liên quan:** Được xử lý bởi OrderService (sau khi tạo Order hoặc nhận Command retry). Thay đổi trạng thái Order thành Pending Payment. Yêu cầu PPM xử lý thanh toán (gửi Command đến PPM). Sử dụng Order Repository. Phát sự kiện OrderStatusChanged, PaymentProcessingRequested, audit log cho ALM.
- **Use case: Xử lý Kết quả Thanh toán:**
  - **Actor:** Hệ thống (từ PPM).
  - **Mục đích:** Cập nhật trạng thái đơn hàng dựa trên kết quả thanh toán từ PPM.
  - **Service liên quan:** Được xử lý bởi PaymentApplicationService (Event Handler cho PaymentSuccessfulEvent, PaymentFailedEvent). Sử dụng OrderService để lấy Order Aggregate Root. OrderService cập nhật trạng thái thanh toán (PaymentStatus), thêm PaymentAllocation, và thay đổi trạng thái đơn hàng (OrderStatus) thành Processing (nếu Paid) hoặc Payment Failed (nếu Failed). Sử dụng Order Repository. Phát sự kiện OrderStatusChanged, PaymentStatusUpdated, audit log cho ALM. Phát sự kiện cho FAM, CRM.
- **Use case: Yêu cầu Hoàn tất Đơn hàng:**
  - **Actor:** Hệ thống (sau khi Payment Successful và tồn kho đã đặt chỗ).
  - **Mục đích:** Bắt đầu quy trình chuẩn bị hàng và vận chuyển bởi SFM.
  - **Service liên quan:** Được xử lý bởi OrderService (sau khi nhận PaymentSuccessfulEvent và InventoryReserved event). Thay đổi trạng thái Order thành Processing. Yêu cầu SFM tạo lô hàng (gửi Command đến SFM). Sử dụng Order Repository. Phát sự kiện OrderStatusChanged, FulfillmentProcessingRequested, audit log cho ALM.
- **Use case: Cập nhật Trạng thái Hoàn tất từ SFM:**
  - **Actor:** Hệ thống (từ SFM).
  - **Mục đích:** Cập nhật trạng thái vận chuyển của đơn hàng dựa trên thông báo từ SFM.
  - **Service liên quan:** Được xử lý bởi FulfillmentApplicationService (Event Handler cho ShipmentCreated, ShipmentStatusUpdated, ShipmentCompletedEvent, ShipmentFailedEvent từ SFM). Sử dụng OrderService để lấy Order Aggregate Root. OrderService cập nhật trạng thái của ShipmentGroup và OrderItemStatus tương ứng, và tính toán lại FulfillmentStatus tổng thể của đơn hàng. Thay đổi trạng thái đơn hàng (OrderStatus) nếu tất cả lô hàng đã Shipped hoặc Delivered. Sử dụng Order Repository. Phát sự kiện OrderStatusChanged, FulfillmentStatusUpdated, audit log cho ALM. Phát sự kiện cho CRM, NDM.
- **Use case: Hoàn tất Đơn hàng:**
  - **Actor:** Hệ thống (khi tất cả các điều kiện hoàn tất được đáp ứng trong OrderService).
  - **Mục đích:** Đánh dấu đơn hàng là đã hoàn thành (thanh toán đầy đủ, giao hàng thành công).
  - **Service liên quan:** Được xử lý bởi OrderService (sau khi nhận ShipmentCompletedEvent cho tất cả lô hàng và PaymentStatus là Paid). Thay đổi trạng thái Order thành Completed. Sử dụng Order Repository. Phát sự kiện OrderCompleted, audit log cho ALM. Phát sự kiện cho CRM, FAM.

### **8.3. Use Cases liên quan đến Trả hàng và Hoàn tiền**

Nhóm này xử lý các kịch bản sau khi đơn hàng đã hoàn tất.

- **Use case: Ghi nhận Yêu cầu Trả hàng:**
  - **Actor:** Khách hàng, Người dùng (nhân viên CSKH).
  - **Mục đích:** Bắt đầu quy trình xử lý hàng trả lại.
  - **Service liên quan:** Được xử lý bởi OrderApplicationService (Command Handler cho RequestReturnCommand). Sử dụng OrderService để lấy Order Aggregate Root và ghi nhận yêu cầu trả hàng (có thể thay đổi trạng thái đơn hàng thành Returned hoặc tạo một Return Aggregate Root riêng nếu phức tạp). Sử dụng Order Repository. Phát sự kiện ReturnRequested, audit log cho ALM. Phát sự kiện cho ICM (yêu cầu nhập kho hàng trả lại), CRM (tạo Service Case).
- **Use case: Xử lý Hoàn tiền:**
  - **Actor:** Hệ thống (từ OrderService khi hủy đơn hàng hoặc xử lý trả hàng).
  - **Mục đích:** Yêu cầu PPM hoàn tiền cho khách hàng.
  - **Service liên quan:** Được xử lý bởi OrderService (khi hủy đơn hàng hoặc xử lý trả hàng). Yêu cầu PPM hoàn tiền (gửi Command đến PPM). Sử dụng Order Repository. Phát sự kiện RefundRequested, audit log cho ALM.
- **Use case: Xử lý Kết quả Hoàn tiền:**
  - **Actor:** Hệ thống (từ PPM).
  - **Mục đích:** Cập nhật trạng thái thanh toán của đơn hàng sau khi hoàn tiền thành công/thất bại.
  - **Service liên quan:** Được xử lý bởi PaymentApplicationService (Event Handler cho RefundProcessedEvent từ PPM). Sử dụng OrderService để lấy Order Aggregate Root. OrderService cập nhật trạng thái thanh toán (PaymentStatus) và thêm PaymentAllocation (loại Refund). Sử dụng Order Repository. Phát sự kiện PaymentStatusUpdated, audit log cho ALM. Phát sự kiện cho FAM, CRM.

### **8.4. Use Cases liên quan đến Truy vấn Đơn hàng**

Nhóm này cho phép người dùng hoặc các BC khác truy xuất thông tin về đơn hàng.

- **Use case: Xem Chi tiết Đơn hàng:**
  - **Actor:** Khách hàng, Người dùng (nhân viên nội bộ).
  - **Mục đích:** Xem tất cả thông tin chi tiết về một đơn hàng cụ thể.
  - **Service liên quan:** Được xử lý bởi OrderQueryApplicationService (Query Handler cho GetOrderDetailsQuery). Sử dụng OrderQueryService để lấy Order Aggregate Root. Sử dụng Order Repository. Gọi PIM Service để lấy thông tin sản phẩm, CRM Service để lấy thông tin khách hàng, SFM Service để lấy thông tin vận chuyển chi tiết, PPM Service để lấy thông tin thanh toán chi tiết, LZM Service để lấy bản dịch.
- **Use case: Tìm kiếm Đơn hàng:**
  - **Actor:** Người dùng (nhân viên nội bộ).
  - **Mục đích:** Tìm kiếm đơn hàng dựa trên các tiêu chí (ví dụ: khách hàng, trạng thái, ngày đặt hàng).
  - **Service liên quan:** Được xử lý bởi OrderQueryApplicationService (Query Handler cho SearchOrdersQuery). Sử dụng OrderQueryService để truy vấn Order Repository. Sử dụng Order Repository. Gọi LZM Service để lấy bản dịch.

## **9\. Domain Services**

Domain Services trong ODM chứa logic nghiệp vụ quan trọng không thuộc về một Aggregate Root cụ thể hoặc cần phối hợp nhiều Aggregate Root.

- **OrderService:**
  - **Trách nhiệm:** Quản lý vòng đời của Order Aggregate Root (tạo, cập nhật, thay đổi trạng thái, thêm/bớt mặt hàng, tính toán tổng tiền). Thực hiện logic nghiệp vụ khi yêu cầu thanh toán, xử lý kết quả thanh toán, yêu cầu hoàn tất, xử lý kết quả hoàn tất, xử lý hủy đơn hàng. Phối hợp với Order Repository, PIM Service (để lấy snapshot sản phẩm), CRM Service (để lấy snapshot địa chỉ), PPM Service (để gửi Command thanh toán/hoàn tiền), SFM Service (để gửi Command tạo lô hàng), ICM Service (để gửi Command đặt chỗ/trừ tồn kho).
  - **Các phương thức tiềm năng:** CreateOrder(tenantId, customerId, details), UpdateOrder(orderId, tenantId, updates), ChangeOrderStatus(orderId, tenantId, newStatus), AddOrderItem(orderId, tenantId, itemDetails), RemoveOrderItem(orderId, tenantId, orderItemId), CalculateOrderTotals(orderId, tenantId), ProcessPaymentResult(orderId, tenantId, paymentTransactionId, amount, type), ProcessFulfillmentResult(orderId, tenantId, shipmentId, status), CancelOrder(orderId, tenantId), RequestReturn(orderId, tenantId, returnDetails).
- **FulfillmentService:**
  - **Trách nhiệm:** Xử lý logic liên quan đến việc tạo và cập nhật ShipmentGroup trong Order Aggregate dựa trên thông báo từ SFM. Tính toán trạng thái hoàn tất tổng thể. Phối hợp với Order Repository.
  - **Các phương thức tiềm năng:** HandleShipmentCreated(orderId, tenantId, shipmentDetails), HandleShipmentStatusUpdated(orderId, tenantId, shipmentId, newStatus).
- **PaymentAllocationService:**
  - **Trách nhiệm:** Xử lý logic liên quan đến việc tạo và cập nhật PaymentAllocation trong Order Aggregate dựa trên thông báo từ PPM. Tính toán trạng thái thanh toán tổng thể. Phối hợp với Order Repository.
  - **Các phương thức tiềm năng:** HandlePaymentSuccessful(orderId, tenantId, paymentTransactionId, amount), HandleRefundProcessed(orderId, tenantId, refundTransactionId, amount).
- **OrderQueryService (Optional Domain Service):** Nếu logic truy vấn phức tạp (tìm kiếm đơn hàng theo nhiều tiêu chí, lấy dữ liệu cho báo cáo), có thể tách ra.
  - **Trách nhiệm:** Cung cấp các phương thức truy vấn dữ liệu từ Order Aggregate. Phối hợp với Order Repository, PIM Service, CRM Service, SFM Service, PPM Service, LZM Service.
  - **Các phương thức tiềm năng:** GetOrderDetails(orderId, tenantId), SearchOrders(criteria, tenantId), GetOrdersByCustomer(customerId, tenantId).

## **9\. Application Services**

Application Services trong ODM là lớp mỏng điều phối các hành động từ bên ngoài (ví dụ: từ API Gateway, Message Broker) đến Domain Model (Aggregate Roots, Domain Services). Chúng xử lý các tác vụ kỹ thuật như lắng nghe Event, xử lý Query, thực hiện ủy quyền, và gọi Domain Service.

- **OrderApplicationService:**
  - **Trách nhiệm:** Xử lý các command liên quan đến quản lý Order từ API (ví dụ: PlaceOrderCommand, UpdateOrderCommand, CancelOrderCommand, RequestReturnCommand) hoặc lắng nghe Event từ OSM (ví dụ: CheckoutCompletedEvent). Sử dụng OrderService và Order Repository. Thực hiện ủy quyền với IAM (nếu từ API). Lắng nghe các event liên quan đến xóa Tenant từ BUM để kích hoạt xóa dữ liệu đơn hàng của Tenant đó.
  - **Các phương thức tiềm năng:** HandlePlaceOrderCommand(command), HandleUpdateOrderCommand(command), HandleCancelOrderCommand(command), HandleRequestReturnCommand(command), HandleCheckoutCompletedEvent(event), HandleTenantDataDeletionRequestedEvent(event).
- **PaymentApplicationService:**
  - **Trách nhiệm:** Lắng nghe các Event liên quan đến thanh toán từ PPM (ví dụ: PaymentSuccessfulEvent, PaymentFailedEvent, RefundProcessedEvent). Sử dụng OrderService hoặc PaymentAllocationService để xử lý kết quả thanh toán/hoàn tiền và cập nhật Order Aggregate.
  - **Các phương thức tiềm năng:** HandlePaymentSuccessfulEvent(event), HandlePaymentFailedEvent(event), HandleRefundProcessedEvent(event).
- **FulfillmentApplicationService:**
  - **Trách nhiệm:** Lắng nghe các Event liên quan đến vận chuyển từ SFM (ví dụ: ShipmentCreated, ShipmentStatusUpdated, ShipmentCompletedEvent, ShipmentFailedEvent). Sử dụng OrderService hoặc FulfillmentService để xử lý kết quả vận chuyển và cập nhật Order Aggregate.
  - **Các phương thức tiềm năng:** HandleShipmentCreatedEvent(event), HandleShipmentStatusUpdatedEvent(event), HandleShipmentCompletedEvent(event), HandleShipmentFailedEvent(event).
- **OrderQueryApplicationService:**
  - **Trách nhiệm:** Xử lý các query để lấy thông tin đơn hàng (ví dụ: GetOrderDetailsQuery, SearchOrdersQuery). Sử dụng OrderQueryService hoặc các Domain Service khác. Thực hiện ủy quyền với IAM.
  - **Các phương thức tiềm năng:** HandleGetOrderDetailsQuery(query), HandleSearchOrdersQuery(query).

## **10\. Domain Events**

Bounded Context ODM tương tác với các Bounded Context khác thông qua việc phát ra và lắng nghe các Domain Event. Dưới đây là danh sách các event mà ODM phát ra và lắng nghe, bao gồm payload dự kiến của chúng:

### **10.1. Domain Events (ODM Phát ra)**

ODM sẽ phát ra các Domain Event quan trọng để thông báo cho các Bounded Context khác về những thay đổi trạng thái nghiệp vụ trong phạm vi của nó. Dưới đây là danh sách các event và payload dự kiến của chúng:

- **OrderCreated**
  - Phát ra khi một đơn hàng mới được tạo.
  - **Payload:**
    - OrderId (UUID)
    - TenantId (UUID)
    - CustomerId (UUID)
    - OrderDate (DateTime) **(ở múi giờ UTC)**
    - OrderStatus (String)
    - TotalAmount (Money Value Object)
    - Channel (String)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **OrderUpdated**
  - Phát ra khi thông tin đơn hàng được cập nhật (trừ trạng thái).
  - **Payload:**
    - OrderId (UUID)
    - TenantId (UUID)
    - UpdatedFields (Object \- ví dụ: { "shippingAddress": {...}, "orderItems": \[...\] })
    - UpdatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **OrderStatusChanged**
  - Phát ra khi trạng thái đơn hàng thay đổi.
  - **Payload:**
    - OrderId (UUID)
    - TenantId (UUID)
    - OldStatus (String)
    - NewStatus (String)
    - UpdatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **OrderCompleted**
  - Phát ra khi đơn hàng được đánh dấu là đã hoàn thành.
  - **Payload:**
    - OrderId (UUID)
    - TenantId (UUID)
    - CustomerId (UUID)
    - CompletionDate (DateTime) **(ở múi giờ UTC)**
    - TotalAmount (Money Value Object)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **OrderCancelled**
  - Phát ra khi đơn hàng bị hủy.
  - **Payload:**
    - OrderId (UUID)
    - TenantId (UUID)
    - CustomerId (UUID)
    - CancellationDate (DateTime) **(ở múi giờ UTC)**
    - Reason (String, optional)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ReturnRequested**
  - Phát ra khi khách hàng yêu cầu trả hàng.
  - **Payload:**
    - ReturnRequestId (UUID) \- Nếu Return là Aggregate Root riêng
    - OrderId (UUID)
    - TenantId (UUID)
    - CustomerId (UUID)
    - RequestDate (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **PaymentProcessingRequested**
  - Phát ra khi ODM yêu cầu PPM xử lý thanh toán cho đơn hàng.
  - **Payload:**
    - OrderId (UUID)
    - TenantId (UUID)
    - CustomerId (UUID)
    - Amount (Money Value Object)
    - PaymentMethod (PaymentMethod Value Object)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **RefundRequested**
  - Phát ra khi ODM yêu cầu PPM hoàn tiền cho đơn hàng.
  - **Payload:**
    - OrderId (UUID)
    - TenantId (UUID)
    - CustomerId (UUID)
    - Amount (Money Value Object)
    - Reason (String, optional)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **FulfillmentProcessingRequested**
  - Phát ra khi ODM yêu cầu SFM bắt đầu quy trình hoàn tất đơn hàng.
  - **Payload:**
    - OrderId (UUID)
    - TenantId (UUID)
    - ShippingAddress (Address Value Object)
    - OrderItems (List of Object \- {OrderItemId, SKU, Quantity})
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **PaymentStatusUpdated**
  - Phát ra khi trạng thái thanh toán của đơn hàng thay đổi (ví dụ: Pending \-\> Paid).
  - **Payload:**
    - OrderId (UUID)
    - TenantId (UUID)
    - OldStatus (String)
    - NewStatus (String)
    - UpdatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **FulfillmentStatusUpdated**
  - Phát ra khi trạng thái hoàn tất đơn hàng tổng thể thay đổi.
  - **Payload:**
    - OrderId (UUID)
    - TenantId (UUID)
    - OldStatus (String)
    - NewStatus (String)
    - UpdatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**

### **10.2. Domain Events Được Xử lý (Consumed Domain Events)**

ODM lắng nghe và xử lý các Domain Event từ các Bounded Context khác khi các sự kiện đó ảnh hưởng đến trạng thái hoặc dữ liệu của đơn hàng. Dưới đây là danh sách các event dự kiến mà ODM lắng nghe và mục đích xử lý của chúng:

- **CheckoutCompletedEvent** (Từ OSM)
  - **Mục đích xử lý:** Tạo một đơn hàng mới trong ODM dựa trên thông tin từ quá trình checkout.
  - **Payload dự kiến:** (Thông tin cần thiết để tạo đơn hàng, ví dụ:)
    - CheckoutId (UUID)
    - TenantId (UUID)
    - CustomerId (UUID)
    - OrderDate (DateTime) **(ở múi giờ UTC)**
    - Items (List of Object \- {ProductId, VariantId, SKU, Quantity, UnitPrice, TaxAmount, DiscountAmount})
    - BillingAddress (Address Value Object)
    - ShippingAddress (Address Value Object)
    - PaymentMethod (PaymentMethod Value Object)
    - Channel (String)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **PaymentSuccessfulEvent** (Từ PPM)
  - **Mục đích xử lý:** Cập nhật trạng thái thanh toán của đơn hàng liên quan thành Paid, thêm PaymentAllocation, và kích hoạt quy trình hoàn tất đơn hàng.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - PaymentTransactionId (UUID)
    - TenantId (UUID)
    - RelatedOrderId (UUID) \- ID đơn hàng liên quan
    - Amount (Money Value Object)
    - PaymentDate (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **PaymentFailedEvent** (Từ PPM)
  - **Mục đích xử lý:** Cập nhật trạng thái thanh toán của đơn hàng liên quan thành Payment Failed.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - PaymentTransactionId (UUID)
    - TenantId (UUID)
    - RelatedOrderId (UUID) \- ID đơn hàng liên quan
    - FailureReason (String)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **RefundProcessedEvent** (Từ PPM)
  - **Mục đích xử lý:** Cập nhật trạng thái thanh toán của đơn hàng liên quan (ví dụ: thành Refunded hoặc Partially Refunded), thêm PaymentAllocation (loại Refund).
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - RefundTransactionId (UUID)
    - TenantId (UUID)
    - RelatedOrderId (UUID) \- ID đơn hàng liên quan
    - Amount (Money Value Object)
    - RefundDate (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **InventoryReserved** (Từ ICM)
  - **Mục đích xử lý:** Xác nhận tồn kho đã được đặt chỗ cho đơn hàng, có thể kích hoạt bước tiếp theo trong quy trình xử lý đơn hàng.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - TenantId (UUID)
    - ReferenceId (UUID \- Order ID)
    - Items (List of Object \- {SKU, Quantity, StockLocationId})
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **InventoryReservationFailed** (Từ ICM)
  - **Mục đích xử lý:** Xử lý khi không đủ tồn kho để đặt chỗ cho đơn hàng (ví dụ: đánh dấu mặt hàng là hết hàng, thông báo cho người quản lý đơn hàng).
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - TenantId (UUID)
    - ReferenceId (UUID \- Order ID)
    - SKU (String)
    - RequiredQuantity (Decimal)
    - AvailableQuantity (Decimal)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ShipmentCreated** (Từ SFM)
  - **Mục đích xử lý:** Thêm ShipmentGroup mới vào Order Aggregate và cập nhật trạng thái hoàn tất đơn hàng (ví dụ: thành Partially Shipped hoặc Shipped).
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - ShipmentId (UUID)
    - TenantId (UUID)
    - RelatedOrderId (UUID) \- ID đơn hàng liên quan
    - ShippingCarrier (String)
    - TrackingNumber (String, optional)
    - Items (List of Object \- {OrderItemId, Quantity})
    - CreatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ShipmentStatusUpdated** (Từ SFM)
  - **Mục đích xử lý:** Cập nhật trạng thái của ShipmentGroup trong Order Aggregate.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - ShipmentId (UUID)
    - TenantId (UUID)
    - RelatedOrderId (UUID) \- ID đơn hàng liên quan
    - OldStatus (String)
    - NewStatus (String)
    - UpdatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ShipmentCompletedEvent** (Từ SFM)
  - **Mục đích xử lý:** Cập nhật trạng thái của ShipmentGroup thành Delivered và tính toán lại trạng thái hoàn tất tổng thể của đơn hàng. Nếu tất cả lô hàng đã Delivered và thanh toán đầy đủ, đánh dấu đơn hàng là Completed.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - ShipmentId (UUID)
    - TenantId (UUID)
    - RelatedOrderId (UUID) \- ID đơn hàng liên quan
    - CompletionDate (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ShipmentFailedEvent** (Từ SFM)
  - **Mục đích xử lý:** Cập nhật trạng thái của ShipmentGroup thành Failed và xử lý các trường hợp ngoại lệ (ví dụ: thông báo cho người quản lý đơn hàng).
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - ShipmentId (UUID)
    - TenantId (UUID)
    - RelatedOrderId (UUID) \- ID đơn hàng liên quan
    - FailureReason (String)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **TenantDataDeletionRequestedEvent** (Từ BUM)
  - **Mục đích xử lý:** Kích hoạt quy trình xóa tất cả dữ liệu đơn hàng liên quan đến Tenant đã yêu cầu xóa dữ liệu.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - TenantId (UUID)
    - RequestedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**

_(Lưu ý: Danh sách các sự kiện được xử lý có thể được mở rộng tùy thuộc vào các quy trình nghiệp vụ cụ thể trong hệ thống Ecoma có ảnh hưởng đến đơn hàng.)_

## **11\. Ranh giới Nghiệp vụ**

Ranh giới của Bounded Context ODM được xác định bởi trách nhiệm quản lý vòng đời của đơn đặt hàng, từ khi được tạo ra từ các kênh bán hàng đến khi hoàn tất hoặc hủy bỏ. ODM là nguồn sự thật về "đơn hàng nào đã được đặt, trạng thái hiện tại của nó là gì, và nó đang ở giai đoạn nào trong quy trình xử lý".

ODM không chịu trách nhiệm:

- **Xác thực danh tính người dùng:** Chỉ sử dụng dịch vụ của IAM.
- **Quản lý quyền truy cập:** Chỉ sử dụng dịch vụ của IAM. IAM kiểm soát quyền của người dùng (khách hàng, nhân viên quản lý đơn hàng) trong ODM.
- **Quản lý bản dịch metadata hoặc quy tắc định dạng locale:** Chỉ sử dụng dịch vụ của LZM và RDM.
- **Ghi nhận audit logs:** Chỉ phát sự kiện cho ALM.
- **Xử lý giao diện người dùng cho các kênh bán hàng:** Trách nhiệm của OSM. ODM chỉ nhận đơn hàng từ OSM.
- **Xử lý thanh toán thực tế với cổng thanh toán:** Trách nhiệm của PPM. ODM chỉ yêu cầu PPM xử lý và nhận kết quả.
- **Quản lý tồn kho chi tiết và logic đặt chỗ/trừ tồn kho:** Trách nhiệm của ICM. ODM chỉ yêu cầu ICM và nhận thông báo.
- **Quản lý quy trình vận chuyển và giao hàng thực tế:** Trách nhiệm của SFM. ODM chỉ gửi yêu cầu và nhận thông báo trạng thái.
- **Quản lý thông tin sản phẩm master:** Trách nhiệm của PIM. ODM chỉ lưu snapshot và ID.
- **Quản lý dữ liệu khách hàng master:** Trách nhiệm của CRM. ODM chỉ lưu ID và snapshot địa chỉ.
- **Quản lý tài chính và kế toán:** Trách nhiệm của FAM. ODM chỉ phát sự kiện chứa dữ liệu tài chính cho FAM ghi nhận.
- **Quản lý các miền nghiệp vụ khác** như nhân sự, đào tạo, quản lý công việc, marketing, gói dịch vụ (BUM).

## **12\. Kết luận**

Bounded Context Order Management (ODM) là một thành phần cốt lõi quan trọng trong hệ thống Ecoma, đảm bảo quy trình xử lý đơn hàng được thực hiện hiệu quả và chính xác. Bằng cách tập trung trách nhiệm quản lý vòng đời đơn hàng, phối hợp với các BC khác cho thanh toán, tồn kho và hoàn tất, ODM cung cấp một nền tảng đáng tin cậy để theo dõi và quản lý tất cả các đơn hàng phát sinh từ các kênh bán hàng. Việc thiết kế ODM với mô hình domain rõ ràng, các khía cạnh quan trọng của miền được làm rõ, tương tác được định nghĩa và các sự kiện nghiệp vụ phù hợp (bao gồm cả sự kiện lắng nghe) là nền tảng để xây dựng một hệ thống quản lý đơn hàng mạnh mẽ và dễ mở rộng.

Tài liệu này cung cấp cái nhìn tổng quan chi tiết về ODM, bao gồm mô hình domain, các khía cạnh quan trọng của miền, tương tác, use cases, Domain Service, Application Service và Domain Event (phát ra và lắng nghe với payload dự kiến). Đây là nền tảng để chuyển sang giai đoạn thiết kế kỹ thuật chi tiết và triển khai Microservice ODM.
