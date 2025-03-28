# Class: InvalidEmailError

Lỗi xảy ra khi email không đúng định dạng.

## Example

```typescript
throw new InvalidEmailError('invalid.email');
```

## Extends

- [`DomainError`](/libraries/common-domain/Class.DomainError.md)

## Constructors

<a id="constructor"></a>

### Constructor

> **new InvalidEmailError**(`email`): `InvalidEmailError`

Tạo một instance mới của InvalidEmailError.

#### Parameters

##### email

`string`

Email không hợp lệ

#### Returns

`InvalidEmailError`

#### Overrides

[`DomainError`](/libraries/common-domain/Class.DomainError.md).[`constructor`](/libraries/common-domain/Class.DomainError.md#constructor)

## Properties

<a id="code"></a>

### code

> `readonly` **code**: `string`

Mã lỗi domain.

#### Inherited from

[`DomainError`](/libraries/common-domain/Class.DomainError.md).[`code`](/libraries/common-domain/Class.DomainError.md#code)

***

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

#### Inherited from

[`DomainError`](/libraries/common-domain/Class.DomainError.md).[`isDomainError`](/libraries/common-domain/Class.DomainError.md#isdomainerror)
