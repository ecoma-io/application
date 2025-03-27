# Class: `abstract` AbstractMongoReadRepository\<TDocument, TId, TProps, TAggregateRoot\>

Lớp cơ sở cho các repository đọc dữ liệu từ MongoDB

## Type Parameters

### TDocument

`TDocument` _extends_ `Document`

### TId

`TId` _extends_ `AbstractId`

### TProps

`TProps` _extends_ `IEntityProps`\<`TId`\>

### TAggregateRoot

`TAggregateRoot` _extends_ `AbstractAggregate`\<`TId`, `TProps`\>

## Implements

- `IReadRepository`\<`TId`, `TProps`, `TAggregateRoot`\>

## Constructors

<a id="constructor"></a>

### Constructor

> **new AbstractMongoReadRepository**\<`TDocument`, `TId`, `TProps`, `TAggregateRoot`\>(`model`): `AbstractMongoReadRepository`\<`TDocument`, `TId`, `TProps`, `TAggregateRoot`\>

Constructor

#### Parameters

##### model

`Model`\<`TDocument`\>

Model MongoDB

#### Returns

`AbstractMongoReadRepository`\<`TDocument`, `TId`, `TProps`, `TAggregateRoot`\>

## Properties

<a id="model"></a>

### model

> `protected` `readonly` **model**: `Model`\<`TDocument`\>

Model MongoDB

## Methods

<a id="count"></a>

### count()

> **count**(`specification`): `Promise`\<`number`\>

Đếm số lượng aggregate roots theo tiêu chí

#### Parameters

##### specification

`CriteriaQueryDTO`

Tiêu chí tìm kiếm

#### Returns

`Promise`\<`number`\>

Số lượng aggregate roots tìm được

#### Implementation of

`IReadRepository.count`

---

<a id="customizequery"></a>

### customizeQuery()

> `protected` **customizeQuery**(`query`, `_specification`): `Record`\<`string`, `any`\>

Hook cho phép lớp con tùy chỉnh query trước khi thực thi

#### Parameters

##### query

`Record`\<`string`, `any`\>

Query ban đầu

##### \_specification

`CriteriaQueryDTO`

Tiêu chí tìm kiếm

#### Returns

`Record`\<`string`, `any`\>

Query đã được tùy chỉnh

---

<a id="exists"></a>

### exists()

> **exists**(`id`): `Promise`\<`boolean`\>

Kiểm tra sự tồn tại của aggregate root theo ID

#### Parameters

##### id

`TId`

ID của aggregate root

#### Returns

`Promise`\<`boolean`\>

true nếu aggregate root tồn tại, false nếu không tồn tại

#### Implementation of

`IReadRepository.exists`

---

<a id="find"></a>

### find()

> **find**(`specification`): `Promise`\<\{ `afterCursor?`: `string`; `beforeCursor?`: `string`; `items`: `TAggregateRoot`[]; `total`: `number`; \}\>

Tìm kiếm aggregate roots theo tiêu chí

#### Parameters

##### specification

`CriteriaQueryDTO`

Tiêu chí tìm kiếm

#### Returns

`Promise`\<\{ `afterCursor?`: `string`; `beforeCursor?`: `string`; `items`: `TAggregateRoot`[]; `total`: `number`; \}\>

Danh sách aggregate roots tìm được

#### Implementation of

`IReadRepository.find`

---

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

#### Implementation of

`IReadRepository.findById`

---

<a id="todomainmodel"></a>

### toDomainModel()

> `abstract` `protected` **toDomainModel**(`doc`): `TAggregateRoot`

Chuyển đổi từ document sang domain model

#### Parameters

##### doc

`TDocument`

Document từ MongoDB

#### Returns

`TAggregateRoot`

Domain model
