# **Tài liệu Thiết kế Miền: Bounded Context Internal Training Management (ITM)**

## **1\. Giới thiệu**

Tài liệu này cung cấp mô tả chi tiết về Bounded Context **Internal Training Management (ITM)** trong hệ thống Ecoma. ITM là một trong những Bounded Context thuộc nhóm Administration Feature, đóng vai trò quản lý nội dung đào tạo và theo dõi tiến trình học tập của người dùng nội bộ (nhân viên của tổ chức khách hàng sử dụng Ecoma).

ITM giúp các tổ chức tạo, tổ chức và phân phối các khóa đào tạo nội bộ, theo dõi sự tham gia và kết quả của nhân viên, từ đó nâng cao năng lực và hiệu suất làm việc. **Đặc biệt, ITM hỗ trợ nội dung khóa học đa ngôn ngữ để phục vụ hiệu quả cho các tổ chức có nhân sự phân tán và đa dạng về ngôn ngữ.**

## **2\. Phạm vi của Tài liệu**

Tài liệu này tập trung vào việc định nghĩa và mô tả Bounded Context ITM ở cấp độ thiết kế miền (domain design), cung cấp đủ chi tiết để hỗ trợ việc thiết kế các Domain Service và Application Service. Cụ thể, tài liệu này bao gồm:

- Xác định vai trò và trách nhiệm chính của ITM.
- Mô tả các khái niệm và thực thể cốt lõi trong mô hình domain của ITM ở cấp độ chi tiết hơn, bao gồm các Aggregate Root, Entity và Value Object với các thuộc tính chính, có tính đến cấu trúc khóa học (Course, Module, Lesson, Quiz) và **hỗ trợ nội dung đa ngôn ngữ**.
- Định nghĩa Ngôn ngữ Chung (Ubiquitous Language) trong phạm vi ITM.
- Mô tả **Các Khía cạnh Quan trọng của Miền ITM**, làm rõ các quy tắc và cấu trúc nghiệp vụ chi phối hoạt động của Context này, **bao gồm chiến lược xử lý nội dung đa ngôn ngữ**.
- Làm rõ các tương tác chính giữa ITM và các Bounded Context khác, **đặc biệt là mối quan hệ với LZM trong bối cảnh nội dung đa ngôn ngữ**.
- Phác thảo các **Use cases** chính có sự tham gia của ITM, tập trung vào actor, mục đích và các Domain/Application Service liên quan.
- Xác định ranh giới nghiệp vụ của ITM, nhấn mạnh những gì ITM không chịu trách nhiệm.
- Đề xuất các Domain Service và Application Service tiềm năng trong ITM, mô tả trách nhiệm chính của từng service.
- Xác định và mô tả các **Domain Events** chính mà ITM sẽ phát ra, bao gồm payload dự kiến của từng event.

Tài liệu này **không** đi sâu vào các chi tiết kỹ thuật triển khai cụ thể hoặc mô tả chi tiết các bước thực hiện (how) của từng luồng nghiệp vụ **bên trong các service**. Các khía cạnh sau **không** nằm trong phạm vi của tài liệu này:

- Chi tiết cài đặt kỹ thuật của Microservice ITM.
- Cấu trúc cơ sở dữ liệu chi tiết (schema) của ITM.
- Các quyết định công nghệ cụ thể bên trong ITM (ví dụ: công cụ tạo nội dung khóa học, trình phát video).
- Luồng dữ liệu chi tiết đến cấp độ từng trường thông tin giữa ITM và các BC khác.
- Cấu hình hạ tầng triển khai cụ thể cho Microservice ITM.
- Thiết kế giao diện người dùng để quản lý đào tạo hoặc học tập.
- Quản lý dữ liệu nhân sự chi tiết (lương, hợp đồng) \- chỉ sử dụng thông tin cơ bản về người dùng từ IAM/HRM.
- Lưu trữ file nội dung đào tạo vật lý (video, tài liệu) \- chỉ lưu trữ ID tham chiếu đến DAM.
- Tự động hóa các quy trình đào tạo phức tạp (ví dụ: tự động gán khóa học dựa trên chức danh mới được cập nhật từ HRM \- việc này có thể do WPM hoặc một BC BPA xử lý).

## **3\. Vai trò và Trách nhiệm Chính**

Bounded Context ITM chịu trách nhiệm quản lý nội dung đào tạo và tiến trình học tập nội bộ. Các trách nhiệm chính bao gồm:

- **Quản lý Khóa học (Course):** Tạo, cập nhật, xóa (logic xóa mềm), và quản lý vòng đời của các khóa học. Một khóa học có thể bao gồm nhiều Module.
- **Quản lý Module và Bài học (Lesson):** Tổ chức nội dung khóa học thành các Module và các Bài học trong từng Module.
- **Quản lý Bài kiểm tra (Quiz):** Tạo và quản lý các bài kiểm tra (Quiz) bao gồm các câu hỏi (Question) để đánh giá kiến thức sau bài học hoặc module.
- **Quản lý Nội dung Bài học Đa ngôn ngữ:** Lưu trữ và quản lý các phiên bản nội dung bài học (văn bản, liên kết tài sản DAM) cho các ngôn ngữ khác nhau được hỗ trợ trong khóa học. ITM chỉ lưu trữ ID tham chiếu đến DAM.
- **Quản lý Đăng ký/Gán Khóa học (Enrollment):** Cho phép người dùng nội bộ (hoặc nhóm người dùng) đăng ký hoặc được gán vào các khóa học.
- **Theo dõi Tiến trình Học tập:** Ghi nhận và theo dõi tiến trình học tập của từng người dùng trong từng khóa học (ví dụ: bài học đã hoàn thành, thời gian học, kết quả bài kiểm tra).
- **Quản lý Kết quả Bài kiểm tra:** Chấm điểm và lưu trữ kết quả các bài kiểm tra của người dùng.
- **Quản lý Chứng chỉ (Tùy chọn):** Phát hành và quản lý chứng chỉ hoàn thành khóa học (nếu có).
- **Báo cáo Đào tạo:** Cung cấp khả năng tạo các báo cáo về tình hình học tập (ví dụ: tỷ lệ hoàn thành khóa học, điểm trung bình bài kiểm tra theo khóa học/người dùng/bộ phận).
- **Phát Sự kiện Nghiệp vụ:** Phát ra các Sự kiện Nghiệp vụ quan trọng khi có thay đổi về nội dung đào tạo hoặc tiến trình học tập của người dùng.

## **4\. Mô hình Domain (Chi tiết hơn)**

Trong phạm vi Bounded Context ITM, chúng ta xác định các Aggregate Root, Entity và Value Object cốt lõi với các thuộc tính chính:

**Aggregate Roots:**

- **Course:** Là Aggregate Root đại diện cho một khóa học đào tạo. Course quản lý cấu trúc nội dung (Modules, Lessons, Quizzes) và thông tin chung về khóa học.
  - **ID:** Unique identifier (UUID).
  - **TenantId:** ID của tổ chức sở hữu khóa học (liên kết với IAM).
  - **Title:** Tiêu đề khóa học (có thể đa ngôn ngữ, sử dụng LZM).
  - **Description:** Mô tả khóa học (có thể đa ngôn ngữ, sử dụng LZM).
  - **Status:** Trạng thái khóa học (CourseStatus Value Object: Draft, Published, Archived).
  - **Modules:** Danh sách các Module Entities.
  - **TargetAudience:** Đối tượng mục tiêu (ví dụ: bộ phận, chức danh \- có thể liên kết với RDM hoặc HRM nếu có).
  - **EstimatedDuration:** Thời lượng ước tính (Duration Value Object).
  - **SupportedLocales:** Danh sách các Locale ID mà nội dung khóa học này hỗ trợ (lấy từ RDM).
  - **CoverImageAssetId:** **Optional** ID tham chiếu đến ảnh bìa trong DAM.
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ Publish, Archive, AddModule, RemoveModule, UpdateModuleOrder, **AddSupportedLocale, RemoveSupportedLocale**.
- **Enrollment:** Là Aggregate Root đại diện cho việc một người dùng đăng ký hoặc được gán vào một khóa học và theo dõi tiến trình học tập của họ.
  - **ID:** Unique identifier (UUID).
  - **TenantId:** ID của tổ chức.
  - **UserId:** ID của người dùng (liên kết với IAM).
  - **CourseId:** ID của khóa học.
  - **EnrollmentDate:** Ngày người dùng được đăng ký/gán. **Lưu trữ ở múi giờ UTC.**
  - **CompletionDate:** **Optional** Ngày hoàn thành khóa học. **Lưu trữ ở múi giờ UTC.**
  - **Status:** Trạng thái đăng ký (EnrollmentStatus Value Object: Not Started, In Progress, Completed, Failed, Cancelled).
  - **Progress:** Thông tin tiến trình chi tiết (LearningProgress Value Object).
  - **AssignedByUserId:** **Optional** ID người dùng đã gán khóa học (liên kết với IAM).
  - **DueDate:** **Optional** Ngày đáo hạn để hoàn thành khóa học. **Lưu trữ ở múi giờ UTC.**
  - **LearnerLocale:** Locale của người học tại thời điểm đăng ký hoặc locale ưa thích (lấy từ IAM), dùng để xác định phiên bản nội dung hiển thị mặc định.
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ StartCourse, CompleteLesson, SubmitQuiz, UpdateProgress, CompleteCourse, CancelEnrollment.

**Entities (thuộc về các Aggregate Root):**

- **Module (thuộc Course):** Đại diện cho một phần của khóa học.
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root Course.
  - **Title:** Tiêu đề Module (có thể đa ngôn ngữ, sử dụng LZM).
  - **Description:** Mô tả Module (có thể đa ngôn ngữ, sử dụng LZM).
  - **Order:** Thứ tự trong khóa học.
  - **Lessons:** Danh sách các Lesson Entities.
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ AddLesson, RemoveLesson, UpdateLessonOrder.
- **Lesson (thuộc Module):** Đại diện cho một bài học cụ thể.
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root Module.
  - **Title:** Tiêu đề Bài học (có thể đa ngôn ngữ, sử dụng LZM).
  - **Description:** Mô tả Bài học (có thể đa ngôn ngữ, sử dụng LZM).
  - **Order:** Thứ tự trong Module.
  - **ContentType:** Loại nội dung (ContentType Value Object: Text, Video, Document, Quiz).
  - **Content:** Chi tiết nội dung **đa ngôn ngữ** (MultilingualContent Value Object).
  - **EstimatedDuration:** Thời lượng ước tính (Duration Value Object).
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ UpdateContent.
- **Quiz (thuộc Lesson hoặc Module?):** Đại diện cho một bài kiểm tra. Có thể thuộc về Lesson hoặc Module tùy cấu trúc khóa học. Giả định thuộc Lesson cho đơn giản.
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root Lesson.
  - **Title:** Tiêu đề Quiz (có thể đa ngôn ngữ, sử dụng LZM).
  - **Description:** Mô tả Quiz (có thể đa ngôn ngữ, sử dụng LZM).
  - **Questions:** Danh sách các Question Entities.
  - **PassingScore:** Điểm tối thiểu để đạt.
  - **AttemptsAllowed:** Số lần làm bài tối đa.
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ AddQuestion, RemoveQuestion.
- **Question (thuộc Quiz):** Đại diện cho một câu hỏi trong bài kiểm tra.
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root Quiz.
  - **Text:** Nội dung câu hỏi **đa ngôn ngữ** (MultilingualText Value Object).
  - **Type:** Loại câu hỏi (QuestionType Value Object: MultipleChoice, SingleChoice, TextAnswer).
  - **Options:** Danh sách các AnswerOption Entities (cho Multiple/Single Choice).
  - **CorrectAnswer:** Đáp án đúng (Value Object phù hợp với Type, có thể cần hỗ trợ đa ngôn ngữ nếu đáp án là văn bản).
  - **Order:** Thứ tự trong Quiz.
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ UpdateText, AddOption, RemoveOption, SetCorrectAnswer.
- **AnswerOption (thuộc Question):** Một tùy chọn đáp án cho câu hỏi trắc nghiệm.
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Question.
  - **Text:** Nội dung tùy chọn **đa ngôn ngữ** (MultilingualText Value Object).
  - **Order:** Thứ tự hiển thị.
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
- **LearningProgress (Value Object thuộc Enrollment):** Đại diện cho tiến trình học tập chi tiết của người dùng trong khóa học.
  - **LessonProgresses:** Map\<LessonId, LessonProgress Value Object\>.
  - **QuizResults:** Map\<QuizId, QuizResult Value Object\>.
  - **OverallCompletionPercentage:** Tỷ lệ hoàn thành tổng thể (Integer).
  - **LastAccessedAt:** Thời điểm truy cập gần nhất. **Lưu trữ ở múi giờ UTC.**
  - **StartedAt:** Thời điểm bắt đầu học (sau khi đăng ký). **Lưu trữ ở múi giờ UTC.**
- **LessonProgress (Value Object thuộc LearningProgress):** Tiến trình học tập cho một bài học cụ thể.
  - **Status:** LessonStatus Value Object (Not Started, In Progress, Completed).
  - **CompletedAt:** **Optional** Thời điểm hoàn thành. **Lưu trữ ở múi giờ UTC.**
  - **TimeSpent:** Thời gian đã dành cho bài học (Duration Value Object).
- **QuizResult (Value Object thuộc LearningProgress):** Kết quả bài kiểm tra.
  - **Score:** Điểm đạt được.
  - **Attempts:** Số lần đã làm.
  - **SubmittedAt:** Thời điểm nộp bài. **Lưu trữ ở múi giờ UTC.**
  - **Passed:** Boolean (đạt hay không).
  - **Answers:** Map\<QuestionId, UserAnswer Value Object\>.
- **UserAnswer (Value Object thuộc QuizResult):** Câu trả lời của người dùng cho một câu hỏi.
  - **Value:** Giá trị câu trả lời (có thể là text, ID tùy chọn...).
- **MultilingualContent (Value Object thuộc Lesson):** Chứa nội dung bài học cho các ngôn ngữ khác nhau.
  - **ContentByLocale:** Map\<LocaleId, ContentDetails Value Object\>. Key là Locale ID (lấy từ RDM), Value là chi tiết nội dung cho locale đó.
- **ContentDetails (Value Object thuộc MultilingualContent):** Chi tiết nội dung cho một locale cụ thể.
  - **TextContent:** **Optional** Nội dung văn bản (TextContent Value Object).
  - **VideoContent:** **Optional** Nội dung video (VideoContent Value Object).
  - **DocumentContent:** **Optional** Nội dung tài liệu (DocumentContent Value Object).
  - **QuizContent:** **Optional** Nội dung Quiz (QuizContent Value Object).
- **TextContent (Value Object thuộc ContentDetails):** Nội dung bài học dạng văn bản.
  - **Body:** Nội dung văn bản (hỗ trợ định dạng Rich Text).
- **VideoContent (Value Object thuộc ContentDetails):** Nội dung bài học dạng video.
  - **AssetId:** ID tham chiếu đến file video trong DAM.
  - **Duration:** Thời lượng video (Duration Value Object).
- **DocumentContent (Value Object thuộc ContentDetails):** Nội dung bài học dạng tài liệu.
  - **AssetId:** ID tham chiếu đến file tài liệu trong DAM.
  - **FileType:** Loại file (ví dụ: PDF, DOCX).
- **QuizContent (Value Object thuộc ContentDetails):** Nội dung bài học dạng Quiz (chỉ chứa ID của Quiz).
  - **QuizId:** ID của Quiz Aggregate Root.
- **MultilingualText (Value Object thuộc Question/AnswerOption):** Chứa văn bản cho các ngôn ngữ khác nhau.
  - **TextByLocale:** Map\<LocaleId, String\>. Key là Locale ID, Value là văn bản cho locale đó.

**Value Objects:**

- **CourseStatus:** Trạng thái khóa học (Draft, Published, Archived).
- **EnrollmentStatus:** Trạng thái đăng ký (Not Started, In Progress, Completed, Failed, Cancelled).
- **LessonStatus:** Trạng thái bài học (Not Started, In Progress, Completed).
- **ContentType:** Loại nội dung bài học (Text, Video, Document, Quiz).
- **QuestionType:** Loại câu hỏi (MultipleChoice, SingleChoice, TextAnswer).
- **Duration:** Thời lượng (Value, Unit).
- **LocaleId:** ID của một ngôn ngữ/vùng miền (ví dụ: "vi-VN", "en-US"). Lấy từ RDM.

## **5\. Ngôn ngữ Chung (Ubiquitous Language)**

Trong Bounded Context ITM, các thuật ngữ sau đây có ý nghĩa cụ thể và nhất quán:

- **Course:** Một chương trình đào tạo hoàn chỉnh.
- **Module:** Một phần hoặc chương trong Course.
- **Lesson:** Một bài học cụ thể trong Module.
- **Quiz:** Một bài kiểm tra để đánh giá kiến thức.
- **Question:** Một câu hỏi trong Quiz.
- **Enrollment:** Việc một người dùng được đăng ký hoặc gán vào một Course.
- **Learner:** Người dùng nội bộ đang tham gia đào tạo (liên kết với User trong IAM).
- **Instructor/Trainer:** Người tạo hoặc quản lý nội dung đào tạo (người dùng nội bộ có quyền phù hợp).
- **Progress:** Tiến trình học tập của Learner trong Course.
- **Completion:** Việc Learner hoàn thành Course.
- **Passing Score:** Điểm tối thiểu cần đạt trong Quiz hoặc Course.
- **Assignment:** Hành động gán một Course cho một Learner hoặc nhóm Learner.
- **Training Material:** Tài liệu hoặc file media được sử dụng trong Bài học (được lưu trữ trong DAM).
- **Certificate:** Chứng chỉ được cấp khi hoàn thành Course.
- **Training Report:** Báo cáo tổng hợp về tình hình đào tạo.
- **Supported Locale:** Một ngôn ngữ/vùng miền được hỗ trợ cho nội dung khóa học.
- **Multilingual Content:** Nội dung bài học có sẵn ở nhiều ngôn ngữ.

## **6\. Các Khía cạnh Quan trọng của Miền ITM**

Phần này mô tả các cấu trúc, quy tắc và khái niệm nghiệp vụ quan trọng chi phối hoạt động của Bounded Context ITM.

### **6.1. Cấu trúc Phân cấp của Khóa học**

Course Aggregate Root tổ chức nội dung thành cấu trúc phân cấp: Course chứa Modules, Modules chứa Lessons. Lessons có thể chứa nội dung đa dạng hoặc liên kết đến Quiz. Cấu trúc này cho phép tổ chức nội dung đào tạo một cách logic và theo trình tự.

### **6.2. Quản lý Tiến trình Học tập (Enrollment)**

Enrollment Aggregate Root chịu trách nhiệm theo dõi toàn bộ hành trình học tập của một người dùng trong một khóa học cụ thể. Nó ghi nhận bài học nào đã hoàn thành, kết quả bài kiểm tra, và tính toán tỷ lệ hoàn thành tổng thể. Trạng thái của Enrollment phản ánh tiến độ chung của người học.

### **6.3. Xử lý Nội dung Đa ngôn ngữ (Multilingual Content)**

Đây là khía cạnh quan trọng để hỗ trợ nhân sự đa quốc gia.

- **Metadata vs. Core Content:** ITM phân biệt giữa metadata của khóa học (tiêu đề, mô tả Course, Module, Lesson, Quiz, Question, AnswerOption) và nội dung cốt lõi của bài học (văn bản bài giảng, video, tài liệu, cấu trúc câu hỏi/đáp án chi tiết của Quiz).
- **Metadata:** Metadata được quản lý thông qua LocalizedText Value Object (hoặc tương tự) và phụ thuộc vào LZM để tra cứu bản dịch khi hiển thị.
- **Core Content:** Nội dung cốt lõi của Lesson (văn bản, liên kết DAM cho video/tài liệu) và văn bản của Question/AnswerOption được lưu trữ trực tiếp trong ITM dưới dạng MultilingualContent hoặc MultilingualText Value Object. Cấu trúc này là một Map (Locale ID \-\> Content/Text), cho phép lưu trữ nhiều phiên bản ngôn ngữ cho cùng một nội dung logic.
- **Lựa chọn Ngôn ngữ Nội dung:** Khi người học truy cập nội dung bài học hoặc bài kiểm tra, ITM (hoặc Client App sau khi truy vấn từ ITM) sẽ xác định ngôn ngữ hiển thị dựa trên:
  1. Locale ưa thích của người dùng (lấy từ IAM).
  2. Các SupportedLocales của Course.
  3. Sự sẵn có của nội dung cho locale đó trong MultilingualContent/MultilingualText.
  4. Nếu nội dung cho locale ưa thích không có, hệ thống có thể fallback về ngôn ngữ mặc định của khóa học hoặc một ngôn ngữ ưu tiên khác được cấu hình.
- **Trách nhiệm:** ITM chịu trách nhiệm lưu trữ và cung cấp các phiên bản ngôn ngữ khác nhau của nội dung cốt lõi. Người tạo khóa học chịu trách nhiệm cung cấp các bản dịch nội dung này.

### **6.4. Liên kết với Tài sản Kỹ thuật số (DAM)**

ITM không lưu trữ file nội dung vật lý (video, tài liệu) mà chỉ lưu trữ ID tham chiếu đến các Asset trong DAM. Khi hiển thị nội dung, ITM (hoặc Client App) sẽ gọi DAM để lấy thông tin chi tiết và URL của Asset.

### **6.5. Tương tác với IAM/HRM cho Thông tin Người dùng**

ITM dựa vào IAM để xác định danh tính người học (User ID) và thông tin cơ bản (Tenant ID, Locale ưa thích). ITM có thể tương tác với HRM để lấy thông tin chi tiết hơn về nhân viên (chức danh, phòng ban) cho mục đích gán khóa học mục tiêu hoặc báo cáo.

### **6.6. Ranh giới với Hệ thống Chấm công/Lịch làm việc**

ITM theo dõi thời gian học tập thực tế (TimeSpent) trên từng bài học, nhưng không liên quan đến hệ thống chấm công chính thức của tổ chức (thường thuộc HRM hoặc một BC chuyên biệt). Thời gian học tập trong ITM chỉ mang tính chất thống kê cho mục đích đào tạo.

## **7\. Tương tác với các Bounded Context khác**

ITM tương tác với các Bounded Context khác thông qua cả mô hình bất đồng bộ (Event-Driven) và đồng bộ (Request/Reply).

- **Tương tác với Core BCs:**
  - **IAM:** ITM gọi IAM (Request/Reply) để xác thực và ủy quyền. ITM gọi IAM (Request/Reply) để lấy thông tin User (bao gồm **Locale ưa thích**) và Tenant (Tenant ID). IAM phát Event (UserCreated, UserStatusChanged) mà ITM có thể lắng nghe để quản lý trạng thái Enrollment (ví dụ: tạm dừng Enrollment nếu User bị vô hiệu hóa).
  - **NDM:** ITM yêu cầu NDM gửi thông báo liên quan đến đào tạo (ví dụ: gán khóa học mới, nhắc nhở hạn chót, thông báo hoàn thành khóa học). Yêu cầu này bao gồm thông tin về người nhận và ngữ cảnh (Course ID, Due Date) để NDM có thể bản địa hóa thông báo (sử dụng LZM) và gửi đi.
  - **LZM & RDM:** ITM cần LZM (Request/Reply) để quản lý và hiển thị metadata đa ngôn ngữ (tiêu đề, mô tả) của các thành phần khóa học. ITM cần RDM (Request/Reply) để lấy danh sách các Locale được hỗ trợ và các dữ liệu tham chiếu khác (ví dụ: loại nội dung, loại câu hỏi).
  - **ALM:** ITM phát ra các sự kiện audit log (Event) khi có các hành động quan trọng (ví dụ: tạo/cập nhật khóa học, gán khóa học, người dùng hoàn thành bài học/quiz/khóa học).
- **Tương tác với Feature BCs:**
  - **DAM:** ITM gọi DAM (Request/Reply) để lấy thông tin chi tiết và URL của các Asset nội dung đào tạo (video, tài liệu) dựa trên Asset ID được lưu trữ trong Lesson. DAM phát Event (AssetDeleted) mà ITM có thể lắng nghe để xử lý các liên kết bị đứt.
  - **HRM (Tiềm năng):** ITM gọi HRM (Request/Reply) để lấy thông tin chi tiết về Employee (chức danh, phòng ban) dựa trên User ID cho mục đích gán khóa học hoặc báo cáo. HRM phát Event (EmployeeCreated, EmployeeProfileUpdated \- nếu thông tin công việc thay đổi) mà ITM có thể lắng nghe để cập nhật thông tin liên kết hoặc kích hoạt gán khóa học tự động (nếu có logic đó).
  - **WPM (Tiềm năng):** ITM phát Event (CourseCompleted, LessonCompleted, QuizCompleted) mà WPM có thể lắng nghe để kích hoạt Task/Workflow liên quan (ví dụ: task "Phỏng vấn sau đào tạo", workflow "Cập nhật kỹ năng nhân viên"). WPM có thể gửi Command (ví dụ: RequireTrainingCompletionCommand) hoặc Event mà ITM lắng nghe để tạo Enrollment hoặc đánh dấu một yêu cầu hoàn thành khóa học.

## **8\. Use cases**

Dưới đây là mô tả các use case chính có sự tham gia của ITM, được tổ chức theo các nhóm chức năng chính, tập trung vào actor, mục đích và các service liên quan.

### **8.1. Use Cases liên quan đến Quản lý Nội dung Đào tạo**

Nhóm này bao gồm các use case liên quan đến việc tạo, cập nhật, và tổ chức cấu trúc và nội dung của các khóa học.

- **Use case: Tạo Khóa học Mới:**
  - **Actor:** Người dùng (có quyền tạo khóa học \- Instructor/Admin).
  - **Mục đích:** Định nghĩa một khóa học đào tạo mới với cấu trúc ban đầu và xác định các ngôn ngữ nội dung được hỗ trợ.
  - **Service liên quan:** Được xử lý bởi TrainingContentApplicationService (Command). Sử dụng TrainingContentService để tạo Course Aggregate Root, bao gồm cả việc thiết lập SupportedLocales. Sử dụng Course Repository. Phát sự kiện CourseCreated, audit log cho ALM.
- **Use case: Cập nhật Cấu trúc/Nội dung Khóa học:**
  - **Actor:** Người dùng (có quyền cập nhật khóa học \- Instructor/Admin).
  - **Mục đích:** Thêm/sửa/xóa Module, Lesson, Quiz, Question, AnswerOption; cập nhật metadata (tiêu đề/mô tả \- sử dụng LZM); **cập nhật nội dung cốt lõi đa ngôn ngữ**; liên kết/hủy liên kết asset DAM; cập nhật SupportedLocales.
  - **Service liên quan:** Được xử lý bởi TrainingContentApplicationService (Command). Sử dụng TrainingContentService để lấy và cập nhật Course Aggregate Root. TrainingContentService xử lý việc thêm/sửa/xóa các Entities/Value Objects con, bao gồm cả MultilingualContent/MultilingualText. Gọi DAM Service để kiểm tra/liên kết asset. Sử dụng Course Repository. Phát sự kiện CourseUpdated, audit log cho ALM.
- **Use case: Xuất bản/Lưu trữ Khóa học:**
  - **Actor:** Người dùng (có quyền quản lý khóa học).
  - **Mục đích:** Thay đổi trạng thái của khóa học để nó hiển thị/ẩn đối với người học.
  - **Service liên quan:** Được xử lý bởi TrainingContentApplicationService (Command). Sử dụng TrainingContentService để thay đổi trạng thái Course Aggregate Root. Sử dụng Course Repository. Phát sự kiện CourseStatusChanged, audit log cho ALM.
- **Use case: Xem Chi tiết Khóa học (cho người quản lý):**
  - **Actor:** Người dùng (có quyền xem chi tiết khóa học).
  - **Mục đích:** Xem toàn bộ cấu trúc, nội dung (bao gồm các phiên bản ngôn ngữ khác nhau), và cài đặt của khóa học.
  - **Service liên quan:** Được xử lý bởi TrainingQueryApplicationService (Query). Sử dụng TrainingQueryService để lấy Course Aggregate Root. TrainingQueryService gọi LZM để lấy bản dịch metadata, DAM để lấy thông tin asset. Sử dụng Course Repository.

### **8.2. Use Cases liên quan đến Quản lý Đăng ký và Học tập**

Nhóm này bao gồm các use case để gán khóa học cho người dùng, theo dõi tiến trình học và ghi nhận kết quả.

- **Use case: Gán Khóa học cho Người dùng/Nhóm:**
  - **Actor:** Người dùng (có quyền quản lý đăng ký \- Admin/Manager).
  - **Mục đích:** Chỉ định một hoặc nhiều khóa học cho một hoặc nhiều người dùng hoặc nhóm người dùng (ví dụ: theo phòng ban, chức danh \- lấy dữ liệu từ HRM).
  - **Service liên quan:** Được xử lý bởi EnrollmentApplicationService (Command). Sử dụng EnrollmentService để tạo Enrollment Aggregate Roots. EnrollmentService gọi IAM (để lấy thông tin User/Locale) và có thể gọi HRM (để lấy danh sách User theo tiêu chí). Sử dụng Enrollment Repository. Phát sự kiện CourseAssigned, UserEnrolledInCourse, audit log cho ALM. Yêu cầu NDM gửi thông báo gán khóa học.
- **Use case: Người dùng Bắt đầu Khóa học:**
  - **Actor:** Người dùng (Learner) đã được gán/đăng ký khóa học.
  - **Mục đích:** Đánh dấu thời điểm người dùng bắt đầu học khóa học.
  - **Service liên quan:** Được xử lý bởi EnrollmentApplicationService (Command). Sử dụng EnrollmentService để lấy và cập nhật trạng thái Enrollment Aggregate Root thành In Progress và ghi lại StartedAt. Sử dụng Enrollment Repository. Phát sự kiện EnrollmentStatusChanged, audit log cho ALM.
- **Use case: Người dùng Hoàn thành Bài học:**
  - **Actor:** Người dùng (Learner) đang học.
  - **Mục đích:** Ghi nhận việc người dùng đã xem/hoàn thành một bài học cụ thể.
  - **Service liên quan:** Được xử lý bởi EnrollmentApplicationService (Command). Sử dụng EnrollmentService để lấy Enrollment Aggregate Root. EnrollmentService cập nhật trạng thái LessonProgress trong LearningProgress Value Object. Tính toán lại OverallCompletionPercentage. Sử dụng Enrollment Repository. Phát sự kiện LessonCompleted, EnrollmentProgressUpdated, audit log cho ALM.
- **Use case: Người dùng Làm và Nộp Bài kiểm tra:**
  - **Actor:** Người dùng (Learner) đang học.
  - **Mục đích:** Ghi nhận kết quả làm bài kiểm tra của người dùng.
  - **Service liên quan:** Được xử lý bởi EnrollmentApplicationService (Command). Sử dụng EnrollmentService để lấy Enrollment Aggregate Root và Quiz Aggregate Root (để chấm điểm). EnrollmentService tạo QuizResult Value Object, chấm điểm, đánh dấu Passed/Failed, lưu câu trả lời. Cập nhật LearningProgress. Tính toán lại OverallCompletionPercentage. Sử dụng Enrollment Repository, Course Repository (để lấy Quiz). Phát sự kiện QuizCompleted, EnrollmentProgressUpdated, audit log cho ALM.
- **Use case: Người dùng Hoàn thành Khóa học:**
  - **Actor:** Hệ thống (khi tất cả điều kiện hoàn thành được đáp ứng trong EnrollmentService).
  - **Mục đích:** Đánh dấu khóa học là hoàn thành cho người dùng đó.
  - **Service liên quan:** Được xử lý bởi EnrollmentService (sau khi xử lý CompleteLessonCommand hoặc SubmitQuizCommand). Cập nhật trạng thái Enrollment Aggregate Root thành Completed và ghi lại CompletionDate. Sử dụng Enrollment Repository. Phát sự kiện EnrollmentStatusChanged, CourseCompleted, audit log cho ALM. Phát sự kiện CourseCompleted cho WPM (nếu cần kích hoạt task/workflow). Yêu cầu NDM gửi thông báo hoàn thành khóa học.
- **Use case: Xem Tiến trình Học tập của Người dùng:**
  - **Actor:** Người dùng (Learner), Người quản lý (có quyền xem tiến trình của nhân viên).
  - **Mục đích:** Xem chi tiết tiến trình học tập, các bài học đã hoàn thành, kết quả bài kiểm tra trong một khóa học cụ thể.
  - **Service liên quan:** Được xử lý bởi TrainingQueryApplicationService (Query). Sử dụng TrainingQueryService để lấy Enrollment Aggregate Root. TrainingQueryService gọi Course Repository để lấy cấu trúc khóa học tương ứng. Sử dụng Enrollment Repository, Course Repository.

### **8.3. Use Cases liên quan đến Báo cáo**

Nhóm này bao gồm việc tạo và xem các báo cáo tổng hợp về tình hình đào tạo.

- **Use case: Tạo Báo cáo Đào tạo:**
  - **Actor:** Người dùng (có quyền xem báo cáo \- Admin/HR Manager).
  - **Mục đích:** Tổng hợp dữ liệu từ nhiều Enrollment và Course để tạo báo cáo về tình hình đào tạo trong tổ chức.
  - **Service liên quan:** Được xử lý bởi TrainingQueryApplicationService (Query). Sử dụng ReportingService hoặc TrainingQueryService để truy vấn và tổng hợp dữ liệu từ Enrollment Repository và Course Repository dựa trên các tiêu chí lọc/nhóm (ví dụ: theo khóa học, theo bộ phận \- cần gọi HRM, theo khoảng thời gian).

## **9\. Domain Services**

Domain Services trong ITM chứa logic nghiệp vụ quan trọng không thuộc về một Aggregate Root cụ thể hoặc cần phối hợp nhiều Aggregate Root.

- **TrainingContentService:**
  - **Trách nhiệm:** Quản lý vòng đời của Course, Module, Lesson, Quiz, Question. Thực hiện các quy tắc nghiệp vụ liên quan đến cấu trúc khóa học, liên kết nội dung (với DAM ID). **Quản lý việc thêm/sửa/xóa các phiên bản ngôn ngữ của nội dung cốt lõi (MultilingualContent/MultilingualText) và đảm bảo tính hợp lệ (ví dụ: nội dung cho các SupportedLocales phải có sẵn).** Phối hợp với Course Repository, DAM Service (để lấy thông tin asset), RDM Service (để kiểm tra Locale ID).
  - **Các phương thức tiềm năng:** CreateCourse(tenantId, details), UpdateCourse(courseId, tenantId, updates), PublishCourse(courseId, tenantId), ArchiveCourse(courseId, tenantId), AddModuleToCourse(courseId, tenantId, moduleDetails), AddLessonToModule(courseId, moduleId, tenantId, lessonDetails), AddQuizToLesson(courseId, lessonId, tenantId, quizDetails), **UpdateLessonContent(courseId, lessonId, tenantId, multilingualContent)**, **UpdateQuestionText(courseId, quizId, questionId, tenantId, multilingualText)**, **UpdateAnswerOptionText(courseId, quizId, questionId, optionId, tenantId, multilingualText)**.
- **EnrollmentService:**
  - **Trách nhiệm:** Quản lý vòng đời của Enrollment. Xử lý việc đăng ký/gán khóa học, cập nhật tiến trình học tập, xử lý kết quả bài kiểm tra, xác định trạng thái hoàn thành khóa học. **Xác định phiên bản ngôn ngữ nội dung phù hợp để hiển thị cho người học dựa trên Locale ưa thích và SupportedLocales của Course.** Phối hợp với Enrollment Repository, Course Repository (để lấy cấu trúc khóa học, quy tắc hoàn thành/điểm đỗ, SupportedLocales), IAM Service (để lấy Locale ưa thích của User).
  - **Các phương thức tiềm năng:** AssignCourseToUser(userId, courseId, tenantId, assignedByUserId, dueDate), StartCourse(enrollmentId, userId, tenantId), CompleteLesson(enrollmentId, userId, tenantId, lessonId), SubmitQuiz(enrollmentId, userId, tenantId, quizId, answers), UpdateOverallProgress(enrollmentId, userId, tenantId), CompleteCourse(enrollmentId, userId, tenantId), **GetLessonContentForLearner(enrollmentId, lessonId, userId, tenantId)**, **GetQuizForLearner(enrollmentId, quizId, userId, tenantId)**.
- **ReportingService:**
  - **Trách nhiệm:** Tổng hợp dữ liệu từ các Enrollment và Course để tạo báo cáo đào tạo. Phối hợp với Enrollment Repository, Course Repository, HRM Service (để lấy thông tin nhân viên/tổ chức cho báo cáo).
  - **Các phương thức tiềm năng:** GenerateCompletionReport(tenantId, criteria), GenerateQuizScoreReport(tenantId, criteria).
- **TrainingQueryService (Optional Domain Service):** Nếu logic truy vấn phức tạp (tìm kiếm khóa học, lọc theo nhiều tiêu chí, lấy danh sách theo ngôn ngữ hỗ trợ), có thể tách ra.
  - **Trách nhiệm:** Cung cấp các phương thức truy vấn dữ liệu khóa học, tiến trình học tập, kết quả bài kiểm tra. Phối hợp với Course Repository, Enrollment Repository, LZM Service (cho metadata), DAM Service (cho asset), **HRM Service (cho thông tin nhân viên/tổ chức)**.
  - **Các phương thức tiềm năng:** GetCourseDetails(courseId, tenantId, requestLocale), GetEnrollmentDetails(enrollmentId, tenantId), GetUserEnrollments(userId, tenantId), SearchCourses(criteria, tenantId, requestLocale), **GetCoursesBySupportedLocale(localeId, tenantId)**.

## **9\. Application Services**

Application Services trong ITM là lớp mỏng điều phối các hành động từ bên ngoài (ví dụ: từ API Gateway, Message Broker) đến Domain Model (Aggregate Roots, Domain Services). Chúng xử lý các tác vụ kỹ thuật như xác thực, ủy quyền (thông qua IAM), giao dịch cơ sở dữ liệu, và phát sự kiện.

- **TrainingContentApplicationService:**
  - **Trách nhiệm:** Xử lý các command liên quan đến quản lý nội dung đào tạo từ API (ví dụ: CreateCourseCommand, AddLessonToModuleCommand, **UpdateLessonContentCommand**, **UpdateQuestionTextCommand**). Sử dụng TrainingContentService và các Repository tương ứng. Thực hiện ủy quyền với IAM. Lắng nghe các event từ RDM (ví dụ: LocaleAdded) để cập nhật danh sách Locale được hỗ trợ.
  - **Các phương thức tiềm năng:** HandleCreateCourseCommand(command), HandleAddLessonToModuleCommand(command), **HandleUpdateLessonContentCommand(command)**, **HandleUpdateQuestionTextCommand(command)**.
- **EnrollmentApplicationService:**
  - **Trách nhiệm:** Xử lý các command liên quan đến đăng ký và tiến trình học tập từ API (ví dụ: AssignCourseCommand, CompleteLessonCommand, SubmitQuizCommand). Sử dụng EnrollmentService và các Repository tương ứng. Thực hiện ủy quyền với IAM. Lắng nghe các event liên quan đến User hoặc Tenant từ IAM/BUM (ví dụ: UserStatusChanged, TenantSubscriptionSuspended) để xử lý các trường hợp đặc biệt (ví dụ: tạm dừng Enrollment nếu User bị vô hiệu hóa). Lắng nghe event từ WPM (ví dụ: TrainingCompletionRequired) để tạo Enrollment.
  - **Các phương thức tiềm năng:** HandleAssignCourseCommand(command), HandleCompleteLessonCommand(command), HandleSubmitQuizCommand(command), HandleUserStatusChangedEvent(event), HandleTrainingCompletionRequiredEvent(event).
- **TrainingQueryApplicationService:**
  - **Trách nhiệm:** Xử lý các query để lấy thông tin khóa học, tiến trình học tập, báo cáo (ví dụ: GetCourseDetailsQuery, GetTrainingReportQuery, **GetLessonContentQueryForLearner**). Sử dụng TrainingQueryService, ReportingService hoặc các Domain Service khác. Thực hiện ủy quyền với IAM.
  - **Các phương thức tiềm năng:** HandleGetCourseDetailsQuery(query), HandleGetTrainingReportQuery(query), **HandleGetLessonContentQueryForLearner(query)**.

## **10\. Domain Events**

ITM sẽ phát ra các Domain Event quan trọng để thông báo cho các Bounded Context khác về những thay đổi trạng thái nghiệp vụ trong phạm vi của nó.

- **CourseCreated:** Phát ra khi một khóa học mới được tạo.
  - **Payload:**
    - CourseId (UUID)
    - TenantId (UUID)
    - Title (LocalizedText/String)
    - Status (String)
    - SupportedLocales (List of LocaleId)
    - CreatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **CourseUpdated:** Phát ra khi thông tin khóa học được cập nhật (trừ trạng thái).
  - **Payload:**
    - CourseId (UUID)
    - TenantId (UUID)
    - UpdatedFields (Object \- ví dụ: { "title": "...", "supportedLocales": \[...\] })
    - UpdatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **CourseStatusChanged:** Phát ra khi trạng thái khóa học thay đổi (Draft \-\> Published, Published \-\> Archived).
  - **Payload:**
    - CourseId (UUID)
    - TenantId (UUID)
    - OldStatus (String)
    - NewStatus (String)
    - UpdatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **CourseDeleted:** Phát ra khi một khóa học bị xóa (logic xóa mềm).
  - **Payload:**
    - CourseId (UUID)
    - TenantId (UUID)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **CourseAssigned:** Phát ra khi khóa học được gán cho một hoặc nhiều người dùng.
  - **Payload:**
    - CourseId (UUID)
    - TenantId (UUID)
    - UserIds (List of UUID)
    - AssignedByUserId (UUID, optional)
    - DueDate (DateTime, optional) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **UserEnrolledInCourse:** Phát ra khi người dùng được đăng ký hoặc gán vào khóa học.
  - **Payload:**
    - EnrollmentId (UUID)
    - UserId (UUID)
    - CourseId (UUID)
    - TenantId (UUID)
    - EnrollmentDate (DateTime) **(ở múi giờ UTC)**
    - LearnerLocale (LocaleId)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **EnrollmentStatusChanged:** Phát ra khi trạng thái đăng ký thay đổi (Not Started \-\> In Progress, In Progress \-\> Completed).
  - **Payload:**
    - EnrollmentId (UUID)
    - UserId (UUID)
    - CourseId (UUID)
    - TenantId (UUID)
    - OldStatus (String)
    - NewStatus (String)
    - CompletionDate (DateTime, optional \- nếu NewStatus là Completed) **(ở múi giờ UTC)**
    - UpdatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **LessonCompleted:** Phát ra khi người dùng hoàn thành một bài học.
  - **Payload:**
    - EnrollmentId (UUID)
    - UserId (UUID)
    - CourseId (UUID)
    - TenantId (UUID)
    - LessonId (UUID)
    - CompletedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **QuizCompleted:** Phát ra khi người dùng hoàn thành một bài kiểm tra.
  - **Payload:**
    - EnrollmentId (UUID)
    - UserId (UUID)
    - CourseId (UUID)
    - TenantId (UUID)
    - QuizId (UUID)
    - Score (Decimal)
    - Passed (Boolean)
    - Attempts (Integer)
    - SubmittedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **EnrollmentProgressUpdated:** Phát ra khi tiến trình học tập tổng thể của người dùng trong khóa học được cập nhật.
  - **Payload:**
    - EnrollmentId (UUID)
    - UserId (UUID)
    - CourseId (UUID)
    - TenantId (UUID)
    - OverallCompletionPercentage (Integer)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **CourseCompleted:** Phát ra khi người dùng hoàn thành khóa học (Enrollment Status \= Completed).
  - **Payload:**
    - EnrollmentId (UUID)
    - UserId (UUID)
    - CourseId (UUID)
    - TenantId (UUID)
    - CompletionDate (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **TrainingReportGenerated:** Phát ra khi báo cáo đào tạo được tạo thành công.
  - **Payload:**
    - ReportId (UUID)
    - TenantId (UUID)
    - GeneratedByUserId (UUID)
    - ReportType (String)
    - FileAssetId (UUID, optional \- nếu lưu report dưới dạng file)
    - GeneratedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**

## **11\. Ranh giới Nghiệp vụ**

Ranh giới của Bounded Context ITM được xác định bởi trách nhiệm quản lý nội dung đào tạo nội bộ (khóa học, module, bài học, bài kiểm tra, **bao gồm các phiên bản nội dung đa ngôn ngữ**) và theo dõi tiến trình học tập của người dùng nội bộ (nhân viên của tổ chức khách hàng). ITM là nguồn sự thật về nội dung đào tạo và lịch sử học tập của từng nhân viên trong các khóa học đó.

ITM không chịu trách nhiệm:

- **Xác thực danh tính người dùng:** Chỉ sử dụng dịch vụ của IAM. ITM liên kết với User ID từ IAM.
- **Lưu trữ file nội dung đào tạo vật lý:** Trách nhiệm này thuộc về DAM. ITM chỉ lưu trữ ID tham chiếu.
- **Quản lý dữ liệu nhân sự chi tiết:** Thông tin lương, hợp đồng, cấu trúc phòng ban chi tiết (trừ khi được cung cấp bởi HRM). ITM chủ yếu dựa vào User ID và Tenant ID từ IAM.
- **Quản lý bản dịch metadata:** Metadata (tiêu đề, mô tả) được quản lý bởi LZM. ITM chỉ lưu trữ Translation Key hoặc LocalizedText và gọi LZM để tra cứu.
- **Quản lý quy tắc định dạng locale:** Chỉ sử dụng dịch vụ của RDM.
- **Ghi nhận audit logs:** Chỉ phát sự kiện cho ALM.
- **Quản lý các miền nghiệp vụ khác** như sản phẩm, đơn hàng, khách hàng, tài chính, v.v.
- **Cung cấp nền tảng học tập cho khách hàng bên ngoài:** ITM chỉ dành cho đào tạo nội bộ của tổ chức khách hàng.
- **Tự động hóa các quy trình đào tạo phức tạp:** ITM tập trung vào quản lý nội dung và tiến trình. Các logic tự động hóa phức tạp hơn có thể nằm ở lớp Application Service hoặc các BC chuyên biệt khác (ví dụ: WPM kích hoạt gán khóa học khi nhân viên vào phòng ban mới).

## **12\. Kết luận**

Bounded Context Internal Training Management (ITM) là một thành phần quan trọng trong hệ thống Ecoma, cho phép các tổ chức khách hàng quản lý hiệu quả quy trình đào tạo nội bộ. Bằng cách tập trung trách nhiệm quản lý nội dung đào tạo (**bao gồm hỗ trợ đa ngôn ngữ**) và theo dõi tiến trình học tập vào một Context duy nhất, ITM cung cấp một nền tảng đáng tin cậy để nâng cao năng lực của nhân viên, đặc biệt hữu ích trong môi trường làm việc đa quốc gia. Việc thiết kế ITM với mô hình domain rõ ràng, các khía cạnh quan trọng của miền được làm rõ (bao gồm chiến lược nội dung đa ngôn ngữ), tương tác được định nghĩa và các sự kiện nghiệp vụ phù hợp là nền tảng để xây dựng một hệ thống quản lý đào tạo nội bộ mạnh mẽ và dễ mở rộng, đồng thời đảm bảo tính nhất quán với cấu trúc tài liệu của các Core BCs như ALM, BUM, IAM và các Feature BC khác.

Tài liệu này cung cấp cái nhìn tổng quan chi tiết về ITM, bao gồm mô hình domain, các khía cạnh quan trọng của miền, tương tác, use cases, Domain Service, Application Service và Domain Event (phát ra với payload dự kiến). Đây là nền tảng để chuyển sang giai đoạn thiết kế kỹ thuật chi tiết và triển khai Microservice ITM.
