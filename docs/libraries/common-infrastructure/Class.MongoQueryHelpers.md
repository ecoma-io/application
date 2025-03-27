# Class: MongoQueryHelpers

Các helpers hỗ trợ xây dựng và xử lý truy vấn MongoDB

## Constructors

<a id="constructor"></a>

### Constructor

> **new MongoQueryHelpers**(): `MongoQueryHelpers`

#### Returns

`MongoQueryHelpers`

## Methods

<a id="applypagination"></a>

### applyPagination()

> `static` **applyPagination**\<`TDocument`\>(`model`, `query`, `sort`, `pagination?`): `Promise`\<\{ `afterCursor?`: `string`; `beforeCursor?`: `string`; `docs`: `TDocument`[]; `total`: `number`; \}\>

Áp dụng phân trang vào truy vấn MongoDB

#### Type Parameters

##### TDocument

`TDocument` _extends_ `Document`\<`unknown`, `any`, `any`\>

#### Parameters

##### model

`Model`\<`TDocument`\>

Model mongoose

##### query

[`MongoQuery`](/libraries/common-infrastructure/TypeAlias.MongoQuery.md)

Truy vấn ban đầu

##### sort

`Record`\<`string`, `-1` \| `1`\>

Tùy chọn sắp xếp

##### pagination?

`CriteriaQueryPaginationDTO`

Thông tin phân trang

#### Returns

`Promise`\<\{ `afterCursor?`: `string`; `beforeCursor?`: `string`; `docs`: `TDocument`[]; `total`: `number`; \}\>

Kết quả sau khi áp dụng phân trang

---

<a id="buildfilterexpression"></a>

### buildFilterExpression()

> `static` **buildFilterExpression**(`filter`): [`MongoQuery`](/libraries/common-infrastructure/TypeAlias.MongoQuery.md)

Xây dựng MongoDB filter từ một CriteriaQueryFilterDTO

#### Parameters

##### filter

`CriteriaQueryFilterDTO`

Filter cần chuyển đổi

#### Returns

[`MongoQuery`](/libraries/common-infrastructure/TypeAlias.MongoQuery.md)

MongoDB filter expression

---

<a id="buildmongoquery"></a>

### buildMongoQuery()

> `static` **buildMongoQuery**(`filters?`): [`MongoQuery`](/libraries/common-infrastructure/TypeAlias.MongoQuery.md)

Xây dựng MongoDB query từ cấu trúc filters phức tạp

#### Parameters

##### filters?

Cấu trúc filters (logical hoặc filter đơn)

`CriteriaQueryFilterDTO` | `CriteriaQueryLogicalDTO`

#### Returns

[`MongoQuery`](/libraries/common-infrastructure/TypeAlias.MongoQuery.md)

MongoDB query

---

<a id="buildsortoptions"></a>

### buildSortOptions()

> `static` **buildSortOptions**(`sorts?`): `Record`\<`string`, `-1` \| `1`\>

Xây dựng MongoDB sort options từ các tiêu chí sắp xếp

#### Parameters

##### sorts?

`CriteriaQuerySortDTO`[]

Danh sách các tùy chọn sắp xếp

#### Returns

`Record`\<`string`, `-1` \| `1`\>

Record chứa tùy chọn sắp xếp cho MongoDB
