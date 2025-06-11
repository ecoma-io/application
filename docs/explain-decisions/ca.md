# **Clean Architecture (CA) - kiến trúc phân rã Bounded Contexts trong Ecoma**

## **1\. Bối cảnh**

Hệ thống Ecoma được thiết kế như một nền tảng SaaS phức tạp cho quản lý vận hành thương mại điện tử, với các mục tiêu kiến trúc quan trọng bao gồm tính sẵn sàng cao, khả năng chịu lỗi, khả năng mở rộng, khả năng bảo trì, trải nghiệm nhà phát triển (DX), dễ dàng thêm tính năng mới và bảo mật ngay từ thiết kế.

Chúng ta đã áp dụng [Domain-Driven Design](/explain-decisions/ddd) làm phương pháp thiết kế cốt lõi để quản lý sự phức tạp của miền nghiệp vụ và đã xác định được các Bounded Context (BC).

Kiến trúc tổng thể của hệ thống là [Microservices Architecture](/explain-decisions/ma) và sử dụng mô hình giao tiếp [Event-Driven Architecture](/explain-decisions/eda), trong đó mỗi Bounded Context (hoặc một nhóm các BC nhỏ) có thể được triển khai như một hoặc nhiều đơn vị độc lập (services, workers, jobs).

## **2\. Vấn đề**

Khi triển khai mỗi Bounded Context như một đơn vị độc lập, chúng ta cần một cấu trúc kiến trúc bên trong nhất quán và mạnh mẽ cho từng đơn vị đó. Nếu không có một kiến trúc nội bộ rõ ràng:

- Logic nghiệp vụ có thể bị trộn lẫn với chi tiết kỹ thuật (như database, framework, giao diện người dùng), làm giảm khả năng bảo trì và kiểm thử.
- Thay đổi trong tầng cơ sở hạ tầng (ví dụ: đổi loại database, hệ thống message queue) sẽ ảnh hưởng trực tiếp đến logic nghiệp vụ cốt lõi.
- Việc kiểm thử logic nghiệp vụ một cách độc lập trở nên khó khăn.
- Việc phân tách BC thành các loại đơn vị triển khai khác nhau (API service, background worker, scheduled job) có thể dẫn đến sự trùng lặp code hoặc cấu trúc không nhất quán.

Chúng ta cần một kiến trúc nội bộ cho mỗi BC giúp tách biệt rõ ràng logic nghiệp vụ khỏi các chi tiết triển khai, đảm bảo tính linh hoạt, khả năng kiểm thử và bảo trì cao, đồng thời hỗ trợ việc triển khai dưới nhiều hình thức khác nhau.

## **3\. Quyết định**

Chúng tôi quyết định áp dụng **Clean Architecture** (còn được biết đến với các tên gọi tương tự như Ports and Adapters, Hexagonal Architecture) làm cấu trúc kiến trúc bên trong cho **mỗi Bounded Context** trong hệ thống Ecoma.

## **4\. Lý do và Cơ sở (Justification)**

Clean Architecture là một lựa chọn phù hợp và chiến lược cho hệ thống Ecoma vì những lý do sau:

- **Tách biệt khỏi Cơ sở hạ tầng (Decoupling from Infrastructure):** Nguyên tắc cốt lõi của Clean Architecture là sự phụ thuộc hướng vào trong. Lớp Domain (chứa các Entity, Value Object, Aggregate, Domain Service của DDD) và lớp Application (chứa các Use Case/Application Service) hoàn toàn không phụ thuộc vào các chi tiết kỹ thuật như database, framework web, hệ thống message queue, hoặc các dịch vụ bên ngoài. Điều này đảm bảo logic nghiệp vụ cốt lõi của mỗi BC là độc lập và có thể kiểm thử dễ dàng.
- **Khả năng kiểm thử cao (High Testability):** Nhờ sự tách biệt rõ ràng, logic nghiệp vụ trong lớp Domain và Application có thể được kiểm thử một cách độc lập mà không cần phụ thuộc vào cơ sở dữ liệu hay các thành phần bên ngoài. Điều này giúp tăng tốc độ và độ tin cậy của quá trình kiểm thử tự động.
- **Khả năng bảo trì và mở rộng (Maintainability and Extensibility):** Cấu trúc phân lớp rõ ràng và nguyên tắc phụ thuộc giúp dễ dàng hiểu được vai trò của từng phần code. Khi có yêu cầu thay đổi, chúng ta biết chính xác cần thay đổi ở lớp nào, giảm thiểu rủi ro ảnh hưởng đến các phần khác của hệ thống. Việc thêm mới Use Case hoặc thay đổi chi tiết triển khai cũng trở nên dễ dàng hơn.
- **Hỗ trợ mạnh mẽ cho DDD:** Clean Architecture cung cấp một cấu trúc tự nhiên để hiện thực hóa các khái niệm của DDD. Lớp Domain của Clean Architecture chính là nơi chứa Domain Model phong phú của DDD. Lớp Application chứa các Use Case điều phối các đối tượng Domain để thực hiện các hành động nghiệp vụ.
- **Linh hoạt trong triển khai (Flexibility in Deployment):** Cấu trúc này cho phép cùng một logic nghiệp vụ cốt lõi (Domain và Application layers) có thể được đóng gói và triển khai dưới nhiều hình thức khác nhau (services, workers, jobs) chỉ bằng cách thay đổi các Adapters ở lớp ngoài cùng.

## **5\. Clean Architecture Hỗ trợ Phân rã BC thành Services/Workers/Jobs như thế nào?**

Clean Architecture định nghĩa các lớp (layers) với nguyên tắc phụ thuộc hướng vào trong. Các lớp bên trong chứa logic nghiệp vụ cốt lõi, trong khi các lớp bên ngoài chứa chi tiết triển khai và adapters để tương tác với thế giới bên ngoài.

- **Lớp Domain (Entities, Value Objects, Aggregates, Domain Services, Domain Events):** Chứa các quy tắc nghiệp vụ cốt lõi và cấu trúc dữ liệu của BC. Hoàn toàn độc lập.
- **Lớp Application (Interfaces/Ports, Use Cases/Application Services, Commands, Queries):** Định nghĩa các hành động nghiệp vụ (Use Cases) mà BC cung cấp và các interfaces (Ports) cần thiết để tương tác với bên ngoài (ví dụ: Repository interfaces, External Service interfaces). Phụ thuộc vào lớp Domain.
- **Lớp Adapters/Infrastructure (Implementations of Ports, Controllers, Presenters, Gateways, ORM, Message Consumers):** Chứa các cài đặt cụ thể cho các Interfaces được định nghĩa ở lớp Application và Domain. Đây là nơi kết nối với database, gọi API bên ngoài, lắng nghe message queue, xử lý request từ giao diện người dùng, v.v. Phụ thuộc vào lớp Application.

Khi triển khai một Bounded Context, chúng ta sẽ đóng gói các lớp này lại. Tùy thuộc vào vai trò của đơn vị triển khai, lớp Adapters sẽ được cấu hình khác nhau:

- **Services (API/Web):** Lớp Adapters sẽ bao gồm các **Controller** (để xử lý request HTTP hoặc gRPC), các **Presenter** (để định dạng dữ liệu trả về) và các cài đặt **Repository** (để tương tác database). Controller sẽ gọi các Use Case ở lớp Application để xử lý yêu cầu.
- **Workers (Background Processing):** Lớp Adapters sẽ bao gồm các **Message Consumer** (để lắng nghe và xử lý message từ message queue) và các cài đặt **Repository**. Message Consumer sẽ gọi các Use Case ở lớp Application để thực hiện tác vụ nền.
- **Jobs (Scheduled Tasks):** Lớp Adapters sẽ bao gồm các **Entry Point** được kích hoạt bởi bộ lập lịch (scheduler) và các cài đặt **Repository**. Entry Point này sẽ gọi các Use Case ở lớp Application để thực hiện tác vụ theo lịch trình.

Điểm mấu chốt là: **Logic nghiệp vụ cốt lõi trong lớp Domain và Application không thay đổi** bất kể BC đó được triển khai dưới dạng Service, Worker hay Job. Chỉ có lớp Adapters (cách BC tương tác với thế giới bên ngoài) là thay đổi. Điều này mang lại sự linh hoạt và nhất quán.

## **6\. Lợi ích**

- **Tăng cường khả năng bảo trì:** Code được tổ chức tốt, dễ hiểu và thay đổi.
- **Cải thiện khả năng kiểm thử:** Logic nghiệp vụ có thể được kiểm thử độc lập và hiệu quả.
- **Linh hoạt triển khai:** Dễ dàng đóng gói và triển khai BC dưới nhiều hình thức khác nhau.
- **Giảm thiểu rủi ro:** Thay đổi ở tầng cơ sở hạ tầng ít ảnh hưởng đến logic nghiệp vụ.
- **Nâng cao Developer Experience:** Cấu trúc nhất quán giúp nhà phát triển dễ dàng làm việc với các BC khác nhau.

## **7\. Hậu quả (Consequences)**

- **Đường cong học tập ban đầu:** Đội ngũ cần thời gian để làm quen và áp dụng đúng các nguyên tắc của Clean Architecture.
- **Có thể cảm thấy "over-engineering" ban đầu:** Đối với các BC hoặc Use Case rất đơn giản, việc áp dụng đầy đủ cấu trúc Clean Architecture có thể cảm thấy tốn công sức hơn. Tuy nhiên, lợi ích sẽ thể hiện rõ khi BC phát triển và trở nên phức tạp hơn.

## **8\. Kết luận**

Việc áp dụng Clean Architecture làm kiến trúc nội bộ cho mỗi Bounded Context là một quyết định chiến lược, phù hợp với mục tiêu sử dụng DDD và kiến trúc Microservices/EDA của hệ thống Ecoma. Cấu trúc này đảm bảo sự tách biệt rõ ràng giữa logic nghiệp vụ và chi tiết kỹ thuật, mang lại khả năng kiểm thử, bảo trì và linh hoạt triển khai cao, góp phần quan trọng vào sự thành công lâu dài của dự án.
