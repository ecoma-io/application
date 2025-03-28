# **Tài liệu Thiết kế Triển khai: Bounded Context Billing & Usage Management (BUM)**

## **1\. Giới thiệu**

Tài liệu này mô tả chi tiết thiết kế triển khai cho Bounded Context Billing & Usage Management (BUM) trong hệ thống Ecoma. BUM là một Bounded Context cốt lõi, chịu trách nhiệm quản lý toàn bộ các khía cạnh liên quan đến thanh toán, gói dịch vụ (subscription) và quyền sử dụng (entitlement) của các tổ chức (tenant) trên nền tảng SaaS trả trước của Ecoma. Tài liệu này tập trung vào các khía cạnh kỹ thuật triển khai riêng cho BUM, bao gồm cấu trúc service, công nghệ sử dụng cụ thể trong BUM, lưu trữ dữ liệu, giao tiếp đặc thù của BUM, hạ tầng, và các yêu cầu phi chức năng liên quan đến triển khai.

Mục tiêu của tài liệu này là cung cấp hướng dẫn chi tiết cho đội ngũ kỹ thuật để xây dựng, triển khai và vận hành Microservice(s) hiện thực hóa Bounded Context BUM, đảm bảo tuân thủ các nguyên tắc kiến trúc tổng thể của Ecoma (Microservices, DDD, EDA, CQRS, Clean Architecture) và đạt được các mục tiêu hệ thống (Tính sẵn sàng cao, Khả năng mở rộng, Hiệu năng, Bảo mật).

## **2\. Bối cảnh Kiến trúc Tổng thể**

Hệ thống Ecoma được xây dựng trên nền tảng kiến trúc Microservices, phân rã theo Bounded Contexts của DDD. Giao tiếp giữa các service backend chủ yếu sử dụng Event-Driven Architecture (EDA) và Request/Reply. Bên trong mỗi service, mô hình CQRS và Clean Architecture được áp dụng bắt buộc.

BUM là một Core Bounded Context, đóng vai trò quan trọng trong việc quản lý vòng đời tài chính và quyền sử dụng của khách hàng theo mô hình trả trước. BUM tương tác chặt chẽ với IAM (để kiểm tra quyền dựa trên Entitlement), các Feature BC (để nhận Usage Data), NDM (để gửi thông báo), ALM (để ghi log), LZM/RDM (để bản địa hóa và dữ liệu tham chiếu), và tích hợp trực tiếp với Payment Gateways.

## **3\. Mối quan hệ với Tài liệu Thiết kế Miền BUM**

Tài liệu này là phần tiếp theo của tài liệu **Thiết kế Miền BUM (bum.md)**. Trong khi tài liệu Thiết kế Miền tập trung vào việc định nghĩa các khái niệm nghiệp vụ cốt lõi, Aggregate Root, Entity, Value Object, Ngôn ngữ Chung, Use Cases, Domain Services, Application Services và Domain Events ở cấp độ logic và nghiệp vụ, tài liệu này đi sâu vào cách các định nghĩa đó được hiện thực hóa và triển khai về mặt kỹ thuật.

- **Domain Services và Application Services:** Vai trò và trách nhiệm của các loại service này đã được định nghĩa chi tiết trong tài liệu Thiết kế Miền BUM. Trong tài liệu triển khai này, chúng ta xem xét cách các service kỹ thuật (BUM Query Service, BUM Command Service, BUM Usage Worker, BUM Scheduled Worker) sẽ chứa và tổ chức các Domain Services và Application Services tương ứng theo mô hình Clean Architecture và CQRS. Chi tiết về từng Domain Service hoặc Application Service cụ thể (tên, phương thức, logic) sẽ không được lặp lại ở đây mà được tham chiếu đến tài liệu Thiết kế Miền.
- **Domain Events:** Các Domain Event mà BUM phát ra hoặc xử lý đã được xác định trong tài liệu Thiết kế Miền BUM, bao gồm mục đích và payload dự kiến. Tài liệu triển khai này mô tả cách các event đó được truyền tải vật lý trong hệ thống (sử dụng RabbitMQ) và cách các service lắng nghe/phát event. Chi tiết về từng loại Domain Event cụ thể sẽ không được lặp lại ở đây mà được tham chiếu đến tài liệu Thiết kế Miền.

## **4\. Đơn vị Triển khai (Deployment Units)**

Dựa trên mô hình CQRS bắt buộc và tính chất nghiệp vụ của BUM bao gồm cả luồng đọc hiệu năng cao (Entitlement Check), luồng ghi usage tốc độ cao, luồng xử lý command phức tạp (Billing, Subscription Management) và các tác vụ nền/định kỳ, BUM sẽ được triển khai thành nhiều đơn vị Microservice/Worker để tối ưu hóa khả năng mở rộng và quản lý tài nguyên.

**Đề xuất:** Triển khai BUM thành **bốn** đơn vị triển khai riêng biệt để tối ưu hóa khả năng mở rộng và quản lý tài nguyên, phù hợp với mô hình CQRS và tính chất tác vụ:

1. **BUM Query Service:**
   - **Trách nhiệm:** Xử lý tất cả các yêu cầu truy vấn (Queries) thông tin về Subscription, Pricing Plan, Billing Transaction, Invoice, Usage Record từ các Bounded Context khác (đặc biệt là IAM cho Entitlement Check) và giao diện người dùng/Admin UI.
   - **Mô hình:** Read Model của CQRS. Chứa các Application Services và Domain Services liên quan đến truy vấn dữ liệu và kiểm tra quyền lợi/hạn mức.
   - **Yêu cầu:** Hiệu năng rất cao, độ trễ thấp cho các yêu cầu kiểm tra Entitlement/Usage Limit từ IAM. Cần hỗ trợ truy vấn nhanh thông tin Subscription, Usage, Entitlement (cached).
   - **Giao tiếp:** Nhận Query thông qua cơ chế Request/Reply của hệ thống (sử dụng NATS) từ API Gateway hoặc các service backend khác (đặc biệt là IAM).
2. **BUM Command Service:**
   - **Trách nhiệm:** Xử lý các yêu cầu thay đổi trạng thái (Commands) liên quan đến quản lý Pricing Plan, Subscription (tạo, kích hoạt, gia hạn, thay đổi gói, tạm ngưng), Billing Transaction (khởi tạo, xử lý kết quả từ Payment Gateway), và Invoice. Xử lý các luồng nghiệp vụ như mua gói mới, nâng cấp, xử lý callback/webhook từ Payment Gateway.
   - **Mô hình:** Write Model của CQRS. Chứa các Application Services và Domain Services liên quan đến quản lý dữ liệu và các luồng nghiệp vụ chính. Phát ra Domain Events.
   - **Yêu cầu:** Đảm bảo tính toàn vẹn dữ liệu khi ghi. Cần xử lý logic nghiệp vụ phức tạp (Pro-rata, kiểm tra quy tắc Add-on). Có thể chịu độ trễ cao hơn Query Service nhưng vẫn cần đáp ứng yêu cầu về trải nghiệm người dùng (ví dụ: hoàn tất mua gói).
   - **Giao tiếp:** Nhận Command thông qua cơ chế Request/Reply của hệ thống (sử dụng NATS) từ API Gateway/Admin UI hoặc các service backend khác. Phát Domain Events thông qua cơ chế Eventing của hệ thống (sử dụng RabbitMQ). Tương tác trực tiếp với Payment Gateways.
3. **BUM Usage Worker:**
   - **Trách nhiệm:** Lắng nghe và xử lý các Domain Event về Usage từ các Feature BC (ví dụ: OrderCompletedEvent, ProductCreatedEvent, AssetCreatedEvent). Ghi nhận mức độ sử dụng vào Usage Record của Subscription tương ứng. Kiểm tra và phát cảnh báo khi Usage gần/vượt hạn mức.
   - **Mô hình:** Xử lý tác vụ nền bất đồng bộ, Event Consumer. Chứa các Application Services và Domain Services liên quan đến ghi nhận Usage.
   - **Yêu cầu:** Độ tin cậy cao cho việc xử lý event Usage. Có thể chịu độ trễ xử lý nhất định. Cần xử lý số lượng lớn event Usage.
   - **Giao tiếp:** Lắng nghe Domain Events từ Message Broker (RabbitMQ). Có thể gọi BUM Command Service (qua Command hoặc Request/Reply) để phát sự kiện cảnh báo (UsageLimitExceeded).
4. **BUM Scheduled Worker:**
   - **Trách nhiệm:** Chạy các tác vụ định kỳ theo lịch trình. Ví dụ: Kiểm tra Subscription hết hạn, chuyển trạng thái Suspended, kiểm tra Subscription đã Suspended quá thời gian Data Retention, kích hoạt quy trình xóa dữ liệu, gửi các thông báo vòng đời Subscription thông qua NDM.
   - **Mô hình:** Xử lý tác vụ nền bất đồng bộ, Scheduled Tasks. Chứa các Application Services và Domain Services liên quan đến xử lý vòng đời Subscription theo thời gian.
   - **Yêu cầu:** Độ tin cậy cao cho việc chạy tác vụ định kỳ và kích hoạt các hành động quan trọng (tạm ngưng, xóa dữ liệu, thông báo).
   - **Giao tiếp:** Không nhận request/command trực tiếp từ bên ngoài. Có thể gọi BUM Command Service để thực hiện các thay đổi trạng thái Subscription hoặc phát sự kiện (ví dụ: SubscriptionSuspended, TenantDataDeletionRequested). Gọi NDM (qua Request/Reply) để gửi thông báo.

Cấu trúc thư mục trong Nx Monorepo sẽ tuân thủ mô hình đã định nghĩa, với các apps/services và apps/workers riêng biệt cho BUM Query, BUM Command, BUM Usage Worker và BUM Scheduled Worker.

## **5\. Nền tảng Công nghệ Cụ thể cho BUM**

BUM sẽ sử dụng nền tảng công nghệ chung của hệ thống Ecoma, với lựa chọn cụ thể cho lưu trữ dữ liệu và caching, cùng với tích hợp Payment Gateway:

- **Cơ sở dữ liệu Chính:** PostgreSQL (Sử dụng TypeORM) \- Phù hợp cho dữ liệu có cấu trúc quan hệ chặt chẽ và yêu cầu tính toàn vẹn dữ liệu cao như Pricing Plan, Subscription, Billing Transaction, Invoice, Usage Record (lưu trữ lịch sử), Entitlement.
- **Cache/Tạm thời:** Redis \- Sử dụng cho caching dữ liệu thường xuyên được truy vấn trong BUM Query Service để giảm tải cho DB và cải thiện hiệu năng đọc, đặc biệt là:
  - Thông tin Subscription chi tiết (bao gồm Entitlement, Usage Limit) cho các yêu cầu kiểm tra quyền lợi/hạn mức từ IAM.
  - Thông tin Pricing Plan (phiên bản Active mới nhất).
- **Tích hợp Payment Gateway:** Sử dụng các SDK/API của Payment Gateway được lựa chọn (ví dụ: Stripe, PayPal, cổng thanh toán nội địa). BUM Command Service sẽ chứa logic tích hợp này.

## **6\. Lưu trữ Dữ liệu (Data Storage)**

BUM sẽ sở hữu cơ sở dữ liệu riêng (PostgreSQL), tách biệt với các BC khác. Redis được sử dụng làm lớp cache hiệu năng cao.

### **6.1. Schema PostgreSQL (Write Model & Primary Read Model)**

Cần thiết kế schema cho PostgreSQL để lưu trữ các Aggregate Root và Entity chính của BUM. Schema này sẽ là nguồn sự thật cho dữ liệu BUM.

**Bảng pricing_plans:**

- id UUID PRIMARY KEY
- name VARCHAR(255) NOT NULL
- description TEXT
- base_price_amount DECIMAL NOT NULL
- base_price_currency VARCHAR(10) NOT NULL
- billing_cycle_value INTEGER NOT NULL
- billing_cycle_unit VARCHAR(50) NOT NULL \-- Duration Unit Value Object
- is_active BOOLEAN NOT NULL DEFAULT TRUE
- is_free_plan BOOLEAN NOT NULL DEFAULT FALSE
- created_at TIMESTAMP WITH TIME ZONE NOT NULL
- updated_at TIMESTAMP WITH TIME ZONE NOT NULL
- version INTEGER NOT NULL DEFAULT 1
- UNIQUE (name, version)

**Bảng pricing_components:** (Thuộc pricing_plans)

- id UUID PRIMARY KEY
- pricing_plan_id UUID NOT NULL, FOREIGN KEY pricing_plans(id) ON DELETE CASCADE
- type VARCHAR(50) NOT NULL \-- PricingComponent Type Value Object ('Base', 'Resource', 'Feature')
- resource_type VARCHAR(100) \-- Optional, ResourceType Value Object
- feature_type VARCHAR(100) \-- Optional, FeatureType Value Object
- usage_limit_value DECIMAL \-- Optional, UsageQuantity Value Object
- usage_limit_unit VARCHAR(50) \-- Optional, UsageQuantity Value Object
- price_per_unit_amount DECIMAL \-- Optional, Money Value Object
- price_per_unit_currency VARCHAR(10) \-- Optional, Money Value Object
- details JSONB \-- Flexible storage for other component details
- created_at TIMESTAMP WITH TIME ZONE NOT NULL

**Bảng subscriptions:**

- id UUID PRIMARY KEY
- tenant_id UUID NOT NULL \-- Liên kết với IAM
- pricing_plan_id UUID NOT NULL, FOREIGN KEY pricing_plans(id) ON DELETE RESTRICT \-- RESTRICT để không xóa PricingPlan khi còn Subscription sử dụng
- pricing_plan_version INTEGER NOT NULL \-- Lưu phiên bản PricingPlan đang áp dụng
- status VARCHAR(50) NOT NULL \-- SubscriptionStatus Value Object
- start_date TIMESTAMP WITH TIME ZONE NOT NULL
- end_date TIMESTAMP WITH TIME ZONE NOT NULL
- next_billing_date TIMESTAMP WITH TIME ZONE \-- Optional
- billing_cycle_value INTEGER NOT NULL
- billing_cycle_unit VARCHAR(50) NOT NULL \-- Duration Unit Value Object
- last_successful_payment_date TIMESTAMP WITH TIME ZONE \-- Optional
- suspended_date TIMESTAMP WITH TIME ZONE \-- Optional
- data_retention_end_date TIMESTAMP WITH TIME ZONE \-- Optional
- created_at TIMESTAMP WITH TIME ZONE NOT NULL
- updated_at TIMESTAMP WITH TIME ZONE NOT NULL

**Bảng entitlements:** (Thuộc subscriptions)

- id UUID PRIMARY KEY
- subscription_id UUID NOT NULL, FOREIGN KEY subscriptions(id) ON DELETE CASCADE
- type VARCHAR(50) NOT NULL \-- Entitlement Type (Feature, Resource)
- feature_type VARCHAR(100) \-- Optional
- resource_type VARCHAR(100) \-- Optional
- limit_value DECIMAL \-- Optional
- limit_unit VARCHAR(50) \-- Optional
- is_active BOOLEAN NOT NULL DEFAULT TRUE
- created_at TIMESTAMP WITH TIME ZONE NOT NULL

**Bảng usage_records:** (Thuộc subscriptions, lưu trữ lịch sử usage theo chu kỳ)

- id UUID PRIMARY KEY
- subscription_id UUID NOT NULL, FOREIGN KEY subscriptions(id) ON DELETE CASCADE
- resource_type VARCHAR(100) NOT NULL \-- ResourceType Value Object
- quantity_value DECIMAL NOT NULL DEFAULT 0
- quantity_unit VARCHAR(50) NOT NULL
- billing_cycle_start_date TIMESTAMP WITH TIME ZONE NOT NULL
- billing_cycle_end_date TIMESTAMP WITH TIME ZONE NOT NULL
- last_updated TIMESTAMP WITH TIME ZONE NOT NULL
- UNIQUE (subscription_id, resource_type, billing_cycle_start_date) \-- Đảm bảo chỉ có một bản ghi usage cho mỗi tài nguyên trong mỗi chu kỳ của một Subscription

**Bảng billing_transactions:**

- id UUID PRIMARY KEY
- subscription_id UUID NOT NULL, FOREIGN KEY subscriptions(id) ON DELETE RESTRICT
- tenant_id UUID NOT NULL
- type VARCHAR(50) NOT NULL \-- Transaction Type ('Purchase', 'Renewal', 'AddOn')
- amount_amount DECIMAL NOT NULL
- amount_currency VARCHAR(10) NOT NULL
- transaction_date TIMESTAMP WITH TIME ZONE NOT NULL
- status VARCHAR(50) NOT NULL \-- TransactionStatus Value Object
- payment_gateway_transaction_id VARCHAR(255) \-- Optional, ID từ cổng thanh toán
- invoice_id UUID \-- Optional, FOREIGN KEY invoices(id) ON DELETE SET NULL
- created_at TIMESTAMP WITH TIME ZONE NOT NULL
- updated_at TIMESTAMP WITH TIME ZONE NOT NULL

**Bảng invoices:**

- id UUID PRIMARY KEY
- tenant_id UUID NOT NULL
- invoice_number VARCHAR(100) NOT NULL UNIQUE
- issue_date TIMESTAMP WITH TIME ZONE NOT NULL
- invoice_date TIMESTAMP WITH TIME ZONE NOT NULL
- due_date TIMESTAMP WITH TIME ZONE NOT NULL
- total_amount_amount DECIMAL NOT NULL
- total_amount_currency VARCHAR(10) NOT NULL
- status VARCHAR(50) NOT NULL \-- Invoice Status
- billing_transaction_id UUID NOT NULL, FOREIGN KEY billing_transactions(id) ON DELETE RESTRICT \-- Mối quan hệ 1-1
- created_at TIMESTAMP WITH TIME ZONE NOT NULL
- updated_at TIMESTAMP WITH TIME ZONE NOT NULL

**Bảng invoice_items:** (Thuộc invoices)

- id UUID PRIMARY KEY
- invoice_id UUID NOT NULL, FOREIGN KEY invoices(id) ON DELETE CASCADE
- description TEXT NOT NULL
- quantity DECIMAL NOT NULL
- unit_price_amount DECIMAL NOT NULL
- unit_price_currency VARCHAR(10) NOT NULL
- line_total_amount DECIMAL NOT NULL
- line_total_currency VARCHAR(10) NOT NULL
- related_resource_id UUID \-- Optional

**Chỉ mục (Indexes):**

- CREATE UNIQUE INDEX idx_pricing_plans_name_version ON pricing_plans (name, version);
- CREATE INDEX idx_subscriptions_tenant ON subscriptions (tenant_id);
- CREATE INDEX idx_subscriptions_status ON subscriptions (status);
- CREATE INDEX idx_subscriptions_end_date ON subscriptions (end_date);
- CREATE INDEX idx_usage_records_subscription_resource_cycle ON usage_records (subscription_id, resource_type, billing_cycle_start_date);
- CREATE INDEX idx_billing_transactions_tenant ON billing_transactions (tenant_id);
- CREATE INDEX idx_billing_transactions_subscription ON billing_transactions (subscription_id);
- CREATE INDEX idx_invoices_tenant ON invoices (tenant_id);
- CREATE UNIQUE INDEX idx_invoices_invoice_number ON invoices (invoice_number);
- CREATE UNIQUE INDEX idx_invoices_billing_transaction ON invoices (billing_transaction_id);

### **6.2. Cấu trúc Cache Redis (Read Model Cache)**

Redis sẽ được sử dụng làm lớp cache cho BUM Query Service để lưu trữ các dữ liệu thường xuyên được truy vấn và yêu cầu hiệu năng cao, đặc biệt cho các yêu cầu kiểm tra Entitlement/Usage Limit từ IAM. Chiến lược cache là "Cache-Aside" kết hợp với invalidation dựa trên Domain Events từ BUM Command Service và BUM Usage Worker.

**Chiến lược Key:**

Sử dụng cấu trúc key rõ ràng để dễ dàng quản lý và invalidation.

- **Cache thông tin Subscription chi tiết (bao gồm Entitlement, Usage Limit) theo Tenant ID:** bum:subscription:tenant:\<tenant_id\>
- **Cache thông tin Pricing Plan theo ID:** bum:pricing_plan:id:\<pricing_plan_id\>
- **Cache thông tin Pricing Plan theo Name (lấy version mới nhất Active):** bum:pricing_plan:name:\<pricing_plan_name\>:latest_active

**Chiến lược Value:**

Lưu trữ dữ liệu dưới dạng JSON string. Đối với cache Subscription chi tiết, cần bao gồm tất cả thông tin cần thiết cho Entitlement Check (Pricing Plan Version, Status, Billing Cycle Period, Entitlements, Usage Records hiện tại).

**Chiến lược Cache Invalidation:**

Khi có bất kỳ thay đổi nào đối với dữ liệu trong BUM Command Service hoặc BUM Usage Worker:

- **Từ BUM Command Service (phát Event):**
  - SubscriptionActivated, SubscriptionRenewed, SubscriptionPlanChanged, SubscriptionSuspended: Invalidate cache key Subscription chi tiết cho Tenant liên quan (bum:subscription:tenant:\<tenant_id\>).
  - PricingPlanCreated, PricingPlanUpdated: Invalidate cache key Pricing Plan theo ID (bum:pricing_plan:id:\<pricing_plan_id\>) và theo Name (lấy version mới nhất Active) (bum:pricing_plan:name:\<pricing_plan_name\>:latest_active). Cần re-cache thông tin Pricing Plan mới nhất.
- **Từ BUM Usage Worker (xử lý Event Usage):**
  - Sau khi ghi nhận Usage Record thành công cho một Subscription: Invalidate cache key Subscription chi tiết cho Tenant liên quan (bum:subscription:tenant:\<tenant_id\>) để cập nhật Usage mới nhất.
- TTL (Time To Live) cho các key cache cần được cấu hình phù hợp. Cache Subscription chi tiết có thể cần TTL ngắn hơn hoặc dựa vào thời gian kết thúc chu kỳ hiện tại. Cache Pricing Plan có thể có TTL dài hơn.

## **7\. Giao tiếp và Tích hợp**

BUM tương tác với nhiều BC khác và Payment Gateways.

- **Nhận Commands/Queries:**
  - BUM Command Service và BUM Query Service nhận các yêu cầu thay đổi trạng thái (Commands) và yêu cầu truy vấn dữ liệu (Queries) thông qua cơ chế Request/Reply của hệ thống (sử dụng NATS). Các yêu cầu này có thể đến từ API Gateway (được gọi bởi Client/Admin UI) hoặc từ các service backend khác (đặc biệt là IAM).
- **Phát Domain Events:**
  - BUM Command Service và BUM Usage Worker sẽ phát các Domain Event (ví dụ: SubscriptionActivated, UsageLimitExceeded, BillingTransactionSuccessful, TenantDataDeletionRequested, v.v.) đến hệ thống Message Broker (RabbitMQ) để các BC khác quan tâm có thể tiêu thụ.
  - Chi tiết về các Domain Event được phát ra bởi BUM có thể tham khảo trong tài liệu Thiết kế Miền BUM.
- **Lắng nghe Domain Events:**
  - BUM Usage Worker lắng nghe các Domain Event về Usage từ các Feature BC (ví dụ: OrderCompletedEvent, ProductCreatedEvent, AssetCreatedEvent).
  - BUM Command Service lắng nghe các Event từ Payment Gateway Callback/Webhook (PaymentSuccessfulEvent, PaymentFailedEvent) để cập nhật trạng thái giao dịch và Subscription.
  - BUM Scheduled Worker lắng nghe OrganizationCreatedEvent từ IAM để tạo Subscription Free.
- **Tương tác trực tiếp với Payment Gateways:**
  - BUM Command Service sẽ gọi API của Payment Gateway để khởi tạo giao dịch thanh toán và xử lý các callback/webhook nhận được từ Payment Gateway để cập nhật kết quả giao dịch.
- **Tương tác với NDM:**
  - BUM Scheduled Worker hoặc BUM Command Service (sau khi thay đổi trạng thái Subscription quan trọng) sẽ gọi NDM (qua Request/Reply) để yêu cầu gửi các thông báo cho người dùng/tổ chức theo lịch trình đã định nghĩa.
- **Tương tác với LZM & RDM:**
  - BUM Query Service hoặc BUM Command Service sẽ gọi LZM (qua Request/Reply) để bản địa hóa các thông tin hiển thị.
  - BUM Query Service hoặc BUM Command Service sẽ gọi RDM (qua Request/Reply) để lấy dữ liệu tham chiếu (tiền tệ, quốc gia, v.v.).
- **Tương tác với ALM:**
  - BUM Command Service và BUM Usage Worker sẽ phát Event hoặc gọi API của ALM để ghi lại các hành động quan trọng (thay đổi trạng thái Subscription, giao dịch thanh toán, ghi nhận usage vượt hạn mức).

## **8\. Định nghĩa API Endpoint và Mapping Use Case**

Phần này phác thảo các API Endpoint chính mà BUM cung cấp thông qua API Gateway (đối với các tương tác từ bên ngoài hệ thống) và mapping chúng với các Use Case đã định nghĩa trong tài liệu Thiết kế Miền BUM. Các Endpoint này sẽ được API Gateway định tuyến đến BUM Query Service hoặc BUM Command Service tương ứng.

| API Endpoint (Ví dụ)                                          | Phương thức HTTP | Mô tả Chức năng Cấp cao                                                        | Use Case Liên quan (bum.md)                                                                    | Loại Yêu cầu Nội bộ (CQRS) | Service Xử lý                                            |
| :------------------------------------------------------------ | :--------------- | :----------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------- | :------------------------- | :------------------------------------------------------- |
| /api/v1/bum/pricing-plans                                     | GET              | Lấy danh sách các Pricing Plan (phiên bản Active mới nhất).                    | Quản lý Pricing Plans (8.4.1)                                                                  | Query                      | BUM Query Service                                        |
| /api/v1/bum/pricing-plans/{planId}                            | GET              | Lấy chi tiết Pricing Plan theo ID (mặc định version Active mới nhất).          | Quản lý Pricing Plans (8.4.1)                                                                  | Query                      | BUM Query Service                                        |
| /api/v1/bum/pricing-plans                                     | POST             | Tạo Pricing Plan mới (Admin).                                                  | Quản lý Pricing Plans (8.4.1)                                                                  | Command                    | BUM Command Service                                      |
| /api/v1/bum/pricing-plans/{planId}                            | PUT              | Cập nhật Pricing Plan (tạo version mới) (Admin).                               | Quản lý Pricing Plans (8.4.1)                                                                  | Command                    | BUM Command Service                                      |
| /api/v1/bum/subscriptions/me                                  | GET              | Lấy chi tiết Subscription hiện tại của Tổ chức (bao gồm Entitlement, Usage).   | Xem Chi tiết Subscription Hiện tại và Lịch sử (8.3.3), Kiểm tra Quyền lợi Tính năng (8.2.2)    | Query                      | BUM Query Service                                        |
| /api/v1/bum/subscriptions/me/history                          | GET              | Lấy lịch sử thay đổi Subscription của Tổ chức.                                 | Xem Chi tiết Subscription Hiện tại và Lịch sử (8.3.3)                                          | Query                      | BUM Query Service                                        |
| /api/v1/bum/subscriptions/me/purchase                         | POST             | Khởi tạo quy trình mua gói mới hoặc nâng cấp gói.                              | Tổ chức Mua Gói Dịch vụ Trả phí Mới hoặc Nâng cấp gói (8.1.2)                                  | Command                    | BUM Command Service                                      |
| /api/v1/bum/subscriptions/me/add-on                           | POST             | Khởi tạo quy trình mua thêm tài nguyên (Add-on).                               | Tổ chức Mua Gói Dịch vụ Trả phí Mới hoặc Nâng cấp gói (8.1.2)                                  | Command                    | BUM Command Service                                      |
| /api/v1/bum/billing/transactions                              | GET              | Lấy danh sách giao dịch thanh toán của Tổ chức.                                | Xem Danh sách Giao dịch Thanh toán của Tổ chức (8.3.1)                                         | Query                      | BUM Query Service                                        |
| /api/v1/bum/billing/transactions/{transactionId}              | GET              | Lấy chi tiết giao dịch thanh toán.                                             | Xem Chi tiết Giao dịch Thanh toán và Hóa đơn (8.3.2)                                           | Query                      | BUM Query Service                                        |
| /api/v1/bum/billing/invoices/{invoiceId}                      | GET              | Lấy chi tiết hóa đơn.                                                          | Xem Chi tiết Giao dịch Thanh toán và Hóa đơn (8.3.2)                                           | Query                      | BUM Query Service                                        |
| /api/v1/bum/usage/me                                          | GET              | Lấy báo cáo sử dụng tài nguyên của Tổ chức trong chu kỳ hiện tại.              | Xem Báo cáo Sử dụng Tài nguyên của Tổ chức (8.3.4)                                             | Query                      | BUM Query Service                                        |
| /api/v1/bum/usage/me/history                                  | GET              | Lấy báo cáo sử dụng tài nguyên của Tổ chức theo chu kỳ.                        | Xem Báo cáo Sử dụng Tài nguyên của Tổ chức (8.3.4)                                             | Query                      | BUM Query Service                                        |
| /api/v1/internal/bum/entitlement/check                        | POST             | Kiểm tra quyền lợi/hạn mức sử dụng (dành cho BC nội bộ, gọi bởi IAM).          | Kiểm tra Quyền lợi Tính năng (8.2.2), Ghi nhận Sử dụng Tài nguyên và Kiểm soát Hạn mức (8.2.1) | Query                      | BUM Query Service                                        |
| /api/v1/internal/bum/usage                                    | POST             | Ghi nhận usage từ Event (dành cho Worker lắng nghe Event Usage từ Feature BC). | Ghi nhận Sử dụng Tài nguyên và Kiểm soát Hạn mức (8.2.1)                                       | Command                    | BUM Command Service (hoặc internal API của Usage Worker) |
| /api/v1/internal/bum/subscription/{tenantId}/suspend          | POST             | Chuyển trạng thái Subscription sang Suspended (dành cho Scheduled Worker).     | Quản lý Vòng đời Subscription Sau Hết hạn (8.1.3)                                              | Command                    | BUM Command Service                                      |
| /api/v1/internal/bum/subscription/{tenantId}/request-deletion | POST             | Kích hoạt yêu cầu xóa dữ liệu Tổ chức (dành cho Scheduled Worker).             | Quản lý Vòng đời Subscription Sau Hết hạn (8.1.3)                                              | Command                    | BUM Command Service                                      |

_Lưu ý: Đây là các endpoint ví dụ. Tên và cấu trúc cụ thể có thể được tinh chỉnh trong quá trình thiết kế kỹ thuật chi tiết. Các endpoint /api/v1/internal/... là các endpoint nội bộ, không được public ra ngoài qua API Gateway thông thường mà chỉ dùng cho giao tiếp giữa các service backend._

## **9\. Chiến lược Xử lý Lỗi (Error Handling Strategy)**

Chiến lược xử lý lỗi trong BUM sẽ tuân thủ mô hình chung của Ecoma và phân biệt giữa các loại lỗi, kênh giao tiếp:

- **Lỗi Nghiệp vụ (Business Rule Exceptions):** Các lỗi phát sinh do vi phạm quy tắc nghiệp vụ (ví dụ: cố gắng mua Add-on khi gói chính còn dưới 7 ngày, gói không tồn tại, vượt quá hạn mức khi ghi nhận usage) sẽ được ném ra từ Domain Services và bắt ở lớp Application Service hoặc lớp xử lý Command/Event.
  - **Đối với giao tiếp Request/Reply (qua NATS/API Gateway):** Lỗi nghiệp vụ sẽ được chuyển đổi thành phản hồi lỗi có cấu trúc (ví dụ: JSON object) bao gồm mã lỗi (error code) và thông báo lỗi chi tiết, được trả về cho bên gọi. Sử dụng HTTP status code 400 Bad Request cho các lỗi phía người dùng khi giao tiếp qua API Gateway. Phản hồi lỗi sẽ bao gồm một biến chỉ báo thành công/thất bại (ví dụ: success: false) cùng với thông tin lỗi chi tiết.
  - **Đối với giao tiếp qua Message Broker (Events):** Lỗi nghiệp vụ xảy ra trong quá trình xử lý event (ví dụ: Usage Worker nhận event cho tenant không tồn tại hoặc subscription không Active) sẽ được ghi log chi tiết và có thể phát ra một Domain Event thông báo về sự thất bại nếu cần thiết. Các event không xử lý được do lỗi nghiệp vụ có thể được chuyển vào DLQ nếu cần phân tích.
- **Lỗi Kỹ thuật (Technical Errors):** Các lỗi phát sinh ở lớp Infrastructure (ví dụ: lỗi kết nối DB, lỗi kết nối Message Broker, lỗi cache Redis, lỗi gọi Payment Gateway API) sẽ được xử lý bằng cách sử dụng try-catch block.
  - Các lỗi này cần được ghi log chi tiết (sử dụng Structured Logging theo kiến trúc chung) với mức độ phù hợp (ví dụ: ERROR), bao gồm stack trace và các thông tin tương quan (traceId, spanId).
  - Đối với giao tiếp Request/Reply: Lỗi kỹ thuật sẽ được chuyển đổi thành phản hồi lỗi chung (ví dụ: HTTP status code 500 Internal Server Error) để tránh lộ thông tin nhạy cảm, nhưng vẫn ghi log chi tiết ở phía server.
  - Đối với giao tiếp qua Message Broker: Lỗi kỹ thuật sẽ được xử lý theo cơ chế retry của RabbitMQ. Nếu retry vẫn thất bại, message sẽ được chuyển vào Dead Letter Queue (DLQ) để phân tích sau. Lỗi cũng cần được ghi log và có thể kích hoạt cảnh báo.
  - Đối với tích hợp Payment Gateway: Cần xử lý các lỗi cụ thể từ Payment Gateway API và chuyển đổi chúng thành lỗi nghiệp vụ hoặc lỗi kỹ thuật phù hợp.
- **Lỗi Validate Input:** Đối với các yêu cầu nhận được qua API Endpoint (từ API Gateway), lỗi validate input sẽ được xử lý ở lớp Application Service hoặc Controller (trong NestJS) trước khi tạo Command/Query. Phản hồi lỗi sẽ sử dụng HTTP status code 400 Bad Request với thông báo lỗi chi tiết về các trường không hợp lệ.
- **Thông báo Lỗi:** Các lỗi quan trọng (ví dụ: lỗi kết nối DB kéo dài, lỗi xử lý Command quan trọng, lỗi xử lý Payment Gateway callback/webhook, lỗi xử lý Event Usage, lỗi tác vụ định kỳ) cần kích hoạt cảnh báo thông qua hệ thống giám sát (Observability Stack).

## **10\. Khả năng Phục hồi (Resiliency)**

Để đảm bảo BUM chịu lỗi và phục hồi khi các phụ thuộc gặp sự cố:

- **Timeouts và Retries:** Cấu hình timeouts và retry policies cho các cuộc gọi đi đến các phụ thuộc (PostgreSQL, Redis, NATS, RabbitMQ, Payment Gateway API, NDM API, LZM API, RDM API, ALM API). Sử dụng các thư viện hỗ trợ retry với exponential backoff và jitter. Đặc biệt quan trọng với tích hợp Payment Gateway và gọi NDM.
- **Circuit Breaker:** Áp dụng mẫu Circuit Breaker cho các cuộc gọi đến các phụ thuộc có khả năng gặp sự cố tạm thời (ví dụ: gọi Payment Gateway API, NDM API) để ngăn chặn các cuộc gọi liên tục gây quá tải cho phụ thuộc đó và cho chính service BUM.
- **Bulkhead:** Cân nhắc sử dụng Bulkhead để cô lập tài nguyên giữa các loại tác vụ trong BUM Command Service (ví dụ: xử lý mua gói vs quản lý Pricing Plan) và giữa các Worker (Usage Worker vs Scheduled Worker).
- **Health Checks:** Triển khai các loại Health Check Probe trong Kubernetes cho mỗi service/worker BUM:
  - **Startup Probe:** Kiểm tra xem ứng dụng đã khởi động hoàn toàn (ví dụ: kết nối đến DB, Message Broker, Cache đã sẵn sàng).
  - **Liveness Probe:** Kiểm tra xem ứng dụng có đang chạy và khỏe mạnh không. Kiểm tra vòng lặp xử lý message/request/scheduled task.
  - **Readiness Probe:** Kiểm tra xem ứng dụng đã sẵn sàng xử lý request/message chưa. Kiểm tra kết nối đến **PostgreSQL** (nguồn dữ liệu chính), **Redis** (lớp cache quan trọng), và khả năng thực hiện các thao tác đọc/ghi/cache cơ bản. Đối với BUM Command Service, cần kiểm tra kết nối đến **Payment Gateway API** (nếu là phụ thuộc critical).
- **Idempotency:** Thiết kế các Command Handlers và Event Handlers (đặc biệt là các handler lắng nghe sự kiện Usage và Payment Gateway) có tính Idempotent nếu có thể, để việc xử lý lặp lại do retry hoặc lỗi tạm thời không gây ra kết quả không mong muốn (ví dụ: không ghi nhận usage hai lần cho cùng một event, không kích hoạt Subscription hai lần cho cùng một giao dịch thanh toán thành công).

## **11\. Chiến lược Kiểm thử (Testing Strategy)**

Chiến lược kiểm thử cho BUM sẽ tuân thủ mô hình chung của Ecoma:

- **Unit Tests:** Kiểm thử logic nghiệp vụ cốt lõi trong Domain Model (ví dụ: tính toán Pro-rata trong BillingService, logic kiểm tra Entitlement trong SubscriptionService, logic vòng đời trạng thái Subscription) và logic xử lý trong Application Services một cách độc lập (sử dụng mock cho Repository, Gateway, Broker, Payment Gateway client).
- **Integration Tests:** Kiểm thử sự tương tác giữa các thành phần nội bộ của từng service/worker (ví dụ: Application Service gọi Domain Service, Repository tương tác với cơ sở dữ liệu thực hoặc Testcontainers, Event Handler xử lý Event và gọi Domain Service).
- **End-to-End Tests (E2E Tests):** Kiểm thử luồng nghiệp vụ hoàn chỉnh xuyên qua các service (ví dụ: đăng ký Organization mới trong IAM kích hoạt tạo Subscription Free trong BUM, mua gói trả phí qua API Gateway, xử lý callback Payment Gateway, kiểm tra quyền từ một Feature BC gọi đến IAM/BUM Query Service, kiểm tra tác vụ định kỳ xử lý hết hạn và gửi thông báo).
- **Contract Tests:** Đảm bảo các API Endpoint của BUM (qua API Gateway/NATS Request/Reply) tuân thủ "hợp đồng" đã định nghĩa (sử dụng OpenAPI spec). Tương tự, kiểm tra schema của Domain Events được phát ra bởi BUM và schema của Events được tiêu thụ từ các BC khác (IAM, Feature BCs, Payment Gateway).
- **Component Tests:** Kiểm thử từng service/worker BUM (Query, Command, Usage Worker, Scheduled Worker) trong môi trường gần với production, với các phụ thuộc (DB, Redis, Message Broker, các BC khác, Payment Gateway) được giả lập hoặc sử dụng Testcontainers.
- **Performance/Load Tests:** Kiểm thử tải để xác minh BUM Query Service có thể đáp ứng yêu cầu hiệu năng cao cho luồng kiểm tra Entitlement/Usage Limit, BUM Command Service có thể xử lý lượng Commands (mua gói, nâng cấp), và BUM Usage Worker có thể xử lý lượng Event Usage dự kiến.

## **12\. Chiến lược Di chuyển Dữ liệu (Data Migration Strategy)**

Quản lý thay đổi schema database PostgreSQL của BUM cần được thực hiện cẩn thận:

- Sử dụng công cụ quản lý migration schema tự động (ví dụ: Flyway hoặc Liquibase).
- Thiết kế các migration có tính **Backward Compatibility** (chỉ thêm, không xóa/sửa đổi các cột/bảng quan trọng). Điều này đặc biệt quan trọng với các bảng trung tâm như subscriptions, pricing_plans, billing_transactions.
- Lập kế hoạch **rollback** cho các migration.
- Đối với các thay đổi dữ liệu phức tạp (ví dụ: chuẩn hóa dữ liệu cũ, cập nhật dữ liệu Entitlement/Usage Record sau thay đổi logic), viết **Data Migration Script** riêng biệt.
- Đảm bảo có bản sao lưu (backup) dữ liệu trước khi thực hiện các migration quan trọng.

## **13\. Kế hoạch Dung lượng (Capacity Planning \- Initial)**

Dựa trên ước tính ban đầu về lượng người dùng, tổ chức, số lượng Subscription, tần suất mua/nâng cấp/gia hạn, số lượng event Usage, đưa ra ước tính ban đầu về tài nguyên cần thiết cho mỗi đơn vị triển khai của BUM. Các con số này là điểm khởi đầu và sẽ được điều chỉnh dựa trên dữ liệu thực tế sau khi triển khai và giám sát.

- **BUM Query Service:** Dự kiến sẽ nhận lượng request _rất lớn_ cho việc kiểm tra Entitlement/Usage Limit từ IAM.
  - Số lượng Pod tối thiểu: 5-10
  - Số lượng Pod tối đa: 20+
  - Giới hạn CPU mỗi Pod: 500m \- 1000m
  - Giới hạn Memory mỗi Pod: 512Mi \- 1Gi
  - Cấu hình HPA: Chủ yếu dựa trên CPU Utilization và Request Rate.
- **BUM Command Service:** Nhận lượng request cho các thao tác ghi (ít hơn luồng đọc, nhưng phức tạp hơn).
  - Số lượng Pod tối thiểu: 3-5
  - Số lượng Pod tối đa: 10
  - Giới hạn CPU mỗi Pod: 300m \- 700m
  - Giới hạn Memory mỗi Pod: 512Mi \- 1Gi
  - Cấu hình HPA: Dựa trên CPU Utilization và Request Rate.
- **BUM Usage Worker:** Lượng tải xử lý event Usage có thể rất lớn và biến động.
  - Số lượng Pod tối thiểu: 3-5
  - Số lượng Pod tối đa: 15+ (tùy thuộc vào lượng event Usage)
  - Giới hạn CPU mỗi Pod: 300m \- 700m
  - Giới hạn Memory mỗi Pod: 512Mi \- 1Gi
  - Cấu hình HPA: Dựa trên CPU Utilization và độ dài hàng đợi message (Queue Length).
- **BUM Scheduled Worker:** Lượng tải xử lý tác vụ định kỳ dự kiến không quá lớn, nhưng yêu cầu độ tin cậy cao.
  - Số lượng Pod tối thiểu: 2
  - Số lượng Pod tối đa: 3-5
  - Giới hạn CPU mỗi Pod: 200m \- 500m
  - Giới hạn Memory mỗi Pod: 256Mi \- 512Mi
  - Cấu hình HPA: Có thể dựa trên CPU Utilization, không yêu cầu scale quá lớn.
- **PostgreSQL Database:** Cần được cấu hình mạnh mẽ để xử lý lượng ghi từ Command Service/Usage Worker và lượng đọc từ Query Service.
  - Kích thước đĩa ban đầu: 50GB+ (dự kiến dữ liệu Usage Record và Transaction sẽ tăng trưởng rất nhanh)
  - RAM: 16GB \- 32GB+
  - CPU: 4-8+ core
  - Cần cấu hình Connection Pooling hiệu quả.
- **Redis Cache:** Cần đủ bộ nhớ để lưu trữ thông tin Subscription chi tiết và Pricing Plan cho các Tenant Active.
  - Kích thước bộ nhớ cần thiết: Ước tính dựa trên số lượng Tenant Active và kích thước dữ liệu cached cho mỗi Subscription (ví dụ: 10GB \- 20GB+).

Các con số này cần được xem xét kỹ lưỡng hơn dựa trên phân tích tải chi tiết và được theo dõi, điều chỉnh liên tục sau khi hệ thống đi vào hoạt động.

## **14\. Phụ thuộc (Dependencies)**

- **Phụ thuộc Nội bộ (Internal Dependencies):**
  - IAM là Consumer chính của BUM Query Service (Entitlement Check).
  - Các Feature BC (ODM, PIM, DAM, ICM, v.v.) là Producer của Usage Events mà BUM Usage Worker tiêu thụ.
  - NDM là Consumer của các thông báo mà BUM Scheduled Worker/Command Service yêu cầu gửi.
  - ALM là Consumer của các sự kiện audit log từ BUM Command Service/Usage Worker.
  - LZM và RDM là nhà cung cấp dữ liệu tham chiếu cho BUM Query Service/Command Service.
  - BUM Scheduled Worker và BUM Usage Worker có thể gọi BUM Command Service nội bộ.
- **Phụ thuộc Bên ngoài (External Dependencies):**
  - Database (PostgreSQL, Redis).
  - Message Brokers (NATS, RabbitMQ).
  - Payment Gateway APIs.
  - Container Registry.
  - Kubernetes API.

## **15\. Kết luận**

Tài liệu thiết kế triển khai cho Bounded Context Billing & Usage Management (BUM) đã được xây dựng dựa trên tài liệu thiết kế miền BUM và tuân thủ chặt chẽ kiến trúc Microservices, CQRS và Clean Architecture của hệ thống Ecoma. Việc phân tách BUM thành bốn đơn vị triển khai riêng biệt (Query Service, Command Service, Usage Worker, Scheduled Worker) là cần thiết để đáp ứng yêu cầu về hiệu năng, khả năng mở rộng và xử lý các loại tác vụ khác nhau (đọc tốc độ cao, ghi phức tạp, xử lý event hàng loạt, tác vụ định kỳ). Việc sử dụng PostgreSQL và Redis cho lưu trữ dữ liệu và cache, cùng với tích hợp Payment Gateway, được lựa chọn để đảm bảo tính toàn vẹn, hiệu năng và khả năng mở rộng cần thiết. Các khía cạnh quan trọng về giao tiếp, xử lý lỗi, khả năng phục hồi, kiểm thử và vận hành đã được đề cập, phác thảo các chiến lược và yêu cầu kỹ thuật.

Tài liệu này cung cấp nền tảng vững chắc cho đội ngũ kỹ thuật để tiến hành thiết kế kỹ thuật chi tiết hơn (ví dụ: thiết kế lớp Repository, Gateway, chi tiết implementation của Domain/Application Service, cấu trúc Command/Query/Event payload chi tiết) và bắt đầu quá trình triển khai thực tế Microservice(s) BUM, đảm bảo tuân thủ các nguyên tắc và mục tiêu kiến trúc của hệ thống Ecoma.
