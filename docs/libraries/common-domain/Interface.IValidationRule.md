# Interface: IValidationRule\<T\>

Interface định nghĩa quy tắc validation

## Type Parameters

### T

`T`

## Methods

<a id="getdescription"></a>

### getDescription()

> **getDescription**(): `string`

Lấy mô tả của quy tắc validation

#### Returns

`string`

Mô tả quy tắc validation

***

<a id="getname"></a>

### getName()

> **getName**(): `string`

Lấy tên của quy tắc validation

#### Returns

`string`

Tên quy tắc validation

***

<a id="validate"></a>

### validate()

> **validate**(`value`): `null` \| \{ `code`: `string`; `data?`: `Record`\<`string`, `unknown`\>; `field`: `string`; `message`: `string`; \}

Kiểm tra xem giá trị có thỏa mãn quy tắc validation hay không

#### Parameters

##### value

`T`

Giá trị cần kiểm tra

#### Returns

`null` \| \{ `code`: `string`; `data?`: `Record`\<`string`, `unknown`\>; `field`: `string`; `message`: `string`; \}

Lỗi validation nếu có, null nếu không có lỗi
