# Class: Guard

Guard chứa các phương thức tiện ích để kiểm tra đối số.

## Constructors

<a id="constructor"></a>

### Constructor

> **new Guard**(): `Guard`

#### Returns

`Guard`

## Methods

<a id="againstatorabovelimit"></a>

### againstAtOrAboveLimit()

> `static` **againstAtOrAboveLimit**(`value`, `limit`, `argumentName`): `void`

Kiểm tra xem số có lớn hơn hoặc bằng một giá trị cho trước không.

#### Parameters

##### value

`number`

Số cần kiểm tra

##### limit

`number`

Giới hạn

##### argumentName

`string`

Tên của đối số (để hiển thị trong thông báo lỗi)

#### Returns

`void`

#### Throws

Error nếu số lớn hơn hoặc bằng giới hạn

***

<a id="againstatorbelowlimit"></a>

### againstAtOrBelowLimit()

> `static` **againstAtOrBelowLimit**(`value`, `limit`, `argumentName`): `void`

Kiểm tra xem số có nhỏ hơn hoặc bằng một giá trị cho trước không.

#### Parameters

##### value

`number`

Số cần kiểm tra

##### limit

`number`

Giới hạn

##### argumentName

`string`

Tên của đối số (để hiển thị trong thông báo lỗi)

#### Returns

`void`

#### Throws

Error nếu số nhỏ hơn hoặc bằng giới hạn

***

<a id="againstemptyarray"></a>

### againstEmptyArray()

> `static` **againstEmptyArray**(`value`, `argumentName`): `void`

Kiểm tra xem mảng có rỗng không.

#### Parameters

##### value

`unknown`[]

Mảng cần kiểm tra

##### argumentName

`string`

Tên của đối số (để hiển thị trong thông báo lỗi)

#### Returns

`void`

#### Throws

Error nếu mảng là rỗng

***

<a id="againstemptystring"></a>

### againstEmptyString()

> `static` **againstEmptyString**(`value`, `argumentName`): `void`

Kiểm tra xem chuỗi có rỗng không.

#### Parameters

##### value

`string`

Chuỗi cần kiểm tra

##### argumentName

`string`

Tên của đối số (để hiển thị trong thông báo lỗi)

#### Returns

`void`

#### Throws

Error nếu chuỗi là rỗng

***

<a id="againstnullorundefined"></a>

### againstNullOrUndefined()

> `static` **againstNullOrUndefined**(`value`, `argumentName`): `void`

Kiểm tra xem giá trị có null hoặc undefined không.

#### Parameters

##### value

`unknown`

Giá trị cần kiểm tra

##### argumentName

`string`

Tên của đối số (để hiển thị trong thông báo lỗi)

#### Returns

`void`

#### Throws

Error nếu giá trị là null hoặc undefined

***

<a id="isvalidemail"></a>

### isValidEmail()

> `static` **isValidEmail**(`value`, `argumentName`): `void`

Kiểm tra xem một chuỗi có đúng định dạng email không.

#### Parameters

##### value

`string`

Chuỗi cần kiểm tra

##### argumentName

`string`

Tên của đối số (để hiển thị trong thông báo lỗi)

#### Returns

`void`

#### Throws

Error nếu chuỗi không phải là email hợp lệ
