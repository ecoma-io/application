# **Bounded Context Product Information Management (PIM)**

## **1\. Giới thiệu**

Tài liệu này cung cấp mô tả chi tiết về Bounded Context **Product Information Management (PIM)** trong hệ thống Ecoma. PIM là một trong những Bounded Context thuộc nhóm Feature Bounded Context, đóng vai trò trung tâm trong việc tập trung hóa, làm giàu, chuẩn hóa và quản lý toàn bộ thông tin chi tiết về sản phẩm (bao gồm cả dịch vụ) trong hệ thống.

PIM đảm bảo rằng tất cả các Bounded Context khác trong hệ thống có một nguồn dữ liệu sản phẩm duy nhất, chính xác và nhất quán để sử dụng cho các mục đích khác nhau như bán hàng, marketing, tồn kho, báo cáo, v.v.

## **2\. Phạm vi của Tài liệu**

Tài liệu này tập trung vào việc định nghĩa và mô tả Bounded Context PIM ở cấp độ thiết kế miền (domain design), cung cấp đủ chi tiết để hỗ trợ việc thiết kế các Domain Service và Application Service. Cụ thể, tài liệu này bao gồm:

- Xác định vai trò và trách nhiệm chính của PIM.
- Mô tả các khái niệm và thực thể cốt lõi trong mô hình domain của PIM ở cấp độ chi tiết hơn, bao gồm các Aggregate Root, Entity và Value Object với các thuộc tính chính, có tính đến cấu trúc sản phẩm phức tạp (sản phẩm đơn giản, sản phẩm có biến thể).
- Định nghĩa Ngôn ngữ Chung (Ubiquitous Language) trong phạm vi PIM.
- Mô tả **Các Khía cạnh Quan trọng của Miền PIM**, bao gồm quản lý cấu trúc sản phẩm (đơn giản, cấu hình được, biến thể), quản lý thuộc tính sản phẩm (định nghĩa và giá trị), quản lý danh mục và phân cấp, quản lý quan hệ sản phẩm, và tương tác với các BC khác để làm giàu/sử dụng dữ liệu sản phẩm.
- Làm rõ các tương tác chính giữa PIM và các Bounded Context khác, đặc biệt là cách PIM tương tác với IAM (cho ủy quyền), LZM (cho bản địa hóa), RDM (cho dữ liệu tham chiếu), DAM (cho tài sản kỹ thuật số), ICM (cho tồn kho), OSM/ODM (cho bán hàng/đơn hàng), và MPM (cho khuyến mãi).
- Phác thảo các **Use cases** chính có sự tham gia của PIM, tập trung vào actor, mục đích và các Domain/Application Service liên quan, bao gồm tạo/cập nhật sản phẩm (bao gồm biến thể và thuộc tính), quản lý danh mục, quản lý định nghĩa thuộc tính, quản lý quan hệ sản phẩm, và cung cấp dữ liệu sản phẩm cho các BC khác thông qua truy vấn hiệu quả.
- Xác định ranh giới nghiệp vụ của PIM, nhấn mạnh những gì PIM không chịu trách nhiệm.
- Đề xuất các Domain Service và Application Service tiềm năng trong PIM với mô tả chi tiết hơn về trách nhiệm của từng Service.
- Làm rõ các quy tắc nghiệp vụ liên quan đến quản lý sản phẩm (ví dụ: tính duy nhất của SKU, quy tắc gán thuộc tính, quy tắc liên kết danh mục) được mô tả ở cấp độ thiết kế miền.
- Liệt kê và mô tả các **Domain Events** mà PIM tương tác, được chia thành các sự kiện PIM **phát ra** (Published Events) và các sự kiện PIM **lắng nghe và xử lý** (Consumed Events), bao gồm payload dự kiến của từng event.

**Trong phạm vi tài liệu này:**

- Các khái niệm về **Commands** (yêu cầu thực hiện một hành động) và **Queries** (yêu cầu lấy dữ liệu) được đề cập để mô tả cách các Bounded Context khác tương tác với PIM (quản lý sản phẩm, truy vấn sản phẩm) và cách các luồng nghiệp vụ được kích hoạt thông qua các **Application Services**.
- Vai trò và trách nhiệm của **Domain Services** và **Application Services** trong việc xử lý logic nghiệp vụ và điều phối các tương tác được mô tả ở cấp độ chức năng.
- Các **Domain Events** quan trọng được xác định để mô tả những thay đổi trạng thái nghiệp vụ mà PIM phát ra (ví dụ: sản phẩm được tạo/cập nhật, trạng thái thay đổi, biến thể được thêm/xóa), hỗ trợ các BC khác phản ứng với thay đổi.
- Các quy tắc nghiệp vụ liên quan đến quản lý sản phẩm (ví dụ: tính duy nhất của SKU, quy tắc gán thuộc tính, quy tắc liên kết danh mục) được mô tả ở cấp độ thiết kế miền.
- Cấu trúc sản phẩm phức tạp (sản phẩm đơn giản, cấu hình được, biến thể) và cách quản lý thuộc tính/asset ở các cấp độ khác nhau được làm rõ trong mô hình domain.
- Mối quan hệ phụ thuộc với các BC khác (IAM, LZM, RDM, DAM, ICM, OSM, ODM, MPM) trong việc làm giàu và sử dụng dữ liệu sản phẩm được làm rõ.
- Khả năng quản lý giá (giá gốc/niêm yết) và SKU được đề cập trong mô hình domain.
- Yêu cầu về **hiệu năng truy vấn** và **ghi log audit** cho các hoạt động quản lý được đề cập.

**Ngoài phạm vi tài liệu này (thuộc về thiết kế kỹ thuật chi tiết):**

- Định nghĩa chính xác cấu trúc dữ liệu (payload) chi tiết của từng Command, Query và Domain Event (chỉ mô tả mục đích và thông tin cốt lõi).
- Định nghĩa chi tiết các API Interface (chỉ mô tả chức năng và tương tác).
- Chi tiết cài đặt kỹ thuật của Microservice PIM (ngôn ngữ lập trình, framework, kiến trúc nội bộ chi tiết).
- Cấu trúc cơ sở dữ liệu chi tiết (schema) của PIM, bao gồm cách lưu trữ cấu trúc phân cấp danh mục và quan hệ sản phẩm.
- Các quyết định công nghệ cụ thể bên trong PIM (ví dụ: loại cơ sở dữ liệu sử dụng, chiến lược caching dữ liệu sản phẩm, công cụ tìm kiếm toàn văn).
- Luồng dữ liệu chi tiết đến cấp độ từng trường thông tin giữa PIM và các BC khác.
- Cấu hình hạ tầng triển khai cụ thể cho Microservice PIM.
- Thiết kế giao diện người dùng chi tiết cho Product Information Management System (PIMS). PIMS là Client của PIM.
- Quản lý tồn kho thực tế (chỉ quản lý thông tin liên quan đến tồn kho như SKU).
- Xử lý đơn hàng hoặc giao dịch bán hàng.
- Tính toán giá bán lẻ cuối cùng (có thể là trách nhiệm của OSM hoặc các BC bán hàng khác, PIM chỉ quản lý giá niêm yết/giá gốc).

## **3\. Vai trò và Trách nhiệm Chính**

Bounded Context PIM chịu trách nhiệm quản lý thông tin sản phẩm tập trung. Các trách nhiệm chính bao gồm:

- **Quản lý Sản phẩm:** Tạo, cập nhật, xóa (logic xóa mềm hoặc đánh dấu không hoạt động), và quản lý vòng đời của các sản phẩm (bao gồm cả sản phẩm đơn giản và sản phẩm có biến thể).
- **Quản lý Danh mục:** Định nghĩa và quản lý cấu trúc danh mục sản phẩm (phân cấp). Liên kết sản phẩm với một hoặc nhiều danh mục. Đảm bảo tính duy nhất của tên danh mục trong thư mục cha.
- **Quản lý Thuộc tính Sản phẩm:** Định nghĩa các loại thuộc tính sản phẩm (ví dụ: kích thước, màu sắc, chất liệu) và giá trị của chúng (AttributeDefinition). Gán thuộc tính và giá trị cho sản phẩm hoặc biến thể (ProductAttribute). Đảm bảo tính duy nhất của mã thuộc tính.
- **Quản lý Biến thể Sản phẩm (Variants):** Định nghĩa các tùy chọn biến thể (ví dụ: Size: S, M, L; Color: Red, Blue) và tạo các biến thể cụ thể dựa trên các tùy chọn này. Quản lý thông tin riêng cho từng biến thể (SKU, giá gốc, thuộc tính biến thể, asset ảnh). Đảm bảo tính duy nhất của SKU trong phạm vi Tenant.
- **Quản lý Quan hệ Sản phẩm:** Định nghĩa và quản lý các loại quan hệ giữa các sản phẩm (ví dụ: sản phẩm liên quan, sản phẩm thay thế, sản phẩm đi kèm \- upsell/cross-sell).
- **Quản lý Giá (Giá gốc/Giá niêm yết):** Lưu trữ và quản lý giá gốc hoặc giá niêm yết của sản phẩm/biến thể. **Lưu ý:** Đây không phải là giá bán cuối cùng có tính đến khuyến mãi hoặc kênh bán hàng.
- **Quản lý SKU (Stock Keeping Unit):** Quản lý mã SKU duy nhất cho mỗi sản phẩm/biến thể. SKU là mã định danh quan trọng để liên kết với tồn kho (ICM) và đơn hàng (ODM). Đảm bảo tính duy nhất của SKU trong phạm vi Tenant.
- **Quản lý Hình ảnh và Tài sản liên quan:** Liên kết sản phẩm/biến thể với các tài sản kỹ thuật số (hình ảnh, video, tài liệu) được lưu trữ trong DAM. PIM chỉ lưu trữ ID tham chiếu đến các tài sản này. Phản ứng với các sự kiện từ DAM khi asset bị xóa hoặc trạng thái thay đổi.
- **Cung cấp Thông tin Sản phẩm:** Cung cấp thông tin sản phẩm đã được chuẩn hóa và làm giàu (bao gồm bản địa hóa) cho các kênh bán hàng hoặc hệ thống khác khi cần thông qua các API truy vấn hiệu quả.
- **Phát Sự kiện Nghiệp vụ:** Phát ra các Sự kiện Nghiệp vụ quan trọng khi thông tin sản phẩm thay đổi (ví dụ: sản phẩm mới được tạo, thông tin sản phẩm cập nhật, trạng thái sản phẩm thay đổi, biến thể được thêm/xóa, thuộc tính được cập nhật).
- **Ghi Audit Log:** Gửi thông tin về các hoạt động quản lý sản phẩm (tạo, cập nhật, xóa sản phẩm/danh mục/thuộc tính, thay đổi trạng thái) đến ALM để ghi log kiểm tra.

## **4\. Mô hình Domain (Chi tiết hơn)**

Trong phạm vi Bounded Context PIM, mô hình domain xoay quanh các khái niệm về Product (sản phẩm), Category (danh mục) và AttributeDefinition (định nghĩa thuộc tính), cùng với các Entity và Value Object liên quan. Product, Category và AttributeDefinition là các Aggregate Root chính.

**Aggregate Roots:**

- **Product:** Là Aggregate Root đại diện cho một sản phẩm (hoặc dịch vụ) trong hệ thống. Product quản lý thông tin chung về sản phẩm và các biến thể của nó.
  - **ID:** Unique identifier (UUID).
  - **TenantId:** ID của tổ chức sở hữu sản phẩm (liên kết với IAM).
  - **Name:** Tên sản phẩm (có thể đa ngôn ngữ, sử dụng LZM).
  - **Slug:** Chuỗi định danh duy nhất, thân thiện với URL (ví dụ: "ao-thun-nam"). **Ràng buộc:** Duy nhất trong phạm vi Tenant.
  - **Description:** Mô tả sản phẩm (ngắn và dài, có thể đa ngôn ngữ).
  - **Status:** Trạng thái sản phẩm (ProductStatus Value Object: Draft, Active, Inactive, SoftDeleted, HardDeleted).
  - **Categories:** Danh sách các Category ID mà sản phẩm thuộc về.
  - **Attributes:** Danh sách các ProductAttribute Entities (thuộc tính áp dụng cho toàn bộ sản phẩm).
  - **Variants:** Danh sách các ProductVariant Entities (nếu là sản phẩm có biến thể).
  - **ProductType:** Loại sản phẩm (ProductType Value Object: Simple, Configurable, Virtual, Service).
  - **Brand:** **Optional** Tên hoặc ID Brand (liên kết với Reference Data nếu Brand được quản lý tập trung trong RDM).
  - **MainImageAssetId:** **Optional** ID tham chiếu đến ảnh đại diện trong DAM.
  - **AdditionalImageAssetIds:** Danh sách các ID tham chiếu đến ảnh phụ trong DAM.
  - **CreatedAt:** Thời điểm tạo.
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng.
  - _Behavior:_ Activate, Deactivate, SoftDelete, Restore, AddCategory, RemoveCategory, AddAttribute, UpdateAttribute, AddVariant, RemoveVariant, UpdateVariant, LinkAsset, UnlinkAsset, UpdateBasicInfo.
- **Category:** Là Aggregate Root đại diện cho một danh mục sản phẩm. Category quản lý cấu trúc phân cấp và thông tin của danh mục.
  - **ID:** Unique identifier (UUID).
  - **TenantId:** ID của tổ chức sở hữu danh mục.
  - **Name:** Tên danh mục (có thể đa ngôn ngữ, sử dụng LZM).
  - **Slug:** Chuỗi định danh duy nhất, thân thiện với URL cho danh mục. **Ràng buộc:** Duy nhất trong phạm vi thư mục cha và Tenant.
  - **Description:** Mô tả danh mục (có thể đa ngôn ngữ, sử dụng LZM).
  - **ParentCategoryId:** **Optional** ID của danh mục cha (để xây dựng cây phân cấp). Null cho thư mục gốc của Tenant.
  - **Path:** Đường dẫn đầy đủ của danh mục (ví dụ: "/clothing/mens/t-shirts"). Được tạo tự động. **Ràng buộc:** Duy nhất trong phạm vi Tenant.
  - **Status:** Trạng thái danh mục (CategoryStatus Value Object: Active, Inactive, SoftDeleted, HardDeleted).
  - **ImageAssetId:** **Optional** ID tham chiếu đến ảnh đại diện danh mục trong DAM.
  - **CreatedAt:** Thời điểm tạo.
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng.
  - _Behavior:_ Activate, Deactivate, SoftDelete, Restore, Rename, ChangeParent, LinkAsset, UnlinkAsset.
- **AttributeDefinition:** Aggregate Root để định nghĩa các loại thuộc tính có thể sử dụng trong hệ thống.
  - **ID:** Unique identifier (UUID).
  - **TenantId:** ID của tổ chức sở hữu định nghĩa thuộc tính (hoặc null nếu là thuộc tính hệ thống toàn cục).
  - **Code:** Mã định danh thuộc tính (ví dụ: "color", "size", "material"). **Ràng buộc:** Duy nhất trong phạm vi Tenant (hoặc toàn cục nếu TenantId null).
  - **Name:** Tên thuộc tính (có thể đa ngôn ngữ, sử dụng LZM).
  - **InputType:** Kiểu nhập liệu (AttributeInputType Value Object: Text, Number, Select, MultiSelect, Boolean, Date, etc.).
  - **ValueType:** Kiểu giá trị dữ liệu (AttributeValueType Value Object: String, Integer, Decimal, Boolean, Date).
  - **IsVariantAttribute:** Boolean chỉ định thuộc tính này có thể dùng làm thuộc tính biến thể không.
  - **IsRequired:** Boolean chỉ định thuộc tính này có bắt buộc không khi gán cho sản phẩm/biến thể.
  - **Scope:** Phạm vi áp dụng (AttributeScope Value Object: Global, Tenant). Global cho thuộc tính hệ thống, Tenant cho thuộc tính tùy chỉnh của tổ chức.
  - **Options:** Danh sách các giá trị tùy chọn (AttributeOption Value Objects) nếu InputType là Select/MultiSelect.
  - **CreatedAt:** Thời điểm tạo.
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng.
  - _Behavior:_ AddOption, RemoveOption, UpdateOption, UpdateDefinition.

**Entities (thuộc về các Aggregate Root):**

- **ProductVariant (thuộc Product):** Đại diện cho một biến thể cụ thể của sản phẩm cấu hình được.
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root Product.
  - **SKU:** Mã SKU duy nhất cho biến thể. **Ràng buộc:** Duy nhất trong phạm vi Tenant.
  - **Price:** Giá gốc/giá niêm yết của biến thể (Money Value Object).
  - **Attributes:** Danh sách các ProductAttribute Entities (thuộc tính áp dụng riêng cho biến thể này, ví dụ: Color=Red, Size=M).
  - **MainImageAssetId:** **Optional** ID tham chiếu đến ảnh đại diện biến thể trong DAM.
  - **AdditionalImageAssetIds:** Danh sách các ID tham chiếu đến ảnh phụ biến thể trong DAM.
  - **Status:** Trạng thái biến thể (ProductVariantStatus Value Object: Active, Inactive).
  - **CreatedAt:** Thời điểm tạo.
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng.
  - _Behavior:_ Activate, Deactivate, UpdatePrice, AddAttribute, UpdateAttribute, RemoveAttribute, LinkAsset, UnlinkAsset.
- **ProductAttribute (thuộc Product hoặc ProductVariant):** Đại diện cho một thuộc tính cụ thể được gán cho sản phẩm hoặc biến thể.
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root Product/ProductVariant.
  - **AttributeDefinitionId:** ID của định nghĩa thuộc tính.
  - **Value:** Giá trị của thuộc tính (Value Object phù hợp với AttributeDefinition.ValueType).
  - **CreatedAt:** Thời điểm tạo.
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng.
  - _Behavior:_ UpdateValue.
- **AttributeOption (thuộc AttributeDefinition):** Đại diện cho một giá trị tùy chọn của thuộc tính Select/MultiSelect.
  - **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root AttributeDefinition.
  - **Value:** Giá trị của tùy chọn.
  - **Label:** Nhãn hiển thị của tùy chọn (có thể đa ngôn ngữ, sử dụng LZM).
  - **Order:** Thứ tự hiển thị.
  - **CreatedAt:** Thời điểm tạo.
  - **UpdatedAt:** Thời điểm cập nhật cuối cùng.
  - _Behavior:_ UpdateLabel, UpdateOrder.

**Value Objects:**

- **ProductStatus:** Trạng thái của sản phẩm (Draft, Active, Inactive, SoftDeleted, HardDeleted).
- **CategoryStatus:** Trạng thái của danh mục (Active, Inactive, SoftDeleted, HardDeleted).
- **ProductVariantStatus:** Trạng thái của biến thể sản phẩm (Active, Inactive).
- **ProductType:** Loại sản phẩm (Simple, Configurable, Virtual, Service).
- **AttributeInputType:** Kiểu nhập liệu cho thuộc tính (Text, Number, Select, MultiSelect, Boolean, Date, etc.).
- **AttributeValueType:** Kiểu dữ liệu của giá trị thuộc tính (String, Integer, Decimal, Boolean, Date).
- **AttributeScope:** Phạm vi áp dụng của định nghĩa thuộc tính (Global, Tenant).
- **Money:** Giá trị tiền tệ (Amount, Currency \- liên kết với RDM).
- **LocalizedText:** Giá trị văn bản đa ngôn ngữ (Map\<LocaleCode, String\> \- liên kết với LZM).
- **ProductRelationship:** Loại quan hệ giữa các sản phẩm (Related, Upsell, CrossSell, etc.).
- **ProductQueryCriteria:** Tiêu chí tìm kiếm sản phẩm.
  - **TenantId:** Lọc theo tổ chức.
  - **CategoryId:** Lọc theo danh mục (bao gồm cả danh mục con nếu có tùy chọn).
  - **Keywords:** Tìm kiếm trong tên, mô tả, SKU, metadata asset (phối hợp với DAM).
  - **Status:** Lọc theo trạng thái sản phẩm.
  - **AttributeFilters:** Lọc dựa trên các cặp thuộc tính/giá trị cụ thể.
  - **PriceRange:** Lọc theo khoảng giá gốc/niêm yết.
  - **ProductType:** Lọc theo loại sản phẩm.
  - **IncludeVariants:** Bao gồm cả thông tin biến thể trong kết quả.
  - **Locale:** Locale để bản địa hóa kết quả.
  - **PageNumber, PageSize, SortBy, SortOrder:** Phân trang và sắp xếp.
- **CategoryQueryCriteria:** Tiêu chí tìm kiếm danh mục.
  - **TenantId:** Lọc theo tổ chức.
  - **ParentCategoryId:** Lọc theo danh mục cha (lấy danh mục con trực tiếp).
  - **Name:** Tìm kiếm theo tên danh mục.
  - **IncludeDeleted:** Bao gồm cả danh mục đã xóa mềm.
  - **Locale:** Locale để bản địa hóa kết quả.

## **5\. Ngôn ngữ Chung (Ubiquitous Language)**

Trong Bounded Context PIM, các thuật ngữ sau đây có ý nghĩa cụ thể và nhất quán:

- **Product:** Một mặt hàng hoặc dịch vụ được bán.
- **Simple Product:** Sản phẩm không có biến thể.
- **Configurable Product:** Sản phẩm có các tùy chọn (ví dụ: kích thước, màu sắc) dẫn đến các biến thể khác nhau.
- **Variant:** Một phiên bản cụ thể của sản phẩm cấu hình được, được xác định bởi tập hợp các giá trị thuộc tính biến thể (ví dụ: Áo thun nam Size M màu Đỏ).
- **SKU (Stock Keeping Unit):** Mã định danh duy nhất cho một sản phẩm hoặc biến thể, dùng để theo dõi tồn kho.
- **Category:** Một nhóm sản phẩm được phân loại.
- **Attribute:** Một đặc điểm của sản phẩm hoặc biến thể (ví dụ: Chất liệu, Xuất xứ).
- **Attribute Definition:** Định nghĩa về một loại thuộc tính có thể được sử dụng.
- **Attribute Option:** Một giá trị có thể có của thuộc tính dạng chọn (Select/MultiSelect).
- **Price:** Giá gốc hoặc giá niêm yết của sản phẩm/biến thể. **Không phải giá bán cuối cùng.**
- **Relationship:** Mối liên hệ giữa các sản phẩm (ví dụ: sản phẩm liên quan).
- **Asset:** Tài sản kỹ thuật số (hình ảnh, video) liên quan đến sản phẩm, được lưu trữ trong DAM.
- **Publish:** Quá trình cung cấp thông tin sản phẩm đã hoàn thiện cho các hệ thống khác sử dụng.
- **Draft:** Trạng thái sản phẩm đang được tạo hoặc chỉnh sửa, chưa sẵn sàng để bán.
- **Active:** Trạng thái sản phẩm sẵn sàng để bán và hiển thị.
- **Inactive:** Trạng thái sản phẩm không hiển động, không hiển thị và không thể bán.
- **Soft Delete:** Đánh dấu sản phẩm/danh mục/định nghĩa thuộc tính là đã xóa mềm.
- **Hard Delete:** Xóa vĩnh viễn dữ liệu liên quan.

## **6\. Các Khía cạnh Quan trọng của Miền PIM**

Phần này mô tả các cấu trúc, quy tắc và khái niệm nghiệp vụ quan trọng chi phối hoạt động của Bounded Context PIM.

### **6.1. Quản lý Cấu trúc Sản phẩm (Simple, Configurable, Variant)**

PIM cần hỗ trợ các loại cấu trúc sản phẩm khác nhau:

- **Simple Product:** Sản phẩm độc lập, không có biến thể.
- **Configurable Product:** Là sản phẩm "cha", định nghĩa các tùy chọn thuộc tính biến thể (ví dụ: Size, Color).
- **Product Variant:** Là sản phẩm "con", đại diện cho một sự kết hợp cụ thể của các tùy chọn biến thể (ví dụ: Size M, Color Red). Mỗi Variant có SKU, giá và thông tin riêng.

Mô hình domain và logic nghiệp vụ trong PIM cần quản lý mối quan hệ cha-con giữa Configurable Product và Product Variants, đảm bảo tính nhất quán của dữ liệu giữa các cấp độ.

### **6.2. Quản lý Thuộc tính Sản phẩm (Định nghĩa và Giá trị)**

PIM quản lý thuộc tính ở hai cấp độ:

- **Attribute Definition:** Định nghĩa loại thuộc tính (Code, Name, InputType, ValueType, Scope). Được quản lý như một Aggregate Root riêng vì có thể được sử dụng lại cho nhiều sản phẩm.
- **Product Attribute:** Giá trị cụ thể của một thuộc tính được gán cho một Product hoặc ProductVariant. Được quản lý như Entity bên trong Product/ProductVariant Aggregate.

Logic nghiệp vụ cần đảm bảo rằng khi gán thuộc tính, giá trị phải phù hợp với ValueType và InputType của AttributeDefinition tương ứng, và nếu là thuộc tính biến thể, nó phải được gán cho ProductVariant.

### **6.3. Quản lý Danh mục và Phân cấp**

PIM quản lý danh mục sản phẩm dưới dạng cấu trúc phân cấp (cây thư mục).

- **Category Aggregate:** Mỗi danh mục là một Aggregate Root, quản lý thông tin của danh mục và mối quan hệ cha-con.
- **Liên kết Sản phẩm:** Một sản phẩm có thể thuộc về nhiều danh mục. Mối liên kết này được quản lý trong Product Aggregate (danh sách Category ID).
- **Tính Nhất quán:** Logic nghiệp vụ cần đảm bảo tính duy nhất của tên danh mục trong thư mục cha và xử lý việc di chuyển/xóa danh mục (ví dụ: khi xóa mềm danh mục, các sản phẩm trong đó không bị xóa nhưng có thể bị hủy liên kết hoặc đánh dấu cần xem xét).

### **6.4. Quản lý Quan hệ Sản phẩm**

PIM cho phép định nghĩa các mối quan hệ giữa các sản phẩm (ví dụ: sản phẩm liên quan, sản phẩm mua kèm).

- **Loại Quan hệ:** Các loại quan hệ được định nghĩa (có thể là Reference Data trong RDM).
- **Quản lý trong Product Aggregate:** Mối quan hệ được quản lý trong Product Aggregate (ví dụ: danh sách các Product ID liên quan cùng với loại quan hệ).
- **Tính Đối xứng (tùy chọn):** Một số quan hệ có thể có tính đối xứng (ví dụ: nếu A liên quan đến B thì B cũng liên quan đến A). Logic nghiệp vụ cần xử lý việc này nếu cần.

### **6.5. Tương tác với các BC khác để làm giàu/sử dụng dữ liệu**

PIM là trung tâm dữ liệu sản phẩm nhưng cần tương tác với các BC khác để hoàn thiện và phân phối dữ liệu:

- **Làm giàu:** Phụ thuộc vào LZM (bản địa hóa tên/mô tả/nhãn thuộc tính), RDM (dữ liệu tham chiếu như Brand), DAM (liên kết asset ảnh).
- **Sử dụng:** Cung cấp dữ liệu cho ICM (SKU), OSM/ODM (thông tin bán hàng/đơn hàng), MPM (thông tin khuyến mãi).

Các tương tác này chủ yếu diễn ra thông qua việc PIM phát Event khi dữ liệu thay đổi và các BC khác lắng nghe, hoặc các BC khác gửi Query đến PIM để lấy dữ liệu.

## **7\. Use cases**

Dưới đây là mô tả các use case chính có sự tham gia của PIM, tập trung vào actor, mục đích và các Domain/Application Service liên quan, được phân loại theo các nhóm chức năng chính.

### **7.1. Use Cases liên quan đến Quản lý Sản phẩm (Product Management)**

Nhóm này bao gồm các use case cốt lõi liên quan đến việc tạo, cập nhật và quản lý vòng đời của sản phẩm và biến thể.

- **PIM-UC-7.1.1: Quản lý Sản phẩm (Tạo, Cập nhật, Xóa mềm, Khôi phục)**
  - **Actor:** Người dùng (qua giao diện PIMS), Hệ thống (ví dụ: API tích hợp, Import process).
  - **Mục đích:** Tạo mới, cập nhật thông tin (bao gồm cả biến thể và thuộc tính), thay đổi trạng thái, xóa mềm hoặc khôi phục sản phẩm.
  - **Service liên quan:** Nhận Commands CreateSimpleProductCommand, CreateConfigurableProductCommand, UpdateProductCommand, DeactivateProductCommand, ActivateProductCommand, SoftDeleteProductCommand, RestoreProductCommand. Sử dụng ProductApplicationService (xác thực, ủy quyền). Sử dụng ProductService (thực hiện logic nghiệp vụ, quản lý Aggregate Product). Sử dụng AttributeDefinitionService (kiểm tra định nghĩa thuộc tính). Sử dụng DAM Service (liên kết asset). Phát Domain Events ProductCreated, ProductUpdated, ProductStatusChanged, ProductDeleted, ProductRestored. Gửi Audit Log đến ALM.
- **PIM-UC-7.1.2: Quản lý Biến thể Sản phẩm (Tạo, Cập nhật, Xóa)**
  - **Actor:** Người dùng (qua giao diện PIMS), Hệ thống.
  - **Mục đích:** Thêm mới, cập nhật thông tin (giá, thuộc tính, asset), hoặc xóa biến thể của sản phẩm cấu hình được.
  - **Service liên quan:** Nhận Commands AddVariantCommand, UpdateVariantCommand, RemoveVariantCommand. Sử dụng ProductApplicationService (xác thực, ủy quyền). Sử dụng ProductService (cập nhật Product Aggregate). Sử dụng AttributeDefinitionService (kiểm tra định nghĩa thuộc tính). Sử dụng DAM Service (liên kết asset). Phát Domain Events ProductVariantCreated, ProductVariantUpdated, ProductVariantDeleted. Gửi Audit Log đến ALM.
- **PIM-UC-7.1.3: Quản lý Thuộc tính Sản phẩm trên Sản phẩm/Biến thể**
  - **Actor:** Người dùng (qua giao diện PIMS), Hệ thống.
  - **Mục đích:** Gán, cập nhật giá trị hoặc hủy gán thuộc tính cho sản phẩm hoặc biến thể.
  - **Service liên quan:** Nhận Commands AddProductAttributeCommand, UpdateProductAttributeCommand, RemoveProductAttributeCommand (có thể là một phần của UpdateProduct/UpdateVariant Command). Sử dụng ProductApplicationService (xác thực, ủy quyền). Sử dụng ProductService (cập nhật Product/ProductVariant Aggregate). Sử dụng AttributeDefinitionService (kiểm tra định nghĩa thuộc tính). Phát Domain Event ProductAttributeUpdated. Gửi Audit Log đến ALM.
- **PIM-UC-7.1.4: Quản lý Quan hệ Sản phẩm**
  - **Actor:** Người dùng (qua giao diện PIMS).
  - **Mục đích:** Định nghĩa và quản lý các mối quan hệ giữa các sản phẩm (liên quan, mua kèm, v.v.).
  - **Service liên quan:** Nhận Commands AddProductRelationshipCommand, RemoveProductRelationshipCommand. Sử dụng ProductApplicationService (xác thực, ủy quyền). Sử dụng ProductService (cập nhật Product Aggregate). Phát Domain Events ProductRelationshipAdded, ProductRelationshipRemoved. Gửi Audit Log đến ALM.

### **7.2. Use Cases liên quan đến Quản lý Danh mục (Category Management)**

Nhóm này bao gồm các use case liên quan đến việc tổ chức sản phẩm trong cấu trúc danh mục.

- **PIM-UC-7.2.1: Quản lý Danh mục (Tạo, Cập nhật, Xóa mềm, Khôi phục)**
  - **Actor:** Người dùng (qua giao diện PIMS).
  - **Mục đích:** Tạo mới, cập nhật thông tin, thay đổi cấu trúc phân cấp, xóa mềm hoặc khôi phục danh mục.
  - **Service liên quan:** Nhận Commands CreateCategoryCommand, UpdateCategoryCommand, DeactivateCategoryCommand, ActivateCategoryCommand, SoftDeleteCategoryCommand, RestoreCategoryCommand, ChangeParentCategoryCommand. Sử dụng CategoryApplicationService (xác thực, ủy quyền). Sử dụng CategoryService (quản lý Aggregate Category, xử lý cây danh mục). Phát Domain Events CategoryCreated, CategoryUpdated, CategoryStatusChanged, CategoryDeleted, CategoryRestored. Gửi Audit Log đến ALM.
- **PIM-UC-7.2.2: Liên kết/Hủy liên kết Sản phẩm với Danh mục**
  - **Actor:** Người dùng (qua giao diện PIMS).
  - **Mục đích:** Gán sản phẩm vào một hoặc nhiều danh mục, hoặc hủy gán.
  - **Service liên quan:** Nhận Commands LinkProductToCategoryCommand, UnlinkProductFromCategoryCommand. Sử dụng CategoryApplicationService (xác thực, ủy quyền). Sử dụng CategoryService (cập nhật liên kết trong Category Aggregate nếu cần) và ProductService (cập nhật liên kết trong Product Aggregate). Phát Domain Events ProductCategorized, ProductUncategorized. Gửi Audit Log đến ALM.

### **7.3. Use Cases liên quan đến Quản lý Định nghĩa Thuộc tính (Attribute Definition Management)**

Nhóm này bao gồm các use case liên quan đến việc định nghĩa các loại thuộc tính có thể áp dụng cho sản phẩm.

- **PIM-UC-7.3.1: Quản lý Định nghĩa Thuộc tính (Tạo, Cập nhật, Xóa mềm)**
  - **Actor:** Người dùng (qua giao diện PIMS).
  - **Mục đích:** Định nghĩa các loại thuộc tính có thể sử dụng cho sản phẩm/biến thể, bao gồm cả các tùy chọn giá trị.
  - **Service liên quan:** Nhận Commands CreateAttributeDefinitionCommand, UpdateAttributeDefinitionCommand, DeactivateAttributeDefinitionCommand, ActivateAttributeDefinitionCommand, SoftDeleteAttributeDefinitionCommand. Sử dụng AttributeDefinitionApplicationService (xác thực, ủy quyền). Sử dụng AttributeDefinitionService (quản lý Aggregate AttributeDefinition). Phát Domain Events AttributeDefinitionCreated, AttributeDefinitionUpdated, AttributeDefinitionStatusChanged, AttributeDefinitionDeleted. Gửi Audit Log đến ALM.

### **7.4. Use Cases liên quan đến Truy vấn và Cung cấp Dữ liệu (Querying & Serving)**

Nhóm này bao gồm các use case cho phép các BC khác tìm kiếm và lấy thông tin sản phẩm.

- **PIM-UC-7.4.1: Cung cấp Thông tin Sản phẩm cho các Bounded Context khác**
  - **Actor:** Các Bounded Context khác (OSM, ODM, MPM, CRM, WPM, Client Apps).
  - **Mục đích:** Lấy thông tin chi tiết sản phẩm, danh sách sản phẩm theo tiêu chí, thông tin danh mục, hoặc định nghĩa thuộc tính.
  - **Service liên quan:** Nhận Queries GetProductDetailsQuery, SearchProductsQuery, GetProductsByCategoryQuery, GetCategoryDetailsQuery, GetAttributeDefinitionQuery. Sử dụng ProductQueryApplicationService (xác thực, ủy quyền). Sử dụng ProductQueryService (thực hiện truy vấn). Sử dụng LZM Service (bản địa hóa). Sử dụng DAM Service (lấy URL asset \- có thể gọi trực tiếp từ BC tiêu thụ sau khi lấy ID asset từ PIM).

### **7.5. Use Cases liên quan đến Vòng đời Dữ liệu (Data Lifecycle)**

Nhóm này bao gồm các use case liên quan đến việc xóa dữ liệu sản phẩm theo Tenant.

- **PIM-UC-7.5.1: Xóa Cứng Dữ liệu Sản phẩm của Tenant**
  - **Actor:** Hệ thống (Lắng nghe Event từ BUM).
  - **Mục đích:** Xóa vĩnh viễn tất cả sản phẩm, danh mục, định nghĩa thuộc tính liên quan đến một Tenant khi Tenant đó bị xóa.
  - **Service liên quan:** Lắng nghe Event TenantDataDeletionRequested. Sử dụng ProductApplicationService (hoặc Service chuyên biệt cho xóa dữ liệu Tenant). Sử dụng ProductService, CategoryService, AttributeDefinitionService (xóa cứng bản ghi). Phát Domain Events ProductHardDeleted, CategoryHardDeleted, AttributeDefinitionHardDeleted. Gửi Audit Log đến ALM.

## **8\. Domain Services**

Domain Services trong PIM chứa logic nghiệp vụ quan trọng không thuộc về một Aggregate Root cụ thể hoặc cần phối hợp nhiều Aggregate Root.

- **ProductService:**
  - **Trách nhiệm:** Quản lý vòng đời của Product Aggregate (tạo, cập nhật, xóa mềm, khôi phục). Quản lý các Entity ProductVariant, ProductAttribute bên trong Product. Thực hiện các quy tắc nghiệp vụ liên quan đến Product và Variant (ví dụ: kiểm tra SKU duy nhất, kiểm tra tính hợp lệ của thuộc tính, quản lý trạng thái). Phối hợp với Product Repository, AttributeDefinitionService (để kiểm tra định nghĩa thuộc tính), DAM Service (để xác thực Asset ID), CategoryService (khi liên kết/hủy liên kết danh mục).
  - **Các phương thức tiềm năng:** CreateSimpleProduct(tenantId, details), CreateConfigurableProduct(tenantId, details), UpdateProduct(productId, tenantId, updates), DeactivateProduct(productId, tenantId), ActivateProduct(productId, tenantId), SoftDeleteProduct(productId, tenantId), RestoreProduct(productId, tenantId), HardDeleteProduct(productId, tenantId), HardDeleteProductsByTenant(tenantId), AddVariant(productId, tenantId, variantDetails), UpdateVariant(productId, tenantId, variantId, updates), RemoveVariant(productId, tenantId, variantId), AddProductRelationship(productId, tenantId, relatedProductId, relationshipType), RemoveProductRelationship(productId, tenantId, relatedProductId, relationshipType).
- **CategoryService:**
  - **Trách nhiệm:** Quản lý vòng đời của Category Aggregate (tạo, cập nhật, xóa mềm, khôi phục). Quản lý cấu trúc phân cấp. Thực hiện các quy tắc nghiệp vụ liên quan đến Category (ví dụ: kiểm tra tính duy nhất của tên, xử lý cây thư mục khi di chuyển/xóa). Phối hợp với Category Repository, ProductService (khi liên kết/hủy liên kết sản phẩm).
  - **Các phương thức tiềm năng:** CreateCategory(tenantId, details), UpdateCategory(categoryId, tenantId, updates), DeactivateCategory(categoryId, tenantId), ActivateCategory(categoryId, tenantId), SoftDeleteCategory(categoryId, tenantId), RestoreCategory(categoryId, tenantId), HardDeleteCategory(categoryId, tenantId), HardDeleteCategoriesByTenant(tenantId), ChangeParentCategory(categoryId, tenantId, newParentId).
- **AttributeDefinitionService:**
  - **Trách nhiệm:** Quản lý vòng đời của AttributeDefinition Aggregate (tạo, cập nhật, xóa mềm, khôi phục). Quản lý các Entity AttributeOption bên trong. Thực hiện các quy tắc nghiệp vụ liên quan đến AttributeDefinition (ví dụ: kiểm tra tính duy nhất của mã, kiểm tra tính hợp lệ của tùy chọn). Phối hợp với AttributeDefinition Repository.
  - **Các phương thức tiềm năng:** CreateAttributeDefinition(tenantId, details), UpdateAttributeDefinition(attributeDefinitionId, tenantId, updates), DeactivateAttributeDefinition(attributeDefinitionId, tenantId), ActivateAttributeDefinition(attributeDefinitionId, tenantId), SoftDeleteAttributeDefinition(attributeDefinitionId, tenantId), RestoreAttributeDefinition(attributeDefinitionId, tenantId), HardDeleteAttributeDefinition(attributeDefinitionId, tenantId), HardDeleteAttributeDefinitionsByTenant(tenantId), AddAttributeOption(attributeDefinitionId, tenantId, optionDetails), UpdateAttributeOption(attributeDefinitionId, tenantId, optionId, updates), RemoveAttributeOption(attributeDefinitionId, tenantId, optionId).
- **ProductQueryService:**
  - **Trách nhiệm:** Cung cấp các phương thức truy vấn dữ liệu sản phẩm, danh mục và định nghĩa thuộc tính tối ưu cho các nhu cầu khác nhau (ví dụ: hiển thị danh sách, xem chi tiết, tìm kiếm). Phối hợp với Product Repository, Category Repository, AttributeDefinition Repository, LZM Service (để bản địa hóa kết quả), DAM Service (để lấy thông tin asset liên quan).
  - **Các phương thức tiềm năng:** GetProductDetails(productId, tenantId, locale), GetProductDetailsBySlug(slug, tenantId, locale), SearchProducts(criteria, tenantId, locale), GetProductsByCategory(categoryId, tenantId, locale), GetCategoryDetails(categoryId, tenantId, locale), GetCategoryTree(tenantId, locale), GetAttributeDefinition(attributeDefinitionId, tenantId, locale), ListAttributeDefinitions(criteria, tenantId, locale).

## **9\. Application Services**

Application Services trong PIM là lớp mỏng điều phối các hành động từ bên ngoài (ví dụ: từ API Gateway, Message Broker) đến Domain Model (Aggregate Roots, Domain Services). Chúng xử lý các tác vụ kỹ thuật như xác thực, ủy quyền (thông qua IAM), giao dịch cơ sở dữ liệu, và phát sự kiện.

- **ProductApplicationService:**
  - **Trách nhiệm:** Xử lý các command liên quan đến quản lý Product và Variant từ API (ví dụ: CreateSimpleProductCommand, UpdateProductCommand, DeactivateProductCommand). Sử dụng ProductService và Product Repository. Thực hiện ủy quyền với IAM. Bắt và xử lý các Business Rule Exception từ Domain Service. Phát Domain Events. Gửi Audit Log đến ALM. Lắng nghe event xóa Tenant từ BUM.
  - **Các phương thức tiềm năng:** HandleCreateSimpleProductCommand(command), HandleCreateConfigurableProductCommand(command), HandleUpdateProductCommand(command), HandleDeactivateProductCommand(command), HandleActivateProductCommand(command), HandleSoftDeleteProductCommand(command), HandleRestoreProductCommand(command), HandleAddVariantCommand(command), HandleUpdateVariantCommand(command), HandleRemoveVariantCommand(command), HandleAddProductRelationshipCommand(command), HandleRemoveProductRelationshipCommand(command), HandleTenantDataDeletionRequestedEvent(event).
- **CategoryApplicationService:**
  - **Trách nhiệm:** Xử lý các command liên quan đến quản lý Category từ API (ví dụ: CreateCategoryCommand, LinkProductToCategoryCommand). Sử dụng CategoryService, ProductService và các Repository tương ứng. Thực hiện ủy quyền với IAM. Bắt và xử lý các Business Rule Exception từ Domain Service. Phát Domain Events. Gửi Audit Log đến ALM. Lắng nghe event xóa Tenant từ BUM.
  - **Các phương thức tiềm năng:** HandleCreateCategoryCommand(command), HandleUpdateCategoryCommand(command), HandleDeactivateCategoryCommand(command), HandleActivateCategoryCommand(command), HandleSoftDeleteCategoryCommand(command), HandleRestoreCategoryCommand(command), HandleChangeParentCategoryCommand(command), HandleLinkProductToCategoryCommand(command), HandleUnlinkProductFromCategoryCommand(command), HandleTenantDataDeletionRequestedEvent(event).
- **AttributeDefinitionApplicationService:**
  - **Trách nhiệm:** Xử lý các command liên quan đến quản lý AttributeDefinition từ API (ví dụ: CreateAttributeDefinitionCommand). Sử dụng AttributeDefinitionService và AttributeDefinition Repository. Thực hiện ủy quyền với IAM. Bắt và xử lý các Business Rule Exception từ Domain Service. Phát Domain Events. Gửi Audit Log đến ALM. Lắng nghe event xóa Tenant từ BUM.
  - **Các phương thức tiềm năng:** HandleCreateAttributeDefinitionCommand(command), HandleUpdateAttributeDefinitionCommand(command), HandleDeactivateAttributeDefinitionCommand(command), HandleActivateAttributeDefinitionCommand(command), HandleSoftDeleteAttributeDefinitionCommand(command), HandleRestoreAttributeDefinitionCommand(command), HandleAddAttributeOptionCommand(command), HandleUpdateAttributeOptionCommand(command), HandleRemoveAttributeOptionCommand(command), HandleTenantDataDeletionRequestedEvent(event).
- **ProductQueryApplicationService:**
  - **Trách nhiệm:** Xử lý các query để lấy thông tin sản phẩm, danh mục, định nghĩa thuộc tính (ví dụ: GetProductDetailsQuery, SearchProductsQuery). Sử dụng ProductQueryService hoặc các Domain Service tương ứng. Thực hiện ủy quyền với IAM.
  - **Các phương thức tiềm năng:** HandleGetProductDetailsQuery(query), HandleGetProductDetailsBySlugQuery(query), HandleSearchProductsQuery(query), HandleGetProductsByCategoryQuery(query), HandleGetCategoryDetailsQuery(query), HandleGetCategoryTreeQuery(query), HandleGetAttributeDefinitionQuery(query), HandleListAttributeDefinitionsQuery(query).

## **10\. Domain Events**

PIM sẽ phát ra các Domain Event quan trọng để thông báo cho các Bounded Context khác về những thay đổi trạng thái nghiệp vụ trong phạm vi của nó.

### **10.1. Domain Events (PIM Phát ra)**

- **ProductCreated**
  - Phát ra khi một sản phẩm mới được tạo.
  - **Payload:**
    - ProductId (UUID)
    - TenantId (UUID)
    - SKU (String, optional)
    - ProductType (String)
    - Status (String)
    - Name (LocalizedText)
    - Slug (String)
    - CreatedByUserId (UUID)
    - IssuedAt (DateTime)
- **ProductUpdated**
  - Phát ra khi thông tin sản phẩm được cập nhật (bao gồm cả thông tin chung, thuộc tính sản phẩm).
  - **Payload:**
    - ProductId (UUID)
    - TenantId (UUID)
    - UpdatedByUserId (UUID)
    - UpdatedFields (List of String \- ví dụ: "Name", "Description", "Status", "Attributes")
    - IssuedAt (DateTime)
- **ProductStatusChanged**
  - Phát ra khi trạng thái sản phẩm thay đổi (ví dụ: từ Draft sang Active).
  - **Payload:**
    - ProductId (UUID)
    - TenantId (UUID)
    - OldStatus (String)
    - NewStatus (String)
    - ChangedByUserId (UUID)
    - IssuedAt (DateTime)
- **ProductSoftDeleted**
  - Phát ra khi một sản phẩm bị xóa mềm.
  - **Payload:**
    - ProductId (UUID)
    - TenantId (UUID)
    - DeletedByUserId (UUID)
    - IssuedAt (DateTime)
- **ProductRestored**
  - Phát ra khi một sản phẩm bị xóa mềm được khôi phục.
  - **Payload:**
    - ProductId (UUID)
    - TenantId (UUID)
    - RestoredByUserId (UUID)
    - IssuedAt (DateTime)
- **ProductHardDeleted**
  - Phát ra khi một sản phẩm bị xóa cứng (do xóa Tenant).
  - **Payload:**
    - ProductId (UUID)
    - TenantId (UUID)
    - IssuedAt (DateTime)
- **ProductVariantCreated**
  - Phát ra khi một biến thể mới được tạo cho sản phẩm cấu hình được.
  - **Payload:**
    - ProductId (UUID)
    - VariantId (UUID)
    - TenantId (UUID)
    - SKU (String)
    - Price (Money)
    - Attributes (Map\<AttributeCode, Value\>)
    - CreatedByUserId (UUID)
    - IssuedAt (DateTime)
- **ProductVariantUpdated**
  - Phát ra khi thông tin biến thể được cập nhật (giá, thuộc tính, asset).
  - **Payload:**
    - ProductId (UUID)
    - VariantId (UUID)
    - TenantId (UUID)
    - UpdatedByUserId (UUID)
    - UpdatedFields (List of String \- ví dụ: "Price", "Attributes", "Assets")
    - IssuedAt (DateTime)
- **ProductVariantStatusChanged**
  - Phát ra khi trạng thái biến thể thay đổi.
  - **Payload:**
    - ProductId (UUID)
    - VariantId (UUID)
    - TenantId (UUID)
    - OldStatus (String)
    - NewStatus (String)
    - ChangedByUserId (UUID)
    - IssuedAt (DateTime)
- **ProductVariantDeleted**
  - Phát ra khi một biến thể bị xóa.
  - **Payload:**
    - ProductId (UUID)
    - VariantId (UUID)
    - TenantId (UUID)
    - SKU (String)
    - DeletedByUserId (UUID)
    - IssuedAt (DateTime)
- **CategoryCreated**
  - Phát ra khi một danh mục mới được tạo.
  - **Payload:**
    - CategoryId (UUID)
    - TenantId (UUID)
    - Name (LocalizedText)
    - Slug (String)
    - ParentCategoryId (UUID, optional)
    - CreatedByUserId (UUID)
    - IssuedAt (DateTime)
- **CategoryUpdated**
  - Phát ra khi thông tin danh mục được cập nhật.
  - **Payload:**
    - CategoryId (UUID)
    - TenantId (UUID)
    - UpdatedByUserId (UUID)
    - UpdatedFields (List of String)
    - IssuedAt (DateTime)
- **CategoryStatusChanged**
  - Phát ra khi trạng thái danh mục thay đổi.
  - **Payload:**
    - CategoryId (UUID)
    - TenantId (UUID)
    - OldStatus (String)
    - NewStatus (String)
    - ChangedByUserId (UUID)
    - IssuedAt (DateTime)
- **CategorySoftDeleted**
  - Phát ra khi một danh mục bị xóa mềm.
  - **Payload:**
    - CategoryId (UUID)
    - TenantId (UUID)
    - DeletedByUserId (UUID)
    - IssuedAt (DateTime)
- **CategoryRestored**
  - Phát ra khi một danh mục bị xóa mềm được khôi phục.
  - **Payload:**
    - CategoryId (UUID)
    - TenantId (UUID)
    - RestoredByUserId (UUID)
    - IssuedAt (DateTime)
- **CategoryHardDeleted**
  - Phát ra khi một danh mục bị xóa cứng (do xóa Tenant).
  - **Payload:**
    - CategoryId (UUID)
    - TenantId (UUID)
    - IssuedAt (DateTime)
- **ProductCategorized**
  - Phát ra khi sản phẩm được liên kết với danh mục.
  - **Payload:**
    - ProductId (UUID)
    - TenantId (UUID)
    - CategoryId (UUID)
    - IssuedAt (DateTime)
- **ProductUncategorized**
  - Phát ra khi sản phẩm bị hủy liên kết với danh mục.
  - **Payload:**
    - ProductId (UUID)
    - TenantId (UUID)
    - CategoryId (UUID)
    - IssuedAt (DateTime)
- **AttributeDefinitionCreated**
  - Phát ra khi một định nghĩa thuộc tính mới được tạo.
  - **Payload:**
    - AttributeDefinitionId (UUID)
    - TenantId (UUID, optional)
    - Code (String)
    - Name (LocalizedText)
    - InputType (String)
    - ValueType (String)
    - Scope (String)
    - CreatedByUserId (UUID)
    - IssuedAt (DateTime)
- **AttributeDefinitionUpdated**
  - Phát ra khi một định nghĩa thuộc tính được cập nhật (bao gồm cả tùy chọn).
  - **Payload:**
    - AttributeDefinitionId (UUID)
    - TenantId (UUID, optional)
    - UpdatedByUserId (UUID)
    - UpdatedFields (List of String)
    - IssuedAt (DateTime)
- **AttributeDefinitionStatusChanged**
  - Phát ra khi trạng thái định nghĩa thuộc tính thay đổi.
  - **Payload:**
    - AttributeDefinitionId (UUID)
    - TenantId (UUID, optional)
    - OldStatus (String)
    - NewStatus (String)
    - ChangedByUserId (UUID)
    - IssuedAt (DateTime)
- **AttributeDefinitionSoftDeleted**
  - Phát ra khi một định nghĩa thuộc tính bị xóa mềm.
  - **Payload:**
    - AttributeDefinitionId (UUID)
    - TenantId (UUID, optional)
    - DeletedByUserId (UUID)
    - IssuedAt (DateTime)
- **AttributeDefinitionRestored**
  - Phát ra khi một định nghĩa thuộc tính bị xóa mềm được khôi phục.
  - **Payload:**
    - AttributeDefinitionId (UUID)
    - TenantId (UUID, optional)
    - RestoredByUserId (UUID)
    - IssuedAt (DateTime)
- **AttributeDefinitionHardDeleted**
  - Phát ra khi một định nghĩa thuộc tính bị xóa cứng (do xóa Tenant).
  - **Payload:**
    - AttributeDefinitionId (UUID)
    - TenantId (UUID, optional)
    - IssuedAt (DateTime)
- **ProductAttributeUpdated**
  - Phát ra khi giá trị thuộc tính của sản phẩm hoặc biến thể được cập nhật.
  - **Payload:**
    - ProductId (UUID)
    - VariantId (UUID, optional \- nếu là thuộc tính biến thể)
    - TenantId (UUID)
    - AttributeDefinitionId (UUID)
    - OldValue (Object)
    - NewValue (Object)
    - UpdatedByUserId (UUID)
    - IssuedAt (DateTime)
- **ProductRelationshipAdded**
  - Phát ra khi một quan hệ sản phẩm được thêm vào.
  - **Payload:**
    - ProductId (UUID)
    - TenantId (UUID)
    - RelatedProductId (UUID)
    - RelationshipType (String)
    - IssuedAt (DateTime)
- **ProductRelationshipRemoved**
  - Phát ra khi một quan hệ sản phẩm bị xóa.
  - **Payload:**
    - ProductId (UUID)
    - TenantId (UUID)
    - RelatedProductId (UUID)
    - RelationshipType (String)
    - IssuedAt (DateTime)

### **10.2. Domain Events Được Xử lý (Consumed Domain Events)**

PIM lắng nghe và xử lý các Domain Event từ các Bounded Context khác chủ yếu để duy trì tính nhất quán dữ liệu và phản ứng với các thay đổi liên quan.

- **AssetHardDeleted** (Từ DAM)
  - Phát ra khi một Asset bị xóa cứng khỏi DAM.
  - **Mục đích xử lý:** PIM lắng nghe event này để kiểm tra xem Asset bị xóa có đang được liên kết với bất kỳ sản phẩm, biến thể, hoặc danh mục nào không. Nếu có, PIM sẽ hủy liên kết đó và có thể phát sự kiện cảnh báo nội bộ hoặc đánh dấu sản phẩm/danh mục cần xem xét.
  - **Payload dự kiến:**
    - AssetId (UUID)
    - TenantId (UUID)
    - IssuedAt (DateTime)
- **TenantDataDeletionRequested** (Từ BUM)
  - Phát ra khi một Tenant được yêu cầu xóa dữ liệu vĩnh viễn khỏi hệ thống.
  - **Mục đích xử lý:** PIM lắng nghe event này để kích hoạt quy trình xóa cứng tất cả dữ liệu (Product, Category, AttributeDefinition) thuộc về Tenant đó.
  - **Payload dự kiến:**
    - TenantId (UUID)
    - RequestedAt (DateTime)
    - IssuedAt (DateTime)
- **LocaleUpdated** (Từ RDM/LZM)
  - Phát ra khi thông tin về Locale hoặc ngôn ngữ gốc thay đổi.
  - **Mục đích xử lý:** PIM có thể lắng nghe event này nếu cần cập nhật thông tin về các locale được hỗ trợ hoặc ngôn ngữ gốc để đảm bảo việc bản địa hóa metadata và nhãn thuộc tính là chính xác.
  - **Payload dự kiến:** (Thông tin Locale/Ngôn ngữ đã cập nhật).
- **ReferenceDataItemUpdated** (Từ RDM)
  - Phát ra khi một mục dữ liệu tham chiếu (ví dụ: một Brand) được cập nhật trong RDM.
  - **Mục đích xử lý:** PIM có thể lắng nghe event này nếu Brand hoặc các dữ liệu tham chiếu khác được PIM sử dụng thay đổi, để cập nhật thông tin tương ứng trong PIM hoặc đánh dấu sản phẩm cần xem xét.
  - **Payload dự kiến:** (Thông tin mục dữ liệu tham chiếu đã cập nhật).

## **11\. Ranh giới Nghiệp vụ**

Ranh giới của Bounded Context PIM được xác định bởi trách nhiệm quản lý tập trung, làm giàu và chuẩn hóa thông tin chi tiết về sản phẩm và danh mục. PIM là nguồn sự thật duy nhất cho dữ liệu master về sản phẩm.

PIM không chịu trách nhiệm:

- **Lưu trữ và quản lý file tài sản kỹ thuật số thực tế:** Trách nhiệm này thuộc về DAM. PIM chỉ lưu trữ ID tham chiếu. PIM phản ứng với các sự kiện từ DAM.
- **Quản lý số lượng tồn kho thực tế:** Trách nhiệm này thuộc về ICM. PIM chỉ cung cấp SKU và thông tin sản phẩm liên quan. ICM lắng nghe các sự kiện từ PIM.
- **Xử lý các giao dịch bán hàng hoặc quản lý đơn hàng:** Trách nhiệm này thuộc về OSM và ODM. OSM/ODM lắng nghe và truy vấn PIM.
- **Tính toán giá bán cuối cùng có áp dụng khuyến mãi:** Trách nhiệm này thuộc về MPM hoặc các BC bán hàng. PIM chỉ quản lý giá gốc/niêm yết. MPM lắng nghe và truy vấn PIM.
- **Quản lý thông tin khách hàng:** Trách nhiệm này thuộc về CRM. CRM truy vấn PIM.
- **Quản lý nội dung thông báo:** Trách nhiệm này thuộc về NDM. NDM truy vấn PIM (nếu cần thông tin sản phẩm trong thông báo).
- **Quản lý bản dịch văn bản hoặc quy tắc định dạng locale:** Trách nhiệm này thuộc về LZM và RDM. PIM sử dụng dịch vụ của LZM/RDM.
- **Ghi nhận audit logs:** Chỉ phát sự kiện cho ALM. ALM lắng nghe các sự kiện từ PIM.
- **Quản lý các miền nghiệp vụ khác** như nhân sự (HRM), công việc (WPM), tài chính (FAM), vận chuyển (SFM), thanh toán (PPM). Các BC này có thể truy vấn PIM nếu cần thông tin sản phẩm.

## **12\. Kết luận**

Bounded Context Product Information Management (PIM) là một thành phần cốt lõi quan trọng trong hệ thống Ecoma, đảm bảo tính nhất quán và độ chính xác của dữ liệu sản phẩm trên toàn bộ nền tảng. Bằng cách tập trung trách nhiệm quản lý thông tin sản phẩm vào một Context duy nhất, PIM cung cấp một nguồn dữ liệu đáng tin cậy cho các hoạt động bán hàng, marketing, tồn kho và các quy trình nghiệp vụ khác. Việc thiết kế PIM với mô hình domain rõ ràng (Product, Category, AttributeDefinition là Aggregate Root), các khía cạnh quan trọng được làm rõ (cấu trúc sản phẩm, thuộc tính, danh mục, quan hệ), tương tác được định nghĩa (với IAM, LZM, RDM, DAM, ICM, OSM, ODM, MPM, CRM, WPM) và các sự kiện nghiệp vụ phù hợp là nền tảng để xây dựng một hệ thống e-commerce mạnh mẽ và dễ mở rộng.

Tài liệu này đã được cập nhật để tuân thủ cấu trúc và mức độ chi tiết của các tài liệu IAM và BUM, bao gồm việc bổ sung phần Các Khía cạnh Quan trọng của Miền, tổ chức lại luồng nghiệp vụ thành Use Cases và chi tiết hóa các Domain Event (Published/Consumed, payload dự kiến). Đây là nền tảng để chuyển sang giai đoạn thiết kế kỹ thuật chi tiết và triển khai Microservice PIM.
