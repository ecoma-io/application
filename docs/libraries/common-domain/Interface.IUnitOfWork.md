# Interface: IUnitOfWork

Interface định nghĩa Unit of Work pattern trong Domain Driven Design.
Unit of Work đảm bảo tính nhất quán của dữ liệu bằng cách quản lý các transaction.

## Example

```typescript
class OrderUnitOfWork implements IUnitOfWork {
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

## Methods

<a id="commit"></a>

### commit()

> **commit**(): `Promise`\<`void`\>

Commit transaction hiện tại.
Method này nên được gọi sau khi tất cả các thao tác đã thành công.

#### Returns

`Promise`\<`void`\>

Promise<void>

#### Throws

Error nếu không thể commit transaction

---

<a id="execute"></a>

### execute()

> **execute**\<`T`\>(`work`): `Promise`\<`T`\>

Thực thi một unit of work trong một transaction.
Nếu work function throw error, transaction sẽ được rollback.
Nếu work function thành công, transaction sẽ được commit.

#### Type Parameters

##### T

`T`

#### Parameters

##### work

() => `Promise`\<`T`\>

Function chứa các thao tác cần thực hiện trong transaction

#### Returns

`Promise`\<`T`\>

Promise chứa kết quả của work function

#### Throws

Error nếu có lỗi xảy ra trong quá trình thực thi

---

<a id="rollback"></a>

### rollback()

> **rollback**(): `Promise`\<`void`\>

Rollback transaction hiện tại.
Method này nên được gọi khi có lỗi xảy ra trong quá trình thực thi.

#### Returns

`Promise`\<`void`\>

Promise<void>

#### Throws

Error nếu không thể rollback transaction
