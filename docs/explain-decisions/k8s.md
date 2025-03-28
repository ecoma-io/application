# **Quyết định sử dụng Kubernetes làm nền tảng vận hành trong Ecoma**

## **1\. Bối cảnh**

Hệ thống Ecoma được thiết kế dựa trên kiến trúc Microservices và Event-Driven Architecture (EDA), trong đó mỗi Bounded Context (BC) hoặc một nhóm BC nhỏ được triển khai dưới dạng các dịch vụ độc lập. Các dịch vụ này được xây dựng bằng nhiều công nghệ khác nhau và cần được đóng gói một cách nhất quán để dễ dàng triển khai. Containerization (đặc biệt là sử dụng Docker) là lựa chọn tự nhiên để đóng gói các Microservices này, đảm bảo môi trường chạy nhất quán từ môi trường phát triển đến môi trường sản xuất.

Khi số lượng Microservices tăng lên (hiện tại đã xác định nhiều BC), việc triển khai, quản lý, mở rộng, giám sát và duy trì tính sẵn sàng của hàng chục hoặc thậm chí hàng trăm container trở nên phức tạp và tốn kém nếu thực hiện thủ công hoặc chỉ dựa vào các script đơn giản.

Các mục tiêu kiến trúc cốt lõi của Ecoma như khả năng mở rộng cao, khả năng chịu lỗi, tính sẵn sàng cao, và khả năng bảo trì đòi hỏi một giải pháp mạnh mẽ để tự động hóa việc quản lý vòng đời của các container.

## **2\. Vấn đề**

Việc triển khai và vận hành hệ thống Microservices dựa trên container mà không có một nền tảng điều phối (orchestration) hiệu quả dẫn đến các vấn đề sau:

- **Triển khai phức tạp:** Triển khai các phiên bản mới của dịch vụ, cập nhật, rollback, và quản lý cấu hình cho từng container một cách thủ công là rất khó khăn và dễ xảy ra lỗi.
- **Quản lý tài nguyên:** Phân bổ tài nguyên (CPU, RAM) cho từng container, đảm bảo chúng không cạnh tranh tài nguyên quá mức hoặc lãng phí tài nguyên là một thách thức.
- **Mở rộng (Scaling) thủ công:** Khi tải tăng, việc mở rộng số lượng instance của từng dịch vụ đòi hỏi can thiệp thủ công, không đáp ứng được nhu cầu mở rộng linh hoạt và tự động.
- **Thiếu khả năng tự phục hồi (Lack of Self-Healing):** Nếu một container hoặc một node máy chủ gặp sự cố, hệ thống không tự động phát hiện và khởi động lại hoặc thay thế các container bị ảnh hưởng, dẫn đến giảm tính sẵn sàng.
- **Quản lý kết nối và khám phá dịch vụ (Service Discovery):** Các Microservices cần tìm và giao tiếp với nhau. Việc quản lý địa chỉ IP và cổng của các dịch vụ thay đổi liên tục trong môi trường động là phức tạp.
- **Cân bằng tải (Load Balancing) thủ công:** Phân phối lưu lượng truy cập đến các instance đang chạy của một dịch vụ đòi hỏi cấu hình cân bằng tải phức tạp.
- **Quản lý cấu hình và bí mật (Configuration and Secret Management):** Quản lý tập trung cấu hình ứng dụng và các thông tin nhạy cảm (mật khẩu, khóa API) cho nhiều dịch vụ là một thách thức bảo mật và vận hành.
- **Giám sát và ghi log tập trung:** Thu thập và phân tích log, metrics từ hàng loạt container đòi hỏi hệ thống tập trung.

Chúng ta cần một nền tảng tự động hóa việc triển khai, mở rộng và quản lý các ứng dụng được đóng gói dưới dạng container, giải quyết các vấn đề trên để đáp ứng các mục tiêu vận hành của Ecoma.

## **3\. Quyết định**

Chúng tôi quyết định sử dụng **Kubernetes (k8s)** làm nền tảng điều phối (orchestration) container chính để triển khai, quản lý và vận hành tất cả các Microservices (services, workers, jobs) của hệ thống Ecoma.

## **4\. Lý do và Cơ sở (Justification)**

Kubernetes là một lựa chọn phù hợp và chiến lược cho hệ thống Ecoma vì những lý do sau:

- **Tiêu chuẩn công nghiệp (Industry Standard):** Kubernetes là nền tảng điều phối container phổ biến và được chấp nhận rộng rãi nhất hiện nay, với một cộng đồng lớn, hệ sinh thái phong phú và sự hỗ trợ mạnh mẽ từ các nhà cung cấp Cloud.
- **Đáp ứng các mục tiêu kiến trúc cốt lõi:** Kubernetes được thiết kế để giải quyết trực tiếp các vấn đề về khả năng mở rộng, tính sẵn sàng cao, khả năng chịu lỗi và khả năng bảo trì trong môi trường phân tán.
- **Tính năng phong phú:** Cung cấp đầy đủ các tính năng cần thiết để quản lý vòng đời ứng dụng containerized, từ triển khai, mở rộng, tự phục hồi, khám phá dịch vụ, cân bằng tải, quản lý cấu hình, đến giám sát.
- **Hỗ trợ đa Cloud (Multi-Cloud Support):** Kubernetes có thể chạy trên hầu hết các nhà cung cấp Cloud lớn (AWS EKS, Google GKE, Azure AKS) cũng như trên hạ tầng On-Premise, mang lại sự linh hoạt và tránh bị ràng buộc vào một nhà cung cấp duy nhất.
- **Hệ sinh thái mở:** Có rất nhiều công cụ và dự án tích hợp với Kubernetes để giải quyết các khía cạnh khác của DevOps như CI/CD, Service Mesh, Observability, Security.

## **5\. Kubernetes Hỗ trợ Việc Vận Hành Hệ Thống như thế nào?**

Kubernetes cung cấp một bộ các API và thành phần để tự động hóa việc triển khai và quản lý các ứng dụng containerized:

- **Triển khai (Deployment):** Kubernetes cho phép định nghĩa trạng thái mong muốn của ứng dụng (số lượng bản sao, phiên bản image) và tự động triển khai các container, thực hiện các chiến lược rollout (ví dụ: rolling update) và rollback khi cần thiết.
- **Mở rộng (Scaling):** Có thể dễ dàng mở rộng hoặc thu nhỏ số lượng bản sao (replicas) của một dịch vụ bằng lệnh hoặc cấu hình. Kubernetes cũng hỗ trợ Horizontal Pod Autoscaler (HPA) để tự động mở rộng dựa trên các metrics (ví dụ: CPU utilization, custom metrics).
- **Tự phục hồi (Self-Healing):** Kubernetes liên tục kiểm tra trạng thái của các container và node. Nếu một container gặp lỗi, nó sẽ tự động khởi động lại. Nếu một node chết, nó sẽ di chuyển và khởi động lại các container trên các node khỏe mạnh khác.
- **Khám phá dịch vụ và Cân bằng tải (Service Discovery and Load Balancing):** Kubernetes Service cung cấp một địa chỉ IP và DNS ổn định cho một tập hợp các Pod (nhóm container). Nó tự động phân phối lưu lượng truy cập đến các Pod đang chạy, hoạt động như một bộ cân bằng tải nội bộ.
- **Quản lý tài nguyên (Resource Management):** Có thể định nghĩa yêu cầu (requests) và giới hạn (limits) về CPU và RAM cho từng container, giúp Kubernetes lên lịch các Pod hiệu quả và ngăn chặn tình trạng "noisy neighbor".
- **Quản lý cấu hình và bí mật (Configuration and Secret Management):** ConfigMap và Secret cung cấp cơ chế an toàn và tập trung để quản lý cấu hình ứng dụng và thông tin nhạy cảm, tách biệt chúng khỏi image container.
- **Batch Processing (Jobs và CronJobs):** Kubernetes hỗ trợ chạy các tác vụ theo lô (Jobs) và các tác vụ theo lịch trình (CronJobs), phù hợp với các Worker và Job trong kiến trúc của Ecoma.
- **Lưu trữ (Storage):** Persistent Volumes cung cấp cơ chế để quản lý và gắn kết bộ nhớ bền vững cho các container, cần thiết cho các dịch vụ lưu trữ trạng thái.

## **6\. Lợi ích**

- **Tăng cường tính sẵn sàng và chịu lỗi:** Tự động phát hiện và phục hồi khi có lỗi, đảm bảo ứng dụng luôn có sẵn.
- **Nâng cao khả năng mở rộng:** Dễ dàng mở rộng ứng dụng theo chiều ngang để đáp ứng tải lượng tăng.
- **Đơn giản hóa việc triển khai và quản lý:** Tự động hóa nhiều tác vụ vận hành thủ công.
- **Tối ưu hóa sử dụng tài nguyên:** Phân bổ và quản lý tài nguyên hiệu quả hơn.
- **Cải thiện Developer Experience (DX):** Cung cấp môi trường triển khai nhất quán, giúp nhà phát triển tập trung vào code nghiệp vụ.
- **Giảm thiểu rủi ro vận hành:** Các quy trình triển khai và quản lý được chuẩn hóa và tự động hóa.

## **7\. Hậu quả (Consequences)**

- **Đường cong học tập đáng kể:** Kubernetes là một hệ thống phức tạp với nhiều khái niệm và thành phần. Đội ngũ vận hành và phát triển cần đầu tư thời gian để học và làm chủ.
- **Chi phí vận hành:** Việc quản lý một cluster Kubernetes đòi hỏi kiến thức chuyên sâu và có thể tốn kém (đặc biệt nếu tự quản lý On-Premise). Sử dụng dịch vụ Managed Kubernetes từ Cloud Provider có thể giảm bớt gánh nặng này nhưng vẫn có chi phí.
- **Độ phức tạp ban đầu:** Việc cấu hình và thiết lập môi trường Kubernetes ban đầu có thể tốn thời gian và công sức.
- \*\* overhead:\*\* Đối với các ứng dụng rất nhỏ và đơn giản, việc triển khai lên Kubernetes có thể cảm thấy phức tạp hơn mức cần thiết.

## **8\. Kết luận**

Việc lựa chọn Kubernetes làm nền tảng vận hành là một quyết định chiến lược quan trọng để hiện thực hóa kiến trúc Microservices và EDA của Ecoma. Kubernetes cung cấp các khả năng tự động hóa và điều phối container mạnh mẽ, thiết yếu để đạt được các mục tiêu về khả năng mở rộng, tính sẵn sàng cao và khả năng chịu lỗi. Mặc dù có những thách thức về đường cong học tập và chi phí vận hành, lợi ích mà Kubernetes mang lại trong việc quản lý một hệ thống phân tán phức tạp như Ecoma là vượt trội và cần thiết cho sự thành công lâu dài của dự án.
