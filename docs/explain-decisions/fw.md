# **Quyết định sử dụng NestJS và Angular làm Framework Phát triển Cốt lõi**

## **1\. Bối cảnh**

Hệ thống Ecoma được xây dựng dựa trên kiến trúc Microservices và Event-Driven Architecture (EDA), tuân thủ các nguyên tắc của Domain-Driven Design (DDD), CQRS và Clean Architecture, và sử dụng TypeScript làm ngôn ngữ lập trình chính. Hệ thống bao gồm nhiều Microservices backend độc lập và các ứng dụng client phức tạp (Web Admin Panel, User Portal).

Để xây dựng các thành phần này một cách hiệu quả, có cấu trúc, dễ bảo trì và mở rộng, chúng ta cần lựa chọn các framework phát triển phù hợp cho cả backend và frontend. Các framework này cần hỗ trợ tốt cho TypeScript và các nguyên tắc kiến trúc đã chọn.

## **2\. Vấn đề**

Việc không sử dụng framework hoặc sử dụng các framework không phù hợp có thể dẫn đến các vấn đề sau:

- **Thiếu cấu trúc và nhất quán:** Codebase có thể trở nên thiếu tổ chức, khó hiểu và khó bảo trì nếu không có một framework cung cấp cấu trúc và nguyên tắc rõ ràng.
- **Tái phát minh bánh xe:** Các nhóm phát triển phải tự xây dựng lại các chức năng chung như routing, xử lý request/response, quản lý trạng thái, dependency injection, v.v., làm chậm quá trình phát triển.
- **Khó khăn trong việc áp dụng mẫu thiết kế:** Một số framework có thể không hỗ trợ hoặc không khuyến khích việc áp dụng các mẫu thiết kế nâng cao như CQRS và Clean Architecture.
- **Giảm Developer Experience (DX):** Việc làm việc với codebase không có cấu trúc hoặc sử dụng các thư viện rời rạc có thể làm giảm năng suất và trải nghiệm của nhà phát triển.
- **Thách thức trong bảo trì và mở rộng:** Codebase thiếu cấu trúc và không tuân theo các nguyên tắc của framework khó bảo trì và mở rộng khi hệ thống phát triển.

Chúng ta cần lựa chọn các framework mạnh mẽ, có cấu trúc, hỗ trợ tốt TypeScript và các nguyên tắc kiến trúc của Ecoma để tăng tốc độ phát triển, đảm bảo chất lượng và khả năng bảo trì cho cả backend và frontend.

## **3\. Quyết định**

Chúng tôi quyết định sử dụng:

1. **NestJS** làm framework phát triển chính cho tất cả các **Backend Microservices**.
2. **Angular** làm framework phát triển chính cho các **Frontend Client Applications** (Web Admin Panel, User Portal).

## **4\. Lý do và Cơ sở (Justification)**

Việc lựa chọn NestJS và Angular dựa trên sự phù hợp của chúng với các yêu cầu của hệ thống Ecoma và sự kết hợp hiệu quả với TypeScript:

- **NestJS (cho Backend):**
  - **Hỗ trợ kiến trúc mạnh mẽ:** NestJS được lấy cảm hứng từ Angular và được xây dựng dựa trên các nguyên tắc thiết kế đã được chứng minh như Dependency Injection (DI), Providers, Controllers, Modules. Cấu trúc này rất phù hợp và khuyến khích việc hiện thực hóa các mẫu kiến trúc như Clean Architecture, CQRS và DDD.
  - **Tích hợp với TypeScript:** NestJS được viết hoàn toàn bằng TypeScript và cung cấp hỗ trợ TypeScript hạng nhất, tận dụng tối đa lợi ích của static typing.
  - **Hỗ trợ Microservices và Giao tiếp:** NestJS có các module tích hợp sẵn và dễ dàng cấu hình để làm việc với nhiều kiểu giao tiếp Microservices khác nhau (HTTP, gRPC, NATS, RabbitMQ), rất phù hợp với kiến trúc EDA và việc sử dụng NATS/RabbitMQ của Ecoma.
  - **Framework có cấu trúc và đầy đủ tính năng:** Cung cấp một khuôn mẫu phát triển rõ ràng, bao gồm các tính năng như Validation Pipes, Guards, Interceptors, giúp giảm thời gian cấu hình và tăng tính nhất quán.
  - **Hiệu suất:** Được xây dựng trên Node.js/Express/Fastify, NestJS có hiệu suất tốt cho các ứng dụng backend.
  - **Cộng đồng và Tài liệu:** Có cộng đồng đang phát triển mạnh và tài liệu rất chi tiết, dễ hiểu.
- **Angular (cho Frontend):**
  - **Framework toàn diện và có cấu trúc:** Angular cung cấp một giải pháp "pin-sạc-chạy" (batteries-included) với cấu trúc dựa trên Component, Module và Service. Điều này giúp xây dựng các ứng dụng frontend phức tạp và quy mô lớn một cách có tổ chức, dễ quản lý và bảo trì.
  - **Hỗ trợ TypeScript mạnh mẽ:** Angular được phát triển bởi Google và sử dụng TypeScript làm ngôn ngữ chính, tận dụng tối đa các tính năng của TypeScript.
  - **Phù hợp cho ứng dụng lớn (Enterprise-Grade):** Kiến trúc module, hệ thống DI mạnh mẽ và các tính năng như Lazy Loading, AOT Compilation giúp Angular trở thành lựa chọn hàng đầu cho các ứng dụng frontend phức tạp như Web Admin Panel của Ecoma.
  - **Công cụ mạnh mẽ (Angular CLI):** Cung cấp bộ công cụ dòng lệnh toàn diện để tạo, phát triển, build, test và deploy ứng dụng, tăng tốc độ phát triển đáng kể.
  - **Hệ sinh thái và Cộng đồng lớn:** Angular có một hệ sinh thái rộng lớn và cộng đồng rất mạnh mẽ.
- **Sự kết hợp (NestJS \+ Angular):**
  - **Nguyên tắc thiết kế tương đồng:** Cả NestJS và Angular đều chia sẻ nhiều nguyên tắc thiết kế cốt lõi (như DI, kiến trúc module), giúp các nhà phát triển dễ dàng chuyển đổi giữa làm việc backend và frontend.
  - **Tích hợp tốt với TypeScript:** Cả hai framework đều được xây dựng với TypeScript, mang lại trải nghiệm phát triển nhất quán.
  - **Hỗ trợ bởi Nx Monorepo:** Nx Monorepo có hỗ trợ tuyệt vời cho cả NestJS và Angular, cho phép quản lý codebase backend và frontend trong cùng một repository, tận dụng khả năng chia sẻ code và công cụ.

## **5\. Áp dụng trong Ecoma**

- Tất cả các Microservices backend mới sẽ được phát triển bằng NestJS.
- Web Admin Panel và User Portal sẽ được phát triển bằng Angular.
- Các nguyên tắc và mẫu thiết kế được khuyến khích bởi NestJS và Angular sẽ được áp dụng để đảm bảo tính nhất quán và chất lượng code.

## **6\. Lợi ích**

- Tăng tốc độ phát triển nhờ các tính năng và công cụ mạnh mẽ của framework.
- Đảm bảo cấu trúc code nhất quán và dễ bảo trì cho cả backend và frontend.
- Hỗ trợ hiệu quả việc áp dụng các mẫu kiến trúc phức tạp như Clean Architecture và CQRS.
- Nâng cao Developer Experience (DX) với môi trường phát triển có cấu trúc và công cụ hỗ trợ tốt.
- Dễ dàng tuyển dụng các nhà phát triển có kinh nghiệm với NestJS và Angular.

## **7\. Hậu quả (Consequences)**

- **Đường cong học tập:** Các thành viên chưa quen thuộc với NestJS hoặc Angular sẽ cần thời gian để học và làm chủ framework.
- **Phụ thuộc vào Framework:** Việc sử dụng các framework có cấu trúc (opinionated) tạo ra sự phụ thuộc vào framework, việc thay đổi framework trong tương lai sẽ tốn kém.
- **Yêu cầu cập nhật:** Cần theo dõi và cập nhật các phiên bản mới của NestJS và Angular để tận dụng các tính năng mới và đảm bảo bảo mật.

## **8\. Kết luận**

Việc lựa chọn NestJS và Angular làm framework phát triển cốt lõi cho backend và frontend, kết hợp với TypeScript, là một quyết định chiến lược quan trọng. Bộ đôi framework này cung cấp các cấu trúc và công cụ mạnh mẽ, hỗ trợ hiệu quả việc xây dựng các thành phần của hệ thống Ecoma theo các nguyên tắc kiến trúc đã định, đồng thời mang lại trải nghiệm phát triển tốt và tăng cường khả năng bảo trì. Mặc dù có những thách thức ban đầu về đường cong học tập và sự phụ thuộc vào framework, lợi ích lâu dài mà NestJS và Angular mang lại là rất quan trọng cho sự thành công của dự án Ecoma.
