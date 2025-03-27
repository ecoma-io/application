# Class: RedisCacheStrategy

Strategy cho Redis cache

## Constructors

<a id="constructor"></a>

### Constructor

> **new RedisCacheStrategy**(`redisClient`): `RedisCacheStrategy`

#### Parameters

##### redisClient

`Redis`

#### Returns

`RedisCacheStrategy`

## Methods

<a id="del"></a>

### del()

> **del**(`key`): `Promise`\<`void`\>

Xóa giá trị khỏi cache

#### Parameters

##### key

`string`

Key của cache

#### Returns

`Promise`\<`void`\>

***

<a id="get"></a>

### get()

> **get**(`key`): `Promise`\<`null` \| `string`\>

Lấy giá trị từ cache

#### Parameters

##### key

`string`

Key của cache

#### Returns

`Promise`\<`null` \| `string`\>

Giá trị được cache hoặc null nếu không tồn tại

***

<a id="set"></a>

### set()

> **set**(`key`, `value`, `ttl?`): `Promise`\<`void`\>

Lưu giá trị vào cache

#### Parameters

##### key

`string`

Key của cache

##### value

`string`

Giá trị cần lưu

##### ttl?

`number`

Thời gian sống của cache (giây)

#### Returns

`Promise`\<`void`\>
