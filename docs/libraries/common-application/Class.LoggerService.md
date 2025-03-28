# Class: LoggerService

Service cung cấp các phương thức ghi log

## Constructors

<a id="constructor"></a>

### Constructor

> **new LoggerService**(): `LoggerService`

#### Returns

`LoggerService`

## Methods

<a id="debug"></a>

### debug()

> **debug**(`message`, `context?`): `void`

Ghi log cấp độ debug

#### Parameters

##### message

`string`

Thông điệp debug

##### context?

`Record`\<`string`, `unknown`\>

Thông tin bổ sung

#### Returns

`void`

***

<a id="error"></a>

### error()

> **error**(`message`, `context?`): `void`

Ghi log cấp độ error

#### Parameters

##### message

`string`

Thông điệp lỗi

##### context?

`Record`\<`string`, `unknown`\>

Thông tin bổ sung về lỗi

#### Returns

`void`

***

<a id="info"></a>

### info()

> **info**(`message`, `context?`): `void`

Ghi log cấp độ info

#### Parameters

##### message

`string`

Thông điệp thông tin

##### context?

`Record`\<`string`, `unknown`\>

Thông tin bổ sung

#### Returns

`void`

***

<a id="warn"></a>

### warn()

> **warn**(`message`, `context?`): `void`

Ghi log cấp độ warning

#### Parameters

##### message

`string`

Thông điệp cảnh báo

##### context?

`Record`\<`string`, `unknown`\>

Thông tin bổ sung

#### Returns

`void`
