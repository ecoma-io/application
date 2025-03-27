# Class: ApplicationError\<TDetails, TInterpolationParams\>

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

- `Error`

## Extended by

- [`CommandError`](/libraries/common-application/Class.CommandError.md)
- [`QueryError`](/libraries/common-application/Class.QueryError.md)

## Type Parameters

### TDetails

`TDetails` = `unknown`

### TInterpolationParams

`TInterpolationParams` *extends* `Record`\<`string`, `Maybe`\<`Primitive`\>\> = `Record`\<`string`, `Maybe`\<`Primitive`\>\>

## Constructors

<a id="constructor"></a>

### Constructor

> **new ApplicationError**\<`TDetails`, `TInterpolationParams`\>(`message`, `interpolationParams?`, `details?`): `ApplicationError`\<`TDetails`, `TInterpolationParams`\>

Tạo một instance mới của DomainError.

#### Parameters

##### message

`string`

Thông điệp lỗi

##### interpolationParams?

`TInterpolationParams`

Tham số nội suy cho bản dịch

##### details?

`TDetails`

Chi tiết lỗi (có thể dùng để log hoặc hiển thị nâng cao)

#### Returns

`ApplicationError`\<`TDetails`, `TInterpolationParams`\>

#### Overrides

`Error.constructor`

## Properties

<a id="details"></a>

### details?

> `readonly` `optional` **details**: `TDetails`

Chi tiết lỗi (có thể dùng để log hoặc hiển thị nâng cao)

***

<a id="interpolationparams"></a>

### interpolationParams?

> `readonly` `optional` **interpolationParams**: `TInterpolationParams`

Tham số nội suy cho bản dịch

***

<a id="message"></a>

### message

> **message**: `string`

#### Inherited from

`Error.message`

***

<a id="name"></a>

### name

> **name**: `string`

#### Inherited from

`Error.name`

***

<a id="stack"></a>

### stack?

> `optional` **stack**: `string`

#### Inherited from

`Error.stack`

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

`Error.prepareStackTrace`

***

<a id="stacktracelimit"></a>

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

`Error.stackTraceLimit`

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

`Error.captureStackTrace`
