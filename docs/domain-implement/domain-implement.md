# Hướng dẫn triển khai lớp Domain trong phân rã nghiệp vụ Ecoma

> Nếu có mâu thuẫn giữa quy tắc chung và quy tắc riêng của lớp này, quy tắc riêng sẽ được ưu tiên.

## 1. Coding Convention

Ngoài các coding convention chung của dự án (xem tài liệu Quy ước lập trình chung Ecoma), các quy định dưới đây là bắt buộc riêng cho lớp Domain:
- Không được phép import, sử dụng bất kỳ framework, thư viện hạ tầng, ORM, hoặc code liên quan đến persistence, UI, HTTP, message broker, v.v.
- Chỉ sử dụng các abstraction generic (nếu cần) từ common-domain, không định nghĩa repository interface đặc thù tại đây.

---

## 2. Cấu trúc thư mục mẫu cho `<bc-name>-domain`

> **Lưu ý:**
> - Chỉ tạo các thư mục/file đúng template dưới đây (trừ khi có phê duyệt đặc biệt từ kiến trúc sư dự án).
> - Có thể không có một số thư mục/file nếu không cần thiết.
> - Không định nghĩa repository interface đặc thù trong domain (chỉ dùng abstraction generic từ common-domain nếu thực sự cần).
> - Không import framework, ORM, code hạ tầng, không logging trong domain.
> - Mỗi thư mục con đều có file `index.ts` để export các thành phần.

```bash
├── aggregates/
│   ├── <aggregate-root-name>.aggregate.ts
│   ├── <aggregate-root-name>.aggregate.test.ts
│   └── index.ts
├── entities/
│   ├── <entity-name>.entity.ts
│   ├── <entity-name>.entity.test.ts
│   └── index.ts
├── value-objects/
│   ├── <value-object-name>.vo.ts
│   ├── <value-object-name>.vo.test.ts
│   └── index.ts
├── domain-services/
│   ├── <service-name>.service.ts
│   ├── <service-name>.service.test.ts
│   └── index.ts
├── ports/
│   ├── <port-name>.port.ts
│   └── index.ts
├── errors/
│   ├── <error-name>.error.ts
│   └── index.ts
├── specifications/
│   ├── <specification-name>.specification.ts
│   └── index.ts
├── factories/
│   ├── <factory-name>.factory.ts
│   └── index.ts
├── policies/
│   ├── <policy-name>.policy.ts
│   └── index.ts
├── constants/
│   ├── <constant-name>.constant.ts
│   ├── <enum-name>.enum.ts
│   └── index.ts
├── validators/
│   ├── <validator-name>.validator.ts
│   └── index.ts
└── index.ts
```

| Thư mục         | Ý nghĩa/nghiệp vụ | Ví dụ file template                |
|-----------------|------------------|------------------------------------|
| aggregates/     | Aggregate Root   | `<aggregate-root-name>.aggregate.ts` |
| entities/       | Entity           | `<entity-name>.entity.ts`            |
| value-objects/  | Value Object     | `<value-object-name>.vo.ts`          |
| domain-services/| Domain Service   | `<service-name>.service.ts`          |
| ports/          | Port interface   | `<port-name>.port.ts`                |
| errors/         | Lỗi nghiệp vụ    | `<error-name>.error.ts`              |
| specifications/ | Specification    | `<specification-name>.specification.ts` |
| factories/      | Factory          | `<factory-name>.factory.ts`          |
| policies/       | Policy           | `<policy-name>.policy.ts`            |
| constants/      | Hằng số, Enum    | `<constant-name>.constant.ts`, `<enum-name>.enum.ts` |
| validators/     | Validator        | `<validator-name>.validator.ts`        |

---

## 3. Giải thích các thành phần (và sử dụng thư viện `common`)

### 3.1. Aggregates (Thư mục `aggregates/`)

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

**Ví dụ triển khai Aggregate:**
```typescript
// aggregates/order.aggregate.ts
import { AbstractAggregate } from '@ecoma/common-domain';
import { OrderId } from '../value-objects/order-id.vo';
import { OrderCreatedEvent } from '@ecoma/order-events';
import { OrderStatus } from '../constants/order-status.enum';
import { DomainError } from '@ecoma/common-domain';

export interface OrderProps {
  readonly customerId: string;
  status: OrderStatus;
  readonly items: Array<{ productId: string; quantity: number }>;
}

export class Order extends AbstractAggregate<OrderId, OrderProps> {
  constructor(id: OrderId, props: OrderProps) {
    super(id, props);
    if (!props.customerId || !props.items.length) {
      throw new DomainError('INVALID_ORDER', 'CustomerId and items are required');
    }
  }

  public confirm() {
    if (this.props.status !== OrderStatus.Pending) {
      throw new DomainError('ORDER_NOT_PENDING', 'Order must be pending to confirm');
    }
    this.props.status = OrderStatus.Paid;
    this.addDomainEvent(new OrderCreatedEvent(this.id.value, this.props.customerId));
  }
}
```

```typescript
// aggregates/order.aggregate.test.ts
import { Order } from './order.aggregate';
import { OrderId } from '../value-objects/order-id.vo';
import { OrderStatus } from '../constants/order-status.enum';
import { EventTestingHelper } from '@ecoma/common-testing';

describe('Order Aggregate', () => {
  it('khởi tạo hợp lệ', () => {
    const order = new Order(new OrderId('o1'), { customerId: 'c1', status: OrderStatus.Pending, items: [{ productId: 'p1', quantity: 2 }] });
    expect(order.props.customerId).toBe('c1');
  });
  it('confirm sẽ phát OrderCreatedEvent', () => {
    const order = new Order(new OrderId('o1'), { customerId: 'c1', status: OrderStatus.Pending, items: [{ productId: 'p1', quantity: 2 }] });
    order.confirm();
    EventTestingHelper.expectEventPublished(order.getDomainEvents(), 'OrderCreatedEvent', { orderId: 'o1', customerId: 'c1' });
  });
  it('không cho confirm nếu không ở trạng thái pending', () => {
    const order = new Order(new OrderId('o1'), { customerId: 'c1', status: OrderStatus.Paid, items: [{ productId: 'p1', quantity: 2 }] });
    expect(() => order.confirm()).toThrowError('Order must be pending to confirm');
  });
});
```

### 3.2. Entities (Thư mục `entities/`)

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

**Ví dụ triển khai Entity:**
```typescript
// entities/order-item.entity.ts
import { AbstractEntity } from '@ecoma/common-domain';
import { OrderItemId } from '../value-objects/order-item-id.vo';

export interface OrderItemProps {
  readonly productId: string;
  quantity: number;
}

export class OrderItem extends AbstractEntity<OrderItemId, OrderItemProps> {
  constructor(id: OrderItemId, props: OrderItemProps) {
    super(id, props);
    if (!props.productId || props.quantity <= 0) {
      throw new Error('Invalid order item');
    }
  }
  increaseQuantity(amount: number) {
    this.props.quantity += amount;
  }
}
```

### 3.3. Value Objects (Thư mục `value-objects/`)

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

**Ví dụ triển khai Value Object:**
```typescript
// value-objects/order-id.vo.ts
import { AbstractValueObject } from '@ecoma/common-domain';

export class OrderId extends AbstractValueObject<{ value: string }> {
  get value() {
    return this.props.value;
  }
  constructor(value: string) {
    super({ value });
    if (!value || value.length < 3) {
      throw new Error('OrderId không hợp lệ');
    }
    Object.freeze(this);
  }
  equals(other?: OrderId): boolean {
    return !!other && this.value === other.value;
  }
}
```

### 3.4. Domain Events (Thư viện `<bc-name>-events`)

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

**Ví dụ triển khai Domain Event:**
```typescript
// order-created.event.ts (trong thư viện order-events/src/lib)
import { AbstractDomainEvent } from '@ecoma/common-domain';

export class OrderCreatedEvent extends AbstractDomainEvent {
  constructor(
    public readonly orderId: string,
    public readonly customerId: string
  ) {
    super();
  }
}
```

```typescript
// order-created.event.test.ts
import { OrderCreatedEvent } from './order-created.event';

describe('OrderCreatedEvent', () => {
  it('khởi tạo đúng payload', () => {
    const event = new OrderCreatedEvent('o1', 'c1');
    expect(event.orderId).toBe('o1');
    expect(event.customerId).toBe('c1');
    expect(event).toHaveProperty('id');
    expect(event).toHaveProperty('timestamp');
  });
});
```

### 3.5. Domain Services (Thư mục `domain-services/`)

- **Mục đích:** Đôi khi có những logic nghiệp vụ không thuộc về một Aggregate hay Entity cụ thể nào, hoặc liên quan đến nhiều Aggregate/Entity khác nhau. Domain Service sẽ đóng gói logic này.
- **Triển khai:**
  - Là các lớp không trạng thái (stateless).
  - Các phương thức của Domain Service nhận các đối tượng domain (Aggregates, Entities, Value Objects) làm tham số.
  - Không nên chứa logic liên quan đến infrastructure (ví dụ: gọi API, truy cập DB trực tiếp).
- **Unit Test (`<service-name>.service.test.ts`):**
  - Mock các đối tượng domain đầu vào.
  - Kiểm tra xem Domain Service có gọi đúng các phương thức trên các đối tượng domain đó không.
  - Kiểm tra kết quả trả về của Domain Service.

**Ví dụ triển khai Domain Service:**
```typescript
// domain-services/order-discount.service.ts
import { Order } from '../aggregates/order.aggregate';

export class OrderDiscountService {
  static calculateDiscount(order: Order): number {
    if (order.props.items.length > 5) return 0.1;
    return 0;
  }
}
```

```typescript
// domain-services/order-discount.service.test.ts
import { OrderDiscountService } from './order-discount.service';
import { Order } from '../aggregates/order.aggregate';
import { OrderId } from '../value-objects/order-id.vo';
import { OrderStatus } from '../constants/order-status.enum';

describe('OrderDiscountService', () => {
  it('tính discount đúng', () => {
    const order = new Order(new OrderId('o1'), { customerId: 'c1', status: OrderStatus.Pending, items: Array(6).fill({ productId: 'p1', quantity: 1 }) });
    expect(OrderDiscountService.calculateDiscount(order)).toBe(0.1);
  });
  it('không discount nếu ít hơn 6 item', () => {
    const order = new Order(new OrderId('o1'), { customerId: 'c1', status: OrderStatus.Pending, items: Array(3).fill({ productId: 'p1', quantity: 1 }) });
    expect(OrderDiscountService.calculateDiscount(order)).toBe(0);
  });
});
```

### 3.6. Errors (Thư mục `errors/`)

- **Mục đích:** Định nghĩa các lớp lỗi tùy chỉnh cho các tình huống lỗi nghiệp vụ cụ thể trong domain. Việc tập trung các lỗi vào một thư mục `errors/` giúp dễ quản lý và tham chiếu, tương đồng với cách `common-domain` có thể tổ chức các lỗi chung.
- **Triển khai:**
  - Đặt trong thư mục `libs/domains/<bc-name>/<bc-name>-domain/src/lib/errors/`.
  - **Luôn kế thừa từ `DomainError` trong `libs/common/common-domain`** để đảm bảo tính nhất quán trong cách xử lý lỗi và cung cấp thông tin lỗi. KHÔNG kế thừa trực tiếp từ `Error`.
  - Tên file và tên lớp nên mô tả rõ ràng tình huống lỗi. Ví dụ: `ReferenceDataSetNotFoundError` trong file `reference-data-set-not-found.error.ts`.
- **Sử dụng thư viện `common`:**
  - `common-domain`: Kế thừa từ `DomainError`.

**Ví dụ triển khai Error:**
```typescript
// errors/order-not-found.error.ts
import { DomainError } from '@ecoma/common-domain';

export class OrderNotFoundError extends DomainError<{orderId: string}> {
  constructor(orderId: string) {
    super('ORDER_NOT_FOUND', 'Order with id {orderId} not found', { orderId }, { orderId });
  }
}
```

```typescript
// errors/order-not-found.error.test.ts
import { OrderNotFoundError } from './order-not-found.error';

describe('OrderNotFoundError', () => {
  it('khởi tạo đúng thông tin', () => {
    const err = new OrderNotFoundError('o1');
    expect(err.code).toBe('ORDER_NOT_FOUND');
    expect(err.message).toContain('Order with id {orderId} not found');
    expect(err.details).toEqual({ orderId: 'o1' });
  });
});
```

### 3.7. Ports (Thư mục `ports/`)

> **Cảnh báo:** Không định nghĩa các repository interface đặc thù cho từng aggregate/domain tại đây. Chỉ sử dụng các abstraction generic nếu cần (import từ `common-domain`).

- **Mục đích:** Thư mục này, trước đây có thể được gọi là `interfaces/`, chứa định nghĩa các "Ports" theo thuật ngữ của Hexagonal Architecture (Ports and Adapters). Đây là các interface mà lớp Domain _cần_ để tương tác với thế giới bên ngoài (ví dụ: persistence, message brokers, các dịch vụ bên ngoài khác mà Domain Service cần gọi một cách trừu tượng).
  - Ví dụ phổ biến nhất của port là Repository interface (ví dụ: `IReferenceDataSetRepository`). Tuy nhiên, theo nhiều trường phái Clean Architecture, Repository interface thường được định nghĩa ở Application Layer vì nó mô tả cách Application Layer muốn tương tác với persistence. **Trong dự án Ecoma, chúng ta thống nhất đặt Repository Interfaces tại Application Layer.**
  - Do đó, thư mục `ports/` trong lớp Domain sẽ ít được sử dụng hơn, chủ yếu dành cho các trường hợp Domain Service cần trừu tượng hóa một số phụ thuộc mà không phải là repository (ví dụ: một `ICurrencyExchangeService` nếu logic nghiệp vụ cần thông tin tỷ giá từ một nguồn trừu tượng).
- **Triển khai:**
  - Định nghĩa các interface TypeScript.
  - Các interface này sẽ được các "Adapters" ở lớp Infrastructure triển khai.
- **Lưu ý:** Cân nhắc kỹ trước khi thêm port ở đây. Đa phần các nhu cầu giao tiếp ra bên ngoài của domain sẽ được Application Layer điều phối thông qua các port do Application Layer định nghĩa (như Repositories).

> **Khi nào nên có port ở domain?**
> Chỉ khi domain service cần gọi external service một cách trừu tượng (ví dụ: cần lấy tỷ giá ngoại tệ, kiểm tra trạng thái dịch vụ bên ngoài mà logic nghiệp vụ phụ thuộc trực tiếp).
>
> **Ví dụ:**
> ```typescript
> // Chỉ khi domain service cần gọi external service một cách trừu tượng
> export interface ICurrencyExchangeService {
>   getExchangeRate(from: Currency, to: Currency): Promise<number>;
> }
> ```

## 2.3. Những gì cần Unit Test trong Lớp Domain

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

## 2.4. Thực hành tốt nhất cho Lớp Domain

**Checklist thực hành tốt nhất cho Domain Layer:**

1. **Chỉ chứa logic nghiệp vụ thuần túy:** Không import framework, không persistence, không logging.
2. **Sử dụng ngôn ngữ chung (Ubiquitous Language):** Tên class, method, property phản ánh đúng nghiệp vụ.
3. **Ưu tiên bất biến (Immutability):** Value Object luôn bất biến, Aggregate/Entity thay đổi có kiểm soát.
4. **Mô hình domain phong phú:** Tránh anemic model, logic nghiệp vụ nằm trong domain object.
5. **Ranh giới Bounded Context rõ ràng:** Không rò rỉ logic giữa các BC.
6. **Phụ thuộc rõ ràng:** Domain service nhận dependency qua constructor/method, không global state.
7. **Gắn kết cao, liên kết thấp:** Nhóm các khái niệm liên quan, giảm phụ thuộc không cần thiết.
8. **Tell, Don't Ask:** Để domain object tự thực hiện hành động thay vì lấy dữ liệu rồi xử lý bên ngoài.
9. **Fail fast, validation sớm:** Validate đầu vào ngay tại constructor/factory/method.
10. **Sử dụng Domain Event cho side effect:** Aggregate phát event khi thay đổi trạng thái quan trọng.
11. **Aggregate nhỏ, tập trung:** Đảm bảo tính nhất quán, tránh aggregate quá lớn.
12. **Khả năng kiểm thử cao:** Viết unit test kỹ lưỡng, không phụ thuộc hạ tầng.
13. **Tận dụng thư viện common:** Luôn kiểm tra common trước khi tự định nghĩa lại.
14. **Tổ chức code và index.ts:** Mỗi thư mục con có index.ts, import qua thư mục.
15. **Logging:** Không logging ở domain layer.
16. **Chỉ dùng validators/ khi validation nghiệp vụ động/phức tạp, còn lại ưu tiên validate trực tiếp.**

---

## Bảng tổng hợp các thư viện common

| Thư viện         | Mục đích chính                |
|------------------|------------------------------|
| common-domain    | AbstractAggregate, Entity, ValueObject, DomainError, ... |
| common-types     | Result, Nullable, Maybe, ... |
| common-utils     | ILogger, helper functions    |
| common-testing   | MockFactory, AssertionHelpers, ... |

### 2.2.x. Specifications (`specifications/`)
- **Mục đích:** Định nghĩa các quy tắc nghiệp vụ phức tạp, điều kiện lọc, rule engine, hoặc các điều kiện kiểm tra mà có thể tái sử dụng ở nhiều nơi trong domain.
- **Khi nào nên dùng:** Khi có các điều kiện nghiệp vụ phức tạp, lặp lại ở nhiều nơi, hoặc muốn tách biệt logic kiểm tra khỏi entity/aggregate/service.
- **Best practice:**
  - Đặt tên rõ ràng, mô tả đúng ý nghĩa nghiệp vụ.
  - Mỗi specification là một class riêng, có thể kết hợp (AND/OR/NOT) với các specification khác nếu cần.
- **Ví dụ:**
  ```typescript
  // is-active-customer.specification.ts
  export class IsActiveCustomerSpecification {
    isSatisfiedBy(customer: Customer): boolean {
      return customer.status === 'active' && !customer.isLocked;
    }
  }
  ```

**Ví dụ triển khai Specification:**
```typescript
// specifications/is-active-customer.specification.ts
export class IsActiveCustomerSpecification {
  isSatisfiedBy(customer: { status: string; isLocked: boolean }): boolean {
    return customer.status === 'active' && !customer.isLocked;
  }
}
```

### 2.2.x. Factories (`factories/`)
- **Mục đích:** Đóng gói logic khởi tạo phức tạp cho Aggregate/Entity, giúp tách biệt logic tạo mới khỏi constructor.
- **Khi nào nên dùng:** Khi việc khởi tạo Aggregate/Entity cần nhiều bước, validation, hoặc phụ thuộc vào nhiều giá trị đầu vào/phụ thuộc khác.
- **Best practice:**
  - Factory nên là class hoặc static method, trả về instance hợp lệ hoặc ném lỗi nếu không hợp lệ.
  - Đặt tên rõ ràng, ví dụ: `OrderFactory`, `UserFactory`.
- **Ví dụ:**
  ```typescript
  // order.factory.ts
  export class OrderFactory {
    static createFromCart(cart: Cart): Order {
      // ... logic chuyển cart thành order, validate, ...
      return new Order(...);
    }
  }
  ```

**Ví dụ triển khai Factory:**
```typescript
// factories/order.factory.ts
import { Order } from '../aggregates/order.aggregate';
import { OrderId } from '../value-objects/order-id.vo';

export class OrderFactory {
  static createFromCart(cart: { customerId: string; items: Array<{ productId: string; quantity: number }> }): Order {
    // ... logic chuyển cart thành order, validate, ...
    return new Order(new OrderId('generated-id'), { customerId: cart.customerId, status: 'pending', items: cart.items });
  }
}
```

### 2.2.x. Policies (`policies/`)
- **Mục đích:** Định nghĩa các chính sách nghiệp vụ (business policy) phức tạp, có thể thay đổi độc lập với entity/aggregate/service.
- **Khi nào nên dùng:** Khi có các quy tắc nghiệp vụ dạng policy (ví dụ: tính chiết khấu, tính phí vận chuyển, ...), hoặc muốn dễ dàng thay đổi/chuyển đổi policy mà không ảnh hưởng đến domain core.
- **Best practice:**
  - Mỗi policy là một class riêng, có thể inject vào service/aggregate nếu cần.
  - Đặt tên rõ ràng, ví dụ: `DiscountPolicy`, `ShippingPolicy`.
- **Ví dụ:**
  ```typescript
  // discount-policy.ts
  export class DiscountPolicy {
    calculateDiscount(order: Order): number {
      // ... logic tính chiết khấu ...
      return ...;
    }
  }
  ```

**Ví dụ triển khai Policy:**
```typescript
// policies/discount-policy.ts
import { Order } from '../aggregates/order.aggregate';

export class DiscountPolicy {
  calculateDiscount(order: Order): number {
    // ... logic tính chiết khấu ...
    if (order.props.items.length > 10) return 0.15;
    if (order.props.items.length > 5) return 0.1;
    return 0;
  }
}
```

### 2.2.x. Constants & Enums (`constants/`)
- **Mục đích:** Tập trung các hằng số nghiệp vụ, enum dùng chung cho domain để dễ quản lý, tra cứu, tránh lặp lại magic number/string.
- **Khi nào nên dùng:** Khi có các giá trị hằng số, enum nghiệp vụ xuất hiện ở nhiều nơi trong domain (trạng thái, loại, vai trò, ...).
- **Best practice:**
  - Đặt tên rõ ràng, phân biệt rõ constant và enum.
  - Enum nên dùng TypeScript enum hoặc union type.
  - Đặt trong file riêng, import dùng chung.
- **Ví dụ:**
  ```typescript
  // order-status.enum.ts
  export enum OrderStatus {
    Pending = 'pending',
    Paid = 'paid',
    Cancelled = 'cancelled',
  }

  // user-role.constant.ts
  export const USER_ROLES = ['admin', 'user', 'guest'] as const;
  ```

**Ví dụ triển khai Enum & Constant:**
```typescript
// constants/order-status.enum.ts
export enum OrderStatus {
  Pending = 'pending',
  Paid = 'paid',
  Cancelled = 'cancelled',
}

// constants/user-role.constant.ts
export const USER_ROLES = ['admin', 'user', 'guest'] as const;
```

### 3.x. Validators (Thư mục `validators/`)

- **Mục đích:** Gom các validator nghiệp vụ động/phức tạp, khi cần validate nhiều rule, hoặc muốn trả về nhiều lỗi cùng lúc (pattern validator).
- **Khi nào nên dùng:**
  - Khi validation nghiệp vụ phức tạp, nhiều rule động, hoặc cần gom rule, hoặc muốn trả về nhiều lỗi cùng lúc.
  - Không nên dùng cho validation đơn giản (ưu tiên validate trực tiếp trong constructor/factory hoặc function đơn giản).
- **Triển khai:**
  - Sử dụng interface `IValidator`, `IValidationRule` từ `common-domain`.
  - Mỗi validator là một class, gom nhiều rule lại, trả về kết quả tổng hợp.
- **Ví dụ:**

```typescript
// validators/order.validator.ts
import { IValidator, IValidatorResult, IValidationRule } from '@ecoma/common-domain';
import { Order } from '../aggregates/order.aggregate';

class OrderMustHaveAtLeastOneItemRule implements IValidationRule<Order> {
  getName() { return 'OrderMustHaveAtLeastOneItem'; }
  getDescription() { return 'Order phải có ít nhất 1 item'; }
  validate(order: Order) {
    if (!order.props.items || order.props.items.length === 0) {
      return { field: 'items', message: 'Order phải có ít nhất 1 item', code: 'NO_ITEM' };
    }
    return null;
  }
}

export class OrderValidator implements IValidator<Order> {
  private rules: IValidationRule<Order>[] = [new OrderMustHaveAtLeastOneItemRule()];
  validate(order: Order): IValidatorResult {
    const errors = this.rules
      .map(rule => rule.validate(order))
      .filter(e => e !== null) as any[];
    return { isValid: errors.length === 0, errors };
  }
}
```
