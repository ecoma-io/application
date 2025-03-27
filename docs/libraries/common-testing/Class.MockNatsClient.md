# Class: MockNatsClient

Mock client cho NATS dùng cho unit test.

## Since

1.1.0

## Constructors

<a id="constructor"></a>

### Constructor

> **new MockNatsClient**(): `MockNatsClient`

#### Returns

`MockNatsClient`

## Methods

<a id="request"></a>

### request()

> **request**(`subject`, `data`): `Promise`\<`unknown`\>

Gửi request giả lập

#### Parameters

##### subject

`string`

##### data

`unknown`

#### Returns

`Promise`\<`unknown`\>

***

<a id="subscribe"></a>

### subscribe()

> **subscribe**(`subject`, `handler`): `void`

Đăng ký handler giả lập

#### Parameters

##### subject

`string`

##### handler

(`data`) => `void`

#### Returns

`void`
