# **Hướng dẫn triển khai bounded context**

## **1\. Giới thiệu**

Hệ thống Ecoma được thiết kế dựa trên phương pháp Domain-Driven Design (DDD) làm cốt lõi, và Clean Architecture đóng vai trò là một kiến trúc bổ trợ mạnh mẽ, giúp tổ chức code theo các lớp rõ ràng, tách biệt các mối quan tâm và hỗ trợ việc triển khai DDD hiệu quả. Mục tiêu là đảm bảo tính nhất quán, khả năng bảo trì, mở rộng và tuân thủ các nguyên tắc thiết kế của hệ thống Ecoma trong môi trường monorepo.

Tài liệu này cung cấp hướng dẫn chi tiết về cách triển khai một service trong hệ thống Ecoma, sử dụng kiến trúc Clean Architecture và tích hợp các design patterns quan trọng như CQRS, Repository, Specification.

## **2\. Cấu trúc thư mục tổng quan của Nx Monorepo**

Hệ thống Ecoma được quản lý trong một **Nx Monorepo**, một cấu trúc kho mã nguồn duy nhất chứa nhiều project độc lập (ứng dụng, thư viện, test, v.v.). Cấu trúc này giúp chia sẻ mã nguồn, quản lý dependencies hiệu quả và tối ưu hóa quy trình build/test.

Cấu trúc thư mục cấp cao nhất của monorepo Ecoma bao gồm các thư mục chính sau:

- docs/: Chứa tài liệu của dự án (trong đó có tài liệu này).
- apps/: Chứa các project có thể triển khai được (deployable projects). Trong kiến trúc microservices, đây là nơi đặt các project cho các **Service** (ví dụ: rdm-command-service, rdm-query-service) và **Worker** (ví dụ: rdm-worker). Mỗi thư mục con trong apps/services/ hoặc apps/workers/ là một project Nx riêng biệt.
- libs/: Chứa các project thư viện (library projects). Thư mục này được tổ chức để chứa nhiều loại thư viện khác nhau, bao gồm:
  - Các thư viện chứa mã nguồn dùng chung và logic nghiệp vụ cốt lõi, được tổ chức theo Bounded Context và các lớp kiến trúc (Domain, Application, Infrastructure) bên trong thư mục libs/domains/ (Ví dụ: libs/domains/rdm/rdm-domain/, libs/domains/rdm/rdm-application/).
  - Các thư viện dùng chung liên quan đến framework (ví dụ: libs/angular, libs/nestjs).
  - Các thư viện tiện ích hoặc dùng chung khác không thuộc về một domain cụ thể (ví dụ: libs/common).
- e2e/: Chứa các project End-to-End test. Mỗi project E2E thường liên kết với một ứng dụng hoặc worker cụ thể trong thư mục apps/ để kiểm thử luồng tích hợp cuối cùng.
- scripts/: Chứa các script tự động hóa cho các tác vụ phổ biến trong quá trình phát triển, build, deploy hoặc vận hành. Ví dụ: script để khởi động môi trường local, script để tạo dữ liệu test, script để thực hiện các tác vụ bảo trì.
- tools/: Chứa các công cụ tùy chỉnh hoặc các cấu hình dùng chung cho monorepo mà không thuộc về một project cụ thể nào. Ví dụ: các plugin Nx tùy chỉnh, các cấu hình linting/formatting dùng chung, các helper script phức tạp hơn.

Cấu trúc monorepo này là nền tảng cho việc tổ chức các Bounded Context và các lớp kiến trúc bên trong chúng, như sẽ được mô tả chi tiết trong các mục tiếp theo.

## **3\. Cấu trúc thư mục triển khai một bounded contex**

Trong hệ thống Ecoma, một Bounded Context được triển khai bằng cách kết hợp các project trong Nx monorepo. Để giữ cho các thư viện (libs) độc lập với framework và công nghệ, các lớp domain và application sẽ được đặt trong các thư viện riêng biệt, trong khi lớp infrastructure (chứa các triển khai phụ thuộc vào framework) sẽ được đặt trong thư mục apps cùng với điểm khởi chạy ứng dụng.

Một Bounded Context có thể được triển khai bởi **một hoặc nhiều** service. Điều này cho phép tách biệt trách nhiệm của các ứng dụng thực thi dựa trên luồng nghiệp vụ hoặc yêu cầu hiệu năng (ví dụ: một service xử lý Commands, một service khác xử lý Queries, và một worker xử lý các tác vụ nền).

Cấu trúc thư mục cho một Bounded Context (ví dụ: Reference Data Management \- RDM) trong Nx monorepo sẽ như sau:

```bash
├── apps/
│ ├── services/
│ │ └── rdm-command-service/      # Microservice xử lý các commands liên quan đến RDM BC
│ │ └── rdm-query-service/        # Microservice xử lý các queries liên quan đến RDM BC
│ │ └── rdm-worker/               # Worker cho Reference Data Management (xử lý các tác vụ nền, các tác vụ được thực hiện theo lịch...)
├── libs/
│ ├── domains/
│ │ └── rdm/
│ │ │ ├── rdm-domain/             # Lớp Entities, Value Objects, Domain Services, Aggregates (không chứa Domain Events)
│ │ │ ├── rdm-application/        # Lớp Use Cases, Commands, Queries, Ports (Interfaces)
│ │ │ ├── rdm-infrastructure/     # Lớp Interface Adapters (triển khai Ports, tương tác DB, Message Broker)
│ │ │ ├── rdm-events/             # Thư viện chứa định nghĩa các Domain Events của RDM BC
├── e2e/
│ ├── services/
│ │ └── rdm-command-service-e2e/  # E2E project cho rdm-command-service
│ │ └── rdm-query-service-e2e/    # E2E project cho rdm-query-service
│ │ └── rdm-worker-e2e/           # E2E project cho rdm-worker
```

**Lưu ý:** Cấu trúc trên là ví dụ minh họa chung cho một Bounded Context. Trong thực tế triển khai MVP, Bounded Context RDM trong thực tế có thể không có cấu trúc như vậy.