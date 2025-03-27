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

Entities là các đối tượng domain có identity (định danh) và có thể thay đổi trạng thái. Các entity được định danh bằng ID chứ không phải bằng các thuộc tính.

```typescript
import { AbstractEntity } from "@ecoma/common-domain";

class Product extends AbstractEntity {
  private _name: string;
  private _price: number;
  
  constructor(id: string, name: string, price: number) {
    super();
    this._id = id;
    this._name = name;
    this._price = price;
  }
  
  get id(): string {
    return this._id;
  }
  
  get name(): string {
    return this._name;
  }
  
  get price(): number {
    return this._price;
  }
  
  updatePrice(newPrice: number): void {
    if (newPrice <= 0) {
      throw new Error("Price must be positive");
    }
    this._price = newPrice;
  }
}
```

### Aggregate

Aggregates là các cụm entity được coi như một đơn vị duy nhất cho mục đích thay đổi dữ liệu. Mỗi aggregate có một root entity (aggregate root) quản lý quyền truy cập vào các entity con bên trong nó.

```typescript
import { AbstractAggregate } from "@ecoma/common-domain";
import { OrderItem } from "./order-item";
import { OrderCreatedEvent } from "./events/order-created-event";

class Order extends AbstractAggregate {
  private _customerName: string;
  private _items: OrderItem[];
  private _total: number;
  
  constructor(id: string, customerName: string) {
    super();
    this._id = id;
    this._customerName = customerName;
    this._items = [];
    this._total = 0;
    
    // Add domain event
    this.addDomainEvent(new OrderCreatedEvent(id, customerName));
  }
  
  addItem(item: OrderItem): void {
    this._items.push(item);
    this.recalculateTotal();
  }
  
  private recalculateTotal(): void {
    this._total = this._items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
  
  // Getters and other methods...
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
  constructor(
    public readonly orderId: string,
    public readonly customerName: string,
    timestamp?: Date,
    metadata?: IDomainEventMetadata
  ) {
    super(timestamp, metadata);
  }
}
```

### Repository

Repositories là các interface cho việc lưu trữ và truy xuất domain objects.

```typescript
import { IRepository } from "@ecoma/common-domain";
import { Order } from "./order";

interface IOrderRepository extends IRepository<Order> {
  findByCustomerId(customerId: string): Promise<Order[]>;
}

// Implementation (in infrastructure layer)
class OrderRepository implements IOrderRepository {
  async findById(id: string): Promise<Order | null> {
    // Implementation
  }
  
  async save(order: Order): Promise<void> {
    // Implementation
    // Publish domain events
  }
  
  async findByCustomerId(customerId: string): Promise<Order[]> {
    // Implementation
  }
}
```

### Domain Error

Domain Errors là các lỗi phát sinh trong domain logic.

```typescript
import { DomainError } from "@ecoma/common-domain";

class OrderNotFoundError extends DomainError {
  constructor(orderId: string) {
    super(`Order with ID {orderId} not found`, { orderId });
  }
}

// Sử dụng
throw new OrderNotFoundError("order-123");
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
class OrderId extends UuidId {
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
class OrderItem extends AbstractEntity {
  constructor(
    id: string,
    public readonly productId: string,
    public readonly quantity: number,
    public readonly unitPrice: Money
  ) {
    super();
    this._id = id;
  }
  
  get subtotal(): Money {
    return new Money(this.quantity * this.unitPrice.amount, this.unitPrice.currency);
  }
}

// Aggregate
class Order extends AbstractAggregate {
  private _items: OrderItem[] = [];
  private _status: OrderStatus = OrderStatus.PENDING;
  
  constructor(
    id: string,
    public readonly customerId: string,
    public readonly orderDate: Date = new Date()
  ) {
    super();
    this._id = id;
    this.addDomainEvent(new OrderCreatedEvent(id, 0));
  }
  
  addItem(item: OrderItem): void {
    this._items.push(item);
    // Possibly add an OrderItemAddedEvent...
  }
  
  get total(): Money {
    return this._items.reduce(
      (sum, item) => new Money(sum.amount + item.subtotal.amount, sum.currency),
      new Money(0, "USD")
    );
  }
  
  place(): void {
    if (this._items.length === 0) {
      throw new DomainError("Cannot place an empty order");
    }
    this._status = OrderStatus.PLACED;
    this.addDomainEvent(new OrderPlacedEvent(this.id, this.total.amount));
  }
}

// Repository interface
interface IOrderRepository extends IRepository<Order> {
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
