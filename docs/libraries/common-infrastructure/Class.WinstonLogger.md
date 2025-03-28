# Class: WinstonLogger

Logger sử dụng Winston

## Constructors

<a id="constructor"></a>

### Constructor

> **new WinstonLogger**(): `WinstonLogger`

#### Returns

`WinstonLogger`

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

Context của debug

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

Context của lỗi

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

Context của thông tin

#### Returns

`void`

***

<a id="warn"></a>

### warn()

> **warn**(`message`, `context?`): `void`

Ghi log cấp độ warn

#### Parameters

##### message

`string`

Thông điệp cảnh báo

##### context?

`Record`\<`string`, `unknown`\>

Context của cảnh báo

#### Returns

`void`
