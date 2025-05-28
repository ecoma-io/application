# Hướng dẫn triển khai lớp Infrastructure trong phân rã nghiệp vụ Ecoma

> Nếu có mâu thuẫn giữa quy tắc chung và quy tắc riêng của lớp này, quy tắc riêng sẽ được ưu tiên.

## 1. Coding Convention

Ngoài các coding convention chung của dự án (xem tài liệu Quy ước lập trình chung Ecoma), các quy định dưới đây là bắt buộc riêng cho lớp Infrastructure:

- **Chỉ triển khai các adapter kỹ thuật** (persistence, messaging, external API, ...), không chứa logic nghiệp vụ.
- **Chỉ implement các port/interface do Application Layer định nghĩa.** Không tự ý định nghĩa port nghiệp vụ mới, không xử lý business rule.
- **Không truy cập trực tiếp domain logic.** Chỉ sử dụng domain object cho mục đích mapping dữ liệu (không gọi method nghiệp vụ).
- **Không chứa code orchestration, validation nghiệp vụ, policy, use case, ...**
- **Không log dữ liệu nghiệp vụ, chỉ log kỹ thuật (kết nối, lỗi kỹ thuật, ...).**
- **Mỗi thư mục con đều có file `index.ts` để export các thành phần.**
- **Tận dụng các thư viện common:** Sử dụng `common-utils` cho ILogger, helper, `common-types` cho DTO, `common-testing` cho test, v.v.

### 1.1. Quy tắc về Logging

| Level | Khi nào dùng? (ý nghĩa)                                                        | Ví dụ thực tế                                     |
| ----- | ------------------------------------------------------------------------------ | ------------------------------------------------- |
| debug | Trace, log chi tiết kỹ thuật, thông tin kết nối, chỉ bật khi debug/dev         | Bắt đầu kết nối DB, chi tiết request/response API |
| info  | Sự kiện kỹ thuật quan trọng, kết nối thành công, luôn bật ở production         | Kết nối DB thành công, gửi message thành công     |
| warn  | Vấn đề kỹ thuật cần chú ý nhưng chưa ảnh hưởng nghiệp vụ                       | Retry kết nối, timeout tạm thời                   |
| error | Lỗi kỹ thuật nghiêm trọng nhưng recover được                                   | Lỗi kết nối DB, lỗi gọi API                       |
| fatal | Lỗi kỹ thuật không recover được, có thể làm sập tiến trình, cần alert khẩn cấp | Mất kết nối DB hoàn toàn, lỗi config nghiêm trọng |

---

## 2. Cấu trúc thư mục mẫu

```bash
libs/
└── domains/
    └── <bc-name>/
        └── <bc-name>-infrastructure/
            ├── src/
            │   ├── lib/
            │   │   ├── adapters/
            │   │   │   ├── persistence/   # Adapter cho repository port
            │   │   │   │   ├── entities/  # TypeORM/Mongoose entities
            │   │   │   │   ├── mappers/   # Mapper DB <-> Domain
            │   │   │   │   └── index.ts
            │   │   │   ├── messaging/     # Adapter cho messaging port
            │   │   │   │   ├── publishers/
            │   │   │   │   ├── subscribers/
            │   │   │   │   └── index.ts
            │   │   │   ├── http/          # Adapter cho external API client
            │   │   │   │   ├── clients/
            │   │   │   │   ├── dtos/
            │   │   │   │   └── index.ts
            │   │   │   └── index.ts
            │   │   ├── factories/         # ID factories, technical factories
            │   │   │   ├── id/
            │   │   │   └── index.ts
            │   │   ├── config/            # Cấu hình kỹ thuật
            │   │   │   ├── database/
            │   │   │   ├── messaging/
            │   │   │   └── index.ts
            │   │   └── index.ts
            │   └── index.ts
            ├── test/                      # Integration tests
            └── index.ts
```

| Thư mục               | Mục đích                      | Ví dụ file                    |
| --------------------- | ----------------------------- | ----------------------------- |
| adapters/persistence/ | Implement repository port     | `order.repository.adapter.ts` |
| adapters/messaging/   | Implement message port        | `order-created.publisher.ts`  |
| adapters/http/        | Implement external API client | `payment-api.client.ts`       |
| factories/            | ID và technical factories     | `order-id.factory.ts`         |
| config/               | Cấu hình kỹ thuật             | `database.config.ts`          |

---

## 3. Giải thích các thành phần

### 3.1. Persistence Adapters

- **Mục đích:** Implement các repository port từ Application Layer.
- **Triển khai:**
  - Định nghĩa DB Entity (TypeORM/Mongoose)
  - Implement repository interface
  - Mapper DB <-> Domain
- **Logging:** Chỉ log kỹ thuật (kết nối DB, lỗi query)
- **Unit Test:** Mock DB, test mapping, error handling

**Ví dụ triển khai:**

```typescript
// adapters/persistence/entities/order.entity.ts
@Entity("orders")
export class OrderEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  customerId: string;

  @Column("jsonb")
  items: Array<{ productId: string; quantity: number }>;
}

// adapters/persistence/mappers/order.mapper.ts
export class OrderMapper {
  static toPersistence(domain: Order): OrderEntity {
    const entity = new OrderEntity();
    entity.id = domain.id.value;
    entity.customerId = domain.props.customerId;
    entity.items = domain.props.items;
    return entity;
  }

  static toDomain(entity: OrderEntity): Order {
    return new Order(new OrderId(entity.id), {
      customerId: entity.customerId,
      items: entity.items,
    });
  }
}

// adapters/persistence/order.repository.adapter.ts
@Injectable()
export class OrderRepositoryAdapter implements IOrderWriteRepo {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly repo: Repository<OrderEntity>,
    private readonly logger: ILogger
  ) {}

  async save(order: Order): Promise<void> {
    this.logger.debug("Saving order to database", { orderId: order.id.value });
    try {
      const entity = OrderMapper.toPersistence(order);
      await this.repo.save(entity);
      this.logger.info("Order saved successfully", { orderId: order.id.value });
    } catch (err) {
      this.logger.error("Failed to save order", err, { orderId: order.id.value });
      throw new DatabaseError("SAVE_ORDER_FAILED", err.message);
    }
  }
}
```

### 3.2. Messaging Adapters

- **Mục đích:** Implement các messaging port từ Application Layer.
- **Triển khai:**
  - Publisher: Gửi message/event
  - Subscriber: Nhận và xử lý message
- **Logging:** Log kỹ thuật (kết nối, gửi/nhận message)
- **Unit Test:** Mock message broker, test serialization

**Ví dụ triển khai:**

```typescript
// adapters/messaging/publishers/order-created.publisher.ts
@Injectable()
export class OrderCreatedEventPublisher implements IOrderEventPublisher {
  constructor(private readonly messageBroker: MessageBroker, private readonly logger: ILogger) {}

  async publish(event: OrderCreatedEvent): Promise<void> {
    this.logger.debug("Publishing OrderCreatedEvent", { event });
    try {
      await this.messageBroker.publish("order.created", event);
      this.logger.info("OrderCreatedEvent published", { orderId: event.orderId });
    } catch (err) {
      this.logger.error("Failed to publish OrderCreatedEvent", err, { event });
      throw new MessagingError("PUBLISH_EVENT_FAILED", err.message);
    }
  }
}
```

### 3.3. HTTP Client Adapters

- **Mục đích:** Implement các external API client port.
- **Triển khai:**
  - HTTP client wrapper
  - Request/Response DTOs
  - Error handling
- **Logging:** Log kỹ thuật (request/response, errors)
- **Unit Test:** Mock HTTP calls, test error handling

**Ví dụ triển khai:**

```typescript
// adapters/http/clients/payment-api.client.ts
@Injectable()
export class PaymentApiClient implements IPaymentService {
  constructor(private readonly httpClient: HttpClient, private readonly logger: ILogger) {}

  async processPayment(orderId: string, amount: number): Promise<boolean> {
    this.logger.debug("Processing payment", { orderId, amount });
    try {
      const response = await this.httpClient.post("/payments", { orderId, amount });
      this.logger.info("Payment processed", { orderId, status: response.status });
      return response.success;
    } catch (err) {
      this.logger.error("Payment processing failed", err, { orderId });
      throw new ExternalApiError("PAYMENT_FAILED", err.message);
    }
  }
}
```

### 3.4. Factories

- **Mục đích:** Tạo các ID và technical objects.
- **Triển khai:**
  - ID factories
  - Technical object factories
- **Unit Test:** Test uniqueness, format

**Ví dụ triển khai:**

```typescript
// factories/id/order-id.factory.ts
@Injectable()
export class OrderIdFactory implements IOrderIdFactory {
  create(): OrderId {
    return new OrderId(uuid());
  }
}
```

---

## 4. Unit Test

### 4.1. Những gì cần test

| Component          | Cần test                                  | Không test      |
| ------------------ | ----------------------------------------- | --------------- |
| Repository Adapter | Mapping DB <-> Domain, error handling     | Logic nghiệp vụ |
| Message Publisher  | Serialize/publish message, error handling | Message content |
| HTTP Client        | Request/response handling, error handling | Business logic  |
| ID Factory         | ID generation, uniqueness                 | -               |

### 4.2. Sử dụng common-testing

```typescript
// Ví dụ test repository adapter
describe("OrderRepositoryAdapter", () => {
  let adapter: OrderRepositoryAdapter;
  let mockRepo: jest.Mocked<Repository<OrderEntity>>;
  let mockLogger: jest.Mocked<ILogger>;

  beforeEach(() => {
    mockRepo = MockFactory.createMockObject<Repository<OrderEntity>>({
      save: jest.fn(),
    });
    mockLogger = MockFactory.createMockObject<ILogger>();
    adapter = new OrderRepositoryAdapter(mockRepo, mockLogger);
  });

  it("should save order successfully", async () => {
    const order = createTestOrder();
    await adapter.save(order);
    expect(mockRepo.save).toHaveBeenCalled();
    expect(mockLogger.info).toHaveBeenCalled();
  });
});
```

---

## 5. Thực hành tốt nhất

1. **Separation of Concerns:**

   - Mỗi adapter chỉ implement một port
   - Tách biệt rõ persistence, messaging, external API

2. **Error Handling:**

   - Wrap technical errors thành domain-specific errors
   - Log đầy đủ context kỹ thuật
   - Không expose lỗi infrastructure ra bên ngoài

3. **Logging:**

   - Chỉ log thông tin kỹ thuật
   - Sử dụng đúng log level
   - Không log sensitive data

4. **Configuration:**

   - Tập trung config vào thư mục config/
   - Không hardcode sensitive data
   - Sử dụng environment variables

5. **Testing:**

   - Mock external dependencies
   - Test error cases
   - Sử dụng common-testing helpers

6. **Performance:**

   - Implement caching khi cần
   - Optimize database queries
   - Handle connection pooling

7. **Security:**

   - Sanitize input/output
   - Secure credentials
   - Implement rate limiting

8. **Monitoring:**
   - Log metrics
   - Implement health checks
   - Track performance indicators
