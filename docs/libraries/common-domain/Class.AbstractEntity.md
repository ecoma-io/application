# Class: `abstract` AbstractEntity\<TId\>

Lớp cơ sở trừu tượng cho tất cả các Entity trong Domain Driven Design.

Entity là một đối tượng có định danh duy nhất (ID) và vòng đời liên tục.
Hai Entity được coi là bằng nhau nếu chúng có cùng ID và cùng loại.

## Example

```typescript
class Product extends AbstractEntity<UuidId> {
  constructor(id: UuidId) {
    super(id);
  }
}

const product1 = new Product(new UuidId());
const product2 = new Product(new UuidId());
console.log(product1.equals(product2)); // false
```

## Extended by

- [`AbstractAggregate`](/libraries/common-domain/Class.AbstractAggregate.md)

## Type Parameters

### TId

`TId` *extends* [`AbstractId`](/libraries/common-domain/Class.AbstractId.md)

Kiểu dữ liệu của ID, phải kế thừa từ AbstractId

## Constructors

<a id="constructor"></a>

### Constructor

> **new AbstractEntity**\<`TId`\>(`id`): `AbstractEntity`\<`TId`\>

Tạo một instance mới của Entity.

#### Parameters

##### id

`TId`

ID của Entity

#### Returns

`AbstractEntity`\<`TId`\>

## Properties

<a id="id"></a>

### id

> `readonly` **id**: `TId`

ID của Entity. Được đánh dấu là readonly để đảm bảo không thay đổi sau khi tạo.

## Methods

<a id="equals"></a>

### equals()

> **equals**(`entity?`): `boolean`

So sánh hai Entity dựa trên ID và loại của chúng.
Hai Entity được coi là bằng nhau nếu:
1. Chúng là cùng một loại Entity (cùng constructor)
2. Chúng có cùng ID

#### Parameters

##### entity?

`AbstractEntity`\<`TId`\>

Entity khác để so sánh

#### Returns

`boolean`

true nếu hai Entity bằng nhau, ngược lại là false

#### Example

```typescript
const product1 = new Product(new UuidId());
const product2 = new Product(new UuidId());
const order = new Order(new UuidId());

console.log(product1.equals(product2)); // false (khác ID)
console.log(product1.equals(order)); // false (khác loại)
```
