# Interface: IValidationResult

Interface định nghĩa kết quả validation

## Methods

<a id="adderror"></a>

### addError()

> **addError**(`error`): `void`

Thêm một lỗi validation

#### Parameters

##### error

Lỗi cần thêm

###### code

`string`

Mã lỗi

###### data?

`Record`\<`string`, `unknown`\>

Dữ liệu bổ sung

###### field

`string`

Tên trường bị lỗi

###### message

`string`

Thông báo lỗi

#### Returns

`void`

***

<a id="adderrors"></a>

### addErrors()

> **addErrors**(`errors`): `void`

Thêm nhiều lỗi validation

#### Parameters

##### errors

`object`[]

Danh sách lỗi cần thêm

#### Returns

`void`

***

<a id="clearerrors"></a>

### clearErrors()

> **clearErrors**(): `void`

Xóa tất cả các lỗi validation

#### Returns

`void`

***

<a id="geterrors"></a>

### getErrors()

> **getErrors**(): `object`[]

Lấy danh sách các lỗi validation

#### Returns

`object`[]

Danh sách các lỗi validation

***

<a id="isvalid"></a>

### isValid()

> **isValid**(): `boolean`

Kiểm tra xem validation có thành công hay không

#### Returns

`boolean`

True nếu validation thành công
