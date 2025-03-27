# Common Testing Library

Thư viện này cung cấp các công cụ và utilities cho việc testing trong dự án.

## Cài đặt

```bash
npm install @ecoma/common-testing
```

## Tính năng

### Test Containers

Thư viện cung cấp các container cho testing:

- MongoDB Container
- NATS Container
- RabbitMQ Container
- Redis Container
- Maildev Container
- PostgreSQL Container
- ToxiProxy Container

#### Ví dụ sử dụng PostgresContainer

```typescript
import { PostgresContainer } from "@ecoma/common-testing";

const container = new PostgresContainer();
const started = await container.start();
const connStr = started.getConnectionString();
// Sử dụng connStr để kết nối DB trong integration test
```

#### Ví dụ sử dụng MongoDBContainer

```typescript
import { MongoDBContainer } from "@ecoma/common-testing";

const container = new MongoDBContainer();
const started = await container.start();
const connStr = started.getConnectionString();
// Sử dụng connStr để kết nối MongoDB trong integration test
```

#### Ví dụ sử dụng RabbitMQContainer

```typescript
import { RabbitMQContainer } from "@ecoma/common-testing";

const container = new RabbitMQContainer();
const started = await container.start();
const url = started.getAmqpUrl();
// Sử dụng url để kết nối RabbitMQ trong integration test
```

#### Ví dụ sử dụng RedisContainer

```typescript
import { RedisContainer } from "@ecoma/common-testing";

const container = new RedisContainer();
const started = await container.start();
const url = started.getRedisUrl();
// Sử dụng url để kết nối Redis trong integration test
```

#### Ví dụ sử dụng MaildevContainer

```typescript
import { MaildevContainer } from "@ecoma/common-testing";

const container = new MaildevContainer();
const started = await container.start();
const smtpPort = started.getSmtpPort();
const uiPort = started.getUiPort();
// Cấu hình SMTP client với port này trong test
// Truy cập UI tại http://localhost:${uiPort} để xem mail được gửi
```

#### Ví dụ sử dụng ToxiProxyContainer

```typescript
import { ToxiProxyContainer, PostgresContainer } from "@ecoma/common-testing";

// Khởi tạo ToxiProxy và service container
const toxiproxy = new ToxiProxyContainer();
const postgres = new PostgresContainer();

// Khởi động các container
await toxiproxy.start();
await postgres.start();

// Tạo proxy cho Postgres
const proxy = await toxiproxy.createProxy("postgres", "0.0.0.0:8666", postgres.getHost() + ":" + postgres.getPort());

// Giả lập độ trễ mạng
await proxy.addToxic("latency", "latency", "downstream", 1.0, { latency: 1000 });

// Sử dụng proxy.getProxyHost() và proxy.getProxyPort() để kết nối
const proxyConnStr = `postgresql://postgres:postgres@${proxy.getProxyHost()}:${proxy.getProxyPort()}/postgres`;

// Khôi phục về trạng thái bình thường
await proxy.removeToxic("latency");
```

### Test Helpers

#### TestDataFactory

```typescript
import { TestDataFactory } from "@ecoma/common-testing";

// Tạo UUID
const uuid = TestDataFactory.createUUID();
// Tạo email
const email = TestDataFactory.createEmail();
// Tạo username
const username = TestDataFactory.createUsername();
// Tạo password
const password = TestDataFactory.createPassword();
// Tạo số ngẫu nhiên
const number = TestDataFactory.createNumber(1, 100);
// Tạo ngày ngẫu nhiên
const date = TestDataFactory.createDate(new Date(2000, 0, 1), new Date());
// Tạo chuỗi ngẫu nhiên
const string = TestDataFactory.createString(10);
// Tạo tên sản phẩm
const productName = TestDataFactory.createProductName();
// Tạo mã SKU
const sku = TestDataFactory.createSKU();
// Tạo số tiền
const amount = TestDataFactory.createAmount();
// Tạo trạng thái đơn hàng
const status = TestDataFactory.createOrderStatus();
// Tạo tên khách hàng
const customer = TestDataFactory.createCustomerName();
```

#### MockFactory

```typescript
import { MockFactory, MockNatsClient, MockRabbitMQClient } from "@ecoma/common-testing";

// Tạo mock function
const mockFn = MockFactory.createMockFn(() => "result");
// Tạo mock object
const mockObject = MockFactory.createMockObject({ method: jest.fn() });
// Tạo spy
const spy = MockFactory.createSpy(mockObject, "method");
// Tạo mock class
const mockClass = MockFactory.createMockClass({ method: jest.fn() });

// Mock NATS client
const nats = new MockNatsClient();
const natsResp = await nats.request("test.subject", { foo: "bar" });
// Mock RabbitMQ client
const rabbit = new MockRabbitMQClient();
const ok = await rabbit.publish("queue", { bar: "baz" });
```

#### AssertionHelpers

```typescript
import { AssertionHelpers } from "@ecoma/common-testing";

// Kiểm tra properties
AssertionHelpers.expectToContainAllProperties(actual, expected);
// Kiểm tra array
AssertionHelpers.expectArrayToContainAll(actual, expected);
// Kiểm tra date
AssertionHelpers.expectDateToBeBetween(actual, start, end);
// Kiểm tra string
AssertionHelpers.expectStringToMatch(actual, pattern);
// Kiểm tra type
AssertionHelpers.expectToBeInstanceOf(actual, expectedType);
// Kiểm tra error
AssertionHelpers.expectToThrowWithMessage(fn, expectedMessage);
```

#### TestUtils

```typescript
import { TestUtils } from "@ecoma/common-testing";

// Tạo array
const array = TestUtils.createArray(5, (index) => ({ id: index }));
// Tạo random object
const object = TestUtils.createRandomObject(template, overrides);
// Deep copy
const copy = TestUtils.deepCopy(object);
// Delay
await TestUtils.delay(1000);
// Retry
const result = await TestUtils.retry(fn, 3, 1000);
// Timeout
await TestUtils.timeout(5000);
```

#### ApiTestingHelper

```typescript
import { ApiTestingHelper } from "@ecoma/common-testing";

// Tạo testing module
const module = await ApiTestingHelper.createTestingModule({
  imports: [AppModule],
});

// Tạo app
const app = await ApiTestingHelper.createApp(module);

// Tạo request agent
const agent = ApiTestingHelper.createRequestAgent(app);

// Test API
const response = await agent.get("/api/users").expect(200);

// Đóng app
await ApiTestingHelper.closeApp(app);

// Hoặc tạo test client trong một bước
const { requestAgent, app } = await ApiTestingHelper.createTestClient({
  imports: [AppModule],
});
```

#### EventTestingHelper

```typescript
import { EventTestingHelper } from "@ecoma/common-testing";

// Tạo spy cho phương thức publish
const publishSpy = jest.spyOn(eventPublisher, "publish");

// Kiểm tra event được publish
EventTestingHelper.expectEventPublished(publishSpy, "order.created", {
  orderId: "123",
  items: ["item1", "item2"],
});

// Kiểm tra số lần publish
EventTestingHelper.expectEventPublishedTimes(publishSpy, "order.created", 1);

// Kiểm tra thứ tự publish
EventTestingHelper.expectEventsPublishedInOrder(publishSpy, [
  ["order.processing", { orderId: "123" }],
  ["order.shipped", { orderId: "123" }],
]);
```

#### SnapshotHelper

```typescript
import { SnapshotHelper } from "@ecoma/common-testing";

// So sánh với snapshot
SnapshotHelper.toMatchSnapshot(value);

// So sánh với snapshot có tên
SnapshotHelper.toMatchSnapshot(value, "my-snapshot");

// Chuẩn hóa object trước khi snapshot
const normalized = SnapshotHelper.normalizeForSnapshot(object, ["id", "createdAt"]);

// So sánh object đã chuẩn hóa với snapshot
SnapshotHelper.toMatchNormalizedSnapshot(object, ["id", "createdAt"]);
```

#### TestContext

```typescript
import { ContainerTestContext } from "@ecoma/common-testing";

// Tạo test context cho container
const context = new ContainerTestContext();

// Thêm container
context.addContainer(new PostgresContainer());
context.addContainer(new MongoDBContainer());

// Setup (khởi động tất cả container)
await context.setup();

// Lấy container đã khởi động
const postgres = context.getStartedContainer(0);
const mongo = context.getStartedContainer(1);

// Teardown (dừng tất cả container)
await context.teardown();

// Hoặc chạy trong ngữ cảnh
await context.run(async () => {
  // Code sẽ chạy sau khi setup và trước khi teardown
  const postgres = context.getStartedContainer(0);
  // ... test logic ...
});
```

## Best Practices

1. Sử dụng TestDataFactory để tạo test data thay vì hardcode
2. Sử dụng MockFactory để tạo mocks và spies
3. Sử dụng AssertionHelpers để viết assertions rõ ràng và dễ đọc
4. Sử dụng TestUtils để xử lý các tác vụ phổ biến trong testing
5. Sử dụng Test Containers để test với các services thật
6. Sử dụng ApiTestingHelper để test API NestJS
7. Sử dụng EventTestingHelper để test event/message
8. Sử dụng SnapshotHelper để so sánh kết quả với snapshot
9. Sử dụng TestContext để quản lý môi trường test

## Tổng hợp các Helper

| Helper             | Mô tả                             |
| ------------------ | --------------------------------- |
| TestDataFactory    | Tạo dữ liệu test ngẫu nhiên       |
| MockFactory        | Tạo mock/spy cho Jest             |
| AssertionHelpers   | Các assertion helper              |
| TestUtils          | Các tiện ích chung                |
| ApiTestingHelper   | Helper cho API testing với NestJS |
| EventTestingHelper | Helper cho event/message testing  |
| SnapshotHelper     | Helper cho snapshot testing       |
| TestContext        | Context manager cho test          |

## Ví dụ Test

Xem thêm các ví dụ test thực tế trong thư mục `examples`:

- [Container Testing](./src/lib/examples/container-example.test.ts)
- [API Testing](./src/lib/examples/api-testing-example.test.ts)
- [Event Testing](./src/lib/examples/event-testing-example.test.ts)

## Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## License

MIT
