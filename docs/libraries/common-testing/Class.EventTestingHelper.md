# Class: EventTestingHelper

Helper hỗ trợ kiểm thử event/message.

## Since

1.1.0

## Constructors

<a id="constructor"></a>

### Constructor

> **new EventTestingHelper**(): `EventTestingHelper`

#### Returns

`EventTestingHelper`

## Methods

<a id="expecteventpublished"></a>

### expectEventPublished()

> `static` **expectEventPublished**(`publishSpy`, `eventType`, `expectedPayload?`): `void`

Kiểm tra xem một event có được publish với payload đúng không

#### Parameters

##### publishSpy

`SpyInstance`

Jest spy function trên phương thức publish

##### eventType

`string`

Loại event cần kiểm tra

##### expectedPayload?

`Record`\<`string`, `unknown`\>

Payload mong đợi (một phần hoặc toàn bộ)

#### Returns

`void`

***

<a id="expecteventpublishedtimes"></a>

### expectEventPublishedTimes()

> `static` **expectEventPublishedTimes**(`publishSpy`, `eventType`, `times`): `void`

Kiểm tra xem một event có được publish đúng số lần không

#### Parameters

##### publishSpy

`SpyInstance`

Jest spy function trên phương thức publish

##### eventType

`string`

Loại event cần kiểm tra

##### times

`number` = `1`

Số lần mong đợi (mặc định là ít nhất 1)

#### Returns

`void`

***

<a id="expecteventspublishedinorder"></a>

### expectEventsPublishedInOrder()

> `static` **expectEventsPublishedInOrder**(`publishSpy`, `events`): `void`

Kiểm tra xem một event có được publish với payload đúng thứ tự không

#### Parameters

##### publishSpy

`SpyInstance`

Jest spy function trên phương thức publish

##### events

\[`string`, `Record`\<`string`, `unknown`\>?\][]

Mảng các event cần kiểm tra theo thứ tự [eventType, payload]

#### Returns

`void`
