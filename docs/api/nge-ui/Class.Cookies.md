# Class: Cookies

## Constructors

<a id="constructor"></a>

### Constructor

> **new Cookies**(`document`, `platformId`, `request`): `Cookies`

#### Parameters

##### document

`Document`

##### platformId

`object`

##### request

###### headers

\{ `cookie?`: `string`; \}

###### headers.cookie?

`string`

#### Returns

`Cookies`

## Methods

<a id="check"></a>

### check()

> **check**(`name`): `boolean`

Kiểm tra xem cookie có tồn tại hay không

#### Parameters

##### name

`string`

Tên cookie cần kiểm tra

#### Returns

`boolean`

true nếu cookie tồn tại, false nếu không

---

<a id="delete"></a>

### delete()

> **delete**(`name`, `path?`, `domain?`, `secure?`, `sameSite?`): `void`

Xóa cookie theo tên

#### Parameters

##### name

`string`

Tên cookie cần xóa

##### path?

`string`

Đường dẫn cookie

##### domain?

`string`

Tên miền cookie

##### secure?

`boolean`

Cờ bảo mật cookie

##### sameSite?

Cờ SameSite cookie - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite

`"Lax"` | `"None"` | `"Strict"`

#### Returns

`void`

---

<a id="deleteall"></a>

### deleteAll()

> **deleteAll**(`path?`, `domain?`, `secure?`, `sameSite?`): `void`

Xóa tất cả cookie

#### Parameters

##### path?

`string`

Đường dẫn cookie

##### domain?

`string`

Tên miền cookie

##### secure?

`boolean`

Cờ bảo mật cookie

##### sameSite?

Cờ SameSite cookie

`"Lax"` | `"None"` | `"Strict"`

#### Returns

`void`

---

<a id="get"></a>

### get()

> **get**(`name`): `string`

Lấy giá trị của cookie theo tên

#### Parameters

##### name

`string`

Tên cookie cần lấy

#### Returns

`string`

Giá trị của cookie. Trả về chuỗi rỗng nếu không tìm thấy

---

<a id="getall"></a>

### getAll()

> **getAll**(): `object`

Lấy tất cả cookie dưới dạng đối tượng JSON

#### Returns

`object`

Đối tượng chứa tất cả cookie với key là tên cookie và value là giá trị cookie

---

<a id="set"></a>

### set()

> **set**(`name`, `value`, `options?`): `void`

Thiết lập cookie với các tham số được cung cấp

Các tham số cookie:

<pre>
expires  Số ngày cho đến khi cookie hết hạn hoặc một đối tượng Date
path     Đường dẫn cookie
domain   Tên miền cookie
secure   Cờ bảo mật cookie
sameSite Token OWASP same site 'Lax', 'None', hoặc 'Strict'. Mặc định là 'Lax'
partitioned Cờ phân vùng cookie
</pre>

#### Parameters

##### name

`string`

Tên cookie

##### value

`string`

Giá trị cookie

##### options?

Đối tượng chứa các tham số cookie

###### domain?

`string`

###### expires?

`number` \| `Date`

###### partitioned?

`boolean`

###### path?

`string`

###### sameSite?

`"Lax"` \| `"None"` \| `"Strict"`

###### secure?

`boolean`

#### Returns

`void`

---

<a id="getcookieregexp"></a>

### getCookieRegExp()

> `static` **getCookieRegExp**(`name`): `RegExp`

Tạo biểu thức chính quy để tìm kiếm cookie

#### Parameters

##### name

`string`

Tên cookie cần tìm

#### Returns

`RegExp`

Biểu thức chính quy để tìm cookie

---

<a id="safedecodeuricomponent"></a>

### safeDecodeURIComponent()

> `static` **safeDecodeURIComponent**(`encodedURIComponent`): `string`

Giải mã một thành phần được mã hóa của URI một cách an toàn

#### Parameters

##### encodedURIComponent

`string`

Giá trị đã được mã hóa URI

#### Returns

`string`

Giá trị đã được giải mã URI. Nếu không thể giải mã, trả về giá trị gốc
