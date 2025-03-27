# Class: CursorPagination

Utility class for cursor-based pagination

## Constructors

<a id="constructor"></a>

### Constructor

> **new CursorPagination**(): `CursorPagination`

#### Returns

`CursorPagination`

## Methods

<a id="buildquerywithcursor"></a>

### buildQueryWithCursor()

> `static` **buildQueryWithCursor**(`query`, `cursor`, `sortField`, `sortDirection`): `Record`\<`string`, `any`\>

Build MongoDB query with cursor conditions

#### Parameters

##### query

`Record`\<`string`, `any`\>

Original query

##### cursor

Cursor value (base64 encoded)

`undefined` | `string`

##### sortField

`string`

Sort field

##### sortDirection

Sort direction (1 for ASC, -1 for DESC)

`-1` | `1`

#### Returns

`Record`\<`string`, `any`\>

Modified query with cursor conditions

---

<a id="decodecursor"></a>

### decodeCursor()

> `static` **decodeCursor**(`cursor`): `null` \| \{ `field`: `string`; `value`: `any`; \}

Decode cursor data from base64 string

#### Parameters

##### cursor

`string`

Base64 encoded cursor

#### Returns

`null` \| \{ `field`: `string`; `value`: `any`; \}

Decoded cursor data or null if invalid

---

<a id="encodecursor"></a>

### encodeCursor()

> `static` **encodeCursor**(`field`, `value`): `string`

Encode cursor data to base64 string

#### Parameters

##### field

`string`

Field name used for cursor

##### value

`any`

Field value

#### Returns

`string`

Base64 encoded cursor
