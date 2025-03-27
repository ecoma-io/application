# **Tổng quan kiến trúc hệ thống Ecoma**

Tài liệu này mô tả kiến trúc tổng thể của hệ thống Ecoma, tập trung vào cấu trúc, các thành phần chính và các mô hình thiết kế cốt lõi (DDD, Microservices, EDA, CQRS, **Clean Architecture**), cũng như các khía cạnh quan trọng như Versioning và Observability, làm rõ cách thức vận hành, bảo mật và quản lý sự tiến hóa để đáp ứng các mục tiêu thiết kế (tính sẵn sàng cao, khả năng mở rộng, chịu lỗi, v.v.).

## **1\. Mô hình Kiến trúc Cốt lõi: Phân tán và Hướng sự kiện**

Hệ thống Ecoma được xây dựng trên nền tảng **Kiến trúc Microservices**, được định hình bởi các nguyên tắc của **Domain-Driven Design (DDD)** và áp dụng mạnh mẽ **Event-Driven Architecture (EDA)** làm cơ chế giao tiếp chính **giữa các service backend**. Bên trong các đơn vị xử lý (Microservices), mô hình **Command Query Responsibility Segregation (CQRS)** **được áp dụng bắt buộc** để tối ưu hóa và phân tách luồng đọc/ghi, và cấu trúc code nội bộ tuân thủ **Clean Architecture**. Sự kết hợp này mang lại sự linh hoạt, khả năng mở rộng độc lập và khả năng chịu lỗi cao.

### **1.1. Phân rã Hệ thống theo Nghiệp vụ (DDD & Bounded Contexts)**

Việc phân rã hệ thống Ecoma không dựa trên cấu trúc kỹ thuật, mà tuân thủ các nguyên tắc của **Domain-Driven Design (DDD)**. Hệ thống được chia thành các **Bounded Contexts (BCs)** độc lập, mỗi BC đại diện cho một phần rõ ràng của miền nghiệp vụ Ecoma (ví dụ: Quản lý Danh tính \- IAM, Thanh toán & Thuê bao \- Billing & Subscription, Quản lý Sản phẩm...). Mỗi **Microservice** trong kiến trúc Ecoma lý tưởng là hiện thực hóa một Bounded Context hoặc một phần có ý nghĩa nghiệp vụ của BC đó.

- **Mục đích:** Đảm bảo mỗi service có trách nhiệm đơn nhất tập trung vào một miền nghiệp vụ cụ thể, giảm sự phức tạp và tăng tính tự chủ cho các đội phát triển.

### **1.2. Giao tiếp Chính: Event-Driven Architecture (EDA) và Request/Reply nội bộ**

Giao tiếp **giữa các microservice backend** trong Ecoma chủ yếu dựa trên mô hình **Event-Driven Architecture (EDA)** cho các sự kiện dạng Fire-and-Forget và sử dụng mô hình Request/Reply cho các tương tác đồng bộ nội bộ. **Giao tiếp từ Client đến backend luôn là đồng bộ qua HTTP(S)/API Gateway.**

- **Công cụ:** **NATS** được sử dụng làm **Message Broker** cho giao tiếp **Request/Reply** nội bộ giữa các service backend và từ API Gateway đến service backend. **RabbitMQ** được sử dụng làm **Message Broker** cho các sự kiện dạng **Fire-and-Forget (Events)** và quản lý **hàng đợi tác vụ nền (Background Job Queues)** yêu cầu độ tin cậy cao.
- **Nguyên lý:** Ưu tiên giao tiếp bất đồng bộ (**Async by Default**) cho các sự kiện để giảm coupling giữa các service (**Loose Coupling**). Giao tiếp đồng bộ nội bộ chỉ sử dụng khi cần phản hồi tức thời.

### **1.3. Xử lý Đọc/Ghi Nội bộ & Cấu trúc Code: Bắt buộc áp dụng CQRS và Clean Architecture**

Trong hệ thống Ecoma, mô hình **Command Query Responsibility Segregation (CQRS)** **được áp dụng bắt buộc** cho **mọi luồng nghiệp vụ và mọi Bounded Context**. Cùng với đó, cấu trúc code **bên trong mỗi Microservice** tuân thủ mô hình **Clean Architecture** để phân tách rõ ràng các lớp logic và dependency. Quyết định này là một chiến lược kiến trúc cốt lõi nhằm phân tách rành mạch các thao tác thay đổi trạng thái khỏi các thao tác truy vấn dữ liệu, đồng thời tổ chức code nội bộ một cách có hệ thống.

Việc áp dụng CQRS bắt buộc và Clean Architecture trực tiếp hỗ trợ các nguyên lý thiết kế quan trọng:

- **Auto Scaling & Isolation:** Bằng cách phân tách logic ghi (Commands) và logic đọc (Queries), chúng ta tạo ra hai luồng xử lý có thể được tối ưu hóa và mở rộng quy mô độc lập ngay từ đầu. Clean Architecture giúp cô lập logic này khỏi hạ tầng.
- **Testable Architecture:** Cấu trúc phân lớp của Clean Architecture và sự phân tách trong CQRS giúp việc viết Unit Test và Integration Test trở nên dễ dàng hơn rất nhiều, đặc biệt cho Domain và Application layers.
- **Maintainability & Developer Experience (DX):** Clean Architecture cung cấp một khuôn mẫu nhất quán và dễ hiểu cho cấu trúc code bên trong mỗi service, giúp đội ngũ dễ dàng bảo trì và phát triển tính năng mới.
- **Strategic Stack Unification:** NestJS được chọn vì khả năng hỗ trợ tốt cho việc hiện thực hóa cả CQRS và các lớp của Clean Architecture thông qua Dependency Injection và cấu trúc module của nó.
- **Mục đích:** Phân tách rõ ràng các yêu cầu thay đổi trạng thái (**Commands**) khỏi các yêu cầu truy vấn dữ liệu (**Queries**) trên toàn hệ thống, và tổ chức code nội bộ service theo các lớp được định nghĩa rõ ràng (Clean Architecture).
- **Hiện thực (Bên trong mỗi Microservice):**
  - **Clean Architecture:** Code được tổ chức thành các lớp: **Domain** (logic nghiệp vụ cốt lõi, Entities, Value Objects, Aggregates, Domain Events), **Application** (Use Cases/Interactors, Command/Query Handlers), **Adapters/Presentation** (APIs, Consumers, Repositories interfaces), **Infrastructure** (Implementations cụ thể của Repositories, kết nối DB, broker).
  - **Commands:** Thể hiện ý định thay đổi trạng thái (ví dụ: CreateUserCommand). Chúng được xử lý bởi **Command Handlers** (trong Application layer), thao tác lên các **Aggregates** (trong Domain layer) thông qua **Repositories interfaces** (trong Adapters) được hiện thực cụ thể (trong Infrastructure layer). Sau khi hoàn thành, Command Handlers **phát ra Domain Events** (qua RabbitMQ).
  - **Queries:** Thể hiện yêu cầu đọc dữ liệu (ví dụ: GetUserByIdQuery). Chúng được xử lý bởi **Query Handlers** (trong Application layer), truy vấn dữ liệu từ **Read Model** (thường là các mô hình được tối ưu hóa cho đọc) thông qua các cơ chế truy vấn (trong Infrastructure layer).
  - **Write Model & Read Model:** Mỗi service cần định nghĩa rõ Write Model (thường gần với Domain model, tối ưu cho ghi) và Read Model (thường phẳng hơn, tối ưu cho đọc). Read Model được cập nhật bất đồng bộ thông qua việc tiêu thụ các **Domain Events** được phát ra bởi luồng Command, sử dụng các **Event Consumers** (trong Adapters/Infrastructure) và logic cập nhật (trong Application layer).

## **2\. Các Thành phần Kiến trúc Chính**

Dựa trên mô hình cốt lõi (DDD, Microservices, EDA, CQRS, **Clean Architecture**), kiến trúc Ecoma bao gồm các thành phần sau:

- **Client Applications:** (Web Admin Panel, User Portal, Mobile Apps) Tương tác với hệ thống **đồng bộ** qua API Gateway sử dụng HTTP(S).
- **Cloudflare:** Cung cấp bảo mật lớp biên (DDoS, WAF), CDN, và quản lý DNS.
- **Cloudflare Tunnel:** Kết nối an toàn giữa Cloudflare và cluster Kubernetes, loại bỏ việc mở port công khai.
- **Kubernetes Ingress:** Quản lý truy cập vào cluster, nhận traffic từ Cloudflare Tunnel và thực hiện SSL Termination.
- **API Gateway:** Điểm vào duy nhất cho các request **đồng bộ** từ client (sau Ingress). Xử lý xác thực, ủy quyền (cấp độ API), rate limiting và định tuyến request đến các service backend (thường qua NATS Request/Reply). Tuân thủ nguyên tắc **Contract-first** cho API (OpenAPI).
- **Microservices (Independent Processing Units):** Các đơn vị xử lý độc lập, hiện thực logic nghiệp vụ của một hoặc một phần Bounded Context. Giao tiếp với API Gateway và các service khác chủ yếu qua **NATS (Req/Reply)** và **RabbitMQ (Fire-and-Forget Events, đẩy/nhận jobs)**. Bên trong mỗi service **áp dụng bắt buộc** mô hình **CQRS** và tuân thủ **Clean Architecture** để tổ chức code thành các lớp (Domain, Application, Adapters, Infrastructure).
- **Message Broker (NATS):** Nền tảng truyền tin cốt lõi cho giao tiếp **đồng bộ nội bộ liên service backend** (Request/Reply). Đảm bảo tính sẵn sàng và hiệu năng thấp.
- **Message Broker & Queue Manager (RabbitMQ):** Được sử dụng chuyên biệt để phát các sự kiện dạng **Fire-and-Forget** và quản lý các hàng đợi xử lý tác vụ nền (Background Job Queues) yêu cầu độ tin cậy cao. **Các service backend** phát sự kiện đến RabbitMQ và gửi/nhận job từ đó.
- **Databases:** Mỗi service (hoặc nhóm service trong cùng BC) sở hữu cơ sở dữ liệu riêng, đảm bảo **tách biệt dữ liệu** và giảm coupling. Hệ thống sử dụng cả **RDBMS (PostgreSQL với TypeORM)** và **NoSQL (MongoDB với Mongoose)** tùy thuộc vào tính chất dữ liệu và yêu cầu nghiệp vụ của từng BC. Hỗ trợ cả Write Model và Read Model như yêu cầu của mô hình CQRS. **Redis** được dùng làm cache hoặc CSDL tạm thời hiệu năng cao.
- **Infrastructure Layer:** Nền tảng hạ tầng triển khai, vận hành trên **Kubernetes**. Sử dụng **Infrastructure as Code (IaC)** (Helm) và **GitOps** (ArgoCD). Hỗ trợ **Auto Scaling** (HPA, VPA, CA). Bao gồm **Observability Stack** (Logs, Metrics, Traces) để giám sát hệ thống phân tán.
- **External Services:** Các hệ thống bên ngoài cần tích hợp (Payment Gateways, Email Providers...). Tích hợp có thể qua API Gateway hoặc trực tiếp với các Microservice phù hợp (tùy ngữ cảnh và bảo mật).

## **3\. Giao tiếp và Tích hợp**

Chiến lược giao tiếp trong Ecoma nhấn mạnh vào sự tách biệt và định nghĩa rõ ràng:

- **Giao tiếp từ Client:** Sử dụng HTTP(S) và đi qua API Gateway một cách **đồng bộ**.
- **Giao tiếp Bất đồng bộ (Async) giữa các service backend:** Sử dụng **RabbitMQ** cho các sự kiện dạng **Fire-and-Forget (Domain Events)** và quản lý các hàng đợi.
- **Giao tiếp Đồng bộ Nội bộ (Sync) giữa các service backend:** Sử dụng **NATS Request/Reply** cho các trường hợp cần phản hồi tức thời giữa các service, bao gồm luồng từ API Gateway đến service backend.
- **Giao tiếp HTTP:** Chỉ sử dụng cho luồng từ Client bên ngoài vào API Gateway (qua Cloudflare, Cloudflare Tunnel, Ingress). **Không sử dụng HTTP cho giao tiếp giữa các service nội bộ.**
- **Contract-first Communication:** Định nghĩa rõ ràng API (OpenAPI) và message schema (JSON Schema) để đảm bảo tính tương thích và dễ tích hợp. Đây là nền tảng cho chiến lược Versioning.
- **Service Discovery:** Sử dụng cơ chế sẵn có của **Kubernetes** (DNS nội bộ).

## **4\. Các Khía Cạnh Kiến Trúc Bổ Sung**

Các khía cạnh sau đây là nền tảng quan trọng để vận hành, bảo trì và phát triển hệ thống Ecoma một cách hiệu quả trong môi trường phân tán:

### **4.1. Chiến lược Versioning**

Trong kiến trúc microservices, việc quản lý sự tiến hóa của các giao diện (API, Event) và bản thân các service là rất quan trọng để cho phép triển khai độc lập và giảm thiểu "breaking changes".

- **Mục đích:** Cho phép các thành phần tiến hóa độc lập, duy trì khả năng tương thích ngược, và cung cấp quy trình rõ ràng cho việc loại bỏ phiên bản cũ.
- **Phiên bản API (Client \- API Gateway):** Sử dụng Semantic Versioning, biểu thị phiên bản trong đường dẫn URL (ví dụ: /api/v1/users). Cam kết hỗ trợ song song nhiều phiên bản Major (thường là N-1) trong một khoảng thời gian nhất định để Consumer có thời gian nâng cấp. API Gateway chịu trách nhiệm định tuyến request theo phiên bản.
- **Phiên bản Event Schema (Inter-Service Backend):** Sử dụng Semantic Versioning hoặc lược đồ tương tự cho Event schema (JSON Schema). Biểu thị phiên bản trong tên hàng đợi/routing key của RabbitMQ hoặc message header. **Chiến lược cốt lõi là tránh các breaking changes thực sự** trên Event schema bằng cách chỉ thêm các trường tùy chọn, đảm bảo Consumer cũ vẫn có thể xử lý Event mới.
- **Phiên bản Triển khai Service (Deployment):** Sử dụng tag Docker image (ví dụ: Git commit SHA) để theo dõi phiên bản triển khai. Kubernetes quản lý việc triển khai các phiên bản này. Phiên bản triển khai độc lập với phiên bản API mà Client nhìn thấy.

### **4.2. Chiến lược Observability**

Trong môi trường phân tán, việc theo dõi và hiểu rõ hệ thống là thách thức nhưng cực kỳ cần thiết để đảm bảo tính sẵn sàng cao, hiệu quả vận hành và debug nhanh chóng.

- **Mục đích:** Có khả năng hiểu trạng thái nội bộ hệ thống dựa trên dữ liệu phát ra từ bên ngoài, nhanh chóng xác định và khắc phục sự cố, giám sát hiệu suất kỹ thuật và nghiệp vụ.
- **Ba Trụ cột:** Tập trung vào thu thập và phân tích **Logs** (ghi lại các sự kiện), **Metrics** (đo lường hiệu suất và tài nguyên), và **Traces** (theo dõi luồng xử lý xuyên service).
- **Tiêu chuẩn hóa và Tương quan:** **Bắt buộc Structured Logging** với các trường chuẩn (như traceId, spanId, serviceName) để dễ dàng tìm kiếm và tương quan. **Bắt buộc lan truyền Trace Context** qua mọi kênh giao tiếp (HTTP Headers, Message Headers) để xây dựng Distributed Trace end-to-end.
- **Giám sát và Cảnh báo:** Thu thập cả Metrics kỹ thuật (tỷ lệ request/lỗi, độ trễ, tài nguyên) và Metrics nghiệp vụ (tỷ lệ chuyển đổi...). Định nghĩa SLIs/SLOs và cảnh báo dựa trên vi phạm SLO để chống "alert fatigue".
- **Công cụ Chính:** Sử dụng các bộ công cụ chuẩn như Prometheus/Grafana (Metrics), ELK/PLG (Logging), OpenTelemetry/Jaeger/Zipkin (Tracing), cùng các thư viện instrumentation trong code.

## **5\. Vận hành và Hạ tầng**

Hệ thống được thiết kế để có khả năng vận hành hiệu quả trên nền tảng đám mây:

- **Kubernetes:** Nền tảng điều phối container chính, cung cấp khả năng tự phục hồi, scaling và quản lý vòng đời service.
- **IaC & GitOps:** Toàn bộ hạ tầng và cấu hình triển khai được quản lý dưới dạng code trong Git, tự động hóa quy trình triển khai (CI/CD: GitHub Actions, ArgoCD).
- **Auto Scaling & Isolation:** Các service, được thiết kế với CQRS, dễ dàng scale ngang cho từng luồng đọc/ghi và cô lập tài nguyên bằng cơ chế của Kubernetes.
- **Observability Stack:** Các công cụ thu thập Logs, Metrics, Traces đã nêu ở mục 4.2.

## **6\. Chiến lược Bảo mật Đa tầng**

Bảo mật được tích hợp ở nhiều cấp độ:

- **Lớp Biên:** Cloudflare WAF và DDoS protection.
- **Kết nối An toàn:** Cloudflare Tunnel và HTTPS (SSL Termination tại Ingress).
- **Kiểm soát Truy cập:** Xác thực và ủy quyền tại API Gateway, Network Policies trong Kubernetes.
- **Bảo mật Kênh Truyền Nội bộ:** TLS cho giao tiếp qua NATS và RabbitMQ.
- **Quản lý Bí mật:** Kubernetes Secrets hoặc giải pháp Secret Management (Sealed Secrets).
- **Bảo mật Dữ liệu:** Mã hóa dữ liệu khi lưu trữ và khi truyền tải.

## **7\. Hỗ trợ Trải nghiệm Phát triển và Tiến hóa**

Kiến trúc này được thiết kế để hỗ trợ hiệu quả quá trình phát triển và quản lý sự thay đổi:

- **Developer Experience (DX):** Sử dụng bộ công nghệ nhất quán (TypeScript, NestJS, Angular, Nx Monorepo, Dev Containers), cấu trúc code rõ ràng (CQRS và Clean Architecture bên trong service), và tự động hóa quy trình (CI/CD, linting, formatting, **hỗ trợ từ Versioning và Observability**) để tăng năng suất.
- **Quản lý Phiên bản (Versioning):** Như đã mô tả ở mục 4.1, chiến lược versioning rõ ràng cho phép các service tiến hóa và triển khai độc lập một cách an toàn.
- **Testable Architecture:** Cấu trúc CQRS và Clean Architecture với sự phân tách rõ ràng giúp dễ dàng kiểm thử tự động ở nhiều cấp độ (unit, integration, E2E), được hỗ trợ bởi khả năng quan sát từ **Observability**.

## **8\. Tổng kết**

Kiến trúc hệ thống Ecoma là sự kết hợp chiến lược giữa các mô hình phân tán hiện đại (Microservices, EDA) được định hình bởi phương pháp luận tập trung vào nghiệp vụ (DDD) và được triển khai nhất quán bên trong mỗi service với mô hình **CQRS bắt buộc** và **Clean Architecture**. Các khía cạnh quan trọng như **Versioning** và **Observability** được tích hợp ngay trong kiến trúc, cùng với việc triển khai trên nền tảng Kubernetes, các công cụ tự động hóa mạnh mẽ, và chiến lược Bảo mật Đa tầng. Tất cả tạo nên một hệ thống có khả năng mở rộng, chịu lỗi cao, dễ bảo trì và có thể tiến hóa bền vững theo sự phát triển của sản phẩm.
