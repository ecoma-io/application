# Class: `abstract` AbstractApplicationError

## Extends

- `Error`

## Extended by

- [`ValidationError`](/libraries/common-application/Class.ValidationError.md)
- [`UseCaseError`](/libraries/common-application/Class.UseCaseError.md)
- [`CommandError`](/libraries/common-application/Class.CommandError.md)
- [`QueryError`](/libraries/common-application/Class.QueryError.md)
- [`UnauthorizedError`](/libraries/common-application/Class.UnauthorizedError.md)

## Constructors

<a id="constructor"></a>

### Constructor

> **new AbstractApplicationError**(`message`): `AbstractApplicationError`

#### Parameters

##### message

`string`

#### Returns

`AbstractApplicationError`

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
