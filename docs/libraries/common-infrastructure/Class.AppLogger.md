# Class: AppLogger

## Extends

- `AbstractLogger`

## Constructors

<a id="constructor"></a>

### Constructor

> **new AppLogger**(`context?`): `AppLogger`

#### Parameters

##### context?

`string`

#### Returns

`AppLogger`

#### Overrides

`AbstractLogger.constructor`

## Methods

<a id="debug"></a>

### debug()

> **debug**(`message`, `optionalParams?`): `void`

Ghi log ở mức DEBUG

#### Parameters

##### message

`string`

Nội dung log

##### optionalParams?

`Record`\<`string`, `unknown`\>

Context bổ sung

#### Returns

`void`

#### Overrides

`AbstractLogger.debug`

---

<a id="error"></a>

### error()

> **error**(`message`, `error?`, `optionalParams?`): `void`

Ghi log ở mức ERROR

#### Parameters

##### message

`string`

Nội dung log

##### error?

`Error`

Lỗi nếu có

##### optionalParams?

`Record`\<`string`, `unknown`\>

Context bổ sung

#### Returns

`void`

#### Overrides

`AbstractLogger.error`

---

<a id="fatal"></a>

### fatal()

> **fatal**(`message`, `error?`, `optionalParams?`): `void`

Ghi log ở mức FATAL

#### Parameters

##### message

`string`

Nội dung log

##### error?

`Error`

Lỗi nếu có

##### optionalParams?

`Record`\<`string`, `unknown`\>

Context bổ sung

#### Returns

`void`

#### Overrides

`AbstractLogger.fatal`

---

<a id="info"></a>

### info()

> **info**(`message`, `optionalParams?`): `void`

Ghi log ở mức INFO

#### Parameters

##### message

`string`

Nội dung log

##### optionalParams?

`Record`\<`string`, `unknown`\>

Context bổ sung

#### Returns

`void`

#### Overrides

`AbstractLogger.info`

---

<a id="setcontext"></a>

### setContext()

> **setContext**(`context`): `void`

Đặt context cho logger

#### Parameters

##### context

`string`

Context

#### Returns

`void`

#### Overrides

`AbstractLogger.setContext`

---

<a id="warn"></a>

### warn()

> **warn**(`message`, `optionalParams?`): `void`

Ghi log ở mức WARN

#### Parameters

##### message

`string`

Nội dung log

##### optionalParams?

`Record`\<`string`, `unknown`\>

Context bổ sung

#### Returns

`void`

#### Overrides

`AbstractLogger.warn`
