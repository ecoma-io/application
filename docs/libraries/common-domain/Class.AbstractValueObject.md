# Class: `abstract` AbstractValueObject\<T\>

Lớp cơ sở trừu tượng cho tất cả các Value Object trong Domain Driven Design.

Value Object là một đối tượng không có định danh, được xác định bởi giá trị của các thuộc tính.
Hai Value Object được coi là bằng nhau nếu chúng có cùng giá trị và cùng loại.

## Example

```typescript
class Money extends AbstractValueObject<{ amount: number; currency: string }> {
  constructor(amount: number, currency: string) {
    super({ amount, currency });
  }

  public getAmount(): number {
    return this.props.amount;
  }

  public getCurrency(): string {
    return this.props.currency;
  }
}

const money1 = new Money(100, 'USD');
const money2 = new Money(100, 'USD');
console.log(money1.equals(money2)); // true
```

## Extended by

- [`AbstractId`](/libraries/common-domain/Class.AbstractId.md)
- [`Email`](/libraries/common-domain/Class.Email.md)

## Type Parameters

### T

`T` *extends* `object`

Kiểu dữ liệu của các thuộc tính

## Constructors

<a id="constructor"></a>

### Constructor

> **new AbstractValueObject**\<`T`\>(`props`): `AbstractValueObject`\<`T`\>

Tạo một instance mới của Value Object.

#### Parameters

##### props

`T`

Các thuộc tính của Value Object

#### Returns

`AbstractValueObject`\<`T`\>

#### Example

```typescript
const money = new Money(100, 'USD');
```

## Properties

<a id="props"></a>

### props

> `protected` `readonly` **props**: `T`

Các thuộc tính của Value Object.
Được đánh dấu là readonly và frozen để đảm bảo tính bất biến.

## Methods

<a id="clone"></a>

### clone()

> **clone**(): `T`

Tạo một bản sao của Value Object.
Sử dụng structuredClone để tạo một bản sao sâu của các thuộc tính.

#### Returns

`T`

Một instance mới của Value Object với cùng các thuộc tính

#### Example

```typescript
const money = new Money(100, 'USD');
const moneyCopy = money.clone();
console.log(money.equals(moneyCopy)); // true
```

***

<a id="equals"></a>

### equals()

> **equals**(`vo?`): `boolean`

So sánh hai Value Object dựa trên giá trị của các thuộc tính.
Hai Value Object được coi là bằng nhau nếu:
1. Chúng là cùng một loại Value Object (cùng constructor)
2. Tất cả các thuộc tính của chúng có cùng giá trị

#### Parameters

##### vo?

`AbstractValueObject`\<`T`\>

Value Object khác để so sánh

#### Returns

`boolean`

true nếu hai Value Object bằng nhau, ngược lại là false

#### Example

```typescript
const money1 = new Money(100, 'USD');
const money2 = new Money(100, 'USD');
const money3 = new Money(200, 'USD');

console.log(money1.equals(money2)); // true
console.log(money1.equals(money3)); // false
```
