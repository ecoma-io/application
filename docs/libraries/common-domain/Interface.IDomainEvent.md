# Interface: IDomainEvent

Lớp cơ sở trừu tượng cho tất cả các Domain Event trong Domain Driven Design.

Domain Event đại diện cho một sự kiện quan trọng đã xảy ra trong Domain.
Mỗi event có một ID duy nhất, timestamp và metadata.

## Example

```typescript
class OrderCreatedEvent extends AbstractDomainEvent {
  public readonly orderId: string;
  public readonly customerId: string;

  constructor(orderId: string, customerId: string) {
    super();
    this.orderId = orderId;
    this.customerId = customerId;
  }
}
```

## Properties

<a id="aggregateversion"></a>

### aggregateVersion?

> `optional` **aggregateVersion**: `number`

Phiên bản của Aggregate Root sau khi sự kiện này xảy ra.
Được sử dụng cho optimistic concurrency control và event sourcing.

#### Example

```typescript
const metadata: IDomainEventMetadata = {
  aggregateVersion: 1,
};
```

---

<a id="causationid"></a>

### causationId?

> `optional` **causationId**: `string`

Định danh nguyên nhân (Causation ID).
ID của sự kiện hoặc lệnh (Command) đã trực tiếp gây ra sự kiện này.

#### Example

```typescript
const metadata: IDomainEventMetadata = {
  causationId: "123e4567-e89b-12d3-a456-426614174001",
};
```

---

<a id="correlationid"></a>

### correlationId?

> `optional` **correlationId**: `string`

Định danh tương quan (Correlation ID).
Dùng để liên kết các sự kiện và hành động thuộc cùng một luồng xử lý ban đầu (request).

#### Example

```typescript
const metadata: IDomainEventMetadata = {
  correlationId: "123e4567-e89b-12d3-a456-426614174000",
};
```

---

<a id="id"></a>

### id

> **id**: `string`

ID duy nhất của event, được tạo tự động nếu không được cung cấp.
Sử dụng UUID v7 để đảm bảo tính duy nhất và có thể sắp xếp theo thời gian.

---

<a id="ipaddress"></a>

### ipAddress?

> `optional` **ipAddress**: `string`

Địa chỉ IP liên quan đến hành động.
Được sử dụng cho audit logging và bảo mật.

#### Example

```typescript
const metadata: IDomainEventMetadata = {
  ipAddress: "192.168.1.1",
};
```

---

<a id="language"></a>

### language?

> `optional` **language**: `string`

Ngôn ngữ liên quan đến ngữ cảnh người dùng/request.
Tuân theo chuẩn BCP 47 language tag.

#### Example

```typescript
const metadata: IDomainEventMetadata = {
  language: "vi-VN",
};
```

---

<a id="sourceboundedcontext"></a>

### sourceBoundedContext?

> `optional` **sourceBoundedContext**: `string`

Tên của Bounded Context nguồn đã phát ra sự kiện.
Chỉ bắt buộc cho Integration Events giữa các BC.

#### Example

```typescript
const metadata: IDomainEventMetadata = {
  sourceBoundedContext: "OrderManagement",
};
```

---

<a id="timestamp"></a>

### timestamp

> **timestamp**: `Date`

Thời điểm event xảy ra, mặc định là thời điểm tạo event.

---

<a id="useragent"></a>

### userAgent?

> `optional` **userAgent**: `string`

User agent của client liên quan đến hành động.
Được sử dụng cho audit logging và phân tích.

#### Example

```typescript
const metadata: IDomainEventMetadata = {
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
};
```

---

<a id="userid"></a>

### userId?

> `optional` **userId**: `string`

ID của người dùng đã khởi tạo hành động dẫn đến sự kiện.
Được sử dụng cho audit logging và truy vết.

#### Example

```typescript
const metadata: IDomainEventMetadata = {
  userId: "user-123",
};
```
