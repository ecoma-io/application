# Class: MockRabbitMQClient

Mock client cho RabbitMQ dùng cho unit test.

## Since

1.1.0

## Constructors

<a id="constructor"></a>

### Constructor

> **new MockRabbitMQClient**(): `MockRabbitMQClient`

#### Returns

`MockRabbitMQClient`

## Methods

<a id="consume"></a>

### consume()

> **consume**(`queue`, `handler`): `void`

Đăng ký consumer giả lập

#### Parameters

##### queue

`string`

##### handler

(`msg`) => `void`

#### Returns

`void`

***

<a id="publish"></a>

### publish()

> **publish**(`queue`, `message`): `Promise`\<`boolean`\>

Gửi message giả lập

#### Parameters

##### queue

`string`

##### message

`unknown`

#### Returns

`Promise`\<`boolean`\>
