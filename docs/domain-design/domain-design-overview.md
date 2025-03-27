# Tổng quan mô hình nghiệp vụ của hệ thống

Tài liệu này cung cấp cái nhìn tổng quan về Mô hình nghiệp vụ cốt lõi của hệ thống Ecoma, được cấu trúc dựa trên các Bounded Context rõ ràng theo nguyên lý Domain-Driven Design (DDD) với các mục đích:

- **Xác định và đặt tên** các Bounded Context cấu thành hệ thống Ecoma.

- Cung cấp **mô tả cấp cao** về vai trò và trách nhiệm nghiệp vụ chính của từng Bounded Context.

- **Phân nhóm** các Bounded Context dựa trên chức năng nghiệp vụ (Core vs. Feature, và phân nhóm nhỏ hơn trong Feature).

- Mô tả **các mô hình tương tác chung** (General Interaction Patterns) giữa các Bounded Context.

- Làm rõ **ranh giới nghiệp vụ** (Business Boundaries) ở cấp độ Bounded Context.

- Mô tả các **use cases** các cách Bounded Context tương tác để thực hiện

## 2. Những gì Nằm ngoài phạm vi của tài liệu business models

Tài liệu business models **không** đi sâu vào các **Chi tiết kỹ thuật triển khai cụ thể** để không gây ra các mô tả kĩ thuật ngầm hiểu làm nhiễu quá trình viết tài liệu chi tiết triển khai. Tài liệu này không mô tả:

- Chi tiết cài đặt kỹ thuật của từng Microservice.

- Cấu trúc cơ sở dữ liệu chi tiết của từng Bounded Context.

- Các quyết định công nghệ cụ thể bên trong từng Microservice (trừ khi có ảnh hưởng trực tiếp đến ranh giới BC hoặc mô hình tương tác).

- Luồng dữ liệu chi tiết đến cấp độ từng trường thông tin giữa các hệ thống.

- Cấu hình hạ tầng triển khai cụ thể.

## 3. Các Giả định Kiến trúc Liên quan đến Bounded Context

Để hiểu rõ hơn về cách các Bounded Context trong hệ thống Ecoma hoạt động và tương tác với nhau, người đọc cần lưu ý các giả định kiến trúc cốt lõi sau, được áp dụng thống nhất trên toàn hệ thống:

- **Phân rã theo đơn vị nghiệp vụ:** Hệ thống được xây dựng dựa trên các đơn vị nghiệp vụ độc lập, được gọi là Bounded Contexts. Mỗi Bounded Context lý tưởng được hiện thực hóa thành một hoặc nhiều Microservice tự chủ.

- **Sở hữu dữ liệu độc lập:** Mỗi Bounded Context/Microservices chịu trách nhiệm hoàn toàn và sở hữu cơ sở dữ liệu riêng của mình. Không có sự chia sẻ hoặc truy cập trực tiếp dữ liệu giữa các BC/Service.

- **Giao tiếp bất đồng bộ là chủ đạo (backend):** Giao tiếp chính giữa các Bounded Context/Service ở tầng backend diễn ra theo mô hình bất đồng bộ, thông qua việc phát ra và tiêu thụ các **Sự kiện Nghiệp vụ (Domain Events)** qua một hệ thống truyền tin tập trung (Message Broker).

- **Điểm truy cập tập trung từ Client:** Các yêu cầu từ người dùng cuối (Client Applications) vào hệ thống sẽ đi qua một điểm truy cập duy nhất là **API Gateway**. API Gateway này chịu trách nhiệm xác thực, ủy quyền và định tuyến yêu cầu đến Bounded Context/Service phù hợp (sử dụng tương tác đồng bộ như Request/Reply).

- **Tương tác đồng bộ khi cần thiết:** Mặc dù bất đồng bộ được ưu tiên ở backend, các tương tác đồng bộ (ví dụ: thông qua API Gateway) vẫn được sử dụng khi cần phản hồi tức thời, đặc biệt khi các BC Feature gọi đến các dịch vụ nền tảng của BC Core.



Việc hiểu rõ các nguyên tắc tương tác này sẽ giúp làm rõ các mô tả về quan hệ và luồng nghiệp vụ giữa các Bounded Context được trình bày trong phần sau.

## 4. Phân nhóm các Bounded Context theo chức năng nghiệp vụ

Hệ thống Ecoma được cấu trúc thành các Bounded Context (BC) và được phân nhóm dựa trên vai trò và chức năng nghiệp vụ chính:

**Core Bounded Context Group:** Nhóm này bao gồm các Bounded Context cung cấp các dịch vụ nền tảng và quản lý các khía cạnh nghiệp vụ mang tính xuyên suốt, thiết yếu cho toàn bộ hệ thống hoạt động.

- **Identity & Access Management (IAM):** Chịu trách nhiệm quản lý toàn bộ vòng đời định danh và quyền truy cập cho người dùng và tổ chức trong hệ thống Ecoma. Điều này bao gồm đăng ký, đăng nhập, quản lý thông tin hồ sơ cơ bản (bao gồm quốc gia và ngôn ngữ ưa thích), quản lý vai trò, quyền hạn, lời mời tham gia tổ chức và quản lý các phiên làm việc (sessions). IAM làm việc chặt chẽ với BUM để xác định và thực thi quyền truy cập các tính năng cụ thể dựa trên gói dịch vụ của khách hàng. IAM là nguồn sự thật duy nhất về thông tin định danh và trạng thái xác thực/ủy quyền.

- **Billing & Usage Management (BUM):** Quản lý toàn bộ nghiệp vụ liên quan đến thanh toán và quyền sử dụng dịch vụ theo mô hình trả trước. BUM định nghĩa và quản lý các gói dịch vụ, cấu trúc giá linh hoạt (theo tài nguyên, gói combo, thời hạn), xử lý các giao dịch mua, gia hạn, nâng cấp gói, tính toán giá pro-rata, quản lý trạng thái Subscription (đang hoạt động, hết hạn, tạm ngưng) và theo dõi hạn mức sử dụng tài nguyên của từng khách hàng. BUM cũng định nghĩa và cung cấp thông tin về các quyền lợi tính năng (feature entitlements) đi kèm với mỗi gói dịch vụ, làm cơ sở cho IAM kiểm soát truy cập. BUM phát ra các sự kiện quan trọng khi trạng thái thanh toán hoặc quyền lợi thay đổi.

- **Notification Delivery Management (NDM):** Cung cấp dịch vụ tập trung để xử lý, định tuyến và gửi các loại thông báo khác nhau đến người dùng hoặc tổ chức. NDM tiếp nhận yêu cầu thông báo (bao gồm nội dung, người nhận, kênh ưu tiên) từ các Bounded Context nghiệp vụ khác, tìm kiếm thông tin người nhận (thông qua IAM), lựa chọn và áp dụng mẫu thông báo phù hợp, bản địa hóa nội dung (sử dụng LZM/RDM) và gửi thông báo qua các kênh đã tích hợp (email, push notification, SMS, in-app). NDM quản lý các mẫu thông báo, cấu hình kênh gửi và lưu trữ lịch sử gửi thông báo.

- **Localization Management (LZM):** Quản lý tập trung toàn bộ các chuỗi văn bản cần bản địa hóa (translation keys) và các bản dịch tương ứng cho tất cả các ngôn ngữ được hỗ trợ trong hệ thống. LZM không chỉ lưu trữ các bản dịch mà còn quản lý trạng thái sẵn sàng của từng ngôn ngữ và điều phối quy trình tự động dịch các chuỗi mới hoặc khi thêm ngôn ngữ mới bằng cách tích hợp với các dịch vụ API dịch thuật bên ngoài. LZM cung cấp dịch vụ tra cứu bản dịch theo key và locale của người dùng và dịch vụ định dạng dữ liệu (ngày giờ, số, tiền tệ) bằng cách sử dụng các quy tắc định dạng từ RDM. LZM là nguồn đáng tin cậy cho mọi nhu cầu bản địa hóa nội dung hiển thị.

- **Reference Data Management (RDM):** Chịu trách nhiệm quản lý và cung cấp các tập dữ liệu tham chiếu mang tính toàn cục, tĩnh hoặc ít thay đổi, được sử dụng rộng rãi trên toàn hệ thống. Các dữ liệu này bao gồm danh sách Quốc gia, danh sách Ngôn ngữ đầy đủ (khác với ngôn ngữ được hỗ trợ bởi LZM), Mã vùng Điện thoại theo Quốc gia, Danh sách Tiền tệ, Múi giờ, và đặc biệt là các Quy tắc Định dạng Locale (ví dụ: định dạng ngày giờ, số thập phân, ký hiệu tiền tệ cho từng vùng miền). RDM hoạt động như một nguồn dữ liệu tham chiếu chỉ đọc đáng tin cậy cho LZM và các BC khác khi cần tra cứu thông tin chuẩn hoặc quy tắc định dạng.

- **Audit Log Management (ALM):** Cung cấp dịch vụ tập trung để ghi nhận, lưu trữ và cho phép truy vấn các bản ghi lịch sử hoạt động (audit logs) trên toàn hệ thống. ALM thu thập thông tin chi tiết về các hành động quan trọng được thực hiện bởi người dùng hoặc hệ thống (ai thực hiện, hành động gì, trên đối tượng nào, vào thời gian nào, từ đâu, kết quả ra sao) từ các Bounded Context khác thông qua các sự kiện hoặc API chuyên dụng. Dữ liệu audit log là thiết yếu cho mục đích bảo mật, tuân thủ quy định, phân tích hành vi người dùng và hỗ trợ khắc phục sự cố.

- **Quản lý tài sản kỹ thuật số (Digital Asset Management - DAM):** Cung cấp giải pháp tập trung để lưu trữ, tổ chức, quản lý vòng đời (từ tải lên, chỉnh sửa, phê duyệt đến lưu trữ/xóa), phân quyền truy cập và phân phối các tài sản kỹ thuật số được sử dụng trong toàn hệ thống Ecoma. Các tài sản này bao gồm hình ảnh sản phẩm, video marketing, tài liệu hướng dẫn, banner quảng cáo, v.v. DAM đảm bảo các tài sản được quản lý hiệu quả, dễ dàng tìm kiếm và sử dụng bởi các Context khác (đặc biệt là PIM và MPM).

- **Xử lý Thanh toán (Payment Processing Management - PPM):** Chịu trách nhiệm xử lý các giao dịch thanh toán thực tế cho các đơn hàng (từ ODM) và các giao dịch tài chính khác (ví dụ: thanh toán gói dịch vụ từ BUM). PPM tích hợp với nhiều cổng thanh toán bên ngoài (ví dụ: cổng thanh toán thẻ, ví điện tử, thanh toán khi nhận hàng), xử lý các loại phương thức thanh toán khác nhau, ghi nhận kết quả giao dịch (thành công, thất bại, đang chờ), xử lý hoàn tiền và các nghiệp vụ tài chính liên quan đến thanh toán. PPM thông báo kết quả xử lý thanh toán cho ODM, BUM và FAM.

**Feature Bounded Context Group:** Nhóm này bao gồm các Bounded Context quản lý các miền nghiệp vụ đặc thù của hệ thống Ecoma, trực tiếp liên quan đến hoạt động kinh doanh thương mại điện tử và các chức năng hỗ trợ. Chúng tạo ra và xử lý dữ liệu cốt lõi trong lĩnh vực của mình và thường phụ thuộc vào các dịch vụ nền tảng từ Core Group, đồng thời tương tác, trao đổi dữ liệu với các Context Feature khác. Nhóm Feature được chia nhỏ hơn thành ba nhóm chính:

**Nhóm Value Stream (Value Stream Bounded Context Group):** Nhóm này bao gồm các Bounded Context trực tiếp tham gia vào chu trình vận hành cốt lõi của thương mại điện tử, xử lý các giao dịch và quy trình phát sinh từ hoạt động bán hàng của khách hàng cuối, tạo ra giá trị trực tiếp.

- **Quản lý thông tin sản phẩm (Product Information Management - PIM):** Chịu trách nhiệm tập trung hóa, làm giàu, chuẩn hóa và quản lý thông tin chi tiết của tất cả các sản phẩm được bán trên các kênh. Điều này bao gồm quản lý các thuộc tính sản phẩm (kỹ thuật, mô tả, kích thước, màu sắc), phân loại sản phẩm theo ngành hàng/danh mục, quản lý mối quan hệ giữa các sản phẩm (ví dụ: sản phẩm liên quan, sản phẩm thay thế), và trạng thái sẵn sàng cho việc xuất bản thông tin sản phẩm ra các kênh bán hàng khác nhau. PIM là nguồn sự thật duy nhất về thông tin chi tiết của sản phẩm.

- **Quản lý kênh bán hàng hợp nhất (Omnichannel Sales Management - OSM):** Chịu trách nhiệm điều phối và quản lý các hoạt động bán hàng trên nhiều kênh khác nhau (ví dụ: website Ecoma, ứng dụng di động, các sàn thương mại điện tử bên ngoài, bán hàng tại cửa hàng vật lý). OSM tiếp nhận các giao dịch bán hàng từ các kênh này, chuẩn hóa dữ liệu đơn hàng ban đầu, kiểm tra tính hợp lệ và là điểm khởi đầu cho việc tạo đơn hàng chính thức trong hệ thống. OSM cung cấp cái nhìn tổng thể về hiệu quả bán hàng trên các kênh và đảm bảo trải nghiệm mua sắm nhất quán cho khách hàng.

- **Quản lý Đơn hàng (Order Management - ODM):** Chịu trách nhiệm quản lý toàn bộ vòng đời của một đơn hàng kể từ khi nó được tạo ra từ OSM cho đến khi hoàn tất. ODM xử lý việc xác nhận đơn hàng, quản lý các trạng thái đơn hàng (đang xử lý, đã xác nhận, đã đóng gói, đang vận chuyển, đã giao, đã hủy, đã trả hàng), xử lý các yêu cầu thay đổi hoặc hủy đơn hàng từ khách hàng hoặc hệ thống nội bộ, và điều phối các bước tiếp theo bằng cách tương tác với các Context khác như PPM (thanh toán), ICM (tồn kho), và SFM (hoàn tất/vận chuyển). ODM là nguồn sự thật duy nhất về trạng thái hiện tại và lịch sử của mọi đơn hàng.

- **Quản lý Vận chuyển & Hoàn tất Đơn hàng (Shipping & Fulfillment Management - SFM):** Quản lý quy trình từ khi đơn hàng sẵn sàng được xử lý tại kho cho đến khi được giao thành công đến tay khách hàng. SFM nhận yêu cầu hoàn tất đơn hàng từ ODM, quản lý quy trình lấy hàng (picking), đóng gói (packing), tích hợp với các đơn vị vận chuyển bên ngoài để tạo mã vận đơn và yêu cầu lấy hàng. SFM theo dõi hành trình vận chuyển, xử lý các vấn đề phát sinh trong quá trình giao hàng và cập nhật trạng thái vận chuyển trở lại cho ODM và NDM (để thông báo cho khách hàng). SFM làm việc chặt chẽ với ICM để xác định vị trí hàng hóa và cập nhật tồn kho sau khi xuất kho.



- **Quản lý Kiểm soát Tồn kho (Inventory Control Management - ICM):** Chịu trách nhiệm theo dõi số lượng và trạng thái chính xác của hàng hóa tồn kho tại tất cả các địa điểm lưu trữ (kho hàng trung tâm, cửa hàng, kho ký gửi, v.v.). ICM quản lý vòng đời của đơn vị tồn kho từ khi nhập kho (ví dụ: từ nhà cung cấp) đến khi xuất kho (do bán hàng, trả hàng). Context này nhận cập nhật số lượng tồn kho từ các giao dịch bán hàng (từ OSM/ODM), quy trình hoàn tất (từ SFM), và quy trình nhập hàng. ICM cung cấp dữ liệu tồn kho khả dụng chính xác cho các Context khác khi cần (ví dụ: cho OSM để hiển thị trên kênh bán hàng, cho ODM để kiểm tra khi tạo đơn, cho SFM để xử lý hoàn tất). ICM cũng có thể quản lý các cảnh báo về mức tồn kho tối thiểu.

**Nhóm Hỗ trợ (Supporting Bounded Context Group):** Nhóm này bao gồm các Bounded Context quản lý các quy trình nội bộ, quan hệ khách hàng, marketing và tài chính, đóng vai trò hỗ trợ cho luồng giá trị chính và các hoạt động vận hành của doanh nghiệp.

- **Quản lý đào tạo nội bộ (Internal Training Management - ITM):** Quản lý nội dung đào tạo (ví dụ: tạo, cập nhật, tổ chức các khóa học, bài học, tài liệu), quản lý danh sách người học (nhân viên của doanh nghiệp sử dụng Ecoma), theo dõi tiến trình học tập của từng người học, ghi nhận kết quả đánh giá/bài kiểm tra và cung cấp các báo cáo về hoạt động đào tạo nội bộ. Context này hỗ trợ việc nâng cao năng lực cho nhân viên sử dụng hệ thống.

- **Quản lý quan hệ khách hàng & Dịch vụ khách hàng (Customer Relationship Management - CRM):** Quản lý thông tin chi tiết về khách hàng (cá nhân, doanh nghiệp), lịch sử tương tác với khách hàng qua các kênh khác nhau (ví dụ: email, điện thoại, chat, mạng xã hội), phân loại khách hàng (ví dụ: khách hàng tiềm năng, khách hàng trung thành, khách hàng VIP). CRM hỗ trợ các quy trình liên quan đến bán hàng (ví dụ: quản lý lead, cơ hội bán hàng), marketing (ví dụ: phân khúc khách hàng cho chiến dịch), và đặc biệt là quản lý dịch vụ khách hàng (ví dụ: quản lý các yêu cầu hỗ trợ, ticket, giao tiếp sau bán hàng, xử lý khiếu nại). CRM giúp xây dựng và duy trì mối quan hệ tốt với khách hàng.

- **Quản lý nguồn nhân lực (Human Resource Management - HRM):** Quản lý các quy trình và dữ liệu liên quan đến nhân viên trong tổ chức sử dụng Ecoma. Điều này bao gồm quản lý thông tin hồ sơ nhân viên, quy trình tuyển dụng, quản lý hợp đồng lao động, quản lý lương thưởng và phúc lợi, theo dõi thời gian làm việc, quản lý nghỉ phép, và đánh giá hiệu suất làm việc. HRM hỗ trợ các hoạt động quản lý nhân sự nội bộ của doanh nghiệp.

- **Quản lý Công việc & Quy trình (Work & Process Management - WPM):** Cung cấp nền tảng để định nghĩa, tổ chức và theo dõi các đơn vị công việc (Task) và các chuỗi công việc tuần tự (Workflow). WPM cho phép nhóm các công việc/quy trình theo các Dự án (Project), gán nguồn lực (nhân viên) cho từng công việc, theo dõi tiến độ thực hiện, quản lý thời hạn và cung cấp thông tin tổng quan về trạng thái của mọi công việc đang diễn ra trong hệ thống, dù là các công việc độc lập hay thuộc về các dự án cụ thể.

- **Quản lý Marketing & Khuyến mãi (Marketing & Promotion Management - MPM):** Chịu trách nhiệm định nghĩa, quản lý và thực thi các chiến dịch marketing và các chương trình khuyến mãi nhằm thu hút và giữ chân khách hàng. Điều này bao gồm tạo và quản lý các loại mã giảm giá (ví dụ: giảm theo phần trăm, giảm số tiền cố định, miễn phí vận chuyển), định nghĩa các quy tắc áp dụng khuyến mãi phức tạp (dựa trên sản phẩm, danh mục, giá trị đơn hàng, nhóm khách hàng), quản lý các chương trình tích điểm/khách hàng thân thiết. MPM cung cấp dịch vụ tính toán và áp dụng khuyến mãi cho giỏ hàng/đơn hàng khi được gọi từ OSM hoặc ODM. MPM làm việc chặt chẽ với PIM (để áp dụng cho sản phẩm), CRM (để nhắm mục tiêu khách hàng).

- **Quản lý Tài chính Kế toán (Financial Accounting Management - FAM):** Chịu trách nhiệm ghi nhận, xử lý và báo cáo các giao dịch tài chính của doanh nghiệp sử dụng Ecoma. FAM quản lý hệ thống sổ cái chung, theo dõi công nợ phải thu từ khách hàng và công nợ phải trả cho nhà cung cấp, quản lý tài sản cố định, ghi nhận doanh thu từ bán hàng (từ OSM/ODM), doanh thu từ gói dịch vụ (từ BUM) và các khoản chi phí. FAM nhận dữ liệu tài chính từ các Context khác có liên quan đến tiền tệ (đặc biệt là PPM và BUM) và tạo ra các báo cáo tài chính (ví dụ: báo cáo doanh thu, báo cáo lãi lỗ, bảng cân đối kế toán).

Biểu đồ dưới đây minh họa cấu trúc tổng thể của hệ thống Ecoma, thể hiện các Bounded Context được nhóm lại theo chức năng (Core, Feature với các nhóm con: Master Data, Value Stream, Supporting) và các mối quan hệ tương tác chính giữa chúng. _Lưu ý: Biểu đồ này chỉ thể hiện các nhóm cấp cao để giữ sự rõ ràng._

```mermaid
graph TD
    %% Core Bounded Contexts
    IAM[Identity & Access Management]
    BUM[Billing & Usage Management]
    NDM[Notification Delivery Management]
    LZM[Localization Management]
    RDM[Reference Data Management]
    ALD[Audit Log Management]

    %% Feature Bounded Contexts - Subgroups
    PIM[Product Information Management]
    DAM[Digital Asset Management]
    OSM[Omnichannel Sales Management]
    ODM[Order Management]
    SFM[Shipping & Fulfillment Management]
    PPM[Payment Processing Management]
    ICM[Inventory Control Management]
    ITM[Internal Training Management]
    CRM[Customer Relationship Management & Service]
    HRM[Human Resource Management]
    WPM[Work & Process Management]
    MPM[Marketing & Promotion Management]
    FAM[Financial Accounting Management]


    %% Logical groups
    subgraph Core [Core Bounded Contexts]
        IAM
        BUM
        NDM
        LZM
        RDM
        ALD
    end

    subgraph Feature [Feature Bounded Contexts]
        subgraph MD [Nhóm Dữ liệu Nền tảng]
            PIM
            DAM
        end
        subgraph VS [Nhóm Value Stream]
            OSM
            ODM
            SFM
            PPM
            ICM
        end
        subgraph Support [Nhóm Hỗ trợ]
            ITM
            CRM
            HRM
            WPM
            MPM
            FAM
        end
    end


    %% Core Usage
    MD -->|Uses Core Services| IAM
    MD -->|Uses Core Services| BUM
    MD -->|Uses Core Services| NDM
    MD -->|Uses Core Services| LZM
    MD -->|Uses Core Services| RDM

    VS -->|Uses Core Services| IAM
    VS -->|Uses Core Services| BUM
    VS -->|Uses Core Services| NDM
    VS -->|Uses Core Services| LZM
    VS -->|Uses Core Services| RDM

    Support -->|Uses Core Services| IAM
    Support -->|Uses Core Services| BUM
    Support -->|Uses Core Services| NDM
    Support -->|Uses Core Services| LZM
    Support -->|Uses Core Services| RDM

    %% Audit + Notification Events
    MD -->|Emits Events| ALD
    VS -->|Emits Events| ALD
    Support -->|Emits Events| ALD

    MD -->|Emits Events| NDM
    VS -->|Emits Events| NDM
    Support -->|Emits Events| NDM

    VS -->|Emits Events| BUM
    Support -->|Emits Events| BUM %% E.g., CRM might trigger usage for certain features


    %% Value Stream Flow & Interactions
    OSM -->|New Order Event| ODM
    ODM -->|Request Payment| PPM
    ODM -->|Check/Deduct Inventory| ICM
    ODM -->|Request Fulfillment| SFM
    ODM -->|Order Complete Event| FAM %% FAM is in Support, but interacts with VS

    %% Data Flow between Feature Subgroups
    PIM -->|Provides Product Data| OSM
    PIM --> ODM
    PIM --> ICM
    DAM -->|Provides Assets| PIM
    MPM -->|Calculates Promotions| OSM
    MPM --> ODM
    CRM -->|Provides Customer Data| OSM
    CRM --> MPM

    %% Event Feedback from VS to Support
    PPM -->|Financial Events| FAM
    ODM --> FAM
    ODM -->|Order/Shipping/Payment Events| CRM
    SFM --> CRM
    PPM --> CRM

    %% Internal Core Links
    IAM --> BUM
    LZM --> RDM

    %% Styling
    classDef core fill:#cce5ff,stroke:#004085,stroke-width:1px
    classDef feature fill:#d4edda,stroke:#155724,stroke-width:1px
    classDef md fill:#f8d7da,stroke:#721c24,stroke-width:1px
    classDef vs fill:#fff3cd,stroke:#856404,stroke-width:1px
    classDef support fill:#d1ecf1,stroke:#0c5460,stroke-width:1px


    class IAM,BUM,NDM,LZM,RDM,ALD core
    class PIM,DAM md
    class OSM,ODM,SFM,PPM,ICM vs
    class ITM,CRM,HRM,WPM,MPM,FAM support



```

## 5. Ngôn ngữ Chung (Ubiquitous Language)

Trong Domain-Driven Design, Ngôn ngữ Chung (Ubiquitous Language) là một ngôn ngữ được cấu trúc cẩn thận, được chia sẻ giữa các thành viên trong đội phát triển và các chuyên gia nghiệp vụ (domain experts) trong một Bounded Context cụ thể. Ngôn ngữ này được sử dụng thống nhất trong mọi cuộc thảo luận, trong mã nguồn, trong tài liệu và trong giao diện người dùng liên quan đến Context đó.

Mỗi Bounded Context trong hệ thống Ecoma có Ngôn ngữ Chung riêng của mình. Các thuật ngữ, định nghĩa và khái niệm chỉ có ý nghĩa chính xác trong phạm vi của Context mà chúng thuộc về. Ví dụ:

- Thuật ngữ "Sản phẩm" trong **PIM** có thể bao gồm các thuộc tính chi tiết về kỹ thuật, mô tả dài, phân loại theo ngành hàng.

- Thuật ngữ "Sản phẩm" trong **OSM** có thể tập trung vào thông tin cần thiết cho việc bán hàng như giá bán, tồn kho khả dụng, các chương trình khuyến mãi áp dụng.

- Thuật ngữ "Đơn hàng" trong **OSM** là sự kiện khởi tạo giao dịch bán hàng.

- Thuật ngữ "Đơn hàng" trong **ODM** là một thực thể nghiệp vụ phức tạp với vòng đời trạng thái, các mục hàng, thông tin vận chuyển và thanh toán.

Việc duy trì Ngôn ngữ Chung rõ ràng và nhất quán trong từng Bounded Context là cực kỳ quan trọng để tránh sự nhầm lẫn, đảm bảo sự hiểu biết chung giữa các bên liên quan và định hình ranh giới của các mô hình domain một cách chính xác. Các mô tả chi tiết về Ngôn ngữ Chung cho từng Bounded Context sẽ được làm rõ trong các tài liệu chuyên sâu hơn về từng Context cụ thể.

## 6. Quan hệ và Tương tác giữa các Bounded Context

Các Bounded Context trong hệ thống Ecoma tương tác với nhau chủ yếu thông qua việc phát ra và tiêu thụ các sự kiện (Events) qua Message Broker, tạo nên một kiến trúc hướng sự kiện với coupling lỏng lẻo. Tuy nhiên, một số tương tác yêu cầu phản hồi tức thời sẽ sử dụng các yêu cầu đồng bộ (Sync Requests), đặc biệt là khi gọi đến các dịch vụ nền tảng trong Core Group.

Các Bounded Context trong nhóm **Core Group** đóng vai trò cung cấp các dịch vụ nền tảng và quản lý các khía cạnh nghiệp vụ mang tính xuyên suốt toàn hệ thống mà các Context khác phụ thuộc vào. Cụ thể:

- **IAM** cung cấp dịch vụ xác thực và ủy quyền cho các Context khác. Các sự kiện về người dùng và tổ chức từ IAM được các Context khác tiêu thụ để cập nhật thông tin liên quan hoặc kích hoạt các quy trình ban đầu (ví dụ: tạo tài khoản thanh toán cho tổ chức mới). IAM làm việc chặt chẽ với BUM để xác định và thực thi quyền truy cập tính năng. **IAM lưu trữ locale người dùng và quốc gia tổ chức/người dùng, cung cấp thông tin này cho các BC khác để bản địa hóa, và sử dụng LZM/RDM cho bản địa hóa giao diện quản trị của chính nó và lấy dữ liệu tham chiếu.**

- **BUM** quản lý các quy trình liên quan đến thanh toán và quyền sử dụng. Các Context nghiệp vụ (đặc biệt là liên quan đến bán hàng và sử dụng tài nguyên) sẽ phát ra các sự kiện để BUM ghi nhận giao dịch và theo dõi mức sử dụng. BUM cũng phát ra các sự kiện về trạng thái thanh toán hoặc sử dụng để các Context khác (như IAM, NDM, và các Context cần thông tin thanh toán) phản ứng. BUM thông báo về sự thay đổi gói dịch vụ hoặc các quyền lợi đi kèm, là thông tin đầu vào quan trọng cho IAM để quản lý quyền truy cập tính năng. **BUM sử dụng dịch vụ định dạng từ LZM (LZM lấy quy tắc từ RDM) và tra cứu dữ liệu tham chiếu (quốc gia, tiền tệ) từ RDM khi hiển thị dữ liệu hoặc cần xác thực cấu hình.**

- **NDM** cung cấp dịch vụ gửi thông báo. Các Context khác phát ra các sự kiện khi có một sự kiện nghiệp vụ cần thông báo. NDM tiếp nhận sự kiện, phân giải người nhận (gọi IAM), **và trong quá trình rendering nội dung thông báo, NDM gọi LZM để tra cứu bản dịch chuỗi tĩnh và sử dụng dịch vụ định dạng (LZM gọi RDM), đồng thời gọi RDM để tra cứu và bản địa hóa dữ liệu tham chiếu động (ví dụ: tên quốc gia).** NDM sau đó gửi thông báo đi qua các kênh tích hợp.

- **LZM** quản lý tập trung **bản dịch văn bản** và cung cấp **dịch vụ bản địa hóa đầu ra (tra cứu bản dịch và định dạng dữ liệu)**. **LZM quản lý các Ngôn ngữ được hỗ trợ và điều phối tự động dịch.** **LZM không lưu trữ quy tắc định dạng Locale mà gọi RDM để lấy các quy tắc này khi cần thực hiện dịch vụ định dạng.** LZM là một dịch vụ mà hầu hết các BC khác sẽ gọi đồng bộ để lấy bản dịch hoặc định dạng dữ liệu. LZM có thể cần locale người dùng (từ BC gọi hoặc IAM). LZM phát sự kiện khi dữ liệu bản dịch hoặc trạng thái ngôn ngữ thay đổi. LZM tương tác với External Translation Providers.

- **RDM** quản lý tập trung các tập **dữ liệu tham chiếu**, bao gồm cả các **Quy tắc Định dạng Locale**. RDM là nguồn đáng tin cậy duy nhất cho các danh sách (quốc gia, ngôn ngữ đầy đủ, tiền tệ, múi giờ, v.v.) và các quy tắc định dạng. **RDM cung cấp API chỉ đọc để LZM và các BC khác truy vấn dữ liệu tham chiếu.** **Đặc biệt, LZM gọi RDM để lấy các quy tắc định dạng khi cần thực hiện dịch vụ định dạng.** RDM phát sự kiện khi dữ liệu tham chiếu được cập nhật.

- **ALD** thu thập các sự kiện audit log từ các BC khác để lưu trữ và cung cấp khả năng truy vấn lịch sử hoạt động.

Các Bounded Context trong nhóm **Feature Group** quản lý các miền nghiệp vụ đặc thù của hệ thống Ecoma. Chúng tạo ra và xử lý dữ liệu cốt lõi trong lĩnh vực của mình và thường phụ thuộc vào các dịch vụ nền tảng từ Core Group (IAM cho định danh/quyền, BUM cho thanh toán/usage, NDM cho thông báo, LZM cho bản địa hóa, RDM cho dữ liệu tham chiếu, ALD cho ghi log), cũng như tương tác, trao đổi dữ liệu với các Context Feature khác.

- **Các Context trong Nhóm Value Stream** trực tiếp tham gia vào luồng xử lý các giao dịch phát sinh từ khách hàng cuối (đơn hàng, thanh toán, vận chuyển). Chúng phụ thuộc vào các dịch vụ nền tảng từ Core Group và tương tác chặt chẽ với nhau để hoàn thành luồng xử lý đơn hàng (OSM -> ODM -> PPM/ICM/SFM -> FAM). Các Context này cũng có thể tương tác với các Context trong Nhóm Hỗ trợ và Nhóm Dữ liệu Nền tảng để lấy dữ liệu cấu hình hoặc master (ví dụ: OSM/ODM lấy thông tin sản phẩm từ PIM, MPM áp dụng quy tắc khuyến mãi).

- **Các Context trong Nhóm Dữ liệu Nền tảng** cung cấp nguồn dữ liệu master đáng tin cậy cho các Context khác, đặc biệt là Nhóm Value Stream và Nhóm Hỗ trợ. Chúng phụ thuộc nhiều vào Core Contexts cho các chức năng nền tảng.

- **Các Context trong Nhóm Hỗ trợ** quản lý các quy trình nội bộ và hoạt động hỗ trợ kinh doanh. Chúng phụ thuộc nhiều vào Core Contexts cho xác thực/ủy quyền, thông báo, bản địa hóa, dữ liệu tham chiếu và ghi log. Chúng cũng tương tác với Nhóm Value Stream (ví dụ: FAM nhận dữ liệu tài chính từ ODM/PPM, CRM nhận thông tin đơn hàng/vận chuyển/thanh toán).

Tương tác cụ thể giữa các BC trong Feature Group:

- **OSM** là điểm tiếp nhận giao dịch bán hàng từ các kênh, tạo ra các sự kiện về đơn hàng mới.

- **ODM** tiêu thụ sự kiện từ OSM để bắt đầu quản lý vòng đời đơn hàng. ODM phối hợp với **PPM** để xử lý thanh toán, với **ICM** để kiểm tra và trừ tồn kho, và với **SFM** để bắt đầu quy trình hoàn tất và vận chuyển. ODM phát ra các sự kiện về trạng thái đơn hàng (ví dụ: đã xác nhận, đã thanh toán, đã gửi đi, đã giao thành công) mà các BC khác (như FAM, CRM, NDM) tiêu thụ. ODM cũng có thể gọi **MPM** để tính toán khuyến mãi áp dụng cho đơn hàng.

- **SFM** tiêu thụ sự kiện từ ODM để xử lý hoàn tất và vận chuyển. SFM tương tác với ICM để cập nhật tồn kho và có thể phát sự kiện cho NDM và CRM về trạng thái vận chuyển.

- **PPM** xử lý các yêu cầu thanh toán từ ODM và các nguồn khác. PPM tương tác với các cổng thanh toán bên ngoài và phát sự kiện về kết quả thanh toán cho ODM và FAM.

- **MPM** được sử dụng bởi OSM (để tính khuyến mãi khi tạo đơn hàng) và có thể bởi các BC khác (ví dụ: CRM cho chiến dịch marketing). MPM tương tác với PIM và CRM để xác định đối tượng và sản phẩm áp dụng. MPM có thể phát sự kiện về các chương trình khuyến mãi mới hoặc thay đổi.

- **ICM** nhận cập nhật tồn kho từ nhiều nguồn (nhập hàng, xuất hàng từ SFM/ODM) và cung cấp thông tin tồn kho cho OSM, ODM, SFM.

- **FAM** nhận dữ liệu tài chính từ OSM (doanh thu từ bán hàng), PPM (kết quả thanh toán), BUM (doanh thu từ gói dịch vụ/usage), và các nguồn khác để ghi sổ và báo cáo.

- **CRM** quản lý thông tin khách hàng, lịch sử tương tác (bao gồm cả đơn hàng từ ODM, hoạt động marketing từ MPM), và xử lý các yêu cầu dịch vụ khách hàng. CRM có thể cần truy vấn thông tin từ ODM, SFM, PPM để trả lời các câu hỏi liên quan đến đơn hàng, vận chuyển, hoặc thanh toán. CRM sử dụng NDM để giao tiếp với khách hàng.

Nhìn chung, các Context Feature tạo ra giá trị nghiệp vụ chính, phụ thuộc vào Core Contexts cho các chức năng chung (định danh, thanh toán gói dịch vụ/usage, thông báo, bản địa hóa, dữ liệu tham chiếu, ghi log), đồng thời trao đổi dữ liệu nghiệp vụ đặc thù với nhau để hỗ trợ các luồng công việc xuyên suốt hệ thống e-commerce (từ bán hàng, đơn hàng, thanh toán, hoàn tất, tồn kho, đến tài chính và marketing/dịch vụ khách hàng). LZM và RDM bổ sung các lớp dịch vụ nền tảng thiết yếu, cho phép toàn bộ hệ thống phục vụ người dùng ở nhiều ngôn ngữ/vùng miền và sử dụng các dữ liệu chuẩn một cách hiệu quả và nhất quán thông qua việc phân chia trách nhiệm rõ ràng: **LZM cho bản dịch và dịch vụ định dạng, RDM cho dữ liệu tham chiếu bao gồm quy tắc định dạng.**
