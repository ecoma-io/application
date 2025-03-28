# Common Domain (@ecoma/common-domain)

Thư viện này cung cấp các khối xây dựng cốt lõi (building blocks) và các mẫu thiết kế (patterns) chung cho tầng Domain Driven Design (DDD) trong hệ thống Microservices của Ecoma. Mục đích chính là đảm bảo tính nhất quán, tái sử dụng và chuẩn hóa cách các Bounded Context định nghĩa và làm việc với các khái niệm nghiệp vụ cốt lõi.

## Nội dung

Thư viện bao gồm các thành phần chính sau:

### 1. Các lớp cơ sở trừu tượng

- **AbstractEntity**: Lớp cơ sở cho các Entity trong Domain
- **AbstractValueObject**: Lớp cơ sở cho các Value Object
- **AbstractAggregate**: Lớp cơ sở cho các Aggregate Root
- **AbstractDomainEvent**: Lớp cơ sở cho các Domain Event

### 2. Các Value Object chung

- **AbstractId**: Lớp cơ sở cho các loại ID
- **UuidId**: Implementation của AbstractId sử dụng UUID
- **SnowflakeId**: Implementation của AbstractId sử dụng Snowflake ID

### 3. Các Interface Repository

- **IReadRepository**: Interface cho các thao tác đọc
- **IWriteRepository**: Interface cho các thao tác ghi
- **IRepository**: Interface kết hợp cả đọc và ghi
- **IUnitOfWork**: Interface cho quản lý transaction
- **IEventPublisher**: Interface cho publish domain events

### 4. Các Interface Cross-cutting

- **ILogger**: Interface cho logging với các cấp độ debug, info, warn, error, fatal
- **IValidator**: Interface cho validation logic
- **IValidationResult**: Interface cho kết quả validation

### 5. Các Error Types

- **DomainError**: Lớp cơ sở cho tất cả các lỗi domain
- **ValidationError**: Interface cho lỗi validation

## Quy tắc sử dụng

### 1. Quy tắc chung

- Tất cả các Entity phải kế thừa từ `AbstractEntity`
- Tất cả các Value Object phải kế thừa từ `AbstractValueObject`
- Tất cả các Aggregate Root phải kế thừa từ `AbstractAggregate`
- Tất cả các Domain Event phải kế thừa từ `AbstractDomainEvent`
- Tất cả các ID phải kế thừa từ `AbstractId`
- Tất cả các lỗi domain phải kế thừa từ `DomainError`

### 2. Quy tắc đặt tên

- Tên class phải bắt đầu bằng chữ hoa và sử dụng PascalCase
- Tên method và property phải sử dụng camelCase
- Tên interface phải bắt đầu bằng chữ I và sử dụng PascalCase
- Tên constant phải sử dụng UPPER_SNAKE_CASE
- Tên error class phải kết thúc bằng "Error"

### 3. Quy tắc về Domain Events

- Mỗi Domain Event phải có một constructor không tham số
- Tất cả các property của Domain Event phải là readonly
- Domain Event phải được tạo thông qua constructor
- Domain Event phải được thêm vào Aggregate Root thông qua method `addDomainEvent`
- Domain Event phải được publish thông qua `IEventPublisher`

### 4. Quy tắc về Repository

- Repository phải implement interface `IRepository`
- Repository phải xử lý các transaction một cách rõ ràng thông qua `IUnitOfWork`
- Repository phải throw exception khi không tìm thấy entity
- Repository phải validate input trước khi thực hiện các thao tác
- Repository phải sử dụng `ILogger` để ghi log các thao tác quan trọng

### 5. Quy tắc về Validation

- Tất cả các validation phải implement interface `IValidator`
- Validation phải trả về `IValidationResult`
- Validation error phải implement interface `ValidationError`
- Validation phải được thực hiện trước khi thực hiện các thao tác domain

### 6. Quy tắc về Logging

- Sử dụng `ILogger` cho tất cả các logging
- Sử dụng đúng cấp độ log:
  - debug: cho thông tin chi tiết trong development
  - info: cho thông tin thông thường
  - warn: cho cảnh báo
  - error: cho lỗi
  - fatal: cho lỗi nghiêm trọng có thể crash hệ thống
- Luôn cung cấp metadata hữu ích khi log

## Ví dụ sử dụng

### 1. Tạo một Entity

```typescript
import { AbstractEntity } from "@ecoma/common-domain";
import { UuidId } from "@ecoma/common-domain";

export class Product extends AbstractEntity<UuidId> {
  private readonly name: string;
  private readonly price: number;

  constructor(id: UuidId, name: string, price: number) {
    super(id);
    this.name = name;
    this.price = price;
  }

  public getName(): string {
    return this.name;
  }

  public getPrice(): number {
    return this.price;
  }
}
```

### 2. Tạo một Aggregate Root

```typescript
import { AbstractAggregate } from "@ecoma/common-domain";
import { UuidId } from "@ecoma/common-domain";
import { ProductCreatedEvent } from "./events/product-created.event";

export class Product extends AbstractAggregate<UuidId> {
  private readonly name: string;
  private readonly price: number;

  constructor(id: UuidId, name: string, price: number) {
    super(id);
    this.name = name;
    this.price = price;
    this.addDomainEvent(new ProductCreatedEvent(id, name, price));
  }

  public getName(): string {
    return this.name;
  }

  public getPrice(): number {
    return this.price;
  }
}
```

### 3. Tạo một Domain Event

```typescript
import { AbstractDomainEvent } from "@ecoma/common-domain";
import { UuidId } from "@ecoma/common-domain";

export class ProductCreatedEvent extends AbstractDomainEvent {
  public readonly productId: UuidId;
  public readonly name: string;
  public readonly price: number;

  constructor(productId: UuidId, name: string, price: number) {
    super();
    this.productId = productId;
    this.name = name;
    this.price = price;
  }
}
```

### 4. Tạo một Repository

```typescript
import { IRepository } from "@ecoma/common-domain";
import { Product } from "./product";
import { UuidId } from "@ecoma/common-domain";

export class ProductRepository implements IRepository<Product> {
  public async findById(id: UuidId): Promise<Product | null> {
    // Implementation
  }

  public async save(entity: Product): Promise<void> {
    // Implementation
  }

  public async delete(id: UuidId): Promise<void> {
    // Implementation
  }
}
```

### 5. Sử dụng Unit of Work

```typescript
import { IUnitOfWork } from "@ecoma/common-domain";
import { Order } from "./order";
import { Payment } from "./payment";

export class OrderUnitOfWork implements IUnitOfWork {
  constructor(private readonly orderRepository: IWriteRepository<Order>, private readonly paymentRepository: IWriteRepository<Payment>) {}

  async execute<T>(work: () => Promise<T>): Promise<T> {
    try {
      const result = await work();
      await this.commit();
      return result;
    } catch (error) {
      await this.rollback();
      throw error;
    }
  }
}
```

### 6. Sử dụng Logger

```typescript
import { ILogger } from "@ecoma/common-domain";

export class OrderService {
  constructor(private readonly logger: ILogger) {}

  async createOrder(order: Order): Promise<void> {
    try {
      this.logger.debug("Creating order", { orderId: order.id });
      // Business logic
      this.logger.info("Order created successfully", { orderId: order.id });
    } catch (error) {
      this.logger.error("Failed to create order", error, { orderId: order.id });
      throw error;
    }
  }
}
```

### 7. Sử dụng Validator

```typescript
import { IValidator, IValidationResult, ValidationError } from "@ecoma/common-domain";
import { Order } from "./order";

export class OrderValidator implements IValidator<Order> {
  validate(order: Order): IValidationResult {
    const errors: ValidationError[] = [];

    if (!order.customerId) {
      errors.push({
        field: "customerId",
        code: "REQUIRED",
        message: "Customer ID is required",
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
```

## Lưu ý quan trọng

1. **Bảo mật**:

   - Không lưu trữ thông tin nhạy cảm trong Domain Events
   - Sử dụng encryption cho các dữ liệu nhạy cảm
   - Validate input trước khi xử lý

2. **Hiệu năng**:

   - Sử dụng lazy loading khi cần thiết
   - Tránh load quá nhiều dữ liệu không cần thiết
   - Sử dụng caching khi phù hợp

3. **Testing**:

   - Viết unit test cho tất cả các Domain logic
   - Sử dụng mock cho các dependency
   - Test các edge cases

4. **Documentation**:
   - Thêm JSDoc cho tất cả các public API
   - Cập nhật documentation khi có thay đổi
   - Thêm ví dụ sử dụng trong documentation
