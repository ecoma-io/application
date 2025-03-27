# Interface: IRepository\<TId, TAggregateRoot\>

Interface định nghĩa repository

## Extends

- [`IReadRepository`](/libraries/common-domain/Interface.IReadRepository.md)\<`TId`, `TAggregateRoot`\>.[`IWriteRepository`](/libraries/common-domain/Interface.IWriteRepository.md)\<`TId`, `TAggregateRoot`\>

## Type Parameters

### TId

`TId` *extends* [`AbstractId`](/libraries/common-domain/Class.AbstractId.md)

### TAggregateRoot

`TAggregateRoot` *extends* [`AbstractAggregate`](/libraries/common-domain/Class.AbstractAggregate.md)\<`TId`\>

## Methods

<a id="delete"></a>

### delete()

> **delete**(`id`): `Promise`\<`void`\>

Xóa một aggregate root theo ID

#### Parameters

##### id

`TId`

ID của aggregate root cần xóa

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`IWriteRepository`](/libraries/common-domain/Interface.IWriteRepository.md).[`delete`](/libraries/common-domain/Interface.IWriteRepository.md#delete)

***

<a id="deletemany"></a>

### deleteMany()

> **deleteMany**(`ids`): `Promise`\<`void`\>

Xóa nhiều aggregate roots theo danh sách ID

#### Parameters

##### ids

`TId`[]

Danh sách ID của các aggregate roots cần xóa

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`IWriteRepository`](/libraries/common-domain/Interface.IWriteRepository.md).[`deleteMany`](/libraries/common-domain/Interface.IWriteRepository.md#deletemany)

***

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

#### Inherited from

[`IReadRepository`](/libraries/common-domain/Interface.IReadRepository.md).[`find`](/libraries/common-domain/Interface.IReadRepository.md#find)

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

#### Inherited from

[`IReadRepository`](/libraries/common-domain/Interface.IReadRepository.md).[`findById`](/libraries/common-domain/Interface.IReadRepository.md#findbyid)

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

#### Inherited from

[`IReadRepository`](/libraries/common-domain/Interface.IReadRepository.md).[`findWithCursorPagination`](/libraries/common-domain/Interface.IReadRepository.md#findwithcursorpagination)

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

#### Inherited from

[`IReadRepository`](/libraries/common-domain/Interface.IReadRepository.md).[`findWithOffsetPagination`](/libraries/common-domain/Interface.IReadRepository.md#findwithoffsetpagination)

***

<a id="save"></a>

### save()

> **save**(`aggregateRoot`): `Promise`\<`void`\>

Lưu một aggregate root

#### Parameters

##### aggregateRoot

`TAggregateRoot`

Aggregate root cần lưu

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`IWriteRepository`](/libraries/common-domain/Interface.IWriteRepository.md).[`save`](/libraries/common-domain/Interface.IWriteRepository.md#save)
