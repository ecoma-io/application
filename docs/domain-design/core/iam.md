# **Tài liệu Thiết kế Miền: Bounded Context Identity & Access Management (IAM)**

## **1\. Giới thiệu**

Tài liệu này cung cấp mô tả chi tiết về Bounded Context **Identity & Access Management (IAM)** trong hệ thống Ecoma. IAM là một trong những Bounded Context cốt lõi (Core Bounded Context), đóng vai trò nền tảng trong việc quản lý danh tính (Identity) của người dùng và tổ chức (Tenant), cũng như kiểm soát quyền truy cập (Access Management) vào các tài nguyên và tính năng trên toàn bộ nền tảng Ecoma.

IAM đảm bảo rằng chỉ những người dùng được xác thực và có quyền mới có thể truy cập các chức năng phù hợp, đồng thời quản lý cấu trúc đa tổ chức của hệ thống SaaS, phân biệt rõ ràng giữa người dùng/vai trò/quyền hạn trong phạm vi nội bộ của Ecoma và trong phạm vi từng tổ chức khách hàng, với hệ thống quyền hạn có cấu trúc phân cấp.

## **2\. Phạm vi của Tài liệu**

Tài liệu này tập trung vào việc định nghĩa và mô tả Bounded Context IAM ở cấp độ thiết kế miền (domain design), cung cấp đủ chi tiết để hỗ trợ việc thiết kế các Domain Service và Application Service, có tính đến sự phân biệt giữa phạm vi nội bộ và phạm vi tổ chức, và cấu trúc phân cấp của hệ thống quyền hạn. Cụ thể, tài liệu này bao gồm:

- Xác định vai trò và trách nhiệm chính của IAM, đặc biệt nhấn mạnh vai trò cốt lõi của nghiệp vụ Xác thực (Authentication) và Ủy quyền (Authorization).
- Mô tả các khái niệm và thực thể cốt lõi trong mô hình domain của IAM ở cấp độ chi tiết hơn, bao gồm các Aggregate Root, Entity và Value Object với các thuộc tính chính, có tính đến sự phân biệt phạm vi (nội bộ/tổ chức) và cấu trúc quyền hạn, cũng như các thông tin bổ sung về tổ chức như slug và logo.
- Định nghĩa Ngôn ngữ Chung (Ubiquitous Language) trong phạm vi IAM.
- Mô tả **Các Khía cạnh Quan trọng của Miền IAM**, bao gồm hệ thống phân cấp quyền hạn, vòng đời trạng thái của User và Organization, logic kết hợp quyền hạn, và các quy tắc nghiệp vụ cho trường hợp đặc biệt.
- Phác thảo các **Use cases** chính có sự tham gia của IAM, được tổ chức theo các nhóm phạm vi tương tác chính (User Scope, Organization Scope, Core Scope), tập trung vào mục đích của use case, các actor liên quan, không đi sâu vào chi tiết cách thức thực hiện (how). Mỗi use case sẽ mô tả ngắn gọn Application Service xử lý chính và các Domain Service/Aggregate Root liên quan. Các use case bao gồm **đăng ký người dùng**, **tạo tổ chức**, xác minh email, đăng nhập, đăng xuất, quản lý phiên làm việc (bao gồm đăng xuất từ xa), quản lý người dùng, vai trò, quyền hạn, lời mời, thu hồi lời mời, các quy tắc quản lý đặc thù (ví dụ: quản lý Owner), quy trình khôi phục tài khoản và đặt lại mật khẩu, và các chức năng quản lý trong cài đặt tổ chức liên quan đến IAM (bao gồm quy tắc chỉ Owner được cập nhật).
- Xác định ranh giới nghiệp vụ của IAM.
- Đề xuất các Domain Service và Application Service tiềm năng trong IAM, chỉ mô tả trách nhiệm chính chứ không liệt kê chi tiết phương thức.
- Làm rõ cách IAM thực thi kiểm tra quyền truy cập dựa trên Vai trò, Quyền hạn (có tính đến phân cấp và phạm vi), Entitlement từ BUM, và ngữ cảnh phiên làm việc.

Tài liệu này **không** đi sâu vào các chi tiết kỹ thuật triển khai cụ thể hoặc mô tả chi tiết các bước thực hiện (how) của từng luồng nghiệp vụ **bên trong các service**. Các khíaAspect sau **không** nằm trong phạm vi của tài liệu này:

- Chi tiết cài đặt kỹ thuật của Microservice IAM (ngôn ngữ lập trình, framework, kiến trúc nội bộ chi tiết).
- Cấu trúc cơ sở dữ liệu chi tiết (schema) của IAM.
- Các quyết định công nghệ cụ thể bên trong IAM (ví dụ: thuật toán mã hóa mật khẩu, loại token JWT).
- Luồng dữ liệu chi tiết đến cấp độ từng trường thông tin giữa IAM và các BC khác.
- Cấu hình hạ tầng triển khai cụ thể cho IAM.
- Thiết kế giao diện người dùng liên quan đến IAM.
- Định nghĩa chính xác cấu trúc dữ liệu (payload) của từng Command và Domain Event (chỉ mô tả mục đích và thông tin cốt lõi).
- Định nghĩa chi tiết các API Interface (chỉ mô tả chức năng và tương tác).
- Mô tả chi tiết từng bước xử lý bên trong mỗi Domain Service hoặc Application Service.

## **3\. Vai trò và Trách nhiệm Chính**

Bounded Context IAM chịu trách nhiệm quản lý danh tính và quyền truy cập trên toàn hệ thống, phân biệt rõ ràng giữa phạm vi nội bộ của Ecoma và phạm vi từng tổ chức khách hàng. Các trách nhiệm chính bao gồm:

- **Xác thực (Authentication):** **Đây là một trong những trách nhiệm cốt lõi nhất của IAM.** Xác minh danh tính của người dùng khi họ cố gắng truy cập hệ thống (ví dụ: qua đăng nhập bằng email/mật khẩu). Tạo và quản lý phiên làm việc (Session) hoặc token xác thực, có tính đến ngữ cảnh (phạm vi nội bộ hay tổ chức khách hàng) của phiên làm việc. Bao gồm cả việc xử lý yêu cầu **khôi phục tài khoản và đặt lại mật khẩu** và **xác minh email đăng ký**.
- **Ủy quyền (Authorization):** **Đồng hành với Xác thực, đây là trách nhiệm cốt lõi thứ hai.** Kiểm tra xem người dùng (trong ngữ cảnh của một phiên làm việc cụ thể) có được phép thực hiện một hành động cụ thể hoặc truy cập một tài nguyên cụ thể hay không, dựa trên Vai trò, Quyền hạn (tương ứng với phạm vi và có tính đến phân cấp) và **Quyền lợi Tính năng (Entitlement) từ BUM (chỉ áp dụng cho phạm vi tổ chức)**.
- **Quản lý Người dùng:** Tạo, cập nhật, vô hiệu hóa và quản lý hồ sơ người dùng cơ bản. Một người dùng có thể là người dùng nội bộ Ecoma, người dùng thuộc một hoặc nhiều tổ chức khách hàng, hoặc cả hai. Bao gồm cả việc xử lý yêu cầu khôi phục tài khoản và đặt lại mật khẩu.
- **Quản lý Tổ chức (Tenant):** Tạo, cập nhật và quản lý thông tin cơ bản về các tổ chức khách hàng, bao gồm cả **slug (dùng cho subdomain)** và **logo**. IAM là nguồn sự thật về sự tồn tại và trạng thái của một tổ chức khách hàng.
- **Quản lý Quan hệ Người dùng \- Phạm vi (Membership):** Liên kết người dùng với một phạm vi cụ thể (nội bộ hoặc tổ chức khách hàng) và quản lý vai trò của họ trong phạm vi đó.
- **Quản lý Vai trò và Quyền hạn:** Định nghĩa các Vai trò (Role) và gán các Quyền hạn (Permission) cho từng Vai trò. **Vai trò và Quyền hạn được phân loại theo phạm vi: nội bộ Ecoma hoặc tổ chức khách hàng.** Quản lý việc gán Vai trò cho người dùng trong ngữ cảnh của một Tổ chức khách hàng hoặc gán vai trò nội bộ cho người dùng nội bộ. **Hệ thống Quyền hạn có cấu trúc phân cấp, trong đó quyền cấp cao hơn có thể bao gồm các quyền con.**
- **Quản lý Lời mời:** Xử lý quy trình mời người dùng tham gia vào một Tổ chức khách hàng cụ thể. Bao gồm cả việc **thu hồi lời mời**.
- **Cung cấp Dịch vụ Xác thực/Ủy quyền cho các BC khác:** Cung cấp các API hoặc cơ chế để các Bounded Context khác có thể xác thực yêu cầu đến từ người dùng và kiểm tra quyền của người dùng đó trong ngữ cảnh phù hợp.
- **Phát Sự kiện Nghiệp vụ:** Phát ra các Sự kiện Nghiệp vụ quan trọng khi có thay đổi về người dùng, tổ chức khách hàng, vai trò, quyền hạn hoặc mối quan hệ giữa chúng.

## **4\. Mô hình Domain (Chi tiết hơn)**

Trong phạm vi Bounded Context IAM, chúng ta xác định các Aggregate Root, Entity và Value Object cốt lõi với các thuộc tính chính (có thể thay đổi trong quá trình thiết kế chi tiết), có tính đến sự phân biệt phạm vi nội bộ và tổ chức, và cấu trúc phân cấp quyền hạn:

**Aggregate Roots:**

- **User:** Là Aggregate Root đại diện cho một người dùng duy nhất trong hệ thống Ecoma. User quản lý thông tin xác thực và hồ sơ cơ bản của người dùng.
  - **ID:** Unique identifier (UUID).
  - **Email:** Địa chỉ email (duy nhất).
  - **PasswordHash:** Hash của mật khẩu.
  - **Status:** Trạng thái người dùng (UserStatus Value Object: Active, Inactive, Pending Confirmation, Password Reset Requested).
  - **Profile:** Thông tin hồ sơ cơ bản (UserProfile Value Object).
  - **PasswordResetToken:** **Optional** Chuỗi token duy nhất cho quy trình đặt lại mật khẩu. **Lưu trữ trong database kèm trạng thái và thời điểm hết hạn để đảm bảo tính duy nhất, chỉ sử dụng một lần và có thời hạn.**
  - **PasswordResetTokenExpiresAt:** **Optional** Thời điểm hết hạn của token đặt lại mật khẩu.
  - **EmailVerificationToken:** **Optional** Chuỗi token duy nhất cho quy trình xác minh email. **Lưu trữ trong database kèm trạng thái và thời điểm hết hạn để đảm bảo tính duy nhất, chỉ sử dụng một lần và có thời hạn.**
  - **EmailVerificationTokenExpiresAt:** **Optional** Thời điểm hết hạn của token xác minh email.
  - **CreatedAt:** Thời điểm tạo.
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng.
  - _Behavior:_ Register, Authenticate, UpdateProfile, ChangePassword, Deactivate, InitiatePasswordReset, ResetPassword, InitiateEmailVerification, VerifyEmail.
- **Organization (Tenant):** Là Aggregate Root đại diện cho một tổ chức khách hàng sử dụng nền tảng Ecoma. Organization quản lý thông tin cơ bản về tổ chức và danh sách các thành viên (người dùng) thuộc tổ chức đó.
  - **ID:** Unique identifier (UUID).
  - **Name:** Tên tổ chức (duy nhất).
  - **Slug:** Chuỗi (Value Object OrganizationSlug). **Ràng buộc:** Duy nhất trên toàn hệ thống, chỉ chứa ký tự hợp lệ cho subdomain (chữ thường, số, dấu gạch ngang), không bắt đầu/kết thúc bằng dấu gạch ngang.
  - **Status:** Trạng thái tổ chức (OrganizationStatus Value Object: Active, Suspended \- đồng bộ từ BUM).
  - **Country:** Quốc gia của tổ chức (liên kết với RDM). **Ràng buộc:** Không thể thay đổi sau khi Tổ chức được tạo.
  - **LogoAssetId:** **Optional** UUID. ID tham chiếu đến asset logo của tổ chức được lưu trữ trong DAM.
  - **Members:** Danh sách các thành viên (Membership Entities **trong phạm vi tổ chức này**).
  - **CreatedAt:** Thời điểm tạo.
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng.
  - _Behavior:_ AddMember, RemoveMember, UpdateMemberRole, Suspend, Activate, UpdateSettings.
- **Role:** Là Aggregate Root định nghĩa một vai trò trong hệ thống. Vai trò có thể là vai trò nội bộ Ecoma hoặc vai trò trong phạm vi một tổ chức khách hàng.
  - **ID:** Unique identifier (UUID).
  - **Name:** Tên vai trò (duy nhất trong phạm vi của nó).
  - **Description:** Mô tả vai trò.
  - **Scope:** Phạm vi của vai trò (RoleScope Value Object: Internal hoặc Organization).
  - **OrganizationId:** **Optional** UUID. **Nếu là null, vai trò này là vai trò nội bộ Ecoma.** Nếu có giá trị, vai trò này thuộc về tổ chức khách hàng tương ứng.
  - **Permissions:** Danh sách các quyền hạn (Permission Value Objects). **Chỉ chứa Permission có Scope tương ứng với Role Scope.**
  - **IsSystemRole:** Boolean chỉ định vai trò hệ thống (thường là các vai trò nội bộ Ecoma được định nghĩa sẵn, không thể chỉnh sửa bởi người dùng cuối).
  - **CreatedAt:** Thời điểm tạo.
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng.
  - _Behavior:_ AddPermission, RemovePermission, UpdateDetails.
- **PermissionDefinition:** Aggregate Root để định nghĩa các loại quyền hạn có sẵn và mối quan hệ cha-con.
  - **ID:** Unique identifier (UUID).
  - **Value:** Chuỗi định danh quyền hạn (ví dụ: "Product:View:Organization"). Phải duy nhất trên toàn hệ thống.
  - **Description:** Mô tả quyền hạn.
  - **Scope:** Phạm vi của quyền hạn (PermissionScope Value Object).
  - **ParentPermissionId:** **Optional** UUID. ID của quyền hạn cấp cao hơn mà quyền này thuộc về. Null nếu là quyền gốc.
  - **CreatedAt:** Thời điểm tạo.
  - _Behavior:_ DefineParentPermission.
- **Invitation:** Aggregate Root đại diện cho một lời mời người dùng tham gia vào một tổ chức khách hàng.
  - **ID:** Unique identifier (UUID).
  - **OrganizationId:** ID của tổ chức gửi lời mời.
  - **InviteeEmail:** Email của người được mời.
  - **InviterUserId:** ID của người gửi lời mời.
  - **RoleId:** ID của vai trò được gán khi chấp nhận lời mời (phải là vai trò có Scope \= Organization và thuộc OrganizationId này).
  - **Status:** Trạng thái lời mời (InvitationStatus Value Object: Pending, Accepted, Declined, Expired, Revoked).
  - **Token:** Token duy nhất để xác nhận lời mời.
  - **ExpiresAt:** Thời điểm hết hạn của lời mời.
  - **CreatedAt:** Thời điểm tạo.
  - _Behavior:_ Accept, Decline, Expire, Resend, Revoke.

**Entities (thuộc về các Aggregate Root):**

- **Membership (Entity độc lập liên kết User và phạm vi):** Membership đại diện cho mối quan hệ của người dùng với một phạm vi cụ thể (nội bộ hoặc tổ chức khách hàng).
  - **ID:** Unique identifier (UUID).
  - **UserId:** ID của người dùng.
  - **OrganizationId:** **Optional** UUID. **Nếu là null, đây là mối quan hệ của người dùng nội bộ Ecoma.** Nếu có giá trị, đây là mối quan hệ của người dùng với tổ chức khách hàng tương ứng.
  - **RoleId:** ID của vai trò được gán cho người dùng trong phạm vi này (phải là vai trò có Scope tương ứng với Membership Scope).
  - **JoinedAt:** Thời điểm người dùng bắt đầu mối quan hệ này (ví dụ: tham gia tổ chức hoặc được gán vai trò nội bộ).
  - _Behavior:_ ChangeRole.
- **Session (Entity độc lập, stateful):** Đại diện cho một phiên làm việc đã được xác thực của người dùng. Là Entity độc lập để dễ dàng quản lý vòng đời (tạo, hủy, tìm kiếm theo User). **Sử dụng Session Token stateful để hỗ trợ các tính năng quan trọng:**
  - **Vô hiệu hóa phiên từ xa tức thời**: Cho phép đăng xuất từ xa, khóa tài khoản hoặc revoke phiên cụ thể ngay lập tức.
  - **Cập nhật quyền theo thời gian thực**: Đảm bảo quyền hạn được cập nhật ngay khi vai trò của người dùng trong tổ chức thay đổi.
  - **Đồng bộ trạng thái tổ chức**: Cho phép áp dụng các thay đổi trạng thái tổ chức (ví dụ: Suspended) ngay lập tức cho tất cả người dùng.
  - **Quản lý đa phiên**: Hỗ trợ theo dõi và chấm dứt từng phiên làm việc cụ thể.
  - **ID:** Unique identifier (UUID).
  - **UserId:** ID người dùng.
  - **OrganizationId:** **Optional** UUID. ID tổ chức đang làm việc (ngữ cảnh hiện tại). Null nếu là phiên nội bộ.
  - **Token:** Chuỗi token xác thực. **Lưu trữ trong database để quản lý trạng thái và hỗ trợ vô hiệu hóa từ xa.**
  - **ExpiresAt:** Thời điểm hết hạn.
  - **CreatedAt:** Thời điểm tạo.
  - _Behavior:_ Terminate.
- **OrganizationSlug:** Đại diện cho slug của tổ chức.
  - **Value:** Chuỗi. **Ràng buộc:** Duy nhất, định dạng hợp lệ cho subdomain.

**Value Objects:**

- **EmailAddress:** Đại diện cho địa chỉ email.
  - **Value:** Chuỗi email. **Ràng buộc:** Phải là định dạng email hợp lệ.
- **Password:** Đại diện cho mật khẩu (trước khi hash).
  - **Value:** Chuỗi mật khẩu. **Ràng buộc:** Tuân thủ quy tắc độ mạnh mật khẩu (được định nghĩa ở lớp Application Service hoặc cấu hình).
- **UserProfile:** Thông tin hồ sơ cơ bản của người dùng.
  - **FirstName:** Chuỗi. **Ràng buộc:** Không rỗng.
  - **LastName:** Chuỗi. **Ràng buộc:** Không rỗng.
  - **Locale:** Mã locale/ngôn ngữ ưa thích. **Ràng buộc:** Phải là mã locale hợp lệ, liên kết với RDM/LZM để bản địa hóa.
- **Permission:** Đại diện cho một quyền hạn cụ thể.
  - **Value:** Chuỗi định danh quyền hạn (ví dụ: "Product:View:Organization"). **Ràng buộc:** Phải tồn tại trong danh sách các PermissionDefinition có sẵn.
- **RoleScope:** Đại diện cho phạm vi của Vai trò.
  - **Value:** Chuỗi hoặc Enum (Internal, Organization). **Ràng buộc:** Chỉ chấp nhận giá trị "Internal" hoặc "Organization".
- **PermissionScope:** Đại diện cho phạm vi của Quyền hạn.
  - **Value:** Chuỗi hoặc Enum (Internal, Organization). **Ràng buộc:** Chỉ chấp nhận giá trị "Internal" hoặc "Organization".
- **UserStatus:** Đại diện cho trạng thái của người dùng.
  - **Value:** Chuỗi hoặc Enum (Active, Inactive, Pending Confirmation, Password Reset Requested).
- **OrganizationStatus:** Đại diện cho trạng thái của tổ chức.
  - **Value:** Chuỗi hoặc Enum (Active, Suspended).
- **InvitationStatus:** Đại diện cho trạng thái của lời mời.
  - **Value:** Chuỗi hoặc Enum (Pending, Accepted, Declined, Expired, Revoked).
- **SubscriptionEntitlementDetails:** Thông tin về quyền lợi tính năng từ BUM (được sử dụng trong quá trình ủy quyền **phạm vi tổ chức**).
  - **FeatureType:** Loại tính năng (FeatureType Value Object từ BUM).
  - **ResourceType:** Loại tài nguyên (ResourceType Value Object từ BUM).
  - **Limit:** Hạn mức (UsageQuantity Value Object từ BUM).
  - **IsActive:** Trạng thái hoạt động của quyền lợi.
- **AuthenticationToken:** Đại diện cho token xác thực (ví dụ: Session Token).
  - **Value:** Chuỗi token.
  - **ExpiresAt:** Thời điểm hết hạn.
  - **IssuedAt:** Thời điểm phát hành.
  - **UserId:**
  - **TenantId:** **Optional** UUID. Nếu là null, token này cho phiên làm việc nội bộ.
  - **MembershipId:** ID của Membership tương ứng với phiên làm việc.
- **Session:** Đại diện cho phiên làm việc của người dùng.
  - **ID:** Unique identifier.
  - **UserId:** ID người dùng.
  - **OrganizationId:** **Optional** UUID. ID tổ chức đang làm việc (ngữ cảnh hiện tại). Null nếu là phiên nội bộ.
  - **ExpiresAt:** Thời điểm hết hạn.
  - **CreatedAt:** Thời điểm tạo.

## **5\. Ngôn ngữ Chung (Ubiquitous Language)**

Trong Bounded Context IAM, các thuật ngữ sau đây có ý nghĩa cụ thể và nhất quán:

- **User:** Một cá nhân có tài khoản trong hệ thống Ecoma.
- **Organization (Tenant):** Một doanh nghiệp hoặc nhóm sử dụng nền tảng Ecoma.
- **Membership:** Mối quan hệ giữa một User và một phạm vi (nội bộ hoặc tổ chức), xác định User đó thuộc về phạm vi nào và có vai trò gì trong phạm vi đó.
- **Internal Membership:** Mối quan hệ của người dùng với phạm vi nội bộ Ecoma (Membership.OrganizationId \= null).
- **Organization Membership:** Mối quan hệ của người dùng với một tổ chức khách hàng cụ thể (Membership.OrganizationId \!= null).
- **Role:** Một tập hợp các quyền hạn được đặt tên.
- **Internal Role:** Vai trò trong phạm vi nội bộ Ecoma (Role.OrganizationId \= null, Role.Scope \= Internal). Chỉ chứa Internal Permission.
- **Organization Role:** Vai trò trong phạm vi một tổ chức khách hàng (Role.OrganizationId \!= null, Role.Scope \= Organization). Chỉ chứa Organization Permission.
- **Permission:** Một quyền cụ thể để thực hiện một hành động trên một tài nguyên trong một phạm vi nhất định.
- **Internal Permission:** Quyền hạn chỉ áp dụng trong phạm vi nội bộ Ecoma (Permission.Scope \= Internal).
- **Organization Permission:** Quyền hạn chỉ áp dụng trong phạm vi một tổ chức khách hàng (Permission.Scope \= Organization).
- **Permission Hierarchy:** Cấu trúc phân cấp của các quyền hạn, trong đó quyền cấp cao hơn bao gồm các quyền con.
- **Entitlement:** Quyền lợi tính năng hoặc hạn mức sử dụng mà một Tổ chức khách hàng có được từ gói dịch vụ (được quản lý bởi BUM, nhưng IAM sử dụng để ủy quyền phạm vi tổ chức).
- **Authentication:** Quá trình xác minh danh tính người dùng (ví dụ: đăng nhập).
- **Authorization:** Quá trình kiểm tra xem người dùng có quyền thực hiện hành động hay không, trong ngữ cảnh phạm vi hiện tại, có tính đến phân cấp quyền hạn.
- **Session:** Một phiên làm việc đã được xác thực của người dùng.
- **Token:** Một chuỗi dữ liệu được sử dụng để xác thực và ủy quyền cho các yêu cầu tiếp theo, mang thông tin ngữ cảnh phạm vi.
- **Invitation:** Lời mời gửi đến một email để tham gia vào một Tổ chức khách hàng với một vai trò tổ chức cụ thể.
- **Owner:** Một vai trò tổ chức đặc biệt, thường có quyền quản lý cao nhất trong phạm vi tổ chức.
- **Password Reset Token:** Một chuỗi tạm thời được sử dụng để xác minh yêu cầu đặt lại mật khẩu.
- **Email Verification Token:** Một chuỗi tạm thời được sử dụng để xác minh địa chỉ email.
- **Slug:** Chuỗi định danh duy nhất của tổ chức dùng cho subdomain.

## **6\. Tương tác với các Bounded Context khác**

IAM là một dịch vụ nền tảng mà hầu hết các Bounded Context khác phụ thuộc vào để xác thực và ủy quyền, có tính đến ngữ cảnh phạm vi (nội bộ/tổ chức).

- **Tương tác với Core BCs:**
  - **BUM:** IAM phụ thuộc vào BUM để lấy thông tin về **Entitlement** của Tổ chức khách hàng và trạng thái Tổ chức (Active/Suspended). Khi một BC khác yêu cầu IAM kiểm tra quyền (Authorization) trong ngữ cảnh tổ chức, IAM không chỉ dựa vào Vai trò/Quyền hạn tổ chức mà còn kiểm tra xem gói dịch vụ của Tổ chức có cho phép tính năng đó không (Feature Entitlement), hành động đó có vượt quá hạn mức tài nguyên không (Resource Entitlement), và trạng thái Tổ chức có phải là Active không. **IAM lắng nghe các sự kiện từ BUM (ví dụ: SubscriptionActivated, SubscriptionPlanChanged, SubscriptionSuspended) để cập nhật thông tin Entitlement và trạng thái Tổ chức tương ứng (có thể cache lại để tăng tốc độ kiểm tra quyền). Ngoài ra, IAM cũng có thể có cơ chế kiểm tra định kỳ trạng thái Tổ chức từ BUM để đảm bảo tính nhất quán dữ liệu.**
  - **NDM:** IAM có thể yêu cầu NDM gửi thông báo trong các luồng nghiệp vụ như mời người dùng, xác nhận đăng ký, hoặc thông báo về các vấn đề bảo mật liên quan đến tài khoản, đặc biệt là các email/thông báo liên quan đến **xác minh email**, khôi phục tài khoản và đặt lại mật khẩu.
  - **LZM & RDM:** IAM cần LZM để bản địa hóa giao diện quản trị của chính nó và các thông báo gửi đi. IAM cần RDM để lấy dữ liệu tham chiếu như danh sách quốc gia (cho hồ sơ người dùng/tổ chức) hoặc các quy tắc định dạng locale (khi hiển thị thông tin). IAM lưu trữ locale/ngôn ngữ ưa thích của người dùng và cung cấp thông tin này cho các BC khác để bản địa hóa giao diện cho người dùng đó.
  - **ALM:** IAM phát ra các sự kiện audit log khi có các hành động quan trọng liên quan đến quản lý danh tính và truy cập (ví dụ: đăng ký người dùng mới, yêu cầu xác minh email, xác minh email thành công, đăng nhập thành công/thất bại, đăng xuất, thay đổi mật khẩu, yêu cầu đặt lại mật khẩu, đặt lại mật khẩu thành công, thay đổi vai trò, gửi/chấp nhận/thu hồi lời mời, thay đổi trạng thái tổ chức, xóa Owner, **cập nhật cài đặt tổ chức**).
- **Tương tác với Feature BCs:**
  - **DAM:** IAM tham chiếu đến DAM để lưu trữ và quản lý asset logo của tổ chức.
  - **Tất cả các Feature BC:** Các Feature BC là người dùng chính của dịch vụ Xác thực và Ủy quyền của IAM. Khi nhận một yêu cầu từ Client (qua API Gateway), Feature BC sẽ gọi IAM (thường qua API Gateway) để xác thực token và kiểm tra quyền của người dùng thực hiện yêu cầu đó trong ngữ cảnh được xác định bởi token (phạm vi nội bộ hoặc tổ chức).

## **7\. Các Khía cạnh Quan trọng của Miền IAM**

Phần này mô tả các cấu trúc, quy tắc và khái niệm nghiệp vụ quan trọng chi phối hoạt động của Bounded Context IAM.

### **7.1. Hệ thống Quyền hạn Phân cấp (Permission Hierarchy)**

Hệ thống quyền hạn trong IAM được cấu trúc theo dạng cây phân cấp. Một quyền hạn cấp cao hơn (Parent Permission) có thể bao gồm một hoặc nhiều quyền hạn cấp thấp hơn (Child Permission). Khi một Vai trò được gán một quyền hạn cấp cao, người dùng có vai trò đó sẽ tự động có tất cả các quyền hạn con cháu của quyền hạn cấp cao đó.

Ví dụ:

- Quyền "Product:Manage:Organization" (quản lý sản phẩm trong tổ chức) có thể bao gồm các quyền con:
  - "Product:View:Organization" (xem sản phẩm)
  - "Product:Create:Organization" (tạo sản phẩm)
  - "Product:Update:Organization" (cập nhật sản phẩm)
  - "Product:Delete:Organization" (xóa sản phẩm)
- Khi một Vai trò được gán quyền "Product:Manage:Organization", người dùng có vai trò đó sẽ tự động có các quyền xem, tạo, cập nhật, xóa sản phẩm trong tổ chức đó.

Cấu trúc phân cấp này được định nghĩa và quản lý thông qua PermissionDefinition Aggregate Root. **Để đảm bảo hiệu năng, tập hợp đầy đủ các quyền hạn hiệu quả cho mỗi vai trò sẽ được tính toán trước và lưu trữ/cache khi vai trò hoặc định nghĩa quyền thay đổi. Logic kiểm tra quyền trong AuthorizationService sẽ sử dụng dữ liệu cache này.**

### **7.2. Vòng đời Trạng thái User và Organization**

Dưới đây là biểu đồ trạng thái (State Machine Diagram) cho User và Organization Status:

stateDiagram-v2  
 \[\*\] \--\> PendingConfirmation: Đăng ký mới (nếu có bước xác nhận email)  
 PendingConfirmation \--\> Active: Xác nhận email thành công  
 PendingConfirmation \--\> \[\*\]: Hết hạn xác nhận / Bị từ chối  
 Active \--\> Inactive: Bị vô hiệu hóa bởi Admin  
 Inactive \--\> Active: Được kích hoạt lại bởi Admin  
 Active \--\> PasswordResetRequested: Yêu cầu đặt lại mật khẩu  
 PasswordResetRequested \--\> Active: Đặt lại mật khẩu thành công  
 PasswordResetRequested \--\> \[\*\]: Token hết hạn / Bị hủy  
 Active \--\> \[\*\]: Bị xóa  
 Inactive \--\> \[\*\]: Bị xóa

- **PendingConfirmation:** Người dùng đã đăng ký nhưng cần xác nhận email.
- **Active:** Người dùng hoạt động bình thường, có thể đăng nhập và sử dụng hệ thống (tùy thuộc vào Membership và trạng thái Tổ chức).
- **Inactive:** Người dùng bị vô hiệu hóa, không thể đăng nhập.
- **PasswordResetRequested:** Người dùng đã yêu cầu đặt lại mật khẩu và đang chờ sử dụng token.
- **\[\*\]:** Trạng thái kết thúc (người dùng bị xóa khỏi hệ thống).

**Organization Status:**

stateDiagram-v2  
\[\*\] \--\> Active: Tạo tổ chức mới  
Active \--\> Suspended: Bị tạm ngưng (do BUM thông báo hết hạn gói trả phí và quá thời gian Data Retention)  
Suspended \--\> Active: Gia hạn gói thành công (trong thời gian Data Retention)  
Suspended \--\> \[\*\]: Dữ liệu bị xóa (sau khi BUM thông báo)

- **Active:** Tổ chức hoạt động bình thường, thành viên có thể sử dụng hệ thống (tùy Subscription và quyền hạn).
- **Suspended:** Tổ chức bị tạm ngưng do hết hạn gói trả phí và không gia hạn trong thời gian Data Retention. Thành viên không thể truy cập hầu hết các tính năng (trừ billing).
- **\[\*\]:** Trạng thái kết thúc (dữ liệu tổ chức bị xóa khỏi hệ thống).

### **7.3. Kết hợp Quyền hạn (Permission Combination)**

Khi kiểm tra quyền cho một hành động cụ thể, IAM cần xác định xem người dùng có quyền thực hiện hành động đó trong ngữ cảnh hiện tại hay không. Logic kết hợp quyền như sau:

1. **Xác định ngữ cảnh:** Dựa vào Token, xác định User ID và ngữ cảnh làm việc (TenantId \- có thể null, MembershipId).
2. **Lấy Vai trò:** Dựa vào MembershipId, lấy Vai trò (Role) được gán cho người dùng trong ngữ cảnh đó.
3. **Lấy tất cả Quyền hạn hiệu quả:** Sử dụng tập hợp quyền hạn hiệu quả đã được tính toán trước và cache cho Vai trò đó (xem mục 7.1).
4. **Kiểm tra Quyền yêu cầu:** Kiểm tra xem requiredPermissionValue có nằm trong danh sách các quyền hạn hiệu quả đã lấy được hay không.
5. **Kiểm tra Ngữ cảnh và Entitlement (chỉ cho phạm vi Tổ chức):**
   - Nếu requiredPermissionValue.Scope là Organization và tenantId không null: Kiểm tra trạng thái Organization (không Suspended) VÀ kiểm tra thông tin Entitlement đã được cache (đồng bộ từ BUM) cho Tổ chức đó.
   - Nếu requiredPermissionValue.Scope là Internal và tenantId null: Không cần kiểm tra trạng thái Tổ chức hay Entitlement.
6. **Kết quả cuối cùng:** Quyền được cho phép (Allowed) chỉ khi TẤT CẢ các kiểm tra liên quan đều Passed. Nếu bất kỳ kiểm tra nào Failed, quyền sẽ bị từ chối (Denied).

### **7.4. Các Quy tắc Nghiệp vụ cho Trường hợp Edge Case**

- **Chấp nhận lời mời khi đã có tài khoản và là thành viên của tổ chức:**
  - Nếu người được mời đã có tài khoản User: Không tạo User mới.
  - Nếu người được mời đã là thành viên của tổ chức được mời: Kiểm tra vai trò hiện tại của họ. Nếu vai trò được mời trong lời mời có quyền cao hơn vai trò hiện tại, cập nhật Organization Membership của họ với vai trò mới và phát sự kiện UserRoleInOrganizationChanged. Nếu vai trò được mời không cao hơn, từ chối lời mời với lý do "Đã là thành viên với vai trò tương đương hoặc cao hơn".
  - **Chi tiết luồng xử lý cho use case "Chấp nhận Lời mời Tham gia Tổ chức", bao gồm các nhánh rẽ cho từng trường hợp (người dùng mới, người dùng đã tồn tại, người dùng đã là thành viên với vai trò thấp hơn/cao hơn/bằng), các bước tương tác UI và thông báo/lỗi tương ứng, sẽ được làm rõ đầy đủ trong tài liệu thiết kế kỹ thuật.**
- **Xóa Owner:** Các quy tắc đã nêu (người xóa phải là Owner, tham gia tổ chức ít nhất 7 ngày, không xóa Owner cuối cùng) là bắt buộc. **Chi tiết triển khai các điều kiện kiểm tra này trong code và các thông báo lỗi cụ thể cần được đặc tả rõ ràng trong tài liệu thiết kế kỹ thuật.**
- **Đặt lại mật khẩu:** Token đặt lại mật khẩu phải có thời hạn (ví dụ: 1 giờ) và chỉ có thể sử dụng một lần. Sau khi sử dụng hoặc hết hạn, token trở nên vô hiệu. **Việc lưu trữ token kèm trạng thái trong database là phương án được chọn để đảm bảo tính duy nhất và xử lý vòng đời.**
- **Xác minh Email:** Token xác minh email phải có thời hạn (ví dụ: 24 giờ) và chỉ có thể sử dụng một lần. Sau khi sử dụng hoặc hết hạn, token trở nên vô hiệu. **Việc lưu trữ token kèm trạng thái trong database là phương án được chọn để đảm bảo tính duy nhất và xử lý vòng đời.**
- **Thu hồi Lời mời:** Chỉ có thể thu hồi lời mời đang ở trạng thái Pending.

### **7.5. Định nghĩa các System Role và Permission Mặc định (Cấp cao)**

Đây là các Vai trò và Quyền hạn nội bộ Ecoma được định nghĩa sẵn:

- **Internal Role: Super Admin**
  - **Scope:** Internal
  - **Permissions (ví dụ):** Tenant:Manage:Internal, User:Manage:Internal, Role:Manage:Internal, Permission:Manage:Internal, System:Monitor:Internal, System:Configure:Internal. (Có toàn quyền quản lý hệ thống Ecoma và các tổ chức khách hàng).
- **Internal Role: Support Agent**
  - **Scope:** Internal
  - **Permissions (ví dụ):** Tenant:View:Internal, User:View:Internal, OrganizationData:View:Internal (quyền xem dữ liệu của tổ chức khách hàng cho mục đích hỗ trợ), System:ViewLogs:Internal. (Có quyền xem thông tin để hỗ trợ khách hàng nhưng không có quyền cấu hình hay quản lý).

Đây là các Vai trò và Quyền hạn tổ chức mặc định:

- **Organization Role: Owner**
  - **Scope:** Organization
  - **Permissions (ví dụ):** Organization:Manage:Organization, Member:Manage:Organization, Role:Manage:Organization (trong phạm vi tổ chức), Billing:Manage:Organization, Subscription:Manage:Organization, \[Tất cả các quyền "Manage" trong phạm vi Tổ chức cho các Feature BC như Product:Manage:Organization, Order:Manage:Organization, v.v.\]. (Có quyền quản lý cao nhất trong phạm vi tổ chức của mình).
- **Organization Role: Admin**
  - **Scope:** Organization
  - **Permissions (ví dụ):** Member:Manage:Organization (trừ Owner), Role:Manage:Organization (trừ vai trò Owner), \[Các quyền "Manage" trong phạm vi Tổ chức cho các Feature BC tùy theo gói dịch vụ và cấu hình\]. (Có quyền quản lý trong phạm vi tổ chức nhưng thấp hơn Owner).
- **Organization Role: Member**
  - **Scope:** Organization
  - **Permissions (ví dụ):** \[Các quyền "View", "Create", "Update" trong phạm vi Tổ chức cho các Feature BC tùy theo gói dịch vụ và cấu hình\]. (Có quyền sử dụng các tính năng nghiệp vụ).
- **Organization Role: Viewer**
  - **Scope:** Organization
  - **Permissions (ví dụ):** \[Các quyền "View" trong phạm vi Tổ chức cho các Feature BC\]. (Chỉ có quyền xem dữ liệu).

Các danh sách Permission cụ thể sẽ được định nghĩa chi tiết hơn trong quá trình thiết kế kỹ thuật.

## **8\. Use cases theo Phạm vi**

Dưới đây là mô tả các use cases chính có sự tham gia của IAM, được tổ chức theo các nhóm phạm vi tương tác chính, tập trung vào actor, mục đích và các service liên quan:

### **8.1. Phạm vi Người dùng (User Scope)**

Các use case trong nhóm này chủ yếu liên quan đến việc quản lý tài khoản cá nhân của người dùng, không nhất thiết phải trong ngữ cảnh của một tổ chức cụ thể.

- **Use case: Đăng ký Người dùng Mới**
  - **Actor:** Người dùng mới, Hệ thống.
  - **Mục đích:** Cho phép một cá nhân tạo tài khoản người dùng duy nhất trong hệ thống Ecoma và khởi tạo quy trình xác minh email.
  - **Service liên quan:** Được xử lý bởi UserApplicationService. Sử dụng UserService để tạo User. Yêu cầu NDM gửi email xác minh.
- **Use case: Khôi phục tài khoản và đặt lại mật khẩu**
  - **Actor:** Người dùng, Hệ thống.
  - **Mục đích:** Cho phép người dùng khôi phục quyền truy cập vào tài khoản của họ bằng cách yêu cầu đặt lại mật khẩu thông qua quy trình xác minh (ví dụ: qua email).
  - **Service liên quan:** Được xử lý bởi UserApplicationService. Sử dụng UserService để khởi tạo và hoàn tất quy trình đặt lại mật khẩu. Yêu cầu NDM gửi email.
- **Use case: Xác minh Email**
  - **Actor:** Người dùng, Hệ thống.
  - **Mục đích:** Xác nhận địa chỉ email của người dùng là hợp lệ và thuộc về họ, thường là một bước sau khi đăng ký.
  - **Service liên quan:** Được xử lý bởi UserApplicationService. Sử dụng UserService để xác minh email.
- **Use case: Đăng xuất**
  - **Actor:** Người dùng, Hệ thống.
  - **Mục đích:** Chấm dứt phiên làm việc hiện tại của người dùng, vô hiệu hóa token xác thực tương ứng.
  - **Service liên quan:** Được xử lý bởi AuthenticationApplicationService. Sử dụng AuthenticationService để vô hiệu hóa Session.
- **Use case: Quản lý Phiên làm việc (bao gồm Đăng xuất từ xa)**
  - **Actor:** Người dùng, Hệ thống.
  - **Mục đích:** Cho phép người dùng xem danh sách các phiên làm việc đang hoạt động của họ và có khả năng chấm dứt (đăng xuất) các phiên đó từ xa.
  - **Service liên quan:** Được xử lý bởi AuthenticationApplicationService. Sử dụng AuthenticationService để truy vấn và chấm dứt Session.
- _(Các use case cập nhật thông tin hồ sơ User nếu có)_

### **8.2. Phạm vi Tổ chức (Organization Scope)**

Các use case trong nhóm này liên quan đến tương tác của người dùng trong ngữ cảnh của một tổ chức khách hàng cụ thể.

- **Use case: Tạo Tổ chức Mới**
  - **Actor:** Người dùng hiện tại (có thể là người dùng mới vừa đăng ký hoặc người dùng đã tồn tại), Hệ thống.
  - **Mục đích:** Cho phép người dùng tạo một tổ chức khách hàng mới trong hệ thống Ecoma và tự động gán vai trò Owner cho người dùng tạo.
  - **Service liên quan:** Được xử lý bởi OrganizationApplicationService. Sử dụng OrganizationService để tạo Organization và Membership ban đầu cho người dùng tạo.
- **Use case: Đăng nhập và Tạo Phiên làm việc/Token (Phạm vi Tổ chức)**
  - **Actor:** Người dùng khách hàng, Hệ thống.
  - **Mục đích:** Xác thực danh tính người dùng dựa trên thông tin đăng nhập và tạo một phiên làm việc (session) hoặc token xác thực cho phép họ truy cập hệ thống trong ngữ cảnh của một tổ chức khách hàng cụ thể.
  - **Service liên quan:** Được xử lý bởi AuthenticationApplicationService. Sử dụng AuthenticationService để xác thực và tạo Session/Token.
- **Use case: Kiểm tra Quyền truy cập (Authorization Flow \- Phạm vi Tổ chức)**
  - **Actor:** Các Bounded Context khác, Hệ thống.
  - **Mục đích:** Cung cấp dịch vụ cho các BC khác để kiểm tra xem người dùng trong một phiên làm việc cụ thể có quyền thực hiện một hành động hoặc truy cập một tài nguyên nhất định trong phạm vi tổ chức hay không, dựa trên vai trò, quyền hạn (có phân cấp) và quyền lợi tính năng (entitlement) của tổ chức.
  - **Service liên quan:** Được xử lý bởi AuthorizationApplicationService. Sử dụng AuthorizationService để thực hiện logic kiểm tra quyền, có thể sử dụng thông tin Entitlement đã được cache từ BUM.
- **Use case: Mời Người dùng Tham gia Tổ chức**
  - **Actor:** Người dùng hiện tại trong tổ chức (có quyền mời), Hệ thống, Người dùng được mời.
  - **Mục đích:** Cho phép người dùng hiện tại mời người khác tham gia vào tổ chức của họ với một vai trò cụ thể, và gửi thông báo lời mời đến người được mời.
  - **Service liên quan:** Được xử lý bởi InvitationApplicationService. Sử dụng InvitationService để tạo và quản lý Invitation. Yêu cầu NDM gửi email. Có thể sử dụng AuthorizationService để kiểm tra quyền của người mời.
- **Use case: Chấp nhận Lời mời Tham gia Tổ chức**
  - **Actor:** Người dùng được mời, Hệ thống.
  - **Mục đích:** Cho phép người dùng được mời chấp nhận lời mời tham gia vào một tổ chức, tạo mối quan hệ thành viên (membership) cho họ trong tổ chức đó.
  - **Service liên quan:** Được xử lý bởi InvitationApplicationService. Sử dụng InvitationService để xử lý việc chấp nhận. Sử dụng UserService để kiểm tra/tạo User và MembershipService (hoặc OrganizationService) để tạo Membership. **Chi tiết luồng xử lý cho các trường hợp đặc biệt (người dùng đã tồn tại, đã là thành viên, v.v.) và các tương tác UI sẽ được làm rõ trong tài liệu thiết kế kỹ thuật.**
- **Use case: Quản lý Thành viên Tổ chức và Quy tắc Xóa Owner**
  - **Actor:** Người dùng hiện tại trong tổ chức (có quyền quản lý thành viên), Hệ thống.
  - **Mục đích:** Cho phép người dùng quản lý danh sách thành viên trong tổ chức của họ (ví dụ: xóa thành viên, thay đổi vai trò), tuân thủ các quy tắc nghiệp vụ đặc thù (ví dụ: quy tắc quản lý Owner).
  - **Service liên quan:** Được xử lý bởi OrganizationApplicationService hoặc MembershipApplicationService. Sử dụng OrganizationService hoặc MembershipService để thực hiện các thao tác quản lý thành viên. Sử dụng AuthorizationService để kiểm tra quyền của người thực hiện. **Chi tiết triển khai các quy tắc nghiệp vụ cho việc quản lý Owner (ví dụ: không xóa Owner cuối cùng, yêu cầu 7 ngày thành viên) và các thông báo lỗi tương ứng sẽ được đặc tả rõ ràng trong tài liệu thiết kế kỹ thuật.**
- **Use case: Cập nhật Cài đặt Tổ chức liên quan đến IAM**
  - **Actor:** Người dùng hiện tại trong tổ chức (có quyền quản lý cài đặt), Hệ thống.
  - **Mục đích:** Cho phép người dùng cập nhật các cài đặt liên quan đến IAM trong phạm vi tổ chức của họ (ví dụ: tên tổ chức, logo, quy tắc mời), tuân thủ các quy tắc quyền hạn (ví dụ: chỉ Owner được cập nhật).
  - **Service liên quan:** Được xử lý bởi OrganizationApplicationService. Sử dụng OrganizationService để cập nhật cài đặt. Sử dụng AuthorizationService để kiểm tra quyền của người thực hiện.
- **Use case: Thu hồi Lời mời**
  - **Actor:** Người dùng hiện tại trong tổ chức (có quyền quản lý lời mời), Hệ thống.
  - **Mục đích:** Cho phép người dùng thu hồi một lời mời đã gửi trước đó mà người được mời chưa chấp nhận.
  - **Service liên quan:** Được xử lý bởi InvitationApplicationService. Sử dụng InvitationService để thu hồi Invitation. Sử dụng AuthorizationService để kiểm tra quyền của người thực hiện.
- _(Các use case quản lý Vai trò và Quyền hạn trong phạm vi Tổ chức nếu có)_

### **8.3. Core Scope**

Các use case trong nhóm này là nền tảng hoặc được sử dụng bởi các BC khác, không nhất thiết phải gắn trực tiếp với hành động của người dùng cuối trong một phạm vi cụ thể, hoặc có thể áp dụng cho cả hai phạm vi.

- **Use case: Đăng nhập và Tạo Phiên làm việc/Token (Phạm vi Nội bộ)**
  - **Actor:** Người dùng nội bộ Ecoma, Hệ thống.
  - **Mục đích:** Xác thực danh tính người dùng nội bộ Ecoma và tạo một phiên làm việc (session) hoặc token xác thực cho phép họ truy cập các chức năng quản trị nội bộ.
  - **Service liên quan:** Được xử lý bởi AuthenticationApplicationService. Sử dụng AuthenticationService để xác thực và tạo Session/Token.
- **Use case: Kiểm tra Quyền truy cập (Authorization Flow \- Phạm vi Nội bộ)**
  - **Actor:** Các Bounded Context khác, Hệ thống.
  - **Mục đích:** Cung cấp dịch vụ cho các BC khác để kiểm tra xem người dùng nội bộ trong một phiên làm việc cụ thể có quyền thực hiện một hành động hoặc truy cập một tài nguyên nhất định trong phạm vi nội bộ Ecoma hay không, dựa trên vai trò và quyền hạn (có phân cấp).
  - **Service liên quan:** Được xử lý bởi AuthorizationApplicationService. Sử dụng AuthorizationService để thực hiện logic kiểm tra quyền.
- _(Các use case quản lý Vai trò và Quyền hạn trong phạm vi Nội bộ Ecoma nếu có)_
- _(Các use case nội bộ khác như tạo User nội bộ nếu có)_
- _(Các use case lắng nghe event từ BUM để cập nhật trạng thái Tổ chức hoặc Entitlement)_

## **9\. Domain Services**

Domain Services trong IAM chứa logic nghiệp vụ quan trọng không thuộc về một Aggregate Root cụ thể hoặc cần phối hợp nhiều Aggregate Root, có tính đến sự phân biệt phạm vi và cấu trúc quyền hạn.

- **AuthenticationService:**
  - **Trách nhiệm:** Xử lý quy trình đăng nhập, xác minh thông tin xác thực, tạo và quản lý Token/Session, có tính đến ngữ cảnh phạm vi (nội bộ/tổ chức). **Sử dụng Session Token stateful để cho phép vô hiệu hóa phiên từ xa tức thời và đảm bảo quyền hạn luôn được cập nhật mới nhất. Điều này đặc biệt quan trọng khi role/quyền hạn người dùng thay đổi hoặc khi tổ chức bị tạm ngưng.**
- **AuthorizationService:**
  - **Trách nhiệm:** Kiểm tra quyền của người dùng dựa trên Vai trò (phạm vi tương ứng), Quyền hạn (phạm vi tương ứng và có tính đến phân cấp) và Entitlement từ BUM (chỉ cho phạm vi tổ chức). **Sử dụng tập hợp quyền hạn hiệu quả đã được tính toán và cache trước.**
- **OrganizationService:**
  - **Trách nhiệm:** Quản lý vòng đời của Organization, thêm/xóa/cập nhật thành viên (Membership), cập nhật cài đặt tổ chức liên quan đến IAM. Bao gồm logic nghiệp vụ quản lý Owner. **Lắng nghe event từ BUM và thực hiện kiểm tra định kỳ để đồng bộ trạng thái Tổ chức.**
- **UserService:**
  - **Trách nhiệm:** Quản lý vòng đời của User, đăng ký, cập nhật hồ sơ, xử lý yêu cầu khôi phục tài khoản/đặt lại mật khẩu, xử lý xác minh email. **Quản lý Password Reset Token và Email Verification Token bằng cách lưu trữ kèm trạng thái trong database.**
- **RoleService:**
  - **Trách nhiệm:** Quản lý vòng đời của Role, gán/bỏ gán quyền hạn, có tính đến phạm vi Role/Permission.
- **PermissionDefinitionService:**
  - **Trách nhiệm:** Quản lý định nghĩa các loại quyền hạn có sẵn và cấu trúc phân cấp của chúng.
- **InvitationService:**
  - **Trách nhiệm:** Quản lý vòng đời của Invitation, gửi lời mời, chấp nhận lời mời, thu hồi lời mời.
- **MembershipService:**
  - **Trách nhiệm:** Quản lý các mối quan hệ Membership (nội bộ và tổ chức).

## **10\. Application Services**

Application Services trong IAM là lớp mỏng điều phối các hành động từ bên ngoài (ví dụ: từ API Gateway, Message Broker) đến Domain Model (Aggregate Roots, Domain Services). Chúng đại diện cho các trường hợp sử dụng (use case) và xử lý các tác vụ kỹ thuật như xác thực command, giao dịch cơ sở dữ liệu, và phát sự kiện.

- **UserApplicationService:**
  - **Trách nhiệm:** Xử lý các command/query liên quan đến người dùng từ bên ngoài (ví dụ: đăng ký, cập nhật hồ sơ, xác minh email, khôi phục/đặt lại mật khẩu). Điều phối việc quản lý token đặt lại mật khẩu/xác minh email thông qua UserService.
- **AuthenticationApplicationService:**
  - **Trách nhiệm:** Xử lý các command/query liên quan đến xác thực và quản lý phiên làm việc (ví dụ: đăng nhập, đăng xuất, quản lý phiên). Điều phối việc tạo và quản lý Session Token stateful thông qua AuthenticationService.
- **AuthorizationApplicationService:**
  - **Trách nhiệm:** Cung cấp API cho các BC khác gọi đến để kiểm tra quyền. Điều phối việc kiểm tra quyền thông qua AuthorizationService.
- **OrganizationApplicationService:**
  - **Trách nhiệm:** Xử lý các command/query liên quan đến tổ chức và thành viên (ví dụ: tạo tổ chức, quản lý thành viên, cập nhật cài đặt tổ chức). Lắng nghe event từ BUM và thực hiện kiểm tra định kỳ để cập nhật trạng thái tổ chức thông qua OrganizationService.
- **RoleApplicationService:**
  - **Trách nhiệm:** Xử lý các command/query liên quan đến quản lý vai trò.
- **PermissionDefinitionApplicationService:**
  - **Trách nhiệm:** Xử lý các command/query liên quan đến quản lý định nghĩa quyền hạn.
- **InvitationApplicationService:**
  - **Trách nhiệm:** Xử lý các command/query liên quan đến lời mời tham gia tổ chức. Điều phối logic chấp nhận lời mời thông qua InvitationService, bao gồm xử lý các trường hợp đặc biệt.
- **ScheduledTasksApplicationService:**
  - **Trách nhiệm:** Chạy các tác vụ định kỳ, bao gồm kiểm tra định kỳ trạng thái Tổ chức từ BUM để đồng bộ dữ liệu nếu cần.

## **11\. Domain Events**

Bounded Context IAM tương tác với các Bounded Context khác thông qua việc phát ra và lắng nghe các Domain Event. Dưới đây là danh sách các event mà IAM phát ra và lắng nghe, bao gồm payload dự kiến của chúng:

### **11.1. Domain Events (IAM Phát ra)**

IAM sẽ phát ra các Domain Event quan trọng để thông báo cho các Bounded Context khác về những thay đổi trạng thái nghiệp vụ trong phạm vi của nó. Dưới đây là danh sách các event và payload dự kiến của chúng:

- **UserRegistered**
  - Phát ra khi người dùng mới đăng ký thành công (trạng thái Pending Confirmation).
  - **Payload:**
    - UserId (UUID)
    - Email (String)
    - Profile (Object: FirstName, LastName, Locale)
    - IssuedAt (DateTime \- thời điểm event được phát ra)
- **EmailVerificationInitiated**
  - Phát ra khi yêu cầu xác minh email được gửi đi.
  - **Payload:**
    - UserId (UUID)
    - Email (String)
    - IssuedAt (DateTime)
- **EmailVerified**
  - Phát ra khi email người dùng được xác minh thành công và trạng thái chuyển sang Active.
  - **Payload:**
    - UserId (UUID)
    - Email (String)
    - IssuedAt (DateTime)
- **OrganizationCreated**
  - Phát ra khi một tổ chức khách hàng mới được tạo.
  - **Payload:**
    - TenantId (UUID)
    - Name (String)
    - Slug (String)
    - OwnerUserId (UUID)
    - IssuedAt (DateTime)
- **UserJoinedOrganization**
  - Phát ra khi người dùng tham gia vào một tổ chức khách hàng (qua lời mời hoặc tạo tổ chức).
  - **Payload:**
    - UserId (UUID)
    - TenantId (UUID)
    - RoleId (UUID)
    - JoinedAt (DateTime)
    - IssuedAt (DateTime)
- **UserRoleInOrganizationChanged**
  - Phát ra khi vai trò của người dùng trong tổ chức khách hàng thay đổi.
  - **Payload:**
    - UserId (UUID)
    - TenantId (UUID)
    - OldRoleId (UUID)
    - NewRoleId (UUID)
    - IssuedAt (DateTime)
- **UserRemovedFromOrganization**
  - Phát ra khi người dùng bị xóa khỏi tổ chức khách hàng.
  - **Payload:**
    - UserId (UUID)
    - TenantId (UUID)
    - IssuedAt (DateTime)
- **OrganizationStatusChanged**
  - Phát ra khi trạng thái của tổ chức khách hàng thay đổi (ví dụ: từ Active sang Suspended, có thể do BUM).
  - **Payload:**
    - TenantId (UUID)
    - OldStatus (String)
    - NewStatus (String)
    - IssuedAt (DateTime)
- **OrganizationSettingsUpdated**
  - Phát ra khi cài đặt tổ chức liên quan đến IAM được cập nhật.
  - **Payload:**
    - TenantId (UUID)
    - DetailsOfChanges (Object)
    - IssuedAt (DateTime)
- **RoleCreated**
  - Phát ra khi một vai trò mới được tạo (nội bộ hoặc tổ chức).
  - **Payload:**
    - RoleId (UUID)
    - Name (String)
    - Scope (String: "Internal" or "Organization")
    - OrganizationId (UUID, optional)
    - IssuedAt (DateTime)
- **PermissionAddedToRole**
  - Phát ra khi quyền hạn được thêm vào vai trò.
  - **Payload:**
    - RoleId (UUID)
    - PermissionValue (String)
    - IssuedAt (DateTime)
- **PermissionRemovedFromRole**
  - Phát ra khi quyền hạn bị xóa khỏi vai trò.
  - **Payload:**
    - RoleId (UUID)
    - PermissionValue (String)
    - IssuedAt (DateTime)
- **PermissionDefinitionCreated**
  - Phát ra khi một định nghĩa quyền hạn mới được tạo.
  - **Payload:**
    - PermissionValue (String)
    - Description (String)
    - Scope (String: "Internal" or "Organization")
    - ParentPermissionId (UUID, optional)
    - IssuedAt (DateTime)
- **InvitationCreated**
  - Phát ra khi lời mời được tạo.
  - **Payload:**
    - InvitationId (UUID)
    - TenantId (UUID)
    - InviteeEmail (String)
    - InviterUserId (UUID)
    - RoleId (UUID)
    - IssuedAt (DateTime)
- **InvitationAccepted**
  - Phát ra khi lời mời được chấp nhận.
  - **Payload:**
    - InvitationId (UUID)
    - TenantId (UUID)
    - InviteeEmail (String)
    - AcceptedUserId (UUID)
    - IssuedAt (DateTime)
- **InvitationRevoked**
  - Phát ra khi lời mời bị thu hồi.
  - **Payload:**
    - InvitationId (UUID)
    - TenantId (UUID)
    - InviteeEmail (String)
    - IssuedAt (DateTime)
- **InternalUserCreated**
  - Phát ra khi một người dùng nội bộ Ecoma được tạo (nếu có luồng riêng).
  - **Payload:**
    - UserId (UUID)
    - Email (String)
    - Profile (Object: FirstName, LastName, Locale)
    - IssuedAt (DateTime)
- **InternalUserRoleChanged**
  - Phát ra khi vai trò nội bộ của người dùng Ecoma thay đổi.
  - **Payload:**
    - UserId (UUID)
    - OldRoleId (UUID)
    - NewRoleId (UUID)
    - IssuedAt (DateTime)
- **PasswordResetInitiated**
  - Phát ra khi yêu cầu đặt lại mật khẩu được khởi tạo thành công.
  - **Payload:**
    - UserId (UUID)
    - Email (String)
    - IssuedAt (DateTime)
- **PasswordResetSuccessful**
  - Phát ra khi mật khẩu được đặt lại thành công.
  - **Payload:**
    - UserId (UUID)
    - Email (String)
    - IssuedAt (DateTime)
- **UserLoggedIn**
  - Phát ra khi người dùng đăng nhập thành công.
  - **Payload:**
    - UserId (UUID)
    - SessionId (UUID)
    - TenantId (UUID, optional)
    - IssuedAt (DateTime)
- **UserLoggedOut**
  - Phát ra khi người dùng đăng xuất khỏi một phiên cụ thể.
  - **Payload:**
    - UserId (UUID)
    - SessionId (UUID)
    - IssuedAt (DateTime)
- **SessionTerminated**
  - Phát ra khi một hoặc nhiều phiên làm việc bị chấm dứt (bao gồm cả đăng xuất từ xa).
  - **Payload:**
    - UserId (UUID)
    - ListOfSessionIds (List of UUID)
    - IssuedAt (DateTime)

### **11.2. Domain Events Được Xử lý (Consumed Domain Events)**

IAM lắng nghe và xử lý các Domain Event từ các Bounded Context khác để thực hiện các nghiệp vụ hoặc cập nhật trạng thái nội bộ. Dưới đây là danh sách các event mà IAM xử lý và payload dự kiến của chúng:

- **SubscriptionActivated** (Từ BUM)
  - Phát ra khi một Subscription được kích hoạt thành công (bao gồm cả gói Free và gói trả phí sau thanh toán).
  - **Mục đích xử lý:** IAM lắng nghe event này để cập nhật thông tin Entitlement và trạng thái Tổ chức (sang Active) cho Tổ chức tương ứng (có thể cache lại).
  - **Payload dự kiến:**
    - SubscriptionId (UUID)
    - TenantId (UUID)
    - PricingPlanId (UUID)
    - StartDate (DateTime)
    - EndDate (DateTime)
    - FeatureEntitlements (List of Entitlement details: ResourceType/FeatureType, Limit)
    - IssuedAt (DateTime)
- **SubscriptionPlanChanged** (Từ BUM)
  - Phát ra khi một Tổ chức chuyển đổi giữa các gói (bao gồm cả từ Free lên trả phí).
  - **Mục đích xử lý:** IAM lắng nghe event này để cập nhật thông tin Entitlement mới cho Tổ chức.
  - **Payload dự kiến:**
    - SubscriptionId (UUID)
    - TenantId (UUID)
    - OldPricingPlanId (UUID)
    - NewPricingPlanId (UUID)
    - NewFeatureEntitlements (List of Entitlement details: ResourceType/FeatureType, Limit)
    - TransactionId (UUID, nếu có giao dịch liên quan)
    - IssuedAt (DateTime)
- **SubscriptionSuspended** (Từ BUM)
  - Phát ra khi một Subscription bị tạm ngưng (do hết hạn).
  - **Mục đích xử lý:** IAM lắng nghe để đánh dấu Tổ chức là Suspended và từ chối hầu hết các yêu cầu kiểm tra quyền trong ngữ cảnh tổ chức cho tổ chức đó.
  - **Payload dự kiến:**
    - SubscriptionId (UUID)
    - TenantId (UUID)
    - SuspendedDate (DateTime)
    - Reason (String)
    - DataRetentionEndDate (DateTime)
    - IssuedAt (DateTime)

## **12\. Ranh giới Nghiệp vụ**

Ranh giới của Bounded Context IAM được xác định bởi trách nhiệm quản lý danh tính người dùng (bao gồm cả nội bộ và khách hàng), tổ chức khách hàng (bao gồm slug và logo), cấu trúc vai trò/quyền hạn (phân biệt nội bộ và tổ chức, có phân cấp), quy trình xác thực và ủy quyền (có tính đến ngữ cảnh phạm vi và phân cấp), quản lý lời mời tham gia tổ chức (bao gồm thu hồi), quy trình khôi phục tài khoản và đặt lại mật khẩu, và quản lý vòng đời phiên làm việc (bao gồm đăng xuất từ xa). IAM là nguồn sự thật về ai là ai, họ thuộc về phạm vi nào (nội bộ/tổ chức), và họ có vai trò gì trong phạm vi đó.

IAM không chịu trách nhiệm:

- Quản lý chi tiết gói dịch vụ, thanh toán, usage, hoặc entitlement (thuộc về BUM). Tuy nhiên, IAM sử dụng thông tin entitlement từ BUM để thực thi ủy quyền trong phạm vi tổ chức.
- Gửi thông báo thực tế qua các kênh (chỉ yêu cầu NDM gửi).
- Quản lý dữ liệu tham chiếu toàn cục (chỉ sử dụng RDM).
- Ghi nhận audit logs (chỉ phát sự kiện cho ALM).
- Quản lý các miền nghiệp vụ đặc thù khác (Sản phẩm, Đơn hàng, v.v.).
- Xử lý các quy tắc nghiệp vụ phức tạp bên trong các Feature BC (chỉ kiểm tra quyền truy cập ở lớp ủy quyền).
- Quản lý dữ liệu nghiệp vụ chi tiết của người dùng nội bộ (ví dụ: thông tin lương, hợp đồng \- thuộc HRM). IAM chỉ quản lý danh tính và vai trò nội bộ.
- **Quản lý chi tiết asset logo trong DAM.** IAM chỉ lưu trữ ID tham chiếu đến asset đó.
- **Chi tiết các bước thực hiện (how) của từng luồng nghiệp vụ bên trong các service.**

## **13\. Kết luận**

Bounded Context Identity & Access Management (IAM) là một thành phần cốt lõi thiết yếu, cung cấp các dịch vụ nền tảng về quản lý danh tính và quyền truy cập cho toàn bộ hệ thống Ecoma, có khả năng phân biệt và quản lý các đối tượng (User, Role, Permission, Membership) trong phạm vi nội bộ và phạm vi tổ chức khách hàng, với hệ thống quyền hạn có cấu trúc phân cấp. Bằng cách tập trung các trách nhiệm này vào một Context duy nhất và làm rõ các quy tắc nghiệp vụ đặc thù (như quản lý Owner, phân cấp quyền, quy trình khôi phục tài khoản và đặt lại mật khẩu, xác minh email, quản lý phiên, quản lý cài đặt tổ chức), chúng ta đảm bảo tính nhất quán, bảo mật và khả năng mở rộng cho các quy trình xác thực và ủy quyền.

Tài liệu này cung cấp cái nhìn tổng quan về IAM, bao gồm mô hình domain, tương tác, các khía cạnh quan trọng của miền, use cases (được tổ chức theo phạm vi, chỉ tập trung vào actor và mục đích, có đề cập Application/Domain Service liên quan), Domain Service, Application Service và Domain Event, có điều chỉnh và làm rõ các quy tắc nghiệp vụ bạn đã cung cấp. Đây là nền tảng để chuyển sang giai đoạn thiết kế kỹ thuật chi tiết và triển khai Microservice IAM.
