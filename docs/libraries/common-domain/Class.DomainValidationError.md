# Class: DomainValidationError

Lỗi được ném ra khi một Value Object không hợp lệ.
Thường được sử dụng khi các điều kiện ràng buộc của Value Object không được thỏa mãn.

## Since

1.0.0

## Example

```typescript
throw new DomainValidationError("Email address is invalid", { email: "invalid-email" });
```

## Extends

- [`DomainError`](/libraries/common-domain/Class.DomainError.md)

## Constructors

<a id="constructor"></a>

### Constructor

> **new DomainValidationError**(`message`, `interpolationParams?`, `details?`): `DomainValidationError`

Khởi tạo một DomainValidationError mới

#### Parameters

##### message

`string`

Thông điệp lỗi bằng tiếng Anh

##### interpolationParams?

`Record`\<`string`, `Maybe`\<`Primitive`\>\>

Các tham số để nội suy vào thông điệp lỗi

##### details?

`PlainObject`

#### Returns

`DomainValidationError`

#### Overrides

[`DomainError`](/libraries/common-domain/Class.DomainError.md).[`constructor`](/libraries/common-domain/Class.DomainError.md#constructor)

## Properties

<a id="details"></a>

### details?

> `readonly` `optional` **details**: `unknown`

Chi tiết lỗi (có thể dùng để log hoặc hiển thị nâng cao)

#### Inherited from

[`DomainError`](/libraries/common-domain/Class.DomainError.md).[`details`](/libraries/common-domain/Class.DomainError.md#details)

---

<a id="interpolationparams"></a>

### interpolationParams?

> `readonly` `optional` **interpolationParams**: `Record`\<`string`, `Maybe`\<`Primitive`\>\>

Tham số nội suy cho bản dịch

#### Inherited from

[`DomainError`](/libraries/common-domain/Class.DomainError.md).[`interpolationParams`](/libraries/common-domain/Class.DomainError.md#interpolationparams)

---

<a id="message"></a>

### message

> **message**: `string`

#### Inherited from

[`DomainError`](/libraries/common-domain/Class.DomainError.md).[`message`](/libraries/common-domain/Class.DomainError.md#message)

---

<a id="name"></a>

### name

> **name**: `string`

#### Inherited from

[`DomainError`](/libraries/common-domain/Class.DomainError.md).[`name`](/libraries/common-domain/Class.DomainError.md#name)

---

<a id="stack"></a>

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`DomainError`](/libraries/common-domain/Class.DomainError.md).[`stack`](/libraries/common-domain/Class.DomainError.md#stack)

---

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

---

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
