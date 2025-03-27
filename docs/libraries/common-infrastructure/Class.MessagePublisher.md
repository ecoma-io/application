# Class: MessagePublisher

Publisher cho messages

## Constructors

<a id="constructor"></a>

### Constructor

> **new MessagePublisher**(`amqpConnection`): `MessagePublisher`

#### Parameters

##### amqpConnection

`AmqpConnection`

#### Returns

`MessagePublisher`

## Methods

<a id="publish"></a>

### publish()

> **publish**(`exchange`, `routingKey`, `message`): `Promise`\<`void`\>

Publish một message

#### Parameters

##### exchange

`string`

Exchange để gửi message

##### routingKey

`string`

Routing key của message

##### message

`unknown`

Message cần gửi

#### Returns

`Promise`\<`void`\>
