# Class: CommandError

Lớp cơ sở cho tất cả các lỗi application trong hệ thống.
ApplicationError cung cấp một cách chuẩn hóa để xử lý và phân loại các lỗi application.

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

- [`ApplicationError`](/libraries/common-application/Class.ApplicationError.md)

## Constructors

<a id="constructor"></a>

### Constructor

> **new CommandError**(`message`, `interpolationParams?`, `details?`): `CommandError`

#### Parameters

##### message

`string`

##### interpolationParams?

`Record`\<`string`, `Maybe`\<`Primitive`\>\>

##### details?

`unknown`

#### Returns

`CommandError`

#### Overrides

[`ApplicationError`](/libraries/common-application/Class.ApplicationError.md).[`constructor`](/libraries/common-application/Class.ApplicationError.md#constructor)

## Properties

<a id="details"></a>

### details?

> `readonly` `optional` **details**: `unknown`

Chi tiết lỗi (có thể dùng để log hoặc hiển thị nâng cao)

#### Inherited from

[`ApplicationError`](/libraries/common-application/Class.ApplicationError.md).[`details`](/libraries/common-application/Class.ApplicationError.md#details)

***

<a id="interpolationparams"></a>

### interpolationParams?

> `readonly` `optional` **interpolationParams**: `Record`\<`string`, `Maybe`\<`Primitive`\>\>

Tham số nội suy cho bản dịch

#### Inherited from

[`ApplicationError`](/libraries/common-application/Class.ApplicationError.md).[`interpolationParams`](/libraries/common-application/Class.ApplicationError.md#interpolationparams)

***

<a id="message"></a>

### message

> **message**: `string`

#### Inherited from

[`ApplicationError`](/libraries/common-application/Class.ApplicationError.md).[`message`](/libraries/common-application/Class.ApplicationError.md#message)

***

<a id="name"></a>

### name

> **name**: `string`

#### Inherited from

[`ApplicationError`](/libraries/common-application/Class.ApplicationError.md).[`name`](/libraries/common-application/Class.ApplicationError.md#name)

***

<a id="stack"></a>

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`ApplicationError`](/libraries/common-application/Class.ApplicationError.md).[`stack`](/libraries/common-application/Class.ApplicationError.md#stack)

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

[`ApplicationError`](/libraries/common-application/Class.ApplicationError.md).[`prepareStackTrace`](/libraries/common-application/Class.ApplicationError.md#preparestacktrace)

***

<a id="stacktracelimit"></a>

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`ApplicationError`](/libraries/common-application/Class.ApplicationError.md).[`stackTraceLimit`](/libraries/common-application/Class.ApplicationError.md#stacktracelimit)

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

[`ApplicationError`](/libraries/common-application/Class.ApplicationError.md).[`captureStackTrace`](/libraries/common-application/Class.ApplicationError.md#capturestacktrace)
