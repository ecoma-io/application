# **Bounded Context Payment Processing Management (PPM)**

## **1\. Giới thiệu**

Tài liệu này cung cấp mô tả chi tiết về Bounded Context **Payment Processing Management (PPM)** trong hệ thống Ecoma. PPM là một trong những Bounded Context cốt lõi (Core Bounded Context), đóng vai trò quản lý và xử lý tất cả các giao dịch thanh toán và hoàn tiền phát sinh từ các hoạt động kinh doanh của tổ chức khách hàng trên nền tảng Ecoma.

PPM đảm bảo rằng các giao dịch thanh toán được thực hiện một cách an toàn, chính xác và hiệu quả, tích hợp với nhiều cổng thanh toán (payment gateway) bên ngoài và cung cấp một giao diện thống nhất cho các Bounded Context khác yêu cầu xử lý thanh toán (như ODM, BUM, SFM, MPM).

## **2\. Phạm vi của Tài liệu**

Tài liệu này tập trung vào việc định nghĩa và mô tả Bounded Context PPM ở cấp độ thiết kế miền (domain design), cung cấp đủ chi tiết để hỗ trợ việc thiết kế các Domain Service và Application Service. Cụ thể, tài liệu này bao gồm:

* Xác định vai trò và trách nhiệm chính của PPM, tập trung vào xử lý thanh toán, hoàn tiền và quản lý tích hợp cổng thanh toán.  
* Mô tả các khái niệm và thực thể cốt lõi trong mô hình domain của PPM ở cấp độ chi tiết hơn, bao gồm các Aggregate Root, Entity và Value Object với các thuộc tính chính, có tính đến các loại giao dịch, trạng thái và thông tin tích hợp.  
* Định nghĩa Ngôn ngữ Chung (Ubiquitous Language) trong phạm vi PPM.  
* Mô tả **Các Khía cạnh Quan trọng của Miền PPM**, làm rõ các quy tắc và cấu trúc nghiệp vụ chi phối hoạt động của Context này, bao gồm tích hợp cổng thanh toán, xử lý giao dịch và hoàn tiền.  
* Làm rõ các tương tác chính giữa PPM và các Bounded Context khác là nguồn yêu cầu thanh toán hoặc tiêu thụ kết quả thanh toán.  
* Phác thảo các **Use cases** chính có sự tham gia của PPM, tập trung vào actor, mục đích và các Domain/Application Service liên quan.  
* Xác định ranh giới nghiệp vụ của PPM, nhấn mạnh những gì PPM không chịu trách nhiệm.  
* Đề xuất các Domain Service và Application Service tiềm năng trong PPM, mô tả trách nhiệm chính của từng service.  
* Xác định và mô tả các **Domain Events** mà PPM tương tác, được chia thành các sự kiện PPM **phát ra** (Published Events) và các sự kiện PPM **lắng nghe và xử lý** (Consumed Events), bao gồm payload dự kiến của từng event.

Tài liệu này **không** đi sâu vào các chi tiết kỹ thuật triển khai cụ thể hoặc mô tả chi tiết các bước thực hiện (how) của từng luồng nghiệp vụ **bên trong các service**. Các khía аспек sau **không** nằm trong phạm vi của tài liệu này:

* Chi tiết cài đặt kỹ thuật của Microservice PPM.  
* Cấu trúc cơ sở dữ liệu chi tiết (schema) của PPM.  
* Các quyết định công nghệ cụ thể bên trong PPM (ví dụ: lựa chọn ngôn ngữ lập trình, framework, chi tiết tích hợp với từng API của cổng thanh toán cụ thể).  
* Luồng dữ liệu chi tiết đến cấp độ từng trường thông tin giữa PPM và các BC khác.  
* Cấu hình hạ tầng triển khai cụ thể cho Microservice PPM.  
* Thiết kế giao diện người dùng cho trang thanh toán hoặc quản lý thanh toán.  
* Quản lý thông tin thẻ tín dụng hoặc thông tin thanh toán nhạy cảm của khách hàng (việc này thuộc về cổng thanh toán hoặc các dịch vụ tokenization tuân thủ PCI DSS). PPM chỉ lưu trữ token hoặc ID giao dịch từ cổng thanh toán.  
* Quản lý thông tin đơn hàng hoặc gói dịch vụ (thuộc ODM, BUM). PPM chỉ nhận yêu cầu thanh toán liên quan đến các thực thể này.  
* Quản lý tồn kho, vận chuyển, sản phẩm, khách hàng, nhân sự, tài chính (trừ dữ liệu đầu vào cho FAM).

## **3\. Vai trò và Trách nhiệm Chính**

Bounded Context PPM chịu trách nhiệm quản lý các khía cạnh liên quan đến xử lý thanh toán. Các trách nhiệm chính bao gồm:

* **Xử lý Giao dịch Thanh toán:** Tiếp nhận yêu cầu thanh toán từ các BC khác, tương tác với cổng thanh toán bên ngoài để thực hiện giao dịch.  
* **Quản lý Trạng thái Giao dịch:** Theo dõi và cập nhật trạng thái của từng giao dịch thanh toán (ví dụ: Pending, Successful, Failed, Refunded).  
* **Xử lý Hoàn tiền:** Tiếp nhận yêu cầu hoàn tiền, tương tác với cổng thanh toán để thực hiện hoàn tiền.  
* **Quản lý Cấu hình Cổng Thanh toán:** Lưu trữ thông tin cấu hình và API Key cho các cổng thanh toán khác nhau được sử dụng bởi các tổ chức khách hàng.  
* **Chọn Cổng Thanh toán Phù hợp:** Dựa trên loại giao dịch, phương thức thanh toán và cấu hình của tổ chức, chọn cổng thanh toán phù hợp để xử lý giao dịch.  
* **Xử lý Webhook/Thông báo từ Cổng Thanh toán:** Tiếp nhận và xử lý các thông báo tự động từ cổng thanh toán về trạng thái giao dịch.  
* **Ghi nhận Lịch sử Giao dịch:** Lưu trữ bản ghi chi tiết của từng giao dịch thanh toán và hoàn tiền.  
* **Phát Sự kiện Nghiệp vụ:** Phát ra các Sự kiện Nghiệp vụ quan trọng khi trạng thái giao dịch thanh toán/hoàn tiền thay đổi.

## **4\. Mô hình Domain (Chi tiết hơn)**

Trong phạm vi Bounded Context PPM, chúng ta xác định các Aggregate Root, Entity và Value Object cốt lõi với các thuộc tính chính:

**Aggregate Roots:**

* **PaymentTransaction:** Là Aggregate Root trung tâm, đại diện cho một giao dịch thanh toán hoặc hoàn tiền cụ thể. PaymentTransaction quản lý tất cả thông tin liên quan đến giao dịch, bao gồm các lần thử thanh toán và trạng thái cuối cùng.  
  * **ID:** Unique identifier (UUID).  
  * **TenantId:** ID của tổ chức sở hữu giao dịch (liên kết với IAM).  
  * **TransactionType:** Loại giao dịch (TransactionType Value Object: Payment, Refund).  
  * **Amount:** Số tiền giao dịch (Money Value Object).  
  * **Currency:** Loại tiền tệ (liên kết với RDM).  
  * **PaymentMethodDetails:** Chi tiết phương thức thanh toán (PaymentMethodDetails Value Object \- không lưu thông tin nhạy cảm, chỉ loại, token, v.v.).  
  * **Status:** Trạng thái giao dịch (TransactionStatus Value Object: Pending, Successful, Failed, Refunded, Partially Refunded, Cancelled).  
  * **InitiatedByUserId:** **Optional** ID người dùng đã khởi tạo giao dịch (liên kết với IAM).  
  * **SourceBoundedContext:** BC đã yêu cầu giao dịch (ví dụ: "ODM", "BUM", "SFM").  
  * **SourceTransactionId:** ID giao dịch gốc trong BC nguồn (ví dụ: Order ID, Billing Transaction ID, Shipment ID).  
  * **PaymentGatewayId:** ID của cổng thanh toán được sử dụng (liên kết với PaymentGatewayConfiguration Aggregate).  
  * **GatewayTransactionId:** ID giao dịch trong hệ thống của cổng thanh toán.  
  * **Attempts:** Danh sách các PaymentAttempt Entities.  
  * **Refunds:** Danh sách các Refund Entities (nếu TransactionType là Payment).  
  * **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**  
  * **UpdatedAt:** Thời điểm cập nhật cuối cùng. **Lưu trữ ở múi giờ UTC.**  
  * *Behavior:* RecordAttempt, UpdateStatus, RecordRefund, ProcessRefundResult.  
* **PaymentGatewayConfiguration:** Là Aggregate Root định nghĩa thông tin cấu hình cho một cổng thanh toán được sử dụng bởi một tổ chức.  
  * **ID:** Unique identifier (UUID).  
  * **TenantId:** ID của tổ chức sử dụng cấu hình này.  
  * **GatewayType:** Loại cổng thanh toán (GatewayType Value Object: Stripe, PayPal, VNPay, Momo \- liên kết với RDM).  
  * **Name:** Tên cấu hình (ví dụ: "Cổng thanh toán chính").  
  * **ConfigurationDetails:** Chi tiết cấu hình (Map\<String, String\> hoặc Value Object phức tạp \- chứa API Key, Secret, Endpoint, v.v. \- **Lưu trữ an toàn**).  
  * **SupportedPaymentMethods:** Danh sách các loại phương thức thanh toán được hỗ trợ bởi cấu hình này.  
  * **IsActive:** Trạng thái hoạt động.  
  * **IsDefault:** Boolean chỉ định có phải cấu hình mặc định không.  
  * **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**  
  * **UpdatedAt:** Thời điểm cập nhật cuối cùng. **Lưu trữ ở múi giờ UTC.**  
  * *Behavior:* Activate, Deactivate, UpdateConfiguration, SetAsDefault.

**Entities (thuộc về các Aggregate Root):**

* **PaymentAttempt (thuộc PaymentTransaction):** Đại diện cho một lần thử thực hiện giao dịch thanh toán với cổng thanh toán.  
  * **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root PaymentTransaction.  
  * **AttemptDate:** Thời điểm thử. **Lưu trữ ở múi giờ UTC.**  
  * **Status:** Trạng thái lần thử (AttemptStatus Value Object: Initiated, Success, Failure, Error).  
  * **GatewayResponse:** Dữ liệu phản hồi từ cổng thanh toán (có thể là JSON hoặc String).  
  * **FailureReason:** **Optional** Lý do thất bại (String).  
  * **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**  
* **Refund (thuộc PaymentTransaction):** Đại diện cho một yêu cầu hoàn tiền liên quan đến giao dịch thanh toán gốc.  
  * **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root PaymentTransaction.  
  * **RefundAmount:** Số tiền hoàn (Money Value Object).  
  * **Status:** Trạng thái hoàn tiền (RefundStatus Value Object: Pending, Successful, Failed).  
  * **InitiatedByUserId:** **Optional** ID người dùng đã yêu cầu hoàn tiền.  
  * **RefundDate:** **Optional** Ngày hoàn tiền thành công. **Lưu trữ ở múi giờ UTC.**  
  * **GatewayRefundId:** ID hoàn tiền trong hệ thống của cổng thanh toán.  
  * **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**  
  * *Behavior:* UpdateStatus.

**Value Objects:**

* **Money:** Giá trị tiền tệ (Amount, Currency).  
* **TransactionType:** Loại giao dịch (Payment, Refund).  
* **TransactionStatus:** Trạng thái giao dịch (Pending, Successful, Failed, Refunded, Partially Refunded, Cancelled).  
* **AttemptStatus:** Trạng thái lần thử (Initiated, Success, Failure, Error).  
* **RefundStatus:** Trạng thái hoàn tiền (Pending, Successful, Failed).  
* **PaymentMethodDetails:** Chi tiết phương thức thanh toán (Type, Token, Last4Digits, ExpiryDate, CardBrand \- không lưu số đầy đủ).  
* **PaymentMethodType:** Loại phương thức thanh toán (CreditCard, BankTransfer, EWallet, CashOnDelivery).  
* **GatewayType:** Loại cổng thanh toán (Stripe, PayPal, VNPay, Momo).  
* **LocalizedText:** Giá trị văn bản đa ngôn ngữ (sử dụng Translation Key).

## **5\. Ngôn ngữ Chung (Ubiquitous Language)**

Trong Bounded Context PPM, các thuật ngữ sau đây có ý nghĩa cụ thể và nhất quán:

* **Payment Transaction:** Một bản ghi về giao dịch thanh toán hoặc hoàn tiền.  
* **Payment Gateway:** Dịch vụ bên ngoài xử lý giao dịch thanh toán thực tế.  
* **Payment Method:** Cách thức thanh toán (thẻ tín dụng, chuyển khoản ngân hàng, ví điện tử).  
* **Transaction Status:** Trạng thái hiện tại của Payment Transaction.  
* **Pending:** Trạng thái chờ xử lý.  
* **Successful:** Trạng thái giao dịch thành công.  
* **Failed:** Trạng thái giao dịch thất bại.  
* **Refunded:** Trạng thái giao dịch đã được hoàn tiền.  
* **Partial Refund:** Hoàn một phần số tiền giao dịch.  
* **Payment Attempt:** Một lần thử thực hiện giao dịch với cổng thanh toán.  
* **Refund:** Yêu cầu hoặc giao dịch hoàn tiền.  
* **Webhook:** Thông báo tự động từ Payment Gateway đến hệ thống Ecoma.  
* **Gateway Configuration:** Cài đặt để kết nối với một Payment Gateway cụ thể.  
* **Tokenization:** Quy trình thay thế thông tin thanh toán nhạy cảm bằng một mã định danh (token).

## **6\. Các Khía cạnh Quan trọng của Miền PPM**

Phần này mô tả các cấu trúc, quy tắc và khái niệm nghiệp vụ quan trọng chi phối hoạt động của Bounded Context PPM.

### **6.1. Tích hợp với Cổng Thanh toán Bên ngoài**

PPM là lớp trừu tượng hóa việc tích hợp với các cổng thanh toán khác nhau. Logic tương tác với API của từng cổng thanh toán cụ thể nằm trong PPM (có thể là các Adapter hoặc Service riêng cho từng cổng). PPM cung cấp một giao diện thống nhất cho các BC khác yêu cầu xử lý thanh toán, không để lộ chi tiết về cổng thanh toán đang được sử dụng.

### **6.2. Quản lý Cấu hình Cổng Thanh toán theo Tổ chức**

Mỗi tổ chức khách hàng có thể có cấu hình riêng cho một hoặc nhiều cổng thanh toán thông qua PaymentGatewayConfiguration Aggregate Root. PPM cần quản lý các cấu hình này một cách an toàn (đặc biệt là API Key/Secret) và chọn cấu hình phù hợp dựa trên Tenant và loại giao dịch/phương thức thanh toán.

### **6.3. Xử lý Vòng đời Giao dịch Thanh toán**

PPM quản lý vòng đời của PaymentTransaction, từ khi được yêu cầu (Pending), qua các lần thử (PaymentAttempt), đến trạng thái cuối cùng (Successful, Failed, Cancelled). Trạng thái của PaymentTransaction được cập nhật dựa trên kết quả từ cổng thanh toán.

### **6.4. Xử lý Hoàn tiền (Refunds)**

PPM xử lý yêu cầu hoàn tiền bằng cách tạo một Refund Entity (liên kết với PaymentTransaction gốc nếu là hoàn tiền giao dịch Payment) và tương tác với cổng thanh toán để thực hiện hoàn tiền. Trạng thái của Refund và trạng thái tổng thể của PaymentTransaction gốc được cập nhật dựa trên kết quả từ cổng thanh toán.

### **6.5. Xử lý Webhook và Thông báo từ Cổng Thanh toán**

Các cổng thanh toán thường gửi thông báo (webhook) về trạng thái giao dịch (ví dụ: giao dịch thành công, hoàn tiền thành công) một cách bất đồng bộ. PPM cần có endpoint để nhận các webhook này, xác minh tính hợp lệ của chúng, và xử lý các cập nhật trạng thái tương ứng cho PaymentTransaction trong hệ thống.

### **6.6. Ghi nhận Lịch sử Giao dịch và Lần thử**

PPM lưu trữ bản ghi chi tiết cho mỗi PaymentTransaction và từng PaymentAttempt. Lịch sử này là cần thiết cho mục đích kiểm toán, gỡ lỗi và hỗ trợ khách hàng.

### **6.7. Phát Sự kiện về Kết quả Giao dịch**

Sau khi xử lý một giao dịch (thanh toán hoặc hoàn tiền) và nhận được kết quả cuối cùng từ cổng thanh toán, PPM phát ra các Domain Event (ví dụ: PaymentSuccessfulEvent, PaymentFailedEvent, RefundProcessedEvent, RefundFailedEvent) để thông báo cho các BC khác đã yêu cầu giao dịch đó (ODM, BUM, SFM, MPM) và các BC quan tâm khác (FAM, CRM).

## **7\. Tương tác với các Bounded Context khác**

PPM tương tác với các Bounded Context khác để nhận yêu cầu xử lý thanh toán/hoàn tiền và thông báo kết quả.

* **Tương tác với Core BCs:**  
  * **IAM:** PPM cần IAM (Request/Reply) để xác thực và ủy quyền cho người dùng quản lý cấu hình cổng thanh toán hoặc xem lịch sử giao dịch. PPM lấy thông tin Tenant ID và User ID từ ngữ cảnh phiên làm việc.  
  * **LZM & RDM:** PPM cần LZM (Request/Reply) để quản lý và hiển thị metadata đa ngôn ngữ (tên loại phương thức thanh toán, loại cổng thanh toán, trạng thái giao dịch). PPM cần RDM (Request/Reply) để lấy dữ liệu tham chiếu (ví dụ: danh sách loại tiền tệ, loại cổng thanh toán được hỗ trợ, loại phương thức thanh toán).  
  * **ALM:** PPM phát ra các sự kiện audit log (Event) khi có các hành động quan trọng liên quan đến xử lý thanh toán (ví dụ: yêu cầu giao dịch, ghi nhận kết quả từ gateway, cập nhật trạng thái giao dịch, thêm/cập nhật cấu hình cổng thanh toán).  
  * **NDM:** PPM có thể yêu cầu NDM gửi thông báo cho khách hàng về trạng thái giao dịch (ví dụ: thanh toán thành công, thanh toán thất bại). Yêu cầu này bao gồm thông tin Customer ID (từ BC nguồn như ODM/BUM) và ngữ cảnh giao dịch để NDM xử lý.  
* **Tương tác với Feature BCs (Chủ yếu là Consumed Events và Published Events):**  
  * **ODM:** ODM gửi Command (ProcessPaymentCommand, RequestRefundCommand) hoặc phát Event (PaymentProcessingRequestedEvent, RefundRequestedEvent) mà PPM lắng nghe để xử lý thanh toán/hoàn tiền cho đơn hàng. PPM phát Event (PaymentSuccessfulEvent, PaymentFailedEvent, RefundProcessedEvent, RefundFailedEvent) chứa RelatedOrderId để ODM lắng nghe và cập nhật trạng thái đơn hàng. ODM gọi PPM (Request/Reply Query) để lấy thông tin chi tiết giao dịch thanh toán liên quan đến đơn hàng.  
  * **BUM:** BUM gửi Command (ProcessPaymentCommand, RequestRefundCommand) hoặc phát Event (PaymentProcessingRequestedEvent, RefundRequestedEvent) mà PPM lắng nghe để xử lý thanh toán/hoàn tiền cho gói dịch vụ hoặc usage. PPM phát Event (PaymentSuccessfulEvent, PaymentFailedEvent, RefundProcessedEvent, RefundFailedEvent) chứa RelatedBillingTransactionId hoặc RelatedSubscriptionId để BUM lắng nghe và cập nhật trạng thái giao dịch/gói dịch vụ. BUM gọi PPM (Request/Reply Query) để lấy thông tin chi tiết giao dịch thanh toán liên quan đến gói dịch vụ.  
  * **SFM:** SFM gửi Command (ProcessPaymentCommand) hoặc phát Event (PaymentProcessingRequestedEvent) mà PPM lắng nghe để xử lý thanh toán chi phí vận chuyển cho đơn vị vận chuyển. PPM phát Event (PaymentSuccessfulEvent, PaymentFailedEvent) chứa RelatedShipmentId để SFM lắng nghe và cập nhật trạng thái thanh toán chi phí vận chuyển.  
  * **MPM:** MPM có thể gửi Command (ProcessPaymentCommand) hoặc phát Event (PaymentProcessingRequestedEvent) mà PPM lắng nghe nếu có các giao dịch thanh toán liên quan đến hoạt động marketing (ví dụ: thanh toán cho quảng cáo). PPM phát Event (PaymentSuccessfulEvent, PaymentFailedEvent).  
  * **FAM:** PPM phát Event (PaymentSuccessfulEvent, PaymentFailedEvent, RefundProcessedEvent, RefundFailedEvent) chứa dữ liệu tài chính (số tiền, loại giao dịch) để FAM lắng nghe và ghi nhận bút toán kế toán.

## **8\. Use cases**

Dưới đây là mô tả các use case chính có sự tham gia của PPM, được tổ chức theo các nhóm chức năng chính, tập trung vào actor, mục đích và các Domain/Application Service liên quan.

### **8.1. Use Cases liên quan đến Xử lý Giao dịch Thanh toán**

Nhóm này bao gồm việc nhận yêu cầu và thực hiện giao dịch thanh toán thực tế.

* **Use case: Xử lý Yêu cầu Thanh toán:**  
  * **Actor:** Hệ thống (từ ODM, BUM, SFM, MPM).  
  * **Mục đích:** Tiếp nhận yêu cầu thanh toán, tạo bản ghi giao dịch, chọn cổng thanh toán phù hợp và gửi yêu cầu đến cổng thanh toán.  
  * **Service liên quan:** Được xử lý bởi PaymentApplicationService (Event Handler cho PaymentProcessingRequestedEvent hoặc Command Handler cho ProcessPaymentCommand). Sử dụng PaymentService để tạo PaymentTransaction, chọn cổng thanh toán (gọi PaymentMethodService/PaymentGatewayConfiguration Repository), và gọi PaymentGatewayService để tương tác với cổng thanh toán bên ngoài. Sử dụng PaymentTransaction Repository, PaymentGatewayConfiguration Repository. Phát sự kiện PaymentTransactionCreated, audit log cho ALM.  
* **Use case: Xử lý Thông báo Kết quả Thanh toán từ Cổng Thanh toán:**  
  * **Actor:** Hệ thống (từ cổng thanh toán qua webhook).  
  * **Mục đích:** Cập nhật trạng thái PaymentTransaction dựa trên thông báo từ cổng thanh toán (thường là trạng thái cuối cùng như Successful hoặc Failed).  
  * **Service liên quan:** Được xử lý bởi PaymentGatewayNotificationService (Endpoint nhận webhook). Service này xác minh webhook và gọi PaymentService để lấy PaymentTransaction và cập nhật trạng thái. Sử dụng PaymentTransaction Repository. Phát sự kiện PaymentSuccessfulEvent hoặc PaymentFailedEvent, audit log cho ALM. Phát sự kiện cho BC nguồn (ODM, BUM, SFM, MPM), FAM, CRM, NDM.

### **8.2. Use Cases liên quan đến Xử lý Hoàn tiền**

Nhóm này bao gồm việc nhận yêu cầu và thực hiện hoàn tiền.

* **Use case: Xử lý Yêu cầu Hoàn tiền:**  
  * **Actor:** Hệ thống (từ ODM, BUM), Người dùng (nhân viên quản lý đơn hàng/gói dịch vụ).  
  * **Mục đích:** Tiếp nhận yêu cầu hoàn tiền cho một giao dịch thanh toán gốc, tạo bản ghi hoàn tiền và gửi yêu cầu đến cổng thanh toán.  
  * **Service liên quan:** Được xử lý bởi PaymentApplicationService (Event Handler cho RefundRequestedEvent hoặc Command Handler cho RequestRefundCommand). Sử dụng RefundService để tạo Refund Entity (liên kết với PaymentTransaction gốc), và gọi PaymentGatewayService để tương tác với cổng thanh toán bên ngoài. Sử dụng PaymentTransaction Repository. Phát sự kiện RefundRequested, audit log cho ALM.  
* **Use case: Xử lý Thông báo Kết quả Hoàn tiền từ Cổng Thanh toán:**  
  * **Actor:** Hệ thống (từ cổng thanh toán qua webhook).  
  * **Mục đích:** Cập nhật trạng thái Refund và PaymentTransaction gốc dựa trên thông báo từ cổng thanh toán (thường là trạng thái cuối cùng như Successful hoặc Failed).  
  * **Service liên quan:** Được xử lý bởi PaymentGatewayNotificationService (Endpoint nhận webhook). Service này xác minh webhook và gọi RefundService để lấy Refund và cập nhật trạng thái. Cập nhật trạng thái PaymentTransaction gốc (ví dụ: thành Refunded hoặc Partially Refunded). Sử dụng PaymentTransaction Repository. Phát sự kiện RefundProcessedEvent hoặc RefundFailedEvent, audit log cho ALM. Phát sự kiện cho BC nguồn (ODM, BUM), FAM, CRM, NDM.

### **8.3. Use Cases liên quan đến Quản lý Cổng Thanh toán**

Nhóm này bao gồm việc thiết lập và quản lý các cổng thanh toán tích hợp cho từng tổ chức.

* **Use case: Thêm Cấu hình Cổng Thanh toán Mới:**  
  * **Actor:** Người dùng (quản lý hệ thống/tài chính của tổ chức).  
  * **Mục đích:** Thêm thông tin cấu hình để kết nối với một cổng thanh toán mới cho tổ chức.  
  * **Service liên quan:** Được xử lý bởi PaymentMethodApplicationService (Command Handler cho AddPaymentGatewayConfigurationCommand). Sử dụng PaymentMethodService để tạo PaymentGatewayConfiguration Aggregate Root. Sử dụng PaymentGatewayConfiguration Repository. Phát sự kiện PaymentGatewayConfigurationAdded, audit log cho ALM.  
* **Use case: Cập nhật Cấu hình Cổng Thanh toán:**  
  * **Actor:** Người dùng (quản lý hệ thống/tài chính của tổ chức).  
  * **Mục đích:** Chỉnh sửa thông tin cấu hình hoặc trạng thái (Active/Inactive) của cổng thanh toán.  
  * **Service liên quan:** Được xử lý bởi PaymentMethodApplicationService (Command Handler cho UpdatePaymentGatewayConfigurationCommand). Sử dụng PaymentMethodService để lấy và cập nhật PaymentGatewayConfiguration Aggregate Root. Sử dụng PaymentGatewayConfiguration Repository. Phát sự kiện PaymentGatewayConfigurationUpdated, audit log cho ALM.

### **8.4. Use Cases liên quan đến Truy vấn Giao dịch**

Nhóm này cho phép người dùng hoặc các BC khác truy xuất thông tin về các giao dịch thanh toán.

* **Use case: Xem Chi tiết Giao dịch Thanh toán:**  
  * **Actor:** Người dùng (quản lý đơn hàng/gói dịch vụ/tài chính), Hệ thống (từ BC nguồn).  
  * **Mục đích:** Xem tất cả thông tin chi tiết về một giao dịch thanh toán cụ thể, bao gồm các lần thử và thông tin hoàn tiền liên quan.  
  * **Service liên quan:** Được xử lý bởi PaymentQueryApplicationService (Query Handler cho GetPaymentTransactionDetailsQuery). Sử dụng PaymentQueryService để lấy PaymentTransaction Aggregate Root. Sử dụng PaymentTransaction Repository. Gọi LZM Service để lấy bản dịch.  
* **Use case: Tìm kiếm Giao dịch Thanh toán:**  
  * **Actor:** Người dùng (quản lý đơn hàng/gói dịch vụ/tài chính).  
  * **Mục đích:** Tìm kiếm các giao dịch thanh toán dựa trên các tiêu chí (ví dụ: trạng thái, số tiền, ngày, BC nguồn, ID giao dịch gốc).  
  * **Service liên quan:** Được xử lý bởi PaymentQueryApplicationService (Query Handler cho SearchPaymentTransactionsQuery). Sử dụng PaymentQueryService để truy vấn PaymentTransaction Repository. Sử dụng PaymentTransaction Repository. Gọi LZM Service để lấy bản dịch.

## **9\. Domain Services**

Domain Services trong PPM chứa logic nghiệp vụ quan trọng không thuộc về một Aggregate Root cụ thể hoặc cần phối hợp nhiều Aggregate Root, đặc biệt là logic xử lý giao dịch với cổng thanh toán.

* **PaymentService:**  
  * **Trách nhiệm:** Quản lý vòng đời của PaymentTransaction Aggregate Root (tạo, cập nhật trạng thái, ghi nhận lần thử). Thực hiện logic nghiệp vụ khi nhận yêu cầu thanh toán: chọn cổng thanh toán phù hợp, gọi PaymentGatewayService để tương tác với cổng thanh toán, xử lý phản hồi và cập nhật trạng thái giao dịch. Phối hợp với PaymentTransaction Repository, PaymentGatewayConfiguration Repository (để lấy cấu hình), PaymentGatewayService.  
  * **Các phương thức tiềm năng:** CreatePaymentTransaction(tenantId, type, amount, currency, methodDetails, sourceBc, sourceTransactionId, initiatedByUserId), ProcessPayment(transactionId, tenantId), UpdateTransactionStatus(transactionId, tenantId, newStatus, details), RecordPaymentAttempt(transactionId, tenantId, attemptDetails).  
* **RefundService:**  
  * **Trách nhiệm:** Xử lý yêu cầu hoàn tiền. Tạo Refund Entity. Gọi PaymentGatewayService để tương tác với cổng thanh toán để thực hiện hoàn tiền. Xử lý phản hồi từ cổng thanh toán và cập nhật trạng thái Refund và PaymentTransaction gốc. Phối hợp với PaymentTransaction Repository, PaymentGatewayService.  
  * **Các phương thức tiềm năng:** RequestRefund(transactionId, tenantId, refundAmount, initiatedByUserId), ProcessRefundResult(refundId, tenantId, status, details).  
* **PaymentGatewayService:**  
  * **Trách nhiệm:** Trừu tượng hóa việc tương tác với các API của cổng thanh toán bên ngoài. Chứa logic gọi API cụ thể cho từng loại cổng thanh toán. Phối hợp với PaymentGatewayConfiguration Repository (để lấy thông tin cấu hình cần thiết cho việc gọi API).  
  * **Các phương thức tiềm năng:** ProcessPaymentWithGateway(transactionDetails, gatewayConfig), RequestRefundWithGateway(refundDetails, gatewayConfig), HandleGatewayWebhook(payload, gatewayType).  
* **PaymentMethodService:**  
  * **Trách nhiệm:** Quản lý vòng đời của PaymentGatewayConfiguration Aggregate Root. Phối hợp với PaymentGatewayConfiguration Repository, RDM Service (để kiểm tra loại cổng thanh toán, loại phương thức thanh toán).  
  * **Các phương thức tiềm năng:** AddPaymentGatewayConfiguration(tenantId, details), UpdatePaymentGatewayConfiguration(configId, tenantId, updates), ActivateConfiguration(configId, tenantId), DeactivateConfiguration(configId, tenantId), GetDefaultConfiguration(tenantId, transactionType).  
* **PaymentQueryService (Optional Domain Service):** Nếu logic truy vấn phức tạp (tìm kiếm giao dịch theo nhiều tiêu chí, báo cáo giao dịch), có thể tách ra.  
  * **Trách nhiệm:** Cung cấp các phương thức truy vấn dữ liệu từ PaymentTransaction, PaymentGatewayConfiguration. Phối hợp với PaymentTransaction Repository, PaymentGatewayConfiguration Repository, LZM Service.  
  * **Các phương thức tiềm năng:** GetPaymentTransactionDetails(transactionId, tenantId), SearchPaymentTransactions(criteria, tenantId), GetPaymentGatewayConfigurations(tenantId).

## **9\. Application Services**

Application Services trong PPM là lớp mỏng điều phối các hành động từ bên ngoài (ví dụ: từ API Gateway, Message Broker) đến Domain Model (Aggregate Roots, Domain Services). Chúng xử lý các tác vụ kỹ thuật như lắng nghe Event, xử lý Query, thực hiện ủy quyền, và gọi Domain Service.

* **PaymentApplicationService:**  
  * **Trách nhiệm:** Lắng nghe các Event yêu cầu thanh toán/hoàn tiền từ các BC khác (PaymentProcessingRequestedEvent, RefundRequestedEvent) hoặc xử lý Command tương ứng (ProcessPaymentCommand, RequestRefundCommand). Sử dụng PaymentService và RefundService. Sử dụng PaymentTransaction Repository. Thực hiện ủy quyền với IAM (nếu từ Command). Lắng nghe các event liên quan đến xóa Tenant từ BUM để kích hoạt xóa dữ liệu thanh toán của Tenant đó.  
  * **Các phương thức tiềm năng:** HandlePaymentProcessingRequestedEvent(event), HandleRefundRequestedEvent(event), HandleProcessPaymentCommand(command), HandleRequestRefundCommand(command), HandleTenantDataDeletionRequestedEvent(event).  
* **PaymentGatewayNotificationService:**  
  * **Trách nhiệm:** Cung cấp endpoint để nhận webhook từ các cổng thanh toán. Xác minh webhook và gọi PaymentService hoặc RefundService để xử lý cập nhật trạng thái. Sử dụng PaymentService, RefundService.  
  * **Các phương thức tiềm năng:** HandleGatewayWebhook(gatewayType, payload).  
* **PaymentMethodApplicationService:**  
  * **Trách nhiệm:** Xử lý các command liên quan đến quản lý cấu hình cổng thanh toán từ API (ví dụ: AddPaymentGatewayConfigurationCommand, UpdatePaymentGatewayConfigurationCommand). Sử dụng PaymentMethodService và PaymentGatewayConfiguration Repository. Thực hiện ủy quyền với IAM.  
  * **Các phương thức tiềm năng:** HandleAddPaymentGatewayConfigurationCommand(command), HandleUpdatePaymentGatewayConfigurationCommand(command).  
* **PaymentQueryApplicationService:**  
  * **Trách nhiệm:** Xử lý các query để lấy thông tin giao dịch thanh toán (ví dụ: GetPaymentTransactionDetailsQuery, SearchPaymentTransactionsQuery). Sử dụng PaymentQueryService hoặc các Domain Service khác. Thực hiện ủy quyền với IAM.  
  * **Các phương thức tiềm năng:** HandleGetPaymentTransactionDetailsQuery(query), HandleSearchPaymentTransactionsQuery(query).

## **10\. Domain Events**

Bounded Context PPM tương tác với các Bounded Context khác thông qua việc phát ra và lắng nghe các Domain Event. Dưới đây là danh sách các event mà PPM phát ra và lắng nghe, bao gồm payload dự kiến của chúng:

### **10.1. Domain Events (PPM Phát ra)**

PPM sẽ phát ra các Domain Event quan trọng để thông báo cho các Bounded Context khác về kết quả của các giao dịch thanh toán và hoàn tiền. Dưới đây là danh sách các event và payload dự kiến của chúng:

* **PaymentTransactionCreated**  
  * Phát ra khi một giao dịch thanh toán/hoàn tiền mới được tạo trong PPM.  
  * **Payload:**  
    * TransactionId (UUID)  
    * TenantId (UUID)  
    * TransactionType (String)  
    * Amount (Money Value Object)  
    * Status (String)  
    * SourceBoundedContext (String)  
    * SourceTransactionId (UUID, optional)  
    * CreatedAt (DateTime) **(ở múi giờ UTC)**  
    * IssuedAt (DateTime) **(ở múi giờ UTC)**  
* **PaymentSuccessfulEvent**  
  * Phát ra khi một giao dịch thanh toán thành công.  
  * **Payload:**  
    * PaymentTransactionId (UUID)  
    * TenantId (UUID)  
    * Amount (Money Value Object)  
    * PaymentDate (DateTime) **(ở múi giờ UTC)**  
    * SourceBoundedContext (String)  
    * SourceTransactionId (UUID, optional)  
    * RelatedOrderId (UUID, optional) \- Thêm ID của các thực thể liên quan trực tiếp  
    * RelatedBillingTransactionId (UUID, optional)  
    * RelatedShipmentId (UUID, optional)  
    * IssuedAt (DateTime) **(ở múi giờ UTC)**  
* **PaymentFailedEvent**  
  * Phát ra khi một giao dịch thanh toán thất bại.  
  * **Payload:**  
    * PaymentTransactionId (UUID)  
    * TenantId (UUID)  
    * Amount (Money Value Object)  
    * FailureDate (DateTime) **(ở múi giờ UTC)**  
    * FailureReason (String, optional)  
    * SourceBoundedContext (String)  
    * SourceTransactionId (UUID, optional)  
    * RelatedOrderId (UUID, optional)  
    * RelatedBillingTransactionId (UUID, optional)  
    * RelatedShipmentId (UUID, optional)  
    * IssuedAt (DateTime) **(ở múi giờ UTC)**  
* **RefundProcessedEvent**  
  * Phát ra khi một giao dịch hoàn tiền thành công.  
  * **Payload:**  
    * RefundId (UUID)  
    * PaymentTransactionId (UUID) \- Giao dịch gốc  
    * TenantId (UUID)  
    * RefundAmount (Money Value Object)  
    * RefundDate (DateTime) **(ở múi giờ UTC)**  
    * SourceBoundedContext (String) \- BC đã yêu cầu hoàn tiền  
    * SourceTransactionId (UUID, optional) \- ID yêu cầu hoàn tiền gốc trong BC nguồn  
    * RelatedOrderId (UUID, optional) \- Thêm ID của các thực thể liên quan trực tiếp  
    * RelatedBillingTransactionId (UUID, optional)  
    * RelatedShipmentId (UUID, optional)  
    * IssuedAt (DateTime) **(ở múi giờ UTC)**  
* **RefundFailedEvent**  
  * Phát ra khi một giao dịch hoàn tiền thất bại.  
  * **Payload:**  
    * RefundId (UUID)  
    * PaymentTransactionId (UUID) \- Giao dịch gốc  
    * TenantId (UUID)  
    * RefundAmount (Money Value Object)  
    * FailureDate (DateTime) **(ở múi giờ UTC)**  
    * FailureReason (String, optional)  
    * SourceBoundedContext (String)  
    * SourceTransactionId (UUID, optional)  
    * RelatedOrderId (UUID, optional)  
    * RelatedBillingTransactionId (UUID, optional)  
    * RelatedShipmentId (UUID, optional)  
    * IssuedAt (DateTime) **(ở múi giờ UTC)**  
* **PaymentGatewayConfigurationAdded**  
  * Phát ra khi cấu hình cổng thanh toán mới được thêm cho tổ chức.  
  * **Payload:**  
    * ConfigId (UUID)  
    * TenantId (UUID)  
    * GatewayType (String)  
    * Name (String)  
    * CreatedAt (DateTime) **(ở múi giờ UTC)**  
    * IssuedAt (DateTime) **(ở múi giờ UTC)**  
* **PaymentGatewayConfigurationUpdated**  
  * Phát ra khi cấu hình cổng thanh toán được cập nhật.  
  * **Payload:**  
    * ConfigId (UUID)  
    * TenantId (UUID)  
    * UpdatedFields (Object)  
    * UpdatedAt (DateTime) **(ở múi giờ UTC)**  
    * IssuedAt (DateTime) **(ở múi giờ UTC)**

### **10.2. Domain Events Được Xử lý (Consumed Domain Events)**

PPM lắng nghe và xử lý các Domain Event từ các Bounded Context khác khi các sự kiện đó yêu cầu PPM thực hiện một giao dịch thanh toán hoặc hoàn tiền. Dưới đây là danh sách các event dự kiến mà PPM lắng nghe và mục đích xử lý của chúng:

* **PaymentProcessingRequestedEvent** (Từ ODM, BUM, SFM, MPM) \- *Hoặc Command tương ứng*  
  * **Mục đích xử lý:** Khởi tạo quy trình xử lý giao dịch thanh toán.  
  * **Payload dự kiến:** (Thông tin cần thiết để tạo PaymentTransaction và xử lý, ví dụ:)  
    * TenantId (UUID)  
    * Amount (Money Value Object)  
    * PaymentMethodDetails (PaymentMethodDetails Value Object)  
    * SourceBoundedContext (String) \- BC yêu cầu  
    * SourceTransactionId (UUID) \- ID giao dịch gốc trong BC nguồn  
    * InitiatedByUserId (UUID, optional)  
    * IssuedAt (DateTime) **(ở múi giờ UTC)**  
* **RefundRequestedEvent** (Từ ODM, BUM) \- *Hoặc Command tương ứng*  
  * **Mục đích xử lý:** Khởi tạo quy trình xử lý hoàn tiền.  
  * **Payload dự kiến:** (Thông tin cần thiết để tạo Refund và xử lý, ví dụ:)  
    * TenantId (UUID)  
    * PaymentTransactionId (UUID) \- ID giao dịch gốc cần hoàn tiền  
    * RefundAmount (Money Value Object)  
    * SourceBoundedContext (String) \- BC yêu cầu  
    * SourceTransactionId (UUID, optional) \- ID yêu cầu hoàn tiền gốc trong BC nguồn  
    * InitiatedByUserId (UUID, optional)  
    * Reason (String, optional)  
    * IssuedAt (DateTime) **(ở mú múi giờ UTC)**  
* **TenantDataDeletionRequestedEvent** (Từ BUM)  
  * **Mục đích xử lý:** Kích hoạt quy trình xóa tất cả dữ liệu giao dịch thanh toán và hoàn tiền liên quan đến Tenant đã yêu cầu xóa dữ liệu.  
  * **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)  
    * TenantId (UUID)  
    * RequestedAt (DateTime) **(ở múi giờ UTC)**  
    * IssuedAt (DateTime) **(ở múi giờ UTC)**

*(Lưu ý: Danh sách các sự kiện được xử lý có thể được mở rộng tùy thuộc vào các quy trình nghiệp vụ cụ thể trong hệ thống Ecoma có yêu cầu xử lý thanh toán hoặc hoàn tiền.)*

## **11\. Ranh giới Nghiệp vụ**

Ranh giới của Bounded Context PPM được xác định bởi trách nhiệm quản lý và xử lý các giao dịch thanh toán và hoàn tiền, tích hợp với các cổng thanh toán bên ngoài và quản lý cấu hình tích hợp đó. PPM là nguồn sự thật về "giao dịch thanh toán/hoàn tiền nào đã xảy ra, với số tiền bao nhiêu, qua cổng nào, và trạng thái của nó là gì".

PPM không chịu trách nhiệm:

* **Xác thực danh tính người dùng:** Chỉ sử dụng dịch vụ của IAM.  
* **Quản lý quyền truy cập:** Chỉ sử dụng dịch vụ của IAM. IAM kiểm soát quyền của người dùng (quản lý cấu hình, xem giao dịch) trong PPM.  
* **Quản lý bản dịch metadata hoặc quy tắc định dạng locale:** Chỉ sử dụng dịch vụ của LZM và RDM.  
* **Ghi nhận audit logs:** Chỉ phát sự kiện cho ALM.  
* **Xử lý các giao dịch nghiệp vụ gốc:** PPM không xử lý việc tạo đơn hàng, quản lý gói dịch vụ, xử lý vận chuyển, v.v. Nó chỉ nhận yêu cầu thanh toán liên quan đến các giao dịch đó.  
* **Lưu trữ thông tin thanh toán nhạy cảm của khách hàng:** Thông tin thẻ tín dụng, số tài khoản ngân hàng, v.v. phải được xử lý bởi cổng thanh toán hoặc dịch vụ tokenization tuân thủ PCI DSS. PPM chỉ lưu trữ token hoặc ID giao dịch.  
* **Quản lý thông tin đơn hàng, gói dịch vụ, lô hàng:** Chỉ lưu trữ ID tham chiếu đến các thực thể này.  
* **Quản lý tài chính và kế toán:** Chỉ phát sự kiện chứa dữ liệu tài chính cho FAM ghi nhận.  
* **Quản lý các miền nghiệp vụ khác** như sản phẩm, tồn kho, khách hàng, nhân sự, đào tạo, quản lý công việc, marketing.  
* **Thiết kế giao diện người dùng cho trang thanh toán:** Trách nhiệm của các BC giao diện người dùng (ví dụ: OSM).  
* **Gửi thông báo thực tế:** Chỉ yêu cầu NDM gửi thông báo.

## **12\. Kết luận**

Bounded Context Payment Processing Management (PPM) là một thành phần cốt lõi quan trọng trong hệ thống Ecoma, đảm bảo quy trình xử lý thanh toán và hoàn tiền được thực hiện an toàn và hiệu quả. Bằng cách tập trung trách nhiệm quản lý giao dịch, tích hợp với cổng thanh toán và quản lý cấu hình tích hợp vào một Context duy nhất, PPM cung cấp một nền tảng đáng tin cậy để xử lý tất cả các luồng tiền tệ trong hệ thống. Việc thiết kế PPM với mô hình domain rõ ràng, các khía cạnh quan trọng của miền được làm rõ, tương tác được định nghĩa và các sự kiện nghiệp vụ phù hợp (bao gồm cả sự kiện lắng nghe) là nền tảng để xây dựng một hệ thống quản lý xử lý thanh toán mạnh mẽ và dễ mở rộng, có khả năng tích hợp với nhiều cổng thanh toán khác nhau.

Tài liệu này cung cấp cái nhìn tổng quan chi tiết về PPM, bao gồm mô hình domain, các khía aspects quan trọng của miền, tương tác, use cases, Domain Service, Application Service và Domain Event (phát ra và lắng nghe với payload dự kiến). Đây là nền tảng để chuyển sang giai đoạn thiết kế kỹ thuật chi tiết và triển khai Microservice PPM.