# Hướng dẫn triển khai lớp Application trong phân rã nghiệp vụ Ecoma

> Nếu có mâu thuẫn giữa quy tắc chung và quy tắc riêng của lớp này, quy tắc riêng sẽ được ưu tiên.

## 1. Coding Convention

Ngoài các coding convention chung của dự án (xem tài liệu Quy ước lập trình chung Ecoma), các quy định dưới đây là bắt buộc riêng cho lớp Application:

- Không được phép import, sử dụng trực tiếp bất kỳ framework, thư viện hạ tầng, ORM, hoặc code liên quan đến persistence, UI, HTTP, message broker, v.v. (mọi tương tác phải thông qua các port/interface).
- Repository interface đặc thù phải định nghĩa tại đây, không định nghĩa trong domain.
- DTO chỉ dùng ở application/infrastructure, domain không được biết về DTO.
- **Được phép sử dụng logging (ILogger) ở Application, nhưng tuyệt đối không logging ở Domain.**
- Mỗi thư mục con đều có file `index.ts` để export các thành phần

## 1.1. Entry Point Nghiệp vụ

Trong lớp Application, **Use Cases** là điểm vào chính cho tất cả các luồng nghiệp vụ. Cụ thể:

- **Command Handlers** và **Query Handlers** trong thư mục `use-cases/` là nơi tiếp nhận và xử lý tất cả các yêu cầu nghiệp vụ từ bên ngoài.
- Mỗi handler chịu trách nhiệm điều phối (orchestrate) một luồng nghiệp vụ cụ thể, bao gồm:
  - Validate đầu vào (sử dụng DTO validation)
  - Gọi các Domain Service/Entity cần thiết
  - Thực hiện các tác vụ phối hợp (ví dụ: gọi nhiều Repository, publish Event)
  - Xử lý lỗi và trả về kết quả theo format chuẩn
- Không sử dụng Application Services trung gian - các handler là điểm tiếp xúc trực tiếp với Infrastructure layer.
- Event Handlers trong thư mục `event-handlers/` cũng là một dạng entry point cho các luồng nghiệp vụ được kích hoạt bởi Domain Events.

## 1.2. Các mức độ log (ILogger)

Hệ thống sử dụng interface ILogger với các mức độ log sau, cần sử dụng đúng ngữ cảnh để đảm bảo log có giá trị vận hành và debug:

| Level | Khi nào dùng? (ý nghĩa)                                                          | Ví dụ thực tế                                        |
| ----- | -------------------------------------------------------------------------------- | ---------------------------------------------------- |
| debug | Trace, log chi tiết, giá trị biến, context, chỉ bật khi debug/dev                | Bắt đầu handler, log payload, log từng bước nhỏ      |
| info  | Sự kiện quan trọng, thao tác thành công, trạng thái chính, luôn bật ở production | Order tạo thành công, user đăng nhập thành công      |
| warn  | Điều kiện bất thường, không phải lỗi nhưng cần chú ý                             | Payload thiếu field, order không tìm thấy            |
| error | Lỗi nghiêm trọng nhưng recover được, có thể xử lý tiếp, không làm sập hệ thống   | Lưu DB lỗi, gọi API ngoài lỗi, validate thất bại     |
| fatal | Lỗi không recover được, có thể làm sập tiến trình/hệ thống, cần alert khẩn cấp   | Lỗi factory, mất kết nối DB, lỗi config nghiêm trọng |

**Lưu ý:**

- Chỉ dùng `fatal` cho các lỗi không thể phục hồi, có thể ảnh hưởng toàn hệ thống hoặc cần can thiệp khẩn cấp.
- `error` cho các lỗi nghiệp vụ, ngoại lệ recoverable.
- `warn` cho các điều kiện bất thường nhưng không phải lỗi.
- `info` cho các sự kiện nghiệp vụ quan trọng.
- `debug` cho trace, giá trị biến, context, chỉ bật khi cần debug.

---

## 2. Cấu trúc thư mục mẫu cho `<bc-name>-application`

> **Lưu ý:**
>
> - Chỉ tạo các thư mục/file đúng template dưới đây (trừ khi có phê duyệt đặc biệt từ kiến trúc sư dự án).
> - Có thể không có một số thư mục/file nếu không cần thiết.
> - Repository interface đặc thù phải định nghĩa tại đây, không định nghĩa trong domain (nếu cần generic thì kế thừa từ common-domain).
> - Không import, sử dụng trực tiếp framework, ORM, code hạ tầng trong application (mọi tương tác phải qua port/interface).
> - DTO chỉ dùng ở application/infrastructure, domain không được biết về DTO.
> - Mỗi thư mục con đều có file `index.ts` để export các thành phần.

```bash
├── dtos/
│   ├── commands/
│   │   ├── <command-name>.command.dto.ts
│   │   └── index.ts
│   ├── queries/
│   │   ├── <query-name>.query.dto.ts
│   │   └── index.ts
│   └── index.ts
├── errors/
│   ├── <error-name>.error.ts
│   └── index.ts
├── mappers/
│   ├── <mapper-name>.mapper.ts
│   ├── <mapper-name>.mapper.test.ts
│   └── index.ts
├── ports/
│   ├── messaging/
│   │   ├── <messaging-port-name>.port.ts
│   │   └── index.ts
│   ├── repository/
│   │   ├── <aggregate-name>.write-repo.ts     # Repository interface cho command side (ghi)
│   │   ├── <aggregate-name>.read-repo.ts      # Repository interface cho query side (đọc)
│   │   └── index.ts
│   ├── integration/
│   │   ├── <integration-port-name>.port.ts
│   │   └── index.ts
│   └── index.ts
├── use-cases/
│   ├── commands/
│   │   ├── <command-name>.command.ts
│   │   ├── <command-name>.command.handler.ts
│   │   ├── <command-name>.command.handler.test.ts
│   │   └── index.ts
│   ├── queries/
│   │   ├── <query-name>.query.ts
│   │   ├── <query-name>.query.handler.ts
│   │   ├── <query-name>.query.handler.test.ts
│   │   └── index.ts
│   └── index.ts
├── policies/
│   ├── <policy-name>.policy.ts
│   └── index.ts
├── factories/
│   ├── <factory-name>.factory.ts
│   └── index.ts
├── specifications/
│   ├── <specification-name>.specification.ts
│   └── index.ts
├── event-handlers/
│   ├── <event-handler-name>.event-handler.ts
│   └── index.ts
├── pipelines/
│   ├── <pipeline-name>.pipeline.ts
│   └── index.ts
├── validators/
│   ├── <validator-name>.validator.ts
│   └── index.ts
└── index.ts
```

| Thư mục             | Ý nghĩa/nghiệp vụ                           | Ví dụ file template                                                                                        |
| ------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| dtos/               | Data Transfer Object                        | `<command-name>.command.dto.ts`, `<query-name>.query.dto.ts`                                               |
| errors/             | Lỗi application                             | `<error-name>.error.ts`                                                                                    |
| mappers/            | Mapper Domain <-> DTO                       | `<mapper-name>.mapper.ts`, `<mapper-name>.mapper.test.ts`                                                  |
| ports/messaging/    | Port message                                | `<messaging-port-name>.port.ts`                                                                            |
| ports/repository/   | Repository interface cho command/query side | `<aggregate-name>.write-repo.ts`, `<aggregate-name>.read-repo.ts`                                          |
| ports/integration/  | Port tích hợp dịch vụ ngoài                 | `<integration-port-name>.port.ts`                                                                          |
| use-cases/commands/ | Command & Handler & Test                    | `<command-name>.command.ts`, `<command-name>.command.handler.ts`, `<command-name>.command.handler.test.ts` |
| use-cases/queries/  | Query & Handler & Test                      | `<query-name>.query.ts`, `<query-name>.query.handler.ts`, `<query-name>.query.handler.test.ts`             |
| policies/           | Application Policy                          | `<policy-name>.policy.ts`                                                                                  |
| factories/          | Application Factory                         | `<factory-name>.factory.ts`                                                                                |
| specifications/     | Application Specification                   | `<specification-name>.specification.ts`                                                                    |
| event-handlers/     | Application Event Handler                   | `<event-handler-name>.event-handler.ts`                                                                    |
| pipelines/          | Pipeline/Interceptor/Guard                  | `<pipeline-name>.pipeline.ts`                                                                              |
| validators/         | Validator nghiệp vụ động/phức tạp           | `<validator-name>.validator.ts`                                                                            |

---

## 3. Giải thích các thành phần (và sử dụng thư viện `common`)

### 3.1. Use Cases (Thư mục `use-cases/`)

#### 3.1.1. Commands

- **Mục đích:** Đại diện cho ý định thay đổi trạng thái hệ thống (ghi dữ liệu).
- **Triển khai:**
  - `<command-name>.command.ts`: Định nghĩa payload, các thuộc tính nên là `readonly`.
  - `<command-name>.command.handler.ts`: Xử lý logic orchestration, inject ILogger, repository, domain event publisher, domain service nếu cần. Không chứa logic nghiệp vụ cốt lõi. **Bắt buộc phải implement interface `ICommandHandler<TCommand, TResult>` từ `@ecoma/common-application`.**
  - **Kết quả trả về:** Command Handler nên trả về kiểu `IGenericResult<TData, TDetails>` từ `@common-application/dtos/generic-result.ts` để chuẩn hóa kết quả (thành công/thất bại, dữ liệu, lỗi, chi tiết lỗi).
- **Sử dụng common:** `ICommandHandler`, `IGenericResult` (common-application), `common-domain` (domain service, ILogger), `common-types` (Nullable, Maybe, ...).
- **Unit Test:** Sử dụng `MockFactory`, `AssertionHelpers`, `EventTestingHelper` từ `@ecoma/common-testing` để mock dependency, kiểm tra orchestration đúng, kiểm tra event publish, assertion helper cho dữ liệu trả về.
- **Ví dụ sử dụng trong Command Handler:**

  ````typescript
  // Đã loại bỏ ví dụ handler ngắn trùng lặp để tránh rối.
  // Bổ sung hướng dẫn và ví dụ về validation DTO bằng class-validator trước khi execute.
  //
  // ---
  //
  // **Lưu ý về validation:**
  // - Các DTO nên sử dụng decorator của class-validator để khai báo ràng buộc dữ liệu.
  // - Trong handler, validate DTO trước khi thực thi logic. Nếu có lỗi, trả về INVALID_PAYLOAD, log warn, không thực thi tiếp.
  //
  // **Ví dụ triển khai đầy đủ Command (có validation):**

  ```typescript
  // dtos/commands/create-order.command.dto.ts
  import { IsString, IsNotEmpty, ValidateNested, ArrayNotEmpty, IsArray } from 'class-validator';
  import { Type } from 'class-transformer';

  class CreateOrderItemDto {
    @IsString()
    @IsNotEmpty()
    productId!: string;

    @IsNotEmpty()
    quantity!: number;
  }

  /**
   * DTO cho lệnh tạo đơn hàng
   */
  export class CreateOrderCommandDto {
    /** Mã khách hàng */
    @IsString()
    @IsNotEmpty()
    customerId!: string;

    /** Danh sách sản phẩm */
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items!: CreateOrderItemDto[];
  }

  // use-cases/commands/create-order.command.ts
  import { CreateOrderCommandDto } from '../../dtos/commands/create-order.command.dto';
  export class CreateOrderCommand {
    /** Payload của lệnh */
    constructor(public readonly payload: CreateOrderCommandDto) {}
  }

  // use-cases/commands/create-order.command.handler.ts
  import { IGenericResult } from '@ecoma/common-application';
  import { CreateOrderCommand } from './create-order.command';
  import { IOrderWriteRepo } from '../../ports/repository';
  import { ILogger } from '@ecoma/common-domain';
  import { Order } from '../../entities';
  import { OrderFactory } from '../../factories';
  import { InvariantViolationError } from '../../errors';
  import { validateSync } from 'class-validator';

  export class CreateOrderCommandHandler implements ICommandHandler<CreateOrderCommand, IGenericResult<string, string>> {
    constructor(
      private readonly orderRepo: IOrderWriteRepo,
      private readonly logger: ILogger
    ) {}

    /**
     * Thực thi lệnh tạo đơn hàng
     * @param command Lệnh tạo đơn hàng
     */
    async execute(command: CreateOrderCommand): Promise<IGenericResult<string, string>> {
      this.logger.debug('Bắt đầu xử lý CreateOrderCommand', { payload: command.payload });
      // Validate DTO bằng class-validator
      const errors = validateSync(command.payload, { whitelist: true, forbidNonWhitelisted: true });
      if (errors.length > 0) {
        this.logger.warn('Payload tạo đơn hàng không hợp lệ', { payload: command.payload, errors });
        return {
          success: false,
          error: 'INVALID_PAYLOAD',
          details: errors.map(e => Object.values(e.constraints || {}).join(', ')).join('; '),
          data: null,
        };
      }
      try {
        // Tạo order domain object qua factory
        let order: Order | null = null;
        try {
          order = OrderFactory.create(command.payload);
        } catch (factoryErr) {
          // Lỗi invariant domain bị phá vỡ là lỗi fatal
          this.logger.fatal('Invariant domain bị phá vỡ khi tạo order', factoryErr, { payload: command.payload });
          return {
            success: false,
            error: 'INVARIANT_BROKEN',
            details: factoryErr.message,
            data: null,
          };
        }
        if (!order) {
          this.logger.fatal('OrderFactory trả về null, invariant domain bị phá vỡ', undefined, { payload: command.payload });
          return {
            success: false,
            error: 'INVARIANT_BROKEN',
            details: 'Không thể tạo order',
            data: null,
          };
        }
        await this.orderRepo.save(order);
        this.logger.info('Tạo đơn hàng thành công', { orderId: order.id.value });
        return {
          success: true,
          error: '',
          details: '',
          data: order.id.value,
        };
      } catch (err) {
        this.logger.error('Tạo đơn hàng thất bại', err, { payload: command.payload });
        return {
          success: false,
          error: 'CREATE_ORDER_FAILED',
          details: err.message,
          data: null,
        };
      }
    }
  }

  // use-cases/commands/create-order.command.handler.test.ts
  import { CreateOrderCommandHandler } from './create-order.command.handler';
  import { MockFactory, AssertionHelpers } from '@ecoma/common-testing';
  import { IOrderWriteRepo } from '../../ports/repository';
  import { ILogger } from '@ecoma/common-domain';
  import { CreateOrderCommand } from './create-order.command';

  describe('Xử lý lệnh tạo đơn hàng', () => {
    let handler: CreateOrderCommandHandler;
    let orderRepo: jest.Mocked<IOrderWriteRepo>;
    let logger: jest.Mocked<ILogger>;

    beforeEach(() => {
      orderRepo = MockFactory.createMockObject<IOrderWriteRepo>({
        save: jest.fn().mockResolvedValue(undefined),
      });
      logger = MockFactory.createMockObject<ILogger>({
        info: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
        warn: jest.fn(),
        fatal: jest.fn(),
      });
      handler = new CreateOrderCommandHandler(orderRepo, logger);
    });

    it('Tạo đơn hàng thành công', async () => {
      const command = new CreateOrderCommand({ customerId: 'c1', items: [{ productId: 'p1', quantity: 2 }] });
      const result = await handler.execute(command);
      AssertionHelpers.expectToContainAllProperties(result, { success: true, error: '', data: expect.any(String) });
      expect(orderRepo.save).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalled();
    });

    it('Payload không hợp lệ sẽ trả về lỗi', async () => {
      const command = new CreateOrderCommand({ customerId: '', items: [] });
      const result = await handler.execute(command);
      AssertionHelpers.expectToContainAllProperties(result, { success: false, error: 'INVALID_PAYLOAD' });
      expect(orderRepo.save).not.toHaveBeenCalled();
    });
  });
  ````

#### 3.1.2. Queries

- **Mục đích:** Đọc dữ liệu, không thay đổi trạng thái hệ thống.
- **Triển khai:**
  - `<query-name>.query.ts`: Định nghĩa tham số truy vấn.
  - `<query-name>.query.handler.ts`: Xử lý truy vấn, inject ILogger, repository, mapping sang DTO. **Bắt buộc phải implement interface `IQueryHandler<TQuery, TResult>` từ `@ecoma/common-application`.**
- **Sử dụng common:** `IQueryHandler` (common-application), `common-types` (Nullable, Maybe), `common-domain` (ILogger).
- **Unit Test:** Mock repository, kiểm tra mapping, validate kết quả trả về.
- **Ví dụ triển khai Query:**

```typescript
// dtos/queries/get-order-detail.query.dto.ts
export interface GetOrderDetailQueryDto {
  readonly orderId: string;
}

// use-cases/queries/get-order-detail.query.ts
import { GetOrderDetailQueryDto } from "../../dtos/queries/get-order-detail.query.dto";
export class GetOrderDetailQuery {
  constructor(public readonly payload: GetOrderDetailQueryDto) {}
}

// use-cases/queries/get-order-detail.query.handler.ts
import { IQueryHandler, IGenericResult } from "@ecoma/common-application";
import { GetOrderDetailQuery } from "./get-order-detail.query";
import { IOrderReadRepo } from "../../ports/repository/order.read-repo";
import { ILogger } from "@ecoma/common-domain";
import { OrderMapper } from "../../mappers/order.mapper";
import { OrderDetailDto } from "../../dtos/queries/order-detail.query.dto";

export class GetOrderDetailQueryHandler implements IQueryHandler<GetOrderDetailQuery, IGenericResult<OrderDetailDto, string>> {
  constructor(private readonly orderRepo: IOrderReadRepo, private readonly logger: ILogger) {}

  async execute(query: GetOrderDetailQuery): Promise<IGenericResult<OrderDetailDto, string>> {
    this.logger.debug("Start GetOrderDetailQueryHandler", { query: query.payload });
    try {
      const order = await this.orderRepo.findById(query.payload.orderId);
      if (!order) {
        this.logger.warn("Order not found", { orderId: query.payload.orderId });
        return {
          success: false,
          error: "ORDER_NOT_FOUND",
          details: "Order not found",
          data: null,
        };
      }
      const dto = OrderMapper.toOrderDetailDto(order);
      this.logger.info("Order detail fetched", { orderId: order.id.value });
      return {
        success: true,
        error: "",
        details: "",
        data: dto,
      };
    } catch (err) {
      this.logger.error("Get order detail failed", err, { query: query.payload });
      return {
        success: false,
        error: "GET_ORDER_DETAIL_FAILED",
        details: err.message,
        data: null,
      };
    }
  }
}
```

### 3.2. Ports (Thư mục `ports/`)

- **Mục đích:** Định nghĩa các interface mà Infrastructure phải implement (repository, messaging, integration).
- **Triển khai:**
  - `repository/`: Tách biệt rõ repository cho command side (write-repo) và query side (read-repo) cho mỗi aggregate:
    - `<aggregate-name>.write-repo.ts`: Repository interface cho command handler, thao tác với aggregate root, đảm bảo invariant, chỉ phục vụ ghi/thay đổi trạng thái. Kế thừa từ `IWriteRepository` trong `common-domain`.
    - `<aggregate-name>.read-repo.ts`: Repository interface cho query handler, truy vấn từ read model/view, trả về DTO/view model tối ưu cho đọc. Kế thừa từ `IReadRepository` trong `common-domain`.
  - `messaging/`: Port publish domain event.
  - `integration/`: Port tích hợp dịch vụ ngoài (nếu cần).
- **Sử dụng common:** Luôn kế thừa abstraction từ `common-domain` (`IWriteRepository`, `IReadRepository`).
- **Ví dụ import:**

  ```typescript
  // ports/repository/order.write-repo.ts
  import { IWriteRepository } from "@ecoma/common-domain";
  import { Order } from "../../entities/order.entity";
  import { OrderId } from "../../value-objects/order-id.vo";

  export interface IOrderWriteRepo extends IWriteRepository<OrderId, any, Order> {
    // Có thể bổ sung method đặc thù cho ghi nếu cần
  }
  ```

  ```typescript
  // ports/repository/order.read-repo.ts
  import { IReadRepository } from "@ecoma/common-domain";
  import { Order } from "../../entities/order.entity";
  import { OrderId } from "../../value-objects/order-id.vo";

  export interface IOrderReadRepo extends IReadRepository<OrderId, any, Order> {
    // Có thể bổ sung method đặc thù cho đọc nếu cần
  }
  ```

### 3.3. DTOs (Thư mục `dtos/`)

- **Mục đích:** Truyền dữ liệu giữa các lớp hoặc qua mạng. Không có hành vi nghiệp vụ.
- **Triển khai:**
  - Command object có thể coi là DTO.
  - Query trả về DTO.
- **Sử dụng common:** Không bắt buộc.
- **Ví dụ:**

  ```typescript
  // dtos/commands/create-order.command.dto.ts
  export interface CreateOrderCommandDto {
    readonly customerId: string;
    readonly items: Array<{ productId: string; quantity: number }>;
  }

  // dtos/queries/order-detail.query.dto.ts
  export interface OrderDetailQueryDto {
    readonly orderId: string;
  }
  ```

### 3.4. Mappers (Thư mục `mappers/`)

- **Mục đích:** Mapping giữa Domain object và DTO.
- **Triển khai:**
  - Nếu mapping phức tạp, tách thành class riêng.
  - Nếu đơn giản, có thể mapping trực tiếp trong handler hoặc DTO factory.
- **Unit Test:**
  - Kiểm tra mapping đúng chiều, đúng dữ liệu.
- **Ví dụ:**

  ```typescript
  // mappers/order.mapper.ts
  import { Order } from "../entities/order.entity";
  import { OrderDetailDto } from "../../dtos/queries/order-detail.query.dto";

  export class OrderMapper {
    static toOrderDetailDto(order: Order): OrderDetailDto {
      return {
        orderId: order.id.value,
        customerId: order.customerId.value,
        items: order.items.map((i) => ({ productId: i.productId.value, quantity: i.quantity })),
        total: order.total,
      };
    }
  }
  ```

### 3.5. Errors (Thư mục `errors/`)

- **Mục đích:** Lỗi đặc thù của Application (không phải lỗi nghiệp vụ domain).
- **Triển khai:**
  - Kế thừa `ApplicationError` từ `common-application` hoặc `common-domain`.
  - Không kế thừa trực tiếp từ `Error`.
- **Ví dụ:**

  ```typescript
  // errors/order-not-found.error.ts
  import { ApplicationError } from "@ecoma/common-application";

  export class OrderNotFoundError extends ApplicationError<{ orderId: string }> {
    constructor(orderId: string) {
      super("ORDER_NOT_FOUND", "Order with id {orderId} not found", { orderId }, { orderId });
    }
  }
  ```

### 3.6. Policies (Thư mục `policies/`)

- **Mục đích:** Định nghĩa các chính sách điều phối, phân quyền, rule đặc thù ở Application Layer (ví dụ: kiểm tra quyền thực thi use case, policy cho orchestration).
- **Triển khai:** Mỗi policy là một class riêng, có thể inject vào handler/service nếu cần. Không chứa logic nghiệp vụ cốt lõi (nên để ở domain).
- **Sử dụng common:** Không bắt buộc.
- **Unit Test:** Sử dụng `AssertionHelpers` để kiểm tra policy đúng với từng trường hợp phân quyền, rule.
- **Ví dụ:**
  ```typescript
  // policies/can-cancel-order.policy.ts
  export class CanCancelOrderPolicy {
    canCancel(userRole: string, orderStatus: string): boolean {
      return userRole === "admin" || orderStatus === "pending";
    }
  }
  ```

### 3.7. Factories (Thư mục `factories/`)

- **Mục đích:** Đóng gói logic khởi tạo phức tạp cho DTO, use-case, hoặc orchestration.
- **Triển khai:** Mỗi factory là một class hoặc static method, trả về instance hợp lệ hoặc ném lỗi nếu không hợp lệ.
- **Sử dụng common:** Không bắt buộc.
- **Unit Test:** Sử dụng `AssertionHelpers` để kiểm tra logic khởi tạo, validate đầu vào.
- **Ví dụ:**

  ```typescript
  // factories/order-dto.factory.ts
  import { Order } from "../entities/order.entity";
  import { OrderDetailDto } from "../../dtos/queries/order-detail.query.dto";

  export class OrderDtoFactory {
    static createOrderDetailDto(order: Order): OrderDetailDto {
      // ... logic mapping phức tạp nếu cần
      return {
        orderId: order.id.value,
        customerId: order.customerId.value,
        items: order.items.map((i) => ({ productId: i.productId.value, quantity: i.quantity })),
        total: order.total,
      };
    }
  }
  ```

### 3.8. Specifications (Thư mục `specifications/`)

- **Mục đích:** Định nghĩa các điều kiện lọc, rule engine, hoặc điều kiện kiểm tra có thể tái sử dụng ở nhiều nơi trong application (thường cho query hoặc policy).
- **Triển khai:** Mỗi specification là một class riêng, có thể kết hợp (AND/OR/NOT) với các specification khác nếu cần.
- **Sử dụng common:** Không bắt buộc.
- **Unit Test:** Sử dụng `AssertionHelpers` để kiểm tra logic điều kiện đúng với từng trường hợp.
- **Ví dụ:**
  ```typescript
  // specifications/active-order.specification.ts
  export class ActiveOrderSpecification {
    isSatisfiedBy(order: { status: string }): boolean {
      return order.status === "active";
    }
  }
  ```

### 3.9. Event Handlers (Thư mục `event-handlers/`)

- **Mục đích:** Xử lý các application event (không phải domain event), ví dụ: phản ứng với event từ message broker, hoặc event nội bộ application.
- **Triển khai:** Mỗi event handler là một class, có thể inject port, service, ...
- **Sử dụng common:** Có thể inject ILogger, Result, ...
- **Unit Test:** Sử dụng `MockFactory`, `AssertionHelpers` để mock các dependency, kiểm tra event handler thực thi đúng.
- **Ví dụ:**

  ```typescript
  // event-handlers/order-created.event-handler.ts
  import { ILogger } from "@ecoma/common-domain";
  import { CriticalEventProcessingError } from "../errors/critical-event-processing.error";

  export class OrderCreatedEventHandler {
    constructor(private readonly logger: ILogger) {}

    async handle(event: { orderId: string }) {
      this.logger.debug("Handling OrderCreatedEvent", { event });
      try {
        // ... thực hiện các tác vụ tiếp theo
        this.logger.info(`Order created: ${event.orderId}`);
      } catch (err) {
        if (err instanceof CriticalEventProcessingError) {
          // Lỗi xử lý event critical là fatal
          this.logger.fatal("Xử lý event OrderCreated gặp lỗi nghiêm trọng", err, { event });
        } else {
          this.logger.error("OrderCreatedEventHandler failed", err, { event });
        }
      }
    }
  }
  ```

### 3.10. Pipelines (Thư mục `pipelines/`)

- **Mục đích:** Định nghĩa các pipeline/interceptor/guard đặc thù cho use-case (nếu cần custom pipeline ở Application Layer).
- **Triển khai:** Mỗi pipeline là một class, có thể dùng cho validation, logging, authorization, ...
- **Sử dụng common:** Có thể inject ILogger, ...
- **Unit Test:** Sử dụng `AssertionHelpers` để kiểm tra pipeline thực thi đúng logic mong muốn.
- **Ví dụ:**

  ```typescript
  // pipelines/logging.pipeline.ts
  import { ILogger } from "@ecoma/common-domain";

  export class LoggingPipeline {
    constructor(private readonly logger: ILogger) {}

    async process(context: any, next: () => Promise<any>) {
      this.logger.debug("Pipeline before processing", { context });
      try {
        const result = await next();
        this.logger.info("Pipeline after processing", { context });
        return result;
      } catch (err) {
        this.logger.error("Pipeline error", err, { context });
        throw err;
      }
    }
  }
  ```

### 3.11. Validators (Thư mục `validators/`)

- **Mục đích:** Gom các validator nghiệp vụ động/phức tạp, khi cần validate nhiều rule, hoặc muốn trả về nhiều lỗi cùng lúc (pattern validator).
- **Khi nào nên dùng:**
  - Khi validation nghiệp vụ phức tạp, nhiều rule động, hoặc cần gom rule, hoặc muốn trả về nhiều lỗi cùng lúc.
  - Không nên dùng cho validation đơn giản/DTO (ưu tiên dùng class-validator hoặc function đơn giản).
- **Triển khai:**
  - Sử dụng interface `IValidator`, `IValidationRule` từ `common-domain`.
  - Mỗi validator là một class, gom nhiều rule lại, trả về kết quả tổng hợp.
- **Ví dụ:**

```typescript
// validators/create-order-business.validator.ts
import { IValidator, IValidatorResult, IValidationRule } from "@ecoma/common-domain";
import { CreateOrderCommandDto } from "../dtos/commands/create-order.command.dto";

class MustHaveAtLeastOneItemRule implements IValidationRule<CreateOrderCommandDto> {
  getName() {
    return "MustHaveAtLeastOneItem";
  }
  getDescription() {
    return "Đơn hàng phải có ít nhất 1 item";
  }
  validate(dto: CreateOrderCommandDto) {
    if (!dto.items || dto.items.length === 0) {
      return { field: "items", message: "Đơn hàng phải có ít nhất 1 item", code: "NO_ITEM" };
    }
    return null;
  }
}

export class CreateOrderBusinessValidator implements IValidator<CreateOrderCommandDto> {
  private rules: IValidationRule<CreateOrderCommandDto>[] = [new MustHaveAtLeastOneItemRule()];
  validate(dto: CreateOrderCommandDto): IValidatorResult {
    const errors = this.rules.map((rule) => rule.validate(dto)).filter((e) => e !== null) as any[];
    return { isValid: errors.length === 0, errors };
  }
}
// Sử dụng trong handler nếu có nghiệp vụ động:
// const businessValidator = new CreateOrderBusinessValidator();
// const result = businessValidator.validate(command.payload);
// if (!result.isValid) { ... }
```

## 4. Unit Test trong Application Layer

| Loại                        | Nên test                                                                                   | Không test                                 |
| --------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------ |
| Command Handler             | Gọi đúng phương thức trên Aggregate (mock), repository, publish event, validate, xử lý lỗi | Không test command object (chỉ là dữ liệu) |
| Query Handler               | Gọi đúng repository, mapping sang DTO, validate kết quả                                    | Không test query object                    |
| Mapper                      | Mapping đúng chiều, đúng dữ liệu                                                           |                                            |
| Repository interface (Port) |                                                                                            | Không test (chỉ là interface)              |
| DTO                         |                                                                                            | Không test                                 |

- **Sử dụng `@ecoma/common-testing`:**
  - `MockFactory` tạo mock repository, publisher, domain service.
  - `EventTestingHelper` kiểm tra event publish.
  - `AssertionHelpers` kiểm tra dữ liệu trả về.

---

## 5. Thực hành tốt nhất cho Application Layer

1. **Giữ Application Layer mỏng:** Chỉ orchestration, không chứa logic nghiệp vụ.
2. **Phụ thuộc abstraction domain:** Không biết chi tiết infrastructure.
3. **Tách biệt CQRS:** Command/Query rõ ràng.
4. **Quản lý transaction:** Có thể dùng decorator/middleware.
5. **Kiểm tra quyền hạn:** Thực hiện ở Application.
6. **Validation đầu vào:** Validate command/query ngay khi vào handler.
7. **Không trả về domain object:** Chỉ trả về DTO.
8. **Tương tác infrastructure qua port:** Không gọi trực tiếp DB, message broker, v.v.
9. **Idempotency cho command:** Nếu nghiệp vụ yêu cầu.
10. **Tận dụng DI:** Inject repository, publisher, service qua constructor.
11. **Tổ chức theo use case:** Nhóm file theo feature/use case.
12. **Tái sử dụng domain service:** Nếu orchestration phức tạp.
13. **Logging chi tiết, có cấu trúc:** Inject ILogger, log đủ ngữ cảnh, không log dữ liệu nhạy cảm.
14. **index.ts ở mỗi thư mục:** Để dễ import và refactor.
15. **Không lặp code, tận dụng common:** Luôn kiểm tra common trước khi tự định nghĩa lại.
16. **Chỉ dùng validators/ khi validation nghiệp vụ động/phức tạp, còn lại ưu tiên dùng class-validator cho DTO hoặc function đơn giản.**
