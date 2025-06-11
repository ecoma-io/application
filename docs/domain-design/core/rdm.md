# **Bounded Context Reference Data Management (RDM)**

## **1\. Giới thiệu**

Tài liệu này cung cấp mô tả chi tiết về Bounded Context **Reference Data Management (RDM)** trong hệ thống Ecoma. RDM là một trong những Bounded Context cốt lõi (Core Bounded Context), chịu trách nhiệm quản lý, lưu trữ và cung cấp các tập dữ liệu tham chiếu (reference data sets) được sử dụng chung trên toàn hệ thống.

RDM đảm bảo tính nhất quán và nguồn đáng tin cậy cho các dữ liệu tĩnh hoặc ít thay đổi, giúp các Bounded Context khác hoạt động dựa trên cùng một bộ định nghĩa và giá trị, tránh sự phân mảnh và không đồng bộ dữ liệu tham chiếu trong hệ thống phân tán.

## **2\. Phạm vi của Tài liệu**

Tài liệu này tập trung vào việc định nghĩa và mô tả Bounded Context RDM ở cấp độ thiết kế miền (domain design), cung cấp đủ chi tiết để hỗ trợ việc thiết kế các Domain Service và Application Service. Cụ thể, tài liệu này bao gồm:

- Xác định vai trò và trách nhiệm chính của RDM, bao gồm cả yêu cầu về hiệu năng truy vấn và cân nhắc về ràng buộc liên BC.
- Mô tả các khái niệm và thực thể cốt lõi trong mô hình domain của RDM ở cấp độ chi tiết hơn, bao gồm các Aggregate Root, Entity và Value Object với các thuộc tính chính, cung cấp thêm ví dụ về các loại dữ liệu tham chiếu và cân nhắc về phiên bản hóa.
- Định nghĩa Ngôn ngữ Chung (Ubiquitous Language) trong phạm vi RDM.
- Mô tả **Các Khía cạnh Quan trọng của Miền RDM**, bao gồm khả năng phiên bản hóa dữ liệu, mô hình nhất quán và yêu cầu hiệu năng truy vấn, xử lý lỗi nghiệp vụ trong quản lý và nhập dữ liệu, và cân nhắc về ràng buộc tham chiếu liên BC.
- Làm rõ các **tương tác chính giữa RDM và các Bounded Context khác**, đặc biệt là cách các BC khác truy vấn dữ liệu tham chiếu từ RDM, có tính đến mô hình nhất quán và cơ chế thông báo thay đổi.
- Phác thảo các **Use cases** chính có sự tham gia của RDM, **được phân nhóm theo chức năng chính và gán mã use case**, tập trung vào actor, mục đích và các Domain/Application Service liên quan, bao gồm quản lý (tạo, cập nhật, xóa) các tập dữ liệu tham chiếu và các mục dữ liệu tham chiếu, cung cấp dữ liệu tham chiếu thông qua truy vấn hiệu quả, và nhập/xuất dữ liệu.
- Xác định ranh giới nghiệp vụ của RDM.
- Đề xuất các Domain Service và Application Service tiềm năng trong RDM với mô tả chi tiết hơn về trách nhiệm của từng Service.
- Làm rõ các quy tắc nghiệp vụ liên quan đến việc quản lý dữ liệu tham chiếu (ví dụ: tính duy nhất của tên tập dữ liệu, tính duy nhất của mã mục dữ liệu trong một tập dữ liệu, xử lý lỗi nghiệp vụ trong quản lý và nhập dữ liệu) được mô tả ở cấp độ thiết kế miền.
- Liệt kê và mô tả các **Domain Events** mà RDM tương tác, được chia thành các sự kiện RDM **phát ra** (Published Events) và các sự kiện RDM **lắng nghe và xử lý** (Consumed Events), bao gồm payload dự kiến của từng event.

**Trong phạm vi tài liệu này:**

- Các khái niệm về **Commands** (yêu cầu thực hiện một hành động) và **Queries** (yêu cầu lấy dữ liệu) được đề cập để mô tả cách các Bounded Context khác tương tác với RDM (quản lý dữ liệu, truy vấn dữ liệu) và cách các luồng nghiệp vụ được kích hoạt thông qua các **Application Services**.
- Vai trò và trách nhiệm của **Domain Services** và **Application Services** trong việc xử lý logic nghiệp vụ và điều phối các tương tác được mô tả ở cấp độ chức năng.
- Các **Domain Events** quan trọng được xác định để mô tả những thay đổi trạng thái nghiệp vụ mà RDM phát ra (ví dụ: dữ liệu tham chiếu được tạo/cập nhật/xóa), hỗ trợ các BC khác phản ứng với thay đổi.
- Các quy tắc nghiệp vụ liên quan đến việc quản lý dữ liệu tham chiếu (ví dụ: tính duy nhất của tên tập dữ liệu, tính duy nhất của mã mục dữ liệu trong một tập dữ liệu, xử lý lỗi nghiệp vụ trong quản lý và nhập dữ liệu) được mô tả ở cấp độ thiết kế miền.
- **Các loại dữ liệu tham chiếu phổ biến** và **khả năng phiên bản hóa** được đề cập trong mô hình domain.
- **Mô hình nhất quán** cho việc truy vấn dữ liệu tham chiếu được làm rõ như một yêu cầu phi chức năng quan trọng.
- **Khả năng nhập/xuất dữ liệu** được phác thảo ở mức cao, bao gồm yêu cầu về xử lý lỗi nghiệp vụ trong quá trình nhập.
- **Cân nhắc về ràng buộc tham chiếu liên BC** được đề cập ở cấp độ ranh giới nghiệp vụ và tương tác liên BC.

**Ngoài phạm vi tài liệu này (thuộc về thiết kế kỹ thuật chi tiết):**

- Định nghĩa chính xác cấu trúc dữ liệu (payload) chi tiết của từng Command, Query và Domain Event (chỉ mô tả mục đích và thông tin cốt lõi).
- Định nghĩa chi tiết các API Interface (chỉ mô tả chức năng và tương tác).
- Chi tiết cài đặt kỹ thuật của Microservice RDM (ngôn ngữ lập trình, framework, kiến trúc nội bộ chi tiết).
- Cấu trúc cơ sở dữ liệu chi tiết (schema) của RDM, bao gồm cách lưu trữ lịch sử phiên bản (nếu có).
- Các quyết định công nghệ cụ thể bên trong RDM (ví dụ: loại cơ sở dữ liệu sử dụng, chiến lược caching dữ liệu tham chiếu, công cụ nhập/xuất dữ liệu).
- Luồng dữ liệu chi tiết đến cấp độ từng trường thông tin giữa RDM và các BC khác.
- Cấu hình hạ tầng triển khai cụ thể cho Microservice RDM.
- Thiết kế giao diện người dùng để quản lý dữ liệu tham chiếu.
- Chi tiết về nội dung cụ thể của từng tập dữ liệu tham chiếu (ví dụ: danh sách đầy đủ các quốc gia).
- Việc bản địa hóa tên/mô tả của dữ liệu tham chiếu (thuộc về LZM). RDM chỉ lưu trữ các mã hoặc giá trị chuẩn.
- **Các giải pháp kỹ thuật chi tiết** để đạt được hiệu năng truy vấn cho dữ liệu linh hoạt, triển khai phiên bản hóa, đảm bảo nhất quán mạnh trong môi trường phân tán, xử lý nhập/xuất hàng loạt, và thực thi "ràng buộc mềm" liên BC (ví dụ: sử dụng Saga, cơ chế kiểm tra Eventual Consistency).

## **3\. Vai trò và Trách nhiệm Chính**

Bounded Context RDM chịu trách nhiệm quản lý các tập dữ liệu tham chiếu. Các trách nhiệm chính bao gồm:

- **Định nghĩa và Quản lý Tập dữ liệu Tham chiếu:** Cho phép định nghĩa các loại tập dữ liệu tham chiếu mới (ví dụ: "Countries", "Currencies", "OrderStatuses", "NotificationTypes") và quản lý các thuộc tính của tập dữ liệu đó.
- **Quản lý Mục dữ liệu Tham chiếu:** Cho phép thêm, cập nhật, xóa các mục dữ liệu cụ thể trong một tập dữ liệu tham chiếu (ví dụ: thêm "Vietnam" vào tập "Countries", thêm "VND" vào tập "Currencies"). Bao gồm cả việc **xử lý lỗi nghiệp vụ** (ví dụ: trùng mã).
- **Đảm bảo Tính Nhất quán và Duy nhất:** Đảm bảo rằng tên các tập dữ liệu tham chiếu là duy nhất và mã (code) của các mục dữ liệu trong cùng một tập dữ liệu là duy nhất.
- **Lưu trữ Dữ liệu Tham chiếu:** Lưu trữ các tập dữ liệu và mục dữ liệu tham chiếu một cách an toàn và có cấu trúc. Có thể bao gồm việc lưu trữ **lịch sử phiên bản** cho các mục dữ liệu nếu cần.
- **Cung cấp Khả năng Truy vấn Hiệu quả:** Cung cấp các API hoặc cơ chế hiệu quả để các Bounded Context khác có thể tìm kiếm và truy xuất dữ liệu tham chiếu dựa trên tên tập dữ liệu, mã mục dữ liệu, hoặc các tiêu chí khác. Việc truy vấn dữ liệu tham chiếu từ RDM được kỳ vọng có **mô hình nhất quán mạnh (Strong Consistency)** hoặc gần như vậy và cần có **hiệu năng cao** để không trở thành điểm nghẽn cho các BC tiêu thụ.
- **Thông báo về Thay đổi Dữ liệu:** Phát ra các Domain Event khi dữ liệu tham chiếu (tập dữ liệu hoặc mục dữ liệu) được tạo, cập nhật hoặc xóa, cho phép các BC khác có thể phản ứng hoặc cập nhật cache của họ. Điều này cũng hỗ trợ việc **thông báo về các thay đổi có thể ảnh hưởng đến ràng buộc tham chiếu liên BC**.
- **Hỗ trợ Nhập/Xuất Dữ liệu:** Cung cấp khả năng nhập dữ liệu tham chiếu ban đầu hoặc hàng loạt từ nguồn ngoài và xuất dữ liệu tham chiếu ra định dạng chuẩn (ở mức độ nghiệp vụ). **Quá trình nhập cần xử lý lỗi nghiệp vụ** (ví dụ: dữ liệu không hợp lệ) theo quy tắc được định nghĩa (ví dụ: bỏ qua các bản ghi lỗi, báo cáo lỗi).

## **4\. Mô hình Domain (Chi tiết hơn)**

Trong phạm vi Bounded Context RDM, mô hình domain xoay quanh khái niệm Tập dữ liệu Tham chiếu và các Mục dữ liệu bên trong nó. ReferenceDataSet là Aggregate Root chính.

**Aggregate Roots:**

- **ReferenceDataSet:** Là Aggregate Root đại diện cho một tập hợp các mục dữ liệu tham chiếu cùng loại (ví dụ: tập hợp các quốc gia, tập hợp các loại tiền tệ).
  - **ID:** Unique identifier (UUID).
  - **Name:** Tên định danh duy nhất của tập dữ liệu tham chiếu (ví dụ: "Countries", "Currencies", "OrderStatuses").
  - **Description:** Mô tả về tập dữ liệu tham chiếu.
  - **Type:** **Optional** Loại tập dữ liệu (ví dụ: "SimpleList", "Hierarchical", "Versioned"). Giúp phân loại và áp dụng logic quản lý/truy vấn phù hợp.
  - **IsActive:** Trạng thái hoạt động của tập dữ liệu.
  - **CreatedAt:** Thời điểm tạo.
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng.
  - **Items:** Danh sách các mục dữ liệu tham chiếu thuộc tập này (ReferenceDataItem Entities).
  - _Behavior:_ AddItem, UpdateItem, RemoveItem, Activate, Deactivate, GetItemByCode.
- **ReferenceDataItem (Entity thuộc ReferenceDataSet):** Là một mục dữ liệu cụ thể trong một tập dữ liệu tham chiếu (ví dụ: một quốc gia, một loại tiền tệ). Là Entity thuộc ReferenceDataSet.
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root ReferenceDataSet.
  - **Code:** Mã định danh duy nhất của mục dữ liệu trong phạm vi tập dữ liệu cha (ví dụ: "VN", "US" cho Countries; "VND", "USD" cho Currencies).
  - **Value:** Giá trị liên quan đến mục dữ liệu (tùy chọn, có thể là số, boolean, hoặc cấu trúc dữ liệu nhỏ).
  - **Description:** Mô tả về mục dữ liệu (có thể cần bản địa hóa bởi LZM).
  - **Order:** Thứ tự hiển thị (tùy chọn).
  - **IsActive:** Trạng thái hoạt động của mục dữ liệu.
  - **Metadata:** **Optional** Dữ liệu bổ sung dưới dạng key-value (ví dụ: mã vùng điện thoại cho quốc gia, ký hiệu tiền tệ). Cần lưu ý rằng việc truy vấn hiệu quả dựa trên dữ liệu trong Metadata là một yêu cầu quan trọng.
  - **ValidFrom:** **Optional** Thời điểm mục dữ liệu này bắt đầu có hiệu lực (cho dữ liệu có phiên bản).
  - **ValidTo:** **Optional** Thời điểm mục dữ liệu này hết hiệu lực (cho dữ liệu có phiên bản).
  - _Behavior:_ UpdateDetails, Activate, Deactivate, SetValidityPeriod.

**Value Objects:**

- **Metadata:** Dữ liệu bổ sung dưới dạng key-value cho ReferenceDataItem.
  - **Value:** Dictionary/Map\<string, object\>.

## **5\. Ngôn ngữ Chung (Ubiquitous Language)**

Trong Bounded Context RDM, các thuật ngữ sau đây có ý nghĩa cụ thể và nhất quán:

- **Reference Data:** Dữ liệu tĩnh hoặc ít thay đổi được sử dụng chung trên toàn hệ thống.
- **Reference Data Set:** Một tập hợp các mục dữ liệu tham chiếu cùng loại (ví dụ: tập hợp các quốc gia).
- **Reference Data Item:** Một mục dữ liệu cụ thể trong một tập dữ liệu tham chiếu (ví dụ: một một quốc gia cụ thể).
- **Code:** Mã định danh duy nhất của một Reference Data Item trong phạm vi Reference Data Set của nó.
- **Metadata:** Dữ liệu bổ sung có cấu trúc liên quan đến một Reference Data Item.
- **Querying:** Quá trình tìm kiếm và truy xuất dữ liệu tham chiếu.
- **Versioning:** Khả năng theo dõi và truy vấn các phiên bản khác nhau của dữ liệu tham chiếu theo thời gian.
- **Data Import/Export:** Các quy trình nghiệp vụ để đưa dữ liệu vào hoặc lấy dữ liệu ra khỏi RDM hàng loạt.
- **Strong Consistency:** Mô hình nhất quán dữ liệu, đảm bảo rằng khi một thay đổi được xác nhận, tất cả các truy vấn tiếp theo sẽ trả về dữ liệu mới nhất.
- **Business Rule Exception:** Lỗi xảy ra do vi phạm quy tắc nghiệp vụ (ví dụ: thêm mục dữ liệu với mã trùng).

## **6\. Các Khía cạnh Quan trọng của Miền RDM**

Phần này mô tả các cấu trúc, quy tắc và khái niệm nghiệp vụ quan trọng chi phối hoạt động của Bounded Context RDM.

### **6.1. Phiên bản hóa Dữ liệu Tham chiếu (Versioning)**

Đối với một số loại dữ liệu tham chiếu, việc theo dõi lịch sử thay đổi và có khả năng truy vấn dữ liệu tại một thời điểm cụ thể trong quá khứ là cần thiết (ví dụ: tỷ giá tiền tệ, quy tắc tính thuế). RDM hỗ trợ phiên bản hóa cho các ReferenceDataItem bằng cách sử dụng các trường ValidFrom và ValidTo. Khi một mục dữ liệu thay đổi, thay vì cập nhật trực tiếp, một phiên bản mới sẽ được tạo với khoảng thời gian hiệu lực mới, và phiên bản cũ sẽ được đánh dấu hết hiệu lực. Logic truy vấn cần có khả năng trả về phiên bản dữ liệu chính xác tại thời điểm được yêu cầu.

### **6.2. Mô hình Nhất quán và Yêu cầu Hiệu năng Truy vấn**

Dữ liệu tham chiếu là nền tảng cho hoạt động của nhiều BC khác. Do đó, RDM cam kết cung cấp dữ liệu với **mô hình nhất quán mạnh (Strong Consistency)** hoặc gần như vậy cho các hoạt động đọc. Khi một thay đổi được ghi nhận thành công trong RDM, các BC khác truy vấn ngay lập tức (hoặc với độ trễ rất nhỏ) sẽ nhận được dữ liệu mới nhất. Đồng thời, việc truy vấn dữ liệu tham chiếu cần có **hiệu năng cao** để tránh tạo ra điểm nghẽn cho toàn hệ thống. Điều này đòi hỏi RDM phải có chiến lược lưu trữ và caching phù hợp.

### **6.3. Xử lý Lỗi Nghiệp vụ trong Quản lý và Nhập Dữ liệu**

Các hoạt động quản lý (tạo, cập nhật, xóa) và nhập dữ liệu hàng loạt vào RDM cần tuân thủ các quy tắc nghiệp vụ (ví dụ: mã mục dữ liệu duy nhất trong tập dữ liệu). Khi có lỗi nghiệp vụ xảy ra (ví dụ: cố gắng thêm mục dữ liệu với mã đã tồn tại), RDM Domain Services sẽ ném ra Business Rule Exception. Lớp Application Service hoặc lớp xử lý Command sẽ bắt các exception này và trả về thông báo lỗi phù hợp cho bên gọi. Đối với quá trình nhập dữ liệu hàng loạt, cần có chiến lược xử lý lỗi rõ ràng (ví dụ: bỏ qua các dòng dữ liệu lỗi và ghi log, hoặc dừng toàn bộ quá trình nhập nếu có lỗi nghiêm trọng).

### **6.4. Cân nhắc về Ràng buộc Tham chiếu Liên BC**

Mặc dù RDM là nguồn sự thật cho dữ liệu tham chiếu, nó không thực thi các ràng buộc tham chiếu cứng với dữ liệu nghiệp vụ ở các BC khác (ví dụ: không cho phép xóa một loại tiền tệ trong RDM nếu nó đang được sử dụng trong các giao dịch ở BUM). Việc đảm bảo tính toàn vẹn tham chiếu trong kiến trúc microservices phân tán là trách nhiệm chung của các BC liên quan. RDM hỗ trợ việc này bằng cách phát ra Domain Events khi dữ liệu tham chiếu thay đổi (ví dụ: ReferenceDataItemRemoved). Các BC khác có thể lắng nghe các event này để:

- Kiểm tra xem dữ liệu tham chiếu bị ảnh hưởng có đang được sử dụng trong phạm vi của họ không.
- Nếu có sử dụng, họ có thể phản ứng bằng cách vô hiệu hóa các mục nghiệp vụ liên quan, gửi cảnh báo cho quản trị viên, hoặc thực hiện các hành động khắc phục khác tùy theo quy tắc nghiệp vụ của từng BC.

Điều này tạo ra một "ràng buộc mềm" hoặc "eventual consistency" cho tính toàn vẹn tham chiếu liên BC.

## **7\. Tương tác với các Bounded Context khác**

RDM chủ yếu là một Bounded Context cung cấp dữ liệu (Data Provider). Các BC khác sẽ truy vấn RDM để lấy dữ liệu tham chiếu.

- **Tương tác với Core BCs và Feature BCs (Người dùng dữ liệu Tham chiếu):**
  - **Tất cả các BC khác (IAM, BUM, NDM, ALM, LZM, PIM, DAM, ITM, CRM, HRM, WPM, MPM, OSM, ODM, SFM, PPM, ICM, FAM):** Bất kỳ BC nào cần sử dụng dữ liệu tham chiếu đều sẽ truy vấn RDM. Ví dụ:
    - IAM: Cần danh sách quốc gia cho địa chỉ, danh sách loại người dùng.
    - BUM: Cần danh sách loại tiền tệ, danh sách trạng thái gói.
    - NDM: Cần danh sách loại thông báo, danh sách trạng báo thông báo.
    - PIM: Cần danh sách đơn vị đo lường, danh sách loại sản phẩm (nếu là dữ liệu tham chiếu chung).
    - ODM: Cần danh sách trạng thái đơn hàng.
    - LZM: Cần danh sách các Locale/Ngôn ngữ được hỗ trợ.
  - **Cơ chế:** Các BC khác sẽ gửi Query đến RDM API (ReferenceDataQueryApplicationService) để lấy dữ liệu tham chiếu.
  - **Mô hình Nhất quán:** Dữ liệu tham chiếu từ RDM được kỳ vọng có **mô hình nhất quán mạnh (Strong Consistency)** hoặc gần như vậy cho các hoạt động đọc. Khi một thay đổi được xác nhận, nó sẽ hiển thị ngay lập tức hoặc với độ trễ rất nhỏ cho tất cả các truy vấn tiếp theo.
  - **Caching:** Để giảm tải cho RDM và cải thiện hiệu năng, các BC tiêu thụ dữ liệu tham chiếu nên triển khai cơ chế caching dữ liệu tham chiếu mà họ thường xuyên sử dụng. RDM có thể phát ra Domain Events khi dữ liệu thay đổi để giúp các BC khác cập nhật cache của họ.
- **Tương tác với LZM:**
  - LZM cần truy vấn RDM để lấy danh sách các Locale/Ngôn ngữ được hỗ trợ.
  - LZM có thể cần truy vấn RDM để lấy mã/giá trị của các mục dữ liệu tham chiếu khác (ví dụ: mã quốc gia "VN") để cung cấp bản dịch tên hiển thị của chúng ("Việt Nam").
- **Tương tác với các hệ thống Quản trị:**
  - Người dùng nội bộ Ecoma (ví dụ: Admin, System Configurator) sử dụng giao diện quản trị để tạo, cập nhật, xóa các tập dữ liệu và mục dữ liệu tham chiếu. Giao diện này sẽ tương tác với RDM Application Services thông qua Commands.

## **8\. Use cases**

Dưới đây là mô tả các use case chính có sự tham gia của RDM, tập trung vào actor, mục đích và các service liên quan, được phân loại theo các nhóm chức năng chính.

### **8.1. Use Cases liên quan đến Quản lý Dữ liệu (Management)**

Nhóm này bao gồm các use case cho phép người dùng nội bộ quản lý các tập dữ liệu và mục dữ liệu tham chiếu.

- **RDM-UC-8.1.1: Quản lý Tập dữ liệu Tham chiếu**
  - **Actor:** Người dùng nội bộ Ecoma (có quyền Admin/Config), Hệ thống.
  - **Mục đích:** Tạo mới, cập nhật thông tin hoặc xóa các tập dữ liệu tham chiếu (ví dụ: tạo tập "Countries").
  - **Service liên quan:** Nhận Command từ giao diện Admin. Sử dụng ReferenceDataSetApplicationService để xử lý Command. Sử dụng ReferenceDataSetService để thực hiện logic nghiệp vụ và tương tác với Repository. Phát Domain Event.
- **RDM-UC-8.1.2: Quản lý Mục dữ liệu Tham chiếu**
  - **Actor:** Người dùng nội bộ Ecoma (có quyền Admin/Config), Hệ thống.
  - **Mục đích:** Thêm mới, cập nhật chi tiết hoặc xóa các mục dữ liệu cụ thể trong một tập dữ liệu tham chiếu (ví dụ: thêm "Vietnam" vào tập "Countries").
  - **Service liên quan:** Nhận Command từ giao diện Admin. Sử dụng ReferenceDataItemApplicationService để xử lý Command. Sử dụng ReferenceDataSetService để thực hiện logic nghiệp vụ (bao gồm kiểm tra tính duy nhất, phiên bản hóa) và tương tác với Aggregate Root/Repository. Phát Domain Event.

### **8.2. Use Cases liên quan đến Truy vấn Dữ liệu (Querying)**

Nhóm này tập trung vào việc cung cấp khả năng truy xuất dữ liệu tham chiếu cho các BC khác.

- **RDM-UC-8.2.1: Truy vấn Dữ liệu Tham chiếu**
  - **Actor:** Các Bounded Context khác (IAM, BUM, LZM, v.v.).
  - **Mục đích:** Lấy thông tin về các tập dữ liệu hoặc các mục dữ liệu tham chiếu dựa trên tên tập, mã mục, hoặc các tiêu chí khác (bao gồm cả truy vấn theo thời điểm cho dữ liệu có phiên bản).
  - **Service liên quan:** Nhận Query từ BC khác. Sử dụng ReferenceDataQueryApplicationService để xử lý Query. Sử dụng ReferenceDataSetService (hoặc ReferenceDataQueryService) để thực hiện truy vấn và tương tác với Repository. Trả về kết quả.

### **8.3. Use Cases liên quan đến Nhập/Xuất Dữ liệu (Import/Export)**

Nhóm này bao gồm các use case cho phép nhập hoặc xuất dữ liệu tham chiếu hàng loạt.

- **RDM-UC-8.3.1: Nhập/Xuất Dữ liệu Tham chiếu**
  - **Actor:** Người dùng nội bộ Ecoma (có quyền Admin/Config), Hệ thống.
  - **Mục đích:** Nhập dữ liệu tham chiếu hàng loạt từ file hoặc xuất dữ liệu tham chiếu ra file.
  - **Service liên quan:** Nhận Command/Query từ giao diện Admin hoặc Scheduled Task. Sử dụng ReferenceDataImportExportApplicationService để xử lý. Sử dụng ReferenceDataImportExportService để thực hiện logic nhập/xuất (bao gồm xử lý lỗi nghiệp vụ) và phối hợp với các Service khác để ghi/đọc dữ liệu. Phát Domain Event.

## **9\. Domain Services**

Domain Services trong RDM chứa logic nghiệp vụ quan trọng liên quan đến quản lý dữ liệu tham chiếu.

- **ReferenceDataSetService:**
  - **Trách nhiệm:** Quản lý vòng đời của ReferenceDataSet Aggregate Root và các ReferenceDataItem bên trong nó. Đảm bảo tính duy nhất của tên tập dữ liệu và mã mục dữ liệu trong tập dữ liệu. **Thực hiện các xác thực nghiệp vụ cốt lõi cho việc quản lý tập dữ liệu và mục dữ liệu, ném ra Business Rule Exception khi có lỗi.** Phối hợp với ReferenceDataSet Repository.
  - **Các phương thức tiềm năng:** CreateDataSet(...), UpdateDataSet(...), DeleteDataSet(...), AddItemToDataSet(...), UpdateItemInDataSet(...), RemoveItemFromDataSet(...), GetDataSetByName(...), GetItemByCode(...), GetItemByCodeAtTime(...).
- **ReferenceDataQueryService (Optional Domain Service):** Nếu logic truy vấn phức tạp, có thể tách ra.
  - **Trách nhiệm:** Thực hiện các truy vấn đọc dữ liệu tham chiếu, bao gồm cả việc xử lý phiên bản hóa và tối ưu hóa truy vấn dựa trên tiêu chí linh hoạt. Phối hợp với ReferenceDataSet Repository.
  - **Các phương thức tiềm năng:** FindDataSets(criteria), FindItems(criteria).
- **ReferenceDataImportExportService (Optional Domain Service):** Nếu logic nhập/xuất phức tạp, có thể tách ra.
  - **Trách nhiệm:** Thực hiện logic nghiệp vụ cho việc nhập/xuất dữ liệu tham chiếu, bao gồm đọc dữ liệu đầu vào, xác thực nghiệp vụ từng bản ghi, xử lý lỗi theo quy tắc, và phối hợp với ReferenceDataSetService (hoặc các Domain Service khác) để ghi dữ liệu.
  - **Các phương thức tiềm năng:** ImportData(dataSetId, data), ExportData(dataSetId, criteria).

## **10\. Application Services**

Application Services trong RDM là lớp mỏng điều phối các hành động từ bên ngoài (Commands, Queries) đến Domain Model. Chúng xử lý các tác vụ kỹ thuật như xác thực, ủy quyền, giao dịch cơ sở dữ liệu, và phát sự kiện.

- **ReferenceDataSetApplicationService:**
  - **Trách nhiệm:** Xử lý Commands liên quan đến quản lý tập dữ liệu tham chiếu. Sử dụng ReferenceDataSetService. Yêu cầu ủy quyền. Bắt Business Rule Exception từ Domain Service và chuyển đổi thành lỗi phù hợp cho bên gọi.
  - **Các phương thức tiềm năng:** HandleCreateReferenceDataSetCommand(command), HandleUpdateReferenceDataSetCommand(command), HandleDeleteReferenceDataSetCommand(command).
- **ReferenceDataItemApplicationService:**
  - **Trách nhiệm:** Xử lý Commands liên quan đến quản lý mục dữ liệu tham chiếu. Sử dụng ReferenceDataSetService. Yêu cầu ủy quyền. Bắt Business Rule Exception từ Domain Service và chuyển đổi thành lỗi phù hợp cho bên gọi.
  - **Các phương thức tiềm năng:** HandleAddReferenceDataItemCommand(command), HandleUpdateReferenceDataItemCommand(command), HandleRemoveReferenceDataItemCommand(command).
- **ReferenceDataQueryApplicationService:**
  - **Trách nhiệm:** Xử lý Queries để lấy dữ liệu tham chiếu. Sử dụng ReferenceDataSetService (hoặc ReferenceDataQueryService). Có thể cần kiểm tra ủy quyền đơn giản.
  - **Các phương thức tiềm năng:** HandleGetReferenceDataSetByNameQuery(query), HandleGetReferenceDataItemByCodeQuery(query), HandleListReferenceDataItemsQuery(query).
- **ReferenceDataImportExportApplicationService:**
  - **Trách nhiệm:** Xử lý Commands/Queries liên quan đến nhập/xuất dữ liệu. Sử dụng ReferenceDataImportExportService. Yêu cầu ủy quyền.
  - **Các phương thức tiềm năng:** HandleImportReferenceDataCommand(command), HandleExportReferenceDataQuery(query).

## **11\. Domain Events**

RDM phát ra các Domain Event để thông báo về sự thay đổi của dữ liệu tham chiếu.

### **11.1. Domain Events (RDM Phát ra)**

- **ReferenceDataSetCreated**
  - Phát ra khi một tập dữ liệu tham chiếu mới được tạo.
  - **Payload:**
    - DataSetId (UUID)
    - Name (String)
    - Type (String, optional)
    - IssuedAt (DateTime)
- **ReferenceDataSetUpdated**
  - Phát ra khi một tập dữ liệu tham chiếu được cập nhật (ví dụ: mô tả, trạng thái).
  - **Payload:**
    - DataSetId (UUID)
    - Name (String)
    - IssuedAt (DateTime)
- **ReferenceDataSetDeleted**
  - Phát ra khi một tập dữ liệu tham chiếu bị xóa.
  - **Payload:**
    - DataSetId (UUID)
    - Name (String)
    - IssuedAt (DateTime)
- **ReferenceDataItemAdded**
  - Phát ra khi một mục dữ liệu mới được thêm vào tập dữ liệu.
  - **Payload:**
    - DataSetId (UUID)
    - ItemId (UUID)
    - Code (String)
    - Value (Object, optional)
    - ValidFrom (DateTime, optional)
    - ValidTo (DateTime, optional)
    - IssuedAt (DateTime)
- **ReferenceDataItemUpdated**
  - Phát ra khi một mục dữ liệu trong tập dữ liệu được cập nhật (bao gồm cả tạo phiên bản mới).
  - **Payload:**
    - DataSetId (UUID)
    - ItemId (UUID)
    - Code (String)
    - Value (Object, optional)
    - ValidFrom (DateTime, optional)
    - ValidTo (DateTime, optional)
    - IssuedAt (DateTime)
- **ReferenceDataItemRemoved**
  - Phát ra khi một mục dữ liệu bị xóa khỏi tập dữ liệu.
  - **Payload:**
    - DataSetId (UUID)
    - ItemId (UUID)
    - Code (String)
    - IssuedAt (DateTime)
- **ReferenceDataImportCompleted**
  - Phát ra khi một luồng nhập dữ liệu hoàn thành thành công.
  - **Payload:**
    - DataSetId (UUID)
    - DataSetName (String)
    - ImportedByUserId (UUID)
    - NumberOfItemsProcessed (Integer)
    - NumberOfItemsAdded (Integer)
    - NumberOfItemsUpdated (Integer)
    - NumberOfItemsFailed (Integer)
    - CompletedAt (DateTime)
    - IssuedAt (DateTime)
- **ReferenceDataImportFailed**
  - Phát ra khi một luồng nhập dữ liệu thất bại.
  - **Payload:**
    - DataSetId (UUID)
    - DataSetName (String)
    - ImportedByUserId (UUID)
    - FailureReason (String)
    - FailedAt (DateTime)
    - IssuedAt (DateTime)
- **ReferenceDataExportCompleted**
  - Phát ra khi một luồng xuất dữ liệu hoàn thành thành công.
  - **Payload:**
    - DataSetId (UUID)
    - DataSetName (String)
    - ExportedByUserId (UUID)
    - NumberOfItemsExported (Integer)
    - CompletedAt (DateTime)
    - IssuedAt (DateTime)

### **11.2. Domain Events Được Xử lý (Consumed Domain Events)**

RDM hiện tại không được mô tả là lắng nghe các Domain Event từ các BC khác trong tài liệu gốc. Nó chủ yếu là Data Provider. Nếu có nhu cầu RDM phản ứng với các sự kiện từ BC khác trong tương lai, phần này sẽ được bổ sung.

## **12\. Ranh giới Nghiệp vụ**

Ranh giới của Bounded Context RDM được xác định bởi trách nhiệm quản lý các tập dữ liệu tham chiếu tĩnh hoặc ít thay đổi được sử dụng chung trên toàn hệ thống. RDM là nguồn sự thật cho các giá trị tham chiếu này.

RDM không chịu trách nhiệm:

- **Quản lý dữ liệu nghiệp vụ chính:** RDM không quản lý các thực thể nghiệp vụ cốt lõi như User, Order, Product (trừ khi các thuộc tính của chúng là dữ liệu tham chiếu \- ví dụ: loại sản phẩm nếu là danh sách cố định).
- **Bản địa hóa dữ liệu tham chiếu:** Việc cung cấp tên/mô tả bản địa hóa cho các mục dữ liệu tham chiếu thuộc về LZM. RDM chỉ lưu trữ mã và giá trị chuẩn.
- **Xác thực nghiệp vụ phức tạp liên BC:** RDM không thực thi các ràng buộc tham chiếu cứng với dữ liệu ở các BC khác. Việc đảm bảo tính toàn vẹn tham chiếu trong kiến trúc phân tán là trách nhiệm chung của các BC liên quan, có thể thông qua việc RDM phát Event và các BC khác phản ứng (ví dụ: kiểm tra sử dụng khi RDM thông báo xóa Item).
- **Hiển thị dữ liệu tham chiếu:** Việc hiển thị dữ liệu tham chiếu cho người dùng (ví dụ: trong dropdown list) thuộc về các BC giao diện người dùng hoặc các BC tiêu thụ dữ liệu.
- **Lưu trữ dữ liệu có volume lớn và thay đổi thường xuyên:** RDM tập trung vào dữ liệu tham chiếu (ít thay đổi, volume vừa phải). Dữ liệu nghiệp vụ chính với volume lớn và thay đổi liên tục thuộc về các BC nghiệp vụ tương ứng.
- **Chi tiết triển khai kỹ thuật:** Các giải pháp cụ thể về cơ sở dữ liệu, indexing, caching, xử lý bất đồng bộ, và các mẫu kiến trúc phân tán nằm ngoài phạm vi tài liệu này.

## **13\. Kết luận**

Bounded Context Reference Data Management (RDM) là một thành phần cốt lõi quan trọng, cung cấp chức năng quản lý và phân phối dữ liệu tham chiếu cho toàn hệ thống Ecoma. Bằng cách tập trung trách nhiệm này vào một Context duy nhất, RDM đảm bảo tính nhất quán, nguồn đáng tin cậy và khả năng truy cập hiệu quả cho các dữ liệu nền tảng, hỗ trợ sự phát triển và hoạt động của các Bounded Context khác. Việc thiết kế RDM như một dịch vụ cung cấp dữ liệu (qua Query) với mô hình nhất quán mạnh và thông báo thay đổi (qua Event) giúp giảm thiểu sự phụ thuộc trực tiếp và khuyến khích caching ở các BC tiêu thụ. Khả năng quản lý các loại dữ liệu khác nhau và phiên bản hóa (tùy chọn) làm tăng tính linh hoạt của RDM. Tài liệu này cũng làm rõ các yêu cầu về hiệu năng truy vấn, xử lý lỗi nghiệp vụ trong quản lý và nhập dữ liệu, và ranh giới liên quan đến ràng buộc tham chiếu liên BC.

Tài liệu này đã được cập nhật để tuân thủ cấu trúc và mức độ chi tiết của các tài liệu IAM và BUM, bao gồm việc bổ sung phần Các Khía cạnh Quan trọng của Miền, tổ chức lại luồng nghiệp vụ thành Use Cases và chi tiết hóa các Domain Event (Published/Consumed, payload dự kiến). Đây là nền tảng để chuyển sang giai đoạn thiết kế kỹ thuật chi tiết và triển khai Microservice RDM.
