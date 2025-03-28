# Interface: IQueryHandler\<TQuery, TResult\>

IQueryHandler

## Description

Định nghĩa hợp đồng cho các lớp xử lý Query.
Mỗi Query Handler chịu trách nhiệm xử lý một loại Query cụ thể.

## Type Parameters

### TQuery

`TQuery` *extends* [`IQuery`](/libraries/common-application/Interface.IQuery.md)

Loại Query mà Handler này xử lý (phải kế thừa IQuery).

### TResult

`TResult`

Loại kết quả trả về sau khi xử lý Query (thường là DTO hoặc mảng DTO).

## Methods

<a id="handle"></a>

### handle()

> **handle**(`query`): `Awaitable`\<`TResult`\>

#### Parameters

##### query

`TQuery`

Instance của Query cần xử lý.

#### Returns

`Awaitable`\<`TResult`\>

Kết quả của quá trình xử lý (thường là Promise chứa DTO).

#### Method

handle

#### Description

Phương thức xử lý Query.
