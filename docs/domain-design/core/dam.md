# **Tài liệu Thiết kế Miền: Bounded Context Digital Asset Management (DAM)**

## **1\. Giới thiệu**

Tài liệu này cung cấp mô tả chi tiết về Bounded Context **Digital Asset Management (DAM)** trong hệ thống Ecoma. DAM là một trong những Bounded Context cốt lõi (Core Bounded Context), đóng vai trò là kho lưu trữ tập trung và quản lý toàn bộ các tài sản kỹ thuật số (hình ảnh, video, tài liệu, v.v.) được sử dụng trên toàn bộ nền tảng Ecoma.

DAM đảm bảo rằng các tài sản kỹ thuật số được lưu trữ an toàn, có tổ chức, dễ dàng tìm kiếm, quản lý vòng đời và phân phối đến các Bounded Context hoặc hệ thống khác khi cần. DAM là nguồn sự thật duy nhất về bản thân các file tài sản và thông tin mô tả của chúng trong hệ thống.

## **2\. Phạm vi của Tài liệu**

Tài liệu này tập trung vào việc định nghĩa và mô tả Bounded Context DAM ở cấp độ thiết kế miền (domain design), cung cấp đủ chi tiết để hỗ trợ việc thiết kế các Domain Service và Application Service. Cụ thể, tài liệu này bao gồm:

* Xác định vai trò và trách nhiệm chính của DAM.  
* Mô tả các khái niệm và thực thể cốt lõi trong mô hình domain của DAM ở cấp độ chi tiết hơn, bao gồm các Aggregate Root, Entity và Value Object với các thuộc tính chính, cung cấp thêm ví dụ và ngữ cảnh cho từng loại.  
* Định nghĩa Ngôn ngữ Chung (Ubiquitous Language) trong phạm vi DAM.  
* Mô tả **Các Khía cạnh Quan trọng của Miền DAM**, bao gồm quản lý phiên bản (versioning) và phiên bản (rendition), xử lý file vật lý và tương tác với hệ thống lưu trữ ngoài, quản lý quyền truy cập theo phạm vi tổ chức (bao gồm tài sản nội bộ), và xử lý lỗi trong quá trình tải lên/xử lý file.  
* Làm rõ các tương tác chính giữa DAM và các Bounded Context khác, đặc biệt là cách DAM tương tác với IAM (cho ủy quyền), LZM (cho bản địa hóa metadata), ALM (cho audit log), và cách các BC khác sử dụng tài sản từ DAM.  
* Phác thảo các **Use cases** chính có sự tham gia của DAM, tập trung vào actor, mục đích và các Domain/Application Service liên quan, bao gồm tải lên tài sản (với xử lý phiên bản lịch sử và tạo rendition), quản lý thư mục, cập nhật metadata (bao gồm đa ngôn ngữ), tạo phiên bản (rendition) theo yêu cầu, cung cấp quyền truy cập tài sản (bao gồm tạo URL an toàn), tìm kiếm và lọc tài sản, và quản lý vòng đời dữ liệu (xóa mềm/cứng).  
* Xác định ranh giới nghiệp vụ của DAM, nhấn mạnh những gì DAM không chịu trách nhiệm.  
* Đề xuất các Domain Service và Application Service tiềm năng trong DAM với mô tả chi tiết hơn về trách nhiệm của từng Service.  
* Làm rõ các quy tắc nghiệp vụ liên quan đến quản lý tài sản (ví dụ: tính duy nhất của tên file trong thư mục, quy tắc tạo rendition, chính sách xóa) được mô tả ở cấp độ thiết kế miền.  
* Liệt kê và mô tả các **Domain Events** mà DAM tương tác, được chia thành các sự kiện DAM **phát ra** (Published Events) và các sự kiện DAM **lắng nghe và xử lý** (Consumed Events), bao gồm payload dự kiến của từng event.

**Trong phạm vi tài liệu này:**

* Các khái niệm về **Commands** (yêu cầu thực hiện một hành động) và **Queries** (yêu cầu lấy dữ liệu) được đề cập để mô tả cách các Bounded Context khác tương tác với DAM (quản lý tài sản, truy vấn tài sản) và cách các luồng nghiệp vụ được kích hoạt thông qua các **Application Services**.  
* Vai trò và trách nhiệm của **Domain Services** và **Application Services** trong việc xử lý logic nghiệp vụ và điều phối các tương tác được mô tả ở cấp độ chức năng.  
* Các **Domain Events** quan trọng được xác định để mô tả những thay đổi trạng thái nghiệp vụ mà DAM phát ra (ví dụ: tài sản mới được tải lên, metadata cập nhật, tài sản bị xóa), hỗ trợ các BC khác phản ứng với thay đổi.  
* Các quy tắc nghiệp vụ liên quan đến quản lý tài sản (ví dụ: tính duy nhất của tên file trong thư mục, quy tắc tạo rendition, chính sách xóa) được mô tả ở cấp độ thiết kế miền.  
* Khả năng quản lý **phiên bản (versioning)** của file gốc và tạo **phiên bản (rendition)** khác nhau được làm rõ trong mô hình domain và các khíaAspect quan trọng.  
* Tương tác nghiệp vụ với hệ thống lưu trữ file vật lý bên ngoài được mô tả dưới dạng **External Storage Service**.  
* Yêu cầu về **hiệu năng truy vấn** và **ghi log audit** cho các hoạt động quản lý được đề cập.  
* Cân nhắc về việc quản lý quyền truy cập theo **phạm vi tổ chức (Tenant)** và **tài sản nội bộ** được đề cập trong mô hình domain và tương tác với IAM.

**Ngoài phạm vi tài liệu này (thuộc về thiết kế kỹ thuật chi tiết):**

* Định nghĩa chính xác cấu trúc dữ liệu (payload) chi tiết của từng Command, Query và Domain Event (chỉ mô tả mục đích và thông tin cốt lõi).  
* Định nghĩa chi tiết các API Interface (chỉ mô tả chức năng và tương tác).  
* Chi tiết cài đặt kỹ thuật của Microservice DAM (ngôn ngữ lập trình, framework, kiến trúc nội bộ chi tiết).  
* Cấu trúc cơ sở dữ liệu chi tiết (schema) của DAM, bao gồm cách lưu trữ metadata đa ngôn ngữ và thông tin phiên bản/rendition.  
* Các quyết định công nghệ cụ thể bên trong DAM (ví dụ: công cụ xử lý ảnh/video cụ thể, loại cơ sở dữ liệu sử dụng, chiến lược caching URL truy cập).  
* Luồng dữ liệu chi tiết đến cấp độ từng trường thông tin giữa DAM và các BC khác.  
* Cấu hình hạ tầng triển khai cụ thể cho Microservice DAM.  
* Thiết kế giao diện người dùng chi tiết cho Digital Asset Management System (DAMS). DAMS là Client của DAM.  
* Chỉnh sửa nội dung bên trong file (ví dụ: sửa ảnh, edit video).  
* Nhận diện nội dung file tự động (ví dụ: nhận diện khuôn mặt, vật thể \- trừ khi được định nghĩa rõ là một tính năng cốt lõi và được mô tả trong domain).

## **3\. Vai trò và Trách nhiệm Chính**

Bounded Context DAM chịu trách nhiệm quản lý các tài sản kỹ thuật số. Các trách nhiệm chính bao gồm:

* **Lưu trữ File Vật lý:** Tiếp nhận và lưu trữ các file tài sản kỹ thuật số (file gốc và các phiên bản rendition) một cách an toàn và có cấu trúc trong hệ thống lưu trữ bên ngoài (ví dụ: S3, Google Cloud Storage) thông qua một lớp trừu tượng hóa (abstraction layer).  
* **Quản lý Metadata:** Lưu trữ, cập nhật và quản lý các thông tin mô tả (metadata) cho từng tài sản (ví dụ: tên file, loại file, kích thước, tác giả, từ khóa, mô tả). Metadata có thể bao gồm cả thông tin **đa ngôn ngữ**.  
* **Quản lý Thư mục/Tổ chức:** Cho phép người dùng tổ chức các tài sản trong cấu trúc thư mục phân cấp. Đảm bảo tính duy nhất của tên thư mục trong thư mục cha.  
* **Quản lý Phiên bản (Renditions):** Tự động hoặc theo yêu cầu tạo ra các phiên bản khác nhau của cùng một tài sản (ví dụ: thumbnail, ảnh kích thước nhỏ/trung bình/lớn, định dạng video khác nhau) để tối ưu cho các mục đích sử dụng khác nhau. Lưu trữ thông tin về các phiên bản này.  
* **Quản lý Phiên bản Lịch sử (Versioning):** Lưu trữ các phiên bản trước đó của file gốc khi tài sản được cập nhật bằng một file mới. Cho phép truy xuất các phiên bản lịch sử.  
* **Quản lý Quyền truy cập:** Kiểm soát ai (người dùng/hệ thống) có thể xem, tải xuống, cập nhật hoặc xóa tài sản/thư mục, có tính đến phạm vi **tổ chức (Tenant)** và vai trò/quyền hạn (liên kết với IAM). **Đặc biệt, hỗ trợ quản lý tài sản nội bộ (không thuộc Tenant cụ thể).**  
* **Cung cấp URL Truy cập:** Cung cấp các URL an toàn và có thể kiểm soát (ví dụ: có thời hạn, có chữ ký) để truy cập các file tài sản gốc hoặc các phiên bản của chúng từ hệ thống lưu trữ ngoài.  
* **Tìm kiếm và Lọc:** Cung cấp khả năng tìm kiếm và lọc tài sản dựa trên metadata (bao gồm cả tìm kiếm trong metadata đa ngôn ngữ), thư mục, loại file, trạng thái, v.v.  
* **Quản lý Vòng đời Dữ liệu:** Áp dụng các chính sách retention hoặc xóa mềm khi tài sản không còn được sử dụng hoặc bị xóa bởi người dùng. Hỗ trợ xóa cứng dữ liệu tài sản khi tổ chức bị xóa (phản ứng với Event từ BUM). **Đối với tài sản nội bộ, không áp dụng các chính sách xóa cứng theo Tenant.**  
* **Phát Sự kiện Nghiệp vụ:** Phát ra các Sự kiện Nghiệp vụ quan trọng khi có thay đổi về tài sản (ví dụ: tài sản mới được tải lên, metadata cập nhật, tài sản bị xóa, rendition được tạo).  
* **Ghi Audit Log:** Gửi thông tin về các hoạt động quản lý tài sản (tạo, cập nhật, xóa, thay đổi quyền) đến ALM để ghi log kiểm tra.

## **4\. Mô hình Domain (Chi tiết hơn)**

Trong phạm vi Bounded Context DAM, mô hình domain xoay quanh các khái niệm về Asset (tài sản), Folder (thư mục) và các thông tin liên quan như Metadata, Rendition, History. Asset và Folder là các Aggregate Root chính.

**Aggregate Roots:**

* **Asset:** Là Aggregate Root đại diện cho một tài sản kỹ thuật số duy nhất (ví dụ: một file hình ảnh, một file PDF). Asset quản lý thông tin metadata, các phiên bản (renditions) và lịch sử của file gốc.  
  * **ID:** Unique identifier (UUID).  
  * **TenantId:** ID của tổ chức sở hữu tài sản (liên kết với IAM). **Lưu ý:** Giá trị null cho thuộc tính này biểu thị tài sản thuộc về tổ chức nội bộ của hệ thống Ecoma.  
  * **OriginalFileName:** Tên file gốc khi tải lên.  
  * **StoredFileName:** Tên file được lưu trữ nội bộ (có thể là hash hoặc UUID) cho phiên bản file gốc hiện tại.  
  * **FilePath:** Đường dẫn nội bộ đến file gốc hiện tại trong hệ thống lưu trữ.  
  * **MimeType:** Loại MIME của file gốc.  
  * **FileSize:** Kích thước file gốc (byte).  
  * **UploadedByUserId:** ID của người dùng đã tải lên phiên bản gốc đầu tiên (liên kết với IAM).  
  * **UploadedAt:** Thời điểm tải lên phiên bản gốc đầu tiên.  
  * **Metadata:** Danh sách các AssetMetadata Entities.  
  * **Renditions:** Danh sách các AssetRendition Entities.  
  * **Status:** Trạng thái tài sản (AssetStatus Value Object: Uploading, Active, Inactive, SoftDeleted, HardDeleted).  
  * **CurrentVersion:** Số phiên bản hiện tại của file gốc.  
  * **History:** Danh sách các AssetHistory Entities (lịch sử các lần cập nhật file gốc).  
  * **CreatedAt:** Thời điểm tạo bản ghi Asset.  
  * **UpdatedAt:** Thời điểm cập nhật cuối cùng (bao gồm cả metadata).  
  * *Behavior:* UpdateMetadata, GenerateRendition, Deactivate, Activate, SoftDelete, Restore, CreateNewVersion (khi upload file mới cho Asset đã tồn tại, tạo AssetHistory cho phiên bản cũ).  
* **Folder:** Là Aggregate Root đại diện cho một thư mục dùng để tổ chức các tài sản. Folder quản lý cấu trúc phân cấp và thông tin của thư mục.  
  * **ID:** Unique identifier (UUID).  
  * **TenantId:** ID của tổ chức sở hữu thư mục. **Lưu ý:** Giá trị null cho thuộc tính này biểu thị thư mục thuộc về tổ chức nội bộ.  
  * **Name:** Tên thư mục. **Ràng buộc:** Duy nhất trong phạm vi thư mục cha và Tenant.  
  * **ParentFolderId:** **Optional** ID của thư mục cha (để xây dựng cây phân cấp). Null cho thư mục gốc của Tenant hoặc thư mục gốc nội bộ.  
  * **Path:** Đường dẫn đầy đủ của thư mục (ví dụ: "/images/products"). Được tạo tự động dựa trên tên và ParentFolderId. **Ràng buộc:** Duy nhất trong phạm vi Tenant (hoặc trong phạm vi nội bộ nếu TenantId là null).  
  * **CreatedAt:** Thời điểm tạo.  
  * **UpdatedAt:** Thời điểm cập nhật cuối cùng.  
  * *Behavior:* Rename, ChangeParent, SoftDelete, Restore.

**Entities (thuộc về các Aggregate Root):**

* **AssetMetadata (thuộc Asset):** Đại diện cho một cặp key-value metadata của tài sản.  
  * **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root Asset.  
  * **Key:** Khóa metadata (ví dụ: "title", "description", "tags", "alt\_text").  
  * **Value:** Giá trị metadata.  
  * **Locale:** **Optional** Mã locale nếu là metadata đa ngôn ngữ (liên kết với RDM/LZM). Null cho metadata chung.  
  * **CreatedAt:** Thời điểm tạo.  
  * **UpdatedAt:** Thời điểm cập nhật cuối cùng.  
  * *Behavior:* UpdateValue.  
* **AssetRendition (thuộc Asset):** Đại diện cho một phiên bản (kích thước, định dạng) của tài sản gốc.  
  * **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root Asset.  
  * **RenditionType:** Loại phiên bản (RenditionType Value Object: Thumbnail, Small, Medium, Large, Custom). **Ràng buộc:** Duy nhất trong phạm vi Asset.  
  * **StoredFileName:** Tên file được lưu trữ nội bộ cho phiên bản này.  
  * **FilePath:** Đường dẫn nội bộ đến file phiên bản.  
  * **MimeType:** Loại MIME của phiên bản.  
  * **FileSize:** Kích thước file phiên bản.  
  * **Width:** **Optional** Chiều rộng (pixel).  
  * **Height:** **Optional** Chiều cao (pixel).  
  * **CreatedAt:** Thời điểm tạo.  
  * *Behavior:* None (read-only sau khi tạo).  
* **AssetHistory (thuộc Asset):** Đại diện cho một phiên bản lịch sử của file gốc.  
  * **ID:** Unique identifier (UUID) \- ID cục bộ trong Aggregate Root Asset.  
  * **Version:** Số phiên bản. **Ràng buộc:** Tăng dần và duy nhất trong phạm vi Asset.  
  * **StoredFileName:** Tên file được lưu trữ nội bộ cho phiên bản lịch sử.  
  * **FilePath:** Đường dẫn nội bộ đến file phiên bản lịch sử.  
  * **UploadedByUserId:** ID người dùng đã tạo phiên bản này.  
  * **UploadedAt:** Thời điểm tạo phiên bản này.  
  * *Behavior:* None (read-only).

**Value Objects:**

* **AssetStatus:** Trạng thái của tài sản (Uploading, Active, Inactive, SoftDeleted, HardDeleted).  
* **RenditionType:** Loại phiên bản (Thumbnail, Small, Medium, Large, Custom).  
* **AccessPermission:** Quyền truy cập (View, Download, Edit, Delete, ManagePermissions).  
* **LocalizedText:** Giá trị văn bản đa ngôn ngữ (Map\<LocaleCode, String\>).  
* **AssetUploadDetails:** Thông tin chi tiết khi tải lên file (tên file gốc, loại file, dữ liệu file tạm thời, kích thước).  
* **AssetMetadataUpdate:** Thông tin cập nhật metadata (Key, Value, Locale).  
* **AssetQueryCriteria:** Tiêu chí tìm kiếm tài sản.  
  * **TenantId:** Lọc theo tổ chức (bao gồm cả null cho tài sản nội bộ).  
  * **FolderId:** Lọc theo thư mục (bao gồm cả thư mục con nếu có tùy chọn).  
  * **FileName:** Tìm kiếm theo tên file gốc (hỗ trợ tìm kiếm gần đúng).  
  * **MimeType:** Lọc theo loại file.  
  * **Keywords:** Tìm kiếm trong metadata từ khóa.  
  * **UploadedByUserId:** Lọc theo người tải lên.  
  * **UploadedAtRange:** Khoảng thời gian tải lên.  
  * **MetadataFilters:** Lọc dựa trên các cặp metadata cụ thể (Key, Value, Locale).  
  * **Status:** Lọc theo trạng thái tài sản.  
  * **PageNumber, PageSize, SortBy, SortOrder:** Phân trang và sắp xếp.  
* **FolderQueryCriteria:** Tiêu chí tìm kiếm thư mục.  
  * **TenantId:** Lọc theo tổ chức (bao gồm cả null cho thư mục nội bộ).  
  * **ParentFolderId:** Lọc theo thư mục cha (lấy thư mục con trực tiếp).  
  * **Name:** Tìm kiếm theo tên thư mục.  
  * **IncludeDeleted:** Bao gồm cả thư mục đã xóa mềm.

## **5\. Ngôn ngữ Chung (Ubiquitous Language)**

Trong Bounded Context DAM, các thuật ngữ sau đây có ý nghĩa cụ thể và nhất quán:

* **Asset:** Một file kỹ thuật số được quản lý trong hệ thống (hình ảnh, video, tài liệu, v.v.).  
* **File:** Dữ liệu nhị phân thực tế của Asset.  
* **Metadata:** Thông tin mô tả về Asset (tiêu đề, mô tả, từ khóa, tác giả, v.v.). Có thể là **đa ngôn ngữ**.  
* **Folder:** Thư mục dùng để tổ chức các Asset.  
* **Rendition:** Một phiên bản khác (kích thước, định dạng) của Asset gốc, được tạo ra để tối ưu cho mục đích sử dụng cụ thể (ví dụ: thumbnail, ảnh hiển thị web).  
* **Version:** Một phiên bản lịch sử của file Asset gốc khi nó được cập nhật bằng một file mới.  
* **Upload:** Hành động tải file Asset lên hệ thống.  
* **Publish:** Cung cấp quyền truy cập (ví dụ: URL) đến Asset hoặc Rendition.  
* **Soft Delete:** Đánh dấu Asset hoặc Folder là đã xóa nhưng vẫn giữ lại dữ liệu vật lý (có thể khôi phục).  
* **Hard Delete:** Xóa vĩnh viễn Asset, Folder và dữ liệu file vật lý liên quan.  
* **Access Control:** Kiểm soát quyền truy cập vào Asset hoặc Folder dựa trên danh tính, vai trò và phạm vi tổ chức.  
* **Asset URL:** Đường dẫn để truy cập trực tiếp file Asset hoặc Rendition từ hệ thống lưu trữ ngoài. Có thể là URL có thời hạn/chữ ký.  
* **External Storage Service:** Lớp trừu tượng hóa giao tiếp với hệ thống lưu trữ file vật lý bên ngoài (ví dụ: S3, Google Cloud Storage).  
* **Tài sản nội bộ:** Tài sản không thuộc về một Tenant khách hàng cụ thể, được quản lý bởi tổ chức nội bộ Ecoma (được biểu thị bằng TenantId \= null).

## **6\. Các Khía cạnh Quan trọng của Miền DAM**

Phần này mô tả các cấu trúc, quy tắc và khái niệm nghiệp vụ quan trọng chi phối hoạt động của Bounded Context DAM.

### **6.1. Quản lý Phiên bản (Versioning) và Phiên bản (Rendition)**

DAM cần phân biệt rõ ràng và quản lý cả hai khái niệm:

* **Versioning:** Liên quan đến việc theo dõi lịch sử thay đổi của **file gốc** của một Asset. Khi người dùng tải lên một file mới để cập nhật một Asset đã tồn tại, DAM sẽ tạo một phiên bản lịch sử (AssetHistory) cho file cũ và lưu trữ file mới làm phiên bản hiện tại. Hệ thống cần có khả năng truy xuất các phiên bản lịch sử này nếu cần (ví dụ: để khôi phục).  
* **Rendition:** Liên quan đến việc tạo ra các biến thể của **file gốc hiện tại** với các kích thước, định dạng hoặc chất lượng khác nhau (ví dụ: từ ảnh gốc độ phân giải cao tạo ra thumbnail và ảnh web). Các Rendition được tạo tự động khi tải lên hoặc theo yêu cầu. DAM lưu trữ thông tin về các Rendition này và cung cấp URL để truy cập chúng. Các Rendition không có lịch sử phiên bản riêng; khi file gốc được cập nhật (tạo Version mới), các Rendition cũ sẽ bị xóa (hoặc đánh dấu không hợp lệ) và các Rendition mới sẽ được tạo từ file gốc mới.

Logic nghiệp vụ trong DAM cần quản lý vòng đời và mối quan hệ giữa Asset, các Version lịch sử và các Rendition hiện tại.

### **6.2. Xử lý File Vật lý và Tương tác với Hệ thống Lưu trữ Ngoài**

DAM không tự lưu trữ file vật lý trong cơ sở dữ liệu của nó. Thay vào đó, nó tương tác với một hệ thống lưu trữ file chuyên dụng bên ngoài (ví dụ: Amazon S3, Google Cloud Storage, Azure Blob Storage).

* **Lớp Trừu tượng hóa (Abstraction Layer):** DAM định nghĩa một interface chung (IExternalStorageService) cho các hoạt động lưu trữ file (upload, download, delete, generate pre-signed URL). Các lớp triển khai cụ thể (Adapters) cho từng nhà cung cấp dịch vụ lưu trữ sẽ nằm ở lớp hạ tầng (Infrastructure Layer), bên ngoài Domain Model của DAM. Điều này giúp DAM độc lập với công nghệ lưu trữ cụ thể.  
* **Xử lý Bất đồng bộ:** Việc tải lên file, tạo rendition, hoặc xóa file vật lý có thể là các tác vụ tốn thời gian. DAM nên xử lý các tác vụ này một cách bất đồng bộ (ví dụ: sử dụng Message Queue và Worker Process) để tránh làm tắc nghẽn các request đồng bộ.

### **6.3. Quản lý Quyền truy cập theo Phạm vi Tổ chức (Tenant) và Tài sản nội bộ**

DAM là một dịch vụ đa tổ chức (multi-tenant) nhưng cũng quản lý tài sản nội bộ. Mỗi tài sản và thư mục thuộc về một tổ chức (TenantId) hoặc thuộc về tổ chức nội bộ (TenantId \= null). Quyền truy cập vào tài sản và thư mục cần được kiểm soát chặt chẽ:

* **Phân quyền:**  
  * Đối với tài sản/thư mục thuộc về một Tenant cụ thể (TenantId is not null): Chỉ người dùng thuộc cùng tổ chức đó mới có thể có quyền truy cập (trừ một số trường hợp ngoại lệ cho người dùng nội bộ Ecoma có quyền Admin).  
  * Đối với tài sản/thư mục nội bộ (TenantId \= null): Quyền truy cập được quản lý dựa trên vai trò và quyền hạn của người dùng nội bộ Ecoma (liên kết với IAM).  
* **Kiểm tra Quyền:** Khi xử lý Command (tạo, cập nhật, xóa) hoặc Query (xem, tải xuống) liên quan đến tài sản/thư mục, DAM Application Services sẽ gọi IAM Service để kiểm tra xem người dùng yêu cầu có quyền thực hiện hành động đó trên tài nguyên thuộc TenantId tương ứng hay không (bao gồm cả trường hợp TenantId là null cho tài sản nội bộ).  
* **URL An toàn:** Các URL truy cập file vật lý được cung cấp bởi DAM (thông qua ExternalStorageService) cần có cơ chế bảo mật để ngăn chặn truy cập trái phép (ví dụ: URL có thời hạn, URL có chữ ký, hoặc yêu cầu xác thực khi truy cập).  
* **Không kiểm tra Usage cho tài sản nội bộ:** Đối với các hành động liên quan đến tài sản nội bộ (TenantId \= null), DAM sẽ **không** thực hiện các bước kiểm tra hoặc cập nhật thông tin sử dụng tài nguyên (usage) liên quan đến các gói dịch vụ (subscription) của Tenant. Việc kiểm tra và cập nhật usage chỉ áp dụng cho tài sản thuộc về các Tenant khách hàng.

### **6.4. Xử lý Lỗi trong Quá trình Tải lên và Xử lý File**

Quá trình tải lên file và tạo rendition có thể gặp nhiều lỗi (ví dụ: file bị hỏng, định dạng không hỗ trợ, lỗi kết nối với hệ thống lưu trữ). DAM cần có cơ chế xử lý lỗi robust:

* **Xác thực File:** Kiểm tra loại file, kích thước, và tính hợp lệ cơ bản của file khi tải lên.  
* **Xử lý Lỗi Tạm thời:** Áp dụng chiến lược thử lại cho các lỗi tạm thời khi tương tác với ExternalStorageService hoặc Rendition Service.  
* **Xử lý Lỗi Vĩnh viễn:** Đánh dấu Asset ở trạng thái Failed hoặc Inactive và ghi lại lý do lỗi khi gặp lỗi vĩnh viễn trong quá trình tải lên hoặc tạo rendition. Phát sự kiện "AssetProcessingFailed".  
* **Thông báo Lỗi:** Cung cấp thông tin lỗi chi tiết cho người dùng hoặc hệ thống đã yêu cầu tải lên/xử lý.

## **7\. Tương tác với các Bounded Context khác**

DAM là một dịch vụ nền tảng cung cấp khả năng lưu trữ và quản lý tài sản kỹ thuật số cho các BC khác.

* **Tương tác với Core BCs:**  
  * **IAM:** DAM cần IAM để xác thực và ủy quyền cho người dùng/hệ thống quản lý hoặc truy cập tài sản. Quyền truy cập tài sản/thư mục được kiểm soát dựa trên vai trò và phạm vi tổ chức của người dùng (bao gồm cả người dùng nội bộ và tài sản nội bộ). DAM gọi IAM để kiểm tra quyền.  
  * **LZM:** DAM cần LZM để quản lý và hiển thị metadata đa ngôn ngữ. Khi lưu trữ metadata đa ngôn ngữ, DAM có thể cần xác thực Locale với RDM (thông qua LZM hoặc trực tiếp RDM nếu LZM không cung cấp). Khi truy vấn metadata đa ngôn ngữ, DAM gọi LZM để lấy bản dịch hoặc áp dụng logic fallback.  
  * **RDM:** DAM có thể cần RDM để lấy dữ liệu tham chiếu liên quan đến tài sản (ví dụ: danh sách các loại file được hỗ trợ, các loại rendition chuẩn).  
  * **ALM:** DAM phát ra các sự kiện audit log khi có các hành động quan trọng liên quan đến quản lý tài sản (ví dụ: tải lên, cập nhật metadata, xóa, thay đổi quyền truy cập, tạo rendition thành công/thất bại).  
* **Tương tác với Feature BCs (Người dùng Tài sản):**  
  * **PIM:** PIM là người dùng chính của DAM để liên kết sản phẩm/biến thể với hình ảnh/video. PIM chỉ lưu trữ ID của Asset/Rendition từ DAM. Khi hiển thị thông tin sản phẩm, PIM hoặc Client App gọi DAM để lấy URL của Asset/Rendition. DAM phát sự kiện khi Asset bị xóa (cứng/mềm) hoặc trạng thái thay đổi để PIM có thể cập nhật liên kết hoặc hiển thị trạng thái phù hợp.  
  * **MPM:** MPM có thể cần tài sản (hình ảnh banner, video quảng cáo) từ DAM cho các chiến dịch marketing.  
  * **CRM:** CRM có thể cần tài sản (tài liệu hướng dẫn, video giới thiệu) từ DAM để gửi cho khách hàng.  
  * **NDM:** NDM có thể cần tài sản (hình ảnh logo, banner email) từ DAM để đưa vào nội dung thông báo. NDM sẽ gọi DAM để lấy URL của asset.  
  * **ITM:** ITM có thể cần tài sản (video đào tạo, tài liệu PDF) từ DAM cho nội dung khóa học.  
  * **WPM:** WPM có thể cần tài sản (tài liệu dự án, hình ảnh báo cáo) từ DAM để đính kèm vào task/workflow.  
  * **Tất cả các BC khác:** Bất kỳ BC nào cần lưu trữ hoặc sử dụng tài sản kỹ thuật số đều sẽ tương tác với DAM.  
* **Tương tác với BUM:**  
  * DAM lắng nghe sự kiện "TenantDataDeletionRequested" từ BUM để kích hoạt quy trình xóa cứng tất cả dữ liệu (Asset, Folder, file vật lý) liên quan đến Tenant đó. **Lưu ý:** Quy trình này chỉ áp dụng cho Tenant khách hàng, không áp dụng cho tài sản nội bộ (TenantId \= null).  
  * **Không tương tác để kiểm tra/cập nhật Usage:** DAM **không** gọi BUM để kiểm tra hạn mức sử dụng hoặc cập nhật thông tin sử dụng tài nguyên khi các hành động quản lý tài sản được thực hiện. Việc này được xử lý ở lớp Application Service nếu cần, và đặc biệt **không** thực hiện cho tài sản nội bộ.  
* **Tương tác với External Storage Service (Adapter):**  
  * DAM Domain Services tương tác với hệ thống lưu trữ file vật lý bên ngoài thông qua interface IExternalStorageService.

## **8\. Use cases**

Dưới đây là mô tả các use case chính có sự tham gia của DAM, tập trung vào actor, mục đích và các Domain/Application Service liên quan, được phân loại theo các nhóm chức năng chính.

### **8.1. Use Cases liên quan đến Quản lý Tài sản (Asset Management)**

Nhóm này bao gồm các use case cốt lõi liên quan đến việc tải lên, cập nhật và quản lý thông tin của tài sản.

* **DAM-UC-8.1.1: Tải lên Tài sản Mới**  
  * **Actor:** Người dùng (qua giao diện DAMS), Hệ thống (ví dụ: API tích hợp).  
  * **Mục đích:** Tải một file mới lên hệ thống, tạo bản ghi Asset, lưu file vật lý, tạo các phiên bản rendition, và liên kết với thư mục.  
  * **Service liên quan:** Nhận Command UploadAssetCommand. Sử dụng AssetApplicationService (xác thực, ủy quyền, **không kiểm tra/cập nhật usage nếu TenantId là null**). Sử dụng AssetService (tạo Asset, quản lý versioning, phối hợp lưu file, phối hợp tạo rendition, cập nhật Folder). Sử dụng FolderService (cập nhật Folder Aggregate). Sử dụng RenditionService (tạo renditions). Sử dụng ExternalStorageService (lưu file). Phát Domain Event AssetUploaded, AssetRenditionCreated. Gửi Audit Log đến ALM.  
* **DAM-UC-8.1.2: Cập nhật File Tài sản (Tạo Phiên bản Lịch sử)**  
  * **Actor:** Người dùng (qua giao diện DAMS), Hệ thống.  
  * **Mục đích:** Cập nhật file gốc của một Asset đã tồn tại, tạo phiên bản lịch sử cho file cũ, lưu file mới, và tạo lại các phiên bản rendition.  
  * **Service liên quan:** Nhận Command UpdateAssetFileCommand. Sử dụng AssetApplicationService (xác thực, ủy quyền, **không kiểm tra/cập nhật usage nếu TenantId là null**). Sử dụng AssetService (lấy Asset, tạo AssetHistory, cập nhật file gốc, tăng version, xóa/tạo lại renditions). Sử dụng RenditionService (tạo renditions mới). Sử dụng ExternalStorageService (lưu/xóa file). Phát Domain Event AssetUpdated, AssetRenditionCreated. Gửi Audit Log đến ALM.  
* **DAM-UC-8.1.3: Quản lý Metadata Tài sản (Bao gồm Đa ngôn ngữ)**  
  * **Actor:** Người dùng (qua giao diện DAMS), Hệ thống.  
  * **Mục đích:** Thêm mới, cập nhật hoặc xóa metadata cho một tài sản, có hỗ trợ metadata đa ngôn ngữ.  
  * **Service liên quan:** Nhận Command UpdateAssetMetadataCommand. Sử dụng AssetApplicationService (xác thực, ủy quyền). Sử dụng AssetService (lấy Asset, cập nhật AssetMetadata Entities). Sử dụng LZM Service (xác thực Locale, hỗ trợ bản dịch). Phát Domain Event AssetMetadataUpdated. Gửi Audit Log đến ALM.

### **8.2. Use Cases liên quan đến Quản lý Thư mục (Folder Management)**

Nhóm này bao gồm các use case liên quan đến việc tổ chức tài sản trong cấu trúc thư mục.

* **DAM-UC-8.2.1: Quản lý Thư mục**  
  * **Actor:** Người dùng (qua giao diện DAMS).  
  * **Mục đích:** Tạo mới, đổi tên, di chuyển, xóa mềm hoặc khôi phục thư mục.  
  * **Service liên quan:** Nhận Commands CreateFolderCommand, RenameFolderCommand, MoveFolderCommand, SoftDeleteFolderCommand, RestoreFolderCommand. Sử dụng FolderApplicationService (xác thực, ủy quyền, **không kiểm tra/cập nhật usage nếu TenantId là null**). Sử dụng FolderService (quản lý Folder Aggregate, xử lý cây thư mục). Phát Domain Events FolderCreated, FolderRenamed, FolderMoved, FolderSoftDeleted, FolderRestored. Gửi Audit Log đến ALM.

### **8.3. Use Cases liên quan đến Truy vấn và Cung cấp Tài sản (Querying & Serving)**

Nhóm này bao gồm các use case cho phép các BC khác tìm kiếm, xem và lấy URL truy cập tài sản.

* **DAM-UC-8.3.1: Tìm kiếm và Lọc Tài sản**  
  * **Actor:** Người dùng (qua giao diện DAMS), Các Bounded Context khác.  
  * **Mục đích:** Tìm kiếm và lọc các tài sản dựa trên nhiều tiêu chí (tên file, metadata, thư mục, loại file, trạng thái), có hỗ trợ tìm kiếm trong metadata đa ngôn ngữ.  
  * **Service liên quan:** Nhận Query SearchAssetsQuery, GetFolderContentQuery. Sử dụng AssetQueryApplicationService (xác thực, ủy quyền). Sử dụng AssetQueryService (thực hiện truy vấn, phối hợp với Repository/Search Index, LZM Service).  
* **DAM-UC-8.3.2: Lấy URL Truy cập Tài sản/Phiên bản**  
  * **Actor:** Người dùng (qua giao diện DAMS), Các Bounded Context khác (đặc biệt là UI BCs).  
  * **Mục đích:** Lấy URL an toàn để truy cập file gốc hoặc một phiên bản rendition cụ thể của tài sản.  
  * **Service liên quan:** Nhận Query GetAssetUrlQuery. Sử dụng AssetQueryApplicationService (xác thực, ủy quyền). Sử dụng AssetQueryService (lấy Asset/Rendition info, phối hợp với ExternalStorageService để tạo URL).

### **8.4. Use Cases liên quan đến Vòng đời Dữ liệu (Data Lifecycle)**

Nhóm này bao gồm các use case liên quan đến việc xóa tài sản.

* **DAM-UC-8.4.1: Xóa Mềm Tài sản/Thư mục**  
  * **Actor:** Người dùng (qua giao diện DAMS).  
  * **Mục đích:** Đánh dấu tài sản hoặc thư mục là đã xóa mềm, ẩn khỏi các truy vấn mặc định nhưng vẫn giữ lại dữ liệu để có thể khôi phục.  
  * **Service liên quan:** Nhận Commands SoftDeleteAssetCommand, SoftDeleteFolderCommand. Sử dụng AssetApplicationService, FolderApplicationService (xác thực, ủy quyền, **không kiểm tra/cập nhật usage nếu TenantId là null**). Sử dụng AssetService, FolderService (cập nhật trạng thái). Phát Domain Events AssetStatusChanged (sang SoftDeleted), FolderSoftDeleted. Gửi Audit Log đến ALM.  
* **DAM-UC-8.4.2: Xóa Cứng Dữ liệu Tài sản của Tenant**  
  * **Actor:** Hệ thống (Lắng nghe Event từ BUM).  
  * **Mục đích:** Xóa vĩnh viễn tất cả tài sản, thư mục và file vật lý liên quan đến một Tenant khi Tenant đó bị xóa.  
  * **Service liên quan:** Lắng nghe Event TenantDataDeletionRequested. Sử dụng AssetApplicationService (hoặc Service chuyên biệt cho xóa dữ liệu Tenant). Sử dụng AssetService, FolderService (xóa cứng bản ghi metadata). Sử dụng ExternalStorageService (xóa file vật lý). Phát Domain Events AssetHardDeleted, FolderHardDeleted. Gửi Audit Log đến ALM. **Lưu ý:** Use case này chỉ áp dụng khi TenantId của tài sản/thư mục **không phải là null**.

## **9\. Domain Services**

Domain Services trong DAM chứa logic nghiệp vụ quan trọng không thuộc về một Aggregate Root cụ thể hoặc cần phối hợp nhiều Aggregate Root.

* **AssetService:**  
  * **Trách nhiệm:** Quản lý vòng đời của Asset Aggregate (tạo, cập nhật file \- bao gồm versioning, cập nhật metadata, thay đổi trạng thái). Phối hợp với RenditionService để tạo/xóa renditions khi cần. Thực hiện các quy tắc nghiệp vụ liên quan đến Asset (ví dụ: kiểm tra tính hợp lệ cơ bản của dữ liệu tải lên, quản lý trạng thái). Phối hợp với Asset Repository, ExternalStorageService. **Lưu ý:** Các hành động trên tài sản nội bộ (TenantId \= null) sẽ không kích hoạt các logic liên quan đến kiểm tra/cập nhật usage.  
  * **Các phương thức tiềm năng:** CreateAsset(tenantId, uploadDetails, metadata, uploadedByUserId, folderId), UpdateAssetFile(assetId, tenantId, uploadDetails, uploadedByUserId), UpdateAssetMetadata(assetId, tenantId, metadataUpdates), DeactivateAsset(assetId, tenantId), SoftDeleteAsset(assetId, tenantId), RestoreAsset(assetId, tenantId), HardDeleteAsset(assetId, tenantId), HardDeleteAssetsByTenant(tenantId).  
* **FolderService:**  
  * **Trách nhiệm:** Quản lý vòng đời của Folder Aggregate (tạo, đổi tên, di chuyển, xóa mềm, khôi phục). Thực hiện các quy tắc nghiệp vụ liên quan đến Folder (ví dụ: kiểm tra tính duy nhất của tên, xử lý cây thư mục khi di chuyển/xóa). Phối hợp với Folder Repository, và có thể phối hợp với AssetService khi xóa thư mục chứa asset. **Lưu ý:** Các hành động trên thư mục nội bộ (TenantId \= null) sẽ không kích hoạt các logic liên quan đến kiểm tra/cập nhật usage.  
  * **Các phương thức tiềm năng:** CreateFolder(tenantId, name, parentFolderId), RenameFolder(folderId, tenantId, newName), MoveFolder(folderId, tenantId, newParentFolderId), SoftDeleteFolder(folderId, tenantId), RestoreFolder(folderId, tenantId), HardDeleteFolder(folderId, tenantId), HardDeleteFoldersByTenant(tenantId).  
* **RenditionService:**  
  * **Trách nhiệm:** Xử lý việc tạo các phiên bản (renditions) của Asset. Nhận yêu cầu tạo rendition, đọc file gốc từ hệ thống lưu trữ, sử dụng các công cụ xử lý file (ví dụ: thư viện xử lý ảnh/video) để tạo phiên bản mới, lưu file phiên bản vào hệ thống lưu trữ, và cập nhật thông tin Rendition vào Asset Aggregate (thông qua AssetService hoặc Repository). Xử lý lỗi trong quá trình tạo rendition và áp dụng thử lại nếu cần.  
  * **Các phương thức tiềm năng:** GenerateRenditions(assetId, tenantId, renditionTypes), GenerateRendition(assetId, tenantId, renditionType, customSettings).  
* **AssetQueryService:**  
  * **Trách nhiệm:** Cung cấp các phương thức truy vấn dữ liệu Asset và Folder tối ưu cho các nhu cầu khác nhau. Bao gồm tìm kiếm và lọc dựa trên tiêu chí phức tạp (metadata, thư mục, trạng thái), lấy thông tin chi tiết Asset/Folder, và tạo URL truy cập. Phối hợp với Asset Repository, Folder Repository, Search Index (nếu có), LZM Service (cho tìm kiếm/hiển thị metadata đa ngôn ngữ), ExternalStorageService (để tạo URL).  
  * **Các phương thức tiềm năng:** GetAssetDetails(assetId, tenantId), GetAssetUrl(assetId, tenantId, renditionType, expirationTime), SearchAssets(criteria), GetFolderContent(folderId, tenantId, criteria), GetFolderTree(tenantId).

## **9\. Application Services**

Application Services trong DAM là lớp mỏng điều phối các hành động từ bên ngoài (ví dụ: từ API Gateway, Message Broker) đến Domain Model (Aggregate Roots, Domain Services). Chúng xử lý các tác vụ kỹ thuật như xác thực, ủy quyền (thông qua IAM), giao dịch cơ sở dữ liệu, và phát sự kiện.

* **AssetApplicationService:**  
  * **Trách nhiệm:** Xử lý các command liên quan đến quản lý Asset (ví dụ: UploadAssetCommand, UpdateAssetMetadataCommand, SoftDeleteAssetCommand). Sử dụng AssetService và Asset Repository. Thực hiện ủy quyền với IAM. Lắng nghe các event liên quan đến xóa Tenant từ BUM để kích hoạt xóa dữ liệu Asset của Tenant đó (chỉ áp dụng cho TenantId không null). Bắt và xử lý các Business Rule Exception từ Domain Service. Phát Domain Events. Gửi Audit Log đến ALM. **Đặc biệt, kiểm tra TenantId của tài sản trong command; nếu là null, bỏ qua các bước kiểm tra/cập nhật usage.**  
  * **Các phương thức tiềm năng:** HandleUploadAssetCommand(command), HandleUpdateAssetMetadataCommand(command), HandleSoftDeleteAssetCommand(command), HandleRestoreAssetCommand(command), HandleTenantDataDeletionRequestedEvent(event).  
* **FolderApplicationService:**  
  * **Trách nhiệm:** Xử lý các command liên quan đến quản lý Folder (ví dụ: CreateFolderCommand, SoftDeleteFolderCommand). Sử dụng FolderService và Folder Repository. Thực hiện ủy quyền với IAM. Bắt và xử lý các Business Rule Exception từ Domain Service. Phát Domain Events. Gửi Audit Log đến ALM. **Đặc biệt, kiểm tra TenantId của thư mục trong command; nếu là null, bỏ qua các bước kiểm tra/cập nhật usage.**  
  * **Các phương thức tiềm năng:** HandleCreateFolderCommand(command), HandleRenameFolderCommand(command), HandleMoveFolderCommand(command), HandleSoftDeleteFolderCommand(command), HandleRestoreFolderCommand(command).  
* **AssetQueryApplicationService:**  
  * **Trách nhiệm:** Xử lý các query để lấy thông tin Asset và Folder (ví dụ: GetAssetUrlQuery, SearchAssetsQuery, GetFolderContentQuery). Sử dụng AssetQueryService hoặc các Domain Service khác. Thực hiện ủy quyền với IAM.  
  * **Các phương thức tiềm năng:** HandleGetAssetDetailsQuery(query), HandleGetAssetUrlQuery(query), HandleSearchAssetsQuery(query), HandleGetFolderContentQuery(query), HandleGetFolderTreeQuery(query).  
* **RenditionApplicationService:**  
  * **Trách nhiệm:** Lắng nghe các event "AssetUploaded" hoặc nhận command/event yêu cầu tạo rendition. Kích hoạt quy trình tạo rendition bất đồng bộ. Sử dụng RenditionService.  
  * **Các phương thức tiềm năng:** HandleAssetUploadedEvent(event), HandleGenerateRenditionsCommand(command).

## **10\. Domain Events**

DAM sẽ phát ra các Domain Event quan trọng để thông báo cho các Bounded Context khác về những thay đổi trạng thái nghiệp vụ trong phạm vi của nó.

### **10.1. Domain Events (DAM Phát ra)**

* **AssetUploaded**  
  * Phát ra khi một tài sản mới được tải lên và xử lý ban đầu thành công.  
  * **Payload:**  
    * AssetId (UUID)  
    * TenantId (UUID, có thể là null)  
    * OriginalFileName (String)  
    * MimeType (String)  
    * FileSize (Long)  
    * UploadedByUserId (UUID)  
    * FolderId (UUID, optional)  
    * IssuedAt (DateTime)  
* **AssetMetadataUpdated**  
  * Phát ra khi metadata của tài sản được cập nhật.  
  * **Payload:**  
    * AssetId (UUID)  
    * TenantId (UUID, có thể là null)  
    * UpdatedByUserId (UUID)  
    * UpdatedMetadataKeys (List of String)  
    * IssuedAt (DateTime)  
* **AssetStatusChanged**  
  * Phát ra khi trạng thái tài sản thay đổi (ví dụ: từ Active sang Inactive, SoftDeleted).  
  * **Payload:**  
    * AssetId (UUID)  
    * TenantId (UUID, có thể là null)  
    * OldStatus (String)  
    * NewStatus (String)  
    * ChangedByUserId (UUID, optional)  
    * IssuedAt (DateTime)  
* **AssetRestored**  
  * Phát ra khi tài sản bị xóa mềm được khôi phục.  
  * **Payload:**  
    * AssetId (UUID)  
    * TenantId (UUID, có thể là null)  
    * RestoredByUserId (UUID)  
    * IssuedAt (DateTime)  
* **AssetHardDeleted**  
  * Phát ra khi tài sản bị xóa vĩnh viễn (thường do quy trình retention hoặc xóa Tenant).  
  * **Payload:**  
    * AssetId (UUID)  
    * TenantId (UUID, có thể là null)  
    * IssuedAt (DateTime)  
* **AssetRenditionCreated**  
  * Phát ra khi một phiên bản rendition mới của tài sản được tạo thành công.  
  * **Payload:**  
    * AssetId (UUID)  
    * RenditionId (UUID)  
    * TenantId (UUID, có thể là null)  
    * RenditionType (String)  
    * FilePath (String)  
    * MimeType (String)  
    * FileSize (Long)  
    * IssuedAt (DateTime)  
* **AssetProcessingFailed**  
  * Phát ra khi quá trình xử lý tài sản (tải lên, tạo rendition) gặp lỗi vĩnh viễn.  
  * **Payload:**  
    * AssetId (UUID)  
    * TenantId (UUID, có thể là null)  
    * ProcessingStep (String \- ví dụ: "Upload", "GenerateRendition:Thumbnail")  
    * FailureReason (String)  
    * IssuedAt (DateTime)  
* **FolderCreated**  
  * Phát ra khi một thư mục mới được tạo.  
  * **Payload:**  
    * FolderId (UUID)  
    * TenantId (UUID, có thể là null)  
    * Name (String)  
    * ParentFolderId (UUID, optional)  
    * CreatedByUserId (UUID)  
    * IssuedAt (DateTime)  
* **FolderRenamed**  
  * Phát ra khi thư mục được đổi tên.  
  * **Payload:**  
    * FolderId (UUID)  
    * TenantId (UUID, có thể là null)  
    * OldName (String)  
    * NewName (String)  
    * RenamedByUserId (UUID)  
    * IssuedAt (DateTime)  
* **FolderMoved**  
  * Phát ra khi thư mục được di chuyển sang thư mục cha khác.  
  * **Payload:**  
    * FolderId (UUID)  
    * TenantId (UUID, có thể là null)  
    * OldParentFolderId (UUID, optional)  
    * NewParentFolderId (UUID, optional)  
    * MovedByUserId (UUID)  
    * IssuedAt (DateTime)  
* **FolderSoftDeleted**  
  * Phát ra khi thư mục bị xóa mềm.  
  * **Payload:**  
    * FolderId (UUID)  
    * TenantId (UUID, có thể là null)  
    * DeletedByUserId (UUID)  
    * IssuedAt (DateTime)  
* **FolderRestored**  
  * Phát ra khi thư mục bị xóa mềm được khôi phục.  
  * **Payload:**  
    * FolderId (UUID)  
    * TenantId (UUID, có thể là null)  
    * RestoredByUserId (UUID)  
    * IssuedAt (DateTime)  
* **FolderHardDeleted**  
  * Phát ra khi thư mục bị xóa vĩnh viễn (thường do xóa Tenant).  
  * **Payload:**  
    * FolderId (UUID)  
    * TenantId (UUID, có thể là null)  
    * IssuedAt (DateTime)

### **11.2. Domain Events Được Xử lý (Consumed Domain Events)**

DAM lắng nghe và xử lý các Domain Event từ các Bounded Context khác chủ yếu để thực hiện các hành động liên quan đến quản lý vòng đời dữ liệu theo Tenant.

* **TenantDataDeletionRequested** (Từ BUM)  
  * Phát ra khi một Tenant được yêu cầu xóa dữ liệu vĩnh viễn khỏi hệ thống.  
  * **Mục đích xử lý:** DAM lắng nghe event này để kích hoạt quy trình xóa cứng tất cả dữ liệu (Asset, Folder, file vật lý) liên quan đến Tenant đó. **Lưu ý:** Quy trình này chỉ áp dụng cho TenantId **không phải là null**.  
  * **Payload dự kiến:**  
    * TenantId (UUID)  
    * RequestedAt (DateTime)  
    * IssuedAt (DateTime)

## **12\. Ranh giới Nghiệp vụ**

Ranh giới của Bounded Context DAM được xác định bởi trách nhiệm lưu trữ, tổ chức, quản lý metadata, tạo phiên bản (versioning và rendition), quản lý quyền truy cập và cung cấp URL cho các tài sản kỹ thuật số. DAM là nguồn sự thật duy nhất về bản thân các file tài sản và thông tin mô tả của chúng.

DAM không chịu trách nhiệm:

* **Nội dung nghiệp vụ của tài sản:** DAM không hiểu ý nghĩa nghiệp vụ của hình ảnh sản phẩm trong PIM hay tài liệu hợp đồng trong CRM. Nó chỉ quản lý file vật lý và metadata chung.  
* **Chỉnh sửa nội dung file:** DAM không cung cấp chức năng sửa ảnh, edit video, hoặc chỉnh sửa nội dung tài liệu.  
* **Quản lý liên kết nghiệp vụ:** DAM không quản lý việc Asset ID 123 là ảnh đại diện cho Sản phẩm A trong PIM. Việc liên kết này là trách nhiệm của PIM.  
* **Quản lý các miền nghiệp vụ khác** như sản phẩm, đơn hàng, khách hàng, v.v.  
* **Xác thực danh tính người dùng:** Chỉ sử dụng dịch vụ của IAM.  
* **Quản lý bản dịch văn bản hoặc quy tắc định dạng locale:** Chỉ sử dụng dịch vụ của LZM và RDM.  
* **Ghi nhận audit logs:** Chỉ phát sự kiện cho ALM.  
* **Cơ sở hạ tầng lưu trữ file vật lý thực tế:** DAM tương tác với External Storage Service thông qua interface trừu tượng hóa. Chi tiết triển khai của External Storage Service nằm ngoài ranh giới DAM Domain.  
* **Nhận diện nội dung file tự động:** Trừ khi được định nghĩa rõ ràng là một tính năng cốt lõi và được mô tả trong domain.  
* **Kiểm tra hoặc cập nhật thông tin sử dụng tài nguyên (usage) liên quan đến gói dịch vụ của Tenant:** Việc này được xử lý ở lớp Application Service nếu cần cho tài sản của Tenant khách hàng, và **không** áp dụng cho tài sản nội bộ.

## **13\. Kết luận**

Bounded Context Digital Asset Management (DAM) là một thành phần cốt lõi quan trọng, cung cấp chức năng quản lý tập trung và đáng tin cậy cho tất cả các tài sản kỹ thuật số trong hệ thống Ecoma, bao gồm cả tài sản của các Tenant khách hàng và tài sản nội bộ. Bằng cách tập trung trách nhiệm lưu trữ, tổ chức, quản lý metadata (bao gồm đa ngôn ngữ), tạo phiên bản (versioning & rendition), quản lý quyền truy cập theo tổ chức và phân phối tài sản vào một Context duy nhất, DAM cung cấp một nguồn dữ liệu đáng tin cậy và hiệu quả cho các hoạt động của các BC khác. Việc thiết kế DAM với mô hình domain rõ ràng, các khíaAspect quan trọng được làm rõ, tương tác được định nghĩa và các sự kiện nghiệp vụ phù hợp là nền tảng để xây dựng một hệ thống e-commerce phong phú về nội dung và dễ mở rộng.

Tài liệu này đã được cập nhật để làm rõ việc quản lý tài sản nội bộ thông qua thuộc tính TenantId \= null và quy tắc không kiểm tra/cập nhật usage cho loại tài sản này. Đây là nền tảng để chuyển sang giai đoạn thiết kế kỹ thuật chi tiết và triển khai Microservice DAM.