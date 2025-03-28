# **Quyết định sử dụng CQRS Pattern trong Ecoma**

## **1\. Bối cảnh**

Hệ thống Ecoma là một nền tảng SaaS phức tạp với nhiều Bounded Context (BC) và luồng nghiệp vụ đa dạng. Chúng ta đã áp dụng [Domain-Driven Design](/explain-decisions/ddd) để mô hình hóa miền nghiệp vụ và [Clean Architecture](/explain-decisions/ca) để cấu trúc bên trong mỗi BC, triển khai dưới dạng Microservices trên nền tảng kiến trúc [Microservices Architecture](/explain-decisions/ma) và và sử dụng mô hình giao tiếp [Event-Driven Architecture](/explain-decisions/eda).

Trong các hệ thống phức tạp, thường có sự khác biệt đáng kể giữa các thao tác ghi dữ liệu (Commands \- tạo, cập nhật, xóa) và các thao tác đọc dữ liệu (Queries \- truy vấn thông tin).

- **Thao tác ghi (Commands):** Thường yêu cầu logic nghiệp vụ phức tạp, kiểm tra ràng buộc (invariants), xử lý giao dịch (transactions) để đảm bảo tính nhất quán. Số lượng ghi có thể ít hơn đọc, nhưng chúng có tính chất phức tạp và yêu cầu độ tin cậy cao.
- **Thao tác đọc (Queries):** Thường đơn giản hơn về mặt logic nghiệp vụ nhưng yêu cầu hiệu suất cao, độ trễ thấp và khả năng mở rộng để phục vụ nhiều người dùng hoặc hệ thống khác cùng lúc. Các truy vấn có thể phức tạp về mặt kỹ thuật (join nhiều bảng, tính toán tổng hợp) nhưng không thay đổi trạng thái của hệ thống.

Trong kiến trúc truyền thống (CRUD đơn giản), cùng một mô hình dữ liệu và lớp truy cập dữ liệu (Repository) thường được sử dụng cho cả thao tác ghi và đọc. Điều này dẫn đến những thách thức:

- **Sự phức tạp của mô hình:** Mô hình dữ liệu phải đáp ứng cả yêu cầu ghi (tính nhất quán, ràng buộc) và yêu cầu đọc (hiệu suất truy vấn, cấu trúc phù hợp cho hiển thị/báo cáo), dẫn đến mô hình trở nên cồng kềnh và khó tối ưu cho cả hai mục đích.
- **Khó khăn trong tối ưu hiệu suất:** Việc tối ưu cơ sở dữ liệu hoặc code cho thao tác ghi có thể làm giảm hiệu suất của thao tác đọc và ngược lại.
- **Khó mở rộng độc lập:** Không thể mở rộng riêng biệt phần xử lý ghi (khi số lượng giao dịch tăng) và phần xử lý đọc (khi số lượng truy vấn tăng).
- **Logic phức tạp:** Logic xử lý cả ghi và đọc trong cùng một lớp có thể trở nên khó hiểu và khó bảo trì.

Chúng ta cần một mẫu thiết kế giúp giải quyết sự bất đối xứng này, cho phép tối ưu hóa độc lập các luồng xử lý ghi và đọc trong mỗi Bounded Context.

## **2\. Quyết định**

Chúng tôi quyết định áp dụng **CQRS (Command Query Responsibility Segregation)** làm một mẫu thiết kế **bắt buộc** trong tất cả các Bounded Context của hệ thống Ecoma.

Tuy nhiên, **việc phân tách database vật lý cho luồng ghi (Command) và luồng đọc (Query) là KHÔNG bắt buộc** ở giai đoạn đầu và sẽ được xem xét tùy theo nhu cầu tối ưu hiệu suất cụ thể của từng Bounded Context trong tương lai.

## **3\. Lý do và Cơ sở (Justification)**

CQRS là một lựa chọn phù hợp và chiến lược cho hệ thống Ecoma vì những lý do sau:

- **Giải quyết sự bất đối xứng Read/Write:** CQRS tách biệt rõ ràng trách nhiệm xử lý Command và Query, cho phép thiết kế và tối ưu hóa độc lập từng luồng.
- **Tăng cường khả năng mở rộng (Scalability):** Cho phép mở rộng riêng biệt các thành phần xử lý Command và Query dựa trên tải lượng thực tế. Nếu luồng đọc có tải cao, chúng ta có thể mở rộng các instance xử lý Query mà không ảnh hưởng đến luồng Command.
- **Cải thiện hiệu suất (Performance):** Có thể tối ưu hóa mô hình dữ liệu và cơ chế truy cập cho từng luồng. Ví dụ, sử dụng các mô hình dữ liệu khác nhau (ví dụ: mô hình quan hệ cho ghi, mô hình NoSQL hoặc view materialized cho đọc) hoặc tối ưu hóa truy vấn chỉ cho mục đích đọc.
- **Nâng cao khả năng bảo trì và linh hoạt (Maintainability and Flexibility):** Code xử lý Command tập trung vào logic nghiệp vụ và tính nhất quán, trong khi code xử lý Query tập trung vào việc truy vấn và định dạng dữ liệu. Sự tách biệt này giúp code dễ hiểu, dễ thay đổi và bảo trì hơn.
- **Hỗ trợ mạnh mẽ cho EDA và DDD:** CQRS thường đi đôi với Event Sourcing (mặc dù không bắt buộc) và rất phù hợp với kiến trúc hướng sự kiện của Ecoma. Các Command có thể dẫn đến việc phát sinh Domain Event, và các Query có thể đọc từ các Projection được xây dựng từ các Event này. CQRS cũng giúp làm nổi bật các hành động (Commands) và trạng thái (Queries) trong Domain Model của DDD.
- **Phù hợp với Clean Architecture:** CQRS có thể được tích hợp một cách tự nhiên vào lớp Application của Clean Architecture, nơi các Use Case được chia thành Command Handlers và Query Handlers.

## **4\. CQRS là gì và Áp dụng như thế nào trong Ecoma?**

CQRS là mẫu thiết kế phân tách mô hình được sử dụng để cập nhật dữ liệu (Command) và mô hình được sử dụng để đọc dữ liệu (Query).

- **Command Side:** Xử lý các yêu cầu thay đổi trạng thái của hệ thống (ví dụ: CreateOrderCommand, UpdateProductPriceCommand). Các Command được gửi đến Command Handler, nơi thực thi logic nghiệp vụ, kiểm tra ràng buộc trên Aggregate Root (trong ngữ cảnh DDD), và lưu trạng thái mới thông qua Repository.
- **Query Side:** Xử lý các yêu cầu truy vấn dữ liệu (ví dụ: GetOrderByIdQuery, ListProductsQuery). Các Query được gửi đến Query Handler, nơi truy vấn dữ liệu từ mô hình đọc (Read Model) và trả về kết quả.

**Quan trọng:** CQRS chỉ yêu cầu phân tách trách nhiệm (Responsibility Segregation) giữa Command và Query. **Nó không bắt buộc phải sử dụng hai cơ sở dữ liệu vật lý khác nhau.**

Trong Ecoma, chúng ta sẽ áp dụng CQRS theo cách sau:

- **Phân tách logic:** Trong mỗi Bounded Context, các Use Case/Application Service sẽ được phân chia rõ ràng thành các Command Handler (xử lý các Command) và Query Handler (xử lý các Query).
- **Mô hình dữ liệu:** Ban đầu, chúng ta có thể sử dụng **cùng một cơ sở dữ liệu vật lý** cho cả luồng ghi và đọc trong một BC. Tuy nhiên:
  - Command Handlers sẽ tương tác với Domain Model (Aggregate Roots, Entities, Value Objects) và sử dụng Repository để lưu/tải trạng thái.
  - Query Handlers sẽ truy vấn trực tiếp từ cơ sở dữ liệu hoặc sử dụng các mô hình đọc (Read Model) được tối ưu hóa cho việc truy vấn (ví dụ: các View, DTO được thiết kế riêng cho từng loại truy vấn).
- **Tối ưu hóa độc lập:** Code và cấu trúc dữ liệu cho luồng Command sẽ được tối ưu cho tính nhất quán và toàn vẹn dữ liệu. Code và truy vấn cho luồng Query sẽ được tối ưu cho hiệu suất đọc.
- **Khả năng mở rộng database vật lý (Tùy chọn):** Nếu một BC nào đó có tải lượng đọc cao đến mức cơ sở dữ liệu ghi không đáp ứng được, chúng ta có thể xem xét việc tạo một bản sao (replica) của database ghi để phục vụ riêng cho luồng đọc, hoặc thậm chí tạo một mô hình đọc riêng biệt (ví dụ: sử dụng database NoSQL, search index) được cập nhật bất đồng bộ từ các Domain Event. Quyết định này sẽ được đưa ra dựa trên phân tích hiệu suất cụ thể của từng BC.

## **5\. Lợi ích**

- **Tối ưu hóa hiệu suất:** Cho phép tối ưu hóa riêng biệt cho các thao tác ghi và đọc.
- **Khả năng mở rộng độc lập:** Có thể mở rộng các thành phần xử lý Command và Query một cách riêng rẽ.
- **Codebase rõ ràng hơn:** Phân tách trách nhiệm giúp code dễ hiểu và bảo trì.
- **Linh hoạt trong mô hình dữ liệu:** Cho phép sử dụng các mô hình dữ liệu khác nhau cho ghi và đọc nếu cần thiết để tối ưu hiệu suất.
- **Hỗ trợ các kịch bản phức tạp:** Dễ dàng xử lý các kịch bản ghi phức tạp (ví dụ: sử dụng Event Sourcing) và các kịch bản đọc phức tạp (ví dụ: truy vấn báo cáo tổng hợp).

## **6\. Hậu quả (Consequences)**

- **Tăng độ phức tạp ban đầu:** Việc phân tách Command và Query yêu cầu cấu trúc code chi tiết hơn so với mô hình CRUD đơn giản.
- **Đường cong học tập:** Đội ngũ cần làm quen với các khái niệm và mẫu thiết kế của CQRS.
- **Quản lý sự nhất quán (eventual consistency):** Nếu quyết định phân tách database vật lý cho đọc và ghi, chúng ta sẽ phải đối mặt với thách thức quản lý sự nhất quán cuối cùng (eventual consistency) giữa hai mô hình dữ liệu.

## **7\. Kết luận**

Việc áp dụng CQRS là một quyết định chiến lược quan trọng để quản lý hiệu quả sự bất đối xứng giữa các thao tác ghi và đọc trong hệ thống Ecoma. Mẫu thiết kế này, khi kết hợp với DDD và Clean Architecture, sẽ giúp chúng ta xây dựng các Bounded Context có khả năng mở rộng, hiệu suất cao và dễ bảo trì. Mặc dù CQRS yêu cầu phân tách logic xử lý Command và Query, chúng ta sẽ không bắt buộc phân tách database vật lý ngay từ đầu, giữ lại sự linh hoạt để tối ưu hóa cơ sở hạ tầng dựa trên nhu cầu thực tế của từng BC.
