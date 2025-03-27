# Class: TestDataFactory

Factory tạo dữ liệu test ngẫu nhiên cho unit/integration test.

## Since

1.0.0

## Constructors

<a id="constructor"></a>

### Constructor

> **new TestDataFactory**(): `TestDataFactory`

#### Returns

`TestDataFactory`

## Methods

<a id="createamount"></a>

### createAmount()

> `static` **createAmount**(`min`, `max`): `number`

Tạo số tiền ngẫu nhiên (VNĐ)

#### Parameters

##### min

`number` = `10000`

##### max

`number` = `1000000`

#### Returns

`number`

***

<a id="createcustomername"></a>

### createCustomerName()

> `static` **createCustomerName**(): `string`

Tạo tên khách hàng ngẫu nhiên

#### Returns

`string`

***

<a id="createdate"></a>

### createDate()

> `static` **createDate**(`start`, `end`): `Date`

Tạo ngày ngẫu nhiên trong khoảng [start, end]

#### Parameters

##### start

`Date`

##### end

`Date`

#### Returns

`Date`

***

<a id="createemail"></a>

### createEmail()

> `static` **createEmail**(): `string`

Tạo email ngẫu nhiên

#### Returns

`string`

***

<a id="createnumber"></a>

### createNumber()

> `static` **createNumber**(`min`, `max`): `number`

Tạo số ngẫu nhiên trong khoảng [min, max]

#### Parameters

##### min

`number` = `0`

##### max

`number` = `100`

#### Returns

`number`

***

<a id="createorderstatus"></a>

### createOrderStatus()

> `static` **createOrderStatus**(): `string`

Tạo trạng thái đơn hàng ngẫu nhiên

#### Returns

`string`

***

<a id="createpassword"></a>

### createPassword()

> `static` **createPassword**(): `string`

Tạo password ngẫu nhiên

#### Returns

`string`

***

<a id="createproductname"></a>

### createProductName()

> `static` **createProductName**(): `string`

Tạo tên sản phẩm ngẫu nhiên

#### Returns

`string`

***

<a id="createsku"></a>

### createSKU()

> `static` **createSKU**(): `string`

Tạo mã SKU ngẫu nhiên

#### Returns

`string`

***

<a id="createstring"></a>

### createString()

> `static` **createString**(`length`): `string`

Tạo chuỗi ngẫu nhiên với độ dài cho trước

#### Parameters

##### length

`number` = `10`

#### Returns

`string`

***

<a id="createusername"></a>

### createUsername()

> `static` **createUsername**(): `string`

Tạo username ngẫu nhiên

#### Returns

`string`

***

<a id="createuuid"></a>

### createUUID()

> `static` **createUUID**(): `string`

Tạo UUID ngẫu nhiên

#### Returns

`string`
