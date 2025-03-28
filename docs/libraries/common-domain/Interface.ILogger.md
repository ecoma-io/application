# Interface: ILogger

Interface định nghĩa các phương thức ghi log

## Methods

<a id="debug"></a>

### debug()

> **debug**(`message`, `context?`): `void`

Ghi log ở mức DEBUG

#### Parameters

##### message

`string`

Nội dung log

##### context?

`Record`\<`string`, `unknown`\>

Context bổ sung

#### Returns

`void`

***

<a id="error"></a>

### error()

> **error**(`message`, `error?`, `context?`): `void`

Ghi log ở mức ERROR

#### Parameters

##### message

`string`

Nội dung log

##### error?

`Error`

Lỗi nếu có

##### context?

`Record`\<`string`, `unknown`\>

Context bổ sung

#### Returns

`void`

***

<a id="fatal"></a>

### fatal()

> **fatal**(`message`, `error?`, `context?`): `void`

Ghi log ở mức FATAL

#### Parameters

##### message

`string`

Nội dung log

##### error?

`Error`

Lỗi nếu có

##### context?

`Record`\<`string`, `unknown`\>

Context bổ sung

#### Returns

`void`

***

<a id="info"></a>

### info()

> **info**(`message`, `context?`): `void`

Ghi log ở mức INFO

#### Parameters

##### message

`string`

Nội dung log

##### context?

`Record`\<`string`, `unknown`\>

Context bổ sung

#### Returns

`void`

***

<a id="warn"></a>

### warn()

> **warn**(`message`, `context?`): `void`

Ghi log ở mức WARN

#### Parameters

##### message

`string`

Nội dung log

##### context?

`Record`\<`string`, `unknown`\>

Context bổ sung

#### Returns

`void`
