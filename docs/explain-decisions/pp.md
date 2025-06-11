# **Quyết định sử dụng Đa dạng Cơ sở dữ liệu (PostgreSQL, MongoDB, Redis) trong Ecoma**

## **1\. Bối cảnh**

Hệ thống Ecoma được xây dựng trên nền tảng Kiến trúc Microservices và Event-Driven Architecture (EDA), tuân thủ các nguyên tắc của Domain-Driven Design (DDD). Một trong những nguyên tắc cốt lõi của kiến trúc Microservices là sự độc lập về dữ liệu: mỗi Microservice (tương ứng với một Bounded Context hoặc một phần của nó) nên sở hữu và quản lý dữ liệu của riêng mình, không chia sẻ trực tiếp cơ sở dữ liệu với các dịch vụ khác.

Miền nghiệp vụ của Ecoma rất đa dạng, bao gồm các loại dữ liệu và yêu cầu truy cập khác nhau:

- Một số Bounded Contexts (BCs) quản lý dữ liệu có cấu trúc chặt chẽ, yêu cầu tính toàn vẹn cao, các ràng buộc phức tạp và các giao dịch ACID (ví dụ: thông tin người dùng, gói dịch vụ, giao dịch thanh toán).
- Một số BCs khác xử lý dữ liệu có cấu trúc linh hoạt hơn, thường xuyên thay đổi schema, hoặc cần khả năng mở rộng theo chiều ngang dễ dàng cho lượng dữ liệu lớn (ví dụ: log hoạt động, dữ liệu sản phẩm với nhiều thuộc tính tùy chỉnh, nội dung bản địa hóa).
- Toàn bộ hệ thống cần các cơ chế lưu trữ tạm thời, bộ đệm hiệu năng cao, hoặc lưu trữ dữ liệu cho các tác vụ xử lý nhanh.

Việc chỉ sử dụng một loại cơ sở dữ liệu duy nhất cho tất cả các nhu cầu đa dạng này sẽ không tối ưu về hiệu suất, khả năng mở rộng, và tính linh hoạt cho từng Microservice.

## **2\. Vấn đề**

Nếu áp dụng một cách tiếp cận "một cơ sở dữ liệu cho tất cả" (Single Database Type) trong kiến trúc Microservices của Ecoma, chúng ta sẽ đối mặt với các vấn đề sau:

- **Không tối ưu cho các loại dữ liệu và truy cập khác nhau:** Cơ sở dữ liệu quan hệ (RDBMS) có thể không phù hợp cho dữ liệu phi cấu trúc hoặc bán cấu trúc, trong khi cơ sở dữ liệu NoSQL có thể không đáp ứng được yêu cầu về tính toàn vẹn dữ liệu chặt chẽ và các ràng buộc phức tạp cần thiết cho một số nghiệp vụ cốt lõi.
- **Hạn chế khả năng mở rộng độc lập:** Việc cố gắng mở rộng một loại database duy nhất để phục vụ tất cả các nhu cầu khác nhau có thể trở nên phức tạp và kém hiệu quả.
- **Ràng buộc về công nghệ:** Các nhóm phát triển bị giới hạn trong việc lựa chọn công nghệ lưu trữ phù hợp nhất với yêu cầu cụ thể của Bounded Context mà họ đang làm việc.
- **Hiệu suất kém cho các tác vụ đặc thù:** Các tác vụ như caching, quản lý session, hoặc lưu trữ dữ liệu tạm thời hiệu năng cao không thể được xử lý hiệu quả bằng cơ sở dữ liệu transactional truyền thống.

Chúng ta cần một chiến lược lưu trữ dữ liệu cho phép mỗi Microservice lựa chọn công nghệ database phù hợp nhất với nhu cầu của nó, đồng thời đáp ứng các yêu cầu đa dạng về cấu trúc dữ liệu, tính nhất quán, hiệu suất và khả năng mở rộng trên toàn hệ thống.

## **3\. Quyết định**

Chúng tôi quyết định áp dụng chiến lược **Đa dạng Cơ sở dữ liệu (Polyglot Persistence)** trong hệ thống Ecoma, sử dụng ba loại cơ sở dữ liệu chính với vai trò và mục đích cụ thể:

1. **PostgreSQL:** Được sử dụng làm cơ sở dữ liệu quan hệ (RDBMS) chính cho các Bounded Contexts quản lý dữ liệu có cấu trúc chặt chẽ, yêu cầu tính toàn vẹn dữ liệu cao, hỗ trợ các ràng buộc phức tạp, và cần các giao dịch ACID đáng tin cậy.
2. **MongoDB:** Được sử dụng làm cơ sở dữ liệu NoSQL (Document Database) cho các Bounded Contexts xử lý dữ liệu có cấu trúc linh hoạt, thường xuyên thay đổi schema, hoặc cần khả năng mở rộng theo chiều ngang dễ dàng cho lượng dữ liệu lớn.
3. **Redis:** Được sử dụng chủ yếu làm bộ đệm (Cache), lưu trữ session, hoặc làm nơi lưu trữ dữ liệu tạm thời hiệu năng cao cho các tác vụ yêu cầu tốc độ truy cập cực nhanh và độ trễ thấp.

Mỗi Microservice sẽ sở hữu và quản lý instance database của riêng mình (có thể là PostgreSQL, MongoDB hoặc Redis tùy thuộc vào nhu cầu), tuân thủ nguyên tắc độc lập dữ liệu.

## **4\. Lý do và Cơ sở (Justification)**

Việc lựa chọn ba loại database này và áp dụng chiến lược Polyglot Persistence là phù hợp và chiến lược cho Ecoma vì những lý do sau:

- **Tối ưu hóa cho các nhu cầu đa dạng:**
  - **PostgreSQL:** Là một RDBMS mạnh mẽ, đáng tin cậy, hỗ trợ đầy đủ các tính năng SQL, tính toàn vẹn dữ liệu (ACID transactions, constraints), và các kiểu dữ liệu phức tạp. Đây là lựa chọn lý tưởng cho các nghiệp vụ cốt lõi yêu cầu độ chính xác và nhất quán cao (ví dụ: BUM, IAM).
  - **MongoDB:** Là một Document Database linh hoạt, cho phép lưu trữ dữ liệu dưới dạng JSON/BSON, rất phù hợp với các miền nghiệp vụ có cấu trúc dữ liệu không cố định hoặc cần phát triển nhanh chóng mà không bị ràng buộc bởi schema cứng nhắc (ví dụ: PIM, LZM, ALM). Khả năng mở rộng theo chiều ngang của MongoDB cũng là một lợi thế cho dữ liệu có khối lượng lớn.
  - **Redis:** Là một Key-Value Store trong bộ nhớ (in-memory), cung cấp hiệu suất đọc/ghi cực cao. Nó là giải pháp tối ưu cho các trường hợp sử dụng cần tốc độ, như caching dữ liệu thường xuyên truy cập, quản lý trạng thái session, hoặc lưu trữ dữ liệu tạm thời hiệu năng cao.
- **Hỗ trợ nguyên tắc Độc lập Dữ liệu của Microservices:** Cho phép mỗi Microservice lựa chọn công nghệ lưu trữ phù hợp nhất với miền nghiệp vụ của nó mà không ảnh hưởng đến các dịch vụ khác. Điều này tăng cường tính tự chủ và linh hoạt cho các nhóm phát triển.
- **Cải thiện hiệu suất và khả năng mở rộng:** Bằng cách sử dụng database chuyên biệt cho từng loại nhu cầu, chúng ta có thể tối ưu hóa hiệu suất và khả năng mở rộng cho từng phần của hệ thống. Ví dụ, luồng đọc (Queries trong CQRS) có thể được tối ưu hóa bằng cách đọc từ các Read Model được lưu trữ trong MongoDB hoặc được cache trong Redis.
- **Linh hoạt công nghệ (Technology Flexibility):** Cho phép các nhóm sử dụng công nghệ database mà họ quen thuộc và phù hợp nhất với tác vụ, thay vì bị ép buộc sử dụng một công nghệ duy nhất.

## **5\. Áp dụng trong Ecoma**

Trong Ecoma, chiến lược này sẽ được áp dụng như sau:

- Mỗi Microservice sẽ xác định nhu cầu lưu trữ dữ liệu của mình dựa trên tính chất nghiệp vụ và cấu trúc dữ liệu.
- Dựa trên phân tích đó, Microservice sẽ lựa chọn loại database phù hợp nhất trong ba loại đã quyết định (PostgreSQL, MongoDB, Redis) để làm nơi lưu trữ chính cho dữ liệu của mình.
- Nguyên tắc độc lập dữ liệu được tuân thủ nghiêm ngặt: các Microservice không truy cập trực tiếp vào database của nhau. Mọi tương tác dữ liệu giữa các service phải thông qua API hoặc Events.
- Redis được sử dụng chung cho các mục đích caching hoặc session management trên toàn hệ thống, nhưng các key/namespace cần được quản lý cẩn thận để tránh xung đột giữa các service.

**Ví dụ:**

- **IAM, BUM:** Có thể sử dụng **PostgreSQL** để lưu trữ thông tin người dùng, tổ chức, gói dịch vụ, giao dịch thanh toán do yêu cầu cao về tính toàn vẹn và ràng buộc dữ liệu.
- **PIM, LZM, ALM:** Có thể sử dụng **MongoDB** để lưu trữ thông tin sản phẩm (với các thuộc tính tùy chỉnh), bản dịch, hoặc audit logs do tính linh hoạt của schema và khối lượng dữ liệu lớn.
- **Tất cả các Services:** Có thể sử dụng **Redis** để cache các dữ liệu thường xuyên truy cập (ví dụ: thông tin cấu hình, kết quả truy vấn phổ biến), lưu trữ session người dùng, hoặc làm nơi lưu trữ dữ liệu tạm thời hiệu năng cao.

## **6\. Lợi ích**

- **Tối ưu hóa hiệu suất và khả năng mở rộng:** Sử dụng database phù hợp nhất cho từng nhu cầu cụ thể.
- **Tăng cường tính độc lập và linh hoạt cho Microservices:** Mỗi service có thể lựa chọn công nghệ lưu trữ tối ưu.
- **Hỗ trợ tốt cho các loại dữ liệu đa dạng:** Có công cụ phù hợp để xử lý cả dữ liệu có cấu trúc và phi cấu trúc.
- **Cải thiện Developer Experience (DX):** Các nhóm có thể sử dụng công nghệ phù hợp nhất với nhiệm vụ của họ.

## **7\. Hậu quả (Consequences)**

- **Tăng độ phức tạp vận hành:** Việc quản lý, giám sát và bảo trì nhiều loại database khác nhau đòi hỏi kiến thức và công cụ chuyên biệt hơn so với quản lý một loại database duy nhất.
- **Yêu cầu kiến thức đa dạng cho đội ngũ:** Các thành viên trong đội ngũ cần có kiến thức và kinh nghiệm làm việc với cả PostgreSQL, MongoDB và Redis.
- **Thách thức trong việc tổng hợp dữ liệu và báo cáo:** Việc truy vấn hoặc tổng hợp dữ liệu từ nhiều nguồn database khác nhau có thể phức tạp hơn. Cần có các giải pháp như Data Warehouse hoặc Data Lake để giải quyết vấn đề này ở quy mô lớn.
- **Nguy cơ phân mảnh kiến thức:** Nếu không có hướng dẫn rõ ràng, các nhóm có thể tùy ý lựa chọn database mà không dựa trên tiêu chí phù hợp, dẫn đến sự không nhất quán.

## **8\. Kết luận**

Việc áp dụng chiến lược Đa dạng Cơ sở dữ liệu (Polyglot Persistence) với PostgreSQL, MongoDB và Redis là một quyết định chiến lược quan trọng, cần thiết để xây dựng một hệ thống Microservices có khả năng mở rộng, hiệu suất cao và linh hoạt như Ecoma. Mặc dù có những thách thức về mặt vận hành và yêu cầu kiến thức đa dạng, lợi ích của việc sử dụng database phù hợp nhất cho từng nhu cầu cụ thể là rất lớn, giúp tối ưu hóa hệ thống và hỗ trợ hiệu quả sự phát triển của các Bounded Contexts khác nhau. Cần có các hướng dẫn rõ ràng và đầu tư vào năng lực vận hành để quản lý hiệu quả môi trường đa database này.
