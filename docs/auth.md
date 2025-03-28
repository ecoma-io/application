# Hệ Thống Microservices Xác Thực & Phân Quyền

Hệ thống được thiết kế nhằm mục đích quản lý toàn bộ các chức năng IAM (Identity & Access Management) bao gồm đăng nhập, quản lý session, khôi phục tài khoản, quản lý thông tin cá nhân, tổ chức, mời thành viên, quản lý vai trò (role) và permission theo phiên bản. Tất cả các service giao tiếp với nhau qua NATS và toàn bộ API được cung cấp qua HTTP thông qua `api-gateway-service`.

## 1. PHÂN CHIA MICROSERVICES

| Service                  | Chức năng chính                                                                                                                                             |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **auth-service**         | Xác thực, quản lý session, khôi phục tài khoản, logout, tự cập nhật TTL session và cleanup phiên cũ                                                         |
| **user-service**         | Quản lý thông tin người dùng, chỉnh sửa profile, cập nhật mật khẩu                                                                                          |
| **organization-service** | Tạo và quản lý organization (tổ chức)                                                                                                                       |
| **membership-service**   | Quản lý thành viên trong tổ chức: mời, chấp nhận lời mời, loại thành viên, cập nhật vai trò trong tổ chức                                                   |
| **role-service**         | Quản lý role trong tổ chức: tạo, chỉnh sửa, xóa, hiển thị permission được group theo feature                                                                |
| **permission-service**   | Đăng ký và quản lý permission (feature permissions) theo version; đánh dấu deprecated cho các phiên bản cũ và hỗ trợ kiểm tra tính nhất quán của permission |
| **notification-service** | Quản lý gửi thông báo qua đa kênh: email, SMS, push notification                                                                                            |

## 2. DANH SÁCH ACTION CỦA TỪNG SERVICE

### auth-service

- **login(email, password, userAgent)**  
  _Xác thực người dùng, tạo session mới gắn kết với userAgent và trả về session token._
- **logout(sessionId?)**  
  _Hủy session hiện tại (hoặc session xác định) và thực hiện logout._
- **get-active-sessions(userId)**  
  _Lấy danh sách session đang hoạt động của người dùng._
- **terminate-session(sessionId)**  
  _Dừng một session cụ thể (cho phép logout từ xa)._
- **refresh-session(sessionId)**  
  _Cập nhật TTL của session mỗi khi có request (thêm 7 ngày)._
- **validate-session(token, userAgent)**  
  _Kiểm tra tính hợp lệ của session dựa trên token và userAgent; nếu không hợp lệ sẽ báo lỗi để yêu cầu đăng nhập lại._
- **request-account-recovery(email)**  
  _Khởi tạo quá trình khôi phục tài khoản, tạo magic link và gửi thông báo khôi phục._
- **validate-magic-link(token, userAgent)**  
  _Xác thực magic link, cấp session mới và buộc user đổi mật khẩu ngay sau đó._
- **clear-old-sessions()**  
  _Job chạy định kỳ (cron job) để xóa các session không hoạt động trên 7 ngày._

---

### user-service

- **get-profile(userId)**  
  _Lấy thông tin profile của người dùng._
- **update-profile(userId, data)**  
  _Cập nhật thông tin cá nhân của người dùng._
- **change-password(userId, oldPassword, newPassword)**  
  _Cập nhật mật khẩu cho người dùng sau khi xác thực mật khẩu cũ._

---

### organization-service

- **create-organization(userId, orgData)**  
  _Tạo một organization mới và đồng thời thiết lập user tạo làm owner._
- **get-user-organizations(userId)**  
  _Lấy danh sách organization mà người dùng tham gia._
- **get-organization(orgId)**  
  _Lấy thông tin chi tiết của organization cụ thể._
- **update-organization(orgId, data)**  
  _Cập nhật thông tin của organization (tên, mô tả, settings,...)._

---

### membership-service

- **invite-user(orgId, inviterId, email, roleId)**  
  _Mời user tham gia organization với vai trò cụ thể._  
  **[NATS]** Gửi message thông báo mời đến `notification-worker`.
- **accept-invitation(token)**  
  _Xác thực lời mời qua token được gửi qua email và thêm user vào organization._  
  **[NATS]** Gọi action thêm thành viên sau khi xác nhận.
- **remove-member(orgId, userId)**  
  _Xóa một thành viên khỏi organization theo yêu cầu của admin._
- **list-members(orgId)**  
  _Trả về danh sách các thành viên của một organization._
- **update-member-role(orgId, userId, roleId)**  
  _Cập nhật vai trò của một thành viên trong organization._

---

### role-service

- **create-role(orgId, name, permissions[])**  
  _Tạo role mới trong organization kèm theo danh sách permission (được nhóm theo feature)._
- **update-role(roleId, name, permissions[])**  
  _Chỉnh sửa tên và danh sách permission của role._
- **delete-role(roleId)**  
  _Xóa role khỏi organization._
- **list-roles(orgId)**  
  _Lấy danh sách các role của một organization._
- **get-role(roleId)**  
  _Lấy chi tiết của một role._
- **get-permission-groups()**  
  _Trả về danh sách permission được nhóm theo feature, hỗ trợ cấu hình cho admin._

---

### permission-service

- **register-permissions(serviceName, version, permissions[])**  
  _Các microservice gọi action này khi khởi động, đăng ký danh sách feature permissions kèm theo phiên bản._  
  **[NATS]** Thông tin được gửi từ các service đến permission-service.
- **get-latest-permissions()**  
  _Lấy danh sách permission của phiên bản mới nhất, phục vụ cho giao diện quản trị._
- **get-permissions-by-feature()**  
  _Lấy danh sách permission được nhóm theo feature._
- **mark-version-deprecated(serviceName, version)**  
  _Đánh dấu các permission của phiên bản cũ là deprecated (chờ admin xác nhận và xoá)._
- **get-service-versions(serviceName)**  
  _Trả về danh sách các phiên bản đã đăng ký permission của một service._

---

### notification-worker

- **send-email(to, subject, template, data)**  
  _Gửi email thông báo (ví dụ: magic link, xác nhận, mời organization,...)._
- **send-sms(to, message)**  
  _Gửi SMS thông báo._
- **send-push(to, payload)**  
  _Gửi push notification đến mobile/web app._
- **send-invite(orgId, to, role, inviterName)**  
  _Gửi thông báo mời tham gia organization đa kênh (email, SMS, push)._  
  **[NATS]** Nhận thông báo từ membership-service.
- **send-magic-link(email, token)**  
  _Gửi magic link khôi phục tài khoản._

---

### api-gateway-service

- **HTTP Endpoints:**  
  _Tập trung cung cấp API HTTP, nhận request từ client và định tuyến qua [NATS] tới các microservice tương ứng._  
  _Ví dụ: `POST /auth/login`, `GET /user/profile`, `POST /orgs/invite`,..._

---

## 3. WORKFLOWS CHI TIẾT VÀ MỞ RỘNG

### 3.1. Đăng nhập ([NATS])

- **Đầu vào:**
  - Client gửi `POST /auth/login` tới **api-gateway-service**.
- **Workflow:**
  1. **api-gateway-service** nhận request, gọi **auth-service.login(email, password, userAgent)** qua [NATS].  
     _// Authenticate user and create a session token_
  2. **auth-service** tiến hành xác thực qua **user-service** (trực tiếp hoặc qua [NATS] nếu module được tách riêng).
  3. Nếu xác thực thành công, tạo session mới với TTL và trả về session token.
  4. **api-gateway-service** chuyển trả kết quả cho client.

---

### 3.2. Refresh TTL mỗi request ([NATS])

- **Đầu vào:**
  - Mỗi request HTTP từ client chứa session token.
- **Workflow:**
  1. **api-gateway-service** gọi **auth-service.validate-session(token, userAgent)** qua [NATS] trước khi xử lý request.
  2. **auth-service** kiểm tra tính hợp lệ của token và cập nhật TTL (thêm 7 ngày) nếu hợp lệ.
  3. Nếu không hợp lệ (ví dụ userAgent thay đổi), trả về lỗi yêu cầu đăng nhập lại.

---

### 3.3. Quản lý phiên đăng nhập ([NATS])

- **Lấy danh sách phiên:**
  - Client gửi `GET /auth/sessions`  
    → **api-gateway-service** gọi **auth-service.get-active-sessions(userId)** qua [NATS].
- **Logout một phiên:**
  - Client gửi `DELETE /auth/sessions/:id`  
    → **api-gateway-service** gọi **auth-service.terminate-session(sessionId)** qua [NATS].

---

### 3.4. Khôi phục tài khoản ([NATS])

- **Yêu cầu khôi phục:**
  - Client gửi `POST /auth/recover` với email  
    → **api-gateway-service** gọi **auth-service.request-account-recovery(email)** qua [NATS].
  - **auth-service** tạo magic link khôi phục và gọi **notification-worker.send-magic-link(email, token)** qua [NATS].
- **Xác nhận magic link:**
  - Client truy cập link (ví dụ: `GET /auth/magic-login?token=...`)  
    → **api-gateway-service** gọi **auth-service.validate-magic-link(token, userAgent)** qua [NATS].
  - Nếu thành công, cấp session mới và buộc người dùng đổi mật khẩu.

---

### 3.5. Đăng ký feature permissions ([NATS])

- **Đầu vào:**
  - Khi một microservice khởi động, gửi thông tin: `serviceName`, `version`, và `permissions[]`.
- **Workflow:**
  1. Service gọi **permission-service.register-permissions(serviceName, version, permissions[])** qua [NATS].
  2. **permission-service** lưu thông tin permission của phiên bản mới, đồng thời đánh dấu các permission của phiên bản trước là deprecated (nếu có).

---

### 3.6. Tạo Organization và Mời User ([NATS])

- **Tạo organization:**
  - Client gửi `POST /orgs` với thông tin orgData  
    → **api-gateway-service** gọi **organization-service.create-organization(userId, orgData)** qua [NATS].
  - Sau khi organization được tạo, hệ thống tự động gọi **membership-service** để đăng ký người tạo với vai trò owner.
- **Mời user vào organization:**
  - Client gửi `POST /orgs/:id/invite` với email và roleId  
    → **api-gateway-service** gọi **membership-service.invite-user(orgId, inviterId, email, roleId)** qua [NATS].
  - **membership-service** sau đó gọi **notification-worker.send-invite(orgId, to, role, inviterName)** qua [NATS] để gửi lời mời.
- **Chấp nhận lời mời:**
  - Client truy cập link chấp nhận (ví dụ: `GET /invite/accept?token=...`)  
    → **api-gateway-service** gọi **membership-service.accept-invitation(token)** qua [NATS].
  - Nếu xác thực token thành công, user được thêm vào organization.

---

### 3.7. Quản lý Role & Permission trong Organization ([NATS])

- **Tạo/Chỉnh sửa/Xóa Role:**
  - Client gửi request (`POST /roles`, `PUT /roles/:id`, `DELETE /roles/:id`)  
    → **api-gateway-service** chuyển request đến **role-service** qua [NATS] (các action như **create-role**, **update-role**, **delete-role**).
  - Trong quá trình này, **role-service** có thể gọi **permission-service.get-permission-groups()** qua [NATS] để nhận danh sách permission được nhóm theo feature, hỗ trợ cấu hình.
- **Lấy danh sách Role:**
  - Client gửi `GET /roles`  
    → **api-gateway-service** gọi **role-service.list-roles(orgId)** qua [NATS].

---

### 3.8. Cập nhật Profile và Đổi mật khẩu ([NATS])

- **Cập nhật thông tin cá nhân:**
  - Client gửi `PUT /user/profile` với dữ liệu mới  
    → **api-gateway-service** gọi **user-service.update-profile(userId, data)** qua [NATS].
- **Đổi mật khẩu:**
  - Client gửi `PUT /user/password` với tham số `oldPassword` và `newPassword`  
    → **api-gateway-service** gọi **user-service.change-password(userId, oldPassword, newPassword)** qua [NATS].

---

### 3.9. Auto Cleanup Session Không hoạt động

- **Workflow tự động:**
  - **auth-service.clear-old-sessions()** được thực thi theo lịch (cron job) để xóa các session không hoạt động trong 7 ngày.
  - (Có thể tích hợp gửi notification hoặc ghi log khi thực hiện xóa session.)

---

## 4. MỞ RỘNG THÊM (NẾU CẦN)

- **Audit Log Service:**  
  _Ghi lại các hoạt động quan trọng: đăng nhập, logout, thay đổi profile, cập nhật role,... và gửi log qua NATS cho hệ thống giám sát._
- **Feature Flag Service:**  
  _Kiểm soát rollout permission hoặc tính năng mới theo từng nhóm người dùng (nếu cần)._
- **Admin Console & Reporting:**  
  _Dashboard cho admin quản lý permission version, đánh dấu deprecated, và thực hiện các thao tác migration trên người dùng, tổ chức._

---

## KẾT LUẬN

Hệ thống microservices IAM được chia thành các domain rõ ràng: xác thực, quản lý người dùng, tổ chức, thành viên, vai trò và permission, cùng với một service chuyên biệt cho thông báo đa kênh (notification).  
Việc giao tiếp giữa các service qua [NATS] đảm bảo tính mở rộng và decoupling, đồng thời toàn bộ API được cung cấp thông qua `api-gateway-service` giúp tập trung định tuyến và bảo mật.

File này mô tả chi tiết các action của từng service cũng như workflow giao tiếp giữa các service. Nếu cần mở rộng chi tiết hơn, có thể bổ sung sơ đồ message flow hoặc các contract DTO cho từng action.

---
