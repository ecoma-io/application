# Common Domain (@ecoma/common-domain)

Thư viện này cung cấp các khối xây dựng cốt lõi (building blocks) và các mẫu thiết kế (patterns) chung cho tầng Domain Driven Design (DDD) trong hệ thống Microservices của Ecoma. Mục đích chính là đảm bảo tính nhất quán, tái sử dụng và chuẩn hóa cách các Bounded Context định nghĩa và làm việc với các khái niệm nghiệp vụ cốt lõi.

## 📚 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Cài đặt](#cài-đặt)
- [Kiến trúc](#kiến-trúc)
- [Các thành phần chính](#các-thành-phần-chính)
  - [Entity](#entity)
  - [Aggregate](#aggregate)
  - [Value Object](#value-object)
  - [Domain Event](#domain-event)
  - [Repository](#repository)
  - [Event Bus](#event-bus)
  - [Domain Error](#domain-error)
- [Ví dụ sử dụng](#ví-dụ-sử-dụng)
- [Unit Testing](#unit-testing)
- [Contributing](#contributing)

## 🚀 Giới thiệu

`@ecoma/common-domain` cung cấp các lớp trừu tượng và interface chuẩn hóa để triển khai Domain Driven Design (DDD) và Clean Architecture trong hệ thống Microservices. Thư viện này được thiết kế để:

- Đảm bảo tính nhất quán khi áp dụng DDD và Clean Architecture giữa các Bounded Context
- Giảm thiểu boilerplate code và tăng tốc độ phát triển
- Chuẩn hóa cách xử lý domain objects, events, và repositories
- Hỗ trợ tách biệt giữa domain logic và infrastructure concerns
- Tạo điều kiện thuận lợi cho việc kiểm thử domain logic

## 📦 Cài đặt

Thư viện này đã được cài đặt sẵn như một phần của monorepo Ecoma. Để sử dụng trong một dự án/service:

```typescript
// package.json của service/domain của bạn đã có sẵn dependency
"dependencies": {
  "@ecoma/common-domain": "*",
  // ... other dependencies
}
```

Sau đó import các thành phần cần dùng:

```typescript
import { AbstractEntity, AbstractAggregate, AbstractDomainEvent } from "@ecoma/common-domain";
```

## 🏗️ Kiến trúc

Thư viện được tổ chức theo các thành phần cốt lõi của DDD:

```
lib/
  ├── aggregates/      # Aggregate roots
  ├── entity/          # Domain entities
  ├── errors/          # Domain errors
  ├── events/          # Domain events
  ├── ports/           # Interface ports (repositories, services)
  ├── value-object/    # Value objects
  └── index.ts         # Public API
```

## 🧩 Các thành phần chính

### Entity

Entities là các đối tượng domain có identity (định danh) và có thể thay đổi trạng thái. Các entity được định danh bằng ID (value object) và props.

```typescript
import { AbstractEntity, IEntityProps, AbstractId } from "@ecoma/common-domain";

class ProductId extends AbstractId {}

interface ProductProps extends IEntityProps<ProductId> {
  name: string;
  price: number;
}

class Product extends AbstractEntity<ProductId, ProductProps> {
  constructor(props: ProductProps) {
    super(props);
  }
  get id() {
    return this.$props.id;
  }
  get name() {
    return this.$props.name;
  }
  get price() {
    return this.$props.price;
  }
  updatePrice(newPrice: number) {
    if (newPrice <= 0) throw new Error("Price must be positive");
    this.$props.price = newPrice;
  }
}
```

### Aggregate

Aggregates là các cụm entity được coi như một đơn vị duy nhất cho mục đích thay đổi dữ liệu. Mỗi aggregate có một root entity (aggregate root) quản lý quyền truy cập vào các entity con bên trong nó.

```typescript
import { AbstractAggregate, IEntityProps, AbstractId } from "@ecoma/common-domain";

class OrderId extends AbstractId {}

interface OrderProps extends IEntityProps<OrderId> {
  customerName: string;
  // ...other fields
}

class Order extends AbstractAggregate<OrderId, OrderProps> {
  constructor(props: OrderProps) {
    super(props);
  }
  // ...methods
}
```

### Value Object

Value Objects là các đối tượng không có định danh (ID) và được xác định bằng giá trị của các thuộc tính. Value Objects là immutable (không thể thay đổi).

```typescript
import { AbstractValueObject, Email } from "@ecoma/common-domain";

class Money extends AbstractValueObject<Money> {
  readonly amount: number;
  readonly currency: string;
  constructor(amount: number, currency: string) {
    super();
    this.amount = amount;
    this.currency = currency;
  }
  protected equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }
  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error("Cannot add money with different currencies");
    }
    return new Money(this.amount + other.amount, this.currency);
  }
}
// Sử dụng Email value object có sẵn
const email = new Email("user@example.com");
```

### Domain Event

Domain Events là các sự kiện quan trọng xảy ra trong domain và thường được phát ra bởi Aggregates.

```typescript
import { AbstractDomainEvent, IDomainEventMetadata } from "@ecoma/common-domain";

class OrderCreatedEvent extends AbstractDomainEvent {
  constructor(public readonly orderId: string, public readonly customerName: string, timestamp?: Date, metadata?: IDomainEventMetadata) {
    super(timestamp, metadata);
  }
}
```

### Repository

Repositories là các interface cho việc lưu trữ và truy xuất domain objects. **Lưu ý: Tất cả repository đều cần truyền đủ 3 generic type: TId, TProps, TAggregateRoot.**

```typescript
import { IRepository } from "@ecoma/common-domain";
import { OrderId, OrderProps, Order } from "./order";

interface IOrderRepository extends IRepository<OrderId, OrderProps, Order> {
  findByCustomerId(customerId: string): Promise<Order[]>;
}

class OrderRepository implements IOrderRepository {
  async findById(id: OrderId): Promise<Order | null> {
    /* ... */
  }
  async save(order: Order): Promise<void> {
    /* ... */
  }
  async delete(id: OrderId): Promise<void> {
    /* ... */
  }
  async deleteMany(ids: OrderId[]): Promise<void> {
    /* ... */
  }
  async findByCustomerId(customerId: string): Promise<Order[]> {
    /* ... */
  }
  // ...implement các method khác từ interface
}
```

### Event Bus

Event Bus là interface để publish các domain event. **Lưu ý: Interface mới có cả publish (1 event) và publishAll (nhiều event).**

```typescript
import { IEventBus, AbstractDomainEvent } from "@ecoma/common-domain";

class MyEventBus implements IEventBus {
  async publish(event: AbstractDomainEvent): Promise<void> {
    // publish single event
  }
  async publishAll(events: AbstractDomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }
}
```

### Domain Error

Domain Errors là các lỗi phát sinh trong domain logic.

```typescript
import { AbstractDomainError } from "@ecoma/common-domain";

class ProductNotFoundError extends AbstractDomainError {
  constructor(productId: string) {
    super(`Product with id ${productId} not found`);
  }
}
```

## 💡 Ví dụ sử dụng

Dưới đây là một ví dụ hoàn chỉnh về cách sử dụng các thành phần của `@ecoma/common-domain` cùng nhau:

```typescript
// Domain Events
class OrderCreatedEvent extends AbstractDomainEvent {
  constructor(public readonly orderId: string, public readonly total: number) {
    super();
  }
}

// Value Objects
class OrderId extends AbstractId {
  constructor(id?: string) {
    super(id);
  }
}

class Money extends AbstractValueObject<Money> {
  constructor(public readonly amount: number, public readonly currency: string) {
    super();
  }
  protected equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }
}

// Entities
interface OrderItemProps extends IEntityProps<OrderId> {
  productId: string;
  quantity: number;
  unitPrice: Money;
}
class OrderItem extends AbstractEntity<OrderId, OrderItemProps> {
  constructor(props: OrderItemProps) {
    super(props);
  }
  get subtotal(): Money {
    return new Money(this.$props.quantity * this.$props.unitPrice.amount, this.$props.unitPrice.currency);
  }
}

// Aggregate
interface OrderProps extends IEntityProps<OrderId> {
  customerId: string;
  orderDate: Date;
  items: OrderItem[];
}
class Order extends AbstractAggregate<OrderId, OrderProps> {
  constructor(props: OrderProps) {
    super(props);
    this.addDomainEvent(new OrderCreatedEvent(props.id.value, 0));
  }
  addItem(item: OrderItem): void {
    this.$props.items.push(item);
    // Possibly add an OrderItemAddedEvent...
  }
  get total(): Money {
    return this.$props.items.reduce((sum, item) => new Money(sum.amount + item.subtotal.amount, sum.currency), new Money(0, "USD"));
  }
  place(): void {
    if (this.$props.items.length === 0) {
      throw new DomainError("Cannot place an empty order");
    }
    // ...
  }
}

// Repository interface
interface IOrderRepository extends IRepository<OrderId, OrderProps, Order> {
  findByCustomerId(customerId: string): Promise<Order[]>;
}
```

## 🧪 Unit Testing

Tất cả các thành phần của thư viện đều được kiểm thử cẩn thận. Khi bạn mở rộng các lớp này hoặc triển khai các interface, bạn nên viết unit test cho code của mình.

Để chạy unit test cho thư viện này:

```bash
# Từ thư mục gốc của monorepo
yarn test libs/common/common-domain
```

Ví dụ về cách kiểm thử một entity:

```typescript
describe("Product", () => {
  it("should create a product with valid properties", () => {
    // Arrange & Act
    const product = new Product("prod-1", "Laptop", 1000);

    // Assert
    expect(product.id).toBe("prod-1");
    expect(product.name).toBe("Laptop");
    expect(product.price).toBe(1000);
  });

  it("should update price with valid value", () => {
    // Arrange
    const product = new Product("prod-1", "Laptop", 1000);

    // Act
    product.updatePrice(1200);

    // Assert
    expect(product.price).toBe(1200);
  });

  it("should throw error when updating price with invalid value", () => {
    // Arrange
    const product = new Product("prod-1", "Laptop", 1000);

    // Act & Assert
    expect(() => product.updatePrice(-100)).toThrow("Price must be positive");
  });
});
```

## 🤝 Contributing

Khi đóng góp cho thư viện này, hãy tuân thủ các nguyên tắc sau:

1. **Atomic commits**: Mỗi commit chỉ nên thực hiện một thay đổi logic và có mô tả rõ ràng
2. **Unit tests**: Viết unit test cho mọi thay đổi
3. **Documentation**: Cập nhật tài liệu nếu cần thiết
4. **Backward compatibility**: Đảm bảo tính tương thích ngược khi bạn thay đổi các API hiện có

Để phát triển thư viện:

```bash
# Từ thư mục gốc của monorepo
yarn test libs/common/common-domain --watch
```

Thư viện này là nền tảng cho tất cả các domain modules, vì vậy bất kỳ thay đổi nào cũng cần được xem xét cẩn thận.

## Classes

- [AbstractAggregate](/libraries/common-domain/Class.AbstractAggregate.md)
- [AbstractDomainEvent](/libraries/common-domain/Class.AbstractDomainEvent.md)
- [AbstractEntity](/libraries/common-domain/Class.AbstractEntity.md)
- [AbstractId](/libraries/common-domain/Class.AbstractId.md)
- [AbstractValueObject](/libraries/common-domain/Class.AbstractValueObject.md)
- [DomainError](/libraries/common-domain/Class.DomainError.md)
- [InvalidIdError](/libraries/common-domain/Class.InvalidIdError.md)
- [InvalidValueObjectError](/libraries/common-domain/Class.InvalidValueObjectError.md)
- [SnowflakeId](/libraries/common-domain/Class.SnowflakeId.md)
- [UuidId](/libraries/common-domain/Class.UuidId.md)
- [ValidationError](/libraries/common-domain/Class.ValidationError.md)

## Interfaces

- [IComparisonCondition](/libraries/common-domain/Interface.IComparisonCondition.md)
- [ICursorAheadPagination](/libraries/common-domain/Interface.ICursorAheadPagination.md)
- [ICursorBackPagination](/libraries/common-domain/Interface.ICursorBackPagination.md)
- [ICursorBasedPaginatedResult](/libraries/common-domain/Interface.ICursorBasedPaginatedResult.md)
- [IDomainEventMetadata](/libraries/common-domain/Interface.IDomainEventMetadata.md)
- [IEncryption](/libraries/common-domain/Interface.IEncryption.md)
- [IEntityProps](/libraries/common-domain/Interface.IEntityProps.md)
- [IEventBus](/libraries/common-domain/Interface.IEventBus.md)
- [IGeospatialCondition](/libraries/common-domain/Interface.IGeospatialCondition.md)
- [IInclusionCondition](/libraries/common-domain/Interface.IInclusionCondition.md)
- [ILogger](/libraries/common-domain/Interface.ILogger.md)
- [ILogicalCriteria](/libraries/common-domain/Interface.ILogicalCriteria.md)
- [INullCheckCondition](/libraries/common-domain/Interface.INullCheckCondition.md)
- [IOffsetBasedPaginatedResult](/libraries/common-domain/Interface.IOffsetBasedPaginatedResult.md)
- [IOffsetPagination](/libraries/common-domain/Interface.IOffsetPagination.md)
- [IPoint](/libraries/common-domain/Interface.IPoint.md)
- [IQuerySpecification](/libraries/common-domain/Interface.IQuerySpecification.md)
- [IRangeCondition](/libraries/common-domain/Interface.IRangeCondition.md)
- [IReadRepository](/libraries/common-domain/Interface.IReadRepository.md)
- [ISecurity](/libraries/common-domain/Interface.ISecurity.md)
- [ISnowflakeIdFactory](/libraries/common-domain/Interface.ISnowflakeIdFactory.md)
- [ISort](/libraries/common-domain/Interface.ISort.md)
- [IStringCondition](/libraries/common-domain/Interface.IStringCondition.md)
- [IUnitOfWork](/libraries/common-domain/Interface.IUnitOfWork.md)
- [IUuidIdFactory](/libraries/common-domain/Interface.IUuidIdFactory.md)
- [IValidationResult](/libraries/common-domain/Interface.IValidationResult.md)
- [IValidationRule](/libraries/common-domain/Interface.IValidationRule.md)
- [IValidator](/libraries/common-domain/Interface.IValidator.md)
- [IValidatorError](/libraries/common-domain/Interface.IValidatorError.md)
- [IValidatorResult](/libraries/common-domain/Interface.IValidatorResult.md)
- [IWithinDistanceValue](/libraries/common-domain/Interface.IWithinDistanceValue.md)
- [IWriteRepository](/libraries/common-domain/Interface.IWriteRepository.md)

## Type Aliases

- [ComparisonOperator](/libraries/common-domain/TypeAlias.ComparisonOperator.md)
- [FilterCondition](/libraries/common-domain/TypeAlias.FilterCondition.md)
- [FilterCriteria](/libraries/common-domain/TypeAlias.FilterCriteria.md)
- [FilterOperator](/libraries/common-domain/TypeAlias.FilterOperator.md)
- [GeospatialOperator](/libraries/common-domain/TypeAlias.GeospatialOperator.md)
- [InclusionOperator](/libraries/common-domain/TypeAlias.InclusionOperator.md)
- [Nullable](/libraries/common-domain/TypeAlias.Nullable.md)
- [NullOperator](/libraries/common-domain/TypeAlias.NullOperator.md)
- [RangeOperator](/libraries/common-domain/TypeAlias.RangeOperator.md)
- [StringOperator](/libraries/common-domain/TypeAlias.StringOperator.md)
