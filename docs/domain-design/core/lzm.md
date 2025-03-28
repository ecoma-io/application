# **Tài liệu Thiết kế Miền: Bounded Context Localization Management (LZM)**

## **1\. Giới thiệu**

Tài liệu này cung cấp mô tả chi tiết về Bounded Context **Localization Management (LZM)** trong hệ thống Ecoma. LZM là một trong những Bounded Context cốt lõi (Core Bounded Context), chịu trách nhiệm quản lý, lưu trữ và cung cấp các bản dịch và nội dung bản địa hóa cho toàn bộ hệ thống.

LZM đảm bảo rằng người dùng có thể tương tác với hệ thống bằng ngôn ngữ ưa thích của họ, cung cấp trải nghiệm người dùng tốt hơn và hỗ trợ hoạt động kinh doanh tại các thị trường đa ngôn ngữ. LZM hoạt động như một kho lưu trữ tập trung cho tất cả các tài nguyên bản địa hóa.

## **2\. Phạm vi của Tài liệu**

Tài liệu này tập trung vào việc định nghĩa và mô tả Bounded Context LZM ở cấp độ thiết kế miền (domain design), cung cấp đủ chi tiết để hỗ trợ việc thiết kế các Domain Service và Application Service. Cụ thể, tài liệu này bao gồm:

- Xác định vai trò và trách nhiệm chính của LZM, bao gồm cả yêu cầu về hiệu năng truy vấn.
- Mô tả các khái niệm và thực thể cốt lõi trong mô hình domain của LZM ở cấp độ chi tiết hơn, bao gồm các Aggregate Root, Entity và Value Object với các thuộc tính chính, cung cấp thêm ví dụ về các loại nội dung cần bản địa hóa và làm rõ các trạng thái bản dịch, cũng như cân nhắc về các loại bản dịch phức tạp.
- Định nghĩa Ngôn ngữ Chung (Ubiquitous Language) trong phạm vi LZM.
- Mô tả **Các Khía cạnh Quan trọng của Miền LZM**, bao gồm vòng đời trạng thái bản dịch, logic fallback cho bản dịch thiếu, yêu cầu hiệu năng truy vấn, và xử lý các loại bản dịch phức tạp.
- Làm rõ các tương tác chính giữa LZM và các Bounded Context khác, đặc biệt là cách LZM sử dụng dữ liệu Locale và Ngôn ngữ Gốc từ RDM, cách các BC khác truy vấn dữ liệu bản địa hóa từ LZM (bao gồm cả cơ chế xử lý bản dịch thiếu), và việc LZM phát sinh Audit Log.
- Phác thảo các **Use cases** chính có sự tham gia của LZM, tập trung vào actor, mục đích và các Domain/Application Service liên quan, bao gồm quản lý (tạo, cập nhật, xóa) các bản dịch (có tính đến vòng đời trạng thái), cung cấp bản dịch thông qua truy vấn hiệu quả, và nhập/xuất dữ liệu bản dịch (ở mức cao).
- Xác định ranh giới nghiệp vụ của LZM.
- Đề xuất các Domain Service và Application Service tiềm năng trong LZM với mô tả chi tiết hơn về trách nhiệm của từng Service.
- Làm rõ các quy tắc nghiệp vụ liên quan đến việc quản lý bản dịch (ví dụ: tính duy nhất của khóa bản dịch trong một locale, vòng đời trạng thái bản dịch, xử lý bản dịch thiếu) được mô tả ở cấp độ thiết kế miền.
- Liệt kê và mô tả các **Domain Events** mà LZM tương tác, được chia thành các sự kiện LZM **phát ra** (Published Events) và các sự kiện LZM **lắng nghe và xử lý** (Consumed Events), bao gồm payload dự kiến của từng event.

**Trong phạm vi tài liệu này:**

- Các khái niệm về **Commands** (yêu cầu thực hiện một hành động) và **Queries** (yêu cầu lấy dữ liệu) được đề cập để mô tả cách các Bounded Context khác tương tác với LZM (quản lý bản dịch, truy vấn bản dịch) và cách các luồng nghiệp vụ được kích hoạt thông qua các **Application Services**.
- Vai trò và trách nhiệm của **Domain Services** và **Application Services** trong việc xử lý logic nghiệp vụ và điều phối các tương tác được mô tả ở cấp độ chức năng.
- Các **Domain Events** quan trọng được xác định để mô tả những thay đổi trạng thái nghiệp vụ mà LZM phát ra (ví dụ: bản dịch được tạo/cập nhật/xóa), hỗ trợ các BC khác phản ứng hoặc cập nhật cache bản dịch.
- Các quy tắc nghiệp vụ liên quan đến việc quản lý bản dịch (ví dụ: tính duy nhất của khóa bản dịch trong một locale, vòng đời trạng thái bản dịch, xử lý bản dịch thiếu) được mô tả ở cấp độ thiết kế miền.
- Mối quan hệ phụ thuộc với RDM trong việc quản lý danh sách Locale và Ngôn ngữ Gốc được làm rõ.
- Khả năng nhập/xuất dữ liệu bản dịch được phác thảo ở mức cao.
- Tương tác nghiệp vụ với hệ thống TMS được đề cập.
- Yêu cầu về **hiệu năng truy vấn** và **ghi log audit** cho các hoạt động quản lý được đề cập.
- Cân nhắc về các loại bản dịch phức tạp (ví dụ: số nhiều, ngữ cảnh) được đề cập trong mô hình domain.

**Ngoài phạm vi tài liệu này (thuộc về thiết kế kỹ thuật chi tiết):**

- Định nghĩa chính xác cấu trúc dữ liệu (payload) chi tiết của từng Command, Query và Domain Event (chỉ mô tả mục đích và thông tin cốt lõi).
- Định nghĩa chi tiết các API Interface (chỉ mô tả chức năng và tương tác).
- Chi tiết cài đặt kỹ thuật của Microservice LZM (ngôn ngữ lập trình, framework, kiến trúc nội bộ chi tiết).
- Cấu trúc cơ sở dữ liệu chi tiết (schema) của LZM, bao gồm cách lưu trữ bản dịch phức tạp (ví dụ: sử dụng ICU MessageFormat).
- Các quyết định công nghệ cụ thể bên trong LZM (ví dụ: loại cơ sở dữ liệu sử dụng, chiến lược caching bản dịch, cách tích hợp với các công cụ dịch thuật bên ngoài, thư viện hỗ trợ bản dịch phức tạp).
- Luồng dữ liệu chi tiết đến cấp độ từng trường thông tin giữa LZM và các BC khác.
- Cấu hình hạ tầng triển khai cụ thể cho Microservice LZM.
- Thiết kế giao diện người dùng chi tiết cho Translation Management System (TMS).
- Quy trình làm việc chi tiết của người dịch (workflow) bên trong TMS.
- Chi tiết về cách các BC khác tích hợp thư viện client của LZM để sử dụng bản dịch.

## **3\. Vai trò và Trách nhiệm Chính**

Bounded Context LZM chịu trách nhiệm quản lý các bản dịch và nội dung bản địa hóa. Các trách nhiệm chính bao gồm:

- **Quản lý Locale:** Sử dụng danh sách Locale được định nghĩa trong RDM và quản lý trạng thái hỗ trợ của từng Locale trong LZM (ví dụ: Locale nào đã sẵn sàng cho production). LZM cũng cần biết **Ngôn ngữ Gốc (Source Language)** của hệ thống từ RDM.
- **Quản lý Khóa Bản dịch (Translation Key):** Định nghĩa và quản lý các khóa duy nhất để xác định một chuỗi văn bản hoặc nội dung cần bản địa hóa (ví dụ: common.button.submit, order.status.shipped, email.subject.orderConfirmation).
- **Quản lý Bản dịch (Translation):** Lưu trữ nội dung bản dịch thực tế cho mỗi Khóa Bản dịch và mỗi Locale được hỗ trợ. Quản lý **vòng đời trạng thái** của từng bản dịch (ví dụ: từ "Cần dịch" sang "Đã dịch", "Cần xem xét"). Hỗ trợ lưu trữ các loại bản dịch **phức tạp** (ví dụ: bản dịch có biến số, bản dịch số nhiều).
- **Quản lý Tập Bản dịch (Translation Set):** Gom nhóm các Khóa Bản dịch liên quan lại với nhau (ví dụ: theo module, theo loại thông báo) để dễ quản lý và truy vấn.
- **Đảm bảo Tính Nhất quán và Duy nhất:** Đảm bảo rằng các Khóa Bản dịch là duy nhất trong phạm vi quản lý của LZM và mỗi Khóa Bản dịch chỉ có một bản dịch cho mỗi Locale trong một thời điểm.
- **Lưu trữ Bản dịch:** Lưu trữ các Khóa Bản dịch, Bản dịch và Tập Bản dịch một cách an toàn và có cấu trúc.
- **Cung cấp Khả năng Truy vấn Hiệu quả:** Cung cấp các API hoặc cơ chế hiệu quả để các Bounded Context khác có thể tìm kiếm và truy xuất bản dịch dựa trên Khóa Bản dịch, Locale, Tập Bản dịch, hoặc các tiêu chí khác. Việc truy vấn cần có **hiệu năng cao**. **Bao gồm logic trả về giá trị mặc định (fallback) khi bản dịch cho Locale yêu cầu không tồn tại hoặc không ở trạng thái sẵn sàng sử dụng.**
- **Thông báo về Thay đổi Bản dịch:** Phát ra các Domain Event khi bản dịch được tạo, cập nhật hoặc xóa, cho phép các BC khác có thể phản ứng hoặc cập nhật cache bản dịch của họ.
- **Hỗ trợ Nhập/Xuất Dữ liệu Bản dịch:** Cung cấp khả năng nhập dữ liệu bản dịch ban đầu hoặc hàng loạt từ nguồn ngoài (ví dụ: từ công cụ dịch thuật) và xuất dữ liệu bản dịch ra định dạng chuẩn (ở mức độ nghiệp vụ).
- **Phát sinh Audit Log:** Gửi thông tin về các hoạt động quản lý bản dịch (tạo, cập nhật, xóa) đến ALM để ghi log kiểm tra.

## **4\. Mô hình Domain (Chi tiết hơn)**

Trong phạm vi Bounded Context LZM, mô hình domain xoay quanh các khái niệm về Locale, Khóa Bản dịch và Bản dịch thực tế. TranslationSet hoặc TranslationKey có thể là Aggregate Root chính, tùy thuộc vào mức độ độc lập cần quản lý. Giả định ban đầu TranslationSet là Aggregate Root để nhóm các khóa liên quan.

**Aggregate Roots:**

- **TranslationSet:** Là Aggregate Root đại diện cho một tập hợp các Khóa Bản dịch có liên quan (ví dụ: theo module, theo loại thông báo).
  - **ID:** Unique identifier (UUID).
  - **Name:** Tên định danh duy nhất của tập bản dịch (ví dụ: "Common", "OrderModule", "EmailTemplates").
  - **Description:** Mô tả về tập bản dịch.
  - **IsActive:** Trạng thái hoạt động của tập bản dịch.
  - **CreatedAt:** Thời điểm tạo.
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng.
  - **TranslationKeys:** Danh sách các Khóa Bản dịch thuộc tập này (TranslationKey Entities).
  - _Behavior:_ AddKey, RemoveKey, UpdateKey, Activate, Deactivate.
- **TranslationKey (Entity thuộc TranslationSet):** Là một Khóa Bản dịch duy nhất trong phạm vi hệ thống (hoặc trong phạm vi TranslationSet nếu muốn quản lý theo nhóm). Giả định là Entity thuộc TranslationSet.
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root TranslationSet.
  - **Key:** Chuỗi định danh duy nhất của khóa bản dịch (ví dụ: common.button.submit).
  - **Description:** Mô tả ngữ cảnh sử dụng của khóa bản dịch (rất quan trọng cho người dịch).
  - **SourceContent:** Nội dung gốc của khóa bản dịch (thường là ở ngôn ngữ gốc, ví dụ: tiếng Anh).
  - **Translations:** Danh sách các bản dịch cho khóa này ở các Locale khác nhau (Translation Entities).
  - **Status:** Trạng thái chung của khóa bản dịch (ví dụ: "NeedsTranslation", "Translated", "NeedsReview"). Trạng thái này có thể là tổng hợp từ trạng thái của các bản dịch con hoặc chỉ áp dụng cho bản dịch gốc.
  - _Behavior:_ UpdateKeyDetails, AddTranslation, UpdateTranslation, SetStatus.
- **Locale (Value Object):** Đại diện cho một mã locale/ngôn ngữ được hỗ trợ.
  - **Value:** Chuỗi (ví dụ: "vi-VN", "en-US"). **Ràng buộc:** Phải là mã locale hợp lệ từ RDM.

**Entities (thuộc về các Aggregate Root):**

- **Translation (thuộc TranslationKey):**
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root TranslationKey.
  - **Locale:** Mã locale/ngôn ngữ (Locale Value Object).
  - **Content:** Nội dung bản dịch thực tế cho Khóa Bản dịch này ở Locale tương ứng. **Có thể chứa cú pháp đặc biệt cho các loại bản dịch phức tạp (ví dụ: cú pháp cho số nhiều, biến số).**
  - **Status:** Trạng thái của bản dịch cụ thể này (ví dụ: "Translated", "NeedsReview", "Outdated" \- nếu Khóa Bản dịch gốc hoặc bản dịch ở ngôn ngữ gốc thay đổi, "Draft", "Approved"). **Vòng đời trạng thái:** Draft \-\> Translated \-\> NeedsReview \-\> Approved. Outdated có thể là trạng thái tự động khi SourceContent thay đổi.
  - **TranslatedBy:** Thông tin về người/hệ thống đã tạo/cập nhật bản dịch này.
  - **LastUpdatedAt:** Thời điểm cập nhật cuối cùng.
  - _Behavior:_ UpdateContent, SetStatus.

## **5\. Ngôn ngữ Chung (Ubiquitous Language)**

Trong Bounded Context LZM, các thuật ngữ sau đây có ý nghĩa cụ thể và nhất quán:

- **Locale:** Mã ngôn ngữ và vùng miền được hỗ trợ (ví dụ: tiếng Việt tại Việt Nam \- vi-VN).
- **Translation Key:** Một chuỗi định danh duy nhất cho một phần nội dung cần bản địa hóa.
- **Translation:** Nội dung bản dịch thực tế cho một Translation Key ở một Locale cụ thể.
- **Translation Set:** Một nhóm các Translation Key có liên quan.
- **Source Content:** Nội dung gốc của một Translation Key.
- **Source Language:** Ngôn ngữ gốc của nội dung (ví dụ: tiếng Anh). Được quản lý trong RDM.
- **Target Language:** Ngôn ngữ cần dịch sang (ví dụ: tiếng Việt).
- **Translation Status:** Trạng thái của một bản dịch (Draft, Translated, NeedsReview, Approved, Outdated).
- **Querying:** Quá trình tìm kiếm và truy xuất bản dịch.
- **Translation Management System (TMS):** Hệ thống hoặc giao diện người dùng để quản lý bản dịch (nằm ngoài ranh giới Core BC LZM). TMS là Client của LZM.
- **Fallback (Bản dịch Dự phòng):** Giá trị mặc định được trả về khi bản dịch cho Locale yêu cầu không tồn tại hoặc không ở trạng thái sẵn sàng sử dụng. Logic fallback được định nghĩa trong LZM.
- **Data Import/Export:** Các quy trình nghiệp vụ để đưa dữ liệu bản dịch vào hoặc lấy dữ liệu ra khỏi LZM hàng loạt.
- **Pluralization:** Quy tắc bản địa hóa cho các danh từ số ít/số nhiều.
- **Contextual Translation:** Bản dịch phụ thuộc vào ngữ cảnh sử dụng cụ thể.

## **6\. Các Khía cạnh Quan trọng của Miền LZM**

Phần này mô tả các cấu trúc, quy tắc và khái niệm nghiệp vụ quan trọng chi phối hoạt động của Bounded Context LZM.

### **6.1. Vòng đời Trạng thái Bản dịch (Translation Status Lifecycle)**

Mỗi bản dịch (Translation Entity) trong LZM có một vòng đời trạng thái để theo dõi tiến độ dịch và xem xét. Vòng đời trạng thái điển hình có thể bao gồm:

stateDiagram-v2  
 \[\*\] \--\> Draft: Tạo bản dịch mới / Source Content thay đổi  
 Draft \--\> Translated: Người dịch hoàn thành bản dịch  
 Translated \--\> NeedsReview: Gửi đi xem xét  
 NeedsReview \--\> Translated: Cần sửa đổi thêm  
 NeedsReview \--\> Approved: Được chấp nhận  
 Approved \--\> Outdated: Source Content của TranslationKey thay đổi  
 Outdated \--\> Draft: Bắt đầu dịch lại  
 Approved \--\> \[\*\]: Bị xóa

Logic nghiệp vụ trong LZM (cụ thể là TranslationKeyService hoặc TranslationService) cần đảm bảo rằng việc chuyển đổi trạng thái chỉ có thể xảy ra theo các luồng được định nghĩa này.

### **6.2. Logic Fallback cho Bản dịch Thiếu**

Khi một Bounded Context khác yêu cầu bản dịch cho một Khóa Bản dịch và một Locale cụ thể, LZM cần có logic để xử lý trường hợp bản dịch đó không tồn tại hoặc không ở trạng thái "Approved" (trạng thái được coi là sẵn sàng sử dụng). Logic fallback được định nghĩa như sau:

1. Tìm bản dịch cho Khóa Bản dịch và Locale yêu cầu ở trạng thái "Approved".
2. Nếu không tìm thấy, cố gắng tìm bản dịch cho Khóa Bản dịch đó ở **Ngôn ngữ Gốc (Source Language)** của hệ thống (được lấy từ RDM) ở trạng thái "Approved".
3. Nếu vẫn không tìm thấy, trả về chính **Khóa Bản dịch đó** làm giá trị mặc định.

Logic này đảm bảo rằng người dùng luôn nhận được một giá trị nào đó, ngay cả khi bản dịch đầy đủ chưa có sẵn.

### **6.3. Yêu cầu Hiệu năng Truy vấn Bản dịch**

LZM là một dịch vụ nền tảng được gọi bởi hầu hết các BC có giao diện người dùng hoặc gửi thông báo. Do đó, việc truy vấn bản dịch cần có **hiệu năng cao** để không trở thành điểm nghẽn ảnh hưởng đến trải nghiệm người dùng. Điều này đòi hỏi LZM phải có chiến lược lưu trữ và caching hiệu quả. Các BC tiêu thụ bản dịch cũng nên triển khai caching cục bộ và phản ứng với các Domain Event từ LZM để cập nhật cache khi bản dịch thay đổi.

### **6.4. Xử lý các Loại Bản dịch Phức tạp**

LZM cần hỗ trợ các loại bản dịch phức tạp hơn chỉ là chuỗi văn bản đơn giản, ví dụ:

- **Bản dịch có biến số:** Nội dung bản dịch chứa các placeholder sẽ được thay thế bằng dữ liệu ngữ cảnh khi render (ví dụ: "Chào mừng, {{userName}}\!").
- **Bản dịch số nhiều (Pluralization):** Nội dung bản dịch thay đổi tùy thuộc vào số lượng của một đối tượng (ví dụ: "Bạn có 1 tin nhắn mới." vs "Bạn có 5 tin nhắn mới.").
- **Bản dịch theo ngữ cảnh:** Cùng một từ hoặc cụm từ có thể có bản dịch khác nhau tùy thuộc vào ngữ cảnh sử dụng (ví dụ: "Book" là động từ hay danh từ).

Mô hình domain và logic rendering của LZM cần có khả năng lưu trữ và xử lý các loại bản dịch này, có thể sử dụng các cú pháp chuẩn (ví dụ: ICU MessageFormat) trong trường Content của Translation và yêu cầu dữ liệu ngữ cảnh (ContextData) khi truy vấn/rendering.

## **7\. Use cases**

Dưới đây là mô tả các use case chính có sự tham gia của LZM, tập trung vào actor, mục đích và các service liên quan, được phân loại theo các nhóm chức năng chính.

### **7.1. Use Cases liên quan đến Quản lý Bản dịch (Management)**

Nhóm này bao gồm các use case cho phép người dùng nội bộ Ecoma quản lý các tập bản dịch, khóa bản dịch và bản dịch thực tế thông qua giao diện quản trị hoặc hệ thống TMS.

- **LZM-UC-7.1.1: Quản lý Tập Bản dịch**
  - **Actor:** Người dùng nội bộ Ecoma (có quyền quản lý bản dịch), Hệ thống.
  - **Mục đích:** Tạo mới, cập nhật thông tin hoặc xóa các tập bản dịch.
  - **Service liên quan:** Nhận Command từ giao diện Admin/TMS. Sử dụng TranslationSetApplicationService. Sử dụng TranslationSetService. Phát Domain Event. Gửi Audit Log đến ALM.
- **LZM-UC-7.1.2: Quản lý Khóa Bản dịch**
  - **Actor:** Người dùng nội bộ Ecoma (có quyền quản lý bản dịch), Hệ thống.
  - **Mục đích:** Tạo mới, cập nhật thông tin (bao gồm nội dung gốc và mô tả ngữ cảnh) hoặc xóa các khóa bản dịch trong một tập bản dịch.
  - **Service liên quan:** Nhận Command từ giao diện Admin/TMS. Sử dụng TranslationManagementApplicationService. Sử dụng TranslationSetService (hoặc TranslationKeyService). Phát Domain Event. Gửi Audit Log đến ALM.
- **LZM-UC-7.1.3: Quản lý Bản dịch và Trạng thái**
  - **Actor:** Người dùng nội bộ Ecoma (có quyền quản lý bản dịch/người dịch), Hệ thống.
  - **Mục đích:** Thêm mới, cập nhật nội dung hoặc xóa bản dịch cho một khóa bản dịch ở một locale cụ thể. Quản lý vòng đời trạng thái của bản dịch (ví dụ: chuyển từ Draft sang Translated, NeedsReview, Approved).
  - **Service liên quan:** Nhận Command từ giao diện Admin/TMS. Sử dụng TranslationManagementApplicationService. Sử dụng TranslationSetService (hoặc TranslationKeyService). Sử dụng TranslationService (để áp dụng vòng đời trạng thái). Phát Domain Event (đặc biệt là TranslationStatusChanged). Gửi Audit Log đến ALM.

### **7.2. Use Cases liên quan đến Truy vấn Bản dịch (Querying)**

Nhóm này bao gồm các use case cho phép các Bounded Context khác lấy nội dung bản dịch để hiển thị hoặc sử dụng trong các luồng nghiệp vụ của họ.

- **LZM-UC-7.2.1: Truy vấn Bản dịch theo Khóa và Locale**
  - **Actor:** Các Bounded Context khác (UI BCs, NDM, v.v.).
  - **Mục đích:** Lấy nội dung bản dịch cho một hoặc nhiều khóa bản dịch ở một locale cụ thể, có áp dụng logic fallback và xử lý bản dịch phức tạp nếu cần.
  - **Service liên quan:** Nhận Query từ BC khác. Sử dụng TranslationQueryApplicationService. Sử dụng TranslationService.

### **7.3. Use Cases liên quan đến Nhập/Xuất Dữ liệu Bản dịch (Import/Export)**

Nhóm này bao gồm các use case cho phép nhập hoặc xuất dữ liệu bản dịch hàng loạt.

- **LZM-UC-7.3.1: Nhập Dữ liệu Bản dịch**
  - **Actor:** Người dùng nội bộ Ecoma (có quyền quản lý bản dịch), Hệ thống.
  - **Mục đích:** Nhập dữ liệu bản dịch hàng loạt từ file hoặc nguồn ngoài vào LZM.
  - **Service liên quan:** Nhận Command từ giao diện Admin/TMS hoặc Scheduled Task. Sử dụng TranslationImportExportApplicationService. Sử dụng TranslationImportExportService. Phát Domain Event (ví dụ: TranslationImportCompleted, TranslationImportFailed). Gửi Audit Log đến ALM.
- **LZM-UC-7.3.2: Xuất Dữ liệu Bản dịch**
  - **Actor:** Người dùng nội bộ Ecoma (có quyền quản lý bản dịch), Hệ thống.
  - **Mục đích:** Xuất dữ liệu bản dịch từ LZM ra file hoặc định dạng chuẩn khác.
  - **Service liên quan:** Nhận Query từ giao diện Admin/TMS hoặc Scheduled Task. Sử dụng TranslationImportExportApplicationService. Sử dụng TranslationImportExportService. Phát Domain Event (ví dụ: TranslationExportCompleted). Gửi Audit Log đến ALM.

## **8\. Domain Services**

Domain Services trong LZM chứa logic nghiệp vụ quan trọng liên quan đến quản lý bản dịch.

- **TranslationSetService:**
  - **Trách nhiệm:** Quản lý vòng đời của TranslationSet Aggregate Root và các TranslationKey bên trong nó (nếu TranslationKey là Entity). Đảm bảo tính duy nhất của tên tập bản dịch. Phối hợp với TranslationSet Repository.
  - **Các phương thức tiềm năng:** CreateSet(...), UpdateSet(...), DeleteSet(...), AddKeyToSet(...), RemoveKeyFromSet(...).
- **TranslationKeyService (Optional Domain Service):** Nếu TranslationKey là Aggregate Root, Service này sẽ quản lý vòng đời của TranslationKey và các Translation bên trong nó.
  - **Trách nhiệm:** Quản lý vòng đời của TranslationKey Aggregate Root và các Translation bên trong nó. Đảm bảo tính duy nhất của Khóa Bản dịch. Phối hợp với TranslationKey Repository, **RDM Service để kiểm tra Locale hợp lệ và lấy Source Language**.
  - **Các phương thức tiềm năng:** CreateKey(...), UpdateKey(...), DeleteKey(...), AddTranslation(...), UpdateTranslation(...), RemoveTranslation(...), SetTranslationStatus(...).
- **TranslationService:**
  - **Trách nhiệm:** Thực hiện các truy vấn đọc bản dịch. Phối hợp với TranslationSet Repository (hoặc TranslationKey Repository). **Chứa logic fallback để trả về giá trị mặc định khi bản dịch yêu cầu không tồn tại hoặc không ở trạng thái sẵn sàng sử dụng.** **Chứa logic xử lý các loại bản dịch phức tạp (ví dụ: số nhiều, ngữ cảnh) dựa trên dữ liệu Context được truyền vào.** Phối hợp với RDM Service để lấy thông tin Source Language.
  - **Các phương thức tiềm năng:** GetTranslation(key, locale, contextData), ListTranslationsBySet(setName, locale, contextData), ListTranslationsByKeys(keys, locale, contextData).
- **TranslationImportExportService (Optional Domain Service):** Nếu logic nhập/xuất phức tạp, có thể tách ra.
  - **Trách nhiệm:** Thực hiện logic nghiệp vụ cho việc nhập/xuất dữ liệu bản dịch, bao gồm đọc dữ liệu đầu vào, xác thực nghiệp vụ từng bản ghi, xử lý lỗi theo quy tắc, và phối hợp với TranslationManagementApplicationService (hoặc Domain Service tương ứng) để ghi dữ liệu.
  - **Các phương thức tiềm năng:** ImportData(dataSetId, data), ExportData(dataSetId, criteria).

## **9\. Application Services**

Application Services trong LZM là lớp mỏng điều phối các hành động từ bên ngoài (Commands, Queries) đến Domain Model. Chúng xử lý các tác vụ kỹ thuật như xác thực, ủy quyền, giao dịch cơ sở dữ liệu, và phát sự kiện.

- **TranslationSetApplicationService:**
  - **Trách nhiệm:** Xử lý Commands liên quan đến quản lý tập bản dịch. Sử dụng TranslationSetService. Yêu cầu ủy quyền. Gửi thông tin đến ALM để ghi log.
  - **Các phương thức tiềm năng:** HandleCreateTranslationSetCommand(command), HandleUpdateTranslationSetCommand(command), HandleDeleteTranslationSetCommand(command).
- **TranslationManagementApplicationService:**
  - **Trách nhiệm:** Xử lý Commands liên quan đến quản lý Khóa Bản dịch và Bản dịch. Sử dụng TranslationSetService (hoặc TranslationKeyService). Yêu cầu ủy quyền. Bắt Exception nghiệp vụ từ Domain Service (ví dụ: lỗi chuyển đổi trạng thái không hợp lệ). Gửi thông tin đến ALM để ghi log.
  - **Các phương thức tiềm năng:** HandleAddTranslationKeyCommand(command), HandleUpdateTranslationKeyCommand(command), HandleAddTranslationCommand(command), HandleUpdateTranslationCommand(command), HandleRemoveTranslationCommand(command), HandleSetTranslationStatusCommand(command).
- **TranslationQueryApplicationService:**
  - **Trách nhiệm:** Xử lý Queries để lấy bản dịch. Sử dụng TranslationService.
  - **Các phương thức tiềm năng:** HandleGetTranslationQuery(query), HandleListTranslationsBySetQuery(query), HandleListTranslationsByKeysQuery(query).
- **TranslationImportExportApplicationService:**
  - **Trách nhiệm:** Xử lý Commands/Queries liên quan đến nhập/xuất dữ liệu. Sử dụng TranslationImportExportService. Yêu cầu ủy quyền. Gửi thông tin đến ALM để ghi log.
  - **Các phương thức tiềm năng:** HandleImportTranslationsCommand(command), HandleExportTranslationsQuery(query).

## **10\. Domain Events**

LZM phát ra các Domain Event để thông báo về sự thay đổi của bản dịch.

### **10.1. Domain Events (LZM Phát ra)**

- **TranslationSetCreated**
  - Phát ra khi một tập bản dịch mới được tạo.
  - **Payload:**
    - SetId (UUID)
    - Name (String)
    - IssuedAt (DateTime)
- **TranslationSetUpdated**
  - Phát ra khi một tập bản dịch được cập nhật.
  - **Payload:**
    - SetId (UUID)
    - Name (String)
    - IssuedAt (DateTime)
- **TranslationSetDeleted**
  - Phát ra khi một tập bản dịch bị xóa.
  - **Payload:**
    - SetId (UUID)
    - Name (String)
    - IssuedAt (DateTime)
- **TranslationKeyAdded**
  - Phát ra khi một Khóa Bản dịch mới được thêm vào (hoặc tạo mới).
  - **Payload:**
    - KeyId (UUID)
    - Key (String)
    - SetId (UUID, optional)
    - SourceContent (String)
    - IssuedAt (DateTime)
- **TranslationKeyUpdated**
  - Phát ra khi một Khóa Bản dịch được cập nhật.
  - **Payload:**
    - KeyId (UUID)
    - Key (String)
    - SourceContent (String)
    - IssuedAt (DateTime)
- **TranslationAdded**
  - Phát ra khi bản dịch mới được thêm cho một Khóa/Locale.
  - **Payload:**
    - KeyId (UUID)
    - Locale (String)
    - TranslationId (UUID)
    - Content (String)
    - Status (String)
    - IssuedAt (DateTime)
- **TranslationUpdated**
  - Phát ra khi bản dịch cho một Khóa/Locale được cập nhật.
  - **Payload:**
    - KeyId (UUID)
    - Locale (String)
    - TranslationId (UUID)
    - Content (String)
    - Status (String)
    - IssuedAt (DateTime)
- **TranslationRemoved**
  - Phát ra khi bản dịch cho một Khóa/Locale bị xóa.
  - **Payload:**
    - KeyId (UUID)
    - Locale (String)
    - TranslationId (UUID)
    - IssuedAt (DateTime)
- **TranslationStatusChanged**
  - Phát ra khi trạng thái của một bản dịch cụ thể thay đổi.
  - **Payload:**
    - KeyId (UUID)
    - Locale (String)
    - TranslationId (UUID)
    - OldStatus (String)
    - NewStatus (String)
    - IssuedAt (DateTime)
- **TranslationImportCompleted**
  - Phát ra khi một luồng nhập dữ liệu hoàn thành thành công.
  - **Payload:**
    - ImportId (UUID)
    - ImportedByUserId (UUID)
    - NumberOfRecordsProcessed (Integer)
    - NumberOfRecordsImported (Integer)
    - NumberOfRecordsFailed (Integer)
    - CompletedAt (DateTime)
    - IssuedAt (DateTime)
- **TranslationImportFailed**
  - Phát ra khi một luồng nhập dữ liệu thất bại.
  - **Payload:**
    - ImportId (UUID)
    - ImportedByUserId (UUID)
    - FailureReason (String)
    - FailedAt (DateTime)
    - IssuedAt (DateTime)
- **TranslationExportCompleted**
  - Phát ra khi một luồng xuất dữ liệu hoàn thành thành công.
  - **Payload:**
    - ExportId (UUID)
    - ExportedByUserId (UUID)
    - NumberOfRecordsExported (Integer)
    - CompletedAt (DateTime)
    - IssuedAt (DateTime)

### **10.2. Domain Events Được Xử lý (Consumed Domain Events)**

LZM lắng nghe và xử lý các Domain Event từ các Bounded Context khác chủ yếu để lấy thông tin tham chiếu hoặc kích hoạt các quy trình nội bộ nếu cần thiết.

- **ReferenceDataSetUpdated** (Từ RDM)
  - Phát ra khi một tập dữ liệu tham chiếu được cập nhật trong RDM.
  - **Mục đích xử lý:** LZM có thể lắng nghe event này nếu cần cập nhật thông tin về các Locale được hỗ trợ từ RDM.
  - **Payload dự kiến:** (Xem tài liệu RDM)
- **ReferenceDataItemUpdated** (Từ RDM)
  - Phát ra khi một mục dữ liệu tham chiếu (ví dụ: một Locale) được cập nhật trong RDM.
  - **Mục đích xử lý:** LZM có thể lắng nghe event này để cập nhật danh sách các Locale được hỗ trợ hoặc thông tin về Ngôn ngữ Gốc.
  - **Payload dự kiến:** (Xem tài liệu RDM)

## **11\. Ranh giới Nghiệp vụ**

Ranh giới của Bounded Context LZM được xác định bởi trách nhiệm quản lý các tài nguyên bản địa hóa (Khóa Bản dịch, Bản dịch, Tập Bản dịch) và cung cấp chúng theo yêu cầu, bao gồm cả việc quản lý vòng đời trạng thái bản dịch và logic fallback. LZM là nguồn sự thật cho nội dung bản dịch.

LZM không chịu trách nhiệm:

- **Định nghĩa Locale chính thức của hệ thống:** LZM phụ thuộc vào RDM để có danh sách các Locale được hỗ trợ và thông tin về Ngôn ngữ Gốc.
- **Xác định nội dung nào cần bản địa hóa:** Các BC nghiệp vụ khác chịu trách nhiệm xác định các chuỗi UI, nội dung thông báo, hoặc dữ liệu nào cần được bản địa hóa và yêu cầu LZM tạo Khóa Bản dịch tương ứng.
- **Quản lý tùy chọn ngôn ngữ của người dùng:** Việc người dùng chọn ngôn ngữ nào thuộc về IAM. LZM chỉ nhận Locale từ BC gọi.
- **Thực hiện dịch thuật:** LZM cung cấp nền tảng và quy trình để quản lý bản dịch, nhưng công việc dịch thuật thực tế do con người hoặc công cụ dịch máy bên ngoài thực hiện (tương tác qua giao diện TMS hoặc API nhập dữ liệu).
- **Hiển thị nội dung bản địa hóa:** Việc sử dụng bản dịch từ LZM để hiển thị nội dung cho người dùng thuộc về các BC giao diện người dùng hoặc các BC khác.
- **Quản lý các quy tắc định dạng bản địa hóa phức tạp:** Ví dụ: định dạng ngày giờ, số, tiền tệ theo từng Locale. Việc này thường được xử lý bởi các thư viện bản địa hóa ở phía client hoặc BC tiêu thụ, sử dụng thông tin Locale từ RDM/IAM.
- **Lưu trữ Audit Log:** LZM phát sinh thông tin audit log và gửi đến ALM để lưu trữ.

## **12\. Kết luận**

Bounded Context Localization Management (LZM) là một thành phần cốt lõi quan trọng, cung cấp chức năng quản lý và phân phối các tài nguyên bản địa hóa cho toàn hệ thống Ecoma. Bằng cách tập trung trách nhiệm này vào một Context duy nhất, LZM đảm bảo tính nhất quán, nguồn đáng tin cậy và khả năng truy cập hiệu quả cho nội dung đa ngôn ngữ, hỗ trợ trải nghiệm người dùng và hoạt động kinh doanh quốc tế. Việc thiết kế LZM bao gồm việc quản lý vòng đời trạng thái bản dịch, logic fallback cho bản dịch thiếu, hỗ trợ nhập/xuất dữ liệu, xử lý các loại bản dịch phức tạp và phát sinh audit log, giúp nó trở thành một dịch vụ bản địa hóa mạnh mẽ. LZM hoạt động như một dịch vụ cung cấp dữ liệu (qua Query) với yêu cầu hiệu năng cao và thông báo thay đổi (qua Event) giúp giảm thiểu sự phụ thuộc trực tiếp và khuyến khích caching ở các BC tiêu thụ.

Tài liệu này đã được cập nhật để tuân thủ cấu trúc và mức độ chi tiết của các tài liệu IAM và BUM, bao gồm việc bổ sung phần Các Khía cạnh Quan trọng của Miền, tổ chức lại luồng nghiệp vụ thành Use Cases và chi tiết hóa các Domain Event (Published/Consumed, payload dự kiến). Đây là nền tảng để chuyển sang giai đoạn thiết kế kỹ thuật chi tiết và triển khai Microservice LZM.
