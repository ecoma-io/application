# Interface: ISecurity

Interface định nghĩa các phương thức bảo mật

## Methods

<a id="comparepassword"></a>

### comparePassword()

> **comparePassword**(`password`, `hashedPassword`): `Promise`\<`boolean`\>

So sánh một mật khẩu với mật khẩu đã được mã hóa

#### Parameters

##### password

`string`

Mật khẩu cần so sánh

##### hashedPassword

`string`

Mật khẩu đã được mã hóa

#### Returns

`Promise`\<`boolean`\>

True nếu mật khẩu khớp

#### Throws

Nếu quá trình so sánh thất bại

***

<a id="generatetoken"></a>

### generateToken()

> **generateToken**(`payload`, `options?`): `Promise`\<`string`\>

Tạo một token JWT

#### Parameters

##### payload

`Record`\<`string`, `unknown`\>

Dữ liệu cần mã hóa trong token

##### options?

`Record`\<`string`, `unknown`\>

Các tùy chọn bổ sung

#### Returns

`Promise`\<`string`\>

Token JWT

#### Throws

Nếu quá trình tạo token thất bại

***

<a id="hashpassword"></a>

### hashPassword()

> **hashPassword**(`password`): `Promise`\<`string`\>

Mã hóa một chuỗi mật khẩu

#### Parameters

##### password

`string`

Mật khẩu cần mã hóa

#### Returns

`Promise`\<`string`\>

Mật khẩu đã được mã hóa

#### Throws

Nếu quá trình mã hóa thất bại

***

<a id="verifytoken"></a>

### verifyToken()

> **verifyToken**(`token`): `Promise`\<`Record`\<`string`, `unknown`\>\>

Xác thực một token JWT

#### Parameters

##### token

`string`

Token cần xác thực

#### Returns

`Promise`\<`Record`\<`string`, `unknown`\>\>

Dữ liệu đã được giải mã từ token

#### Throws

Nếu token không hợp lệ
