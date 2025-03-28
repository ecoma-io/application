# **Tài liệu Thiết kế Triển khai: Bounded Context Identity & Access Management (IAM)**

## **1\. Giới thiệu**

Tài liệu này mô tả chi tiết thiết kế triển khai cho Bounded Context Identity & Access Management (IAM) trong hệ thống Ecoma. IAM là một Bounded Context cốt lõi, chịu trách nhiệm quản lý danh tính và quyền truy cập trên toàn hệ thống. Tài liệu này tập trung vào các khía cạnh kỹ thuật triển khai riêng cho IAM, bao gồm cấu trúc service, công nghệ sử dụng cụ thể trong IAM, lưu trữ dữ liệu, giao tiếp đặc thù của IAM, hạ tầng, và các yêu cầu phi chức năng liên quan đến triển khai.

Mục tiêu của tài liệu này là cung cấp hướng dẫn chi tiết cho đội ngũ kỹ thuật để xây dựng, triển khai và vận hành Microservice(s) hiện thực hóa Bounded Context IAM, đảm bảo tuân thủ các nguyên tắc kiến trúc tổng thể của Ecoma (Microservices, DDD, EDA, CQRS, Clean Architecture) và đạt được các mục tiêu hệ thống (Tính sẵn sàng cao, Khả năng mở rộng, Hiệu năng, Bảo mật).

## **2\. Bối cảnh Kiến trúc Tổng thể**

Hệ thống Ecoma được xây dựng trên nền tảng kiến trúc Microservices, phân rã theo Bounded Contexts của DDD. Giao tiếp giữa các service backend chủ yếu sử dụng Event-Driven Architecture (EDA) và Request/Reply. Bên trong mỗi service, mô hình CQRS và Clean Architecture được áp dụng bắt buộc.

IAM là một Core Bounded Context, đóng vai trò nền tảng trong việc quản lý danh tính (Identity) của người dùng và tổ chức (Tenant), cũng như kiểm soát quyền truy cập (Access Management) vào các tài nguyên và tính năng trên toàn bộ nền tảng Ecoma. IAM đảm bảo rằng chỉ những người dùng được xác thực và có quyền mới có thể truy cập các chức năng phù hợp.

## **3\. Mối quan hệ với Tài liệu Thiết kế Miền IAM**

Tài liệu này là phần tiếp theo của tài liệu **Thiết kế Miền IAM (iam.md)**. Trong khi tài liệu Thiết kế Miền tập trung vào việc định nghĩa các khái niệm nghiệp vụ cốt lõi, Aggregate Root, Entity, Value Object, Ngôn ngữ Chung, Use Cases, Domain Services, Application Services và Domain Events ở cấp độ logic và nghiệp vụ, tài liệu này đi sâu vào cách các định nghĩa đó được hiện thực hóa và triển khai về mặt kỹ thuật.

- **Domain Services và Application Services:** Vai trò và trách nhiệm của các loại service này đã được định nghĩa chi tiết trong tài liệu Thiết kế Miền IAM. Trong tài liệu triển khai này, chúng ta xem xét cách các service kỹ thuật (IAM Query Service, IAM Command Service, IAM Background Worker) sẽ chứa và tổ chức các Domain Services và Application Services tương ứng theo mô hình Clean Architecture và CQRS. Chi tiết về từng Domain Service hoặc Application Service cụ thể (tên, phương thức, logic) sẽ không được lặp lại ở đây mà được tham chiếu đến tài liệu Thiết kế Miền.
- **Domain Events:** Các Domain Event mà IAM phát ra hoặc xử lý đã được xác định trong tài liệu Thiết kế Miền IAM, bao gồm mục đích và payload dự kiến. Tài liệu triển khai này mô tả cách các event đó được truyền tải vật lý trong hệ thống (sử dụng RabbitMQ) và cách các service lắng nghe/phát event. Chi tiết về từng loại Domain Event cụ thể sẽ không được lặp lại ở đây mà được tham chiếu đến tài liệu Thiết kế Miền.

## **4\. Đơn vị Triển khai (Deployment Units)**

Dựa trên mô hình CQRS bắt buộc và tính chất nghiệp vụ của IAM bao gồm cả luồng đọc (xác thực, ủy quyền, truy vấn thông tin) và luồng ghi/xử lý (đăng ký, quản lý người dùng/tổ chức/vai trò, xử lý lời mời, khôi phục mật khẩu, xác minh email), cùng với các tác vụ nền (lắng nghe events từ BUM, kiểm tra định kỳ), IAM sẽ được triển khai thành nhiều đơn vị Microservice/Worker để tối ưu hóa khả năng mở rộng và quản lý tài nguyên.

**Đề xuất:** Triển khai IAM thành **ba** đơn vị triển khai riêng biệt để tối ưu hóa khả năng mở rộng và quản lý tài nguyên, phù hợp với mô hình CQRS:

1. **IAM Query Service:**
   - **Trách nhiệm:** Xử lý tất cả các yêu cầu truy vấn (Queries) thông tin về người dùng, tổ chức, vai trò, quyền hạn, danh sách thành viên, phiên làm việc từ các Bounded Context khác và giao diện người dùng. Đặc biệt quan trọng là xử lý các yêu cầu kiểm tra quyền (Authorization Flow).
   - **Mô hình:** Read Model của CQRS. Chứa các Application Services và Domain Services liên quan đến truy vấn dữ liệu và ủy quyền.
   - **Yêu cầu:** Hiệu năng cao, độ trễ thấp, tính sẵn sàng cao. Cần hỗ trợ truy vấn nhanh thông tin User, Organization, Membership, Role, Permission và kiểm tra quyền dựa trên Vai trò, Quyền hạn, Entitlement (cached).
   - **Giao tiếp:** Nhận Query thông qua cơ chế Request/Reply của hệ thống (sử dụng NATS) từ API Gateway hoặc các service backend khác.
2. **IAM Command Service:**
   - **Trách nhiệm:** Xử lý các yêu cầu thay đổi trạng thái (Commands) liên quan đến quản lý User, Organization, Role, PermissionDefinition, Invitation, Membership (tạo, cập nhật, xóa, thay đổi trạng thái, v.v.). Xử lý các luồng nghiệp vụ như đăng ký, đăng nhập, đăng xuất, khôi phục/đặt lại mật khẩu, xác minh email, mời/chấp nhận/thu hồi lời mời, quản lý thành viên, cập nhật cài đặt tổ chức.
   - **Mô hình:** Write Model của CQRS. Chứa các Application Services và Domain Services liên quan đến quản lý dữ liệu và các luồng nghiệp vụ chính. Phát ra Domain Events.
   - **Yêu cầu:** Đảm bảo tính toàn vẹn dữ liệu khi ghi. Cần xử lý lỗi nghiệp vụ (ví dụ: trùng email, mật khẩu yếu, quy tắc xóa Owner). Có thể chịu độ trễ cao hơn so với Query Service nhưng vẫn cần đáp ứng yêu cầu về trải nghiệm người dùng (ví dụ: đăng nhập, đăng ký).
   - **Giao tiếp:** Nhận Command thông qua cơ chế Request/Reply của hệ thống (sử dụng NATS) từ API Gateway/Admin UI hoặc các service backend khác. Phát Domain Events thông qua cơ chế Eventing của hệ thống (sử dụng RabbitMQ).
3. **IAM Background Worker:**
   - **Trách nhiệm:** Xử lý các tác vụ nền hoặc ít ưu tiên hơn, không yêu cầu phản hồi tức thời. Ví dụ: Lắng nghe và xử lý các Domain Events từ BUM (SubscriptionActivated, SubscriptionPlanChanged, SubscriptionSuspension) để cập nhật trạng thái Tổ chức và Entitlement cached. Chạy các tác vụ định kỳ (ví dụ: kiểm tra token hết hạn, kiểm tra định kỳ trạng thái Tổ chức từ BUM).
   - **Mô hình:** Xử lý tác vụ nền bất đồng bộ. Chứa các Event Consumers và Scheduled Tasks Application Service.
   - **Yêu cầu:** Độ tin cậy cao cho việc xử lý event và chạy tác vụ định kỳ. Có thể chịu độ trễ xử lý nhất định.
   - **Giao tiếp:** Lắng nghe Domain Events từ Message Broker (RabbitMQ). Có thể gọi IAM Command Service (qua Command hoặc Request/Reply) để thực hiện các cập nhật cần thiết hoặc IAM Query Service để lấy thông tin (tuy nhiên, nên giảm thiểu phụ thuộc đồng bộ).

Cấu trúc thư mục trong Nx Monorepo sẽ tuân thủ mô hình đã định nghĩa, với các apps/services và apps/workers riêng biệt cho IAM Query, IAM Command và IAM Background Worker.

## **5\. Nền tảng Công nghệ Cụ thể cho IAM**

IAM sẽ sử dụng nền tảng công nghệ chung của hệ thống Ecoma, với lựa chọn cụ thể cho lưu trữ dữ liệu và caching:

- **Cơ sở dữ liệu Chính:** PostgreSQL (Sử dụng TypeORM) \- Phù hợp cho dữ liệu có cấu trúc quan hệ chặt chẽ và yêu cầu tính toàn vẹn dữ liệu cao như User, Organization, Membership, Role, PermissionDefinition, Invitation, Session. Cần xem xét cách lưu trữ cấu trúc phân cấp quyền hạn.
- **Cache/Tạm thời:** Redis \- Sử dụng cho caching dữ liệu thường xuyên được truy vấn trong IAM Query Service để giảm tải cho DB và cải thiện hiệu năng đọc, đặc biệt là:
  - Thông tin Session/Token để xác thực nhanh.
  - Thông tin về User, Organization, Membership liên quan đến phiên làm việc.
  - Tập hợp các quyền hạn hiệu quả đã được tính toán trước cho mỗi Vai trò.
  - Thông tin Entitlement cached từ BUM.

## **6\. Lưu trữ Dữ liệu (Data Storage)**

IAM sẽ sở hữu cơ sở dữ liệu riêng (PostgreSQL), tách biệt với các BC khác. Redis được sử dụng làm lớp cache hiệu năng cao.

### **6.1. Schema PostgreSQL (Write Model & Primary Read Model)**

Cần thiết kế schema cho PostgreSQL để lưu trữ các Aggregate Root và Entity chính của IAM. Schema này sẽ là nguồn sự thật cho dữ liệu IAM.

**Bảng users:**

- id UUID PRIMARY KEY
- email VARCHAR(255) NOT NULL UNIQUE
- password_hash VARCHAR(255) NOT NULL
- status VARCHAR(50) NOT NULL DEFAULT 'PendingConfirmation' \-- UserStatus Value Object
- first_name VARCHAR(255) NOT NULL
- last_name VARCHAR(255) NOT NULL
- locale VARCHAR(10) NOT NULL \-- UserProfile Value Object
- password_reset_token VARCHAR(255) UNIQUE \-- Optional
- password_reset_token_expires_at TIMESTAMP WITH TIME ZONE \-- Optional
- email_verification_token VARCHAR(255) UNIQUE \-- Optional
- email_verification_token_expires_at TIMESTAMP WITH TIME ZONE \-- Optional
- created_at TIMESTAMP WITH TIME ZONE NOT NULL
- updated_at TIMESTAMP WITH TIME ZONE NOT NULL

**Bảng organizations:**

- id UUID PRIMARY KEY
- name VARCHAR(255) NOT NULL UNIQUE
- slug VARCHAR(255) NOT NULL UNIQUE \-- OrganizationSlug Value Object
- status VARCHAR(50) NOT NULL DEFAULT 'Active' \-- OrganizationStatus Value Object
- country VARCHAR(10) NOT NULL \-- Foreign Key hoặc tham chiếu đến RDM
- logo_asset_id UUID \-- Optional, tham chiếu đến DAM
- created_at TIMESTAMP WITH TIME ZONE NOT NULL
- updated_at TIMESTAMP WITH TIME ZONE NOT NULL

**Bảng roles:**

- id UUID PRIMARY KEY
- name VARCHAR(255) NOT NULL
- description TEXT
- scope VARCHAR(50) NOT NULL \-- RoleScope Value Object ('Internal', 'Organization')
- organization_id UUID \-- Optional, FOREIGN KEY organizations(id) ON DELETE CASCADE. NULL cho Internal Role.
- is_system_role BOOLEAN NOT NULL DEFAULT FALSE
- created_at TIMESTAMP WITH TIME ZONE NOT NULL
- updated_at TIMESTAMP WITH TIME ZONE NOT NULL
- UNIQUE (name, organization_id) \-- Đảm bảo tên vai trò duy nhất trong phạm vi (nội bộ hoặc tổ chức)

**Bảng permission_definitions:**

- id UUID PRIMARY KEY
- value VARCHAR(255) NOT NULL UNIQUE \-- Chuỗi định danh quyền hạn
- description TEXT
- scope VARCHAR(50) NOT NULL \-- PermissionScope Value Object ('Internal', 'Organization')
- parent_permission_id UUID \-- Optional, FOREIGN KEY permission_definitions(id).
- created_at TIMESTAMP WITH TIME ZONE NOT NULL

**Bảng role_permissions:** (Bảng trung gian cho quan hệ Many-to-Many giữa Role và PermissionDefinition)

- role_id UUID NOT NULL, FOREIGN KEY roles(id) ON DELETE CASCADE
- permission_definition_id UUID NOT NULL, FOREIGN KEY permission_definitions(id) ON DELETE CASCADE
- PRIMARY KEY (role_id, permission_definition_id)

**Bảng memberships:** (Mối quan hệ User \- Scope \- Role)

- id UUID PRIMARY KEY
- user_id UUID NOT NULL, FOREIGN KEY users(id) ON DELETE CASCADE
- organization_id UUID \-- Optional, FOREIGN KEY organizations(id) ON DELETE CASCADE. NULL cho Internal Membership.
- role_id UUID NOT NULL, FOREIGN KEY roles(id) ON DELETE RESTRICT \-- RESTRICT để không xóa Role khi còn Membership sử dụng. Vai trò này phải có Scope tương ứng với Membership Scope.
- joined_at TIMESTAMP WITH TIME ZONE NOT NULL
- UNIQUE (user_id, organization_id) \-- Một User chỉ có một Membership trong một phạm vi (nội bộ hoặc tổ chức cụ thể)

**Bảng invitations:**

- id UUID PRIMARY KEY
- organization_id UUID NOT NULL, FOREIGN KEY organizations(id) ON DELETE CASCADE
- invitee_email VARCHAR(255) NOT NULL
- inviter_user_id UUID NOT NULL, FOREIGN KEY users(id)
- role_id UUID NOT NULL, FOREIGN KEY roles(id) \-- Phải là Organization Role thuộc organization_id
- status VARCHAR(50) NOT NULL DEFAULT 'Pending' \-- InvitationStatus Value Object
- token VARCHAR(255) NOT NULL UNIQUE
- expires_at TIMESTAMP WITH TIME ZONE NOT NULL
- created_at TIMESTAMP WITH TIME ZONE NOT NULL

**Bảng sessions:**

- id UUID PRIMARY KEY
- user_id UUID NOT NULL, FOREIGN KEY users(id) ON DELETE CASCADE
- organization_id UUID \-- Optional, FOREIGN KEY organizations(id). ID tổ chức đang làm việc, NULL nếu phiên nội bộ.
- token VARCHAR(255) NOT NULL UNIQUE \-- Session Token stateful
- expires_at TIMESTAMP WITH TIME ZONE NOT NULL
- created_at TIMESTAMP WITH TIME ZONE NOT NULL

**Chỉ mục (Indexes):**

- CREATE UNIQUE INDEX idx_users_email ON users (email);
- CREATE UNIQUE INDEX idx_organizations_name ON organizations (name);
- CREATE UNIQUE INDEX idx_organizations_slug ON organizations (slug);
- CREATE UNIQUE INDEX idx_roles_name_organization ON roles (name, organization_id);
- CREATE INDEX idx_permission_definitions_parent ON permission_definitions (parent_permission_id);
- CREATE UNIQUE INDEX idx_memberships_user_org ON memberships (user_id, organization_id);
- CREATE INDEX idx_invitations_email ON invitations (invitee_email);
- CREATE INDEX idx_invitations_org_status ON invitations (organization_id, status);
- CREATE UNIQUE INDEX idx_sessions_token ON sessions (token);
- CREATE INDEX idx_sessions_user ON sessions (user_id);

### **6.2. Cấu trúc Cache Redis (Read Model Cache)**

Redis sẽ được sử dụng làm lớp cache cho IAM Query Service để lưu trữ các dữ liệu thường xuyên được truy vấn và yêu cầu hiệu năng cao. Chiến lược cache là "Cache-Aside" kết hợp với invalidation dựa trên Domain Events từ IAM Command Service và các Worker lắng nghe sự kiện từ BUM.

**Chiến lược Key:**

Sử dụng cấu trúc key rõ ràng để dễ dàng quản lý và invalidation.

- **Cache thông tin User theo ID:** iam:user:id:\<user_id\>
- **Cache thông tin Organization theo ID:** iam:org:id:\<org_id\>
- **Cache thông tin Organization theo Slug:** iam:org:slug:\<slug\>
- **Cache thông tin Membership theo ID:** iam:membership:id:\<membership_id\>
- **Cache thông tin Membership theo User ID và Organization ID:** iam:membership:user:\<user_id\>:org:\<org_id\> (NULL organization_id có thể dùng key riêng: iam:membership:user:\<user_id\>:internal)
- **Cache thông tin Role theo ID:** iam:role:id:\<role_id\>
- **Cache thông tin PermissionDefinition theo Value:** iam:permission:value:\<permission_value\>
- **Cache tập hợp quyền hạn hiệu quả đã tính toán cho Role theo ID:** iam:role:\<role_id\>:effective_permissions (Lưu JSON array các permission value)
- **Cache thông tin Session theo Token:** iam:session:token:\<token\>
- **Cache danh sách Session của User theo ID:** iam:user:\<user_id\>:sessions (Lưu Set hoặc Sorted Set các Session ID)
- **Cache thông tin Entitlement của Tổ chức theo ID:** iam:org:\<org_id\>:entitlements (Lưu JSON object/array chi tiết entitlements, đồng bộ từ BUM)
- **Cache trạng thái Tổ chức theo ID:** iam:org:\<org_id\>:status (Lưu giá trị status, đồng bộ từ BUM)

**Chiến lược Value:**

Lưu trữ dữ liệu dưới dạng JSON string hoặc cấu trúc dữ liệu phù hợp của Redis (Hash cho object, Set/Sorted Set cho tập hợp).

**Chiến lược Cache Invalidation:**

Khi có bất kỳ thay đổi nào đối với dữ liệu trong IAM Command Service hoặc khi IAM Background Worker xử lý sự kiện từ BUM:

- **Từ IAM Command Service (phát Event):**
  - UserRegistered, EmailVerified, UserRoleInOrganizationChanged, InternalUserRoleChanged, PasswordResetSuccessful, UserLoggedIn, UserLoggedOut, SessionTerminated: Invalidate cache key liên quan đến User (iam:user:id:\<user_id\>, iam:user:\<user_id\>:sessions), Membership (iam:membership:id:\<membership_id\>, iam:membership:user:\<user_id\>:org:\<org_id\>), Session (iam:session:token:\<token\>).
  - OrganizationCreated, OrganizationSettingsUpdated: Invalidate cache key liên quan đến Organization (iam:org:id:\<org_id\>, iam:org:slug:\<slug\>).
  - RoleCreated, PermissionAddedToRole, PermissionRemovedFromRole: Invalidate cache key liên quan đến Role (iam:role:id:\<role_id\>) và tập hợp quyền hạn hiệu quả (iam:role:\<role_id\>:effective_permissions). Cần re-calculate và update cache effective_permissions.
  - PermissionDefinitionCreated: Invalidate cache key liên quan đến PermissionDefinition (iam:permission:value:\<permission_value\>). Có thể cần re-calculate effective_permissions cho các Role liên quan.
  - Các sự kiện khác (Invite, Accept, Revoke, Remove Member) cũng cần invalidation key cache Membership liên quan.
- **Từ IAM Background Worker (xử lý Event BUM):**
  - SubscriptionActivated, SubscriptionPlanChanged, SubscriptionSuspended: Invalidate cache key Entitlement và Status của Tổ chức (iam:org:\<org_id\>:entitlements, iam:org:\<org_id\>:status).
- TTL (Time To Live) cho các key cache cũng cần được cấu hình như một lớp bảo vệ dự phòng nếu cơ chế invalidation dựa trên event gặp sự cố. Giá trị TTL cụ thể cần được xác định dựa trên tần suất thay đổi dữ liệu thực tế và mức độ chấp nhận dữ liệu cũ cho từng loại dữ liệu (ví dụ: Session token cần TTL ngắn theo thời gian hết hạn của phiên).

## **7\. Giao tiếp và Tích hợp**

IAM là trung tâm cho các luồng xác thực và ủy quyền.

- **Nhận Commands/Queries:**
  - IAM Command Service và IAM Query Service nhận các yêu cầu thay đổi trạng thái (Commands) và yêu cầu truy vấn dữ liệu (Queries) thông qua cơ chế Request/Reply của hệ thống (sử dụng NATS). Các yêu cầu này có thể đến từ API Gateway (được gọi bởi Client/Admin UI) hoặc từ các service backend khác.
  - Ví dụ: Feature BC sẽ gọi IAM Query Service để kiểm tra quyền của người dùng cho một hành động cụ thể. Client/Admin UI sẽ gọi IAM Command Service để đăng ký, đăng nhập, quản lý người dùng, v.v.
- **Phát Domain Events:**
  - IAM Command Service sẽ phát các Domain Event (ví dụ: UserRegistered, OrganizationCreated, UserJoinedOrganization, SessionTerminated, v.v.) đến hệ thống Message Broker (RabbitMQ) để các BC khác quan tâm có thể tiêu thụ theo mô hình Fire-and-Forget.
  - Chi tiết về các Domain Event được phát ra bởi IAM có thể tham khảo trong tài liệu Thiết kế Miền IAM.
- **Lắng nghe Domain Events:**
  - IAM Background Worker sẽ lắng nghe các Domain Event từ BUM (SubscriptionActivated, SubscriptionPlanChanged, SubscriptionSuspension) để cập nhật trạng thái Tổ chức và Entitlement cached trong IAM.
- **Tương tác với BUM:**
  - IAM (Background Worker hoặc có thể là Query Service cho fallback) cần gọi BUM (qua Request/Reply) để lấy thông tin Entitlement và trạng thái Tổ chức nếu dữ liệu cache trong IAM chưa có hoặc quá cũ.
- **Tương tác với NDM:**
  - IAM Command Service sẽ yêu cầu NDM gửi thông báo (qua Request/Reply hoặc Command/Event tùy thiết kế của NDM) cho các luồng nghiệp vụ như xác minh email, khôi phục/đặt lại mật khẩu, mời tham gia tổ chức.
- **Tương tác với LZM & RDM:**
  - IAM Query Service hoặc IAM Command Service sẽ gọi LZM (qua Request/Reply) để bản địa hóa các chuỗi giao diện quản trị hoặc nội dung thông báo.
  - IAM cần gọi RDM (qua Request/Reply) để lấy danh sách quốc gia (khi tạo/cập nhật User/Organization) hoặc các quy tắc định dạng locale.
- **Tương tác với ALM:**
  - IAM Command Service sẽ phát Event hoặc gọi API của ALM để ghi lại các hành động quản lý danh tính và truy cập quan trọng.
- **Tương tác với DAM:**
  - IAM Command Service sẽ tham chiếu đến DAM bằng ID asset khi cập nhật logo cho Tổ chức.

## **8\. Định nghĩa API Endpoint và Mapping Use Case**

Phần này phác thảo các API Endpoint chính mà IAM cung cấp thông qua API Gateway (đối với các tương tác từ bên ngoài hệ thống) và mapping chúng với các Use Case đã định nghĩa trong tài liệu Thiết kế Miền IAM. Các Endpoint này sẽ được API Gateway định tuyến đến IAM Query Service hoặc IAM Command Service tương ứng (thường là IAM Command Service cho các hành động thay đổi trạng thái và IAM Query Service cho các hành động đọc/kiểm tra quyền).

| API Endpoint (Ví dụ)                                         | Phương thức HTTP | Mô tả Chức năng Cấp cao                              | Use Case Liên quan (iam.md)                   | Loại Yêu cầu Nội bộ (CQRS) | Service Xử lý       |
| :----------------------------------------------------------- | :--------------- | :--------------------------------------------------- | :-------------------------------------------- | :------------------------- | :------------------ |
| /api/v1/iam/auth/register                                    | POST             | Đăng ký người dùng mới.                              | Đăng ký Người dùng Mới (8.1)                  | Command                    | IAM Command Service |
| /api/v1/iam/auth/verify-email                                | POST             | Xác minh email người dùng.                           | Xác minh Email (8.1)                          | Command                    | IAM Command Service |
| /api/v1/iam/auth/login                                       | POST             | Đăng nhập (phạm vi nội bộ hoặc tổ chức).             | Đăng nhập (8.1, 8.3)                          | Command                    | IAM Command Service |
| /api/v1/iam/auth/logout                                      | POST             | Đăng xuất khỏi phiên hiện tại.                       | Đăng xuất (8.1)                               | Command                    | IAM Command Service |
| /api/v1/iam/auth/sessions                                    | GET              | Xem danh sách phiên làm việc.                        | Quản lý Phiên làm việc (8.1)                  | Query                      | IAM Query Service   |
| /api/v1/iam/auth/sessions/{sessionId}                        | DELETE           | Đăng xuất (chấm dứt) phiên làm việc cụ thể.          | Quản lý Phiên làm việc (8.1)                  | Command                    | IAM Command Service |
| /api/v1/iam/auth/forgot-password                             | POST             | Yêu cầu khôi phục mật khẩu.                          | Khôi phục tài khoản và đặt lại mật khẩu (8.1) | Command                    | IAM Command Service |
| /api/v1/iam/auth/reset-password                              | POST             | Đặt lại mật khẩu bằng token.                         | Khôi phục tài khoản và đặt lại mật khẩu (8.1) | Command                    | IAM Command Service |
| /api/v1/iam/users/me                                         | GET              | Xem hồ sơ người dùng hiện tại.                       | _(Chưa có UC cụ thể, bổ sung nếu cần)_        | Query                      | IAM Query Service   |
| /api/v1/iam/users/me                                         | PUT              | Cập nhật hồ sơ người dùng hiện tại.                  | _(Chưa có UC cụ thể, bổ sung nếu cần)_        | Command                    | IAM Command Service |
| /api/v1/iam/organizations                                    | POST             | Tạo tổ chức mới.                                     | Tạo Tổ chức Mới (8.2)                         | Command                    | IAM Command Service |
| /api/v1/iam/organizations/{orgId}                            | PUT              | Cập nhật cài đặt tổ chức.                            | Cập nhật Cài đặt Tổ chức (8.2)                | Command                    | IAM Command Service |
| /api/v1/iam/organizations/{orgId}/memberships                | GET              | Lấy danh sách thành viên tổ chức.                    | Quản lý Thành viên Tổ chức (8.2)              | Query                      | IAM Query Service   |
| /api/v1/iam/organizations/{orgId}/memberships/{membershipId} | PUT              | Thay đổi vai trò thành viên.                         | Quản lý Thành viên Tổ chức (8.2)              | Command                    | IAM Command Service |
| /api/v1/iam/organizations/{orgId}/memberships/{membershipId} | DELETE           | Xóa thành viên khỏi tổ chức (bao gồm quy tắc Owner). | Quản lý Thành viên Tổ chức (8.2)              | Command                    | IAM Command Service |
| /api/v1/iam/organizations/{orgId}/invitations                | POST             | Mời người dùng tham gia tổ chức.                     | Mời Người dùng Tham gia Tổ chức (8.2)         | Command                    | IAM Command Service |
| /api/v1/iam/invitations/{invitationId}/accept                | POST             | Chấp nhận lời mời.                                   | Chấp nhận Lời mời Tham gia Tổ chức (8.2)      | Command                    | IAM Command Service |
| /api/v1/iam/invitations/{invitationId}                       | DELETE           | Thu hồi lời mời.                                     | Thu hồi Lời mời (8.2)                         | Command                    | IAM Command Service |
| /api/v1/iam/authorization/check                              | POST             | Kiểm tra quyền truy cập (dành cho BC nội bộ).        | Kiểm tra Quyền truy cập (8.2, 8.3)            | Query                      | IAM Query Service   |
| /api/v1/iam/roles                                            | GET              | Lấy danh sách vai trò (theo phạm vi).                | _(Liên quan quản lý Role trong UC 8.2/8.3)_   | Query                      | IAM Query Service   |
| /api/v1/iam/permissions                                      | GET              | Lấy danh sách định nghĩa quyền hạn.                  | _(Liên quan quản lý Permission trong UC 8.3)_ | Query                      | IAM Query Service   |

_Lưu ý: Đây là các endpoint ví dụ. Tên và cấu trúc cụ thể có thể được tinh chỉnh trong quá trình thiết kế kỹ thuật chi tiết. API Gateway sẽ xử lý việc định tuyến dựa trên đường dẫn và phương thức HTTP._

## **9\. Chiến lược Xử lý Lỗi (Error Handling Strategy)**

Chiến lược xử lý lỗi trong IAM sẽ tuân thủ mô hình chung của Ecoma và phân biệt giữa các loại lỗi, kênh giao tiếp:

- **Lỗi Nghiệp vụ (Business Rule Exceptions):** Các lỗi phát sinh do vi phạm quy tắc nghiệp vụ (ví dụ: email đã tồn tại khi đăng ký, mật khẩu không đủ mạnh, cố gắng xóa Owner cuối cùng) sẽ được ném ra từ Domain Services và bắt ở lớp Application Service hoặc lớp xử lý Command.
  - **Đối với giao tiếp Request/Reply (qua NATS/API Gateway):** Lỗi nghiệp vụ sẽ được chuyển đổi thành phản hồi lỗi có cấu trúc (ví dụ: JSON object) bao gồm mã lỗi (error code) và thông báo lỗi chi tiết, được trả về cho bên gọi. Sử dụng HTTP status code 400 Bad Request cho các lỗi phía người dùng khi giao tiếp qua API Gateway. Phản hồi lỗi sẽ bao gồm một biến chỉ báo thành công/thất bại (ví dụ: success: false) cùng với thông tin lỗi chi tiết.
  - **Đối với giao tiếp qua Message Broker (Events):** Lỗi nghiệp vụ xảy ra trong quá trình xử lý event sẽ được ghi log chi tiết và có thể phát ra một Domain Event thông báo về sự thất bại nếu cần thiết (ví dụ: một lỗi trong quá trình xử lý event từ BUM).
- **Lỗi Kỹ thuật (Technical Errors):** Các lỗi phát sinh ở lớp Infrastructure (ví dụ: lỗi kết nối DB, lỗi kết nối Message Broker, lỗi cache Redis) sẽ được xử lý bằng cách sử dụng try-catch block.
  - Các lỗi này cần được ghi log chi tiết (sử dụng Structured Logging theo kiến trúc chung) với mức độ phù hợp (ví dụ: ERROR), bao gồm stack trace và các thông tin tương quan (traceId, spanId).
  - Đối với giao tiếp Request/Reply: Lỗi kỹ thuật sẽ được chuyển đổi thành phản hồi lỗi chung (ví dụ: HTTP status code 500 Internal Server Error) để tránh lộ thông tin nhạy cảm, nhưng vẫn ghi log chi tiết ở phía server.
  - Đối với giao tiếp qua Message Broker: Lỗi kỹ thuật sẽ được xử lý theo cơ chế retry của RabbitMQ. Nếu retry vẫn thất bại, message sẽ được chuyển vào Dead Letter Queue (DLQ) để phân tích sau. Lỗi cũng cần được ghi log và có thể kích hoạt cảnh báo.
- **Lỗi Validate Input:** Đối với các yêu cầu nhận được qua API Endpoint (từ API Gateway), lỗi validate input sẽ được xử lý ở lớp Application Service hoặc Controller (trong NestJS) trước khi tạo Command/Query. Phản hồi lỗi sẽ sử dụng HTTP status code 400 Bad Request với thông báo lỗi chi tiết về các trường không hợp lệ.
- **Thông báo Lỗi:** Các lỗi quan trọng (ví dụ: lỗi kết nối DB kéo dài, lỗi xử lý Command quan trọng, lỗi đồng bộ trạng thái Tổ chức từ BUM) cần kích hoạt cảnh báo thông qua hệ thống giám sát (Observability Stack).

## **10\. Khả năng Phục hồi (Resiliency)**

Để đảm bảo IAM chịu lỗi và phục hồi khi các phụ thuộc gặp sự cố:

- **Timeouts và Retries:** Cấu hình timeouts và retry policies cho các cuộc gọi đi đến các phụ thuộc (PostgreSQL, Redis, NATS, RabbitMQ, BUM API, NDM API, ALM API, RDM API). Sử dụng các thư viện hỗ trợ retry với exponential backoff và jitter.
- **Circuit Breaker:** Áp dụng mẫu Circuit Breaker cho các cuộc gọi đến các phụ thuộc có khả năng gặp sự cố tạm thời (ví dụ: gọi BUM API, NDM API) để ngăn chặn các cuộc gọi liên tục gây quá tải cho phụ thuộc đó và cho chính service IAM.
- **Bulkhead:** Nếu có các loại tác vụ khác nhau trong cùng một service (ví dụ: xử lý Login Commands và User Management Commands trong IAM Command Service), cân nhắc sử dụng Bulkhead để cô lập tài nguyên, ngăn chặn một loại tác vụ bị treo ảnh hưởng đến loại khác. Trong IAM Query Service, cần cô lập tài nguyên cho luồng kiểm tra quyền tốc độ cao so với các truy vấn thông tin người dùng/tổ chức.
- **Health Checks:** Triển khai các loại Health Check Probe trong Kubernetes cho mỗi service IAM:
  - **Startup Probe:** Kiểm tra xem ứng dụng đã khởi động hoàn toàn (ví dụ: kết nối đến DB, Message Broker, Cache đã sẵn sàng).
  - **Liveness Probe:** Kiểm tra xem ứng dụng có đang chạy và khỏe mạnh không. Kiểm tra vòng lặp xử lý message/request.
  - **Readiness Probe:** Kiểm tra xem ứng dụng đã sẵn sàng xử lý request chưa. Kiểm tra kết nối đến **PostgreSQL** (nguồn dữ liệu chính), **Redis** (lớp cache quan trọng), và khả năng thực hiện các thao tác đọc/ghi/cache cơ bản.
- **Idempotency:** Thiết kế các Command và Event Handlers (đặc biệt là các handler lắng nghe sự kiện từ BUM) có tính Idempotent nếu có thể, để việc xử lý lặp lại do retry hoặc lỗi tạm thời không gây ra kết quả không mong muốn.

## **11\. Chiến lược Kiểm thử (Testing Strategy)**

Chiến lược kiểm thử cho IAM sẽ tuân thủ mô hình chung của Ecoma:

- **Unit Tests:** Kiểm thử logic nghiệp vụ cốt lõi trong Domain Model, Domain Services và logic xử lý trong Application Services một cách độc lập (sử dụng mock cho Repository, Gateway, Broker).
- **Integration Tests:** Kiểm thử sự tương tác giữa các thành phần nội bộ của từng service (ví dụ: Application Service gọi Domain Service, Repository tương tác với cơ sở dữ liệu thực hoặc Testcontainers).
- **End-to-End Tests (E2E Tests):** Kiểm thử luồng nghiệp vụ hoàn chỉnh xuyên qua các service (ví dụ: đăng ký user mới qua API Gateway, kiểm tra quyền từ một Feature BC gọi đến IAM Query Service). Sử dụng môi trường test tích hợp hoặc giả lập các phụ thuộc.
- **Contract Tests:** Đảm bảo các API Endpoint của IAM (qua API Gateway/NATS Request/Reply) tuân thủ "hợp đồng" đã định nghĩa (sử dụng OpenAPI spec). Tương tự, kiểm tra schema của Domain Events được phát ra và schema của Events được tiêu thụ từ BUM.
- **Component Tests:** Kiểm thử từng service IAM (Query, Command, Worker) trong môi trường gần với production, với các phụ thuộc (DB, Redis, Message Broker, các BC khác) được giả lập hoặc sử dụng Testcontainers.
- **Performance/Load Tests:** Kiểm thử tải để xác minh IAM Query Service có thể đáp ứng yêu cầu hiệu năng cao cho luồng xác thực/ủy quyền và IAM Command Service có thể xử lý lượng Commands/lưu lượng đăng nhập/đăng ký dự kiến.

## **12\. Chiến lược Di chuyển Dữ liệu (Data Migration Strategy)**

Quản lý thay đổi schema database PostgreSQL của IAM cần được thực hiện cẩn thận:

- Sử dụng công cụ quản lý migration schema tự động (ví dụ: Flyway hoặc Liquibase).
- Thiết kế các migration có tính **Backward Compatibility** (chỉ thêm, không xóa/sửa đổi các cột/bảng quan trọng). Điều này đặc biệt quan trọng với các cột như email, password_hash, user_id, organization_id vì chúng là trung tâm của nhiều Aggregate Root và mối quan hệ.
- Lập kế hoạch **rollback** cho các migration.
- Đối với các thay đổi dữ liệu phức tạp (ví dụ: chuẩn hóa dữ liệu cũ), viết **Data Migration Script** riêng biệt.
- Đảm bảo có bản sao lưu (backup) dữ liệu trước khi thực hiện các migration quan trọng.

## **13\. Kế hoạch Dung lượng (Capacity Planning \- Initial)**

Dựa trên ước tính ban đầu về lượng người dùng, tổ chức, tần suất đăng nhập/đăng ký, số lượng request kiểm tra quyền, đưa ra ước tính ban đầu về tài nguyên cần thiết cho mỗi đơn vị triển khai của IAM. Các con số này là điểm khởi đầu và sẽ được điều chỉnh dựa trên dữ liệu thực tế sau khi triển khai và giám sát.

- **IAM Query Service:** Dự kiến sẽ nhận lượng request _rất lớn_ cho việc xác thực và ủy quyền.
  - Số lượng Pod tối thiểu: 5-10 (để đảm bảo tính sẵn sàng cao và phân tải)
  - Số lượng Pod tối đa: 20+ (có thể điều chỉnh dựa trên tải, đặc biệt là load từ Authorization check)
  - Giới hạn CPU mỗi Pod: 500m \- 1000m
  - Giới hạn Memory mỗi Pod: 512Mi \- 1Gi
  - Cấu hình HPA: Chủ yếu dựa trên CPU Utilization và Request Rate.
- **IAM Command Service:** Nhận lượng request cho các thao tác ghi (ít hơn luồng đọc).
  - Số lượng Pod tối thiểu: 3-5
  - Số lượng Pod tối đa: 10
  - Giới hạn CPU mỗi Pod: 300m \- 700m
  - Giới hạn Memory mỗi Pod: 512Mi \- 1Gi
  - Cấu hình HPA: Dựa trên CPU Utilization và Request Rate.
- **IAM Background Worker:** Lượng tải xử lý event và tác vụ định kỳ dự kiến không quá lớn.
  - Số lượng Pod tối thiểu: 2 (để đảm bảo tính sẵn sàng)
  - Số lượng Pod tối đa: 3-5
  - Giới hạn CPU mỗi Pod: 200m \- 500m
  - Giới hạn Memory mỗi Pod: 256Mi \- 512Mi
  - Cấu hình HPA: Có thể dựa trên CPU Utilization hoặc độ dài hàng đợi (nếu xử lý job queue).
- **PostgreSQL Database:** Cần được cấu hình mạnh mẽ để xử lý lượng ghi từ Command Service và lượng đọc từ Query Service (đặc biệt là khi cache miss).
  - Kích thước đĩa ban đầu: 20GB+ (dự kiến dữ liệu IAM sẽ tăng trưởng đáng kể theo số lượng user/org)
  - RAM: 8GB \- 16GB+ (tùy thuộc vào tải và kích thước dữ liệu active)
  - CPU: 2-4+ core
  - Cần cấu hình Connection Pooling hiệu quả.
- **Redis Cache:** Cần đủ bộ nhớ để lưu trữ Session Token, User/Org/Membership/Role/Permission info, Effective Permissions, và Entitlement cached.
  - Kích thước bộ nhớ cần thiết: Ước tính dựa trên số lượng user/org active, số lượng session đồng thời, kích thước dữ liệu cached (ví dụ: 5GB \- 10GB+).

Các con số này cần được xem xét kỹ lưỡng hơn dựa trên phân tích tải chi tiết và được theo dõi, điều chỉnh liên tục sau khi hệ thống đi vào hoạt động.

## **14\. Phụ thuộc (Dependencies)**

- **Phụ thuộc Nội bộ (Internal Dependencies):**
  - Các BC khác (Feature BCs, API Gateway) là Consumer của IAM Query Service (đặc biệt là Authorization check).
  - IAM Background Worker phụ thuộc vào BUM (lắng nghe Events).
  - IAM Command Service phụ thuộc vào NDM (gửi thông báo), ALM (ghi log).
  - IAM Query Service phụ thuộc vào RDM (lấy dữ liệu tham chiếu), LZM (bản địa hóa), và có thể BUM (lấy entitlement, fallback).
- **Phụ thuộc Bên ngoài (External Dependencies):**
  - Database (PostgreSQL, Redis).
  - Message Brokers (NATS, RabbitMQ).
  - Container Registry.
  - Kubernetes API.
  - External Services (Email Sending Gateway \- thông qua NDM).

## **15\. Kết luận**

Tài liệu thiết kế triển khai cho Bounded Context Identity & Access Management (IAM) đã được xây dựng dựa trên tài liệu thiết kế miền IAM và tuân thủ chặt chẽ kiến trúc Microservices, CQRS và Clean Architecture của hệ thống Ecoma. Việc phân tách IAM thành các đơn vị triển khai riêng biệt (Query Service, Command Service, Background Worker) là cần thiết để đáp ứng yêu cầu về hiệu năng và khả năng mở rộng cho các luồng xác thực/ủy quyền tốc độ cao và các luồng quản lý dữ liệu, tác vụ nền. Việc sử dụng PostgreSQL và Redis cho lưu trữ dữ liệu và cache được lựa chọn để đảm bảo tính toàn vẹn, hiệu năng và khả năng mở rộng cần thiết. Các khía cạnh quan trọng về giao tiếp, xử lý lỗi, khả năng phục hồi, kiểm thử và vận hành đã được đề cập, phác thảo các chiến lược và yêu cầu kỹ thuật.

Tài liệu này cung cấp nền tảng vững chắc cho đội ngũ kỹ thuật để tiến hành thiết kế kỹ thuật chi tiết hơn (ví dụ: thiết kế lớp Repository, Gateway, chi tiết implementation của Domain/Application Service, cấu trúc Command/Query/Event payload chi tiết) và bắt đầu quá trình triển khai thực tế Microservice IAM, đảm bảo tuân thủ các nguyên tắc và mục tiêu kiến trúc của hệ thống Ecoma.
