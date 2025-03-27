# **Bounded Context Customer Relationship Management & Service (CRM)**

## **1\. Giới thiệu**

Tài liệu này cung cấp mô tả chi tiết về Bounded Context **Customer Relationship Management & Service (CRM)** trong hệ thống Ecoma. CRM là một trong những Bounded Context thuộc nhóm Supporting Feature, đóng vai trò quản lý các mối quan hệ với khách hàng của tổ chức khách hàng sử dụng nền tảng Ecoma, từ giai đoạn tiềm năng (Lead) đến khách hàng hiện tại và khách hàng trung thành, cũng như xử lý các yêu cầu dịch vụ khách hàng.

CRM là trung tâm dữ liệu về khách hàng, theo dõi lịch sử tương tác, quản lý các trường hợp hỗ trợ (service cases) và cung cấp cái nhìn toàn diện về khách hàng bằng cách tổng hợp thông tin từ các Bounded Context khác, giúp tổ chức xây dựng và duy trì mối quan hệ tốt đẹp với khách hàng, nâng cao sự hài lòng và thúc đẩy kinh doanh.

## **2\. Phạm vi của Tài liệu**

Tài liệu này tập trung vào việc định nghĩa và mô tả Bounded Context CRM ở cấp độ thiết kế miền (domain design), cung cấp đủ chi tiết để hỗ trợ việc thiết kế các Domain Service và Application Service. Cụ thể, tài liệu này bao gồm:

- Xác định vai trò và trách nhiệm chính của CRM, tập trung vào quản lý thông tin khách hàng, tương tác và dịch vụ khách hàng.
- Mô tả các khái niệm và thực thể cốt lõi trong mô hình domain của CRM ở cấp độ chi tiết hơn, bao gồm các Aggregate Root, Entity và Value Object với các thuộc tính chính, có tính đến các loại khách hàng (cá nhân, tổ chức), tương tác và trường hợp hỗ trợ.
- Định nghĩa Ngôn ngữ Chung (Ubiquitous Language) trong phạm vi CRM.
- Mô tả **Các Khía cạnh Quan trọng của Miền CRM**, làm rõ các quy tắc và cấu trúc nghiệp vụ chi phối hoạt động của Context này, bao gồm quản lý vòng đời khách hàng và cái nhìn 360 độ.
- Làm rõ các tương tác chính giữa CRM và các Bounded Context khác là nguồn cung cấp dữ liệu hoặc tiêu thụ thông tin khách hàng/dịch vụ.
- Phác thảo các **Use cases** chính có sự tham gia của CRM, tập trung vào actor, mục đích và các Domain/Application Service liên quan.
- Xác định ranh giới nghiệp vụ của CRM, nhấn mạnh những gì CRM không chịu trách nhiệm.
- Đề xuất các Domain Service và Application Service tiềm năng trong CRM, mô tả trách nhiệm chính của từng service.
- Xác định và mô tả các **Domain Events** mà CRM tương tác, được chia thành các sự kiện CRM **phát ra** (Published Events) và các sự kiện CRM **lắng nghe và xử lý** (Consumed Events), bao gồm payload dự kiến của từng event.

Tài liệu này **không** đi sâu vào các chi tiết kỹ thuật triển khai cụ thể hoặc mô tả chi tiết các bước thực hiện (how) của từng luồng nghiệp vụ **bên trong các service**. Các khía cạnh sau **không** nằm trong phạm vi của tài liệu này:

- Chi tiết cài đặt kỹ thuật của Microservice CRM.
- Cấu trúc cơ sở dữ liệu chi tiết (schema) của CRM.
- Các quyết định công nghệ cụ thể bên trong CRM.
- Luồng dữ liệu chi tiết đến cấp độ từng trường thông tin giữa CRM và các BC khác.
- Cấu hình hạ tầng triển khai cụ thể cho Microservice CRM.
- Thiết kế giao diện người dùng để quản lý khách hàng, tương tác hoặc service case.
- Xử lý các giao dịch bán hàng thực tế (đặt hàng, thanh toán) \- thuộc OSM/ODM/PPM.
- Quản lý tồn kho (thuộc ICM).
- Quản lý thông tin sản phẩm chi tiết (thuộc PIM).
- Quản lý chiến dịch marketing chi tiết (thuộc MPM). CRM chỉ cung cấp dữ liệu khách hàng/phân khúc cho MPM.
- Quản lý quy trình làm việc phức tạp vượt ra ngoài service case (thuộc WPM). CRM có thể kích hoạt workflow trong WPM.
- Quản lý dữ liệu nhân sự chi tiết (thuộc HRM). CRM chỉ liên kết với nhân viên làm dịch vụ khách hàng.
- Quản lý tài chính và kế toán (thuộc FAM). CRM chỉ cung cấp dữ liệu liên quan đến khách hàng cho báo cáo.

## **3\. Vai trò và Trách nhiệm Chính**

Bounded Context CRM chịu trách nhiệm quản lý các khía cạnh liên quan đến khách hàng và dịch vụ khách hàng. Các trách nhiệm chính bao gồm:

- **Quản lý Hồ sơ Khách hàng (Customer Profile):** Tạo, cập nhật, xóa (logic xóa mềm), và lưu trữ thông tin chi tiết về khách hàng (cá nhân hoặc tổ chức).
- **Quản lý Vòng đời Khách hàng:** Theo dõi và cập nhật trạng thái của khách hàng trong vòng đời (ví dụ: Lead, Prospect, Active, Churn).
- **Quản lý Tương tác Khách hàng (Customer Interaction):** Ghi nhận và theo dõi tất cả các tương tác giữa tổ chức và khách hàng (cuộc gọi, email, chat, meeting, v.v.).
- **Quản lý Trường hợp Hỗ trợ (Service Case):** Tạo, cập nhật, gán, theo dõi tiến độ và đóng các trường hợp yêu cầu hỗ trợ từ khách hàng.
- **Liên kết Dữ liệu Khách hàng:** Liên kết hồ sơ khách hàng với các dữ liệu liên quan từ các BC khác (đơn hàng, thanh toán, gói dịch vụ, v.v.) để cung cấp cái nhìn 360 độ.
- **Quản lý Phân khúc Khách hàng (Segmentation):** Định nghĩa và quản lý các phân khúc khách hàng dựa trên các tiêu chí khác nhau (nhân khẩu học, hành vi, giá trị).
- **Quản lý Địa chỉ và Thông tin Liên hệ:** Lưu trữ và quản lý nhiều địa chỉ (giao hàng, thanh toán, liên hệ) và thông tin liên hệ khác nhau của khách hàng.
- **Quản lý Tùy chọn Truyền thông:** Lưu trữ tùy chọn nhận thông báo và kênh liên lạc ưa thích của khách hàng (liên kết với NDM).
- **Cung cấp Dữ liệu Khách hàng:** Cung cấp thông tin khách hàng, tương tác, service case cho các BC khác khi cần (ví dụ: cho OSM để cá nhân hóa trải nghiệm, cho MPM để chạy chiến dịch).
- **Phát Sự kiện Nghiệp vụ:** Phát ra các Sự kiện Nghiệp vụ quan trọng khi có thay đổi về dữ liệu khách hàng, tương tác hoặc service case.

## **4\. Mô hình Domain (Chi tiết hơn)**

Trong phạm vi Bounded Context CRM, chúng ta xác định các Aggregate Root, Entity và Value Object cốt lõi với các thuộc tính chính:

**Aggregate Roots:**

- **Customer:** Là Aggregate Root trung tâm, đại diện cho một khách hàng (cá nhân hoặc tổ chức) của tổ chức khách hàng. Customer quản lý thông tin hồ sơ, vòng đời, địa chỉ, thông tin liên hệ và các liên kết chính.
  - **ID:** Unique identifier (UUID).
  - **TenantId:** ID của tổ chức sở hữu khách hàng (liên kết với IAM).
  - **CustomerType:** Loại khách hàng (CustomerType Value Object: Individual, Organization).
  - **UserId:** **Optional** ID của người dùng Ecoma liên kết với khách hàng này (liên kết với IAM \- nếu khách hàng có tài khoản đăng nhập).
  - **OrganizationId:** **Optional** ID của tổ chức khách hàng (nếu CustomerType là Individual và thuộc về một tổ chức khách hàng khác trong Ecoma \- kịch bản B2B).
  - **PersonalInfo:** **Optional** Thông tin cá nhân (PersonalInfo Value Object \- nếu CustomerType là Individual).
  - **OrganizationInfo:** **Optional** Thông tin tổ chức (OrganizationInfo Value Object \- nếu CustomerType là Organization).
  - **CustomerLifecycleStatus:** Trạng thái trong vòng đời khách hàng (CustomerLifecycleStatus Value Object: Lead, Prospect, Active, Churn, Inactive).
  - **CustomerValueTier:** **Optional** Phân loại giá trị khách hàng (CustomerValueTier Value Object: VIP, Gold, Silver \- có thể liên kết với RDM hoặc được tính toán).
  - **Addresses:** Danh sách các Address Entities.
  - **ContactPoints:** Danh sách các ContactPoint Entities.
  - **RelatedResources:** Danh sách các RelatedResource Value Objects (liên kết đến các thực thể nghiệp vụ khác như Orders, Subscriptions, etc.).
  - **CommunicationPreferences:** **Optional** Tùy chọn truyền thông (CommunicationPreferences Value Object \- liên kết với NDM).
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ UpdateProfile, ChangeStatus, AddAddress, RemoveAddress, AddContactPoint, RemoveContactPoint, LinkResource, UnlinkResource, UpdateCommunicationPreferences.
- **ServiceCase:** Là Aggregate Root đại diện cho một trường hợp yêu cầu hỗ trợ hoặc vấn đề của khách hàng. ServiceCase quản lý thông tin chi tiết về vấn đề, người liên quan, trạng thái và lịch sử tương tác.
  - **ID:** Unique identifier (UUID).
  - **TenantId:** ID của tổ chức.
  - **CustomerId:** ID của khách hàng liên quan (liên kết với Customer Aggregate).
  - **Title:** Tiêu đề trường hợp.
  - **Description:** Mô tả chi tiết vấn đề.
  - **Status:** Trạng thái trường hợp (ServiceCaseStatus Value Object: Open, In Progress, Resolved, Closed, Cancelled).
  - **Priority:** Mức độ ưu tiên (Priority Value Object: Low, Medium, High, Urgent).
  - **CaseType:** Loại trường hợp (CaseType Value Object: Technical Issue, Billing Inquiry, Product Question, Complaint \- có thể liên kết với RDM).
  - **AssignedToUserId:** **Optional** ID của nhân viên/người dùng được gán xử lý (liên kết với IAM/HRM).
  - **ReportedByUserId:** **Optional** ID người dùng đã báo cáo (nếu khác CustomerId).
  - **ReportedViaChannel:** Kênh báo cáo (Channel Value Object: Email, Phone, Chat, Web Form).
  - **RelatedResources:** Danh sách các RelatedResource Value Objects (liên kết đến Order, Product, etc.).
  - **Interactions:** Danh sách các CustomerInteraction Entities liên quan đến trường hợp này.
  - **ResolutionDetails:** **Optional** Chi tiết giải quyết khi trường hợp được đóng.
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ AssignToUser, ChangeStatus, AddInteraction, LinkResource, Resolve, Close.

**Entities (thuộc về các Aggregate Root):**

- **Address (thuộc Customer):** Đại diện cho một địa chỉ liên quan đến khách hàng.
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root Customer.
  - **AddressType:** Loại địa chỉ (AddressType Value Object: Shipping, Billing, Contact \- có thể liên kết với RDM).
  - **Street:**
  - **City:**
  - **State/Province:**
  - **PostalCode:**
  - **Country:** (liên kết với RDM)
  - **IsDefault:** Boolean chỉ định có phải địa chỉ mặc định cho loại đó không.
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ UpdateDetails, SetAsDefault.
- **ContactPoint (thuộc Customer):** Đại diện cho một điểm liên lạc của khách hàng (email, số điện thoại).
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root Customer.
  - **ContactType:** Loại liên lạc (ContactType Value Object: Email, Phone, Mobile).
  - **Value:** Giá trị (ví dụ: "email@example.com", "+84123456789").
  - **IsPrimary:** Boolean chỉ định có phải liên lạc chính không.
  - **IsVerified:** Boolean chỉ định đã xác minh chưa.
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ UpdateValue, SetAsPrimary, MarkAsVerified.
- **CustomerInteraction (thuộc ServiceCase hoặc độc lập):** Đại diện cho một lần tương tác với khách hàng. Có thể thuộc ServiceCase nếu tương tác đó là một phần của việc xử lý case, hoặc độc lập nếu là tương tác chung (ví dụ: cuộc gọi bán hàng, email marketing). Giả định có thể tồn tại độc lập và liên kết với Customer, hoặc thuộc ServiceCase.
  - **ID:** Unique identifier (UUID).
  - **TenantId:** ID của tổ chức.
  - **CustomerId:** ID của khách hàng liên quan.
  - **InteractionType:** Loại tương tác (InteractionType Value Object: Call, Email, Chat, Meeting, Note, SMS).
  - **InteractionDate:** Thời điểm tương tác. **Lưu trữ ở múi giờ UTC.**
  - **Summary:** Tóm tắt nội dung tương tác.
  - **Details:** Chi tiết tương tác (có thể là nội dung email, bản ghi cuộc gọi, ghi chú meeting).
  - **RecordedByUserId:** ID của người dùng nội bộ đã ghi nhận tương tác (liên kết với IAM/HRM).
  - **RelatedServiceCaseId:** **Optional** ID của Service Case liên quan.
  - **RelatedResources:** Danh sách các RelatedResource Value Objects.
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ UpdateDetails.

**Value Objects:**

- **CustomerType:** Loại khách hàng (Individual, Organization).
- **CustomerLifecycleStatus:** Trạng thái trong vòng đời khách hàng (Lead, Prospect, Active, Churn, Inactive).
- **CustomerValueTier:** Phân loại giá trị khách hàng (VIP, Gold, Silver).
- **PersonalInfo:** Thông tin cá nhân (FirstName, LastName, DateOfBirth, Gender).
- **OrganizationInfo:** Thông tin tổ chức (Name, TaxId, Industry).
- **AddressType:** Loại địa chỉ (Shipping, Billing, Contact).
- **ContactType:** Loại liên lạc (Email, Phone, Mobile).
- **ServiceCaseStatus:** Trạng thái trường hợp hỗ trợ (Open, In Progress, Resolved, Closed, Cancelled).
- **Priority:** Mức độ ưu tiên (Low, Medium, High, Urgent).
- **CaseType:** Loại trường hợp (Technical Issue, Billing Inquiry, Product Question, Complaint).
- **Channel:** Kênh báo cáo/tương tác (Email, Phone, Chat, Web Form).
- **InteractionType:** Loại tương tác (Call, Email, Chat, Meeting, Note, SMS).
- **RelatedResource:** Liên kết đến một thực thể nghiệp vụ khác (EntityType, EntityId, Description).
- **CommunicationPreferences:** Tùy chọn nhận thông báo (Map\<NotificationType, Boolean\> hoặc chi tiết hơn).
- **LocalizedText:** Giá trị văn bản đa ngôn ngữ (sử dụng Translation Key).
- **Address:** Địa chỉ (Street, City, Country, PostalCode) \- có thể dùng chung.

## **5\. Ngôn ngữ Chung (Ubiquitous Language)**

Trong Bounded Context CRM, các thuật ngữ sau đây có ý nghĩa cụ thể và nhất quán:

- **Customer:** Một cá nhân hoặc tổ chức mua sản phẩm/dịch vụ.
- **Lead:** Khách hàng tiềm năng chưa thực hiện giao dịch.
- **Prospect:** Khách hàng tiềm năng đã thể hiện sự quan tâm.
- **Active Customer:** Khách hàng hiện đang giao dịch hoặc sử dụng dịch vụ.
- **Churned Customer:** Khách hàng đã ngừng giao dịch/sử dụng dịch vụ.
- **Customer Profile:** Hồ sơ chứa thông tin chi tiết về Customer.
- **Interaction:** Một lần liên lạc hoặc giao tiếp với Customer.
- **Service Case:** Một yêu cầu hỗ trợ hoặc vấn đề được báo cáo bởi Customer.
- **Case Agent:** Nhân viên được gán xử lý Service Case.
- **Customer Lifecycle:** Các giai đoạn khác nhau trong mối quan hệ với Customer.
- **Customer Segment:** Một nhóm Customer có chung đặc điểm.
- **360 Degree View:** Cái nhìn toàn diện về Customer bằng cách tổng hợp dữ liệu từ nhiều nguồn.
- **Touchpoint:** Điểm tiếp xúc giữa tổ chức và Customer.
- **Resolution:** Giải pháp cho một Service Case.
- **Communication Preference:** Tùy chọn của Customer về cách thức và loại thông báo muốn nhận.

## **6\. Các Khía cạnh Quan trọng của Miền CRM**

Phần này mô tả các cấu trúc, quy tắc và khái niệm nghiệp vụ quan trọng chi phối hoạt động của Bounded Context CRM.

### **6.1. Quản lý Vòng đời Khách hàng (Customer Lifecycle)**

CRM theo dõi trạng thái của khách hàng trong suốt vòng đời của họ, từ Lead, Prospect, Active Customer đến Churn hoặc Inactive. Việc chuyển đổi trạng thái có thể dựa trên các hành động cụ thể (ví dụ: giao dịch mua đầu tiên chuyển từ Prospect sang Active, không hoạt động trong một thời gian dài chuyển sang Inactive/Churn) hoặc được cập nhật thủ công. Trạng thái này ảnh hưởng đến các hoạt động tương tác và marketing.

### **6.2. Cái nhìn 360 Độ về Khách hàng**

CRM đóng vai trò là trung tâm để tổng hợp thông tin về khách hàng từ các Bounded Context khác. Mặc dù CRM lưu trữ dữ liệu master về hồ sơ khách hàng, tương tác và service case, nó sẽ liên kết đến các Aggregate Root/Entity từ các BC khác (Orders từ ODM, Payments từ PPM, Subscriptions từ BUM, Enrollments từ ITM, Tasks/Workflows từ WPM, v.v.) thông qua RelatedResource Value Object. Khi hiển thị "Customer 360 View", CRM (hoặc Client App) sẽ gọi các BC liên quan để lấy dữ liệu chi tiết dựa trên các ID đã lưu.

### **6.3. Quản lý Tương tác Khách hàng (Interactions)**

CRM ghi nhận mọi tương tác với khách hàng để có lịch sử đầy đủ. Mỗi tương tác có loại, thời điểm, người thực hiện (nội bộ), và nội dung tóm tắt/chi tiết. Tương tác có thể liên quan đến một Service Case cụ thể hoặc là tương tác chung (ví dụ: cuộc gọi bán hàng, email khảo sát).

### **6.4. Quản lý Trường hợp Hỗ trợ (Service Cases)**

CRM quản lý vòng đời của các yêu cầu hỗ trợ từ khách hàng, từ khi mở đến khi đóng. Mỗi Service Case có trạng thái, mức độ ưu tiên, người được gán xử lý, và liên kết đến khách hàng, các tài nguyên liên quan (sản phẩm, đơn hàng) và lịch sử các tương tác liên quan.

### **6.5. Quản lý Phân khúc Khách hàng (Segmentation)**

CRM cho phép định nghĩa các phân khúc khách hàng dựa trên các tiêu chí khác nhau (ví dụ: khách hàng VIP, khách hàng ở Hà Nội, khách hàng đã mua sản phẩm X). Logic phân khúc có thể nằm trong CRM hoặc được tính toán bởi một BC Analytics chuyên biệt và kết quả được lưu trữ/tham chiếu trong CRM. Các phân khúc này được sử dụng bởi MPM cho các chiến dịch marketing mục tiêu.

### **6.6. Tích hợp với IAM cho Danh tính và Quyền**

CRM liên kết hồ sơ khách hàng với User trong IAM. IAM chịu trách nhiệm xác thực và ủy quyền cho người dùng (cả khách hàng đăng nhập và nhân viên nội bộ quản lý CRM). CRM sử dụng User ID từ IAM để liên kết hồ sơ khách hàng và xác định người thực hiện tương tác/xử lý case.

### **6.7. Quản lý Địa chỉ và Thông tin Liên hệ**

CRM lưu trữ nhiều địa chỉ và điểm liên lạc (email, số điện thoại) cho mỗi khách hàng, với các loại khác nhau (giao hàng, thanh toán, liên hệ) và có thể đánh dấu địa chỉ/liên lạc chính.

## **7\. Tương tác với các Bounded Context khác**

CRM tương tác với nhiều Bounded Context khác trong hệ thống Ecoma để thu thập dữ liệu, cung cấp thông tin khách hàng và kích hoạt các quy trình liên quan.

- **Tương tác với Core BCs:**
  - **IAM:** CRM cần IAM (Request/Reply) để xác thực và ủy quyền cho người dùng quản lý CRM và khách hàng đăng nhập. CRM gọi IAM (Request/Reply) để lấy thông tin User (bao gồm Locale ưa thích, thông tin cơ bản) và Tenant. IAM phát Event (UserCreated, UserStatusChanged) mà CRM lắng nghe để tạo/cập nhật hồ sơ khách hàng liên kết.
  - **NDM:** CRM yêu cầu NDM gửi thông báo cho khách hàng (ví dụ: xác nhận tạo case, cập nhật trạng thái case, thông báo khuyến mãi \- nếu không do MPM gửi trực tiếp). CRM cung cấp thông tin Customer ID và tùy chọn truyền thông (lấy từ hồ sơ khách hàng) để NDM xử lý. NDM gọi CRM (Query) để lấy tùy chọn truyền thông nếu không được cung cấp trong yêu cầu.
  - **LZM & RDM:** CRM cần LZM (Request/Reply) để quản lý và hiển thị metadata đa ngôn ngữ (tên trường dữ liệu, tên loại case, lý do đóng case, v.v.). CRM cần RDM (Request/Reply) để lấy dữ liệu tham chiếu (ví dụ: danh sách quốc gia, loại địa chỉ, loại liên lạc, loại tương tác, loại case, loại phân khúc).
  - **ALM:** CRM phát ra các sự kiện audit log (Event) khi có các hành động quan trọng liên quan đến quản lý khách hàng, tương tác và service case.
  - **BUM:** CRM gọi BUM (Request/Reply Query) để lấy thông tin gói dịch vụ (Subscription) và lịch sử giao dịch thanh toán (BillingTransaction) liên quan đến khách hàng. BUM phát Event (SubscriptionStatusChanged, BillingTransactionSuccessful) mà CRM lắng nghe để cập nhật trạng thái khách hàng (CustomerLifecycleStatus) hoặc ghi nhận tương tác.
- **Tương tác với Feature BCs (Chủ yếu là Consumed Events và Query):**
  - **OSM & ODM:** CRM gọi OSM/ODM (Request/Reply Query) để lấy lịch sử đơn hàng và thông tin chi tiết đơn hàng liên quan đến khách hàng. OSM/ODM phát Event (OrderCompleted, OrderCancelled, ReturnProcessed) mà CRM lắng nghe để ghi nhận tương tác, cập nhật trạng thái khách hàng (ví dụ: khách hàng Active sau đơn hàng đầu tiên), hoặc tự động tạo Service Case (ví dụ: case "Xử lý hàng trả lại").
  - **PPM:** CRM gọi PPM (Request/Reply Query) để lấy lịch sử thanh toán liên quan đến khách hàng. PPM phát Event (PaymentSuccessful, RefundProcessed) mà CRM lắng nghe để ghi nhận tương tác hoặc cập nhật thông tin giá trị khách hàng.
  - **ICM:** CRM có thể gọi ICM (Request/Reply Query) để lấy thông tin tồn kho liên quan đến sản phẩm trong Service Case (ví dụ: kiểm tra tình trạng tồn kho của sản phẩm bị lỗi).
  - **HRM:** CRM gọi HRM (Request/Reply Query) để lấy thông tin chi tiết về nhân viên được gán xử lý Service Case (ví dụ: tên, bộ phận). HRM phát Event (EmployeeAssignedToDepartment, EmployeeJobTitleChanged) mà CRM có thể lắng nghe để cập nhật thông tin nhân viên nội bộ liên quan đến case.
  - **WPM:** CRM phát Event (ServiceCaseCreated, ServiceCaseStatusChanged) mà WPM có thể lắng nghe để tự động tạo Task hoặc Workflow liên quan đến việc xử lý case. WPM phát Event (TaskCompleted, WorkflowCompleted) mà CRM lắng nghe để cập nhật trạng thái Service Case nếu case đó được liên kết với Task/Workflow trong WPM.
  - **MPM:** CRM cung cấp API Query để MPM lấy danh sách khách hàng theo phân khúc. MPM phát Event (PromotionApplied) mà CRM lắng nghe để ghi nhận tương tác hoặc cập nhật thông tin khách hàng (ví dụ: khách hàng đã tham gia khuyến mãi).
  - **ITM:** CRM có thể gọi ITM (Request/Reply Query) để lấy thông tin lịch sử đào tạo của nhân viên nội bộ được gán xử lý case. ITM phát Event (CourseCompleted) mà CRM có thể lắng nghe nếu việc hoàn thành khóa đào tạo ảnh hưởng đến khả năng xử lý case của nhân viên.

## **8\. Use cases**

Dưới đây là mô tả các use case chính có sự tham gia của CRM, được tổ chức theo các nhóm chức năng chính, tập trung vào actor, mục đích và các Domain/Application Service liên quan.

### **8.1. Use Cases liên quan đến Quản lý Hồ sơ Khách hàng**

Nhóm này bao gồm các use case về việc tạo, cập nhật và quản lý thông tin chi tiết về khách hàng.

- **Use case: Tạo Hồ sơ Khách hàng Mới:**
  - **Actor:** Hệ thống (từ IAM khi User mới đăng ký), Người dùng (nhân viên bán hàng/marketing/CSKH).
  - **Mục đích:** Tạo một bản ghi mới cho khách hàng trong hệ thống CRM.
  - **Service liên quan:** Được xử lý bởi CustomerApplicationService (Event Handler cho UserCreatedEvent hoặc Command Handler cho CreateCustomerCommand). Sử dụng CustomerService để tạo Customer Aggregate Root, bao gồm cả việc liên kết với User ID (nếu có). Sử dụng Customer Repository. Phát sự kiện CustomerCreated, audit log cho ALM.
- **Use case: Cập nhật Thông tin Hồ sơ Khách hàng:**
  - **Actor:** Khách hàng (tự cập nhật qua Customer Portal), Người dùng (nhân viên nội bộ).
  - **Mục đích:** Chỉnh sửa thông tin cá nhân/tổ chức, địa chỉ, thông tin liên hệ của khách hàng.
  - **Service liên quan:** Được xử lý bởi CustomerApplicationService (Command Handler cho UpdateCustomerProfileCommand). Sử dụng CustomerService để lấy và cập nhật Customer Aggregate Root. Sử dụng Customer Repository. Phát sự kiện CustomerProfileUpdated, audit log cho ALM.
- **Use case: Thay đổi Trạng thái Vòng đời Khách hàng:**
  - **Actor:** Hệ thống (từ các Event khác như OrderCompletedEvent, SubscriptionStatusChanged), Người dùng (nhân viên bán hàng/marketing/CSKH).
  - **Mục đích:** Cập nhật trạng thái của khách hàng trong vòng đời (ví dụ: Lead \-\> Active, Active \-\> Churn).
  - **Service liên quan:** Được xử lý bởi CustomerApplicationService (Event Handler hoặc Command Handler cho ChangeCustomerLifecycleStatusCommand). Sử dụng CustomerService để lấy và thay đổi trạng thái trong Customer Aggregate Root. Sử dụng Customer Repository. Phát sự kiện CustomerLifecycleStatusChanged, audit log cho ALM.
- **Use case: Xem Hồ sơ Khách hàng (360 Độ):**
  - **Actor:** Người dùng (nhân viên nội bộ).
  - **Mục đích:** Xem tất cả thông tin chi tiết về khách hàng, bao gồm thông tin hồ sơ, lịch sử tương tác, service case, đơn hàng, thanh toán, gói dịch vụ, v.v. được tổng hợp từ nhiều BC.
  - **Service liên quan:** Được xử lý bởi CRMQueryApplicationService (Query Handler cho GetCustomer360ViewQuery). Sử dụng CustomerQueryService để lấy Customer Aggregate Root. CustomerQueryService gọi các Query Service của các BC khác (OSM, ODM, PPM, BUM, ITM, WPM, HRM) để lấy dữ liệu liên quan dựa trên các ID đã lưu trong Customer Aggregate. Sử dụng Customer Repository.

### **8.2. Use Cases liên quan đến Quản lý Tương tác Khách hàng**

Nhóm này bao gồm việc ghi nhận và theo dõi các lần liên lạc với khách hàng.

- **Use case: Ghi nhận Tương tác Khách hàng:**
  - **Actor:** Hệ thống (từ các Event như PaymentSuccessfulEvent), Người dùng (nhân viên bán hàng/CSKH).
  - **Mục đích:** Lưu lại thông tin về một lần tương tác với khách hàng (cuộc gọi, email, chat, v.v.).
  - **Service liên quan:** Được xử lý bởi InteractionApplicationService (Event Handler hoặc Command Handler cho RecordCustomerInteractionCommand). Sử dụng InteractionService để tạo CustomerInteraction Entity (độc lập hoặc thuộc ServiceCase). Sử dụng Customer Repository (nếu thuộc case), Interaction Repository (nếu độc lập). Phát sự kiện CustomerInteractionRecorded, audit log cho ALM.

### **8.3. Use Cases liên quan đến Quản lý Trường hợp Hỗ trợ (Service Case)**

Nhóm này tập trung vào việc xử lý các yêu cầu và vấn đề của khách hàng.

- **Use case: Tạo Trường hợp Hỗ trợ Mới:**
  - **Actor:** Khách hàng (qua Customer Portal), Người dùng (nhân viên CSKH \- tạo thay khách hàng), Hệ thống (từ các Event như ReturnProcessedEvent).
  - **Mục đích:** Mở một trường hợp mới để theo dõi và giải quyết vấn đề của khách hàng.
  - **Service liên quan:** Được xử lý bởi CaseApplicationService (Event Handler cho ReturnProcessedEvent hoặc Command Handler cho CreateServiceCaseCommand). Sử dụng CaseService để tạo ServiceCase Aggregate Root. Sử dụng ServiceCase Repository. Phát sự kiện ServiceCaseCreated, audit log cho ALM. Có thể yêu cầu NDM gửi thông báo xác nhận tạo case cho khách hàng. Có thể phát sự kiện cho WPM để tạo task/workflow.
- **Use case: Cập nhật Trạng thái/Chi tiết Trường hợp Hỗ trợ:**
  - **Actor:** Người dùng (nhân viên CSKH được gán xử lý), Hệ thống (từ WPM khi task liên quan hoàn thành).
  - **Mục đích:** Thay đổi trạng thái (ví dụ: Open \-\> In Progress, In Progress \-\> Resolved), mức độ ưu tiên, hoặc thêm ghi chú/giải pháp cho trường hợp.
  - **Service liên quan:** Được xử lý bởi CaseApplicationService (Event Handler cho TaskCompletedEvent từ WPM hoặc Command Handler cho UpdateServiceCaseCommand). Sử dụng CaseService để lấy và cập nhật ServiceCase Aggregate Root. Sử dụng ServiceCase Repository. Phát sự kiện ServiceCaseStatusChanged, ServiceCaseUpdated, audit log cho ALM. Yêu cầu NDM gửi thông báo cập nhật trạng thái cho khách hàng (nếu cần).
- **Use case: Gán Trường hợp Hỗ trợ cho Nhân viên:**
  - **Actor:** Người dùng (người quản lý CSKH), Hệ thống (logic tự động gán).
  - **Mục đích:** Chỉ định một nhân viên cụ thể chịu trách nhiệm xử lý trường hợp.
  - **Service liên quan:** Được xử lý bởi CaseApplicationService (Command Handler cho AssignServiceCaseCommand). Sử dụng CaseService để lấy và cập nhật AssignedToUserId trong ServiceCase Aggregate Root. Sử dụng ServiceCase Repository. Phát sự kiện ServiceCaseAssigned, audit log cho ALM. Yêu cầu NDM gửi thông báo cho nhân viên được gán.
- **Use case: Thêm Tương tác vào Trường hợp Hỗ trợ:**
  - **Actor:** Người dùng (nhân viên CSKH ghi nhận tương tác), Hệ thống (từ các Event tương tác).
  - **Mục đích:** Liên kết một tương tác cụ thể (cuộc gọi, email) với một trường hợp hỗ trợ đang mở.
  - **Service liên quan:** Được xử lý bởi CaseApplicationService (Command Handler cho AddInteractionToCaseCommand hoặc Event Handler từ các Event tương tác). Sử dụng CaseService để lấy ServiceCase Aggregate Root và thêm CustomerInteraction Entity con. Sử dụng ServiceCase Repository. Phát sự kiện ServiceCaseInteractionAdded, audit log cho ALM.

### **8.4. Use Cases liên quan đến Phân khúc Khách hàng**

Nhóm này bao gồm việc định nghĩa và sử dụng các phân khúc khách hàng.

- **Use case: Định nghĩa Phân khúc Khách hàng:**
  - **Actor:** Người dùng (nhân viên marketing/phân tích).
  - **Mục đích:** Tạo hoặc cập nhật tiêu chí cho một phân khúc khách hàng.
  - **Service liên quan:** Được xử lý bởi CustomerSegmentationApplicationService (Command Handler cho DefineCustomerSegmentCommand). Sử dụng CustomerSegmentationService để tạo/cập nhật định nghĩa phân khúc. Sử dụng CustomerSegment Repository. Phát sự kiện CustomerSegmentDefined, audit log cho ALM.
- **Use case: Lấy Danh sách Khách hàng theo Phân khúc:**
  - **Actor:** Hệ thống (từ MPM), Người dùng (cho báo cáo/xuất dữ liệu).
  - **Mục đích:** Truy xuất danh sách các khách hàng thuộc một phân khúc cụ thể.
  - **Service liên quan:** Được xử lý bởi CRMQueryApplicationService (Query Handler cho GetCustomersBySegmentQuery). Sử dụng CustomerSegmentationService hoặc CustomerQueryService để truy vấn Customer Repository dựa trên tiêu chí phân khúc.

## **9\. Domain Services**

Domain Services trong CRM chứa logic nghiệp vụ quan trọng không thuộc về một Aggregate Root cụ thể hoặc cần phối hợp nhiều Aggregate Root.

- **CustomerService:**
  - **Trách nhiệm:** Quản lý vòng đời của Customer Aggregate Root (tạo, cập nhật hồ sơ, thay đổi trạng thái vòng đời, quản lý địa chỉ/liên hệ, liên kết tài nguyên). Thực hiện các quy tắc nghiệp vụ liên quan đến vòng đời khách hàng. Phối hợp với Customer Repository, IAM Service (để lấy thông tin User/Tenant), RDM Service (để kiểm tra loại địa chỉ/liên hệ/quốc gia), NDM Service (để lấy tùy chọn truyền thông).
  - **Các phương thức tiềm năng:** CreateCustomer(tenantId, details, linkedUserId), UpdateCustomerProfile(customerId, tenantId, updates), ChangeCustomerLifecycleStatus(customerId, tenantId, newStatus), AddAddressToCustomer(customerId, tenantId, addressDetails), AddContactPointToCustomer(customerId, tenantId, contactPointDetails), LinkResourceToCustomer(customerId, tenantId, resourceDetails).
- **CaseService:**
  - **Trách nhiệm:** Quản lý vòng đời của ServiceCase Aggregate Root (tạo, cập nhật trạng thái/chi tiết, gán nhân viên, quản lý tương tác liên quan, đóng case). Thực hiện các quy tắc nghiệp vụ liên quan đến xử lý case. Phối hợp với ServiceCase Repository, Customer Repository (để lấy thông tin khách hàng), HRM Service (để lấy thông tin nhân viên được gán), WPM Service (để kích hoạt task/workflow), NDM Service (để gửi thông báo case).
  - **Các phương thức tiềm năng:** CreateServiceCase(tenantId, customerId, details, reportedByUserId), UpdateServiceCase(caseId, tenantId, updates), AssignCaseToUser(caseId, tenantId, assignedToUserId), AddInteractionToCase(caseId, tenantId, interactionDetails), ResolveServiceCase(caseId, tenantId, resolutionDetails), CloseServiceCase(caseId, tenantId).
- **InteractionService:**
  - **Trách nhiệm:** Quản lý vòng đời của CustomerInteraction Entity (nếu tồn tại độc lập). Ghi nhận các tương tác không gắn trực tiếp với Service Case. Phối hợp với Interaction Repository, Customer Repository.
  - **Các phương thức tiềm năng:** RecordInteraction(tenantId, customerId, details, recordedByUserId).
- **CustomerSegmentationService:**
  - **Trách nhiệm:** Định nghĩa và quản lý các quy tắc phân khúc khách hàng. Áp dụng các quy tắc này để xác định khách hàng thuộc phân khúc nào. Phối hợp với CustomerSegment Repository, Customer Repository, các BC khác (để lấy dữ liệu hành vi/giao dịch cho phân khúc).
  - **Các phương thức tiềm năng:** DefineSegment(tenantId, name, criteria), GetCustomersInSegment(segmentId, tenantId).
- **CRMQueryService (Optional Domain Service):** Nếu logic truy vấn phức tạp (tìm kiếm khách hàng/case/tương tác theo nhiều tiêu chí, tổng hợp dữ liệu 360 độ), có thể tách ra.
  - **Trách nhiệm:** Cung cấp các phương thức truy vấn dữ liệu từ Customer, ServiceCase, Interaction. Tổng hợp dữ liệu từ các BC khác để xây dựng Customer 360 View. Phối hợp với Customer Repository, ServiceCase Repository, Interaction Repository, các Query Service của OSM, ODM, PPM, BUM, ITM, WPM, HRM, LZM, RDM.
  - **Các phương thức tiềm năng:** GetCustomerDetails(customerId, tenantId), GetCustomer360View(customerId, tenantId), SearchCustomers(criteria, tenantId), GetServiceCaseDetails(caseId, tenantId), GetCustomerInteractions(customerId, tenantId, criteria).

## **9\. Application Services**

Application Services trong CRM là lớp mỏng điều phối các hành động từ bên ngoài (ví dụ: từ API Gateway, Message Broker) đến Domain Model (Aggregate Roots, Domain Services). Chúng xử lý các tác vụ kỹ thuật như lắng nghe Event, xử lý Query, thực hiện ủy quyền, và gọi Domain Service.

- **CustomerApplicationService:**
  - **Trách nhiệm:** Xử lý các command liên quan đến quản lý Customer từ API (ví dụ: CreateCustomerCommand, UpdateCustomerProfileCommand) hoặc lắng nghe Event từ các BC khác (ví dụ: UserCreatedEvent từ IAM, OrderCompletedEvent từ ODM, SubscriptionStatusChangedEvent từ BUM, TenantDataDeletionRequestedEvent từ BUM). Sử dụng CustomerService và Customer Repository. Thực hiện ủy quyền với IAM (nếu từ API).
  - **Các phương thức tiềm năng:** HandleCreateCustomerCommand(command), HandleUpdateCustomerProfileCommand(command), HandleUserCreatedEvent(event), HandleOrderCompletedEvent(event), HandleSubscriptionStatusChangedEvent(event), HandleTenantDataDeletionRequestedEvent(event).
- **CaseApplicationService:**
  - **Trách nhiệm:** Xử lý các command liên quan đến quản lý ServiceCase từ API (ví dụ: CreateServiceCaseCommand, UpdateServiceCaseCommand) hoặc lắng nghe Event từ các BC khác (ví dụ: ReturnProcessedEvent từ OSM/ODM, TaskCompletedEvent từ WPM). Sử dụng CaseService và ServiceCase Repository. Thực hiện ủy quyền với IAM (nếu từ API).
  - **Các phương thức tiềm năng:** HandleCreateServiceCaseCommand(command), HandleUpdateServiceCaseCommand(command), HandleReturnProcessedEvent(event), HandleTaskCompletedEvent(event).
- **InteractionApplicationService:**
  - **Trách nhiệm:** Xử lý các command liên quan đến ghi nhận tương tác từ API (ví dụ: RecordCustomerInteractionCommand) hoặc lắng nghe Event từ các BC khác (ví dụ: PaymentSuccessfulEvent từ PPM, PromotionAppliedEvent từ MPM, ShipmentCompletedEvent từ SFM). Sử dụng InteractionService hoặc CaseService (nếu tương tác liên quan đến case). Sử dụng Interaction Repository, ServiceCase Repository. Thực hiện ủy quyền với IAM (nếu từ API).
  - **Các phương thức tiềm năng:** HandleRecordCustomerInteractionCommand(command), HandlePaymentSuccessfulEvent(event), HandlePromotionAppliedEvent(event), HandleShipmentCompletedEvent(event).
- **CustomerSegmentationApplicationService:**
  - **Trách nhiệm:** Xử lý các command liên quan đến quản lý phân khúc từ API (ví dụ: DefineCustomerSegmentCommand). Sử dụng CustomerSegmentationService và CustomerSegment Repository. Thực hiện ủy quyền với IAM.
  - **Các phương thức tiềm năng:** HandleDefineCustomerSegmentCommand(command).
- **CRMQueryApplicationService:**
  - **Trách nhiệm:** Xử lý các query để lấy thông tin khách hàng, tương tác, case, phân khúc (ví dụ: GetCustomerDetailsQuery, GetCustomer360ViewQuery, GetCustomersBySegmentQuery). Sử dụng CRMQueryService hoặc các Domain Service khác. Thực hiện ủy quyền với IAM.
  - **Các phương thức tiềm năng:** HandleGetCustomerDetailsQuery(query), HandleGetCustomer360ViewQuery(query), HandleGetCustomersBySegmentQuery(query).

## **10\. Domain Events**

Bounded Context CRM tương tác với các Bounded Context khác thông qua việc phát ra và lắng nghe các Domain Event. Dưới đây là danh sách các event mà CRM phát ra và lắng nghe, bao gồm payload dự kiến của chúng:

### **10.1. Domain Events (CRM Phát ra)**

CRM sẽ phát ra các Domain Event quan trọng để thông báo cho các Bounded Context khác về những thay đổi trạng thái nghiệp vụ trong phạm vi của nó. Dưới đây là danh sách các event và payload dự kiến của chúng:

- **CustomerCreated**
  - Phát ra khi một khách hàng mới được tạo.
  - **Payload:**
    - CustomerId (UUID)
    - TenantId (UUID)
    - CustomerType (String)
    - UserId (UUID, optional)
    - CreatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **CustomerProfileUpdated**
  - Phát ra khi thông tin hồ sơ khách hàng được cập nhật (trừ trạng thái vòng đời).
  - **Payload:**
    - CustomerId (UUID)
    - TenantId (UUID)
    - UpdatedFields (Object \- ví dụ: { "personalInfo": {...}, "addresses": \[...\] })
    - UpdatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **CustomerLifecycleStatusChanged**
  - Phát ra khi trạng thái vòng đời của khách hàng thay đổi.
  - **Payload:**
    - CustomerId (UUID)
    - TenantId (UUID)
    - OldStatus (String)
    - NewStatus (String)
    - UpdatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **CustomerInteractionRecorded**
  - Phát ra khi một tương tác khách hàng được ghi nhận.
  - **Payload:**
    - InteractionId (UUID)
    - TenantId (UUID)
    - CustomerId (UUID)
    - InteractionType (String)
    - InteractionDate (DateTime) **(ở múi giờ UTC)**
    - RecordedByUserId (UUID, optional)
    - RelatedServiceCaseId (UUID, optional)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ServiceCaseCreated**
  - Phát ra khi một trường hợp hỗ trợ mới được tạo.
  - **Payload:**
    - CaseId (UUID)
    - TenantId (UUID)
    - CustomerId (UUID)
    - Title (String)
    - Status (String)
    - Priority (String)
    - CaseType (String)
    - ReportedByUserId (UUID, optional)
    - ReportedViaChannel (String)
    - CreatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ServiceCaseStatusChanged**
  - Phát ra khi trạng thái trường hợp hỗ trợ thay đổi.
  - **Payload:**
    - CaseId (UUID)
    - TenantId (UUID)
    - OldStatus (String)
    - NewStatus (String)
    - UpdatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ServiceCaseAssigned**
  - Phát ra khi trường hợp hỗ trợ được gán cho nhân viên.
  - **Payload:**
    - CaseId (UUID)
    - TenantId (UUID)
    - AssignedToUserId (UUID)
    - AssignedByUserId (UUID, optional)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ServiceCaseResolved**
  - Phát ra khi trường hợp hỗ trợ được đánh dấu là đã giải quyết.
  - **Payload:**
    - CaseId (UUID)
    - TenantId (UUID)
    - ResolutionDetails (String, optional)
    - ResolvedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ServiceCaseClosed**
  - Phát ra khi trường hợp hỗ trợ được đóng.
  - **Payload:**
    - CaseId (UUID)
    - TenantId (UUID)
    - ClosedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **CustomerSegmentDefined**
  - Phát ra khi một định nghĩa phân khúc khách hàng được tạo/cập nhật.
  - **Payload:**
    - SegmentId (UUID)
    - TenantId (UUID)
    - Name (String)
    - Criteria (Object \- mô tả tiêu chí)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**

### **10.2. Domain Events Được Xử lý (Consumed Domain Events)**

CRM lắng nghe và xử lý các Domain Event từ các Bounded Context khác khi các sự kiện đó liên quan đến khách hàng hoặc yêu cầu cập nhật thông tin/tạo case/ghi nhận tương tác. Dưới đây là danh sách các event dự kiến mà CRM lắng nghe và mục đích xử lý của chúng:

- **UserCreatedEvent** (Từ IAM)
  - **Mục đích xử lý:** Tự động tạo hồ sơ Customer mới nếu User được tạo có vai trò là khách hàng của Tenant.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - UserId (UUID)
    - TenantId (UUID)
    - Email (String)
    - FirstName (String, optional)
    - LastName (String, optional)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **OrderCompletedEvent** (Từ ODM)
  - **Mục đích xử lý:** Cập nhật trạng thái vòng đời khách hàng (ví dụ: Lead/Prospect \-\> Active), ghi nhận tương tác, liên kết đơn hàng vào hồ sơ khách hàng 360\.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - OrderId (UUID)
    - TenantId (UUID)
    - CustomerId (UUID)
    - CompletionDate (DateTime) **(ở múi giờ UTC)**
    - TotalAmount (Money Value Object)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **OrderCancelledEvent** (Từ ODM)
  - **Mục đích xử lý:** Ghi nhận tương tác, có thể ảnh hưởng đến trạng thái vòng đời hoặc giá trị khách hàng.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - OrderId (UUID)
    - TenantId (UUID)
    - CustomerId (UUID)
    - CancellationDate (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ReturnProcessedEvent** (Từ OSM/ODM)
  - **Mục đích xử lý:** Tự động tạo Service Case "Xử lý hàng trả lại", ghi nhận tương tác.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - ReturnId (UUID)
    - TenantId (UUID)
    - CustomerId (UUID)
    - ProcessDate (DateTime) **(ở múi giờ UTC)**
    - RelatedOrderId (UUID, optional)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **PaymentSuccessfulEvent** (Từ PPM)
  - **Mục đích xử lý:** Ghi nhận tương tác (giao dịch thanh toán), cập nhật thông tin giá trị khách hàng (tổng chi tiêu), liên kết giao dịch vào hồ sơ khách hàng 360\.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - PaymentTransactionId (UUID)
    - TenantId (UUID)
    - CustomerId (UUID, optional \- nếu thanh toán liên kết trực tiếp với customer)
    - PaymentDate (DateTime) **(ở múi giờ UTC)**
    - Amount (Money Value Object)
    - RelatedOrderId (UUID, optional)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **BillingTransactionSuccessfulEvent** (Từ BUM)
  - **Mục đích xử lý:** Ghi nhận tương tác (giao dịch gói dịch vụ/usage), cập nhật thông tin gói dịch vụ liên quan đến khách hàng, liên kết giao dịch vào hồ sơ khách hàng 360\.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - BillingTransactionId (UUID)
    - TenantId (UUID)
    - CustomerId (UUID, optional \- nếu gói dịch vụ liên kết trực tiếp với customer)
    - TransactionDate (DateTime) **(ở múi giờ UTC)**
    - Amount (Money Value Object)
    - SubscriptionId (UUID)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **SubscriptionStatusChangedEvent** (Từ BUM)
  - **Mục đích xử lý:** Cập nhật trạng thái gói dịch vụ liên quan đến khách hàng, có thể ảnh hưởng đến trạng thái vòng đời khách hàng (ví dụ: Active \-\> Churn nếu gói bị hủy/hết hạn).
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - SubscriptionId (UUID)
    - TenantId (UUID)
    - CustomerId (UUID, optional \- nếu gói dịch vụ liên kết trực tiếp với customer)
    - OldStatus (String)
    - NewStatus (String)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ShipmentCompletedEvent** (Từ SFM)
  - **Mục đích xử lý:** Ghi nhận tương tác (giao hàng hoàn tất), liên kết thông tin vận chuyển vào hồ sơ khách hàng 360\.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - ShipmentId (UUID)
    - TenantId (UUID)
    - CustomerId (UUID, optional \- nếu shipment liên kết trực tiếp với customer)
    - CompletionDate (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **TaskCompletedEvent** (Từ WPM)
  - **Mục đích xử lý:** Cập nhật trạng thái Service Case nếu case đó được liên kết với Task đã hoàn thành trong WPM.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - TaskId (UUID)
    - TenantId (UUID)
    - Status (String \- New Status, ví dụ: "Done")
    - RelatedServiceCaseId (UUID, optional \- ID của Service Case nếu Task liên kết)
    - CompletedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **WorkflowCompletedEvent** (Từ WPM)
  - **Mục đích xử lý:** Tương tự TaskCompletedEvent, cập nhật trạng thái Service Case nếu case đó được liên kết với Workflow đã hoàn thành.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - WorkflowInstanceId (UUID)
    - TenantId (UUID)
    - Status (String \- New Status, ví dụ: "Completed")
    - RelatedServiceCaseId (UUID, optional \- ID của Service Case nếu Workflow liên kết)
    - CompletedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **PromotionAppliedEvent** (Từ MPM)
  - **Mục đích xử lý:** Ghi nhận tương tác (khách hàng sử dụng khuyến mãi), cập nhật thông tin khách hàng (ví dụ: khách hàng quan tâm khuyến mãi), liên kết khuyến mãi vào hồ sơ khách hàng 360\.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - PromotionUsageId (UUID)
    - TenantId (UUID)
    - CustomerId (UUID)
    - PromotionId (UUID)
    - UsageDate (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **TenantDataDeletionRequestedEvent** (Từ BUM)
  - **Mục đích xử lý:** Kích hoạt quy trình xóa tất cả dữ liệu khách hàng, tương tác và service case liên quan đến Tenant đã yêu cầu xóa dữ liệu.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - TenantId (UUID)
    - RequestedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**

_(Lưu ý: Danh sách các sự kiện được xử lý có thể được mở rộng tùy thuộc vào các quy trình nghiệp vụ cụ thể trong hệ thống Ecoma có liên quan đến khách hàng hoặc dịch vụ khách hàng.)_

## **11\. Ranh giới Nghiệp vụ**

Ranh giới của Bounded Context CRM được xác định bởi trách nhiệm quản lý thông tin master về khách hàng, lịch sử tương tác với họ, và các trường hợp hỗ trợ khách hàng. CRM là nguồn sự thật về "ai là khách hàng của chúng ta, chúng ta đã tương tác với họ như thế nào, và chúng ta đang giúp họ giải quyết vấn đề gì".

CRM không chịu trách nhiệm:

- **Xác thực danh tính người dùng:** Chỉ sử dụng dịch vụ của IAM. CRM liên kết với User ID từ IAM.
- **Quản lý quyền truy cập:** Chỉ sử dụng dịch vụ của IAM. IAM kiểm soát quyền của người dùng (khách hàng, nhân viên bán hàng, CSKH, quản lý) trong CRM.
- **Quản lý bản dịch metadata hoặc quy tắc định dạng locale:** Chỉ sử dụng dịch vụ của LZM và RDM.
- **Ghi nhận audit logs:** Chỉ phát sự kiện cho ALM.
- **Xử lý các giao dịch nghiệp vụ gốc:** CRM không xử lý việc tạo đơn hàng, xử lý thanh toán, quản lý gói dịch vụ, quản lý tồn kho, v.v. Nó chỉ nhận dữ liệu liên quan từ các BC chuyên biệt đó để xây dựng Customer 360 View.
- **Quản lý thông tin chi tiết sản phẩm:** Chỉ sử dụng ID/SKU từ PIM.
- **Quản lý chiến dịch marketing chi tiết:** Chỉ cung cấp dữ liệu khách hàng/phân khúc cho MPM và nhận dữ liệu sử dụng khuyến mãi.
- **Quản lý quy trình làm việc phức tạp:** Chỉ kích hoạt Task/Workflow trong WPM và nhận lại trạng thái.
- **Quản lý dữ liệu nhân sự chi tiết:** Chỉ liên kết với User ID của nhân viên nội bộ (lấy thông tin chi tiết từ HRM nếu cần hiển thị).
- **Quản lý tài chính và kế toán:** Chỉ cung cấp dữ liệu liên quan đến khách hàng cho báo cáo.
- **Lưu trữ file đính kèm vật lý:** Chỉ lưu trữ ID tham chiếu đến DAM.
- **Gửi thông báo thực tế:** Chỉ yêu cầu NDM gửi thông báo.

## **12\. Kết luận**

Bounded Context Customer Relationship Management & Service (CRM) là một thành phần quan trọng trong hệ thống Ecoma, cho phép các tổ chức khách hàng quản lý hiệu quả mối quan hệ với khách hàng và cung cấp dịch vụ hỗ trợ chất lượng cao. Bằng cách tập trung trách nhiệm quản lý hồ sơ khách hàng, tương tác, service case và tổng hợp dữ liệu từ các nguồn khác để tạo cái nhìn 360 độ vào một Context duy nhất, CRM cung cấp một nền tảng đáng tin cậy để hiểu rõ khách hàng và phục vụ họ tốt hơn. Việc thiết kế CRM với mô hình domain rõ ràng, các khía cạnh quan trọng của miền được làm rõ, tương tác được định nghĩa và các sự kiện nghiệp vụ phù hợp (bao gồm cả sự kiện lắng nghe) là nền tảng để xây dựng một hệ thống CRM mạnh mẽ và dễ mở rộng, hỗ trợ các hoạt động bán hàng, marketing và dịch vụ khách hàng.

Tài liệu này cung cấp cái nhìn tổng quan chi tiết về CRM, bao gồm mô hình domain, các khíaAspect quan trọng của miền, tương tác, use cases, Domain Service, Application Service và Domain Event (phát ra và lắng nghe với payload dự kiến). Đây là nền tảng để chuyển sang giai đoạn thiết kế kỹ thuật chi tiết và triển khai Microservice CRM.
