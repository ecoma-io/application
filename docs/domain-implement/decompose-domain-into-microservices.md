# **Phân rã nghiệp vụ thành microservices**

## **1\. Giới thiệu**

Hệ thống Ecoma được thiết kế dựa trên phương pháp Domain-Driven Design (DDD) làm cốt lõi, và Clean Architecture đóng vai trò là một kiến trúc bổ trợ mạnh mẽ, giúp tổ chức code theo các lớp rõ ràng, tách biệt các mối quan tâm và hỗ trợ việc triển khai DDD hiệu quả. Mục tiêu là đảm bảo tính nhất quán, khả năng bảo trì, mở rộng và tuân thủ các nguyên tắc thiết kế của hệ thống Ecoma trong môi trường monorepo.

Tài liệu này cung cấp hướng dẫn chi tiết về cách triển khai một service trong hệ thống Ecoma, sử dụng kiến trúc Clean Architecture và tích hợp các design patterns quan trọng như CQRS, Repository, Specification.

Chúng ta sẽ sử dụng **Reference Data Management (RDM)** làm ví dụ xuyên suốt để minh họa cách áp dụng các design pattern và cấu trúc thư mục.

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

Một Bounded Context có thể được triển khai bởi **một hoặc nhiều** service hoặc worker. Điều này cho phép tách biệt trách nhiệm của các ứng dụng thực thi dựa trên luồng nghiệp vụ hoặc yêu cầu hiệu năng (ví dụ: một service xử lý Commands, một service khác xử lý Queries, và một worker xử lý các tác vụ nền).

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
│ │ │ ├── rdm-domain/             # Lớp Entities
│ │ │ ├── rdm-application/        # Lớp Use Cases
│ │ │ ├── rdm-infrastructure/     # Lớp Interface Adapter
├── e2e/
│ ├── services/
│ │ └── rdm-command-service-e2e/  # E2E project cho rdm-command-service
│ │ └── rdm-query-service-e2e/    # E2E project cho rdm-query-service
│ │ └── rdm-worker-e2e/           # E2E project cho rdm-worker
```

**Lưu ý:** Cấu trúc trên là ví dụ minh họa chung cho một Bounded Context. Trong thực tế triển khai MVP, Bounded Context RDM hiện tại **không có worker** vì các tác vụ của nó chủ yếu là cung cấp dữ liệu và không yêu cầu xử lý nền phức tạp.

## **4\. Chiến lược Testing**

Để đảm bảo chất lượng và độ tin cậy của hệ thống, chúng ta sẽ tập trung vào hai cấp độ testing chính: **Unit Testing** và **End-to-End (E2E) Testing**.

- **Unit Testing:**
  - **Mục đích:** Kiểm thử các đơn vị code nhỏ nhất (hàm, phương thức, lớp) một cách độc lập, cô lập khỏi các phụ thuộc bên ngoài. Đảm bảo logic nghiệp vụ và kỹ thuật trong từng đơn vị hoạt động đúng như mong đợi.
  - **Vị trí:** Các file Unit Test sẽ được đặt cùng thư mục với file source code mà chúng kiểm thử (ví dụ: my-feature.ts và my-feature.test.ts). Điều này giúp dễ dàng tìm kiếm, quản lý và đảm bảo các test luôn cập nhật cùng với code được test.
  - **Tên Test Case:** Để đảm bảo sự đồng nhất và dễ hiểu cho toàn bộ đội ngũ, **tên của các test case (mô tả trong describe và it) bên trong các file .test.ts nên được viết bằng tiếng Việt.**
- **End-to-End (E2E) Testing:**
  - **Mục đích:** Kiểm thử toàn bộ luồng nghiệp vụ từ đầu đến cuối, mô phỏng hành vi của các hệ thống bên ngoài khi tương tác với service trong môi trường tích hợp. E2E test kiểm tra sự tích hợp giữa các thành phần (bao gồm service đang test, database, message broker, và các service khác nếu có tương tác trực tiếp qua message broker) và đảm bảo hệ thống hoạt động chính xác trong môi trường tích hợp.
  - **Vị trí:** Các project E2E test sẽ được đặt trong thư mục e2e/services/ hoặc e2e/workers/, tương ứng với service hoặc worker mà chúng kiểm thử. Cấu trúc thư mục e2e sẽ phản ánh cấu trúc của apps/services và apps/workers. Ví dụ: e2e/services/rdm-command-service-e2e/ sẽ chứa các E2E test cho apps/services/rdm-command-service/.
  - **Tên Test Case:** Tương tự như Unit Test, **tên của các test case E2E cũng nên được viết bằng tiếng Việt** để đảm bảo sự đồng nhất.

Chiến lược này tập trung vào việc kiểm thử logic nghiệp vụ chi tiết ở cấp độ đơn vị (Unit Test) và kiểm thử sự hoạt động chính xác của toàn bộ hệ thống trong môi trường tích hợp (E2E Test), cung cấp sự cân bằng giữa tốc độ phản hồi của test và độ bao phủ của các luồng nghiệp vụ quan trọng.

## **5\. Ví dụ triển khai rdm-domain (Lớp Entities)**

Project rdm-domain nằm trong thư mục libs/domains/rdm/rdm-domain/ và là nơi chứa các thành phần cốt lõi của miền nghiệp vụ RDM theo nguyên tắc của DDD và Clean Architecture. Đây là lớp Domain Entities, hoàn toàn độc lập với framework và cơ sở dữ liệu.

Cấu trúc thư mục bên trong rdm-domain có thể như sau:

```bash
├── libs/
│ ├── domains/
│ │ └── rdm/
│ │ │ ├── rdm-domain/
│ │ │ │ ├── src/
│ │ │ │ │ ├── lib/
│ │ │ │ │ │ ├── aggregates/
│ │ │ │ │ │ │ ├── reference-data-set/   # Aggregate Root: ReferenceDataSet
│ │ │ │ │ │ │ │ ├── reference-data-set.entity.ts
│ │ │ │ │ │ │ │ ├── reference-data-set.entity.test.ts # Unit tests cho ReferenceDataSet Entity (tên test case bên trong file viết tiếng Việt)
│ │ │ │ │ │ │ │ ├── reference-data-set.errors.ts
│ │ │ │ │ │ │ │ ├── reference-data-set.events.ts # Domain Events liên quan đến Aggregate
│ │ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ ├── entities/
│ │ │ │ │ │ │ ├── reference-data-item/  # Entity: ReferenceDataItem (thuộc ReferenceDataSet Aggregate)
│ │ │ │ │ │ │ │ ├── reference-data-item.entity.ts
│ │ │ │ │ │ │ │ ├── reference-data-item.entity.test.ts # Unit tests cho ReferenceDataItem Entity (tên test case bên trong file viết tiếng Việt)
│ │ │ │ │ │ │ │ ├── reference-data-item.errors.ts
│ │ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ ├── value-objects/
│ │ │ │ │ │ │ ├── reference-data-set-id/ # Value Object: ReferenceDataSetId
│ │ │ │ │ │ │ │ ├── reference-data-set-id.vo.ts
│ │ │ │ │ │ │ │ ├── reference-data-set-id.vo.test.ts # Unit tests cho ReferenceDataSetId Value Object (tên test case bên trong file viết tiếng Việt)
│ │ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ │ ├── reference-data-item-id/ # Value Object: ReferenceDataItemId
│ │ │ │ │ │ │ │ ├── reference-data-item-id.vo.ts
│ │ │ │ │ │ │ │ ├── reference-data-item-id.vo.test.ts # Unit tests cho ReferenceDataItemId Value Object (tên test case bên trong file viết tiếng Việt)
│ │ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ │ ├── reference-data-item-value/ # Value Object: Giá trị của item (có thể là string, number, boolean, object...)
│ │ │ │ │ │ │ │ ├── reference-data-item-value.vo.ts
│ │ │ │ │ │ │ │ ├── reference-data-item-value.vo.test.ts # Unit tests cho ReferenceDataItemValue Value Object (tên test case bên trong file viết tiếng Việt)
│ │ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ ├── domain-events/          # Các Domain Events độc lập
│ │ │ │ │ │ │ ├── reference-data-set-created.event.ts
│ │ │ │ │ │ │ │ ├── reference-data-set-created.event.test.ts # Unit tests cho ReferenceDataSetCreated Event (tên test case bên trong file viết tiếng Việt)
│ │ │ │ │ │ │ ├── reference-data-set-updated.event.ts
│ │ │ │ │ │ │ ├── reference-data-set-removed.event.ts
│ │ │ │ │ │ │ ├── reference-data-item-added.event.ts
│ │ │ │ │ │ │ ├── reference-data-item-updated.event.ts
│ │ │ │ │ │ │ ├── reference-data-item-removed.event.ts
│ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ └── index.ts # Export tất cả các thành phần từ lib
│ │ │ │ └── index.ts     # Export tất cả các thành phần từ src/lib
│ │ │ └── project.json   # Nx project configuration
│ │ └── tsconfig.json    # TypeScript configuration
```

**Giải thích:**

- **aggregates/**: Chứa các Aggregate Root của miền RDM. ReferenceDataSet là một Aggregate Root quan trọng, quản lý một tập hợp các ReferenceDataItem.
  - reference-data-set.entity.ts: Định nghĩa lớp ReferenceDataSet với các thuộc tính và hành vi nghiệp vụ (methods) liên quan đến quản lý một tập dữ liệu tham chiếu (ví dụ: thêm item, xóa item, cập nhật metadata của tập dữ liệu).
  - reference-data-set.entity.test.ts: Các file này chứa các Unit Test để kiểm tra logic nghiệp vụ và hành vi bên trong lớp ReferenceDataSet. **Tên của các test case bên trong file này nên được viết bằng tiếng Việt.**
  - reference-data-set.errors.ts: Định nghĩa các lỗi nghiệp vụ đặc thù của Aggregate này.
  - reference-data-set.events.ts: Định nghĩa các Domain Event mà Aggregate ReferenceDataSet có thể phát ra (ví dụ: ReferenceDataSetCreated, ReferenceDataItemAdded).
- **entities/**: Chứa các Entity không phải là Aggregate Root nhưng là một phần của Aggregate. ReferenceDataItem là một Entity thuộc Aggregate ReferenceDataSet.
  - reference-data-item.entity.ts: Định nghĩa lớp ReferenceDataItem với các thuộc tính (key, value, metadata) và hành vi.
  - reference-data-item.entity.test.ts: Các file này chứa các Unit Test để kiểm tra logic nghiệp vụ và hành vi bên trong lớp ReferenceDataItem. **Tên của các test case bên trong file này nên được viết bằng tiếng Việt.**
  - reference-data-item.errors.ts: Định nghĩa các lỗi nghiệp vụ đặc thù của Entity này.
- **value-objects/**: Chứa các Value Object, đại diện cho các khái niệm có giá trị nhưng không có định danh duy nhất và được coi là bất biến (immutable).
  - reference-data-set-id.vo.ts, reference-data-item-id.vo.ts, reference-data-item-value.vo.ts: Các Value Object đại diện cho ID và giá trị của item tham chiếu.
  - \*.vo.test.ts: Các file này chứa các Unit Test để kiểm tra logic khởi tạo, validation và so sánh của các Value Object. **Tên của các test case bên trong các file này nên được viết bằng tiếng Việt.**
- **domain-events/**: Chứa các định nghĩa cho Domain Event, đại diện cho những sự kiện quan trọng xảy ra trong miền nghiệp vụ RDM. Các sự kiện này sẽ được phát ra và có thể được các BC khác lắng nghe.
  - \*.event.ts: Định nghĩa cấu trúc dữ liệu của các Domain Event.
  - \*.event.test.ts: Các file này chứa các Unit Test để kiểm tra việc khởi tạo hoặc các phương thức tiện ích (nếu có) trên các Domain Event. **Tên của các test case bên trong các file này nên được viết bằng tiếng Việt.**

Cấu trúc này đảm bảo rằng logic nghiệp vụ cốt lõi của RDM được đóng gói gọn gàng trong lớp rdm-domain, độc lập với các chi tiết kỹ thuật triển khai (cơ sở dữ liệu, framework web, message broker), tuân thủ nguyên tắc của Clean Architecture. Việc đặt các file .test.ts cùng thư mục với source code giúp dễ dàng tìm kiếm và duy trì các test case.

## **6\. Ví dụ triển khai rdm-application (Lớp Use Cases)**

Project rdm-application nằm trong thư mục libs/domains/rdm/rdm-application/ và là nơi chứa các Use Cases (Application Services) của miền nghiệp vụ RDM. Lớp này điều phối các Domain Entities và tương tác với các Interface (Ports) được định nghĩa ở đây, nhưng không chứa logic nghiệp vụ cốt lõi (nằm ở Domain Layer) và không phụ thuộc vào chi tiết triển khai (nằm ở Infrastructure Layer).

Cấu trúc thư mục bên trong rdm-application có thể như sau:

```bash
├── libs/
│ ├── domains/
│ │ └── rdm/
│ │ │ ├── rdm-application/
│ │ │ │ ├── src/
│ │ │ │ │ ├── lib/
│ │ │ │ │ │ ├── use-cases/          # Các Use Case (Application Services)
│ │ │ │ │ │ │ ├── commands/         # Use Cases xử lý Command (ghi)
│ │ │ │ │ │ │ │ ├── create-reference-data-set/
│ │ │ │ │ │ │ │ │ ├── create-reference-data-set.command.ts # Định nghĩa Command
│ │ │ │ │ │ │ │ │ ├── create-reference-data-set.handler.ts # Handler xử lý Command
│ │ │ │ │ │ │ │ │ ├── create-reference-data-set.handler.test.ts # Unit tests cho Handler (tên test case bên trong file viết tiếng Việt)
│ │ │ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ │ │ ├── update-reference-data-set/
│ │ │ │ │ │ │ │ │ ├── update-reference-data-set.command.ts
│ │ │ │ │ │ │ │ │ ├── update-reference-data-set.handler.ts
│ │ │ │ │ │ │ │ │ ├── update-reference-data-set.handler.test.ts # Unit tests cho Handler (tên test case bên trong file viết tiếng Việt)
│ │ │ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ │ ├── queries/          # Use Cases xử lý Query (đọc)
│ │ │ │ │ │ │ │ ├── get-reference-data-set-by-id/
│ │ │ │ │ │ │ │ │ ├── get-reference-data-set-by-id.query.ts # Định nghĩa Query
│ │ │ │ │ │ │ │ │ ├── get-reference-data-set-by-id.handler.ts # Handler xử lý Query
│ │ │ │ │ │ │ │ │ ├── get-reference-data-set-by-id.handler.test.ts # Unit tests cho Handler (tên test case bên trong file viết tiếng Việt)
│ │ │ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ │ │ ├── get-all-reference-data-sets/
│ │ │ │ │ │ │ │ │ ├── get-all-reference-data-sets.query.ts
│ │ │ │ │ │ │ │ │ ├── get-all-reference-data-sets.handler.ts
│ │ │ │ │ │ │ │ │ ├── get-all-reference-data-sets.handler.test.ts # Unit tests cho Handler (tên test case bên trong file viết tiếng Việt)
│ │ │ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ ├── interfaces/         # Các Ports (Interfaces) mà Application Layer cần
│ │ │ │ │ │ │ ├── persistence/      # Interfaces cho Persistence (Repository)
│ │ │ │ │ │ │ │ ├── reference-data-set.repository.ts # Interface của Repository
│ │ │ │ │ │ │ │ ├── reference-data-set.repository.test.ts # Unit tests cho Repository Interface (kiểm tra contract, tên test case bên trong file viết tiếng Việt)
│ │ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ │ ├── message-broker/   # Interfaces cho Message Broker (Publish Domain Events)
│ │ │ │ │ │ │ │ ├── domain-event.publisher.ts # Interface của Domain Event Publisher
│ │ │ │ │ │ │ │ ├── domain-event.publisher.test.ts # Unit tests cho Publisher Interface (kiểm tra contract, tên test case bên trong file viết tiếng Việt)
│ │ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ └── index.ts # Export tất cả các thành phần từ lib
│ │ │ │ └── index.ts     # Export tất cả các thành phần từ src/lib
│ │ │ └── project.json   # Nx project configuration
│ │ └── tsconfig.json    # TypeScript configuration
```

**Giải thích:**

- **use-cases/**: Chứa các Use Case, được tổ chức theo Command và Query. Mỗi Use Case thường bao gồm một định nghĩa (Command/Query) và một Handler.
  - **commands/**: Chứa các Use Case xử lý các hành động ghi (Command). Ví dụ: CreateReferenceDataSetCommand, UpdateReferenceDataSetCommand. Mỗi Command có một Handler tương ứng (CreateReferenceDataSetHandler, UpdateReferenceDataSetHandler) chứa logic điều phối các Domain Entities và gọi các Interface.
  - **queries/**: Chứa các Use Case xử lý các hành động đọc (Query). Ví dụ: GetReferenceDataSetByIdQuery, GetAllReferenceDataSetsQuery. Mỗi Query có một Handler tương ứng (GetReferenceDataSetByIdHandler, GetAllReferenceDataSetsHandler) chứa logic truy vấn dữ liệu (thường thông qua Query-specific Read Models hoặc Repository).
  - \*.handler.test.ts: Các file này chứa Unit Test cho các Command/Query Handler, kiểm tra logic điều phối và tương tác với các Dependencies (được mock). **Tên của các test case bên trong các file này nên được viết bằng tiếng Việt.**
- **interfaces/**: Chứa các Interface (Ports) mà Application Layer phụ thuộc vào. Các Interface này định nghĩa hợp đồng mà Infrastructure Layer phải triển khai.
  - **persistence/**: Interface cho việc lưu trữ dữ liệu. ReferenceDataSetRepository định nghĩa các phương thức để lưu và lấy Aggregate ReferenceDataSet.
  - **message-broker/**: Interface cho việc giao tiếp bất đồng bộ. DomainEventPublisher định nghĩa phương thức để publish Domain Events.
  - \*.interface.test.ts: Mặc dù không phổ biến bằng test handler, bạn có thể thêm test cho interface để đảm bảo contract được định nghĩa đúng hoặc kiểm tra các phương thức tiện ích trên interface (nếu có). **Tên của các test case bên trong các file này nên được viết bằng tiếng Việt.**

Lớp rdm-application chứa logic nghiệp vụ của ứng dụng (Application Logic), điều phối các Domain Entities để thực hiện các Use Cases, và định nghĩa các Ports mà nó cần để tương tác với thế giới bên ngoài (Persistence, Messaging, External Services).

## **7\. Ví dụ triển khai rdm-infrastructure (Lớp Adapters)**

Project rdm-infrastructure nằm trong thư mục libs/domains/rdm/rdm-infrastructure/ và là nơi chứa các triển khai cụ thể của các Interface (Ports) được định nghĩa trong rdm-application. Đây là lớp Adapter, phụ thuộc vào các thư viện bên ngoài (framework, ORM, message broker client, v.v.) và chi tiết kỹ thuật triển khai.

Trong Ecoma, giao tiếp nội bộ giữa các service sử dụng **NATS cho các tương tác dạng Request/Response** (gọi Command/Query từ service khác) và **RabbitMQ cho các tương tác dạng Fire-and-Forget (Event-Driven)**.

Cấu trúc thư mục bên trong rdm-infrastructure có thể như sau:

```bash
├── libs/
│ ├── domains/
│ │ └── rdm/
│ │ │ ├── rdm-infrastructure/
│ │ │ │ ├── src/
│ │ │ │ │ ├── lib/
│ │ │ │ │ │ ├── persistence/          # Triển khai các Persistence Interfaces (ví dụ: TypeORM)
│ │ │ │ │ │ │ │ ├── typeorm/
│ │ │ │ │ │ │ │ │ ├── entities/         # Các Entity của ORM (khác với Domain Entities)
│ │ │ │ │ │ │ │ │ ├── mappers/          # Mapper giữa ORM Entity và Domain Entity
│ │ │ │ │ │ │ │ │ ├── reference-data-set.repository.ts # Triển khai ReferenceDataSetRepository
│ │ │ │ │ │ │ │ │ ├── reference-data-set.repository.test.ts # Integration tests cho Repository (tên test case bên trong file viết tiếng Việt)
│ │ │ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ ├── nats-rpc/           # Adapters cho giao tiếp Request/Response qua NATS
│ │ │ │ │ │ │ │ ├── inbound/          # Inbound Adapters: Nhận NATS Request và gọi Use Cases
│ │ │ │ │ │ │ │ │ ├── command-handlers/ # Handlers nhận NATS Request cho Commands
│ │ │ │ │ │ │ │ │ │ ├── create-reference-data-set.handler.ts # Nhận NATS Request và gọi CreateReferenceDataSetHandler (Application Layer)
│ │ │ │ │ │ │ │ │ │ ├── create-reference-data-set.handler.test.ts # Unit/Integration tests cho NATS Command Handler (tên test case bên trong file viết tiếng Việt)
│ │ │ │ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ │ │ │ ├── query-handlers/   # Handlers nhận NATS Request cho Queries
│ │ │ │ │ │ │ │ │ │ ├── get-reference-data-set-by-id.handler.ts # Nhận NATS Request và gọi GetReferenceDataSetByIdHandler (Application Layer)
│ │ │ │ │ │ │ │ │ │ ├── get-reference-data-set-by-id.handler.test.ts # Unit/Integration tests cho NATS Query Handler (tên test case bên trong file viết tiếng Việt)
│ │ │ │ │ │ │ │ │ │ ├── get-all-reference-data-sets.handler.ts
│ │ │ │ │ │ │ │ │ │ ├── get-all-reference-data-sets.handler.test.ts # Unit/Integration tests cho NATS Query Handler (tên test case bên trong file viết tiếng Việt)
│ │ │ │ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ ├── rabbitmq-events/      # Adapters cho giao tiếp Event qua RabbitMQ
│ │ │ │ │ │ │ │ ├── outbound/         # Outbound Adapters: Triển khai Domain Event Publisher
│ │ │ │ │ │ │ │ │ ├── domain-event.publisher.ts # Triển khai DomainEventPublisher (Application Layer Interface)
│ │ │ │ │ │ │ │ │ ├── domain-event.publisher.test.ts # Integration tests cho Publisher (tên test case bên trong file viết tiếng Việt)
│ │ │ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ │ │ ├── inbound/          # Inbound Adapters: Handlers lắng nghe RabbitMQ Events từ BC khác
│ │ │ │ │ │ │ │ │ ├── iam/              # Ví dụ lắng nghe sự kiện từ IAM
│ │ │ │ │ │ │ │ │ │ ├── tenant-created.handler.ts # Handler xử lý TenantCreatedEvent từ RabbitMQ
│ │ │ │ │ │ │ │ │ │ ├── tenant-created.handler.test.ts # Integration tests cho Event Handler (tên test case bên trong file viết tiếng Việt)
│ │ │ │ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ └── index.ts # Export tất cả các thành phần từ lib
│ │ │ │ └── index.ts     # Export tất cả các thành phần từ src/lib
│ │ │ └── project.json   # Nx project configuration
│ │ └── tsconfig.json    # TypeScript configuration
```

**Giải thích:**

- **persistence/**: Chứa triển khai cụ thể của Repository Interface, sử dụng ORM (ví dụ: TypeORM) hoặc client CSDL trực tiếp. Bao gồm các ORM Entity, Mapper và lớp Repository triển khai interface từ Application Layer. Các test ở đây là Integration Test với CSDL. **Tên của các test case bên trong các file .test.ts ở đây nên được viết bằng tiếng Việt.**
- **nats-rpc/**: Chứa các Adapters xử lý giao tiếp Request/Response thông qua NATS.
  - **inbound/**: Đây là các Inbound Adapters nhận Request từ NATS. Các handler ở đây sẽ parse NATS message, gọi đúng Use Case (Command/Query Handler) trong Application Layer, và gửi Response trở lại qua NATS.
    - command-handlers/: Nhận các NATS Request tương ứng với Commands (ví dụ: "rdm.command.create_reference_data_set").
    - query-handlers/: Nhận các NATS Request tương ứng với Queries (ví dụ: "rdm.query.get_reference_data_set_by_id").
  - \*.handler.test.ts: Các file này chứa Unit hoặc Integration Test để kiểm tra logic nhận/parse NATS message và gọi đúng Application Handler. **Tên của các test case bên trong các file này nên được viết bằng tiếng Việt.**
- **rabbitmq-events/**: Chứa các Adapters xử lý giao tiếp Event thông qua RabbitMQ.
  - **outbound/**: Triển khai cụ thể của DomainEventPublisher interface từ Application Layer, sử dụng RabbitMQ client để publish Domain Events.
    - domain-event.publisher.ts: Lớp triển khai logic gửi Domain Events đến RabbitMQ Exchange/Queue.
    - domain-event.publisher.test.ts: Integration Test để kiểm tra việc gửi event. **Tên của các test case bên trong file này nên được viết bằng tiếng Việt.**
  - **inbound/**: Đây là các Inbound Adapters lắng nghe và xử lý Domain Events từ các Bounded Context khác thông qua RabbitMQ Queue.
    - event-handlers/: Chứa các handler cụ thể cho từng loại Domain Event được lắng nghe (ví dụ: TenantCreatedHandler xử lý TenantCreatedEvent từ IAM).
    - \*.handler.test.ts: Integration Test để kiểm tra việc nhận event từ RabbitMQ và gọi logic xử lý tương ứng (có thể là gọi một Use Case hoặc Domain Service). **Tên của các test case bên trong các file này nên được viết bằng tiếng Việt.**

Lớp rdm-infrastructure là nơi "cắm" các chi tiết kỹ thuật vào các Ports được định nghĩa bởi Application Layer. Nó phụ thuộc vào các thư viện bên ngoài (NATS client, RabbitMQ client, ORM, v.v.) và môi trường triển khai. Các test ở lớp này thường là Integration Test để kiểm tra sự tương tác với các hệ thống bên ngoài (CSDL, NATS, RabbitMQ).

## **8\. Ví dụ triển khai rdm-service (Lớp Presenters)**

Các project rdm-command-service và rdm-query-service nằm trong thư mục apps/services/ và là điểm khởi chạy (entry point) của các microservice RDM. Trong ngữ cảnh Clean Architecture, các service này có thể được xem như lớp "Presenters" hoặc "Controllers", mặc dù chúng không trực tiếp xử lý giao diện người dùng mà xử lý các yêu cầu đến từ bên ngoài (trong trường hợp này là qua NATS).

Vai trò chính của các service project này là:

1. **Khởi tạo ứng dụng:** Cấu hình và khởi động service (sử dụng NestJS).
2. **Quản lý Dependency Injection:** Wiring các dependencies giữa các lớp (Infrastructure triển khai các Interface từ Application, Application sử dụng Domain).
3. **Đăng ký Inbound Adapters:** Đăng ký các NATS Inbound Handlers (được định nghĩa trong rdm-infrastructure) để chúng có thể lắng nghe và xử lý các yêu cầu NATS đến.

Mỗi service (command-service, query-service, worker) sẽ luôn bao gồm một **Health Module** và **Health Controller** để cung cấp endpoint kiểm tra sức khỏe, phục vụ cho mục đích giám sát và điều phối trên Kubernetes. Ngoài ra, mỗi service cũng sẽ có một **Dockerfile** để định nghĩa môi trường build và chạy ứng dụng trong container.

Vì các service này chủ yếu giao tiếp qua Message Broker (NATS/RabbitMQ) và không expose REST API cho mục đích nghiệp vụ thông thường, chúng ta sẽ loại bỏ app.controller.ts và app.controller.test.ts khỏi cấu trúc thư mục ví dụ, chỉ giữ lại Health Check Controller (sử dụng HTTP) cho mục đích vận hành.

Cấu trúc thư mục cho rdm-command-service và rdm-query-service có thể tương tự nhau, tập trung vào cấu hình ứng dụng và các thành phần chung:

```bash
├── apps/
│ ├── services/
│ │ └── rdm-command-service/      # Microservice xử lý Commands
│ │ │ ├── src/
│ │ │ │ ├── main.ts               # Điểm khởi chạy ứng dụng (Bootstrap NestJS app)
│ │ │ │ ├── app.module.ts         # Module gốc của NestJS app (DI container)
│ │ │ │ ├── health/               # Thư mục chứa Health Check Module và Controller
│ │ │ │ │ ├── health.controller.ts # Controller cho Health Check endpoint
│ │ │ │ │ ├── health.module.ts     # Module cho Health Check
│ │ │ │ │ ├── health.controller.test.ts # Unit tests cho Health Check controller (tên test case bên trong file viết tiếng Việt)
│ │ │ │ │ └── index.ts
│ │ │ │ └── index.ts
│ │ │ ├── Dockerfile              # Dockerfile cho service này
│ │ │ ├── project.json          # Nx project configuration
│ │ │ └── tsconfig.app.json     # TypeScript configuration cho ứng dụng
│ │ └── rdm-query-service/        # Microservice xử lý Queries
│ │ │ ├── src/
│ │ │ │ ├── main.ts               # Điểm khởi chạy ứng dụng
│ │ │ │ ├── app.module.ts         # Module gốc của NestJS app
│ │ │ │ ├── health/               # Thư mục chứa Health Check Module và Controller
│ │ │ │ │ ├── health.controller.ts # Controller cho Health Check endpoint
│ │ │ │ │ ├── health.module.ts     # Module cho Health Check
│ │ │ │ │ ├── health.controller.test.ts # Unit tests cho Health Check controller (tên test case bên trong file viết tiếng Việt)
│ │ │ │ │ └── index.ts
│ │ │ │ └── index.ts
│ │ │ ├── Dockerfile              # Dockerfile cho service này
│ │ │ ├── project.json          # Nx project configuration
│ │ │ └── tsconfig.app.json     # TypeScript configuration cho ứng dụng
```

**Giải thích:**

- **main.ts**: File chính để khởi động ứng dụng NestJS. Nó sẽ tạo NestJS application instance, kết nối với NATS (sử dụng microservices transport), và lắng nghe các incoming requests.
- **app.module.ts**: Module gốc của ứng dụng NestJS. Đây là nơi bạn import các module khác (ví dụ: module chứa các NATS inbound handlers từ rdm-infrastructure, module chứa các Use Cases từ rdm-application, module cấu hình database, module cấu hình NATS/RabbitMQ, và **HealthModule**). Module này đóng vai trò là container cho Dependency Injection, "wiring" các triển khai cụ thể (Infrastructure) vào các Interface (Application).
- **health/**: Thư mục chứa các file liên quan đến Health Check. Chi tiết về cấu trúc và nội dung của Health Check Module được mô tả trong mục **7.1. Ví dụ chi tiết Health Check Module**.
- **Dockerfile**: File này chứa các chỉ dẫn để đóng gói ứng dụng thành một Docker Image, bao gồm việc cài đặt dependencies, copy source code, và định nghĩa lệnh chạy ứng dụng. Chi tiết về cấu trúc và nội dung của Dockerfile được mô tả trong mục **7.2. Ví dụ chi tiết Dockerfile**.
- \*.test.ts (ở cấp độ này): Chủ yếu tập trung vào **End-to-End tests** (như đã mô tả ở Mục 3\) để kiểm tra toàn bộ luồng từ khi nhận NATS request đến khi xử lý xong Use Case và tương tác với Persistence/Message Broker. Unit tests cho Health Check controller cũng nằm ở đây. **Tên của các test case bên trong các file .test.ts ở đây nên được viết bằng tiếng Việt.**

Các service project này rất "mỏng" và chủ yếu tập trung vào việc cấu hình và kết nối các lớp bên dưới. Logic nghiệp vụ cốt lõi nằm ở rdm-domain và rdm-application, còn chi tiết kỹ thuật giao tiếp và lưu trữ nằm ở rdm-infrastructure. Việc có sẵn Health Check và Dockerfile là tiêu chuẩn cho môi trường triển khai containerized (như Kubernetes).

### **8.1. Ví dụ chi tiết Health Check Module**

Health Check Module cung cấp một endpoint HTTP đơn giản (thường là /health) để các hệ thống giám sát (như Kubernetes Liveness và Readiness Probes) có thể kiểm tra trạng thái hoạt động của service. Module này thường sử dụng các thư viện hỗ trợ health check (ví dụ: @nestjs/terminus trong NestJS) để kiểm tra các dependencies quan trọng như kết nối cơ sở dữ liệu, kết nối message broker (NATS, RabbitMQ), v.v.

Cấu trúc thư mục bên trong health/ như sau:

```bash
├── apps/
│ ├── services/
│ │ └── rdm-command-service/
│ │ │ ├── src/
│ │ │ │ ├── health/
│ │ │ │ │ ├── health.controller.ts     # Controller định nghĩa endpoint /health
│ │ │ │ │ ├── health.module.ts         # Module đóng gói Health Check
│ │ │ │ │ ├── health.controller.test.ts  # Unit tests cho Health Controller (tên test case bên trong file viết tiếng Việt)
│ │ │ │ │ └── index.ts                 # Export các thành phần từ health/
│ │ │ │ └── index.ts
│ │ │ └── ...
│ │ └── rdm-query-service/
│ │ │ ├── src/
│ │ │ │ ├── health/
│ │ │ │ │ ├── health.controller.ts     # Controller định nghĩa endpoint /health
│ │ │ │ │ ├── health.module.ts         # Module đóng gói Health Check
│ │ │ │ │ ├── health.controller.test.ts  # Unit tests cho Health Controller (tên test case bên trong file viết tiếng Việt)
│ │ │ │ │ └── index.ts                 # Export các thành phần từ health/
│ │ │ │ └── index.ts
│ │ │ └── ...
```

**Giải thích các file:**

- **health.controller.ts**:
  - Đây là NestJS Controller xử lý các request đến endpoint /health.
  - Nó sử dụng các Health Indicator (được cung cấp bởi thư viện health check) để kiểm tra trạng thái của các dependencies.
  - Endpoint này thường trả về trạng thái HTTP 200 OK nếu tất cả các kiểm tra đều thành công, và một trạng thái lỗi (ví dụ: HTTP 503 Service Unavailable) nếu có bất kỳ dependency nào không khỏe mạnh.
  - Nội dung response thường bao gồm chi tiết trạng thái của từng dependency.

// apps/services/rdm-command-service/src/health/health.controller.ts

```typescript
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HttpHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { NatsHealthIndicator } from './nats.health'; // Custom NATS Health Indicator
import { RabbitMqHealthIndicator } from './rabbitmq.health'; // Custom RabbitMQ Health Indicator

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private natsHealth: NatsHealthIndicator, // Inject custom NATS indicator
    private rabbitMqHealth: RabbitMqHealthIndicator, // Inject custom RabbitMQ indicator
  ) {}

  @Get()
  @HealthCheck()
  check() {
    // Kiểm tra trạng thái của các dependencies quan trọng
    return this.health.check(\[
      () \=\> this.http.pingCheck('basic\_check', 'https://google.com'), // Ví dụ kiểm tra HTTP đơn giản
      () \=\> this.db.pingCheck('database'), // Kiểm tra kết nối cơ sở dữ liệu (TypeORM)
      () \=\> this.natsHealth.isHealthy('nats'), // Kiểm tra kết nối NATS
      () \=\> this.rabbitMqHealth.isHealthy('rabbitmq'), // Kiểm tra kết nối RabbitMQ
      // Thêm các kiểm tra dependencies khác nếu cần
    \]);
  }
}

* **health.module.ts**:
  * Đây là NestJS Module để đóng gói Health Check Controller và các dependencies của nó (như HealthCheckService, HttpHealthIndicator, TypeOrmHealthIndicator, và các Health Indicator tùy chỉnh cho NATS, RabbitMQ).
  * Module này sẽ được import vào app.module.ts của service.

// apps/services/rdm-command-service/src/health/health.module.ts
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // Cần import module ORM nếu kiểm tra DB
import { NatsHealthIndicator } from './nats.health'; // Import custom NATS indicator
import { RabbitMqHealthIndicator } from './rabbitmq.health'; // Import custom RabbitMQ indicator
import { NatsClientModule } from '../nats-client/nats-client.module'; // Ví dụ: Module cung cấp NATS client
import { RabbitMqClientModule } from '../rabbitmq-client/rabbitmq-client.module'; // Ví dụ: Module cung cấp RabbitMQ client

@Module({
  imports: \[
    TerminusModule,
    TypeOrmModule.forRoot({ /\* Cấu hình DB \*/ }), // Cấu hình DB nếu kiểm tra DB
    NatsClientModule, // Import module NATS client để Health Indicator có thể sử dụng
    RabbitMqClientModule, // Import module RabbitMQ client để Health Indicator có thể sử dụng
  \],
  controllers: \[HealthController\],
  providers: \[NatsHealthIndicator, RabbitMqHealthIndicator\], // Cung cấp custom indicators
})
export class HealthModule {}
*(Lưu ý: NatsHealthIndicator và RabbitMqHealthIndicator là các lớp Health Indicator tùy chỉnh mà bạn sẽ cần triển khai dựa trên client NATS và RabbitMQ được sử dụng trong dự án. TypeOrmModule.forRoot chỉ là ví dụ, cấu hình thực tế sẽ phức tạp hơn và có thể được cung cấp qua ConfigModule.)*

* **health.controller.test.ts**:
  * File này chứa Unit Test cho HealthController.
  * Các test case sẽ kiểm tra xem controller có gọi đúng các phương thức kiểm tra sức khỏe từ HealthCheckService hay không và có trả về response với cấu trúc mong đợi hay không.
  * Các dependencies (như HealthCheckService, HttpHealthIndicator, v.v.) sẽ được mock trong các unit test này.

// apps/services/rdm-command-service/src/health/health.controller.test.ts
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthCheckService, HttpHealthIndicator, HealthCheckResult, HealthIndicatorResult } from '@nestjs/terminus';

// Mock các dependencies
const mockHealthCheckService \= {
  check: jest.fn(),
};

const mockHttpHealthIndicator \= {
  pingCheck: jest.fn(),
};

const mockTypeOrmHealthIndicator \= {
    pingCheck: jest.fn(),
};

const mockNatsHealthIndicator \= {
    isHealthy: jest.fn(),
};

const mockRabbitMqHealthIndicator \= {
    isHealthy: jest.fn(),
};

describe('Kiểm tra Health Controller', () \=\> { // Tên Describe bằng tiếng Việt
  let controller: HealthController;
  let healthCheckService: HealthCheckService;

  beforeEach(async () \=\> {
    const module: TestingModule \= await Test.createTestingModule({
      controllers: \[HealthController\],
      providers: \[
        {
          provide: HealthCheckService,
          useValue: mockHealthCheckService,
        },
        {
          provide: HttpHealthIndicator,
          useValue: mockHttpHealthIndicator,
        },
        {
            provide: TypeOrmHealthIndicator,
            useValue: mockTypeOrmHealthIndicator,
        },
        {
            provide: 'NatsHealthIndicator', // Tên provide cần khớp với cách inject
            useValue: mockNatsHealthIndicator,
        },
        {
            provide: 'RabbitMqHealthIndicator', // Tên provide cần khớp với cách inject
            useValue: mockRabbitMqHealthIndicator,
        },
      \],
    }).compile();

    controller \= module.get\<HealthController\>(HealthController);
    healthCheckService \= module.get\<HealthCheckService\>(HealthCheckService);
  });

  it('nên được định nghĩa', () \=\> { // Tên test case bằng tiếng Việt
    expect(controller).toBeDefined();
  });

  it('nên gọi healthCheckService.check với các indicators đúng', async () \=\> { // Tên test case bằng tiếng Việt
    const expectedResult: HealthCheckResult \= {
        status: 'ok',
        info: {
            basic\_check: { status: 'up' } as HealthIndicatorResult,
            database: { status: 'up' } as HealthIndicatorResult,
            nats: { status: 'up' } as HealthIndicatorResult,
            rabbitmq: { status: 'up' } as HealthIndicatorResult,
        },
        error: {},
        details: {
            basic\_check: { status: 'up' } as HealthIndicatorResult,
            database: { status: 'up' } as HealthIndicatorResult,
            nats: { status: 'up' } as HealthIndicatorResult,
            rabbitmq: { status: 'up' } as HealthIndicatorResult,
        },
    };

    mockHealthCheckService.check.mockResolvedValue(expectedResult);
    mockHttpHealthIndicator.pingCheck.mockResolvedValue({ basic\_check: { status: 'up' } });
    mockTypeOrmHealthIndicator.pingCheck.mockResolvedValue({ database: { status: 'up' } });
    mockNatsHealthIndicator.isHealthy.mockResolvedValue({ nats: { status: 'up' } });
    mockRabbitMqHealthIndicator.isHealthy.mockResolvedValue({ rabbitmq: { status: 'up' } });

    const result \= await controller.check();

    expect(healthCheckService.check).toHaveBeenCalled();
    expect(result).toEqual(expectedResult);

    expect(mockHttpHealthIndicator.pingCheck).toHaveBeenCalledWith('basic\_check', 'https://google.com');
    expect(mockTypeOrmHealthIndicator.pingCheck).toHaveBeenCalledWith('database');
    expect(mockNatsHealthIndicator.isHealthy).toHaveBeenCalledWith('nats');
    expect(mockRabbitMqHealthIndicator.isHealthy).toHaveBeenCalledWith('rabbitmq');
  });

  // Có thể thêm test case cho trường hợp một dependency bị lỗi
  it('nên trả về trạng thái không khả dụng nếu một dependency bị lỗi', async () \=\> { // Tên test case bằng tiếng Việt
        const errorResult: HealthCheckResult \= {
            status: 'error',
            info: {
                basic\_check: { status: 'up' } as HealthIndicatorResult,
                database: { status: 'down', message: 'DB connection failed' } as HealthIndicatorResult,
                nats: { status: 'up' } as HealthIndicatorResult,
                rabbitmq: { status: 'up' } as HealthIndicatorResult,
            },
            error: {
                 database: { status: 'down', message: 'DB connection failed' } as HealthIndicatorResult,
              },
            details: {
                basic\_check: { status: 'up' } as HealthIndicatorResult,
                database: { status: 'down', message: 'DB connection failed' } as HealthIndicatorResult,
                nats: { status: 'up' } as HealthIndicatorResult,
                rabbitmq: { status: 'up' } as HealthIndicatorResult,
            },
        };

        mockHealthCheckService.check.mockResolvedValue(errorResult);
        mockHttpHealthIndicator.pingCheck.mockResolvedValue({ basic\_check: { status: 'up' } });
        // Giả lập DB check thất bại
        mockTypeOrmHealthIndicator.pingCheck.mockRejectedValue(new Error('DB connection failed'));
        mockNatsHealthIndicator.isHealthy.mockResolvedValue({ nats: { status: 'up' } });
        mockRabbitMqHealthIndicator.isHealthy.mockResolvedValue({ rabbitmq: { status: 'up' } });

        try {
             await controller.check();
        } catch (error) {
             // NestJS HealthCheckService sẽ throw lỗi nếu status là 'error'
             expect(error).toEqual(errorResult); // Hoặc kiểm tra cấu trúc lỗi cụ thể
        }

         expect(healthCheckService.check).toHaveBeenCalled();
         expect(mockTypeOrmHealthIndicator.pingCheck).toHaveBeenCalledWith('database');
    });
});
```

### **8.2. Ví dụ chi tiết Dockerfile**

Mỗi service trong hệ thống Ecoma sẽ có một Dockerfile riêng để định nghĩa cách đóng gói ứng dụng vào một Docker Image. Chúng ta sử dụng multi-stage build để tối ưu kích thước image cuối cùng và sử dụng các base image "distroless" để tăng cường bảo mật bằng cách giảm thiểu các công cụ và thư viện không cần thiết.

Dưới đây là ví dụ Dockerfile cho rdm-command-service:

```dockerfile
# Stage 1: Tải xuống binary wget tĩnh (dùng cho mục đích debug hoặc health check)
# Sử dụng busybox làm base image tạm thời vì nó nhỏ gọn và chứa wget
FROM busybox AS wget
# Tải binary wget tĩnh. URL này có thể cần cập nhật tùy thuộc vào nguồn cung cấp binary.
ADD https://busybox.net/downloads/binaries/1.31.0-i686-uclibc/busybox\_WGET /wget
# Cấp quyền thực thi cho binary
RUN chmod a+x /wget

# Stage 2: Build ứng dụng Node.js
# Sử dụng image node:18-alpine làm môi trường build
FROM node:18-alpine3.21 AS builder
# Đặt thư mục làm việc bên trong container
WORKDIR /app
# Copy source code đã được build từ project Nx (thư mục dist)
# Đảm bảo rằng bước build Nx đã chạy trước khi build Docker image này
COPY dist/apps/services/rdm-command-service .
# Cài đặt các production dependencies
RUN yarn install \--production

# Stage 3: Image cuối cùng (distroless \- không bao gồm wget)
# Sử dụng image distroless chỉ chứa Node.js runtime
FROM gcr.io/distroless/nodejs22-debian12:nonroot AS distroless
# Đặt thư mục làm việc
WORKDIR /app
# Copy ứng dụng đã build từ stage 'builder' vào image cuối cùng
COPY \--from=builder /app /app
# Lệnh mặc định khi container khởi chạy
CMD \[ "main.js" \]

# Stage 4: Image cuối cùng (distroless \- bao gồm wget)
# Image này được sử dụng trong môi trường local (ví dụ: Docker Compose)
# để phục vụ cho Health Check probe hoặc mục đích debug cần wget.
FROM gcr.io/distroless/nodejs22-debian12:nonroot AS distroless-wget
# Đặt thư mục làm việc
WORKDIR /app
# Copy binary wget từ stage 'wget' vào thư mục /usr/bin
COPY \--from=wget /wget /usr/bin/wget
# Copy ứng dụng đã build từ stage 'builder'
COPY \--from=builder /app /app
# Lệnh mặc định khi container khởi chạy
CMD \[ "main.js" \]
```

**Giải thích:**

- **Multi-stage build:** Dockerfile này sử dụng nhiều FROM statement để định nghĩa các "stage" khác nhau. Mỗi stage có thể thực hiện một tác vụ cụ thể (ví dụ: tải binary, build code) và các stage sau có thể copy artifacts từ các stage trước. Điều này giúp giữ cho image cuối cùng nhỏ gọn bằng cách chỉ bao gồm những gì cần thiết để chạy ứng dụng, loại bỏ các công cụ build và source code không cần thiết.
- **Stage wget:** Stage này chỉ đơn giản là tải xuống một binary wget tĩnh. Binary này có thể hữu ích cho mục đích debug bên trong container (ví dụ: kiểm tra kết nối HTTP đến các dịch vụ khác) hoặc có thể được sử dụng bởi Health Check Probe nếu cần kiểm tra một endpoint HTTP bên ngoài service.
- **Stage builder:** Stage này sử dụng một image Node.js đầy đủ để cài đặt dependencies và chuẩn bị ứng dụng đã build.
- **Stage distroless và distroless-wget:** Đây là các stage tạo ra image cuối cùng. distroless là một loại image rất nhỏ gọn, chỉ chứa runtime cần thiết (Node.js trong trường hợp này) và các dependency hệ thống tối thiểu. Việc sử dụng distroless giúp giảm bề mặt tấn công của container.
  - **distroless:** Image này được sử dụng cho môi trường **production** (ví dụ: Kubernetes) nơi việc kiểm tra sức khỏe thường được thực hiện từ bên ngoài container và không yêu cầu các công cụ như wget bên trong image.
  - **distroless-wget:** Image này được sử dụng cho môi trường **local** (ví dụ: Docker Compose) nơi Health Check probe có thể cần gọi một endpoint HTTP bên trong container hoặc bạn cần các công cụ debug cơ bản như wget.
- **COPY dist/apps/services/rdm-command-service .**: Lệnh này giả định rằng bạn đã chạy lệnh build Nx (ví dụ: nx build rdm-command-service) trước khi chạy lệnh build Docker image. Output của quá trình build Nx cho service tương ứng sẽ nằm trong thư mục dist/apps/services/rdm-command-service.

Dockerfile này cần được đặt trong thư mục gốc của project service (ví dụ: apps/services/rdm-command-service/Dockerfile).

## **9\. Ví dụ triển khai End-to-End (E2E) Testing**

Các project E2E test nằm trong thư mục e2e/services/ hoặc e2e/workers/ và chịu trách nhiệm kiểm thử các luồng nghiệp vụ quan trọng bằng cách tương tác với các service đã triển khai trong môi trường tích hợp. E2E test mô phỏng hành vi của các hệ thống bên ngoài (ví dụ: một service khác gọi NATS request, hoặc một event được publish) và kiểm tra kết quả cuối cùng (ví dụ: dữ liệu trong database, event được publish đi).

Cấu trúc thư mục cho một project E2E test (ví dụ: rdm-command-service-e2e) có thể như sau:

```bash
├── e2e/
│ ├── services/
│ │ └── rdm-command-service-e2e/  # E2E project cho rdm-command-service
│ │ │ ├── src/
│ │ │ │ ├── e2e/
│ │ │ │ │ ├── reference-data-set.e2e-spec.ts # E2E test case cho các luồng quản lý Tập dữ liệu Tham chiếu
│ │ │ │ │ └── index.ts
│ │ │ │ └── index.ts
│ │ │ ├── jest.config.ts        # Cấu hình Jest cho E2E test
│ │ │ ├── project.json          # Nx project configuration
│ │ │ └── tsconfig.e2e.json     # TypeScript configuration cho E2E test
```

**Giải thích:**

- **src/e2e/**: Thư mục chứa các file E2E test. Mỗi file thường tập trung vào kiểm thử một hoặc một nhóm các luồng nghiệp vụ liên quan.
- **\*.e2e-spec.ts**: Các file chứa định nghĩa các E2E test case. Tên file thường phản ánh luồng nghiệp vụ được kiểm thử (ví dụ: reference-data-set.e2e-spec.ts kiểm thử các luồng quản lý tập dữ liệu tham chiếu).
- **jest.config.ts**: Cấu hình cho Jest, framework testing được sử dụng.
- **project.json**: Cấu hình project Nx, định nghĩa cách build và chạy E2E test.
- **tsconfig.e2e.json**: Cấu hình TypeScript cho E2E test.

**Ví dụ mã nguồn E2E Test Case (reference-data-set.e2e-spec.ts):**

Dưới đây là ví dụ về file E2E test cho các luồng quản lý tập dữ liệu tham chiếu, sử dụng cấu trúc bạn cung cấp và thêm các test case RDM cụ thể.

// e2e/services/rdm-command-service-e2e/src/e2e/reference-data-set.e2e-spec.ts

```typescript
import {
  MongoDBContainer,
  NatsContainer,
  RabbitMQContainer,
  StartedMongoDBContainer,
  StartedNatsContainer,
  StartedRabbitMQContainer,
} from "@ecoma/testing-containers"; // Giả định các testing containers được định nghĩa ở đây
import { TestLogger } from "@ecoma/testing-utils"; // Giả định TestLogger được định nghĩa ở đây
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

import { Db, MongoClient } from "mongodb"; // Sử dụng MongoClient để kiểm tra DB trực tiếp (trong môi trường test)
import { GenericContainer, StartedTestContainer } from "testcontainers"; // Sử dụng testcontainers để chạy service dưới dạng container
import { v4 as uuidv4 } from 'uuid'; // Thư viện tạo UUID

// Import các Command/Query DTO và Domain Events từ các libs RDM
// Các path import này là giả định, cần điều chỉnh cho phù hợp với cấu trúc thực tế
import {
  CreateReferenceDataSetCommand,
  UpdateReferenceDataSetCommand,
  DeleteReferenceDataSetCommand,
  GetReferenceDataSetByIdQuery,
  AddReferenceDataItemCommand,
  UpdateReferenceDataItemCommand,
  DeleteReferenceDataItemCommand,
} from '@ecoma/rdm-application';
import {
  ReferenceDataSetCreatedEvent,
  ReferenceDataSetUpdatedEvent,
  ReferenceDataSetRemovedEvent,
  ReferenceDataItemAddedEvent,
  ReferenceDataItemUpdatedEvent,
  ReferenceDataItemRemovedEvent,
} from '@ecoma/rdm-domain'; // Import Domain Events nếu cần kiểm tra

describe("Luồng E2E: Quản lý Tập dữ liệu Tham chiếu", () \=\> { // Tên Describe bằng tiếng Việt
  let natsContainer: StartedNatsContainer;
  // Đổi tên container service test thành rdmServiceContainer
  let rdmServiceContainer: StartedTestContainer;
  let client: ClientProxy; // Client để gửi Command/Query qua NATS
  let rabbitMQContainer: StartedRabbitMQContainer;
  let mongodbContainer: StartedMongoDBContainer;
  let mongoClient: MongoClient;
  let db: Db; // Client để kiểm tra trạng thái DB trực tiếp

  // Thời gian timeout cho beforeAll/afterAll để khởi động/dọn dẹp container
  const setupTimeout \= 120\_000; // 120 giây

  beforeAll(async () \=\> {
    TestLogger.divider("SETUP E2E TEST ENVIRONMENT");

    try {
      TestLogger.log("Khởi động các containers hạ tầng...");
      // Khởi động NATS, RabbitMQ, MongoDB containers
      \[natsContainer, rabbitMQContainer, mongodbContainer\] \= await Promise.all(\[
        new NatsContainer().start(),
        new RabbitMQContainer().start(),
        new MongoDBContainer().start(),
      \]);
      TestLogger.log("Các containers hạ tầng đã khởi động.");
    } catch (err) {
      TestLogger.error("Lỗi trong quá trình khởi động hạ tầng containers", err);
      throw err;
    }

    try {
      TestLogger.log("Kết nối đến MongoDB...");
      // Kết nối đến MongoDB để có thể kiểm tra trạng thái DB trực tiếp trong test
      mongoClient \= new MongoClient(mongodbContainer.getConnectionString());
      await mongoClient.connect();
      db \= mongoClient.db("rdm-service"); // Tên DB của RDM service
      TestLogger.log("Đã kết nối đến MongoDB.");
    } catch (err) {
      TestLogger.error("Lỗi trong quá trình kết nối MongoDB", err);
      throw err;
    }

    try {
      TestLogger.log("Khởi động RDM Service container...");
      // Khởi động RDM Service container
      // Sử dụng image của RDM service, truyền các biến môi trường cần thiết
      rdmServiceContainer \= await new GenericContainer('ecoma/rdm-service') // Tên image RDM service
        .withEnvironment({
          "NATS\_SERVERS": natsContainer.getConnectionServer(),
          "MONGODB\_URI": mongodbContainer.getConnectionString(),
          "RABBITMQ\_SERVERS": rabbitMQContainer.getAmqpUrl(),
          // Thêm các biến môi trường khác nếu service cần (ví dụ: log level, feature flags)
        })
        // Expose port HTTP của Health Check nếu cần kiểm tra Health Check từ bên ngoài
        .withExposedPorts(3000) // Giả định Health Check chạy trên port 3000
        // Log consumer để xem log của service container trong quá trình test
        .withLogConsumer((stream) \=\> {
          stream.on("data", (line) \=\>
            TestLogger.log(\`\[RDM Service Log\]: ${line.toString().trim()}\`)
          );
        })
        // Chờ cho service sẵn sàng (ví dụ: chờ Health Check endpoint trả về 200 OK)
        // Hoặc chờ log "Nest application successfully started"
        .waitingFor(async (container: StartedTestContainer) \=\> {
             // Kiểm tra Health Check endpoint
             const healthCheckPort \= container.getMappedPort(3000); // Lấy port đã map
             const healthCheckUrl \= \`http://${container.getHost()}:${healthCheckPort}/health\`; // Endpoint Health Check
             TestLogger.log(\`Kiểm tra Health Check tại: ${healthCheckUrl}\`);
             try {
                 const response \= await fetch(healthCheckUrl);
                 if (response.ok) {
                     TestLogger.log("Health Check thành công.");
                     return true; // Service sẵn sàng
                 } else {
                     const status \= response.status;
                     const body \= await response.text();
                     TestLogger.log(\`Health Check trả về trạng thái lỗi ${status}: ${body}\`);
                     return false; // Service chưa sẵn sàng
                 }
             } catch (e) {
                 TestLogger.log(\`Lỗi khi gọi Health Check: ${e}\`);
                 return false; // Service chưa sẵn sàng
             }
        })
        .start();
      TestLogger.log("RDM Service container đã khởi động.");
    } catch (err) {
      TestLogger.error("Lỗi khi khởi động RDM Service container", err);
      throw err;
    }

    try {
      TestLogger.log("Kết nối đến Broker (NATS)...");
      // Tạo NATS client để gửi Command/Query đến RDM service
      client \= ClientProxyFactory.create({
        transport: Transport.NATS,
        options: {
          servers: \[natsContainer.getConnectionServer()\],
          // Thêm các tùy chọn kết nối khác nếu cần
        },
      });
      await client.connect(); // Chờ kết nối NATS
      TestLogger.log("Đã kết nối đến Broker.");
    } catch (err) {
      TestLogger.error("Lỗi khi kết nối Broker", err);
      throw err;
    }
  }, setupTimeout); // Tăng timeout cho beforeAll

  afterAll(async () \=\> {
    TestLogger.divider("TEARDOWN E2E TEST ENVIRONMENT");
    TestLogger.log("Dọn dẹp môi trường...");
    try {
      if (client) {
        TestLogger.log("Đóng client Broker...");
        await client.close();
      }

      if (rdmServiceContainer) {
        TestLogger.log("Dừng RDM Service Container...");
        await rdmServiceContainer.stop();
      }

      if (natsContainer) {
        TestLogger.log("Dừng NatsContainer...");
        await natsContainer.stop();
      }

      if (rabbitMQContainer) {
        TestLogger.log("Dừng RabbitMQContainer...");
        await rabbitMQContainer.stop();
      }

      if (mongodbContainer) {
        TestLogger.log("Đóng kết nối MongoDB và dừng container...");
        if (mongoClient) {
             await mongoClient.close();
        }
        await mongodbContainer.stop();
      }
    } catch (err) {
      TestLogger.error("Lỗi trong quá trình dọn dẹp", err);
    }
    TestLogger.log("Dọn dẹp hoàn tất.");
  });

  // \--- Các Test Case E2E cho RDM \---

  let createdDataSetId: string; // Biến lưu ID của tập dữ liệu được tạo ra để dùng trong các test case sau
  const initialDataSet \= { // Dữ liệu ban đầu cho tập dữ liệu
      id: uuidv4(),
      name: 'Loại Tiền Tệ',
      code: 'CURRENCIES',
      description: 'Danh sách các loại tiền tệ được hỗ trợ',
      // Thêm các thuộc tính khác nếu có trong Command DTO
  };

  it("nên tạo thành công một tập dữ liệu tham chiếu mới khi gửi Command hợp lệ", async () \=\> {
    TestLogger.divider("CASE: Tạo tập dữ liệu tham chiếu thành công");
    const command: CreateReferenceDataSetCommand \= initialDataSet;

    // Gửi Command CreateReferenceDataSetCommand qua NATS
    // Subject NATS: rdm.command.create\_reference\_data\_set (ví dụ)
    const response \= await firstValueFrom(
      client.send('rdm.command.create\_reference\_data\_set', command)
    );

    // Kiểm tra Response từ service (thường là ID của aggregate root)
    expect(response).toBeDefined();
    expect(response.id).toBe(command.id);

    // Lưu lại ID để sử dụng trong các test case tiếp theo
    createdDataSetId \= response.id;

    // Tùy chọn: Kiểm tra trạng thái trong DB trực tiếp (chỉ trong môi trường test)
    // const createdDataSet \= await db.collection('reference\_data\_sets').findOne({ \_id: createdDataSetId });
    // expect(createdDataSet).toBeDefined();
    // expect(createdDataSet.name).toBe(command.name);
    // expect(createdDataSet.code).toBe(command.code);

    // Tùy chọn: Kiểm tra Domain Event đã được publish (nếu có listener trong test setup)
    // expect(eventPublishedForCreate).toBe(true);
    // expect(publishedEventForCreate.type).toBe(ReferenceDataSetCreatedEvent.name);
    // expect(publishedEventForCreate.payload.id).toBe(createdDataSetId);
  });

  it("nên lấy thông tin tập dữ liệu tham chiếu theo ID sau khi tạo thành công", async () \=\> {
      TestLogger.divider("CASE: Lấy thông tin tập dữ liệu tham chiếu theo ID");
      // Sử dụng ID đã tạo ở test case trước
      const query: GetReferenceDataSetByIdQuery \= { id: createdDataSetId };

      // Gửi Query GetReferenceDataSetByIdQuery qua NATS
      // Subject NATS: rdm.query.get\_reference\_data\_set\_by\_id (ví dụ)
      const response \= await firstValueFrom(
          client.send('rdm.query.get\_reference\_data\_set\_by\_id', query)
      );

      // Kiểm tra Response: thông tin chi tiết của tập dữ liệu
      expect(response).toBeDefined();
      expect(response.id).toBe(createdDataSetId);
      expect(response.name).toBe(initialDataSet.name);
      expect(response.code).toBe(initialDataSet.code);
      // Kiểm tra các thuộc tính khác
  });

  it("nên cập nhật thành công một tập dữ liệu tham chiếu hiện có", async () \=\> {
      TestLogger.divider("CASE: Cập nhật tập dữ liệu tham chiếu thành công");
      const updatedName \= 'Loại Tiền Tệ (Cập nhật)';
      const command: UpdateReferenceDataSetCommand \= {
          id: createdDataSetId, // Sử dụng ID đã tạo
          name: updatedName,
          description: 'Mô tả đã cập nhật',
          // Chỉ bao gồm các trường cần cập nhật
      };

      // Gửi Command UpdateReferenceDataSetCommand qua NATS
      // Subject NATS: rdm.command.update\_reference\_data\_set (ví dụ)
      const response \= await firstValueFrom(
          client.send('rdm.command.update\_reference\_data\_set', command)
      );

      // Kiểm tra Response (thường là xác nhận thành công hoặc trả về ID)
      expect(response).toBeDefined();
      expect(response.id).toBe(createdDataSetId); // Giả định trả về ID

      // Tùy chọn: Kiểm tra trạng thái trong DB trực tiếp
      // const updatedDataSet \= await db.collection('reference\_data\_sets').findOne({ \_id: createdDataSetId });
      // expect(updatedDataSet.name).toBe(updatedName);

      // Tùy chọn: Kiểm tra Domain Event đã được publish
      // expect(eventPublishedForUpdate).toBe(true);
      // expect(publishedEventForUpdate.type).toBe(ReferenceDataSetUpdatedEvent.name);
      // expect(publishedEventForUpdate.payload.id).toBe(createdDataSetId);
  });

   it("nên thêm một item vào tập dữ liệu tham chiếu", async () \=\> {
        TestLogger.divider("CASE: Thêm item vào tập dữ liệu tham chiếu");
        const newItem \= {
            id: uuidv4(),
            key: 'USD',
            value: 'United States Dollar',
            metadata: { symbol: '$' },
            // Thêm các thuộc tính khác của Item
        };
        const command: AddReferenceDataItemCommand \= {
            referenceDataSetId: createdDataSetId, // ID của tập dữ liệu cha
            item: newItem,
        };

        // Gửi Command AddReferenceDataItemCommand qua NATS
        // Subject NATS: rdm.command.add\_reference\_data\_item (ví dụ)
        const response \= await firstValueFrom(
            client.send('rdm.command.add\_reference\_data\_item', command)
        );

        // Kiểm tra Response (thường là xác nhận thành công hoặc trả về ID của item)
        expect(response).toBeDefined();
        expect(response.id).toBe(newItem.id); // Giả định trả về ID item

        // Tùy chọn: Kiểm tra trạng thái trong DB trực tiếp
        // const dataSetWithItem \= await db.collection('reference\_data\_sets').findOne({ \_id: createdDataSetId });
        // expect(dataSetWithItem.items).toHaveLength(1);
        // expect(dataSetWithItem.items\[0\].key).toBe(newItem.key);

        // Tùy chọn: Kiểm tra Domain Event đã được publish
        // expect(eventPublishedForAddItem).toBe(true);
        // expect(publishedEventForAddItem.type).toBe(ReferenceDataItemAddedEvent.name);
        // expect(publishedEventForAddItem.payload.referenceDataSetId).toBe(createdDataSetId);
        // expect(publishedEventForAddItem.payload.item.id).toBe(newItem.id);
    });

    it("nên lấy tập dữ liệu để xác minh item đã được thêm", async () \=\> {
        TestLogger.divider("CASE: Lấy tập dữ liệu và xác minh item");
        const query: GetReferenceDataSetByIdQuery \= { id: createdDataSetId };

        const response \= await firstValueFrom(
            client.send('rdm.query.get\_reference\_data\_set\_by\_id', query)
        );

        expect(response).toBeDefined();
        expect(response.id).toBe(createdDataSetId);
        // Kiểm tra xem danh sách items có chứa item vừa thêm không
        expect(response.items).toBeDefined();
        expect(response.items.length).toBeGreaterThan(0);
        const addedItem \= response.items.find((item: any) \=\> item.key \=== 'USD');
        expect(addedItem).toBeDefined();
        expect(addedItem.value).toBe('United States Dollar');
        // Kiểm tra các thuộc tính khác của item
    });

    it("nên xóa một item khỏi tập dữ liệu", async () \=\> {
        TestLogger.divider("CASE: Xóa item khỏi tập dữ liệu");
        // Giả định bạn biết ID của item cần xóa (lấy từ test case thêm item hoặc DB)
        // Trong thực tế, bạn có thể cần lấy lại tập dữ liệu để lấy ID item nếu không lưu trữ
        const itemIdToDelete \= 'USD'; // Giả định key 'USD' là duy nhất hoặc bạn dùng ID thực tế

        const command: DeleteReferenceDataItemCommand \= {
            referenceDataSetId: createdDataSetId, // ID của tập dữ liệu cha
            itemId: itemIdToDelete, // ID hoặc Key của item cần xóa
        };

         // Gửi Command DeleteReferenceDataItemCommand qua NATS
         // Subject NATS: rdm.command.delete\_reference\_data\_item (ví dụ)
        const response \= await firstValueFrom(
            client.send('rdm.command.delete\_reference\_data\_item', command)
        );

        // Kiểm tra Response (thường là xác nhận thành công)
        expect(response).toBeDefined(); // Giả định response không rỗng khi thành công
        // Có thể kiểm tra response cụ thể hơn nếu service trả về

        // Tùy chọn: Kiểm tra trạng thái trong DB trực tiếp
        // const dataSetAfterDelete \= await db.collection('reference\_data\_sets').findOne({ \_id: createdDataSetId });
        // expect(dataSetAfterDelete.items.find((item: any) \=\> item.key \=== itemIdToDelete)).toBeUndefined();

        // Tùy chọn: Kiểm tra Domain Event đã được publish
        // expect(eventPublishedForDeleteItem).toBe(true);
        // expect(publishedEventForDeleteItem.type).toBe(ReferenceDataItemRemovedEvent.name);
        // expect(publishedEventForDeleteItem.payload.referenceDataSetId).toBe(createdDataSetId);
        // expect(publishedEventForDeleteItem.payload.itemId).toBe(itemIdToDelete);
    });

  it("nên xóa thành công một tập dữ liệu tham chiếu", async () \=\> {
      TestLogger.divider("CASE: Xóa tập dữ liệu tham chiếu thành công");
      const command: DeleteReferenceDataSetCommand \= {
          id: createdDataSetId, // Sử dụng ID đã tạo
      };

      // Gửi Command DeleteReferenceDataSetCommand qua NATS
      // Subject NATS: rdm.command.delete\_reference\_data\_set (ví dụ)
      const response \= await firstValueFrom(
          client.send('rdm.command.delete\_reference\_data\_set', command)
      );

      // Kiểm tra Response (thường là xác nhận thành công)
      expect(response).toBeDefined(); // Giả định response không rỗng khi thành công
      // Có thể kiểm tra response cụ thể hơn nếu service trả về

      // Tùy chọn: Kiểm tra trạng thái trong DB trực tiếp
      // const deletedDataSet \= await db.collection('reference\_data\_sets').findOne({ \_id: createdDataSetId });
      // expect(deletedDataSet).toBeNull(); // Hoặc kiểm tra cờ isDeleted

      // Tùy chọn: Kiểm tra Domain Event đã được publish
      // expect(eventPublishedForDelete).toBe(true);
      // expect(publishedEventForDelete.type).toBe(ReferenceDataSetRemovedEvent.name);
      // expect(publishedEventForDelete.payload.id).toBe(createdDataSetId);
  });

   it("nên trả về lỗi khi cố gắng lấy tập dữ liệu đã bị xóa", async () \=\> {
        TestLogger.divider("CASE: Lấy tập dữ liệu đã xóa (mong đợi lỗi)");
        const query: GetReferenceDataSetByIdQuery \= { id: createdDataSetId }; // Sử dụng ID đã xóa

        try {
            // Gửi Query GetReferenceDataSetByIdQuery qua NATS
            await firstValueFrom(
                client.send('rdm.query.get\_reference\_data\_set\_by\_id', query)
            );
            // Nếu không throw lỗi, test fail
            fail('Nên throw lỗi khi lấy tập dữ liệu đã bị xóa');
        } catch (error: any) {
            // Kiểm tra loại lỗi và thông báo lỗi mong đợi
            expect(error).toBeDefined();
            // Giả định service trả về lỗi có cấu trúc với code và message
            expect(error.code).toBe('NOT\_FOUND'); // Giả định mã lỗi NOT\_FOUND
            expect(error.message).toContain(\`Tập dữ liệu tham chiếu với ID ${createdDataSetId} không tìm thấy\`); // Giả định thông báo lỗi
        }
    });

  // Thêm các test case khác cho các kịch bản lỗi (ví dụ: Command không hợp lệ, trùng code,...)
  it('nên trả về lỗi nếu cố gắng tạo tập dữ liệu với code đã tồn tại', async () \=\> {
      TestLogger.divider("CASE: Tạo tập dữ liệu trùng code (mong đợi lỗi)");
      // Tạo lại tập dữ liệu với code đã sử dụng trước đó (CURRENCIES)
      const command: CreateReferenceDataSetCommand \= {
          id: uuidv4(), // ID mới
          name: 'Loại Tiền Tệ Khác',
          code: 'CURRENCIES', // Code đã tồn tại
          description: 'Một tập dữ liệu khác',
      };

      try {
          // Gửi Command qua NATS
          await firstValueFrom(
              client.send('rdm.command.create\_reference\_data\_set', command)
          );
          // Nếu không throw lỗi, test fail
          fail('Nên throw lỗi khi tạo tập dữ liệu trùng code');
      } catch (error: any) {
          // Kiểm tra loại lỗi và thông báo lỗi mong đợi
          expect(error).toBeDefined();
          // Giả định service trả về lỗi có cấu trúc với code và message
          expect(error.code).toBe('DUPLICATE\_CODE'); // Giả định mã lỗi DUPLICATE\_CODE
          expect(error.message).toContain('Code CURRENCIES đã tồn tại'); // Giả định thông báo lỗi
      }
  });

});

// Helper function ví dụ để lấy dữ liệu trực tiếp từ DB (chỉ dùng trong E2E test environment)
// async function getReferenceDataSetFromDb(id: string): Promise\<any\> {
//   // Sử dụng TypeORM client hoặc client CSDL trực tiếp để truy vấn DB
//   // Lưu ý: Việc này chỉ khả thi trong môi trường E2E test có quyền truy cập trực tiếp vào DB
//   // Trong môi trường production, bạn sẽ kiểm tra thông qua Query service
//   return null; // Placeholder
// }
```

## **10\. Kết luận**

Việc áp dụng Clean Architecture kết hợp với các design patterns như CQRS, Repository, Specification, Process Manager/Saga, Domain Events, Value Objects, Anti-Corruption Layer và phân biệt rõ Domain Services/Application Services trong môi trường Nx monorepo cung cấp một nền tảng vững chắc để xây dựng các service có khả năng mở rộng, bảo trì cao và dễ kiểm thử trong hệ thống Ecoma. Đặc biệt, sự kết hợp này hỗ trợ mạnh mẽ cho phương pháp thiết kế Domain-Driven Design mà Ecoma đang áp dụng và cho phép triển khai linh hoạt một Bounded Context thành nhiều service/worker.

Tài liệu này cung cấp cái nhìn tổng quan và ví dụ về cách tích hợp các khái niệm này, cùng với chiến lược testing tập trung vào **Unit Test và E2E Test**. Khi triển khai thực tế, cần xem xét chi tiết hơn về việc lựa chọn framework/thư viện cụ thể (ví dụ: NestJS cho CQRS và Dependency Injection, TypeORM cho ORM, thư viện Saga, NATS client, RabbitMQ client), và chiến lược xử lý lỗi, bù trừ trong Saga.

Việc tuân thủ các nguyên tắc và cấu trúc được mô tả trong tài liệu này sẽ giúp đội ngũ phát triển làm việc hiệu quả và nhất quán trên toàn bộ hệ thống.
