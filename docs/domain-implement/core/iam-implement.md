# **Tài liệu Thiết kế Triển khai: Bounded Context Identity & Access Management (IAM)**

## **1\. Giới thiệu**

Tài liệu này mô tả chi tiết thiết kế triển khai cho Bounded Context Identity & Access Management (IAM) trong hệ thống Ecoma. IAM là một Bounded Context cốt lõi, chịu trách nhiệm quản lý danh tính và quyền truy cập trên toàn hệ thống. Tài liệu này tập trung vào các khía cạnh kỹ thuật triển khai riêng cho IAM, bao gồm cấu trúc service, công nghệ sử dụng cụ thể trong IAM, lưu trữ dữ liệu, giao tiếp đặc thù của IAM, hạ tầng, và các yêu cầu phi chức năng liên quan đến triển khai.

Mục tiêu của tài liệu này là cung cấp hướng dẫn chi tiết cho đội ngũ kỹ thuật để xây dựng, triển khai và vận hành Microservice(s) hiện thực hóa Bounded Context IAM, đảm bảo tuân thủ các nguyên tắc kiến trúc tổng thể của Ecoma (Microservices, DDD, EDA, CQRS, Clean Architecture) và đạt được các mục tiêu hệ thống (Tính sẵn sàng cao, Khả năng mở rộng, Hiệu năng, Bảo mật).

## **2\. Bối cảnh Kiến trúc Tổng thể**

Hệ thống Ecoma được xây dựng trên nền tảng kiến trúc Microservices, phân rã theo Bounded Contexts của DDD. Giao tiếp giữa các service backend chủ yếu sử dụng Event-Driven Architecture (EDA) và Request/Reply. Bên trong mỗi service, mô hình CQRS và Clean Architecture được áp dụng bắt buộc.

IAM là một Core Bounded Context, đóng vai trò nền tảng trong việc quản lý danh tính (Identity) của người dùng và tổ chức (Tenant), cũng như kiểm soát quyền truy cập (Access Management) vào các tài nguyên và tính năng trên toàn bộ nền tảng Ecoma. IAM đảm bảo rằng chỉ những người dùng được xác thực và có quyền mới có thể truy cập các chức năng phù hợp.

## **3\. Mối quan hệ với Tài liệu Thiết kế Miền IAM**

Tài liệu này là phần tiếp theo của tài liệu **Thiết kế Miền IAM (iam.md)**. Trong khi tài liệu Thiết kế Miền tập trung vào việc định nghĩa các khái niệm nghiệp vụ cốt lõi, Aggregate Root, Entity, Value Object, Ngôn ngữ Chung, Use Cases, Domain Services, Application Services và Domain Events ở cấp độ logic và nghiệp vụ, tài liệu này đi sâu vào cách các định nghĩa đó được hiện thực hóa và triển khai về mặt kỹ thuật.

* **Domain Services và Application Services:** Vai trò và trách nhiệm của các loại service này đã được định nghĩa chi tiết trong tài liệu Thiết kế Miền IAM. Trong tài liệu triển khai này, chúng ta xem xét cách các service kỹ thuật (IAM Query Service, IAM Command Service, IAM Background Worker) sẽ chứa và tổ chức các Domain Services và Application Services tương ứng theo mô hình Clean Architecture và CQRS. Chi tiết về từng Domain Service hoặc Application Service cụ thể (tên, phương thức, logic) sẽ không được lặp lại ở đây mà được tham chiếu đến tài liệu Thiết kế Miền.  
* **Domain Events:** Các Domain Event mà IAM phát ra hoặc xử lý đã được xác định trong tài liệu Thiết kế Miền IAM, bao gồm mục đích và payload dự kiến. Tài liệu triển khai này mô tả cách các event đó được truyền tải vật lý trong hệ thống (sử dụng RabbitMQ) và cách các service lắng nghe/phát event. Chi tiết về từng loại Domain Event cụ thể sẽ không được lặp lại ở đây mà được tham chiếu đến tài liệu Thiết kế Miền.

## **4\. Đơn vị Triển khai (Deployment Units)**

Dựa trên mô hình CQRS bắt buộc và tính chất nghiệp vụ của IAM bao gồm cả luồng đọc (xác thực, ủy quyền, truy vấn thông tin) và luồng ghi/xử lý (đăng ký, quản lý người dùng/tổ chức/vai trò, xử lý lời mời, khôi phục mật khẩu, xác minh email), cùng với các tác vụ nền (lắng nghe events từ BUM, kiểm tra định kỳ), IAM sẽ được triển khai thành nhiều đơn vị Microservice/Worker để tối ưu hóa khả năng mở rộng và quản lý tài nguyên.

**Đề xuất:** Triển khai IAM thành **ba** đơn vị triển khai riêng biệt để tối ưu hóa khả năng mở rộng và quản lý tài nguyên, phù hợp với mô hình CQRS:

1. **IAM Query Service:**  
   * **Trách nhiệm:** Xử lý tất cả các yêu cầu truy vấn (Queries) thông tin về người dùng, tổ chức, vai trò, quyền hạn, danh sách thành viên, phiên làm việc từ các Bounded Context khác và giao diện người dùng. Đặc biệt quan trọng là xử lý các yêu cầu kiểm tra quyền (Authorization Flow).  
   * **Mô hình:** Read Model của CQRS. Chứa các Application Services và Domain Services liên quan đến truy vấn dữ liệu và ủy quyền.  
   * **Yêu cầu:** Hiệu năng cao, độ trễ thấp, tính sẵn sàng cao. Cần hỗ trợ truy vấn nhanh thông tin User, Organization, Membership, Role, PermissionDefinition và kiểm tra quyền dựa trên Vai trò, Quyền hạn, Entitlement (**chủ yếu dựa vào dữ liệu cached được đồng bộ bởi Background Worker**).  
   * **Giao tiếp:** Nhận Query thông qua cơ chế Request/Reply của hệ thống (sử dụng NATS) từ API Gateway hoặc các service backend khác.  
2. **IAM Command Service:**  
   * **Trách nhiệm:** Xử lý các yêu cầu thay đổi trạng thái (Commands) liên quan đến quản lý User, Organization, Role, PermissionDefinition, Invitation, Membership (tạo, cập nhật, xóa, thay đổi trạng thái, v.v.). Xử lý các luồng nghiệp vụ như đăng ký, đăng nhập, đăng xuất, khôi phục/đặt lại mật khẩu, xác minh email, mời/chấp nhận/thu hồi lời mời, quản lý thành viên, cập nhật cài đặt tổ chức.  
   * **Mô hình:** Write Model của CQRS. Chứa các Application Services và Domain Services liên quan đến quản lý dữ liệu và các luồng nghiệp vụ chính. Phát ra Domain Events.  
   * **Yêu cầu:** Đảm bảo tính toàn vẹn dữ liệu khi ghi. Cần xử lý lỗi nghiệp vụ (ví dụ: trùng email, mật khẩu yếu, quy tắc xóa Owner). Có thể chịu độ trễ cao hơn so với Query Service nhưng vẫn cần đáp ứng yêu cầu về trải nghiệm người dùng (ví dụ: đăng nhập, đăng ký).  
   * **Giao tiếp:** Nhận Command thông qua cơ chế Request/Reply của hệ thống (sử dụng NATS) từ API Gateway/Admin UI hoặc các service backend khác. Phát Domain Events thông qua cơ chế Eventing của hệ thống (sử dụng RabbitMQ).  
3. **IAM Background Worker:**  
   * **Trách nhiệm:** Xử lý các tác vụ nền hoặc ít ưu tiên hơn, không yêu cầu phản hồi tức thời. Ví dụ: Lắng nghe và xử lý các Domain Events từ BUM (SubscriptionActivated, SubscriptionPlanChanged, SubscriptionSuspension) để cập nhật trạng thái Tổ chức và Entitlement cached. **Lắng nghe các sự kiện thay đổi Role/PermissionDefinition từ IAM Command Service để re-calculate và cập nhật cache effective permissions.** Chạy các tác vụ định kỳ (ví dụ: kiểm tra token hết hạn, kiểm tra định kỳ trạng thái Tổ chức từ BUM).  
   * **Mô hình:** Xử lý tác vụ nền bất đồng bộ. Chứa các Event Consumers và Scheduled Tasks Application Service.  
   * **Yêu cầu:** Độ tin cậy cao cho việc xử lý event và chạy tác vụ định kỳ. Có thể chịu độ trễ xử lý nhất định.  
   * **Giao tiếp:** Lắng nghe Domain Events từ Message Broker (RabbitMQ). Có thể gọi IAM Command Service (qua Command hoặc Request/Reply) để thực hiện các cập nhật cần thiết hoặc IAM Query Service để lấy thông tin (tuy nhiên, nên giảm thiểu phụ thuộc đồng bộ).

Cấu trúc thư mục trong Nx Monorepo sẽ tuân thủ mô hình đã định nghĩa, với các apps/services và apps/workers riêng biệt cho IAM Query, IAM Command và IAM Background Worker.

## **5\. Nền tảng Công nghệ Cụ thể cho IAM**

IAM sẽ sử dụng nền tảng công nghệ chung của hệ thống Ecoma, với lựa chọn cụ thể cho lưu trữ dữ liệu và caching:

* **Cơ sở dữ liệu Chính:** PostgreSQL (Sử dụng TypeORM) \- Phù hợp cho dữ liệu có cấu trúc quan hệ chặt chẽ và yêu cầu tính toàn vẹn dữ liệu cao như User, Organization, Membership, Role, PermissionDefinition, Invitation, Session. Cần xem xét cách lưu trữ cấu trúc phân cấp quyền hạn.  
* **Cache/Tạm thời:** Redis \- Sử dụng cho caching dữ liệu thường xuyên được truy vấn trong IAM Query Service để giảm tải cho DB và cải thiện hiệu năng đọc, đặc biệt là:  
  * Thông tin Session/Token để xác thực nhanh.  
  * Thông tin về User, Organization, Membership liên quan đến phiên làm việc.  
  * Tập hợp các quyền hạn hiệu quả đã được tính toán trước cho mỗi Vai trò (**được cập nhật bởi Background Worker**).  
  * Thông tin Entitlement cached từ BUM (**được đồng bộ bởi Background Worker**).

## **6\. Lưu trữ Dữ liệu (Data Storage)**

IAM sẽ sở hữu cơ sở dữ liệu riêng (PostgreSQL), tách biệt với các BC khác. Redis được sử dụng làm lớp cache hiệu năng cao.

### **6.1. Schema PostgreSQL (Write Model & Primary Read Model)**

Cần thiết kế schema cho PostgreSQL để lưu trữ các Aggregate Root và Entity chính của IAM. Schema này sẽ là nguồn sự thật cho dữ liệu IAM.

**Bảng users:**

* id UUID PRIMARY KEY  
* email VARCHAR(255) NOT NULL UNIQUE  
* password\_hash VARCHAR(255) NOT NULL  
* status VARCHAR(50) NOT NULL DEFAULT 'PendingConfirmation' \-- UserStatus Value Object  
* first\_name VARCHAR(255) NOT NULL  
* last\_name VARCHAR(255) NOT NULL  
* locale VARCHAR(10) NOT NULL \-- UserProfile Value Object  
* password\_reset\_token VARCHAR(255) UNIQUE \-- Optional  
* password\_reset\_token\_expires\_at TIMESTAMP WITH TIME ZONE \-- Optional  
* email\_verification\_token VARCHAR(255) UNIQUE \-- Optional  
* email\_verification\_token\_expires\_at TIMESTAMP WITH TIME ZONE \-- Optional  
* created\_at TIMESTAMP WITH TIME ZONE NOT NULL  
* updated\_at TIMESTAMP WITH TIME ZONE NOT NULL

**Bảng organizations:**

* id UUID PRIMARY KEY  
* name VARCHAR(255) NOT NULL UNIQUE  
* slug VARCHAR(255) NOT NULL UNIQUE \-- OrganizationSlug Value Object  
* status VARCHAR(50) NOT NULL DEFAULT 'Active' \-- OrganizationStatus Value Object  
* country VARCHAR(10) NOT NULL \-- Foreign Key hoặc tham chiếu đến RDM  
* logo\_asset\_id UUID \-- Optional, tham chiếu đến DAM  
* created\_at TIMESTAMP WITH TIME ZONE NOT NULL  
* updated\_at TIMESTAMP WITH TIME ZONE NOT NULL

**Bảng roles:**

* id UUID PRIMARY KEY  
* name VARCHAR(255) NOT NULL  
* description TEXT  
* scope VARCHAR(50) NOT NULL \-- RoleScope Value Object ('Internal', 'Organization')  
* organization\_id UUID \-- Optional, FOREIGN KEY organizations(id) ON DELETE CASCADE. NULL cho Internal Role.  
* is\_system\_role BOOLEAN NOT NULL DEFAULT FALSE  
* created\_at TIMESTAMP WITH TIME ZONE NOT NULL  
* updated\_at TIMESTAMP WITH TIME ZONE NOT NULL  
* UNIQUE (name, organization\_id) \-- Đảm bảo tên vai trò duy nhất trong phạm vi (nội bộ hoặc tổ chức)

**Bảng permission\_definitions:**

* id UUID PRIMARY KEY  
* value VARCHAR(255) NOT NULL UNIQUE \-- Chuỗi định danh quyền hạn  
* description TEXT  
* scope VARCHAR(50) NOT NULL \-- PermissionScope Value Object ('Internal', 'Organization')  
* parent\_permission\_id UUID \-- Optional, FOREIGN KEY permission\_definitions(id).  
* created\_at TIMESTAMP WITH TIME ZONE NOT NULL

**Bảng role\_permissions:** (Bảng trung gian cho quan hệ Many-to-Many giữa Role và PermissionDefinition)

* role\_id UUID NOT NULL, FOREIGN KEY roles(id) ON DELETE CASCADE  
* permission\_definition\_id UUID NOT NULL, FOREIGN KEY permission\_definitions(id) ON DELETE CASCADE  
* PRIMARY KEY (role\_id, permission\_definition\_id)

**Bảng memberships:** (Mối quan hệ User \- Scope \- Role)

* id UUID PRIMARY KEY  
* user\_id UUID NOT NULL, FOREIGN KEY users(id) ON DELETE CASCADE  
* organization\_id UUID \-- Optional, FOREIGN KEY organizations(id) ON DELETE CASCADE. NULL cho Internal Membership.  
* role\_id UUID NOT NULL, FOREIGN KEY roles(id) ON DELETE RESTRICT \-- RESTRICT để không xóa Role khi còn Membership sử dụng. Vai trò này phải có Scope tương ứng với Membership Scope.  
* joined\_at TIMESTAMP WITH TIME ZONE NOT NULL  
* UNIQUE (user\_id, organization\_id) \-- Một User chỉ có một Membership trong một phạm vi (nội bộ hoặc tổ chức cụ thể)

**Bảng invitations:**

* id UUID PRIMARY KEY  
* organization\_id UUID NOT NULL, FOREIGN KEY organizations(id) ON DELETE CASCADE  
* invitee\_email VARCHAR(255) NOT NULL  
* inviter\_user\_id UUID NOT NULL, FOREIGN KEY users(id)  
* role\_id UUID NOT NULL, FOREIGN KEY roles(id) \-- Phải là Organization Role thuộc organization\_id  
* status VARCHAR(50) NOT NULL DEFAULT 'Pending' \-- InvitationStatus Value Object  
* token VARCHAR(255) NOT NULL UNIQUE  
* expires\_at TIMESTAMP WITH TIME ZONE NOT NULL  
* created\_at TIMESTAMP WITH TIME ZONE NOT NULL

**Bảng sessions:**

* id UUID PRIMARY KEY  
* user\_id UUID NOT NULL, FOREIGN KEY users(id) ON DELETE CASCADE  
* organization\_id UUID \-- Optional, FOREIGN KEY organizations(id). ID tổ chức đang làm việc, NULL nếu phiên nội bộ.  
* token VARCHAR(255) NOT NULL UNIQUE \-- Session Token stateful, lưu trữ để hỗ trợ vô hiệu hóa tức thời và quản lý tập trung
* expires\_at TIMESTAMP WITH TIME ZONE NOT NULL  
* created\_at TIMESTAMP WITH TIME ZONE NOT NULL
* last\_active\_at TIMESTAMP WITH TIME ZONE NOT NULL \-- Thời điểm hoạt động cuối cùng, hỗ trợ tính năng phát hiện phiên không hoạt động

**Chỉ mục (Indexes):**

* CREATE UNIQUE INDEX idx\_users\_email ON users (email);  
* CREATE UNIQUE INDEX idx\_organizations\_name ON organizations (name);  
* CREATE UNIQUE INDEX idx\_organizations\_slug ON organizations (slug);  
* CREATE UNIQUE INDEX idx\_roles\_name\_organization ON roles (name, organization\_id);  
* CREATE INDEX idx\_permission\_definitions\_parent ON permission\_definitions (parent\_permission\_id);  
* CREATE UNIQUE INDEX idx\_memberships\_user\_org ON memberships (user\_id, organization\_id);  
* CREATE INDEX idx\_invitations\_email ON invitations (invitee\_email);  
* CREATE INDEX idx\_invitations\_org\_status ON invitations (organization\_id, status);  
* CREATE UNIQUE INDEX idx\_sessions\_token ON sessions (token);  
* CREATE INDEX idx\_sessions\_user ON sessions (user\_id);
* CREATE INDEX idx\_sessions\_expires\_at ON sessions (expires\_at); \-- Hỗ trợ dọn dẹp phiên hết hạn hiệu quả

### **6.2. Cấu trúc Cache Redis (Read Model Cache)**

Redis sẽ được sử dụng làm lớp cache cho IAM Query Service để lưu trữ các dữ liệu thường xuyên được truy vấn và yêu cầu hiệu năng cao. Chiến lược cache là "Cache-Aside" kết hợp với invalidation dựa trên Domain Events từ IAM Command Service và các Worker lắng nghe sự kiện từ BUM.

**Chiến lược Key:**

Sử dụng cấu trúc key rõ ràng để dễ dàng quản lý và invalidation.

* **Cache thông tin User theo ID:** iam:user:id:\<user\_id\>  
* **Cache thông tin Organization theo ID:** iam:org:id:\<org\_id\>  
* **Cache thông tin Organization theo Slug:** iam:org:slug:\<org\_slug\>  
* **Cache thông tin Membership theo ID:** iam:membership:id:\<membership\_id\>  
* **Cache thông tin Membership theo User ID và Organization ID:** iam:membership:user:\<user\_id\>:org:\<org\_id\> (NULL organization\_id có thể dùng key riêng: iam:membership:user:\<user\_id\>:internal)  
* **Cache thông tin Role theo ID:** iam:role:id:\<role\_id\>  
* **Cache thông tin PermissionDefinition theo Value:** iam:permission:value:\<permission\_value\>  
* **Cache tập hợp quyền hạn hiệu quả đã tính toán cho Role theo ID:** iam:role:\<role\_id\>:effective\_permissions (Lưu JSON array các permission value) \- **Được cập nhật bởi IAM Background Worker khi quyền hạn thay đổi, đảm bảo quyền luôn cập nhật mới nhất.**  
* **Cache thông tin Session theo Token:** iam:session:token:\<token\> \-- **Ưu tiên cao cho hiệu suất xác thực, TTL khớp với thời gian hết hạn session**  
* **Cache danh sách Session của User theo ID:** iam:user:\<user\_id\>:sessions (Lưu Set hoặc Sorted Set các Session ID) \-- **Hỗ trợ liệt kê và quản lý phiên làm việc của người dùng**  
* **Cache thông tin Entitlement của Tổ chức theo ID:** iam:org:\<org\_id\>:entitlements (Lưu JSON object/array chi tiết entitlements, đồng bộ từ BUM) \- **Được đồng bộ bởi IAM Background Worker.**  
* **Cache trạng thái Tổ chức theo ID:** iam:org:\<org\_id\>:status (Lưu giá trị status, đồng bộ từ BUM) \- **Được đồng bộ bởi IAM Background Worker.**

**Chiến lược Cache Invalidation Session:**

Để hỗ trợ khả năng vô hiệu hóa phiên từ xa tức thời và áp dụng các thay đổi quyền hạn ngay lập tức, các cơ chế sau được triển khai:

* **Vô hiệu hóa tức thời khi đăng xuất/hết hạn/revoke**:  
  * Xóa key cache Session token tương ứng (iam:session:token:\<token\>)  
  * Cập nhật lại danh sách Session của User (iam:user:\<user\_id\>:sessions)  
  * Xóa bản ghi Session trong database nếu cần  
* **Cập nhật quyền hạn tức thời**:  
  * Khi vai trò hoặc quyền hạn thay đổi, IAM Worker sẽ tự động tái tính toán và cập nhật quyền hạn hiệu quả trong cache  
  * Kiểm tra quyền dựa vào thông tin tại thời điểm truy vấn, không lưu quyền trong token (như JWT)  
* **Áp dụng trạng thái tổ chức mới ngay lập tức**:  
  * Trạng thái tổ chức được cache và truy vấn tại thời điểm sử dụng, không được mã hóa vào token

**Chiến lược Value:**

Lưu trữ dữ liệu dưới dạng JSON string hoặc cấu trúc dữ liệu phù hợp của Redis (Hash cho object, Set/Sorted Set cho tập hợp).

**Chiến lược Cache Invalidation:**

Khi có bất kỳ thay đổi nào đối với dữ liệu trong IAM Command Service hoặc khi IAM Background Worker xử lý sự kiện từ BUM:

* **Từ IAM Command Service (phát Event):**  
  * UserRegistered, EmailVerified, UserRoleInOrganizationChanged, InternalUserRoleChanged, PasswordResetSuccessful, UserLoggedIn, UserLoggedOut, SessionTerminated: Invalidate cache key liên quan đến User (iam:user:id:\<user\_id\>, iam:user:\<user\_id\>:sessions), Membership (iam:membership:id:\<membership\_id\>, iam:membership:user:\<user\_id\>:org:\<org\_id\>), Session (iam:session:token:).  
  * OrganizationCreated, OrganizationSettingsUpdated: Invalidate cache key liên quan đến Organization (iam:org:id:\<org\_id\>, iam:org:slug:).  
  * RoleCreated, PermissionAddedToRole, PermissionRemovedFromRole, PermissionDefinitionCreated, PermissionDefinitionUpdated, PermissionDefinitionDeleted: Invalidate cache key liên quan đến Role (iam:role:id:\<role\_id\>) và PermissionDefinition (iam:permission:value:\<permission\_value\>). **IAM Background Worker sẽ lắng nghe các sự kiện này để kích hoạt re-calculation và update cache effective\_permissions cho các Role bị ảnh hưởng.**  
  * Các sự kiện khác (Invite, Accept, Revoke, Remove Member) cũng cần invalidation key cache Membership liên quan.  
* **Từ IAM Background Worker (xử lý Event BUM):**  
  * SubscriptionActivated, SubscriptionPlanChanged, SubscriptionSuspended, TenantDataDeletionRequested: Invalidate cache key Entitlement và Status của Tổ chức (iam:org:\<org\_id\>:entitlements, iam:org:\<org\_id\>:status) và kích hoạt đồng bộ lại dữ liệu entitlement/status từ BUM.  
* TTL (Time To Live) cho các key cache cũng cần được cấu hình như một lớp bảo vệ dự phòng nếu cơ chế invalidation dựa trên event gặp sự cố. Giá trị TTL cụ thể cần được xác định dựa trên tần suất thay đổi dữ liệu thực tế và mức độ chấp nhận dữ liệu cũ cho từng loại dữ liệu (ví dụ: Session token cần TTL ngắn theo thời gian hết hạn của phiên).

**Chiến lược Cache Miss cho Entitlement và Effective Permissions:**

* **IAM Query Service KHÔNG gọi BUM hoặc IAM Command Service khi cache miss cho Entitlement hoặc Effective Permissions.**  
* Khi IAM Query Service nhận yêu cầu kiểm tra quyền và dữ liệu Entitlement hoặc Effective Permissions không có trong cache hoặc cache đã hết hạn, Query Service sẽ:  
  * Trả về kết quả "Denied" với lý do rõ ràng (ví dụ: "Entitlement data not available" hoặc "Permission data not available").  
  * Ghi log cảnh báo (Warning) về cache miss để giám sát.  
  * Việc cập nhật cache là trách nhiệm bất đồng bộ của IAM Background Worker.

## **7\. Giao tiếp và Tích hợp**

IAM là trung tâm cho các luồng xác thực và ủy quyền.

* **Nhận Commands/Queries:**  
  * IAM Command Service và IAM Query Service nhận các yêu cầu thay đổi trạng thái (Commands) và yêu cầu truy vấn dữ liệu (Queries) thông qua cơ chế Request/Reply của hệ thống (sử dụng NATS). Các yêu cầu này có thể đến từ API Gateway (được gọi bởi Client/Admin UI) hoặc từ các service backend khác.  
  * Ví dụ: Feature BC sẽ gọi IAM Query Service để kiểm tra quyền của người dùng cho một hành động cụ thể. Client/Admin UI sẽ gọi IAM Command Service để đăng ký, đăng nhập, quản lý người dùng, v.v.  
* **Phát Domain Events:**  
  * IAM Command Service sẽ phát các Domain Event (ví dụ: UserRegistered, OrganizationCreated, UserJoinedOrganization, SessionTerminated, RoleCreated, PermissionDefinitionCreated, PermissionAddedToRole, v.v.) đến hệ thống Message Broker (RabbitMQ) để các BC khác quan tâm có thể tiêu thụ theo mô hình Fire-and-Forget.  
  * Chi tiết về các Domain Event được phát ra bởi IAM có thể tham khảo trong tài liệu Thiết kế Miền IAM.  
* **Lắng nghe Domain Events:**  
  * IAM Background Worker sẽ lắng nghe các Domain Event từ BUM (SubscriptionActivated, SubscriptionPlanChanged, SubscriptionSuspension, TenantDataDeletionRequested) để cập nhật trạng thái Tổ chức và Entitlement cached trong IAM.  
  * **IAM Background Worker cũng lắng nghe các Domain Event từ IAM Command Service** (ví dụ: RoleCreated, PermissionDefinitionCreated, PermissionAddedToRole, PermissionRemovedFromRole, PermissionDefinitionUpdated, PermissionDefinitionDeleted) để kích hoạt quy trình re-calculate và cập nhật cache effective permissions.  
* **Tương tác với BUM:**  
  * IAM Background Worker cần gọi BUM (qua Request/Reply) để lấy thông tin chi tiết Entitlement và trạng thái Tổ chức khi xử lý các sự kiện từ BUM hoặc trong các tác vụ đồng bộ định kỳ.  
* **Tương tác với NDM:**  
  * IAM Command Service sẽ yêu cầu NDM gửi thông báo (qua Request/Reply hoặc Command/Event tùy thiết kế của NDM) cho các luồng nghiệp vụ như xác minh email, khôi phục/đặt lại mật khẩu, mời tham gia tổ chức.  
* **Tương tác với LZM & RDM:**  
  * IAM Query Service hoặc IAM Command Service sẽ gọi LZM (qua Request/Reply) để bản địa hóa các chuỗi giao diện quản trị hoặc nội dung thông báo.  
  * IAM cần gọi RDM (qua Request/Reply) để lấy danh sách quốc gia (khi tạo/cập nhật User/Organization) hoặc các quy tắc định dạng locale.  
* **Tương tác với ALM:**  
  * IAM Command Service sẽ phát Event hoặc gọi API của ALM để ghi lại các hành động quản lý danh tính và truy cập quan trọng.  
* **Tương tác với DAM:**  
  * IAM Command Service sẽ tham chiếu đến DAM bằng ID asset khi cập nhật logo cho Tổ chức.

## **8\. Định nghĩa API Endpoint và Mapping Use Case**

Phần này phác thảo các API Endpoint chính mà IAM cung cấp thông qua API Gateway (đối với các tương tác từ bên ngoài hệ thống) và mapping chúng với các Use Case đã định nghĩa trong tài liệu Thiết kế Miền IAM. Các Endpoint này sẽ được API Gateway định tuyến đến IAM Query Service hoặc IAM Command Service tương ứng (thường là IAM Command Service cho các hành động thay đổi trạng thái và IAM Query Service cho các hành động đọc/kiểm tra quyền).

| API Endpoint (Ví dụ) | Phương thức HTTP | Mô tả Chức năng Cấp cao | Use Case Liên quan (iam.md) | Loại Yêu cầu Nội bộ (CQRS) | Service Xử lý |
| :---- | :---- | :---- | :---- | :---- | :---- |
| /api/v1/iam/auth/register | POST | Đăng ký người dùng mới. | Đăng ký Người dùng Mới (8.1) | Command | IAM Command Service |
| /api/v1/iam/auth/verify-email | POST | Xác minh email người dùng. | Xác minh Email (8.1) | Command | IAM Command Service |
| /api/v1/iam/auth/login | POST | Đăng nhập (phạm vi nội bộ hoặc tổ chức). | Đăng nhập (8.1, 8.3) | Command | IAM Command Service |
| /api/v1/iam/auth/logout | POST | Đăng xuất khỏi phiên hiện tại. | Đăng xuất (8.1) | Command | IAM Command Service |
| /api/v1/iam/auth/sessions | GET | Xem danh sách phiên làm việc. | Quản lý Phiên làm việc (8.1) | Query | IAM Query Service |
| /api/v1/iam/auth/sessions/{sessionId} | DELETE | Đăng xuất (chấm dứt) phiên làm việc cụ thể. | Quản lý Phiên làm việc (8.1) | Command | IAM Command Service |
| /api/v1/iam/auth/forgot-password | POST | Yêu cầu khôi phục mật khẩu. | Khôi phục tài khoản và đặt lại mật khẩu (8.1) | Command | IAM Command Service |
| /api/v1/iam/auth/reset-password | POST | Đặt lại mật khẩu bằng token. | Khôi phục tài khoản và đặt lại mật khẩu (8.1) | Command | IAM Command Service |
| /api/v1/iam/users/me | GET | Xem hồ sơ người dùng hiện tại. | Quản lý Hồ sơ Người dùng (8.1) | Query | IAM Query Service |
| /api/v1/iam/users/me | PUT | Cập nhật hồ sơ người dùng hiện tại. | Quản lý Hồ sơ Người dùng (8.1) | Command | IAM Command Service |
| /api/v1/iam/organizations | POST | Tạo tổ chức mới. | Tạo Tổ chức Mới (8.2) | Command | IAM Command Service |
| /api/v1/iam/organizations/{orgId} | PUT | Cập nhật cài đặt tổ chức. | Cập nhật Cài đặt Tổ chức (8.2) | Command | IAM Command Service |
| /api/v1/iam/organizations/{orgId}/memberships | GET | Lấy danh sách thành viên tổ chức. | Quản lý Thành viên Tổ chức (8.2) | Query | IAM Query Service |
| /api/v1/iam/organizations/{orgId}/memberships/{membershipId} | PUT | Thay đổi vai trò thành viên. | Quản lý Thành viên Tổ chức (8.2) | Command | IAM Command Service |
| /api/v1/iam/organizations/{orgId}/memberships/{membershipId} | DELETE | Xóa thành viên khỏi tổ chức (bao gồm quy tắc Owner). | Quản lý Thành viên Tổ chức (8.2) | Command | IAM Command Service |
| /api/v1/iam/organizations/{orgId}/invitations | POST | Mời người dùng tham gia tổ chức. | Mời Người dùng Tham gia Tổ chức (8.2) | Command | IAM Command Service |
| /api/v1/iam/invitations/{invitationId}/accept | POST | Chấp nhận lời mời. | Chấp nhận Lời mời Tham gia Tổ chức (8.2) | Command | IAM Command Service |
| /api/v1/iam/invitations/{invitationId} | DELETE | Thu hồi lời mời. | Thu hồi Lời mời (8.2) | Command | IAM Command Service |
| /api/v1/iam/authorization/check | POST | Kiểm tra quyền truy cập (dành cho BC nội bộ). | Kiểm tra Quyền truy cập (8.2, 8.3) | Query | IAM Query Service |
| /api/v1/iam/roles | GET | Lấy danh sách vai trò (theo phạm vi). | Quản lý Vai trò (8.2, 8.3) | Query | IAM Query Service |
| /api/v1/iam/roles | POST | Tạo vai trò mới. | Quản lý Vai trò (8.2, 8.3) | Command | IAM Command Service |
| /api/v1/iam/roles/{roleId} | PUT | Cập nhật vai trò. | Quản lý Vai trò (8.2, 8.3) | Command | IAM Command Service |
| /api/v1/iam/roles/{roleId} | DELETE | Xóa vai trò. | Quản lý Vai trò (8.2, 8.3) | Command | IAM Command Service |
| /api/v1/iam/roles/{roleId}/permissions | POST | Thêm quyền hạn vào vai trò. | Quản lý Vai trò (8.2, 8.3) | Command | IAM Command Service |
| /api/v1/iam/roles/{roleId}/permissions | DELETE | Xóa quyền hạn khỏi vai trò. | Quản lý Vai trò (8.2, 8.3) | Command | IAM Command Service |
| /api/v1/iam/permissions | GET | Lấy danh sách định nghĩa quyền hạn. | Quản lý Quyền hạn (8.3) | Query | IAM Query Service |
| /api/v1/iam/permissions | POST | Tạo định nghĩa quyền hạn mới. | Quản lý Quyền hạn (8.3) | Command | IAM Command Service |
| /api/v1/iam/permissions/{permissionId} | PUT | Cập nhật định nghĩa quyền hạn. | Quản lý Quyền hạn (8.3) | Command | IAM Command Service |
| /api/v1/iam/permissions/{permissionId} | DELETE | Xóa định nghĩa quyền hạn. | Quản lý Quyền hạn (8.3) | Command | IAM Command Service |

*Lưu ý: Đây là các endpoint ví dụ. Tên và cấu trúc cụ thể có thể được tinh chỉnh trong quá trình thiết kế kỹ thuật chi tiết. API Gateway sẽ xử lý việc định tuyến dựa trên đường dẫn và phương thức HTTP.*

**Chi tiết API Kiểm tra Quyền (Authorization Check API):**

Endpoint: /api/v1/iam/authorization/check  
Phương thức: POST  
Service Xử lý: IAM Query Service  
Mô tả: API này được các Bounded Context nội bộ gọi để kiểm tra xem một người dùng (hoặc hệ thống) có quyền thực hiện một hành động cụ thể trên một tài nguyên cụ thể trong một phạm vi (tổ chức hoặc nội bộ) hay không.  
**Request Body (Ví dụ):**

{  
  "userId": "uuid-of-user",  
  "tenantId": "uuid-of-tenant", // Có thể null cho phạm vi nội bộ  
  "actionType": "Product.Create", // Loại hành động (ví dụ: Entity.Action)  
  "resourceType": "Product",      // Loại tài nguyên  
  "resourceId": "uuid-of-product",// ID tài nguyên (có thể null nếu hành động không trên thực thể cụ thể, ví dụ: xem danh sách sản phẩm)  
  "contextData": {                // Dữ liệu ngữ cảnh bổ sung  
    "ipAddress": "192.168.1.1",  
    "userAgent": "...",  
    "featureFlag": "new-product-feature"  
  }  
}

**Response Body (Ví dụ):**

{  
  "isAuthorized": true, // true nếu được phép, false nếu không  
  "reason": "Allowed by role 'Admin'", // Lý do (tùy chọn, hữu ích cho debug/audit)  
  "missingPermissions": \[\], // Danh sách quyền hạn còn thiếu nếu isAuthorized là false  
  "applicableEntitlements": { // Thông tin entitlement áp dụng (tùy chọn)  
      "maxProducts": 1000,  
      "canUseFeatureX": true  
  }  
}

IAM Query Service sẽ sử dụng thông tin User, Tenant, Membership, Role, PermissionDefinition và Entitlement (từ cache) để tính toán kết quả ủy quyền.

## **9\. Chiến lược Xử lý Lỗi (Error Handling Strategy)**

Chiến lược xử lý lỗi trong IAM sẽ tuân thủ mô hình chung của Ecoma và phân biệt giữa các loại lỗi, kênh giao tiếp:

* **Lỗi Nghiệp vụ (Business Rule Exceptions):** Các lỗi phát sinh do vi phạm quy tắc nghiệp vụ (ví dụ: email đã tồn tại khi đăng ký, mật khẩu không đủ mạnh, cố gắng xóa Owner cuối cùng) sẽ được ném ra từ Domain Services và bắt ở lớp Application Service hoặc lớp xử lý Command.  
  * **Đối với giao tiếp Request/Reply (qua NATS/API Gateway):** Lỗi nghiệp vụ sẽ được chuyển đổi thành phản hồi lỗi có cấu trúc (ví dụ: JSON object) bao gồm mã lỗi (error code) và thông báo lỗi chi tiết, được trả về cho bên gọi. Sử dụng HTTP status code 400 Bad Request cho các lỗi phía người dùng khi giao tiếp qua API Gateway. Phản hồi lỗi sẽ bao gồm một biến chỉ báo thành công/thất bại (ví dụ: success: false) cùng với thông tin lỗi chi tiết.  
  * **Đối với giao tiếp qua Message Broker (Events):** Lỗi nghiệp vụ xảy ra trong quá trình xử lý event sẽ được ghi log chi tiết và có thể phát ra một Domain Event thông báo về sự thất bại nếu cần thiết (ví dụ: SubscriptionSyncFailedEvent từ Background Worker khi xử lý event BUM lỗi nghiệp vụ).  
* **Lỗi Kỹ thuật (Technical Errors):** Các lỗi phát sinh ở lớp Infrastructure (ví dụ: lỗi kết nối DB, lỗi kết nối Message Broker, lỗi cache Redis) sẽ được xử lý bằng cách sử dụng try-catch block.  
  * Các lỗi này cần được ghi log chi tiết (sử dụng Structured Logging theo kiến trúc chung) với mức độ phù hợp (ví dụ: ERROR), bao gồm stack trace và các thông tin tương quan (traceId, spanId).  
  * Đối với giao tiếp Request/Reply: Lỗi kỹ thuật sẽ được chuyển đổi thành phản hồi lỗi chung (ví dụ: HTTP status code 500 Internal Server Error) để tránh lộ thông tin nhạy cảm, nhưng vẫn ghi log chi tiết ở phía server.  
  * Đối với giao tiếp qua Message Broker: Lỗi kỹ thuật sẽ được xử lý theo cơ chế retry của RabbitMQ. Nếu retry vẫn thất bại, message sẽ được chuyển vào Dead Letter Queue (DLQ) để phân tích sau. Lỗi cũng cần được ghi log và có thể kích hoạt cảnh báo.  
* **Lỗi Validate Input:** Đối với các yêu cầu nhận được qua API Endpoint (từ API Gateway), lỗi validate input sẽ được xử lý ở lớp Application Service hoặc Controller (trong NestJS) trước khi tạo Command/Query. Phản hồi lỗi sẽ sử dụng HTTP status code 400 Bad Request với thông báo lỗi chi tiết về các trường không hợp lệ.  
* **Xử lý Lỗi khi gọi các BC khác (BUM, NDM, RDM, LZM, ALM):**  
  * **Lỗi Kỹ thuật:** Áp dụng Timeouts, Retries, Circuit Breaker như mô tả trong mục 10\. Nếu sau khi retry vẫn thất bại, ghi log lỗi chi tiết và có thể phát ra cảnh báo. Tùy thuộc vào tính chất của cuộc gọi, lỗi kỹ thuật từ phụ thuộc có thể khiến luồng nghiệp vụ chính trong IAM thất bại (ví dụ: không gửi được email xác minh qua NDM có thể khiến đăng ký bị Pending hoặc Failed).  
  * **Lỗi Nghiệp vụ:** Khi một BC phụ thuộc trả về lỗi nghiệp vụ (ví dụ: NDM báo email không hợp lệ, BUM báo không tìm thấy Subscription), IAM cần bắt lỗi này, ghi log chi tiết (INFO hoặc WARNING, tùy mức độ nghiêm trọng), và xử lý theo logic nghiệp vụ của IAM. Ví dụ: nếu NDM báo lỗi gửi email xác minh, luồng đăng ký vẫn có thể thành công nhưng trạng thái email sẽ là "VerificationFailed" và cần có cơ chế gửi lại sau. Nếu BUM báo lỗi khi lấy entitlement, IAM Background Worker ghi log lỗi và có thể thử lại sau, nhưng IAM Query Service sẽ dựa vào cache (hoặc trả về Denied nếu cache miss) như đã nêu ở mục 6.2. Lỗi nghiệp vụ từ phụ thuộc thường không kích hoạt retry ở lớp giao tiếp mà được xử lý ở lớp Application Service của IAM.  
* **Thông báo Lỗi:** Các lỗi quan trọng (ví dụ: lỗi kết nối DB kéo dài, lỗi xử lý Command quan trọng, lỗi đồng bộ trạng thái Tổ chức từ BUM, lỗi xử lý event từ Message Broker) cần kích hoạt cảnh báo thông qua hệ thống giám sát (Observability Stack).

## **10\. Khả năng Phục hồi (Resiliency)**

Để đảm bảo IAM chịu lỗi và phục hồi khi các phụ thuộc gặp sự cố:

* **Timeouts và Retries:** Cấu hình timeouts và retry policies cho các cuộc gọi đi đến các phụ thuộc (PostgreSQL, Redis, NATS, RabbitMQ, BUM API, NDM API, ALM API, RDM API). Sử dụng các thư viện hỗ trợ retry với exponential backoff và jitter.  
* **Circuit Breaker:** Áp dụng mẫu Circuit Breaker cho các cuộc gọi đến các phụ thuộc có khả năng gặp sự cố tạm thời (ví dụ: gọi BUM API, NDM API) để ngăn chặn các cuộc gọi liên tục gây quá tải cho phụ thuộc đó và cho chính service IAM.  
* **Bulkhead:** Nếu có các loại tác vụ khác nhau trong cùng một service (ví dụ: xử lý Login Commands và User Management Commands trong IAM Command Service), cân nhắc sử dụng Bulkhead để cô lập tài nguyên, ngăn chặn một loại tác vụ bị treo ảnh hưởng đến loại khác. Trong IAM Query Service, cần cô lập tài nguyên cho luồng kiểm tra quyền tốc độ cao so với các truy vấn thông tin người dùng/tổ chức.  
* **Health Checks:** Triển khai các loại Health Check Probe trong Kubernetes cho mỗi service IAM:  
  * **Startup Probe:** Kiểm tra xem ứng dụng đã khởi động hoàn toàn (ví dụ: kết nối đến DB, Message Broker, Cache đã sẵn sàng).  
  * **Liveness Probe:** Kiểm tra xem ứng dụng có đang chạy và khỏe mạnh không. Kiểm tra vòng lặp xử lý message/request.  
  * **Readiness Probe:** Kiểm tra xem ứng dụng đã sẵn sàng xử lý request chưa. Kiểm tra kết nối đến **PostgreSQL** (nguồn dữ liệu chính), **Redis** (lớp cache quan trọng), và khả năng thực hiện các thao tác đọc/ghi/cache cơ bản.  
* **Idempotency:** Thiết kế các Command Handlers và Event Handlers (đặc biệt là các handler lắng nghe sự kiện từ BUM và các sự kiện nội bộ từ Command Service) có tính Idempotent nếu có thể, để việc xử lý lặp lại do retry hoặc lỗi tạm thời không gây ra kết quả không mong muốn.

## **11\. Chiến lược Kiểm thử (Testing Strategy)**

Chiến lược kiểm thử cho IAM sẽ tuân thủ mô hình chung của Ecoma:

* **Unit Tests:** Kiểm thử logic nghiệp vụ cốt lõi trong Domain Model, Domain Services và logic xử lý trong Application Services một cách độc lập (sử dụng mock cho Repository, Gateway, Broker).  
* **Integration Tests:** Kiểm thử sự tương tác giữa các thành phần nội bộ của từng service (ví dụ: Application Service gọi Domain Service, Repository tương tác với cơ sở dữ liệu thực hoặc Testcontainers).  
* **End-to-End Tests (E2E Tests):** Kiểm thử luồng nghiệp vụ hoàn chỉnh xuyên qua các service (ví dụ: đăng ký user mới qua API Gateway, kiểm tra quyền từ một Feature BC gọi đến IAM Query Service). Sử dụng môi trường test tích hợp hoặc giả lập các phụ thuộc.  
* **Contract Tests:** Đảm bảo các API Endpoint của IAM (qua API Gateway/NATS Request/Reply) tuân thủ "hợp đồng" đã định nghĩa (sử dụng OpenAPI spec). Tương tự, kiểm tra schema của Domain Events được phát ra và schema của Events được tiêu thụ từ BUM và IAM Command Service.  
* **Component Tests:** Kiểm thử từng service IAM (Query, Command, Worker) trong môi trường gần với production, với các phụ thuộc (DB, Redis, Message Broker, các BC khác) được giả lập hoặc sử dụng Testcontainers.  
* **Performance/Load Tests:** Kiểm thử tải để xác minh IAM Query Service có thể đáp ứng yêu cầu hiệu năng cao cho luồng xác thực/ủy quyền và IAM Command Service có thể xử lý lượng Commands/lưu lượng đăng nhập/đăng ký dự kiến.

## **12\. Chiến lược Di chuyển Dữ liệu (Data Migration Strategy)**

Quản lý thay đổi schema database PostgreSQL của IAM cần được thực hiện cẩn thận:

* Sử dụng công cụ quản lý migration schema tự động (ví dụ: Flyway hoặc Liquibase).  
* Thiết kế các migration có tính **Backward Compatibility** (chỉ thêm, không xóa/sửa đổi các cột/bảng quan trọng). Điều này đặc biệt quan trọng với các cột như email, password\_hash, user\_id, organization\_id vì chúng là trung tâm của nhiều Aggregate Root và mối quan hệ.  
* Lập kế hoạch **rollback** cho các migration.  
* Đối với các thay đổi dữ liệu phức tạp (ví dụ: chuẩn hóa dữ liệu cũ), viết **Data Migration Script** riêng biệt.  
* Đảm bảo có bản sao lưu (backup) dữ liệu trước khi thực hiện các migration quan trọng.

## **13\. Kế hoạch Dung lượng (Capacity Planning \- Initial)**

Dựa trên ước tính ban đầu về lượng người dùng, tổ chức, tần suất đăng nhập/đăng ký, số lượng request kiểm tra quyền, đưa ra ước tính ban đầu về tài nguyên cần thiết cho mỗi đơn vị triển khai của IAM. Các con số này là điểm khởi đầu và sẽ được điều chỉnh dựa trên dữ liệu thực tế sau khi triển khai và giám sát.

* **IAM Query Service:** Dự kiến sẽ nhận lượng request *rất lớn* cho việc xác thực và ủy quyền.  
  * Số lượng Pod tối thiểu: 5-10 (để đảm bảo tính sẵn sàng cao và phân tải)  
  * Số lượng Pod tối đa: 20+ (có thể điều chỉnh dựa trên tải, đặc biệt là load từ Authorization check)  
  * Giới hạn CPU mỗi Pod: 500m \- 1000m  
  * Giới hạn Memory mỗi Pod: 512Mi \- 1Gi  
  * Cấu hình HPA: Chủ yếu dựa trên CPU Utilization và Request Rate.  
* **IAM Command Service:** Nhận lượng request cho các thao tác ghi (ít hơn luồng đọc).  
  * Số lượng Pod tối thiểu: 3-5  
  * Số lượng Pod tối đa: 10  
  * Giới hạn CPU mỗi Pod: 300m \- 700m  
  * Giới hạn Memory mỗi Pod: 512Mi \- 1Gi  
  * Cấu hình HPA: Dựa trên CPU Utilization và Request Rate.  
* **IAM Background Worker:** Lượng tải xử lý event và tác vụ định kỳ dự kiến không quá lớn.  
  * Số lượng Pod tối thiểu: 2 (để đảm bảo tính sẵn sàng)  
  * Số lượng Pod tối đa: 3-5  
  * Giới hạn CPU mỗi Pod: 200m \- 500m  
  * Giới hạn Memory mỗi Pod: 256Mi \- 512Mi  
  * Cấu hình HPA: Có thể dựa trên CPU Utilization hoặc độ dài hàng đợi (nếu xử lý job queue).  
* **PostgreSQL Database:** Cần được cấu hình mạnh mẽ để xử lý lượng ghi từ Command Service và lượng đọc từ Query Service (đặc biệt là khi cache miss).  
  * Kích thước đĩa ban đầu: 20GB+ (dự kiến dữ liệu IAM sẽ tăng trưởng đáng kể theo số lượng user/org)  
  * RAM: 8GB \- 16GB+ (tùy thuộc vào tải và kích thước dữ liệu active)  
  * CPU: 2-4+ core  
  * Cần cấu hình Connection Pooling hiệu quả.  
* **Redis Cache:** Cần đủ bộ nhớ để lưu trữ Session Token, User/Org/Membership/Role/Permission info, Effective Permissions, và Entitlement cached.  
  * Kích thước bộ nhớ cần thiết: Ước tính dựa trên số lượng user/org active, số lượng session đồng thời, kích thước dữ liệu cached (ví dụ: 5GB \- 10GB+).

Các con số này cần được xem xét kỹ lưỡng hơn dựa trên phân tích tải chi tiết và được theo dõi, điều chỉnh liên tục sau khi hệ thống đi vào hoạt động.

## **14\. Phụ thuộc (Dependencies)**

* **Phụ thuộc Nội bộ (Internal Dependencies):**  
  * Các BC khác (Feature BCs, API Gateway) là Consumer của IAM Query Service (đặc biệt là Authorization check).  
  * IAM Background Worker phụ thuộc vào BUM (lắng nghe Events).  
  * IAM Command Service phụ thuộc vào NDM (gửi thông báo), ALM (ghi log).  
  * IAM Query Service phụ thuộc vào RDM (lấy dữ liệu tham chiếu), LZM (bản địa hóa), và có thể BUM (lấy entitlement, fallback).  
* **Phụ thuộc Bên ngoài (External Dependencies):**  
  * Database (PostgreSQL, Redis).  
  * Message Brokers (NATS, RabbitMQ).  
  * Container Registry.  
  * Kubernetes API.  
  * External Services (Email Sending Gateway \- thông qua NDM).

## **15\. Kết luận**

Tài liệu thiết kế triển khai cho Bounded Context Identity & Access Management (IAM) đã được xây dựng dựa trên tài liệu thiết kế miền IAM và tuân thủ chặt chẽ kiến trúc Microservices, CQRS và Clean Architecture của hệ thống Ecoma. Việc phân tách IAM thành các đơn vị triển khai riêng biệt (Query Service, Command Service, Background Worker) là cần thiết để đáp ứng yêu cầu về hiệu năng và khả năng mở rộng cho các luồng xác thực/ủy quyền tốc độ cao và các luồng quản lý dữ liệu, tác vụ nền. Việc sử dụng PostgreSQL và Redis cho lưu trữ dữ liệu và cache được lựa chọn để đảm bảo tính toàn vẹn, hiệu năng và khả năng mở rộng cần thiết. Các khía cạnh quan trọng về giao tiếp, xử lý lỗi, khả năng phục hồi, kiểm thử và vận hành đã được đề cập, phác thảo các chiến lược và yêu cầu kỹ thuật.

Tài liệu này cung cấp nền tảng vững chắc cho đội ngũ kỹ thuật để tiến hành thiết kế kỹ thuật chi tiết hơn (ví dụ: thiết kế lớp Repository, Gateway, chi tiết implementation của Domain/Application Service, cấu trúc Command/Query/Event payload chi tiết) và bắt đầu quá trình triển khai thực tế Microservice IAM, đảm bảo tuân thủ các nguyên tắc và mục tiêu kiến trúc của hệ thống Ecoma.

## **16\. Monitoring**

### **16.1. Metrics**

**1\. Service Level Metrics:**

* **Availability:**  
  * Service uptime  
  * Module uptime (Command, Query, Background)  
  * Health check status  
  * Error rate  
* **Performance:**  
  * Response time  
  * Request rate  
  * Resource usage (CPU, Memory)  
  * PostgreSQL connection pool status  
  * Redis connection status  
  * Message Broker connection status

**2\. Module Level Metrics:**

* **Query Module:**  
  * Authorization check rate  
  * Authorization check latency  
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
* **Background Module:**  
  * Event processing rate  
  * Event processing latency  
  * Failed events count  
  * Scheduled task execution time  
  * Scheduled task success rate

**3\. Business Metrics:**

* Active users count  
* Active organizations count  
* Session count  
* Login success/failure rate  
* Registration rate  
* Organization creation rate  
* Authorization check patterns

### **16.2. Logging**

**1\. Log Levels:**

* ERROR: Lỗi nghiêm trọng cần can thiệp ngay  
* WARN: Cảnh báo cần chú ý  
* INFO: Thông tin hoạt động bình thường  
* DEBUG: Thông tin chi tiết cho debugging  
* TRACE: Thông tin rất chi tiết

**2\. Log Categories:**

* **Service Logs:**  
  * Service startup/shutdown  
  * Health check results  
  * Configuration changes  
  * Resource usage  
* **Module Logs:**  
  * Authentication attempts  
  * Authorization decisions  
  * User registration  
  * Organization management  
  * Session management  
  * Resource access  
* **Business Logs:**  
  * User status changes  
  * Organization status changes  
  * Permission changes  
  * Role assignments  
  * Integration events

**3\. Log Format:**

{  
  "timestamp": "2024-03-20T10:00:00Z",  
  "level": "INFO",  
  "module": "command|query|background",  
  "traceId": "abc123",  
  "message": "User login successful",  
  "context": {  
    "userId": "user\_123",  
    "organizationId": "org\_456",  
    "ipAddress": "192.168.1.1",  
    "userAgent": "Mozilla/5.0..."  
  },  
  "metadata": {  
    "service": "iam",  
    "version": "1.0.0",  
    "environment": "production"  
  }  
}

### **16.3. Tracing**

**1\. Trace Context:**

* Trace ID  
* Span ID  
* Parent Span ID  
* Service name  
* Module name  
* Operation name

**2\. Trace Points:**

* **Query Module:**  
  * Query received  
  * Cache lookup  
  * Database query  
  * Authorization decision  
  * Response sent  
* **Command Module:**  
  * Command received  
  * Command validation  
  * Business rule check  
  * Command execution  
  * Event publication  
  * Response sent  
* **Background Module:**  
  * Event received  
  * Event processing  
  * Task triggering  
  * Task execution  
  * Task completion

**3\. Trace Format:**

{  
  "traceId": "abc123",  
  "spanId": "def456",  
  "parentSpanId": "ghi789",  
  "service": "iam",  
  "module": "command|query|background",  
  "operation": "login|authorize|processEvent",  
  "startTime": "2024-03-20T10:00:00Z",  
  "endTime": "2024-03-20T10:00:01Z",  
  "duration": "1000ms",  
  "tags": {  
    "userId": "user\_123",  
    "organizationId": "org\_456",  
    "status": "success"  
  }  
}

### **16.4. Alerting**

**1\. Service Level Alerts:**

* Service down  
* High error rate  
* High latency  
* Resource exhaustion  
* Health check failures

**2\. Module Level Alerts:**

* **Query Module:**  
  * High authorization failure rate  
  * High query latency  
  * Cache failure  
  * Database connection issues  
  * High error rate in specific query type  
* **Command Module:**  
  * High command failure rate  
  * Event publication failures  
  * Database transaction failures  
  * High validation error rate  
  * Critical command failures (login, registration)  
* **Background Module:**  
  * Event processing failures  
  * Scheduled task failures  
  * Dead letter queue growth  
  * BUM synchronization failures  
  * Entitlement cache inconsistency

**3\. Business Level Alerts:**

* High login failure rate  
* Critical permission changes  
* Owner removal attempts  
* Unusual authentication patterns  
* Subscription state synchronization issues

### **16.5. Dashboards**

**1\. Service Overview:**

* Service health  
* Module health  
* Resource usage  
* Error rates  
* Performance metrics

**2\. Module Dashboards:**

* **Query Dashboard:**  
  * Query rate  
  * Query latency  
  * Cache performance  
  * Authorization check patterns  
  * Error rates by query type  
* **Command Dashboard:**  
  * Command rate  
  * Command latency  
  * Business rule violations  
  * Event publication success  
  * Error rates by command type  
* **Background Dashboard:**  
  * Event processing  
  * Scheduled task execution  
  * Synchronization status  
  * Error rates  
  * Queue metrics

**3\. Business Dashboard:**

* User activity  
* Organization activity  
* Authentication patterns  
* Authorization patterns  
* Security metrics

## **17\. Health Checks**

### **17.1. Health Check Endpoints**

**IAM Query Service:**

* /health: Kiểm tra service có đang chạy không  
* /health/ready: Kiểm tra service đã sẵn sàng nhận request chưa (kết nối PostgreSQL, Redis, Message Broker)  
* /health/startup: Kiểm tra quá trình khởi động  
* /health/query: Kiểm tra trạng thái của query module

**IAM Command Service:**

* /health: Kiểm tra service có đang chạy không  
* /health/ready: Kiểm tra service đã sẵn sàng nhận request chưa (kết nối PostgreSQL, Message Broker)  
* /health/startup: Kiểm tra quá trình khởi động  
* /health/command: Kiểm tra trạng thái của command module

**IAM Background Service:**

* /health: Kiểm tra service có đang chạy không  
* /health/ready: Kiểm tra service đã sẵn sàng nhận request chưa (kết nối PostgreSQL, Message Broker)  
* /health/startup: Kiểm tra quá trình khởi động  
* /health/background: Kiểm tra trạng thái của background module

### **17.2. Health Check Response Format**

{  
  "status": "UP|DOWN",  
  "components": {  
    "postgresql": {  
      "status": "UP|DOWN",  
      "details": {  
        "connection": "established|failed",  
        "latency": "10ms"  
      }  
    },  
    "redis": {  
      "status": "UP|DOWN",  
      "details": {  
        "connection": "established|failed",  
        "latency": "5ms"  
      }  
    },  
    "messageBroker": {  
      "status": "UP|DOWN",  
      "details": {  
        "connection": "established|failed",  
        "latency": "5ms"  
      }  
    },  
    "module": {  
      "status": "UP|DOWN",  
      "details": {  
        "authorizationRate": "100/s",  
        "cacheHitRate": "90%",  
        "lastSuccessfulQuery": "2024-03-20T10:00:00Z"  
      }  
    }  
  }  
}

### **17.3. Health Check Behavior**

**Liveness Probe:**

* Endpoint: /health  
* Kiểm tra service có đang chạy không  
* Không kiểm tra dependencies  
* Trả về 200 nếu service đang chạy  
* Trả về 503 nếu service không hoạt động

**Readiness Probe:**

* Endpoint: /health/ready  
* Kiểm tra service đã sẵn sàng nhận request chưa  
* Kiểm tra kết nối PostgreSQL, Redis (Query Service) và Message Broker  
* Trả về 200 nếu service sẵn sàng  
* Trả về 503 nếu service chưa sẵn sàng

**Startup Probe:**

* Endpoint: /health/startup  
* Kiểm tra quá trình khởi động  
* Kiểm tra kết nối PostgreSQL, Redis và Message Broker  
* Trả về 200 nếu khởi động thành công  
* Trả về 503 nếu khởi động thất bại

**Module Probe:**

* Endpoint: /health/\[module\]  
* Kiểm tra trạng thái của module cụ thể  
* Kiểm tra các metrics và trạng thái của module  
* Trả về 200 nếu module hoạt động bình thường  
* Trả về 503 nếu module có vấn đề

## **18\. Data Security**

### **18.1. Dữ liệu Nhạy cảm**

IAM xử lý nhiều loại dữ liệu nhạy cảm. Các biện pháp bảo mật sau được áp dụng cho từng loại:

**Mật khẩu:**

* Không bao giờ lưu trữ mật khẩu dạng plain text  
* Sử dụng thuật toán băm mạnh (bcrypt) với salt  
* Đảm bảo không có log mật khẩu  
* Không bao giờ trả về thông tin mật khẩu trong API

**Thông tin xác thực:**

* Token phiên được lưu trữ có mã hóa  
* Token reset mật khẩu có thời hạn hết hạn ngắn  
* Xác minh email token có thời hạn hết hạn  
* Không bao giờ trả về token trong log

**Thông tin người dùng:**

* Hạn chế truy cập thông tin người dùng theo quyền  
* Masking thông tin trong log (email, thông tin cá nhân)  
* Tuân thủ quy định về quyền riêng tư dữ liệu

### **18.2. Mã hóa Dữ liệu**

**Mã hóa dữ liệu tĩnh (at rest):**

* Mật khẩu được băm sử dụng bcrypt  
* Token phiên được mã hóa trước khi lưu trữ  
* Dữ liệu nhạy cảm khác được mã hóa trên DB  
* Đĩa DB được mã hóa ở cấp hạ tầng

**Mã hóa dữ liệu động (in transit):**

* TLS/SSL cho tất cả kết nối API  
* Mã hóa cho kết nối DB  
* Mã hóa cho kết nối Redis  
* Mã hóa cho kết nối message broker

### **18.3. Quản lý Quyền Truy cập Dữ liệu**

**Kiểm soát truy cập:**

* RBAC cho tất cả API endpoints  
* Phân vùng dữ liệu theo tổ chức (tenant)  
* Kiểm tra quyền cho mọi truy cập dữ liệu  
* Nguyên tắc đặc quyền tối thiểu

**Kiểm toán truy cập:**

* Ghi log tất cả truy cập dữ liệu nhạy cảm  
* Ghi log tất cả thay đổi quyền  
* Ghi log tất cả thao tác quản trị  
* Tích hợp với ALM cho audit logging

### **18.4. Phòng chống Tấn công**

**Phòng chống tấn công phổ biến:**

* Rate limiting cho API đăng nhập/đăng ký  
* Phòng chống brute force (tạm khóa sau nhiều lần thất bại)  
* Phòng chống CSRF trong web API  
* Các biện pháp phòng chống SQL injection  
* Các biện pháp phòng chống XSS

**Phát hiện bất thường:**

* Giám sát đăng nhập bất thường  
* Giám sát truy cập từ vị trí địa lý bất thường  
* Giám sát các thay đổi quyền đáng ngờ  
* Giám sát các hành vi người dùng bất thường

## **19\. Error Recovery Strategy**

### **19.1. Query Service Recovery**

* Circuit breaker cho Redis và PostgreSQL  
* Cache fallback khi Redis không khả dụng  
* Graceful degradation khi DB quá tải  
* Retry logic với backoff cho các lỗi tạm thời  
* Tiếp tục vận hành với dữ liệu cached nếu DB không khả dụng

### **19.2. Command Service Recovery**

* Retry policy cho các DB transactions  
* Outbox pattern cho event publication  
* Dead letter queue cho failed events  
* Compensating transactions cho failed commands  
* Manual recovery procedures cho critical failures

### **19.3. Background Worker Recovery**

* Automatic retry cho event processing  
* Idempotent event handlers  
* Job tracking và resumption  
* Manual intervention procedures  
* Scheduled reconciliation với BUM

## **20\. Data Consistency**

### **20.1. Transactional Consistency**

* Sử dụng DB transactions cho command processing  
* Optimistic concurrency control  
* Validation trước khi commit  
* Phát hiện và giải quyết conflict

### **20.2. Event-Based Consistency**

* Outbox pattern cho event publication  
* Idempotent event processing  
* Message deduplication  
* Event ordering trong cùng một aggregate  
* Reconciliation process cho inconsistencies

### **20.3. Cache Consistency**

* Cache invalidation dựa trên events  
* TTL cho cached items  
* Write-through caching cho critical data  
* Background refresh cho high-frequency data  
* Versioning cho cached objects

## **21\. API Versioning**

### **21.1. API Versioning Strategy**

* Version được đưa vào path URL (ví dụ: /api/v1/iam/auth/login)  
* Hỗ trợ song song phiên bản Major-1  
* Deprecation notice trước khi loại bỏ phiên bản cũ  
* Tài liệu API rõ ràng cho mỗi phiên bản

### **21.2. Event Schema Versioning**

* Version được đưa vào message schema  
* Hỗ trợ backward compatibility  
* Event consumers có thể xử lý nhiều phiên bản  
* Migration plan cho việc loại bỏ phiên bản cũ

### **21.3. Quản lý Breaking Changes**

* Thêm trường mới là non-breaking  
* Xóa hoặc đổi tên trường là breaking change  
* Phiên bản Major mới cho breaking changes  
* Hỗ trợ migration tools cho clients

## **22\. Deployment Strategy**

### **22.1. Deployment Process**

* Blue-green deployment  
* Canary releases cho tính năng rủi ro cao  
* Zero-downtime updates  
* Automated rollback nếu health check fails

### **22.2. Deployment Order**

1. Database migration (nếu có)  
2. IAM Background Worker  
3. IAM Command Service  
4. IAM Query Service

### **22.3. Rollback Procedure**

* Automated rollback triggers:  
  * Health check failures  
  * Error rate tăng đột biến  
  * Latency tăng đột biến  
* Manual rollback option  
* Data migration rollback planning

## **23\. Disaster Recovery**

### **23.1. Recovery Objectives**

* RPO (Recovery Point Objective): 5 phút  
* RTO (Recovery Time Objective): 15 phút

### **23.2. Backup Strategy**

* PostgreSQL full backup hàng ngày  
* WAL archiving liên tục  
* Point-in-time recovery  
* Geo-replicated backups  
* Backup retention: 30 ngày

### **23.3. Recovery Procedure**

1. Restore PostgreSQL từ backup  
2. Rebuild Redis cache sau khi DB phục hồi  
3. Start các services theo thứ tự:  
   * IAM Background Worker  
   * IAM Command Service  
   * IAM Query Service  
4. Verify data integrity và service health  
5. Thông báo cho các dependent services

## **24\. Performance Requirements**

### **24.1. Latency Requirements**

* **Query Service:**  
  * Authorization check: \< 50ms (P95)  
  * User/Organization query: \< 200ms (P95)  
  * Session validation: \< 20ms (P95)  
* **Command Service:**  
  * Login: \< 500ms (P95)  
  * User registration: \< 1s (P95)  
  * Organization actions: \< 1s (P95)  
* **Background Worker:**  
  * Event processing: \< 2s (P95)  
  * Scheduled tasks: \< 30s (P95)

### **24.2. Throughput Requirements**

* **Query Service:**  
  * Authorization checks: 5000 requests/second  
  * User/Organization queries: 1000 requests/second  
* **Command Service:**  
  * Login/Session operations: 500 requests/second  
  * User management: 100 requests/second  
  * Organization management: 50 requests/second  
* **Background Worker:**  
  * Event processing: 200 events/second  
  * Scheduled tasks: 20 tasks/minute

### **24.3. SLA**

* Availability: 99.95%  
* Data durability: 99.999%  
* Success rate: 99.9%  
* Error rate: \< 0.1%

## **25\. Integration Testing Strategy**

### **25.1. Test Types**

* Unit tests cho domain logic  
* Integration tests cho repositories  
* Service-level tests cho API endpoints  
* Contract tests cho event schemas  
* End-to-end tests cho critical flows

### **25.2. Test Environment**

* Isolated testing environment  
* Testcontainers cho PostgreSQL và Redis  
* Mock BUM và các external dependencies  
* Data generators cho test data

### **25.3. Critical Paths Testing**

* **Authentication flows:**  
  * Registration, email verification, login, password reset  
  * Session management, logout  
* **Organization flows:**  
  * Organization creation, settings update  
  * Invitation, member management  
  * Role assignment  
* **Authorization flows:**  
  * Permission checking  
  * Role-based access control  
  * Multi-tenant data isolation

### **25.4. Non-functional Testing**

* Performance testing (load, stress, endurance)  
* Security testing (penetration testing, vulnerability scanning)  
* Resilience testing (chaos testing, degraded mode)  
* Data migration testing

## **26\. Tích hợp với các Bounded Context khác**

### **26.1. Tích hợp với BUM (Billing & Usage Management)**

**Event Consumption:**

* SubscriptionActivated  
* SubscriptionDeactivated  
* SubscriptionPlanChanged  
* SubscriptionSuspended  
* TenantDataDeletionRequested

**Implementation:**

// Ví dụ về BUM event consumer trong IAM Background Worker  
@Injectable()  
export class BumEventConsumer {  
  constructor(  
    private readonly organizationService: OrganizationService, // Domain Service  
    private readonly entitlementCache: EntitlementCacheService // Infrastructure/Cache Layer  
    private readonly bumClient: BumClient // Infrastructure/Gateway to BUM  
  ) {}

  @RabbitSubscribe({  
    exchange: 'bum.events',  
    routingKey: 'subscription.activated',  
    queue: 'iam.subscription.activated'  
  })  
  async handleSubscriptionActivated(event: SubscriptionActivatedEvent) {  
    const { organizationId, subscriptionId, planId, entitlements } \= event;

    try {  
      // Cập nhật trạng thái tổ chức trong DB (qua Command Service hoặc trực tiếp nếu logic đơn giản)  
      // Tùy thuộc vào thiết kế, việc cập nhật trạng thái có thể là một Command gửi đến IAM Command Service  
      // hoặc được xử lý trực tiếp bởi Background Worker nếu nó có quyền ghi vào DB  
      // Giả định Background Worker có quyền gọi Domain Service hoặc Repository cập nhật trực tiếp  
      await this.organizationService.activateOrganization(organizationId); // Ví dụ gọi Domain Service

      // Đồng bộ chi tiết entitlement từ BUM (nếu payload event không đủ)  
      const latestEntitlements \= await this.bumClient.getOrganizationEntitlements(organizationId);

      // Cập nhật cache entitlement  
      await this.entitlementCache.updateEntitlements(organizationId, latestEntitlements);

      // Ghi log audit (tùy chọn, gửi event đến ALM)  
      await this.auditLogService.logSubscriptionActivated(organizationId, subscriptionId);

    } catch (error) {  
      // Xử lý lỗi kỹ thuật hoặc nghiệp vụ từ BUM Client/DB/Cache  
      Logger.error(\`Failed to process SubscriptionActivatedEvent for Org ${organizationId}\`, error);  
      // Có thể phát ra event AuditLogIngestionFailed hoặc cảnh báo  
      // Message Broker sẽ xử lý retry theo cấu hình  
      throw error; // Ném lỗi để Message Broker biết và retry  
    }  
  }

  @RabbitSubscribe({  
    exchange: 'bum.events',  
    routingKey: 'subscription.plan.changed',  
    queue: 'iam.subscription.plan.changed'  
  })  
  async handleSubscriptionPlanChanged(event: SubscriptionPlanChangedEvent) {  
      const { organizationId, oldPlanId, newPlanId, entitlements } \= event;  
      try {  
          // Đồng bộ chi tiết entitlement từ BUM  
          const latestEntitlements \= await this.bumClient.getOrganizationEntitlements(organizationId);

          // Cập nhật cache entitlement  
          await this.entitlementCache.updateEntitlements(organizationId, latestEntitlements);

          // Ghi log audit  
          await this.auditLogService.logSubscriptionPlanChanged(organizationId, oldPlanId, newPlanId);  
      } catch (error) {  
          Logger.error(\`Failed to process SubscriptionPlanChangedEvent for Org ${organizationId}\`, error);  
          throw error;  
      }  
  }

   @RabbitSubscribe({  
    exchange: 'bum.events',  
    routingKey: 'tenant.data.deletion.requested',  
    queue: 'iam.tenant.data.deletion.requested'  
  })  
  async handleTenantDataDeletionRequested(event: TenantDataDeletionRequestedEvent) {  
      const { tenantId } \= event;  
      try {  
          // Kích hoạt quy trình xóa dữ liệu liên quan đến Tenant trong IAM DB  
          // Đây có thể là một Domain Service hoặc Application Service chuyên biệt  
          await this.organizationService.hardDeleteOrganizationData(tenantId); // Ví dụ gọi Domain Service

          // Xóa cache liên quan đến Tenant này  
          await this.entitlementCache.removeEntitlements(tenantId);  
          await this.organizationCache.removeOrganization(tenantId);  
          // Cần invalidation/xóa cache User, Membership, Session liên quan đến Tenant này  
          // Điều này có thể phức tạp và cần xử lý cẩn thận  
          // Ví dụ: Lấy danh sách User ID thuộc Tenant, sau đó invalidation cache từng User  
          await this.userCache.removeUsersByOrganization(tenantId);  
          await this.membershipCache.removeMembershipsByOrganization(tenantId);  
          await this.sessionCache.removeSessionsByOrganization(tenantId);

          // Ghi log audit  
          await this.auditLogService.logTenantDataHardDeleted(tenantId);  
      } catch (error) {  
          Logger.error(\`Failed to process TenantDataDeletionRequestedEvent for Tenant ${tenantId}\`, error);  
          throw error;  
      }  
  }  
  // Tương tự cho các event SubscriptionDeactivated, SubscriptionSuspended...  
}

### **26.2. Tích hợp với NDM (Notification & Document Management)**

**Sending Notifications:**

// Ví dụ về NDM service trong IAM Command Service  
@Injectable()  
export class NotificationService {  
  constructor(  
    private readonly ndmClient: NdmClient // Infrastructure/Gateway to NDM  
  ) {}

  async sendVerificationEmail(user: User, verificationToken: string): Promise\<void\> {  
    try {  
      await this.ndmClient.sendNotification({  
        recipient: {  
          userId: user.id,  
          email: user.email,  
          name: \`${user.firstName} ${user.lastName}\`,  
          locale: user.locale  
        },  
        notificationType: 'email-verification',  
        templateId: 'email-verification-template', // Tham chiếu đến Template trong NDM  
        data: { // Context Data cho Handlebars template  
          firstName: user.firstName,  
          verificationUrl: \`${config.appUrl}/verify-email?token=${verificationToken}\`  
        },  
        // Các thông tin khác như priority, preferredChannels...  
      });  
      // Ghi log thành công (tùy chọn)  
      Logger.log(\`Verification email sent request to NDM for user ${user.id}\`);  
    } catch (error) {  
      // Xử lý lỗi khi gọi NDM (kỹ thuật hoặc nghiệp vụ từ NDM)  
      Logger.error(\`Failed to send verification email via NDM for user ${user.id}\`, error);  
      // Tùy thuộc vào quy tắc nghiệp vụ, lỗi này có thể khiến luồng đăng ký thất bại  
      // hoặc chỉ ghi log và cho phép người dùng yêu cầu gửi lại email sau.  
      // Giả định lỗi này không chặn đăng ký thành công nhưng cần ghi log và cảnh báo.  
      // Không ném lỗi nếu luồng nghiệp vụ chính không yêu cầu thất bại.  
      // Có thể phát ra một event nội bộ UserEmailVerificationRequestFailed  
    }  
  }

  // Các phương thức khác cho password reset, invitation, etc.  
}

### **26.3. Tích hợp với ALM (Audit Log Management)**

**Sending Audit Logs:**

// Ví dụ về ALM service trong IAM Command Service (hoặc Background Worker)  
@Injectable()  
export class AuditLogService {  
  constructor(  
    private readonly almClient: AlmClient // Infrastructure/Gateway to ALM  
  ) {}

  async logUserLogin(userId: string, tenantId: string | null, success: boolean, metadata: any): Promise\<void\> {  
    try {  
      // Chuẩn bị dữ liệu log theo schema của AuditLogRequestedEvent (được ALM lắng nghe)  
      const auditLogData \= {  
        timestamp: new Date(), // Thời điểm hành động xảy ra  
        initiator: {  
          type: 'User', // Loại initiator  
          id: userId, // ID initiator  
          name: metadata.userName // Tên initiator (ví dụ)  
        },  
        boundedContext: 'IAM', // BC nguồn  
        actionType: 'User.Login', // Loại hành động  
        category: 'Security', // Danh mục  
        severity: success ? 'Info' : 'Warning', // Mức độ nghiêm trọng  
        entityType: 'User', // Loại thực thể bị ảnh hưởng  
        entityId: userId, // ID thực thể bị ảnh hưởng  
        tenantId: tenantId, // ID tổ chức liên quan  
        contextData: metadata, // Dữ liệu ngữ cảnh bổ sung (IP, User Agent, v.v.)  
        status: success ? 'Success' : 'Failure', // Trạng thái hành động  
        failureReason: success ? undefined : metadata.failureReason, // Lý do thất bại  
        // EventId: Có thể thêm ID của event/command gốc nếu có  
        issuedAt: new Date() // Thời điểm event được phát ra  
      };

      // Gửi event AuditLogRequestedEvent đến Message Broker để ALM lắng nghe  
      await this.almClient.sendAuditLogRequestedEvent(auditLogData);

      // Ghi log thành công (tùy chọn)  
      Logger.debug(\`Audit log sent for User.Login action for user ${userId}\`);  
    } catch (error) {  
      // Xử lý lỗi khi gửi log (kỹ thuật hoặc lỗi từ Message Broker/ALM nếu gọi sync)  
      // Lỗi ghi log audit thường không nên làm thất bại luồng nghiệp vụ chính.  
      Logger.error(\`Failed to send audit log for User.Login for user ${userId}\`, error);  
      // Chỉ ghi log và cảnh báo, không ném lỗi để không ảnh hưởng đến luồng đăng nhập.  
    }  
  }

  // Các phương thức khác cho các hành động quan trọng (User.Registered, Organization.Created, Role.Updated, Permission.Deleted, etc.)  
  async logUserRegistered(userId: string, email: string, tenantId: string | null, registeredByUserId: string | null, metadata: any): Promise\<void\> {  
       try {  
           const auditLogData \= {  
               timestamp: new Date(),  
               initiator: {  
                   type: registeredByUserId ? 'User' : 'System',  
                   id: registeredByUserId || 'system',  
                   name: registeredByUserId ? metadata.registeredByName : 'System'  
               },  
               boundedContext: 'IAM',  
               actionType: 'User.Registered',  
               category: 'Business',  
               severity: 'Info',  
               entityType: 'User',  
               entityId: userId,  
               tenantId: tenantId,  
               contextData: {  
                   email: email, // Có thể cần masking email nếu là dữ liệu nhạy cảm  
                   ...metadata  
               },  
               status: 'Success',  
               issuedAt: new Date()  
           };  
           await this.almClient.sendAuditLogRequestedEvent(auditLogData);  
           Logger.debug(\`Audit log sent for User.Registered action for user ${userId}\`);  
       } catch (error) {  
           Logger.error(\`Failed to send audit log for User.Registered for user ${userId}\`, error);  
       }  
   }

    async logRolePermissionChanged(roleId: string, tenantId: string | null, changedByUserId: string, action: 'added' | 'removed', permissionValue: string): Promise\<void\> {  
        try {  
            const auditLogData \= {  
                timestamp: new Date(),  
                initiator: {  
                    type: 'User',  
                    id: changedByUserId,  
                    name: '...' // Lấy tên người dùng từ ngữ cảnh  
                },  
                boundedContext: 'IAM',  
                actionType: \`Role.Permission.${action \=== 'added' ? 'Added' : 'Removed'}\`,  
                category: 'Security',  
                severity: 'Warning', // Thay đổi quyền là hành động nhạy cảm  
                entityType: 'Role',  
                entityId: roleId,  
                tenantId: tenantId,  
                contextData: {  
                    permissionValue: permissionValue  
                },  
                status: 'Success',  
                issuedAt: new Date()  
            };  
            await this.almClient.sendAuditLogRequestedEvent(auditLogData);  
            Logger.debug(\`Audit log sent for Role.Permission.${action} for role ${roleId}\`);  
        } catch (error) {  
            Logger.error(\`Failed to send audit log for Role.Permission.${action} for role ${roleId}\`, error);  
        }  
    }  
}

### **26.4. Tích hợp với LZM (Localization Management)**

**Fetching Translations:**

// Ví dụ về LZM service trong IAM Query Service (hoặc các Service khác cần bản địa hóa)  
@Injectable()  
export class LocalizationService {  
  constructor(  
    private readonly lzmClient: LzmClient, // Infrastructure/Gateway to LZM  
    private readonly cacheManager: Cache // Cache Manager (từ NestJS CacheModule hoặc tương tự)  
  ) {}

  async getTranslation(key: string, locale: string): Promise\<string\> {  
    const cacheKey \= \`translation:${locale}:${key}\`;

    // Try from cache first  
    const cachedValue \= await this.cacheManager.get\<string\>(cacheKey);  
    if (cachedValue) {  
      return cachedValue;  
    }

    try {  
      // Fetch from LZM  
      const translation \= await this.lzmClient.getTranslation(key, locale);

      // Cache the result (cấu hình TTL phù hợp)  
      await this.cacheManager.set(cacheKey, translation, { ttl: 3600 }); // Cache 1 giờ

      return translation;  
    } catch (error) {  
      // Xử lý lỗi khi gọi LZM (kỹ thuật hoặc nghiệp vụ \- ví dụ: Locale không tồn tại)  
      Logger.error(\`Failed to fetch translation for key "${key}" and locale "${locale}" from LZM\`, error);  
      // Chiến lược fallback: Trả về key bản dịch hoặc một chuỗi mặc định  
      return key; // Fallback về key bản dịch  
    }  
  }  
}

## **27\. Capacity Planning Detailed**

### **27.1. Database Sizing**

**PostgreSQL:**

* **Initial Database Size:**  
  * Base size: 5GB  
  * Growth per user: \~5KB  
  * Growth per organization: \~10KB  
  * Growth per session: \~1KB  
  * Estimated total for 100,000 users: \~10GB  
* **Connection Pool:**  
  * IAM Query Service: 20-50 connections per instance  
  * IAM Command Service: 10-20 connections per instance  
  * IAM Background Worker: 5-10 connections per instance  
  * Maximum connections: 200-300  
* **Indexing Strategy:**  
  * Primary keys: B-tree  
  * Lookup fields (email, token): B-tree  
  * Foreign key relationships: B-tree  
  * Partial indexes for active status

**Redis:**

* **Memory Requirements:**  
  * Session cache: \~200MB (10,000 active sessions)  
  * User/Org cache: \~500MB  
  * Permission cache: \~100MB  
  * Misc cache: \~200MB  
  * Total: \~1GB minimum, 5GB recommended  
* **Key Expiry:**  
  * Session keys: Match session timeout (1-24 hours)  
  * Entity cache: 30-60 minutes  
  * Permission cache: 60 minutes  
  * High-frequency data: 5-15 minutes

### **27.2. Network Capacity**

* **Ingress Traffic:**  
  * API Gateway to Query Service: \~50-100 Mbps  
  * API Gateway to Command Service: \~20-50 Mbps  
  * Message Broker to Background Worker: \~10-20 Mbps  
* **Egress Traffic:**  
  * Query Service to Redis/DB: \~30-70 Mbps  
  * Command Service to DB/Message Broker: \~20-40 Mbps  
  * Background Worker to DB/Message Broker: \~10-20 Mbps  
* **Cross-Service Communication:**  
  * Query to Command (internal): \~5-10 Mbps  
  * To external BCs: \~10-20 Mbps

### **27.3. Auto-scaling Strategy**

**IAM Query Service:**

* Scale based on CPU utilization (target: 70%)  
* Scale based on request rate (threshold: 70% of capacity)  
* Scale based on memory utilization (target: 80%)  
* Min replicas: 5  
* Max replicas: 20

**IAM Command Service:**

* Scale based on CPU utilization (target: 70%)  
* Scale based on request rate (threshold: 70% of capacity)  
* Scale based on queue length (if applicable)  
* Min replicas: 3  
* Max replicas: 10

**IAM Background Worker:**

* Scale based on CPU utilization (target: 70%)  
* Scale based on event processing lag  
* Scale based on queue length  
* Min replicas: 2  
* Max replicas: 5

**PostgreSQL:**

* Read replicas: 1-3 based on read traffic  
* Connection pooling with PgBouncer  
* Vertical scaling for write capacity

**Redis:**

* Redis Cluster for sharding  
* Read replicas: 1-2  
* Memory allocation based on key growth
