# Class: ValidationError

Class định nghĩa lỗi validation

## Extends

- `Error`

## Constructors

<a id="constructor"></a>

### Constructor

> **new ValidationError**(`field`, `message`, `code`, `data?`): `ValidationError`

Tạo một instance mới của ValidationError

#### Parameters

##### field

`string`

Tên trường bị lỗi

##### message

`string`

Thông báo lỗi

##### code

`string`

Mã lỗi

##### data?

`Record`\<`string`, `unknown`\>

Dữ liệu bổ sung

#### Returns

`ValidationError`

#### Overrides

`Error.constructor`

## Properties

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

<a id="getcode"></a>

### getCode()

> **getCode**(): `string`

Lấy mã lỗi

#### Returns

`string`

Mã lỗi

***

<a id="getdata"></a>

### getData()

> **getData**(): `Record`\<`string`, `unknown`\>

Lấy dữ liệu bổ sung

#### Returns

`Record`\<`string`, `unknown`\>

Dữ liệu bổ sung

***

<a id="getfield"></a>

### getField()

> **getField**(): `string`

Lấy tên trường bị lỗi

#### Returns

`string`

Tên trường bị lỗi

***

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
