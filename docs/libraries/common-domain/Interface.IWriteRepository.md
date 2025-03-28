# Interface: IWriteRepository\<TId, TAggregateRoot\>

Interface định nghĩa repository ghi dữ liệu

## Extended by

- [`IRepository`](/libraries/common-domain/Interface.IRepository.md)

## Type Parameters

### TId

`TId` _extends_ [`AbstractId`](/libraries/common-domain/Class.AbstractId.md)

### TAggregateRoot

`TAggregateRoot` _extends_ [`AbstractAggregate`](/libraries/common-domain/Class.AbstractAggregate.md)\<`TId`\>

## Methods

<a id="delete"></a>

### delete()

> **delete**(`id`): `Promise`\<`void`\>

Xóa một aggregate root theo ID

#### Parameters

##### id

`TId`

ID của aggregate root cần xóa

#### Returns

`Promise`\<`void`\>

---

<a id="deletemany"></a>

### deleteMany()

> **deleteMany**(`ids`): `Promise`\<`void`\>

Xóa nhiều aggregate roots theo danh sách ID

#### Parameters

##### ids

`TId`[]

Danh sách ID của các aggregate roots cần xóa

#### Returns

`Promise`\<`void`\>

---

<a id="save"></a>

### save()

> **save**(`aggregateRoot`): `Promise`\<`void`\>

Lưu một aggregate root

#### Parameters

##### aggregateRoot

`TAggregateRoot`

Aggregate root cần lưu

#### Returns

`Promise`\<`void`\>
