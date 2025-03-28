# Interface: IQuerySpecification\<T\>

Interface định nghĩa tiêu chí tìm kiếm

## Type Parameters

### T

`T`

Kiểu dữ liệu của đối tượng cần tìm kiếm

## Methods

<a id="getfilters"></a>

### getFilters()

> **getFilters**(): `object`[]

Lấy danh sách các điều kiện lọc

#### Returns

`object`[]

Danh sách điều kiện lọc

***

<a id="getlimit"></a>

### getLimit()

> **getLimit**(): `number`

Lấy số lượng bản ghi tối đa

#### Returns

`number`

Số lượng bản ghi tối đa

***

<a id="getoffset"></a>

### getOffset()

> **getOffset**(): `number`

Lấy vị trí bắt đầu

#### Returns

`number`

Vị trí bắt đầu

***

<a id="getsorts"></a>

### getSorts()

> **getSorts**(): `object`[]

Lấy danh sách các điều kiện sắp xếp

#### Returns

`object`[]

Danh sách điều kiện sắp xếp
