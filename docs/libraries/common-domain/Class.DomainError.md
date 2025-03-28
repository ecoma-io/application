# Class: DomainError\<TDetails, TInterpolationParams\>

Lớp cơ sở cho tất cả các lỗi domain trong hệ thống.
DomainError cung cấp một cách chuẩn hóa để xử lý và phân loại các lỗi domain.

## Example

```typescript
class OrderNotFoundError extends DomainError {
  constructor(orderId: string) {
    super('ORDER_NOT_FOUND', `Order with ID ${orderId} not found`);
  }
}

class InvalidOrderStatusError extends DomainError {
  constructor(currentStatus: string, expectedStatus: string) {
    super(
      'INVALID_ORDER_STATUS',
      `Cannot change order status from ${currentStatus} to ${expectedStatus}`
    );
  }
}
```

## Extends

- `Error`

## Extended by

- [`InvalidIdError`](/libraries/common-domain/Class.InvalidIdError.md)
- [`GenerateSnowFlakeError`](/libraries/common-domain/Class.GenerateSnowFlakeError.md)
- [`InvalidEmailError`](/libraries/common-domain/Class.InvalidEmailError.md)

## Type Parameters

### TDetails

`TDetails` = `unknown`

### TInterpolationParams

`TInterpolationParams` *extends* `Record`\<`string`, `Maybe`\<`Primitive`\>\> = `Record`\<`string`, `Maybe`\<`Primitive`\>\>

## Constructors

<a id="constructor"></a>

### Constructor

> **new DomainError**\<`TDetails`, `TInterpolationParams`\>(`code`, `message`, `interpolationParams?`, `details?`): `DomainError`\<`TDetails`, `TInterpolationParams`\>

Tạo một instance mới của DomainError.

#### Parameters

##### code

`string`

Mã lỗi domain

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

`DomainError`\<`TDetails`, `TInterpolationParams`\>

#### Overrides

`Error.constructor`

## Properties

<a id="code"></a>

### code

> `readonly` **code**: `string`

Mã lỗi domain.

***

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

***

<a id="isdomainerror"></a>

### isDomainError()

> `static` **isDomainError**(`error`): `error is DomainError<unknown, Record<string, Maybe<Primitive>>>`

Kiểm tra xem một error có phải là DomainError hay không.

#### Parameters

##### error

`unknown`

Error cần kiểm tra

#### Returns

`error is DomainError<unknown, Record<string, Maybe<Primitive>>>`

true nếu error là DomainError, ngược lại là false
