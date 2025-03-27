# **Phân rã nghiệp vụ thành mã nguồn**

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

# 4. Quy định chung khi triển khai

- Tất cả source code phải có JsDoc đầy đủ. JSDoc phải viết bằng ngôn ngữ tiếng việt
- Tên toàn bộ các test case phải viết bằng tiếng việt
- Những gì còn lại phải được viết bằng tiếng anh
- Tổ chức project thành các thư mục con thì mỗi thư mục con phải có file index. khi import thì import từ thư mục

# 5. Triển khai lớp domain

Lớp Domain là trái tim của mỗi Bounded Context (BC), chứa đựng toàn bộ logic nghiệp vụ cốt lõi, các quy tắc, và ngôn ngữ chung của miền đó. Lớp này phải hoàn toàn độc lập với các chi tiết về cơ sở hạ tầng (framework, cơ sở dữ liệu, UI), đảm bảo tính thuần khiết của nghiệp vụ và khả năng tái sử dụng cao.

Trong Ecoma, các khái niệm của lớp domain được triển khai chủ yếu trong hai loại thư viện cho mỗi Bounded Context (ví dụ: RDM - Reference Data Management):

- **`<bc-name>-domain`** (ví dụ `libs/domains/rdm/rdm-domain/`): Chứa các Aggregates, Entities, Value Objects, và Domain Services.
- **`<bc-name>-events`** (ví dụ `libs/domains/rdm/rdm-events/`): Chứa định nghĩa của các Domain Events được phát ra bởi Bounded Context đó.

Mục này sẽ hướng dẫn chi tiết cách cấu trúc và triển khai cả hai loại thư viện này.

## **5.1. Cấu trúc thư mục mẫu**

Dưới đây là cấu trúc thư mục gợi ý. Tùy thuộc vào độ phức tạp của từng BC, một số thư mục con có thể không cần thiết.

### **5.1.1. Cấu trúc thư mục cho `<bc-name>-domain`**

Thư viện này chứa các thành phần cốt lõi của logic nghiệp vụ, trừ các Domain Events.

```bash
├── libs/
│ ├── domains/
│ │ └── <bc-name>/                   # Ví dụ: rdm
│ │ │ ├── <bc-name>-domain/          # Ví dụ: rdm-domain
│ │ │ │ ├── src/
│ │ │ │ │ ├── lib/
│ │ │ │ │ │ ├── aggregates/             # Chứa các Aggregate Root
│ │ │ │ │ │ │ ├── <aggregate-root-name>/  # Ví dụ: reference-data-set
│ │ │ │ │ │ │ │ ├── <aggregate-root-name>.aggregate.ts
│ │ │ │ │ │ │ │ ├── <aggregate-root-name>.aggregate.test.ts
│ │ │ │ │ │ │ │ # └── <aggregate-root-name>.errors.ts (Lỗi đặc thù của Aggregate có thể định nghĩa ở đây hoặc trong thư mục errors/ chung)
│ │ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ ├── entities/                 # Chứa các Entity không phải Aggregate Root (nếu có)
│ │ │ │ │ │ │ ├── <entity-name>/          # Ví dụ: reference-data-item
│ │ │ │ │ │ │ │ ├── <entity-name>.entity.ts
│ │ │ │ │ │ │ │ ├── <entity-name>.entity.test.ts
│ │ │ │ │ │ │ │ # └── <entity-name>.errors.ts (Lỗi đặc thù của Entity có thể định nghĩa ở đây hoặc trong thư mục errors/ chung)
│ │ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ ├── value-objects/            # Chứa các Value Object
│ │ │ │ │ │ │ ├── <value-object-name>/    # Ví dụ: reference-data-set-code
│ │ │ │ │ │ │ │ ├── <value-object-name>.vo.ts
│ │ │ │ │ │ │ │ ├── <value-object-name>.vo.test.ts
│ │ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ ├── domain-services/          # Chứa các Domain Service (nếu cần)
│ │ │ │ │ │ │ ├── <service-name>.service.ts
│ │ │ │ │ │ │ ├── <service-name>.service.test.ts
│ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ ├── ports/                    # Ports: Định nghĩa các interface (ports) mà domain cần
│ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ ├── errors/                   # Chứa các định nghĩa lỗi nghiệp vụ của domain
│ │ │ │ │ │ │ ├── <error-name-1>.error.ts # Ví dụ: reference-data-set-not-found.error.ts
│ │ │ │ │ │ │ ├── <error-name-2>.error.ts # Ví dụ: invalid-item-value.error.ts
│ │ │ │ │ │ │ └── index.ts
│ │ │ │ │ │ └── index.ts                # Export tất cả các thành phần từ lib
│ │ │ │ └── index.ts                    # Export tất cả các thành phần từ src/lib
│ │ │ ├── package.json
│ │ │ ├── project.json                # Cấu hình Nx cho thư viện
│ │ │ ├── tsconfig.lib.json           # Cấu hình TypeScript cho code thư viện
│ │ │ ├── tsconfig.spec.json          # Cấu hình TypeScript cho unit test
│ │ │ └── jest.config.ts              # Cấu hình Jest
```

### **5.1.2. Cấu trúc thư mục cho `<bc-name>-events`**

Thư viện này chuyên chứa các định nghĩa Domain Event của Bounded Context.

```bash
├── libs/
│ ├── domains/
│ │ └── <bc-name>/                   # Ví dụ: rdm
│ │ │ ├── <bc-name>-events/          # Ví dụ: rdm-events
│ │ │ │ ├── src/
│ │ │ │ │ ├── lib/
│ │ │ │ │ │ ├── <event-name-1>.event.ts
│ │ │ │ │ │ ├── <event-name-1>.event.test.ts
│ │ │ │ │ │ ├── <event-name-2>.event.ts
│ │ │ │ │ │ ├── <event-name-2>.event.test.ts
│ │ │ │ │ │ ├── ... (các events khác)
│ │ │ │ │ │ └── index.ts                # Export tất cả các events
│ │ │ │ └── index.ts                    # Export tất cả các thành phần từ src/lib
│ │ │ ├── package.json
│ │ │ ├── project.json                # Cấu hình Nx cho thư viện
│ │ │ ├── tsconfig.lib.json           # Cấu hình TypeScript cho code thư viện
│ │ │ ├── tsconfig.spec.json          # Cấu hình TypeScript cho unit test
│ │ │ └── jest.config.ts              # Cấu hình Jest
```

## **5.2. Giải thích các thành phần và sử dụng thư viện `common`**

Mục tiêu là tận dụng tối đa các thư viện `common` (như `common-domain`, `common-types`, `common-utils`) để tránh lặp code và đảm bảo tính nhất quán.

### **5.2.1. Aggregates (`<aggregate-root-name>.aggregate.ts`)**

- **Mục đích:** Là một cụm các entities và value objects liên quan, được xem như một đơn vị nhất quán cho việc thay đổi dữ liệu. Aggregate Root là entity chính của aggregate, là điểm truy cập duy nhất từ bên ngoài.
- **Triển khai:**
  - Kế thừa lớp `AbstractAggregate` từ `libs/common/common-domain` (ví dụ: `export abstract class AbstractAggregate<TId extends AbstractId> extends AbstractEntity<TId>`). Lớp `AbstractAggregate` này cung cấp sẵn:
    - Cơ chế quản lý Domain Events (ví dụ: `addDomainEvent(event: AbstractDomainEvent)`, `getDomainEvents(): AbstractDomainEvent[]`, `clearDomainEvents()`).
    - ID và các thuộc tính cơ bản (thông qua kế thừa từ `AbstractEntity`).
  - Chứa các phương thức thực thi hành vi nghiệp vụ, đảm bảo các quy tắc bất biến (invariants) của aggregate luôn được duy trì.
  - Các phương thức này nên trả về `void` nếu thành công (và phát ra event thông qua `addDomainEvent()`) hoặc ném ra các lỗi nghiệp vụ cụ thể (định nghĩa trong `<aggregate-root-name>.errors.ts`).
- **Sử dụng thư viện `common`:**
  - `common-domain`: Kế thừa `AbstractAggregate`.
  - `common-types`: Sử dụng `Nullable<T>`, `Maybe<T>`, hoặc các kiểu tiện ích khác như `XOR<T, U>`, `ExtractFromUnion<T, U>` khi cần. Hãy tìm kiếm các utility types trong `common-types` trước khi tự định nghĩa.
  - `common-utils`: Sử dụng các hàm tiện ích nếu cần (ví dụ: cho validation đơn giản).
- **Unit Test (`<aggregate-root-name>.aggregate.test.ts`):**
  - **Khởi tạo:** Kiểm tra aggregate được tạo đúng trạng thái với dữ liệu hợp lệ và ném lỗi với dữ liệu không hợp lệ.
  - **Hành vi nghiệp vụ:** Với mỗi phương thức nghiệp vụ:
    - Trạng thái của aggregate thay đổi chính xác.
    - Phát ra đúng các Domain Event với payload chính xác (sử dụng `getDomainEvents()`).
    - Ném đúng các lỗi nghiệp vụ (`<aggregate-root-name>.errors.ts`) khi quy tắc bị vi phạm.
  - **Quy tắc bất biến:** Đảm bảo các quy tắc luôn được duy trì sau mỗi hành động.
  - **Sử dụng `common-testing`:** Sử dụng các helper từ `common-testing` như:
    - `EventTestingHelper.expectEventPublished()` để kiểm tra event đã được phát đúng.
    - `AssertionHelpers.expectToContainAllProperties()` để so sánh properties.
    - `MockFactory` để tạo mock các dependency nếu cần.

### **5.2.2. Entities (`<entity-name>.entity.ts`)**

- **Mục đích:** Các đối tượng có định danh riêng và vòng đời, nhưng không phải là Aggregate Root. Chúng thường là một phần của một Aggregate.
- **Triển khai:**
  - Kế thừa lớp `AbstractEntity` từ `libs/common/common-domain` (ví dụ: `export abstract class AbstractEntity<TId extends AbstractId>`). Lớp này cung cấp:
    - Thuộc tính `id` để quản lý định danh.
    - Phương thức `equals()` để so sánh identity giữa các entities.
  - Chứa logic nghiệp vụ liên quan đến chính nó.
- **Sử dụng thư viện `common`:**
  - `common-domain`: Kế thừa `AbstractEntity`.
  - `common-domain`: Sử dụng `AbstractId` hoặc các triển khai cụ thể của nó (ví dụ: `UuidId`) cho thuộc tính `id`.
- **Unit Test (`<entity-name>.entity.test.ts`):**
  - Tương tự như Aggregate, tập trung vào kiểm thử logic nghiệp vụ, thay đổi trạng thái và validation của Entity.
  - Sử dụng `AssertionHelpers` từ `common-testing` để kiểm tra các thuộc tính và hành vi.

### **5.2.3. Value Objects (`<value-object-name>.vo.ts`)**

- **Mục đích:** Các đối tượng mô tả một thuộc tính hoặc một khái niệm, không có định danh riêng và là bất biến (immutable). Giá trị của chúng được xác định bởi các thuộc tính cấu thành.
- **Triển khai:**
  - Kế thừa lớp `AbstractValueObject<T>` từ `libs/common/common-domain` (ví dụ: `export abstract class AbstractValueObject<T extends object>`). Lớp này cung cấp:
    - Phương thức `equals(other?: AbstractValueObject<T>): boolean` để so sánh giá trị.
    - Logic đảm bảo tính bất biến thông qua `Object.freeze()` áp dụng cho `props`.
  - Các thuộc tính phải là `readonly`.
  - Constructor nên thực hiện validation và ném lỗi nếu giá trị không hợp lệ.
  - Cung cấp các phương thức factory tĩnh (ví dụ: `create(...)`) để đóng gói logic khởi tạo và validation.
- **Sử dụng thư viện `common`:**
  - `common-domain`: Kế thừa `AbstractValueObject`.
  - `common-utils`: Có thể dùng cho validation, formatting bên trong VO.
- **Unit Test (`<value-object-name>.vo.test.ts`):**
  - **Khởi tạo:** Đảm bảo VO được tạo đúng với giá trị hợp lệ và ném lỗi với giá trị không hợp lệ.
  - **Bất biến:** Xác nhận không có cách nào thay đổi trạng thái của VO sau khi tạo (nhờ vào `Object.freeze()`).
  - **So sánh:** Kiểm tra phương thức `equals()` hoạt động chính xác (hai VO bằng nhau nếu tất cả thuộc tính cấu thành bằng nhau).
  - **Các phương thức khác (nếu có):** Kiểm tra các getter hoặc các phương thức tính toán dựa trên giá trị.

### **5.2.4. Domain Events (`<event-name>.event.ts` trong thư viện `<bc-name>-events`)**

- **Mục đích:** Đại diện cho một sự kiện nghiệp vụ quan trọng đã xảy ra trong domain. Các Aggregate Root trong thư viện `<bc-name>-domain` sẽ phát ra các Domain Events này khi trạng thái của chúng thay đổi. Các event này được định nghĩa và quản lý trong thư viện `<bc-name>-events`.
- **Lý do tách riêng:** Việc tách Domain Events ra một thư viện riêng (`<bc-name>-events`) giúp chúng dễ dàng được chia sẻ và sử dụng bởi các phần khác nhau của hệ thống:
  - Các service khác trong cùng Bounded Context (ví dụ: một worker service có thể lắng nghe event từ command service).
  - Các Bounded Context khác có thể lắng nghe và phản ứng với những event này.
  - Application layer của chính BC đó để xử lý các tác vụ sau khi event được phát ra (ví dụ: publish event ra message broker).
- **Triển khai (trong `<bc-name>-events/src/lib/`):**
  - Mỗi event là một file riêng, ví dụ: `<event-name>.event.ts`.
  - **Luôn kế thừa class `AbstractDomainEvent` từ `libs/common/common-domain`** để đảm bảo có sẵn id, timestamp, metadata và tính nhất quán. KHÔNG sử dụng interface rời rạc hoặc interface từ `@nestjs/cqrs`.
  - Các event nên là các lớp đơn giản hoặc POJO (Plain Old JavaScript Object) chứa dữ liệu của sự kiện (payload). Các thuộc tính nên là `readonly`.
  - Tên event nên ở thì quá khứ (ví dụ: `ReferenceDataSetCreatedEvent`).
  - Thư mục `lib` trong `<bc-name>-events` sẽ chứa tất cả các file event và file test tương ứng, cùng với một file `index.ts` để export tất cả.
- **Sử dụng thư viện `common`:**
  - `common-domain`: Kế thừa `AbstractDomainEvent`.
- **Ví dụ import:**
  ```typescript
  import { AbstractDomainEvent } from "@ecoma/common-domain";
  ```
- **Unit Test (`<event-name>.event.test.ts` trong thư viện `<bc-name>-events`):**
  - Chủ yếu kiểm tra việc khởi tạo event với đúng payload và các thuộc tính cơ bản (id, timestamp, metadata) được gán chính xác.

### **5.2.5. Domain Services (`<service-name>.service.ts`)**

- **Mục đích:** Đôi khi có những logic nghiệp vụ không thuộc về một Aggregate hay Entity cụ thể nào, hoặc liên quan đến nhiều Aggregate/Entity khác nhau. Domain Service sẽ đóng gói logic này.
- **Triển khai:**
  - Là các lớp không trạng thái (stateless).
  - Các phương thức của Domain Service nhận các đối tượng domain (Aggregates, Entities, Value Objects) làm tham số.
  - Không nên chứa logic liên quan đến infrastructure (ví dụ: gọi API, truy cập DB trực tiếp).
- **Unit Test (`<service-name>.service.test.ts`):**
  - Mock các đối tượng domain đầu vào.
  - Kiểm tra xem Domain Service có gọi đúng các phương thức trên các đối tượng domain đó không.
  - Kiểm tra kết quả trả về của Domain Service.

### **5.2.6. Lỗi nghiệp vụ (`<error-name>.error.ts` trong thư mục `errors/`)**

- **Mục đích:** Định nghĩa các lớp lỗi tùy chỉnh cho các tình huống lỗi nghiệp vụ cụ thể trong domain. Việc tập trung các lỗi vào một thư mục `errors/` giúp dễ quản lý và tham chiếu, tương đồng với cách `common-domain` có thể tổ chức các lỗi chung.
- **Triển khai:**
  - Đặt trong thư mục `libs/domains/<bc-name>/<bc-name>-domain/src/lib/errors/`.
  - **Luôn kế thừa từ `DomainError` trong `libs/common/common-domain`** để đảm bảo tính nhất quán trong cách xử lý lỗi và cung cấp thông tin lỗi. KHÔNG kế thừa trực tiếp từ `Error`.
  - Tên file và tên lớp nên mô tả rõ ràng tình huống lỗi. Ví dụ: `ReferenceDataSetNotFoundError` trong file `reference-data-set-not-found.error.ts`.
- **Sử dụng thư viện `common`:**
  - `common-domain`: Kế thừa từ `DomainError`.
- **Ví dụ import:**
  ```typescript
  import { DomainError } from "@ecoma/common-domain";
  ```

### **5.2.7. Ports (Thư mục `ports/`)**

- **Mục đích:** Thư mục này, trước đây có thể được gọi là `interfaces/`, chứa định nghĩa các "Ports" theo thuật ngữ của Hexagonal Architecture (Ports and Adapters). Đây là các interface mà lớp Domain _cần_ để tương tác với thế giới bên ngoài (ví dụ: persistence, message brokers, các dịch vụ bên ngoài khác mà Domain Service cần gọi một cách trừu tượng).
  - Ví dụ phổ biến nhất của port là Repository interface (ví dụ: `IReferenceDataSetRepository`). Tuy nhiên, theo nhiều trường phái Clean Architecture, Repository interface thường được định nghĩa ở Application Layer vì nó mô tả cách Application Layer muốn tương tác với persistence. **Trong dự án Ecoma, chúng ta thống nhất đặt Repository Interfaces tại Application Layer.**
  - Do đó, thư mục `ports/` trong lớp Domain sẽ ít được sử dụng hơn, chủ yếu dành cho các trường hợp Domain Service cần trừu tượng hóa một số phụ thuộc mà không phải là repository (ví dụ: một `ICurrencyExchangeService` nếu logic nghiệp vụ cần thông tin tỷ giá từ một nguồn trừu tượng).
- **Triển khai:**
  - Định nghĩa các interface TypeScript.
  - Các interface này sẽ được các "Adapters" ở lớp Infrastructure triển khai.
- **Lưu ý:** Cân nhắc kỹ trước khi thêm port ở đây. Đa phần các nhu cầu giao tiếp ra bên ngoài của domain sẽ được Application Layer điều phối thông qua các port do Application Layer định nghĩa (như Repositories).

## **5.3. Những gì cần Unit Test trong Lớp Domain**

Lớp Domain là nơi chứa nhiều logic nghiệp vụ nhất, do đó, Unit Test ở lớp này cực kỳ quan trọng.

- **Aggregates:**
  - Tạo mới Aggregate (constructor/factory method): đảm bảo trạng thái khởi tạo đúng, validation đầu vào.
  - Mỗi phương thức command (thay đổi trạng thái):
    - Trạng thái Aggregate thay đổi đúng như mong đợi.
    - Các quy tắc bất biến (invariants) được đảm bảo.
    - Phát ra đúng Domain Event(s) với payload chính xác. Sử dụng `EventTestingHelper` từ `common-testing` để kiểm tra events:

      ```typescript
      // Kiểm tra một event cụ thể đã được phát ra với payload đúng
      EventTestingHelper.expectEventPublished(jest.spyOn(aggregate, "getDomainEvents"), "ReferenceDataSetCreated", { id: "test-id", name: "Test Set" });

      // Kiểm tra số lượng events đã phát ra
      EventTestingHelper.expectEventPublishedTimes(jest.spyOn(aggregate, "getDomainEvents"), "ReferenceDataSetCreated", 1);
      ```

    - Ném đúng lỗi nghiệp vụ khi vi phạm quy tắc.
- **Entities (nếu có logic phức tạp):**
  - Tương tự như Aggregate, tập trung vào các phương thức thay đổi trạng thái và validation của Entity.
  - Sử dụng `AssertionHelpers` từ `common-testing` để kiểm tra thuộc tính:
    ```typescript
    AssertionHelpers.expectToContainAllProperties(entity, {
      name: "Test Entity",
      status: "active",
    });
    ```
- **Value Objects:**
  - Khởi tạo: validation giá trị đầu vào, tạo đối tượng thành công hoặc ném lỗi.
  - Tính bất biến: kiểm tra rằng không thể thay đổi thuộc tính sau khi tạo.
  - Phương thức so sánh (`equals`).
  - Các getter hoặc phương thức tiện ích khác.
- **Domain Events:**
  - Khởi tạo Event với payload chính xác (kiểm thử trong thư viện `<bc-name>-events`).
- **Domain Services:**
  - Với các input đã mock (sử dụng `MockFactory` từ `common-testing`), kiểm tra output hoặc sự tương tác với các đối tượng domain khác (đã mock) là chính xác.
- **Không Unit Test:**
  - Các getter/setter đơn giản không có logic.
  - Code phụ thuộc vào framework hoặc thư viện bên ngoài (điều này không nên tồn tại trong lớp domain).

**Sử dụng `libs/common/common-testing`:**

Thư viện `common-testing` cung cấp:

- `AssertionHelpers`: Các hàm kiểm tra nâng cao như `expectToContainAllProperties`, `expectArrayToContainAll`, `expectDateToBeBetween`.
- `EventTestingHelper`: Các hàm kiểm tra events như `expectEventPublished`, `expectEventPublishedTimes`, `expectEventsPublishedInOrder`.
- `MockFactory`: Các hàm tạo mock objects và functions dễ dàng.
- Các lớp test cơ sở hoặc các tiện ích thiết lập test.

Luôn đảm bảo các Unit Test cho lớp Domain chạy nhanh, độc lập và cung cấp phản hồi sớm về tính đúng đắn của logic nghiệp vụ. Tên các test case (`describe`, `it`) nên được viết bằng tiếng Việt để dễ hiểu và nhất quán.

## **5.4. Thực hành tốt nhất cho Lớp Domain**

Để xây dựng một lớp Domain mạnh mẽ, dễ bảo trì và phản ánh đúng logic nghiệp vụ, hãy tuân thủ các thực hành tốt nhất sau:

1.  **Tập trung vào Logic Nghiệp vụ Thuần túy:**

    - Lớp Domain **chỉ** chứa mã liên quan trực tiếp đến các quy tắc, quy trình và khái niệm nghiệp vụ.
    - **Tuyệt đối không** chứa bất kỳ tham chiếu nào đến framework (NestJS, Angular), thư viện UI, ORM, chi tiết cơ sở dữ liệu, hoặc bất kỳ mối quan tâm nào về cơ sở hạ tầng. Điều này đảm bảo tính độc lập và khả năng kiểm thử cao.

2.  **Sử dụng Ngôn ngữ Chung (Ubiquitous Language):**

    - Tên của các class (Aggregates, Entities, Value Objects, Domain Events, Domain Services), methods, và properties phải phản ánh chính xác thuật ngữ được sử dụng bởi các chuyên gia nghiệp vụ trong Bounded Context đó.
    - Điều này giúp giảm thiểu hiểu lầm và làm cho code dễ hiểu hơn đối với cả đội ngũ kỹ thuật và các bên liên quan khác.

3.  **Ưu tiên Tính Bất biến (Immutability):**

    - **Value Objects phải luôn luôn bất biến.** Sau khi được tạo, trạng thái của chúng không thể thay đổi. Sử dụng `readonly` cho các thuộc tính.
    - Đối với Aggregates và Entities, hãy cẩn trọng khi thay đổi trạng thái. Các phương thức thay đổi trạng thái nên rõ ràng và đảm bảo tất cả các quy tắc bất biến (invariants) được duy trì.

4.  **Xây dựng Mô hình Domain Phong phú (Rich Domain Model):**

    - Tránh Anemic Domain Models (các lớp chỉ có getters và setters mà không có hành vi).
    - Logic nghiệp vụ nên được đóng gói bên trong các phương thức của Aggregates, Entities, và Domain Services. Các đối tượng domain nên tự quản lý trạng thái và hành vi của mình.

5.  **Ranh giới Bounded Context Rõ ràng:**

    - Đảm bảo logic của một Bounded Context không bị rò rỉ sang các Bounded Context khác.
    - Sự tương tác giữa các BC nên được thực hiện thông qua các cơ chế được định nghĩa rõ ràng (ví dụ: Domain Events, Anti-Corruption Layer nếu cần).

6.  **Phụ thuộc Rõ ràng (Explicit Dependencies):**

    - Nếu Domain Services cần các phụ thuộc (ví dụ: các Domain Services khác hoặc các Ports), chúng nên được truyền vào qua constructor hoặc method parameters. Tránh sử dụng các global state hoặc service locator.

7.  **Tính Gắn kết Cao (High Cohesion):**

    - Các khái niệm liên quan chặt chẽ với nhau nên được nhóm lại gần nhau (ví dụ: một Aggregate Root và các Entities, Value Objects cấu thành nên nó).

8.  **Tính Liên kết Thấp (Low Coupling):**

    - Giảm thiểu sự phụ thuộc giữa các thành phần không liên quan trực tiếp trong domain. Điều này giúp dễ dàng thay đổi một phần của domain mà không ảnh hưởng lớn đến các phần khác.

9.  **Nguyên tắc "Tell, Don't Ask":**

    - Thay vì lấy dữ liệu từ một đối tượng rồi thực hiện logic bên ngoài đối tượng đó, hãy "yêu cầu" đối tượng tự thực hiện hành động đó. Ví dụ, thay vì `if (order.getStatus() === 'pending') { order.setShippingAddress(...) }`, hãy có phương thức `order.updateShippingAddressIfPending(...)`.

10. **Fail Fast và Validation Sớm:**

    - Thực hiện validation dữ liệu đầu vào ngay tại "cổng" của các Aggregate (ví dụ: trong constructor hoặc các phương thức command) và trong constructor/factory methods của Value Objects.
    - Ném lỗi nghiệp vụ cụ thể (từ thư mục `errors/`) ngay khi phát hiện ra sự không nhất quán hoặc vi phạm quy tắc.

11. **Sử dụng Domain Events cho Tác dụng Phụ (Side Effects):**

    - Khi một hành động nghiệp vụ quan trọng làm thay đổi trạng thái của Aggregate, hãy phát ra một Domain Event (từ thư viện `<bc-name>-events`).
    - Điều này cho phép các phần khác của hệ thống (trong cùng BC hoặc các BC khác) phản ứng với sự thay đổi đó một cách tách biệt, giảm coupling trực tiếp.

12. **Thiết kế Aggregate Nhỏ và Tập trung:**

    - Cố gắng giữ cho các Aggregate càng nhỏ càng tốt, miễn là chúng vẫn đảm bảo được tính nhất quán giao dịch cho các quy tắc nghiệp vụ quan trọng.
    - Aggregate lớn có thể dẫn đến các vấn đề về hiệu năng, contention, và độ phức tạp.

13. **Khả năng Kiểm thử Cao:**

    - Viết Unit Test kỹ lưỡng cho tất cả logic nghiệp vụ trong lớp Domain. Các test này phải chạy nhanh và không có phụ thuộc vào cơ sở hạ tầng.

14. **Tận dụng Thư viện `common`:**

    - **Luôn kiểm tra và sử dụng** các lớp cơ sở, kiểu dữ liệu, và tiện ích từ `libs/common/common-domain`, `libs/common/common-types`, và `libs/common/common-utils` trước khi tự định nghĩa lại.
    - Điều này giúp tránh lặp code, đảm bảo tính nhất quán trên toàn bộ dự án (ví dụ: cách định nghĩa `AggregateRoot`, `ValueObject`, `DomainError`, kiểu `Nullable<T>`).

15. **Tổ chức Code và `index.ts`:**
    - Như đã quy định chung (Mục 4), khi tổ chức project thành các thư mục con, mỗi thư mục con phải có file `index.ts` để export các thành phần cần thiết. Khi import, hãy import từ thư mục đó thay vì đường dẫn file cụ thể để dễ dàng refactor hơn.

# **6. Triển khai lớp Application**

Lớp Application đóng vai trò điều phối và thực thi các kịch bản sử dụng (use cases) của hệ thống. Nó không chứa logic nghiệp vụ cốt lõi (thuộc về lớp Domain) mà thay vào đó, nó sử dụng các đối tượng Domain (Aggregates, Entities, Domain Services) để hoàn thành nhiệm vụ. Lớp Application cũng định nghĩa các "Ports" (interfaces) mà lớp Infrastructure cần triển khai để tương tác với thế giới bên ngoài (ví dụ: cơ sở dữ liệu, message broker).

Trong Ecoma, mỗi Bounded Context (ví dụ: RDM) sẽ có một thư viện application riêng, ví dụ `libs/domains/rdm/rdm-application/`.

## **6.1. Cấu trúc thư mục mẫu cho `<bc-name>-application`**

Thư viện `<bc-name>-application` sẽ chứa logic nghiệp vụ cụ thể cho BC, điều phối các tác vụ và triển khai các use case. Dưới đây là cấu trúc thư mục được đề xuất:

```
libs/
└── <your-bc-name>/
    └── <bc-name>-application/
        ├── src/
        │   ├── lib/
        │   │   ├── dtos/                 # Data Transfer Objects cho use cases (đầu vào, đầu ra)
        │   │   │   ├── commands/         # DTOs cho Command use cases
        │   │   │   └── queries/          # DTOs cho Query use cases
        │   │   ├── errors/               # Các lỗi cụ thể của lớp Application (ví dụ: validation, not found)
        │   │   ├── mappers/              # Ánh xạ giữa Domain Entities/Value Objects và DTOs
        │   │   ├── ports/                # Interfaces (ports) mà Application Layer định nghĩa và Infrastructure Layer triển khai
        │   │   │   ├── messaging/        # Ports cho việc gửi/nhận message (ví dụ: IEventPublisher, ICommandSender)
        │   │   │   └── persistence/      # Ports cho việc truy cập dữ liệu (ví dụ: I<AggregateRoot>Repository)
        │   │   ├── services/             # Các Application Services (nếu cần thiết, thường để chứa logic điều phối phức tạp hơn hoặc logic không thuộc về một use case cụ thể nào)
        │   │   └── use-cases/            # Chứa các Command và Query handlers
        │   │       ├── commands/         # Logic xử lý các Command (thay đổi trạng thái hệ thống)
        │   │       │   └── impl/         # Triển khai cụ thể của các command handlers
        │   │       └── queries/          # Logic xử lý các Query (truy vấn dữ liệu)
        │   │           └── impl/         # Triển khai cụ thể của các query handlers
        │   ├── index.ts                  # Export các thành phần chính của thư viện
        │   └── <bc-name>-application.module.ts # Module NestJS (nếu cần thiết để DI)
        ├── tests/
        │   ├── unit/
        │   │   ├── commands/
        │   │   └── queries/
        │   └── integration/              # (Tùy chọn, nếu có logic tích hợp cần test ở mức application)
        ├── jest.config.ts
        ├── package.json
        ├── README.md
        └── tsconfig.json
```

**Lưu ý:**

- `dtos/commands/` và `dtos/queries/`: Chứa các DTOs (Data Transfer Objects) được sử dụng làm đầu vào và đầu ra cho các command và query handlers tương ứng. Ví dụ: `create-user.command.dto.ts`, `user.query.dto.ts`.
- `errors/`: Chứa các lớp lỗi tùy chỉnh dành riêng cho lớp Application, ví dụ: `UserNotFoundError`, `InvalidInputError`. Chúng nên kế thừa từ `ApplicationError` trong `common-utils/error.util.ts` hoặc một base error phù hợp.
- `mappers/`: Chứa các lớp hoặc hàm mapper để chuyển đổi giữa các đối tượng Domain (Entities, Value Objects) và các DTOs của Application Layer. Điều này giúp giữ cho Domain Layer không bị phụ thuộc vào cấu trúc DTOs.
- `ports/messaging/`: Định nghĩa các interface (port) cho các hoạt động liên quan đến message queue, ví dụ `IEventPublisherPort` để publish domain events, hoặc `ICommandSenderPort` để gửi command đến các BC khác (nếu có). Các port này sẽ được triển khai bởi Infrastructure Layer.
- `ports/persistence/`: Định nghĩa các interface (port) cho việc lưu trữ và truy xuất dữ liệu, thường là các Repository interface. Ví dụ: `I<AggregateRoot>RepositoryPort`. Infrastructure Layer sẽ cung cấp các triển khai cụ thể (ví dụ: sử dụng TypeORM, Prisma).
- `services/`: Chứa các Application Services. Đây là nơi bạn có thể đặt logic điều phối phức tạp hơn mà không phù hợp để đặt trực tiếp trong một command/query handler, hoặc các logic nghiệp vụ của lớp application mà có thể được tái sử dụng bởi nhiều use cases. Ví dụ, một `OrderProcessingService` có thể điều phối nhiều bước trong việc xử lý một đơn hàng.
- `use-cases/commands/impl/`: Chứa các file triển khai cụ thể cho từng command handler. Ví dụ: `create-user.command.handler.ts`. Mỗi handler sẽ triển khai một interface Command Handler (ví dụ: `ICommandHandler<CreateUserCommand>`).
- `use-cases/queries/impl/`: Chứa các file triển khai cụ thể cho từng query handler. Ví dụ: `get-user-by-id.query.handler.ts`. Mỗi handler sẽ triển khai một interface Query Handler (ví dụ: `IQueryHandler<GetUserByIdQuery, UserDto>`).
- `<bc-name>-application.module.ts`: (Tùy chọn) Nếu bạn sử dụng NestJS DI trong Application Layer, đây sẽ là module để đăng ký các providers (handlers, mappers, services). Thông thường, các handlers sẽ được đăng ký ở đây để chúng có thể được inject vào Infrastructure Layer (ví dụ: vào controllers hoặc message consumers).

Tương tự như Domain Layer, mỗi thư mục con nên có một file `index.ts` để export các thành phần của nó.

## **6.2. Giải thích các thành phần và sử dụng thư viện `common`**

### **6.2.1. Use Cases (Thư mục `use-cases/`)**

Đây là nơi triển khai các kịch bản sử dụng của ứng dụng, thường được tổ chức theo mô hình CQRS (Command Query Responsibility Segregation).

#### **6.2.1.1. Commands (`<command-name>.command.ts` & `<command-name>.handler.ts`)**

- **Mục đích:** Commands đại diện cho ý định thay đổi trạng thái của hệ thống (ghi dữ liệu).
- **`<command-name>.command.ts`**:
  - Là một lớp hoặc interface đơn giản, chứa dữ liệu cần thiết để thực thi command (payload). Thường là các POJO (Plain Old JavaScript Object).
  - Các thuộc tính nên là `readonly` để đảm bảo command không bị thay đổi sau khi tạo.
  - Ví dụ: `CreateReferenceDataSetCommand { readonly id: string; readonly name: string; ... }`.
- **`<command-name>.handler.ts`**:
  - Là lớp chứa logic để xử lý command tương ứng.
  - Thường được đánh dấu bằng decorator `@CommandHandler` (từ `@nestjs/cqrs`).
  - Nên inject một `ILogger` (ví dụ: từ `libs/common/common-utils` hoặc một thư viện `common-application` nếu có) vào constructor để ghi log một cách có cấu trúc. Logger này nên tuân thủ interface `ILogger` chung.
  - **Trách nhiệm:**
    1.  **Ghi log bắt đầu:** `logger.info(\`Starting <CommandName> execution with payload: \${JSON.stringify(command)}\`);`(Lưu ý: cẩn trọng với việc log toàn bộ payload nếu chứa dữ liệu nhạy cảm. Có thể chỉ log ID hoặc các trường không nhạy cảm).\n        2.  **Nhận Command làm đầu vào.**\n        3.  **Validate command payload:** Sử dụng các thư viện validation hoặc DTO validation. Ghi log`logger.debug('Command payload validated successfully.');`hoặc log lỗi nếu validation thất bại.\n        4.  **Tương tác với lớp Domain:**\n            *   Sử dụng Repository (Ports) để tải Aggregate Root.`logger.debug(\`Attempting to load Aggregate <AggregateName> with ID: \${command.aggregateId}\`);`. Sau khi tải, `logger.debug(\`Aggregate <AggregateName> loaded: \${aggregate ? 'found' : 'not found'}\`);`.\n            *   Gọi các phương thức trên Aggregate Root để thực thi hành vi nghiệp vụ. `logger.debug(\`Executing business logic on <AggregateName> for command <CommandName>\`);`. Aggregate sẽ tự validate các quy tắc nghiệp vụ và phát ra Domain Events.\n            *   Sử dụng Repository để lưu lại trạng thái mới của Aggregate. `logger.debug(\`Attempting to save Aggregate <AggregateName> with ID: \${command.aggregateId}\`);`. Sau khi lưu, `logger.info(\`Aggregate <AggregateName> saved successfully.\`);`.\n        5.  **Điều phối các Domain Services nếu cần.** Ghi log `logger.debug`các bước tương tác với Domain Service.\n        6.  **Publish Domain Events:** Sử dụng Port`IDomainEventPublisher`để phát các Domain Events (lấy từ`aggregate.getUncommittedEvents()`) ra message broker. `logger.info(\`Publishing \${events.length} domain events for <AggregateName> ID: \${command.aggregateId}\`);`.\n        7.  **Xử lý transaction:** (Thường được quản lý bởi lớp Infrastructure hoặc decorator). Ghi log `logger.debug`về trạng thái transaction nếu có thể.\n        8.  **Trả về kết quả:** (thường là`void`, ID của Aggregate, hoặc `Result<T, E>`từ`common-types`). `logger.info(\`Finished <CommandName> execution. Result: \${JSON.stringify(result)}\`);`.\n-   **Sử dụng thư viện `common`:**\n    -   `common-types`: Sử dụng `Result<T, E>`, `Nullable<T>`, `Maybe<T>`.\n    -   `common-domain`: Các handler có thể inject và sử dụng các Domain Services.\n    -   `common-utils`(hoặc`common-application`): Inject `ILogger`.\n-   **Unit Test (`<command-name>.handler.test.ts`):\*\*\n - Mock các dependencies: Repositories, Domain Event Publisher, Domain Services.
  - **Với command hợp lệ:**
    - Kiểm tra Repository được gọi đúng (ví dụ: `findById`, `save`).
    - Kiểm tra các phương thức trên Aggregate Root (đã mock) được gọi đúng với tham số chính xác.
    - Kiểm tra Domain Event Publisher được gọi để phát các event từ Aggregate.
    - Kiểm tra kết quả trả về (nếu có).
  - **Với command không hợp lệ / vi phạm nghiệp vụ:**
    - Kiểm tra handler ném ra lỗi ứng dụng phù hợp (từ thư mục `errors/` của application hoặc domain).
    - Kiểm tra Repository không được gọi để `save` nếu có lỗi.

#### **6.2.1.2. Queries (`<query-name>.query.ts` & `<query-name>.handler.ts`)**

- **Mục đích:** Queries đại diện cho yêu cầu lấy dữ liệu từ hệ thống mà không làm thay đổi trạng thái (đọc dữ liệu).
- **`<query-name>.query.ts`**:
  - Là một lớp hoặc interface đơn giản, chứa các tham số cần thiết cho việc truy vấn.
  - Ví dụ: `GetReferenceDataSetByIdQuery { readonly id: string; }`.
- **`<query-name>.dto.ts` (hoặc `<query-name>.view-model.ts`)**:
  - Định nghĩa cấu trúc dữ liệu (DTO - Data Transfer Object) sẽ được trả về cho client khi query được thực thi.
  - DTO này nên được thiết kế phẳng và tối ưu cho việc hiển thị hoặc truyền tải, có thể khác với cấu trúc của Domain Entities.
- **`<query-name>.handler.ts`**:
  - Là lớp chứa logic để xử lý query.
  - Thường được đánh dấu bằng decorator `@QueryHandler` (từ `@nestjs/cqrs`).
  - Nên inject một `ILogger` (ví dụ: từ `libs/common/common-utils` hoặc một thư viện `common-application` nếu có) vào constructor để ghi log một cách có cấu trúc. Logger này nên tuân thủ interface `ILogger` chung.
  - **Trách nhiệm:**
    1.  **Ghi log bắt đầu:** `logger.info(\`Starting <QueryName> execution with parameters: \${JSON.stringify(query)}\`);` (Lưu ý: cẩn trọng với việc log toàn bộ query object nếu chứa dữ liệu nhạy cảm. Có thể chỉ log ID hoặc các trường không nhạy cảm).
    2.  **Nhận Query làm đầu vào.**
    3.  **Tương tác với cơ sở dữ liệu (thông qua Repository hoặc một cơ chế đọc dữ liệu chuyên biệt cho query) để lấy dữ liệu.** `logger.debug(\`Executing database query for <QueryName> with params: \${JSON.stringify(query)}\`);`.
        - **Lưu ý quan trọng:** Để tối ưu hiệu năng, các Query Handler có thể **bỏ qua Domain Layer** và truy vấn trực tiếp từ các "Read Models" hoặc các bảng dữ liệu đã được tối ưu hóa cho việc đọc. Điều này có nghĩa là Query Handler có thể không cần load toàn bộ Aggregate Root.
    4.  **Map dữ liệu lấy được sang DTO (định nghĩa ở `<query-name>.dto.ts`).** `logger.debug(\`Mapping raw data to DTO for <QueryName>. Number of items found: \${Array.isArray(rawData) ? rawData.length : (rawData ? 1 : 0)}\`);`(Giả sử`rawData` là kết quả từ DB).
    5.  **Trả về DTO.** `logger.info(\`Finished <QueryName> execution. Returning DTO(s). Number of DTOs: \${Array.isArray(dtoResult) ? dtoResult.length : (dtoResult ? 1 : 0)}\`);`(Giả sử`dtoResult` là kết quả DTO cuối cùng).
- **Sử dụng thư viện `common`:**
  - `common-types`: Kết quả trả về của handler thường là `Promise<Nullable<QueryDTO>>` hoặc `Promise<QueryDTO[]>`.
  - `common-utils` (hoặc `common-application`): Inject `ILogger`.
- **Unit Test (`<query-name>.handler.test.ts`):**
  - Mock Repository hoặc cơ chế đọc dữ liệu.
  - Kiểm tra Repository được gọi đúng với tham số truy vấn chính xác.
  - Kiểm tra dữ liệu từ Repository (đã mock) được map chính xác sang DTO.
  - Kiểm tra DTO trả về có cấu trúc và dữ liệu đúng.
  - Kiểm tra trường hợp không tìm thấy dữ liệu.

### **6.2.2. Ports (Thư mục `ports/`)**

Đây là nơi định nghĩa các interfaces (hợp đồng) mà lớp Infrastructure phải tuân theo để cung cấp các dịch vụ cho lớp Application.

- **`persistence/<aggregate-name>.repository.ts`**:
  - Định nghĩa interface cho Repository của một Aggregate Root cụ thể.
  - Ví dụ: `IReferenceDataSetRepository` có thể có các phương thức:
    ```typescript
    interface IReferenceDataSetRepository {
      findById(id: ReferenceDataSetId): Promise<Nullable<ReferenceDataSet>>;
      save(aggregate: ReferenceDataSet): Promise<void>;
      delete(id: ReferenceDataSetId): Promise<void>;
      // Các phương thức truy vấn khác nếu cần thiết cho command side
    }
    ```
  - Lưu ý: Các phương thức truy vấn phức tạp hơn, chỉ dùng cho mục đích đọc (queries), có thể được định nghĩa trong các Repository chuyên biệt cho "Read Models" hoặc trực tiếp trong các Query Handler nếu chúng truy cập nguồn dữ liệu đọc riêng.
- **`messaging/domain-event.publisher.ts`**:
  - Định nghĩa interface cho việc publish Domain Events.
  - Ví dụ: `IDomainEventPublisher { publish(event: IDomainEvent): Promise<void>; publishAll(events: IDomainEvent[]): Promise<void>; }`.
- **`integration/...`**: Các ports cho việc tích hợp với các dịch vụ bên ngoài khác (ví dụ: dịch vụ gửi email, dịch vụ thanh toán) nếu lớp Application cần gọi chúng một cách trừu tượng.

### **6.2.3. DTOs (Thư mục `dtos/`)**

- **Mục đích:** Data Transfer Objects được sử dụng để truyền dữ liệu giữa các lớp hoặc qua mạng. Trong lớp Application:
  - Command objects có thể được coi là một dạng DTO.
  - Kết quả trả về của Queries luôn là DTOs (`<query-name>.dto.ts`).
  - Nếu có các cấu trúc dữ liệu phức tạp khác cần truyền vào Application services từ bên ngoài (ví dụ: từ Controllers trong lớp Infrastructure), chúng cũng có thể được định nghĩa ở đây.
- **Đặc điểm:** Nên là các lớp/interface đơn giản, chỉ chứa thuộc tính dữ liệu, không có hành vi nghiệp vụ.

### **6.2.4. Mappers (Thư mục `mappers/`)**

- **Mục đích:** Chuyển đổi giữa các đối tượng Domain (Aggregates, Entities) và DTOs.
- **Khi nào cần:** Nếu việc mapping phức tạp, có thể tách ra thành các lớp Mapper riêng. Tuy nhiên, nếu mapping đơn giản, nó có thể được thực hiện trực tiếp trong Query Handlers hoặc trong các static factory methods của DTO.
- **Triển khai:** Các lớp Mapper thường có các phương thức tĩnh như `toDTO(domainObject: SomeDomainObject): SomeDTO` hoặc `toDomain(dto: SomeDTO): SomeDomainObject` (việc map từ DTO về Domain Object ít phổ biến hơn ở Application layer, thường xảy ra ở tầng Infrastructure khi nhận request).

### **6.2.5. Errors (Thư mục `errors/`)**

- **Mục đích:** Định nghĩa các lớp lỗi đặc thù của lớp Application, không phải là lỗi nghiệp vụ thuần túy của Domain.
- **Ví dụ:**
  - `ResourceNotFoundError` (nếu một query không tìm thấy dữ liệu và muốn trả về lỗi thay vì `null`).
  - `UserNotAuthorizedError` (nếu kiểm tra quyền hạn ở lớp Application).
  - `InvalidCommandPayloadError` (cho lỗi validation payload của command).
- **Triển khai:**
  - **Nếu có base class `ApplicationError` trong common-application hoặc common-domain, luôn kế thừa từ đó.** Nếu chưa có, nên bổ sung vào common-application để chuẩn hóa.
  - KHÔNG kế thừa trực tiếp từ `Error`.
- **Ví dụ import:**
  ```typescript
  import { ApplicationError } from "@ecoma/common-application";
  ```

## **6.3. Những gì cần Unit Test trong Lớp Application**

- **Command Handlers:**
  - Đảm bảo handler gọi đúng các phương thức trên Aggregate (đã mock) với đúng tham số. Sử dụng `MockFactory` từ `common-testing`:
    ```typescript
    // Tạo mock Aggregate
    const mockAggregate = MockFactory.createMockObject<YourAggregate>({
      performAction: MockFactory.createMockFn().mockReturnValue(undefined),
      getDomainEvents: MockFactory.createMockFn().mockReturnValue([mockEvent]),
    });
    ```
  - Đảm bảo handler gọi `repository.save()` (hoặc tương đương) sau khi Aggregate thay đổi.
  - Đảm bảo handler gọi `domainEventPublisher.publishAll()` với các event từ Aggregate. Sử dụng `EventTestingHelper`:
    ```typescript
    EventTestingHelper.expectEventPublished(jest.spyOn(mockPublisher, "publish"), "YourDomainEvent", { id: "test-id", someProperty: "value" });
    ```
  - Kiểm tra việc xử lý lỗi từ Domain (ví dụ: khi Aggregate ném lỗi nghiệp vụ).
  - Kiểm tra giá trị trả về của handler.
- **Query Handlers:**
  - Đảm bảo handler gọi đúng phương thức trên Repository (hoặc nguồn dữ liệu đọc) với đúng tham số truy vấn.
  - Đảm bảo dữ liệu trả về từ Repository (đã mock) được map chính xác sang DTO.
  - Đảm bảo DTO trả về có cấu trúc và dữ liệu đúng. Sử dụng `AssertionHelpers`:
    ```typescript
    AssertionHelpers.expectToContainAllProperties(result, {
      id: "test-id",
      name: "Test Entity",
      createdAt: expect.any(Date),
    });
    ```
  - Kiểm tra trường hợp không tìm thấy dữ liệu.
- **Mappers (nếu có):**
  - Kiểm tra việc chuyển đổi giữa Domain Object và DTO diễn ra chính xác theo cả hai chiều (nếu có).
- **Không Unit Test:**
  - Command/Query/DTO objects: Vì chúng chỉ là cấu trúc dữ liệu.
  - Repository interfaces (Ports): Vì chúng là định nghĩa, không có logic.

**Sử dụng `libs/common/common-testing`:**

- Sử dụng `MockFactory` để tạo mock cho Repositories, Publishers, và các dependency khác:
  ```typescript
  const mockRepo = MockFactory.createMockObject<IYourRepository>({
    findById: MockFactory.createMockFn().mockResolvedValue(mockEntity),
    save: MockFactory.createMockFn().mockResolvedValue(undefined),
  });
  ```
- Sử dụng các mock clients như `MockNatsClient` và `MockRabbitMQClient` để test giao tiếp messaging:
  ```typescript
  const mockRabbitMQ = new MockRabbitMQClient();
  const handler = new YourCommandHandler(mockRepo, mockRabbitMQ);
  ```

## **6.4. Thực hành tốt nhất cho Lớp Application**

1.  **Giữ Lớp Application Mỏng (Thin Application Layer):**

    - Lớp Application không nên chứa logic nghiệp vụ. Vai trò chính của nó là điều phối các đối tượng Domain và các Port của Infrastructure. Logic nghiệp vụ phải nằm trong lớp Domain.

2.  **Phụ Thuộc vào Abstractions của Domain:**

    - Lớp Application phụ thuộc vào các khái niệm và interfaces của lớp Domain (Aggregates, Entities, Value Objects, Domain Services) và các Ports do chính nó định nghĩa (ví dụ: Repository interfaces). Nó không nên biết về chi tiết triển khai của lớp Infrastructure.

3.  **CQRS là Kim Chỉ Nam:**

    - Tách biệt rõ ràng các use case thành Commands (thay đổi trạng thái) và Queries (đọc dữ liệu). Điều này giúp tối ưu hóa từng luồng và làm cho hệ thống dễ hiểu hơn.

4.  **Xử Lý Transactions:**

    - Các Command use case thường tương ứng với một transaction nghiệp vụ. Việc quản lý transaction (bắt đầu, commit, rollback) có thể được khởi tạo ở lớp Application hoặc được xử lý bởi một decorator/middleware ở lớp Infrastructure dựa trên đánh dấu từ Application (ví dụ: `@TransactionalUseCase()`).

5.  **Kiểm Tra Quyền Hạn (Authorization):**

    - Lớp Application là một nơi phù hợp để thực hiện kiểm tra quyền hạn trước khi thực thi một Command hoặc Query, dựa trên thông tin người dùng hiện tại (ví dụ: lấy từ context của request).

6.  **Validation Dữ Liệu Đầu Vào:**

    - Validate payload của Commands và các tham số của Queries ngay khi chúng đi vào Application Handler. Có thể sử dụng các thư viện validation (như `class-validator` trong NestJS) trên các Command/Query objects.

7.  **Không Trả Về Domain Objects Trực Tiếp cho "Bên Ngoài":**

    - Đối với Queries, luôn trả về các DTO được thiết kế riêng cho use case đó, thay vì trả về trực tiếp Domain Entities/Aggregates. Điều này giúp tránh rò rỉ cấu trúc nội tại của Domain và cho phép tối ưu DTO cho client.
    - Đối với Commands, kết quả trả về thường là `void`, ID của Aggregate, hoặc một `Result` object.

8.  **Sử Dụng Ports để Giao Tiếp với Infrastructure:**

    - Mọi tương tác với cơ sở dữ liệu, message broker, dịch vụ bên ngoài phải thông qua các Ports (interfaces) được định nghĩa trong lớp Application và được triển khai bởi lớp Infrastructure.

9.  **Idempotency cho Commands (nếu cần):**

    - Xem xét thiết kế các Command Handler sao cho chúng có tính idempotent (thực thi nhiều lần với cùng một input cho ra cùng một kết quả cuối cùng) nếu bản chất của nghiệp vụ yêu cầu.

10. **Tận dụng Dependency Injection:**

    - Sử dụng DI (ví dụ: của NestJS) để inject Repositories, Domain Event Publishers, và các services khác vào Command/Query Handlers.

11. **Tổ chức Theo Feature hoặc Use Case:**

    - Cấu trúc thư mục `use-cases/commands/<command-name>/` và `use-cases/queries/<query-name>/` giúp nhóm các file liên quan đến một use case cụ thể lại với nhau, dễ dàng tìm kiếm và quản lý.

12. **Tái sử dụng Logic thông qua Domain Services:**

    - Nếu có logic điều phối phức tạp hoặc logic chung cho nhiều use case mà không thuộc về một Aggregate cụ thể, hãy xem xét đặt nó vào một Domain Service và gọi từ Application Handlers, thay vì lặp lại logic ở Application Layer.

13. **Tích hợp Logging Chi tiết và Có Cấu trúc:**
    - **Inject `ILogger`:** Luôn inject một instance của `ILogger` (từ thư viện common như `common-utils` hoặc `common-application`) vào constructor của Command Handlers, Query Handlers, và Application Services (nếu có).
    - **Sử dụng đúng Log Levels:**
      - `logger.info()`: Cho các sự kiện quan trọng, bắt đầu/kết thúc một use case, kết quả chính của một hành động (ví dụ: "User created successfully with ID X", "Query Y returned Z results").
      - `logger.debug()`: Cho các thông tin chi tiết hơn giúp gỡ lỗi trong quá trình phát triển hoặc khi cần theo dõi luồng thực thi một cách cặn kẽ (ví dụ: giá trị của các tham số quan trọng, trạng thái của đối tượng trước/sau một thao tác, các bước trung gian trong logic).
      - `logger.warn()`: Cho các tình huống không mong muốn nhưng không làm dừng hệ thống (ví dụ: một tham số tùy chọn không được cung cấp, một retry attempt).
      - `logger.error()`: Cho các lỗi thực sự làm dừng hoặc ảnh hưởng nghiêm trọng đến việc thực thi use case (thường đi kèm với việc ném Exception).
    - **Nội dung Log Hữu ích:** Log nên chứa đủ ngữ cảnh để hiểu được điều gì đang xảy ra, ví dụ: tên use case/command/query, ID của các entities liên quan (ví dụ: `userId`, `orderId`), các tham số đầu vào quan trọng (cẩn thận với dữ liệu nhạy cảm), và thông điệp lỗi rõ ràng.
    - **Tránh Log Dữ liệu Nhạy cảm:** Không bao giờ log mật khẩu, API keys, thông tin thẻ tín dụng, hoặc bất kỳ dữ liệu nhạy cảm nào khác ở dạng plain text. Nếu cần log payload, hãy đảm bảo có cơ chế che giấu hoặc loại bỏ các trường nhạy cảm.
    - **Nhất quán:** Thiết lập quy ước logging chung và tuân thủ nó trong toàn bộ Application Layer của các BC để dễ dàng theo dõi và phân tích log tập trung.

# **7. Triển khai lớp Infrastructure**

Lớp Infrastructure là cầu nối giữa ứng dụng của bạn và thế giới bên ngoài. Nó chứa tất cả các chi tiết kỹ thuật cụ thể liên quan đến việc giao tiếp với cơ sở dữ liệu, message brokers, các dịch vụ bên ngoài, và cách ứng dụng được host và expose (ví dụ: thông qua HTTP controllers). Vai trò chính của lớp Infrastructure là triển khai các "Ports" (interfaces) được định nghĩa bởi Lớp Application, đồng thời đóng gói tất cả các mối quan tâm về công nghệ và framework.

Trong Ecoma, việc triển khai lớp Infrastructure có một số đặc thù do cấu trúc monorepo và việc sử dụng NestJS cho các services:

- **Thư viện `<bc-name>-infrastructure` (ví dụ `libs/domains/rdm/rdm-infrastructure/`):** Thư viện này có thể được sử dụng để chứa các adapter ít phụ thuộc vào framework hơn, các lớp cơ sở cho adapters, hoặc các cấu hình hạ tầng chung cho Bounded Context mà có thể được tái sử dụng bởi nhiều `app` services (ví dụ: command-service, query-service, worker của cùng một BC). Tuy nhiên, phần lớn các triển khai cụ thể, đặc biệt là những phần gắn liền với NestJS (như controllers, providers cho TypeORM, RabbitMQ) sẽ nằm trực tiếp trong các project `apps/`.
- **Thư mục `infrastructure/` trong các project `apps/` (ví dụ `apps/services/rdm-command-service/src/infrastructure/`):** Đây là nơi chứa phần lớn code của lớp Infrastructure. Mỗi service (command, query, worker) sẽ có thư mục `infrastructure/` riêng, chứa các triển khai adapters (ví dụ: TypeORM repositories, RabbitMQ publishers/consumers, NATS clients, NestJS controllers) và module NestJS để cấu hình và khởi tạo chúng.

## **7.1. Cấu trúc thư mục mẫu**

Dưới đây là cấu trúc thư mục gợi ý. Phần cấu trúc cho thư viện `libs/<bc-name>-infrastructure/` là tùy chọn và chỉ nên sử dụng khi có lý do rõ ràng để chia sẻ code hạ tầng giữa các `apps` của cùng một BC.

### **7.1.1. Cấu trúc thư mục cho `libs/domains/<bc-name>/<bc-name>-infrastructure/` (Tùy chọn)**

```bash
libs/
└── domains/
    └── <bc-name>/                     # Ví dụ: rdm
        └── <bc-name>-infrastructure/  # Ví dụ: rdm-infrastructure
            ├── src/
            │   ├── lib/
            │   │   ├── adapters/         # Các adapter cơ sở hoặc ít phụ thuộc framework
            │   │   │   ├── persistence/  # Ví dụ: Base TypeORM repository helpers (ít phổ biến)
            │   │   │   └── messaging/    # Ví dụ: Base RabbitMQ connection logic
            │   │   ├── config/           # Cấu hình hạ tầng chung cho BC
            │   │   └── index.ts
            │   └── index.ts
            ├── package.json
            ├── project.json
            └── tsconfig.json
```

### **7.1.2. Cấu trúc thư mục cho `apps/services/<service-name>/src/infrastructure/`**

Đây là cấu trúc phổ biến và quan trọng hơn, nơi các triển khai cụ thể của Infrastructure Layer cho một service được đặt.

```bash
apps/
└── services/ (hoặc workers/)
    └── <service-name>/             # Ví dụ: rdm-command-service
        ├── src/
        │   ├── app/                  # Chứa Application Module, bootstrap logic (main.ts)
        │   ├── infrastructure/
        │   │   ├── adapters/
        │   │   │   ├── persistence/  # Triển khai Repository Ports từ Application Layer
        │   │   │   │   ├── typeorm/  # Nếu sử dụng TypeORM
        │   │   │   │   │   ├── entities/           # Định nghĩa các TypeORM Entities (khác với Domain Entities)
        │   │   │   │   │   │   └── <db-entity-name>.entity.ts
        │   │   │   │   │   ├── mappers/            # Mappers giữa Domain Entities và DB Entities
        │   │   │   │   │   │   └── <domain-entity-name>.db-mapper.ts
        │   │   │   │   │   ├── <aggregate-root-name>.repository.adapter.ts # Triển khai I<AggregateRoot>RepositoryPort
        │   │   │   │   │   └── index.ts
        │   │   │   │   └── ... (các ORM khác nếu có)
        │   │   │   ├── messaging/    # Triển khai Messaging Ports (Event Publisher, Command Sender/Receiver)
        │   │   │   │   ├── rabbitmq/ # Nếu sử dụng RabbitMQ
        │   │   │   │   │   ├── <event-name>.event-publisher.adapter.ts
        │   │   │   │   │   ├── <command-name>.command-receiver.adapter.ts (cho workers)
        │   │   │   │   │   └── index.ts
        │   │   │   │   ├── nats/     # Nếu sử dụng NATS cho Request/Reply
        │   │   │   │   │   ├── <service-name>.client.adapter.ts # Để gọi các service khác
        │   │   │   │   │   ├── <request-handler-name>.controller.adapter.ts # Để xử lý NATS request
        │   │   │   │   │   └── index.ts
        │   │   │   │   └── index.ts
        │   │   │   ├── http/         # Controllers (cho API services) hoặc HTTP clients (để gọi external APIs)
        │   │   │   │   ├── controllers/ # Đối với các services expose HTTP API (thường là API Gateway hoặc services được gọi trực tiếp)
        │   │   │   │   │   └── <resource-name>.controller.ts
        │   │   │   │   ├── clients/     # Để gọi các dịch vụ HTTP bên ngoài (ví dụ: Stripe, Twilio)
        │   │   │   │   │   └── <external-service-name>.client.adapter.ts
        │   │   │   │   └── index.ts
        │   │   │   └── index.ts
        │   │   ├── config/           # Cấu hình cụ thể cho infrastructure của service này
        │   │   │   ├── database.config.ts
        │   │   │   ├── messaging.config.ts
        │   │   │   └── index.ts
        │   │   ├── <service-name>.infrastructure.module.ts # Module NestJS cho lớp Infrastructure
        │   │   └── index.ts
        │   ├── main.ts                 # Điểm khởi chạy ứng dụng NestJS
        │   └── <service-name>.module.ts  # Module gốc của ứng dụng, import ApplicationModule và InfrastructureModule
        ├── Dockerfile
        ├── jest.config.ts
        └── ... (các file cấu hình khác của app)
```

**Ghi chú về cấu trúc:**

- **`apps/.../infrastructure/adapters/persistence/typeorm/entities/`**: Chứa các định nghĩa class được trang trí bằng decorator của TypeORM (`@Entity()`, `@Column()`, v.v.). Đây là các đối tượng map trực tiếp với cấu trúc bảng trong cơ sở dữ liệu và **khác biệt** với Domain Entities. Chúng phục vụ cho việc persistence.
- **`apps/.../infrastructure/adapters/persistence/typeorm/mappers/`**: Chứa logic để chuyển đổi giữa Domain Entities/Aggregates (từ lớp Domain) và các DB Entities của TypeORM (hoặc ORM/DB tool khác).
- **`apps/.../infrastructure/adapters/messaging/rabbitmq/`**: Chứa các adapter để publish sự kiện lên RabbitMQ (triển khai `IDomainEventPublisherPort`) hoặc để nhận và xử lý message từ RabbitMQ (thường thấy trong các workers, sử dụng các thư viện như `@golevelup/nestjs-rabbitmq`).
- **`apps/.../infrastructure/adapters/messaging/nats/`**: Chứa các adapter để gửi request và nhận response qua NATS (ví dụ, sử dụng `@nestjs/microservices` với NATS transporter) cho giao tiếp đồng bộ giữa các services.
- **`apps/.../infrastructure/adapters/http/controllers/`**: Các NestJS controllers, nhận request HTTP, validate DTOs (thường sử dụng `class-validator` của NestJS tích hợp với Pipes), và gọi các Command/Query Handlers từ Lớp Application.
- **`apps/.../infrastructure/config/`**: Quản lý cấu hình kết nối cơ sở dữ liệu, thông tin kết nối message broker, API keys, v.v., thường sử dụng `@nestjs/config`.
- **`apps/.../infrastructure/<service-name>.infrastructure.module.ts`**: Module NestJS để đăng ký tất cả các providers của lớp Infrastructure (Repositories, Publishers, Consumers, Clients, ConfigServices) và export chúng để `AppModule` có thể sử dụng.

## **7.2. Giải thích các thành phần và sử dụng thư viện `common`**

Lớp Infrastructure chứa nhiều thành phần đa dạng, mỗi thành phần có trách nhiệm cụ thể trong việc tương tác với các hệ thống bên ngoài hoặc cung cấp các cơ chế nền tảng cho ứng dụng.

### **7.2.1. Adapters**

Adapters là trái tim của lớp Infrastructure, chịu trách nhiệm "dịch" các yêu cầu từ Application Layer (thông qua Ports) thành các tương tác cụ thể với công nghệ hoặc framework đang sử dụng.

#### **7.2.1.1. Persistence Adapters (Ví dụ: Triển khai Repositories với TypeORM)**

- **Mục đích:** Triển khai các Repository Port được định nghĩa trong Application Layer (ví dụ: `IReferenceDataSetRepositoryPort`) để cung cấp cơ chế lưu trữ và truy xuất dữ liệu cho Domain Aggregates.
- **Triển khai (`<aggregate-root-name>.repository.adapter.ts`):**
  - Sử dụng các decorator và API của một ORM cụ thể (ví dụ: TypeORM).
  - Inject TypeORM `Repository<DBEntity>` (ví dụ: `Repository<ReferenceDataSetDBEntity>`) vào constructor.
  - **DB Entities (`typeorm/entities/<db-entity-name>.entity.ts`):**
    - Đây là các class được định nghĩa bằng cú pháp của ORM (ví dụ: `@Entity()`, `@Column()` trong TypeORM), đại diện cho cấu trúc bảng trong cơ sở dữ liệu. Chúng **khác biệt** với Domain Entities.
    - Ví dụ: `ReferenceDataSetDBEntity` sẽ có các cột tương ứng với bảng `reference_data_sets`.
  - **Mappers (`typeorm/mappers/<domain-entity-name>.db-mapper.ts`):**
    - Chứa logic để chuyển đổi hai chiều giữa Domain Aggregates/Entities và các DB Entities tương ứng.
    - Ví dụ: `ReferenceDataSetDBMapper` sẽ có phương thức `toDomain(dbEntity: ReferenceDataSetDBEntity): ReferenceDataSet` và `toPersistence(domainEntity: ReferenceDataSet): ReferenceDataSetDBEntity`.
    - Mapper này rất quan trọng để giữ cho Domain Layer không bị "ô nhiễm" bởi các chi tiết của ORM.
  - **Logic trong Repository Adapter:**
    - **`findById`**: Nhận ID (thường là một Value Object từ Domain), query DB bằng ORM, nếu tìm thấy, sử dụng mapper để chuyển DB Entity sang Domain Aggregate và trả về.
    - **`save`**: Nhận một Domain Aggregate, sử dụng mapper để chuyển nó sang DB Entity, sau đó dùng ORM để lưu (insert hoặc update) vào DB. Cần xử lý việc publish Domain Events của Aggregate sau khi transaction DB thành công (thường được điều phối ở Application Handler hoặc thông qua một event bus nội bộ của ORM nếu có).
    - **`delete`**: Xóa record khỏi DB dựa trên ID.
- **Sử dụng thư viện `common`:**
  - `common-domain`: Domain Entities/Aggregates, Value Objects.
  - `common-utils`: `ILogger` để ghi log các thao tác DB.
  - `nestjs-logging` (thư viện tùy chỉnh): Có thể cung cấp các decorator hoặc interceptor để tự động log các query DB nếu được tích hợp.

#### **7.2.1.2. Messaging Adapters (Ví dụ: RabbitMQ Event Publisher/Consumer, NATS Client/Controller)**

- **Mục đích:** Triển khai các Messaging Port từ Application Layer để gửi và nhận message (Domain Events, Commands) với các message broker như RabbitMQ hoặc NATS.
- **RabbitMQ Event Publisher (`<event-name>.event-publisher.adapter.ts`):**
  - Triển khai port `IDomainEventPublisherPort` (hoặc một port cụ thể hơn nếu cần).
  - Inject RabbitMQ client (ví dụ: `AmqpConnection` từ `@golevelup/nestjs-rabbitmq`).
  - Khi phương thức `publish` được gọi, adapter sẽ serialize Domain Event (thường thành JSON) và gửi nó đến một exchange/routing key cụ thể trên RabbitMQ.
  - Cần xử lý lỗi kết nối hoặc publish.
- **RabbitMQ Command/Event Receiver (Thường trong Workers):**
  - Sử dụng các decorator như `@RabbitSubscribe` từ `@golevelup/nestjs-rabbitmq` để lắng nghe message từ một queue cụ thể.
  - Khi nhận được message, adapter sẽ deserialize nó thành Command object hoặc Domain Event object.
  - Sau đó, gọi Command Handler hoặc một Application Service tương ứng để xử lý message.
  - Xử lý acknowledgment (ack/nack) với RabbitMQ để đảm bảo độ tin cậy.
- **NATS Client (`<service-name>.client.adapter.ts`):**
  - Dùng để gửi request đồng bộ đến một service khác trong hệ thống thông qua NATS (request/reply pattern).
  - Inject `ClientProxy` của NestJS (đã được cấu hình cho NATS).
  - Cung cấp các phương thức tương ứng với các message pattern mà service đích lắng nghe.
  - Ví dụ: `iamService.getUserPermissions(userId: string): Promise<Permission[]>`. Bên trong, nó sẽ dùng `this.natsClient.send('iam.get_user_permissions', { userId }).toPromise()`.
- **NATS Controller (`<request-handler-name>.controller.adapter.ts`):**
  - Sử dụng decorator `@MessagePattern()` của NestJS để định nghĩa các handler cho các NATS message cụ thể.
  - Khi một message NATS khớp với pattern, handler tương ứng sẽ được gọi.
  - Handler này sẽ nhận payload, gọi Application Layer (Command/Query Handler) và trả về kết quả (response) cho NATS request.
- **Sử dụng thư viện `common`:**
  - `common-types`: Các DTOs cho message payloads.
  - `common-utils`: `ILogger`.

#### **7.2.1.3. HTTP Adapters (Ví dụ: NestJS Controllers, External API Clients)**

- **NestJS Controllers (`http/controllers/<resource-name>.controller.ts`):**
  - **Mục đích:** Xử lý các HTTP request đến, là điểm vào (entry point) của service từ phía client hoặc API Gateway.
  - **Triển khai:**
    - Sử dụng các decorator của NestJS (`@Controller()`, `@Get()`, `@Post()`, `@Body()`, `@Param()`, `@Query()`, v.v.).
    - Inject các Command Handlers và Query Handlers (thông qua CQRS bus hoặc inject trực tiếp nếu không dùng bus) từ Application Layer.
    - **Validation:** Sử dụng NestJS Pipes (ví dụ: `ValidationPipe`) với các DTOs được trang trí bằng `class-validator` để tự động validate request body, params, query.
    - Gọi Command/Query Handler tương ứng với dữ liệu đã được validate.
    - Map kết quả từ Application Layer (thường là DTOs hoặc `Result` objects) thành HTTP responses (status codes, response body).
    - Sử dụng Guards của NestJS để xử lý Authentication và Authorization (ví dụ: kiểm tra JWT, vai trò người dùng).
    - Sử dụng Interceptors của NestJS cho các tác vụ cross-cutting như logging request/response, transform response, error handling.
- **External API Clients (`http/clients/<external-service-name>.client.adapter.ts`):**
  - **Mục đích:** Đóng gói logic giao tiếp với các API của bên thứ ba (ví dụ: Stripe cho thanh toán, Google Maps cho địa chỉ).
  - **Triển khai:**
    - Sử dụng `HttpService` của NestJS (`@nestjs/axios`) hoặc các thư viện HTTP client khác (axios, node-fetch).
    - Cung cấp các phương thức trừu tượng hóa việc gọi API (ví dụ: `stripeClient.createCharge(...)`).
    - Xử lý authentication (API keys), request/response parsing, error handling đặc thù của external API.
- **Sử dụng thư viện `common`:**
  - `common-types`: DTOs cho request/response.
  - `common-utils`: `ILogger`, các tiện ích error handling.
  - `nestjs-logging` (thư viện tùy chỉnh): Có thể cung cấp interceptor để tự động log các HTTP request/response.

### **7.2.2. Configuration (`config/`)**

- **Mục đích:** Quản lý tất cả các cấu hình cần thiết cho lớp Infrastructure hoạt động, như chuỗi kết nối cơ sở dữ liệu, URL của message broker, API keys, port của service, v.v.
- **Triển khai:**
  - Sử dụng module `@nestjs/config` để load cấu hình từ các file `.env` và các biến môi trường.
  - Tạo các file cấu hình có typed-schema (ví dụ: `database.config.ts`, `messaging.config.ts`) để đảm bảo tính đúng đắn và dễ truy cập của cấu hình.
  - Inject `ConfigService` từ `@nestjs/config` hoặc các service cấu hình tùy chỉnh vào các adapter cần sử dụng thông tin cấu hình.
- **Ví dụ (`database.config.ts`):**

  ```typescript
  import { registerAs } from "@nestjs/config";

  export default registerAs("database", () => ({
    type: process.env.DB_TYPE || "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: process.env.NODE_ENV === "development", // Chỉ nên true cho development
    entities: [__dirname + "/../**/*.entity{.ts,.js}"], // Đường dẫn đến DB entities
  }));
  ```

### **7.2.3. Dependency Injection (DI) và Modules NestJS**

- **DI:** NestJS sử dụng rộng rãi Dependency Injection. Tất cả các Adapters (Repositories, Publishers, Controllers), Services (ConfigService, HttpService), và các thành phần khác của Infrastructure Layer nên được đăng ký với DI container của NestJS và được inject vào nơi cần thiết.
- **`<service-name>.infrastructure.module.ts`:**
  - Đây là module NestJS chính của lớp Infrastructure cho một service cụ thể.
  - **Trách nhiệm:**
    - Import các module cần thiết khác (ví dụ: `ConfigModule.forRoot()`, `TypeOrmModule.forRootAsync()`, `RabbitMQModule.forRootAsync()`, `HttpModule`).
    - Đăng ký các providers: các lớp Repository Adapter, Event Publisher Adapter, NATS Client, External API Client, các service cấu hình.
    - Export các providers này để `AppModule` (module gốc của service) có thể import và sử dụng, hoặc để các module khác trong Infrastructure Layer có thể inject chúng.
  - Ví dụ, một `RdmCommandServiceInfrastructureModule` có thể cung cấp `ReferenceDataSetRepositoryAdapter` (triển khai `IReferenceDataSetRepositoryPort`) và `RabbitMQEventPublisherAdapter` (triển khai `IDomainEventPublisherPort`).

### **7.2.4. Sử dụng thư viện `nestjs-logging` (Thư viện tùy chỉnh)**

- Nếu dự án có thư viện `nestjs-logging` tùy chỉnh, nó có thể cung cấp:
  - Một `LoggerService` triển khai `ILogger` (từ `common-utils` hoặc interface chung) và được tích hợp sẵn với cấu trúc logging của NestJS hoặc một thư viện logging bên thứ ba như Pino, Winston.
  - Các Interceptors để tự động log HTTP requests/responses, NATS messages, hoặc thậm chí các cuộc gọi phương thức quan trọng (thông qua AOP).
  - Các Decorators để tùy chỉnh hành vi logging.
- Lớp Infrastructure là nơi chính để tích hợp và sử dụng thư viện này, ví dụ: inject `LoggerService` vào các Adapters, Controllers, hoặc sử dụng các Interceptors được cung cấp trong các module NestJS.

## **7.3. Những gì cần Test trong Lớp Infrastructure**

Việc kiểm thử lớp Infrastructure rất quan trọng để đảm bảo rằng ứng dụng của bạn tương tác chính xác với các hệ thống bên ngoài. Kiểm thử ở lớp này thường bao gồm cả Unit Test cho các logic nhỏ, độc lập và Integration Test để xác minh sự tích hợp với các dịch vụ thực tế (hoặc bản giả lập gần với thực tế).

### **7.3.1. Unit Tests**

Unit Test trong lớp Infrastructure tập trung vào các đơn vị code nhỏ, cô lập và không phụ thuộc trực tiếp vào các hệ thống bên ngoài thực sự (chúng sẽ được mock).

- **Mappers (ví dụ: Domain Entity ↔ DB Entity Mappers):**
  - Kiểm tra logic chuyển đổi dữ liệu giữa các đối tượng Domain và các đối tượng cụ thể của Infrastructure (ví dụ: TypeORM entities) hoạt động chính xác theo cả hai chiều.
  - Mock đầu vào và assert đầu ra của mapper.
- **Logic điều kiện đơn giản trong Adapters:**
  - Nếu một adapter có chứa các logic điều kiện đơn giản (ví dụ: quyết định routing key dựa trên loại event), hãy unit test các nhánh logic đó.
  - Mock các client của bên thứ ba (ví dụ: RabbitMQ client, TypeORM repository object) để cô lập logic đang test.
- **Controllers (Validation và cấu trúc cơ bản):**
  - Có thể unit test việc các DTOs được truyền đúng vào pipes validation của NestJS.
  - Kiểm tra xem controller có gọi đúng phương thức của Application Service/Handler hay không (mock service/handler).
  - Tuy nhiên, phần lớn việc test controller nên được thực hiện qua Integration Test để đảm bảo cả pipeline request của NestJS.
- **Config Services/Providers:**
  - Nếu có logic phức tạp trong việc load hoặc transform cấu hình, hãy unit test nó.

### **7.3.2. Integration Tests**

Integration Test là tối quan trọng cho lớp Infrastructure, vì chúng xác minh rằng các adapter của bạn hoạt động đúng với các dịch vụ bên ngoài mà chúng tích hợp.

- **Persistence Adapters (Repositories):**
  - **Môi trường:** Thiết lập một cơ sở dữ liệu test riêng biệt (ví dụ: một container Docker PostgreSQL riêng cho test, hoặc một SQLite in-memory nếu ORM hỗ trợ và phù hợp).
  - **Kịch bản:**
    - Lưu một Domain Aggregate (đã được map sang DB entity) và sau đó truy vấn lại để đảm bảo dữ liệu được lưu và đọc chính xác.
    - Kiểm thử các phương thức query cụ thể của repository.
    - Kiểm thử việc cập nhật và xóa dữ liệu.
    - Đảm bảo các ràng buộc của DB (unique constraints, foreign keys) hoạt động như mong đợi.
  - **Công cụ:** Sử dụng testing utilities của NestJS (`@nestjs/testing`) để tạo một testing module, inject repository adapter và TypeORM connection/repository thật (trỏ đến DB test).
- **Messaging Adapters (Publishers/Consumers):**
  - **Môi trường:** Thiết lập một message broker test (ví dụ: container Docker RabbitMQ riêng cho test).
  - **Publishers:**
    - Test việc publish một message/event và xác minh rằng message đó xuất hiện trên broker với đúng payload, exchange, và routing key (có thể dùng một consumer test để lắng nghe).
  - **Consumers (ví dụ: trong Workers):**
    - Gửi một message test lên broker.
    - Xác minh rằng consumer nhận được message, deserialize nó đúng, và gọi đúng Application Handler/Service.
    - Kiểm tra việc xử lý ack/nack.
  - **NATS Request/Reply:**
    - Tương tự, thiết lập một NATS server test.
    - Test việc client gửi request và nhận được response chính xác từ một NATS controller (đã được host trong một testing module).
- **HTTP Controllers:**
  - **Môi trường:** Sử dụng `@nestjs/testing` để tạo một instance của ứng dụng NestJS trong bộ nhớ.
  - **Công cụ:** Sử dụng thư viện `supertest` để gửi HTTP request đến các endpoint của controller.
  - **Kịch bản:**
    - Kiểm tra các status code trả về cho các request hợp lệ và không hợp lệ.
    - Kiểm tra response body có đúng cấu trúc và dữ liệu mong đợi.
    - Kiểm tra DTO validation (pipes) hoạt động đúng (trả về lỗi 4xx khi payload không hợp lệ).
    - Kiểm tra Guards (Authentication/Authorization) hoạt động đúng.
    - Kiểm tra Interceptors (nếu có) hoạt động đúng.
    - Mock các Application Command/Query Handlers được gọi bởi controller để cô lập controller khỏi logic nghiệp vụ phức tạp trong các test này, tập trung vào pipeline HTTP.
- **External API Clients:**
  - **Mock Server:** Sử dụng các thư viện như `nock` hoặc `msw` (Mock Service Worker) để giả lập các external API endpoints.
  - **Kịch bản:**
    - Kiểm tra client adapter gửi request đến đúng endpoint với đúng method, headers, và payload.
    - Kiểm tra client adapter xử lý các response thành công và lỗi từ mock server một cách chính xác.
    - Kiểm tra việc retry, timeout (nếu có) hoạt động.

### **7.3.3. End-to-End (E2E) Tests**

- Mặc dù không hoàn toàn thuộc về "test lớp Infrastructure" một cách riêng biệt, E2E tests (thường nằm trong thư mục `e2e/` của monorepo) sẽ kiểm thử toàn bộ luồng của một service, bao gồm cả lớp Infrastructure tương tác với các dịch vụ phụ thuộc thực sự (hoặc các bản test double cao cấp).
- E2E tests cho một service API sẽ gửi HTTP request thật đến service đang chạy và kiểm tra response cuối cùng, có thể bao gồm cả việc kiểm tra trạng thái thay đổi trong DB hoặc message được publish ra broker.

**Lưu ý quan trọng khi test Infrastructure:**

- **Cô lập:** Cố gắng cô lập các bài test. Ví dụ, khi test persistence adapter, bạn không muốn nó phụ thuộc vào một message broker đang chạy.
- **Tốc độ:** Integration tests thường chậm hơn Unit tests. Tối ưu hóa việc thiết lập và dọn dẹp môi trường test (ví dụ: truncate bảng thay vì drop/create DB cho mỗi test).
- **Độ tin cậy:** Các bài test phụ thuộc vào môi trường bên ngoài có thể không ổn định (flaky). Đảm bảo môi trường test của bạn ổn định và có cơ chế retry hợp lý cho các flaky tests nếu cần.
- **Sử dụng `common-testing`:** Tận dụng các tiện ích, mock factories, hoặc test environment setup helpers từ `libs/common/common-testing` nếu có.

## **7.4. Thực hành tốt nhất cho Lớp Infrastructure**

Để xây dựng một lớp Infrastructure hiệu quả, dễ bảo trì, và đáng tin cậy, hãy tuân theo các thực hành tốt nhất sau:

1.  **Tuân Thủ Nghiêm Ngặt các Ports (Interfaces):**

    - Lớp Infrastructure **phải** triển khai các interfaces (Ports) được định nghĩa bởi lớp Application (ví dụ: `IRepositoryPort`, `IEventPublisherPort`). Điều này đảm bảo sự tách biệt giữa Application và Infrastructure, cho phép thay đổi chi tiết triển khai hạ tầng mà không ảnh hưởng đến logic nghiệp vụ.

2.  **Đóng Gói Chi Tiết Công Nghệ:**

    - Toàn bộ code liên quan đến một công nghệ cụ thể (ví dụ: TypeORM, RabbitMQ, NestJS controllers) phải được đóng gói hoàn toàn trong lớp Infrastructure. Lớp Application và Domain không được biết về các chi tiết này.

3.  **Quản Lý Cấu Hình Tập Trung và An Toàn:**

    - Sử dụng các cơ chế như `@nestjs/config` để quản lý cấu hình từ biến môi trường hoặc file `.env`.
    - **Không bao giờ** hardcode credentials, API keys, hoặc các thông tin nhạy cảm khác trực tiếp trong code. Sử dụng các công cụ quản lý secret nếu cần thiết cho môi trường production.
    - Cung cấp các giá trị mặc định hợp lý cho cấu hình trong môi trường development.

4.  **Xử Lý Lỗi (Error Handling) Cẩn Thận:**

    - Bắt và xử lý các lỗi đặc thù của từng công nghệ (ví dụ: lỗi kết nối DB, lỗi publish message, lỗi từ external API).
    - Nếu cần, chuyển đổi (map) các lỗi hạ tầng thành các lỗi nghiệp vụ hoặc lỗi ứng dụng chung hơn (đã định nghĩa ở Domain/Application layer) để lớp Application có thể xử lý một cách nhất quán. Tránh để lộ chi tiết lỗi của hạ tầng lên các lớp trên.
    - Sử dụng `ILogger` để ghi log chi tiết các lỗi hạ tầng giúp cho việc điều tra sự cố.

5.  **Tận Dụng Tối Đa Framework (NestJS):**

    - Sử dụng các tính năng mạnh mẽ của NestJS như Dependency Injection, Modules, Pipes (cho validation), Guards (cho authN/authZ), Interceptors (cho logging, transformation, caching), Exception Filters một cách hiệu quả.
    - Việc này giúp code ngắn gọn, dễ đọc và tuân thủ các chuẩn của framework.

6.  **Thiết Kế Adapters Có Khả Năng Tái Sử Dụng (khi hợp lý):**

    - Nếu có các logic adapter chung có thể áp dụng cho nhiều Aggregate hoặc nhiều loại message, hãy xem xét tạo các lớp cơ sở (base classes) hoặc các utility functions trong thư viện `libs/<bc-name>-infrastructure/` (nếu có) hoặc trong chính thư mục `infrastructure/` của app.

7.  **Chú Trọng Đến Độ Tin Cậy và Khả Năng Phục Hồi:**

    - Đối với các tương tác với hệ thống bên ngoài (đặc biệt là qua mạng), xem xét triển khai các cơ chế như retry (thử lại), timeout, và circuit breaker (ngắt mạch) để tăng tính ổn định cho ứng dụng.
    - Đảm bảo xử lý acknowledgment (ack/nack) đúng cách với message brokers để tránh mất message.

8.  **Tách Biệt Read/Write Concerns ở Mức Hạ Tầng (nếu cần):**

    - Đối với các hệ thống có yêu cầu cao về hiệu năng đọc, lớp Infrastructure có thể triển khai các cơ chế đọc dữ liệu tối ưu hóa (ví dụ: kết nối đến read replica DB, sử dụng các bảng đã được denormalize) cho các Query Handler, tách biệt hoàn toàn với luồng ghi dữ liệu của Command Handlers.

9.  **Bảo Mật là Ưu Tiên:**

    - Luôn xem xét các khía cạnh bảo mật khi triển khai lớp Infrastructure: bảo vệ API keys, quản lý kết nối an toàn (HTTPS, SSL/TLS cho DB và message broker), validate dữ liệu đầu vào từ các nguồn không tin cậy.

10. **Tổ Chức Module Rõ Ràng (`<service-name>.infrastructure.module.ts`):**

    - Module Infrastructure của NestJS nên được tổ chức tốt, import các module cần thiết (như `TypeOrmModule`, `ConfigModule`), đăng ký và export các providers (adapters) một cách rõ ràng.

11. **Sử dụng Mappers cho Sự Tách Biệt:**

    - Luôn sử dụng mappers để chuyển đổi giữa Domain Objects và các cấu trúc dữ liệu cụ thể của Infrastructure (ví dụ: DB Entities, DTOs của external API). Điều này giúp giảm coupling và tăng tính linh hoạt.

12. **Logging Chi Tiết và Có Ý Nghĩa:**

    - Sử dụng `ILogger` (thông qua `nestjs-logging` hoặc tương đương) để ghi lại các thông tin quan trọng về hoạt động của lớp Infrastructure: các kết nối được thiết lập, các query DB được thực thi (cẩn thận với dữ liệu nhạy cảm), các message được gửi/nhận, các request đến external API, và các lỗi xảy ra. Log phải đủ chi tiết để hỗ trợ việc gỡ lỗi và giám sát.

13. **Tận dụng các Thư viện `common`:**
    - Sử dụng `common-utils` cho `ILogger` và các tiện ích khác.
    - Nếu có `common-nestjs`, nó có thể cung cấp các module, interceptor, guard, hoặc pipe dùng chung cho các ứng dụng NestJS trong dự án.
