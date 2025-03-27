# **Nền tảng Công nghệ**

Tài liệu này liệt kê và mô tả các công nghệ chính được sử dụng trong hệ thống Ecoma, tập trung vào **lý do lựa chọn** và cách mỗi công nghệ **đáp ứng các mục tiêu và nguyên lý thiết kế** của hệ thống.

Việc lựa chọn công nghệ tuân theo nguyên lý **Strategic Stack Unification** nhằm tận dụng tối đa nguồn lực đội ngũ, giảm chi phí đào tạo, và dễ dàng luân chuyển nhân sự, đồng thời vẫn đảm bảo tính phù hợp với từng bài toán cụ thể.

## **1\. Programming Language**

- **TypeScript**
  - **Mô tả:** Là một superset của JavaScript, bổ sung hệ thống kiểu tĩnh (static typing).
  - **Lý do lựa chọn & Hỗ trợ Nguyên lý:**
    - **Developer Experience (DX):** Giúp phát hiện lỗi ngay trong quá trình phát triển, tăng cường khả năng đọc hiểu code, refactoring an toàn hơn, và cung cấp hỗ trợ mạnh mẽ từ các công cụ phát triển (IDE).
    - **Maintainability:** Mã nguồn được viết bằng TypeScript rõ ràng hơn, dễ bảo trì và mở rộng hơn trong một hệ thống microservices phức tạp.
    - **Strategic Stack Unification:** Là lựa chọn phổ biến và mạnh mẽ trong hệ sinh thái Node.js, phù hợp với các framework như NestJS và các thư viện frontend như Angular.

## **2\. Framework & Runtime**

- **Backend Framework: NestJS**
  - **Mô tả:** Framework Node.js mạnh mẽ, có cấu trúc module rõ ràng để xây dựng các ứng dụng server-side hiệu quả và có khả năng mở rộng.
  - **Lý do lựa chọn & Hỗ trợ Nguyên lý:**
    - **Product-oriented Architecture & Maintainability:** Hỗ trợ DDD, Clean Architecture, CQRS.
    - **Developer Experience (DX):** Có CLI mạnh, tuân theo các design pattern quen thuộc.
    - **Scalability & Performance:** Dựa trên mô hình non-blocking I/O của Node.js.
    - **Testable Architecture:** Thiết kế dựa trên Dependency Injection.
    - **Strategic Stack Unification:** Tương thích tốt trong hệ sinh thái TypeScript.
- **Frontend Framework: Angular**
  - **Mô tả:** Framework front-end của Google, sử dụng TypeScript, hướng component.
  - **Lý do lựa chọn & Hỗ trợ Nguyên lý:**
    - **Developer Experience (DX) & Maintainability:** Cấu trúc rõ ràng, mạnh mẽ cho ứng dụng lớn.
    - **Strategic Stack Unification:** Đồng bộ tư tưởng thiết kế với NestJS, dễ đào tạo và chuyển đổi kỹ năng.
- **Runtime: Node.js**
  - **Mô tả:** Môi trường chạy JavaScript phía server.
  - **Lý do lựa chọn & Hỗ trợ Nguyên lý:**
    - **Scalability & Performance:** I/O bất đồng bộ hiệu quả.
    - **Strategic Stack Unification:** Cho phép dùng chung JavaScript/TypeScript giữa frontend và backend.

## **3\. Databases & Caching**

Hệ thống Ecoma sử dụng kết hợp các loại cơ sở dữ liệu khác nhau tùy thuộc vào yêu cầu nghiệp vụ và tính chất dữ liệu của từng Bounded Context, cùng với các giải pháp caching để tối ưu hiệu năng đọc.

- **RDBMS: PostgreSQL**
  - **Mô tả:** Hệ quản trị cơ sở dữ liệu quan hệ mã nguồn mở mạnh mẽ.
  - **Lý do lựa chọn & Hỗ trợ Nguyên lý:** Phù hợp cho dữ liệu có cấu trúc quan hệ chặt chẽ, yêu cầu tính toàn vẹn dữ liệu cao và hỗ trợ giao dịch ACID (ví dụ: IAM, BUM).
  - **ORM:** Sử dụng **TypeORM** để tương tác với PostgreSQL.
- **NoSQL: MongoDB**
  - **Mô tả:** Cơ sở dữ liệu NoSQL hướng document.
  - **Lý do lựa chọn & Hỗ trợ Nguyên lý:** Phù hợp cho dữ liệu phi cấu trúc, có cấu trúc lồng ghép hoặc schema thay đổi thường xuyên, yêu cầu khả năng mở rộng ngang linh hoạt (ví dụ: các dữ liệu nghiệp vụ đặc thù trong các Feature BC).
  - **ODM:** Sử dụng **Mongoose** để tương tác với MongoDB.
- **Caching / In-Memory Database: Redis**
  - **Mô tả:** Kho lưu trữ cấu trúc dữ liệu trong bộ nhớ, được sử dụng làm cache hoặc database hiệu năng cao.
  - **Lý do lựa chọn & Hỗ trợ Nguyên lý:** Cung cấp độ trễ cực thấp cho các thao tác đọc/ghi, hỗ trợ caching hiệu quả, quản lý session, hàng đợi đơn giản (ví dụ: cache Entitlement trong IAM, cache dữ liệu đọc trong các BC khác).

## **4\. Message Broker**

Hệ thống sử dụng các Message Broker khác nhau cho các mục đích giao tiếp bất đồng bộ và đồng bộ nội bộ, dựa trên yêu cầu về độ tin cậy và mô hình tương tác.

- **NATS**
  - **Mô tả:** Hệ thống message nhẹ, hiệu năng cao, hỗ trợ Pub/Sub và Request/Reply.
  - **Lý do lựa chọn & Hỗ trợ Nguyên lý:** Là nền tảng truyền tin chính cho giao tiếp **đồng bộ nội bộ dạng Request/Reply** giữa các service backend và từ API Gateway đến service backend, nơi yêu cầu độ trễ thấp và phản hồi tức thời. Có thể được sử dụng cho Pub/Sub trong các trường hợp đặc biệt yêu cầu hiệu năng cực cao và mô hình phân phối tin nhắn của NATS phù hợp.
- **RabbitMQ**
  - **Mô tả:** Message Broker hỗ trợ nhiều mô hình nhắn tin và cam kết độ tin cậy cao.
  - **Lý do lựa chọn & Hỗ trợ Nguyên lý:** Được sử dụng làm nền tảng truyền tin chính cho các sự kiện dạng **Fire-and-Forget (Domain Events)** giữa các service backend và quản lý các **hàng đợi xử lý tác vụ nền (Background Job Queues)**. RabbitMQ cung cấp các tính năng đảm bảo độ tin cậy như message persistence, consumer acknowledgment, Dead Letter Exchanges, phù hợp cho các luồng nghiệp vụ bất đồng bộ quan trọng không yêu cầu phản hồi tức thời.

## **5\. Containerization & Orchestration (Production)**

- **Container Runtime: Docker**
  - **Mô tả:** Công cụ đóng gói ứng dụng vào container độc lập.
  - **Lý do lựa chọn & Hỗ trợ Nguyên lý:**
    - **Containerization:** Cốt lõi triển khai microservices.
    - **Isolation & Operational Efficiency:** Cô lập tiến trình và đơn giản hoá quy trình triển khai.
- **Container Orchestration: Kubernetes (K8s)**
  - **Mô tả:** Nền tảng tự động triển khai, scaling và quản lý ứng dụng container.
  - **Lý do lựa chọn & Hỗ trợ Nguyên lý:**
    - **High Availability & Scalability:** Tự phục hồi, autoscaling mạnh mẽ.
    - **Operational Efficiency:** Tự động hoá các tác vụ vận hành.
    - **Service Discovery & Configuration Management**
    - **Resource Isolation**

## **6\. Operations & Deployment Automation**

- **Infrastructure as Code (IaC): Helm**
  - **Mô tả:** Package manager cho K8s.
  - **Lý do lựa chọn & Hỗ trợ Nguyên lý:**
    - **IaC Principle:** Biến cấu hình thành code có thể version hóa.
    - **Repeatable Deployments & Maintainability**
- **GitOps & CI/CD Automation**
  - **ArgoCD**
    - **Mô tả:** Công cụ GitOps CD cho K8s.
    - **Lý do lựa chọn & Hỗ trợ Nguyên lý:**
      - **GitOps Principle & Operational Efficiency**
  - **GitHub Actions**
    - **Mô tả:** Nền tảng tự động hoá quy trình tích hợp GitHub.
    - **Lý do lựa chọn & Hỗ trợ Nguyên lý:**
      - **CI/CD Pipeline & DX & Automation**

## **7\. Developer Experience (DX) & Monorepo Tools**

- **Nx**
  - **Mô tả:** Framework quản lý monorepo, rất phù hợp với dự án lớn.
  - **Lý do lựa chọn & Hỗ trợ Nguyên lý:**
    - **Monorepo Principle & Code Sharing**
    - **Developer Experience (DX) & Testable Architecture**
    - **CI/CD Optimization:** Chỉ test các phần bị ảnh hưởng (affected).

## **8\. API & Schema Definition**

- **OpenAPI**
  - **Mô tả:** Đặc tả chuẩn cho REST API.
  - **Lý do lựa chọn & Hỗ trợ Nguyên lý:**
    - **Contract-first Communication:** Giao tiếp giữa client và API Gateway.
    - **Developer Experience (DX):** Tự động generate code/documentation.

## Công cụ tài liệu hóa

- Hệ thống sử dụng **docsify** để render tài liệu markdown (docs/) thành trang web tài liệu động cho developer và AI.
- Sử dụng **typedoc** để sinh tài liệu API tự động từ code TypeScript, xuất ra docs/libraries/.
