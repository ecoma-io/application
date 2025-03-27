# Interface: ICursorBasedPaginatedResult\<T\>

Interface định nghĩa kết quả phân trang theo cursor

## Type Parameters

### T

`T`

## Properties

<a id="items"></a>

### items

> **items**: `T`[]

Danh sách bản ghi

***

<a id="limit"></a>

### limit

> **limit**: `number`

Số lượng bản ghi tối đa

***

<a id="nextcursor"></a>

### nextCursor?

> `optional` **nextCursor**: `string`

Cursor tiếp theo

***

<a id="prevcursor"></a>

### prevCursor?

> `optional` **prevCursor**: `string`

Cursor trước đó
