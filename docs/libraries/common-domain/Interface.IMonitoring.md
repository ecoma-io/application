# Interface: IMonitoring

Interface định nghĩa các phương thức giám sát hệ thống

## Methods

<a id="recordevent"></a>

### recordEvent()

> **recordEvent**(`name`, `data?`, `tags?`): `void`

Ghi nhận một event

#### Parameters

##### name

`string`

Tên event

##### data?

`Record`\<`string`, `unknown`\>

Dữ liệu event

##### tags?

`Record`\<`string`, `string`\>

Các tag bổ sung

#### Returns

`void`

***

<a id="recordexception"></a>

### recordException()

> **recordException**(`error`, `context?`, `tags?`): `void`

Ghi nhận một exception

#### Parameters

##### error

`Error`

Exception cần ghi nhận

##### context?

`Record`\<`string`, `unknown`\>

Context bổ sung

##### tags?

`Record`\<`string`, `string`\>

Các tag bổ sung

#### Returns

`void`

***

<a id="recordmetric"></a>

### recordMetric()

> **recordMetric**(`name`, `value`, `tags?`): `void`

Ghi nhận một metric

#### Parameters

##### name

`string`

Tên metric

##### value

`number`

Giá trị metric

##### tags?

`Record`\<`string`, `string`\>

Các tag bổ sung

#### Returns

`void`

***

<a id="recordtiming"></a>

### recordTiming()

> **recordTiming**\<`T`\>(`name`, `operation`, `tags?`): `Promise`\<`T`\>

Ghi nhận thời gian thực thi của một operation

#### Type Parameters

##### T

`T`

#### Parameters

##### name

`string`

Tên operation

##### operation

() => `Promise`\<`T`\>

Operation cần đo thời gian

##### tags?

`Record`\<`string`, `string`\>

Các tag bổ sung

#### Returns

`Promise`\<`T`\>

Kết quả của operation
