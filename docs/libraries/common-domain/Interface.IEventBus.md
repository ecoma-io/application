# Interface: IEventBus

Interface định nghĩa một Event Bus để phát các Domain Event

Event Bus chịu trách nhiệm phát các Domain Event đến các subscriber quan tâm.
Các implementation cụ thể (như RabbitMQ, NATS) sẽ triển khai interface này.

## Since

1.0.0

## Example

```typescript
class RabbitMQEventBus implements IEventBus {
  async publish(events: AbstractDomainEvent[]): Promise<void> {
    // Phát event qua RabbitMQ
  }
}
```

## Methods

<a id="publish"></a>

### publish()

> **publish**(`events`): `Promise`\<`void`\>

Phát một mảng các Domain Event

#### Parameters

##### events

[`AbstractDomainEvent`](/libraries/common-domain/Class.AbstractDomainEvent.md)[]

Mảng các Domain Event cần phát

#### Returns

`Promise`\<`void`\>

Promise void khi tất cả các event đã được phát thành công

#### Throws

Nếu có lỗi khi phát event (ví dụ: mất kết nối message broker)

#### Example

```typescript
const events = [new UserCreatedEvent(), new EmailSentEvent()];
await eventBus.publish(events);
```
