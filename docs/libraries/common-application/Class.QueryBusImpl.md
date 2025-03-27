# Class: QueryBusImpl

Triển khai Query Bus để xử lý các queries

## Since

1.0.0

## Implements

- [`IQueryBus`](/libraries/common-application/Interface.IQueryBus.md)

## Constructors

<a id="constructor"></a>

### Constructor

> **new QueryBusImpl**(): `QueryBusImpl`

#### Returns

`QueryBusImpl`

## Methods

<a id="execute"></a>

### execute()

> **execute**\<`TQuery`, `TResult`\>(`query`): `Promise`\<`TResult`\>

Thực thi một query

#### Type Parameters

##### TQuery

`TQuery` _extends_ [`IQuery`](/libraries/common-application/Interface.IQuery.md)

##### TResult

`TResult` = `void`

#### Parameters

##### query

`TQuery`

Query cần thực thi

#### Returns

`Promise`\<`TResult`\>

Kết quả của query

#### Throws

Nếu không tìm thấy handler cho query

#### Implementation of

[`IQueryBus`](/libraries/common-application/Interface.IQueryBus.md).[`execute`](/libraries/common-application/Interface.IQueryBus.md#execute)

---

<a id="register"></a>

### register()

> **register**(`queryType`, `handler`): `void`

Đăng ký một query handler

#### Parameters

##### queryType

(...`args`) => [`IQuery`](/libraries/common-application/Interface.IQuery.md)

Constructor của query

##### handler

[`IQueryHandler`](/libraries/common-application/Interface.IQueryHandler.md)\<[`IQuery`](/libraries/common-application/Interface.IQuery.md), `unknown`\>

Handler xử lý query

#### Returns

`void`

#### Throws

Nếu đã có handler được đăng ký cho query

#### Implementation of

[`IQueryBus`](/libraries/common-application/Interface.IQueryBus.md).[`register`](/libraries/common-application/Interface.IQueryBus.md#register)
