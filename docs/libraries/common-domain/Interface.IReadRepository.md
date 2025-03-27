# Interface: IReadRepository\<TId, TAggregateRoot\>

Interface định nghĩa repository đọc dữ liệu

## Extended by

- [`IRepository`](/libraries/common-domain/Interface.IRepository.md)

## Type Parameters

### TId

`TId` *extends* [`AbstractId`](/libraries/common-domain/Class.AbstractId.md)

### TAggregateRoot

`TAggregateRoot` *extends* [`AbstractAggregate`](/libraries/common-domain/Class.AbstractAggregate.md)\<`TId`\>

## Methods

<a id="find"></a>

### find()

> **find**(`specification`): `Promise`\<`TAggregateRoot`[]\>

Tìm kiếm aggregate roots theo tiêu chí

#### Parameters

##### specification

[`IQuerySpecification`](/libraries/common-domain/Interface.IQuerySpecification.md)\<`TAggregateRoot`\>

Tiêu chí tìm kiếm

#### Returns

`Promise`\<`TAggregateRoot`[]\>

Danh sách aggregate roots tìm được

***

<a id="findbyid"></a>

### findById()

> **findById**(`id`): `Promise`\<`null` \| `TAggregateRoot`\>

Tìm kiếm aggregate root theo ID

#### Parameters

##### id

`TId`

ID của aggregate root

#### Returns

`Promise`\<`null` \| `TAggregateRoot`\>

Aggregate root tìm được hoặc null nếu không tìm thấy

***

<a id="findwithcursorpagination"></a>

### findWithCursorPagination()

> **findWithCursorPagination**(`specification`, `pagination`): `Promise`\<[`ICursorBasedPaginatedResult`](/libraries/common-domain/Interface.ICursorBasedPaginatedResult.md)\<`TAggregateRoot`\>\>

Tìm kiếm aggregate roots theo tiêu chí với phân trang cursor

#### Parameters

##### specification

[`IQuerySpecification`](/libraries/common-domain/Interface.IQuerySpecification.md)\<`TAggregateRoot`\>

Tiêu chí tìm kiếm

##### pagination

Thông tin phân trang

[`ICursorAheadPagination`](/libraries/common-domain/Interface.ICursorAheadPagination.md) | [`ICursorBackPagination`](/libraries/common-domain/Interface.ICursorBackPagination.md)

#### Returns

`Promise`\<[`ICursorBasedPaginatedResult`](/libraries/common-domain/Interface.ICursorBasedPaginatedResult.md)\<`TAggregateRoot`\>\>

Kết quả phân trang

***

<a id="findwithoffsetpagination"></a>

### findWithOffsetPagination()

> **findWithOffsetPagination**(`specification`, `pagination`): `Promise`\<[`IOffsetBasedPaginatedResult`](/libraries/common-domain/Interface.IOffsetBasedPaginatedResult.md)\<`TAggregateRoot`\>\>

Tìm kiếm aggregate roots theo tiêu chí với phân trang offset

#### Parameters

##### specification

[`IQuerySpecification`](/libraries/common-domain/Interface.IQuerySpecification.md)\<`TAggregateRoot`\>

Tiêu chí tìm kiếm

##### pagination

[`IOffsetPagination`](/libraries/common-domain/Interface.IOffsetPagination.md)

Thông tin phân trang

#### Returns

`Promise`\<[`IOffsetBasedPaginatedResult`](/libraries/common-domain/Interface.IOffsetBasedPaginatedResult.md)\<`TAggregateRoot`\>\>

Kết quả phân trang
