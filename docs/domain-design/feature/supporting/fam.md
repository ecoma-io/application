# **Tài liệu Thiết kế Miền: Bounded Context Financial Accounting Management (FAM)**

## **1\. Giới thiệu**

Tài liệu này cung cấp mô tả chi tiết về Bounded Context **Financial Accounting Management (FAM)** trong hệ thống Ecoma. FAM là một trong những Bounded Context thuộc nhóm Operations Feature, chịu trách nhiệm ghi nhận, xử lý và báo cáo các giao dịch tài chính phát sinh từ các hoạt động kinh doanh của tổ chức khách hàng trên nền tảng Ecoma.

FAM đóng vai trò là hệ thống kế toán cốt lõi, đảm bảo tính chính xác, đầy đủ và kịp thời của dữ liệu tài chính, hỗ trợ việc tuân thủ các chuẩn mực kế toán khác nhau (như IFRS, VAS) và cung cấp thông tin cho việc ra quyết định tài chính.

## **2\. Phạm vi của Tài liệu**

Tài liệu này tập trung vào việc định nghĩa và mô tả Bounded Context FAM ở cấp độ thiết kế miền (domain design), cung cấp đủ chi tiết để hỗ trợ việc thiết kế các Domain Service và Application Service, đặc biệt nhấn mạnh khả năng hỗ trợ linh hoạt các hệ thống tài khoản kế toán khác nhau. Cụ thể, tài liệu này bao gồm:

- Xác định vai trò và trách nhiệm chính của FAM, tập trung vào ghi nhận giao dịch, quản lý sổ cái và báo cáo tài chính.
- Mô tả các khái niệm và thực thể cốt lõi trong mô hình domain của FAM ở cấp độ chi tiết hơn, bao gồm các Aggregate Root, Entity và Value Object với các thuộc tính chính, có tính đến việc hỗ trợ nhiều chuẩn mực kế toán.
- Định nghĩa Ngôn ngữ Chung (Ubiquitous Language) trong phạm vi FAM.
- Mô tả **Các Khía cạnh Quan trọng của Miền FAM**, làm rõ các quy tắc và cấu trúc nghiệp vụ chi phối hoạt động của Context này, đặc biệt là cơ chế hỗ trợ đa chuẩn mực kế toán.
- Làm rõ các tương tác chính giữa FAM và các Bounded Context khác là nguồn phát sinh giao dịch tài chính.
- Phác thảo các **Use cases** chính có sự tham gia của FAM, tập trung vào actor, mục đích và các Domain/Application Service liên quan.
- Xác định ranh giới nghiệp vụ của FAM, nhấn mạnh những gì FAM không chịu trách nhiệm.
- Đề xuất các Domain Service và Application Service tiềm năng trong FAM, mô tả trách nhiệm chính của từng service.
- Xác định và mô tả các **Domain Events** mà FAM tương tác, được chia thành các sự kiện FAM **phát ra** (Published Events) và các sự kiện FAM **lắng nghe và xử lý** (Consumed Events), bao gồm payload dự kiến của từng event.

Tài liệu này **không** đi sâu vào các chi tiết kỹ thuật triển khai cụ thể hoặc mô tả chi tiết các bước thực hiện (how) của từng luồng nghiệp vụ **bên trong các service**. Các khía cạnh sau **không** nằm trong phạm vi của tài liệu này:

- Chi tiết cài đặt kỹ thuật của Microservice FAM.
- Cấu trúc cơ sở dữ liệu chi tiết (schema) của FAM.
- Các quyết định công nghệ cụ thể bên trong FAM (ví dụ: loại database, cách lưu trữ cấu trúc tài khoản).
- Luồng dữ liệu chi tiết đến cấp độ từng trường thông tin giữa FAM và các BC khác.
- Cấu hình hạ tầng triển khai cụ thể cho Microservice FAM.
- Thiết kế giao diện người dùng để quản lý kế toán hoặc xem báo cáo.
- Xử lý tính lương chi tiết và thuế (chỉ nhận dữ liệu tổng hợp từ HRM/hệ thống tính lương).
- Xử lý các nghĩa vụ thuế (kê khai, nộp thuế).
- Xử lý các quy trình thanh toán thực tế (thuộc PPM).
- Quản lý chi tiết công nợ phải thu/phải trả ở cấp độ từng hóa đơn/khách hàng/nhà cung cấp (có thể thuộc về các BC nghiệp vụ như CRM/OSM/SFM hoặc một BC Accounts Receivable/Payable riêng). FAM tập trung vào ghi nhận tổng hợp vào sổ cái.
- Quản lý tài sản cố định chi tiết: Việc theo dõi từng tài sản, tính khấu hao chi tiết có thể thuộc về một BC Fixed Asset Management riêng. FAM chỉ nhận bút toán tổng hợp về khấu hao và giá trị tài sản.

## **3\. Vai trò và Trách nhiệm Chính**

Bounded Context FAM chịu trách nhiệm quản lý các khía cạnh kế toán tài chính. Các trách nhiệm chính bao gồm:

- **Quản lý Hệ thống Tài khoản Kế toán (Chart of Accounts \- CoA):** Cho phép định nghĩa và quản lý cấu trúc hệ thống tài khoản kế toán cho từng tổ chức khách hàng, hỗ trợ các chuẩn mực kế toán khác nhau (IFRS, VAS).
- **Ghi nhận Giao dịch Tài chính (Posting):** Tiếp nhận dữ liệu về các giao dịch tài chính từ các Bounded Context khác và ghi nhận chúng vào sổ cái (General Ledger) dưới dạng các bút toán (Journal Entry). Đảm bảo tính cân đối của bút toán (Tổng Nợ \= Tổng Có).
- **Quản lý Sổ cái (General Ledger \- GL):** Lưu trữ tất cả các bút toán đã được ghi nhận. Cung cấp khả năng truy vấn số dư tài khoản tại một thời điểm bất kỳ.
- **Quản lý Kỳ Kế toán:** Định nghĩa và quản lý các kỳ kế toán (Accounting Period), bao gồm mở/đóng kỳ.
- **Tạo Báo cáo Tài chính:** Tổng hợp dữ liệu từ Sổ cái để tạo ra các báo cáo tài chính tiêu chuẩn (ví dụ: Bảng cân đối kế toán, Báo cáo kết quả hoạt động kinh doanh) dựa trên chuẩn mực kế toán đã chọn của tổ chức.
- **Hỗ trợ Đa Chuẩn mực Kế toán:** Cung cấp cơ chế để mỗi tổ chức khách hàng có thể chọn và sử dụng một hệ thống tài khoản kế toán phù hợp với chuẩn mực của họ (IFRS, VAS, hoặc tùy chỉnh). Đảm bảo các bút toán được ghi nhận phù hợp với hệ thống tài khoản đó.
- **Phát Sự kiện Nghiệp vụ:** Phát ra các Sự kiện Nghiệp vụ quan trọng khi dữ liệu tài chính được ghi nhận hoặc khi báo cáo được tạo.

## **4\. Mô hình Domain (Chi tiết hơn)**

Trong phạm vi Bounded Context FAM, chúng ta xác định các Aggregate Root, Entity và Value Object cốt lõi với các thuộc tính chính, có tính đến việc hỗ trợ nhiều chuẩn mực kế toán:

**Aggregate Roots:**

- **GeneralLedger (GL):** Là Aggregate Root trung tâm, đại diện cho sổ cái của một tổ chức khách hàng. GL quản lý tất cả các bút toán (Journal Entry) đã được ghi nhận.
  - **ID:** Unique identifier (UUID).
  - **TenantId:** ID của tổ chức sở hữu sổ cái (liên kết với IAM).
  - **ChartOfAccountsId:** ID của Hệ thống Tài khoản Kế toán đang được sử dụng bởi tổ chức này (liên kết với ChartOfAccounts Aggregate).
  - **AccountingPeriodId:** ID của Kỳ Kế toán hiện tại (liên kết với AccountingPeriod Aggregate).
  - **JournalEntries:** Danh sách các JournalEntry Entities.
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ PostJournalEntry, GetAccountBalance (Query logic), GetJournalEntriesByPeriod (Query logic).
- **ChartOfAccounts (CoA):** Là Aggregate Root định nghĩa cấu trúc hệ thống tài khoản kế toán cho một tổ chức hoặc một chuẩn mực kế toán.
  - **ID:** Unique identifier (UUID).
  - **TenantId:** **Optional** ID của tổ chức (nếu là CoA tùy chỉnh của tổ chức) hoặc null (nếu là CoA mẫu theo chuẩn mực).
  - **Name:** Tên hệ thống tài khoản (ví dụ: "VAS 200", "IFRS Standard").
  - **AccountingStandard:** Chuẩn mực kế toán liên quan (AccountingStandard Value Object: VAS, IFRS).
  - **Accounts:** Danh sách các Account Entities.
  - **IsTemplate:** Boolean chỉ định đây có phải là mẫu theo chuẩn mực không.
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ AddAccount, UpdateAccount, DeactivateAccount.
- **AccountingPeriod:** Là Aggregate Root đại diện cho một kỳ kế toán.
  - **ID:** Unique identifier (UUID).
  - **TenantId:** ID của tổ chức.
  - **Name:** Tên kỳ (ví dụ: "Quý 1 2024", "Tháng 03 2024").
  - **StartDate:** Ngày bắt đầu kỳ. **Lưu trữ ở múi giờ UTC.**
  - **EndDate:** Ngày kết thúc kỳ. **Lưu trữ ở múi giờ UTC.**
  - **Status:** Trạng thái kỳ (AccountingPeriodStatus Value Object: Open, Closed).
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ Open, Close.

**Entities (thuộc về các Aggregate Root):**

- **JournalEntry (thuộc GeneralLedger):** Đại diện cho một bút toán ghi nhận giao dịch tài chính.
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root GL.
  - **TransactionDate:** Ngày phát sinh giao dịch. **Lưu trữ ở múi giờ UTC.**
  - **PostingDate:** Ngày ghi nhận vào sổ cái. **Lưu trữ ở múi giờ UTC.**
  - **Description:** Diễn giải bút toán (có thể đa ngôn ngữ, sử dụng LZM).
  - **SourceBoundedContext:** BC đã phát sinh giao dịch (ví dụ: "ODM", "PPM", "BUM").
  - **SourceTransactionId:** ID giao dịch gốc trong BC nguồn (ví dụ: Order ID, Payment Transaction ID, Billing Transaction ID).
  - **DebitLines:** Danh sách các JournalEntryLine Value Objects (các dòng Nợ).
  - **CreditLines:** Danh sách các JournalEntryLine Value Objects (các dòng Có).
  - **TotalDebit:** Tổng tiền Nợ (Money Value Object).
  - **TotalCredit:** Tổng tiền Có (Money Value Object). **Ràng buộc: TotalDebit \= TotalCredit.**
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ None (Immutable after creation).
- **Account (thuộc ChartOfAccounts):** Đại diện cho một tài khoản kế toán.
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root CoA.
  - **AccountNumber:** Số hiệu tài khoản (duy nhất trong CoA).
  - **Name:** Tên tài khoản (có thể đa ngôn ngữ, sử dụng LZM).
  - **AccountType:** Loại tài khoản (AccountType Value Object: Asset, Liability, Equity, Revenue, Expense).
  - **ParentAccountId:** **Optional** ID tài khoản cha (để xây dựng cây tài khoản).
  - **IsActive:** Trạng thái hoạt động.
  - **AllowPosting:** Boolean chỉ định có cho phép ghi nhận bút toán trực tiếp vào tài khoản này không (tài khoản tổng hợp thường không cho phép).
  - **CreatedAt:** Thời điểm tạo. **Lưu trữ ở múi giờ UTC.**
  - _Behavior:_ Activate, Deactivate.

**Value Objects:**

- **Money:** Giá trị tiền tệ (Amount, Currency).
- **JournalEntryLine:** Một dòng trong bút toán (Nợ hoặc Có).
  - **AccountId:** ID của tài khoản kế toán bị ảnh hưởng (liên kết với Account Entity).
  - **Amount:** Số tiền (Money Value Object).
  - **Description:** Diễn giải riêng cho dòng này (tùy chọn, có thể đa ngôn ngữ, sử dụng LZM).
- **AccountingStandard:** Chuẩn mực kế toán (VAS, IFRS).
  - **Code:** Mã chuẩn mực (ví dụ: "VAS", "IFRS").
  - **Name:** Tên chuẩn mực (có thể đa ngôn ngữ, sử dụng LZM).
- **AccountType:** Loại tài khoản kế toán (Asset, Liability, Equity, Revenue, Expense).
  - **Code:** Mã loại (ví dụ: "ASSET").
  - **Name:** Tên loại (có thể đa ngôn ngữ, sử dụng LZM).
- **AccountingPeriodStatus:** Trạng thái kỳ kế toán (Open, Closed).
- **FinancialReportType:** Loại báo cáo tài chính (BalanceSheet, IncomeStatement).
- **LocalizedText:** Giá trị văn bản đa ngôn ngữ (sử dụng Translation Key).

## **5\. Ngôn ngữ Chung (Ubiquitous Language)**

Trong Bounded Context FAM, các thuật ngữ sau đây có ý nghĩa cụ thể và nhất quán:

- **Chart of Accounts (CoA):** Hệ thống các tài khoản kế toán được sử dụng bởi một tổ chức.
- **Account:** Một mục trong Chart of Accounts để ghi nhận các giao dịch tài chính.
- **General Ledger (GL):** Sổ cái ghi lại tất cả các bút toán của tổ chức.
- **Journal Entry (JE):** Một bút toán ghi nhận một giao dịch tài chính vào sổ cái, bao gồm ít nhất một dòng Nợ và một dòng Có.
- **Posting:** Hành động ghi nhận một giao dịch tài chính vào sổ cái thông qua một Journal Entry.
- **Debit:** Ghi Nợ.
- **Credit:** Ghi Có.
- **Account Balance:** Số dư của một tài khoản tại một thời điểm.
- **Accounting Period:** Một khoảng thời gian xác định cho mục đích kế toán (ví dụ: tháng, quý, năm).
- **Closing Period:** Quy trình kết thúc một kỳ kế toán, tổng hợp số dư và chuẩn bị cho kỳ tiếp theo.
- **Financial Report:** Báo cáo tổng hợp dữ liệu tài chính (ví dụ: Bảng cân đối kế toán, Báo cáo kết quả hoạt động kinh doanh).
- **Accounting Standard:** Chuẩn mực kế toán (ví dụ: VAS, IFRS).
- **Trial Balance:** Bảng cân đối thử, liệt kê số dư cuối kỳ của tất cả các tài khoản.

## **6\. Các Khía cạnh Quan trọng của Miền FAM**

Phần này mô tả các cấu trúc, quy tắc và khái niệm nghiệp vụ quan trọng chi phối hoạt động của Bounded Context FAM.

### **6.1. Hỗ trợ Đa Chuẩn mực Kế toán và Hệ thống Tài khoản (CoA)**

FAM được thiết kế để hỗ trợ linh hoạt các chuẩn mực kế toán khác nhau (ví dụ: VAS cho Việt Nam, IFRS cho quốc tế) cho từng tổ chức khách hàng.

- **CoA Mẫu:** FAM quản lý các Chart of Accounts mẫu được định nghĩa sẵn theo các chuẩn mực kế toán phổ biến.
- **CoA Tùy chỉnh:** Mỗi tổ chức khách hàng có thể chọn một CoA mẫu và tùy chỉnh nó (thêm/sửa/xóa tài khoản con) hoặc tạo một CoA hoàn toàn mới phù hợp với nhu cầu riêng của họ, miễn là tuân thủ các nguyên tắc cơ bản của chuẩn mực đã chọn hoặc nguyên tắc kế toán chung.
- **Liên kết CoA với Tenant:** Mỗi Tenant sẽ được liên kết với một ChartOfAccounts Aggregate Root cụ thể thông qua ChartOfAccountsId trong GeneralLedger Aggregate Root.
- **Mapping Giao dịch sang Tài khoản:** Logic nghiệp vụ trong FAM (cụ thể là AccountingTransactionService) chịu trách nhiệm "phiên dịch" các giao dịch nghiệp vụ phát sinh từ các BC khác (ví dụ: bán hàng, thu tiền) thành các bút toán Nợ/Có phù hợp. Việc "phiên dịch" này phụ thuộc vào loại giao dịch và **cấu trúc tài khoản trong CoA đang được sử dụng bởi Tenant đó**. Ví dụ: giao dịch bán hàng có thể ghi Nợ tài khoản "Tiền mặt" hoặc "Phải thu khách hàng" và ghi Có tài khoản "Doanh thu bán hàng", nhưng số hiệu tài khoản cụ thể sẽ khác nhau tùy thuộc vào CoA của Tenant.

### **6.2. Tính Bất biến của Bút toán (Journal Entry)**

Journal Entry Aggregate Root (hoặc Entity thuộc GL Aggregate) là bất biến sau khi được ghi nhận thành công. Không thể sửa đổi một bút toán đã được post. Nếu cần điều chỉnh, phải tạo một bút toán điều chỉnh mới. Điều này đảm bảo tính toàn vẹn và kiểm toán được của dữ liệu tài chính.

### **6.3. Quản lý Kỳ Kế toán và Quy trình Đóng kỳ**

FAM quản lý các kỳ kế toán (tháng, quý, năm) và trạng thái của chúng (Open, Closed). Việc đóng kỳ kế toán là một quy trình quan trọng, thường bao gồm việc tổng hợp số dư các tài khoản doanh thu/chi phí và chuyển sang tài khoản lợi nhuận giữ lại, khóa sổ để không cho phép ghi nhận bút toán mới vào kỳ đã đóng. Logic này nằm trong AccountingPeriodService.

### **6.4. Tính Cân đối của Bút toán**

Một quy tắc nghiệp vụ cốt lõi là tổng số tiền ghi Nợ phải luôn bằng tổng số tiền ghi Có trong mỗi Journal Entry (TotalDebit \= TotalCredit). FAM phải kiểm tra và đảm bảo quy tắc này trước khi ghi nhận bút toán.

### **6.5. Nguồn Giao dịch Tài chính từ các BC Khác**

FAM là một hệ thống "lắng nghe" các sự kiện tài chính. Các giao dịch tài chính không được tạo ra trực tiếp trong FAM (trừ các bút toán điều chỉnh hoặc bút toán cuối kỳ). Thay vào đó, chúng phát sinh từ các hoạt động nghiệp vụ trong các Bounded Context khác (OSM, ODM, PPM, BUM, ICM, HRM, MPM, SFM) và được thông báo đến FAM thông qua các Domain Event. FAM nhận các Event này và chuyển đổi chúng thành các Journal Entry phù hợp với CoA của Tenant.

### **6.6. Báo cáo Tài chính dựa trên Chuẩn mực**

FAM có khả năng tạo các báo cáo tài chính tiêu chuẩn (Bảng cân đối kế toán, Báo cáo kết quả hoạt động kinh doanh) bằng cách tổng hợp dữ liệu từ Sổ cái. Cấu trúc và nội dung của báo cáo phụ thuộc vào loại báo cáo yêu cầu và **chuẩn mực kế toán/CoA của Tenant**. Logic tổng hợp và trình bày dữ liệu này nằm trong FinancialReportingService.

## **7\. Tương tác với các Bounded Context khác**

FAM là Consumer chính của các Sự kiện Nghiệp vụ từ các Bounded Context khác khi các sự kiện đó có ảnh hưởng tài chính. FAM cũng cung cấp dữ liệu cho các hệ thống báo cáo hoặc BI.

- **Tương tác với Core BCs:**
  - **IAM:** FAM cần IAM (Request/Reply) để xác thực và ủy quyền cho người dùng quản lý kế toán hoặc xem báo cáo tài chính. FAM lấy thông tin Tenant ID từ ngữ cảnh phiên làm việc.
  - **LZM & RDM:** FAM cần LZM (Request/Reply) để quản lý và hiển thị tên tài khoản, diễn giải bút toán, tên báo cáo đa ngôn ngữ. FAM gọi LZM để tra cứu bản dịch và định dạng dữ liệu (số, tiền tệ, ngày giờ). LZM gọi RDM để lấy quy tắc định dạng và các dữ liệu tham chiếu (ví dụ: danh sách tiền tệ, loại báo cáo, **chuẩn mực kế toán**).
  - **ALM:** FAM phát ra các sự kiện audit log (Event) khi có các hành động quan trọng liên quan đến quản lý kế toán (ví dụ: ghi nhận bút toán, đóng kỳ kế toán, thay đổi cấu trúc tài khoản).
- **Tương tác với Feature BCs (Nguồn phát sinh Giao dịch Tài chính \- Consumed Events):**
  - **OSM & ODM:** Phát sinh doanh thu từ bán hàng, giá vốn hàng bán, chi phí bán hàng.
    - **OrderCompletedEvent** (Từ ODM): Chứa thông tin doanh thu, chi phí giá vốn, chi phí bán hàng liên quan đến đơn hàng hoàn thành.
    - **OrderCancelledEvent** (Từ ODM): Chứa thông tin về việc hủy đơn hàng, có thể cần bút toán điều chỉnh doanh thu/giá vốn nếu đã ghi nhận.
    - **ReturnProcessedEvent** (Từ OSM/ODM): Chứa thông tin về hàng trả lại, cần bút toán giảm doanh thu, nhập kho hàng trả lại.
  - **PPM:** Phát sinh các giao dịch thu/chi tiền thực tế.
    - **PaymentSuccessfulEvent** (Từ PPM): Chứa thông tin số tiền đã thu, phương thức thanh toán (ảnh hưởng đến tài khoản tiền mặt/ngân hàng), liên kết đến giao dịch gốc (Order/Invoice).
    - **RefundProcessedEvent** (Từ PPM): Chứa thông tin số tiền đã hoàn trả.
  - **BUM:** Phát sinh doanh thu từ gói dịch vụ và usage.
    - **BillingTransactionSuccessfulEvent** (Từ BUM): Chứa thông tin số tiền thu từ gói/usage, liên kết đến Tenant/Subscription.
  - **ICM:** Phát sinh giá trị nhập/xuất kho ảnh hưởng đến giá vốn hàng bán và giá trị tồn kho.
    - **InventoryReceivedEvent** (Từ ICM): Chứa thông tin giá trị hàng nhập kho.
    - **InventoryDeductedEvent** (Từ ICM): Chứa thông tin giá vốn hàng bán của hàng xuất kho.
  - **HRM:** Phát sinh chi phí lương và các chi phí nhân sự khác (thường nhận dữ liệu tổng hợp từ HRM hoặc hệ thống tính lương).
    - **PayrollProcessedEvent** (Từ HRM/Hệ thống tính lương): Chứa tổng chi phí lương, các khoản khấu trừ, thuế phải nộp liên quan đến kỳ lương.
  - **MPM:** Chi phí marketing, chiết khấu, giảm giá (ảnh hưởng đến doanh thu ròng hoặc chi phí).
    - **PromotionAppliedEvent** (Từ MPM): Chứa thông tin chiết khấu/giảm giá được áp dụng cho đơn hàng/giao dịch.
    - **MarketingExpenseRecordedEvent** (Từ MPM): Chứa thông tin chi phí marketing phát sinh.
  - **SFM:** Chi phí vận chuyển.
    - **ShippingCostRecordedEvent** (Từ SFM): Chứa thông tin chi phí vận chuyển cho đơn hàng.
- **Tương tác với các hệ thống tiêu thụ dữ liệu tài chính (Published Events hoặc Query):**
  - **BI Tools/Reporting Systems:** Truy vấn dữ liệu từ FAM (thường qua API Query hoặc Data Export) để tạo các báo cáo phân tích tài chính chuyên sâu.
  - **Tax Filing Systems:** Có thể cần truy vấn dữ liệu tài chính từ FAM để chuẩn bị hồ sơ kê khai thuế.

## **8\. Use cases**

Dưới đây là mô tả các use case chính có sự tham gia của FAM, được tổ chức theo các nhóm chức năng chính, tập trung vào actor, mục đích và các Domain/Application Service liên quan.

### **8.1. Use Cases liên quan đến Ghi nhận Giao dịch (Posting)**

Nhóm này bao gồm việc nhận các sự kiện nghiệp vụ và chuyển đổi chúng thành bút toán kế toán.

- **Use case: Ghi nhận Giao dịch Bán hàng:**
  - **Actor:** Hệ thống (lắng nghe OrderCompletedEvent từ ODM).
  - **Mục đích:** Tự động ghi nhận doanh thu, giá vốn hàng bán, và các khoản phải thu/tiền mặt liên quan đến đơn hàng đã hoàn thành vào sổ cái.
  - **Service liên quan:** Được xử lý bởi AccountingTransactionApplicationService (Event Handler cho OrderCompletedEvent). Sử dụng AccountingTransactionService để tạo và post Journal Entry, dựa trên dữ liệu từ Event payload và CoA của Tenant (lấy từ ChartOfAccounts Repository). Sử dụng GeneralLedger Repository. Phát sự kiện JournalEntryPosted, audit log cho ALM.
- **Use case: Ghi nhận Giao dịch Thu tiền:**
  - **Actor:** Hệ thống (lắng nghe PaymentSuccessfulEvent từ PPM).
  - **Mục đích:** Tự động ghi nhận khoản tiền đã thu vào tài khoản tiền mặt/ngân hàng và giảm khoản phải thu khách hàng (hoặc ghi nhận doanh thu ngay nếu là mô hình thu trước).
  - **Service liên quan:** Được xử lý bởi AccountingTransactionApplicationService (Event Handler cho PaymentSuccessfulEvent). Sử dụng AccountingTransactionService để tạo và post Journal Entry, dựa trên dữ liệu từ Event payload và CoA của Tenant. Sử dụng GeneralLedger Repository. Phát sự kiện JournalEntryPosted, audit log cho ALM.
- **Use case: Ghi nhận Giao dịch Chi phí Lương:**
  - **Actor:** Hệ thống (lắng nghe PayrollProcessedEvent từ HRM/Hệ thống tính lương).
  - **Mục đích:** Tự động ghi nhận chi phí lương và các khoản phải trả liên quan (thuế, bảo hiểm) vào sổ cái.
  - **Service liên quan:** Được xử lý bởi AccountingTransactionApplicationService (Event Handler cho PayrollProcessedEvent). Sử dụng AccountingTransactionService để tạo và post Journal Entry, dựa trên dữ liệu từ Event payload và CoA của Tenant. Sử dụng GeneralLedger Repository. Phát sự kiện JournalEntryPosted, audit log cho ALM.

### **8.2. Use Cases liên quan đến Quản lý Hệ thống Tài khoản Kế toán (CoA)**

Nhóm này bao gồm việc thiết lập và quản lý cấu trúc tài khoản kế toán.

- **Use case: Chọn Chuẩn mực Kế toán và Thiết lập CoA Ban đầu cho Tổ chức:**
  - **Actor:** Người dùng (có quyền quản lý kế toán \- Admin/Finance Manager).
  - **Mục đích:** Chọn một chuẩn mực kế toán (ví dụ: VAS, IFRS) và tạo Chart of Accounts ban đầu cho tổ chức (bằng cách sao chép từ mẫu hoặc tạo mới).
  - **Service liên quan:** Được xử lý bởi ChartOfAccountsApplicationService (Command). Sử dụng ChartOfAccountsService để tạo/sao chép ChartOfAccounts Aggregate Root và liên kết nó với GeneralLedger Aggregate Root của Tenant. Sử dụng ChartOfAccounts Repository, GeneralLedger Repository. Phát sự kiện ChartOfAccountsCreated, AccountingStandardSelected, audit log cho ALM.
- **Use case: Thêm/Cập nhật Tài khoản trong CoA Tùy chỉnh:**
  - **Actor:** Người dùng (có quyền quản lý CoA).
  - **Mục đích:** Tùy chỉnh Chart of Accounts của tổ chức bằng cách thêm tài khoản con, cập nhật tên, hoặc trạng thái hoạt động của tài khoản.
  - **Service liên quan:** Được xử lý bởi ChartOfAccountsApplicationService (Command). Sử dụng ChartOfAccountsService để lấy và cập nhật ChartOfAccounts Aggregate Root. Sử dụng ChartOfAccounts Repository. Phát sự kiện AccountAddedToCoA, AccountUpdatedInCoA, audit log cho ALM.
- **Use case: Xem Cấu trúc Hệ thống Tài khoản (CoA):**
  - **Actor:** Người dùng (có quyền xem CoA).
  - **Mục đích:** Xem cấu trúc cây của Chart of Accounts đang được sử dụng bởi tổ chức.
  - **Service liên quan:** Được xử lý bởi FinancialReportingApplicationService (Query) hoặc FAMQueryApplicationService (Query). Sử dụng FinancialReportingService hoặc FAMQueryService để lấy ChartOfAccounts Aggregate Root. Sử dụng ChartOfAccounts Repository. Gọi LZM để lấy tên tài khoản đa ngôn ngữ.

### **8.3. Use Cases liên quan đến Quản lý Kỳ Kế toán**

Nhóm này bao gồm việc mở, đóng và quản lý các kỳ kế toán.

- **Use case: Tạo Kỳ Kế toán Mới:**
  - **Actor:** Người dùng (có quyền quản lý kỳ kế toán).
  - **Mục đích:** Thiết lập một khoảng thời gian mới cho mục đích ghi sổ và báo cáo.
  - **Service liên quan:** Được xử lý bởi AccountingPeriodApplicationService (Command). Sử dụng AccountingPeriodService để tạo AccountingPeriod Aggregate Root. Sử dụng AccountingPeriod Repository. Phát sự kiện AccountingPeriodCreated, audit log cho ALM.
- **Use case: Đóng Kỳ Kế toán:**
  - **Actor:** Người dùng (có quyền quản lý kỳ kế toán).
  - **Mục đích:** Hoàn tất các bút toán điều chỉnh cuối kỳ, tổng hợp số dư, và khóa sổ cho kỳ đã qua.
  - **Service liên quan:** Được xử lý bởi AccountingPeriodApplicationService (Command). Sử dụng AccountingPeriodService để lấy và thay đổi trạng thái AccountingPeriod Aggregate Root thành Closed. AccountingPeriodService thực hiện logic đóng kỳ (tạo bút toán kết chuyển doanh thu/chi phí). Sử dụng AccountingPeriod Repository, GeneralLedger Repository. Phát sự kiện AccountingPeriodClosed, JournalEntryPosted (cho bút toán kết chuyển), audit log cho ALM.

### **8.4. Use Cases liên quan đến Báo cáo Tài chính**

Nhóm này bao gồm việc tạo và xem các báo cáo tài chính.

- **Use case: Tạo và Xem Báo cáo Tài chính:**
  - **Actor:** Người dùng (có quyền xem báo cáo tài chính).
  - **Mục đích:** Lấy dữ liệu từ sổ cái và hiển thị dưới dạng Bảng cân đối kế toán, Báo cáo kết quả hoạt động kinh doanh, v.v. theo chuẩn mực kế toán của tổ chức.
  - **Service liên quan:** Được xử lý bởi FinancialReportingApplicationService (Query). Sử dụng FinancialReportingService để tổng hợp dữ liệu từ GeneralLedger Aggregate Root và ChartOfAccounts Aggregate Root, trình bày theo loại báo cáo yêu cầu. Sử dụng GeneralLedger Repository, ChartOfAccounts Repository, AccountingPeriod Repository. Gọi LZM để lấy tên tài khoản/mục báo cáo đa ngôn ngữ.

## **9\. Domain Services**

Domain Services trong FAM chứa logic nghiệp vụ quan trọng liên quan đến kế toán tài chính, đặc biệt là việc xử lý bút toán và báo cáo theo chuẩn mực.

- **AccountingTransactionService:**
  - **Trách nhiệm:** Xử lý việc ghi nhận các giao dịch tài chính vào sổ cái. Xác định các tài khoản Nợ/Có phù hợp dựa trên loại giao dịch và CoA của Tenant. Tạo JournalEntry và ghi nhận vào GeneralLedger. Đảm bảo tính cân đối của bút toán. Phối hợp với GeneralLedger Repository, ChartOfAccounts Repository (để lấy CoA của Tenant), và các BC nguồn (để hiểu Event payload).
  - **Các phương thức tiềm năng:** PostTransaction(tenantId, sourceBc, sourceTransactionId, transactionDate, description, transactionDetails) \- transactionDetails là Value Object mô tả các khía cạnh tài chính của giao dịch gốc (ví dụ: loại doanh thu, loại chi phí, số tiền, loại tài sản/nợ phải thu).
- **ChartOfAccountsService:**
  - **Trách nhiệm:** Quản lý vòng đời và cấu trúc của ChartOfAccounts. Thêm/cập nhật/xóa tài khoản. Liên kết CoA với Tenant. Cung cấp các mẫu CoA theo chuẩn mực. Phối hợp với ChartOfAccounts Repository, GeneralLedger Repository (khi liên kết CoA với GL của Tenant).
  - **Các phương thức tiềm năng:** CreateChartOfAccounts(tenantId, name, accountingStandard, isTemplate), AddAccount(coaId, accountDetails), UpdateAccount(accountId, updates), SelectAccountingStandardForTenant(tenantId, accountingStandardCode).
- **AccountingPeriodService:**
  - **Trách nhiệm:** Quản lý vòng đời của Accounting Period (mở, đóng). Thực hiện các quy trình cuối kỳ (ví dụ: chuyển số dư tài khoản doanh thu/chi phí sang tài khoản lợi nhuận giữ lại \- có thể là một loại bút toán đặc biệt được tạo bởi Service này). Phối hợp với AccountingPeriod Repository, GeneralLedger Repository.
  - **Các phương thức tiềm năng:** CreateAccountingPeriod(tenantId, name, startDate, endDate), OpenPeriod(periodId, tenantId), ClosePeriod(periodId, tenantId).
- **FinancialReportingService:**
  - **Trách nhiệm:** Tổng hợp dữ liệu từ Sổ cái và trình bày dưới dạng báo cáo tài chính theo chuẩn mực kế toán của Tenant. Tính toán số dư tài khoản. Phối hợp với GeneralLedger Repository, ChartOfAccounts Repository, AccountingPeriod Repository, LZM Service (để lấy tên tài khoản/mục báo cáo đa ngôn ngữ).
  - **Các phương thức tiềm năng:** GenerateReport(tenantId, periodId, reportType).
- **FAMQueryService (Optional Domain Service):** Nếu logic truy vấn phức tạp (lấy số dư tài khoản theo ngày, truy vấn bút toán theo nhiều tiêu chí), có thể tách ra.
  - **Trách nhiệm:** Cung cấp các phương thức truy vấn dữ liệu từ GL, CoA, Accounting Period. Phối hợp với GeneralLedger Repository, ChartOfAccounts Repository, AccountingPeriod Repository, LZM Service.
  - **Các phương thức tiềm năng:** GetAccountBalance(tenantId, accountId, date), GetJournalEntries(tenantId, criteria), GetChartOfAccounts(tenantId), GetAccountingPeriods(tenantId).

## **9\. Application Services**

Application Services trong FAM là lớp mỏng điều phối các hành động từ bên ngoài (ví dụ: từ API Gateway, Message Broker) đến Domain Model (Aggregate Roots, Domain Services). Chúng xử lý các tác vụ kỹ thuật như lắng nghe Event, xử lý Query, thực hiện ủy quyền, và gọi Domain Service.

- **AccountingTransactionApplicationService:**
  - **Trách nhiệm:** Lắng nghe các Domain Event tài chính từ các BC khác (ví dụ: OrderCompletedEvent, PaymentSuccessfulEvent, BillingTransactionSuccessfulEvent, InventoryDeductedEvent, PayrollProcessedEvent, OrderCancelledEvent, ReturnProcessedEvent, RefundProcessedEvent, PromotionAppliedEvent, MarketingExpenseRecordedEvent, ShippingCostRecordedEvent). Trích xuất dữ liệu cần thiết từ Event payload và gọi AccountingTransactionService.PostTransaction(). Đảm bảo việc xử lý Event là đáng tin cậy.
  - **Các phương thức tiềm năng:** HandleOrderCompletedEvent(event), HandlePaymentSuccessfulEvent(event), HandleBillingTransactionSuccessfulEvent(event), HandleInventoryDeductedEvent(event), HandlePayrollProcessedEvent(event), HandleOrderCancelledEvent(event), HandleReturnProcessedEvent(event), HandleRefundProcessedEvent(event), HandlePromotionAppliedEvent(event), HandleMarketingExpenseRecordedEvent(event), HandleShippingCostRecordedEvent(event).
- **ChartOfAccountsApplicationService:**
  - **Trách nhiệm:** Xử lý các command liên quan đến quản lý CoA từ API (ví dụ: CreateChartOfAccountsCommand, AddAccountToCoACommand, SelectAccountingStandardCommand). Sử dụng ChartOfAccountsService và các Repository tương ứng. Thực hiện ủy quyền với IAM.
  - **Các phương thức tiềm năng:** HandleCreateChartOfAccountsCommand(command), HandleAddAccountToCoACommand(command), HandleSelectAccountingStandardCommand(command).
- **AccountingPeriodApplicationService:**
  - **Trách nhiệm:** Xử lý các command liên quan đến quản lý kỳ kế toán từ API (ví dụ: CreateAccountingPeriodCommand, ClosePeriodCommand). Sử dụng AccountingPeriodService và các Repository tương ứng. Thực hiện ủy quyền với IAM.
  - **Các phương thức tiềm năng:** HandleCreateAccountingPeriodCommand(command), HandleClosePeriodCommand(command).
- **FinancialReportingApplicationService:**
  - **Trách nhiệm:** Xử lý các query để tạo báo cáo tài chính từ API (ví dụ: GetFinancialReportQuery). Sử dụng FinancialReportingService hoặc FAMQueryService. Thực hiện ủy quyền với IAM.
  - **Các phương thức tiềm năng:** HandleGetFinancialReportQuery(query).

## **10\. Domain Events**

Bounded Context FAM tương tác với các Bounded Context khác thông qua việc phát ra và lắng nghe các Domain Event. Dưới đây là danh sách các event mà FAM phát ra và lắng nghe, bao gồm payload dự kiến của chúng:

### **10.1. Domain Events (FAM Phát ra)**

FAM sẽ phát ra các Domain Event quan trọng để thông báo cho các Bounded Context khác (chủ yếu là ALM và có thể là các hệ thống báo cáo/BI) về những thay đổi trạng thái nghiệp vụ trong phạm vi của nó. Dưới đây là danh sách các event và payload dự kiến của chúng:

- **JournalEntryPosted**
  - Phát ra khi một bút toán được ghi nhận thành công vào sổ cái.
  - **Payload:**
    - JournalEntryId (UUID)
    - TenantId (UUID)
    - SourceBoundedContext (String)
    - SourceTransactionId (UUID, optional)
    - TransactionDate (DateTime) **(ở múi giờ UTC)**
    - PostingDate (DateTime) **(ở múi giờ UTC)**
    - Description (String)
    - TotalDebit (Money Value Object)
    - TotalCredit (Money Value Object)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ChartOfAccountsCreated**
  - Phát ra khi một hệ thống tài khoản mới được tạo.
  - **Payload:**
    - CoAId (UUID)
    - TenantId (UUID, optional \- nếu là CoA tùy chỉnh)
    - Name (String)
    - AccountingStandard (AccountingStandard Value Object)
    - IsTemplate (Boolean)
    - CreatedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **AccountAddedToCoA**
  - Phát ra khi một tài khoản được thêm vào CoA.
  - **Payload:**
    - CoAId (UUID)
    - AccountId (UUID)
    - AccountNumber (String)
    - Name (String)
    - AccountType (AccountType Value Object)
    - ParentAccountId (UUID, optional)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **AccountingStandardSelected**
  - Phát ra khi một tổ chức chọn hoặc thay đổi chuẩn mực kế toán/CoA.
  - **Payload:**
    - TenantId (UUID)
    - NewCoAId (UUID)
    - AccountingStandard (AccountingStandard Value Object)
    - SelectedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **AccountingPeriodOpened**
  - Phát ra khi một kỳ kế toán được mở.
  - **Payload:**
    - PeriodId (UUID)
    - TenantId (UUID)
    - Name (String)
    - StartDate (DateTime) **(ở múi giờ UTC)**
    - EndDate (DateTime) **(ở múi giờ UTC)**
    - OpenedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **AccountingPeriodClosed**
  - Phát ra khi một kỳ kế toán được đóng.
  - **Payload:**
    - PeriodId (UUID)
    - TenantId (UUID)
    - Name (String)
    - ClosedAt (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **FinancialReportGenerated**
  - Phát ra khi một báo cáo tài chính được tạo thành công (nếu cần thông báo tự động hoặc lưu trữ).
  - **Payload:**
    - ReportId (UUID)
    - TenantId (UUID)
    - PeriodId (UUID)
    - ReportType (FinancialReportType Value Object)
    - GeneratedByUserId (UUID, optional)
    - GeneratedAt (DateTime) **(ở múi giờ UTC)**
    - FileAssetId (UUID, optional \- nếu lưu report dưới dạng file trong DAM)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**

### **10.2. Domain Events Được Xử lý (Consumed Domain Events)**

FAM lắng nghe và xử lý các Domain Event từ các Bounded Context khác khi các sự kiện đó có ảnh hưởng tài chính. Dưới đây là danh sách các event dự kiến mà FAM lắng nghe và mục đích xử lý của chúng:

- **OrderCompletedEvent** (Từ ODM)
  - **Mục đích xử lý:** Ghi nhận doanh thu, giá vốn hàng bán, và các khoản phải thu/tiền mặt liên quan đến đơn hàng.
  - **Payload dự kiến:** (Thông tin cần thiết để tạo bút toán, ví dụ:)
    - OrderId (UUID)
    - TenantId (UUID)
    - CompletionDate (DateTime) **(ở múi giờ UTC)**
    - TotalRevenue (Money Value Object)
    - TotalCostOfGoodsSold (Money Value Object)
    - RelevantExpenses (List of Money Value Object with Expense Type)
    - PaymentMethod (String \- để xác định tài khoản Nợ)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **OrderCancelledEvent** (Từ ODM)
  - **Mục đích xử lý:** Tạo bút toán điều chỉnh nếu doanh thu/giá vốn đã được ghi nhận trước đó.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - OrderId (UUID)
    - TenantId (UUID)
    - CancellationDate (DateTime) **(ở múi giờ UTC)**
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ReturnProcessedEvent** (Từ OSM/ODM)
  - **Mục đích xử lý:** Ghi nhận giảm doanh thu, nhập kho hàng trả lại.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - ReturnId (UUID)
    - TenantId (UUID)
    - ProcessDate (DateTime) **(ở múi giờ UTC)**
    - RefundAmount (Money Value Object, optional)
    - ReturnedItemsValue (Money Value Object \- giá trị hàng trả lại theo giá vốn)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **PaymentSuccessfulEvent** (Từ PPM)
  - **Mục đích xử lý:** Ghi nhận khoản tiền đã thu vào tài khoản tiền mặt/ngân hàng.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - PaymentTransactionId (UUID)
    - TenantId (UUID)
    - PaymentDate (DateTime) **(ở múi giờ UTC)**
    - Amount (Money Value Object)
    - PaymentMethod (String)
    - SourceTransactionId (UUID, optional \- Order ID, Invoice ID)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **RefundProcessedEvent** (Từ PPM)
  - **Mục đích xử lý:** Ghi nhận khoản tiền đã hoàn trả.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - RefundTransactionId (UUID)
    - TenantId (UUID)
    - RefundDate (DateTime) **(ở múi giờ UTC)**
    - Amount (Money Value Object)
    - PaymentMethod (String)
    - SourceTransactionId (UUID, optional \- Order ID, Return ID)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **BillingTransactionSuccessfulEvent** (Từ BUM)
  - **Mục đích xử lý:** Ghi nhận doanh thu từ gói dịch vụ/usage.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - BillingTransactionId (UUID)
    - TenantId (UUID)
    - TransactionDate (DateTime) **(ở múi giờ UTC)**
    - Amount (Money Value Object)
    - Description (String \- loại giao dịch: Subscription, Usage)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **InventoryReceivedEvent** (Từ ICM)
  - **Mục đích xử lý:** Ghi nhận giá trị hàng nhập kho (tăng tài sản tồn kho).
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - InventoryReceiptId (UUID)
    - TenantId (UUID)
    - ReceiptDate (DateTime) **(ở múi giờ UTC)**
    - TotalValue (Money Value Object \- giá trị hàng nhập kho)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **InventoryDeductedEvent** (Từ ICM)
  - **Mục đích xử lý:** Ghi nhận giá vốn hàng bán (giảm tài sản tồn kho, tăng chi phí giá vốn).
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - InventoryDeductionId (UUID)
    - TenantId (UUID)
    - DeductionDate (DateTime) **(ở múi giờ UTC)**
    - TotalCostOfGoodsSold (Money Value Object)
    - RelatedOrderId (UUID, optional)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **PayrollProcessedEvent** (Từ HRM/Hệ thống tính lương)
  - **Mục đích xử lý:** Ghi nhận chi phí lương và các khoản phải trả liên quan.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - PayrollRunId (UUID)
    - TenantId (UUID)
    - PeriodStartDate (DateTime) **(ở múi giờ UTC)**
    - PeriodEndDate (DateTime) **(ở múi giờ UTC)**
    - TotalGrossPay (Money Value Object)
    - TotalDeductions (Money Value Object)
    - TotalNetPay (Money Value Object)
    - EmployerTaxExpense (Money Value Object)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **PromotionAppliedEvent** (Từ MPM)
  - **Mục đích xử lý:** Ghi nhận chi phí chiết khấu/giảm giá (ảnh hưởng đến doanh thu ròng hoặc chi phí bán hàng).
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - PromotionUsageId (UUID)
    - TenantId (UUID)
    - UsageDate (DateTime) **(ở múi giờ UTC)**
    - DiscountAmount (Money Value Object)
    - RelatedTransactionId (UUID \- Order ID, Billing Transaction ID)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **MarketingExpenseRecordedEvent** (Từ MPM)
  - **Mục đích xử lý:** Ghi nhận chi phí marketing.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - MarketingActivityId (UUID)
    - TenantId (UUID)
    - ExpenseDate (DateTime) **(ở múi giờ UTC)**
    - Amount (Money Value Object)
    - ExpenseType (String \- ví dụ: "Advertising", "Campaign Cost")
    - IssuedAt (DateTime) **(ở múi giờ UTC)**
- **ShippingCostRecordedEvent** (Từ SFM)
  - **Mục đích xử lý:** Ghi nhận chi phí vận chuyển.
  - **Payload dự kiến:** (Thông tin cần thiết, ví dụ:)
    - ShippingTransactionId (UUID)
    - TenantId (UUID)
    - ShippingDate (DateTime) **(ở múi giờ UTC)**
    - CostAmount (Money Value Object)
    - RelatedOrderId (UUID)
    - IssuedAt (DateTime) **(ở múi giờ UTC)**

_(Lưu ý: Danh sách các sự kiện được xử lý có thể được mở rộng tùy thuộc vào các quy trình nghiệp vụ cụ thể trong hệ thống Ecoma có ảnh hưởng tài chính.)_

## **11\. Ranh giới Nghiệp vụ**

Ranh giới của Bounded Context FAM được xác định bởi trách nhiệm quản lý hệ thống tài khoản kế toán, ghi nhận các giao dịch tài chính vào sổ cái, quản lý kỳ kế toán và tạo báo cáo tài chính dựa trên các chuẩn mực kế toán khác nhau. FAM là nguồn sự thật về dữ liệu kế toán tài chính tổng hợp của tổ chức.

FAM không chịu trách nhiệm:

- **Xác thực danh tính người dùng:** Chỉ sử dụng dịch vụ của IAM.
- **Quản lý quyền truy cập:** Chỉ sử dụng dịch vụ của IAM. IAM kiểm soát quyền của người dùng (kế toán viên, quản lý tài chính, kiểm toán viên) trong FAM.
- **Quản lý bản dịch văn bản hoặc quy tắc định dạng locale:** Chỉ sử dụng dịch vụ của LZM và RDM.
- **Ghi nhận audit logs:** Chỉ phát sự kiện cho ALM.
- **Xử lý các giao dịch nghiệp vụ gốc:** FAM không xử lý việc tạo đơn hàng, xử lý thanh toán, quản lý tồn kho, tính lương, v.v. Nó chỉ nhận dữ liệu tài chính từ các BC chuyên biệt đó.
- **Tính toán lương chi tiết và thuế:** Chỉ nhận dữ liệu tổng hợp từ các hệ thống chuyên biệt.
- **Kê khai và nộp thuế:** Đây là một quy trình nghiệp vụ riêng, có thể cần dữ liệu từ FAM nhưng không thuộc trách nhiệm của FAM.
- **Quản lý chi tiết công nợ phải thu/phải trả:** FAM ghi nhận tổng hợp vào các tài khoản công nợ trên sổ cái. Việc quản lý chi tiết từng hóa đơn, theo dõi thanh toán từng khoản nợ thuộc về các BC nghiệp vụ (OSM, SFM, CRM) hoặc một BC chuyên biệt cho Accounts Receivable/Payable.
- **Quản lý tài sản cố định chi tiết:** Việc theo dõi từng tài sản, tính khấu hao chi tiết có thể thuộc về một BC Fixed Asset Management riêng. FAM chỉ nhận bút toán tổng hợp về khấu hao và giá trị tài sản.
- **Quản lý các miền nghiệp vụ khác** như sản phẩm, khách hàng, nhân sự, vận chuyển, đào tạo, quản lý công việc.
- **Xử lý các quy trình thanh toán thực tế:** Thuộc về PPM.

## **12\. Kết luận**

Bounded Context Financial Accounting Management (FAM) là một thành phần cốt lõi quan trọng, quản lý các khía cạnh kế toán tài chính của nền tảng Ecoma. Bằng cách tập trung trách nhiệm quản lý hệ thống tài khoản, ghi nhận giao dịch và tạo báo cáo tài chính vào một Context duy nhất, đồng thời hỗ trợ linh hoạt các chuẩn mực kế toán khác nhau (IFRS, VAS), FAM cung cấp một nền tảng đáng tin cậy và tuân thủ cho dữ liệu tài chính của tổ chức khách hàng. Việc thiết kế FAM với mô hình domain rõ ràng, các khía cạnh quan trọng của miền được làm rõ, tương tác được định nghĩa và các sự kiện nghiệp vụ phù hợp (bao gồm cả sự kiện lắng nghe) là nền tảng để xây dựng một hệ thống kế toán mạnh mẽ và dễ mở rộng, đáp ứng nhu cầu đa dạng về chuẩn mực báo cáo.

Tài liệu này cung cấp cái nhìn tổng quan chi tiết về FAM, bao gồm mô hình domain, các khía cạnh quan trọng của miền, tương tác, use cases, Domain Service, Application Service và Domain Event (phát ra và lắng nghe với payload dự kiến). Đây là nền tảng để chuyển sang giai đoạn thiết kế kỹ thuật chi tiết và triển khai Microservice FAM.
