# Class: JsonLogFormatter

Formatter cho log dạng JSON

## Constructors

<a id="constructor"></a>

### Constructor

> **new JsonLogFormatter**(): `JsonLogFormatter`

#### Returns

`JsonLogFormatter`

## Methods

<a id="format"></a>

### format()

> **format**(`level`, `message`, `context?`): `string`

Format log message thành JSON

#### Parameters

##### level

`string`

Cấp độ log

##### message

`string`

Thông điệp log

##### context?

`Record`\<`string`, `unknown`\>

Context của log

#### Returns

`string`

Log message đã được format
