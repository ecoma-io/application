# Class: Guard

Utility class cung cấp các phương thức kiểm tra điều kiện

## Since

1.0.0

## Constructors

<a id="constructor"></a>

### Constructor

> **new Guard**(): `Guard`

#### Returns

`Guard`

## Methods

<a id="againstatorabovelimit"></a>

### againstAtOrAboveLimit()

> `static` **againstAtOrAboveLimit**(`argument`, `limit`, `argumentName`): `void`

Kiểm tra giá trị không được lớn hơn hoặc bằng giới hạn

#### Parameters

##### argument

`number`

Giá trị cần kiểm tra

##### limit

`number`

Giới hạn

##### argumentName

`string`

Tên của giá trị

#### Returns

`void`

#### Throws

Nếu giá trị lớn hơn hoặc bằng giới hạn

---

<a id="againstatorbelowlimit"></a>

### againstAtOrBelowLimit()

> `static` **againstAtOrBelowLimit**(`argument`, `limit`, `argumentName`): `void`

Kiểm tra giá trị không được nhỏ hơn hoặc bằng giới hạn

#### Parameters

##### argument

`number`

Giá trị cần kiểm tra

##### limit

`number`

Giới hạn

##### argumentName

`string`

Tên của giá trị

#### Returns

`void`

#### Throws

Nếu giá trị nhỏ hơn hoặc bằng giới hạn

---

<a id="againstemptyarray"></a>

### againstEmptyArray()

> `static` **againstEmptyArray**(`argument`, `argumentName`): `void`

Kiểm tra mảng không được rỗng

#### Parameters

##### argument

`unknown`[]

Mảng cần kiểm tra

##### argumentName

`string`

Tên của mảng

#### Returns

`void`

#### Throws

Nếu mảng rỗng

---

<a id="againstemptystring"></a>

### againstEmptyString()

> `static` **againstEmptyString**(`argument`, `argumentName`): `void`

Kiểm tra chuỗi không được rỗng

#### Parameters

##### argument

`string`

Chuỗi cần kiểm tra

##### argumentName

`string`

Tên của chuỗi

#### Returns

`void`

#### Throws

Nếu chuỗi rỗng

---

<a id="againstnullorempty"></a>

### againstNullOrEmpty()

> `static` **againstNullOrEmpty**(`argument`, `argumentName`): `void`

Kiểm tra giá trị không được null, undefined hoặc rỗng

#### Parameters

##### argument

`unknown`

Giá trị cần kiểm tra

##### argumentName

`string`

Tên của giá trị

#### Returns

`void`

#### Throws

Nếu giá trị là null, undefined hoặc rỗng

---

<a id="againstnullorundefined"></a>

### againstNullOrUndefined()

> `static` **againstNullOrUndefined**(`argument`, `argumentName`): `void`

Kiểm tra giá trị không được null hoặc undefined

#### Parameters

##### argument

`unknown`

Giá trị cần kiểm tra

##### argumentName

`string`

Tên của giá trị

#### Returns

`void`

#### Throws

Nếu giá trị là null hoặc undefined

---

<a id="isvalidemail"></a>

### isValidEmail()

> `static` **isValidEmail**(`argument`, `argumentName`): `void`

Kiểm tra chuỗi phải là email hợp lệ

#### Parameters

##### argument

`string`

Chuỗi cần kiểm tra

##### argumentName

`string`

Tên của chuỗi

#### Returns

`void`

#### Throws

Nếu chuỗi không phải email hợp lệ
