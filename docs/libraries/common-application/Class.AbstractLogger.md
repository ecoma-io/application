# Class: `abstract` AbstractLogger

Interface định nghĩa các phương thức ghi log

## Constructors

<a id="constructor"></a>

### Constructor

> **new AbstractLogger**(): `AbstractLogger`

#### Returns

`AbstractLogger`

## Methods

<a id="debug"></a>

### debug()

> `abstract` **debug**(`message`, `optionalParams?`): `void`

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

---

<a id="error"></a>

### error()

> `abstract` **error**(`message`, `error?`, `optionalParams?`): `void`

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

---

<a id="fatal"></a>

### fatal()

> `abstract` **fatal**(`message`, `error?`, `optionalParams?`): `void`

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

---

<a id="info"></a>

### info()

> `abstract` **info**(`message`, `optionalParams?`): `void`

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

---

<a id="setcontext"></a>

### setContext()

> `abstract` **setContext**(`context`): `void`

Đặt context cho logger

#### Parameters

##### context

`string`

Context

#### Returns

`void`

---

<a id="warn"></a>

### warn()

> `abstract` **warn**(`message`, `optionalParams?`): `void`

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
