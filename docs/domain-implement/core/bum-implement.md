# **Tài liệu Thiết kế Triển khai: Bounded Context Billing & Usage Management (BUM)**

## **1\. Giới thiệu**

Tài liệu này mô tả chi tiết thiết kế triển khai cho Bounded Context Billing & Usage Management (BUM) trong hệ thống Ecoma. BUM là một Bounded Context cốt lõi, chịu trách nhiệm quản lý toàn bộ các khía cạnh liên quan đến thanh toán, gói dịch vụ (subscription) và quyền sử dụng (entitlement) của các tổ chức (tenant) trên nền tảng SaaS trả trước của Ecoma. Tài liệu này tập trung vào các khía cạnh kỹ thuật triển khai riêng cho BUM, bao gồm cấu trúc service, công nghệ sử dụng cụ thể trong BUM, lưu trữ dữ liệu, giao tiếp đặc thù của BUM, hạ tầng, và các yêu cầu phi chức năng liên quan đến triển khai.

Mục tiêu của tài liệu này là cung cấp hướng dẫn chi tiết cho đội ngũ kỹ thuật để xây dựng, triển khai và vận hành Microservice(s) hiện thực hóa Bounded Context BUM, đảm bảo tuân thủ các nguyên tắc kiến trúc tổng thể của Ecoma (Microservices, DDD, EDA, CQRS, Clean Architecture) và đạt được các mục tiêu hệ thống (Tính sẵn sàng cao, Khả năng mở rộng, Hiệu năng, Bảo mật).

## **2\. Bối cảnh Kiến trúc Tổng thể**

Hệ thống Ecoma được xây dựng trên nền tảng kiến trúc Microservices, phân rã theo Bounded Contexts của DDD. Giao tiếp giữa các service backend chủ yếu sử dụng Event-Driven Architecture (EDA) và Request/Reply. Bên trong mỗi service, mô hình CQRS và Clean Architecture được áp dụng bắt buộc.

BUM là một Core Bounded Context, đóng vai trò quan trọng trong việc quản lý vòng đời tài chính và quyền sử dụng của khách hàng theo mô hình trả trước. BUM tương tác chặt chẽ với IAM (để kiểm tra quyền dựa trên Entitlement), các Feature BC (để nhận Usage Data), NDM (để gửi thông báo), ALM (để ghi log), LZM/RDM (để bản địa hóa và dữ liệu tham chiếu), và **yêu cầu PPM xử lý các giao dịch thanh toán**.

## **3\. Mối quan hệ với Tài liệu Thiết kế Miền BUM**

Tài liệu này là phần tiếp theo của tài liệu **Thiết kế Miền BUM (bum.md)**. Trong khi tài liệu Thiết kế Miền tập trung vào việc định nghĩa các khái niệm nghiệp vụ cốt lõi, Aggregate Root, Entity, Value Object, Ngôn ngữ Chung, Use Cases, Domain Services, Application Services và Domain Events ở cấp độ logic và nghiệp vụ, tài liệu này đi sâu vào cách các định nghĩa đó được hiện thực hóa và triển khai về mặt kỹ thuật.

* **Domain Services và Application Services:** Vai trò và trách nhiệm của các loại service này đã được định nghĩa chi tiết trong tài liệu Thiết kế Miền BUM. Trong tài liệu triển khai này, chúng ta xem xét cách các service kỹ thuật (BUM Query Service, BUM Command Service, BUM Worker) sẽ chứa và tổ chức các Domain Services và Application Services tương ứng theo mô hình Clean Architecture và CQRS. Chi tiết về từng Domain Service hoặc Application Service cụ thể (tên, phương thức, logic) sẽ không được lặp lại ở đây mà được tham chiếu đến tài liệu Thiết kế Miền.  
* **Domain Events:** Các Domain Event mà BUM phát ra hoặc xử lý đã được xác định trong tài liệu Thiết kế Miền BUM, bao gồm mục đích và payload dự kiến. Tài liệu triển khai này mô tả cách các event đó được truyền tải vật lý trong hệ thống (sử dụng RabbitMQ) và cách các service lắng nghe/phát event. Chi tiết về từng loại Domain Event cụ thể sẽ không được lặp lại ở đây mà được tham chiếu đến tài liệu Thiết kế Miền.

## **4\. Đơn vị Triển khai (Deployment Units)**

Dựa trên mô hình CQRS bắt buộc và tính chất nghiệp vụ của BUM, chúng tôi đề xuất triển khai thành **ba** đơn vị triển khai riêng biệt:

1. **BUM Query Service:**  
   * **Trách nhiệm:** Xử lý tất cả các yêu cầu truy vấn (Queries) thông tin về Subscription, Pricing Plan, Billing Transaction, Invoice. Đặc biệt quan trọng là cung cấp API kiểm tra Entitlement/Usage Limit cho IAM.  
   * **Mô hình:** Read Model của CQRS. Chứa các Application Services và Domain Services liên quan đến truy vấn dữ liệu.  
   * **Yêu cầu phi chức năng:** Hiệu năng rất cao, độ trễ thấp. Tối ưu hóa cho volume truy vấn lớn.  
   * **Giao tiếp:** Nhận Query thông qua cơ chế Request/Reply (NATS). Truy vấn PostgreSQL và đọc cache Redis.  
2. **BUM Command Service:**  
   * **Trách nhiệm:** Xử lý các yêu cầu thay đổi trạng thái (Commands) liên quan đến quản lý Pricing Plan, Subscription, Billing Transaction, và Invoice. **Yêu cầu PPM xử lý các giao dịch thanh toán.**  
   * **Mô hình:** Write Model của CQRS. Chứa các Application Services và Domain Services liên quan đến quản lý dữ liệu.  
   * **Yêu cầu phi chức năng:** Đảm bảo tính toàn vẹn dữ liệu. Xử lý logic nghiệp vụ phức tạp (Pro-rata, kiểm tra quy tắc Add-on).  
   * **Giao tiếp:** Nhận Command thông qua Request/Reply (NATS). Ghi dữ liệu vào PostgreSQL. Phát Domain Events. **Gọi PPM (qua Command/Request-Reply hoặc phát Event) để yêu cầu xử lý thanh toán/hoàn tiền.**  
3. **BUM Worker:**  
   * **Trách nhiệm:** Xử lý Usage Events từ các Feature BC, chạy tác vụ định kỳ, và quản lý vòng đời Subscription theo lịch trình. **Lắng nghe kết quả thanh toán/hoàn tiền từ PPM qua Event.**  
   * **Mô hình:** Kết hợp Event Consumer, Scheduled Tasks, và Background Processor.  
   * **Yêu cầu phi chức năng:** Độ tin cậy cao cho việc xử lý event và các tác vụ quan trọng định kỳ.  
   * **Giao tiếp:** Lắng nghe Events từ RabbitMQ (**bao gồm cả Events từ PPM và Feature BCs**). **Gửi Commands nội bộ hoặc gọi internal API của BUM Command Service** khi cần thay đổi trạng thái (ví dụ: ghi nhận usage, chuyển trạng thái Subscription). Gọi NDM để gửi thông báo.

Cấu trúc thư mục trong Nx Monorepo sẽ tuân thủ mô hình đã định nghĩa, với các apps/services và apps/workers riêng biệt cho BUM Query, BUM Command và BUM Worker.

## **5\. Nền tảng Công nghệ Cụ thể cho BUM**

BUM sẽ sử dụng nền tảng công nghệ chung của hệ thống Ecoma, với lựa chọn cụ thể cho lưu trữ dữ liệu và caching:

* **Cơ sở dữ liệu Chính:** PostgreSQL (Sử dụng TypeORM) \- Phù hợp cho dữ liệu có cấu trúc quan hệ chặt chẽ và yêu cầu tính toàn vẹn dữ liệu cao như Pricing Plan, Subscription, Billing Transaction, Invoice, Usage Record (lưu trữ lịch sử), Entitlement.  
* **Cache/Tạm thời:** Redis \- Sử dụng cho caching dữ liệu thường xuyên được truy vấn trong BUM Query Service để giảm tải cho DB và cải thiện hiệu năng đọc, đặc biệt là:  
  * Thông tin Subscription chi tiết (bao gồm Entitlement, Usage Limit) cho các yêu cầu kiểm tra quyền lợi/hạn mức từ IAM.  
  * Thông tin Pricing Plan (phiên bản Active mới nhất).  
* **Tích hợp Thanh toán:** **Không tích hợp trực tiếp với Payment Gateway.** Thay vào đó, BUM Command Service sẽ **gọi dịch vụ của PPM** để xử lý các giao dịch thanh toán và hoàn tiền.

## **6\. Lưu trữ Dữ liệu (Data Storage)**

BUM sẽ sở hữu cơ sở dữ liệu riêng (PostgreSQL), tách biệt với các BC khác. Redis được sử dụng làm lớp cache hiệu năng cao.

### **6.1. Schema PostgreSQL (Write Model & Primary Read Model)**

Cần thiết kế schema cho PostgreSQL để lưu trữ các Aggregate Root và Entity chính của BUM. Schema này sẽ là nguồn sự thật cho dữ liệu BUM.

**Bảng pricing\_plans:**

* id UUID PRIMARY KEY  
* name VARCHAR(255) NOT NULL  
* description TEXT  
* base\_price\_amount DECIMAL NOT NULL  
* base\_price\_currency VARCHAR(10) NOT NULL  
* billing\_cycle\_value INTEGER NOT NULL  
* billing\_cycle\_unit VARCHAR(50) NOT NULL \-- Duration Unit Value Object  
* is\_active BOOLEAN NOT NULL DEFAULT TRUE  
* is\_free\_plan BOOLEAN NOT NULL DEFAULT FALSE  
* created\_at TIMESTAMP WITH TIME ZONE NOT NULL  
* updated\_at TIMESTAMP WITH TIME ZONE NOT NULL  
* version INTEGER NOT NULL DEFAULT 1  
* UNIQUE (name, version)

**Bảng pricing\_components:** (Thuộc pricing\_plans)

* id UUID PRIMARY KEY  
* pricing\_plan\_id UUID NOT NULL, FOREIGN KEY pricing\_plans(id) ON DELETE CASCADE  
* type VARCHAR(50) NOT NULL \-- PricingComponent Type Value Object ('Base', 'Resource', 'Feature')  
* resource\_type VARCHAR(100) \-- Optional, ResourceType Value Object  
* feature\_type VARCHAR(100) \-- Optional, FeatureType Value Object  
* usage\_limit\_value DECIMAL \-- Optional, UsageQuantity Value Object  
* usage\_limit\_unit VARCHAR(50) \-- Optional, UsageQuantity Value Object  
* price\_per\_unit\_amount DECIMAL \-- Optional, Money Value Object  
* price\_per\_unit\_currency VARCHAR(10) \-- Optional, Money Value Object  
* details JSONB \-- Flexible storage for other component details  
* created\_at TIMESTAMP WITH TIME ZONE NOT NULL

**Bảng subscriptions:**

* id UUID PRIMARY KEY  
* tenant\_id UUID NOT NULL \-- Liên kết với IAM  
* pricing\_plan\_id UUID NOT NULL, FOREIGN KEY pricing\_plans(id) ON DELETE RESTRICT \-- RESTRICT để không xóa PricingPlan khi còn Subscription sử dụng  
* pricing\_plan\_version INTEGER NOT NULL \-- Lưu phiên bản PricingPlan đang áp dụng  
* status VARCHAR(50) NOT NULL \-- SubscriptionStatus Value Object  
* start\_date TIMESTAMP WITH TIME ZONE NOT NULL  
* end\_date TIMESTAMP WITH TIME ZONE NOT NULL  
* next\_billing\_date TIMESTAMP WITH TIME ZONE \-- Optional  
* billing\_cycle\_value INTEGER NOT NULL  
* billing\_cycle\_unit VARCHAR(50) NOT NULL \-- Duration Unit Value Object  
* last\_successful\_payment\_date TIMESTAMP WITH TIME ZONE \-- Optional  
* suspended\_date TIMESTAMP WITH TIME ZONE \-- Optional  
* data\_retention\_end\_date TIMESTAMP WITH TIME ZONE \-- Optional  
* created\_at TIMESTAMP WITH TIME ZONE NOT NULL  
* updated\_at TIMESTAMP WITH TIME ZONE NOT NULL

**Bảng entitlements:** (Thuộc subscriptions)

* id UUID PRIMARY KEY  
* subscription\_id UUID NOT NULL, FOREIGN KEY subscriptions(id) ON DELETE CASCADE  
* type VARCHAR(50) NOT NULL \-- Entitlement Type (Feature, Resource)  
* feature\_type VARCHAR(100) \-- Optional  
* resource\_type VARCHAR(100) \-- Optional  
* limit\_value DECIMAL \-- Optional  
* limit\_unit VARCHAR(50) \-- Optional  
* is\_active BOOLEAN NOT NULL DEFAULT TRUE  
* created\_at TIMESTAMP WITH TIME ZONE NOT NULL

**Bảng usage\_records:** (Thuộc subscriptions, lưu trữ lịch sử usage theo chu kỳ)

* id UUID PRIMARY KEY  
* subscription\_id UUID NOT NULL, FOREIGN KEY subscriptions(id) ON DELETE CASCADE  
* resource\_type VARCHAR(100) NOT NULL \-- ResourceType Value Object  
* quantity\_value DECIMAL NOT NULL DEFAULT 0  
* quantity\_unit VARCHAR(50) NOT NULL  
* billing\_cycle\_start\_date TIMESTAMP WITH TIME ZONE NOT NULL  
* billing\_cycle\_end\_date TIMESTAMP WITH TIME ZONE NOT NULL  
* last\_updated TIMESTAMP WITH TIME ZONE NOT NULL  
* UNIQUE (subscription\_id, resource\_type, billing\_cycle\_start\_date) \-- Đảm bảo chỉ có một bản ghi usage cho mỗi tài nguyên trong mỗi chu kỳ của một Subscription

**Bảng billing\_transactions:**

* id UUID PRIMARY KEY  
* subscription\_id UUID NOT NULL, FOREIGN KEY subscriptions(id) ON DELETE RESTRICT  
* tenant\_id UUID NOT NULL  
* type VARCHAR(50) NOT NULL \-- Transaction Type ('Purchase', 'Renewal', 'AddOn')  
* amount\_amount DECIMAL NOT NULL  
* amount\_currency VARCHAR(10) NOT NULL  
* transaction\_date TIMESTAMP WITH TIME ZONE NOT NULL  
* status VARCHAR(50) NOT NULL \-- TransactionStatus Value Object  
* **ppm\_transaction\_id UUID** \-- **Tham chiếu đến ID giao dịch trong PPM**  
* invoice\_id UUID \-- Optional, FOREIGN KEY invoices(id) ON DELETE SET NULL  
* created\_at TIMESTAMP WITH TIME ZONE NOT NULL  
* updated\_at TIMESTAMP WITH TIME ZONE NOT NULL

**Bảng invoices:**

* id UUID PRIMARY KEY  
* tenant\_id UUID NOT NULL  
* invoice\_number VARCHAR(100) NOT NULL UNIQUE  
* issue\_date TIMESTAMP WITH TIME ZONE NOT NULL  
* invoice\_date TIMESTAMP WITH TIME ZONE NOT NULL  
* due\_date TIMESTAMP WITH TIME ZONE NOT NULL  
* total\_amount\_amount DECIMAL NOT NULL  
* total\_amount\_currency VARCHAR(10) NOT NULL  
* status VARCHAR(50) NOT NULL \-- Invoice Status  
* billing\_transaction\_id UUID NOT NULL, FOREIGN KEY billing\_transactions(id) ON DELETE RESTRICT \-- Mối quan hệ 1-1  
* created\_at TIMESTAMP WITH TIME ZONE NOT NULL  
* updated\_at TIMESTAMP WITH TIME ZONE NOT NULL

**Bảng invoice\_items:** (Thuộc invoices)

* id UUID PRIMARY KEY  
* invoice\_id UUID NOT NULL, FOREIGN KEY invoices(id) ON DELETE CASCADE  
* description TEXT NOT NULL  
* quantity DECIMAL NOT NULL  
* unit\_price\_amount DECIMAL NOT NULL  
* unit\_price\_currency VARCHAR(10) NOT NULL  
* line\_total\_amount DECIMAL NOT NULL  
* line\_total\_currency VARCHAR(10) NOT NULL  
* related\_resource\_id UUID \-- Optional

**Chỉ mục (Indexes):**

* CREATE UNIQUE INDEX idx\_pricing\_plans\_name\_version ON pricing\_plans (name, version);  
* CREATE INDEX idx\_subscriptions\_tenant ON subscriptions (tenant\_id);  
* CREATE INDEX idx\_subscriptions\_status ON subscriptions (status);  
* CREATE INDEX idx\_subscriptions\_end\_date ON subscriptions (end\_date);  
* CREATE INDEX idx\_usage\_records\_subscription\_resource\_cycle ON usage\_records (subscription\_id, resource\_type, billing\_cycle\_start\_date);  
* CREATE INDEX idx\_billing\_transactions\_tenant ON billing\_transactions (tenant\_id);  
* CREATE INDEX idx\_billing\_transactions\_subscription ON billing\_transactions (subscription\_id);  
* **CREATE UNIQUE INDEX idx\_billing\_transactions\_ppm ON billing\_transactions (ppm\_transaction\_id);** \-- Chỉ mục cho tham chiếu đến PPM  
* CREATE INDEX idx\_invoices\_tenant ON invoices (tenant\_id);  
* CREATE UNIQUE INDEX idx\_invoices\_invoice\_number ON invoices (invoice\_number);  
* CREATE UNIQUE INDEX idx\_invoices\_billing\_transaction ON invoices (billing\_transaction\_id);

### **6.2. Cấu trúc Cache Redis (Read Model Cache)**

Redis sẽ được sử dụng làm lớp cache cho BUM Query Service để lưu trữ các dữ liệu thường xuyên được truy vấn và yêu cầu hiệu năng cao, đặc biệt cho các yêu cầu kiểm tra Entitlement/Usage Limit từ IAM. Chiến lược cache là "Cache-Aside" kết hợp với invalidation dựa trên Domain Events từ BUM Command Service và BUM Worker.

**Chiến lược Key:**

Sử dụng cấu trúc key rõ ràng để dễ dàng quản lý và invalidation.

* **Cache thông tin Subscription chi tiết (bao gồm Entitlement, Usage Limit) theo Tenant ID:** bum:subscription:tenant:\<tenant\_id\>  
* **Cache thông tin Pricing Plan theo ID:** bum:pricing\_plan:id:\<pricing\_plan\_id\>  
* **Cache thông tin Pricing Plan theo Name (lấy version mới nhất Active):** bum:pricing\_plan:name:\<pricing\_plan\_name\>:latest\_active

**Chiến lược Value:**

Lưu trữ dữ liệu dưới dạng JSON string. Đối với cache Subscription chi tiết, cần bao gồm tất cả thông tin cần thiết cho Entitlement Check (Pricing Plan Version, Status, Billing Cycle Period, Entitlements, Usage Records hiện tại).

**Chiến lược Cache Invalidation:**

Khi có bất kỳ thay đổi nào đối với dữ liệu trong BUM Command Service hoặc BUM Worker:

* **Từ BUM Command Service (phát Event):**  
  * SubscriptionActivated, SubscriptionRenewed, SubscriptionPlanChanged, SubscriptionSuspended: Invalidate cache key Subscription chi tiết cho Tenant liên quan (bum:subscription:tenant:\<tenant\_id\>).  
  * PricingPlanCreated, PricingPlanUpdated: Invalidate cache key Pricing Plan theo ID (bum:pricing\_plan:id:\<pricing\_plan\_id\>) và theo Name (lấy version mới nhất Active) (bum:pricing\_plan:name:\<pricing\_plan\_name\>:latest\_active). Cần re-cache thông tin Pricing Plan mới nhất.  
* **Từ BUM Worker (xử lý Event Usage hoặc Event từ PPM):**  
  * Sau khi ghi nhận Usage Record thành công cho một Subscription: Invalidate cache key Subscription chi tiết cho Tenant liên quan (bum:subscription:tenant:\<tenant\_id\>) để cập nhật Usage mới nhất.  
  * Sau khi xử lý Event từ PPM (ví dụ: PaymentSuccessfulEvent) và cập nhật trạng thái Subscription/Billing Transaction: Invalidate cache key Subscription chi tiết cho Tenant liên quan (bum:subscription:tenant:\<tenant\_id\>).  
* TTL (Time To Live) cho các key cache cần được cấu hình phù hợp. Cache Subscription chi tiết có thể cần TTL ngắn hơn hoặc dựa vào thời gian kết thúc chu kỳ hiện tại. Cache Pricing Plan có thể có TTL dài hơn.

## **7\. Giao tiếp và Tích hợp**

BUM tương tác với nhiều BC khác và **PPM (để xử lý thanh toán)**.

* **Nhận Commands/Queries:**  
  * BUM Command Service và BUM Query Service nhận các yêu cầu thay đổi trạng thái (Commands) và yêu cầu truy vấn dữ liệu (Queries) thông qua cơ chế Request/Reply của hệ thống (sử dụng NATS). Các yêu cầu này có thể đến từ API Gateway (được gọi bởi Client/Admin UI) hoặc từ các service backend khác (đặc biệt là IAM).  
* **Phát Domain Events:**  
  * BUM Command Service và BUM Worker sẽ phát các Domain Event (ví dụ: SubscriptionActivated, UsageLimitExceeded, BillingTransactionSuccessful, TenantDataDeletionRequested, v.v.) đến hệ thống Message Broker (RabbitMQ) để các BC khác quan tâm có thể tiêu thụ.  
  * Chi tiết về các Domain Event được phát ra bởi BUM có thể tham khảo trong tài liệu Thiết kế Miền BUM.  
* **Lắng nghe Domain Events:**  
  * BUM Worker lắng nghe các Domain Event về Usage từ các Feature BC (ví dụ: OrderCompletedEvent, ProductCreatedEvent, AssetCreatedEvent).  
  * **BUM Worker lắng nghe các Event kết quả thanh toán/hoàn tiền từ PPM** (ví dụ: PaymentSuccessfulEvent, PaymentFailedEvent, RefundProcessedEvent, RefundFailedEvent) để cập nhật trạng thái giao dịch và Subscription.  
  * BUM Worker lắng nghe OrganizationCreatedEvent từ IAM để tạo Subscription Free.  
* **Tương tác với PPM:**  
  * **BUM Command Service sẽ gọi dịch vụ của PPM (qua Command/Request-Reply hoặc phát Event) để yêu cầu xử lý các giao dịch thanh toán và hoàn tiền.**  
  * **BUM Worker sẽ lắng nghe các Event kết quả từ PPM.**  
* **Tương tác với NDM:**  
  * BUM Worker hoặc BUM Command Service (sau khi thay đổi trạng thái Subscription quan trọng) sẽ gọi NDM (qua Request/Reply) để yêu cầu gửi các thông báo cho người dùng/tổ chức theo lịch trình đã định nghĩa.  
* **Tương tác với LZM & RDM:**  
  * BUM Query Service hoặc BUM Command Service sẽ gọi LZM (qua Request/Reply) để bản địa hóa các thông tin hiển thị.  
  * BUM Query Service hoặc BUM Command Service sẽ gọi RDM (qua Request/Reply) để lấy dữ liệu tham chiếu (tiền tệ, quốc gia, v.v.).  
* **Tương tác với ALM:**  
  * BUM Command Service và BUM Worker sẽ phát Event hoặc gọi API của ALM để ghi lại các hành động quan trọng (thay đổi trạng thái Subscription, giao dịch thanh toán, ghi nhận usage vượt hạn mức).

## **8\. Định nghĩa API Endpoint và Mapping Use Case**

Phần này phác thảo các API Endpoint chính mà BUM cung cấp thông qua API Gateway (đối với các tương tác từ bên ngoài hệ thống) và mapping chúng với các Use Case đã định nghĩa trong tài liệu Thiết kế Miền BUM. Các Endpoint này sẽ được API Gateway định tuyến đến BUM Query Service hoặc BUM Command Service tương ứng.

| API Endpoint (Ví dụ) | Phương thức HTTP | Mô tả Chức năng Cấp cao | Use Case Liên quan (bum.md) | Loại Yêu cầu Nội bộ (CQRS) | Service Xử lý |
| :---- | :---- | :---- | :---- | :---- | :---- |
| /api/v1/bum/pricing-plans | GET | Lấy danh sách các Pricing Plan (phiên bản Active mới nhất). | Quản lý Pricing Plans (8.4.1) | Query | BUM Query Service |
| /api/v1/bum/pricing-plans/{planId} | GET | Lấy chi tiết Pricing Plan theo ID (mặc định version Active mới nhất). | Quản lý Pricing Plans (8.4.1) | Query | BUM Query Service |
| /api/v1/bum/pricing-plans | POST | Tạo Pricing Plan mới (Admin). | Quản lý Pricing Plans (8.4.1) | Command | BUM Command Service |
| /api/v1/bum/pricing-plans/{planId} | PUT | Cập nhật Pricing Plan (tạo version mới) (Admin). | Quản lý Pricing Plans (8.4.1) | Command | BUM Command Service |
| /api/v1/bum/subscriptions/me | GET | Lấy chi tiết Subscription hiện tại của Tổ chức (bao gồm Entitlement, Usage). | Xem Chi tiết Subscription Hiện tại và Lịch sử (8.3.3), Kiểm tra Quyền lợi Tính năng (8.2.2) | Query | BUM Query Service |
| /api/v1/bum/subscriptions/me/history | GET | Lấy lịch sử thay đổi Subscription của Tổ chức. | Xem Chi tiết Subscription Hiện tại và Lịch sử (8.3.3) | Query | BUM Query Service |
| /api/v1/bum/subscriptions/me/purchase | POST | Khởi tạo quy trình mua gói mới hoặc nâng cấp gói. | Tổ chức Mua Gói Dịch vụ Trả phí Mới hoặc Nâng cấp gói (8.1.2) | Command | BUM Command Service |
| /api/v1/bum/subscriptions/me/add-on | POST | Khởi tạo quy trình mua thêm tài nguyên (Add-on). | Tổ chức Mua Gói Dịch vụ Trả phí Mới hoặc Nâng cấp gói (8.1.2) | Command | BUM Command Service |
| /api/v1/bum/billing/transactions | GET | Lấy danh sách giao dịch thanh toán của Tổ chức. | Xem Danh sách Giao dịch Thanh toán của Tổ chức (8.3.1) | Query | BUM Query Service |
| /api/v1/bum/billing/transactions/{transactionId} | GET | Lấy chi tiết giao dịch thanh toán. | Xem Chi tiết Giao dịch Thanh toán và Hóa đơn (8.3.2) | Query | BUM Query Service |
| /api/v1/bum/billing/invoices/{invoiceId} | GET | Lấy chi tiết hóa đơn. | Xem Chi tiết Giao dịch Thanh toán và Hóa đơn (8.3.2) | Query | BUM Query Service |
| /api/v1/bum/usage/me | GET | Lấy báo cáo sử dụng tài nguyên của Tổ chức trong chu kỳ hiện tại. | Xem Báo cáo Sử dụng Tài nguyên của Tổ chức (8.3.4) | Query | BUM Query Service |
| /api/v1/bum/usage/me/history | GET | Lấy báo cáo sử dụng tài nguyên của Tổ chức theo chu kỳ. | Xem Báo cáo Sử dụng Tài nguyên của Tổ chức (8.3.4) | Query | BUM Query Service |
| /api/v1/internal/bum/entitlement/check | POST | Kiểm tra quyền lợi/hạn mức sử dụng (dành cho BC nội bộ, gọi bởi IAM). | Kiểm tra Quyền lợi Tính năng (8.2.2), Ghi nhận Sử dụng Tài nguyên và Kiểm soát Hạn mức (8.2.1) | Query | BUM Query Service |
| **/api/v1/internal/bum/usage/ingest** | **POST** | **Ghi nhận usage từ Event (dành cho Worker lắng nghe Event Usage từ Feature BC).** | Ghi nhận Sử dụng Tài nguyên và Kiểm soát Hạn mức (8.2.1) | **Command** | **BUM Command Service** |
| /api/v1/internal/bum/subscription/{tenantId}/suspend | POST | Chuyển trạng thái Subscription sang Suspended (dành cho Worker). | Quản lý Vòng đời Subscription Sau Hết hạn (8.1.3) | Command | BUM Command Service |
| /api/v1/internal/bum/subscription/{tenantId}/request-deletion | POST | Kích hoạt yêu cầu xóa dữ liệu Tổ chức (dành cho Worker). | Quản lý Vòng đời Subscription Sau Hết hạn (8.1.3) | Command | BUM Command Service |

*Lưu ý: Đây là các endpoint ví dụ. Tên và cấu trúc cụ thể có thể được tinh chỉnh trong quá trình thiết kế kỹ thuật chi tiết. Các endpoint /api/v1/internal/... là các endpoint nội bộ, không được public ra ngoài qua API Gateway thông thường mà chỉ dùng cho giao tiếp giữa các service backend.*

## **9\. Chiến lược Xử lý Lỗi (Error Handling Strategy)**

Chiến lược xử lý lỗi trong BUM sẽ tuân thủ mô hình chung của Ecoma và phân biệt giữa các loại lỗi, kênh giao tiếp:

* **Lỗi Nghiệp vụ (Business Rule Exceptions):** Các lỗi phát sinh do vi phạm quy tắc nghiệp vụ (ví dụ: cố gắng mua Add-on khi gói chính còn dưới 7 ngày, gói không tồn tại, vượt quá hạn mức khi ghi nhận usage) sẽ được ném ra từ Domain Services và bắt ở lớp Application Service hoặc lớp xử lý Command/Event.  
  * **Đối với giao tiếp Request/Reply (qua NATS/API Gateway):** Lỗi nghiệp vụ sẽ được chuyển đổi thành phản hồi lỗi có cấu trúc (ví dụ: JSON object) bao gồm mã lỗi (error code) và thông báo lỗi chi tiết, được trả về cho bên gọi. Sử dụng HTTP status code 400 Bad Request cho các lỗi phía người dùng khi giao tiếp qua API Gateway. Phản hồi lỗi sẽ bao gồm một biến chỉ báo thành công/thất bại (ví dụ: success: false) cùng với thông tin lỗi chi tiết.  
  * **Đối với giao tiếp qua Message Broker (Events):** Lỗi nghiệp vụ xảy ra trong quá trình xử lý event (ví dụ: Worker nhận event cho tenant không tồn tại hoặc subscription không Active) sẽ được ghi log chi tiết và có thể phát ra một Domain Event thông báo về sự thất bại nếu cần thiết. Các event không xử lý được do lỗi nghiệp vụ có thể được chuyển vào DLQ nếu cần phân tích.  
* **Lỗi Kỹ thuật (Technical Errors):** Các lỗi phát sinh ở lớp Infrastructure (ví dụ: lỗi kết nối DB, lỗi kết nối Message Broker, lỗi cache Redis, lỗi gọi **PPM API**) sẽ được xử lý bằng cách sử dụng try-catch block.  
  * Các lỗi này cần được ghi log chi tiết (sử dụng Structured Logging theo kiến trúc chung) với mức độ phù hợp (ví dụ: ERROR), bao gồm stack trace và các thông tin tương quan (traceId, spanId).  
  * Đối với giao tiếp Request/Reply: Lỗi kỹ thuật sẽ được chuyển đổi thành phản hồi lỗi chung (ví dụ: HTTP status code 500 Internal Server Error) để tránh lộ thông tin nhạy cảm, nhưng vẫn ghi log chi tiết ở phía server.  
  * Đối với giao tiếp qua Message Broker: Lỗi kỹ thuật sẽ được xử lý theo cơ chế retry của RabbitMQ. Nếu retry vẫn thất bại, message sẽ được chuyển vào Dead Letter Queue (DLQ) để phân tích sau. Lỗi cũng cần được ghi log và có thể kích hoạt cảnh báo.  
  * Đối với tích hợp **với PPM**: Cần xử lý các lỗi cụ thể từ **PPM API** và chuyển đổi chúng thành lỗi nghiệp vụ hoặc lỗi kỹ thuật phù hợp.  
* **Lỗi Validate Input:** Đối với các yêu cầu nhận được qua API Endpoint (từ API Gateway), lỗi validate input sẽ được xử lý ở lớp Application Service hoặc Controller (trong NestJS) trước khi tạo Command/Query. Phản hồi lỗi sẽ sử dụng HTTP status code 400 Bad Request với thông báo lỗi chi tiết về các trường không hợp lệ.  
* **Thông báo Lỗi:** Các lỗi quan trọng (ví dụ: lỗi kết nối DB kéo dài, lỗi xử lý Command quan trọng, lỗi xử lý **Event từ PPM**, lỗi xử lý Event Usage, lỗi tác vụ định kỳ) cần kích hoạt cảnh báo thông qua hệ thống giám sát (Observability Stack).

## **10\. Khả năng Phục hồi (Resiliency)**

Để đảm bảo BUM chịu lỗi và phục hồi khi các phụ thuộc gặp sự cố:

* **Timeouts và Retries:** Cấu hình timeouts và retry policies cho các cuộc gọi đi đến các phụ thuộc (PostgreSQL, Redis, NATS, RabbitMQ, **PPM API**, NDM API, LZM API, RDM API, ALM API). Sử dụng các thư viện hỗ trợ retry với exponential backoff và jitter. Đặc biệt quan trọng với tích hợp **PPM** và gọi NDM.  
* **Circuit Breaker:** Áp dụng mẫu Circuit Breaker cho các cuộc gọi đến các phụ thuộc có khả năng gặp sự cố tạm thời (ví dụ: gọi **PPM API**, NDM API) để ngăn chặn các cuộc gọi liên tục gây quá tải cho phụ thuộc đó và cho chính service BUM.  
* **Bulkhead:** Cân nhắc sử dụng Bulkhead để cô lập tài nguyên giữa các loại tác vụ trong BUM Command Service (ví dụ: xử lý mua gói vs quản lý Pricing Plan) và giữa các loại tác vụ trong BUM Worker (xử lý Usage Events vs tác vụ định kỳ).  
* **Health Checks:** Triển khai các loại Health Check Probe trong Kubernetes cho mỗi service BUM:  
  * **Startup Probe:** Kiểm tra xem ứng dụng đã khởi động hoàn toàn (ví dụ: kết nối đến DB, Message Broker, Cache đã sẵn sàng).  
  * **Liveness probe:** Kiểm tra xem ứng dụng có đang chạy và khỏe mạnh không. Kiểm tra vòng lặp xử lý message/request/scheduled task.  
  * **Readiness probe:** Kiểm tra xem ứng dụng đã sẵn sàng xử lý request/message chưa. Kiểm tra kết nối đến **PostgreSQL** (nguồn dữ liệu chính), **Redis** (lớp cache quan trọng), và khả năng thực hiện các thao tác đọc/ghi/cache cơ bản. Đối với BUM Command Service, cần kiểm tra kết nối đến **PPM API** (nếu là phụ thuộc critical).  
* **Idempotency:** Thiết kế các Command Handlers và Event Handlers (đặc biệt là các handler lắng nghe sự kiện Usage và **Event từ PPM**) có tính Idempotent nếu có thể, để việc xử lý lặp lại do retry hoặc lỗi tạm thời không gây ra kết quả không mong muốn.

## **11\. Chiến lược Kiểm thử (Testing Strategy)**

Chiến lược kiểm thử cho BUM sẽ tuân thủ mô hình chung của Ecoma:

* **Unit Tests:** Kiểm thử logic nghiệp vụ cốt lõi trong Domain Model (ví dụ: tính toán Pro-rata trong BillingService, logic kiểm tra Entitlement trong SubscriptionService, logic vòng đời trạng thái Subscription) và logic xử lý trong Application Services một cách độc lập (sử dụng mock cho Repository, Gateway, Broker, **PPM client**).  
* **Integration Tests:** Kiểm thử sự tương tác giữa các thành phần nội bộ của từng service/worker (ví dụ: Application Service gọi Domain Service, Repository tương tác với cơ sở dữ liệu thực hoặc Testcontainers, Event Handler xử lý Event và gọi Domain Service).  
* **End-to-End Tests (E2E Tests):** Kiểm thử luồng nghiệp vụ hoàn chỉnh xuyên qua các service (ví dụ: đăng ký Organization mới trong IAM kích hoạt tạo Subscription Free trong BUM, mua gói trả phí qua API Gateway, **xử lý callback Payment Gateway trong PPM và BUM lắng nghe Event kết quả**, kiểm tra quyền từ một Feature BC gọi đến IAM/BUM Query Service, kiểm tra tác vụ định kỳ xử lý hết hạn và gửi thông báo).  
* **Contract Tests:** Đảm bảo các API Endpoint của BUM (qua API Gateway/NATS Request/Reply) tuân thủ "hợp đồng" đã định nghĩa (sử dụng OpenAPI spec). Tương tự, kiểm tra schema của Domain Events được phát ra bởi BUM và schema của Events được tiêu thụ từ các BC khác (IAM, Feature BCs, **PPM**).  
* **Component Tests:** Kiểm thử từng service/worker BUM (Query, Command, Worker) trong môi trường gần với production, với các phụ thuộc (DB, Redis, Message Broker, các BC khác, **PPM**) được giả lập hoặc sử dụng Testcontainers.  
* **Performance/Load Tests:** Kiểm thử tải để xác minh BUM Query Service có thể đáp ứng yêu cầu hiệu năng cao cho luồng kiểm tra Entitlement/Usage Limit, BUM Command Service có thể xử lý lượng Commands (mua gói, nâng cấp), và BUM Worker có thể xử lý lượng Event Usage dự kiến.

## **12\. Chiến lược Di chuyển Dữ liệu (Data Migration Strategy)**

Quản lý thay đổi schema database PostgreSQL của BUM cần được thực hiện cẩn thận:

* Sử dụng công cụ quản lý migration schema tự động (ví dụ: Flyway hoặc Liquibase).  
* Thiết kế các migration có tính **Backward Compatibility** (chỉ thêm, không xóa/sửa đổi các cột/bảng quan trọng). Điều này đặc biệt quan trọng với các bảng trung tâm như subscriptions, pricing\_plans, billing\_transactions.  
* Lập kế hoạch **rollback** cho các migration.  
* Đối với các thay đổi dữ liệu phức tạp (ví dụ: chuẩn hóa dữ liệu cũ, cập nhật dữ liệu Entitlement/Usage Record sau thay đổi logic), viết **Data Migration Script** riêng biệt.  
* Đảm bảo có bản sao lưu (backup) dữ liệu trước khi thực hiện các migration quan trọng.

## **13\. Kế hoạch Dung lượng (Capacity Planning \- Initial)**

Dựa trên ước tính ban đầu về lượng người dùng, tổ chức, số lượng Subscription, tần suất mua/nâng cấp/gia hạn, số lượng event Usage, đưa ra ước tính ban đầu về tài nguyên cần thiết cho mỗi đơn vị triển khai của BUM:

* **BUM Query Service:** Dự kiến sẽ nhận lượng request *rất lớn* cho việc kiểm tra Entitlement/Usage Limit từ IAM.  
  * Số lượng Pod tối thiểu: 5-10  
  * Số lượng Pod tối đa: 20+  
  * Giới hạn CPU mỗi Pod: 500m \- 1000m  
  * Giới hạn Memory mỗi Pod: 512Mi \- 1Gi  
  * Cấu hình HPA: Chủ yếu dựa trên CPU Utilization và Request Rate.  
* **BUM Command Service:** Nhận lượng request cho các thao tác ghi (ít hơn luồng đọc, nhưng phức tạp hơn).  
  * Số lượng Pod tối thiểu: 3-5  
  * Số lượng Pod tối đa: 10  
  * Giới hạn CPU mỗi Pod: 300m \- 700m  
  * Giới hạn Memory mỗi Pod: 512Mi \- 1Gi  
  * Cấu hình HPA: Dựa trên CPU Utilization và Request Rate.  
* **BUM Worker:** Xử lý event Usage và tác vụ định kỳ.  
  * Số lượng Pod tối thiểu: 3-5  
  * Số lượng Pod tối đa: 15+ (tùy thuộc vào lượng event Usage)  
  * Giới hạn CPU mỗi Pod: 300m \- 700m  
  * Giới hạn Memory mỗi Pod: 512Mi \- 1Gi  
  * Cấu hình HPA: Dựa trên CPU Utilization và độ dài hàng đợi message (Queue Length).  
* **PostgreSQL Database:** Cần được cấu hình mạnh mẽ để xử lý lượng ghi từ Command Service/Worker và lượng đọc từ Query Service.  
  * Kích thước đĩa ban đầu: 50GB+ (dự kiến dữ liệu Usage Record và Transaction sẽ tăng trưởng rất nhanh)  
  * RAM: 16GB \- 32GB+  
  * CPU: 4-8+ core  
  * Cần cấu hình Connection Pooling hiệu quả.  
* **Redis Cache:** Cần đủ bộ nhớ để lưu trữ thông tin Subscription chi tiết và Pricing Plan cho các Tenant Active.  
  * Kích thước bộ nhớ cần thiết: Ước tính dựa trên số lượng Tenant Active và kích thước dữ liệu cached cho mỗi Subscription (ví dụ: 10GB \- 20GB+).

Các con số này cần được xem xét kỹ lưỡng hơn dựa trên phân tích tải chi tiết và được theo dõi, điều chỉnh liên tục sau khi hệ thống đi vào hoạt động.

## **14\. Phụ thuộc (Dependencies)**

* **Phụ thuộc Nội bộ (Internal Dependencies):**  
  * IAM là Consumer chính của BUM Query Service (Entitlement Check).  
  * Các Feature BC (ODM, PIM, DAM, ICM, v.v.) là Producer của Usage Events mà BUM Worker tiêu thụ.  
  * NDM là Consumer của các thông báo mà BUM Worker/Command Service yêu cầu gửi.  
  * ALM là Consumer của các sự kiện audit log từ BUM Command Service/Worker.  
  * LZM và RDM là nhà cung cấp dữ liệu tham chiếu cho BUM Query Service/Command Service.  
  * **PPM là nhà cung cấp dịch vụ xử lý thanh toán và phát Event kết quả thanh toán/hoàn tiền.**  
* **Phụ thuộc Bên ngoài (External Dependencies):**  
  * Database (PostgreSQL, Redis).  
  * Message Brokers (NATS, RabbitMQ).  
  * **Không tích hợp trực tiếp Payment Gateway.**  
  * Container Registry.  
  * Kubernetes API.

## **15\. Kết luận**

Tài liệu thiết kế triển khai cho Bounded Context Billing & Usage Management (BUM) đã được xây dựng dựa trên tài liệu thiết kế miền BUM và tuân thủ chặt chẽ kiến trúc Microservices, CQRS và Clean Architecture của hệ thống Ecoma. Việc phân tách BUM thành ba đơn vị triển khai riêng biệt (Query Service, Command Service, Worker) là cần thiết để đáp ứng yêu cầu về hiệu năng, khả năng mở rộng và xử lý các loại tác vụ khác nhau (đọc tốc độ cao, ghi phức tạp, xử lý event hàng loạt, tác vụ định kỳ). Việc sử dụng PostgreSQL và Redis cho lưu trữ dữ liệu và cache được lựa chọn để đảm bảo tính toàn vẹn, hiệu năng và khả năng mở rộng cần thiết. Các khía cạnh quan trọng về giao tiếp, xử lý lỗi, khả năng phục hồi, kiểm thử và vận hành đã được đề cập, phác thảo các chiến lược và yêu cầu kỹ thuật.

Tài liệu này cung cấp nền tảng vững chắc cho đội ngũ kỹ thuật để tiến hành thiết kế kỹ thuật chi tiết hơn (ví dụ: thiết kế lớp Repository, Gateway, chi tiết implementation của Domain/Application Service, cấu trúc Command/Query/Event payload chi tiết) và bắt đầu quá trình triển khai thực tế Microservice(s) BUM, đảm bảo tuân thủ các nguyên tắc và mục tiêu kiến trúc của hệ thống Ecoma.

## **16\. Monitoring**

### **16.1. Metrics**

**1\. Service Level Metrics:**

* **Availability:**  
  * Service uptime  
  * Module uptime (Command, Query, Worker)  
  * Health check status  
  * Error rate  
* **Performance:**  
  * Response time  
  * Request rate  
  * Resource usage (CPU, Memory)  
  * PostgreSQL connection pool status  
  * Redis connection status  
  * Message Broker connection status  
  * **PPM API call latency/error rate**

**2\. Module Level Metrics:**

* **Query Module:**  
  * Entitlement/Usage check rate  
  * Entitlement/Usage check latency  
  * Query rate by type  
  * Cache hit rate  
  * Query errors  
  * Query performance by complexity  
* **Command Module:**  
  * Command rate by type  
  * Command processing latency  
  * Command validation errors  
  * Command business rule violations  
  * Command success rate  
  * Event publication rate  
  * **PPM API call success/failure rate**  
* **Worker Module:**  
  * Usage Event processing rate  
  * Usage Event processing latency  
  * Failed Usage Events count  
  * **PPM Event processing rate**  
  * **PPM Event processing latency**  
  * **Failed PPM Events count**  
  * Scheduled task execution time  
  * Scheduled task success rate  
  * Dead letter queue growth

**3\. Business Metrics:**

* Active Subscriptions count  
* Subscription status changes rate  
* Pricing Plan creation/update rate  
* Billing Transaction creation rate  
* Invoice generation rate  
* Usage ingestion rate  
* Usage limit exceeded count  
* Tenant data deletion requests processed

### **16.2. Logging**

Tất cả các service trong BUM sẽ triển khai ghi log cấu trúc (structured logging) với các trường thông tin sau:

* TraceId để theo dõi một request hoặc task xuyên suốt các service.  
* SpanId để xác định các bước xử lý cụ thể trong một trace.  
* Thông tin về TenantId, SubscriptionId, TransactionId (nếu có) để dễ dàng lọc log theo context.  
* Log level thích hợp (ERROR, WARN, INFO, DEBUG) tùy theo tầm quan trọng của sự kiện.  
* Thông tin về người dùng thực hiện hành động (UserId).  
* Thông tin về thiết bị/client gửi request (nếu có).  
* **Chi tiết các cuộc gọi đi đến PPM API (request/response/error).**  
* **Chi tiết các Event nhận được từ PPM (payload, processing status).**  
* **Chi tiết các Event Usage nhận được (payload, processing status).**

## **17\. Health Checks**

Mỗi service trong BUM phải triển khai các health check endpoints để Kubernetes hoặc các hệ thống giám sát khác có thể kiểm tra sức khỏe của service. Các health check này bao gồm:

1. **BUM Query Service:**  
   * **Liveness probe:** Đảm bảo service đang chạy và phản hồi.  
   * **Readiness probe:** Kiểm tra kết nối đến PostgreSQL, Redis và khả năng thực hiện truy vấn cơ bản.  
   * **Startup probe:** Đảm bảo service đã khởi động hoàn tất và sẵn sàng xử lý request.  
2. **BUM Command Service:**  
   * **Liveness probe:** Đảm bảo service đang chạy và phản hồi.  
   * **Readiness probe:** Kiểm tra kết nối đến PostgreSQL, NATS, RabbitMQ và **PPM API** (nếu kết nối đến PPM là critical cho Command Service).  
   * **Startup probe:** Đảm bảo service đã khởi động hoàn tất và sẵn sàng xử lý command.  
3. **BUM Worker:**  
   * **Liveness probe:** Đảm bảo service đang chạy và phản hồi.  
   * **Readiness probe:** Kiểm tra kết nối đến PostgreSQL, RabbitMQ và khả năng lắng nghe message.  
   * **Startup probe:** Đảm bảo service đã khởi động hoàn tất và sẵn sàng xử lý event/task.

## **18\. Data Security**

### **18.1. Dữ liệu Nhạy cảm**

BUM xử lý nhiều loại dữ liệu nhạy cảm. Các biện pháp bảo mật sau được áp dụng cho từng loại:

* **Thông tin tài chính:** Số tiền, loại tiền tệ, chi tiết giao dịch.  
  * Hạn chế truy cập thông tin tài chính theo quyền (liên kết với IAM).  
  * Không lưu trữ thông tin thẻ tín dụng hoặc thông tin thanh toán nhạy cảm của khách hàng (trách nhiệm của PPM và Payment Gateway).  
  * Masking thông tin trong log.  
* **Thông tin Subscription/Entitlement:** Chi tiết gói dịch vụ, hạn mức sử dụng.  
  * Hạn chế truy cập thông tin Subscription/Entitlement theo quyền (liên kết với IAM).  
* **Dữ liệu Usage:** Lịch sử sử dụng tài nguyên.  
  * Hạn chế truy cập dữ liệu Usage theo quyền (liên kết với IAM).

### **18.2. Mã hóa Dữ liệu**

* **Mã hóa dữ liệu tĩnh (at rest):**  
  * Dữ liệu nhạy cảm được mã hóa trên DB.  
  * Đĩa DB được mã hóa ở cấp hạ tầng.  
* **Mã hóa dữ liệu động (in transit):**  
  * TLS/SSL cho tất cả kết nối API.  
  * Mã hóa cho kết nối DB.  
  * Mã hóa cho kết nối Redis.  
  * Mã hóa cho kết nối message broker.  
  * **TLS/SSL cho các cuộc gọi đi đến PPM API.**

### **18.3. Quản lý Quyền Truy cập Dữ liệu**

* **Kiểm soát truy cập:**  
  * RBAC cho tất cả API endpoints (liên kết với IAM).  
  * Phân vùng dữ liệu theo tổ chức (tenant).  
  * Kiểm tra quyền cho mọi truy cập dữ liệu (liên kết với IAM).  
  * Nguyên tắc đặc quyền tối thiểu.  
* **Kiểm toán truy cập:**  
  * Ghi log tất cả truy cập dữ liệu nhạy cảm.  
  * Ghi log tất cả thay đổi trạng thái Subscription/Pricing Plan.  
  * Ghi log tất cả thao tác quản trị.  
  * Tích hợp với ALM cho audit logging.

### **18.4. Phòng chống Tấn công**

* **Phòng chống tấn công phổ biến:**  
  * Rate limiting cho các API công khai.  
  * Các biện pháp phòng chống SQL injection.  
  * Các biện pháp phòng chống XSS.  
* **Phát hiện bất thường:**  
  * Giám sát các hành vi người dùng bất thường liên quan đến quản lý gói dịch vụ/thanh toán.  
  * Giám sát các mẫu Usage bất thường.

## **19\. Error Recovery Strategy**

### **19.1. Query Service Recovery**

* Circuit breaker cho Redis và PostgreSQL.  
* Cache fallback khi Redis không khả dụng.  
* Graceful degradation khi DB quá tải.  
* Retry logic với backoff cho các lỗi tạm thời.  
* Tiếp tục vận hành với dữ liệu cached nếu DB không khả dụng.

### **19.2. Command Service Recovery**

* Retry policy cho các DB transactions.  
* Outbox pattern cho event publication.  
* Dead letter queue cho failed events.  
* Compensating transactions cho failed commands.  
* **Retry/Circuit Breaker cho các cuộc gọi đến PPM API.**  
* Manual recovery procedures cho critical failures.

### **19.3. Worker Recovery**

* Automatic retry cho event processing (Usage Events, **PPM Events**).  
* Idempotent event handlers.  
* Job tracking và resumption cho scheduled tasks.  
* Manual intervention procedures.  
* Scheduled reconciliation với các nguồn dữ liệu khác (nếu cần).

## **20\. Data Consistency**

### **20.1. Transactional Consistency**

* Sử dụng DB transactions cho command processing.  
* Optimistic concurrency control.  
* Validation trước khi commit.  
* Phát hiện và giải quyết conflict.

### **20.2. Event-Based Consistency**

* Outbox pattern cho event publication.  
* Idempotent event processing (đặc biệt cho Usage Events và **PPM Events**).  
* Message deduplication.  
* Event ordering trong cùng một aggregate.  
* Reconciliation process cho inconsistencies (ví dụ: đồng bộ trạng thái Subscription với kết quả từ PPM nếu có độ trễ).

### **20.3. Cache Consistency**

* Cache invalidation dựa trên events.  
* TTL cho cached items.  
* Write-through caching cho critical data (nếu cần).  
* Background refresh cho high-frequency data.  
* Versioning cho cached objects.

## **21\. API Versioning**

### **21.1. API Versioning Strategy**

* Version được đưa vào path URL (ví dụ: /api/v1/bum/subscriptions).  
* Hỗ trợ song song phiên bản Major-1.  
* Deprecation notice trước khi loại bỏ phiên bản cũ.  
* Tài liệu API rõ ràng cho mỗi phiên bản.

### **21.2. Event Schema Versioning**

* Version được đưa vào message schema.  
* Hỗ trợ backward compatibility.  
* Event consumers có thể xử lý nhiều phiên bản.  
* Migration plan cho việc loại bỏ phiên bản cũ.

### **21.3. Quản lý Breaking Changes**

* Thêm trường mới là non-breaking.  
* Xóa hoặc đổi tên trường là breaking change.  
* Phiên bản Major mới cho breaking changes.  
* Hỗ trợ migration tools cho clients.

## **22\. Deployment Strategy**

### **22.1. Deployment Process**

* Blue-green deployment.  
* Canary releases cho tính năng rủi ro cao.  
* Zero-downtime updates.  
* Automated rollback nếu health check fails.

### **22.2. Deployment Order**

1. Database migration (nếu có).  
2. BUM Worker.  
3. BUM Command Service.  
4. BUM Query Service.

### **22.3. Rollback Procedure**

* Automated rollback triggers:  
  * Health check failures.  
  * Error rate tăng đột biến.  
  * Latency tăng đột biến.  
* Manual rollback option.  
* Data migration rollback planning.

## **23\. Disaster Recovery**

### **23.1. Recovery Objectives**

* RPO (Recovery Point Objective): 5 phút.  
* RTO (Recovery Time Objective): 15 phút.

### **23.2. Backup Strategy**

* PostgreSQL full backup hàng ngày.  
* WAL archiving liên tục.  
* Point-in-time recovery.  
* Geo-replicated backups.  
* Backup retention: 30 ngày.

### **23.3. Recovery Procedure**

1. Restore PostgreSQL từ backup.  
2. Rebuild Redis cache sau khi DB phục hồi.  
3. Start các services theo thứ tự:  
   * BUM Worker.  
   * BUM Command Service.  
   * BUM Query Service.  
4. Verify data integrity và service health.  
5. Thông báo cho các dependent services.

## **24\. Performance Requirements**

### **24.1. Latency Requirements**

* **Query Service:**  
  * Entitlement/Usage check: \< 50ms (P95).  
  * Subscription/Pricing Plan query: \< 200ms (P95).  
  * Billing/Invoice/Usage report query: \< 500ms (P95).  
* **Command Service:**  
  * Purchase/Upgrade Subscription: \< 1s (P95).  
  * Pricing Plan actions: \< 500ms (P95).  
  * **Call to PPM for payment:** \< 500ms (P95).  
* **Worker:**  
  * Usage Event processing: \< 200ms (P95).  
  * **PPM Event processing:** \< 500ms (P95).  
  * Scheduled tasks: \< 30s (P95).

### **24.2. Throughput Requirements**

* **Query Service:**  
  * Entitlement/Usage checks: 5000 requests/second.  
  * Other queries: 200 requests/second.  
* **Command Service:**  
  * Purchase/Upgrade/Manage Subscription: 50 requests/minute.  
  * Pricing Plan management: 10 requests/minute.  
* **Worker:**  
  * Usage Event processing: 500 events/second.  
  * **PPM Event processing:** 100 events/second.  
  * Scheduled tasks: 60 tasks/hour.

### **24.3. SLA**

* Availability: 99.95%.  
* Data durability: 99.999%.  
* Success rate: 99.9%.  
* Error rate: \< 0.1%.

## **25\. Integration Testing Strategy**

### **25.1. Test Types**

* Unit tests cho domain logic.  
* Integration tests cho repositories.  
* Service-level tests cho API endpoints.  
* Contract tests cho event schemas.  
* End-to-end tests cho critical flows.

### **25.2. Test Environment**

* Isolated testing environment.  
* Testcontainers cho PostgreSQL và Redis.  
* Mock IAM, NDM, ALM, LZM, RDM, **PPM**, và các external dependencies.  
* Data generators cho test data.

### **25.3. Critical Paths Testing**

* **Subscription flows:**  
  * Free subscription creation (triggered by IAM).  
  * Paid subscription purchase, upgrade, renewal.  
  * Subscription suspension, deactivation, data deletion.  
* **Billing flows:**  
  * Invoice generation.  
  * Billing transaction recording.  
* **Usage flows:**  
  * Usage ingestion from Feature BCs.  
  * Usage limit checking and enforcement.  
  * Usage reporting.  
* **Payment Integration flows:**  
  * **Requesting payment processing from PPM.**  
  * **Processing payment/refund results from PPM Events.**  
* **Entitlement/Authorization flows:**  
  * **IAM calling BUM for entitlement checks.**

### **25.4. Non-functional Testing**

* Performance testing (load, stress, endurance).  
* Security testing (penetration testing, vulnerability scanning).  
* Resilience testing (chaos testing, degraded mode).  
* Data migration testing.