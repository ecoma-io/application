# **Tài liệu Thiết kế Miền: Bounded Context Billing & Usage Management (BUM)**

## **1\. Giới thiệu**

Tài liệu này cung cấp mô tả chi tiết về Bounded Context **Billing & Usage Management (BUM)** trong hệ thống Ecoma. BUM là một trong những Bounded Context cốt lõi (Core Bounded Context), đóng vai trò quan trọng trong việc quản lý toàn bộ các khía cạnh liên quan đến thanh toán, gói dịch vụ (subscription) và quyền sử dụng (entitlement) của các tổ chức (tenant) trên nền tảng SaaS trả trước của Ecoma.

Việc hiểu rõ vai trò, trách nhiệm, mô hình domain và tương tác của BUM là cần thiết để thiết kế và phát triển các thành phần liên quan một cách chính xác, đảm bảo tính nhất quán và tuân thủ các nguyên tắc của Domain-Driven Design.

## **2\. Phạm vi của Tài liệu**

Tài liệu này tập trung vào việc định nghĩa và mô tả Bounded Context BUM ở cấp độ thiết kế miền (domain design), cung cấp đủ chi tiết để hỗ trợ việc thiết kế các Domain Service và Application Service, dựa trên mô hình kinh doanh **trả trước, không hoàn tiền, không hủy gói sau mua, chỉ có nâng cấp (không hạ cấp giữa chu kỳ), giá đã bao gồm thuế, gói Free Forever, hạn mức sử dụng cứng, và chính sách gia hạn/hết hạn/xóa dữ liệu cụ thể** của Ecoma. Cụ thể, tài liệu này bao gồm:

- Xác định **vai trò và trách nhiệm chính** của BUM, làm rõ các chức năng cốt lõi như quản lý cấu trúc giá, quản lý Subscription, xử lý giao dịch, theo dõi Usage, quản lý Entitlement và xử lý trạng thái dịch vụ.
- Mô tả các **khái niệm và thực thể cốt lõi trong mô hình domain** của BUM ở cấp độ chi tiết hơn, bao gồm định nghĩa các Aggregate Root (Subscription, PricingPlan, BillingTransaction, Invoice), Entity (UsageRecord, Entitlement, InvoiceItem) và Value Object (Money, Duration, UsageQuantity, FeatureType, ResourceType, SubscriptionStatus, TransactionStatus, BillingCyclePeriod, PricingComponent, Address) với các thuộc tính chính và hành vi (Behavior), có tính đến đặc thù của gói Free Forever.
- Định nghĩa **Ngôn ngữ Chung (Ubiquitous Language)** trong phạm vi BUM, đảm bảo sự hiểu biết nhất quán về các thuật ngữ nghiệp vụ chính.
- Làm rõ các **tương tác chính giữa BUM và các Bounded Context khác**, bao gồm cả Core BCs (IAM, NDM, LZM, RDM, ALM) và Feature BCs (Operations Group, FAM, Admin Group, Data Retention BC), mô tả vai trò của BUM trong các luồng tương tác này.
- Mô tả các **use case chính** có sự tham gia của BUM, tập trung vào actor, mục đích và các Domain/Application Service liên quan, bao gồm các luồng nghiệp vụ như đăng ký gói Free, mua/nâng cấp gói trả phí, ghi nhận usage, kiểm soát hạn mức, và xử lý hết hạn/tạm ngưng/xóa dữ liệu, cũng như các use case liên quan đến truy vấn và quản lý dữ liệu.
- Xác định **ranh giới nghiệp vụ** của BUM, làm rõ những gì thuộc phạm vi trách nhiệm của BUM và những gì không, đặc biệt là mối quan hệ với IAM (ủy quyền), **Payment Gateways** và các BC sở hữu dữ liệu (xóa dữ liệu).
- Đề xuất các **Domain Service và Application Service tiềm năng** trong BUM, mô tả trách nhiệm chính của từng service trong việc điều phối logic nghiệp vụ và xử lý các yêu cầu từ bên ngoài.
- Làm rõ các **quy tắc nghiệp vụ cụ thể** liên quan đến mô hình kinh doanh trả trước, bao gồm Logic Tính toán Pro-rata, Vòng đời Trạng thái Subscription và Chính sách Xóa dữ liệu, Kiểm soát Hạn mức Sử dụng (Hạn mức cứng), và Chính sách Cập nhật Pricing Plan.
- Liệt kê và mô tả các **Domain Events** mà BUM tương tác, được chia thành các sự kiện BUM **phát ra** (Published Events) và các sự kiện BUM **lắng nghe và xử lý** (Consumed Events), bao gồm payload dự kiến của từng event.

Tài liệu này **không** đi sâu vào các chi tiết kỹ thuật triển khai cụ thể. Các khíaAspect sau **không** nằm trong phạm vi của tài liệu này:

- Chi tiết cài đặt kỹ thuật của Microservice BUM (ngôn ngữ lập trình, framework, kiến trúc nội bộ chi tiết).
- Cấu trúc cơ sở dữ liệu chi tiết (schema) của BUM.
- Các quyết định công nghệ cụ thể bên trong BUM (ví dụ: sử dụng Payment Gateway nào).
- Luồng dữ liệu chi tiết đến cấp độ từng trường thông tin giữa BUM và các BC khác.
- Cấu hình hạ tầng triển khai cụ thể cho BUM.
- Thiết kế giao diện người dùng liên quan đến BUM.

## **3\. Vai trò và Trách nhiệm Chính**

Bounded Context BUM chịu trách nhiệm quản lý vòng đời tài chính và quyền sử dụng của khách hàng theo mô hình trả trước. Các trách nhiệm chính bao gồm:

- **Định nghĩa và Quản lý Cấu trúc Giá:** Cho phép định nghĩa các kế hoạch giá (Pricing Plans) linh hoạt, bao gồm cả gói Free Forever. Giá niêm yết đã bao gồm thuế và chỉ áp dụng cho việc mua mới hoặc mua thêm tài nguyên mới. **Việc quản lý Pricing Plan được thực hiện thông qua giao diện Admin UI.**
- **Quản lý Subscription:** Quản lý trạng thái (Active, Suspended) và cấu hình chi tiết của từng Subscription. Mỗi Subscription liên kết với một kế hoạch giá cụ thể và có các thông tin về thời gian bắt đầu/kết thúc, hạn mức sử dụng. **Không hỗ trợ hủy gói sau khi mua gói trả phí.**
- **Xử lý Giao dịch Mua/Gia hạn/Nâng cấp/Mua thêm (Trả trước):** Tiếp nhận yêu cầu và xử lý các giao dịch liên quan đến việc mua mới, gia hạn hoặc mua thêm các gói dịch vụ/tài nguyên. **Việc kích hoạt hoặc gia hạn Subscription chỉ xảy ra sau khi thanh toán thành công.** Bao gồm cả việc tính toán giá pro-rata khi mua thêm hoặc nâng cấp gói giữa chu kỳ theo logic đã định nghĩa (chỉ phát sinh số tiền cần thanh toán thêm).
- **Tích hợp Kênh Thanh toán:** **BUM chịu trách nhiệm tích hợp trực tiếp với các Payment Gateways để xử lý các giao dịch thanh toán cho các Subscription SaaS.**
- **Theo dõi và Ghi nhận Sử dụng (Usage Tracking):** Nhận dữ liệu về mức độ sử dụng tài nguyên thực tế từ các Bounded Context khác. Ghi nhận và tích lũy dữ liệu sử dụng này theo từng Subscription.
- **Quản lý Hạn mức và Quyền lợi (Entitlement Management):** Dựa trên kế hoạch giá của Subscription, xác định các hạn mức sử dụng tài nguyên (Usage Limits \- hạn mức cứng) và các quyền lợi tính năng (Feature Entitlements) mà tổ chức được phép sử dụng. Cung cấp thông tin này cho các BC khác (đặc biệt là IAM) để kiểm soát quyền truy cập.
- **Quản lý Vòng đời Subscription Sau Hết hạn:** Tự động hoặc theo yêu cầu xử lý các thay đổi trạng thái của Subscription dựa trên thời gian (hết hạn) hoặc việc thanh toán (thành công/thất bại). Bao gồm cả quy trình xử lý khi hết hạn, chuyển sang trạng thái Suspended, và kích hoạt quy trình xóa dữ liệu sau 45 ngày ở trạng thái Suspended.
- **Phát Sự kiện Nghiệp vụ:** Phát ra các Sự kiện Nghiệp vụ quan trọng khi có thay đổi về trạng thái Subscription, quyền lợi tính năng, hoặc các giao dịch thanh toán/sử dụng được ghi nhận.

## **4\. Mô hình Domain (Chi tiết hơn)**

Trong phạm vi Bounded Context BUM, chúng ta xác định các Aggregate Root, Entity và Value Object cốt lõi với các thuộc tính chính (có thể thay đổi trong quá trình thiết kế chi tiết):

**Aggregate Roots:**

- **Subscription:**
  - **ID:** Unique identifier (UUID).
  - **TenantId:** ID của tổ chức sở hữu Subscription (liên kết với IAM).
  - **PricingPlanId:** ID của Pricing Plan mà Subscription này dựa trên.
  - **PricingPlanVersion:** Phiên bản của Pricing Plan được áp dụng cho Subscription này.
  - **Status:** Trạng thái hiện tại (SubscriptionStatus Value Object: Active, Suspended, DeletionRequested, Deleted).
  - **StartDate:** Ngày bắt đầu của chu kỳ thanh toán hiện tại.
  - **EndDate:** Ngày kết thúc của chu kỳ thanh toán hiện tại (23:59 ngày cuối cùng).
  - **NextBillingDate:** Ngày thanh toán tiếp theo (chỉ áp dụng cho gói có chu kỳ).
  - **BillingCycle:** Chu kỳ thanh toán (Duration Value Object: Monthly, Annually, Free Forever, etc.).
  - **UsageLimits:** Danh sách các hạn mức sử dụng tài nguyên (Entitlement Entities).
  - **FeatureEntitlements:** Danh sách các quyền lợi tính năng (Entitlement Entities).
  - **UsageRecords:** Danh sách các bản ghi sử dụng trong chu kỳ hiện tại (UsageRecord Entities).
  - **LastSuccessfulPaymentDate:** Ngày thanh toán thành công gần nhất.
  - **SuspendedDate:** Ngày chuyển sang trạng thái Suspended (nếu có).
  - **DataRetentionEndDate:** Ngày kết thúc thời gian giữ lại dữ liệu (45 ngày sau SuspendedDate).
  - **CreatedAt:** Thời điểm tạo.
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng.
  - _Behavior:_ Activate, Renew, Suspend, RecordUsage, CheckEntitlement, TriggerDataDeletion.
- **PricingPlan:**
  - **ID:** Unique identifier (UUID).
  - **Name:** Tên gói dịch vụ (ví dụ: "Free", "Basic", "Pro", "Enterprise").
  - **Description:** Mô tả chi tiết gói.
  - **BasePrice:** Giá cơ bản của gói (Money Value Object). **Đã bao gồm thuế.**
  - **BillingCycle:** Chu kỳ thanh toán mặc định (Duration Value Object).
  - **ResourceComponents:** Danh sách các thành phần tài nguyên và quy tắc tính giá/hạn mức (PricingComponent Value Object).
  - **FeatureComponents:** Danh sách các tính năng đi kèm (FeatureType Value Object).
  - **IsActive:** Trạng thái hoạt động của Pricing Plan.
  - **IsFreePlan:** Boolean chỉ định đây là gói Free Forever.
  - **CreatedAt:** Thời điểm tạo.
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng.
  - **Version:** Phiên bản của Pricing Plan (Integer).
  - _Behavior:_ DefineResourceComponent, DefineFeatureComponent, Activate, Deactivate, CreateNewVersion.
- **BillingTransaction:**
  - **ID:** Unique identifier (UUID).
  - **SubscriptionId:** ID của Subscription liên quan.
  - **TenantId:** ID của tổ chức.
  - **Type:** Loại giao dịch (ví dụ: "Purchase", "Renewal", "AddOn"). **Không có loại "Refund".**
  - **Amount:** Số tiền giao dịch (Money Value Object). **Đã bao gồm thuế.**
  - **TransactionDate:** Ngày xảy ra giao dịch.
  - **Status:** Trạng thái giao dịch (TransactionStatus Value Object: Pending, Successful, Failed). **Không có trạng thái "Refunded".**
  - **PaymentGatewayTransactionId:** ID giao dịch từ cổng thanh toán (lưu trữ để tra cứu).
  - **InvoiceId:** ID of the Invoice liên quan.
  - **CreatedAt:** Thời điểm tạo.
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng.
  - _Behavior:_ MarkAsSuccessful, MarkAsFailed.
- **Invoice:**
  - **ID:** Unique identifier (UUID).
  - **TenantId:** ID của tổ chức.
  - **InvoiceNumber:** Số hóa đơn.
  - IssueDate: Ngày phát hành.
  - InvoiceDate: Ngày hóa đơn (thường trùng với IssueDate hoặc ngày thanh toán thành công).
  - **DueDate:** Ngày đáo hạn.
  - **TotalAmount:** Tổng số tiền (Money Value Object). **Đã bao gồm thuế.**
  - **Status:** Trạng thái hóa đơn (ví dụ: "Issued", "Paid", "Overdue").
  - **InvoiceItems:** Danh sách các mục hóa đơn (InvoiceItem Entities).
  - **BillingTransactionId:** ID of the Billing Transaction thành công liên quan. **Mối quan hệ 1-1: Một Invoice được tạo cho một Billing Transaction thành công duy nhất.**
  - **CreatedAt:** Thời điểm tạo.
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng.
  - _Behavior:_ AddItem, CalculateTotal, MarkAsPaid.

**Entities (thuộc về các Aggregate Root):**

- **UsageRecord (thuộc Subscription):**
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root.
  - **ResourceType:** Loại tài nguyên (ResourceType Value Object).
  - **Quantity:** Số lượng sử dụng hiện tại (UsageQuantity Value Object).
  - **BillingCyclePeriod:** Chu kỳ thanh toán mà bản ghi này thuộc về (BillingCyclePeriod Value Object).
  - **LastUpdated:** Thời điểm cập nhật cuối cùng.
  - _Behavior:_ IncrementQuantity.
- **Entitlement (thuộc Subscription):**
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root.
  - **Type:** Loại quyền lợi (Feature hoặc Resource).
  - **FeatureType:** Loại tính năng (FeatureType Value Object) \- chỉ dùng nếu Type là Feature.
  - **ResourceType:** Loại tài nguyên (ResourceType Value Object) \- chỉ dùng nếu Type là Resource.
  - **Limit:** Hạn mức sử dụng (UsageQuantity Value Object) \- chỉ dùng nếu Type là Resource.
  - **IsActive:** Trạng thái hoạt động của quyền lợi.
  - _Behavior:_ CheckIfAllowed (cho Feature), CheckIfWithinLimit (for Resource).
- **InvoiceItem (thuộc Invoice):**
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root.
  - **Description:** Mô tả mục (ví dụ: "Gói Pro hàng tháng", "500 đơn hàng thêm").
  - **Quantity:** Số lượng.
  - **UnitPrice:** Đơn giá (Money Value Object). **Đã bao gồm thuế.**
  - **LineTotal:** Tổng tiền dòng (Money Value Object). **Đã bao gồm thuế.**
  - **RelatedResourceId:** ID of the related resource/package (e.g., Subscription ID, Add-on ID).

**Value Objects:**

- **Money:**
  - **Amount:** Giá trị số (Decimal).
  - **Currency:** Mã tiền tệ (ví dụ: "VND", "USD").
- **Duration:**
  - **Value:** Giá trị số.
  - **Unit:** Đơn vị thời gian (ví dụ: "Day", "Month", "Year", "Forever").
- **UsageQuantity:**
  - **Value:** Giá trị số (Long/Decimal).
  - **Unit:** Đơn vị đo (ví dụ: "Orders", "Products", "GB").
- **FeatureType:**
  - **Value:** Chuỗi định danh tính năng.
- **ResourceType:**
  - **Value:** Chuỗi định danh loại tài nguyên.
- **SubscriptionStatus:**
  - **Value:** Chuỗi hoặc Enum (Active, Suspended, DeletionRequested, Deleted).
- **TransactionStatus:**
  - **Value:** Chuỗi hoặc Enum (Pending, Successful, Failed).
- **BillingCyclePeriod:**
  - **StartDate:** Ngày bắt đầu.
  - **EndDate:** Ngày kết thúc.
  - **Timezone:** Múi giờ của tổ chức áp dụng cho chu kỳ này (String, ví dụ: "Asia/Ho_Chi_Minh").
- **PricingComponent:**
  - **Type:** Loại thành phần (مثال: "Base", "Resource", "Feature").
  - **Details:** Chi tiết cụ thể tùy loại (ví dụ: ResourceType, UsageLimit, PricePerUnit, FeatureType).
- **Address:** (Nếu cần lưu địa chỉ thanh toán chi tiết)
  - **Street:**
  - **City:**
  - **Country:** (liên kết với RDM)
  - **PostalCode:**

## **5\. Ngôn ngữ Chung (Ubiquitous Language)**

Trong Bounded Context BUM, các thuật ngữ sau đây có ý nghĩa cụ thể và nhất quán:

- **Pricing Plan:** Cấu hình định nghĩa một gói dịch vụ hoặc tài nguyên có thể mua. Bao gồm cả gói Free Forever.
- **Free Forever Plan:** Một loại Pricing Plan đặc biệt không có thời hạn và không yêu cầu thanh toán.
- **Subscription:** Quyền sử dụng dịch vụ của một tổ chức trong một khoảng thời gian, dựa trên một Pricing Plan.
- **Entitlement:** Quyền lợi cụ thể (tính năng hoặc hạn mức) mà một Subscription mang lại.
- **Usage:** Mức độ sử dụng thực tế của một tài nguyên bởi một tổ chức.
- **Usage Limit:** Hạn mức tối đa được phép sử dụng của một tài nguyên trong một chu kỳ của Subscription (áp dụng cho các gói có giới hạn). **Là hạn mức cứng.**
- **Billing Cycle:** Chu kỳ thanh toán của một Subscription (ví dụ: hàng tháng, hàng năm). Gói Free Forever có chu kỳ "Forever".
- **Feature Entitlement:** Quyền được sử dụng một tính năng cụ thể.
- **Resource Entitlement:** Hạn mức sử dụng một loại tài nguyên cụ thể.
- **Suspended:** Trạng thái tạm ngưng dịch vụ do hết hạn và không gia hạn trong thời gian Data Retention Period.
- **Billing Transaction:** Một bản ghi về giao dịch tài chính (mua, gia hạn, mua thêm). Luôn là trả trước.
- **Invoice:** Bản ghi chi tiết về các khoản phí cần thanh toán. Giá trên Invoice đã bao gồm thuế. **Một Invoice tương ứng với một Billing Transaction thành công.**
- **Add-on:** Việc mua thêm số lượng cho các tài nguyên đã có sẵn trong gói chính (ví dụ: users, storage).
- **Payment Gateway:** Dịch vụ bên ngoài được BUM tích hợp để xử lý các giao dịch thanh toán thực tế.

## **6\. Tương tác với các Bounded Context khác**

BUM tương tác với nhiều Bounded Context khác trong hệ thống Ecoma, cả Core và Feature, thông qua cả mô hình bất đồng bộ (Event-Driven) và đồng bộ (Request/Reply).

- **Tương tác với Core BCs:**
  - **IAM:** BUM cần thông tin về Tổ chức (Tenant) từ IAM để liên kết Subscription với đúng khách hàng, bao gồm cả múi giờ của tổ chức. IAM phát sự kiện khi Tổ chức mới được tạo, BUM lắng nghe để tự động tạo Subscription cho gói Free Forever. BUM cung cấp thông tin về quyền lợi tính năng (Entitlement) và trạng thái Subscription (đặc biệt là Suspended) cho IAM để IAM thực thi kiểm tra quyền truy cập (hạn mức cứng, tạm ngưng) ở API Gateway hoặc trong các dịch vụ. BUM cũng cần thông tin về người dùng từ IAM cho các mục đích quản lý nội bộ hoặc báo cáo.
  - **NDM:** BUM phát sự kiện khi có các thay đổi trạng thái Subscription quan trọng (ví dụ: sắp hết hạn, đã hết hạn/tạm ngưng, gia hạn thành công, sắp hết thời gian giữ lại dữ liệu, đã xóa dữ liệu), yêu cầu NDM gửi thông báo cho người dùng hoặc tổ chức theo lịch trình đã định nghĩa.
  - **LZM & RDM:** BUM cần LZM để bản địa hóa các thông tin hiển thị liên quan đến thanh toán, gói dịch vụ, usage trong giao diện quản trị hoặc báo cáo. BUM gọi LZM để tra cứu bản dịch và định dạng dữ liệu (số, tiền tệ, ngày giờ). LZM sẽ gọi RDM để lấy các quy tắc định dạng locale. BUM cũng gọi trực tiếp RDM để tra cứu các dữ liệu tham chiếu như danh sách tiền tệ, quốc gia khi cần xác thực cấu hình hoặc hiển thị thông tin.
  - **ALM:** BUM phát ra các sự kiện audit log khi có các hành động quan trọng được thực hiện (ví dụ: thay đổi Pricing Plan, tạo/kích hoạt/gia hạn/tạm ngưng Subscription, ghi nhận giao dịch thanh toán/usage, kích hoạt xóa dữ liệu).
- **Tương tác với Feature BCs:**
  - **Operations Group (OSM, ODM, SFM, ICM):** Các BC trong nhóm này là nguồn phát ra dữ liệu Usage. Ví dụ: ODM phát sự kiện "OrderCompleted" chứa thông tin về số lượng đơn hàng, ICM phát sự kiện "InventoryItemAdded" hoặc "InventoryItemDeducted". BUM lắng nghe các sự kiện này để ghi nhận Usage Record cho từng loại tài nguyên tương ứng.
  - **DAM:** DAM phát sự kiện khi asset được tạo (ví dụ: AssetCreatedEvent). BUM lắng nghe event này để ghi nhận Usage cho tài nguyên "Asset" hoặc "Storage".
  - **PPM:** **PPM được sử dụng cho các loại thanh toán không liên quan đến Subscription SaaS. BUM tích hợp trực tiếp với Payment Gateways cho các giao dịch mua/gia hạn/mua thêm Subscription SaaS.**
  - **FAM:** BUM phát sự kiện về các giao dịch thanh toán (Billing Transaction) và các sự kiện liên quan đến doanh thu từ gói dịch vụ/usage để FAM ghi nhận vào sổ cái và tạo báo cáo tài chính. **Lưu ý: Số tiền đã bao gồm thuế.**
  - **Admin Group (PIM, DAM, CRM, WPM, MPM):** Các BC này có thể cần kiểm tra quyền lợi tính năng (Entitlement) thông qua IAM, mà thông tin Entitlement được cung cấp bởi BUM. IAM sẽ kiểm tra Entitlement và trạng thái Subscription (Active/Suspended) để cho phép hay từ chối hành động. BUM có thể cần thông báo cho các BC này (qua event) khi một Tổ chức bị tạm ngưng để họ có thể thực hiện các hành động cần thiết (ví dụ: chặn tạo sản phẩm mới trong PIM). BUM cung cấp các API cho Admin Group để quản lý Pricing Plans.
  - **Data Retention/Archiving BC (Tiềm năng):** Nếu có một BC chịu trách nhiệm quản lý vòng đời dữ liệu, BUM sẽ phát sự kiện hoặc gửi command đến BC này để yêu cầu xóa dữ liệu của Tổ chức sau 45 ngày ở trạng thái Suspended. Nếu không có BC riêng, BUM sẽ tự quản lý việc này hoặc phối hợp trực tiếp với các BC sở hữu dữ liệu (ví dụ: gửi command đến PIM, ODM, DAM...). Giả định hiện tại là BUM sẽ phát sự kiện để các BC khác tự xử lý việc xóa dữ liệu của họ.

## **7\. Các Khía cạnh Quan trọng của Miền BUM**

Phần này mô tả các quy tắc, cấu trúc và khái niệm nghiệp vụ quan trọng chi phối hoạt động của Bounded Context BUM, đặc biệt liên quan đến mô hình kinh doanh trả trước.

**Lưu ý về Múi giờ Tổ chức:** Múi giờ của Tổ chức là thông tin quan trọng được sử dụng trong BUM để tính toán chính xác các mốc thời gian liên quan đến chu kỳ thanh toán (StartDate, EndDate, SuspendedDate, DataRetentionEndDate) và logic Pro-rata. Thông tin múi giờ này được lấy từ IAM và cần được sử dụng nhất quán trong tất cả các tính toán và hiển thị thời gian trong BUM.

### **7.1. Logic Tính toán Pro-rata (Đề xuất đơn giản)**

Logic tính toán Pro-rata được áp dụng khi một Tổ chức đang sử dụng một gói trả phí và quyết định chuyển sang một gói trả phí khác (nâng cấp) hoặc mua thêm tài nguyên giữa chu kỳ thanh toán hiện tại. Mục tiêu là tính toán số tiền cần thanh toán thêm hoặc số lượng tài nguyên được bổ sung một cách đơn giản và dễ hiểu.

**Nguyên tắc:** Tính toán dựa trên số ngày còn lại của chu kỳ thanh toán hiện tại, sử dụng múi giờ của tổ chức. Chu kỳ thanh toán được tính từ ngày bắt đầu đến ngày kết thúc (bao gồm cả ngày bắt đầu và ngày kết thúc). Ngày chuyển đổi gói sẽ là ngày bắt đầu tính Pro-rata.

**Công thức đề xuất:**

- **Khi Nâng cấp gói:**
  - **Số ngày còn lại của chu kỳ hiện tại:** EndDate (ngày cuối cùng của chu kỳ hiện tại) \- Ngày chuyển đổi gói \+ 1 ngày (Tính theo múi giờ của tổ chức)
  - **Tổng số ngày của chu kỳ gói cũ:** EndDate gói cũ \- StartDate gói cũ \+ 1 ngày (Tính theo múi giờ của tổ chức)
  - **Tổng số ngày của chu kỳ gói mới:** EndDate gói mới (nếu bắt đầu từ ngày chuyển đổi gói) \- Ngày chuyển đổi gói \+ 1 ngày (hoặc dựa vào Billing Cycle của gói mới) (Tính theo múi giờ của tổ chức)
  - **Giá trị gói cũ tương ứng với thời gian còn lại:** (Giá gói cũ / Tổng số ngày của chu kỳ gói cũ) \* Số ngày còn lại của chu kỳ hiện tại
  - **Giá trị gói mới tương ứng với thời gian còn lại:** (Giá gói mới / Tổng số ngày của chu kỳ gói mới) \* Số ngày còn lại của chu kỳ hiện tại
  - **Số tiền cần thanh toán thêm:** Giá trị gói mới tương ứng với thời gian còn lại \- Giá trị gói cũ tương ứng với thời gian còn lại

_Lưu ý:_ Trong mô hình kinh doanh hiện tại của Ecoma (chỉ nâng cấp, không hạ cấp giữa chu kỳ), kết quả của phép tính này luôn là số không âm.

- **Khi Mua thêm tài nguyên (Add-on):**
  - **Add-on áp dụng cho các loại tài nguyên đã có sẵn trong gói chính (ví dụ: users, storage).**
  - Giả định Add-on có giá cố định cho một chu kỳ nhất định (ví dụ: 500 đơn hàng thêm giá X cho 1 tháng). Chu kỳ của Add-on thường được đồng bộ với chu kỳ của gói chính.
  - **Số ngày còn lại của chu kỳ gói chính:** EndDate gói chính \- Ngày mua Add-on \+ 1 ngày (Tính theo múi giờ của tổ chức)
  - **Tổng số ngày của chu kỳ Add-on:** Dựa vào cấu hình của Add-on (ví dụ: 30 ngày cho 1 tháng).
  - **Giá Pro-rata của Add-on:** (Giá Add-on / Tổng số ngày của chu kỳ Add-on) \* Số ngày còn lại của chu kỳ gói chính

**Chi tiết triển khai kỹ thuật cho Logic Pro-rata (Cần làm rõ trong tài liệu kỹ thuật):** Cần đặc tả chi tiết việc sử dụng thư viện xử lý ngày giờ có hỗ trợ múi giờ, quy tắc làm tròn tiền tệ, và xử lý các trường hợp biên như số ngày còn lại bằng 0\.

### **7.2. Vòng đời Trạng thái Subscription và Chính sách Xóa dữ liệu**

Vòng đời trạng thái của Subscription trả phí tuân theo trình tự sau:

stateDiagram-v2  
 \[\*\] \--\> Active : Mua mới / Gia hạn thành công  
 Active \--\> Suspended : Hết hạn chu kỳ  
 Suspended \--\> Active : Gia hạn thành công (trong Data Retention Period)  
 Suspended \--\> DeletionRequested : Hết hạn Data Retention Period (45 ngày sau SuspendedDate)  
 DeletionRequested \--\> Deleted : Dữ liệu đã xóa / Subscription đánh dấu Deleted  
 Deleted \--\> \[\*\]

- **Active:** Subscription đang hoạt động bình thường. Bắt đầu từ 00:00 ngày StartDate (theo múi giờ của tổ chức).
- **Suspended:** Chu kỳ Subscription đã kết thúc vào 23:59 ngày EndDate (theo múi giờ của tổ chức). Quyền truy cập bị dừng (trừ các API liên quan đến Billing để khách hàng có thể gia hạn). Ghi lại SuspendedDate (00:00 ngày tiếp theo sau EndDate theo múi giờ của tổ chức). Bắt đầu Data Retention Period (45 ngày tính từ 00:00 ngày SuspendedDate). Trong trạng thái này, khách hàng vẫn có thể gia hạn để trở lại trạng thái Active, nhưng thời gian còn lại để khôi phục dữ liệu đang đếm ngược.
- **DeletionRequested:** Subscription đã ở trạng thái Suspended đủ 45 ngày. BUM chuyển trạng thái Subscription sang DeletionRequested và phát sự kiện TenantDataDeletionRequested để yêu cầu xóa dữ liệu từ các BC khác.
- **Deleted:** Trạng thái cuối cùng sau khi BUM đã kích hoạt yêu cầu xóa dữ liệu. Bản ghi Subscription có thể được đánh dấu là Deleted hoặc xóa hoàn toàn khỏi hệ thống BUM sau một thời gian chờ nhất định hoặc khi nhận được xác nhận (tùy chính sách lưu trữ lịch sử và cơ chế theo dõi).

**Chính sách Xóa dữ liệu:** Sau khi Subscription chuyển sang trạng thái Suspended và duy trì trạng thái đó trong 45 ngày, BUM sẽ chuyển trạng thái Subscription sang DeletionRequested và kích hoạt quy trình xóa dữ liệu của Tổ chức đó bằng cách phát sự kiện TenantDataDeletionRequested. Các Bounded Context khác sở hữu dữ liệu của Tổ chức đó có trách nhiệm lắng nghe sự kiện này và thực hiện việc xóa dữ liệu trong phạm vi của mình. BUM không chịu trách nhiệm đảm bảo việc xóa dữ liệu ở các BC khác, chỉ chịu trách nhiệm kích hoạt yêu cầu xóa và cập nhật trạng thái Subscription trong phạm vi của mình. Cơ chế này là "fire-and-forget" từ góc độ BUM, dựa vào hệ thống monitoring tập trung để theo dõi việc xử lý event bởi các consumer.

**Quy trình Thông báo Vòng đời Sau Hết hạn:** BUM phối hợp với NDM để gửi các thông báo quan trọng cho Tổ chức theo lịch trình sau:

- **Email thông báo sắp hết hạn:** Gửi trước 7 ngày kể từ ngày EndDate.
- **Email thông báo hết hạn/chuyển trạng thái Suspended:** Gửi ngay sau khi Subscription hết hạn (vào ngày SuspendedDate).
- **Email thông báo sắp hết thời gian giữ lại dữ liệu:** Gửi sau 30 ngày kể từ ngày SuspendedDate (còn 15 ngày trước khi chuyển sang DeletionRequested).
- **Email thông báo đã xóa hoàn toàn (lên lịch xóa):** Gửi sau 45 ngày kể từ ngày SuspendedDate (ngay khi chuyển trạng thái sang DeletionRequested và phát sự kiện xóa).

### **7.3. Kiểm soát Hạn mức Sử dụng (Hạn mức cứng)**

Hạn mức sử dụng được định nghĩa trong Entitlement của Subscription là **hạn mức cứng**. Điều này có nghĩa là khi một Tổ chức đạt đến hoặc vượt quá hạn mức cho một loại tài nguyên cụ thể, các hành động nghiệp vụ trong các Feature BC yêu cầu sử dụng tài nguyên đó sẽ bị chặn hoàn toàn.

- Việc kiểm tra hạn mức được thực hiện **trước khi** hành động được cho phép thực hiện trong Feature BC. Feature BC gọi dịch vụ kiểm tra quyền của IAM (đồng bộ), bao gồm TenantId, ResourceType và Quantity cần sử dụng.
- IAM gọi **SubscriptionService** của BUM (hoặc API chuyên dụng) để kiểm tra Entitlement và Usage hiện tại của Subscription cho Tổ chức đó.
- **SubscriptionService** của BUM thực hiện logic kiểm tra:
  - Lấy Subscription dựa trên TenantId.
  - Kiểm tra trạng thái Subscription có phải là Active không. Nếu không (trạng thái là Suspended, DeletionRequested, Deleted), từ chối.
  - Tìm Entitlement tương ứng với ResourceType.
  - Nếu không có Entitlement cho tài nguyên này (hoặc gói Free/gói không giới hạn): Cho phép (nếu trạng thái Active).
  - Nếu có Entitlement với UsageLimit: Lấy UsageRecord hiện tại cho tài nguyên đó trong chu kỳ thanh toán hiện tại. So sánh UsageRecord.Quantity \+ Quantity yêu cầu với Entitlement.Limit.
  - Nếu UsageRecord.Quantity \+ Quantity yêu cầu \<= Entitlement.Limit: Cho phép (nếu trạng thái Active).
  - Nếu UsageRecord.Quantity \+ Quantity yêu cầu \> Entitlement.Limit: Từ chối.
- BUM trả về kết quả (Allowed/Denied) cho IAM.
- IAM trả về kết quả cho Feature BC.
- Feature BC cho phép hoặc từ chối hành động dựa trên kết quả kiểm tra quyền.
- **Sau khi hành động được cho phép và hoàn thành thành công** trong Feature BC, Feature BC phát ra Sự kiện Nghiệp vụ (Usage Event) để BUM ghi nhận usage.
- BUM lắng nghe sự kiện Usage và cập nhật UsageRecord. Trong quá trình này, BUM kiểm tra lại xem Usage có vượt quá hạn mức không (điều này có thể xảy ra do sự kiện đến chậm hoặc đồng thời). Nếu phát hiện vượt quá, BUM phát sự kiện UsageLimitExceeded để thông báo (qua NDM) và cảnh báo cho IAM (để IAM cập nhật trạng thái nội bộ nếu cần). **Việc phát hiện vượt quá hạn mức tại thời điểm ghi nhận usage không làm "quay ngược" hành động đã xảy ra ở Feature BC, mà chỉ ngăn chặn các hành động tiếp theo.**
- **Lưu ý về xử lý Usage Event cho Subscription đã hết hạn hoặc ở trạng thái Suspended:** Usage Event chỉ nên được ghi nhận cho các Subscription đang ở trạng thái Active và trong chu kỳ thanh toán hiện tại. Các event nhận được cho Subscription ở trạng thái Suspended, DeletionRequested, Deleted hoặc cho các chu kỳ thanh toán đã kết thúc nên được bỏ qua cho mục đích tính Usage Limit trong chu kỳ hiện tại, nhưng có thể được ghi nhận cho mục đích báo cáo lịch sử nếu cần.

### **7.4. Chính sách Cập nhật Pricing Plan và Mua thêm Tài nguyên (Add-on)**

Khi thông tin của một PricingPlan được cập nhật (ví dụ: thay đổi giá, thêm/bớt tài nguyên), những thay đổi này **chỉ áp dụng** cho:

1. Các giao dịch mua gói mới sử dụng Pricing Plan đó.
2. Các giao dịch mua thêm tài nguyên (Add-on) liên quan đến Pricing Plan đó.
3. Các giao dịch gia hạn Subscription hiện có khi đến kỳ (gia hạn sẽ tạo một chu kỳ mới và áp dụng giá và cấu hình mới nhất của Pricing Plan).

Những thay đổi này **không ảnh hưởng** đến:

1. Các Subscription đang Active hoặc Suspended; chúng tiếp tục sử dụng cấu hình (giá, hạn mức, quyền lợi) của Pricing Plan tại thời điểm mua hoặc gia hạn gần nhất cho đến khi hết chu kỳ hiện tại.
2. Các UsageRecord và Entitlement hiện có trong các Subscription đang hoạt động trong chu kỳ hiện tại (chỉ cập nhật khi gia hạn hoặc đổi gói).

Điều này đảm bảo tính ổn định cho khách hàng đang sử dụng gói hiện tại trong suốt chu kỳ thanh toán của họ. Mỗi lần cập nhật Pricing Plan sẽ tạo ra một Version mới của Pricing Plan đó. Khi một Subscription được tạo hoặc gia hạn, nó sẽ tham chiếu đến một phiên bản cụ thể của Pricing Plan. **Khi mua gói mới hoặc gia hạn, BUM sẽ luôn chọn phiên bản Pricing Plan mới nhất đang ở trạng thái Active.**

**Quy tắc nghiệp vụ cho Mua thêm Tài nguyên (Add-on):** Để đơn giản hóa logic Pro-rata và khuyến khích gia hạn gói chính, **hệ thống sẽ không cho phép người dùng mua thêm tài nguyên (Add-on) nếu thời hạn còn lại của gói đăng ký chính (Subscription) nhỏ hơn 7 ngày.**

## **8\. Use cases**

Dưới đây là mô tả các use cases chính có sự tham gia của BUM, tập trung vào actor, mục đích và các service liên quan, được phân loại theo các nhóm chức năng chính.

### **8.1. Use Cases liên quan đến Vòng đời Subscription & Giao dịch**

Nhóm này bao gồm các use case liên quan đến việc tạo, kích hoạt, gia hạn, tạm ngưng Subscription và xử lý các giao dịch thanh toán đi kèm.

- **BUM-UC-8.1.1: Tổ chức Đăng ký và Nhận Gói Free Forever**
  - **Actor:** Tổ chức mới, Hệ thống.
  - **Mục đích:** Tự động tạo Subscription cho gói Free Forever khi một tổ chức mới được tạo trong hệ thống.
  - **Service liên quan:** Lắng nghe sự kiện OrganizationCreatedEvent từ IAM. Sử dụng PricingPlanService để lấy gói Free (phiên bản mới nhất đang Active). Sử dụng SubscriptionService để tạo Subscription. Phát sự kiện SubscriptionActivated và audit log cho ALM.
- **BUM-UC-8.1.2: Tổ chức Mua Gói Dịch vụ Trả phí Mới hoặc Nâng cấp gói (Trả trước)**
  - **Actor:** Người dùng tổ chức, Hệ thống.
  - **Mục đích:** Cho phép tổ chức mua gói dịch vụ trả phí mới hoặc nâng cấp gói hiện tại, xử lý thanh toán trả trước và kích hoạt/cập nhật Subscription. **Bao gồm cả logic kiểm tra quy tắc không cho phép mua Add-on nếu thời hạn gói chính còn dưới 7 ngày.**
  - **Service liên quan:** Nhận command InitiatePurchaseCommand hoặc ChangeSubscriptionPlanCommand. Sử dụng PricingPlanService (để lấy phiên bản mới nhất đang Active) và SubscriptionService để lấy thông tin. Sử dụng BillingService để tính toán giá (bao gồm Pro-rata) và tạo BillingTransaction. **Tương tác với Payment Gateway để xử lý thanh toán.** Lắng nghe callback/webhook từ Payment Gateway. Cập nhật BillingTransaction, tạo Invoice (nếu thành công), cập nhật Subscription (liên kết với phiên bản Pricing Plan đã chọn). Phát sự kiện SubscriptionActivated hoặc SubscriptionPlanChanged, BillingTransactionSuccessful hoặc BillingTransactionFailed, audit log cho ALM. Yêu cầu NDM gửi thông báo theo lịch trình.
- **BUM-UC-8.1.3: Quản lý Vòng đời Subscription Sau Hết hạn (Thông báo, Tạm ngưng, Xóa dữ liệu)**
  - **Actor:** Hệ thống (Scheduled Task).
  - **Mục đích:** Tự động xử lý khi gói trả phí hết hạn, chuyển Subscription sang trạng thái Suspended, và kích hoạt quy trình xóa dữ liệu sau thời gian Data Retention theo lịch trình thông báo đã định nghĩa.
  - **Service liên quan:** ScheduledTasksApplicationService chạy định kỳ. Sử dụng SubscriptionService để kiểm tra Subscription hết hạn và chuyển trạng thái sang Suspended. Ghi lại SuspendedDate và DataRetentionEndDate. Phát sự kiện SubscriptionSuspended. Yêu cầu NDM gửi thông báo hết hạn. Kiểm tra Subscription ở trạng thái Suspended đã quá 30 ngày. Yêu cầu NDM gửi thông báo sắp xóa dữ liệu. Kiểm tra Subscription ở trạng thái Suspended đã quá 45 ngày. Chuyển trạng thái Subscription sang DeletionRequested và Phát sự kiện TenantDataDeletionRequested. Yêu cầu NDM gửi thông báo đã xóa dữ liệu.

### **8.2. Use Cases liên quan đến Usage & Entitlement**

Nhóm này tập trung vào việc theo dõi mức độ sử dụng tài nguyên và cung cấp thông tin về quyền lợi/hạn mức cho các BC khác (đặc biệt là IAM).

- **BUM-UC-8.2.1: Ghi nhận Sử dụng Tài nguyên và Kiểm soát Hạn mức**
  - **Actor:** Các Feature BC, Hệ thống.
  - **Mục đích:** Ghi nhận mức độ sử dụng tài nguyên của tổ chức và kiểm tra xem việc sử dụng có vượt quá hạn mức cứng hay không.
  - **Service liên quan:** Cung cấp API/Service cho IAM kiểm tra Entitlement/Usage trước khi hành động được thực hiện trong Feature BC. Nhận sự kiện Usage từ các Feature BC (ví dụ: OrderCompletedEvent từ ODM, ProductCreatedEvent từ PIM, AssetCreatedEvent từ DAM). Sử dụng SubscriptionService để ghi nhận usage và kiểm tra hạn mức. Phát sự kiện UsageLimitExceeded (nếu vượt quá) và audit log cho ALM.
- **BUM-UC-8.2.2: Kiểm tra Quyền lợi Tính năng (Entitlement Check)**
  - **Actor:** IAM, Hệ thống.
  - **Mục đích:** Cung cấp dịch vụ cho IAM để kiểm tra xem tổ chức có quyền sử dụng một tính năng cụ thể hoặc còn hạn mức sử dụng tài nguyên hay không, dựa trên Subscription hiện tại.
  - **Service liên quan:** Cung cấp phương thức CheckEntitlement trong SubscriptionService được gọi bởi IAM. Logic kiểm tra dựa trên FeatureEntitlements, UsageLimits, UsageRecords và trạng thái Subscription (chỉ cho phép nếu trạng thái là Active).

### **8.3. Use Cases liên quan đến Truy vấn & Báo cáo**

Nhóm này bao gồm các use case cho phép người dùng (khách hàng hoặc nội bộ) truy xuất và xem các thông tin về gói dịch vụ, giao dịch và mức sử dụng.

- **BUM-UC-8.3.1: Xem Danh sách Giao dịch Thanh toán của Tổ chức**
  - **Actor:** Người dùng tổ chức (có quyền), Người dùng nội bộ Ecoma (có quyền).
  - **Mục đích:** Cho phép xem danh sách các giao dịch thanh toán (mua, gia hạn, mua thêm) của một tổ chức trong một khoảng thời gian nhất định.
  - **Service liên quan:** Được xử lý bởi BillingApplicationService (Query). Sử dụng BillingTransactionRepository để truy vấn dữ liệu.
- **BUM-UC-8.3.2: Xem Chi tiết Giao dịch Thanh toán và Hóa đơn**
  - **Actor:** Người dùng tổ chức (có quyền), Người dùng nội bộ Ecoma (có quyền).
  - **Mục đích:** Cho phép xem chi tiết của một giao dịch thanh toán cụ thể và hóa đơn liên quan (nếu có).
  - **Service liên quan:** Được xử lý bởi BillingApplicationService (Query). Sử dụng BillingTransactionRepository và InvoiceRepository để truy vấn dữ liệu.
- **BUM-UC-8.3.3: Xem Chi tiết Subscription Hiện tại và Lịch sử**
  - **Actor:** Người dùng tổ chức (có quyền), Người dùng nội bộ Ecoma (có quyền).
  - **Mục đích:** Cho phép xem thông tin chi tiết về gói dịch vụ (Subscription) mà tổ chức đang sử dụng, bao gồm trạng thái, thời gian, hạn mức, quyền lợi và lịch sử thay đổi gói. **Khi hiển thị thông tin ngày giờ liên quan đến chu kỳ thanh toán, cần ghi rõ múi giờ của tổ chức.**
  - **Service liên quan:** Được xử lý bởi SubscriptionApplicationService (Query). Sử dụng SubscriptionRepository và PricingPlanRepository để truy vấn dữ liệu.
- **BUM-UC-8.3.4: Xem Báo cáo Sử dụng Tài nguyên của Tổ chức**
  - **Actor:** Người dùng tổ chức (có quyền), Người dùng nội bộ Ecoma (có quyền).
  - **Mục đích:** Cho phép xem mức độ sử dụng các loại tài nguyên của tổ chức trong chu kỳ thanh toán hiện tại hoặc các chu kỳ trước đó. **Khi hiển thị thông tin ngày giờ liên quan đến chu kỳ thanh toán, cần ghi rõ múi giờ của tổ chức.**
  - **Service liên quan:** Được xử lý bởi UsageApplicationService (Query). Sử dụng UsageRecordRepository và SubscriptionRepository để truy vấn dữ liệu.

### **8.4. Use Cases liên quan đến Quản lý Cấu hình (Admin)**

Nhóm này dành cho các use case quản trị nội bộ, cho phép cấu hình các dữ liệu nền tảng của BUM như Pricing Plan.

- **BUM-UC-8.4.1: Quản lý Pricing Plans (Admin)**
  - **Actor:** Người dùng nội bộ Ecoma (có quyền Admin).
  - **Mục đích:** Cho phép tạo mới, cập nhật, xem và quản lý các kế hoạch giá (Pricing Plans) của hệ thống.
  - **Service liên quan:** Được xử lý bởi PricingPlanApplicationService (Command/Query). Sử dụng PricingPlanService và PricingPlanRepository. **Các command/query này thường được gửi từ giao diện Admin UI (thuộc Admin Group BC).**

## **9\. Domain Services**

Domain Services trong BUM chứa logic nghiệp vụ quan trọng không thuộc về một Aggregate Root cụ thể hoặc cần phối hợp nhiều Aggregate Root.

- **SubscriptionService:**
  - **Trách nhiệm:** Quản lý vòng đời của Subscription (tạo, kích hoạt, gia hạn, tạm ngưng), ghi nhận usage, kiểm tra entitlement, xử lý chuyển đổi gói (upgrade/add-on), **kích hoạt quy trình xóa dữ liệu**. Phối hợp với Subscription Repository và PricingPlan Repository (để lấy thông tin gói).
  - **Các phương thức tiềm năng:** CreateFreeSubscription(tenantId, pricingPlanVersion), ActivatePaidSubscription(subscriptionId, transactionId, pricingPlanVersion), RenewSubscription(subscriptionId, transactionId, pricingPlanVersion), SuspendSubscription(subscriptionId, reason), RecordUsage(tenantId, resourceType, quantity), CheckEntitlement(tenantId, entitlementDetails), ChangeSubscriptionPlan(subscriptionId, newPricingPlanId, newPricingPlanVersion), TriggerDataDeletion(tenantId).
- **BillingService:**
  - **Trách nhiệm:** Xử lý các quy trình liên quan đến tính toán giá (bao gồm pro-rata cho đổi gói), tạo Billing Transaction, tạo Invoice, **tương tác với Payment Gateways**. **Bao gồm logic kiểm tra quy tắc không cho phép mua Add-on nếu thời hạn gói chính còn dưới 7 ngày.** Phối hợp với PricingPlan Repository, Subscription Repository, BillingTransaction Repository, Invoice Repository.
  - **Các phương thức tiềm năng:** InitiatePurchase(tenantId, pricingPlanId, pricingPlanVersion), InitiateRenewal(subscriptionId, pricingPlanVersion), CalculatePrice(pricingPlanId, pricingPlanVersion, currentSubscription, isProRata), ProcessPaymentGatewayCallback(transactionId, paymentStatusDetails), HandlePaymentGatewayWebhook(payload).
- **PricingPlanService:**
  - **Trách nhiệm:** Quản lý vòng đời của Pricing Plan, cung cấp thông tin về Pricing Plan (bao gồm cả các phiên bản). **Việc tạo và cập nhật Pricing Plan được thực hiện thông qua giao diện Admin UI và được điều phối bởi PricingPlanApplicationService.** Phối hợp với PricingPlan Repository.
  - **Các phương thức tiềm năng:** CreatePricingPlan(details), UpdatePricingPlan(pricingPlanId, details), GetPricingPlan(pricingPlanId), GetFreePricingPlan(), GetPricingPlanVersion(pricingPlanId, version), GetLatestActivePricingPlanVersion(pricingPlanId).

## **10\. Application Services**

Application Services trong BUM là lớp mỏng điều phối các hành động từ bên ngoài (ví dụ: từ API Gateway, Message Broker) đến Domain Model (Aggregate Roots, Domain Services). Chúng xử lý các tác vụ kỹ thuật như xác thực, ủy quyền (thông qua IAM), giao dịch cơ sở dữ liệu, và phát sự kiện.

- **SubscriptionApplicationService:**
  - **Trách nhiệm:** Xử lý các command liên quan đến Subscription từ API (ví dụ: ChangeSubscriptionPlanCommand) hoặc các event từ Message Broker (ví dụ: OrganizationCreatedEvent từ IAM). **Cũng xử lý các query liên quan đến Subscription.** Sử dụng SubscriptionService và Subscription Repository.
  - **Các phương thức tiềm năng:** HandleChangeSubscriptionPlanPlanCommand(command), HandleOrganizationCreatedEvent(event), GetSubscriptionDetails(tenantId), GetSubscriptionHistory(tenantId).
- **BillingApplicationService:**
  - **Trách nhiệm:** Xử lý các command/event liên quan đến thanh toán và giao dịch (ví dụ: InitiatePurchaseCommand, xử lý callback/webhook từ Payment Gateway). **Cũng xử lý các query liên quan đến Billing Transaction và Invoice.** Sử dụng BillingService, BillingTransaction Repository, Invoice Repository.
  - **Các phương thức tiềm năng:** HandleInitiatePurchaseCommand(command), HandlePaymentGatewayCallback(callbackDetails), HandlePaymentGatewayWebhook(webhookPayload), GetBillingTransactions(tenantId, filter), GetBillingTransactionDetails(transactionId), GetInvoiceDetails(invoiceId).
- **UsageApplicationService:**
  - **Trách nhiệm:** Xử lý các event về usage từ các Feature BC (ví dụ: OrderCompletedEvent từ ODM, ProductCreatedEvent từ PIM, AssetCreatedEvent từ DAM). **Cũng xử lý các query liên quan đến Usage Report.** Sử dụng SubscriptionService và Subscription Repository.
  - **Các phương thức tiềm năng:** HandleOrderCompletedEvent(event), HandleProductCreatedEvent(event), HandleAssetCreatedEvent(event), GetUsageReport(tenantId, billingCycleId).
- **PricingPlanApplicationService:**
  - **Trách nhiệm:** Xử lý các command liên quan đến quản lý Pricing Plan từ API (ví dụ: CreatePricingPlanCommand, UpdatePricingPlanCommand). **Các command này thường được gửi từ giao diện Admin UI. Cũng xử lý các query liên quan đến Pricing Plan.** Sử dụng PricingPlanService và PricingPlan Repository.
  - **Các phương thức tiềm năng:** HandleCreatePricingPlanCommand(command), HandleUpdatePricingPlanCommand(command), GetPricingPlan(pricingPlanId), ListPricingPlans().
- **ScheduledTasksApplicationService:**
  - **Trách nhiệm:** Xử lý các tác vụ định kỳ như kiểm tra Subscription hết hạn, chuyển trạng thái Suspended, kiểm tra Subscription cần xóa dữ liệu, **kích hoạt gửi các thông báo vòng đời sau hết hạn thông qua NDM**.
  - **Các phương thức tiềm năng:** RunExpirationCheck(), RunSuspensionCheck(), RunDataRetentionCheck(), SendExpirationNotifications().

## **11\. Domain Events**

Bounded Context BUM tương tác với các Bounded Context khác thông qua việc phát ra và lắng nghe các Domain Event. Dưới đây là danh sách các event mà BUM phát ra và lắng nghe, bao gồm payload dự kiến của chúng:

### **11.1. Domain Events (BUM Phát ra)**

BUM sẽ phát ra các Domain Event quan trọng để thông báo cho các Bounded Context khác về những thay đổi trạng thái nghiệp vụ trong phạm vi của nó. Dưới đây là danh sách các event và payload dự kiến của chúng:

- **SubscriptionActivated**
  - Phát ra khi một Subscription được kích hoạt thành công (bao gồm cả gói Free và gói trả phí sau thanh toán).
  - **Payload:**
    - SubscriptionId (UUID)
    - TenantId (UUID)
    - PricingPlanId (UUID)
    - PricingPlanVersion (Integer)
    - StartDate (DateTime)
    - EndDate (DateTime)
    - FeatureEntitlements (List of Entitlement details: ResourceType/FeatureType, Limit)
    - IssuedAt (DateTime \- thời điểm event được phát ra)
- **SubscriptionSuspended**
  - Phát ra khi một Subscription bị tạm ngưng (do hết hạn).
  - **Payload:**
    - SubscriptionId (UUID)
    - TenantId (UUID)
    - SuspendedDate (DateTime)
    - Reason (String \- ví dụ: "Expired")
    - DataRetentionEndDate (DateTime \- thời điểm dữ liệu sẽ bị xóa nếu không gia hạn)
    - IssuedAt (DateTime)
- **SubscriptionRenewed**
  - Phát ra khi một Subscription trả phí được gia hạn thành công.
  - **Payload:**
    - SubscriptionId (UUID)
    - TenantId (UUID)
    - PricingPlanId (UUID)
    - PricingPlanVersion (Integer)
    - NewStartDate (DateTime)
    - NewEndDate (DateTime)
    - TransactionId (UUID)
    - IssuedAt (DateTime)
- **SubscriptionPlanChanged**
  - Phát ra khi một Tổ chức chuyển đổi giữa các gói (bao gồm cả từ Free lên trả phí).
  - **Payload:**
    - SubscriptionId (UUID)
    - TenantId (UUID)
    - OldPricingPlanId (UUID)
    - OldPricingPlanVersion (Integer)
    - NewPricingPlanId (UUID)
    - NewPricingPlanVersion (Integer)
    - NewFeatureEntitlements (List of Entitlement details: ResourceType/FeatureType, Limit)
    - TransactionId (UUID \- nếu có giao dịch liên quan)
    - IssuedAt (DateTime)
- **UsageLimitApproaching**
  - Phát ra khi mức sử dụng của một tài nguyên gần đạt hạn mức (ví dụ: đạt 80% hạn mức). Ngưỡng cảnh báo có thể được cấu hình.
  - **Payload:**
    - TenantId (UUID)
    - SubscriptionId (UUID)
    - ResourceType (String)
    - CurrentUsage (Number)
    - UsageLimit (Number)
    - BillingCyclePeriod (Object: StartDate, EndDate, Timezone)
    - IssuedAt (DateTime)
- **UsageLimitExceeded**
  - Phát ra khi mức sử dụng của một tài nguyên vượt quá hạn mức cứng.
  - **Payload:**
    - TenantId (UUID)
    - SubscriptionId (UUID)
    - ResourceType (String)
    - CurrentUsage (Number)
    - UsageLimit (Number)
    - BillingCyclePeriod (Object: StartDate, EndDate, Timezone)
    - IssuedAt (DateTime)
- **BillingTransactionInitiated**
  - Phát ra khi một giao dịch thanh toán được khởi tạo (trước khi gọi Payment Gateway).
  - **Payload:**
    - BillingTransactionId (UUID)
    - TenantId (UUID)
    - SubscriptionId (UUID)
    - Amount (Object: Amount, Currency)
    - Type (String: "Purchase", "Renewal", "AddOn")
    - InitiatedAt (DateTime)
    - IssuedAt (DateTime)
- **BillingTransactionSuccessful**
  - Phát ra khi một giao dịch thanh toán thành công (sau khi nhận xác nhận từ Payment Gateway).
  - **Payload:**
    - BillingTransactionId (UUID)
    - TenantId (UUID)
    - SubscriptionId (UUID)
    - Amount (Object: Amount, Currency)
    - Type (String: "Purchase", "Renewal", "AddOn")
    - TransactionDate (DateTime)
    - PaymentGatewayTransactionId (String)
    - InvoiceId (UUID)
    - IssuedAt (DateTime)
- **BillingTransactionFailed**
  - Phát ra khi một giao dịch thanh toán thất bại (sau khi nhận xác nhận từ Payment Gateway).
  - **Payload:**
    - BillingTransactionId (UUID)
    - TenantId (UUID)
    - SubscriptionId (UUID)
    - Amount (Object: Amount, Currency)
    - Type (String: "Purchase", "Renewal", "AddOn")
    - TransactionDate (DateTime)
    - PaymentGatewayTransactionId (String \- nếu có)
    - ErrorDetails (String \- mô tả lỗi từ Payment Gateway)
    - IssuedAt (DateTime)
- **PricingPlanCreated**
  - Phát ra khi một Pricing Plan mới được tạo thông qua giao diện Admin.
  - **Payload:**
    - PricingPlanId (UUID)
    - Name (String)
    - Version (Integer)
    - Details (Object \- cấu hình chi tiết gói: BasePrice, BillingCycle, Components)
    - CreatedAt (DateTime)
    - IssuedAt (DateTime)
- **PricingPlanUpdated**
  - Phát ra khi một Pricing Plan hiện có được cập nhật thông qua giao diện Admin (tạo version mới).
  - **Payload:**
    - PricingPlanId (UUID)
    - Name (String)
    - OldVersion (Integer)
    - NewVersion (Integer)
    - NewDetails (Object \- cấu hình chi tiết gói mới)
    - UpdatedAt (DateTime)
    - IssuedAt (DateTime)
- **TenantDataDeletionRequested**
  - Phát ra khi dữ liệu của Tổ chức cần được xóa do Subscription đã Suspended quá thời gian Data Retention (khi chuyển trạng thái sang DeletionRequested).
  - **Payload:**
    - TenantId (UUID)
    - Reason (String \- ví dụ: "Subscription Suspended for 45 days")
    - RequestedAt (DateTime)
    - IssuedAt (DateTime)

### **11.2. Domain Events Được Xử lý (Consumed Domain Events)**

BUM lắng nghe và xử lý các Domain Event từ các Bounded Context khác để thực hiện các nghiệp vụ hoặc cập nhật trạng thái nội bộ. Dưới đây là danh sách các event mà BUM xử lý và payload dự kiến của chúng:

- **OrganizationCreatedEvent** (Từ IAM)
  - Phát ra khi một tổ chức mới được tạo thành công trong IAM.
  - **Mục đích xử lý:** BUM lắng nghe event này để tự động tạo một Subscription cho gói Free Forever cho tổ chức mới.
  - **Payload dự kiến:**
    - TenantId (UUID) \- ID của tổ chức mới
    - OwnerUserId (UUID) \- ID của người dùng Owner ban đầu của tổ chức
    - OrganizationDetails (Object \- các thông tin cơ bản khác của tổ chức nếu cần, ví dụ: Name, CreatedAt, **Timezone**)
    - IssuedAt (DateTime)
- **OrderCompletedEvent** (Từ ODM)
  - Phát ra khi một đơn hàng được hoàn thành thành công.
  - **Mục đích xử lý:** BUM lắng nghe event này để ghi nhận số lượng đơn hàng vào Usage Record cho tài nguyên "Order" của tổ chức sở hữu đơn hàng.
  - **Payload dự kiến:**
    - OrderId (UUID)
    - TenantId (UUID) \- Tổ chức sở hữu đơn hàng
    - Quantity (Number) \- Số lượng đơn hàng hoàn thành (thường là 1\)
    - CompletedAt (DateTime)
    - IssuedAt (DateTime)
- **ProductCreatedEvent** (Từ PIM)
  - Phát ra khi một sản phẩm mới được tạo thành công.
  - **Mục đích xử lý:** BUM lắng nghe event này để ghi nhận số lượng sản phẩm vào Usage Record cho tài nguyên "Product" của tổ chức sở hữu sản phẩm.
  - **Payload dự kiến:**
    - ProductId (UUID)
    - TenantId (UUID) \- Tổ chức sở hữu sản phẩm
    - Quantity (Number) \- Số lượng sản phẩm tạo mới (thường là 1\)
    - CreatedAt (DateTime)
    - IssuedAt (DateTime)
- **AssetCreatedEvent** (Từ DAM)
  - Phát ra khi một asset mới được tạo thành công.
  - **Mục đích xử lý:** BUM lắng nghe event này để ghi nhận số lượng asset vào Usage Record cho tài nguyên "Asset" (hoặc loại tài nguyên tương ứng như "Storage") của tổ chức sở hữu asset.
  - **Payload dự kiến:**
    - AssetId (UUID)
    - TenantId (UUID) \- Tổ chức sở hữu asset
    - Quantity (Number) \- Số lượng asset tạo mới (thường là 1\)
    - SizeInBytes (Long) \- Kích thước asset (nếu Usage tính theo dung lượng)
    - CreatedAt (DateTime)
    - IssuedAt (DateTime)
- **InventoryItemAddedEvent / InventoryItemDeductedEvent** (Từ ICM)
  - Phát ra khi số lượng tồn kho của một mặt hàng thay đổi (tăng/giảm). (Tùy thuộc vào cách định nghĩa Usage cho Storage, có thể cần lắng nghe event này hoặc event khác liên quan đến Storage Usage).
  - **Mục đích xử lý:** BUM có thể lắng nghe các event này (hoặc event tương tự) để ghi nhận Usage cho tài nguyên "Storage" (ví dụ: tính theo số lượng mặt hàng hoặc dung lượng lưu trữ).
  - **Payload dự kiến:** (Ví dụ cho Storage Usage tính theo số lượng mặt hàng)
    - InventoryItemId (UUID)
    - TenantId (UUID) \- Tổ chức sở hữu tồn kho
    - QuantityChange (Number) \- Số lượng thay đổi (có thể âm hoặc dương)
    - CurrentQuantity (Number) \- Số lượng hiện tại
    - OccurredAt (DateTime)
    - IssuedAt (DateTime)
- **PaymentSuccessfulEvent** (Từ Payment Gateway Callback/Webhook)
  - Phát ra khi một giao dịch thanh toán được xử lý thành công bởi Payment Gateway. Event này được BUM tự xử lý sau khi nhận callback/webhook.
  - **Mục đích xử lý:** Cập nhật trạng thái của BillingTransaction tương ứng thành Successful, tạo Invoice, và kích hoạt/gia hạn Subscription.
  - **Payload dự kiến:**
    - BillingTransactionId (UUID) \- ID giao dịch trong BUM (được gửi sang Payment Gateway khi tạo yêu cầu)
    - PaymentGatewayTransactionId (String) \- ID giao dịch trong Payment Gateway
    - Amount (Object: Amount, Currency)
    - PaymentMethodDetails (Object \- chi tiết phương thức thanh toán)
    - TransactionTime (DateTime)
    - IssuedAt (DateTime)
- **PaymentFailedEvent** (Từ Payment Gateway Callback/Webhook)
  - Phát ra khi một giao dịch thanh toán thất bại. Event này được BUM tự xử lý sau khi nhận callback/webhook.
  - **Mục đích xử lý:** Cập nhật trạng thái của BillingTransaction tương ứng thành Failed và ghi lại chi tiết lỗi.
  - **Payload dự kiến:**
    - BillingTransactionId (UUID) \- ID giao dịch trong BUM
    - PaymentGatewayTransactionId (String \- nếu có)
    - Amount (Object: Amount, Currency)
    - ErrorDetails (String \- mô tả lỗi từ Payment Gateway)
    - TransactionTime (DateTime)
    - IssuedAt (DateTime)

_(Lưu ý: Danh sách các sự kiện Usage từ Operations Group có thể cần được làm rõ và bổ sung tùy thuộc vào cách các BC đó phát ra sự kiện và cách BUM định nghĩa các loại tài nguyên có thể tính phí/giới hạn.)_

## **12\. Ranh giới Nghiệp vụ**

Ranh giới của Bounded Context BUM được xác định bởi trách nhiệm quản lý các khíaAspect tài chính, gói dịch vụ và quyền sử dụng theo mô hình trả trước, không hoàn tiền, giá bao gồm thuế, hạn mức cứng, và vòng đời Subscription/xóa dữ liệu cụ thể. BUM sở hữu dữ liệu liên quan đến Pricing Plans, Subscriptions, Usage Records, Billing Transactions, Invoices và Entitlements. **BUM chịu trách nhiệm tích hợp trực tiếp với các Payment Gateways cho các giao dịch liên quan đến Subscription SaaS.**

BUM không chịu trách nhiệm:

- Xác thực danh tính người dùng (thuộc về IAM).
- **Xử lý các loại thanh toán không liên quan đến Subscription SaaS (thuộc về PPM).**
- Quản lý dữ liệu khách hàng ngoài thông tin cơ bản về Tổ chức (thuộc về CRM).
- Quản lý nội dung thông báo hoặc kênh gửi (chỉ yêu cầu NDM gửi).
- Quản lý bản dịch văn bản hoặc quy tắc định dạng locale (thuộc về LZM và RDM).
- Ghi nhận audit logs (chỉ phát sự kiện cho ALM).
- Quản lý các miền nghiệp vụ đặc thù khác như Sản phẩm, Đơn hàng, Tồn kho, v.v. (thuộc về các Feature BC tương ứng).
- Tính toán thuế (giá đã bao gồm thuế).
- Xử lý yêu cầu hoàn tiền hoặc hủy gói sau khi mua.
- **Thực hiện việc xóa dữ liệu thực tế** trong các BC khác (chỉ kích hoạt yêu cầu xóa).

## **13\. Kết luận**

Bounded Context Billing & Usage Management (BUM) là một thành phần cốt lõi, quản lý các khía cạnh tài chính và quyền sử dụng của nền tảng Ecoma theo mô hình trả trước đặc thù. Bằng cách tập trung các trách nhiệm này vào một Context duy nhất và làm rõ các quy tắc nghiệp vụ cụ thể (Free Forever, không hoàn tiền/hủy sau mua, giá bao gồm thuế, hạn mức cứng, vòng đời Subscription chi tiết, chính sách cập nhật Pricing Plan), chúng ta đảm bảo tính nhất quán, chính xác và khả năng mở rộng cho các quy trình liên quan đến thanh toán và quản lý gói dịch vụ.

Tài liệu này đã cập nhật cấu trúc để tuân thủ mẫu tài liệu chuẩn, bao gồm việc tách riêng các khíaAspect nghiệp vụ quan trọng và trình bày các luồng nghiệp vụ dưới dạng use case, cung cấp cái nhìn chi tiết hơn để hỗ trợ việc triển khai. Các điểm làm rõ về việc sử dụng múi giờ của tổ chức cho tính toán chu kỳ và bản chất của Add-on cũng đã được tích hợp. Đặc biệt, tài liệu đã bổ sung mô tả chi tiết về các Domain Event mà BUM phát ra và lắng nghe, bao gồm cả payload dự kiến, làm rõ hơn các tương tác bất đồng bộ của BUM trong hệ thống. **Các cập nhật quan trọng bao gồm việc làm rõ BUM tích hợp trực tiếp với Payment Gateways cho các giao dịch SaaS, loại bỏ khái niệm credit, và chi tiết lịch trình thông báo trong vòng đời Subscription sau hết hạn.**
