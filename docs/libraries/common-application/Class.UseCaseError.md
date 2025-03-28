# Class: UseCaseError

## Extends

- [`AbstractApplicationError`](/libraries/common-application/Class.AbstractApplicationError.md)

## Constructors

<a id="constructor"></a>

### Constructor

> **new UseCaseError**(`message`): `UseCaseError`

#### Parameters

##### message

`string`

#### Returns

`UseCaseError`

#### Overrides

[`AbstractApplicationError`](/libraries/common-application/Class.AbstractApplicationError.md).[`constructor`](/libraries/common-application/Class.AbstractApplicationError.md#constructor)

## Properties

<a id="message"></a>

### message

> **message**: `string`

#### Inherited from

[`AbstractApplicationError`](/libraries/common-application/Class.AbstractApplicationError.md).[`message`](/libraries/common-application/Class.AbstractApplicationError.md#message)

***

<a id="name"></a>

### name

> **name**: `string`

#### Inherited from

[`AbstractApplicationError`](/libraries/common-application/Class.AbstractApplicationError.md).[`name`](/libraries/common-application/Class.AbstractApplicationError.md#name)

***

<a id="stack"></a>

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`AbstractApplicationError`](/libraries/common-application/Class.AbstractApplicationError.md).[`stack`](/libraries/common-application/Class.AbstractApplicationError.md#stack)

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

[`AbstractApplicationError`](/libraries/common-application/Class.AbstractApplicationError.md).[`prepareStackTrace`](/libraries/common-application/Class.AbstractApplicationError.md#preparestacktrace)

***

<a id="stacktracelimit"></a>

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`AbstractApplicationError`](/libraries/common-application/Class.AbstractApplicationError.md).[`stackTraceLimit`](/libraries/common-application/Class.AbstractApplicationError.md#stacktracelimit)

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

[`AbstractApplicationError`](/libraries/common-application/Class.AbstractApplicationError.md).[`captureStackTrace`](/libraries/common-application/Class.AbstractApplicationError.md#capturestacktrace)
