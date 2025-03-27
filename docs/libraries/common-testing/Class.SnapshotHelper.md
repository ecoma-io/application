# Class: SnapshotHelper

Helper hỗ trợ snapshot testing.

## Since

1.1.0

## Constructors

<a id="constructor"></a>

### Constructor

> **new SnapshotHelper**(): `SnapshotHelper`

#### Returns

`SnapshotHelper`

## Methods

<a id="normalizeforsnapshot"></a>

### normalizeForSnapshot()

> `static` **normalizeForSnapshot**\<`T`\>(`obj`, `fieldsToExclude`): `Partial`\<`T`\>

Chuẩn hóa đối tượng trước khi so sánh với snapshot
Loại bỏ các trường không ổn định như timestamp, id ngẫu nhiên, v.v.

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Parameters

##### obj

`T`

Đối tượng cần chuẩn hóa

##### fieldsToExclude

`string`[] = `...`

Các trường cần loại bỏ

#### Returns

`Partial`\<`T`\>

Đối tượng đã được chuẩn hóa

***

<a id="tomatchinlinesnapshot"></a>

### toMatchInlineSnapshot()

> `static` **toMatchInlineSnapshot**\<`T`\>(`value`, `snapshot`): `void`

So sánh một đối tượng với snapshot inline

#### Type Parameters

##### T

`T`

#### Parameters

##### value

`T`

Giá trị cần so sánh với snapshot

##### snapshot

`string`

Snapshot inline

#### Returns

`void`

***

<a id="tomatchnormalizedsnapshot"></a>

### toMatchNormalizedSnapshot()

> `static` **toMatchNormalizedSnapshot**\<`T`\>(`value`, `fieldsToExclude`, `snapshotName?`): `void`

So sánh một đối tượng đã được chuẩn hóa với snapshot

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Parameters

##### value

`T`

Giá trị cần so sánh với snapshot

##### fieldsToExclude

`string`[] = `...`

Các trường cần loại bỏ trước khi so sánh

##### snapshotName?

`string`

Tên snapshot (tùy chọn)

#### Returns

`void`

***

<a id="tomatchsnapshot"></a>

### toMatchSnapshot()

> `static` **toMatchSnapshot**\<`T`\>(`value`, `snapshotName?`): `void`

So sánh một đối tượng với snapshot đã lưu

#### Type Parameters

##### T

`T`

#### Parameters

##### value

`T`

Giá trị cần so sánh với snapshot

##### snapshotName?

`string`

Tên snapshot (tùy chọn)

#### Returns

`void`
