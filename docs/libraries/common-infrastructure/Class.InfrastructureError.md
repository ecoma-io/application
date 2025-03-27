# Class: InfrastructureError\<TDetails, TInterpolationParams\>

Lớp cơ sở cho tất cả các lỗi infrastructure trong hệ thống.
InfrastructureError cung cấp một cách chuẩn hóa để xử lý và phân loại các lỗi infrastructure.

## Since

1.0.0

## Example

```typescript
class DatabaseError extends InfrastructureError {
  constructor(orderId: string) {
    super(`Can't connect to replica {replicaId}`, {replicaId});
  }
}

## Extends

- `Error`

## Type Parameters

### TDetails

`TDetails` = `unknown`

### TInterpolationParams

`TInterpolationParams` *extends* `Record`\<`string`, `Maybe`\<`Primitive`\>\> = `Record`\<`string`, `Maybe`\<`Primitive`\>\>

## Constructors

<a id="constructor"></a>

### Constructor

> **new InfrastructureError**\<`TDetails`, `TInterpolationParams`\>(`message`, `interpolationParams?`, `details?`): `InfrastructureError`\<`TDetails`, `TInterpolationParams`\>

Tạo một instance mới của InfrastructureError.

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

`InfrastructureError`\<`TDetails`, `TInterpolationParams`\>

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
