# **Hướng dẫn triển khai Bounded Context Notification Delivery Management (NDM)**

## **1\. Giới thiệu**

Tài liệu này mô tả chi tiết thiết kế triển khai cho Bounded Context Notification Delivery Management (NDM) trong hệ thống Ecoma. NDM là một Bounded Context cốt lõi, chịu trách nhiệm quản lý và thực hiện việc gửi các loại thông báo khác nhau từ hệ thống đến người dùng và tổ chức. Tài liệu này tập trung vào các khía cạnh kỹ thuật triển khai riêng cho NDM, bao gồm cấu trúc service, công nghệ sử dụng cụ thể trong NDM, lưu trữ dữ liệu, giao tiếp đặc thù của NDM, hạ tầng, và các yêu cầu phi chức năng liên quan đến triển khai.

Mục tiêu của tài liệu này là cung cấp hướng dẫn chi tiết cho đội ngũ kỹ thuật để xây dựng, triển khai và vận hành Microservice(s) hiện thực hóa Bounded Context NDM, đảm bảo tuân thủ các nguyên tắc kiến trúc tổng thể của Ecoma (Microservices, DDD, EDA, CQRS, Clean Architecture) và đạt được các mục tiêu hệ thống (Tính sẵn sàng cao, Khả năng mở rộng, Hiệu năng, Bảo mật).

## **2\. Bối cảnh Kiến trúc Tổng thể**

Hệ thống Ecoma được xây dựng trên nền tảng kiến trúc Microservices, phân rã theo Bounded Contexts của DDD. Giao tiếp giữa các service backend chủ yếu sử dụng Event-Driven Architecture (EDA) và Request/Reply. Bên trong mỗi service, mô hình CQRS và Clean Architecture được áp dụng bắt buộc.

NDM là một Core Bounded Context, đóng vai trò là một trung tâm thông báo tập trung. NDM nhận yêu cầu gửi thông báo từ các BC khác, xử lý logic gửi (chọn kênh, bản địa hóa nội dung, v.v.) và theo dõi trạng thái gửi, đảm bảo thông tin quan trọng được truyền tải hiệu quả đến đúng người nhận, đúng thời điểm và đúng cách. NDM tương tác chặt chẽ với IAM (để lấy thông tin người nhận và tùy chọn), LZM/RDM (để bản địa hóa và dữ liệu tham chiếu), ALM (để ghi log), và tích hợp với các Sending Gateways bên ngoài.

## **3\. Mối quan hệ với Tài liệu Thiết kế Miền NDM**

Tài liệu này là phần tiếp theo của tài liệu **Thiết kế Miền NDM (ndm.md)**. Trong khi tài liệu Thiết kế Miền tập trung vào việc định nghĩa các khái niệm nghiệp vụ cốt lõi, Aggregate Root (NotificationTemplate, NotificationPartial, NotificationRequest), Entity (TemplateContent, NotificationMessage), Value Object (Channel, Locale, NotificationContext, NotificationStatus, RecipientDetails), Ngôn ngữ Chung, Use Cases, Domain Services và Application Services ở cấp độ logic và nghiệp vụ, tài liệu này đi sâu vào cách các định nghĩa đó được hiện thực hóa và triển khai về mặt kỹ thuật.

- **Domain Services và Application Services:** Vai trò và trách nhiệm của các loại service này đã được định nghĩa chi tiết trong tài liệu Thiết kế Miền NDM. Trong tài liệu triển khai này, chúng ta xem xét cách các service kỹ thuật (NDM Command Service, NDM Query Service, NDM Ingestion Worker, NDM Sending Worker, NDM Callback Worker, NDM Retry Scheduler Worker) sẽ chứa và tổ chức các Domain Services và Application Services tương ứng theo mô hình Clean Architecture và CQRS. Chi tiết về từng Domain Service hoặc Application Service cụ thể (tên, phương thức, logic) sẽ không được lặp lại ở đây mà được tham chiếu đến tài liệu Thiết kế Miền.
- **Domain Events:** Các Domain Event mà NDM phát ra hoặc xử lý đã được xác định trong tài liệu Thiết kế Miền NDM, bao gồm mục đích và payload dự kiến. Tài liệu triển khai này mô tả cách các event đó được truyền tải vật lý trong hệ thống (sử dụng RabbitMQ) và cách các service lắng nghe/phát event. Chi tiết về từng loại Domain Event cụ thể sẽ không được lặp lại ở đây mà được tham chiếu đến tài liệu Thiết kế Miền.

## **4\. Đơn vị Triển khai (Deployment Units)**

Dựa trên mô hình CQRS bắt buộc và tính chất nghiệp vụ của NDM bao gồm việc nhận yêu cầu gửi thông báo từ nhiều nguồn, quản lý mẫu, render nội dung, gửi thông báo qua nhiều kênh, xử lý callback/webhook, và quản lý thử lại/lịch trình, NDM sẽ được triển khai thành nhiều đơn vị Microservice/Worker để tối ưu hóa khả năng mở rộng và quản lý tài nguyên.

**Đề xuất:** Triển khai NDM thành **sáu** đơn vị triển khai riêng biệt để tối ưu hóa khả năng mở rộng và quản lý tài nguyên, phù hợp với mô hình CQRS và tính chất tác vụ:

1. **NDM Command Service:**
   - **Trách nhiệm:** Xử lý các yêu cầu thay đổi trạng thái (Commands) liên quan đến quản lý Notification Template và Notification Partial (tạo, cập nhật, xóa).
   - **Mô hình:** Write Model của CQRS cho dữ liệu quản lý mẫu. Chứa các Application Services và Domain Services liên quan đến quản lý Template/Partial. Phát ra Domain Events về thay đổi mẫu.
   - **Yêu cầu:** Đảm bảo tính toàn vẹn dữ liệu khi ghi.
   - **Giao tiếp:** Nhận Command thông qua cơ chế Request/Reply của hệ thống (sử dụng NATS) từ API Gateway/Admin UI/TMS. Gọi ALM (qua Request/Reply hoặc Event) để ghi log audit.
2. **NDM Query Service:**
   - **Trách nhiệm:** Xử lý tất cả các yêu cầu truy vấn (Queries) thông tin về Notification Template, Notification Partial, Notification Request, và Notification Message history từ các Bounded Context khác, giao diện người dùng, Admin UI/TMS.
   - **Mô hình:** Read Model của CQRS cho dữ liệu quản lý mẫu và lịch sử gửi. Chứa các Application Services và Domain Services liên quan đến truy vấn dữ liệu.
   - **Yêu cầu:** Hiệu năng cao, độ trễ thấp cho các truy vấn dữ liệu quản lý và lịch sử.
   - **Giao tiếp:** Nhận Query thông qua cơ chế Request/Reply của hệ thống (sử dụng NATS) từ API Gateway hoặc các service/hệ thống khác. Truy vấn dữ liệu từ Database của NDM.
3. **NDM Ingestion Worker:**
   - **Trách nhiệm:** Lắng nghe và xử lý các Domain Event hoặc nhận Commands từ các Bounded Context khác yêu cầu gửi thông báo. Trích xuất dữ liệu từ payload, validate yêu cầu, tạo bản ghi NotificationRequest và các bản ghi NotificationMessage ban đầu (xác định kênh dựa trên template, yêu cầu, tùy chọn người nhận), và lưu trữ vào kho dữ liệu chính của NDM.
   - **Mô hình:** Xử lý tác vụ nền bất đồng bộ, Event Consumer/Command Handler. Chứa các Application Services và Domain Services liên quan đến việc nhận và xử lý yêu cầu gửi.
   - **Yêu cầu:** Độ tin cậy cao cho việc xử lý yêu cầu (đảm bảo không mất yêu cầu gửi), khả năng xử lý volume yêu cầu lớn.
   - **Giao tiếp:** Lắng nghe Domain Events từ Message Broker (RabbitMQ) hoặc nhận Commands qua Request/Reply/Command Queue. Ghi dữ liệu vào Database của NDM. Gọi IAM (qua Request/Reply) để lấy thông tin người nhận và tùy chọn. Gọi RDM/LZM (qua Request/Reply) để lấy thông tin locale/ngôn ngữ gốc. Phát sự kiện NotificationRequestCreated. Gọi ALM (qua Request/Reply hoặc Event) để ghi log audit.
4. **NDM Sending Worker:**
   - **Trách nhiệm:** Định kỳ hoặc theo tín hiệu, đọc các bản ghi NotificationMessage có trạng thái Pending hoặc Retrying từ Database. Render nội dung thông báo cuối cùng (sử dụng Handlebars, gọi LZM/RDM nếu cần), gọi Sending Gateways (qua Adapters) để gửi thông báo vật lý, và cập nhật trạng thái NotificationMessage sang Sending.
   - **Mô hình:** Xử lý tác vụ nền bất đồng bộ, Polling/Event Driven. Chứa các Application Services và Domain Services liên quan đến việc gửi thông báo.
   - **Yêu cầu:** Hiệu năng cao cho việc render và gọi Sending Gateways, khả năng xử lý volume thông báo cần gửi.
   - **Giao tiếp:** Đọc từ Database của NDM. Gọi LZM/RDM (qua Request/Reply) để lấy bản dịch/thông tin locale. Gọi Sending Gateways (qua HTTP/SDKs). Cập nhật trạng thái trong Database NDM. Phát sự kiện NotificationSent hoặc NotificationSendingFailed (nếu lỗi vĩnh viễn). Gọi ALM (qua Request/Reply hoặc Event) để ghi log audit.
5. **NDM Callback Worker:**
   - **Trách nhiệm:** Lắng nghe và xử lý các callback/webhook bất đồng bộ từ các Sending Gateways bên ngoài thông báo về trạng thái gửi cuối cùng (Delivered, Read, Failed) hoặc các trạng thái trung gian. Cập nhật trạng thái tương ứng cho bản ghi NotificationMessage trong Database của NDM.
   - **Mô hình:** Xử lý tác vụ nền bất đồng bộ, Event Consumer/Webhook Receiver.
   - **Yêu cầu:** Độ tin cậy cao cho việc xử lý callback.
   - **Giao tiếp:** Nhận callback qua HTTP Endpoint hoặc Event từ Message Broker. Cập nhật trạng thái trong Database NDM. Phát sự kiện NotificationDelivered, NotificationRead, NotificationSendingFailed (nếu lỗi được xác định là vĩnh viễn từ callback). Gọi ALM (qua Request/Reply hoặc Event) để ghi log audit.
6. **NDM Retry Scheduler Worker:**
   - **Trách nhiệm:** Chạy các tác vụ định kỳ theo lịch trình. Quét các bản ghi NotificationMessage có trạng thái Retrying và NextRetryTime \<= current_time. Áp dụng logic Retry Strategy (tăng RetryCount, tính NextRetryTime mới) và cập nhật trạng thái NotificationMessage trở lại Pending để NDM Sending Worker xử lý lại, hoặc đánh dấu là Failed nếu đã đạt giới hạn thử lại.
   - **Mô hình:** Xử lý tác vụ nền bất đồng bộ, Scheduled Tasks. Chứa các Application Services và Domain Services liên quan đến quản lý thử lại.
   - **Yêu cầu:** Độ tin cậy cao cho việc chạy tác vụ định kỳ.
   - **Giao tiếp:** Đọc và cập nhật trạng thái trong Database NDM. Phát sự kiện NotificationRetryScheduled hoặc NotificationSendingFailed. Gọi ALM (qua Request/Reply hoặc Event) để ghi log audit.

Cấu trúc thư mục trong Nx Monorepo sẽ tuân thủ mô hình đã định nghĩa, với các apps/services và apps/workers riêng biệt cho từng đơn vị triển khai của NDM.

## **5\. Nền tảng Công nghệ Cụ thể cho NDM**

NDM sẽ sử dụng nền tảng công nghệ chung của hệ thống Ecoma, với lựa chọn cụ thể cho lưu trữ dữ liệu, caching, và xử lý template:

- **Cơ sở dữ liệu Chính:** PostgreSQL (Sử dụng TypeORM) \- Phù hợp cho dữ liệu có cấu trúc quan hệ như Template, Partial, Request, Message. Cần sử dụng JSONB để lưu trữ ContextData linh hoạt và Indexing để tối ưu hóa truy vấn.
- **Cache/Tạm thời:** Redis \- Có thể được sử dụng trong NDM Query Service để cache các Template và Partial thường xuyên được truy vấn để tăng tốc độ render. Cũng có thể dùng cho Rate Limiting hoặc Throttling nếu cần kiểm soát tốc độ gửi thông báo.
- **Engine Template:** Handlebars \- Được sử dụng để render nội dung thông báo từ Template và Partial kết hợp với ContextData. Thư viện Handlebars sẽ được tích hợp vào NDM Sending Worker.
- **Thư viện Bản địa hóa:** Sử dụng các thư viện hỗ trợ xử lý bản dịch phức tạp (ví dụ: formatjs) để kết hợp với Handlebars khi render nội dung bản địa hóa.
- **Adapters Sending Gateway:** Triển khai các lớp Adapter chuyên biệt cho từng loại Sending Gateway (ví dụ: adapter cho SendGrid, adapter cho Twilio, adapter cho In-App Notification Service nội bộ) để trừu tượng hóa logic gọi API bên ngoài.

## **6\. Lưu trữ Dữ liệu (Data Storage)**

NDM sẽ sở hữu cơ sở dữ liệu riêng (PostgreSQL), tách biệt với các BC khác. Redis được sử dụng làm lớp cache hiệu năng cao.

### **6.1. Schema PostgreSQL (Write Model & Primary Read Model)**

Thiết kế schema cho PostgreSQL để lưu trữ các Aggregate Root và Entity chính của NDM.

**Bảng notification_templates:**

- id UUID PRIMARY KEY
- type VARCHAR(255) NOT NULL UNIQUE
- name VARCHAR(255) NOT NULL
- description TEXT
- supported_channels VARCHAR(50)\[\] NOT NULL \-- Array of Channel Value Object strings
- channel_priority VARCHAR(50)\[\] \-- Optional, Array of Channel Value Object strings
- required_context_data JSONB \-- JSON array of required context keys
- is_active BOOLEAN NOT NULL DEFAULT TRUE
- created_at TIMESTAMP WITH TIME ZONE NOT NULL
- updated_at TIMESTAMP WITH TIME ZONE NOT NULL

**Bảng template_contents:** (Thuộc notification_templates)

- id UUID PRIMARY KEY
- template_id UUID NOT NULL, FOREIGN KEY notification_templates(id) ON DELETE CASCADE
- channel VARCHAR(50) NOT NULL \-- Channel Value Object string
- locale VARCHAR(10) NOT NULL \-- Locale Value Object string
- subject_template TEXT \-- Optional (for Email)
- body_template TEXT NOT NULL \-- Handlebars template content
- created_at TIMESTAMP WITH TIME ZONE NOT NULL
- UNIQUE (template_id, channel, locale)

**Bảng notification_partials:**

- id UUID PRIMARY KEY
- name VARCHAR(255) NOT NULL UNIQUE
- description TEXT
- channel VARCHAR(50) \-- Optional, Channel Value Object string
- locale VARCHAR(10) \-- Optional, Locale Value Object string
- content TEXT NOT NULL \-- Handlebars partial content
- required_context_data JSONB \-- JSON array of required context keys
- is_active BOOLEAN NOT NULL DEFAULT TRUE
- created_at TIMESTAMP WITH TIME ZONE NOT NULL
- updated_at TIMESTAMP WITH TIME ZONE NOT NULL

**Bảng notification_requests:**

- id UUID PRIMARY KEY
- requesting_bounded_context VARCHAR(100) NOT NULL
- notification_type VARCHAR(255) NOT NULL \-- Links to notification_templates.type
- recipient_user_id UUID \-- Optional, Links to IAM
- recipient_tenant_id UUID \-- Optional, Links to IAM
- context_data JSONB \-- NotificationContext Value Object
- requested_channels VARCHAR(50)\[\] \-- Optional, Array of Channel Value Object strings
- created_at TIMESTAMP WITH TIME ZONE NOT NULL

**Bảng notification_messages:** (Thuộc notification_requests)

- id UUID PRIMARY KEY
- request_id UUID NOT NULL, FOREIGN KEY notification_requests(id) ON DELETE CASCADE
- channel VARCHAR(50) NOT NULL \-- Channel Value Object string
- recipient_details JSONB \-- RecipientDetails Value Object (e.g., {"email": "...", "phone": "..."})
- status VARCHAR(50) NOT NULL DEFAULT 'Pending' \-- NotificationStatus Value Object
- sent_at TIMESTAMP WITH TIME ZONE \-- Optional
- failed_reason TEXT \-- Optional
- external_message_id VARCHAR(255) \-- Optional, ID từ Sending Gateway
- rendered_content TEXT \-- Optional, Nội dung cuối cùng sau render
- retry_count INTEGER NOT NULL DEFAULT 0
- next_retry_time TIMESTAMP WITH TIME ZONE \-- Optional
- created_at TIMESTAMP WITH TIME ZONE NOT NULL
- updated_at TIMESTAMP WITH TIME ZONE NOT NULL
- UNIQUE (request_id, channel) \-- Một yêu cầu chỉ tạo 1 message cho mỗi kênh

**Chỉ mục (Indexes):**

- CREATE UNIQUE INDEX idx_notification_templates_type ON notification_templates (type);
- CREATE UNIQUE INDEX idx_template_contents_template_channel_locale ON template_contents (template_id, channel, locale);
- CREATE UNIQUE INDEX idx_notification_partials_name ON notification_partials (name);
- CREATE INDEX idx_notification_requests_recipient_user ON notification_requests (recipient_user_id) WHERE recipient_user_id IS NOT NULL;
- CREATE INDEX idx_notification_requests_recipient_tenant ON notification_requests (recipient_tenant_id) WHERE recipient_tenant_id IS NOT NULL;
- CREATE INDEX idx_notification_requests_type ON notification_requests (notification_type);
- CREATE INDEX idx_notification_messages_status ON notification_messages (status); \-- Quan trọng cho Sending Worker
- CREATE INDEX idx_notification_messages_next_retry_time ON notification_messages (next_retry_time) WHERE status \= 'Retrying'; \-- Quan trọng cho Retry Scheduler Worker
- CREATE INDEX idx_notification_messages_external_id ON notification_messages (external_message_id) WHERE external_message_id IS NOT NULL; \-- Quan trọng cho Callback Worker

### **6.2. Cấu trúc Cache Redis (Optional)**

Redis có thể được sử dụng làm lớp cache cho NDM Query Service và NDM Sending Worker.

**Chiến lược Key:**

- **Cache Notification Template theo Type:** ndm:template:type:\<type\>
- **Cache Notification Partial theo Name:** ndm:partial:name:\<name\>
- **Cache Template Content theo Template ID, Channel, Locale:** ndm:template_content:\<template_id\>:\<channel\>:\<locale\>

**Chiến lược Value:**

Lưu trữ dữ liệu dưới dạng JSON string.

**Chiến lược Cache Invalidation:**

Khi có bất kỳ thay đổi nào đối với Template hoặc Partial trong NDM Command Service:

- Phát sự kiện NotificationTemplateUpdated, NotificationPartialUpdated, v.v.
- NDM Query Service và NDM Sending Worker (hoặc một Worker riêng) lắng nghe các sự kiện này và invalidation cache key tương ứng.

## **7\. Giao tiếp và Tích hợp**

NDM tương tác với nhiều BC khác và Sending Gateways.

- **Nhận Commands/Queries:**
  - NDM Command Service nhận Commands quản lý mẫu qua Request/Reply (từ API Gateway/Admin UI/TMS).
  - NDM Query Service nhận Queries truy vấn dữ liệu qua Request/Reply (từ API Gateway/Consumer BCs/Admin UI/TMS).
  - NDM Ingestion Worker nhận Commands/Events yêu cầu gửi thông báo (từ BC khác) qua Message Broker (RabbitMQ) hoặc Request/Reply/Command Queue.
  - NDM Import/Export Worker (nếu có) nhận Commands nhập/xuất.
  - NDM Callback Worker nhận callback/webhook từ Sending Gateways (qua HTTP Endpoint hoặc Event).
- **Phát Domain Events:**
  - NDM Command Service phát các Event về thay đổi mẫu (NotificationTemplateUpdated, etc.).
  - NDM Ingestion Worker phát NotificationRequestCreated.
  - NDM Sending Worker phát NotificationSent, NotificationSendingFailed (lỗi vĩnh viễn), NotificationRetryScheduled.
  - NDM Callback Worker phát NotificationDelivered, NotificationRead, NotificationSendingFailed (lỗi vĩnh viễn từ callback).
  - NDM Retry Scheduler Worker phát NotificationRetryScheduled, NotificationSendingFailed (đạt giới hạn retry).
  - Tất cả các worker/service phát Event hoặc gọi API của ALM để ghi log audit.
- **Lắng nghe Domain Events:**
  - NDM Ingestion Worker lắng nghe các Event nghiệp vụ từ các BC khác yêu cầu gửi thông báo.
  - NDM Background Worker lắng nghe các Event từ RDM (Locale/Source Language thay đổi) và IAM (thông tin người nhận/tùy chọn thay đổi).
- **Tương tác với IAM:**
  - NDM Ingestion Worker gọi IAM (qua Request/Reply) để lấy thông tin người nhận và tùy chọn kênh.
  - NDM Query Service gọi IAM (qua Request/Reply) để kiểm tra ủy quyền cho các truy vấn dữ liệu quản lý/lịch sử.
- **Tương tác với LZM & RDM:**
  - NDM Ingestion Worker gọi RDM/LZM (qua Request/Reply) để lấy thông tin locale/ngôn ngữ gốc.
  - NDM Sending Worker gọi LZM (qua Request/Reply) để lấy bản dịch cho nội dung thông báo (nếu không lưu trực tiếp trong template content).
- **Tương tác với ALM:**
  - NDM Command Service, NDM Ingestion Worker, NDM Sending Worker, NDM Callback Worker, NDM Retry Scheduler Worker gọi ALM (qua Request/Reply hoặc Event) để ghi log audit cho các hành động quan trọng.
- **Tương tác với Sending Gateways:**
  - NDM Sending Worker gọi các Sending Gateway (qua Adapters) để gửi thông báo vật lý.
  - NDM Callback Worker nhận callback/webhook từ các Sending Gateway.

## **8\. Định nghĩa API Endpoint và Mapping Use Case**

Phần này phác thảo các API Endpoint chính mà NDM cung cấp thông qua API Gateway (đối với các tương tác từ bên ngoài hệ thống) và mapping chúng với các Use Case đã định nghĩa trong tài liệu Thiết kế Miền NDM.

| API Endpoint (Ví dụ)                                | Phương thức HTTP | Mô tả Chức năng Cấp cao                                                       | Use Case Liên quan (ndm.md)                              | Loại Yêu cầu Nội bộ (CQRS) | Service Xử lý                             |
| :-------------------------------------------------- | :--------------- | :---------------------------------------------------------------------------- | :------------------------------------------------------- | :------------------------- | :---------------------------------------- |
| /api/v1/ndm/templates                               | GET              | Lấy danh sách các mẫu thông báo.                                              | Quản lý Mẫu Thông báo (7.2.1)                            | Query                      | NDM Query Service                         |
| /api/v1/ndm/templates                               | POST             | Tạo mẫu thông báo mới.                                                        | Quản lý Mẫu Thông báo (7.2.1)                            | Command                    | NDM Command Service                       |
| /api/v1/ndm/templates/{templateId}                  | PUT              | Cập nhật mẫu thông báo.                                                       | Quản lý Mẫu Thông báo (7.2.1)                            | Command                    | NDM Command Service                       |
| /api/v1/ndm/templates/{templateId}                  | DELETE           | Xóa mẫu thông báo.                                                            | Quản lý Mẫu Thông báo (7.2.1)                            | Command                    | NDM Command Service                       |
| /api/v1/ndm/partials                                | GET              | Lấy danh sách các partial templates.                                          | Quản lý Partial Templates (7.2.2)                        | Query                      | NDM Query Service                         |
| /api/v1/ndm/partials                                | POST             | Tạo partial template mới.                                                     | Quản lý Partial Templates (7.2.2)                        | Command                    | NDM Command Service                       |
| /api/v1/ndm/partials/{partialId}                    | PUT              | Cập nhật partial template.                                                    | Quản lý Partial Templates (7.2.2)                        | Command                    | NDM Command Service                       |
| /api/v1/ndm/partials/{partialId}                    | DELETE           | Xóa partial template.                                                         | Quản lý Partial Templates (7.2.2)                        | Command                    | NDM Command Service                       |
| /api/v1/ndm/history                                 | GET              | Xem lịch sử các yêu cầu gửi thông báo và trạng thái (cho Admin UI).           | Xem Lịch sử Gửi Thông báo (7.3.1)                        | Query                      | NDM Query Service                         |
| /api/v1/ndm/history/{requestId}                     | GET              | Xem chi tiết một yêu cầu gửi thông báo (cho Admin UI).                        | Xem Chi tiết Yêu cầu Gửi Thông báo (7.3.2)               | Query                      | NDM Query Service                         |
| /api/v1/internal/ndm/send-request                   | POST             | Endpoint nội bộ để nhận yêu cầu gửi thông báo (từ BC khác qua Request/Reply). | Nhận và Xử lý Yêu cầu Gửi Thông báo (7.1.1)              | Command                    | NDM Ingestion Worker (Internal API)       |
| /api/v1/internal/ndm/sending-callback/{gatewayType} | POST             | Endpoint nội bộ để nhận callback/webhook từ Sending Gateways.                 | Gửi Thông báo qua các Kênh, Xử lý Lỗi và Thử lại (7.1.2) | Command                    | NDM Callback Worker (Internal API)        |
| /api/v1/internal/ndm/retry-schedule/run             | POST             | Kích hoạt tác vụ kiểm tra và lên lịch thử lại (dành cho Scheduled Task).      | Gửi Thông báo qua các Kênh, Xử lý Lỗi và Thử lại (7.1.2) | Command                    | NDM Retry Scheduler Worker (Internal API) |

_Lưu ý: Đây là các endpoint ví dụ. Tên và cấu trúc cụ thể có thể được tinh chỉnh trong quá trình thiết kế kỹ thuật chi tiết. Các endpoint /api/v1/internal/... là các endpoint nội bộ, không được public ra ngoài qua API Gateway thông thường._

## **9\. Chiến lược Xử lý Lỗi (Error Handling Strategy)**

Chiến lược xử lý lỗi trong NDM sẽ tuân thủ mô hình chung của Ecoma và phân biệt giữa các loại lỗi, kênh giao tiếp:

- **Lỗi Nghiệp vụ (Business Rule Exceptions):** Các lỗi phát sinh do vi phạm quy tắc nghiệp vụ (ví dụ: loại thông báo không tồn tại, thiếu dữ liệu ngữ cảnh bắt buộc khi render, locale không được hỗ trợ khi render, cố gắng gửi qua kênh không được bật bởi người nhận) sẽ được ném ra từ Domain Services và bắt ở lớp Application Service hoặc lớp xử lý Command/Query/Task.
  - **Đối với giao tiếp Request/Reply (Command/Query API):** Lỗi nghiệp vụ sẽ được chuyển đổi thành phản hồi lỗi có cấu trúc (JSON object) bao gồm mã lỗi và thông báo chi tiết, được trả về cho bên gọi (HTTP status code 400 Bad Request).
  - **Đối với giao tiếp qua Message Broker/Internal APIs (Ingestion, Sending, Callback, Retry):** Lỗi nghiệp vụ xảy ra trong quá trình xử lý (ví dụ: Ingestion Worker nhận yêu cầu với loại thông báo không tồn tại) sẽ được ghi log chi tiết. Các bản ghi NotificationRequest/Message liên quan có thể được đánh dấu trạng thái Failed với lý do cụ thể. Các Event/Command gốc có thể được chuyển vào DLQ. Phát các Event thông báo lỗi (NotificationSendingFailed, NotificationIngestionFailed).
- **Lỗi Kỹ thuật (Technical Errors):** Các lỗi phát sinh ở lớp Infrastructure (ví dụ: lỗi kết nối DB, lỗi kết nối Message Broker, lỗi cache Redis, lỗi gọi IAM/LZM/RDM/ALM API, lỗi từ Sending Gateway Adapter).
  - Các lỗi này cần được ghi log chi tiết (Structured Logging) với mức độ phù hợp (ERROR), bao gồm stack trace và các thông tin tương quan.
  - **Đối với giao tiếp Request/Reply (Command/Query API):** Lỗi kỹ thuật sẽ được chuyển đổi thành phản hồi lỗi chung (HTTP status code 500 Internal Server Error), ghi log chi tiết ở phía server.
  - **Đối với giao tiếp qua Message Broker/Internal APIs (Ingestion, Sending, Callback, Retry):** Lỗi kỹ thuật sẽ được xử lý theo cơ chế retry của RabbitMQ (đối với Event) hoặc retry nội bộ (đối với các tác vụ khác). Nếu retry vẫn thất bại, message/tác vụ có thể được chuyển vào DLQ hoặc đánh dấu bản ghi liên quan là Failed. Lỗi cũng cần được ghi log và có thể kích hoạt cảnh báo.
  - **Đối với Sending Gateways:** Lỗi từ Sending Gateway Adapter cần được phân loại là tạm thời hoặc vĩnh viễn để áp dụng chiến lược thử lại phù hợp.
- **Lỗi Validate Input:** Đối với các yêu cầu nhận được qua API Endpoint hoặc các Commands/Events nội bộ, lỗi validate input sẽ được xử lý ở lớp Application Service hoặc Handler trước khi xử lý logic nghiệp vụ. Phản hồi lỗi sử dụng HTTP status code 400 Bad Request hoặc đánh dấu bản ghi Request/Message là Failed.
- **Thông báo Lỗi:** Các lỗi quan trọng (lỗi kết nối DB kéo dài, lỗi Ingestion Event/Command liên tục, lỗi gửi thông báo liên tục qua một kênh, lỗi tác vụ Retry Scheduler thất bại) cần kích hoạt cảnh báo thông qua hệ thống giám sát.

## **10\. Khả năng Phục hồi (Resiliency)**

Để đảm bảo NDM chịu lỗi và phục hồi khi các phụ thuộc gặp sự cố và xử lý volume dữ liệu/request lớn:

- **Timeouts và Retries:** Cấu hình timeouts và retry policies cho các cuộc gọi đi đến các phụ thuộc (PostgreSQL, Redis, NATS, RabbitMQ, IAM API, LZM API, RDM API, ALM API, Sending Gateway APIs). Sử dụng các thư viện hỗ trợ retry với exponential backoff và jitter. Quan trọng với việc gọi các BC khác và đặc biệt là Sending Gateways. Áp dụng **Retry Strategy** đã định nghĩa cho việc gửi NotificationMessage.
- **Circuit Breaker:** Áp dụng mẫu Circuit Breaker cho các cuộc gọi đến các phụ thuộc có khả năng gặp sự cố tạm thời (ví dụ: gọi Sending Gateway APIs, IAM API) để ngăn chặn các cuộc gọi liên tục gây quá tải.
- **Bulkhead:** Sử dụng Bulkhead để cô lập tài nguyên giữa các đơn vị triển khai của NDM (Command Service, Query Service, Ingestion Worker, Sending Worker, Callback Worker, Retry Scheduler Worker). Ngăn chặn lỗi ở một worker ảnh hưởng đến worker khác.
- **Health Checks:** Triển khai các loại Health Check Probe trong Kubernetes cho mỗi service/worker NDM:
  - **Startup Probe:** Kiểm tra xem ứng dụng đã khởi động hoàn toàn (kết nối đến DB, Message Broker, Cache đã sẵn sàng).
  - **Liveness Probe:** Kiểm tra xem ứng dụng có đang chạy và khỏe mạnh không. Kiểm tra vòng lặp xử lý message/request/task.
  - **Readiness Probe:** Kiểm tra xem ứng dụng đã sẵn sàng xử lý request/message chưa. Kiểm tra kết nối đến **PostgreSQL** (nguồn dữ liệu chính), **Redis** (nếu sử dụng cache), **Message Broker** (đối với Command Service và Workers), khả năng kết nối đến **IAM API**, **LZM API**, **RDM API** (đối với các service/worker phụ thuộc). Đối với Sending Worker, cần kiểm tra khả năng kết nối đến ít nhất một **Sending Gateway** critical.
- **Idempotency:** Thiết kế Command Handlers (đặc biệt là trong Ingestion Worker) và Event Handlers có tính Idempotent để việc nhận và xử lý trùng lặp một yêu cầu gửi hoặc một callback từ Sending Gateway không gây ra việc gửi trùng lặp hoặc cập nhật trạng thái sai. Sử dụng ID yêu cầu gốc hoặc ID từ Sending Gateway làm key kiểm tra trùng lặp.
- **Queue Monitoring:** Giám sát độ dài hàng đợi (Queue Length) của RabbitMQ cho các queue mà NDM Ingestion Worker và NDM Callback Worker lắng nghe. Giám sát cả các queue nội bộ nếu có (ví dụ: queue cho các message cần gửi lại).

## **11\. Chiến lược Kiểm thử (Testing Strategy)**

Chiến lược kiểm thử cho NDM sẽ tuân thủ mô hình chung của Ecoma:

- **Unit Tests:** Kiểm thử logic nghiệp vụ cốt lõi trong Domain Model (ví dụ: logic chọn kênh, logic xử lý lỗi và thử lại trong NotificationSendingService, logic rendering template), logic xử lý trong Application Services (mapping Commands/Queries/Events sang Domain Service calls) một cách độc lập (sử dụng mock cho Repository, Gateway, Broker, IAM/LZM/RDM client, Sending Gateway Adapters).
- **Integration Tests:** Kiểm thử sự tương tác giữa các thành phần nội bộ của từng service/worker (ví dụ: Ingestion Worker xử lý Event và gọi Repository để ghi vào DB thực hoặc Testcontainers; Sending Worker đọc từ DB, gọi TemplateRenderingService và Sending Gateway Adapter mock/testcontainer; Callback Worker nhận callback và gọi Repository).
- **End-to-End Tests (E2E Tests):** Kiểm thử luồng nghiệp vụ hoàn chỉnh xuyên qua các service (ví dụ: một hành động trong BUM phát Event \-\> NDM Ingestion Worker nhận Event và tạo Request/Messages \-\> NDM Sending Worker xử lý Message và gọi Sending Gateway mock \-\> NDM Callback Worker nhận callback từ Sending Gateway mock và cập nhật trạng thái). Kiểm thử luồng quản lý mẫu qua Admin UI.
- **Contract Tests:** Đảm bảo schema của các Domain Event mà NDM phát ra và lắng nghe tuân thủ "hợp đồng" với các BC khác. Đảm bảo API Endpoint của NDM Query/Command Service tuân thủ "hợp đồng" với các Consumer. Đảm bảo "hợp đồng" với các Sending Gateway Adapters.
- **Component Tests:** Kiểm thử từng service/worker NDM (Command Service, Query Service, Ingestion Worker, Sending Worker, Callback Worker, Retry Scheduler Worker) trong môi trường gần với production, với các phụ thuộc (DB, Redis, Message Broker, IAM, LZM, RDM, ALM, Sending Gateways) được giả lập hoặc sử dụng Testcontainers.
- **Performance/Load Tests:** Kiểm thử tải để xác minh NDM Ingestion Worker có thể xử lý volume yêu cầu gửi dự kiến, NDM Sending Worker có thể xử lý volume thông báo cần gửi, và NDM Query Service có thể đáp ứng yêu cầu hiệu năng cho truy vấn lịch sử.

## **12\. Chiến lược Di chuyển Dữ liệu (Data Migration Strategy)**

Quản lý thay đổi schema database PostgreSQL của NDM cần được thực hiện cẩn thận:

- Sử dụng công cụ quản lý migration schema tự động (ví dụ: Flyway hoặc Liquibase).
- Thiết kế các migration có tính **Backward Compatibility** (chỉ thêm, không xóa/sửa đổi các cột/bảng quan trọng).
- Lập kế hoạch **rollback** cho các migration.
- Đối với các thay đổi dữ liệu phức tạp (ví dụ: chuẩn hóa nội dung mẫu, cập nhật trạng thái hàng loạt), viết **Data Migration Script** riêng biệt.
- Đảm bảo có bản sao lưu (backup) dữ liệu trước khi thực hiện các migration quan trọng.
- Cần có chiến lược seed dữ liệu ban đầu cho các Notification Template và Partial Template mặc định của hệ thống.

## **13\. Kế hoạch Dung lượng (Capacity Planning \- Initial)**

Dựa trên ước tính ban đầu về lượng yêu cầu gửi thông báo, số lượng thông báo được tạo ra trên mỗi yêu cầu, tần suất truy vấn lịch sử, đưa ra ước tính ban đầu về tài nguyên cần thiết cho mỗi đơn vị triển khai của NDM. Các con số này là điểm khởi đầu và sẽ được điều chỉnh dựa trên dữ liệu thực tế sau khi triển khai và giám sát.

- **NDM Command Service:** Nhận lượng request quản lý mẫu (dự kiến không quá lớn).
  - Số lượng Pod tối thiểu: 3-5
  - Số lượng Pod tối đa: 5-10
  - Giới hạn CPU mỗi Pod: 300m \- 700m
  - Giới hạn Memory mỗi Pod: 512Mi \- 1Gi
  - Cấu hình HPA: Dựa trên CPU Utilization và Request Rate.
- **NDM Query Service:** Nhận lượng request truy vấn dữ liệu (dự kiến không quá lớn so với các Query Service khác như IAM/BUM, trừ khi có báo cáo phức tạp).
  - Số lượng Pod tối thiểu: 3-5
  - Số lượng Pod tối đa: 5-10
  - Giới hạn CPU mỗi Pod: 300m \- 700m
  - Giới hạn Memory mỗi Pod: 512Mi \- 1Gi
  - Cấu hình HPA: Dựa trên CPU Utilization và Request Rate.
- **NDM Ingestion Worker:** Dự kiến nhận lượng Event/Command yêu cầu gửi thông báo _lớn_.
  - Số lượng Pod tối thiểu: 3-5
  - Số lượng Pod tối đa: 15+
  - Giới hạn CPU mỗi Pod: 300m \- 700m
  - Giới hạn Memory mỗi Pod: 512Mi \- 1Gi
  - Cấu hình HPA: Dựa trên CPU Utilization và độ dài hàng đợi Message Broker.
- **NDM Sending Worker:** Dự kiến xử lý lượng NotificationMessage _rất lớn_ cần gửi. Đây có thể là worker tốn tài nguyên nhất do render và gọi external API.
  - Số lượng Pod tối thiểu: 5-10
  - Số lượng Pod tối đa: 20+ (có thể cần scale rất cao)
  - Giới hạn CPU mỗi Pod: 500m \- 1000m
  - Giới hạn Memory mỗi Pod: 1Gi \- 2Gi (cho rendering)
  - Cấu hình HPA: Chủ yếu dựa trên CPU Utilization và độ dài hàng đợi nội bộ/số lượng message Pending/Retrying.
- **NDM Callback Worker:** Lượng tải xử lý callback tùy thuộc vào volume thông báo gửi đi.
  - Số lượng Pod tối thiểu: 2-3
  - Số lượng Pod tối đa: 5-10
  - Giới hạn CPU mỗi Pod: 200m \- 500m
  - Giới hạn Memory mỗi Pod: 256Mi \- 512Mi
  - Cấu hình HPA: Dựa trên CPU Utilization và độ dài hàng đợi Message Broker/lượng callback.
- **NDM Retry Scheduler Worker:** Lượng tải xử lý tác vụ định kỳ dự kiến không quá lớn.
  - Số lượng Pod tối thiểu: 2
  - Số lượng Pod tối đa: 3-5
  - Giới hạn CPU mỗi Pod: 200m \- 500m
  - Giới hạn Memory mỗi Pod: 256Mi \- 512Mi
  - Cấu hình HPA: Có thể dựa trên CPU Utilization.
- **PostgreSQL Database:** Cần được cấu hình mạnh mẽ để xử lý lượng ghi từ Ingestion Worker và lượng đọc từ Query Service/Sending Worker/Retry Scheduler Worker.
  - Kích thước đĩa ban đầu: 50GB+ (dự kiến dữ liệu Request và Message sẽ tăng trưởng nhanh)
  - RAM: 16GB \- 32GB+
  - CPU: 4-8+ core
  - Cần cấu hình Connection Pooling hiệu quả và tối ưu hóa indexing.
- **Redis Cache:** Nếu được sử dụng, kích thước bộ nhớ cần thiết sẽ phụ thuộc vào lượng dữ liệu cached (Template, Partial).

Các con số này cần được xem xét kỹ lưỡng hơn dựa trên phân tích tải chi tiết và được theo dõi, điều chỉnh liên tục sau khi hệ thống đi vào hoạt động.

## **14\. Phụ thuộc (Dependencies)**

- **Phụ thuộc Nội bộ (Internal Dependencies):**
  - Các BC khác (BUM, ODM, PIM, v.v.) là Producer của Commands/Events yêu cầu gửi thông báo.
  - Admin UI/TMS là Consumer của NDM Command/Query Service và Producer của Commands quản lý mẫu và yêu cầu gửi (qua API Gateway).
  - IAM là nhà cung cấp thông tin người nhận và tùy chọn cho NDM Ingestion Worker.
  - LZM và RDM là nhà cung cấp dữ liệu bản địa hóa/tham chiếu cho NDM Ingestion Worker và NDM Sending Worker.
  - ALM là Consumer của các sự kiện audit log từ NDM.
  - NDM Ingestion Worker, Sending Worker, Callback Worker, Retry Scheduler Worker tương tác với Database NDM.
  - NDM Ingestion Worker có thể gọi NDM Command Service nội bộ (hoặc ghi trực tiếp vào DB).
- **Phụ thuộc Bên ngoài (External Dependencies):**
  - Database (PostgreSQL, Redis).
  - Message Brokers (NATS, RabbitMQ).
  - Sending Gateway APIs (Email, SMS, Push, In-App \- có thể là dịch vụ bên ngoài hoặc BC nội bộ chuyên biệt).
  - Container Registry.
  - Kubernetes API.

## **15\. Kết luận**

Tài liệu thiết kế triển khai cho Bounded Context Notification Delivery Management (NDM) đã được xây dựng dựa trên tài liệu thiết kế miền NDM và tuân thủ chặt chẽ kiến trúc Microservices, CQRS và Clean Architecture của hệ thống Ecoma. Việc phân tách NDM thành nhiều đơn vị triển khai riêng biệt (Command Service, Query Service, Ingestion Worker, Sending Worker, Callback Worker, Retry Scheduler Worker) là cần thiết để đáp ứng yêu cầu về khả năng mở rộng, hiệu năng và độ tin cậy cho việc xử lý volume yêu cầu gửi lớn, gửi thông báo đa kênh, xử lý callback và quản lý thử lại. Việc sử dụng PostgreSQL, Redis, Handlebars và các Adapter cho Sending Gateways được lựa chọn để đảm bảo tính toàn vẹn, hiệu năng và khả năng mở rộng cần thiết. Các khía cạnh quan trọng về giao tiếp (Request/Reply, Eventing, Callback), xử lý lỗi, khả năng phục hồi (đặc biệt là Retry Strategy), kiểm thử và vận hành đã được đề cập, phác thảo các chiến lược và yêu cầu kỹ thuật.

Tài liệu này cung cấp nền tảng vững chắc cho đội ngũ kỹ thuật để tiến hành thiết kế kỹ thuật chi tiết hơn (ví dụ: chi tiết implementation của Domain/Application Service, cấu trúc Command/Query/Event payload chi tiết, thiết kế các Sending Gateway Adapters) và bắt đầu quá trình triển khai thực tế Microservice(s) NDM, đảm bảo tuân thủ các nguyên tắc và mục tiêu kiến trúc của hệ thống Ecoma.
