# Class: SnowflakeId

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

## Extends

- [`AbstractId`](/libraries/common-domain/Class.AbstractId.md)

## Constructors

<a id="constructor"></a>

### Constructor

> **new SnowflakeId**(`value`): `SnowflakeId`

#### Parameters

##### value

`string`

#### Returns

`SnowflakeId`

#### Overrides

[`AbstractId`](/libraries/common-domain/Class.AbstractId.md).[`constructor`](/libraries/common-domain/Class.AbstractId.md#constructor)

## Properties

<a id="props"></a>

### props

> `protected` `readonly` **props**: `object`

Các thuộc tính của Value Object.
Được đánh dấu là readonly và frozen để đảm bảo tính bất biến.

#### value

> **value**: `string`

#### Inherited from

[`AbstractId`](/libraries/common-domain/Class.AbstractId.md).[`props`](/libraries/common-domain/Class.AbstractId.md#props)

## Accessors

<a id="value"></a>

### value

#### Get Signature

> **get** **value**(): `string`

##### Returns

`string`

#### Inherited from

[`AbstractId`](/libraries/common-domain/Class.AbstractId.md).[`value`](/libraries/common-domain/Class.AbstractId.md#value)

## Methods

<a id="clone"></a>

### clone()

> **clone**(): `object`

Tạo một bản sao của Value Object.
Sử dụng structuredClone để tạo một bản sao sâu của các thuộc tính.

#### Returns

`object`

Một instance mới của Value Object với cùng các thuộc tính

##### value

> **value**: `string`

#### Example

```typescript
const money = new Money(100, 'USD');
const moneyCopy = money.clone();
console.log(money.equals(moneyCopy)); // true
```

#### Inherited from

[`AbstractId`](/libraries/common-domain/Class.AbstractId.md).[`clone`](/libraries/common-domain/Class.AbstractId.md#clone)

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

[`AbstractValueObject`](/libraries/common-domain/Class.AbstractValueObject.md)\<\{ `value`: `string`; \}\>

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

#### Inherited from

[`AbstractId`](/libraries/common-domain/Class.AbstractId.md).[`equals`](/libraries/common-domain/Class.AbstractId.md#equals)

***

<a id="tostring"></a>

### toString()

> **toString**(): `string`

Returns a string representation of an object.

#### Returns

`string`

#### Inherited from

[`AbstractId`](/libraries/common-domain/Class.AbstractId.md).[`toString`](/libraries/common-domain/Class.AbstractId.md#tostring)

***

<a id="generate"></a>

### generate()

> `static` **generate**(): `SnowflakeId`

Tạo một SnowflakeId mới sử dụng thư viện @sapphire/snowflake.

#### Returns

`SnowflakeId`

Một instance mới của SnowflakeId.
