# Tổng quan hệ thống

Hệ thống được thiết kế xoay quanh sản phẩm, hướng đến sự mở rộng bền vững, khả năng vận hành linh hoạt và trải nghiệm phát triển hiện đại. Hệ thống Ecoma được thiết kế để hướng tới:

- **Tính sẵn sàng cao**: đảm bảo uptime tối đa trong môi trường production.
- **Khả năng chịu lỗi**: cô lập lỗi từng service, không ảnh hưởng toàn hệ thống.
- **Dễ dàng mở rộng/thu hẹp quy mô phục vụ**: hỗ trợ auto-scaling theo tải.
- **Dễ dàng bảo trì và cách ly lỗi**: mỗi service độc lập, dễ test, dễ thay thế.
- **Developer Experience tốt**: code rõ ràng, testable, công cụ phát triển hiện đại.
- **Hướng tới phát triển sản phẩm lâu dài (product-oriented)**: dễ thêm tính năng, dễ scale theo từng module.
- **Bảo mật từ thiết kế**: Đảm bảo hệ thống luôn an toàn và bảo mật, tránh các nguy cơ bảo mật tiềm ẩn.
- **Quản lý thông tin liên lạc rõ ràng (Contract-first Communication)**: Đảm bảo giao tiếp giữa các service luôn rõ ràng và dễ hiểu, tránh các lỗi tương thích khi tích hợp.
- **Giảm chi phí vận hành và phát triển (Operational Efficiency & Development)**: Tối ưu chi phí nhân sự, tăng tốc độ phát triển, dễ dàng onboarding team mới và duy trì chất lượng hệ thống ổn định.

---

## Các nguyên lý thiết kế chính

### 1. Domain & Service Design

#### **Single Responsibility**

- Mỗi service đảm nhiệm một domain rõ ràng, theo nguyên lý DDD (Domain-Driven Design).
- Giúp dễ bảo trì, dễ test, và dễ phát triển mở rộng độc lập.

#### **Self-contained Systems (SCS)**

- Mỗi service tự quản lý logic, dữ liệu, và có thể hoạt động độc lập tối đa.
- Có thể mở rộng đến việc cung cấp UI nội bộ riêng cho quản trị (nếu cần).

#### **Versioned Service**

- Mỗi service hỗ trợ nhiều version cùng lúc.
- Đảm bảo **backward compatibility** trong quá trình phát triển và tích hợp.

### 2. Giao tiếp & Tích hợp

#### **Loose Coupling**

- Service giao tiếp thông qua message broker hoặc HTTP abstraction.
- Mỗi service sử dụng cơ sở dữ liệu riêng biệt, tránh coupling theo chiều ngang.

#### **Async by Default**

- Giao tiếp giữa các service ưu tiên bất đồng bộ (qua NATS, RabbitMQ).
- Hướng đến **event-driven architecture** để tăng khả năng mở rộng và tách biệt logic xử lý.

#### **Contract-first Communication**

- API và message schema được định nghĩa rõ ràng (OpenAPI, JSON Schema).
- Hỗ trợ kiểm tra tương thích (schema validation) khi các service tích hợp với nhau.

### 3. Vận hành & Hạ tầng

#### **Auto Scaling & Isolation**

- Mỗi service được thiết kế độc lập, dễ dàng scale theo chiều ngang (horizontal scaling).
- Có thể chia nhỏ worker để xử lý queue riêng biệt (shard theo domain hoặc feature).

#### **Infrastructure as Code (IaC)**

- Toàn bộ hạ tầng được quản lý bằng code (Helm, ArgoCD).
- Dễ dàng tái tạo, rollback và version hóa môi trường triển khai.

#### **Security by Default**

- Áp dụng bảo mật từ thiết kế: phân quyền rõ ràng, mã hóa dữ liệu, rate limiting.
- Đảm bảo mỗi service chỉ được truy cập đúng phạm vi được cấp phép.

### 4. Developer Experience

#### **Testable Architecture**

- Tách biệt rõ giữa domain logic và infrastructure để dễ dàng unit test, integration test.
- Sử dụng mockable service layer, message abstraction.

#### **Modular & Extensible**

- Dễ dàng thêm module mới, mở rộng feature mới mà không làm ảnh hưởng đến phần cũ.
- Áp dụng monorepo với công cụ quản lý dependency nội bộ (Nx).

#### **Tooling & Automation**

- Tích hợp CI/CD với GitHub Actions, auto deploy qua ArgoCD.
- Hỗ trợ git hooks kết hợp linter, scaffolding, code formater cho phát triển nhanh và đúng chuẩn.
- Sử dụng devcontainer để chuẩn hóa môi trường phát triển

### 5. Product-centric Microservice Philosophy

Microservice chỉ là công cụ. Mục tiêu là xây dựng sản phẩm bền vững, dễ bảo trì và mở rộng.

#### **Product-aligned Architecture**

Mỗi service và module được thiết kế xoay quanh ngữ nghĩa sản phẩm, không phải chia nhỏ kỹ thuật tùy tiện.

Hướng tới trải nghiệm người dùng, dòng chảy dữ liệu tự nhiên và tối ưu hóa business logic.

#### **Strategic Stack Unification**

Chọn dùng chung NestJS, NATS, MongoDB, RabbitMQ để tận dụng tối đa tài nguyên đội ngũ.

Giảm chi phí đào tạo, dễ dàng rotate nhân sự giữa các dự án/service.

## Principles Alignment

Hệ thống Ecoma không chỉ được thiết kế để "chạy được", mà còn **phục vụ mục tiêu phát triển sản phẩm lâu dài**, với sự cân bằng giữa kỹ thuật và kinh doanh. Dưới đây là cách các nguyên lý thiết kế chính được gắn kết chặt chẽ với mục tiêu tổng thể của hệ thống:

### 1. **Domain-centric Design ↔ Mở rộng theo sản phẩm**

- Thiết kế mỗi service theo domain rõ ràng giúp **phân rã hệ thống theo ngữ nghĩa sản phẩm** (Product-aligned Architecture).
- Khi sản phẩm mở rộng (thêm tính năng, phân khúc khách hàng mới), chỉ cần thêm service/module tương ứng mà không ảnh hưởng đến phần cũ.

### 2. **Message-driven ↔ Tăng khả năng chịu lỗi và mở rộng**

- Giao tiếp bất đồng bộ qua NATS/RabbitMQ giúp **tách biệt giữa producer và consumer**, tăng khả năng mở rộng (scale-out) và chịu lỗi.
- Service chậm hoặc lỗi sẽ không làm gián đoạn hệ thống.

### 3. **Contract-first ↔ Tối ưu tích hợp nội bộ & bên thứ ba**

- Định nghĩa schema từ đầu giúp **kiểm soát chặt chẽ giao tiếp giữa các team**, tránh tình trạng "bẻ gãy API" khi triển khai tính năng mới.
- Thuận tiện để mở ra tích hợp với bên thứ ba (open API, webhooks).

### 4. **Monorepo ↔ Tối ưu trải nghiệm phát triển**

- Sử dụng Nx Monorepo giúp:
  - Quản lý dependency nội bộ chặt chẽ.
  - Phát hiện lỗi sớm với CI tích hợp lint/test/build cho từng affected project.
  - Tăng tốc phát triển (scaffolding, cache build, devcontainer).

### 5. **Self-contained Systems (SCS) ↔ Tối ưu vận hành và deploy**

- Mỗi service có thể deploy độc lập, rollback độc lập.
- Dễ scale từng phần theo nhu cầu (ví dụ: `notification-service` scale cao, `auth-service` thì không cần).
- Giảm dependency hạ tầng chéo (database riêng, queue riêng nếu cần).

### 6. **Security by Default ↔ Đảm bảo an toàn hệ thống ngay từ đầu**

- Tích hợp bảo mật từ thiết kế (Design-time security):
  - Mỗi service có quyền truy cập rõ ràng (Zero trust nội bộ).
  - Token-based, RBAC, và phân quyền chi tiết từ `permission-service`.

### 7. **Testable & Extensible ↔ Đảm bảo chất lượng và tốc độ**

- Mỗi phần của hệ thống đều có thể test đơn lẻ (unit test, integration test).
- Khi mở rộng tính năng mới chỉ cần mở rộng module liên quan, không cần refactor toàn bộ.
