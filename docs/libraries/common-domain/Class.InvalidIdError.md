# Class: InvalidIdError

Lớp cơ sở cho tất cả các lỗi domain trong hệ thống.
DomainError cung cấp một cách chuẩn hóa để xử lý và phân loại các lỗi domain.

## Since

1.0.0

## Example

```typescript
class OrderNotFoundError extends DomainError {
  constructor(orderId: string) {
    super(`Order with ID {orderId} not found`, {orderId});
  }
}

## Extends

- [`DomainError`](/libraries/common-domain/Class.DomainError.md)

## Constructors

<a id="constructor"></a>

### Constructor

> **new InvalidIdError**(`message`, `interpolationParams?`): `InvalidIdError`

#### Parameters

##### message

`string`

##### interpolationParams?

`Record`\<`string`, `Maybe`\<`Primitive`\>\>

#### Returns

`InvalidIdError`

#### Overrides

[`DomainError`](/libraries/common-domain/Class.DomainError.md).[`constructor`](/libraries/common-domain/Class.DomainError.md#constructor)

## Properties

<a id="details"></a>

### details?

> `readonly` `optional` **details**: `unknown`

Chi tiết lỗi (có thể dùng để log hoặc hiển thị nâng cao)

#### Inherited from

[`DomainError`](/libraries/common-domain/Class.DomainError.md).[`details`](/libraries/common-domain/Class.DomainError.md#details)

***

<a id="interpolationparams"></a>

### interpolationParams?

> `readonly` `optional` **interpolationParams**: `Record`\<`string`, `Maybe`\<`Primitive`\>\>

Tham số nội suy cho bản dịch

#### Inherited from

[`DomainError`](/libraries/common-domain/Class.DomainError.md).[`interpolationParams`](/libraries/common-domain/Class.DomainError.md#interpolationparams)

***

<a id="message"></a>

### message

> **message**: `string`

#### Inherited from

[`DomainError`](/libraries/common-domain/Class.DomainError.md).[`message`](/libraries/common-domain/Class.DomainError.md#message)

***

<a id="name"></a>

### name

> **name**: `string`

#### Inherited from

[`DomainError`](/libraries/common-domain/Class.DomainError.md).[`name`](/libraries/common-domain/Class.DomainError.md#name)

***

<a id="stack"></a>

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`DomainError`](/libraries/common-domain/Class.DomainError.md).[`stack`](/libraries/common-domain/Class.DomainError.md#stack)

***

<a id="preparestacktrace"></a>

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Optional override for formatting stack traces

#### Parameters

##### err

`Error`

##### stackTraces

`CallSite`[]

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

[`DomainError`](/libraries/common-domain/Class.DomainError.md).[`prepareStackTrace`](/libraries/common-domain/Class.DomainError.md#preparestacktrace)

***

<a id="stacktracelimit"></a>

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`DomainError`](/libraries/common-domain/Class.DomainError.md).[`stackTraceLimit`](/libraries/common-domain/Class.DomainError.md#stacktracelimit)

## Methods

<a id="capturestacktrace"></a>

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

##### targetObject

`object`

##### constructorOpt?

`Function`

#### Returns

`void`

#### Inherited from

[`DomainError`](/libraries/common-domain/Class.DomainError.md).[`captureStackTrace`](/libraries/common-domain/Class.DomainError.md#capturestacktrace)
