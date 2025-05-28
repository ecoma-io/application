# **Bounded Context Notification Delivery Management (NDM)**

## **1\. Giới thiệu**

Tài liệu này cung cấp mô tả chi tiết về Bounded Context **Notification Delivery Management (NDM)** trong hệ thống Ecoma. NDM là một trong những Bounded Context cốt lõi (Core Bounded Context), chịu trách nhiệm quản lý và thực hiện việc gửi các loại thông báo khác nhau từ hệ thống đến người dùng và tổ chức.

NDM đóng vai trò là một trung tâm thông báo tập trung, nhận yêu cầu gửi thông báo từ các Bounded Context khác, xử lý logic gửi (chọn kênh, bản địa hóa nội dung, v.v.) và theo dõi trạng thái gửi, đảm bảo thông tin quan trọng được truyền tải hiệu quả đến đúng người nhận, đúng thời điểm và đúng cách.

## **2\. Phạm vi của Tài liệu**

Tài liệu này tập trung vào việc định nghĩa và mô tả Bounded Context NDM ở cấp độ thiết kế miền (domain design), cung cấp đủ chi tiết để hỗ trợ việc thiết kế các Domain Service và Application Service. Cụ thể, tài liệu này bao gồm:

- Xác định vai trò và trách nhiệm chính của NDM.
- Mô tả các khái niệm và thực thể cốt lõi trong mô hình domain của NDM ở cấp độ chi tiết hơn, bao gồm các Aggregate Root, Entity và Value Object với các thuộc tính chính, có tính đến các kênh gửi thông báo và hỗ trợ partial template.
- Định nghĩa Ngôn ngữ Chung (Ubiquitous Language) trong phạm vi NDM.
- Mô tả **Các Khía cạnh Quan trọng của Miền NDM**, bao gồm chiến lược chọn kênh gửi, chiến lược xử lý lỗi và thử lại, và tương tác với các Sending Gateway (lớp trừu tượng hóa).
- Làm rõ các tương tác chính giữa NDM và các Bounded Context khác, đặc biệt là cách NDM nhận yêu cầu và sử dụng thông tin từ các BC khác (như IAM, LZM, RDM).
- Phác thảo các **Use cases** chính có sự tham gia của NDM, tập trung vào actor, mục đích và các Domain/Application Service liên quan, bao gồm nhận yêu cầu gửi thông báo, xử lý và gửi thông báo (bao gồm xử lý lỗi và thử lại), và quản lý mẫu thông báo (bao gồm cả partials).
- Xác định ranh giới nghiệp vụ của NDM.
- Đề xuất các Domain Service và Application Service tiềm năng trong NDM.
- Làm rõ các quy tắc nghiệp vụ liên quan đến việc chọn kênh gửi (bao gồm ưu tiên), xử lý lỗi gửi và thử lại, và tương tác với các dịch vụ gửi thông báo vật lý được mô tả ở cấp độ thiết kế miền.
- Liệt kê và mô tả các **Domain Events** mà NDM tương tác, được chia thành các sự kiện NDM **phát ra** (Published Events) và các sự kiện NDM **lắng nghe và xử lý** (Consumed Events), bao gồm payload dự kiến của từng event.

**Trong phạm vi tài liệu này:**

- Các khái niệm về **Commands** (yêu cầu thực hiện một hành động) và **Queries** (yêu cầu lấy dữ liệu) được đề cập để mô tả cách các Bounded Context khác tương tác với NDM và cách các luồng nghiệp vụ được kích hoạt thông qua các **Application Services**.
- Vai trò và trách nhiệm của **Domain Services** và **Application Services** trong việc xử lý logic nghiệp vụ và điều phối các tương tác được mô tả ở cấp độ chức năng.
- Các **Domain Events** quan trọng được xác định để mô tả những thay đổi trạng thái nghiệp vụ mà NDM phát ra.
- Các chiến lược và quy tắc nghiệp vụ liên quan đến việc chọn kênh gửi (bao gồm ưu tiên), xử lý lỗi gửi và thử lại, và tương tác với các dịch vụ gửi thông báo vật lý được mô tả ở cấp độ thiết kế miền.
- Khái niệm **Notification Partials** và cách chúng được quản lý và sử dụng trong **Notification Templates** thông qua engine **Handlebars** được mô tả ở cấp độ nghiệp vụ và tương tác giữa các Aggregate/Services.

**Ngoài phạm vi tài liệu này (thuộc về thiết kế kỹ thuật chi tiết):**

- Định nghĩa chính xác cấu trúc dữ liệu (payload) chi tiết của từng Command, Query và Domain Event (chỉ mô tả mục đích và thông tin cốt lõi).
- Định nghĩa chi tiết các API Interface (chỉ mô tả chức năng và tương tác).
- Chi tiết cài đặt kỹ thuật của Microservice NDM (ngôn ngữ lập trình, framework, chi tiết tích hợp thư viện Handlebars, kiến trúc nội bộ chi tiết).
- Cấu trúc cơ sở dữ liệu chi tiết (schema) của NDM.
- Các quyết định công nghệ cụ thể bên trong NDM (ví dụ: sử dụng SMTP provider nào, thư viện gửi SMS nào).
- Luồng dữ liệu chi tiết đến cấp độ từng trường thông tin giữa NDM và các BC khác.
- Cấu hình hạ tầng triển khai cụ thể cho NDM.
- Thiết kế giao diện người dùng để quản lý mẫu thông báo hoặc xem lịch sử gửi.
- Chi tiết về nội dung cụ thể của từng loại thông báo (được định nghĩa trong mẫu thông báo).
- Quản lý tùy chọn nhận thông báo của người dùng (được quản lý trong IAM, NDM chỉ sử dụng thông tin này).
- **Chi tiết triển khai việc seed dữ liệu ban đầu (initial templates/partials).**

## **3\. Vai trò và Trách nhiệm Chính**

Bounded Context NDM chịu trách nhiệm quản lý và thực hiện việc gửi thông báo. Các trách nhiệm chính bao gồm:

- **Nhận Yêu cầu Gửi Thông báo:** Tiếp nhận các yêu cầu gửi thông báo từ các Bounded Context khác thông qua các sự kiện hoặc command. Yêu cầu bao gồm loại thông báo, người nhận, và dữ liệu ngữ cảnh.
- **Quản lý Mẫu Thông báo (Notification Template) và Partial Template:** Định nghĩa, lưu trữ và quản lý các mẫu thông báo hoàn chỉnh và các khối nội dung mẫu có thể tái sử dụng (partials) cho các loại thông báo khác nhau, hỗ trợ nhiều kênh gửi (email, SMS, in-app, push) và nhiều ngôn ngữ/locale.
- **Bản địa hóa và Render Nội dung Thông báo:** Dựa trên Locale ưa thích của người nhận (lấy từ IAM) và dữ liệu ngữ cảnh, sử dụng mẫu thông báo phù hợp (bao gồm cả việc nhúng partials) và engine **Handlebars** để tạo nội dung thông báo cuối cùng bằng ngôn ngữ chính xác.
- **Chọn Kênh Gửi:** Dựa trên loại thông báo, tùy chọn của người nhận (lấy từ IAM) và cấu hình hệ thống, xác định (các) kênh gửi phù hợp cho thông báo theo **chiến lược ưu tiên kênh**.
- **Gửi Thông báo qua các Kênh:** Tích hợp và tương tác với các **dịch vụ gửi thông báo vật lý (abstraction layer)** bên ngoài (ví dụ: dịch vụ gửi email, SMS gateway, push notification service) hoặc các BC nội bộ để gửi thông báo đi.
- **Theo dõi Trạng thái Gửi:** Ghi nhận và cập nhật trạng thái gửi của từng thông báo qua từng kênh (ví dụ: Đã gửi, Thất bại, Đã nhận, Đã đọc).
- **Xử lý Lỗi Gửi và Thử lại:** Xử lý các trường hợp gửi thông báo thất bại (ví dụ: địa chỉ email không hợp lệ, số điện thoại sai) theo **chiến lược thử lại** được định nghĩa.
- **Phát Sự kiện Nghiệp vụ:** Phát ra các Sự kiện Nghiệp vụ quan trọng liên quan đến quá trình gửi thông báo (ví dụ: thông báo đã gửi thành công, thông báo gửi thất bại).

## **4\. Mô hình Domain (Chi tiết hơn)**

Trong phạm vi Bounded Context NDM, chúng ta xác định các Aggregate Root, Entity và Value Object cốt lõi với các thuộc tính chính (có thể thay đổi trong quá trình thiết kế chi tiết):

**Aggregate Roots:**

- **NotificationTemplate:** Là Aggregate Root định nghĩa cấu trúc và nội dung của một loại thông báo cho các kênh và locale khác nhau.
  - **ID:** Unique identifier (UUID).
  - **Type:** Loại thông báo (ví dụ: "OrderConfirmation", "SubscriptionExpired", "PasswordReset", "MarketingPromotion", "SystemAlert"). Duy nhất.
  - **Name:** Tên mẫu thông báo.
  - **Description:** Mô tả mẫu thông báo.
  - **SupportedChannels:** Danh sách các kênh gửi được hỗ trợ bởi mẫu này (Channel Value Objects).
  - **ChannelPriority:** **Optional** Danh sách các kênh gửi được sắp xếp theo thứ tự ưu tiên cho loại thông báo này. Nếu không có, sử dụng ưu tiên mặc định của hệ thống.
  - **TemplateContents:** Danh sách nội dung mẫu cho từng kênh và locale (TemplateContent Entities).
  - **RequiredContextData:** Danh sách các trường dữ liệu ngữ cảnh bắt buộc cần có để render mẫu (ví dụ: \["orderNumber", "totalAmount"\]).
  - **IsActive:** Trạng thái hoạt động của mẫu.
  - **CreatedAt:** Thời điểm tạo.
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng.
  - _Behavior:_ AddTemplateContent, RemoveTemplateContent, UpdateTemplateContent, SetChannelPriority.
- **NotificationPartial:** Là Aggregate Root định nghĩa một khối nội dung mẫu có thể tái sử dụng (partial).
  - **ID:** Unique identifier (UUID).
  - **Name:** Tên định danh của partial (ví dụ: "emailHeader", "emailFooter", "productDetailsBlock"). Duy nhất.
  - **Description:** Mô tả partial.
  - **Channel:** **Optional** Kênh mà partial này dành riêng cho (ví dụ: chỉ dùng cho Email). Có thể null nếu partial dùng chung cho nhiều kênh.
  - **Locale:** **Optional** Mã locale/ngôn ngữ nếu partial này chỉ áp dụng cho một ngôn ngữ cụ thể. Có thể null nếu partial dùng chung cho nhiều ngôn ngữ (nội dung không chứa text cần bản địa hóa hoặc được bản địa hóa bằng cách gọi partial khác).
  - **Content:** Nội dung mẫu của partial (sử dụng cú pháp Handlebars).
  - **RequiredContextData:** Danh sách các trường dữ liệu ngữ cảnh mà partial này cần để render.
  - **IsActive:** Trạng thái hoạt động của partial.
  - **CreatedAt:** Thời điểm tạo.
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng.
  - _Behavior:_ UpdateContent.
- **NotificationRequest:** Là Aggregate Root đại diện cho một yêu cầu gửi thông báo từ một BC khác. Aggregate này quản lý thông tin về yêu cầu và các thông báo cụ thể được tạo ra từ yêu cầu đó.
  - **ID:** Unique identifier (UUID).
  - **RequestingBoundedContext:** Tên của Bounded Context đã gửi yêu cầu (ví dụ: "BUM", "ODM").
  - **NotificationType:** Loại thông báo (liên kết với NotificationTemplate.Type).
  - **RecipientUserId:** ID của người dùng nhận thông báo (liên kết với IAM).
  - **RecipientTenantId:** ID của tổ chức nhận thông báo (liên kết với IAM). Có thể null nếu thông báo không liên quan đến tổ chức cụ thể.
  - **ContextData:** Dữ liệu ngữ cảnh cần thiết để render mẫu (NotificationContext Value Object).
  - **RequestedChannels:** Danh sách các kênh gửi được yêu cầu (Channel Value Objects). Có thể là tùy chọn, nếu không cung cấp, NDM sẽ chọn kênh mặc định/phù hợp.
  - **CreatedAt:** Thời điểm tạo.
  - **NotificationMessages:** Danh sách các bản ghi thông báo cụ thể được tạo ra từ yêu cầu này (NotificationMessage Entities).
  - _Behavior:_ ProcessRequest, AddNotificationMessage.
- **NotificationMessage (Có thể là Aggregate Root riêng nếu cần quản lý chi tiết vòng đời gửi):** Nếu cần theo dõi chi tiết trạng thái gửi, thử lại, hoặc cho phép người dùng tương tác (ví dụ: đánh dấu đã đọc), NotificationMessage có thể là Aggregate Root riêng. Giả định ban đầu là Entity thuộc NotificationRequest để đơn giản hóa.
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root NotificationRequest.
  - **Channel:** Kênh gửi (Channel Value Object).
  - **RecipientDetails:** Thông tin người nhận cụ thể cho kênh này (ví dụ: email address, phone number) \- có thể là Value Object.
  - **Status:** Trạng thái gửi của thông báo qua kênh này (NotificationStatus Value Object: Pending, Sending, Sent, Failed, Delivered, Read, Retrying).
  - **SentAt:** Thời điểm gửi (nếu có).
  - **FailedReason:** Lý do thất bại (nếu Status là Failed).
  - **ExternalMessageId:** ID của thông báo từ dịch vụ gửi bên ngoài (để tra cứu).
  - **RenderedContent:** Nội dung thông báo cuối cùng sau khi render mẫu.
  - **RetryCount:** Số lần đã thử lại gửi thông báo này.
  - **NextRetryTime:** Thời điểm thử lại tiếp theo (nếu Status là Retrying).
  - _Behavior:_ MarkAsSending, MarkAsSent, MarkAsFailed, MarkAsDelivered, MarkAsRead, MarkAsRetrying.

**Entities (thuộc về các Aggregate Root):**

- **TemplateContent (thuộc NotificationTemplate):**
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root.
  - **Channel:** Kênh gửi (Channel Value Object).
  - **Locale:** Mã locale/ngôn ngữ (Locale Value Object \- liên kết với RDM/LZM).
  - **SubjectTemplate:** Mẫu cho tiêu đề (chỉ áp dụng cho email). **Sử dụng cú pháp Handlebars.**
  - **BodyTemplate:** Mẫu cho nội dung chính (HTML cho email, plain text cho SMS, cấu trúc JSON cho in-app/push). **Sử dụng cú pháp Handlebars, có thể tham chiếu partials.**
  - _Behavior:_ UpdateContent.

**Value Objects:**

- **Channel:** Đại diện cho một kênh gửi thông báo.
  - **Value:** Chuỗi hoặc Enum (Email, SMS, InApp, Push). **Ghi chú:** SMS hiện tại có chi phí cao và ít ưu tiên, chủ yếu chuẩn bị cho tương lai. Kênh Push và InApp thường đi kèm hoặc một số trường hợp được xem xét cùng nhau, có thể được xử lý bởi cùng một Sending Gateway hoặc BC chuyên biệt. **Ràng buộc:** Chỉ chấp nhận các giá trị kênh được hỗ trợ.
- **Locale:** Đại diện cho mã locale/ngôn ngữ.
  - **Value:** Chuỗi (ví dụ: "vi-VN", "en-US"). **Ràng buộc:** Phải là mã locale hợp lệ từ RDM.
- **NotificationContext:** Đại diện cho dữ liệu ngữ cảnh để render mẫu.
  - **Value:** Dictionary/Map\<string, object\>. Chứa các cặp key-value.
- **NotificationStatus:** Đại diện cho trạng thái gửi của một NotificationMessage.
  - **Value:** Chuỗi hoặc Enum (Pending, Sending, Sent, Failed, Delivered, Read, Retrying).
- **RecipientDetails:** Thông tin chi tiết của người nhận cho một kênh cụ thể.
  - **Value:** Chuỗi (ví dụ: "user@example.com", "+84912345678").

## **5\. Ngôn ngữ Chung (Ubiquitous Language)**

Trong Bounded Context NDM, các thuật ngữ sau đây có ý nghĩa cụ thể và nhất quán:

- **Notification Template:** Mẫu định nghĩa cấu trúc và nội dung của một loại thông báo cho các kênh và ngôn ngữ khác nhau.
- **Notification Partial:** Một khối nội dung mẫu nhỏ, có thể tái sử dụng và nhúng vào các Notification Template khác.
- **Notification Type:** Loại thông báo cụ thể (ví dụ: xác nhận đơn hàng, hết hạn gói).
- **Channel:** Kênh gửi thông báo (Email, SMS, InApp, Push).
- **Locale:** Mã ngôn ngữ và vùng miền (ví dụ: tiếng Việt tại Việt Nam).
- **Context Data:** Dữ liệu cần thiết để điền vào mẫu thông báo (ví dụ: tên khách hàng, số đơn hàng).
- **Handlebars:** Engine template được sử dụng để render nội dung thông báo, hỗ trợ nhúng dữ liệu và partials.
- **Notification Request:** Một yêu cầu gửi một hoặc nhiều thông báo từ một Bounded Context khác.
- **Notification Message:** Một bản ghi cụ thể về việc một thông báo đã được gửi (hoặc đang cố gắng gửi) đến một người nhận qua một kênh cụ thể.
- **Delivery Status:** Trạng thái của một Notification Message (đã gửi, thất bại, v.v.).
- **In-App Notification:** Thông báo hiển thị bên trong giao diện người dùng của ứng dụng Ecoma.
- **Push Notification:** Thông báo gửi đến thiết bị di động của người dùng thông qua dịch vụ push của nền tảng (iOS, Android).
- **Channel Preference:** Tùy chọn của người dùng về việc nhận thông báo qua kênh nào (được quản lý trong IAM).
- **Channel Priority:** Thứ tự ưu tiên các kênh gửi cho một loại thông báo.
- **Retry Strategy:** Chiến lược nghiệp vụ để thử lại việc gửi thông báo khi gặp lỗi tạm thời.
- **Sending Gateway:** Dịch vụ hoặc adapter chuyên trách việc gửi thông báo vật lý qua một kênh cụ thể (ví dụ: Email Sending Gateway).

## **6\. Các Khía cạnh Quan trọng của Miền NDM**

Phần này mô tả các cấu trúc, quy tắc và khái niệm nghiệp vụ quan trọng chi phối hoạt động của Bounded Context NDM.

### **6.1. Chiến lược Chọn Kênh Gửi**

Khi nhận một NotificationRequest, NDM sẽ xác định danh sách các NotificationMessage cần tạo dựa trên các yếu tố sau:

1. **Kênh được hỗ trợ bởi Template:** Chỉ những kênh có TemplateContent tương ứng trong NotificationTemplate mới được xem xét.
2. **Kênh được yêu cầu (nếu có):** Nếu RequestedChannels được cung cấp trong NotificationRequest, chỉ những kênh nằm trong danh sách này mới được xem xét. Nếu không, tất cả các kênh được hỗ trợ bởi Template đều được xem xét.
3. **Tùy chọn kênh của người nhận (Channel Preferences):** NDM lấy thông tin tùy chọn nhận thông báo của người dùng từ IAM. Chỉ những kênh mà người dùng đã bật (opt-in) hoặc chưa tắt (opt-out) cho loại thông báo này mới được xem xét.
4. **Kết quả:** NDM tạo NotificationMessage cho **TẤT CẢ** các kênh vượt qua các kiểm tra trên.
5. **Thứ tự xử lý gửi:** Các NotificationMessage sẽ được xử lý gửi theo thứ tự ưu tiên kênh được định nghĩa trong ChannelPriority của NotificationTemplate (nếu có) hoặc ưu tiên mặc định hệ thống.

### **6.2. Chiến lược Xử lý Lỗi Gửi và Thử lại**

Khi một NotificationMessage gửi thất bại qua một kênh cụ thể, NDM sẽ áp dụng chiến lược thử lại:

1. **Phân loại lỗi:** Lỗi từ Sending Gateway được phân loại là tạm thời (Transient Error) hoặc vĩnh viễn (Permanent Error).
2. **Xử lý lỗi vĩnh viễn:** NotificationMessage được đánh dấu Failed và không thử lại.
3. **Xử lý lỗi tạm thời:** Tăng RetryCount. Nếu RetryCount \< Giới hạn thử lại (định nghĩa trong **Retry Strategy**):
   - Tăng RetryCount.
   - Tính toán NextRetryTime dựa trên **Retry Strategy**.
   - Cập nhật trạng thái NotificationMessage thành Retrying.
   - Phát sự kiện "NotificationRetryScheduled".
4. Nếu RetryCount \>= Giới hạn thử lại:
   - Cập nhật trạng thái NotificationMessage thành Failed.
   - Ghi lại FailedReason.
   - Phát sự kiện "NotificationSendingFailed".
5. **Scheduled Task:** Định kỳ quét các NotificationMessage có trạng thái Retrying mà đã đến NextRetryTime để đưa vào hàng đợi gửi.

### **6.3. Tương tác với Sending Gateways (Abstraction Layer)**

NDM không giao tiếp trực tiếp với các API cụ thể của từng nhà cung cấp dịch vụ gửi (SendGrid, Twilio, v.v.). Thay vào đó, NDM định nghĩa các interface chung (Ports) cho từng loại kênh gửi (ví dụ: IEmailSendingGateway, ISmsSendingGateway).

NotificationSendingService sẽ gọi các phương thức trên các interface này. Các lớp triển khai cụ thể (Adapters) cho từng nhà cung cấp dịch vụ sẽ nằm ở lớp hạ tầng (Infrastructure Layer), bên ngoài Domain Model của NDM.

Ví dụ:

- NotificationSendingService gọi \_emailGateway.Send(recipientEmail, subject, body).
- Adapter SendGridEmailGateway triển khai IEmailSendingGateway và chứa logic gọi API của SendGrid.
- Adapter TwilioSmsGateway triển khai ISmsSendingGateway và chứa logic gọi API của Twilio.

Việc này giúp NDM độc lập với chi tiết kỹ thuật của từng nhà cung cấp, dễ dàng thay đổi hoặc thêm nhà cung cấp mới mà không ảnh hưởng đến logic nghiệp vụ cốt lõi của NDM.

## **7\. Use cases**

Dưới đây là mô tả các use case chính có sự tham gia của NDM, tập trung vào actor, mục đích và các service liên quan, được phân loại theo các nhóm chức năng chính.

### **7.1. Use Cases liên quan đến Gửi và Xử lý Thông báo**

Nhóm này bao gồm các use case cốt lõi của NDM, liên quan đến việc nhận yêu cầu, xử lý logic gửi và theo dõi trạng thái.

- **NDM-UC-7.1.1: Nhận và Xử lý Yêu cầu Gửi Thông báo**
  - **Actor:** Các Bounded Context khác (BUM, ODM, PIM, v.v.), Hệ thống (Message Broker).
  - **Mục đích:** Tiếp nhận yêu cầu gửi thông báo từ các BC nguồn, tạo bản ghi yêu cầu và xác định các bản ghi thông báo cụ thể cần gửi dựa trên template, yêu cầu và tùy chọn người nhận.
  - **Service liên quan:** Nhận Command/Event từ BC khác. Sử dụng NotificationRequestApplicationService. Sử dụng NotificationRequestService. Sử dụng RecipientService (hoặc gọi IAM). Sử dụng TemplateService. Phát Domain Event. Gửi Audit Log đến ALM.
- **NDM-UC-7.1.2: Gửi Thông báo qua các Kênh, Xử lý Lỗi và Thử lại**
  - **Actor:** Hệ thống (Scheduled Task hoặc Event Listener), Sending Gateways (Adapters).
  - **Mục đích:** Render nội dung thông báo cuối cùng và gửi các bản ghi thông báo qua các kênh tương ứng, xử lý kết quả gửi, áp dụng chiến lược thử lại khi cần.
  - **Service liên quan:** Scheduled Task/Event Listener kích hoạt. Sử dụng NotificationSendingApplicationService. Sử dụng NotificationSendingService. Sử dụng TemplateRenderingService. Gọi Sending Gateways. Phát Domain Event. Gửi Audit Log đến ALM.

### **7.2. Use Cases liên quan đến Quản lý Mẫu Thông báo (Templates)**

Nhóm này bao gồm các use case cho phép người dùng nội bộ quản lý các mẫu thông báo và partial templates.

- **NDM-UC-7.2.1: Quản lý Mẫu Thông báo**
  - **Actor:** Người dùng nội bộ Ecoma (có quyền quản lý mẫu thông báo), Hệ thống.
  - **Mục đích:** Tạo mới, cập nhật thông tin hoặc xóa các mẫu thông báo (Notification Template).
  - **Service liên quan:** Nhận Command từ giao diện Admin. Sử dụng NotificationTemplateApplicationService. Sử dụng TemplateService. Phát Domain Event. Gửi Audit Log đến ALM.
- **NDM-UC-7.2.2: Quản lý Partial Templates**
  - **Actor:** Người dùng nội bộ Ecoma (có quyền quản lý mẫu thông báo), Hệ thống.
  - **Mục đích:** Tạo mới, cập nhật thông tin hoặc xóa các khối nội dung mẫu có thể tái sử dụng (Notification Partial).
  - **Service liên quan:** Nhận Command từ giao diện Admin. Sử dụng NotificationPartialApplicationService. Sử dụng NotificationPartialService. Phát Domain Event. Gửi Audit Log đến ALM.

### **7.3. Use Cases liên quan đến Truy vấn và Báo cáo**

Nhóm này bao gồm các use case cho phép người dùng nội bộ xem lại lịch sử gửi thông báo hoặc trạng thái các yêu cầu gửi.

- **NDM-UC-7.3.1: Xem Lịch sử Gửi Thông báo**
  - **Actor:** Người dùng nội bộ Ecoma (có quyền xem báo cáo), Hệ thống.
  - **Mục đích:** Cho phép người dùng xem lại danh sách các yêu cầu gửi thông báo và trạng thái của các Notification Message tương ứng.
  - **Service liên quan:** Nhận Query từ giao diện Admin. Sử dụng NotificationRequestApplicationService (Query). Sử dụng NotificationRequest Repository.
- **NDM-UC-7.3.2: Xem Chi tiết Yêu cầu Gửi Thông báo**
  - **Actor:** Người dùng nội bộ Ecoma (có quyền xem báo cáo), Hệ thống.
  - **Mục đích:** Cho phép người dùng xem chi tiết của một yêu cầu gửi thông báo cụ thể, bao gồm dữ liệu ngữ cảnh và trạng thái gửi trên từng kênh.
  - **Service liên quan:** Nhận Query từ giao diện Admin. Sử dụng NotificationRequestApplicationService (Query). Sử dụng NotificationRequest Repository.

## **8\. Domain Services**

Domain Services trong NDM chứa logic nghiệp vụ quan trọng không thuộc về một Aggregate Root cụ thể hoặc cần phối hợp nhiều Aggregate Root.

- **NotificationRequestService:**
  - **Trách nhiệm:** Xử lý yêu cầu gửi thông báo mới, tạo NotificationRequest và các NotificationMessage ban đầu, xác định kênh gửi cuối cùng dựa trên Template, yêu cầu và **tùy chọn người nhận (từ RecipientService)**. Phối hợp với NotificationRequest Repository, RecipientService (hoặc IAM Service), TemplateService.
  - **Các phương thức tiềm năng:** ProcessNotificationRequest(...).
- **NotificationSendingService:**
  - **Trách nhiệm:** Quản lý quy trình gửi các NotificationMessage qua các kênh khác nhau bằng cách gọi **Sending Gateways (Adapters)**, xử lý trạng thái gửi, **áp dụng chiến lược xử lý lỗi và thử lại**. Phối hợp với NotificationRequest Repository (để cập nhật NotificationMessage), TemplateRenderingService, và các Sending Gateway (qua interface).
  - **Các phương thức tiềm năng:** SendPendingMessages(), ProcessSentCallback(...), ProcessFailedCallback(...).
- **TemplateService:**
  - **Trách nhiệm:** Quản lý vòng đời của NotificationTemplate, tìm kiếm mẫu phù hợp theo loại thông báo. Phối hợp với NotificationTemplate Repository.
  - **Các phương thức tiềm năng:** CreateTemplate(...), UpdateTemplate(...), DeleteTemplate(...), GetTemplateByType(...).
- **NotificationPartialService:**
  - **Trách nhiệm:** Quản lý vòng đời của NotificationPartial. Phối hợp với NotificationPartial Repository.
  - **Các phương thức tiềm năng:** CreatePartial(...), UpdatePartial(...), DeletePartial(...), GetPartialByName(...).
- **TemplateRenderingService:**
  - **Trách nhiệm:** Render nội dung thông báo cuối cùng bằng cách kết hợp mẫu và dữ liệu ngữ cảnh, có tính đến locale và **sử dụng engine Handlebars để nhúng partials**. Phối hợp với TemplateService, **NotificationPartialService**.
  - **Các phương thức tiềm năng:** Render(templateContent, contextData, locale).
- **RecipientService (Port/Adapter):**
  - **Trách nhiệm:** Cung cấp interface để lấy thông tin người nhận từ IAM, bao gồm **tùy chọn kênh nhận thông báo**. Đây là một Port mà Domain Service gọi, và implementer của Port sẽ gọi IAM Service thực tế.
  - **Các phương thức tiềm năng:** GetRecipientDetails(userId, tenantId).

## **9\. Application Services**

Application Services trong NDM là lớp mỏng điều phối các hành động từ bên ngoài (ví dụ: từ các BC khác, Scheduled Task) đến Domain Model (Aggregate Roots, Domain Services). Chúng xử lý các tác vụ kỹ thuật như xác thực (nếu cần), giao dịch cơ sở dữ liệu, và phát sự kiện.

- **NotificationRequestApplicationService:**
  - **Trách nhiệm:** Xử lý Command/Event yêu cầu gửi thông báo từ các BC khác. Sử dụng NotificationRequestService. **Cũng xử lý các query liên quan đến lịch sử gửi.**
  - **Các phương thức tiềm năng:** HandleSendNotificationCommand(command), HandleGetNotificationHistoryQuery(query), HandleGetNotificationRequestDetailsQuery(query).
- **NotificationSendingApplicationService:**
  - **Trách nhiệm:** Kích hoạt quy trình gửi thông báo (có thể được gọi bởi Scheduled Task). Xử lý các callback từ dịch vụ gửi bên ngoài. Sử dụng NotificationSendingService.
  - **Các phương thức tiềm năng:** RunSendingProcess(), HandleDeliveryCallback(callbackData).
- **NotificationTemplateApplicationService:**
  - **Trách nhiệm:** Xử lý Command liên quan đến quản lý mẫu thông báo từ giao diện quản trị. Sử dụng TemplateService. **Cũng xử lý các query liên quan đến mẫu thông báo.**
  - **Các phương thức tiềm năng:** HandleCreateNotificationTemplateCommand(command), HandleUpdateNotificationTemplateCommand(command), HandleDeleteNotificationTemplateCommand(command), HandleListNotificationTemplatesQuery(query), HandleGetNotificationTemplateDetailsQuery(query).
- **NotificationPartialApplicationService:**
  - **Trách nhiệm:** Xử lý Command liên quan đến quản lý partial templates từ giao diện quản trị. Sử dụng NotificationPartialService. **Cũng xử lý các query liên quan đến partial templates.**
  - **Các phương thức tiềm năng:** HandleCreateNotificationPartialCommand(command), HandleUpdateNotificationPartialCommand(command), HandleDeleteNotificationPartialCommand(command), HandleListNotificationPartialsQuery(query), HandleGetNotificationPartialDetailsQuery(query).

## **10\. Domain Events**

NDM sẽ phát ra các Domain Event quan trọng để thông báo cho các Bounded Context khác về những thay đổi trạng thái liên quan đến thông báo.

### **10.1. Domain Events (NDM Phát ra)**

- **NotificationRequestCreated**
  - Phát ra khi một yêu cầu gửi thông báo mới được tạo.
  - **Payload:**
    - NotificationRequestId (UUID)
    - RequestingBoundedContext (String)
    - NotificationType (String)
    - RecipientUserId (UUID, optional)
    - RecipientTenantId (UUID, optional)
    - ChannelsToSend (List of String)
    - IssuedAt (DateTime)
- **NotificationSent**
  - Phát ra khi một NotificationMessage được gửi thành công qua một kênh cụ thể.
  - **Payload:**
    - NotificationMessageId (UUID)
    - NotificationRequestId (UUID)
    - Channel (String)
    - RecipientDetails (String)
    - ExternalMessageId (String, optional)
    - SentAt (DateTime)
    - IssuedAt (DateTime)
- **NotificationSendingFailed**
  - Phát ra khi một NotificationMessage gửi thất bại qua một kênh cụ thể (sau khi đã thử lại hết số lần quy định).
  - **Payload:**
    - NotificationMessageId (UUID)
    - NotificationRequestId (UUID)
    - Channel (String)
    - RecipientDetails (String)
    - FailedReason (String)
    - FailedAt (DateTime)
    - IssuedAt (DateTime)
- **NotificationRetryScheduled**
  - Phát ra khi một NotificationMessage gặp lỗi tạm thời và được lên lịch thử lại.
  - **Payload:**
    - NotificationMessageId (UUID)
    - NotificationRequestId (UUID)
    - Channel (String)
    - RecipientDetails (String)
    - RetryCount (Integer)
    - NextRetryTime (DateTime)
    - IssuedAt (DateTime)
- **NotificationDelivered**
  - Phát ra khi NDM nhận xác nhận thông báo đã được gửi thành công đến đích (ví dụ: email đã vào hộp thư, SMS đã đến điện thoại).
  - **Payload:**
    - NotificationMessageId (UUID)
    - ExternalMessageId (String)
    - DeliveredAt (DateTime)
    - IssuedAt (DateTime)
- **NotificationRead**
  - Phát ra khi NDM nhận xác nhận thông báo đã được người dùng đọc (chủ yếu cho In-App hoặc Push).
  - **Payload:**
    - NotificationMessageId (UUID)
    - UserId (UUID)
    - ReadAt (DateTime)
    - IssuedAt (DateTime)
- **NotificationTemplateCreated**
  - Phát ra khi một mẫu thông báo mới được tạo.
  - **Payload:**
    - TemplateId (UUID)
    - Type (String)
    - Name (String)
    - IssuedAt (DateTime)
- **NotificationTemplateUpdated**
  - Phát ra khi một mẫu thông báo được cập nhật.
  - **Payload:**
    - TemplateId (UUID)
    - Type (String)
    - Name (String)
    - IssuedAt (DateTime)
- **NotificationTemplateDeleted**
  - Phát ra khi một mẫu thông báo bị xóa.
  - **Payload:**
    - TemplateId (UUID)
    - Type (String)
    - Name (String)
    - IssuedAt (DateTime)
- **NotificationPartialCreated**
  - Phát ra khi một partial template mới được tạo.
  - **Payload:**
    - PartialId (UUID)
    - Name (String)
    - Channel (String, optional)
    - Locale (String, optional)
    - IssuedAt (DateTime)
- **NotificationPartialUpdated**
  - Phát ra khi một partial template được cập nhật.
  - **Payload:**
    - PartialId (UUID)
    - Name (String)
    - Channel (String, optional)
    - Locale (String, optional)
    - IssuedAt (DateTime)
- **NotificationPartialDeleted**
  - Phát ra khi một partial template bị xóa.
  - **Payload:**
    - PartialId (UUID)
    - Name (String)
    - Channel (String, optional)
    - Locale (String, optional)
    - IssuedAt (DateTime)

### **10.2. Domain Events Được Xử lý (Consumed Domain Events)**

NDM lắng nghe và xử lý các Domain Event từ các Bounded Context khác để nhận yêu cầu gửi thông báo hoặc lấy thông tin cần thiết.

- **\[Tên Event Nghiệp vụ từ BC khác\]** (Ví dụ: SubscriptionActivated từ BUM, OrderCompleted từ ODM, UserLoggedIn từ IAM)
  - Phát ra khi một hành động nghiệp vụ quan trọng xảy ra trong một BC nguồn, cần kích hoạt việc gửi thông báo.
  - **Mục đích xử lý:** NDM lắng nghe các event này và chuyển đổi chúng thành SendNotificationCommand nội bộ hoặc gọi trực tiếp NotificationRequestApplicationService để xử lý yêu cầu gửi thông báo.
  - **Payload dự kiến:** (Tùy thuộc vào từng loại Event cụ thể từ BC nguồn. NDM sẽ cần các thông tin như loại thông báo, người nhận (User/Tenant ID), và dữ liệu ngữ cảnh từ payload của Event nguồn).
- **RecipientDetailsUpdated** (Từ IAM)
  - Phát ra khi thông tin người dùng hoặc tổ chức liên quan đến việc nhận thông báo (ví dụ: email, số điện thoại, locale, tùy chọn kênh) thay đổi trong IAM.
  - **Mục đích xử lý:** NDM có thể lắng nghe event này để cập nhật thông tin người nhận trong hệ thống nội bộ hoặc cache nếu có.
  - **Payload dự kiến:** (Thông tin người dùng/tổ chức đã cập nhật, bao gồm các trường liên quan đến nhận thông báo).
- **LocaleUpdated** (Từ RDM/LZM)
  - Phát ra khi thông tin về Locale hoặc ngôn ngữ gốc thay đổi.
  - **Mục đích xử lý:** NDM có thể lắng nghe event này để cập nhật thông tin về các locale được hỗ trợ hoặc ngôn ngữ gốc để đảm bảo việc bản địa hóa nội dung thông báo là chính xác.
  - **Payload dự kiến:** (Thông tin Locale/Ngôn ngữ đã cập nhật).

## **11\. Ranh giới Nghiệp vụ**

Ranh giới của Bounded Context NDM được xác định bởi trách nhiệm quản lý quy trình gửi thông báo từ hệ thống đến người nhận qua nhiều kênh, bao gồm cả việc quản lý các mẫu thông báo và partial templates sử dụng engine Handlebars. NDM sở hữu dữ liệu liên quan đến Mẫu Thông báo, Partial Templates, Yêu cầu Thông báo và các bản ghi Thông báo cụ thể.

NDM không chịu trách nhiệm:

- **Nội dung nghiệp vụ của thông báo:** Các BC khác chịu trách nhiệm xác định khi nào cần gửi thông báo và cung cấp dữ liệu ngữ cảnh cần thiết.
- **Quản lý danh tính người dùng và tổ chức:** NDM phụ thuộc vào IAM để lấy thông tin người nhận và tùy chọn của họ.
- **Quản lý bản dịch ngôn ngữ:** NDM phụ thuộc vào LZM/RDM để lấy nội dung bản địa hóa cho mẫu thông báo (ngoại trừ nội dung trực tiếp trong template/partial).
- **Ghi nhận audit logs:** NDM chỉ phát sự kiện cho ALM.
- **Quản lý asset số:** NDM chỉ tham chiếu đến asset logo trong DAM.
- **Cơ sở hạ tầng gửi thực tế:** NDM định nghĩa các interface chung và tương tác với các dịch vụ/adapter bên ngoài hoặc BC nội bộ chuyên trách việc gửi vật lý (ví dụ: một BC chuyên gửi Push Notification). NDM không quản lý kết nối, cấu hình chi tiết của các dịch vụ gửi bên ngoài.
- **Logic phức tạp bên trong template:** Mặc dù sử dụng Handlebars, NDM tập trung vào việc render dữ liệu đơn giản và nhúng partials. Các logic nghiệp vụ phức tạp hơn nên được xử lý ở BC gửi yêu cầu và cung cấp dữ liệu đã xử lý trong ContextData.

## **12\. Kết luận**

Bounded Context Notification Delivery Management (NDM) là một thành phần cốt lõi quan trọng, tập trung hóa và quản lý quy trình gửi thông báo trong hệ thống Ecoma. Bằng cách định nghĩa rõ các khái niệm (Template, Partial, Request, Message) và luồng nghiệp vụ, NDM đảm bảo việc gửi thông báo được thực hiện hiệu quả, nhất quán trên nhiều kênh và hỗ trợ bản địa hóa, có tính đến tùy chọn người dùng, khả năng xử lý lỗi/thử lại, và khả năng tái sử dụng nội dung thông qua partial templates sử dụng engine Handlebars.

Tài liệu này đã được cập nhật để tuân thủ cấu trúc và mức độ chi tiết của các tài liệu IAM và BUM, bao gồm việc bổ sung phần Các Khía cạnh Quan trọng của Miền, tổ chức lại luồng nghiệp vụ thành Use Cases và chi tiết hóa các Domain Event (Published/Consumed, payload dự kiến). Đây là nền tảng để chuyển sang giai đoạn thiết kế kỹ thuật chi tiết và triển khai Microservice NDM.
