# Interface: IQueryBus

IQueryBus

## Description

Định nghĩa hợp đồng cho Query Bus.
Query Bus chịu trách nhiệm gửi Query đến Query Handler tương ứng.

## Methods

<a id="execute"></a>

### execute()

> **execute**\<`TQuery`, `TResult`\>(`query`): `Awaitable`\<`TResult`\>

#### Type Parameters

##### TQuery

`TQuery` *extends* [`IQuery`](/libraries/common-application/Interface.IQuery.md)

##### TResult

`TResult` = `void`

#### Parameters

##### query

`TQuery`

Instance của Query cần thực thi.

#### Returns

`Awaitable`\<`TResult`\>

chứa kết quả (thường là DTO) từ Query Handler.

#### Method

execute

#### Description

Gửi một Query để được xử lý bởi Query Handler phù hợp.

#### Throws

Nếu không tìm thấy handler cho query

***

<a id="register"></a>

### register()

> **register**\<`TQuery`, `TResult`\>(`queryType`, `handler`): `void`

#### Type Parameters

##### TQuery

`TQuery` *extends* [`IQuery`](/libraries/common-application/Interface.IQuery.md)

##### TResult

`TResult` = `void`

#### Parameters

##### queryType

(...`args`) => `TQuery`

Loại query cần đăng ký handler

##### handler

[`IQueryHandler`](/libraries/common-application/Interface.IQueryHandler.md)\<`TQuery`, `TResult`\>

Query handler xử lý query

#### Returns

`void`

#### Method

register

#### Description

Đăng ký query handler cho một loại query cụ thể

#### Throws

Nếu đã có handler được đăng ký cho query này
