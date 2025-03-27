# Class: `abstract` AbstractEntity\<TId, TProps\>

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

`TId` _extends_ [`AbstractId`](/libraries/common-domain/Class.AbstractId.md)

Kiểu dữ liệu của ID, phải kế thừa từ AbstractId

### TProps

`TProps` _extends_ [`IEntityProps`](/libraries/common-domain/Interface.IEntityProps.md)\<`TId`\>

## Constructors

<a id="constructor"></a>

### Constructor

> **new AbstractEntity**\<`TId`, `TProps`\>(`props`): `AbstractEntity`\<`TId`, `TProps`\>

Tạo một instance mới của Entity.

#### Parameters

##### props

`TProps`

props của Entity

#### Returns

`AbstractEntity`\<`TId`, `TProps`\>

## Properties

<a id="props"></a>

### props

> `protected` **props**: `TProps`

## Accessors

<a id="id"></a>

### id

#### Get Signature

> **get** **id**(): `TId`

Lấy id của Entity

##### Returns

`TId`

id của entity

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

`AbstractEntity`\<`TId`, `TProps`\>

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
