# **Event-Driven Architecture (EDA) - Mô hình giao tiếp cốt lõi của Ecoma**

## **1\. Bối cảnh**

Hệ thống Ecoma được thiết kế như một nền tảng SaaS phức tạp, với các mục tiêu kiến trúc cốt lõi là khả năng mở rộng cao, khả năng chịu lỗi, tính sẵn sàng cao, khả năng bảo trì và sự linh hoạt trong việc tích hợp các thành phần.

Chúng ta đã chọn triển khai hệ thống dưới dạng [Microservices Architecture](/explain-decisions/ma), trong đó các Bounded Context (BC) được phân tách thành các đơn vị triển khai độc lập.

Trong một kiến trúc Microservices, các dịch vụ cần giao tiếp với nhau để thực hiện các luồng nghiệp vụ end-to-end. Có nhiều cách để các dịch vụ giao tiếp, phổ biến nhất là:

- **Giao tiếp đồng bộ (Synchronous Communication):** Dịch vụ gọi trực tiếp API của dịch vụ khác và chờ phản hồi.
- **Giao tiếp bất đồng bộ (Asynchronous Communication):** Dịch vụ gửi một thông điệp hoặc sự kiện và không chờ phản hồi ngay lập tức. Dịch vụ nhận xử lý thông điệp/sự kiện đó vào thời điểm phù hợp (ví dụ: sử dụng Message Queue, Event Bus).

Trong bối cảnh của Ecoma, với số lượng Bounded Context lớn và nhu cầu xử lý các luồng nghiệp vụ phân tán, phức tạp, việc chỉ dựa vào giao tiếp đồng bộ sẽ gặp phải nhiều thách thức.

## **2\. Vấn đề**

Việc chỉ sử dụng giao tiếp đồng bộ giữa các Microservices (đại diện cho các Bounded Context) dẫn đến các vấn đề sau:

- **Sự phụ thuộc chặt chẽ (Tight Coupling):** Dịch vụ gọi (Client) phụ thuộc vào sự sẵn sàng và giao diện API của dịch vụ bị gọi (Server). Nếu dịch vụ Server gặp sự cố hoặc thay đổi API, dịch vụ Client có thể bị ảnh hưởng. Điều này đi ngược lại mục tiêu phân tách độc lập của Microservices.
- **Giảm khả năng chịu lỗi (Reduced Fault Tolerance):** Nếu một dịch vụ trong chuỗi gọi đồng bộ gặp lỗi, toàn bộ chuỗi nghiệp vụ có thể bị gián đoạn.
- **Khó mở rộng độc lập:** Việc mở rộng một dịch vụ có thể yêu cầu mở rộng đồng thời các dịch vụ phụ thuộc vào nó trong các luồng đồng bộ.
- **Khó khăn trong việc thực hiện các luồng nghiệp vụ phân tán:** Các luồng nghiệp vụ phức tạp trải dài qua nhiều BC trở nên khó quản lý với các giao dịch phân tán (distributed transactions) hoặc các cơ chế bù trừ (saga) phức tạp khi chỉ dùng giao tiếp đồng bộ.
- **Khó tích hợp các bên quan tâm khác:** Khi một sự kiện nghiệp vụ xảy ra (ví dụ: OrderCreated), nhiều BC khác nhau (Shipping, Inventory, Payment) có thể cần phản ứng lại. Với giao tiếp đồng bộ, dịch vụ tạo Order sẽ phải biết và gọi trực tiếp tất cả các dịch vụ quan tâm, làm tăng sự phụ thuộc và phức tạp.

Chúng ta cần một cơ chế giao tiếp giữa các Bounded Context giúp giảm thiểu sự phụ thuộc, tăng khả năng chịu lỗi, hỗ trợ mở rộng độc lập và tạo điều kiện thuận lợi cho việc thực hiện các luồng nghiệp vụ phân tán và tích hợp nhiều bên quan tâm.

## **3\. Quyết định**

Chúng tôi quyết định áp dụng **Event-Driven Architecture (EDA)** làm mẫu kiến trúc giao tiếp chính giữa các Bounded Context trong hệ thống Ecoma.

Các Bounded Context sẽ giao tiếp với nhau chủ yếu thông qua việc phát ra (Publish) và lắng nghe (Subscribe) các sự kiện (Events) thông qua một nền tảng Messaging/Eventing trung tâm.

## **4\. Lý do và Cơ sở (Justification)**

EDA là một lựa chọn phù hợp và chiến lược cho hệ thống Ecoma vì những lý do sau:

- **Giảm sự phụ thuộc (Loose Coupling):** Các dịch vụ không gọi trực tiếp lẫn nhau mà giao tiếp thông qua các sự kiện. Dịch vụ phát sự kiện không cần biết có bao nhiêu dịch vụ đang lắng nghe hoặc chúng sẽ xử lý sự kiện đó như thế nào. Dịch vụ lắng nghe chỉ cần quan tâm đến loại sự kiện mà nó cần xử lý. Điều này giúp các BC trở nên độc lập hơn.
- **Tăng khả năng chịu lỗi (Increased Fault Tolerance):** Nếu một dịch vụ xử lý sự kiện gặp sự cố, dịch vụ phát sự kiện không bị ảnh hưởng. Các sự kiện có thể được lưu trữ trong Message Broker và xử lý sau khi dịch vụ gặp sự cố phục hồi.
- **Tăng khả năng mở rộng (Increased Scalability):** Các thành phần xử lý sự kiện (Event Consumers) có thể được mở rộng độc lập dựa trên tải lượng sự kiện.
- **Hỗ trợ các luồng nghiệp vụ phân tán (Distributed Business Processes):** EDA là nền tảng tự nhiên để triển khai các mẫu như Saga Pattern để quản lý các giao dịch phân tán, đảm bảo tính nhất quán cuối cùng (eventual consistency) trong hệ thống.
- **Dễ dàng tích hợp các bên quan tâm mới:** Khi có một BC mới cần phản ứng lại một sự kiện đã tồn tại, chỉ cần thêm một Event Consumer mới lắng nghe sự kiện đó mà không cần thay đổi dịch vụ phát sự kiện.
- **Tạo ra lịch sử sự kiện (Event History):** Nếu sử dụng Event Sourcing (có thể được áp dụng cho một số BC quan trọng), luồng sự kiện sẽ tạo ra một bản ghi bất biến về tất cả các thay đổi trạng thái trong hệ thống, rất hữu ích cho việc kiểm tra, gỡ lỗi và phân tích dữ liệu.
- **Phù hợp với DDD:** Domain Events là một khái niệm cốt lõi trong DDD, đại diện cho những gì quan trọng đã xảy ra trong miền nghiệp vụ. EDA cung cấp cơ chế để các Domain Event này có thể được phát tán và xử lý bởi các BC khác.
- **Phù hợp với CQRS:** EDA thường được sử dụng để cập nhật các Read Model trong CQRS một cách bất đồng bộ từ các Domain Event được phát ra bởi Command Side.

## **5\. EDA được áp dụng như thế nào trong Ecoma?**

Chúng ta sẽ áp dụng EDA bằng cách:

- **Xác định các Sự kiện Quan trọng:** Trong quá trình mô hình hóa DDD cho mỗi BC, chúng ta sẽ xác định các Domain Event quan trọng đại diện cho những thay đổi trạng thái đáng kể trong miền (ví dụ: OrderCreatedEvent, ProductPriceUpdatedEvent, UserRegisteredEvent).
- **Sử dụng Nền tảng Messaging/Eventing:** Chúng ta sẽ sử dụng một Message Broker hoặc Event Bus (ví dụ: Kafka, RabbitMQ, AWS SQS/SNS) làm kênh trung gian để các BC phát và nhận sự kiện.
- **Phát sự kiện (Publishing Events):** Khi một Command được xử lý thành công trong một BC (ví dụ: thông qua Command Handler trong CQRS), BC đó sẽ phát ra các Domain Event tương ứng lên Message Broker.
- **Lắng nghe sự kiện (Subscribing to Events):** Các BC khác quan tâm đến một loại sự kiện nào đó sẽ đăng ký (subscribe) để nhận các sự kiện đó từ Message Broker và xử lý chúng bằng các Event Consumer hoặc Integration Event Handlers.
- **Phân biệt Domain Events và Integration Events:** Domain Events là các sự kiện xảy ra bên trong một BC. Khi một Domain Event cần được chia sẻ ra bên ngoài BC để các BC khác lắng nghe, nó sẽ được chuyển đổi thành Integration Event (có thể lược bỏ một số chi tiết nội bộ) trước khi publish lên Message Broker.

**Ví dụ:**

1. Trong Bounded Context **Order Management (ODM)**, khi một đơn hàng mới được tạo thành công, ODM sẽ phát ra sự kiện OrderCreatedEvent.
2. Bounded Context **Inventory Control Management (ICM)** lắng nghe sự kiện OrderCreatedEvent để trừ số lượng tồn kho của các sản phẩm trong đơn hàng.
3. Bounded Context **Shipping & Fulfillment Management (SFM)** lắng nghe sự kiện OrderCreatedEvent để bắt đầu quy trình đóng gói và vận chuyển.
4. Bounded Context **Notification Delivery Management (NDM)** lắng nghe sự kiện OrderCreatedEvent để gửi email xác nhận đơn hàng cho khách hàng.
5. Bounded Context **Billing & Usage Management (BUM)** lắng nghe sự kiện OrderCreatedEvent để ghi nhận mức sử dụng liên quan đến đơn hàng (nếu có).

## **6\. Lợi ích**

- **Tăng cường tính phân tách (Decoupling):** Giảm sự phụ thuộc trực tiếp giữa các BC.
- **Cải thiện khả năng chịu lỗi và độ bền:** Hệ thống có thể tiếp tục hoạt động ngay cả khi một số thành phần gặp sự cố tạm thời.
- **Nâng cao khả năng mở rộng:** Cho phép mở rộng độc lập các thành phần phát và xử lý sự kiện.
- **Linh hoạt tích hợp:** Dễ dàng thêm các bên tham gia mới vào luồng nghiệp vụ bằng cách lắng nghe các sự kiện hiện có.
- **Hỗ trợ mạnh mẽ cho Microservices và DDD:** Là mẫu kiến trúc giao tiếp tự nhiên cho các hệ thống phân tán dựa trên BC.

## **7\. Hậu quả (Consequences)**

- **Tăng độ phức tạp trong quản lý luồng nghiệp vụ:** Việc theo dõi một luồng nghiệp vụ trải dài qua nhiều BC thông qua các sự kiện có thể khó khăn hơn so với gọi đồng bộ. Cần các công cụ giám sát và tracing hiệu quả.
- **Đường cong học tập:** Đội ngũ cần làm \* **Quản lý sự nhất quán cuối cùng (Eventual Consistency):** Các thay đổi trạng thái được lan truyền bất đồng bộ thông qua sự kiện, dẫn đến mô hình nhất quán cuối cùng. Cần thiết kế hệ thống để xử lý và chấp nhận điều này.  
  quen với các khái niệm và công nghệ của EDA (Message Broker, Event Consumers, Idempotency).
- **Thách thức trong việc xử lý lỗi và thử lại:** Cần xây dựng cơ chế xử lý lỗi và thử lại mạnh mẽ cho các Event Consumer để đảm bảo không mất sự kiện hoặc xử lý trùng lặp.

## **8\. Kết luận**

Việc áp dụng Event-Driven Architecture là một quyết định kiến trúc nền tảng, thiết yếu cho hệ thống Ecoma để đạt được các mục tiêu về khả năng mở rộng, chịu lỗi và linh hoạt trong môi trường Microservices. Bằng cách giao tiếp thông qua sự kiện, các Bounded Context sẽ trở nên độc lập hơn, cho phép hệ thống phát triển và thích ứng hiệu quả với sự thay đổi của nghiệp vụ. Mặc dù có những thách thức liên quan đến quản lý sự phức tạp và tính nhất quán cuối cùng, lợi ích mà EDA mang lại là rất quan trọng để xây dựng một nền tảng SaaS mạnh mẽ và bền vững.
