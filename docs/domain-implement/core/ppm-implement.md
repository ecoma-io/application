# **Tài liệu Thiết kế Triển khai: Bounded Context Payment Processing Management (PPM)**

## **1\. Giới thiệu**

Tài liệu này mô tả chi tiết thiết kế triển khai cho Bounded Context Payment Processing Management (PPM) trong hệ thống Ecoma. PPM là một Bounded Context cốt lõi, chịu trách nhiệm quản lý và xử lý tất cả các giao dịch thanh toán và hoàn tiền phát sinh từ các hoạt động kinh doanh của tổ chức khách hàng trên nền tảng Ecoma. Tài liệu này tập trung vào các khía cạnh kỹ thuật triển khai riêng cho PPM, bao gồm cấu trúc service, công nghệ sử dụng cụ thể trong PPM, lưu trữ dữ liệu, giao tiếp đặc thù của PPM, hạ tầng, và các yêu cầu phi chức năng liên quan đến triển khai.

Mục tiêu của tài liệu này là cung cấp hướng dẫn chi tiết cho đội ngũ kỹ thuật để xây dựng, triển khai và vận hành Microservice(s) hiện thực hóa Bounded Context PPM, đảm bảo tuân thủ các nguyên tắc kiến trúc tổng thể của Ecoma (Microservices, DDD, EDA, CQRS, Clean Architecture) và đạt được các mục tiêu hệ thống (Tính sẵn sàng cao, Khả năng mở rộng, Hiệu năng, Bảo mật).

## **2\. Bối cảnh Kiến trúc Tổng thể**

Hệ thống Ecoma được xây dựng trên nền tảng kiến trúc Microservices, phân rã theo Bounded Contexts của DDD. Giao tiếp giữa các service backend chủ yếu sử dụng Event-Driven Architecture (EDA) và Request/Reply. Bên trong mỗi service, mô hình CQRS và Clean Architecture được áp dụng bắt buộc.

PPM là một Core Bounded Context, đóng vai trò trung tâm trong việc xử lý các luồng tiền tệ của hệ thống. PPM tích hợp với các Payment Gateway bên ngoài và cung cấp một giao diện thống nhất cho các Bounded Context khác (như BUM, ODM, SFM, MPM) yêu cầu xử lý thanh toán hoặc hoàn tiền. PPM đảm bảo các giao dịch được thực hiện an toàn, chính xác và theo dõi trạng thái xuyên suốt.

## **3\. Mối quan hệ với Tài liệu Thiết kế Miền PPM**

Tài liệu này là phần tiếp theo của tài liệu **Thiết kế Miền PPM (ppm.md)**. Trong khi tài liệu Thiết kế Miền tập trung vào việc định nghĩa các khái niệm nghiệp vụ cốt lõi, Aggregate Root, Entity, Value Object, Ngôn ngữ Chung, Use Cases, Domain Services, Application Services và Domain Events ở cấp độ logic và nghiệp vụ, tài liệu này đi sâu vào cách các định nghĩa đó được hiện thực hóa và triển khai về mặt kỹ thuật.

* **Domain Services và Application Services:** Vai trò và trách nhiệm của các loại service này đã được định nghĩa chi tiết trong tài liệu Thiết kế Miền PPM. Trong tài liệu triển khai này, chúng ta xem xét cách các service kỹ thuật (PPM Query Service, PPM Command Service, PPM Worker) sẽ chứa và tổ chức các Domain Services và Application Services tương ứng theo mô hình Clean Architecture và CQRS. Chi tiết về từng Domain Service hoặc Application Service cụ thể (tên, phương thức, logic) sẽ không được lặp lại ở đây mà được tham chiếu đến tài liệu Thiết kế Miền.  
* **Domain Events:** Các Domain Event mà PPM phát ra hoặc xử lý đã được xác định trong tài liệu Thiết kế Miền PPM, bao gồm mục đích và payload dự kiến. Tài liệu triển khai này mô tả cách các event đó được truyền tải vật lý trong hệ thống (sử dụng RabbitMQ) và cách các service lắng nghe/phát event. Chi tiết về từng loại Domain Event cụ thể sẽ không được lặp lại ở đây mà được tham chiếu đến tài liệu Thiết kế Miền.

## **4\. Đơn vị Triển khai (Deployment Units)**

Dựa trên mô hình CQRS bắt buộc và tính chất nghiệp vụ của PPM bao gồm xử lý giao dịch (Commands), truy vấn lịch sử (Queries), và xử lý webhook/tác vụ nền (Worker), chúng tôi đề xuất triển khai thành **ba** đơn vị triển khai riêng biệt:

1. **PPM Query Service:**  
   * **Trách nhiệm:** Xử lý tất cả các yêu cầu truy vấn (Queries) thông tin về Payment Transaction, Refund, Payment Gateway Configuration.  
   * **Mô hình:** Read Model của CQRS. Chứa các Application Services và Domain Services liên quan đến truy vấn dữ liệu.  
   * **Yêu cầu phi chức năng:** Hiệu năng cao, độ trễ thấp. Tối ưu hóa cho volume truy vấn lịch sử giao dịch.  
   * **Giao tiếp:** Nhận Query thông qua cơ chế Request/Reply (NATS). Truy vấn PostgreSQL và đọc cache Redis.  
2. **PPM Command Service:**  
   * **Trách nhiệm:** Xử lý các yêu cầu thay đổi trạng thái (Commands) liên quan đến khởi tạo giao dịch thanh toán/hoàn tiền, cập nhật trạng thái giao dịch, quản lý cấu hình Payment Gateway. Tương tác với Payment Gateway APIs.  
   * **Mô hình:** Write Model của CQRS. Chứa các Application Services và Domain Services liên quan đến quản lý dữ liệu và xử lý giao dịch.  
   * **Yêu cầu phi chức năng:** Đảm bảo tính toàn vẹn dữ liệu. Xử lý logic nghiệp vụ phức tạp liên quan đến giao dịch. Độ tin cậy cao trong tương tác với Payment Gateway.  
   * **Giao tiếp:** Nhận Command thông qua Request/Reply (NATS). Ghi dữ liệu vào PostgreSQL. Phát Domain Events. **Gọi API của Payment Gateway.**  
3. **PPM Worker:**  
   * **Trách nhiệm:** Xử lý các tác vụ nền hoặc ít ưu tiên hơn. Quan trọng nhất là xử lý **Webhook/Thông báo từ Payment Gateway** để cập nhật trạng thái giao dịch. Chạy các tác vụ định kỳ (ví dụ: kiểm tra trạng thái giao dịch pending quá lâu).  
   * **Mô hình:** Event Consumer, Scheduled Tasks, và Background Processor.  
   * **Yêu cầu phi chức năng:** Độ tin cậy cao cho việc xử lý webhook và các tác vụ quan trọng định kỳ.  
   * **Giao tiếp:** **Cung cấp endpoint nhận Webhook từ Payment Gateway.** Lắng nghe các Event nội bộ hoặc từ các BC khác (ví dụ: TenantDataDeletionRequested từ BUM). **Gửi Commands nội bộ hoặc gọi internal API của PPM Command Service** khi cần thay đổi trạng thái (ví dụ: cập nhật trạng thái giao dịch sau webhook). Gọi NDM để gửi thông báo.

Cấu trúc thư mục trong Nx Monorepo sẽ tuân thủ mô hình đã định nghĩa, với các apps/services và apps/workers riêng biệt cho PPM Query, PPM Command và PPM Worker.

## **5\. Nền tảng Công nghệ Cụ thể cho PPM**

PPM sẽ sử dụng nền tảng công nghệ chung của hệ thống Ecoma, với lựa chọn cụ thể cho lưu trữ dữ liệu, caching và tích hợp Payment Gateway:

* **Cơ sở dữ liệu Chính:** PostgreSQL (Sử dụng TypeORM) \- Phù hợp cho dữ liệu có cấu trúc quan hệ chặt chẽ và yêu cầu tính toàn vẹn dữ liệu cao như Payment Transaction, Refund, PaymentAttempt, Invoice, InvoiceItem, PaymentGatewayConfiguration.  
* **Cache/Tạm thời:** Redis \- Sử dụng cho caching dữ liệu thường xuyên được truy vấn trong PPM Query Service để giảm tải cho DB và cải thiện hiệu năng đọc, đặc biệt là:  
  * Thông tin Payment Transaction chi tiết cho các truy vấn gần đây.  
  * Thông tin Payment Gateway Configuration cho các cuộc gọi đi.  
* **Tích hợp Payment Gateway:** Sử dụng các SDK/API của Payment Gateway được lựa chọn (ví dụ: Stripe, PayPal, VNPay, Momo). PPM Command Service sẽ chứa logic gọi API này. PPM Worker sẽ chứa logic xử lý Webhook.

## **6\. Lưu trữ Dữ liệu (Data Storage)**

PPM sẽ sở hữu cơ sở dữ liệu riêng (PostgreSQL), tách biệt với các BC khác. Redis được sử dụng làm lớp cache hiệu năng cao.

### **6.1. Schema PostgreSQL (Write Model & Primary Read Model)**

Cần thiết kế schema cho PostgreSQL để lưu trữ các Aggregate Root và Entity chính của PPM. Schema này sẽ là nguồn sự thật cho dữ liệu PPM.

**Bảng payment\_transactions:**

* id UUID PRIMARY KEY  
* tenant\_id UUID NOT NULL \-- Liên kết với IAM  
* transaction\_type VARCHAR(50) NOT NULL \-- TransactionType Value Object  
* amount\_amount DECIMAL NOT NULL  
* amount\_currency VARCHAR(10) NOT NULL  
* payment\_method\_type VARCHAR(50) \-- PaymentMethodType Value Object  
* status VARCHAR(50) NOT NULL \-- TransactionStatus Value Object  
* initiated\_by\_user\_id UUID \-- Optional, Liên kết với IAM  
* source\_bounded\_context VARCHAR(100) NOT NULL  
* source\_transaction\_id UUID \-- Optional, ID giao dịch gốc trong BC nguồn (Order ID, Billing Transaction ID, etc.)  
* payment\_gateway\_id UUID \-- Optional, FOREIGN KEY payment\_gateway\_configurations(id)  
* gateway\_transaction\_id VARCHAR(255) \-- Optional, ID giao dịch trong hệ thống của cổng thanh toán  
* created\_at TIMESTAMP WITH TIME ZONE NOT NULL  
* updated\_at TIMESTAMP WITH TIME ZONE NOT NULL

**Bảng payment\_attempts:** (Thuộc payment\_transactions)

* id UUID PRIMARY KEY  
* payment\_transaction\_id UUID NOT NULL, FOREIGN KEY payment\_transactions(id) ON DELETE CASCADE  
* attempt\_date TIMESTAMP WITH TIME ZONE NOT NULL  
* status VARCHAR(50) NOT NULL \-- AttemptStatus Value Object  
* gateway\_response JSONB \-- Dữ liệu phản hồi từ cổng thanh toán  
* failure\_reason TEXT \-- Optional  
* created\_at TIMESTAMP WITH TIME ZONE NOT NULL

**Bảng refunds:** (Thuộc payment\_transactions)

* id UUID PRIMARY KEY  
* payment\_transaction\_id UUID NOT NULL, FOREIGN KEY payment\_transactions(id) ON DELETE CASCADE  
* refund\_amount\_amount DECIMAL NOT NULL  
* refund\_amount\_currency VARCHAR(10) NOT NULL  
* status VARCHAR(50) NOT NULL \-- RefundStatus Value Object  
* initiated\_by\_user\_id UUID \-- Optional  
* refund\_date TIMESTAMP WITH TIME ZONE \-- Optional  
* gateway\_refund\_id VARCHAR(255) \-- Optional  
* created\_at TIMESTAMP WITH TIME ZONE NOT NULL

**Bảng payment\_gateway\_configurations:**

* id UUID PRIMARY KEY  
* tenant\_id UUID NOT NULL  
* gateway\_type VARCHAR(50) NOT NULL \-- GatewayType Value Object  
* name VARCHAR(255) NOT NULL  
* configuration\_details JSONB \-- Lưu trữ cấu hình (API Key, Secret, etc.) \- Cần được mã hóa  
* supported\_payment\_methods VARCHAR(255)\[\] \-- Array of PaymentMethodType  
* is\_active BOOLEAN NOT NULL DEFAULT TRUE  
* is\_default BOOLEAN NOT NULL DEFAULT FALSE  
* created\_at TIMESTAMP WITH TIME ZONE NOT NULL  
* updated\_at TIMESTAMP WITH TIME ZONE NOT NULL  
* UNIQUE (tenant\_id, name)

**Chỉ mục (Indexes):**

* CREATE INDEX idx\_payment\_transactions\_tenant ON payment\_transactions (tenant\_id);  
* CREATE INDEX idx\_payment\_transactions\_status ON payment\_transactions (status);  
* CREATE INDEX idx\_payment\_transactions\_source ON payment\_transactions (source\_bounded\_context, source\_transaction\_id);  
* CREATE INDEX idx\_payment\_transactions\_gateway ON payment\_transactions (payment\_gateway\_id, gateway\_transaction\_id);  
* CREATE INDEX idx\_refunds\_transaction ON refunds (payment\_transaction\_id);  
* CREATE INDEX idx\_payment\_gateway\_configurations\_tenant ON payment\_gateway\_configurations (tenant\_id);  
* CREATE UNIQUE INDEX idx\_payment\_gateway\_configurations\_tenant\_name ON payment\_gateway\_configurations (tenant\_id, name);

### **6.2. Cấu trúc Cache Redis (Read Model Cache)**

Redis sẽ được sử dụng làm lớp cache cho PPM Query Service để lưu trữ các dữ liệu thường xuyên được truy vấn và yêu cầu hiệu năng cao. Chiến lược cache là "Cache-Aside" kết hợp với invalidation dựa trên Domain Events từ PPM Command Service và PPM Worker.

**Chiến lược Key:**

Sử dụng cấu trúc key rõ ràng để dễ dàng quản lý và invalidation.

* **Cache thông tin Payment Transaction chi tiết theo ID:** ppm:transaction:id:\<transaction\_id\>  
* **Cache thông tin Payment Gateway Configuration theo ID:** ppm:gateway\_config:id:\<config\_id\>  
* **Cache thông tin Payment Gateway Configuration mặc định theo Tenant ID:** ppm:gateway\_config:tenant:\<tenant\_id\>:default

**Chiến lược Value:**

Lưu trữ dữ liệu dưới dạng JSON string.

**Chiến lược Cache Invalidation:**

Khi có bất kỳ thay đổi nào đối với dữ liệu trong PPM Command Service hoặc PPM Worker:

* **Từ PPM Command Service (phát Event):**  
  * PaymentTransactionCreated, PaymentSuccessfulEvent, PaymentFailedEvent, RefundProcessedEvent, RefundFailedEvent: Invalidate cache key Payment Transaction liên quan (ppm:transaction:id:\<transaction\_id\>).  
  * PaymentGatewayConfigurationAdded, PaymentGatewayConfigurationUpdated: Invalidate cache key Payment Gateway Configuration liên quan (ppm:gateway\_config:id:\<config\_id\>) và cache mặc định nếu cần (ppm:gateway\_config:tenant:\<tenant\_id\>:default).  
* **Từ PPM Worker (xử lý Webhook/Event):**  
  * Sau khi xử lý Webhook/Event từ Payment Gateway và cập nhật trạng thái giao dịch: Invalidate cache key Payment Transaction liên quan (ppm:transaction:id:\<transaction\_id\>).  
* TTL (Time To Live) cho các key cache cần được cấu hình phù hợp. Cache Transaction chi tiết có thể cần TTL ngắn hơn (ví dụ: vài giờ hoặc 1 ngày). Cache Gateway Configuration có thể có TTL dài hơn.

## **7\. Giao tiếp và Tích hợp**

PPM tương tác với nhiều BC khác và Payment Gateways.

* **Nhận Commands/Queries:**  
  * PPM Command Service và PPM Query Service nhận các yêu cầu thay đổi trạng thái (Commands) và yêu cầu truy vấn dữ liệu (Queries) thông qua cơ chế Request/Reply của hệ thống (sử dụng NATS). Các yêu cầu này có thể đến từ API Gateway (được gọi bởi Client/Admin UI) hoặc từ các service backend khác (BUM, ODM, SFM, MPM).  
* **Phát Domain Events:**  
  * PPM Command Service và PPM Worker sẽ phát các Domain Event (ví dụ: PaymentSuccessfulEvent, PaymentFailedEvent, RefundProcessedEvent, RefundFailedEvent, PaymentGatewayConfigurationAdded, v.v.) đến hệ thống Message Broker (RabbitMQ) để các BC khác quan tâm có thể tiêu thụ.  
  * Chi tiết về các Domain Event được phát ra bởi PPM có thể tham khảo trong tài liệu Thiết kế Miền PPM.  
* **Lắng nghe Domain Events:**  
  * PPM Worker lắng nghe các Event từ **Payment Gateway Callback/Webhook**.  
  * PPM Worker lắng nghe TenantDataDeletionRequestedEvent từ BUM để kích hoạt xóa dữ liệu Tenant.  
* **Tương tác trực tiếp với Payment Gateways:**  
  * PPM Command Service sẽ gọi API của Payment Gateway để khởi tạo giao dịch thanh toán và hoàn tiền.  
  * PPM Worker sẽ cung cấp endpoint nhận webhook từ Payment Gateway và xử lý các thông báo này.  
* **Tương tác với NDM:**  
  * PPM Worker hoặc PPM Command Service (sau khi thay đổi trạng thái giao dịch quan trọng) sẽ gọi NDM (qua Request/Reply) để yêu cầu gửi các thông báo cho người dùng/tổ chức theo lịch trình đã định nghĩa (ví dụ: thông báo thanh toán thành công/thất bại).  
* **Tương tác với LZM & RDM:**  
  * PPM Query Service hoặc PPM Command Service sẽ gọi LZM (qua Request/Reply) để bản địa hóa các thông tin hiển thị.  
  * PPM Query Service hoặc PPM Command Service sẽ gọi RDM (qua Request/Reply) để lấy dữ liệu tham chiếu (loại tiền tệ, loại cổng thanh toán, loại phương thức thanh toán).  
* **Tương tác với ALM:**  
  * PPM Command Service và PPM Worker sẽ phát Event hoặc gọi API của ALM để ghi lại các hành động quan trọng (khởi tạo giao dịch, ghi nhận kết quả từ gateway, cập nhật trạng thái giao dịch, thêm/cập nhật cấu hình cổng thanh toán).

## **8\. Định nghĩa API Endpoint và Mapping Use Case**

Phần này phác thảo các API Endpoint chính mà PPM cung cấp thông qua API Gateway (đối với các tương tác từ bên ngoài hệ thống) và mapping chúng với các Use Case đã định nghĩa trong tài liệu Thiết kế Miền PPM. Các Endpoint này sẽ được API Gateway định tuyến đến PPM Query Service hoặc PPM Command Service tương ứng.

| API Endpoint (Ví dụ) | Phương thức HTTP | Mô tả Chức năng Cấp cao | Use Case Liên quan (ppm.md) | Loại Yêu cầu Nội bộ (CQRS) | Service Xử lý |
| :---- | :---- | :---- | :---- | :---- | :---- |
| /api/v1/ppm/transactions | GET | Lấy danh sách giao dịch thanh toán của Tổ chức. | Xem Danh sách Giao dịch Thanh toán của Tổ chức (8.3.1) | Query | PPM Query Service |
| /api/v1/ppm/transactions/{transactionId} | GET | Lấy chi tiết giao dịch thanh toán. | Xem Chi tiết Giao dịch Thanh toán và Hóa đơn (8.3.2 \- Lưu ý: Hóa đơn thuộc BUM, chỉ xem ref) | Query | PPM Query Service |
| /api/v1/ppm/transactions/{transactionId}/refund | POST | Yêu cầu hoàn tiền cho một giao dịch. | Xử lý Yêu cầu Hoàn tiền (8.2) | Command | PPM Command Service |
| /api/v1/ppm/gateways/configurations | GET | Lấy danh sách cấu hình cổng thanh toán của Tổ chức. | Thêm Cấu hình Cổng Thanh toán Mới (8.3), Cập nhật Cấu hình Cổng Thanh toán (8.3) | Query | PPM Query Service |
| /api/v1/ppm/gateways/configurations | POST | Thêm cấu hình cổng thanh toán mới. | Thêm Cấu hình Cổng Thanh toán Mới (8.3) | Command | PPM Command Service |
| /api/v1/ppm/gateways/configurations/{configId} | PUT | Cập nhật cấu hình cổng thanh toán. | Cập nhật Cấu hình Cổng Thanh toán (8.3) | Command | PPM Command Service |
| /api/v1/internal/ppm/process-payment | POST | Xử lý yêu cầu thanh toán (dành cho BC nội bộ như BUM, ODM). | Xử lý Yêu cầu Thanh toán (8.1) | Command | PPM Command Service |
| /api/v1/internal/ppm/process-refund | POST | Xử lý yêu cầu hoàn tiền (dành cho BC nội bộ như BUM, ODM). | Xử lý Yêu cầu Hoàn tiền (8.2) | Command | PPM Command Service |
| /api/v1/internal/ppm/gateway/webhook/{gatewayType} | POST | Endpoint nhận webhook/callback từ Payment Gateway. | Xử lý Thông báo Kết quả Thanh toán từ Cổng Thanh toán (8.1), Xử lý Thông báo Kết quả Hoàn tiền (8.2) | Command | PPM Worker (hoặc internal API của Worker) |

*Lưu ý: Đây là các endpoint ví dụ. Tên và cấu trúc cụ thể có thể được tinh chỉnh trong quá trình thiết kế kỹ thuật chi tiết. Các endpoint /api/v1/internal/... là các endpoint nội bộ, không được public ra ngoài qua API Gateway thông thường mà chỉ dùng cho giao tiếp giữa các service backend.*

## **9\. Chiến lược Xử lý Lỗi (Error Handling Strategy)**

Chiến lược xử lý lỗi trong PPM sẽ tuân thủ mô hình chung của Ecoma và phân biệt giữa các loại lỗi, kênh giao tiếp:

* **Lỗi Nghiệp vụ (Business Rule Exceptions):** Các lỗi phát sinh do vi phạm quy tắc nghiệp vụ (ví dụ: số tiền không hợp lệ, cổng thanh toán không hoạt động, cố gắng hoàn tiền quá số tiền gốc) sẽ được ném ra từ Domain Services và bắt ở lớp Application Service hoặc lớp xử lý Command/Event.  
  * **Đối với giao tiếp Request/Reply (qua NATS/API Gateway):** Lỗi nghiệp vụ sẽ được chuyển đổi thành phản hồi lỗi có cấu trúc (ví dụ: JSON object) bao gồm mã lỗi (error code) và thông báo lỗi chi tiết, được trả về cho bên gọi. Sử dụng HTTP status code 400 Bad Request cho các lỗi phía người dùng khi giao tiếp qua API Gateway. Phản hồi lỗi sẽ bao gồm một biến chỉ báo thành công/thất bại (ví dụ: success: false) cùng với thông tin lỗi chi tiết.  
  * **Đối với giao tiếp qua Message Broker (Events):** Lỗi nghiệp vụ xảy ra trong quá trình xử lý event (ví dụ: Worker nhận event xóa dữ liệu cho tenant không tồn tại) sẽ được ghi log chi tiết và có thể phát ra một Domain Event thông báo về sự thất bại nếu cần thiết. Các event không xử lý được do lỗi nghiệp vụ có thể được chuyển vào DLQ nếu cần phân tích.  
* **Lỗi Kỹ thuật (Technical Errors):** Các lỗi phát sinh ở lớp Infrastructure (ví dụ: lỗi kết nối DB, lỗi kết nối Message Broker, lỗi cache Redis, lỗi gọi Payment Gateway API) sẽ được xử lý bằng cách sử dụng try-catch block.  
  * Các lỗi này cần được ghi log chi tiết (sử dụng Structured Logging theo kiến trúc chung) với mức độ phù hợp (ví dụ: ERROR), bao gồm stack trace và các thông tin tương quan (traceId, spanId).  
  * Đối với giao tiếp Request/Reply: Lỗi kỹ thuật sẽ được chuyển đổi thành phản hồi lỗi chung (ví dụ: HTTP status code 500 Internal Server Error) để tránh lộ thông tin nhạy cảm, nhưng vẫn ghi log chi tiết ở phía server.  
  * Đối với giao tiếp qua Message Broker: Lỗi kỹ thuật sẽ được xử lý theo cơ chế retry của RabbitMQ. Nếu retry vẫn thất bại, message sẽ được chuyển vào Dead Letter Queue (DLQ) để phân tích sau. Lỗi cũng cần được ghi log và có thể kích hoạt cảnh báo.  
  * Đối với tích hợp Payment Gateway: Cần xử lý các lỗi cụ thể từ Payment Gateway API và chuyển đổi chúng thành lỗi nghiệp vụ hoặc lỗi kỹ thuật phù hợp.  
* **Lỗi Validate Input:** Đối với các yêu cầu nhận được qua API Endpoint (từ API Gateway), lỗi validate input sẽ được xử lý ở lớp Application Service hoặc Controller (trong NestJS) trước khi tạo Command/Query. Phản hồi lỗi sẽ sử dụng HTTP status code 400 Bad Request với thông báo lỗi chi tiết về các trường không hợp lệ.  
* **Thông báo Lỗi:** Các lỗi quan trọng (ví dụ: lỗi kết nối DB kéo dài, lỗi xử lý Command quan trọng, lỗi xử lý Payment Gateway callback/webhook, lỗi tác vụ định kỳ) cần kích hoạt cảnh báo thông qua hệ thống giám sát (Observability Stack).

## **10\. Khả năng Phục hồi (Resiliency)**

Để đảm bảo PPM chịu lỗi và phục hồi khi các phụ thuộc gặp sự cố:

* **Timeouts và Retries:** Cấu hình timeouts và retry policies cho các cuộc gọi đi đến các phụ thuộc (PostgreSQL, Redis, NATS, RabbitMQ, Payment Gateway API, NDM API, LZM API, RDM API, ALM API). Sử dụng các thư viện hỗ trợ retry với exponential backoff và jitter. Đặc biệt quan trọng với tích hợp Payment Gateway và gọi NDM.  
* **Circuit Breaker:** Áp dụng mẫu Circuit Breaker cho các cuộc gọi đến các phụ thuộc có khả năng gặp sự cố tạm thời (ví dụ: gọi Payment Gateway API, NDM API) để ngăn chặn các cuộc gọi liên tục gây quá tải cho phụ thuộc đó và cho chính service PPM.  
* **Bulkhead:** Cân nhắc sử dụng Bulkhead để cô lập tài nguyên giữa các loại tác vụ trong PPM Command Service (ví dụ: xử lý thanh toán vs quản lý cấu hình gateway) và giữa các loại tác vụ trong PPM Worker (xử lý webhook vs tác vụ định kỳ).  
* **Health Checks:** Triển khai các loại Health Check Probe trong Kubernetes cho mỗi service PPM:  
  * **Startup Probe:** Kiểm tra xem ứng dụng đã khởi động hoàn toàn (ví dụ: kết nối đến DB, Message Broker, Cache đã sẵn sàng).  
  * **Liveness probe:** Kiểm tra xem ứng dụng có đang chạy và khỏe mạnh không. Kiểm tra vòng lặp xử lý message/request/scheduled task.  
  * **Readiness probe:** Kiểm tra xem ứng dụng đã sẵn sàng xử lý request/message chưa. Kiểm tra kết nối đến **PostgreSQL** (nguồn dữ liệu chính), **Redis** (lớp cache quan trọng), và khả năng thực hiện các thao tác đọc/ghi/cache cơ bản. Đối với PPM Command Service, cần kiểm tra kết nối đến **Payment Gateway API** (nếu là phụ thuộc critical).  
* **Idempotency:** Thiết kế các Command Handlers và Event Handlers (đặc biệt là các handler xử lý webhook từ Payment Gateway) có tính Idempotent nếu có thể, để việc xử lý lặp lại do retry hoặc lỗi tạm thời không gây ra kết quả không mong muốn.

## **11\. Chiến lược Kiểm thử (Testing Strategy)**

Chiến lược kiểm thử cho PPM sẽ tuân thủ mô hình chung của Ecoma:

* **Unit Tests:** Kiểm thử logic nghiệp vụ cốt lõi trong Domain Model (ví dụ: logic chuyển trạng thái giao dịch, logic hoàn tiền) và logic xử lý trong Application Services một cách độc lập (sử dụng mock cho Repository, Gateway, Broker, Payment Gateway client).  
* **Integration Tests:** Kiểm thử sự tương tác giữa các thành phần nội bộ của từng service/worker (ví dụ: Application Service gọi Domain Service, Repository tương tác với cơ sở dữ liệu thực hoặc Testcontainers, Event Handler xử lý Event và gọi Domain Service).  
* **End-to-End Tests (E2E Tests):** Kiểm thử luồng nghiệp vụ hoàn chỉnh xuyên qua các service (ví dụ: BUM yêu cầu thanh toán, PPM xử lý với Payment Gateway, PPM nhận webhook và phát Event kết quả, BUM lắng nghe Event).  
* **Contract Tests:** Đảm bảo các API Endpoint của PPM (qua API Gateway/NATS Request/Reply) tuân thủ "hợp đồng" đã định nghĩa (sử dụng OpenAPI spec). Tương tự, kiểm tra schema của Domain Events được phát ra bởi PPM và schema của Events được tiêu thụ (ví dụ: TenantDataDeletionRequested từ BUM).  
* **Component Tests:** Kiểm thử từng service/worker PPM (Query, Command, Worker) trong môi trường gần với production, với các phụ thuộc (DB, Redis, Message Broker, các BC khác, Payment Gateway) được giả lập hoặc sử dụng Testcontainers.  
* **Performance/Load Tests:** Kiểm thử tải để xác minh PPM Query Service có thể đáp ứng yêu cầu hiệu năng cao cho truy vấn lịch sử giao dịch và PPM Command Service có thể xử lý lượng Commands (yêu cầu thanh toán/hoàn tiền), và PPM Worker có thể xử lý lượng webhook dự kiến.

## **12\. Chiến lược Di chuyển Dữ liệu (Data Migration Strategy)**

Quản lý thay đổi schema database PostgreSQL của PPM cần được thực hiện cẩn thận:

* Sử dụng công cụ quản lý migration schema tự động (ví dụ: Flyway hoặc Liquibase).  
* Thiết kế các migration có tính **Backward Compatibility** (chỉ thêm, không xóa/sửa đổi các cột/bảng quan trọng). Điều này đặc biệt quan trọng với các bảng trung tâm như payment\_transactions, payment\_attempts, refunds.  
* Lập kế hoạch **rollback** cho các migration.  
* Đối với các thay đổi dữ liệu phức tạp (ví dụ: chuẩn hóa dữ liệu cũ), viết **Data Migration Script** riêng biệt.  
* Đảm bảo có bản sao lưu (backup) dữ liệu trước khi thực hiện các migration quan trọng.

## **13\. Kế hoạch Dung lượng (Capacity Planning \- Initial)**

Dựa trên ước tính ban đầu về lượng giao dịch thanh toán/hoàn tiền, số lượng tổ chức, tần suất truy vấn lịch sử, đưa ra ước tính ban đầu về tài nguyên cần thiết cho mỗi đơn vị triển khai của PPM:

* **PPM Query Service:** Dự kiến sẽ nhận lượng request cho việc truy vấn lịch sử giao dịch.  
  * Số lượng Pod tối thiểu: 3-5  
  * Số lượng Pod tối đa: 10  
  * Giới hạn CPU mỗi Pod: 300m \- 700m  
  * Giới hạn Memory mỗi Pod: 512Mi \- 1Gi  
  * Cấu hình HPA: Chủ yếu dựa trên CPU Utilization và Request Rate.  
* **PPM Command Service:** Nhận lượng request cho các thao tác ghi (xử lý yêu cầu thanh toán/hoàn tiền).  
  * Số lượng Pod tối thiểu: 5-10 (để xử lý volume giao dịch)  
  * Số lượng Pod tối đa: 20+  
  * Giới hạn CPU mỗi Pod: 500m \- 1000m  
  * Giới hạn Memory mỗi Pod: 512Mi \- 1Gi  
  * Cấu hình HPA: Dựa trên CPU Utilization và Request Rate.  
* **PPM Worker:** Xử lý webhook và tác vụ định kỳ.  
  * Số lượng Pod tối thiểu: 3-5 (để xử lý webhook và tác vụ định kỳ)  
  * Số lượng Pod tối đa: 10+ (tùy thuộc vào lượng webhook)  
  * Giới hạn CPU mỗi Pod: 300m \- 700m  
  * Giới hạn Memory mỗi Pod: 512Mi \- 1Gi  
  * Cấu hình HPA: Dựa trên CPU Utilization và độ dài hàng đợi message (Queue Length).  
* **PostgreSQL Database:** Cần được cấu hình mạnh mẽ để xử lý lượng ghi từ Command Service/Worker và lượng đọc từ Query Service.  
  * Kích thước đĩa ban đầu: 30GB+ (dự kiến dữ liệu Transaction và Attempt sẽ tăng trưởng đáng kể)  
  * RAM: 8GB \- 16GB+  
  * CPU: 2-4+ core  
  * Cần cấu hình Connection Pooling hiệu quả.  
* **Redis Cache:** Cần đủ bộ nhớ để lưu trữ thông tin Transaction chi tiết và Gateway Configuration.  
  * Kích thước bộ nhớ cần thiết: Ước tính dựa trên số lượng giao dịch gần đây và cấu hình gateway (ví dụ: 1GB \- 5GB+).

Các con số này cần được xem xét kỹ lưỡng hơn dựa trên phân tích tải chi tiết và được theo dõi, điều chỉnh liên tục sau khi hệ thống đi vào hoạt động.

## **14\. Phụ thuộc (Dependencies)**

* **Phụ thuộc Nội bộ (Internal Dependencies):**  
  * Các BC khác (BUM, ODM, SFM, MPM) là Consumer của PPM Command Service (gửi yêu cầu thanh toán/hoàn tiền) và PPM Query Service (truy vấn lịch sử).  
  * BUM là Producer của TenantDataDeletionRequestedEvent mà PPM Worker tiêu thụ.  
  * NDM là Consumer của các thông báo mà PPM Worker/Command Service yêu cầu gửi.  
  * ALM là Consumer của các sự kiện audit log từ PPM Command Service/Worker.  
  * LZM và RDM là nhà cung cấp dữ liệu tham chiếu cho PPM Query Service/Command Service.  
* **Phụ thuộc Bên ngoài (External Dependencies):**  
  * Database (PostgreSQL, Redis).  
  * Message Brokers (NATS, RabbitMQ).  
  * **Payment Gateway APIs.**  
  * Container Registry.  
  * Kubernetes API.

## **15\. Kết luận**

Tài liệu thiết kế triển khai cho Bounded Context Payment Processing Management (PPM) đã được xây dựng dựa trên tài liệu thiết kế miền PPM và tuân thủ chặt chẽ kiến trúc Microservices, CQRS và Clean Architecture của hệ thống Ecoma. Việc phân tách PPM thành ba đơn vị triển khai riêng biệt (Query Service, Command Service, Worker) là cần thiết để đáp ứng yêu cầu về hiệu năng, khả năng mở rộng và xử lý các loại tác vụ khác nhau (đọc lịch sử, xử lý giao dịch, xử lý webhook). Việc sử dụng PostgreSQL và Redis cho lưu trữ dữ liệu và cache, cùng với tích hợp Payment Gateway, được lựa chọn để đảm bảo tính toàn vẹn, hiệu năng và khả năng mở rộng cần thiết. Các khía cạnh quan trọng về giao tiếp, xử lý lỗi, khả năng phục hồi, kiểm thử và vận hành đã được đề cập, phác thảo các chiến lược và yêu cầu kỹ thuật.

Tài liệu này cung cấp nền tảng vững chắc cho đội ngũ kỹ thuật để tiến hành thiết kế kỹ thuật chi tiết hơn (ví dụ: thiết kế lớp Repository, Gateway, chi tiết implementation của Domain/Application Service, cấu trúc Command/Query/Event payload chi tiết) và bắt đầu quá trình triển khai thực tế Microservice(s) PPM, đảm bảo tuân thủ các nguyên tắc và mục tiêu kiến trúc của hệ thống Ecoma.

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
  * **Payment Gateway API call latency/error rate**

**2\. Module Level Metrics:**

* **Query Module:**  
  * Transaction/Refund query rate  
  * Transaction/Refund query latency  
  * Gateway configuration query rate  
  * Cache hit rate  
  * Query errors  
  * Query performance by complexity  
* **Command Module:**  
  * Payment processing request rate  
  * Refund processing request rate  
  * Command processing latency  
  * Command validation errors  
  * Command business rule violations  
  * Command success rate  
  * Event publication rate  
  * **Payment Gateway API call success/failure rate**  
* **Worker Module:**  
  * **Webhook processing rate**  
  * **Webhook processing latency**  
  * **Failed webhooks count**  
  * Scheduled task execution time  
  * Scheduled task success rate  
  * Dead letter queue growth

**3\. Business Metrics:**

* Payment transaction count (by type, status)  
* Refund count (by status)  
* Payment gateway configuration count  
* Successful payment rate  
* Successful refund rate

### **16.2. Logging**

Tất cả các service trong PPM sẽ triển khai ghi log cấu trúc (structured logging) với các trường thông tin sau:

* TraceId để theo dõi một request hoặc task xuyên suốt các service.  
* SpanId để xác định các bước xử lý cụ thể trong một trace.  
* Thông tin về TenantId, TransactionId, RefundId (nếu có) để dễ dàng lọc log theo context.  
* Log level thích hợp (ERROR, WARN, INFO, DEBUG) tùy theo tầm quan trọng của sự kiện.  
* Thông tin về người dùng thực hiện hành động (UserId).  
* Thông tin về thiết bị/client gửi request (nếu có).  
* **Chi tiết các cuộc gọi đi đến Payment Gateway API (request/response/error \- cẩn thận với dữ liệu nhạy cảm).**  
* **Chi tiết các Webhook nhận được từ Payment Gateway (payload \- cẩn thận với dữ liệu nhạy cảm, processing status).**  
* **Chi tiết các Commands nhận được từ các BC khác.**

## **17\. Health Checks**

Mỗi service trong PPM phải triển khai các health check endpoints để Kubernetes hoặc các hệ thống giám sát khác có thể kiểm tra sức khỏe của service. Các health check này bao gồm:

1. **PPM Query Service:**  
   * **Liveness probe:** Đảm bảo service đang chạy và phản hồi.  
   * **Readiness probe:** Kiểm tra kết nối đến PostgreSQL, Redis và khả năng thực hiện truy vấn cơ bản.  
   * **Startup probe:** Đảm bảo service đã khởi động hoàn tất và sẵn sàng xử lý request.  
2. **PPM Command Service:**  
   * **Liveness probe:** Đảm bảo service đang chạy và phản hồi.  
   * **Readiness probe:** Kiểm tra kết nối đến PostgreSQL, NATS, RabbitMQ và **Payment Gateway API** (nếu kết nối đến Payment Gateway là critical cho Command Service).  
   * **Startup probe:** Đảm bảo service đã khởi động hoàn tất và sẵn sàng xử lý command.  
3. **PPM Worker:**  
   * **Liveness probe:** Đảm bảo service đang chạy và phản hồi.  
   * **Readiness probe:** Kiểm tra kết nối đến PostgreSQL, RabbitMQ và khả năng lắng nghe message/nhận webhook.  
   * **Startup probe:** Đảm bảo service đã khởi động hoàn tất và sẵn sàng xử lý event/task.

## **18\. Data Security**

### **18.1. Dữ liệu Nhạy cảm**

PPM xử lý nhiều loại dữ liệu nhạy cảm. Các biện pháp bảo mật sau được áp dụng cho từng loại:

* **Thông tin giao dịch:** Số tiền, loại tiền tệ, trạng thái giao dịch.  
  * Hạn chế truy cập thông tin giao dịch theo quyền (liên kết với IAM).  
  * Masking thông tin trong log.  
* **Thông tin thanh toán của khách hàng:** Số thẻ, mã CVV, ngày hết hạn, thông tin tài khoản ngân hàng.  
  * **Tuyệt đối không lưu trữ thông tin này trong PPM.** Trách nhiệm này thuộc về Payment Gateway và các dịch vụ tokenization tuân thủ PCI DSS. PPM chỉ lưu trữ token hoặc ID giao dịch từ Payment Gateway.  
* **API Key/Secret của Payment Gateway:**  
  * Lưu trữ cấu hình Payment Gateway trong DB cần được **mã hóa mạnh mẽ**.  
  * Hạn chế truy cập cấu hình gateway theo quyền (liên kết với IAM).  
  * Không bao giờ hiển thị API Key/Secret trong log hoặc phản hồi API.

### **18.2. Mã hóa Dữ liệu**

* **Mã hóa dữ liệu tĩnh (at rest):**  
  * Cấu hình Payment Gateway (API Key/Secret) phải được **mã hóa ở mức ứng dụng** trước khi lưu vào DB.  
  * Dữ liệu nhạy cảm khác được mã hóa trên DB.  
  * Đĩa DB được mã hóa ở cấp hạ tầng.  
* **Mã hóa dữ liệu động (in transit):**  
  * TLS/SSL cho tất cả kết nối API.  
  * Mã hóa cho kết nối DB.  
  * Mã hóa cho kết nối Redis.  
  * Mã hóa cho kết nối message broker.  
  * **TLS/SSL cho các cuộc gọi đi/đến Payment Gateway API/Webhook.**

### **18.3. Quản lý Quyền Truy cập Dữ liệu**

* **Kiểm soát truy cập:**  
  * RBAC cho tất cả API endpoints (liên kết với IAM).  
  * Phân vùng dữ liệu theo tổ chức (tenant).  
  * Kiểm tra quyền cho mọi truy cập dữ liệu (liên kết với IAM).  
  * Nguyên tắc đặc quyền tối thiểu.  
* **Kiểm toán truy cập:**  
  * Ghi log tất cả truy cập dữ liệu nhạy cảm.  
  * Ghi log tất cả thay đổi cấu hình Payment Gateway.  
  * Ghi log tất cả thao tác quản trị.  
  * Tích hợp với ALM cho audit logging.

### **18.4. Phòng chống Tấn công**

* **Phòng chống tấn công phổ biến:**  
  * Rate limiting cho các API công khai.  
  * Xác minh chữ ký cho Webhook từ Payment Gateway.  
  * Các biện pháp phòng chống SQL injection.  
  * Các biện pháp phòng chống XSS.  
* **Phát hiện bất thường:**  
  * Giám sát các mẫu giao dịch bất thường.  
  * Giám sát các yêu cầu hoàn tiền bất thường.  
  * Giám sát các truy cập bất thường vào cấu hình gateway.

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
* **Retry/Circuit Breaker cho các cuộc gọi đến Payment Gateway API.**  
* Manual recovery procedures cho critical failures.

### **19.3. Worker Recovery**

* Automatic retry cho event processing (Webhook Events, TenantDataDeletionRequestedEvent).  
* Idempotent event handlers (đặc biệt cho Webhook).  
* Job tracking và resumption cho scheduled tasks.  
* Manual intervention procedures.  
* Reconciliation process cho các giao dịch có trạng thái không rõ ràng (ví dụ: gọi Payment Gateway API để kiểm tra trạng thái cuối cùng).

## **20\. Data Consistency**

### **20.1. Transactional Consistency**

* Sử dụng DB transactions cho command processing.  
* Optimistic concurrency control.  
* Validation trước khi commit.  
* Phát hiện và giải quyết conflict.

### **20.2. Event-Based Consistency**

* Outbox pattern cho event publication.  
* Idempotent event processing (đặc biệt cho Webhook Events).  
* Message deduplication.  
* Event ordering trong cùng một aggregate.  
* Reconciliation process cho inconsistencies (ví dụ: đồng bộ trạng thái giao dịch với Payment Gateway).

### **20.3. Cache Consistency**

* Cache invalidation dựa trên events.  
* TTL cho cached items.  
* Write-through caching cho critical data (nếu cần).  
* Background refresh cho high-frequency data.  
* Versioning cho cached objects.

## **21\. API Versioning**

### **21.1. API Versioning Strategy**

* Version được đưa vào path URL (ví dụ: /api/v1/ppm/transactions).  
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
2. PPM Worker.  
3. PPM Command Service.  
4. PPM Query Service.

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
   * PPM Worker.  
   * PPM Command Service.  
   * PPM Query Service.  
4. Verify data integrity và service health.  
5. Thông báo cho các dependent services.

## **24\. Performance Requirements**

### **24.1. Latency Requirements**

* **Query Service:**  
  * Transaction query: \< 200ms (P95).  
  * Gateway configuration query: \< 100ms (P95).  
* **Command Service:**  
  * Process Payment request: \< 1s (P95) \- Bao gồm gọi Payment Gateway.  
  * Process Refund request: \< 1s (P95) \- Bao gồm gọi Payment Gateway.  
  * Gateway configuration actions: \< 500ms (P95).  
* **Worker:**  
  * Webhook processing: \< 500ms (P95).  
  * Scheduled tasks: \< 30s (P95).

### **24.2. Throughput Requirements**

* **Query Service:**  
  * Transaction queries: 500 requests/second.  
  * Gateway configuration queries: 100 requests/second.  
* **Command Service:**  
  * Process Payment/Refund requests: 200 requests/second.  
  * Gateway configuration actions: 10 requests/minute.  
* **Worker:**  
  * Webhook processing: 300 webhooks/second.  
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
* Mock Payment Gateway, IAM, NDM, ALM, LZM, RDM, BUM và các external dependencies.  
* Data generators cho test data.

### **25.3. Critical Paths Testing**

* **Payment flows:**  
  * Process Payment request from BUM/ODM/etc.  
  * Interaction with Mock Payment Gateway.  
  * Receiving and processing Payment Successful/Failed webhook.  
  * Publishing Payment Successful/Failed Event.  
* **Refund flows:**  
  * Process Refund request from BUM/ODM.  
  * Interaction with Mock Payment Gateway for refund.  
  * Receiving and processing Refund webhook.  
  * Publishing Refund Processed/Failed Event.  
* **Gateway Management flows:**  
  * Add, update, query gateway configurations.  
* **Data Deletion flows:**  
  * Receiving TenantDataDeletionRequestedEvent from BUM.  
  * Hard deleting PPM data for the tenant.

### **25.4. Non-functional Testing**

* Performance testing (load, stress, endurance).  
* Security testing (penetration testing, vulnerability scanning, đặc biệt cho webhook endpoint và lưu trữ cấu hình gateway).  
* Resilience testing (chaos testing, degraded mode).  
* Data migration testing.