# **Microservices Architecture (MA) - Phong cách kiến trúc cốt lõi của Ecoma**

## **1\. Bối cảnh**

Hệ thống Ecoma là một nền tảng SaaS quản lý vận hành cho các doanh nghiệp thương mại điện tử. Miền nghiệp vụ của Ecoma rất rộng và phức tạp, bao gồm nhiều lĩnh vực chuyên biệt như quản lý đơn hàng, tồn kho, khách hàng, marketing, thanh toán, v.v. Nghiệp vụ trong lĩnh vực này liên tục thay đổi và phát triển nhanh chóng.

Chúng ta đã chọn [Domain-Driven Design](/explain-decisions/ddd) làm phương pháp thiết kế cốt lõi và đã thành công trong việc xác định và phân tách hệ thống thành nhiều Bounded Context (BC) rõ ràng, mỗi BC đại diện cho một miền nghiệp vụ cụ thể với ranh giới và ngôn ngữ thống nhất riêng.

Với sự phức tạp và quy mô dự kiến của hệ thống, cũng như nhu cầu liên tục phát triển và thay đổi, việc xây dựng toàn bộ hệ thống như một khối ứng dụng lớn duy nhất (Monolith) sẽ đặt ra nhiều thách thức đáng kể.

## **2\. Vấn đề**

Nếu xây dựng Ecoma dưới dạng kiến trúc Monolith, chúng ta sẽ đối mặt với các vấn đề sau:

- **Khó khăn trong phát triển và bảo trì:** Toàn bộ codebase nằm trong một khối duy nhất, khiến việc hiểu, thay đổi và bảo trì trở nên khó khăn khi hệ thống phát triển lớn. Các thay đổi ở một phần có thể dễ dàng ảnh hưởng đến các phần khác.
- **Giảm tốc độ phát triển:** Khi codebase lớn, thời gian build, deploy và khởi động ứng dụng tăng lên. Nhiều nhóm làm việc trên cùng một codebase lớn cũng dễ dẫn đến xung đột và chờ đợi lẫn nhau.
- **Khó mở rộng độc lập:** Không thể mở rộng riêng lẻ các phần của hệ thống có tải lượng cao. Khi cần mở rộng, chúng ta phải mở rộng toàn bộ ứng dụng Monolith, dẫn đến lãng phí tài nguyên.
- **Thiếu khả năng chịu lỗi:** Nếu một thành phần nhỏ trong Monolith gặp lỗi, toàn bộ ứng dụng có thể bị sập, ảnh hưởng đến tất cả các chức năng.
- **Ràng buộc về công nghệ:** Toàn bộ Monolith thường bị ràng buộc bởi một bộ công nghệ (ngôn ngữ lập trình, framework) duy nhất. Việc áp dụng công nghệ mới hoặc phù hợp hơn cho các phần nghiệp vụ cụ thể là rất khó khăn.
- **Khó khăn trong việc tổ chức đội nhóm:** Các đội nhóm phát triển có thể khó làm việc độc lập và sở hữu toàn bộ vòng đời của một phần nghiệp vụ cụ thể.

Chúng ta cần một kiến trúc cho phép phân rã hệ thống thành các đơn vị nhỏ hơn, độc lập, dễ quản lý, phát triển, triển khai và mở rộng, đồng thời phù hợp với kết quả phân tích nghiệp vụ từ DDD.

## **3\. Quyết định**

Chúng tôi quyết định áp dụng **Kiến trúc Microservices** làm kiến trúc tổng thể cho hệ thống Ecoma.

Hệ thống sẽ được phân rã thành một tập hợp các dịch vụ nhỏ, độc lập, mỗi dịch vụ thường tương ứng với một Bounded Context (hoặc một nhóm các BC nhỏ có liên quan chặt chẽ). Mỗi Microservice sẽ tập trung vào việc thực hiện một tập hợp chức năng nghiệp vụ cụ thể và có thể được phát triển, triển khai và mở rộng một cách độc lập.

## **4\. Lý do và Cơ sở (Justification)**

Kiến trúc Microservices là một lựa chọn phù hợp và chiến lược cho hệ thống Ecoma vì những lý do sau:

- **Phù hợp với kết quả DDD:** Microservices là một cách tự nhiên để hiện thực hóa ranh giới của các Bounded Context đã được xác định thông qua DDD. Mỗi BC trở thành một ứng dụng độc lập (Microservice).
- **Tăng cường khả năng mở rộng (Scalability):** Cho phép mở rộng riêng lẻ các dịch vụ có tải lượng cao mà không cần mở rộng toàn bộ hệ thống, tối ưu hóa việc sử dụng tài nguyên.
- **Cải thiện khả năng chịu lỗi (Fault Tolerance):** Lỗi trong một dịch vụ thường không ảnh hưởng đến các dịch vụ khác, giúp hệ thống tổng thể ổn định hơn.
- **Nâng cao khả năng bảo trì (Maintainability):** Codebase của mỗi dịch vụ nhỏ hơn và tập trung vào một miền nghiệp vụ cụ thể, giúp dễ dàng hiểu, thay đổi và bảo trì.
- **Tăng tốc độ phát triển:** Các đội nhóm có thể làm việc độc lập trên các dịch vụ khác nhau, sử dụng công nghệ phù hợp nhất cho từng dịch vụ, và triển khai các thay đổi nhanh chóng mà không ảnh hưởng đến toàn bộ hệ thống.
- **Linh hoạt về công nghệ:** Mỗi dịch vụ có thể sử dụng ngôn ngữ lập trình, framework, cơ sở dữ liệu và công nghệ lưu trữ phù hợp nhất với yêu cầu của nó (Polyglot Persistence/Programming).
- **Hỗ trợ tổ chức đội nhóm:** Cho phép tổ chức các đội nhóm nhỏ, tự quản lý, chịu trách nhiệm toàn bộ vòng đời của một hoặc một vài dịch vụ (You Build It, You Run It).

## **5\. Microservices Hỗ trợ Hệ thống như thế nào?**

Trong Ecoma, các Bounded Context đã được xác định sẽ được triển khai dưới dạng các Microservices. Mỗi Microservice sẽ:

- **Tập trung vào một miền nghiệp vụ:** Chịu trách nhiệm hoàn toàn về logic và dữ liệu của một BC cụ thể (ví dụ: Microservice IAM quản lý danh tính và truy cập, Microservice ODM quản lý đơn hàng).
- **Độc lập về dữ liệu:** Mỗi Microservice sẽ có cơ sở dữ liệu riêng hoặc quản lý dữ liệu của mình một cách độc lập, không chia sẻ database trực tiếp với các dịch vụ khác. Điều này đảm bảo tính tự chủ và loại bỏ sự phụ thuộc chặt chẽ ở tầng dữ liệu.
- **Giao tiếp thông qua API hoặc Sự kiện:** Các dịch vụ sẽ giao tiếp với nhau thông qua các giao diện được định nghĩa rõ ràng (APIs \- ví dụ: REST, gRPC) hoặc thông qua các sự kiện bất đồng bộ (Event-Driven Architecture \- EDA), giảm thiểu sự phụ thuộc trực tiếp.
- **Triển khai độc lập:** Mỗi dịch vụ có thể được triển khai, cập nhật và mở rộng mà không cần triển khai lại toàn bộ hệ thống.
- **Sử dụng công nghệ phù hợp:** Các đội có thể chọn công nghệ phù hợp nhất cho từng dịch vụ dựa trên yêu cầu cụ thể (ví dụ: sử dụng ngôn ngữ/framework khác nhau, database khác nhau).

## **6\. Lợi ích**

- Tăng cường khả năng mở rộng và chịu lỗi.
- Cải thiện tốc độ và hiệu quả phát triển.
- Nâng cao khả năng bảo trì và linh hoạt công nghệ.
- Hỗ trợ tổ chức đội nhóm hiệu quả.
- Giảm rủi ro khi thay đổi các phần nhỏ của hệ thống.

## **7\. Hậu quả (Consequences)**

- **Tăng độ phức tạp vận hành:** Việc quản lý một hệ thống phân tán với nhiều dịch vụ độc lập phức tạp hơn nhiều so với quản lý một Monolith (cần các công cụ cho Service Discovery, Load Balancing, Logging, Monitoring, Orchestration như Kubernetes).
- **Thách thức về giao tiếp và phối hợp:** Giao tiếp giữa các dịch vụ cần được thiết kế cẩn thận (ví dụ: xử lý gọi API thất bại, quản lý giao dịch phân tán với EDA/Saga).
- **Kiểm thử phức tạp hơn:** Kiểm thử end-to-end đòi hỏi môi trường phức tạp hơn.
- **Chi phí cơ sở hạ tầng ban đầu có thể cao hơn:** Cần thiết lập hạ tầng hỗ trợ Microservices (Message Broker, API Gateway, Orchestrator).
- **Đường cong học tập:** Đội ngũ cần làm quen với các nguyên tắc và công cụ của kiến trúc phân tán.

## **8\. Kết luận**

Việc áp dụng kiến trúc Microservices là một quyết định chiến lược quan trọng, phù hợp với quy mô, sự phức tạp và tốc độ thay đổi của hệ thống Ecoma. Dựa trên nền tảng phân tích nghiệp vụ từ DDD, Microservices cho phép chúng ta xây dựng một hệ thống linh hoạt, có khả năng mở rộng, chịu lỗi và dễ bảo trì, đáp ứng các mục tiêu kiến trúc cốt lõi. Mặc dù có những thách thức về mặt vận hành và quản lý sự phân tán, lợi ích mà Microservices mang lại là cần thiết để xây dựng một nền tảng SaaS thành công và bền vững.
