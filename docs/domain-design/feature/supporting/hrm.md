# **Tài liệu Thiết kế Miền: Bounded Context Human Resource Management (HRM)**

## **1\. Giới thiệu**

Tài liệu này cung cấp mô tả chi tiết về Bounded Context **Human Resource Management (HRM)** trong hệ thống Ecoma. HRM là một trong những Bounded Context thuộc nhóm Administration Feature, đóng vai trò quản lý các quy trình và dữ liệu cốt lõi liên quan đến nhân viên của tổ chức khách hàng sử dụng nền tảng Ecoma.

HRM giúp các tổ chức quản lý thông tin nhân viên, cấu trúc tổ chức, quy trình tuyển dụng, hợp đồng, lương thưởng, phúc lợi, đánh giá hiệu suất, **giờ làm việc** và các hoạt động nhân sự khác, tích hợp với các phần khác của hệ thống để cung cấp cái nhìn toàn diện về nguồn nhân lực.

## **2\. Phạm vi của Tài liệu**

Tài liệu này tập trung vào việc định nghĩa và mô tả Bounded Context HRM ở cấp độ thiết kế miền (domain design), cung cấp đủ chi tiết để hỗ trợ việc thiết kế các Domain Service và Application Service. Cụ thể, tài liệu này bao gồm:

- Xác định vai trò và trách nhiệm chính của HRM.
- Mô tả các khái niệm và thực thể cốt lõi trong mô hình domain của HRM ở cấp độ chi tiết hơn, bao gồm các Aggregate Root, Entity và Value Object với các thuộc tính chính, có tính đến cấu trúc tổ chức và các khía cạnh nhân sự khác, **đặc biệt bao gồm thông tin giờ làm việc**.
- Định nghĩa Ngôn ngữ Chung (Ubiquitous Language) trong phạm vi HRM.
- Mô tả **Các Khía cạnh Quan trọng của Miền HRM**, làm rõ các quy tắc và cấu trúc nghiệp vụ chi phối hoạt động của Context này, **bao gồm cách quản lý giờ làm việc của nhân viên**.
- Làm rõ các tương tác chính giữa HRM và các Bounded Context khác, **đặc biệt là việc cung cấp thông tin giờ làm việc cho WPM**.
- Phác thảo các **Use cases** chính có sự tham gia của HRM, tập trung vào actor, mục đích và các Domain/Application Service liên quan.
- Xác định ranh giới nghiệp vụ của HRM, nhấn mạnh những gì HRM không chịu trách nhiệm.
- Đề xuất các Domain Service và Application Service tiềm năng trong HRM, mô tả trách nhiệm chính của từng service.
- Xác định và mô tả các **Domain Events** chính mà HRM sẽ phát ra, bao gồm payload dự kiến của từng event, **đặc biệt là sự kiện cập nhật giờ làm việc**.

Tài liệu này **không** đi sâu vào các chi tiết kỹ thuật triển khai cụ thể hoặc mô tả chi tiết các bước thực hiện (how) của từng luồng nghiệp vụ **bên trong các service**. Các khía cạnh sau **không** nằm trong phạm vi của tài liệu này:

- Chi tiết cài đặt kỹ thuật của Microservice HRM.
- Cấu trúc cơ sở dữ liệu chi tiết (schema) của HRM.
- Các quyết định công nghệ cụ thể bên trong HRM.
- Luồng dữ liệu chi tiết đến cấp độ từng trường thông tin giữa HRM và các BC khác.
- Cấu hình hạ tầng triển khai cụ thể cho Microservice HRM.
- Thiết kế giao diện người dùng để quản lý nhân sự.
- Xử lý tính lương chi tiết và thuế (chỉ quản lý dữ liệu liên quan đến lương thưởng).
- Quản lý quy trình tuyển dụng end-to-end (chỉ quản lý thông tin ứng viên và nhân viên sau khi được tuyển dụng).
- Quản lý phúc lợi chi tiết với các nhà cung cấp bên ngoài.
- Tự động hóa các quy trình nhân sự phức tạp (ví dụ: tính toán lương tự động dựa trên giờ làm việc thực tế, quản lý chấm công chi tiết \- chỉ quản lý giờ làm việc theo kế hoạch/quy định).

## **3\. Vai trò và Trách nhiệm Chính**

Bounded Context HRM chịu trách nhiệm quản lý các quy trình và dữ liệu nhân sự. Các trách nhiệm chính bao gồm:

- **Quản lý Hồ sơ Nhân viên:** Tạo, cập nhật, và lưu trữ thông tin chi tiết về nhân viên (thông tin cá nhân, thông tin liên hệ, thông tin công việc, kỹ năng, kinh nghiệm).
- **Quản lý Cấu trúc Tổ chức:** Định nghĩa và quản lý cấu trúc phòng ban, bộ phận, vị trí, chức danh trong tổ chức khách hàng.
- **Quản lý Quan hệ Nhân viên \- Tổ chức:** Liên kết nhân viên với cấu trúc tổ chức (ví dụ: nhân viên thuộc phòng ban nào, giữ chức danh gì).
- **Quản lý Hợp đồng Lao động:** Lưu trữ thông tin hợp đồng lao động của nhân viên (loại hợp đồng, ngày bắt đầu/kết thúc, điều khoản).
- **Quản lý Lương thưởng & Phúc lợi (Dữ liệu Master):** Lưu trữ thông tin liên quan đến lương, phụ cấp, gói phúc lợi của nhân viên. **Lưu ý:** Không tính toán lương thực tế hoặc xử lý chi trả.
- **Quản lý Nghỉ phép:** Cho phép nhân viên yêu cầu nghỉ phép, quản lý số ngày nghỉ phép còn lại, và quy trình phê duyệt nghỉ phép.
- **Quản lý Đánh giá Hiệu suất (Dữ liệu Master):** Lưu trữ kết quả các kỳ đánh giá hiệu suất của nhân viên. **Lưu ý:** Không quản lý quy trình đánh giá chi tiết.
- **Quản lý Kỹ năng & Chứng chỉ:** Lưu trữ thông tin về kỹ năng, chứng chỉ, và quá trình đào tạo bên ngoài của nhân viên.
- **Quản lý Giờ làm việc:** Định nghĩa và quản lý **giờ làm việc theo kế hoạch/quy định** cho từng nhân viên hoặc nhóm nhân viên (ví dụ: 8:00 AM \- 5:00 PM, Thứ Hai \- Thứ Sáu, theo múi giờ cụ thể).
- **Cung cấp Dữ liệu Nhân viên:** Cung cấp thông tin nhân viên (bao gồm cả **giờ làm việc**) cho các BC khác khi cần (ví dụ: cho ITM để gán khóa học, cho WPM để gán công việc và tính toán thời hạn, cho FAM để xử lý chi phí lương).
- **Phát Sự kiện Nghiệp vụ:** Phát ra các Sự kiện Nghiệp vụ quan trọng khi có thay đổi về dữ liệu nhân viên hoặc các quy trình nhân sự cốt lõi, **đặc biệt là khi giờ làm việc của nhân viên thay đổi**.

## **4\. Mô hình Domain (Chi tiết hơn)**

Trong phạm vi Bounded Context HRM, chúng ta xác định các Aggregate Root, Entity và Value Object cốt lõi với các thuộc tính chính:

**Aggregate Roots:**

- **Employee:** Là Aggregate Root đại diện cho một nhân viên trong tổ chức khách hàng. Employee quản lý thông tin hồ sơ cá nhân, thông tin công việc, hợp đồng, giờ làm việc và các dữ liệu nhân sự liên quan.
  - **ID:** Unique identifier (UUID).
  - **TenantId:** ID của tổ chức sở hữu nhân viên (liên kết với IAM).
  - **UserId:** ID của người dùng Ecoma liên kết với nhân viên này (liên kết với IAM). **Mối quan hệ 1-1 hoặc 1-nếu 1 User có nhiều vai trò/vị trí? Giả định 1-1 cho đơn giản ban đầu: Mỗi User nội bộ Ecoma trong một Tenant tương ứng với 1 Employee.**
  - **EmployeeCode:** Mã nhân viên (duy nhất trong Tenant).
  - **PersonalInfo:** Thông tin cá nhân (PersonalInfo Value Object).
  - **ContactInfo:** Thông tin liên hệ (ContactInfo Value Object).
  - **JobInfo:** Thông tin công việc hiện tại (JobInfo Value Object).
  - **EmploymentStatus:** Trạng thái làm việc (EmploymentStatus Value Object: Active, On Leave, Terminated).
  - **HireDate:** Ngày bắt đầu làm việc. **Lưu trữ ở múi giờ UTC.**
  - **TerminationDate:** **Optional** Ngày chấm dứt hợp đồng. **Lưu trữ ở múi giờ UTC.**
  - **Contracts:** Danh sách các EmploymentContract Entities.
  - **LeaveBalances:** Danh sách các LeaveBalance Entities.
  - **Skills:** Danh sách các Skill Value Objects.
  - **Certifications:** Danh sách các Certification Value Objects.
  - **PerformanceReviews:** Danh sách các PerformanceReview Entities.
  - **WorkingHours:** **Optional** Thông tin giờ làm việc theo kế hoạch/quy định (WorkingHours Value Object).
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ UpdatePersonalInfo, UpdateContactInfo, UpdateJobInfo, ChangeEmploymentStatus, AddContract, TerminateContract, RequestLeave, ApproveLeave, RejectLeave, RecordPerformanceReview, **UpdateWorkingHours**.
- **OrganizationalUnit:** Là Aggregate Root đại diện cho một đơn vị trong cấu trúc tổ chức (ví dụ: Phòng ban, Bộ phận). OrganizationalUnit quản lý cấu trúc phân cấp và thông tin của đơn vị.
  - **ID:** Unique identifier (UUID).
  - **TenantId:** ID của tổ chức.
  - **Name:** Tên đơn vị (có thể đa ngôn ngữ, sử dụng LZM).
  - **Type:** Loại đơn vị (OrgUnitType Value Object: Department, Team, Location).
  - **ParentUnitId:** **Optional** ID của đơn vị cha.
  - **HeadOfUnitUserId:** **Optional** ID của người đứng đầu đơn vị (liên kết với IAM).
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ Rename, ChangeParent, AssignHead.
- **JobTitle:** Là Aggregate Root định nghĩa một chức danh công việc.
  - **ID:** Unique identifier (UUID).
  - **TenantId:** ID của tổ chức.
  - **Name:** Tên chức danh (có thể đa ngôn ngữ).
  - **Description:** Mô tả chức danh (có thể đa ngôn ngữ).
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ UpdateDetails.

**Entities (thuộc về các Aggregate Root):**

- **EmploymentContract (thuộc Employee):** Đại diện cho một hợp đồng lao động của nhân viên.
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root Employee.
  - **ContractType:** Loại hợp đồng (ContractType Value Object: Official, Probation, Collaborator).
  - **StartDate:** Ngày bắt đầu. **Lưu trữ ở múi giờ UTC.**
  - **EndDate:** **Optional** Ngày kết thúc (đối với hợp đồng có thời hạn). **Lưu trữ ở múi giờ UTC.**
  - **SignDate:** Ngày ký. **Lưu trữ ở múi giờ UTC.**
  - **SalaryDetails:** Thông tin lương (SalaryDetails Value Object).
  - **Status:** Trạng thái hợp đồng (ContractStatus Value Object: Active, Expired, Terminated).
  - **FileAssetId:** **Optional** ID tham chiếu đến file hợp đồng trong DAM.
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ Terminate.
- **LeaveBalance (thuộc Employee):** Đại diện cho số dư ngày nghỉ phép của nhân viên theo từng loại.
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root Employee.
  - **LeaveType:** Loại nghỉ phép (LeaveType Value Object: Annual Leave, Sick Leave, etc. \- có thể liên kết với RDM).
  - **TotalDays:** Tổng số ngày được cấp trong kỳ.
  - **UsedDays:** Số ngày đã sử dụng.
  - **RemainingDays:** Số ngày còn lại.
  - **Period:** Kỳ tính số dư (ví dụ: năm, tháng).
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ AdjustBalance, DeductDays.
- **LeaveRequest (Entity độc lập):** Đại diện cho một yêu cầu nghỉ phép của nhân viên. Có thể là Aggregate Root riêng nếu quy trình phê duyệt phức tạp, nhưng giả định Entity độc lập thuộc Employee cho đơn giản ban đầu.
  - **ID:** Unique identifier (UUID).
  - **EmployeeId:** ID của nhân viên yêu cầu.
  - **TenantId:** ID của tổ chức.
  - **LeaveType:** Loại nghỉ phép.
  - **StartDate:** Ngày bắt đầu nghỉ. **Lưu trữ ở múi giờ UTC.**
  - **EndDate:** Ngày kết thúc nghỉ. **Lưu trữ ở múi giờ UTC.**
  - **NumberOfDays:** Tổng số ngày nghỉ yêu cầu.
  - **Reason:** Lý do nghỉ.
  - **Status:** Trạng thái yêu cầu (LeaveRequestStatus Value Object: Pending, Approved, Rejected, Cancelled).
  - **RequestedAt:** Thời điểm yêu cầu. **Lưu trữ ở múi giờ UTC.**
  - **ApprovedByUserId:** **Optional** ID người phê duyệt.
  - **ApprovedAt:** **Optional** Thời điểm phê duyệt. **Lưu trữ ở múi giờ UTC.**
  - **Notes:** **Optional** Ghi chú phê duyệt/từ chối.
  - _Behavior:_ Submit, Approve, Reject, Cancel.
- **PerformanceReview (thuộc Employee):** Đại diện cho kết quả một kỳ đánh giá hiệu suất.
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root Employee.
  - **ReviewPeriod:** Kỳ đánh giá.
  - **ReviewDate:** Ngày đánh giá. **Lưu trữ ở múi giờ UTC.**
  - **ReviewerUserId:** ID người đánh giá (liên kết với IAM).
  - **OverallScore:** Điểm tổng thể.
  - **Summary:** Tóm tắt đánh giá.
  - **Goals:** Danh sách các ReviewGoal Value Objects.
  - **FileAssetId:** **Optional** ID tham chiếu đến file đánh giá trong DAM.
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ UpdateDetails.

**Value Objects:**

- **PersonalInfo:** Thông tin cá nhân.
  - **FirstName:**
  - **LastName:**
  - **DateOfBirth:** **Lưu trữ ở múi giờ UTC (chỉ ngày, không giờ)**
  - **Gender:**
  - **Nationality:** (liên kết với RDM)
  - **IdentificationNumber:** (CMND/CCCD/Passport)
  - **TaxCode:** Mã số thuế.
- **ContactInfo:** Thông tin liên hệ.
  - **Email:**
  - **PhoneNumber:**
  - **Address:** (Address Value Object \- có thể dùng chung với BC khác)
- **JobInfo:** Thông tin công việc.
  - **JobTitleId:** ID chức danh (liên kết với JobTitle Aggregate).
  - **OrganizationalUnitId:** ID đơn vị tổ chức (liên kết với OrganizationalUnit Aggregate).
  - **ReportsToUserId:** **Optional** ID người quản lý trực tiếp (liên kết với IAM/Employee).
  - **WorkLocation:** (liên kết với RDM hoặc OrgUnit)
- **EmploymentStatus:** Trạng thái làm việc (Active, On Leave, Terminated).
- **ContractType:** Loại hợp đồng (Official, Probation, Collaborator).
- **ContractStatus:** Trạng thái hợp đồng (Active, Expired, Terminated).
- **SalaryDetails:** Thông tin lương (BaseSalary, Allowances, Currency \- Money Value Object).
- **LeaveType:** Loại nghỉ phép (Annual Leave, Sick Leave, etc.).
- **LeaveRequestStatus:** Trạng thái yêu cầu nghỉ phép (Pending, Approved, Rejected, Cancelled).
- **Skill:** Kỹ năng (Name, Proficiency Level).
- **Certification:** Chứng chỉ (Name, Issuing Organization, Issue Date, Expiration Date, FileAssetId).
- **ReviewGoal:** Mục tiêu đánh giá (Description, Status, Score).
- **OrgUnitType:** Loại đơn vị tổ chức (Department, Team, Location).
- **LocalizedText:** Giá trị văn bản đa ngôn ngữ.
- **Address:** (Street, City, Country, PostalCode) \- có thể dùng chung.
- **WorkingHours:** Thông tin giờ làm việc theo kế hoạch/quy định.
  - **TimeZoneId:** ID múi giờ (ví dụ: "Asia/Ho_Chi_Minh", "America/New_York"). Lấy từ IAM hoặc RDM.
  - **DaysOfWeek:** Danh sách các ngày làm việc trong tuần (ví dụ: \[Monday, Tuesday, Wednesday, Thursday, Friday\]).
  - **StartTime:** Thời gian bắt đầu ngày làm việc (ví dụ: "08:00").
  - **EndTime:** Thời gian kết thúc ngày làm việc (ví dụ: "17:00").
  - **BreakTimes:** **Optional** Danh sách các khoảng thời gian nghỉ trong ngày (ví dụ: \[{StartTime: "12:00", EndTime: "13:00"}\]).
  - **EffectiveDate:** Ngày hiệu lực của quy định giờ làm việc này. **Lưu trữ ở múi giờ UTC.**

## **5\. Ngôn ngữ Chung (Ubiquitous Language)**

Trong Bounded Context HRM, các thuật ngữ sau đây có ý nghĩa cụ thể và nhất quán:

- **Employee:** Một người làm việc cho tổ chức khách hàng.
- **Personnel File:** Hồ sơ chứa thông tin chi tiết về Employee.
- **Organizational Unit:** Một phần của cấu trúc tổ chức (Phòng ban, Bộ phận).
- **Job Title:** Chức danh công việc.
- **Employment Contract:** Hợp đồng lao động.
- **Salary:** Lương cơ bản và các khoản phụ cấp.
- **Benefit:** Phúc lợi (bảo hiểm, trợ cấp...).
- **Leave:** Nghỉ phép (nghỉ thường niên, nghỉ ốm...).
- **Leave Balance:** Số ngày nghỉ phép còn lại.
- **Leave Request:** Yêu cầu xin nghỉ phép.
- **Performance Review:** Đánh giá hiệu suất làm việc.
- **Skill:** Kỹ năng của Employee.
- **Certification:** Chứng chỉ chuyên môn của Employee.
- **Onboarding:** Quy trình tiếp nhận Employee mới.
- **Offboarding:** Quy trình khi Employee rời khỏi tổ chức.
- **Employee Status:** Trạng thái làm việc của Employee (Đang làm việc, Nghỉ phép, Đã nghỉ việc).
- **Org Chart:** Sơ đồ tổ chức.
- **Working Hours:** Khung thời gian trong ngày và các ngày trong tuần mà một người dùng/tổ chức được coi là đang làm việc.
- **Timezone:** Múi giờ liên quan đến giờ làm việc.

## **6\. Các Khía cạnh Quan trọng của Miền HRM**

Phần này mô tả các cấu trúc, quy tắc và khái niệm nghiệp vụ quan trọng chi phối hoạt động của Bounded Context HRM.

### **6.1. Mối quan hệ giữa Employee và User (IAM)**

Mỗi Employee trong HRM được liên kết với một User trong IAM. IAM là nguồn sự thật về danh tính và quyền truy cập cơ bản (đăng nhập, xác thực). HRM là nguồn sự thật về thông tin chi tiết của nhân viên (hồ sơ cá nhân, công việc, hợp đồng, giờ làm việc). Khi một Employee được tạo trong HRM, một User tương ứng cần được tạo hoặc liên kết trong IAM. Ngược lại, khi User được tạo trong IAM với vai trò là nhân viên của một Tenant, thông tin Employee tương ứng cần được tạo trong HRM. Sự đồng bộ này được thực hiện thông qua các Domain Event.

### **6.2. Cấu trúc Tổ chức Phân cấp**

OrganizationalUnit Aggregate Root hỗ trợ cấu trúc phân cấp (ParentUnitId) để mô hình hóa sơ đồ tổ chức phức tạp của các tổ chức khách hàng. Các quy tắc nghiệp vụ cần đảm bảo tính toàn vẹn của cấu trúc này (ví dụ: không cho phép tạo vòng lặp, xử lý khi xóa đơn vị có đơn vị con).

### **6.3. Quản lý Hợp đồng Lao động**

Employee Aggregate Root quản lý danh sách các EmploymentContract Entities. Một nhân viên có thể có nhiều hợp đồng theo thời gian. HRM cần quản lý vòng đời của hợp đồng (Active, Expired, Terminated) và các quy tắc liên quan (ví dụ: chỉ có một hợp đồng chính thức Active tại một thời điểm).

### **6.4. Quản lý Số dư Ngày nghỉ phép**

Employee Aggregate Root quản lý danh sách các LeaveBalance Entities theo từng loại nghỉ phép và kỳ. HRM cần có logic để tính toán và cập nhật số dư ngày nghỉ phép khi nhân viên sử dụng hoặc khi bắt đầu kỳ mới (ví dụ: cấp thêm ngày nghỉ thường niên).

### **6.5. Quản lý Giờ làm việc (Working Hours)**

HRM chịu trách nhiệm quản lý thông tin **giờ làm việc theo kế hoạch/quy định** cho từng nhân viên hoặc áp dụng quy định chung cho một nhóm/phòng ban. Thông tin này bao gồm múi giờ, ngày làm việc trong tuần, thời gian bắt đầu/kết thúc ngày làm việc, và các khoảng nghỉ.

- **Nguồn dữ liệu:** Thông tin giờ làm việc được lưu trữ trong Employee Aggregate Root dưới dạng Value Object WorkingHours. Có thể có quy định giờ làm việc mặc định ở cấp độ Tổ chức (Tenant) được quản lý trong IAM, và giờ làm việc cụ thể của nhân viên trong HRM sẽ ghi đè lên mặc định.
- **Mục đích:** Thông tin giờ làm việc này là dữ liệu master được sử dụng bởi các BC khác, đặc biệt là WPM, để tính toán thời hạn Task một cách chính xác, có tính đến thời gian làm việc thực tế của người được gán task ở các múi giờ khác nhau.
- **Cập nhật:** Khi giờ làm việc của nhân viên thay đổi, HRM cần phát ra sự kiện EmployeeWorkingHoursUpdated để thông báo cho các BC liên quan (ví dụ: WPM) để họ có thể cập nhật hoặc tính toán lại các dữ liệu phụ thuộc (ví dụ: Due Date của các Task đang mở).

### **6.6. Tích hợp với các BC khác cho Dữ liệu Liên quan**

Tương tự WPM, HRM không sở hữu dữ liệu chi tiết của các thực thể liên quan khác như tài sản đính kèm (DAM), dữ liệu tham chiếu (RDM), bản dịch (LZM). HRM chỉ lưu trữ ID tham chiếu và gọi các BC sở hữu dữ liệu đó khi cần.

## **7\. Tương tác với các Bounded Context khác**

HRM tương tác với các Bounded Context khác thông qua cả mô hình bất đồng bộ (Event-Driven) và đồng bộ (Request/Reply).

- **Tương tác với Core BCs:**
  - **IAM:** HRM gọi IAM (Request/Reply) để xác thực và ủy quyền cho người dùng thực hiện các hành động quản lý nhân sự. HRM gọi IAM (Request/Reply) để lấy thông tin chi tiết về User (tên, email, **múi giờ ưa thích**) và thông tin về Tổ chức (**múi giờ của Tổ chức, giờ làm việc mặc định của tổ chức**) dựa trên User ID/Tenant ID. HRM phát Event (EmployeeCreated, EmployeeTerminated) để IAM quản lý tài khoản User tương ứng.
  - **NDM:** HRM yêu cầu NDM gửi thông báo liên quan đến nhân sự (ví dụ: thông báo phê duyệt/từ chối nghỉ phép, nhắc nhở hết hạn hợp đồng, thông báo sinh nhật nhân viên). Yêu cầu này bao gồm thông tin về thời gian (ở UTC) và múi giờ mục tiêu (lấy từ IAM/HRM) để NDM bản địa hóa.
  - **LZM & RDM:** HRM cần LZM để quản lý và hiển thị các trường dữ liệu đa ngôn ngữ (tên phòng ban, chức danh, mô tả công việc). HRM gọi LZM để tra cứu bản dịch và định dạng dữ liệu (ví dụ: ngày tháng). LZM gọi RDM để lấy quy tắc định dạng. HRM cũng cần RDM để lấy dữ liệu tham chiếu toàn cục (ví dụ: danh sách quốc gia, loại tiền tệ, loại nghỉ phép, **danh sách múi giờ**).
  - **ALM:** HRM phát ra các sự kiện audit log (Event) khi có các hành động quan trọng liên quan đến quản lý nhân sự (ví dụ: tạo/cập nhật hồ sơ nhân viên, thay đổi trạng thái làm việc, tạo/phê duyệt/từ chối yêu cầu nghỉ phép, cập nhật thông tin lương, tạo/cập nhật cấu trúc tổ chức, **cập nhật giờ làm việc**).
- **Tương tác với Feature BCs:**
  - **DAM:** HRM phụ thuộc vào DAM để lưu trữ các file tài liệu liên quan đến nhân viên (hợp đồng, chứng chỉ, báo cáo đánh giá). HRM chỉ lưu trữ ID tham chiếu đến các Asset trong DAM và gọi DAM (Request/Reply) khi cần truy cập.
  - **ITM:** ITM có thể cần dữ liệu về cấu trúc tổ chức (phòng ban, chức danh) và danh sách nhân viên thuộc các đơn vị đó từ HRM để gán khóa học đào tạo mục tiêu. HRM có thể cung cấp API Query (Request/Reply) hoặc phát Event khi cấu trúc tổ chức/thông tin công việc nhân viên thay đổi.
  - **WPM:** WPM gọi HRM (Request/Reply) để lấy thông tin chi tiết về Employee (User ID, chức danh, phòng ban, **giờ làm việc**) khi cần gán task hoặc tính toán thời hạn. HRM phát Event (**EmployeeCreated**, **EmployeeProfileUpdated** \- nếu thông tin công việc/giờ làm việc thay đổi, **EmployeeWorkingHoursUpdated**) để WPM lắng nghe và cập nhật thông tin nội bộ hoặc tính toán lại thời hạn task.
  - **FAM:** HRM cung cấp dữ liệu liên quan đến lương thưởng và các khoản chi phí nhân sự khác cho FAM để xử lý kế toán tài chính. Có thể thông qua Event hoặc API Query.
  - **CRM:** CRM có thể cần thông tin về nhân viên (đặc biệt là nhân viên bán hàng hoặc hỗ trợ khách hàng) từ HRM để liên kết với các hoạt động khách hàng.

## **8\. Use cases**

Dưới đây là mô tả các use case chính có sự tham gia của HRM, được tổ chức theo các nhóm chức năng chính, tập trung vào actor, mục đích và các service liên quan.

### **8.1. Use Cases liên quan đến Quản lý Hồ sơ Nhân viên**

Nhóm này bao gồm các use case liên quan đến việc tạo, cập nhật, và quản lý thông tin chi tiết về từng nhân viên.

- **Use case: Onboarding Nhân viên Mới:**
  - **Actor:** Người dùng (có quyền quản lý nhân sự \- Admin/HR Manager).
  - **Mục đích:** Tạo hồ sơ mới cho nhân viên trong hệ thống, bao gồm thông tin cá nhân, liên hệ, công việc ban đầu, và giờ làm việc.
  - **Service liên quan:** Được xử lý bởi EmployeeApplicationService (Command). Sử dụng EmployeeService để tạo Employee Aggregate Root. EmployeeService gọi IAM Service để tạo/liên kết User. EmployeeService sử dụng Employee Repository. Phát sự kiện EmployeeCreated, audit log cho ALM. Phát sự kiện cho IAM (để tạo User nếu cần), WPM (để thông báo có nhân viên mới có thể gán task).
- **Use case: Cập nhật Thông tin Hồ sơ Nhân viên:**
  - **Actor:** Người dùng (có quyền \- Employee/Manager/Admin).
  - **Mục đích:** Chỉnh sửa thông tin trong hồ sơ nhân viên (ví dụ: địa chỉ, số điện thoại, chức danh, phòng ban, người quản lý, **giờ làm việc**).
  - **Service liên quan:** Được xử lý bởi EmployeeApplicationService (Command). Sử dụng EmployeeService để lấy và cập nhật Employee Aggregate Root. EmployeeService gọi IAM/HRM để lấy thông tin giờ làm việc mặc định/cụ thể. EmployeeService sử dụng Employee Repository. Phát sự kiện EmployeeProfileUpdated (bao gồm thông tin thay đổi quan trọng), **EmployeeWorkingHoursUpdated** (nếu giờ làm việc thay đổi), audit log cho ALM. Phát sự kiện cho WPM (nếu thông tin công việc/giờ làm việc thay đổi).
- **Use case: Thay đổi Trạng thái Làm việc của Nhân viên:**
  - **Actor:** Người dùng (có quyền quản lý nhân sự).
  - **Mục đích:** Cập nhật trạng thái làm việc của nhân viên (ví dụ: Active, On Leave, Terminated).
  - **Service liên quan:** Được xử lý bởi EmployeeApplicationService (Command). Sử dụng EmployeeService để lấy và thay đổi trạng thái trong Employee Aggregate Root. EmployeeService sử dụng Employee Repository. Phát sự kiện EmploymentStatusChanged, EmployeeTerminated (nếu trạng thái là Terminated), audit log cho ALM. Phát sự kiện cho IAM (để vô hiệu hóa User nếu chấm dứt), WPM (để cập nhật trạng thái khả dụng của người được gán task).
- **Use case: Xem Chi tiết Hồ sơ Nhân viên:**
  - **Actor:** Người dùng (có quyền xem hồ sơ \- Employee/Manager/Admin).
  - **Mục đích:** Truy xuất và xem thông tin chi tiết về một nhân viên cụ thể.
  - **Service liên quan:** Được xử lý bởi EmployeeQueryApplicationService (Query). Sử dụng EmployeeQueryService để lấy dữ liệu Employee Aggregate Root. EmployeeQueryService gọi IAM/HRM để lấy thông tin User/múi giờ/giờ làm việc, DAM để lấy thông tin asset đính kèm (nếu có). Sử dụng Employee Repository.

### **8.2. Use Cases liên quan đến Cấu trúc Tổ chức**

Nhóm này tập trung vào việc định nghĩa và quản lý cấu trúc phòng ban, bộ phận, chức danh.

- **Use case: Tạo Đơn vị Tổ chức Mới:**
  - **Actor:** Người dùng (có quyền quản lý cấu trúc tổ chức).
  - **Mục đích:** Thêm một phòng ban/bộ phận mới vào sơ đồ tổ chức.
  - **Service liên quan:** Được xử lý bởi OrganizationalStructureApplicationService (Command). Sử dụng OrganizationalStructureService để tạo OrganizationalUnit Aggregate Root. Sử dụng OrganizationalUnit Repository. Phát sự kiện OrganizationalUnitCreated, audit log cho ALM.
- **Use case: Cập nhật Thông tin Đơn vị Tổ chức:**
  - **Actor:** Người dùng (có quyền quản lý cấu trúc tổ chức).
  - **Mục đích:** Chỉnh sửa tên, mô tả, đơn vị cha, hoặc người đứng đầu của đơn vị tổ chức.
  - **Service liên quan:** Được xử lý bởi OrganizationalStructureApplicationService (Command). Sử dụng OrganizationalStructureService để lấy và cập nhật OrganizationalUnit Aggregate Root. Sử dụng OrganizationalUnit Repository. Phát sự kiện OrganizationalUnitUpdated, audit log cho ALM.
- **Use case: Tạo Chức danh Mới:**
  - **Actor:** Người dùng (có quyền quản lý cấu trúc tổ chức).
  - **Mục đích:** Thêm một chức danh công việc mới.
  - **Service liên quan:** Được xử lý bởi OrganizationalStructureApplicationService (Command). Sử dụng OrganizationalStructureService để tạo JobTitle Aggregate Root. Sử dụng JobTitle Repository. Phát sự kiện JobTitleCreated, audit log cho ALM.
- **Use case: Xem Sơ đồ Tổ chức:**
  - **Actor:** Người dùng (có quyền xem sơ đồ tổ chức).
  - **Mục đích:** Xem cấu trúc phân cấp của các đơn vị tổ chức và danh sách nhân viên thuộc từng đơn vị.
  - **Service liên quan:** Được xử lý bởi EmployeeQueryApplicationService (Query). Sử dụng EmployeeQueryService để lấy dữ liệu OrganizationalUnit và Employee (thông tin công việc). Sử dụng OrganizationalUnit Repository, Employee Repository.

### **8.3. Use Cases liên quan đến Quản lý Nghỉ phép**

Nhóm này bao gồm quy trình nhân viên yêu cầu nghỉ phép và được phê duyệt.

- **Use case: Gửi Yêu cầu Nghỉ phép:**
  - **Actor:** Nhân viên (Employee/User).
  - **Mục đích:** Gửi yêu cầu xin nghỉ phép đến người quản lý hoặc bộ phận nhân sự.
  - **Service liên quan:** Được xử lý bởi LeaveApplicationService (Command). Sử dụng LeaveService để tạo LeaveRequest Entity. LeaveService sử dụng LeaveRequest Repository và Employee Repository (để kiểm tra số dư ngày nghỉ). Phát sự kiện LeaveRequestSubmitted, audit log cho ALM. Yêu cầu NDM gửi thông báo đến người phê duyệt.
- **Use case: Phê duyệt/Từ chối Yêu cầu Nghỉ phép:**
  - **Actor:** Người quản lý hoặc người có quyền phê duyệt (qua IAM).
  - **Mục đích:** Duyệt hoặc từ chối yêu cầu nghỉ phép của nhân viên.
  - **Service liên quan:** Được xử lý bởi LeaveApplicationService (Command). Sử dụng LeaveService để lấy và cập nhật LeaveRequest Entity. LeaveService cập nhật số dư ngày nghỉ trong Employee Aggregate Root nếu yêu cầu được phê duyệt. Sử dụng LeaveRequest Repository, Employee Repository. Phát sự kiện LeaveRequestApproved/Rejected, LeaveBalanceUpdated (nếu phê duyệt), audit log cho ALM. Yêu cầu NDM gửi thông báo đến nhân viên yêu cầu.

## **9\. Domain Services**

Domain Services trong HRM chứa logic nghiệp vụ quan trọng không thuộc về một Aggregate Root cụ thể hoặc cần phối hợp nhiều Aggregate Root.

- **EmployeeService:**
  - **Trách nhiệm:** Quản lý vòng đời của Employee (tạo, cập nhật, thay đổi trạng thái làm việc). Quản lý các Entities con như Contracts, LeaveBalances, PerformanceReviews trong Employee Aggregate. **Đặc biệt, quản lý thông tin giờ làm việc (WorkingHours) của Employee và thực hiện logic cập nhật giờ làm việc.** Phối hợp với Employee Repository, IAM Service (để tạo/cập nhật User, lấy thông tin múi giờ/giờ làm việc mặc định), HRM Repository, DAM Service (để liên kết tài liệu).
  - **Các phương thức tiềm năng:** CreateEmployee(tenantId, details, createdByUserId), UpdateEmployee(employeeId, tenantId, updates, updatedByUserId), ChangeEmploymentStatus(employeeId, tenantId, newStatus, changedByUserId), AddEmploymentContract(employeeId, tenantId, contractDetails), TerminateEmploymentContract(contractId, tenantId, terminationDetails), RecordPerformanceReview(employeeId, tenantId, reviewDetails), **UpdateWorkingHours(employeeId, tenantId, workingHoursDetails, updatedByUserId)**.
- **OrganizationalStructureService:**
  - **Trách nhiệm:** Quản lý vòng đời của OrganizationalUnit và JobTitle. Quản lý cấu trúc phân cấp đơn vị tổ chức. Phối hợp với OrganizationalUnit Repository, JobTitle Repository.
  - **Các phương thức tiềm năng:** CreateOrganizationalUnit(tenantId, details), UpdateOrganizationalUnit(unitId, tenantId, updates), ChangeParentUnit(unitId, tenantId, newParentId), CreateJobTitle(tenantId, details), UpdateJobTitle(jobTitleId, tenantId, updates).
- **LeaveService:**
  - **Trách nhiệm:** Quản lý vòng đời của LeaveRequest. Xử lý yêu cầu, phê duyệt/từ chối, cập nhật số dư ngày nghỉ phép trong Employee Aggregate. Phối hợp với LeaveRequest Repository, Employee Repository.
  - **Các phương thức tiềm năng:** SubmitLeaveRequest(employeeId, tenantId, requestDetails), ApproveLeaveRequest(requestId, tenantId, approvedByUserId, notes), RejectLeaveRequest(requestId, tenantId, rejectedByUserId, notes), CancelLeaveRequest(requestId, tenantId).
- **HRMQueryService (Optional Domain Service):** Nếu logic truy vấn phức tạp (tìm kiếm nhân viên, lọc theo nhiều tiêu chí, lấy danh sách theo phòng ban/chức danh, lấy thông tin giờ làm việc), có thể tách ra.
  - **Trách nhiệm:** Cung cấp các phương thức truy vấn dữ liệu Employee, OrganizationalUnit, JobTitle. Phối hợp với Employee Repository, OrganizationalUnit Repository, JobTitle Repository, LZM Service, IAM Service (để lấy thông tin User, múi giờ), **HRM Repository (để lấy thông tin giờ làm việc)**.
  - **Các phương thức tiềm năng:** GetEmployeeDetails(employeeId, tenantId), SearchEmployees(criteria, tenantId), GetEmployeesByOrgUnit(unitId, tenantId), GetOrgChart(tenantId), **GetEmployeeWorkingHours(employeeId, tenantId)**.

## **10\. Application Services**

Application Services trong HRM là lớp mỏng điều phối các hành động từ bên ngoài (ví dụ: từ API Gateway, Message Broker) đến Domain Model (Aggregate Roots, Domain Services). Chúng xử lý các tác vụ kỹ thuật như xác thực, ủy quyền (thông qua IAM), giao dịch cơ sở dữ liệu, và phát sự kiện.

- **EmployeeApplicationService:**
  - **Trách nhiệm:** Xử lý các command liên quan đến quản lý Employee từ API (ví dụ: CreateEmployeeCommand, UpdateEmployeeProfileCommand, ChangeEmploymentStatusCommand, **UpdateEmployeeWorkingHoursCommand**). Sử dụng EmployeeService và Employee Repository. Thực hiện ủy quyền với IAM. Lắng nghe các event liên quan đến User từ IAM (ví dụ: UserCreatedEvent) để xử lý các trường hợp đồng bộ User/Employee.
  - **Các phương thức tiềm năng:** HandleCreateEmployeeCommand(command), HandleUpdateEmployeeProfileCommand(command), HandleChangeEmploymentStatusCommand(command), **HandleUpdateEmployeeWorkingHoursCommand(command)**, HandleUserCreatedEvent(event).
- **OrganizationalStructureApplicationService:**
  - **Trách nhiệm:** Xử lý các command liên quan đến quản lý cấu trúc tổ chức từ API (ví dụ: CreateOrganizationalUnitCommand, CreateJobTitleCommand). Sử dụng OrganizationalStructureService và các Repository tương ứng. Thực hiện ủy quyền với IAM.
  - **Các phương thức tiềm năng:** HandleCreateOrganizationalUnitCommand(command), HandleCreateJobTitleCommand(command).
- **LeaveApplicationService:**
  - **Trách nhiệm:** Xử lý các command liên quan đến quản lý nghỉ phép từ API (ví dụ: SubmitLeaveRequestCommand, ApproveLeaveRequestCommand). Sử dụng LeaveService và các Repository tương ứng. Thực hiện ủy quyền với IAM.
  - **Các phương thức tiềm năng:** HandleSubmitLeaveRequestCommand(command), HandleApproveLeaveRequestCommand(command).
- **HRMQueryApplicationService:**
  - **Trách nhiệm:** Xử lý các query để lấy thông tin nhân viên, cấu trúc tổ chức (ví dụ: GetEmployeeDetailsQuery, GetOrgChartQuery, **GetEmployeeWorkingHoursQuery**). Sử dụng HRMQueryService hoặc các Domain Service khác. Thực hiện ủy quyền với IAM.
  - **Các phương thức tiềm năng:** HandleGetEmployeeDetailsQuery(query), HandleGetOrgChartQuery(query), **HandleGetEmployeeWorkingHoursQuery(query)**.

## **10\. Domain Events**

HRM sẽ phát ra các Domain Event quan trọng để thông báo cho các Bounded Context khác về những thay đổi trạng thái nghiệp vụ trong phạm vi của nó.

- **EmployeeCreated:** Phát ra khi một nhân viên mới được tạo.
  - **Payload:**
    - EmployeeId (UUID)
    - TenantId (UUID)
    - UserId (UUID, optional)
    - EmployeeCode (String)
    - JobInfo (JobInfo Value Object \- thông tin công việc chính)
    - WorkingHours (WorkingHours Value Object, optional)
    - CreatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **EmployeeProfileUpdated:** Phát ra khi thông tin hồ sơ nhân viên được cập nhật (trừ trạng thái làm việc và giờ làm việc).
  - **Payload:**
    - EmployeeId (UUID)
    - TenantId (UUID)
    - UpdatedFields (Object \- ví dụ: { "personalInfo": {...}, "contactInfo": {...} })
    - UpdatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **EmploymentStatusChanged:** Phát ra khi trạng thái làm việc của nhân viên thay đổi.
  - **Payload:**
    - EmployeeId (UUID)
    - TenantId (UUID)
    - OldStatus (String)
    - NewStatus (String)
    - UpdatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **EmployeeTerminated:** Phát ra khi nhân viên chấm dứt hợp đồng làm việc.
  - **Payload:**
    - EmployeeId (UUID)
    - TenantId (UUID)
    - TerminationDate (DateTime, optional) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **EmployeeWorkingHoursUpdated:** Phát ra khi thông tin giờ làm việc của nhân viên được cập nhật.
  - **Payload:**
    - EmployeeId (UUID)
    - TenantId (UUID)
    - WorkingHours (WorkingHours Value Object, optional)
    - UpdatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **OrganizationalUnitCreated:** Phát ra khi một đơn vị tổ chức mới được tạo.
  - **Payload:**
    - UnitId (UUID)
    - TenantId (UUID)
    - Name (LocalizedText/String)
    - Type (String)
    - ParentUnitId (UUID, optional)
    - CreatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **OrganizationalUnitUpdated:** Phát ra khi thông tin đơn vị tổ chức được cập nhật.
  - **Payload:**
    - UnitId (UUID)
    - TenantId (UUID)
    - UpdatedFields (Object)
    - UpdatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **JobTitleCreated:** Phát ra khi một chức danh mới được tạo.
  - **Payload:**
    - JobTitleId (UUID)
    - TenantId (UUID)
    - Name (LocalizedText/String)
    - CreatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **JobTitleUpdated:** Phát ra khi thông tin chức danh được cập nhật.
  - **Payload:**
    - JobTitleId (UUID)
    - TenantId (UUID)
    - UpdatedFields (Object)
    - UpdatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **LeaveRequestSubmitted:** Phát ra khi yêu cầu nghỉ phép được gửi.
  - **Payload:**
    - RequestId (UUID)
    - EmployeeId (UUID)
    - TenantId (UUID)
    - LeaveType (String)
    - StartDate (DateTime) **(ở múi giờ UTC)**
    - EndDate (DateTime) **(ở múi giờ UTC)**
    - NumberOfDays (Decimal)
    - Status (String)
    - RequestedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **LeaveRequestApproved:** Phát ra khi yêu cầu nghỉ phép được phê duyệt.
  - **Payload:**
    - RequestId (UUID)
    - EmployeeId (UUID)
    - TenantId (UUID)
    - ApprovedByUserId (UUID)
    - ApprovedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **LeaveRequestRejected:** Phát ra khi yêu cầu nghỉ phép bị từ chối.
  - **Payload:**
    - RequestId (UUID)
    - EmployeeId (UUID)
    - TenantId (UUID)
    - RejectedByUserId (UUID)
    - RejectedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **LeaveRequestCancelled:** Phát ra khi yêu cầu nghỉ phép bị hủy.
  - **Payload:**
    - RequestId (UUID)
    - EmployeeId (UUID)
    - TenantId (UUID)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **LeaveBalanceUpdated:** Phát ra khi số dư ngày nghỉ phép của nhân viên thay đổi.
  - **Payload:**
    - EmployeeId (UUID)
    - TenantId (UUID)
    - LeaveType (String)
    - OldBalance (Decimal)
    - NewBalance (Decimal)
    - UpdatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **PerformanceReviewRecorded:** Phát ra khi kết quả đánh giá hiệu suất được ghi nhận.
  - **Payload:**
    - EmployeeId (UUID)
    - TenantId (UUID)
    - ReviewPeriod (String)
    - ReviewDate (DateTime) **(ở múi giờ UTC)**
    - OverallScore (Decimal)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**

## **11\. Ranh giới Nghiệp vụ**

Ranh giới của Bounded Context HRM được xác định bởi trách nhiệm quản lý thông tin chi tiết về nhân viên, cấu trúc tổ chức, hợp đồng, dữ liệu liên quan đến lương/phúc lợi, quy trình nghỉ phép, và **giờ làm việc theo kế hoạch/quy định**. HRM là nguồn sự thật về dữ liệu master của nhân viên trong tổ chức khách hàng.

HRM không chịu trách nhiệm:

- **Xác thực danh tính người dùng:** Chỉ sử dụng dịch vụ của IAM. HRM liên kết với User ID từ IAM.
- **Quản lý quyền truy cập:** Chỉ sử dụng dịch vụ của IAM. IAM kiểm soát quyền của người dùng (nhân viên, quản lý, admin nhân sự) trong HRM.
- **Lưu trữ file tài liệu vật lý:** Trách nhiệm này thuộc về DAM. HRM chỉ lưu trữ ID tham chiếu.
- **Quản lý bản dịch văn bản hoặc quy tắc định dạng locale:** Chỉ sử dụng dịch vụ của LZM và RDM.
- **Ghi nhận audit logs:** Chỉ phát sự kiện cho ALM.
- **Tính toán lương thực tế và xử lý chi trả:** Việc này thuộc về một hệ thống tính lương chuyên biệt hoặc FAM. HRM chỉ cung cấp dữ liệu đầu vào liên quan đến lương.
- **Quản lý quy trình tuyển dụng chi tiết:** Các bước phỏng vấn, theo dõi ứng viên (có thể thuộc về một BC Recruitment riêng hoặc là một phần của CRM mở rộng). HRM chỉ quản lý thông tin Employee sau khi được tuyển dụng.
- **Quản lý phúc lợi chi tiết với nhà cung cấp:** Việc tích hợp với các công ty bảo hiểm, quỹ hưu trí, v.v. nằm ngoài phạm vi.
- **Quản lý các miền nghiệp vụ khác** như sản phẩm, đơn hàng, khách hàng, tài chính (trừ dữ liệu đầu vào cho FAM), vận chuyển, tồn kho, đào tạo (chỉ cung cấp dữ liệu nhân viên cho ITM). **Tuy nhiên, HRM là nguồn cung cấp thông tin giờ làm việc cho WPM.**
- **Tự động hóa quy trình nghiệp vụ phức tạp:** HRM tập trung vào quản lý dữ liệu master và các quy trình cốt lõi. Các logic tự động hóa phức tạp hơn có thể nằm ở lớp Application Service hoặc các BC chuyên biệt khác.
- **Quản lý chấm công chi tiết:** HRM quản lý giờ làm việc theo kế hoạch/quy định, không phải dữ liệu chấm công thực tế hàng ngày.

## **12\. Kết luận**

Bounded Context Human Resource Management (HRM) là một thành phần quan trọng trong hệ thống Ecoma, cho phép các tổ chức khách hàng quản lý hiệu quả nguồn nhân lực của mình. Bằng cách tập trung trách nhiệm quản lý thông tin nhân viên, cấu trúc tổ chức, các quy trình nhân sự cốt lõi và **giờ làm việc theo kế hoạch** vào một Context duy nhất, HRM cung cấp một nền tảng dữ liệu đáng tin cậy và hỗ trợ các hoạt động quản lý nội bộ. Việc thiết kế HRM với mô hình domain rõ ràng, các khía cạnh quan trọng của miền được làm rõ (bao gồm cả quản lý giờ làm việc), tương tác được định nghĩa và các sự kiện nghiệp vụ phù hợp là nền tảng để xây dựng một hệ thống quản lý nhân sự mạnh mẽ và dễ mở rộng, đồng thời đảm bảo tính nhất quán với cấu trúc tài liệu của các Core BCs như ALM, BUM, IAM và Feature BC như WPM.

Tài liệu này cung cấp cái nhìn tổng quan chi tiết về HRM, bao gồm mô hình domain, các khía cạnh quan trọng của miền, tương tác, use cases, Domain Service, Application Service và Domain Event (phát ra với payload dự kiến). Đây là nền tảng để chuyển sang giai đoạn thiết kế kỹ thuật chi tiết và triển khai Microservice HRM.
