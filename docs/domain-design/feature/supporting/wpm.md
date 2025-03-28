# **Tài liệu Thiết kế Miền: Bounded Context Work & Process Management (WPM)**

## **1\. Giới thiệu**

Tài liệu này cung cấp mô tả chi tiết về Bounded Context **Work & Process Management (WPM)** trong hệ thống Ecoma. WPM là một trong những Bounded Context thuộc nhóm Administration Feature, đóng vai trò quản lý các đơn vị công việc (Task), cấu trúc quy trình làm việc (Workflow) và tập hợp các công việc/quy trình theo Dự án (Project) cho các tổ chức khách hàng sử dụng nền tảng SaaS của Ecoma.

WPM giúp các tổ chức định nghĩa, tổ chức, gán nguồn lực, theo dõi tiến độ và quản lý các công việc đang diễn ra, từ các task đơn lẻ đến các quy trình phức tạp và các dự án lớn, tích hợp với các phần khác của hệ thống để cung cấp khả năng quản lý hoạt động hiệu quả.

## **2\. Phạm vi của Tài liệu**

Tài liệu này tập trung vào việc định nghĩa và mô tả Bounded Context WPM ở cấp độ thiết kế miền (domain design), cung cấp đủ chi tiết để hỗ trợ việc thiết kế các Domain Service và Application Service. Cụ thể, tài liệu này bao gồm:

- Xác định vai trò và trách nhiệm chính của WPM.
- Mô tả các khái niệm và thực thể cốt lõi trong mô hình domain của WPM ở cấp độ chi tiết hơn, bao gồm các Aggregate Root, Entity và Value Object với các thuộc tính chính, có tính đến mối quan hệ giữa Task, Workflow và Project.
- Định nghĩa Ngôn ngữ Chung (Ubiquitous Language) trong phạm vi WPM.
- Mô tả **Các Khía cạnh Quan trọng của Miền WPM**, làm rõ các quy tắc và cấu trúc nghiệp vụ chi phối hoạt động của Context này, bao gồm cả chiến lược xử lý múi giờ và tính toán thời hạn dựa trên giờ làm việc.
- Làm rõ các tương tác chính giữa WPM và các Bounded Context khác.
- Phác thảo các **Use cases** chính có sự tham gia của WPM, tập trung vào actor, mục đích và các Domain/Application Service liên quan.
- Xác định ranh giới nghiệp vụ của WPM, nhấn mạnh những gì WPM không chịu trách nhiệm.
- Đề xuất các Domain Service và Application Service tiềm năng trong WPM, mô tả trách nhiệm chính của từng service.
- Liệt kê và mô tả các **Domain Events** mà WPM tương tác, được chia thành các sự kiện WPM **phát ra** (Published Events) và các sự kiện WPM **lắng nghe và xử lý** (Consumed Events), bao gồm payload dự kiến của từng event.

Tài liệu này **không** đi sâu vào các chi tiết kỹ thuật triển khai cụ thể hoặc mô tả chi tiết các bước thực hiện (how) của từng luồng nghiệp vụ **bên trong các service**. Các khía cạnh sau **không** nằm trong phạm vi của tài liệu này:

- Chi tiết cài đặt kỹ thuật của Microservice WPM (ngôn ngữ lập trình, framework, kiến trúc nội bộ chi tiết).
- Cấu trúc cơ sở dữ liệu chi tiết (schema) của WPM.
- Các quyết định công nghệ cụ thể bên trong WPM (ví dụ: công cụ xây dựng workflow trực quan).
- Luồng dữ liệu chi tiết đến cấp độ từng trường thông tin giữa WPM và các BC khác.
- Cấu hình hạ tầng triển khai cụ thể cho Microservice WPM.
- Thiết kế giao diện người dùng để quản lý công việc và quy trình.
- Quản lý nội dung chi tiết của các tài nguyên liên quan đến công việc (sản phẩm, khách hàng, tài liệu) \- chỉ lưu trữ ID tham chiếu.
- Tự động hóa quy trình nghiệp vụ phức tạp dựa trên logic điều kiện (Business Process Automation \- BPA) vượt ra ngoài việc theo dõi trạng thái Task/Workflow.

## **3\. Vai trò và Trách nhiệm Chính**

Bounded Context WPM chịu trách nhiệm quản lý công việc và quy trình. Các trách nhiệm chính bao gồm:

- **Quản lý Task:** Tạo, cập nhật, xóa (logic xóa mềm), và quản lý vòng đời của các task đơn lẻ. Một task có thể được gán cho một hoặc nhiều người thực hiện, có thời hạn, mô tả, và trạng thái.
- **Quản lý Workflow Definition:** Định nghĩa các mẫu quy trình làm việc (Workflow Template) bao gồm chuỗi các bước (Step) hoặc task theo trình tự hoặc song song.
- **Quản lý Workflow Instance:** Tạo và quản lý các phiên bản cụ thể của Workflow Definition khi một quy trình được khởi tạo. Theo dõi trạng thái của từng bước/task trong Workflow Instance.
- **Quản lý Project:** Tạo, cập nhật, xóa (logic xóa mềm), và quản lý vòng đời của các dự án. Một project có thể chứa các task và/hoặc workflow instance.
- **Quản lý Quan hệ Task \- Workflow \- Project:** Liên kết task với workflow instance hoặc project, và liên kết workflow instance với project.
- **Gán Người thực hiện & Theo dõi Nguồn lực:** Gán task hoặc workflow instance cho một hoặc nhiều người dùng (liên kết với IAM/HRM). Theo dõi nguồn lực được phân bổ.
- **Theo dõi Tiến độ:** Cập nhật và theo dõi tiến độ thực hiện của task, workflow instance và project.
- **Quản lý Thời hạn:** Đặt và theo dõi thời hạn (Due Date) cho task, workflow instance và project.
- **Quản lý Tài nguyên Liên quan:** Liên kết task, workflow, project với các tài nguyên nghiệp vụ khác (ví dụ: liên kết task "Xử lý khiếu nại" với Order ID từ ODM, liên kết task "Chuẩn bị nội dung" với Product ID từ PIM). WPM chỉ lưu trữ ID tham chiếu.
- **Báo cáo Công việc:** Cung cấp khả năng tạo các báo cáo về tình hình công việc (ví dụ: task quá hạn, tiến độ dự án, phân bổ nguồn lực).
- **Phát Sự kiện Nghiệp vụ:** Phát ra các Sự kiện Nghiệp vụ quan trọng khi có thay đổi về trạng thái task, workflow, project hoặc khi task/workflow hoàn thành.

## **4\. Mô hình Domain (Chi tiết hơn)**

Trong phạm vi Bounded Context WPM, chúng ta xác định các Aggregate Root, Entity và Value Object cốt lõi với các thuộc tính chính:

**Aggregate Roots:**

- **Task:** Là Aggregate Root đại diện cho một đơn vị công việc cụ thể. Task quản lý thông tin chi tiết, người thực hiện, thời hạn và trạng thái của nó.
  - **ID:** Unique identifier (UUID).
  - **TenantId:** ID của tổ chức sở hữu task (liên kết với IAM).
  - **Title:** Tiêu đề task.
  - **Description:** Mô tả chi tiết task (có thể đa ngôn ngữ, sử dụng LZM).
  - **Status:** Trạng thái task (TaskStatus Value Object: To Do, In Progress, Done, Blocked, Cancelled).
  - **AssigneeUserIds:** Danh sách các User ID được gán thực hiện task (liên kết với IAM/HRM).
  - **DueDate:** **Optional** Thời hạn hoàn thành. **Lưu trữ ở múi giờ UTC. Việc hiển thị và xử lý logic liên quan đến múi giờ và giờ làm việc được mô tả chi tiết trong phần 6.10.**
  - **CompletedAt:** **Optional** Thời điểm hoàn thành. **Lưu trữ ở múi giờ UTC.**
  - **Priority:** Mức độ ưu tiên (Priority Value Object: Low, Medium, High, Urgent).
  - **RelatedResources:** Danh sách các RelatedResource Value Objects (liên kết đến các thực thể nghiệp vụ khác).
  - **Comments:** Danh sách các Comment Entities.
  - **FileAssetIds:** Danh sách các ID tài sản đính kèm (liên kết với DAM).
  - **ParentTaskId:** **Optional** ID task cha (để tạo task con).
  - **WorkflowInstanceId:** **Optional** ID của Workflow Instance chứa task này.
  - **ProjectId:** **Optional** ID của Project chứa task này.
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ AssignToUser, ChangeStatus, SetDueDate, AddComment, LinkResource, UnlinkResource, AttachAsset, DetachAsset.
- **WorkflowDefinition:** Là Aggregate Root định nghĩa cấu trúc của một loại quy trình làm việc.
  - **ID:** Unique identifier (UUID).
  - **TenantId:** ID của tổ chức sở hữu định nghĩa workflow.
  - **Name:** Tên định nghĩa workflow.
  - **Description:** Mô tả định nghĩa workflow (có thể đa ngôn ngữ).
  - **Status:** Trạng thái định nghĩa (WorkflowDefinitionStatus Value Object: Draft, Active, Archived).
  - **Steps:** Danh sách các WorkflowStep Entities.
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ Activate, Archive, AddStep, RemoveStep, UpdateStepOrder.
- **WorkflowInstance:** Là Aggregate Root đại diện cho một lần thực thi cụ thể của một Workflow Definition.
  - **ID:** Unique identifier (UUID).
  - **TenantId:** ID của tổ chức.
  - **WorkflowDefinitionId:** ID của Workflow Definition mà instance này dựa trên.
  - **Status:** Trạng thái workflow instance (WorkflowInstanceStatus Value Object: Not Started, In Progress, Completed, Cancelled, Failed).
  - **StartedAt:** Thời điểm bắt đầu. **Lưu trữ ở múi giờ UTC.**
  - **CompletedAt:** **Optional** Thời điểm hoàn thành. **Lưu trữ ở múi giờ UTC.**
  - **DueDate:** **Optional** Thời hạn hoàn thành. **Lưu trữ ở múi giờ UTC. Việc hiển thị và xử lý logic liên quan đến múi giờ và giờ làm việc được mô tả chi tiết trong phần 6.10.**
  - **InitiatedByUserId:** ID người khởi tạo (liên kết với IAM).
  - **Tasks:** Danh sách các Task Entities (các task được tạo ra bởi instance này).
  - **CurrentStep:** **Optional** ID của Workflow Step đang được thực hiện.
  - **RelatedResources:** Danh sách các RelatedResource Value Objects (liên kết đến các thực thể nghiệp vụ khác).
  - **ProjectId:** **Optional** ID của Project chứa workflow instance này.
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ Start, CompleteStep, Cancel, Fail, LinkResource, UnlinkResource.
- **Project:** Là Aggregate Root đại diện cho một dự án. Project quản lý thông tin chung và tập hợp các task/workflow instance.
  - **ID:** Unique identifier (UUID).
  - **TenantId:** ID của tổ chức.
  - **Name:** Tên dự án.
  - **Description:** Mô tả dự án (có thể đa ngôn ngữ).
  - **Status:** Trạng thái dự án (ProjectStatus Value Object: Not Started, In Progress, Completed, Archived).
  - **StartDate:** Ngày bắt đầu dự kiến/thực tế. **Lưu trữ ở múi giờ UTC.**
  - **EndDate:** **Optional** Ngày kết thúc dự kiến/thực tế. **Lưu trữ ở múi giờ UTC.**
  - **ManagerUserId:** **Optional** ID người quản lý dự án (liên kết với IAM/HRM).
  - **Tasks:** Danh sách các Task ID thuộc project này.
  - **WorkflowInstances:** Danh sách các Workflow Instance ID thuộc project này.
  - **RelatedResources:** Danh sách các RelatedResource Value Objects.
  - **FileAssetIds:** Danh sách các ID tài sản đính kèm (liên kết với DAM).
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ Start, Complete, Archive, AddTask, RemoveTask, AddWorkflowInstance, RemoveWorkflowInstance, AssignManager, LinkResource, UnlinkResource, AttachAsset, DetachAsset.

**Entities (thuộc về các Aggregate Root):**

- **WorkflowStep (thuộc WorkflowDefinition):** Đại diện cho một bước trong định nghĩa workflow.
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root WorkflowDefinition.
  - **Name:** Tên bước (có thể đa ngôn ngữ).
  - **Description:** Mô tả bước (có thể đa ngôn ngữ).
  - **Order:** Thứ tự trong workflow.
  - **StepType:** Loại bước (StepType Value Object: Task, Approval, Notification, Integration \- Integration có thể là trigger event/command đến BC khác).
  - **TaskDetails:** **Optional** Thông tin tạo Task nếu StepType là Task (TaskCreationDetails Value Object).
  - **ApprovalDetails:** **Optional** Thông tin phê duyệt nếu StepType là Approval (ApprovalDetails Value Object).
  - **NotificationDetails:** **Optional** Thông tin thông báo nếu StepType là Notification (NotificationDetails Value Object).
  - **IntegrationDetails:** **Optional** Thông tin tích hợp nếu StepType là Integration (IntegrationDetails Value Object).
  - **NextSteps:** Danh sách các ID của các bước tiếp theo (để định nghĩa luồng).
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ UpdateDetails, AddNextStep, RemoveNextStep.
- **Comment (thuộc Task hoặc Project):** Đại diện cho một bình luận liên quan đến task hoặc project.
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root Task/Project.
  - **UserId:** ID của người bình luận (liên kết với IAM).
  - **Content:** Nội dung bình luận.
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ UpdateContent (có thể giới hạn thời gian), Delete (logic xóa mềm).

**Value Objects:**

- **TaskStatus:** Trạng thái task (To Do, In Progress, Done, Blocked, Cancelled).
- **Priority:** Mức độ ưu tiên (Low, Medium, High, Urgent).
- **RelatedResource:** Liên kết đến một thực thể nghiệp vụ khác.
  - **EntityType:** Loại thực thể (ví dụ: "Order", "Product", "Customer", "Employee", "TrainingEnrollment").
  - **EntityId:** ID của thực thể.
  - **Description:** Mô tả liên kết (ví dụ: "Đơn hàng liên quan", "Khách hàng khiếu nại").
- **WorkflowDefinitionStatus:** Trạng thái định nghĩa workflow (Draft, Active, Archived).
- **WorkflowInstanceStatus:** Trạng thái workflow instance (Not Started, In Progress, Completed, Cancelled, Failed).
- **ProjectStatus:** Trạng thái dự án (Not Started, In Progress, Completed, Archived).
- **StepType:** Loại bước trong workflow (Task, Approval, Notification, Integration).
- **TaskCreationDetails:** Chi tiết để tạo Task từ workflow step.
  - **TitleTemplate:** Template cho tiêu đề Task (có thể sử dụng placeholder từ Related Resources).
  - **DescriptionTemplate:** Template cho mô tả Task.
  - **AssigneeRules:** Quy tắc gán người thực hiện (ví dụ: theo vai trò, theo người tạo workflow, theo Related Resource, chỉ định cụ thể).
  - **DueDateRules:** **Optional** Quy tắc tính toán thời hạn.
    - **Duration:** Thời lượng yêu cầu hoàn thành (ví dụ: 30 phút, 2 giờ, 1 ngày).
    - **CalculationBasis:** Cơ sở tính toán thời hạn (ví dụ: "from task creation", "from previous step completion").
    - **WorkingHoursRule:** **Optional** Quy tắc áp dụng giờ làm việc khi tính Due Date (ví dụ: "apply assignee working hours", "apply tenant working hours", "ignore working hours").
- **ApprovalDetails:** Chi tiết cho bước phê duyệt (Approver Rules, Approval Type \- Single/Multiple, Approval Criteria).
- **NotificationDetails:** Chi tiết cho bước thông báo (Recipient Rules, Notification Template ID \- liên kết với NDM).
- **IntegrationDetails:** Chi tiết cho bước tích hợp (Integration Type \- Event/Command, Target BC, Payload Template).
- **LocalizedText:** Giá trị văn bản đa ngôn ngữ.
- **Duration:** Thời lượng (Value, Unit).

## **5\. Ngôn ngữ Chung (Ubiquitous Language)**

Trong Bounded Context WPM, các thuật ngữ sau đây có ý nghĩa cụ thể và nhất quán:

- **Task:** Một đơn vị công việc nhỏ, cụ thể.
- **Assignee:** Người được giao thực hiện Task.
- **Due Date:** Thời hạn hoàn thành Task, Workflow hoặc Project.
- **Priority:** Mức độ quan trọng và khẩn cấp của Task.
- **Workflow:** Một chuỗi hoặc mạng lưới các bước/task được thực hiện theo một trình tự nhất định để hoàn thành một quy trình.
- **Workflow Definition:** Bản thiết kế hoặc mẫu của một loại Workflow.
- **Workflow Instance:** Một lần chạy cụ thể của một Workflow Definition.
- **Step:** Một bước trong Workflow Definition.
- **Project:** Một tập hợp các Task và/hoặc Workflow Instance nhằm đạt được một mục tiêu lớn hơn.
- **Project Manager:** Người chịu trách nhiệm quản lý Project.
- **Related Resource:** Một thực thể nghiệp vụ khác có liên quan đến Task, Workflow hoặc Project.
- **Comment:** Trao đổi thảo luận về Task hoặc Project.
- **Progress:** Mức độ hoàn thành của Task, Workflow hoặc Project.
- **Kanban/List/Calendar View:** Các cách hiển thị Task/Project.
- **Working Hours:** Khung thời gian trong ngày và các ngày trong tuần mà một người dùng/tổ chức được coi là đang làm việc.

## **6\. Các Khía cạnh Quan trọng của Miền WPM**

Phần này mô tả các cấu trúc, quy tắc và khái niệm nghiệp vụ quan trọng chi phối hoạt động của Bounded Context WPM.

### **6.1. Mối quan hệ Phân cấp (Hierarchy) giữa Task, Workflow và Project**

WPM quản lý các đơn vị công việc ở ba cấp độ chính: Task, Workflow Instance và Project.

- Một **Task** là đơn vị công việc cơ bản nhất.
- Một **Workflow Instance** là một tập hợp các Task (hoặc các loại Step khác) được sắp xếp theo trình tự hoặc song song để hoàn thành một quy trình cụ thể. Các Task trong một Workflow Instance được tạo ra và quản lý bởi chính Workflow Instance đó.
- Một **Project** là một tập hợp các Task đơn lẻ và/hoặc các Workflow Instance nhằm đạt được một mục tiêu lớn hơn. Project cung cấp ngữ cảnh tổ chức cho các công việc liên quan.

Mối quan hệ này có thể được hình dung như sau: Project chứa Task và Workflow Instance, và Workflow Instance chứa Task. Một Task có thể tồn tại độc lập, thuộc về một Project, thuộc về một Workflow Instance, hoặc vừa thuộc về một Workflow Instance vừa thuộc về Project chứa Workflow Instance đó. Một Task cũng có thể có Task con, tạo nên cấu trúc phân cấp nhỏ hơn bên trong Task.

### **6.2. Vòng đời Trạng thái của Task, Workflow Instance và Project**

Mỗi Aggregate Root chính trong WPM có một vòng đời trạng thái riêng:

- **Task Status:**  
  stateDiagram-v2  
   \[\*\] \--\> ToDo: Created  
   ToDo \--\> InProgress: Started  
   InProgress \--\> Done: Completed  
   InProgress \--\> Blocked: Encountered Issue  
   Blocked \--\> InProgress: Issue Resolved  
   ToDo \--\> Cancelled: Cancelled  
   InProgress \--\> Cancelled: Cancelled  
   Blocked \--\> Cancelled: Cancelled  
   Done \--\> \[\*\]  
   Cancelled \--\> \[\*\]

- **Workflow Instance Status:**  
  stateDiagram-v2  
   \[\*\] \--\> NotStarted: Initiated  
   NotStarted \--\> InProgress: Started  
   InProgress \--\> Completed: All Steps Done  
   InProgress \--\> Cancelled: Cancelled  
   InProgress \--\> Failed: Step Failed  
   Completed \--\> \[\*\]  
   Cancelled \--\> \[\*\]  
   Failed \--\> \[\*\]

- **Project Status:**  
  stateDiagram-v2  
   \[\*\] \--\> NotStarted: Created  
   NotStarted \--\> InProgress: Started  
   InProgress \--\> Completed: All Tasks/Workflows Done  
   InProgress \--\> Archived: Archived  
   Completed \--\> Archived: Archived  
   Archived \--\> \[\*\]

Logic chuyển đổi trạng thái cần tuân thủ các quy tắc nghiệp vụ (ví dụ: không thể chuyển từ Done sang In Progress, một Workflow Instance chỉ Completed khi tất cả các Step/Task con đã Done).

### **6.3. Xử lý Tài nguyên Liên quan (Related Resources)**

WPM không sở hữu dữ liệu chi tiết của các thực thể nghiệp vụ khác (như Order, Product, Customer, Employee, Training Enrollment). Khi một Task, Workflow Instance hoặc Project cần liên kết đến một thực thể bên ngoài, WPM chỉ lưu trữ ID và loại của thực thể đó dưới dạng Value Object RelatedResource.

Khi hiển thị thông tin chi tiết hoặc tạo báo cáo, WPM (hoặc Client App) sẽ cần gọi các Bounded Context sở hữu dữ liệu đó (ví dụ: ODM, PIM, CRM, HRM, ITM) thông qua API Query để lấy thông tin chi tiết về Related Resource dựa trên ID đã lưu. Điều này giúp giữ cho WPM tập trung vào quản lý công việc và tránh trở thành một kho dữ liệu tập trung cho tất cả các loại thực thể.

### **6.4. Quản lý Người thực hiện (Assignees) và Người quản lý (Managers)**

Task có thể được gán cho một hoặc nhiều người thực hiện (AssigneeUserIds). Project có thể có một người quản lý (ManagerUserId). WPM lưu trữ User ID từ IAM. Khi hiển thị thông tin người thực hiện/quản lý, WPM (hoặc Client App) sẽ cần gọi IAM hoặc HRM (nếu cần thông tin chi tiết hơn về nhân viên) để lấy thông tin chi tiết của User/Employee dựa trên ID.

Việc gán người thực hiện có thể dựa trên các quy tắc định nghĩa trong Workflow Definition (ví dụ: gán cho người tạo Related Resource, gán cho người quản lý Project, gán cho một vai trò cụ thể, gán thủ công). Logic xác định User ID cụ thể dựa trên các quy tắc này sẽ nằm trong WorkflowService hoặc một Domain Service chuyên biệt.

### **6.5. Hỗ trợ Đa ngôn ngữ cho Mô tả và Tiêu đề**

Các trường văn bản như tiêu đề và mô tả của Task, Workflow Definition, Workflow Step, Project cần hỗ trợ đa ngôn ngữ. WPM sẽ sử dụng LZM để quản lý các bản dịch cho các trường này. Khi lưu trữ, WPM có thể lưu trữ Translation Key hoặc cấu trúc dữ liệu LocalizedText (chứa các cặp locale-text). Khi hiển thị, WPM (hoặc Client App) sẽ gọi LZM để lấy bản dịch phù hợp với locale của người dùng.

### **6.6. Quản lý Tài sản Đính kèm (Attached Assets)**

Task và Project có thể có các file tài liệu đính kèm. WPM không lưu trữ file vật lý mà chỉ lưu trữ danh sách các ID tham chiếu đến các Asset trong DAM (FileAssetIds). Khi cần truy cập file, WPM (hoặc Client App) sẽ gọi DAM thông qua API Query để lấy thông tin chi tiết về Asset và URL tải xuống dựa trên ID.

### **6.7. Phân biệt Workflow Definition và Workflow Instance**

Việc phân biệt rõ ràng giữa Workflow Definition (mẫu thiết kế) và Workflow Instance (lần thực thi cụ thể) là rất quan trọng. Thay đổi trên Workflow Definition (ví dụ: thêm/bớt bước) chỉ ảnh hưởng đến các Workflow Instance được khởi tạo _sau_ khi thay đổi. Các Workflow Instance đang chạy sẽ tiếp tục sử dụng cấu trúc của Workflow Definition tại thời điểm chúng được khởi tạo.

### **6.8. Các Loại Bước trong Workflow (Step Types)**

Workflow Definition hỗ trợ nhiều loại Step khác nhau (StepType) để mô hình hóa các hoạt động đa dạng trong quy trình:

- Task: Tạo một Task cụ thể để người dùng thực hiện.
- Approval: Tạo một yêu cầu phê duyệt.
- Notification: Gửi thông báo (qua NDM).
- Integration: Kích hoạt một hành động trong BC khác (phát Event hoặc gửi Command).

Logic xử lý việc hoàn thành và chuyển tiếp giữa các Step sẽ phụ thuộc vào StepType và các điều kiện liên kết (NextSteps).

### **6.9. Ranh giới với Business Process Automation (BPA)**

WPM tập trung vào việc định nghĩa cấu trúc quy trình và theo dõi tiến độ thực thi. Mặc dù có khả năng tích hợp (Integration Step), WPM không phải là một công cụ BPA đầy đủ với khả năng thực thi logic điều kiện phức tạp, branching dựa trên dữ liệu, hoặc vòng lặp. Các logic tự động hóa phức tạp hơn nên được xử lý ở lớp Application Service hoặc bởi một BC BPA chuyên biệt nếu có.

### **6.10. Xử lý Múi giờ (Timezone Handling) và Giờ làm việc (Working Hours)**

Trong một hệ thống SaaS đa tổ chức với người dùng phân tán về mặt địa lý, việc xử lý múi giờ và giờ làm việc một cách chính xác là rất quan trọng, đặc biệt đối với các mốc thời gian như DueDate. WPM áp dụng chiến lược sau:

- **Lưu trữ Thời gian:** Tất cả các giá trị thời gian (bao gồm DueDate, CreatedAt, UpdatedAt, CompletedAt, StartedAt) trong WPM **luôn được lưu trữ ở múi giờ chuẩn UTC**. Điều này đảm bảo tính nhất quán và nguồn sự thật duy nhất cho dữ liệu thời gian, không phụ thuộc vào vị trí của người dùng hay máy chủ.
- **Xử lý & Hiển thị Thời gian:** Việc chuyển đổi múi giờ chỉ xảy ra khi cần hiển thị thời gian cho người dùng hoặc khi áp dụng các logic nghiệp vụ phụ thuộc vào thời gian cục bộ:
  - **Múi giờ của Tổ chức (Tenant's Timezone):** Đây là múi giờ chính được sử dụng cho các quy tắc nghiệp vụ mặc định, báo cáo cấp tổ chức và các mốc thời gian chung của Project hoặc Workflow Instance. Thông tin múi giờ này được quản lý và lấy từ Bounded Context **IAM**. Khi hiển thị các mốc thời gian này, WPM (hoặc Client App) sẽ chuyển đổi từ UTC sang múi giờ của Tổ chức.
  - **Múi giờ của Người dùng (User's Timezone):** Đối với các thông tin cá nhân hơn như thời hạn (DueDate) của Task được gán cho một người dùng cụ thể, hệ thống sẽ ưu tiên hiển thị theo múi giờ cá nhân của người dùng đó. Thông tin múi giờ ưa thích của người dùng cũng được quản lý trong **IAM** như một phần của hồ sơ người dùng. Nếu người dùng không đặt múi giờ cá nhân, hệ thống sẽ mặc định sử dụng múi giờ của Tổ chức mà họ đang làm việc trong phiên hiện tại.
- **Tính toán Thời hạn (Due Date) dựa trên Giờ làm việc:** Đây là một khía cạnh nâng cao để hỗ trợ kịch bản nhân sự đa quốc gia. Khi một Task có quy tắc thời hạn được định nghĩa dựa trên thời lượng (ví dụ: hoàn thành sau N phút/giờ/ngày) và được gán cho một hoặc nhiều người thực hiện, WPM sẽ tính toán DueDate cuối cùng dựa trên:
  1. Thời điểm bắt đầu tính thời hạn (ví dụ: thời điểm task được tạo, thời điểm bước trước đó hoàn thành).
  2. Thời lượng yêu cầu hoàn thành.
  3. Thông tin về **Giờ làm việc (Working Hours)** của người được gán task. Thông tin này bao gồm múi giờ, thời gian bắt đầu/kết thúc ngày làm việc, và các ngày làm việc trong tuần, được lấy từ **IAM** hoặc **HRM**.

Logic tính toán sẽ xem xét thời điểm bắt đầu, cộng thêm thời lượng yêu cầu, nhưng **chỉ tính trong khoảng thời gian làm việc** của người được gán task. Nếu thời điểm kết thúc tính toán ban đầu rơi vào ngoài giờ làm việc của người được gán, DueDate sẽ được tự động **dời đến thời điểm bắt đầu ca làm việc tiếp theo** của người đó._Ví dụ:_ Task bắt đầu lúc 7:00 AM UTC, yêu cầu hoàn thành sau 30 phút. Người được gán ở múi giờ UTC-7, giờ làm việc 8:00 AM \- 5:00 PM giờ địa phương. Thời điểm 7:30 AM UTC tương ứng với 12:30 AM giờ địa phương của người đó (ngoài giờ làm việc). DueDate sẽ được dời đến 8:00 AM của ngày làm việc tiếp theo theo giờ địa phương của người đó.Quy tắc áp dụng giờ làm việc khi tính toán DueDate có thể được cấu hình trong TaskCreationDetails (ví dụ: áp dụng giờ làm việc của người được gán, áp dụng giờ làm việc mặc định của tổ chức, hoặc bỏ qua giờ làm việc).

- **Logic Nghiệp vụ Dựa trên Thời gian:** Khi WPM cần thực hiện các hành động tự động dựa trên thời gian (ví dụ: kiểm tra task quá hạn, gửi thông báo sắp hết hạn), logic này sẽ xem xét DueDate đã được tính toán (ở UTC) và có thể sử dụng thông tin múi giờ của người được gán/tổ chức để xác định thời điểm chính xác theo giờ địa phương. Khi yêu cầu NDM gửi thông báo liên quan đến thời gian, WPM sẽ cung cấp thông tin thời gian ở múi giờ UTC cùng với múi giờ mục tiêu (múi giờ của Tổ chức hoặc của người nhận) để NDM có thể bản địa hóa thời gian trong nội dung thông báo một cách chính xác.

Chiến lược này đảm bảo rằng dù tổ chức ở Việt Nam và nhân sự ở nước ngoài, mọi người đều làm việc với dữ liệu thời gian nhất quán (lưu trữ ở UTC) nhưng có thể xem và nhận thông báo theo múi giờ phù hợp với vị trí của họ, và quan trọng hơn, thời hạn công việc được tính toán một cách thực tế dựa trên giờ làm việc của người chịu trách nhiệm, hỗ trợ hiệu quả môi trường làm việc phân tán.

## **7\. Tương tác với các Bounded Context khác**

WPM tương tác với các Bounded Context khác thông qua cả mô hình bất đồng bộ (Event-Driven) và đồng bộ (Request/Reply).

- **Tương tác với Core BCs:**
  - **IAM:** WPM gọi IAM (Request/Reply) để xác thực và ủy quyền cho người dùng thực hiện các hành động quản lý công việc. WPM cũng gọi IAM (Request/Reply) để lấy thông tin chi tiết về User (tên, email, **múi giờ ưa thích**) và thông tin về Tổ chức (**múi giờ của Tổ chức, giờ làm việc mặc định của tổ chức**) dựa trên User ID/Tenant ID cho mục đích hiển thị hoặc xử lý logic liên quan đến múi giờ và giờ làm việc.
  - **NDM:** WPM gửi yêu cầu (Command/Event) đến NDM để gửi thông báo liên quan đến công việc (ví dụ: TaskAssigned, TaskDueDateApproaching, TaskOverdue, CommentAdded, ApprovalRequested). Yêu cầu này bao gồm thông tin về thời gian (ở UTC) và múi giờ mục tiêu để NDM bản địa hóa.
  - **LZM & RDM:** WPM gọi LZM (Request/Reply) để lấy bản dịch cho các trường văn bản đa ngôn ngữ. WPM gọi RDM (Request/Reply) để lấy dữ liệu tham chiếu như loại ưu tiên, loại trạng thái (nếu không quản lý nội bộ), hoặc các quy tắc định dạng locale (qua LZM).
  - **ALM:** WPM phát ra các sự kiện audit log (Event) khi có các hành động quan trọng liên quan đến quản lý công việc (ví dụ: tạo/cập nhật/xóa task/workflow/project, thay đổi trạng thái, gán người thực hiện, thêm bình luận, phê duyệt task).
- **Tương tác với Feature BCs:**
  - **HRM:** WPM có thể gọi HRM (Request/Reply) để lấy thông tin chi tiết về Employee (liên kết với User ID), bao gồm cả **thông tin giờ làm việc cụ thể của nhân viên**, cho mục đích hiển thị hoặc gán task dựa trên cấu trúc tổ chức/chức danh và tính toán thời hạn. HRM có thể phát Event (EmployeeAssignedToDepartment, EmployeeJobTitleChanged, **EmployeeWorkingHoursUpdated**) mà WPM có thể lắng nghe nếu cần cập nhật thông tin gán task/manager tự động hoặc tính toán lại thời hạn của các task đang mở được gán cho nhân viên đó.
  - **ITM:** WPM có thể gọi ITM (Request/Reply) để kiểm tra trạng thái hoàn thành của Training Enrollment khi một Task/Workflow Step liên kết với nó. ITM có thể phát Event (TrainingEnrollmentCompleted) mà WPM có thể lắng nghe để tự động hoàn thành Task/Workflow Step tương ứng hoặc kích hoạt Workflow Instance mới.
  - **CRM, PIM, ODM, ICM, FAM, v.v.:** WPM gọi các BC này (Request/Reply) để lấy thông tin chi tiết về Related Resources (Customer, Product, Order, Inventory Item, Financial Record) dựa trên ID đã lưu trữ khi hiển thị thông tin hoặc tạo báo cáo. Các BC này có thể phát Event (OrderCompleted, CustomerStatusChanged, ProductCreated) mà WPM có thể lắng nghe để tự động khởi tạo Workflow Instance mới.
  - **DAM:** WPM gọi DAM (Request/Reply) để lấy thông tin chi tiết về Asset đính kèm dựa trên ID. DAM có thể phát Event (AssetDeleted) mà WPM có thể lắng nghe để xử lý các liên kết bị đứt.

## **8\. Use cases**

Dưới đây là mô tả các use case chính có sự tham gia của WPM, được tổ chức theo các nhóm chức năng chính, tập trung vào actor, mục đích và các service liên quan.

### **8.1. Use Cases liên quan đến Quản lý Task**

Nhóm này bao gồm các use case liên quan đến việc tạo, cập nhật, xóa và quản lý các task đơn lẻ hoặc task trong ngữ cảnh của Project/Workflow.

- **Use case: Tạo Task Mới**
  - **Actor:** Người dùng (có quyền), Hệ thống (khi tạo từ Workflow Instance).
  - **Mục đích:** Tạo một đơn vị công việc mới với các thông tin chi tiết, người thực hiện và thời hạn.
  - **Service liên quan:** Được xử lý bởi TaskApplicationService (Command). Sử dụng TaskService để tạo Task, bao gồm cả logic **tính toán Due Date dựa trên giờ làm việc của người được gán** (gọi IAM/HRM để lấy thông tin giờ làm việc). Sử dụng IAM Service để kiểm tra quyền người tạo. Có thể sử dụng ProjectService/WorkflowService để liên kết Task với Project/Workflow. Phát sự kiện TaskCreated và audit log cho ALM. Yêu cầu NDM gửi thông báo TaskAssigned (bao gồm thời gian Due Date ở UTC và múi giờ của người được gán).
- **Use case: Cập nhật Thông tin Task**
  - **Actor:** Người dùng (có quyền).
  - **Mục đích:** Thay đổi tiêu đề, mô tả, độ ưu tiên, thời hạn, hoặc liên kết tài nguyên/asset của task.
  - **Service liên quan:** Được xử lý bởi TaskApplicationService (Command). Sử dụng TaskService để cập nhật Task. Nếu thời hạn thay đổi hoặc người được gán thay đổi, TaskService sẽ thực hiện lại logic **tính toán Due Date dựa trên giờ làm việc** (gọi IAM/HRM). Sử dụng IAM Service để kiểm tra quyền người cập nhật. Phát sự kiện TaskUpdated và audit log cho ALM. Yêu cầu NDM gửi thông báo TaskDueDateSet (nếu thời hạn thay đổi, bao gồm thời gian Due Date ở UTC và múi giờ của người được gán).
- **Use case: Thay đổi Trạng thái Task**
  - **Actor:** Người dùng (có quyền, thường là Assignee), Hệ thống (khi hoàn thành bước trong Workflow).
  - **Mục đích:** Cập nhật trạng thái tiến độ của task (ví dụ: To Do, In Progress, Done).
  - **Service liên quan:** Được xử lý bởi TaskApplicationService (Command). Sử dụng TaskService để thay đổi trạng thái. Sử dụng IAM Service để kiểm tra quyền. Phát sự kiện TaskStatusChanged và audit log cho ALM. Yêu cầu NDM gửi thông báo. Có thể kích hoạt logic trong WorkflowService nếu task là một bước của workflow.
- **Use case: Gán/Bỏ gán Người thực hiện Task**
  - **Actor:** Người dùng (có quyền quản lý task/project/workflow).
  - **Mục đích:** Chỉ định hoặc loại bỏ người chịu trách nhiệm thực hiện task.
  - **Service liên quan:** Được xử lý bởi TaskApplicationService (Command). Sử dụng TaskService để gán/bỏ gán. Nếu người được gán thay đổi, TaskService sẽ thực hiện lại logic **tính toán Due Date dựa trên giờ làm việc** (gọi IAM/HRM). Sử dụng IAM Service để kiểm tra quyền. Phát sự kiện TaskAssigned và audit log cho ALM. Yêu cầu NDM gửi thông báo TaskAssigned (bao gồm thời gian Due Date ở UTC và múi giờ của người được gán).
- **Use case: Thêm Bình luận vào Task**
  - **Actor:** Người dùng (có quyền xem task).
  - **Mục đích:** Trao đổi thông tin hoặc thảo luận về task.
  - **Service liên quan:** Được xử lý bởi TaskApplicationService (Command). Sử dụng TaskService để thêm bình luận. Sử dụng IAM Service để kiểm tra quyền. Phát sự kiện TaskCommentAdded và audit log cho ALM. Yêu cầu NDM gửi thông báo CommentAdded (bao gồm thời gian bình luận ở UTC và múi giờ của người nhận).

### **8.2. Use Cases liên quan đến Quản lý Workflow**

Nhóm này tập trung vào việc định nghĩa cấu trúc quy trình và quản lý các lần thực thi cụ thể của quy trình.

- **Use case: Định nghĩa/Cập nhật Workflow Template**
  - **Actor:** Người dùng (có quyền quản lý workflow template).
  - **Mục đích:** Tạo hoặc chỉnh sửa cấu trúc của một loại quy trình làm việc (các bước, thứ tự, quy tắc gán người thực hiện/thời hạn mặc định cho task trong workflow).
  - **Service liên quan:** Được xử lý bởi WorkflowApplicationService (Command). Sử dụng WorkflowService để tạo/cập nhật WorkflowDefinition. Sử dụng IAM Service để kiểm tra quyền. Phát sự kiện WorkflowDefinitionCreated/Updated/StatusChanged và audit log cho ALM.
- **Use case: Khởi tạo Workflow Instance**
  - **Actor:** Người dùng (có quyền), Hệ thống (từ event nghiệp vụ).
  - **Mục đích:** Bắt đầu một lần thực thi cụ thể của một Workflow Definition.
  - **Service liên quan:** Được xử lý bởi WorkflowApplicationService (Command/Event Handler). Sử dụng WorkflowService để tạo WorkflowInstance và các Task/Step ban đầu dựa trên WorkflowDefinition. WorkflowService sẽ gọi TaskService để tạo Task, và TaskService sẽ thực hiện logic **tính toán Due Date dựa trên giờ làm việc** (gọi IAM/HRM). Sử dụng IAM Service để kiểm tra quyền (nếu từ Command). Lắng nghe Event từ các BC khác (ví dụ: OrderCompletedEvent từ ODM). Phát sự kiện WorkflowInstanceCreated và TaskCreated (cho task con) và audit log cho ALM. Yêu cầu NDM gửi thông báo (bao gồm thời gian ở UTC và múi giờ của người nhận).
- **Use case: Theo dõi Tiến độ Workflow Instance**
  - **Actor:** Hệ thống (lắng nghe TaskStatusChanged, WorkflowStepCompleted events).
  - **Mục đích:** Cập nhật trạng thái của Workflow Instance dựa trên tiến độ của các Task/Step con, và kích hoạt các bước tiếp theo.
  - **Service liên quan:** Được xử lý bởi WorkflowApplicationService (Event Handler). Sử dụng WorkflowService để xử lý logic chuyển trạng thái và kích hoạt bước tiếp theo. Lắng nghe sự kiện TaskStatusChanged (nội bộ hoặc từ Task BC nếu tách riêng), WorkflowStepCompleted. Phát sự kiện WorkflowInstanceProgressUpdated, WorkflowInstanceStatusChanged (nếu hoàn thành/hủy/thất bại), WorkflowStepCompleted, và audit log cho ALM. Yêu cầu NDM gửi thông báo (bao gồm thời gian ở UTC và múi giờ của người nhận).
- **Use case: Hủy Workflow Instance**
  - **Actor:** Người dùng (có quyền).
  - **Mục đích:** Dừng việc thực thi một Workflow Instance đang chạy.
  - **Service liên quan:** Được xử lý bởi WorkflowApplicationService (Command). Sử dụng WorkflowService để hủy WorkflowInstance. Sử dụng IAM Service để kiểm tra quyền. Phát sự kiện WorkflowInstanceStatusChanged và audit log cho ALM. Yêu cầu NDM gửi thông báo (bao gồm thời gian ở UTC và múi giờ của người nhận).

### **8.3. Use Cases liên quan đến Quản lý Project**

Nhóm này bao gồm các use case để tổ chức các task và workflow theo dự án.

- **Use case: Tạo Project Mới**
  - **Actor:** Người dùng (có quyền).
  - **Mục đích:** Tạo một dự án để nhóm các task và workflow liên quan.
  - **Service liên quan:** Được xử lý bởi ProjectApplicationService (Command). Sử dụng ProjectService để tạo Project. Sử dụng IAM Service để kiểm tra quyền. Phát sự kiện ProjectCreated và audit log cho ALM. Yêu cầu NDM gửi thông báo (tùy cấu hình, bao gồm thời gian ở UTC và múi giờ của người nhận).
- **Use case: Cập nhật Thông tin Project**
  - **Actor:** Người dùng (có quyền).
  - **Mục đích:** Thay đổi tên, mô tả, thời hạn, người quản lý, hoặc liên kết tài nguyên/asset của project.
  - **Service liên quan:** Được xử lý bởi ProjectApplicationService (Command). Sử dụng ProjectService để cập nhật Project. Sử dụng IAM Service để kiểm tra quyền. Phát sự kiện ProjectUpdated và audit log cho ALM. Yêu cầu NDM gửi thông báo (nếu người quản lý thay đổi, bao gồm thời gian ở UTC và múi giờ của người nhận).
- **Use case: Thêm/Bớt Task hoặc Workflow Instance vào Project**
  - **Actor:** Người dùng (có quyền).
  - **Mục đích:** Liên kết hoặc hủy liên kết task/workflow instance với một project.
  - **Service liên quan:** Được xử lý bởi ProjectApplicationService (Command). Sử dụng ProjectService để cập nhật Project. Sử dụng TaskService/WorkflowService để cập nhật Task/Workflow Instance (liên kết Project ID). Sử dụng IAM Service để kiểm tra quyền. Phát sự kiện ProjectTaskAdded/Removed, ProjectWorkflowInstanceAdded/Removed và audit log cho ALM.
- **Use case: Hoàn thành/Lưu trữ Project**
  - **Actor:** Người dùng (có quyền).
  - **Mục đích:** Đánh dấu project là hoàn thành hoặc lưu trữ nó.
  - **Service liên quan:** Được xử lý bởi ProjectApplicationService (Command). Sử dụng ProjectService để thay đổi trạng thái Project. Sử dụng IAM Service để kiểm tra quyền. Phát sự kiện ProjectStatusChanged và audit log cho ALM.

### **8.4. Use Cases liên quan đến Truy vấn & Báo cáo**

Nhóm này bao gồm các use case cho phép người dùng truy xuất và xem các thông tin về task, workflow và project.

- **Use case: Xem Danh sách Task (với nhiều tiêu chí lọc/sắp xếp)**
  - **Actor:** Người dùng (có quyền xem task trong tổ chức).
  - **Mục đích:** Tìm kiếm và xem danh sách các task dựa trên người thực hiện, trạng thái, thời hạn, project, workflow, tài nguyên liên quan, v.v.
  - **Service liên quan:** Được xử lý bởi WPMQueryApplicationService (Query). Sử dụng WPMQueryService để truy vấn dữ liệu Task. Sử dụng IAM Service để kiểm tra quyền xem task trong tổ chức và lấy múi giờ của người dùng/tổ chức để chuyển đổi thời gian hiển thị. Có thể gọi IAM/HRM/các BC khác để lấy thông tin chi tiết cho hiển thị.
- **Use case: Xem Chi tiết Task**
  - **Actor:** Người dùng (có quyền xem task).
  - **Mục đích:** Xem tất cả thông tin chi tiết của một task cụ thể, bao gồm bình luận và tài sản đính kèm.
  - **Service liên quan:** Được xử lý bởi WPMQueryApplicationService (Query). Sử dụng WPMQueryService để lấy chi tiết Task. Sử dụng IAM Service để kiểm tra quyền và lấy múi giờ của người dùng/tổ chức để chuyển đổi thời gian hiển thị. Gọi IAM/HRM/các BC khác để lấy thông tin chi tiết Related Resources/Assignees. Gọi DAM để lấy thông tin Attached Assets.
- **Use case: Xem Danh sách Project**
  - **Actor:** Người dùng (có quyền xem project trong tổ chức).
  - **Mục đích:** Xem danh sách các project trong tổ chức.
  - **Service liên quan:** Được xử lý bởi WPMQueryApplicationService (Query). Sử dụng WPMQueryService để truy vấn dữ liệu Project. Sử dụng IAM Service để kiểm tra quyền và lấy múi giờ của tổ chức để chuyển đổi thời gian hiển thị.
- **Use case: Xem Chi tiết Project (bao gồm Task và Workflow Instance con)**
  - **Actor:** Người dùng (có quyền xem project).
  - **Mục đích:** Xem tất cả thông tin chi tiết của một project cụ thể, bao gồm danh sách các task và workflow instance thuộc project đó.
  - **Service liên quan:** Được xử lý bởi WPMQueryApplicationService (Query). Sử dụng WPMQueryService để lấy chi tiết Project và danh sách Task/Workflow Instance ID. Sử dụng WPMQueryService để lấy chi tiết Task/Workflow Instance con. Sử dụng IAM Service để kiểm tra quyền và lấy múi giờ của tổ chức để chuyển đổi thời gian hiển thị.
- **Use case: Xem Danh sách Workflow Template**
  - **Actor:** Người dùng (có quyền xem workflow template).
  - **Mục đích:** Xem danh sách các định nghĩa workflow có sẵn trong tổ chức.
  - **Service liên quan:** Được xử lý bởi WPMQueryApplicationService (Query). Sử dụng WPMQueryService để truy vấn dữ liệu WorkflowDefinition. Sử dụng IAM Service để kiểm tra quyền.
- **Use case: Xem Chi tiết Workflow Template**
  - **Actor:** Người dùng (có quyền xem workflow template).
  - **Mục đích:** Xem cấu trúc chi tiết của một Workflow Definition.
  - **Service liên quan:** Được xử lý bởi WPMQueryApplicationService (Query). Sử dụng WPMQueryService để lấy chi tiết WorkflowDefinition. Sử dụng IAM Service để kiểm tra quyền.
- **Use case: Xem Danh sách Workflow Instance (với tiêu chí lọc)**
  - **Actor:** Người dùng (có quyền xem workflow instance trong tổ chức).
  - **Mục đích:** Tìm kiếm và xem danh sách các workflow instance đã được khởi tạo.
  - **Service liên quan:** Được xử lý bởi WPMQueryApplicationService (Query). Sử dụng WPMQueryService để truy vấn dữ liệu WorkflowInstance. Sử dụng IAM Service để kiểm tra quyền và lấy múi giờ của tổ chức để chuyển đổi thời gian hiển thị.
- **Use case: Xem Chi tiết Workflow Instance (bao gồm trạng thái các bước và task con)**
  - **Actor:** Người dùng (có quyền xem workflow instance).
  - **Mục đích:** Xem trạng thái và tiến độ của một lần thực thi workflow cụ thể.
  - **Service liên quan:** Được xử lý bởi WPMQueryApplicationService (Query). Sử dụng WPMQueryService để lấy chi tiết WorkflowInstance và danh sách Task ID con. Sử dụng WPMQueryService để lấy chi tiết Task con. Sử dụng IAM Service để kiểm tra quyền và lấy múi giờ của tổ chức để chuyển đổi thời gian hiển thị.

## **9\. Domain Services**

Domain Services trong WPM chứa logic nghiệp vụ quan trọng không thuộc về một Aggregate Root cụ thể hoặc cần phối hợp nhiều Aggregate Root.

- **TaskService:**
  - **Trách nhiệm:** Quản lý vòng đời của Task (tạo, cập nhật thông tin, thay đổi trạng thái, gán người thực hiện, đặt thời hạn, thêm bình luận). Thực hiện các quy tắc nghiệp vụ như kiểm tra quyền gán task, kiểm tra tính hợp lệ của thời hạn. **Đặc biệt, chịu trách nhiệm tính toán DueDate của Task dựa trên thời điểm bắt đầu, thời lượng yêu cầu và giờ làm việc của người được gán Task (hoặc giờ làm việc của tổ chức), bao gồm cả logic dời thời hạn sang ca làm việc tiếp theo nếu cần.** Phối hợp với Task Repository, IAM Service (để kiểm tra User, lấy thông tin múi giờ và giờ làm việc), HRM Service (để lấy thông tin Employee và giờ làm việc), DAM Service (để liên kết asset).
  - **Các phương thức tiềm năng:** CreateTask(...), UpdateTask(...), ChangeTaskStatus(...), AssignTask(...), SetTaskDueDate(...), AddCommentToTask(...).
- **WorkflowService:**
  - **Trách nhiệm:** Quản lý vòng đời của Workflow Definition và Workflow Instance. Khởi tạo workflow instance từ definition, theo dõi tiến độ các bước, xác định bước tiếp theo, xử lý hoàn thành/hủy/thất bại của workflow instance. Phối hợp với WorkflowDefinition Repository, WorkflowInstance Repository, TaskService (để tạo/cập nhật task con và ủy thác việc tính toán Due Date), NDM Service (để gửi thông báo với thông tin múi giờ), các BC khác (để gửi command/event tích hợp).
  - **Các phương thức tiềm năng:** CreateWorkflowDefinition(...), UpdateWorkflowDefinition(...), ActivateWorkflowDefinition(...), InitiateWorkflowInstance(...), CompleteWorkflowStep(...), CancelWorkflowInstance(...).
- **ProjectService:**
  - **Trách nhiệm:** Quản lý vòng đời của Project. Thêm/bớt task và workflow instance vào project. Gán người quản lý dự án. Phối hợp với Project Repository, Task Repository, WorkflowInstance Repository.
  - **Các phương thức tiềm năng:** CreateProject(...), UpdateProject(...), CompleteProject(...), AddTaskToProject(...), RemoveTaskFromProject(...), AddWorkflowInstanceToProject(...).
- **WPMQueryService (Optional Domain Service):** Nếu logic truy vấn phức tạp (tìm kiếm task, lọc theo nhiều tiêu chí, lấy danh sách task theo người thực hiện/project/workflow), có thể tách ra.
  - **Trách nhiệm:** Cung cấp các phương thức truy vấn dữ liệu Task, Workflow Instance, Project, Workflow Definition. Phối hợp với Task Repository, WorkflowInstance Repository, Project Repository, WorkflowDefinition Repository, LZM Service, IAM Service (để lấy thông tin User/Tenant, múi giờ và giờ làm việc cho mục đích hiển thị), HRM Service, các BC khác (để lấy thông tin Related Resources).
  - **Các phương thức tiềm năng:** GetTaskDetails(...), SearchTasks(...), GetTasksByAssignee(...), GetProjectDetails(...), GetWorkflowInstanceDetails(...).

## **10\. Application Services**

Application Services trong WPM là lớp mỏng điều phối các hành động từ bên ngoài (ví dụ: từ API Gateway, Message Broker) đến Domain Model (Aggregate Roots, Domain Services). Chúng đại diện cho các trường hợp sử dụng (use case) và xử lý các tác vụ kỹ thuật như xác thực command, ủy quyền (thông qua IAM), giao dịch cơ sở dữ liệu, và phát sự kiện.

- **TaskApplicationService:**
  - **Trách nhiệm:** Xử lý các command liên quan đến quản lý Task từ API (ví dụ: CreateTaskCommand, UpdateTaskStatusCommand, AssignTaskCommand). Sử dụng TaskService và Task Repository. Thực hiện ủy quyền với IAM. Lắng nghe các event liên quan đến User/Employee từ IAM/HRM để cập nhật thông tin người thực hiện và **kích hoạt tính toán lại Due Date cho các task liên quan nếu giờ làm việc thay đổi.**
  - **Các phương thức tiềm năng:** HandleCreateTaskCommand(...), HandleUpdateTaskStatusCommand(...), HandleAssignTaskCommand(...).
- **WorkflowApplicationService:**
  - **Trách nhiệm:** Xử lý các command liên quan đến quản lý Workflow Definition và Workflow Instance từ API (ví dụ: CreateWorkflowDefinitionCommand, InitiateWorkflowInstanceCommand) hoặc lắng nghe Event từ các BC khác (ví dụ: OrderStatusChangedEvent từ ODM). Sử dụng WorkflowService và các Repository tương ứng. Thực hiện ủy quyền với IAM (nếu từ API).
  - **Các phương thức tiềm năng:** HandleCreateWorkflowDefinitionCommand(...), HandleInitiateWorkflowInstanceCommand(...), HandleOrderStatusChangedEvent(...).
- **ProjectApplicationService:**
  - **Trách nhiệm:** Xử lý các command liên quan đến quản lý Project từ API (ví dụ: CreateProjectCommand, UpdateProjectCommand). Sử dụng ProjectService và Project Repository. Thực hiện ủy quyền với IAM.
  - **Các phương thức tiềm năng:** HandleCreateProjectCommand(...), HandleUpdateProjectCommand(...).
- **WPMQueryApplicationService:**
  - **Trách nhiệm:** Xử lý các query để lấy thông tin Task, Workflow, Project (ví dụ: GetTaskDetailsQuery, GetProjectTasksQuery, SearchTasksQuery). Sử dụng WPMQueryService hoặc các Domain Service khác. Thực hiện ủy quyền với IAM và lấy thông tin múi giờ/giờ làm việc cần thiết cho việc hiển thị.
  - **Các phương thức tiềm năng:** HandleGetTaskDetailsQuery(...), HandleGetProjectTasksQuery(...), HandleSearchTasksQuery(...).

## **11\. Domain Events**

Bounded Context WPM tương tác với các Bounded Context khác thông qua việc phát ra và lắng nghe các Domain Event. Dưới đây là danh sách các event mà WPM phát ra và lắng nghe, bao gồm payload dự kiến của chúng:

### **11.1. Domain Events (WPM Phát ra)**

WPM sẽ phát ra các Domain Event quan trọng để thông báo cho các Bounded Context khác về những thay đổi trạng thái nghiệp vụ trong phạm vi của nó. Dưới đây là danh sách các event và payload dự kiến của chúng:

- **TaskCreated**
  - Phát ra khi một task mới được tạo.
  - **Payload:**
    - TaskId (UUID)
    - TenantId (UUID)
    - Title (LocalizedText/String)
    - Status (String)
    - Priority (String)
    - AssigneeUserIds (List of UUID)
    - DueDate (DateTime, optional) **(ở múi giờ UTC, đã tính toán dựa trên giờ làm việc nếu áp dụng quy tắc)**
    - ProjectId (UUID, optional)
    - WorkflowInstanceId (UUID, optional)
    - CreatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime \- thời điểm event được phát ra) **(ở múi giờ UTC)**
- **TaskUpdated**
  - Phát ra khi thông tin task được cập nhật (trừ trạng thái).
  - **Payload:**
    - TaskId (UUID)
    - TenantId (UUID)
    - UpdatedFields (Object \- ví dụ: { "title": "...", "description": "..." })
    - UpdatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **TaskStatusChanged**
  - Phát ra khi trạng thái task thay đổi.
  - **Payload:**
    - TaskId (UUID)
    - TenantId (UUID)
    - OldStatus (String)
    - NewStatus (String)
    - CompletedAt (DateTime, optional \- nếu NewStatus là Done) **(ở múi giờ UTC)**
    - UpdatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **TaskAssigned**
  - Phát ra khi task được gán cho người thực hiện.
  - **Payload:**
    - TaskId (UUID)
    - TenantId (UUID)
    - AssigneeUserIds (List of UUID)
    - AssignedByUserId (UUID, optional)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **TaskDueDateSet**
  - Phát ra khi thời hạn task được đặt/cập nhật.
  - **Payload:**
    - TaskId (UUID)
    - TenantId (UUID)
    - DueDate (DateTime, optional) **(ở múi giờ UTC, đã tính toán dựa trên giờ làm việc nếu áp dụng quy tắc)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **TaskCommentAdded**
  - Phát ra khi bình luận được thêm vào task.
  - **Payload:**
    - TaskId (UUID)
    - TenantId (UUID)
    - CommentId (UUID)
    - UserId (UUID)
    - Content (String)
    - CreatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **WorkflowDefinitionCreated**
  - Phát ra khi định nghĩa workflow mới được tạo.
  - **Payload:**
    - DefinitionId (UUID)
    - TenantId (UUID)
    - Name (LocalizedText/String)
    - Status (String)
    - CreatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **WorkflowDefinitionStatusChanged**
  - Phát ra khi trạng thái định nghĩa workflow thay đổi.
  - **Payload:**
    - DefinitionId (UUID)
    - TenantId (UUID)
    - OldStatus (String)
    - NewStatus (String)
    - UpdatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **WorkflowInstanceCreated**
  - Phát ra khi workflow instance mới được khởi tạo.
  - **Payload:**
    - InstanceId (UUID)
    - TenantId (UUID)
    - DefinitionId (UUID)
    - Status (String)
    - InitiatedByUserId (UUID, optional)
    - StartedAt (DateTime) **(ở múi giờ UTC)**
    - ProjectId (UUID, optional)
    - RelatedResources (List of RelatedResource, optional)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **WorkflowInstanceStatusChanged**
  - Phát ra khi trạng thái workflow instance thay đổi.
  - **Payload:**
    - InstanceId (UUID)
    - TenantId (UUID)
    - OldStatus (String)
    - NewStatus (String)
    - CompletedAt (DateTime, optional \- nếu Completed/Cancelled/Failed) **(ở múi giờ UTC)**
    - UpdatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **WorkflowStepCompleted**
  - Phát ra khi một bước trong workflow instance hoàn thành.
  - **Payload:**
    - InstanceId (UUID)
    - TenantId (UUID)
    - StepId (UUID)
    - CompletionData (Object, optional \- dữ liệu kết quả bước)
    - CompletedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ProjectCreated**
  - Phát ra khi một project mới được tạo.
  - **Payload:**
    - ProjectId (UUID)
    - TenantId (UUID)
    - Name (LocalizedText/String)
    - Status (String)
    - ManagerUserId (UUID, optional)
    - CreatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ProjectUpdated**
  - Phát ra khi thông tin project được cập nhật.
  - **Payload:**
    - ProjectId (UUID)
    - TenantId (UUID)
    - UpdatedFields (Object \- ví dụ: { "name": "...", "managerUserId": "..." })
    - UpdatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ProjectStatusChanged**
  - Phát ra khi trạng thái project thay đổi.
  - **Payload:**
    - ProjectId (UUID)
    - TenantId (UUID)
    - OldStatus (String)
    - NewStatus (String)
    - UpdatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ProjectTaskAdded**
  - Phát ra khi task được thêm vào project.
  - **Payload:**
    - ProjectId (UUID)
    - TenantId (UUID)
    - TaskId (UUID)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ProjectWorkflowInstanceAdded**
  - Phát ra khi workflow instance được thêm vào project.
  - **Payload:**
    - ProjectId (UUID)
    - TenantId (UUID)
    - WorkflowInstanceId (UUID)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**

### **11.2. Domain Events Được Xử lý (Consumed Domain Events)**

WPM lắng nghe và xử lý các Domain Event từ các Bounded Context khác để thực hiện các nghiệp vụ hoặc cập nhật trạng thái nội bộ, đặc biệt là để khởi tạo Workflow Instance.

- **OrderCompletedEvent** (Từ ODM)
  - Phát ra khi một đơn hàng được hoàn thành thành công.
  - **Mục đích xử lý:** WPM có thể lắng nghe event này để tự động khởi tạo một Workflow Instance (ví dụ: quy trình "Xử lý hậu mãi", "Gửi email khảo sát khách hàng") liên quan đến đơn hàng đã hoàn thành.
  - Payload dự kiến: (Thông tin cần thiết để xác định Workflow Definition phù hợp và cung cấp dữ liệu cho Workflow Instance/Task, ví dụ:)  
    \* OrderId (UUID)  
    \* TenantId (UUID)  
    \* CustomerId (UUID)  
    \* CompletedAt (DateTime) (ở múi giờ UTC)  
    \* IssuedAt (DateTime) (ở múi giờ UTC)
- **CustomerStatusChangedEvent** (Từ CRM)
  - Phát ra khi trạng thái của khách hàng thay đổi (ví dụ: từ "New" sang "VIP").
  - **Mục đích xử lý:** WPM có thể lắng nghe event này để tự động khởi tạo một Workflow Instance (ví dụ: quy trình "Chào mừng khách hàng VIP", "Phân công quản lý tài khoản") liên quan đến khách hàng đó.
  - Payload dự kiến: (Thông tin cần thiết để xác định Workflow Definition phù hợp và cung cấp dữ liệu, ví dụ:)  
    \* CustomerId (UUID)  
    \* TenantId (UUID)  
    \* OldStatus (String)  
    \* NewStatus (String)  
    \* IssuedAt (DateTime) (ở múi giờ UTC)
- **TrainingEnrollmentCompleted** (Từ ITM)
  - Phát ra khi người dùng hoàn thành một khóa đào tạo.
  - **Mục đích xử lý:** WPM có thể lắng nghe event này để tự động hoàn thành một Task hoặc Workflow Step (nếu task/step đó liên kết với việc hoàn thành khóa đào tạo này) hoặc khởi tạo Workflow Instance mới (ví dụ: quy trình "Đánh giá sau đào tạo").
  - Payload dự kiến: (Thông tin cần thiết, ví dụ:)  
    \* EnrollmentId (UUID)  
    \* UserId (UUID)  
    \* TrainingId (UUID)  
    \* TenantId (UUID, nếu khóa đào tạo thuộc về tổ chức)  
    \* CompletedAt (DateTime) (ở múi giờ UTC)  
    \* IssuedAt (DateTime) (ở múi giờ UTC)
- **EmployeeAssignedToDepartment** (Từ HRM) \- _Ví dụ nếu cần tự động gán task dựa trên cấu trúc tổ chức_
  - Phát ra khi nhân viên được gán vào một phòng ban.
  - **Mục đích xử lý:** WPM có thể lắng nghe để cập nhật thông tin nội bộ hoặc kích hoạt Workflow Instance (ví dụ: quy trình "Onboarding nhân viên mới").
  - Payload dự kiến: (Thông tin cần thiết, ví dụ:)  
    \* EmployeeId (UUID) (liên kết với User ID trong IAM)  
    \* TenantId (UUID)  
    \* DepartmentId (UUID)  
    \* AssignedAt (DateTime) (ở múi giờ UTC)  
    \* IssuedAt (DateTime) (ở múi giờ UTC)
- **EmployeeWorkingHoursUpdated** (Từ HRM) \- _Event mới được xử lý_
  - Phát ra khi thông tin giờ làm việc của nhân viên được cập nhật trong HRM.
  - **Mục đích xử lý:** WPM cần lắng nghe event này để có thể **tính toán lại DueDate** của các Task đang mở được gán cho nhân viên này, đảm bảo thời hạn vẫn chính xác theo giờ làm việc mới.
  - Payload dự kiến: (Thông tin cần thiết, ví dụ:)  
    \* EmployeeId (UUID) (liên kết với User ID trong IAM)  
    \* TenantId (UUID)  
    \* WorkingHours (Object \- cấu trúc chi tiết giờ làm việc)  
    \* UpdatedAt (DateTime) (ở múi giờ UTC)  
    \* IssuedAt (DateTime) (ở múi giờ UTC)

_(Lưu ý: Danh sách các sự kiện được xử lý có thể được mở rộng tùy thuộc vào các quy trình nghiệp vụ cụ thể trong hệ thống Ecoma mà WPM cần tự động kích hoạt.)_

## **12\. Ranh giới Nghiệp vụ**

Ranh giới của Bounded Context WPM được xác định bởi trách nhiệm quản lý các đơn vị công việc (Task), định nghĩa và thực thi các quy trình làm việc (Workflow), và tổ chức các công việc/quy trình theo dự án (Project) cho các tổ chức khách hàng. WPM là nguồn sự thật về trạng thái, tiến độ, người thực hiện và các liên kết của các công việc trong tổ chức khách hàng.

WPM không chịu trách nhiệm:

- **Xác thực danh tính người dùng:** Chỉ sử dụng dịch vụ của IAM. WPM liên kết với User ID từ IAM.
- **Quản lý quyền truy cập:** Chỉ sử dụng dịch vụ của IAM. IAM kiểm soát quyền của người dùng (người tạo, người thực hiện, người quản lý) trong WPM.
- **Lưu trữ file tài liệu đính kèm vật lý:** Trách nhiệm này thuộc về DAM. WPM chỉ lưu trữ ID tham chiếu.
- **Quản lý bản dịch văn bản hoặc quy tắc định dạng locale:** Chỉ sử dụng dịch vụ của LZM và RDM.
- **Ghi nhận audit logs:** Chỉ phát sự kiện cho ALM.
- **Quản lý chi tiết các tài nguyên liên quan:** WPM chỉ lưu trữ ID và loại của Related Resource (Order, Product, Customer, v.v.). Việc lấy thông tin chi tiết về các tài nguyên này thuộc về các BC sở hữu chúng (ODM, PIM, CRM, v.v.).
- **Thực thi logic nghiệp vụ của các bước tích hợp trong workflow:** Nếu một bước trong workflow là "Gửi Email Xác nhận" hoặc "Cập nhật trạng thái đơn hàng", WPM sẽ phát Event hoặc gửi Command đến NDM hoặc ODM tương ứng. WPM không tự thực hiện việc gửi email hay cập nhật trạng thái đơn hàng.
- **Quản lý các miền nghiệp vụ khác** như sản phẩm, đơn hàng, khách hàng, tài chính, nhân sự (chỉ sử dụng dữ liệu từ HRM), tồn kho, đào tạo (chỉ liên kết với ITM). **Tuy nhiên, WPM phụ thuộc vào HRM (hoặc IAM) để lấy thông tin giờ làm việc của nhân viên để tính toán thời hạn.**
- **Tự động hóa quy trình nghiệp vụ phức tạp dựa trên logic điều kiện:** WPM tập trung vào việc định nghĩa cấu trúc và theo dõi tiến độ. Các logic điều kiện phức tạp để tự động chuyển bước hoặc kích hoạt hành động thường nằm ở lớp Application Service hoặc được xử lý bởi một BC Business Process Automation (BPA) chuyên biệt nếu có.

## **13\. Kết luận**

Bounded Context Work & Process Management (WPM) là một thành phần quan trọng trong hệ thống Ecoma, cho phép các tổ chức khách hàng quản lý và theo dõi hiệu quả các công việc và quy trình nội bộ. Bằng cách tập trung trách nhiệm quản lý task, workflow và project vào một Context duy nhất, WPM cung cấp một nền tảng linh hoạt để tổ chức và điều phối các hoạt động. Việc thiết kế WPM với mô hình domain rõ ràng, các khía cạnh quan trọng của miền được làm rõ (bao gồm cả xử lý múi giờ và tính toán thời hạn dựa trên giờ làm việc), tương tác được định nghĩa và các sự kiện nghiệp vụ phù hợp (bao gồm cả sự kiện lắng nghe) là nền tảng để xây dựng một hệ thống quản lý công việc mạnh mẽ và dễ mở rộng, đồng thời đảm bảo tính nhất quán với cấu trúc tài liệu của các Core BCs như ALM, BUM và IAM.

Tài liệu này cung cấp cái nhìn tổng quan chi tiết về WPM, bao gồm mô hình domain, các khía cạnh quan trọng của miền, tương tác, use cases, Domain Service, Application Service và Domain Event (phát ra và lắng nghe với payload dự kiến). Đây là nền tảng để chuyển sang giai đoạn thiết kế kỹ thuật chi tiết và triển khai Microservice WPM.
