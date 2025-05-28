# **Bounded Context Audit Log Management (ALM)**

## **1\. Giới thiệu**

Tài liệu này cung cấp mô tả chi tiết về Bounded Context **Audit Log Management (ALM)** trong hệ thống Ecoma. ALM là một trong những Bounded Context cốt lõi (Core Bounded Context), chịu trách nhiệm thu thập, lưu trữ và cung cấp khả năng truy vấn các bản ghi kiểm tra (audit logs) từ tất cả các Bounded Context khác trong hệ thống.

ALM đóng vai trò là một kho lưu trữ tập trung và đáng tin cậy cho lịch sử hoạt động của hệ thống, giúp theo dõi ai đã làm gì, khi nào, ở đâu và tại sao, phục vụ cho các mục đích bảo mật, kiểm tra nội bộ, tuân thủ quy định và phân tích sự cố.

## **2\. Phạm vi của Tài liệu**

Tài liệu này tập trung vào việc định nghĩa và mô tả Bounded Context ALM ở cấp độ thiết kế miền (domain design), cung cấp đủ chi tiết để hỗ trợ việc thiết kế các Domain Service và Application Service. Cụ thể, tài liệu này bao gồm:

- Xác định vai trò và trách nhiệm chính của ALM.
- Mô tả các khái niệm và thực thể cốt lõi trong mô hình domain của ALM ở cấp độ chi tiết hơn, bao gồm các Aggregate Root, Entity và Value Object với các thuộc tính chính, cung cấp thêm ví dụ và ngữ cảnh.
- Định nghĩa Ngôn ngữ Chung (Ubiquitous Language) trong phạm vi ALM.
- Mô tả **Các Khía cạnh Quan trọng của Miền ALM**, bao gồm tính bất biến của bản ghi log, chính sách lưu trữ (retention), yêu cầu hiệu năng và mô hình nhất quán cho dữ liệu log.
- Làm rõ các **tương tác chính giữa ALM và các Bounded Context khác**, đặc biệt là cách ALM nhận các bản ghi audit log (qua Event) và cách các BC khác truy vấn dữ liệu (qua Query), bao gồm cả cơ chế ủy quyền.
- Phác thảo các **Use cases** chính có sự tham gia của ALM, **được phân nhóm theo chức năng chính và gán mã use case**, tập trung vào actor, mục đích và các Domain/Application Service liên quan, bao gồm các luồng nghiệp vụ như thu thập và lưu trữ bản ghi audit log, truy vấn các bản ghi audit log, và quản lý vòng đời dữ liệu (retention).
- Xác định ranh giới nghiệp vụ của ALM.
- Đề xuất các Domain Service và Application Service tiềm năng trong ALM với mô tả chi tiết hơn về trách nhiệm của từng Service.
- Làm rõ các quy tắc nghiệp vụ liên quan đến việc thu thập, lưu trữ (bao gồm tính bất biến và mô hình nhất quán dự kiến) và truy vấn audit log, bao gồm cả cấu trúc logic của chính sách retention và tiêu chí truy vấn.
- Liệt kê và mô tả các **Domain Events** mà ALM tương tác, được chia thành các sự kiện BUM **lắng nghe và xử lý** (Consumed Events), bao gồm payload dự kiến của từng event.

**Trong phạm vi tài liệu này:**

- Các khái niệm về **Commands** (yêu cầu thực hiện một hành động) và **Queries** (yêu cầu lấy dữ liệu) được đề cập để mô tả cách các Bounded Context khác tương tác với ALM (gửi log, truy vấn log) và cách các luồng nghiệp vụ được kích hoạt thông qua các **Application Services**.
- Vai trò và trách nhiệm của **Domain Services** và **Application Services** trong việc xử lý logic nghiệp vụ và điều phối các tương tác được mô tả ở cấp độ chức năng.
- Các **Domain Events** quan trọng được xác định để mô tả những thay đổi trạng thái nghiệp vụ mà ALM phát ra (chủ yếu là sự kiện xác nhận đã lưu log).
- Các quy tắc nghiệp vụ liên quan đến việc thu thập, lưu trữ (bao gồm tính bất biến và mô hình nhất quán dự kiến) và truy vấn audit log được mô tả ở cấp độ thiết kế miền, bao gồm cả cấu trúc logic của chính sách retention và tiêu chí truy vấn.
- **Cơ chế ủy quyền** cho việc truy vấn dữ liệu audit log được mô tả ở cấp độ tương tác giữa các Bounded Context.
- Khả năng phân loại audit log theo **danh mục** và **mức độ nghiêm trọng** được đề cập trong mô hình domain.

**Ngoài phạm vi tài liệu này (thuộc về thiết kế kỹ thuật chi tiết):**

- Định nghĩa chính xác cấu trúc dữ liệu (payload) chi tiết của từng Command, Query và Domain Event (chỉ mô tả mục đích và thông tin cốt lõi).
- Định nghĩa chi tiết các API Interface (chỉ mô tả chức năng và tương tác).
- Chi tiết cài đặt kỹ thuật của Microservice ALM (ngôn ngữ lập trình, framework, kiến trúc nội bộ chi tiết).
- Cấu trúc cơ sở dữ liệu chi tiết (schema) của ALM, bao gồm chiến lược lưu trữ dữ liệu lớn (ví dụ: phân vùng, sharding) và tối ưu hóa truy vấn (ví dụ: indexing chiến lược).
- Các quyết định công nghệ cụ thể bên trong ALM (ví dụ: loại cơ sở dữ liệu sử dụng \- RDBMS, NoSQL, Search Engine; công cụ Message Broker).
- Luồng dữ liệu chi tiết đến cấp độ từng trường thông tin giữa ALM và các BC khác.
- Cấu hình hạ tầng triển khai cụ thể cho Microservice ALM.
- Thiết kế giao diện người dùng để xem và lọc audit logs.
- Các chính sách retention dữ liệu chi tiết cho audit logs (ví dụ: lưu trữ trong bao lâu cho từng loại log).

## **3\. Vai trò và Trách nhiệm Chính**

Bounded Context ALM chịu trách nhiệm quản lý các bản ghi kiểm tra. Các trách nhiệm chính bao gồm:

- **Thu thập Audit Logs:** Tiếp nhận các bản ghi audit log từ tất cả các Bounded Context khác trong hệ thống một cách đáng tin cậy thông qua việc lắng nghe Domain Events. Các BC khác chịu trách nhiệm xác định khi nào một hành động cần được ghi log và tạo bản ghi log đó với đầy đủ thông tin ngữ cảnh. ALM chỉ nhận và xử lý việc lưu trữ.
- **Lưu trữ Audit Logs:** Lưu trữ các bản ghi audit log một cách an toàn, đáng tin cậy, có cấu trúc và **có khả năng mở rộng cao** để xử lý volume dữ liệu lớn theo thời gian. Dữ liệu cần được lưu trữ theo cách tối ưu cho việc truy vấn sau này.
- **Cung cấp Khả năng Truy vấn:** Cung cấp các API hoặc cơ chế hiệu quả để các bên có quyền (ví dụ: người dùng nội bộ Ecoma có vai trò phù hợp, các hệ thống giám sát, công cụ BI) có thể tìm kiếm, lọc và truy xuất các bản ghi audit log dựa trên nhiều tiêu chí khác nhau (người dùng, tổ chức, loại hành động, thời gian, thực thể bị ảnh hưởng, dữ liệu ngữ cảnh cụ thể, danh mục, mức độ nghiêm trọng, v.v.). Việc truy cập dữ liệu audit log được kiểm soát chặt chẽ thông qua **ủy quyền với IAM**.
- **Đảm bảo Tính Toàn vẹn và Bất biến:** Đảm bảo rằng các bản ghi audit log sau khi được lưu trữ sẽ không bị thay đổi hoặc xóa một cách trái phép bởi bất kỳ ai (kể cả người dùng nội bộ hoặc các hệ thống khác), ngoại trừ quy trình xóa theo chính sách retention.
- **Quản lý Vòng đời Dữ liệu (Retention):** Áp dụng các chính sách lưu trữ dữ liệu đã được định nghĩa để tự động xác định và xóa các bản ghi audit log cũ sau một khoảng thời gian nhất định. Quy trình này cần được thực hiện một cách an toàn và có thể kiểm soát.

## **4\. Quy ước về ID trong ALM**

Tất cả các Aggregate Root (ví dụ: AuditLogEntry, RetentionPolicy, ...) và Entity trong ALM đều sử dụng ID dạng UUID v4 (chuẩn RFC 4122, kiểu string) làm định danh nghiệp vụ duy nhất. Các trường tham chiếu như entityId, tenantId, eventId, ... cũng sử dụng UUID v4 để đảm bảo nhất quán và traceability giữa các Bounded Context trong toàn hệ thống. ID được sinh ra tại thời điểm tạo mới AR/Entity, sử dụng thư viện chuẩn (ví dụ: uuid package cho Node.js). Lưu ý: MongoDB vẫn sử dụng \_id (ObjectId) cho mục đích nội bộ, nhưng trường id nghiệp vụ (id, entityId, tenantId, ...) luôn là UUID v4.

## **5\. Mô hình Domain**

Trong phạm vi Bounded Context ALM, mô hình domain tập trung vào hai Aggregate Root chính:

### **Aggregate Roots:**

- **AuditLogEntry:** Là Aggregate Root đại diện cho một bản ghi kiểm tra duy nhất về một hành động cụ thể trong hệ thống. Đây là đơn vị dữ liệu cốt lõi mà ALM quản lý.

  - **ID:** Unique identifier (UUID). Được tạo bởi ALM khi nhận log.
  - **Timestamp:** Thời điểm chính xác khi hành động xảy ra (hoặc khi log được tạo bởi BC nguồn). Đây là trường quan trọng cho việc sắp xếp và lọc theo thời gian.
  - **Initiator:** Thông tin về người hoặc hệ thống đã thực hiện hành động (Initiator Value Object).
  - **BoundedContext:** Tên định danh của Bounded Context đã phát sinh bản ghi log (ví dụ: "IAM", "BUM", "NDM", "PIM"). Giúp phân loại log theo nguồn.
  - **ActionType:** Loại hành động đã xảy ra (ví dụ: "User.Created", "Order.Updated", "Subscription.Cancelled", "Product.Viewed", "Login.Success", "Login.Failure"). Nên tuân thủ một quy ước đặt tên nhất quán trên toàn hệ thống (ví dụ: \[EntityType\].\[Action\], \[Context\].\[Action\]).
  - **Category:** Danh mục của bản ghi audit log. Giúp phân loại log cho mục đích báo cáo và tuân thủ.
  - **EntityId:** ID của thực thể nghiệp vụ bị ảnh hưởng bởi hành động (ví dụ: User ID, Order ID, Subscription ID, Product ID). Có thể null nếu hành động không liên quan đến một thực thể cụ thể (ví dụ: đăng nhập thất bại không liên quan đến User ID cụ thể).
  - **EntityType:** Loại thực thể nghiệp vụ bị ảnh hưởng (ví dụ: "User", "Order", "Subscription", "Product"). Có thể null.
  - **TenantId:** ID của tổ chức khách hàng liên quan đến hành động (liên kết với IAM). Có thể null nếu hành động là nội bộ Ecoma hoặc không liên quan đến tổ chức khách hàng cụ thể. Trường này rất quan trọng cho việc lọc log theo từng khách hàng.
  - **ContextData:** Dữ liệu ngữ cảnh bổ sung liên quan đến hành động (AuditContext Value Object). Chứa các thông tin chi tiết cần thiết để hiểu rõ hơn về hành động (ví dụ: các trường dữ liệu đã thay đổi \- {"fieldName": {"oldValue": "...", "newValue": "..."}}, địa chỉ IP, user agent, ID phiên làm việc, tham số yêu cầu). Cấu trúc dữ liệu này có thể thay đổi tùy thuộc vào loại hành động và BC phát sinh log, nên cần linh hoạt (ví dụ: sử dụng JSON hoặc dạng key-value linh hoạt khác). **Lưu ý:** Cần có quy định về việc xử lý dữ liệu nhạy cảm trong ContextData (ví dụ: không lưu trữ mật khẩu, thông tin thẻ tín dụng trực tiếp).

- **RetentionPolicy:**
  - **ID:** Unique identifier (UUID). Được tạo bởi ALM khi tạo policy.
  - **Name:** Tên chính sách.
  - **Description:** Mô tả chính sách.
  - **IsActive:** Trạng thái hoạt động của policy (true/false).
  - **CreatedAt:** Thời điểm policy được tạo.
  - **UpdatedAt:** Thời điểm policy được cập nhật gần nhất.
  - **BoundedContext:** Optional, áp dụng cho BC cụ thể.
  - **ActionType:** Optional, áp dụng cho loại hành động cụ thể.
  - **EntityType:** Optional, áp dụng cho loại thực thể cụ thể.
  - **TenantId:** Optional, áp dụng cho Tenant cụ thể.
  - **RetentionDays:** Số ngày lưu trữ (bắt buộc, số nguyên dương, đơn vị là ngày).
  - **Behavior:**
    - **Create/Update/Delete:** Cho phép CRUD policy qua Application Service.
    - **Activate/Deactivate:** Cho phép bật/tắt policy.
    - **Audit:** Ghi lại lịch sử thay đổi policy (ai, khi nào, thay đổi gì).
    - **Apply:** Được sử dụng bởi Retention Worker để xác định log cần xóa.

**Value Objects:**

- **Initiator:** Thông tin về người hoặc hệ thống đã thực hiện hành động.
  - **Type:** Loại initiator ("User", "System", "API", "Integration"). Giúp phân loại nguồn gốc hành động.
  - **Id:** ID định danh duy nhất của initiator trong hệ thống (ví dụ: User ID từ IAM, ID của hệ thống tích hợp). Có thể null nếu Type là "System" chung chung hoặc không có ID cụ thể.
  - **Name:** Tên hiển thị hoặc mô tả ngắn gọn về initiator (ví dụ: email người dùng, tên của scheduled job, tên của hệ thống tích hợp).
- **AuditContext:** Dữ liệu ngữ cảnh bổ sung.
  - **Value:** Dictionary/Map\<string, object\> hoặc JSON object. Chứa các cặp key-value mô tả chi tiết hành động. Ví dụ:
    - Đối với hành động cập nhật: {"changedFields": {"productName": {"oldValue": "A", "newValue": "B"}, "price": {"oldValue": 100, "newValue": 120}}}
    - Đối với hành động truy cập: {"ipAddress": "192.168.1.1", "userAgent": "Mozilla/5.0...", "sessionId": "abcxyz"}
    - Đối với hành động liên quan đến tài nguyên: {"resourceName": "Invoice \#123"}

## **6\. Ngôn ngữ Chung (Ubiquitous Language)**

Trong Bounded Context ALM, các thuật ngữ sau đây có ý nghĩa cụ thể và nhất quán:

- **Audit Log:** Một bản ghi về một hoạt động hoặc sự kiện quan trọng trong hệ thống.
- **Audit Log Entry:** Một bản ghi audit log duy nhất, là đơn vị dữ liệu cốt lõi trong ALM.
- **Initiator:** Cá nhân, hệ thống hoặc quy trình đã thực hiện hành động được ghi log.
- **Action Type:** Loại hành động cụ thể được ghi log (ví dụ: tạo, cập nhật, xóa, đăng nhập, xem báo cáo, thay đổi cấu hình).
- **Category:** Danh mục phân loại audit log (ví dụ: Security, Operational).
- **Severity:** Mức độ nghiêm trọng của hành động được ghi log.
- **Context Data:** Dữ liệu bổ sung có cấu trúc cung cấp ngữ cảnh chi tiết cho bản ghi audit log.
- **Persistence:** Quá trình lưu trữ bản ghi audit log một cách bền vững và an toàn.
- **Ingestion:** Quá trình thu thập (nhận) các bản ghi audit log từ các nguồn khác.
- **Querying:** Quá trình tìm kiếm, lọc và truy xuất các bản ghi audit log đã lưu trữ.
- **Retention Policy:** Một Aggregate Root đại diện cho một chính sách lưu trữ dữ liệu audit log, có vòng đời, định danh, trạng thái, version, và được quản lý động (CRUD) trong hệ thống. Chính sách này quy định trực tiếp các điều kiện áp dụng (boundedContext, actionType, entityType, tenantId) và số ngày lưu trữ (retentionDays, đơn vị là ngày).

## **7\. Các Khía cạnh Quan trọng của Miền ALM**

Phần này mô tả các cấu trúc, quy tắc và khái niệm nghiệp vụ quan trọng chi phối hoạt động của Bounded Context ALM.

### **7.1. Tính Bất biến của Bản ghi Audit Log**

Một khi bản ghi audit log đã được tạo và lưu trữ thành công trong ALM, nó được coi là bất biến. Điều này có nghĩa là không có bất kỳ hành vi nghiệp vụ nào (thông qua Domain Service hoặc Application Service) cho phép cập nhật hoặc xóa một bản ghi audit log cụ thể, ngoại trừ quy trình xóa tự động theo chính sách retention. Tính bất biến là yếu tố quan trọng để đảm bảo tính tin cậy và bằng chứng của dữ liệu kiểm tra.

### **7.2. Chính sách Lưu trữ Dữ liệu (Retention Policy)**

ALM quản lý vòng đời của dữ liệu audit log thông qua các chính sách lưu trữ. Mỗi chính sách retention xác định trực tiếp các điều kiện áp dụng (có thể gồm: boundedContext, actionType, entityType, tenantId) và số ngày lưu trữ (retentionDays, đơn vị là ngày) mà các bản ghi log sẽ được giữ lại trước khi bị xóa tự động. Nếu cần retention khác nhau cho các điều kiện khác nhau, tạo nhiều policy. Quy trình áp dụng chính sách retention cần được thực hiện định kỳ và an toàn để tránh mất dữ liệu trước thời hạn hoặc gây ảnh hưởng đến hiệu năng hệ thống.

### **7.3. Yêu cầu Hiệu năng Truy vấn**

Mặc dù ALM có thể lưu trữ lượng dữ liệu rất lớn theo thời gian, việc truy vấn các bản ghi audit log cần có hiệu năng cao. Người dùng hoặc hệ thống truy vấn cần có khả năng tìm kiếm, lọc và truy xuất dữ liệu nhanh chóng dựa trên nhiều tiêu chí khác nhau (thời gian, người dùng, loại hành động, v.v.). Điều này đòi hỏi ALM phải có chiến lược lưu trữ và indexing được tối ưu hóa cho các truy vấn phức tạp.

### **7.4. Mô hình Nhất quán cho Dữ liệu Audit Log**

Do ALM thu thập log thông qua việc lắng nghe Domain Events từ các BC khác một cách bất đồng bộ, mô hình nhất quán cho dữ liệu audit log thường là **Eventually Consistent**. Điều này có nghĩa là có thể có một độ trễ nhỏ giữa thời điểm một hành động xảy ra trong một BC nguồn và thời điểm bản ghi log tương ứng xuất hiện và có thể truy vấn được trong ALM. Các BC tiêu thụ dữ liệu log cần hiểu và chấp nhận mô hình nhất quán này.

## **8\. Tương tác với các Bounded Context khác**

ALM là một Bounded Context thụ động (passive) ở khía cạnh thu thập log – nó lắng nghe các sự kiện từ các BC khác. ALM là một Bounded Context chủ động (active) ở khía cạnh cung cấp dữ liệu khi có yêu cầu truy vấn.

- **Tương tác với Core BCs và Feature BCs (Nguồn phát sinh Log):**
  - **Tất cả các BC khác (IAM, BUM, NDM, LZM, RDM, PIM, DAM, ITM, CRM, HRM, WPM, MPM, OSM, ODM, SFM, PPM, ICM, FAM):** Đây là nguồn phát sinh các bản ghi audit log. Khi một hành động quan trọng xảy ra trong một BC, BC đó sẽ phát ra một Domain Event (ví dụ: UserLoggedInEvent từ IAM, SubscriptionPlanChangedEvent từ BUM, NotificationTemplateCreatedEvent từ NDM, ProductCreatedEvent từ PIM, OrderShippedEvent từ SFM).
  - **Cơ chế:** Các BC phát sinh log không gọi trực tiếp ALM. Thay vào đó, họ phát ra một loại Domain Event chung để yêu cầu ALM ghi log, cụ thể là **AuditLogRequestedEvent**, thông qua Message Broker.
  - **ALM lắng nghe Event:** ALM sử dụng IngestAuditLogCommandHandler để xử lý sự kiện **AuditLogRequestedEvent** từ Message Broker.
- **Tương tác với các BC hoặc hệ thống cần truy vấn log (Người dùng dữ liệu Log):**
  - **IAM:** Có thể cần truy vấn log để hiển thị lịch sử đăng nhập của người dùng.
  - **Giao diện Admin:** Cần truy vấn log để hiển thị hoạt động của hệ thống cho người dùng nội bộ có quyền.
  - **Hệ thống Giám sát/SIEM (Security Information and Event Management):** Có thể cần pull log từ ALM API để phân tích bảo mật.
  - **Công cụ BI (Business Intelligence):** Có thể cần truy vấn log để phân tích hành vi người dùng hoặc hoạt động kinh doanh.
  - **Cơ chế:** Các hệ thống này sẽ gửi Query đến ALM API và được xử lý bởi các Query Handlers tương ứng.
  - **Ủy quyền:** Các Query đến ALM API cần được ủy quyền bởi IAM để đảm bảo chỉ các bên có quyền mới có thể truy cập dữ liệu log. **ALM đóng vai trò là Policy Enforcement Point (PEP), gọi IAM (Policy Decision Point - PDP) để xác minh quyền truy cập dựa trên danh tính của bên gọi và các tiêu chí trong Query (ví dụ: có được xem log của Tenant X hay không, có được xem log bảo mật hay không).**

## **9\. Use cases**

Dưới đây là mô tả các use case chính có sự tham gia của ALM, được phân loại theo Commands (các yêu cầu thay đổi trạng thái), Queries (các yêu cầu truy vấn dữ liệu) và Background tasks (các tác vụ chạy nền, thường là bất đồng bộ hoặc theo lịch trình). Phân loại này phù hợp với kiến trúc CQRS và cách ALM được thiết kế để xử lý các loại yêu cầu khác nhau.

### **9.1. Commands (Thay đổi trạng thái)**

Nhóm này bao gồm các use case liên quan đến việc thay đổi trạng thái dữ liệu trong Bounded Context ALM (ví dụ: thêm mới, xóa dữ liệu). Các commands thường được xử lý bất đồng bộ thông qua Eventing hoặc các tác vụ nền.

- **ALM-UC-8.1.1: Thu thập và Lưu trữ Audit Log Entry**
  - **Loại:** Command / Background Task (Event-driven)
  - **Actor:** Các Bounded Context khác (IAM, BUM, NDM, v.v.), Hệ thống (Message Broker).
  - **Mục đích:** Nhận các bản ghi audit log từ các BC nguồn và lưu trữ chúng một cách đáng tin cậy vào kho dữ liệu của ALM.
  - **Mô tả:** ALM lắng nghe sự kiện **AuditLogRequestedEvent** được phát ra bởi các BC khác. Khi nhận được Event này, ALM Ingestion Worker (là một Background Task) sẽ xử lý Event payload, tạo và lưu trữ một bản ghi AuditLogEntry mới. Đây là một Command vì nó thay đổi trạng thái của hệ thống bằng cách thêm dữ liệu mới.
  - **Use Case Handler:** IngestAuditLogCommandHandler xử lý việc tạo và lưu trữ AuditLogEntry. Sử dụng Repository để tương tác với kho dữ liệu.
- **ALM-UC-8.3.1: Quản lý Vòng đời Dữ liệu (Retention)**
  - **Loại:** Command / Background Task (Scheduled)
  - **Actor:** Hệ thống (Scheduled Task).
  - **Mục đích:** Tự động xác định và xóa các bản ghi audit log đã hết hạn theo chính sách lưu trữ đã định nghĩa.
  - **Mô tả:** Hệ thống (thông qua Scheduled Task) sẽ định kỳ kích hoạt quy trình quản lý retention. ALM Scheduled Worker (là một Background Task) sẽ thực hiện Command này bằng cách xác định các bản ghi audit log đã cũ dựa trên các Retention Policy đã cấu hình và tiến hành xóa chúng khỏi kho lưu trữ. Đây là một Command vì nó thay đổi trạng thái bằng cách loại bỏ dữ liệu.
  - **Use Case Handler:** DeleteExpiredAuditLogsCommandHandler xử lý việc xác định và xóa các bản ghi hết hạn. Sử dụng Repository để thực hiện xóa.

### **9.2. Queries (Truy vấn dữ liệu)**

Nhóm này tập trung vào việc cung cấp khả năng tìm kiếm, lọc và truy xuất các bản ghi audit log đã lưu trữ mà không làm thay đổi trạng thái của hệ thống.

- **ALM-UC-8.2.1: Truy vấn Audit Logs**
  - **Loại:** Query
  - **Actor:** Người dùng nội bộ Ecoma (qua giao diện Admin), Hệ thống giám sát/BI.
  - **Mục đích:** Tìm kiếm, lọc và truy xuất các bản ghi audit log đã lưu trữ dựa trên nhiều tiêu chí khác nhau.
  - **Mô tả:** Actor gửi yêu cầu (Query) đến ALM Query Service. Query Handler tương ứng sẽ xử lý Query Criteria, thực hiện kiểm tra ủy quyền với IAM, và sử dụng Repository để truy xuất dữ liệu audit log mà không làm thay đổi chúng. Kết quả truy vấn (có phân trang) sẽ được trả về cho Actor.
  - **Use Case Handler:** GetAuditLogsQueryHandler xử lý việc truy vấn và lọc dữ liệu. Gọi IAM để kiểm tra ủy quyền. Sử dụng Repository để tương tác với kho dữ liệu.

### **9.3. Background Tasks**

Như đã phân loại ở trên, các Use Case **ALM-UC-8.1.1** và **ALM-UC-8.3.1** được xử lý dưới dạng Background Tasks để đảm bảo hiệu năng, khả năng mở rộng và độ tin cậy cho các tác vụ bất đồng bộ (như Ingestion từ Event) và các tác vụ định kỳ (như Retention). Chúng tương ứng với các đơn vị triển khai ALM Ingestion Worker (Event-driven Background) và ALM Scheduled Worker (Scheduled Background).

### **9.4. CRUD Retention Policy**

- **ALM-UC-8.4.1: Tạo mới Retention Policy**

  - **Loại:** Command
  - **Actor:** Quản trị viên hệ thống (qua giao diện Admin hoặc API)
  - **Mục đích:** Tạo mới một Retention Policy với các điều kiện áp dụng và số ngày lưu trữ cụ thể.
  - **Mô tả:** Actor gửi yêu cầu tạo policy, Command Handler kiểm tra quyền, validate dữ liệu, tạo RetentionPolicy AR và lưu vào database.
  - **Use Case Handler:** CreateRetentionPolicyCommandHandler

- **ALM-UC-8.4.2: Cập nhật Retention Policy**

  - **Loại:** Command
  - **Actor:** Quản trị viên hệ thống
  - **Mục đích:** Cập nhật thông tin, điều kiện áp dụng, số ngày lưu trữ, trạng thái của policy.
  - **Mô tả:** Actor gửi yêu cầu cập nhật, Command Handler kiểm tra quyền, validate, cập nhật AR, lưu lại version mới, ghi audit.
  - **Use Case Handler:** UpdateRetentionPolicyCommandHandler

- **ALM-UC-8.4.3: Xóa Retention Policy**

  - **Loại:** Command
  - **Actor:** Quản trị viên hệ thống
  - **Mục đích:** Xóa policy không còn sử dụng.
  - **Mô tả:** Actor gửi yêu cầu xóa, Command Handler kiểm tra quyền, validate, xóa AR khỏi database, ghi audit.
  - **Use Case Handler:** DeleteRetentionPolicyCommandHandler

- **ALM-UC-8.4.4: Kích hoạt/Vô hiệu hóa Retention Policy**

  - **Loại:** Command
  - **Actor:** Quản trị viên hệ thống
  - **Mục đích:** Bật/tắt policy mà không xóa khỏi hệ thống.
  - **Mô tả:** Actor gửi yêu cầu, Command Handler cập nhật trạng thái isActive của policy.
  - **Use Case Handler:** ActivateRetentionPolicyCommandHandler/DeactivateRetentionPolicyCommandHandler

## **10\. Cơ chế thực thi Retention Policy trong ALM**

### **10.1. Tổng quan**

Cơ chế thực thi Retention Policy trong ALM nhằm đảm bảo các bản ghi audit log được lưu trữ đúng thời hạn quy định, tự động xóa các bản ghi đã hết hạn dựa trên các policy do quản trị viên cấu hình. Việc này giúp tối ưu chi phí lưu trữ, đáp ứng yêu cầu tuân thủ và bảo mật dữ liệu.

### **10.2. Quy trình tổng thể**

1. **Lên lịch thực thi:** Một tác vụ nền (Retention Worker) sẽ được kích hoạt định kỳ (ví dụ: hàng ngày, hàng giờ) hoặc theo sự kiện trigger.
2. **Tải các Retention Policy đang hoạt động:** Worker truy vấn database để lấy tất cả các Retention Policy có trạng thái `isActive = true`.
3. **Duyệt từng policy:** Với mỗi policy, xác định điều kiện áp dụng (boundedContext, actionType, entityType, tenantId) và số ngày lưu trữ (retentionDays).
4. **Xây dựng filter truy vấn từ policy:** Các trường filter có thể gồm: `boundedContext`, `actionType`, `entityType`, `tenantId`, v.v. Tính toán thời điểm hết hạn: `expireBefore = now - retentionDays` (so sánh với trường `timestamp` hoặc `createdAt` của log).
5. **Truy vấn và xác định các log hết hạn:** Truy vấn các bản ghi audit log thỏa mãn filter và có thời gian nhỏ hơn `expireBefore`. Nếu log match nhiều policy, chỉ cần match một policy và đã quá hạn retention thì sẽ bị xóa.
6. **Xóa các log đã hết hạn:** Thực hiện xóa các bản ghi này khỏi database (có thể theo batch để tối ưu hiệu năng). Ghi lại số lượng log đã xóa, policy đã áp dụng (phục vụ audit/monitoring).

### **10.3. Lưu ý về logic áp dụng policy**

- **Không xử lý xung đột policy:** Nếu một bản ghi log match nhiều policy với các retentionDays khác nhau, chỉ cần log đó match một policy và đã quá hạn retention của policy đó thì sẽ bị xóa, không cần xác định policy ưu tiên nhất hay retention ngắn nhất.
- **Đơn giản hóa vận hành:** Cách làm này giúp giảm độ phức tạp, tăng hiệu năng và dễ kiểm soát, phù hợp khi các policy được cấu hình rõ ràng, ít overlap hoặc không có yêu cầu compliance đặc biệt về thời gian giữ log tối thiểu.

### **10.4. Ví dụ minh họa**

**Policy 1:**

- `boundedContext = 'IAM'`, `actionType = 'User.Deleted'`, `retentionDays = 90`

**Policy 2:**

- `boundedContext = 'IAM'`, `retentionDays = 180`

**Log A:**

- `boundedContext = 'IAM'`, `actionType = 'User.Deleted'`, `timestamp = 100 ngày trước`

**Áp dụng:**

- Log A match cả Policy 1 và Policy 2.
- Vì Log A đã quá hạn 90 ngày theo Policy 1, nó sẽ bị xóa, không cần xét đến Policy 2.

## **11\. Application Services**

Application Services trong ALM là lớp mỏng điều phối các hành động từ bên ngoài (ví dụ: nhận Event, nhận Query, kích hoạt Scheduled Task) đến Domain Model (Aggregate Roots, Domain Services). Chúng xử lý các tác vụ kỹ thuật như lắng nghe Event, xử lý Query, thực hiện ủy quyền, và gọi Domain Service.

- **AuditLogIngestionApplicationService:**
  - **Trách nhiệm:** Lắng nghe sự kiện **AuditLogRequestedEvent** từ Message Broker. Trích xuất dữ liệu cần thiết từ Event payload và gọi AuditLogService.PersistAuditLogEntry(). Đảm bảo việc xử lý Event là đáng tin cậy (ví dụ: sử dụng cơ chế Exactly-Once Processing nếu Message Broker hỗ trợ).
  - **Các phương thức tiềm năng:** HandleAuditLogRequestedEvent(event: AuditLogRequestedEvent).
- **AuditLogQueryApplicationService:**
  - **Trách nhiệm:** Xử lý các Query đến từ các BC khác để truy vấn audit logs. Thực hiện kiểm tra ủy quyền (Authorization) bằng cách gọi IAM Service trước khi gọi Domain Service. Gọi AuditLogService.FindAuditLogs(criteria) và định dạng kết quả trả về (ví dụ: phân trang).
  - **Các phương thức tiềm năng:** HandleGetAuditLogsQuery(query: GetAuditLogsQuery).
- **AuditLogRetentionApplicationService:**
  - **Trách nhiệm:** Kích hoạt quy trình quản lý vòng đời dữ liệu (Retention). Có thể được gọi bởi Scheduled Task nội bộ. Lấy các chính sách retention đang hoạt động (có thể từ Repository riêng hoặc cấu hình) và gọi AuditLogService.ApplyRetentionPolicy() cho từng chính sách.
  - **Các phương thức tiềm năng:** RunRetentionProcess().

## **12\. Domain Events**

ALM chủ yếu là Consumer của các Domain Event từ các BC khác.

### **12.1. Domain Events Được Xử lý (Consumed Domain Events)**

ALM lắng nghe và xử lý các Domain Event từ các Bounded Context khác để tạo bản ghi audit log.

- **AuditLogRequestedEvent** (Từ tất cả các BC khác)
  - Phát ra bởi một Bounded Context nguồn khi một hành động nghiệp vụ quan trọng xảy ra và cần được ghi lại dưới dạng audit log.
  - **Mục đích xử lý:** ALM lắng nghe event này để trích xuất thông tin và tạo một bản ghi AuditLogEntry.
  - **Payload dự kiến:**
    - Timestamp (DateTime \- Thời điểm hành động xảy ra ở BC nguồn)
    - Initiator (Initiator Value Object)
    - BoundedContext (String \- Tên định danh của BC nguồn)
    - ActionType (String \- Loại hành động, ví dụ: "User.Created", "Order.Updated")
    - Category (String, optional \- Danh mục log)
    - Severity (String, optional \- Mức độ nghiêm trọng)
    - EntityId (UUID, optional \- ID thực thể bị ảnh hưởng)
    - EntityType (String, optional \- Loại thực thể bị ảnh hưởng)
    - TenantId (UUID, optional \- ID tổ chức liên quan)
    - ContextData (AuditContext Value Object, optional \- Dữ liệu ngữ cảnh chi tiết)
    - Status (String \- Trạng thái hành động: "Success" hoặc "Failure")
    - FailureReason (String, optional \- Lý do thất bại nếu Status là "Failure")
    - EventId (UUID, optional \- ID của event nghiệp vụ gốc nếu có)
    - IssuedAt (DateTime \- Thời điểm event được phát ra bởi BC nguồn)

## **13\. Ranh giới Nghiệp vụ**

ALM chịu trách nhiệm quản lý vòng đời Retention Policy như một Aggregate Root, bao gồm tạo, cập nhật, xóa, kích hoạt/vô hiệu hóa, versioning, audit, và áp dụng policy cho dữ liệu log. Việc này đảm bảo tính linh hoạt, auditability, và khả năng mở rộng cho quản lý retention trong hệ thống.

ALM không chịu trách nhiệm:

- **Xác định khi nào cần ghi log:** Trách nhiệm này thuộc về các Bounded Context phát sinh hành động. BC nguồn cần xác định những hành động nào là quan trọng và cần được audit, cũng như tạo ra dữ liệu log đầy đủ.
- **Định nghĩa chi tiết nội dung Context Data:** Cấu trúc và nội dung chi tiết của ContextData được xác định bởi BC phát sinh log, ALM chỉ lưu trữ nó. ALM không có logic nghiệp vụ để hiểu sâu về ý nghĩa của từng trường trong ContextData ngoại trừ cho mục đích truy vấn (ví dụ: tìm kiếm theo giá trị). **BC nguồn chịu trách nhiệm xử lý dữ liệu nhạy cảm trước khi gửi log cho ALM.**
- **Xác thực nghiệp vụ của hành động gốc:** ALM chỉ ghi lại hành động đã xảy ra (thành công hay thất bại), không kiểm tra lại tính hợp lệ nghiệp vụ của hành động đó.
- **Hiển thị audit logs:** Việc hiển thị log cho người dùng (qua giao diện) thuộc về các BC hoặc hệ thống giao diện người dùng (ví dụ: giao diện Admin).
- **Phân tích chuyên sâu từ audit logs:** Các hệ thống phân tích hoặc BI có thể sử dụng dữ liệu từ ALM, nhưng logic phân tích không nằm trong ALM.
- **Thực thi chính sách bảo mật dựa trên log:** Ví dụ: nếu phát hiện nhiều lần đăng nhập thất bại, ALM ghi log nhưng không tự động khóa tài khoản (việc này thuộc về IAM). ALM cung cấp dữ liệu để các hệ thống khác (ví dụ: hệ thống giám sát bảo mật) có thể phát hiện và thực thi.
- **Quản lý cấu hình chi tiết của các BC khác:** ALM không quản lý cấu hình logging của các BC nguồn.

## **14\. Kết luận**

Bounded Context Audit Log Management (ALM) là một thành phần cốt lõi quan trọng, cung cấp chức năng ghi lại và truy vấn lịch sử hoạt động của toàn bộ hệ thống Ecoma. Bằng cách tập trung trách nhiệm này vào một Context duy nhất, ALM đảm bảo tính nhất quán, đáng tin cậy, bất biến và khả năng truy vấn cho các bản ghi kiểm tra, phục vụ các mục đích bảo mật, kiểm tra nội bộ và tuân thủ. Việc thiết kế ALM như một dịch vụ thu thập log thụ động (qua Event) và cung cấp dữ liệu chủ động (qua Query) giúp giảm thiểu sự phụ thuộc trực tiếp từ các BC khác và tăng khả năng mở rộng.

Tài liệu này đã được cập nhật để làm rõ cơ chế tiếp nhận audit log qua Event bằng cách định nghĩa sự kiện **AuditLogRequestedEvent** mà ALM lắng nghe. Đây là nền tảng để chuyển sang giai đoạn thiết kế kỹ thuật chi tiết và triển khai Microservice ALM.
